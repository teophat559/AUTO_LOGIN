import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  danger?: boolean;
}

const getVariantStyles = (variant: ButtonVariant, danger?: boolean) => {
  const colors = danger ? theme.colors.error : theme.colors.primary;
  const colorsDark = danger ? theme.colors.errorDark : theme.colors.primaryDark;
  const colorsLight = danger ? theme.colors.errorLight : theme.colors.primaryLight;

  switch (variant) {
    case 'primary':
      return css`
        background-color: ${colors};
        color: ${theme.colors.white};
        &:hover {
          background-color: ${colorsDark};
        }
      `;
    case 'secondary':
      return css`
        background-color: ${theme.colors.secondary};
        color: ${theme.colors.white};
        &:hover {
          background-color: ${theme.colors.secondaryDark};
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        border: 1px solid ${colors};
        color: ${colors};
        &:hover {
          background-color: ${colorsLight};
        }
      `;
    case 'text':
      return css`
        background-color: transparent;
        color: ${colors};
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        &:hover {
          text-decoration: underline;
        }
      `;
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return css`
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        font-size: ${theme.typography.fontSize.sm};
        min-height: 32px;
      `;
    case 'large':
      return css`
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        font-size: ${theme.typography.fontSize.lg};
        min-height: 48px;
      `;
    default:
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: ${theme.typography.fontSize.md};
        min-height: 40px;
      `;
  }
};

const ButtonContainer = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.default};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  position: relative;
  white-space: nowrap;

  ${props => getVariantStyles(props.variant || 'primary', props.danger)}
  ${props => getSizeStyles(props.size || 'medium')}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.danger ? theme.colors.errorLight : theme.colors.primaryLight};
  }

  svg {
    width: ${props => {
      switch (props.size) {
        case 'small':
          return '16px';
        case 'large':
          return '24px';
        default:
          return '20px';
      }
    }};
    height: ${props => {
      switch (props.size) {
        case 'small':
          return '16px';
        case 'large':
          return '24px';
        default:
          return '20px';
      }
    }};
  }

  ${props => props.loading && css`
    position: relative;
    color: transparent;
    pointer-events: none;

    &::after {
      content: '';
      position: absolute;
      width: 1rem;
      height: 1rem;
      border: 2px solid ${props.variant === 'outline' || props.variant === 'text'
        ? props.theme.colors.primary
        : 'white'};
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `}
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: inherit;
  border-radius: inherit;
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  icon,
  danger = false,
  disabled,
  ...props
}) => {
  return (
    <ButtonContainer
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      danger={danger}
      loading={loading}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingOverlay>
          <div className="spinner" />
        </LoadingOverlay>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </ButtonContainer>
  );
};

export default Button;