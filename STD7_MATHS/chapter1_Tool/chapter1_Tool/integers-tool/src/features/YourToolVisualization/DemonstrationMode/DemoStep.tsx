import React, { useEffect, useState } from 'react';

type Props = {
  title: string;
  description: string;
  example?: string;
  isActive?: boolean;
  stepNumber?: number;
};

export default function DemoStep({ title, description, example, isActive = true, stepNumber }: Props) {
  const [showContent, setShowContent] = useState(false);
  const [animateText, setAnimateText] = useState(false);
  const [highlightExample, setHighlightExample] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Stagger animations for better educational flow
      const timer1 = setTimeout(() => setShowContent(true), 300);
      const timer2 = setTimeout(() => setAnimateText(true), 700);
      const timer3 = setTimeout(() => setHighlightExample(true), 1100);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      setShowContent(false);
      setAnimateText(false);
      setHighlightExample(false);
    }
  }, [isActive]);

  return (
    <div className={`relative overflow-hidden rounded-xl transition-all duration-700 ease-out transform ${
      isActive 
        ? 'shadow-2xl scale-105 bg-gradient-to-br from-teal-50 via-purple-50 to-indigo-50 border-2 border-teal-300' 
        : 'shadow-lg bg-white border border-gray-200 hover:shadow-xl'
    }`}>
      {/* Animated Background Pattern */}
      {isActive && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-teal-400 to-purple-400 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-purple-400 to-teal-400 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      )}
      
      {/* Main Content Container */}
      <div className="relative p-6 z-10">
        {/* Step Header with Number Badge */}
        <div className={`flex items-center mb-4 transition-all duration-800 ${
          showContent ? 'transform translate-x-0 opacity-100' : 'transform -translate-x-6 opacity-0'
        }`}>
          {stepNumber && (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 transition-all duration-600 ${
              isActive 
                ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white scale-110 shadow-lg animate-bounce-gentle' 
                : 'bg-gray-300 text-gray-600'
            }`}>
              {stepNumber}
            </div>
          )}
          
          <div className={`font-semibold text-lg transition-all duration-700 ${
            isActive 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-purple-700' 
              : 'text-brand-700'
          }`}>
            {title}
          </div>
        </div>
        
        {/* Animated Content Box */}
        <div className={`relative transition-all duration-900 ease-out ${
          animateText ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
        }`}>
          {/* Content Background with Learning Enhancement */}
          <div className={`p-4 rounded-lg transition-all duration-600 ${
            isActive 
              ? 'bg-white/90 backdrop-blur-sm border border-teal-200/60 shadow-inner' 
              : 'bg-gray-50/30'
          }`}>
            <p className={`mt-1 whitespace-pre-line leading-relaxed transition-all duration-700 ${
              isActive ? 'text-gray-800' : 'text-slate-600'
            }`}>
              {description}
            </p>
          </div>
          

        </div>

        {/* Enhanced Example Section */}
        {example && (
          <div className={`mt-4 transition-all duration-1000 ease-out ${
            highlightExample ? 'opacity-100 transform translate-y-0 scale-100' : 'opacity-0 transform translate-y-3 scale-95'
          }`}>
            <div className={`p-4 rounded-lg font-mono text-lg relative overflow-hidden transition-all duration-600 ${
              isActive 
                ? 'bg-gradient-to-r from-teal-50 to-purple-50 border-2 border-teal-200 shadow-lg transform scale-105' 
                : 'bg-brand-50 border border-brand-100'
            }`}>
              {/* Enhanced Mathematical Expression */}
              <div className={`transition-all duration-700 relative text-center ${
                isActive ? 'text-gray-800 font-bold' : 'text-gray-600'
              }`}>
                <div className={`inline-block px-8 py-5 rounded-2xl relative overflow-hidden transition-all duration-700 ${
                  isActive 
                    ? 'bg-white border-2 border-teal-300 shadow-xl shadow-teal-200/50 animate-math-highlight' 
                    : 'bg-white/80 border border-gray-200 shadow-sm'
                }`}>
                  {/* Clean Gradient Border Effect */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-200 via-purple-200/50 to-teal-200 p-0.5">
                      <div className="w-full h-full bg-white rounded-2xl" />
                    </div>
                  )}
                  
                  {/* Mathematical Content with Dynamic Effects */}
                  <div className="relative z-10">
                    <div className={`text-2xl font-mono font-bold tracking-wider transition-all duration-500 inline-block ${
                      isActive ? 'animate-gradient-shift' : ''
                    }`} style={isActive ? {
                      background: 'linear-gradient(-45deg, #0d9488, #6366f1, #8b5cf6, #0d9488)',
                      backgroundSize: '400% 400%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    } : {}}>
                      {isActive ? (
                        <span className="inline-block overflow-hidden whitespace-nowrap animate-typewriter" style={{ maxWidth: '100%' }}>
                          {example}
                        </span>
                      ) : (
                        <span className="text-gray-600">{example}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Subtle Glow Effect */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-100/30 via-white/10 to-purple-100/30 rounded-2xl animate-pulse opacity-50" />
                  )}
                </div>
              </div>
              

            </div>
          </div>
        )}


      </div>
    </div>
  );
}


