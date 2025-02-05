"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";
import ThemeToggle from "@/components/ThemeToggle";

export default function Register() {
  const router = useRouter();
  const {
    register,
    error,
    clearError,
    user,
    loading,
    isSubmitting,
    formData,
    setFormData,
    resetForm,
  } = useAuthStore();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
    clearError();
    return () => resetForm("register");
  }, [user, router, clearError, resetForm]);

  const handleChange = (e) => {
    setFormData("register", e.target.name, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register();
    if (success) {
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black transition-colors px-4">
      <ThemeToggle />

      {/* Logo/Brand */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-6xl font-black text-black dark:text-white tracking-tighter">
          POST TRECK
        </h1>
        <div className="h-1 w-full bg-black dark:bg-white mt-2" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Main Box */}
        <div className="border-4 border-black dark:border-white p-8 relative">
          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-black dark:border-white -translate-x-4 -translate-y-4" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-black dark:border-white translate-x-4 -translate-y-4" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-black dark:border-white -translate-x-4 translate-y-4" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-black dark:border-white translate-x-4 translate-y-4" />

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-4xl text-nowrap font-bold text-black dark:text-white uppercase tracking-tight">
              Create Account
            </h2>
            <div className="w-full h-2 bg-black dark:bg-white mt-4" />
          </motion.div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-100 border-2 border-red-500 text-red-500 font-mono dark:bg-red-900/20"
              >
                <span className="font-bold">Error: </span>
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative group"
              >
                <label className="block text-sm font-bold uppercase mb-2 dark:text-white">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full p-3 border-2 border-black dark:border-white bg-transparent dark:text-white outline-none font-mono 
                  focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0_0_#000] dark:focus:shadow-[4px_4px_0_0_#fff] 
                  transition-all duration-200"
                  placeholder="John Doe"
                  value={formData.register.name}
                  onChange={handleChange}
                />
              </motion.div>

              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="relative group"
              >
                <label className="block text-sm font-bold uppercase mb-2 dark:text-white">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full p-3 border-2 border-black dark:border-white bg-transparent dark:text-white outline-none font-mono 
                  focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0_0_#000] dark:focus:shadow-[4px_4px_0_0_#fff] 
                  transition-all duration-200"
                  placeholder="your@email.com"
                  value={formData.register.email}
                  onChange={handleChange}
                />
              </motion.div>

              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="relative group"
              >
                <label className="block text-sm font-bold uppercase mb-2 dark:text-white">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full p-3 border-2 border-black dark:border-white bg-transparent dark:text-white outline-none font-mono 
                  focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0_0_#000] dark:focus:shadow-[4px_4px_0_0_#fff] 
                  transition-all duration-200"
                  placeholder="••••••••"
                  value={formData.register.password}
                  onChange={handleChange}
                />
              </motion.div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full p-4 font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Content Layer */}
              <span className="relative z-20 inline-flex items-center text-white dark:text-black">
                {isSubmitting ? "Creating Account..." : "Create Account"}
                {!isSubmitting && (
                  <motion.span
                    className="ml-2 text-xl"
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    →
                  </motion.span>
                )}
              </span>

              {/* Button Layers */}
              <div className="absolute inset-0 z-10 bg-black dark:bg-white" />
              <div
                className="absolute inset-0 z-0 border-2 border-black dark:border-white bg-white dark:bg-black
                translate-x-2 -translate-y-2 transition-transform duration-200
                group-hover:translate-x-0 group-hover:translate-y-0"
              />
            </motion.button>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center space-y-2"
            >
              <Link
                href="/auth/login"
                className="inline-block font-bold uppercase text-sm hover:underline dark:text-white group"
              >
                Already Have Account?{" "}
                <span className="group-hover:translate-x-1 inline-block transition-transform">
                  →
                </span>
              </Link>
            </motion.div>
          </form>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-sm text-black/60 dark:text-white/60 text-center"
      >
        © 2024 Post Treck. All rights reserved.
      </motion.div>
    </div>
  );
}
