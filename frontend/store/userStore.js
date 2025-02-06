import { create } from "zustand";
import { useApi } from "@/hooks/useApi";

const useUserStore = create((set) => ({
  userProfile: null,
  userPosts: [],
  error: null,

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      set({ loading: true, error: null });
      const { data } = await useApi().get(`/users/profile/${userId}`);
      set({ userProfile: data.user, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch profile",
        loading: false,
      });
    }
  },

  // Update profile
  updateProfile: async (updates) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.put("/api/users/profile", updates);
      set({ userProfile: data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update profile",
        loading: false,
      });
    }
  },

  // Update profile picture
  updateProfilePic: async (formData) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.put("/api/users/profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ userProfile: data, loading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to update profile picture",
        loading: false,
      });
    }
  },

  // Get user posts
  getUserPosts: async (userId) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(`/api/users/${userId}/posts`);
      set({ userPosts: data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch posts",
        loading: false,
      });
    }
  },

  // Clear store
  clearStore: () => {
    set({ userProfile: null, userPosts: [], loading: false, error: null });
  },
}));

export default useUserStore;
