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
    isSubmitting,
    formData,
    formErrors,
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
    const { name, value } = e.target;
    setFormData("register", name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register();
    if (success) {
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-black transition-colors">
      {/* Left Side - App Introduction */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-black dark:bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: "24px 24px",
            }}
          />
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "6px 6px",
            }}
          />
        </div>

        {/* Dark mode version */}
        <div className="absolute inset-0 opacity-10 dark:opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full hidden dark:block"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0, 0, 0, 0.2) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: "24px 24px",
            }}
          />
          <div
            className="absolute top-0 left-0 w-full h-full hidden dark:block"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "6px 6px",
            }}
          />
        </div>

        <div className="relative">
          {/* Logo Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4"
          >
            <div className="w-20 h-20 border-4 border-white dark:border-black flex items-center justify-center relative group">
              <span className="text-4xl font-black text-white dark:text-black transition-transform duration-300 group-hover:scale-110">
                P
              </span>
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/50 dark:border-black/50" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/50 dark:border-black/50" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/50 dark:border-black/50" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/50 dark:border-black/50" />
            </div>
            <div>
              <h1 className="text-7xl font-black text-white dark:text-black">
                OST TRECK
              </h1>
              <div className="h-1 w-0 group-hover:w-full bg-white/20 dark:bg-black/20 transition-all duration-300" />
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-white/80 dark:text-black/80 max-w-md leading-relaxed"
          >
            Share your thoughts, connect with others, and explore new ideas in a
            brutalist digital space.
          </motion.p>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-8 relative"
        >
          {/* Vertical line connector */}
          <div className="absolute left-6 top-12 bottom-12 w-px bg-gradient-to-b from-white/0 via-white/20 to-white/0 dark:from-black/0 dark:via-black/20 dark:to-black/0" />

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-black/20 relative z-10">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white dark:text-black">
                Lightning Fast
              </h3>
              <p className="text-white/70 dark:text-black/70 leading-relaxed">
                Experience ultra-fast performance with seamless interactions and
                real-time updates. No lags, just smooth browsing!
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-black/20 relative z-10">
              <span className="text-2xl">🎨</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white dark:text-black">
                Brutalist & Bold
              </h3>
              <p className="text-white/70 dark:text-black/70 leading-relaxed">
                A raw, edgy, and bold design that stands out—no unnecessary
                clutter, just pure functionality and aesthetics.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-black/20 relative z-10">
              <span className="text-2xl">🔒</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white dark:text-black">
                Secure & Private
              </h3>
              <p className="text-white/70 dark:text-black/70 leading-relaxed">
                Your data stays yours! End-to-end encryption and
                industry-standard security keep your conversations and content
                safe.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="relative">
          <div className="h-px w-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 dark:from-black/0 dark:via-black/20 dark:to-black/0 mb-4" />
          <div className="text-white/50 dark:text-black/50 font-mono text-sm">
            © 2025 Post Treck. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 relative">
        <ThemeToggle className="absolute top-4 right-4" />

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
                    className={`w-full p-3 border-2 ${
                      formErrors.register.name
                        ? "border-red-500"
                        : "border-black dark:border-white"
                    } bg-transparent dark:text-white outline-none font-mono 
                    focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0_0_#000] dark:focus:shadow-[4px_4px_0_0_#fff] 
                    transition-all duration-200`}
                    placeholder="John Doe"
                    value={formData.register.name}
                    onChange={handleChange}
                  />
                  {formErrors.register.name && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-sm text-red-500 dark:text-red-400"
                    >
                      {formErrors.register.name}
                    </motion.p>
                  )}
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
                    className={`w-full p-3 border-2 ${
                      formErrors.register.email
                        ? "border-red-500"
                        : "border-black dark:border-white"
                    } bg-transparent dark:text-white outline-none font-mono 
                    focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0_0_#000] dark:focus:shadow-[4px_4px_0_0_#fff] 
                    transition-all duration-200`}
                    placeholder="your@email.com"
                    value={formData.register.email}
                    onChange={handleChange}
                  />
                  {formErrors.register.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-sm text-red-500 dark:text-red-400"
                    >
                      {formErrors.register.email}
                    </motion.p>
                  )}
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
                    className={`w-full p-3 border-2 ${
                      formErrors.register.password
                        ? "border-red-500"
                        : "border-black dark:border-white"
                    } bg-transparent dark:text-white outline-none font-mono 
                    focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0_0_#000] dark:focus:shadow-[4px_4px_0_0_#fff] 
                    transition-all duration-200`}
                    placeholder="••••••••"
                    value={formData.register.password}
                    onChange={handleChange}
                  />
                  {formErrors.register.password && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-sm text-red-500 dark:text-red-400"
                    >
                      {formErrors.register.password}
                    </motion.p>
                  )}
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
      </div>
    </div>
  );
}
