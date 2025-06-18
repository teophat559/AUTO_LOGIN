import React, { useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, Table, Button, Input, Modal } from '../../components/common';
import { theme } from '../../styles/theme';

const ContestantManagementContainer = styled.div`
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
      case 'Pending':
        return theme.colors.warning;
      case 'Approved':
        return theme.colors.success;
      case 'Rejected':
        return theme.colors.error;
      default:
        return theme.colors.grey[200];
    }
  }};
  color: ${theme.colors.white};
`;

const Thumbnail = styled.img`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.sm};
  object-fit: cover;
`;

// Mock data
const contestants = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    contest: 'Summer Photography Contest',
    submission: 'summer_beach.jpg',
    thumbnail: 'https://picsum.photos/200',
    status: 'Pending',
    votes: 0,
    submittedAt: '2024-03-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    contest: 'Spring Art Competition',
    submission: 'spring_flowers.jpg',
    thumbnail: 'https://picsum.photos/201',
    status: 'Approved',
    votes: 45,
    submittedAt: '2024-03-10',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    contest: 'Winter Writing Contest',
    submission: 'winter_tale.txt',
    thumbnail: 'https://picsum.photos/202',
    status: 'Rejected',
    votes: 0,
    submittedAt: '2024-03-05',
  },
];

const ContestantManagement: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContestant, setSelectedContestant] = useState<any>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleEdit = (contestant: any) => {
    setSelectedContestant(contestant);
    setIsModalOpen(true);
  };

  const handleDelete = (contestant: any) => {
    // Implement delete logic
    console.log('Delete contestant:', contestant);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedContestant(null);
  };

  const handleSubmit = (values: any) => {
    // Implement save logic
    console.log('Save contestant:', values);
    handleModalClose();
  };

  const columns = [
    {
      key: 'thumbnail',
      title: t('admin.contestants.thumbnail'),
      dataIndex: 'thumbnail',
      render: (value: string) => <Thumbnail src={value} alt="Thumbnail" />,
    },
    { key: 'name', title: t('admin.contestants.name'), dataIndex: 'name' },
    { key: 'email', title: t('admin.contestants.email'), dataIndex: 'email' },
    { key: 'contest', title: t('admin.contestants.contest'), dataIndex: 'contest' },
    { key: 'submission', title: t('admin.contestants.submission'), dataIndex: 'submission' },
    {
      key: 'status',
      title: t('admin.contestants.status'),
      dataIndex: 'status',
      render: (value: string) => <StatusBadge status={value}>{value}</StatusBadge>,
    },
    { key: 'votes', title: t('admin.contestants.votes'), dataIndex: 'votes' },
    { key: 'submittedAt', title: t('admin.contestants.submitted_at'), dataIndex: 'submittedAt' },
    {
      key: 'actions',
      title: t('admin.contestants.actions'),
      dataIndex: 'actions',
      render: (value: any, row: any) => (
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          <ActionButton
            variant="text"
            onClick={() => handleEdit(row)}
            title={t('admin.contestants.edit')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </ActionButton>
          <ActionButton
            variant="text"
            color="error"
            onClick={() => handleDelete(row)}
            title={t('admin.contestants.delete')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </ActionButton>
        </div>
      ),
    },
  ];

  const filteredContestants = contestants.filter(
    contestant =>
      contestant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contestant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contestant.contest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ContestantManagementContainer>
      <Header>
        <h1>{t('admin.contestants.title')}</h1>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
        >
          {t('admin.contestants.add')}
        </Button>
      </Header>

      <SearchBar>
        <Input
          placeholder={t('admin.contestants.search_placeholder')}
          value={searchTerm}
          onChange={e => handleSearch(e.target.value)}
        />
      </SearchBar>

      <Card>
        <Table
          dataSource={filteredContestants}
          columns={columns}
          emptyMessage={t('admin.contestants.no_contestants')}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={selectedContestant ? t('admin.contestants.edit') : t('admin.contestants.add')}
      >
        <form onSubmit={handleSubmit}>
          <div>
            <label>{t('admin.contestants.name')}</label>
            <input
              type="text"
              name="name"
              value={selectedContestant?.name || ''}
              onChange={(e) => setSelectedContestant({ ...selectedContestant, name: e.target.value })}
            />
          </div>
          <div>
            <label>{t('admin.contestants.email')}</label>
            <input
              type="email"
              name="email"
              value={selectedContestant?.email || ''}
              onChange={(e) => setSelectedContestant({ ...selectedContestant, email: e.target.value })}
            />
          </div>
          <div>
            <label>{t('admin.contestants.contest')}</label>
            <select
              name="contest"
              value={selectedContestant?.contest || ''}
              onChange={(e) => setSelectedContestant({ ...selectedContestant, contest: e.target.value })}
            >
              <option value="">Select a contest</option>
              <option value="Summer Photography Contest">Summer Photography Contest</option>
              <option value="Spring Art Competition">Spring Art Competition</option>
              <option value="Winter Writing Contest">Winter Writing Contest</option>
            </select>
          </div>
          <div>
            <label>{t('admin.contestants.submission')}</label>
            <input
              type="file"
              name="submission"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setSelectedContestant({ ...selectedContestant, submission: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          <div>
            <label>{t('admin.contestants.status')}</label>
            <select
              name="status"
              value={selectedContestant?.status || ''}
              onChange={(e) => setSelectedContestant({ ...selectedContestant, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <button type="submit">{t('common.save')}</button>
            <button type="reset" onClick={handleModalClose}>{t('common.cancel')}</button>
          </div>
        </form>
      </Modal>
    </ContestantManagementContainer>
  );
};

export default ContestantManagement;