import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedText from '../../../components/AnimatedText';

type RealWorldExample = { id: number; title: string; description: string; dataset: number[]; context: string };

export default function RealWorldMode() {
  const { isTransitioning, t } = useLanguage();
  const [selected, setSelected] = useState(0);

  const examples: RealWorldExample[] = [
    { id: 1, title: t('rw1Title'), description: t('rw1Desc'), dataset: [8,22,32,37,6], context: t('rw1Context') },
    { id: 2, title: t('rw2Title'), description: t('rw2Desc'), dataset: [135,135,144,160], context: t('rw2Context') },
    { id: 3, title: t('rw3Title'), description: t('rw3Desc'), dataset: [2,2,3,2,3,2,4,2,2,3,4,4,3,2,3,2], context: t('rw3Context') },
    { id: 4, title: t('rw4Title'), description: t('rw4Desc'), dataset: [12,25,40,28,15], context: t('rw4Context') },
    { id: 5, title: t('rw5Title'), description: t('rw5Desc'), dataset: [15,30,18,22], context: t('rw5Context') },
    { id: 6, title: t('rw6Title'), description: t('rw6Desc'), dataset: [45,60,55,40], context: t('rw6Context') }
  ];

  const current = examples[selected];
  const freq: Record<number, number> = {} as any; current.dataset.forEach(v=> (freq[v]=(freq[v]||0)+1));
  const maxF = Math.max(...Object.values(freq));
  const modes = Object.entries(freq).filter(([,f])=> f===maxF).map(([k])=>k).join(', ');

  return (
    <div className={`space-y-6 transition-all duration-500 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white overflow-hidden">
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-4 animate-bounce">🌍</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white drop-shadow-lg"><AnimatedText text={t('realWorld')} speed={150} /></h2>
          <p className="text-xl md:text-2xl text-white/95 drop-shadow-md"><AnimatedText text={t('rw1Desc')} delay={200} speed={150} /></p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((ex, i) => {
          const icons = ['👕', '🚪', '🫓', '👟', '🍦', '🚌'];
          
          return (
            <div key={ex.id} onClick={()=> setSelected(i)} className="cursor-pointer transition-all duration-300 transform hover:scale-105">
              <div className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-3xl p-6 shadow-xl border-2 border-purple-200 hover:shadow-2xl h-80 flex flex-col">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/30 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/20 rounded-full blur-lg"></div>
                <div className="mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 drop-shadow"><AnimatedText text={ex.title} speed={160} /></h3>
                </div>
                <div className="text-sm text-gray-700 mb-3"><AnimatedText text={ex.description} speed={170} /></div>
                
                {/* Large icon/image in the center */}
                <div className="flex-1 flex items-center justify-center my-2">
                  <div className="text-9xl opacity-80 transform transition-transform duration-300 hover:scale-110">{icons[i]}</div>
                </div>
                
                <div className="text-xs text-gray-700 bg-white/80 backdrop-blur-sm p-2 rounded border border-white/60"><AnimatedText text={ex.context} speed={180} /></div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  )
}


