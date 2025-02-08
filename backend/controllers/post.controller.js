import Post from "../models/Post.model.js";
import User from "../models/User.model.js";
import { REACTION_TYPES } from "../models/Post.model.js";
import { createNotification } from "./notification.controller.js";

// Create Post
export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const files = req.files;

    // Validate that at least caption or media is provided
    if (!caption && (!files || files.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Either caption or media is required",
      });
    }

    // Create post with optional caption and media
    const post = await Post.create({
      user: req.user._id,
      caption: caption || "", // Make caption optional
      media: files ? files.map((file) => file.path) : [],
    });

    // Populate user details
    await post.populate("user", "name email profilePic role");

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Feed Posts
export const getFeedPosts = async (req, res) => {
  try {
    // Get all posts instead of just following
    const posts = await Post.find()
      .populate("user", "name email profilePic role")
      .populate({
        path: "comments.user",
        select: "name email profilePic",
      })
      .populate({
        path: "comments.replies.user",
        select: "name email profilePic",
      })
      .populate({
        path: "reactions.like reactions.love reactions.haha reactions.wow reactions.sad reactions.angry",
        select: "name profilePic",
      })
      .sort({ createdAt: -1 }); // Latest first

    // Add user's reaction to each post
    const postsWithReactionInfo = posts.map((post) => {
      const userReaction = Object.entries(post.reactions).find(
        ([type, users]) =>
          users.some((userId) => userId.toString() === req.user._id.toString())
      );

      return {
        ...post.toObject(),
        userReaction: userReaction ? userReaction[0] : null,
      };
    });

    res.status(200).json({
      success: true,
      posts: postsWithReactionInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Post
export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "name email profilePic role")
      .populate({
        path: "comments.user",
        select: "name email profilePic",
      })
      .populate({
        path: "comments.replies.user",
        select: "name email profilePic",
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get User Posts
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const posts = await Post.find({ user: userId })
      .populate("user", "name email profilePic role")
      .populate({
        path: "comments.user",
        select: "name email profilePic role",
      })
      .populate({
        path: "comments.replies.user",
        select: "name email profilePic role",
      })
      .sort({ createdAt: -1 });
    if (!posts || posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No posts found for this user",
      });
    }

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Post
export const updatePost = async (req, res) => {
  try {
    const { caption } = req.body;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check ownership
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own posts",
      });
    }

    post.caption = caption;
    await post.save();

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check ownership
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own posts",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Comment
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Validate content is provided
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    // Validate comment length
    if (content.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot exceed 500 characters",
      });
    }

    const comment = {
      user: req.user._id,
      content,
      reactions: {
        like: [],
        love: [],
        haha: [],
        wow: [],
        sad: [],
        angry: [],
      },
      replies: [],
    };

    post.comments.push(comment);
    await post.save();

    // Populate user details in the new comment
    await post.populate("comments.user", "name email profilePic");

    // Add notification
    await createNotification({
      recipient: post.user,
      sender: req.user._id,
      type: "comment",
      post: post._id,
      comment: comment._id,
      message: `${req.user.name} commented on your post`,
    });

    res.status(200).json({
      success: true,
      comment: post.comments[post.comments.length - 1],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Comment
export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    const commentId = req.params.commentId;

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
    // Validate content is provided
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    // Validate content length
    if (content.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Comment content cannot exceed 500 characters",
      });
    }

    // Check ownership
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own comments",
      });
    }

    comment.content = content;
    await post.save();

    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const commentId = req.params.commentId;

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check ownership
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments",
      });
    }

    comment.deleteOne();
    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reply to Comment
