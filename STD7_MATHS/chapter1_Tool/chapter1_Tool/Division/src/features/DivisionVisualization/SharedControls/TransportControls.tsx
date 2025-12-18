import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

type Props = {
  onPrev?: () => void;
  onNext?: () => void;
  onPlayPause?: () => void;
  isPlaying?: boolean;
};

export default function TransportControls({ onPrev, onNext, onPlayPause, isPlaying }: Props) {
  const { t, isTransitioning } = useLanguage();
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (action: 'prev' | 'next' | 'playPause', callback?: () => void) => {
    setActiveButton(action);
    setTimeout(() => setActiveButton(null), 150);
    if (callback) callback();
  };

  return (
    <div className={`flex items-center gap-3 transition-all duration-300 ${
      isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
    }`}>
      {/* Previous Button */}
      <button 
        className={`group relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400/50 ${
          activeButton === 'prev' 
            ? 'scale-95 bg-blue-600 text-white shadow-inner' 
            : 'bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-200/60 hover:border-blue-300 shadow-md hover:shadow-lg'
        }`}
        onClick={() => handleButtonClick('prev', onPrev)}
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg group-hover:animate-bounce">⏮️</span>
          <span className="font-semibold">{t('prev')}</span>
        </div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      {/* Play/Pause Button */}
      <button 
        className={`group relative px-5 py-2 rounded-lg font-bold text-sm transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400/50 shadow-lg hover:shadow-xl ${
          activeButton === 'playPause' 
            ? 'scale-95 shadow-inner' 
            : isPlaying 
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white animate-pulse' 
            : 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white'
        }`}
        onClick={() => handleButtonClick('playPause', onPlayPause)}
      >
        <div className="flex items-center space-x-2">
          <span className={`text-lg transition-transform duration-200 ${
            isPlaying ? 'animate-pulse' : 'group-hover:animate-bounce'
          }`}>
            {isPlaying ? '⏸️' : '▶️'}
          </span>
          <span className="font-bold">{isPlaying ? t('pause') : t('play')}</span>
        </div>
        
        {/* Glow effect for play button */}
        {!isPlaying && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        )}
      </button>

      {/* Next Button */}
      <button 
        className={`group relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50 ${
          activeButton === 'next' 
            ? 'scale-95 bg-purple-600 text-white shadow-inner' 
            : 'bg-white hover:bg-purple-50 text-purple-700 border-2 border-purple-200/60 hover:border-purple-300 shadow-md hover:shadow-lg'
        }`}
        onClick={() => handleButtonClick('next', onNext)}
      >
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{t('next')}</span>
          <span className="text-lg group-hover:animate-bounce">⏭️</span>
        </div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    </div>
  );
}