"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";
import useAdminStore from "@/store/adminStore";
import { formatDate } from "@/utils/formatDate";

const BanButton = ({ user }) => {
  const { loadingUsers, openBanModal, toggleUserBan, closeBanModal } =
    useAdminStore();
  const isLoading = loadingUsers[user._id];

  const handleClick = async (e) => {
    e.preventDefault();
    if (user.isBanned) {
      // Direct unban with loading in card
      try {
        openBanModal(user._id, "unban");
        await toggleUserBan();
        closeBanModal();
      } catch (error) {
        console.log("Failed to unban user");
        closeBanModal();
      }
    } else {
      // Show modal for ban
      openBanModal(user._id, "ban");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={user.isBanned && isLoading}
      className={`
        px-4 py-2 text-sm font-bold border-t border-darkBorder w-full transition-all
        ${
          user.isBanned
            ? " text-green-500 hover:bg-green-500 hover:text-white  dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-black"
            : " text-red-500 hover:bg-red-500 hover:text-white  dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-black"
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {user.isBanned && isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </span>
      ) : user.isBanned ? (
        "Unban User"
      ) : (
        "Ban User"
      )}
    </button>
  );
};

const RoleButton = ({ user }) => {
  const { loadingUsers, openRoleModal } = useAdminStore();
  const isLoading = loadingUsers[user._id];

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        openRoleModal(user._id, user.role);
      }}
      disabled={isLoading}
      className="px-4 py-2 text-sm font-bold border-t border-l border-black dark:border-darkBorder text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-darkHover transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full"
    >
      Change Role
    </button>
  );
};

const UsersClient = () => {
  const { user: AuthUser } = useAuthStore();
  const { users, loading, getUsers, toggleUserBan } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    getUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (AuthUser?.role !== "admin" && AuthUser?.role !== "moderator") {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 border-2 border-red-500 dark:border-red-400 relative overflow-hidden"
          >
            <h1 className="text-2xl font-bold text-red-500 dark:text-red-400">
              Access Restricted
            </h1>
            <p className="mt-2 text-black/70 dark:text-white/70">
              You need administrator privileges to view this page.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "banned" && user.isBanned) ||
      (statusFilter === "active" && !user.isBanned);
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 group border-2 border-black dark:border-darkBorder px-4 py-2 hover:shadow-[4px_4px_0_0_#000] dark:hover:shadow-[4px_4px_0_0_rgba(56,68,77,0.4)] transition-all bg-white dark:bg-[#15202B]"
          >
            <div className="p-1 bg-black/5 dark:bg-white/5 group-hover:-translate-x-1 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 dark:text-zinc-100 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
                />
              </svg>
            </div>
            <span className="font-bold text-sm dark:text-zinc-100">
              Back to Dashboard
            </span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
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
              Manage Users
            </h2>
            <p className="text-sm text-black/50 dark:text-white/50">
              View and manage all platform users
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border-2 border-black dark:border-darkBorder bg-transparent dark:text-white pr-10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-darkBorder focus:ring-opacity-20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full appearance-none p-3 border-2 border-black dark:border-darkBorder bg-transparent dark:text-white pr-10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-darkBorder focus:ring-opacity-20"
            >
              <option value="all" className="bg-white dark:bg-[#15202B]">
                All Roles
              </option>
              <option value="user" className="bg-white dark:bg-[#15202B]">
                Users
              </option>
              <option value="moderator" className="bg-white dark:bg-[#15202B]">
                Moderators
              </option>
              <option value="admin" className="bg-white dark:bg-[#15202B]">
                Admins
              </option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none p-3 border-2 border-black dark:border-darkBorder bg-transparent dark:text-white pr-10 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-darkBorder focus:ring-opacity-20"
            >
              <option value="all" className="bg-white dark:bg-[#15202B]">
                All Status
              </option>
              <option value="active" className="bg-white dark:bg-[#15202B]">
                Active Users
              </option>
              <option value="banned" className="bg-white dark:bg-[#15202B]">
                Banned Users
              </option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredUsers?.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/profile/${user._id}`}
                className="border-2 border-black flex flex-col justify-between dark:border-darkBorder hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] dark:hover:shadow-[4px_4px_0_0_rgba(56,68,77,0.4)] transition-all bg-white dark:bg-[#15202B]/50 backdrop-blur-sm h-full"
              >
                <div className="flex items-center gap-4 p-3">
                  <div className="relative w-12 h-12 border-2 border-black dark:border-darkBorder">
                    <Image
                      src={
                        user.profilePic === "default-avatar.png"
                          ? "/default-avatar.png"
                          : user.profilePic
                      }
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-lg truncate dark:text-zinc-100 flex items-center gap-2">
                      {user.name}
                      {user.role !== "user" && (
                        <span
                          className={`text-xs px-2 py-0.5 ${
                            user.role === "admin"
                              ? "bg-black dark:bg-white text-white dark:text-black"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {user.role.toUpperCase()}
                        </span>
                      )}
                      {user.isBanned && (
                        <span className="text-xs bg-red-500 text-white px-2 py-0.5">
                          BANNED
                        </span>
                      )}
                    </h4>
                    <p className="text-black/50 dark:text-white/50 text-sm truncate">
                      {user.email}
                    </p>
                    {user.isBanned && user.banReason && (
                      <p className="mt-2 text-red-500 dark:text-red-400 text-sm italic">
                        Ban reason: {user.banReason}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-sm text-black/50 dark:text-white/50">
                    <p>Last active</p>
                    <p className="font-mono">{formatDate(user.lastActive)}</p>
                  </div>
                </div>
                <div>
                  {AuthUser?.role === "admin" &&
                    AuthUser?._id !== user?._id && (
                      <div className="flex mt-4">
                        <BanButton user={user} />
                        <RoleButton user={user} />
                      </div>
                    )}
                  <div className=" border-t border-black/10 dark:border-white/10 grid grid-cols-3 text-sm">
                    <div className=" w-full text-center p-3 border-r border-black/10 dark:border-white/10">
                      <p className="font-bold text-2xl dark:text-white">
                        {user.friends.length}
                      </p>
                      <p className="text-black/50 text-sm dark:text-white/50">
                        Friends
                      </p>
                    </div>
                    <div className="w-full text-center p-3 border-r border-black/10 dark:border-white/10">
                      <p className="font-bold text-2xl dark:text-white">
                        {user.followers.length}
                      </p>
                      <p className="text-black/50 text-sm dark:text-white/50">
                        Followers
                      </p>
                    </div>
                    <div className="w-full text-center p-3">
                      <p className="font-bold text-2xl dark:text-white">
                        {user.following.length}
                      </p>
                      <p className="text-black/50 text-sm dark:text-white/50">
                        Following
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersClient;
