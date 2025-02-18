import User from "../models/User.model.js";
import mongoose from "mongoose";
import { createNotification } from "../controllers/notification.controller.js";

// Update Cover Photo
export const updateCoverPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please provide a cover photo",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { coverPhoto: req.file.path },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Profile (Modified to handle both profile pic and cover photo)
export const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const profilePic = req.file; // If using multer for file upload

    const updateData = {
      ...(name && { name }),
      ...(bio && { bio }),
    };

    if (profilePic) {
      // Handle profile picture upload to Cloudinary
      updateData.profilePic = profilePic.path;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Follow User
export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({
        success: false,
        message: "You are already following this user",
      });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    // Add notification
    await createNotification({
      recipient: userToFollow._id,
      sender: req.user._id,
      type: "follow",
      message: `${req.user.name} started following you`,
    });

    res.status(200).json({
      success: true,
      message: "Successfully followed user",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Unfollow User
export const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({
      success: true,
      message: "Successfully unfollowed user",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Send Friend Request
export const sendFriendRequest = async (req, res) => {
  try {
    const userToAdd = await User.findById(req.params.id);
    const currentUser = req.user;

    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userToAdd.friendRequests.includes(currentUser._id)) {
      return res.status(400).json({
        success: false,
        message: "Friend request already sent",
      });
    }

    userToAdd.friendRequests.push(currentUser._id);
    await userToAdd.save();

    res.status(200).json({
      success: true,
      message: "Friend request sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Accept Friend Request
export const acceptFriendRequest = async (req, res) => {
  try {
    const userToAccept = await User.findById(req.params.id);
    const currentUser = req.user;

    if (!userToAccept) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!currentUser.friendRequests.includes(userToAccept._id)) {
      return res.status(400).json({
        success: false,
        message: "No friend request from this user",
      });
    }

    // Remove from friend requests
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== userToAccept._id.toString()
    );

    // Add to friends list (both users)
    currentUser.friends.push(userToAccept._id);
    userToAccept.friends.push(currentUser._id);

    // Add to following/followers
    currentUser.following.push(userToAccept._id);
    userToAccept.followers.push(currentUser._id);

    await currentUser.save();
    await userToAccept.save();

    res.status(200).json({
      success: true,
      message: "Friend request accepted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Friends List
export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friends",
      "name email profilePic"
    );

    res.status(200).json({
      success: true,
      friends: user.friends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Own Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("followers", "name email profilePic")
      .populate("following", "name email profilePic")
      .populate("friends", "name email profilePic")
      .populate("friendRequests", "name email profilePic");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Other User's Profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.id);

    const user = await User.findById(userId)
      .select("-password -bannedBy -bannedAt")
      .populate("followers", "name email profilePic lastActive")
      .populate("following", "name email profilePic lastActive")
      .populate("friends", "name email profilePic lastActive");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get full currentUser data with populated fields
    const currentUser = await User.findById(req.user._id).select(
      "friends following friendRequests"
    );

    // Add friendship status with proper checks
    let friendshipStatus = "none";

    // Check if they are friends
    if (currentUser.friends.includes(user._id)) {
      friendshipStatus = "friends";
    }
    // Check if current user is following them
    else if (currentUser.following.includes(user._id)) {
      friendshipStatus = "following";
    }
    // Check if current user has received a friend request from them
    else if (currentUser.friendRequests.includes(user._id)) {
      friendshipStatus = "request_received";
    }
    // Check if current user has sent a friend request to them
    else if (user.friendRequests.includes(currentUser._id)) {
      friendshipStatus = "request_sent";
    }

    // Remove sensitive data before sending response
    const userResponse = user.toObject();
    delete userResponse.friendRequests; // Remove friendRequests from response

    res.status(200).json({
      success: true,
      user: {
        ...userResponse,
        friendshipStatus,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search Users
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(200).json({
        success: true,
        users: [],
      });
    }

    // Search users by name or email, excluding the current user
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } }, // Exclude current user
        {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        },
      ],
    })
      .select("name email profilePic role")
      .limit(10);

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
