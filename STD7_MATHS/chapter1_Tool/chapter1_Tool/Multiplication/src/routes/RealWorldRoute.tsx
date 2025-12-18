import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function RealWorldRoute() {
  const { t, formatNumber, localizeDigitsInText } = useLanguage();

  const realWorldExamples = [
    {
      title: t('gardening'),
      description: t('gardeningDesc'),
      icon: '🌻',
      example: '3 × 4 = 12',
      scenario: t('gardeningScenario'),
      visualization: 'garden'
    },
    {
      title: t('shopping'),
      description: t('shoppingDesc'),
      icon: '🛒',
      example: '5 × 8 = 40',
      scenario: t('shoppingScenario'),
      visualization: 'shopping'
    },
    {
      title: t('cooking'),
      description: t('cookingDesc'),
      icon: '👨‍🍳',
      example: '2 × 6 = 12',
      scenario: t('cookingScenario'),
      visualization: 'cooking'
    },
    {
      title: t('sports'),
      description: t('sportsDesc'),
      icon: '⚽',
      example: '4 × 3 = 12',
      scenario: t('sportsScenario'),
      visualization: 'sports'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('realWorld')}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('realWorldSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {realWorldExamples.map((example, index) => (
          <div key={index} className="number-card hover:shadow-glow-purple group cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="text-5xl group-hover:animate-bounce-gentle">{example.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-brand-700 mb-2 group-hover:text-accent-600 transition-colors">
                  {example.title}
                </h3>
                <p className="text-gray-600 mb-4">{example.description}</p>
                
                <div className="bg-gradient-to-r from-brand-50 to-accent-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-2 font-medium">{example.scenario}</p>
                  <div className="text-2xl font-bold text-brand-600">
                    {localizeDigitsInText(example.example)}
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  {renderVisualization(example.visualization, example)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center bg-gradient-to-r from-brand-50 via-accent-50 to-brand-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">✨ {t('whyMultiplicationMatters')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="text-3xl">⚡</div>
            <h3 className="font-semibold text-brand-700">{t('fasterCalculations')}</h3>
            <p className="text-sm text-gray-600">{t('fasterCalculationsDesc')}</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">🔄</div>
            <h3 className="font-semibold text-accent-700">{t('patternRecognition')}</h3>
            <p className="text-sm text-gray-600">{t('patternRecognitionDesc')}</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">🎯</div>
            <h3 className="font-semibold text-success-600">{t('problemSolving')}</h3>
            <p className="text-sm text-gray-600">{t('problemSolvingDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderVisualization(type: string, example: any) {
  switch (type) {
    case 'garden':
      return (
        <div className="grid grid-cols-4 gap-2 p-4 bg-green-50 rounded-lg">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="w-6 h-6 text-center">🌻</div>
          ))}
        </div>
      );
    
    case 'shopping':
      return (
        <div className="flex flex-wrap gap-2 p-4 bg-blue-50 rounded-lg">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-1 p-2 bg-white rounded border">
              <div className="text-lg">📦</div>
              <div className="text-xs text-gray-600">8 cookies</div>
            </div>
          ))}
        </div>
      );
    
    case 'cooking':
      return (
        <div className="flex gap-4 p-4 bg-orange-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl mb-1">👥</div>
            <div className="text-sm text-gray-600">2 people</div>
          </div>
          <div className="flex items-center">
            <span className="text-2xl">×</span>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">6️⃣</div>
            <div className="text-sm text-gray-600">times</div>
          </div>
          <div className="flex items-center">
            <span className="text-2xl">=</span>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">👥👥👥👥👥👥👥👥👥👥👥👥</div>
            <div className="text-sm text-gray-600">12 people</div>
          </div>
        </div>
      );
    
    case 'sports':
      return (
        <div className="flex gap-2 p-4 bg-purple-50 rounded-lg">
          {Array.from({ length: 3 }, (_, match) => (
            <div key={match} className="text-center p-2 bg-white rounded border">
              <div className="text-sm text-gray-600 mb-1">Match {match + 1}</div>
              <div className="flex gap-1">
                {Array.from({ length: 4 }, (_, goal) => (
                  <span key={goal} className="text-lg">⚽</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    
    default:
      return null;
  }
}