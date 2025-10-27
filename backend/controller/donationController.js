import DonationHistory from "../models/donationhistory.js";
import HealthInfo from "../models/healthinfo.js";
import MatchingLog from "../models/matchinglog.js";
import Message from "../models/message.js";
import User from "../models/users.js";


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
            log: logId
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

const userhistory = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        const healthinfo = await HealthInfo.findOne({ user: id });
        const reqUser = {
            fullName: user.fullName,
            total_donations: healthinfo.total_donations,
            last_donation_date: healthinfo.last_donation_date,
            willingness_level: healthinfo.willingness_level,
        }

        res.status(200).json(reqUser);

    } catch (error) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Server error" });

    }

}
const userReview = async (req, res) => {
    try {
        const id = req.params.id;
        const reviewReceived = await DonationHistory.find({ donor: id })
            .select('recipient review donatedAt')
            .populate({
                path: 'recipient',
                select: 'fullName'
            });
        const reviewGiven = await DonationHistory.find({ recipient: id })
            .select('donor review donatedAt')
            .populate({
                path: 'donor',
                select: 'fullName'
            });
       
        res.status(200).json({reviewReceived:reviewReceived, reviewGiven:reviewGiven});

    } catch (error) {
        console.error("Error fetching data", err);
        res.status(500).json({ error: "Server error" });

    }

}

export { donationRecorded, userhistory,userReview };