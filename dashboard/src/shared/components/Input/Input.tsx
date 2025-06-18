import React from 'react';
import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${props => (props.fullWidth ? '100%' : 'auto')};
  margin-bottom: 16px;
`;

const Label = styled.label`
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input<{ hasError?: boolean; hasStartIcon?: boolean; hasEndIcon?: boolean }>`
  width: 100%;
  padding: ${props => {
    let padding = '10px 12px';
    if (props.hasStartIcon) padding = '10px 12px 10px 40px';
    if (props.hasEndIcon) padding = '10px 40px 10px 12px';
    if (props.hasStartIcon && props.hasEndIcon) padding = '10px 40px';
    return padding;
  }};
  border: 1px solid ${props => (props.hasError ? '#e74c3c' : '#e9ecef')};
  border-radius: 4px;
  font-size: 14px;
  color: #2c3e50;
  transition: all 0.2s ease;
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${props => (props.hasError ? '#e74c3c' : '#3498db')};
    box-shadow: 0 0 0 2px ${props => (props.hasError ? 'rgba(231, 76, 60, 0.2)' : 'rgba(52, 152, 219, 0.2)')};
  }

  &::placeholder {
    color: #95a5a6;
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
`;

const HelperText = styled.span`
  color: #7f8c8d;
  font-size: 12px;
  margin-top: 4px;
`;

const IconWrapper = styled.div<{ position: 'start' | 'end' }>`
  position: absolute;
  ${props => (props.position === 'start' ? 'left: 12px;' : 'right: 12px;')}
  display: flex;
  align-items: center;
  color: #95a5a6;
  pointer-events: none;
`;

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth,
  helperText,
  startIcon,
  endIcon,
  ...props
}) => {
  return (
    <InputContainer fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <InputWrapper>
        {startIcon && <IconWrapper position="start">{startIcon}</IconWrapper>}
        <StyledInput
          hasError={!!error}
          hasStartIcon={!!startIcon}
          hasEndIcon={!!endIcon}
          {...props}
        />
        {endIcon && <IconWrapper position="end">{endIcon}</IconWrapper>}
      </InputWrapper>
      {error && <ErrorText>{error}</ErrorText>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </InputContainer>
  );
};

export default Input;