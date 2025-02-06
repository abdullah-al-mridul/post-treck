"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";
import useUserStore from "@/store/userStore";
import PostCard from "./PostCard";
import { useRouter } from "next/navigation";

export default function ProfileClient() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    userProfile,
    userPosts,
    loading,
    error,
    getUserProfile,
    getUserPosts,
    updateProfile,
    updateProfilePic,
  } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
  });

  const isOwnProfile = user?._id === userProfile?._id;

  useEffect(() => {
    getUserProfile();
    getUserPosts(user?._id);
  }, []);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/auth/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (userProfile && isOwnProfile) {
      setFormData({
        name: userProfile.name || "",
        bio: userProfile.bio || "",
        location: userProfile.location || "",
        website: userProfile.website || "",
      });
    }
  }, [userProfile, isOwnProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOwnProfile) return;
    await updateProfile(formData);
    setIsEditing(false);
  };

  const handleImageUpload = async (e) => {
    if (!isOwnProfile) return;
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profilePic", file);
      await updateProfilePic(formData);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="relative mb-12">
          {/* Cover Image */}
          <div className="h-48 bg-black/10 dark:bg-white/10 rounded-lg overflow-hidden">
            <img
              src="/default-cover.jpg"
              alt="Cover"
              className="w-full h-full object-cover"
            />
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
                className="w-32 h-32 border-4 border-black dark:border-white bg-white dark:bg-black"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <span className="text-white text-sm">Change Photo</span>
              </label>
            </div>

            <div className="mb-4">
              <h1 className="text-3xl font-bold">{userProfile?.name}</h1>
              <p className="text-black/50 dark:text-white/50">
                @{userProfile?.username}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-2 border-2 border-black dark:border-white bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={3}
                    className="w-full p-2 border-2 border-black dark:border-white bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full p-2 border-2 border-black dark:border-white bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="w-full p-2 border-2 border-black dark:border-white bg-transparent"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border-2 border-black dark:border-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {userProfile?.bio && (
                  <p className="text-lg">{userProfile.bio}</p>
                )}
                {userProfile?.location && (
                  <p className="flex items-center gap-2 text-black/70 dark:text-white/70">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                    {userProfile.location}
                  </p>
                )}
                {userProfile?.website && (
                  <a
                    href={userProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-black/70 dark:text-white/70 hover:underline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                      />
                    </svg>
                    {userProfile.website}
                  </a>
                )}
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Posts */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold mb-6">Posts</h2>
            {userPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
