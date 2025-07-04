import express from "express";
const router = express.Router();
import { register,login,logout, updatePersonalInfo } from "../controller/authController.js";
import { verifyToken,fetchUser } from "../controller/authMiddleware.js";
import { getAppTrackingStats } from "../controller/trackingController.js";
import { currentRequest } from "../controller/requestController.js";
import { getVincenty,pendingNotifications,markNotification,matchedLog,updateMatchLog } from "../controller/matchingController.js";
import { createRequest,cancelRequest } from "../controller/requestController.js";

router.post("/register", register);
router.get('/auth-check',verifyToken, fetchUser);
router.post("/login", login);
router.post("/logout", logout);

router.put("/updatePersonalInfo",verifyToken,updatePersonalInfo);
router.get("/currentRequest",verifyToken,currentRequest);

router.get('/appTrackingStats',getAppTrackingStats);
router.get('/vincenty',getVincenty);
router.post('/request',verifyToken,createRequest);
router.get('/pendingNotifications',verifyToken,pendingNotifications)
router.post('/markNotification/:id',verifyToken, markNotification);
router.put('/cancelRequest/:id',verifyToken,cancelRequest)
router.get('/matchedLog',verifyToken,matchedLog)
router.patch('/updateMatchLog/:id',verifyToken,updateMatchLog)

export { router };
