import { create } from "zustand";
import { useApi } from "@/hooks/useApi";

const useAuthStore = create((set, get) => {
  const api = useApi();

  return {
    user: null,
    error: null,
    loading: false,
    isSubmitting: false,
    formData: {
      login: {
        email: "",
        password: "",
      },
      register: {
        name: "",
        email: "",
        password: "",
      },
    },

    // Form Actions
    setFormData: (type, field, value) => {
      set((state) => ({
        formData: {
          ...state.formData,
          [type]: {
            ...state.formData[type],
            [field]: value,
          },
        },
      }));
    },

    resetForm: (type) => {
      set((state) => ({
        formData: {
          ...state.formData,
          [type]:
            type === "register"
              ? { name: "", email: "", password: "" }
              : { email: "", password: "" },
        },
      }));
    },

    // Auth Actions
    login: async () => {
      const { formData } = get();
      set({ isSubmitting: true, error: null });
      const { data, error, success } = await api.post(
        "/auth/login",
        formData.login
      );

      if (success) {
        set({ user: data.user, isSubmitting: false });
        return true;
      } else {
        set({ error, isSubmitting: false });
        return false;
      }
    },

    register: async () => {
      const { formData } = get();
      set({ isSubmitting: true, error: null });
      const { error, success } = await api.post(
        "/auth/register",
        formData.register
      );

      if (success) {
        set({ isSubmitting: false });
        return true;
      } else {
        set({ error, isSubmitting: false });
        return false;
      }
    },

    logout: async () => {
      set({ isSubmitting: true });
      const { error, success } = await api.post("/auth/logout");

      if (success) {
        set({ user: null, isSubmitting: false });
      } else {
        set({ isSubmitting: false });
      }
    },

    checkAuth: async () => {
      set({ loading: true });
      try {
        const { data, error, success } = await api.get("/auth/me");
        if (success) {
          set({ user: data.user, loading: false });
        } else {
          set({ user: null, error, loading: false });
        }
      } catch (err) {
        set({ user: null, loading: false });
      }
    },

    clearError: () => set({ error: null }),
  };
});

export default useAuthStore;
