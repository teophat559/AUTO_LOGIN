import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'rounded' | 'square';
  color?: string;
  children?: React.ReactNode;
  className?: string;
}

const getInitials = (text: string): string => {
  return text
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const AvatarContainer = styled.div<{
  size: AvatarProps['size'];
  variant: AvatarProps['variant'];
  color: string;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color || theme.colors.primary};
  color: ${theme.colors.white};
  font-weight: ${theme.typography.fontWeight.medium};
  overflow: hidden;
  transition: all ${theme.transitions.default};

  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          width: 32px;
          height: 32px;
          font-size: ${theme.typography.fontSize.sm};
        `;
      case 'lg':
        return css`
          width: 64px;
          height: 64px;
          font-size: ${theme.typography.fontSize.lg};
        `;
      case 'xl':
        return css`
          width: 96px;
          height: 96px;
          font-size: ${theme.typography.fontSize.xl};
        `;
      default:
        return css`
          width: 48px;
          height: 48px;
          font-size: ${theme.typography.fontSize.md};
        `;
    }
  }}

  ${props => {
    switch (props.variant) {
      case 'circle':
        return css`
          border-radius: ${theme.borderRadius.full};
        `;
      case 'square':
        return css`
          border-radius: ${theme.borderRadius.none};
        `;
      default:
        return css`
          border-radius: ${theme.borderRadius.md};
        `;
    }
  }}
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.background.default};
  color: ${theme.colors.text.primary};
`;

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'md',
  variant = 'circle',
  color,
  children,
  className
}) => {
  const [error, setError] = React.useState(false);
  const initials = React.useMemo(() => {
    if (children && typeof children === 'string') {
      return getInitials(children);
    }
    return null;
  }, [children]);

  const handleError = () => {
    setError(true);
  };

  return (
    <AvatarContainer
      size={size}
      variant={variant}
      color={color}
      className={className}
    >
      {src && !error ? (
        <AvatarImage
          src={src}
          alt={alt}
          onError={handleError}
        />
      ) : (
        <AvatarFallback>
          {initials || children}
        </AvatarFallback>
      )}
    </AvatarContainer>
  );
};

export default Avatar;