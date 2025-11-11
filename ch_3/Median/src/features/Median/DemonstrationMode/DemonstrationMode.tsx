import { useEffect, useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { MedianCalculation } from '../../../interfaces/medianTypes';

// Word-by-word animation component
function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const words = text.split(' ');

  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    let currentIndex = 0;
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedText(words.slice(0, currentIndex + 1).join(' '));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 100); // 100ms between each word
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [text]);

  return <span>{displayedText}</span>;
}

type DemoStep = {
  id: number;
  title: string;
  description: string;
  dataset: number[];
  context: string;
  visualType: 'calculation' | 'bar_chart' | 'table';
  showExample?: boolean;
};

export default function DemonstrationMode() {
  const { isTransitioning, t } = useLanguage();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const demoSteps: DemoStep[] = [
    { id: 1, title: t('step1Title'), description: '', dataset: [3, 1, 4, 1, 5], context: t('step1Context'), visualType: 'calculation', showExample: false },
    {
      id: 2,
      title: t('step2Title'),
      description: t('step2Desc'),
      dataset: [19, 25, 23, 20, 9],
      context: t('step1Context'),
      visualType: 'bar_chart',
      showExample: true
    },
    {
      id: 3,
      title: t('step3Title'),
      description: t('step3Desc'),
      dataset: [6, 15, 120, 50, 80, 100],
      context: t('step3Context'),
      visualType: 'bar_chart'
    },
    {
      id: 4,
      title: t('step4Title'),
      description: t('step4Desc'),
      dataset: [9, 25, 23, 20, 10, 16, 23, 20],
      context: t('step4Context'),
      visualType: 'table'
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const tmr = setTimeout(() => setCurrentStep(s => Math.min(s + 1, demoSteps.length - 1)), 5000);
    return () => clearTimeout(tmr);
  }, [isPlaying, currentStep]);

  const calc = (data: number[]): MedianCalculation => {
    const sorted = [...data].sort((a, b) => a - b);
    const n = sorted.length;
    const isOdd = n % 2 === 1;
    let median: number;
    let middleIndex: number | undefined;
    let middleIndices: [number, number] | undefined;

    if (isOdd) {
      middleIndex = Math.floor(n / 2);
      median = sorted[middleIndex];
    } else {
      const mid1 = n / 2 - 1;
      const mid2 = n / 2;
      middleIndices = [mid1, mid2];
      median = (sorted[mid1] + sorted[mid2]) / 2;
    }

    return { dataset: data, sortedData: sorted, median, n, isOdd, middleIndex, middleIndices };
  };

  const dataCalc = calc(demoSteps[currentStep].dataset);

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            📊 {t('headerTitle')} - {currentStep + 1}/{demoSteps.length}
          </h2>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
            style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Left - Concept */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-5xl">📊</span>
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {demoSteps[currentStep].title}
              </h3>
            </div>
            {demoSteps[currentStep].description && (
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
                <AnimatedText text={demoSteps[currentStep].description} />
              </p>
            )}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500 transform hover:scale-105 transition-all duration-300">
                  <span className="text-2xl">📊</span>
                  <div>
                    <div className="text-xl font-bold text-gray-800 mb-2">{t('definitionLabel')}</div>
                    <p className="text-gray-700"><AnimatedText text={t('medianDefText')} delay={200} /></p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500 transform hover:scale-105 transition-all duration-300">
                  <span className="text-2xl">📍</span>
                  <p className="text-gray-800 font-medium"><AnimatedText text={t('bulletMiddleValue')} delay={400} /></p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border-l-4 border-pink-500 transform hover:scale-105 transition-all duration-300">
                  <span className="text-2xl">🔢</span>
                  <p className="text-gray-800 font-medium"><AnimatedText text={t('bulletOddEven')} delay={600} /></p>
                </div>
              </div>
            )}
            {currentStep !== 0 && (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500">
                  <div className="text-sm font-medium text-gray-700">📦 {t('data')}: [{demoSteps[currentStep].dataset.join(', ')}]</div>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500">
                  <div className="text-sm font-medium text-gray-700">📈 {t('sortedData')}: [{dataCalc.sortedData.join(', ')}]</div>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500">
                  <div className="text-sm font-medium text-gray-700">🔢 n = {dataCalc.n} ({dataCalc.isOdd ? t('isOdd') : t('isEven')})</div>
                </div>
                <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-l-4 border-orange-500">
                  <div className="text-sm font-medium text-gray-700"><span className="font-semibold">📍 {t('medianLabel')}:</span> {dataCalc.median}</div>
                </div>
              </div>
            )}
          </div>
          {/* Right - Visual example */}
          <div className="relative bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200 overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10">
              <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                🎨 {t('visual')}
              </h4>
              {currentStep === 0 ? (
                <div className="w-full space-y-4">
                  <div className="rounded-xl border-2 border-blue-300/70 p-8 sm:p-10 bg-gradient-to-br from-blue-50 via-white to-purple-50 shadow-xl relative overflow-hidden min-h-[160px]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-4 sm:mb-5 text-center">{t('formulaOdd')}</div>
                    <div className="text-3xl md:text-4xl font-extrabold mb-2 leading-normal text-center overflow-hidden whitespace-nowrap px-1">
                      <span className="text-purple-600">Median</span>
                      <span className="text-gray-700"> = </span>
                      <span className="text-blue-600">x</span>
                      <sub className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600">((n+1)/2)</sub>
                    </div>
                  </div>
                  <div className="rounded-xl border-2 border-purple-300/70 p-6 sm:p-8 bg-gradient-to-br from-purple-50 via-white to-pink-50 shadow-xl relative overflow-hidden min-w-full min-h-[160px]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    <div className="text-xl sm:text-2xl font-extrabold text-purple-700 mb-4 sm:mb-5 text-center">{t('formulaEven')}</div>
                    <div className="text-lg sm:text-xl md:text-2xl font-extrabold leading-normal text-center overflow-hidden whitespace-nowrap px-1 tracking-tight">
                      <span className="text-purple-600">Median</span>
                      <span className="text-gray-700"> = (</span>
                      <span className="text-blue-600">x</span>
                      <sub className="text-base sm:text-lg md:text-xl font-bold text-orange-600">(n/2)</sub>
                      <span className="text-gray-700"> + </span>
                      <span className="text-blue-600">x</span>
                      <sub className="text-base sm:text-lg md:text-xl font-bold text-orange-600">(n/2)+1</sub>
                      <span className="text-gray-700">) / 2</span>
                    </div>
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 italic font-medium bg-gray-50 p-3 rounded-lg border border-gray-200">{t('whereN')}</div>
                </div>
              ) : (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                  {renderVis(demoSteps[currentStep], dataCalc, t, hoveredBar, setHoveredBar)}
                </div>
              )}
            </div>
          </div>
        </div>
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
          onClick={() => setCurrentStep(s => Math.min(demoSteps.length - 1, s + 1))}
          disabled={currentStep === demoSteps.length - 1}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
            currentStep === demoSteps.length - 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {t('next')} →
        </button>
      </div>
    </div>
  )
}

