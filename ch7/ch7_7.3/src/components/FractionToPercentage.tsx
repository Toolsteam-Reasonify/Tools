import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, ArrowRight, CheckCircle, Calculator } from 'lucide-react';

interface FractionToPercentageProps {
  language: 'en' | 'hi' | 'gu';
  showStep: boolean;
}

const FractionToPercentage: React.FC<FractionToPercentageProps> = ({ 
  language, 
  showStep 
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Large Detailed Coin Component with increased size
  const LargeCoin: React.FC<{ 
    isHighlighted: boolean; 
    delay: number; 
    size: 'small' | 'medium' | 'large' | 'xlarge';
    value?: string;
    showValue?: boolean;
  }> = ({ isHighlighted, delay, size, value, showValue = false }) => {
    const sizeClasses = {
      small: 'w-10 h-10',
      medium: 'w-16 h-16', 
      large: 'w-20 h-20',
      xlarge: 'w-24 h-24'
    };

    return (
      <motion.div
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ 
          scale: 1, 
          rotate: 0, 
          opacity: 1,
          backgroundColor: isHighlighted ? '#f59e0b' : '#e5e7eb',
          boxShadow: isHighlighted ? '0 0 25px rgba(245, 158, 11, 0.6)' : '0 4px 8px rgba(0,0,0,0.15)'
        }}
        transition={{ 
          delay, 
          duration: 0.8,
          type: "spring",
          stiffness: 150
        }}
        className={`${sizeClasses[size]} rounded-full border-4 border-gray-300 flex items-center justify-center relative overflow-hidden`}
      >
        {/* Enhanced coin shine effect */}
        <motion.div
          animate={{ 
            x: isHighlighted ? [0, 30, 0] : 0,
            opacity: isHighlighted ? [0.4, 0.9, 0.4] : 0
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"
        />
        
        {/* Larger coin icon */}
        <Coins className={`${
          size === 'xlarge' ? 'w-12 h-12' : 
          size === 'large' ? 'w-10 h-10' : 
          size === 'medium' ? 'w-8 h-8' : 'w-6 h-6'
        } text-white`} />
        
        {/* Value display for coins */}
        {showValue && value && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-700 bg-white px-2 py-1 rounded shadow-lg border"
          >
            {value}
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Step-by-step calculation component
  const CalculationStep: React.FC<{ 
    step: number; 
    equation: string; 
    explanation: string; 
    show: boolean;
    delay?: number;
  }> = ({ step, equation, explanation, show, delay = 0 }) => {
    return (
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ 
          opacity: show ? 1 : 0, 
          x: show ? 0 : -50 
        }}
        transition={{ delay, duration: 0.5 }}
        className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm mb-4"
      >
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold px-3 py-1 rounded-full min-w-fit">
            Step {step}:
          </div>
          <div className="flex-1">
            <div className="text-lg font-mono text-black mb-2 bg-gray-50 rounded p-2 border text-center">
              {equation}
            </div>
            <p className="text-gray-700 text-sm">
              {explanation}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  // Animated fraction visualization with larger coins
  const FractionVisualization: React.FC<{ numerator: number; denominator: number }> = ({ 
    numerator, 
    denominator 
  }) => {
    const coins = Array.from({ length: denominator }, (_, i) => i);
    
    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl font-bold text-gray-800 mb-2"
          >
            {numerator}/{denominator}
          </motion.div>
          <div className="text-lg text-gray-600">Fraction Representation</div>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center max-w-lg">
          {coins.map((_, index) => (
            <LargeCoin
              key={index}
              isHighlighted={index < numerator}
              delay={0.8 + index * 0.15}
              size="large"
              showValue={true}
              value={index < numerator ? `${numerator}/${denominator}` : `${denominator}`}
            />
          ))}
        </div>
        
        <div className="text-center text-lg text-gray-600 font-semibold">
          {numerator} out of {denominator} coins are highlighted
        </div>
      </div>
    );
  };

  // Multiplication visualization with coins
  const MultiplicationVisualization: React.FC = () => {
    return (
      <div className="flex flex-col items-center space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            Multiply by 100
          </motion.div>
          <div className="text-lg text-gray-600">To convert fraction to percentage</div>
        </div>
        
        {/* Original fraction with coins */}
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xl font-semibold text-gray-700">Original: 1/4</div>
          <div className="flex gap-3">
            {[0, 1, 2, 3].map((index) => (
              <LargeCoin
                key={index}
                isHighlighted={index === 0}
                delay={1 + index * 0.1}
                size="medium"
                showValue={true}
                value={index === 0 ? "1" : "4"}
              />
            ))}
          </div>
        </div>
        
        {/* Multiplication process */}
        <div className="flex items-center space-x-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="text-3xl font-bold text-blue-600"
          >
            1/4
          </motion.div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.5, duration: 0.5 }}
          >
            <ArrowRight className="w-8 h-8 text-green-600" />
          </motion.div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 3, duration: 0.5 }}
            className="text-3xl font-bold text-green-600"
          >
            × 100
          </motion.div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 3.5, duration: 0.5 }}
          >
            <ArrowRight className="w-8 h-8 text-purple-600" />
          </motion.div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 4, duration: 0.5 }}
            className="text-3xl font-bold text-purple-600"
          >
            100/4
          </motion.div>
        </div>
        
        {/* Result with coins showing multiplication */}
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xl font-semibold text-gray-700">Result: 100/4</div>
          <div className="flex flex-wrap gap-2 justify-center max-w-md">
            {Array.from({ length: 8 }, (_, i) => (
              <LargeCoin
                key={i}
                isHighlighted={i < 2}
                delay={4.5 + i * 0.05}
                size="small"
                showValue={true}
                value={i < 2 ? "100" : "4"}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600 text-center">
            Each coin represents 25 (100 ÷ 4 = 25)
          </div>
        </div>
      </div>
    );
  };

  // Division visualization with coins
  const DivisionVisualization: React.FC = () => {
    return (
      <div className="flex flex-col items-center space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            Divide to Simplify
          </motion.div>
          <div className="text-lg text-gray-600">100 ÷ 4 = 25</div>
        </div>
        
        {/* Before division with coins */}
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xl font-semibold text-gray-700">Before: 100/4</div>
          <div className="flex flex-wrap gap-2 justify-center max-w-md">
            {Array.from({ length: 8 }, (_, i) => (
              <LargeCoin
                key={i}
                isHighlighted={i < 2}
                delay={1 + i * 0.05}
                size="small"
                showValue={true}
                value={i < 2 ? "100" : "4"}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600 text-center">
            We have 100 coins divided into 4 groups
          </div>
        </div>
        
        {/* Division process */}
        <div className="flex items-center space-x-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="text-3xl font-bold text-purple-600"
          >
            100/4
          </motion.div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.5, duration: 0.5 }}
          >
            <ArrowRight className="w-8 h-8 text-orange-600" />
          </motion.div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 3, duration: 0.5 }}
            className="text-3xl font-bold text-orange-600"
          >
            ÷ 4
          </motion.div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 3.5, duration: 0.5 }}
          >
            <ArrowRight className="w-8 h-8 text-red-600" />
          </motion.div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 4, duration: 0.5 }}
            className="text-3xl font-bold text-red-600"
          >
            25
          </motion.div>
        </div>
        
        {/* After division with coins */}
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xl font-semibold text-gray-700">After: 25</div>
          <div className="flex gap-3">
            {[0, 1, 2, 3].map((index) => (
              <LargeCoin
                key={index}
                isHighlighted={true}
                delay={4.5 + index * 0.1}
                size="medium"
                showValue={true}
                value="25"
              />
            ))}
          </div>
          <div className="text-sm text-gray-600 text-center">
            Each group has 25 coins (100 ÷ 4 = 25)
          </div>
        </div>
      </div>
    );
  };

  // Final percentage visualization with larger coins
  const FinalPercentageVisualization: React.FC = () => {
    const totalCoins = 100;
    const highlightedCoins = 25;
    const coins = Array.from({ length: totalCoins }, (_, i) => i);
    
    return (
      <div className="flex flex-col items-center space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-5xl font-bold text-green-600 mb-2"
          >
            25%
          </motion.div>
          <div className="text-xl text-gray-600">Final Answer</div>
        </div>
        
        <div className="text-center mb-6">
          <div className="text-2xl font-semibold text-gray-700 mb-2">
            25 out of 100 coins are highlighted
          </div>
          <div className="text-lg text-gray-600">
            This means 1/4 of the coins = 25% of all coins
          </div>
        </div>
        
        {/* Large coins showing the concept */}
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xl font-semibold text-gray-700">Visual Proof:</div>
          <div className="flex gap-4">
            {/* 1/4 representation */}
            <div className="flex flex-col items-center space-y-2">
              <div className="text-lg font-semibold text-gray-600">1/4</div>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <LargeCoin
                    key={index}
                    isHighlighted={index === 0}
                    delay={1 + index * 0.1}
                    size="large"
                    showValue={true}
                    value={index === 0 ? "1" : "4"}
                  />
                ))}
              </div>
            </div>
            
            {/* Equals sign */}
            <div className="flex items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="text-3xl font-bold text-gray-600"
              >
                =
              </motion.div>
            </div>
            
            {/* 25% representation */}
            <div className="flex flex-col items-center space-y-2">
              <div className="text-lg font-semibold text-gray-600">25%</div>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <LargeCoin
                    key={index}
                    isHighlighted={true}
                    delay={2 + index * 0.1}
                    size="large"
                    showValue={true}
                    value="25"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Full 100 coins display */}
        <div className="flex flex-col items-center space-y-4">
          <div className="text-lg font-semibold text-gray-700">All 100 coins:</div>
          <div className="flex flex-wrap gap-1 justify-center max-w-2xl">
            {coins.map((_, index) => (
              <LargeCoin
                key={index}
                isHighlighted={index < highlightedCoins}
                delay={3 + index * 0.01}
                size="small"
              />
            ))}
          </div>
          <div className="text-sm text-gray-600 text-center">
            {highlightedCoins} highlighted coins out of {totalCoins} total coins
          </div>
        </div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 4, duration: 0.5 }}
          className="flex items-center space-x-2 text-green-600"
        >
          <CheckCircle className="w-8 h-8" />
          <span className="text-xl font-semibold">Verification Complete!</span>
        </motion.div>
      </div>
    );
  };

  // Language-specific step explanations
  const stepExplanations = {
    en: {
      title: "Fraction to Percentage: 1/4 × 100 = 25%",
      steps: [
        {
          step: 1,
          equation: "1/4 = ?%",
          explanation: "Start with the fraction 1/4. We want to convert this to a percentage.",
          visual: <FractionVisualization numerator={1} denominator={4} />
        },
        {
          step: 2,
          equation: "1/4 × 100",
          explanation: "To convert a fraction to percentage, multiply by 100.",
          visual: <MultiplicationVisualization />
        },
        {
          step: 3,
          equation: "100/4 = 25",
          explanation: "Multiply numerator by 100: 1 × 100 = 100. Then divide by denominator: 100 ÷ 4 = 25.",
          visual: <DivisionVisualization />
        },
        {
          step: 4,
          equation: "Answer: 25%",
          explanation: "Final answer: 1/4 = 25%. This means 1 out of 4 coins equals 25 out of 100 coins.",
          visual: <FinalPercentageVisualization />
        }
      ]
    },
    hi: {
      title: "भिन्न से प्रतिशत: 1/4 × 100 = 25%",
      steps: [
        {
          step: 1,
          equation: "1/4 = ?%",
          explanation: "भिन्न 1/4 से शुरू करें। हम इसे प्रतिशत में बदलना चाहते हैं।",
          visual: <FractionVisualization numerator={1} denominator={4} />
        },
        {
          step: 2,
          equation: "1/4 × 100",
          explanation: "भिन्न को प्रतिशत में बदलने के लिए 100 से गुणा करें।",
          visual: <MultiplicationVisualization />
        },
        {
          step: 3,
          equation: "100/4 = 25",
          explanation: "अंश को 100 से गुणा करें: 1 × 100 = 100। फिर हर से भाग दें: 100 ÷ 4 = 25।",
          visual: <DivisionVisualization />
        },
        {
          step: 4,
          equation: "उत्तर: 25%",
          explanation: "अंतिम उत्तर: 1/4 = 25%। इसका मतलब 4 सिक्कों में से 1 सिक्का 100 सिक्कों में से 25 सिक्कों के बराबर है।",
          visual: <FinalPercentageVisualization />
        }
      ]
    },
    gu: {
      title: "અપૂર્ણાંકથી ટકાવારી: 1/4 × 100 = 25%",
      steps: [
        {
          step: 1,
          equation: "1/4 = ?%",
          explanation: "અપૂર્ણાંક 1/4 થી શરૂ કરો। અમે તેને ટકાવારીમાં બદલવા માંગીએ છીએ.",
          visual: <FractionVisualization numerator={1} denominator={4} />
        },
        {
          step: 2,
          equation: "1/4 × 100",
          explanation: "અપૂર્ણાંકને ટકાવારીમાં બદલવા માટે 100 વડે ગુણો.",
          visual: <MultiplicationVisualization />
        },
        {
          step: 3,
          equation: "100/4 = 25",
          explanation: "અંશને 100 વડે ગુણો: 1 × 100 = 100। પછી હર વડે ભાગો: 100 ÷ 4 = 25.",
          visual: <DivisionVisualization />
        },
        {
          step: 4,
          equation: "જવાબ: 25%",
          explanation: "અંતિમ જવાબ: 1/4 = 25%। આનો અર્થ 4 સિક્કામાંથી 1 સિક્કો 100 સિક્કામાંથી 25 સિક્કા બરાબર છે.",
          visual: <FinalPercentageVisualization />
        }
      ]
    }
  };

  const currentExplanation = stepExplanations[language] || stepExplanations.en;

  // Auto-advance through steps
  useEffect(() => {
    if (!showStep) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % currentExplanation.steps.length);
    }, 6000); // 6 seconds per step for better viewing

    return () => clearInterval(interval);
  }, [showStep, currentExplanation.steps.length]);

  if (!showStep) return null;

  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200/60 p-6 shadow-lg">
      {/* Title */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
          {currentExplanation.title}
        </h3>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Calculator className="w-4 h-4" />
          <span>Step-by-Step Fraction to Percentage</span>
        </div>
      </div>

      {/* Current Step Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <CalculationStep
            step={currentExplanation.steps[currentStep].step}
            equation={currentExplanation.steps[currentStep].equation}
            explanation={currentExplanation.steps[currentStep].explanation}
            show={true}
          />
          
          {/* Visual Representation */}
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {currentExplanation.steps[currentStep].visual}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Step Indicators */}
      <div className="flex justify-center space-x-2 mt-6">
        {currentExplanation.steps.map((_, index) => (
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
    </div>
  );
};

export default FractionToPercentage;



