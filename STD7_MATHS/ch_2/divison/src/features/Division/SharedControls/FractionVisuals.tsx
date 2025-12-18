import { useState, useEffect } from 'react';

// Animated Fraction Display Component
export function AnimatedFraction({ 
  numerator, 
  denominator, 
  isHighlighted = false, 
  delay = 0,
  size = 'normal'
}: { 
  numerator: number; 
  denominator: number; 
  isHighlighted?: boolean; 
  delay?: number;
  size?: 'small' | 'normal' | 'large';
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const sizeClasses = {
    small: 'text-lg',
    normal: 'text-2xl',
    large: 'text-4xl'
  };

  return (
    <div className={`fraction-grow transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
      <div className={`relative ${isHighlighted ? 'ring-4 ring-yellow-400 rounded-lg p-2' : ''}`}>
        <div className="flex flex-col items-center">
          {/* Numerator */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-400 rounded-lg p-3 mb-1 shadow-lg">
            <span className={`font-bold text-blue-800 ${sizeClasses[size]}`}>{numerator}</span>
          </div>
          
          {/* Fraction line */}
          <div className="w-16 h-1 bg-gray-600 my-1"></div>
          
          {/* Denominator */}
          <div className="bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-400 rounded-lg p-3 shadow-lg">
            <span className={`font-bold text-green-800 ${sizeClasses[size]}`}>{denominator}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Circle Division Visual Component
export function CircleDivisionVisual({ 
  whole, 
  parts, 
  delay = 0,
  showLabels = true 
}: { 
  whole: number; 
  parts: number; 
  delay?: number;
  showLabels?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`circle-grow transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
      <div className="flex items-center justify-center space-x-4">
        {Array.from({ length: whole }, (_, i) => (
          <div key={i} className="text-center">
            <svg width="80" height="80" className="transform transition-all duration-300 hover:scale-110">
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeDasharray="2,2"
              />
              {/* Division lines */}
              {parts === 2 && (
                <line x1="5" y1="40" x2="75" y2="40" stroke="#ef4444" strokeWidth="2" />
              )}
              {parts === 4 && (
                <>
                  <line x1="5" y1="40" x2="75" y2="40" stroke="#ef4444" strokeWidth="2" />
                  <line x1="40" y1="5" x2="40" y2="75" stroke="#ef4444" strokeWidth="2" />
                </>
              )}
              {parts === 3 && (
                <>
                  <path d="M 40 5 L 75 40 L 40 75 Z" stroke="#ef4444" strokeWidth="2" fill="none" />
                </>
              )}
              {/* Fill one part */}
              {parts === 2 && (
                <path
                  d="M 5 40 A 35 35 0 0 0 75 40 L 40 40 Z"
                  fill="#60a5fa"
                  fillOpacity="0.7"
                />
              )}
              {parts === 4 && (
                <path
                  d="M 40 5 A 35 35 0 0 1 75 40 L 40 40 Z"
                  fill="#60a5fa"
                  fillOpacity="0.7"
                />
              )}
              {parts === 3 && (
                <path
                  d="M 40 5 L 75 40 L 40 40 Z"
                  fill="#60a5fa"
                  fillOpacity="0.7"
                />
              )}
            </svg>
            {showLabels && (
              <div className="text-center mt-2">
                <span className="text-sm font-bold text-gray-700">1/{parts}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Division Equation Visual Component
export function DivisionEquationVisual({ 
  dividend, 
  divisor, 
  result, 
  delay = 0,
  showSteps = false 
}: { 
  dividend: string; 
  divisor: string; 
  result?: string; 
  delay?: number;
  showSteps?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`fraction-grow transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
      <div className="flex items-center justify-center space-x-4">
        <div className="bg-white rounded-lg p-3 shadow-md border-2 border-blue-400">
          <span className="text-xl font-bold text-blue-600">{dividend}</span>
        </div>
        <span className="text-3xl font-bold text-gray-600">÷</span>
        <div className="bg-white rounded-lg p-3 shadow-md border-2 border-red-400">
          <span className="text-xl font-bold text-red-600">{divisor}</span>
        </div>
        {result && (
          <>
            <span className="text-3xl font-bold text-gray-600">=</span>
            <div className="bg-white rounded-lg p-3 shadow-md border-2 border-green-400">
              <span className="text-xl font-bold text-green-600">{result}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Interactive Fraction Manipulation Component
export function InteractiveFractionManipulation({ 
  initialNumerator, 
  initialDenominator, 
  onFractionChange 
}: { 
  initialNumerator: number; 
  initialDenominator: number; 
  onFractionChange: (numerator: number, denominator: number) => void;
}) {
  const [numerator, setNumerator] = useState(initialNumerator);
  const [denominator, setDenominator] = useState(initialDenominator);

  useEffect(() => {
    onFractionChange(numerator, denominator);
  }, [numerator, denominator, onFractionChange]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-300">
      <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">Interactive Fraction</h4>
      
      <div className="flex flex-col items-center space-y-4">
        {/* Numerator controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setNumerator(Math.max(1, numerator - 1))}
            className="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            -
          </button>
          <span className="text-xl font-bold text-gray-700 w-8 text-center">{numerator}</span>
          <button
            onClick={() => setNumerator(numerator + 1)}
            className="w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            +
          </button>
        </div>
        
        {/* Fraction line */}
        <div className="w-20 h-1 bg-gray-600"></div>
        
        {/* Denominator controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setDenominator(Math.max(1, denominator - 1))}
            className="w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            -
          </button>
          <span className="text-xl font-bold text-gray-700 w-8 text-center">{denominator}</span>
          <button
            onClick={() => setDenominator(denominator + 1)}
            className="w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            +
          </button>
        </div>
        
        {/* Current fraction display */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-300">
          <span className="text-lg font-bold text-blue-700">
            {numerator}/{denominator}
          </span>
        </div>
      </div>
    </div>
  );
}


