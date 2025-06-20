import React, { useState } from 'react';
import styled from 'styled-components';
import { Table, Button, Input, Modal, Card } from '../../components/common';
import { useToast } from '../../hooks/useToast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
}

const UserManagementContainer = styled.div`
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

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-02',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { showToast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    showToast('User deleted successfully', 'success');
  };

  const handleStatusChange = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'active' ? 'inactive' : 'active',
        };
      }
      return user;
    }));
    showToast('User status updated successfully', 'success');
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { header: 'Status', accessor: 'status' },
    { header: 'Created At', accessor: 'createdAt' },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (user: User) => (
        <ActionButtons>
          <Button
            variant="secondary"
            size="small"
            onClick={() => handleEdit(user)}
          >
            Edit
          </Button>
          <Button
            variant={user.status === 'active' ? 'warning' : 'success'}
            size="small"
            onClick={() => handleStatusChange(user.id)}
          >
            {user.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={() => handleDelete(user.id)}
          >
            Delete
          </Button>
        </ActionButtons>
      ),
    },
  ];

  return (
    <UserManagementContainer>
      <Header>
        <Title>User Management</Title>
        <Button variant="primary">Add New User</Button>
      </Header>

      <SearchBar>
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </SearchBar>

      <Card>
        <Table
          columns={columns}
          data={filteredUsers}
          keyExtractor={(user) => user.id}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit User"
      >
        {selectedUser && (
          <div>
            {/* Add form fields for editing user */}
            <p>Edit user: {selectedUser.name}</p>
          </div>
        )}
      </Modal>
    </UserManagementContainer>
  );
};

export default UserManagement;