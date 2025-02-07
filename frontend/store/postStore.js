import { create } from "zustand";
import { useApi } from "@/hooks/useApi";

const usePostStore = create((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  // Add reaction to post
  addReaction: async (postId, type) => {
    try {
      if (!postId) throw new Error("Post ID is required");
      set({ loading: true, error: null });

      const { data } = await useApi().post(`/posts/${postId}/react`, {
        type,
      });

      // Update the post in the store
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                reactions: data.reactions,
                reactionCount: data.reactionCount,
                userReaction: data.userReaction,
              }
            : post
        ),
        loading: false,
      }));

      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add reaction",
        loading: false,
      });
      throw error;
    }
  },

  // Remove reaction from post
  removeReaction: async (postId) => {
    try {
      if (!postId) throw new Error("Post ID is required");
      set({ loading: true, error: null });

      const { data } = await useApi().post(`/posts/${postId}/unreact`);

      // Update the post in the store
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                reactions: data.reactions,
                reactionCount: data.reactionCount,
                userReaction: null,
              }
            : post
        ),
        loading: false,
      }));

      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to remove reaction",
        loading: false,
      });
      throw error;
    }
  },

  // Get feed posts
  getFeedPosts: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await useApi().get("/posts/feed");
      set({ posts: data.posts, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch posts",
        loading: false,
      });
    }
  },

  // Clear store
  clearStore: () => {
    set({ posts: [], loading: false, error: null });
  },

  // Get post reactions
  getPostReactions: async (postId) => {
    try {
      if (!postId) throw new Error("Post ID is required");

      const { data } = await useApi().get(`/posts/${postId}/reactions`);

      // Update the post in the store
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                reactions: data.reactions,
                userReaction: data.userReaction,
              }
            : post
        ),
      }));

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch reactions"
      );
    }
  },

  // Create a new post
  createPost: async (formData) => {
    try {
      set({ loading: true, error: null });
      const { data } = await useApi().post("/posts", formData);

      // Update posts list with new post
      set((state) => ({
        posts: [data.post, ...state.posts],
        loading: false,
      }));

      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create post",
        loading: false,
      });
      throw error;
    }
  },
}));

export default usePostStore;
