import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

type Props = {
  onReset?: () => void;
};

export default function ResetButton({ onReset }: Props) {
  const { t, isTransitioning } = useLanguage();
  const [isActive, setIsActive] = useState(false);

  const handleReset = () => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), 200);
    if (onReset) onReset();
  };

  return (
    <button 
      className={`group relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400/50 ${
        isActive 
          ? 'scale-95 bg-gray-600 text-white shadow-inner' 
          : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200/60 hover:border-gray-300 shadow-md hover:shadow-lg'
      } ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
      onClick={handleReset}
    >
      <div className="flex items-center space-x-2">
        <span className="text-lg group-hover:animate-spin">🔄</span>
        <span className="font-semibold">{t('reset')}</span>
      </div>
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-400/20 to-gray-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}