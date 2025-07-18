import React, { useState, useEffect } from 'react';
import { FaCalendar, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Calendar from '../components/Calendar';
import axios from 'axios';
import './BookAppointment.css';

const BookAppointment = (props) => {
  const { location } = props;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: {
      name: '',
      description: '',
      price: 0,
      duration: ''
    },
    date: '',
    time: '',
    message: ''
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);

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
    // Check if there's a selected service from localStorage
    // Get service from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('serviceId');
    const serviceName = urlParams.get('serviceName');
    
    // Get service from URL parameters
    if (serviceId && serviceName) {
      const selectedService = services.find(service => service.id === parseInt(serviceId));
      if (selectedService) {
        setSelectedService(selectedService);
        setFormData(prev => ({
          ...prev,
          service: selectedService
        }));
      }
    }



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

  // Handle calendar date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData(prev => ({
      ...prev,
      date: date.toISOString().split('T')[0]
    }));
  };

  // Handle calendar time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setFormData(prev => ({
      ...prev,
      time: time
    }));
  };

  const handleChange = (e) => {
    if (e.target.name === 'service') {
      const selectedService = services.find(s => s.id === parseInt(e.target.value));
      setFormData({
        ...formData,
        service: selectedService ? {
          name: selectedService.title,
          description: selectedService.description,
          price: parseInt(selectedService.price.replace(/[^0-9]/g, '')),
          duration: selectedService.duration
        } : {
          name: '',
          description: '',
          price: 0,
          duration: ''
        }
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // التحقق من صحة البيانات قبل الإرسال
      if (!selectedService) {
        throw new Error('Please select a service');
      }
      if (!selectedDate) {
        throw new Error('Please select a date');
      }
      if (!selectedTime) {
        throw new Error('Please select a time');
      }

      // تحضير البيانات بالتنسيق المطلوب
      const appointmentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: {
          name: formData.service.name,
          description: formData.service.description,
          price: formData.service.price,
          duration: formData.service.duration
        },
        date: selectedDate.toISOString(),
        time: selectedTime,
        message: formData.message
      };

      // إرسال البيانات
      const response = await axios.post('http://localhost:5000/api/appointments', appointmentData);
      
      // التحقق من نجاح العملية
      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: {
            name: '',
            description: '',
            price: 0,
            duration: ''
          },
          date: '',
          time: '',
          message: ''
        });
        setSelectedService(null);
        setSelectedDate(null);
        setSelectedTime('');
      }
    } catch (error) {
      console.error('Appointment booking error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'حدث خطأ أثناء حجز الموعد. يرجى المحاولة مرة أخرى.');
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
          <h1>احجز موعدك</h1>
          <p>اتخذ الخطوة الأولى نحو صحة نفسية أفضل. احجز جلستك العلاجية اليوم.</p>
        </div>
      </section>

      {/* Appointment Form */}
      <section className="section">
        <div className="container">
          <div className="appointment-content">
            {/* Form */}
            <div className="appointment-form-container">
              <h2>جدولة جلستك</h2>
              <p>املأ النموذج أدناه لحجز موعدك. سنتصل بك خلال 24 ساعة لتأكيد الحجز.</p>
              
              {success && (
                <div className="success-message">
                  شكراً لك على حجز موعدك! سنتصل بك قريباً لتأكيد جلستك.
                </div>
              )}
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="appointment-form">
                <div className="form-section">
                  <h3><FaUser /> المعلومات الشخصية</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">الاسم الكامل *</label>
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
                      <label htmlFor="email">البريد الإلكتروني *</label>
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
                    <label htmlFor="phone">رقم الهاتف *</label>
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
                  <h3><FaCalendar /> تفاصيل الموعد</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="service">نوع الخدمة *</label>
                      <select
                        id="service"
                        name="service"
                        value={selectedService ? selectedService.id : ''}
                        onChange={(e) => {
                          const selectedService = services.find(s => s.id === parseInt(e.target.value));
                          setSelectedService(selectedService);
                          setFormData(prev => ({
                            ...prev,
                            service: selectedService ? {
                              name: selectedService.title,
                              description: selectedService.description,
                              price: parseInt(selectedService.price.replace(/[^0-9]/g, '')),
                              duration: selectedService.duration
                            } : {
                              name: '',
                              description: '',
                              price: 0,
                              duration: ''
                            }
                          }));
                        }}
                        required
                      >
                        <option value="">اختر الخدمة</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.title} - {service.price}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Selected Service Details */}
                  {formData.service.name && (
                    <div className="selected-service-details">
                      <h4>تفاصيل الخدمة المختارة:</h4>
                      <div className="service-info-card">
                        <h5>{formData.service.name}</h5>
                        <p>{formData.service.description}</p>
                        <div className="service-meta">
                          <span className="service-price">السعر: {formData.service.price} جنيه</span>
                          <span className="service-duration">المدة: {formData.service.duration}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Calendar Section */}
                  <div className="calendar-section">
                    <h4>اختر التاريخ والوقت</h4>
                    <Calendar
                      onDateSelect={handleDateSelect}
                      onTimeSelect={handleTimeSelect}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      bookedSlots={bookedSlots}
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>معلومات إضافية</h3>
                  <div className="form-group">
                    <label htmlFor="message">رسالة (اختياري)</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="يرجى مشاركة أي مخاوف أو تفضيلات محددة لجلستك..."
                    ></textarea>
                  </div>
                </div>
                
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'جاري الحجز...' : 'احجز الموعد'}
                </button>
              </form>
            </div>

            {/* Information Sidebar */}
            <div className="appointment-info">
              <h2>ما يمكن توقعه</h2>
              <div className="info-cards">
                <div className="info-card">
                  <div className="info-icon">📋</div>
                  <h3>استشارة أولية</h3>
                  <p>ستتضمن جلستك الأولى تقييماً شاملاً لفهم احتياجاتك وأهدافك.</p>
                </div>
                <div className="info-card">
                  <div className="info-icon">🤝</div>
                  <h3>بيئة آمنة</h3>
                  <p>يوفر عيادتنا مساحة سرية وغير قضائية حيث يمكنك الشعور بالراحة في المشاركة.</p>
                </div>
                <div className="info-card">
                  <div className="info-icon">📞</div>
                  <h3>تأكيد الحجز</h3>
                  <p>سنقوم بالاتصال بك خلال 24 ساعة لتأكيد موعدك وتقديم تفاصيل إضافية.</p>
                </div>
              </div>

              <div className="contact-info-sidebar">
                <h3>تحتاج مساعدة؟</h3>
                <p>إذا كان لديك أي أسئلة حول الحجز أو خدماتنا، فلا تتردد في الاتصال بنا.</p>
                <div className="contact-item">
                  <FaPhone />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope />
                  <span>info@nafsiatak.com</span>
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