import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function RealWorldRoute() {
  const { t, localizeDigitsInText, formatNumber } = useLanguage();
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center py-8 bg-gradient-to-br from-brand-50 to-accent-50 rounded-3xl border border-brand-100">
        <div className="text-6xl mb-4">🌍</div>
        <h1 className="text-3xl font-bold text-brand-700 mb-2">{t('realWorld')}</h1>
        <p className="text-brand-600 max-w-2xl mx-auto">
          {t('realWorldSubtitle') || 'Discover how integers work in everyday situations'}
        </p>
      </div>

      {/* Interactive Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ThermometerCard title={t('temp')} start={-4} change={9} />
        <WalletCard title={t('bank')} start={-700} change={1000} currency="₹" />
        <ElevationCard title={t('elevation')} start={-15} up={20} down={12} unit="m" />
      </div>

      {/* Additional Real World Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SportScoreCard />
        <DebtPaymentCard />
      </div>

      {/* Interactive Tip */}
      <div className="text-center p-6 bg-accent-50 rounded-2xl border border-accent-100">
        <div className="text-2xl mb-2">💡</div>
        <p className="text-accent-700 font-medium">
          {localizeDigitsInText(t('replayTip') || 'Click any card to replay animations!')}
        </p>
      </div>
    </div>
  );
}

