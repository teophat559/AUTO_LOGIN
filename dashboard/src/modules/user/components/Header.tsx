import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import styled from 'styled-components';
import Button from '../../../components/common/Button';
import Avatar from '../../../shared/components/Avatar/Avatar';
import Badge from '../../../shared/components/Badge/Badge';
import Dropdown from '../../../components/common/Dropdown';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 64px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    { key: 'profile', label: 'Profile', onClick: () => navigate('/profile') },
    { key: 'settings', label: 'Settings', onClick: () => navigate('/settings') },
    { key: 'logout', label: 'Logout', onClick: handleLogout },
  ];

  return (
    <HeaderContainer>
      <LeftSection>
        <h1>MacBook Contest</h1>
      </LeftSection>
      <RightSection>
        <Badge count={5}>
          <Button
            variant="default"
            onClick={() => navigate('/notifications')}
          >
            🔔
          </Button>
        </Badge>
        <Dropdown items={userMenuItems}>
          <UserButton>
            <Avatar src={user?.avatar} alt={user?.name} size="small" />
            <span>{user?.name}</span>
          </UserButton>
        </Dropdown>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;