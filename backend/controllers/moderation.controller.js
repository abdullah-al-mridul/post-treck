import Post from "../models/Post.model.js";

// Report Post
export const reportPost = async (req, res) => {
  try {
    const { reason, description } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user already reported
    const alreadyReported = post.reports.some(
      (report) => report.user.toString() === req.user._id.toString()
    );

    if (alreadyReported) {
      return res.status(400).json({
        success: false,
        message: "You have already reported this post",
      });
    }

    post.reports.push({
      user: req.user._id,
      reason,
      description,
    });

    post.isReported = true;
    post.moderationStatus = "pending";

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post reported successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Reported Posts
export const getReportedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const posts = await Post.find({ isReported: true })
      .populate("user", "name email profilePic")
      .populate("reports.user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Post.countDocuments({ isReported: true });

    res.status(200).json({
      success: true,
      posts,
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

// Moderate Post
export const moderatePost = async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.moderationStatus = action === "approve" ? "approved" : "rejected";
    post.moderatedBy = req.user._id;
    post.moderatedAt = new Date();

    if (action === "reject") {
      // Optionally delete the post if rejected
      await post.deleteOne();

      res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      });
    } else {
      post.isReported = false;
      post.reports = [];
      await post.save();

      res.status(200).json({
        success: true,
        message: "Post approved successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
