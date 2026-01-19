import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, ArrowRight, Calculator, TrendingUp, TrendingDown, ShoppingCart, Package, Car } from 'lucide-react';

interface ComprehensiveProfitLossToolProps {
  language: 'en' | 'hi' | 'gu';
  showStep: boolean;
  // When provided, the tool will open directly on this type's steps
  defaultSelectedType?: string | null;
  // Called once after the first full cycle of steps completes
  onFirstCycleEnd?: () => void;
  // If provided, clicking Back will invoke this and parent can decide UI (e.g., show Examples grid)
  onBackToTypes?: () => void;
  // If true, do not render the colored type grid when no selection
  hideTypeGrid?: boolean;
}

const ComprehensiveProfitLossTool: React.FC<ComprehensiveProfitLossToolProps> = ({ 
  language, 
  showStep,
  defaultSelectedType = null,
  onFirstCycleEnd,
  onBackToTypes,
  hideTypeGrid
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Typewriter for line-by-line reveal (keeps layout intact)
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

  // Standard Money Component - All objects will be this size
  const StandardMoney: React.FC<{ 
    isHighlighted: boolean; 
    delay: number; 
    value?: string;
    showValue?: boolean;
    type?: 'profit' | 'loss' | 'neutral';
  }> = ({ isHighlighted, delay, value, showValue = false, type = 'neutral' }) => {
    const moneySize = 'w-12 h-12'; // Standard size for all objects
    
    const getColor = () => {
      if (type === 'profit') return '#10b981'; // green
      if (type === 'loss') return '#ef4444'; // red
      return '#6b7280'; // gray
    };

    return (
      <motion.div
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ 
          scale: 1, 
          rotate: 0, 
          opacity: 1,
          backgroundColor: isHighlighted ? getColor() : '#e5e7eb',
          boxShadow: isHighlighted ? `0 0 20px ${getColor()}40` : '0 4px 8px rgba(0,0,0,0.15)'
        }}
        transition={{ 
          delay, 
          duration: 0.8,
          type: "spring",
          stiffness: 150
        }}
        className={`${moneySize} rounded-full border-4 border-gray-300 flex items-center justify-center relative overflow-hidden`}
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

  // Shopping Cart Component - Same size as money
  const AnimatedCart: React.FC<{
    isHighlighted: boolean;
    delay: number;
    value?: string;
    showValue?: boolean;
  }> = ({ isHighlighted, delay, value, showValue = false }) => {
    const cartSize = 'w-12 h-12';

    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          backgroundColor: isHighlighted ? '#3b82f6' : '#f3f4f6',
          boxShadow: isHighlighted ? '0 0 12px rgba(59,130,246,0.45)' : '0 2px 6px rgba(0,0,0,0.12)'
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

  // Package Component - Same size as money
  const AnimatedPackage: React.FC<{
    isHighlighted: boolean;
    delay: number;
    value?: string;
    showValue?: boolean;
  }> = ({ isHighlighted, delay, value, showValue = false }) => {
    const packageSize = 'w-12 h-12';

    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          backgroundColor: isHighlighted ? '#8b5cf6' : '#f3f4f6',
          boxShadow: isHighlighted ? '0 0 12px rgba(139,92,246,0.45)' : '0 2px 6px rgba(0,0,0,0.12)'
        }}
        transition={{ 
          delay, 
          duration: 0.8,
          type: "spring",
          stiffness: 150
        }}
        className={`${packageSize} rounded-lg border-2 border-gray-300 flex items-center justify-center relative overflow-hidden`}
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

  // Car Component - Same size as money
  const AnimatedCar: React.FC<{
    isHighlighted: boolean;
    delay: number;
    value?: string;
    showValue?: boolean;
  }> = ({ isHighlighted, delay, value, showValue = false }) => {
    const carSize = 'w-12 h-12';

    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          backgroundColor: isHighlighted ? '#f59e0b' : '#f3f4f6',
          boxShadow: isHighlighted ? '0 0 12px rgba(245,158,11,0.45)' : '0 2px 6px rgba(0,0,0,0.12)'
        }}
        transition={{ 
          delay, 
          duration: 0.8,
          type: "spring",
          stiffness: 150
        }}
        className={`${carSize} rounded-lg border-2 border-gray-300 flex items-center justify-center relative overflow-hidden`}
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
        
        <Car className="w-6 h-6 text-white" />
        
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

  // Language-specific profit/loss calculation types for Topic 7.3
  const calculationTypes = {
    en: [
      {
        id: 'profit_calculation',
        title: 'Profit Calculation',
        equation: 'CP = ₹100, SP = ₹120, Profit = ₹20',
        icon: '💰',
        color: 'bg-green-500',
        description: 'Calculate profit when selling price is higher than cost price'
      },
      {
        id: 'loss_calculation',
        title: 'Loss Calculation',
        equation: 'CP = ₹150, SP = ₹120, Loss = ₹30',
        icon: '📉',
        color: 'bg-red-500',
        description: 'Calculate loss when cost price is higher than selling price'
      },
      {
        id: 'profit_percentage',
        title: 'Profit Percentage',
        equation: 'CP = ₹200, Profit = ₹40, Profit % = 20%',
        icon: '📊',
        color: 'bg-blue-500',
        description: 'Calculate profit percentage based on cost price'
      },
      {
        id: 'loss_percentage',
        title: 'Loss Percentage',
        equation: 'CP = ₹300, Loss = ₹45, Loss % = 15%',
        icon: '📈',
        color: 'bg-orange-500',
        description: 'Calculate loss percentage based on cost price'
      }
    ],
    hi: [
      {
        id: 'profit_calculation',
        title: 'लाभ गणना',
        equation: 'CP = ₹100, SP = ₹120, लाभ = ₹20',
        icon: '💰',
        color: 'bg-green-500',
        description: 'जब विक्रय मूल्य क्रय मूल्य से अधिक हो तो लाभ की गणना करें'
      },
      {
        id: 'loss_calculation',
        title: 'हानि गणना',
        equation: 'CP = ₹150, SP = ₹120, हानि = ₹30',
        icon: '📉',
        color: 'bg-red-500',
        description: 'जब क्रय मूल्य विक्रय मूल्य से अधिक हो तो हानि की गणना करें'
      },
      {
        id: 'profit_percentage',
        title: 'लाभ प्रतिशत',
        equation: 'CP = ₹200, लाभ = ₹40, लाभ % = 20%',
        icon: '📊',
        color: 'bg-blue-500',
        description: 'क्रय मूल्य के आधार पर लाभ प्रतिशत की गणना करें'
      },
      {
        id: 'loss_percentage',
        title: 'हानि प्रतिशत',
        equation: 'CP = ₹300, हानि = ₹45, हानि % = 15%',
        icon: '📈',
        color: 'bg-orange-500',
        description: 'क्रय मूल्य के आधार पर हानि प्रतिशत की गणना करें'
      }
    ],
    gu: [
      {
        id: 'profit_calculation',
        title: 'નફો ગણતરી',
        equation: 'CP = ₹100, SP = ₹120, નફો = ₹20',
        icon: '💰',
        color: 'bg-green-500',
        description: 'જ્યારે વિક્રય મૂલ્ય ક્રય મૂલ્ય કરતાં વધારે હોય ત્યારે નફો ગણો'
      },
      {
        id: 'loss_calculation',
        title: 'નુકસાન ગણતરી',
        equation: 'CP = ₹150, SP = ₹120, નુકસાન = ₹30',
        icon: '📉',
        color: 'bg-red-500',
        description: 'જ્યારે ક્રય મૂલ્ય વિક્રય મૂલ્ય કરતાં વધારે હોય ત્યારે નુકસાન ગણો'
      },
      {
        id: 'profit_percentage',
        title: 'નફો ટકાવારી',
        equation: 'CP = ₹200, નફો = ₹40, નફો % = 20%',
        icon: '📊',
        color: 'bg-blue-500',
        description: 'ક્રય મૂલ્યના આધારે નફો ટકાવારી ગણો'
      },
      {
        id: 'loss_percentage',
        title: 'નુકસાન ટકાવારી',
        equation: 'CP = ₹300, નુકસાન = ₹45, નુકસાન % = 15%',
        icon: '📈',
        color: 'bg-orange-500',
        description: 'ક્રય મૂલ્યના આધારે નુકસાન ટકાવારી ગણો'
      }
    ]
  };

  // Step-by-step explanations for each calculation type
  const stepExplanations = {
    en: {
      profit_calculation: {
        title: "Profit Calculation: CP = ₹100, SP = ₹120, Profit = ₹20",
        steps: [
          {
            step: 1,
            equation: "CP = ₹100, SP = ₹120",
            explanation: "Start with the given values: Cost Price (CP) is ₹100 and Selling Price (SP) is ₹120.",
            visual: (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4">
                  <AnimatedCart
                    isHighlighted={true}
                    delay={0}
                    showValue={true}
                    value="CP ₹100"
                  />
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.5}
                    showValue={true}
                    value="SP ₹120"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">Cost Price → Selling Price</div>
              </div>
            )
          },
          {
            step: 2,
            equation: "Profit = SP - CP",
            explanation: "Profit is calculated by subtracting Cost Price from Selling Price.",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-bold text-green-600">₹120</div>
                  <ArrowRight className="w-6 h-6 text-red-600" />
                  <div className="text-xl font-bold text-red-600">- ₹100</div>
                  <ArrowRight className="w-6 h-6 text-blue-600" />
                  <div className="text-xl font-bold text-blue-600">= ₹20</div>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.2}
                    showValue={true}
                    value="₹20"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">Profit Amount</div>
              </div>
            )
          },
          {
            step: 3,
            equation: "Answer: ₹20 profit",
            explanation: "The shopkeeper makes a profit of ₹20 by selling the item for ₹120 when it cost ₹100.",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="text-3xl font-bold text-green-600">₹20 Profit</div>
                <div className="flex items-center space-x-2 text-green-600">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-lg font-semibold">Profit Made!</span>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.3}
                    showValue={true}
                    value="₹20"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">Final Answer</div>
              </div>
            )
          }
        ]
      },
      loss_calculation: {
        title: "Loss Calculation: CP = ₹150, SP = ₹120, Loss = ₹30",
        steps: [
          {
            step: 1,
            equation: "CP = ₹150, SP = ₹120",
            explanation: "Start with the given values: Cost Price (CP) is ₹150 and Selling Price (SP) is ₹120.",
            visual: (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4">
                  <AnimatedCart
                    isHighlighted={true}
                    delay={0}
                    showValue={true}
                    value="CP ₹150"
                  />
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.5}
                    showValue={true}
                    value="SP ₹120"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">Cost Price → Selling Price</div>
              </div>
            )
          },
          {
            step: 2,
            equation: "Loss = CP - SP",
            explanation: "Loss is calculated by subtracting Selling Price from Cost Price.",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-bold text-red-600">₹150</div>
                  <ArrowRight className="w-6 h-6 text-green-600" />
                  <div className="text-xl font-bold text-green-600">- ₹120</div>
                  <ArrowRight className="w-6 h-6 text-orange-600" />
                  <div className="text-xl font-bold text-orange-600">= ₹30</div>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.2}
                    showValue={true}
                    value="₹30"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">Loss Amount</div>
              </div>
            )
          },
          {
            step: 3,
            equation: "Answer: ₹30 loss",
            explanation: "The seller incurs a loss of ₹30 by selling the item for ₹120 when it cost ₹150.",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="text-3xl font-bold text-red-600">₹30 Loss</div>
                <div className="flex items-center space-x-2 text-red-600">
                  <TrendingDown className="w-6 h-6" />
                  <span className="text-lg font-semibold">Loss Incurred!</span>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.3}
                    showValue={true}
                    value="₹30"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">Final Answer</div>
              </div>
            )
          }
        ]
      },
      profit_percentage: {
        title: "Profit Percentage: CP = ₹200, Profit = ₹40, Profit % = 20%",
        steps: [
          {
            step: 1,
            equation: "CP = ₹200, Profit = ₹40",
            explanation: "Start with the given values: Cost Price (CP) is ₹200 and Profit is ₹40.",
            visual: (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4">
                  <AnimatedPackage
                    isHighlighted={true}
                    delay={0}
                    showValue={true}
                    value="CP ₹200"
                  />
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.5}
                    showValue={true}
                    value="Profit ₹40"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">Cost Price → Profit Amount</div>
              </div>
            )
          },
          {
            step: 2,
            equation: "Profit % = (Profit / CP) × 100",
            explanation: "Profit percentage is calculated by dividing profit by cost price and multiplying by 100.",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-bold text-blue-600">₹40</div>
                  <ArrowRight className="w-6 h-6 text-red-600" />
                  <div className="text-xl font-bold text-red-600">÷ ₹200</div>
                  <ArrowRight className="w-6 h-6 text-green-600" />
                  <div className="text-xl font-bold text-green-600">× 100</div>
                  <ArrowRight className="w-6 h-6 text-purple-600" />
                  <div className="text-xl font-bold text-purple-600">= 20%</div>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.2}
                    showValue={true}
                    value="20%"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">Profit Percentage</div>
              </div>
            )
          },
          {
            step: 3,
            equation: "Answer: 20% profit",
            explanation: "The profit percentage is 20%, meaning the seller makes 20% profit on the cost price.",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="text-3xl font-bold text-blue-600">20% Profit</div>
                <div className="flex items-center space-x-2 text-blue-600">
                  <Calculator className="w-6 h-6" />
                  <span className="text-lg font-semibold">Profit Percentage!</span>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.3}
                    showValue={true}
                    value="20%"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">Final Answer</div>
              </div>
            )
          }
        ]
      },
      loss_percentage: {
        title: "Loss Percentage: CP = ₹300, Loss = ₹45, Loss % = 15%",
        steps: [
          {
            step: 1,
            equation: "CP = ₹300, Loss = ₹45",
            explanation: "Start with the given values: Cost Price (CP) is ₹300 and Loss is ₹45.",
            visual: (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4">
                  <AnimatedCar
                    isHighlighted={true}
                    delay={0}
                    showValue={true}
                    value="CP ₹300"
                  />
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.5}
                    showValue={true}
                    value="Loss ₹45"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">Cost Price → Loss Amount</div>
              </div>
            )
          },
          {
            step: 2,
            equation: "Loss % = (Loss / CP) × 100",
            explanation: "Loss percentage is calculated by dividing loss by cost price and multiplying by 100.",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-bold text-orange-600">₹45</div>
                  <ArrowRight className="w-6 h-6 text-red-600" />
                  <div className="text-xl font-bold text-red-600">÷ ₹300</div>
                  <ArrowRight className="w-6 h-6 text-green-600" />
                  <div className="text-xl font-bold text-green-600">× 100</div>
                  <ArrowRight className="w-6 h-6 text-purple-600" />
                  <div className="text-xl font-bold text-purple-600">= 15%</div>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.2}
                    showValue={true}
                    value="15%"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">Loss Percentage</div>
              </div>
            )
          },
          {
            step: 3,
            equation: "Answer: 15% loss",
            explanation: "The loss percentage is 15%, meaning the seller incurs 15% loss on the cost price.",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="text-3xl font-bold text-orange-600">15% Loss</div>
                <div className="flex items-center space-x-2 text-orange-600">
                  <Calculator className="w-6 h-6" />
                  <span className="text-lg font-semibold">Loss Percentage!</span>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.3}
                    showValue={true}
                    value="15%"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">Final Answer</div>
              </div>
            )
          }
        ]
      }
    },
    hi: {
      profit_calculation: {
        title: "लाभ गणना: CP = ₹100, SP = ₹120, लाभ = ₹20",
        steps: [
          {
            step: 1,
            equation: "CP = ₹100, SP = ₹120",
            explanation: "दिए गए मूल्यों से शुरू करें: क्रय मूल्य (CP) ₹100 है और विक्रय मूल्य (SP) ₹120 है।",
            visual: (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4">
                  <AnimatedCart
                    isHighlighted={true}
                    delay={0}
                    showValue={true}
                    value="CP ₹100"
                  />
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.5}
                    showValue={true}
                    value="SP ₹120"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">क्रय मूल्य → विक्रय मूल्य</div>
              </div>
            )
          },
          {
            step: 2,
            equation: "लाभ = SP - CP",
            explanation: "लाभ की गणना विक्रय मूल्य में से क्रय मूल्य घटाकर की जाती है।",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-bold text-green-600">₹120</div>
                  <ArrowRight className="w-6 h-6 text-red-600" />
                  <div className="text-xl font-bold text-red-600">- ₹100</div>
                  <ArrowRight className="w-6 h-6 text-blue-600" />
                  <div className="text-xl font-bold text-blue-600">= ₹20</div>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.2}
                    showValue={true}
                    value="₹20"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">लाभ राशि</div>
              </div>
            )
          },
          {
            step: 3,
            equation: "उत्तर: ₹20 लाभ",
            explanation: "दुकानदार ₹100 की लागत वाली वस्तु को ₹120 में बेचकर ₹20 का लाभ कमाता है।",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="text-3xl font-bold text-green-600">₹20 लाभ</div>
                <div className="flex items-center space-x-2 text-green-600">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-lg font-semibold">लाभ हुआ!</span>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.3}
                    showValue={true}
                    value="₹20"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">अंतिम उत्तर</div>
              </div>
            )
          }
        ]
      },
      loss_calculation: {
        title: "हानि गणना: CP = ₹150, SP = ₹120, हानि = ₹30",
        steps: [
          {
            step: 1,
            equation: "CP = ₹150, SP = ₹120",
            explanation: "दिए गए मूल्यों से शुरू करें: क्रय मूल्य (CP) ₹150 है और विक्रय मूल्य (SP) ₹120 है।",
            visual: (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4">
                  <AnimatedCart
                    isHighlighted={true}
                    delay={0}
                    showValue={true}
                    value="CP ₹150"
                  />
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.5}
                    showValue={true}
                    value="SP ₹120"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">क्रय मूल्य → विक्रय मूल्य</div>
              </div>
            )
          },
          {
            step: 2,
            equation: "हानि = CP - SP",
            explanation: "हानि की गणना क्रय मूल्य में से विक्रय मूल्य घटाकर की जाती है।",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-bold text-red-600">₹150</div>
                  <ArrowRight className="w-6 h-6 text-green-600" />
                  <div className="text-xl font-bold text-green-600">- ₹120</div>
                  <ArrowRight className="w-6 h-6 text-orange-600" />
                  <div className="text-xl font-bold text-orange-600">= ₹30</div>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.2}
                    showValue={true}
                    value="₹30"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">हानि राशि</div>
              </div>
            )
          },
          {
            step: 3,
            equation: "उत्तर: ₹30 हानि",
            explanation: "विक्रेता ₹150 की लागत वाली वस्तु को ₹120 में बेचकर ₹30 की हानि उठाता है।",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="text-3xl font-bold text-red-600">₹30 हानि</div>
                <div className="flex items-center space-x-2 text-red-600">
                  <TrendingDown className="w-6 h-6" />
                  <span className="text-lg font-semibold">हानि हुई!</span>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.3}
                    showValue={true}
                    value="₹30"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">अंतिम उत्तर</div>
              </div>
            )
          }
        ]
      },
      profit_percentage: {
        title: "लाभ प्रतिशत: CP = ₹200, लाभ = ₹40, लाभ % = 20%",
        steps: [
          {
            step: 1,
            equation: "CP = ₹200, लाभ = ₹40",
            explanation: "दिए गए मूल्यों से शुरू करें: क्रय मूल्य (CP) ₹200 है और लाभ ₹40 है।",
            visual: (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4">
                  <AnimatedPackage
                    isHighlighted={true}
                    delay={0}
                    showValue={true}
                    value="CP ₹200"
                  />
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.5}
                    showValue={true}
                    value="लाभ ₹40"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">क्रय मूल्य → लाभ राशि</div>
              </div>
            )
          },
          {
            step: 2,
            equation: "लाभ % = (लाभ / CP) × 100",
            explanation: "लाभ प्रतिशत की गणना लाभ को क्रय मूल्य से भाग देकर 100 से गुणा करके की जाती है।",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-bold text-blue-600">₹40</div>
                  <ArrowRight className="w-6 h-6 text-red-600" />
                  <div className="text-xl font-bold text-red-600">÷ ₹200</div>
                  <ArrowRight className="w-6 h-6 text-green-600" />
                  <div className="text-xl font-bold text-green-600">× 100</div>
                  <ArrowRight className="w-6 h-6 text-purple-600" />
                  <div className="text-xl font-bold text-purple-600">= 20%</div>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.2}
                    showValue={true}
                    value="20%"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">लाभ प्रतिशत</div>
              </div>
            )
          },
          {
            step: 3,
            equation: "उत्तर: 20% लाभ",
            explanation: "लाभ प्रतिशत 20% है, अर्थात विक्रेता क्रय मूल्य पर 20% लाभ कमाता है।",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="text-3xl font-bold text-blue-600">20% लाभ</div>
                <div className="flex items-center space-x-2 text-blue-600">
                  <Calculator className="w-6 h-6" />
                  <span className="text-lg font-semibold">लाभ प्रतिशत!</span>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.3}
                    showValue={true}
                    value="20%"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">अंतिम उत्तर</div>
              </div>
            )
          }
        ]
      },
      loss_percentage: {
        title: "हानि प्रतिशत: CP = ₹300, हानि = ₹45, हानि % = 15%",
        steps: [
          {
            step: 1,
            equation: "CP = ₹300, हानि = ₹45",
            explanation: "दिए गए मूल्यों से शुरू करें: क्रय मूल्य (CP) ₹300 है और हानि ₹45 है।",
            visual: (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4">
                  <AnimatedCar
                    isHighlighted={true}
                    delay={0}
                    showValue={true}
                    value="CP ₹300"
                  />
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.5}
                    showValue={true}
                    value="हानि ₹45"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">क्रय मूल्य → हानि राशि</div>
              </div>
            )
          },
          {
            step: 2,
            equation: "हानि % = (हानि / CP) × 100",
            explanation: "हानि प्रतिशत की गणना हानि को क्रय मूल्य से भाग देकर 100 से गुणा करके की जाती है।",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-bold text-orange-600">₹45</div>
                  <ArrowRight className="w-6 h-6 text-red-600" />
                  <div className="text-xl font-bold text-red-600">÷ ₹300</div>
                  <ArrowRight className="w-6 h-6 text-green-600" />
                  <div className="text-xl font-bold text-green-600">× 100</div>
                  <ArrowRight className="w-6 h-6 text-purple-600" />
                  <div className="text-xl font-bold text-purple-600">= 15%</div>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.2}
                    showValue={true}
                    value="15%"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">हानि प्रतिशत</div>
              </div>
            )
          },
          {
            step: 3,
            equation: "उत्तर: 15% हानि",
            explanation: "हानि प्रतिशत 15% है, अर्थात विक्रेता क्रय मूल्य पर 15% हानि उठाता है।",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="text-3xl font-bold text-orange-600">15% हानि</div>
                <div className="flex items-center space-x-2 text-orange-600">
                  <Calculator className="w-6 h-6" />
                  <span className="text-lg font-semibold">हानि प्रतिशत!</span>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.3}
                    showValue={true}
                    value="15%"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">अंतिम उत्तर</div>
              </div>
            )
          }
        ]
      }
    },
    gu: {
      profit_calculation: {
        title: "નફો ગણતરી: CP = ₹100, SP = ₹120, નફો = ₹20",
        steps: [
          {
            step: 1,
            equation: "CP = ₹100, SP = ₹120",
            explanation: "આપેલ મૂલ્યો સાથે શરૂ કરો: ક્રય મૂલ્ય (CP) ₹100 છે અને વિક્રય મૂલ્ય (SP) ₹120 છે।",
            visual: (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4">
                  <AnimatedCart
                    isHighlighted={true}
                    delay={0}
                    showValue={true}
                    value="CP ₹100"
                  />
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.5}
                    showValue={true}
                    value="SP ₹120"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">ક્રય મૂલ્ય → વિક્રય મૂલ્ય</div>
              </div>
            )
          },
          {
            step: 2,
            equation: "નફો = SP - CP",
            explanation: "નફાની ગણતરી વિક્રય મૂલ્યમાંથી ક્રય મૂલ્ય બાદ કરીને કરવામાં આવે છે।",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-bold text-green-600">₹120</div>
                  <ArrowRight className="w-6 h-6 text-red-600" />
                  <div className="text-xl font-bold text-red-600">- ₹100</div>
                  <ArrowRight className="w-6 h-6 text-blue-600" />
                  <div className="text-xl font-bold text-blue-600">= ₹20</div>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.2}
                    showValue={true}
                    value="₹20"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">નફો રકમ</div>
              </div>
            )
          },
          {
            step: 3,
            equation: "જવાબ: ₹20 નફો",
            explanation: "દુકાનદાર ₹100 ની લાગત વાળી વસ્તુને ₹120 માં વેચીને ₹20 નો નફો કમાય છે।",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="text-3xl font-bold text-green-600">₹20 નફો</div>
                <div className="flex items-center space-x-2 text-green-600">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-lg font-semibold">નફો થયો!</span>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.3}
                    showValue={true}
                    value="₹20"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">અંતિમ જવાબ</div>
              </div>
            )
          }
        ]
      },
      loss_calculation: {
        title: "નુકસાન ગણતરી: CP = ₹150, SP = ₹120, નુકસાન = ₹30",
        steps: [
          {
            step: 1,
            equation: "CP = ₹150, SP = ₹120",
            explanation: "આપેલ મૂલ્યો સાથે શરૂ કરો: ક્રય મૂલ્ય (CP) ₹150 છે અને વિક્રય મૂલ્ય (SP) ₹120 છે।",
            visual: (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4">
                  <AnimatedCart
                    isHighlighted={true}
                    delay={0}
                    showValue={true}
                    value="CP ₹150"
                  />
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.5}
                    showValue={true}
                    value="SP ₹120"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">ક્રય મૂલ્ય → વિક્રય મૂલ્ય</div>
              </div>
            )
          },
          {
            step: 2,
            equation: "નુકસાન = CP - SP",
            explanation: "નુકસાનની ગણતરી ક્રય મૂલ્યમાંથી વિક્રય મૂલ્ય બાદ કરીને કરવામાં આવે છે।",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-bold text-red-600">₹150</div>
                  <ArrowRight className="w-6 h-6 text-green-600" />
                  <div className="text-xl font-bold text-green-600">- ₹120</div>
                  <ArrowRight className="w-6 h-6 text-orange-600" />
                  <div className="text-xl font-bold text-orange-600">= ₹30</div>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.2}
                    showValue={true}
                    value="₹30"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">નુકસાન રકમ</div>
              </div>
            )
          },
          {
            step: 3,
            equation: "જવાબ: ₹30 નુકસાન",
            explanation: "વિક્રેતા ₹150 ની લાગત વાળી વસ્તુને ₹120 માં વેચીને ₹30 નું નુકસાન ઉઠાવે છે।",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="text-3xl font-bold text-red-600">₹30 નુકસાન</div>
                <div className="flex items-center space-x-2 text-red-600">
                  <TrendingDown className="w-6 h-6" />
                  <span className="text-lg font-semibold">નુકસાન થયું!</span>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.3}
                    showValue={true}
                    value="₹30"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">અંતિમ જવાબ</div>
              </div>
            )
          }
        ]
      },
      profit_percentage: {
        title: "નફો ટકાવારી: CP = ₹200, નફો = ₹40, નફો % = 20%",
        steps: [
          {
            step: 1,
            equation: "CP = ₹200, નફો = ₹40",
            explanation: "આપેલ મૂલ્યો સાથે શરૂ કરો: ક્રય મૂલ્ય (CP) ₹200 છે અને નફો ₹40 છે।",
            visual: (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4">
                  <AnimatedPackage
                    isHighlighted={true}
                    delay={0}
                    showValue={true}
                    value="CP ₹200"
                  />
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.5}
                    showValue={true}
                    value="નફો ₹40"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">ક્રય મૂલ્ય → નફો રકમ</div>
              </div>
            )
          },
          {
            step: 2,
            equation: "નફો % = (નફો / CP) × 100",
            explanation: "નફો ટકાવારીની ગણતરી નફાને ક્રય મૂલ્ય વડે ભાગીને 100 વડે ગુણીને કરવામાં આવે છે।",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-bold text-blue-600">₹40</div>
                  <ArrowRight className="w-6 h-6 text-red-600" />
                  <div className="text-xl font-bold text-red-600">÷ ₹200</div>
                  <ArrowRight className="w-6 h-6 text-green-600" />
                  <div className="text-xl font-bold text-green-600">× 100</div>
                  <ArrowRight className="w-6 h-6 text-purple-600" />
                  <div className="text-xl font-bold text-purple-600">= 20%</div>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.2}
                    showValue={true}
                    value="20%"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">નફો ટકાવારી</div>
              </div>
            )
          },
          {
            step: 3,
            equation: "જવાબ: 20% નફો",
            explanation: "નફો ટકાવારી 20% છે, એટલે કે વિક્રેતા ક્રય મૂલ્ય પર 20% નફો કમાય છે।",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="text-3xl font-bold text-blue-600">20% નફો</div>
                <div className="flex items-center space-x-2 text-blue-600">
                  <Calculator className="w-6 h-6" />
                  <span className="text-lg font-semibold">નફો ટકાવારી!</span>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.3}
                    showValue={true}
                    value="20%"
                    type="profit"
                  />
                </div>
                <div className="text-sm text-gray-600">અંતિમ જવાબ</div>
              </div>
            )
          }
        ]
      },
      loss_percentage: {
        title: "નુકસાન ટકાવારી: CP = ₹300, નુકસાન = ₹45, નુકસાન % = 15%",
        steps: [
          {
            step: 1,
            equation: "CP = ₹300, નુકસાન = ₹45",
            explanation: "આપેલ મૂલ્યો સાથે શરૂ કરો: ક્રય મૂલ્ય (CP) ₹300 છે અને નુકસાન ₹45 છે।",
            visual: (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4">
                  <AnimatedCar
                    isHighlighted={true}
                    delay={0}
                    showValue={true}
                    value="CP ₹300"
                  />
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.5}
                    showValue={true}
                    value="નુકસાન ₹45"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">ક્રય મૂલ્ય → નુકસાન રકમ</div>
              </div>
            )
          },
          {
            step: 2,
            equation: "નુકસાન % = (નુકસાન / CP) × 100",
            explanation: "નુકસાન ટકાવારીની ગણતરી નુકસાનને ક્રય મૂલ્ય વડે ભાગીને 100 વડે ગુણીને કરવામાં આવે છે।",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-bold text-orange-600">₹45</div>
                  <ArrowRight className="w-6 h-6 text-red-600" />
                  <div className="text-xl font-bold text-red-600">÷ ₹300</div>
                  <ArrowRight className="w-6 h-6 text-green-600" />
                  <div className="text-xl font-bold text-green-600">× 100</div>
                  <ArrowRight className="w-6 h-6 text-purple-600" />
                  <div className="text-xl font-bold text-purple-600">= 15%</div>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.2}
                    showValue={true}
                    value="15%"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">નુકસાન ટકાવારી</div>
              </div>
            )
          },
          {
            step: 3,
            equation: "જવાબ: 15% નુકસાન",
            explanation: "નુકસાન ટકાવારી 15% છે, એટલે કે વિક્રેતા ક્રય મૂલ્ય પર 15% નુકસાન ઉઠાવે છે।",
            visual: (
              <div className="flex flex-col items-center space-y-3">
                <div className="text-3xl font-bold text-orange-600">15% નુકસાન</div>
                <div className="flex items-center space-x-2 text-orange-600">
                  <Calculator className="w-6 h-6" />
                  <span className="text-lg font-semibold">નુકસાન ટકાવારી!</span>
                </div>
                <div className="flex gap-2">
                  <StandardMoney
                    isHighlighted={true}
                    delay={0.3}
                    showValue={true}
                    value="15%"
                    type="loss"
                  />
                </div>
                <div className="text-sm text-gray-600">અંતિમ જવાબ</div>
              </div>
            )
          }
        ]
      }
    }
  };

  const currentTypes = calculationTypes[language] || calculationTypes.en;
  const currentExplanations = stepExplanations[language] || stepExplanations.en;

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
          {language === 'en' ? 'Prices Related to an Item or Buying and Selling' : 
           language === 'hi' ? 'किसी वस्तु से संबंधित मूल्य या खरीद और बिक्री' : 
           'કોઈ વસ્તુ સાથે સંબંધિત કિંમતો અથવા ખરીદી અને વેચાણ'}
        </h3>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Calculator className="w-4 h-4" />
          <span>
            {language === 'en' ? 'Click on any type to see step-by-step explanation' :
             language === 'hi' ? 'किसी भी प्रकार पर क्लिक करें चरण-दर-चरण व्याख्या देखने के लिए' :
             'કોઈપણ પ્રકાર પર ક્લિક કરો પગલું-દર-પગલું સમજાવવા માટે'}
          </span>
        </div>
      </div>

      {!selectedType ? (
        /* Main Grid of Calculation Types */
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
              {language === 'en' ? 'Back to Types' :
               language === 'hi' ? 'प्रकारों पर वापस जाएं' :
               'પ્રકારો પર પાછા જાઓ'}
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
                  <div className="flex justify-center mb-4">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    >
                      {currentStepData.visual}
                    </motion.div>
                  </div>

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

export default ComprehensiveProfitLossTool;