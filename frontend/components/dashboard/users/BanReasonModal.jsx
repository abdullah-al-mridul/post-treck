"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import useAdminStore from "@/store/adminStore";

const BanReasonModal = () => {
  const [reason, setReason] = useState("");
  const { banModal, closeBanModal, toggleUserBan, loadingUsers } =
    useAdminStore();
  const { isOpen, action, userId } = banModal;
  // Only show loading in modal for ban action
  const isLoading = action === "ban" ? loadingUsers[userId] : false;

  // Don't show modal for unban
  if (action === "unban") return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await toggleUserBan(reason);
      setReason("");
    } catch (error) {
      console.log("Failed to ban user");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBanModal}
            className="fixed inset-0 bg-black/50 dark:bg-darkBorder/10 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white dark:bg-[#15202B] border-2 border-black dark:border-darkBorder p-6 m-4">
              <h2 className="text-2xl font-bold dark:text-white mb-4">
                Ban User
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm text-black/70 dark:text-white/70 mb-2">
                    Reason for banning
                  </label>
                  <textarea
                    style={{
                      resize: "none",
                    }}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    placeholder="Enter reason for banning this user..."
                    className="w-full p-3 border border-black dark:border-darkBorder bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-darkBorder focus:ring-opacity-20 min-h-[100px]"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-bold border border-red-500 text-red-500 hover:bg-red-500 hover:text-white dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-black transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
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
                      "Confirm Ban"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeBanModal}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-bold border border-black dark:border-darkBorder text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-darkHover transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BanReasonModal;
