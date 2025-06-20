import { DefaultTheme } from 'styled-components';

const colors = {
  primary: '#2563eb',
  primaryLight: '#60a5fa',
  primaryDark: '#1d4ed8',
  secondary: '#64748b',
  secondaryLight: '#94a3b8',
  secondaryDark: '#475569',
  success: '#22c55e',
  successLight: '#86efac',
  successDark: '#16a34a',
  error: '#ef4444',
  errorLight: '#fca5a5',
  errorDark: '#dc2626',
  warning: '#f59e0b',
  warningLight: '#fcd34d',
  warningDark: '#d97706',
  info: '#3b82f6',
  infoLight: '#93c5fd',
  infoDark: '#2563eb',
  background: '#ffffff',
  backgroundLight: '#f8fafc',
  backgroundDark: '#f1f5f9',
  text: '#1e293b',
  textLight: '#64748b',
  textDark: '#0f172a',
  border: '#e2e8f0',
  disabled: '#f1f5f9',
  placeholder: '#94a3b8',
};

const shadows = {
  small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  large: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
};

const borderRadius = '0.5rem';

export const lightTheme: DefaultTheme = {
  colors,
  shadows,
  borderRadius,
};

export const darkTheme: DefaultTheme = {
  colors: {
    ...colors,
    background: '#0f172a',
    backgroundLight: '#1e293b',
    backgroundDark: '#334155',
    text: '#f8fafc',
    textLight: '#cbd5e1',
    textDark: '#f1f5f9',
    border: '#334155',
    disabled: '#1e293b',
    placeholder: '#64748b',
  },
  shadows,
  borderRadius,
};

export const theme = {
  colors: {
    primary: '#1976d2',
    primaryDark: '#1565c0',
    primaryDarker: '#0d47a1',
    secondary: '#9c27b0',
    secondaryDark: '#7b1fa2',
    secondaryDarker: '#4a148c',
    success: '#2e7d32',
    error: '#d32f2f',
    warning: '#ed6c02',
    info: '#0288d1',
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    border: 'rgba(0, 0, 0, 0.12)',
    disabled: 'rgba(0, 0, 0, 0.12)',
    white: '#ffffff',
    black: '#000000',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      xxl: '2rem',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.8,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  transitions: {
    default: '0.2s ease-in-out',
    fast: '0.1s ease-in-out',
    slow: '0.3s ease-in-out',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px',
  },
  zIndex: {
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
} as const;

export type Theme = typeof theme;