const { create } = require("zustand");
import { useApi } from "@/hooks/useApi";
const useMessages = create((set, get) => ({
  loading: false,
  error: null,
  userChats: [],
  selectedChat: null,
  selectedChatMessages: [],
  getUserChats: async () => {
    set({ loading: true });
    const { data, error } = await useApi().get("/chats");
    if (error) {
      set({ error: error.message, loading: false });
    } else {
      set({ userChats: data.chats, loading: false });
    }
  },
  setSelectedChat: (chat) => {
    set({ selectedChat: chat });
    set({ selectedChatMessages: chat.messages });
  },
  sendMessage: async (message, chatId) => {
    const { data, error } = await useApi().post(`/chats/${chatId}/message`, {
      content: message,
    });
    if (error) {
      set({ error: error.message, loading: false });
    } else {
    }
  },
}));

export default useMessages;
