export interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  details?: string;
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
  source: string;
  details?: string;
}

export interface LogFilter {
  startDate?: string;
  endDate?: string;
  userId?: string;
  action?: string;
  level?: 'info' | 'warning' | 'error';
}