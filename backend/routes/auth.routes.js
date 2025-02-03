import express from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  sendVerificationCode,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.post("/send-verification-code", protect, sendVerificationCode);
router.post("/verify-email", protect, verifyEmail);

export default router;
