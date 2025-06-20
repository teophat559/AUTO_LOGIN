import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { Contest, ContestSubmission } from '../../types/contest';

export interface CreateContestRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  rules: string[];
  prizes: string[];
}

export interface UpdateContestRequest extends Partial<CreateContestRequest> {
  status?: 'draft' | 'active' | 'ended';
}

export interface SubmitContestRequest {
  contestId: string;
  solution: string;
  files?: File[];
}

export const contestService = {
  // Admin endpoints
  getAllContests: async (): Promise<Contest[]> => {
    return apiClient.get<Contest[]>(API_ENDPOINTS.ADMIN.CONTESTS);
  },

  createContest: async (data: CreateContestRequest): Promise<Contest> => {
    return apiClient.post<Contest>(API_ENDPOINTS.ADMIN.CONTESTS, data);
  },

  updateContest: async (id: string, data: UpdateContestRequest): Promise<Contest> => {
    return apiClient.put<Contest>(`${API_ENDPOINTS.ADMIN.CONTESTS}/${id}`, data);
  },

  deleteContest: async (id: string): Promise<void> => {
    return apiClient.delete(`${API_ENDPOINTS.ADMIN.CONTESTS}/${id}`);
  },

  // User endpoints
  getActiveContests: async (): Promise<Contest[]> => {
    return apiClient.get<Contest[]>(API_ENDPOINTS.CONTESTS.ROOT);
  },

  getContestDetails: async (id: string): Promise<Contest> => {
    return apiClient.get<Contest>(API_ENDPOINTS.CONTESTS.DETAIL(id));
  },

  submitContest: async (data: SubmitContestRequest): Promise<ContestSubmission> => {
    const formData = new FormData();
    formData.append('solution', data.solution);
    if (data.files) {
      data.files.forEach(file => formData.append('files', file));
    }

    return apiClient.post<ContestSubmission>(
      API_ENDPOINTS.CONTESTS.SUBMISSIONS(data.contestId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  getMySubmissions: async (contestId: string): Promise<ContestSubmission[]> => {
    return apiClient.get<ContestSubmission[]>(API_ENDPOINTS.CONTESTS.SUBMISSIONS(contestId));
  },
};