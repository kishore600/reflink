// lib/api/sessions.ts
import { Session } from '@/types';
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

export const sessionsAPI = {
  getSessions: async (type?: 'as-jobseeker' | 'as-employee' | 'all'): Promise<Session[]> => {
    const response = await api.get('/sessions', { params: { type } });
    return response.data;
  },

  bookSession: async (sessionData: {
    consultingOfferId: string;
    scheduledAt: string;
    notes?: string;
  }): Promise<Session> => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  },

  updateSessionStatus: async (
    sessionId: string,
    statusData: {
      status: string;
      meetingLink?: string;
      notes?: string;
    }
  ): Promise<Session> => {
    const response = await api.put(`/sessions/${sessionId}/status`, statusData);
    return response.data;
  },

    cancelSession: async (sessionId: string): Promise<void> => {
    const response = await api.delete(`/sessions/${sessionId}`);
    return response.data;
  },
};