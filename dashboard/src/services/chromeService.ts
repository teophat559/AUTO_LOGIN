import axios from 'axios';

interface ChromeProfile {
  id: string;
  name: string;
  path: string;
}

class ChromeService {
  private static instance: ChromeService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  }

  public static getInstance(): ChromeService {
    if (!ChromeService.instance) {
      ChromeService.instance = new ChromeService();
    }
    return ChromeService.instance;
  }

  async getChromeProfiles(): Promise<ChromeProfile[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/chrome/profiles`);
      return response.data;
    } catch (error) {
      console.error('Failed to get Chrome profiles:', error);
      throw error;
    }
  }

  async launchChrome(profileId?: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/api/chrome/launch`, { profileId });
    } catch (error) {
      console.error('Failed to launch Chrome:', error);
      throw error;
    }
  }

  async deleteChromeProfile(profileId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/api/chrome/profiles/${profileId}`);
    } catch (error) {
      console.error('Failed to delete Chrome profile:', error);
      throw error;
    }
  }

  async getChromeStatus(): Promise<{
    isRunning: boolean;
    currentProfile?: ChromeProfile;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/chrome/status`);
      return response.data;
    } catch (error) {
      console.error('Failed to get Chrome status:', error);
      throw error;
    }
  }

  async navigateToFacebook(): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/api/chrome/navigate`, {
        url: 'https://www.facebook.com/'
      });
    } catch (error) {
      console.error('Failed to navigate to Facebook:', error);
      throw error;
    }
  }

  async checkLoginStatus(): Promise<{
    status: 'success' | 'pending' | 'error';
    type?: 'checkpoint' | '2fa' | 'captcha' | 'wrong_password' | 'wrong_account' | 'wrong_phone';
    message: string;
  }> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/chrome/login-status`);
      return response.data;
    } catch (error) {
      console.error('Failed to check login status:', error);
      throw error;
    }
  }

  async getCookies(): Promise<string> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/chrome/cookies`);
      return response.data;
    } catch (error) {
      console.error('Failed to get cookies:', error);
      throw error;
    }
  }
}

export default ChromeService;