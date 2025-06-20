import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
  error?: string;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
}

const getVariantStyles = (variant: CardProps['variant']) => {
  switch (variant) {
    case 'elevated':
      return css`
        background-color: ${props => props.theme.colors.background};
        box-shadow: ${props => props.theme.shadows.medium};
      `;
    case 'outlined':
      return css`
        background-color: ${props => props.theme.colors.background};
        border: 1px solid ${props => props.theme.colors.border};
      `;
    case 'filled':
      return css`
        background-color: ${props => props.theme.colors.backgroundLight};
      `;
  }
};

const getPaddingStyles = (padding: CardProps['padding']) => {
  switch (padding) {
    case 'none':
      return css`padding: 0;`;
    case 'small':
      return css`padding: 1rem;`;
    case 'medium':
      return css`padding: 1.5rem;`;
    case 'large':
      return css`padding: 2rem;`;
  }
};

const StyledCard = styled.div<CardProps>`
  border-radius: ${props => props.theme.borderRadius};
  transition: all 0.2s ease-in-out;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  ${props => getVariantStyles(props.variant || 'elevated')}
  ${props => getPaddingStyles(props.padding || 'medium')}

  ${props => props.onClick && css`
    cursor: pointer;
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.large};
    }
  `}
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
  gap: ${theme.spacing.md};
`;

const CardTitle = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
`;

const CardSubtitle = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  margin-top: ${theme.spacing.xs};
`;

const CardContent = styled.div`
  color: ${theme.colors.text.primary};
`;

const CardFooter = styled.div`
  margin-top: ${theme.spacing.lg};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.background.paper}CC;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.typography.fontSize.sm};
  margin-top: ${theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  loading = false,
  error,
  variant = 'elevated',
  padding = 'medium',
  fullWidth = false,
  className,
  onClick
}) => {
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      fullWidth={fullWidth}
      className={className}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <CardHeader>
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
          </div>
        </CardHeader>
      )}

      <CardContent>
        {children}
        {error && (
          <ErrorMessage>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </ErrorMessage>
        )}
      </CardContent>

      {footer && <CardFooter>{footer}</CardFooter>}

      {loading && (
        <LoadingOverlay>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: 'spin 1s linear infinite' }}
          >
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
        </LoadingOverlay>
      )}
    </StyledCard>
  );
};

export default Card;