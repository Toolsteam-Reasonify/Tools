import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { DecimalMultiplicationGrid, DecimalMultiplicationGrid23 } from '../Shared/DecimalGridVisual';

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


// Decimal Point Movement Visualization
function DecimalMovement({ operation, input, by, output, explanationKey }: {
  operation: 'multiply' | 'divide';
  input: string;
  by: number;
  output: string;
  explanationKey: string;
}) {
  const { t } = useLanguage();
  const [showMovement, setShowMovement] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMovement(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <div className="text-center space-y-4">
        <div className="text-2xl font-bold text-gray-800">
          {input} {operation === 'multiply' ? '×' : '÷'} {by} = {output}
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="text-lg font-semibold text-gray-700">{input}</div>
          <div className="text-2xl">{operation === 'multiply' ? '→' : '←'}</div>
          <div className={`text-lg font-semibold transition-all duration-1000 ${
            showMovement ? 'text-green-600 scale-110' : 'text-gray-700'
          }`}>
            {output}
          </div>
        </div>
        <p className="text-sm text-gray-600">
          <AnimatedText text={t(explanationKey)} />
        </p>
      </div>
    </div>
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
    }, 8000); // 8 seconds per step for more complex content
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);

  const renderStep1 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">🧮</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('step1Title')}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          <AnimatedText text={t('step1Concept')} />
        </p>
        

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔢</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint1')} delay={200} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">📊</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint2')} delay={400} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border-l-4 border-pink-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🎯</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint3')} delay={600} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border-l-4 border-indigo-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">✨</span>
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
            {t('finding01x01Title')}
          </h4>
          
          <div className="space-y-6">
            {/* Step-by-step calculation */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800 mb-2">{t('step')} 1: {t('keyPoint1')}</p>
                  <div className="text-2xl font-bold text-blue-600">
                    0.1 = <span className="text-red-500">1/10</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800 mb-2">{t('step')} 2: {t('keyPoint2')}</p>
                  <div className="text-2xl font-bold text-green-600">
                    <span className="text-red-500">1/10</span> × <span className="text-red-500">1/10</span> = <span className="text-purple-600">1/100</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800 mb-2">{t('step')} 3: {t('keyPoint3')}</p>
                  <div className="text-2xl font-bold text-purple-600">
                    <span className="text-purple-600">1/100</span> = <span className="text-orange-600">0.01</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-green-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">📊</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            {t('step2Title')}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          <AnimatedText text={t('step2Concept')} />
        </p>
        

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">📐</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step2Point1')} delay={200} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl border-l-4 border-teal-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🎨</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step2Point2')} delay={400} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl border-l-4 border-cyan-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔢</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('countShadedSquares')} delay={600} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🧮</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step2Point4')} delay={800} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border-l-4 border-pink-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">✨</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step2Point5')} delay={1000} /></p>
          </div>
        </div>
      </div>

      {/* Right - Visual example */}
      <div className="relative bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-green-200 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-700 to-teal-700 bg-clip-text text-transparent">
            {t('visualGridRepresentation')}
          </h4>
          
          <div className="space-y-6">
            {/* Enhanced Grid visualization for 0.2 × 0.3 */}
            <DecimalMultiplicationGrid23 />

            {/* Step-by-step explanation */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800"><AnimatedText text={t('gridExplanation1')} /></p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800"><AnimatedText text={t('gridExplanation2')} delay={200} /></p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600"><AnimatedText text={t('gridConclusion')} delay={400} /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-orange-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">⚡</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {t('step3Title')}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          <AnimatedText text={t('step3Concept')} />
        </p>
        

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-l-4 border-orange-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">➡️</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step3Point1')} delay={200} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border-l-4 border-red-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔢</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step3Point2')} delay={400} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border-l-4 border-pink-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">✨</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step3Point3')} delay={600} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">⚡</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step3Point4')} delay={800} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🎯</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step3Point5')} delay={1000} /></p>
          </div>
        </div>
      </div>

      {/* Right - Visual examples */}
      <div className="relative bg-gradient-to-br from-orange-100 via-pink-100 to-red-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-orange-200 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
            {t('decimalPointMovement')}
          </h4>
          
          <div className="space-y-6">
            {/* Examples from the image */}
            <DecimalMovement 
              operation="multiply"
              input="0.07"
              by={10}
              output="0.7"
              explanationKey="oneZeroOnePlaceRight"
            />
            
            <DecimalMovement 
              operation="multiply"
              input="0.07"
              by={100}
              output="7"
              explanationKey="twoZerosTwoPlacesRight"
            />
            
            <DecimalMovement 
              operation="multiply"
              input="0.07"
              by={1000}
              output="70"
              explanationKey="threeZerosThreePlacesRight"
            />

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
          <span className="text-5xl">➗</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('step4Title')}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          <AnimatedText text={t('step4Concept')} />
        </p>
        

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border-l-4 border-indigo-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">⬅️</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step4Point1')} delay={200} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔄</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step4Point2')} delay={400} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border-l-4 border-pink-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">📐</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step4Point3')} delay={600} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl border-l-4 border-teal-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🧮</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step4Point4')} delay={800} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-l-4 border-orange-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">✨</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('step4Point5')} delay={1000} /></p>
          </div>
        </div>
      </div>

      {/* Right - Visual examples */}
      <div className="relative bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-200 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
{t('decimalDivisionExamples')}
          </h4>
          
          <div className="space-y-6">
            {/* Division by 10, 100, 1000 */}
            <DecimalMovement 
              operation="divide"
              input="31.5"
              by={10}
              output="3.15"
              explanationKey="oneZeroOnePlaceLeft"
            />
            
            <DecimalMovement 
              operation="divide"
              input="31.5"
              by={100}
              output="0.315"
              explanationKey="twoZerosTwoPlacesLeft"
            />
            
            <DecimalMovement 
              operation="divide"
              input="31.5"
              by={1000}
              output="0.0315"
              explanationKey="threeZerosThreePlacesLeft"
            />

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
            🧮 {t('appTitle')} - {currentStep + 1}/{steps.length}
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
          {isPlaying ? `⏸️ ${t('pause')}` : `▶️ ${t('play')}`}
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