import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

// Word-by-word animation component
function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const words = text.split(' ');

  useEffect(() => {
    setDisplayedText('');
    let currentIndex = 0;
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedText(words.slice(0, currentIndex + 1).join(' '));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 100);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [text]);

  return <span>{displayedText}</span>;
}

// Parallelogram SVG Component
function ParallelogramSVG({ base = 7, height = 4, showHeight = false, showTriangle = false, isRectangle = false, showPerimeter = false, sideLength = 5 }: { base?: number; height?: number; showHeight?: boolean; showTriangle?: boolean; isRectangle?: boolean; showPerimeter?: boolean; sideLength?: number }) {
  const unit = 25; // pixels per grid unit - increased for better visibility
  const basePx = base * unit;
  const heightPx = height * unit;
  const offset = isRectangle ? 0 : 2 * unit; // offset for slanted sides
  
  // Calculate full container dimensions - use larger viewBox to utilize full space
  const shapeWidth = basePx + offset;
  const shapeHeight = heightPx;
  const padding = 80;
  const containerWidth = shapeWidth + padding * 2;
  const containerHeight = shapeHeight + padding * 2;
  
  // Center the parallelogram - center the base (bottom edge) at the center
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  
  // For parallelogram: center the base at centerX
  // Base center = shapeStartX + basePx/2 = centerX
  // So shapeStartX = centerX - basePx/2
  const shapeStartX = centerX - basePx / 2;
  const shapeStartY = centerY - shapeHeight / 2;
  
  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox={`0 0 ${containerWidth} ${containerHeight}`}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
    >
      <defs>
        <pattern id={`grid-${base}-${height}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#grid-${base}-${height})`} />
      
      {!isRectangle ? (
        // Parallelogram shape - centered
        <polygon
          points={`${shapeStartX},${shapeStartY + heightPx} ${shapeStartX + basePx},${shapeStartY + heightPx} ${shapeStartX + basePx + offset},${shapeStartY} ${shapeStartX + offset},${shapeStartY}`}
          fill="none"
          stroke="#1f2937"
          strokeWidth="3"
        />
      ) : (
        // Rectangle shape - centered
        <rect
          x={shapeStartX}
          y={shapeStartY}
          width={basePx}
          height={heightPx}
          fill="none"
          stroke="#1f2937"
          strokeWidth="3"
        />
      )}
      
      {showHeight && !isRectangle && (
        <>
          <line
            x1={shapeStartX + offset}
            y1={shapeStartY}
            x2={shapeStartX + offset}
            y2={shapeStartY + heightPx}
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <text
            x={shapeStartX + offset + 12}
            y={shapeStartY + heightPx / 2}
            fontSize="14"
            fill="#3b82f6"
            fontWeight="bold"
            textAnchor="start"
          >
            {height}
          </text>
        </>
      )}
      
      {showHeight && isRectangle && (
        <>
          <line
            x1={shapeStartX}
            y1={shapeStartY}
            x2={shapeStartX}
            y2={shapeStartY + heightPx}
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <text
            x={shapeStartX + 12}
            y={shapeStartY + heightPx / 2}
            fontSize="14"
            fill="#3b82f6"
            fontWeight="bold"
            textAnchor="start"
          >
            {height}
          </text>
        </>
      )}
      
      {showTriangle && !isRectangle && (
        <polygon
          points={`${shapeStartX},${shapeStartY + heightPx} ${shapeStartX + offset},${shapeStartY + heightPx} ${shapeStartX + offset},${shapeStartY}`}
          fill="#ef4444"
          fillOpacity="0.3"
          stroke="#ef4444"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      )}
      
      {!showPerimeter && (
        <text
          x={centerX}
          y={shapeStartY + heightPx + 35}
          fontSize="16"
          fill="#1f2937"
          fontWeight="bold"
          textAnchor="middle"
        >
          {base}
        </text>
      )}
      
      {showPerimeter && !isRectangle && (
        <>
          {/* Bottom side (base) */}
          <text
            x={centerX}
            y={shapeStartY + heightPx + 35}
            fontSize="14"
            fill="#1f2937"
            fontWeight="bold"
            textAnchor="middle"
          >
            {base}
          </text>
          
          {/* Top side */}
          <text
            x={centerX}
            y={shapeStartY - 15}
            fontSize="14"
            fill="#1f2937"
            fontWeight="bold"
            textAnchor="middle"
          >
            {base}
          </text>
          
          {/* Left slanted side - label to the left of the side */}
          <text
            x={shapeStartX + offset / 2 - 12}
            y={shapeStartY + heightPx / 2}
            fontSize="16"
            fill="#ef4444"
            fontWeight="bold"
            textAnchor="end"
            style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: 3 } as React.CSSProperties}
          >
            {sideLength}
          </text>
          
          {/* Right slanted side - label to the right of the side */}
          <text
            x={shapeStartX + basePx + offset / 2 + 12}
            y={shapeStartY + heightPx / 2}
            fontSize="16"
            fill="#ef4444"
            fontWeight="bold"
            textAnchor="start"
            style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: 3 } as React.CSSProperties}
          >
            {sideLength}
          </text>
        </>
      )}
    </svg>
  );
}

