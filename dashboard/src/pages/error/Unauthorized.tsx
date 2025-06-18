import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../components/common';

const UnauthorizedContainer = styled.div`
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

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Unauthorized: React.FC = () => {
  return (
    <UnauthorizedContainer>
      <Title>403</Title>
      <Subtitle>Access Denied</Subtitle>
      <Description>
        You don't have permission to access this page. Please contact your
        administrator if you believe this is a mistake.
      </Description>
      <ButtonGroup>
        <StyledLink to="/">
          <Button variant="primary">
            Go to Homepage
          </Button>
        </StyledLink>
        <StyledLink to="/login">
          <Button variant="secondary">
            Back to Login
          </Button>
        </StyledLink>
      </ButtonGroup>
    </UnauthorizedContainer>
  );
};

export default Unauthorized;