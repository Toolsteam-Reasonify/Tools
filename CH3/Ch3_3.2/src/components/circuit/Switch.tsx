import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SwitchProps {
  x: number;
  y: number;
  state?: 'open' | 'closed' | 'on' | 'off';
  closed?: boolean;
  onClick?: () => void;
  interactive?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ x, y, state, closed, onClick, interactive }) => {
  const { t } = useLanguage();
  const isClosed = closed || state === 'closed' || state === 'on';

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      {/* Base */}
      <rect x="-15" y="-5" width="30" height="10" fill="#6b7280" rx="2" />
      
      {/* Fixed contact */}
      <circle cx="-10" cy="0" r="4" fill={isClosed ? '#10b981' : '#ef4444'} />
      
      {/* Moving contact */}
      <circle cx="10" cy="0" r="4" fill={isClosed ? '#10b981' : '#ef4444'} />
      
      {/* Switch lever */}
      <line
        x1="-10"
        y1="0"
        x2="10"
        y2={isClosed ? "0" : "-8"}
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Labels */}
      <text x="-10" y="-15" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="500">
        {isClosed ? t('component.on') : t('component.off')}
      </text>
      
      <text x="0" y="25" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="500">
        {t('component.switch')}
      </text>
    </g>
  );
};

export default Switch;

