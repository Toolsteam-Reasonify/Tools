import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedText from '../../../components/AnimatedText';

// Using shared AnimatedText component

export default function RealWorldMode() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<number | null>(null);

  const examples = [
    {
      id: 1,
      title: t('temperature'),
      context: t('morningTemperatureContext'),
      question: t('morningTemperatureContext'),
      answer: t('finalTemperature') + ': 5°C',
      icon: '🌡️',
    },
    {
      id: 2,
      title: t('bankBalance'),
      context: t('bankBalanceContext'),
      question: t('bankBalanceContext'),
      answer: t('finalAmount') + ': ₹300',
      icon: '💳',
    },
    {
      id: 3,
      title: t('elevation'),
      context: t('elevationContext'),
      question: t('elevationContext'),
      answer: t('finalPosition') + ': -7m',
      icon: '⛰️',
    },
    {
      id: 4,
      title: t('sportsScore'),
      context: t('sportsScoreContext'),
      question: t('sportsScoreContext'),
      answer: t('finalScore') + ': 2 points',
      icon: '⚽',
    },
    {
      id: 5,
      title: t('debtPayment'),
      context: t('debtPaymentContext'),
      question: t('debtPaymentContext'),
      answer: t('finalAmount') + ': -₹200',
      icon: '💸',
    },
    {
      id: 6,
      title: t('stockMarket'),
      context: t('stockMarketContext'),
      question: t('stockMarketContext'),
      answer: t('finalAmount') + ': ₹950',
      icon: '📈',
    },
  ];

  const gradients = [
    'from-red-400 via-pink-500 to-rose-500',
    'from-blue-400 via-indigo-500 to-purple-500',
    'from-yellow-400 via-orange-500 to-red-500',
    'from-green-400 via-emerald-500 to-teal-500',
    'from-purple-400 via-violet-500 to-fuchsia-500',
    'from-cyan-400 via-sky-500 to-blue-500',
  ];

  const borderColors = [
    'border-pink-300',
    'border-indigo-300',
    'border-orange-300',
    'border-teal-300',
    'border-violet-300',
    'border-sky-300',
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white overflow-hidden">
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-4 animate-bounce">🌍</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white drop-shadow-lg">
            <AnimatedText text={t('realWorldExamples')} speed={150} />
          </h2>
          <p className="text-xl md:text-2xl text-white/95 drop-shadow-md">
            <AnimatedText text={t('realWorldDescription')} delay={200} speed={150} />
          </p>
        </div>
      </div>

      {/* Examples grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((ex, i) => (
          <div
            key={ex.id}
            onClick={() => setSelected(selected === i ? null : i)}
            className="cursor-pointer transition-all duration-300 transform hover:scale-105"
          >
            <div className={`relative overflow-hidden bg-gradient-to-br ${gradients[i]} rounded-3xl p-6 shadow-xl border-2 ${borderColors[i]} hover:shadow-2xl ${selected === i ? 'ring-4 ring-white scale-105' : ''}`}>
              {/* Animated glow effect */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              
              <div className="relative z-10 h-full flex flex-col">
                {/* Icon with double effect */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 text-8xl flex items-center justify-center blur-md opacity-50 animate-pulse">
                    {ex.icon}
                  </div>
                  <div className="relative text-8xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-12 drop-shadow-2xl">
                    {ex.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">
                  {ex.title}
                </h3>

                {/* Divider with gradient */}
                <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mb-3 opacity-50"></div>

                {/* Context box with glass morphism */}
                <div className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-xl">📌</span>
                    <p className="text-sm text-white/90 leading-relaxed">
                      <AnimatedText text={ex.context} />
                    </p>
                  </div>
                </div>

                {/* Expand indicator */}
                <div className="mt-4 flex items-center justify-center gap-2 text-white/80 text-sm font-medium">
                  <span>{selected === i ? `👆 ${t('clickToCollapse')}` : `👇 ${t('clickToExpand')}`}</span>
                </div>
              </div>
            </div>

            {/* Expanded content */}
            {selected === i && (
              <div className="mt-4 bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200 transform animate-in">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-l-4 border-blue-500">
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">❓</span>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-2">{t('questionLabel')}</h4>
                        <p className="text-gray-700"><AnimatedText text={ex.question} /></p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-l-4 border-green-500">
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">✅</span>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-2">{t('answerLabel')}</h4>
                        <p className="text-gray-700"><AnimatedText text={ex.answer} delay={200} /></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-xl p-8 border-2 border-indigo-200">
        <div className="flex items-start gap-4">
          <span className="text-5xl">💡</span>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent mb-3">
              {t('whyArithmeticMeanMatters')}
            </h3>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-start gap-2">
                <span className="text-xl">📊</span>
                <span><AnimatedText text={t('centralTendencyPoint')} delay={0} /></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-xl">📈</span>
                <span><AnimatedText text={t('dataAnalysisPoint')} delay={300} /></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-xl">🎯</span>
                <span><AnimatedText text={t('realWorldApplicationsPoint')} delay={600} /></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-xl">🌍</span>
                <span><AnimatedText text={t('universalConceptPoint')} delay={900} /></span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive tip */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-pulse">💪</span>
          <div>
            <h4 className="text-xl font-bold mb-1">{t('proTip')}</h4>
            <p className="text-white/90">
              <AnimatedText text={t('proTipText')} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
