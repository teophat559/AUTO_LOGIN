import React from 'react';
import styled from 'styled-components';

const ProgressContainer = styled.div`
  width: 100%;
`;

const ProgressBar = styled.div<{ height?: string }>`
  width: 100%;
  height: ${(props) => props.height || '0.5rem'};
  background-color: #e9ecef;
  border-radius: 0.25rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ value: number; color?: string }>`
  width: ${(props) => `${props.value}%`};
  height: 100%;
  background-color: ${(props) => props.color || '#0d6efd'};
  border-radius: 0.25rem;
  transition: width 0.3s ease;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Label = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #212529;
`;

const Value = styled.span`
  font-size: 0.875rem;
  color: #6c757d;
`;

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  height?: string;
  color?: string;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = true,
  height,
  color,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <ProgressContainer>
      {(label || showValue) && (
        <ProgressLabel>
          {label && <Label>{label}</Label>}
          {showValue && <Value>{`${Math.round(percentage)}%`}</Value>}
        </ProgressLabel>
      )}
      <ProgressBar height={height}>
        <ProgressFill value={percentage} color={color} />
      </ProgressBar>
    </ProgressContainer>
  );
};

export default Progress;