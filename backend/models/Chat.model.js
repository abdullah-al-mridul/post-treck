import mongoose from "mongoose";
import { emitUnread } from "../socket/socket-io.js";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    media: {
      type: String, // Cloudinary URL
    },
    messageType: {
      type: String,
      enum: ["text", "image", "text_with_image"],
      default: "text",
    },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // For WebSocket implementation later
    isTyping: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add validation
messageSchema.pre("save", function (next) {
  if (this.messageType === "text" && !this.content) {
    throw new Error("Content is required for text messages");
  }
  if (this.messageType === "image" && !this.media) {
    throw new Error("Media URL is required for image messages");
  }
  if (
    this.messageType === "text_with_image" &&
    (!this.content || !this.media)
  ) {
    throw new Error(
      "Both content and media are required for text with image messages"
    );
  }
  next();
});

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [messageSchema],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    unreadCount: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Update unreadCount when new message is added
chatSchema.pre("save", function (next) {
  if (!this.unreadCount) {
    this.unreadCount = {}; // Ensure unreadCount is always an object
  }

  if (this.isModified("messages") && this.messages.length > 0) {
    const lastMessage = this.messages[this.messages.length - 1];

    this.participants.forEach((participantId) => {
      const participantIdStr = participantId.toString();
      if (participantIdStr !== lastMessage.sender.toString()) {
        const currentCount = this.unreadCount[participantIdStr] || 0;
        this.unreadCount[participantIdStr] = currentCount + 1;
        console.log("emmiting unread");
        emitUnread("unread", this.unreadCount);
      }
    });

    this.markModified("unreadCount"); // Ensure MongoDB detects the change
    this.lastMessage = lastMessage._id;
  }
  next();
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
