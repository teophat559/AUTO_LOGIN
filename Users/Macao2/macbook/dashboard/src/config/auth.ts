import { theme } from '../styles/theme';

export const AUTH_CONFIG = {
  // Default login credentials
  defaultCredentials: {
    email: 'admin@gmail.com',
    password: 'Admin@123',
  },

  // Token configuration
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds

  // API endpoints
  endpoints: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    profile: '/api/auth/profile',
  },

  // Theme colors for auth related components
  colors: {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    error: theme.colors.error,
    success: theme.colors.success,
    background: theme.colors.background.paper,
    text: theme.colors.text.primary,
  },
};