import { create } from "zustand";
import { useApi } from "@/hooks/useApi";

const useUserStore = create((set, get) => ({
  userProfile: null,
  userPosts: [],
  loading: false,
  error: null,

  // Get own profile
  getUserProfile: async () => {
    const currentState = get();
    if (currentState.loading) return;

    try {
      set({ loading: true, error: null });

      // Get profile once
      const { data: profileData } = await useApi().get("/users/profile");
      const userData = profileData?.user || null;
      const userId = userData?._id;

      if (!userId) {
        throw new Error("Failed to get user ID");
      }

      // Only fetch posts since we already have profile data
      const { data: postsData } = await useApi().get(`/posts/user/${userId}`);
      const posts = postsData?.posts || [];

      // Single state update with existing profile data
      set({
        userProfile: userData,
        userPosts: posts,
        loading: false,
        error: null,
      });

      return { profile: userData, posts };
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch profile data",
        loading: false,
        userProfile: null,
        userPosts: [],
      });
      throw error;
    }
  },

  // New combined function to get profile and posts
  getProfileById: async (userId) => {
    const currentState = get();
    if (currentState.loading) return;

    try {
      set({ loading: true, error: null });

      // Fix the API endpoints to match backend routes
      const [profileResponse, postsResponse] = await Promise.all([
        useApi().get(`/users/profile/${userId}`), // Changed from /users/${userId}
        useApi().get(`/posts/user/${userId}`), // This one was correct
      ]);

      // Update both states at once
      set({
        userProfile: profileResponse.data.user,
        userPosts: postsResponse.data.posts,
        loading: false,
        error: null,
      });

      return {
        profile: profileResponse.data.user,
        posts: postsResponse.data.posts,
      };
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch profile data",
        loading: false,
      });
      throw error;
    }
  },

  // Update profile (including profile picture)
  updateProfile: async (formData) => {
    try {
      set({ loading: true, error: null });

      const form = new FormData();
      if (formData.name) form.append("name", formData.name);
      if (formData.bio) form.append("bio", formData.bio);
      if (formData.profilePic) form.append("profilePic", formData.profilePic);

      const { data } = await useApi().put("/users/profile", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update the store with new user data
      set((state) => ({
        userProfile: { ...state.userProfile, ...data.user },
        loading: false,
      }));

      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update profile",
        loading: false,
      });
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  },

  // Update cover photo
  updateCoverPhoto: async (formData) => {
    try {
      const { data } = await useApi().put("/users/cover-photo", formData);

      set((state) => ({
        userProfile: {
          ...state.userProfile,
          coverPhoto: data.coverPhoto,
        },
      }));

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update cover photo"
      );
    }
  },

  // Get user posts
  getUserPosts: async (userId) => {
    const currentState = get();
    if (currentState.loading) return;

    try {
      set({ loading: true, error: null });
      const { data } = await useApi().get(`/posts/user/${userId}`);
      // Only update if the posts are different
      if (
        JSON.stringify(currentState.userPosts) !== JSON.stringify(data.posts)
      ) {
        set({ userPosts: data.posts, loading: false });
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
    set({ userProfile: null, userPosts: [], loading: false, error: null });
  },

  // Get user profile by ID
  getUserProfileById: async (userId) => {
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

  // Follow user
  followUser: async (userId) => {
    try {
      const { data } = await useApi().post(`/users/follow/${userId}`);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to follow user");
    }
  },

  // Unfollow user
  unfollowUser: async (userId) => {
    try {
      const { data } = await useApi().post(`/users/unfollow/${userId}`);
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to unfollow user"
      );
    }
  },

  // Send friend request
  sendFriendRequest: async (userId) => {
    try {
      const { data } = await useApi().post(`/users/friend-request/${userId}`);
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to send friend request"
      );
    }
  },
}));

export default useUserStore;
