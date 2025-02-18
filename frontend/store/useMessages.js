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
  // updateSelectedChat: (message) => {
  //   const messages = get().selectedChatMessages || []; // যদি null হয়, তাহলে empty array রাখো
  //   set({
  //     selectedChatMessages: [...messages, message],
  //   });
  // },
  sendMessage: async (message, chatId, file) => {
    try {
      let response;
      if (file && message.length > 0) {
        const formData = new FormData();
        formData.append("content", message);
        formData.append("media", file);
        formData.append("messageType", "text_with_image");
        response = await useApi().post(`/chats/${chatId}/message`, formData);
      } else if (file === null && message.length > 0) {
        response = await useApi().post(`/chats/${chatId}/message`, {
          content: message,
          messageType: "text",
        });
      } else if (file && message.length === 0) {
        const formData = new FormData();
        formData.append("media", file);
        formData.append("messageType", "image");
        response = await useApi().post(`/chats/${chatId}/message`, formData);
      }

      const { data, error } = response;
      if (error) {
        set({ error: error.message, loading: false });
      } else {
        // Update messages while preventing duplicates
        set((state) => ({
          selectedChatMessages: Array.from(
            new Map(
              [...state.selectedChatMessages, ...data.messages].map((msg) => [
                msg._id,
                msg,
              ])
            ).values()
          ),
          loading: false,
        }));
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useMessages;
