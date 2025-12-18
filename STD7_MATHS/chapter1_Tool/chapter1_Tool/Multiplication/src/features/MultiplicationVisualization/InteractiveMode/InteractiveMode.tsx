import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

type Exercise = {
  id: string;
  prompt: string;
  multiplicand: number;
  multiplier: number;
  answer: number;
  type: 'practice' | 'assessment';
  difficulty: 'easy' | 'medium' | 'hard';
  topic: 'basic' | 'arrays' | 'properties' | 'mixed' | 'positive_negative' | 'negative_negative';
  visualHint?: string;
  showGrid?: boolean;
};

type InteractiveResult = {
  exerciseId: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
  attempts: number;
};

export default function InteractiveMode() {
  const { t, localizeDigitsInText, formatNumber, isTransitioning } = useLanguage();
  
  const exercises = useMemo<Exercise[]>(() => [
    // Practice Phase - Guided Learning with Integer Multiplication
    { 
      id: 'p1', 
      prompt: 'Calculate: 3 × 4', 
      multiplicand: 3, 
      multiplier: 4, 
      answer: 12, 
      type: 'practice', 
      difficulty: 'easy', 
      topic: 'basic', 
      visualHint: 'Think of 3 groups of 4 items each',
      showGrid: true
    },
    { 
      id: 'p2', 
      prompt: 'Find: 5 × (-3)', 
      multiplicand: 5, 
      multiplier: -3, 
      answer: -15, 
      type: 'practice', 
      difficulty: 'medium', 
      topic: 'positive_negative', 
      visualHint: 'Positive × Negative = Negative. Think: 5 groups of -3 = -15',
      showGrid: false
    },
    { 
      id: 'p3', 
      prompt: 'Calculate: (-4) × (-6)', 
      multiplicand: -4, 
      multiplier: -6, 
      answer: 24, 
      type: 'practice', 
      difficulty: 'medium', 
      topic: 'negative_negative', 
      visualHint: 'Negative × Negative = Positive. Remember: (-4) × (-6) = 24',
      showGrid: false
    },
    { 
      id: 'p4', 
      prompt: 'What is 8 × 1?', 
      multiplicand: 8, 
      multiplier: 1, 
      answer: 8, 
      type: 'practice', 
      difficulty: 'easy', 
      topic: 'properties', 
      visualHint: 'Identity property: any number × 1 = that number',
      showGrid: false
    },
    { 
      id: 'p5', 
      prompt: 'Find: (-7) × 2', 
      multiplicand: -7, 
      multiplier: 2, 
      answer: -14, 
      type: 'practice', 
      difficulty: 'medium', 
      topic: 'positive_negative', 
      visualHint: 'Negative × Positive = Negative. So (-7) × 2 = -14',
      showGrid: false
    },
    { 
      id: 'p6', 
      prompt: 'Calculate: 6 × 0', 
      multiplicand: 6, 
      multiplier: 0, 
      answer: 0, 
      type: 'practice', 
      difficulty: 'easy', 
      topic: 'properties', 
      visualHint: 'Zero property: any number × 0 = 0',
      showGrid: false
    },
    
    // Assessment Phase - Testing Understanding
    { 
      id: 'a1', 
      prompt: 'Compute: (-5) × (-4)', 
      multiplicand: -5, 
      multiplier: -4, 
      answer: 20, 
      type: 'assessment', 
      difficulty: 'medium', 
      topic: 'negative_negative' 
    },
    { 
      id: 'a2', 
      prompt: 'Find: 9 × (-3)', 
      multiplicand: 9, 
      multiplier: -3, 
      answer: -27, 
      type: 'assessment', 
      difficulty: 'medium', 
      topic: 'positive_negative' 
    },
    { 
      id: 'a3', 
      prompt: 'Calculate: (-8) × 4', 
      multiplicand: -8, 
      multiplier: 4, 
      answer: -32, 
      type: 'assessment', 
      difficulty: 'medium', 
      topic: 'positive_negative' 
    },
    { 
      id: 'a4', 
      prompt: 'What is (-6) × (-7)?', 
      multiplicand: -6, 
      multiplier: -7, 
      answer: 42, 
      type: 'assessment', 
      difficulty: 'hard', 
      topic: 'negative_negative' 
    },
    { 
      id: 'a5', 
      prompt: 'Apply distributive: 3 × (4 + 2)', 
      multiplicand: 3, 
      multiplier: 6, 
      answer: 18, 
      type: 'assessment', 
      difficulty: 'hard', 
      topic: 'properties' 
    },
    { 
      id: 'a6', 
      prompt: 'Mixed practice: (-5) × 0', 
      multiplicand: -5, 
      multiplier: 0, 
      answer: 0, 
      type: 'assessment', 
      difficulty: 'easy', 
      topic: 'properties' 
    },
  ], []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [results, setResults] = useState<InteractiveResult[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [animateSuccess, setAnimateSuccess] = useState(false);
  const [animateError, setAnimateError] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);

  const currentExercise = exercises?.[currentIndex];
  const isPracticePhase = currentExercise?.type === 'practice';
  const practiceCount = exercises?.filter(e => e?.type === 'practice')?.length || 0;

  // Error state handling
  if (!exercises || exercises.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 bg-error-50 rounded-xl border border-error-200 max-w-md mx-auto animate-slide-up">
          <div className="text-6xl mb-4 animate-bounce">🚨</div>
          <h3 className="text-xl font-bold text-error-700 mb-2">Error Loading Exercises</h3>
          <p className="text-error-600 mb-4">We're having trouble loading the practice exercises.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-error-500 text-white rounded-lg hover:bg-error-600 transition-all duration-300 transform hover:scale-105"
          >
            🔄 Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!currentExercise) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 bg-warning-50 rounded-xl border border-warning-200 max-w-md mx-auto animate-pulse">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-bold text-warning-700 mb-2">Loading...</h3>
          <p className="text-warning-600">Preparing your next multiplication exercise</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-warning-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-warning-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-warning-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    );
  }

  // Reset state when exercise changes
  useEffect(() => {
    setUserInput('');
    setAttempts(0);
    setShowResult(false);
    setShowHint(false);
    setAnimateSuccess(false);
    setAnimateError(false);
    setShowVisualization(false);
    setStartTime(Date.now());
  }, [currentIndex]);

  const handleSubmit = () => {
    if (!userInput.trim()) return;

    const userAnswer = Number(userInput);
    const isCorrect = userAnswer === currentExercise.answer;
    const timeSpent = (Date.now() - startTime) / 1000;
    const newAttempts = attempts + 1;

    const result: InteractiveResult = {
      exerciseId: currentExercise.id,
      userAnswer,
      correctAnswer: currentExercise.answer,
      isCorrect,
      timeSpent,
      attempts: newAttempts,
    };

    setAttempts(newAttempts);
    setResults(prev => [...prev, result]);
    setShowResult(true);

    if (isCorrect) {
      setAnimateSuccess(true);
      setTimeout(() => {
        if (currentIndex < exercises.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setIsComplete(true);
        }
      }, 2000);
    } else {
      setAnimateError(true);
      setTimeout(() => setAnimateError(false), 1000);
      
      if (isPracticePhase && newAttempts === 1 && currentExercise.visualHint) {
        setShowHint(true);
      }
      
      if (isPracticePhase) {
        if (newAttempts >= 3) {
          setTimeout(() => {
            if (currentIndex < exercises.length - 1) {
              setCurrentIndex(prev => prev + 1);
            } else {
              setIsComplete(true);
            }
          }, 2500);
        }
      } else {
        setTimeout(() => {
          if (currentIndex < exercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
          } else {
            setIsComplete(true);
          }
        }, 2500);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      // Reset all states when moving to next question
      setUserInput('');
      setShowResult(false);
      setShowHint(false);
      setAttempts(0);
      setAnimateSuccess(false);
      setAnimateError(false);
      setShowVisualization(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      // Reset all states when moving to previous question
      setUserInput('');
      setShowResult(false);
      setShowHint(false);
      setAttempts(0);
      setAnimateSuccess(false);
      setAnimateError(false);
      setShowVisualization(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const getScoreData = () => {
    const practiceResults = results.filter(r => exercises.find(e => e.id === r.exerciseId)?.type === 'practice');
    const assessmentResults = results.filter(r => exercises.find(e => e.id === r.exerciseId)?.type === 'assessment');
    
    return {
      practiceScore: practiceResults.filter(r => r.isCorrect).length,
      practiceTotal: practiceResults.length,
      assessmentScore: assessmentResults.filter(r => r.isCorrect).length,
      assessmentTotal: assessmentResults.length,
      overallAccuracy: results.length > 0 ? (results.filter(r => r.isCorrect).length / results.length) * 100 : 0,
      averageTime: results.length > 0 ? results.reduce((sum, r) => sum + r.timeSpent, 0) / results.length : 0,
    };
  };

  if (isComplete) {
    const scoreData = getScoreData();
    return <CompletionSummary scoreData={scoreData} results={results} exercises={exercises} />;
  }

  if (!currentExercise) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 bg-yellow-50 rounded-xl border border-yellow-200">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-bold text-yellow-700 mb-2">Loading...</h3>
          <p className="text-yellow-600">Preparing your multiplication practice</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 sm:space-y-4 md:space-y-6 transition-all duration-500 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-brand-50 to-accent-50 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border-2 border-brand-200/60 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-400/5 via-accent-400/5 to-brand-400/5 animate-pulse" />
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
            <div className="flex flex-col xs:flex-row xs:items-center space-y-2 xs:space-y-0 xs:space-x-3 sm:space-x-4">
              <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-500 relative overflow-hidden w-fit ${
                isPracticePhase 
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg' 
                  : 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg'
              }`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${
                  isPracticePhase 
                    ? 'from-brand-400 to-brand-500' 
                    : 'from-accent-400 to-accent-500'
                } animate-pulse opacity-30`} />
                <span className="relative z-10">
                  {isPracticePhase ? '🎯 Practice Mode' : '📊 Assessment Mode'}
                </span>
              </div>
              
              <div className="text-xs sm:text-sm font-medium text-gray-700">
                {localizeDigitsInText(`${currentIndex + 1} / ${exercises.length}`)}
              </div>
              
              {/* Phase Transition Indicator */}
              {currentIndex === practiceCount - 1 && isPracticePhase && (
                <div className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded-full border border-accent-200 animate-pulse">
                  Assessment Next →
                </div>
              )}
            </div>

            <ScoreDisplay 
              practiceScore={getScoreData().practiceScore}
              practiceTotal={getScoreData().practiceTotal}
              assessmentScore={getScoreData().assessmentScore}
              assessmentTotal={getScoreData().assessmentTotal}
            />
          </div>

          {/* Enhanced Progress Bar */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative">
            {/* Practice Section Background */}
            <div className="absolute left-0 top-0 h-full w-1/2 bg-brand-100 rounded-l-full" />
            {/* Assessment Section Background */}
            <div className="absolute right-0 top-0 h-full w-1/2 bg-accent-100 rounded-r-full" />
            {/* Divider */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-300 transform -translate-x-0.5" />
            
            {/* Progress Fill */}
            <div 
              className={`h-full rounded-full transition-all duration-700 relative z-10 ${
                isPracticePhase 
                  ? 'bg-gradient-to-r from-brand-400 to-brand-500' 
                  : 'bg-gradient-to-r from-accent-400 to-accent-500'
              }`}
              style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
            />
            
            {/* Labels */}
            <div className="absolute -bottom-5 left-1/4 text-xs text-brand-600 font-medium">Practice</div>
            <div className="absolute -bottom-5 right-1/4 text-xs text-accent-600 font-medium">Assessment</div>
          </div>
        </div>
      </div>

      {/* Exercise Card */}
      <ExerciseCard
        exercise={currentExercise}
        userInput={userInput}
        setUserInput={setUserInput}
        onSubmit={handleSubmit}
        showResult={showResult}
        setShowResult={setShowResult}
        showHint={showHint}
        setShowHint={setShowHint}
        attempts={attempts}
        animateSuccess={animateSuccess}
        animateError={animateError}
        results={results}
        onNext={handleNext}
        onPrevious={handlePrevious}
        showVisualization={showVisualization}
        setShowVisualization={setShowVisualization}
        currentIndex={currentIndex}
        totalQuestions={exercises.length}
      />
    </div>
  );
}

// Exercise Card Component
function ExerciseCard({ 
  exercise, 
  userInput, 
  setUserInput, 
  onSubmit, 
  showResult, 
  setShowResult,
  showHint,
  setShowHint,
  attempts,
  animateSuccess,
  animateError,
  results,
  onNext,
  onPrevious,
  showVisualization,
  setShowVisualization,
  currentIndex,
  totalQuestions
}: {
  exercise: Exercise;
  userInput: string;
  setUserInput: (value: string) => void;
  onSubmit: () => void;
  showResult: boolean;
  setShowResult: (value: boolean) => void;
  showHint: boolean;
  setShowHint: (value: boolean) => void;
  attempts: number;
  animateSuccess: boolean;
  animateError: boolean;
  results: InteractiveResult[];
  onNext: () => void;
  onPrevious: () => void;
  showVisualization: boolean;
  setShowVisualization: (value: boolean) => void;
  currentIndex: number;
  totalQuestions: number;
}) {
  const { localizeDigitsInText, formatNumber, t } = useLanguage();
  
  // Safety checks to prevent errors
  if (!exercise || !results) {
    return (
      <div className="p-6 bg-error-50 border border-error-200 rounded-xl">
        <div className="text-error-600 text-center">
          <span className="text-2xl">⚠️</span>
          <p className="mt-2">Loading exercise...</p>
        </div>
      </div>
    );
  }
  
  const latestResult = results.find(r => r?.exerciseId === exercise?.id);
  const isPractice = exercise?.type === 'practice';

  return (
    <div className={`relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg transition-all duration-700 transform ${
      animateSuccess ? 'scale-105 animate-learning-glow' : 
      animateError ? 'animate-shake' : 'scale-100'
    }`}>
      {/* Animated Background */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        isPractice 
          ? 'bg-gradient-to-br from-brand-50 to-brand-100' 
          : 'bg-gradient-to-br from-accent-50 to-accent-100'
      }`} />
      
      {/* Success/Error Overlay */}
      {showResult && (
        <div className={`absolute inset-0 transition-all duration-300 ${
          latestResult?.isCorrect 
            ? 'bg-success-500/10 animate-pulse' 
            : 'bg-error-500/10 animate-pulse'
        }`} />
      )}

      <div className="relative z-10 p-3 sm:p-4 md:p-6">
        {/* Exercise Header */}
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-3 sm:mb-4 gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className={`text-xs sm:text-sm font-medium ${
              isPractice ? 'text-brand-700' : 'text-accent-700'
            }`}>
              {isPractice ? '🎯' : '📊'} {exercise.difficulty.toUpperCase()} • {exercise.topic.toUpperCase()}
            </span>
          </div>
          
          {attempts > 0 && (
            <div className="text-xs sm:text-sm text-gray-600">
              Attempts: {formatNumber(attempts)}
            </div>
          )}
        </div>

        {/* Question */}
        <div className="mb-4 sm:mb-5 md:mb-6">
          <div className={`text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 transition-all duration-300 ${
            showResult && latestResult?.isCorrect 
              ? 'text-success-700' 
              : showResult && !latestResult?.isCorrect 
              ? 'text-error-700' 
              : isPractice ? 'text-brand-800' : 'text-accent-800'
          }`}>
            {localizeDigitsInText(exercise.prompt)}
          </div>
          
          {/* Visualization Toggle */}
          {exercise.showGrid && (
            <div className="mb-4">
              <button
                onClick={() => setShowVisualization(!showVisualization)}
                className={`text-sm underline transition-all duration-300 transform hover:scale-105 ${
                  isPractice ? 'text-brand-600 hover:text-brand-700' : 'text-accent-600 hover:text-accent-700'
                }`}
              >
                {showVisualization ? '🔽 ' + t('hideGridHelper') : '🔼 ' + t('showGridHelper')}
              </button>
            </div>
          )}
          
          {/* Enhanced Grid Visualization */}
          {showVisualization && exercise.showGrid && (
            <MultiplicationGrid 
              multiplicand={exercise.multiplicand}
              multiplier={exercise.multiplier}
              isPractice={isPractice}
            />
          )}
        </div>

        {/* Input Section */}
        <div className="mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={t('enterAnswer')}
              disabled={showResult && latestResult?.isCorrect}
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-2 rounded-lg text-base sm:text-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 ${
                showResult && latestResult?.isCorrect
                  ? 'border-success-300 bg-success-50 text-success-800'
                  : showResult && !latestResult?.isCorrect
                  ? 'border-error-300 bg-error-50 text-error-800'
                  : isPractice
                  ? 'border-brand-300 focus:border-brand-500 focus:ring-brand-200'
                  : 'border-accent-300 focus:border-accent-500 focus:ring-accent-200'
              }`}
              onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
            />
            
            <button
              onClick={onSubmit}
              disabled={!userInput.trim() || (showResult && latestResult?.isCorrect)}
              className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold text-white text-sm sm:text-base transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isPractice 
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {t('submit')}
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col xs:flex-row justify-between items-center mb-3 sm:mb-4 gap-3 xs:gap-0">
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="w-full xs:w-auto flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg font-medium text-sm sm:text-base hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span>←</span>
            <span className="hidden xs:inline">{t('prev')}</span>
            <span className="xs:hidden">Previous</span>
          </button>
          
          <div className="text-xs sm:text-sm text-gray-600 order-first xs:order-none">
            {localizeDigitsInText(`${currentIndex + 1} / ${totalQuestions}`)}
          </div>
          
          <button
            onClick={onNext}
            disabled={currentIndex === totalQuestions - 1}
            className="w-full xs:w-auto flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-accent-500 text-white rounded-lg font-medium text-sm sm:text-base hover:bg-accent-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="hidden xs:inline">{t('next')}</span>
            <span className="xs:hidden">Next</span>
            <span>→</span>
          </button>
        </div>

        {/* Enhanced Hint Section */}
        {(showHint || attempts > 0) && exercise.visualHint && isPractice && (
          <div className="mb-4 p-4 bg-gradient-to-r from-warning-50 to-amber-50 border-2 border-warning-300 rounded-xl animate-slide-down shadow-lg">
            <div className="flex items-start space-x-3">
              <div className="text-warning-600 text-2xl animate-bounce">💡</div>
              <div className="flex-1">
                <div className="font-bold text-warning-800 text-lg mb-2">
                  {attempts === 1 ? 'Hint Available!' : attempts > 1 ? 'Keep Trying!' : 'Need Help?'}
                </div>
                <div className="text-warning-700 mb-3 leading-relaxed">
                  {exercise.visualHint}
                </div>
                {attempts > 1 && (
                  <div className="text-sm text-warning-600 bg-warning-100 p-2 rounded-lg border border-warning-200">
                    💪 <strong>Keep going!</strong> Every mathematician makes mistakes while learning. Try again!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Help Button for Practice Mode */}
        {isPractice && !showHint && attempts === 0 && (
          <div className="mb-4 text-center">
            <button
              onClick={() => setShowHint(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-warning-500 text-white rounded-lg font-medium hover:from-amber-500 hover:to-warning-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              💡 Show Hint
            </button>
          </div>
        )}

        {/* Result Section */}
        {showResult && latestResult && (
          <ResultDisplay 
            result={latestResult} 
            exercise={exercise} 
            onNext={onNext}
            onRetry={() => {
              setUserInput('');
              setShowResult(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Multiplication Grid Component  
function MultiplicationGrid({ multiplicand, multiplier, isPractice }: {
  multiplicand: number;
  multiplier: number;
  isPractice: boolean;
}) {
  const { formatNumber } = useLanguage();
  
  return (
    <div className="mb-4 p-4 bg-white rounded-lg border-2 border-brand-200 shadow-soft animate-grid-appear">
      <div className="text-center mb-3">
        <div className="text-sm text-gray-600 mb-2 font-medium">
          {formatNumber(multiplicand)} × {formatNumber(multiplier)} = ?
        </div>
        <div 
          className="multiplication-grid mx-auto inline-grid animate-fade-in"
          style={{ 
            gridTemplateColumns: `repeat(${Math.min(multiplier, 10)}, 1fr)`,
            maxWidth: 'fit-content'
          }}
        >
          {Array.from({ length: Math.min(multiplicand * multiplier, 100) }, (_, i) => (
            <div 
              key={i} 
              className={`grid-cell transition-all duration-200 ${
                isPractice ? 'bg-brand-100 border-brand-300' : 'bg-accent-100 border-accent-300'
              } hover:scale-110 animate-number-pop`}
              style={{ animationDelay: `${i * 20}ms` }}
            >
              <span className="text-xs">●</span>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-2 font-medium">
          {formatNumber(multiplicand)} rows × {formatNumber(multiplier)} columns = {formatNumber(multiplicand * multiplier)} total
        </div>
        {multiplicand * multiplier > 100 && (
          <div className="text-xs text-warning-600 mt-1">
            (Showing first 100 items for visualization)
          </div>
        )}
      </div>
    </div>
  );
}

// Supporting Components
function ScoreDisplay({ practiceScore, practiceTotal, assessmentScore, assessmentTotal }: {
  practiceScore: number;
  practiceTotal: number;
  assessmentScore: number;
  assessmentTotal: number;
}) {
  const { formatNumber } = useLanguage();
  
  return (
    <div className="flex items-center space-x-4 text-sm">
      <div className="flex items-center space-x-2">
        <span className="font-medium text-brand-700">
          🎯 Practice: {formatNumber(practiceScore)}/{formatNumber(practiceTotal)}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="font-medium text-accent-700">
          📊 Assessment: {formatNumber(assessmentScore)}/{formatNumber(assessmentTotal)}
        </span>
      </div>
    </div>
  );
}

function ResultDisplay({ result, exercise, onNext, onRetry }: { 
  result: InteractiveResult; 
  exercise: Exercise; 
  onNext: () => void;
  onRetry?: () => void;
}) {
  const { formatNumber, t } = useLanguage();
  
  return (
    <div className={`p-4 rounded-lg border-2 animate-slide-up ${
      result.isCorrect 
        ? 'bg-success-50 border-success-200' 
        : 'bg-error-50 border-error-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`flex items-center space-x-2 mb-2 ${
            result.isCorrect ? 'text-success-700' : 'text-error-700'
          }`}>
            <div className="text-2xl">
              {result.isCorrect ? '✅' : '❌'}
            </div>
            <div className="font-bold text-lg">
              {result.isCorrect ? t('correct') : t('incorrect')}
            </div>
          </div>
          
          {!result.isCorrect && (
            <div className="text-sm text-error-600 mb-2">
              Your answer: {formatNumber(result.userAnswer)} • Correct answer: {formatNumber(result.correctAnswer)}
            </div>
          )}
          
          <div className="text-xs text-gray-600">
            Time: {result.timeSpent.toFixed(1)}s • Attempts: {formatNumber(result.attempts)}
          </div>
        </div>
        
        {result.isCorrect ? (
          <button
            onClick={onNext}
            className="px-4 py-2 bg-gradient-to-r from-brand-500 to-accent-500 text-white rounded-lg font-medium hover:from-brand-600 hover:to-accent-600 transition-all duration-300 transform hover:scale-105"
          >
            {t('next')} →
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {exercise.type === 'practice' && result.attempts < 3 && onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-gradient-to-r from-warning-500 to-error-500 text-white rounded-lg font-medium hover:from-warning-600 hover:to-error-600 transition-all duration-300 transform hover:scale-105"
              >
                {t('tryAgain')}
              </button>
            )}
            <button
              onClick={onNext}
              className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
            >
                              {t('continue')} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CompletionSummary({ scoreData, results, exercises }: {
  scoreData: any;
  results: InteractiveResult[];
  exercises: Exercise[];
}) {
  const { formatNumber, t } = useLanguage();
  
  if (!scoreData || !results || !exercises) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-xl">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-600">Loading results...</p>
      </div>
    );
  }
  
  const practiceResults = results.filter(r => exercises.find(e => e.id === r.exerciseId)?.type === 'practice');
  const assessmentResults = results.filter(r => exercises.find(e => e.id === r.exerciseId)?.type === 'assessment');
  
  return (
    <div className="bg-gradient-to-br from-brand-50 via-accent-50 to-brand-50 rounded-xl p-8 border-2 border-brand-200/60 shadow-xl relative overflow-hidden animate-slide-up">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-400/10 via-accent-400/10 to-brand-400/10 animate-pulse" />
      
      <div className="relative z-10 text-center">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-brand-700 to-accent-700 bg-clip-text text-transparent mb-2">
          {t('multiplicationMastery')}
        </h2>
        <p className="text-gray-600 mb-8">{t('completedBothPhases')}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Practice Results */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-brand-200/50 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-xl font-bold text-brand-700 mb-2">Practice Phase</h3>
            <div className="text-3xl font-bold text-brand-600 mb-2">
              {formatNumber(scoreData.practiceScore)}/{formatNumber(scoreData.practiceTotal)}
            </div>
            <div className="text-sm text-gray-600">
              {practiceResults.length > 0 ? 
                `${Math.round((scoreData.practiceScore / scoreData.practiceTotal) * 100)}% Accuracy` : 
                'No practice completed'
              }
            </div>
          </div>
          
          {/* Assessment Results */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-accent-200/50 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-accent-700 mb-2">Assessment Phase</h3>
            <div className="text-3xl font-bold text-accent-600 mb-2">
              {formatNumber(scoreData.assessmentScore)}/{formatNumber(scoreData.assessmentTotal)}
            </div>
            <div className="text-sm text-gray-600">
              {assessmentResults.length > 0 ? 
                `${Math.round((scoreData.assessmentScore / scoreData.assessmentTotal) * 100)}% Accuracy` : 
                'No assessment completed'
              }
            </div>
          </div>
        </div>
        
        {/* Overall Performance */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-success-200/50 shadow-lg mb-6">
          <h3 className="text-xl font-bold text-success-700 mb-4">Overall Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">{Math.round(scoreData.overallAccuracy)}%</div>
              <div className="text-sm text-gray-600">Overall Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">{scoreData.averageTime.toFixed(1)}s</div>
              <div className="text-sm text-gray-600">Average Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">{formatNumber(results.length)}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg font-semibold hover:from-brand-600 hover:to-brand-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🔄 Practice Again
          </button>
          <button 
            onClick={() => window.location.href = '/'} 
            className="px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg font-semibold hover:from-accent-600 hover:to-accent-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            📚 Back to Learning
          </button>
        </div>
      </div>
    </div>
  );
}