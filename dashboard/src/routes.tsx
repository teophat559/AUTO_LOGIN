import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ROUTES, ROUTE_CONFIG } from './config/routes';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Module Routes
import AdminRoutes from './modules/admin/routes';
import UserRoutes from './modules/user/routes';

// Error Pages
import NotFound from './pages/error/NotFound';
import Unauthorized from './pages/error/Unauthorized';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        element={
          <ProtectedRoute roles={['guest']}>
            <AuthLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path={ROUTES.ADMIN.ROOT}
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />

      {/* User Routes */}
      <Route
        path={ROUTES.USER.ROOT}
        element={
          <ProtectedRoute roles={['user', 'admin']}>
            <UserRoutes />
          </ProtectedRoute>
        }
      />

      {/* Error Routes */}
      <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;