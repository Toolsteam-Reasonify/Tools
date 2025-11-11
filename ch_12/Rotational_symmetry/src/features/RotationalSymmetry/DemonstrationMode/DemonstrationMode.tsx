import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

function AnimatedText({ text }: { text: string; delay?: number }) {
  // Render static text to ensure stability while animations run
  return <span>{text}</span>;
}

export default function DemonstrationMode() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoNextTimerRef = useRef<number | null>(null);

  const clearAutoNext = () => {
    if (autoNextTimerRef.current !== null) {
      window.clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }
  };

  const handleTogglePlay = () => {
    setIsAnimating((prev) => {
      const nextState = !prev;
      clearAutoNext();
      return nextState;
    });
  };

  // Auto-advance every 5s while playing. Stops when paused or at last step.
  useEffect(() => {
    clearAutoNext();
    if (isAnimating) {
      autoNextTimerRef.current = window.setTimeout(() => {
        setCurrentStep((s) => {
          const next = s + 1;
          // steps defined below; rely on closure length
          if (next >= steps.length) {
            setIsAnimating(false);
            return s; // stay on last
          }
          return next;
        });
        autoNextTimerRef.current = null;
      }, 5000);
    }
    return () => clearAutoNext();
  }, [isAnimating, currentStep]);

  const steps = [
    { id: 0, title: t('step1Title'), desc: t('step1Desc') },
    { id: 2, title: t('step3Title'), desc: t('step3Desc') },
    { id: 3, title: t('step4Title'), desc: t('step4Desc') },
    { id: 4, title: t('step5Title'), desc: t('step5Desc') },
  ];

  // Animation for rotation
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        // 6 degrees per second for the second hand => 0.3 deg per 50ms tick
        setRotationAngle((prev) => (prev + 0.3) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  const StepCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-blue-200">
      <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">{title}</h3>
      {children}
    </div>
  );

  const renderStep1 = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <StepCard title={t('step1Title')}>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
          <AnimatedText text={t('step1Concept')} />
        </p>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-l-4 border-blue-500">
            <span className="text-2xl">🔄</span>
            <p className="text-gray-800 font-medium">{t('rotationP1')}</p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-500">
            <span className="text-2xl">⏰</span>
            <p className="text-gray-800 font-medium">{t('rotationP2')}</p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border-l-4 border-pink-500">
            <span className="text-2xl">🔄</span>
            <p className="text-gray-800 font-medium">{t('rotationP3')}</p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border-l-4 border-violet-500">
            <span className="text-2xl">📍</span>
            <p className="text-gray-800 font-medium">{t('rotationP4')}</p>
          </div>
        </div>
      </StepCard>

      <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-blue-200">
        <h4 className="text-xl md:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">{t('clockHandsRotation')}</h4>
        <div className="relative w-full h-64 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Outer rim */}
            <circle cx="100" cy="100" r="90" fill="#ffffff" stroke="#0f172a" strokeWidth="4" />
            {/* Inner subtle ring */}
            <circle cx="100" cy="100" r="84" fill="none" stroke="#0f172a" strokeWidth="1.5" opacity="0.4" />

            {/* Hour ticks (12 thicker) */}
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (Math.PI / 30) * i; // 6° each
              const isHour = i % 5 === 0;
              const rOuter = 84;
              const rInner = isHour ? 74 : 78;
              const x1 = 100 + rOuter * Math.cos(angle - Math.PI / 2);
              const y1 = 100 + rOuter * Math.sin(angle - Math.PI / 2);
              const x2 = 100 + rInner * Math.cos(angle - Math.PI / 2);
              const y2 = 100 + rInner * Math.sin(angle - Math.PI / 2);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#0f172a"
                  strokeWidth={isHour ? 2 : 1}
                  opacity={isHour ? 0.9 : 0.5}
                />
              );
            })}

            {/* Numerals 1..12 */}
            {Array.from({ length: 12 }).map((_, i) => {
              const n = i + 1;
              const angle = (Math.PI / 6) * (n - 3); // place 12 at top
              const x = 100 + 70 * Math.cos(angle);
              const y = 100 + 70 * Math.sin(angle);
              return (
                <text key={n} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="700" fill="#0f172a">
                  {n}
                </text>
              );
            })}

            {/* Animated hands (play/pause with the button below) */}
            {/* Hour hand rotates slowest */}
            <g transform={`rotate(${rotationAngle / 720}, 100, 100)`}>
              <line x1="100" y1="100" x2="100" y2="60" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
            </g>
            {/* Minute hand */}
            <g transform={`rotate(${rotationAngle / 60}, 100, 100)`}>
              <line x1="100" y1="100" x2="100" y2="45" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            {/* Second hand (fastest) */}
            <g transform={`rotate(${rotationAngle}, 100, 100)`}>
              <line x1="100" y1="100" x2="100" y2="35" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Center cap */}
            <circle cx="100" cy="100" r="3.5" fill="#0f172a" />
          </svg>
        </div>
        
      </div>
    </div>
  );

  
  

  

  

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">🔄 {t('appTitle')} - {currentStep + 1}/{steps.length}</h2>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        {currentStep === 0 && renderStep1()}
        {currentStep === 1 && <WindmillStep />}
        {currentStep === 2 && <SquareStep />}
        {currentStep === 3 && <TriangleStep />}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 bg-white rounded-xl shadow-lg border">
        <button
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-base transition-all duration-300 ${currentStep === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transform hover:scale-105'}`}
        >
          ← {t('previous')}
        </button>

        <button
          onClick={handleTogglePlay}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-xl`}
        >
          <span className="inline-flex items-center gap-2">
            {isAnimating ? (
              // Pause icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M6.75 5.25a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zM13.5 5.25a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H14.25a.75.75 0 01-.75-.75V5.25z" />
              </svg>
            ) : (
              // Play icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M5.25 5.883c0-1.19 1.292-1.928 2.322-1.297l10.11 6.117a1.5 1.5 0 010 2.594l-10.11 6.117c-1.03.623-2.322-.106-2.322-1.297V5.883z" />
              </svg>
            )}
            <span>{isAnimating ? t('pause') : t('play')}</span>
          </span>
        </button>

        <button
          onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={currentStep === steps.length - 1}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${currentStep === steps.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'}`}
        >
          {t('next')} →
        </button>
      </div>
    </div>
  );
}

