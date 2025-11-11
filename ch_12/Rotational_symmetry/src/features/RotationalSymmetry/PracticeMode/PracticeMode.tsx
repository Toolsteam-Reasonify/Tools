import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { RotationalSymmetryExercise } from '../../../interfaces/rotationalSymmetryTypes';

function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const words = text.split(' ');

  useEffect(() => {
    setDisplayedText('');
    let currentIndex = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedText(words.slice(0, currentIndex + 1).join(' '));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return <span>{displayedText}</span>;
}

export default function PracticeMode() {
  const { t } = useLanguage();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [showAssessment, setShowAssessment] = useState(false);
  const [exerciseResults, setExerciseResults] = useState<{correct: boolean, attempts: number}[]>([]);
  

  

  const exercises: RotationalSymmetryExercise[] = [
    {
      id: 1,
      question: t('q1Question'),
      answer: '3',
      hint: t('q1Hint'),
      solution: t('q1Solution'),
      shape: 'q1-triangle',
    },
    {
      id: 2,
      question: t('q2Question'),
      answer: 'circle and x-shape',
      hint: t('q2Hint'),
      solution: t('q2Solution'),
      shape: 'q2-multiple',
    },
    {
      id: 3,
      question: t('q3Question'),
      answer: '2',
      hint: t('q3Hint'),
      solution: t('q3Solution'),
      shape: 'q3-parallelogram',
    },
    {
      id: 4,
      question: t('q4Question'),
      answer: 'circle with cross, equilateral triangle, circle with three lines, pinwheel',
      hint: t('q4Hint'),
      solution: t('q4Solution'),
      shape: 'q4-multiple',
    },
    {
      id: 5,
      question: t('q5Question'),
      answer: 'arrow: 1, pinwheel: 6, plus: 4, pentagon: 5, star: 6, triskelion: 3',
      hint: t('q5Hint'),
      solution: t('q5Solution'),
      shape: 'q5-multiple',
    },
  ];

  const currentEx = exercises[currentExercise];

  const handleSubmit = () => {
    const correct = userAnswer.trim().toLowerCase().includes(String(currentEx.answer).toLowerCase()) || 
                   String(currentEx.answer).toLowerCase().includes(userAnswer.trim().toLowerCase());
    setIsCorrect(correct);
    setSubmitted(true);
    setAttempts(attempts + 1);
    if (correct) {
      setScore(score + 1);
    }
    
    const newResults = [...exerciseResults];
    newResults[currentExercise] = {
      correct,
      attempts: (newResults[currentExercise]?.attempts || 0) + 1
    };
    setExerciseResults(newResults);
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setShowHint(false);
      setShowSolution(false);
      setSubmitted(false);
      setIsCorrect(false);
    } else {
      setShowAssessment(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setUserAnswer('');
      setShowHint(false);
      setShowSolution(false);
      setSubmitted(false);
      setIsCorrect(false);
    }
  };
  

  const renderShapeVisualization = (shapeId: string) => {
    switch(shapeId) {
      case 'q1-triangle':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-48">
            <polygon points="100,30 170,170 30,170" fill="none" stroke="#111827" strokeWidth="4" />
            <circle cx="100" cy="100" r="3" fill="#ef4444" />
            <text x="100" y="25" textAnchor="middle" fontSize="14" fontWeight="bold">R</text>
          </svg>
        );
      case 'q3-parallelogram':
        return (
          <svg viewBox="0 0 200 200" className="w-full h-48">
            <polygon points="50,50 150,50 130,150 30,150" fill="none" stroke="#111827" strokeWidth="4" />
            <line x1="50" y1="50" x2="130" y2="150" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="150" y1="50" x2="30" y2="150" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="90" cy="100" r="5" fill="#ef4444" />
            <text x="95" y="105" fontSize="12" fontWeight="bold">O</text>
            {/* Transparent overlay parallelogram to hint overlap */}
            <g opacity="0.3">
              <polygon points="60,60 160,60 140,160 40,160" fill="#60a5fa" stroke="#2563eb" strokeWidth="2" />
            </g>
          </svg>
        );
      case 'q2-multiple':
        return (
          <svg viewBox="0 0 400 200" className="w-full h-48">
            {/* Circle with center */}
            <circle cx="60" cy="100" r="35" fill="none" stroke="#111827" strokeWidth="4" />
            <circle cx="60" cy="100" r="3" fill="#ef4444" />
            {/* X-shape */}
            <g transform="translate(140,100)">
              <line x1="-30" y1="-30" x2="30" y2="30" stroke="#111827" strokeWidth="4" />
              <line x1="-30" y1="30" x2="30" y2="-30" stroke="#111827" strokeWidth="4" />
            </g>
            {/* B-shape (stylized) */}
            <g transform="translate(240,70)">
              <path d="M0 0 L0 60 M0 0 C 30 5, 40 20, 0 30 M0 30 C 35 35, 40 55, 0 60" fill="none" stroke="#111827" strokeWidth="4" />
            </g>
            {/* Star */}
            <g transform="translate(340,100)">
              <polygon points="0,-30 8,-10 30,-10 12,5 18,25 0,12 -18,25 -12,5 -30,-10 -8,-10" fill="none" stroke="#111827" strokeWidth="4" />
            </g>
          </svg>
        );
      case 'q4-multiple':
        return (
          <svg viewBox="0 0 400 200" className="w-full h-48">
            {/* Circle with cross (order 4) */}
            <g transform="translate(60,100)">
              <circle cx="0" cy="0" r="35" fill="none" stroke="#111827" strokeWidth="4" />
              <line x1="-35" y1="0" x2="35" y2="0" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="0" y1="-35" x2="0" y2="35" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" />
            </g>
            {/* Equilateral triangle (order 3) */}
            <g transform="translate(160,100)">
              <polygon points="0,-35 30,25 -30,25" fill="none" stroke="#111827" strokeWidth="4" />
            </g>
            {/* Circle with three radial lines (order 3) */}
            <g transform="translate(260,100)">
              <circle cx="0" cy="0" r="35" fill="none" stroke="#111827" strokeWidth="4" />
              <g stroke="#0ea5e9" strokeWidth="2">
                <line x1="0" y1="0" x2="35" y2="0" />
                <g transform="rotate(120)"><line x1="0" y1="0" x2="35" y2="0" /></g>
                <g transform="rotate(240)"><line x1="0" y1="0" x2="35" y2="0" /></g>
              </g>
            </g>
            {/* Pinwheel (order 4) */}
            <g transform="translate(340,100)">
              <circle cx="0" cy="0" r="4" fill="#111827" />
              <path d="M0 0 C 15 -10, 28 -10, 30 0 C 20 0, 12 5, 0 0 Z" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1.5" />
              <g transform="rotate(90)"><path d="M0 0 C 15 -10, 28 -10, 30 0 C 20 0, 12 5, 0 0 Z" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1.5" /></g>
              <g transform="rotate(180)"><path d="M0 0 C 15 -10, 28 -10, 30 0 C 20 0, 12 5, 0 0 Z" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1.5" /></g>
              <g transform="rotate(270)"><path d="M0 0 C 15 -10, 28 -10, 30 0 C 20 0, 12 5, 0 0 Z" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1.5" /></g>
            </g>
          </svg>
        );
      case 'q5-multiple':
        return (
          <div className="grid grid-cols-3 gap-3">
            {/* Arrow */}
            <svg viewBox="0 0 100 100" className="w-full h-28 bg-white rounded-lg p-2 shadow-sm">
              <path d="M10 50 H60 L50 40 M60 50 L50 60" fill="none" stroke="#111827" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            {/* Pinwheel */}
            <svg viewBox="0 0 100 100" className="w-full h-28 bg-white rounded-lg p-2 shadow-sm">
              <g transform="translate(50,50)">
                <circle cx="0" cy="0" r="3" fill="#111827" />
                <path d="M0 0 C 12 -8, 22 -8, 24 0 C 16 0, 10 4, 0 0 Z" fill="#60a5fa" stroke="#2563eb" strokeWidth="1.5" />
                <g transform="rotate(60)"><path d="M0 0 C 12 -8, 22 -8, 24 0 C 16 0, 10 4, 0 0 Z" fill="#60a5fa" stroke="#2563eb" strokeWidth="1.5" /></g>
                <g transform="rotate(120)"><path d="M0 0 C 12 -8, 22 -8, 24 0 C 16 0, 10 4, 0 0 Z" fill="#60a5fa" stroke="#2563eb" strokeWidth="1.5" /></g>
                <g transform="rotate(180)"><path d="M0 0 C 12 -8, 22 -8, 24 0 C 16 0, 10 4, 0 0 Z" fill="#60a5fa" stroke="#2563eb" strokeWidth="1.5" /></g>
                <g transform="rotate(240)"><path d="M0 0 C 12 -8, 22 -8, 24 0 C 16 0, 10 4, 0 0 Z" fill="#60a5fa" stroke="#2563eb" strokeWidth="1.5" /></g>
                <g transform="rotate(300)"><path d="M0 0 C 12 -8, 22 -8, 24 0 C 16 0, 10 4, 0 0 Z" fill="#60a5fa" stroke="#2563eb" strokeWidth="1.5" /></g>
              </g>
            </svg>
            {/* Plus */}
            <svg viewBox="0 0 100 100" className="w-full h-28 bg-white rounded-lg p-2 shadow-sm">
              <g stroke="#111827" strokeWidth="8">
                <line x1="50" y1="15" x2="50" y2="85" />
                <line x1="15" y1="50" x2="85" y2="50" />
              </g>
            </svg>
            {/* Pentagon */}
            <svg viewBox="0 0 100 100" className="w-full h-28 bg-white rounded-lg p-2 shadow-sm">
              <polygon points="50,15 82,40 70,80 30,80 18,40" fill="none" stroke="#111827" strokeWidth="4" />
            </svg>
            {/* Star */}
            <svg viewBox="0 0 100 100" className="w-full h-28 bg-white rounded-lg p-2 shadow-sm">
              <polygon points="50,12 60,38 88,38 64,55 72,82 50,66 28,82 36,55 12,38 40,38" fill="none" stroke="#111827" strokeWidth="4" />
            </svg>
            {/* Triskelion (three arms) */}
            <svg viewBox="0 0 100 100" className="w-full h-28 bg-white rounded-lg p-2 shadow-sm">
              <g transform="translate(50,50)" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1.5">
                <path d="M0 0 C 10 -10, 20 -10, 24 0 C 16 2, 8 2, 0 0 Z" />
                <g transform="rotate(120)"><path d="M0 0 C 10 -10, 20 -10, 24 0 C 16 2, 8 2, 0 0 Z" /></g>
                <g transform="rotate(240)"><path d="M0 0 C 10 -10, 20 -10, 24 0 C 16 2, 8 2, 0 0 Z" /></g>
              </g>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  if (showAssessment) {
    const accuracy = (score / exercises.length) * 100;
    
    return (
      <div className="space-y-6">
        <div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-8 text-white overflow-hidden">
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-4xl font-bold mb-2">{t('practiceComplete')}</h2>
            <p className="text-xl opacity-90">{t('practiceCompleteSubtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200">
            <div className="text-4xl mb-4 text-center">🎯</div>
            <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">{t('yourScore')}</h3>
            <div className="text-5xl font-bold text-blue-600 mb-2 text-center">
              {score}/{exercises.length}
            </div>
            <div className="text-lg text-gray-600 text-center">
              {accuracy.toFixed(0)}% {t('accuracy')}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200">
            <div className="text-4xl mb-4 text-center">📊</div>
            <h3 className="text-2xl font-bold text-purple-700 mb-4 text-center">{t('performance')}</h3>
            <div className="text-5xl font-bold text-purple-600 mb-2 text-center">
              {accuracy >= 80 ? '⭐⭐⭐' : accuracy >= 60 ? '⭐⭐' : '⭐'}
            </div>
            <div className="text-lg text-gray-600 text-center">
              {t('totalAttempts')}: {attempts}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📝 {t('exerciseBreakdown')}</h3>
          <div className="space-y-3">
            {exercises.map((ex, i) => (
              <div key={ex.id} className={`p-4 rounded-xl border-2 ${exerciseResults[i]?.correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{exerciseResults[i]?.correct ? '✅' : '❌'}</span>
                    <span className='font-semibold'>{t('questionLabel')} {i + 1}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {exerciseResults[i]?.attempts || 0} {t('attemptLabel')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              setShowAssessment(false);
              setCurrentExercise(0);
              setScore(0);
              setAttempts(0);
              setExerciseResults([]);
              setUserAnswer('');
              setSubmitted(false);
              setIsCorrect(false);
            }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            {t('practiceAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header gradient banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl shadow-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">👨‍🎓</span>
          <h2 className="text-3xl md:text-4xl font-bold">{t('practiceTitle')}</h2>
        </div>
        <p className="text-lg md:text-xl opacity-95 ml-12">{t('practiceSubtitle')}</p>
      </div>

      {/* Progress bar section */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">
            {t('questionProgress')} {currentExercise + 1} {t('of')} {exercises.length}
          </span>
          <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
            <span className="text-yellow-500">⭐</span> {t('score')}: {score}/{exercises.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left panel - Given Data */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl shadow-xl p-6">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="inline-block w-5 h-5 bg-blue-600 rounded"></span>
            {t('dataTitle')}
          </h3>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            {renderShapeVisualization(currentEx.shape || '')}
          </div>
        </div>

        {/* Right panel - Question */}
        <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-3xl shadow-xl p-6">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">❓</span>
            {t('questionTitle')}
          </h3>

          {/* Question box */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4 border border-gray-100">
            <div className="flex items-start gap-2">
              <span className="text-xl">🎨</span>
              <p className="text-base md:text-lg text-gray-800 flex-1">
                <AnimatedText text={currentEx.question} />
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Your Answer section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-red-500">✏️</span> {t('yourAnswer')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={t('placeholderAnswer')}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:outline-none transition-all duration-300 text-base pr-10"
                  disabled={submitted && isCorrect}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500">✏️</span>
              </div>
            </div>

            {/* Submit button - gray with green checkmark */}
            <button
              onClick={handleSubmit}
              disabled={userAnswer.trim() === '' || (submitted && isCorrect)}
              className={`w-full px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                userAnswer.trim() === '' || (submitted && isCorrect)
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-500 text-white hover:bg-gray-600 shadow-md'
              }`}
            >
              <span className="text-green-500">✅</span> {t('submit')}
            </button>

            {/* Show Hint button */}
            <button
              onClick={() => setShowHint(!showHint)}
              className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="text-yellow-200">💡</span> {showHint ? t('hideHint') : t('showHint')}
              </span>
              <span className="text-white/80">▾</span>
            </button>

            {showHint && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                <p className="text-gray-800"><strong>{t('hintLabel')}:</strong> {currentEx.hint}</p>
              </div>
            )}

            {/* Show Solution button */}
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              {showSolution ? t('hideSolution') : t('showSolution')}
            </button>

            {showSolution && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <p className="text-gray-800"><strong>{t('solutionLabel')}:</strong> {currentEx.solution}</p>
              </div>
            )}

            {/* Success/Error message */}
            {submitted && (
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 border-2 border-green-500' : 'bg-red-100 border-2 border-red-500'}`}>
                <p className={`font-bold text-base ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? `✅ ${t('correct')}` : `❌ ${t('incorrect')}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex justify-center gap-3">
        <button
          onClick={handlePrevious}
          disabled={currentExercise === 0}
          className={`px-6 py-2 rounded-lg font-medium ${
            currentExercise === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
          }`}
        >
          ← {t('previous')}
        </button>
        
        <button
          onClick={handleNext}
          className={`px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700`}
        >
          {currentExercise === exercises.length - 1 ? t('viewAssessment') : t('next')} →
        </button>
      </div>
    </div>
  );
}

