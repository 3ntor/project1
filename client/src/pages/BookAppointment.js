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
  const [formErrors, setFormErrors] = useState({});

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

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = t('booking.form.errors.nameRequired') || 'الاسم مطلوب';
    }
    
    if (!formData.email.trim()) {
      errors.email = t('booking.form.errors.emailRequired') || 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('booking.form.errors.emailInvalid') || 'البريد الإلكتروني غير صحيح';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = t('booking.form.errors.phoneRequired') || 'رقم الهاتف مطلوب';
    } else if (!/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phone)) {
      errors.phone = t('booking.form.errors.phoneInvalid') || 'رقم الهاتف غير صحيح';
    }
    
    if (!formData.service) {
      errors.service = t('booking.form.errors.serviceRequired') || 'نوع الخدمة مطلوب';
    }
    
    if (!formData.date) {
      errors.date = t('booking.form.errors.dateRequired') || 'التاريخ مطلوب';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = t('booking.form.errors.dateInPast') || 'لا يمكن حجز موعد في الماضي';
      }
    }
    
    if (!formData.time) {
      errors.time = t('booking.form.errors.timeRequired') || 'الوقت مطلوب';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError(t('booking.form.errors.fillRequired') || 'يرجى تصحيح الأخطاء في النموذج');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/bookings', formData);
      
      if (response.data.success) {
        setSuccess(t('booking.success') || 'تم حجز الموعد بنجاح! سيتم التواصل معك قريباً لتأكيد الموعد.');
        // Reset form
        setFormData({
          ...formData,
          date: '',
          time: '',
          notes: ''
        });
        setFormErrors({});
        // Refresh bookings
        fetchUserBookings();
        
        // Scroll to success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.response?.data?.message || 'حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const services = [
    { 
      id: 'individual', 
      name: t('services.types.individual.title') || 'جلسة فردية',
      price: '500',
      duration: '60 دقيقة',
      description: 'جلسة نفسية فردية مع المختص'
    },
    { 
      id: 'couples', 
      name: t('services.types.couples.title') || 'جلسة أزواج',
      price: '800',
      duration: '90 دقيقة',
      description: 'جلسة نفسية للأزواج'
    },
    { 
      id: 'family', 
      name: t('services.types.family.title') || 'جلسة عائلية',
      price: '750',
      duration: '90 دقيقة',
      description: 'جلسة نفسية للعائلة'
    },
    { 
      id: 'anxiety', 
      name: t('services.types.anxiety.title') || 'علاج القلق',
      price: '550',
      duration: '60 دقيقة',
      description: 'جلسة متخصصة في علاج القلق'
    },
    { 
      id: 'depression', 
      name: t('services.types.depression.title') || 'علاج الاكتئاب',
      price: '550',
      duration: '60 دقيقة',
      description: 'جلسة متخصصة في علاج الاكتئاب'
    }
  ];

  const timeSlots = [
    { value: '09:00', label: '9:00 صباحاً' },
    { value: '10:00', label: '10:00 صباحاً' },
    { value: '11:00', label: '11:00 صباحاً' },
    { value: '12:00', label: '12:00 ظهراً' },
    { value: '14:00', label: '2:00 مساءً' },
    { value: '15:00', label: '3:00 مساءً' },
    { value: '16:00', label: '4:00 مساءً' },
    { value: '17:00', label: '5:00 مساءً' },
    { value: '18:00', label: '6:00 مساءً' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'مساءً' : 'صباحاً';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Allow booking up to 30 days in advance
    return maxDate.toISOString().split('T')[0];
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'في الانتظار',
      confirmed: 'مؤكد',
      cancelled: 'ملغي'
    };
    return statusMap[status] || status;
  };

  if (!isAuthenticated()) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <div className="login-required">
            <h2>يجب تسجيل الدخول أولاً</h2>
            <p>للوصول إلى صفحة الحجز، يرجى تسجيل الدخول أو إنشاء حساب جديد</p>
            <button 
              onClick={() => navigate('/login', { state: { from: location } })}
              className="login-button"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`booking-page ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="booking-container">
        <div className="booking-header">
          <h1>{t('booking.title') || 'حجز موعد'}</h1>
          <p>{t('booking.subtitle') || 'احجز موعدك مع أفضل المختصين النفسيين'}</p>
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
                  <label htmlFor="name">{t('booking.form.name') || 'الاسم الكامل'} *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="أدخل اسمك الكامل"
                    className={formErrors.name ? 'error' : ''}
                  />
                  {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t('booking.form.email') || 'البريد الإلكتروني'} *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className={formErrors.email ? 'error' : ''}
                  />
                  {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">{t('booking.form.phone') || 'رقم الهاتف'} *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+20 123 456 7890"
                    className={formErrors.phone ? 'error' : ''}
                  />
                  {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="service">{t('booking.form.service') || 'نوع الخدمة'} *</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={formErrors.service ? 'error' : ''}
                  >
                    <option value="">اختر نوع الخدمة</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} - {service.price} جنيه ({service.duration})
                      </option>
                    ))}
                  </select>
                  {formErrors.service && <span className="field-error">{formErrors.service}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">{t('booking.form.date') || 'التاريخ'} *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className={formErrors.date ? 'error' : ''}
                  />
                  {formErrors.date && <span className="field-error">{formErrors.date}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="time">{t('booking.form.time') || 'الوقت'} *</label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    disabled={!formData.date}
                    className={formErrors.time ? 'error' : ''}
                  >
                    <option value="">اختر الوقت</option>
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
                  {formErrors.time && <span className="field-error">{formErrors.time}</span>}
                  {formData.date && availableTimes.length === 0 && (
                    <span className="field-info">لا توجد أوقات متاحة في هذا التاريخ</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">{t('booking.form.notes') || 'ملاحظات إضافية'}</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="أي ملاحظات أو معلومات إضافية تود مشاركتها..."
                />
              </div>

              <button
                type="submit"
                className="booking-submit-button"
                disabled={loading}
              >
                {loading ? 'جاري الحجز...' : 'احجز الموعد'}
              </button>
            </form>
          </div>

          <div className="my-bookings-section">
            <h2>{t('booking.myBookings.title') || 'مواعيدي'}</h2>
            
            {userBookings.length === 0 ? (
              <p className="no-bookings">
                {t('booking.myBookings.noBookings') || 'لا توجد مواعيد محجوزة حالياً'}
              </p>
            ) : (
              <div className="bookings-list">
                {userBookings.map(booking => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-info">
                      <h3>{services.find(s => s.id === booking.service)?.name || booking.service}</h3>
                      <p><strong>التاريخ:</strong> {formatDate(booking.date)}</p>
                      <p><strong>الوقت:</strong> {formatTime(booking.time)}</p>
                      <p><strong>الحالة:</strong> 
                        <span className={`status ${booking.status}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </p>
                      {booking.notes && (
                        <p><strong>ملاحظات:</strong> {booking.notes}</p>
                      )}
                      <p><strong>تاريخ الحجز:</strong> {formatDate(booking.createdAt)}</p>
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