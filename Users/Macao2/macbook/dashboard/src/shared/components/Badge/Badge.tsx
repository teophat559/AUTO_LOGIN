import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  count?: number;
  maxCount?: number;
  showZero?: boolean;
  className?: string;
  overflowText?: string;
}

const getVariantStyles = (variant: BadgeVariant) => {
  switch (variant) {
    case 'success':
      return css`
        background-color: ${theme.colors.success};
        color: white;
      `;
    case 'error':
      return css`
        background-color: ${theme.colors.error};
        color: white;
      `;
    case 'warning':
      return css`
        background-color: ${theme.colors.warning};
        color: white;
      `;
    case 'info':
      return css`
        background-color: ${theme.colors.info};
        color: white;
      `;
    default:
      return css`
        background-color: ${theme.colors.primary};
        color: white;
      `;
  }
};

const getSizeStyles = (size: BadgeSize) => {
  switch (size) {
    case 'small':
      return css`
        font-size: ${theme.typography.fontSize.xs};
        padding: 2px 6px;
        min-width: 16px;
        height: 16px;
      `;
    case 'large':
      return css`
        font-size: ${theme.typography.fontSize.md};
        padding: 4px 10px;
        min-width: 24px;
        height: 24px;
      `;
    default:
      return css`
        font-size: ${theme.typography.fontSize.sm};
        padding: 3px 8px;
        min-width: 20px;
        height: 20px;
      `;
  }
};

const BadgeContainer = styled.span<{
  variant: BadgeVariant;
  size: BadgeSize;
  dot: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => (props.dot ? '50%' : theme.borderRadius.full)};
  font-weight: ${theme.typography.fontWeight.medium};
  white-space: nowrap;
  transition: all ${theme.transitions.default};

  ${props => getVariantStyles(props.variant)}
  ${props => getSizeStyles(props.size)}

  ${props =>
    props.dot &&
    css`
      padding: 0;
      min-width: 8px;
      height: 8px;
    `}
`;

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  dot = false,
  count,
  maxCount = 99,
  showZero = false,
  className,
  overflowText = '+',
}) => {
  const displayCount = count !== undefined && !dot ? (
    count > maxCount ? `${maxCount}${overflowText}` : count
  ) : null;

  if (count === 0 && !showZero && !dot) {
    return <>{children}</>;
  }

  return (
    <BadgeContainer
      variant={variant}
      size={size}
      dot={dot}
      className={className}
    >
      {displayCount}
    </BadgeContainer>
  );
};

export default Badge;