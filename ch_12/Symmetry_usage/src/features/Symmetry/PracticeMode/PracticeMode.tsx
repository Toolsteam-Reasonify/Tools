import { useEffect, useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { SymmetryExercise } from '../../../interfaces/symmetryTypes';

function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const words = text.split(' ');
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < words.length) {
          setDisplayedText(words.slice(0, i + 1).join(' '));
          i++;
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
  const [current, setCurrent] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [showAssessment, setShowAssessment] = useState(false);
  const [exerciseResults, setExerciseResults] = useState<{correct: boolean, attempts: number}[]>([]);

  const exercises: SymmetryExercise[] = [
    { id: 1, prompt: t('q1'), answer: t('q1Answer'), hint: t('q1Hint'), solution: t('q1Solution') },
    { id: 2, prompt: t('q2'), answer: t('q2Answer'), hint: t('q2Hint'), solution: t('q2Solution') },
    { id: 3, prompt: t('q3'), answer: t('q3Answer'), hint: t('q3Hint'), solution: t('q3Solution') },
    { id: 4, prompt: t('q4'), answer: t('q4Answer'), hint: t('q4Hint'), solution: t('q4Solution') },
    { id: 6, prompt: t('q6'), answer: t('q6Answer'), hint: t('q6Hint'), solution: t('q6Solution') },
  ];

  const currentEx = exercises[current];

  const renderIllustration = () => {
    switch (current) {
      case 0: // Equilateral triangle - 3 lines
        return (
          <svg viewBox="0 0 220 200" className="w-full h-56">
            <polygon points="110,20 30,180 190,180" className="fill-white" stroke="#111827" strokeWidth="4" />
            <line x1="110" y1="20" x2="110" y2="180" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
            <line x1="30" y1="180" x2="155" y2="70" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
            <line x1="190" y1="180" x2="65" y2="70" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
          </svg>
        );
      case 1: // Square - 4 lines
        return (
          <svg viewBox="0 0 220 200" className="w-full h-56">
            <rect x="40" y="30" width="140" height="140" className="fill-white" stroke="#111827" strokeWidth="4" />
            <line x1="110" y1="30" x2="110" y2="170" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
            <line x1="40" y1="100" x2="180" y2="100" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
            <line x1="40" y1="30" x2="180" y2="170" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
            <line x1="180" y1="30" x2="40" y2="170" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
          </svg>
        );
      case 2: // Regular pentagon - 5 lines (indicative)
        return (
          <svg viewBox="0 0 220 200" className="w-full h-56">
            <polygon points="110,20 30,80 55,170 165,170 190,80" className="fill-white" stroke="#111827" strokeWidth="4" />
            {[0,1,2,3,4].map(i => (
              <line key={i} x1="110" y1="20" x2="110" y2="170" stroke="#6366f1" strokeWidth="3" strokeDasharray="6 6" transform={`rotate(${i*72} 110 110)`} />
            ))}
          </svg>
        );
      case 3: // Scalene triangle - 0 lines
        return (
          <svg viewBox="0 0 220 200" className="w-full h-56">
            <polygon points="20,170 200,170 140,40" className="fill-white" stroke="#111827" strokeWidth="4" />
          </svg>
        );
      case 4: // Regular hexagon - 6 lines
        return (
          <svg viewBox="0 0 220 200" className="w-full h-56">
            <polygon points="70,30 150,30 190,100 150,170 70,170 30,100" className="fill-white" stroke="#111827" strokeWidth="4" />
            {[0,1,2,3,4,5].map(i => (
              <line key={i} x1="110" y1="30" x2="110" y2="170" stroke="#10b981" strokeWidth="3" strokeDasharray="6 6" transform={`rotate(${i*60} 110 100)`} />
            ))}
          </svg>
        );
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    const correct = userAnswer.trim().toLowerCase() === String(currentEx.answer).toLowerCase();
    setIsCorrect(correct);
    setSubmitted(true);
    setAttempts(a => a + 1);
    if (correct) setScore(s => s + 1);
    const newResults = [...exerciseResults];
    newResults[current] = { correct, attempts: (newResults[current]?.attempts || 0) + 1 };
    setExerciseResults(newResults);
  };

  const resetState = () => {
    setUserAnswer('');
    setSubmitted(false);
    setIsCorrect(false);
  };

  const handleNext = () => {
    setCurrent(c => Math.min(exercises.length - 1, c + 1));
    resetState();
  };

  const handlePrevious = () => {
    setCurrent(c => Math.max(0, c - 1));
    resetState();
  };

  if (showAssessment) {
    const accuracy = (score / exercises.length) * 100;
    return (
      <div className="space-y-6">
        <div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-8 text-white overflow-hidden">
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold mb-2">{t('practiceComplete')}</h2>
            <p className="text-xl opacity-90">{t('practiceCompleteSubtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">{t('yourScore')}</h3>
            <div className="text-5xl font-bold text-blue-600 mb-2 text-center">{score}/{exercises.length}</div>
            <div className="text-lg text-gray-600 text-center">{accuracy.toFixed(0)}% {t('accuracy')}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200">
            <h3 className="text-2xl font-bold text-purple-700 mb-4 text-center">{t('exerciseBreakdown')}</h3>
            <div className="space-y-3">
              {exercises.map((ex, i) => (
                <div key={ex.id} className={`p-4 rounded-xl border-2 ${exerciseResults[i]?.correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{exerciseResults[i]?.correct ? '✅' : '❌'}</span>
                      <span className='font-semibold'>{t('question')} {i + 1}</span>
                    </div>
                    <span className="text-sm text-gray-600">{exerciseResults[i]?.attempts || 0} {t('attemptLabel')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button onClick={() => { setShowAssessment(false); setCurrent(0); setScore(0); setAttempts(0); setExerciseResults([]); resetState(); }} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl">🔄 {t('viewAssessment')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl shadow-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">✍️ {t('practiceTitle')}</h2>
          <p className="text-lg md:text-xl opacity-90">{t('practiceSubtitle')}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-700">📝 {t('question')} {current + 1} / {exercises.length}</span>
          <span className="font-semibold text-gray-700">⭐ {t('score')}: {score}/{exercises.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500" style={{ width: `${((current + 1) / exercises.length) * 100}%` }}></div></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl p-6 overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent flex items-center gap-2">📊 {t('dataTitle')}</h3>
            <div className="mt-6 bg-white rounded-2xl p-4 shadow-md border border-gray-200">
              {renderIllustration()}
            </div>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-pink-100 via-red-100 to-orange-100 rounded-3xl shadow-2xl p-6 overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-700 to-orange-700 bg-clip-text text-transparent flex items-center gap-2">❓ {t('question')}</h3>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-pink-300">
              <p className="text-lg font-semibold text-gray-800 leading-relaxed"><AnimatedText text={currentEx.prompt} key={current} /></p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-orange-300">
              <label className="block text-sm font-bold text-gray-700 mb-3">{t('yourAnswer')}:</label>
              <input type="text" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Type here…" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-300 focus:border-pink-500 text-lg transition-all duration-300" disabled={submitted && isCorrect} />
            </div>

            {!submitted && (
              <button onClick={handleSubmit} disabled={!userAnswer.trim()} className={`w-full py-4 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl ${userAnswer.trim() ? 'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white hover:from-pink-600 hover:via-red-600 hover:to-orange-600 hover:scale-105 hover:shadow-2xl' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>✅ {t('submit')}</button>
            )}

            {submitted && (
              <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{isCorrect ? '🎉' : '❌'}</span>
                  <p className={`text-2xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>{isCorrect ? 'Correct!' : 'Incorrect'}</p>
                </div>
                {!isCorrect && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-400">
                    <p className="text-gray-700"><AnimatedText text={currentEx.hint} /></p>
                  </div>
                )}
                {submitted && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-400">
                    <p className="text-gray-700"><AnimatedText text={currentEx.solution} /></p>
                    <p className="font-bold text-green-700 mt-2">Answer: {currentEx.answer}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 bg-white rounded-xl shadow-lg border">
        <button onClick={handlePrevious} disabled={current === 0} className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-base transition-all duration-300 ${current === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transform hover:scale-105'}`}>← {t('previous')}</button>
        <button onClick={handleNext} disabled={current === exercises.length - 1} className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${current === exercises.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'}`}>{t('next')} →</button>
      </div>

      {current === exercises.length - 1 && submitted && (
        <div className="text-center">
          <button onClick={() => setShowAssessment(true)} className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-xl hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-xl">🎊 {t('viewAssessment')}</button>
        </div>
      )}
    </div>
  );
}


