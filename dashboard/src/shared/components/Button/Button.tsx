import React from 'react';
import styled from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'danger' | 'default';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => {
    switch (props.size) {
      case 'small':
        return '8px 16px';
      case 'large':
        return '16px 32px';
      default:
        return '12px 24px';
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'small':
        return '14px';
      case 'large':
        return '18px';
      default:
        return '16px';
    }
  }};
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  width: ${props => (props.fullWidth ? '100%' : 'auto')};
  opacity: ${props => (props.loading ? 0.7 : 1)};
  pointer-events: ${props => (props.loading ? 'none' : 'auto')};

  background-color: ${props => {
    switch (props.variant) {
      case 'primary':
        return '#3498db';
      case 'secondary':
        return '#2ecc71';
      case 'success':
        return '#27ae60';
      case 'error':
      case 'danger':
        return '#e74c3c';
      case 'warning':
        return '#f1c40f';
      case 'info':
        return '#3498db';
      case 'default':
        return '#95a5a6';
      default:
        return '#3498db';
    }
  }};

  color: white;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Đang tải...' : children}
    </StyledButton>
  );
};

export default Button;