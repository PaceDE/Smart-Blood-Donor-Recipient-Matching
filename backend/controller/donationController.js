import DonationHistory from "../models/donationhistory.js";
import HealthInfo from "../models/healthinfo.js";
import MatchingLog from "../models/matchinglog.js";
import Message from "../models/message.js";


const donationRecorded = async (req, res) => {
    try {
        const { logId, donor, recipient, review } = req.body;
        const log = await MatchingLog.findById(logId);
        if (!log) return res.status(404).json({ error: 'Matching log not found' });
        const newDonation = new DonationHistory({
            donor,
            recipient,
            review,
            request: log.request,
        })
        await newDonation.save();
        await Message.deleteMany({
            requestId: log.request
        })

        log.status = 'donated';
        await log.save();

        const userInfo = await HealthInfo.findOne({ user: donor });
        /*if (userInfo) {
            userInfo.total_donations = userInfo.total_donations + 1;
            userInfo.last_donation_date = Date.now();
            await userInfo.save();
        }*/

        res.status(201).json({ message: 'Donation recorded successfully' });

    } catch (err) {
        console.error("Donation complete error:", err);
        res.status(500).json({ error: 'Server error while recording donation' });

    }
};

export { donationRecorded };