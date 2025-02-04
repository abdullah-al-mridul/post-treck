import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "default-avatar.png",
    },
    coverPhoto: {
      type: String,
      default: "default-cover.png",
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    accountStatus: {
      type: String,
      enum: ["active", "banned", "suspended"],
      default: "active",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      select: false, // Don't send this in normal queries
    },
    verificationCodeExpires: {
      type: Date,
      select: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    banReason: String,
    bannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bannedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
