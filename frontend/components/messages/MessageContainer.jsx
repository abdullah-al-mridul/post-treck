"use client";
import React, { useState, useRef, useEffect } from "react";
import useMessages from "@/store/useMessages";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
import { motion } from "framer-motion";

const MessageContainer = () => {
  const { selectedChat, sendMessage } = useMessages();
  const { user } = useAuthStore();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    sendMessage(message, selectedChat._id, file);
    setMessage("");
    setFile(null);
  };

  if (!selectedChat) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
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
            d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
        <h2 className="text-2xl font-bold mb-2 dark:text-zinc-100">
          Select a conversation
        </h2>
        <p className="text-black/50 dark:text-white/50">
          Choose a chat from the sidebar to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b-2 border-black dark:border-darkBorder">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 border-2 border-black dark:border-darkBorder">
            <Image
              fill
              sizes="40px"
              className="object-cover"
              src={
                selectedChat.participants.find((p) => p._id !== user._id)
                  ?.profilePic || "/default-avatar.png"
              }
              alt="Profile"
            />
          </div>
          <h2 className="font-bold text-lg dark:text-zinc-100">
            {selectedChat.participants.find((p) => p._id !== user._id)?.name}
          </h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedChat.messages.map((message) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={message._id}
            className={`flex ${
              message.sender._id === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] ${
                message.sender._id === user._id
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-black/5 dark:bg-white/5"
              } p-3 rounded-lg`}
            >
              {message.media && (
                <div className="mb-2">
                  <Image
                    width={200}
                    height={200}
                    src={message.media}
                    alt="media"
                    className="rounded-lg"
                  />
                </div>
              )}
              <p
                className={
                  message.sender._id === user._id ? "" : "dark:text-zinc-100"
                }
              >
                {message.content}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t-2 border-black dark:border-darkBorder"
      >
        <div className="flex gap-2">
          <label className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
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
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-2 border-black dark:border-darkBorder p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-zinc-100 placeholder:text-black/50 dark:placeholder:text-white/50"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={!message.trim() && !file}
          >
            Send
          </button>
        </div>
        {file && (
          <div className="mt-2 p-2 border-2 border-black dark:border-darkBorder rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm truncate dark:text-zinc-100">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 dark:text-zinc-100"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MessageContainer;
