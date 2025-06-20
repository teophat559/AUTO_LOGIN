import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../config/routes';
import { ROLE_PERMISSIONS } from '../../config/permissions';
import type { ProtectedRouteProps } from '../../types/route';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles, requiredPermissions = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Kiểm tra xác thực
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Kiểm tra vai trò
  if (roles && !roles.includes(user?.role || 'guest')) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  // Kiểm tra quyền
  if (requiredPermissions.length > 0) {
    const userPermissions = ROLE_PERMISSIONS[user?.role || 'guest'] || [];
    const hasRequiredPermissions = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (!hasRequiredPermissions) {
      return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;