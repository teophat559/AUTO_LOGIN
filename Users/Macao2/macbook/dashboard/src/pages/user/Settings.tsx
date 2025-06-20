import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, Button, Switch, Toast } from '../../components/common';
import { useTheme } from '../../contexts/ThemeContext';

const SettingsContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 1rem;
`;

const Error = styled.div`
  color: #dc3545;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
`;

const Success = styled.div`
  color: #198754;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
`;

const Settings: React.FC = () => {
  // Đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Cài đặt thông báo
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [contestUpdates, setContestUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Theme
  const { mode, toggleTheme } = useTheme();

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; visible: boolean }>({
    message: '', type: 'info', visible: false
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu mới không khớp.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    setLoading(true);
    // Giả lập API
    setTimeout(() => {
      setLoading(false);
      setPasswordSuccess('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setToast({ message: 'Đổi mật khẩu thành công!', type: 'success', visible: true });
    }, 1200);
  };

  const handleNotificationChange = (type: string) => {
    if (type === 'email') setEmailNotifications((v) => !v);
    if (type === 'contest') setContestUpdates((v) => !v);
    if (type === 'marketing') setMarketingEmails((v) => !v);
    setToast({ message: 'Cập nhật cài đặt thông báo!', type: 'success', visible: true });
  };

  const handleThemeChange = () => {
    toggleTheme();
    setToast({ message: `Đã chuyển sang chế độ ${mode === 'light' ? 'tối' : 'sáng'}.`, type: 'info', visible: true });
  };

  return (
    <SettingsContainer>
      <Section>
        <SectionTitle>Đổi mật khẩu</SectionTitle>
        <form onSubmit={handlePasswordChange}>
          {passwordError && <Error>{passwordError}</Error>}
          {passwordSuccess && <Success>{passwordSuccess}</Success>}
          <Input
            type="password"
            label="Mật khẩu hiện tại"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Input
            type="password"
            label="Mật khẩu mới"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Input
            type="password"
            label="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Button type="submit" loading={loading} style={{ marginTop: 12, width: '100%' }}>
            Đổi mật khẩu
          </Button>
        </form>
      </Section>

      <Section>
        <SectionTitle>Cài đặt thông báo</SectionTitle>
        <Row>
          <Label>Nhận email thông báo</Label>
          <Switch checked={emailNotifications} onChange={() => handleNotificationChange('email')} />
        </Row>
        <Row>
          <Label>Nhận cập nhật cuộc thi</Label>
          <Switch checked={contestUpdates} onChange={() => handleNotificationChange('contest')} />
        </Row>
        <Row>
          <Label>Nhận email marketing</Label>
          <Switch checked={marketingEmails} onChange={() => handleNotificationChange('marketing')} />
        </Row>
      </Section>

      <Section>
        <SectionTitle>Giao diện</SectionTitle>
        <Row>
          <Label>Chế độ tối</Label>
          <Switch checked={mode === 'dark'} onChange={handleThemeChange} />
        </Row>
      </Section>

      <Toast
        isVisible={toast.visible}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast(t => ({ ...t, visible: false }))}
        autoHideDuration={2000}
      />
    </SettingsContainer>
  );
};

export default Settings;
