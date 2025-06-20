import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';
type AvatarVariant = 'circle' | 'rounded' | 'square';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  fallbackText?: string;
}

const getSizeStyles = (size: AvatarSize) => {
  switch (size) {
    case 'small':
      return css`
        width: 32px;
        height: 32px;
        font-size: ${theme.typography.fontSize.sm};
      `;
    case 'large':
      return css`
        width: 64px;
        height: 64px;
        font-size: ${theme.typography.fontSize.xl};
      `;
    case 'xlarge':
      return css`
        width: 96px;
        height: 96px;
        font-size: ${theme.typography.fontSize.xxl};
      `;
    default:
      return css`
        width: 48px;
        height: 48px;
        font-size: ${theme.typography.fontSize.lg};
      `;
  }
};

const getVariantStyles = (variant: AvatarVariant) => {
  switch (variant) {
    case 'rounded':
      return css`
        border-radius: ${theme.borderRadius.md};
      `;
    case 'square':
      return css`
        border-radius: 0;
      `;
    default:
      return css`
        border-radius: 50%;
      `;
  }
};

const AvatarContainer = styled.div<{
  size: AvatarSize;
  variant: AvatarVariant;
  onClick?: () => void;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.primary};
  color: white;
  font-weight: ${theme.typography.fontWeight.medium};
  overflow: hidden;
  position: relative;
  transition: all ${theme.transitions.default};

  ${props => getSizeStyles(props.size)}
  ${props => getVariantStyles(props.variant)}

  ${props =>
    props.onClick &&
    css`
      cursor: pointer;
      &:hover {
        transform: scale(1.05);
      }
    `}
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
  background-color: ${theme.colors.primary};
  color: white;
`;

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'medium',
  variant = 'circle',
  children,
  className,
  onClick,
  fallbackText = '?',
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (text: string) => {
    return text
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderContent = () => {
    if (src && !imageError) {
      return (
        <AvatarImage
          src={src}
          alt={alt || 'Ảnh đại diện'}
          onError={handleImageError}
        />
      );
    }

    if (children) {
      return <AvatarFallback>{children}</AvatarFallback>;
    }

    if (alt) {
      return <AvatarFallback>{getInitials(alt)}</AvatarFallback>;
    }

    return <AvatarFallback>{fallbackText}</AvatarFallback>;
  };

  return (
    <AvatarContainer
      size={size}
      variant={variant}
      onClick={onClick}
      className={className}
    >
      {renderContent()}
    </AvatarContainer>
  );
};

export default Avatar;