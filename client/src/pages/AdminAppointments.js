import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash, FaCheck, FaTimes, FaClock, FaCalendar, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import './AdminAppointments.css';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/appointments');
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching appointments');
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/appointments/${id}`, { status });
      fetchAppointments(); // Refresh the list
    } catch (error) {
      setError('Error updating appointment status');
    }
  };

  const deleteAppointment = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`http://localhost:5000/api/appointments/${id}`);
        fetchAppointments(); // Refresh the list
      } catch (error) {
        setError('Error deleting appointment');
      }
    }
  };

  const viewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <FaCheck />;
      case 'cancelled': return <FaTimes />;
      case 'completed': return <FaCheck />;
      default: return <FaClock />;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesSearch = appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    completed: appointments.filter(a => a.status === 'completed').length
  };

  if (loading) {
    return (
      <div className="admin-appointments-page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-appointments-page">
      {/* Header */}
      <section className="admin-header">
        <div className="container">
          <h1>إدارة الحجوزات</h1>
          <p>عرض وإدارة جميع مواعيد المرضى</p>
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">📊</div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>إجمالي الحجوزات</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon pending">⏳</div>
              <div className="stat-info">
                <h3>{stats.pending}</h3>
                <p>في الانتظار</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon confirmed">✅</div>
              <div className="stat-info">
                <h3>{stats.confirmed}</h3>
                <p>مؤكدة</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon completed">🎯</div>
              <div className="stat-info">
                <h3>{stats.completed}</h3>
                <p>مكتملة</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-row">
            <div className="search-box">
              <input
                type="text"
                placeholder="البحث بالاسم، البريد الإلكتروني، أو الخدمة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                جميع الحجوزات
              </button>
              <button
                className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                onClick={() => setFilterStatus('pending')}
              >
                في الانتظار
              </button>
              <button
                className={`filter-btn ${filterStatus === 'confirmed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('confirmed')}
              >
                مؤكدة
              </button>
              <button
                className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('completed')}
              >
                مكتملة
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Appointments Table */}
      <section className="appointments-section">
        <div className="container">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="appointments-table">
            <table>
              <thead>
                <tr>
                  <th>المريض</th>
                  <th>معلومات الاتصال</th>
                  <th>الخدمة</th>
                  <th>التاريخ والوقت</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="patient-info">
                      <div className="patient-name">{appointment.name}</div>
                      <div className="appointment-id">ID: {appointment._id.slice(-6)}</div>
                    </td>
                    <td className="contact-info">
                      <div><FaEnvelope /> {appointment.email}</div>
                      <div><FaPhone /> {appointment.phone}</div>
                    </td>
                    <td className="service-info">
                      <div className="service-name">{appointment.service}</div>
                    </td>
                    <td className="datetime-info">
                      <div><FaCalendar /> {new Date(appointment.date).toLocaleDateString('ar-EG')}</div>
                      <div><FaClock /> {appointment.time}</div>
                    </td>
                    <td className="status-cell">
                      <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        {appointment.status === 'pending' && 'في الانتظار'}
                        {appointment.status === 'confirmed' && 'مؤكدة'}
                        {appointment.status === 'cancelled' && 'ملغية'}
                        {appointment.status === 'completed' && 'مكتملة'}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="action-btn view-btn"
                        onClick={() => viewAppointment(appointment)}
                        title="عرض التفاصيل"
                      >
                        <FaEye />
                      </button>
                      <select
                        className="status-select"
                        value={appointment.status}
                        onChange={(e) => updateAppointmentStatus(appointment._id, e.target.value)}
                      >
                        <option value="pending">في الانتظار</option>
                        <option value="confirmed">مؤكدة</option>
                        <option value="cancelled">ملغية</option>
                        <option value="completed">مكتملة</option>
                      </select>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => deleteAppointment(appointment._id)}
                        title="حذف الحجز"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredAppointments.length === 0 && (
              <div className="no-appointments">
                <p>لا توجد حجوزات {filterStatus !== 'all' ? `بالحالة "${filterStatus}"` : ''}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Appointment Details Modal */}
      {showModal && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>تفاصيل الحجز</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="appointment-details">
                <div className="detail-group">
                  <h3>معلومات المريض</h3>
                  <p><strong>الاسم:</strong> {selectedAppointment.name}</p>
                  <p><strong>البريد الإلكتروني:</strong> {selectedAppointment.email}</p>
                  <p><strong>رقم الهاتف:</strong> {selectedAppointment.phone}</p>
                </div>
                
                <div className="detail-group">
                  <h3>تفاصيل الموعد</h3>
                  <p><strong>الخدمة:</strong> {selectedAppointment.service}</p>
                  <p><strong>التاريخ:</strong> {new Date(selectedAppointment.date).toLocaleDateString('ar-EG')}</p>
                  <p><strong>الوقت:</strong> {selectedAppointment.time}</p>
                  <p><strong>الحالة:</strong> 
                    <span className={`status-badge ${getStatusColor(selectedAppointment.status)}`}>
                      {selectedAppointment.status === 'pending' && 'في الانتظار'}
                      {selectedAppointment.status === 'confirmed' && 'مؤكدة'}
                      {selectedAppointment.status === 'cancelled' && 'ملغية'}
                      {selectedAppointment.status === 'completed' && 'مكتملة'}
                    </span>
                  </p>
                </div>
                
                {selectedAppointment.message && (
                  <div className="detail-group">
                    <h3>رسالة إضافية</h3>
                    <p>{selectedAppointment.message}</p>
                  </div>
                )}
                
                <div className="detail-group">
                  <h3>معلومات إضافية</h3>
                  <p><strong>تاريخ الحجز:</strong> {new Date(selectedAppointment.createdAt).toLocaleString('ar-EG')}</p>
                  <p><strong>رقم الحجز:</strong> {selectedAppointment._id}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;