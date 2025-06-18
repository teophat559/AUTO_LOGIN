import React, { Suspense, useState } from 'react';
import styled from 'styled-components';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/user/Sidebar';
import Header from '../../components/user/Header';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-primary);
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.2rem;
  color: var(--text-secondary);
`;

const ErrorContainer = styled.div`
  padding: 1.25rem;
  margin: 1.25rem;
  background-color: var(--error-bg);
  border: 1px solid var(--error-color);
  border-radius: var(--border-radius);
  color: var(--error-color);
`;

const BreadcrumbContainer = styled.div`
  margin-bottom: 1.25rem;
  padding: 0.625rem 0;
  font-size: 0.875rem;
`;

const BreadcrumbLink = styled(Link)`
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-speed) ease;

  &:hover {
    color: var(--text-primary);
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 0.5rem;
  color: var(--text-tertiary);
`;

const BreadcrumbCurrent = styled.span`
  color: var(--text-primary);
`;

const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 },
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <BreadcrumbContainer>
      <BreadcrumbLink to="/">Home</BreadcrumbLink>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={name}>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            {isLast ? (
              <BreadcrumbCurrent>{name}</BreadcrumbCurrent>
            ) : (
              <BreadcrumbLink to={routeTo}>{name}</BreadcrumbLink>
            )}
          </React.Fragment>
        );
      })}
    </BreadcrumbContainer>
  );
};

const UserLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    return path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Dashboard';
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <LayoutContainer>
      {isSidebarOpen && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      <MainContent>
        <Header
          title={getPageTitle()}
          onMenuClick={toggleSidebar}
        />
        <ContentArea>
          <Breadcrumb />
          <ErrorBoundary>
            <Suspense fallback={<LoadingContainer>Loading...</LoadingContainer>}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  {...pageTransition}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </ErrorBoundary>
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default UserLayout;