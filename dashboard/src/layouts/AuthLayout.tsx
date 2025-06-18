import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';
import { theme } from '../styles/theme';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.background.default};
  padding: ${theme.spacing.lg};
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 400px;
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  padding: ${theme.spacing.xl};
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const LogoText = styled.h1`
  font-size: ${theme.typography.fontSize.xxl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
`;

const AuthLayout: React.FC = () => {
  const { t } = useLanguage();

  return (
    <LayoutContainer>
      <AuthCard>
        <Logo>
          <LogoText>{t('app.name')}</LogoText>
        </Logo>
        <Outlet />
      </AuthCard>
    </LayoutContainer>
  );
};

export default AuthLayout;