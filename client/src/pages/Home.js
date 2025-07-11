import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaUsers, FaBrain, FaShieldAlt, FaClock, FaStar } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import './Home.css';

const Home = () => {
  const { language } = useLanguage();
  
  const features = [
    {
      icon: <FaHeart />,
      title: language === 'ar' ? 'رعاية متعاطفة' : 'Compassionate Care',
      description: language === 'ar' 
        ? 'نقدم رعاية دافئة ومتعاطفة في بيئة آمنة وداعمة.'
        : 'We provide warm, empathetic care in a safe and supportive environment.'
    },
    {
      icon: <FaUsers />,
      title: language === 'ar' ? 'فريق متخصص' : 'Expert Team',
      description: language === 'ar'
        ? 'أخصائيونا النفسيون المرخصون لديهم سنوات من الخبرة في مختلف النهج العلاجية.'
        : 'Our licensed psychologists have years of experience in various therapeutic approaches.'
    },
    {
      icon: <FaBrain />,
      title: language === 'ar' ? 'مبني على الأدلة' : 'Evidence-Based',
      description: language === 'ar'
        ? 'نستخدم طرقاً علمية مثبتة لمساعدتك في تحقيق تغيير إيجابي دائم.'
        : 'We use scientifically proven methods to help you achieve lasting positive change.'
    },
    {
      icon: <FaShieldAlt />,
      title: language === 'ar' ? 'سري' : 'Confidential',
      description: language === 'ar'
        ? 'خصوصيتك وسريتك هي أولوياتنا القصوى.'
        : 'Your privacy and confidentiality are our top priorities.'
    }
  ];

  const testimonials = [
    {
      name: language === 'ar' ? 'سارة أحمد' : 'Sarah Johnson',
      text: language === 'ar' 
        ? 'ساعدتني عيادة نفسيتك في التغلب على القلق وإيجاد السلام الداخلي. المعالجون رائعون حقاً.'
        : 'Nafseetak Clinic helped me overcome my anxiety and find inner peace. The therapists are truly amazing.',
      rating: 5
    },
    {
      name: language === 'ar' ? 'محمد علي' : 'Michael Chen',
      text: language === 'ar'
        ? 'مهنيون، متعاطفون وفعالون. أنصح بشدة بخدماتهم لأي شخص يسعى للصحة النفسية.'
        : 'Professional, caring, and effective. I highly recommend their services for anyone seeking mental wellness.',
      rating: 5
    },
    {
      name: language === 'ar' ? 'فاطمة محمد' : 'Emily Rodriguez',
      text: language === 'ar'
        ? 'جلسات العلاج الأسري جعلت عائلتنا أقرب لبعضها. نحن ممتنون جداً لدعمهم.'
        : 'The family therapy sessions have brought our family closer together. We\'re so grateful for their support.',
      rating: 5
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>{t('heroTitle', language)}</h1>
          <p>{t('heroDescription', language)}</p>
          <div className="hero-buttons">
            <Link to="/book-appointment" className="btn btn-primary">{t('getStarted', language)}</Link>
            <Link to="/services" className="btn btn-secondary">{t('learnMore', language)}</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose Lyna Psychology?</h2>
            <p>We are committed to providing the highest quality psychological care in a supportive and professional environment.</p>
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
            <h2>What Our Clients Say</h2>
            <p>Real stories from people who have transformed their lives with our help.</p>
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
            <h2>Ready to Start Your Healing Journey?</h2>
            <p>Take the first step towards better mental health and well-being. Book your appointment today.</p>
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

export default Home;