import express from "express";
const router = express.Router();
import { register,login,logout, updatePersonalInfo } from "../controller/authController.js";
import { verifyToken,fetchUser } from "../controller/authMiddleware.js";
import { getAppTrackingStats } from "../controller/trackingController.js";
import { currentRequest } from "../controller/requestController.js";
import { getVincenty,pendingNotifications,markNotification,matchedLog,updateMatchLog,acceptedLog } from "../controller/matchingController.js";
import { createRequest,updateRequest } from "../controller/requestController.js";
import { getMessages } from "../controller/messageController.js";

router.post("/register", register);
router.get('/auth-check',verifyToken, fetchUser);
router.post("/login", login);
router.post("/logout", logout);

router.put("/updatePersonalInfo",verifyToken,updatePersonalInfo);
router.get("/currentRequest",verifyToken,currentRequest);

router.get('/appTrackingStats',getAppTrackingStats);
router.get('/vincenty',getVincenty);
router.post('/request/:id',verifyToken,createRequest);
router.get('/pendingNotifications',verifyToken,pendingNotifications)
router.post('/markNotification/:id',verifyToken, markNotification);
router.put('/updateRequest/:id',verifyToken,updateRequest)
router.get('/matchedLog',verifyToken,matchedLog)
router.patch('/updateMatchLog/:id',verifyToken,updateMatchLog)
router.get('/acceptedLog/:id',verifyToken,acceptedLog)

router.get('/getMessages',verifyToken,getMessages)

export { router };
