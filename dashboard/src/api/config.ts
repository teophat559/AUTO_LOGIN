export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
  },
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      REFRESH_TOKEN: '/auth/refresh-token',
      LOGOUT: '/auth/logout',
    },
    CONTESTS: {
      ROOT: '/contests',
      DETAILS: '/contests/:id',
      SUBMIT: '/contests/:id/submit',
      PARTICIPANTS: '/contests/:id/participants',
      SUBMISSIONS: '/contests/:id/submissions',
    },
    ADMIN: {
      USERS: '/admin/users',
      CONTESTS: '/admin/contests',
      CONTESTANTS: '/admin/contestants',
      STATISTICS: '/admin/statistics',
      SETTINGS: '/admin/settings',
      LOGS: '/admin/logs',
      AUTO_LOGIN: '/admin/auto-login',
      AUTO_LOGIN_STATUS: '/admin/auto-login/status',
      AUTO_LOGIN_STOP: '/admin/auto-login/stop',
      AUTO_LOGIN_OTP: '/admin/auto-login/otp',
      AUTO_LOGIN_CAPTCHA: '/admin/auto-login/captcha',
      IP_MANAGEMENT: '/admin/ip-management',
      LINK_MANAGEMENT: '/admin/link-management',
    },
    USER: {
      PROFILE: '/user/profile',
      CONTESTS: '/user/contests',
      SUBMISSIONS: '/user/submissions',
      NOTIFICATIONS: '/user/notifications',
      SETTINGS: '/user/settings',
    },
  },
};

// For backward compatibility and to support both usages:
// - API_ENDPOINTS.CONTESTS.ROOT (user endpoints)
// - API_ENDPOINTS.ADMIN.CONTESTS (admin endpoints)
// - API_ENDPOINTS.USER.CONTESTS (user-specific endpoints)
export const API_ENDPOINTS = {
  ...API_CONFIG.ENDPOINTS,
  // Flatten for direct access if needed
  CONTESTS: API_CONFIG.ENDPOINTS.CONTESTS,
  ADMIN: API_CONFIG.ENDPOINTS.ADMIN,
  USER: API_CONFIG.ENDPOINTS.USER,
  AUTH: API_CONFIG.ENDPOINTS.AUTH,
};
