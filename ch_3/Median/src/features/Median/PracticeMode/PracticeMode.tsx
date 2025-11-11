import { useEffect, useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { MedianExercise } from '../../../interfaces/medianTypes';

// Word-by-word animation component
function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const words = text.split(' ');

  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    let currentIndex = 0;
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedText(words.slice(0, currentIndex + 1).join(' '));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 100); // 100ms between each word
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [text]);

  return <span>{displayedText}</span>;
}

export default function PracticeMode() {
  const { t } = useLanguage();

  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showAssessment, setShowAssessment] = useState(false);
  const [exerciseResults, setExerciseResults] = useState<{ correct: boolean; attempts: number }[]>([]);
  const [lastAttemptCorrect, setLastAttemptCorrect] = useState(false);

  const exercises: MedianExercise[] = [
    {
      exercise_id: 'med1',
      title: t('ex1Title'),
      description: t('ex1Desc'),
      difficulty: 'beginner',
      problem_data: { dataset: [3, 7, 5, 13, 2] },
      questions: [{ type: 'median', question: t('ex1Question'), expected_answer: 5 }],
      solution: { median: 5, step_by_step: [{ step: 1, description: t('stepSortData'), result: '[2, 3, 5, 7, 13]' }, { step: 2, description: t('stepFindMiddle'), result: '5' }] },
      interaction_config: { input_methods: ['number_input'], hint_system: true, progressive_hints: [t('hintSortFirst'), t('hintCountValues'), t('hintCheckOddEven')] }
    },
    {
      exercise_id: 'med2',
      title: t('ex2Title'),
      description: t('ex2Desc'),
      difficulty: 'intermediate',
      problem_data: { dataset: [6, 15, 120, 50] },
      questions: [{ type: 'median', question: t('ex2Question'), expected_answer: 32.5 }],
      solution: { median: 32.5, step_by_step: [{ step: 1, description: t('stepSortData'), result: '[6, 15, 50, 120]' }, { step: 2, description: t('avgOfTwo'), result: '(15+50)/2 = 32.5' }] },
      interaction_config: { input_methods: ['number_input'], hint_system: true, progressive_hints: [t('hintSortFirst'), t('hintCountValues'), t('hintCheckOddEven')] }
    },
    {
      exercise_id: 'med3',
      title: t('ex3Title'),
      description: t('ex3Desc'),
      difficulty: 'beginner',
      problem_data: { dataset: [19, 25, 23, 20, 9, 20, 15, 10, 5] },
      questions: [{ type: 'median', question: t('ex3Question'), expected_answer: 19 }],
      solution: { median: 19, step_by_step: [{ step: 1, description: t('stepSortData'), result: '[5, 9, 10, 15, 19, 20, 20, 23, 25]' }, { step: 2, description: t('stepFindMiddle'), result: '19' }] },
      interaction_config: { input_methods: ['number_input'], hint_system: true, progressive_hints: [t('hintSortFirst'), t('hintCountValues'), t('hintCheckOddEven')] }
    },
    {
      exercise_id: 'med4',
      title: t('ex4Title'),
      description: t('ex4Desc'),
      difficulty: 'intermediate',
      problem_data: { dataset: [165, 170, 158, 172, 168, 175] },
      questions: [{ type: 'median', question: t('ex4Question'), expected_answer: 169 }],
      solution: { median: 169, step_by_step: [{ step: 1, description: t('stepSortData'), result: '[158, 165, 168, 170, 172, 175]' }, { step: 2, description: t('avgOfTwo'), result: '(168+170)/2 = 169' }] },
      interaction_config: { input_methods: ['number_input'], hint_system: true, progressive_hints: [t('hintSortFirst'), t('hintCountValues'), t('hintCheckOddEven')] }
    },
    {
      exercise_id: 'med5',
      title: t('ex5Title'),
      description: t('ex5Desc'),
      difficulty: 'beginner',
      problem_data: { dataset: [28, 30, 32, 28, 30, 28, 31] },
      questions: [{ type: 'median', question: t('ex5Question'), expected_answer: 30 }],
      solution: { median: 30, step_by_step: [{ step: 1, description: t('stepSortData'), result: '[28, 28, 28, 30, 30, 31, 32]' }, { step: 2, description: t('stepFindMiddle'), result: '30' }] },
      interaction_config: { input_methods: ['number_input'], hint_system: true, progressive_hints: [t('hintSortFirst'), t('hintCountValues'), t('hintCheckOddEven')] }
    },
    {
      exercise_id: 'med6',
      title: t('ex6Title'),
      description: t('ex6Desc'),
      difficulty: 'intermediate',
      problem_data: { dataset: [45000, 52000, 48000, 51000, 47000, 50000] },
      questions: [{ type: 'median', question: t('ex6Question'), expected_answer: 49000 }],
      solution: { median: 49000, step_by_step: [{ step: 1, description: t('stepSortData'), result: '[45000, 47000, 48000, 50000, 51000, 52000]' }, { step: 2, description: t('avgOfTwo'), result: '(48000+50000)/2 = 49000' }] },
      interaction_config: { input_methods: ['number_input'], hint_system: true, progressive_hints: [t('hintSortFirst'), t('hintCountValues'), t('hintCheckOddEven')] }
    }
  ];

  const currentExerciseData = exercises[currentExercise];

  useEffect(() => {
    setShowHint(false);
    setCurrentHintIndex(0);
    setAttempts(0);
    setShowResults(false);
    setShowSolution(false);
    setUserAnswers({});
  }, [currentExercise]);

  const handleAnswerChange = (index: number, value: string) => {
    setUserAnswers(prev => ({ ...prev, [`q${index}`]: value }));
  };

  const handleSubmit = () => {
    setAttempts(prev => prev + 1);
    let correctAnswers = 0;
    currentExerciseData.questions.forEach((question, index) => {
      const userAnswer = userAnswers[`q${index}`] ?? '';
      if (typeof question.expected_answer === 'number') {
        const normalized = parseFloat(userAnswer);
        if (!Number.isNaN(normalized) && Math.abs(normalized - question.expected_answer) < 0.1) correctAnswers++;
      } else {
        const norm = (s: string) => s.replace(/\s+/g, '');
        if (norm(userAnswer) === norm(String(question.expected_answer))) correctAnswers++;
      }
    });
    const allCorrect = correctAnswers === currentExerciseData.questions.length;
    // mirror Bargraph_usage structure: award 1 point if all answers are correct for this exercise
    setScore(prev => prev + (allCorrect ? 1 : 0));
    setLastAttemptCorrect(allCorrect);
    setShowResults(true);
    setShowSolution(false);

    // track results for assessment view
    setExerciseResults(prev => {
      const next = [...prev];
      next[currentExercise] = {
        correct: correctAnswers === currentExerciseData.questions.length,
        attempts: (next[currentExercise]?.attempts || 0) + 1,
      };
      return next;
    });
  };

  const handleShowHint = () => {
    if (currentExerciseData.interaction_config?.progressive_hints) {
      setShowHint(true);
      if (currentHintIndex < currentExerciseData.interaction_config.progressive_hints.length - 1) {
        setCurrentHintIndex(prev => prev + 1);
      }
    }
  };

  return (
    <div className="space-y-6">
      {showAssessment ? (
        <div className="space-y-6">
          {/* Assessment Header (structure copied from Bargraph_usage) */}
          <div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-8 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-emerald-400/10 to-teal-400/10 animate-pulse" />
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-4xl font-bold mb-2">{t('practice')} {t('completed') || 'Completed'}</h2>
              <p className="text-xl opacity-90">{t('greatJob') || 'Great job working through the exercises!'}</p>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4 text-center">🎯</div>
              <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">{t('yourScore') || 'Your score'}</h3>
              <div className="text-5xl font-bold text-blue-600 mb-2 text-center">{score}/{exercises.length}</div>
              <div className="text-lg text-gray-600 text-center">{((score / exercises.length) * 100).toFixed(0)}% {t('accuracy') || 'accuracy'}</div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200 transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4 text-center">📊</div>
              <h3 className="text-2xl font-bold text-purple-700 mb-4 text-center">{t('performance') || 'Performance'}</h3>
              <div className="text-5xl font-bold text-purple-600 mb-2 text-center">{score >= Math.ceil(exercises.length * 0.8) ? '⭐⭐⭐' : score >= Math.ceil(exercises.length * 0.6) ? '⭐⭐' : '⭐'}</div>
              <div className="text-lg text-gray-600 text-center">{t('totalAttempts') || 'Total attempts'}: {attempts}</div>
            </div>
          </div>

          {/* Exercise Breakdown */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📝 {t('exerciseBreakdown') || 'Exercise breakdown'}</h3>
            <div className="space-y-3">
              {exercises.map((ex, i) => (
                <div key={ex.exercise_id} className={`p-4 rounded-xl border-2 ${exerciseResults[i]?.correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{exerciseResults[i]?.correct ? '✅' : '❌'}</span>
                      <span className='font-semibold'>{t('question')} {i + 1}</span>
                    </div>
                    <span className="text-sm text-gray-600">{exerciseResults[i]?.attempts || 0} {t('attempts') || 'attempts'}</span>
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
                setUserAnswers({});
                setShowResults(false);
                setShowSolution(false);
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              {t('practice')} {t('again') || 'again'}
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
      {/* Header with emoji */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl shadow-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 text-9xl opacity-10">✍️</div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-5xl animate-bounce">✍️</span>
            {t('practice')} - {currentExercise + 1}/{exercises.length}
          </h2>
          <p className="text-lg md:text-xl opacity-90">{t('practiceSubtitle') || 'Test your understanding of median calculations'}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl shadow-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-700">
            📝 {t('question')} {currentExercise + 1} {t('of') || 'of'} {exercises.length}
          </span>
          <span className="font-semibold text-gray-700">
            ⭐ {t('score') || 'Score'}: {score}/{exercises.length}
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
        {/* Left - Data visualization */}
        <div className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl p-6 overflow-hidden">
          {/* Animated orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-3xl">📊</span>
              {currentExerciseData.title}
            </h3>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-6">
              <p className="text-gray-700 mb-4 text-base md:text-lg leading-relaxed">
                <AnimatedText text={currentExerciseData.description} />
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📊</span>
                <div className="text-sm font-bold text-blue-700">{t('data')}:</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {currentExerciseData.problem_data.dataset.map((value, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl"
                    style={{ borderColor: '#3b82f6' }}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
              {t('question')}
            </h3>

            {/* Question card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-pink-300">
              <div className="space-y-4">
                {currentExerciseData.questions.map((q, i) => (
                  <div key={i} className="relative overflow-hidden border-2 border-pink-200/60 rounded-xl p-4 bg-gradient-to-br from-white via-pink-50/20 to-orange-50/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full blur-xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-start gap-2 mb-3">
                        <span className="text-xl flex-shrink-0">❓</span>
                        <div className="text-sm font-semibold text-gray-800">{i + 1}. <AnimatedText text={q.question} /></div>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">✏️</span>
                        <input 
                          type={typeof q.expected_answer === 'number' ? 'number' : 'text'} 
                          value={userAnswers[`q${i}`] || ''} 
                          onChange={(e) => handleAnswerChange(i, e.target.value)} 
                          className="w-full pl-12 pr-3 py-3 border-2 border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white shadow-inner text-lg font-medium transition-all duration-300" 
                          placeholder={t('enterYourAnswer')} 
                          disabled={showResults} 
                          step="0.1" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Hint section */}
            {!showResults && currentExerciseData.interaction_config?.progressive_hints && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-yellow-300">
                <button
                  onClick={handleShowHint}
                  className="w-full flex items-center justify-between py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    {t('showHint')} ({currentHintIndex + 1}/{currentExerciseData.interaction_config.progressive_hints.length})
                  </span>
                  <span className="text-2xl">▼</span>
                </button>
                
                {showHint && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-400">
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">🔍</span>
                      <p className="text-gray-700 leading-relaxed"><AnimatedText text={currentExerciseData.interaction_config.progressive_hints[currentHintIndex]} /></p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit button */}
            {!showResults && (
              <button
                onClick={handleSubmit}
                className={`w-full py-4 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl flex items-center justify-center gap-3 ${
                  'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white hover:from-pink-600 hover:via-red-600 hover:to-orange-600 hover:scale-105 hover:shadow-2xl'
                }`}
              >
                <span className="text-2xl">✅</span>
                {t('submitAnswers')}
              </button>
            )}

            {/* Result */}
            {showResults && (
              <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-4 ${lastAttemptCorrect ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{lastAttemptCorrect ? '🎉' : '❌'}</span>
                  <p className={`text-2xl font-bold ${lastAttemptCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {lastAttemptCorrect ? t('correct') : t('incorrect')}
                  </p>
                </div>
                
                <div className="mt-4 text-center">
                   <div className="text-3xl font-bold text-blue-600 mb-2">
                    {t('score') || 'Score'}: {score}/{currentExerciseData.questions.length}
                  </div>
                  <div className="text-gray-600">
                    {t('attempts') || 'Attempts'}: {attempts}
                  </div>
                </div>

                {!lastAttemptCorrect && (
                  <button
                    onClick={() => {
                      setShowResults(false);
                      setUserAnswers({});
                      setShowHint(false);
                      setShowSolution(false);
                    }}
                    className="w-full mt-4 py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {t('tryAgain')} 🔄
                  </button>
                )}
              </div>
            )}

            {/* Solution section */}
            {showResults && (
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
                        <p className="text-gray-700 leading-relaxed mb-2">{t('solutionSteps')}</p>
                        <div className="space-y-2">
                          {currentExerciseData.solution.step_by_step.map((s, idx) => (
                            <div key={idx} className="text-sm p-3 bg-white/80 rounded-lg border-l-4 border-blue-400 shadow-sm">
                              <span className="font-bold text-blue-700">Step {s.step}:</span> {s.description}{s.result ? <span className="ml-2 font-semibold text-blue-600">→ {s.result}</span> : ''}
                            </div>
                          ))}
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
          onClick={() => setCurrentExercise(e => Math.max(0, e - 1))}
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
          onClick={() => { setUserAnswers({}); setShowResults(false); setScore(0); setAttempts(0); setShowSolution(false); setShowHint(false); setCurrentHintIndex(0); }}
          className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600 shadow-lg hover:shadow-xl"
        >
          🔄 {t('reset')}
        </button>
        <button
          onClick={() => setCurrentExercise(e => Math.min(exercises.length - 1, e + 1))}
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
    </div>
  );
}

