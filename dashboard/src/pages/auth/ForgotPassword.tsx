import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Button, Input } from '../../components/common';
import { useToast } from '../../hooks/useToast';

const ForgotPasswordContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f8f9fa;
`;

const ForgotPasswordCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
`;

const Title = styled.h1`
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: #212529;
  text-align: center;
`;

const Description = styled.p`
  margin: 0 0 1.5rem 0;
  color: #6c757d;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: #495057;
  font-weight: 500;
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: #dc3545;
  font-size: 0.875rem;
`;

const LoginLink = styled.p`
  margin: 1rem 0 0 0;
  text-align: center;
  font-size: 0.875rem;
  color: #6c757d;

  a {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ForgotPassword: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      // Here you would typically make an API call to send the reset password email
      setIsSubmitted(true);
      showToast('Password reset instructions sent to your email', 'success');
    } catch (error) {
      showToast('Failed to send reset instructions. Please try again.', 'error');
    }
  };

  if (isSubmitted) {
    return (
      <ForgotPasswordContainer>
        <ForgotPasswordCard>
          <Title>Check Your Email</Title>
          <Description>
            We've sent password reset instructions to your email address. Please
            check your inbox and follow the link to reset your password.
          </Description>
          <LoginLink>
            Remember your password? <Link to="/login">Log in</Link>
          </LoginLink>
        </ForgotPasswordCard>
      </ForgotPasswordContainer>
    );
  }

  return (
    <ForgotPasswordContainer>
      <ForgotPasswordCard>
        <Title>Forgot Password</Title>
        <Description>
          Enter your email address and we'll send you instructions to reset your
          password.
        </Description>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={!!error}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </FormGroup>

          <Button type="submit" variant="primary">
            Send Reset Instructions
          </Button>
        </Form>

        <LoginLink>
          Remember your password? <Link to="/login">Log in</Link>
        </LoginLink>
      </ForgotPasswordCard>
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword;