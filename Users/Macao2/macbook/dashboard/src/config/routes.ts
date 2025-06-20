import { RouteConfig } from '../types/route';

export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Admin routes
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    CONTESTS: '/admin/contests',
    CONTESTANTS: '/admin/contestants',
    STATISTICS: '/admin/statistics',
    SETTINGS: '/admin/settings',
    LOGS: '/admin/logs',
  },

  // User routes
  USER: {
    ROOT: '/',
    HOME: '/',
    PROFILE: '/profile',
    NOTIFICATIONS: '/notifications',
    SETTINGS: '/settings',
    SUBMISSIONS: '/submissions',
    CONTESTS: '/contests',
    CONTEST_DETAIL: (id: string) => `/contests/${id}`,
    CONTEST_SUBMISSION: (id: string) => `/contests/${id}/submit`,
  },

  // Error routes
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '*',
};

export const ROUTE_CONFIG: RouteConfig[] = [
  // Auth routes
  {
    path: ROUTES.LOGIN,
    roles: ['guest'],
  },
  {
    path: ROUTES.REGISTER,
    roles: ['guest'],
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    roles: ['guest'],
  },
  {
    path: ROUTES.RESET_PASSWORD,
    roles: ['guest'],
  },

  // Admin routes
  {
    path: ROUTES.ADMIN.ROOT,
    roles: ['admin'],
  },
  {
    path: ROUTES.ADMIN.USERS,
    roles: ['admin'],
  },
  {
    path: ROUTES.ADMIN.CONTESTS,
    roles: ['admin'],
  },
  {
    path: ROUTES.ADMIN.CONTESTANTS,
    roles: ['admin'],
  },
  {
    path: ROUTES.ADMIN.STATISTICS,
    roles: ['admin'],
  },
  {
    path: ROUTES.ADMIN.SETTINGS,
    roles: ['admin'],
  },
  {
    path: ROUTES.ADMIN.LOGS,
    roles: ['admin'],
  },

  // User routes
  {
    path: ROUTES.USER.ROOT,
    roles: ['user', 'admin'],
  },
  {
    path: ROUTES.USER.PROFILE,
    roles: ['user', 'admin'],
  },
  {
    path: ROUTES.USER.NOTIFICATIONS,
    roles: ['user', 'admin'],
  },
  {
    path: ROUTES.USER.SETTINGS,
    roles: ['user', 'admin'],
  },
  {
    path: ROUTES.USER.SUBMISSIONS,
    roles: ['user', 'admin'],
  },
  {
    path: ROUTES.USER.CONTESTS,
    roles: ['user', 'admin'],
  },
  {
    path: ROUTES.USER.CONTEST_DETAIL(':id'),
    roles: ['user', 'admin'],
  },
  {
    path: ROUTES.USER.CONTEST_SUBMISSION(':id'),
    roles: ['user', 'admin'],
  },

  // Error routes
  {
    path: ROUTES.UNAUTHORIZED,
    roles: ['guest', 'user', 'admin'],
  },
  {
    path: ROUTES.NOT_FOUND,
    roles: ['guest', 'user', 'admin'],
  },
];