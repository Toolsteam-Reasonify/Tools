import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

type Props = {
  onReset?: () => void;
};

export default function ResetButton({ onReset }: Props) {
  const { t, isTransitioning } = useLanguage();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      if (onReset) onReset();
      setIsResetting(false);
    }, 300);
  };

  return (
    <button 
      className={`group relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400/50 ${
        isResetting 
          ? 'scale-95 bg-orange-600 text-white shadow-inner animate-pulse' 
          : isTransitioning
          ? 'opacity-50 scale-95 bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-200/60 hover:border-orange-300 shadow-md hover:shadow-lg'
      }`}
      onClick={handleReset}
      disabled={isTransitioning}
    >
      <div className="flex items-center space-x-2">
        <span className={`text-lg transition-transform duration-300 ${
          isResetting ? 'animate-spin' : 'group-hover:animate-bounce'
        }`}>
          🔄
        </span>
        <span className="font-semibold">{t('reset')}</span>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Reset progress indicator */}
      {isResetting && (
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-b-lg animate-pulse w-full" />
      )}
    </button>
  );
}


