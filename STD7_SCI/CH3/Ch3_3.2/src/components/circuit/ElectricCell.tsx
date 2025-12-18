import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ElectricCellProps {
  x: number;
  y: number;
  onClick?: () => void;
  interactive?: boolean;
}

const ElectricCell: React.FC<ElectricCellProps> = ({ x, y, onClick, interactive }) => {
  const { t } = useLanguage();
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      {/* Cell body */}
      <rect x="-20" y="-30" width="40" height="60" fill="#4a5568" rx="4" />
      
      {/* Positive terminal (metal cap) */}
      <circle cx="0" cy="-30" r="8" fill="#fbbf24" />
      <text x="0" y="-25" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
        +
      </text>
      
      {/* Negative terminal (metal disc) */}
      <circle cx="0" cy="30" r="8" fill="#374151" />
      <text x="0" y="35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
        -
      </text>
      
      {/* Label */}
      <text x="0" y="50" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="500">
        {t('component.cell')}
      </text>
    </g>
  );
};

export default ElectricCell;

