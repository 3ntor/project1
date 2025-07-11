import React, { useState, useEffect } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, using mock data
    // In real app, fetch from API
    const mockFaqs = [
      {
        _id: '1',
        question: 'كيف يمكنني حجز موعد مع الدكتور؟',
        answer: 'يمكنك حجز موعد من خلال صفحة الحجوزات في الموقع، أو الاتصال بنا مباشرة على الرقم الموجود في صفحة التواصل. سيتم تأكيد الموعد خلال 24 ساعة.',
        category: 'appointments',
        order: 1
      },
      {
        _id: '2',
        question: 'ما هي مدة الجلسة العلاجية؟',
        answer: 'تختلف مدة الجلسة حسب نوع العلاج المطلوب. الجلسات الفردية تستغرق 60 دقيقة، والجلسات الأسرية تستغرق 90 دقيقة، وجلسات العلاج المعرفي السلوكي تستغرق 75 دقيقة.',
        category: 'services',
        order: 2
      },
      {
        _id: '3',
        question: 'هل الجلسات العلاجية سرية؟',
        answer: 'نعم، جميع الجلسات العلاجية سرية تماماً. نحن ملتزمون بحماية خصوصية المرضى ولا نشارك أي معلومات مع أي طرف ثالث إلا بموافقة المريض الكتابية.',
        category: 'general',
        order: 3
      },
      {
        _id: '4',
        question: 'ما هي طرق الدفع المتاحة؟',
        answer: 'نقبل الدفع النقدي في العيادة، والتحويل البنكي، والدفع الإلكتروني عبر البطاقات الائتمانية. يمكنك أيضاً الدفع عبر المحافظ الإلكترونية.',
        category: 'payment',
        order: 4
      },
      {
        _id: '5',
        question: 'هل يمكن إلغاء أو تغيير الموعد؟',
        answer: 'نعم، يمكن إلغاء أو تغيير الموعد قبل 24 ساعة من الموعد المحدد. يرجى الاتصال بنا في أقرب وقت ممكن لإعادة جدولة الموعد.',
        category: 'appointments',
        order: 5
      },
      {
        _id: '6',
        question: 'ما هي أنواع العلاج المتاحة؟',
        answer: 'نقدم مجموعة متنوعة من العلاجات النفسية تشمل: العلاج الفردي، العلاج الأسري، العلاج المعرفي السلوكي، علاج الاكتئاب والقلق، وعلاج اضطرابات ما بعد الصدمة.',
        category: 'services',
        order: 6
      },
      {
        _id: '7',
        question: 'هل الدكتور معتمد ومؤهل؟',
        answer: 'نعم، الدكتور معتمد من نقابة الأطباء المصريين وحاصل على دكتوراه في علم النفس الإكلينيكي من جامعة القاهرة، مع أكثر من 15 عام من الخبرة في مجال العلاج النفسي.',
        category: 'general',
        order: 7
      },
      {
        _id: '8',
        question: 'هل يمكن إجراء جلسات علاجية أونلاين؟',
        answer: 'نعم، نقدم جلسات علاجية أونلاين عبر تطبيقات الفيديو كول. هذه الخدمة متاحة للمرضى الذين لا يستطيعون الحضور شخصياً للعيادة.',
        category: 'services',
        order: 8
      }
    ];

    setFaqs(mockFaqs);
    setLoading(false);
  }, []);

  const categories = [
    { id: 'all', name: 'جميع الأسئلة' },
    { id: 'appointments', name: 'الحجوزات' },
    { id: 'services', name: 'الخدمات' },
    { id: 'payment', name: 'الدفع' },
    { id: 'general', name: 'عام' }
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  if (loading) {
    return (
      <div className="faq-loading">
        <div className="loading-spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="faq-page">
      <div className="faq-header">
        <h1>الأسئلة الشائعة</h1>
        <p>إجابات على أكثر الأسئلة شيوعاً حول خدماتنا وطرق الحجز</p>
      </div>

      <div className="faq-container">
        {/* Category Filter */}
        <div className="faq-categories">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="faq-list">
          {filteredFaqs.length === 0 ? (
            <div className="no-faqs">
              <p>لا توجد أسئلة في هذه الفئة</p>
            </div>
          ) : (
            filteredFaqs.map(faq => (
              <div key={faq._id} className="faq-item">
                <button
                  className={`faq-question ${expandedFaq === faq._id ? 'expanded' : ''}`}
                  onClick={() => toggleFaq(faq._id)}
                >
                  <span>{faq.question}</span>
                  <svg 
                    className={`faq-icon ${expandedFaq === faq._id ? 'rotated' : ''}`}
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M6 9L12 15L18 9" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div className={`faq-answer ${expandedFaq === faq._id ? 'expanded' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact Section */}
        <div className="faq-contact">
          <h3>لم تجد إجابة لسؤالك؟</h3>
          <p>يمكنك التواصل معنا مباشرة وسنكون سعداء بمساعدتك</p>
          <div className="faq-contact-buttons">
            <button 
              className="contact-btn primary"
              onClick={() => window.location.href = '/contact'}
            >
              تواصل معنا
            </button>
            <button 
              className="contact-btn secondary"
              onClick={() => window.location.href = '/book-appointment'}
            >
              احجز موعد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;