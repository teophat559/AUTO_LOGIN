import React from 'react';
import styled, { css } from 'styled-components';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  onClose?: () => void;
}

const getVariantStyles = (variant: AlertVariant) => {
  switch (variant) {
    case 'success':
      return css`
        background-color: ${props => props.theme.colors.successLight};
        color: ${props => props.theme.colors.success};
        border: 1px solid ${props => props.theme.colors.success};
      `;
    case 'error':
      return css`
        background-color: ${props => props.theme.colors.errorLight};
        color: ${props => props.theme.colors.error};
        border: 1px solid ${props => props.theme.colors.error};
      `;
    case 'warning':
      return css`
        background-color: ${props => props.theme.colors.warningLight};
        color: ${props => props.theme.colors.warning};
        border: 1px solid ${props => props.theme.colors.warning};
      `;
    case 'info':
      return css`
        background-color: ${props => props.theme.colors.infoLight};
        color: ${props => props.theme.colors.info};
        border: 1px solid ${props => props.theme.colors.info};
      `;
  }
};

const AlertContainer = styled.div<{ variant: AlertVariant }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius};
  font-size: 0.875rem;
  ${props => getVariantStyles(props.variant)}
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 1;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  onClose,
}) => {
  return (
    <AlertContainer variant={variant}>
      <div>{children}</div>
      {onClose && (
        <CloseButton onClick={onClose} aria-label="Close alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </CloseButton>
      )}
    </AlertContainer>
  );
};

export default Alert;