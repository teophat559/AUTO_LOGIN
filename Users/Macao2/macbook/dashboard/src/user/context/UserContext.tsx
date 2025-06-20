import React, { createContext, useContext, useState } from 'react';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: (user: UserInfo) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const isAuthenticated = !!user;

  const login = (userInfo: UserInfo) => {
    setUser(userInfo);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
};