// Extracted child components to keep hooks usage consistent
function WindmillStep() {
  const { t } = useLanguage();
  const [windmillAngle, setWindmillAngle] = useState(0);
  const [isWindmillAnimating] = useState(true);

  useEffect(() => {
    if (isWindmillAnimating) {
      const interval = setInterval(() => {
        setWindmillAngle((prev) => {
          const next = prev + 3; // smooth continuous rotation (~60°/s), same as square
          return next >= 360 ? 0 : next;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isWindmillAnimating]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-blue-200">
        <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">{t('step3Title')}</h3>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
          {t('windmillCompact')}
        </p>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
            <span className="text-2xl">🌀</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('windmillP1')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-l-4 border-emerald-500">
            <span className="text-2xl">4️⃣</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('windmillP2')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border-l-4 border-teal-500">
            <span className="text-2xl">📐</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('windmillP3')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border-l-4 border-cyan-500">
            <span className="text-2xl">🔄</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('windmillP4')} /></p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-green-200">
        <h4 className="text-xl md:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">{t('windmillOrder4')}</h4>
        <div className="relative w-full h-64 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Tower (static) - tapered with rounded base like the reference */}
            <path
              d="M96 198 Q100 201 104 198 L110 80 L90 80 Z"
              fill="#6b7280"
              stroke="#111827"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Nacelle/Hub */}
            <circle cx="100" cy="100" r="7" fill="#9ca3af" stroke="#111827" strokeWidth="2.5" />

            {/* Rotating blades group (three long rounded blades) */}
            <g transform={`rotate(${windmillAngle}, 100, 100)`}>
              {/* Blade shape: thick at hub, rounded at tip */}
              <path
                d="M100 100 C 125 95, 152 92, 170 98 C 154 104, 126 107, 100 100 Z"
                fill="#c0c4c7"
                stroke="#111827"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <g transform="rotate(120, 100, 100)">
                <path
                  d="M100 100 C 125 95, 152 92, 170 98 C 154 104, 126 107, 100 100 Z"
                  fill="#c0c4c7"
                  stroke="#111827"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </g>
              <g transform="rotate(240, 100, 100)">
                <path
                  d="M100 100 C 125 95, 152 92, 170 98 C 154 104, 126 107, 100 100 Z"
                  fill="#c0c4c7"
                  stroke="#111827"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </g>
            </g>
          </svg>
        </div>
        
      </div>
    </div>
  );
}

function SquareStep() {
  const { t } = useLanguage();
  const [squareAngle, setSquareAngle] = useState(0);
  const [isSquareAnimating] = useState(true);

  useEffect(() => {
    if (isSquareAnimating) {
      const interval = setInterval(() => {
        setSquareAngle((prev) => {
          const next = prev + 3; // smooth continuous rotation (~60°/s)
          return next >= 360 ? 0 : next;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isSquareAnimating]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-blue-200">
        <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">{t('step4Title')}</h3>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4 clamp-2">
          <AnimatedText text={t('step4Concept')} />
        </p>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-500">
            <span className="text-2xl">⬜</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('squareP1')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-l-4 border-orange-500">
            <span className="text-2xl">📍</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('squareP2')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-l-4 border-amber-500">
            <span className="text-2xl">📐</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('squareP3')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-500">
            <span className="text-2xl">🔄</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('squareP4')} /></p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-yellow-200">
        <h4 className="text-xl md:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-700 to-orange-700 bg-clip-text text-transparent">{t('squareOrder4')}</h4>
        <div className="relative w-full h-64 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="3" fill="#0ea5e9" />
            <g transform={`rotate(${squareAngle}, 100, 100)`}>
              <rect x="60" y="60" width="80" height="80" fill="none" stroke="#111827" strokeWidth="4" />
              {/* Red dot on one corner (rotates with the square) */}
              <circle cx="60" cy="60" r="4" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
            </g>
            <line x1="100" y1="20" x2="100" y2="180" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
            <line x1="20" y1="100" x2="180" y2="100" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
          </svg>
        </div>
        
      </div>
    </div>
  );
}

function TriangleStep() {
  const { t } = useLanguage();
  const [triangleAngle, setTriangleAngle] = useState(0);
  const [isTriangleAnimating] = useState(true);

  useEffect(() => {
    if (isTriangleAnimating) {
      const interval = setInterval(() => {
        setTriangleAngle((prev) => {
          const next = prev + 3; // faster rotation (~60°/s)
          return next >= 360 ? 0 : next;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isTriangleAnimating]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-blue-200">
        <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">{t('step5Title')}</h3>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
          <AnimatedText text={t('step5Concept')} />
        </p>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-l-4 border-indigo-500">
            <span className="text-2xl">🔺</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('triangleP1')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border-l-4 border-purple-500">
            <span className="text-2xl">📐</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('triangleP2')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl border-l-4 border-violet-500">
            <span className="text-2xl">3️⃣</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('triangleP3')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-fuchsia-50 to-pink-50 rounded-xl border-l-4 border-fuchsia-500">
            <span className="text-2xl">1️⃣</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('triangleP4')} /></p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-indigo-200">
        <h4 className="text-xl md:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">{t('triangleOrder3')}</h4>
        <div className="relative w-full h-64 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* True equilateral triangle (60° at every vertex) */}
            {/* Centroid at (100,120) */}
            <circle cx="100" cy="120" r="3" fill="#0ea5e9" />
            <g transform={`rotate(${triangleAngle}, 100, 120)`}>
              <polygon points="100,40 160,160 40,160" fill="none" stroke="#111827" strokeWidth="4" />
              {/* Mark a vertex */}
              <circle cx="100" cy="40" r="5" fill="#ef4444" />
            </g>
          </svg>
        </div>
        
      </div>
    </div>
  );
}

