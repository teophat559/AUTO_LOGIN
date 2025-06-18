import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import styled from 'styled-components';

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

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1890ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const Badge = styled.div`
  position: relative;

  &::after {
    content: '5';
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff4d4f;
    color: white;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  right: 0;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 4px;

  ${Dropdown}:hover & {
    display: block;
  }
`;

const DropdownItem = styled.div`
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <h1>Admin Dashboard</h1>
      </LeftSection>
      <RightSection>
        <Badge>
          <Button onClick={() => navigate('/admin/notifications')}>
            🔔
          </Button>
        </Badge>
        <Dropdown>
          <Button>
            <Avatar>{user?.name?.charAt(0) || 'U'}</Avatar>
            <span style={{ marginLeft: 8 }}>{user?.name}</span>
          </Button>
          <DropdownContent>
            <DropdownItem onClick={() => navigate('/admin/profile')}>
              👤 Profile
            </DropdownItem>
            <DropdownItem onClick={() => navigate('/admin/settings')}>
              ⚙️ Settings
            </DropdownItem>
            <DropdownItem onClick={handleLogout}>
              🚪 Logout
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;