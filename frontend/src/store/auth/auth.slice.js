import { create } from "zustand";
import axiosInstance from "../../requestMethod";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  isCheckingAuth: true,
  error: null,

  // ── Check auth on app load ────────────────────────────────
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const { data } = await axiosInstance.get("auth/me");
      set({ user: data.data, isCheckingAuth: false });
    } catch {
      set({ user: null, isCheckingAuth: false });
    }
  },

  // ── Register ──────────────────────────────────────────────
  signup: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.post("auth/signup", payload);
      set({ user: data.data, isLoading: false });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Try again.";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // ── Login ─────────────────────────────────────────────────
  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.post("auth/login", payload);
      const { accessToken, ...user } = data.data;

      if (accessToken) localStorage.setItem("token", accessToken);

      set({ user, isLoading: false });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Check your credentials.";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // ── Logout ────────────────────────────────────────────────
  logout: async () => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("auth/logout");
    } finally {
      localStorage.removeItem("token");
      set({ user: null, isLoading: false, error: null });
    }
  },

  clearError: () => set({ error: null }),
}));
