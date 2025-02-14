import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.post("/mark-read", protect, markAsRead);
router.delete("/:id", protect, deleteNotification);

export default router;
