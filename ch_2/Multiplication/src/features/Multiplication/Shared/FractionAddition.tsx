import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const words = text.split(' ');

  useEffect(() => {
    setDisplayedText('');
    let currentIndex = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedText(words.slice(0, currentIndex + 1).join(' '));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return <span>{displayedText}</span>;
}

export function FractionAdditionVisual() {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gradient-to-r from-blue-200 to-purple-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Div - Interactive Text */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-purple-600">➕</span>{' '}
              <span className="text-blue-600">
                <AnimatedText text={t('fractionAdditionTitle')} delay={0} />
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              <AnimatedText text={t('fractionAdditionSubtitle')} delay={500} />
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-l-4 border-blue-500">
              <div className="text-2xl font-bold text-center">
                <span className="text-blue-600">1/4</span>
                <span className="text-gray-500 mx-2">+</span>
                <span className="text-purple-600">1/4</span>
                <span className="text-gray-500 mx-2">=</span>
                <span className="text-green-600">2×1/4</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border-l-4 border-green-500">
              <p className="text-gray-700 font-medium">
                <AnimatedText text={t('fractionAdditionExplanation')} delay={1000} />
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-l-4 border-yellow-500">
              <p className="text-gray-700 font-medium text-center">
                💡 <AnimatedText text={t('fractionAdditionVisual')} delay={1500} />
              </p>
            </div>
          </div>
        </div>

        {/* Right Div - Visual Representation */}
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-4">
            {/* First 1/4 circle */}
            <div className="relative">
              <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-lg">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="none"
                  className="absolute top-0 left-0"
                  style={{
                    strokeDasharray: 'none',
                    clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)'
                  }}
                />
                {/* Division lines */}
                <line x1="60" y1="10" x2="60" y2="110" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3,3" />
                <line x1="10" y1="60" x2="110" y2="60" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3,3" />
                {/* Shaded quarter (top-left) */}
                <path
                  d="M 60 60 L 60 10 A 50 50 0 0 1 110 60 Z"
                  fill="#60a5fa"
                  fillOpacity="0.8"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="text-center mt-2">
                <span className="text-sm font-bold text-blue-600">1/4</span>
              </div>
            </div>

            {/* Plus sign */}
            <div className="text-3xl font-bold text-gray-500">+</div>

            {/* Second 1/4 circle */}
            <div className="relative">
              <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-lg">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="3"
                  strokeDasharray="none"
                  className="absolute top-0 left-0"
                  style={{
                    strokeDasharray: 'none',
                    clipPath: 'polygon(50% 50%, 100% 50%, 100% 0%, 50% 0%)'
                  }}
                />
                {/* Division lines */}
                <line x1="60" y1="10" x2="60" y2="110" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3,3" />
                <line x1="10" y1="60" x2="110" y2="60" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3,3" />
                {/* Shaded quarter (top-right) */}
                {/* Shaded quarter (top-left) */}
                <path
                  d="M 60 60 L 60 10 A 50 50 0 0 0 10 60 Z"
                  fill="#8b5cf6"
                  fillOpacity="1"
                  className="transition-all duration-1000"
                />

              </svg>
              <div className="text-center mt-2">
                <span className="text-sm font-bold text-purple-600">1/4</span>
              </div>
            </div>

            {/* Equals sign */}
            <div className="text-3xl font-bold text-gray-500">=</div>

            {/* Result circle (2/4 = 1/2) */}
            <div className="relative">
              <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-lg">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="none"
                  className="absolute top-0 left-0"
                  style={{
                    strokeDasharray: 'none',
                    clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%, 50% 50%)'
                  }}
                />
                {/* Division lines */}
                <line x1="60" y1="10" x2="60" y2="110" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />
                <line x1="10" y1="60" x2="110" y2="60" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />
                {/* Shaded half (top half) */}
                {/* <path
                  d="M 10 60 L 110 60 A 50 50 0 0 1 60 10 A 50 50 0 0 1 10 60 Z"
                  fill="#34d399"
                  fillOpacity="0.8"
                  className="transition-all duration-1000"
                /> */}

                <path
                  d="M 10 60 A 50 50 0 0 1 110 60 L 110 60 L 10 60 Z"
                  fill="#34d399"
                  fillOpacity="0.8"
                  className="transition-all duration-1000"
                />

              </svg>
              <div className="text-center mt-2">
                <span className="text-sm font-bold text-green-600">2/4</span>
                <div className="text-xs text-gray-500">= 1/2</div>
              </div>
            </div>
          </div>

          {/* Animation indicator */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <span className="text-sm font-medium text-gray-600 ml-2">{t('interactiveVisual')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
