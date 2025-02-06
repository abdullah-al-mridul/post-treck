"use client";
import { motion } from "framer-motion";
import { formatDate } from "@/utils/formatDate";

export default function PostCard({ post }) {
  console.log(post);
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 border-4 border-black dark:border-white hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] dark:hover:shadow-[8px_8px_0_0_#fff] transition-all"
    >
      <div className="flex items-center gap-4 mb-6">
        <img
          src={
            post?.user?.profilePic === "default-avatar.png"
              ? "/default-avatar.png"
              : post?.user?.profilePic
          }
          alt={post?.user?.name}
          className="w-12 h-12 border-4 border-black dark:border-white"
        />
        <div>
          <h3 className="font-bold text-lg">{post?.user?.name}</h3>
          <p className="font-mono text-black/50 dark:text-white/50">
            {formatDate(post?.createdAt)}
          </p>
        </div>
      </div>

      <p className="mb-6 text-lg leading-relaxed">{post?.caption}</p>

      {post?.media && (
        <div className="mb-6 border-4 border-black dark:border-white">
          <img src={post?.media[0]} alt="Post" className="w-full" />
        </div>
      )}

      <div className="flex gap-8 font-mono">
        {/* Like Button */}
        <button className="group flex items-center gap-2">
          {/* ... Like Button Content ... */}
          <span className="group-hover:font-bold transition-all">
            {post.likes}
          </span>
        </button>

        {/* Comment Button */}
        <button className="group flex items-center gap-2">
          {/* ... Comment Button Content ... */}
          <span className="group-hover:font-bold transition-all">
            {post.comments}
          </span>
        </button>

        {/* Share Button */}
        <button className="group flex items-center gap-2">
          {/* ... Share Button Content ... */}
          <span className="group-hover:font-bold transition-all">
            {post.shares}
          </span>
        </button>
      </div>
    </motion.article>
  );
}
