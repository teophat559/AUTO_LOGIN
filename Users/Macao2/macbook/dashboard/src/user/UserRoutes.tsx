import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLayout from './components/UserLayout';
import Dashboard from './components/Dashboard';
import Notification from './components/Notification';

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="notification" element={<Notification />} />
        {/* Thêm các route khác nếu cần */}
      </Route>
    </Routes>
  );
};

export default UserRoutes;
