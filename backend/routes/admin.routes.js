import express from "express";
import {
  protect,
  requireAdmin,
  requireModerator,
} from "../middleware/auth.middleware.js";
import {
  getDashboardStats,
  getAllUsers,
  banUser,
  unbanUser,
  changeUserRole,
} from "../controllers/admin.controller.js";
import {
  getReportedPosts,
  moderatePost,
} from "../controllers/moderation.controller.js";

const router = express.Router();

// Admin Only Routes
router.get("/stats", protect, requireAdmin, getDashboardStats);
router.get("/users", protect, requireAdmin, getAllUsers);
router.post("/users/:userId/ban", protect, requireAdmin, banUser);
router.post("/users/:userId/unban", protect, requireAdmin, unbanUser);
router.post("/users/:userId/role", protect, requireAdmin, changeUserRole);

// Moderator Routes (Both Admin and Moderator can access)
router.get("/reported-posts", protect, requireModerator, getReportedPosts);
router.post("/posts/:id/moderate", protect, requireModerator, moderatePost);

export default router;
