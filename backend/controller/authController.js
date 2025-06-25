import User from "../models/user.js";
import HealthInfo from "../models/healthinfo.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateAccessToken = (user) => {
    return jwt.sign({ _id: user._id, role: user.role, fullName: user.fullName }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });
};
const generateRefreshToken = (user) => {
    return jwt.sign({ _id: user._id, role: user.role, fullName: user.fullName }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
};

const register = async (req, res) => {
    try {
        const { userInfo, healthInfo } = req.body;

        if (!userInfo || !healthInfo) {
            return res.status(400).json({ message: "Missing userInfo or healthInfo" });
        }

        const existingUser = await User.findOne({ email: userInfo.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(userInfo.password, 10);


        const newUser = new User({
            ...userInfo,
            password: hashedPassword,
            role: 'user'
        });
        await newUser.save();

        const newHealthInfo = new HealthInfo({
            ...healthInfo,
            user: newUser._id,
        });
        await newHealthInfo.save();

        return res.status(201).json({ message: "Registration successful" });
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ message: "Server error during registration" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ success: false, msg: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ success: false, msg: "Invalid credentials" });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const { password:_, ...userData } = user._doc;
        const healthInfo = await HealthInfo.findOne({ user: user._id });
        res
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 60 * 60 * 1000, // 1 Hr
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
            })
            .json({ success: true, msg: "Login successful", user: userData, healthInfo: healthInfo });
    }
    catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }

};

const logout = (req, res) => {
    res.clearCookie("accessToken").clearCookie("refreshToken").json({ success: true, msg: "Logged out" });
};

export { register, login, logout, generateAccessToken };
