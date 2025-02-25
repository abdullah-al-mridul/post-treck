import { create } from "zustand";
import { useApi } from "@/hooks/useApi";

const useAdminStore = create((set, get) => ({
  loading: false,
  loadingUsers: {},
  users: [],
  banModal: {
    isOpen: false,
    userId: null,
    action: null,
  },
  stats: {
    totalUsers: 0,
    bannedUsers: 0,
    totalPosts: 0,
    reportedPosts: 0,
    activeUsers24h: 0,
  },

  openBanModal: (userId, action) =>
    set({ banModal: { isOpen: true, userId, action } }),

  closeBanModal: () =>
    set({ banModal: { isOpen: false, userId: null, action: null } }),

  getStates: async () => {
    try {
      set({ loading: true });
      const { data } = await useApi().get("/admin/stats");
      set({ stats: data.stats });
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  getUsers: async () => {
    try {
      set({ loading: true });
      const { data } = await useApi().get("/admin/users");
      set({ users: data.users });
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  toggleUserBan: async (reason) => {
    const { banModal, users } = get();
    const { userId, action } = banModal;
    const shouldBan = action === "ban";

    set((state) => ({
      loadingUsers: {
        ...state.loadingUsers,
        [userId]: true,
      },
    }));

    try {
      await useApi().post(
        `/admin/users/${userId}/${action}`,
        shouldBan ? { reason } : undefined
      );

      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? { ...user, isBanned: shouldBan } : user
        ),
        stats: {
          ...state.stats,
          bannedUsers: state.stats.bannedUsers + (shouldBan ? 1 : -1),
        },
        banModal: { isOpen: false, userId: null, action: null },
      }));

      console.log(`User ${action}ned successfully`);
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      throw error;
    } finally {
      set((state) => ({
        loadingUsers: {
          ...state.loadingUsers,
          [userId]: false,
        },
      }));
    }
  },
}));

export default useAdminStore;
