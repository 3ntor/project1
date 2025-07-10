import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaAward, FaHeart, FaUsers } from 'react-icons/fa';
import './About.css';

const About = () => {
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
          <h1>About Lyna Psychology</h1>
          <p>Dedicated to providing compassionate, evidence-based psychological care for individuals, couples, and families.</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>At Lyna Psychology, we believe that everyone deserves access to high-quality mental health care. Our mission is to provide compassionate, evidence-based psychological services that empower individuals to overcome challenges, heal from trauma, and achieve their full potential.</p>
              <p>We are committed to creating a safe, supportive environment where clients feel heard, understood, and valued. Our team of experienced professionals uses the latest research and therapeutic techniques to help you navigate life's challenges and build resilience.</p>
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
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section team-section">
        <div className="container">
          <div className="section-title">
            <h2>Meet Our Team</h2>
            <p>Our experienced team of licensed psychologists and therapists are here to support your mental health journey.</p>
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
            <h2>Our Values</h2>
            <p>The principles that guide our practice and shape our approach to mental health care.</p>
          </div>
          
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon"><FaHeart /></div>
              <h3>Compassion</h3>
              <p>We approach every client with empathy, understanding, and genuine care for their well-being.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FaGraduationCap /></div>
              <h3>Excellence</h3>
              <p>We maintain the highest standards of professional practice and continuous learning.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FaAward /></div>
              <h3>Integrity</h3>
              <p>We uphold the highest ethical standards and maintain complete confidentiality.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FaUsers /></div>
              <h3>Collaboration</h3>
              <p>We work together with clients to develop personalized treatment plans and goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Take the first step towards better mental health with our experienced team.</p>
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