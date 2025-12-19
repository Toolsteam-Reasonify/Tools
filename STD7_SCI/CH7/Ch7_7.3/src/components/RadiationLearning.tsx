// Consolidated Radiation Learning Component
// This file consolidates all radiation-related components into a single file

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { Language } from '@/interfaces/circuitTypes';

// Import radiation components (these components use the LanguageContext from this file)
import RadiationLearnModeComponent from './ConvectionLearnMode';
import RadiationRealWorldComponent from './RealWorldApplications';
import RadiationPracticeModeComponent from './TopicPracticeMode';

// ============================================================================
// Language Context (inline)
// ============================================================================
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const initialLanguage = (i18n.language?.split('-')[0] as Language) || 'en';
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      const base = (lng?.split('-')[0] as Language) || 'en';
      setLanguageState(base);
    };
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  const handleSetLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// ============================================================================
// Language Selector Component (inline)
// ============================================================================
const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: t('language.en'), flag: '🇬🇧' },
    { code: 'hi', name: t('language.hi'), flag: '🇮🇳' },
    { code: 'gu', name: t('language.gu'), flag: '🇮🇳' },
  ];

  return (
    <div className="relative">
      <select
        aria-label={t('language.selectorLabel')}
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="appearance-none bg-white border-2 border-teal-500 rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 pr-6 sm:pr-8 text-xs sm:text-sm md:text-base text-teal-700 font-medium cursor-pointer hover:border-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 sm:px-2">
        <svg className="fill-current h-3 w-3 sm:h-4 sm:w-4 text-teal-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

// ============================================================================
// Navbar Component (inline)
// ============================================================================
interface NavbarProps {
  mode: 'learn' | 'practice' | 'applications';
  setMode: (mode: 'learn' | 'practice' | 'applications') => void;
}

const Navbar: React.FC<NavbarProps> = ({ mode, setMode }) => {
  const { t } = useLanguage();

  const isLearn = mode === 'learn';
  const isPractice = mode === 'practice';
  const isApplications = mode === 'applications';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 border-b border-teal-200/50 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" aria-hidden="true" />
            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              {t('nav.logo')}
            </span>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              type="button"
              onClick={() => setMode('learn')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                isLearn
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-teal-700 hover:bg-teal-100/50'
              }`}
            >
              <span className="hidden sm:inline">📚 </span>
              <span className="sm:hidden">📚</span>
              <span className="hidden md:inline ml-1">{t('nav.tabs.learn')}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('practice')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                isPractice
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-purple-700 hover:bg-purple-100/50'
              }`}
            >
              <span className="hidden sm:inline">🎯 </span>
              <span className="sm:hidden">🎯</span>
              <span className="hidden md:inline ml-1">{t('nav.tabs.practice')}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('applications')}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                isApplications
                  ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              <span className="hidden sm:inline">🌍 </span>
              <span className="sm:hidden">🌍</span>
              <span className="hidden lg:inline ml-1">{t('nav.tabs.applications')}</span>
            </button>

            <div className="ml-1 sm:ml-2 md:ml-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// ============================================================================
// Main RadiationLearning Component (Router)
// ============================================================================
interface RadiationLearningProps {
  mode: 'learn' | 'practice' | 'applications';
  setMode: (mode: 'learn' | 'practice' | 'applications') => void;
}

const RadiationLearning: React.FC<RadiationLearningProps> = ({ mode, setMode }) => {
  return (
    <>
      <Navbar mode={mode} setMode={setMode} />
      <div className="pt-14 sm:pt-16 px-2 sm:px-3 md:px-4 lg:px-6 pb-4 sm:pb-6">
        {mode === 'practice' && <RadiationPracticeModeComponent />}
        {mode === 'applications' && <RadiationRealWorldComponent />}
        {mode === 'learn' && <RadiationLearnModeComponent />}
      </div>
    </>
  );
};

export default RadiationLearning;
