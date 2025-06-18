import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../modules/admin/components/Header';
import Sidebar from '../modules/admin/components/Sidebar';

const StyledLayout = styled.div`
  min-height: 100vh;
  display: flex;
`;

const StyledContent = styled.div`
  flex: 1;
  margin: 24px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
`;

const AdminLayout: React.FC = () => {
  return (
    <StyledLayout>
      <Sidebar />
      <div>
        <Header />
        <StyledContent>
          <Outlet />
        </StyledContent>
      </div>
    </StyledLayout>
  );
};

export default AdminLayout;