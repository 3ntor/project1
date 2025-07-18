import React, { useState, useEffect } from 'react';
import './DoctorProfile.css';

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, using mock data
    // In real app, fetch from API
    const mockDoctor = {
      name: "د. أحمد محمد",
      specialization: "أخصائي نفسي",
      bio: "أخصائي نفسي معتمد مع أكثر من 15 عام من الخبرة في مجال العلاج النفسي والاستشارات الأسرية. متخصص في علاج الاكتئاب والقلق واضطرابات ما بعد الصدمة.",
      experience: 15,
      education: "دكتوراه في علم النفس الإكلينيكي - جامعة القاهرة",
      profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      certificates: [
        {
          name: "دكتوراه في علم النفس الإكلينيكي",
          institution: "جامعة القاهرة",
          year: 2015,
          image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
          name: "ماجستير في العلاج المعرفي السلوكي",
          institution: "جامعة عين شمس",
          year: 2012,
          image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
          name: "دبلومة في العلاج الأسري",
          institution: "المعهد المصري للعلاج النفسي",
          year: 2018,
          image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        }
      ],
      services: [
        {
          name: "العلاج الفردي",
          description: "جلسات علاج نفسي فردية لمعالجة الاكتئاب والقلق والضغوط النفسية",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80",
          price: 500,
          duration: "60 دقيقة"
        },
        {
          name: "العلاج الأسري",
          description: "جلسات علاج أسري لحل المشاكل الأسرية وتحسين التواصل بين أفراد الأسرة",
          image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
          price: 800,
          duration: "90 دقيقة"
        },
        {
          name: "العلاج المعرفي السلوكي",
          description: "علاج متخصص لتغيير الأنماط الفكرية والسلوكية السلبية",
          image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
          price: 600,
          duration: "75 دقيقة"
        }
      ]
    };

    setDoctor(mockDoctor);
    setLoading(false);
  }, []);

  const handleBookService = (service) => {
    // Store selected service in localStorage for booking page
    localStorage.setItem('selectedService', JSON.stringify(service));
    window.location.href = '/book-appointment';
  };

  if (loading) {
    return (
      <div className="doctor-profile-loading">
        <div className="loading-spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="doctor-profile">
      <div className="doctor-profile-header">
        <div className="doctor-profile-image">
          <img src={doctor.profileImage} alt={doctor.name} />
        </div>
        <div className="doctor-profile-info">
          <h1>{doctor.name}</h1>
          <h2>{doctor.specialization}</h2>
          <p className="doctor-bio">{doctor.bio}</p>
          <div className="doctor-stats">
            <div className="stat">
              <span className="stat-number">{doctor.experience}</span>
              <span className="stat-label">سنوات الخبرة</span>
            </div>
            <div className="stat">
              <span className="stat-number">{doctor.certificates.length}</span>
              <span className="stat-label">شهادة</span>
            </div>
            <div className="stat">
              <span className="stat-number">{doctor.services.length}</span>
              <span className="stat-label">خدمة</span>
            </div>
          </div>
        </div>
      </div>

      <div className="doctor-profile-sections">
        {/* Education Section */}
        <section className="education-section">
          <h3>المؤهلات العلمية</h3>
          <div className="education-content">
            <p><strong>التعليم:</strong> {doctor.education}</p>
          </div>
        </section>

        {/* Certificates Section */}
        <section className="certificates-section">
          <h3>الشهادات والدبلومات</h3>
          <div className="certificates-grid">
            {doctor.certificates.map((cert, index) => (
              <div key={index} className="certificate-card">
                <div className="certificate-image">
                  <img src={cert.image} alt={cert.name} />
                </div>
                <div className="certificate-info">
                  <h4>{cert.name}</h4>
                  <p>{cert.institution}</p>
                  <span className="certificate-year">{cert.year}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <h3>الخدمات المقدمة</h3>
          <div className="services-grid">
            {doctor.services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-image">
                  <img src={service.image} alt={service.name} />
                </div>
                <div className="service-content">
                  <h4>{service.name}</h4>
                  <p>{service.description}</p>
                  <div className="service-details">
                    <span className="service-price">{service.price} جنيه</span>
                    <span className="service-duration">{service.duration}</span>
                  </div>
                  <button 
                    className="book-service-btn"
                    onClick={() => handleBookService(service)}
                  >
                    احجز الآن
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorProfile;