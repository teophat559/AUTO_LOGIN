import axios from 'axios';
import { Contest, Contestant } from '../../shared/types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Contest API
export const contestApi = {
  getAll: () => api.get<Contest[]>('/contests'),
  getById: (id: string) => api.get<Contest>(`/contests/${id}`),
  create: (data: Omit<Contest, 'id'>) => api.post<Contest>('/contests', data),
  update: (id: string, data: Partial<Contest>) =>
    api.put<Contest>(`/contests/${id}`, data),
  delete: (id: string) => api.delete(`/contests/${id}`),
  uploadImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<{ imageUrl: string }>(`/contests/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Contestant API
export const contestantApi = {
  getAll: () => api.get<Contestant[]>('/contestants'),
  getById: (id: string) => api.get<Contestant>(`/contestants/${id}`),
  create: (data: Omit<Contestant, 'id'>) =>
    api.post<Contestant>('/contestants', data),
  update: (id: string, data: Partial<Contestant>) =>
    api.put<Contestant>(`/contestants/${id}`, data),
  delete: (id: string) => api.delete(`/contestants/${id}`),
  uploadImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<{ imageUrl: string }>(`/contestants/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getByContest: (contestId: string) =>
    api.get<Contestant[]>(`/contests/${contestId}/contestants`),
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: any }>('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// Stats API
export const statsApi = {
  getDashboardStats: () => api.get('/stats/dashboard'),
  getContestStats: (contestId: string) =>
    api.get(`/stats/contests/${contestId}`),
  getContestantStats: (contestantId: string) =>
    api.get(`/stats/contestants/${contestantId}`),
};

export default api;