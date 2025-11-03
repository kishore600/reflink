// lib/api/users.ts
import { User, ConsultingOffer } from '@/types';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const usersAPI = {
  getUsers: async (params?: {
    skill?: string;
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: User[]; totalPages: number; currentPage: number; total: number }> => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUserProfile: async (username: string): Promise<User> => {
    const response = await api.get(`/users/${username}`);
    return response.data;
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  createConsultingOffer: async (offerData: {
    title: string;
    description: string;
    duration: number;
    skills: string[];
    benefits: string;
    category: string;
    difficulty: string;
  }): Promise<ConsultingOffer> => {
    const response = await api.post('/users/offers', offerData);
    return response.data;
  },
};