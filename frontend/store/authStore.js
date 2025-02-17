import { create } from "zustand";
import { useApi } from "@/hooks/useApi";
import { persist } from "zustand/middleware";
// Validation rules
const validateField = (name, value) => {
  switch (name) {
    case "name":
      if (!value.trim()) return "Name is required";
      if (value.length < 2) return "Name must be at least 2 characters";
      if (value.length > 50) return "Name must be less than 50 characters";
      return "";

    case "email":
      if (!value) return "Email is required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email format";
      return "";

    case "password":
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
      if (!/[A-Z]/.test(value))
        return "Password must contain at least one uppercase letter";
      if (!/[a-z]/.test(value))
        return "Password must contain at least one lowercase letter";
      if (!/[0-9]/.test(value))
        return "Password must contain at least one number";
      return "";

    default:
      return "";
  }
};

const useAuthStore = create(
  persist(
    (set, get) => {
      const api = useApi();

      return {
        user: null,
        error: null,
        loading: true,
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
          verification: {
            code: "",
          },
        },
        formErrors: {
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
        lastCodeSentAt: null,

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
            // Validate on change
            formErrors: {
              ...state.formErrors,
              [type]: {
                ...state.formErrors[type],
                [field]: validateField(field, value),
              },
            },
          }));
        },

        validateForm: (type) => {
          const { formData } = get();
          const newErrors = {};

          Object.keys(formData[type]).forEach((field) => {
            newErrors[field] = validateField(field, formData[type][field]);
          });

          set((state) => ({
            formErrors: {
              ...state.formErrors,
              [type]: newErrors,
            },
          }));

          return !Object.values(newErrors).some((error) => error);
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
            formErrors: {
              ...state.formErrors,
              [type]:
                type === "register"
                  ? { name: "", email: "", password: "" }
                  : { email: "", password: "" },
            },
          }));
        },

        // Auth Actions
        login: async () => {
          const { formData, validateForm } = get();

          if (!validateForm("login")) return false;

          set({ isSubmitting: true, error: null });
          const { data, error, success } = await api.post(
            "/auth/login",
            formData.login
          );

          if (success) {
            set({
              user: data.user,
              isSubmitting: false,
              error: null,
            });
            return true;
          } else {
            set({ error, isSubmitting: false });
            return false;
          }
        },

        register: async () => {
          const { formData, validateForm } = get();

          if (!validateForm("register")) return false;

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

        // Send Verification Code
        sendVerificationCode: async () => {
          const { lastCodeSentAt } = get();
          const now = Date.now();

          // Check if 1 minute has passed since last code sent
          if (lastCodeSentAt && now - lastCodeSentAt < 60000) {
            const remainingSeconds = Math.ceil(
              (60000 - (now - lastCodeSentAt)) / 1000
            );
            set({
              error: `Please wait ${remainingSeconds} seconds before requesting a new code`,
              successMessage: null,
            });
            return false;
          }

          set({ isSubmitting: true, error: null, successMessage: null });
          const { error, success } = await api.post(
            "/auth/send-verification-code"
          );

          if (success) {
            set({
              isSubmitting: false,
              lastCodeSentAt: Date.now(),
              successMessage: "Verification code has been sent to your email",
              error: null,
            });
            return true;
          } else {
            set({
              error,
              isSubmitting: false,
              successMessage: null,
            });
            return false;
          }
        },

        // Verify Email
        verifyEmail: async () => {
          const { formData } = get();

          if (!formData.verification.code) {
            set({ error: "Verification code is required" });
            return false;
          }

          set({ isSubmitting: true, error: null });
          const { error, success } = await api.post("/auth/verify-email", {
            code: formData.verification.code,
          });

          if (success) {
            set((state) => ({
              user: { ...state.user, isVerified: true },
              isSubmitting: false,
            }));
            return true;
          } else {
            set({ error, isSubmitting: false });
            return false;
          }
        },

        // Clear Messages
        clearMessages: () => set({ error: null, successMessage: null }),
      };
    },
    {
      name: "auth-storage",
      partialize: (state) => ({
        lastCodeSentAt: state.lastCodeSentAt,
      }),
    }
  )
);

export default useAuthStore;
