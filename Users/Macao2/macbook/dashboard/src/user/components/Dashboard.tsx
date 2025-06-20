import React, { useState } from 'react';
import styled from 'styled-components';
import {
  ContentCopy as CopyIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const DashboardContainer = styled.div`
  margin-left: 220px;
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f5f5;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 10px;
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h3`
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #1976D2;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #1976D2;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  background-color: #f8f9fa;
  padding: 12px;
  text-align: left;
  font-weight: bold;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  white-space: nowrap;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }

  &:hover {
    background-color: #f1f3f5;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  color: #2c3e50;
  white-space: nowrap;
`;

const StatusBadge = styled.div<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: ${props => props.status === 'success' ? '#2ecc71' : '#e74c3c'};
  color: white;
`;

const TimeDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  background-color: #2ecc71;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  justify-content: center;

  &:hover {
    background-color: #27ae60;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const PageButton = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  background-color: #1976D2;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1565C0;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const mockData = [
    {
      id: 1,
      link: 'https://example.com/1',
      status: 'success',
      timestamp: '2024-03-20 10:30:00'
    },
    {
      id: 2,
      link: 'https://example.com/2',
      status: 'error',
      timestamp: '2024-03-20 10:31:00'
    },
    {
      id: 3,
      link: 'https://example.com/3',
      status: 'success',
      timestamp: '2024-03-20 10:32:00'
    },
    {
      id: 4,
      link: 'https://example.com/4',
      status: 'success',
      timestamp: '2024-03-20 10:33:00'
    },
    {
      id: 5,
      link: 'https://example.com/5',
      status: 'error',
      timestamp: '2024-03-20 10:34:00'
    }
  ];

  const getStatusIcon = (status: string) => {
    return status === 'success' ? <CheckCircleIcon /> : <ErrorIcon />;
  };

  const getStatusText = (status: string) => {
    return status === 'success' ? 'Thành công' : 'Lỗi';
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <DashboardContainer>
      <StatsSection>
        <StatCard>
          <StatTitle>Tổng số lần truy cập</StatTitle>
          <StatValue>150</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Lần truy cập thành công</StatTitle>
          <StatValue>120</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Lần truy cập thất bại</StatTitle>
          <StatValue>30</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Tỷ lệ thành công</StatTitle>
          <StatValue>80%</StatValue>
        </StatCard>
      </StatsSection>

      <SearchBar
        type="text"
        placeholder="Tìm kiếm theo đường dẫn..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table>
        <thead>
          <tr>
            <TableHeader>Đường dẫn</TableHeader>
            <TableHeader>Trạng thái</TableHeader>
            <TableHeader>Thời gian</TableHeader>
            <TableHeader>Thao tác</TableHeader>
          </tr>
        </thead>
        <tbody>
          {mockData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.link}</TableCell>
              <TableCell>
                <StatusBadge status={item.status}>
                  {getStatusIcon(item.status)}
                  {getStatusText(item.status)}
                </StatusBadge>
              </TableCell>
              <TableCell>
                <TimeDisplay>
                  <AccessTimeIcon />
                  {item.timestamp}
                </TimeDisplay>
              </TableCell>
              <TableCell>
                <CopyButton onClick={() => handleCopy(item.link)}>
                  <CopyIcon />
                  Sao chép
                </CopyButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <PageButton
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trang trước
        </PageButton>
        <PageButton
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === 5}
        >
          Trang sau
        </PageButton>
      </Pagination>
    </DashboardContainer>
  );
};

export default Dashboard;