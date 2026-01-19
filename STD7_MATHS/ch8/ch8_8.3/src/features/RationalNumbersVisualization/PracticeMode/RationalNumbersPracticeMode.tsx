import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedNumberLine from '../../../components/AnimatedNumberLine';
import { useNavigate } from 'react-router-dom';

export default function RationalNumbersPracticeMode() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 via-red-50 to-pink-50 p-6 sm:p-8 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Animated Header with Multiple Bouncing Icons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: -30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.18, delayChildren: 0.1 }
            }
          }}
          className="text-center mb-10 relative"
        >
          <div className="flex items-center justify-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-6 px-6 sm:px-8 md:px-12 lg:px-16 w-full max-w-7xl mx-auto">
            <motion.div
              variants={{ hidden: { opacity: 0, y: -12, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }}
              animate={{ y: [0, -20, 0], rotate: [0, 15, -15, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl sm:text-5xl md:text-6xl"
            >
              🎯
            </motion.div>
            <motion.h1
              variants={{ hidden: { opacity: 0, y: -8 }, visible: { opacity: 1, y: 0 } }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent leading-[1.3] px-6 sm:px-8 md:px-12 lg:px-16 py-3 break-words w-full max-w-7xl mx-auto"
            >
              {t('rn_practiceHeader')}
            </motion.h1>
            <motion.div
              variants={{ hidden: { opacity: 0, y: -12, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }}
              animate={{ y: [0, -20, 0], rotate: [0, -15, 15, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl"
            >
              🚀
            </motion.div>
          </div>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
            className="text-gray-700 text-base sm:text-lg md:text-xl font-medium px-6 sm:px-8 md:px-12 lg:px-16 max-w-6xl mx-auto"
          >
            {t('rn_practiceSub')}
          </motion.p>
        </motion.div>

        {/* Single-question flow (Prev / Next / Skip / Submit) */}
        <PracticeFlow />

        {/* Interactive tools moved to Learn → 8.1 Introduction */}
      </div>
    </div>
  );
}

function PracticeFlow() {
  const { t } = useLanguage();
  type Q = {
    id: string;
    prompt: string;
    options: string[];
    correct: number; // index
    explain: string;
    num?: number; den?: number; // optional number line
  };

  const questions: Q[] = [
    {
      id: 'q1',
      prompt: t('pq1_prompt'),
      options: [t('pq1_opt1'), t('pq1_opt2'), t('pq1_opt3'), t('pq1_opt4')],
      correct: 3,
      explain: t('pq1_explain')
    },
    {
      id: 'q2',
      prompt: t('pq2_prompt'),
      options: [t('pq2_opt1'), t('pq2_opt2'), t('pq2_opt3'), t('pq2_opt4')],
      correct: 1,
      explain: t('pq2_explain')
    },
    {
      id: 'q3',
      prompt: t('pq3_prompt'),
      options: [t('pq3_opt1'), t('pq3_opt2'), t('pq3_opt3'), t('pq3_opt4')],
      correct: 2,
      explain: t('pq3_explain')
    },
    {
      id: 'q4',
      prompt: t('pq4_prompt'),
      options: [t('pq4_opt1'), t('pq4_opt2'), t('pq4_opt3'), t('pq4_opt4')],
      correct: 2,
      explain: t('pq4_explain')
    },
    {
      id: 'q5',
      prompt: t('pq5_prompt'),
      options: [t('pq5_opt1'), t('pq5_opt2'), t('pq5_opt3'), t('pq5_opt4')],
      correct: 0,
      explain: t('pq5_explain')
    },
    {
      id: 'q6',
      prompt: t('pq6_prompt'),
      options: [t('pq6_opt1'), t('pq6_opt2'), t('pq6_opt3'), t('pq6_opt4')],
      correct: 3,
      explain: t('pq6_explain')
    },
  ];

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState<Record<string, { chosen: number | null; correct: boolean; skipped: boolean; timeMs: number }>>({});
  const [showOverview, setShowOverview] = useState(false);
  const navigate = useNavigate();
  const [questionStart, setQuestionStart] = useState<number>(Date.now());

  const current = questions[index];

  // Safety: if an invalid index is ever set, reset gracefully
  useEffect(() => {
    if (index < 0 || index >= questions.length) {
      setIndex(0);
      setSelected(null);
      setQuestionStart(Date.now());
    }
  }, [index]);
  const progress = `${index + 1} / ${questions.length}`;

  const next = (skip = false) => {
    // record skip if no answer
    if (checked[current.id]?.chosen == null && skip) {
      const elapsed = Date.now() - questionStart;
      setChecked(prev => ({ ...prev, [current.id]: { chosen: null, correct: false, skipped: true, timeMs: elapsed } }));
    }
    setSelected(null);
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setQuestionStart(Date.now());
    } else setShowOverview(true);
  };

  const prev = () => {
    setSelected(null);
    if (index > 0) {
      setIndex(index - 1);
      setQuestionStart(Date.now());
    }
  };

  const chosen = checked[current.id]?.chosen;
  const wasAnswered = chosen !== undefined && chosen !== null;
  const wasCorrect = checked[current.id]?.correct;

  const resultsArr = Object.values(checked);
  const numCorrect = resultsArr.filter(r => r.correct).length;
  const numSkipped = resultsArr.filter(r => r.skipped).length;
  const numIncorrect = resultsArr.filter(r => r.chosen !== null && !r.correct).length;
  const total = questions.length;
  const accuracy = total ? Math.round((numCorrect / total) * 1000) / 10 : 0;
  const totalTimeMs = resultsArr.reduce((sum, r) => sum + (r.timeMs || 0), 0);
  const avgTimeSec = resultsArr.length ? Math.round((totalTimeMs / resultsArr.length) / 100) / 10 : 0;
  const grade = accuracy >= 90 ? 'A' : accuracy >= 80 ? 'B' : accuracy >= 70 ? 'C' : accuracy >= 60 ? 'D' : 'F';

  // Navigate to score page when overview is shown (avoids navigating during render)
  useEffect(() => {
    if (showOverview) {
      const state = {
        summary: { total, correct: numCorrect, incorrect: numIncorrect, skipped: numSkipped, accuracy, avgTimeSec, grade },
        breakdown: questions.map((q) => {
          const r = checked[q.id];
          const status = r?.skipped ? 'Skipped' : r?.correct ? 'Correct' : r ? 'Incorrect' : 'Unanswered';
          return { prompt: q.prompt, status, answer: q.options[q.correct], chosen: r?.chosen };
        })
      };
      // delay to ensure UI commit before navigation
      const id = setTimeout(() => navigate('/practice/score', { state }), 0);
      return () => clearTimeout(id);
    }
  }, [showOverview, navigate]);

  if (!current) {
    return (
      <div className="p-6 rounded-2xl bg-white border-4 border-orange-200">Loading…</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-4 border-orange-300"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="text-6xl">📝</div>
          <h2 className="text-3xl font-extrabold text-gray-800">{t('practice')}</h2>
        </div>
        <div className="text-sm font-semibold text-gray-600">{progress}</div>
      </div>

      <div className="p-6 bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 rounded-2xl border-4 border-orange-200">
        <div className="text-lg font-semibold text-gray-800 mb-3">{index + 1}. {current.prompt}</div>

        {current.num !== undefined && current.den !== undefined && (
          <div className="my-4">
            <AnimatedNumberLine numerator={current.num} denominator={current.den} />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {current.options.map((opt, i) => {
            const active = selected === i;
            const answered = wasAnswered && chosen === i;
            const stateClass = answered ? (wasCorrect ? 'border-green-500' : 'border-red-500') : active ? 'border-orange-400' : 'border-gray-200';
            const handleClick = () => {
              if (wasAnswered) return; // lock after answer
              setSelected(i);
              const isCorrect = i === current.correct;
              const elapsed = Date.now() - questionStart;
              setChecked(prev => ({ ...prev, [current.id]: { chosen: i, correct: isCorrect, skipped: false, timeMs: elapsed } }));
              // auto-advance after 2.2s
              setTimeout(() => {
                if (index < questions.length - 1) {
                  setIndex(index + 1);
                  setSelected(null);
                  setQuestionStart(Date.now());
                } else {
                  setShowOverview(true);
                }
              }, 2200);
            };
            return (
              <button key={i} onClick={handleClick} disabled={wasAnswered} className={`text-left p-4 rounded-xl border-4 bg-white shadow hover:shadow-md transition-all ${stateClass} ${wasAnswered ? 'opacity-90' : ''}`}>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 items-center">
          <div className="flex">
            <motion.button whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.95 }} onClick={prev} disabled={index === 0} className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold disabled:opacity-50">{t('previous')}</motion.button>
          </div>
          <div className="flex justify-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => next(true)} className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold">{t('skip')}</motion.button>
          </div>
          <div className="flex justify-end">
            <motion.button whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }} onClick={() => next(false)} className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold">{t('next')}</motion.button>
          </div>
        </div>

        {wasAnswered && (
          <div className={`mt-4 p-4 rounded-xl border-4 ${wasCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
            <div className="font-semibold mb-1">{wasCorrect ? t('correct') : t('notQuite')}</div>
            <div className="text-gray-700">{current.explain}</div>
          </div>
        )}
      </div>

      {/* Removed render-time navigation container to avoid errors */}
    </motion.div>
  );
}

// BetweenFinder component - kept for potential future use
export function BetweenFinder() {
  const { t } = useLanguage();
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  function parseRational(s: string): number | null {
    if (!s.trim()) return null;
    if (s.includes('/')) {
      const [p, q] = s.split('/').map((t) => t.trim());
      const pn = Number(p);
      const qn = Number(q);
      if (Number.isFinite(pn) && Number.isFinite(qn) && qn !== 0) return pn / qn;
      return null;
    }
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  function findBetween() {
    if (solved) {
      setA(''); setB(''); setResult(null); setSolved(false); return;
    }
    const v1 = parseRational(a);
    const v2 = parseRational(b);
    if (v1 === null || v2 === null) {
      setResult('Invalid input — use forms like -3/5 or 0.4');
      return;
    }
    if (v1 === v2) {
      setResult('Numbers are equal — infinitely many rationals exist between them.');
      return;
    }
    const mid = (v1 + v2) / 2;
    const frac = toSimpleFraction(mid, 1000);
    setResult(`${frac.numerator}/${frac.denominator} ≈ ${mid.toFixed(4)}`);
    setSolved(true);
  }

  const v1 = parseRational(a);
  const v2 = parseRational(b);
  const mid = v1 !== null && v2 !== null && v1 !== v2 ? (v1 + v2) / 2 : null;
  const frac = mid !== null ? toSimpleFraction(mid, 1000) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
      className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border-4 border-purple-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [0, 15, -15, 0]
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-5xl"
        >
          🔍
        </motion.div>
        <h3 className="font-extrabold text-2xl text-gray-800">Find Rational Between Two Numbers</h3>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-l-4 border-purple-500"
      >
        <p className="text-sm text-purple-800 italic font-medium">{t('rn_typeTwoRationals')}</p>
      </motion.div>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 p-4 rounded-xl border-4 border-purple-200 focus:border-purple-500 focus:outline-none transition-all font-mono text-lg shadow-lg"
            value={a}
            onChange={(e) => {
              setA(e.target.value);
              setResult(null);
              setSolved(false);
            }}
            placeholder="First rational (e.g., -3/5)"
          />
          <input
            className="flex-1 p-4 rounded-xl border-4 border-purple-200 focus:border-purple-500 focus:outline-none transition-all font-mono text-lg shadow-lg"
            value={b}
            onChange={(e) => {
              setB(e.target.value);
              setResult(null);
              setSolved(false);
            }}
            placeholder="Second rational (e.g., -1/2)"
          />
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-extrabold shadow-xl hover:shadow-2xl transition-all rounded-xl border-2 border-white/30 text-lg"
            onClick={findBetween}
            title="Animate example"
          >
            <span className="flex items-center gap-2">
              <motion.span
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                ⚡
              </motion.span>
              {solved ? 'Retry' : 'Try it'}
            </span>
          </motion.button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="p-5 bg-gradient-to-r from-green-100 to-emerald-100 border-4 border-green-400 rounded-xl shadow-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.span
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity
                  }}
                  className="text-2xl"
                >
                  ✅
                </motion.span>
                <div className="text-gray-800 font-bold text-lg">A rational number between them:</div>
              </div>
              <div className="text-gray-900 text-2xl font-mono font-bold">{result}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {solved && frac && mid !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4"
          >
            <AnimatedNumberLine numerator={frac.numerator} denominator={frac.denominator} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// StandardFormConverter component - kept for potential future use
export function StandardFormConverter() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  function gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    if (b === 0) return a;
    return gcd(b, a % b);
  }

  function convertToStandardForm() {
    if (solved) { setInput(''); setResult(null); setError(null); setSolved(false); return; }
    setError(null);
    setResult(null);
    
    if (!input.trim()) {
      setError('Please enter a fraction (e.g., 36/24 or -15/20)');
      return;
    }

    const parts = input.split('/');
    if (parts.length !== 2) {
      setError('Invalid format. Please use format: numerator/denominator');
      return;
    }

    const num = Number(parts[0].trim());
    const den = Number(parts[1].trim());

    if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) {
      setError('Invalid numbers. Denominator cannot be zero.');
      return;
    }

    let newNum = den < 0 ? -num : num;
    let newDen = Math.abs(den);

    const divisor = gcd(newNum, newDen);
    newNum = newNum / divisor;
    newDen = newDen / divisor;

    setResult(`${newNum}/${newDen}`);
    setSolved(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateY: 15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
      className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border-4 border-indigo-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [0, -15, 15, 0]
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
          className="text-5xl"
        >
          ⚙️
        </motion.div>
        <h3 className="font-extrabold text-2xl text-gray-800">Convert to Standard Form</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 p-4 rounded-xl border-4 border-indigo-200 focus:border-indigo-500 focus:outline-none transition-all text-xl font-mono shadow-lg"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setResult(null);
              setError(null);
              setSolved(false);
            }}
            placeholder="36/24 or -15/20"
          />
          <motion.button
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold shadow-xl hover:shadow-2xl transition-all rounded-xl border-2 border-white/30 text-lg"
            onClick={convertToStandardForm}
          >
            <span className="flex items-center gap-2">
              <motion.span
                animate={{
                  rotate: [0, -360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                🔄
              </motion.span>
              {solved ? 'Retry' : 'Convert'}
            </span>
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10, rotate: -2, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="p-5 bg-gradient-to-r from-red-100 to-orange-100 border-4 border-red-400 rounded-xl shadow-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <motion.span
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity
                  }}
                  className="text-3xl"
                >
                  ⚠️
                </motion.span>
                <span className="font-bold text-red-800 text-lg">Almost! See a 5-second hint animation</span>
              </div>
              <div className="text-red-700">{error}</div>
            </motion.div>
          )}
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="p-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border-4 border-indigo-400 rounded-xl shadow-xl"
            >
              <div className="text-gray-800 mb-3 font-bold text-lg">Standard Form:</div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-5xl font-extrabold text-indigo-600 font-mono mb-3 text-center"
              >
                {result}
              </motion.div>
              {(() => {
                const [num, den] = result.split('/').map(Number);
                if (den) {
                  return (
                    <div className="mt-6">
                      <AnimatedNumberLine numerator={num} denominator={den} />
                    </div>
                  );
                }
                return null;
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function toSimpleFraction(x: number, maxDen = 1000) {
  let a = Math.floor(x);
  let h1 = 1;
  let k1 = 0;
  let h = a;
  let k = 1;
  let xRem = x - a;
  const maxIter = 30;
  let i = 0;
  while (Math.abs(x - h / k) > 1e-9 && k <= maxDen && i < maxIter) {
    i++;
    if (xRem === 0) break;
    x = 1 / xRem;
    a = Math.floor(x);
    const h2 = h1;
    const k2 = k1;
    h1 = h;
    k1 = k;
    h = a * h1 + h2;
    k = a * k1 + k2;
    xRem = x - a;
  }
  return { numerator: h, denominator: k };
}
