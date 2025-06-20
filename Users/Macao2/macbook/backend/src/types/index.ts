// Chrome types
export interface ChromeProfile {
  id: string;
  name: string;
  path: string;
}

// Login types
export interface LoginCredentials {
  email: string;
  password: string;
  otp?: string;
}

export interface LoginResult {
  id?: number;
  email: string;
  password: string;
  otp?: string;
  status: 'success' | 'pending' | 'failed';
  type?: '2fa' | 'checkpoint' | 'captcha';
  message?: string;
  cookies?: string;
  ip?: string;
  chromePath?: string;
  timestamp?: Date;
}

export interface LoginHistory {
  id?: number;
  email: string;
  status: 'success' | 'pending' | 'failed';
  type?: '2fa' | 'checkpoint' | 'captcha';
  message?: string;
  ip?: string;
  chromePath?: string;
  timestamp?: Date;
}

// Proxy types
export interface Proxy {
  host: string;
  port: number;
  username?: string;
  password?: string;
  lastUsed?: Date;
  successCount: number;
  failCount: number;
}

export interface ProxyStats {
  total: number;
  active: number;
  successRate: number;
}

// Notification types
export interface Notification {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  data?: any;
  timestamp: Date;
}

export interface LoginStatus {
  status: 'success' | 'pending' | 'failed';
  type?: '2fa' | 'checkpoint' | 'captcha';
  message?: string;
  timestamp: Date;
}

export interface ProxyStatus {
  host: string;
  port: number;
  success: boolean;
  message?: string;
  timestamp: Date;
}

export interface CaptchaStatus {
  detected: boolean;
  solved: boolean;
  message?: string;
  timestamp: Date;
}

// Database types
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

// Chrome service types
export interface ChromeLaunchOptions {
  executablePath: string;
  headless: boolean;
  args: string[];
  userDataDir?: string;
}

// Form filler types
export interface FormFillOptions {
  email: string;
  password: string;
  otp?: string;
}

// Captcha service types
export interface CaptchaServiceConfig {
  apiKey: string;
  apiUrl: string;
}

// WebSocket types
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: Date;
}

// Error types
export interface AppError extends Error {
  code?: string;
  status?: number;
  details?: any;
}