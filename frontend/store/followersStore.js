import { create } from "zustand";
import { useApi } from "@/hooks/useApi";
const useFollowersStore = create((set) => ({
  followers: [],
  loading: false,
  error: null,
  getFollowers: async (userId) => {
    set({ loading: true });
    const response = await useApi().get(`/users/profile/${userId}`);
    set({ followers: response.data.user.followers });
    set({ loading: false });
  },
}));

export default useFollowersStore;
