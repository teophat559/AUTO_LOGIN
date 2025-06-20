// Common types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
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