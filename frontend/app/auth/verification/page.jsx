"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";
import ThemeToggle from "@/components/ThemeToggle";
import OTPInput from "@/components/OTPInput";

export default function Verification() {
  const router = useRouter();
  const {
    user,
    error,
    successMessage,
    clearMessages,
    isSubmitting,
    sendVerificationCode,
    verifyEmail,
    formData,
    setFormData,
    lastCodeSentAt,
  } = useAuthStore();

  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (lastCodeSentAt) {
      const updateCountdown = () => {
        const now = Date.now();
        const diff = 60000 - (now - lastCodeSentAt);
        if (diff > 0) {
          setCountdown(Math.ceil(diff / 1000));
        } else {
          setCountdown(0);
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [lastCodeSentAt]);

  const handleSendCode = async () => {
    const success = await sendVerificationCode();
    if (success) {
      // Show success message
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const success = await verifyEmail();
    if (success) {
      router.push("/");
    }
  };

  const handleChange = (code) => {
    setFormData("verification", "code", code);
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

          {/* Verification Info */}
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-white/80 dark:text-black/80 max-w-md leading-relaxed"
          >
            Please verify your email address to access all features. Check your
            inbox for the verification code.
          </motion.p>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-8 relative"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-black/20">
              <span className="text-2xl">📧</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white dark:text-black">
                Email Verification
              </h3>
              <p className="text-white/70 dark:text-black/70">
                Verify your email to unlock all features and secure your
                account.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Verification Form */}
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
                Verify Email
              </h2>
              <div className="w-full h-2 bg-black dark:bg-white mt-4" />
            </motion.div>

            <form onSubmit={handleVerify} className="space-y-6">
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

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-green-100 border-2 border-green-500 text-green-700 font-mono dark:bg-green-900/20 dark:text-green-400"
                >
                  <span className="font-bold">Success: </span>
                  {successMessage}
                </motion.div>
              )}

              <div className="space-y-4">
                {/* Verification Code Input */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-bold uppercase mb-4 dark:text-white text-center">
                    Enter Verification Code
                  </label>
                  <OTPInput
                    value={formData.verification.code}
                    onChange={handleChange}
                    length={6}
                  />
                </motion.div>
              </div>

              {/* Send Code Button */}
              <motion.button
                type="button"
                onClick={handleSendCode}
                disabled={isSubmitting || countdown > 0}
                whileHover={{ scale: countdown > 0 ? 1 : 1.02 }}
                whileTap={{ scale: countdown > 0 ? 1 : 0.98 }}
                className="w-full p-3 border-2 border-black dark:border-white text-black dark:text-white font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                {isSubmitting
                  ? "Sending..."
                  : countdown > 0
                  ? `Wait ${countdown}s`
                  : "Send Code"}
              </motion.button>

              {/* Verify Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full p-4 font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-20 inline-flex items-center text-white dark:text-black">
                  {isSubmitting ? "Verifying..." : "Verify Email"}
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
                <div className="absolute inset-0 z-10 bg-black dark:bg-white" />
                <div className="absolute inset-0 z-0 border-2 border-black dark:border-white bg-white dark:bg-black translate-x-2 -translate-y-2 transition-transform duration-200 group-hover:translate-x-0 group-hover:translate-y-0" />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
