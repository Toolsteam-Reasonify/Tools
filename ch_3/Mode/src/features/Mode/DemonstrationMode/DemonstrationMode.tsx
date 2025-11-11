import { useEffect, useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedText from '../../../components/AnimatedText';
import { ModeCalculation } from '../../../interfaces/modeTypes';

type DemoStep = {
  id: number;
  title: string;
  description: string;
  dataset: number[];
  context: string;
  unit: string;
  visualType: 'table' | 'bar_chart' | 'number_line' | 'calculation';
  showExample?: boolean;
};

export default function DemonstrationMode() {
  const { isTransitioning, t } = useLanguage();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [selectedTableRow, setSelectedTableRow] = useState<string | null>(null);
  
  const marginsDataset = [
    ...Array(9).fill(1),
    ...Array(14).fill(2),
    ...Array(7).fill(3),
    ...Array(5).fill(4),
    ...Array(3).fill(5),
    ...Array(2).fill(6)
  ];

  const demoSteps: DemoStep[] = [
    { id: 1, title: t('step1Title'), description: '', dataset: [1,1,2,2,2,3,3,4,4], context: t('step1Context'), unit: '', visualType: 'calculation', showExample: false },
    {
      id: 2,
      title: t('step2Title'),
      description: t('step2Desc'),
      dataset: [1,1,2,2,2,3,3,4,4],
      context: t('step1Context'),
      unit: '',
      visualType: 'bar_chart',
      showExample: true
    },
    {
      id: 3,
      title: t('step3Title'),
      description: t('step3Desc'),
      dataset: marginsDataset,
      context: t('step3Context'),
      unit: '',
      visualType: 'table'
    },
    {
      id: 4,
      title: t('step4Title'),
      description: t('step4Desc'),
      dataset: [8,22,32,37,6],
      context: t('step4Context'),
      unit: '',
      visualType: 'bar_chart'
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(()=>{
    if (!isPlaying) return; const tmr = setTimeout(()=> setCurrentStep(s=> Math.min(s+1, demoSteps.length-1)), 5000); return ()=> clearTimeout(tmr);
  }, [isPlaying, currentStep]);

  const calc = (data: number[]): ModeCalculation => {
    const map: Record<string, number> = {}; data.forEach(v=>{ const k=String(v); map[k]=(map[k]||0)+1; });
    const entries = Object.entries(map); const maxF = Math.max(...entries.map(e=>e[1]));
    const modes = entries.filter(([,f])=> f===maxF).map(([k])=> Number(k)).sort((a,b)=>a-b);
    return { dataset: data, frequencyMap: map, modes, maxFrequency: maxF };
  };

  const dataCalc = calc(demoSteps[currentStep].dataset);

  return (
    <div className={`space-y-6 transition-all duration-500 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Progress header (Bargraph style) */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">📈 <AnimatedText text={`${t('headerTitle')} - ${currentStep + 1}/${demoSteps.length}`} speed={150} /></h2>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
            style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content (Bargraph style wrapper) */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-3 sm:space-y-4">
          <div className="number-card text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold text-brand-700 mb-2 sm:mb-3"><AnimatedText text={demoSteps[currentStep].title} speed={160} /></h3>
            {demoSteps[currentStep].description && (
              <p className="subtitle mb-3 sm:mb-4 leading-relaxed"><AnimatedText text={demoSteps[currentStep].description} speed={170} /></p>
            )}
            {currentStep === 0 && (
              <div className="relative overflow-hidden rounded-xl border-2 border-brand-200/60 bg-gradient-to-r from-brand-50 via-white to-accent-50 p-4 sm:p-5 mb-3">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-accent-200/30" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">📘</div>
                    <h4 className="hero-title heading-gradient"><AnimatedText text="Mode (Mo)" speed={140} /></h4>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="text-gray-700">
                      <div className="text-xl sm:text-2xl font-extrabold text-brand-700 mb-1"><AnimatedText text={t('definitionLabel')} speed={140} /></div>
                      <div className="text-lg sm:text-xl font-semibold text-gray-800"><AnimatedText text={t('modeDefText')} speed={150} /></div>
                      <ul className="list-disc ml-5 mt-2 space-y-1">
                        <li><AnimatedText text={t('bulletPopular')} speed={160} /></li>
                        <li><AnimatedText text={t('bulletMultipleModes')} speed={170} /></li>
                      </ul>
                    </div>
                    {/* Formula moved to right visual card */}
                  </div>
                </div>
              </div>
            )}
            {currentStep === 1 && (
              <div className="relative overflow-hidden rounded-xl border-2 border-brand-200/60 bg-gradient-to-r from-brand-50 via-white to-accent-50 p-4 sm:p-5 mb-3 shadow-lg">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-accent-200/30" />
                <div className="relative z-10">
                  <div className="text-sm font-medium text-gray-700 mb-2">{t('exampleUsingFormula')}</div>
                  <div className="space-y-2 text-sm">
                    <div>{t('formulaLabel')}: <span className="font-mono">Mo = {t('argMaxResult')}<sub>x</sub> f(x)</span></div>
                    <div>{t('givenData')}: <span className="font-mono">[{demoSteps[currentStep].dataset.join(', ')}]</span></div>
                    <div>
                      {t('frequencyFx')}:{' '}
                      <span className="font-mono">
                        {Object.entries(calc(demoSteps[currentStep].dataset).frequencyMap).map(([k,v],i)=> `${k}:${v}${i<Object.keys(calc(demoSteps[currentStep].dataset).frequencyMap).length-1?', ':''}`)}
                      </span>
                    </div>
                    <div>
                      {t('argMaxResult')}<sub>x</sub> f(x) ={' '}
                      <span className="font-mono">{calc(demoSteps[currentStep].dataset).modes.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 1 && (
              <div className="p-4 rounded-lg border bg-gradient-to-r from-brand-50 to-accent-50">
                <div className="text-sm font-semibold text-brand-700 mb-1">{t('tryThisQuestion')}</div>
                <div className="text-sm text-gray-700">{t('findModeOfData')}: <span className="font-mono">[{demoSteps[currentStep].dataset.join(', ')}]</span></div>
              </div>
            )}
            {currentStep !== 0 && currentStep !== 1 && (
              <div className="relative overflow-hidden rounded-xl border-2 border-brand-200/60 bg-gradient-to-r from-brand-50 via-white to-accent-50 p-4 sm:p-5 shadow-lg">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-accent-200/30" />
                <div className="relative z-10">
                  <div className="text-sm">📦 {t('data')}: {demoSteps[currentStep].dataset.join(', ')}</div>
                  <div className="mt-2 text-sm">📊 {t('frequency')}: {Object.entries(dataCalc.frequencyMap).map(([k,v])=>`${k}:${v}`).join(', ')}</div>
                  <div className="mt-2 text-sm"><span className="font-semibold">🏆 {t('modeLabel')}:</span> {dataCalc.modes.join(', ')}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div className="number-card">
            <h4 className="text-base sm:text-lg font-semibold text-accent-700 mb-3 sm:mb-4 text-center">🎨 {t('visual')}</h4>
            <div className="flex items-center justify-center">
              {currentStep === 0 ? (
                <div className="w-full max-w-xl text-center">
                  <div className="rounded-xl border-2 border-brand-200/60 p-6 bg-gradient-to-br from-brand-50 via-white to-accent-50 shadow-lg">
                    <div className="hero-title heading-gradient mb-3 leading-normal py-2">Mo = {t('argMaxResult')}<sub>x</sub> f(x)</div>
                    <div className="text-sm sm:text-base text-gray-700 leading-relaxed">{t('whereFrequency')}</div>
                  </div>
                </div>
              ) : (
                renderVis(demoSteps[currentStep], dataCalc, t, hoveredBar, setHoveredBar, selectedTableRow, setSelectedTableRow)
              )}
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Navigation buttons (Bargraph style) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 bg-white rounded-xl shadow-lg border">
        <button onClick={()=> setCurrentStep(s=> Math.max(0, s-1))} disabled={currentStep===0} className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${currentStep===0?'bg-gray-200 text-gray-400 cursor-not-allowed':'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transform hover:scale-105'}`}>← {t('previous')}</button>
        <button onClick={()=> setIsPlaying(p=>!p)} className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${isPlaying?'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl':'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-xl'}`}>{isPlaying? t('pause'): t('play')}</button>
        <button onClick={()=> setCurrentStep(s=> Math.min(demoSteps.length-1, s+1))} disabled={currentStep===demoSteps.length-1} className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${currentStep===demoSteps.length-1?'bg-gray-200 text-gray-400 cursor-not-allowed':'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'}`}>{t('next')} →</button>
      </div>
    </div>
  )
}

function renderVis(
  step: DemoStep, 
  calc: ModeCalculation, 
  t: (key: string) => string,
  hoveredBar: number | null,
  setHoveredBar: (i: number | null) => void,
  selectedTableRow: string | null,
  setSelectedTableRow: (k: string | null) => void
) {
  switch (step.visualType) {
    case 'calculation':
      if (!step.showExample) {
        return null;
      }
      return (
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg p-4 border">
            {step.showExample ? (
              <>
                <div className="text-sm font-medium text-gray-700 mb-2">{t('exampleUsingFormula')}</div>
                <div className="space-y-2 text-sm">
                  <div>{t('formulaLabel')}: <span className="font-mono">Mo = {t('argMaxResult')}<sub>x</sub> f(x)</span></div>
                  <div>{t('givenData')}: <span className="font-mono">[{step.dataset.join(', ')}]</span></div>
                  <div>
                    {t('frequencyFx')}:{' '}
                    <span className="font-mono">
                      {Object.entries(calc.frequencyMap).map(([k,v],i)=> `${k}:${v}${i<Object.keys(calc.frequencyMap).length-1?', ':''}`)}
                    </span>
                  </div>
                  <div>
                    {t('argMaxResult')}<sub>x</sub> f(x) ={' '}
                    <span className="font-mono">{calc.modes.join(', ')}</span>
                    {' '}{t('becauseHighestFreq')} ({calc.maxFrequency})
                  </div>
                  <div className="font-semibold text-purple-700">{t('thereforeMo')} {calc.modes.join(', ')}</div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      );
    case 'bar_chart':
      return (
        <div className="space-y-2 w-full max-w-md">
          {step.dataset.map((v,i)=> (
            <div 
              key={i} 
              className="flex items-center gap-2 transition-all duration-300"
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <span className={`text-xs w-8 transition-all duration-300 ${hoveredBar === i ? 'font-bold text-brand-700' : ''}`}>{i+1}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden cursor-pointer hover:h-7 transition-all duration-300">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    v===Math.max(...step.dataset)
                      ? 'bg-gradient-to-r from-purple-500 to-purple-700 animate-pulse' 
                      : hoveredBar === i 
                      ? 'bg-gradient-to-r from-blue-400 to-blue-600' 
                      : 'bg-blue-500'
                  }`} 
                  style={{ width: `${(v/Math.max(...step.dataset))*100}%` }} 
                />
                {hoveredBar === i && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
                    {v}
                  </div>
                )}
              </div>
              <span className={`text-xs w-10 text-right transition-all duration-300 ${hoveredBar === i ? 'font-bold text-brand-700 scale-110' : ''}`}>{v}</span>
            </div>
          ))}
        </div>
      );
    case 'table':
      return (
        <div className="bg-white rounded-lg p-4 border w-full max-w-md">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-100"><th className="px-2 py-1 text-left">{t('valueLabel')}</th><th className="px-2 py-1 text-left">{t('frequencyLabel')}</th></tr></thead>
            <tbody>
              {Object.entries(calc.frequencyMap).map(([k,v])=> (
                <tr 
                  key={k} 
                  onClick={() => setSelectedTableRow(selectedTableRow === k ? null : k)}
                  className={`cursor-pointer transition-all duration-300 ${
                    v===calc.maxFrequency
                      ? 'bg-gradient-to-r from-yellow-100 to-amber-100 font-bold' 
                      : selectedTableRow === k 
                      ? 'bg-blue-100' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <td className="px-2 py-2">{k} {v===calc.maxFrequency && '🏆'}</td>
                  <td className="px-2 py-2">{v} {selectedTableRow === k && '👈'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 text-xs text-gray-600 italic">💡 Click rows to select, 🏆 marks the mode</div>
        </div>
      );
    default:
      return <div className="text-gray-500">Modes: {calc.modes.join(', ')}</div>
  }
}


