import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, ArrowRight, Calculator, Droplets, BookOpen, Car, Package, Users, TrendingUp, ShoppingCart } from 'lucide-react';
import { getSteps, parseEquationToParams, type PercentOperation } from '../utils/percentTool';
import { useLanguage } from '../contexts/LanguageContext';

interface ComprehensivePercentageToolProps {
  showStep: boolean;
  // When provided, the tool will open directly on this type's steps
  defaultSelectedType?: PercentOperation | null;
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
  const [selectedType, setSelectedType] = useState<PercentOperation | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Helper function to replace placeholders in translation strings
  const translate = (key: string, params: Record<string, string | number> = {}) => {
    let text = t(key);
    Object.entries(params).forEach(([placeholder, value]) => {
      text = text.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), String(value));
    });
    return text;
  };

  // Animated Car Component - Updated for 5% of ₹100 visualization
  const AnimatedCar: React.FC<{
    isHighlighted: boolean;
    delay: number;
    value?: string;
    showValue?: boolean;
    label?: string;
  }> = ({ isHighlighted, delay, value, showValue = false, label }) => {
    const carSize = 'w-10 h-10';

    return (
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, x: -50, opacity: 0 }}
          animate={{ 
            scale: 1, 
            x: 0, 
            opacity: 1,
            backgroundColor: isHighlighted ? '#3b82f6' : '#e5e7eb',
            boxShadow: isHighlighted ? '0 0 20px rgba(59, 130, 246, 0.6)' : '0 4px 8px rgba(0,0,0,0.15)'
          }}
          transition={{ 
            delay, 
            duration: 0.8,
            type: "spring",
            stiffness: 150
          }}
          className={`${carSize} rounded-lg border-2 ${isHighlighted ? 'border-blue-500' : 'border-gray-300'} flex items-center justify-center relative overflow-hidden`}
        >
          <motion.div
            animate={{ 
              x: isHighlighted ? [0, 10, 0] : 0,
              opacity: isHighlighted ? [0.4, 0.8, 0.4] : 0
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"
          />
          
          <Car className={`w-5 h-5 ${isHighlighted ? 'text-white' : 'text-gray-400'}`} />
        </motion.div>
        
        {/* Value or label below car */}
        {(showValue && value) || label ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="mt-1 text-[10px] font-bold text-gray-700 bg-white px-1 py-0.5 rounded shadow border text-center whitespace-nowrap"
          >
            {value || label || ''}
          </motion.div>
        ) : null}
      </div>
    );
  };

  // Animated Bottle Component
  const AnimatedBottle: React.FC<{
    isHighlighted: boolean;
    delay: number;
    value?: string;
    showValue?: boolean;
    filled?: number;
    total?: number;
  }> = ({ isHighlighted, delay, value, showValue = false, filled = 1, total = 1 }) => {
    const bottleSize = 'w-12 h-12';

    return (
      <motion.div
        initial={{ scale: 0, y: 20, opacity: 0 }}
        animate={{ 
          scale: 1, 
          y: 0, 
          opacity: 1,
          backgroundColor: isHighlighted ? '#10b981' : '#e5e7eb',
          boxShadow: isHighlighted ? '0 0 20px rgba(16, 185, 129, 0.6)' : '0 4px 8px rgba(0,0,0,0.15)'
        }}
        transition={{ 
          delay, 
          duration: 0.8,
          type: "spring",
          stiffness: 150
        }}
        className={`${bottleSize} rounded-lg border-2 border-gray-300 flex items-center justify-center relative overflow-hidden`}
      >
        <motion.div
          animate={{ 
            y: isHighlighted ? [0, -5, 0] : 0,
            opacity: isHighlighted ? [0.4, 0.8, 0.4] : 0
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-t from-transparent via-white to-transparent"
        />
        
        <Package className="w-6 h-6 text-white" />
        
        {/* Fill level indicator */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${(filled / total) * 100}%` }}
          transition={{ delay: delay + 0.3, duration: 1 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-600 to-green-400 rounded-b-lg"
        />
        
        {showValue && value && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 py-0.5 rounded shadow border"
          >
            {value}
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Animated People Component
  const AnimatedPerson: React.FC<{
    isHighlighted: boolean;
    delay: number;
    value?: string;
    showValue?: boolean;
  }> = ({ isHighlighted, delay, value, showValue = false }) => {
    const personSize = 'w-12 h-12';

    return (
      <motion.div
        initial={{ scale: 0, y: 20, opacity: 0 }}
        animate={{ 
          scale: 1, 
          y: 0, 
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
        className={`${personSize} rounded-full border-2 border-gray-300 flex items-center justify-center relative overflow-hidden`}
      >
        <motion.div
          animate={{ 
            scale: isHighlighted ? [1, 1.1, 1] : 1,
            opacity: isHighlighted ? [0.4, 0.8, 0.4] : 0
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"
        />
        
        <Users className="w-6 h-6 text-white" />
        
        {showValue && value && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 py-0.5 rounded shadow border"
          >
            {value}
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Animated Shopping Cart Component
  const AnimatedCart: React.FC<{
    isHighlighted: boolean;
    delay: number;
    value?: string;
    showValue?: boolean;
  }> = ({ isHighlighted, delay, value, showValue = false }) => {
    const cartSize = 'w-12 h-12';

    return (
      <motion.div
        initial={{ scale: 0, rotate: -10, opacity: 0 }}
        animate={{ 
          scale: 1, 
          rotate: 0, 
          opacity: 1,
          backgroundColor: isHighlighted ? '#ef4444' : '#e5e7eb',
          boxShadow: isHighlighted ? '0 0 20px rgba(239, 68, 68, 0.6)' : '0 4px 8px rgba(0,0,0,0.15)'
        }}
        transition={{ 
          delay, 
          duration: 0.8,
          type: "spring",
          stiffness: 150
        }}
        className={`${cartSize} rounded-lg border-2 border-gray-300 flex items-center justify-center relative overflow-hidden`}
      >
        <motion.div
          animate={{ 
            x: isHighlighted ? [0, 5, 0] : 0,
            opacity: isHighlighted ? [0.4, 0.8, 0.4] : 0
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"
        />
        
        <ShoppingCart className="w-6 h-6 text-white" />
        
        {showValue && value && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 py-0.5 rounded shadow border"
          >
            {value}
          </motion.div>
        )}
      </motion.div>
    );
  };
  // @ts-ignore
  const StandardCoin: React.FC<{ 
    isHighlighted: boolean; 
    delay: number; 
    value?: string;
    showValue?: boolean;
  }> = ({ isHighlighted, delay, value, showValue = false }) => {
    const coinSize = 'w-12 h-12'; // Standard size for all objects

    return (
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
        
        {showValue && value && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 py-0.5 rounded shadow border"
          >
            {value}
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Book Component - Same size as coins (used instead of candles)
  // @ts-ignore
  const AnimatedBook: React.FC<{
    isHighlighted: boolean;
    delay: number;
  }> = ({ isHighlighted, delay }) => {
    const bookSize = 'w-12 h-12';

    return (
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
    );
  };

  // Water Glass Component - Same size as coins
  // @ts-ignore
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

  // Dynamic conversion types using translations
  const currentTypes = [
    {
      id: 'interpret' as PercentOperation,
      title: t('cpt_siOneYearTitle'),
      equation: t('cpt_siOneYearEq'),
      icon: '🧮',
      color: 'bg-blue-500',
      description: t('cpt_siOneYearDesc')
    },
    {
      id: 'percent_of_total' as PercentOperation,
      title: t('cpt_siMultiYearsTitle'),
      equation: t('cpt_siMultiYearsEq'),
      icon: '⏱️',
      color: 'bg-green-500',
      description: t('cpt_siMultiYearsDesc')
    }
  ];

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

    // Get steps from the utility function
    const params = parseEquationToParams(selectedType, '');
    const stepResult = getSteps(selectedType, t, params);
    const steps = stepResult.steps || [];
    
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
  }, [selectedType, language, onFirstCycleEnd]);

  if (!showStep) return null;
  // If no selected type and grid is hidden, render nothing
  if (!selectedType && hideTypeGrid) return null;

  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200/60 p-6 shadow-lg">
      {/* Main Title */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
          {t('cpt_title')}
        </h3>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Calculator className="w-4 h-4" />
          <span>
            {t('cpt_clickInstruction')}
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
                <span className="text-8xl">{type.icon}</span>
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
              {t('cpt_backToTypes')}
            </span>
          </motion.button>

          {/* Current Explanation */}
          <AnimatePresence mode="wait">
            {(() => {
              const params = parseEquationToParams(selectedType, '');
              const stepResult = getSteps(selectedType, t, params);
              const steps = stepResult.steps || [];
              
              if (steps.length === 0) return null;

              const currentStepData = steps[currentStep];
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
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{stepResult.title}</h4>
                  </div>

                  {/* Step Info */}
                  <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold px-3 py-1 rounded-full min-w-fit">
                        {currentStepData.step}
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-mono text-black mb-2 bg-gray-50 rounded p-2 border text-center">
                          {currentStepData.equation}
                        </div>
                        <p className="text-gray-700 text-sm">
                          {currentStepData.explanation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Visual Representation based on operation type */}
                  <div className="flex justify-center mb-4">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    >
                      {(() => {
                        switch (selectedType) {
                          case 'interpret':
                            // 5% of ₹100 = ₹5 - show with cars for all steps
                            const percent = 5;
                            const base = 100;
                            const answer = (percent / 100) * base; // = 5
                            
                            // Different visualization for each step using only cars to explain 5% of ₹100
                            if (currentStep === 0) {
                              // Step 1: Show concept - 5% of ₹100 means 5 out of 100
                              return (
                                <div className="flex flex-col items-center space-y-4">
                                  <div className="text-2xl font-bold text-gray-800">{percent}% of ₹{base}</div>
                                  <div className="text-sm text-gray-600 mb-2">{translate('viz_totalCars', { base })}</div>
                                  <div className="flex gap-1 flex-wrap justify-center max-w-2xl p-4 bg-white rounded-lg border-2 border-blue-200">
                                    {Array.from({ length: 20 }, (_, index) => (
                                      <AnimatedCar
                                        key={index}
                                        isHighlighted={false}
                                        delay={0.2 + index * 0.02}
                                        showValue={true}
                                        value="₹5"
                                      />
                                    ))}
                                  </div>
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.5 }}
                                    className="text-sm text-blue-600 font-semibold text-center"
                                  >
                                    {translate('viz_findPercentOf', { percent, base })}
                                  </motion.div>
                                </div>
                              );
                            } else if (currentStep === 1) {
                              // Step 2: Show 5% = 5/100 using cars
                              return (
                                <div className="flex flex-col items-center space-y-4">
                                  <div className="text-xl font-bold text-gray-800 mb-2">{percent}% = {percent}/100</div>
                                  <div className="flex items-center space-x-4 mb-4">
                                    <div className="bg-blue-100 rounded-lg p-4 border-2 border-blue-500">
                                      <div className="text-2xl font-bold text-blue-700">{percent}</div>
                                      <div className="text-xs text-gray-600 mt-1">{t('viz_carsOutOf')}</div>
                                      <div className="text-2xl font-bold text-blue-700">100</div>
                                    </div>
                                    <ArrowRight className="w-8 h-8 text-green-600" />
                                    <div className="text-2xl font-mono font-bold text-green-600">{percent}/100</div>
                                  </div>
                                  <div className="flex gap-1 flex-wrap justify-center max-w-xl">
                                    {Array.from({ length: 10 }, (_, index) => (
                                      <AnimatedCar
                                        key={index}
                                        isHighlighted={index < 1}
                                        delay={0.3 + index * 0.05}
                                        showValue={true}
                                        value="₹1"
                                      />
                                    ))}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {translate('viz_percentMeans', { percent })}
                                  </div>
                                </div>
                              );
                            } else if (currentStep === 2) {
                              // Step 3: Show multiplication (5/100) × 100 with cars
                              return (
                                <div className="flex flex-col items-center space-y-4">
                                  <div className="text-xl font-bold text-gray-800 mb-2">Quantity = ({percent}/100) × {base}</div>
                                  <div className="flex items-center space-x-4 mb-4">
                                    <div className="bg-blue-100 rounded-lg p-4 border-2 border-blue-500">
                                      <div className="text-lg font-mono">{percent}/100</div>
                                    </div>
                                    <span className="text-3xl font-bold text-gray-600">×</span>
                                    <div className="bg-green-100 rounded-lg p-4 border-2 border-green-500">
                                      <div className="text-lg font-bold">{base}</div>
                                    </div>
                                    <ArrowRight className="w-8 h-8 text-purple-600" />
                                    <div className="bg-purple-100 rounded-lg p-4 border-2 border-purple-500">
                                      <div className="text-lg font-mono font-bold text-purple-700">?</div>
                                    </div>
                                  </div>
                                  <div className="flex gap-1 flex-wrap justify-center max-w-xl">
                                    {Array.from({ length: 10 }, (_, index) => (
                                      <AnimatedCar
                                        key={index}
                                        isHighlighted={index < 1}
                                        delay={0.3 + index * 0.05}
                                        showValue={true}
                                        value={index < 1 ? "₹5" : "₹10"}
                                      />
                                    ))}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {translate('viz_multiplyFraction', { base })}
                                  </div>
                                </div>
                              );
                            } else if (currentStep === 3) {
                              // Step 4: Show calculation result
                              return (
                                <div className="flex flex-col items-center space-y-4">
                                  <div className="text-xl font-bold text-gray-800 mb-2">= ({percent} × {base})/100 = {answer}</div>
                                  <div className="flex items-center space-x-4 mb-4">
                                    <div className="bg-blue-100 rounded-lg p-4 border-2 border-blue-500">
                                      <div className="text-lg font-mono">{percent} × {base}</div>
                                      <div className="text-xs text-gray-600 mt-1">= {percent * base}</div>
                                    </div>
                                    <span className="text-3xl font-bold text-gray-600">÷</span>
                                    <div className="bg-green-100 rounded-lg p-4 border-2 border-green-500">
                                      <div className="text-xl font-bold">100</div>
                                    </div>
                                    <ArrowRight className="w-8 h-8 text-purple-600" />
                                    <motion.div
                                      initial={{ scale: 0.8 }}
                                      animate={{ scale: 1.1 }}
                                      transition={{ duration: 0.5, repeat: 2, repeatType: "reverse" }}
                                      className="bg-purple-100 rounded-lg p-4 border-2 border-purple-500"
                                    >
                                      <div className="text-2xl font-bold text-purple-700">{answer}</div>
                                    </motion.div>
                                  </div>
                                  <div className="flex gap-1 flex-wrap justify-center max-w-xl">
                                    {Array.from({ length: 10 }, (_, index) => (
                                      <AnimatedCar
                                        key={index}
                                        isHighlighted={index < 1}
                                        delay={0.3 + index * 0.05}
                                        showValue={true}
                                        value={index < 1 ? "₹5" : "₹10"}
                                      />
                                    ))}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {translate('viz_calculation', { result: percent * base, answer })}
                                  </div>
                                </div>
                              );
                            } else {
                              // Step 5: Final answer - show 5 cars out of 100 cars = 5%
                              // Show 20 cars representing 100 (each car = ₹5), with 1 highlighted (5%)
                              return (
                                <div className="flex flex-col items-center space-y-4">
                                  <div className="text-2xl font-bold text-gray-800 mb-2">{percent}% of ₹{base}</div>
                                  <div className="flex gap-1 flex-wrap justify-center max-w-2xl p-4 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
                                    {Array.from({ length: 20 }, (_, index) => (
                                      <AnimatedCar
                                        key={index}
                                        isHighlighted={index < 1}
                                        delay={0.2 + index * 0.015}
                                        showValue={true}
                                        value="₹5"
                                      />
                                    ))}
                                  </div>
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.5, duration: 0.5 }}
                                    className="flex flex-col items-center space-y-2 bg-blue-50 rounded-lg p-3 border border-blue-200"
                                  >
                                    <div className="text-sm text-gray-700 font-semibold">
                                      {translate('viz_carsOutOf100', { count: 5, percent })}
                                    </div>
                                    <motion.div
                                      initial={{ scale: 0.9 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 2, duration: 0.3 }}
                                      className="flex items-center space-x-2 text-blue-600"
                                    >
                                      <TrendingUp className="w-5 h-5" />
                                      <span className="text-lg font-bold">{translate('viz_percentMeansOutOf100', { percent })}</span>
                                    </motion.div>
                                    <div className="text-sm text-gray-600 mt-1">
                                      {translate('viz_soPercentOf', { percent, base, answer })}
                                    </div>
                                  </motion.div>
                                </div>
                              );
                            }
                          case 'percent_of_total':
                            // Simple Interest (T years): P=3000, R=5%, T=3, I=450
                            const P = 3000;
                            const R = 5;
                            const T = 3;
                            const I = (P * R * T) / 100; // = 450
                            
                            // Different visualization for each step using only cars
                            if (currentStep === 0) {
                              // Step 1: Show the formula concept with cars
                              return (
                                <div className="flex flex-col items-center space-y-4">
                                  <div className="text-2xl font-bold text-gray-800">I = (P × R × T)/100</div>
                                  <div className="text-sm text-gray-600 mb-2">{t('viz_siFormula')}</div>
                                  <div className="flex gap-1 flex-wrap justify-center max-w-xl p-4 bg-white rounded-lg border-2 border-green-200">
                                    {Array.from({ length: 12 }, (_, index) => (
                                      <AnimatedCar
                                        key={index}
                                        isHighlighted={false}
                                        delay={0.2 + index * 0.03}
                                        showValue={true}
                                        value="P"
                                      />
                                    ))}
                                  </div>
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.5 }}
                                    className="text-sm text-green-600 font-semibold text-center"
                                  >
                                    {t('viz_carRepresentsPrincipal')}
                                  </motion.div>
                                </div>
                              );
                            } else if (currentStep === 1) {
                              // Step 2: Show substitution P=3000, R=5%, T=3 with cars
                              return (
                                <div className="flex flex-col items-center space-y-4">
                                  <div className="text-xl font-bold text-gray-800 mb-2">{translate('viz_substitute', { P, R, T })}</div>
                                  <div className="flex items-center space-x-4 mb-4">
                                    <div className="bg-blue-100 rounded-lg p-4 border-2 border-blue-500">
                                      <div className="text-lg font-mono">P = ₹{P}</div>
                                      <div className="text-xs text-gray-600 mt-1">{P / 100} {t('viz_cars')}</div>
                                    </div>
                                    <div className="bg-green-100 rounded-lg p-4 border-2 border-green-500">
                                      <div className="text-lg font-bold">R = {R}%</div>
                                    </div>
                                    <div className="bg-purple-100 rounded-lg p-4 border-2 border-purple-500">
                                      <div className="text-lg font-bold">T = {T} years</div>
                                    </div>
                                  </div>
                                  <div className="flex gap-1 flex-wrap justify-center max-w-xl">
                                    {Array.from({ length: 10 }, (_, index) => (
                                      <AnimatedCar
                                        key={index}
                                        isHighlighted={index < 3}
                                        delay={0.3 + index * 0.05}
                                        showValue={true}
                                        value={`₹${P/10}`}
                                      />
                                    ))}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {translate('viz_principalEquals', { P, carValue: P/10, R, T })}
                                  </div>
                                </div>
                              );
                            } else if (currentStep === 2) {
                              // Step 3: Show multiplication (P × R × T) with cars
                              return (
                                <div className="flex flex-col items-center space-y-4">
                                  <div className="text-xl font-bold text-gray-800 mb-2">I = ({P} × {R} × {T})/100</div>
                                  <div className="flex items-center space-x-4 mb-4">
                                    <div className="bg-blue-100 rounded-lg p-4 border-2 border-blue-500">
                                      <div className="text-lg font-mono">{P} × {R}</div>
                                      <div className="text-xs text-gray-600 mt-1">= {P * R}</div>
                                    </div>
                                    <span className="text-3xl font-bold text-gray-600">×</span>
                                    <div className="bg-purple-100 rounded-lg p-4 border-2 border-purple-500">
                                      <div className="text-lg font-bold">{T}</div>
                                    </div>
                                    <ArrowRight className="w-8 h-8 text-green-600" />
                                    <div className="bg-green-100 rounded-lg p-4 border-2 border-green-500">
                                      <div className="text-lg font-mono font-bold text-green-700">{P * R * T}</div>
                                    </div>
                                  </div>
                                  <div className="flex gap-1 flex-wrap justify-center max-w-xl">
                                    {Array.from({ length: 9 }, (_, index) => (
                                      <AnimatedCar
                                        key={index}
                                        isHighlighted={index < 4}
                                        delay={0.3 + index * 0.05}
                                        showValue={true}
                                        value={`₹${Math.floor((P * R * T) / 10)}`}
                                      />
                                    ))}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {translate('viz_multiply', { result: P * R * T, carValue: Math.floor((P * R * T) / 10) })}
                                  </div>
                                </div>
                              );
                            } else if (currentStep === 3) {
                              // Step 4: Show division result
                              return (
                                <div className="flex flex-col items-center space-y-4">
                                  <div className="text-xl font-bold text-gray-800 mb-2">= {P * R * T}/100 = ₹{I}</div>
                                  <div className="flex items-center space-x-4 mb-4">
                                    <div className="bg-blue-100 rounded-lg p-4 border-2 border-blue-500">
                                      <div className="text-lg font-mono">{P * R * T}</div>
                                    </div>
                                    <span className="text-3xl font-bold text-gray-600">÷</span>
                                    <div className="bg-green-100 rounded-lg p-4 border-2 border-green-500">
                                      <div className="text-xl font-bold">100</div>
                                    </div>
                                    <ArrowRight className="w-8 h-8 text-purple-600" />
                                    <motion.div
                                      initial={{ scale: 0.8 }}
                                      animate={{ scale: 1.1 }}
                                      transition={{ duration: 0.5, repeat: 2, repeatType: "reverse" }}
                                      className="bg-purple-100 rounded-lg p-4 border-2 border-purple-500"
                                    >
                                      <div className="text-2xl font-bold text-purple-700">₹{I}</div>
                                    </motion.div>
                                  </div>
                                  <div className="flex gap-1 flex-wrap justify-center max-w-xl">
                                    {Array.from({ length: 9 }, (_, index) => (
                                      <AnimatedCar
                                        key={index}
                                        isHighlighted={true}
                                        delay={0.3 + index * 0.05}
                                        showValue={true}
                                        value={`₹${Math.floor(I / 9)}`}
                                      />
                                    ))}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {translate('viz_interestFor', { I, T, carValue: Math.floor(I / 9) })}
                                  </div>
                                </div>
                              );
                            } else {
                              // Step 5: Final answer - show total interest over T years with cars
                              return (
                                <div className="flex flex-col items-center space-y-4">
                                  <div className="text-2xl font-bold text-gray-800 mb-2">{translate('viz_answerForYears', { I, T })}</div>
                                  <div className="flex gap-1 flex-wrap justify-center max-w-2xl p-4 bg-white rounded-lg border-2 border-green-200 shadow-sm">
                                    {Array.from({ length: 9 }, (_, index) => (
                                      <AnimatedCar
                                        key={index}
                                        isHighlighted={true}
                                        delay={0.2 + index * 0.03}
                                        showValue={true}
                                        value={`₹${Math.floor(I / 9)}`}
                                      />
                                    ))}
                                  </div>
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.5, duration: 0.5 }}
                                    className="flex flex-col items-center space-y-2 bg-green-50 rounded-lg p-3 border border-green-200"
                                  >
                                    <div className="text-sm text-gray-700 font-semibold">
                                      {translate('viz_totalSiForYears', { I, T })}
                                    </div>
                                    <motion.div
                                      initial={{ scale: 0.9 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 2, duration: 0.3 }}
                                      className="flex items-center space-x-2 text-green-600"
                                    >
                                      <TrendingUp className="w-5 h-5" />
                                      <span className="text-lg font-bold">{translate('viz_eachCarRepresentsInterest', { carValue: Math.floor(I / 9) })}</span>
                                    </motion.div>
                                    <div className="text-sm text-gray-600 mt-1">
                                      {translate('viz_formulaCalculation', { P, R, T, I })}
                                    </div>
                                  </motion.div>
                                </div>
                              );
                            }
                          case 'ratio_to_percent':
                            return (
                              <div className="flex flex-col items-center space-y-4">
                                <div className="text-2xl font-bold text-gray-800">2:1 Ratio</div>
                                <div className="flex gap-2 flex-wrap justify-center">
                                  {[0, 1, 2].map((index) => (
                                    <AnimatedPerson
                                      key={index}
                                      isHighlighted={index < 2}
                                      delay={0.5 + index * 0.2}
                                      showValue={true}
                                      value={index < 2 ? "2" : "1"}
                                    />
                                  ))}
                                </div>
                                <div className="text-sm text-gray-600">2 people out of 3 people</div>
                                <AnimatedPieChart numerator={2} denominator={3} color="#8b5cf6" />
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 1.5 }}
                                  className="flex items-center space-x-2 text-purple-600"
                                >
                                  <Users className="w-4 h-4" />
                                  <span className="text-sm font-semibold">≈ 66.7%</span>
                                </motion.div>
                              </div>
                            );
                          case 'percent_change':
                            return (
                              <div className="flex flex-col items-center space-y-4">
                                <div className="text-2xl font-bold text-gray-800">280 → 350</div>
                                <div className="flex gap-2 flex-wrap justify-center">
                                  {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                                    <AnimatedCart
                                      key={index}
                                      isHighlighted={index < 7}
                                      delay={0.5 + index * 0.05}
                                      showValue={true}
                                      value={index < 7 ? "350" : "280"}
                                    />
                                  ))}
                                </div>
                                <div className="text-sm text-gray-600">7 carts at new price, 1 cart at old price</div>
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 1.5 }}
                                  className="flex items-center space-x-2 text-red-600"
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                  <span className="text-sm font-semibold">25% increase</span>
                                </motion.div>
                              </div>
                            );
                          default:
                            return null;
                        }
                      })()}
                    </motion.div>
                  </div>

                  {/* Step Indicators */}
                  <div className="flex justify-center space-x-2">
                    {steps.map((_, index) => (
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
