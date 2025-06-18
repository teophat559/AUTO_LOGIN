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

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  color: ${theme.colors.text.primary};
  cursor: pointer;
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.default};

  &:hover {
    background: ${theme.colors.background.hover};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchBar = styled.div`
  position: relative;
  width: 300px;

  input {
    width: 100%;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    padding-left: ${theme.spacing.xl};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.full};
    background: ${theme.colors.background.default};
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSize.sm};
    transition: all ${theme.transitions.default};

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 2px ${theme.colors.primaryLight};
    }

    &::placeholder {
      color: ${theme.colors.text.secondary};
    }
  }

  svg {
    position: absolute;
    left: ${theme.spacing.md};
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: ${theme.colors.text.secondary};
    pointer-events: none;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
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

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const handleProfileClick = () => {
    navigate(ROUTES.ADMIN.USER_MANAGEMENT);
  };

  const handleNotificationsClick = () => {
    navigate(ROUTES.ADMIN.ACCESS_LOGS);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={onMenuClick}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </MenuButton>
        <Title>{t('admin.dashboard')}</Title>
      </LeftSection>

      <RightSection>
        <SearchBar>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder={t('search.placeholder')} />
        </SearchBar>

        <ActionButtons>
          <Button
            variant="text"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            }
          />
          <Button
            variant="text"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            onClick={toggleTheme}
          />
        </ActionButtons>

        <NotificationButton
          variant="text"
          onClick={handleNotificationsClick}
          icon="bell"
        >
          <Badge count={5} />
        </NotificationButton>

        <UserInfo onClick={handleProfileClick}>
          <Avatar
            src={user?.avatar}
            alt={user?.username || 'Admin'}
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