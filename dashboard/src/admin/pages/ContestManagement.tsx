import React, { useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, Table, Button, Input, Modal } from '../../components/common';
import { theme } from '../../styles/theme';

const ContestManagementContainer = styled.div`
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

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  background: ${props => {
    switch (props.status) {
      case 'Draft':
        return theme.colors.grey[200];
      case 'Published':
        return theme.colors.success;
      case 'Ended':
        return theme.colors.error;
      default:
        return theme.colors.grey[200];
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Draft':
        return theme.colors.text.primary;
      case 'Published':
      case 'Ended':
        return theme.colors.white;
      default:
        return theme.colors.text.primary;
    }
  }};
`;

// Mock data
const contests = [
  {
    id: 1,
    title: 'Summer Photography Contest',
    description: 'Capture the beauty of summer',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    status: 'Draft',
    totalContestants: 0,
    totalVotes: 0,
  },
  {
    id: 2,
    title: 'Spring Art Competition',
    description: 'Express spring through art',
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    status: 'Published',
    totalContestants: 45,
    totalVotes: 1234,
  },
  {
    id: 3,
    title: 'Winter Writing Contest',
    description: 'Write about winter experiences',
    startDate: '2023-12-01',
    endDate: '2024-02-28',
    status: 'Ended',
    totalContestants: 78,
    totalVotes: 3456,
  },
];

const ContestManagement: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<any>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleEdit = (contest: any) => {
    setSelectedContest(contest);
    setIsModalOpen(true);
  };

  const handleDelete = (contest: any) => {
    // Implement delete logic
    console.log('Delete contest:', contest);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedContest(null);
  };

  const handleSubmit = (values: any) => {
    // Implement save logic
    console.log('Save contest:', values);
    handleModalClose();
  };

  const columns = [
    { key: 'title', title: t('admin.contests.title'), dataIndex: 'title' },
    { key: 'description', title: t('admin.contests.description'), dataIndex: 'description' },
    { key: 'startDate', title: t('admin.contests.start_date'), dataIndex: 'startDate' },
    { key: 'endDate', title: t('admin.contests.end_date'), dataIndex: 'endDate' },
    {
      key: 'status',
      title: t('admin.contests.status'),
      dataIndex: 'status',
      render: (value: string) => <StatusBadge status={value}>{value}</StatusBadge>,
    },
    { key: 'totalContestants', title: t('admin.contests.contestants'), dataIndex: 'totalContestants' },
    { key: 'totalVotes', title: t('admin.contests.votes'), dataIndex: 'totalVotes' },
    {
      key: 'actions',
      title: t('admin.contests.actions'),
      dataIndex: 'actions',
      render: (value: any, row: any) => (
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          <ActionButton
            variant="text"
            onClick={() => handleEdit(row)}
            title={t('admin.contests.edit')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </ActionButton>
          <ActionButton
            variant="text"
            color="error"
            onClick={() => handleDelete(row)}
            title={t('admin.contests.delete')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </ActionButton>
        </div>
      ),
    },
  ];

  const filteredContests = contests.filter(
    contest =>
      contest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contest.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ContestManagementContainer>
      <Header>
        <h1>{t('admin.contests.title')}</h1>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
        >
          {t('admin.contests.add')}
        </Button>
      </Header>

      <SearchBar>
        <Input
          placeholder={t('admin.contests.search_placeholder')}
          value={searchTerm}
          onChange={e => handleSearch(e.target.value)}
        />
      </SearchBar>

      <Card>
        <Table
          dataSource={filteredContests}
          columns={columns}
          emptyMessage={t('admin.contests.no_contests')}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={selectedContest ? t('admin.contests.edit') : t('admin.contests.add')}
      >
        <form onSubmit={handleSubmit}>
          <div>
            <label>{t('admin.contests.title')}</label>
            <input
              name="title"
              required
            />
          </div>
          <div>
            <label>{t('admin.contests.description')}</label>
            <textarea
              name="description"
              required
            />
          </div>
          <div>
            <label>{t('admin.contests.start_date')}</label>
            <input
              name="startDate"
              type="date"
              required
            />
          </div>
          <div>
            <label>{t('admin.contests.end_date')}</label>
            <input
              name="endDate"
              type="date"
              required
            />
          </div>
          <div>
            <label>{t('admin.contests.status')}</label>
            <select
              name="status"
              required
            >
              <option value="Draft">{t('admin.contests.statuses.draft')}</option>
              <option value="Published">{t('admin.contests.statuses.published')}</option>
              <option value="Ended">{t('admin.contests.statuses.ended')}</option>
            </select>
          </div>
          <div>
            <button type="button" onClick={handleModalClose}>
              {t('common.cancel')}
            </button>
            <button type="submit">
              {t('common.save')}
            </button>
          </div>
        </form>
      </Modal>
    </ContestManagementContainer>
  );
};

export default ContestManagement;