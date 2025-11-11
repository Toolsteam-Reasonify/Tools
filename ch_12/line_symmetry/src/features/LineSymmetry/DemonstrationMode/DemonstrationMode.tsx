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
  }, [text, delay, words.length]);

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

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsPlaying(false); // Stop at the end
      }
    }, 5000); // 5 seconds per step
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);

  const renderStep1 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8 min-h-[600px]">
      {/* Left - Concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-200 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">⬜</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('step1Title')}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          <AnimatedText text={t('step1Concept')} />
        </p>
        <div className="space-y-4 flex-grow">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">✅</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint1')} delay={200} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔄</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint2')} delay={400} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border-l-4 border-pink-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔷</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint3')} delay={600} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border-l-4 border-indigo-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">⭕</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('keyPoint4')} delay={800} /></p>
          </div>
        </div>
      </div>

      {/* Right - Visual example */}
      <div className="relative bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200 overflow-hidden flex flex-col">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
            {t('step1Title')}
          </h4>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-xl flex-1 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-6 md:gap-10 w-full max-w-4xl">
              {/* Rotational Symmetry Example - Now on Left */}
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                {/* Label - Right aligned */}
                <p className="font-bold text-lg md:text-xl text-gray-800 mb-4 self-end text-right">{t('rotationalSymmetryLabel')}</p>
                
                {/* Visual Example - Five-pointed star, larger */}
                <div className="flex flex-col items-center w-full">
                  <svg width="280" height="360" viewBox="0 0 280 360" className="mx-auto">
                    {/* Five-pointed star - One point facing up, larger */}
                    <path 
                      d="M140 30 L160 90 L220 90 L175 125 L195 185 L140 150 L85 185 L105 125 L60 90 L120 90 Z" 
                      fill="none" 
                      stroke="#1f2937" 
                      strokeWidth="4"
                    />
                    
                    {/* Center point - Red, larger and more visible */}
                    <circle cx="140" cy="110" r="6" fill="#ef4444"/>
                    <circle cx="140" cy="110" r="10" fill="#ef4444" fillOpacity="0.2"/>
                    <circle cx="140" cy="110" r="15" fill="#ef4444" fillOpacity="0.1"/>
                    
                    {/* Rotation indicators - Show angles */}
                    <g opacity="0.6">
                      {/* Top point to center line */}
                      <line x1="140" y1="30" x2="140" y2="110" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2"/>
                      {/* Rotated line (72 degrees for 5-pointed star) */}
                      <g transform="rotate(72 140 110)">
                        <line x1="140" y1="30" x2="140" y2="110" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2"/>
                      </g>
                    </g>
                    
                    {/* Label below - Center */}
                    <text x="140" y="270" textAnchor="middle" className="text-base fill-red-600 font-bold">{t('centerLabel')}</text>
                    
                    {/* Instruction text - Two lines */}
                    <text x="140" y="290" textAnchor="middle" className="text-xs fill-gray-600 font-medium">{t('rotateAroundCenter')}</text>
                    <text x="140" y="305" textAnchor="middle" className="text-xs fill-gray-600 font-medium">{t('looksTheSame')}</text>
                    
                    {/* Rotation angle indicator */}
                    <text x="140" y="320" textAnchor="middle" className="text-xs fill-blue-600 font-medium">{t('rotationStarNote')}</text>
                  </svg>
                </div>
              </div>
              
              {/* Line Symmetry Example - Now on Right */}
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                {/* Label */}
                <p className="font-bold text-lg md:text-xl text-gray-800 mb-4">{t('lineSymmetryLabel')}</p>
                
                {/* Visual Example - Larger and clearer */}
                <div className="flex flex-col items-center w-full">
                  <svg width="220" height="340" viewBox="0 0 220 340" className="mx-auto">
                    {/* Vertical Rectangle - Black outline */}
                    <rect x="70" y="50" width="80" height="220" fill="none" stroke="#1f2937" strokeWidth="4"/>
                    
                    {/* Line of Symmetry - Blue dashed, thicker */}
                    <line x1="110" y1="50" x2="110" y2="270" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10,6"/>
                    
                    {/* Visual indication - Show mirror effect */}
                    <g opacity="0.3">
                      {/* Left half (lighter) */}
                      <rect x="70" y="50" width="40" height="220" fill="#e5e7eb" stroke="none"/>
                      {/* Right half reflection indicator */}
                      <rect x="110" y="50" width="40" height="220" fill="#dbeafe" stroke="none"/>
                    </g>
                    
                    {/* Reflection arrows */}
                    <path d="M95 130 L85 130 M85 130 L88 127 M85 130 L88 133" stroke="#3b82f6" strokeWidth="2" fill="none"/>
                    <path d="M125 130 L135 130 M135 130 L132 127 M135 130 L132 133" stroke="#3b82f6" strokeWidth="2" fill="none"/>
                    
                    {/* Instruction text - Two lines */}
                    <text x="110" y="305" textAnchor="middle" className="text-xs fill-gray-600 font-medium">{t('foldAlongLine')}</text>
                    <text x="110" y="320" textAnchor="middle" className="text-xs fill-gray-600 font-medium">{t('bothHalvesMatch')}</text>
                  </svg>
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
      {/* Left - Square concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-green-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">⬜</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            {t('step2Title')}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          <AnimatedText text={t('step2Concept')} />
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">4️⃣</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('squareKey1')} delay={200} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl border-l-4 border-teal-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">↔️</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('squareKey2')} delay={400} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl border-l-4 border-cyan-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">✳️</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('squareKey3')} delay={600} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-sky-50 to-sky-100 rounded-xl border-l-4 border-sky-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔄</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('squareKey4')} delay={800} /></p>
          </div>
        </div>
      </div>

      {/* Right - Square visualization */}
      <div className="relative bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-green-200 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-700 to-teal-700 bg-clip-text text-transparent">
            {t('squareDiagram')}
          </h4>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl flex items-center justify-center">
            <svg width="280" height="280" viewBox="0 0 280 280" className="mx-auto">
              {/* Square */}
              <rect x="90" y="90" width="100" height="100" fill="black"/>
              {/* Lines of symmetry */}
              {/* Horizontal lines */}
              <line x1="0" y1="140" x2="280" y2="140" stroke="blue" strokeWidth="2" strokeDasharray="5,5"/>
              {/* Vertical line */}
              <line x1="140" y1="0" x2="140" y2="280" stroke="blue" strokeWidth="2" strokeDasharray="5,5"/>
              {/* Diagonal lines */}
              <line x1="0" y1="0" x2="280" y2="280" stroke="blue" strokeWidth="2" strokeDasharray="5,5"/>
              <line x1="280" y1="0" x2="0" y2="280" stroke="blue" strokeWidth="2" strokeDasharray="5,5"/>
              {/* Center point */}
              <circle cx="140" cy="140" r="4" fill="red"/>
            </svg>
          </div>
          <p className="text-center mt-4 text-gray-700 font-semibold">{t('squareSymmetryLines')}</p>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Circle concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-orange-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">⭕</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {t('step3Title')}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          <AnimatedText text={t('step3Concept')} />
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-l-4 border-orange-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">📏</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('circleKey1')} delay={200} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border-l-4 border-red-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔄</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('circleKey2')} delay={400} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border-l-4 border-amber-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🎯</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('circleKey3')} delay={600} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-l-4 border-yellow-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">∞</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('circleKey4')} delay={800} /></p>
          </div>
        </div>
      </div>

      {/* Right - Circle visualization */}
      <div className="relative bg-gradient-to-br from-orange-100 via-pink-100 to-red-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-orange-200 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
            {t('circleDiagram')}
          </h4>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl flex items-center justify-center">
            <svg width="280" height="280" viewBox="0 0 280 280" className="mx-auto">
              {/* Circle */}
              <circle cx="140" cy="140" r="100" fill="none" stroke="black" strokeWidth="3"/>
              {/* Sample diameters showing lines of symmetry */}
              <line x1="140" y1="40" x2="140" y2="240" stroke="blue" strokeWidth="2" strokeDasharray="5,5"/>
              <line x1="40" y1="140" x2="240" y2="140" stroke="blue" strokeWidth="2" strokeDasharray="5,5"/>
              <line x1="65" y1="65" x2="215" y2="215" stroke="blue" strokeWidth="2" strokeDasharray="5,5"/>
              <line x1="215" y1="65" x2="65" y2="215" stroke="blue" strokeWidth="2" strokeDasharray="5,5"/>
              {/* Center point */}
              <circle cx="140" cy="140" r="4" fill="red"/>
            </svg>
          </div>
          <p className="text-center mt-4 text-gray-700 font-semibold">{t('circleSymmetryLines')}</p>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Alphabet concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">🔤</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('step4Title')}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          <AnimatedText text={t('step4Concept')} />
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border-l-4 border-indigo-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">📏</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('alphabetKey1')} delay={200} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔄</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('alphabetKey2')} delay={400} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-violet-50 to-violet-100 rounded-xl border-l-4 border-violet-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔷</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('alphabetKey3')} delay={600} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-fuchsia-50 to-fuchsia-100 rounded-xl border-l-4 border-fuchsia-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔢</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('alphabetKey4')} delay={800} /></p>
          </div>
        </div>
      </div>

      {/* Right - Alphabet examples */}
      <div className="relative bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-200 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            {t('alphabetTable')}
          </h4>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="grid grid-cols-4 gap-4 text-center">
              {/* Examples */}
              <div className="p-4 border-2 border-blue-300 rounded-xl">
                <div className="text-4xl mb-2 font-bold">E</div>
                <div className="text-xs text-gray-600">{t('alphabetDesc1Line')}</div>
              </div>
              <div className="p-4 border-2 border-green-300 rounded-xl">
                <div className="text-4xl mb-2 font-bold">H</div>
                <div className="text-xs text-gray-600">{t('alphabetDesc2Lines')}</div>
              </div>
              <div className="p-4 border-2 border-purple-300 rounded-xl">
                <div className="text-4xl mb-2 font-bold">O</div>
                <div className="text-xs text-gray-600">{t('alphabetDescInfiniteLines')}</div>
              </div>
              <div className="p-4 border-2 border-red-300 rounded-xl">
                <div className="text-4xl mb-2 font-bold">S</div>
                <div className="text-xs text-gray-600">{t('alphabetDescRotational')}</div>
              </div>
              <div className="p-4 border-2 border-yellow-300 rounded-xl">
                <div className="text-4xl mb-2 font-bold">Z</div>
                <div className="text-xs text-gray-600">{t('alphabetDescRotational')}</div>
              </div>
              <div className="p-4 border-2 border-indigo-300 rounded-xl">
                <div className="text-4xl mb-2 font-bold">N</div>
                <div className="text-xs text-gray-600">{t('alphabetDescRotational')}</div>
              </div>
              <div className="p-4 border-2 border-pink-300 rounded-xl">
                <div className="text-4xl mb-2 font-bold">I</div>
                <div className="text-xs text-gray-600">{t('alphabetDesc2LinesRot')}</div>
              </div>
              <div className="p-4 border-2 border-teal-300 rounded-xl">
                <div className="text-4xl mb-2 font-bold">X</div>
                <div className="text-xs text-gray-600">{t('alphabetDesc2LinesRot')}</div>
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
            ⬜ {t('appTitle')} - {currentStep + 1}/{steps.length}
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
