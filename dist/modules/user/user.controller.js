"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("./user.model");
const crypto_1 = __importDefault(require("crypto"));
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const generateVerificationCode_1 = require("../../utils/generateVerificationCode");
const generateToken_1 = require("../../utils/generateToken");
const email_1 = require("../../mailtrap/email");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, contact } = req.body;
        // Check if the user already exists
        let user = yield user_model_1.User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "user already exist",
            });
        }
        // Hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        //Verification token
        const verificationToken = (0, generateVerificationCode_1.generateVerificationCode)();
        // Create new user :
        user = yield user_model_1.User.create({
            fullName,
            email,
            password: hashedPassword,
            contact: Number(),
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });
        (0, generateToken_1.generateToken)(res, user);
        //sending email verification
        yield (0, email_1.sendVerificationEmail)(email, verificationToken);
        const userWithoutPassword = yield user_model_1.User.findOne({ email }).select("-password");
        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "InCorrect email or password",
            });
        }
        //Password matching :
        const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "InCorrect email or password",
            });
        }
        (0, generateToken_1.generateToken)(res, user);
        user.lastLogin = new Date();
        yield user.save();
        //send user without password :
        const userWithoutPassword = yield user_model_1.User.findOne({ email }).select("-password");
        return res.status(200).json({
            success: true,
            message: `Welcome Back ${user.fullName}`,
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
const VerifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { verificationCode } = req.body;
        const user = yield user_model_1.User.findOne({
            verificationToken: verificationCode,
            verificationTokenExpiresAt: { $gt: Date.now() },
        }).select("-password");
        //Checking user :
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        yield user.save();
        //send welcome email :
        yield (0, email_1.sendWelcomeEmail)(user.email, user.fullName);
        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.clearCookie("token").status(200).json({
            success: true,
            message: "Logout successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_model_1.User.findOne({ email });
        //checking user :
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user doesn't exist",
            });
        }
        const resetToken = crypto_1.default.randomBytes(40).toString("hex");
        const resetTokenExpireAt = new Date(Date.now() + 1 * 60 * 60 * 1000); //1 hour
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpireAt;
        yield user.save();
        //send email :
        yield (0, email_1.sendPasswordResetEmail)(user.email, `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`);
        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email",
            user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = yield user_model_1.User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: { $gt: Date.now() },
        });
        //checking user
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }
        // update password :
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        yield user.save();
        //send success reset email
        yield (0, email_1.sendResetSuccessEmail)(user.email);
        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
const checkAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const user = yield user_model_1.User.findById(userId).select("-password");
        //checking user
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
const updateProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { fullName, email, address, city, country, profilePic } = req.body;
        // upload image on cloudinary
        let cloudResponse;
        cloudResponse = yield cloudinary_1.default.uploader.upload(profilePic);
        const updateData = { fullName, email, address, city, country, profilePic };
        const user = yield user_model_1.User.findByIdAndUpdate(userId, updateData, {
            new: true,
        }).select("-password");
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.UserController = {
    signup,
    login,
    VerifyEmail,
    logout,
    forgetPassword,
    resetPassword,
    checkAuth,
    updateProfiles,
};
