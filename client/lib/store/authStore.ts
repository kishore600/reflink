/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/store/authStore.ts
import { create } from 'zustand';
import { User } from '@/types';
import { authAPI } from '@/lib/api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  isAuthenticated: !!(
    typeof window !== 'undefined' && localStorage.getItem('token')
  ),

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response:any = await authAPI.login({ email, password });
      localStorage.setItem('token', response.token);
      set({
        user: response,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (userData: any) => {
    set({ isLoading: true });
    try {
      const response:any = await authAPI.register(userData);
      localStorage.setItem('token', response.token);
      set({
        user: response,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  getCurrentUser: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      const user = await authAPI.getMe();
      set({ user, isLoading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
