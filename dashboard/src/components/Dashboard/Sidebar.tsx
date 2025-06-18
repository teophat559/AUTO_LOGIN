import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Login as LoginIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Link as LinkIcon,
  Public as PublicIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { useAutoLogin } from '../../contexts/AutoLoginContext';
import AutoLoginService from '../../services/autoLoginService';

const SidebarContainer = styled.div`
  width: 200px;
  height: 100%;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 20px;
  position: fixed;
  left: 0;
  top: 0;
  color: white;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
`;

const WelcomeText = styled.h2`
  color: #ffd700;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
`;

const StatsContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  font-size: 14px;
  align-items: center;
`;

const StatValue = styled.span<{ type: string }>`
  font-weight: bold;
  color: ${props => {
    switch (props.type) {
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      default: return '#fff';
    }
  }};
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px;
  margin: 5px 0;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    margin-right: 10px;
  }
`;

const OnlineCount = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  font-size: 12px;
  color: #4caf50;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StatusDot = styled.div<{ online: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.online ? '#4caf50' : '#f44336'};
  animation: ${props => props.online ? 'pulse 2s infinite' : 'none'};

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const SystemStatus = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
  font-size: 12px;
`;

const ProgressBar = styled.div<{ percentage: number }>`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin-top: 5px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.percentage}%;
    background: ${props => props.percentage > 80 ? '#f44336' : props.percentage > 60 ? '#ff9800' : '#4caf50'};
    transition: width 0.3s ease;
  }
`;

const Sidebar: React.FC = () => {
  const { statistics } = useAutoLogin();
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const status = await AutoLoginService.getInstance().getSystemStatus();
        setSystemStatus(status);
      } catch (error) {
        console.error('Failed to fetch system status:', error);
      }
    };

    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    // TODO: Implement navigation logic
  };

  const getStatValue = (key: string) => {
    return statistics[key] || 0;
  };

  const getTotalAttempts = () => {
    return getStatValue('total') ||
           getStatValue('success') +
           getStatValue('error') +
           getStatValue('pending');
  };

  const getSuccessRate = () => {
    const total = getTotalAttempts();
    const success = getStatValue('success');
    return total > 0 ? Math.round((success / total) * 100) : 0;
  };

  return (
    <SidebarContainer>
      <WelcomeText>BVOTE WEB</WelcomeText>

      {systemStatus && (
        <SystemStatus>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Chrome</span>
            <StatusDot online={systemStatus.chromeRunning} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>CPU</span>
            <span>{systemStatus.cpuUsage?.toFixed(1) || 0}%</span>
          </div>
          <ProgressBar percentage={systemStatus.cpuUsage || 0} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>RAM</span>
            <span>{systemStatus.memoryUsage?.toFixed(1) || 0}%</span>
          </div>
          <ProgressBar percentage={systemStatus.memoryUsage || 0} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Disk</span>
            <span>{systemStatus.diskUsage?.toFixed(1) || 0}%</span>
          </div>
          <ProgressBar percentage={systemStatus.diskUsage || 0} />
        </SystemStatus>
      )}

      <StatsContainer>
        <h3>Kết Quả 24h</h3>
        <StatItem>
          <span>Phê Duyệt</span>
          <StatValue type="warning">{getStatValue('checkpoint')}</StatValue>
        </StatItem>
        <StatItem>
          <span>Duyệt Code</span>
          <StatValue type="warning">{getStatValue('2fa')}</StatValue>
        </StatItem>
        <StatItem>
          <span>Lỗi Captcha</span>
          <StatValue type="warning">{getStatValue('captcha')}</StatValue>
        </StatItem>
        <StatItem>
          <span>Sai Mật Khẩu</span>
          <StatValue type="error">{getStatValue('wrong_password')}</StatValue>
        </StatItem>
        <StatItem>
          <span>Thành Công</span>
          <StatValue type="success">{getStatValue('success')}</StatValue>
        </StatItem>
        <StatItem>
          <span>Tỷ Lệ Thành Công</span>
          <StatValue type={getSuccessRate() > 70 ? 'success' : getSuccessRate() > 50 ? 'warning' : 'error'}>
            {getSuccessRate()}%
          </StatValue>
        </StatItem>
      </StatsContainer>

      <MenuList>
        <MenuItem
          active={activeMenu === 'dashboard'}
          onClick={() => handleMenuClick('dashboard')}
        >
          <DashboardIcon /> Dashboard
        </MenuItem>
        <MenuItem
          active={activeMenu === 'auto-login'}
          onClick={() => handleMenuClick('auto-login')}
        >
          <LoginIcon /> Login AUTO
        </MenuItem>
        <MenuItem
          active={activeMenu === 'manual-login'}
          onClick={() => handleMenuClick('manual-login')}
        >
          <LoginIcon /> Login OFF
        </MenuItem>
        <MenuItem
          active={activeMenu === 'history'}
          onClick={() => handleMenuClick('history')}
        >
          <HistoryIcon /> Lịch Sử
        </MenuItem>
        <MenuItem
          active={activeMenu === 'notifications'}
          onClick={() => handleMenuClick('notifications')}
        >
          <NotificationsIcon /> Thông Báo
        </MenuItem>
        <MenuItem
          active={activeMenu === 'proxy'}
          onClick={() => handleMenuClick('proxy')}
        >
          <PublicIcon /> Quản Lý IP
        </MenuItem>
        <MenuItem
          active={activeMenu === 'links'}
          onClick={() => handleMenuClick('links')}
        >
          <LinkIcon /> Quản Lý Link
        </MenuItem>
        <MenuItem
          active={activeMenu === 'security'}
          onClick={() => handleMenuClick('security')}
        >
          <SecurityIcon /> Bảo Mật
        </MenuItem>
        <MenuItem
          active={activeMenu === 'performance'}
          onClick={() => handleMenuClick('performance')}
        >
          <SpeedIcon /> Hiệu Suất
        </MenuItem>
        <MenuItem
          active={activeMenu === 'settings'}
          onClick={() => handleMenuClick('settings')}
        >
          <SettingsIcon /> Cài Đặt Web
        </MenuItem>
        <MenuItem
          active={activeMenu === 'logout'}
          onClick={() => handleMenuClick('logout')}
        >
          <LogoutIcon /> Đăng Xuất
        </MenuItem>
      </MenuList>

      <OnlineCount>
        <StatusDot online={systemStatus?.chromeRunning || false} />
        Online: {systemStatus?.activeSessions || 0}
      </OnlineCount>
    </SidebarContainer>
  );
};

export default Sidebar;