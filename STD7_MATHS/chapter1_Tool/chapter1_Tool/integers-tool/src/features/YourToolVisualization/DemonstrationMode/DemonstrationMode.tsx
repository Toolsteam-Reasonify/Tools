import { useEffect, useMemo, useState } from 'react';
import DemoStep from './DemoStep';
import TransportControls from '../SharedControls/TransportControls';
import ResetButton from '../SharedControls/ResetButton';
import { useLanguage } from '../../../contexts/LanguageContext';

type IntegerPropertyStep = {
  title: string;
  description: string;
  example?: string;
};

export default function DemonstrationMode() {
  const { t, localizeDigitsInText, isTransitioning } = useLanguage();
  const steps = useMemo<IntegerPropertyStep[]>(() => [
    {
      title: t('tempChangeTitle'),
      description: t('tempChangeDesc'),
      example: localizeDigitsInText(t('tempChangeExample')),
    },
    {
      title: t('bankBalanceTitle'),
      description: t('bankBalanceDesc'),
      example: localizeDigitsInText(t('bankBalanceExample')),
    },
    {
      title: t('elevationTitle'),
      description: t('elevationDesc'),
      example: localizeDigitsInText(t('elevationExample')),
    },
    {
      title: t('numberLineTitle'),
      description: t('numberLineDesc'),
      example: localizeDigitsInText(t('numberLineExample')),
    },
    {
      title: t('propertiesTitle'),
      description: t('propertiesDesc'),
      example: localizeDigitsInText(t('propertiesExample')),
    },
  ], [t, localizeDigitsInText]);

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function next() {
    setIndex((i) => Math.min(i + 1, steps.length - 1));
  }
  function prev() {
    setIndex((i) => Math.max(i - 1, 0));
  }
  function reset() {
    setIndex(0);
    setIsPlaying(false);
  }

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setIndex((i) => {
        if (i >= steps.length - 1) {
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 2500);
    return () => clearInterval(id);
  }, [isPlaying, steps.length]);

  return (
    <div className={`space-y-6 transition-all duration-500 ease-out ${
      isTransitioning ? 'opacity-30 scale-95 blur-sm' : 'opacity-100 scale-100 blur-none'
    }`}>
      {/* Enhanced Header with Teal-Purple Theme */}
      <div className="bg-gradient-to-r from-teal-50 to-purple-50 p-4 rounded-xl border border-teal-200/50 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <TransportControls onPrev={prev} onNext={next} onPlayPause={() => setIsPlaying((v) => !v)} isPlaying={isPlaying} />
            <ResetButton onReset={reset} />
          </div>
          
          {/* Enhanced Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium bg-gradient-to-r from-teal-700 to-purple-700 bg-clip-text text-transparent">
              {t('step')} {localizeDigitsInText(String(index + 1))} / {localizeDigitsInText(String(steps.length))}
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-400 to-purple-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${((index + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content Section */}
      <div className={`transition-all duration-700 ease-out ${
        isTransitioning ? 'translate-y-4 opacity-50 scale-98' : 'translate-y-0 opacity-100 scale-100'
      }`}>
        <DemoStep 
          title={steps[index].title} 
          description={steps[index].description} 
          example={steps[index].example}
          isActive={!isTransitioning}
          stepNumber={index + 1}
        />
      </div>

      {/* Enhanced Animation Section */}
      <div className={`transition-all duration-800 ease-out delay-200 ${
        isTransitioning ? 'translate-y-6 opacity-40 scale-95' : 'translate-y-0 opacity-100 scale-100'
      }`}>
        <div className="bg-gradient-to-br from-white to-teal-50/50 rounded-xl border border-teal-100 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-purple-600 h-1"></div>
          <div className="p-4">
            <ExampleAnimation stepIndex={index} playing={isPlaying && !isTransitioning} />
          </div>
        </div>
      </div>
    </div>
  );
}

