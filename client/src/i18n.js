import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en/translation.json';
import arTranslations from './locales/ar/translation.json';

const resources = {
  en: {
    translation: enTranslations
  },
  ar: {
    translation: arTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      order: ['navigator', 'localStorage', 'htmlTag'],
      caches: ['localStorage'],
      checkWhitelist: true
    },
    
    // تهيئة اللغة العربية كالتالي:
    lng: 'ar',
    fallbackLng: 'ar',
    
    // تهيئة اللغة العربية بشكل صحيح
    direction: 'rtl',
    defaultNS: 'translation',
    
    interpolation: {
      escapeValue: false, // React already escapes values
      formatSeparator: ','
    },
  });

export default i18n;