import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, RotateCcw, ChevronRight,
  Award
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Question {
  id: number;
  type: 'mcq' | 'true-false' | 'match' | 'sequence';
  question: string;
  options?: string[];
  pairs?: { left: string[]; right: string[] };
  sequence?: string[];
  correctAnswer: string | string[] | Record<string, string>;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface PracticeModeProps {
  language?: string;
}

const ConvectionPracticeMode: React.FC<PracticeModeProps> = () => {
  const { t, language } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | Record<string, string>>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [matchPairs, setMatchPairs] = useState<Record<string, string>>({});
  const [sequenceOrder, setSequenceOrder] = useState<string[]>([]);

  // Load questions from translations
  const getQuestions = (): Question[] => {
    const translationQuestions = t('convection.practice.questions', { returnObjects: true }) as unknown;
    if (!Array.isArray(translationQuestions)) return [];
    return translationQuestions.map((q: any) => ({
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options,
      pairs: q.pairs,
      sequence: q.sequence,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      points: q.points
    }));
  };

  const [questions, setQuestions] = useState<Question[]>(getQuestions());

  // Update questions when language changes
  useEffect(() => {
    setQuestions(getQuestions());
  }, [language]);

  const questionsList: Question[] = questions;

  const currentQuestion = questionsList[currentQuestionIndex];
  const totalPoints = questionsList.reduce((sum, q) => sum + q.points, 0);

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleMatchPair = (left: string, right: string) => {
    setMatchPairs(prev => ({
      ...prev,
      [left]: right
    }));
  };

  const handleSequenceMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newOrder = [...sequenceOrder];
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      setSequenceOrder(newOrder);
    } else if (direction === 'down' && index < sequenceOrder.length - 1) {
      const newOrder = [...sequenceOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setSequenceOrder(newOrder);
    }
  };

  React.useEffect(() => {
    if (currentQuestion.type === 'sequence' && sequenceOrder.length === 0) {
      setSequenceOrder([...(currentQuestion.sequence || [])].sort(() => Math.random() - 0.5));
    }
  }, [currentQuestionIndex]);

  const handleSubmit = () => {
    let isCorrect = false;

    if (currentQuestion.type === 'match') {
      const correctPairs = currentQuestion.correctAnswer as Record<string, string>;
      isCorrect = Object.keys(correctPairs).every(key => matchPairs[key] === correctPairs[key]);
    } else if (currentQuestion.type === 'sequence') {
      isCorrect = JSON.stringify(sequenceOrder) === JSON.stringify(currentQuestion.correctAnswer);
    } else {
      isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    }

    if (isCorrect && !answeredQuestions.includes(currentQuestion.id)) {
      setScore(score + currentQuestion.points);
    }

    if (!answeredQuestions.includes(currentQuestion.id)) {
      setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
    }

    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionsList.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setMatchPairs({});
      setSequenceOrder([]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setMatchPairs({});
      setSequenceOrder([]);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions([]);
    setMatchPairs({});
    setSequenceOrder([]);
  };

  const isCorrect = () => {
    if (currentQuestion.type === 'match') {
      const correctPairs = currentQuestion.correctAnswer as Record<string, string>;
      return Object.keys(correctPairs).every(key => matchPairs[key] === correctPairs[key]);
    } else if (currentQuestion.type === 'sequence') {
      return JSON.stringify(sequenceOrder) === JSON.stringify(currentQuestion.correctAnswer);
    }
    return selectedAnswer === currentQuestion.correctAnswer;
  };

  const canSubmit = () => {
    if (currentQuestion.type === 'match') {
      return Object.keys(matchPairs).length === currentQuestion.pairs?.left.length;
    } else if (currentQuestion.type === 'sequence') {
      return sequenceOrder.length > 0;
    }
    return selectedAnswer !== '';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    return t(`convection.practice.ui.difficulty.${difficulty}` as any);
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'mcq':
      case 'true-false':
        return (
          <div className="space-y-2 sm:space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl text-left transition-all border-2 ${
                  selectedAnswer === option
                    ? showFeedback
                      ? isCorrect()
                        ? 'bg-green-50 border-green-500 text-green-900'
                        : 'bg-red-50 border-red-500 text-red-900'
                      : 'bg-cyan-50 border-cyan-500 text-cyan-900'
                    : 'bg-white border-gray-200 hover:border-cyan-300 hover:bg-cyan-50'
                } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm sm:text-base flex-1">{option}</span>
                  {showFeedback && selectedAnswer === option && (
                    isCorrect() ? (
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0" />
                    )
                  )}
                  {showFeedback && option === currentQuestion.correctAnswer && selectedAnswer !== option && (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'match':
        const leftItems = currentQuestion.pairs?.left || [];
        const rightItems = currentQuestion.pairs?.right || [];

        return (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-4">{t('convection.practice.ui.matchHint')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <h4 className="font-bold text-sm sm:text-base text-gray-700 mb-3">{t('convection.practice.ui.processes')}</h4>
                {leftItems.map((item) => (
                  <div key={item} className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <div className="font-medium text-gray-800 mb-2">{item}</div>
                    <select
                      value={matchPairs[item] || ''}
                      onChange={(e) => handleMatchPair(item, e.target.value)}
                      disabled={showFeedback}
                      className="w-full p-2 sm:p-3 rounded border border-gray-300 text-xs sm:text-sm"
                    >
                      <option value="">{t('convection.practice.ui.select')}</option>
                      {rightItems.map(right => (
                        <option key={right} value={right}>{right}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-sm sm:text-base text-gray-700 mb-3">{t('convection.practice.ui.characteristics')}</h4>
                {rightItems.map((item) => (
                  <div key={item} className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <div className="font-medium text-green-800">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'sequence':
        return (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-4">{t('convection.practice.ui.sequenceHint')}</p>
            <div className="space-y-2">
              {sequenceOrder.map((item, index) => (
                <div key={index} className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-gray-200 flex items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <span className="bg-cyan-100 text-cyan-800 font-bold px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-800 text-sm sm:text-base truncate">{item}</span>
                  </div>
                  {!showFeedback && (
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleSequenceMove(index, 'up')}
                        disabled={index === 0}
                        className={`p-1.5 sm:p-2 rounded-lg text-xs sm:text-sm ${
                          index === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200'
                        }`}
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleSequenceMove(index, 'down')}
                        disabled={index === sequenceOrder.length - 1}
                        className={`p-1.5 sm:p-2 rounded-lg text-xs sm:text-sm ${
                          index === sequenceOrder.length - 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200'
                        }`}
                      >
                        ▼
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isLastQuestion = currentQuestionIndex === questionsList.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-3 sm:p-4 md:p-6"
         style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div className="max-w-5xl mx-auto">

        {/* Question Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100 mb-4 sm:mb-6">
          <div className="p-4 sm:p-6 md:p-8">
            {/* Question Header */}
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="bg-cyan-100 text-cyan-800 font-bold px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
                    {t('convection.practice.ui.questionLabel', { current: currentQuestionIndex + 1, total: questionsList.length })}
                  </span>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(currentQuestion.difficulty)}`}>
                    {getDifficultyLabel(currentQuestion.difficulty)}
                  </span>
                  <span className="bg-teal-100 text-teal-800 px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                    {t('convection.practice.ui.pointsLabel', { points: currentQuestion.points })}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
                  {currentQuestion.question}
                </h2>
              </div>
            </div>

            {/* Question Content */}
            {renderQuestion()}

            {/* Feedback */}
            {showFeedback && (
              <div className={`mt-4 sm:mt-6 p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 ${
                isCorrect()
                  ? 'bg-green-50 border-green-400'
                  : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex items-start gap-2 sm:gap-3">
                  {isCorrect() ? (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base sm:text-lg mb-2">
                      {isCorrect() ? t('convection.practice.ui.correctTitle') : t('convection.practice.ui.incorrectTitle')}
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold flex items-center justify-center gap-2 ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span className="hidden sm:inline">{t('convection.practice.ui.previousButton')}</span>
                <span className="sm:hidden">{t('convection.practice.ui.previousButtonShort')}</span>
              </button>

              <div className="flex gap-2 sm:gap-3">
                {!showFeedback ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit()}
                    className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                      canSubmit()
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">{t('convection.practice.ui.submitButton')}</span>
                    <span className="sm:hidden">{t('convection.practice.ui.submitButtonShort')}</span>
                  </button>
                ) : (
                  <>
                    {!isLastQuestion ? (
                      <button
                        onClick={handleNext}
                        className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                      >
                        <span className="hidden sm:inline">{t('convection.practice.ui.nextButton')}</span>
                        <span className="sm:hidden">{t('convection.practice.ui.nextButtonShort')}</span>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={handleRestart}
                        className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                      >
                        <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">{t('convection.practice.ui.tryAgainButton')}</span>
                        <span className="sm:hidden">{t('convection.practice.ui.tryAgainButtonShort')}</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        {isLastQuestion && showFeedback && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 border-2 border-yellow-300">
            <div className="text-center">
              <Award className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-600 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">{t('convection.practice.ui.completeTitle')}</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-4 sm:mb-6">
                {t('convection.practice.ui.scoreSummary', { score, total: totalPoints })}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">{answeredQuestions.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{t('convection.practice.ui.questionsAnswered')}</div>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">{Math.round((score / totalPoints) * 100)}%</div>
                  <div className="text-xs sm:text-sm text-gray-600">{t('convection.practice.ui.scorePercentage')}</div>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                    {score >= totalPoints * 0.8 ? 'A' : score >= totalPoints * 0.6 ? 'B' : 'C'}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">{t('convection.practice.ui.gradeLabel')}</div>
                </div>
              </div>

              <button
                onClick={handleRestart}
                className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 flex items-center justify-center gap-2 mx-auto text-sm sm:text-base md:text-lg"
              >
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                {t('convection.practice.ui.startOverButton')}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ConvectionPracticeMode;