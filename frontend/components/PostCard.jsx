"use client";
import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/utils/formatDate";
import ReactionDrawer from "@/components/ui/ReactionDrawer";
import VerificationBadge from "@/components/ui/VerificationBadge";
import usePostStore from "@/store/postStore";
import Image from "next/image";
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
  isReacting,
}) => (
  <div
    className="relative w-full cursor-pointer border-r dark:border-borderDark dark:hover:bg-borderPinkLight/10 px-4 py-2"
    onMouseLeave={onMouseLeave}
    onClick={label !== "reactions" ? onClick : undefined}
    onMouseEnter={onHover}
  >
    <button className="group flex items-center gap-2 mx-auto text-black dark:text-white/80 transition-colors">
      {isReacting ? (
        <div className="w-5 h-5 relative">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-black dark:border-darkBorder !border-t-darkBorder/50"
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          ></motion.div>
        </div>
      ) : (
        <>
          {icon}
          <span className=" transition-all">
            {count}
            <span className="sr-only">{label}</span>
          </span>
        </>
      )}
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
const PostMenu = ({ postId, onReport, posterId, onDelete, isDeleting }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { user } = useAuthStore();

  const handleReport = (reason, description = "") => {
    onReport(postId, reason, description);
  };

  const handleDeletePost = (postId) => {
    onDelete(postId);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-black/5 dark:hover:bg-borderPinkLight/10 dark:text-white/80 border border-borderDark transition-colors"
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
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: -10,
                transition: { duration: 0.2 },
              }}
              className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#0D0D0D] dark:border-borderDark border border-black shadow-lg z-50 
            "
            >
              {user?._id !== posterId && (
                <button
                  onClick={() => {
                    setShowReportModal(true);
                    setIsOpen(false);
                  }}
                  className={`w-full ${
                    user?._id === posterId ? "border-b" : "border-b-0"
                  } px-4 py-2 text-left  transition-colors dark:border-borderDark flex items-center gap-2 text-red-500 dark:hover:bg-borderPinkLight/10`}
                >
                  <AlertCircle className="w-5 h-5" />
                  Report Post
                </button>
              )}
              {/* user?._id === posterId */}
              {user?._id === posterId && (
                <button
                  onClick={() => {
                    handleDeletePost(postId);
                  }}
                  disabled={isDeleting}
                  className="w-full px-4 py-2 text-left dark:hover:bg-borderPinkLight/10 hover:bg-black/5 transition-colors flex items-center gap-2 text-red-800 tracking-wider"
                >
                  {/* isDeleting */}
                  {isDeleting ? (
                    <div className="w-5 h-5 relative">
                      <motion.div
                        className="absolute inset-0 rounded-full border border-black dark:border-borderDark !border-t-borderDark/50"
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      ></motion.div>
                    </div>
                  ) : (
                    <Trash className="w-5 h-5" />
                  )}
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

    const {
      addReaction,
      reportPost,
      currentUserReactions,
      isReacting,
      deletePost,
      isPostDeleting,
    } = usePostStore();
    const { onlineUsers } = useOnlineUsers();

    const isOnline = onlineUsers.indexOf(post.user._id) > -1;

    const totalReactions = Object.values(post?.reactions || {}).reduce(
      (sum, reactions) => sum + reactions.length,
      0
    );

    const handleMouseLeave = () => setShowReactions(false);
    const handleReaction = async (type, currentReaction) => {
      addReaction(post._id, type, currentReaction);
    };
    const handleDeletePost = (postId) => {
      deletePost(postId);
    };
    const handleReport = (postId, reason, desc) => {
      reportPost(postId, reason, desc);
    };

    return (
      <>
        <div className=" border border-borderDark h-6 w-full border-t-0 border-b-0"></div>
        <article
          className="bg-[repeating-linear-gradient(45deg,_#333_0px,_#333_1px,_transparent_1px,_transparent_6px)] dark:bg-[repeating-linear-gradient(45deg,_rgba(39,39,39,0.2)_0px,_rgba(39,39,39,0.2)_1px,_transparent_1px,_transparent_6px)]
 p-4 border border-borderDark transition-all group"
        >
          <div className=" border border-borderDark bg-[#0D0D0D] group-hover:bg-borderDark/10 backdrop-blur-md transition-colors">
            {/* Post Header */}
            <div className="flex  border-t-0 border-borderDark p-3  items-center gap-4 border mx-8">
              <div className="flex-1 flex">
                {" "}
                {/* Removed items-stretch - not needed here */}
                <div className="relative flex-shrink-0 border border-black dark:border-borderDark">
                  {" "}
                  {/* Added flex-shrink-0 to prevent image squishing */}
                  {post?.user?.profilePic !== "default-avatar.png" ? (
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
                      className="w-12 h-12 "
                    />
                  ) : (
                    <div className=" w-12 h-12 dark:bg-[repeating-linear-gradient(45deg,_rgba(138,5,255,0.2)_0px,_rgba(138,5,255,0.2)_1px,_transparent_1px,_transparent_7px)]"></div>
                  )}
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#15202B]" />
                  )}
                </div>
                <div className="flex flex-col border border-l-0 border-borderDark px-4 pr-8 justify-center relative">
                  {/* Changed structure */}
                  <h3 className="font-bold text-md flex items-center">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`/profile/${post?.user?._id}`);
                      }}
                      className="dark:text-white/80 font-normal relative before:absolute before:content-[''] before:h-[1px] before:transition-all before:bg-zinc-900 dark:before:bg-white/80 before:w-0 hover:before:w-full before:bottom-[2px] transition-colors tracking-wider"
                    >
                      {post?.user?.name}
                    </button>
                    {post?.user?.role && (
                      <VerificationBadge role={post?.user?.role} />
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-black/50 dark:text-white/50 tracking-wider">
                    <time className="font-mono">
                      {formatDate(post?.createdAt)}
                    </time>
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
                onDelete={handleDeletePost}
                isDeleting={isPostDeleting[post?._id]}
              />
            </div>

            {/* Post Content */}
            <div className="space-y-4 mx-8 border-r border-l border-borderDark py-6">
              <div className="  border-t border-b border-borderDark py-3">
                {/* Caption */}
                <p className="text-lg leading-relaxed dark:text-white/80 px-3">
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
            </div>

            {/* Post Actions */}
            <div className="px-8">
              <div className="flex border border-r-0 w-full dark:border-borderDark font-mono">
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
                  isReacting={isReacting[post._id]}
                />

                <ReactionButton
                  icon={<MessageCircle className="w-5 h-5" />}
                  count={post?.comments?.length || 0}
                  label="comments"
                  onClick={() => {
                    router.push(`/post/${post._id}#comments`);
                  }}
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
              className="flex justify-center hover:bg-darkHover cursor-pointer dark:hover:bg-borderPinkLight/10 group border border-black dark:border-borderDark p-2 mx-8 border-t-0 border-b-0"
            >
              <button className="text-sm font-medium text-black/50 dark:text-white/80 hover:text-black group-hover:dark:text-white/80 transition-colors flex items-center gap-1">
                View full post
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </article>
      </>
    );
  },
  (prevProps, nextProps) => {
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
