import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import ZaloIcon from '@mui/icons-material/Chat'; // dùng icon chat đại diện cho Zalo
import { theme } from '../../shared/styles/theme';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.35);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 #0288d133;
  padding: 40px 32px 32px 32px;
  min-width: 340px;
  max-width: 95vw;
  width: 400px;
  position: relative;
  animation: ${fadeIn} 0.25s cubic-bezier(.4,0,.2,1);
  @media (max-width: 500px) {
    width: 95vw;
    min-width: unset;
    padding: 24px 8px 16px 8px;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: transparent;
  border: none;
  color: #0288d1;
  font-size: 2rem;
  cursor: pointer;
`;

const Title = styled.h2`
  text-align: center;
  color: #0288d1;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 16px;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const InputLabel = styled.label`
  font-size: 1rem;
  color: #0288d1;
  font-weight: 500;
  margin-bottom: 4px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid #b2ebf2;
  font-size: 1rem;
  margin-bottom: 4px;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border: 1.5px solid #0288d1;
    box-shadow: 0 0 0 2px #b2ebf2;
  }
`;

const ErrorText = styled.div`
  color: #e53935;
  font-size: 0.95rem;
  min-height: 20px;
  margin-bottom: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 12px;
`;

const AuthButton = styled.button<{ color: string }>`
  width: 100%;
  padding: 14px 0;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  background: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 2px 8px 0 ${({ color }) => color}44;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, filter 0.2s;
  &:hover {
    filter: brightness(1.08) drop-shadow(0 0 8px ${({ color }) => color}33);
    box-shadow: 0 4px 16px 0 ${({ color }) => color}55;
  }
`;

const Divider = styled.div`
  text-align: center;
  color: #bdbdbd;
  margin: 18px 0 10px 0;
  font-size: 1rem;
  position: relative;
  &:before, &:after {
    content: '';
    display: inline-block;
    width: 40%;
    height: 1px;
    background: #e0e0e0;
    vertical-align: middle;
    margin: 0 8px;
  }
`;

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: (userInfo: { id: string; name: string; email: string }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      emailRef.current?.focus();
    }, 200);
  }, []);

  // Dummy handlers (tích hợp thực tế sau)
  const handleEmailLogin = async () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (!email || !password) {
        setError('Vui lòng nhập đầy đủ thông tin.');
      } else if (!email.includes('@')) {
        setError('Email không hợp lệ.');
      } else if (password.length < 4) {
        setError('Mật khẩu quá ngắn.');
      } else {
        setError('');
        if (onSuccess) {
          onSuccess({ id: '1', name: email.split('@')[0], email });
        }
        onClose();
        // show toast "Đăng nhập thành công"
      }
      setLoading(false);
    }, 900);
  };

  const handleFacebook = () => {
    // Tích hợp OAuth2 Facebook ở đây
    if (onSuccess) {
      onSuccess({ id: 'fb1', name: 'Facebook User', email: 'fbuser@example.com' });
    }
    onClose();
  };
  const handleGoogle = () => {
    // Tích hợp OAuth2 Google ở đây
    if (onSuccess) {
      onSuccess({ id: 'gg1', name: 'Google User', email: 'gguser@example.com' });
    }
    onClose();
  };
  const handleZalo = () => {
    // Tích hợp OAuth2 Zalo ở đây
    if (onSuccess) {
      onSuccess({ id: 'zalo1', name: 'Zalo User', email: 'zalouser@example.com' });
    }
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalBox>
        <CloseBtn onClick={onClose}>
          <CloseIcon fontSize="large" />
        </CloseBtn>
        <Title>Đăng nhập tài khoản</Title>
        <InputGroup>
          <InputLabel htmlFor="email">Email hoặc Số điện thoại</InputLabel>
          <Input
            id="email"
            ref={emailRef}
            type="text"
            placeholder="Nhập email hoặc số điện thoại..."
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
            disabled={loading}
          />
        </InputGroup>
        <InputGroup>
          <InputLabel htmlFor="password">Mật khẩu</InputLabel>
          <Input
            id="password"
            type="password"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={loading}
          />
        </InputGroup>
        <ErrorText>{error}</ErrorText>
        <ButtonGroup>
          <AuthButton color="#0288d1" onClick={handleEmailLogin} disabled={loading}>
            <EmailIcon /> Đăng nhập bằng Email
          </AuthButton>
          <AuthButton color="#1877f3" onClick={handleFacebook} disabled={loading}>
            <FacebookIcon /> Đăng nhập bằng Facebook
          </AuthButton>
          <AuthButton color="#ea4335" onClick={handleGoogle} disabled={loading}>
            <GoogleIcon /> Đăng nhập bằng Google
          </AuthButton>
          <AuthButton color="#0084ff" onClick={handleZalo} disabled={loading}>
            <ZaloIcon /> Đăng nhập bằng Zalo
          </AuthButton>
        </ButtonGroup>
        <Divider>Hoặc</Divider>
        <ButtonGroup>
          <AuthButton color="#43a047" onClick={() => alert('Đăng ký nhanh (tích hợp sau)')}>
            <PhoneAndroidIcon /> Đăng ký nhanh
          </AuthButton>
        </ButtonGroup>
      </ModalBox>
    </Overlay>
  );
};

export default AuthModal;