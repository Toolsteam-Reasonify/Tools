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
    { id: 'q1', promptKey: 'practice_q1', prompt: 'Evaluate: 12 ÷ 3', answer: 4 },
    { id: 'q2', promptKey: 'practice_q2', prompt: 'Evaluate: (-15) ÷ 5', answer: -3 },
    { id: 'q3', promptKey: 'practice_q3', prompt: 'Evaluate: 18 ÷ (-6)', answer: -3 },
    { id: 'q4', promptKey: 'practice_q4', prompt: 'Evaluate: (-24) ÷ (-4)', answer: 6 },
    { id: 'q5', promptKey: 'practice_q5', prompt: 'Evaluate: 0 ÷ 7', answer: 0 },
    { id: 'q6', promptKey: 'practice_q6', prompt: 'Evaluate: 35 ÷ (-7)', answer: -5 },
  ], []);

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
      prompt: t(ex.promptKey) || ex.prompt // Fallback to original if translation not found
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

  function notAttemptQuestion() {
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const currentExercise = exercises[index];
    
    // Record as not attempted (different from skipped)
    const attempt: QuestionAttempt = {
      questionId: currentExercise.id,
      answer: 'NOT_ATTEMPTED',
      isCorrect: false,
      attempts: 0,
      timeSpent,
      skipped: false
    };
    
    setAttempts(prev => [...prev, attempt]);

    // Update exercise status as not attempted
    setExercises(prev => prev.map((ex, i) => 
      i === index ? { ...ex, attempted: false, skipped: false } : ex
    ));

    // Move to next question automatically
    if (index < exercises.length - 1) {
      setIndex(index + 1);
    }
  }

  function jumpToQuestion(questionIndex: number) {
    setIndex(questionIndex);
  }

  const currentExercise = exercises[index];
  const completedCount = exercises.filter(ex => ex.attempted && ex.correct).length;
  const attemptedCount = exercises.filter(ex => ex.attempted).length;
  const skippedCount = exercises.filter(ex => ex.skipped).length;
  const notAttemptedCount = exercises.filter(ex => !ex.attempted && !ex.skipped).length;
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
          <div className="text-3xl font-bold text-green-700 mb-2">🎉 {t('session_complete') || 'Session Complete!'} 🎉</div>
          <div className="text-lg text-gray-600">{t('session_summary') || 'Here\'s your complete session summary'}</div>
        </div>

        {/* COMPREHENSIVE STATISTICS - ALL 4 CATEGORIES */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200 shadow-sm">
            <div className="text-4xl font-bold text-green-600">{correctCount}</div>
            <div className="text-sm text-gray-700 font-medium">{t('correct_answers') || 'Correct Answers'}</div>
          </div>
          
          <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200 shadow-sm">
            <div className="text-4xl font-bold text-red-600">{incorrectCount}</div>
            <div className="text-sm text-gray-700 font-medium">{t('incorrect_answers') || 'Incorrect Answers'}</div>
          </div>
          
          <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
            <div className="text-4xl font-bold text-yellow-600">{skippedCount}</div>
            <div className="text-sm text-gray-700 font-medium">{t('skipped_questions') || 'Skipped Questions'}</div>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-4xl font-bold text-gray-600">{notAttemptedCount}</div>
            <div className="text-sm text-gray-700 font-medium">{t('not_attempted') || 'Not Attempted'}</div>
          </div>
        </div>

        {/* TOTAL QUESTIONS ROW */}
        <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
          <div className="text-5xl font-bold text-blue-600 mb-2">{exercises.length}</div>
          <div className="text-lg text-gray-700 font-semibold">{t('total_questions') || 'Total Questions'}</div>
        </div>

        {/* PERFORMANCE METRICS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="text-4xl font-bold text-purple-600">{calculateGrade()}</div>
            <div className="text-sm text-gray-600">{t('final_grade') || 'Final Grade'}</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-600">{accuracyRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">{t('accuracy_rate') || 'Accuracy Rate'}</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600">{Math.round(averageTimePerQuestion / 1000)}s</div>
            <div className="text-sm text-gray-600">{t('avg_time_per_question') || 'Avg Time/Question'}</div>
          </div>
        </div>

        {/* DETAILED QUESTION REVIEW */}
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{t('question_review') || 'Question by Question Review'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {exercises.map((exercise, i) => (
              <div key={exercise.id} className={`p-3 rounded-lg border-2 ${
                exercise.correct 
                  ? 'bg-green-50 border-green-200' 
                  : exercise.skipped 
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Q{i + 1}</span>
                  <span className="text-lg">
                    {exercise.correct ? '✅' : exercise.skipped ? '⏭️' : '❌'}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {exercise.correct ? t('correct') : exercise.skipped ? t('skipped') : t('incorrect')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RESTART BUTTON */}
        <div className="text-center">
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            {t('start_new_session') || 'Start New Session'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Simple Progress Header */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{t('practice')} {t('mode')}</h3>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
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
      <PracticeExerciseCard 
        prompt={currentExercise.prompt} 
        answer={currentExercise.answer} 
        onResult={onResult}
        questionNumber={index + 1}
        totalQuestions={exercises.length}
        isAttempted={currentExercise.attempted}
        isSkipped={currentExercise.skipped}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onSkip={skipQuestion}
        onNotAttempt={notAttemptQuestion}
        canGoPrevious={index > 0}
        canGoNext={index < exercises.length - 1}
      />
    </div>
  );
}