"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import useAdminStore from "@/store/adminStore";

const roleOptions = [
  {
    id: "user",
    label: "User",
    description: "Regular user with standard permissions",
  },
  {
    id: "moderator",
    label: "Moderator",
    description: "Can moderate content and manage reports",
  },
  //   {
  //     id: "admin",
  //     label: "Admin",
  //     description: "Full administrative access and control",
  //   },
];

const RoleChangeModal = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const { roleModal, closeRoleModal, changeUserRole, loadingRoles } =
    useAdminStore();
  const { isOpen, userId, currentRole } = roleModal;
  const isLoading = loadingRoles[userId];

  useEffect(() => {
    if (isOpen && currentRole) {
      setSelectedRole(currentRole);
    }
  }, [isOpen, currentRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changeUserRole(selectedRole);
      setSelectedRole("");
    } catch (error) {
      console.log("Failed to change user role");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeRoleModal}
            className="fixed inset-0 bg-black/50 dark:bg-darkBorder/10 backdrop-blur-md z-50"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white dark:bg-[#15202B] border-2 border-black dark:border-darkBorder p-6 m-4">
              <h2 className="text-2xl font-bold dark:text-white mb-4">
                Change User Role
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="space-y-2 mb-6">
                  {roleOptions.map((role) => (
                    <label
                      key={role.id}
                      className={`block p-4 border-2 cursor-pointer transition-colors ${
                        selectedRole === role.id
                          ? "border-black dark:border-darkBorder bg-black/5 dark:bg-white/5"
                          : "border-transparent hover:border-black dark:hover:border-darkBorder"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="role"
                          value={role.id}
                          checked={selectedRole === role.id}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 border-2 rounded-full ${
                            selectedRole === role.id
                              ? "border-black dark:border-darkBorder bg-black dark:bg-darkBorder"
                              : "border-black/20 dark:border-white/20"
                          }`}
                        />
                        <div>
                          <p className="font-bold dark:text-zinc-100">
                            {role.label}
                          </p>
                          <p className="text-sm text-black/50 dark:text-white/50">
                            {role.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={!selectedRole || isLoading}
                    className="px-4 py-2 text-sm font-bold border border-black dark:border-darkBorder text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-darkHover transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Change Role"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeRoleModal}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-bold border border-black dark:border-darkBorder  text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-darkHover transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RoleChangeModal;
