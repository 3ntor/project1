import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { FaClock, FaUsers, FaHeart, FaBrain, FaShieldAlt } from 'react-icons/fa';
import './Services.css';

const Services = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const currentLanguage = i18n.language;

  // 5 Psychological Therapy Services
  const services = [
    {
      id: 'individual',
      name: t('services.individual.name'),
      description: t('services.individual.description'),
      image: '/images/individual-therapy.jpg',
      icon: <FaUsers className="service-icon" />,
      duration: '50-60 min',
      features: [
        t('services.individual.features.0'),
        t('services.individual.features.1'),
        t('services.individual.features.2')
      ]
    },
    {
      id: 'couples',
      name: t('services.couples.name'),
      description: t('services.couples.description'),
      image: '/images/couples-therapy.jpg',
      icon: <FaHeart className="service-icon" />,
      duration: '80-90 min',
      features: [
        t('services.couples.features.0'),
        t('services.couples.features.1'),
        t('services.couples.features.2')
      ]
    },
    {
      id: 'family',
      name: t('services.family.name'),
      description: t('services.family.description'),
      image: '/images/family-therapy.jpg',
      icon: <FaUsers className="service-icon" />,
      duration: '90-120 min',
      features: [
        t('services.family.features.0'),
        t('services.family.features.1'),
        t('services.family.features.2')
      ]
    },
    {
      id: 'anxiety',
      name: t('services.anxiety.name'),
      description: t('services.anxiety.description'),
      image: '/images/anxiety-therapy.jpg',
      icon: <FaShieldAlt className="service-icon" />,
      duration: '50-60 min',
      features: [
        t('services.anxiety.features.0'),
        t('services.anxiety.features.1'),
        t('services.anxiety.features.2')
      ]
    },
    {
      id: 'depression',
      name: t('services.depression.name'),
      description: t('services.depression.description'),
      image: '/images/depression-therapy.jpg',
      icon: <FaBrain className="service-icon" />,
      duration: '50-60 min',
      features: [
        t('services.depression.features.0'),
        t('services.depression.features.1'),
        t('services.depression.features.2')
      ]
    }
  ];

  const handleBookNow = (service) => {
    if (!isAuthenticated()) {
      // Redirect to login with return path
      navigate('/login', { 
        state: { 
          from: { pathname: '/booking' },
          selectedService: service.id
        } 
      });
    } else {
      // Navigate to booking page with pre-filled service
      navigate('/booking', { 
        state: { 
          selectedService: service.id,
          serviceName: service.name
        } 
      });
    }
  };

  return (
    <div className={`services-page ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <section className="services-hero">
        <div className="hero-content">
          <div className="container">
            <h1 className="hero-title">{t('services.hero.title')}</h1>
            <p className="hero-subtitle">{t('services.hero.subtitle')}</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">5</span>
                <span className="stat-label">{t('services.hero.stats.services')}</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">{t('services.hero.stats.clients')}</span>
              </div>
              <div className="stat">
                <span className="stat-number">98%</span>
                <span className="stat-label">{t('services.hero.stats.satisfaction')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('services.title')}</h2>
            <p className="section-subtitle">{t('services.subtitle')}</p>
          </div>
          
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-image">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="service-image-placeholder" style={{ display: 'none' }}>
                    {service.icon}
                  </div>
                  <div className="service-overlay">
                    <div className="service-duration">
                      <FaClock className="duration-icon" />
                      <span>{service.duration}</span>
                    </div>
                  </div>
                </div>
                
                <div className="service-content">
                  <h3 className="service-name">{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                  
                  <ul className="service-features">
                    {service.features.map((feature, index) => (
                      <li key={index} className="feature-item">
                        <span className="feature-bullet">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    className="book-now-btn"
                    onClick={() => handleBookNow(service)}
                  >
                    {t('services.bookNow')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('services.whyChoose.title')}</h2>
            <p className="section-subtitle">{t('services.whyChoose.subtitle')}</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>{t('services.whyChoose.features.personalized.title')}</h3>
              <p>{t('services.whyChoose.features.personalized.description')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔬</div>
              <h3>{t('services.whyChoose.features.evidenceBased.title')}</h3>
              <p>{t('services.whyChoose.features.evidenceBased.description')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>{t('services.whyChoose.features.supportive.title')}</h3>
              <p>{t('services.whyChoose.features.supportive.description')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>{t('services.whyChoose.features.measurable.title')}</h3>
              <p>{t('services.whyChoose.features.measurable.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('services.process.title')}</h2>
            <p className="section-subtitle">{t('services.process.subtitle')}</p>
          </div>
          
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>{t('services.process.steps.consultation.title')}</h3>
              <p>{t('services.process.steps.consultation.description')}</p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>{t('services.process.steps.assessment.title')}</h3>
              <p>{t('services.process.steps.assessment.description')}</p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>{t('services.process.steps.treatment.title')}</h3>
              <p>{t('services.process.steps.treatment.description')}</p>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <h3>{t('services.process.steps.support.title')}</h3>
              <p>{t('services.process.steps.support.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{t('services.cta.title')}</h2>
            <p>{t('services.cta.subtitle')}</p>
            <div className="cta-buttons">
              <Link to="/booking" className="btn btn-primary">
                {t('services.cta.bookButton')}
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                {t('services.cta.contactButton')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;