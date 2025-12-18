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

// Triangle SVG Component
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
        <pattern id={`tri-grid-${base}-${height}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#tri-grid-${base}-${height})`} />

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

export default function DemonstrationMode() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    { id: 0, title: t('step1Title'), desc: t('step1Desc') },
    { id: 1, title: t('step2Title'), desc: t('step2Desc') },
    { id: 2, title: t('step3Title'), desc: t('step3Desc') },
    { id: 3, title: t('step4Title'), desc: t('step4Desc') },
    { id: 4, title: t('step5Title'), desc: t('step5Desc') },
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
            <span className="text-2xl">📈</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint2')} delay={400} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border-l-4 border-pink-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">↕️</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint3')} delay={600} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border-l-4 border-indigo-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">📏</span>
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
            {t('sampleTriangle')}
          </h4>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <TriangleSVG base={6} height={4} showHeight={true} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Steps */}
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
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">5️⃣</span>
            <p className="text-gray-800 font-medium">{t('step2Step5')}</p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border-l-4 border-indigo-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">6️⃣</span>
            <p className="text-gray-800 font-medium">{t('step2Step6')}</p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-violet-50 to-violet-100 rounded-xl border-l-4 border-violet-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">7️⃣</span>
            <p className="text-gray-800 font-medium">{t('step2Step7')}</p>
          </div>
        </div>
      </div>

      {/* Right - Visualization */}
      <div className="relative bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-green-200 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-700 to-teal-700 bg-clip-text text-transparent">
            {t('twoTriangles')}
          </h4>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <TriangleSVG base={6} height={4} color="#3b82f6" />
                <p className="text-center text-sm font-bold mt-2 text-gray-700">{t('triangle')} 1</p>
              </div>
              <div>
                <TriangleSVG base={6} height={4} color="#8b5cf6" />
                <p className="text-center text-sm font-bold mt-2 text-gray-700">{t('triangle')} 2</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <span className="text-3xl">→</span>
              <p className="text-lg font-bold text-gray-800 mt-2">{t('parallelogramFormed')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Formula */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-orange-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">📐</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {t('step3Title')}
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-100 via-peach-100 to-orange-50 rounded-3xl p-6 md:p-8 shadow-xl border-2 border-orange-200 transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
            {/* Animated background glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-peach-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6 opacity-0 animate-[fadeIn_0.6s_ease-in-out_0.2s_forwards]">
                <div className="text-5xl animate-bounce filter drop-shadow-lg" style={{ animationDuration: '2s', color: '#ec4899' }}>❓</div>
                <div className="flex-1">
                  <h4 className="font-bold text-xl md:text-2xl text-gray-800 mb-4">
                    <AnimatedText text={t('step3Question')} />
                  </h4>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 md:p-6 shadow-lg border border-white/50 transform hover:shadow-xl hover:scale-[1.01] transition-all duration-300 opacity-0 animate-[fadeIn_0.6s_ease-in-out_0.5s_forwards]">
                <div className="flex items-start gap-3">
                  <div className="text-3xl animate-pulse" style={{ color: '#10b981' }}>✓</div>
                  <p className="text-gray-700 font-medium text-base md:text-lg leading-relaxed flex-1">
                    <AnimatedText text={t('step3Answer')} delay={500} />
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-300">
            <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              {t('formulaKey1')}
            </h4>
            <div className="space-y-2">
              <p className="text-gray-700"><AnimatedText text={t('formulaKey2')} delay={200} /></p>
              <p className="text-gray-700"><AnimatedText text={t('formulaKey3')} delay={400} /></p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Triangle with formula */}
      <div className="relative bg-gradient-to-br from-orange-100 via-pink-100 to-red-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-orange-200 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
            {t('areaFormula')}
          </h4>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <TriangleSVG base={6} height={4} showHeight={true} />
            <div className="mt-6 space-y-3">
              <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                <p className="text-xl font-bold text-blue-700">{t('areaFormulaGeneral')}</p>
              </div>
              <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-blue-700">{t('areaEquals')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">📐📐</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('step4Title')}
          </h3>
        </div>
        
        <div className="space-y-4">
          {/* Main concept paragraph */}
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-5 md:p-6 border-l-4 border-indigo-500 shadow-md transform hover:scale-[1.01] transition-all duration-300">
            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
              <AnimatedText text={t('step4Concept')} />
            </p>
          </div>
          
          {/* Bullet point 1 */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 md:p-6 border-l-4 border-green-500 shadow-md transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-start gap-3">
              <span className="text-2xl text-green-600">✓</span>
              <p className="text-gray-700 font-medium text-base md:text-lg flex-1">
                <AnimatedText text={t('keyPoint3')} delay={300} />
              </p>
            </div>
          </div>
          
          {/* Bullet point 2 */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 md:p-6 border-l-4 border-blue-500 shadow-md transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-start gap-3">
              <span className="text-2xl text-green-600">✓</span>
              <p className="text-gray-700 font-medium text-base md:text-lg flex-1">
                <AnimatedText text={t('step4KeyPoint2')} delay={500} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Multiple triangles */}
      <div className="relative bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-200 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            {t('step4Title')}
          </h4>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="grid grid-cols-2 gap-4">
              <TriangleSVG base={6} height={4} showHeight={true} color="#3b82f6" />
              <TriangleSVG base={6} height={4} showHeight={true} color="#8b5cf6" />
              <TriangleSVG base={6} height={4} showHeight={true} color="#ec4899" />
              <TriangleSVG base={6} height={4} showHeight={true} color="#10b981" />
            </div>
            <p className="text-center mt-4 font-bold text-gray-700">{t('step4SameArea')}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-yellow-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">⚠️</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            {t('step5Title')}
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300">
            <p className="text-gray-700 leading-relaxed mb-4">
              <AnimatedText text={t('step5Concept')} />
            </p>
            <div className="bg-white rounded-xl p-4 shadow-md mt-4">
              <p className="text-gray-700 font-medium">
                <span className="text-blue-600">💡</span> {t('step5HeightTip')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Obtuse triangle */}
      <div className="relative bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-yellow-200 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-700 to-orange-700 bg-clip-text text-transparent">
            {t('step5Title')}
          </h4>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <TriangleSVG base={6} height={4} showHeight={true} color="#f59e0b" isObtuse={true} />
            <p className="text-center mt-4 font-bold text-gray-700">{t('step5HeightOutside')}</p>
          </div>
        </div>
      </div>
    </div>
  );

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
        {currentStep === 2 && renderStep3()}
        {currentStep === 3 && renderStep4()}
        {currentStep === 4 && renderStep5()}
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






