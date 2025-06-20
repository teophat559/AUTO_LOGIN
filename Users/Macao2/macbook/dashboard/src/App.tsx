import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AutoLoginProvider } from './contexts/AutoLoginContext';
import Dashboard from './components/Dashboard/Dashboard';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4a90e2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#2c2c2c',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AutoLoginProvider>
        <Dashboard />
      </AutoLoginProvider>
    </ThemeProvider>
  );
};

export default App;
