import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${theme.colors.background.default};
`;

const MainContent = styled.main<{ sidebar: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${props => (props.sidebar ? '220px' : '0')};
  transition: margin-left ${theme.transitions.default};

  @media (max-width: ${theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.appBar};
  background-color: white;
  box-shadow: ${theme.shadows.sm};
  padding: ${theme.spacing.md};
`;

const Content = styled.div`
  flex: 1;
  padding: ${theme.spacing.lg};
`;

const Footer = styled.footer`
  background-color: white;
  padding: ${theme.spacing.md};
  box-shadow: ${theme.shadows.sm};
`;

const Sidebar = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 220px;
  background-color: white;
  box-shadow: ${theme.shadows.md};
  z-index: ${theme.zIndex.sidebar};
  transition: transform ${theme.transitions.default};

  @media (max-width: ${theme.breakpoints.md}) {
    transform: translateX(-100%);
    &.open {
      transform: translateX(0);
    }
  }
`;

const Layout: React.FC<LayoutProps> = ({
  children,
  sidebar,
  header,
  footer,
}) => {
  return (
    <LayoutContainer>
      {sidebar && <Sidebar>{sidebar}</Sidebar>}
      <MainContent sidebar={!!sidebar}>
        {header && <Header>{header}</Header>}
        <Content>{children}</Content>
        {footer && <Footer>{footer}</Footer>}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;