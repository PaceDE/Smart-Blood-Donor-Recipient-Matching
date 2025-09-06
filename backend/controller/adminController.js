import User from "../models/users.js";
import RequestInfo from "../models/requestinfo.js";
import MatchingLog from "../models/matchinglog.js";
import DonationHistory from "../models/donationhistory.js";
import HealthInfo from "../models/healthinfo.js";
import mongoose from "mongoose";
import Message from "../models/message.js";

/* Fetching */
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
        path: "requester",
        select: "-password",
      })
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch requests", error: err.message });
  }
};

const getAllMatchLog = async (req, res) => {
  try {
    const matchinglog = await MatchingLog.find()
      .populate({
        path: "request",
        select: "requester bloodType",
        populate: {
          path: "requester",
          select: "-password",
        },
      })
      .populate({
        path: "donor",
        select: "-password",
      })

      .sort({ createdAt: -1 });
    res.status(200).json(matchinglog);
  } catch (err) {
    console.error("Error fetching matchinglog:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch matchinglog", error: err.message });
  }
};

const getAllDonationHistory = async (req, res) => {
  try {
    const donationhistory = await DonationHistory.find()
      .populate({
        path: "donor",
        select: "-password",
      })
      .populate({
        path: "recipient",
        select: "-password",
      })
      .populate({
        path: "request",
        select: "bloodType",
      })
      .populate({
        path: "log",
      })

      .sort({ createdAt: -1 });

    res.status(200).json(donationhistory);
  } catch (err) {
    console.error("Error fetching donationhistory:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch donationhistory", error: err.message });
  }
};

/* Fetching end */

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await HealthInfo.findOne({ user: id }).populate({
      path: "user",
      select: "-password",
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
};

const deleteuserbyid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const id = req.params.id;
    console.log(id);

    await HealthInfo.deleteOne({ user: id }).session(session);
    await User.deleteOne({ _id: id }).session(session);

    const requests = await RequestInfo.find({ requester: id }).session(session);
    await RequestInfo.deleteMany({ requester: id }).session(session);

    const requestIds = requests.map((req) => req._id);

    if (requestIds.length>0){
      await MatchingLog.deleteMany({
      $or: [{ request: { $in: requestIds } }, { donor: id }],
    }).session(session)

    }

    await DonationHistory.deleteMany({
      $or: [{ donor: id }, { recipient: id }],
    }).session(session);

    await Message.deleteMany({
      requestId : {$in: requestIds},
    }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
};

const banuserbyid = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status; 

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (status == "1") {
      // Ban user
      user.ban = true;
      await user.save();

      const request = await RequestInfo.findOne({ requester: id, status: "pending" });
      if (request) {
        request.status = "canceled";
        await request.save();

        await MatchingLog.updateMany(
          { request: request._id, status: { $ne: "donated" } },
          { $set: { status: "expired" } }
        );

        await Message.deleteMany({ requestId: request._id });
      }
    } else {
      
      user.ban = false;
      await user.save();
    }

    res.status(200).json({ message: `User ${status == "1" ? "banned" : "unbanned"} successfully` });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
};



const deleterequestbyid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const requestId = req.params.id;

    const requestDoc = await RequestInfo.findById(requestId).session(session);
    if (!requestDoc) {
      throw new Error("Request not found");
    }

    await RequestInfo.deleteOne({ _id: requestId }).session(session);

    await MatchingLog.deleteMany({ request: requestId }).session(session);

    
      await DonationHistory.deleteMany({
       request:requestId
      }).session(session);
    

    await Message.deleteMany({
      requestId:requestId
    }).session(session)

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Request and related data deleted successfully" });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: "Error deleting request", error: err.message });
  }
};



const test = async (req, res) => {
  await User.updateMany(
    { ban: { $exists: false } }, // only those missing the field
    { $set: { ban: false } }
  );
};

export {
  getAllUsers,
  getAllRequests,
  getAllMatchLog,
  getAllDonationHistory,
  getUserById,
  test,
  deleteuserbyid,
  banuserbyid,
  deleterequestbyid,
};
