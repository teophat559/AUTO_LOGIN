import React from 'react';
import styled, { css } from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const StyledInput = styled.input<{ error?: string }>`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  background-color: ${props => props.theme.colors.background};
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${props => props.error ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.error ? props.theme.colors.errorLight : props.theme.colors.primaryLight};
  }

  &:disabled {
    background-color: ${props => props.theme.colors.disabled};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${props => props.theme.colors.placeholder};
  }
`;

const StyledTextarea = styled.textarea<{ error?: string }>`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  background-color: ${props => props.theme.colors.background};
  transition: all 0.2s ease-in-out;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.error ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.error ? props.theme.colors.errorLight : props.theme.colors.primaryLight};
  }

  &:disabled {
    background-color: ${props => props.theme.colors.disabled};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${props => props.theme.colors.placeholder};
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.error};
`;

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  multiline = false,
  rows = 4,
  ...props
}) => {
  return (
    <InputContainer fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      {multiline ? (
        <StyledTextarea error={error} rows={rows} {...props} />
      ) : (
        <StyledInput error={error} {...props} />
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

export default Input;