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
          className={`w-6 h-6 ${badgeInfo.color} inline-block ml-2`}
        >
          <path
            fillRule="evenodd"
            d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
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
            <div className="relative w-48 px-4 py-3 bg-white dark:bg-darkBorder/50 border-4 border-black backdrop-blur-md dark:border-darkBorder shadow-lg">
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
