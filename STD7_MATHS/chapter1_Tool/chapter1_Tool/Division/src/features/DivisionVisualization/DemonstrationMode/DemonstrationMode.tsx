import { useEffect, useMemo, useState } from 'react';
import DemoStep from './DemoStep';
import TransportControls from '../SharedControls/TransportControls';
import ResetButton from '../SharedControls/ResetButton';
import { useLanguage } from '../../../contexts/LanguageContext';

type DivisionPropertyStep = {
  title: string;
  description: string;
  example?: string;
};

export default function DemonstrationMode() {
  const { t, localizeDigitsInText, isTransitioning } = useLanguage();
  const steps = useMemo<DivisionPropertyStep[]>(() => [
    {
      title: t('sharingSweetsTitle'),
      description: t('sharingSweetsDesc'),
      example: localizeDigitsInText(t('sharingSweetsExample')),
    },
    {
      title: t('temperatureDivisionTitle'),
      description: t('temperatureDivisionDesc'),
      example: localizeDigitsInText(t('temperatureDivisionExample')),
    },
    {
      title: t('businessProfitTitle'),
      description: t('businessProfitDesc'),
      example: localizeDigitsInText(t('businessProfitExample')),
    },
    {
      title: t('groupingObjectsTitle'),
      description: t('groupingObjectsDesc'),
      example: localizeDigitsInText(t('groupingObjectsExample')),
    },
    {
      title: t('divisionPropertiesStepTitle'),
      description: t('divisionPropertiesStepDesc'),
      example: localizeDigitsInText(t('divisionPropertiesStepExample')),
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
      {/* Enhanced Header with Blue-Purple Theme */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200/50 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <TransportControls onPrev={prev} onNext={next} onPlayPause={() => setIsPlaying((v) => !v)} isPlaying={isPlaying} />
            <ResetButton onReset={reset} />
          </div>
          
          {/* Enhanced Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              {t('step')} {localizeDigitsInText(String(index + 1))} / {localizeDigitsInText(String(steps.length))}
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-700 ease-out"
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
        <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-xl border border-blue-100 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1"></div>
          <div className="p-4">
            <ExampleAnimation stepIndex={index} playing={isPlaying && !isTransitioning} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ExampleAnimation({ stepIndex, playing }: { stepIndex: number; playing: boolean }) {
  switch (stepIndex) {
    case 0:
      return <SweetSharingAnimation totalSweets={12} friends={3} playing={playing} />;
    case 1:
      return <TemperatureDropAnimation totalDrop={-20} days={4} playing={playing} />;
    case 2:
      return <BusinessLossAnimation totalLoss={-800} months={4} playing={playing} />;
    case 3:
      return <GroupingAnimation totalItems={15} groupSize={5} playing={playing} />;
    default:
      return <DivisionPropertyBadges />;
  }
}

function SweetSharingAnimation({ totalSweets, friends, playing }: { totalSweets: number; friends: number; playing: boolean }) {
  const { localizeDigitsInText, formatNumber, t } = useLanguage();
  const sweetsPerFriend = totalSweets / friends;
  const [distributed, setDistributed] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setDistributed(0);
    setShowResult(false);
    if (!playing) return;
    
    const distributeTimer = setTimeout(() => setDistributed(sweetsPerFriend), 500);
    const resultTimer = setTimeout(() => setShowResult(true), 1200);
    
    return () => {
      clearTimeout(distributeTimer);
      clearTimeout(resultTimer);
    };
  }, [sweetsPerFriend, playing]);

  return (
    <div className="rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200/60 p-4 shadow-lg mt-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 via-red-400/5 to-orange-400/5 animate-pulse" />
      
      <div className="relative z-10">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-orange-700 mb-2">🍭 Sweet Sharing Division</h3>
          <p className="text-sm text-gray-600">{totalSweets} sweets ÷ {friends} friends = {sweetsPerFriend} sweets each</p>
        </div>

        <div className="flex justify-center items-center space-x-8">
          {/* Total Sweets */}
          <div className="text-center">
            <div className="text-4xl mb-2">🍭</div>
            <div className="text-2xl font-bold text-orange-600">
              {localizeDigitsInText(formatNumber(totalSweets))}
            </div>
            <div className="text-xs text-gray-500">Total Sweets</div>
          </div>

          {/* Division Arrow */}
          <div className="text-3xl text-orange-500 animate-bounce">➗</div>

          {/* Friends */}
          <div className="text-center">
            <div className="flex space-x-1 mb-2">
              {[...Array(friends)].map((_, i) => (
                <div key={i} className="text-2xl">👦</div>
              ))}
            </div>
            <div className="text-2xl font-bold text-red-600">
              {localizeDigitsInText(formatNumber(friends))}
            </div>
            <div className="text-xs text-gray-500">Friends</div>
          </div>

          {/* Equals */}
          <div className="text-3xl text-gray-600">=</div>

          {/* Result */}
          <div className="text-center">
            <div className="text-4xl mb-2">🍭</div>
            <div className={`text-2xl font-bold transition-all duration-800 ${
              showResult ? 'text-green-600 scale-110' : 'text-gray-400'
            }`}>
              {showResult ? localizeDigitsInText(formatNumber(distributed)) : '?'}
            </div>
            <div className="text-xs text-gray-500">Per Friend</div>
          </div>
        </div>

        {showResult && (
          <div className="mt-4 text-center p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-orange-200/50">
            <div className="text-sm font-medium text-green-700">
              ✅ Each friend gets {localizeDigitsInText(formatNumber(sweetsPerFriend))} sweets!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TemperatureDropAnimation({ totalDrop, days, playing }: { totalDrop: number; days: number; playing: boolean }) {
  const { localizeDigitsInText, formatNumber } = useLanguage();
  const dailyDrop = totalDrop / days;
  const [currentDrop, setCurrentDrop] = useState(0);
  const [showDailyAverage, setShowDailyAverage] = useState(false);

  useEffect(() => {
    setCurrentDrop(0);
    setShowDailyAverage(false);
    if (!playing) return;
    
    const dropTimer = setTimeout(() => setCurrentDrop(dailyDrop), 600);
    const averageTimer = setTimeout(() => setShowDailyAverage(true), 1200);
    
    return () => {
      clearTimeout(dropTimer);
      clearTimeout(averageTimer);
    };
  }, [dailyDrop, playing]);

  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200/60 p-4 shadow-lg mt-2">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-blue-700 mb-2">🌡️ Temperature Division</h3>
        <p className="text-sm text-gray-600">{totalDrop}°C ÷ {days} days = {dailyDrop}°C per day</p>
      </div>

      <div className="flex justify-center items-center space-x-6">
        {/* Total Drop */}
        <div className="text-center">
          <div className="text-4xl mb-2">📉</div>
          <div className="text-2xl font-bold text-blue-600">
            {localizeDigitsInText(formatNumber(totalDrop))}°C
          </div>
          <div className="text-xs text-gray-500">Total Drop</div>
        </div>

        <div className="text-3xl text-blue-500">➗</div>

        {/* Days */}
        <div className="text-center">
          <div className="text-4xl mb-2">📅</div>
          <div className="text-2xl font-bold text-purple-600">
            {localizeDigitsInText(formatNumber(days))}
          </div>
          <div className="text-xs text-gray-500">Days</div>
        </div>

        <div className="text-3xl text-gray-600">=</div>

        {/* Daily Average */}
        <div className="text-center">
          <div className="text-4xl mb-2">🌡️</div>
          <div className={`text-2xl font-bold transition-all duration-800 ${
            showDailyAverage ? 'text-red-600 scale-110' : 'text-gray-400'
          }`}>
            {showDailyAverage ? `${localizeDigitsInText(formatNumber(currentDrop))}°C` : '?'}
          </div>
          <div className="text-xs text-gray-500">Per Day</div>
        </div>
      </div>

      {showDailyAverage && (
        <div className="mt-4 text-center p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-blue-200/50">
          <div className="text-sm font-medium text-red-700">
            📊 Average daily temperature drop: {localizeDigitsInText(formatNumber(currentDrop))}°C
          </div>
        </div>
      )}
    </div>
  );
}

function BusinessLossAnimation({ totalLoss, months, playing }: { totalLoss: number; months: number; playing: boolean }) {
  const { localizeDigitsInText, formatNumber } = useLanguage();
  const monthlyLoss = totalLoss / months;
  const [currentLoss, setCurrentLoss] = useState(0);
  const [showMonthlyAverage, setShowMonthlyAverage] = useState(false);

  useEffect(() => {
    setCurrentLoss(0);
    setShowMonthlyAverage(false);
    if (!playing) return;
    
    const lossTimer = setTimeout(() => setCurrentLoss(monthlyLoss), 600);
    const averageTimer = setTimeout(() => setShowMonthlyAverage(true), 1200);
    
    return () => {
      clearTimeout(lossTimer);
      clearTimeout(averageTimer);
    };
  }, [monthlyLoss, playing]);

  return (
    <div className="rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200/60 p-4 shadow-lg mt-2">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-red-700 mb-2">💼 Business Loss Division</h3>
        <p className="text-sm text-gray-600">₹{Math.abs(totalLoss)} loss ÷ {months} months = ₹{Math.abs(monthlyLoss)} per month</p>
      </div>

      <div className="flex justify-center items-center space-x-6">
        {/* Total Loss */}
        <div className="text-center">
          <div className="text-4xl mb-2">📉</div>
          <div className="text-2xl font-bold text-red-600">
            ₹{localizeDigitsInText(formatNumber(Math.abs(totalLoss)))}
          </div>
          <div className="text-xs text-gray-500">Total Loss</div>
        </div>

        <div className="text-3xl text-red-500">➗</div>

        {/* Months */}
        <div className="text-center">
          <div className="text-4xl mb-2">📆</div>
          <div className="text-2xl font-bold text-orange-600">
            {localizeDigitsInText(formatNumber(months))}
          </div>
          <div className="text-xs text-gray-500">Months</div>
        </div>

        <div className="text-3xl text-gray-600">=</div>

        {/* Monthly Loss */}
        <div className="text-center">
          <div className="text-4xl mb-2">💸</div>
          <div className={`text-2xl font-bold transition-all duration-800 ${
            showMonthlyAverage ? 'text-red-600 scale-110' : 'text-gray-400'
          }`}>
            {showMonthlyAverage ? `₹${localizeDigitsInText(formatNumber(Math.abs(currentLoss)))}` : '?'}
          </div>
          <div className="text-xs text-gray-500">Per Month</div>
        </div>
      </div>

      {showMonthlyAverage && (
        <div className="mt-4 text-center p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-red-200/50">
          <div className="text-sm font-medium text-red-700">
            📊 Average monthly loss: ₹{localizeDigitsInText(formatNumber(Math.abs(currentLoss)))}
          </div>
        </div>
      )}
    </div>
  );
}

function GroupingAnimation({ totalItems, groupSize, playing }: { totalItems: number; groupSize: number; playing: boolean }) {
  const { localizeDigitsInText, formatNumber } = useLanguage();
  const numberOfGroups = totalItems / groupSize;
  const [groups, setGroups] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setGroups(0);
    setShowResult(false);
    if (!playing) return;
    
    const groupTimer = setTimeout(() => setGroups(numberOfGroups), 600);
    const resultTimer = setTimeout(() => setShowResult(true), 1200);
    
    return () => {
      clearTimeout(groupTimer);
      clearTimeout(resultTimer);
    };
  }, [numberOfGroups, playing]);

  return (
    <div className="rounded-xl bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200/60 p-4 shadow-lg mt-2">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-green-700 mb-2">📦 Grouping Objects</h3>
        <p className="text-sm text-gray-600">{totalItems} items ÷ {groupSize} per group = {numberOfGroups} groups</p>
      </div>

      <div className="flex justify-center items-center space-x-6">
        {/* Total Items */}
        <div className="text-center">
          <div className="grid grid-cols-5 gap-1 mb-2">
            {[...Array(totalItems)].map((_, i) => (
              <div key={i} className="text-sm">⚪</div>
            ))}
          </div>
          <div className="text-2xl font-bold text-green-600">
            {localizeDigitsInText(formatNumber(totalItems))}
          </div>
          <div className="text-xs text-gray-500">Total Items</div>
        </div>

        <div className="text-3xl text-green-500">➗</div>

        {/* Group Size */}
        <div className="text-center">
          <div className="flex space-x-1 mb-2">
            {[...Array(groupSize)].map((_, i) => (
              <div key={i} className="text-lg">⚪</div>
            ))}
          </div>
          <div className="text-2xl font-bold text-teal-600">
            {localizeDigitsInText(formatNumber(groupSize))}
          </div>
          <div className="text-xs text-gray-500">Per Group</div>
        </div>

        <div className="text-3xl text-gray-600">=</div>

        {/* Number of Groups */}
        <div className="text-center">
          <div className="text-4xl mb-2">📦</div>
          <div className={`text-2xl font-bold transition-all duration-800 ${
            showResult ? 'text-green-600 scale-110' : 'text-gray-400'
          }`}>
            {showResult ? localizeDigitsInText(formatNumber(groups)) : '?'}
          </div>
          <div className="text-xs text-gray-500">Groups</div>
        </div>
      </div>

      {showResult && (
        <div className="mt-4 text-center p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-green-200/50">
          <div className="text-sm font-medium text-green-700">
            ✅ We can make {localizeDigitsInText(formatNumber(groups))} groups of {localizeDigitsInText(formatNumber(groupSize))} items each!
          </div>
        </div>
      )}
    </div>
  );
}

function DivisionPropertyBadges() {
  const { t } = useLanguage();
  const [visibleProperties, setVisibleProperties] = useState<number>(0);
  
  const properties = [
    { name: 'Not Commutative', icon: '❌🔄', color: 'from-red-500 to-red-600' },
    { name: 'Not Associative', icon: '❌🤝', color: 'from-orange-500 to-orange-600' },
    { name: 'Identity ÷1', icon: '🎯', color: 'from-green-600 to-green-500' },  
    { name: 'Zero Property', icon: '0️⃣', color: 'from-blue-600 to-blue-500' },
    { name: 'Distributive', icon: '📊', color: 'from-purple-500 to-purple-600' },
    { name: 'Sign Rules', icon: '±', color: 'from-teal-500 to-teal-600' },
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
    }, 300);
    
    return () => clearInterval(timer);
  }, [properties.length]);
  
  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200/60 shadow-lg mt-2">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
          📐 Division Properties
        </h3>
        <p className="text-sm text-gray-600 mt-1">Key mathematical properties of integer division</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {properties.slice(0, visibleProperties).map((property, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-xl border border-white/50 shadow-md transition-all duration-500 hover:scale-105 hover:shadow-lg animate-fade-in transform ${
              index % 2 === 0 ? 'rotate-1' : '-rotate-1'
            } hover:rotate-0`}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${property.color} opacity-90`} />
            <div className="relative z-10 p-3 text-center">
              <div className="text-lg mb-1 group-hover:animate-bounce">{property.icon}</div>
              <div className="text-xs font-semibold text-white leading-tight">
                {property.name}
              </div>
            </div>
            
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-white/80 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {visibleProperties < properties.length && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/60 rounded-full">
            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
            <span className="text-xs text-gray-600 ml-2">Loading properties...</span>
          </div>
        </div>
      )}
    </div>
  );
}