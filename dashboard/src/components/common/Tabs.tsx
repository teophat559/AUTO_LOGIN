import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export interface Tab {
  key: string;
  value?: string;
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

export interface TabsProps {
  tabs?: Tab[];
  activeTab?: string;
  onChange?: (key: string) => void;
  fullWidth?: boolean;
  variant?: 'line' | 'enclosed' | 'soft-rounded' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  activeKey?: string;
  items?: Tab[];
}

const TabsContainer = styled.div`
  width: 100%;
`;

const TabList = styled.div<{ fullWidth?: boolean; variant: TabsProps['variant'] }>`
  display: flex;
  gap: ${theme.spacing.xs};
  border-bottom: ${props => props.variant === 'line' ? `1px solid ${theme.colors.border}` : 'none'};
  margin-bottom: ${theme.spacing.md};
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabButton = styled.button<{
  isActive: boolean;
  variant: TabsProps['variant'];
  size: TabsProps['size'];
  fullWidth?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${props => {
    switch (props.size) {
      case 'sm':
        return `${theme.spacing.xs} ${theme.spacing.sm}`;
      case 'lg':
        return `${theme.spacing.md} ${theme.spacing.lg}`;
      default:
        return `${theme.spacing.sm} ${theme.spacing.md}`;
    }
  }};
  border: none;
  background: none;
  color: ${props => props.isActive ? theme.colors.primary : theme.colors.text.secondary};
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
  font-weight: ${props => props.isActive ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.default};
  white-space: nowrap;
  flex: ${props => props.fullWidth ? 1 : 'none'};
  position: relative;

  ${props => {
    switch (props.variant) {
      case 'line':
        return `
          border-bottom: 2px solid ${props.isActive ? theme.colors.primary : 'transparent'};
          margin-bottom: -1px;
        `;
      case 'underline':
        return `
          border-bottom: 2px solid ${props.isActive ? theme.colors.primary : 'transparent'};
          margin-bottom: -1px;
        `;
      case 'enclosed':
        return `
          border: 1px solid ${props.isActive ? theme.colors.primary : theme.colors.border};
          border-bottom: none;
          border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;
          background: ${props.isActive ? theme.colors.background.paper : theme.colors.background.default};
        `;
      case 'soft-rounded':
        return `
          border-radius: ${theme.borderRadius.full};
          background: ${props.isActive ? theme.colors.primaryLight : 'transparent'};
          &:hover {
            background: ${props.isActive ? theme.colors.primaryLight : theme.colors.background.hover};
          }
        `;
      default:
        return '';
    }
  }}

  &:hover:not(:disabled) {
    color: ${theme.colors.primary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    width: ${props => {
      switch (props.size) {
        case 'sm':
          return '16px';
        case 'lg':
          return '24px';
        default:
          return '20px';
      }
    }};
    height: ${props => {
      switch (props.size) {
        case 'sm':
          return '16px';
        case 'lg':
          return '24px';
        default:
          return '20px';
      }
    }};
    color: ${props => props.isActive ? theme.colors.primary : theme.colors.text.secondary};
  }
`;

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  fullWidth = false,
  variant = 'line',
  size = 'md',
  activeKey,
  items
}) => {
  const displayTabs = items || tabs || [];
  const currentActiveTab = activeKey || activeTab || displayTabs[0]?.key || '';

  return (
    <TabsContainer>
      <TabList fullWidth={fullWidth} variant={variant}>
        {displayTabs.map(tab => (
          <TabButton
            key={tab.key}
            isActive={currentActiveTab === tab.key}
            onClick={() => !tab.disabled && onChange?.(tab.key)}
            disabled={tab.disabled}
            variant={variant}
            size={size}
            fullWidth={fullWidth}
          >
            {tab.icon}
            {tab.label}
          </TabButton>
        ))}
      </TabList>
    </TabsContainer>
  );
};

export default Tabs;