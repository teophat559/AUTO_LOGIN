import { apiClient } from '../../../api/client';
import { API_CONFIG } from '../../../api/config';
import { Submission, CreateSubmissionRequest, UpdateSubmissionRequest } from '../types/submission';

export const submissionService = {
  getSubmissions: async (): Promise<Submission[]> => {
    const response = await apiClient.get<Submission[]>(API_CONFIG.ENDPOINTS.USER.SUBMISSIONS);
    return response;
  },

  getSubmission: async (id: string): Promise<Submission> => {
    const response = await apiClient.get<Submission>(`${API_CONFIG.ENDPOINTS.USER.SUBMISSIONS}/${id}`);
    return response;
  },

  createSubmission: async (data: CreateSubmissionRequest): Promise<Submission> => {
    const formData = new FormData();
    formData.append('contestId', data.contestId);
    formData.append('title', data.title);
    if (data.description) {
      formData.append('description', data.description);
    }
    data.files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    const response = await apiClient.post<Submission>(API_CONFIG.ENDPOINTS.USER.SUBMISSIONS, formData);
    return response;
  },

  updateSubmission: async (id: string, data: UpdateSubmissionRequest): Promise<Submission> => {
    const formData = new FormData();
    if (data.title) {
      formData.append('title', data.title);
    }
    if (data.description) {
      formData.append('description', data.description);
    }
    if (data.files) {
      data.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const response = await apiClient.put<Submission>(`${API_CONFIG.ENDPOINTS.USER.SUBMISSIONS}/${id}`, formData);
    return response;
  },

  deleteSubmission: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.USER.SUBMISSIONS}/${id}`);
  }
};