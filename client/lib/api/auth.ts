/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { AuthResponse, User } from "@/types";

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

export const authAPI = {
  register: async (userData: any): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  login : async(credientials:any):Promise<AuthResponse>=>{
    const response = await api.post("/auth/login", credientials);
    return response.data;
  },
   getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
