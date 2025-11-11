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

  // Sample data for step 3 - Color preference
  const colorData = [
    { label: 'Red', value: 43, color: 'bg-red-500' },
    { label: 'Green', value: 19, color: 'bg-green-500' },
    { label: 'Blue', value: 55, color: 'bg-blue-500' },
    { label: 'Yellow', value: 49, color: 'bg-yellow-500' },
    { label: 'Orange', value: 34, color: 'bg-orange-500' },
  ];

  // Sample data for step 4 - Double bar graph (sunshine hours)
  const sunshineData = [
    { month: t('january'), margate: 2, aberdeen: 1.5 },
    { month: t('february'), margate: 3, aberdeen: 1.5 },
    { month: t('march'), margate: 4, aberdeen: 3.5 },
    { month: t('april'), margate: 6, aberdeen: 5 },
    { month: t('may'), margate: 7.5, aberdeen: 5.5 },
    { month: t('june'), margate: 8, aberdeen: 6.5 },
  ];

  const renderStep1 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">📊</span>
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
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
            {t('sampleBarGraph')}
          </h4>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="flex items-center">
              {/* Y-axis labels - outside left */}
              <div className="flex flex-col justify-between h-80 text-sm font-bold text-gray-700 pr-4">
                <span>55</span>
                <span>44</span>
                <span>33</span>
                <span>22</span>
                <span>11</span>
                <span>0</span>
              </div>
              
            <div className="flex-1 flex items-end justify-around h-80 border-b-4 border-l-4 border-gray-800 pb-2 pl-4">
              {/* Bars */}
              {[20, 35, 10, 30, 48].map((height, i) => {
                const colors = [
                  'from-red-500 to-red-600',
                  'from-orange-500 to-orange-600', 
                  'from-yellow-400 to-yellow-500',
                  'from-green-500 to-green-600',
                  'from-blue-600 to-blue-700'
                ];
                const colorLabels = [t('red'), t('orange'), t('yellow'), t('green'), t('blue')];
                const heightInPx = (height / 55) * 300; // 300px is max height for scale of 55
                return (
                  <div key={i} className="flex flex-col items-center group">
                    <div className="relative">
                      <div
                        className={`w-16 md:w-18 bg-gradient-to-t ${colors[i]} rounded-t-lg shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl bar-grow`}
                        style={{ '--bar-height': `${heightInPx}px` } as React.CSSProperties}
                      >
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-20">
                          {height}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>

            {/* Color text below the horizontal line */}
            <div className="flex justify-around px-4 mt-2" style={{ transform: 'translateX(25px)' }}>
              {[t('red'), t('orange'), t('yellow'), t('green'), t('blue')].map((color, i) => (
                <span key={i} className="text-sm font-bold text-gray-700 text-right">
                  {color}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Scale concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-green-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">📏</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            {t('step2Title')}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          <AnimatedText text={t('step2Concept')} />
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">0️⃣</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('scaleKey1')} delay={200} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl border-l-4 border-teal-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">📐</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('scaleKey2')} delay={400} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl border-l-4 border-cyan-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🔝</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('scaleKey3')} delay={600} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-sky-50 to-sky-100 rounded-xl border-l-4 border-sky-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">👁️</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('scaleKey4')} delay={800} /></p>
          </div>
        </div>
      </div>

      {/* Right - Scale comparison */}
      <div className="relative bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-green-200 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-700 to-teal-700 bg-clip-text text-transparent">
            {t('choosingRightScale')}
          </h4>
          
          <div className="space-y-6">
            {/* Good scale example */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-4 border-green-500 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl animate-pulse">✅</span>
                <p className='font-bold text-green-700 text-lg'>{t('goodScale')}</p>
              </div>
              <div className="relative">
                <div className="flex items-center">
                  {/* Y-axis label */}
                  <div className="mr-1">
                    <span className="text-xs font-bold text-gray-700 writing-mode-vertical transform -rotate-90 inline-block" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                      {t('divisions')}
                    </span>
                  </div>
                  
                  {/* Y-axis labels - outside left */}
                  <div className="flex flex-col justify-between h-40 text-xs font-bold text-gray-700 pr-3">
                    <span>50</span>
                    <span>40</span>
                    <span>30</span>
                    <span>20</span>
                    <span>10</span>
                    <span>0</span>
                  </div>
                  
                  <div className="flex-1 flex items-end justify-around h-40 border-b-4 border-l-4 border-gray-800 pb-2 pl-4">
                    {[40, 30, 50, 20].map((val, i) => {
                      const barHeight = (val / 50) * 140;
                      return (
                        <div key={i} className="flex flex-col items-center group cursor-pointer">
                          <div
                            className="w-14 bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl relative bar-grow"
                            style={{ '--bar-height': `${barHeight}px` } as React.CSSProperties}
                          >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-700 text-white px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {val}
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-xs text-green-700 font-semibold">{t('equalDivisions')}</p>
                </div>
              </div>
            </div>

            {/* Bad scale example */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-4 border-red-500 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl animate-pulse">❌</span>
                <p className='font-bold text-red-700 text-lg'>{t('badScale')}</p>
              </div>
              <div className="relative">
                <div className="flex items-center">
                  {/* Y-axis label */}
                  <div className="mr-1">
                    <span className="text-xs font-bold text-red-600 writing-mode-vertical transform -rotate-90 inline-block" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                      {t('divisions')}
                    </span>
                  </div>
                  
                  {/* Y-axis labels - irregular, outside left */}
                  <div className="flex flex-col justify-between h-40 text-xs font-bold text-red-600 pr-3">
                    <span>60</span>
                    <span>45</span>
                    <span>25</span>
                    <span>15</span>
                    <span>5</span>
                    <span>0</span>
                  </div>
                  
                  <div className="flex-1 flex items-end justify-around h-40 border-b-4 border-l-4 border-gray-800 pb-2 pl-4">
                    {[40, 30, 50, 20].map((val, i) => {
                      const barHeight = val * 1.2;
                      return (
                        <div key={i} className="flex flex-col items-center group cursor-pointer">
                          <div
                            className="w-14 bg-gradient-to-t from-red-500 to-red-600 rounded-t-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl relative bar-grow"
                            style={{ '--bar-height': `${barHeight}px` } as React.CSSProperties}
                          >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-700 text-white px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {val}
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-xs text-red-700 font-semibold">{t('unequalDivisions')}</p>
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
      {/* Left - Question */}
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
              <span className="text-2xl">📋</span>
              {t('surveyData')}
            </h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              <AnimatedText text={t('surveyDescription')} />
            </p>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <table className="w-full text-center">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="py-2 px-2 text-sm font-bold">{t('color')}</th>
                    {colorData.map((item, i) => (
                      <th key={i} className="py-2 px-2">
                        <div className={`w-8 h-8 ${item.color} rounded-lg mx-auto shadow-md`}></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-2 font-bold text-sm">{t('students')}</td>
                    {colorData.map((item, i) => (
                      <td key={i} className="py-3 px-2 font-bold text-gray-700">{item.value}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-300">
            <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">❓</span>
              {t('step3Question')}
            </h4>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <p className="text-gray-700 font-medium">
                <span className="text-green-600">✓</span> <AnimatedText text={t('step3Answer')} delay={300} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Interactive bar graph */}
      <div className="relative bg-gradient-to-br from-orange-100 via-pink-100 to-red-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-orange-200 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
            {t('favoriteColorSurvey')}
          </h4>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="text-sm font-bold text-gray-600 mb-2">{t('scaleUnit10')}</div>
            <div className="flex items-center">
              {/* Y-axis label */}
              <div className="mr-1">
                <span className="text-xs font-bold text-gray-700" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                  {t('divisions')}
                </span>
              </div>
              
              {/* Y-axis labels - outside left */}
              <div className="flex flex-col justify-between h-80 text-sm font-bold text-gray-700 pr-4">
                <span>55</span>
                <span>44</span>
                <span>33</span>
                <span>22</span>
                <span>11</span>
                <span>0</span>
              </div>
              
              <div className="flex-1 flex items-end justify-around h-80 border-b-4 border-l-4 border-gray-800 pb-2 pl-4">
                {/* Bars */}
                {colorData.map((item, i) => {
                const heightInPx = (item.value / 55) * 300; // 300px max height for scale of 55
                return (
                  <div key={i} className="flex flex-col items-center group cursor-pointer">
                    <div className="relative">
                      <div
                        className={`w-16 md:w-18 ${item.color} rounded-t-lg shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl bar-grow ${item.value === 55 ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}
                        style={{ '--bar-height': `${heightInPx}px` } as React.CSSProperties}
                      >
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-20">
                          {item.value} {t('studentsText')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
            
            {/* Color text below the horizontal line */}
            <div className="flex justify-around px-4 mt-2">
              {colorData.map((item, i) => (
                <span key={i} className="text-sm font-bold text-gray-700 w-16 md:w-18 text-right">
                  {item.label}
                </span>
              ))}
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
          <span className="text-5xl">📊📊</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('step4Title')}
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-300">
            <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
              <span className="text-2xl">☀️</span>
              {t('sunshineData')}
            </h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              <AnimatedText text={t('sunshineDescription')} />
            </p>
            <div className="flex gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded"></div>
                <span className="font-medium text-gray-700">{t('margate')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-600 rounded"></div>
                <span className="font-medium text-gray-700">{t('aberdeen')}</span>
              </div>
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

      {/* Right - Double bar graph */}
      <div className="relative bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-200 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            {t('doubleBarGraph')}
          </h4>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="text-sm font-bold text-gray-600 mb-2">{t('scaleUnit1')}</div>
            <div className="flex items-center">
              {/* Y-axis label */}
              <div className="mr-1">
                <span className="text-xs font-bold text-gray-700" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                  {t('hours')}
                </span>
              </div>
              
              {/* Y-axis labels */}
              <div className="flex flex-col justify-between h-72 text-xs font-bold text-gray-700 pr-3">
                <span>8</span>
                <span>6</span>
                <span>4</span>
                <span>2</span>
                <span>0</span>
              </div>
              
              <div className="flex-1 flex items-end justify-around h-72 border-b-4 border-l-4 border-gray-800 pb-2 pl-4">
                {/* Double bars */}
                {sunshineData.map((item, i) => {
                  const margateHeight = (item.margate / 8) * 260; // 260px max height
                  const aberdeenHeight = (item.aberdeen / 8) * 260;
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="flex gap-1 items-end">
                        {/* Margate bar */}
                        <div className="group cursor-pointer relative">
                          <div
                            className="w-8 bg-gradient-to-t from-cyan-400 to-cyan-600 rounded-t-lg shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl bar-grow"
                            style={{ '--bar-height': `${margateHeight}px` } as React.CSSProperties}
                          >
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-cyan-700 text-white px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                              {item.margate}h
                            </div>
                          </div>
                        </div>
                        {/* Aberdeen bar */}
                        <div className="group cursor-pointer relative">
                          <div
                            className="w-8 bg-gradient-to-t from-gray-400 to-gray-600 rounded-t-lg shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl bar-grow"
                            style={{ '--bar-height': `${aberdeenHeight}px`, animationDelay: '0.1s' } as React.CSSProperties}
                          >
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                              {item.aberdeen}h
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Months text below the horizontal line */}
            <div className="flex justify-around px-4 mt-2" style={{ transform: 'translateX(25px)' }}>
              {sunshineData.map((item, i) => (
                <span key={i} className="text-sm font-bold text-gray-700 text-right">
                  {item.month}
                </span>
              ))}
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
            📊 {t('appTitle')} - {currentStep + 1}/{steps.length}
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

