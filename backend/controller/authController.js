import User from "../models/users.js";
import HealthInfo from "../models/healthinfo.js";
import RequestInfo from "../models/requestinfo.js";
import DonationHistory from "../models/donationhistory.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS
    },
});

const generateAccessToken = (user) => {
    return jwt.sign({ _id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });
};
const generateRefreshToken = (user) => {
    return jwt.sign({ _id: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, {
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
        if (user.ban) {
            return res
                .status(400)
                .json({ success: false, msg: "You have been banned" });

        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ success: false, msg: "Invalid credentials" });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const { password: _, ...userData } = user._doc;
        const healthInfo = await HealthInfo.findOne({ user: user._id });
        const totalDonations = await DonationHistory.countDocuments({ donor: user._id });
        const totalRequests = await RequestInfo.countDocuments({ requester: user._id });

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
            .json({ success: true, msg: "Login successful", user: userData, healthInfo: healthInfo, totalDonations: totalDonations, totalRequests: totalRequests });
    }
    catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }

};

const logout = (req, res) => {
    res.clearCookie("accessToken").clearCookie("refreshToken").json({ success: true, msg: "Logged out" });
};

const updatePersonalInfo = async (req, res) => {
    try {

        const userId = req.user._id; // from verifyToken middleware
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true, runValidators: true }
        );


        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user: updatedUser });
    } catch (err) {

        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

const updateHealthInfo = async (req, res) => {
    try {
        const userId = req.user._id;
        const updates = req.body;
        const updatedInfo = await HealthInfo.findOneAndUpdate(
            { user: userId },
            { $set: updates },
            { new: true, runValidators: true }
        )
        if (!updatedInfo)
            return res.status(404).json({ message: "Healthinfo not found" });

        res.status(200).json({ healthInfo: updatedInfo });
    } catch (err) {
        console.error('Error updating healthinfo', err);
        res.status(500).json({ message: 'Server error' });
    }
}
const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const data = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const match = await bcrypt.compare(data.oldPassword, user.password);
        if (!match) {
            return res.status(400).json({ message: "Old password is incorrect. Please try again" })

        }
        const hashedPassword = await bcrypt.hash(data.password, 10);

        user.password = hashedPassword;
        if(user.forgotPassword)
            user.forgotPassword=false;
        await user.save();

        return res.status(200).json({ message: 'Password changed succesfully' })
    } catch (err) {
        console.error("Password change error:", err);
        return res.status(500).json({ message: "Server error while changing password" });
    }
}

const forgotPassword = async (req, res) => {
    try {

        const data = req.body;
        const user = await User.findOne({ email: data.email })

        if (!user)
            return res.status(200).json({ message: "Your password has been reset successfully if the provided information is correct. Please Check your registered email." })



        if (data.phone !== user.phone || data.dateOfBirth !== user.dateOfBirth.toISOString().split('T')[0])
            return res.status(200).json({ message: "Your password has been reset successfully if the provided information is correct. Please Check your registered email." })

        let password = '';

        for (let i = 0; i < 8; i++) {

            const isUpper = Math.random() < 0.5;
            const code = isUpper
                ? Math.floor(Math.random() * (90 - 65 + 1)) + 65
                : Math.floor(Math.random() * (122 - 97 + 1)) + 97;
            password += String.fromCharCode(code);
        }


        const info = await transporter.sendMail({
            from: '"BloodLink" <smartbloodlink@gmail.com>',
            to: user.email,
            subject: "BloodLink Password Reset",
            text: `Dear ${user.fullName},

Your password for BloodLink has been reset. Below are your new credentials:

Password: ${password}

Please change your password after login.

Regards,
BloodLink Team`,
            html: ` <p>Dear <b>${user.fullName}</b>,</p>
            <p>Your password for <b>BloodLink</b> has been reset. Below are your new credentials:</p>
            <p><b>Password:</b> ${password}</p>
            <p>Please change your password after login.</p>
            <p>Regards,<br/>BloodLink Team</p>`
        });



        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.forgotPassword = true;
        await user.save();



        return res.status(200).json({ message: "Your password has been reset successfully if the provided information is correct. Please Check your registered email." });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
}



export { register, login, logout, generateAccessToken, generateRefreshToken, updatePersonalInfo, updateHealthInfo, changePassword, forgotPassword };
