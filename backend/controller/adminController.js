import User from "../models/users.js";
import RequestInfo from "../models/requestinfo.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};


export const getAllRequests = async (req, res) => {
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



export {getAllUsers};
