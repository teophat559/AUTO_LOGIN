import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const DashboardContainer = styled.div`
  display: flex;
  min-height: 850px;
  width: 1850px;
  background-color: #2c2c2c;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
`;

export const Sidebar = styled.div`
  width: 200px;
  background: linear-gradient(
    135deg,
    #1a4b6e 0%,
    #2a6b9e 50%,
    #1a4b6e 100%
  );
  background-size: 200% 200%;
  animation: ${gradientAnimation} 15s ease infinite;
  padding: 20px;
  position: fixed;
  height: 100%;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

export const SidebarHeader = styled.div`
  color: #ffd700;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  padding: 10px;
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
`;

export const StatsCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

export const StatsTitle = styled.h3`
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 15px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const StatsItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: #ffffff;
  padding: 5px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

export const StatsValue = styled.span`
  color: #4caf50;
  font-weight: bold;
  font-size: 18px;
  text-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
`;

export const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const MenuItem = styled.li`
  margin-bottom: 10px;
`;

export const MenuLink = styled.a`
  display: flex;
  align-items: center;
  color: #ffffff;
  text-decoration: none;
  padding: 12px;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-weight: bold;
  border: 1px solid transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
    border-color: #4caf50;
  }

  svg {
    margin-right: 10px;
    font-size: 18px;
  }
`;

export const MainContent = styled.div`
  flex: 1;
  margin-left: 200px;
  padding: 20px;
  background: #2c2c2c;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const PageTitle = styled.h1`
  color: #ffffff;
  font-size: 28px;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

export const SubTitle = styled.h2`
  color: #ffffff;
  font-size: 20px;
  margin: 0;
  margin-top: 20px;
  padding-left: 20px;
`;

export const QuickActions = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ActionButton = styled.button`
  background: #4caf50;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;

  &:hover {
    background: #45a049;
    transform: translateY(-2px);
  }

  svg {
    font-size: 18px;
  }
`;

export const SearchBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const SearchInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  padding: 10px;
  color: #ffffff;
  flex: 1;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
  }
`;

export const AccessLogTable = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 50px 150px 200px 150px 150px 150px 100px 100px 100px 100px;
  gap: 10px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin-bottom: 10px;
  font-weight: bold;
  color: #ffffff;
  text-transform: uppercase;
  font-size: 14px;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 50px 150px 200px 150px 150px 150px 100px 100px 100px 100px;
  gap: 10px;
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(5px);
  }
`;

export const StatusBadge = styled.span<{ status: string }>`
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  background: ${({ status }) => {
    switch (status) {
      case 'success':
        return '#4caf50';
      case 'pending':
        return '#ffc107';
      case 'error':
        return '#f44336';
      case 'captcha':
        return '#ff9800';
      case 'checkpoint':
        return '#2196f3';
      default:
        return '#9e9e9e';
    }
  }};
  color: #ffffff;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
`;

export const CopyButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 5px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    color: #4caf50;
    transform: scale(1.1);
  }

  svg {
    font-size: 16px;
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  padding: 10px;
`;

export const PageButton = styled.button<{ active?: boolean }>`
  background: ${({ active }) => (active ? '#4caf50' : 'rgba(255, 255, 255, 0.1)')};
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4caf50;
    transform: translateY(-2px);
  }
`;

export const OnlineCount = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(76, 175, 80, 0.2);
  padding: 5px 10px;
  border-radius: 15px;
  color: #4caf50;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;

  svg {
    font-size: 16px;
  }
`;