import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

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
  }, [text, delay]);

  return <span>{displayedText}</span>;
}

// Interactive Fraction Visual Component
function FractionVisual({ numerator, denominator, isHighlighted = false, delay = 0 }: { 
  numerator: number; 
  denominator: number; 
  isHighlighted?: boolean; 
  delay?: number; 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`fraction-grow transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
      <div className={`relative ${isHighlighted ? 'ring-4 ring-yellow-400 rounded-lg p-2' : ''}`}>
        <div className="flex flex-col items-center">
          {/* Numerator */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-400 rounded-lg p-3 mb-1 shadow-lg">
            <span className="text-2xl font-bold text-blue-800">{numerator}</span>
          </div>
          
          {/* Fraction line */}
          <div className="w-16 h-1 bg-gray-600 my-1"></div>
          
          {/* Denominator */}
          <div className="bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-400 rounded-lg p-3 shadow-lg">
            <span className="text-2xl font-bold text-green-800">{denominator}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Circle Division Visual
function CircleDivisionVisual({ whole, parts, delay = 0 }: { whole: number; parts: number; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`circle-grow transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
      <div className="flex items-center justify-center space-x-4">
        {Array.from({ length: whole }, (_, i) => (
          <div key={i} className="relative">
            <svg width="80" height="80" className="transform transition-all duration-300 hover:scale-110">
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeDasharray="2,2"
              />
              {/* Division lines */}
              {parts === 2 && (
                <>
                  <line x1="5" y1="40" x2="75" y2="40" stroke="#ef4444" strokeWidth="2" />
                </>
              )}
              {parts === 4 && (
                <>
                  <line x1="5" y1="40" x2="75" y2="40" stroke="#ef4444" strokeWidth="2" />
                  <line x1="40" y1="5" x2="40" y2="75" stroke="#ef4444" strokeWidth="2" />
                </>
              )}
              {/* Fill one part */}
              <path
                d={parts === 2 ? "M 5 40 A 35 35 0 0 0 75 40 L 40 40 Z" : "M 40 5 A 35 35 0 0 1 75 40 L 40 40 Z"}
                fill="#60a5fa"
                fillOpacity="0.7"
              />
            </svg>
            <div className="text-center mt-2">
              <span className="text-sm font-bold text-gray-700">1/{parts}</span>
            </div>
          </div>
        ))}
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
        setIsPlaying(false); // Stop at the end
      }
    }, 8000); // 8 seconds per step for division content
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);

  const renderStep1 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">➗</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('step1Title')}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          <AnimatedText text={t('step1Concept')} />
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔄</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint1')} delay={200} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">✖️</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint2')} delay={400} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border-l-4 border-pink-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔢</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint3')} delay={600} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔄</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint4')} delay={800} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-l-4 border-orange-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">✅</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint5')} delay={1000} /></p>
          </div>
        </div>
      </div>

      {/* Right - Visual example */}
      <div className="relative bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
            📊 {t('divisionVisualTitle')}
          </h4>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="text-center space-y-6">
              {/* Example: 1 ÷ 1/2 */}
              <div className="space-y-4">
                <h5 className="text-lg font-bold text-gray-800">{t('exampleTitle')}</h5>
                
                {/* Visual representation */}
                <CircleDivisionVisual whole={1} parts={2} delay={500} />
                
                {/* Mathematical steps */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-300">
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      <AnimatedText text={t('halfPartsQuestion')} delay={1000} />
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      <AnimatedText text={t('halfPartsAnswer')} delay={1500} />
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      <AnimatedText text={t('divisionResult')} delay={2000} />
                    </p>
                    <p className="text-lg font-bold text-purple-600">
                      <AnimatedText text={t('multiplicationResult')} delay={2500} />
                    </p>
                    <p className="text-lg font-bold text-indigo-600">
                      <AnimatedText text={t('divisionRule')} delay={3000} />
                    </p>
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
      {/* Left - Reciprocal concept */}
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
        
        {/* Interactive examples */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 border-2 border-green-300">
            <h5 className="font-bold text-gray-800 mb-3">{t('reciprocalExamples')}</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-4">
                <FractionVisual numerator={1} denominator={2} />
                <span className="text-2xl">→</span>
                <FractionVisual numerator={2} denominator={1} isHighlighted={true} delay={500} />
              </div>
              <div className="flex items-center justify-center gap-4">
                <FractionVisual numerator={1} denominator={3} />
                <span className="text-2xl">→</span>
                <FractionVisual numerator={3} denominator={1} isHighlighted={true} delay={800} />
              </div>
              <div className="flex items-center justify-center gap-4">
                <FractionVisual numerator={2} denominator={3} />
                <span className="text-2xl">→</span>
                <FractionVisual numerator={3} denominator={2} isHighlighted={true} delay={1100} />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-300">
            <p className="text-gray-700 text-center font-medium">
              <AnimatedText text={t('reciprocalDefinition')} delay={1500} />
            </p>
          </div>
        </div>
      </div>

      {/* Right - Visual comparison */}
      <div className="relative bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-green-200 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-700 to-teal-700 bg-clip-text text-transparent">
            🔄 {t('understandingReciprocals')}
          </h4>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="space-y-6">
              {/* Multiplication examples */}
              <div className="text-center">
                <h5 className="font-bold text-gray-800 mb-4">{t('observeProducts')}</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-4 border border-green-300">
                    <p className="font-bold text-green-800">7 × (1/7) = 1</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-4 border border-blue-300">
                    <p className="font-bold text-blue-800">(2/3) × (3/2) = 1</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg p-4 border border-purple-300">
                    <p className="font-bold text-purple-800">(5/4) × (4/5) = 1</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg p-4 border border-orange-300">
                    <p className="font-bold text-orange-800">(1/9) × 9 = 1</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-400">
                <p className="text-center font-bold text-gray-800">
                  <AnimatedText text={t('reciprocalExamplesText')} delay={2000} />
                </p>
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
          <span className="text-5xl">📖</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {t('step3Title')}
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-300">
            <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">❓</span>
              {t('whatWillBe')}
            </h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              <AnimatedText text={t('basedOnObservations')} />
            </p>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="text-center space-y-2">
                <p className="text-lg font-bold text-blue-600">3/4 ÷ 3 = 3/4 ÷ 3/1</p>
                <p className="text-lg font-bold text-green-600">= 3/4 × 1/3</p>
                <p className="text-lg font-bold text-purple-600">= 3/12 = 1/4</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Right - Interactive visual */}
      <div className="relative bg-gradient-to-br from-orange-100 via-pink-100 to-red-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-orange-200 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
            📊 {t('fractionDivisionTitle')}
          </h4>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="text-center space-y-6">
              {/* Visual representation of 3/4 ÷ 3 */}
              <div className="space-y-4">
                <h5 className="text-lg font-bold text-gray-800">{t('visualizingDivision')}</h5>
                
                {/* Three circles representing the whole */}
                <div className="flex justify-center space-x-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center">
                      <svg width="60" height="60" className="transform transition-all duration-300 hover:scale-110">
                        <circle
                          cx="30"
                          cy="30"
                          r="25"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                        />
                        {/* 3/4 filled */}
                        <path
                          d="M 30 5 A 25 25 0 1 1 5 30 L 30 30 Z"
                          fill="#60a5fa"
                          fillOpacity="0.8"
                        />
                        <path
                          d="M 30 5 A 25 25 0 0 1 55 30 L 30 30 Z"
                          fill="#60a5fa"
                          fillOpacity="0.8"
                        />
                        <path
                          d="M 30 5 A 25 25 0 0 0 5 30 L 30 30 Z"
                          fill="#60a5fa"
                          fillOpacity="0.8"
                        />
                      </svg>
                      <div className="text-xs font-bold text-gray-700 mt-1">3/4</div>
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-gray-600">
                  <AnimatedText text={t('eachCircleRepresents')} delay={1000} />
                </p>
                
                {/* Result */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300">
                  <p className="text-lg font-bold text-green-700">
                    <AnimatedText text={t('divisionResult3')} delay={2000} />
                  </p>
                </div>
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
          <span className="text-5xl">➗➗</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('step4Title')}
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-300">
            <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">🧮</span>
              {t('canNowFind')}
            </h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              <AnimatedText text={t('usingReciprocalMethod')} />
            </p>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="text-center space-y-2">
                <p className="text-lg font-bold text-blue-600">1/3 ÷ 6/5 = 1/3 × reciprocal of 6/5</p>
                <p className="text-lg font-bold text-green-600">= 1/3 × 5/6</p>
                <p className="text-lg font-bold text-purple-600">= 5/18</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Right - Complete visual */}
      <div className="relative bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-200 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            🧮 {t('fractionByFractionTitle')}
          </h4>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="space-y-6">
              {/* Step-by-step visual */}
              <div className="text-center space-y-4">
                <h5 className="font-bold text-gray-800">{t('stepByStep')}</h5>
                
                <div className="flex items-center justify-center space-x-4">
                  <FractionVisual numerator={1} denominator={3} />
                  <span className="text-2xl">×</span>
                  <FractionVisual numerator={5} denominator={6} isHighlighted={true} delay={500} />
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300">
                  <p className="text-lg font-bold text-green-700">
                    <AnimatedText text="= 5/18" delay={1000} />
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-400">
                <p className="text-center font-bold text-gray-800">
                  <AnimatedText text={t('rememberDivision')} delay={1500} />
                </p>
              </div>
            </div>
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
            ➗ {t('appTitle')} - {currentStep + 1}/{steps.length}
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
          {isPlaying ? t('pauseButton') : t('playButton')}
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
