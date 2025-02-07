"use client";
import { motion } from "framer-motion";
import PostCard from "./PostCard";
import usePostStore from "@/store/postStore";
import useAuthStore from "@/store/authStore";
import { useEffect, useState } from "react";
import Spinner from "./ui/Spinner";

export default function HomeClient() {
  const { posts, loading, error, getFeedPosts } = usePostStore();
  const { user } = useAuthStore();
  const [newPost, setNewPost] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    getFeedPosts();
  }, [getFeedPosts]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      setIsPosting(true);
      // Add createPost to postStore and use it here
      await createPost({ caption: newPost });
      setNewPost("");
      // Refresh feed
      await getFeedPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      alert(error.message || "Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Create Post Section */}
        <div className="bg-white dark:bg-black border-4 border-black dark:border-white p-4 rounded-lg">
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="flex items-start gap-4">
              <img
                src={user?.profilePic || "/default-avatar.png"}
                alt={user?.name}
                className="w-10 h-10 rounded-full border-2 border-black dark:border-white"
              />
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="flex-1 bg-transparent border-2 border-black dark:border-white p-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPosting || !newPost.trim()}
                className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {isPosting ? (
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
                    Posting...
                  </>
                ) : (
                  "Post"
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
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">No Posts Yet</h2>
            <p className="text-black/50 dark:text-white/50">
              Follow some users to see their posts here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
