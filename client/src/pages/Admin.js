import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { FaPlus } from 'react-icons/fa';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      } catch (error) {
        console.error('Error deleting blog post:', error);
        setError('Failed to delete blog post');
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
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">{t('common.loading')}</div>
        ) : (
          <div className="admin-content">
            {activeTab === 'dashboard' && (
              <div className="dashboard-section">
                <h2>Dashboard Statistics</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>{t('admin.stats.totalUsers')}</h3>
                    <p className="stat-number">{stats.totalUsers || 0}</p>
                  </div>
                  <div className="stat-card">
                    <h3>{t('admin.stats.totalBookings')}</h3>
                    <p className="stat-number">{stats.totalBookings || 0}</p>
                  </div>
                  <div className="stat-card">
                    <h3>{t('admin.stats.pendingBookings')}</h3>
                    <p className="stat-number">{stats.pendingBookings || 0}</p>
                  </div>
                  <div className="stat-card">
                    <h3>{t('admin.stats.totalPosts')}</h3>
                    <p className="stat-number">{stats.totalPosts || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="users-section">
                <h2>{t('admin.users.title')}</h2>
                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th>{t('admin.users.name')}</th>
                        <th>{t('admin.users.email')}</th>
                        <th>{t('admin.users.phone')}</th>
                        <th>{t('admin.users.joinDate')}</th>
                        <th>{t('admin.users.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>{formatDate(user.createdAt)}</td>
                          <td>
                            <button
                              className="delete-button"
                              onClick={() => handleDeleteUser(user._id)}
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

            {activeTab === 'bookings' && (
              <div className="bookings-section">
                <h2>{t('admin.bookings.title')}</h2>
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
                          <td>{booking.user?.name || booking.name}</td>
                          <td>{booking.service}</td>
                          <td>{formatDate(booking.date)}</td>
                          <td>{formatTime(booking.time)}</td>
                          <td>
                            <span className={`status ${booking.status}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="confirm-button"
                              onClick={() => handleBookingStatusUpdate(booking._id, 'confirmed')}
                            >
                              {t('admin.bookings.confirm')}
                            </button>
                            <button
                              className="cancel-button"
                              onClick={() => handleBookingStatusUpdate(booking._id, 'cancelled')}
                            >
                              {t('admin.bookings.cancel')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;