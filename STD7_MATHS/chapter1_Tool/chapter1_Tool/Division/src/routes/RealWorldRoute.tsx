import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function RealWorldRoute() {
  const { t, localizeDigitsInText, formatNumber } = useLanguage();
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center py-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl border border-orange-100">
        <div className="text-6xl mb-4">🌍</div>
        <h1 className="text-3xl font-bold text-orange-700 mb-2">{t('realWorld')}</h1>
        <p className="text-orange-600 max-w-2xl mx-auto">
          {t('realWorldSubtitle') || 'Discover how integer division works in everyday situations'}
        </p>
      </div>

      {/* Interactive Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <PizzaSharingCard title="🍕 Pizza Sharing" slices={24} friends={6} />
        <MoneyDivisionCard title="💰 Money Division" amount={-150} people={5} currency="₹" />
        <TimeSchedulingCard title="⏰ Work Schedule" totalHours={40} days={8} />
      </div>

      {/* Additional Real World Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GradeDivisionCard />
        <ResourceAllocationCard />
      </div>

      {/* Interactive Tip */}
      <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-100">
        <div className="text-2xl mb-2">💡</div>
        <p className="text-red-700 font-medium">
          {localizeDigitsInText(t('replayTip') || 'Click any card to replay animations!')}
        </p>
      </div>
    </div>
  );
}

function PizzaSharingCard({ title, slices, friends }: { title: string; slices: number; friends: number }) {
  const { localizeDigitsInText, formatNumber, t } = useLanguage();
  const slicesPerFriend = slices / friends;
  const [distributed, setDistributed] = useState(0);
  const [phase, setPhase] = useState<'start' | 'dividing' | 'complete'>('start');
  
  useEffect(() => {
    setPhase('start');
    setDistributed(0);
    const divideTimer = setTimeout(() => {
      setPhase('dividing');
      setDistributed(slicesPerFriend);
    }, 500);
    const completeTimer = setTimeout(() => setPhase('complete'), 1500);
    return () => { 
      clearTimeout(divideTimer); 
      clearTimeout(completeTimer); 
    };
  }, [slicesPerFriend]);
  
  return (
    <Card 
      title={title} 
      subtitle={localizeDigitsInText(`${formatNumber(slices)} slices ÷ ${formatNumber(friends)} friends = ${formatNumber(slicesPerFriend)} slices each`)} 
      onReplay={() => setPhase('start')}
    >
      <div className="h-40 flex flex-col items-center justify-center">
        {/* Pizza Animation */}
        <div className="relative mb-4">
          <div className="text-6xl transition-transform duration-1000" style={{
            transform: phase === 'dividing' ? 'scale(1.2) rotate(180deg)' : 'scale(1) rotate(0deg)'
          }}>
            🍕
          </div>
          
          {/* Slice Counter */}
          <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {localizeDigitsInText(formatNumber(slices))}
          </div>
        </div>
        
        {/* Friends Row */}
        <div className="flex justify-center space-x-2 mb-4">
          {[...Array(friends)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl mb-1">👤</div>
              <div className={`text-sm font-bold transition-all duration-1000 ${
                phase === 'complete' ? 'text-orange-600 scale-110' : 'text-gray-400'
              }`}>
                {phase === 'complete' ? localizeDigitsInText(formatNumber(distributed)) : '?'}
              </div>
            </div>
          ))}
        </div>
        
        {/* Result */}
        {phase === 'complete' && (
          <div className="text-center p-2 bg-orange-100 rounded-lg border border-orange-200 animate-scale-in">
            <div className="text-sm font-medium text-orange-700">
              ✅ Each friend gets {localizeDigitsInText(formatNumber(slicesPerFriend))} pizza slices!
            </div>
          </div>
        )}

        {/* Division Process Indicator */}
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <div className={`w-2 h-2 rounded-full ${phase !== 'start' ? 'bg-orange-500' : 'bg-gray-300'} transition-colors`}></div>
          <span>Dividing</span>
          <div className={`w-2 h-2 rounded-full ${phase === 'complete' ? 'bg-green-500' : 'bg-gray-300'} transition-colors`}></div>
          <span>Complete</span>
        </div>
      </div>
    </Card>
  );
}

