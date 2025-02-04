import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    reactions: {
      like: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      love: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      haha: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      wow: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      sad: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      angry: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    replies: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          trim: true,
          maxlength: 500,
        },
        reactions: {
          like: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
          ],
          love: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
          ],
          haha: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
          ],
          wow: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
          ],
          sad: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
          ],
          angry: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
          ],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Define reaction types
export const REACTION_TYPES = {
  LIKE: "like",
  LOVE: "love",
  HAHA: "haha",
  WOW: "wow",
  SAD: "sad",
  ANGRY: "angry",
};

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    media: [
      {
        type: String, // Cloudinary URLs
        required: true,
      },
    ],
    reactions: {
      like: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      love: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      haha: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      wow: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      sad: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      angry: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    reactionCount: {
      type: Number,
      default: 0,
    },
    comments: [commentSchema],
    hashtags: [
      {
        type: String,
        trim: true,
      },
    ],
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isRepost: {
      type: Boolean,
      default: false,
    },
    originalPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    repostCount: {
      type: Number,
      default: 0,
    },
    // Moderation fields
    isReported: {
      type: Boolean,
      default: false,
    },
    reports: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reason: {
          type: String,
          required: true,
          enum: ["spam", "harassment", "inappropriate", "violence", "other"],
        },
        description: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    moderatedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Middleware to extract hashtags and mentions from caption
postSchema.pre("save", function (next) {
  if (this.isModified("caption")) {
    // Extract hashtags
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    this.hashtags = this.caption.match(hashtagRegex) || [];

    // Extract mentions (@username)
    const mentionRegex = /@[a-zA-Z0-9_]+/g;
    const mentions = this.caption.match(mentionRegex) || [];
    // Remove @ symbol and store only usernames
    this.mentions = mentions.map((mention) => mention.slice(1));
  }
  if (this.isModified("reactions")) {
    this.reactionCount = this.getTotalReactions();
  }
  next();
});

// Add a method to get total reactions
postSchema.methods.getTotalReactions = function () {
  return Object.values(this.reactions).reduce((total, reactions) => {
    return total + reactions.length;
  }, 0);
};

const Post = mongoose.model("Post", postSchema);
export default Post;
