import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('campushub_token');
    if (token) {
      api.get('/auth/me')
        .then(res => {
          if (res.success) {
            setUser(res.user);
          } else {
            logout();
          }
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success) {
      localStorage.setItem('campushub_token', res.token);
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.success) {
      localStorage.setItem('campushub_token', res.token);
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const loginDemo = async (role) => {
    let email = 'student@campushub.demo';
    let password = 'Student@123';

    if (role === 'faculty') {
      email = 'faculty@campushub.demo';
      password = 'Faculty@123';
    } else if (role === 'admin') {
      email = 'admin@campushub.demo';
      password = 'Admin@123';
    }

    return await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('campushub_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
