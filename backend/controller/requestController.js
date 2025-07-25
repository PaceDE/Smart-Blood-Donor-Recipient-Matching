
import HealthInfo from "../models/healthinfo.js";
import RequestInfo from "../models/requestinfo.js";
import { vincenty,isEligibleDonor,predict } from "../utils/algorithm.js";
import MatchingLog from "../models/matchinglog.js";


const currentRequest = async (req, res) => {
    const request = await RequestInfo.findOne({
        requester: req.user._id,
        status: 'pending'
    })
   
    res.json(request || null);
}

const createRequest = async (req, res) => {
    try {
        const { requestInfo } = req.body;
        const id = req.params.id;

        if (!requestInfo) {
            return res.status(400).json({ message: "Missing data" });
        }
        
        const bloodType = requestInfo.bloodType;
        const requesterId = req.user._id;


        const matched = await HealthInfo.find().populate({
            path: 'user',
            match: {
                bloodType: bloodType,
                _id: { $ne: requesterId }
            },
            select: '-password'
        })
        const validMatches = matched.filter(h => h.user !== null);

        const today = new Date();
        const eligibleDonors = validMatches.filter(h => isEligibleDonor(h, today));
        let willingDonors;
        if(id==1)
        {
            willingDonors= eligibleDonors.filter(d => predict(d.total_donations, d.last_donation_date,d.willingness_level));
        }
        else
        {
            willingDonors = eligibleDonors;
        }
        const nearbyDonors = willingDonors
            .map(donor => {
                const distance = vincenty(
                    requestInfo.latitude,
                    requestInfo.longitude,
                    donor.user.latitude,
                    donor.user.longitude
                );
                return { donor, distance: distance.toFixed(2) };
            })
            .filter(entry => entry.distance <= requestInfo.searchDistance);
       

        const request = new RequestInfo({ ...requestInfo, requester: req.user._id,matchedCount:nearbyDonors.length })
        await request.save();

        for (const entry of nearbyDonors) {
            const log = new MatchingLog({
                request: request._id,
                donor: entry.donor.user._id,
                distance: entry.distance,
        
            });
            await log.save();
        }

        res.status(201).json({ message: "Blood request created successfully." })
    }
    catch (err) {
        console.error("Error creating blood request:", err);
        res.status(500).json({ message: "Server error while creating request." });
    }

};

const updateRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;

    if (!["canceled", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    const request = await RequestInfo.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Update the request status
    request.status = status;
    await request.save();

    // Matching Log will be expired
    await MatchingLog.updateMany(
      { request: requestId },
      { $set: { status: 'expired' } }
    );

    res.json({ message: `Request marked as ${status} and matching logs updated.` });

  } catch (err) {
    console.error("Error updating request:", err);
    res.status(500).json({ message: "Server error while updating request" });
  }
};





export { currentRequest, createRequest, updateRequest };