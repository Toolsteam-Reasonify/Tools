import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

type Props = {
  onPrev?: () => void;
  onNext?: () => void;
};

export default function SimpleTransportControls({ onPrev, onNext }: Props) {
  const { isTransitioning, t } = useLanguage();
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (action: 'prev' | 'next', callback?: () => void) => {
    setActiveButton(action);
    setTimeout(() => setActiveButton(null), 150);
    if (callback) callback();
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-3 transition-all duration-300 ${
      isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
    }`}>
      {/* Previous Button */}
      <button 
        className={`group relative px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400/50 ${
          activeButton === 'prev' 
            ? 'scale-95 bg-teal-600 text-white shadow-inner' 
            : 'bg-white hover:bg-teal-50 text-teal-700 border-2 border-teal-200/60 hover:border-teal-300 shadow-md hover:shadow-lg'
        }`}
        onClick={() => handleButtonClick('prev', onPrev)}
      >
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-sm sm:text-lg group-hover:animate-bounce">⏮️</span>
          <span className="font-semibold hidden sm:inline">{t('previous')}</span>
        </div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      {/* Next Button */}
      <button 
        className={`group relative px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50 ${
          activeButton === 'next' 
            ? 'scale-95 bg-purple-600 text-white shadow-inner' 
            : 'bg-white hover:bg-purple-50 text-purple-700 border-2 border-purple-200/60 hover:border-purple-300 shadow-md hover:shadow-lg'
        }`}
        onClick={() => handleButtonClick('next', onNext)}
      >
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="font-semibold hidden sm:inline">{t('next')}</span>
          <span className="text-sm sm:text-lg group-hover:animate-bounce">⏭️</span>
        </div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    </div>
  );
}
