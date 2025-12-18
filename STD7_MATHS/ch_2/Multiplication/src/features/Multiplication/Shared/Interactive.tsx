import { useMemo, useState } from 'react';

export function FractionSliderCircle() {
  const [numerator, setNumerator] = useState(1);
  const [denominator, setDenominator] = useState(4);
  const wedges = useMemo(() => Array.from({ length: denominator }, (_, i) => i), [denominator]);
  const angle = 360 / denominator;
  const size = 180;
  const stroke = 2;
  const radius = (size - stroke * 2) / 2;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-xl border-2 border-indigo-100">
      <div className="flex items-center gap-3 mb-3">
        <label className="text-sm font-semibold text-gray-700">Numerator</label>
        <input type="range" min={0} max={denominator} value={numerator} onChange={(e) => setNumerator(parseInt(e.target.value))} className="w-40" />
        <label className="text-sm font-semibold text-gray-700">Denominator</label>
        <input type="range" min={1} max={12} value={denominator} onChange={(e) => { const d = parseInt(e.target.value); setDenominator(d); setNumerator(Math.min(numerator, d)); }} className="w-40" />
      </div>
      <div className="flex items-center gap-6">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={radius} fill="#fff" stroke="#1f2937" strokeWidth={stroke} />
          {wedges.map((i) => {
            const start = (i * angle - 90) * (Math.PI / 180);
            const end = ((i + 1) * angle - 90) * (Math.PI / 180);
            const x1 = size/2 + radius * Math.cos(start);
            const y1 = size/2 + radius * Math.sin(start);
            const x2 = size/2 + radius * Math.cos(end);
            const y2 = size/2 + radius * Math.sin(end);
            const largeArc = angle > 180 ? 1 : 0;
            const shaded = i < numerator;
            return (
              <path key={i} d={`M ${size/2} ${size/2} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`} fill={shaded ? '#60a5fa' : '#e5e7eb'} className="transition-all duration-500" />
            );
          })}
        </svg>
        <div className="text-2xl font-bold text-gray-800">{numerator}/{denominator}</div>
      </div>
    </div>
  );
}

export function InteractiveAreaPlayground() {
  const [aNum, setANum] = useState(2);
  const [aDen, setADen] = useState(3);
  const [bNum, setBNum] = useState(3);
  const [bDen, setBDen] = useState(5);
  const rows = 12, cols = 12;
  const productNum = aNum * bNum;
  const productDen = aDen * bDen;
  return (
    <div className="bg-white rounded-2xl p-4 shadow-xl border-2 border-cyan-100">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">A:</span>
          <input type="number" min={1} max={12} value={aNum} onChange={(e)=>setANum(parseInt(e.target.value||'1'))} className="w-16 border rounded px-2 py-1" />
          <span className="text-lg">/</span>
          <input type="number" min={1} max={12} value={aDen} onChange={(e)=>setADen(parseInt(e.target.value||'1'))} className="w-16 border rounded px-2 py-1" />
          <span className="ml-2 text-sm text-gray-500">rows shaded</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">B:</span>
          <input type="number" min={1} max={12} value={bNum} onChange={(e)=>setBNum(parseInt(e.target.value||'1'))} className="w-16 border rounded px-2 py-1" />
          <span className="text-lg">/</span>
          <input type="number" min={1} max={12} value={bDen} onChange={(e)=>setBDen(parseInt(e.target.value||'1'))} className="w-16 border rounded px-2 py-1" />
          <span className="ml-2 text-sm text-gray-500">columns shaded</span>
        </div>
      </div>
      <div className="mt-4 grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, width: 360 }}>
        {Array.from({ length: rows * cols }, (_, idx) => {
          const r = Math.floor(idx / cols);
          const c = idx % cols;
          const shadeRow = r < Math.round((aNum/aDen) * rows);
          const shadeCol = c < Math.round((bNum/bDen) * cols);
          const overlap = shadeRow && shadeCol;
          return <div key={idx} className="aspect-square border border-gray-300" style={{ background: overlap? 'linear-gradient(135deg,#34d39999,#38bdf899)': shadeRow? '#93c5fd55': shadeCol? '#6ee7b755': 'transparent' }} />
        })}
      </div>
      <div className="mt-3 text-sm font-semibold text-gray-700">Product: {productNum}/{productDen}</div>
    </div>
  );
}



