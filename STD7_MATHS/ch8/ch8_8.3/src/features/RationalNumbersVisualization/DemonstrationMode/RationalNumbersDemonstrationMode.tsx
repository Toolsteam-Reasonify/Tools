import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedWords from '../../../components/AnimatedWords';
import AnimatedNumberLine from '../../../components/AnimatedNumberLine';

export default function RationalNumbersDemonstrationMode() {
  const { t } = useLanguage();
  const [selectedExample, setSelectedExample] = useState<number | null>(null);

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

  // Example categories for Topic 8.3
  const exampleCategories = [
    {
      type: t('rn83_fractions'),
      icon: '🧮',
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-100 via-cyan-50 to-blue-100',
      examples: ['3/8', '4/8', '1/2', '2/3'],
      description: t('rn83_fractions_examples'),
      num: 1,
      den: 2
    },
    {
      type: t('rn83_decimals'),
      icon: '🔢',
      color: 'from-cyan-500 to-teal-500',
      bgGradient: 'from-cyan-100 via-teal-50 to-cyan-100',
      examples: ['0.5', '2.3', '0.333'],
      description: t('rn83_decimals_examples'),
      num: 5,
      den: 10
    },
    {
      type: t('rn83_integers'),
      icon: '⚡',
      color: 'from-teal-500 to-green-500',
      bgGradient: 'from-teal-100 via-green-50 to-teal-100',
      examples: ['-5', '0', '3'],
      description: t('rn83_integers_examples'),
      num: 3,
      den: 1
    },
    {
      type: t('rn83_negative_fractions'),
      icon: '➖',
      color: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-100 via-emerald-50 to-green-100',
      examples: ['-3/4', '-2/3'],
      description: t('rn83_negative_fractions_examples'),
      num: -3,
      den: 4
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 via-pink-50 to-purple-50 p-6 sm:p-8 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Animated Header with Bouncing Books */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8 relative"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={seqContainer}
            className="flex items-center justify-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-4 px-6 sm:px-8 md:px-12 lg:px-16 w-full max-w-7xl mx-auto"
          >
            {/* Left Side: Stacked Books with Jumping Animation */}
            <motion.div
              variants={seqItem}
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
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14">
                {/* Bottom book (light blue) */}
                <div className="absolute bottom-0 left-0 w-8 h-3 sm:w-10 sm:h-4 md:w-12 md:h-4 bg-blue-400 rounded-sm transform rotate-[-2deg] shadow-md"></div>
                {/* Middle book (red/pink) */}
                <div className="absolute bottom-2.5 left-0.5 sm:bottom-3 sm:left-0.5 md:bottom-4 md:left-1 w-8 h-3 sm:w-10 sm:h-4 md:w-12 md:h-4 bg-red-400 rounded-sm transform rotate-[3deg] shadow-md"></div>
                {/* Top book (green) */}
                <div className="absolute bottom-5 left-0 sm:bottom-6 md:bottom-8 w-8 h-3 sm:w-10 sm:h-4 md:w-12 md:h-4 bg-green-400 rounded-sm transform rotate-[-1deg] shadow-md"></div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={seqItem}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent leading-[1.3] px-6 sm:px-8 md:px-12 lg:px-16 py-3 break-words w-full max-w-7xl mx-auto"
            >
              <AnimatedWords text={t('rn83_title')} />
            </motion.h1>

            {/* Right Side: Stacked Books */}
            <motion.div
              variants={seqItem}
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
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14">
                <div className="absolute bottom-0 left-0 w-8 h-3 sm:w-10 sm:h-4 md:w-12 md:h-4 bg-purple-400 rounded-sm transform rotate-[2deg] shadow-md"></div>
                <div className="absolute bottom-2.5 left-0.5 sm:bottom-3 sm:left-0.5 md:bottom-4 md:left-1 w-8 h-3 sm:w-10 sm:h-4 md:w-12 md:h-4 bg-yellow-400 rounded-sm transform rotate-[-3deg] shadow-md"></div>
                <div className="absolute bottom-5 left-0 sm:bottom-6 md:bottom-8 w-8 h-3 sm:w-10 sm:h-4 md:w-12 md:h-4 bg-pink-400 rounded-sm transform rotate-[1deg] shadow-md"></div>
              </div>
            </motion.div>
          </motion.div>

          <motion.p
            variants={seqItem}
            className="text-lg sm:text-xl md:text-2xl text-gray-700 font-medium px-6 sm:px-8 md:px-12 lg:px-16 max-w-6xl mx-auto"
          >
            {t('rn83_subtitle')}
          </motion.p>
        </motion.div>

        {/* Definition Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={seqContainer}
          className="mb-12"
        >
          <motion.div
            variants={seqItem}
            className="bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 rounded-3xl p-10 sm:p-12 md:p-14 shadow-xl border-4 border-white/50"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={seqContainer}
              className="flex items-center gap-3 mb-6"
            >
              <motion.span
                variants={seqItem}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-5xl"
              >
                📖
              </motion.span>
              <motion.h2 variants={seqItem} className="text-3xl font-extrabold text-gray-800">
                {t('rn83_definition_title')}
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={seqContainer}
              className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500"
            >
              <div className="text-lg text-gray-800 font-medium leading-relaxed">
                <AnimatedWords text={t('rn83_definition_text')} />
              </div>
              
              <motion.div
                variants={seqItem}
                className="mt-6 flex items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: [1, 1.05, 1] 
                  }}
                  transition={{ 
                    opacity: { duration: 0.5 },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                  className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  p/q
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Components Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={seqContainer}
          className="mb-12"
        >
          <motion.div variants={seqItem} className="mb-6 flex items-center justify-center gap-3">
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-4xl"
            >
              🔧
            </motion.span>
            <h2 className="text-3xl font-extrabold text-gray-800">
              {t('rn83_components_title')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Numerator */}
            <motion.div
              variants={seqItem}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="text-4xl"
                >
                  ⬆️
                </motion.span>
                <h3 className="text-2xl font-bold">{t('rn83_numerator')}</h3>
              </div>
              <div className="text-lg opacity-90">
                <AnimatedWords text={t('rn83_numerator_desc')} />
              </div>
              <div className="mt-4 flex items-center justify-center">
                <div className="text-5xl font-bold border-t-4 border-white/50 pt-2">
                  p
                </div>
              </div>
            </motion.div>

            {/* Denominator */}
            <motion.div
              variants={seqItem}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.span
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="text-4xl"
                >
                  ⬇️
                </motion.span>
                <h3 className="text-2xl font-bold">{t('rn83_denominator')}</h3>
              </div>
              <div className="text-lg opacity-90">
                <AnimatedWords text={t('rn83_denominator_desc')} />
              </div>
              <div className="mt-4 flex items-center justify-center">
                <div className="text-5xl font-bold">
                  <div className="border-t-4 border-white/50 pt-2">q</div>
                  <div className="text-sm mt-2 font-normal">q ≠ 0</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Examples Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={seqContainer}
          className="mb-12"
        >
          <motion.div variants={seqItem} className="mb-6 flex items-center justify-center gap-3">
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-4xl"
            >
              💡
            </motion.span>
            <h2 className="text-3xl font-extrabold text-gray-800">
              {t('rn83_examples_title')}
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={seqContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {exampleCategories.map((category, idx) => (
              <motion.div
                key={idx}
                variants={seqItem}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedExample(selectedExample === idx ? null : idx)}
                className={`cursor-pointer bg-gradient-to-br ${category.bgGradient} rounded-2xl p-6 shadow-xl border-2 ${
                  selectedExample === idx ? 'border-purple-500 ring-4 ring-purple-200' : 'border-white/50'
                } transition-all`}
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={seqContainer}
                  className="flex items-center gap-3 mb-4"
                >
                  <motion.span
                    variants={seqItem}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
                    className="text-4xl"
                  >
                    {category.icon}
                  </motion.span>
                  <motion.h3 variants={seqItem} className="text-2xl font-bold text-gray-800">{category.type}</motion.h3>
                </motion.div>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={seqContainer}
                  className="flex flex-wrap gap-2 mb-4"
                >
                  {category.examples.map((ex, i) => (
                    <motion.span
                      key={i}
                      variants={seqItem}
                      className="bg-white px-3 py-1 rounded-lg text-lg font-semibold text-gray-700 shadow-md"
                    >
                      {ex}
                    </motion.span>
                  ))}
                </motion.div>

                <div className="text-gray-700 font-medium text-sm">
                  <AnimatedWords text={category.description} />
                </div>

                <AnimatePresence>
                  {selectedExample === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <div className="bg-white rounded-xl p-4 shadow-inner">
                        <AnimatedNumberLine
                          numerator={category.num}
                          denominator={category.den}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Important Facts Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={seqContainer}
          className="mb-12"
        >
          <motion.div variants={seqItem} className="mb-6 flex items-center justify-center gap-3">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl"
            >
              ⭐
            </motion.span>
            <h2 className="text-3xl font-extrabold text-gray-800">
              {t('rn83_important_facts')}
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={seqContainer}
            className="grid gap-4"
          >
            {[t('rn83_fact1'), t('rn83_fact2'), t('rn83_fact3')].map((fact, idx) => (
              <motion.div
                key={idx}
                variants={seqItem}
                whileHover={{ scale: 1.02, x: 10 }}
                animate={{ 
                  opacity: [1, 0.85, 1],
                  boxShadow: [
                    '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    '0 20px 25px -5px rgba(16, 185, 129, 0.3)',
                    '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  ]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  delay: idx * 0.8,
                  ease: "easeInOut"
                }}
                className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-5 shadow-lg border-l-4 border-green-500"
              >
                <div className="flex items-center gap-3">
                  <motion.span 
                    className="text-3xl"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity, 
                      delay: idx * 0.8,
                      ease: "easeInOut"
                    }}
                  >
                    ✓
                  </motion.span>
                  <p className="text-lg font-semibold text-gray-800">{fact}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Equivalent Rational Numbers Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={seqContainer}
          className="mb-12"
        >
          <motion.div
            variants={seqItem}
            className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl p-8 shadow-xl border-4 border-white/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl"
              >
                🔄
              </motion.span>
              <h2 className="text-3xl font-extrabold text-gray-800">
                {t('rn83_equivalent')}
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg mb-4"
            >
              <div className="text-lg text-gray-800 font-medium mb-4">
                <AnimatedWords text={t('rn83_equivalent_rule')} />
              </div>
              
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl font-bold text-purple-600"
                >
                  -2/3
                </motion.div>
                <span className="text-2xl text-gray-400">=</span>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  className="text-3xl font-bold text-pink-600"
                >
                  -4/6
                </motion.div>
                <span className="text-2xl text-gray-400">=</span>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                  className="text-3xl font-bold text-orange-600"
                >
                  10/-15
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg"
            >
              <div className="text-gray-700 italic">
                <AnimatedWords text={t('rn83_equivalent_example')} />
              </div>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
