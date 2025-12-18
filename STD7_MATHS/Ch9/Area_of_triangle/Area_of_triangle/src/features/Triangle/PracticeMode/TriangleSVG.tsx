function TriangleSVG({ base = 6, height = 4, showHeight = false, showLabels = true, color = '#3b82f6', isObtuse = false }: { base?: number; height?: number; showHeight?: boolean; showLabels?: boolean; color?: string; isObtuse?: boolean }) {
  const unit = 35;
  const basePx = base * unit;
  const heightPx = height * unit;
  const padding = 60;
  const width = basePx + padding * 2;
  const totalHeight = heightPx + padding * 2;
  
  let trianglePoints: string;
  let heightLineX: number;
  let heightLineY: number;
  let heightStartY: number;
  
  if (isObtuse) {
    // Obtuse triangle: height falls outside
    const startX = padding;
    const startY = padding + heightPx;
    const topX = padding + basePx * 0.3;
    const topY = padding;
    trianglePoints = `${startX},${startY} ${startX + basePx},${startY} ${topX},${topY}`;
    heightLineX = startX;
    heightLineY = startY - heightPx;
    heightStartY = startY;
  } else {
    // Right or acute triangle
    const startX = padding;
    const startY = padding + heightPx;
    const topX = padding + basePx / 2;
    const topY = padding;
    trianglePoints = `${startX},${startY} ${startX + basePx},${startY} ${topX},${topY}`;
    heightLineX = topX;
    heightLineY = topY;
    heightStartY = startY;
  }

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${totalHeight}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      <defs>
        <pattern id={`tri-grid-${base}-${height}-${isObtuse}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#tri-grid-${base}-${height}-${isObtuse})`} />

      {/* Height line */}
      {showHeight && (
        <>
          <line
            x1={heightLineX}
            y1={heightLineY}
            x2={heightLineX}
            y2={heightStartY}
            stroke={color}
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <text
            x={heightLineX + 12}
            y={(heightLineY + heightStartY) / 2}
            fontSize="14"
            fill={color}
            fontWeight="bold"
            textAnchor="start"
          >
            {height}
          </text>
        </>
      )}
      
      {/* Triangle */}
      <polygon 
        points={trianglePoints} 
        fill="none" 
        stroke={color} 
        strokeWidth="3"
      />
      
      {/* Base label */}
      {showLabels && (
        <text
          x={padding + basePx / 2}
          y={padding + heightPx + 35}
          fontSize="16"
          fill="#1f2937"
          fontWeight="bold"
          textAnchor="middle"
        >
          {base}
        </text>
      )}
    </svg>
  );
}

export default TriangleSVG;






