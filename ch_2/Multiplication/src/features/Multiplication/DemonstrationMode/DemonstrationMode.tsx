import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { FractionCircle, RepeatedBars, AreaModelGrid } from '../Shared/FractionVisuals';
import { FractionSliderCircle, InteractiveAreaPlayground } from '../Shared/Interactive';
import { FractionAdditionVisual } from '../Shared/FractionAddition';
import { GridFractionAddition } from '../Shared/GridFractionAddition';
import { CircleMultiplyVisual } from '../Shared/CircleMultiplyVisual';

function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    setWords(text.split(' '));
  }, [text]);

  return (
    <span className="word-animate">
      {words.map((w, i) => (
        <span key={i} className={`delay-${(i % 10) + 1}`} style={{ animationDelay: `${delay + i * 80}ms` }}>
          {w}{' '}
        </span>
      ))}
    </span>
  );
}

export default function DemonstrationMode() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    { id: 0, title: t('fractionAdditionTitle'), desc: t('fractionAdditionSubtitle') },
    { id: 1, title: t('gridTitle'), desc: t('gridSubtitle') },
    { id: 2, title: t('step2Title'), desc: t('step2Desc') },
    { id: 3, title: t('step3Title'), desc: t('step3Desc') },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
      else setIsPlaying(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);

  const renderPanel = (title: string, description: string, content: React.ReactNode) => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">✖️</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          <AnimatedText text={description} />
        </p>
      </div>
      <div className="relative bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200 overflow-hidden">
        <div className="bg-white/90 rounded-2xl p-4 shadow-xl flex items-center justify-center">
          {content}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">✖️ {t('appTitle')} - {currentStep + 1}/{steps.length}</h2>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        {currentStep === 0 && (
          <FractionAdditionVisual />
        )}
        {currentStep === 1 && (
          <GridFractionAddition />
        )}
        {currentStep === 2 && (
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Left: step-wise guide */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-5xl">✖️</span>
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('step2Title')}
                </h3>
              </div>
              <div className="space-y-4 text-gray-800">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border-l-4 border-blue-400">
                  <span className="shrink-0 text-xl">①</span>
                  <div><AnimatedText text={t('step2Guide1')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50 border-l-4 border-purple-400">
                  <span className="shrink-0 text-xl">②</span>
                  <div><AnimatedText text={t('step2Guide2')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border-l-4 border-green-400">
                  <span className="shrink-0 text-xl">③</span>
                  <div><AnimatedText text={t('step2Guide3')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border-l-4 border-emerald-400">
                  <span className="shrink-0 text-xl">④</span>
                  <div><AnimatedText text={t('step2Guide4')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border-l-4 border-amber-400">
                  <span className="shrink-0 text-xl">⑤</span>
                  <div><AnimatedText text={t('step2Guide5')} /></div>
                </div>
              </div>
            </div>
            {/* Right: bright circle visuals */}
            <div className="relative bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200 overflow-hidden">
              <div className="bg-white/90 rounded-2xl p-4 shadow-xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-8">
                  <CircleMultiplyVisual
                    left={{ numerator: 1, denominator: 2, color: '#3b82f6' }}
                    right={{ numerator: 1, denominator: 3, color: '#8b5cf6' }}
                    product={{ numerator: 1, denominator: 6, color: '#10b981' }}
                    size={120}
                  />
                  <CircleMultiplyVisual
                    left={{ numerator: 1, denominator: 3, color: '#3b82f6' }}
                    right={{ numerator: 1, denominator: 2, color: '#8b5cf6' }}
                    product={{ numerator: 1, denominator: 6, color: '#10b981' }}
                    size={120}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Left: step-wise practice tips */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-5xl">✖️</span>
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('step3Title')}
                </h3>
              </div>
              <p className="text-gray-700 mb-4"><AnimatedText text={t('step3Intro')} /></p>
              <div className="space-y-4 text-gray-800">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border-l-4 border-blue-400">
                  <span className="shrink-0 text-xl">①</span>
                  <div><AnimatedText text={t('step3Guide1')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50 border-l-4 border-purple-400">
                  <span className="shrink-0 text-xl">②</span>
                  <div><AnimatedText text={t('step3Guide2')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border-l-4 border-emerald-400">
                  <span className="shrink-0 text-xl">③</span>
                  <div><AnimatedText text={t('step3Guide3')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-cyan-50 border-l-4 border-cyan-400">
                  <span className="shrink-0 text-xl">④</span>
                  <div><AnimatedText text={t('step3Guide4')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 border-l-4 border-orange-400">
                  <span className="shrink-0 text-xl">⑤</span>
                  <div><AnimatedText text={t('step3Guide5')} /></div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border-l-4 border-red-400">
                  <span className="shrink-0 text-xl">⑥</span>
                  <div><AnimatedText text={t('step3Guide6')} /></div>
                </div>
              </div>
            </div>
            {/* Right: interactive visuals */}
            <div className="relative bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200 overflow-hidden">
              <div className="bg-white/90 rounded-2xl p-4 shadow-xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-8">
                  <CircleMultiplyVisual
                    left={{ numerator: 2, denominator: 3, color: '#3b82f6' }}
                    right={{ numerator: 3, denominator: 5, color: '#8b5cf6' }}
                    product={{ numerator: 2, denominator: 5, color: '#10b981' }}
                    size={120}
                  />
                  <CircleMultiplyVisual
                    left={{ numerator: 3, denominator: 4, color: '#3b82f6' }}
                    right={{ numerator: 1, denominator: 2, color: '#8b5cf6' }}
                    product={{ numerator: 3, denominator: 8, color: '#10b981' }}
                    size={120}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Step 5 removed as requested */}
      </div>

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


