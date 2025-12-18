import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle, RotateCcw, ChevronRight, Lightbulb, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import i18n from '@/i18n';

interface Question {
  id: number;
  type: 'mcq' | 'true-false' | 'fill-blank' | 'match' | 'ordering' | 'classify';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

const TopicPracticeMode: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [matchPairs, setMatchPairs] = useState<Record<string, string>>({});
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const [classifications, setClassifications] = useState<Record<string, string>>({});

  const questions: Question[] = useMemo(() => {
    const questionsData = t('conduction.practice.questions', { returnObjects: true });
    // If current language has no questions, fallback to English
    if (!Array.isArray(questionsData) || questionsData.length === 0) {
      // Get English questions as fallback using i18n.t() with language override
      const enData = i18n.t('conduction.practice.questions', { returnObjects: true, lng: 'en' });
      return (Array.isArray(enData) ? enData : []) as Question[];
    }
    return questionsData as Question[];
  }, [t, language]);

  // Reset question state when language changes
  React.useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions([]);
    setMatchPairs({});
    setOrderedItems([]);
    setClassifications({});
  }, [language]);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('conduction.practice.ui.noQuestionsTitle')}</h2>
          <p className="text-gray-600">{t('conduction.practice.ui.noQuestionsBody')}</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    
    if (currentQuestion.type === 'match') {
      // Handle matching logic separately
      return;
    } else if (currentQuestion.type === 'ordering') {
      // Handle ordering logic separately
      return;
    } else if (currentQuestion.type === 'classify') {
      // Handle classification separately
      return;
    } else {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer && currentQuestion.type !== 'match' && currentQuestion.type !== 'ordering' && currentQuestion.type !== 'classify') return;

    let isCorrect = false;

    if (currentQuestion.type === 'match') {
      const correctPairs = currentQuestion.correctAnswer as string[];
      const userPairs = Object.entries(matchPairs).map(([k, v]) => `${k}|${v}`);
      isCorrect = correctPairs.length === userPairs.length && 
                  correctPairs.every(pair => userPairs.includes(pair));
    } else if (currentQuestion.type === 'ordering') {
      const correctOrder = currentQuestion.correctAnswer as string[];
      isCorrect = JSON.stringify(orderedItems) === JSON.stringify(correctOrder);
    } else if (currentQuestion.type === 'classify') {
      const correctClassifications = currentQuestion.correctAnswer as string[];
      const userClassifications = Object.entries(classifications).map(([k, v]) => `${k}|${v}`);
      isCorrect = correctClassifications.length === userClassifications.length &&
                  correctClassifications.every(pair => userClassifications.includes(pair));
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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setMatchPairs({});
      setOrderedItems([]);
      setClassifications({});
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setMatchPairs({});
      setOrderedItems([]);
      setClassifications({});
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions([]);
    setMatchPairs({});
    setOrderedItems([]);
    setClassifications({});
  };

  const isCorrect = () => {
    if (currentQuestion.type === 'match') {
      const correctPairs = currentQuestion.correctAnswer as string[];
      const userPairs = Object.entries(matchPairs).map(([k, v]) => `${k}|${v}`);
      return correctPairs.length === userPairs.length && 
             correctPairs.every(pair => userPairs.includes(pair));
    } else if (currentQuestion.type === 'ordering') {
      const correctOrder = currentQuestion.correctAnswer as string[];
      return JSON.stringify(orderedItems) === JSON.stringify(correctOrder);
    } else if (currentQuestion.type === 'classify') {
      const correctClassifications = currentQuestion.correctAnswer as string[];
      const userClassifications = Object.entries(classifications).map(([k, v]) => `${k}|${v}`);
      return correctClassifications.length === userClassifications.length &&
             correctClassifications.every(pair => userClassifications.includes(pair));
    }
    return selectedAnswer === currentQuestion.correctAnswer;
  };

  // Matching question logic
  const handleMatchPair = (item: string, category: string) => {
    setMatchPairs(prev => ({
      ...prev,
      [item]: category
    }));
  };

  // Ordering question logic
  const initializeOrdering = () => {
    if (currentQuestion.type === 'ordering' && orderedItems.length === 0) {
      setOrderedItems([...(currentQuestion.options || [])]);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...orderedItems];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setOrderedItems(newOrder);
  };

  // Classification logic
  const handleClassification = (item: string, category: string) => {
    setClassifications(prev => ({
      ...prev,
      [item]: category
    }));
  };

  React.useEffect(() => {
    if (currentQuestion.type === 'ordering') {
      initializeOrdering();
    }
  }, [currentQuestionIndex]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'mcq':
      case 'true-false':
      case 'fill-blank':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                  selectedAnswer === option
                    ? showFeedback
                      ? isCorrect()
                        ? 'bg-green-50 border-green-500 text-green-900'
                        : 'bg-red-50 border-red-500 text-red-900'
                      : 'bg-indigo-50 border-indigo-500 text-indigo-900'
                    : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showFeedback && selectedAnswer === option && (
                    isCorrect() ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )
                  )}
                  {showFeedback && option === currentQuestion.correctAnswer && selectedAnswer !== option && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'match':
        const matchItems = currentQuestion.options?.map(opt => opt.split('|')[0]) || [];
        const matchCategories = [...new Set(currentQuestion.options?.map(opt => opt.split('|')[1]) || [])];
        
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">{t('conduction.practice.ui.matchHint')}</p>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Items */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-700 mb-3">{t('conduction.practice.ui.materials')}</h4>
                {matchItems.map((item) => (
                  <div key={item} className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
                    <div className="font-medium text-gray-800 mb-2">{item}</div>
                    <select
                      value={matchPairs[item] || ''}
                      onChange={(e) => handleMatchPair(item, e.target.value)}
                      disabled={showFeedback}
                      className="w-full p-2 rounded border border-gray-300 text-sm"
                    >
                      <option value="">{t('conduction.practice.ui.selectCategory')}</option>
                      {matchCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-700 mb-3">{t('conduction.practice.ui.categories')}</h4>
                {matchCategories.map((category) => {
                  const matchedItems = Object.entries(matchPairs)
                    .filter(([_, cat]) => cat === category)
                    .map(([item]) => item);
                  
                  return (
                    <div key={category} className="bg-green-50 p-3 rounded-lg border-2 border-green-200 min-h-[60px]">
                      <div className="font-bold text-green-800 mb-2">{category}</div>
                      {matchedItems.length > 0 ? (
                        <div className="space-y-1">
                          {matchedItems.map(item => (
                            <div key={item} className="text-sm bg-white px-2 py-1 rounded">
                              {item}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 italic">{t('conduction.practice.ui.noItemsMatched')}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'ordering':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">{t('conduction.practice.ui.orderingHint')}</p>
            <div className="space-y-2">
              {orderedItems.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border-2 border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full text-sm">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-800">{item}</span>
                  </div>
                  {!showFeedback && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        className={`p-2 rounded-lg ${
                          index === 0 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                        }`}
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === orderedItems.length - 1}
                        className={`p-2 rounded-lg ${
                          index === orderedItems.length - 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
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

      case 'classify':
        const classifyItems = currentQuestion.options || [];
        const categories = [t('conduction.practice.ui.goodConductor'), t('conduction.practice.ui.poorConductor')];
        
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">{t('conduction.practice.ui.classifyHint')}</p>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Items to classify */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-700 mb-3">{t('conduction.practice.ui.materials')}</h4>
                {classifyItems.map((item) => (
                  <div key={item} className="bg-purple-50 p-3 rounded-lg border-2 border-purple-200">
                    <div className="font-medium text-gray-800 mb-2">{item}</div>
                    <select
                      value={classifications[item] || ''}
                      onChange={(e) => handleClassification(item, e.target.value)}
                      disabled={showFeedback}
                      className="w-full p-2 rounded border border-gray-300 text-sm"
                    >
                      <option value="">{t('conduction.practice.ui.selectCategory')}</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Classification categories */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-700 mb-3">{t('conduction.practice.ui.categories')}</h4>
                {categories.map((category) => {
                  const classifiedItems = Object.entries(classifications)
                    .filter(([_, cat]) => cat === category)
                    .map(([item]) => item);
                  const isGoodConductor = category === t('conduction.practice.ui.goodConductor');
                  
                  return (
                    <div key={category} className={`p-4 rounded-lg border-2 min-h-[120px] ${
                      isGoodConductor
                        ? 'bg-green-50 border-green-300' 
                        : 'bg-red-50 border-red-300'
                    }`}>
                      <div className={`font-bold mb-2 ${
                        isGoodConductor ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {isGoodConductor ? t('conduction.practice.ui.goodConductorLabel') : t('conduction.practice.ui.poorConductorLabel')}
                      </div>
                      {classifiedItems.length > 0 ? (
                        <div className="space-y-1">
                          {classifiedItems.map(item => (
                            <div key={item} className="text-sm bg-white px-3 py-1 rounded">
                              {item}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 italic">{t('conduction.practice.ui.noItemsClassified')}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canSubmit = () => {
    if (currentQuestion.type === 'match') {
      return Object.keys(matchPairs).length === (currentQuestion.options?.length || 0);
    } else if (currentQuestion.type === 'ordering') {
      return orderedItems.length > 0;
    } else if (currentQuestion.type === 'classify') {
      return Object.keys(classifications).length === (currentQuestion.options?.length || 0);
    }
    return selectedAnswer !== '';
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6"
         style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div className="max-w-5xl mx-auto">
        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-6">
          <div className="p-8">
            {/* Question Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-indigo-100 text-indigo-800 font-bold px-4 py-2 rounded-full">
                    {t('conduction.practice.ui.questionLabel', { current: currentQuestionIndex + 1, total: questions.length })}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(currentQuestion.difficulty)}`}>
                    {t(`conduction.practice.ui.difficulty.${currentQuestion.difficulty}`)}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
                    {t('conduction.practice.ui.pointsLabel', { points: currentQuestion.points })}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentQuestion.question}
                </h2>
                {currentQuestion.type === 'fill-blank' && (
                  <p className="text-sm text-gray-500 italic">{t('conduction.practice.ui.fillBlankHint')}</p>
                )}
              </div>
            </div>

            {/* Question Content */}
            {renderQuestion()}

            {/* Feedback */}
            {showFeedback && (
              <div className={`mt-6 p-6 rounded-xl border-2 ${
                isCorrect() 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex items-start gap-3">
                  {isCorrect() ? (
                    <CheckCircle className="w-7 h-7 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-7 h-7 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-2">
                      {isCorrect() ? t('conduction.practice.ui.correctTitle') : t('conduction.practice.ui.incorrectTitle')}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                    {!isCorrect() && (
                      <div className="mt-3 p-3 bg-white rounded-lg">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          <Lightbulb className="w-4 h-4 inline mr-1" />
                          {t('conduction.practice.ui.correctAnswerLabel')}
                        </p>
                        <p className="text-sm text-green-700 font-semibold">
                          {Array.isArray(currentQuestion.correctAnswer) 
                            ? currentQuestion.correctAnswer.join(', ')
                            : currentQuestion.correctAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t('conduction.practice.ui.previousButton')}
              </button>

              <div className="flex gap-3">
                {!showFeedback ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit()}
                    className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 ${
                      canSubmit()
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    {t('conduction.practice.ui.submitButton')}
                  </button>
                ) : (
                  <>
                    {!isLastQuestion ? (
                      <button
                        onClick={handleNext}
                        className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 flex items-center gap-2"
                      >
                        {t('conduction.practice.ui.nextButton')}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={handleRestart}
                        className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 flex items-center gap-2"
                      >
                        <RotateCcw className="w-5 h-5" />
                        {t('conduction.practice.ui.tryAgainButton')}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card (shown after all questions) */}
        {isLastQuestion && showFeedback && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-xl p-8 border-2 border-yellow-300">
            <div className="text-center">
              <Award className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('conduction.practice.ui.completeTitle')}</h2>
              <p className="text-xl text-gray-700 mb-6">
                {t('conduction.practice.ui.scoreSummary', { score, total: totalPoints })}
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">{answeredQuestions.length}</div>
                  <div className="text-sm text-gray-600">{t('conduction.practice.ui.questionsAnswered')}</div>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">{Math.round((score / totalPoints) * 100)}%</div>
                  <div className="text-sm text-gray-600">{t('conduction.practice.ui.scorePercentage')}</div>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600">
                    {score >= totalPoints * 0.8 ? 'A' : score >= totalPoints * 0.6 ? 'B' : 'C'}
                  </div>
                  <div className="text-sm text-gray-600">{t('conduction.practice.ui.gradeLabel')}</div>
                </div>
              </div>

              <button
                onClick={handleRestart}
                className="px-10 py-4 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2 mx-auto text-lg"
              >
                <RotateCcw className="w-6 h-6" />
                {t('conduction.practice.ui.startOverButton')}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TopicPracticeMode;