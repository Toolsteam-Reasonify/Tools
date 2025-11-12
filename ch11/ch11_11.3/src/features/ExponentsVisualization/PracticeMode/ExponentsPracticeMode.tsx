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
  const tr = (key: string, fallback: string) => {
    const v = t(key);
    return v === key ? fallback : v;
  };
  
  const baseExercises = useMemo<Omit<Exercise, 'attempted' | 'correct' | 'skipped'>[]>(() => [
    { 
      id: 'q1', 
      prompt: tr('decimal_q1_prompt', 'Convert 47561 to expanded form using powers of 10.'),
      answer: '4×10⁴ + 7×10³ + 5×10² + 6×10¹ + 1×10⁰', 
      // Q1: Convert 47561 to expanded form using powers of 10
      options: [
        '4×10⁴ + 7×10³ + 5×10² + 6×10¹ + 1×10⁰',
        '4×10³ + 7×10² + 5×10¹ + 6×10⁰',
        '4×10⁵ + 7×10⁴ + 5×10³ + 6×10² + 1×10¹',
        '4×10⁶ + 7×10⁵ + 5×10⁴ + 6×10³ + 1×10²'
      ],
      explanation: tr('decimal_q1_explanation', 'Break the number by place value: 4 in ten-thousands, 7 in thousands, 5 in hundreds, 6 in tens, 1 in ones.')
    },
    { 
      id: 'q2', 
      prompt: tr('decimal_q2_prompt', 'Convert 8392 to expanded form using powers of 10.'),
      answer: '8×10³ + 3×10² + 9×10¹ + 2×10⁰', 
      // Q2: Convert 8392 to expanded form using powers of 10
      options: [
        '8×10³ + 3×10² + 9×10¹ + 2×10⁰',
        '8×10⁴ + 3×10³ + 9×10² + 2×10¹',
        '8×10² + 3×10³ + 9×10¹ + 2×10⁰',
        '8×10³ + 3×10¹ + 9×10² + 2×10⁰'
      ],
      explanation: tr('decimal_q2_explanation', 'Write each digit times a power of 10 for its place value (thousands to ones).')
    },
    { 
      id: 'q3', 
      prompt: tr('decimal_q3_prompt', 'Convert 2054 to expanded form using powers of 10.'),
      answer: '2×10³ + 0×10² + 5×10¹ + 4×10⁰', 
      // Q3: Convert 2054 to expanded form using powers of 10
      options: [
        '2×10³ + 0×10² + 5×10¹ + 4×10⁰',
        '2×10⁴ + 0×10³ + 5×10² + 4×10¹',
        '2×10³ + 5×10² + 0×10¹ + 4×10⁰',
        '2×10² + 0×10³ + 5×10¹ + 4×10⁰'
      ],
      explanation: tr('decimal_q3_explanation', 'Include zero for the hundreds place: 0×10².')
    },
    { 
      id: 'q4', 
      prompt: tr('decimal_q4_prompt', 'Convert 69038 to expanded form using powers of 10.'),
      answer: '6×10⁴ + 9×10³ + 0×10² + 3×10¹ + 8×10⁰', 
      // Q4: Convert 69038 to expanded form using powers of 10
      options: [
        '6×10⁴ + 9×10³ + 0×10² + 3×10¹ + 8×10⁰',
        '6×10⁵ + 9×10⁴ + 0×10³ + 3×10² + 8×10¹',
        '6×10⁴ + 9×10² + 0×10³ + 3×10¹ + 8×10⁰',
        '6×10³ + 9×10² + 0×10¹ + 3×10⁰ + 8×10⁻¹'
      ],
      explanation: tr('decimal_q4_explanation', 'Zero still appears as 0×10² for the hundreds place.')
    },
    { 
      id: 'q5', 
      prompt: tr('decimal_q5_prompt', 'Convert 1209 to expanded form using powers of 10.'),
      answer: '1×10³ + 2×10² + 0×10¹ + 9×10⁰', 
      // Q5: Convert 1209 to expanded form using powers of 10
      options: [
        '1×10³ + 2×10² + 0×10¹ + 9×10⁰',
        '1×10⁴ + 2×10³ + 0×10² + 9×10¹',
        '1×10³ + 0×10² + 2×10¹ + 9×10⁰',
        '1×10² + 2×10³ + 0×10¹ + 9×10⁰'
      ],
      explanation: tr('decimal_q5_explanation', 'Hundreds and tens contribute 2×10² and 0×10¹ respectively.')
    },
    { 
      id: 'q6', 
      prompt: tr('decimal_q6_prompt', 'Convert 53007 to expanded form using powers of 10.'),
      answer: '5×10⁴ + 3×10³ + 0×10² + 0×10¹ + 7×10⁰', 
      // Q6: Convert 53007 to expanded form using powers of 10
      options: [
        '5×10⁴ + 3×10³ + 0×10² + 0×10¹ + 7×10⁰',
        '5×10⁵ + 3×10⁴ + 0×10³ + 0×10² + 7×10¹',
        '5×10⁴ + 3×10² + 0×10³ + 0×10¹ + 7×10⁰',
        '5×10³ + 3×10² + 0×10¹ + 0×10⁰ + 7×10⁻¹'
      ],
      explanation: tr('decimal_q6_explanation', 'Include zeros for hundreds and tens places: 0×10² and 0×10¹.')
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