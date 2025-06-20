import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  maxWidth?: number;
  className?: string;
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

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div<{
  placement: TooltipProps['placement'];
  visible: boolean;
  maxWidth: number;
}>`
  position: absolute;
  z-index: ${theme.zIndex.tooltip};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${theme.colors.background.paper};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.sm};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.md};
  max-width: ${props => props.maxWidth}px;
  white-space: normal;
  word-break: break-word;
  animation: ${fadeIn} ${theme.transitions.default} ease-out;
  pointer-events: none;

  ${props => {
    switch (props.placement) {
      case 'top':
        return css`
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          &:after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 6px;
            border-style: solid;
            border-color: ${theme.colors.background.paper} transparent transparent transparent;
          }
        `;
      case 'right':
        return css`
          left: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
          &:after {
            content: '';
            position: absolute;
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-width: 6px;
            border-style: solid;
            border-color: transparent ${theme.colors.background.paper} transparent transparent;
          }
        `;
      case 'bottom':
        return css`
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          &:after {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 6px;
            border-style: solid;
            border-color: transparent transparent ${theme.colors.background.paper} transparent;
          }
        `;
      case 'left':
        return css`
          right: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
          &:after {
            content: '';
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-width: 6px;
            border-style: solid;
            border-color: transparent transparent transparent ${theme.colors.background.paper};
          }
        `;
    }
  }}

  ${props => !props.visible && css`
    display: none;
  `}
`;

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 200,
  maxWidth = 200,
  className
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
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
      <TooltipContent
        placement={placement}
        visible={visible}
        maxWidth={maxWidth}
        role="tooltip"
      >
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip;