import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaGlobe } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage, isRTL } = useLanguage();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <h2>{t('clinicName', language)}</h2>
        </Link>
        
        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('home', language)}
          </Link>
          <Link 
            to="/services" 
            className={`navbar-link ${isActive('/services') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('services', language)}
          </Link>
          <Link 
            to="/about" 
            className={`navbar-link ${isActive('/about') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('about', language)}
          </Link>
          <Link 
            to="/doctor" 
            className={`navbar-link ${isActive('/doctor') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('doctor', language)}
          </Link>
          <Link 
            to="/blog" 
            className={`navbar-link ${isActive('/blog') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('blog', language)}
          </Link>
          <Link 
            to="/faq" 
            className={`navbar-link ${isActive('/faq') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('faq', language)}
          </Link>
          <Link 
            to="/contact" 
            className={`navbar-link ${isActive('/contact') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('contact', language)}
          </Link>
          <Link 
            to="/book-appointment" 
            className="btn btn-primary"
            onClick={closeMenu}
          >
            {t('bookAppointment', language)}
          </Link>
          
          {/* Language Toggle Button */}
          <button 
            className="language-toggle"
            onClick={toggleLanguage}
            title={t('switchLanguage', language)}
          >
            <FaGlobe />
            <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>
        </div>
        
        <div className="navbar-toggle" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;