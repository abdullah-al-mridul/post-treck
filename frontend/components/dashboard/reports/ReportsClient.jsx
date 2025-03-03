"use client";
import { motion } from "framer-motion";
import useAdminStore from "@/store/adminStore";
import useAuthStore from "@/store/authStore";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Spinner from "@/components/ui/Spinner";
import { formatDate } from "@/utils/formatDate";

const ReportsClient = () => {
  const { user: AuthUser } = useAuthStore();
  const { reports, loading, getReports, takeReportAction, takingReportAction } =
    useAdminStore();

  useEffect(() => {
    getReports();
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
                className="w-4 h-4 dark:text-zinc-100"
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
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-black dark:text-zinc-100">
              Reported Posts
            </h2>
            <p className="text-sm text-black/50 dark:text-white/50">
              Review and moderate reported content
            </p>
          </div>
        </motion.div>

        {/* Reports Grid */}
        {reports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-12 border-2 border-dashed border-black/20 dark:border-white/20"
          >
            <div className="inline-flex items-center justify-center p-4 bg-black/5 dark:bg-white/5 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-black/50 dark:text-white/50"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold dark:text-zinc-100 mb-2">
              No Reports Available
            </h3>
            <p className="text-black/50 dark:text-white/50">
              There are currently no reported posts that require moderation.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reports.map((report, index) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-2 border-black dark:border-darkBorder bg-white dark:bg-[#15202B]/50 backdrop-blur-sm"
              >
                <div className="p-6">
                  {/* Post Author Info */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 border-2 border-black dark:border-darkBorder">
                        <Image
                          src={
                            report.user.profilePic === "default-avatar.png"
                              ? "/default-avatar.png"
                              : report.user.profilePic
                          }
                          alt={report.user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold dark:text-zinc-100">
                          {report.user.name}
                        </h4>
                        <p className="text-sm text-black/50 dark:text-white/50">
                          {report.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-black/50 dark:text-white/50">
                        Posted {formatDate(report.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-6">
                    <p className="text-black/70 dark:text-white/70">
                      {report.caption}
                    </p>
                  </div>

                  {/* Post Stats */}
                  <div className="flex items-center gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 text-black/50 dark:text-white/50"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>
                      <span className="text-black/50 dark:text-white/50">
                        {report.reactionCount} Reactions
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 text-black/50 dark:text-white/50"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                        />
                      </svg>
                      <span className="text-black/50 dark:text-white/50">
                        {report.comments.length} Comments
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 text-red-500 dark:text-red-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                        />
                      </svg>
                      <span className="font-bold text-red-500 dark:text-red-400">
                        {report.reports.length} Reports
                      </span>
                    </div>
                  </div>

                  {/* Reports Section */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-sm text-black/50 dark:text-white/50">
                      Reported By:
                    </h5>
                    <div className="space-y-3">
                      {report.reports.map((reportDetail, i) => (
                        <div
                          key={i}
                          className="p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="font-bold text-sm dark:text-zinc-100">
                                {reportDetail.user.name}
                              </div>
                              <div className="text-sm text-black/50 dark:text-white/50">
                                {reportDetail.user.email}
                              </div>
                            </div>
                            <div className="text-sm text-black/50 dark:text-white/50">
                              {formatDate(reportDetail.createdAt)}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-medium dark:text-zinc-100">
                              Reason: {reportDetail.reason}
                            </div>
                            {reportDetail.description && (
                              <div className="text-sm text-black/70 dark:text-white/70">
                                Description: {reportDetail.description}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex mt-6">
                    <button
                      onClick={() => takeReportAction(report._id, "reject")}
                      disabled={
                        takingReportAction.delete || takingReportAction.approve
                      }
                      className="flex-1 px-4 py-2 text-sm font-bold border-2 border-r-0 border-dashed dark:hover:border-red-400 border-red-500 text-red-500 hover:bg-red-500 hover:text-white dark:border-darkBorder dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {takingReportAction.delete ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
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
                      ) : (
                        "Delete Post"
                      )}
                    </button>
                    <button
                      onClick={() => takeReportAction(report._id, "approve")}
                      disabled={
                        takingReportAction.delete || takingReportAction.approve
                      }
                      style={{
                        borderLeftStyle: "solid",
                      }}
                      className="flex-1 px-4 py-2 text-sm font-bold border-2 border-green-500 text-green-500 dark:hover:border-green-400 hover:bg-green-500 hover:text-white dark:border-darkBorder border-dashed dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {takingReportAction.approve ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
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
                      ) : (
                        "Approve Post"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsClient;
