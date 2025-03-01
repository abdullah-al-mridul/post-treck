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
const findReplyReaction = (reply, userId) => {
  for (const [reactionType, users] of Object.entries(reply.reactions)) {
    if (users.includes(userId)) {
      return reactionType;
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
  isNewCommenting: false,
  commentReplies: {},
  currentReplyReaction: {},
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
      const commentReplies = {};
      data.post.comments.forEach((comment) => {
        commentReplies[comment._id] = comment.replies;
      });
      set({ commentReplies });
      const replyReactions = {};
      data.post.comments.forEach((comment) => {
        comment.replies.forEach((reply) => {
          replyReactions[reply._id] = findReplyReaction(reply, user._id);
        });
      });
      set({ currentReplyReaction: replyReactions });
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
  editComment: async (postId, commentId, content, setIsCommentUpdating) => {
    setIsCommentUpdating(true);
    try {
      const { data } = await useApi().put(
        `/posts/${postId}/comment/${commentId}`,
        { content }
      );
      set({
        postComments: get().postComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, content: data.comment.content }
            : comment
        ),
      });
    } catch (error) {
      set({ error: error.message });
    } finally {
      setIsCommentUpdating(false);
    }
  },
  addComment: async (postId, comment) => {
    set({ isNewCommenting: true });
    try {
      const { data } = await useApi().post(`/posts/${postId}/comment`, {
        content: comment,
      });
      set({
        postComments: [...get().postComments, data.comment],
      });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isNewCommenting: false });
    }
  },
  deleteComment: async (postId, commentId, setIsDeletingComment) => {
    setIsDeletingComment(true);
    try {
      await useApi().delete(`/posts/${postId}/comment/${commentId}`);
      set({
        postComments: get().postComments.filter(
          (comment) => comment._id !== commentId
        ),
      });
    } catch (error) {
      set({ error: error.message });
    } finally {
      setIsDeletingComment(false);
    }
  },
  reactToReply: async (
    postId,
    commentId,
    replyId,
    type,
    user,
    setIsReacting
  ) => {
    setIsReacting(true);
    try {
      const previousReaction = get().currentReplyReaction[replyId];
      const requestPayload = {};
      const METHOD = previousReaction === type ? "unreact" : "react";
      if (METHOD === "react") {
        requestPayload.type = type;
      }
      const { data } = await useApi().post(
        `/posts/${postId}/comment/${commentId}/reply/${replyId}/${METHOD}`,
        requestPayload
      );
      set({
        currentReplyReaction: {
          ...get().currentReplyReaction,
          [replyId]: findUserReaction(data.reactions, user._id),
        },
      });
      set({
        commentReplies: {
          ...get().commentReplies,
          [commentId]: get().commentReplies[commentId].map((reply) =>
            reply._id === replyId
              ? { ...reply, reactions: data.reactions }
              : reply
          ),
        },
      });
    } catch (error) {
      set({ error: error.message });
    } finally {
      setIsReacting(false);
    }
  },
  deleteReply: async (postId, commentId, replyId, setIsDeletingReply) => {
    setIsDeletingReply(true);
    try {
      await useApi().delete(
        `/posts/${postId}/comment/${commentId}/reply/${replyId}`
      );
      set({
        commentReplies: {
          ...get().commentReplies,
          [commentId]: get().commentReplies[commentId].filter(
            (reply) => reply._id !== replyId
          ),
        },
      });
    } catch (error) {
      set({ error: error.message });
    } finally {
      setIsDeletingReply(false);
    }
  },
  addReply: async (postId, commentId, reply, setIsAddingReply) => {
    setIsAddingReply(true);
    try {
      const { data } = await useApi().post(
        `/posts/${postId}/comment/${commentId}/reply`,
        { content: reply }
      );
      set({
        commentReplies: {
          ...get().commentReplies,
          [commentId]: [...get().commentReplies[commentId], data.reply],
        },
      });
    } catch (error) {
      set({ error: error.message });
    } finally {
      setIsAddingReply(false);
    }
  },
  reportPost: async (postId, { reason, description }) => {
    try {
      await useApi().post(`/posts/${postId}/report`, {
        reason,
        description,
      });
    } catch (error) {
      throw error;
    }
  },
}));

export default useSinglePostStore;
