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
  sendMessage: async (message, chatId, file) => {
    if (file && message.length > 0) {
      const formData = new FormData();
      formData.append("content", message);
      formData.append("media", file);
      formData.append("messageType", "text_with_image");
      const { data, error } = await useApi().post(
        `/chats/${chatId}/message`,
        formData
      );
      if (error) {
        set({ error: error.message, loading: false });
      } else {
        set({ selectedChatMessages: data.messages, loading: false });
      }
    } else if (file === null && message.length > 0) {
      const { data, error } = await useApi().post(`/chats/${chatId}/message`, {
        content: message,
        messageType: "text",
      });
      if (error) {
        set({ error: error.message, loading: false });
      } else {
        set({ selectedChatMessages: data.messages, loading: false });
      }
    } else if (file && message.length === 0) {
      const formData = new FormData();
      formData.append("media", file);
      formData.append("messageType", "image");
      const { data, error } = await useApi().post(
        `/chats/${chatId}/message`,
        formData
      );
      if (error) {
        set({ error: error.message, loading: false });
      } else {
        set({ selectedChatMessages: data.messages, loading: false });
      }
    }
  },
}));

export default useMessages;