// Triangle SVG Component
function TriangleSVG({ a = 3, b = 4, c = 5, showLabels = true }: { a?: number; b?: number; c?: number; showLabels?: boolean }) {
  // Draw a right triangle with sides a (base), b (height), c (hypotenuse)
  const unit = 35;
  const basePx = a * unit;
  const heightPx = b * unit;
  const padding = 60;
  const width = basePx + padding * 2;
  const height = heightPx + padding * 2;
  const startX = padding;
  const startY = padding + heightPx;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      <defs>
        <pattern id={`tri-grid-${a}-${b}-${c}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#tri-grid-${a}-${b}-${c})`} />

      {/* Triangle */}
      <polygon points={`${startX},${startY} ${startX + basePx},${startY} ${startX},${startY - heightPx}`} fill="none" stroke="#1f2937" strokeWidth="3" />

      {showLabels && (
        <>
          {/* base a */}
          <text x={startX + basePx / 2} y={startY + 24} fontSize="14" fill="#1f2937" fontWeight="bold" textAnchor="middle">{a}</text>
          {/* height b */}
          <text x={startX - 18} y={startY - heightPx / 2} fontSize="14" fill="#1f2937" fontWeight="bold" textAnchor="middle">{b}</text>
          {/* hypotenuse c */}
          <g transform={`translate(${startX + basePx / 2}, ${startY - heightPx / 2}) rotate(${-Math.atan2(heightPx, basePx) * 180 / Math.PI})`}>
            <text x={0} y={-8} fontSize="14" fill="#ef4444" fontWeight="bold" textAnchor="middle">{c}</text>
          </g>
        </>
      )}
    </svg>
  );
}

