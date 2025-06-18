import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Button, Input } from '../../components/common';
import { useToast } from '../../hooks/useToast';

const ResetPasswordContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f8f9fa;
`;

const ResetPasswordCard = styled(Card)`
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

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const token = searchParams.get('token');
  if (!token) {
    return (
      <ResetPasswordContainer>
        <ResetPasswordCard>
          <Title>Invalid Reset Link</Title>
          <Description>
            This password reset link is invalid or has expired. Please request a
            new password reset link.
          </Description>
          <LoginLink>
            <Link to="/forgot-password">Request New Reset Link</Link>
          </LoginLink>
        </ResetPasswordCard>
      </ResetPasswordContainer>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Here you would typically make an API call to reset the password
      showToast('Password has been reset successfully', 'success');
      navigate('/login');
    } catch (error) {
      showToast('Failed to reset password. Please try again.', 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <ResetPasswordContainer>
      <ResetPasswordCard>
        <Title>Reset Password</Title>
        <Description>
          Please enter your new password below. Make sure it's at least 8
          characters long.
        </Description>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
            )}
          </FormGroup>

          <Button type="submit" variant="primary">
            Reset Password
          </Button>
        </Form>

        <LoginLink>
          Remember your password? <Link to="/login">Log in</Link>
        </LoginLink>
      </ResetPasswordCard>
    </ResetPasswordContainer>
  );
};

export default ResetPassword;