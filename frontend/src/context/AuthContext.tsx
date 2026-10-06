import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User, Wallet } from '../types';

interface AuthContextType {
  user: User | null;
  wallet: Wallet | null;
  token: string | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  refreshWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('timebank_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch {
      logout();
    }
  };

  const refreshWallet = async () => {
    try {
      const res = await api.get('/wallet');
      setWallet(res.data);
    } catch (err) {
      console.error('Failed to fetch wallet:', err);
    }
  };

  useEffect(() => {
    if (token) {
      Promise.all([refreshUser(), refreshWallet()]).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('timebank_token', newToken);
    setToken(newToken);
    setUser(userData);
    refreshWallet();
  };

  const logout = () => {
    localStorage.removeItem('timebank_token');
    setToken(null);
    setUser(null);
    setWallet(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, wallet, token, loading, login, logout, refreshUser, refreshWallet }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
