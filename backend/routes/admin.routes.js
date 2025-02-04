import express from "express";
import { protect, requireAdmin } from "../middleware/auth.middleware.js";
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

// Stats
router.get("/stats", protect, requireAdmin, getDashboardStats);

// User Management
router.get("/users", protect, requireAdmin, getAllUsers);
router.post("/users/:userId/ban", protect, requireAdmin, banUser);
router.post("/users/:userId/unban", protect, requireAdmin, unbanUser);
router.post("/users/:userId/role", protect, requireAdmin, changeUserRole);

// Post Moderation
router.get("/reported-posts", protect, requireAdmin, getReportedPosts);
router.post("/posts/:id/moderate", protect, requireAdmin, moderatePost);

export default router;
