import express from "express";
const router = express.Router();
import { register,login,logout } from "../controller/authController.js";
import { verifyToken,fetchUser } from "../controller/authMiddleware.js";

router.post("/register", register);
router.get('/auth-check',verifyToken, fetchUser);
router.post("/login", login);
router.post("/logout", logout);

export { router };
