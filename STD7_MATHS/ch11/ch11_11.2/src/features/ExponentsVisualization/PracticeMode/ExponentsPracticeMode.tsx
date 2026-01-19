import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import ExponentsExerciseCard from './ExponentsExerciseCard';

type Exercise = { 
  id: string;
  prompt: string; 
  answer: string; 
  options: string[];
  explanation: string;
  attempted: boolean;
  correct?: boolean;
  skipped: boolean;
};

type QuestionAttempt = {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  attempts: number;
  timeSpent: number;
  skipped: boolean;
};

export default function ExponentsPracticeMode() {
  const { t } = useLanguage();
  
  const baseExercises = useMemo<Omit<Exercise, 'attempted' | 'correct' | 'skipped'>[]>(() => [
    { 
      id: 'q1', 
      prompt: t('q1_prompt'), 
      answer: '32', 
      // Q1: Using Law 1: Calculate 2³ × 2²
      // Law 1: aᵐ × aⁿ = aᵐ⁺ⁿ. So 2³ × 2² = 2³⁺² = 2⁵ = 32
      options: ['16', '32', '64', '128'],
      explanation: t('q1_explanation')
    },
    { 
      id: 'q2', 
      prompt: t('q2_prompt'), 
      answer: '25', 
      // Q2: Using Law 2: Calculate 5⁴ ÷ 5²
      // Law 2: aᵐ ÷ aⁿ = aᵐ⁻ⁿ. So 5⁴ ÷ 5² = 5⁴⁻² = 5² = 25
      options: ['5', '10', '25', '125'],
      explanation: t('q2_explanation')
    },
    { 
      id: 'q3', 
      prompt: t('q3_prompt'), 
      answer: '729', 
      // Q3: Using Law 3: Calculate (3²)³
      // Law 3: (aᵐ)ⁿ = aᵐⁿ. So (3²)³ = 3²×³ = 3⁶ = 729
      options: ['81', '243', '729', '2187'],
      explanation: t('q3_explanation')
    },
    { 
      id: 'q4', 
      prompt: t('q4_prompt'), 
      answer: '1,000', 
      // Q4: Using Law 4: Calculate 2³ × 5³
      // Law 4: aᵐ × bᵐ = (ab)ᵐ. So 2³ × 5³ = (2 × 5)³ = 10³ = 1,000
      options: ['100', '200', '1,000', '10,000'],
      explanation: t('q4_explanation')
    },
    { 
      id: 'q5', 
      prompt: t('q5_prompt'), 
      answer: '16', 
      // Q5: Using Law 5: Calculate 8² ÷ 2²
      // Law 5: aᵐ ÷ bᵐ = (a/b)ᵐ. So 8² ÷ 2² = (8/2)² = 4² = 16
      options: ['4', '8', '16', '64'],
      explanation: t('q5_explanation')
    },
    { 
      id: 'q6', 
      prompt: t('q6_prompt'), 
      answer: '1', 
      // Q6: Using Law 6: Calculate 7⁰
      // Law 6: a⁰ = 1 (for any non-zero a). So 7⁰ = 1
      options: ['0', '1', '7', '10'],
      explanation: t('q6_explanation')
    },
  ], [t]);

  // Initialize exercises with tracking
  const [exercises, setExercises] = useState<Exercise[]>(() => 
    baseExercises.map(ex => ({ ...ex, attempted: false, skipped: false }))
  );

  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Reset question timer when index changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [index]);

  function onResult(ok: boolean) {
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const currentExercise = exercises[index];
    
    // Record the attempt
    const attempt: QuestionAttempt = {
      questionId: currentExercise.id,
      answer: ok ? 'correct' : 'incorrect',
      isCorrect: ok,
      attempts: 1,
      timeSpent,
      skipped: false
    };
    
    setAttempts(prev => [...prev, attempt]);

    // Update exercise status
    setExercises(prev => prev.map((ex, i) => 
      i === index ? { ...ex, attempted: true, correct: ok } : ex
    ));

    if (ok) {
      setCorrectCount((c) => c + 1);
    }
  }

  function goToPrevious() {
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  function goToNext() {
    if (index < exercises.length - 1) {
      setIndex(index + 1);
    }
  }

  function skipQuestion() {
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const currentExercise = exercises[index];
    
    // Record as skipped
    const attempt: QuestionAttempt = {
      questionId: currentExercise.id,
      answer: '',
      isCorrect: false,
      attempts: 0,
      timeSpent,
      skipped: true
    };
    
    setAttempts(prev => [...prev, attempt]);

    // Update exercise status
    setExercises(prev => prev.map((ex, i) => 
      i === index ? { ...ex, skipped: true, attempted: false } : ex
    ));

    // Move to next question automatically
    if (index < exercises.length - 1) {
      setIndex(index + 1);
    }
  }

  const currentExercise = exercises[index];
  const completedCount = exercises.filter(ex => ex.attempted && ex.correct).length;
  const attemptedCount = exercises.filter(ex => ex.attempted).length;
  const skippedCount = exercises.filter(ex => ex.skipped).length;
  const incorrectCount = attemptedCount - completedCount;

  // Check if session is complete (all questions attempted or skipped)
  const allQuestionsCompleted = exercises.every(ex => ex.attempted || ex.skipped);
  
  // Calculate comprehensive statistics
  const calculateGrade = () => {
    const percentage = (correctCount / exercises.length) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  // If session is complete, show comprehensive summary
  if (allQuestionsCompleted) {
    const totalTimeSpent = attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
    const averageTimePerQuestion = totalTimeSpent / exercises.length;
    const accuracyRate = exercises.length > 0 ? (correctCount / exercises.length) * 100 : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6 space-y-6 animate-fadeIn">
        {/* SESSION COMPLETE HEADER */}
        <div className="text-center p-8 bg-gradient-to-r from-green-600/30 to-blue-600/30 backdrop-blur-lg rounded-2xl border border-green-400/30 animate-bounce-gentle shadow-2xl">
          <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300 mb-2">
            🎉 {t('sessionComplete')} 🎉
          </div>
          <div className="text-xl text-purple-200">{t('sessionSummary')}</div>
        </div>

        {/* COMPREHENSIVE STATISTICS - 3 CATEGORIES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl border border-green-400/30 shadow-2xl animate-slideInLeft hover:scale-105 transition-transform">
            <div className="text-5xl mb-2">✅</div>
            <div className="text-4xl font-bold text-green-300">{correctCount}</div>
            <div className="text-sm text-purple-200 font-medium mt-2">{t('correctAnswers')}</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-red-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl border border-red-400/30 shadow-2xl animate-slideInUp hover:scale-105 transition-transform">
            <div className="text-5xl mb-2">❌</div>
            <div className="text-4xl font-bold text-red-300">{incorrectCount}</div>
            <div className="text-sm text-purple-200 font-medium mt-2">{t('incorrectAnswers')}</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-2xl border border-yellow-400/30 shadow-2xl animate-slideInRight hover:scale-105 transition-transform">
            <div className="text-5xl mb-2">⏭️</div>
            <div className="text-4xl font-bold text-yellow-300">{skippedCount}</div>
            <div className="text-sm text-purple-200 font-medium mt-2">{t('skippedQuestions')}</div>
          </div>
        </div>

        {/* TOTAL QUESTIONS ROW */}
        <div className="text-center p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl border border-cyan-400/30 shadow-2xl animate-scaleIn hover:scale-105 transition-transform">
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 mb-2">{exercises.length}</div>
          <div className="text-lg text-purple-200 font-semibold">{t('totalQuestions')}</div>
        </div>

        {/* PERFORMANCE METRICS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="text-center p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl border border-purple-400/30 shadow-2xl animate-slideInLeft hover:scale-105 transition-transform">
            <div className="text-5xl mb-2">🏆</div>
            <div className="text-4xl font-bold text-purple-300">{calculateGrade()}</div>
            <div className="text-sm text-purple-200 mt-2">{t('finalGrade')}</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-lg rounded-2xl border border-blue-400/30 shadow-2xl animate-slideInUp hover:scale-105 transition-transform">
            <div className="text-5xl mb-2">🎯</div>
            <div className="text-4xl font-bold text-blue-300">{accuracyRate.toFixed(1)}%</div>
            <div className="text-sm text-purple-200 mt-2">{t('accuracyRate')}</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-600/20 to-teal-600/20 backdrop-blur-lg rounded-2xl border border-green-400/30 shadow-2xl animate-slideInRight hover:scale-105 transition-transform">
            <div className="text-5xl mb-2">⚡</div>
            <div className="text-4xl font-bold text-green-300">{Math.round(averageTimePerQuestion)}s</div>
            <div className="text-sm text-purple-200 mt-2">{t('avgTimePerQuestion')}</div>
          </div>
        </div>

        {/* RESTART BUTTON */}
        <div className="text-center">
          <button 
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xl font-bold rounded-2xl hover:from-cyan-600 hover:to-purple-700 transition-all transform hover:scale-110 shadow-2xl animate-bounce-gentle"
          >
            🔄 {t('startNewSession')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Animated Progress Header */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-2xl animate-slide-in-down">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
              {t('practiceMode')}
            </h3>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-lg text-purple-200 font-semibold">
              {t('question')} {index + 1} / {exercises.length}
            </div>
          </div>
        </div>
        
        {/* Animated Progress Bar */}
        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 shadow-lg animate-pulse-gentle"
            style={{ width: `${((index + 1) / exercises.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Question */}
      {currentExercise ? (
        <ExponentsExerciseCard 
          prompt={currentExercise.prompt} 
          answer={currentExercise.answer}
          options={currentExercise.options}
          explanation={currentExercise.explanation}
          onResult={onResult}
          questionNumber={index + 1}
          totalQuestions={exercises.length}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onSkip={skipQuestion}
          canGoPrevious={index > 0}
          canGoNext={index < exercises.length - 1}
        />
      ) : (
        <div className="text-center p-8">
          <div className="text-xl text-gray-600">{t('loadingQuestions')}</div>
        </div>
      )}
      </div>
    </div>
  );
}