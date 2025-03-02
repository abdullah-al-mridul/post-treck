"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, MessageSquare, Heart, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/utils/formatDate";

const NotificationCard = ({ notification, onDelete, onMarkAsRead }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingRead, setIsMarkingRead] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(notification._id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkAsRead = async () => {
    setIsMarkingRead(true);
    try {
      await onMarkAsRead(notification._id);
    } finally {
      setIsMarkingRead(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`group p-6 border-2 border-black dark:border-darkBorder hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] dark:hover:shadow-[4px_4px_0_0_rgba(56,68,77,0.4)] transition-all ${
        !notification.read
          ? "bg-black/5 dark:bg-white/5"
          : "bg-white dark:bg-[#15202B]"
      }`}
    >
      <div className="flex items-start gap-6">
        {/* Sender Profile Picture */}
        <Link
          href={`/profile/${notification.sender._id}`}
          className="flex-shrink-0 relative group-hover:scale-105 transition-transform"
        >
          <Image
            src={
              notification.sender.profilePic === "default-avatar.png"
                ? "/default-avatar.png"
                : notification.sender.profilePic
            }
            alt={notification.sender.name}
            width={48}
            height={48}
            className="border-2 border-black dark:border-darkBorder"
          />
          {!notification.read && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-black dark:border-darkBorder" />
          )}
        </Link>

        {/* Notification Content */}
        <div className="flex-grow">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href={`/profile/${notification.sender._id}`}
                  className="font-bold text-sm hover:underline dark:text-zinc-100"
                >
                  {notification.sender.name}
                </Link>
                {notification.type === "comment" ? (
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                ) : (
                  <Heart className="w-4 h-4 text-red-500" />
                )}
              </div>
              <Link
                href={`/post/${notification.post._id}`}
                className="text-sm dark:text-zinc-100 hover:underline block mb-2"
              >
                {notification.message}
              </Link>
              <span className="text-xs text-black/50 dark:text-white/50">
                {formatDate(notification.createdAt)}
              </span>
            </div>

            {/* Post Thumbnail if exists */}
            {notification.post.media && notification.post.media.length > 0 && (
              <Link
                href={`/post/${notification.post._id}`}
                className="flex-shrink-0 group-hover:scale-105 transition-transform"
              >
                <Image
                  src={notification.post.media[0]}
                  alt="Post thumbnail"
                  width={80}
                  height={80}
                  className="border-2 border-black dark:border-darkBorder object-cover"
                />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-6">
        {!notification.read && (
          <button
            onClick={handleMarkAsRead}
            disabled={isMarkingRead}
            className="flex items-center gap-2 px-4 py-2 text-xs border-2 border-black dark:border-darkBorder hover:translate-x-1 hover:-translate-y-1 hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_rgba(56,68,77,0.4)] transition-all dark:text-zinc-100 bg-white dark:bg-[#15202B]"
          >
            {isMarkingRead ? (
              <div className="w-4 h-4 relative">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-black dark:border-darkBorder !border-t-darkBorder/50"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Mark as read</span>
              </>
            )}
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 text-xs border-2 border-black dark:border-darkBorder hover:translate-x-1 hover:-translate-y-1 hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_rgba(56,68,77,0.4)] transition-all text-red-500 bg-white dark:bg-[#15202B]"
        >
          {isDeleting ? (
            <div className="w-4 h-4 relative">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-500 !border-t-red-200"
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

const NotiClient = () => {
  const [notifications, setNotifications] = useState([
    {
      _id: "67bd8207b4d6800d0d189169",
      recipient: "67a429b215d7dcc39befe0cd",
      sender: {
        _id: "67bd81ddb4d6800d0d189061",
        name: "User 5",
        profilePic: "default-avatar.png",
      },
      type: "comment",
      post: {
        _id: "67b041f18be3958651ea233d",
        caption: "",
        media: [
          "https://res.cloudinary.com/de6lxconb/image/upload/v1739604465/post-treck/posts/cmyqndvzovqxr3zmfd0j.jpg",
        ],
      },
      read: false,
      message: "User 5 commented on your post",
      createdAt: "2025-02-25T08:40:39.003Z",
      updatedAt: "2025-02-25T08:40:39.003Z",
      __v: 0,
    },
    {
      _id: "67bd8201b4d6800d0d1890f0",
      recipient: "67a429b215d7dcc39befe0cd",
      sender: {
        _id: "67bd81ddb4d6800d0d189061",
        name: "User 5",
        profilePic: "default-avatar.png",
      },
      type: "post_like",
      post: {
        _id: "67b041f18be3958651ea233d",
        caption: "",
        media: [
          "https://res.cloudinary.com/de6lxconb/image/upload/v1739604465/post-treck/posts/cmyqndvzovqxr3zmfd0j.jpg",
        ],
      },
      read: false,
      message: "User 5 reacted to your post",
      createdAt: "2025-02-25T08:40:33.325Z",
      updatedAt: "2025-02-25T08:40:33.325Z",
      __v: 0,
    },
  ]);

  const handleDelete = async (notificationId) => {
    // Add your delete logic here
    setNotifications(notifications.filter((n) => n._id !== notificationId));
  };

  const handleMarkAsRead = async (notificationId) => {
    // Add your mark as read logic here
    setNotifications(
      notifications.map((n) =>
        n._id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  if (true) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 mb-12 border-2 border-black dark:border-darkBorder p-6 bg-white dark:bg-[#15202B] animate-pulse">
            <div className="w-8 h-8 bg-black/10 dark:bg-white/10 rounded-full" />
            <div>
              <div className="h-7 w-32 bg-black/10 dark:bg-white/10 rounded mb-2" />
              <div className="h-4 w-48 bg-black/10 dark:bg-white/10 rounded" />
            </div>
          </div>

          {/* Notification Skeletons */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 border-2 border-black dark:border-darkBorder bg-white dark:bg-[#15202B] animate-pulse"
              >
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-black/10 dark:bg-white/10 rounded flex-shrink-0" />
                  <div className="flex-grow">
                    <div className="flex items-start justify-between gap-6">
                      <div className="w-full">
                        <div className="h-5 w-32 bg-black/10 dark:bg-white/10 rounded mb-2" />
                        <div className="h-4 w-full bg-black/10 dark:bg-white/10 rounded mb-3" />
                        <div className="h-4 w-24 bg-black/10 dark:bg-white/10 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-12 border-2 border-black dark:border-darkBorder p-6 bg-white dark:bg-[#15202B]"
        >
          <Bell className="w-8 h-8 dark:text-zinc-100" />
          <div>
            <h1 className="text-2xl font-bold dark:text-zinc-100">
              Notifications
            </h1>
            <p className="text-sm text-black/50 dark:text-white/50">
              Stay updated with your latest activities
            </p>
          </div>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-6">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 border-2 border-black dark:border-darkBorder bg-white dark:bg-[#15202B]"
              >
                <Bell className="w-12 h-12 mx-auto mb-4 text-black/20 dark:text-white/20" />
                <p className="text-black/50 dark:text-white/50">
                  No notifications yet
                </p>
              </motion.div>
            ) : (
              notifications.map((notification) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                  onDelete={handleDelete}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NotiClient;
