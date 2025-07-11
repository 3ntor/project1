import React, { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadData = async () => {
    try {
      // Mock data for demo
      const mockAppointments = [
        {
          _id: '1',
          name: 'أحمد محمد',
          email: 'ahmed@example.com',
          phone: '0123456789',
          service: {
            name: 'العلاج الفردي',
            description: 'جلسات علاج نفسي فردية',
            price: 500,
            duration: '60 دقيقة'
          },
          date: '2024-01-15',
          time: '10:00',
          message: 'أحتاج مساعدة في علاج الاكتئاب',
          status: 'pending',
          createdAt: '2024-01-10T10:00:00Z'
        },
        {
          _id: '2',
          name: 'فاطمة علي',
          email: 'fatima@example.com',
          phone: '0987654321',
          service: {
            name: 'العلاج الأسري',
            description: 'جلسات علاج أسري',
            price: 800,
            duration: '90 دقيقة'
          },
          date: '2024-01-16',
          time: '14:00',
          message: 'مشاكل أسرية تحتاج حل',
          status: 'confirmed',
          createdAt: '2024-01-11T14:30:00Z'
        }
      ];

      const mockContacts = [
        {
          _id: '1',
          name: 'محمد أحمد',
          email: 'mohamed@example.com',
          subject: 'استفسار عن الخدمات',
          message: 'أريد معرفة المزيد عن خدمات العلاج النفسي',
          createdAt: '2024-01-12T09:00:00Z'
        }
      ];

      const mockFaqs = [
        {
          _id: '1',
          question: 'كيف يمكنني حجز موعد؟',
          answer: 'يمكنك الحجز من خلال الموقع أو الاتصال بنا',
          category: 'appointments',
          isActive: true,
          order: 1
        }
      ];

      setAppointments(mockAppointments);
      setContacts(mockContacts);
      setFaqs(mockFaqs);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Mock login - in real app, call API
    if (loginForm.email === 'admin@example.com' && loginForm.password === 'admin123') {
      localStorage.setItem('adminToken', 'mock-token');
      setIsLoggedIn(true);
      loadData();
    } else {
      alert('بيانات غير صحيحة');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt._id === id ? { ...apt, status } : apt
      )
    );
  };

  const deleteItem = (type, id) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      switch (type) {
        case 'appointment':
          setAppointments(prev => prev.filter(apt => apt._id !== id));
          break;
        case 'contact':
          setContacts(prev => prev.filter(contact => contact._id !== id));
          break;
        case 'faq':
          setFaqs(prev => prev.filter(faq => faq._id !== id));
          break;
        default:
          break;
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h2>تسجيل دخول الأدمن</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>البريد الإلكتروني:</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>كلمة المرور:</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="login-btn">تسجيل الدخول</button>
          </form>
          <p className="demo-credentials">
            بيانات تجريبية: admin@example.com / admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>لوحة تحكم الأدمن</h1>
        <button onClick={handleLogout} className="logout-btn">تسجيل الخروج</button>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          الحجوزات ({appointments.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          الرسائل ({contacts.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
          onClick={() => setActiveTab('faqs')}
        >
          الأسئلة الشائعة ({faqs.length})
        </button>
      </div>

      <div className="admin-content">
        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="appointments-section">
            <h3>إدارة الحجوزات</h3>
            <div className="appointments-grid">
              {appointments.map(appointment => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-header">
                    <h4>{appointment.name}</h4>
                    <span className={`status ${appointment.status}`}>
                      {appointment.status === 'pending' && 'في الانتظار'}
                      {appointment.status === 'confirmed' && 'مؤكد'}
                      {appointment.status === 'cancelled' && 'ملغي'}
                      {appointment.status === 'completed' && 'مكتمل'}
                    </span>
                  </div>
                  <div className="appointment-details">
                    <p><strong>البريد الإلكتروني:</strong> {appointment.email}</p>
                    <p><strong>الهاتف:</strong> {appointment.phone}</p>
                    <p><strong>الخدمة:</strong> {appointment.service.name}</p>
                    <p><strong>السعر:</strong> {appointment.service.price} جنيه</p>
                    <p><strong>التاريخ:</strong> {formatDate(appointment.date)}</p>
                    <p><strong>الوقت:</strong> {formatTime(appointment.time)}</p>
                    {appointment.message && (
                      <p><strong>الرسالة:</strong> {appointment.message}</p>
                    )}
                  </div>
                  <div className="appointment-actions">
                    <select
                      value={appointment.status}
                      onChange={(e) => updateAppointmentStatus(appointment._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">في الانتظار</option>
                      <option value="confirmed">مؤكد</option>
                      <option value="cancelled">ملغي</option>
                      <option value="completed">مكتمل</option>
                    </select>
                    <button
                      onClick={() => deleteItem('appointment', appointment._id)}
                      className="delete-btn"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="contacts-section">
            <h3>إدارة الرسائل</h3>
            <div className="contacts-grid">
              {contacts.map(contact => (
                <div key={contact._id} className="contact-card">
                  <div className="contact-header">
                    <h4>{contact.name}</h4>
                    <span className="contact-date">{formatDate(contact.createdAt)}</span>
                  </div>
                  <div className="contact-details">
                    <p><strong>البريد الإلكتروني:</strong> {contact.email}</p>
                    <p><strong>الموضوع:</strong> {contact.subject}</p>
                    <p><strong>الرسالة:</strong> {contact.message}</p>
                  </div>
                  <div className="contact-actions">
                    <button
                      onClick={() => deleteItem('contact', contact._id)}
                      className="delete-btn"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs Tab */}
        {activeTab === 'faqs' && (
          <div className="faqs-section">
            <h3>إدارة الأسئلة الشائعة</h3>
            <button className="add-faq-btn">إضافة سؤال جديد</button>
            <div className="faqs-grid">
              {faqs.map(faq => (
                <div key={faq._id} className="faq-card">
                  <div className="faq-header">
                    <h4>{faq.question}</h4>
                    <span className={`faq-status ${faq.isActive ? 'active' : 'inactive'}`}>
                      {faq.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                  <div className="faq-details">
                    <p><strong>الإجابة:</strong> {faq.answer}</p>
                    <p><strong>الفئة:</strong> {faq.category}</p>
                    <p><strong>الترتيب:</strong> {faq.order}</p>
                  </div>
                  <div className="faq-actions">
                    <button className="edit-btn">تعديل</button>
                    <button
                      onClick={() => deleteItem('faq', faq._id)}
                      className="delete-btn"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;