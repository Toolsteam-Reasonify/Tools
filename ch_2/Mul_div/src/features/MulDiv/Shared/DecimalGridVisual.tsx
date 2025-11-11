import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface DecimalGridVisualProps {
  rows: number;
  cols: number;
  shadedCells: number[];
  title: string;
  explanation: string;
  showAnimation?: boolean;
  delay?: number;
}

export function DecimalGridVisual({ 
  rows, 
  cols, 
  shadedCells, 
  title, 
  explanation, 
  showAnimation = true,
  delay = 0 
}: DecimalGridVisualProps) {
  const { t } = useLanguage();
  const [showShaded, setShowShaded] = useState(false);

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => setShowShaded(true), delay);
      return () => clearTimeout(timer);
    } else {
      setShowShaded(true);
    }
  }, [showAnimation, delay]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h4 className="text-lg font-bold text-center mb-4 text-gray-800">{title}</h4>
      <div className="flex justify-center mb-4">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: rows * cols }).map((_, i) => (
            <div
              key={i}
              className={`w-6 h-6 border border-gray-300 transition-all duration-500 ${
                showShaded && shadedCells.includes(i)
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg'
                  : 'bg-gray-100'
              }`}
              style={{ animationDelay: `${i * 0.02}s` }}
            />
          ))}
        </div>
      </div>
      <p className="text-center text-sm text-gray-600">
        {explanation}
      </p>
    </div>
  );
}

// Enhanced Grid Component for 0.1 × 0.1 demonstration
export function DecimalMultiplicationGrid() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: `${t('step')} 1: 0.1 = 1/10`,
      grid: { rows: 10, cols: 10, shaded: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
      explanation: t('step1Point1')
    },
    {
      title: `${t('step')} 2: 1/10 ${t('of')} 1/10`,
      grid: { rows: 10, cols: 10, shaded: [0] },
      explanation: t('step1Point2')
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentStepData = steps[currentStep];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gradient-to-r from-blue-200 to-purple-200">
      <div className="space-y-8">
        {/* Animated demonstration */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            <span className="text-blue-600">0.1</span>
            <span className="text-gray-500 mx-2">×</span>
            <span className="text-purple-600">0.1</span>
            <span className="text-gray-500 mx-2">=</span>
            <span className="text-green-600">0.01</span>
          </h3>
          
          <div className="flex items-center justify-center space-x-6">
            {/* First 0.1 grid */}
            <div className="text-center">
              <div className="grid grid-cols-10 gap-1 w-32 h-32 border-2 border-blue-300 rounded-lg p-1">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded transition-all duration-300 ${
                      i < 10 ? 'bg-blue-400' : 'border border-blue-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm font-bold text-blue-600 mt-2">0.1 = 1/10</p>
            </div>

            {/* Multiply sign */}
            <div className="text-2xl font-bold text-gray-500">×</div>

            {/* Second 0.1 grid */}
            <div className="text-center">
              <div className="grid grid-cols-10 gap-1 w-32 h-32 border-2 border-purple-300 rounded-lg p-1">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded transition-all duration-300 ${
                      i < 10 ? 'bg-purple-400' : 'border border-purple-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm font-bold text-purple-600 mt-2">0.1 = 1/10</p>
            </div>

            {/* Equals sign */}
            <div className="text-2xl font-bold text-gray-500">=</div>

            {/* Result 0.01 grid */}
            <div className="text-center">
              <div className="grid grid-cols-10 gap-1 w-32 h-32 border-2 border-green-300 rounded-lg p-1">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded transition-all duration-300 ${
                      i === 0 ? 'bg-green-400' : 'border border-green-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm font-bold text-green-600 mt-2">0.01 = 1/100</p>
            </div>
          </div>
        </div>

        {/* Step-by-step explanation */}
        <div className="text-center">
          <h4 className="text-xl font-bold mb-4 text-gray-800">{currentStepData.title}</h4>
          <div className="flex justify-center mb-4">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${currentStepData.grid.cols}, 1fr)` }}>
              {Array.from({ length: currentStepData.grid.rows * currentStepData.grid.cols }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 border border-gray-300 transition-all duration-500 ${
                    currentStepData.grid.shaded.includes(i)
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg'
                      : 'bg-gray-100'
                  }`}
                  style={{ animationDelay: `${i * 0.01}s` }}
                />
              ))}
            </div>
          </div>
          <p className="text-gray-600">{currentStepData.explanation}</p>
        </div>

        {/* Mathematical explanation */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-l-4 border-blue-500">
          <div className="text-center space-y-2">
            <p className="text-gray-700 font-medium">
              <span className="text-blue-600 font-bold">0.1 × 0.1</span> = <span className="text-purple-600 font-bold">1/10 × 1/10</span>
            </p>
            <p className="text-gray-700 font-medium">
              = <span className="text-green-600 font-bold">1/100</span> = <span className="text-orange-600 font-bold">0.01</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Grid for 0.2 × 0.3 demonstration
export function DecimalMultiplicationGrid23() {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gradient-to-r from-orange-200 to-red-200">
      <div className="space-y-8">
        {/* 0.2 × 0.3 demonstration */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            <span className="text-blue-600">0.2</span>
            <span className="text-gray-500 mx-2">×</span>
            <span className="text-purple-600">0.3</span>
            <span className="text-gray-500 mx-2">=</span>
            <span className="text-green-600">0.06</span>
          </h3>
          
          <div className="flex items-center justify-center space-x-6">
            {/* First 0.2 grid (2 out of 10 dots) */}
            <div className="text-center">
              <div className="grid grid-cols-5 gap-2 w-24 h-12 border-2 border-blue-300 rounded-lg p-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i < 2 ? 'bg-blue-400' : 'border-2 border-blue-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm font-bold text-blue-600 mt-2">0.2 = 2/10</p>
            </div>

            {/* Multiply sign */}
            <div className="text-2xl font-bold text-gray-500">×</div>

            {/* Second 0.3 grid (3 out of 10 dots) */}
            <div className="text-center">
              <div className="grid grid-cols-5 gap-2 w-24 h-12 border-2 border-purple-300 rounded-lg p-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i < 3 ? 'bg-purple-400' : 'border-2 border-purple-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm font-bold text-purple-600 mt-2">0.3 = 3/10</p>
            </div>

            {/* Equals sign */}
            <div className="text-2xl font-bold text-gray-500">=</div>

            {/* Result 0.06 grid (6 out of 100 dots) */}
            <div className="text-center">
              <div className="grid grid-cols-10 gap-1 w-32 h-32 border-2 border-green-300 rounded-lg p-1">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded transition-all duration-300 ${
                      i < 6 ? 'bg-green-400' : 'border border-green-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm font-bold text-green-600 mt-2">0.06 = 6/100</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
