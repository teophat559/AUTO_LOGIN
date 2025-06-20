import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

// Layouts
import UserLayout from '../../layouts/UserLayout';

// User Pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import MySubmissions from './pages/MySubmissions';
import ContestList from './pages/ContestList';
import ContestDetail from './pages/ContestDetail';
import ContestSubmission from './pages/ContestSubmission';

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path={ROUTES.USER.PROFILE} element={<Profile />} />
        <Route path={ROUTES.USER.NOTIFICATIONS} element={<Notifications />} />
        <Route path={ROUTES.USER.SETTINGS} element={<Settings />} />
        <Route path={ROUTES.USER.SUBMISSIONS} element={<MySubmissions />} />
        <Route path={ROUTES.USER.CONTESTS} element={<ContestList />} />
        <Route path={ROUTES.USER.CONTEST_DETAIL} element={<ContestDetail />} />
        <Route path={ROUTES.USER.CONTEST_SUBMISSION} element={<ContestSubmission />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;