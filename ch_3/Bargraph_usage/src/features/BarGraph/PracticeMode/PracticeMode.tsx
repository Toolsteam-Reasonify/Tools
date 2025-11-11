import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { BarGraphExercise } from '../../../interfaces/barGraphTypes';

// Word-by-word animation component
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

export default function PracticeMode() {
  const { t } = useLanguage();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [showAssessment, setShowAssessment] = useState(false);
  const [exerciseResults, setExerciseResults] = useState<{correct: boolean, attempts: number}[]>([]);

  // Practice exercises with data - using translated labels
  const exercises: BarGraphExercise[] = [
    {
      id: 1,
      data: [
        { label: t('red'), value: 43, color: '#ef4444' },
        { label: t('green'), value: 19, color: '#22c55e' },
        { label: t('blue'), value: 55, color: '#3b82f6' },
        { label: t('yellow'), value: 49, color: '#eab308' },
        { label: t('orange'), value: 34, color: '#f97316' },
      ],
      question: t('q1Question'),
      answer: t('blue'),
      hint: t('q1Hint'),
      solution: t('q1Solution'),
    },
    {
      id: 2,
      data: [
        { label: t('math'), value: 85, color: '#3b82f6' },
        { label: t('science'), value: 72, color: '#22c55e' },
        { label: t('english'), value: 90, color: '#ef4444' },
        { label: t('history'), value: 68, color: '#eab308' },
        { label: t('art'), value: 95, color: '#ec4899' },
      ],
      question: t('q2Question'),
      answer: '157',
      hint: t('q2Hint'),
      solution: t('q2Solution'),
      unit: 'score',
    },
    {
      id: 3,
      data: [
        { label: t('monday'), value: 120, color: '#06b6d4' },
        { label: t('tuesday'), value: 150, color: '#8b5cf6' },
        { label: t('wednesday'), value: 95, color: '#10b981' },
        { label: t('thursday'), value: 180, color: '#f59e0b' },
        { label: t('friday'), value: 200, color: '#ef4444' },
      ],
      question: t('q3Question'),
      answer: t('friday'),
      hint: t('q3Hint'),
      solution: t('q3Solution'),
      unit: 'units',
    },
    {
      id: 4,
      data: [
        { label: t('ajay'), value: 450, color: '#8b5cf6' },
        { label: t('bali'), value: 500, color: '#ec4899' },
        { label: t('dipti'), value: 300, color: '#06b6d4' },
        { label: t('faiyaz'), value: 360, color: '#f59e0b' },
        { label: t('geetika'), value: 400, color: '#10b981' },
        { label: t('hari'), value: 540, color: '#ef4444' },
      ],
      question: t('q4Question'),
      answer: t('hari'),
      hint: t('q4Hint'),
      solution: t('q4Solution'),
      unit: 'marks',
    },
    {
      id: 5,
      data: [
        { label: t('january'), value: 25, color: '#3b82f6' },
        { label: t('february'), value: 30, color: '#ec4899' },
        { label: t('march'), value: 45, color: '#22c55e' },
        { label: t('april'), value: 60, color: '#eab308' },
        { label: t('may'), value: 75, color: '#f97316' },
      ],
      question: t('q5Question'),
      answer: '50',
      hint: t('q5Hint'),
      solution: t('q5Solution'),
      unit: 'books',
    },
    {
      id: 6,
      data: [
        { label: t('companyA'), value: 40, color: '#ef4444' },
        { label: t('companyB'), value: 55, color: '#3b82f6' },
        { label: t('companyC'), value: 30, color: '#22c55e' },
        { label: t('companyD'), value: 25, color: '#eab308' },
      ],
      question: t('q6Question'),
      answer: '150',
      hint: t('q6Hint'),
      solution: t('q6Solution'),
      unit: 'watches',
    },
  ];

  const currentEx = exercises[currentExercise];

  const handleSubmit = () => {
    const correct = userAnswer.trim().toLowerCase() === String(currentEx.answer).toLowerCase();
    setIsCorrect(correct);
    setSubmitted(true);
    setAttempts(attempts + 1);
    if (correct) {
      setScore(score + 1);
    }
    
    // Store result for this exercise
    const newResults = [...exerciseResults];
    newResults[currentExercise] = {
      correct,
      attempts: (newResults[currentExercise]?.attempts || 0) + 1
    };
    setExerciseResults(newResults);
  };

  const handleNext = () => {
    setCurrentExercise(currentExercise + 1);
    setUserAnswer('');
    setShowHint(false);
    setShowSolution(false);
    setSubmitted(false);
    setIsCorrect(false);
  };
  
  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setUserAnswer('');
      setShowHint(false);
      setShowSolution(false);
      setSubmitted(false);
      setIsCorrect(false);
    }
  };

  const maxValue = Math.max(...currentEx.data.map(d => d.value));
  
  // Show assessment if completed
  if (showAssessment) {
    const accuracy = (score / exercises.length) * 100;
    
    return (
      <div className="space-y-6">
        {/* Assessment Header */}
        <div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-emerald-400/10 to-teal-400/10 animate-pulse" />
          
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-4xl font-bold mb-2">
              {t('practiceComplete')}
            </h2>
            <p className="text-xl opacity-90">{t('practiceCompleteSubtitle')}</p>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Score Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4 text-center">🎯</div>
            <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">{t('yourScore')}</h3>
            <div className="text-5xl font-bold text-blue-600 mb-2 text-center">
              {score}/{exercises.length}
            </div>
            <div className="text-lg text-gray-600 text-center">
              {accuracy.toFixed(0)}% {t('accuracy')}
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200 transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4 text-center">📊</div>
            <h3 className="text-2xl font-bold text-purple-700 mb-4 text-center">{t('performance')}</h3>
            <div className="text-5xl font-bold text-purple-600 mb-2 text-center">
              {accuracy >= 80 ? '⭐⭐⭐' : accuracy >= 60 ? '⭐⭐' : '⭐'}
            </div>
            <div className="text-lg text-gray-600 text-center">
              {t('totalAttempts')}: {attempts}
            </div>
          </div>
        </div>

        {/* Exercise Breakdown */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📝 {t('exerciseBreakdown')}</h3>
          <div className="space-y-3">
            {exercises.map((ex, i) => (
              <div key={ex.id} className={`p-4 rounded-xl border-2 ${exerciseResults[i]?.correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{exerciseResults[i]?.correct ? '✅' : '❌'}</span>
                    <span className='font-semibold'>{t('questionLabel')} {i + 1}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {exerciseResults[i]?.attempts || 0} {t('attemptLabel')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restart Button */}
        <div className="text-center">
          <button
            onClick={() => {
              setShowAssessment(false);
              setCurrentExercise(0);
              setScore(0);
              setAttempts(0);
              setExerciseResults([]);
              setUserAnswer('');
              setSubmitted(false);
              setIsCorrect(false);
            }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            {t('practiceAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with emoji */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl shadow-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 text-9xl opacity-10">✍️</div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-5xl animate-bounce">✍️</span>
            {t('practiceTitle')}
          </h2>
          <p className="text-lg md:text-xl opacity-90">{t('practiceSubtitle')}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl shadow-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-700">
            📝 {t('questionProgress')} {currentExercise + 1} {t('of')} {exercises.length}
          </span>
          <span className="font-semibold text-gray-700">
            ⭐ {t('score')}: {score}/{exercises.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left - Data visualization */}
        <div className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl p-6 overflow-hidden">
          {/* Animated orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-3xl">📊</span>
              {t('dataTitle')}
            </h3>

            {/* Data cards */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentEx.data.map((item, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl"
                    style={{ borderColor: item.color }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg mb-2 mx-auto shadow-md"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="text-center">
                      <div className="font-bold text-sm text-gray-700">{item.label}</div>
                      <div className="text-2xl font-bold" style={{ color: item.color }}>
                        {item.value}
                      </div>
                      {currentEx.unit && (
                        <div className="text-xs text-gray-500">{currentEx.unit}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar graph visualization */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="flex items-center">
                {/* Y-axis - outside left */}
                <div className="flex flex-col justify-between h-64 text-xs font-bold text-gray-700 pr-3">
                  {[0, 1, 2, 3, 4, 5].reverse().map(i => (
                    <span key={i}>{Math.round((maxValue / 5) * i)}</span>
                  ))}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-end justify-around h-64 border-b-4 border-l-4 border-gray-800 pb-2 pl-4">
                    {/* Bars */}
                    {currentEx.data.map((item, i) => {
                      const heightInPx = (item.value / maxValue) * 240; // 240px max height
                      return (
                        <div key={`${currentExercise}-${i}`} className="flex flex-col items-end group cursor-pointer">
                          <div
                            className="w-8 md:w-12 rounded-t-lg shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl relative bar-grow"
                            style={{
                              backgroundColor: item.color,
                              '--bar-height': `${heightInPx}px`,
                              animationDelay: `${i * 0.2}s`,
                            } as React.CSSProperties}
                          >
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                              {item.value}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Labels below the horizontal line */}
                  <div className="flex justify-around mt-3 pl-4">
                    {currentEx.data.map((item, i) => (
                      <span key={i} className="text-xs font-bold text-gray-700 text-center leading-tight w-8 md:w-12">
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Question and answer */}
        <div className="relative bg-gradient-to-br from-pink-100 via-red-100 to-orange-100 rounded-3xl shadow-2xl p-6 overflow-hidden">
          {/* Animated orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-700 to-orange-700 bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-3xl">❓</span>
              {t('questionTitle')}
            </h3>

            {/* Question card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-pink-300">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{currentExercise === 0 ? '🎨' : currentExercise === 1 ? '➕' : currentExercise === 2 ? '📊' : currentExercise === 3 ? '🏆' : currentExercise === 4 ? '📐' : '🔢'}</span>
                <p className="text-lg font-semibold text-gray-800 leading-relaxed">
                  <AnimatedText text={currentEx.question} key={currentExercise} />
                </p>
              </div>
            </div>

            {/* Answer input */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-orange-300">
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-xl">✏️</span>
                {t('yourAnswer')}:
              </label>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={t('placeholderAnswer')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-300 focus:border-pink-500 text-lg transition-all duration-300"
                disabled={submitted && isCorrect}
              />
            </div>

            {/* Submit button */}
            {!submitted && (
              <button
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                className={`w-full py-4 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl flex items-center justify-center gap-3 ${
                  userAnswer.trim()
                    ? 'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white hover:from-pink-600 hover:via-red-600 hover:to-orange-600 hover:scale-105 hover:shadow-2xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span className="text-2xl">✅</span>
                {t('submit')}
              </button>
            )}

            {/* Result */}
            {submitted && (
              <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{isCorrect ? '🎉' : '❌'}</span>
                  <p className={`text-2xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? t('correct') : t('incorrect')}
                  </p>
                </div>
                
                {!isCorrect && (
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setUserAnswer('');
                    }}
                    className="w-full mt-4 py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {t('tryAgain')} 🔄
                  </button>
                )}
              </div>
            )}

            {/* Hint section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-yellow-300">
              <button
                onClick={() => setShowHint(!showHint)}
                className="w-full flex items-center justify-between py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span className="flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  {showHint ? t('hideHint') : t('showHint')}
                </span>
                <span className="text-2xl">{showHint ? '▲' : '▼'}</span>
              </button>
              
              {showHint && (
                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-400">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">🔍</span>
                    <p className="text-gray-700 leading-relaxed"><AnimatedText text={currentEx.hint} /></p>
                  </div>
                </div>
              )}
            </div>

            {/* Solution section */}
            {submitted && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-blue-300">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="w-full flex items-center justify-between py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">👁️</span>
                    {showSolution ? t('hideSolution') : t('showSolution')}
                  </span>
                  <span className="text-2xl">{showSolution ? '▲' : '▼'}</span>
                </button>
                
                {showSolution && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-400">
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">📖</span>
                      <div>
                        <p className="text-gray-700 leading-relaxed mb-2"><AnimatedText text={currentEx.solution} /></p>
                        <div className="bg-white rounded-lg p-3 mt-3 border-2 border-green-400">
                          <p className="font-bold text-green-700 flex items-center gap-2">
                            <span>✓</span>
                            {t('answerLabel')}: {currentEx.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 bg-white rounded-xl shadow-lg border">
        <button
          onClick={handlePrevious}
          disabled={currentExercise === 0}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-base transition-all duration-300 ${
            currentExercise === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transform hover:scale-105'
          }`}
        >
          ← {t('previous')}
        </button>
        <button
          onClick={handleNext}
          disabled={currentExercise === exercises.length - 1}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
            currentExercise === exercises.length - 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {t('next')} →
        </button>
      </div>
      
      {/* View Assessment Button - only show after completing all questions */}
      {currentExercise === exercises.length - 1 && submitted && (
        <div className="text-center">
          <button
            onClick={() => setShowAssessment(true)}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-xl hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-3 mx-auto"
          >
            <span className="text-2xl">🎊</span>
            {t('viewAssessment')}
          </button>
        </div>
      )}
    </div>
  );
}

