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
    { key: 'name', title: 'Name', dataIndex: 'name' },
    { key: 'email', title: 'Email', dataIndex: 'email' },
    { key: 'role', title: 'Role', dataIndex: 'role' },
    { key: 'status', title: 'Status', dataIndex: 'status' },
    { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt' },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'actions',
      render: (value: any, row: any) => (
        <div>
          <ActionButtons>
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleEdit(row)}
            >
              Edit
            </Button>
            <Button
              variant={row.status === 'active' ? 'warning' : 'primary'}
              size="small"
              onClick={() => handleStatusChange(row.id)}
            >
              {row.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
            <Button
              variant="error"
              size="small"
              onClick={() => handleDelete(row.id)}
            >
              Delete
            </Button>
          </ActionButtons>
        </div>
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
          dataSource={filteredUsers}
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