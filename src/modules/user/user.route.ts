import { isAuthenticated } from "./../../middlewares/isAuthenticated";
import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.get("/check-auth", isAuthenticated, UserController.checkAuth);
router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.post("/verify-email", UserController.VerifyEmail);
router.post("/forget-password", UserController.forgetPassword);
router.post("/reset-password/:token", UserController.resetPassword);
router.put("/profile/update", isAuthenticated, UserController.updateProfiles);

export const UserRouters = router;
