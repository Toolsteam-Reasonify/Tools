import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';

type Mode = 'demo' | 'practice' | 'real-world';

interface Props {
  currentMode?: Mode;
  onModeChange?: (mode: Mode) => void;
}

export default function ModeSwitcher({ currentMode, onModeChange }: Props) {
  const { isTransitioning, t } = useLanguage();
  const location = useLocation();

  const getCurrentMode = (): Mode => {
    if (currentMode) return currentMode;
    switch (location.pathname) {
      case '/mode/practice':
        return 'practice';
      case '/mode/real-world':
        return 'real-world';
      case '/mode/demo':
      case '/mode':
      default:
        return 'demo';
    }
  };

  const activeMode = getCurrentMode();
  const modes = [
    { id: 'demo' as Mode, label: t('learn'), icon: '📚', route: '/mode/demo' },
    { id: 'practice' as Mode, label: t('practice'), icon: '🎯', route: '/mode/practice' },
    { id: 'real-world' as Mode, label: t('realWorld'), icon: '🌍', route: '/mode/real-world' }
  ];

  const handleModeChange = (mode: Mode) => {
    if (onModeChange) return onModeChange(mode);
    const m = modes.find(x => x.id === mode)!;
    window.location.href = m.route;
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => handleModeChange(mode.id)}
          className={`relative px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
            activeMode === mode.id
              ? 'bg-white text-teal-600 shadow-md border-2 border-teal-300'
              : 'bg-teal-600 text-white hover:bg-teal-700 border-2 border-transparent'
          } ${isTransitioning ? 'opacity-70' : 'opacity-100'}`}
          title={mode.label}
        >
          <span className="inline mr-1" aria-hidden="true">{mode.icon}</span>
          <span className="hidden sm:inline">{mode.label}</span>
          <span className="sm:hidden">{mode.label.charAt(0)}</span>
          {activeMode === mode.id && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-teal-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}



