"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/formatDate";
import VerificationBadge from "@/components/ui/VerificationBadge";
import { useEffect, useState } from "react";
import useSinglePostStore from "@/store/SPostStore";
import Spinner from "../ui/Spinner";
import ReactionDrawer from "@/components/ui/ReactionDrawer";
import useAuthStore from "@/store/authStore";
const ReactionButton = ({
  icon,
  count,
  onClick,
  label,
  onHover,
  showDrawer,
  onMouseLeave,
  postId,
  currentReaction,
}) => (
  <div
    className="relative w-full cursor-pointer border-r dark:border-darkBorder dark:hover:bg-darkHover px-4 py-2"
    onMouseLeave={onMouseLeave}
    onClick={onClick}
    onMouseEnter={onHover}
  >
    <button className="group flex mx-auto items-center gap-2 text-black dark:text-zinc-100 transition-colors">
      {icon}
      <span className="transition-all">
        {count}
        <span className="sr-only">{label}</span>
      </span>
    </button>
    <ReactionDrawer
      isVisible={showDrawer}
      onReact={(postId, type) => onClick(postId, type)}
      className="z-50"
      onMouseEnter={onHover}
      onMouseLeave={onMouseLeave}
      postId={postId}
      currentReaction={currentReaction}
    />
  </div>
);

const PostClient = ({ id }) => {
  // Dummy data based on the example response
  //   const post = {
  //     reactions: {
  //       like: [],
  //       love: ["67a429b215d7dcc39befe0cd"],
  //       haha: [],
  //       wow: [],
  //       sad: [],
  //       angry: [],
  //     },
  //     _id: "67bdee50b4d6800d0d18df86",
  //     user: {
  //       _id: "67bd81ddb4d6800d0d189061",
  //       name: "User 5",
  //       email: "user5@mail.com",
  //       profilePic: "default-avatar.png",
  //       role: "moderator",
  //     },
  //     caption: "new post",
  //     media: [],
  //     reactionCount: 1,
  //     hashtags: [],
  //     mentions: [],
  //     isRepost: false,
  //     repostCount: 0,
  //     isReported: false,
  //     moderationStatus: "approved",
  //     comments: [],
  //     reports: [],
  //     createdAt: "2025-02-25T16:22:40.677Z",
  //     updatedAt: "2025-02-26T14:17:08.618Z",
  //     moderatedAt: "2025-02-26T14:17:08.617Z",
  //     moderatedBy: "67a429b215d7dcc39befe0cd",
  //   };
  const {
    post,
    getPost,
    loading,
    currentUserReaction,
    reactToPost,
    isReacting,
  } = useSinglePostStore();
  const [newComment, setNewComment] = useState("");
  const [showReactions, setShowReactions] = useState(false);
  const { user } = useAuthStore();
  useEffect(() => {
    console.log(currentUserReaction);
  }, [currentUserReaction]);
  useEffect(() => {
    getPost(id, user);
  }, [id]);

  // useEffect(() => {
  //   if (post) {
  //     setpost(post);
  //   }
  // }, [post]);

  if (loading || !post) return <Spinner />;

  const totalReactions = Object.values(post.reactions).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  const handleReaction = async (postId, type) => {
    await reactToPost(postId, type, user);
    console.log(postId, type);
  };

  const handleMouseLeave = () => {
    setShowReactions(false);
  };

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
          className="p-8 border-2 border-black dark:border-darkBorder bg-white dark:bg-[#15202B] hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] dark:hover:shadow-[8px_8px_0_0_rgba(56,68,77,0.4)] transition-all"
        >
          <div className="flex items-center gap-4 mb-8">
            <Link
              href={`/profile/${post?.user?._id}`}
              className="block relative"
            >
              <Image
                src={
                  post?.user?.profilePic === "default-avatar.png"
                    ? "/default-avatar.png"
                    : post?.user?.profilePic
                }
                alt={post?.user?.name}
                width={56}
                height={56}
                className="border-2 border-black dark:border-darkBorder"
              />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${post?.user?._id}`}
                  className="font-bold text-lg hover:underline dark:text-zinc-100"
                >
                  {post?.user?.name}
                </Link>
                {post?.user?.role && (
                  <VerificationBadge role={post?.user?.role} />
                )}
              </div>
              <div className="text-sm text-black/50 dark:text-white/50">
                {formatDate(post?.createdAt)}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-xl leading-relaxed dark:text-zinc-100">
              {post?.caption}
            </p>

            {post?.media && post?.media?.length > 0 && (
              <div className="relative w-full aspect-square">
                <Image
                  src={post?.media[0]}
                  alt="Post media"
                  fill
                  className="object-cover border border-black dark:border-darkBorder"
                />
              </div>
            )}

            {/* <div className="flex items-center gap-4 text-sm text-black/50 dark:text-white/50">
              <span>{totalReactions} reactions</span>
              <span>{post?.comments?.length} comments</span>
              <span>{post?.repostCount} reposts</span>
            </div> */}

            {post?.moderationStatus === "approved" && (
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

          {/* Post Actions */}
          <div className="flex border border-r-0 w-full dark:border-darkBorder mt-6 font-mono">
            {isReacting ? (
              <div className="relative w-full cursor-wait border-r dark:border-darkBorder dark:hover:bg-darkHover px-4 py-2">
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 relative">
                    {/* <div className="absolute inset-0 rounded-full border-2 border-black/20 dark:border-white/20"></div> */}
                    <div className="absolute inset-0 rounded-full border-2 border-black dark:border-darkBorder !border-t-darkBorder/50 animate-spin"></div>
                  </div>
                </div>
              </div>
            ) : (
              <ReactionButton
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 transition-all"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                }
                count={totalReactions}
                label="reactions"
                onHover={() => setShowReactions(true)}
                onClick={handleReaction}
                showDrawer={showReactions}
                onMouseLeave={handleMouseLeave}
                postId={post._id}
                currentReaction={currentUserReaction}
              />
            )}

            <ReactionButton
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 transition-all"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                  />
                </svg>
              }
              count={post?.comments?.length || 0}
              label="comments"
            />

            <ReactionButton
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 transition-all"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                  />
                </svg>
              }
              count={post?.repostCount || 0}
              label="reposts"
            />
          </div>

          {/* Comments Section */}
          <div className=" border-black dark:border-darkBorder p-8">
            <h2 className="text-xl font-bold mb-6 dark:text-zinc-100">
              Comments
            </h2>

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

            {post?.comments?.length === 0 ? (
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
