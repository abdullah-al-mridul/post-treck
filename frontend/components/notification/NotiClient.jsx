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
      className={`p-4 border-2 border-black dark:border-darkBorder ${
        !notification.read
          ? "bg-black/5 dark:bg-white/5"
          : "bg-white dark:bg-[#15202B]"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Sender Profile Picture */}
        <Link
          href={`/profile/${notification.sender._id}`}
          className="flex-shrink-0"
        >
          <Image
            src={
              notification.sender.profilePic === "default-avatar.png"
                ? "/default-avatar.png"
                : notification.sender.profilePic
            }
            alt={notification.sender.name}
            width={40}
            height={40}
            className="border-2 border-black dark:border-darkBorder"
          />
        </Link>

        {/* Notification Content */}
        <div className="flex-grow">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link
                href={`/post/${notification.post._id}`}
                className="text-sm dark:text-zinc-100 hover:underline"
              >
                {notification.message}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-black/50 dark:text-white/50">
                  {formatDate(notification.createdAt)} ago
                </span>
                {notification.type === "comment" ? (
                  <MessageSquare className="w-3 h-3 text-blue-500" />
                ) : (
                  <Heart className="w-3 h-3 text-red-500" />
                )}
              </div>
            </div>

            {/* Post Thumbnail if exists */}
            {notification.post.media && notification.post.media.length > 0 && (
              <Link
                href={`/post/${notification.post._id}`}
                className="flex-shrink-0"
              >
                <Image
                  src={notification.post.media[0]}
                  alt="Post thumbnail"
                  width={60}
                  height={60}
                  className="border border-black dark:border-darkBorder object-cover"
                />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-4">
        {!notification.read && (
          <button
            onClick={handleMarkAsRead}
            disabled={isMarkingRead}
            className="flex items-center gap-2 px-3 py-1.5 text-xs border border-black dark:border-darkBorder hover:bg-black/5 dark:hover:bg-white/5 transition-colors dark:text-zinc-100"
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
          className="flex items-center gap-2 px-3 py-1.5 text-xs border border-black dark:border-darkBorder hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
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

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Bell className="w-6 h-6 dark:text-zinc-100" />
          <h1 className="text-2xl font-bold dark:text-zinc-100">
            Notifications
          </h1>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-black/50 dark:text-white/50"
              >
                No notifications yet
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
