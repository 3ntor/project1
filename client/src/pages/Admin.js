import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaCalendar, FaUser, FaBook, FaChartBar } from 'react-icons/fa';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdminUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [contactStats, setContactStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const currentLanguage = i18n.language;

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated() || !isAdminUser()) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [isAuthenticated, isAdminUser, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/dashboard/stats');
      setStats(response.data.stats || {});
      await loadContactStats();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/bookings');
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/blog');
      setBlogPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const loadContactMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/contact/admin');
      setContactMessages(response.data.contacts || []);
    } catch (error) {
      console.error('Error loading contact messages:', error);
      setError('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  const loadContactStats = async () => {
    try {
      const response = await axios.get('/api/contact/admin/stats/overview');
      setContactStats(response.data || {});
    } catch (error) {
      console.error('Error loading contact stats:', error);
    }
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    setError('');
    
    switch (tab) {
      case 'dashboard':
        await loadDashboardData();
        break;
      case 'users':
        await loadUsers();
        break;
      case 'bookings':
        await loadBookings();
        break;
      case 'blog':
        await loadBlogPosts();
        break;
      case 'contacts':
        await loadContactMessages();
        await loadContactStats();
        break;
      default:
        break;
    }
  };

  const handleBookingStatusUpdate = async (bookingId, status) => {
    try {
      await axios.patch(`/api/admin/bookings/${bookingId}/status`, { status });
      // Reload bookings
      await loadBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      setError('Failed to update booking status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm(t('common.confirm'))) {
      try {
        await axios.delete(`/api/admin/users/${userId}`);
        // Reload users
        await loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user');
      }
    }
  };

  const handleDeleteBlogPost = async (postId) => {
    if (window.confirm(t('common.confirm'))) {
      try {
        await axios.delete(`/api/blog/${postId}`);
        // Reload blog posts
        await loadBlogPosts();
        setSuccess(t('admin.blog.deleted') || 'Blog post deleted successfully');
      } catch (error) {
        console.error('Error deleting blog post:', error);
        setError('Failed to delete blog post');
      }
    }
  };

  const handleContactStatusUpdate = async (messageId, status, notes = '') => {
    try {
      await axios.put(`/api/contact/admin/${messageId}/status`, { status, adminNotes: notes });
      await loadContactMessages();
      await loadContactStats();
      setSuccess('Contact message status updated successfully');
    } catch (error) {
      console.error('Error updating contact status:', error);
      setError('Failed to update contact status');
    }
  };

  const handleContactReply = async (messageId, notes) => {
    try {
      await axios.put(`/api/contact/admin/${messageId}/reply`, { adminNotes: notes });
      await loadContactMessages();
      await loadContactStats();
      setSuccess('Contact message marked as replied');
    } catch (error) {
      console.error('Error replying to contact:', error);
      setError('Failed to reply to contact');
    }
  };

  const handleDeleteContact = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this contact message?')) {
      try {
        await axios.delete(`/api/contact/admin/${messageId}`);
        await loadContactMessages();
        await loadContactStats();
        setSuccess('Contact message deleted successfully');
      } catch (error) {
        console.error('Error deleting contact message:', error);
        setError('Failed to delete contact message');
      }
    }
  };

  const handleViewContact = (messageId) => {
    // TODO: Implement contact detail view
    console.log('View contact:', messageId);
  };

  const handleReplyContact = (messageId) => {
    const notes = prompt('أدخل ملاحظات الرد:');
    if (notes) {
      handleContactReply(messageId, notes);
    }
  };

  const handleSearchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/users/search?q=${searchTerm}`);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (serviceFilter) params.append('service', serviceFilter);
      if (dateFilter) params.append('date', dateFilter);
      
      const response = await axios.get(`/api/admin/bookings/search?${params}`);
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error searching bookings:', error);
      setError('Failed to search bookings');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Reload data for the new page
    switch (activeTab) {
      case 'users':
        loadUsers(page);
        break;
      case 'bookings':
        loadBookings(page);
        break;
      case 'blog':
        loadBlogPosts(page);
        break;
      default:
        break;
    }
  };

  const handleViewUser = (userId) => {
    // Navigate to user details page or show modal
    console.log('View user:', userId);
  };

  const handleViewBooking = (bookingId) => {
    // Navigate to booking details page or show modal
    console.log('View booking:', bookingId);
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm(t('common.confirm'))) {
      try {
        await axios.delete(`/api/admin/bookings/${bookingId}`);
        // Reload bookings
        await loadBookings();
        setSuccess(t('admin.bookings.deleted') || 'Booking deleted successfully');
      } catch (error) {
        console.error('Error deleting booking:', error);
        setError('Failed to delete booking');
      }
    }
  };

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

  // Show loading or redirect if not admin
  if (!isAuthenticated() || !isAdminUser()) {
    return (
      <div className="admin-page">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-page ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="admin-container">
        <div className="admin-header">
          <h1>{t('admin.title')}</h1>
          <p>{t('admin.welcome')}</p>
        </div>

        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabChange('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
          >
            {t('admin.sections.users')}
          </button>
          <button
            className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => handleTabChange('bookings')}
          >
            {t('admin.sections.bookings')}
          </button>
          <button
            className={`tab-button ${activeTab === 'blog' ? 'active' : ''}`}
            onClick={() => handleTabChange('blog')}
          >
            {t('admin.sections.blog')}
          </button>
          <button
            className={`tab-button ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => handleTabChange('contacts')}
          >
            رسائل التواصل
          </button>
        </div>

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

        {loading ? (
          <div className="loading">{t('common.loading')}</div>
        ) : (
          <div className="admin-content">
            {activeTab === 'dashboard' && (
              <div className="dashboard-section">
                <h2>{t('admin.dashboard.title') || 'Dashboard Statistics'}</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaUser />
                    </div>
                    <div className="stat-content">
                      <h3>{t('admin.stats.totalUsers')}</h3>
                      <p className="stat-number">{stats.totalUsers || 0}</p>
                      <p className="stat-label">{t('admin.stats.registeredUsers') || 'Registered Users'}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaCalendar />
                    </div>
                    <div className="stat-content">
                      <h3>{t('admin.stats.totalBookings')}</h3>
                      <p className="stat-number">{stats.totalBookings || 0}</p>
                      <p className="stat-label">{t('admin.stats.totalAppointments') || 'Total Appointments'}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaChartBar />
                    </div>
                    <div className="stat-content">
                      <h3>{t('admin.stats.pendingBookings')}</h3>
                      <p className="stat-number">{stats.pendingBookings || 0}</p>
                      <p className="stat-label">{t('admin.stats.pendingAppointments') || 'Pending Appointments'}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaBook />
                    </div>
                    <div className="stat-content">
                      <h3>{t('admin.stats.totalPosts')}</h3>
                      <p className="stat-number">{stats.totalPosts || 0}</p>
                      <p className="stat-label">{t('admin.stats.blogPosts') || 'Blog Posts'}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaUser />
                    </div>
                    <div className="stat-content">
                      <h3>رسائل التواصل</h3>
                      <p className="stat-number">{contactStats.new || 0}</p>
                      <p className="stat-label">رسائل جديدة</p>
                    </div>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="recent-activity">
                  <h3>{t('admin.dashboard.recentActivity') || 'Recent Activity'}</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-icon">
                        <FaCalendar />
                      </div>
                      <div className="activity-content">
                        <p>{t('admin.dashboard.recentBookings') || 'Recent bookings will appear here'}</p>
                        <span className="activity-time">{t('admin.dashboard.noRecentActivity') || 'No recent activity'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="users-section">
                <div className="section-header">
                  <h2>{t('admin.users.title')}</h2>
                  <div className="search-filters">
                    <div className="search-box">
                      <input
                        type="text"
                        placeholder={t('admin.users.searchPlaceholder') || 'Search users...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button onClick={() => handleSearchUsers()}>
                        <FaSearch />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th>{t('admin.users.name')}</th>
                        <th>{t('admin.users.email')}</th>
                        <th>{t('admin.users.phone')}</th>
                        <th>{t('admin.users.joinDate')}</th>
                        <th>{t('admin.users.totalBookings')}</th>
                        <th>{t('admin.users.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id}>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span>{user.name}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>{formatDate(user.createdAt)}</td>
                          <td>
                            <span className="booking-count">
                              {user.totalBookings || 0}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="view-button"
                                onClick={() => handleViewUser(user._id)}
                                title={t('common.view')}
                              >
                                <FaEye />
                              </button>
                              <button
                                className="delete-button"
                                onClick={() => handleDeleteUser(user._id)}
                                title={t('common.delete')}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {users.length === 0 && (
                    <div className="no-data">
                      <p>{t('admin.users.noUsers') || 'No users found'}</p>
                    </div>
                  )}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="page-btn"
                    >
                      {t('common.previous')}
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`page-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="page-btn"
                    >
                      {t('common.next')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bookings-section">
                <div className="section-header">
                  <h2>{t('admin.bookings.title')}</h2>
                  <div className="search-filters">
                    <div className="search-box">
                      <input
                        type="text"
                        placeholder={t('admin.bookings.searchPlaceholder') || 'Search bookings...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button onClick={() => handleSearchBookings()}>
                        <FaSearch />
                      </button>
                    </div>
                    <div className="filters">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filter-select"
                      >
                        <option value="">{t('admin.bookings.allStatuses') || 'All Statuses'}</option>
                        <option value="pending">{t('admin.bookings.pending') || 'Pending'}</option>
                        <option value="confirmed">{t('admin.bookings.confirmed') || 'Confirmed'}</option>
                        <option value="cancelled">{t('admin.bookings.cancelled') || 'Cancelled'}</option>
                      </select>
                      <select
                        value={serviceFilter}
                        onChange={(e) => setServiceFilter(e.target.value)}
                        className="filter-select"
                      >
                        <option value="">{t('admin.bookings.allServices') || 'All Services'}</option>
                        <option value="individual-therapy">{t('services.individualTherapy') || 'Individual Therapy'}</option>
                        <option value="couples-therapy">{t('services.couplesTherapy') || 'Couples Therapy'}</option>
                        <option value="family-therapy">{t('services.familyTherapy') || 'Family Therapy'}</option>
                        <option value="group-therapy">{t('services.groupTherapy') || 'Group Therapy'}</option>
                      </select>
                      <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="filter-date"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bookings-table">
                  <table>
                    <thead>
                      <tr>
                        <th>{t('admin.bookings.user')}</th>
                        <th>{t('admin.bookings.service')}</th>
                        <th>{t('admin.bookings.date')}</th>
                        <th>{t('admin.bookings.time')}</th>
                        <th>{t('admin.bookings.status')}</th>
                        <th>{t('admin.bookings.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking._id}>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">
                                {(booking.user?.name || booking.name).charAt(0).toUpperCase()}
                              </div>
                              <div className="user-details">
                                <span className="user-name">{booking.user?.name || booking.name}</span>
                                <span className="user-email">{booking.user?.email || booking.email}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="service-badge">
                              {t(`services.${booking.service}`) || booking.service}
                            </span>
                          </td>
                          <td>{formatDate(booking.date)}</td>
                          <td>{formatTime(booking.time)}</td>
                          <td>
                            <span className={`status ${booking.status}`}>
                              {t(`admin.bookings.${booking.status}`) || booking.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="view-button"
                                onClick={() => handleViewBooking(booking._id)}
                                title={t('common.view')}
                              >
                                <FaEye />
                              </button>
                              {booking.status === 'pending' && (
                                <button
                                  className="confirm-button"
                                  onClick={() => handleBookingStatusUpdate(booking._id, 'confirmed')}
                                  title={t('admin.bookings.confirm')}
                                >
                                  <FaEdit />
                                </button>
                              )}
                              <button
                                className="delete-button"
                                onClick={() => handleDeleteBooking(booking._id)}
                                title={t('common.delete')}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {bookings.length === 0 && (
                    <div className="no-data">
                      <p>{t('admin.bookings.noBookings') || 'No bookings found'}</p>
                    </div>
                  )}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="page-btn"
                    >
                      {t('common.previous')}
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`page-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="page-btn"
                    >
                      {t('common.next')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'blog' && (
              <div className="blog-section">
                <div className="section-header">
                  <h2>{t('admin.blog.title') || 'Blog Management'}</h2>
                  <Link to="/admin/blog/new" className="add-blog-btn">
                    <FaPlus />
                    {t('blog.addPost') || 'Add New Post'}
                  </Link>
                </div>
                <div className="blog-posts-table">
                  <table>
                    <thead>
                      <tr>
                        <th>{t('admin.blog.title') || 'Title'}</th>
                        <th>{t('admin.blog.category') || 'Category'}</th>
                        <th>{t('admin.blog.status') || 'Status'}</th>
                        <th>{t('admin.blog.views') || 'Views'}</th>
                        <th>{t('admin.blog.publishedAt') || 'Published'}</th>
                        <th>{t('admin.blog.actions') || 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogPosts.map(post => (
                        <tr key={post._id}>
                          <td>{post.title}</td>
                          <td>{post.category}</td>
                          <td>
                            <span className={`status ${post.isPublished ? 'published' : 'draft'}`}>
                              {post.isPublished ? (t('admin.blog.published') || 'Published') : (t('admin.blog.draft') || 'Draft')}
                            </span>
                          </td>
                          <td>{post.views || 0}</td>
                          <td>{post.publishedAt ? formatDate(post.publishedAt) : '-'}</td>
                          <td>
                            <Link to={`/admin/blog/edit/${post._id}`} className="edit-button">
                              {t('common.edit')}
                            </Link>
                            <button
                              className="delete-button"
                              onClick={() => handleDeleteBlogPost(post._id)}
                            >
                              {t('common.delete')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="contacts-section">
                <div className="section-header">
                  <h2>إدارة رسائل التواصل</h2>
                  <div className="contact-stats">
                    <div className="stat-item">
                      <span className="stat-label">إجمالي الرسائل:</span>
                      <span className="stat-value">{contactStats.total || 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">رسائل جديدة:</span>
                      <span className="stat-value new">{contactStats.new || 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">تم الرد عليها:</span>
                      <span className="stat-value replied">{contactStats.replied || 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">رسائل الأسبوع:</span>
                      <span className="stat-value recent">{contactStats.recent || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="contacts-table">
                  <table>
                    <thead>
                      <tr>
                        <th>الاسم</th>
                        <th>البريد الإلكتروني</th>
                        <th>الهاتف</th>
                        <th>الموضوع</th>
                        <th>الحالة</th>
                        <th>التاريخ</th>
                        <th>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactMessages.map(message => (
                        <tr key={message._id} className={`message-row ${message.status}`}>
                          <td>
                            <div className="contact-info">
                              <div className="contact-avatar">
                                {message.name.charAt(0).toUpperCase()}
                              </div>
                              <span>{message.name}</span>
                            </div>
                          </td>
                          <td>{message.email}</td>
                          <td>{message.phone}</td>
                          <td>
                            <div className="message-subject">
                              <span className="subject-text">{message.subject}</span>
                              {message.adminNotes && (
                                <div className="admin-notes">
                                  <small>ملاحظات: {message.adminNotes}</small>
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={`status ${message.status}`}>
                              {message.status === 'new' && 'جديد'}
                              {message.status === 'read' && 'مقروء'}
                              {message.status === 'replied' && 'تم الرد'}
                              {message.status === 'archived' && 'مؤرشف'}
                            </span>
                          </td>
                          <td>{formatDate(message.createdAt)}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="view-button"
                                onClick={() => handleViewContact(message._id)}
                                title="عرض التفاصيل"
                              >
                                <FaEye />
                              </button>
                              {message.status === 'new' && (
                                <button
                                  className="read-button"
                                  onClick={() => handleContactStatusUpdate(message._id, 'read')}
                                  title="تحديد كمقروء"
                                >
                                  <FaEdit />
                                </button>
                              )}
                              {message.status !== 'replied' && (
                                <button
                                  className="reply-button"
                                  onClick={() => handleReplyContact(message._id)}
                                  title="الرد على الرسالة"
                                >
                                  <FaEdit />
                                </button>
                              )}
                              <button
                                className="delete-button"
                                onClick={() => handleDeleteContact(message._id)}
                                title="حذف الرسالة"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {contactMessages.length === 0 && (
                    <div className="no-data">
                      <p>لا توجد رسائل تواصل</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;