import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './BookAppointment.css';

const BookAppointment = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    service: location.state?.selectedService || '',
    date: '',
    time: '',
    notes: ''
  });
  
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentLanguage = i18n.language;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { 
        state: { from: location },
        replace: true 
      });
    }
  }, [isAuthenticated, navigate, location]);

  // Fetch user bookings
  useEffect(() => {
    if (isAuthenticated()) {
      fetchUserBookings();
    }
  }, [isAuthenticated]);

  // Fetch available times when date changes
  useEffect(() => {
    if (formData.date) {
      fetchAvailableTimes(formData.date);
    }
  }, [formData.date]);

  const fetchUserBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/my-bookings');
      setUserBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchAvailableTimes = async (date) => {
    try {
      const response = await axios.get(`/api/bookings/available-times/${date}`);
      setAvailableTimes(response.data.availableTimes || []);
      setBookedTimes(response.data.bookedTimes || []);
    } catch (error) {
      console.error('Error fetching available times:', error);
      setAvailableTimes([]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.date || !formData.time) {
      setError(t('booking.form.required') || 'جميع الحقول مطلوبة');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/bookings', formData);
      
      if (response.data.success) {
        setSuccess(t('booking.success'));
        // Reset form
        setFormData({
          ...formData,
          date: '',
          time: '',
          notes: ''
        });
        // Refresh bookings
        fetchUserBookings();
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.response?.data?.message || 'حدث خطأ أثناء الحجز');
    } finally {
      setLoading(false);
    }
  };

  const services = [
    { id: 'individual', name: t('services.types.individual.title'), price: '500' },
    { id: 'couples', name: t('services.types.couples.title'), price: '800' },
    { id: 'family', name: t('services.types.family.title'), price: '750' },
    { id: 'anxiety', name: t('services.types.anxiety.title'), price: '550' },
    { id: 'depression', name: t('services.types.depression.title'), price: '550' }
  ];

  const timeSlots = [
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' },
    { value: '18:00', label: '6:00 PM' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US');
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!isAuthenticated()) {
    return (
      <div className="booking-page">
        <div className="login-required">
          <h2>{t('booking.loginRequired')}</h2>
          <button 
            onClick={() => navigate('/login')}
            className="login-button"
          >
            {t('booking.loginButton')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`booking-page ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="booking-container">
        <div className="booking-header">
          <h1>{t('booking.title')}</h1>
          <p>{t('booking.subtitle')}</p>
        </div>

        <div className="booking-content">
          <div className="booking-form-section">
            <h2>احجز موعدك الجديد</h2>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">{t('booking.form.name')}</label>
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
                  <label htmlFor="email">{t('booking.form.email')}</label>
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
                  <label htmlFor="phone">{t('booking.form.phone')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="service">{t('booking.form.service')}</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t('booking.form.service')}</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} - {service.price} {t('services.price', { price: service.price })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">{t('booking.form.date')}</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">{t('booking.form.time')}</label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    disabled={!formData.date}
                  >
                    <option value="">{t('booking.form.time')}</option>
                    {timeSlots.map(slot => (
                      <option 
                        key={slot.value} 
                        value={slot.value}
                        disabled={!availableTimes.includes(slot.value)}
                      >
                        {slot.label} {!availableTimes.includes(slot.value) && '(محجوز)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">{t('booking.form.notes')}</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder={t('booking.form.notes')}
                />
              </div>

              <button
                type="submit"
                className="booking-submit-button"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('booking.form.submit')}
              </button>
            </form>
          </div>

          <div className="my-bookings-section">
            <h2>{t('booking.myBookings.title')}</h2>
            
            {userBookings.length === 0 ? (
              <p className="no-bookings">{t('booking.myBookings.noBookings')}</p>
            ) : (
              <div className="bookings-list">
                {userBookings.map(booking => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-info">
                      <h3>{services.find(s => s.id === booking.service)?.name}</h3>
                      <p><strong>التاريخ:</strong> {formatDate(booking.date)}</p>
                      <p><strong>الوقت:</strong> {formatTime(booking.time)}</p>
                      <p><strong>الحالة:</strong> 
                        <span className={`status ${booking.status}`}>
                          {t(`booking.myBookings.status.${booking.status}`)}
                        </span>
                      </p>
                      {booking.notes && (
                        <p><strong>ملاحظات:</strong> {booking.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;