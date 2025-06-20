import React from 'react';
import { Layout, Menu, Button, Avatar, Badge, Dropdown } from 'antd';
import { UserOutlined, BellOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import styled from 'styled-components';

const { Header: AntHeader } = Layout;

const HeaderContainer = styled(AntHeader)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/profile')}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => navigate('/settings')}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <HeaderContainer>
      <LeftSection>
        <h1>MacBook Contest</h1>
      </LeftSection>
      <RightSection>
        <Badge count={5}>
          <Button
            type="text"
            icon={<BellOutlined />}
            onClick={() => navigate('/notifications')}
          />
        </Badge>
        <Dropdown overlay={userMenu} trigger={['click']}>
          <Button type="text">
            <Avatar icon={<UserOutlined />} />
            <span style={{ marginLeft: 8 }}>{user?.name}</span>
          </Button>
        </Dropdown>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;