import express from "express";
import { protect, requireVerification } from "../middleware/auth.middleware.js";
import {
  updateProfile,
  followUser,
  unfollowUser,
  sendFriendRequest,
  acceptFriendRequest,
  getFriends,
  getProfile,
  getUserProfile,
} from "../controllers/user.controller.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Profile routes
router.get("/profile", protect, getProfile); // No verification needed to view own profile
router.get("/profile/:id", protect, getUserProfile); // No verification needed to view others profile
router.put(
  "/profile",
  protect,
  requireVerification,
  upload.single("profilePic"),
  updateProfile
);

// Social routes - All require verification
router.post("/follow/:id", protect, requireVerification, followUser);
router.post("/unfollow/:id", protect, requireVerification, unfollowUser);
router.post(
  "/friend-request/:id",
  protect,
  requireVerification,
  sendFriendRequest
);
router.post(
  "/accept-request/:id",
  protect,
  requireVerification,
  acceptFriendRequest
);
router.get("/friends", protect, requireVerification, getFriends);

export default router;
