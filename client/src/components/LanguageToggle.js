import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Update document direction for RTL support
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  const currentLanguage = i18n.language;

  return (
    <div className="language-toggle">
      <button
        className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
        title={t('language.en')}
      >
        {t('language.en')}
      </button>
      <button
        className={`lang-btn ${currentLanguage === 'ar' ? 'active' : ''}`}
        onClick={() => changeLanguage('ar')}
        title={t('language.ar')}
      >
        {t('language.ar')}
      </button>
    </div>
  );
};

export default LanguageToggle;