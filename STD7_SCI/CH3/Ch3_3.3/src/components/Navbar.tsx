import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMode } from '@/contexts/ModeContext';
import LanguageSelector from './LanguageSelector';

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { currentMode, setCurrentMode } = useMode();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const isApplicationsPage = location.pathname === '/applications';

  const handleModeClick = (mode: 'demonstration' | 'practice') => {
    if (isHomePage) {
      setCurrentMode(mode);
    } else {
      navigate('/');
      // Use setTimeout to ensure navigation happens before mode change
      setTimeout(() => setCurrentMode(mode), 0);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-50 via-purple-50 to-teal-50 border-b border-teal-200/50 shadow-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              ⚡ <span className="hidden xs:inline">{t('nav.logo')}</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2">
            {/* Learn Button */}
            {isHomePage ? (
              <button
                onClick={() => handleModeClick('demonstration')}
                className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all duration-200 ${currentMode === 'demonstration'
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'text-teal-700 hover:bg-teal-100/50'
                  }`}
              >
                📚 <span className="hidden xs:inline">{t('nav.learn')}</span>
              </button>
            ) : (
              <Link
                to="/"
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-medium text-teal-700 hover:bg-teal-100/50 transition-all duration-200"
              >
                📚 <span className="hidden xs:inline">{t('nav.learn')}</span>
              </Link>
            )}

            {/* Practice Button */}
            {isHomePage ? (
              <button
                onClick={() => handleModeClick('practice')}
                className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all duration-200 ${currentMode === 'practice'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-purple-700 hover:bg-purple-100/50'
                  }`}
              >
                🎯 <span className="hidden xs:inline">{t('nav.practice')}</span>
              </button>
            ) : (
              <Link
                to="/"
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-medium text-purple-700 hover:bg-purple-100/50 transition-all duration-200"
              >
                🎯 <span className="hidden xs:inline">{t('nav.practice')}</span>
              </Link>
            )}

            {/* Real World Applications Link */}
            <Link
              to="/applications"
              className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all duration-200 ${isApplicationsPage
                  ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100/50'
                }`}
            >
              🌍 <span className="hidden sm:inline">{t('nav.applications')}</span>
            </Link>

            {/* Language Selector */}
            <div className="ml-1 sm:ml-2 md:ml-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

