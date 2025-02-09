"use client";
import { useEffect, useState } from "react";
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

  //get feed posts
  useEffect(() => {
    getFeedPosts();
  }, []);

  //handle create post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      setIsPosting(true);
      const result = await createPost({ caption: newPost });
      setNewPost("");
      if (result) {
        getFeedPosts();
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
    <div className="min-h-screen pt-24 pb-12 px-4">
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

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {/* Add these buttons later for media upload */}
                <button
                  type="button"
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
                disabled={isPosting || !newPost.trim()}
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
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    POSTING...
                  </div>
                ) : (
                  "POST"
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
          <div className="text-center py-8 border-4 border-black dark:border-white p-8">
            <h2 className="text-2xl font-bold mb-4">NO POSTS YET</h2>
            <p className="text-black/50 dark:text-white/50">
              Be the first one to post something!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
