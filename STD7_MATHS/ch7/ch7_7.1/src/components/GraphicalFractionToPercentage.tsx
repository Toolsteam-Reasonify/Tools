import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Coins, Candy, Droplets, Pizza, BookOpen } from 'lucide-react';

interface GraphicalFractionToPercentageProps {
  language: 'en' | 'hi' | 'gu';
  showStep: boolean;
}

const GraphicalFractionToPercentage: React.FC<GraphicalFractionToPercentageProps> = ({ 
  language, 
  showStep 
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Realistic Object Components
  const CoinStack: React.FC<{ total: number; highlighted: number; color: string }> = ({ 
    total, 
    highlighted, 
    color 
  }) => {
    const coins = Array.from({ length: total }, (_, i) => i);
    
    return (
      <div className="flex flex-wrap gap-1 justify-center max-w-xs">
        {coins.map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              backgroundColor: index < highlighted ? color : '#e5e7eb'
            }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.3,
              type: "spring",
              stiffness: 200
            }}
            className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center"
          >
            <Coins className="w-3 h-3 text-white" />
          </motion.div>
        ))}
      </div>
    );
  };

  const CandyBowl: React.FC<{ total: number; highlighted: number; color: string }> = ({ 
    total, 
    highlighted, 
    color 
  }) => {
    const candies = Array.from({ length: total }, (_, i) => i);
    
    return (
      <div className="flex flex-wrap gap-1 justify-center max-w-xs">
        {candies.map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, y: -20 }}
            animate={{ 
              scale: 1, 
              y: 0,
              backgroundColor: index < highlighted ? color : '#f3f4f6'
            }}
            transition={{ 
              delay: index * 0.08, 
              duration: 0.4,
              type: "spring",
              stiffness: 150
            }}
            className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center"
          >
            <Candy className="w-3 h-3 text-white" />
          </motion.div>
        ))}
      </div>
    );
  };

  const WaterGlasses: React.FC<{ total: number; filled: number; color: string }> = ({ 
    total, 
    filled, 
    color 
  }) => {
    const glasses = Array.from({ length: total }, (_, i) => i);
    
    return (
      <div className="flex gap-2 justify-center">
        {glasses.map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="relative w-8 h-12 border-2 border-gray-300 rounded-b-lg"
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: index < filled ? '100%' : '0%' }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              className={`absolute bottom-0 left-0 right-0 rounded-b-md ${color}`}
            />
            <Droplets className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 text-blue-300" />
          </motion.div>
        ))}
      </div>
    );
  };

  const PizzaSlice: React.FC<{ total: number; highlighted: number; color: string }> = ({ 
    total, 
    highlighted, 
    color 
  }) => {
    const slices = Array.from({ length: total }, (_, i) => i);
    const anglePerSlice = 360 / total;
    
    return (
      <div className="relative w-32 h-32">
        <svg width="128" height="128" className="absolute inset-0">
          {slices.map((_, index) => {
            const startAngle = index * anglePerSlice;
            const endAngle = (index + 1) * anglePerSlice;
            const isHighlighted = index < highlighted;
            
            return (
              <motion.path
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                d={`M 64 64 L ${64 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)} ${64 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)} A 50 50 0 0 1 ${64 + 50 * Math.cos((endAngle - 90) * Math.PI / 180)} ${64 + 50 * Math.sin((endAngle - 90) * Math.PI / 180)} Z`}
                fill={isHighlighted ? color : '#f3f4f6'}
                stroke="#e5e7eb"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <Pizza className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-orange-600" />
      </div>
    );
  };

  const BookStack: React.FC<{ total: number; highlighted: number; color: string }> = ({ 
    total, 
    highlighted, 
    color 
  }) => {
    const books = Array.from({ length: total }, (_, i) => i);
    
    return (
      <div className="flex flex-col gap-1 justify-center">
        {books.map((_, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ 
              x: 0, 
              opacity: 1,
              backgroundColor: index < highlighted ? color : '#f3f4f6'
            }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.4,
              type: "spring",
              stiffness: 200
            }}
            className="w-16 h-4 rounded border border-gray-200 flex items-center justify-center"
          >
            <BookOpen className="w-3 h-3 text-white" />
          </motion.div>
        ))}
      </div>
    );
  };

  // Enhanced Pie Chart with Realistic Styling
  const RealisticPieChart: React.FC<{ numerator: number; denominator: number; color: string; object: string }> = ({ 
    numerator, 
    denominator, 
    color,
    object 
  }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const filledArc = (numerator / denominator) * circumference;
    const percentage = Math.round((numerator / denominator) * 100);
    
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <svg width="120" height="120" className="transform -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 314.16" }}
              animate={{ strokeDasharray: `${filledArc} 314.16` }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
          </motion.div>
        </div>
        
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="text-lg font-bold text-gray-800 mb-1"
          >
            {numerator}/{denominator}
          </motion.div>
          <div className="text-sm text-gray-600">
            {object} example
          </div>
        </div>
      </div>
    );
  };

  // Dynamic Number Highlighting Component
  const HighlightedNumber: React.FC<{ value: string | number; delay?: number }> = ({ 
    value, 
    delay = 0 
  }) => {
    return (
      <motion.span
        initial={{ scale: 1, textShadow: 'none' }}
        animate={{ 
          scale: [1, 1.2, 1],
          textShadow: ['none', '0 0 20px rgba(59, 130, 246, 0.5)', 'none']
        }}
        transition={{ 
          delay,
          duration: 1,
          repeat: Infinity,
          repeatDelay: 2
        }}
        className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border-2 border-blue-200"
      >
        {value}
      </motion.span>
    );
  };

  // Realistic Percentage Examples
  const RealisticExample: React.FC<{ 
    object: string; 
    total: number; 
    percentage: number; 
    color: string;
    icon: React.ReactNode;
  }> = ({ object, total, percentage, color, icon }) => {
    const highlighted = Math.round((percentage / 100) * total);
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2">
            {icon}
            <span className="ml-2 text-lg font-semibold text-gray-700">{object}</span>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-2">
            <HighlightedNumber value={`${percentage}%`} delay={0} /> of{' '}
            <HighlightedNumber value={total} delay={0.5} /> ={' '}
            <HighlightedNumber value={highlighted} delay={1} />
          </div>
        </div>
        
        <div className="flex justify-center mb-4">
          {object === 'Coins' && <CoinStack total={total} highlighted={highlighted} color={color} />}
          {object === 'Candies' && <CandyBowl total={total} highlighted={highlighted} color={color} />}
          {object === 'Water Glasses' && <WaterGlasses total={total} filled={highlighted} color={color} />}
          {object === 'Pizza Slices' && <PizzaSlice total={total} highlighted={highlighted} color={color} />}
          {object === 'Books' && <BookStack total={total} highlighted={highlighted} color={color} />}
        </div>
        
        <div className="flex justify-center">
          <RealisticPieChart 
            numerator={highlighted} 
            denominator={total} 
            color={color}
            object={object}
          />
        </div>
      </div>
    );
  };

  // Language-specific step explanations with realistic examples
  const stepExplanations = {
    en: {
      title: "Realistic Percentage Examples",
      steps: [
        {
          step: "Example 1:",
          equation: "25% of 40 coins = 10 coins",
          explanation: "Out of 40 coins, 25% means 10 coins are highlighted.",
          visual: <RealisticExample 
            object="Coins" 
            total={40} 
            percentage={25} 
            color="#f59e0b"
            icon={<Coins className="w-6 h-6 text-yellow-600" />}
          />
        },
        {
          step: "Example 2:",
          equation: "60% of 20 candies = 12 candies",
          explanation: "Out of 20 candies, 60% means 12 candies are selected.",
          visual: <RealisticExample 
            object="Candies" 
            total={20} 
            percentage={60} 
            color="#ef4444"
            icon={<Candy className="w-6 h-6 text-red-600" />}
          />
        },
        {
          step: "Example 3:",
          equation: "75% of 8 water glasses = 6 glasses",
          explanation: "Out of 8 water glasses, 75% means 6 glasses are filled.",
          visual: <RealisticExample 
            object="Water Glasses" 
            total={8} 
            percentage={75} 
            color="#3b82f6"
            icon={<Droplets className="w-6 h-6 text-blue-600" />}
          />
        },
        {
          step: "Example 4:",
          equation: "40% of 10 pizza slices = 4 slices",
          explanation: "Out of 10 pizza slices, 40% means 4 slices are taken.",
          visual: <RealisticExample 
            object="Pizza Slices" 
            total={10} 
            percentage={40} 
            color="#f97316"
            icon={<Pizza className="w-6 h-6 text-orange-600" />}
          />
        },
        {
          step: "Example 5:",
          equation: "80% of 15 books = 12 books",
          explanation: "Out of 15 books, 80% means 12 books are highlighted.",
          visual: <RealisticExample 
            object="Books" 
            total={15} 
            percentage={80} 
            color="#8b5cf6"
            icon={<BookOpen className="w-6 h-6 text-purple-600" />}
          />
        }
      ]
    },
    hi: {
      title: "वास्तविक प्रतिशत उदाहरण",
      steps: [
        {
          step: "उदाहरण 1:",
          equation: "40 सिक्कों में से 25% = 10 सिक्के",
          explanation: "40 सिक्कों में से 25% का मतलब 10 सिक्के चुने गए हैं।",
          visual: <RealisticExample 
            object="Coins" 
            total={40} 
            percentage={25} 
            color="#f59e0b"
            icon={<Coins className="w-6 h-6 text-yellow-600" />}
          />
        },
        {
          step: "उदाहरण 2:",
          equation: "20 कैंडी में से 60% = 12 कैंडी",
          explanation: "20 कैंडी में से 60% का मतलब 12 कैंडी चुनी गई हैं।",
          visual: <RealisticExample 
            object="Candies" 
            total={20} 
            percentage={60} 
            color="#ef4444"
            icon={<Candy className="w-6 h-6 text-red-600" />}
          />
        },
        {
          step: "उदाहरण 3:",
          equation: "8 गिलास पानी में से 75% = 6 गिलास",
          explanation: "8 गिलास पानी में से 75% का मतलब 6 गिलास भरे हैं।",
          visual: <RealisticExample 
            object="Water Glasses" 
            total={8} 
            percentage={75} 
            color="#3b82f6"
            icon={<Droplets className="w-6 h-6 text-blue-600" />}
          />
        },
        {
          step: "उदाहरण 4:",
          equation: "10 पिज्जा स्लाइस में से 40% = 4 स्लाइस",
          explanation: "10 पिज्जा स्लाइस में से 40% का मतलब 4 स्लाइस लिए गए हैं।",
          visual: <RealisticExample 
            object="Pizza Slices" 
            total={10} 
            percentage={40} 
            color="#f97316"
            icon={<Pizza className="w-6 h-6 text-orange-600" />}
          />
        },
        {
          step: "उदाहरण 5:",
          equation: "15 किताबों में से 80% = 12 किताबें",
          explanation: "15 किताबों में से 80% का मतलब 12 किताबें चुनी गई हैं।",
          visual: <RealisticExample 
            object="Books" 
            total={15} 
            percentage={80} 
            color="#8b5cf6"
            icon={<BookOpen className="w-6 h-6 text-purple-600" />}
          />
        }
      ]
    },
    gu: {
      title: "વાસ્તવિક ટકાવારી ઉદાહરણો",
      steps: [
        {
          step: "ઉદાહરણ 1:",
          equation: "40 સિક્કામાંથી 25% = 10 સિક્કા",
          explanation: "40 સિક્કામાંથી 25% નો અર્થ 10 સિક્કા પસંદ કરવામાં આવ્યા છે.",
          visual: <RealisticExample 
            object="Coins" 
            total={40} 
            percentage={25} 
            color="#f59e0b"
            icon={<Coins className="w-6 h-6 text-yellow-600" />}
          />
        },
        {
          step: "ઉદાહરણ 2:",
          equation: "20 કેન્ડીમાંથી 60% = 12 કેન્ડી",
          explanation: "20 કેન્ડીમાંથી 60% નો અર્થ 12 કેન્ડી પસંદ કરવામાં આવી છે.",
          visual: <RealisticExample 
            object="Candies" 
            total={20} 
            percentage={60} 
            color="#ef4444"
            icon={<Candy className="w-6 h-6 text-red-600" />}
          />
        },
        {
          step: "ઉદાહરણ 3:",
          equation: "8 પાણીના ગ્લાસમાંથી 75% = 6 ગ્લાસ",
          explanation: "8 પાણીના ગ્લાસમાંથી 75% નો અર્થ 6 ગ્લાસ ભરેલા છે.",
          visual: <RealisticExample 
            object="Water Glasses" 
            total={8} 
            percentage={75} 
            color="#3b82f6"
            icon={<Droplets className="w-6 h-6 text-blue-600" />}
          />
        },
        {
          step: "ઉદાહરણ 4:",
          equation: "10 પિઝ્ઝા સ્લાઇસમાંથી 40% = 4 સ્લાઇસ",
          explanation: "10 પિઝ્ઝા સ્લાઇસમાંથી 40% નો અર્થ 4 સ્લાઇસ લેવામાં આવ્યા છે.",
          visual: <RealisticExample 
            object="Pizza Slices" 
            total={10} 
            percentage={40} 
            color="#f97316"
            icon={<Pizza className="w-6 h-6 text-orange-600" />}
          />
        },
        {
          step: "ઉદાહરણ 5:",
          equation: "15 પુસ્તકોમાંથી 80% = 12 પુસ્તકો",
          explanation: "15 પુસ્તકોમાંથી 80% નો અર્થ 12 પુસ્તકો પસંદ કરવામાં આવ્યા છે.",
          visual: <RealisticExample 
            object="Books" 
            total={15} 
            percentage={80} 
            color="#8b5cf6"
            icon={<BookOpen className="w-6 h-6 text-purple-600" />}
          />
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
    }, 5000); // Increased to 5 seconds for better viewing

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
          <PieChart className="w-4 h-4" />
          <span>Interactive Realistic Learning</span>
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
          <div className="bg-white rounded-lg p-6 border border-blue-200 shadow-sm">
            <div className="flex items-start gap-6">
              {/* Step Label */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold px-4 py-2 rounded-full min-w-fit">
                {currentExplanation.steps[currentStep].step}
              </div>
              
              {/* Content */}
              <div className="flex-1">
                {/* Equation */}
                <div className="text-xl font-mono text-black mb-4 bg-gray-50 rounded-lg p-3 border text-center">
                  {currentExplanation.steps[currentStep].equation}
                </div>
                
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
                
                {/* Explanation */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-700 text-sm text-center"
                >
                  {currentExplanation.steps[currentStep].explanation}
                </motion.p>
              </div>
            </div>
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

export default GraphicalFractionToPercentage;