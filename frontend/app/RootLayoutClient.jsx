"use client";
import { useEffect } from "react";
import useThemeStore from "@/store/themeStore";
import useAuthStore from "@/store/authStore";
import { Navbar } from "@/components/ui/Navbar";
import { Sidebar } from "@/components/ui/Sidebar";
import { motion } from "framer-motion";
import { socket } from "@/socket/socket-client";
import useOnlineUsers from "@/store/onlineUsersStore";
const letters = "LOADING".split("");
export default function RootLayoutClient({ children }) {
  const { theme } = useThemeStore();
  const { loading, user, checkAuth } = useAuthStore();
  const { onlineUsers, setOnlineUsers } = useOnlineUsers();
  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  useEffect(() => {
    if (!loading && user?._id) {
      socket.emit("user-online", user._id);
    }

    socket.on("online-users", (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });

    return () => {
      socket.off("online-users");
    };
  }, [loading, user]);
  useEffect(() => {
    console.log("online users :...");
    console.log(onlineUsers);
  }, [onlineUsers]);
  // Handle theme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#15202B]">
        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          <div className="text-4xl md:text-7xl font-black text-black dark:text-zinc-100 uppercase relative z-10 tracking-widest flex items-center gap-2">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
            {/* <motion.div
            className="inline-flex gap-1"
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="w-2 h-2 bg-black dark:bg-white rounded-full" />
            <span className="w-2 h-2 bg-black dark:bg-white rounded-full" />
            <span className="w-2 h-2 bg-black dark:bg-white rounded-full" />
          </motion.div> */}
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 border-4 border-black dark:border-zinc-100 -rotate-2 transition-transform duration-300 hover:rotate-0" />
          <div className="absolute inset-0 border-4 border-black dark:border-zinc-100 rotate-2 transition-transform duration-300 hover:rotate-0" />
        </motion.div>
        {/* Loading Bar */}
        <div className="w-64 h-2 mt-12 relative overflow-hidden border-2 border-black dark:border-zinc-100">
          <motion.div
            className="absolute inset-0 bg-black dark:bg-zinc-100"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <div className="fixed top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-black dark:border-zinc-100" />
        <div className="fixed top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-black dark:border-zinc-100" />
        <div className="fixed bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-black dark:border-zinc-100" />
        <div className="fixed bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-black dark:border-zinc-100" />
      </div>
    );
  }
  return (
    <div className={`${theme} min-h-screen dark:bg-[#15202B]`}>
      {user && (
        <>
          <Navbar />
          <Sidebar />
        </>
      )}
      <main className={user ? "lg:pl-64 pl-16" : ""}>{children}</main>
    </div>
  );
}
