import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EmojiEvents as EmojiEventsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const SidebarContainer = styled.aside`
  width: 250px;
  background: ${props => props.theme.colors.background.paper};
  border-right: 1px solid ${props => props.theme.colors.border};
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  padding: ${props => props.theme.spacing.lg};
`;

const Logo = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.secondary};
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.background.hover};
    color: ${props => props.theme.colors.text.primary};
  }

  &.active {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  return (
    <SidebarContainer>
      <Logo>{t('app.name')}</Logo>
      <Nav>
        <NavItem to="/dashboard">
          <DashboardIcon />
          {t('nav.dashboard')}
        </NavItem>
        {isAdmin ? (
          <>
            <NavItem to="/users">
              <PeopleIcon />
              {t('nav.users')}
            </NavItem>
            <NavItem to="/contests">
              <EmojiEventsIcon />
              {t('nav.contests')}
            </NavItem>
            <NavItem to="/settings">
              <SettingsIcon />
              {t('nav.settings')}
            </NavItem>
          </>
        ) : (
          <>
            <NavItem to="/profile">
              <PersonIcon />
              {t('nav.profile')}
            </NavItem>
            <NavItem to="/notifications">
              <NotificationsIcon />
              {t('nav.notifications')}
            </NavItem>
          </>
        )}
      </Nav>
    </SidebarContainer>
  );
};

export default Sidebar;