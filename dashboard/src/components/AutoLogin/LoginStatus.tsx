import React from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Stop as StopIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAutoLogin } from '../../contexts/AutoLoginContext';

const statusColors = {
  success: '#4caf50',
  pending: '#ffc107',
  error: '#f44336',
  checkpoint: '#ff9800',
  '2fa': '#ff9800',
  captcha: '#ff9800',
  wrong_password: '#f44336',
  wrong_account: '#f44336',
  wrong_phone: '#f44336',
};

const statusMessages = {
  success: '✅ Thành Công',
  pending: '⏳ Đang Xử Lý',
  error: '❌ Lỗi',
  checkpoint: '🟡 Phê Duyệt',
  '2fa': '🟡 Nhận Code',
  captcha: '🟠 Captcha',
  wrong_password: '❌ Sai Mật Khẩu',
  wrong_account: '❌ Sai Tài Khoản',
  wrong_phone: '❌ Sai Số Phone',
};

const statusIcons = {
  success: <CheckCircleIcon />,
  pending: <InfoIcon />,
  error: <ErrorIcon />,
  checkpoint: <WarningIcon />,
  '2fa': <WarningIcon />,
  captcha: <WarningIcon />,
  wrong_password: <ErrorIcon />,
  wrong_account: <ErrorIcon />,
  wrong_phone: <ErrorIcon />,
};

const LoginStatus: React.FC = () => {
  const { isProcessing, currentSession, currentStatus, stopAutoLogin } = useAutoLogin();
  const [expanded, setExpanded] = React.useState(false);

  if (!isProcessing && !currentStatus) {
    return null;
  }

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || '#9e9e9e';
  };

  const getStatusMessage = (status: string) => {
    return statusMessages[status as keyof typeof statusMessages] || status;
  };

  const getStatusIcon = (status: string) => {
    return statusIcons[status as keyof typeof statusIcons] || <InfoIcon />;
  };

  const handleStop = () => {
    if (currentSession) {
      stopAutoLogin();
    }
  };

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderLeft: '4px solid',
        borderColor: currentStatus ? getStatusColor(currentStatus.status) : statusColors.pending,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={2}>
          {isProcessing && <CircularProgress size={20} />}
          {currentStatus && getStatusIcon(currentStatus.status)}
          <Typography variant="body1" color="white">
            {currentStatus ? getStatusMessage(currentStatus.status) : 'Đang xử lý...'}
          </Typography>
          {currentStatus && (
            <Chip
              label={currentStatus.status.toUpperCase()}
              size="small"
              sx={{
                backgroundColor: getStatusColor(currentStatus.status),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          {isProcessing && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<StopIcon />}
              onClick={handleStop}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Stop
            </Button>
          )}
          <IconButton onClick={handleExpand} size="small" sx={{ color: 'white' }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {currentStatus && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {currentStatus.message}
        </Typography>
      )}

      {isProcessing && (
        <LinearProgress
          sx={{ mt: 2 }}
          variant="indeterminate"
          color="primary"
        />
      )}

      <Collapse in={expanded}>
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {currentSession && (
            <Typography variant="caption" color="text.secondary" display="block">
              Session ID: {currentSession}
            </Typography>
          )}

          {currentStatus?.ip && (
            <Typography variant="caption" color="text.secondary" display="block">
              IP: {currentStatus.ip}
            </Typography>
          )}

          {currentStatus?.timestamp && (
            <Typography variant="caption" color="text.secondary" display="block">
              Thời gian: {new Date(currentStatus.timestamp).toLocaleString()}
            </Typography>
          )}

          {currentStatus?.errorType && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Loại lỗi: {currentStatus.errorType}
            </Alert>
          )}

          {currentStatus?.cookies && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Cookies: {currentStatus.cookies.substring(0, 100)}...
              </Typography>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default LoginStatus;