"use client";
import useFriendRequestsStore from "@/store/friendRequestsStore";
import React, { useEffect } from "react";
import Spinner from "../ui/Spinner";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const FriendReqClient = () => {
  const { friendRequests, loading, getFriendRequests, acceptFriendRequest } =
    useFriendRequestsStore();

  useEffect(() => {
    getFriendRequests();
  }, [getFriendRequests]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 relative">
      {/* Header Section */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/profile"
            className="p-2 hover:bg-black/5 dark:hover:bg-[rgba(247,249,249,0.1)] transition-colors"
          >
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
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-black dark:text-zinc-100">
              Friend Requests
            </h1>
            <p className="text-sm text-black/50 dark:text-white/50">
              {friendRequests.length}{" "}
              {friendRequests.length === 1 ? "request" : "requests"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {friendRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 mb-4 text-black/20 dark:text-white/20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-2 dark:text-zinc-100">
            No Friend Requests
          </h2>
          <p className="text-black/50 dark:text-white/50">
            When someone sends you a friend request, it will appear here
          </p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-4 pb-8">
          <div className="space-y-4">
            {friendRequests.map((request) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={request._id}
                className="border-2 border-black dark:border-darkBorder p-4 bg-white dark:bg-[#15202B]/50 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 border-2 border-black dark:border-darkBorder">
                    {request.profilePic !== "default-avatar.png" ? (
                      <Image
                        fill
                        className="object-cover"
                        sizes="48px"
                        placeholder="blur"
                        blurDataURL={request.profilePic}
                        src={request.profilePic}
                        alt={request.name}
                      />
                    ) : (
                      <Image
                        fill
                        className="object-cover"
                        sizes="48px"
                        src="/default-avatar.png"
                        alt="Default avatar"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-lg truncate dark:text-zinc-100">
                      {request.name}
                    </h2>
                    <p className="text-black/50 dark:text-white/50 text-sm truncate">
                      {request.email}
                    </p>
                  </div>

                  <button
                    onClick={() => acceptFriendRequest(request._id)}
                    className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-opacity"
                  >
                    Accept
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendReqClient;
