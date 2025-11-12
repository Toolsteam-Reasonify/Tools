import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

type Props = {
  prompt: string;
  answer: number;
  onResult?: (correct: boolean) => void;
  questionNumber?: number;
  totalQuestions?: number;
  isAttempted?: boolean;
  isSkipped?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
};

export default function PracticeExerciseCard({ 
  prompt, 
  answer, 
  onResult,
  questionNumber,
  totalQuestions,
  onPrevious,
  onNext,
  onSkip,
  canGoPrevious = true,
  canGoNext = true
}: Props) {
  const { t } = useLanguage();
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setValue('');
    setFeedback(null);
    setIsSubmitted(false);
    setShowAnswer(false);
  }, [prompt]);

  function check() {
    if (!value.trim()) return;
    
    setIsSubmitted(true);
    
    const cleaned = value.trim().replace(/%/g, '').trim();
    const num = Number(cleaned);
    const tol = 0.3; // small tolerance to allow rounding (e.g., 33.33)
    const ok = !isNaN(num) && Math.abs(num - answer) <= tol;
    
    setFeedback(ok ? 'correct' : 'incorrect');
    onResult?.(ok);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !isSubmitted) {
      check();
    }
  }

  function reset() {
    setValue('');
    setFeedback(null);
    setIsSubmitted(false);
    setShowAnswer(false);
  }

  return (
    <div className="practice-card bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      {/* TOP NAVIGATION - ALWAYS VISIBLE */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg ${
              !canGoPrevious
                ? 'bg-white/20 text-white/50 cursor-not-allowed'
                : 'bg-white/30 hover:bg-white/40 transform hover:scale-105'
            }`}
          >
            ← <span className="hidden sm:inline">{t('previous')}</span>
          </button>

          <div className="text-center">
            <div className="text-base sm:text-xl font-bold">
{t('question')} {questionNumber || 1} / {totalQuestions || 1}
            </div>
          </div>

          <button
            onClick={onNext}
            disabled={!canGoNext}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg ${
              !canGoNext
                ? 'bg-white/20 text-white/50 cursor-not-allowed'
                : 'bg-white/30 hover:bg-white/40 transform hover:scale-105'
            }`}
          >
            <span className="hidden sm:inline">{t('next')}</span> →
          </button>
        </div>
      </div>

      {/* QUESTION CONTENT */}
      <div className="p-8 space-y-6">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-800 mb-4">
            {prompt}
          </div>
        </div>

        <div className="space-y-4">
          <input 
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg text-center"
            placeholder={t('yourAnswer')} 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSubmitted}
            type="text"
          />
          
          <div className="flex justify-center gap-3">
            <button 
              className={`px-6 py-2 rounded-lg font-medium ${
                isSubmitted || !value.trim()
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              onClick={check}
              disabled={isSubmitted || !value.trim()}
            >
{t('submit')}
            </button>
          </div>
        </div>

        {/* FEEDBACK */}
        {feedback && (
          <div className={`text-center py-4 px-6 rounded-xl border-2 shadow-lg ${
            feedback === 'correct' 
              ? 'bg-green-50 text-green-800 border-green-300' 
              : 'bg-red-50 text-red-800 border-red-300'
          }`}>
            <div className="text-3xl mb-2">
              {feedback === 'correct' ? '✅' : '❌'}
            </div>
            <div className="text-xl font-bold">
              {feedback === 'correct' ? t('correct') + '!' : t('incorrect')}
            </div>
          </div>
        )}

        {/* SIMPLE NAVIGATION AFTER ANSWER */}
        {isSubmitted && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex justify-center gap-4">
              <button
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                ← {t('previous')}
              </button>
              
              <button
                onClick={onNext}
                disabled={!canGoNext}
                className="px-4 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {t('next')} →
              </button>
            </div>
          </div>
        )}

        {/* SHOW ANSWER */}
        {showAnswer && (
          <div className="bg-blue-100 text-blue-800 p-6 rounded-xl text-center border-4 border-blue-300">
            <div className="text-lg font-bold mb-2">📚 {t('correctAnswer')}</div>
            <div className="text-3xl font-bold">{answer}</div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        {isSubmitted && (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold"
            >
{showAnswer ? t('hideAnswer') : t('showAnswer')}
            </button>
            
            <button
              onClick={reset}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold"
            >
{t('tryAgain')}
            </button>
          </div>
        )}

        {/* SKIP BUTTON */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onSkip}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium"
          >
⏭️ {t('skip')}
          </button>
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            ← {t('previous')}
          </button>

          <div className="text-center">
            <div className="text-sm font-medium text-gray-600">
              {questionNumber || 1} / {totalQuestions || 1}
            </div>
          </div>

          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="px-4 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t('next')} →
          </button>
        </div>
      </div>
    </div>
  );
}
