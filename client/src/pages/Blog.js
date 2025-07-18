import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendar, FaClock, FaEye, FaHeart, FaArrowRight, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import './Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [currentPage, selectedCategory]);

  const loadData = async () => {
    try {
      // Load featured posts for slider
      const featuredResponse = await axios.get('http://localhost:5000/api/blog/featured');
      setFeaturedPosts(featuredResponse.data);

      // Load categories
      const categoriesResponse = await axios.get('http://localhost:5000/api/blog/categories/list');
      setCategories(categoriesResponse.data);

      // Load posts with filters
      const params = {
        page: currentPage,
        limit: 9
      };
      
      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const postsResponse = await axios.get('http://localhost:5000/api/blog', { params });
      setPosts(postsResponse.data.posts);
      setTotalPages(postsResponse.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error loading blog data:', error);
      // Use mock data if API fails
      loadMockData();
    }
  };

  const loadMockData = () => {
    const mockFeaturedPosts = [
      {
        _id: '1',
        title: 'كيفية التغلب على الاكتئاب: دليل شامل',
        excerpt: 'اكتشف الطرق العلمية والفعالة للتغلب على الاكتئاب وتحسين صحتك النفسية من خلال هذا الدليل الشامل.',
        featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        category: 'depression',
        readTime: 8,
        views: 1250,
        likes: 89,
        publishedAt: '2024-01-15T10:00:00Z',
        author: { name: 'د. أحمد محمد', specialization: 'أخصائي نفسي' }
      },
      {
        _id: '2',
        title: 'تقنيات إدارة القلق والتوتر',
        excerpt: 'تعلم تقنيات عملية وفعالة لإدارة القلق والتوتر في حياتك اليومية وتحسين جودة حياتك.',
        featuredImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        category: 'anxiety',
        readTime: 6,
        views: 980,
        likes: 67,
        publishedAt: '2024-01-12T14:30:00Z',
        author: { name: 'د. أحمد محمد', specialization: 'أخصائي نفسي' }
      },
      {
        _id: '3',
        title: 'بناء علاقات صحية: أسس التواصل الفعال',
        excerpt: 'اكتشف أسس بناء العلاقات الصحية والتواصل الفعال مع الآخرين لتحسين حياتك الاجتماعية.',
        featuredImage: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
        category: 'relationships',
        readTime: 7,
        views: 756,
        likes: 45,
        publishedAt: '2024-01-10T09:15:00Z',
        author: { name: 'د. أحمد محمد', specialization: 'أخصائي نفسي' }
      }
    ];

    const mockPosts = [
      {
        _id: '4',
        title: 'أهمية الرعاية الذاتية للصحة النفسية',
        excerpt: 'تعرف على أهمية الرعاية الذاتية وكيفية تطبيقها في حياتك اليومية لتحسين صحتك النفسية.',
        featuredImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1220&q=80',
        category: 'self-care',
        readTime: 5,
        views: 432,
        likes: 23,
        publishedAt: '2024-01-08T16:45:00Z',
        author: { name: 'د. أحمد محمد', specialization: 'أخصائي نفسي' }
      },
      {
        _id: '5',
        title: 'العلاج المعرفي السلوكي: دليل شامل',
        excerpt: 'تعرف على العلاج المعرفي السلوكي وكيفية تطبيقه في علاج المشاكل النفسية المختلفة.',
        featuredImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80',
        category: 'therapy',
        readTime: 10,
        views: 654,
        likes: 34,
        publishedAt: '2024-01-05T11:20:00Z',
        author: { name: 'د. أحمد محمد', specialization: 'أخصائي نفسي' }
      },
      {
        _id: '6',
        title: 'كيفية التعامل مع الضغوط اليومية',
        excerpt: 'تعلم طرق فعالة للتعامل مع الضغوط اليومية والحفاظ على توازنك النفسي.',
        featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        category: 'stress',
        readTime: 6,
        views: 543,
        likes: 28,
        publishedAt: '2024-01-03T13:10:00Z',
        author: { name: 'د. أحمد محمد', specialization: 'أخصائي نفسي' }
      }
    ];

    const mockCategories = [
      { id: 'depression', name: 'الاكتئاب', icon: '😔' },
      { id: 'anxiety', name: 'القلق', icon: '😰' },
      { id: 'stress', name: 'الضغوط النفسية', icon: '😤' },
      { id: 'relationships', name: 'العلاقات', icon: '💕' },
      { id: 'self-care', name: 'الرعاية الذاتية', icon: '🧘' },
      { id: 'therapy', name: 'العلاج النفسي', icon: '🩺' },
      { id: 'general', name: 'عام', icon: '📝' }
    ];

    setFeaturedPosts(mockFeaturedPosts);
    setPosts(mockPosts);
    setCategories(mockCategories);
    setTotalPages(3);
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || { name: 'عام', icon: '📝' };
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchTerm);
  };

  if (loading) {
    return (
      <div className="blog-loading">
        <div className="loading-spinner"></div>
        <p>جاري تحميل المقالات...</p>
      </div>
    );
  }

  return (
    <div className="blog-page">
      {/* Hero Section with Slider */}
      <section className="blog-hero">
        <div className="hero-slider">
          {featuredPosts.map((post, index) => (
            <div key={post._id} className={`slide ${index === 0 ? 'active' : ''}`}>
              <div className="slide-image">
                <img src={post.featuredImage} alt={post.title} />
                <div className="slide-overlay"></div>
              </div>
              <div className="slide-content">
                <div className="container">
                  <div className="slide-category">
                    <span className="category-icon">{getCategoryInfo(post.category).icon}</span>
                    <span className="category-name">{getCategoryInfo(post.category).name}</span>
                  </div>
                  <h1 className="slide-title">{post.title}</h1>
                  <p className="slide-excerpt">{post.excerpt}</p>
                  <div className="slide-meta">
                    <span className="meta-item">
                      <FaCalendar />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="meta-item">
                      <FaClock />
                      {post.readTime} دقائق قراءة
                    </span>
                    <span className="meta-item">
                      <FaEye />
                      {post.views} مشاهدة
                    </span>
                  </div>
                  <Link to={`/blog/${post._id}`} className="slide-btn">
                    اقرأ المزيد
                    <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Slider Navigation */}
        <div className="slider-nav">
          {featuredPosts.map((_, index) => (
            <button key={index} className={`nav-dot ${index === 0 ? 'active' : ''}`}></button>
          ))}
        </div>
      </section>

      {/* Blog Content */}
      <section className="blog-content">
        <div className="container">
          {/* Filters and Search */}
          <div className="blog-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="ابحث في المقالات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={handleSearch}>
                <FaSearch />
              </button>
            </div>
            
            <div className="category-filters">
              <button
                className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
                onClick={() => handleCategoryFilter('')}
              >
                جميع المقالات
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategoryFilter(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="blog-grid">
            {posts.map(post => (
              <article key={post._id} className="blog-card">
                <div className="blog-card-image">
                  <img src={post.featuredImage} alt={post.title} />
                  <div className="card-category">
                    <span className="category-icon">{getCategoryInfo(post.category).icon}</span>
                    <span className="category-name">{getCategoryInfo(post.category).name}</span>
                  </div>
                </div>
                
                <div className="blog-card-content">
                  <div className="card-meta">
                    <span className="meta-item">
                      <FaCalendar />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="meta-item">
                      <FaClock />
                      {post.readTime} دقائق
                    </span>
                  </div>
                  
                  <h3 className="card-title">{post.title}</h3>
                  <p className="card-excerpt">{post.excerpt}</p>
                  
                  <div className="card-footer">
                    <div className="card-stats">
                      <span className="stat-item">
                        <FaEye />
                        {post.views}
                      </span>
                      <span className="stat-item">
                        <FaHeart />
                        {post.likes}
                      </span>
                    </div>
                    
                    <Link to={`/blog/${post._id}`} className="read-more-btn">
                      اقرأ المزيد
                      <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;