import express from "express";
import { protect } from "../middleware/auth.middleware.js";
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
router.get("/profile", protect, getProfile); // Get logged in user's profile
router.get("/profile/:id", protect, getUserProfile); // Get other user's profile
router.put("/profile", protect, upload.single("profilePic"), updateProfile);

// Social routes
router.post("/follow/:id", protect, followUser);
router.post("/unfollow/:id", protect, unfollowUser);
router.post("/friend-request/:id", protect, sendFriendRequest);
router.post("/accept-request/:id", protect, acceptFriendRequest);
router.get("/friends", protect, getFriends);

export default router;
