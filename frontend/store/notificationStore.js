import { useApi } from "@/hooks/useApi";
import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  notifications: [],
  loading: true,
  getNotifications: async () => {
    set({ loading: true });
    try {
      const { data } = await useApi().get("/notifications");
      set({ notifications: data.notifications });
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
}));
