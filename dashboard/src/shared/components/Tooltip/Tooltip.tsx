import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';
type TooltipVariant = 'default' | 'light' | 'dark';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: TooltipPosition;
  variant?: TooltipVariant;
  delay?: number;
  className?: string;
  enterDelay?: number;
  leaveDelay?: number;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const getPositionStyles = (position: TooltipPosition) => {
  switch (position) {
    case 'right':
      return css`
        left: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%);
        &::before {
          left: -6px;
          top: 50%;
          transform: translateY(-50%);
          border-right-color: inherit;
          border-left: none;
        }
      `;
    case 'bottom':
      return css`
        top: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        &::before {
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          border-bottom-color: inherit;
          border-top: none;
        }
      `;
    case 'left':
      return css`
        right: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%);
        &::before {
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          border-left-color: inherit;
          border-right: none;
        }
      `;
    default:
      return css`
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        &::before {
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          border-top-color: inherit;
          border-bottom: none;
        }
      `;
  }
};

const getVariantStyles = (variant: TooltipVariant) => {
  switch (variant) {
    case 'light':
      return css`
        background-color: white;
        color: ${theme.colors.text};
        border: 1px solid ${theme.colors.border};
        box-shadow: ${theme.shadows.sm};
      `;
    case 'dark':
      return css`
        background-color: ${theme.colors.text};
        color: white;
      `;
    default:
      return css`
        background-color: ${theme.colors.primary};
        color: white;
      `;
  }
};

const TooltipContainer = styled.div`
  display: inline-block;
  position: relative;
`;

const TooltipContent = styled.div<{
  position: TooltipPosition;
  variant: TooltipVariant;
  visible: boolean;
}>`
  position: absolute;
  z-index: ${theme.zIndex.tooltip};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.sm};
  white-space: nowrap;
  pointer-events: none;
  opacity: ${props => (props.visible ? 1 : 0)};
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  transition: opacity ${theme.transitions.default};
  animation: ${fadeIn} 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    border: 6px solid transparent;
  }

  ${props => getPositionStyles(props.position)}
  ${props => getVariantStyles(props.variant)}
`;

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  variant = 'default',
  delay = 200,
  className,
  enterDelay = 200,
  leaveDelay = 0,
}) => {
  const [visible, setVisible] = useState(false);
  const enterTimeoutRef = useRef<NodeJS.Timeout>();
  const leaveTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    enterTimeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, enterDelay);
  };

  const hideTooltip = () => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
    }
    leaveTimeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, leaveDelay);
  };

  useEffect(() => {
    return () => {
      if (enterTimeoutRef.current) {
        clearTimeout(enterTimeoutRef.current);
      }
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <TooltipContainer
      ref={containerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      className={className}
    >
      {children}
      <TooltipContent position={position} variant={variant} visible={visible}>
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip;