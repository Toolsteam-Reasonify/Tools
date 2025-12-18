import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

type Exercise = {
  id: string;
  prompt: string;
  answer: number;
  type: 'practice' | 'assessment';
  difficulty: 'easy' | 'medium' | 'hard';
  topic: 'addition' | 'subtraction' | 'mixed';
  visualHint?: string;
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
  
  // Combined exercises - practice flows into assessment
  const exercises = useMemo<Exercise[]>(() => [
    // Practice Phase - Guided Learning
    { id: 'p1', prompt: 'Evaluate: (-6) + 9', answer: 3, type: 'practice', difficulty: 'easy', topic: 'addition', visualHint: 'Think of moving right on number line' },
    { id: 'p2', prompt: 'Evaluate: 12 - (-5)', answer: 17, type: 'practice', difficulty: 'medium', topic: 'subtraction', visualHint: 'Subtracting negative is like adding positive' },
    { id: 'p3', prompt: 'Evaluate: (-8) - 7', answer: -15, type: 'practice', difficulty: 'medium', topic: 'subtraction', visualHint: 'Move left from negative position' },
    { id: 'p4', prompt: 'Evaluate: 4 + (-4)', answer: 0, type: 'practice', difficulty: 'easy', topic: 'addition', visualHint: 'Additive inverse property' },
    
    // Assessment Phase - Testing Understanding
    { id: 'a1', prompt: 'Compute: (-3) + (-7)', answer: -10, type: 'assessment', difficulty: 'easy', topic: 'addition' },
    { id: 'a2', prompt: 'Compute: 15 - (-4)', answer: 19, type: 'assessment', difficulty: 'medium', topic: 'subtraction' },
    { id: 'a3', prompt: 'Compute: (-12) - 5', answer: -17, type: 'assessment', difficulty: 'medium', topic: 'subtraction' },
    { id: 'a4', prompt: 'Compute: (-9) + 6 - (-3)', answer: 0, type: 'assessment', difficulty: 'hard', topic: 'mixed' },
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

  const currentExercise = exercises?.[currentIndex];
  const isPracticePhase = currentExercise?.type === 'practice';
  const practiceCount = exercises?.filter(e => e?.type === 'practice')?.length || 0;
  const isInPractice = currentIndex < practiceCount;

  // Error state handling
  if (!exercises || exercises.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-xl border border-red-200 max-w-md mx-auto animate-slide-up">
          <div className="text-6xl mb-4 animate-bounce">🚨</div>
          <h3 className="text-xl font-bold text-red-700 mb-2">Error Loading Exercises</h3>
          <p className="text-red-600 mb-4">We're having trouble loading the practice exercises.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
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
        <div className="text-center p-8 bg-yellow-50 rounded-xl border border-yellow-200 max-w-md mx-auto animate-pulse">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-bold text-yellow-700 mb-2">Loading...</h3>
          <p className="text-yellow-600">Preparing your next exercise</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
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
    setStartTime(Date.now());
    setShowResult(false);
    setShowHint(false);
    setAnimateSuccess(false);
    setAnimateError(false);
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
      
      // Show hint for practice mode after wrong attempt
      if (isPracticePhase && newAttempts === 1 && currentExercise.visualHint) {
        setShowHint(true);
      }
      
      // For practice mode: allow retry up to 3 attempts, then move on
      if (isPracticePhase) {
        if (newAttempts >= 3) {
          // Force move to next after 3 attempts
          setTimeout(() => {
            if (currentIndex < exercises.length - 1) {
              setCurrentIndex(prev => prev + 1);
            } else {
              setIsComplete(true);
            }
          }, 2500);
        }
        // Don't auto-reset for retry - let user use the retry button manually
      } else {
        // For assessment mode: only 1 attempt, then move on
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
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
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
    return (
      <div className={`space-y-6 transition-all duration-700 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        <CompletionSummary scoreData={scoreData} results={results} exercises={exercises} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 transition-all duration-500 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-teal-50 to-purple-50 p-6 rounded-xl border-2 border-teal-200/60 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/5 via-purple-400/5 to-teal-400/5 animate-pulse" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-500 relative overflow-hidden ${
                isPracticePhase 
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg' 
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
              }`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${
                  isPracticePhase 
                    ? 'from-teal-400 to-teal-500' 
                    : 'from-purple-400 to-purple-500'
                } animate-pulse opacity-30`} />
                <span className="relative z-10">
                  {isPracticePhase ? '🎯 Practice Mode' : '📊 Assessment Mode'}
                </span>
              </div>
              
              <div className="text-sm font-medium text-gray-700">
                {localizeDigitsInText(`${currentIndex + 1} / ${exercises.length}`)}
              </div>
              
              {/* Phase Transition Indicator */}
              {currentIndex === 3 && isPracticePhase && (
                <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full border border-purple-200 animate-pulse">
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
            <div className="absolute left-0 top-0 h-full w-1/2 bg-teal-100 rounded-l-full" />
            {/* Assessment Section Background */}
            <div className="absolute right-0 top-0 h-full w-1/2 bg-purple-100 rounded-r-full" />
            {/* Divider */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-300 transform -translate-x-0.5" />
            
            {/* Progress Fill */}
            <div 
              className={`h-full rounded-full transition-all duration-700 relative z-10 ${
                isPracticePhase 
                  ? 'bg-gradient-to-r from-teal-400 to-teal-500' 
                  : 'bg-gradient-to-r from-purple-400 to-purple-500'
              }`}
              style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
            />
            
            {/* Labels */}
            <div className="absolute -bottom-5 left-1/4 text-xs text-teal-600 font-medium">Practice</div>
            <div className="absolute -bottom-5 right-1/4 text-xs text-purple-600 font-medium">Assessment</div>
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
        attempts={attempts}
        animateSuccess={animateSuccess}
        animateError={animateError}
        results={results}
        onNext={handleNext}
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
  attempts,
  animateSuccess,
  animateError,
  results,
  onNext
}: {
  exercise: Exercise;
  userInput: string;
  setUserInput: (value: string) => void;
  onSubmit: () => void;
  showResult: boolean;
  setShowResult: (value: boolean) => void;
  showHint: boolean;
  attempts: number;
  animateSuccess: boolean;
  animateError: boolean;
  results: InteractiveResult[];
  onNext: () => void;
}) {
  const { localizeDigitsInText, formatNumber } = useLanguage();
  
  // Safety checks to prevent errors
  if (!exercise || !results) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="text-red-600 text-center">
          <span className="text-2xl">⚠️</span>
          <p className="mt-2">Loading exercise...</p>
        </div>
      </div>
    );
  }
  
  const latestResult = results.find(r => r?.exerciseId === exercise?.id);
  const isPractice = exercise?.type === 'practice';

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-700 transform ${
      animateSuccess ? 'scale-105 animate-learning-glow' : 
      animateError ? 'animate-shake' : 'scale-100'
    }`}>
      {/* Animated Background */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        isPractice 
          ? 'bg-gradient-to-br from-teal-50 to-cyan-50' 
          : 'bg-gradient-to-br from-purple-50 to-indigo-50'
      }`} />
      
      {/* Success/Error Overlay */}
      {showResult && (
        <div className={`absolute inset-0 transition-all duration-300 ${
          latestResult?.isCorrect 
            ? 'bg-green-500/10 animate-pulse' 
            : 'bg-red-500/10 animate-pulse'
        }`} />
      )}

      <div className="relative z-10 p-6">
        {/* Exercise Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-medium ${
              isPractice ? 'text-teal-700' : 'text-purple-700'
            }`}>
              {isPractice ? '🎯' : '📊'} {exercise.difficulty.toUpperCase()} • {exercise.topic.toUpperCase()}
            </span>
          </div>
          
          {attempts > 0 && (
            <div className="text-sm text-gray-600">
              Attempts: {formatNumber(attempts)}
            </div>
          )}
        </div>

        {/* Question */}
        <div className="mb-6">
          <div className={`text-xl font-bold mb-2 transition-all duration-300 ${
            showResult && latestResult?.isCorrect 
              ? 'text-green-700' 
              : showResult && !latestResult?.isCorrect 
              ? 'text-red-700' 
              : isPractice ? 'text-teal-800' : 'text-purple-800'
          }`}>
            {localizeDigitsInText(exercise.prompt)}
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your answer..."
              disabled={showResult && latestResult?.isCorrect}
              className={`flex-1 px-4 py-3 border-2 rounded-lg text-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 ${
                showResult && latestResult?.isCorrect
                  ? 'border-green-300 bg-green-50 text-green-800'
                  : showResult && !latestResult?.isCorrect
                  ? 'border-red-300 bg-red-50 text-red-800'
                  : isPractice
                  ? 'border-teal-300 focus:border-teal-500 focus:ring-teal-200'
                  : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200'
              }`}
              onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
            />
            
            <button
              onClick={onSubmit}
              disabled={!userInput.trim() || (showResult && latestResult?.isCorrect)}
              className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isPractice 
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Hint Section */}
        {showHint && exercise.visualHint && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg animate-slide-down">
            <div className="flex items-start space-x-2">
              <div className="text-yellow-600 text-lg">💡</div>
              <div>
                <div className="font-semibold text-yellow-800">Hint:</div>
                <div className="text-yellow-700 text-sm mt-1">{exercise.visualHint}</div>
              </div>
            </div>
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

// Result Display Component
function ResultDisplay({ result, exercise, onNext, onRetry }: { 
  result: InteractiveResult; 
  exercise: Exercise; 
  onNext: () => void;
  onRetry?: () => void;
}) {
  const { formatNumber } = useLanguage();
  
  return (
    <div className={`p-4 rounded-lg border-2 animate-slide-up ${
      result.isCorrect 
        ? 'bg-green-50 border-green-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`flex items-center space-x-2 mb-2 ${
            result.isCorrect ? 'text-green-700' : 'text-red-700'
          }`}>
            <div className="text-2xl">
              {result.isCorrect ? '✅' : '❌'}
            </div>
            <div className="font-bold text-lg">
              {result.isCorrect ? 'Correct!' : 'Incorrect'}
            </div>
          </div>
          
          {!result.isCorrect && (
            <div className="text-sm text-red-600 mb-2">
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
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-lg font-medium hover:from-teal-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
          >
            Next →
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {exercise.type === 'practice' && result.attempts < 3 && onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
              >
                Try Again
              </button>
            )}
            <button
              onClick={onNext}
              className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Score Display Component
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
        <span className="font-medium text-teal-700">
          🎯 Practice: {formatNumber(practiceScore)}/{formatNumber(practiceTotal)}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="font-medium text-purple-700">
          📊 Assessment: {formatNumber(assessmentScore)}/{formatNumber(assessmentTotal)}
        </span>
      </div>
    </div>
  );
}

// Completion Summary Component
function CompletionSummary({ scoreData, results, exercises }: {
  scoreData: any;
  results: InteractiveResult[];
  exercises: Exercise[];
}) {
  const { formatNumber } = useLanguage();
  
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
    <div className="bg-gradient-to-br from-teal-50 via-purple-50 to-indigo-50 rounded-xl p-8 border-2 border-teal-200/60 shadow-xl relative overflow-hidden animate-slide-up">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 via-purple-400/10 to-teal-400/10 animate-pulse" />
      
      <div className="relative z-10 text-center">
        <div className="text-6xl mb-4 animate-bounce">�</div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-700 to-purple-700 bg-clip-text text-transparent mb-2">
          Learning Complete!
        </h2>
        <p className="text-gray-600 mb-8">You've completed both practice and assessment phases</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Practice Results */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-teal-200/50 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-xl font-bold text-teal-700 mb-2">Practice Phase</h3>
            <div className="text-3xl font-bold text-teal-600 mb-2">
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
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-purple-200/50 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-purple-700 mb-2">Assessment Phase</h3>
            <div className="text-3xl font-bold text-purple-600 mb-2">
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
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-indigo-200/50 shadow-lg mb-6">
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Overall Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{Math.round(scoreData.overallAccuracy)}%</div>
              <div className="text-sm text-gray-600">Overall Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{scoreData.averageTime.toFixed(1)}s</div>
              <div className="text-sm text-gray-600">Average Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{formatNumber(results.length)}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🔄 Practice Again
          </button>
          <button 
            onClick={() => window.location.href = '/'} 
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            📚 Back to Learning
          </button>
        </div>
      </div>
    </div>
  );
}