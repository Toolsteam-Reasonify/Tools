import { useState, useEffect } from 'react';
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
  }, [text]);
  return <span>{displayedText}</span>;
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
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
      else setIsPlaying(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);

  const renderCircumference = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">⚪</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('step1Title')}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          <AnimatedText text={t('step1Concept')} />
        </p>
        <div className="space-y-4">
          {[t('circKey1'), t('circKey2'), t('circKey3'), t('circKey4'), t('circKey5')].map((text, i) => {
            const colors = [
              { bg: 'from-blue-50 to-cyan-100', border: 'border-blue-500' },
              { bg: 'from-purple-50 to-pink-100', border: 'border-purple-500' },
              { bg: 'from-green-50 to-emerald-100', border: 'border-green-500' },
              { bg: 'from-orange-50 to-amber-100', border: 'border-orange-500' },
              { bg: 'from-teal-50 to-cyan-100', border: 'border-teal-500' },
            ];
            return (
              <div key={i} className={`p-4 bg-gradient-to-r ${colors[i].bg} rounded-xl border-l-4 ${colors[i].border} transform hover:scale-105 transition-all duration-300 shadow-md`}>
                <p className="text-gray-800 font-medium"><AnimatedText text={text} delay={i * 150} /></p>
              </div>
            );
          })}
          <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-100 rounded-xl border-l-4 border-indigo-500 shadow-md transform hover:scale-105 transition-all duration-300">
            <p className="text-gray-800 font-semibold">{t('formulaCirc')}</p>
          </div>
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200 overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
            {t('circumferenceVisual')}
          </h4>
          <div className="bg-white/90 rounded-2xl p-8 shadow-xl flex flex-col items-center gap-4">
            <div className="w-64 h-64 rounded-full border-4 border-gray-800 relative">
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                {t('diameter')}
              </div>
              <div className="absolute left-1/2 top-0 bottom-0 border-l-4 border-red-500" />
            </div>
            <div className="text-gray-700 font-medium">{t('formulaCirc')}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCircumferenceFormula = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-green-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">📐</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            {t('step2Title')}
          </h3>
        </div>
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl border-l-4 border-green-500 shadow-md transform hover:scale-105 transition-all duration-300">
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step2Step1')} /></p>
          </div>
          <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-100 rounded-xl border-l-4 border-teal-500 shadow-md transform hover:scale-105 transition-all duration-300">
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step2Step2')} delay={300} /></p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 font-medium">
          <div className="p-4 rounded-xl border-2 border-green-400 bg-gradient-to-r from-green-50 to-emerald-100 flex items-start gap-3 shadow-sm">
            <span className="text-2xl">📏</span>
            <div>
              <div className="text-green-800">{t('diameter')} {t('diameterFormula')}</div>
              <div className="text-xs text-green-700/80">{t('diameterTwice')}</div>
            </div>
          </div>
          <div className="p-4 rounded-xl border-2 border-teal-400 bg-gradient-to-r from-teal-50 to-cyan-100 flex items-start gap-3 shadow-sm">
            <span className="text-2xl">🧮</span>
            <div>
              <div className="text-teal-800">{t('formulaCirc')}</div>
              <div className="text-xs text-teal-700/80">{t('usePiApprox')}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-green-200 overflow-hidden">
        <div className="relative z-10 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-64 h-64">
            <circle cx="100" cy="100" r="80" stroke="#1f2937" strokeWidth="4" fill="none" />
            {/* diameter line through center */}
            <line x1="100" y1="20" x2="100" y2="180" stroke="#9333ea" strokeWidth="4" />
            <rect x="94" y="90" width="12" height="20" rx="3" fill="#9333ea" />
            <text x="100" y="105" textAnchor="middle" fontSize="12" fill="#ffffff" style={{ fontWeight: 'bold' }}>d</text>
            <text x="100" y="195" textAnchor="middle" fontSize="14" fill="#9333ea" style={{ fontWeight: '600' }}>{t('diameter')}</text>
          </svg>
        </div>
      </div>
    </div>
  );

  const renderArea = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-orange-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">🧩</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {t('step3Title')}
          </h3>
        </div>
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-100 rounded-xl border-l-4 border-orange-500 shadow-md transform hover:scale-105 transition-all duration-300">
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step3Step1')} /></p>
          </div>
          <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-100 rounded-xl border-l-4 border-pink-500 shadow-md transform hover:scale-105 transition-all duration-300">
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step3Step2')} delay={300} /></p>
          </div>
          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-100 rounded-xl border-l-4 border-red-500 shadow-md transform hover:scale-105 transition-all duration-300">
            <p className="text-gray-800 font-semibold"><AnimatedText text={t('step3Step3')} delay={600} /></p>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-100 rounded-xl border-l-4 border-indigo-500 font-semibold text-gray-800 shadow-md transform hover:scale-105 transition-all duration-300">
          {t('formulaArea')}
        </div>
      </div>
      <div className="relative bg-gradient-to-br from-orange-100 via-pink-100 to-red-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-orange-200 overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">{t('areaVisual')}</h4>
          <div className="bg-white/90 rounded-2xl p-6 shadow-xl">
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="h-10 bg-gradient-to-b from-blue-200 to-blue-300 rounded-sm" />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3 text-center">{t('circleSectorsDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAreaFormula = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">🧮</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('step4Title')}
          </h3>
        </div>
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-100 rounded-xl border-l-4 border-indigo-500 shadow-md transform hover:scale-105 transition-all duration-300">
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step4Step1')} /></p>
          </div>
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-100 rounded-xl border-l-4 border-purple-500 shadow-md transform hover:scale-105 transition-all duration-300">
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step4Step2')} delay={300} /></p>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-100 rounded-xl border-l-4 border-blue-500 shadow-md transform hover:scale-105 transition-all duration-300">
            <p className="text-gray-800 font-semibold"><AnimatedText text={t('step4Step3')} delay={600} /></p>
          </div>
          <div className="p-4 bg-gradient-to-r from-cyan-50 to-teal-100 rounded-xl border-l-4 border-cyan-500 shadow-md transform hover:scale-105 transition-all duration-300">
            <p className="text-gray-800 font-semibold"><AnimatedText text={t('step4Step4')} delay={900} /></p>
          </div>
        </div>
      </div>
      <div className="relative bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-200 overflow-hidden">
        <div className="relative z-10 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full border-4 border-gray-800 relative">
            <div className="absolute left-1/2 top-0 bottom-0 border-l-4 border-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">⚪ {t('appTitle')} - {currentStep + 1}/{steps.length}</h2>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        {currentStep === 0 && renderCircumference()}
        {currentStep === 1 && renderCircumferenceFormula()}
        {currentStep === 2 && renderArea()}
        {currentStep === 3 && renderAreaFormula()}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 bg-white rounded-xl shadow-lg border">
        <button onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0} className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-base transition-all duration-300 ${currentStep === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transform hover:scale-105'}`}>← {t('previous')}</button>
        <button onClick={() => setIsPlaying(!isPlaying)} className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${isPlaying ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl' : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-xl'}`}>{isPlaying ? t('pause') : t('play')}</button>
        <button onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))} disabled={currentStep === steps.length - 1} className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${currentStep === steps.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'}`}>{t('next')} →</button>
      </div>
    </div>
  );
}

