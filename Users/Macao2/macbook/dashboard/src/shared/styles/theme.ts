import { createTheme } from '@mui/material/styles';

export const theme = {
  colors: {
    primary: '#2196F3',
    secondary: '#4CAF50',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3',
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
      sidebar: '#E3F2FD',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      white: '#FFFFFF',
      highlight: '#FFA000',
    },
    border: '#E0E0E0',
    status: {
      approved: '#FFC107',
      success: '#4CAF50',
      error: '#F44336',
      captcha: '#FF9800',
      pending: '#2196F3',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
  },
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  transitions: {
    default: '0.3s ease',
    fast: '0.15s ease',
    slow: '0.5s ease',
  },
  zIndex: {
    modal: 1300,
    tooltip: 1200,
    drawer: 1100,
    appBar: 1000,
  },
  layout: {
    sidebarWidth: '200px',
    headerHeight: '64px',
    containerMaxWidth: '1850px',
    containerMinHeight: '850px',
  },
  statusColors: {
    approved: '#FFC107',
    success: '#4CAF50',
    error: '#F44336',
    captcha: '#FF9800',
    pending: '#2196F3',
  },
  statusIcons: {
    approved: '🟡',
    success: '✅',
    error: '❌',
    captcha: '🟠',
    pending: '⏳',
  },
};

export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: {
      default: '#121212',
      paper: '#1E1E1E',
      sidebar: '#1A237E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      white: '#FFFFFF',
      highlight: '#FFB74D',
    },
    border: '#424242',
  },
};