import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedWords from '../../../components/AnimatedWords';
import AnimatedNumberLine from '../../../components/AnimatedNumberLine';

export default function RationalNumbersDemonstrationMode() {
  const { t } = useLanguage();


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

        {/* Topic 8.2 Section */}
        <Topic82Section />
      </div>
    </div>
  );
}

function Topic82Section() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }}
      className="space-y-8"
    >
      <motion.article
        variants={{ hidden: { opacity: 0, scale: 0.98, y: 10 }, visible: { opacity: 1, scale: 1, y: 0 } }}
        className="bg-white/90 backdrop-blur-sm p-10 sm:p-12 md:p-14 rounded-3xl shadow-2xl border-4 border-orange-300"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4 mb-6"
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 15, -15, 0]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-6xl"
          >
            🌊
          </motion.div>
          <h2 className="text-3xl font-extrabold text-gray-800">{t('rn_needTitle')}</h2>
        </motion.div>

        <p className="text-gray-700 leading-relaxed text-xl mb-8 font-medium">
          {t('rn_insufficient')}
        </p>

        {/* Opposite Situations with Bouncing Icons */}
        <motion.div
          variants={{ hidden: { opacity: 0, x: -25 }, visible: { opacity: 1, x: 0 } }}
          className="bg-gradient-to-r from-orange-100 via-red-100 to-pink-100 p-6 rounded-2xl border-4 border-orange-400 shadow-xl mb-6"
        >
          <div className="flex items-start gap-4">
            <motion.div
              animate={{
                y: [0, -12, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-5xl"
            >
              📏
            </motion.div>
            <div>
              <h4 className="text-2xl font-bold mb-3 text-gray-800">{t('rn_oppositeIntegers')}</h4>
          <AnimatedWords
            text={t('rn_oppositeIntegersDesc')}
            className="text-gray-700 text-lg"
            startDelay={0.1}
            wordDelay={0.035}
            wrapperClassName="block"
          />
            </div>
          </div>
        </motion.div>

        {/* Sea Level Example with Enhanced Animation */}
        <motion.div
          variants={{ hidden: { opacity: 0, x: -25 }, visible: { opacity: 1, x: 0 } }}
          className="bg-gradient-to-r from-blue-100 via-cyan-100 to-indigo-100 p-6 rounded-2xl border-4 border-blue-400 shadow-xl mb-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
              className="text-6xl"
            >
              🌊
            </motion.div>
            <div>
              <h4 className="text-2xl font-bold mb-3 text-gray-800">{t('rn_oppositeFractions')}</h4>
              <AnimatedWords
                text={t('rn_oppositeFractionsDesc')}
                className="text-gray-700 text-lg mb-4"
                startDelay={0.1}
                wordDelay={0.035}
                wrapperClassName="block"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -60, rotate: -10 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-4 border-green-400 shadow-xl"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="text-4xl mb-3 text-center"
              >
                ⬆️
              </motion.div>
              <div className="text-green-600 font-bold text-xl mb-2 text-center">{t('rn_aboveSeaLevel')}</div>
              <div className="text-4xl font-extrabold text-green-600 text-center font-mono">{t('rn_threeFourthsKm')}</div>
              <div className="text-sm text-gray-600 mt-2 text-center">{t('rn_exampleAbove')}</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 60, rotate: 10 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-4 border-red-400 shadow-xl"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="text-4xl mb-3 text-center"
              >
                ⬇️
              </motion.div>
              <div className="text-red-600 font-bold text-xl mb-2 text-center">{t('rn_belowSeaLevel')}</div>
              <div className="text-4xl font-extrabold text-red-600 text-center font-mono">{t('rn_negThreeFourthsKm')}</div>
              <div className="text-sm text-gray-600 mt-2 text-center">{t('rn_exampleBelow')}</div>
            </motion.div>
          </div>
          {/* Integrated number line visualization within the same section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border-4 border-indigo-200 shadow-lg"
          >
            <AnimatedNumberLine numerator={-3} denominator={4} label={t('rn_seaLevelNumberLine')} />
          </motion.div>
        </motion.div>

        {/* The Gap with Pulsing Icon */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: -25 }, visible: { opacity: 1, y: 0 } }}
          className="bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 p-6 rounded-2xl border-4 border-purple-400 shadow-xl mb-6"
        >
          <div className="flex items-start gap-4">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-5xl"
            >
              ⚠️
            </motion.div>
            <div>
              <h4 className="text-2xl font-bold mb-3 text-gray-800">{t('rn_gapTitle')}</h4>
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border-4 border-red-300 shadow-lg mt-4">
                <p className="text-gray-800 text-lg font-semibold">
                  <span className="text-red-600">❗</span> <strong className="text-red-600">{t('rn_gapDesc')}</strong>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Conclusion with Celebratory Animation */}
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1 } }}
          className="bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 p-8 rounded-2xl border-4 border-green-400 shadow-2xl"
        >
          <div className="flex items-center justify-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-4 px-6 sm:px-8 md:px-12 lg:px-16 w-full max-w-7xl mx-auto">
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360]
              }}
              transition={{
                y: { duration: 1.5, repeat: Infinity },
                rotate: { duration: 3, repeat: Infinity, ease: "linear" }
              }}
              className="text-7xl"
            >
              ✨
            </motion.div>
            <h4 className="text-3xl font-extrabold text-gray-800">{t('rn_conclusion')}</h4>
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, -360]
              }}
              transition={{
                y: { duration: 1.5, repeat: Infinity, delay: 0.3 },
                rotate: { duration: 3, repeat: Infinity, ease: "linear" }
              }}
              className="text-7xl"
            >
              ✨
            </motion.div>
          </div>
          <p className="text-gray-800 text-2xl text-center font-bold">{t('rn_conclusionText')}</p>
        </motion.div>

        
      </motion.article>
    </motion.div>
  );
}
