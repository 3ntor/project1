import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaCalendar, FaEnvelope, FaChartLine, FaClock, FaCheck, FaTimes, FaStar } from 'react-icons/fa';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    totalContacts: 0,
    recentAppointments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, contactsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/appointments'),
        axios.get('http://localhost:5000/api/contact')
      ]);

      const appointments = appointmentsRes.data;
      const contacts = contactsRes.data;

      setStats({
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter(a => a.status === 'pending').length,
        confirmedAppointments: appointments.filter(a => a.status === 'confirmed').length,
        completedAppointments: appointments.filter(a => a.status === 'completed').length,
        totalContacts: contacts.length,
        recentAppointments: appointments.slice(0, 5) // Last 5 appointments
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'confirmed': return 'مؤكدة';
      case 'cancelled': return 'ملغية';
      case 'completed': return 'مكتملة';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      {/* Header */}
      <section className="dashboard-header">
        <div className="container">
          <h1>لوحة التحكم</h1>
          <p>مرحباً بك في نظام إدارة عيادة لينا النفسية</p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="quick-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">
                <FaCalendar />
              </div>
              <div className="stat-content">
                <h3>{stats.totalAppointments}</h3>
                <p>إجمالي الحجوزات</p>
              </div>
            </div>
            
            <div className="stat-card pending">
              <div className="stat-icon">
                <FaClock />
              </div>
              <div className="stat-content">
                <h3>{stats.pendingAppointments}</h3>
                <p>في الانتظار</p>
              </div>
            </div>
            
            <div className="stat-card confirmed">
              <div className="stat-icon">
                <FaCheck />
              </div>
              <div className="stat-content">
                <h3>{stats.confirmedAppointments}</h3>
                <p>مؤكدة</p>
              </div>
            </div>
            
            <div className="stat-card completed">
              <div className="stat-icon">
                <FaStar />
              </div>
              <div className="stat-content">
                <h3>{stats.completedAppointments}</h3>
                <p>مكتملة</p>
              </div>
            </div>
            
            <div className="stat-card contacts">
              <div className="stat-icon">
                <FaEnvelope />
              </div>
              <div className="stat-content">
                <h3>{stats.totalContacts}</h3>
                <p>رسائل الاتصال</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="container">
          <h2>إجراءات سريعة</h2>
          <div className="actions-grid">
            <Link to="/admin/appointments" className="action-card">
              <div className="action-icon">
                <FaCalendar />
              </div>
              <h3>إدارة الحجوزات</h3>
              <p>عرض وتعديل جميع الحجوزات</p>
            </Link>
            
            <Link to="/book-appointment" className="action-card">
              <div className="action-icon">
                <FaUsers />
              </div>
              <h3>حجز جديد</h3>
              <p>إنشاء حجز جديد للمريض</p>
            </Link>
            
            <Link to="/contact" className="action-card">
              <div className="action-icon">
                <FaEnvelope />
              </div>
              <h3>رسائل الاتصال</h3>
              <p>عرض رسائل المرضى</p>
            </Link>
            
            <Link to="/services" className="action-card">
              <div className="action-icon">
                <FaChartLine />
              </div>
              <h3>إدارة الخدمات</h3>
              <p>تعديل الخدمات والأسعار</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Appointments */}
      <section className="recent-appointments">
        <div className="container">
          <div className="section-header">
            <h2>آخر الحجوزات</h2>
            <Link to="/admin/appointments" className="view-all-btn">
              عرض الكل
            </Link>
          </div>
          
          <div className="appointments-list">
            {stats.recentAppointments.length > 0 ? (
              stats.recentAppointments.map((appointment) => (
                <div key={appointment._id} className="appointment-item">
                  <div className="appointment-info">
                    <div className="patient-name">{appointment.name}</div>
                    <div className="appointment-details">
                      <span className="service">{appointment.service}</span>
                      <span className="date">
                        {new Date(appointment.date).toLocaleDateString('ar-EG')}
                      </span>
                      <span className="time">{appointment.time}</span>
                    </div>
                  </div>
                  <div className="appointment-status">
                    <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-appointments">
                <p>لا توجد حجوزات حديثة</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* System Info */}
      <section className="system-info">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <h3>معلومات النظام</h3>
              <div className="info-item">
                <span>إصدار النظام:</span>
                <span>1.0.0</span>
              </div>
              <div className="info-item">
                <span>آخر تحديث:</span>
                <span>{new Date().toLocaleDateString('ar-EG')}</span>
              </div>
              <div className="info-item">
                <span>حالة النظام:</span>
                <span className="status-online">متصل</span>
              </div>
            </div>
            
            <div className="info-card">
              <h3>إحصائيات سريعة</h3>
              <div className="info-item">
                <span>معدل الحجوزات اليوم:</span>
                <span>{Math.round(stats.totalAppointments / 30)}</span>
              </div>
              <div className="info-item">
                <span>نسبة الحجوزات المؤكدة:</span>
                <span>{stats.totalAppointments > 0 ? Math.round((stats.confirmedAppointments / stats.totalAppointments) * 100) : 0}%</span>
              </div>
              <div className="info-item">
                <span>نسبة الحجوزات المكتملة:</span>
                <span>{stats.totalAppointments > 0 ? Math.round((stats.completedAppointments / stats.totalAppointments) * 100) : 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;