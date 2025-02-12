import { useApi } from "@/hooks/useApi";
import { create } from "zustand";

const useFriendsStore = create((set) => ({
  friends: [],
  loading: false,
  getFriends: async (userId) => {
    set({ loading: true });
    const { data } = await useApi().get(`/users/profile/${userId}`);
    set({ friends: data.user.friends, loading: false });
  },
}));
export default useFriendsStore;
