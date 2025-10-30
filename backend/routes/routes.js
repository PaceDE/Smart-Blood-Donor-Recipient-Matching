import express from "express";
const router = express.Router();
import { register,login,logout, updatePersonalInfo,updateHealthInfo,changePassword, forgotPassword} from "../controller/authController.js";
import { verifyToken,fetchUser } from "../controller/authMiddleware.js";
import { getAppTrackingStats } from "../controller/trackingController.js";
import { currentRequest } from "../controller/requestController.js";
import { getVincenty,pendingNotifications,markNotification,matchedLog,updateMatchLog,acceptedLog, markLogRead } from "../controller/matchingController.js";
import { createRequest,updateRequest } from "../controller/requestController.js";
import { getMessages,messageRead,messageNotification } from "../controller/messageController.js";
import { donationRecorded, userhistory, userReview } from "../controller/donationController.js";
import { getAllRequests, getAllUsers,getAllMatchLog, getAllDonationHistory,getUserById,deleteuserbyid,banuserbyid, deleterequestbyid, deletelogbyid,deletedonationbyid,test, getAllEventData, exportCSV, deleteEventdata } from "../controller/adminController.js";

router.post("/register", register);
router.get('/auth-check',verifyToken, fetchUser);
router.post("/login", login);
router.post("/logout", logout);

router.put("/updatePersonalInfo",verifyToken,updatePersonalInfo);
router.put("/updateHealthInfo",verifyToken,updateHealthInfo);
router.put("/changePassword",verifyToken,changePassword);

router.get("/currentRequest",verifyToken,currentRequest);

router.get('/appTrackingStats',getAppTrackingStats);
router.get('/vincenty',getVincenty);
router.post('/request/:id',verifyToken,createRequest);

router.put('/updateRequest/:id',verifyToken,updateRequest)
router.get('/matchedLog',verifyToken,matchedLog)
router.patch('/updateMatchLog/:id',verifyToken,updateMatchLog)
router.get('/acceptedLog/:id',verifyToken,acceptedLog)

router.get('/getMessages',verifyToken,getMessages)

router.put('/messageRead',verifyToken,messageRead)
router.put('/messageNotification',verifyToken,messageNotification)

router.get('/pendingNotifications',verifyToken,pendingNotifications)
router.put('/markNotification/:id',verifyToken, markNotification);

router.put('/markLogRead/:identifier',verifyToken,markLogRead)

router.post('/donationRecorded',verifyToken,donationRecorded);

router.get('/getuserhistory/:id',verifyToken,userhistory);
router.get('/getuserreviews/:id',verifyToken,userReview);

// Admin Routes
router.get('/getallusers',verifyToken,getAllUsers);

router.get('/getallrequests',verifyToken,getAllRequests);

router.get('/getallmatchlog',verifyToken,getAllMatchLog);

router.get('/getalldonationhistory',verifyToken,getAllDonationHistory);

router.get('/getuserbyid/:id',verifyToken,getUserById)

router.delete('/deleteuserbyid/:id',verifyToken,deleteuserbyid)

router.put('/banuserbyid/:id/:status',verifyToken,banuserbyid);

router.delete('/deleterequestbyid/:id',verifyToken,deleterequestbyid);

router.delete('/deletelogbyid/:id',verifyToken,deletelogbyid);

router.delete('/deletedonationbyid/:id',verifyToken,deletedonationbyid);

router.post('/forgotpassword',forgotPassword);

router.get('/getalleventData',verifyToken,getAllEventData);

router.post('/exportCSV/:id',verifyToken,exportCSV)

router.delete('/deleteeventdata',verifyToken,deleteEventdata);
router.put('/test',test)



export { router };