function NumberLine({ a, b, op, isPlaying }: { a: number; b: number; op: 'add' | 'sub'; isPlaying: boolean }) {
  const { formatNumber } = useLanguage();
  const end = op === 'add' ? a + b : a - b;
  const min = Math.min(a, end, -10);
  const max = Math.max(a, end, 10);
  const range = max - min;
  const [progress, setProgress] = useState(0);
  function pos(x: number) {
    return ((x - min) / (range || 1)) * 100;
  }
  useEffect(() => {
    setProgress(0);
    if (!isPlaying) return;
    const start = performance.now();
    const duration = 1200;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setProgress(p);
      if (p < 1 && isPlaying) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [a, b, op, isPlaying, min, max]);
  return (
    <div className="rounded-xl border bg-white p-5 shadow-soft">
      <div className="h-24 relative">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-300"></div>
        <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-brand-600" style={{ left: `${pos(a)}%` }} title={`start ${a}`}></div>
        <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-accent-600" style={{ left: `${pos(end)}%` }} title={`end ${end}`}></div>
        <div className="absolute -bottom-2 text-sm" style={{ left: `${pos(min)}%` }}>{formatNumber(min)}</div>
        <div className="absolute -bottom-2 text-sm" style={{ left: `${pos(0)}%` }}>{formatNumber(0)}</div>
        <div className="absolute -bottom-2 text-sm" style={{ left: `${pos(max)}%` }}>{formatNumber(max)}</div>
      </div>
      <div className="text-base font-medium text-slate-700 mt-2">{formatNumber(a)} {op === 'add' ? '+' : '-'} {formatNumber(b)} = <span className="text-brand-700">{formatNumber(end)}</span></div>
    </div>
  );
}

function ExampleAnimation({ stepIndex, playing }: { stepIndex: number; playing: boolean }) {
  switch (stepIndex) {
    case 0:
      return <MiniThermometer start={-3} change={5} playing={playing} />;
    case 1:
      return <div className="space-y-2">
        <MiniWallet start={-500} change={800} currency="₹" playing={playing} />
        <MiniWallet start={200} change={-450} currency="₹" playing={playing} />
      </div>;
    case 2:
      return <MiniElevation start={-20} up={35} down={40} unit="m" playing={playing} />;
    case 3:
      return <MiniNumberLine a={6} b={9} op="sub" playing={playing} />;
    default:
      return <PropertyBadges />;
  }
}

function MiniThermometer({ start, change, playing }: { start: number; change: number; playing: boolean }) {
  const { localizeDigitsInText, formatNumber, t } = useLanguage();
  const final = start + change;
  const min = -10, max = 40;
  const [p, setP] = useState(0);
  const [showBubbles, setShowBubbles] = useState(false);

  useEffect(() => {
    setP(0);
    setShowBubbles(false);
    if (!playing) return;
    
    const animateTemp = setTimeout(() => setP((final - min) / (max - min)), 300);
    const showBubblesTimer = setTimeout(() => setShowBubbles(true), 800);
    
    return () => {
      clearTimeout(animateTemp);
      clearTimeout(showBubblesTimer);
    };
  }, [final, playing]);

  return (
    <div className="rounded-xl bg-gradient-to-br from-teal-50 to-purple-50 border-2 border-teal-200/60 p-4 shadow-lg mt-2 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-400/5 via-purple-400/5 to-teal-400/5 animate-pulse" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="relative">
          <svg viewBox="0 0 60 160" className="h-28 w-10">
            {/* Thermometer Background */}
            <rect x="26" y="15" width="8" height="105" rx="4" className="fill-gray-200 stroke-gray-300" strokeWidth="0.5" />
            <circle cx="30" cy="130" r="12" className="fill-gray-200 stroke-gray-300" strokeWidth="0.5" />
            
            {/* Temperature Fill */}
            <clipPath id="miniThermo"><rect x="26" y="15" width="8" height="115" rx="4" /></clipPath>
            <g clipPath="url(#miniThermo)">
              <rect 
                x="26" 
                y={130 - p * 115} 
                width="8" 
                height={115} 
                className="transition-all duration-1500 ease-out"
                fill={`url(#tempGradient-${final >= 0 ? 'warm' : 'cold'})`}
              />
            </g>
            <circle cx="30" cy="130" r="10" fill={`url(#tempGradient-${final >= 0 ? 'warm' : 'cold'})`} />
            
            {/* Temperature Gradients */}
            <defs>
              <linearGradient id="tempGradient-warm" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="rgb(239, 68, 68)" />
                <stop offset="50%" stopColor="rgb(251, 146, 60)" />
                <stop offset="100%" stopColor="rgb(234, 179, 8)" />
              </linearGradient>
              <linearGradient id="tempGradient-cold" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="rgb(59, 130, 246)" />
                <stop offset="50%" stopColor="rgb(14, 165, 233)" />
                <stop offset="100%" stopColor="rgb(6, 182, 212)" />
              </linearGradient>
            </defs>
            
            {/* Temperature Scale */}
            {[0, 10, 20, 30].map(temp => {
              const y = 130 - ((temp - min) / (max - min)) * 115;
              return (
                <g key={temp}>
                  <line x1="22" y1={y} x2="24" y2={y} stroke="rgb(107, 114, 128)" strokeWidth="0.5" />
                  <text x="20" y={y + 2} fontSize="6" fill="rgb(75, 85, 99)" textAnchor="end">{temp}</text>
                </g>
              );
            })}
          </svg>

          {/* Animated Bubbles for Temperature Change */}
          {showBubbles && change > 0 && (
            <div className="absolute top-2 left-8 flex items-center space-x-1">
              <span className="text-xs text-orange-600 font-medium">Loading</span>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="w-1 h-1 bg-orange-400 rounded-full animate-loading-dots"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Text Display */}
        <div className="flex-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-teal-200/50 shadow-inner">
            <div className="text-sm font-medium text-gray-800 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-teal-600">📍 {t('startLabel')}:</span>
                <span className="font-bold">{formatNumber(start)}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-600">📈 {t('changeLabel')}:</span>
                <span className={`font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change >= 0 ? '+' : ''}{formatNumber(change)}°C
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
                <span className="text-gray-600">🎯 {t('finalLabel')}:</span>
                <span className={`font-bold text-lg ${final >= 0 ? 'text-orange-600' : 'text-blue-600'}`}>
                  {formatNumber(final)}°C
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniWallet({ start, change, currency, playing }: { start: number; change: number; currency: string; playing: boolean }) {
  const { localizeDigitsInText, formatNumber, t } = useLanguage();
  const final = start + change;
  const [w, setW] = useState(0);
  useEffect(() => {
    setW(0);
    if (!playing) return;
    const id = window.setTimeout(() => {
      const percent = Math.min(100, Math.max(0, ((final + 1000) / 2000) * 100));
      setW(percent);
    }, 50);
    return () => window.clearTimeout(id);
  }, [final, playing]);
  return (
    <div className="rounded-xl border bg-white p-3 shadow-soft mt-2 flex items-center gap-3">
      <svg viewBox="0 0 160 80" className="w-40 h-16">
        <rect x="10" y="20" width="120" height="40" rx="8" className="fill-slate-200 stroke-slate-400" />
        <rect x="10" y="20" width={`${w * 1.2}`} height="40" rx="8" className={`${final >= 0 ? 'fill-green-500' : 'fill-amber-500'}`} style={{ transition: 'width 800ms' }} />
        <circle cx="135" cy="40" r="6" className="fill-slate-400" />
      </svg>
      <div className="text-sm text-slate-600">
        {localizeDigitsInText(`${t('startLabel')}: ${currency}${formatNumber(start)} · ${t('changeLabel')}: ${change >= 0 ? '+' : ''}${currency}${formatNumber(change)} · ${t('finalLabel')}: ${currency}${formatNumber(final)}`)}
      </div>
    </div>
  );
}

function MiniElevation({ start, up, down, unit, playing }: { start: number; up: number; down: number; unit: string; playing: boolean }) {
  const { localizeDigitsInText, formatNumber, t } = useLanguage();
  const [phase, setPhase] = useState<'start' | 'up' | 'down' | 'end'>('start');
  useEffect(() => {
    setPhase('start');
    if (!playing) return;
    const a = setTimeout(() => setPhase('up'), 100);
    const b = setTimeout(() => setPhase('down'), 900);
    const c = setTimeout(() => setPhase('end'), 1700);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
  }, [start, up, down, playing]);
  const y = phase === 'start' ? 60 : phase === 'up' ? 30 : phase === 'down' ? 50 : 50;
  const final = start + up - down;
  return (
    <div className="rounded-xl border bg-white p-3 shadow-soft mt-2">
      <svg viewBox="0 0 240 90" className="w-full h-24">
        <path d="M0,80 L50,50 L100,80 L160,35 L220,80" className="stroke-brand-300 fill-none" strokeWidth="2" />
        <circle cx="160" cy={y} r="6" className="fill-accent-600 transition-all duration-800" />
      </svg>
      <div className="text-sm text-slate-600">
        {localizeDigitsInText(`${t('startLabel')}: ${formatNumber(start)}${unit} · ${t('upLabel')}: +${formatNumber(up)}${unit} · ${t('downLabel')}: −${formatNumber(down)}${unit} · ${t('finalLabel')}: ${formatNumber(final)}${unit}`)}
      </div>
    </div>
  );
}

function MiniNumberLine({ a, b, op, playing }: { a: number; b: number; op: 'add' | 'sub'; playing: boolean }) {
  const { formatNumber } = useLanguage();
  const end = op === 'add' ? a + b : a - b;
  const min = Math.min(a, end, -10);
  const max = Math.max(a, end, 10);
  const range = max - min;
  const [p, setP] = useState(0);
  const [showArrow, setShowArrow] = useState(false);
  const [pulseStart, setPulseStart] = useState(false);
  const [pulseEnd, setPulseEnd] = useState(false);

  useEffect(() => {
    setP(0);
    setShowArrow(false);
    setPulseStart(false);
    setPulseEnd(false);
    
    if (!playing) return;
    
    // Staggered animation sequence for better learning
    const startPulse = setTimeout(() => setPulseStart(true), 200);
    const showArrowTimer = setTimeout(() => setShowArrow(true), 600);
    const progressTimer = setTimeout(() => setP(1), 800);
    const endPulse = setTimeout(() => setPulseEnd(true), 1600);
    
    return () => {
      clearTimeout(startPulse);
      clearTimeout(showArrowTimer);
      clearTimeout(progressTimer);
      clearTimeout(endPulse);
    };
  }, [a, b, op, playing]);

  const pos = (x: number) => ((x - min) / (range || 1)) * 100;
  const startPos = pos(a);
  const endPos = pos(end);
  const currentPos = pos(a + (end - a) * p);

  return (
    <div className="rounded-xl bg-gradient-to-br from-teal-50 to-purple-50 border-2 border-teal-200/60 p-4 shadow-lg mt-2 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-400/5 via-purple-400/5 to-teal-400/5 animate-pulse" />
      
      <div className="h-20 relative z-10">
        {/* Enhanced Number Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-teal-300 to-purple-300 rounded-full shadow-inner"></div>
        
        {/* Number Line Markers */}
        {[...Array(Math.min(11, range + 1))].map((_, i) => {
          const x = min + (i * (range) / Math.min(10, range));
          const markPos = pos(x);
          return (
            <div key={i} className="absolute text-xs font-medium" style={{ left: `${markPos}%`, top: '65%' }}>
              <div className="w-0.5 h-3 bg-gray-500 mx-auto shadow-sm" />
              <div className="text-gray-700 mt-1 transform -translate-x-1/2 absolute left-1/2">
                {formatNumber(Math.round(x))}
              </div>
            </div>
          );
        })}

        {/* Starting Point */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 transition-all duration-500 ${
            pulseStart ? 'animate-pulse scale-125' : 'scale-100'
          }`} 
          style={{ left: `${startPos}%` }}
        >
          <div className="w-4 h-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full shadow-lg border-2 border-white transform -translate-x-1/2" />
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-teal-700 bg-white px-2 py-1 rounded-full shadow-sm">
            {formatNumber(a)}
          </div>
        </div>

        {/* Movement Arrow */}
        {showArrow && (
          <div 
            className="absolute top-1/2 -translate-y-1/2 transform -translate-x-1/2 transition-all duration-1000 ease-in-out"
            style={{ left: `${startPos + (endPos - startPos) * 0.5}%` }}
          >
            <div className={`flex items-center ${op === 'add' ? 'text-green-600' : 'text-red-600'}`}>
              <span className="text-sm font-bold animate-bounce">
                {op === 'add' ? '→' : '←'} {formatNumber(Math.abs(b))}
              </span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 h-3 rounded-full shadow-md transition-all duration-1200 ease-out"
          style={{ 
            left: `${Math.min(startPos, currentPos)}%`, 
            width: `${Math.abs(currentPos - startPos)}%`,
            background: op === 'add' 
              ? 'linear-gradient(90deg, rgb(20, 184, 166), rgb(134, 239, 172))' 
              : 'linear-gradient(90deg, rgb(239, 68, 68), rgb(251, 146, 60))'
          }}
        />

        {/* Ending Point */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 transition-all duration-1200 delay-500 ${
            pulseEnd ? 'animate-pulse scale-125' : 'scale-100'
          }`} 
          style={{ left: `${endPos}%` }}
        >
          <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg border-2 border-white transform -translate-x-1/2" />
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-purple-700 bg-white px-2 py-1 rounded-full shadow-sm">
            {formatNumber(end)}
          </div>
        </div>
      </div>

      {/* Enhanced Equation Display */}
      <div className="text-center mt-4 p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-teal-200/50 shadow-inner">
        <div className="text-lg font-bold text-gray-800">
          <span className="text-teal-600">{formatNumber(a)}</span>
          <span className="mx-2 text-gray-600">{op === 'add' ? '+' : '−'}</span>
          <span className="text-purple-600">{formatNumber(b)}</span>
          <span className="mx-2 text-gray-600">=</span>
          <span className={`${
            end >= 0 ? 'text-green-600' : 'text-red-600'
          } transition-all duration-300 ${pulseEnd ? 'animate-bounce' : ''}`}>
            {formatNumber(end)}
          </span>
        </div>
      </div>
    </div>
  );
}

function PropertyBadges() {
  const { t } = useLanguage();
  const [visibleProperties, setVisibleProperties] = useState<number>(0);
  
  const properties = [
    { name: t('closure'), icon: '🔒', color: 'from-teal-500 to-teal-600' },
    { name: t('commutative'), icon: '🔄', color: 'from-purple-500 to-purple-600' },
    { name: t('associative'), icon: '🤝', color: 'from-teal-600 to-purple-500' },
    { name: t('identity'), icon: '🎯', color: 'from-purple-600 to-teal-500' },  
    { name: t('inverse'), icon: '↔️', color: 'from-teal-500 to-purple-600' },
    { name: t('distributive'), icon: '📊', color: 'from-purple-500 to-teal-600' },
    { name: t('additive'), icon: '➕', color: 'from-teal-400 to-purple-400' },
    { name: t('multiplicative'), icon: '✖️', color: 'from-purple-400 to-teal-400' },
  ];

  useEffect(() => {
    setVisibleProperties(0);
    const timer = setInterval(() => {
      setVisibleProperties(prev => {
        if (prev >= properties.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 200);
    
    return () => clearInterval(timer);
  }, [properties.length]);
  
  return (
    <div className="bg-gradient-to-br from-teal-50 to-purple-50 rounded-xl p-6 border-2 border-teal-200/60 shadow-lg mt-2">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold bg-gradient-to-r from-teal-700 to-purple-700 bg-clip-text text-transparent">
          🏗️ Integer Properties
        </h3>
        <p className="text-sm text-gray-600 mt-1">Fundamental mathematical properties of integers</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {properties.slice(0, visibleProperties).map((property, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-xl border border-white/50 shadow-md transition-all duration-500 hover:scale-105 hover:shadow-lg animate-fade-in transform ${
              index % 2 === 0 ? 'rotate-1' : '-rotate-1'
            } hover:rotate-0`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${property.color} opacity-90`} />
            <div className="relative z-10 p-3 text-center">
              <div className="text-2xl mb-1 group-hover:animate-bounce">{property.icon}</div>
              <div className="text-xs font-semibold text-white leading-tight">
                {property.name}
              </div>
            </div>
            
            {/* Hover Effect */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Learning Sparkle Effect */}
            <div className="absolute top-1 right-1 w-2 h-2 bg-white/80 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* Subtle Loading Indicator */}
      {visibleProperties < properties.length && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/60 rounded-full">
            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
            <span className="text-xs text-gray-600 ml-2">Loading properties...</span>
          </div>
        </div>
      )}
    </div>
  );
}

function RealWorldExamples() {
  const items = [
    {
      title: 'Temperature',
      text: 'It is -4°C at dawn. By noon, temperature rises 9°C. Final: (-4) + 9 = 5°C.',
    },
    {
      title: 'Bank Balance',
      text: 'Account is -₹700. You add ₹1000. Final: (-700) + 1000 = 300.',
    },
    {
      title: 'Elevation',
      text: 'Start at -15 m. Climb 20 m, then descend 12 m: (-15)+20=5; 5-12=-7 m.',
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((it) => (
        <div key={it.title} className="rounded-xl border bg-white p-4 shadow-soft">
          <div className="font-semibold text-brand-700">{it.title}</div>
          <div className="text-slate-600 mt-1 text-sm">{it.text}</div>
        </div>
      ))}
    </div>
  );
}


