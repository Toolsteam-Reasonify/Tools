import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, 
  BookOpen, 
  PenTool, 
  Globe, 
  Languages, 
  ChevronDown,
  Check
} from 'lucide-react';

// --- Types ---
type Mode = 'learn' | 'practice' | 'applications';
type Language = 'en' | 'hi' | 'gu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// --- Translations ---
const translations = {
  en: {
    title: 'Water Cycle',
    learn: 'Learn',
    practice: 'Practice',
    realWorld: 'Real World',
    selectLanguage: 'Select Language',
    english: 'English',
    hindi: 'Hindi',
    gujarati: 'Gujarati',
  },
  hi: {
    title: 'जल चक्र',
    learn: 'सीखें',
    practice: 'अभ्यास',
    realWorld: 'वास्तविक दुनिया',
    selectLanguage: 'भाषा चुनें',
    english: 'अंग्रेज़ी',
    hindi: 'हिंदी',
    gujarati: 'गुजराती',
  },
  gu: {
    title: 'જળ ચક્ર',
    learn: 'શીખો',
    practice: 'અભ્યાસ',
    realWorld: 'વાસ્તવિક દુનિયા',
    selectLanguage: 'ભાષા પસંદ કરો',
    english: 'અંગ્રેજી',
    hindi: 'હિન્દી',
    gujarati: 'ગુજરાતી',
  }
};

// --- Context & Provider ---
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// --- Components ---

const Navbar: React.FC<{ mode: Mode; setMode: (mode: Mode) => void }> = ({ mode, setMode }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: t('english') },
    { code: 'hi', label: t('hindi') },
    { code: 'gu', label: t('gujarati') },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 px-6 py-3">
        {/* Brand/Title */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-xl shadow-inner">
            <Droplets className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            {t('title')}
          </h1>
        </div>

        {/* Mode Selectors */}
        <div className="hidden md:flex items-center bg-gray-100/50 p-1 rounded-xl border border-gray-200">
          {[
            { id: 'learn', label: t('learn'), icon: BookOpen },
            { id: 'practice', label: t('practice'), icon: PenTool },
            { id: 'applications', label: t('realWorld'), icon: Globe },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMode(item.id as Mode)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                mode === item.id 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <item.icon size={18} />
              <span className="font-medium">{item.label}</span>
              {mode === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10 border border-blue-100"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Languages size={18} className="text-blue-500" />
            <span className="font-medium text-gray-700">
              {languages.find(l => l.code === language)?.label}
            </span>
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsLangOpen(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden"
                >
                  <div className="p-2 space-y-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                          language === lang.code 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <span className="font-medium">{lang.label}</span>
                        {language === lang.code && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

// --- Main Component ---
interface WaterCycleLearningProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const WaterCycleLearning: React.FC<WaterCycleLearningProps> = ({ mode, setMode }) => {
  return (
    <div className="min-h-screen bg-transparent">
      <Navbar mode={mode} setMode={setMode} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
              {mode === 'learn' && 'Welcome to Learning Mode'}
              {mode === 'practice' && 'Ready to Practice?'}
              {mode === 'applications' && 'Real World Applications'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Select a mode from the navbar to start exploring the journey of water through our ecosystem.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default WaterCycleLearning;
