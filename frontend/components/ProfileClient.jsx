"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import useAuthStore from "@/store/authStore";
import useUserStore from "@/store/userStore";
import PostCard from "./PostCard";
import { toTitleCase } from "@/utils/textCase";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "@/components/ui/Spinner";
import EditProfileModal from "@/components/ui/EditProfileModal";
import Image from "next/image";

const VerificationBadge = ({ role }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getBadgeInfo = (role) => {
    switch (role) {
      case "admin":
        return {
          title: "Admin",
          description: "Full access to manage and moderate the platform",
          color: "text-blue-500",
        };
      case "moderator":
        return {
          title: "Moderator",
          description:
            "Helps maintain community guidelines and content quality",
          color: "text-black dark:text-white",
        };
      default:
        return null;
    }
  };

  const badgeInfo = getBadgeInfo(role);
  if (!badgeInfo) return null;

  return (
    <div className="relative inline-flex items-center justify-center">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="cursor-help"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-6 h-6 ${badgeInfo.color} inline-block ml-2`}
        >
          <path
            fillRule="evenodd"
            d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 top-full mt-2"
          >
            <div className="relative w-48 px-4 py-3 bg-white dark:bg-black border-4 border-black dark:border-white shadow-lg">
              {/* Arrow */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-black dark:border-b-white" />

              <h4 className="font-bold mb-1">{badgeInfo.title}</h4>
              <p className="text-sm text-black/70 dark:text-white/70">
                {badgeInfo.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Components
const ProfileHeader = ({ userProfile, isOwnProfile }) => {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);
  const { updateCoverPhoto } = useUserStore();
  const [isUploading, setIsUploading] = useState(false);

  const handleCoverPhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("coverPhoto", file);
      await updateCoverPhoto(formData);
    } catch (error) {
      console.error("Error updating cover photo:", error);
      alert(error.message || "Failed to update cover photo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative mb-12">
      {/* Cover Image */}
      <div
        className="h-48 bg-black/10 dark:bg-white/10 rounded-lg overflow-hidden relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={
            userProfile?.coverPhoto === "default-cover.png"
              ? "/default-cover.jpg"
              : userProfile?.coverPhoto
          }
          alt="Cover"
          className="w-full h-full object-cover"
        />

        {/* Upload overlay - only show for own profile when hovered */}
        {isOwnProfile && isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCoverPhotoChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-white text-black font-bold rounded-md hover:bg-white/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                    />
                  </svg>
                  Update Cover Photo
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="absolute -bottom-16 left-8 flex items-end gap-6">
        <div className="relative group">
          <img
            src={
              userProfile?.profilePic === "default-avatar.png"
                ? "/default-avatar.png"
                : userProfile?.profilePic
            }
            alt={userProfile?.name}
            className="w-32 h-32 border-4 border-black dark:border-white bg-white dark:bg-black transition-transform hover:scale-105"
          />
        </div>

        <div className="mb-4">
          <h1 className="text-3xl font-bold flex items-center">
            {userProfile?.name}
            <VerificationBadge role={userProfile?.role} />
          </h1>
          <p className="text-black/50 dark:text-white/50">
            {userProfile?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ userProfile }) => (
  <div className="grid grid-cols-3 gap-4 p-4 border-4 border-black dark:border-white hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] dark:hover:shadow-[4px_4px_0_0_#fff] transition-all">
    <StatItem label="Followers" count={userProfile?.followers?.length || 0} />
    <StatItem label="Following" count={userProfile?.following?.length || 0} />
    <StatItem label="Friends" count={userProfile?.friends?.length || 0} />
  </div>
);

const StatItem = ({ label, count }) => (
  <div className="text-center">
    <p className="text-2xl font-bold">{count}</p>
    <p className="text-sm text-black/50 dark:text-white/50">{label}</p>
  </div>
);

const ProfileInfo = ({ userProfile }) => (
  <div className="p-4 border-4 border-black dark:border-white hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] dark:hover:shadow-[4px_4px_0_0_#fff] transition-all">
    <h3 className="font-bold mb-2">About</h3>
    {userProfile?.bio ? (
      <p className="text-black/70 dark:text-white/70 whitespace-pre-wrap">
        {userProfile.bio}
      </p>
    ) : (
      <p className="text-black/50 dark:text-white/50 italic">
        No bio added yet
      </p>
    )}
  </div>
);

const AccountStatus = ({ userProfile }) => (
  <div className="p-4 border-4 border-black dark:border-white hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] dark:hover:shadow-[4px_4px_0_0_#fff] transition-all">
    <h3 className="font-bold mb-2">Account Status</h3>
    <div className="space-y-2">
      <StatusIndicator
        isActive={userProfile?.isVerified}
        activeColor="bg-green-500"
        inactiveColor="bg-yellow-500"
        label={userProfile?.isVerified ? "Verified" : "Unverified"}
      />
      <StatusIndicator
        isActive={userProfile?.accountStatus === "active"}
        activeColor="bg-green-500"
        inactiveColor="bg-red-500"
        label={toTitleCase(userProfile?.accountStatus || "")}
      />
      <TimeInfo label="Joined" date={userProfile?.createdAt} />
      <TimeInfo label="Last active" date={userProfile?.lastActive} />
    </div>
  </div>
);

const StatusIndicator = ({ isActive, activeColor, inactiveColor, label }) => (
  <p className="flex items-center gap-2">
    <span
      className={`w-2 h-2 rounded-full ${
        isActive ? activeColor : inactiveColor
      }`}
    />
    {label}
  </p>
);

const TimeInfo = ({ label, date }) => (
  <p className="text-sm text-black/50 dark:text-white/50">
    {label}: {new Date(date).toLocaleDateString()}
  </p>
);

const PostsSection = ({ userPosts }) => (
  <div className="md:col-span-2 space-y-6">
    <h2 className="text-2xl font-bold mb-6">Posts</h2>
    {userPosts?.length > 0 ? (
      userPosts.map((post) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PostCard post={post} />
        </motion.div>
      ))
    ) : (
      <p className="text-center text-black/50 dark:text-white/50">
        No posts yet
      </p>
    )}
  </div>
);

export default function ProfileClient({ userId }) {
  const { user } = useAuthStore();
  const {
    userProfile,
    userPosts,
    loading,
    error,
    getUserProfile,
    getUserPosts,
    updateProfile,
    getUserProfileById,
    followUser,
    unfollowUser,
    sendFriendRequest,
  } = useUserStore();

  // Determine if viewing own profile
  const isOwnProfile = !userId || userId === user?._id;

  // Memoize the fetch functions
  const fetchUserData = useCallback(async () => {
    if (isOwnProfile) {
      await getUserProfile();
    } else {
      // Add getUserProfileById to userStore and use it here
      await getUserProfileById(userId);
    }
    await getUserPosts(isOwnProfile ? user?._id : userId);
  }, [userId, user?._id, getUserProfile, getUserPosts, isOwnProfile]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (user) {
      document.title = `${user.name} | Post Treck`;
    }
  }, [user]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        bio: userProfile.bio || "",
        location: userProfile.location || "",
        website: userProfile.website || "",
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsEditing(false);
  };

  const handleUpdateProfile = async (formData) => {
    try {
      await updateProfile(formData);
      setIsEditModalOpen(false);
      await fetchUserData();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message || "Failed to update profile");
    }
  };

  const handleFollow = async () => {
    try {
      if (userProfile.friendshipStatus === "following") {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      // Refresh profile to get updated status
      await getUserProfileById(userId);
    } catch (error) {
      console.error("Error following user:", error);
      alert(error.message || "Failed to follow user");
    }
  };

  const handleFriendRequest = async () => {
    try {
      await sendFriendRequest(userId);
      // Refresh profile to get updated status
      await getUserProfileById(userId);
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert(error.message || "Failed to send friend request");
    }
  };

  if (loading) return <Spinner />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader userProfile={userProfile} isOwnProfile={isOwnProfile} />

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            <StatsCard userProfile={userProfile} />
            <ProfileInfo userProfile={userProfile} />
            <AccountStatus userProfile={userProfile} />

            {isOwnProfile ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditModalOpen(true)}
                className="w-full px-4 py-2 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
              >
                Edit Profile
              </motion.button>
            ) : (
              <div className="space-y-3">
                {/* Follow Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFollow}
                  className="w-full px-4 py-2 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                >
                  {userProfile?.friendshipStatus === "following"
                    ? "Unfollow"
                    : "Follow"}
                </motion.button>

                {/* Friend Request Button - Only show if not already friends or request pending */}
                {userProfile?.friendshipStatus === "none" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFriendRequest}
                    className="w-full px-4 py-2 bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white hover:opacity-90 transition-all"
                  >
                    Add Friend
                  </motion.button>
                )}

                {/* Show status if request is pending */}
                {userProfile?.friendshipStatus === "request_sent" && (
                  <p className="text-center text-black/50 dark:text-white/50">
                    Friend Request Sent
                  </p>
                )}

                {/* Show status if they're already friends */}
                {userProfile?.friendshipStatus === "friends" && (
                  <p className="text-center text-green-500 font-medium">
                    Friends
                  </p>
                )}
              </div>
            )}
          </div>

          <PostsSection userPosts={userPosts} />
        </div>

        {/* Edit Profile Modal - Only show for own profile */}
        {isOwnProfile && (
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            user={userProfile}
            onSave={handleUpdateProfile}
          />
        )}
      </div>
    </div>
  );
}
