import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
  emptyText?: string;
}

const CardContainer = styled.div<{ variant: string; onClick?: () => void }>`
  background-color: white;
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.default};

  ${props => {
    switch (props.variant) {
      case 'outlined':
        return css`
          border: 1px solid ${theme.colors.border};
        `;
      case 'elevated':
        return css`
          box-shadow: ${theme.shadows.md};
          &:hover {
            box-shadow: ${theme.shadows.lg};
          }
        `;
      default:
        return css`
          box-shadow: ${theme.shadows.sm};
        `;
    }
  }}

  ${props =>
    props.onClick &&
    css`
      cursor: pointer;
      &:hover {
        transform: translateY(-2px);
      }
    `}
`;

const CardHeader = styled.div`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text};
`;

const CardSubtitle = styled.p`
  margin: ${theme.spacing.xs} 0 0;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

const CardContent = styled.div<{ padding: string }>`
  ${props => {
    switch (props.padding) {
      case 'none':
        return css`
          padding: 0;
        `;
      case 'small':
        return css`
          padding: ${theme.spacing.sm};
        `;
      case 'large':
        return css`
          padding: ${theme.spacing.lg};
        `;
      default:
        return css`
          padding: ${theme.spacing.md};
        `;
    }
  }}
`;

const EmptyState = styled.div`
  padding: ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
`;

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  variant = 'default',
  padding = 'medium',
  onClick,
  className,
  emptyText = 'Không có dữ liệu',
}) => {
  const isEmpty = React.Children.count(children) === 0;

  return (
    <CardContainer variant={variant} onClick={onClick} className={className}>
      {(title || subtitle) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </CardHeader>
      )}
      <CardContent padding={padding}>
        {isEmpty ? <EmptyState>{emptyText}</EmptyState> : children}
      </CardContent>
    </CardContainer>
  );
};

export default Card;