import React from 'react';

export function FractionCircle({
  numerator,
  denominator,
  size = 160,
}: {
  numerator: number;
  denominator: number;
  size?: number;
}) {
  const slices = Array.from({ length: denominator }, (_, i) => i);
  const stroke = 2;
  const radius = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const anglePer = 360 / denominator;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="#fff" stroke="#1f2937" strokeWidth={stroke} />
      {slices.map((i) => {
        const startAngle = (i * anglePer - 90) * (Math.PI / 180);
        const endAngle = ((i + 1) * anglePer - 90) * (Math.PI / 180);
        const x1 = size / 2 + radius * Math.cos(startAngle);
        const y1 = size / 2 + radius * Math.sin(startAngle);
        const x2 = size / 2 + radius * Math.cos(endAngle);
        const y2 = size / 2 + radius * Math.sin(endAngle);
        const largeArc = anglePer > 180 ? 1 : 0;
        const isShaded = i < numerator;
        return (
          <path
            key={i}
            d={`M ${size / 2} ${size / 2} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
            fill={isShaded ? '#60a5fa' : '#e5e7eb'}
            className="transition-all duration-700"
            style={{ opacity: isShaded ? 1 : 0.5 }}
          />
        );
      })}
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="font-bold fill-gray-700">
        {numerator}/{denominator}
      </text>
    </svg>
  );
}

export function RepeatedBars({
  count,
  partNumerator,
  partDenominator,
}: {
  count: number;
  partNumerator: number;
  partDenominator: number;
}) {
  const bars = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="space-y-2">
      {bars.map((i) => (
        <div key={i} className="flex gap-1 items-center">
          <div className="w-16 text-right text-sm font-semibold text-gray-600">+ {i === 0 ? '' : ''}</div>
          <div className="flex-1 h-6 bg-gray-200 rounded overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 bar-grow"
              style={{ width: `${(partNumerator / partDenominator) * 100}%`, ['--bar-height' as any]: '24px' }}
            />
          </div>
          <div className="w-14 text-sm font-bold text-gray-700 ml-2">{partNumerator}/{partDenominator}</div>
        </div>
      ))}
    </div>
  );
}

export function AreaModelGrid({
  aNumerator,
  aDenominator,
  bNumerator,
  bDenominator,
  rows = 8,
  cols = 8,
}: {
  aNumerator: number;
  aDenominator: number;
  bNumerator: number;
  bDenominator: number;
  rows?: number;
  cols?: number;
}) {
  // Shade rows for first fraction and columns for second fraction; overlap = product
  return (
    <div className="inline-block bg-white rounded-xl p-3 shadow">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, width: 320 }}>
        {Array.from({ length: rows * cols }, (_, idx) => {
          const r = Math.floor(idx / cols);
          const c = idx % cols;
          const shadeRow = r < Math.round((aNumerator / aDenominator) * rows);
          const shadeCol = c < Math.round((bNumerator / bDenominator) * cols);
          const overlap = shadeRow && shadeCol;
          return (
            <div
              key={idx}
              className="aspect-square border border-gray-300"
              style={{
                background:
                  overlap
                    ? 'linear-gradient(135deg,#60a5fa99,#a78bfa99)'
                    : shadeRow
                    ? '#93c5fd55'
                    : shadeCol
                    ? '#c4b5fd55'
                    : 'transparent',
                transition: 'background 600ms ease',
              }}
            />
          );
        })}
      </div>
      <div className="text-center mt-2 text-sm font-semibold text-gray-700">
        {aNumerator}/{aDenominator} × {bNumerator}/{bDenominator}
      </div>
    </div>
  );
}



