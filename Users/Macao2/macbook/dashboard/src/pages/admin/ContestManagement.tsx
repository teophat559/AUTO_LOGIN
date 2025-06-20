import React, { useState } from 'react';
import styled from 'styled-components';
import { Table, Button, Input, Modal, Card } from '../../components/common';
import { useToast } from '../../hooks/useToast';
import { Contest } from '../../types/contest';

const ContestManagementContainer = styled.div`
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

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ status }) => {
    switch (status) {
      case 'active':
        return '#198754';
      case 'upcoming':
        return '#0d6efd';
      case 'ended':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  }};
  color: white;
`;

const ContestManagement: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([
    {
      id: '1',
      title: 'Photography Contest 2024',
      description: 'Annual photography competition',
      startDate: '2024-03-01',
      endDate: '2024-04-01',
      status: 'upcoming',
      type: 'photo',
      rules: ['Rule 1', 'Rule 2'],
      prizes: {
        first: '$1000',
        second: '$500',
        third: '$250',
      },
      maxParticipants: 100,
      currentParticipants: 45,
      imageUrl: '/images/contest1.jpg',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      isPublished: true,
    },
    {
      id: '2',
      title: 'Video Making Challenge',
      description: 'Create amazing short videos',
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      status: 'active',
      type: 'video',
      rules: ['Rule 1', 'Rule 2'],
      prizes: {
        first: '$2000',
        second: '$1000',
        third: '$500',
      },
      maxParticipants: 50,
      currentParticipants: 30,
      imageUrl: '/images/contest2.jpg',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      isPublished: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const { showToast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (contest: Contest) => {
    setSelectedContest(contest);
    setIsModalOpen(true);
  };

  const handleDelete = (contestId: string) => {
    setContests(contests.filter(contest => contest.id !== contestId));
    showToast('Contest deleted successfully', 'success');
  };

  const handleStatusChange = (contestId: string) => {
    setContests(contests.map(contest => {
      if (contest.id === contestId) {
        return {
          ...contest,
          isPublished: !contest.isPublished,
        };
      }
      return contest;
    }));
    showToast('Contest status updated successfully', 'success');
  };

  const filteredContests = contests.filter(contest =>
    contest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contest.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Type', accessor: 'type' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (contest: Contest) => (
        <StatusBadge status={contest.status}>
          {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
        </StatusBadge>
      ),
    },
    { header: 'Start Date', accessor: 'startDate' },
    { header: 'End Date', accessor: 'endDate' },
    {
      header: 'Participants',
      accessor: 'participants',
      cell: (contest: Contest) => `${contest.currentParticipants}/${contest.maxParticipants}`,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (contest: Contest) => (
        <ActionButtons>
          <Button
            variant="secondary"
            size="small"
            onClick={() => handleEdit(contest)}
          >
            Edit
          </Button>
          <Button
            variant={contest.isPublished ? 'warning' : 'success'}
            size="small"
            onClick={() => handleStatusChange(contest.id)}
          >
            {contest.isPublished ? 'Unpublish' : 'Publish'}
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={() => handleDelete(contest.id)}
          >
            Delete
          </Button>
        </ActionButtons>
      ),
    },
  ];

  return (
    <ContestManagementContainer>
      <Header>
        <Title>Contest Management</Title>
        <Button variant="primary">Create New Contest</Button>
      </Header>

      <SearchBar>
        <Input
          type="text"
          placeholder="Search contests..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </SearchBar>

      <Card>
        <Table
          columns={columns}
          data={filteredContests}
          keyExtractor={(contest) => contest.id}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Contest"
      >
        {selectedContest && (
          <div>
            {/* Add form fields for editing contest */}
            <p>Edit contest: {selectedContest.title}</p>
          </div>
        )}
      </Modal>
    </ContestManagementContainer>
  );
};

export default ContestManagement;