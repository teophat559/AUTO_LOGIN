import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Card, Input, Button, Switch, Select, Tabs } from '../../components/common';

const SettingsContainer = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 800px;
  margin: 0 auto;
`;

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  const handleSubmit = (values: any) => {
    // Implement settings update logic
  };

  return (
    <SettingsContainer>
      <h1>Cài đặt hệ thống</h1>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'general',
            label: 'Cài đặt chung',
            children: (
              <Card>
                <form onSubmit={handleSubmit}>
                  <div label="Tên website">
                    <Input />
                  </div>
                  <div label="Mô tả website">
                    <Input.TextArea rows={4} />
                  </div>
                  <div label="Email liên hệ">
                    <Input type="email" />
                  </div>
                  <div label="Số điện thoại liên hệ">
                    <Input />
                  </div>
                  <Button type="submit" variant="primary">
                    Lưu cài đặt
                  </Button>
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
                  <div label="Yêu cầu xác thực email">
                    <Switch />
                  </div>
                  <div label="Giới hạn đăng nhập sai">
                    <Input type="number" />
                  </div>
                  <div label="Thời gian khóa tài khoản (phút)">
                    <Input type="number" />
                  </div>
                  <div label="Yêu cầu mật khẩu mạnh">
                    <Switch />
                  </div>
                  <Button type="submit" variant="primary">
                    Lưu cài đặt
                  </Button>
                </form>
              </Card>
            ),
          },
          {
            key: 'voting',
            label: 'Cài đặt bình chọn',
            children: (
              <Card>
                <form onSubmit={handleSubmit}>
                  <div label="Giới hạn lượt bình chọn/người">
                    <Input type="number" />
                  </div>
                  <div label="Yêu cầu đăng nhập để bình chọn">
                    <Switch />
                  </div>
                  <div label="Thời gian giữa các lượt bình chọn (phút)">
                    <Input type="number" />
                  </div>
                  <div label="Hiển thị kết quả bình chọn">
                    <Switch />
                  </div>
                  <Button type="submit" variant="primary">
                    Lưu cài đặt
                  </Button>
                </form>
              </Card>
            ),
          },
          {
            key: 'notifications',
            label: 'Thông báo',
            children: (
              <Card>
                <form onSubmit={handleSubmit}>
                  <div label="Gửi email thông báo">
                    <Switch />
                  </div>
                  <div label="Thông báo khi có thí sinh mới">
                    <Switch />
                  </div>
                  <div label="Thông báo khi có bình chọn mới">
                    <Switch />
                  </div>
                  <div label="Thông báo khi cuộc thi kết thúc">
                    <Switch />
                  </div>
                  <Button type="submit" variant="primary">
                    Lưu cài đặt
                  </Button>
                </form>
              </Card>
            ),
          },
        ]}
      />
    </SettingsContainer>
  );
};

export default Settings;