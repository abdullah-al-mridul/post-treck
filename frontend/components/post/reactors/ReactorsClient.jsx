"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/formatDate";
import VerificationBadge from "@/components/ui/VerificationBadge";
import useSinglePostStore from "@/store/SPostStore";
import { useEffect } from "react";
import Spinner from "@/components/ui/Spinner";
const ReactorsClient = ({ id }) => {
  const { reactors, getReactors, loading } = useSinglePostStore();
  useEffect(() => {
    getReactors(id);
  }, [id]);
  const reactionIcons = {
    like: "👍",
    love: "❤️",
    haha: "😂",
    wow: "😮",
    sad: "😢",
    angry: "😠",
  };
  if (loading) return <Spinner />;
  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href={`/post/${id}`}
            className="inline-flex items-center gap-3 group border-2 border-black dark:border-darkBorder px-4 py-2 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] dark:hover:shadow-[4px_4px_0_0_rgba(56,68,77,0.4)] transition-all bg-white dark:bg-[#15202B]"
          >
            <div className="p-1 bg-black/5 dark:bg-white/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 dark:text-zinc-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
                />
              </svg>
            </div>
            <span className="font-bold text-sm dark:text-zinc-100">Back</span>
          </Link>
        </motion.div>

        {/* Header */}
        <h1 className="text-4xl font-black mb-8 dark:text-zinc-100">
          Reactions
        </h1>

        {/* Reactors List */}
        <div className="space-y-4">
          {reactors.map((reactor, index) => (
            <motion.div
              key={reactor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 border-2 border-black dark:border-darkBorder bg-white dark:bg-[#15202B] hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] dark:hover:shadow-[8px_8px_0_0_rgba(56,68,77,0.4)] transition-all"
            >
              <div className="flex items-center gap-4">
                <Link
                  href={`/profile/${reactor._id}`}
                  className="block relative"
                >
                  <Image
                    src={
                      reactor.profilePic === "default-avatar.png"
                        ? "/default-avatar.png"
                        : reactor.profilePic
                    }
                    alt={reactor.name}
                    width={48}
                    height={48}
                    className="border-2 border-black dark:border-darkBorder"
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/profile/${reactor._id}`}
                      className="font-bold hover:underline dark:text-zinc-100"
                    >
                      {reactor.name}
                    </Link>
                    {reactor.role && <VerificationBadge role={reactor.role} />}
                  </div>
                  <div className="text-sm text-black/50 dark:text-white/50">
                    Active {formatDate(reactor.lastActive)}
                  </div>
                </div>
                <div
                  className="text-2xl"
                  title={`Reacted with ${reactor.reactionType}`}
                >
                  {reactionIcons[reactor.reactionType]}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReactorsClient;
