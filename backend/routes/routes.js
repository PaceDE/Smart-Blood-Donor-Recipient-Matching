import express from "express";
const router = express.Router();
import { register,login,logout, updatePersonalInfo } from "../controller/authController.js";
import { verifyToken,fetchUser } from "../controller/authMiddleware.js";
import { getAppTrackingStats } from "../controller/trackingController.js";
import { currentRequest } from "../controller/requestController.js";

router.post("/register", register);
router.get('/auth-check',verifyToken, fetchUser);
router.post("/login", login);
router.post("/logout", logout);

router.put("/updatePersonalInfo",verifyToken,updatePersonalInfo);
router.get("/currentRequest",verifyToken,currentRequest);

router.get('/appTrackingStats',getAppTrackingStats);

export { router };
