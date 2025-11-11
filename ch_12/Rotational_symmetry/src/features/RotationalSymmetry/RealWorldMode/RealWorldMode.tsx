import { useState, useEffect } from 'react';
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

export default function RealWorldMode() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<number | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const examples = [
    {
      id: 1,
      title: t('ex1Title'),
      context: t('ex1Context'),
      question: t('ex1Question'),
      answer: t('ex1Answer'),
      order: t('ex1Order'),
      angle: t('ex1Angle'),
      icon: '⏰',
    },
    {
      id: 2,
      title: t('ex2Title'),
      context: t('ex2Context'),
      question: t('ex2Question'),
      answer: t('ex2Answer'),
      order: t('ex2Order'),
      angle: t('ex2Angle'),
      icon: '🌀',
    },
    {
      id: 3,
      title: t('ex3Title'),
      context: t('ex3Context'),
      question: t('ex3Question'),
      answer: t('ex3Answer'),
      order: t('ex3Order'),
      angle: t('ex3Angle'),
      icon: '🍊',
    },
    {
      id: 4,
      title: t('ex4Title'),
      context: t('ex4Context'),
      question: t('ex4Question'),
      answer: t('ex4Answer'),
      order: t('ex4Order'),
      angle: t('ex4Angle'),
      icon: '🚦',
    },
    {
      id: 5,
      title: t('ex5Title'),
      context: t('ex5Context'),
      question: t('ex5Question'),
      answer: t('ex5Answer'),
      order: t('ex5Order'),
      angle: t('ex5Angle'),
      icon: '🚴',
    },
    {
      id: 6,
      title: t('ex6Title'),
      context: t('ex6Context'),
      question: t('ex6Question'),
      answer: t('ex6Answer'),
      order: t('ex6Order'),
      angle: t('ex6Angle'),
      icon: '🌀',
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

  const renderIconAnimation = (icon: string, id: number) => {
    // Ceiling fan (id 6): three rounded blades, no tower
    if (id === 6) {
      return (
        <svg viewBox="0 0 200 200" className="w-32 h-32">
          {/* Ceiling canopy and rod (static) */}
          <g>
            <rect x="98" y="65" width="4" height="25" fill="#4b2e22" />
            <ellipse cx="100" cy="60" rx="12" ry="8" fill="#794c33" stroke="#3a261b" strokeWidth="1.5" />
            <ellipse cx="100" cy="66" rx="10" ry="6" fill="#4b2e22" stroke="#2b1b13" strokeWidth="1" />
          </g>

          {/* Hub with ring */}
          <circle cx="100" cy="100" r="14" fill="#6f4a34" stroke="#2b1b13" strokeWidth="2" />
          <circle cx="100" cy="100" r="7" fill="#7e543b" stroke="#3a261b" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="2.5" fill="#2b1b13" />

          {/* Rotating blades group */}
          <g transform={`rotate(${rotationAngle}, 100, 100)`} stroke="#2b1b13" strokeWidth="1.8">
            {/* Blade: pill-shaped with rounded tip and base near hub */}
            <path d="M100 100 
                     C 116 96, 136 94, 154 98 
                     C 160 110, 160 118, 154 130 
                     C 136 134, 116 128, 100 120 
                     C 102 114, 102 106, 100 100 Z" 
                  fill="#6b4230" />
            <g transform="rotate(120, 100, 100)">
              <path d="M100 100 
                       C 116 96, 136 94, 154 98 
                       C 160 110, 160 118, 154 130 
                       C 136 134, 116 128, 100 120 
                       C 102 114, 102 106, 100 100 Z" 
                    fill="#6b4230" />
            </g>
            <g transform="rotate(240, 100, 100)">
              <path d="M100 100 
                       C 116 96, 136 94, 154 98 
                       C 160 110, 160 118, 154 130 
                       C 136 134, 116 128, 100 120 
                       C 102 114, 102 106, 100 100 Z" 
                    fill="#6b4230" />
            </g>
            {/* Subtle blade shadows */}
            <g opacity="0.15">
              <path d="M100 100 C 120 96, 146 94, 158 100 C 164 112, 164 118, 158 132 C 140 136, 118 132, 100 122 Z" fill="#000" />
              <g transform="rotate(120, 100, 100)">
                <path d="M100 100 C 120 96, 146 94, 158 100 C 164 112, 164 118, 158 132 C 140 136, 118 132, 100 122 Z" fill="#000" />
              </g>
              <g transform="rotate(240, 100, 100)">
                <path d="M100 100 C 120 96, 146 94, 158 100 C 164 112, 164 118, 158 132 C 140 136, 118 132, 100 122 Z" fill="#000" />
              </g>
            </g>
          </g>
        </svg>
      );
    }
    if (icon === '⏰') {
      return (
        <svg viewBox="0 0 200 200" className="w-32 h-32">
          <circle cx="100" cy="100" r="70" fill="white" stroke="#111827" strokeWidth="3" />
          <circle cx="100" cy="100" r="5" fill="#111827" />
          <line 
            x1="100" y1="100" 
            x2="100" y2="50" 
            stroke="#ef4444" 
            strokeWidth="4" 
            strokeLinecap="round"
            transform={`rotate(${rotationAngle / 12}, 100, 100)`}
          />
          <line 
            x1="100" y1="100" 
            x2="100" y2="40" 
            stroke="#0ea5e9" 
            strokeWidth="3" 
            strokeLinecap="round"
            transform={`rotate(${rotationAngle}, 100, 100)`}
          />
        </svg>
      );
    }
    if (icon === '🌀') {
      return (
        <svg viewBox="0 0 200 200" className="w-32 h-32">
          {/* Tower */}
          <path d="M96 190 Q100 193 104 190 L108 110 L92 110 Z" fill="#6b7280" stroke="#111827" strokeWidth="2" strokeLinejoin="round" />
          {/* Hub */}
          <circle cx="100" cy="110" r="5" fill="#9ca3af" stroke="#111827" strokeWidth="2" />
          {/* Rotating blades (three) */}
          <g transform={`rotate(${rotationAngle}, 100, 110)`}>
            <path d="M100 110 C 122 104, 144 102, 160 108 C 144 114, 122 116, 100 110 Z" fill="#c0c4c7" stroke="#111827" strokeWidth="2" strokeLinejoin="round" />
            <g transform="rotate(120, 100, 110)">
              <path d="M100 110 C 122 104, 144 102, 160 108 C 144 114, 122 116, 100 110 Z" fill="#c0c4c7" stroke="#111827" strokeWidth="2" strokeLinejoin="round" />
            </g>
            <g transform="rotate(240, 100, 110)">
              <path d="M100 110 C 122 104, 144 102, 160 108 C 144 114, 122 116, 100 110 Z" fill="#c0c4c7" stroke="#111827" strokeWidth="2" strokeLinejoin="round" />
            </g>
          </g>
        </svg>
      );
    }
    if (icon === '🚴') {
      return (
        <svg viewBox="0 0 200 200" className="w-32 h-32">
          {/* Outer wooden rim */}
          <circle cx="100" cy="100" r="62" fill="#d6a36a" stroke="#6b4f3a" strokeWidth="6" />
          {/* Inner rim */}
          <circle cx="100" cy="100" r="50" fill="none" stroke="#6b4f3a" strokeWidth="3" />
          {/* Rotating spokes (12) */}
          <g transform={`rotate(${rotationAngle}, 100, 100)`}>
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * Math.PI) / 6; // 30° increments
              const x2 = 100 + 50 * Math.cos(angle);
              const y2 = 100 + 50 * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1="100"
                  y1="100"
                  x2={x2}
                  y2={y2}
                  stroke="#3f2f1e"
                  strokeWidth="3"
                />
              );
            })}
          </g>
          {/* Hub */}
          <circle cx="100" cy="100" r="10" fill="#b8874f" stroke="#3f2f1e" strokeWidth="2" />
          {/* Hub bolts */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * Math.PI) / 3; // 60° increments
            const x = 100 + 6 * Math.cos(angle);
            const y = 100 + 6 * Math.sin(angle);
            return <circle key={i} cx={x} cy={y} r="1.5" fill="#3f2f1e" />;
          })}
        </svg>
      );
    }
    return <span className="text-8xl">{icon}</span>;
  };

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
          <div
            key={ex.id}
            onClick={() => setSelected(selected === i ? null : i)}
            className="cursor-pointer transition-all duration-300 transform hover:scale-105"
          >
            <div className={`relative overflow-hidden bg-gradient-to-br ${gradients[i]} rounded-3xl p-6 shadow-xl border-2 ${borderColors[i]} hover:shadow-2xl ${selected === i ? 'ring-4 ring-white scale-105' : ''} h-96`}>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
              
              <div className="relative z-10 h-full flex flex-col">
                <div className="relative mb-4 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center blur-md opacity-50 animate-pulse">
                    {renderIconAnimation(ex.icon, ex.id)}
                  </div>
                  <div className="relative flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-12 drop-shadow-2xl">
                    {renderIconAnimation(ex.icon, ex.id)}
                  </div>
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

      <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-xl p-8 border-2 border-indigo-200">
        <div className="flex items-start gap-4">
          <span className="text-5xl">💡</span>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent mb-3">
              {t('whyMatterTitle')}
            </h3>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-start gap-2">
                <span className="text-xl">🎨</span>
                <span><AnimatedText text={t('whyMatterPoint1')} delay={0} /></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-xl">⚙️</span>
                <span><AnimatedText text={t('whyMatterPoint2')} delay={300} /></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-xl">🌿</span>
                <span><AnimatedText text={t('whyMatterPoint3')} delay={600} /></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-xl">📐</span>
                <span><AnimatedText text={t('whyMatterPoint4')} delay={900} /></span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-pulse">💪</span>
          <div>
            <h4 className="text-xl font-bold mb-1">{t('proTipTitle')}</h4>
            <p className="text-white/90">
              <AnimatedText text={t('proTipText')} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



