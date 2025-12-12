import React, { useState } from 'react';
import { CheckCircle, XCircle, Award, RotateCcw, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const TorchlightPractice: React.FC = () => {
  const { t } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions: Question[] = [
    {
      id: 1,
      question: t('practice.ex6.q1'),
      options: [
        t('practice.ex6.q1o1'),
        t('practice.ex6.q1o2'),
        t('practice.ex6.q1o3'),
        t('practice.ex6.q1o4'),
      ],
      correctAnswer: t('practice.ex6.q1o2'),
    },
    {
      id: 2,
      question: t('practice.ex6.q2'),
      options: [
        t('practice.ex6.q2o1'),
        t('practice.ex6.q2o2'),
        t('practice.ex6.q2o3'),
        t('practice.ex6.q2o4'),
      ],
      correctAnswer: t('practice.ex6.q2o2'),
    },
    {
      id: 3,
      question: t('practice.ex6.q3'),
      options: [
        t('practice.ex6.q3o1'),
        t('practice.ex6.q3o2'),
        t('practice.ex6.q3o3'),
        t('practice.ex6.q3o4'),
      ],
      correctAnswer: t('practice.ex6.q3o2'),
    },
    {
      id: 4,
      question: t('practice.ex6.q4'),
      options: [
        t('practice.ex6.q4o1'),
        t('practice.ex6.q4o2'),
        t('practice.ex6.q4o3'),
        t('practice.ex6.q4o4'),
      ],
      correctAnswer: t('practice.ex6.q4o3'),
    },
    {
      id: 5,
      question: t('practice.ex6.q5'),
      options: [
        t('practice.ex6.q5o1'),
        t('practice.ex6.q5o2'),
        t('practice.ex6.q5o3'),
        t('practice.ex6.q5o4'),
      ],
      correctAnswer: t('practice.ex6.q5o3'),
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (option: string) => {
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    // Save the answer
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedAnswer }));

    // Move to next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[questions[currentQuestionIndex + 1]?.id] || '');
    } else {
      // Calculate score
      let correctCount = 0;
      questions.forEach((q) => {
        if (answers[q.id] === q.correctAnswer || (q.id === currentQuestion.id && selectedAnswer === q.correctAnswer)) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[questions[currentQuestionIndex - 1]?.id] || '');
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const getAnswerStatus = (questionId: number, option: string) => {
    if (!showResults) return null;

    const question = questions.find((q) => q.id === questionId);
    const userAnswer = answers[questionId];

    if (option === question?.correctAnswer) {
      return 'correct';
    }
    if (option === userAnswer && option !== question?.correctAnswer) {
      return 'incorrect';
    }
    return null;
  };

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="text-center mb-8">
              <Award className="w-24 h-24 mx-auto text-yellow-500 mb-4" />
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('practice.summary.title')}</h1>
              <p className="text-xl text-gray-600">
                {percentage >= 80 ? t('practice.summary.excellent') : percentage >= 60 ? t('practice.summary.good') : t('practice.summary.keepPracticing')}
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
              <div className="text-center">
                <p className="text-lg text-gray-700 mb-2">{t('practice.summary.totalScore')}</p>
                <p className="text-5xl font-bold text-blue-600" aria-label={t('practice.summary.totalScore')}>
                  {score}/{questions.length}
                </p>
                <p className="text-2xl text-gray-600 mt-2">
                  {t('practice.summary.scoreLine', { correct: score, total: questions.length, percentage })}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {t('practice.summary.exerciseCount', { count: questions.length })}
                </p>
              </div>
            </div>

            {/* Review Answers */}
            <div className="space-y-4 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('common.examples')}:</h2>
              {questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 ${isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-2">
                          {t('practice.ex6.question')} {index + 1}: {question.question}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">{t('common.yourAnswer')} </span>
                          <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                            {userAnswer || t('practice.ex1.notLabeled')}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-semibold">{t('common.correct')}: </span>
                            <span className="text-green-700">{question.correctAnswer}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleRestart}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105"
              >
                <RotateCcw className="w-6 h-6" />
                {t('practice.summary.restart')}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-teal-600 transition-all transform hover:scale-105"
              >
                <Home className="w-6 h-6" />
                {t('practice.summary.backToLearn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-blue-600">{t('practice.header.title')}</h1>
              <div className="bg-blue-100 px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-600">
                  {t('practice.ex6.question')} {currentQuestionIndex + 1} {t('practice.ex6.of')} {questions.length}
                </p>
              </div>
            </div>
            <p className="text-gray-600">{t('practice.header.subtitle')}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentQuestion.question}</h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const status = getAnswerStatus(currentQuestion.id, option);

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    disabled={showResults}
                    className={`w-full p-4 rounded-xl text-left transition-all transform hover:scale-102 ${isSelected
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-102'
                        : status === 'correct'
                          ? 'bg-green-100 border-2 border-green-500'
                          : status === 'incorrect'
                            ? 'bg-red-100 border-2 border-red-500'
                            : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isSelected
                            ? 'bg-white text-blue-600'
                            : status === 'correct'
                              ? 'bg-green-500 text-white'
                              : status === 'incorrect'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                          }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className={`flex-1 font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                        {option}
                      </span>
                      {status === 'correct' && <CheckCircle className="w-6 h-6 text-green-600" />}
                      {status === 'incorrect' && <XCircle className="w-6 h-6 text-red-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {t('common.previous')}
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {currentQuestionIndex === questions.length - 1 ? t('practice.ex6.checkQuiz') : t('common.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TorchlightPractice;
