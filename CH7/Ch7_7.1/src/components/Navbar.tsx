import React from 'react';
import { Flame } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / title - same style as Ch3_3.4 */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Flame className="w-6 h-6 text-teal-600" aria-hidden="true" />
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              {t('nav.logo')}
            </span>
          </div>

          {/* Primary navigation actions styled like Ch3_3.4 */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Learn button */}
            <button
              type="button"
              onClick={() => setMode('learn')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isLearn
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-teal-700 hover:bg-teal-100/50'
              }`}
            >
              📚 {t('Learn')}
            </button>

            {/* Practice button */}
            <button
              type="button"
              onClick={() => setMode('practice')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isPractice
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-purple-700 hover:bg-purple-100/50'
              }`}
            >
              🎯 {t('Practice')}
            </button>

            {/* Real-world applications button */}
            <button
              type="button"
              onClick={() => setMode('applications')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isApplications
                  ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100/50'
              }`}
            >
              🌍 {t('Real World Applications')}
            </button>

            {/* Language selector aligned like Ch3_3.4 */}
            <div className="ml-2 md:ml-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

