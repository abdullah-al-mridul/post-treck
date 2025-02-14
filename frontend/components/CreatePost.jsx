"use client";
import { motion } from "framer-motion";

export default function CreatePost() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 p-6 border-4 border-black dark:border-white bg-white dark:bg-black relative group"
    >
      <textarea
        placeholder="What's on your mind?"
        className="w-full bg-transparent outline-none resize-none mb-6 text-lg placeholder:text-black/50 dark:placeholder:text-white/50"
        rows={3}
      />

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          {/* Image Upload Button */}
          <button className="p-3 border-4 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
            {/* ... Image Icon ... */}
          </button>

          {/* Mention Button */}
          <button className="p-3 border-4 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
            {/* ... Mention Icon ... */}
          </button>
        </div>

        {/* Post Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] dark:hover:shadow-[4px_4px_0_0_#fff] transition-all"
        >
          Post
        </motion.button>
      </div>
    </motion.div>
  );
}
