import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../components/common';

const ServerErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background-color: #f8f9fa;
`;

const Title = styled.h1`
  font-size: 6rem;
  font-weight: 700;
  color: #dc3545;
  margin: 0;
  line-height: 1;
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #495057;
  margin: 1rem 0;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  margin: 0 0 2rem 0;
  max-width: 500px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const ServerError: React.FC = () => {
  return (
    <ServerErrorContainer>
      <Title>500</Title>
      <Subtitle>Internal Server Error</Subtitle>
      <Description>
        Something went wrong on our end. We're working to fix the issue.
        Please try again later.
      </Description>
      <ButtonGroup>
        <Button variant="primary" as={Link} to="/">
          Go to Homepage
        </Button>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </ButtonGroup>
    </ServerErrorContainer>
  );
};

export default ServerError;