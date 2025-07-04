// Convert degrees to radians
const toRadians = (deg) => deg * (Math.PI / 180);

function vincenty(lat1, lon1, lat2, lon2,searchDistance) {
    // Earth's ellipsoid parameters (WGS-84)
    const a = 6378137.0;          // semi-major axis in meters
    const f = 1 / 298.257223563;  // flattening
    const b = (1 - f) * a;        // semi-minor axis

    // Convert coordinates to radians
    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const lonDiff = toRadians(lon2 - lon1);

    // Reduced latitudes
    const reducedLat1 = Math.atan((1 - f) * Math.tan(phi1));
    const reducedLat2 = Math.atan((1 - f) * Math.tan(phi2));

    let lambda = lonDiff;
    let prevLambda, sinSigma, cosSigma, sigma, sinAlpha, cos2Alpha, cos2SigmaMid;
    let iterations = 0;

    do {
        const sinLambda = Math.sin(lambda);
        const cosLambda = Math.cos(lambda);

        // Calculate angular distance sigma
        sinSigma = Math.sqrt(
            Math.pow(Math.cos(reducedLat2) * sinLambda, 2) +
            Math.pow(Math.cos(reducedLat1) * Math.sin(reducedLat2) - 
            Math.sin(reducedLat1) * Math.cos(reducedLat2) * cosLambda, 2)
        );

        if (sinSigma === 0) return 0;  // coincident points

        cosSigma = Math.sin(reducedLat1) * Math.sin(reducedLat2) + 
                  Math.cos(reducedLat1) * Math.cos(reducedLat2) * cosLambda;
        sigma = Math.atan2(sinSigma, cosSigma);

        // Calculate azimuth
        sinAlpha = (Math.cos(reducedLat1) * Math.cos(reducedLat2) * sinLambda) / sinSigma;
        cos2Alpha = 1 - Math.pow(sinAlpha, 2);

        // Correction for ellipsoidal shape
        cos2SigmaMid = cosSigma - (2 * Math.sin(reducedLat1) * Math.sin(reducedLat2)) / cos2Alpha;

        const C = (f / 16) * cos2Alpha * (4 + f * (4 - 3 * cos2Alpha));
        prevLambda = lambda;

        // Update lambda
        lambda = lonDiff + (1 - C) * f * sinAlpha * (sigma + C * sinSigma * 
               (cos2SigmaMid + C * cosSigma * (-1 + 2 * Math.pow(cos2SigmaMid, 2))));

    } while (Math.abs(lambda - prevLambda) > 1e-12 && ++iterations < 1000);

    // Final distance calculation
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

    // Calculate age
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


const getVincenty = (req, res) => {
  const { lat1, lon1, lat2, lon2 } = req.body;
  const distanceInMeters = vincenty(lat1, lon1, lat2, lon2);
  res.json({ distanceInMeters });
};

export { getVincenty , vincenty, isEligibleDonor};
