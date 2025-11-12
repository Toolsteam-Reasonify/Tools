import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, ArrowRight, Calculator, Droplets, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ComprehensivePercentageToolProps {
  showStep: boolean;
  // When provided, the tool will open directly on this type's steps
  defaultSelectedType?: 'fraction_to_percentage' | 'decimal_to_percentage' | 'percentage_to_fraction' | 'part_of_total' | null;
  // Called once after the first full cycle of steps completes
  onFirstCycleEnd?: () => void;
  // If provided, clicking Back will invoke this and parent can decide UI (e.g., show Examples grid)
  onBackToTypes?: () => void;
  // If true, do not render the colored type grid when no selection
  hideTypeGrid?: boolean;
}

const ComprehensivePercentageTool: React.FC<ComprehensivePercentageToolProps> = ({ 
  showStep,
  defaultSelectedType = null,
  onFirstCycleEnd,
  onBackToTypes,
  hideTypeGrid
}) => {
  const { language, t } = useLanguage();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Typewriter to reveal text line-by-line (keeps existing layout)
  const TypewriterText: React.FC<{ text: string; speed?: number; delay?: number }> = ({ text, speed = 20, delay = 0 }) => {
    const [displayed, setDisplayed] = useState('');
    useEffect(() => {
      setDisplayed('');
      if (!text) return;
      let i = 0;
      const start = setTimeout(() => {
        const interval = setInterval(() => {
          i++;
          setDisplayed(text.slice(0, i));
          if (i >= text.length) clearInterval(interval);
        }, speed);
      }, delay);
      return () => clearTimeout(start);
    }, [text, speed, delay]);
    return <span>{displayed}</span>;
  };

  // Standard Coin Component - All objects will be this size
  const StandardCoin: React.FC<{ 
    isHighlighted: boolean; 
    delay: number; 
    value?: string;
    showValue?: boolean;
    label?: string;
  }> = ({ isHighlighted, delay, value, showValue = false, label }) => {
    const coinSize = 'w-12 h-12'; // Standard size for all objects

    return (
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ 
            scale: 1, 
            rotate: 0, 
            opacity: 1,
            backgroundColor: isHighlighted ? '#f59e0b' : '#e5e7eb',
            boxShadow: isHighlighted ? '0 0 20px rgba(245, 158, 11, 0.6)' : '0 4px 8px rgba(0,0,0,0.15)'
          }}
          transition={{ 
            delay, 
            duration: 0.8,
            type: "spring",
            stiffness: 150
          }}
          className={`${coinSize} rounded-full border-4 border-gray-300 flex items-center justify-center relative overflow-hidden`}
        >
          <motion.div
            animate={{ 
              x: isHighlighted ? [0, 20, 0] : 0,
              opacity: isHighlighted ? [0.4, 0.8, 0.4] : 0
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"
          />
          
          <Coins className="w-6 h-6 text-white" />
        </motion.div>
        
        {/* Value display below coin */}
        {(showValue || label) && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="mt-2 text-xs font-bold text-gray-700 bg-white px-2 py-0.5 rounded shadow border text-center whitespace-nowrap"
          >
            {value || label || ''}
          </motion.div>
        )}
      </div>
    );
  };

  // Book Component - Same size as coins (used instead of candles)
  const AnimatedBook: React.FC<{
    isHighlighted: boolean;
    delay: number;
    value?: string;
    label?: string;
    showValue?: boolean;
  }> = ({ isHighlighted, delay, value, label, showValue = false }) => {
    const bookSize = 'w-12 h-12';

    return (
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            backgroundColor: isHighlighted ? '#bfdbfe' : '#f3f4f6',
            boxShadow: isHighlighted ? '0 0 12px rgba(59,130,246,0.45)' : '0 2px 6px rgba(0,0,0,0.12)'
          }}
          transition={{ delay, duration: 0.6, type: 'spring', stiffness: 140 }}
          className={`${bookSize} rounded-md border-2 ${isHighlighted ? 'border-blue-300' : 'border-gray-200'} flex items-center justify-center relative`}
        >
          <BookOpen className={`w-5 h-5 ${isHighlighted ? 'text-blue-700' : 'text-gray-400'}`} />
        </motion.div>
        
        {/* Text label below book */}
        {(showValue || value || label) && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
            className="mt-2 text-xs font-bold text-gray-700 bg-white px-2 py-0.5 rounded shadow border text-center whitespace-nowrap"
          >
            {value || label || (isHighlighted ? 'Filled' : 'Empty')}
          </motion.div>
        )}
      </div>
    );
  };


  // Water Glass Component - Same size as coins
  const AnimatedWaterGlass: React.FC<{ 
    filled: number; 
    total: number; 
    delay: number; 
    value?: string;
    showValue?: boolean;
  }> = ({ filled, total, delay, value, showValue = false }) => {
    const glassSize = 'w-12 h-12'; // Same size as coins

    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay, duration: 0.5 }}
        className={`${glassSize} border-2 border-blue-300 rounded-lg relative`}
      >
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${(filled / total) * 100}%` }}
          transition={{ delay: delay + 0.3, duration: 1 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 rounded-b-md"
        />
        <Droplets className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-2 h-2 text-blue-300" />
        {showValue && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.4 }}
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[10px] font-semibold text-gray-700"
          >
            {value}
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Pie Chart Component - Same size as coins
  const AnimatedPieChart: React.FC<{ 
    numerator: number; 
    denominator: number; 
    color: string;
  }> = ({ numerator, denominator, color }) => {
    const radius = 20; // Same size as coins
    const circumference = 2 * Math.PI * radius;
    const filledArc = (numerator / denominator) * circumference;
    const percentage = Math.round((numerator / denominator) * 100);
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width={48} height={48} className="transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="6"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 125.6" }}
              animate={{ strokeDasharray: `${filledArc} 125.6` }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-sm font-bold text-gray-800">{percentage}%</span>
          </motion.div>
        </div>
      </div>
    );
  };

  // Conversion types using translations
  const conversionTypes = [
    {
      id: 'fraction_to_percentage',
      title: t('fractionToPercentage'),
      equation: '1/4 × 100 = 25%',
      icon: '📊',
      color: 'bg-blue-500',
      description: t('convertingFractionsToPercentages')
    },
    {
      id: 'decimal_to_percentage',
      title: t('decimalToPercentage'),
      equation: '0.75 × 100 = 75%',
      icon: '📈',
      color: 'bg-green-500',
      description: t('convertingDecimalsToPercentages')
    },
    {
      id: 'percentage_to_fraction',
      title: t('percentageToFraction'),
      equation: '60% = 60/100 = 3/5',
      icon: '📉',
      color: 'bg-purple-500',
      description: t('convertingPercentagesToFractions')
    },
    {
      id: 'part_of_total',
      title: t('partOfTotal'),
      equation: '8/20 = (8×5)/(20×5) = 40/100 = 40%',
      icon: '🧮',
      color: 'bg-orange-500',
      description: t('findingPercentageOfPart')
    }
  ];

  // Generate step explanations dynamically based on current language
  const getStepExplanations = () => ({
    fraction_to_percentage: {
      title: t('ftp_title'),
      steps: [
        {
          step: 1,
          equation: t('ftp_step1_eq'),
          explanation: t('ftp_step1_exp'),
          visual: (
            <div className="flex flex-col items-center space-y-4">
              <div className="text-2xl font-bold text-gray-800">1/4</div>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <StandardCoin
                    key={index}
                    isHighlighted={index === 0}
                    delay={0.5 + index * 0.1}
                    showValue={true}
                    value={index === 0 ? "1" : "4"}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">{t('ftp_step1_visual')}</div>
            </div>
          )
        },
        {
          step: 2,
          equation: t('ftp_step2_eq'),
          explanation: t('ftp_step2_exp'),
          visual: (
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-4">
                <div className="text-xl font-bold text-blue-600">1/4</div>
                <ArrowRight className="w-6 h-6 text-green-600" />
                <div className="text-xl font-bold text-green-600">× 100</div>
                <ArrowRight className="w-6 h-6 text-purple-600" />
                <div className="text-xl font-bold text-purple-600">100/4</div>
              </div>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <StandardCoin
                    key={index}
                    isHighlighted={index === 0}
                    delay={0.4 + index * 0.1}
                    showValue={true}
                    value={index === 0 ? "1" : "4"}
                  />
                ))}
              </div>
            </div>
          )
        },
        {
          step: 3,
          equation: t('ftp_step3_eq'),
          explanation: t('ftp_step3_exp'),
          visual: (
            <div className="flex flex-col items-center space-y-3">
              <div className="text-lg font-semibold text-gray-700">100 ÷ 4 = 25</div>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <StandardCoin
                    key={index}
                    isHighlighted={true}
                    delay={1 + index * 0.1}
                    showValue={true}
                    value="25"
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">{t('eachGroup')} {t('has')} 25 {t('coins')}</div>
            </div>
          )
        },
        {
          step: 4,
          equation: t('ftp_step4_eq'),
          explanation: t('ftp_step4_exp'),
          visual: (
            <div className="flex flex-col items-center space-y-3">
              <div className="text-3xl font-bold text-green-600">25%</div>
              <AnimatedPieChart numerator={1} denominator={4} color="#3b82f6" />
              <div className="flex gap-2 mt-1">
                {[0,1,2,3].map((i) => (
                  <StandardCoin 
                    key={i} 
                    isHighlighted={i===0} 
                    delay={0.2 + i*0.1}
                    showValue={true}
                    value={i === 0 ? "1" : "4"}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">{t('visualRepresentation')}</div>
            </div>
          )
        }
      ]
    },
    decimal_to_percentage: {
      title: t('dtp_title'),
      steps: [
        {
          step: 1,
          equation: t('dtp_step1_eq'),
          explanation: t('dtp_step1_exp'),
          visual: (
            <div className="flex flex-col items-center space-y-4">
              <div className="text-2xl font-bold text-gray-800">0.75</div>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((index) => (
                  <AnimatedBook
                    key={index}
                    isHighlighted={index === 0}
                    delay={0.5 + index * 0.1}
                    showValue={true}
                    value={index === 0 ? "0.75" : "0"}
                    label={index === 0 ? t('part') : t('empty')}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">{t('dtp_step1_visual')}</div>
            </div>
          )
        },
        {
          step: 2,
          equation: t('dtp_step2_eq'),
          explanation: t('dtp_step2_exp'),
          visual: (
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-4">
                <div className="text-xl font-bold text-blue-600">0.75</div>
                <ArrowRight className="w-6 h-6 text-green-600" />
                <div className="text-xl font-bold text-green-600">× 100</div>
                <ArrowRight className="w-6 h-6 text-purple-600" />
                <div className="text-xl font-bold text-purple-600">75</div>
              </div>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((index) => (
                  <AnimatedBook 
                    key={index} 
                    isHighlighted={index === 0} 
                    delay={0.4 + index * 0.1}
                    showValue={true}
                    value={index === 0 ? "75" : "0"}
                    label={index === 0 ? t('result') : t('empty')}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">{t('dtp_step2_visual')}</div>
            </div>
          )
        },
        {
          step: 3,
          equation: t('dtp_step3_eq'),
          explanation: t('dtp_step3_exp'),
          visual: (
            <div className="flex flex-col items-center space-y-3">
              <div className="text-3xl font-bold text-green-600">75%</div>
              <AnimatedPieChart numerator={3} denominator={4} color="#10b981" />
              <div className="flex gap-2 mt-1">
                {[0, 1, 2, 3, 4].map((index) => (
                  <AnimatedBook 
                    key={index} 
                    isHighlighted={index === 0} 
                    delay={0.4 + index * 0.1}
                    showValue={true}
                    value={index === 0 ? "75%" : "0%"}
                    label={index === 0 ? t('percentage') : t('empty')}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">{t('dtp_step3_visual')}</div>
            </div>
          )
        }
      ]
    },
    percentage_to_fraction: {
      title: t('ptf_title'),
      steps: [
        {
          step: 1,
          equation: t('ptf_step1_eq'),
          explanation: t('ptf_step1_exp'),
          visual: (
            <div className="flex flex-col items-center space-y-4">
              <div className="text-2xl font-bold text-gray-800">60%</div>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((index) => (
                  <AnimatedWaterGlass
                    key={index}
                    filled={index < 3 ? 1 : 0}
                    total={1}
                    delay={0.5 + index * 0.1}
                    showValue={true}
                    value={'20%'}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">3 {t('outOf')} 5 {t('books')} filled</div>
            </div>
          )
        },
        {
          step: 2,
          equation: t('ptf_step2_eq'),
          explanation: t('ptf_step2_exp'),
          visual: (
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-4">
                <div className="text-xl font-bold text-blue-600">60%</div>
                <ArrowRight className="w-6 h-6 text-green-600" />
                <div className="text-xl font-bold text-green-600">60/100</div>
              </div>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((index) => (
                  <AnimatedWaterGlass
                    key={index}
                    filled={index < 3 ? 1 : 0}
                    total={1}
                    delay={0.4 + index * 0.08}
                    showValue={true}
                    value={'20%'}
                  />
                ))}
              </div>
            </div>
          )
        },
        {
          step: 3,
          equation: t('ptf_step3_eq'),
          explanation: t('ptf_step3_exp'),
          visual: (
            <div className="flex flex-col items-center space-y-3">
              <div className="text-lg font-semibold text-gray-700">60/100 = 3/5</div>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((index) => (
                  <AnimatedWaterGlass
                    key={index}
                    filled={index < 3 ? 1 : 0}
                    total={1}
                    delay={1 + index * 0.1}
                    showValue={true}
                    value={'20%'}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">Simplified: 3/5</div>
            </div>
          )
        }
      ]
    },
    part_of_total: {
      title: t('pot_title'),
      steps: [
        {
          step: 1,
          equation: t('pot_step1_eq'),
          explanation: t('pot_step1_exp'),
          visual: (
            <div className="flex flex-col items-center space-y-4">
              <div className="text-2xl font-bold text-gray-800">8/20</div>
              <div className="flex flex-wrap gap-1 justify-center max-w-xs">
                {Array.from({ length: 20 }, (_, index) => (
                  <AnimatedBook key={index} isHighlighted={index < 8} delay={0.5 + index * 0.02} />
                ))}
              </div>
              <div className="text-sm text-gray-600">8 {t('outOf')} 20 {t('coins')}</div>
            </div>
          )
        },
        {
          step: 2,
          equation: t('pot_step2_eq'),
          explanation: t('pot_step2_exp'),
          visual: (
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-4">
                <div className="text-xl font-bold text-blue-600">8/20</div>
                <ArrowRight className="w-6 h-6 text-green-600" />
                <div className="text-xl font-bold text-green-600">× 5/5</div>
                <ArrowRight className="w-6 h-6 text-purple-600" />
                <div className="text-xl font-bold text-purple-600">40/100</div>
              </div>
              <div className="flex flex-wrap gap-1 justify-center max-w-xs">
                {Array.from({ length: 20 }, (_, index) => (
                  <AnimatedBook key={index} isHighlighted={index < 8} delay={0.3 + index * 0.02} />
                ))}
              </div>
            </div>
          )
        },
        {
          step: 3,
          equation: t('pot_step3_eq'),
          explanation: t('pot_step3_exp'),
          visual: (
            <div className="flex flex-col items-center space-y-3">
              <div className="text-3xl font-bold text-green-600">40%</div>
              <AnimatedPieChart numerator={8} denominator={20} color="#f97316" />
              <div className="flex flex-wrap gap-1 justify-center max-w-xs">
                {Array.from({ length: 20 }, (_, index) => (
                  <AnimatedBook key={index} isHighlighted={index < 8} delay={0.3 + index * 0.02} />
                ))}
              </div>
              <div className="text-sm text-gray-600">40% {t('of')} {t('total')}</div>
            </div>
          )
        }
      ]
    }
  });

  const currentTypes = conversionTypes;
  const currentExplanations = getStepExplanations();

  // Sync selected type from parent when provided
  useEffect(() => {
    if (showStep) {
      if (defaultSelectedType) {
        setSelectedType(defaultSelectedType);
      } else {
        setSelectedType(null);
      }
      setCurrentStep(0);
    }
  }, [showStep, defaultSelectedType]);

  // Auto-advance through steps when a type is selected
  useEffect(() => {
    if (!selectedType) {
      setCurrentStep(0);
      return;
    }

    const steps = currentExplanations[selectedType as keyof typeof currentExplanations]?.steps || [];
    if (steps.length === 0) return;

    const stepDurationMs = 5000;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, stepDurationMs); // 5 seconds per step

    // Notify parent after first full cycle
    let cycleTimer: ReturnType<typeof setTimeout> | undefined;
    if (onFirstCycleEnd) {
      cycleTimer = setTimeout(() => {
        onFirstCycleEnd();
      }, steps.length * stepDurationMs);
    }

    return () => {
      clearInterval(interval);
      if (cycleTimer) clearTimeout(cycleTimer);
    };
  }, [selectedType, currentExplanations, onFirstCycleEnd]);

  if (!showStep) return null;
  // If no selected type and grid is hidden, render nothing
  if (!selectedType && hideTypeGrid) return null;

  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200/60 p-6 shadow-lg">
      {/* Main Title */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
          {t('percentageConversions')}
        </h3>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Calculator className="w-4 h-4" />
          <span>
            {t('clickOnAnyType')}
          </span>
        </div>
      </div>

      {!selectedType ? (
        /* Main Grid of Conversion Types */
        <div className="grid grid-cols-2 gap-4 mb-6">
          {currentTypes.map((type, index) => (
            <motion.button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${type.color} text-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-7xl">{type.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-lg">{type.title}</div>
                  <div className="text-sm opacity-90">{type.description}</div>
                </div>
              </div>
              <div className="bg-white/20 rounded p-2 text-center">
                <div className="font-mono text-base">{type.equation}</div>
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        /* Step-by-Step Explanation */
        <div>
          {/* Back Button */}
          <motion.button
            onClick={() => {
              if (onBackToTypes) {
                onBackToTypes();
              } else {
                setSelectedType(null);
                setCurrentStep(0);
              }
            }}
            className="mb-4 flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span className="text-sm font-medium">
              {t('backToTypes')}
            </span>
          </motion.button>

          {/* Current Explanation */}
          <AnimatePresence mode="wait">
            {(() => {
              const explanation = currentExplanations[selectedType as keyof typeof currentExplanations];
              if (!explanation) return null;

              const currentStepData = explanation.steps[currentStep];
              if (!currentStepData) return null;

              return (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Title */}
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{explanation.title}</h4>
                  </div>

                  {/* Step Info */}
                  <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold px-3 py-1 rounded-full min-w-fit">
                        {language === 'en' ? `Step ${currentStepData.step}:` :
                         language === 'hi' ? `चरण ${currentStepData.step}:` :
                         `પગલું ${currentStepData.step}:`}
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-mono text-black mb-2 bg-gray-50 rounded p-2 border text-center">
                          <TypewriterText text={currentStepData.equation} speed={22} />
                        </div>
                        <p className="text-gray-700 text-sm">
                          <TypewriterText text={currentStepData.explanation} delay={250} speed={18} />
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Visual Representation */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm mb-4"
                  >
                    <div className="flex justify-center">
                      {currentStepData.visual}
                    </div>
                  </motion.div>

                  {/* Step Indicators */}
                  <div className="flex justify-center space-x-2">
                    {explanation.steps.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentStep 
                            ? 'bg-blue-500 scale-125' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ComprehensivePercentageTool;
