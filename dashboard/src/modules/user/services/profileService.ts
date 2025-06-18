import { apiClient } from '../../../api/client';
import { API_CONFIG } from '../../../api/config';
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../types/profile';

export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>(API_CONFIG.ENDPOINTS.USER.PROFILE);
    return response;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await apiClient.put<UserProfile>(API_CONFIG.ENDPOINTS.USER.PROFILE, data);
    return response;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.put(`${API_CONFIG.ENDPOINTS.USER.PROFILE}/password`, data);
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post<{ avatarUrl: string }>(`${API_CONFIG.ENDPOINTS.USER.PROFILE}/avatar`, formData);
    return response;
  }
};