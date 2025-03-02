"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/formatDate";
import VerificationBadge from "@/components/ui/VerificationBadge";
import { useEffect, useState } from "react";
import useSinglePostStore from "@/store/SPostStore";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import ReactionDrawer from "../ui/ReactionDrawer";
import {
  Edit,
  Heart,
  MessageCircle,
  Trash,
  Flag,
  AlertCircle,
  Repeat,
} from "lucide-react";

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
  type,
}) => {
  const router = useRouter();

  const handleNavigation = () => {
    if (type === "react") {
      router.push(`/post/${postId}/reactors`);
    }
  };

  return (
    <div
      className="relative w-full cursor-pointer border-r dark:border-darkBorder dark:hover:bg-darkHover px-4 py-2"
      onMouseLeave={onMouseLeave}
      onMouseEnter={onHover}
      onClick={handleNavigation} // এখানে ক্লিক করলে ন্যাভিগেট হবে
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
};
const CommentCard = ({ comment, user, postId }) => {
  const [showCommentReactions, setShowCommentReactions] = useState(false);
  const {
    currentCommentReaction,
    reactToComment,
    editComment,
    deleteComment,
    commentReplies,
    currentReplyReaction,
    addReply,
  } = useSinglePostStore();
  const [isReacting, setIsReacting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCommentUpdating, setIsCommentUpdating] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [newContent, setNewContent] = useState(comment.content);
  const [newReply, setNewReply] = useState("");
  const [isAddingReply, setIsAddingReply] = useState(false);
  const handleCommentReactionHover = () => {
    setShowCommentReactions(true);
  };

  const handleCommentReactionLeave = () => {
    setShowCommentReactions(false);
  };

  const handleCommentReaction = async (commentId, type) => {
    // Add your comment reaction logic here
    console.log("Comment reaction:", commentId, type);
    await reactToComment(postId, commentId, type, user, setIsReacting);
  };
  const totalReactions = Object.values(comment.reactions).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  const handleEdit = async (e) => {
    e.preventDefault();
    console.log("Editing comment:", comment._id, newContent);
    await editComment(postId, comment._id, newContent, setIsCommentUpdating);
    setIsEditing(false);
  };

  return (
    <motion.div
      key={comment._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 border-2 border-black dark:border-darkBorder bg-white dark:bg-[#15202B]"
    >
      {/* Comment Header */}
      <div className="flex items-center gap-4 mb-4">
        <Link href={`/profile/${comment.user._id}`} className="block relative">
          <Image
            src={
              comment.user.profilePic === "default-avatar.png"
                ? "/default-avatar.png"
                : comment.user.profilePic
            }
            alt={comment.user.name}
            width={40}
            height={40}
            className="border-2 border-black dark:border-darkBorder"
          />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${comment.user._id}`}
              className="font-bold hover:underline dark:text-zinc-100"
            >
              {comment.user.name}
            </Link>
            {comment.user.role && (
              <VerificationBadge role={comment.user.role} />
            )}
          </div>
          <div className="text-sm text-black/50 dark:text-white/50">
            {formatDate(comment.createdAt)}
          </div>
        </div>
      </div>

      {/* Comment Content */}
      <div className="mb-4">
        {isEditing ? (
          <form onSubmit={handleEdit} className="space-y-0 flex flex-col">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full min-h-[100px] bg-transparent border border-black dark:border-darkBorder p-3 dark:text-zinc-100 focus:outline-none resize-none"
              placeholder="Edit your comment..."
            />
            <div className="flex items-center">
              <button
                type="submit"
                className="px-4 py-2 bg-black disabled:opacity-50 text-sm !border-t-0 disabled:bg-darkHover dark:bg-transparent dark:border dark:border-darkBorder text-white dark:text-zinc-100 font-medium hover:bg-black/80 dark:hover:bg-darkHover transition-colors"
              >
                {isCommentUpdating ? (
                  <div className="h-full">
                    <div className="w-5 h-5 relative">
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-black dark:border-darkBorder !border-t-darkBorder/50"
                        animate={{ rotate: [0, 360] }}
                        style={{
                          scale: 0.8,
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      ></motion.div>
                    </div>
                  </div>
                ) : (
                  "Save"
                )}
              </button>
              {!isCommentUpdating && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-l-0 text-sm border-t-0 border-black dark:border-darkBorder text-black dark:text-zinc-100 font-medium hover:bg-black/5 dark:hover:bg-darkHover transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          <p className="text-black/70 dark:text-white/70 leading-relaxed">
            {comment.content}
          </p>
        )}
      </div>

      {/* Comment Actions */}
      <div className="flex items-center text-sm border border-darkBorder">
        <div
          onMouseEnter={() => handleCommentReactionHover(comment._id)}
          onMouseLeave={() => handleCommentReactionLeave(comment._id)}
          className="relative border-r border-darkBorder flex-1 py-1 h-full hover:bg-darkHover cursor-pointer"
        >
          <button className="flex items-center gap-2 text-black/50 dark:text-white/50 hover:text-black  mx-auto transition-colors">
            {isReacting ? (
              <div className="h-full">
                <div className="w-5 h-5 relative">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-black dark:border-darkBorder !border-t-darkBorder/50"
                    animate={{ rotate: [0, 360] }}
                    style={{
                      scale: 0.8,
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  ></motion.div>
                </div>
              </div>
            ) : (
              <>
                <Heart className="w-4 h-4" />
                <span>{totalReactions || 0}</span>
              </>
            )}
          </button>

          <ReactionDrawer
            isVisible={showCommentReactions}
            onReact={(commentId, type) =>
              handleCommentReaction(commentId, type)
            }
            className="z-50"
            onMouseEnter={() => handleCommentReactionHover(comment._id)}
            onMouseLeave={() => handleCommentReactionLeave(comment._id)}
            postId={comment._id}
            currentReaction={currentCommentReaction[comment._id]}
          />
        </div>

        <button className="flex  flex-1 py-1 items-center gap-2 justify-center text-black/50 dark:text-white/50 hover:text-black dark:hover:bg-darkHover transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>{comment.replies?.length || 0}</span>
        </button>

        {comment.user._id === user._id && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex flex-1 py-1 border-r border-l border-darkBorder items-center dark:hover:bg-darkHover gap-2 justify-center text-black/50 dark:text-white/50 hover:text-blue-500 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
        )}
        {comment.user._id === user._id && (
          <button
            onClick={() =>
              deleteComment(postId, comment._id, setIsDeletingComment)
            }
            className="flex  dark:hover:bg-darkHover flex-1 py-1 items-center gap-2 justify-center text-black/50 dark:text-white/50 hover:text-red-500 transition-colors"
          >
            {isDeletingComment ? (
              <div className="h-full">
                <div className="w-5 h-5 relative">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-black dark:border-darkBorder !border-t-darkBorder/50"
                    animate={{ rotate: [0, 360] }}
                    style={{
                      scale: 0.8,
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  ></motion.div>
                </div>
              </div>
            ) : (
              <>
                <Trash className="w-4 h-4" />
                <span>Delete</span>
              </>
            )}
          </button>
        )}
      </div>
      <div className="mt-6 mb-4">
        <h3 className="text-xl font-bold dark:text-zinc-100">Replies</h3>
      </div>

      {/* Update Reply Input Form */}
      <div className="mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addReply(postId, comment._id, newReply, setIsAddingReply);
            setNewReply("");
          }}
          className="flex"
        >
          <input
            type="text"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 bg-transparent border border-black dark:border-darkBorder p-2 dark:text-zinc-100 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isAddingReply}
            className="px-6 py-2 bg-black dark:bg-transparent border border-l-0 border-black dark:border-darkBorder dark:disabled:hover:bg-transparent dark:hover:bg-darkHover text-white dark:text-zinc-100 font-medium hover:bg-black/80 transition-colors"
          >
            {isAddingReply ? (
              <div className="h-full">
                <div className="w-5 h-5 relative">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-black dark:border-darkBorder !border-t-darkBorder/50"
                    animate={{ rotate: [0, 360] }}
                    style={{
                      scale: 0.8,
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  ></motion.div>
                </div>
              </div>
            ) : (
              "Reply"
            )}
          </button>
        </form>
      </div>
      {commentReplies[comment._id] &&
        commentReplies[comment._id].length > 0 && (
          <>
            {/* Add Replies Header */}

            {/* Replies List */}
            <div className="mt-4 space-y-4">
              {commentReplies[comment._id].map((reply) => (
                <CommentReplyCard
                  key={reply._id}
                  commentId={comment._id}
                  postId={postId}
                  reply={reply}
                  currentReaction={currentReplyReaction[reply._id]}
                  authUser={user}
                />
              ))}
            </div>
          </>
        )}
    </motion.div>
  );
};
const CommentReplyCard = ({
  reply,
  commentId,
  postId,
  currentReaction,
  authUser,
}) => {
  const { user, content, reactions, createdAt } = reply;
  const [showReplyReactions, setShowReplyReactions] = useState(false);
  const [isReacting, setIsReacting] = useState(false);
  const [isDeletingReply, setIsDeletingReply] = useState(false);
  const { reactToReply, deleteReply } = useSinglePostStore();
  const totalReactions = Object.values(reactions).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  const handleReplyReactionHover = () => {
    setShowReplyReactions(true);
  };

  const handleReplyReactionLeave = () => {
    setShowReplyReactions(false);
  };
  const handleReplyReaction = async (replyId, type) => {
    await reactToReply(postId, commentId, replyId, type, user, setIsReacting);
    // console.log(
    //   "postId",
    //   postId,
    //   "commentId",
    //   commentId,
    //   "replyId",
    //   replyId,
    //   "type",
    //   type
    // );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=" p-4 border-2 border-black dark:border-darkBorder bg-white dark:bg-[#15202B]"
    >
      {/* Reply Header */}
      <div className="flex items-center gap-4 mb-4">
        <Link href={`/profile/${user._id}`} className="block relative">
          <Image
            src={
              user.profilePic === "default-avatar.png"
                ? "/default-avatar.png"
                : user.profilePic
            }
            alt={user.name}
            width={32}
            height={32}
            className="border-2 border-black dark:border-darkBorder"
          />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${user._id}`}
              className="font-bold text-sm hover:underline dark:text-zinc-100"
            >
              {user.name}
            </Link>
          </div>
          <div className="text-xs text-black/50 dark:text-white/50">
            {formatDate(createdAt)}
          </div>
        </div>
      </div>

      {/* Reply Content */}
      <div className="mb-4">
        <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">
          {content}
        </p>
      </div>

      {/* Reply Actions */}
      <div className="flex items-center text-xs border border-darkBorder">
        <div
          onMouseEnter={handleReplyReactionHover}
          onMouseLeave={handleReplyReactionLeave}
          className="relative border-r border-darkBorder flex-1 py-1 h-full hover:bg-darkHover cursor-pointer"
        >
          <button className="flex items-center gap-2 text-black/50 dark:text-white/50 hover:text-black mx-auto transition-colors">
            {isReacting ? (
              <div className="h-full">
                <div className="w-4 h-4 relative">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-black dark:border-darkBorder !border-t-darkBorder/50"
                    animate={{ rotate: [0, 360] }}
                    style={{ scale: 0.8 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  ></motion.div>
                </div>
              </div>
            ) : (
              <>
                <Heart className="w-3 h-3" />
                <span>{totalReactions || 0}</span>
              </>
            )}
          </button>

          <ReactionDrawer
            isVisible={showReplyReactions}
            onReact={(replyId, type) => handleReplyReaction(replyId, type)}
            className="z-50"
            onMouseEnter={handleReplyReactionHover}
            onMouseLeave={handleReplyReactionLeave}
            postId={reply._id}
            currentReaction={currentReaction}
          />
        </div>
        {reply.user._id === authUser._id && (
          <button
            disabled={isDeletingReply}
            onClick={() =>
              deleteReply(postId, commentId, reply._id, setIsDeletingReply)
            }
            className="flex flex-1 py-1 border-r-0 border-l-0 border-darkBorder items-center dark:hover:bg-darkHover gap-2 justify-center text-black/50 dark:text-white/50 hover:text-red-500 transition-colors"
          >
            {isDeletingReply ? (
              <div className="h-full">
                <div className="w-4 h-4 relative">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-black dark:border-darkBorder !border-t-darkBorder/50"
                    animate={{ rotate: [0, 360] }}
                    style={{ scale: 0.8 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  ></motion.div>
                </div>
              </div>
            ) : (
              <>
                <Trash className="w-4 h-4" />
                <span>Delete</span>
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};
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
const PostSkeleton = () => {
  return (
    <div className="min-h-screen pt-24 px-4 animate-pulse">
      <div className="max-w-3xl mx-auto">
        {/* Back Button Skeleton */}
        <div className="mb-8">
          <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Post Content Skeleton */}
        <div className="p-8 border-2 border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex-1">
              <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>

          {/* Actions */}
          <div className="mt-6">
            <div className="flex gap-4">
              <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const PostClient = ({ id }) => {
  const {
    post,
    getPost,
    loading,
    currentUserReaction,
    reactToPost,
    isReacting,
    postComments,
    addComment,
    isNewCommenting,
    deletePost,
    reportPost,
  } = useSinglePostStore();
  const [newComment, setNewComment] = useState("");
  const [showReactions, setShowReactions] = useState(false);
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    getPost(id, user);
  }, [id]);

  // if (loading || !post) return <Spinner />;
  if (loading || !post) return <PostSkeleton />;

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
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    await addComment(post._id, newComment);
    console.log(newComment, post._id);
    setNewComment("");
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setIsDeleting(true);
      try {
        // Add deletePost to your store and implement the API call
        await deletePost(post._id);
        router.push("/"); // Redirect to home after deletion
      } catch (error) {
        console.error("Error deleting post:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleReportPost = async (reason, description) => {
    setIsReporting(true);
    try {
      // Add reportPost to your store and implement the API call
      await reportPost(post._id, { reason, description });
    } catch (error) {
      console.error("Error reporting post:", error);
    } finally {
      setIsReporting(false);
    }
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
                priority
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
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
                icon={<Heart className="w-5 h-5" />}
                count={totalReactions}
                label="reactions"
                onHover={() => setShowReactions(true)}
                onClick={handleReaction}
                showDrawer={showReactions}
                onMouseLeave={handleMouseLeave}
                postId={post._id}
                currentReaction={currentUserReaction}
                type="react"
              />
            )}

            <ReactionButton
              icon={<MessageCircle className="w-5 h-5" />}
              count={postComments.length || 0}
              label="comments"
            />

            <ReactionButton
              icon={<Repeat className="w-5 h-5" />}
              count={post?.repostCount || 0}
              label="reposts"
            />

            {/* Add the new report/delete button */}
            {post.user._id === user._id ? (
              <div className="relative w-full cursor-pointer border-r dark:border-darkBorder dark:hover:bg-darkHover px-4 py-2">
                <button
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                  className="group flex mx-auto items-center gap-2 text-red-500 transition-colors hover:text-red-600"
                >
                  {isDeleting ? (
                    <div className="h-full">
                      <div className="w-5 h-5 relative">
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-red-500 !border-t-red-200"
                          animate={{ rotate: [0, 360] }}
                          style={{ scale: 0.8 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        ></motion.div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Trash className="w-6 h-6" />
                      <span>Delete Post</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="relative w-full cursor-pointer border-r dark:border-darkBorder dark:hover:bg-darkHover px-4 py-2">
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  disabled={isReporting}
                  className="group flex mx-auto items-center gap-2 text-yellow-500 transition-colors hover:text-yellow-600"
                >
                  {isReporting ? (
                    <div className="h-full">
                      <div className="w-5 h-5 relative">
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-yellow-500 !border-t-yellow-200"
                          animate={{ rotate: [0, 360] }}
                          style={{ scale: 0.8 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        ></motion.div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Flag className="w-6 h-6" />
                      <span>Report Post</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div
            id="comments"
            className=" border-black dark:border-darkBorder p-8"
          >
            <h2 className="text-xl font-bold mb-6 dark:text-zinc-100">
              Comments
            </h2>

            <form onSubmit={handleCommentSubmit} className="mb-8 flex">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-transparent border-2 border-black dark:border-darkBorder p-2 dark:text-zinc-100 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isNewCommenting}
                className="px-6 py-2 bg-black dark:bg-transparent border-2 border-l-0 border-darkBorder dark:disabled:hover:bg-transparent dark:hover:bg-darkHover text-white dark:text-zinc-100 font-medium hover:bg-black/80  transition-colors"
              >
                {isNewCommenting ? (
                  <div className="h-full">
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
                  </div>
                ) : (
                  "Comment"
                )}
              </button>
            </form>

            {postComments?.length === 0 ? (
              <p className="text-center text-black/50 dark:text-white/50 py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-6">
                {postComments.map((comment) => (
                  <CommentCard
                    key={comment._id}
                    comment={comment}
                    postId={post._id}
                    user={user}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.article>
      </div>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportPost}
      />
    </div>
  );
};

export default PostClient;
