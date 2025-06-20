import React, { createContext, useContext, useState, useEffect } from 'react';
import AutoLoginService from '../services/autoLoginService';

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

interface AutoLoginContextType {
  isProcessing: boolean;
  currentSession: string | null;
  loginHistory: any[];
  statistics: any;
  currentStatus: LoginResult | null;
  startAutoLogin: (formData: LoginFormData) => Promise<void>;
  stopAutoLogin: () => void;
  refreshHistory: () => Promise<void>;
  refreshStatistics: () => Promise<void>;
  updateStatus: (status: LoginResult) => void;
}

const AutoLoginContext = createContext<AutoLoginContextType | undefined>(undefined);

export const AutoLoginProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>({});
  const [currentStatus, setCurrentStatus] = useState<LoginResult | null>(null);
  const service = AutoLoginService.getInstance();

  const startAutoLogin = async (formData: LoginFormData) => {
    try {
      setIsProcessing(true);
      setCurrentStatus({
        status: 'pending',
        message: 'Đang khởi tạo quá trình đăng nhập...'
      });

      const result = await service.startAutoLogin(formData);
      setCurrentSession(result.sessionId || null);
      setCurrentStatus(result);

      // Start polling for status updates
      const pollInterval = setInterval(async () => {
        if (!currentSession) {
          clearInterval(pollInterval);
          return;
        }

        try {
          const status = await service.checkLoginStatus(currentSession);
          setCurrentStatus(status);

          if (status.status !== 'pending') {
            clearInterval(pollInterval);
            setIsProcessing(false);
            setCurrentSession(null);

            // Save the result
            await service.saveLoginResult({
              email: formData.email,
              password: formData.password,
              otp: formData.otp,
              status: status.status,
              cookies: status.cookies,
              ip: status.ip || 'Unknown',
              chromePath: formData.chromePath,
              linkName: formData.linkName,
              resultMessage: status.message,
              errorType: status.errorType
            });

            refreshHistory();
            refreshStatistics();
          }
        } catch (error) {
          console.error('Status check error:', error);
          setCurrentStatus({
            status: 'error',
            message: 'Lỗi khi kiểm tra trạng thái'
          });
          clearInterval(pollInterval);
          setIsProcessing(false);
          setCurrentSession(null);
        }
      }, 3000); // Poll every 3 seconds
    } catch (error) {
      console.error('Failed to start auto login:', error);
      setIsProcessing(false);
      setCurrentSession(null);
      setCurrentStatus({
        status: 'error',
        message: 'Không thể bắt đầu quá trình đăng nhập'
      });
    }
  };

  const stopAutoLogin = () => {
    setIsProcessing(false);
    setCurrentSession(null);
    setCurrentStatus(null);
  };

  const updateStatus = (status: LoginResult) => {
    setCurrentStatus(status);
  };

  const refreshHistory = async () => {
    try {
      const history = await service.getLoginHistory();
      setLoginHistory(history);
    } catch (error) {
      console.error('Failed to refresh history:', error);
    }
  };

  const refreshStatistics = async () => {
    try {
      const stats = await service.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to refresh statistics:', error);
    }
  };

  useEffect(() => {
    refreshHistory();
    refreshStatistics();
  }, []);

  const value = {
    isProcessing,
    currentSession,
    loginHistory,
    statistics,
    currentStatus,
    startAutoLogin,
    stopAutoLogin,
    refreshHistory,
    refreshStatistics,
    updateStatus,
  };

  return (
    <AutoLoginContext.Provider value={value}>
      {children}
    </AutoLoginContext.Provider>
  );
};

export const useAutoLogin = () => {
  const context = useContext(AutoLoginContext);
  if (context === undefined) {
    throw new Error('useAutoLogin must be used within an AutoLoginProvider');
  }
  return context;
};