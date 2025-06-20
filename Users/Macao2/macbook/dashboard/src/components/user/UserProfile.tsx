import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../common/Card';
import { Button } from '../common';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Toast from '../common/Toast';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: var(--text-secondary);
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  margin: 0;
  font-size: 2rem;
  color: var(--text-primary);
`;

const ProfileEmail = styled.p`
  margin: 0.5rem 0;
  color: var(--text-secondary);
`;

const ProfileActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  margin: 0 0 1rem;
  color: var(--text-primary);
`;

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    // Implement profile update logic here
    setToastMessage('Profile updated successfully');
    setToastType('success');
    setIsToastVisible(true);
    setIsEditModalOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar>
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        <ProfileInfo>
          <ProfileName>{user?.name || 'User'}</ProfileName>
          <ProfileEmail>{user?.email || 'user@example.com'}</ProfileEmail>
          <ProfileActions>
            <Button onClick={handleEditProfile}>Edit Profile</Button>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </ProfileActions>
        </ProfileInfo>
      </ProfileHeader>

      <Section>
        <SectionTitle>Account Settings</SectionTitle>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>Dark Mode</h3>
              <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
                Toggle dark/light theme
              </p>
            </div>
            <Button
              variant={theme === 'dark' ? 'primary' : 'secondary'}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
        </Card>
      </Section>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Name"
            placeholder="Enter your name"
            defaultValue={user?.name}
            fullWidth
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            defaultValue={user?.email}
            fullWidth
          />
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            fullWidth
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            fullWidth
          />
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </ProfileContainer>
  );
};

export default UserProfile;