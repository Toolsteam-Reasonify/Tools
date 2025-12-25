import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

import translations from './locales/translation.json';

const resources = {
  en: { translation: translations.en },
  hi: { translation: translations.hi },
  gu: { translation: translations.gu },
};

// Initialize i18n with proper error handling
if (!i18n.isInitialized) {
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
    })
    .catch((error) => {
      console.error('i18n initialization error:', error);
    });
}

export default i18n;

