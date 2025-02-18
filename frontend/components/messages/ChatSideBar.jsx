"use client";
import React, { useEffect } from "react";
import useMessages from "@/store/useMessages";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
import { motion } from "framer-motion";
import Spinner from "../ui/Spinner";
import { SearchUserModal } from "./MessageContainer";

const ChatSideBar = () => {
  const {
    loading,
    userChats,
    setIsSearchModalOpen,
    getUserChats,
    setSelectedChat,
    selectedChat,
  } = useMessages();
  const { user } = useAuthStore();

  useEffect(() => {
    getUserChats();
  }, [getUserChats]);

  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black dark:text-zinc-100">Messages</h1>
        <button
          onClick={handleOpenSearchModal}
          className="p-2 hover:bg-black/5 dark:hover:bg-[rgba(247,249,249,0.1)] ggtransition-colors"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-2">
        {userChats.map((chat) => {
          const participant = chat.participants.find((p) => p._id !== user._id);

          return (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-3 flex items-center gap-3 border-2 transition-all ${
                selectedChat?._id === chat._id
                  ? "border-black dark:border-darkBorder bg-black/5 dark:bg-white/5"
                  : "border-transparent hover:border-black dark:hover:border-darkBorder"
              }`}
            >
              <div className="relative w-12 h-12 border-2 border-black dark:border-darkBorder">
                {participant?.profilePic !== "default-avatar.png" ? (
                  <Image
                    fill
                    sizes="48px"
                    className="object-cover"
                    src={participant.profilePic}
                    alt={participant.name}
                  />
                ) : (
                  <Image
                    fill
                    sizes="48px"
                    className="object-cover"
                    src="/default-avatar.png"
                    alt="Default avatar"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-bold flex items-center gap-1.5 truncate dark:text-zinc-100">
                  {participant.name}
                  {participant?.role === "admin" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-blue-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {participant?.role === "moderator" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-gray-400"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </h3>
                <p className="text-sm text-black/50 dark:text-white/50 truncate">
                  {chat.messages[chat.messages.length - 1]?.content ||
                    "No messages yet"}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
      <SearchUserModal onClose={() => setIsSearchModalOpen(false)} />
    </div>
  );
};

export default ChatSideBar;
