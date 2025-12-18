import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { FractionCircle, RepeatedBars, AreaModelGrid } from '../Shared/FractionVisuals';

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
  }, [text]);
  return <span>{displayedText}</span>;
}

export default function RealWorldMode() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<number | null>(null);

  const examples = [
    { id: 1, title: t('ex1Title'), context: t('ex1Context'), formula: t('ex1Formula'), icon: '🍲' },
    { id: 2, title: t('ex2Title'), context: t('ex2Context'), formula: t('ex2Formula'), icon: '🏗️' },
    { id: 3, title: t('ex3Title'), context: t('ex3Context'), formula: t('ex3Formula'), icon: '⏱️' },
    { id: 4, title: t('ex4Title'), context: t('ex4Context'), formula: t('ex4Formula'), icon: '🛍️' },
    { id: 5, title: t('ex5Title'), context: t('ex5Context'), formula: t('ex5Formula'), icon: '🗺️' },
    { id: 6, title: t('ex6Title'), context: t('ex6Context'), formula: t('ex6Formula'), icon: '⛽' },
  ];

  const gradients = [
    'from-red-400 via-pink-500 to-rose-500',
    'from-blue-400 via-indigo-500 to-purple-500',
    'from-yellow-400 via-orange-500 to-red-500',
    'from-green-400 via-emerald-500 to-teal-500',
  ];
  const borderColors = ['border-pink-300','border-indigo-300','border-orange-300','border-teal-300'];

  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white overflow-hidden">
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-4 animate-bounce">🌍</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white drop-shadow-lg">{t('realWorld')}</h2>
          <p className="text-xl md:text-2xl text-white/95 drop-shadow-md">{t('examplesSubtitle')}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((ex, i) => (
          <div key={ex.id} onClick={() => setSelected(selected === i ? null : i)} className="cursor-pointer transition-all duration-300 transform hover:scale-105">
            <div className={`relative overflow-hidden bg-gradient-to-br ${gradients[i % gradients.length]} rounded-3xl p-6 shadow-xl border-2 ${borderColors[i % borderColors.length]} hover:shadow-2xl ${selected === i ? 'ring-4 ring-white scale-105' : ''}`}>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="relative mb-4">
                  <div className="absolute inset-0 text-8xl flex items-center justify-center blur-md opacity-50 animate-pulse">{ex.icon}</div>
                  <div className="relative text-8xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-12 drop-shadow-2xl">{ex.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">{ex.title}</h3>
                <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mb-3 opacity-50"></div>
                <div className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-xl">📌</span>
                    <p className="text-sm text-white/90 leading-relaxed"><AnimatedText text={ex.context} /></p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-white/80 text-sm font-medium">
                  <span>{selected === i ? `👆 ${t('collapse')}` : `👇 ${t('expand')}`}</span>
                </div>
              </div>
            </div>
            {selected === i && (
              <div className="mt-4 rounded-2xl shadow-xl p-6 border-2 border-gray-200 bg-gradient-to-br from-white via-indigo-50 to-pink-50">
                <div className="space-y-4">
                  <div className="rounded-2xl p-4 bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 shadow">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">❓</span>
                      <div>
                        <div className="font-bold text-gray-800 mb-1">Question</div>
                        <p className="text-gray-700">{ex.context}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl p-4 bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 shadow">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <div className="font-bold text-gray-800 mb-1">Answer</div>
                        <p className="text-emerald-700 font-semibold">{ex.formula}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Why this matters */}
      <div className="rounded-3xl shadow-2xl p-6 md:p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100">
        <div className="flex items-start gap-4">
          <div className="text-5xl">💡</div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3"><AnimatedText text={t('whyTitle')} /></h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2"><span className="text-xl">📏</span> <span><AnimatedText text={t('whyP1')} /></span></li>
              <li className="flex items-start gap-2"><span className="text-xl">📐</span> <span><AnimatedText text={t('whyP2')} delay={150} /></span></li>
              <li className="flex items-start gap-2"><span className="text-xl">🍲</span> <span><AnimatedText text={t('whyP3')} delay={300} /></span></li>
              <li className="flex items-start gap-2"><span className="text-xl">🛍️</span> <span><AnimatedText text={t('whyP4')} delay={450} /></span></li>
              <li className="flex items-start gap-2"><span className="text-xl">⏱️</span> <span><AnimatedText text={t('whyP5')} delay={600} /></span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pro Tip */}
      <div className="rounded-3xl shadow-2xl p-6 md:p-8 bg-gradient-to-r from-orange-300 via-pink-400 to-rose-400 text-white">
        <h4 className="text-2xl font-extrabold mb-3"><AnimatedText text={`${t('proTipTitle')} ✨`} /></h4>
        <p className="text-lg leading-relaxed"><AnimatedText text={t('proTipShort')} /></p>
        
      </div>
    </div>
  );
}


