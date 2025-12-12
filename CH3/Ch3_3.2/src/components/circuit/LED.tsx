import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LEDProps {
  x: number;
  y: number;
  glowing?: boolean;
  polarity?: 'correct' | 'incorrect' | 'neutral';
  onClick?: () => void;
  interactive?: boolean;
}

const LED: React.FC<LEDProps> = ({ x, y, glowing, polarity, onClick, interactive }) => {
  const { t } = useLanguage();
  const fillColor = glowing && polarity === 'correct' ? '#10b981' : '#e5e7eb';
  const borderColor = polarity === 'incorrect' ? '#ef4444' : '#374151';

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      {/* LED body (triangle) */}
      <polygon
        points="0,-20 15,20 -15,20"
        fill={fillColor}
        stroke={borderColor}
        strokeWidth="2"
        opacity={glowing ? 0.9 : 0.6}
      />
      
      {/* Positive terminal (longer wire) */}
      <line x1="0" y1="-20" x2="0" y2="-35" stroke="#374151" strokeWidth="3" />
      <text x="5" y="-30" fill="#374151" fontSize="10" fontWeight="500">+</text>
      
      {/* Negative terminal (shorter wire) */}
      <line x1="-8" y1="20" x2="-8" y2="30" stroke="#374151" strokeWidth="2" />
      <text x="-12" y="35" fill="#374151" fontSize="10" fontWeight="500">-</text>
      
      {/* Arrows indicating direction */}
      <path
        d="M -5 -10 L 5 0 M 5 -10 L -5 0"
        stroke="#4a5568"
        strokeWidth="1.5"
        opacity={glowing ? 0.5 : 1}
      />
      
      {/* Label */}
      <text x="0" y="50" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="500">
        {t('component.led')}
      </text>
      
      {/* Glow effect */}
      {glowing && polarity === 'correct' && (
        <circle cx="0" cy="0" r="30" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.3">
          <animate attributeName="r" values="20;30;20" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
};

export default LED;

