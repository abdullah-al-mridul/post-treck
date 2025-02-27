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
}));

export default useSinglePostStore;
