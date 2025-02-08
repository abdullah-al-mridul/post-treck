"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import useAuthStore from "@/store/authStore";
import useThemeStore from "@/store/themeStore";
import Header from "@/components/Header";

//declare letters for loading animation
const letters = "LOADING".split("");

//declare root layout client component
export default function RootLayoutClient({ children }) {
  //get auth and theme store
  const { checkAuth, loading, user } = useAuthStore();
  const { theme } = useThemeStore();

  //get pathname
  const pathname = usePathname();

  //declare active tab
  const [activeTab, setActiveTab] = useState(pathname);

  //check auth
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  //set theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  //if loading, show loading screen
  if (loading) {
    return (
      <html lang="en" className={theme === "dark" ? "dark" : ""}>
        <body>
          <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <div className="text-4xl md:text-7xl font-black text-black dark:text-white uppercase relative z-10 tracking-widest flex items-center gap-2">
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
              <div className="absolute inset-0 border-4 border-black dark:border-white -rotate-2 transition-transform duration-300 hover:rotate-0" />
              <div className="absolute inset-0 border-4 border-black dark:border-white rotate-2 transition-transform duration-300 hover:rotate-0" />
            </motion.div>
            {/* Loading Bar */}
            <div className="w-64 h-2 mt-12 relative overflow-hidden border-2 border-black dark:border-white">
              <motion.div
                className="absolute inset-0 bg-black dark:bg-white"
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
            <div className="fixed top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-black dark:border-white" />
            <div className="fixed top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-black dark:border-white" />
            <div className="fixed bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-black dark:border-white" />
            <div className="fixed bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-black dark:border-white" />
          </div>
        </body>
      </html>
    );
  }

  //if not loading, show main content
  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <body>
        {/* if user is logged in, show header */}
        {user && <Header activeTab={activeTab} setActiveTab={setActiveTab} />}
        {/* show main content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
