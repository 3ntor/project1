import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      const savedIsAdmin = localStorage.getItem('isAdmin') === 'true';

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsAdmin(savedIsAdmin);
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password, userType = 'user') => {
    try {
      const endpoint = userType === 'admin' ? '/api/auth/admin/login' : '/api/auth/login';
      const response = await axios.post(endpoint, { email, password });
      
      const { token: newToken, user: userData, userType: responseUserType } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      if (responseUserType === 'admin' || userType === 'admin') {
        // Admin login
        setIsAdmin(true);
        setUser({ email, role: 'admin' });
        localStorage.setItem('user', JSON.stringify({ email, role: 'admin' }));
        localStorage.setItem('isAdmin', 'true');
      } else {
        // Regular user login
        setIsAdmin(false);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAdmin', 'false');
      }
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true, user: userData, isAdmin: responseUserType === 'admin' || userType === 'admin' };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول';
      return { success: false, message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token: newToken, user: newUser } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('isAdmin', 'false');
      
      setToken(newToken);
      setUser(newUser);
      setIsAdmin(false);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Signup error:', error);
      const message = error.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب';
      return { success: false, message };
    }
  };

  const logout = () => {
    // Clear all stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    
    // Clear state
    setToken(null);
    setUser(null);
    setIsAdmin(false);
    
    // Clear axios header
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const isAdminUser = () => {
    return isAuthenticated() && isAdmin;
  };

  const value = {
    user,
    isAdmin,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
    isAdminUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
