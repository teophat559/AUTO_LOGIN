import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Checkbox,
  Pagination,
  Tooltip,
  Menu,
  MenuItem,
  Button,
  Box,
  Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  ChromeReaderMode as ChromeIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAutoLogin } from '../../contexts/AutoLoginContext';
import AutoLoginModal from '../AutoLogin/AutoLoginModal';
import LoginStatus from '../AutoLogin/LoginStatus';
import NotificationCenter from '../AutoLogin/NotificationCenter';
import AutoLoginService from '../../services/autoLoginService';

const MainContainer = styled.div`
  margin-left: 200px;
  padding: 20px;
  width: calc(100% - 200px);
  height: 100%;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h1`
  color: white;
  font-size: 24px;
  margin: 0;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 5px 10px;
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  color: white;
  padding: 5px;
  width: 200px;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;

  &:hover {
    background: #357abd;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const TableContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  white-space: nowrap;
`;

const Td = styled.td`
  color: white;
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'success': return '#4caf50';
      case 'pending': return '#ffc107';
      case 'error': return '#f44336';
      case 'checkpoint': return '#ff9800';
      case '2fa': return '#ff9800';
      case 'captcha': return '#ff9800';
      case 'wrong_password': return '#f44336';
      case 'wrong_account': return '#f44336';
      case 'wrong_phone': return '#f44336';
      default: return '#9e9e9e';
    }
  }};
  color: white;
`;

const IconButtonStyled = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  transition: all 0.3s ease;
  border-radius: 3px;

  &:hover {
    color: #4a90e2;
    background: rgba(74, 144, 226, 0.1);
  }
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
`;

const BulkActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
`;

const MainContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  const { loginHistory, refreshHistory } = useAutoLogin();

  // Filter and search logic
  const filteredHistory = loginHistory.filter(item => {
    const matchesSearch =
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.linkName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ip?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // TODO: Show success notification
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDeleteChrome = async (id: string) => {
    try {
      await AutoLoginService.getInstance().deleteLoginRecord(id);
      refreshHistory();
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedItems) {
        await AutoLoginService.getInstance().deleteLoginRecord(id);
      }
      setSelectedItems([]);
      refreshHistory();
    } catch (error) {
      console.error('Failed to delete records:', error);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await AutoLoginService.getInstance().exportHistory(exportFormat);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `login-history.${exportFormat}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedHistory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedHistory.map(item => item.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleClearHistory = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử?')) {
      try {
        await AutoLoginService.getInstance().clearHistory();
        refreshHistory();
      } catch (error) {
        console.error('Failed to clear history:', error);
      }
    }
  };

  return (
    <MainContainer>
      <Header>
        <HeaderLeft>
          <Title>Bảng Điều Khiển LOGIN AUTO</Title>
        </HeaderLeft>
        <HeaderRight>
          <SearchContainer>
            <SearchIcon style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
            <SearchInput
              placeholder="Tìm kiếm email, link, IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <NotificationCenter />
        </HeaderRight>
      </Header>

      <LoginStatus />

      <QuickActions>
        <ActionButton onClick={() => setIsModalOpen(true)}>
          <ChromeIcon /> Mở Chrome Chỉ Định
        </ActionButton>
        <ActionButton onClick={() => setIsModalOpen(true)}>
          <ChromeIcon /> Auto Login
        </ActionButton>
        <ActionButton onClick={refreshHistory}>
          <RefreshIcon /> Làm Mới
        </ActionButton>
        <ActionButton onClick={() => setAnchorEl(document.activeElement as HTMLElement)}>
          <DownloadIcon /> Xuất Dữ Liệu
        </ActionButton>
        <ActionButton onClick={handleClearHistory} disabled={loginHistory.length === 0}>
          <ClearIcon /> Xóa Lịch Sử
        </ActionButton>
      </QuickActions>

      <FilterBar>
        <Typography variant="body2" color="white">
          Lọc theo trạng thái:
        </Typography>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '3px'
          }}
        >
          <option value="all">Tất cả</option>
          <option value="success">Thành công</option>
          <option value="error">Lỗi</option>
          <option value="checkpoint">Phê duyệt</option>
          <option value="2fa">2FA</option>
          <option value="captcha">Captcha</option>
          <option value="wrong_password">Sai mật khẩu</option>
          <option value="wrong_account">Sai tài khoản</option>
          <option value="wrong_phone">Sai số phone</option>
        </select>

        <Typography variant="body2" color="white" sx={{ ml: 2 }}>
          Tổng: {filteredHistory.length} bản ghi
        </Typography>
      </FilterBar>

      {selectedItems.length > 0 && (
        <BulkActions>
          <Typography variant="body2" color="white">
            Đã chọn {selectedItems.length} bản ghi
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleBulkDelete}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Delete Selected
          </Button>
        </BulkActions>
      )}

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>
                <Checkbox
                  checked={selectedItems.length === paginatedHistory.length && paginatedHistory.length > 0}
                  indeterminate={selectedItems.length > 0 && selectedItems.length < paginatedHistory.length}
                  onChange={handleSelectAll}
                  sx={{ color: 'white' }}
                />
              </Th>
              <Th>STT</Th>
              <Th>Thời Gian</Th>
              <Th>Tên Link</Th>
              <Th>Tài Khoản</Th>
              <Th>Mật Khẩu</Th>
              <Th>Code OTP</Th>
              <Th>IP Login</Th>
              <Th>Trạng Thái</Th>
              <Th>Kết Quả</Th>
              <Th>Chrome</Th>
              <Th>Thao Tác</Th>
            </tr>
          </thead>
          <tbody>
            {paginatedHistory.map((item, index) => (
              <tr key={item.id}>
                <Td>
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    sx={{ color: 'white' }}
                  />
                </Td>
                <Td>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                <Td>{new Date(item.timestamp).toLocaleString()}</Td>
                <Td>{item.linkName || '-'}</Td>
                <Td>{item.email}</Td>
                <Td>••••••••</Td>
                <Td>{item.otp || '-'}</Td>
                <Td>
                  <Tooltip title="Click để copy">
                    <span>
                      {item.ip}
                      <IconButtonStyled onClick={() => handleCopy(item.ip)}>
                        <CopyIcon />
                      </IconButtonStyled>
                    </span>
                  </Tooltip>
                </Td>
                <Td>
                  <StatusBadge status={item.status}>
                    {item.status}
                  </StatusBadge>
                </Td>
                <Td>
                  <StatusBadge status={item.result}>
                    {item.resultMessage || item.result}
                  </StatusBadge>
                </Td>
                <Td>{item.chromePath || 'Default'}</Td>
                <Td>
                  <Tooltip title="Copy cookies">
                    <IconButtonStyled onClick={() => handleCopy(item.cookies)}>
                      <CopyIcon />
                    </IconButtonStyled>
                  </Tooltip>
                  <Tooltip title="Xóa bản ghi">
                    <IconButtonStyled onClick={() => handleDeleteChrome(item.id)}>
                      <DeleteIcon />
                    </IconButtonStyled>
                  </Tooltip>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'white',
              },
            }}
          />
        </Box>
      )}

      <AutoLoginModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => { setExportFormat('csv'); handleExport(); setAnchorEl(null); }}>
          Xuất CSV
        </MenuItem>
        <MenuItem onClick={() => { setExportFormat('json'); handleExport(); setAnchorEl(null); }}>
          Xuất JSON
        </MenuItem>
      </Menu>
    </MainContainer>
  );
};

export default MainContent;