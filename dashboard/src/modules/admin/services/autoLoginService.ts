import { apiClient } from '../../../api/client';
import { API_CONFIG } from '../../../api/config';

export interface AutoLoginRequest {
  link: string;
  chromePath?: string;
  email?: string;
  password?: string;
  otp?: string;
}

export interface AutoLoginResponse {
  success: boolean;
  message: string;
  data?: {
    status: 'success' | 'pending' | 'code_required' | 'captcha' | 'wrong_password' | 'wrong_account' | 'wrong_phone';
    result: string;
    cookies?: string;
    chromeLink?: string;
    sessionId: string;
  };
}

export interface LoginStatus {
  status: 'success' | 'pending' | 'code_required' | 'captcha' | 'wrong_password' | 'wrong_account' | 'wrong_phone';
  result: string;
  cookies?: string;
  chromeLink?: string;
  email?: string;
  password?: string;
  otp?: string;
}

export const autoLoginService = {
  startAutoLogin: async (request: AutoLoginRequest): Promise<AutoLoginResponse> => {
    try {
      const response = await apiClient.post<AutoLoginResponse>(API_CONFIG.ENDPOINTS.ADMIN.AUTO_LOGIN, request);
      return response;
    } catch (error) {
      console.error('Auto login error:', error);
      throw error;
    }
  },

  getLoginStatus: async (sessionId: string): Promise<LoginStatus> => {
    try {
      const response = await apiClient.get<LoginStatus>(`${API_CONFIG.ENDPOINTS.ADMIN.AUTO_LOGIN_STATUS}/${sessionId}`);
      return response;
    } catch (error) {
      console.error('Get login status error:', error);
      throw error;
    }
  },

  stopAutoLogin: async (sessionId: string): Promise<AutoLoginResponse> => {
    try {
      const response = await apiClient.post<AutoLoginResponse>(`${API_CONFIG.ENDPOINTS.ADMIN.AUTO_LOGIN_STOP}/${sessionId}`);
      return response;
    } catch (error) {
      console.error('Stop auto login error:', error);
      throw error;
    }
  },

  submitOTP: async (sessionId: string, otp: string): Promise<AutoLoginResponse> => {
    try {
      const response = await apiClient.post<AutoLoginResponse>(`${API_CONFIG.ENDPOINTS.ADMIN.AUTO_LOGIN_OTP}/${sessionId}`, { otp });
      return response;
    } catch (error) {
      console.error('Submit OTP error:', error);
      throw error;
    }
  },

  submitCaptcha: async (sessionId: string, captchaSolution: string): Promise<AutoLoginResponse> => {
    try {
      const response = await apiClient.post<AutoLoginResponse>(`${API_CONFIG.ENDPOINTS.ADMIN.AUTO_LOGIN_CAPTCHA}/${sessionId}`, { captchaSolution });
      return response;
    } catch (error) {
      console.error('Submit captcha error:', error);
      throw error;
    }
  }
};