import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const { t, i18n } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentLanguage = i18n.language;

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError(t('auth.login.errors.required'));
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password, formData.userType);
      
      if (result.success) {
        // Redirect based on user type
        if (result.isAdmin) {
          navigate('/admin');
        } else {
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        }
      } else {
        setError(result.message || t('auth.login.errors.invalid'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t('auth.login.errors.invalid'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-page ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>{t('auth.login.title')}</h2>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">{t('auth.login.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t('auth.login.email')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('auth.login.password')}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder={t('auth.login.password')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="userType">نوع المستخدم / User Type</label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
              >
                <option value="user">مستخدم / User</option>
                <option value="admin">مدير / Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? t('common.loading') : t('auth.login.submit')}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {t('auth.login.noAccount')}{' '}
              <Link to="/signup" className="signup-link">
                {t('auth.login.signUp')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
