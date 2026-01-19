import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedWords from '../../../components/AnimatedWords';
import AnimatedNumberLine from '../../../components/AnimatedNumberLine';

export default function RationalNumbersDemonstrationMode() {
  const { t } = useLanguage();
  const [num1, setNum1] = useState(-3);
  const [den1, setDen1] = useState(5);
  const [num2, setNum2] = useState(-1);
  const [den2, setDen2] = useState(3);
  const [showBetween, setShowBetween] = useState(false);
  const [selectedDenom, setSelectedDenom] = useState(15);

  // Sequential animation variants
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

  // Function to find LCM
  const gcd = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const lcm = (a: number, b: number): number => {
    return (a * b) / gcd(a, b);
  };

  // Find rational numbers between two given rationals
  const findNumbersBetween = () => {
    const commonDen = selectedDenom;
    const newNum1 = (num1 * commonDen) / den1;
    const newNum2 = (num2 * commonDen) / den2;
    
    const min = Math.min(newNum1, newNum2);
    const max = Math.max(newNum1, newNum2);
    
    const between = [];
    for (let i = Math.ceil(min) + 1; i < Math.floor(max) && between.length < 5; i++) {
      between.push({ num: i, den: commonDen });
    }
    
    // If we need more numbers, add fractional ones
    if (between.length < 3) {
      const step = (max - min) / 6;
      for (let i = 1; i <= 5; i++) {
        const val = min + (i * step);
        between.push({ num: Math.round(val * commonDen) / commonDen * commonDen, den: commonDen });
      }
    }
    
    return { between: between.slice(0, 5), newNum1, newNum2, commonDen };
  };

  const handleFindBetween = () => {
    setShowBetween(true);
  };

  const result = findNumbersBetween();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 via-pink-50 to-purple-50 p-6 sm:p-8 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 relative"
        >
          <div className="flex items-center justify-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-4 px-6 sm:px-8 md:px-12 lg:px-16 w-full max-w-7xl mx-auto">
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
              className="text-4xl sm:text-5xl md:text-6xl"
            >
              🔢
            </motion.div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-[1.3] px-4 sm:px-6 md:px-8 break-words w-full max-w-7xl mx-auto py-3">
              {t('rn88_title')}
            </h1>
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
              className="text-6xl"
            >
              🔢
            </motion.div>
          </div>
        </motion.div>

        {/* Topic 8.8: Rational Numbers Between Two Rational Numbers */}
    <motion.div
          variants={seqContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
          {/* Key Concept */}
          <motion.div
            variants={seqItem}
            className="bg-gradient-to-br from-blue-50 to-cyan-100 p-10 sm:p-12 md:p-14 rounded-3xl shadow-2xl border-4 border-blue-300"
      >
            <div className="flex items-center gap-4 mb-6">
          <motion.div
            animate={{
                  scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
                  ease: "easeInOut"
            }}
            className="text-5xl"
          >
                💡
          </motion.div>
              <h2 className="text-3xl font-extrabold text-blue-900">
                {t('rn88_key_concept_title')}
          </h2>
            </div>

            <div className="bg-white/60 p-6 rounded-2xl">
              <div className="text-lg text-gray-700 font-medium leading-relaxed">
                <AnimatedWords text={t('rn88_key_concept')} />
              </div>
            </div>
        </motion.div>

          {/* Comparison: Integers vs Rational Numbers */}
        <motion.div
            variants={seqItem}
            className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-3xl shadow-2xl border-4 border-purple-300"
          >
            <div className="flex items-center gap-4 mb-6">
                <motion.div
                  animate={{
                  rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                className="text-5xl"
                >
                ⚖️
                </motion.div>
              <h2 className="text-3xl font-extrabold text-purple-900">
                {t('rn88_comparison_title')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Integers - Finite */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl p-6 border-4 border-red-300 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">🔢</span>
                  <h3 className="text-2xl font-bold text-red-800">{t('rn88_integers_finite')}</h3>
                </div>
                <div className="text-lg text-gray-700 mb-4">
                  <AnimatedWords text={t('rn88_integers_example')} />
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['5', '6', '7', '8', '9', '10'].map((num, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`px-4 py-2 rounded-xl font-bold text-xl ${
                        num === '5' || num === '10' 
                          ? 'bg-red-500 text-white border-4 border-red-700' 
                          : 'bg-white text-gray-800 border-2 border-red-400'
                      }`}
                    >
                      {num}
                    </motion.span>
                  ))}
              </div>
            </motion.div>

              {/* Rational Numbers - Infinite */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border-4 border-green-300 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-bold text-green-800">{t('rn88_rationals_infinite')}</h3>
                </div>
                <div className="text-lg text-gray-700 mb-4">
                  <AnimatedWords text={t('rn88_rationals_example')} />
                </div>
                <div className="flex flex-wrap gap-2 justify-center items-center">
                  <span className="px-4 py-2 rounded-xl font-bold text-xl bg-green-500 text-white border-4 border-green-700">1/2</span>
                  <span className="px-3 py-1 rounded-xl font-bold text-lg bg-white text-gray-800 border-2 border-green-400">5/8</span>
                  <span className="px-3 py-1 rounded-xl font-bold text-lg bg-white text-gray-800 border-2 border-green-400">11/16</span>
                  <span className="px-3 py-1 rounded-xl font-bold text-lg bg-white text-gray-800 border-2 border-green-400">21/32</span>
                  <span className="text-3xl text-green-600">...</span>
                  <span className="px-4 py-2 rounded-xl font-bold text-xl bg-green-500 text-white border-4 border-green-700">3/4</span>
          </div>
              </motion.div>
        </div>
          </motion.div>

          {/* Method to Find Rational Numbers Between Two Numbers */}
        <motion.div
            variants={seqItem}
            className="bg-gradient-to-br from-yellow-50 to-orange-100 p-8 rounded-3xl shadow-2xl border-4 border-yellow-300"
        >
            <div className="flex items-center gap-4 mb-6">
            <motion.div
              animate={{
                y: [0, -10, 0],
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
              <h2 className="text-3xl font-extrabold text-orange-900">
                {t('rn88_method_title')}
              </h2>
            </div>

            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-5 border-l-4 border-blue-500"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">1️⃣</span>
                  <div className="text-lg text-gray-800 font-medium">
                    <AnimatedWords text={t('rn88_step1')} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-5 border-l-4 border-green-500"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">2️⃣</span>
                  <div className="text-lg text-gray-800 font-medium">
                    <AnimatedWords text={t('rn88_step2')} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-5 border-l-4 border-purple-500"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">3️⃣</span>
                  <div className="text-lg text-gray-800 font-medium">
                    <AnimatedWords text={t('rn88_step3')} />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Example: Between −3/5 and −1/3 */}
          <motion.div
            variants={seqItem}
            className="bg-gradient-to-br from-indigo-50 to-purple-100 p-8 rounded-3xl shadow-2xl border-4 border-indigo-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="text-5xl"
              >
                📊
              </motion.div>
              <h2 className="text-3xl font-extrabold text-indigo-900">
                {t('rn88_example_title')}
              </h2>
            </div>

            <div className="space-y-6 bg-white/60 p-6 rounded-2xl">
              {/* Step 1: Convert */}
              <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl p-5 border-l-4 border-yellow-500">
                <div className="text-lg text-gray-800 font-semibold mb-2">
                  📐 <AnimatedWords text={t('rn88_convert_step')} />
                </div>
                <div className="flex items-center justify-center gap-4 text-2xl font-mono font-bold text-gray-900">
                  <span>−3/5 = −9/15</span>
                  <span>{t('rn88_and')}</span>
                  <span>−1/3 = −5/15</span>
                </div>
              </div>

              {/* Step 2: Numbers between */}
              <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl p-5 border-l-4 border-green-500">
                <div className="text-lg text-gray-800 font-semibold mb-3">
                  ✅ <AnimatedWords text={t('rn88_numbers_between')} />
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {['-8/15', '-7/15', '-6/15'].map((num, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.2 }}
                      whileHover={{ scale: 1.1, y: -3 }}
                      className="px-6 py-3 bg-green-500 text-white rounded-xl font-mono text-xl font-bold shadow-lg border-2 border-green-700"
                    >
                      {num}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Step 3: More numbers with larger denominator */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-5 border-l-4 border-purple-500">
                <div className="text-lg text-gray-800 font-semibold mb-2">
                  🎲 <AnimatedWords text={t('rn88_more_numbers')} />
                </div>
                <div className="flex items-center justify-center gap-4 text-2xl font-mono font-bold text-gray-900 mb-3">
                  <span>−3/5 = −18/30</span>
                  <span>and</span>
                  <span>−1/3 = −10/30</span>
                </div>
                <div className="text-md text-gray-700 font-medium mb-3">
                  <AnimatedWords text={t('rn88_more_examples')} />
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['-17/30', '-16/30', '-15/30', '-14/30', '-13/30', '-12/30', '-11/30'].map((num, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + idx * 0.1 }}
                      className="px-3 py-2 bg-white rounded-lg font-mono text-sm font-bold shadow border-2 border-purple-400 text-gray-800"
                    >
                      {num}
                    </motion.span>
                  ))}
                </div>
            </div>
          </div>
        </motion.div>

          {/* Interactive Finder */}
          <motion.div
            variants={seqItem}
            className="bg-gradient-to-br from-pink-50 to-rose-100 p-8 rounded-3xl shadow-2xl border-4 border-pink-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-5xl"
              >
                🔍
              </motion.div>
              <h2 className="text-3xl font-extrabold text-pink-900">
                {t('rn88_interactive_title')}
              </h2>
            </div>

            <div className="text-md text-gray-600 mb-6">
              <AnimatedWords text={t('rn88_interactive_subtitle')} />
            </div>

            <div className="space-y-6 bg-white/60 p-6 rounded-2xl">
              {/* Input Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* First Number */}
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-gray-700">
                    {t('rn88_first_number')}
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={num1}
                      onChange={(e) => {
                        setNum1(parseInt(e.target.value) || 0);
                        setShowBetween(false);
                      }}
                      className="w-full px-4 py-3 text-xl font-bold rounded-xl border-2 border-pink-300 focus:border-pink-500 focus:outline-none"
                      placeholder="-3"
                    />
                    <span className="text-3xl font-bold">/</span>
                    <input
                      type="number"
                      value={den1}
                      onChange={(e) => {
                        setDen1(parseInt(e.target.value) || 1);
                        setShowBetween(false);
                      }}
                      className="w-full px-4 py-3 text-xl font-bold rounded-xl border-2 border-pink-300 focus:border-pink-500 focus:outline-none"
                      placeholder="5"
                    />
                  </div>
                </div>

                {/* Second Number */}
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-gray-700">
                    {t('rn88_second_number')}
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={num2}
                      onChange={(e) => {
                        setNum2(parseInt(e.target.value) || 0);
                        setShowBetween(false);
                      }}
                      className="w-full px-4 py-3 text-xl font-bold rounded-xl border-2 border-pink-300 focus:border-pink-500 focus:outline-none"
                      placeholder="-1"
                    />
                    <span className="text-3xl font-bold">/</span>
                    <input
                      type="number"
                      value={den2}
                      onChange={(e) => {
                        setDen2(parseInt(e.target.value) || 1);
                        setShowBetween(false);
                      }}
                      className="w-full px-4 py-3 text-xl font-bold rounded-xl border-2 border-pink-300 focus:border-pink-500 focus:outline-none"
                      placeholder="3"
                    />
                  </div>
                </div>
              </div>

              {/* Common Denominator Selector */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-700">
                  {t('rn88_common_denom')}
                </label>
                <select
                  value={selectedDenom}
                  onChange={(e) => {
                    setSelectedDenom(parseInt(e.target.value));
                    setShowBetween(false);
                  }}
                  className="w-full px-4 py-3 text-xl font-bold rounded-xl border-2 border-pink-300 focus:border-pink-500 focus:outline-none"
                >
                  <option value={lcm(Math.abs(den1), Math.abs(den2))}>{t('rn88_lcm')} ({lcm(Math.abs(den1), Math.abs(den2))})</option>
                  <option value={lcm(Math.abs(den1), Math.abs(den2)) * 2}>{lcm(Math.abs(den1), Math.abs(den2)) * 2}</option>
                  <option value={lcm(Math.abs(den1), Math.abs(den2)) * 3}>{lcm(Math.abs(den1), Math.abs(den2)) * 3}</option>
                  <option value={lcm(Math.abs(den1), Math.abs(den2)) * 5}>{lcm(Math.abs(den1), Math.abs(den2)) * 5}</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFindBetween}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {t('rn88_find_button')}
              </motion.button>

              <AnimatePresence>
                {showBetween && (
        <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mt-6 p-6 bg-gradient-to-r from-green-100 to-teal-100 rounded-2xl shadow-xl"
        >
                    <p className="text-lg text-gray-700 font-semibold mb-4">{t('rn88_result_label')}</p>
                    
                    <div className="mb-4">
                      <p className="text-md text-gray-600 mb-2">
                        {t('rn88_converted')} {num1}/{den1} = {result.newNum1}/{result.commonDen} {t('rn88_and')} {num2}/{den2} = {result.newNum2}/{result.commonDen}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center">
                      {result.between.map((item, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.1, y: -5 }}
                          className="px-5 py-3 bg-green-500 text-white rounded-xl font-mono text-xl font-bold shadow-lg border-2 border-green-700"
                        >
                          {item.num}/{item.den}
                        </motion.span>
                      ))}
                    </div>

                    <p className="text-center mt-4 text-gray-600 italic">
                      {t('rn88_infinitely_more')}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
        </motion.div>

          {/* Important Property */}
          <motion.div
            variants={seqItem}
            className="bg-gradient-to-br from-emerald-50 to-green-100 p-8 rounded-3xl shadow-2xl border-4 border-emerald-300"
          >
            <div className="flex items-center gap-4 mb-6">
        <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  y: { duration: 2, repeat: Infinity },
                  rotate: { duration: 4, repeat: Infinity, ease: "linear" }
                }}
                className="text-5xl"
              >
                ⭐
              </motion.div>
              <h2 className="text-3xl font-extrabold text-emerald-900">
                {t('rn88_property_title')}
              </h2>
            </div>

            <div className="bg-white/60 p-6 rounded-2xl">
              <div className="text-xl text-gray-800 font-bold text-center leading-relaxed">
                <AnimatedWords text={t('rn88_property_text')} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
