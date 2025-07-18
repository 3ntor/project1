import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, user]);

  const loadData = async () => {
    try {
      const [appointmentsRes, contactsRes, faqsRes, blogRes] = await Promise.all([
        fetch('/api/admin/appointments'),
        fetch('/api/admin/contacts'),
        fetch('/api/admin/faqs'),
        fetch('/api/admin/blog')
      ]);

      const [appointmentsData, contactsData, faqsData, blogData] = await Promise.all([
        appointmentsRes.json(),
        contactsRes.json(),
        faqsRes.json(),
        blogRes.json()
      ]);

      setAppointments(appointmentsData);
      setContacts(contactsData);
      setFaqs(faqsData);
      setBlogPosts(blogData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading admin data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
        case 'blog':
          setBlogPosts(prev => prev.filter(post => post._id !== id));
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

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="admin-header">
        <h1>لوحة تحكم الأدمن</h1>
        <button onClick={handleLogout} className="logout-btn">تسجيل الخروج</button>
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
        <button
          className={`tab-btn ${activeTab === 'blog' ? 'active' : ''}`}
          onClick={() => setActiveTab('blog')}
        >
          المدونة ({blogPosts.length})
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

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <div className="blog-section">
            <h3>إدارة المدونة</h3>
            <button className="add-blog-btn">إضافة مقال جديد</button>
            <div className="blog-grid">
              {blogPosts.map(post => (
                <div key={post._id} className="blog-card">
                  <div className="blog-header">
                    <h4>{post.title}</h4>
                    <div className="blog-status">
                      <span className={`publish-status ${post.isPublished ? 'published' : 'draft'}`}>
                        {post.isPublished ? 'منشور' : 'مسودة'}
                      </span>
                      {post.isFeatured && (
                        <span className="featured-badge">مميز</span>
                      )}
                    </div>
                  </div>
                  <div className="blog-details">
                    <p><strong>الملخص:</strong> {post.excerpt}</p>
                    <p><strong>الفئة:</strong> {post.category}</p>
                    <p><strong>الكاتب:</strong> {post.author.name}</p>
                    <p><strong>تاريخ النشر:</strong> {formatDate(post.publishedAt)}</p>
                    <div className="blog-stats">
                      <span><strong>المشاهدات:</strong> {post.views}</span>
                      <span><strong>الإعجابات:</strong> {post.likes}</span>
                    </div>
                  </div>
                  <div className="blog-actions">
                    <button className="edit-btn">تعديل</button>
                    <button className="view-btn">عرض</button>
                    <button
                      onClick={() => deleteItem('blog', post._id)}
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