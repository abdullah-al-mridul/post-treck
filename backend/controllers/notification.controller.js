import Notification from "../models/Notification.model.js";

// Create Notification
export const createNotification = async ({
  recipient,
  sender,
  type,
  post,
  comment,
  reply,
  message,
}) => {
  try {
    // Don't create notification if sender is recipient
    if (recipient.toString() === sender.toString()) {
      return null;
    }

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      post,
      comment,
      reply,
      message,
    });

    // Here we'll add WebSocket notification later
    // socket.to(recipient).emit('new-notification', notification);

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

// Get User's Notifications
export const getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "name profilePic")
      .populate("post", "caption media")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({
      recipient: req.user._id,
    });

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.status(200).json({
      success: true,
      notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      },
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark Notifications as Read
export const markAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({
        success: false,
        message: "Please provide notification IDs",
      });
    }

    await Notification.updateMany(
      {
        _id: { $in: notificationIds },
        recipient: req.user._id,
      },
      {
        $set: { read: true },
      }
    );

    res.status(200).json({
      success: true,
      message: "Notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Notification
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
