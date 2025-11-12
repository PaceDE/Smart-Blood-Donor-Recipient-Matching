import priors from "../../ml_model/priors.json" with {type: 'json'};
import freqLikelihood from '../../ml_model/frequency_likelihood.json' with { type: "json" };
import recencyLikelihood from '../../ml_model/recency_likelihood.json' with { type: "json" };

const toRadians = (deg) => (deg * Math.PI) / 180;



function vincenty(lat1, lon1, lat2, lon2, searchDistance) {
    // Earth's ellipsoid parameters (WGS-84)
    const a = 6378137.0;          // semi-major axis in meters
    const f = 1 / 298.257223563;  // flattening
    const b = (1 - f) * a;        // semi-minor axis

   
    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const lonDiff = toRadians(lon2 - lon1);

    // Reduced latitudes
    const reducedLat1 = Math.atan((1 - f) * Math.tan(phi1));
    const reducedLat2 = Math.atan((1 - f) * Math.tan(phi2));
    const cosLat1 = Math.cos(reducedLat1);
    const cosLat2 = Math.cos(reducedLat2);
    const sinLat1 = Math.sin(reducedLat1);
    const sinLat2 = Math.sin(reducedLat2);

    let lambda = lonDiff;
    let prevLambda, sinSigma, cosSigma, sigma, sinAlpha, cos2Alpha, cos2SigmaMid;
    let iterations = 0;

    do {
        const sinLambda = Math.sin(lambda);
        const cosLambda = Math.cos(lambda);

        //angular distance sigma
        sinSigma = Math.sqrt(
            Math.pow(cosLat2 * sinLambda, 2) +
            Math.pow(cosLat1 * sinLat2 -
                sinLat1 * cosLat2 * cosLambda, 2)
        );

        if (sinSigma === 0) return 0;  // coincident points

        cosSigma = sinLat1 * sinLat2 +
            cosLat1 * cosLat2 * cosLambda;
        sigma = Math.atan2(sinSigma, cosSigma);

        // azimuth
        sinAlpha = (cosLat1 * cosLat2 * sinLambda) / sinSigma;
        cos2Alpha = 1 - Math.pow(sinAlpha, 2);

        // Correction for ellipsoidal shape

        cos2SigmaMid = (cos2Alpha !== 0) ?
            cosSigma - (2 * sinLat1 * sinLat2) / cos2Alpha
            : 0;

        const C = (f / 16) * cos2Alpha * (4 + f * (4 - 3 * cos2Alpha));
        prevLambda = lambda;

        // Update lambda
        lambda = lonDiff + (1 - C) * f * sinAlpha * (sigma + C * sinSigma *
            (cos2SigmaMid + C * cosSigma * (-1 + 2 * Math.pow(cos2SigmaMid, 2))));

    } while (Math.abs(lambda - prevLambda) > 1e-12 && ++iterations < 1000);

   
    const uSquared = (cos2Alpha * (Math.pow(a, 2) - Math.pow(b, 2))) / Math.pow(b, 2);
    const A = 1 + (uSquared / 16384) * (4096 + uSquared * (-768 + uSquared * (320 - 175 * uSquared)));
    const B = (uSquared / 1024) * (256 + uSquared * (-128 + uSquared * (74 - 47 * uSquared)));

    const deltaSigma = B * sinSigma * (cos2SigmaMid + (B / 4) *
        (cosSigma * (-1 + 2 * Math.pow(cos2SigmaMid, 2)) - (B / 6) * cos2SigmaMid *
            (-3 + 4 * Math.pow(sinSigma, 2)) * (-3 + 4 * Math.pow(cos2SigmaMid, 2))));

    const distanceMeters = b * A * (sigma - deltaSigma);
    return distanceMeters / 1000;
}

const isEligibleDonor = (healthInfo, today = new Date()) => {
    const user = healthInfo.user;

    if (!user) return false;

   
    const dob = new Date(user.dateOfBirth);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    const isAgeValid = age >= 18 && age <= 65;
    const isWeightValid = healthInfo.weight_kg >= 50;

    const lastDonationDate = healthInfo.last_donation_date ? new Date(healthInfo.last_donation_date) : null;
    const lastDonationValid = !lastDonationDate || (today - lastDonationDate) >= 1000 * 60 * 60 * 24 * 60; // ≥ 60 days

    const gaveBirthDate = healthInfo.recently_gave_birth ? new Date(healthInfo.recently_gave_birth) : null;
    const gaveBirthValid = !gaveBirthDate || (today - gaveBirthDate) >= 1000 * 60 * 60 * 24 * 30 * 9; // ≥ 9 months

    const piercingDate = healthInfo.recent_piercing_or_tattoo ? new Date(healthInfo.recent_piercing_or_tattoo) : null;
    const piercingValid = !piercingDate || (today - piercingDate) >= 1000 * 60 * 60 * 24 * 30 * 6; // ≥ 6 months

    const noDisease = !healthInfo.has_disease;

    return isAgeValid && isWeightValid && lastDonationValid && gaveBirthValid && piercingValid && noDisease;
};


const predict = (totalDonations, lastDonationDate, willingness) => {
    const today = new Date();
    const lastDate = new Date(lastDonationDate);

    const dayDiff = (today - lastDate) / (24 * 60 * 60 * 1000);
    const monthsDiff = Math.floor(dayDiff / 30);


    let frequencyCategory;
    if (totalDonations <= 2) frequencyCategory = "Rare";
    else if (totalDonations <= 8) frequencyCategory = "Occasional";
    else if (totalDonations <= 18) frequencyCategory = "Regualr";
    else if (totalDonations <= 25) frequencyCategory = "Active";
    else frequencyCategory = "Veteran";

   
    let recencyCategory;
    if (monthsDiff <= 4) recencyCategory = "VeryRecent";
    else if (monthsDiff <= 7) recencyCategory = "Recent";
    else if (monthsDiff <= 12) recencyCategory = "Moderate";
    else recencyCategory = "LongAgo";

   
    const epsilon = 1e-6;
    const joints = {};

    for (const cls of ["0", "1"]) {
        let joint = priors[cls];
        joint *= recencyLikelihood[cls][recencyCategory] ?? epsilon;
        joint *= freqLikelihood[cls][frequencyCategory] ?? epsilon;
        joints[cls] = joint;
    }
    const marginal = (joints[0] + joints[1])

    const prob1 = joints[1] / marginal;

   
    const thresholdMap = {
        1: 0.5 - (1-3)*0.06,
        2: 0.5 - (2-3)*0.06,
        3: 0.5 - (3-3)*0.06,
        4: 0.5 - (4-3)*0.06,
        5: 0.5 - (5-3)*0.06,
    };

    const threshold = thresholdMap[willingness] ?? 0.5;

    return [prob1, threshold];
}

export { vincenty, isEligibleDonor, predict};