"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";
import {
  House,
  MessageSquare,
  Settings,
  SquareUser,
  UserPlus,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: <House className="w-6 h-6 dark:text-zinc-100/60 mx-auto" />,
    },
    {
      label: "Profile",
      href: `/profile/${user?._id}`,
      icon: <SquareUser className="w-6 h-6 dark:text-zinc-100/60" />,
    },
    {
      label: "Messages",
      href: "/messages",
      icon: <MessageSquare className="w-6 h-6 dark:text-zinc-100/60" />,
    },
    {
      label: "Friend Requests",
      href: `/profile/${user?._id}/friend-requests`,
      icon: <UserPlus className="w-6 h-6 dark:text-zinc-100/60" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="w-6 h-6 dark:text-zinc-100/60" />,
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-16 lg:hover:w-64 border-r-2 border-black dark:border-darkBorder bg-white dark:bg-[#15202B] lg:hover:pt-24 pt-16 lg:hover:px-2 px-0 transition-all duration-300 ease-in-out group overflow-hidden">
      <nav className="space-y-2 border-0 lg:group-hover:border border-transparent lg:group-hover:border-darkBorder transition-all duration-300">
        {/*rendering list*/}
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={`flex items-center lg:group-hover:gap-3 gap-0 p-3 transition-all duration-300 ${
                  isActive
                    ? "bg-black text-white dark:bg-darkHover dark:text-black font-bold"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <div className="min-w-[24px] translate-x-1.5 lg:group-hover:translate-x-0 transition-all duration-300">
                  {item.icon}
                </div>
                <span className="opacity-0 lg:group-hover:opacity-100 w-0 lg:group-hover:w-auto dark:text-zinc-100/70 transition-opacity duration-300 whitespace-nowrap">
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="absolute lg:group-hover:bottom-8 bottom-0 lg:group-hover:left-2 transition-all duration-300 left-0 lg:group-hover:right-2 right-0">
        <div className="flex items-center lg:group-hover:gap-3 gap-0 lg:group-hover:p-4 lg:group-hover:border-2 transition-all duration-300 border-black dark:border-darkBorder border-dashed overflow-hidden">
          <img
            src={user?.profilePic || "/default-avatar.png"}
            alt={user?.name}
            className="lg:group-hover:w-10 lg:group-hover:h-10 w-16 h-16 border-0 min-w-[40px] lg:group-hover:border-2 border-black dark:border-darkBorder transition-all duration-300 lg:group-hover:scale-90"
          />
          <div className="flex-1 min-w-0 lg:group-hover:w-auto w-0 opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
            <h3 className="font-bold truncate dark:text-zinc-100 whitespace-nowrap">
              {user?.name}
            </h3>
            <p className="text-sm text-black/50 dark:text-white/50 truncate whitespace-nowrap">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
