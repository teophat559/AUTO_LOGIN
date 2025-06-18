import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatar?: File;
}

export interface UpdateSettingsRequest {
  language?: string;
  theme?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export const userService = {
  // Admin endpoints
  getAllUsers: async (): Promise<User[]> => {
    return apiClient.get<User[]>(API_ENDPOINTS.ADMIN.USERS);
  },

  getUserDetails: async (id: string): Promise<User> => {
    return apiClient.get<User>(`${API_ENDPOINTS.ADMIN.USERS}/${id}`);
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    return apiClient.put<User>(`${API_ENDPOINTS.ADMIN.USERS}/${id}`, data);
  },

  deleteUser: async (id: string): Promise<void> => {
    return apiClient.delete(`${API_ENDPOINTS.ADMIN.USERS}/${id}`);
  },

  // User endpoints
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>(API_ENDPOINTS.USER.PROFILE);
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.avatar) formData.append('avatar', data.avatar);

    return apiClient.put<User>(API_ENDPOINTS.USER.PROFILE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateSettings: async (data: UpdateSettingsRequest): Promise<void> => {
    return apiClient.put(API_ENDPOINTS.USER.SETTINGS, data);
  },

  getNotifications: async (): Promise<Notification[]> => {
    return apiClient.get<Notification[]>(API_ENDPOINTS.USER.NOTIFICATIONS);
  },

  markNotificationAsRead: async (id: string): Promise<void> => {
    return apiClient.put(`${API_ENDPOINTS.USER.NOTIFICATIONS}/${id}/read`);
  },

  markAllNotificationsAsRead: async (): Promise<void> => {
    return apiClient.put(`${API_ENDPOINTS.USER.NOTIFICATIONS}/read-all`);
  },
};