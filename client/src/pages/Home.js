import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaUsers, FaBrain, FaShieldAlt, FaClock, FaStar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: <FaHeart />,
      title: t('home.features.compassionateCare.title'),
      description: t('home.features.compassionateCare.description')
    },
    {
      icon: <FaUsers />,
      title: t('home.features.expertTeam.title'),
      description: t('home.features.expertTeam.description')
    },
    {
      icon: <FaBrain />,
      title: t('home.features.evidenceBased.title'),
      description: t('home.features.evidenceBased.description')
    },
    {
      icon: <FaShieldAlt />,
      title: t('home.features.confidential.title'),
      description: t('home.features.confidential.description')
    }
  ];

  const testimonials = [
    {
      name: t('home.testimonials.sarah.name'),
      text: t('home.testimonials.sarah.text'),
      rating: 5
    },
    {
      name: t('home.testimonials.michael.name'),
      text: t('home.testimonials.michael.text'),
      rating: 5
    },
    {
      name: t('home.testimonials.emily.name'),
      text: t('home.testimonials.emily.text'),
      rating: 5
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>{t('home.hero.title')}</h1>
          <p>{t('home.hero.subtitle')}</p>
          <div className="hero-buttons">
            <Link to="/book-appointment" className="btn btn-primary">{t('home.hero.bookSession')}</Link>
            <Link to="/services" className="btn btn-secondary">{t('home.hero.learnMore')}</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>{t('home.features.title')}</h2>
            <p>{t('home.features.subtitle')}</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section services-preview">
        <div className="container">
          <div className="section-title">
            <h2>Our Services</h2>
            <p>Comprehensive psychological services tailored to your unique needs and goals.</p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">👤</div>
              <h3>Individual Therapy</h3>
              <p>One-on-one therapy sessions to address personal challenges and promote growth.</p>
              <Link to="/services" className="btn btn-secondary">Learn More</Link>
            </div>
            <div className="service-card">
              <div className="service-icon">💑</div>
              <h3>Couples Therapy</h3>
              <p>Strengthen your relationship through effective communication and understanding.</p>
              <Link to="/services" className="btn btn-secondary">Learn More</Link>
            </div>
            <div className="service-card">
              <div className="service-icon">👨‍👩‍👧‍👦</div>
              <h3>Family Therapy</h3>
              <p>Improve family dynamics and resolve conflicts in a supportive environment.</p>
              <Link to="/services" className="btn btn-secondary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials">
        <div className="container">
          <div className="section-title">
            <h2>{t('home.testimonials.title')}</h2>
            <p>{t('home.testimonials.subtitle')}</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="star" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <h4 className="testimonial-name">- {testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{t('home.cta.title')}</h2>
            <p>{t('home.cta.subtitle')}</p>
            <div className="cta-buttons">
              <Link to="/book-appointment" className="btn btn-primary">{t('home.cta.bookAppointment')}</Link>
              <Link to="/contact" className="btn btn-secondary">{t('home.cta.contactUs')}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;