export default function DemonstrationMode() {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    { id: 0, title: t('step1Title'), desc: t('step1Desc') },
    { id: 1, title: t('step2Title'), desc: t('step2Desc') },
    { id: 2, title: t('step4Title'), desc: t('step4Desc') },
    { id: 3, title: t('step5Title'), desc: t('step5Desc') },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsPlaying(false);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);

  const renderStep1 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">📐</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('step1Title')}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          <AnimatedText text={t('step1Concept')} />
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">✅</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint1')} delay={200} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔄</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint2')} delay={400} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border-l-4 border-pink-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">📏</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint3')} delay={600} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border-l-4 border-indigo-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">📊</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint4')} delay={800} /></p>
          </div>
        </div>
      </div>

      {/* Right - Visual example */}
      <div className="relative bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
            {t('sampleParallelogram')}
          </h4>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="w-full h-80 flex items-center justify-center">
              <ParallelogramSVG base={7} height={4} showHeight={true} />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 font-semibold">{t('base')}: 7 {t('units')}</p>
              <p className="text-sm text-gray-600 font-semibold">{t('height')}: 4 {t('units')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Transformation concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-green-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">🔄</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            {t('step2Title')}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          <AnimatedText text={t('step2Concept')} />
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">1️⃣</span>
            <p className="text-gray-800 font-medium">{t('step2Step1')}</p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl border-l-4 border-teal-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">2️⃣</span>
            <p className="text-gray-800 font-medium">{t('step2Step2')}</p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl border-l-4 border-cyan-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">3️⃣</span>
            <p className="text-gray-800 font-medium">{t('step2Step3')}</p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-sky-50 to-sky-100 rounded-xl border-l-4 border-sky-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">4️⃣</span>
            <p className="text-gray-800 font-medium">{t('step2Step4')}</p>
          </div>
        </div>
      </div>

      {/* Right - Transformation visualization */}
      <div className="relative bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-green-200 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-700 to-teal-700 bg-clip-text text-transparent">
            {t('convertingParallelogram')}
          </h4>
          
          <div className="space-y-6">
            {/* Step 1: Parallelogram with height */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-4 border-green-500">
              <p className="text-center font-bold text-green-700 mb-4">Step 1: {t('baseAndHeight')}</p>
              <div className="w-full h-64 flex items-center justify-center">
                <ParallelogramSVG base={7} height={4} showHeight={true} />
              </div>
            </div>

            {/* Step 2: Rectangle formed */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-4 border-teal-500">
              <p className="text-center font-bold text-teal-700 mb-4">{t('parallelogramToRectangle')}</p>
              <div className="w-full h-64 flex items-center justify-center">
                <ParallelogramSVG base={7} height={4} isRectangle={true} showHeight={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Formula concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">📊</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('step4Title')}
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-300">
            <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📐</span>
              {t('areaFormula')}
            </h4>
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <p className="text-3xl font-bold text-indigo-700 mb-2">{t('areaEquals')}</p>
              <p className="text-xl text-gray-600">{t('formula')}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-300">
            <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">❓</span>
              {t('step4Question')}
            </h4>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <p className="text-gray-700 font-medium">
                <span className="text-green-600">✓</span> <AnimatedText text={t('step4Answer')} delay={300} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Formula visualization */}
      <div className="relative bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-200 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            {t('areaFormula')}
          </h4>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="w-full h-80 flex items-center justify-center mb-6">
              <ParallelogramSVG base={7} height={4} showHeight={true} />
            </div>
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-4">
                <p className="text-2xl font-bold">{t('areaEquals')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="font-bold text-blue-700">{t('base')}</p>
                  <p className="text-2xl">7</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="font-bold text-purple-700">{t('height')}</p>
                  <p className="text-2xl">4</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-500">
                <p className="font-bold text-green-700 text-xl">{t('area')} = 28 {t('sqUnits')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => {
    const base = 7;
    const sideLength = 5;
    const perimeter = 2 * (base + sideLength);

    return (
      <div key={`step5-${language}`} className="grid md:grid-cols-2 gap-6 md:gap-8">
        {/* Left - Parallelogram perimeter concept */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-rose-200">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-5xl">📐</span>
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">{t('step5Title')}</h3>
          </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 border-2 border-rose-300">
              <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                {t('parallelogram')}
              </h4>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <p className="text-gray-700 leading-relaxed"><AnimatedText text={t('step5Concept')} /></p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-300">
              <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
                <span className="text-2xl">📐</span>
                {t('perimeterFormula')}
              </h4>
              <div className="bg-white rounded-xl p-6 shadow-md text-center">
                <p className="text-3xl font-bold text-indigo-700 mb-2">{t('perimeterEquals')}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-300">
              <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
                <span className="text-2xl">❓</span>
                {t('step5Question')}
              </h4>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <p className="text-gray-700 font-medium"><span className="text-green-600">✓</span> <AnimatedText text={t('step5Answer')} /></p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Visualization */}
        <div className="relative bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-rose-200 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="relative z-10">
            <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-rose-700 to-pink-700 bg-clip-text text-transparent">{t('parallelogram')} {t('example')}</h4>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="w-full h-80 flex items-center justify-center mb-6">
                <ParallelogramSVG base={base} height={4} showPerimeter={true} sideLength={sideLength} />
              </div>
              <div className="text-center space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="font-bold text-blue-700">{t('base')}</p>
                    <p className="text-2xl">{base}</p>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4">
                    <p className="font-bold text-indigo-700">{t('side')}</p>
                    <p className="text-2xl">{sideLength}</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-500">
                  <p className="font-bold text-green-700 text-xl">{t('perimeter')} = 2 × ({base} + {sideLength}) = {perimeter} {t('units')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            📐 {t('appTitle')} - {currentStep + 1}/{steps.length}
          </h2>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        {currentStep === 0 && renderStep1()}
        {currentStep === 1 && renderStep2()}
        {currentStep === 2 && renderStep4()}
        {currentStep === 3 && renderStep5()}
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 bg-white rounded-xl shadow-lg border">
        <button
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-base transition-all duration-300 ${
            currentStep === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transform hover:scale-105'
          }`}
        >
          ← {t('previous')}
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
            isPlaying
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
          }`}
        >
          {isPlaying ? t('pause') : t('play')}
        </button>
        <button
          onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={currentStep === steps.length - 1}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
            currentStep === steps.length - 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {t('next')} →
        </button>
      </div>
    </div>
  );
}

