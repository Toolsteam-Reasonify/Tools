import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Coins, Calculator, TrendingUp, DollarSign, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  number: number;
  title: string;
  formula: string;
  calculation?: string;
  explanation: string;
  details: string[];
  visualType: 'formula' | 'substitution' | 'multiplication' | 'division';
}

const SimpleInterestExplainer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [animatedValue, setAnimatedValue] = useState<number>(0);
  const [showCalculation, setShowCalculation] = useState<boolean>(false);

  const steps: Step[] = [
    {
      number: 1,
      title: "Use the simple interest formula.",
      formula: "I = (P × R × T)/100",
      explanation: "This is the formula to calculate Simple Interest",
      details: [
        "I = Interest amount we want to find",
        "P = Principal (the initial amount of money)",
        "R = Rate of interest per year (as a percentage)",
        "T = Time period (in years)"
      ],
      visualType: 'formula'
    },
    {
      number: 2,
      title: "Fill in principal, rate, and time.",
      formula: "Substitute: P=5000, R=15%, T=1",
      explanation: "Let's substitute our known values into the formula",
      details: [
        "Principal (P) = ₹5000 (the money we started with)",
        "Rate (R) = 15% per year",
        "Time (T) = 1 year",
        "Now we can calculate: I = (5000 × 15 × 1)/100"
      ],
      visualType: 'substitution'
    },
    {
      number: 3,
      title: "Multiply the values.",
      formula: "= (5000 × 15 × 1)/100",
      calculation: "= 75000/100",
      explanation: "Multiply principal, rate, and time together",
      details: [
        "First: 5000 × 15 = 75,000",
        "Then: 75,000 × 1 = 75,000",
        "This gives us: 75,000/100",
        "Now we just need to divide by 100"
      ],
      visualType: 'multiplication'
    },
    {
      number: 4,
      title: "Divide by 100 to get interest.",
      formula: "= 75000/100 = ₹750",
      explanation: "Final step - divide to get the interest amount",
      details: [
        "75,000 ÷ 100 = ₹750",
        "This is the interest earned in 1 year",
        "Total amount after 1 year = ₹5000 + ₹750 = ₹5750",
        "So you earn ₹750 as interest on ₹5000 at 15% for 1 year"
      ],
      visualType: 'division'
    }
  ];

  const slides = [
    { text: "5% means 5 out of every 100 parts", highlight: 5 },
    { text: "5 cars out of 20 cars = 25%", highlight: 5 },
    { text: "In money: 5% of ₹100 = ₹5", highlight: 5 },
    { text: "Interest grows your money over time", highlight: 5 }
  ];

  // Auto-progress lines
  useEffect(() => {
    if (currentLine < steps[currentStep].details.length) {
      const timer = setTimeout(() => {
        setCurrentLine(currentLine + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentLine, currentStep]);

  // Animate calculations
  useEffect(() => {
    setShowCalculation(false);
    setAnimatedValue(0);
    const timer = setTimeout(() => {
      setShowCalculation(true);
      if (currentStep === 2) {
        animateNumber(0, 75000, 1500);
      } else if (currentStep === 3) {
        animateNumber(0, 750, 1500);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const animateNumber = (start: number, end: number, duration: number) => {
    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(start + (end - start) * progress);
      setAnimatedValue(value);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setCurrentLine(0);
  };

  const nextSlide = () => setSlideIndex((slideIndex + 1) % slides.length);
  const prevSlide = () => setSlideIndex((slideIndex - 1 + slides.length) % slides.length);

  const renderVisual = () => {
    const step = steps[currentStep];
    
    if (step.visualType === 'formula') {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="formula"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Formula with animation */}
            <div className="flex items-center justify-center gap-4 text-3xl font-bold flex-wrap">
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-blue-600"
              >
                I
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600"
              >
                =
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-purple-600"
              >
                (
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-blue-100 px-3 py-2 rounded"
              >
                P
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-orange-500"
              >
                ×
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-green-100 px-3 py-2 rounded"
              >
                R
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-orange-500"
              >
                ×
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-yellow-100 px-3 py-2 rounded"
              >
                T
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="text-purple-600"
              >
                )
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="text-orange-500"
              >
                /
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 }}
                className="bg-red-100 px-3 py-2 rounded"
              >
                100
              </motion.span>
            </div>
            
            {/* Enhanced realistic representation */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-gray-800">Principal (P)</span>
                </div>
                <div className="flex gap-2 flex-wrap justify-center mb-3">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className={`w-12 h-12 rounded-full border-4 ${
                        true 
                          ? 'bg-blue-500 border-blue-300 shadow-lg' 
                          : 'bg-gray-200 border-gray-300'
                      } flex items-center justify-center`}
                    >
                      <Coins className="w-6 h-6 text-white" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 text-center font-semibold">₹5,000 = 10 coins</p>
                <p className="text-xs text-gray-500 text-center mt-1">The money you invest</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-green-50 rounded-lg p-6 border-2 border-green-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-gray-800">Interest (I)</span>
                </div>
                <div className="flex gap-2 flex-wrap justify-center mb-3">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className={`w-12 h-12 rounded-full border-4 ${
                        i < 2
                          ? 'bg-green-500 border-green-300 shadow-lg' 
                          : 'bg-gray-200 border-gray-300'
                      } flex items-center justify-center`}
                    >
                      <Coins className="w-6 h-6 text-white" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 text-center font-semibold">≈ ₹1,500 extra</p>
                <p className="text-xs text-gray-500 text-center mt-1">Money you earn over time</p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      );
    }
    
    if (step.visualType === 'substitution') {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="substitution"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Substituted values */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-4 text-2xl"
              >
                <span className="text-gray-700 font-semibold">P = </span>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg"
                >
                  ₹5000
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-4 text-2xl"
              >
                <span className="text-gray-700 font-semibold">R = </span>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
                >
                  15%
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
                className="flex items-center justify-center gap-4 text-2xl"
              >
                <span className="text-gray-700 font-semibold">T = </span>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.2 }}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg"
                >
                  1 year
                </motion.div>
              </motion.div>
            </div>
            
            {/* Enhanced realistic visualization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border-2 border-yellow-300 mt-6"
            >
              <div className="text-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Calculator className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                </motion.div>
                <span className="font-bold text-gray-800 text-lg">Visualizing the Amounts</span>
              </div>
              
              <div className="space-y-4">
                {/* Principal visualization */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-gray-700 font-semibold">Principal (P) = ₹5,000</span>
                  </div>
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.0 + i * 0.1 }}
                        className="w-8 h-12 bg-green-600 border-2 border-green-700 rounded-t-md"
                      />
                    ))}
                  </div>
                </motion.div>
                
                {/* Rate visualization */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Percent className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-gray-700 font-semibold">Rate (R) = 15%</span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "60px" }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="h-4 bg-blue-500 rounded-full"
                  />
                </motion.div>
                
                {/* Time visualization */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">⏱️</span>
                    </div>
                    <span className="text-gray-700 font-semibold">Time (T) = 1 year</span>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                    className="w-12 h-12 bg-purple-500 border-2 border-purple-600 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white font-bold">1</span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      );
    }
    
    if (step.visualType === 'multiplication') {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="multiplication"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Calculation display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4 text-2xl flex-wrap"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg"
              >
                5000
              </motion.div>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold"
              >
                ×
              </motion.span>
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
              >
                15
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-3xl"
              >
                =
              </motion.span>
              {showCalculation && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-orange-500 text-white px-8 py-3 rounded-lg shadow-lg font-bold"
                >
                  {animatedValue.toLocaleString()}
                </motion.div>
              )}
            </motion.div>
            
            {showCalculation && currentLine >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-4 text-xl"
              >
                <div className="bg-orange-500 text-white px-4 py-2 rounded">75,000</div>
                <span className="text-2xl">÷</span>
                <div className="bg-purple-500 text-white px-4 py-2 rounded">100</div>
              </motion.div>
            )}
            
            {/* Enhanced multiplication visualization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-200 mt-6"
            >
              <div className="text-center mb-4">
                <Calculator className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
                <span className="font-bold text-gray-800 text-lg">Breaking Down the Calculation:</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  className="bg-white rounded-lg p-4 text-center shadow-md"
                >
                  <div className="text-blue-600 font-bold mb-2 text-lg">Step 1</div>
                  <div className="text-3xl font-bold mb-2">5000</div>
                  <div className="text-sm text-gray-600 font-semibold">Principal</div>
                  <div className="mt-3 flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.9 + i * 0.1 }}
                        className="w-2 h-8 bg-blue-500 rounded"
                      />
                    ))}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.9, type: "spring" }}
                  className="bg-white rounded-lg p-4 text-center shadow-md"
                >
                  <div className="text-green-600 font-bold mb-2 text-lg">Step 2</div>
                  <div className="text-3xl font-bold mb-2">× 15</div>
                  <div className="text-sm text-gray-600 font-semibold">Rate</div>
                  <div className="mt-3 flex justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.1 }}
                      className="w-12 h-3 bg-green-500 rounded-full"
                    />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.1, type: "spring" }}
                  className="bg-white rounded-lg p-4 text-center shadow-md"
                >
                  <div className="text-orange-600 font-bold mb-2 text-lg">Result</div>
                  <div className="text-3xl font-bold mb-2">{showCalculation ? animatedValue.toLocaleString() : '...'}</div>
                  <div className="text-sm text-gray-600 font-semibold">Multiplied</div>
                  <div className="mt-3 flex justify-center gap-1">
                    {[...Array(7)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.3 + i * 0.05 }}
                        className="w-2 h-8 bg-orange-500 rounded"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      );
    }
    
    if (step.visualType === 'division') {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="division"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Division display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4 text-3xl flex-wrap"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="bg-orange-500 text-white px-8 py-4 rounded-lg shadow-lg font-bold"
              >
                75,000
              </motion.div>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold"
              >
                ÷
              </motion.span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="bg-purple-500 text-white px-8 py-4 rounded-lg shadow-lg font-bold"
              >
                100
              </motion.div>
            </motion.div>
            
            {showCalculation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                className="flex flex-col items-center gap-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.0, type: "spring" }}
                  className="text-6xl font-bold text-green-600"
                >
                  ₹{animatedValue}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="flex items-center gap-4 text-xl flex-wrap justify-center"
                >
                  <div className="bg-blue-100 px-6 py-3 rounded-lg border-2 border-blue-300">
                    Principal: ₹5000
                  </div>
                  <span className="text-3xl text-green-500 font-bold">+</span>
                  <div className="bg-green-100 px-6 py-3 rounded-lg border-2 border-green-300">
                    Interest: ₹{animatedValue}
                  </div>
                  <span className="text-3xl font-bold">=</span>
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg">
                    Total: ₹{5000 + animatedValue}
                  </div>
                </motion.div>
              </motion.div>
            )}
            
            {/* Enhanced final result visualization */}
            {showCalculation && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-300 mt-6"
              >
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <TrendingUp className="w-10 h-10 mx-auto text-green-600 mb-2" />
                  </motion.div>
                  <span className="font-bold text-gray-800 text-xl">Final Result Breakdown:</span>
                </div>
                
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 }}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md border-l-4 border-blue-500"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
                        <Coins className="w-7 h-7 text-white" />
                      </div>
                      <span className="font-bold text-gray-800 text-lg">Principal</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">₹5,000</span>
                  </motion.div>
                  
                  <div className="flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5 }}
                      className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <span className="text-white font-bold text-lg">+</span>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 }}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md border-l-4 border-green-500"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-7 h-7 text-white" />
                      </div>
                      <span className="font-bold text-gray-800 text-lg">Interest Earned</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">₹{animatedValue}</span>
                  </motion.div>
                  
                  <div className="flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.8 }}
                      className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <span className="text-white font-bold text-lg">=</span>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.0, type: "spring" }}
                    className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg shadow-lg border-2 border-white"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                        <DollarSign className="w-7 h-7 text-white" />
                      </div>
                      <span className="font-bold text-white text-xl">Total Amount</span>
                    </div>
                    <span className="text-4xl font-bold text-white">₹{5000 + animatedValue}</span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-blue-500">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 text-center border-b">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Simple Interest</h1>
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <span className="inline-block w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-white text-xs">📋</span>
              Click on any type to see step-by-step explanation
            </p>
          </div>

          <div className="p-6 border-b">
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Types</span>
            </button>
          </div>

          <div className="px-8 pt-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Simple Interest (1 year)
            </h2>
          </div>

          <div className="p-8 space-y-4">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`border-2 rounded-xl overflow-hidden transition-all cursor-pointer ${
                  currentStep === idx
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300'
                } ${idx > currentStep ? 'opacity-50' : ''}`}
                onClick={() => goToStep(idx)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{
                        scale: currentStep === idx ? 1.1 : 1,
                        backgroundColor: currentStep === idx ? '#3b82f6' : '#2563eb'
                      }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="flex-shrink-0"
                    >
                      <div className="w-24 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold">Step {step.number}:</span>
                      </div>
                    </motion.div>
                    <div className="flex-1">
                      <motion.p
                        animate={{ color: currentStep === idx ? '#1e40af' : '#374151' }}
                        className="font-semibold mb-3"
                      >
                        {step.title}
                      </motion.p>
                      <motion.div
                        animate={{
                          backgroundColor: currentStep === idx ? '#f9fafb' : '#f3f4f6'
                        }}
                        className="bg-gray-50 rounded-lg p-4 font-mono text-center border-2 border-gray-200"
                      >
                        <div className="text-lg font-semibold text-gray-800">{step.formula}</div>
                        {step.calculation && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg font-semibold text-gray-800 mt-2"
                          >
                            {step.calculation}
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {currentStep === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-6 pl-28 overflow-hidden"
                      >
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500 mb-6"
                        >
                          <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
                            <motion.span
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                            >
                              💡
                            </motion.span>
                            {step.explanation}
                          </h3>
                          <ul className="space-y-3">
                            {step.details.map((detail, i) => (
                              <AnimatePresence key={i}>
                                {i < currentLine && (
                                  <motion.li
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="flex items-start gap-3 text-gray-700"
                                  >
                                    <motion.span
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: i * 0.2 + 0.3, type: "spring" }}
                                      className="text-blue-500 font-bold text-xl mt-0"
                                    >
                                      •
                                    </motion.span>
                                    <span>{detail}</span>
                                  </motion.li>
                                )}
                              </AnimatePresence>
                            ))}
                          </ul>
                        </motion.div>
                        
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={step.visualType}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-8 border-2 border-indigo-200"
                          >
                            {renderVisual()}
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="px-8 pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={slideIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200"
              >
                <motion.h3
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-center text-gray-800 mb-6"
                >
                  {slideIndex === 1 ? "25% of Cars" : "5% of ₹100"}
                </motion.h3>

                {/* Animated visualization */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  <div className="flex justify-center gap-2 mb-4">
                    {[...Array(slideIndex === 1 ? 20 : 20)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{
                          delay: i * 0.05,
                          type: "spring",
                          stiffness: 150
                        }}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          (slideIndex === 1 && i < 5) || (slideIndex !== 1 && i < 1)
                            ? 'bg-blue-500 shadow-lg border-2 border-blue-600'
                            : 'bg-gray-200 border-2 border-gray-300'
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className={`text-2xl ${
                          (slideIndex === 1 && i < 5) || (slideIndex !== 1 && i < 1)
                            ? 'filter brightness-0 invert'
                            : 'opacity-30'
                        }`}>
                          {slideIndex === 1 ? '🚗' : '₹'}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-gray-700 font-bold text-lg mb-6"
                >
                  {slides[slideIndex].text}
                </motion.p>

                {/* Additional visualization */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center border-2 border-blue-200"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="text-4xl mb-2"
                    >
                      {slideIndex === 1 ? '🚗🚗🚗🚗🚗' : '💰'}
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-blue-600 font-bold text-2xl"
                    >
                      {slideIndex === 1 
                        ? "5 cars highlighted = 25%"
                        : slideIndex === 2
                        ? "₹5 is 5% of ₹100"
                        : slides[slideIndex].text
                      }
                    </motion.p>
                  </div>
                </motion.div>

                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-blue-50 transition-colors"
                  >
                    <ChevronLeft size={20} className="text-gray-600" />
                  </motion.button>

                  <div className="flex gap-2">
                    {slides.map((_, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSlideIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          slideIndex === idx
                            ? 'bg-blue-500 w-8'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-blue-50 transition-colors"
                  >
                    <ChevronRight size={20} className="text-gray-600" />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes coinDrop {
          0% { opacity: 0; transform: translateY(-20px); }
          50% { transform: translateY(0) scale(1.1); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes stack {
          0% { height: 0; opacity: 0; }
          100% { height: 100%; opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
        .animate-slideInLeft { animation: slideInLeft 0.6s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.6s ease-out; }
        .animate-bounceIn { animation: bounceIn 0.8s ease-out forwards; opacity: 0; }
        .animate-popIn { animation: popIn 0.6s ease-out; }
        .animate-zoomIn { animation: zoomIn 0.8s ease-out; }
        .animate-coinDrop { animation: coinDrop 0.6s ease-out; }
        .animate-stack { animation: stack 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default SimpleInterestExplainer;

