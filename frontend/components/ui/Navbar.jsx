"use client";
import { motion } from "framer-motion";
import useThemeStore from "@/store/themeStore";
import useAuthStore from "@/store/authStore";
import Link from "next/link";

export function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { logout } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-LightBlack backdrop-blur-2xl border-b border-black dark:border-borderDark z-50">
      <div className="flex items-center justify-between h-full px-8">
        {/* Left side - Logo */}
        <Link
          href="/"
          className="text-2xl font-black text-zinc-900 dark:text-zinc-100"
        >
          POST TRECK
        </Link>

        {/* Right side - Theme Toggle & User Actions */}
        <div className="flex border border-darkBorder  items-center">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 px-4 hover:bg-black/5 border-r border-darkBorder dark:hover:bg-[rgba(247,249,249,0.1)] dark:text-zinc-100 rounded-none transition-colors"
          >
            {theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          {/* Notifications */}
          <button className="p-2 px-4 hover:bg-black/5 dark:hover:bg-[rgba(247,249,249,0.1)] dark:text-zinc-100 rounded-none border-r border-darkBorder transition-colors relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                clipRule="evenodd"
              />
            </svg>
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Logout */}
          <motion.button
            onClick={logout}
            className="px-4 py-2 bg-black dark:bg-darkHover text-white dark:text-zinc-100 font-bold rounded-none hover:opacity-90 transition-opacity"
          >
            Logout
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
