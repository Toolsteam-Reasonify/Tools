import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedWords from '../../../components/AnimatedWords';
import AnimatedNumberLine from '../../../components/AnimatedNumberLine';

export default function RationalNumbersDemonstrationMode() {
  const { t } = useLanguage();
  const [numberSystemStep, setNumberSystemStep] = useState(0);

  // Sequential animation variants used across sections
  const seqContainer = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  } as const;

  const seqItem = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } }
  } as const;

  const numberSystemSteps = [
    { 
      name: t('rn_naturalNumbers'), 
      desc: t('rn_naturalNumbersDesc'), 
      icon: '🔢', 
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-100 via-cyan-50 to-blue-100',
      borderColor: 'border-blue-400',
      examples: ['1', '2', '3', '4', '5', '...']
    },
    { 
      name: t('rn_wholeNumbers'), 
      desc: t('rn_wholeNumbersDesc'), 
      icon: '🔷', 
      color: 'from-cyan-500 to-teal-500',
      bgGradient: 'from-cyan-100 via-teal-50 to-cyan-100',
      borderColor: 'border-cyan-400',
      examples: ['0', '1', '2', '3', '4', '...']
    },
    { 
      name: t('rn_integers'), 
      desc: t('rn_integersDesc'), 
      icon: '⚡', 
      color: 'from-teal-500 to-green-500',
      bgGradient: 'from-teal-100 via-green-50 to-teal-100',
      borderColor: 'border-teal-400',
      examples: ['...', '-2', '-1', '0', '1', '2', '...']
    },
    { 
      name: t('rn_fractions'), 
      desc: t('rn_fractionsDesc'), 
      icon: '📊', 
      color: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-100 via-emerald-50 to-green-100',
      borderColor: 'border-green-400',
      examples: ['1/2', '3/4', '5/6', '7/8', '...']
    },
    { 
      name: t('rn_rationalNumbers'), 
      desc: t('rn_rationalNumbersDesc'), 
      icon: '✨', 
      color: 'from-emerald-500 to-purple-500',
      bgGradient: 'from-emerald-100 via-purple-50 to-emerald-100',
      borderColor: 'border-emerald-400',
      examples: ['-3/4', '-1/2', '0', '1/2', '3/4', '...']
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 via-pink-50 to-purple-50 p-6 sm:p-8 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Animated Header with Bouncing Books on Both Sides */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 relative"
        >
          <div className="flex items-center justify-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-4 px-6 sm:px-8 md:px-12 lg:px-16 w-full max-w-7xl mx-auto">
            {/* Left Side: Stacked Books with Jumping Animation */}
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="relative w-16 h-16">
                {/* Bottom book (light blue) */}
                <div className="absolute bottom-0 left-0 w-14 h-5 bg-blue-400 rounded-sm transform rotate-[-2deg] shadow-md"></div>
                {/* Middle book (red/pink) */}
                <div className="absolute bottom-2 left-1 w-14 h-5 bg-pink-500 rounded-sm transform rotate-[1deg] shadow-md"></div>
                {/* Top book (green) */}
                <div className="absolute bottom-4 left-2 w-14 h-5 bg-green-500 rounded-sm transform rotate-[-1deg] shadow-md"></div>
              </div>
            </motion.div>
            
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-[1.3] px-6 sm:px-8 md:px-12 lg:px-16 break-words w-full max-w-7xl mx-auto py-3">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-blue-500 bg-clip-text text-transparent">
                {t('rn_titleShort')}
              </span>
            </h1>
            
            {/* Right Side: Stacked Books with Jumping Animation */}
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 0.3
              }}
              className="relative"
            >
              <div className="relative w-16 h-16">
                {/* Bottom book (light blue) */}
                <div className="absolute bottom-0 left-0 w-14 h-5 bg-blue-400 rounded-sm transform rotate-[-2deg] shadow-md"></div>
                {/* Middle book (red/pink) */}
                <div className="absolute bottom-2 left-1 w-14 h-5 bg-pink-500 rounded-sm transform rotate-[1deg] shadow-md"></div>
                {/* Top book (green) */}
                <div className="absolute bottom-4 left-2 w-14 h-5 bg-green-500 rounded-sm transform rotate-[-1deg] shadow-md"></div>
              </div>
            </motion.div>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-700 text-lg sm:text-xl md:text-2xl font-medium px-6 sm:px-8 md:px-12 lg:px-16 max-w-6xl mx-auto"
          >
            {t('rn_rationalNumbersDesc')}
          </motion.p>
        </motion.div>

        {/* Topic 8.1 Section */}
        <Topic81Section 
          numberSystemSteps={numberSystemSteps}
          numberSystemStep={numberSystemStep}
          setNumberSystemStep={setNumberSystemStep}
        />
      </div>
    </div>
  );
}

interface Topic81SectionProps {
  numberSystemSteps: Array<{
    name: string;
    desc: string;
    icon: string;
    color: string;
    bgGradient: string;
    borderColor: string;
    examples: string[];
  }>;
  numberSystemStep: number;
  setNumberSystemStep: (step: number) => void;
}

