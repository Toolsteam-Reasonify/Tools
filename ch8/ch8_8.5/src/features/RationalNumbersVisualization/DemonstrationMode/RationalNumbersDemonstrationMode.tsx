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

  // Examples for number line visualization
  const numberLineExamples = [
    { num: -1, den: 2, label: '-1/2', position: 'between 0 and -1' },
    { num: 1, den: 2, label: '1/2', position: 'between 0 and 1' },
    { num: -3, den: 2, label: '-3/2', position: 'between -1 and -2' },
    { num: 3, den: 2, label: '3/2', position: 'between 1 and 2' },
    { num: -1, den: 3, label: '-1/3', position: 'left of 0' }
  ];

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
              {t('rn85_main_title')}
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

        {/* Topic 8.5: Rational Numbers on a Number Line */}
        <motion.div
          variants={seqContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Introduction Section */}
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
                📐
              </motion.div>
              <h2 className="text-3xl font-extrabold text-blue-900">
                {t('rn85_title')}
              </h2>
            </div>

            <div className="bg-white/60 p-6 rounded-2xl mb-6">
              <h3 className="text-2xl font-bold text-blue-800 mb-3">{t('rn85_intro_title')}</h3>
              <div className="text-lg text-gray-700">
                <AnimatedWords text={t('rn85_intro_text')} />
              </div>
            </div>

            {/* Key Rules for Placement */}
            <div className="bg-white/60 p-6 rounded-2xl mb-6">
              <h3 className="text-2xl font-bold text-blue-800 mb-3">{t('rn85_placement_title')}</h3>
              <div className="text-lg font-semibold text-gray-800 mb-4">
                <AnimatedWords text={t('rn85_placement_subtitle')} />
              </div>
              
              <div className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-l-4 border-green-500"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">➡️</span>
                    <div className="text-lg text-gray-800">
                      <AnimatedWords text={t('rn85_positive_right')} />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="bg-gradient-to-r from-red-100 to-pink-100 rounded-xl p-4 border-l-4 border-red-500"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⬅️</span>
                    <div className="text-lg text-gray-800">
                      <AnimatedWords text={t('rn85_negative_left')} />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl p-4 border-l-4 border-yellow-500"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    <div className="text-lg text-gray-800">
                      <AnimatedWords text={t('rn85_zero_center')} />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Important Properties */}
            <div className="bg-white/60 p-6 rounded-2xl mb-6">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">{t('rn85_properties_title')}</h3>
              
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-5 mb-4">
                <h4 className="text-xl font-bold text-purple-800 mb-2">{t('rn85_equal_distance_title')}</h4>
                <div className="text-lg text-gray-700 mb-2">
                  <AnimatedWords text={t('rn85_equal_distance_text')} />
                </div>
                <div className="text-md text-gray-600">
                  <AnimatedWords text={t('rn85_equal_distance_ex')} />
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-100 to-teal-100 rounded-xl p-5">
                <h4 className="text-xl font-bold text-cyan-800 mb-3">{t('rn85_marking_title')}</h4>
                <div className="space-y-2">
                  <div className="text-lg text-gray-700">
                    • <AnimatedWords text={t('rn85_marking_ex1')} />
                  </div>
                  <div className="text-lg text-gray-700">
                    • <AnimatedWords text={t('rn85_marking_ex2')} />
                  </div>
                  <div className="text-lg text-gray-700">
                    • <AnimatedWords text={t('rn85_marking_ex3')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Number Line */}
            <div className="bg-white/60 p-6 rounded-2xl">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">{t('rn85_interactive_title')}</h3>
              <div className="text-md text-gray-600 mb-4">
                <AnimatedWords text={t('rn85_interactive_subtitle')} />
              </div>

              <div className="flex justify-center gap-2 mb-6 flex-wrap">
                {numberLineExamples.map((ex, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedExample(idx)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      selectedExample === idx
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {ex.label}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedExample}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-2xl shadow-lg"
                >
                  <AnimatedNumberLine
                    numerator={numberLineExamples[selectedExample].num}
                    denominator={numberLineExamples[selectedExample].den}
                    label={numberLineExamples[selectedExample].label}
                  />
                  <div className="text-center text-lg text-gray-700 mt-4 font-semibold">
                    <AnimatedWords text={numberLineExamples[selectedExample].position} />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="mt-6 flex justify-between items-center">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedExample(prev => prev > 0 ? prev - 1 : numberLineExamples.length - 1)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {t('previous')}
                </motion.button>

                <div className="text-sm font-semibold text-gray-600">
                  {selectedExample + 1} / {numberLineExamples.length}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedExample(prev => prev < numberLineExamples.length - 1 ? prev + 1 : 0)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {t('next')}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
