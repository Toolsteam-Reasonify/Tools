import React from 'react';

interface WireProps {
  x: number;
  y: number;
  onClick?: () => void;
  interactive?: boolean;
}

const Wire: React.FC<WireProps> = ({ x, y, onClick, interactive }) => {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      {/* Wire line */}
      <line
        x1="0"
        y1="0"
        x2="100"
        y2="0"
        stroke="#4a5568"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Wire insulation (optional visual) */}
      <line
        x1="0"
        y1="0"
        x2="100"
        y2="0"
        stroke="#9ca3af"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.3"
      />
    </g>
  );
};

export default Wire;

