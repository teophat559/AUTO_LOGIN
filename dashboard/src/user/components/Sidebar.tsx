import React, { useState } from 'react';
import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { theme } from '../../shared/styles/theme';
import AuthModal from './AuthModal';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const SidebarContainer = styled.nav<{ open: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 220px;
  background: #e0f7fa;
  color: #01579b;
  border-radius: 0 24px 24px 0;
  box-shadow: 2px 0 16px 0 #b2ebf2;
  padding: 32px 0 24px 0;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transition: transform 0.3s cubic-bezier(.4,0,.2,1);
  @media (max-width: 900px) {
    width: 80vw;
    max-width: 320px;
    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
  }
`;

const Hamburger = styled.button`
  position: fixed;
  top: 24px;
  left: 16px;
  background: #e0f7fa;
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 8px #b2ebf2;
  width: 48px;
  height: 48px;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  cursor: pointer;
  @media (max-width: 900px) {
    display: flex;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: transparent;
  border: none;
  color: #01579b;
  font-size: 2rem;
  cursor: pointer;
  @media (min-width: 901px) {
    display: none;
  }
`;

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 0 0 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MenuItem = styled.li<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  color: ${({ active }) => (active ? '#0288d1' : '#01579b')};
  background: ${({ active }) => (active ? '#b2ebf2' : 'transparent')};
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  &:hover {
    background: #b2ebf2;
    color: #0288d1;
    box-shadow: 0 2px 8px #b2ebf2;
    svg {
      color: #0288d1;
      filter: drop-shadow(0 0 4px #b2ebf2);
    }
  }
  svg {
    color: inherit;
    font-size: 1.5rem;
    transition: color 0.2s, filter 0.2s;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #0288d1;
  text-align: center;
  margin-bottom: 32px;
  letter-spacing: 2px;
`;

const Overlay = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.25);
  z-index: 999;
  @media (min-width: 901px) {
    display: none;
  }
`;

const UserInfo = styled.div`
  padding: 0 24px 16px 24px;
  margin-bottom: 12px;
  border-bottom: 1px solid #b2ebf2;
  text-align: left;
`;
const UserName = styled.div`
  font-weight: bold;
  color: #0288d1;
  font-size: 1.1rem;
`;
const UserEmail = styled.div`
  color: #01579b;
  font-size: 0.98rem;
  opacity: 0.85;
`;
const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0 0 24px;
  padding: 10px 18px;
  border: none;
  border-radius: 12px;
  background: #b2ebf2;
  color: #0288d1;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px #b2ebf2;
  &:hover {
    background: #0288d1;
    color: #fff;
    box-shadow: 0 4px 16px #0288d155;
    svg {
      color: #fff;
    }
  }
`;

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const [active, setActive] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, user, login, logout } = useUser();
  const navigate = useNavigate();

  const handleMenuClick = (key: string) => {
    setActive(key);
    if ((key === 'contest' || key === 'contestant') && !isAuthenticated) {
      setShowAuthModal(true);
    } else {
      if (key === 'notification') {
        navigate('/notification');
      } else if (key === 'home') {
        navigate('/');
      }
      // ... các điều hướng khác nếu cần
    }
    if (onClose) {
      onClose();
    }
  };

  // Handler khi đăng nhập thành công từ AuthModal
  const handleAuthSuccess = (userInfo: any) => {
    login(userInfo);
    setShowAuthModal(false);
  };

  return (
    <>
      <Hamburger onClick={() => {
        if (onClose) {
          onClose();
        }
      }}>
        <MenuIcon fontSize="large" />
      </Hamburger>
      <Overlay open={isOpen} onClick={() => {
        if (onClose) {
          onClose();
        }
      }} />
      <SidebarContainer open={isOpen}>
        <Logo>USER PANEL</Logo>
        <CloseBtn onClick={() => {
          if (onClose) {
            onClose();
          }
        }}>
          <CloseIcon fontSize="large" />
        </CloseBtn>
        {isAuthenticated && user && (
          <UserInfo>
            <UserName>{user.name}</UserName>
            <UserEmail>{user.email}</UserEmail>
          </UserInfo>
        )}
        <MenuList>
          <MenuItem active={active === 'home'} onClick={() => handleMenuClick('home')}>
            <HomeIcon /> Trang chủ
          </MenuItem>
          <MenuItem active={active === 'contest'} onClick={() => handleMenuClick('contest')}>
            <EventIcon /> Cuộc thi
          </MenuItem>
          <MenuItem active={active === 'contestant'} onClick={() => handleMenuClick('contestant')}>
            <PeopleIcon /> Thí sinh
          </MenuItem>
          <MenuItem active={active === 'notification'} onClick={() => handleMenuClick('notification')}>
            <NotificationsIcon /> Thông báo
          </MenuItem>
        </MenuList>
        {isAuthenticated && (
          <LogoutBtn onClick={logout}>
            <LogoutIcon /> Đăng xuất
          </LogoutBtn>
        )}
      </SidebarContainer>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />}
    </>
  );
};

export default Sidebar;