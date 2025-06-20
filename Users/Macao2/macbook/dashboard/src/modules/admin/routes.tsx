import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

// Layouts
import AdminLayout from '../../layouts/AdminLayout';

// Admin Pages
import AdminDashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ContestManagement from './pages/ContestManagement';
import ContestantManagement from './pages/ContestantManagement';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import AccessLogs from './pages/AccessLogs';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN.USERS} element={<UserManagement />} />
        <Route path={ROUTES.ADMIN.CONTESTS} element={<ContestManagement />} />
        <Route path={ROUTES.ADMIN.CONTESTANTS} element={<ContestantManagement />} />
        <Route path={ROUTES.ADMIN.STATISTICS} element={<Statistics />} />
        <Route path={ROUTES.ADMIN.SETTINGS} element={<Settings />} />
        <Route path={ROUTES.ADMIN.LOGS} element={<AccessLogs />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;