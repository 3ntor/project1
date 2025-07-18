import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, signup } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // هنا يمكنك إضافة المنطق للتحقق من حالة تسجيل الدخول
    // مثلاً من localStorage أو من الخادم
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // يمكنك هنا إضافة المنطق لجلب بيانات المستخدم من الخادم
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await signup(userData);
      await login({
        email: userData.email,
        password: userData.password
      });
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw {
        message: error.message,
        status: error.status
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
