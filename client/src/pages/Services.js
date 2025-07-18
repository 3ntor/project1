import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaClock, FaUsers, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([{
    id: 1,
    title: 'Individual Therapy',
    description: 'One-on-one therapy sessions tailored to your specific needs and goals.',
    icon: '👤',
    duration: '50-60 minutes',
    price: 150
  }, {
    id: 2,
    title: 'Couples Therapy',
    description: 'Specialized therapy for couples to improve communication and strengthen relationships.',
    icon: '💑',
    duration: '80-90 minutes',
    price: 200
  }, {
    id: 3,
    title: 'Family Therapy',
    description: 'Therapy sessions for families to improve communication and resolve conflicts.',
    icon: '👨‍👩‍👧‍👦',
    duration: '90-120 minutes',
    price: 250
  }]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services');
        setServices(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="services-page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="hero services-hero">
        <div className="container">
        <h1>Our Services</h1>
        <p>Comprehensive psychological services tailored to your unique needs and goals.</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Professional Services</h2>
            <p>Comprehensive psychological services tailored to your unique needs and goals.</p>
          </div>
          
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-header">
                  <div className="service-icon">{service.icon}</div>
                  <h3>{t(`${service.title.toLowerCase()}`)}</h3>
                </div>
                <div className="service-content">
                  <p className="service-description">
                    {t(`services.types.${service.title.toLowerCase()}.description`, { defaultValue: service.description })}
                  </p>
                  <div className="service-details">
                    <div className="service-detail">
                      <FaClock />
                      <span>{t('services duration', { duration: service.duration })}</span>
                    </div>
                    <div className="service-price">
                      <span>{t('services.price', { price: service.price })}</span>
                    </div>
                  </div>
                </div>
                <Link 
                  to={`/book-appointment?serviceId=${service.id}&serviceName=${encodeURIComponent(service.title)}`}
                  className="btn btn-primary"
                  onClick={() => {
                    localStorage.setItem('selectedService', JSON.stringify({
                      name: service.title,
                      description: service.description,
                      price: service.price,
                      duration: service.duration
                    }));
                  }}
                >
                  {t('BookNow')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-choose">
        <div className="container">
        <div className="section-title">
            <h2>Why Choose Our Services?</h2>
            <p>We are committed to providing the highest quality psychological care.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Personalized Approach</h3>
              <p>Every therapy session is tailored to your specific needs and goals.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔬</div>
              <h3>Evidence-Based</h3>
              <p>We use scientifically proven methods and techniques for effective results.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Supportive Environment</h3>
              <p>Create a safe, non-judgmental space where you can feel comfortable sharing.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Measurable Progress</h3>
              <p>Track your progress and celebrate your achievements along the way.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section process-section">
        <div className="container">
          <div className="section-title">
            <h2>How It Works</h2>
            <p>Your journey to mental wellness in simple steps.</p>
          </div>
          
          <div className="process-grid">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Initial Consultation</h3>
              <p>Schedule your first appointment and discuss your needs with our team.</p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>Assessment</h3>
              <p>We'll conduct a comprehensive assessment to understand your situation.</p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>Treatment Plan</h3>
              <p>Create a personalized treatment plan tailored to your goals.</p>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <h3>Ongoing Support</h3>
              <p>Receive consistent support and guidance throughout your journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Healing Journey?</h2>
            <p>Take the first step towards better mental health. Book your appointment today.</p>
            <div className="cta-buttons">
              <Link to="/book-appointment" className="btn btn-primary">Book Appointment</Link>
              <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;