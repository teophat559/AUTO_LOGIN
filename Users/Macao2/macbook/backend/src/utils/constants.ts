// Time constants
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000
};

// HTTP status codes
export const HTTP = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};

// HTTP methods
export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD'
};

// HTTP headers
export const HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
  USER_AGENT: 'User-Agent',
  X_REQUESTED_WITH: 'X-Requested-With',
  X_FORWARDED_FOR: 'X-Forwarded-For',
  X_FORWARDED_PROTO: 'X-Forwarded-Proto',
  X_FORWARDED_HOST: 'X-Forwarded-Host',
  X_FORWARDED_PORT: 'X-Forwarded-Port',
  X_FORWARDED_PREFIX: 'X-Forwarded-Prefix',
  X_FORWARDED_PATH: 'X-Forwarded-Path',
  X_FORWARDED_METHOD: 'X-Forwarded-Method',
  X_FORWARDED_IP: 'X-Forwarded-IP',
  X_FORWARDED_PROTOCOL: 'X-Forwarded-Protocol',
  X_FORWARDED_SSL: 'X-Forwarded-Ssl',
  X_FORWARDED_URI: 'X-Forwarded-Uri'
};

// Content types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM: 'application/x-www-form-urlencoded',
  MULTIPART: 'multipart/form-data',
  TEXT: 'text/plain',
  HTML: 'text/html',
  XML: 'application/xml',
  YAML: 'application/yaml',
  CSV: 'text/csv',
  PDF: 'application/pdf',
  ZIP: 'application/zip',
  OCTET_STREAM: 'application/octet-stream'
};

// Error messages
export const ERRORS = {
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not found',
  METHOD_NOT_ALLOWED: 'Method not allowed',
  CONFLICT: 'Conflict',
  UNPROCESSABLE_ENTITY: 'Unprocessable entity',
  TOO_MANY_REQUESTS: 'Too many requests',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  BAD_GATEWAY: 'Bad gateway',
  SERVICE_UNAVAILABLE: 'Service unavailable',
  GATEWAY_TIMEOUT: 'Gateway timeout'
};

// Validation messages
export const VALIDATION = {
  REQUIRED: 'Field is required',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_PASSWORD: 'Invalid password',
  INVALID_URL: 'Invalid URL',
  INVALID_DATE: 'Invalid date',
  INVALID_NUMBER: 'Invalid number',
  INVALID_BOOLEAN: 'Invalid boolean',
  INVALID_ARRAY: 'Invalid array',
  INVALID_OBJECT: 'Invalid object',
  INVALID_STRING: 'Invalid string',
  INVALID_ENUM: 'Invalid enum value',
  INVALID_MIN: 'Value is too small',
  INVALID_MAX: 'Value is too large',
  INVALID_MIN_LENGTH: 'String is too short',
  INVALID_MAX_LENGTH: 'String is too long',
  INVALID_PATTERN: 'Invalid pattern',
  INVALID_FORMAT: 'Invalid format'
};

// Cache keys
export const CACHE_KEYS = {
  PROXY: 'proxy',
  PROXY_STATS: 'proxy:stats',
  CHROME: 'chrome',
  CHROME_STATS: 'chrome:stats',
  CAPTCHA: 'captcha',
  CAPTCHA_STATS: 'captcha:stats',
  LOGIN: 'login',
  LOGIN_STATS: 'login:stats',
  NOTIFICATION: 'notification',
  NOTIFICATION_STATS: 'notification:stats'
};

// Queue names
export const QUEUE_NAMES = {
  PROXY: 'proxy',
  CHROME: 'chrome',
  CAPTCHA: 'captcha',
  LOGIN: 'login',
  NOTIFICATION: 'notification'
};

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

// Log levels
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  HTTP: 'http',
  DEBUG: 'debug'
};

// Log colors
export const LOG_COLORS = {
  ERROR: 'red',
  WARN: 'yellow',
  INFO: 'green',
  HTTP: 'magenta',
  DEBUG: 'blue'
};

// Environment variables
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost',
  API_URL: process.env.API_URL || 'http://localhost:3000',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:8080',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || '15m',
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || '100',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FORMAT: process.env.LOG_FORMAT || 'combined',
  LOG_DIR: process.env.LOG_DIR || 'logs'
};

// Database constants
export const DATABASE = {
  POOL_MIN: 2,
  POOL_MAX: 10,
  IDLE_TIMEOUT: 30000,
  CONNECTION_TIMEOUT: 2000,
  MAX_RETRIES: 3,
  RETRY_INTERVAL: 1000
};

// Redis constants
export const REDIS = {
  TTL: 3600,
  PREFIX: 'app:',
  MAX_RETRIES: 3,
  RETRY_INTERVAL: 1000
};

// JWT constants
export const JWT = {
  ALGORITHM: 'HS256',
  ISSUER: 'app',
  AUDIENCE: 'app',
  SUBJECT: 'app'
};

