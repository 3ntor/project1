import React, { useState, useEffect } from 'react';
import { FaCalendar, FaClock, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import './BookAppointment.css';

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: ''
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fallback services if API fails
  const fallbackServices = [
    {
      id: 1,
      title: 'Individual Therapy',
      description: 'One-on-one therapy sessions tailored to your specific needs and goals.',
      icon: '👤',
      duration: '50-60 minutes',
      price: '$150 per session'
    },
    {
      id: 2,
      title: 'Couples Therapy',
      description: 'Specialized therapy for couples to improve communication and strengthen relationships.',
      icon: '💑',
      duration: '80-90 minutes',
      price: '$200 per session'
    },
    {
      id: 3,
      title: 'Family Therapy',
      description: 'Family-focused therapy to address conflicts and improve family dynamics.',
      icon: '👨‍👩‍👧‍👦',
      duration: '80-90 minutes',
      price: '$200 per session'
    },
    {
      id: 4,
      title: 'Child Therapy',
      description: 'Specialized therapy for children and adolescents using age-appropriate techniques.',
      icon: '🧒',
      duration: '45-50 minutes',
      price: '$120 per session'
    },
    {
      id: 5,
      title: 'Group Therapy',
      description: 'Therapeutic groups for shared experiences and peer support.',
      icon: '👥',
      duration: '90 minutes',
      price: '$80 per session'
    },
    {
      id: 6,
      title: 'Assessment',
      description: 'Comprehensive psychological assessments and evaluations.',
      icon: '📋',
      duration: '2-3 hours',
      price: '$300 per assessment'
    }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Use fallback services if API fails
        setServices(fallbackServices);
      }
    };

    fetchServices();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/appointments', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        date: '',
        time: '',
        message: ''
      });
    } catch (error) {
      setError('There was an error booking your appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
  ];

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="book-appointment-page">
      {/* Hero Section */}
      <section className="hero appointment-hero">
        <div className="container">
          <h1>Book Your Appointment</h1>
          <p>Take the first step towards better mental health. Schedule your therapy session today.</p>
        </div>
      </section>

      {/* Appointment Form */}
      <section className="section">
        <div className="container">
          <div className="appointment-content">
            {/* Form */}
            <div className="appointment-form-container">
              <h2>Schedule Your Session</h2>
              <p>Fill out the form below to book your appointment. We'll confirm your booking within 24 hours.</p>
              
              {success && (
                <div className="success-message">
                  Thank you for booking your appointment! We'll contact you soon to confirm your session.
                </div>
              )}
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="appointment-form">
                <div className="form-section">
                  <h3><FaUser /> Personal Information</h3>
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
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3><FaCalendar /> Appointment Details</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="service">Service Type *</label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.title}>
                            {service.title} - {service.price}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="date">Preferred Date *</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={today}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="time">Preferred Time *</label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Additional Information</h3>
                  <div className="form-group">
                    <label htmlFor="message">Message (Optional)</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please share any specific concerns or preferences for your session..."
                    ></textarea>
                  </div>
                </div>
                
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Booking...' : 'Book Appointment'}
                </button>
              </form>
            </div>

            {/* Information Sidebar */}
            <div className="appointment-info">
              <h2>What to Expect</h2>
              <div className="info-cards">
                <div className="info-card">
                  <div className="info-icon">📋</div>
                  <h3>Initial Consultation</h3>
                  <p>Your first session will include a comprehensive assessment to understand your needs and goals.</p>
                </div>
                <div className="info-card">
                  <div className="info-icon">🤝</div>
                  <h3>Safe Environment</h3>
                  <p>Our clinic provides a confidential, non-judgmental space where you can feel comfortable sharing.</p>
                </div>
                <div className="info-card">
                  <div className="info-icon">📞</div>
                  <h3>Confirmation</h3>
                  <p>We'll contact you within 24 hours to confirm your appointment and provide additional details.</p>
                </div>
              </div>

              <div className="contact-info-sidebar">
                <h3>Need Help?</h3>
                <p>If you have any questions about booking or our services, please don't hesitate to contact us.</p>
                <div className="contact-item">
                  <FaPhone />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope />
                  <span>info@lynapsychology.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookAppointment;