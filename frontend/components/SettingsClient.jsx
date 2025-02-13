"use client";
import { motion } from "framer-motion";
import useThemeStore from "@/store/themeStore";
import useAuthStore from "@/store/authStore";

export default function SettingsClient() {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 dark:bg-black dark:text-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black mb-8">Settings</h1>

        {/* Theme Settings */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Appearance</h2>
          <div className="p-6 bg-white dark:bg-black border-4 border-black dark:border-white hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] dark:hover:shadow-[8px_8px_0_0_#fff] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">Theme</h3>
                <p className="text-black/60 dark:text-white/60">
                  Choose your preferred theme
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 items-center rounded-full border-2 border-black dark:border-white transition-colors focus:outline-none"
              >
                <span
                  className={`${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-black dark:bg-white transition-transform`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Account</h2>
          <div className="space-y-4">
            <div className="p-6 bg-white dark:bg-black border-4 border-black dark:border-white">
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p className="text-black/60 dark:text-white/60">{user?.email}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
            >
              Delete Account
            </motion.button>
          </div>
        </section>

        {/* Notification Settings */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Notifications</h2>
          <div className="space-y-4">
            <div className="p-6 bg-white dark:bg-black border-4 border-black dark:border-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Email Notifications
                  </h3>
                  <p className="text-black/60 dark:text-white/60">
                    Receive email notifications
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full border-2 border-black dark:border-white">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-black dark:bg-white translate-x-1" />
                </button>
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-black border-4 border-black dark:border-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2">Push Notifications</h3>
                  <p className="text-black/60 dark:text-white/60">
                    Receive push notifications
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full border-2 border-black dark:border-white">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-black dark:bg-white translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
