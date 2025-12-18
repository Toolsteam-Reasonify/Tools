import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Circuit {
  id: string;
  svg: JSX.Element;
  isCorrect: boolean;
}

interface PracticeQuestion {
  id: string;
  question: string;
  type: 'diagram';
  circuits: Circuit[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

const TorchlightPractice: React.FC = () => {
  const { t } = useLanguage();
  const [practiceAnswers, setPracticeAnswers] = useState<{ [key: string]: string }>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState<{ [key: string]: boolean }>({});
  const [showHints, setShowHints] = useState<{ [key: string]: boolean }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const practiceQuestions: PracticeQuestion[] = [
    {
      id: 'p1',
      question: t('practice.questions.p1.question'),
      type: 'diagram',
      circuits: [
        {
          id: 'p1a',
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line x1="40" y1="75" x2="70" y2="75" stroke="black" strokeWidth="2" />
              <line x1="70" y1="60" x2="70" y2="90" stroke="black" strokeWidth="3" />
              <line x1="80" y1="65" x2="80" y2="85" stroke="black" strokeWidth="2" />
              <line x1="80" y1="75" x2="110" y2="75" stroke="black" strokeWidth="2" />
              <circle cx="140" cy="75" r="20" stroke="black" strokeWidth="2" fill="none" />
              <line x1="125" y1="60" x2="155" y2="90" stroke="black" strokeWidth="2" />
              <line x1="155" y1="60" x2="125" y2="90" stroke="black" strokeWidth="2" />
              <line x1="160" y1="75" x2="210" y2="75" stroke="black" strokeWidth="2" />
              <line x1="40" y1="75" x2="40" y2="110" stroke="black" strokeWidth="2" />
              <line x1="40" y1="110" x2="210" y2="110" stroke="black" strokeWidth="2" />
              <line x1="210" y1="110" x2="210" y2="75" stroke="black" strokeWidth="2" />
              <text x="65" y="50" fontSize="12" fill="blue">{t('practice.svg.positive')}</text>
              <text x="75" y="105" fontSize="12" fill="blue">{t('practice.svg.negative')}</text>
            </svg>
          ),
          isCorrect: true,
        },
        {
          id: 'p1b',
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line x1="40" y1="75" x2="70" y2="75" stroke="black" strokeWidth="2" />
              <line x1="70" y1="60" x2="70" y2="90" stroke="black" strokeWidth="3" />
              <line x1="80" y1="65" x2="80" y2="85" stroke="black" strokeWidth="2" />
              <line x1="80" y1="75" x2="110" y2="75" stroke="black" strokeWidth="2" />
              <path d="M 115 75 L 145 60 L 145 90 Z" stroke="black" strokeWidth="2" fill="none" />
              <line x1="145" y1="75" x2="155" y2="75" stroke="black" strokeWidth="2" />
              <line x1="155" y1="60" x2="155" y2="90" stroke="black" strokeWidth="2" />
              <path d="M 135 50 L 145 40 M 140 50 L 145 40 L 145 45" stroke="orange" strokeWidth="1.5" fill="none" />
              <line x1="155" y1="75" x2="210" y2="75" stroke="black" strokeWidth="2" />
              <line x1="40" y1="75" x2="40" y2="110" stroke="black" strokeWidth="2" />
              <line x1="40" y1="110" x2="210" y2="110" stroke="black" strokeWidth="2" />
              <line x1="210" y1="110" x2="210" y2="75" stroke="black" strokeWidth="2" />
            </svg>
          ),
          isCorrect: false,
        },
      ],
      correctAnswer: 'p1a',
      explanation: t('practice.questions.p1.explanation'),
      hint: t('practice.questions.p1.hint'),
    },
    {
      id: 'p2',
      question: t('practice.questions.p2.question'),
      type: 'diagram',
      circuits: [
        {
          id: 'p2a',
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line x1="30" y1="75" x2="50" y2="75" stroke="black" strokeWidth="2" />
              <line x1="50" y1="60" x2="50" y2="90" stroke="black" strokeWidth="3" />
              <line x1="60" y1="65" x2="60" y2="85" stroke="black" strokeWidth="2" />
              <line x1="70" y1="60" x2="70" y2="90" stroke="black" strokeWidth="3" />
              <line x1="80" y1="65" x2="80" y2="85" stroke="black" strokeWidth="2" />
              <line x1="80" y1="75" x2="110" y2="75" stroke="black" strokeWidth="2" />
              <path d="M 115 75 L 145 60 L 145 90 Z" stroke="black" strokeWidth="2" fill="none" />
              <line x1="145" y1="75" x2="155" y2="75" stroke="black" strokeWidth="2" />
              <line x1="155" y1="60" x2="155" y2="90" stroke="black" strokeWidth="2" />
              <path d="M 135 50 L 145 40 M 140 50 L 145 40 L 145 45" stroke="orange" strokeWidth="1.5" fill="none" />
              <path d="M 145 50 L 155 40 M 150 50 L 155 40 L 155 45" stroke="orange" strokeWidth="1.5" fill="none" />
              <line x1="155" y1="75" x2="220" y2="75" stroke="black" strokeWidth="2" />
              <line x1="30" y1="75" x2="30" y2="110" stroke="black" strokeWidth="2" />
              <line x1="30" y1="110" x2="220" y2="110" stroke="black" strokeWidth="2" />
              <line x1="220" y1="110" x2="220" y2="75" stroke="black" strokeWidth="2" />
              <text x="45" y="50" fontSize="12" fill="blue">{t('practice.svg.positive')}</text>
              <text x="120" y="95" fontSize="12" fill="green">{t('practice.svg.positive')}</text>
              <text x="150" y="95" fontSize="12" fill="red">{t('practice.svg.negative')}</text>
            </svg>
          ),
          isCorrect: true,
        },
        {
          id: 'p2b',
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line x1="30" y1="75" x2="50" y2="75" stroke="black" strokeWidth="2" />
              <line x1="50" y1="60" x2="50" y2="90" stroke="black" strokeWidth="3" />
              <line x1="60" y1="65" x2="60" y2="85" stroke="black" strokeWidth="2" />
              <line x1="60" y1="75" x2="110" y2="75" stroke="black" strokeWidth="2" />
              <path d="M 115 75 L 145 60 L 145 90 Z" stroke="black" strokeWidth="2" fill="none" />
              <line x1="145" y1="75" x2="155" y2="75" stroke="black" strokeWidth="2" />
              <line x1="155" y1="60" x2="155" y2="90" stroke="black" strokeWidth="2" />
              <path d="M 135 50 L 145 40 M 140 50 L 145 40 L 145 45" stroke="orange" strokeWidth="1.5" fill="none" />
              <line x1="155" y1="75" x2="220" y2="75" stroke="black" strokeWidth="2" />
              <line x1="30" y1="75" x2="30" y2="110" stroke="black" strokeWidth="2" />
              <line x1="30" y1="110" x2="220" y2="110" stroke="black" strokeWidth="2" />
              <line x1="220" y1="110" x2="220" y2="75" stroke="black" strokeWidth="2" />
            </svg>
          ),
          isCorrect: false,
        },
      ],
      correctAnswer: 'p2a',
      explanation: t('practice.questions.p2.explanation'),
      hint: t('practice.questions.p2.hint'),
    },
    {
      id: 'p3',
      question: t('practice.questions.p3.question'),
      type: 'diagram',
      circuits: [
        {
          id: 'p3a',
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line x1="40" y1="75" x2="70" y2="75" stroke="black" strokeWidth="2" />
              <line x1="70" y1="60" x2="70" y2="90" stroke="black" strokeWidth="3" />
              <line x1="80" y1="65" x2="80" y2="85" stroke="black" strokeWidth="2" />
              <line x1="80" y1="75" x2="100" y2="75" stroke="black" strokeWidth="2" />
              <circle cx="110" cy="75" r="3" fill="black" />
              <circle cx="140" cy="75" r="3" fill="black" />
              <line x1="110" y1="75" x2="135" y2="65" stroke="black" strokeWidth="2" />
              <line x1="140" y1="75" x2="160" y2="75" stroke="black" strokeWidth="2" />
              <circle cx="185" cy="75" r="20" stroke="black" strokeWidth="2" fill="none" />
              <line x1="170" y1="60" x2="200" y2="90" stroke="black" strokeWidth="2" />
              <line x1="200" y1="60" x2="170" y2="90" stroke="black" strokeWidth="2" />
              <line x1="205" y1="75" x2="210" y2="75" stroke="black" strokeWidth="2" />
              <line x1="40" y1="75" x2="40" y2="110" stroke="black" strokeWidth="2" />
              <line x1="40" y1="110" x2="210" y2="110" stroke="black" strokeWidth="2" />
              <line x1="210" y1="110" x2="210" y2="75" stroke="black" strokeWidth="2" />
              <text x="120" y="60" fontSize="11" fill="red">{t('practice.svg.switchOff')}</text>
            </svg>
          ),
          isCorrect: true,
        },
        {
          id: 'p3b',
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line x1="40" y1="75" x2="70" y2="75" stroke="black" strokeWidth="2" />
              <line x1="70" y1="60" x2="70" y2="90" stroke="black" strokeWidth="3" />
              <line x1="80" y1="65" x2="80" y2="85" stroke="black" strokeWidth="2" />
              <line x1="80" y1="75" x2="100" y2="75" stroke="black" strokeWidth="2" />
              <circle cx="110" cy="75" r="3" fill="black" />
              <circle cx="140" cy="75" r="3" fill="black" />
              <line x1="110" y1="75" x2="140" y2="75" stroke="black" strokeWidth="2" />
              <line x1="140" y1="75" x2="160" y2="75" stroke="black" strokeWidth="2" />
              <circle cx="185" cy="75" r="20" stroke="black" strokeWidth="2" fill="none" />
              <line x1="170" y1="60" x2="200" y2="90" stroke="black" strokeWidth="2" />
              <line x1="200" y1="60" x2="170" y2="90" stroke="black" strokeWidth="2" />
              <line x1="205" y1="75" x2="210" y2="75" stroke="black" strokeWidth="2" />
              <line x1="40" y1="75" x2="40" y2="110" stroke="black" strokeWidth="2" />
              <line x1="40" y1="110" x2="210" y2="110" stroke="black" strokeWidth="2" />
              <line x1="210" y1="110" x2="210" y2="75" stroke="black" strokeWidth="2" />
              <text x="120" y="60" fontSize="11" fill="green">{t('practice.svg.switchOn')}</text>
            </svg>
          ),
          isCorrect: false,
        },
      ],
      correctAnswer: 'p3a',
      explanation: t('practice.questions.p3.explanation'),
      hint: t('practice.questions.p3.hint'),
    },
    {
      id: 'p4',
      question: t('practice.questions.p4.question'),
      type: 'diagram',
      circuits: [
        {
          id: 'p4a',
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line x1="80" y1="75" x2="110" y2="75" stroke="black" strokeWidth="2" />
              <line x1="110" y1="55" x2="110" y2="95" stroke="black" strokeWidth="4" />
              <line x1="125" y1="60" x2="125" y2="90" stroke="black" strokeWidth="2" />
              <line x1="125" y1="75" x2="150" y2="75" stroke="black" strokeWidth="2" />
              <text x="103" y="45" fontSize="18" fontWeight="bold" fill="blue">{t('practice.svg.positive')}</text>
              <text x="118" y="120" fontSize="18" fontWeight="bold" fill="blue">{t('practice.svg.negative')}</text>
              <text x="60" y="65" fontSize="12" fill="gray">{t('practice.svg.longLine')}</text>
              <path d="M 90 60 L 110 55" stroke="gray" strokeWidth="1" markerEnd="url(#arrow-gray)" />
              <text x="130" y="65" fontSize="12" fill="gray">{t('practice.svg.shortLine')}</text>
              <path d="M 140 60 L 125 60" stroke="gray" strokeWidth="1" markerEnd="url(#arrow-gray)" />
              <defs>
                <marker id="arrow-gray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="gray" />
                </marker>
              </defs>
            </svg>
          ),
          isCorrect: true,
        },
        {
          id: 'p4b',
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line x1="80" y1="75" x2="110" y2="75" stroke="black" strokeWidth="2" />
              <line x1="110" y1="55" x2="110" y2="95" stroke="black" strokeWidth="4" />
              <line x1="125" y1="60" x2="125" y2="90" stroke="black" strokeWidth="2" />
              <line x1="125" y1="75" x2="150" y2="75" stroke="black" strokeWidth="2" />
              <text x="103" y="45" fontSize="18" fontWeight="bold" fill="blue">{t('practice.svg.negative')}</text>
              <text x="118" y="120" fontSize="18" fontWeight="bold" fill="blue">{t('practice.svg.positive')}</text>
              <text x="60" y="65" fontSize="12" fill="gray">{t('practice.svg.longLine')}</text>
              <path d="M 90 60 L 110 55" stroke="gray" strokeWidth="1" markerEnd="url(#arrow-gray2)" />
              <text x="130" y="65" fontSize="12" fill="gray">{t('practice.svg.shortLine')}</text>
              <path d="M 140 60 L 125 60" stroke="gray" strokeWidth="1" markerEnd="url(#arrow-gray2)" />
              <defs>
                <marker id="arrow-gray2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="gray" />
                </marker>
              </defs>
            </svg>
          ),
          isCorrect: false,
        },
      ],
      correctAnswer: 'p4a',
      explanation: t('practice.questions.p4.explanation'),
      hint: t('practice.questions.p4.hint'),
    },
    {
      id: 'p5',
      question: t('practice.questions.p5.question'),
      type: 'diagram',
      circuits: [
        {
          id: 'p5a',
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line x1="30" y1="75" x2="60" y2="75" stroke="black" strokeWidth="2" />
              <line x1="60" y1="60" x2="60" y2="90" stroke="black" strokeWidth="3" />
              <line x1="70" y1="65" x2="70" y2="85" stroke="black" strokeWidth="2" />
              <line x1="70" y1="75" x2="100" y2="75" stroke="black" strokeWidth="2" />
              <path d="M 105 75 L 135 60 L 135 90 Z" stroke="black" strokeWidth="2" fill="none" />
              <line x1="135" y1="75" x2="145" y2="75" stroke="black" strokeWidth="2" />
              <line x1="145" y1="60" x2="145" y2="90" stroke="black" strokeWidth="2" />
              <line x1="145" y1="75" x2="220" y2="75" stroke="black" strokeWidth="2" />
              <line x1="30" y1="75" x2="30" y2="110" stroke="black" strokeWidth="2" />
              <line x1="30" y1="110" x2="220" y2="110" stroke="black" strokeWidth="2" />
              <line x1="220" y1="110" x2="220" y2="75" stroke="black" strokeWidth="2" />
              <text x="110" y="100" fontSize="14" fontWeight="bold" fill="green">{t('practice.svg.positive')}</text>
              <text x="140" y="100" fontSize="14" fontWeight="bold" fill="red">{t('practice.svg.negative')}</text>
              <path d="M 70 50 L 120 50" stroke="red" strokeWidth="2" markerEnd="url(#arrowred)" />
              <defs>
                <marker id="arrowred" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="red" />
                </marker>
              </defs>
              <text x="70" y="45" fontSize="11" fontWeight="bold" fill="red">{t('practice.svg.currentFlow')}</text>
              <path d="M 125 50 L 135 40 M 130 50 L 135 40 L 135 45" stroke="orange" strokeWidth="1.5" fill="none" />
            </svg>
          ),
          isCorrect: true,
        },
        {
          id: 'p5b',
          svg: (
            <svg width="250" height="150" viewBox="0 0 250 150">
              <line x1="30" y1="75" x2="60" y2="75" stroke="black" strokeWidth="2" />
              <line x1="60" y1="60" x2="60" y2="90" stroke="black" strokeWidth="3" />
              <line x1="70" y1="65" x2="70" y2="85" stroke="black" strokeWidth="2" />
              <line x1="70" y1="75" x2="100" y2="75" stroke="black" strokeWidth="2" />
              <path d="M 145 75 L 115 60 L 115 90 Z" stroke="black" strokeWidth="2" fill="none" />
              <line x1="115" y1="75" x2="105" y2="75" stroke="black" strokeWidth="2" />
              <line x1="105" y1="60" x2="105" y2="90" stroke="black" strokeWidth="2" />
              <line x1="145" y1="75" x2="220" y2="75" stroke="black" strokeWidth="2" />
              <line x1="30" y1="75" x2="30" y2="110" stroke="black" strokeWidth="2" />
              <line x1="30" y1="110" x2="220" y2="110" stroke="black" strokeWidth="2" />
              <line x1="220" y1="110" x2="220" y2="75" stroke="black" strokeWidth="2" />
              <text x="100" y="100" fontSize="14" fontWeight="bold" fill="red">{t('practice.svg.negative')}</text>
              <text x="130" y="100" fontSize="14" fontWeight="bold" fill="green">{t('practice.svg.positive')}</text>
              <path d="M 115 50 L 125 40 M 120 50 L 125 40 L 125 45" stroke="orange" strokeWidth="1.5" fill="none" />
            </svg>
          ),
          isCorrect: false,
        },
      ],
      correctAnswer: 'p5a',
      explanation: t('practice.questions.p5.explanation'),
      hint: t('practice.questions.p5.hint'),
    },
  ];

  const handlePracticeSubmit = (questionId: string) => {
    setPracticeSubmitted({ ...practiceSubmitted, [questionId]: true });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < practiceQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetPractice = () => {
    setPracticeAnswers({});
    setPracticeSubmitted({});
    setShowHints({});
    setCurrentQuestion(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getScore = () => {
    let correct = 0;
    Object.keys(practiceAnswers).forEach((key) => {
      const questionToCheck = practiceQuestions.find((q) => q.id === key);
      if (questionToCheck && practiceAnswers[key] === questionToCheck.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: Object.keys(practiceSubmitted).length };
  };

  const isAllCompleted = Object.keys(practiceSubmitted).length === practiceQuestions.length;
  const { correct, total } = getScore();
  const percentage = isAllCompleted ? (correct / practiceQuestions.length) * 100 : 0;
  const question = practiceQuestions[currentQuestion];
  const isSubmitted = practiceSubmitted[question.id];
  const selectedAnswer = practiceAnswers[question.id];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-6 md:p-8">
          <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
            <span className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg">
              {currentQuestion + 1}
            </span>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-base sm:text-lg md:text-xl mb-1 sm:mb-2">{question.question}</p>
              <p className="text-xs sm:text-sm text-gray-600">{t('practice.ui.selectInstruction')}</p>
            </div>
          </div>

          {question.hint && !isSubmitted && (
            <div className="mb-6">
              <button
                onClick={() => setShowHints({ ...showHints, [question.id]: !showHints[question.id] })}
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-all"
              >
                <Lightbulb className="w-5 h-5" />
                {showHints[question.id] ? t('practice.ui.hideHint') : t('practice.ui.showHint')}
              </button>
              {showHints[question.id] && (
                <div className="mt-3 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                  <p className="text-sm text-gray-700">💡 {question.hint}</p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {question.circuits.map((circuit, cIndex) => {
              const isSelected = selectedAnswer === circuit.id;
              const showResult = isSubmitted && isSelected;

              return (
                <div
                  key={circuit.id}
                  onClick={() => !isSubmitted && setPracticeAnswers({ ...practiceAnswers, [question.id]: circuit.id })}
                  className={`relative rounded-lg sm:rounded-xl p-4 sm:p-6 cursor-pointer transition-all duration-300 ${showResult
                      ? isCorrect
                        ? 'border-2 border-green-500 bg-green-50 shadow-xl sm:scale-105'
                        : 'border-2 border-red-500 bg-red-50 shadow-xl'
                      : isSelected
                        ? 'border-2 border-blue-500 bg-blue-50 shadow-lg'
                        : 'border border-gray-300 hover:border-gray-400 hover:shadow-md'
                    } ${isSubmitted ? 'cursor-not-allowed' : ''}`}
                >
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center font-bold text-gray-700 text-base sm:text-lg shadow-md">
                    {String.fromCharCode(65 + cIndex)}
                  </div>

                  {showResult && (
                    <div
                      className={`absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white font-bold text-xs sm:text-sm shadow-lg ${isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    >
                      {isCorrect ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">{t('practice.ui.correct')}</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">{t('practice.ui.wrong')}</span>
                        </span>
                      )}
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:p-8 mt-10 sm:mt-12 mb-3 sm:mb-4 flex items-center justify-center min-h-[140px] sm:min-h-[180px] border border-gray-200 overflow-x-auto">
                    <div className="w-full max-w-full">
                      {circuit.svg}
                    </div>
                  </div>

                  {isSelected && !isSubmitted && (
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!isSubmitted ? (
            <button
              onClick={() => handlePracticeSubmit(question.id)}
              disabled={!selectedAnswer}
              className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-white text-base sm:text-lg transition-all shadow-lg ${selectedAnswer
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 cursor-pointer active:scale-95'
                  : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              {selectedAnswer ? t('practice.ui.checkAnswer') : t('practice.ui.selectPrompt')}
            </button>
          ) : (
            <div
              className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 mb-4 sm:mb-6 ${isCorrect ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500' : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-500'
                }`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${isCorrect ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                >
                  {isCorrect ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 mb-1 sm:mb-2 text-base sm:text-lg">
                    {isCorrect ? t('practice.ui.correctTitle') : t('practice.ui.incorrectTitle')}
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="flex-1 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <span className="hidden sm:inline">←</span> {t('practice.ui.previous')}
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestion >= practiceQuestions.length - 1}
              className="flex-1 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {t('practice.ui.next')} <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center text-gray-600 text-xs sm:text-sm px-4">
          <p>{t('practice.ui.footer')}</p>
        </div>
      </div>
    </div>
  );
};

export default TorchlightPractice;
