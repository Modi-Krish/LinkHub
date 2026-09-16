import { create } from "zustand";
import { api } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async (data) => {
    const response = await api.post("/auth/login", data);
    set({ user: response.data.data.user, isAuthenticated: true });
  },
  register: async (data) => {
    await api.post("/auth/register", data);
  },
  logout: async () => {
    await api.post("/auth/logout");
    set({ user: null, isAuthenticated: false });
  },
  checkAuth: async () => {
    try {
      // In a real app, you might have a /auth/me endpoint.
      // Here we rely on the refresh interceptor if tokens exist.
      await api.post("/auth/refresh");
      // For this simple implementation, we'll assume they are authenticated if refresh succeeds
      set({ isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
