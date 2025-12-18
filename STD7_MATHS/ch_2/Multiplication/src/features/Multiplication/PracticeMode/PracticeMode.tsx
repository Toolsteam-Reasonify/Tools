import { useEffect, useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

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
  }, [text]);

  return <span>{displayedText}</span>;
}

type Exercise = {
  id: number;
  prompt: string;
  hint: string;
  solution: string;
  answer: string; // expected final simplified answer
};

export default function PracticeMode() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [showAssessment, setShowAssessment] = useState(false);
  const [exerciseResults, setExerciseResults] = useState<{correct: boolean, attempts: number}[]>([]);

  const exercises: Exercise[] = [
    { id: 1, prompt: 'Find 2 × 3/4', hint: 'Add 3/4 two times or multiply whole with numerator: 2×3/4', solution: '2 × 3/4 = (2×3)/4 = 6/4 = 3/2 = 1 1/2', answer: '3/2' },
    { id: 2, prompt: 'Multiply 5 × 2/3', hint: 'Repeated addition: 2/3 + 2/3 + 2/3 + 2/3 + 2/3', solution: '5 × 2/3 = 10/3 = 3 1/3', answer: '10/3' },
    { id: 3, prompt: 'Find 2/3 × 3/5', hint: 'Multiply numerators and denominators; simplify by common factors', solution: '2/3 × 3/5 = (2×3)/(3×5) = 2/5', answer: '2/5' },
    { id: 4, prompt: 'Find 7/8 × 4/7', hint: 'Cancel common 7; then 4/8 simplifies to 1/2', solution: '7/8 × 4/7 = (cancel 7) 4/8 = 1/2', answer: '1/2' },
    { id: 5, prompt: 'What is 3/5 of 25?', hint: '“of” means ×; compute 3/5 × 25', solution: '3/5 × 25 = 75/5 = 15', answer: '15' },
    { id: 6, prompt: 'A rectangle has length 3/4 m and breadth 2/5 m. Find area.', hint: 'Area = l × b = 3/4 × 2/5', solution: '3/4 × 2/5 = 6/20 = 3/10 square metre', answer: '3/10' },
  ];

  const ex = exercises[current];

  // Interactive widget for "What is 3/5 of 25?" (exercise id 5)
  const [selectedGroups, setSelectedGroups] = useState(0);
  const groups = 5; // denominator
  const groupSize = 5; // 25 total items
  const goalGroups = 3; // numerator
  const handleGroupToggle = (idx: number) => {
    // toggle selection up to goalGroups
    const bit = 1 << idx;
    // use a bitmask stored in selectedGroups bit pattern via number; simpler: track count only and preselect left-to-right
  };

  const handleSubmit = () => {
    const normalized = (s: string) => s.replace(/\s+/g, '').toLowerCase();
    const correct = normalized(userAnswer) === normalized(ex.answer);
    setIsCorrect(correct);
    setSubmitted(true);
    setAttempts(a => a + 1);
    if (correct) setScore(s => s + 1);
    const newResults = [...exerciseResults];
    newResults[current] = {
      correct,
      attempts: (newResults[current]?.attempts || 0) + 1,
    };
    setExerciseResults(newResults);
  };

  const handleNext = () => {
    setCurrent(c => c + 1);
    setUserAnswer('');
    setShowHint(false);
    setShowSolution(false);
    setSubmitted(false);
    setIsCorrect(false);
  };

  const handlePrevious = () => {
    if (current > 0) {
      setCurrent(c => c - 1);
      setUserAnswer('');
      setShowHint(false);
      setShowSolution(false);
      setSubmitted(false);
      setIsCorrect(false);
    }
  };

  if (showAssessment) {
    const accuracy = (score / exercises.length) * 100;
    return (
      <div className="space-y-6">
        <div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-emerald-400/10 to-teal-400/10 animate-pulse" />
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-4xl font-bold mb-2">{t('practiceComplete')}</h2>
            <p className="text-xl opacity-90">{t('practiceCompleteSubtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4 text-center">🎯</div>
            <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">{t('yourScore')}</h3>
            <div className="text-5xl font-bold text-blue-600 mb-2 text-center">{score}/{exercises.length}</div>
            <div className="text-lg text-gray-600 text-center">{accuracy.toFixed(0)}% {t('accuracy')}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200 transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4 text-center">📊</div>
            <h3 className="text-2xl font-bold text-purple-700 mb-4 text-center">{t('performance')}</h3>
            <div className="text-5xl font-bold text-purple-600 mb-2 text-center">{accuracy >= 80 ? '⭐⭐⭐' : accuracy >= 60 ? '⭐⭐' : '⭐'}</div>
            <div className="text-lg text-gray-600 text-center">{t('totalAttempts')}: {attempts}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📝 {t('exerciseBreakdown')}</h3>
          <div className="space-y-3">
            {exercises.map((e, i) => (
              <div key={e.id} className={`p-4 rounded-xl border-2 ${exerciseResults[i]?.correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{exerciseResults[i]?.correct ? '✅' : '❌'}</span>
                    <span className='font-semibold'>{t('questionLabel')} {i + 1}</span>
                  </div>
                  <span className="text-sm text-gray-600">{exerciseResults[i]?.attempts || 0} {t('attemptLabel')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              setShowAssessment(false);
              setCurrent(0);
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

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl p-6 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-3xl">📘</span>
              {t('questionLabel')} {current + 1}
            </h3>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-6">
              <p className="text-lg font-semibold text-gray-800 leading-relaxed"><AnimatedText text={ex.prompt} key={ex.id} /></p>
            </div>
            {ex.id === 5 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-gray-700">Select 3 groups of 5</div>
                  <div className="text-sm text-gray-600">Selected: {selectedGroups}/3</div>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({ length: groups }).map((_, g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setSelectedGroups((prev) => {
                          const next = g < prev ? prev - 1 : Math.min(3, prev + 1);
                          if (next === 3) setUserAnswer('15');
                          return next;
                        });
                      }}
                      className={`p-2 rounded-xl border-2 transition-all duration-300 ${
                        g < selectedGroups
                          ? 'border-emerald-400 bg-emerald-50 shadow-inner'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="grid grid-cols-5 gap-1">
                        {Array.from({ length: groupSize }).map((_, i) => (
                          <div key={i} className={`w-4 h-4 rounded ${g < selectedGroups ? 'bg-emerald-400' : 'bg-gray-200'}`}></div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs font-semibold text-gray-600 text-center">5</div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-700">
                  3/5 of 25 means take <span className="font-bold">3</span> groups of <span className="font-bold">5</span> = <span className="font-bold">15</span>.
                </div>
              </div>
            )}
            {/* For practice, prefer text; animations are covered in Learn tab */}
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-pink-100 via-red-100 to-orange-100 rounded-3xl shadow-2xl p-6 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="relative z-10 space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-pink-300">
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

            {submitted && (
              <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{isCorrect ? '🎉' : '❌'}</span>
                  <p className={`text-2xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}> {isCorrect ? t('correct') : t('incorrect')} </p>
                </div>
                {!isCorrect && (
                  <button
                    onClick={() => { setSubmitted(false); setUserAnswer(''); }}
                    className="w-full mt-4 py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {t('tryAgain')} 🔄
                  </button>
                )}
              </div>
            )}

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
                    <p className="text-gray-700 leading-relaxed"><AnimatedText text={ex.hint} /></p>
                  </div>
                </div>
              )}
            </div>

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
                        <p className="text-gray-700 leading-relaxed mb-2"><AnimatedText text={ex.solution} /></p>
                        <div className="bg-white rounded-lg p-3 mt-3 border-2 border-green-400">
                          <p className="font-bold text-green-700 flex items-center gap-2">
                            <span>✓</span>
                            {t('answerLabel')}: {ex.answer}
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

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 bg-white rounded-xl shadow-lg border">
        <button onClick={handlePrevious} disabled={current === 0}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-base transition-all duration-300 ${current === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transform hover:scale-105'}`}>
          ← {t('previous')}
        </button>
        <button onClick={handleNext} disabled={current === exercises.length - 1}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${current === exercises.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'}`}>
          {t('next')} →
        </button>
      </div>

      {current === exercises.length - 1 && submitted && (
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


