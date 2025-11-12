import { useMemo, useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import PracticeExerciseCard from './PracticeExerciseCard';

type Exercise = { 
  id: string;
  promptKey: string; 
  prompt: string; 
  answer: number; 
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

export default function PracticeMode() {
  const { t, language } = useLanguage();
  
  const baseExercises = useMemo<Omit<Exercise, 'attempted' | 'correct' | 'skipped'>[]>(() => [
    { id: 'q1', promptKey: 'practice_q1', prompt: t('practice_q1'), answer: 8 },
    { id: 'q2', promptKey: 'practice_q2', prompt: t('practice_q2'), answer: 8 },
    { id: 'q3', promptKey: 'practice_q3', prompt: t('practice_q3'), answer: 18 },
    { id: 'q4', promptKey: 'practice_q4', prompt: t('practice_q4'), answer: 6 },
    { id: 'q5', promptKey: 'practice_q5', prompt: t('practice_q5'), answer: 8 },
    { id: 'q6', promptKey: 'practice_q6', prompt: t('practice_q6'), answer: 4 },
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

  // Update exercises when language changes
  useEffect(() => {
    setExercises(prev => prev.map(ex => ({
      ...ex,
      prompt: t(ex.promptKey) // Use translated prompt
    })));
  }, [language, t]);

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
      <div className="p-6 space-y-6">
        {/* SESSION COMPLETE HEADER */}
        <div className="text-center p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <div className="text-3xl font-bold text-green-700 mb-2">🎉 {t('sessionComplete')} 🎉</div>
          <div className="text-lg text-gray-600">{t('sessionSummary')}</div>
        </div>

        {/* COMPREHENSIVE STATISTICS - 3 CATEGORIES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-4 sm:p-6 bg-green-50 rounded-lg border border-green-200 shadow-sm">
            <div className="text-3xl sm:text-4xl font-bold text-green-600">{correctCount}</div>
            <div className="text-xs sm:text-sm text-gray-700 font-medium">{t('correctAnswers')}</div>
          </div>
          
          <div className="text-center p-4 sm:p-6 bg-red-50 rounded-lg border border-red-200 shadow-sm">
            <div className="text-3xl sm:text-4xl font-bold text-red-600">{incorrectCount}</div>
            <div className="text-xs sm:text-sm text-gray-700 font-medium">{t('incorrectAnswers')}</div>
          </div>
          
          <div className="text-center p-4 sm:p-6 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
            <div className="text-3xl sm:text-4xl font-bold text-yellow-600">{skippedCount}</div>
            <div className="text-xs sm:text-sm text-gray-700 font-medium">{t('skippedQuestions')}</div>
          </div>
        </div>

        {/* TOTAL QUESTIONS ROW */}
        <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
          <div className="text-5xl font-bold text-blue-600 mb-2">{exercises.length}</div>
          <div className="text-lg text-gray-700 font-semibold">{t('totalQuestions')}</div>
        </div>

        {/* PERFORMANCE METRICS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="text-4xl font-bold text-purple-600">{calculateGrade()}</div>
            <div className="text-sm text-gray-600">{t('finalGrade')}</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-600">{accuracyRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">{t('accuracyRate')}</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600">{Math.round(averageTimePerQuestion)}s</div>
            <div className="text-sm text-gray-600">{t('avgTimePerQuestion')}</div>
          </div>
        </div>


        {/* RESTART BUTTON */}
        <div className="text-center">
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
{t('startNewSession')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Simple Progress Header */}
      <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">{t('practiceMode')}</h3>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-xs sm:text-sm text-gray-600">
{t('question')} {index + 1} / {exercises.length}
            </div>
          </div>
        </div>
        
        {/* Simple Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / exercises.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Question */}
      {currentExercise ? (
        <PracticeExerciseCard 
          prompt={currentExercise.prompt} 
          answer={currentExercise.answer} 
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
  );
}
