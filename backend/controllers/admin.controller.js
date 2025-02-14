import User from "../models/User.model.js";
import Post from "../models/Post.model.js";

// Get Admin Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const stats = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBanned: true }),
      Post.countDocuments(),
      Post.countDocuments({ isReported: true }),
      User.countDocuments({
        lastActive: { $gte: twentyFourHoursAgo },
      }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: stats[0],
        bannedUsers: stats[1],
        totalPosts: stats[2],
        reportedPosts: stats[3],
        activeUsers24h: stats[4],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Users with Pagination
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await User.countDocuments({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Ban User
export const banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findById(userId);
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Ban reason is required",
      });
    }

    if (reason.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Ban reason must be at least 10 characters long",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot ban an admin",
      });
    }

    user.isBanned = true;
    user.banReason = reason;
    user.bannedBy = req.user._id;
    user.bannedAt = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: "User banned successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Unban User
export const unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBanned = false;
    user.banReason = undefined;
    user.bannedBy = undefined;
    user.bannedAt = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User unbanned successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Change User Role
export const changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    if (!["user", "moderator"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot change admin role",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
