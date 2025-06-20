import React, { useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, Table, Input, Button } from '../../components/common';
import { Select, MenuItem } from '@mui/material';
import { theme } from '../../styles/theme';

const AccessLogsContainer = styled.div`
  padding: ${theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const SearchBar = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  background: ${props => {
    switch (props.status) {
      case 'Success':
        return theme.colors.success;
      case 'Failed':
        return theme.colors.error;
      case 'Warning':
        return theme.colors.warning;
      default:
        return theme.colors.grey[200];
    }
  }};
  color: ${theme.colors.white};
`;

// Mock data
const logs = [
  {
    id: 1,
    user: 'johndoe',
    action: 'Login',
    ip: '192.168.1.1',
    userAgent: 'Chrome/Windows',
    status: 'Success',
    timestamp: '2024-03-20 10:30:00',
  },
  {
    id: 2,
    user: 'janesmith',
    action: 'Create Contest',
    ip: '192.168.1.2',
    userAgent: 'Firefox/MacOS',
    status: 'Success',
    timestamp: '2024-03-20 10:15:00',
  },
  {
    id: 3,
    user: 'mikejohnson',
    action: 'Delete Contestant',
    ip: '192.168.1.3',
    userAgent: 'Safari/iOS',
    status: 'Failed',
    timestamp: '2024-03-20 09:45:00',
  },
  {
    id: 4,
    user: 'sarahwilson',
    action: 'Update Settings',
    ip: '192.168.1.4',
    userAgent: 'Edge/Windows',
    status: 'Warning',
    timestamp: '2024-03-20 09:30:00',
  },
];

const AccessLogs: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const handleExport = () => {
    // Implement export logic
    console.log('Export logs');
  };

  const columns = [
    { header: t('admin.logs.user'), accessor: 'user' },
    { header: t('admin.logs.action'), accessor: 'action' },
    { header: t('admin.logs.ip'), accessor: 'ip' },
    { header: t('admin.logs.user_agent'), accessor: 'userAgent' },
    {
      header: t('admin.logs.status'),
      accessor: 'status',
      render: (value: string) => <StatusBadge status={value}>{value}</StatusBadge>,
    },
    { header: t('admin.logs.timestamp'), accessor: 'timestamp' },
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.includes(searchTerm) ||
      log.userAgent.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || log.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <AccessLogsContainer>
      <Header>
        <h1>{t('admin.logs.title')}</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExport}
        >
          {t('admin.logs.export')}
        </Button>
      </Header>

      <SearchBar>
        <Input
          placeholder={t('admin.logs.search_placeholder')}
          value={searchTerm}
          onChange={e => handleSearch(e.target.value)}
          startAdornment={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ width: 20, height: 20 }}
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
        <Select
          value={selectedStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">{t('admin.logs.all_statuses')}</MenuItem>
          <MenuItem value="Success">{t('admin.logs.statuses.success')}</MenuItem>
          <MenuItem value="Failed">{t('admin.logs.statuses.failed')}</MenuItem>
          <MenuItem value="Warning">{t('admin.logs.statuses.warning')}</MenuItem>
        </Select>
      </SearchBar>

      <Card>
        <Table
          data={filteredLogs}
          columns={columns}
          emptyMessage={t('admin.logs.no_logs')}
        />
      </Card>
    </AccessLogsContainer>
  );
};

export default AccessLogs;