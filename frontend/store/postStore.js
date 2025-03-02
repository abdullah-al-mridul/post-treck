import { create } from "zustand";
import { useApi } from "@/hooks/useApi";
const getUserReaction = (post, userId) => {
  if (!post || !post.reactions || !userId) return null;

  for (const [reactionType, users] of Object.entries(post.reactions)) {
    if (users.some((user) => user._id === userId)) {
      return reactionType;
    }
  }
  return null;
};

const usePostStore = create((set, get) => ({
  posts: [],
  loading: false,
  error: null,
  currentUserReactions: {},
  // Add reaction to post
  addReaction: async (postId, type, currentReaction) => {
    try {
      if (!postId) throw new Error("Post ID is required");
      // set({ loading: true, error: null });
      const METHOD = currentReaction === type ? "unreact" : "react";
      const requestPayload = {};
      if (METHOD === "react") {
        requestPayload.type = type;
      }
      const { data } = await useApi().post(`/posts/${postId}/${METHOD}`, {
        ...requestPayload,
      });
      // Update the post in the store
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                reactions: data.reactions,
                reactionCount: data.reactionCount,
              }
            : post
        ),
      }));
      set((state) => ({
        currentUserReactions: {
          ...state.currentUserReactions,
          [postId]: type === currentReaction ? null : type,
        },
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add reaction",
        loading: false,
      });
      throw error;
    }
  },
  // Get feed posts
  getFeedPosts: async (userId) => {
    const currentState = get();
    if (currentState.loading || currentState.posts.length > 0) return;

    try {
      set({ loading: true, error: null });
      const { data } = await useApi().get("/posts/feed");

      set({ posts: data.posts, loading: false });
      set({
        currentUserReactions: data.posts.reduce((acc, post) => {
          acc[post._id] = getUserReaction(post, userId);
          return acc;
        }, {}),
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch posts",
        loading: false,
      });
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
