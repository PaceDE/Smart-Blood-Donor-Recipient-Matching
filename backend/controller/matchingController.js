// Convert degrees to radians
import HealthInfo from "../models/healthinfo.js";
import MatchingLog from "../models/matchinglog.js";
import RequestInfo from "../models/requestinfo.js";
import User from "../models/users.js";
import { vincenty } from "../utils/algorithm.js";



const getVincenty = (req, res) => {
    const { lat1, lon1, lat2, lon2 } = req.body;
    const distanceInMeters = vincenty(lat1, lon1, lat2, lon2);
    res.json({ distanceInMeters });
};


const matchedLog = async (req, res) => {
    try {
        const userId = req.user._id;
        const matchLogs = await MatchingLog.find({
            donor: userId,
            status: { $in: ['active', 'accepted'] }
        })
            .populate({
                path: 'request',
                populate: {
                    path: 'requester',
                    model: 'User',
                    select: '_id fullName phone address email'
                }
            });



        const incomingReq = matchLogs
            .filter(log => log.request && log.request.requester)
            .map(log => ({
                id: log._id,
                matchedAt: log.matchedAt,
                status: log.status,
                distance: log.distance,
                requestId: log.request._id,

                bloodType: log.request.bloodType,
                urgency: log.request.urgency,
                hospital: log.request.hospital,
                address: log.request.address,
                description: log.request.description,
                userId: log.request.requester._id,
                fullName: log.request.requester.fullName,
                phone: log.request.requester.phone,
                email: log.request.requester.email,
            }));
        res.status(200).json(incomingReq);
    } catch (err) {
        console.error('Error fetching matched logs:', err);
        res.status(500).json({ error: 'Server error' });
    }

}

const updateMatchLog = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate input
        const validStatuses = ['active', 'accepted', 'declined', 'donated', 'expired'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        // Find and update the MatchingLog
        const toUpdateLog = await MatchingLog.findById(
            id
        );
        const requestInfo = await RequestInfo.findById(toUpdateLog.request);
        if(requestInfo.status=='pending'){
            toUpdateLog.status=status;
        }
            
        if (!toUpdateLog) {
            return res.status(404).json({ error: 'Matching log not found' });
        }
        if (status == 'accepted') {
            toUpdateLog.notification_sent = false;
            toUpdateLog.read = false;
        }
        await toUpdateLog.save();

        res.status(200).json({ message: 'Status updated successfully' });
    } catch (err) {
        console.error("Error updating matching log:", err);
        res.status(500).json({ error: "Server error" });
    }
};

const acceptedLog = async (req, res) => {
    try {
        const { id } = req.params;

        const logs = await MatchingLog.find({
            request: id,
            status: 'accepted',
        })
            .populate({
                path: 'donor',
                model: 'User',
                select: '_id fullName phone address email'
            })

        const result = [];
        for (let log of logs) {
            const health = await HealthInfo.findOne({ user: log.donor._id });

            result.push({
                _id: log._id,
                distance: log.distance,
                donorId: log.donor._id,
                fullName: log.donor.fullName,
                donorBloodType: log.donorBloodType,
                phone: log.donor.phone,
                email: log.donor.email,
                address: log.donor.address,
                total_donations: health?.total_donations || 0,
                last_donation_date: health?.last_donation_date || null

            });
        }
        res.status(200).json({ message: "Accepted logs fetched successfully", logs: result });
    } catch (err) {
        console.error("Error fetching accepted matching log:", err);
        res.status(500).json({ error: "Server error" });
    }
};

const pendingNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const pendingLogs = await MatchingLog.find({ donor: userId, notification_sent: false, status: 'active' });
        const unreadCount = await MatchingLog.countDocuments({ donor: userId, read: false, status: 'active' });

        const requestInfo = await RequestInfo.findOne({ requester: userId, status:"pending" });
        let requestPendingLogs,requestUnreadCount;
        if(requestInfo)
        {
            requestPendingLogs=await MatchingLog.find({ request: requestInfo._id, notification_sent: false, status: 'accepted' });
            requestUnreadCount =await MatchingLog.countDocuments({ request: requestInfo._id, read: false, status: 'accepted' });
        }

        res.json({ pendingLogs, unreadCount,requestPendingLogs,requestUnreadCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const markNotification = async (req, res) => {
    try {
        const id = req.params.id;

        const log = await MatchingLog.findById(id);
        if (!log) {
            return res.status(404).json({ message: "Matching log not found" });
        }

        log.notification_sent = true;
        await log.save();

        res.json({ message: "Notification marked as sent" });
    } catch (err) {
        console.error("Error marking notification:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

const markLogRead = async (req, res) => {
    try {
        console.log("hahah")
        const id = req.user._id;
        const section = req.params.identifier;
        let log
        if (section == "donate") {
            log = await MatchingLog.updateMany({ donor: id, status: "active", read: false }, { read: true })
        }
        else if(section=="request") {
            const requestInfo = await RequestInfo.findOne({ requester: id, status:"pending" });
            if(requestInfo){
                log = await MatchingLog.updateMany({ request: requestInfo._id, status: "accepted", read: false }, { read: true })
            }
        }

        res.json({ message: "Log marked as Read" });
    } catch (err) {
        console.error("Error marking Log:", err);
        res.status(500).json({ message: 'Server error' });
    }
}


export { getVincenty, pendingNotifications, markNotification, matchedLog, updateMatchLog, acceptedLog, markLogRead };
