import express from "express";
import { protect, requireVerification } from "../middleware/auth.middleware.js";
import {
  createPost,
  deletePost,
  updatePost,
  addComment,
  deleteComment,
  updateComment,
  replyToComment,
  deleteReply,
  repostPost,
  getFeedPosts,
  getUserPosts,
  getSinglePost,
  addReaction,
  removeReaction,
  addCommentReaction,
  removeCommentReaction,
  addReplyReaction,
  removeReplyReaction,
} from "../controllers/post.controller.js";
import { postUpload } from "../config/cloudinary.js";

const router = express.Router();

// Post CRUD
router.post(
  "/",
  protect,
  requireVerification,
  postUpload.array("media", 10),
  createPost
);
router.get("/feed", protect, requireVerification, getFeedPosts);
router.get("/user/:userId", protect, requireVerification, getUserPosts);
router.get("/:id", protect, requireVerification, getSinglePost);
router.put("/:id", protect, requireVerification, updatePost);
router.delete("/:id", protect, requireVerification, deletePost);

// Reactions
router.post("/:id/react", protect, requireVerification, addReaction);
router.post("/:id/unreact", protect, requireVerification, removeReaction);

// Comments
router.post("/:id/comment", protect, requireVerification, addComment);
router.put(
  "/:id/comment/:commentId",
  protect,
  requireVerification,
  updateComment
);
router.delete(
  "/:id/comment/:commentId",
  protect,
  requireVerification,
  deleteComment
);

// Comment Replies
router.post(
  "/:id/comment/:commentId/reply",
  protect,
  requireVerification,
  replyToComment
);
router.delete(
  "/:id/comment/:commentId/reply/:replyId",
  protect,
  requireVerification,
  deleteReply
);

// Reply Reactions
router.post(
  "/:id/comment/:commentId/reply/:replyId/react",
  protect,
  requireVerification,
  addReplyReaction
);
router.post(
  "/:id/comment/:commentId/reply/:replyId/unreact",
  protect,
  requireVerification,
  removeReplyReaction
);

// Repost
router.post("/:id/repost", protect, requireVerification, repostPost);

// Comment Reactions
router.post(
  "/:id/comment/:commentId/react",
  protect,
  requireVerification,
  addCommentReaction
);
router.post(
  "/:id/comment/:commentId/unreact",
  protect,
  requireVerification,
  removeCommentReaction
);

export default router;
