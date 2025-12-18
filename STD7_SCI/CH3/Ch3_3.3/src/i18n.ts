import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import gu from './locales/gu.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  gu: { translation: gu },
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

