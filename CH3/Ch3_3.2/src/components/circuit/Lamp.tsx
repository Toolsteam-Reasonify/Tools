import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LampProps {
  x: number;
  y: number;
  glowing?: boolean;
  onClick?: () => void;
  interactive?: boolean;
}

const Lamp: React.FC<LampProps> = ({ x, y, glowing, onClick, interactive }) => {
  const { t } = useLanguage();
  const fillColor = glowing ? '#fbbf24' : '#e5e7eb';
  const glowEffect = glowing ? 'lamp-glow' : '';

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
      className={glowEffect}
    >
      {/* Bulb glass */}
      <circle cx="0" cy="0" r="25" fill={fillColor} stroke="#374151" strokeWidth="2" opacity={glowing ? 0.9 : 0.6} />
      
      {/* Filament */}
      <path
        d="M -10 -5 L 10 5 M 10 -5 L -10 5"
        stroke="#4a5568"
        strokeWidth="2"
        opacity={glowing ? 0.3 : 1}
      />
      
      {/* Base */}
      <rect x="-8" y="20" width="16" height="8" fill="#6b7280" rx="2" />
      
      {/* Terminals */}
      <circle cx="-12" cy="24" r="3" fill="#374151" />
      <circle cx="12" cy="24" r="3" fill="#374151" />
      
      {/* Label */}
      <text x="0" y="45" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="500">
        {t('component.lamp')}
      </text>
      
      {/* Glow effect */}
      {glowing && (
        <circle cx="0" cy="0" r="35" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3">
          <animate attributeName="r" values="25;35;25" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
};

export default Lamp;

