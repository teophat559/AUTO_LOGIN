import { Permission } from '../config/permissions';

export type UserRole = 'guest' | 'user' | 'admin';

export interface RouteConfig {
  path: string;
  roles: UserRole[];
  requiredPermissions?: Permission[];
  children?: RouteConfig[];
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  roles: UserRole[];
  requiredPermissions?: Permission[];
}