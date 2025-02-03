import User from "../models/User.model.js";
import mongoose from "mongoose";

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      bio: req.body.bio,
    };

    // Validate name length
    if (updates.name) {
      if (updates.name.length < 2 || updates.name.length > 20) {
        return res.status(400).json({
          success: false,
          message: "Name must be between 2 and 20 characters",
        });
      }
    }

    // Validate bio length if provided
    if (updates.bio) {
      if (updates.bio.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Bio cannot exceed 100 characters",
        });
      }
    }

    // If file was uploaded, add the cloudinary URL to updates
    if (req.file) {
      updates.profilePic = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      user: userResponse,
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
      .select("-password -friendRequests")
      .populate("followers", "name email profilePic")
      .populate("following", "name email profilePic")
      .populate("friends", "name email profilePic");

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

    // Add friendship status
    let friendshipStatus = "none";

    if (currentUser.friends && currentUser.friends.includes(user._id)) {
      friendshipStatus = "friends";
    } else if (
      currentUser.following &&
      currentUser.following.includes(user._id)
    ) {
      friendshipStatus = "following";
    } else if (
      currentUser.friendRequests &&
      currentUser.friendRequests.includes(user._id)
    ) {
      friendshipStatus = "request_received";
    } else if (
      user.friendRequests &&
      user.friendRequests.includes(currentUser._id)
    ) {
      friendshipStatus = "request_sent";
    }

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
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
