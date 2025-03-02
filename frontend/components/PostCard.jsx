"use client";
import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/utils/formatDate";
import ReactionDrawer from "@/components/ui/ReactionDrawer";
import VerificationBadge from "@/components/ui/VerificationBadge";
import usePostStore from "@/store/postStore";
import Image from "next/image";
import Link from "next/link";
import useOnlineUsers from "@/store/onlineUsersStore";
import useAuthStore from "@/store/authStore";
import {
  Trash,
  AlertCircle,
  ArrowRight,
  Heart,
  ArrowUpRight,
  MessageCircle,
  Repeat,
} from "lucide-react";
import { useRouter } from "next/navigation";

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
    onMouseEnter={onHover}
  >
    <button className="group flex items-center gap-2 mx-auto text-black dark:text-zinc-100 transition-colors">
      {icon}
      <span className=" transition-all">
        {count}
        <span className="sr-only">{label}</span>
      </span>
    </button>
    <ReactionDrawer
      isVisible={showDrawer}
      onReact={(_, type) => onClick(type, currentReaction)}
      className="z-50"
      onMouseEnter={onHover}
      onMouseLeave={onMouseLeave}
      postId={postId}
      currentReaction={currentReaction}
    />
  </div>
);
const getBadgeInfo = (role) => {
  if (!role) return null;

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
        description: "Helps maintain community guidelines and content quality",
        color: "text-black dark:text-white",
      };
    default:
      return null;
  }
};
function CommentVerificationBadge({ role }) {
  const badgeInfo = getBadgeInfo(role);
  if (!badgeInfo) return null;

  return (
    <div className="relative inline-flex items-center justify-center">
      <div className="">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-6 h-6 ${badgeInfo.color} inline-block `}
        >
          <path
            fillRule="evenodd"
            d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
// New Comment Section Component
const CommentSection = ({ post, isVisible }) => {
  const [newComment, setNewComment] = useState("");
  const { addComment } = usePostStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(post._id, newComment.trim());
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(error.message || "Failed to add comment");
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="border-t-4 border-black dark:border-darkBorder mt-6 pt-6">
            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-transparent border-2 border-black dark:border-darkBorder dark:text-zinc-100 p-2 focus:outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-4 py-2 bg-black dark:bg-darkBorder text-white dark:text-zinc-100 font-medium hover:bg-black/80 dark:hover:bg-darkHover transition-colors"
              >
                Comment
              </motion.button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {post?.comments?.length > 0 ? (
                post.comments.map((comment) => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4"
                  >
                    <img
                      src={
                        comment.user?.profilePic === "default-avatar.png"
                          ? "/default-avatar.png"
                          : comment.user?.profilePic
                      }
                      alt={comment.user?.name}
                      className="w-10 h-10 border-2 border-black dark:border-darkBorder"
                    />

                    <div className="flex-1">
                      <div className="bg-black/5 dark:bg-white/5 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold dark:text-zinc-100">
                            {comment.user?.name}
                          </h4>
                          <CommentVerificationBadge role={comment.user?.role} />
                        </div>
                        <p className="dark:text-zinc-100">{comment.content}</p>
                      </div>
                      <div className="flex gap-4 mt-2 text-sm text-black/50 dark:text-white/50">
                        <button className="hover:text-blue-500 transition-colors">
                          Like
                        </button>
                        <button className="hover:text-blue-500 transition-colors">
                          Reply
                        </button>
                        <span>{formatDate(comment.createdAt)}</span>
                      </div>
                      {comment.replies.length > 0 && (
                        <div className="flex flex-col gap-2">
                          {comment.replies.map((reply) => (
                            <div
                              id={reply._id}
                              className="flex gap-4 flex-col mt-2 text-sm text-black/50 dark:text-white/50"
                            >
                              <div className="bg-black/5 dark:bg-white/5 p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-bold">
                                    {reply.user?.name}
                                  </h4>
                                  <CommentVerificationBadge
                                    role={reply.user?.role}
                                  />
                                </div>
                                <p>{reply.content}</p>
                              </div>
                              <div>
                                <button className="hover:text-blue-500 transition-colors">
                                  Like
                                </button>
                                {/* <button className="hover:text-blue-500 transition-colors">
                                Reply
                              </button> */}
                                <span>{formatDate(reply.createdAt)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-black/50 dark:text-white/50">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Add this component before PostCard
const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState("spam");
  const [description, setDescription] = useState("");

  const reportReasons = [
    {
      id: "spam",
      label: "Spam",
      description: "Repetitive or unwanted content",
    },
    {
      id: "harassment",
      label: "Harassment",
      description: "Offensive or bullying behavior",
    },
    {
      id: "inappropriate",
      label: "Inappropriate",
      description: "Content that violates community guidelines",
    },
    {
      id: "violence",
      label: "Violence",
      description: "Threats or graphic violence",
    },
    {
      id: "other",
      label: "Other",
      description: "Other reason not listed above",
    },
  ];

  const handleSubmit = () => {
    if (reason === "other" && !description.trim()) {
      return; // Don't submit if "other" is selected but no description
    }
    onSubmit(reason, description);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-darkBorder/10 backdrop-blur-md z-[999]"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] w-[calc(100%-2rem)] max-w-md bg-white dark:bg-[#15202B] border-2 border-black dark:border-darkBorder p-6 z-[1000]"
          >
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold dark:text-zinc-100">
                  Report Post
                </h2>
                <p className="text-black/50 dark:text-white/50">
                  Select a reason for reporting this post
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {reportReasons.map((reportReason) => (
                <label
                  key={reportReason.id}
                  className={`block p-4 border-2 cursor-pointer transition-colors ${
                    reason === reportReason.id
                      ? "border-black dark:border-darkBorder bg-black/5 dark:bg-white/5"
                      : "border-transparent hover:border-black dark:hover:border-darkBorder"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="report-reason"
                      value={reportReason.id}
                      checked={reason === reportReason.id}
                      onChange={(e) => setReason(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 border-2 rounded-full ${
                        reason === reportReason.id
                          ? "border-black dark:border-darkBorder bg-black dark:bg-darkBorder"
                          : "border-black/20 dark:border-white/20"
                      }`}
                    />
                    <div>
                      <p className="font-bold dark:text-zinc-100">
                        {reportReason.label}
                      </p>
                      <p className="text-sm text-black/50 dark:text-white/50">
                        {reportReason.description}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Description field for "other" reason */}
            <AnimatePresence>
              {reason === "other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please describe the issue..."
                    className="w-full bg-transparent border-2 border-black dark:border-darkBorder p-3 focus:outline-none dark:text-zinc-100 placeholder:text-black/50 dark:placeholder:text-white/50 min-h-[100px] resize-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border-2 border-black dark:border-darkBorder font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors dark:text-zinc-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={reason === "other" && !description.trim()}
                className="flex-1 px-4 py-2 bg-red-500 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:hover:bg-red-500"
              >
                Report
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Add PostMenu component
const PostMenu = ({ postId, onReport, posterId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { user } = useAuthStore();

  const handleReport = (reason, description = "") => {
    onReport(postId, reason, description);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-black/5 dark:hover:bg-darkHover dark:text-zinc-100 rounded-full transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#15202B] dark:border-darkBorder border-2 border-black shadow-lg z-50"
            >
              {user?._id !== posterId && (
                <button
                  onClick={() => {
                    setShowReportModal(true);
                    setIsOpen(false);
                  }}
                  className={`w-full ${
                    user?._id === posterId ? "border-b-2" : "border-b-0"
                  } border-darkBorder px-4 py-2 text-left hover:bg-black/5 transition-colors dark:hover:bg-[#2B353F] flex items-center gap-2 text-red-500`}
                >
                  <AlertCircle className="w-5 h-5" />
                  Report Post
                </button>
              )}
              {user?._id === posterId && (
                <button
                  onClick={() => {
                    onReport();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left dark:hover:bg-[#2B353F] hover:bg-black/5 transition-colors flex items-center gap-2 text-red-500"
                >
                  <Trash className="w-5 h-5" />
                  Delete Post
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReport}
      />
    </div>
  );
};

const PostCard = memo(
  ({ post }) => {
    const [showReactions, setShowReactions] = useState(false);
    const router = useRouter();

    const { addReaction, reportPost, removeReaction, currentUserReactions } =
      usePostStore();
    const { onlineUsers } = useOnlineUsers();

    const isOnline = onlineUsers.indexOf(post.user._id) > -1;

    // Fetch post reactions when component mounts

    const totalReactions = Object.values(post?.reactions || {}).reduce(
      (sum, reactions) => sum + reactions.length,
      0
    );

    const handleMouseLeave = () => setShowReactions(false);
    useEffect(() => {
      console.log(currentUserReactions);
    }, [currentUserReactions]);
    const handleReaction = async (type, currentReaction) => {
      addReaction(post._id, type, currentReaction);
    };

    const handleReport = (postId, reason, desc) => {
      reportPost(postId, reason, desc);
    };

    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-2 border-black hover:bg-darkBorder/10 dark:border-[#38444d] hover:translate-x-2 hover:-translate-y-2 hover:shadow-[4px_4px_0_0_#000] dark:hover:shadow-[4px_4px_0_0_rgba(56,68,77,0.4)] transition-all"
      >
        {/* Post Header */}
        <div className="flex pt-8 px-8 items-center gap-4 mb-6">
          <div className="flex-1 flex items-center gap-4">
            <div className="relative">
              <Image
                width={48}
                height={48}
                placeholder="blur"
                blurDataURL={post?.user?.profilePic}
                src={
                  post?.user?.profilePic === "default-avatar.png"
                    ? "/default-avatar.png"
                    : post?.user?.profilePic
                }
                alt={post?.user?.name}
                className="w-12 h-12 border-2 border-black dark:border-darkBorder"
              />{" "}
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#15202B]" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/profile/${post?.user?._id}`);
                  }}
                  className="dark:text-zinc-100 relative before:absolute before:content-[''] before:h-[1px] before:transition-all before:bg-zinc-900 dark:before:bg-zinc-100 before:w-0 hover:before:w-full before:bottom-[2px] transition-colors"
                >
                  {post?.user?.name}
                </button>
                {post?.user?.role && (
                  <VerificationBadge role={post?.user?.role} />
                )}
              </h3>
              <div className="flex items-center gap-2 text-sm text-black/50 dark:text-white/50">
                <time className="font-mono">{formatDate(post?.createdAt)}</time>
                {post.isRepost && (
                  <span className="flex items-center gap-1">
                    • Reposted
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M2.785 5.215c-.694.833-1.115 1.806-1.115 2.785 0 3.314 3.582 6 8 6 4.418 0 8-2.686 8-6s-3.582-6-8-6c-2.92 0-5.473 1.175-6.885 2.785z" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Add Menu Button */}

          <PostMenu
            postId={post?._id}
            onReport={handleReport}
            posterId={post.user._id}
          />
        </div>

        {/* Post Content */}
        <div className="space-y-4 px-8">
          {/* Caption */}
          <p className="text-lg leading-relaxed dark:text-zinc-100">
            {post?.caption}
          </p>

          {/* Hashtags */}
          {post?.hashtags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="text-blue-500 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Media */}
          {post?.media && post.media.length > 0 && (
            <div className="relative w-full aspect-square">
              <Image
                fill
                sizes="100vh"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/2wBDAR0XFx4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                src={post.media[0]}
                alt="Post content"
                className="object-cover border border-black dark:border-darkBorder"
              />
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="px-8">
          <div className="flex border border-r-0 w-full dark:border-darkBorder mt-6 font-mono">
            <ReactionButton
              icon={<Heart className="w-5 h-5" />}
              count={totalReactions}
              label="reactions"
              onHover={() => setShowReactions(true)}
              onClick={handleReaction}
              showDrawer={showReactions}
              onMouseLeave={handleMouseLeave}
              postId={post._id}
              currentReaction={currentUserReactions[post._id]}
            />

            <ReactionButton
              icon={<MessageCircle className="w-5 h-5" />}
              count={post?.comments?.length || 0}
              label="comments"
              onClick={() => setShowComments(!showComments)}
            />

            <ReactionButton
              icon={<Repeat className="w-5 h-5" />}
              count={post?.repostCount || 0}
              label="reposts"
            />
          </div>
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            router.push(`/post/${post._id}`);
          }}
          className="flex justify-center hover:bg-darkHover cursor-pointer dark:hover:bg-darkHover group border-t border-black dark:border-darkBorder p-2 mt-4"
        >
          <button className="text-sm font-medium text-black/50 dark:text-white/50 hover:text-black group-hover:dark:text-white/80 transition-colors flex items-center gap-1">
            View full post
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.article>
    );
  },
  (prevProps, nextProps) => {
    // Update memo comparison to include userReaction
    return (
      JSON.stringify({
        ...prevProps.post,
        userReaction: prevProps.post.userReaction,
      }) ===
      JSON.stringify({
        ...nextProps.post,
        userReaction: nextProps.post.userReaction,
      })
    );
  }
);

PostCard.displayName = "PostCard";

export default PostCard;
