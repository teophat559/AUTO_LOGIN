import axios from 'axios';

interface LoginFormData {
  email: string;
  password: string;
  otp?: string;
  chromePath?: string;
  proxy?: string;
  linkName?: string;
  useProxy: boolean;
  autoSolveCaptcha: boolean;
  waitForOtp: boolean;
  retryCount: number;
}

interface LoginResult {
  status: 'success' | 'pending' | 'error';
  message: string;
  cookies?: string;
  errorType?: 'checkpoint' | '2fa' | 'captcha' | 'wrong_password' | 'wrong_account' | 'wrong_phone';
  sessionId?: string;
  ip?: string;
  timestamp?: string;
}

interface SaveResultData {
  email: string;
  password: string;
  otp?: string;
  status: string;
  cookies?: string;
  ip: string;
  chromePath?: string;
  linkName?: string;
  resultMessage?: string;
  errorType?: string;
}

class AutoLoginService {
  private static instance: AutoLoginService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  }

  public static getInstance(): AutoLoginService {
    if (!AutoLoginService.instance) {
      AutoLoginService.instance = new AutoLoginService();
    }
    return AutoLoginService.instance;
  }

  async startAutoLogin(formData: LoginFormData): Promise<LoginResult> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/auto-login/start`, formData);
      return response.data;
    } catch (error) {
      console.error('Auto login error:', error);
      throw error;
    }
  }

  async checkLoginStatus(sessionId: string): Promise<LoginResult> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/auto-login/status/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Status check error:', error);
      throw error;
    }
  }

  async saveLoginResult(data: SaveResultData): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/api/auto-login/save`, data);
    } catch (error) {
      console.error('Save result error:', error);
      throw error;
    }
  }

  async getLoginHistory(page: number = 1, limit: number = 50): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/auto-login/history`, {
        params: { page, limit }
      });
      return response.data.history || [];
    } catch (error) {
      console.error('Get history error:', error);
      return [];
    }
  }

  async getStatistics(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/auto-login/statistics`);
      return response.data;
    } catch (error) {
      console.error('Get statistics error:', error);
      return {
        total: 0,
        success: 0,
        pending: 0,
        error: 0,
        checkpoint: 0,
        '2fa': 0,
        captcha: 0,
        wrong_password: 0,
        wrong_account: 0,
        wrong_phone: 0
      };
    }
  }

  async getChromeProfiles(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/chrome/profiles`);
      return response.data.profiles || [];
    } catch (error) {
      console.error('Get chrome profiles error:', error);
      return [];
    }
  }

  async getProxyList(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/proxy/list`);
      return response.data.proxies || [];
    } catch (error) {
      console.error('Get proxy list error:', error);
      return [];
    }
  }

  async stopAutoLogin(sessionId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/api/auto-login/stop/${sessionId}`);
    } catch (error) {
      console.error('Stop auto login error:', error);
      throw error;
    }
  }

  async deleteLoginRecord(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/api/auto-login/record/${id}`);
    } catch (error) {
      console.error('Delete record error:', error);
      throw error;
    }
  }

  async clearHistory(): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/api/auto-login/history`);
    } catch (error) {
      console.error('Clear history error:', error);
      throw error;
    }
  }

  async exportHistory(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/auto-login/export`, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Export history error:', error);
      throw error;
    }
  }

  async getSystemStatus(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/system/status`);
      return response.data;
    } catch (error) {
      console.error('Get system status error:', error);
      return {
        chromeRunning: false,
        activeSessions: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        diskUsage: 0
      };
    }
  }

  async updateSettings(settings: any): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/api/settings`, settings);
    } catch (error) {
      console.error('Update settings error:', error);
      throw error;
    }
  }

  async getSettings(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/settings`);
      return response.data;
    } catch (error) {
      console.error('Get settings error:', error);
      return {
        defaultChromePath: '',
        defaultProxy: '',
        autoSolveCaptcha: true,
        waitForOtp: false,
        retryCount: 3,
        pollingInterval: 3000
      };
    }
  }
}

export default AutoLoginService;