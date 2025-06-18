import { apiClient } from '../../../api/client';
import { API_CONFIG } from '../../../api/config';
import { Notification, NotificationSettings } from '../types/notification';

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>(API_CONFIG.ENDPOINTS.USER.NOTIFICATIONS);
    return response;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.put(`${API_CONFIG.ENDPOINTS.USER.NOTIFICATIONS}/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.put(`${API_CONFIG.ENDPOINTS.USER.NOTIFICATIONS}/read-all`);
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.USER.NOTIFICATIONS}/${notificationId}`);
  },

  getSettings: async (): Promise<NotificationSettings> => {
    const response = await apiClient.get<NotificationSettings>(`${API_CONFIG.ENDPOINTS.USER.NOTIFICATIONS}/settings`);
    return response;
  },

  updateSettings: async (settings: NotificationSettings): Promise<NotificationSettings> => {
    const response = await apiClient.put<NotificationSettings>(`${API_CONFIG.ENDPOINTS.USER.NOTIFICATIONS}/settings`, settings);
    return response;
  }
};