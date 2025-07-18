import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitch = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switch">
      <button 
        onClick={() => changeLanguage('ar')}
        className={`language-btn ${i18n.language === 'ar' ? 'active' : ''}`}
      >
        AR
      </button>
      <button 
        onClick={() => changeLanguage('en')}
        className={`language-btn ${i18n.language === 'en' ? 'active' : ''}`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitch;
