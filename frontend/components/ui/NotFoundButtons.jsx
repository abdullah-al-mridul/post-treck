"use client";
import Link from "next/link";

const NotFoundButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href="/"
        className="px-6 py-3 bg-black dark:bg-darkHover border-2 border-black dark:border-darkBorder dark:text-zinc-100 text-white font-bold hover:opacity-90 transition-opacity"
      >
        Go Home
      </Link>
      <button
        onClick={() => window.history.back()}
        className="px-6 py-3 border-2 border-black dark:border-darkBorder font-bold dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFoundButtons;
