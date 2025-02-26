"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
import useAdminStore from "@/store/adminStore";
import Spinner from "@/components/ui/Spinner";

const DashboardClient = () => {
  const { user } = useAuthStore();
  const { stats, loading, getStates } = useAdminStore();
  useEffect(() => {
    getStates();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (user?.role !== "admin" && user?.role !== "moderator") {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 border-2 border-red-500 dark:border-red-400 relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
            </div>

            {/* Content */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 border-2 border-red-500 dark:border-red-400 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-red-500 dark:text-red-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-red-500 dark:text-red-400">
                    Access Restricted
                  </h1>
                  <p className="text-black/50 dark:text-white/50">
                    Error Code: 403 Forbidden
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-black/70 dark:text-white/70 text-lg">
                  You don't have the required permissions to access this
                  dashboard. This area is restricted to administrators and
                  moderators only.
                </p>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-800">
                  <p className="text-black/60 dark:text-white/60">
                    Current Role:{" "}
                    <span className="font-mono">{user?.role || "user"}</span>
                    <br />
                    Required Role: <span className="font-mono">
                      admin
                    </span> or <span className="font-mono">moderator</span>
                  </p>
                </div>

                <p className="text-sm text-black/50 dark:text-white/50">
                  If you believe this is an error, please contact your system
                  administrator for assistance.
                </p>
              </div>
            </div>
          </motion.div>
          {/* Team Section */}
          <div className="mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-2 bg-black/5 dark:bg-[rgba(247,249,249,0.1)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 dark:text-zinc-100"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-black dark:text-zinc-100">
                    Platform Team
                  </h2>
                  <p className="text-sm text-black/50 dark:text-white/50">
                    Administrators and Moderators
                  </p>
                </div>
              </div>

              {/* Admins Section */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-black/70 dark:text-white/70 mb-4 px-4">
                  Administrators
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {[
                    {
                      name: "John Doe",
                      email: "john@posttreck.com",
                      role: "superadmin",
                      lastActive: "2024-03-20T10:30:00",
                      avatar: "/default-avatar.png",
                    },
                    {
                      name: "Jane Smith",
                      email: "jane@posttreck.com",
                      role: "admin",
                      lastActive: "2024-03-20T09:15:00",
                      avatar: "/default-avatar.png",
                    },
                  ].map((admin, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="block border-2 border-black dark:border-darkBorder p-4 hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] dark:hover:shadow-[8px_8px_0_0_#38444d] transition-all bg-white dark:bg-[#15202B]/50 backdrop-blur-sm h-full">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 border-2 border-black dark:border-darkBorder">
                            <Image
                              src={admin.avatar}
                              alt={admin.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-lg truncate dark:text-zinc-100 flex items-center gap-2">
                              {admin.name}
                              {admin.role === "superadmin" && (
                                <span className="text-xs bg-black dark:bg-white text-white dark:text-black px-2 py-0.5">
                                  SUPER
                                </span>
                              )}
                            </h4>
                            <p className="text-black/50 dark:text-white/50 text-sm truncate">
                              {admin.email}
                            </p>
                          </div>
                          <div className="text-right text-sm text-black/50 dark:text-white/50">
                            <p>Last active</p>
                            <p className="font-mono">
                              {new Date(admin.lastActive).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Moderators Section */}
              <div>
                <h3 className="text-lg font-bold text-black/70 dark:text-white/70 mb-4 px-4">
                  Moderators
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Mike Johnson",
                      email: "mike@posttreck.com",
                      role: "moderator",
                      lastActive: "2024-03-20T11:45:00",
                      avatar: "/default-avatar.png",
                    },
                    {
                      name: "Sarah Wilson",
                      email: "sarah@posttreck.com",
                      role: "moderator",
                      lastActive: "2024-03-20T10:00:00",
                      avatar: "/default-avatar.png",
                    },
                    {
                      name: "Alex Brown",
                      email: "alex@posttreck.com",
                      role: "moderator",
                      lastActive: "2024-03-19T23:30:00",
                      avatar: "/default-avatar.png",
                    },
                  ].map((mod, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="block border-2 border-black dark:border-darkBorder p-4 hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] dark:hover:shadow-[8px_8px_0_0_#38444d] transition-all bg-white dark:bg-[#15202B]/50 backdrop-blur-sm h-full">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 border-2 border-black dark:border-darkBorder">
                            <Image
                              src={mod.avatar}
                              alt={mod.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-lg truncate dark:text-zinc-100">
                              {mod.name}
                            </h4>
                            <p className="text-black/50 dark:text-white/50 text-sm truncate">
                              {mod.email}
                            </p>
                          </div>
                          <div className="text-right text-sm text-black/50 dark:text-white/50">
                            <p>Last active</p>
                            <p className="font-mono">
                              {new Date(mod.lastActive).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, description }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-2 border-black dark:border-darkBorder p-6 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] dark:hover:shadow-[4px_4px_0_0_rgba(56,68,77,0.4)] transition-all bg-white dark:bg-[#15202B]"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-black/50 dark:text-white/50 uppercase font-bold">
            {title}
          </p>
          <p className="text-3xl font-black mt-1 dark:text-zinc-100">{value}</p>
        </div>
        <div className="text-black/80 dark:text-white/80">{icon}</div>
      </div>
      <p className="text-sm text-black/60 dark:text-white/60">{description}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-12 h-12 border-2 border-black dark:border-white flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 dark:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-black dark:text-zinc-100">
              Admin Dashboard
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-black/50 dark:text-white/50 max-w-2xl"
          >
            Welcome back, {user?.name}! Monitor your platform's performance,
            user engagement, and content moderation metrics in real-time.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            description="Total number of registered users on the platform"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            }
          />

          <StatCard
            title="Active Users (24h)"
            value={stats.activeUsers24h}
            description="Users who have logged in within the last 24 hours"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />

          <StatCard
            title="Total Posts"
            value={stats.totalPosts}
            description="Total number of posts created by users"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
            }
          />

          <StatCard
            title="Reported Posts"
            value={stats.reportedPosts}
            description="Posts flagged by users for review"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            }
          />

          <StatCard
            title="Banned Users"
            value={stats.bannedUsers}
            description="Users suspended for violating community guidelines"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;
