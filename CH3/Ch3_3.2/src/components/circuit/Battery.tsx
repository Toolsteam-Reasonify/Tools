import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BatteryProps {
  x: number;
  y: number;
  onClick?: () => void;
  interactive?: boolean;
}

const Battery: React.FC<BatteryProps> = ({ x, y, onClick, interactive }) => {
  const { t } = useLanguage();
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      {/* Battery cells (2 cells in series) */}
      <rect x="-30" y="-30" width="30" height="60" fill="#4a5568" rx="4" />
      <rect x="0" y="-30" width="30" height="60" fill="#4a5568" rx="4" />
      
      {/* Positive terminal */}
      <circle cx="15" cy="-30" r="6" fill="#fbbf24" />
      <text x="15" y="-25" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
        +
      </text>
      
      {/* Negative terminal */}
      <circle cx="-15" cy="30" r="6" fill="#374151" />
      <text x="-15" y="35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
        -
      </text>
      
      {/* Label */}
      <text x="0" y="50" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="500">
        {t('component.battery')}
      </text>
    </g>
  );
};

export default Battery;

