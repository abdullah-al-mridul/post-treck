"use client";
import { motion } from "framer-motion";

export default function Spinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <motion.div
        className="w-16 h-16 border-4 border-black dark:border-white rounded-full border-t-transparent dark:border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-lg font-medium text-black/70 dark:text-white/70"
      >
        Loading...
      </motion.p>
    </div>
  );
}
