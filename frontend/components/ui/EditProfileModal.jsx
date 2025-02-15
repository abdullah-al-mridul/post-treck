"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditProfileModal({ isOpen, onClose, user, onSave }) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    profilePic: null,
  });
  const [previewUrl, setPreviewUrl] = useState(user?.profilePic);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, profilePic: file }));
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Clean up previous preview URL to avoid memory leaks
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md mx-4 bg-white dark:bg-[#15202B]/90 backdrop-blur-lg border-4 border-black dark:border-darkBorder p-6"
          >
            <h2 className="text-2xl font-bold mb-6 dark:text-zinc-100">
              Edit Profile
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-4">
                <div
                  className="relative w-32 h-32 cursor-pointer group"
                  onClick={handleClickUpload}
                >
                  <img
                    src={previewUrl || "/default-avatar.png"}
                    alt="Profile"
                    className="w-full h-full object-cover border-4 border-black dark:border-darkBorder"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">
                      Change Photo
                    </span>
                  </div>
                </div>
                <p className="text-sm text-black/50 dark:text-white/50">
                  Click to upload a new photo
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-zinc-100">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full bg-transparent border-2 border-black dark:border-darkBorder p-2 focus:outline-none dark:text-zinc-100"
                  maxLength={50}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-zinc-100">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="w-full bg-transparent border-2 border-black dark:border-darkBorder p-2 focus:outline-none dark:text-zinc-100 resize-none"
                  rows={4}
                  maxLength={160}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-black dark:bg-transparent dark:border-2 dark:border-darkBorder text-white dark:text-zinc-100 font-medium hover:bg-black/80 dark:hover:bg-darkHover disabled:opacity-50 transition-colors"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border-2 border-black dark:text-zinc-100 dark:border-darkBorder hover:bg-black hover:text-white dark:hover:bg-darkHover dark:hover:text-zinc-100 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
