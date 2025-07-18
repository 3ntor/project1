import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await login({
        email: formData.email,
        password: formData.password
      });

      // Store token and user type
      localStorage.setItem('token', response.token);
      localStorage.setItem('userType', response.userType);

      // Redirect based on user type
      if (response.userType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError(error.message || t('login.error.invalid'));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box login-box">
        <h2>{t('login.title')}</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('login.email')}</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('login.password')}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">{t('login.submit')}</button>
        </form>

        <div className="signup-container">
          <p>{t('login.noAccount')}</p>
          <Link to="/signup" className="btn btn-outline-primary">{t('login.signUp')}</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
