import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Check for selected service from localStorage on component mount
  React.useEffect(() => {
    const storedService = localStorage.getItem('selectedService');
    if (storedService) {
      const service = JSON.parse(storedService);
      setSelectedService(service);
      setFormData(prev => ({
        ...prev,
        subject: t('contact.subject', { serviceName: service.name }),
        message: t('contact.message', { 
          serviceName: service.name,
          price: service.price,
          duration: service.duration,
          message: prev.message
        })
      }));
      localStorage.removeItem('selectedService'); // Clear after using
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setError('There was an error sending your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: 'Phone',
      info: '+1 (555) 123-4567',
      description: 'Call us during business hours'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      info: 'info@nafsiatak.com',
      description: 'Send us an email anytime'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Address',
      info: '123 Therapy Street, Wellness City, WC 12345',
      description: 'Visit our clinic'
    },
    {
      icon: <FaClock />,
      title: 'Hours',
      info: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
      description: 'Sunday: Closed'
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with us. We're here to help and answer any questions you may have.</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section">
        <div className="container">
          <div className="contact-content">
            {/* Contact Information */}
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p>We're here to help you on your mental health journey. Reach out to us through any of the following methods.</p>
              
              <div className="contact-cards">
                {contactInfo.map((item, index) => (
                  <div key={index} className="contact-card">
                    <div className="contact-icon">{item.icon}</div>
                    <div className="contact-details">
                      <h3>{item.title}</h3>
                      <p className="contact-info-main">{item.info}</p>
                      <p className="contact-info-desc">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>
              
              {/* Selected Service Details */}
              {selectedService && (
                <div className="selected-service-details">
                  <h4>الخدمة المختارة:</h4>
                  <div className="service-info-card">
                    <h5>{selectedService.name}</h5>
                    <p>{selectedService.description}</p>
                    <div className="service-meta">
                      <span className="service-price">السعر: {selectedService.price} جنيه</span>
                      <span className="service-duration">المدة: {selectedService.duration}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="success-message">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section map-section">
        <div className="container">
          <div className="section-title">
            <h2>Find Us</h2>
            <p>Visit our clinic for in-person consultations and therapy sessions.</p>
          </div>
          <div className="map-container">
            <div className="map-placeholder">
              <div className="map-content">
                <h3>Nafsiatak Clinic</h3>
                <p>123 Therapy Street<br />Wellness City, WC 12345</p>
                <p><strong>Hours:</strong> Mon-Fri: 9AM-6PM, Sat: 10AM-4PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;