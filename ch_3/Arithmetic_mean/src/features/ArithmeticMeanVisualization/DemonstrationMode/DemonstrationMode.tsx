import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedText from '../../../components/AnimatedText';

// Using shared AnimatedText component

export default function DemonstrationMode() {
  const { t, formatNumber } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    { id: 0, title: t('understandingArithmeticMean'), desc: t('arithmeticMeanDescription') },
    { id: 1, title: t('meanCalculationStepByStep'), desc: t('stepByStepDescription') },
    { id: 2, title: t('findingTheRange'), desc: t('rangeDescription') },
    { id: 3, title: t('comparingHeights'), desc: t('heightsDescription') },
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

  // Step 1 data was unused in current UI; removing to avoid linter warning

  // Sample data for step 2 - Batsman runs
  const batsmanData = [
    { runs: 36, color: 'bg-red-500' },
    { runs: 35, color: 'bg-orange-500' },
    { runs: 50, color: 'bg-yellow-500' },
    { runs: 46, color: 'bg-green-500' },
    { runs: 60, color: 'bg-blue-500' },
    { runs: 55, color: 'bg-purple-500' },
  ];

  const getInningsLabel = (index: number) => {
    switch (index) {
      case 0: return t('firstInnings');
      case 1: return t('secondInnings');
      case 2: return t('thirdInnings');
      case 3: return t('fourthInnings');
      case 4: return t('fifthInnings');
      case 5: return t('sixthInnings');
      default: return `${index + 1}`;
    }
  };

  const batsmanRunsList = batsmanData.map(d => d.runs);
  const batsmanSum = batsmanRunsList.reduce((a, b) => a + b, 0);
  const batsmanMean = batsmanSum / batsmanRunsList.length;

  // Sample data for step 3 - Teacher ages
  const ageData = [
    { teacherKey: 'teacher1', age: 23, color: 'bg-blue-500' },
    { teacherKey: 'teacher2', age: 26, color: 'bg-green-500' },
    { teacherKey: 'teacher3', age: 28, color: 'bg-yellow-500' },
    { teacherKey: 'teacher4', age: 32, color: 'bg-orange-500' },
    { teacherKey: 'teacher5', age: 33, color: 'bg-red-500' },
    { teacherKey: 'teacher6', age: 35, color: 'bg-purple-500' },
    { teacherKey: 'teacher7', age: 38, color: 'bg-pink-500' },
    { teacherKey: 'teacher8', age: 40, color: 'bg-indigo-500' },
    { teacherKey: 'teacher9', age: 41, color: 'bg-teal-500' },
    { teacherKey: 'teacher10', age: 54, color: 'bg-gray-500' },
  ];

  const ages = ageData.map(a => a.age);
  const minAge = Math.min(...ages);
  const maxAge = Math.max(...ages);
  const ageRange = maxAge - minAge;

  // Sample data for step 4 - Student heights
  const heightData = [
    { studentKey: 'girl1', height: 135, color: 'bg-blue-500' },
    { studentKey: 'girl2', height: 150, color: 'bg-green-500' },
    { studentKey: 'girl3', height: 139, color: 'bg-yellow-500' },
    { studentKey: 'girl4', height: 128, color: 'bg-orange-500' },
    { studentKey: 'girl5', height: 151, color: 'bg-red-500' },
    { studentKey: 'girl6', height: 132, color: 'bg-purple-500' },
    { studentKey: 'girl7', height: 146, color: 'bg-pink-500' },
    { studentKey: 'girl8', height: 149, color: 'bg-indigo-500' },
    { studentKey: 'girl9', height: 143, color: 'bg-teal-500' },
    { studentKey: 'girl10', height: 141, color: 'bg-gray-500' },
  ];

  const heights = heightData.map(h => h.height);
  const heightSum = heights.reduce((a, b) => a + b, 0);
  const heightMean = heightSum / heights.length;

  const renderStep1 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-6 min-h-[4rem]">
          <span className="text-5xl">📊</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight py-2">
            {t('step1Title')}
          </h3>
        </div>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          <AnimatedText text={t('step1Concept')} />
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">✅</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('centralTendencyPoint')} delay={200} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">📈</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('dataAnalysisPoint')} delay={400} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border-l-4 border-pink-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🎯</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('realWorldApplicationsPoint')} delay={600} /></p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500 transform hover:scale-105 transition-all duration-300">
            <span className="text-2xl">🌍</span>
            <p className="text-gray-800 font-medium"><AnimatedText text={t('universalConceptPoint')} delay={800} /></p>
          </div>
        </div>
      </div>

      {/* Right - Interactive Formula Display */}
      <div className="relative bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <h4 className="text-xl md:text-2xl font-bold text-left mb-8 bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
            {t('meanFormula')}
          </h4>
          
          <div className="space-y-6">
            {/* Formula 1 - Simple Mean Formula */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-purple-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-left">
                <div className="flex items-center text-4xl font-bold text-gray-800">
                  <span className="text-blue-600">{t('mean')}</span>
                  <span className="mx-4 text-purple-600">=</span>
                  <div className="flex flex-col items-start">
                    <div className="text-2xl text-gray-800 font-semibold">{t('sumOfAllDataPoints')}
                    </div>
                    <div className="w-full h-0.5 bg-gray-400 my-2"></div>
                    <div className="text-2xl text-gray-800 font-semibold">{t('numberOfDataPoints')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formula 2 - Arithmetic Mean Formula */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-blue-300 transform hover:scale-105 transition-all duration-300">
              <div className="text-left">
                <div className="flex items-center text-3xl font-bold text-gray-800">
                  <span className="text-blue-600">{t('arithmeticMean')}</span>
                  <span className="mx-4 text-purple-600">=</span>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center">
                      <span className="text-lg">(</span>
                      <span className="mx-1 text-2xl text-red-600">x</span>
                      <span className="text-sm text-red-500">₁</span>
                      <span className="mx-2 text-gray-600">+</span>
                      <span className="mx-1 text-2xl text-red-600">x</span>
                      <span className="text-sm text-red-500">₂</span>
                      <span className="mx-2 text-gray-600">+</span>
                      <span className="text-lg text-gray-500">...</span>
                      <span className="mx-2 text-gray-600">+</span>
                      <span className="mx-1 text-2xl text-red-600">x</span>
                      <span className="text-sm text-red-500">ₙ</span>
                      <span className="text-lg">)</span>
                    </div>
                    <div className="w-full h-0.5 bg-gray-400 my-2"></div>
                    <div className="text-2xl text-gray-800 font-semibold">n</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Observation text */}
            <div className="flex">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200">
                <p className="text-gray-600 italic text-left">
                  {t('nIsNumObservations')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Data Visualization */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-orange-200">
        <div className="text-left mb-6">
          <h4 className="text-xl font-bold text-gray-800 mb-2">{t('Batsman Runs')}</h4>
          <p className="text-gray-600">{t('Runs')}</p>
        </div>

        <div className="space-y-3">
          {batsmanData.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
              <div className="flex-1">
                  <div className="font-medium text-gray-800">{getInningsLabel(index)}</div>
              </div>
              <div className="text-lg font-bold text-gray-700">{formatNumber(item.runs)}</div>
            </div>
          ))}
        </div>
              
       
      </div>

      {/* Right - Step by Step */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-green-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">🧮</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {t('Steps')}
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500">
            <h4 className="font-bold text-gray-800 mb-2">{t('Step')} 1 : {t('Add All Numbers')}</h4>
            <p className="text-gray-700">
              {batsmanRunsList.map((r, i) => `${formatNumber(r)}${i < batsmanRunsList.length - 1 ? ' + ' : ''}`).join('')} = {formatNumber(batsmanSum)}
            </p>
          </div>
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500">
            <h4 className="font-bold text-gray-800 mb-2">{t('Step')} 2 : {t('Count The Innings')}</h4>
            <p className="text-gray-700">{formatNumber(batsmanRunsList.length)} {t('Innings')}</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500">
            <h4 className="font-bold text-gray-800 mb-2">{t('Step')} 3 : {t('Divide Sum By Count')}</h4>
            <p className="text-gray-700">{formatNumber(batsmanSum)} ÷ {formatNumber(batsmanRunsList.length)} = {formatNumber(Math.round(batsmanMean))} {t('Runs')}</p>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {t('mean')} = {formatNumber(Math.round(batsmanMean))} {t('Runs')}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Range Concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-red-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">📏</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            {t('rangeLabel')}
          </h3>
        </div>
        
        {/* Range Definition */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500">
          <p className="text-gray-700 text-lg font-medium">
            <AnimatedText text={t('rangeDefinition')} />
          </p>
        </div>

        {/* How to find Range */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-gray-800 mb-4">
            <AnimatedText text={t('howToFindRange')} delay={200} />
          </h4>
          
          <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border-l-4 border-red-500">
            <h5 className="font-bold text-gray-800 mb-2">
              <AnimatedText text={t('rangeStep1Order')} delay={400} />
            </h5>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-l-4 border-orange-500">
            <h5 className="font-bold text-gray-800 mb-2">
              <AnimatedText text={t('rangeStep2Subtract')} delay={600} />
            </h5>
          </div>
        </div>
      </div>

      {/* Right - Age Data */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-yellow-200">
        <div className="text-left mb-6">
          <h4 className="text-xl font-bold text-gray-800 mb-2">{t('Teachers Ages')}</h4>
          <p className="text-gray-600">{t('years')}</p>
                  </div>
        
        <div className="grid grid-cols-2 gap-3">
          {ageData.map((item, index) => (
            <div key={index} className={`p-3 rounded-xl border-2 ${item.age === 23 ? 'bg-red-100 border-red-300' : item.age === 54 ? 'bg-green-100 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
              <div className="text-center">
                <div className="font-medium text-gray-800 text-sm">{t(item.teacherKey)}</div>
                <div className={`text-lg font-bold ${item.age === 23 ? 'text-red-600' : item.age === 54 ? 'text-green-600' : 'text-gray-700'}`}>
                  {formatNumber(item.age)}
                </div>
              </div>
            </div>
          ))}
            </div>
            
        <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-green-50 rounded-xl border-2 border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600 mb-1">
              {t('rangeLabel')} = {formatNumber(ageRange)} {t('years')}
            </div>
            <div className="text-sm text-gray-600">
              {formatNumber(maxAge)} - {formatNumber(minAge)} = {formatNumber(ageRange)}
            </div>
              </div>
            </div>
          </div>
        </div>
      );

  const renderStep4 = () => (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* Left - Height Data */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-pink-200">
        <div className="text-left mb-6">
          <h4 className="text-xl font-bold text-gray-800 mb-2">{t('Girls Heights')}</h4>    
          <p className="text-gray-600">{t('cm')}</p>
        </div>
        
        <div className="space-y-2">
          {heightData.map((item, index) => (
            <div key={index} className={`p-3 rounded-xl border-2 ${item.height > 141.4 ? 'bg-green-50 border-green-200' : item.height < 141.4 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-800">{t(item.studentKey)}</div>
                <div className={`text-lg font-bold ${item.height > 141.4 ? 'text-green-600' : item.height < 141.4 ? 'text-red-600' : 'text-blue-600'}`}>
                  {formatNumber(item.height)} {t('cm')}
                </div>
              </div>
            </div>
          ))}
            </div>
            
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {t('mean')} = {formatNumber(Number(heightMean.toFixed(1)))} {t('cm')}
            </div>
            <div className="text-sm text-gray-600">
              {formatNumber(heightSum)} ÷ {formatNumber(heights.length)} = {formatNumber(Number(heightMean.toFixed(1)))}
            </div>
          </div>
            </div>
          </div>
              
      {/* Right - Comparison Concept */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-5xl">👥</span>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('Steps')}
          </h3>
        </div>
        
        
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500">
            <h4 className="font-bold text-gray-800 mb-2">{t('Step')} 1 : {t('Basic Mean')}</h4>
            <p className="text-gray-700">Mean height = 141.4 {t('cm')}</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border-l-4 border-pink-500">
            <h4 className="font-bold text-gray-800 mb-2">{t('Step')} 2 : {t('Comparison')}</h4>
            <p className="text-gray-700">{t('aboveMean')}: Students B, D, E, G, H, I, J</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500">
            <h4 className="font-bold text-gray-800 mb-2">{t('Step')} 3 : {t('Below Mean')}</h4>
            <p className="text-gray-700">Students A, C, F</p>
          </div>
        </div>
              </div>
        </div>
      );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderStep1();
      case 1: return renderStep2();
      case 2: return renderStep3();
      case 3: return renderStep4();
      default: return renderStep1();
    }
  };

      return (
    <div className="space-y-6">
      {/* Progress header (matches Bargraph_usage) */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            📚 {t('arithmeticMean')} - {currentStep + 1}/{steps.length}
          </h2>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content container */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        {renderCurrentStep()}
      </div>

      {/* Navigation buttons (matches Bargraph_usage) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 bg-white rounded-xl shadow-lg border">
        <button
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text_base transition-all duration-300 ${
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