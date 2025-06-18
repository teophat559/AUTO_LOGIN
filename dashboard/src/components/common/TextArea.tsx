import React from 'react';
import styled from 'styled-components';

const TextAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #212529;
`;

const StyledTextArea = styled.textarea<{ error?: boolean }>`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid ${(props) => (props.error ? '#dc3545' : '#dee2e6')};
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1.5;
  color: #212529;
  background-color: ${(props) => (props.error ? '#fff5f5' : '#fff')};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.error ? '#dc3545' : '#0d6efd')};
    box-shadow: 0 0 0 0.2rem
      ${(props) =>
        props.error ? 'rgba(220, 53, 69, 0.25)' : 'rgba(13, 110, 253, 0.25)'};
  }

  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
`;

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  errorMessage,
  ...props
}) => {
  return (
    <TextAreaContainer>
      {label && <Label>{label}</Label>}
      <StyledTextArea error={error} {...props} />
      {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </TextAreaContainer>
  );
};

export default TextArea;