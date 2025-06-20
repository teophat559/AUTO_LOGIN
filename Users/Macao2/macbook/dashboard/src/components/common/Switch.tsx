import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const SwitchWrapper = styled.div<{ fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const Label = styled.label`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  cursor: pointer;
  user-select: none;

  &:hover {
    .switch-track {
      background: ${theme.colors.primaryLight};
    }
  }
`;

const SwitchContainer = styled.div<{
  size: SwitchProps['size'];
  disabled: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all ${theme.transitions.default};

  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          width: 36px;
          height: 20px;
        `;
      case 'lg':
        return css`
          width: 52px;
          height: 28px;
        `;
      default:
        return css`
          width: 44px;
          height: 24px;
        `;
    }
  }}

  ${props => props.disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  `}
`;

const SwitchInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

const SwitchTrack = styled.div<{
  checked: boolean;
  size: SwitchProps['size'];
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.checked ? theme.colors.primary : theme.colors.border};
  border-radius: 999px;
  transition: all ${theme.transitions.default};

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: ${props => props.checked ? 'calc(100% - 2px)' : '2px'};
    transform: translate(-50%, -50%);
    background: ${theme.colors.white};
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all ${theme.transitions.default};

    ${props => {
      switch (props.size) {
        case 'sm':
          return css`
            width: 16px;
            height: 16px;
          `;
        case 'lg':
          return css`
            width: 24px;
            height: 24px;
          `;
        default:
          return css`
            width: 20px;
            height: 20px;
          `;
      }
    }}
  }
`;

const HelperText = styled.div<{ hasError: boolean }>`
  font-size: ${theme.typography.fontSize.xs};
  color: ${props => props.hasError ? theme.colors.error : theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  min-height: 16px;
  margin-left: ${theme.spacing.xl};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  label,
  error,
  helperText,
  size = 'md',
  fullWidth = false,
  disabled = false,
  className,
  ...props
}, ref) => {
  return (
    <SwitchWrapper fullWidth={fullWidth} className={className}>
      <Label>
        <SwitchContainer size={size} disabled={disabled}>
          <SwitchInput
            ref={ref}
            type="checkbox"
            disabled={disabled}
            {...props}
          />
          <SwitchTrack
            className="switch-track"
            checked={props.checked || false}
            size={size}
          />
        </SwitchContainer>
        {label}
      </Label>
      {(error || helperText) && (
        <HelperText hasError={!!error}>
          {error && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {error || helperText}
        </HelperText>
      )}
    </SwitchWrapper>
  );
});

export default Switch;