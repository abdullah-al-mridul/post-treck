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
    const currentState = get();
    if (currentState.loading) return; // Prevent multiple calls if already loading

    try {
      set({ loading: true, error: null });
      const { data } = await useApi().get("/posts/feed");

      // Only update if posts have changed
      if (JSON.stringify(currentState.posts) !== JSON.stringify(data.posts)) {
        set({ posts: data.posts, loading: false });
      } else {
        set({ loading: false });
      }
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

  // Add comment to post
  addComment: async (postId, content) => {
    try {
      if (!postId) throw new Error("Post ID is required");
      set({ loading: true, error: null });

      const { data } = await useApi().post(`/posts/${postId}/comment`, {
        content,
      });

      // Update the post in the store
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: [...post.comments, data.comment],
              }
            : post
        ),
        loading: false,
      }));

      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add comment",
        loading: false,
      });
      throw error;
    }
  },

  // Add reply to comment
  addReply: async (postId, commentId, content) => {
    try {
      if (!postId || !commentId)
        throw new Error("Post ID and Comment ID are required");
      set({ loading: true, error: null });

      const { data } = await useApi().post(
        `/posts/${postId}/comment/${commentId}/reply`,
        { content }
      );

      // Update the post in the store
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === commentId
                    ? {
                        ...comment,
                        replies: [...comment.replies, data.reply],
                      }
                    : comment
                ),
              }
            : post
        ),
        loading: false,
      }));

      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add reply",
        loading: false,
      });
      throw error;
    }
  },
}));

export default usePostStore;
