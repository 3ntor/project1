import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaEnvelope, FaUser, FaPhone, FaCalendar, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './AdminContacts.css';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contact');
      setContacts(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching contacts');
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`http://localhost:5000/api/contact/${id}`);
        fetchContacts(); // Refresh the list
      } catch (error) {
        setError('Error deleting contact message');
      }
    }
  };

  const viewContact = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const filteredContacts = contacts.filter(contact => {
    return contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const stats = {
    total: contacts.length,
    unread: contacts.filter(c => !c.read).length,
    today: contacts.filter(c => {
      const today = new Date().toDateString();
      const contactDate = new Date(c.createdAt).toDateString();
      return today === contactDate;
    }).length
  };

  if (loading) {
    return (
      <div className="admin-contacts-page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-contacts-page">
      {/* Header */}
      <section className="admin-header">
        <div className="container">
          <h1>إدارة رسائل الاتصال</h1>
          <p>عرض وإدارة جميع رسائل المرضى والزوار</p>
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">📧</div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>إجمالي الرسائل</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon unread">📬</div>
              <div className="stat-info">
                <h3>{stats.unread}</h3>
                <p>رسائل جديدة</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon today">📅</div>
              <div className="stat-info">
                <h3>{stats.today}</h3>
                <p>رسائل اليوم</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="search-section">
        <div className="container">
          <div className="search-box">
            <input
              type="text"
              placeholder="البحث بالاسم، البريد الإلكتروني، أو الموضوع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Contacts List */}
      <section className="contacts-section">
        <div className="container">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="contacts-list">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div key={contact._id} className="contact-item">
                  <div className="contact-info">
                    <div className="contact-header">
                      <div className="sender-info">
                        <div className="sender-name">{contact.name}</div>
                        <div className="sender-email">{contact.email}</div>
                      </div>
                      <div className="contact-date">
                        {new Date(contact.createdAt).toLocaleDateString('ar-EG')}
                      </div>
                    </div>
                    <div className="contact-subject">{contact.subject}</div>
                    <div className="contact-preview">
                      {contact.message.substring(0, 100)}...
                    </div>
                  </div>
                  <div className="contact-actions">
                    <button
                      className="action-btn view-btn"
                      onClick={() => viewContact(contact)}
                      title="عرض الرسالة"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => deleteContact(contact._id)}
                      title="حذف الرسالة"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-contacts">
                <p>لا توجد رسائل {searchTerm ? `تطابق البحث "${searchTerm}"` : ''}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Details Modal */}
      {showModal && selectedContact && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>تفاصيل الرسالة</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="contact-details">
                <div className="detail-group">
                  <h3>معلومات المرسل</h3>
                  <p><strong>الاسم:</strong> {selectedContact.name}</p>
                  <p><strong>البريد الإلكتروني:</strong> {selectedContact.email}</p>
                  {selectedContact.phone && (
                    <p><strong>رقم الهاتف:</strong> {selectedContact.phone}</p>
                  )}
                </div>
                
                <div className="detail-group">
                  <h3>تفاصيل الرسالة</h3>
                  <p><strong>الموضوع:</strong> {selectedContact.subject}</p>
                  <p><strong>تاريخ الإرسال:</strong> {new Date(selectedContact.createdAt).toLocaleString('ar-EG')}</p>
                </div>
                
                <div className="detail-group">
                  <h3>محتوى الرسالة</h3>
                  <div className="message-content">
                    {selectedContact.message}
                  </div>
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

export default AdminContacts;