import mongoose from "mongoose";

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
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  {
    timestamps: true,
  }
);

// Update unreadCount when new message is added
chatSchema.pre("save", function (next) {
  if (this.isModified("messages") && this.messages.length > 0) {
    // Check if messages array is not empty
    const lastMessage = this.messages[this.messages.length - 1];

    // Update unread count for all participants except sender
    this.participants.forEach((participantId) => {
      if (participantId.toString() !== lastMessage.sender.toString()) {
        const currentCount =
          this.unreadCount.get(participantId.toString()) || 0;
        this.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });

    // Update lastMessage reference
    this.lastMessage = lastMessage._id;
  }
  next();
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
