import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedWords from '../../../components/AnimatedWords';
import AnimatedNumberLine from '../../../components/AnimatedNumberLine';

export default function RationalNumbersDemonstrationMode() {
  const { t } = useLanguage();
  const [selectedExample, setSelectedExample] = useState(0);

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

  const examples = [
    { num: 3, den: 8, type: 'positive', icon: '➕' },
    { num: -3, den: 5, type: 'negative', icon: '➖' },
    { num: 8, den: -3, type: 'negative', icon: '➖' },
    { num: -2, den: -9, type: 'positive', icon: '➕' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 via-pink-50 to-orange-50 p-6 sm:p-8 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, -2, 2, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-7xl mb-4"
          >
            ⚖️
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 leading-[1.3] px-6 sm:px-8 md:px-12 lg:px-16 break-words w-full max-w-7xl mx-auto py-3"
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              <AnimatedWords text={t('rn84_title')} />
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-700 text-lg sm:text-xl md:text-2xl font-medium px-6 sm:px-8 md:px-12 lg:px-16 max-w-6xl mx-auto"
          >
            {t('rn84_subtitle')}
          </motion.p>
        </motion.div>

        {/* Introduction Section */}
        <motion.article
          variants={seqContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Types of Rational Numbers Section */}
          <motion.div
            variants={seqItem}
            className="bg-white/90 backdrop-blur-sm p-10 sm:p-12 md:p-14 rounded-3xl shadow-2xl border-4 border-purple-300"
          >
            <div className="flex items-center gap-4 mb-6">
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
                {t('rn84_intro_title')}
              </h2>
            </div>

            <div className="text-lg text-gray-700 mb-6 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border-l-4 border-blue-500">
              <AnimatedWords text={t('rn84_intro_text')} />
            </div>
          </motion.div>

          {/* Positive Rational Numbers Section */}
          <motion.div
            variants={seqItem}
            className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-3xl shadow-2xl border-4 border-green-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-6xl"
              >
                ➕
              </motion.div>
              <h2 className="text-3xl font-extrabold text-green-800">
                {t('rn84_positive_title')}
              </h2>
            </div>

            <div className="text-xl text-gray-700 mb-4">
              <AnimatedWords text={t('rn84_positive_desc')} />
            </div>

            <div className="bg-white/60 p-6 rounded-2xl border-2 border-green-400 mb-6">
              <div className="text-lg font-bold text-gray-800 mb-3">
                <AnimatedWords text={t('rn84_positive_rule')} />
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-2xl">✓</span>
                <div className="text-lg">
                  <AnimatedWords text={t('rn84_positive_sign_rule')} />
                </div>
              </div>
            </div>

            <p className="text-lg font-semibold text-gray-800 mb-4">{t('rn84_positive_examples')}</p>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={seqContainer}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { text: t('rn84_positive_ex1'), num: 3, den: 8 },
                { text: t('rn84_positive_ex2'), num: 5, den: 7 },
                { text: t('rn84_positive_ex3'), num: 2, den: 9 }
              ].map((ex, idx) => (
                <motion.div
                  key={idx}
                  variants={seqItem}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white p-4 rounded-xl shadow-lg border-2 border-green-400"
                >
                  <p className="text-center text-2xl font-mono font-bold text-green-700 mb-2">
                    {ex.num}/{ex.den}
                  </p>
                  <p className="text-center text-sm text-gray-600">{ex.text}</p>
                  <div className="mt-3">
                    <AnimatedNumberLine numerator={ex.num} denominator={ex.den} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Negative Rational Numbers Section */}
          <motion.div
            variants={seqItem}
            className="bg-gradient-to-br from-red-50 to-pink-100 p-8 rounded-3xl shadow-2xl border-4 border-red-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, -360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-6xl"
              >
                ➖
              </motion.div>
              <h2 className="text-3xl font-extrabold text-red-800">
                {t('rn84_negative_title')}
              </h2>
            </div>

            <div className="text-xl text-gray-700 mb-4">
              <AnimatedWords text={t('rn84_negative_desc')} />
            </div>

            <div className="bg-white/60 p-6 rounded-2xl border-2 border-red-400 mb-6">
              <div className="text-lg font-bold text-gray-800 mb-3">
                <AnimatedWords text={t('rn84_negative_rule')} />
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-2xl">✓</span>
                <div className="text-lg">
                  <AnimatedWords text={t('rn84_negative_sign_rule')} />
                </div>
              </div>
            </div>

            <p className="text-lg font-semibold text-gray-800 mb-4">{t('rn84_negative_examples')}</p>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={seqContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {[
                { text: t('rn84_negative_ex1'), num: -3, den: 5 },
                { text: t('rn84_negative_ex2'), num: -5, den: 7 },
                { text: t('rn84_negative_ex3'), num: 3, den: -8 }
              ].map((ex, idx) => (
                <motion.div
                  key={idx}
                  variants={seqItem}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white p-4 rounded-xl shadow-lg border-2 border-red-400"
                >
                  <p className="text-center text-2xl font-mono font-bold text-red-700 mb-2">
                    {ex.num}/{ex.den}
                  </p>
                  <p className="text-center text-sm text-gray-600">{ex.text}</p>
                  <div className="mt-3">
                    <AnimatedNumberLine numerator={ex.num} denominator={ex.den} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Understanding Section */}
          <motion.div
            variants={seqItem}
            className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-4 border-indigo-300"
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
                💡
              </motion.div>
              <h2 className="text-3xl font-extrabold text-gray-800">
                {t('rn84_understanding_title')}
              </h2>
            </div>

            <motion.div
              variants={seqContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {[
                t('rn84_understanding_point1'),
                t('rn84_understanding_point2'),
                t('rn84_understanding_point3')
              ].map((point, idx) => (
                <motion.div
                  key={idx}
                  variants={seqItem}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-5 shadow-lg border-l-4 border-indigo-500"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💭</span>
                    <div className="text-lg text-gray-800">
                      <AnimatedWords text={point} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Special Cases Section */}
          <motion.div
            variants={seqItem}
            className="bg-gradient-to-br from-yellow-50 to-amber-100 p-8 rounded-3xl shadow-2xl border-4 border-yellow-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-5xl"
              >
                ⚠️
              </motion.div>
              <h2 className="text-3xl font-extrabold text-yellow-800">
                {t('rn84_special_title')}
              </h2>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={seqContainer}
              className="space-y-4"
            >
              <motion.div
                variants={seqItem}
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-white p-6 rounded-2xl shadow-lg border-2 border-yellow-400"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">1️⃣</span>
                  <div className="text-lg text-gray-800 font-semibold">
                    <AnimatedWords text={t('rn84_special_case1')} />
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 p-4 bg-yellow-50 rounded-xl"
                >
                  <p className="text-center font-mono text-2xl text-yellow-800">
                    -3/-5 = 3/5
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                variants={seqItem}
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-white p-6 rounded-2xl shadow-lg border-2 border-yellow-400"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">2️⃣</span>
                  <div className="text-lg text-gray-800 font-semibold">
                    <AnimatedWords text={t('rn84_special_case2')} />
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 p-4 bg-yellow-50 rounded-xl"
                >
                  <p className="text-center font-mono text-2xl text-yellow-800">
                    {t('rn84_zero_neither')}
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                variants={seqItem}
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-2xl shadow-lg border-2 border-orange-400"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🎯</span>
                  <div className="text-xl font-bold text-gray-800">
                    <AnimatedWords text={t('rn84_special_rule')} />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Quick Check Section */}
          <motion.div
            variants={seqItem}
            className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-4 border-teal-300"
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
                ✅
              </motion.div>
              <h2 className="text-3xl font-extrabold text-gray-800">
                {t('rn84_quickcheck_title')}
              </h2>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={seqContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
            >
              {[
                { q: t('rn84_quickcheck_q1'), a: t('rn84_quickcheck_a1'), color: 'green' },
                { q: t('rn84_quickcheck_q2'), a: t('rn84_quickcheck_a2'), color: 'red' },
                { q: t('rn84_quickcheck_q3'), a: t('rn84_quickcheck_a3'), color: 'red' },
                { q: t('rn84_quickcheck_q4'), a: t('rn84_quickcheck_a4'), color: 'green' },
                { q: t('rn84_quickcheck_q5'), a: t('rn84_quickcheck_a5'), color: 'gray' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={seqItem}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-${item.color}-50 p-4 rounded-xl shadow-lg border-2 border-${item.color}-300`}
                >
                  <p className="text-center text-2xl font-mono font-bold text-gray-800 mb-2">
                    {item.q}
                  </p>
                  <p className="text-center text-sm font-semibold text-gray-600">
                    {item.a}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Interactive Examples Section */}
          <motion.div
            variants={seqItem}
            className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-3xl shadow-2xl border-4 border-purple-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="text-5xl"
              >
                🔄
              </motion.div>
              <h2 className="text-3xl font-extrabold text-gray-800">
                {t('rn84_interactive_title')}
              </h2>
            </div>

            <div className="text-lg text-gray-700 mb-6">
              <AnimatedWords text={t('rn84_interactive_subtitle')} />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-3 mb-6"
            >
              {examples.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedExample(idx)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-4 h-4 rounded-full transition-all ${
                    idx === selectedExample
                      ? 'bg-purple-500 w-12'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedExample}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className={`p-8 rounded-2xl shadow-xl ${
                  examples[selectedExample].type === 'positive'
                    ? 'bg-gradient-to-br from-green-100 to-emerald-200 border-4 border-green-400'
                    : 'bg-gradient-to-br from-red-100 to-pink-200 border-4 border-red-400'
                }`}
              >
                <div className="text-center mb-6">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-7xl mb-4"
                  >
                    {examples[selectedExample].icon}
                  </motion.div>
                  
                  <p className="text-5xl font-mono font-bold mb-4">
                    {examples[selectedExample].num}/{examples[selectedExample].den}
                  </p>
                  
                  <p className="text-2xl font-bold mb-2">
                    {examples[selectedExample].type === 'positive' ? 
                      t('rn84_positive_title') : 
                      t('rn84_negative_title')
                    }
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl mb-6">
                  <p className="text-lg font-semibold mb-2">{t('rn84_visual_representation')}</p>
                  <AnimatedNumberLine 
                    numerator={examples[selectedExample].num} 
                    denominator={examples[selectedExample].den} 
                  />
                </div>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={seqContainer}
                  className="grid grid-cols-2 gap-4 text-center"
                >
                  <motion.div variants={seqItem} className="bg-white p-4 rounded-xl">
                    <p className="font-semibold text-gray-700">{t('rn84_numerator')}</p>
                    <p className="text-3xl font-mono font-bold">
                      {examples[selectedExample].num}
                    </p>
                  </motion.div>
                  <motion.div variants={seqItem} className="bg-white p-4 rounded-xl">
                    <p className="font-semibold text-gray-700">{t('rn84_denominator')}</p>
                    <p className="text-3xl font-mono font-bold">
                      {examples[selectedExample].den}
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex justify-between">
              <motion.button
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedExample(Math.max(0, selectedExample - 1))}
                disabled={selectedExample === 0}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                ← {t('previous')}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedExample(Math.min(examples.length - 1, selectedExample + 1))}
                disabled={selectedExample === examples.length - 1}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {t('next')} →
              </motion.button>
            </div>
          </motion.div>
        </motion.article>
      </div>
    </div>
  );
}
