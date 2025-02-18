"use client";
import React, { useEffect } from "react";
import useMessages from "@/store/useMessages";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
import { motion } from "framer-motion";
import Spinner from "../ui/Spinner";

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
                <h3 className="font-bold truncate dark:text-zinc-100">
                  {participant.name}
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
    </div>
  );
};

export default ChatSideBar;