function ThermometerCard({ title, start, change }: { title: string; start: number; change: number }) {
  const { localizeDigitsInText, formatNumber, t } = useLanguage();
  const final = start + change;
  const min = -10, max = 40;
  const [p, setP] = useState(0);
  useEffect(() => {
    setP(0);
    const id = setTimeout(() => setP((final - min) / (max - min)), 50);
    return () => clearTimeout(id);
  }, [final]);
  
  return (
    <Card 
      title={`🌡️ ${title}`} 
      subtitle={localizeDigitsInText(`${formatNumber(start)}°C + ${formatNumber(change)}°C = ${formatNumber(final)}°C`)} 
      onReplay={() => setP(0)}
    >
      <div className="flex items-center justify-center h-40">
        <div className="flex items-end gap-6">
          <svg viewBox="0 0 60 160" className="h-40 w-20">
            {/* Thermometer outline */}
            <rect x="24" y="10" width="12" height="110" rx="6" className="fill-gray-100 stroke-brand-300 stroke-2" />
            <circle cx="30" cy="130" r="18" className="fill-gray-100 stroke-brand-300 stroke-2" />
            
            {/* Temperature scale */}
            <rect x="22" y="20" width="2" height="2" className="fill-brand-400" />
            <rect x="22" y="40" width="2" height="2" className="fill-brand-400" />
            <rect x="22" y="60" width="2" height="2" className="fill-brand-400" />
            <rect x="22" y="80" width="2" height="2" className="fill-brand-400" />
            <rect x="22" y="100" width="2" height="2" className="fill-brand-400" />
            
            {/* Mercury/liquid */}
            <clipPath id="thermoClip"><rect x="26" y="12" width="8" height="116" rx="4" /></clipPath>
            <g clipPath="url(#thermoClip)">
              <rect 
                x="26" 
                y={128 - p * 116} 
                width="8" 
                height={116} 
                className={`transition-all duration-1000 ${final > 0 ? 'fill-error-500' : 'fill-brand-500'}`} 
              />
            </g>
            <circle cx="30" cy="130" r="15" className={`${final > 0 ? 'fill-error-500' : 'fill-brand-500'}`} />
            
            {/* Temperature display */}
            <text x="30" y="135" textAnchor="middle" className="fill-white text-sm font-bold">
              {formatNumber(Math.round(start + p * change))}
            </text>
          </svg>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-200"></div>
              <span className="text-brand-600">{localizeDigitsInText(`${t('startLabel') || 'Start'}: ${formatNumber(start)}°C`)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-400"></div>
              <span className="text-accent-600">{localizeDigitsInText(`${t('changeLabel') || 'Change'}: ${change > 0 ? '+' : ''}${formatNumber(change)}°C`)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${final > 0 ? 'bg-error-500' : 'bg-brand-500'}`}></div>
              <span className={`font-bold ${final > 0 ? 'text-error-600' : 'text-brand-700'}`}>
                {localizeDigitsInText(`${t('finalLabel') || 'Final'}: ${formatNumber(final)}°C`)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function WalletCard({ title, start, change, currency }: { title: string; start: number; change: number; currency: string }) {
  const { localizeDigitsInText, formatNumber, t } = useLanguage();
  const final = start + change;
  const [balance, setBalance] = useState(start);
  const [phase, setPhase] = useState<'start' | 'adding' | 'end'>('start');
  
  useEffect(() => {
    setPhase('start');
    setBalance(start);
    const id = setTimeout(() => {
      setPhase('adding');
      setBalance(final);
    }, 500);
    const endId = setTimeout(() => setPhase('end'), 1500);
    return () => { clearTimeout(id); clearTimeout(endId); };
  }, [start, final]);
  
  return (
    <Card 
      title={`💰 ${title}`} 
      subtitle={localizeDigitsInText(`${currency}${formatNumber(start)} + ${currency}${formatNumber(change)} = ${currency}${formatNumber(final)}`)} 
      onReplay={() => setPhase('start')}
    >
      <div className="h-40 flex flex-col items-center justify-center">
        {/* Wallet Animation */}
        <div className="text-6xl mb-4 animate-pulse-soft">💳</div>
        
        {/* Balance Display */}
        <div className={`text-3xl font-bold transition-all duration-1000 ${
          balance >= 0 ? 'text-success-600' : 'text-error-600'
        }`}>
          {currency}{localizeDigitsInText(formatNumber(balance))}
        </div>
        
        {/* Transaction Animation */}
        {phase === 'adding' && (
          <div className="text-lg text-accent-600 font-medium mt-2 animate-scale-in">
            {change > 0 ? '💰 +' : '💸 '}{currency}{localizeDigitsInText(formatNumber(Math.abs(change)))}
          </div>
        )}
        
        {/* Status Indicators */}
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <span className="text-gray-600">{t('startLabel') || 'Start'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${phase === 'adding' || phase === 'end' ? 'bg-accent-500' : 'bg-gray-200'} transition-colors`}></div>
            <span className="text-accent-600">{t('changeLabel') || 'Change'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${phase === 'end' ? (final >= 0 ? 'bg-success-500' : 'bg-error-500') : 'bg-gray-200'} transition-colors`}></div>
            <span className={final >= 0 ? 'text-success-600' : 'text-error-600'}>{t('finalLabel') || 'Final'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ElevationCard({ title, start, up, down, unit }: { title: string; start: number; up: number; down: number; unit: string }) {
  const { localizeDigitsInText, formatNumber, t } = useLanguage();
  const mid = start + up;
  const final = mid - down;
  const [phase, setPhase] = useState<'start' | 'up' | 'down' | 'end'>('start');
  const [elevation, setElevation] = useState(start);
  
  useEffect(() => {
    setPhase('start');
    setElevation(start);
    const a = setTimeout(() => { setPhase('up'); setElevation(mid); }, 500);
    const b = setTimeout(() => { setPhase('down'); setElevation(final); }, 1500);
    const c = setTimeout(() => setPhase('end'), 2500);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
  }, [start, up, down, mid, final]);
  
  const y = phase === 'start' ? 80 : phase === 'up' ? 40 : phase === 'down' ? 60 : 60;
  
  return (
    <Card 
      title={`🏔️ ${title}`} 
      subtitle={localizeDigitsInText(`${formatNumber(start)}${unit} + ${formatNumber(up)} − ${formatNumber(down)} = ${formatNumber(final)}${unit}`)} 
      onReplay={() => setPhase('start')}
    >
      <div className="h-40 flex flex-col items-center">
        {/* Mountain Landscape */}
        <svg viewBox="0 0 200 100" className="w-full h-32">
          {/* Background mountains */}
          <polygon points="0,100 40,40 80,100" className="fill-brand-100" />
          <polygon points="50,100 100,20 150,100" className="fill-brand-200" />
          <polygon points="120,100 160,35 200,100" className="fill-brand-150" />
          
          {/* Elevation line */}
          <line x1="0" y1="80" x2="200" y2="80" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="5,5" />
          <text x="5" y="78" className="fill-gray-500 text-xs">Sea Level</text>
          
          {/* Moving object (helicopter/bird) */}
          <circle 
            cx="100" 
            cy={y} 
            r="4" 
            className="fill-accent-600 transition-all duration-1000" 
          />
          <text x="105" y={y + 1} className="fill-accent-700 text-xs font-bold">
            🚁
          </text>
        </svg>
        
        {/* Elevation Display */}
        <div className="text-center mt-4">
          <div className={`text-2xl font-bold transition-all duration-500 ${
            elevation > 0 ? 'text-success-600' : elevation < 0 ? 'text-error-600' : 'text-gray-600'
          }`}>
            {localizeDigitsInText(`${elevation > 0 ? '+' : ''}${formatNumber(elevation)}${unit}`)}
          </div>
          
          {/* Phase Indicator */}
          <div className="text-sm mt-2">
            {phase === 'up' && (
              <span className="text-success-600 font-medium">
                🔺 {t('upLabel') || 'Going Up'} +{localizeDigitsInText(formatNumber(up))}{unit}
              </span>
            )}
            {phase === 'down' && (
              <span className="text-error-600 font-medium">
                🔻 {t('downLabel') || 'Going Down'} -{localizeDigitsInText(formatNumber(down))}{unit}
              </span>
            )}
            {phase === 'end' && (
              <span className="text-brand-700 font-medium">
                📍 {t('finalLabel') || 'Final Position'}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function SportScoreCard() {
  const { localizeDigitsInText, formatNumber, t } = useLanguage();
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<'start' | 'goal' | 'penalty' | 'end'>('start');
  
  useEffect(() => {
    setPhase('start');
    setScore(0);
    const a = setTimeout(() => { setPhase('goal'); setScore(5); }, 500);
    const b = setTimeout(() => { setPhase('penalty'); setScore(2); }, 1500);
    const c = setTimeout(() => setPhase('end'), 2500);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
  }, []);

  return (
    <Card 
      title={t('sportsScore') || '⚽ Sports Score'} 
      subtitle={localizeDigitsInText(`${formatNumber(0)} + ${formatNumber(5)} - ${formatNumber(3)} = ${formatNumber(2)}`)}
      onReplay={() => setPhase('start')}
    >
      <div className="h-32 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-2">⚽</div>
          <div className="text-3xl font-bold text-brand-600 transition-all duration-500">
            {localizeDigitsInText(formatNumber(score))}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {phase === 'goal' && '🎯 +5 Goal!'}
            {phase === 'penalty' && '❌ -3 Penalty'}
            {phase === 'end' && '🏆 Final Score'}
          </div>
        </div>
      </div>
    </Card>
  );
}

function DebtPaymentCard() {
  const { localizeDigitsInText, formatNumber, t } = useLanguage();
  const [debt, setDebt] = useState(-500);
  const [phase, setPhase] = useState<'start' | 'payment' | 'end'>('start');
  
  useEffect(() => {
    setPhase('start');
    setDebt(-500);
    const a = setTimeout(() => { setPhase('payment'); setDebt(-200); }, 500);
    const b = setTimeout(() => setPhase('end'), 1500);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  return (
    <Card 
      title={t('debtPayment') || '💳 Debt Payment'} 
      subtitle={localizeDigitsInText(`₹${formatNumber(-500)} + ₹${formatNumber(300)} = ₹${formatNumber(-200)}`)}
      onReplay={() => setPhase('start')}
    >
      <div className="h-32 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">💳</div>
          <div className={`text-2xl font-bold transition-all duration-500 ${debt < 0 ? 'text-error-500' : 'text-success-500'}`}>
            ₹{localizeDigitsInText(formatNumber(debt))}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {phase === 'payment' && '💰 +₹300 Payment'}
            {phase === 'end' && '📊 Remaining Debt'}
          </div>
        </div>
      </div>
    </Card>
  );
}

function Card({ title, subtitle, children, onReplay }: { title: string; subtitle?: string; children: React.ReactNode; onReplay?: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-glow hover:shadow-glow-purple transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-bold text-lg text-brand-700">{title}</div>
          {subtitle && <div className="text-brand-600 text-sm mt-1">{subtitle}</div>}
        </div>
        {onReplay && (
          <button 
            className="px-3 py-1.5 text-sm rounded-full border-2 border-accent-500 text-accent-600 hover:bg-accent-500 hover:text-white transition-all duration-200 font-medium"
            onClick={onReplay}
          >
            🔄 {t('replay')}
          </button>
        )}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}


