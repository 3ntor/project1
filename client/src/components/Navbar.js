import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageToggle from './LanguageToggle';
import './Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, isAdmin, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const currentLanguage = i18n.language;

  return (
    <nav className={`navbar ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          {t('navbar.brand')}
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>
            {t('navbar.home')}
          </Link>
          <Link to="/services" className="nav-link" onClick={closeMenu}>
            {t('navbar.services')}
          </Link>
          <Link to="/doctor" className="nav-link" onClick={closeMenu}>
            {t('navbar.doctor')}
          </Link>
          <Link to="/blog" className="nav-link" onClick={closeMenu}>
            {t('navbar.blog')}
          </Link>
          <Link to="/faq" className="nav-link" onClick={closeMenu}>
            {t('navbar.faq')}
          </Link>
          <Link to="/contact" className="nav-link" onClick={closeMenu}>
            {t('navbar.contact')}
          </Link>
          
          {isAuthenticated() && !isAdmin && (
            <Link to="/booking" className="nav-link nav-booking" onClick={closeMenu}>
              {t('navbar.booking')}
            </Link>
          )}

          {isAuthenticated() ? (
            <div className="nav-auth">
              {isAdmin && (
                <Link to="/admin" className="nav-link nav-admin" onClick={closeMenu}>
                  {t('navbar.dashboard')}
                </Link>
              )}
              <span className="nav-user-name">
                {user?.name || user?.email}
              </span>
              <button className="nav-link nav-logout" onClick={handleLogout}>
                {t('navbar.logout')}
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-link" onClick={closeMenu}>
                {t('navbar.login')}
              </Link>
              <Link to="/signup" className="nav-link nav-signup" onClick={closeMenu}>
                {t('navbar.signup')}
              </Link>
            </div>
          )}
        </div>

        <div className="nav-controls">
          <LanguageToggle />
          <div className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;