import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
  Switch,
  FormControlLabel,
  Typography,
  Divider,
  Box,
  Chip,
} from '@mui/material';
import { useAutoLogin } from '../../contexts/AutoLoginContext';

interface AutoLoginModalProps {
  open: boolean;
  onClose: () => void;
}

const AutoLoginModal: React.FC<AutoLoginModalProps> = ({ open, onClose }) => {
  const { startAutoLogin, isProcessing } = useAutoLogin();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
    chromePath: '',
    proxy: '',
    linkName: '',
    useProxy: false,
    autoSolveCaptcha: true,
    waitForOtp: false,
    retryCount: 3,
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartLogin = async () => {
    try {
      setError(null);

      if (!formData.email || !formData.password) {
        setError('Email và mật khẩu là bắt buộc');
        return;
      }

      await startAutoLogin(formData);
      onClose();
    } catch (err) {
      setError('Không thể bắt đầu quá trình đăng nhập tự động');
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      password: '',
      otp: '',
      chromePath: '',
      proxy: '',
      linkName: '',
      useProxy: false,
      autoSolveCaptcha: true,
      waitForOtp: false,
      retryCount: 3,
    });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" color="primary">
          Auto Login Facebook
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Cấu hình đăng nhập tự động với các tùy chọn nâng cao
        </Typography>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Thông Tin Đăng Nhập
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email/Tài khoản"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="example@email.com"
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tên Link (Tùy chọn)"
              value={formData.linkName}
              onChange={(e) => handleInputChange('linkName', e.target.value)}
              placeholder="Link Facebook cụ thể"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Code OTP (Nếu cần)"
              value={formData.otp}
              onChange={(e) => handleInputChange('otp', e.target.value)}
              placeholder="Nhập code OTP"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Cấu Hình Chrome
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Chọn Chrome Profile</InputLabel>
              <Select
                value={formData.chromePath}
                onChange={(e) => handleInputChange('chromePath', e.target.value)}
                label="Chọn Chrome Profile"
              >
                <MenuItem value="">Chrome Mặc Định</MenuItem>
                <MenuItem value="chrome1">Chrome Profile 1</MenuItem>
                <MenuItem value="chrome2">Chrome Profile 2</MenuItem>
                <MenuItem value="chrome3">Chrome Profile 3</MenuItem>
                <MenuItem value="chrome4">Chrome Profile 4</MenuItem>
                <MenuItem value="chrome5">Chrome Profile 5</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Số lần thử lại"
              type="number"
              value={formData.retryCount}
              onChange={(e) => handleInputChange('retryCount', parseInt(e.target.value))}
              inputProps={{ min: 1, max: 10 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Tùy Chọn Nâng Cao
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.useProxy}
                  onChange={(e) => handleInputChange('useProxy', e.target.checked)}
                />
              }
              label="Sử dụng Proxy"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.autoSolveCaptcha}
                  onChange={(e) => handleInputChange('autoSolveCaptcha', e.target.checked)}
                />
              }
              label="Tự động giải Captcha"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.waitForOtp}
                  onChange={(e) => handleInputChange('waitForOtp', e.target.checked)}
                />
              }
              label="Chờ nhập OTP thủ công"
            />
          </Grid>

          {formData.useProxy && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Proxy (IP:Port hoặc user:pass@ip:port)"
                value={formData.proxy}
                onChange={(e) => handleInputChange('proxy', e.target.value)}
                placeholder="127.0.0.1:8080 hoặc user:pass@127.0.0.1:8080"
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tính năng hỗ trợ:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="Auto Fill Form" size="small" color="primary" />
                <Chip label="Captcha Solver" size="small" color="primary" />
                <Chip label="Proxy Rotation" size="small" color="primary" />
                <Chip label="OTP Handling" size="small" color="primary" />
                <Chip label="Error Recovery" size="small" color="primary" />
                <Chip label="Session Management" size="small" color="primary" />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isProcessing}>
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartLogin}
          disabled={isProcessing}
          startIcon={isProcessing ? <CircularProgress size={20} /> : null}
        >
          {isProcessing ? 'Đang Xử Lý...' : 'Bắt Đầu Auto Login'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AutoLoginModal;