import { create } from "zustand";
import { useApi } from "@/hooks/useApi";

const findUserReaction = (reactions, userId) => {
  for (const [reactionType, users] of Object.entries(reactions)) {
    if (users.includes(userId)) {
      return reactionType; // Found the reaction type
    }
  }
  return null;
};

const useSinglePostStore = create((set, get) => ({
  post: null,
  loading: true,
  error: null,
  currentUserReaction: null,
  isReacting: false,
  getPost: async (postId, user) => {
    set({ loading: true });
    try {
      const { data } = await useApi().get(`/posts/${postId}`);
      set({ post: data.post });
      set({
        currentUserReaction: findUserReaction(data.post.reactions, user._id),
      });
    } catch (error) {
      set({ error: error.message });
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  reactToPost: async (postId, type, user) => {
    set({ isReacting: true });
    try {
      const previousReaction = get().currentUserReaction;
      const requestPayload = {};
      const METHOD = previousReaction === type ? "unreact" : "react";
      if (METHOD === "react") {
        requestPayload.type = type;
      }
      const { data } = await useApi().post(
        `/posts/${postId}/${METHOD}`,
        requestPayload
      );
      set({
        currentUserReaction: findUserReaction(data.reactions, user._id),
      });
      set({ post: { ...get().post, reactions: data.reactions } });
      console.log("Updated reactions", data.reactions);
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isReacting: false });
    }
  },
}));

export default useSinglePostStore;