function MoneyDivisionCard({ title, amount, people, currency }: { title: string; amount: number; people: number; currency: string }) {
  const { localizeDigitsInText, formatNumber, t } = useLanguage();
  const amountPerPerson = amount / people;
  const [currentAmount, setCurrentAmount] = useState(0);
  const [phase, setPhase] = useState<'start' | 'calculating' | 'result'>('start');
  
  useEffect(() => {
    setPhase('start');
    setCurrentAmount(0);
    const calculateTimer = setTimeout(() => {
      setPhase('calculating');
      setCurrentAmount(amountPerPerson);
    }, 600);
    const resultTimer = setTimeout(() => setPhase('result'), 1400);
    return () => { 
      clearTimeout(calculateTimer); 
      clearTimeout(resultTimer); 
    };
  }, [amountPerPerson]);
  
  return (
    <Card 
      title={title} 
      subtitle={localizeDigitsInText(`${currency}${formatNumber(amount)} ÷ ${formatNumber(people)} people = ${currency}${formatNumber(amountPerPerson)} each`)} 
      onReplay={() => setPhase('start')}
    >
      <div className="h-40 flex flex-col items-center justify-center">
        {/* Money Display */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-center">
            <div className="text-4xl mb-2">💸</div>
            <div className={`text-2xl font-bold transition-all duration-1000 ${
              amount < 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {currency}{localizeDigitsInText(formatNumber(Math.abs(amount)))}
            </div>
            <div className="text-xs text-gray-500">{amount < 0 ? 'Debt to Split' : 'Money to Share'}</div>
          </div>
          
          <div className="text-3xl text-gray-500 animate-pulse">➗</div>
          
          <div className="text-center">
            <div className="flex space-x-1 mb-2">
              {[...Array(Math.min(people, 5))].map((_, i) => (
                <div key={i} className="text-lg">👤</div>
              ))}
              {people > 5 && <div className="text-lg">...</div>}
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {localizeDigitsInText(formatNumber(people))}
            </div>
            <div className="text-xs text-gray-500">People</div>
          </div>
        </div>
        
        {/* Result Animation */}
        <div className={`text-center transition-all duration-1000 ${
          phase === 'result' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}>
          <div className="text-4xl mb-2">
            {amount < 0 ? '💳' : '💰'}
          </div>
          <div className={`text-xl font-bold ${
            currentAmount < 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            {currency}{localizeDigitsInText(formatNumber(Math.abs(currentAmount)))}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {amount < 0 ? 'Debt per person' : 'Money per person'}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className={`flex items-center gap-1 ${phase === 'calculating' || phase === 'result' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${phase === 'calculating' || phase === 'result' ? 'bg-blue-500' : 'bg-gray-300'} transition-colors`}></div>
            <span>Calculating</span>
          </div>
          <div className={`flex items-center gap-1 ${phase === 'result' ? (amount < 0 ? 'text-red-600' : 'text-green-600') : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${phase === 'result' ? (amount < 0 ? 'bg-red-500' : 'bg-green-500') : 'bg-gray-300'} transition-colors`}></div>
            <span>Complete</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function TimeSchedulingCard({ title, totalHours, days }: { title: string; totalHours: number; days: number }) {
  const { localizeDigitsInText, formatNumber, t } = useLanguage();
  const hoursPerDay = totalHours / days;
  const [scheduledHours, setScheduledHours] = useState(0);
  const [completedDays, setCompletedDays] = useState(0);
  
  useEffect(() => {
    setScheduledHours(0);
    setCompletedDays(0);
    const scheduleTimer = setTimeout(() => {
      setScheduledHours(hoursPerDay);
    }, 400);
    const progressTimer = setInterval(() => {
      setCompletedDays(prev => {
        if (prev >= days) {
          clearInterval(progressTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 200);
    
    return () => { 
      clearTimeout(scheduleTimer); 
      clearInterval(progressTimer);
    };
  }, [hoursPerDay, days]);
  
  return (
    <Card 
      title={title} 
      subtitle={localizeDigitsInText(`${formatNumber(totalHours)} hours ÷ ${formatNumber(days)} days = ${formatNumber(hoursPerDay)} hours/day`)} 
      onReplay={() => setCompletedDays(0)}
    >
      <div className="h-40 flex flex-col items-center justify-center">
        {/* Time Display */}
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">⏰</div>
          <div className="text-2xl font-bold text-blue-600">
            {localizeDigitsInText(formatNumber(scheduledHours))} hrs/day
          </div>
          <div className="text-sm text-gray-600">
            Total: {localizeDigitsInText(formatNumber(totalHours))} hours
          </div>
        </div>
        
        {/* Schedule Progress */}
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Day 1</span>
            <span>Day {formatNumber(days)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-400 to-green-500 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(completedDays / days) * 100}%` }}
            />
          </div>
          <div className="text-center mt-2 text-sm text-blue-600 font-medium">
            {completedDays > 0 && localizeDigitsInText(`${formatNumber(completedDays)}/${formatNumber(days)} days scheduled`)}
          </div>
        </div>

        {/* Completion Message */}
        {completedDays >= days && (
          <div className="mt-3 text-center p-2 bg-green-100 rounded-lg border border-green-200 animate-scale-in">
            <div className="text-sm font-medium text-green-700">
              ✅ Schedule complete! {localizeDigitsInText(formatNumber(hoursPerDay))} hours per day
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function GradeDivisionCard() {
  const { localizeDigitsInText, formatNumber, t } = useLanguage();
  const [totalPoints, setTotalPoints] = useState(450);
  const [subjects, setSubjects] = useState(5);
  const [averageGrade, setAverageGrade] = useState(0);
  const [phase, setPhase] = useState<'start' | 'calculating' | 'result'>('start');
  
  useEffect(() => {
    setPhase('start');
    setAverageGrade(0);
    const calculateTimer = setTimeout(() => {
      setPhase('calculating');
      setAverageGrade(totalPoints / subjects);
    }, 500);
    const resultTimer = setTimeout(() => setPhase('result'), 1200);
    return () => { 
      clearTimeout(calculateTimer); 
      clearTimeout(resultTimer); 
    };
  }, [totalPoints, subjects]);

  return (
    <Card 
      title="📊 Grade Average"
      subtitle={localizeDigitsInText(`${formatNumber(totalPoints)} points ÷ ${formatNumber(subjects)} subjects = ${formatNumber(totalPoints/subjects)} avg`)}
      onReplay={() => setPhase('start')}
    >
      <div className="h-32 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-3">
            <div className="text-center">
              <div className="text-3xl mb-1">📚</div>
              <div className="text-lg font-bold text-blue-600">
                {localizeDigitsInText(formatNumber(totalPoints))}
              </div>
              <div className="text-xs text-gray-500">Total Points</div>
            </div>
            
            <div className="text-2xl text-blue-500">➗</div>
            
            <div className="text-center">
              <div className="text-3xl mb-1">📖</div>
              <div className="text-lg font-bold text-purple-600">
                {localizeDigitsInText(formatNumber(subjects))}
              </div>
              <div className="text-xs text-gray-500">Subjects</div>
            </div>
          </div>
          
          <div className={`transition-all duration-800 ${
            phase === 'result' ? 'opacity-100 scale-110' : 'opacity-50 scale-100'
          }`}>
            <div className="text-2xl font-bold text-green-600">
              {localizeDigitsInText(formatNumber(Math.round(averageGrade)))}
            </div>
            <div className="text-sm text-gray-600">Average Grade</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ResourceAllocationCard() {
  const { localizeDigitsInText, formatNumber, t } = useLanguage();
  const [budget, setBudget] = useState(2400);
  const [departments, setDepartments] = useState(6);
  const [allocation, setAllocation] = useState(0);
  const [phase, setPhase] = useState<'start' | 'allocating' | 'complete'>('start');
  
  useEffect(() => {
    setPhase('start');
    setAllocation(0);
    const allocateTimer = setTimeout(() => {
      setPhase('allocating');
      setAllocation(budget / departments);
    }, 600);
    const completeTimer = setTimeout(() => setPhase('complete'), 1400);
    return () => { 
      clearTimeout(allocateTimer); 
      clearTimeout(completeTimer); 
    };
  }, [budget, departments]);

  return (
    <Card 
      title="🏢 Budget Allocation"
      subtitle={localizeDigitsInText(`₹${formatNumber(budget)} ÷ ${formatNumber(departments)} depts = ₹${formatNumber(budget/departments)} each`)}
      onReplay={() => setPhase('start')}
    >
      <div className="h-32 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <div className="text-center">
              <div className="text-3xl mb-1">💰</div>
              <div className="text-lg font-bold text-green-600">
                ₹{localizeDigitsInText(formatNumber(budget))}
              </div>
              <div className="text-xs text-gray-500">Total Budget</div>
            </div>
            
            <div className="text-2xl text-green-500 animate-pulse">📊</div>
            
            <div className="text-center">
              <div className="text-3xl mb-1">🏢</div>
              <div className="text-lg font-bold text-blue-600">
                {localizeDigitsInText(formatNumber(departments))}
              </div>
              <div className="text-xs text-gray-500">Departments</div>
            </div>
          </div>
          
          <div className={`transition-all duration-1000 ${
            phase === 'complete' ? 'opacity-100 scale-110' : 'opacity-60 scale-100'
          }`}>
            <div className="text-xl font-bold text-orange-600">
              ₹{localizeDigitsInText(formatNumber(Math.round(allocation)))}
            </div>
            <div className="text-sm text-gray-600">Per Department</div>
          </div>
          
          {phase === 'complete' && (
            <div className="mt-2 text-xs text-green-600 font-medium animate-fade-in">
              ✅ Budget allocated equally!
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function Card({ title, subtitle, children, onReplay }: { title: string; subtitle?: string; children: React.ReactNode; onReplay?: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-glow hover:shadow-glow-red transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-bold text-lg text-orange-700">{title}</div>
          {subtitle && <div className="text-orange-600 text-sm mt-1">{subtitle}</div>}
        </div>
        {onReplay && (
          <button 
            className="px-3 py-1.5 text-sm rounded-full border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200 font-medium"
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