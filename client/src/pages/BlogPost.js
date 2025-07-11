import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendar, FaClock, FaEye, FaHeart, FaUser, FaArrowLeft, FaShare, FaBookmark } from 'react-icons/fa';
import axios from 'axios';
import './BlogPost.css';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      // In real app, fetch from API
      // const response = await axios.get(`http://localhost:5000/api/blog/${id}`);
      // setPost(response.data);
      
      // Mock data for demo
      const mockPost = {
        _id: id,
        title: 'كيفية التغلب على الاكتئاب: دليل شامل ومفصل',
        excerpt: 'اكتشف الطرق العلمية والفعالة للتغلب على الاكتئاب وتحسين صحتك النفسية من خلال هذا الدليل الشامل الذي يغطي جميع الجوانب المهمة.',
        content: `
          <h2>ما هو الاكتئاب؟</h2>
          <p>الاكتئاب هو اضطراب نفسي شائع يؤثر على المزاج والتفكير والسلوك. يمكن أن يسبب مشاعر حزن مستمرة وفقدان الاهتمام بالأنشطة التي كانت ممتعة في السابق.</p>
          
          <h3>أعراض الاكتئاب</h3>
          <ul>
            <li>مشاعر حزن أو فراغ مستمرة</li>
            <li>فقدان الاهتمام بالأنشطة المفضلة</li>
            <li>تغيرات في الشهية والوزن</li>
            <li>مشاكل في النوم</li>
            <li>التعب وفقدان الطاقة</li>
            <li>صعوبة في التركيز واتخاذ القرارات</li>
            <li>مشاعر اليأس أو الذنب</li>
            <li>أفكار انتحارية</li>
          </ul>

          <h2>أسباب الاكتئاب</h2>
          <p>الاكتئاب لا يحدث بسبب عامل واحد فقط، بل هو نتيجة تفاعل معقد بين عدة عوامل:</p>
          
          <h3>العوامل البيولوجية</h3>
          <p>تشمل التغيرات في كيمياء المخ والهرمونات والجينات الوراثية التي قد تزيد من خطر الإصابة بالاكتئاب.</p>
          
          <h3>العوامل النفسية</h3>
          <p>تشمل الشخصية والطريقة التي نتعامل بها مع الضغوط والتجارب السابقة.</p>
          
          <h3>العوامل البيئية</h3>
          <p>تشمل الأحداث الحياتية المجهدة مثل فقدان شخص عزيز أو المشاكل المالية أو العمل.</p>

          <h2>طرق العلاج</h2>
          
          <h3>1. العلاج النفسي</h3>
          <p>العلاج النفسي، وخاصة العلاج المعرفي السلوكي، يمكن أن يساعد في:</p>
          <ul>
            <li>تحديد الأفكار السلبية وتغييرها</li>
            <li>تطوير مهارات التأقلم</li>
            <li>تحسين العلاقات الاجتماعية</li>
            <li>تطوير استراتيجيات لحل المشاكل</li>
          </ul>

          <h3>2. العلاج الدوائي</h3>
          <p>يمكن أن تساعد مضادات الاكتئاب في تحسين المزاج وتقليل الأعراض. من المهم استشارة طبيب نفسي لتحديد الدواء المناسب.</p>

          <h3>3. تغييرات نمط الحياة</h3>
          <p>يمكن أن تساعد التغييرات التالية في تحسين الأعراض:</p>
          <ul>
            <li>ممارسة التمارين الرياضية بانتظام</li>
            <li>الحصول على قسط كافٍ من النوم</li>
            <li>تناول نظام غذائي صحي</li>
            <li>تجنب الكحول والمخدرات</li>
            <li>ممارسة تقنيات الاسترخاء</li>
          </ul>

          <h2>نصائح للتغلب على الاكتئاب</h2>
          
          <h3>1. ابحث عن الدعم</h3>
          <p>لا تتردد في طلب المساعدة من الأصدقاء والعائلة أو من متخصص في الصحة النفسية.</p>
          
          <h3>2. مارس الأنشطة المفضلة</h3>
          <p>حاول العودة تدريجياً إلى الأنشطة التي كنت تستمتع بها، حتى لو لم تكن تشعر بالرغبة في ذلك.</p>
          
          <h3>3. حدد أهدافاً صغيرة</h3>
          <p>ابدأ بأهداف صغيرة وقابلة للتحقيق، واحتفل بإنجازاتك مهما كانت صغيرة.</p>
          
          <h3>4. اعتن بنفسك</h3>
          <p>تأكد من الحصول على قسط كافٍ من النوم وتناول الطعام الصحي وممارسة التمارين الرياضية.</p>

          <h2>متى تطلب المساعدة الطبية؟</h2>
          <p>يجب طلب المساعدة الطبية فوراً إذا كنت تعاني من:</p>
          <ul>
            <li>أفكار انتحارية</li>
            <li>أعراض شديدة تؤثر على حياتك اليومية</li>
            <li>أعراض تستمر لأكثر من أسبوعين</li>
            <li>صعوبة في العمل أو الدراسة</li>
          </ul>

          <h2>الخلاصة</h2>
          <p>الاكتئاب حالة قابلة للعلاج، والمساعدة متاحة دائماً. لا تتردد في طلب المساعدة إذا كنت تعاني من أعراض الاكتئاب. تذكر أنك لست وحدك وأن هناك أمل في الشفاء.</p>
        `,
        featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        category: 'depression',
        tags: ['اكتئاب', 'صحة نفسية', 'علاج', 'مزاج'],
        readTime: 12,
        views: 1250,
        likes: 89,
        publishedAt: '2024-01-15T10:00:00Z',
        author: { 
          name: 'د. أحمد محمد', 
          specialization: 'أخصائي نفسي',
          bio: 'أخصائي نفسي معتمد مع أكثر من 15 عام من الخبرة في مجال العلاج النفسي والاستشارات الأسرية.'
        }
      };

      const mockRelatedPosts = [
        {
          _id: '2',
          title: 'تقنيات إدارة القلق والتوتر',
          excerpt: 'تعلم تقنيات عملية وفعالة لإدارة القلق والتوتر في حياتك اليومية.',
          featuredImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          category: 'anxiety',
          readTime: 6,
          views: 980,
          publishedAt: '2024-01-12T14:30:00Z'
        },
        {
          _id: '3',
          title: 'أهمية الرعاية الذاتية للصحة النفسية',
          excerpt: 'تعرف على أهمية الرعاية الذاتية وكيفية تطبيقها في حياتك اليومية.',
          featuredImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1220&q=80',
          category: 'self-care',
          readTime: 5,
          views: 432,
          publishedAt: '2024-01-08T16:45:00Z'
        }
      ];

      setPost(mockPost);
      setRelatedPosts(mockRelatedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading post:', error);
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      // In real app, call API
      // await axios.post(`http://localhost:5000/api/blog/${id}/like`);
      setLiked(!liked);
      setPost(prev => ({
        ...prev,
        likes: liked ? prev.likes - 1 : prev.likes + 1
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryInfo = (categoryId) => {
    const categories = {
      'depression': { name: 'الاكتئاب', icon: '😔' },
      'anxiety': { name: 'القلق', icon: '😰' },
      'stress': { name: 'الضغوط النفسية', icon: '😤' },
      'relationships': { name: 'العلاقات', icon: '💕' },
      'self-care': { name: 'الرعاية الذاتية', icon: '🧘' },
      'therapy': { name: 'العلاج النفسي', icon: '🩺' },
      'general': { name: 'عام', icon: '📝' }
    };
    return categories[categoryId] || { name: 'عام', icon: '📝' };
  };

  if (loading) {
    return (
      <div className="blog-post-loading">
        <div className="loading-spinner"></div>
        <p>جاري تحميل المقال...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-post-not-found">
        <h2>المقال غير موجود</h2>
        <p>عذراً، المقال الذي تبحث عنه غير موجود.</p>
        <Link to="/blog" className="back-btn">
          <FaArrowLeft />
          العودة للمدونة
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      {/* Hero Section */}
      <section className="post-hero">
        <div className="hero-image">
          <img src={post.featuredImage} alt={post.title} />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="container">
            <Link to="/blog" className="back-link">
              <FaArrowLeft />
              العودة للمدونة
            </Link>
            
            <div className="post-category">
              <span className="category-icon">{getCategoryInfo(post.category).icon}</span>
              <span className="category-name">{getCategoryInfo(post.category).name}</span>
            </div>
            
            <h1 className="post-title">{post.title}</h1>
            <p className="post-excerpt">{post.excerpt}</p>
            
            <div className="post-meta">
              <div className="meta-item">
                <FaUser />
                <span>{post.author.name}</span>
              </div>
              <div className="meta-item">
                <FaCalendar />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="meta-item">
                <FaClock />
                <span>{post.readTime} دقائق قراءة</span>
              </div>
              <div className="meta-item">
                <FaEye />
                <span>{post.views} مشاهدة</span>
              </div>
            </div>
            
            <div className="post-actions">
              <button 
                className={`like-btn ${liked ? 'liked' : ''}`}
                onClick={handleLike}
              >
                <FaHeart />
                <span>{post.likes}</span>
              </button>
              <button className="share-btn">
                <FaShare />
                مشاركة
              </button>
              <button className="bookmark-btn">
                <FaBookmark />
                حفظ
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Post Content */}
      <section className="post-content">
        <div className="container">
          <div className="content-wrapper">
            {/* Main Content */}
            <div className="main-content">
              <div className="content-body" dangerouslySetInnerHTML={{ __html: post.content }}></div>
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  <h4>العلامات:</h4>
                  <div className="tags-list">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="post-sidebar">
              {/* Author Info */}
              <div className="author-card">
                <h3>عن الكاتب</h3>
                <div className="author-info">
                  <div className="author-avatar">
                    <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt={post.author.name} />
                  </div>
                  <div className="author-details">
                    <h4>{post.author.name}</h4>
                    <p className="author-specialization">{post.author.specialization}</p>
                    <p className="author-bio">{post.author.bio}</p>
                  </div>
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="related-posts">
                  <h3>مقالات ذات صلة</h3>
                  <div className="related-list">
                    {relatedPosts.map(relatedPost => (
                      <Link key={relatedPost._id} to={`/blog/${relatedPost._id}`} className="related-item">
                        <div className="related-image">
                          <img src={relatedPost.featuredImage} alt={relatedPost.title} />
                        </div>
                        <div className="related-content">
                          <h4>{relatedPost.title}</h4>
                          <p>{relatedPost.excerpt}</p>
                          <div className="related-meta">
                            <span>{formatDate(relatedPost.publishedAt)}</span>
                            <span>{relatedPost.readTime} دقائق</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;