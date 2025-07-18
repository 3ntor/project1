import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import './SignUp.css';

const SignUp = () => {
  const { t, i18n } = useTranslation();
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentLanguage = i18n.language;

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError(t('auth.signup.errors.required'));
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setLoading(false);
      return;
    }

    try {
      const result = await signup(formData);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'حدث خطأ أثناء إنشاء الحساب');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`signup-page ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h2>{t('auth.signup.title')}</h2>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="name">{t('auth.signup.name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={t('auth.signup.name')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('auth.signup.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t('auth.signup.email')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">{t('auth.signup.phone')}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder={t('auth.signup.phone')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('auth.signup.password')}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder={t('auth.signup.password')}
                minLength="6"
              />
            </div>

            <button
              type="submit"
              className="signup-button"
              disabled={loading}
            >
              {loading ? t('common.loading') : t('auth.signup.submit')}
            </button>
          </form>

          <div className="signup-footer">
            <p>
              {t('auth.signup.haveAccount')}{' '}
              <Link to="/login" className="login-link">
                {t('auth.signup.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