function renderVis(
  step: DemoStep,
  calc: MedianCalculation,
  t: (key: string) => string,
  hoveredBar: number | null,
  setHoveredBar: (i: number | null) => void
) {
  switch (step.visualType) {
    case 'bar_chart':
      return (
        <div className="relative w-full max-w-md">
          {/* Animated background decorations */}
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 space-y-2 bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 border-white/60 shadow-xl">
            {calc.sortedData.map((v, i) => {
              const isMedianPosition = calc.isOdd
                ? i === calc.middleIndex
                : calc.middleIndices && (i === calc.middleIndices[0] || i === calc.middleIndices[1]);

              return (
                <div
                  key={i}
                  className="flex items-center gap-2 transition-all duration-300"
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <span className={`text-xs w-8 transition-all duration-300 ${hoveredBar === i ? 'font-bold text-blue-700' : ''}`}>{i + 1}</span>
                  <div className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-6 relative overflow-hidden cursor-pointer hover:h-7 transition-all duration-300 shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isMedianPosition
                          ? 'bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 animate-pulse shadow-lg'
                          : hoveredBar === i
                            ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-md'
                            : 'bg-gradient-to-r from-blue-400 to-blue-500'
                        }`}
                      style={{ width: `${(v / Math.max(...calc.sortedData)) * 100}%` }}
                    />
                    {hoveredBar === i && (
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-lg animate-bounce">
                        {v}
                      </div>
                    )}
                  </div>
                  <span className={`text-xs w-10 text-right transition-all duration-300 ${hoveredBar === i ? 'font-bold text-blue-700 scale-110' : ''}`}>{v}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    case 'table':
      return (
        <div className="relative w-full max-w-md">
          {/* Animated background decorations */}
          <div className="absolute -top-4 -right-4 w-40 h-40 bg-gradient-to-br from-yellow-200/40 to-orange-200/40 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-36 h-36 bg-gradient-to-br from-green-200/30 to-teal-200/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-100/25 to-purple-100/25 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 border-white/70 shadow-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 to-purple-100">
                  <th className="px-3 py-2 text-left font-bold text-blue-700">{t('position')}</th>
                  <th className="px-3 py-2 text-left font-bold text-blue-700">{t('value')}</th>
                </tr>
              </thead>
              <tbody>
                {calc.sortedData.map((v, i) => {
                  const isMedianPosition = calc.isOdd
                    ? i === calc.middleIndex
                    : calc.middleIndices && (i === calc.middleIndices[0] || i === calc.middleIndices[1]);
                  return (
                    <tr
                      key={i}
                      className={`transition-all duration-300 cursor-pointer ${isMedianPosition
                          ? 'bg-gradient-to-r from-yellow-100 via-amber-100 to-orange-100 font-bold shadow-md transform hover:scale-105'
                          : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50'
                        }`}
                    >
                      <td className="px-3 py-2 border-b border-gray-200">{i + 1} {isMedianPosition && <span className="animate-bounce inline-block">📍</span>}</td>
                      <td className="px-3 py-2 border-b border-gray-200 font-medium">{v}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-3 text-xs text-gray-700 italic font-medium bg-gradient-to-r from-yellow-50 to-amber-50 p-2 rounded-lg border border-yellow-200">
              💡 📍 marks the median position(s)
            </div>
          </div>
        </div>
      );
    default:
      return <div className="text-gray-500">Median: {calc.median}</div>;
  }
}

