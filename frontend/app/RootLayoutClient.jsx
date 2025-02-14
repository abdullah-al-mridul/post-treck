"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import useThemeStore from "@/store/themeStore";
import useAuthStore from "@/store/authStore";
import { Navbar } from "@/components/ui/Navbar";
import { Sidebar } from "@/components/ui/Sidebar";

export default function RootLayoutClient({ children }) {
  const { theme } = useThemeStore();
  const pathname = usePathname();
  const { checkAuth } = useAuthStore();

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle theme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Don't show sidebar and navbar on auth pages
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <div className={`${theme} min-h-screen`}>
      {!isAuthPage && (
        <>
          <Navbar />
          <Sidebar />
        </>
      )}
      <main className={!isAuthPage ? "pl-64" : ""}>{children}</main>
    </div>
  );
}
