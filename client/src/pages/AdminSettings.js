import React, { useState } from 'react';
import { FaSave, FaCog, FaUser, FaBell, FaShield, FaPalette, FaDatabase } from 'react-icons/fa';
import './AdminSettings.css';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    clinicName: 'Lyna Psychology Clinic',
    clinicEmail: 'info@lynapsychology.com',
    clinicPhone: '+1 (555) 123-4567',
    clinicAddress: '123 Therapy Street, Wellness City, WC 12345',
    workingHours: '9:00 AM - 6:00 PM',
    timezone: 'UTC-5',
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      newContactAlerts: true
    },
    appearance: {
      theme: 'light',
      language: 'ar',
      fontSize: 'medium'
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('تم حفظ الإعدادات بنجاح!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'general', name: 'إعدادات عامة', icon: <FaCog /> },
    { id: 'notifications', name: 'الإشعارات', icon: <FaBell /> },
    { id: 'appearance', name: 'المظهر', icon: <FaPalette /> },
    { id: 'security', name: 'الأمان', icon: <FaShield /> },
    { id: 'account', name: 'الحساب', icon: <FaUser /> }
  ];

  return (
    <div className="admin-settings-page">
      {/* Header */}
      <section className="admin-header">
        <div className="container">
          <h1>إعدادات النظام</h1>
          <p>تخصيص إعدادات العيادة والنظام</p>
        </div>
      </section>

      <section className="settings-content">
        <div className="container">
          <div className="settings-layout">
            {/* Sidebar */}
            <div className="settings-sidebar">
              <div className="sidebar-tabs">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-name">{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="settings-main">
              <div className="settings-panel">
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="settings-section">
                    <h2>إعدادات العيادة العامة</h2>
                    <div className="settings-form">
                      <div className="form-group">
                        <label>اسم العيادة</label>
                        <input
                          type="text"
                          value={settings.clinicName}
                          onChange={(e) => setSettings(prev => ({ ...prev, clinicName: e.target.value }))}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>البريد الإلكتروني</label>
                        <input
                          type="email"
                          value={settings.clinicEmail}
                          onChange={(e) => setSettings(prev => ({ ...prev, clinicEmail: e.target.value }))}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>رقم الهاتف</label>
                        <input
                          type="tel"
                          value={settings.clinicPhone}
                          onChange={(e) => setSettings(prev => ({ ...prev, clinicPhone: e.target.value }))}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>العنوان</label>
                        <textarea
                          value={settings.clinicAddress}
                          onChange={(e) => setSettings(prev => ({ ...prev, clinicAddress: e.target.value }))}
                          rows="3"
                        />
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>ساعات العمل</label>
                          <input
                            type="text"
                            value={settings.workingHours}
                            onChange={(e) => setSettings(prev => ({ ...prev, workingHours: e.target.value }))}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>المنطقة الزمنية</label>
                          <select
                            value={settings.timezone}
                            onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                          >
                            <option value="UTC-5">UTC-5 (Eastern Time)</option>
                            <option value="UTC-6">UTC-6 (Central Time)</option>
                            <option value="UTC-7">UTC-7 (Mountain Time)</option>
                            <option value="UTC-8">UTC-8 (Pacific Time)</option>
                            <option value="UTC+0">UTC+0 (GMT)</option>
                            <option value="UTC+1">UTC+1 (Central European Time)</option>
                            <option value="UTC+2">UTC+2 (Eastern European Time)</option>
                            <option value="UTC+3">UTC+3 (Arabia Standard Time)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeTab === 'notifications' && (
                  <div className="settings-section">
                    <h2>إعدادات الإشعارات</h2>
                    <div className="settings-form">
                      <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={settings.notifications.emailNotifications}
                            onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                          />
                          <span className="checkmark"></span>
                          إشعارات البريد الإلكتروني
                        </label>
                        <p className="setting-description">استلام إشعارات عبر البريد الإلكتروني للحجوزات الجديدة</p>
                      </div>
                      
                      <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={settings.notifications.smsNotifications}
                            onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                          />
                          <span className="checkmark"></span>
                          إشعارات الرسائل النصية
                        </label>
                        <p className="setting-description">استلام إشعارات عبر الرسائل النصية</p>
                      </div>
                      
                      <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={settings.notifications.appointmentReminders}
                            onChange={(e) => handleSettingChange('notifications', 'appointmentReminders', e.target.checked)}
                          />
                          <span className="checkmark"></span>
                          تذكيرات المواعيد
                        </label>
                        <p className="setting-description">إرسال تذكيرات تلقائية للمرضى قبل المواعيد</p>
                      </div>
                      
                      <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={settings.notifications.newContactAlerts}
                            onChange={(e) => handleSettingChange('notifications', 'newContactAlerts', e.target.checked)}
                          />
                          <span className="checkmark"></span>
                          تنبيهات رسائل الاتصال الجديدة
                        </label>
                        <p className="setting-description">إشعار فوري عند استلام رسائل اتصال جديدة</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeTab === 'appearance' && (
                  <div className="settings-section">
                    <h2>إعدادات المظهر</h2>
                    <div className="settings-form">
                      <div className="form-group">
                        <label>المظهر</label>
                        <select
                          value={settings.appearance.theme}
                          onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                        >
                          <option value="light">فاتح</option>
                          <option value="dark">داكن</option>
                          <option value="auto">تلقائي</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>اللغة</label>
                        <select
                          value={settings.appearance.language}
                          onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                        >
                          <option value="ar">العربية</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>حجم الخط</label>
                        <select
                          value={settings.appearance.fontSize}
                          onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                        >
                          <option value="small">صغير</option>
                          <option value="medium">متوسط</option>
                          <option value="large">كبير</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="settings-section">
                    <h2>إعدادات الأمان</h2>
                    <div className="settings-form">
                      <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={settings.security.twoFactorAuth}
                            onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                          />
                          <span className="checkmark"></span>
                          المصادقة الثنائية
                        </label>
                        <p className="setting-description">تفعيل المصادقة الثنائية لحسابك</p>
                      </div>
                      
                      <div className="form-group">
                        <label>مهلة الجلسة (دقائق)</label>
                        <select
                          value={settings.security.sessionTimeout}
                          onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                        >
                          <option value={15}>15 دقيقة</option>
                          <option value={30}>30 دقيقة</option>
                          <option value={60}>ساعة واحدة</option>
                          <option value={120}>ساعتين</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>انتهاء صلاحية كلمة المرور (أيام)</label>
                        <select
                          value={settings.security.passwordExpiry}
                          onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                        >
                          <option value={30}>30 يوم</option>
                          <option value={60}>60 يوم</option>
                          <option value={90}>90 يوم</option>
                          <option value={180}>180 يوم</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Settings */}
                {activeTab === 'account' && (
                  <div className="settings-section">
                    <h2>إعدادات الحساب</h2>
                    <div className="settings-form">
                      <div className="form-group">
                        <label>اسم المستخدم</label>
                        <input type="text" value="admin" disabled />
                      </div>
                      
                      <div className="form-group">
                        <label>البريد الإلكتروني</label>
                        <input type="email" value="admin@lynapsychology.com" />
                      </div>
                      
                      <div className="form-group">
                        <label>كلمة المرور الحالية</label>
                        <input type="password" placeholder="أدخل كلمة المرور الحالية" />
                      </div>
                      
                      <div className="form-group">
                        <label>كلمة المرور الجديدة</label>
                        <input type="password" placeholder="أدخل كلمة المرور الجديدة" />
                      </div>
                      
                      <div className="form-group">
                        <label>تأكيد كلمة المرور الجديدة</label>
                        <input type="password" placeholder="أعد إدخال كلمة المرور الجديدة" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="settings-actions">
                  <button 
                    className="btn btn-primary save-btn"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <FaSave />
                    {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                  </button>
                  
                  {saveMessage && (
                    <div className="save-message success">
                      {saveMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminSettings;