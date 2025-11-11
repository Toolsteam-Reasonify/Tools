import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

// Word-by-word animation component
function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const words = text.split(' ');

  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    let currentIndex = 0;
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedText(words.slice(0, currentIndex + 1).join(' '));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 100); // 100ms between each word
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [text]);

  return <span>{displayedText}</span>;
}

type RealWorldExample = { id: number; title: string; description: string; dataset: number[]; context: string };

export default function RealWorldMode() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<number | null>(null);

  const calculateMedian = (data: number[]) => {
    const sorted = [...data].sort((a, b) => a - b);
    const n = sorted.length;
    const mid = Math.floor(n / 2);
    return n % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  const examples: RealWorldExample[] = [
    { id: 1, title: t('rw1Title'), description: t('rw1Desc'), dataset: [25, 30, 28, 35, 150, 32, 27], context: t('rw1Context') },
    { id: 2, title: t('rw2Title'), description: t('rw2Desc'), dataset: [45, 50, 48, 200, 52, 47], context: t('rw2Context') },
    { id: 3, title: t('rw3Title'), description: t('rw3Desc'), dataset: [65, 78, 82, 55, 90, 72, 68], context: t('rw3Context') },
    { id: 4, title: t('rw4Title'), description: t('rw4Desc'), dataset: [25, 30, 35, 28, 32, 45, 27], context: t('rw4Context') },
    { id: 5, title: t('rw5Title'), description: t('rw5Desc'), dataset: [3, 4, 5, 4, 3, 5, 4, 2], context: t('rw5Context') },
    { id: 6, title: t('rw6Title'), description: t('rw6Desc'), dataset: [18, 22, 35, 28, 42, 25, 30], context: t('rw6Context') }
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
            {t('realWorld')}
          </h2>
          <p className="text-xl md:text-2xl text-white/95 drop-shadow-md">{t('realWorldDescription') || 'See how median is used in everyday life'}</p>
        </div>
      </div>

      {/* Examples grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((ex, i) => {
          const icons = ['💰', '🏠', '📝', '🚗', '⭐', '👥'];
          
          return (
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
                      {icons[i]}
                    </div>
                    <div className="relative text-8xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-12 drop-shadow-2xl">
                      {icons[i]}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">
                    {ex.title}
                  </h3>

                  {/* Divider with gradient */}
                  <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mb-3 opacity-50"></div>

                  {/* Context/Description box with glass morphism */}
                  <div className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg">
                    <div className="flex items-start gap-2 mb-3">
                      <span className="text-xl">📌</span>
                      <p className="text-sm text-white/90 leading-relaxed">
                        <AnimatedText text={selected === i ? ex.context : ex.description} />
                      </p>
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-white/80 text-sm font-medium">
                    <span>{selected === i ? `👆 ${t('clickToCollapse') || 'Click to collapse'}` : `👇 ${t('clickToExpand') || 'Click to expand'}`}</span>
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              {selected === i && (
                <div className="mt-4 bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200 transform animate-in">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-l-4 border-blue-500">
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">📊</span>
                        <div>
                          <h4 className="font-bold text-gray-800 mb-2">{t('data') || 'Dataset'}</h4>
                          <p className="text-gray-700">[{ex.dataset.join(', ')}]</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-l-4 border-green-500">
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">✅</span>
                        <div>
                          <h4 className="font-bold text-gray-800 mb-2">{t('medianLabel') || 'Median'}</h4>
                          <p className="text-gray-700 text-lg font-semibold">{calculateMedian(ex.dataset)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info box */}
      <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-xl p-8 border-2 border-indigo-200">
        <div className="flex items-start gap-4">
          <span className="text-5xl">💡</span>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent mb-3">
              {t('whyMedianMatters') || 'Why Median Matters?'}
            </h3>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-start gap-2">
                <span className="text-xl">📊</span>
                <span><AnimatedText text={t('medianMattersPoint1') || 'Median provides a better measure of central tendency when dealing with outliers.'} delay={0} /></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-xl">📈</span>
                <span><AnimatedText text={t('medianMattersPoint2') || "It's less affected by extreme values compared to the mean."} delay={300} /></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-xl">🎯</span>
                <span><AnimatedText text={t('medianMattersPoint3') || 'Perfect for understanding typical values in real-world scenarios.'} delay={600} /></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-xl">🌍</span>
                <span><AnimatedText text={t('medianMattersPoint4') || 'Used in economics, statistics, and data analysis worldwide.'} delay={900} /></span>
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
            <h4 className="text-xl font-bold mb-1">{t('proTip') || 'Pro Tip!'}</h4>
            <p className="text-white/90">
              <AnimatedText text={t('proTipText') || 'When analyzing data with outliers, always consider using median instead of mean for a more accurate representation of the typical value! 📏✨'} />
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

