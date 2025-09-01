import User from "../models/users.js";
import RequestInfo from "../models/requestinfo.js";
import MatchingLog from "../models/matchinglog.js";
import DonationHistory from "../models/donationhistory.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};


const getAllRequests = async (req, res) => {
  try {
    const requests = await RequestInfo.find()
      .populate({
        path:"requester",
        select:"-password"
      }) 
      .sort({ createdAt: -1 }); 
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ message: "Failed to fetch requests", error: err.message });
  }
};

const getAllMatchLog = async (req, res) => {
  try {
    const matchinglog = await MatchingLog.find()
      .populate({
        path:"request",
        select:"requester bloodType",
        populate:{
          path:"requester",
          select:"-password"
        }
      }) 
      .populate({
        path:"donor",
        select:"-password"  
      })

      .sort({ createdAt: -1 }); 
    res.status(200).json(matchinglog);
  } catch (err) {
    console.error("Error fetching matchinglog:", err);
    res.status(500).json({ message: "Failed to fetch matchinglog", error: err.message });
  }
};

const getAllDonationHistory = async (req, res) => {
  try {
    const donationhistory = await DonationHistory.find()
      .populate({
        path:"donor",
        select:"-password"
        
        
      }) 
      .populate({
        path:"recipient",
        select:"-password"
      })
      .populate({
        path:"request",
        select:"bloodType"
      })
      .populate({
        path:"matchinglog",
       
      })

      .sort({ createdAt: -1 }); 
    res.status(200).json(donationhistory);
  } catch (err) {
    console.error("Error fetching donationhistory:", err);
    res.status(500).json({ message: "Failed to fetch donationhistory", error: err.message });
  }
};


export {getAllUsers,getAllRequests,getAllMatchLog,getAllDonationHistory};
