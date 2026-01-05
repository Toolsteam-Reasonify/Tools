import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

import contentData from './components/content.json';

// Extract translation_keys from content.json
const translations = (contentData as { translation_keys?: Record<string, unknown> }).translation_keys || {};

const resources = {
  en: { translation: translations },
  hi: { translation: translations },
  gu: { translation: translations },
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
    saveMissing: true,
    missingKeyHandler: (lng, _ns, key) => {
      console.warn(`[i18n] Missing translation for key "${key}" in ${lng}`);
    },
  });

export default i18n;

