import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <h2>Lyna Psychology</h2>
        </Link>
        
        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link 
            to="/services" 
            className={`navbar-link ${isActive('/services') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Services
          </Link>
          <Link 
            to="/about" 
            className={`navbar-link ${isActive('/about') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            About
          </Link>
          <Link 
            to="/doctor" 
            className={`navbar-link ${isActive('/doctor') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            الدكتور
          </Link>
          <Link 
            to="/blog" 
            className={`navbar-link ${isActive('/blog') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            المدونة
          </Link>
          <Link 
            to="/faq" 
            className={`navbar-link ${isActive('/faq') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            الأسئلة الشائعة
          </Link>
          <Link 
            to="/contact" 
            className={`navbar-link ${isActive('/contact') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Contact
          </Link>
          <Link 
            to="/book-appointment" 
            className="btn btn-primary"
            onClick={closeMenu}
          >
            Book Appointment
          </Link>
        </div>
        
        <div className="navbar-toggle" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;