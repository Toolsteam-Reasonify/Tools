import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Demo from './features/Median/DemonstrationMode/DemonstrationMode';
import Practice from './features/Median/PracticeMode/PracticeMode';
import RealWorld from './features/Median/RealWorldMode/RealWorldMode';

function Shell() {
  const { t, language, setLanguage } = useLanguage();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
      isActive
        ? 'bg-white text-blue-600 shadow-lg'
        : 'bg-white/10 text-white hover:bg-white/20'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header with Navigation */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Logo/Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              📊 {t('headerTitle')}
            </h1>
            
            {/* Navigation Buttons */}
            <nav className="flex items-center gap-3">
              <NavLink to="/median/demo" className={navLinkClass}>
                📚 {t('learn')}
              </NavLink>
              <NavLink to="/median/practice" className={navLinkClass}>
                ✍️ {t('practice')}
              </NavLink>
              <NavLink to="/median/real-world" className={navLinkClass}>
                🌍 {t('realWorld')}
              </NavLink>
            </nav>

            {/* Language Selector */}
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'gu')}
                className="px-3 py-2 rounded-lg bg-white text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="gu">ગુજરાતી</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/median/demo" replace />} />
          <Route path="/median" element={<Navigate to="/median/demo" replace />} />
          <Route path="/median/demo" element={<Demo />} />
          <Route path="/median/practice" element={<Practice />} />
          <Route path="/median/real-world" element={<RealWorld />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Shell />
    </LanguageProvider>
  );
}





