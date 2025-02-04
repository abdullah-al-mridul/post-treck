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

    // Validate reason is provided
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Report reason is required",
      });
    }

    // Validate reason is valid
    if (
      !["spam", "harassment", "inappropriate", "violence", "other"].includes(
        reason
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid report reason",
      });
    }

    // If reason is "other", description is required
    if (reason === "other" && !description) {
      return res.status(400).json({
        success: false,
        message: "Description is required for 'other' reason",
      });
    }

    // Check if user is reporting their own post
    if (post.user.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot report your own post",
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
    const { action } = req.body;
    const post = await Post.findById(req.params.id);

    // Validate action
    if (!action) {
      return res.status(400).json({
        success: false,
        message: "Action is required",
      });
    }

    // Validate action type
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be either 'approve' or 'reject'",
      });
    }

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if post is actually reported
    if (!post.isReported) {
      return res.status(400).json({
        success: false,
        message: "This post has not been reported",
      });
    }

    // Check if post is already moderated
    if (post.moderationStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: `This post has already been ${post.moderationStatus}`,
      });
    }

    post.moderationStatus = action === "approve" ? "approved" : "rejected";
    post.moderatedBy = req.user._id;
    post.moderatedAt = new Date();

    if (action === "reject") {
      // Store post details before deletion for logging/notification
      const postDetails = {
        userId: post.user,
        postId: post._id,
        caption: post.caption,
        reports: post.reports,
      };

      // Delete the post
      await post.deleteOne();

      // You could add notification or logging here
      // await createNotification({
      //   user: postDetails.userId,
      //   type: "post_deleted",
      //   message: "Your post was deleted due to community guidelines violation",
      //   moderator: req.user._id,
      // });

      res.status(200).json({
        success: true,
        message: "Post has been deleted due to guideline violations",
        postDetails,
      });
    } else {
      // Clear report status for approved posts
      post.isReported = false;
      post.reports = [];
      await post.save();

      // You could add notification here
      // await createNotification({
      //   user: post.user,
      //   type: "post_approved",
      //   message: "Your reported post has been reviewed and approved",
      //   moderator: req.user._id,
      // });

      res.status(200).json({
        success: true,
        message: "Post has been approved and reports have been cleared",
        post,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
