import React, { useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, Table, Button, Input, Modal } from '../../components/common';
import { theme } from '../../styles/theme';

const UserManagementContainer = styled.div`
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

// Mock data
const users = [
  {
    id: 1,
    username: 'johndoe',
    email: 'john@example.com',
    role: 'User',
    status: 'Active',
    createdAt: '2024-03-01',
  },
  {
    id: 2,
    username: 'janesmith',
    email: 'jane@example.com',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-03-05',
  },
  {
    id: 3,
    username: 'mikejohnson',
    email: 'mike@example.com',
    role: 'User',
    status: 'Inactive',
    createdAt: '2024-03-10',
  },
];

const UserManagement: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: any) => {
    // Implement delete logic
    console.log('Delete user:', user);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = (values: any) => {
    // Implement save logic
    console.log('Save user:', values);
    handleModalClose();
  };

  const columns = [
    { key: 'username', title: t('admin.users.username'), dataIndex: 'username' },
    { key: 'email', title: t('admin.users.email'), dataIndex: 'email' },
    { key: 'role', title: t('admin.users.role'), dataIndex: 'role' },
    {
      key: 'status',
      title: t('admin.users.status'),
      dataIndex: 'status',
      render: (value: string) => (
        <span
          style={{
            color: value === 'Active' ? theme.colors.success : theme.colors.error,
          }}
        >
          {value}
        </span>
      ),
    },
    { key: 'createdAt', title: t('admin.users.created_at'), dataIndex: 'createdAt' },
    {
      key: 'actions',
      title: t('admin.users.actions'),
      dataIndex: 'actions',
      render: (value: any, row: any) => (
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          <ActionButton
            variant="text"
            onClick={() => handleEdit(row)}
            title={t('admin.users.edit')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </ActionButton>
          <ActionButton
            variant="text"
            color="error"
            onClick={() => handleDelete(row)}
            title={t('admin.users.delete')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </ActionButton>
        </div>
      ),
    },
  ];

  const filteredUsers = users.filter(
    user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <UserManagementContainer>
      <Header>
        <h1>{t('admin.users.title')}</h1>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
        >
          {t('admin.users.add')}
        </Button>
      </Header>

      <SearchBar>
        <Input
          placeholder={t('admin.users.search_placeholder')}
          value={searchTerm}
          onChange={e => handleSearch(e.target.value)}
        />
      </SearchBar>

      <Card>
        <Table
          dataSource={filteredUsers}
          columns={columns}
          emptyMessage={t('admin.users.no_users')}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={selectedUser ? t('admin.users.edit') : t('admin.users.add')}
      >
        <form onSubmit={handleSubmit}>
          <div>
            <label>{t('admin.users.username')}</label>
            <input name="username" required />
          </div>
          <div>
            <label>{t('admin.users.email')}</label>
            <input name="email" type="email" required />
          </div>
          <div>
            <label>{t('admin.users.role')}</label>
            <select name="role" required>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <label>{t('admin.users.status')}</label>
            <select name="status" required>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <button type="submit">{t('common.save')}</button>
            <button type="reset" onClick={handleModalClose}>{t('common.cancel')}</button>
          </div>
        </form>
      </Modal>
    </UserManagementContainer>
  );
};

export default UserManagement;