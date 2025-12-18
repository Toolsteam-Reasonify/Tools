import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

type DemoStep = {
  id: number;
  title: string;
  description: string;
  multiplicand: number;
  multiplier: number;
  result: number;
  concept: 'arrays' | 'repeated_addition' | 'commutative' | 'zeros_ones' | 'positive_negative' | 'negative_negative' | 'associative' | 'distributive';
  visualType: 'grid' | 'groups' | 'number_line' | 'property';
};

export default function DemonstrationMode() {
  const { t, formatNumber, localizeDigitsInText, isTransitioning } = useLanguage();
  
  const demoSteps: DemoStep[] = [
    {
      id: 1,
      title: t('step1Title'),
      description: t('step1Desc'),
      multiplicand: 3,
      multiplier: 4,
      result: 12,
      concept: 'arrays',
      visualType: 'grid'
    },
    {
      id: 2,
      title: t('step2Title'),
      description: t('step2Desc'),
      multiplicand: 4,
      multiplier: 3,
      result: 12,
      concept: 'repeated_addition',
      visualType: 'groups'
    },
    {
      id: 3,
      title: t('step3Title'),
      description: t('step3Desc'),
      multiplicand: 3,
      multiplier: -4,
      result: -12,
      concept: 'positive_negative',
      visualType: 'property'
    },
    {
      id: 4,
      title: t('step4Title'),
      description: t('step4Desc'),
      multiplicand: -3,
      multiplier: -4,
      result: 12,
      concept: 'negative_negative',
      visualType: 'property'
    },
    {
      id: 5,
      title: t('step5Title'),
      description: t('step5Desc'),
      multiplicand: 3,
      multiplier: 4,
      result: 12,
      concept: 'commutative',
      visualType: 'property'
    },
    {
      id: 6,
      title: t('step6Title'),
      description: t('step6Desc'),
      multiplicand: 5,
      multiplier: 1,
      result: 5,
      concept: 'zeros_ones',
      visualType: 'property'
    },
    {
      id: 7,
      title: t('step7Title'),
      description: t('step7Desc'),
      multiplicand: 2,
      multiplier: 3,
      result: 6,
      concept: 'associative',
      visualType: 'property'
    },
    {
      id: 8,
      title: t('step8Title'),
      description: t('step8Desc'),
      multiplicand: 3,
      multiplier: 6,
      result: 18,
      concept: 'distributive',
      visualType: 'property'
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Error handling for empty or invalid data
  if (!demoSteps || demoSteps.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 bg-error-50 rounded-xl border border-error-200 max-w-md mx-auto animate-slide-up">
          <div className="text-6xl mb-4 animate-bounce">🚨</div>
          <h3 className="text-xl font-bold text-error-700 mb-2">Error Loading Demo</h3>
          <p className="text-error-600 mb-4">We're having trouble loading the demonstration steps.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-error-500 text-white rounded-lg hover:bg-error-600 transition-all duration-300 transform hover:scale-105"
          >
            🔄 Reload Page
          </button>
        </div>
      </div>
    );
  }

  const currentStepData = demoSteps[currentStep];

  if (!currentStepData) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 bg-warning-50 rounded-xl border border-warning-200 max-w-md mx-auto animate-pulse">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-bold text-warning-700 mb-2">Loading...</h3>
          <p className="text-warning-600">Preparing demonstration step...</p>
        </div>
      </div>
    );
  }

  // Auto progression when playing
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (animationPhase < 3) {
        setAnimationPhase(prev => prev + 1);
      } else {
        if (currentStep < demoSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
          setAnimationPhase(0);
        } else {
          setIsPlaying(false);
          setAnimationPhase(0);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isPlaying, animationPhase, currentStep, demoSteps.length]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setAnimationPhase(0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setAnimationPhase(0);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnimationPhase(0);
    setIsPlaying(false);
  };

  return (
    <div className={`space-y-3 sm:space-y-4 md:space-y-6 transition-all duration-500 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Header with Progress */}
      <div className="bg-gradient-to-r from-brand-50 to-accent-50 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border-2 border-brand-200/60 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-700">
            📚 <span className="hidden xs:inline">{t('demo')} - </span>{localizeDigitsInText(`Step ${currentStep + 1} of ${demoSteps.length}`)}
          </h2>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <span className="px-2 sm:px-3 py-1 bg-brand-100 text-brand-700 rounded-full font-medium text-xs">
              {currentStepData.concept.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-brand-400 to-accent-400 rounded-full transition-all duration-700"
            style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Explanation Panel */}
        <div className="space-y-3 sm:space-y-4">
          <div className="number-card">
            <h3 className="text-lg sm:text-xl font-bold text-brand-700 mb-2 sm:mb-3">
              {currentStepData.title}
            </h3>
            <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg leading-relaxed">
              {currentStepData.description}
            </p>
            
            {/* Enhanced Mathematical Expression with Animation */}
            <div className="bg-gradient-to-r from-brand-50 to-accent-50 rounded-lg p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 animate-concept-focus">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 space-x-2">
                  <span className={`inline-block transition-all duration-500 ${
                    currentStepData.multiplicand < 0 ? 'text-error-600 animate-integer-negative' : 'text-success-600 animate-integer-positive'
                  }`}>
                    {formatNumber(currentStepData.multiplicand)}
                  </span>
                  
                  <span className="text-accent-600 animate-bounce-gentle mx-2 sm:mx-3">×</span>
                  
                  <span className={`inline-block transition-all duration-500 ${
                    currentStepData.multiplier < 0 ? 'text-error-600 animate-integer-negative' : 'text-success-600 animate-integer-positive'
                  }`}>
                    {formatNumber(currentStepData.multiplier)}
                  </span>
                  
                  <span className="text-accent-600 animate-bounce-gentle mx-3">=</span>
                  
                  <span className={`inline-block transition-all duration-500 ${
                    currentStepData.result < 0 ? 'text-error-600 animate-sign-change' : 'text-success-600 animate-success-pulse'
                  }`}>
                    {formatNumber(currentStepData.result)}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  {formatNumber(currentStepData.multiplicand)} {t('groupsOf')} {formatNumber(currentStepData.multiplier)}
                </div>

                {/* Sign Rule Explanation */}
                {(currentStepData.multiplicand < 0 || currentStepData.multiplier < 0) && (
                  <div className={`text-xs px-4 py-2 rounded-full animate-slide-down mt-2 inline-block ${
                    currentStepData.multiplicand < 0 && currentStepData.multiplier < 0
                      ? 'bg-success-100 text-success-800 border border-success-300'
                      : currentStepData.multiplicand < 0 || currentStepData.multiplier < 0
                      ? 'bg-error-100 text-error-800 border border-error-300'
                      : 'bg-brand-100 text-brand-800 border border-brand-300'
                  }`}>
                    {currentStepData.multiplicand < 0 && currentStepData.multiplier < 0
                      ? '📝 Rule: (−) × (−) = (+) Negative × Negative = Positive'
                      : currentStepData.multiplicand < 0 || currentStepData.multiplier < 0
                      ? '📝 Rule: (+) × (−) = (−) Positive × Negative = Negative'
                      : '📝 Rule: (+) × (+) = (+) Positive × Positive = Positive'
                    }
                  </div>
                )}
              </div>
            </div>

            {/* Concept Explanation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-blue-600 text-xl">💡</div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Key Concept:</h4>
                  <p className="text-blue-700 text-sm">
                    {getConceptExplanation(currentStepData.concept)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visualization Panel */}
        <div className="space-y-3 sm:space-y-4">
          <div className="number-card min-h-64 sm:min-h-80 md:min-h-96">
            <h4 className="text-base sm:text-lg font-semibold text-accent-700 mb-3 sm:mb-4 text-center">
              🎨 <span className="hidden sm:inline">Visual Representation</span><span className="sm:hidden">Visual</span>
            </h4>
            
            <div className="flex items-center justify-center h-48 sm:h-64 md:h-80 overflow-auto">
              {renderVisualization(currentStepData, animationPhase)}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 md:p-6 bg-white rounded-lg sm:rounded-xl shadow-soft border">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
            currentStep === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transform hover:scale-105'
          }`}
        >
          ← <span className="hidden xs:inline">{t('prev')}</span><span className="xs:hidden">Prev</span>
        </button>

        <button
          onClick={handlePlayPause}
          className={`w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
            isPlaying 
              ? 'bg-gradient-to-r from-warning-500 to-warning-600 text-white hover:from-warning-600 hover:to-warning-700' 
              : 'btn-primary'
          }`}
        >
          {isPlaying ? '⏸️ ' + t('pause') : '▶️ ' + t('play')}
        </button>

        <button
          onClick={handleNext}
          disabled={currentStep === demoSteps.length - 1}
          className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
            currentStep === demoSteps.length - 1 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 transform hover:scale-105'
          }`}
        >
          <span className="hidden xs:inline">{t('next')}</span><span className="xs:hidden">Next</span> →
        </button>

        <button
          onClick={handleReset}
          className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg font-medium text-sm sm:text-base hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105"
        >
          🔄 <span className="hidden xs:inline">{t('reset')}</span><span className="xs:hidden">Reset</span>
        </button>
      </div>

      {/* Properties Display */}
      {currentStepData.concept !== 'arrays' && (
        <div className="bg-gradient-to-r from-accent-50 to-brand-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-accent-200">
          <h3 className="text-base sm:text-lg font-semibold text-accent-700 mb-3 sm:mb-4 text-center">
            ✨ {t('mathematicalPropertiesTag')}
          </h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {getRelevantProperties(currentStepData.concept, t).map((property, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white rounded-full border-2 border-accent-200 text-accent-700 font-medium text-sm animate-property-appear"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {property}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function renderVisualization(stepData: DemoStep, phase: number) {
  const { multiplicand, multiplier, visualType, result } = stepData;

  switch (visualType) {
    case 'grid':
      // Only show grid for positive numbers
      if (multiplicand > 0 && multiplier > 0) {
        return (
          <div className="space-y-4">
            <div 
              className="multiplication-grid animate-grid-appear"
              style={{ 
                gridTemplateColumns: `repeat(${Math.min(multiplier, 10)}, 1fr)`,
                animationDelay: `${phase * 0.3}s`
              }}
            >
              {Array.from({ length: Math.min(multiplicand * multiplier, 100) }, (_, i) => (
                <div
                  key={i}
                  className={`grid-cell ${phase >= 2 ? 'highlighted' : phase >= 1 ? 'active' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {phase >= 1 && '●'}
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">
              {multiplicand} rows × {multiplier} columns = {result} total
            </div>
          </div>
        );
      } else {
        // Enhanced visualization for negative integers
        return (
          <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-blue-200">
            <h4 className="text-lg font-semibold text-center text-gray-700 mb-4">Integer Multiplication Visualization</h4>
            
            {/* Number Line Approach */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-3">Number Line Representation:</div>
              <div className="flex items-center justify-center space-x-2 mb-3">
                {/* First number */}
                <div className={`px-3 py-2 rounded-lg font-bold ${
                  multiplicand < 0 ? 'bg-error-100 text-error-700 animate-integer-negative' : 'bg-success-100 text-success-700 animate-integer-positive'
                }`}>
                  {multiplicand}
                </div>
                
                <span className="text-xl font-bold text-accent-600">×</span>
                
                {/* Second number */}
                <div className={`px-3 py-2 rounded-lg font-bold ${
                  multiplier < 0 ? 'bg-error-100 text-error-700 animate-integer-negative' : 'bg-success-100 text-success-700 animate-integer-positive'
                }`}>
                  {multiplier}
                </div>
                
                <span className="text-xl font-bold text-accent-600">=</span>
                
                {/* Result */}
                <div className={`px-3 py-2 rounded-lg font-bold ${
                  result < 0 ? 'bg-error-100 text-error-700 animate-sign-change' : 'bg-success-100 text-success-700 animate-success-pulse'
                }`}>
                  {result}
                </div>
              </div>
              
              {/* Step-by-step explanation */}
              <div className="space-y-2 text-sm">
                {multiplicand < 0 && multiplier < 0 && (
                  <div className="flex items-center space-x-2 animate-step-highlight">
                    <span className="text-success-600">✓</span>
                    <span>Negative × Negative = Positive (both signs cancel out)</span>
                  </div>
                )}
                {(multiplicand < 0 && multiplier > 0) || (multiplicand > 0 && multiplier < 0) && (
                  <div className="flex items-center space-x-2 animate-step-highlight">
                    <span className="text-error-600">⚠</span>
                    <span>Positive × Negative = Negative (different signs = negative result)</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Sign Rules Memory Helper */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-3">Remember the Sign Rules:</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                <div className="bg-success-50 border border-success-200 rounded p-2 text-center">
                  <div className="font-bold text-success-700">(+) × (+) = (+)</div>
                  <div className="text-success-600">Same signs = Positive</div>
                </div>
                <div className="bg-error-50 border border-error-200 rounded p-2 text-center">
                  <div className="font-bold text-error-700">(+) × (−) = (−)</div>
                  <div className="text-error-600">Different signs = Negative</div>
                </div>
                <div className="bg-success-50 border border-success-200 rounded p-2 text-center">
                  <div className="font-bold text-success-700">(−) × (−) = (+)</div>
                  <div className="text-success-600">Same signs = Positive</div>
                </div>
              </div>
            </div>
          </div>
        );
      }

    case 'groups':
      return (
        <div className="space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: multiplicand }, (_, groupIndex) => (
              <div
                key={groupIndex}
                className={`p-3 border-2 border-brand-300 rounded-lg bg-brand-50 transition-all duration-500 ${
                  phase >= groupIndex + 1 ? 'animate-scale-in' : 'opacity-30'
                }`}
                style={{ animationDelay: `${groupIndex * 0.5}s` }}
              >
                <div className="text-xs text-brand-600 font-medium mb-2 text-center">
                  Group {groupIndex + 1}
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: multiplier }, (_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`w-6 h-6 rounded-full bg-accent-400 flex items-center justify-center text-white text-xs transition-all duration-300 ${
                        phase >= 2 ? 'animate-number-pop' : ''
                      }`}
                      style={{ animationDelay: `${(groupIndex * multiplier + itemIndex) * 0.1}s` }}
                    >
                      ●
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-gray-700">
              {multiplicand} + {multiplicand} + {multiplicand} = {multiplicand * multiplier}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {multiplicand} groups of {multiplier} items each
            </div>
          </div>
        </div>
      );

    case 'property':
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-600 mb-4 animate-number-pop">
              {multiplicand} × {multiplier} = {result}
            </div>
            
            {/* Show different visualizations based on concept */}
            {stepData.concept === 'positive_negative' && (
              <div className="space-y-4">
                <div className="text-lg text-error-600 font-semibold">
                  Positive × Negative = Negative
                </div>
                <div className="bg-error-50 p-4 rounded-lg border border-error-200">
                  <div className="text-sm text-error-700">
                    When one number is positive and one is negative, the result is always negative.
                  </div>
                  <div className="mt-2 text-xs text-error-600">
                    Think: "Adding negative numbers" or "opposite direction"
                  </div>
                </div>
              </div>
            )}
            
            {stepData.concept === 'negative_negative' && (
              <div className="space-y-4">
                <div className="text-lg text-success-600 font-semibold">
                  Negative × Negative = Positive
                </div>
                <div className="bg-success-50 p-4 rounded-lg border border-success-200">
                  <div className="text-sm text-success-700">
                    When both numbers are negative, the result is positive.
                  </div>
                  <div className="mt-2 text-xs text-success-600">
                    Think: "Two wrongs make a right" or "opposite of opposite"
                  </div>
                </div>
              </div>
            )}
            
            {stepData.concept === 'commutative' && multiplicand > 0 && multiplier > 0 && (
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="multiplication-grid mb-2" style={{ gridTemplateColumns: `repeat(${Math.min(multiplier, 6)}, 1fr)` }}>
                    {Array.from({ length: Math.min(multiplicand * multiplier, 36) }, (_, i) => (
                      <div key={i} className="grid-cell highlighted">●</div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">{multiplicand} × {multiplier}</div>
                </div>
                
                <div className="flex items-center text-3xl text-brand-500 animate-multiply-pulse">
                  ↔️
                </div>
                
                <div className="text-center">
                  <div className="multiplication-grid mb-2" style={{ gridTemplateColumns: `repeat(${Math.min(multiplicand, 6)}, 1fr)` }}>
                    {Array.from({ length: Math.min(multiplicand * multiplier, 36) }, (_, i) => (
                      <div key={i} className="grid-cell highlighted">●</div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">{multiplier} × {multiplicand}</div>
                </div>
              </div>
            )}
            
            {stepData.concept === 'associative' && (
              <div className="space-y-4">
                <div className="text-lg text-brand-600 font-semibold">
                  Associative Property: Grouping doesn't matter
                </div>
                <div className="bg-brand-50 p-4 rounded-lg border border-brand-200">
                  <div className="text-center space-y-2">
                    <div className="text-sm">(2 × 3) × 4 = 6 × 4 = 24</div>
                    <div className="text-sm">2 × (3 × 4) = 2 × 12 = 24</div>
                  </div>
                </div>
              </div>
            )}
            
            {stepData.concept === 'distributive' && (
              <div className="space-y-4">
                <div className="text-lg text-accent-600 font-semibold">
                  Distributive Property: Multiply and distribute
                </div>
                <div className="bg-accent-50 p-4 rounded-lg border border-accent-200">
                  <div className="text-center space-y-2">
                    <div className="text-sm">3 × (4 + 2) = 3 × 6 = 18</div>
                    <div className="text-sm">(3 × 4) + (3 × 2) = 12 + 6 = 18</div>
                  </div>
                </div>
              </div>
            )}
            
            {stepData.concept === 'zeros_ones' && (
              <div className="space-y-4">
                <div className="text-lg text-success-600 font-semibold">
                  Identity and Zero Properties
                </div>
                <div className="bg-success-50 p-4 rounded-lg border border-success-200">
                  <div className="text-center space-y-2">
                    <div className="text-sm">Any number × 1 = that number</div>
                    <div className="text-sm">Any number × 0 = 0</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );

    default:
      return (
        <div className="text-center text-gray-500">
          Visualization not implemented for: {visualType}
        </div>
      );
  }
}

function getConceptExplanation(concept: string): string {
  switch (concept) {
    case 'arrays':
      return 'Multiplication can be visualized as rectangles or arrays where rows and columns create equal groups.';
    case 'repeated_addition':
      return 'Multiplication is a shortcut for adding the same number multiple times.';
    case 'positive_negative':
      return 'When multiplying positive and negative integers: Positive × Negative = Negative, Negative × Positive = Negative.';
    case 'negative_negative':
      return 'When multiplying two negative integers: Negative × Negative = Positive. "Two negatives make a positive."';
    case 'commutative':
      return 'The order of factors doesn\'t change the product: a × b = b × a.';
    case 'associative':
      return 'When multiplying three or more numbers, grouping doesn\'t affect the result: (a × b) × c = a × (b × c).';
    case 'distributive':
      return 'Multiplication distributes over addition: a × (b + c) = (a × b) + (a × c).';
    case 'zeros_ones':
      return 'Multiplying by 0 always gives 0, and multiplying by 1 gives the original number.';
    default:
      return 'Mathematical concept explanation';
  }
}

function getRelevantProperties(concept: string, t: (key: string) => string): string[] {
  switch (concept) {
    case 'repeated_addition':
      return [t('repeatedAdditionProperty'), t('groupingProperty'), t('basicOperationProperty')];
    case 'positive_negative':
      return [t('signRulesProperty'), t('integerMultiplicationProperty'), t('positiveNegativeRuleProperty')];
    case 'negative_negative':
      return [t('signRulesProperty'), t('negativeNegativeRuleProperty'), t('integerPropertiesProperty')];
    case 'commutative':
      return [t('commutativePropertyProperty'), t('orderIndependenceProperty'), t('commutativeFormulaProperty')];
    case 'associative':
      return [t('associativePropertyProperty'), t('groupingProperty'), t('associativeFormulaProperty')];
    case 'distributive':
      return [t('distributive'), t('groupingProperty'), 'a(b + c) = ab + ac'];
    case 'zeros_ones':
      return [t('identity'), t('zero'), t('basicOperationProperty')];
    default:
      return [t('basicOperationProperty')];
  }
}