import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function ModeSwitcher() {
  const { t, language, setLanguage, isTransitioning } = useLanguage();
  const location = useLocation();

  const isDemo = location.pathname === '/' || location.pathname.startsWith('/demo');
  const isPractice = location.pathname.startsWith('/practice');
  const isReal = location.pathname.startsWith('/real-world');

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Enhanced Mode Navigation */}
      <div className={`inline-flex rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white/40 bg-gradient-to-r from-white/20 via-white/15 to-white/20 backdrop-blur-md px-1 sm:px-1.5 py-1 shadow-lg transition-all duration-500 ${
        isTransitioning ? 'scale-95 opacity-70 blur-sm' : 'scale-100 opacity-100 blur-none'
      }`}>
        <Link 
          to="/" 
          className={`group relative px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 rounded-lg sm:rounded-xl transform hover:scale-105 ${
            isDemo 
              ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg scale-105' 
              : 'text-white hover:bg-white/20 hover:text-brand-100'
          }`}
        >
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-sm sm:text-base md:text-lg">📚</span>
            <span className="hidden xs:inline">{t('learn')}</span>
          </div>
          {isDemo && <div className="absolute inset-0 bg-gradient-to-r from-brand-400/30 to-accent-400/30 rounded-lg sm:rounded-xl animate-pulse" />}
        </Link>
        
        <Link 
          to="/practice" 
          className={`group relative px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 rounded-lg sm:rounded-xl transform hover:scale-105 ${
            isPractice 
              ? 'bg-gradient-to-r from-accent-500 to-brand-500 text-white shadow-lg scale-105' 
              : 'text-white hover:bg-white/20 hover:text-accent-100'
          }`}
        >
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-sm sm:text-base md:text-lg">🎯</span>
            <span className="hidden xs:inline">{t('practice')}</span>
          </div>
          {isPractice && <div className="absolute inset-0 bg-gradient-to-r from-accent-400/30 to-brand-400/30 rounded-lg sm:rounded-xl animate-pulse" />}
        </Link>
        
        <Link 
          to="/real-world" 
          className={`group relative px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 rounded-lg sm:rounded-xl transform hover:scale-105 ${
            isReal 
              ? 'bg-gradient-to-r from-brand-500 to-success-500 text-white shadow-lg scale-105' 
              : 'text-white hover:bg-white/20 hover:text-brand-100'
          }`}
        >
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-sm sm:text-base md:text-lg">🌍</span>
            <span className="hidden xs:inline">{t('realWorld')}</span>
          </div>
          {isReal && <div className="absolute inset-0 bg-gradient-to-r from-brand-400/30 to-success-400/30 rounded-lg sm:rounded-xl animate-pulse" />}
        </Link>
      </div>

      {/* Clean Language Selector */}
      <div className="relative">
        <select 
          className={`appearance-none bg-white/90 text-gray-800 rounded-lg sm:rounded-xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-400 border border-white/30 shadow-md transition-all duration-300 cursor-pointer min-w-0 ${
            isTransitioning ? 'opacity-70' : 'opacity-100 hover:shadow-lg'
          }`} 
          value={language} 
          onChange={(e) => setLanguage(e.target.value as any)}
        >
          <option value="en">🇺🇸 <span className="hidden sm:inline">English</span></option>
          <option value="hi">🇮🇳 <span className="hidden sm:inline">हिंदी</span></option>
          <option value="gu">🇮🇳 <span className="hidden sm:inline">ગુજરાતી</span></option>
        </select>
        
        {/* Simple Dropdown Arrow */}
        {!isTransitioning && (
          <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
        
        {/* Simple Loading Indicator */}
        {isTransitioning && (
          <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}