// Intro versions of tools (line-by-line in Learn 8.1)
function BetweenFinderIntro() {
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

  function findBetween() {
    if (solved) {
      // Reset to allow re-trying with new inputs
      setA('');
      setB('');
      setResult(null);
      setSolved(false);
      return;
    }
    const v1 = parseRational(a);
    const v2 = parseRational(b);
    if (v1 === null || v2 === null) { setResult(t('bf_invalidInput')); return; }
    if (v1 === v2) { setResult(t('bf_equalNumbers')); return; }
    const mid = (v1 + v2) / 2; const frac = toSimpleFraction(mid, 1000);
    setResult(`${frac.numerator}/${frac.denominator} ≈ ${mid.toFixed(4)}`);
    setSolved(true);
  }

  const v1 = parseRational(a);
  const v2 = parseRational(b);
  const mid = v1 !== null && v2 !== null && v1 !== v2 ? (v1 + v2) / 2 : null;
  const frac = mid !== null ? toSimpleFraction(mid, 1000) : null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border-4 border-purple-300">
        <div className="flex items-center gap-3 mb-4">
        <div className="text-5xl">🔍</div>
        <h3 className="font-extrabold text-2xl text-gray-800">{t('bf_title')}</h3>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-l-4 border-purple-500">
        <p className="text-sm text-purple-800 italic font-medium">{t('rn_typeTwoRationals')}</p>
      </motion.div>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input className="flex-1 p-4 rounded-xl border-4 border-purple-200 focus:border-purple-500 focus:outline-none transition-all font-mono text-lg shadow-lg" value={a} onChange={(e) => { setA(e.target.value); setResult(null); setSolved(false); }} placeholder={t('bf_placeholder1')} />
          <input className="flex-1 p-4 rounded-xl border-4 border-purple-200 focus:border-purple-500 focus:outline-none transition-all font-mono text-lg shadow-lg" value={b} onChange={(e) => { setB(e.target.value); setResult(null); setSolved(false); }} placeholder={t('bf_placeholder2')} />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-extrabold shadow-xl hover:shadow-2xl transition-all rounded-xl border-2 border-white/30 text-lg" onClick={findBetween} title="Animate example">{solved ? t('bf_retry') : t('bf_tryIt')}</motion.button>
        </div>
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} className="p-5 bg-gradient-to-r from-green-100 to-emerald-100 border-4 border-green-400 rounded-xl shadow-xl">
              <div className="text-gray-800 font-bold text-lg mb-1">{t('bf_betweenLabel')}</div>
              <div className="text-gray-900 text-2xl font-mono font-bold">{result}</div>
            </motion.div>
          )}
        </AnimatePresence>
        {solved && frac && mid !== null && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
            <AnimatedNumberLine numerator={frac.numerator} denominator={frac.denominator} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function StandardFormConverterIntro() {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  function gcd(a: number, b: number): number { a = Math.abs(a); b = Math.abs(b); if (b === 0) return a; return gcd(b, a % b); }

  function convertToStandardForm() {
    if (solved) { setInput(''); setResult(null); setError(null); setSolved(false); return; }
    setError(null); setResult(null);
    if (!input.trim()) { setError(t('sf_error_enter')); return; }
    const parts = input.split('/'); if (parts.length !== 2) { setError(t('sf_error_invalid')); return; }
    const num = Number(parts[0].trim()); const den = Number(parts[1].trim());
    if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) { setError(t('sf_error_den')); return; }
    let newNum = den < 0 ? -num : num; let newDen = Math.abs(den); const d = gcd(newNum, newDen);
    newNum = newNum / d; newDen = newDen / d; setResult(`${newNum}/${newDen}`); setSolved(true);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border-4 border-indigo-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-5xl">⚙️</div>
        <h3 className="font-extrabold text-2xl text-gray-800">{t('sf_title')}</h3>
      </div>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input className="flex-1 p-4 rounded-xl border-4 border-indigo-200 focus:border-indigo-500 focus:outline-none transition-all text-xl font-mono shadow-lg" value={input} onChange={(e) => { setInput(e.target.value); setResult(null); setError(null); setSolved(false); }} placeholder={t('sf_placeholder')} />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold shadow-xl hover:shadow-2xl transition-all rounded-xl border-2 border-white/30 text-lg" onClick={convertToStandardForm}>{solved ? t('sf_retry') : t('sf_convert')}</motion.button>
        </div>
        <AnimatePresence mode="wait">
          {error && (
            <motion.div key="err" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="p-4 bg-red-50 border-4 border-red-200 rounded-xl text-red-700">{error}</motion.div>
          )}
          {result && (
            <motion.div key="res" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-4 border-blue-200 rounded-xl">
              <div className="text-gray-700 mb-2 font-semibold">{t('sf_resultLabel')}</div>
              <div className="text-4xl font-bold text-indigo-600 font-mono mb-2">{result}</div>
              {(() => { const [n, d] = result!.split('/').map(Number); if (d) { return (<div className="mt-4"><AnimatedNumberLine numerator={n} denominator={d} /></div>); } return null; })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Topic81Section({ numberSystemSteps, numberSystemStep, setNumberSystemStep }: Topic81SectionProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      variants={
        // use the same variants defined above via closure
        // Typescript will accept any since framer accepts objects
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (null as any)
      }
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-8"
    >
      {/* Progressive Extension */}
      <motion.article
        variants={{ hidden: { opacity: 0, scale: 0.98, y: 10 }, visible: { opacity: 1, scale: 1, y: 0 } }}
        className="bg-white/90 backdrop-blur-sm p-10 sm:p-12 md:p-14 rounded-3xl shadow-2xl border-4 border-purple-300"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="text-5xl"
          >
            🎓
          </motion.div>
          <h2 className="text-3xl font-extrabold text-gray-800">
            {t('rn_progressiveExtension')}
          </h2>
        </motion.div>

        {/* Animated Caption */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 rounded-xl border-l-4 border-pink-500 shadow-lg"
        >
          <AnimatedWords
            text={t('rn_definition')}
            className="text-base text-gray-800 italic font-medium"
            startDelay={0.1}
            wordDelay={0.03}
            wrapperClassName="block"
          />
        </motion.div>

        {/* Interactive Timeline with Bouncing Icons */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                🔄
              </motion.span>
              {t('rn_progressiveExtension')}
            </h3>
            {/* top arrow buttons removed per request */}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={numberSystemStep}
              initial={{ opacity: 0, x: 100, rotateY: -90 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -100, rotateY: 90 }}
              transition={{ duration: 0.6 }}
              className={`bg-gradient-to-br ${numberSystemSteps[numberSystemStep].color} p-8 rounded-3xl text-white shadow-2xl border-4 border-white/30 relative overflow-hidden`}
            >
              {/* Floating particles effect */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/30 rounded-full"
                  initial={{
                    x: Math.random() * 400,
                    y: Math.random() * 200,
                    opacity: 0
                  }}
                  animate={{
                    y: [null, Math.random() * 200],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}

              <div className="relative z-10">
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-7xl mb-4 text-center"
                >
                  {numberSystemSteps[numberSystemStep].icon}
                </motion.div>
                <h4 className="text-3xl font-extrabold mb-3 text-center">{numberSystemSteps[numberSystemStep].name}</h4>
                <p className="text-xl opacity-95 mb-6 text-center">{numberSystemSteps[numberSystemStep].desc}</p>
                
                {/* Examples with staggered bounce */}
                <div className="flex flex-wrap gap-3 justify-center mt-6">
                  {numberSystemSteps[numberSystemStep].examples.map((ex, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        delay: idx * 0.15,
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{ scale: 1.2, y: -5 }}
                      className="bg-white/25 backdrop-blur-sm px-4 py-2 rounded-xl font-mono text-lg font-bold shadow-lg cursor-pointer border-2 border-white/40"
                    >
                      {ex}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots with pulse */}
          <div className="flex justify-center gap-3 mt-6">
            {numberSystemSteps.map((step, idx) => (
              <motion.button
                key={idx}
                onClick={() => setNumberSystemStep(idx)}
                whileHover={{ scale: 1.3, y: -3 }}
                className={`rounded-full transition-all relative ${
                  idx === numberSystemStep 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 w-12 h-4 shadow-lg' 
                    : 'bg-gray-300 w-4 h-4 hover:bg-gray-400'
                }`}
              >
                {idx === numberSystemStep && (
                  <motion.div
                    className="absolute inset-0 bg-white/50 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Bottom navigation: Previous (left) and Next (right) */}
        <div className="mt-6 mb-8 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNumberSystemStep(Math.max(0, numberSystemStep - 1))}
            disabled={numberSystemStep === 0}
            className="px-5 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            ← {t('previous')}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNumberSystemStep(Math.min(numberSystemSteps.length - 1, numberSystemStep + 1))}
            disabled={numberSystemStep === numberSystemSteps.length - 1}
            className="px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {t('next')} →
          </motion.button>
        </div>

        {/* Chapter Objective with Bouncing Icon */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
          className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6 rounded-2xl border-4 border-indigo-300 shadow-xl"
        >
          <div className="flex items-start gap-4">
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, -10, 10, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-5xl"
            >
              🎯
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">{t('rn_chapterObjective')}</h3>
              <AnimatedWords
                text={t('rn_objectiveText')}
                className="text-gray-700 leading-relaxed text-lg"
                startDelay={0.1}
                wordDelay={0.04}
                wrapperClassName="block"
              />
            </div>
          </div>
        </motion.div>
      </motion.article>

      {/* Number Line Visualizations with Enhanced Animation */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}>
        <motion.div
          variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } }}
        >
          <AnimatedNumberLine numerator={-3} denominator={4} label="-3/4" />
        </motion.div>
        <motion.div
          variants={{ hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } }}
        >
          <AnimatedNumberLine numerator={3} denominator={4} label="3/4" />
        </motion.div>
      </motion.div>

      {/* Interactive tools (moved from Practice) displayed line-by-line */}
      <div className="space-y-8 mt-8">
        <BetweenFinderIntro />
        <StandardFormConverterIntro />
      </div>
    </motion.div>
  );
}