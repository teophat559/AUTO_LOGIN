import React, { useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../../styles/theme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

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

const ToastContainer = styled.div<{ type: ToastType }>`
  position: fixed;
  top: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  min-width: 300px;
  max-width: 400px;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.background.paper};
  box-shadow: ${theme.shadows.lg};
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  animation: ${slideIn} 0.3s ease-out forwards;
  z-index: ${theme.zIndex.toast};

  &.closing {
    animation: ${slideOut} 0.3s ease-in forwards;
  }

  ${props => {
    switch (props.type) {
      case 'success':
        return css`
          border-left: 4px solid ${theme.colors.success};
        `;
      case 'error':
        return css`
          border-left: 4px solid ${theme.colors.error};
        `;
      case 'warning':
        return css`
          border-left: 4px solid ${theme.colors.warning};
        `;
      case 'info':
        return css`
          border-left: 4px solid ${theme.colors.info};
        `;
    }
  }}
`;

const IconWrapper = styled.div<{ type: ToastType }>`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.full};
  background: ${props => {
    switch (props.type) {
      case 'success':
        return theme.colors.successLight;
      case 'error':
        return theme.colors.errorLight;
      case 'warning':
        return theme.colors.warningLight;
      case 'info':
        return theme.colors.infoLight;
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'info':
        return theme.colors.info;
    }
  }};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Message = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
  word-break: break-word;
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  padding: ${theme.spacing.xs};
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.default};

  &:hover {
    background: ${theme.colors.background.hover};
    color: ${theme.colors.text.primary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case 'error':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    case 'warning':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'info':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const toast = document.getElementById('toast');
      if (toast) {
        toast.classList.add('closing');
        setTimeout(onClose, 300);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <ToastContainer id="toast" type={type}>
      <IconWrapper type={type}>
        {getIcon(type)}
      </IconWrapper>
      <Content>
        <Message>{message}</Message>
      </Content>
      <CloseButton onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </CloseButton>
    </ToastContainer>
  );
};

export default Toast;