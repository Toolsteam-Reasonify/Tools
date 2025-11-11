import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function ModeSwitcher() {
  const { t } = useLanguage();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex-1 text-center px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 transform ${
      isActive
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl scale-105'
        : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-lg hover:scale-102'
    }`;

  return (
    <nav className="bg-white rounded-2xl shadow-xl p-2 flex flex-col sm:flex-row gap-2">
      <NavLink to="/learn" className={navLinkClass}>
        📚 {t('learn')}
      </NavLink>
      <NavLink to="/practice" className={navLinkClass}>
        ✍️ {t('practice')}
      </NavLink>
      <NavLink to="/real-world" className={navLinkClass}>
        🌍 {t('realWorld')}
      </NavLink>
    </nav>
  );
}





