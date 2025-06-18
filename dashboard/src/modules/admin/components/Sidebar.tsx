import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const StyledSider = styled.div`
  width: 250px;
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
`;

const Logo = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid #f0f0f0;
`;

const Menu = styled.div`
  padding: 16px 0;
`;

const MenuItem = styled.div<{ active?: boolean }>`
  padding: 12px 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${props => props.active ? '#f0f0f0' : 'transparent'};
  color: ${props => props.active ? '#1890ff' : '#333'};

  &:hover {
    background: #f5f5f5;
  }
`;

const Icon = styled.span`
  font-size: 16px;
`;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/admin',
      icon: '📊',
      label: 'Dashboard',
    },
    {
      key: '/admin/users',
      icon: '👥',
      label: 'User Management',
    },
    {
      key: '/admin/contests',
      icon: '🏆',
      label: 'Contest Management',
    },
    {
      key: '/admin/contestants',
      icon: '👨‍👩‍👧‍👦',
      label: 'Contestant Management',
    },
    {
      key: '/admin/statistics',
      icon: '📈',
      label: 'Statistics',
    },
    {
      key: '/admin/logs',
      icon: '📄',
      label: 'Access Logs',
    },
    {
      key: '/admin/settings',
      icon: '⚙️',
      label: 'Settings',
    },
  ];

  return (
    <StyledSider>
      <Logo>MacBook Contest</Logo>
      <Menu>
        {menuItems.map(item => (
          <MenuItem
            key={item.key}
            active={location.pathname === item.key}
            onClick={() => navigate(item.key)}
          >
            <Icon>{item.icon}</Icon>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </StyledSider>
  );
};

export default Sidebar;