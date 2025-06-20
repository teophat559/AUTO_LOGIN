import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Input, Table } from '../../components/common';
import { useToast } from '../../hooks/useToast';

const AccessLogsContainer = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: #212529;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterLabel = styled.span`
  font-size: 0.875rem;
  color: #495057;
  font-weight: 500;
`;

const DateRange = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'success' | 'failed';
}

const AccessLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { showToast } = useToast();

  const [logs] = useState<AccessLog[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      action: 'Login',
      ipAddress: '192.168.1.1',
      userAgent: 'Chrome/Windows',
      timestamp: '2024-02-20T10:30:00Z',
      status: 'success',
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Jane Smith',
      action: 'Failed Login',
      ipAddress: '192.168.1.2',
      userAgent: 'Firefox/MacOS',
      timestamp: '2024-02-20T10:35:00Z',
      status: 'failed',
    },
    {
      id: '3',
      userId: 'user1',
      userName: 'John Doe',
      action: 'Password Reset',
      ipAddress: '192.168.1.1',
      userAgent: 'Chrome/Windows',
      timestamp: '2024-02-20T11:00:00Z',
      status: 'success',
    },
  ]);

  const handleExport = () => {
    // Here you would typically generate and download a CSV file
    showToast('Logs exported successfully', 'success');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setStatusFilter('all');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(date);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'all' || log.status === statusFilter;

    const logDate = new Date(log.timestamp);
    const matchesStartDate = !startDate || logDate >= new Date(startDate);
    const matchesEndDate = !endDate || logDate <= new Date(endDate);

    return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
  });

  const columns = [
    { header: 'User', accessor: 'userName' },
    { header: 'Action', accessor: 'action' },
    { header: 'IP Address', accessor: 'ipAddress' },
    { header: 'User Agent', accessor: 'userAgent' },
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      cell: (value: string) => formatDate(value),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value: string) => (
        <span
          style={{
            color: value === 'success' ? '#28a745' : '#dc3545',
            fontWeight: 500,
          }}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
  ];

  return (
    <AccessLogsContainer>
      <Header>
        <Title>Access Logs</Title>
        <Button variant="primary" onClick={handleExport}>
          Export Logs
        </Button>
      </Header>

      <SearchBar>
        <Input
          placeholder="Search by user, action, or IP address..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
      </SearchBar>

      <FilterGroup>
        <FilterLabel>Date Range:</FilterLabel>
        <DateRange>
          <Input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <span>to</span>
          <Input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </DateRange>

        <FilterLabel>Status:</FilterLabel>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ced4da',
          }}
        >
          <option value="all">All</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>

        <Button variant="secondary" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </FilterGroup>

      <Card>
        <Table
          columns={columns}
          data={filteredLogs}
          emptyMessage="No access logs found"
        />
      </Card>
    </AccessLogsContainer>
  );
};

export default AccessLogs;