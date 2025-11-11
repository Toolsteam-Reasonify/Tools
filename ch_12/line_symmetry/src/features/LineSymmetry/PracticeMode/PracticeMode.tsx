import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { LineSymmetryExercise } from '../../../interfaces/lineSymmetryTypes';

// Word-by-word animation component
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
  }, [text, delay, words.length]);

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

  // Practice exercises - Line Symmetry questions (Starting from question 6)
  const exercises: LineSymmetryExercise[] = [
    {
      id: 6,
      question: t('q6Question'),
      answer: 'Yes',
      hint: t('q6Hint'),
      solution: t('q6Solution'),
    },
    {
      id: 7,
      question: t('q7Question'),
      answer: 'Centre: Diagonals intersection, Order: 4, Angle: 90°',
      hint: t('q7Hint'),
      solution: t('q7Solution'),
      shape: 'Square',
    },
    {
      id: 8,
      question: t('q8Question'),
      answer: 'Centre: Diagonals intersection, Order: 2, Angle: 180°',
      hint: t('q8Hint'),
      solution: t('q8Solution'),
      shape: 'Rectangle',
    },
    {
      id: 9,
      question: t('q9Question'),
      answer: 'Centre: Diagonals intersection, Order: 2, Angle: 180°',
      hint: t('q9Hint'),
      solution: t('q9Solution'),
      shape: 'Rhombus',
    },
    {
      id: 10,
      question: t('q10Question'),
      answer: 'Centre: Centroid, Order: 3, Angle: 120°',
      hint: t('q10Hint'),
      solution: t('q10Solution'),
      shape: 'Equilateral Triangle',
    },
    {
      id: 11,
      question: t('q11Question'),
      answer: 'Centre: Center, Order: 6, Angle: 60°',
      hint: t('q11Hint'),
      solution: t('q11Solution'),
      shape: 'Regular Hexagon',
    },
    {
      id: 12,
      question: t('q12Question'),
      answer: 'Centre: Center, Order: Infinite, Angle: Any angle',
      hint: t('q12Hint'),
      solution: t('q12Solution'),
      shape: 'Circle',
    },
    {
      id: 13,
      question: t('q13Question'),
      answer: 'No rotational symmetry',
      hint: t('q13Hint'),
      solution: t('q13Solution'),
      shape: 'Semi-circle',
    },
  ];

  const currentEx = exercises[currentExercise];

  const handleSubmit = () => {
    const correct = userAnswer.trim().toLowerCase() === String(currentEx.answer).toLowerCase();
    setIsCorrect(correct);
    setSubmitted(true);
    setAttempts(attempts + 1);
    if (correct) {
      setScore(score + 1);
    }
    
    // Store result for this exercise
    const newResults = [...exerciseResults];
    newResults[currentExercise] = {
      correct,
      attempts: (newResults[currentExercise]?.attempts || 0) + 1
    };
    setExerciseResults(newResults);
  };

  const handleNext = () => {
    setCurrentExercise(currentExercise + 1);
    setUserAnswer('');
    setShowHint(false);
    setShowSolution(false);
    setSubmitted(false);
    setIsCorrect(false);
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

  // Show assessment if completed
  if (showAssessment) {
    const accuracy = (score / exercises.length) * 100;
    
    return (
      <div className="space-y-6">
        {/* Assessment Header */}
        <div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-emerald-400/10 to-teal-400/10 animate-pulse" />
          
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-4xl font-bold mb-2">
              {t('practiceComplete')}
            </h2>
            <p className="text-xl opacity-90">{t('practiceCompleteSubtitle')}</p>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Score Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4 text-center">🎯</div>
            <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">{t('yourScore')}</h3>
            <div className="text-5xl font-bold text-blue-600 mb-2 text-center">
              {score}/{exercises.length}
            </div>
            <div className="text-lg text-gray-600 text-center">
              {accuracy.toFixed(0)}% {t('accuracy')}
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200 transform hover:scale-105 transition-all duration-300">
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

        {/* Exercise Breakdown */}
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

        {/* Restart Button */}
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
    <div className="space-y-6">
      {/* Header with emoji */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl shadow-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 text-9xl opacity-10">✍️</div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-5xl animate-bounce">✍️</span>
            {t('practiceTitle')}
          </h2>
          <p className="text-lg md:text-xl opacity-90">{t('practiceSubtitle')}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl shadow-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-700">
            📝 {t('questionProgress')} {currentExercise + 1} {t('of')} {exercises.length}
          </span>
          <span className="font-semibold text-gray-700">
            ⭐ {t('score')}: {score}/{exercises.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left - Shape visualization */}
        <div className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl p-6 overflow-hidden">
          {/* Animated orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-3xl">⬜</span>
              {t('dataTitle')}
            </h3>

            {/* Shape diagrams */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              {/* Question 6 - Multiple lines of symmetry */}
              {currentExercise === 0 && (
                <div className="text-center space-y-4">
                  <div>
                    <svg width="200" height="200" className="mx-auto">
                      <rect x="50" y="50" width="100" height="100" fill="none" stroke="black" strokeWidth="3"/>
                      <line x1="50" y1="100" x2="150" y2="100" stroke="blue" strokeWidth="2" strokeDasharray="5,5"/>
                      <line x1="100" y1="50" x2="100" y2="150" stroke="blue" strokeWidth="2" strokeDasharray="5,5"/>
                      <line x1="50" y1="50" x2="150" y2="150" stroke="blue" strokeWidth="2" strokeDasharray="5,5"/>
                      <line x1="150" y1="50" x2="50" y2="150" stroke="blue" strokeWidth="2" strokeDasharray="5,5"/>
                      <circle cx="100" cy="100" r="4" fill="red"/>
                    </svg>
                    <p className="mt-2 font-bold">{t('multipleLinesThroughCenter')}</p>
                  </div>
                </div>
              )}
              {/* Shape rotation questions - Square */}
              {currentExercise === 1 && (
                <div className="text-center">
                  <svg width="250" height="250" viewBox="0 0 250 250" className="mx-auto">
                    <rect x="75" y="75" width="100" height="100" fill="none" stroke="#1f2937" strokeWidth="4"/>
                    {/* Diagonals */}
                    <line x1="75" y1="75" x2="175" y2="175" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,3"/>
                    <line x1="175" y1="75" x2="75" y2="175" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,3"/>
                    {/* Center point */}
                    <circle cx="125" cy="125" r="5" fill="#ef4444"/>
                    <text x="125" y="200" textAnchor="middle" className="text-lg font-bold fill-gray-800">{t('square')}</text>
                  </svg>
                </div>
              )}
              {/* Rectangle */}
              {currentExercise === 2 && (
                <div className="text-center">
                  <svg width="250" height="250" viewBox="0 0 250 250" className="mx-auto">
                    <rect x="60" y="80" width="130" height="90" fill="none" stroke="#1f2937" strokeWidth="4"/>
                    {/* Diagonals */}
                    <line x1="60" y1="80" x2="190" y2="170" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,3"/>
                    <line x1="190" y1="80" x2="60" y2="170" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,3"/>
                    {/* Center point */}
                    <circle cx="125" cy="125" r="5" fill="#ef4444"/>
                    <text x="125" y="200" textAnchor="middle" className="text-lg font-bold fill-gray-800">{t('rectangle')}</text>
                  </svg>
                </div>
              )}
              {/* Rhombus */}
              {currentExercise === 3 && (
                <div className="text-center">
                  <svg width="250" height="250" viewBox="0 0 250 250" className="mx-auto">
                    <polygon points="125,50 180,125 125,200 70,125" fill="none" stroke="#1f2937" strokeWidth="4"/>
                    {/* Diagonals */}
                    <line x1="125" y1="50" x2="125" y2="200" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,3"/>
                    <line x1="70" y1="125" x2="180" y2="125" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,3"/>
                    {/* Center point */}
                    <circle cx="125" cy="125" r="5" fill="#ef4444"/>
                    <text x="125" y="220" textAnchor="middle" className="text-lg font-bold fill-gray-800">{t('rhombus')}</text>
                  </svg>
                </div>
              )}
              {/* Equilateral Triangle */}
              {currentExercise === 4 && (
                <div className="text-center">
                  <svg width="250" height="250" viewBox="0 0 250 250" className="mx-auto">
                    <polygon points="125,50 190,175 60,175" fill="none" stroke="#1f2937" strokeWidth="4"/>
                    {/* Medians to centroid */}
                    <line x1="125" y1="50" x2="125" y2="133.33" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,3"/>
                    <line x1="190" y1="175" x2="125" y2="133.33" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,3"/>
                    <line x1="60" y1="175" x2="125" y2="133.33" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,3"/>
                    {/* Center point (centroid) */}
                    <circle cx="125" cy="133.33" r="5" fill="#ef4444"/>
                    <text x="125" y="220" textAnchor="middle" className="text-base font-bold fill-gray-800">{t('equilateralTriangle')}</text>
                  </svg>
                </div>
              )}
              {/* Regular Hexagon */}
              {currentExercise === 5 && (
                <div className="text-center">
                  <svg width="250" height="250" viewBox="0 0 250 250" className="mx-auto">
                    <polygon points="125,30 175,65 175,115 125,150 75,115 75,65" fill="none" stroke="#1f2937" strokeWidth="4"/>
                    {/* Center point */}
                    <circle cx="125" cy="90" r="5" fill="#ef4444"/>
                    {/* Lines from center to vertices */}
                    <line x1="125" y1="90" x2="125" y2="30" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" opacity="0.6"/>
                    <line x1="125" y1="90" x2="175" y2="65" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" opacity="0.6"/>
                    <text x="125" y="200" textAnchor="middle" className="text-base font-bold fill-gray-800">{t('regularHexagon')}</text>
                  </svg>
                </div>
              )}
              {/* Circle */}
              {currentExercise === 6 && (
                <div className="text-center">
                  <svg width="250" height="250" viewBox="0 0 250 250" className="mx-auto">
                    <circle cx="125" cy="125" r="80" fill="none" stroke="#1f2937" strokeWidth="4"/>
                    {/* Center point */}
                    <circle cx="125" cy="125" r="5" fill="#ef4444"/>
                    {/* Sample diameters */}
                    <line x1="125" y1="45" x2="125" y2="205" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,3" opacity="0.6"/>
                    <line x1="45" y1="125" x2="205" y2="125" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,3" opacity="0.6"/>
                    <text x="125" y="220" textAnchor="middle" className="text-lg font-bold fill-gray-800">{t('circle')}</text>
                  </svg>
                </div>
              )}
              {/* Semi-circle */}
              {currentExercise === 7 && (
                <div className="text-center">
                  <svg width="250" height="250" viewBox="0 0 250 250" className="mx-auto">
                    {/* Semi-circle arc */}
                    <path d="M 60 125 A 65 65 0 0 1 190 125" fill="none" stroke="#1f2937" strokeWidth="4"/>
                    {/* Flat edge */}
                    <line x1="60" y1="125" x2="190" y2="125" stroke="#1f2937" strokeWidth="4"/>
                    {/* Center of full circle (not rotation center) */}
                    <circle cx="125" cy="125" r="3" fill="#9ca3af" opacity="0.5"/>
                    <text x="125" y="200" textAnchor="middle" className="text-lg font-bold fill-gray-800">{t('semicircle')}</text>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right - Question and answer */}
        <div className="relative bg-gradient-to-br from-pink-100 via-red-100 to-orange-100 rounded-3xl shadow-2xl p-6 overflow-hidden">
          {/* Animated orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-700 to-orange-700 bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-3xl">❓</span>
              {t('questionTitle')}
            </h3>

            {/* Question card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-pink-300">
              <div className="flex items-start gap-3">
                <span className="text-3xl">❓</span>
                <p className="text-lg font-semibold text-gray-800 leading-relaxed">
                  <AnimatedText text={currentEx.question} key={currentExercise} />
                </p>
              </div>
            </div>

            {/* Answer input */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-orange-300">
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-xl">✏️</span>
                {t('yourAnswer')}:
              </label>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={t('placeholderAnswer')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-300 focus:border-pink-500 text-lg transition-all duration-300"
                disabled={submitted && isCorrect}
              />
            </div>

            {/* Submit button */}
            {!submitted && (
              <button
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                className={`w-full py-4 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl flex items-center justify-center gap-3 ${
                  userAnswer.trim()
                    ? 'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white hover:from-pink-600 hover:via-red-600 hover:to-orange-600 hover:scale-105 hover:shadow-2xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span className="text-2xl">✅</span>
                {t('submit')}
              </button>
            )}

            {/* Result */}
            {submitted && (
              <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{isCorrect ? '🎉' : '❌'}</span>
                  <p className={`text-2xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? t('correct') : t('incorrect')}
                  </p>
                </div>
                
                {!isCorrect && (
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setUserAnswer('');
                    }}
                    className="w-full mt-4 py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {t('tryAgain')} 🔄
                  </button>
                )}
              </div>
            )}

            {/* Hint section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-yellow-300">
              <button
                onClick={() => setShowHint(!showHint)}
                className="w-full flex items-center justify-between py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span className="flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  {showHint ? t('hideHint') : t('showHint')}
                </span>
                <span className="text-2xl">{showHint ? '▲' : '▼'}</span>
              </button>
              
              {showHint && (
                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-400">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">🔍</span>
                    <p className="text-gray-700 leading-relaxed"><AnimatedText text={currentEx.hint} /></p>
                  </div>
                </div>
              )}
            </div>

            {/* Solution section */}
            {submitted && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-blue-300">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="w-full flex items-center justify-between py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">👁️</span>
                    {showSolution ? t('hideSolution') : t('showSolution')}
                  </span>
                  <span className="text-2xl">{showSolution ? '▲' : '▼'}</span>
                </button>
                
                {showSolution && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-400">
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">📖</span>
                      <div>
                        <p className="text-gray-700 leading-relaxed mb-2"><AnimatedText text={currentEx.solution} /></p>
                        <div className="bg-white rounded-lg p-3 mt-3 border-2 border-green-400">
                          <p className="font-bold text-green-700 flex items-center gap-2">
                            <span>✓</span>
                            {t('answerLabel')}: {currentEx.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 bg-white rounded-xl shadow-lg border">
        <button
          onClick={handlePrevious}
          disabled={currentExercise === 0}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-base transition-all duration-300 ${
            currentExercise === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transform hover:scale-105'
          }`}
        >
          ← {t('previous')}
        </button>
        <button
          onClick={handleNext}
          disabled={currentExercise === exercises.length - 1}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
            currentExercise === exercises.length - 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {t('next')} →
        </button>
      </div>
      
      {/* View Assessment Button - only show after completing all questions */}
      {currentExercise === exercises.length - 1 && submitted && (
        <div className="text-center">
          <button
            onClick={() => setShowAssessment(true)}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-xl hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-3 mx-auto"
          >
            <span className="text-2xl">🎊</span>
            {t('viewAssessment')}
          </button>
        </div>
      )}
    </div>
  );
}
