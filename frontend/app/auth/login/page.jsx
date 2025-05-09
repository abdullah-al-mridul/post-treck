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
    <div className="min-h-screen flex bg-white dark:bg-[#0D0D0D] transition-colors">
      {/* Left Side - App Introduction */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between  border-r border-borderDark  relative overflow-hidden">
        <div className=" border border-r-0 border-l-0 border-borderDark mt-10">
          <div className="relative w-max mx-auto border-r border-l border-borderDark p-8 max-xl:border-0">
            {/* Logo Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4  justify-center"
            >
              <div className="w-20 h-20 max-xl:w-16 max-xl:h-16 border border-borderPinkLight flex items-center justify-center relative group">
                <span className="text-xl max-xl:text-lg font-bold bg-purple-700 text-white py-3 px-4 max-xl:py-2 max-xl:px-3 rounded-sm">
                  P
                </span>

                {/* Decorative corners */}
                <div className="absolute -top-2 -left-2 w-2 h-2 border-t-2 border-l-2 border-borderBlueLight" />
                <div className="absolute -top-2 -right-2 w-2 h-2 border-t-2 border-r-2 border-borderBlueLight" />
                <div className="absolute -bottom-2 -left-2 w-2 h-2 border-b-2 border-l-2 border-borderBlueLight" />
                <div className="absolute -bottom-2 -right-2 w-2 h-2 border-b-2 border-r-2 border-borderBlueLight" />
              </div>
              <div>
                <h1 className="text-7xl font-semibold text-LightBlack dark:text-white tracking-wider max-xl:text-5xl">
                  OST TRECK
                </h1>
                {/* <div className="h-1 w-0 group-hover:w-full bg-white/20 dark:bg-black/20 transition-all duration-300" /> */}
              </div>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6 text-xl max-xl:text-lg text-LightBlack dark:text-white/80 text-center mx-auto max-w-md leading-relaxed"
            >
              Share your thoughts, connect with others, and explore new ideas in
              a brutalist digital space.
            </motion.p>
          </div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className=" relative border border-r-0 border-l-0 border-borderDark"
        >
          {/* Vertical line connector */}
          <div className=" w-[85%] border-borderBlueLight space-y-5 py-5 mx-auto border-r border-l max-xl:w-full max-xl:border-0">
            {/* <div className="absolute left-6 top-12 bottom-12 w-px bg-gradient-to-b from-white/0 via-white/20 to-white/0 dark:from-black/0 dark:via-black/20 dark:to-black/0" /> */}

            <div className="flex items-start space-x-4 border-b border-borderBlueLight px-12 pb-5 max-xl:px-8">
              <div className=" p-1.5 rounded-full   backdrop-blur-sm flex items-center justify-center border border-borderBlueLight bg-borderBlueLight/10 relative z-10">
                <span className="text-2xl max-xl:text-xl">🚀</span>
              </div>
              <div>
                <h3 className="text-xl  text-LightBlack max-xl:text-lg dark:text-white font-medium tracking-wider">
                  Lightning Fast
                </h3>
                <p className="text-LightBlack/80 dark:text-white/70 tracking-wider leading-relaxed max-xl:text-sm max-xl:mt-1">
                  Experience ultra-fast performance with seamless interactions
                  and real-time updates. No lags, just smooth browsing!
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 border-b border-borderBlueLight px-12 pb-5 max-xl:px-8">
              <div className=" p-1.5 rounded-full   backdrop-blur-sm flex items-center justify-center border border-borderBlueLight bg-borderBlueLight/10 relative z-10">
                <span className="text-2xl max-xl:text-xl">🎨</span>
              </div>
              <div>
                <h3 className="text-xl max-xl:text-lg text-LightBlack dark:text-white font-medium tracking-wider">
                  Brutalist & Bold
                </h3>
                <p className="text-LightBlack/80 dark:text-white/70 tracking-wider leading-relaxed max-xl:text-sm max-xl:mt-1">
                  A raw, edgy, and bold design that stands out—no unnecessary
                  clutter, just pure functionality and aesthetics.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4  px-12 max-xl:px-8">
              <div className=" p-1.5 rounded-full   backdrop-blur-sm flex items-center justify-center border border-borderBlueLight bg-borderBlueLight/10 relative z-10">
                <span className="text-2xl max-xl:text-xl">🔒</span>
              </div>
              <div>
                <h3 className="text-xl max-xl:text-lg  text-LightBlack dark:text-white font-medium tracking-wider">
                  Secure & Private
                </h3>
                <p className="text-LightBlack/80 dark:text-white/70 tracking-wider leading-relaxed max-xl:text-sm max-xl:mt-1">
                  Your data stays yours! End-to-end encryption and
                  industry-standard security keep your conversations and content
                  safe.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="relative  border-t border-borderDark"
        >
          {/* <div className="h-px w-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 dark:from-black/0 dark:via-black/20 dark:to-black/0 mb-4" /> */}
          <div className="text-LightBlack/80 w-max mx-auto border-r py-7 px-10 border-borderBlueLight border-l dark:text-white text-sm tracking-wider">
            <span className=" border-b border-borderBlueLight pb-1">
              © {new Date().getFullYear()} Post Treck. All rights reserved.
            </span>
            <br />
            <p className="mt-1.5 text-xs text-LightBlack/80 dark:text-white text-center">
              Crafted by{" "}
              <a
                href="https://abdullah-al-mridul.is-a.dev"
                className="uppercase font-semibold hover:underline transition duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abdullah
              </a>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative max-lg:pb-40">
        <ThemeToggle className="absolute top-4 right-4" />
        <div className="w-20 h-20 max-xl:w-16 max-xl:h-16 mb-16 border border-borderPinkLight  items-center justify-center relative group hidden max-lg:flex mt-8">
          <span className="text-xl max-xl:text-lg font-bold bg-purple-700 text-white py-3 px-4 max-xl:py-2 max-xl:px-3 rounded-sm">
            P
          </span>

          {/* Decorative corners */}
          <div className="absolute -top-2 -left-2 w-2 h-2 border-t-2 border-l-2 border-borderBlueLight" />
          <div className="absolute -top-2 -right-2 w-2 h-2 border-t-2 border-r-2 border-borderBlueLight" />
          <div className="absolute -bottom-2 -left-2 w-2 h-2 border-b-2 border-l-2 border-borderBlueLight" />
          <div className="absolute -bottom-2 -right-2 w-2 h-2 border-b-2 border-r-2 border-borderBlueLight" />
        </div>
        <div className=" border w-full border-r-0 border-l-0 border-borderDark max-lg:border-0">
          <div className=" border mx-auto max-w-xl border-t-0 border-b-0 border-borderDark py-20 max-xl:border-0 max-xl:max-w-full max-lg:py-0">
            <div className="w-full max-w-md mx-auto max-sm:px-6">
              {/* Main Box */}
              <div className="border border-borderDark relative">
                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-borderPinkLight -translate-x-4 -translate-y-4" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-borderPinkLight translate-x-4 -translate-y-4" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-borderPinkLight -translate-x-4 translate-y-4" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-borderPinkLight translate-x-4 translate-y-4" />

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mb-8 bg-borderPinkLight/10 px-8 py-4"
                >
                  <h2 className="text-4xl text-nowrap font-medium text-black dark:text-white tracking-wide uppercase max-sm:text-3xl">
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

                  <div className="space-y-4 px-8 max-sm:px-4">
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
                          formErrors.login.email ? "" : ""
                        }  bg-transparent placeholder:tracking-wider border-borderDark placeholder:font-manrope dark:text-white outline-none focus:shadow-[4px_4px_0_0_#000] dark:focus:shadow-[6px_6px_0_0_#8a05ff1a] 
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
                          formErrors.login.password ? "" : ""
                        }  bg-transparent placeholder:tracking-wider border-borderDark placeholder:font-manrope dark:text-white outline-none    focus:shadow-[4px_4px_0_0_#000] dark:focus:shadow-[6px_6px_0_0_#8a05ff1a] 
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

                  <div className=" px-8 max-sm:px-4 border border-r-0 border-l-0 border-borderDark">
                    <div className=" border border-t-0 border-b-0 py-4 border-borderPinkLight">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full p-4 font-medium uppercase disabled:opacity-50 disabled:cursor-not-allowed border border-r-0 border-l-0 border-borderPinkLight hover:bg-borderPinkLight/10 transition-colors "
                      >
                        {/* Content Layer */}
                        <span className="relative z-20 inline-flex tracking-wider items-center text-LightBlack dark:text-white">
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
                        <div className="absolute inset-0 z-10 bg-transparent" />
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
            </div>
          </div>
        </div>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className=" border-t border-borderDark absolute bottom-0 w-full hidden max-lg:block"
        >
          {/* <div className="h-px w-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 dark:from-black/0 dark:via-black/20 dark:to-black/0 mb-4" /> */}
          <div className="text-LightBlack w-max mx-auto border-r py-7 px-10 border-borderBlueLight border-l max-sm:border-0 dark:text-white text-sm tracking-wider max-sm:px-0">
            <span className=" border-b border-borderBlueLight pb-1 ">
              © {new Date().getFullYear()} Post Treck. All rights reserved.
            </span>
            <br />
            <p className="mt-1.5 text-xs text-LightBlack/80 dark:text-white text-center">
              Crafted by{" "}
              <a
                href="https://abdullah-al-mridul.is-a.dev"
                className="uppercase font-semibold hover:underline transition duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abdullah
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
