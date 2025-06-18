import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoutes: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, user, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleMenuClick = (key: string) => {
    setActive(key);
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      navigate(`/admin/${key}`);
    }
  };

  return (
    <div>
      {/* Admin routes content */}
    </div>
  );
};

export default AdminRoutes;