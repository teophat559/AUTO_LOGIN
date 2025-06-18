// Common types
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contestant {
  id: string;
  userId: string;
  contestId: string;
  name: string;
  avatar?: string;
  votes: number;
  rank?: number;
  status: 'pending' | 'approved' | 'rejected';
  joinedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ThemeState {
  mode: 'light' | 'dark';
  primaryColor: string;
}

export interface LanguageState {
  current: string;
  available: string[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Component Props types
export interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface WithChildren {
  children: React.ReactNode;
}

// Error types
export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export * from './contest';
export * from './contestant';