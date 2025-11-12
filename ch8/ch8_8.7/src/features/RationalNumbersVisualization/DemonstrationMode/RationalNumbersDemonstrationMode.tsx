import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedWords from '../../../components/AnimatedWords';
import AnimatedNumberLine from '../../../components/AnimatedNumberLine';

export default function RationalNumbersDemonstrationMode() {
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState(1);
  const [num1, setNum1] = useState(2);
  const [den1, setDen1] = useState(3);
  const [num2, setNum2] = useState(3);
  const [den2, setDen2] = useState(4);
  const [showComparison, setShowComparison] = useState(false);

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

  // Function to compare rational numbers
  const compareRationals = (n1: number, d1: number, n2: number, d2: number) => {
    const val1 = n1 / d1;
    const val2 = n2 / d2;
    if (val1 > val2) return 'greater';
    if (val1 < val2) return 'less';
    return 'equal';
  };

  const handleCompare = () => {
    setShowComparison(true);
  };

  const handlePrev = () => {
    setSelectedMethod((prev) => (prev > 1 ? prev - 1 : 4));
  };

  const handleNext = () => {
    setSelectedMethod((prev) => (prev < 4 ? prev + 1 : 1));
  };

  const comparisonResult = compareRationals(num1, den1, num2, den2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 via-pink-50 to-orange-50 p-6 sm:p-8 md:p-10">
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
                rotate: [0, -10, 10, 0],
                y: [0, -15, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-4xl sm:text-5xl md:text-6xl"
            >
              ⚖️
            </motion.div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-[1.3] px-4 sm:px-6 md:px-8 break-words w-full max-w-7xl mx-auto py-3">
              {t('rn87_title')}
            </h1>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                y: [0, -15, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl"
            >
              📊
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-700 font-medium px-6 sm:px-8 md:px-12 lg:px-16 max-w-6xl mx-auto"
          >
            {t('rn87_subtitle')}
          </motion.p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          variants={seqContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div
            variants={seqItem}
            className="bg-gradient-to-br from-indigo-100 to-purple-100 p-10 sm:p-12 md:p-14 rounded-3xl shadow-2xl border-4 border-indigo-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
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
              <h2 className="text-3xl font-extrabold text-indigo-900">{t('rn87_intro_title')}</h2>
            </div>
            <div className="text-lg text-gray-700">
              <AnimatedWords text={t('rn87_intro_text')} />
            </div>
          </motion.div>

          {/* Method Selection Tabs */}
          <motion.div variants={seqItem} className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            <div className="flex flex-wrap justify-center gap-2">
              {[1, 2, 3, 4].map((method) => (
                <motion.button
                  key={method}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedMethod(method)}
                  className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                    selectedMethod === method
                      ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t(`rn87_method${method}_title`)}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Method Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMethod}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Method 1: Positive vs Positive */}
              {selectedMethod === 1 && (
                <motion.div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-3xl shadow-2xl border-4 border-green-300">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.span
                      animate={{
                        y: [0, -12, 0],
                        rotate: [0, 15, -15, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-5xl inline-block"
                    >
                      ➕
                    </motion.span>
                    <h3 className="text-3xl font-bold text-green-900">{t('rn87_method1_title')}</h3>
                  </div>

                  <div className="bg-white/70 p-6 rounded-2xl mb-6">
                    <div className="text-xl font-semibold text-green-800 mb-2">
                      <AnimatedWords text={t('rn87_method1_desc')} />
                    </div>
                    <div className="text-lg text-gray-700">
                      <AnimatedWords text={t('rn87_method1_rule')} />
                    </div>
                  </div>

                  <div className="bg-white/70 p-6 rounded-2xl">
                    <h4 className="text-2xl font-bold text-green-800 mb-4">{t('rn87_method1_ex_title')}</h4>
                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-r from-green-200 to-emerald-200 p-4 rounded-xl"
                      >
                        <div className="text-lg text-gray-800 font-semibold">
                          <AnimatedWords text={t('rn87_method1_ex1')} />
                        </div>
                        <div className="text-lg text-gray-700 mt-2">
                          <AnimatedWords text={t('rn87_method1_ex1_sol')} />
                        </div>
                      </motion.div>
                      <div className="mt-4">
                        <AnimatedNumberLine numerator={2} denominator={3} label="2/3" />
                        <div className="mt-2">
                          <AnimatedNumberLine numerator={3} denominator={4} label="3/4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Method 2: Negative vs Negative */}
              {selectedMethod === 2 && (
                <motion.div className="bg-gradient-to-br from-red-50 to-rose-100 p-8 rounded-3xl shadow-2xl border-4 border-red-300">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.span
                      animate={{
                        y: [0, -12, 0],
                        rotate: [0, -15, 15, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-5xl inline-block"
                    >
                      ➖
                    </motion.span>
                    <h3 className="text-3xl font-bold text-red-900">{t('rn87_method2_title')}</h3>
                  </div>

                  <div className="bg-white/70 p-6 rounded-2xl mb-6">
                    <div className="text-xl font-semibold text-red-800 mb-3">
                      <AnimatedWords text={t('rn87_method2_desc')} />
                    </div>
                  </div>

                  <div className="bg-white/70 p-6 rounded-2xl mb-6">
                    <h4 className="text-2xl font-bold text-red-800 mb-4">{t('rn87_method2_ex_title')}</h4>
                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-r from-red-200 to-pink-200 p-4 rounded-xl"
                      >
                        <div className="text-lg text-gray-800 font-semibold">
                          <AnimatedWords text={t('rn87_method2_ex1')} />
                        </div>
                        <div className="text-lg text-gray-700 mt-2">
                          ✓ <AnimatedWords text={t('rn87_method2_ex1_step1')} />
                        </div>
                        <div className="text-lg text-gray-700 mt-1">
                          ✓ <AnimatedWords text={t('rn87_method2_ex1_step2')} />
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-r from-orange-200 to-red-200 p-4 rounded-xl"
                      >
                        <div className="text-lg text-gray-800">
                          <AnimatedWords text={t('rn87_method2_ex2')} />
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-r from-pink-200 to-rose-200 p-4 rounded-xl"
                      >
                        <div className="text-lg text-gray-800">
                          <AnimatedWords text={t('rn87_method2_ex3')} />
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="bg-white/70 p-6 rounded-2xl">
                    <h4 className="text-2xl font-bold text-red-800 mb-3">{t('rn87_method2_numberline')}</h4>
                    <div className="text-lg text-gray-700 mb-2">
                      <AnimatedWords text={t('rn87_method2_numberline_text')} />
                    </div>
                    <div className="text-lg text-gray-700 mb-4">
                      <AnimatedWords text={t('rn87_method2_numberline_ex')} />
                    </div>
                    <div>
                      <AnimatedNumberLine numerator={-1} denominator={5} label="-1/5" />
                      <div className="mt-2">
                        <AnimatedNumberLine numerator={-1} denominator={2} label="-1/2" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Method 3: Negative vs Positive */}
              {selectedMethod === 3 && (
                <motion.div className="bg-gradient-to-br from-yellow-50 to-amber-100 p-8 rounded-3xl shadow-2xl border-4 border-yellow-300">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.span
                      animate={{
                        y: [0, -15, 0],
                        rotate: [0, 20, -20, 0],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-5xl inline-block"
                    >
                      ⚡
                    </motion.span>
                    <h3 className="text-3xl font-bold text-yellow-900">{t('rn87_method3_title')}</h3>
                  </div>

                  <div className="bg-white/70 p-6 rounded-2xl mb-6">
                    <div className="text-xl font-semibold text-yellow-800 mb-3">
                      <AnimatedWords text={t('rn87_method3_desc')} />
                    </div>
                  </div>

                  <div className="bg-white/70 p-6 rounded-2xl">
                    <h4 className="text-2xl font-bold text-yellow-800 mb-4">Example:</h4>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-r from-yellow-200 to-orange-200 p-4 rounded-xl mb-4"
                    >
                      <div className="text-lg text-gray-800 font-semibold">
                        <AnimatedWords text={t('rn87_method3_ex')} />
                      </div>
                    </motion.div>
                    <div>
                      <AnimatedNumberLine numerator={-2} denominator={7} label="-2/7" />
                      <div className="mt-2">
                        <AnimatedNumberLine numerator={1} denominator={2} label="1/2" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Method 4: Special Cases */}
              {selectedMethod === 4 && (
                <motion.div className="bg-gradient-to-br from-cyan-50 to-blue-100 p-8 rounded-3xl shadow-2xl border-4 border-cyan-300">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.span
                      animate={{
                        y: [0, -12, 0],
                        rotate: [0, 360],
                        scale: [1, 1.15, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-5xl inline-block"
                    >
                      🌟
                    </motion.span>
                    <h3 className="text-3xl font-bold text-cyan-900">{t('rn87_method4_title')}</h3>
                  </div>

                  <div className="bg-white/70 p-6 rounded-2xl mb-6">
                    <div className="text-xl font-semibold text-cyan-800 mb-2">
                      <AnimatedWords text={t('rn87_method4_desc')} />
                    </div>
                    <div className="text-lg text-gray-700">
                      <AnimatedWords text={t('rn87_method4_rule')} />
                    </div>
                  </div>

                  <div className="bg-white/70 p-6 rounded-2xl">
                    <h4 className="text-2xl font-bold text-cyan-800 mb-4">{t('rn87_method4_ex_title')}</h4>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-r from-cyan-200 to-blue-200 p-4 rounded-xl"
                    >
                      <div className="text-lg text-gray-800 font-semibold mb-2">
                        <AnimatedWords text={t('rn87_method4_ex1')} />
                      </div>
                      <div className="text-lg text-gray-700">
                        1. <AnimatedWords text={t('rn87_method4_ex1_step1')} />
                      </div>
                      <div className="text-lg text-gray-700 mt-1">
                        2. <AnimatedWords text={t('rn87_method4_ex1_step2')} />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div
            variants={seqItem}
            className="flex justify-between items-center gap-4 mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <span className="text-xl">←</span>
              {t('rn87_previous')}
            </motion.button>
            
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((dot) => (
                <motion.div
                  key={dot}
                  animate={{
                    scale: selectedMethod === dot ? 1.2 : 1,
                    opacity: selectedMethod === dot ? 1 : 0.5
                  }}
                  className={`w-3 h-3 rounded-full ${
                    selectedMethod === dot 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {t('rn87_next')}
              <span className="text-xl">→</span>
            </motion.button>
          </motion.div>

          {/* Quick Summary Table */}
          <motion.div
            variants={seqItem}
            className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-3xl shadow-2xl border-4 border-purple-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.span
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-5xl inline-block"
              >
                📋
              </motion.span>
              <h3 className="text-3xl font-bold text-purple-900">{t('rn87_summary_title')}</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-lg font-bold">{t('rn87_summary_type')}</th>
                    <th className="px-6 py-4 text-left text-lg font-bold">{t('rn87_summary_method')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <motion.tr whileHover={{ backgroundColor: '#f3f4f6' }} className="transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">{t('rn87_summary_row1_type')}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <AnimatedWords text={t('rn87_summary_row1_method')} />
                    </td>
                  </motion.tr>
                  <motion.tr whileHover={{ backgroundColor: '#f3f4f6' }} className="transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">{t('rn87_summary_row2_type')}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <AnimatedWords text={t('rn87_summary_row2_method')} />
                    </td>
                  </motion.tr>
                  <motion.tr whileHover={{ backgroundColor: '#f3f4f6' }} className="transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">{t('rn87_summary_row3_type')}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <AnimatedWords text={t('rn87_summary_row3_method')} />
                    </td>
                  </motion.tr>
                  <motion.tr whileHover={{ backgroundColor: '#f3f4f6' }} className="transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">{t('rn87_summary_row4_type')}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <AnimatedWords text={t('rn87_summary_row4_method')} />
                    </td>
                  </motion.tr>
                </tbody>
              </table>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mt-6 p-4 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-xl"
            >
              <div className="text-lg text-gray-800 font-semibold text-center">
                💡 <AnimatedWords text={t('rn87_summary_note')} />
              </div>
            </motion.div>
          </motion.div>

          {/* Interactive Comparison Tool */}
          <motion.div
            variants={seqItem}
            className="bg-gradient-to-br from-indigo-100 to-blue-100 p-8 rounded-3xl shadow-2xl border-4 border-indigo-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.span
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, -15, 15, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-5xl inline-block"
              >
                🎮
              </motion.span>
              <h3 className="text-3xl font-bold text-indigo-900">{t('rn87_interactive_title')}</h3>
            </div>
            <div className="text-lg text-gray-700 mb-6">
              <AnimatedWords text={t('rn87_interactive_subtitle')} />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/70 p-6 rounded-2xl">
                <h4 className="text-xl font-bold text-indigo-800 mb-4">First Number: {num1}/{den1}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Numerator</label>
                    <input
                      type="text"
                      value={num1}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || val === '-') {
                          setNum1(0);
                        } else {
                          const parsed = parseInt(val);
                          if (!isNaN(parsed)) {
                            setNum1(parsed);
                          }
                        }
                        setShowComparison(false);
                      }}
                      className="w-full px-4 py-3 text-lg font-bold rounded-xl border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none"
                      placeholder="Enter numerator"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Denominator</label>
                    <input
                      type="text"
                      value={den1}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || val === '-') {
                          setDen1(1);
                        } else {
                          const parsed = parseInt(val);
                          if (!isNaN(parsed) && parsed !== 0) {
                            setDen1(parsed);
                          }
                        }
                        setShowComparison(false);
                      }}
                      className="w-full px-4 py-3 text-lg font-bold rounded-xl border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none"
                      placeholder="Enter denominator"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 p-6 rounded-2xl">
                <h4 className="text-xl font-bold text-indigo-800 mb-4">Second Number: {num2}/{den2}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Numerator</label>
                    <input
                      type="text"
                      value={num2}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || val === '-') {
                          setNum2(0);
                        } else {
                          const parsed = parseInt(val);
                          if (!isNaN(parsed)) {
                            setNum2(parsed);
                          }
                        }
                        setShowComparison(false);
                      }}
                      className="w-full px-4 py-3 text-lg font-bold rounded-xl border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none"
                      placeholder="Enter numerator"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Denominator</label>
                    <input
                      type="text"
                      value={den2}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || val === '-') {
                          setDen2(1);
                        } else {
                          const parsed = parseInt(val);
                          if (!isNaN(parsed) && parsed !== 0) {
                            setDen2(parsed);
                          }
                        }
                        setShowComparison(false);
                      }}
                      className="w-full px-4 py-3 text-lg font-bold rounded-xl border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none"
                      placeholder="Enter denominator"
                    />
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCompare}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {t('rn87_compare_button')}
            </motion.button>

            <AnimatePresence>
              {showComparison && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mt-6 p-6 bg-gradient-to-r from-green-100 to-teal-100 rounded-2xl shadow-xl"
                >
                  <p className="text-2xl font-bold text-center text-gray-800">
                    {num1}/{den1} {' '}
                    <span className="text-3xl text-green-600">
                      {comparisonResult === 'greater' ? '>' : comparisonResult === 'less' ? '<' : '='}
                    </span>{' '}
                    {num2}/{den2}
                  </p>
                  <p className="text-lg text-center text-gray-700 mt-2">
                    {num1}/{den1} {' '}
                    {comparisonResult === 'greater' ? t('rn87_result_greater') : 
                     comparisonResult === 'less' ? t('rn87_result_less') : 
                     t('rn87_result_equal')} {' '}
                    {num2}/{den2}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
