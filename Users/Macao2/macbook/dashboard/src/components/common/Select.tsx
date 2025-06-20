import React from 'react';
import styled from 'styled-components';

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #212529;
`;

const StyledSelect = styled.select<{ error?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${(props) => (props.error ? '#dc3545' : '#dee2e6')};
  border-radius: 4px;
  font-size: 1rem;
  color: #212529;
  background-color: ${(props) => (props.error ? '#fff5f5' : '#fff')};
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23212529' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 12px;
  padding-right: 2.5rem;

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

  option {
    padding: 0.5rem;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
`;

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  errorMessage,
  options,
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <SelectContainer>
      {label && <Label>{label}</Label>}
      <StyledSelect error={error} onChange={handleChange} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
      {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </SelectContainer>
  );
};

export default Select;