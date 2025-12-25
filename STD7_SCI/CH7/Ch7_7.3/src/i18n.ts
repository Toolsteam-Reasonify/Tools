import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

import translationData from './locales/translation.json';

// Extract language-specific translations and merge with base translations
const getLanguageResources = (lang: 'en' | 'hi' | 'gu') => {
  const langSpecific = (translationData as any)[lang] || {};
  const baseTranslations = (translationData as any).translation || {};
  
  // Merge: language-specific translations override base translations
  return {
    ...baseTranslations,
    ...langSpecific,
    // Ensure language and nav are from language-specific section
    language: langSpecific.language || baseTranslations.language,
    nav: langSpecific.nav || baseTranslations.nav,
  };
};

const resources = {
  en: { translation: getLanguageResources('en') },
  hi: { translation: getLanguageResources('hi') },
  gu: { translation: getLanguageResources('gu') },
};

i18n
  .use(ICU)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'gu'],
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    returnObjects: true,
  });

export default i18n;

