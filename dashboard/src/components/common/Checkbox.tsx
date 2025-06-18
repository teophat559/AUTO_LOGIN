import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface CheckboxProps {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const CheckboxWrapper = styled.div<{ fullWidth: boolean }>`
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
    .checkbox {
      border-color: ${theme.colors.primary};
    }
  }
`;

const CheckboxContainer = styled.div<{
  size: CheckboxProps['size'];
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

  ${props => props.disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  `}
`;

const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

const CheckboxBox = styled.div<{
  checked: boolean;
  indeterminate: boolean;
  size: CheckboxProps['size'];
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid ${props => props.checked ? theme.colors.primary : theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  background: ${props => props.checked ? theme.colors.primary : theme.colors.background.paper};
  transition: all ${theme.transitions.default};

  ${props => props.checked && css`
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60%;
      height: 60%;
      background: ${theme.colors.white};
      border-radius: ${theme.borderRadius.xs};
    }
  `}

  ${props => props.indeterminate && css`
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60%;
      height: 2px;
      background: ${theme.colors.white};
      border-radius: ${theme.borderRadius.xs};
    }
  `}
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

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  error,
  helperText,
  size = 'md',
  indeterminate = false,
  fullWidth = false,
  disabled = false,
  className,
  ...props
}, ref) => {
  return (
    <CheckboxWrapper fullWidth={fullWidth} className={className}>
      <Label>
        <CheckboxContainer size={size} disabled={disabled}>
          <CheckboxInput
            ref={ref}
            type="checkbox"
            disabled={disabled}
            {...props}
          />
          <CheckboxBox
            className="checkbox"
            checked={props.checked || false}
            indeterminate={indeterminate}
            size={size}
          />
        </CheckboxContainer>
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
    </CheckboxWrapper>
  );
});

export default Checkbox;