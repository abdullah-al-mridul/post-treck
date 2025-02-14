import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "follow",
        "like",
        "comment",
        "reply",
        "mention",
        "post_like",
        "comment_like",
        "reply_like",
      ],
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post.comments",
    },
    reply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post.comments.replies",
    },
    read: {
      type: Boolean,
      default: false,
    },
    message: String,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
