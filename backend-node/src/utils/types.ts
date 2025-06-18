export interface LoginCredentials {
  email: string;
  password: string;
  otp?: string;
}

export interface Proxy {
  host: string;
  port: number;
  username?: string;
  password?: string;
  protocol?: 'http' | 'https' | 'socks4' | 'socks5';
}

export interface LoginHistory {
  id: string;
  email: string;
  status: 'success' | 'failed';
  error?: string;
  timestamp: Date;
  proxy?: Proxy;
  cookies?: string;
}

export interface LoginStats {
  total: number;
  success: number;
  failed: number;
  successRate: number;
  averageTime: number;
  lastLogin?: Date;
}

export interface ChromeProfile {
  id: string;
  name: string;
  path: string;
  isActive: boolean;
  lastUsed?: Date;
}

export interface Session {
  id: string;
  profileId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  error?: string;
  proxy?: Proxy;
}

export interface Notification {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: any;
  timestamp: Date;
}

export interface CaptchaSolution {
  id: string;
  image: string;
  solution: string;
  timestamp: Date;
  status: 'pending' | 'solved' | 'failed';
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

export interface ChromeConfig {
  executablePath: string;
  userDataDir: string;
  defaultViewport: {
    width: number;
    height: number;
  };
  args: string[];
}

export interface ProxyConfig {
  rotationInterval: number;
  maxFailures: number;
  minSuccessRate: number;
}

export interface CaptchaConfig {
  maxAttempts: number;
  retryDelay: number;
  solveTimeout: number;
}

export interface AppConfig {
  env: string;
  port: number;
  host: string;
  baseUrl: string;
  apiPrefix: string;
  cors: {
    origin: string[];
    methods: string[];
    credentials: boolean;
  };
  rateLimit: {
    window: number;
    max: number;
    message: string;
  };
  log: {
    level: string;
    format: string;
    dir: string;
    maxSize: number;
    maxFiles: number;
  };
  database: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    ssl: boolean;
    pool: {
      min: number;
      max: number;
      idleTimeoutMillis: number;
    };
  };
  redis: {
    host: string;
    port: number;
    password: string;
    db: number;
    keyPrefix: string;
    ttl: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  proxy: {
    enabled: boolean;
    host: string;
    port: number;
    username: string;
    password: string;
    timeout: number;
    maxRetries: number;
  };
  chrome: {
    headless: boolean;
    timeout: number;
    maxRetries: number;
    keepAlive: boolean;
  };
  captcha: {
    enabled: boolean;
    service: string;
    apiKey: string;
    timeout: number;
    maxRetries: number;
  };
  notification: {
    enabled: boolean;
    service: string;
    apiKey: string;
    timeout: number;
    maxRetries: number;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned'
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestContext {
  id: string;
  userId?: string;
  sessionId?: string;
  ip: string;
  userAgent: string;
  method: string;
  url: string;
  params: Record<string, any>;
  query: Record<string, any>;
  body: Record<string, any>;
  headers: Record<string, any>;
  cookies: Record<string, any>;
  metadata: Record<string, any>;
  startTime: Date;
}

export interface ResponseData<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: Record<string, any>;
}

export interface AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  code?: string;
  details?: any;
}

export interface ValidationSchema {
  type: string;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  enum?: any[];
  custom?: (value: any) => boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}

export interface CacheOptions {
  ttl?: number;
  prefix?: string;
  serialize?: boolean;
}

export interface CacheItem<T = any> {
  key: string;
  value: T;
  ttl: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface QueueOptions {
  name: string;
  redis: {
    host: string;
    port: number;
    password: string;
    db: number;
  };
  limiter?: {
    max: number;
    duration: number;
  };
  defaultJobOptions?: {
    attempts: number;
    backoff: {
      type: string;
      delay: number;
    };
    removeOnComplete: boolean;
    removeOnFail: boolean;
  };
}

export interface JobData {
  id: string;
  type: string;
  data: any;
  priority: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface JobResult {
  id: string;
  status: string;
  result?: any;
  error?: any;
  timestamp: number;
  duration: number;
}

export interface WebSocketOptions {
  port: number;
  path: string;
  server?: any;
  pingInterval: number;
  pingTimeout: number;
  maxPayload: number;
  clientTracking: boolean;
}

export interface WebSocketClient {
  id: string;
  ws: any;
  isAlive: boolean;
  subscriptions: string[];
  metadata: Record<string, any>;
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
  userId?: string;
  groupId?: string;
  metadata?: Record<string, any>;
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface ServiceOptions {
  enabled: boolean;
  timeout: number;
  maxRetries: number;
  keepAlive: boolean;
  metadata?: Record<string, any>;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: Record<string, any>;
  duration: number;
}

export * from './types';