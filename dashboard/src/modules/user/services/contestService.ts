import { apiClient } from '../../../api/client';
import { API_CONFIG } from '../../../api/config';
import { Contest, ContestDetail } from '../types/contest';

export const contestService = {
  getContests: async (): Promise<Contest[]> => {
    const response = await apiClient.get<Contest[]>(API_CONFIG.ENDPOINTS.USER.CONTESTS);
    return response;
  },

  getContest: async (id: string): Promise<ContestDetail> => {
    const response = await apiClient.get<ContestDetail>(`${API_CONFIG.ENDPOINTS.USER.CONTESTS}/${id}`);
    return response;
  },

  joinContest: async (contestId: string): Promise<void> => {
    await apiClient.post(`${API_CONFIG.ENDPOINTS.USER.CONTESTS}/${contestId}/join`);
  },

  leaveContest: async (contestId: string): Promise<void> => {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.USER.CONTESTS}/${contestId}/join`);
  }
};