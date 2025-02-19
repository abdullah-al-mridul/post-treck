import { create } from "zustand";

const useOnlineUsers = create((set, get) => ({
  onlineUsers: [],
  setOnlineUsers: (updatedOnlineUsers) => {
    set({ onlineUsers: updatedOnlineUsers });
  },
}));

export default useOnlineUsers;
