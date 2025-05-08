"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";
import ThemeToggle from "@/components/ThemeToggle";

export default function Login() {
  const router = useRouter();
  const {
    login,
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
    return () => resetForm("login");
  }, [user, router, clearError, resetForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData("login", name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login();
    if (success) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#E7E9EA] dark:bg-[#0D0D0D] transition-colors">
      {/* Left Side - App Introduction */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 border-r border-borderDark  relative overflow-hidden">
        {/* Background Pattern */}
        {/* <div className="absolute inset-0 opacity-10">
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
        </div> */}

        {/* Dark mode version */}
        {/* <div className="absolute inset-0 opacity-10 dark:opacity-10">
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
        </div> */}

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

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative">
        {/* <ThemeToggle className="absolute top-4 right-4" /> */}

        <div className=" border w-full border-r-0 border-l-0 border-borderDark">
          <div className=" border mx-auto max-w-xl border-t-0 border-b-0 border-borderDark py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md mx-auto"
            >
              {/* Main Box */}
              <div className="border-2 border-black dark:border-borderDark relative">
                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-black dark:border-borderPinkLight -translate-x-4 -translate-y-4" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-black dark:border-borderPinkLight translate-x-4 -translate-y-4" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-black dark:border-borderPinkLight -translate-x-4 translate-y-4" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-black dark:border-borderPinkLight translate-x-4 translate-y-4" />

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mb-8 bg-borderPinkLight/10 px-8 py-4"
                >
                  <h2 className="text-4xl text-nowrap font-medium text-black dark:text-white tracking-wide uppercase ">
                    Sign In
                  </h2>
                  {/* <div className="w-full h-[1px] bg-black dark:bg-borderPinkLight mt-4" /> */}
                </motion.div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="px-8">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-red-100 border  border-borderBlueLight text-red-600 font-mono dark:bg-borderBlueLight/10"
                      >
                        <span className=" tracking-wider">Error: </span>
                        {error}
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-4 px-8">
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="relative group"
                    >
                      <label className="block text-sm tracking-wider uppercase mb-2 dark:text-white">
                        Email
                      </label>
                      <input
                        name="email"
                        type="email"
                        className={`w-full p-3 border ${
                          formErrors.login.email ? "" : "border-black "
                        }  bg-transparent placeholder:tracking-wider dark:border-borderDark placeholder:font-manrope dark:text-white outline-none font-mono focus:shadow-[4px_4px_0_0_#000] dark:focus:shadow-[6px_6px_0_0_#8a05ff1a] 
                    transition-all duration-200`}
                        placeholder="your@email.com"
                        value={formData.login.email}
                        onChange={handleChange}
                      />
                      {formErrors.login.email && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600  tracking-wider"
                        >
                          {formErrors.login.email}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="relative group"
                    >
                      <label className="block text-sm tracking-wider uppercase mb-2 dark:text-white">
                        Password
                      </label>
                      <input
                        name="password"
                        type="password"
                        className={`w-full p-3 border ${
                          formErrors.login.password ? "" : "border-black "
                        }  bg-transparent placeholder:tracking-wider dark:border-borderDark placeholder:font-manrope dark:text-white outline-none font-mono focus:shadow-[4px_4px_0_0_#000] dark:focus:shadow-[6px_6px_0_0_#8a05ff1a] 
                    transition-all duration-200`}
                        placeholder="••••••••"
                        value={formData.login.password}
                        onChange={handleChange}
                      />
                      {formErrors.login.password && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-1 text-sm text-red-600"
                        >
                          {formErrors.login.password}
                        </motion.p>
                      )}
                    </motion.div>
                  </div>

                  <div className=" px-8 border border-r-0 border-l-0 border-borderDark">
                    <div className=" border border-t-0 border-b-0 py-4 border-borderPinkLight">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full p-4 font-medium uppercase disabled:opacity-50 disabled:cursor-not-allowed border border-r-0 border-l-0 border-borderPinkLight hover:bg-borderPinkLight/10 transition-colors"
                      >
                        {/* Content Layer */}
                        <span className="relative z-20 inline-flex tracking-wider items-center text-white dark:text-white">
                          {isSubmitting ? "Signing in..." : "Sign in"}
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
                        <div className="absolute inset-0 z-10 bg-black dark:bg-transparent" />
                        {/* <div
                    className="absolute inset-0 z-0 border-2 border-black dark:border-borderPinkLight bg-white dark:bg-black
                  translate-x-2 -translate-y-2 transition-transform duration-200
                  group-hover:translate-x-0 group-hover:translate-y-0"
                  /> */}
                      </motion.button>
                    </div>
                  </div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center "
                  >
                    <div className=" mt-8 border-t border-borderDark ">
                      <Link
                        href="/auth/register"
                        className="inline-block tracking-wider uppercase py-2 text-sm hover:bg-borderPinkLight/10 transition-colors dark:text-white group border border-t-0 border-b-0 px-7 border-borderDark"
                      >
                        Create New Account{" "}
                        <span className="group-hover:translate-x-1 inline-block transition-transform">
                          →
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
