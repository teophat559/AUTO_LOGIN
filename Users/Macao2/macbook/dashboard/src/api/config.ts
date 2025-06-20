export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      REFRESH_TOKEN: '/auth/refresh-token',
      LOGOUT: '/auth/logout',
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
