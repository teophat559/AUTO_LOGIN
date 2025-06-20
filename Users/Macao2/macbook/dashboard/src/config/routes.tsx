import React from 'react';
import { RouteObject } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import ContestManagement from '../pages/admin/ContestManagement';
import ContestantManagement from '../pages/admin/ContestantManagement';
import Statistics from '../pages/admin/Statistics';
import AccessLogs from '../pages/admin/AccessLogs';

// User Pages
import Home from '../pages/user/Home';
import ContestList from '../pages/user/ContestList';
import ContestDetail from '../pages/user/ContestDetail';
import ContestSubmission from '../pages/user/ContestSubmission';
import MySubmissions from '../pages/user/MySubmissions';
import Profile from '../pages/user/Profile';
import Settings from '../pages/user/Settings';
import Notifications from '../pages/user/Notifications';

// Error Pages
import NotFound from '../pages/error/NotFound';
import Unauthorized from '../pages/error/Unauthorized';
import ServerError from '../pages/error/ServerError';

import { ROUTES } from './routes';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'contests',
        element: <ContestList />
      },
      {
        path: 'contests/:id',
        element: <ContestDetail />
      },
      {
        path: 'contests/:id/submit',
        element: <ContestSubmission />
      },
      {
        path: 'my-submissions',
        element: <MySubmissions />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'notifications',
        element: <Notifications />
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />
      },
      {
        path: 'users',
        element: <UserManagement />
      },
      {
        path: 'contests',
        element: <ContestManagement />
      },
      {
        path: 'contestants',
        element: <ContestantManagement />
      },
      {
        path: 'statistics',
        element: <Statistics />
      },
      {
        path: 'access-logs',
        element: <AccessLogs />
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />
      },
      {
        path: 'reset-password',
        element: <ResetPassword />
      }
    ]
  },
  {
    path: ROUTES.ERROR.UNAUTHORIZED,
    element: <Unauthorized />
  },
  {
    path: ROUTES.ERROR.SERVER_ERROR,
    element: <ServerError />
  },
  {
    path: ROUTES.ERROR.NOT_FOUND,
    element: <NotFound />
  }
];

export default routes;