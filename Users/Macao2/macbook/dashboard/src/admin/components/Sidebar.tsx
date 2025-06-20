import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../shared/styles/theme';
import {
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  Computer as ComputerIcon,
  Link as LinkIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { presets, slideInLeft, fadeIn, pulse, glow } from '../../shared/styles/animations';
import NotificationsIcon from '@mui/icons-material/Notifications';

interface SidebarProps {
  username?: string;
  onLogout?: () => void;
}

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${theme.layout.sidebarWidth};
  background: ${theme.colors.background.sidebar};
  color: ${theme.colors.text.white};
  padding: ${theme.spacing.lg};
  transition: all ${theme.transitions.default};
  z-index: ${theme.zIndex.sidebar};
  box-shadow: ${theme.shadows.lg};
  animation: ${slideInLeft} ${theme.transitions.default};

  @media (max-width: ${theme.breakpoints.md}) {
    transform: translateX(${props => (props.isOpen ? '0' : '-100%')});
  }
`;

const MenuButton = styled.button`
  position: absolute;
  top: ${theme.spacing.md};
  right: -40px;
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0 ${theme.borderRadius.md} ${theme.borderRadius.md} 0;
  padding: ${theme.spacing.sm};
  cursor: pointer;
  display: none;
  transition: all ${theme.transitions.default};
  animation: ${fadeIn} ${theme.transitions.default};

  &:hover {
    background: ${theme.colors.info};
    transform: scale(1.1);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    display: block;
  }
`;

const WelcomeSection = styled.div`
  margin-bottom: ${theme.spacing.xl};
  animation: ${fadeIn} ${theme.transitions.default};
`;

const WelcomeText = styled.h2`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  margin: 0;
  background: linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.info});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${presets.glow};
`;

const Username = styled.span`
  display: block;
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.text.white};
  margin-top: ${theme.spacing.xs};
  opacity: 0.8;
`;

const StatsSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  animation: ${fadeIn} ${theme.transitions.default} 0.2s;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all ${theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const StatsTitle = styled.h3`
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.medium};
  margin: 0 0 ${theme.spacing.md};
  color: ${theme.colors.text.white};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  svg {
    animation: ${pulse} 2s infinite;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.md};
`;

const StatItem = styled.div`
  text-align: center;
  padding: ${theme.spacing.sm};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${theme.borderRadius.sm};
  transition: all ${theme.transitions.default};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xs};
  animation: ${presets.pulse};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.white};
  opacity: 0.8;
`;

const MenuSection = styled.div`
  animation: ${fadeIn} ${theme.transitions.default} 0.4s;
`;

const MenuTitle = styled.h3`
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.medium};
  margin: 0 0 ${theme.spacing.md};
  color: ${theme.colors.text.white};
  opacity: 0.8;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li<{ active?: boolean }>`
  margin-bottom: ${theme.spacing.sm};
  animation: ${fadeIn} ${theme.transitions.default};

  a {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    color: ${theme.colors.text.white};
    text-decoration: none;
    border-radius: ${theme.borderRadius.md};
    transition: all ${theme.transitions.default};
    background: ${props =>
      props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(5px);
    }

    svg {
      transition: all ${theme.transitions.default};
    }

    &:hover svg {
      transform: scale(1.2);
      color: ${theme.colors.primary};
    }
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.white};
  cursor: pointer;
  transition: all ${theme.transitions.default};
  margin-top: ${theme.spacing.xl};
  animation: ${fadeIn} ${theme.transitions.default} 0.6s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);

    svg {
      transform: rotate(180deg);
    }
  }

  svg {
    transition: all ${theme.transitions.default};
  }
`;

const OnlineCount = styled.div`
  text-align: center;
  padding: ${theme.spacing.sm};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const Sidebar: React.FC<SidebarProps> = ({ username, onLogout }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [stats, setStats] = useState({
    approvals: 0,
    codeReviews: 0,
    captchaErrors: 0,
    wrongPasswords: 0,
    successfulLogins: 0,
  });
  const [onlineCount, setOnlineCount] = useState(0);
  const [active, setActive] = useState('');

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        approvals: Math.floor(Math.random() * 100),
        codeReviews: Math.floor(Math.random() * 50),
        captchaErrors: Math.floor(Math.random() * 20),
        wrongPasswords: Math.floor(Math.random() * 30),
        successfulLogins: Math.floor(Math.random() * 200),
      }));
      setOnlineCount(Math.floor(Math.random() * 50));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleMenuClick = (key: string) => {
    setActive(key);
    if (key === 'notification') {
      // chuyển trang hoặc cập nhật giao diện để hiển thị Notification
    }
  };

  return (
    <>
      <MenuButton onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon />
      </MenuButton>
      <SidebarContainer isOpen={isOpen}>
        <WelcomeSection>
          <WelcomeText>{username || 'BVOTE WEB'}</WelcomeText>
          <Username>{username || 'BVOTE WEB'}</Username>
        </WelcomeSection>

        <StatsSection>
          <StatsTitle>Kết Quả 24h</StatsTitle>
          <StatsGrid>
            <StatItem>
              <StatLabel>Phê Duyệt</StatLabel>
              <StatValue>{stats.approvals}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Duyệt Code</StatLabel>
              <StatValue>{stats.codeReviews}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Lỗi Captcha</StatLabel>
              <StatValue>{stats.captchaErrors}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Sai Mật Khẩu</StatLabel>
              <StatValue>{stats.wrongPasswords}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Thành Công</StatLabel>
              <StatValue>{stats.successfulLogins}</StatValue>
            </StatItem>
          </StatsGrid>
        </StatsSection>

        <MenuSection>
          <MenuTitle>Menu</MenuTitle>
          <MenuList>
            <MenuItem>
              <a href="#login-auto">
                <ComputerIcon /> Login AUTO
              </a>
            </MenuItem>
            <MenuItem>
              <a href="#login-off">
                <ComputerIcon /> Login OFF
              </a>
            </MenuItem>
            <MenuItem active={active === 'notification'} onClick={() => handleMenuClick('notification')}>
              <NotificationsIcon /> Thông báo
            </MenuItem>
            <MenuItem>
              <a href="#ip-management">
                <SecurityIcon /> Quản Lý IP
              </a>
            </MenuItem>
            <MenuItem>
              <a href="#link-management">
                <LinkIcon /> Quản Lý Link
              </a>
            </MenuItem>
            <MenuItem>
              <a href="#settings">
                <SettingsIcon /> Cài Đặt Web
              </a>
            </MenuItem>
            <MenuItem>
              <a href="#" onClick={onLogout}>
                <LogoutIcon /> Đăng Xuất
              </a>
            </MenuItem>
          </MenuList>
        </MenuSection>

        <OnlineCount>
          Online: {onlineCount} người
        </OnlineCount>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;