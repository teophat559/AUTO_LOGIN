import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../../styles/theme';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div<{ type: ToastType; isVisible: boolean }>`
  position: fixed;
  top: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  background: ${props => {
    switch (props.type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.primary;
    }
  }};
  color: white;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  box-shadow: ${theme.shadows.lg};
  z-index: ${theme.zIndex.toast};
  animation: ${props => (props.isVisible ? slideIn : slideOut)} 0.3s ease-in-out;
  min-width: 300px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Message = styled.p`
  margin: 0;
  font-size: ${theme.typography.fontSize.md};
  flex: 1;
`;

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
  isVisible?: boolean;
  autoHideDuration?: number;
}

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return <SuccessIcon />;
    case 'error':
      return <ErrorIcon />;
    case 'warning':
      return <WarningIcon />;
    case 'info':
      return <InfoIcon />;
  }
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 3000,
  onClose,
  isVisible = true,
  autoHideDuration,
}) => {
  const hideDuration = autoHideDuration || duration;

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, hideDuration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, hideDuration, onClose]);

  return (
    <ToastContainer type={type} isVisible={isVisible}>
      <IconWrapper>{getIcon(type)}</IconWrapper>
      <Message>{message}</Message>
    </ToastContainer>
  );
};