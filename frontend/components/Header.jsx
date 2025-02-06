"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import useAuthStore from "@/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header({ activeTab, setActiveTab }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
  };

  const profileMenuItems = [
    {
      label: "Profile",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      ),
      href: "/profile",
    },
    {
      label: "Settings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      ),
      href: "/settings",
    },
    {
      label: "Logout",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3h15.75"
          />
        </svg>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-24 border-b-4 border-black dark:border-white bg-white dark:bg-black z-50">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center gap-12">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black uppercase tracking-tighter"
          >
            Post Treck
          </motion.h1>

          <div className="hidden md:flex items-center gap-6">
            {["feed", "trending", "following"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 font-bold uppercase ${
                  activeTab === tab
                    ? "text-white dark:text-black bg-black dark:bg-white"
                    : "hover:text-black/70 dark:hover:text-white/70"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-[2px] left-0 w-full h-1 bg-black dark:bg-white"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 px-4 py-2 border-4 border-black dark:border-white bg-transparent
              focus:w-80 focus:translate-x-2 focus:-translate-y-2 focus:shadow-[8px_8px_0_0_#000] dark:focus:shadow-[8px_8px_0_0_#fff]
              transition-all duration-200"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 border-4 border-black dark:border-white group"
            >
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                3
              </div>
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
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </motion.button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-80 border-4 border-black dark:border-white bg-white dark:bg-black shadow-lg"
              >
                <div className="p-4 border-b-4 border-black dark:border-white">
                  <h3 className="font-bold text-lg">Notifications</h3>
                </div>
                {[1, 2, 3].map((notification) => (
                  <div
                    key={notification}
                    className="p-4 border-b-2 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user?.profilePic === "default-avatar.png"
                            ? "/default-avatar.png"
                            : user?.profilePic
                        }
                        alt=""
                        className="w-10 h-10 border-2 border-black dark:border-white"
                      />
                      <div>
                        <p className="font-medium">Someone liked your post</p>
                        <p className="text-sm text-black/50 dark:text-white/50">
                          2 minutes ago
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="relative p-2 border-4 border-black dark:border-white hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] dark:hover:shadow-[4px_4px_0_0_#fff] transition-all"
            >
              <img
                src={
                  user?.profilePic === "default-avatar.png"
                    ? "/default-avatar.png"
                    : user?.profilePic
                }
                alt="Profile"
                className="w-8 h-8"
              />
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 border-4 border-black dark:border-white bg-white dark:bg-black shadow-lg"
                >
                  {/* User Info */}
                  <div className="p-4 border-b-4 border-black dark:border-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user?.profilePic === "default-avatar.png"
                            ? "/default-avatar.png"
                            : user?.profilePic
                        }
                        alt=""
                        className="w-12 h-12 border-2 border-black dark:border-white"
                      />
                      <div>
                        <p className="font-bold">{user?.name || "User Name"}</p>
                        <p className="text-sm text-black/50 dark:text-white/50">
                          {user?.email || "user@email.com"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {profileMenuItems.map((item, index) =>
                      item.href ? (
                        <Link
                          key={index}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ) : (
                        <button
                          key={index}
                          onClick={item.onClick}
                          className="flex items-center gap-3 px-4 py-3 w-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                        </button>
                      )
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
