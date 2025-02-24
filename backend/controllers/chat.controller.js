import Chat from "../models/Chat.model.js";
import User from "../models/User.model.js";
import { emitMessage } from "../socket/socket-io.js";
// Get or Create Chat
export const getOrCreateChat = async (req, res) => {
  try {
    const { participantId } = req.params;

    // Validate participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find existing chat
    let chat = await Chat.findOne({
      participants: {
        $all: [req.user._id, participantId],
      },
    })
      .populate("participants", "name email profilePic role")
      .populate({
        path: "messages",
        populate: [
          {
            path: "sender",
            select: "name email profilePic",
          },
          {
            path: "readBy.user",
            select: "name email profilePic",
          },
        ],
      });

    // Create new chat if doesn't exist
    if (!chat) {
      chat = await Chat.create({
        participants: [req.user._id, participantId],
        messages: [],
        unreadCount: {},
      });
      await chat.populate([
        {
          path: "participants",
          select: "name email profilePic",
        },
      ]);
    }

    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Send Message (Updated to handle text with image)
export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, messageType } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Check if user is participant
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this chat",
      });
    }

    // Initialize message object
    const message = {
      sender: req.user._id,
      messageType: messageType || "text",
      readBy: [{ user: req.user._id }],
    };

    // Handle different message types
    switch (messageType) {
      case "image":
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: "Image file is required",
          });
        }
        message.media = req.file.path;
        break;

      case "text_with_image":
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: "Image file is required",
          });
        }
        if (!content || content.trim() === "") {
          return res.status(400).json({
            success: false,
            message: "Message content is required",
          });
        }
        message.media = req.file.path;
        message.content = content.trim();
        break;

      default: // text message
        if (!content || content.trim() === "") {
          return res.status(400).json({
            success: false,
            message: "Message content is required",
          });
        }
        message.content = content.trim();
    }

    chat.messages.push(message);
    await chat.save();

    // Populate sender details
    await chat.populate("messages.sender", "name email profilePic");

    // Here we'll add WebSocket notification later
    // socket.emit('new-message', { chatId, message });
    let socketRes = chat.messages[chat.messages.length - 1];
    emitMessage("new-message", socketRes);
    res.status(200).json({
      success: true,
      message: socketRes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark Messages as Read
export const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Check if user is participant
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this chat",
      });
    }

    // Mark all messages as read
    chat.messages.forEach((message) => {
      if (
        !message.readBy.some(
          (read) => read.user.toString() === req.user._id.toString()
        )
      ) {
        message.readBy.push({
          user: req.user._id,
          readAt: new Date(),
        });
      }
    });

    // Reset unread count for this user
    chat.unreadCount[req.user._id.toString()] = 0;

    chat.markModified("unreadCount");

    await chat.save();

    res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get User's Chats
export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
    })
      .populate("participants", "name email profilePic role")
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 }, // Get only last message
        populate: {
          path: "sender",
          select: "name email profilePic",
        },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
