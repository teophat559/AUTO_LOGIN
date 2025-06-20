// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
export const API_TIMEOUT = 30000; // 30 seconds

// Authentication
export const ADMIN_KEY = 'ADMIN_2024_SECRET_KEY';
export const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
export const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

// Contest
export const CONTEST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ONGOING: 'ongoing',
  ENDED: 'ended',
  CANCELLED: 'cancelled',
} as const;

export const CONTEST_TYPE = {
  PHOTOGRAPHY: 'photography',
  DIGITAL_ART: 'digital_art',
  VIDEO: 'video',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  JUDGE: 'judge',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  CONTEST_UPDATE: 'contest_update',
  SUBMISSION_STATUS: 'submission_status',
  SYSTEM: 'system',
} as const;