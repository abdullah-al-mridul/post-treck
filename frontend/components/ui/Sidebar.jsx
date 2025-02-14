"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 transition-transform duration-300 group-hover:scale-90"
        >
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg>
      ),
    },
    {
      label: "Profile",
      href: `/profile/${user?._id}`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 transition-transform duration-300 group-hover:scale-90"
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 transition-transform duration-300 group-hover:scale-90"
        >
          <path
            fillRule="evenodd"
            d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-16 hover:w-64 border-r-4 border-black dark:border-white bg-white dark:bg-black pt-24 px-2 transition-all duration-300 ease-in-out group overflow-hidden">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black font-bold"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <div className="min-w-[24px]">{item.icon}</div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="absolute bottom-8 left-2 right-2">
        <div className="flex items-center gap-3 p-4 border-4 border-black dark:border-white overflow-hidden">
          <img
            src={user?.profilePic || "/default-avatar.png"}
            alt={user?.name}
            className="w-10 h-10 min-w-[40px] border-2 border-black dark:border-white transition-transform duration-300 group-hover:scale-90"
          />
          <div className="flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h3 className="font-bold truncate whitespace-nowrap">
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
