"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import PostCard from "@/components/PostCard";
import usePostStore from "@/store/postStore";
import useAuthStore from "@/store/authStore";
import Spinner from "@/components/ui/Spinner";

export default function HomeClient() {
  //get posts, loading, error and getFeedPosts from post store
  const { posts, loading, error, getFeedPosts, createPost } = usePostStore();
  //get user from auth store
  const { user } = useAuthStore();
  //declare new post and is posting state
  const [newPost, setNewPost] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  // Add new state for image
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // Add ref for image input
  const imageInputRef = useRef(null);

  //get feed posts
  useEffect(() => {
    getFeedPosts();
  }, []);

  // Handle image selection with validation
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Clear image selection
  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // Modified handleCreatePost with better error handling
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() && !selectedImage) return;

    try {
      setIsPosting(true);
      const result = await createPost({
        caption: newPost,
        image: selectedImage,
      });

      if (result) {
        setNewPost("");
        clearImage();
        await getFeedPosts();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert(error.message || "Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  //if loading, show spinner
  if (loading) return <Spinner />;

  //if error, show error message
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  //if not loading and no error, show home page
  return (
    <div className="min-h-screen dark:bg-black pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Create Post Section */}
        <div className="bg-white dark:bg-black border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255)]">
          <div className="border-b-4 border-black dark:border-white p-4">
            <div className="flex items-center gap-4">
              <img
                src={user?.profilePic || "/default-avatar.png"}
                alt={user?.name}
                className="w-12 h-12 rounded-full border-4 border-black dark:border-white"
              />
              <div className="flex-1">
                <h2 className="font-bold text-lg">{user?.name}</h2>
                <p className="text-black/50 dark:text-white/50 text-sm">
                  Share your thoughts
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleCreatePost} className="p-4 space-y-4">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-transparent border-4 border-black dark:border-white p-4 rounded-none resize-none focus:outline-none min-h-[120px] placeholder:text-black/50 dark:placeholder:text-white/50 font-medium"
              rows={3}
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 w-auto rounded border-4 border-black dark:border-white"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black text-white dark:bg-white/50 dark:hover:bg-white dark:text-black rounded-full transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 border-4 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  📷
                </button>
                <button
                  type="button"
                  className="p-2 border-4 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  🎥
                </button>
              </div>

              <button
                type="submit"
                disabled={isPosting || (!newPost.trim() && !selectedImage)}
                className="px-8 py-2 bg-black text-white dark:bg-white dark:text-black font-bold border-4 border-black dark:border-white hover:translate-x-[-4px] hover:translate-y-[-4px] active:translate-x-[0px] active:translate-y-[0px] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                {isPosting ? (
                  <div className="flex items-center gap-2">
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
                        className="opacity-75 dark:fill-black"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="dark:text-black">POSTING...</span>
                  </div>
                ) : (
                  <span className="dark:text-black">POST</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Feed Posts */}
        {posts.length > 0 ? (
          posts.map((post) => (
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
          <div className="text-center py-8 border-4 border-black dark:border-white p-8 bg-white dark:bg-black transition-colors">
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
              NO POSTS YET
            </h2>
            <p className="text-black/50 dark:text-white/50">
              Be the first one to post something!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
