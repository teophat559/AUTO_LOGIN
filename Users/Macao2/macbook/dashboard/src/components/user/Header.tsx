import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { theme } from '../../styles/theme';
import { Button, Avatar, Badge } from '../common';
import { ROUTES } from '../../config/routes';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: ${props => props.theme.colors.background.paper};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const UserName = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const NotificationButton = styled(Button)`
  position: relative;
  padding: 0.5rem;
  min-width: auto;
`;

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const handleProfileClick = () => {
    navigate(ROUTES.USER.PROFILE);
  };

  const handleNotificationsClick = () => {
    navigate(ROUTES.USER.NOTIFICATIONS);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <Button
          variant="text"
          onClick={toggleTheme}
          icon={mode === 'light' ? 'moon' : 'sun'}
        />
      </LeftSection>

      <RightSection>
        <NotificationButton
          variant="text"
          onClick={handleNotificationsClick}
          icon="bell"
        >
          <Badge count={3} />
        </NotificationButton>

        <UserInfo onClick={handleProfileClick}>
          <Avatar
            src={user?.avatar}
            alt={user?.username || 'User'}
            size="small"
          />
          <UserName>{user?.username}</UserName>
        </UserInfo>

        <Button
          variant="text"
          onClick={handleLogout}
          icon="log-out"
        >
          Đăng xuất
        </Button>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;