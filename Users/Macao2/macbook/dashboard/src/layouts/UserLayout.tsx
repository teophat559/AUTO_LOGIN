import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../modules/user/components/Header';
import Sidebar from '../modules/user/components/Sidebar';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledContent = styled(Content)`
  margin: 24px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
`;

const UserLayout: React.FC = () => {
  return (
    <StyledLayout>
      <Sidebar />
      <Layout>
        <Header />
        <StyledContent>
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};

export default UserLayout;