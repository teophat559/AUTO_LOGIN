import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface BadgeProps {
  children?: React.ReactNode;
  content?: string | number;
  count?: number;
  color?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  max?: number;
  showZero?: boolean;
  className?: string;
}

const BadgeContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

const BadgeContent = styled.div<{
  variant: BadgeProps['variant'];
  size: BadgeProps['size'];
  dot: boolean;
}>`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.full};
  background: ${props => {
    switch (props.variant) {
      case 'primary':
        return theme.colors.primary;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'info':
        return theme.colors.info || theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      default:
        return theme.colors.secondary;
    }
  }};
  color: ${theme.colors.white};
  font-weight: ${theme.typography.fontWeight.medium};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all ${theme.transitions.default};

  ${props => {
    if (props.dot) {
      switch (props.size) {
        case 'sm':
          return css`
            width: 8px;
            height: 8px;
            min-width: 8px;
            padding: 0;
          `;
        case 'lg':
          return css`
            width: 12px;
            height: 12px;
            min-width: 12px;
            padding: 0;
          `;
        default:
          return css`
            width: 10px;
            height: 10px;
            min-width: 10px;
            padding: 0;
          `;
      }
    }

    switch (props.size) {
      case 'sm':
        return css`
          min-width: 16px;
          height: 16px;
          padding: 0 ${theme.spacing.xs};
          font-size: ${theme.typography.fontSize.xs};
        `;
      case 'lg':
        return css`
          min-width: 24px;
          height: 24px;
          padding: 0 ${theme.spacing.sm};
          font-size: ${theme.typography.fontSize.sm};
        `;
      default:
        return css`
          min-width: 20px;
          height: 20px;
          padding: 0 ${theme.spacing.xs};
          font-size: ${theme.typography.fontSize.xs};
        `;
    }
  }}
`;

const Badge: React.FC<BadgeProps> = ({
  children,
  content,
  count,
  color,
  variant = 'default',
  size = 'md',
  dot = false,
  max,
  showZero = false,
  className
}) => {
  const displayContent = React.useMemo(() => {
    if (dot) return null;
    const value = count !== undefined ? count : content;
    if (value === undefined || value === null) return null;
    if (!showZero && value === 0) return null;
    if (max !== undefined && typeof value === 'number' && value > max) {
      return `${max}+`;
    }
    return value;
  }, [content, count, dot, max, showZero]);

  const badgeVariant = color ? 'default' : variant;

  return (
    <BadgeContainer className={className}>
      {children}
      {(displayContent !== null || dot) && (
        <BadgeContent
          variant={badgeVariant}
          size={size}
          dot={dot}
          style={color ? { backgroundColor: color } : undefined}
        >
          {displayContent}
        </BadgeContent>
      )}
    </BadgeContainer>
  );
};

export default Badge;