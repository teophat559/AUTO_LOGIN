export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  data?: any;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  contestUpdates: boolean;
  systemUpdates: boolean;
  marketing: boolean;
}