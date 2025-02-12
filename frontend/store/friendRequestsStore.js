import { create } from "zustand";
import { useApi } from "@/hooks/useApi";
const useFriendRequestsStore = create((set, get) => ({
  friendRequests: [],
  loading: false,
  getFriendRequests: async () => {
    set({ loading: true });
    const res = await useApi().get("/users/profile");
    set({ friendRequests: res.data.user.friendRequests, loading: false });
  },
  acceptFriendRequest: async (requestId) => {
    const { data } = await useApi().post(`/users/accept-request/${requestId}`);
    get().getFriendRequests();
    return data;
  },
}));

export default useFriendRequestsStore;
