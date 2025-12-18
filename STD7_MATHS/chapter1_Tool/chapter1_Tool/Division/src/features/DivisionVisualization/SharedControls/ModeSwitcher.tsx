import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function ModeSwitcher() {
  const { t, language, setLanguage, isTransitioning } = useLanguage();
  const location = useLocation();
  const isDemo = location.pathname === '/' || location.pathname.startsWith('/learn');
  const isPractice = location.pathname.startsWith('/practice');
  const isAssessment = location.pathname.startsWith('/assessment');
  const isReal = location.pathname.startsWith('/real-world');

  return (
    <div className="flex items-center gap-4">
      {/* Enhanced Mode Navigation */}
      <div className={`inline-flex rounded-2xl overflow-hidden border-2 border-white/40 bg-gradient-to-r from-white/20 via-white/15 to-white/20 backdrop-blur-md px-1.5 py-1 shadow-lg transition-all duration-500 ${
        isTransitioning ? 'scale-95 opacity-70 blur-sm' : 'scale-100 opacity-100 blur-none'
      }`}>
        <Link 
          to="/" 
          className={`group relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-xl transform hover:scale-105 ${
            isDemo 
              ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-lg scale-105' 
              : 'text-white hover:bg-white/20 hover:text-teal-100'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">📚</span>
            <span>{t('learn')}</span>
          </div>
          {isDemo && <div className="absolute inset-0 bg-gradient-to-r from-teal-400/30 to-purple-400/30 rounded-xl animate-pulse" />}
        </Link>
        
        <Link 
          to="/practice" 
          className={`group relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-xl transform hover:scale-105 ${
            isPractice 
              ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white shadow-lg scale-105' 
              : 'text-white hover:bg-white/20 hover:text-purple-100'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">🎯</span>
            <span>{t('practice')}</span>
          </div>
          {isPractice && <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-teal-400/30 rounded-xl animate-pulse" />}
        </Link>
        


        <Link 
          to="/real-world" 
          className={`group relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-xl transform hover:scale-105 ${
            isReal 
              ? 'bg-gradient-to-r from-teal-500 to-indigo-500 text-white shadow-lg scale-105' 
              : 'text-white hover:bg-white/20 hover:text-teal-100'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">🌍</span>
            <span>{t('realWorld')}</span>
          </div>
          {isReal && <div className="absolute inset-0 bg-gradient-to-r from-teal-400/30 to-indigo-400/30 rounded-xl animate-pulse" />}
        </Link>
      </div>

      {/* Clean Language Selector */}
      <div className="relative">
        <select 
          className={`appearance-none bg-white/90 text-gray-800 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 border border-white/30 shadow-md transition-all duration-300 cursor-pointer ${
            isTransitioning ? 'opacity-70' : 'opacity-100 hover:shadow-lg'
          }`} 
          value={language} 
          onChange={(e) => setLanguage(e.target.value as any)}
        >
          <option value="en">🇺🇸 English</option>
          <option value="hi">🇮🇳 हिंदी</option>
          <option value="gu">🇮🇳 ગુજરાતી</option>
        </select>
        
        {/* Simple Dropdown Arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {/* Simple Loading Indicator */}
        {isTransitioning && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}