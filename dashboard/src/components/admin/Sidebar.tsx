import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { useLanguage } from '../../contexts/LanguageContext';

const SidebarContainer = styled.aside`
  width: 250px;
  height: 100vh;
  background: ${props => props.theme.colors.background.paper};
  border-right: 1px solid ${props => props.theme.colors.border};
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div`
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MenuItem = styled.div<{ active?: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text.primary};
  background: ${props => props.active ? props.theme.colors.primary + '10' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary + '20'};
  }

  i {
    font-size: 1.25rem;
  }
`;

const MenuLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const menuItems = [
    {
      path: ROUTES.ADMIN.DASHBOARD,
      icon: 'home',
      label: t('admin.dashboard')
    },
    {
      path: ROUTES.ADMIN.USER_MANAGEMENT,
      icon: 'users',
      label: t('admin.userManagement')
    },
    {
      path: ROUTES.ADMIN.CONTEST_MANAGEMENT,
      icon: 'award',
      label: t('admin.contestManagement')
    },
    {
      path: ROUTES.ADMIN.SUBMISSION_MANAGEMENT,
      icon: 'file-text',
      label: t('admin.submissionManagement')
    },
    {
      path: ROUTES.ADMIN.ACCESS_LOGS,
      icon: 'activity',
      label: t('admin.accessLogs')
    },
    {
      path: ROUTES.ADMIN.SYSTEM_SETTINGS,
      icon: 'settings',
      label: t('admin.systemSettings')
    }
  ];

  return (
    <SidebarContainer>
      <Logo>
        <i className="fas fa-camera" style={{ marginRight: '0.5rem' }} />
        MacBook Dashboard
      </Logo>

      <MenuList>
        {menuItems.map((item) => (
          <MenuItem
            key={item.path}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <i className={`fas fa-${item.icon}`} />
            <MenuLabel>{item.label}</MenuLabel>
          </MenuItem>
        ))}
      </MenuList>
    </SidebarContainer>
  );
};

export default Sidebar;