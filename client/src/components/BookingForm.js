import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BookingForm = ({ onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: ''
  });
  const [loading, setLoading] = useState(false);
  const [showAuthMessage, setShowAuthMessage] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // تحقق من تسجيل الدخول عند تغيير أي حقل
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthMessage(true);
    }
  }, [formData, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isAuthenticated) {
        // منع إرسال النموذج إذا لم يكن المستخدم مسجلاً
        e.preventDefault();
        setShowAuthMessage(true);
        return;
      }

      // هنا يمكنك إضافة المنطق لإرسال البيانات للخادم
      // const response = await fetch('/api/bookings', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData)
      // });

      onBookingSuccess();
    } catch (error) {
      console.error('Error booking session:', error);
      alert('حدث خطأ أثناء حجز الجلسة. يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form">
      <h2>حجز جلسة</h2>
      {isAuthenticated ? (
        <>
          {/* عرض نموذج الحجز فقط للمستخدمين المسجلين */}
          <form onSubmit={handleSubmit}>
      {showAuthMessage && !isAuthenticated && (
        <div className="auth-message">
          <p>يجب عليك تسجيل الدخول أولاً للحجز</p>
          <button onClick={() => {
            navigate('/signup');
            setShowAuthMessage(false);
          }} className="signup-btn">
            تسجيل جديد
          </button>
          <button onClick={() => setShowAuthMessage(false)} className="cancel-btn">
            إلغاء
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {isAuthenticated ? (
          <>
            <div className="form-group">
              <label>الاسم</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>رقم الهاتف</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>التاريخ</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>الوقت</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </>
        ) : (
          <div className="login-message">
            <p>يجب عليك تسجيل الدخول أولاً للحجز</p>
            <button type="button" onClick={() => navigate('/login')} className="btn btn-primary">
              تسجيل الدخول
            </button>
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'جاري الحجز...' : 'حجز الآن'}
        </button>
          </form>
        </>
      ) : (
        <div className="auth-message">
          <p>يجب عليك تسجيل الدخول أولاً للحجز</p>
          <button onClick={() => {
            navigate('/signup');
          }} className="signup-btn">
            تسجيل جديد
          </button>
          <button onClick={() => navigate('/login')} className="login-btn">
            تسجيل دخول
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
