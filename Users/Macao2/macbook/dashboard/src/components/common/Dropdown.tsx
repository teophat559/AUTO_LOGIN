import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface DropdownOption {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  label?: string;
}

const DropdownWrapper = styled.div<{ fullWidth?: boolean }>`
  position: relative;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  margin-bottom: ${theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const SelectButton = styled.button<{ hasError?: boolean; isOpen: boolean }>`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.background.paper};
  border: 1px solid ${props => props.hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.md};
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all ${theme.transitions.default};

  &:hover:not(:disabled) {
    border-color: ${props => props.hasError ? theme.colors.error : theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.hasError ? theme.colors.errorLight : theme.colors.primaryLight};
  }

  &:disabled {
    background: ${theme.colors.background.disabled};
    cursor: not-allowed;
    opacity: 0.7;
  }

  &::after {
    content: '';
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid ${theme.colors.text.secondary};
    margin-left: ${theme.spacing.sm};
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    transition: transform ${theme.transitions.default};
  }
`;

const OptionsList = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${theme.colors.background.paper};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  margin-top: ${theme.spacing.xs};
  box-shadow: ${theme.shadows.md};
  z-index: ${theme.zIndex.dropdown};
  max-height: 300px;
  overflow-y: auto;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const Option = styled.div<{ isSelected?: boolean; isDisabled?: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  color: ${props => {
    if (props.isDisabled) return theme.colors.text.disabled;
    if (props.isSelected) return theme.colors.primary;
    return theme.colors.text.primary;
  }};
  background: ${props => props.isSelected ? theme.colors.primaryLight : 'transparent'};
  opacity: ${props => props.isDisabled ? 0.7 : 1};
  transition: all ${theme.transitions.default};

  &:hover:not(:disabled) {
    background: ${props => props.isSelected ? theme.colors.primaryLight : theme.colors.background.hover};
  }

  svg {
    margin-right: ${theme.spacing.sm};
    color: ${props => props.isSelected ? theme.colors.primary : theme.colors.text.secondary};
  }
`;

const ErrorMessage = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.error};
  margin-top: ${theme.spacing.xs};
`;

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
  fullWidth = false,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (option: DropdownOption) => {
    if (!option.disabled) {
      onChange(option.value);
      setIsOpen(false);
    }
  };

  return (
    <DropdownWrapper ref={dropdownRef} fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <SelectButton
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        hasError={!!error}
        isOpen={isOpen}
        disabled={disabled}
      >
        {selectedOption ? (
          <span>
            {selectedOption.icon}
            {selectedOption.label}
          </span>
        ) : (
          <span style={{ color: theme.colors.text.secondary }}>{placeholder}</span>
        )}
      </SelectButton>
      <OptionsList isOpen={isOpen}>
        {options.map(option => (
          <Option
            key={option.value}
            isSelected={option.value === value}
            isDisabled={option.disabled}
            onClick={() => handleSelect(option)}
          >
            {option.icon}
            {option.label}
          </Option>
        ))}
      </OptionsList>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </DropdownWrapper>
  );
};

export default Dropdown;