export type Permission =
  | 'view_dashboard'
  | 'manage_users'
  | 'manage_contests'
  | 'manage_contestants'
  | 'view_statistics'
  | 'manage_settings'
  | 'view_logs'
  | 'view_profile'
  | 'edit_profile'
  | 'view_contests'
  | 'participate_contests'
  | 'view_submissions'
  | 'manage_submissions'
  | 'view_notifications'
  | 'manage_notifications';

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    'view_dashboard',
    'manage_users',
    'manage_contests',
    'manage_contestants',
    'view_statistics',
    'manage_settings',
    'view_logs',
    'view_profile',
    'edit_profile',
    'view_contests',
    'participate_contests',
    'view_submissions',
    'manage_submissions',
    'view_notifications',
    'manage_notifications',
  ],
  user: [
    'view_dashboard',
    'view_profile',
    'edit_profile',
    'view_contests',
    'participate_contests',
    'view_submissions',
    'view_notifications',
  ],
  guest: [],
};