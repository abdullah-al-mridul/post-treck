"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/formatDate";
import VerificationBadge from "@/components/ui/VerificationBadge";
import { useState } from "react";

const PostClient = ({ id }) => {
  // Dummy data based on the example response
  const post = {
    reactions: {
      like: [],
      love: ["67a429b215d7dcc39befe0cd"],
      haha: [],
      wow: [],
      sad: [],
      angry: [],
    },
    _id: "67bdee50b4d6800d0d18df86",
    user: {
      _id: "67bd81ddb4d6800d0d189061",
      name: "User 5",
      email: "user5@mail.com",
      profilePic: "default-avatar.png",
      role: "moderator",
    },
    caption: "new post",
    media: [],
    reactionCount: 1,
    hashtags: [],
    mentions: [],
    isRepost: false,
    repostCount: 0,
    isReported: false,
    moderationStatus: "approved",
    comments: [],
    reports: [],
    createdAt: "2025-02-25T16:22:40.677Z",
    updatedAt: "2025-02-26T14:17:08.618Z",
    moderatedAt: "2025-02-26T14:17:08.617Z",
    moderatedBy: "67a429b215d7dcc39befe0cd",
  };

  const [newComment, setNewComment] = useState("");

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 group border-2 border-black dark:border-darkBorder px-4 py-2 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] dark:hover:shadow-[4px_4px_0_0_rgba(56,68,77,0.4)] transition-all bg-white dark:bg-[#15202B]"
          >
            <div className="p-1 bg-black/5 dark:bg-white/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 dark:text-zinc-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
                />
              </svg>
            </div>
            <span className="font-bold text-sm dark:text-zinc-100">Back</span>
          </Link>
        </motion.div>

        {/* Post Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-black dark:border-darkBorder bg-white dark:bg-[#15202B]"
        >
          <div className="p-8">
            {/* Author Info */}
            <div className="flex items-center gap-4 mb-8">
              <Link
                href={`/profile/${post.user._id}`}
                className="block relative"
              >
                <Image
                  src={
                    post.user.profilePic === "default-avatar.png"
                      ? "/default-avatar.png"
                      : post.user.profilePic
                  }
                  alt={post.user.name}
                  width={56}
                  height={56}
                  className="border-2 border-black dark:border-darkBorder"
                />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/profile/${post.user._id}`}
                    className="font-bold text-lg hover:underline dark:text-zinc-100"
                  >
                    {post.user.name}
                  </Link>
                  {post.user.role && (
                    <VerificationBadge role={post.user.role} />
                  )}
                </div>
                <div className="text-sm text-black/50 dark:text-white/50">
                  {formatDate(post.createdAt)}
                </div>
              </div>
            </div>

            {/* Post Text */}
            <div className="space-y-6">
              <p className="text-xl leading-relaxed dark:text-zinc-100">
                {post.caption}
              </p>

              {/* Media */}
              {post.media && post.media.length > 0 && (
                <div className="relative w-full aspect-square">
                  <Image
                    src={post.media[0]}
                    alt="Post media"
                    fill
                    className="object-cover border border-black dark:border-darkBorder"
                  />
                </div>
              )}

              {/* Post Stats */}
              <div className="flex items-center gap-4 text-sm text-black/50 dark:text-white/50">
                <span>{post.reactionCount} reactions</span>
                <span>{post.comments.length} comments</span>
                <span>{post.repostCount} reposts</span>
              </div>

              {/* Moderation Info */}
              {post.moderationStatus === "approved" && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900">
                  <div className="text-sm text-green-600 dark:text-green-400">
                    <span className="font-medium">Moderation Status:</span>{" "}
                    Approved
                  </div>
                  <div className="text-sm text-green-500 dark:text-green-500">
                    Moderated at: {formatDate(post.moderatedAt)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t-2 border-black dark:border-darkBorder p-8">
            <h2 className="text-xl font-bold mb-6 dark:text-zinc-100">
              Comments
            </h2>

            {/* Comment Form */}
            <form className="mb-8 flex gap-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-transparent border-2 border-black dark:border-darkBorder p-2 dark:text-zinc-100 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-black dark:bg-darkBorder text-white dark:text-zinc-100 font-medium hover:bg-black/80 dark:hover:bg-darkHover transition-colors"
              >
                Comment
              </button>
            </form>

            {/* Comments List */}
            {post.comments.length === 0 ? (
              <p className="text-center text-black/50 dark:text-white/50 py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-6">
                {/* Comment items would go here */}
              </div>
            )}
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default PostClient;
