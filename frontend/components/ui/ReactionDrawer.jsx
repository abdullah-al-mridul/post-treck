"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import usePostStore from "@/store/postStore";

const reactions = [
  { name: "like", emoji: "👍" },
  { name: "love", emoji: "❤️" },
  { name: "haha", emoji: "😂" },
  { name: "wow", emoji: "😮" },
  { name: "sad", emoji: "😢" },
  { name: "angry", emoji: "😠" },
];

const emojiVariants = {
  hidden: { scale: 0, y: 10 },
  visible: (i) => ({
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 800,
      damping: 30,
      mass: 0.5,
      delay: i * 0.015,
    },
  }),
  hover: {
    scale: 1.2,
    transition: {
      type: "spring",
      stiffness: 800,
      damping: 30,
      mass: 0.5,
      duration: 0.05,
    },
  },
  tap: {
    scale: 0.9,
    transition: {
      duration: 0.05,
    },
  },
  exit: {
    scale: 0,
    transition: {
      duration: 0.05,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 5 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 800,
      damping: 30,
      mass: 0.5,
      staggerChildren: 0.015,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 5,
    transition: {
      duration: 0.1,
    },
  },
};

const tooltipVariants = {
  hidden: { opacity: 0, y: 2 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 800,
      damping: 30,
      mass: 0.5,
    },
  },
  exit: {
    opacity: 0,
    y: 2,
    transition: {
      duration: 0.05,
    },
  },
};

export default function ReactionDrawer({
  isVisible,
  onReact,
  className,
  onMouseEnter,
  onMouseLeave,
  postId,
  currentReaction,
}) {
  const { addReaction, removeReaction } = usePostStore();
  const [hoveredEmoji, setHoveredEmoji] = useState(null);

  const handleReaction = async (type) => {
    try {
      await onReact(type);
    } catch (error) {
      console.error("Error handling reaction:", error);
      alert(error.message || "Failed to update reaction");
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className={`absolute -top-16 left-0 bg-white dark:bg-[#15202B] border-2 border-black dark:border-darkBorder p-2 rounded-full shadow-lg flex gap-1 ${className}`}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {reactions.map((reaction, i) => {
            const isActive = currentReaction === reaction.name;

            return (
              <motion.button
                key={reaction.name}
                custom={i}
                variants={emojiVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReaction(reaction.name);
                }}
                onMouseEnter={() => setHoveredEmoji(reaction.name)}
                onMouseLeave={() => setHoveredEmoji(null)}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center text-2xl
                  ${
                    isActive
                      ? "bg-black/5 dark:bg-white/5"
                      : "hover:bg-black/5 dark:hover:bg-white/5"
                  }
                `}
              >
                <span
                  role="img"
                  aria-label={reaction.name}
                  className="transition-transform duration-50"
                >
                  {reaction.emoji}
                </span>

                {/* Hover Tooltip */}
                <AnimatePresence>
                  {hoveredEmoji === reaction.name && (
                    <motion.span
                      variants={tooltipVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute -top-11 left-1/2 -translate-x-1/2 text-sm font-bold bg-black dark:bg-[#15202B] text-white dark:text-zinc-100 dark:border-darkBorder dark:border-2 px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg"
                    >
                      {reaction.name.charAt(0).toUpperCase() +
                        reaction.name.slice(1)}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active Indicator */}
                {/* {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"
                  />
                )} */}
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
