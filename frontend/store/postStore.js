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
    if (currentState.loading || currentState.posts.length > 0) return; // Prevent fetch if we already have posts

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

  // Add a new function to force refresh posts
  refreshFeedPosts: async () => {
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

  // Modified createPost to handle image with better error handling
  createPost: async (postData) => {
    try {
      const formData = new FormData();
      formData.append("caption", postData.caption);

      if (postData.image) {
        formData.append("media", postData.image);
        console.log("Image being sent:", postData.image);
      }

      // Log the entire FormData
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const { data } = await useApi().post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    } catch (error) {
      console.error("Full error details:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Failed to create post. Please check if the image size is within limits."
      );
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
  reportPost: async (postId, reason, desc) => {
    console.log(postId, reason, desc);
    try {
      if (reason === "other" && desc) {
        await useApi().post(`/posts/${postId}/report`, {
          reason,
          description: desc,
        });
      } else {
        await useApi().post(`/posts/${postId}/report`, {
          reason,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
}));

export default usePostStore;
