import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Language } from '@/interfaces/circuitTypes';
import { translations } from '@/utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | number, options?: Intl.DateTimeFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
  locale: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language to locale mapping
const languageToLocale: Record<Language, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  gu: 'gu-IN',
};

// Missing keys tracker
const missingKeys = new Set<string>();
const missingKeysLog: Record<string, string[]> = {};

const logMissingKey = (key: string, language: Language) => {
  if (!missingKeysLog[language]) {
    missingKeysLog[language] = [];
  }
  if (!missingKeysLog[language].includes(key)) {
    missingKeysLog[language].push(key);
    console.warn(`[i18n] Missing translation key: "${key}" for language: ${language}`);
  }
  missingKeys.add(key);
};

// Get language from URL parameter
const getLanguageFromURL = (): Language | null => {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  if (lang === 'hi' || lang === 'gu' || lang === 'en') {
    return lang as Language;
  }
  return null;
};

// Get language from localStorage
const getLanguageFromStorage = (): Language | null => {
  try {
    const stored = localStorage.getItem('app-language');
    if (stored === 'hi' || stored === 'gu' || stored === 'en') {
      return stored as Language;
    }
  } catch (e) {
    console.warn('Failed to read language from localStorage:', e);
  }
  return null;
};

// Get initial language
const getInitialLanguage = (): Language => {
  return getLanguageFromURL() || getLanguageFromStorage() || 'en';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // Set initial HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Save to localStorage and update URL when language changes
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('app-language', lang);
    } catch (e) {
      console.warn('Failed to save language to localStorage:', e);
    }

    // Update URL parameter without reload
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());

    // Update HTML lang attribute for accessibility
    document.documentElement.lang = lang;
  }, []);

  // Handle URL parameter changes
  useEffect(() => {
    const handlePopState = () => {
      const langFromURL = getLanguageFromURL();
      if (langFromURL && langFromURL !== language) {
        setLanguage(langFromURL);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [language, setLanguage]);

  // Translation function with interpolation support
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language]?.[key];
    
    // Fallback to English if translation is missing
    if (!translation) {
      translation = translations.en?.[key];
      if (!translation) {
        logMissingKey(key, language);
        return key; // Return key as last resort
      }
      // Log fallback usage
      if (language !== 'en') {
        console.warn(`[i18n] Using English fallback for key: "${key}" in language: ${language}`);
      }
    }

    // Simple interpolation: replace {variable} with values
    if (params) {
      return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return translation;
  }, [language]);

  // Number formatting
  const formatNumber = useCallback((value: number, options?: Intl.NumberFormatOptions): string => {
    const locale = languageToLocale[language];
    return new Intl.NumberFormat(locale, options).format(value);
  }, [language]);

  // Date formatting
  const formatDate = useCallback((date: Date | number, options?: Intl.DateTimeFormatOptions): string => {
    const locale = languageToLocale[language];
    const dateObj = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  }, [language]);

  // Currency formatting
  const formatCurrency = useCallback((value: number, currency: string = 'INR'): string => {
    const locale = languageToLocale[language];
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  }, [language]);

  // Expose missing keys for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__i18nMissingKeys = missingKeysLog;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__getMissingKeys = () => {
        console.table(missingKeysLog);
        return missingKeysLog;
      };
    }
  }, []);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    formatNumber,
    formatDate,
    formatCurrency,
    locale: languageToLocale[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Export utility to get missing keys
// eslint-disable-next-line react-refresh/only-export-components
export const getMissingTranslationKeys = (): Record<string, string[]> => {
  return { ...missingKeysLog };
};
