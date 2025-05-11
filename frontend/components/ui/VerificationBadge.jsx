"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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

export default function VerificationBadge({ role }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const badgeInfo = getBadgeInfo(role);

  if (!badgeInfo) return null;

  return (
    <div className="relative inline-flex items-center justify-center">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="cursor-help"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-[18px] h-[18px] ${badgeInfo.color} inline-block ml-2`}
        >
          {/* Circle background */}
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />

          {/* Checkmark inside the circle */}
          <path
            fillRule="evenodd"
            d="M16.707 8.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L10 13.586l5.293-5.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 top-full mt-2"
          >
            <div className="relative w-48 px-4 py-3 bg-white dark:bg-darkBorder/60 border-4 border-black backdrop-blur-lg dark:border-darkBorder shadow-lg">
              {/* Arrow */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-black dark:border-b-darkBorder" />

              <h4 className="font-bold dark:text-zinc-100 mb-1">
                {badgeInfo.title}
              </h4>
              <p className="text-sm text-black/70 dark:text-zinc-100">
                {badgeInfo.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
