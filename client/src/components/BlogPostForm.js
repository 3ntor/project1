import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './BlogPostForm.css';

const BlogPostForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated, isAdminUser } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: '',
    tags: '',
    readTime: 5,
    isPublished: false,
    isFeatured: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const currentLanguage = i18n.language;

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated() || !isAdminUser()) {
      navigate('/login');
      return;
    }

    if (id) {
      setIsEditing(true);
      loadBlogPost();
    }
  }, [isAuthenticated, isAdminUser, navigate, id]);

  const loadBlogPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/blog/${id}`);
      const post = response.data;
      
      setFormData({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        featuredImage: post.featuredImage || '',
        category: post.category || '',
        tags: post.tags ? post.tags.join(', ') : '',
        readTime: post.readTime || 5,
        isPublished: post.isPublished || false,
        isFeatured: post.isFeatured || false
      });
    } catch (error) {
      console.error('Error loading blog post:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category) {
      setError(t('blog.form.required') || 'جميع الحقول المطلوبة يجب ملؤها');
      setLoading(false);
      return;
    }

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (isEditing) {
        await axios.put(`/api/blog/${id}`, postData);
        setSuccess(t('blog.form.updated') || 'تم تحديث المقال بنجاح');
      } else {
        await axios.post('/api/blog', postData);
        setSuccess(t('blog.form.created') || 'تم إنشاء المقال بنجاح');
      }

      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error) {
      console.error('Error saving blog post:', error);
      setError(error.response?.data?.message || 'حدث خطأ أثناء حفظ المقال');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'depression', label: t('blog.categories.depression') || 'الاكتئاب' },
    { value: 'anxiety', label: t('blog.categories.anxiety') || 'القلق' },
    { value: 'stress', label: t('blog.categories.stress') || 'الضغوط النفسية' },
    { value: 'relationships', label: t('blog.categories.relationships') || 'العلاقات' },
    { value: 'self-care', label: t('blog.categories.selfCare') || 'الرعاية الذاتية' },
    { value: 'therapy', label: t('blog.categories.therapy') || 'العلاج النفسي' },
    { value: 'general', label: t('blog.categories.general') || 'عام' }
  ];

  if (!isAuthenticated() || !isAdminUser()) {
    return (
      <div className="blog-post-form-page">
        <div className="access-denied">
          <h2>{t('common.accessDenied') || 'Access Denied'}</h2>
          <p>{t('common.adminRequired') || 'You need admin privileges to access this page.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`blog-post-form-page ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="form-container">
        <div className="form-header">
          <h1>{isEditing ? (t('blog.form.editTitle') || 'تعديل المقال') : (t('blog.form.createTitle') || 'إنشاء مقال جديد')}</h1>
          <button 
            onClick={() => navigate('/admin')}
            className="back-button"
          >
            {t('common.back') || 'رجوع'}
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

        <form onSubmit={handleSubmit} className="blog-post-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">{t('blog.form.title') || 'عنوان المقال'}</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder={t('blog.form.titlePlaceholder') || 'أدخل عنوان المقال'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">{t('blog.form.category') || 'الفئة'}</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">{t('blog.form.selectCategory') || 'اختر الفئة'}</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">{t('blog.form.excerpt') || 'ملخص المقال'}</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows="3"
              maxLength="200"
              placeholder={t('blog.form.excerptPlaceholder') || 'أدخل ملخص المقال (حد أقصى 200 حرف)'}
            />
            <span className="char-count">{formData.excerpt.length}/200</span>
          </div>

          <div className="form-group">
            <label htmlFor="content">{t('blog.form.content') || 'محتوى المقال'}</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="15"
              placeholder={t('blog.form.contentPlaceholder') || 'أدخل محتوى المقال'}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="featuredImage">{t('blog.form.featuredImage') || 'الصورة الرئيسية'}</label>
              <input
                type="url"
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                required
                placeholder={t('blog.form.imagePlaceholder') || 'رابط الصورة'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">{t('blog.form.tags') || 'العلامات'}</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder={t('blog.form.tagsPlaceholder') || 'علامات مفصولة بفواصل'}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="readTime">{t('blog.form.readTime') || 'وقت القراءة (دقائق)'}</label>
              <input
                type="number"
                id="readTime"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                min="1"
                max="60"
              />
            </div>

            <div className="form-group">
              <label htmlFor="isFeatured">{t('blog.form.featured') || 'مقال مميز'}</label>
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="isPublished">{t('blog.form.published') || 'منشور'}</label>
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? (t('common.loading') || 'جاري الحفظ...') : (isEditing ? (t('blog.form.update') || 'تحديث المقال') : (t('blog.form.create') || 'إنشاء المقال'))}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="cancel-button"
              disabled={loading}
            >
              {t('common.cancel') || 'إلغاء'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogPostForm;