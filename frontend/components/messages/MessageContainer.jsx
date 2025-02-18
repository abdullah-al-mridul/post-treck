"use client";
import React, { useState, useRef, useEffect } from "react";
import useMessages from "@/store/useMessages";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
import { m, motion } from "framer-motion";
import { Cross, X, Image as ImageIcon } from "lucide-react";
import { socket } from "@/socket/socket-client";

const MessageContainer = () => {
  // Store hooks
  const { selectedChat, selectedChatMessages, setSelectedChat, sendMessage } =
    useMessages();
  const { user } = useAuthStore();

  // State hooks
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [fetchedChats, setFetchedChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState("");
  // Ref hooks
  const messagesEndRef = useRef(null);

  // Effect for scrolling to bottom
  useEffect(() => {
    scrollToBottom();
  }, [fetchedChats]);
  useEffect(() => {
    if (selectedChat) {
      setSelectedChatId(selectedChat._id);
    }
  }, [selectedChat]);
  useEffect(() => {
    if (selectedChat) {
      socket.emit("join-chat", selectedChat._id); // Join the chat room
    }

    return () => {
      if (selectedChat) {
        socket.emit("leave-chat", selectedChat._id); // Leave the chat room when unmount
      }
    };
  }, [selectedChat]);

  // Effect for typing status
  useEffect(() => {
    if (selectedChat) {
      if (message.trim()) {
        socket.emit("typing", {
          chatId: selectedChat._id,
          userId: user._id,
          isTyping: true,
        });
      } else {
        socket.emit("typing", {
          chatId: selectedChat._id,
          userId: user._id,
          isTyping: false,
        });
      }
    }
  }, [message, selectedChat]);

  // Effect for socket typing event
  useEffect(() => {
    let typingTimeout;

    socket.on("userTyping", ({ chatId, userId, isTyping }) => {
      if (chatId === selectedChat?._id) {
        setIsTyping(isTyping);

        // যদি ইউজার টাইপ করা বন্ধ করে তাহলে ৩ সেকেন্ড পর isTyping ফালস হয়ে যাবে
        if (isTyping) {
          clearTimeout(typingTimeout);
          typingTimeout = setTimeout(() => {
            setIsTyping(false);
          }, 3000);
        }
      }
    });

    return () => {
      socket.off("userTyping");
      clearTimeout(typingTimeout);
    };
  }, [selectedChat]);

  // Effect for cleaning up preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Listen for new messages
  useEffect(() => {
    socket.on("new-message", (message) => {
      console.log("📩 New message received:", message);
      setFetchedChats((prev) => [...prev, message]);
    });

    return () => {
      socket.off("new-message");
    };
  }, []);

  // Sync fetchedChats with selectedChatMessages
  useEffect(() => {
    setFetchedChats(selectedChatMessages);
  }, [selectedChatMessages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    sendMessage(message, selectedChat._id, file);
    setMessage("");
    setFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
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
        <div className="flex items-center gap-3 justify-between">
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
            <div>
              <h2 className="font-bold text-lg dark:text-zinc-100">
                {
                  selectedChat.participants.find((p) => p._id !== user._id)
                    ?.name
                }
              </h2>
              <p className="text-sm text-black/50 dark:text-zinc-100/70">
                {
                  selectedChat.participants.find((p) => p._id !== user._id)
                    ?.email
                }
              </p>
              {isTyping && (
                <p className="text-sm text-black/50 dark:text-zinc-100/70">
                  Typing...
                </p>
              )}
            </div>
          </div>
          <div>
            <button
              onClick={() => setSelectedChat(null)}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-6 h-6 dark:text-zinc-100" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {fetchedChats?.map((message, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={`${message._id}-${index}`}
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
          <label className="p-2 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <ImageIcon className="w-6 h-6 dark:text-zinc-100" />
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-2 border-black dark:border-darkBorder p-2 focus:outline-none dark:text-zinc-100 placeholder:text-black/50 dark:placeholder:text-white/50"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-black dark:bg-darkBorder text-white dark:text-zinc-100 font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={!message.trim() && !file}
          >
            Send
          </button>
        </div>
        {file && (
          <div className="mt-2">
            <div className="p-2 border-2 border-black dark:border-darkBorder">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm truncate dark:text-zinc-100">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <X className="w-5 h-5 dark:text-zinc-100" />
                </button>
              </div>
              {previewUrl && (
                <div className="relative w-full h-[200px]">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MessageContainer;
