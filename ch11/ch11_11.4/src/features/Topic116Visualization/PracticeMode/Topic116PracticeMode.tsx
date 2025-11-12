import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import ExponentsExerciseCard from '../../ExponentsVisualization/PracticeMode/ExponentsExerciseCard';

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

export default function Topic116PracticeMode() {
  const { t, language } = useLanguage();
  
  // Standard Form questions/answers/options with translations:
  const baseExercises = useMemo<Omit<Exercise, 'attempted' | 'correct' | 'skipped'>[]>(() => [
    {
      id: 'q1',
      prompt: t('practice_q1_prompt'),
      answer: '7.2 × 10⁶',
      options: [
        '7.2 × 10⁶', // correct
        '72 × 10⁵',
        '0.72 × 10⁷',
        '720 × 10⁴'
      ],
      explanation: t('practice_q1_explanation')
    },
    {
      id: 'q2',
      prompt: t('practice_q2_prompt'),
      answer: '4.5 × 10⁻⁴',
      options: [
        '45 × 10⁻⁵',
        '4.5 × 10⁻⁴', // correct
        '0.045 × 10⁻²',
        '0.45 × 10⁻³'
      ],
      explanation: t('practice_q2_explanation')
    },
    {
      id: 'q3',
      prompt: t('practice_q3_prompt'),
      answer: '9.3 × 10¹⁰',
      options: [
        '9.3 × 10¹¹',
        '93 × 10⁹',
        '9.3 × 10¹⁰', // correct
        '0.93 × 10¹¹'
      ],
      explanation: t('practice_q3_explanation')
    },
    {
      id: 'q4',
      prompt: t('practice_q4_prompt'),
      answer: '8.2 × 10⁻⁷',
      options: [
        '8.2 × 10⁻⁸',
        '0.82 × 10⁻⁶',
        '8.2 × 10⁻⁷', // correct
        '0.082 × 10⁻⁸'
      ],
      explanation: t('practice_q4_explanation')
    },
    {
      id: 'q5',
      prompt: t('practice_q5_prompt'),
      answer: '5.46 × 10¹³',
      options: [
        '5.46 × 10¹³', // correct
        '54.6 × 10¹²',
        '546 × 10¹⁰',
        '0.546 × 10¹⁴'
      ],
      explanation: t('practice_q5_explanation')
    },
    {
      id: 'q6',
      prompt: t('practice_q6_prompt'),
      answer: '3.7 × 10⁻¹⁰',
      options: [
        '3.7 × 10⁻¹⁰', // correct
        '37 × 10⁻¹⁰',
        '0.37 × 10⁻⁹',
        '0.037 × 10⁻⁸'
      ],
      explanation: t('practice_q6_explanation')
    }
  ], [language, t]);

  const [exercises, setExercises] = useState<Exercise[]>(() =>
    baseExercises.map(ex => ({ ...ex, attempted: false, skipped: false }))
  );
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Update exercises when language changes
  useEffect(() => {
    setExercises(baseExercises.map(ex => ({ ...ex, attempted: false, skipped: false })));
    setIndex(0);
    setCorrectCount(0);
    setAttempts([]);
  }, [baseExercises]);

  useEffect(() => { setQuestionStartTime(Date.now()); }, [index]);

  function onResult(ok: boolean) {
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const currentExercise = exercises[index];
    const attempt: QuestionAttempt = { questionId: currentExercise.id, answer: ok ? 'correct' : 'incorrect', isCorrect: ok, attempts: 1, timeSpent, skipped: false };
    setAttempts(prev => [...prev, attempt]);
    setExercises(prev => prev.map((ex, i) => i === index ? { ...ex, attempted: true, correct: ok } : ex));
    if (ok) setCorrectCount((c) => c + 1);
  }
  function goToPrevious() { if (index > 0) setIndex(index - 1); }
  function goToNext() { if (index < exercises.length - 1) setIndex(index + 1); }
  function skipQuestion() {
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const currentExercise = exercises[index];
    const attempt: QuestionAttempt = { questionId: currentExercise.id, answer: '', isCorrect: false, attempts: 0, timeSpent, skipped: true };
    setAttempts(prev => [...prev, attempt]);
    setExercises(prev => prev.map((ex, i) => i === index ? { ...ex, skipped: true, attempted: false } : ex));
    if (index < exercises.length - 1) setIndex(index + 1);
  }
  const currentExercise = exercises[index];
  const completedCount = exercises.filter(ex => ex.attempted && ex.correct).length;
  const attemptedCount = exercises.filter(ex => ex.attempted).length;
  const skippedCount = exercises.filter(ex => ex.skipped).length;
  const incorrectCount = attemptedCount - completedCount;
  const allQuestionsCompleted = exercises.every(ex => ex.attempted || ex.skipped);
  const calculateGrade = () => {
    const percentage = (correctCount / exercises.length) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };
  if (allQuestionsCompleted) {
    const totalTimeSpent = attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
    const averageTimePerQuestion = totalTimeSpent / exercises.length;
    const accuracyRate = exercises.length > 0 ? (correctCount / exercises.length) * 100 : 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6 space-y-6 animate-fadeIn">
        <div className="text-center p-8 bg-gradient-to-r from-green-600/30 to-blue-600/30 backdrop-blur-lg rounded-2xl border border-green-400/30 animate-bounce-gentle shadow-2xl">
          <motion.div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300 mb-2 flex items-center justify-center gap-2" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <motion.span animate={{y: [0, -15, 0],rotate: [0, -10, 10, 0]}} transition={{duration: 1.5,repeat: Infinity,repeatDelay: 0.5,ease: "easeInOut"}}>🎉</motion.span>
            {t('practice_complete')}
            <motion.span animate={{y: [0, -15, 0],rotate: [0, 10, -10, 0]}} transition={{duration: 1.5,repeat: Infinity,repeatDelay: 0.5,ease: "easeInOut",delay: 0.3}}>🎉</motion.span>
          </motion.div>
          <div className="text-xl text-purple-200">{t('practice_finished')}</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl border border-green-400/30 shadow-2xl animate-slideInLeft hover:scale-105 transition-transform">
            <motion.div className="text-5xl mb-2" animate={{y: [0, -12, 0],scale: [1, 1.1, 1]}} transition={{duration: 1.2,repeat: Infinity,repeatDelay: 0.8,ease: "easeInOut"}}>✅</motion.div>
            <div className="text-4xl font-bold text-green-300">{correctCount}</div>
            <div className="text-sm text-purple-200 font-medium mt-2">{t('practice_correct_count')}</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-red-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl border border-red-400/30 shadow-2xl animate-slideInUp hover:scale-105 transition-transform">
            <motion.div className="text-5xl mb-2" animate={{y: [0, -12, 0],scale: [1, 1.1, 1]}} transition={{duration: 1.2,repeat: Infinity,repeatDelay: 0.8,ease: "easeInOut",delay: 0.2}}>❌</motion.div>
            <div className="text-4xl font-bold text-red-300">{incorrectCount}</div>
            <div className="text-sm text-purple-200 font-medium mt-2">{t('practice_incorrect_count')}</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-2xl border border-yellow-400/30 shadow-2xl animate-slideInRight hover:scale-105 transition-transform">
            <motion.div className="text-5xl mb-2" animate={{y: [0, -12, 0],scale: [1, 1.1, 1]}} transition={{duration: 1.2,repeat: Infinity,repeatDelay: 0.8,ease: "easeInOut",delay: 0.4}}>⏭️</motion.div>
            <div className="text-4xl font-bold text-yellow-300">{skippedCount}</div>
            <div className="text-sm text-purple-200 font-medium mt-2">{t('practice_skipped_count')}</div>
          </div>
        </div>
        <div className="text-center p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl border border-cyan-400/30 shadow-2xl animate-scaleIn hover:scale-105 transition-transform">
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 mb-2">{exercises.length}</div>
          <div className="text-lg text-purple-200 font-semibold">{t('practice_total')}</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="text-center p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl border border-purple-400/30 shadow-2xl animate-slideInLeft hover:scale-105 transition-transform">
            <motion.div className="text-5xl mb-2" animate={{y: [0, -12, 0],rotate: [0, -8, 8, 0],scale: [1, 1.1, 1]}} transition={{duration: 1.3,repeat: Infinity,repeatDelay: 0.7,ease: "easeInOut"}}>🏆</motion.div>
            <div className="text-4xl font-bold text-purple-300">{calculateGrade()}</div>
            <div className="text-sm text-purple-200 mt-2">{t('practice_final_grade')}</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-lg rounded-2xl border border-blue-400/30 shadow-2xl animate-slideInUp hover:scale-105 transition-transform">
            <motion.div className="text-5xl mb-2" animate={{y: [0, -12, 0],scale: [1, 1.1, 1],rotate: [0, 5, -5, 0]}} transition={{duration: 1.2,repeat: Infinity,repeatDelay: 0.8,ease: "easeInOut",delay: 0.2}}>🎯</motion.div>
            <div className="text-4xl font-bold text-blue-300">{accuracyRate.toFixed(1)}%</div>
            <div className="text-sm text-purple-200 mt-2">{t('practice_accuracy_rate')}</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-600/20 to-teal-600/20 backdrop-blur-lg rounded-2xl border border-green-400/30 shadow-2xl animate-slideInRight hover:scale-105 transition-transform">
            <div className="text-5xl mb-2">⚡</div>
            <div className="text-4xl font-bold text-green-300">{Math.round(averageTimePerQuestion)}s</div>
            <div className="text-sm text-purple-200 mt-2">{t('practice_avg_time')}</div>
          </div>
        </div>
        <div className="text-center">
          <button onClick={() => window.location.reload()} className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xl font-bold rounded-2xl hover:from-cyan-600 hover:to-purple-700 transition-all transform hover:scale-110 shadow-2xl animate-bounce-gentle">
            <motion.span animate={{rotate: [0, 360]}} transition={{duration: 2,repeat: Infinity,ease: "linear"}}>🔄</motion.span>
            {' '}{t('practice_try_again')}
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-2xl animate-slide-in-down">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                {t('practice_title')}
              </h3>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-lg text-purple-200 font-semibold">
                {t('practice_question_x_of_y')} {index + 1} / {exercises.length}
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 shadow-lg animate-pulse-gentle" style={{ width: `${((index + 1) / exercises.length) * 100}%` }} />
          </div>
        </div>
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
            <div className="text-xl text-gray-600">{t('practice_loading')}</div>
          </div>
        )}
      </div>
    </div>
  );
}
