import { create } from "zustand";
import { useApi } from "@/hooks/useApi";
const useAdminStore = create((set) => ({
  loading: false,
  users: [],
  stats: {
    totalUsers: 0,
    bannedUsers: 0,
    totalPosts: 0,
    reportedPosts: 0,
    activeUsers24h: 0,
  },
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
}));

export default useAdminStore;
