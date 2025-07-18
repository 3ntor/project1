import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaGraduationCap, FaAward, FaHeart, FaUsers } from 'react-icons/fa';
import './About.css';

const About = () => {
  const { t } = useTranslation();
  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Clinical Psychologist',
      specialization: 'Anxiety, Depression, Trauma',
      experience: '15+ years',
      education: 'Ph.D. Clinical Psychology, Stanford University',
      image: '👩‍⚕️'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Family Therapist',
      specialization: 'Family Dynamics, Couples Therapy',
      experience: '12+ years',
      education: 'Ph.D. Marriage & Family Therapy, UCLA',
      image: '👨‍⚕️'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Child Psychologist',
      specialization: 'Child & Adolescent Therapy',
      experience: '10+ years',
      education: 'Ph.D. Child Psychology, Harvard University',
      image: '👩‍⚕️'
    }
  ];

  const stats = [
    { number: '500+', label: 'Clients Helped' },
    { number: '15+', label: 'Years Experience' },
    { number: '98%', label: 'Success Rate' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero about-hero">
        <div className="container">
          <h1>{t('about.title')}</h1>
          <p>{t('about.description')}</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>{t('about.mission.title')}</h2>'
              
              '
              <div className="bilingual-content">
                <div className="english-text">
                  <p>Our mission is to provide compassionate, evidence-based psychological services that empower individuals to overcome challenges, heal from trauma, and achieve their full potential.</p>
                  <p>We are committed to creating a safe, supportive environment where clients feel heard, understood, and valued. Our team of experienced professionals uses the latest research and therapeutic techniques to help you navigate life's challenges and build resilience.</p>
                </div>
                <div className="arabic-text">
                  <p>{t('about.mission.text1')}</p>
                  <p>{t('about.mission.text2')}</p>
                </div>
              </div>
            </div>
            <div className="mission-image">
              <div className="image-placeholder">🏥</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{t(`about.stats.${stat.label.toLowerCase().replace(/\s+/g, '')}`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section team-section">
        <div className="container">
          <div className="section-title">
            <h2>{t('about.team.title')}</h2>
            <p>{t('about.team.subtitle')}</p>
          </div>
          
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-image">{member.image}</div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-specialization"><strong>Specialization:</strong> {member.specialization}</p>
                  <p className="member-experience"><strong>Experience:</strong> {member.experience}</p>
                  <p className="member-education"><strong>Education:</strong> {member.education}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section values-section">
        <div className="container">
          <div className="section-title">
            <h2>{t('about.values.title')}</h2>
            <p>{t('about.values.description')}</p>
          </div>
          
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon"><FaHeart /></div>
              <h3>{t('about.values.compassion.title')}</h3>
              <p>{t('about.values.compassion.description')}</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FaGraduationCap /></div>
              <h3>{t('about.values.excellence.title')}</h3>
              <p>{t('about.values.excellence.description')}</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FaAward /></div>
              <h3>{t('about.values.integrity.title')}</h3>
              <p>{t('about.values.integrity.description')}</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FaUsers /></div>
              <h3>{t('about.values.collaboration.title')}</h3>
              <p>{t('about.values.collaboration.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{t('about.cta.title')}</h2>
            <p>{t('about.cta.description')}</p>
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

export default About;