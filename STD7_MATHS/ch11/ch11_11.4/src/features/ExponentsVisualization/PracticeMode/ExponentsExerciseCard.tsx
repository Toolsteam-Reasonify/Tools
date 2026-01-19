import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

type Props = {
  prompt: string;
  answer: string;
  options: string[];
  explanation: string;
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

export default function ExponentsExerciseCard({ 
  prompt, 
  answer, 
  options,
  explanation,
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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Reset state when question changes
  useEffect(() => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    setSelectedOption(null);
    setFeedback(null);
    setIsSubmitted(false);
    setShowSolution(false);
  }, [prompt]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, [autoAdvanceTimer]);

  function check(option?: string) {
    const optionToCheck = option || selectedOption;
    if (!optionToCheck) return;
    
    // Clear any existing timer
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    
    setSelectedOption(optionToCheck);
    setIsSubmitted(true);
    
    const ok = optionToCheck === answer;
    
    setFeedback(ok ? 'correct' : 'incorrect');
    onResult?.(ok);
    
    // Auto-advance to next question after 4 seconds (only if there's a next question)
    if (canGoNext && onNext) {
      const timer = setTimeout(() => {
        onNext();
      }, 4000);
      setAutoAdvanceTimer(timer);
    }
  }


  return (
    <div className="practice-card bg-gradient-to-br from-slate-800 to-purple-900 rounded-2xl shadow-2xl overflow-hidden max-w-5xl mx-auto border-2 border-purple-500/30 animate-fadeIn">
      {/* TOP NAVIGATION - ALWAYS VISIBLE */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all ${
              !canGoPrevious
                ? 'bg-white/20 text-white/50 cursor-not-allowed'
                : 'bg-white/30 hover:bg-white/40 transform hover:scale-105'
            }`}
          >
            ← <span className="hidden sm:inline">{t('practice_previous')}</span>
          </button>

          <div className="text-center">
            <div className="text-base sm:text-xl font-bold">
              {t('practice_question')} {questionNumber || 1} / {totalQuestions || 1}
            </div>
          </div>

          <button
            onClick={onNext}
            disabled={!canGoNext}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all ${
              !canGoNext
                ? 'bg-white/20 text-white/50 cursor-not-allowed'
                : 'bg-white/30 hover:bg-white/40 transform hover:scale-105'
            }`}
          >
            <span className="hidden sm:inline">{t('practice_next')}</span> →
          </button>
        </div>
      </div>

      {/* QUESTION CONTENT */}
      <div className="p-8 space-y-6 bg-gradient-to-br from-slate-900/50 to-purple-900/50">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-semibold text-purple-200 mb-4 px-4 break-words">
            {prompt}
          </div>
        </div>

        <div className="space-y-3">
          {options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === answer;
            const showResult = isSubmitted && (isSelected || isCorrect);

            return (
              <button
                key={idx}
                onClick={() => !isSubmitted && check(option)}
                disabled={isSubmitted}
                className={`w-full p-6 rounded-xl font-bold text-lg sm:text-xl transition-all animate-slideIn shadow-lg ${
                  !isSubmitted
                    ? 'bg-slate-700/50 hover:bg-purple-700/50 text-white border-2 border-purple-500/30 hover:border-purple-400 cursor-pointer'
                    : isSelected && isCorrect
                    ? 'bg-green-600/20 border-2 border-green-400 text-green-300'
                    : isSelected && !isCorrect
                    ? 'bg-red-600/20 border-2 border-red-400 text-red-300'
                    : isCorrect
                    ? 'bg-green-600/10 border-2 border-green-500/50 text-green-300'
                    : 'bg-slate-700/30 border-2 border-slate-600 text-gray-400'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base sm:text-lg break-all text-left flex-1">{option}</span>
                  {showResult && (
                    isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    ) : isSelected ? (
                      <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                    ) : null
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* FEEDBACK */}
        {feedback && (
          <div className={`text-center py-4 px-6 rounded-xl border-2 shadow-lg animate-bounce ${
            feedback === 'correct' 
              ? 'bg-green-600/20 text-green-300 border-green-400 backdrop-blur-lg' 
              : 'bg-red-600/20 text-red-300 border-red-400 backdrop-blur-lg'
          }`}>
            <div className="text-3xl mb-2">
              {feedback === 'correct' ? '✅' : '❌'}
            </div>
            <div className="text-xl font-bold">
              {feedback === 'correct' ? t('practice_correct') : t('practice_incorrect')}
            </div>
          </div>
        )}

        {/* SIMPLE NAVIGATION AFTER ANSWER */}
        {isSubmitted && (
          <div className="bg-slate-700/30 backdrop-blur-lg border border-purple-500/30 rounded-lg p-4 animate-fadeIn">
            <div className="flex justify-center gap-4">
              <button
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                ← {t('practice_previous')}
              </button>
              
              <button
                onClick={onNext}
                disabled={!canGoNext}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {t('practice_next')} →
              </button>
            </div>
          </div>
        )}

        {/* SHOW SOLUTION */}
        {isSubmitted && (
          <div className="flex justify-center">
            <button
              onClick={() => {
                const newShowSolution = !showSolution;
                setShowSolution(newShowSolution);
                // If showing solution, cancel auto-advance timer
                if (newShowSolution && autoAdvanceTimer) {
                  clearTimeout(autoAdvanceTimer);
                  setAutoAdvanceTimer(null);
                }
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-bold transition-all transform hover:scale-105 shadow-lg"
            >
              {showSolution ? `👁️ ${t('practice_hide_solution')}` : `👀 ${t('practice_show_solution')}`}
            </button>
          </div>
        )}

        {showSolution && (
          <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-lg text-cyan-300 p-6 rounded-xl animate-slideIn border border-cyan-400/30">
            <div className="text-lg font-bold mb-2">📚 {t('practice_solution')}</div>
            <div className="text-base">{explanation}</div>
          </div>
        )}

        {/* SKIP BUTTON */}
        {!isSubmitted && (
          <div className="flex justify-center">
            <button
              onClick={onSkip}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:from-yellow-600 hover:to-orange-700 font-medium transition-all transform hover:scale-105 shadow-lg"
            >
              ⏭️ {t('practice_skip')}
            </button>
          </div>
        )}

      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="border-t border-purple-500/30 p-4 bg-slate-800/30 backdrop-blur-lg">
        <div className="flex justify-between items-center">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            ← {t('practice_previous')}
          </button>

          <div className="text-center">
            <div className="text-sm font-medium text-purple-300">
              {questionNumber || 1} / {totalQuestions || 1}
            </div>
          </div>

          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {t('practice_next')} →
          </button>
        </div>
      </div>
    </div>
  );
}
