// lib/api/referrals.ts
import { Referral } from '@/types';
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

export const referralsAPI = {
  getReferrals: async (type?: 'as-jobseeker' | 'as-employee' | 'all'): Promise<Referral[]> => {
    const response = await api.get('/referrals', { params: { type } });
    return response.data;
  },

  submitReferral: async (referralData: {
    sessionId: string;
    company: string;
    position: string;
    jobDescription?: string;
    applicationLink?: string;
    employeeNotes?: string;
  }): Promise<Referral> => {
    const response = await api.post('/referrals', referralData);
    return response.data;
  },

  updateReferralStatus: async (
    referralId: string,
    statusData: {
      status: string;
      notes?: string;
    }
  ): Promise<Referral> => {
    const response = await api.put(`/referrals/${referralId}/status`, statusData);
    return response.data;
  },
};