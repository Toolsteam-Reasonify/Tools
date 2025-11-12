import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedWords from '../../../components/AnimatedWords';
import AnimatedNumberLine from '../../../components/AnimatedNumberLine';

export default function RationalNumbersDemonstrationMode() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<0 | 1 | 2 | 3>(0);
  
  // Interactive calculator state
  const [num1, setNum1] = useState(2);
  const [den1, setDen1] = useState(3);
  const [num2, setNum2] = useState(1);
  const [den2, setDen2] = useState(4);
  const [showResult, setShowResult] = useState(false);

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

  // Helper functions
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
    return Math.abs(a * b) / gcd(a, b);
  };

  const simplify = (num: number, den: number): { num: number; den: number } => {
    const g = gcd(num, den);
    return { num: num / g, den: den / g };
  };

  // Calculate result based on operation
  const calculateResult = (operation: 'add' | 'subtract' | 'multiply' | 'divide') => {
    let resultNum = 0;
    let resultDen = 1;
    let commonDen = 1;
    let convertedNum1 = num1;
    let convertedNum2 = num2;

    switch (operation) {
      case 'add':
      case 'subtract':
        commonDen = lcm(Math.abs(den1), Math.abs(den2));
        convertedNum1 = num1 * (commonDen / den1);
        convertedNum2 = num2 * (commonDen / den2);
        if (operation === 'add') {
          resultNum = convertedNum1 + convertedNum2;
        } else {
          resultNum = convertedNum1 - convertedNum2;
        }
        resultDen = commonDen;
        break;
      case 'multiply':
        resultNum = num1 * num2;
        resultDen = den1 * den2;
        break;
      case 'divide':
        resultNum = num1 * den2;
        resultDen = den1 * num2;
        break;
    }

    const simplified = simplify(resultNum, resultDen);
    return { 
      resultNum, 
      resultDen, 
      simplified, 
      commonDen,
      convertedNum1,
      convertedNum2
    };
  };

  const handleCalculate = () => {
    setShowResult(true);
  };

  const handleNext = () => {
    if (activeTab < 3) {
      setActiveTab((activeTab + 1) as 0 | 1 | 2 | 3);
      setShowResult(false);
    }
  };

  const handlePrev = () => {
    if (activeTab > 0) {
      setActiveTab((activeTab - 1) as 0 | 1 | 2 | 3);
      setShowResult(false);
    }
  };

  const tabs = [
    { id: 0, title: t('rn89_addition_title'), operation: 'add' as const, icon: '➕', color: 'from-green-500 to-emerald-500' },
    { id: 1, title: t('rn89_subtraction_title'), operation: 'subtract' as const, icon: '➖', color: 'from-orange-500 to-red-500' },
    { id: 2, title: t('rn89_multiplication_title'), operation: 'multiply' as const, icon: '✖️', color: 'from-purple-500 to-indigo-500' },
    { id: 3, title: t('rn89_division_title'), operation: 'divide' as const, icon: '➗', color: 'from-pink-500 to-rose-500' },
  ];

  const currentOperation = tabs[activeTab].operation;
  const result = showResult ? calculateResult(currentOperation) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 pb-20">
      <div className="max-w-7xl mx-auto p-6 sm:p-8 md:p-10">
        {/* Animated Header with Icon and Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 relative"
        >
          <div className="flex items-center justify-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-4 px-6 sm:px-8 md:px-12 lg:px-16 w-full max-w-7xl mx-auto">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            >
              ⚙️
            </motion.div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-[1.3] px-4 sm:px-6 md:px-8 break-words w-full max-w-7xl mx-auto py-3">
              {t('rn89_title')}
            </h1>
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: 0.3
              }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            >
              ⚙️
            </motion.div>
          </div>
        </motion.div>

        {/* Key Concept Section */}
        <motion.div
          variants={seqContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6 mb-8"
        >
          <motion.div
            variants={seqItem}
            className="bg-gradient-to-br from-blue-100 to-cyan-100 p-8 rounded-3xl shadow-2xl border-4 border-blue-300"
          >
            <div className="flex items-center gap-4 mb-4">
          <motion.div
            animate={{
                  y: [0, -12, 0],
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1],
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
              <h2 className="text-3xl font-extrabold text-blue-900">{t('rn89_key_concept')}</h2>
            </div>
            <div className="text-lg text-gray-800 leading-relaxed">
              <AnimatedWords text={t('rn89_key_concept_text')} />
            </div>
          </motion.div>
        </motion.div>

        {/* Operation Tabs */}
        <motion.div
          variants={seqContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={seqItem} className="flex flex-wrap justify-center gap-3 mb-8">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as 0 | 1 | 2 | 3);
                  setShowResult(false);
                }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center gap-3 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white scale-105 shadow-2xl`
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300'
                }`}
              >
                <span className="text-2xl">{tab.icon}</span>
                {tab.title}
              </motion.button>
            ))}
          </motion.div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Addition Content */}
              {activeTab === 0 && (
                <motion.section
                  initial="hidden"
                  animate="visible"
                  variants={seqContainer}
                  className="space-y-6"
                >
                  {/* Addition Title */}
                <motion.div
                    variants={seqItem}
                    className="flex items-center justify-center gap-4 mb-6"
                  >
                    <motion.span
                  animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                      className="text-6xl"
                    >
                      ➕
                    </motion.span>
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {t('rn89_addition_title')}
                    </h2>
                  </motion.div>

                  {/* Same Denominators */}
                <motion.div
                    variants={seqItem}
                    className="bg-gradient-to-br from-green-100 via-emerald-50 to-green-100 rounded-3xl p-8 shadow-xl border-4 border-green-400"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">✅</span>
                      <h3 className="text-2xl font-bold text-green-900">📌 {t('rn89_addition_same_rule')}</h3>
                    </div>
                    <div className="bg-white/80 rounded-xl p-5 mb-4">
                      <div className="text-lg font-semibold text-gray-800 mb-3">{t('rn89_example')}</div>
                      <p className="text-xl font-mono text-gray-900 mb-4">
                        7/3 + (−5/3) = (7−5)/3 = 2/3
                      </p>
                      <div className="space-y-2 text-lg text-gray-800 bg-gray-50 rounded-lg p-4">
                        <div><strong>{t('rn89_step1')}</strong> <AnimatedWords text={t('rn89_add_same_step1')} /></div>
                        <div><strong>{t('rn89_step2')}</strong> <AnimatedWords text={t('rn89_add_same_step2')} /></div>
                        <div><strong>{t('rn89_step3')}</strong> <AnimatedWords text={t('rn89_add_same_step3')} /></div>
                      </div>
                    </div>
                    <AnimatedNumberLine numerator={2} denominator={3} label={`${t('rn89_result')} 2/3`} />
                  </motion.div>

                  {/* Different Denominators */}
                <motion.div
                    variants={seqItem}
                    className="bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-100 rounded-3xl p-8 shadow-xl border-4 border-blue-400"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">🔄</span>
                      <h3 className="text-2xl font-bold text-blue-900">📌 {t('rn89_addition_diff_rule')}</h3>
                    </div>
                    <div className="bg-white/80 rounded-xl p-5 mb-4">
                      <div className="text-lg font-semibold text-gray-800 mb-3">{t('rn89_example')}</div>
                      <p className="text-xl font-mono text-gray-900 mb-4">
                        −7/5 + (−2/3) = −21/15 + (−10/15) = −31/15
                      </p>
                      <div className="space-y-2 text-lg text-gray-800 bg-gray-50 rounded-lg p-4">
                        <div><strong>{t('rn89_step1')}</strong> <AnimatedWords text={t('rn89_add_diff_step1')} /></div>
                        <div><strong>{t('rn89_step2')}</strong> <AnimatedWords text={t('rn89_add_diff_step2')} /></div>
                        <div><strong>{t('rn89_step3')}</strong> <AnimatedWords text={t('rn89_add_diff_step3')} /></div>
                      </div>
                    </div>
                    <AnimatedNumberLine numerator={-31} denominator={15} label={`${t('rn89_result')} −31/15`} />
                  </motion.div>
                </motion.section>
              )}

              {/* Subtraction Content */}
              {activeTab === 1 && (
                <motion.section
                  initial="hidden"
                  animate="visible"
                  variants={seqContainer}
                  className="space-y-6"
                >
                  {/* Subtraction Title */}
                  <motion.div
                    variants={seqItem}
                    className="flex items-center justify-center gap-4 mb-6"
                  >
                    <motion.span
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, -10, 10, 0],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-6xl"
                    >
                      ➖
                    </motion.span>
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {t('rn89_subtraction_title')}
                    </h2>
                  </motion.div>

                  <motion.div
                    variants={seqItem}
                    className="bg-gradient-to-br from-orange-100 via-red-50 to-orange-100 rounded-3xl p-8 shadow-xl border-4 border-orange-400"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">🔁</span>
                      <h3 className="text-2xl font-bold text-orange-900">{t('rn89_subtraction_formula')}</h3>
                    </div>
                    <div className="bg-white/80 rounded-xl p-5 mb-4">
                      <div className="text-lg font-semibold text-gray-800 mb-3">📌 <AnimatedWords text={t('rn89_subtraction_rule')} /></div>
                      <div className="text-lg font-semibold text-gray-800 mb-3">{t('rn89_example')}</div>
                      <p className="text-xl font-mono text-gray-900 mb-4">
                        {t('rn89_subtraction_example')}
                      </p>
                      <div className="space-y-2 text-lg text-gray-800 bg-gray-50 rounded-lg p-4">
                        <div><strong>{t('rn89_step1')}</strong> <AnimatedWords text={t('rn89_sub_step1')} /></div>
                        <div><strong>{t('rn89_step2')}</strong> <AnimatedWords text={t('rn89_sub_step2')} /></div>
                        <div><strong>{t('rn89_step3')}</strong> <AnimatedWords text={t('rn89_sub_step3')} /></div>
                      </div>
                    </div>
                    <AnimatedNumberLine numerator={47} denominator={42} label={`${t('rn89_result')} 47/42`} />
                </motion.div>
                </motion.section>
              )}

              {/* Multiplication Content */}
              {activeTab === 2 && (
                <motion.section
                  initial="hidden"
                  animate="visible"
                  variants={seqContainer}
                  className="space-y-6"
                >
                  {/* Multiplication Title */}
                  <motion.div
                    variants={seqItem}
                    className="flex items-center justify-center gap-4 mb-6"
                  >
                    <motion.span
                      animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="text-6xl"
                    >
                      ✖️
                    </motion.span>
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      {t('rn89_multiplication_title')}
                    </h2>
                  </motion.div>

                  <motion.div
                    variants={seqItem}
                    className="bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-100 rounded-3xl p-8 shadow-xl border-4 border-purple-400"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">🔢</span>
                      <h3 className="text-2xl font-bold text-purple-900">{t('rn89_multiplication_formula')}</h3>
                    </div>
                    <div className="bg-white/80 rounded-xl p-5 mb-4">
                      <div className="text-lg font-semibold text-gray-800 mb-3">📌 <AnimatedWords text={t('rn89_multiplication_rule')} /></div>
                      <div className="text-lg font-semibold text-gray-800 mb-3">{t('rn89_example')}</div>
                      <p className="text-xl font-mono text-gray-900 mb-4">
                        {t('rn89_multiplication_example')}
                      </p>
                      <div className="space-y-2 text-lg text-gray-800 bg-gray-50 rounded-lg p-4">
                        <div><strong>{t('rn89_step1')}</strong> <AnimatedWords text={t('rn89_mul_step1')} /></div>
                        <div><strong>{t('rn89_step2')}</strong> <AnimatedWords text={t('rn89_mul_step2')} /></div>
                        <div><strong>{t('rn89_step3')}</strong> <AnimatedWords text={t('rn89_mul_step3')} /></div>
                </div>
              </div>
                    <AnimatedNumberLine numerator={-6} denominator={35} label={`${t('rn89_result')} −6/35`} />
            </motion.div>
                </motion.section>
              )}

              {/* Division Content */}
              {activeTab === 3 && (
                <motion.section
                  initial="hidden"
                  animate="visible"
                  variants={seqContainer}
                  className="space-y-6"
                >
                  {/* Division Title */}
                  <motion.div
                    variants={seqItem}
                    className="flex items-center justify-center gap-4 mb-6"
                  >
                    <motion.span
                      animate={{
                        scale: [1, 1.2, 1],
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-6xl"
                    >
                      ➗
                    </motion.span>
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      {t('rn89_division_title')}
                    </h2>
                  </motion.div>

                  <motion.div
                    variants={seqItem}
                    className="bg-gradient-to-br from-pink-100 via-rose-50 to-pink-100 rounded-3xl p-8 shadow-xl border-4 border-pink-400"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">🔄</span>
                      <h3 className="text-2xl font-bold text-pink-900">{t('rn89_division_formula')}</h3>
                    </div>
                    <div className="bg-white/80 rounded-xl p-5 mb-4">
                      <div className="text-lg font-semibold text-gray-800 mb-3">📌 <AnimatedWords text={t('rn89_division_rule')} /></div>
                      <div className="text-lg font-semibold text-gray-800 mb-3">{t('rn89_example')}</div>
                      <p className="text-xl font-mono text-gray-900 mb-4">
                        {t('rn89_division_example')}
                      </p>
                      <div className="space-y-2 text-lg text-gray-800 bg-gray-50 rounded-lg p-4">
                        <div><strong>{t('rn89_step1')}</strong> <AnimatedWords text={t('rn89_div_step1')} /></div>
                        <div><strong>{t('rn89_step2')}</strong> <AnimatedWords text={t('rn89_div_step2')} /></div>
                        <div><strong>{t('rn89_step3')}</strong> <AnimatedWords text={t('rn89_div_step3')} /></div>
                        <div><strong>{t('rn89_step4')}</strong> <AnimatedWords text={t('rn89_div_step4')} /></div>
                      </div>
                    </div>
                    <div className="bg-yellow-100 rounded-xl p-5 mt-4 border-4 border-yellow-400">
                      <div className="text-lg font-semibold text-gray-800">
                        💡 <AnimatedWords text={t('rn89_division_reciprocal')} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <AnimatedNumberLine numerator={-28} denominator={45} label={`${t('rn89_result')} −28/45`} />
                    </div>
                  </motion.div>
                </motion.section>
              )}

              {/* Interactive Calculator */}
              <motion.section
                initial="hidden"
                animate="visible"
                variants={seqContainer}
                className="space-y-6 mt-12"
              >
                <motion.div variants={seqItem} className="text-center">
                  <h2 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                    <span className="text-5xl">🎮</span>
                    {t('rn89_interactive_calculator')}
                  </h2>
                  <div className="text-xl text-gray-600">
                    <AnimatedWords text={t('rn89_interactive_subtitle')} />
                  </div>
                </motion.div>

                <motion.div
                  variants={seqItem}
                  className="bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-100 rounded-3xl p-8 shadow-2xl border-4 border-indigo-400"
                >
                  {/* Input Fields */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* First Fraction */}
                    <div className="space-y-3">
                      <label className="block text-lg font-semibold text-gray-700">
                        {t('rn89_first_fraction')}
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="text-sm text-gray-600">{t('rn89_numerator')}</label>
                          <input
                            type="number"
                            value={num1}
                            onChange={(e) => {
                              setNum1(parseInt(e.target.value) || 0);
                              setShowResult(false);
                            }}
                            className="w-full px-4 py-3 text-xl font-bold rounded-xl border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <span className="text-3xl font-bold text-gray-600 pt-6">/</span>
                        <div className="flex-1">
                          <label className="text-sm text-gray-600">{t('rn89_denominator')}</label>
                          <input
                            type="number"
                            value={den1}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              setDen1(val === 0 ? 1 : val);
                              setShowResult(false);
                            }}
                            className="w-full px-4 py-3 text-xl font-bold rounded-xl border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Second Fraction */}
                    <div className="space-y-3">
                      <label className="block text-lg font-semibold text-gray-700">
                        {t('rn89_second_fraction')}
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="text-sm text-gray-600">{t('rn89_numerator')}</label>
                          <input
                            type="number"
                            value={num2}
                            onChange={(e) => {
                              setNum2(parseInt(e.target.value) || 0);
                              setShowResult(false);
                            }}
                            className="w-full px-4 py-3 text-xl font-bold rounded-xl border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <span className="text-3xl font-bold text-gray-600 pt-6">/</span>
                        <div className="flex-1">
                          <label className="text-sm text-gray-600">{t('rn89_denominator')}</label>
                          <input
                            type="number"
                            value={den2}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              setDen2(val === 0 ? 1 : val);
                              setShowResult(false);
                            }}
                            className="w-full px-4 py-3 text-xl font-bold rounded-xl border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calculate Button */}
                  <motion.button
                    onClick={handleCalculate}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                  >
                    <span className="text-3xl">🎯</span>
                    {t('rn89_calculate')}
                  </motion.button>

                  {/* Result Display */}
                  <AnimatePresence>
                    {showResult && result && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-8 space-y-6"
                      >
                        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-300">
                          <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            {t('rn89_step_by_step')}
                          </h3>

                          {(currentOperation === 'add' || currentOperation === 'subtract') && (
                            <div className="space-y-3 text-lg text-gray-700">
                              <p className="bg-blue-50 rounded-lg p-3">
                                <span className="font-semibold">{t('rn89_lcm_label')}:</span> {result.commonDen}
                              </p>
                              <p className="bg-purple-50 rounded-lg p-3">
                                <span className="font-semibold">{t('rn89_converted_fractions')}:</span>
                              </p>
                              <p className="ml-4 bg-gray-50 rounded-lg p-2">
                                {num1}/{den1} = {result.convertedNum1}/{result.commonDen}
                              </p>
                              <p className="ml-4 bg-gray-50 rounded-lg p-2">
                                {num2}/{den2} = {result.convertedNum2}/{result.commonDen}
                              </p>
                              <p className="bg-green-50 rounded-lg p-3">
                                <span className="font-semibold">{t('rn89_result')}:</span>{' '}
                                {result.convertedNum1} {currentOperation === 'add' ? '+' : '−'} {result.convertedNum2} = {result.resultNum}
                              </p>
                            </div>
                          )}

                          {currentOperation === 'multiply' && (
                            <div className="space-y-3 text-lg text-gray-700">
                              <p className="bg-blue-50 rounded-lg p-3">
                                ({num1} × {num2}) / ({den1} × {den2})
                              </p>
                              <p className="bg-green-50 rounded-lg p-3">
                                = {result.resultNum} / {result.resultDen}
                              </p>
                            </div>
                          )}

                          {currentOperation === 'divide' && (
                            <div className="space-y-3 text-lg text-gray-700">
                              <p className="bg-blue-50 rounded-lg p-3">
                                ({num1}/{den1}) × ({den2}/{num2})
                              </p>
                              <p className="bg-purple-50 rounded-lg p-3">
                                ({num1} × {den2}) / ({den1} × {num2})
                              </p>
                              <p className="bg-green-50 rounded-lg p-3">
                                = {result.resultNum} / {result.resultDen}
                              </p>
                            </div>
                          )}

                          <div className="mt-6 pt-6 border-t-4 border-indigo-300">
                            <p className="text-2xl font-bold text-indigo-700">
                              {t('rn89_final_answer')}: {result.simplified.num}/{result.simplified.den}
                            </p>
          </div>
        </div>

                        <AnimatedNumberLine 
                          numerator={result.simplified.num} 
                          denominator={result.simplified.den} 
                          label={`${result.simplified.num}/${result.simplified.den}`}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.section>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-12 gap-4">
          <motion.button
            onClick={handlePrev}
            disabled={activeTab === 0}
            whileHover={activeTab > 0 ? { scale: 1.05 } : {}}
            whileTap={activeTab > 0 ? { scale: 0.95 } : {}}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-2 ${
              activeTab === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <span className="text-2xl">←</span> {t('rn89_previous')}
          </motion.button>

          <div className="text-center">
            <p className="text-lg font-semibold text-gray-600">
              {activeTab + 1} / {tabs.length}
            </p>
          </div>

          <motion.button
            onClick={handleNext}
            disabled={activeTab === 3}
            whileHover={activeTab < 3 ? { scale: 1.05 } : {}}
            whileTap={activeTab < 3 ? { scale: 0.95 } : {}}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-2 ${
              activeTab === 3
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {t('rn89_next')} <span className="text-2xl">→</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
