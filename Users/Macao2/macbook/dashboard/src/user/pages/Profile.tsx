import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Card, Input, Button, Avatar, Tabs } from '../../components/common';

const ProfileContainer = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h2`
  margin: 0 0 ${theme.spacing.xs};
  color: ${theme.colors.text.primary};
`;

const ProfileEmail = styled.p`
  margin: 0;
  color: ${theme.colors.text.secondary};
`;

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const handleSubmit = (values: any) => {
    // Implement profile update logic
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar
          size={100}
          src="/images/avatar.jpg"
          alt="User Avatar"
        />
        <ProfileInfo>
          <ProfileName>Nguyễn Văn A</ProfileName>
          <ProfileEmail>nguyenvana@gmail.com</ProfileEmail>
        </ProfileInfo>
      </ProfileHeader>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'personal',
            label: 'Thông tin cá nhân',
            children: (
              <Card>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label>Họ và tên</label>
                    <input />
                  </div>
                  <div>
                    <label>Email</label>
                    <input type="email" />
                  </div>
                  <div>
                    <label>Số điện thoại</label>
                    <input />
                  </div>
                  <div>
                    <label>Địa chỉ</label>
                    <input />
                  </div>
                  <button type="submit" variant="primary">
                    Cập nhật thông tin
                  </button>
                </form>
              </Card>
            ),
          },
          {
            key: 'security',
            label: 'Bảo mật',
            children: (
              <Card>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label>Mật khẩu hiện tại</label>
                    <input type="password" />
                  </div>
                  <div>
                    <label>Mật khẩu mới</label>
                    <input type="password" />
                  </div>
                  <div>
                    <label>Xác nhận mật khẩu mới</label>
                    <input type="password" />
                  </div>
                  <button type="submit" variant="primary">
                    Đổi mật khẩu
                  </button>
                </form>
              </Card>
            ),
          },
        ]}
      />
    </ProfileContainer>
  );
};

export default Profile;