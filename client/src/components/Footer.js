import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  return (
    <footer className={`footer ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand and Description */}
          <div className="footer-section">
            <h3 className="footer-brand">{t('footer.brand')}</h3>
            <p className="footer-description">
              {t('footer.description')}
            </p>
            <div className="social-media">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">{t('footer.quickLinks')}</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">{t('navbar.home')}</Link></li>
              <li><Link to="/services" className="footer-link">{t('navbar.services')}</Link></li>
              <li><Link to="/doctor" className="footer-link">{t('navbar.doctor')}</Link></li>
              <li><Link to="/blog" className="footer-link">{t('navbar.blog')}</Link></li>
              <li><Link to="/faq" className="footer-link">{t('navbar.faq')}</Link></li>
              <li><Link to="/contact" className="footer-link">{t('navbar.contact')}</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="footer-section">
            <h4 className="footer-title">{t('footer.contactInfo')}</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>{t('footer.address')}</span>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <div>
                  <div>{t('footer.phone')}</div>
                  <div>+20 987 654 3210</div>
                </div>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>{t('footer.email')}</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="footer-section">
            <h4 className="footer-title">{t('contact.info.hours.title')}</h4>
            <div className="working-hours">
              <div className="hours-item">
                <span>{t('contact.info.hours.weekdays')}</span>
              </div>
              <div className="hours-item">
                <span>{t('contact.info.hours.weekend')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <div className="copyright">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;