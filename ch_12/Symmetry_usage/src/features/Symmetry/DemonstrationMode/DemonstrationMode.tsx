import { useEffect, useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

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
  }, [text, delay]);

  return <span>{displayedText}</span>;
}

export default function DemonstrationMode() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 0, title: t('step1Title'), desc: t('step1Desc') },
    { id: 1, title: t('step2Title'), desc: t('step2Desc') },
    { id: 2, title: t('step3Title'), desc: t('step3Desc') },
    { id: 3, title: t('step4Title'), desc: t('step4Desc') },
  ];

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
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500">
            <span className="text-2xl">🌿</span>
            <p className="text-gray-800 font-medium whitespace-nowrap overflow-x-auto"><AnimatedText text={t('introP1')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500">
            <span className="text-2xl">🛠️</span>
            <p className="text-gray-800 font-medium whitespace-nowrap overflow-x-auto"><AnimatedText text={t('introP2')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border-l-4 border-pink-500">
            <span className="text-2xl">🪞</span>
            <p className="text-gray-800 font-medium whitespace-nowrap overflow-x-auto"><AnimatedText text={t('introP3')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border-l-4 border-amber-500">
            <span className="text-2xl">🎨</span>
            <p className="text-gray-800 font-medium whitespace-nowrap overflow-x-auto"><AnimatedText text={t('introP4')} /></p>
          </div>
        </div>
      </StepCard>

      <div className="relative bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl shadow-2xl p-6 border-2 border-purple-200">
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">{t('mirrorLine')}</h4>

          {/* Shapes with dotted symmetry lines (from textbook Fig 12.1) */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {/* T shape with vertical line */}
            <div className="bg-white rounded-xl p-4 shadow-md border">
              <svg viewBox="0 0 200 160" className="w-full h-36">
                <rect x="30" y="20" width="140" height="20" fill="white" stroke="#111827" strokeWidth="4" />
                <rect x="90" y="40" width="20" height="100" fill="white" stroke="#111827" strokeWidth="4" />
                <line x1="100" y1="10" x2="100" y2="150" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="6 6" />
              </svg>
            </div>

            {/* Step shape with diagonal line */}
            <div className="bg-white rounded-xl p-4 shadow-md border">
              <svg viewBox="0 0 200 160" className="w-full h-36">
                <polyline points="40,120 40,60 110,60 110,40 160,40 160,100 80,100 80,120 40,120" fill="white" stroke="#111827" strokeWidth="4" />
                <line x1="40" y1="120" x2="160" y2="40" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="6 6" />
              </svg>
            </div>

            {/* Letter M with vertical line */}
            <div className="bg-white rounded-xl p-4 shadow-md border">
              <svg viewBox="0 0 200 160" className="w-full h-36">
                <polyline points="40,130 60,30 100,110 140,30 160,130" fill="white" stroke="#111827" strokeWidth="4" />
                <line x1="100" y1="10" x2="100" y2="150" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="6 6" />
              </svg>
            </div>

            {/* Square with horizontal dotted center line */}
            <div className="bg-white rounded-xl p-4 shadow-md border">
              <svg viewBox="0 0 200 160" className="w-full h-36">
                <rect x="40" y="30" width="120" height="100" fill="none" stroke="#111111" strokeWidth="4" />
                <line x1="30" y1="80" x2="170" y2="80" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <StepCard title={t('step2Title')}>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          <AnimatedText text={t('step2Concept')} />
        </p>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border-l-4 border-green-500">
            <span className="text-2xl">👈👉</span>
            <p className="text-gray-800 font-medium whitespace-nowrap overflow-x-auto"><AnimatedText text={t('mirrorP1')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-100 rounded-xl border-l-4 border-emerald-500">
            <span className="text-2xl">🪞</span>
            <p className="text-gray-800 font-medium whitespace-nowrap overflow-x-auto"><AnimatedText text={t('mirrorP2')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-sky-50 to-cyan-100 rounded-xl border-l-4 border-sky-500">
            <span className="text-2xl">➖</span>
            <p className="text-gray-800 font-medium whitespace-nowrap overflow-x-auto"><AnimatedText text={t('mirrorP3')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-teal-50 to-lime-50 rounded-xl border-l-4 border-teal-500">
            <span className="text-2xl">🔍</span>
            <p className="text-gray-800 font-medium whitespace-nowrap overflow-x-auto"><AnimatedText text={t('mirrorP4')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-l-4 border-indigo-500">
            <span className="text-2xl">💡</span>
            <p className="text-gray-800 font-medium whitespace-nowrap overflow-x-auto"><AnimatedText text={t('mirrorP5')} /></p>
          </div>
        </div>
      </StepCard>

      <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-green-200">
        <h4 className="text-xl md:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-green-700 to-teal-700 bg-clip-text text-transparent">{t('mirrorLine')}</h4>
        <div className="grid grid-cols-1 gap-4">
          {/* A vs mirror A */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 flex items-center justify-center gap-4">
            <span className="text-4xl font-extrabold text-gray-800">A</span>
            <div className="h-12 border-l-2 border-dashed border-gray-400"></div>
            <span className="text-4xl font-extrabold text-gray-800" style={{ transform: 'scaleX(-1)' }}>A</span>
          </div>
          {/* B vs mirror B */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 flex items-center justify-center gap-4">
            <span className="text-4xl font-extrabold text-gray-800">B</span>
            <div className="h-12 border-l-2 border-dashed border-gray-400"></div>
            <span className="text-4xl font-extrabold text-gray-800" style={{ transform: 'scaleX(-1)' }}>B</span>
          </div>
          {/* C vs mirror C */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 flex items-center justify-center gap-4">
            <span className="text-4xl font-extrabold text-gray-800">C</span>
            <div className="h-12 border-l-2 border-dashed border-gray-400"></div>
            <span className="text-4xl font-extrabold text-gray-800" style={{ transform: 'scaleX(-1)' }}>C</span>
          </div>
          {/* D vs mirror D */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 flex items-center justify-center gap-4">
            <span className="text-4xl font-extrabold text-gray-800">D</span>
            <div className="h-12 border-l-2 border-dashed border-gray-400"></div>
            <span className="text-4xl font-extrabold text-gray-800" style={{ transform: 'scaleX(-1)' }}>D</span>
          </div>
          {/* E vs mirror E */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 flex items-center justify-center gap-4">
            <span className="text-4xl font-extrabold text-gray-800">E</span>
            <div className="h-12 border-l-2 border-dashed border-gray-400"></div>
            <span className="text-4xl font-extrabold text-gray-800" style={{ transform: 'scaleX(-1)' }}>E</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <StepCard title={t('step3Title')}>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
          <AnimatedText text={t('step3Concept')} />
        </p>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-l-4 border-indigo-500">
            <span className="text-2xl">📄</span>
            <p className="text-gray-800 font-medium whitespace-nowrap overflow-x-auto"><AnimatedText text={t('punchP1')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-500">
            <span className="text-2xl">✂️</span>
            <p className="text-gray-800 font-medium whitespace-nowrap overflow-x-auto"><AnimatedText text={t('punchP2')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border-l-4 border-pink-500">
            <span className="text-2xl">👁️</span>
            <p className="text-gray-800 font-medium whitespace-nowrap overflow-x-auto"><AnimatedText text={t('punchP3')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border-l-4 border-violet-500">
            <span className="text-2xl">➖</span>
            <p className="text-gray-800 font-medium whitespace-nowrap overflow-x-auto"><AnimatedText text={t('punchP4')} /></p>
          </div>
        </div>
      </StepCard>

      <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-indigo-200">
        <div className="grid grid-cols-3 gap-6">
          {/* fold */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-full h-32">
              <rect x="30" y="20" width="80" height="120" fill="#ffffff" stroke="#111827" strokeWidth="3" />
              <line x1="70" y1="20" x2="70" y2="140" stroke="#0ea5e9" strokeDasharray="6 6" strokeWidth="3" />
            </svg>
          </div>
          {/* punch */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-full h-32">
              <rect x="70" y="20" width="50" height="120" fill="#ffffff" stroke="#111827" strokeWidth="3" />
              <line x1="70" y1="20" x2="70" y2="140" stroke="#0ea5e9" strokeDasharray="6 6" strokeWidth="3" />
              <circle cx="85" cy="80" r="6" fill="#111827" />
            </svg>
          </div>
          {/* open */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 flex items-center justify-center">
            <svg viewBox="0 0 200 160" className="w-full h-32">
              <rect x="30" y="20" width="140" height="120" fill="#ffffff" stroke="#111827" strokeWidth="3" />
              <circle cx="90" cy="80" r="6" fill="#111827" />
              <circle cx="110" cy="80" r="6" fill="#111827" />
              <line x1="100" y1="10" x2="100" y2="150" stroke="#0ea5e9" strokeDasharray="6 6" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <StepCard title={t('step4Title')}>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
          <AnimatedText text={t('step4Concept')} />
        </p>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-500">
            <span className="text-2xl">📐</span>
            <p className="text-gray-800 font-medium whitespace-nowrap overflow-x-auto"><AnimatedText text={t('polygonP1')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-l-4 border-orange-500">
            <span className="text-2xl">🔺</span>
            <p className="text-gray-800 font-medium whitespace-nowrap overflow-x-auto"><AnimatedText text={t('polygonP2')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-l-4 border-amber-500">
            <span className="text-2xl">⬜</span>
            <p className="text-gray-800 font-medium whitespace-nowrap overflow-x-auto"><AnimatedText text={t('polygonP3')} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-500">
            <span className="text-2xl">🔢</span>
            <p className="text-gray-800 font-medium whitespace-nowrap overflow-x-auto"><AnimatedText text={t('polygonP4')} /></p>
          </div>
        </div>
      </StepCard>

      <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-yellow-200">
        <div className="grid grid-cols-2 gap-6">
          {/* Equilateral triangle */}
          <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
            <svg viewBox="0 0 200 200" className="w-full h-40">
              <polygon points="100,20 20,180 180,180" className="fill-white stroke-gray-800" strokeWidth="4" />
              <line x1="100" y1="20" x2="100" y2="180" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
              <line x1="20" y1="180" x2="150" y2="70" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
              <line x1="180" y1="180" x2="50" y2="70" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
            </svg>
            <p className="text-center text-sm font-semibold text-gray-700">{t('triangle')}: 3</p>
          </div>
          {/* Square */}
          <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
            <svg viewBox="0 0 200 200" className="w-full h-40">
              <rect x="30" y="30" width="140" height="140" className="fill-white stroke-gray-800" strokeWidth="4" />
              <line x1="100" y1="30" x2="100" y2="170" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
              <line x1="30" y1="100" x2="170" y2="100" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
              <line x1="30" y1="30" x2="170" y2="170" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
              <line x1="170" y1="30" x2="30" y2="170" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
            </svg>
            <p className="text-center text-sm font-semibold text-gray-700">{t('square')}: 4</p>
          </div>
          {/* Regular Pentagon */}
          <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
            <svg viewBox="0 0 200 200" className="w-full h-40">
              <polygon points="100,20 163,66 149,141 51,141 37,66" className="fill-white stroke-gray-800" strokeWidth="4" />
              {/* 5 axes: each vertex to midpoint of opposite side (all pass center) */}
              {/* V0(100,20) -> midpoint of V2(149,141) & V3(51,141) => (100,141) */}
              <line x1="100" y1="20" x2="100" y2="141" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
              {/* V1(163,66) -> midpoint of V3(51,141) & V4(37,66) => (44,103.5) */}
              <line x1="163" y1="66" x2="44" y2="103.5" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
              {/* V2(149,141) -> midpoint of V4(37,66) & V0(100,20) => (68.5,43) */}
              <line x1="149" y1="141" x2="68.5" y2="43" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
              {/* V3(51,141) -> midpoint of V0(100,20) & V1(163,66) => (131.5,43) */}
              <line x1="51" y1="141" x2="131.5" y2="43" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
              {/* V4(37,66) -> midpoint of V1(163,66) & V2(149,141) => (156,103.5) */}
              <line x1="37" y1="66" x2="156" y2="103.5" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
            </svg>
            <p className="text-center text-sm font-semibold text-gray-700">{t('pentagon')}: 5</p>
          </div>
          {/* Regular Hexagon */}
          <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
            <svg viewBox="0 0 200 200" className="w-full h-40">
              <polygon points="100,20 163,50 163,130 100,160 37,130 37,50" className="fill-white stroke-gray-800" strokeWidth="4" />
              {/* Vertical line through center: through opposite vertices */}
              <line x1="100" y1="20" x2="100" y2="160" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
              {/* Through opposite vertices: top-right to bottom-left */}
              <line x1="163" y1="50" x2="37" y2="130" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
              {/* Through opposite vertices: top-left to bottom-right */}
              <line x1="37" y1="50" x2="163" y2="130" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
              {/* Through midpoints: horizontal line through center */}
              <line x1="37" y1="90" x2="163" y2="90" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
              {/* Through midpoints: slanted line through center */}
              <line x1="131.5" y1="35" x2="68.5" y2="145" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
              {/* Through midpoints: other slanted line through center */}
              <line x1="68.5" y1="35" x2="131.5" y2="145" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
            </svg>
            <p className="text-center text-sm font-semibold text-gray-700">{t('hexagon')}: 6</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">🔁 {t('appTitle')} - {currentStep + 1}/{steps.length}</h2>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        {currentStep === 0 && renderStep1()}
        {currentStep === 1 && renderStep2()}
        {currentStep === 2 && renderStep3()}
        {currentStep === 3 && renderStep4()}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 bg-white rounded-xl shadow-lg border">
        <button onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0} className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-base transition-all duration-300 ${currentStep === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transform hover:scale-105'}`}>← {t('previous')}</button>
        <button onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))} disabled={currentStep === steps.length - 1} className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${currentStep === steps.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'}`}>{t('next')} →</button>
      </div>
    </div>
  );
}


