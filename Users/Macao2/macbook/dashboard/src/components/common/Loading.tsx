import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  fullScreen?: boolean;
  text?: string;
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const LoadingContainer = styled.div<{ fullScreen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
  animation: ${fadeIn} 0.3s ease-out;

  ${props => props.fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${theme.colors.background.paper}CC;
    z-index: ${theme.zIndex.loading};
  `}
`;

const Spinner = styled.div<{ size: LoadingProps['size']; color: string }>`
  width: ${props => {
    switch (props.size) {
      case 'sm':
        return '24px';
      case 'lg':
        return '48px';
      default:
        return '32px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'sm':
        return '24px';
      case 'lg':
        return '48px';
      default:
        return '32px';
    }
  }};
  border: 2px solid ${props => props.color}33;
  border-top-color: ${props => props.color};
  border-radius: ${theme.borderRadius.full};
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div<{ size: LoadingProps['size'] }>`
  font-size: ${props => {
    switch (props.size) {
      case 'sm':
        return theme.typography.fontSize.sm;
      case 'lg':
        return theme.typography.fontSize.lg;
      default:
        return theme.typography.fontSize.md;
    }
  }};
  color: ${theme.colors.text.secondary};
  text-align: center;
`;

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  color = theme.colors.primary,
  fullScreen = false,
  text
}) => {
  return (
    <LoadingContainer fullScreen={fullScreen}>
      <Spinner size={size} color={color} />
      {text && <LoadingText size={size}>{text}</LoadingText>}
    </LoadingContainer>
  );
};

export default Loading;