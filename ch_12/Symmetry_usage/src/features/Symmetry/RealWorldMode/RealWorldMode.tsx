import { useEffect, useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const words = text.split(' ');
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < words.length) {
          setDisplayedText(words.slice(0, i + 1).join(' '));
          i++;
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

export default function RealWorldMode() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<number | null>(null);

  const examples = [
    { id: 1, title: t('architectureTitle'), icon: '🏛️', context: t('architectureDesc') },
    { id: 2, title: t('vehiclesTitle'), icon: '🚗', context: t('vehiclesDesc') },
    { id: 3, title: t('natureLeavesTitle'), icon: '🌿', context: t('natureLeavesDesc') },
    { id: 4, title: t('butterfliesTitle'), icon: '🦋', context: t('butterfliesDesc') },
    { id: 5, title: t('logosSymbolsTitle'), icon: '🔆', context: t('logosSymbolsDesc') },
    { id: 6, title: t('patternsRugsTitle'), icon: '🧵', context: t('patternsRugsDesc') },
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
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white overflow-hidden">
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-4 float-slow">🌍</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white drop-shadow-lg">{t('realWorldTitle')}</h2>
          <p className="text-xl md:text-2xl text-white/95 drop-shadow-md">{t('realWorldSubtitle')}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((ex, i) => (
          <div key={ex.id} onClick={() => setSelected(selected === i ? null : i)} className="cursor-pointer transition-all duration-300 transform hover:scale-105">
            <div className={`relative overflow-hidden bg-gradient-to-br ${gradients[i]} rounded-3xl p-6 shadow-xl border-2 ${borderColors[i]} hover:shadow-2xl ${selected === i ? 'ring-4 ring-white scale-105' : ''}`}>
              <div className="relative z-10 h-full flex flex-col">
                <div className="relative mb-4">
                  <div className="absolute inset-0 text-8xl flex items-center justify-center blur-md opacity-50 animate-pulse">{ex.icon}</div>
                  <div className="relative text-8xl flex items-center justify-center drop-shadow-2xl float-slow wiggle-slow">{ex.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">{ex.title}</h3>
                <div className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg">
                  <p className="text-sm text-white/90 leading-relaxed"><AnimatedText text={ex.context} /></p>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-white/80 text-sm font-medium">
                  <span>{selected === i ? `👆 ${t('clickToCollapse')}` : `👇 ${t('clickToExpand')}`}</span>
                </div>
              </div>
            </div>

            {selected === i && (
              <div className="mt-4 bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200">
                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-l-4 border-blue-500">
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">📏</span>
                      <p className="text-gray-700">Look for a vertical or horizontal line that splits the shape into mirror halves.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-xl p-8 border-2 border-indigo-200">
        <div className="flex items-start gap-4">
          <span className="text-5xl">💡</span>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent mb-3">{t('whyMatterTitle')}</h3>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-start gap-2"><span className="text-xl">🎯</span><span><AnimatedText text={t('whyMatterPoint1')} /></span></p>
              <p className="flex items-start gap-2"><span className="text-xl">🔎</span><span><AnimatedText text={t('whyMatterPoint2')} delay={200} /></span></p>
              <p className="flex items-start gap-2"><span className="text-xl">🧪</span><span><AnimatedText text={t('whyMatterPoint3')} delay={400} /></span></p>
              <p className="flex items-start gap-2"><span className="text-xl">📐</span><span><AnimatedText text={t('whyMatterPoint4')} delay={600} /></span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <span className="text-4xl">💪</span>
          <div>
            <h4 className="text-xl font-bold mb-1">{t('proTipTitle')}</h4>
            <p className="text-white/90"><AnimatedText text={t('proTipText')} /></p>
          </div>
        </div>
      </div>
    </div>
  );
}


