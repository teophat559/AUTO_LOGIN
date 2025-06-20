import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const DashboardContainer = styled.div`
  width: 1800px;
  height: 800px;
  background-color: #2c2c2c;
  border-radius: 10px;
  display: flex;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
`;

const Dashboard: React.FC = () => {
  return (
    <DashboardContainer>
      <Sidebar />
      <MainContent />
    </DashboardContainer>
  );
};

export default Dashboard;