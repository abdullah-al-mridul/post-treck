"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import usePostStore from "@/store/postStore";

const reactions = [
  {
    name: "like",
    emoji: "👍",
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAK4ElEQVR4nO1Za0yb5xX21kmbNmnVAgTwBd8w9xBuCUkgpCFpUpKmpE2b9Jq2W9f0Eu3PtP2YNq3S9md/92Oa1Eld1a204RYC4X5LuNgYsPEFczOEVGobCDbGNtj+/Pl7pvO+ZqPaH9DWlkg50lGiSPl4n/ec5znPeZHJHsbDeBjfSPhbU5ICTcm5sgcxAt17k9c7U1eD7SkI3EyuR2v692UPUkRupb0RvqVCqFeJ9S45Am3J78kepBBMmhphSI3wQBpC/Ups9Mg9+L3su7IHIdB37HviqG5ZNGshGDWIDKpB1Qj3q7NlD0LAoq+WrOmIWfQQx3SIjmjBqtGvOCPb7QHIvgOboVeaMICDSEdsXM9AhAc11bLdHrDnXYUjG7BnADYDGJBNECbNKdluDjgKz8FREIIzH3DkAvbMr4CAWZMp242BseIfwlX2F0wekjB5AJgsApz74yCyGIiYNT2CPvUPZLstMHWyBFOVU5h6DJg6CriOAJOlwGTxFhBUifQB2W4K4LlHMFP1G8xUCZg5DUw/DkxXAlMVgKsMcG0FkUOc+INstwRmntFh9ukBzJ0HZquB2SeBmSpg5lQcxLF4JQ4CziLAsY8A5Mt2Q2D+4gXMXVyH+yJ4PgvMPQ3MPgXMntkCgtrpMDBZAjjyrbLdEHBf/DXcL8Qw/zJ4vgTMv8CBzD3DQVAlqJ2IE65ywFkKOAs/xFjxo9/ewSde/hHcl95nB154FVh4HVj4KXDnNWD+VQ5kjkCcj7fTaWBqs5UOsTaKWfIgmDIjokm/LAzp3MEutcPblmbxNirH7tfJHZ5G+dRai6Ir2KX83drNxCoaiDs+6JqxwBAxl+RhssKA2eN6zJw9irnq9+C+8Dm76YXLwJ2fAXeuAItvx/98E7jzOuB+CXBfAGbPATNPQHJVQnJWIGopRmgwB75WPe7Xp2H5EwV8zSqs92ggGPWQbFmc5DT8SG4t6cw/rXenduGDHciuMJJ3OGzMlwRzEcSJI5CmTgKzZ/mtup8D5l/kt794Bbj7LnD3F8DiVeDu28Diz3klqArxNpImj0MYP4TQQB58rem4V6OCp04BcVTHDorJQt5mjPxxEZiuYKpFg49ABNpT/rRtAKGhrD9GRvJBAGI2AnCCk3KueguA1zkAOjjLd4HFd3gV5l/jXJg9B8l1CqL9GMKmYgR7cuBp1GGpRonwgIYdjpGbWo1a7w614hvAAv3/S7z9JouZ9Qj1Kj/bPoDhzJbIyD4Io1SBw5Coh+lW6EbnLgDuF3j7LL4VP/Tm4amVqAKvxFvoScSclYjZjiI8UoRAuwH3azVYrlFCNOv4ZKabp29S69H37r7Dv02ACJirFDFLBjb6lP5tAwgPZY5HRvIgjBYgZi8Fpqm8p/kHqY2oAnRbDMDbW/IKr4z7eQZWmjoNcaICku0IwsYC+Dsy4G3U4F6NHMKwmleApJXkliTY/XIc/CXOH9dRSPYc5l6DHan12wcwnLEYMeVCMOcjZjvIJ+r0SUZIzD3F5ZKV+0o8Cchb/N/cL/JWmzkD0VqOmL0CkqMMUXMBgr1ZWGnUMQ6sNikQG9NzDpDhY76pDJiioXcAcOQxgFSpjR65z9+wZ/sLUNho8ERM2RDMeYjZirmGTx/nmk5kpv4mFSL5JNIuUMkvx2+OD7GotZwRV5okAIcRGS1AsC8T3iYtlj5R4YsP5VipT8V6bxoiw2pER3SIjtLCw5eeqFHLNjd/azJWG/eE/XUJWTtoIX0wYsqAMJqLmLWQGzKapgRi5vE4mS/ySlA70cHdNLzOANNPMOUSzAcBOryrDKK1BBFjHvxdBtyvV+NejQLexmRs9CoQGUxD1KRlisTSrGOqE76twnqnHGvXE+FrTMBqw56/bh/AoFaImNIRHc2EaCE/X8LVYqqcDyQCMX2Gc4IqQq01cwqS6wSi4wchjJVAcpZzI+cohTC6H8HeTKw289tfvaGghYbvBbZMwFnAhxx5Jjbs9kOyZTD1IYDBjlSsNiYMbxtAaFAbixh1EEbIu+dAshdwsm3+EKoG8YIUhAjuegwx2yFERwsRHS+BxA5yGHAegGgrQNiUi0CXAZ5GNe59rKR1Mk7gUi4Oc8/ySrIkO3KBE3uyBJLVwHboQHtKy/YBDGjC4WEtBJMOsfEMSBN5/JbIEhPBXKWQ7AcQsxYjOlaAKJPc/YjZiIiHuPNkxq0Qkm0fIsZsBLrS4W0gAApEhnV8N5g+ziWUhiLJL6kYSejCK8DseX5J9mxG9o0exeVtA9i4rQ7QLQlG6ks9pIlMwJ7L1YKAkJ+x5kO0FEC0HoDkpKpQy9DhS8iwce9v3wfJlgfiU7DHAM91LZY+VsHXouIAXIc4b0h2SQjuvMnBUEVYBYrZPh0b09cBO3hH2uhXr4QGNYhQFcw65knYYu4gr0JAingrbZKa2oAtMieYdrMqOeMr5EQWhJFMBsDbpMbypyp8/kEK1lpVEEayER3ndkW0V0C0PQbRdhSitRTi+H5EzenY6JIHAk17k7d9eAagRzUXuqVGKF6F6Kie9liAFnJbFiRnSZzMVXwukH1mSd7nNOCqABzFkGzZEMeyEB7Mgr9Dj5V6Nb78OBW+pr0I9SnZMCPloTejzScXegAj4m50y+HbVKDGhF/uCIC/XWlc71UhdCsNkSENBJMW0RE9AyJashCzH4TkOh5XofP/ldL0E5AmyyFaixA28dv3NGlxj7UPKZCWvRPBuY8rFVWOKkmWhcjvyGWAIkNq0IOwryHh/R0BWGuT1wa7FAj2qBDqT0N4QI3woBoReho0pUO0FCPmOAZp6iykGZq657+S0vRZSM5jbIqHh7MR6EzHSoMGX/5Dzr4jTWTwFpyNmzi2V7zGhyOzIWe4UEwYWDXWmpN2tkOvtST/yt8mR6BDgWCXkgGhimz0pSF8Ow2CMRtRSylERyViU+cgTVczICynqxGbPAXRVgZxvAihQQKgx0qjGl9+pED4tobziRRm9ukttvxq3Ahe5oPSVcaARozqqL81JWdHAHwtj+p8N/Z+5mtJ/dx3M3XZ3yaPBjsVCHb+B0xoIAtRczH3O44TEJ2neNLfLUcgjBUjYspBaCATwe50eG5osVSjwP16OZ8BtNy7yoEZ2jMuAPOXOI9oKLI2yoY4nh4LDaRdlf2vQU/hgQ5Fpe+mvMHfLo8FqTKdSmz06hC6nY2wMR/CSDEEcyEE036Eh3IRvq1HqF+DjT49A+Br0eF+XRprI299CkgkRLIO41kQLTkQx3MRHc1G1GxgUzp8S+URhpQHZP/vWGtJPrvWkhJYu5kKf5uCt1mnAuvdSqx3q1jL0S8x1hmH1Fjv1mKtXQfvdSKxkrvQcVofqQrZ9ErB057BiM1WyM5Upj4rrXt+LPs6wt+QVO69nrRKcsjyRjLWmlPgb07BWnMy/C3J8DWnINCmgr9DA2+zBit1Kiz9U86mOxuIJLfu5+Ou9hVg/nk+vBw5rDLBztQQrskekX1dsVqbWLhSm2D11ibAW7c1E3k2JMHXpIDvZhq8TRos16bhi4/IRui51aCFZYEI/C7fKdgGVsXAkcnb6Ff9WfZNhPdaUvnKtcTfeq795G8rtQktK7V7+j3XEs2ea4kTnoak2dWm1CVvkyroua4OL32qinquq0TJRjbicHxJqoo/vdASX0QLjiiYtH/f1b8IxIg6BRO6StgNJ/+dFsPJqEV7MtinTvm2z/cwHobsAYp/AUzULICT6FM1AAAAAElFTkSuQmCC",
  },
  {
    name: "love",
    emoji: "❤️",
    src: "data:image/png;base64,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",
  },
  {
    name: "haha",
    emoji: "😂",
    src: "data:image/png;base64,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",
  },
  {
    name: "wow",
    emoji: "😮",
    src: "data:image/png;base64,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",
  },
  {
    name: "sad",
    emoji: "😢",
    src: "data:image/png;base64,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",
  },
  {
    name: "angry",
    emoji: "😠",
    src: "data:image/png;base64,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",
  },
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
  // const { addReaction, removeReaction } = usePostStore();
  const [hoveredEmoji, setHoveredEmoji] = useState(null);

  const handleReaction = (type) => {
    onReact(postId, type);
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
                  {/* {reaction.emoji} */}
                  <img
                    style={{
                      width: "90%",
                      margin: "0 auto",
                    }}
                    src={reaction.src}
                    alt={reaction.name}
                  />
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
