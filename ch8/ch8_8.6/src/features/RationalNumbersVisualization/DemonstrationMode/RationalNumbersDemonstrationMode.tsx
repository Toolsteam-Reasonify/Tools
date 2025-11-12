import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedWords from '../../../components/AnimatedWords';
import AnimatedNumberLine from '../../../components/AnimatedNumberLine';

export default function RationalNumbersDemonstrationMode() {
  const { t } = useLanguage();
  const [numerator, setNumerator] = useState(-45);
  const [denominator, setDenominator] = useState(30);
  const [showStandardForm, setShowStandardForm] = useState(false);

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

  // Function to find GCD
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

  // Function to convert to standard form
  const toStandardForm = (num: number, den: number) => {
    if (den === 0) return null;
    
    const hcf = gcd(num, den);
    let stdNum = num / hcf;
    let stdDen = den / hcf;
    
    // If denominator is negative, make numerator negative and denominator positive
    if (stdDen < 0) {
      stdNum = -stdNum;
      stdDen = -stdDen;
    }
    
    return { numerator: stdNum, denominator: stdDen, hcf };
  };

  const handleConvert = () => {
    setShowStandardForm(true);
  };

  const result = toStandardForm(numerator, denominator);

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
              📏
            </motion.div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-[1.3] px-4 sm:px-6 md:px-8 break-words w-full max-w-7xl mx-auto py-3">
              {t('rn86_main_title')}
            </h1>
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="text-6xl"
            >
              ✏️
            </motion.div>
          </div>
        </motion.div>

        {/* Topic 8.6: Rational Numbers in Standard Form */}
        <motion.div
          variants={seqContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div
            variants={seqItem}
            className="bg-gradient-to-br from-purple-50 to-pink-100 p-10 sm:p-12 md:p-14 rounded-3xl shadow-2xl border-4 border-purple-300"
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
                ✨
              </motion.div>
              <h2 className="text-3xl font-extrabold text-purple-900">
                {t('rn86_title')}
              </h2>
            </div>

            {/* Definition */}
            <div className="bg-white/60 p-6 rounded-2xl mb-6">
              <h3 className="text-2xl font-bold text-purple-800 mb-3">{t('rn86_definition_title')}</h3>
              <div className="text-lg text-gray-700 mb-4">
                <AnimatedWords text={t('rn86_definition_text')} />
              </div>
              
              <div className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-l-4 border-green-500"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">1️⃣</span>
                    <div className="text-lg text-gray-800">
                      <AnimatedWords text={t('rn86_rule1')} />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-4 border-l-4 border-blue-500"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">2️⃣</span>
                    <div className="text-lg text-gray-800">
                      <AnimatedWords text={t('rn86_rule2')} />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 border-l-4 border-orange-500"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">3️⃣</span>
                    <div className="text-lg text-gray-800">
                      <AnimatedWords text={t('rn86_rule3')} />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Examples */}
            <div className="bg-white/60 p-6 rounded-2xl mb-6">
              <h3 className="text-2xl font-bold text-purple-800 mb-4">{t('rn86_examples_title')}</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl p-5">
                  <h4 className="text-xl font-bold text-green-800 mb-2 flex items-center gap-2">
                    <span>✓</span> {t('rn86_standard_form')}
                  </h4>
                  <div className="text-lg text-gray-700 font-mono">
                    <AnimatedWords text={t('rn86_standard_ex')} />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-xl p-5">
                  <h4 className="text-xl font-bold text-red-800 mb-2 flex items-center gap-2">
                    <span>✗</span> {t('rn86_not_standard')}
                  </h4>
                  <div className="text-lg text-gray-700 font-mono">
                    <AnimatedWords text={t('rn86_not_standard_ex')} />
                  </div>
                </div>
              </div>
            </div>

            {/* How to Convert */}
            <div className="bg-white/60 p-6 rounded-2xl mb-6">
              <h3 className="text-2xl font-bold text-purple-800 mb-4">{t('rn86_convert_title')}</h3>
              
              <div className="space-y-3 mb-4">
                <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl p-4">
                  <div className="text-lg text-gray-800 font-semibold">
                    <AnimatedWords text={t('rn86_step1')} />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4">
                  <div className="text-lg text-gray-800 font-semibold">
                    <AnimatedWords text={t('rn86_step2')} />
                  </div>
                  <div className="text-md text-gray-600 mt-2 italic">
                    <AnimatedWords text={t('rn86_step2_note')} />
                  </div>
                </div>
              </div>

              <h4 className="text-xl font-bold text-purple-700 mb-3">{t('rn86_examples_convert_title')}</h4>
              <div className="space-y-2">
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <div className="text-lg text-gray-800 font-mono">
                    <AnimatedWords text={t('rn86_ex1')} />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <div className="text-lg text-gray-800 font-mono">
                    <AnimatedWords text={t('rn86_ex2')} />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <div className="text-lg text-gray-800 font-mono">
                    <AnimatedWords text={t('rn86_ex3')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Converter */}
            <div className="bg-white/60 p-6 rounded-2xl">
              <h3 className="text-2xl font-bold text-purple-800 mb-4">{t('rn86_interactive_title')}</h3>
              <div className="text-md text-gray-600 mb-4">
                <AnimatedWords text={t('rn86_interactive_subtitle')} />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    {t('rn86_numerator_label')}
                  </label>
                  <input
                    type="number"
                    value={numerator}
                    onChange={(e) => {
                      setNumerator(parseInt(e.target.value) || 0);
                      setShowStandardForm(false);
                    }}
                    className="w-full px-4 py-3 text-xl font-bold rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    {t('rn86_denominator_label')}
                  </label>
                  <input
                    type="number"
                    value={denominator}
                    onChange={(e) => {
                      setDenominator(parseInt(e.target.value) || 1);
                      setShowStandardForm(false);
                    }}
                    className="w-full px-4 py-3 text-xl font-bold rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConvert}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {t('rn86_convert_button')}
              </motion.button>

              <AnimatePresence>
                {showStandardForm && result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mt-6 p-6 bg-gradient-to-r from-green-100 to-teal-100 rounded-2xl shadow-xl"
                  >
                    <p className="text-lg text-gray-700 mb-2">
                      <span className="font-bold">{t('rn86_hcf_label')}</span> {result.hcf}
                    </p>
                    <p className="text-2xl font-bold text-green-800">
                      <span className="font-semibold">{t('rn86_result_label')}</span>
                      <span className="ml-3 text-3xl">{result.numerator}/{result.denominator}</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
