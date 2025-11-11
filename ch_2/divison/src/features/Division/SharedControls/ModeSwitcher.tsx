import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function ModeSwitcher() {
  const { t } = useLanguage();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
      isActive
        ? 'bg-white text-blue-600 shadow-lg'
        : 'bg-white/10 text-white hover:bg-white/20'
    }`;

  return (
    <nav className="flex items-center gap-3">
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