// CORS constants
export const CORS = {
  ORIGIN: ENV.CORS_ORIGIN,
  METHODS: [METHODS.GET, METHODS.POST, METHODS.PUT, METHODS.DELETE, METHODS.PATCH],
  ALLOWED_HEADERS: [HEADERS.CONTENT_TYPE, HEADERS.AUTHORIZATION],
  EXPOSED_HEADERS: [HEADERS.CONTENT_TYPE, HEADERS.AUTHORIZATION],
  CREDENTIALS: true,
  MAX_AGE: 86400
};

// Rate limit constants
export const RATE_LIMIT = {
  WINDOW: ENV.RATE_LIMIT_WINDOW,
  MAX: ENV.RATE_LIMIT_MAX,
  MESSAGE: 'Too many requests, please try again later'
};

// Log constants
export const LOG = {
  LEVEL: ENV.LOG_LEVEL,
  FORMAT: ENV.LOG_FORMAT,
  DIR: ENV.LOG_DIR,
  MAX_SIZE: '20m',
  MAX_FILES: '14d'
};

// Proxy constants
export const PROXY = {
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_INTERVAL: 1000,
  MAX_CONNECTIONS: 100,
  KEEP_ALIVE: true,
  KEEP_ALIVE_MSECS: 1000
};

// Chrome constants
export const CHROME = {
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_INTERVAL: 1000,
  MAX_CONNECTIONS: 100,
  KEEP_ALIVE: true,
  KEEP_ALIVE_MSECS: 1000
};

// Captcha constants
export const CAPTCHA = {
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_INTERVAL: 1000,
  MAX_CONNECTIONS: 100,
  KEEP_ALIVE: true,
  KEEP_ALIVE_MSECS: 1000
};

// Login constants
export const LOGIN = {
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_INTERVAL: 1000,
  MAX_CONNECTIONS: 100,
  KEEP_ALIVE: true,
  KEEP_ALIVE_MSECS: 1000
};

// Notification constants
export const NOTIFICATION = {
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_INTERVAL: 1000,
  MAX_CONNECTIONS: 100,
  KEEP_ALIVE: true,
  KEEP_ALIVE_MSECS: 1000
};

// WebSocket constants
export const WEBSOCKET = {
  PING_INTERVAL: 30 * TIME.SECOND,
  PONG_TIMEOUT: 10 * TIME.SECOND,
  RECONNECT_DELAY: 5 * TIME.SECOND
};

// Error messages
export const ERROR_MESSAGES = {
  CHROME: {
    LAUNCH_FAILED: 'Failed to launch Chrome',
    NAVIGATION_FAILED: 'Navigation failed',
    SELECTOR_NOT_FOUND: 'Selector not found',
    TIMEOUT: 'Operation timed out'
  },
  PROXY: {
    CONNECTION_FAILED: 'Failed to connect to proxy',
    AUTHENTICATION_FAILED: 'Proxy authentication failed',
    ROTATION_FAILED: 'Failed to rotate proxy'
  },
  CAPTCHA: {
    DETECTION_FAILED: 'Failed to detect captcha',
    SOLVING_FAILED: 'Failed to solve captcha',
    MAX_ATTEMPTS_REACHED: 'Maximum captcha attempts reached'
  },
  DATABASE: {
    CONNECTION_FAILED: 'Failed to connect to database',
    QUERY_FAILED: 'Query failed',
    TRANSACTION_FAILED: 'Transaction failed'
  },
  WEBSOCKET: {
    CONNECTION_FAILED: 'Failed to connect to WebSocket',
    MESSAGE_FAILED: 'Failed to send message',
    RECONNECTION_FAILED: 'Failed to reconnect'
  }
};

// Success messages
export const SUCCESS_MESSAGES = {
  CHROME: {
    LAUNCHED: 'Chrome launched successfully',
    NAVIGATED: 'Navigation successful',
    SELECTOR_FOUND: 'Selector found'
  },
  PROXY: {
    CONNECTED: 'Connected to proxy successfully',
    AUTHENTICATED: 'Proxy authenticated successfully',
    ROTATED: 'Proxy rotated successfully'
  },
  CAPTCHA: {
    DETECTED: 'Captcha detected successfully',
    SOLVED: 'Captcha solved successfully'
  },
  DATABASE: {
    CONNECTED: 'Connected to database successfully',
    QUERY_EXECUTED: 'Query executed successfully',
    TRANSACTION_COMMITTED: 'Transaction committed successfully'
  },
  WEBSOCKET: {
    CONNECTED: 'Connected to WebSocket successfully',
    MESSAGE_SENT: 'Message sent successfully',
    RECONNECTED: 'Reconnected successfully'
  }
};

// Status messages
export const STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  PROCESSING: 'processing',
  WAITING: 'waiting',
  COMPLETED: 'completed',
  ERROR: 'error'
};