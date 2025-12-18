import React from 'react';

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
	const angleRad = (angleDeg - 90) * (Math.PI / 180);
	return {
		x: cx + r * Math.cos(angleRad),
		y: cy + r * Math.sin(angleRad),
	};
}

function sectorPath(cx: number, cy: number, r: number, startAngle: number, sweepAngle: number) {
	const start = polarToCartesian(cx, cy, r, startAngle);
	const end = polarToCartesian(cx, cy, r, startAngle + sweepAngle);
	const largeArcFlag = sweepAngle > 180 ? 1 : 0;
	return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
}

export function CircleMultiplyVisual({
	left, // first fraction (e.g., {numerator:1, denominator:2, color:'#60a5fa'})
	right, // second fraction
	product, // {numerator:1, denominator:6, color:'#34d399'}
	size = 120,
}: {
	left: { numerator: number; denominator: number; color: string };
	right: { numerator: number; denominator: number; color: string };
	product: { numerator: number; denominator: number; color: string };
	size?: number;
}) {
	const cx = size / 2;
	const cy = size / 2;
	const r = size / 2 - 10;

	const leftSweep = (left.numerator / left.denominator) * 360;
	const rightSweep = (right.numerator / right.denominator) * 360;
	const prodSweep = (product.numerator / product.denominator) * 360;

	return (
		<div className="flex items-center gap-4">
			{/* Left circle */}
			<div className="relative">
				<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow">
					<circle cx={cx} cy={cy} r={r} fill="none" stroke={left.color} strokeWidth={3} strokeDasharray="5,5" />
					{/* Guides */}
					<line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke={left.color} strokeWidth={2} strokeDasharray="3,3" />
					<line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={left.color} strokeWidth={2} strokeDasharray="3,3" />
					<path d={sectorPath(cx, cy, r, 0, leftSweep)} fill={left.color} fillOpacity={1} />
				</svg>
				<div className="text-center mt-1 text-sm font-bold" style={{ color: left.color }}>{left.numerator}/{left.denominator}</div>
			</div>

			<div className="text-2xl font-bold text-gray-500">×</div>

			{/* Right circle */}
			<div className="relative">
				<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow">
					<circle cx={cx} cy={cy} r={r} fill="none" stroke={right.color} strokeWidth={3} strokeDasharray="5,5" />
					<line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke={right.color} strokeWidth={2} strokeDasharray="3,3" />
					<line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={right.color} strokeWidth={2} strokeDasharray="3,3" />
					<path d={sectorPath(cx, cy, r, 90, rightSweep)} fill={right.color} fillOpacity={1} />
				</svg>
				<div className="text-center mt-1 text-sm font-bold" style={{ color: right.color }}>{right.numerator}/{right.denominator}</div>
			</div>

			<div className="text-2xl font-bold text-gray-500">=</div>

			{/* Product circle */}
			<div className="relative">
				<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow">
					<circle cx={cx} cy={cy} r={r} fill="none" stroke={product.color} strokeWidth={3} strokeDasharray="5,5" />
					<line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke={product.color} strokeWidth={2} strokeDasharray="3,3" />
					<line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={product.color} strokeWidth={2} strokeDasharray="3,3" />
					<path d={sectorPath(cx, cy, r, 45, prodSweep)} fill={product.color} fillOpacity={1} />
				</svg>
				<div className="text-center mt-1 text-sm font-bold" style={{ color: product.color }}>{product.numerator}/{product.denominator}</div>
			</div>
		</div>
	);
}
