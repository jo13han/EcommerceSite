'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  sessionId: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setToken: (token: string | null) => void;
  setSessionId: (sessionId: string | null) => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Check for token and sessionId in localStorage on mount
    const storedToken = localStorage.getItem('token');
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedToken) {
      setToken(storedToken);
      if (storedSessionId) setSessionId(storedSessionId);
      // Fetch user data
      api.get('/api/auth/me')
      .then(res => {
        setUser(res.data.user);
      })
      .catch(() => {
        // If token is invalid, clear everything
        localStorage.removeItem('token');
        localStorage.removeItem('sessionId');
        setToken(null);
        setSessionId(null);
        setUser(null);
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    const { token, sessionId, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('sessionId', sessionId);
    setToken(token);
    setSessionId(sessionId);
    setUser(user);
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = await api.post('/api/auth/signup', { name, email, password });
    const { token, sessionId, user } = response.data;
    localStorage.setItem('token', token);
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
      setSessionId(sessionId);
    } else {
      localStorage.removeItem('sessionId');
      setSessionId(null);
    }
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('sessionId');
    setToken(null);
    setSessionId(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, sessionId, login, signup, logout, setToken, setSessionId, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 