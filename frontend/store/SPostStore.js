import { create } from "zustand";
import { useApi } from "@/hooks/useApi";
const findCommentReaction = (comment, userId) => {
  for (const [reactionType, users] of Object.entries(comment.reactions)) {
    if (users.includes(userId)) {
      return reactionType;
    }
  }
  return null;
};
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
  reactors: [],
  postComments: [],
  currentCommentReaction: {},
  getPost: async (postId, user) => {
    set({ loading: true });
    try {
      const { data } = await useApi().get(`/posts/${postId}`);
      set({ post: data.post });
      set({
        currentUserReaction: findUserReaction(data.post.reactions, user._id),
      });
      set({ postComments: data.post.comments });
      const commentReactions = {};
      data.post.comments.forEach((comment) => {
        commentReactions[comment._id] = findCommentReaction(comment, user._id);
      });
      set({ currentCommentReaction: commentReactions });
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
  getReactors: async (postId) => {
    set({ loading: true });
    try {
      const { data } = await useApi().get(`/posts/${postId}/reactors`);
      set({ reactors: data.reactors });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  reactToComment: async (postId, commentId, type, user, setIsReacting) => {
    setIsReacting(true);
    try {
      const previousReaction = get().currentCommentReaction[commentId];
      const requestPayload = {};
      const METHOD = previousReaction === type ? "unreact" : "react";
      if (METHOD === "react") {
        requestPayload.type = type;
      }
      const { data } = await useApi().post(
        `/posts/${postId}/comment/${commentId}/${METHOD}`,
        requestPayload
      );

      set({
        currentCommentReaction: {
          ...get().currentCommentReaction,
          [commentId]: findUserReaction(data.reactions, user._id),
        },
      });
      set({
        postComments: get().postComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, reactions: data.reactions }
            : comment
        ),
      });
      // console.log(get().postComments);
    } catch (error) {
      set({ error: error.message });
    } finally {
      setIsReacting(false);
    }
  },
}));

export default useSinglePostStore;
