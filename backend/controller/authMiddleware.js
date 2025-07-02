import jwt from "jsonwebtoken";
import { generateAccessToken } from "./authController.js"
import User from "../models/users.js";
import HealthInfo from "../models/healthinfo.js";
import RequestInfo from "../models/requestinfo.js";
import DonationHistory from "../models/donationhistory.js";

/*const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).json({ msg: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ msg: "Forbidden" });
    }
};*/



const verifyToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    // No access token, try refresh token
    if (!refreshToken) return res.status(401).json({ success: false, msg: "No tokens provided" });

    try {
      const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      // Generate new access token
      const newAccessToken = generateAccessToken(decodedRefresh);

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 60 * 60 * 1000,
      });

      req.user = decodedRefresh;
      return next(); 
    } catch (err) {
      return res.status(403).json({ success: false, msg: "Invalid refresh token" });
    }
  }

  // Access token present, verify it
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    return next(); 
  } catch (err) {
    return res.status(403).json({ success: false, msg: "Invalid access token" });
  }
};

const fetchUser = async (req,res)=>{
      try {
    const user = await User.findById(req.user._id).select('-password');
    const healthInfo = await HealthInfo.findOne({ user: req.user._id });

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Count total donations and requests for this user
    const totalDonations = await DonationHistory.countDocuments({ donor: req.user._id });
    const totalRequests = await RequestInfo.countDocuments({ requester: req.user._id });

    res.json({
      success: true,
      user,
      healthInfo,
      totalDonations,
      totalRequests
    });
  } catch (err) {
    console.error("Auth check error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
} 

export { verifyToken,fetchUser };
