"use client";
import { motion } from "framer-motion";
import useThemeStore from "@/store/themeStore";
import useAuthStore from "@/store/authStore";

export default function SettingsClient() {
  const { theme, toggleTheme } = useThemeStore();
  const { user, refreshToken, refreshingToken } = useAuthStore();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black mb-8 dark:text-zinc-100">
          Settings
        </h1>

        {/* Theme Settings */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 dark:text-zinc-100">
            Appearance
          </h2>
          <div className="p-6 border-4 border-black dark:border-darkBorder hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] dark:hover:shadow-[8px_8px_0_0_rgba(56,68,77,0.4)] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2 dark:text-zinc-100">
                  Theme
                </h3>
                <p className="text-black/60 dark:text-zinc-100/70">
                  Choose your preferred theme
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 items-center rounded-full border-2 border-black dark:border-darkBorder transition-colors focus:outline-none"
              >
                <span
                  className={`${
                    theme === "dark" ? "translate-x-[21px]" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-black dark:bg-zinc-100/80 transition-transform`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 dark:text-zinc-100">
            Account
          </h2>
          <div className="space-y-4">
            <div className="p-6 border-4 border-black dark:border-darkBorder hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] dark:hover:shadow-[8px_8px_0_0_rgba(56,68,77,0.4)] transition-all">
              <h3 className="font-bold text-lg mb-2 dark:text-zinc-100">
                Email
              </h3>
              <p className="text-black/60 dark:text-zinc-100/70">
                {user?.email}
              </p>
            </div>

            {/* Add Refresh Token Button */}
            <button
              onClick={refreshToken}
              disabled={refreshingToken}
              className="w-full p-4 bg-darkHover text-white font-bold hover:bg-[#f7f9f911] transition-colors"
            >
              {refreshingToken ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                  Refreshing Token...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                  Refresh Token
                </span>
              )}
            </button>

            <motion.button className="w-full p-4 bg-darkHover text-white font-bold hover:bg-[#f7f9f911] transition-colors">
              Delete Account
            </motion.button>
          </div>
        </section>

        {/* Notification Settings */}
        <section>
          <h2 className="text-2xl font-bold mb-6 dark:text-zinc-100">
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="p-6 border-4 border-black dark:border-darkBorder hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] dark:hover:shadow-[8px_8px_0_0_rgba(56,68,77,0.4)] transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2 dark:text-zinc-100">
                    Email Notifications
                  </h3>
                  <p className="text-black/60 dark:text-zinc-100/70">
                    Receive email notifications
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full border-2 border-black dark:border-darkBorder">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-black dark:bg-zinc-100/80 translate-x-1" />
                </button>
              </div>
            </div>
            <div className="p-6 border-4 border-black dark:border-darkBorder hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] dark:hover:shadow-[8px_8px_0_0_rgba(56,68,77,0.4)] transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2 dark:text-zinc-100">
                    Push Notifications
                  </h3>
                  <p className="text-black/60 dark:text-zinc-100/70">
                    Receive push notifications
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full border-2 border-black dark:border-darkBorder">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-black dark:bg-zinc-100/80 translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
