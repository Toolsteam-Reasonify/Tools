import { useLanguage } from '../../../contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

type Mode = 'demo' | 'practice' | 'real-world';

interface ModeSwitcherProps {
  currentMode?: Mode;
  onModeChange?: (mode: Mode) => void;
}

export default function ModeSwitcher({ currentMode, onModeChange }: ModeSwitcherProps) {
  const { isTransitioning, t } = useLanguage();
  const location = useLocation();
  
  // Determine current mode based on the current route
  const getCurrentMode = (): Mode => {
    if (currentMode) return currentMode;
    
    switch (location.pathname) {
      case '/practice':
        return 'practice';
      case '/real-world':
        return 'real-world';
      case '/demo':
      case '/':
      default:
        return 'demo';
    }
  };
  
  const activeMode = getCurrentMode();

  const modes = [
    { id: 'demo' as Mode, label: t('learn'), icon: '📚', description: t('learnDescription') },
    { id: 'practice' as Mode, label: t('practice'), icon: '🎯', description: t('practiceDescription') },
    { id: 'real-world' as Mode, label: t('realWorld'), icon: '🌍', description: t('realWorldDescription') }
  ];

  const handleModeChange = (mode: Mode) => {
    if (onModeChange) {
      onModeChange(mode);
    } else {
      // Default navigation behavior
      const routes = {
        demo: '/demo',
        practice: '/practice',
        'real-world': '/real-world'
      };
      window.location.href = routes[mode];
    }
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
          title={mode.description}
        >
          <span className="hidden xs:inline mr-1">{mode.icon}</span>
          <span className="hidden sm:inline">{mode.label}</span>
          <span className="sm:hidden">{mode.label.charAt(0)}</span>
          
          {/* Active indicator */}
          {activeMode === mode.id && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-teal-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