export const replyToComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    const commentId = req.params.commentId;

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    // Validate content
    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Reply content is required",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const reply = {
      user: req.user._id,
      content,
      reactions: {
        like: [],
        love: [],
        haha: [],
        wow: [],
        sad: [],
        angry: [],
      },
    };

    comment.replies.push(reply);
    await post.save();

    // Populate user details in the new reply
    await post.populate("comments.replies.user", "name email profilePic");

    res.status(200).json({
      success: true,
      reply: comment.replies[comment.replies.length - 1],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Reply
export const deleteReply = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const commentId = req.params.commentId;
    const replyId = req.params.replyId;

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const reply = comment.replies.id(replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    // Check ownership
    if (reply.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own replies",
      });
    }

    reply.deleteOne();
    await post.save();

    res.status(200).json({
      success: true,
      message: "Reply deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Repost
export const repostPost = async (req, res) => {
  try {
    const originalPost = await Post.findById(req.params.id);

    if (!originalPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Create repost
    const repost = await Post.create({
      user: req.user._id,
      caption: req.body.caption || originalPost.caption,
      media: originalPost.media,
      isRepost: true,
      originalPost: originalPost._id,
    });

    // Increment repost count on original post
    originalPost.repostCount += 1;
    await originalPost.save();

    // Populate user details
    await repost.populate("user", "name email profilePic role");
    await repost.populate("originalPost");

    res.status(201).json({
      success: true,
      post: repost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Comment Reaction
export const addCommentReaction = async (req, res) => {
  try {
    const { type } = req.body;
    const post = await Post.findById(req.params.id);
    const commentId = req.params.commentId;

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    // Validate type is provided
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Reaction type is required",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Validate reaction type
    if (!REACTION_TYPES[type.toUpperCase()]) {
      return res.status(400).json({
        success: false,
        message: "Invalid reaction type",
      });
    }

    // Initialize reactions object if it doesn't exist
    if (!comment.reactions) {
      comment.reactions = {
        like: [],
        love: [],
        haha: [],
        wow: [],
        sad: [],
        angry: [],
      };
    }

    // Remove any existing reaction by this user
    Object.values(REACTION_TYPES).forEach((reactionType) => {
      comment.reactions[reactionType] = comment.reactions[reactionType].filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
    });

    // Add new reaction
    comment.reactions[type].push(req.user._id);
    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment reaction added successfully",
      reactions: comment.reactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeCommentReaction = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const commentId = req.params.commentId;

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Remove all reactions by this user
    Object.values(REACTION_TYPES).forEach((type) => {
      if (comment.reactions && comment.reactions[type]) {
        comment.reactions[type] = comment.reactions[type].filter(
          (userId) => userId.toString() !== req.user._id.toString()
        );
      }
    });

    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment reaction removed successfully",
      reactions: comment.reactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Reaction
export const addReaction = async (req, res) => {
  try {
    const { type } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    // Validate type is provided
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Reaction type is required",
      });
    }

    // Validate reaction type
    if (!REACTION_TYPES[type.toUpperCase()]) {
      return res.status(400).json({
        success: false,
        message: "Invalid reaction type",
      });
    }

    // Remove any existing reaction by this user
    Object.values(REACTION_TYPES).forEach((reactionType) => {
      post.reactions[reactionType] = post.reactions[reactionType].filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
    });

    // Add new reaction
    post.reactions[type].push(req.user._id);
    await post.save();

    // Get user's current reaction
    const userReaction = Object.entries(post.reactions).find(([type, users]) =>
      users.some((userId) => userId.toString() === req.user._id.toString())
    );

    // Add notification
    await createNotification({
      recipient: post.user,
      sender: req.user._id,
      type: "post_like",
      post: post._id,
      message: `${req.user.name} reacted to your post`,
    });

    res.status(200).json({
      success: true,
      message: "Reaction added successfully",
      reactions: post.reactions,
      reactionCount: post.reactionCount,
      userReaction: userReaction ? userReaction[0] : null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Reaction
export const removeReaction = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Remove all reactions by this user
    Object.values(REACTION_TYPES).forEach((type) => {
      post.reactions[type] = post.reactions[type].filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
    });

    await post.save();

    res.status(200).json({
      success: true,
      message: "Reaction removed successfully",
      reactions: post.reactions,
      reactionCount: post.reactionCount,
      userReaction: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Reply Reaction
export const addReplyReaction = async (req, res) => {
  try {
    const { type } = req.body;
    const post = await Post.findById(req.params.id);
    const commentId = req.params.commentId;
    const replyId = req.params.replyId;

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Validate type is provided
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Reaction type is required",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const reply = comment.replies.id(replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    // Validate reaction type
    if (!REACTION_TYPES[type.toUpperCase()]) {
      return res.status(400).json({
        success: false,
        message: "Invalid reaction type",
      });
    }

    // Initialize reactions object if it doesn't exist
    if (!reply.reactions) {
      reply.reactions = {
        like: [],
        love: [],
        haha: [],
        wow: [],
        sad: [],
        angry: [],
      };
    }

    // Remove any existing reaction by this user
    Object.values(REACTION_TYPES).forEach((reactionType) => {
      reply.reactions[reactionType] = reply.reactions[reactionType].filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
    });

    // Add new reaction
    reply.reactions[type].push(req.user._id);
    await post.save();

    res.status(200).json({
      success: true,
      message: "Reply reaction added successfully",
      reactions: reply.reactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Reply Reaction
export const removeReplyReaction = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const commentId = req.params.commentId;
    const replyId = req.params.replyId;

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const reply = comment.replies.id(replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    // Remove all reactions by this user
    Object.values(REACTION_TYPES).forEach((type) => {
      if (reply.reactions && reply.reactions[type]) {
        reply.reactions[type] = reply.reactions[type].filter(
          (userId) => userId.toString() !== req.user._id.toString()
        );
      }
    });

    await post.save();

    res.status(200).json({
      success: true,
      message: "Reply reaction removed successfully",
      reactions: reply.reactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Post Reactions
export const getPostReactions = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Get user's current reaction
    const userReaction = Object.entries(post.reactions).find(([type, users]) =>
      users.some((userId) => userId.toString() === req.user._id.toString())
    );

    res.status(200).json({
      success: true,
      reactions: post.reactions,
      reactionCount: post.reactionCount,
      userReaction: userReaction ? userReaction[0] : null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
