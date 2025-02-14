import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { chatUpload } from "../config/cloudinary.js";
import {
  getOrCreateChat,
  sendMessage,
  markAsRead,
  getUserChats,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/user/:participantId", protect, getOrCreateChat);
router.get("/", protect, getUserChats);
router.post(
  "/:chatId/message",
  protect,
  chatUpload.single("media"),
  sendMessage
);
router.post("/:chatId/read", protect, markAsRead);

export default router;
