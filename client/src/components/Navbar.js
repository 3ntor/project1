import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes } from 'react-icons/fa';
import LanguageToggle from './LanguageToggle';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

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
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand-container">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <h2>Nafsiatak</h2>
          </Link>
        </div>
        
        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('navbar.home')}
          </Link>
          <Link 
            to="/services" 
            className={`navbar-link ${isActive('/services') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('navbar.services')}
          </Link>
          <Link 
            to="/about" 
            className={`navbar-link ${isActive('/about') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('navbar.about')}
          </Link>
          <Link 
            to="/doctor" 
            className={`navbar-link ${isActive('/doctor') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('navbar.doctor')}
          </Link>
          <Link 
            to="/blog" 
            className={`navbar-link ${isActive('/blog') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('navbar.blog')}
          </Link>
          <Link 
            to="/faq" 
            className={`navbar-link ${isActive('/faq') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('navbar.faq')}
          </Link>
          <Link 
            to="/contact" 
            className={`navbar-link ${isActive('/contact') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {t('navbar.contact')}
          </Link>
          <Link 
            to="/book-appointment" 
            className="btn btn-primary"
          >
            {t('BookNow')}
          </Link>
          <Link 
            to="/login" 
            className="btn btn-primary"
          >
            {t('navbar.login')}
          </Link>
          <LanguageToggle />
        </div>
        
        <div className="navbar-toggle" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;