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
      answer: '4×10⁴ + 7×10³ + 5×10² + 6×10¹ + 1×10⁰', 
      // Q1: Convert 47561 to expanded form using powers of 10
      options: [
        '4×10⁴ + 7×10³ + 5×10² + 6×10¹ + 1×10⁰',
        '4×10³ + 7×10² + 5×10¹ + 6×10⁰',
        '4×10⁵ + 7×10⁴ + 5×10³ + 6×10² + 1×10¹',
        '4×10⁶ + 7×10⁵ + 5×10⁴ + 6×10³ + 1×10²'
      ],
      explanation: t('q1_explanation')
    },
    { 
      id: 'q2', 
      prompt: t('q2_prompt'), 
      answer: '40,000', 
      // Q2: What is the value of the digit 4 in 47561?
      options: ['4,000', '40,000', '400', '4'],
      explanation: t('q2_explanation')
    },
    { 
      id: 'q3', 
      prompt: t('q3_prompt'), 
      answer: '5.976 × 10²⁴', 
      // Q3: Convert 5,976,000,000,000,000,000,000,000 to standard form
      options: ['5.976 × 10²⁴', '59.76 × 10²³', '0.5976 × 10²⁵', '597.6 × 10²¹'],
      explanation: t('q3_explanation')
    },
    { 
      id: 'q4', 
      prompt: t('q4_prompt'), 
      answer: '3.84 × 10⁹', 
      // Q4: What is 3,840,000,000 in standard form?
      options: ['3.84 × 10⁹', '38.4 × 10⁸', '0.384 × 10¹⁰', '384 × 10⁷'],
      explanation: t('q4_explanation')
    },
    { 
      id: 'q5', 
      prompt: t('q5_prompt'), 
      answer: '1.2756 × 10⁷', 
      // Q5: Convert 12,756,000 to standard form
      options: ['1.2756 × 10⁷', '12.756 × 10⁶', '0.12756 × 10⁸', '127.56 × 10⁵'],
      explanation: t('q5_explanation')
    },
    { 
      id: 'q6', 
      prompt: t('q6_prompt'), 
      answer: 'No', 
      // Q6: Is 59.85 × 10² in correct standard form?
      options: ['Yes', 'No'],
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
          <motion.div 
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300 mb-2 flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -10, 10, 0]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.5,
                ease: "easeInOut"
              }}
            >
              🎉
            </motion.span>
            {t('sessionComplete')}
            <motion.span
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.5,
                ease: "easeInOut",
                delay: 0.3
              }}
            >
              🎉
            </motion.span>
          </motion.div>
          <div className="text-xl text-purple-200">{t('sessionSummary')}</div>
        </div>

        {/* COMPREHENSIVE STATISTICS - 3 CATEGORIES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl border border-green-400/30 shadow-2xl animate-slideInLeft hover:scale-105 transition-transform">
            <motion.div 
              className="text-5xl mb-2"
              animate={{ 
                y: [0, -12, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 0.8,
                ease: "easeInOut"
              }}
            >
              ✅
            </motion.div>
            <div className="text-4xl font-bold text-green-300">{correctCount}</div>
            <div className="text-sm text-purple-200 font-medium mt-2">{t('correctAnswers')}</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-red-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl border border-red-400/30 shadow-2xl animate-slideInUp hover:scale-105 transition-transform">
            <motion.div 
              className="text-5xl mb-2"
              animate={{ 
                y: [0, -12, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 0.8,
                ease: "easeInOut",
                delay: 0.2
              }}
            >
              ❌
            </motion.div>
            <div className="text-4xl font-bold text-red-300">{incorrectCount}</div>
            <div className="text-sm text-purple-200 font-medium mt-2">{t('incorrectAnswers')}</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-2xl border border-yellow-400/30 shadow-2xl animate-slideInRight hover:scale-105 transition-transform">
            <motion.div 
              className="text-5xl mb-2"
              animate={{ 
                y: [0, -12, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 0.8,
                ease: "easeInOut",
                delay: 0.4
              }}
            >
              ⏭️
            </motion.div>
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
            <motion.div 
              className="text-5xl mb-2"
              animate={{ 
                y: [0, -12, 0],
                rotate: [0, -8, 8, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 1.3,
                repeat: Infinity,
                repeatDelay: 0.7,
                ease: "easeInOut"
              }}
            >
              🏆
            </motion.div>
            <div className="text-4xl font-bold text-purple-300">{calculateGrade()}</div>
            <div className="text-sm text-purple-200 mt-2">{t('finalGrade')}</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-lg rounded-2xl border border-blue-400/30 shadow-2xl animate-slideInUp hover:scale-105 transition-transform">
            <motion.div 
              className="text-5xl mb-2"
              animate={{ 
                y: [0, -12, 0],
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 0.8,
                ease: "easeInOut",
                delay: 0.2
              }}
            >
              🎯
            </motion.div>
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
            <motion.span
              animate={{ 
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              🔄
            </motion.span>
            {' '}{t('startNewSession')}
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