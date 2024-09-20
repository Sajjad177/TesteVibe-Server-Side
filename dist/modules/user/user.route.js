"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouters = void 0;
const isAuthenticated_1 = require("./../../middlewares/isAuthenticated");
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.get("/check-auth", isAuthenticated_1.isAuthenticated, user_controller_1.UserController.checkAuth);
router.post("/signup", user_controller_1.UserController.signup);
router.post("/login", user_controller_1.UserController.login);
router.post("/logout", user_controller_1.UserController.logout);
router.post("/verify-email", user_controller_1.UserController.VerifyEmail);
router.post("/forget-password", user_controller_1.UserController.forgetPassword);
router.post("/reset-password/:token", user_controller_1.UserController.resetPassword);
router.put("/profile/update", isAuthenticated_1.isAuthenticated, user_controller_1.UserController.updateProfiles);
exports.UserRouters = router;
