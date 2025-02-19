import { create } from "zustand";
import { useApi } from "@/hooks/useApi";
const useMessages = create((set, get) => ({
  loading: false,
  error: null,
  userChats: [],
  selectedChat: null,
  selectedChatMessages: [],
  isSearchModalOpen: false,
  isSearching: false,
  searchedUsers: [],
  isSendingMessage: false,
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
    if (chat) {
      set({
        selectedChat: chat,
        selectedChatMessages: chat.messages || [],
      });
    } else {
      set({
        selectedChat: null,
        selectedChatMessages: [],
      });
    }
  },
  // updateSelectedChat: (message) => {
  //   const messages = get().selectedChatMessages || []; // যদি null হয়, তাহলে empty array রাখো
  //   set({
  //     selectedChatMessages: [...messages, message],
  //   });
  // },
  sendMessage: async (message, chatId, file) => {
    set({ isSendingMessage: true });
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
    } finally {
      set({ isSendingMessage: false });
    }
  },
  setIsSearchModalOpen: (val) => {
    set({ isSearchModalOpen: val });
  },
  setSearchedUsers: async (searchQuery) => {
    set({ isSearching: true });
    try {
      const { data } = await useApi().get(`/users/search?query=${searchQuery}`);
      set({ searchedUsers: data.users || [] }); // data.users না থাকলে empty array সেট করো
    } catch (err) {
      console.error("Error fetching searched users:", err);
      set({ error: err.message });
    } finally {
      set({ isSearching: false });
    }
  },
  getOrCreateChat: async (userId) => {
    set({ loading: true });

    try {
      const { data } = await useApi().get(`/chats/user/${userId}`);
      console.log(data);
      if (data.chat) {
        set({ selectedChat: data.chat });
        set({ selectedChatMessages: data.chat.messages });
        set({ isSearchModalOpen: false });

        set((state) => ({
          userChats: state.userChats.some((chat) => chat._id === data.chat._id)
            ? state.userChats
            : [data.chat, ...state.userChats],
        }));
      } else {
        set({ error: "Chat not found!" });
      }
    } catch (err) {
      console.error("Error in getOrCreateChat:", err);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useMessages;
