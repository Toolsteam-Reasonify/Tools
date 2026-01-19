import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Calculator, Book, Sparkles, Check, ChevronRight, RotateCcw } from 'lucide-react';

export default function ExponentsDemonstrationMode() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'decimal' | 'standard'>('decimal');
  const [currentStep, setCurrentStep] = useState(0);
  const [showDecimalExample, setShowDecimalExample] = useState(false);
  const [showStandardSteps, setShowStandardSteps] = useState(false);
  const [showStandardRules, setShowStandardRules] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number }>>([]);

  // Generate floating particles
  const generateParticles = () => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2
    }));
    setParticles(newParticles);
  };

  useEffect(() => {
    generateParticles();
  }, []);

  // Decimal system step-by-step data
  const decimalSystemSteps = [
    { step: 'decimalStep1', value: 'decimalStep1Value', explanation: 'decimalStep1Explanation' },
    { step: 'decimalStep2', value: 'decimalStep2Value', explanation: 'decimalStep2Explanation' },
    { step: 'decimalStep3', value: 'decimalStep3Value', explanation: 'decimalStep3Explanation' },
    { step: 'decimalStep4', value: 'decimalStep4Value', explanation: 'decimalStep4Explanation' }
  ];

  // Standard form conversion steps
  const standardFormSteps = [
    { step: 'convertStep1', value: 'convertStep1Value', explanation: 'convertStep1Explanation' },
    { step: 'convertStep2', value: 'convertStep2Value', explanation: 'convertStep2Explanation' },
    { step: 'convertStep3', value: 'convertStep3Value', explanation: 'convertStep3Explanation' },
    { step: 'convertStep4', value: 'convertStep4Value', explanation: 'convertStep4Explanation' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            initial={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay
            }}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`bg-${i}`}
            className="absolute bg-purple-500/20 rounded-full blur-xl"
            initial={{ 
              x: i * 100 + 50,
              y: i * 80 + 50,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              delay: i * 2,
            }}
            style={{
              width: 100 + (i * 20),
              height: 100 + (i * 20),
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-10 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mb-8"
        >
          {/* Rounded container with gradient border */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-purple-500/50 p-1 rounded-2xl border border-white/30"
          >
            <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-8 text-center ring-1 ring-purple-300/30">
              {/* Title with icons - Sequential animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-3 mb-6"
              >
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Calculator className="text-cyan-400" size={40} />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400"
                >
                  {t('decimalNumberSystemTitle')}
                </motion.h1>
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                >
                  <Sparkles className="text-yellow-400" size={40} />
                </motion.div>
              </motion.div>
              {/* Decimal-only hero content */}
              <div className="space-y-3 max-w-3xl mx-auto">
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="text-purple-100 text-lg sm:text-xl md:text-2xl"
                >
                  {t('decimalNumberSystemDescription')}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/10 border border-white/20 rounded-2xl p-2"
        >
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab('decimal');
                setShowDecimalExample(false);
                setCurrentStep(0);
              }}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'decimal' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'bg-white/5 text-purple-200 hover:bg-white/10'
              }`}
            >
              <motion.div
                animate={{ 
                  y: activeTab === 'decimal' ? [0, -10, 0] : 0,
                  scale: activeTab === 'decimal' ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 1.2, repeat: activeTab === 'decimal' ? Infinity : 0, repeatDelay: 0.8, ease: "easeInOut" }}
              >
                <Book size={20} />
              </motion.div>
              {t('tabDecimalSystem')}
            </button>
          </div>
        </motion.div>
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'decimal' ? (
            <motion.div
              key="decimal"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* Decimal System Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1 rounded-2xl"
              >
                <div className="bg-slate-800 rounded-xl p-8">
                  <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center"
                  >
                    {t('decimalSystemTitle')}
                  </motion.h2>
                  <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-xl text-gray-300 mb-6 text-center"
                  >
                    {t('decimalSystemConcept')}
                  </motion.p>
                  {/* Example Card */}
                  <div className="bg-slate-900 rounded-xl p-6 mb-6">
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="text-2xl font-bold text-cyan-400 mb-6 text-center"
                    >
                      {t('example')}: {t('decimalSystemExample')}
                    </motion.h3>
                    {/* Step-by-Step Cards */}
                    <motion.div
                      className="bg-slate-900 rounded-xl mb-6 overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: showDecimalExample ? 'auto' : 0,
                        opacity: showDecimalExample ? 1 : 0,
                        padding: showDecimalExample ? '1.5rem' : '0'
                      }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                    >
                      <AnimatePresence>
                        {showDecimalExample && (
                          <motion.div 
                            className="p-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            {decimalSystemSteps.map((stepData, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ 
                                  opacity: showDecimalExample && currentStep >= idx ? 1 : showDecimalExample ? 0.3 : 0,
                                  x: showDecimalExample && currentStep >= idx ? 0 : -50
                                }}
                                transition={{ delay: showDecimalExample && idx === currentStep ? 0.3 : 0, duration: 0.5 }}
                                className="mb-4 last:mb-0"
                              >
                                <div className="flex items-start gap-4 bg-slate-700 rounded-lg p-4">
                                  <motion.div
                                    animate={{ 
                                      scale: showDecimalExample && currentStep >= idx ? [1, 1.2, 1] : 1,
                                      rotate: showDecimalExample && currentStep >= idx ? [0, 360] : 0
                                    }}
                                    transition={{ duration: 0.8, repeat: showDecimalExample && currentStep >= idx ? 1 : 0 }}
                                    className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                                  >
                                    {idx + 1}
                                  </motion.div>
                                  <div className="flex-1">
                                    <div className="text-purple-300 text-sm font-semibold mb-1">{t(stepData.step)}</div>
                                    <div className="text-2xl font-mono text-white mb-2 break-words">{t(stepData.value)}</div>
                                    <div className="text-gray-400">{t(stepData.explanation)}</div>
                                  </div>
                                </div>
                                {idx < decimalSystemSteps.length - 1 && showDecimalExample && currentStep > idx && (
                                  <div className="flex justify-center my-2">
                                    <motion.div
                                      animate={{ y: [0, -5, 0] }}
                                      transition={{ duration: 0.8, repeat: Infinity }}
                                    >
                                      <ChevronRight className="text-purple-400" />
                                    </motion.div>
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    {/* Show Steps / Reset Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="flex justify-center mt-6"
                      >
                        {!showDecimalExample ? (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowDecimalExample(true);
                              setCurrentStep(0);
                              // Animate steps sequentially line by line
                              decimalSystemSteps.forEach((_, idx) => {
                                setTimeout(() => {
                                  setCurrentStep(idx);
                                }, 300 + idx * 800);
                              });
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2"
              >
                <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                              <Sparkles size={20} />
                </motion.div>
                            {t('showSteps')}
                          </motion.button>
                        ) : (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowDecimalExample(false);
                              setCurrentStep(0);
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2"
                          >
                            <RotateCcw size={20} />
                            {t('reset')}
                          </motion.button>
                        )}
                    </motion.div>
                  </div>
                  {/* Key Point */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-4 text-center"
              >
                    <div className="text-white text-sm mb-1 flex items-center justify-center gap-2">
                <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        💡
                      </motion.div>
                      {t('importantPoints')}:
                    </div>
                    <div className="text-white text-lg font-bold">{t('digitPlaces')}</div>
                </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="standard"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* Why Standard Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-2xl"
              >
                <div className="bg-slate-800 rounded-xl p-8">
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center"
                  >
                    {t('standardFormWhyTitle')}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-xl text-gray-300 mb-6 text-center"
                  >
                    {t('standardFormWhyConcept')}
                  </motion.p>
                  {/* Comparison */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="bg-red-900/30 border-2 border-red-500 rounded-xl p-6"
                    >
                      <div className="text-red-400 text-sm font-semibold mb-2 flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: [0, 180, 360] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          ❌
                        </motion.div>
                        {t('exp_before') || 'Hard to Read'}
                      </div>
                      <div className="text-white text-xl sm:text-2xl font-mono break-all">{t('standardFormHardRead')}</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="bg-green-900/30 border-2 border-green-500 rounded-xl p-6"
                    >
                      <div className="text-green-400 text-sm font-semibold mb-2 flex items-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          ✓
                        </motion.div>
                        {t('exp_after') || 'Easy to Read'}
                      </div>
                      <div className="text-white text-2xl sm:text-3xl font-mono">{t('standardFormEasyRead')}</div>
                    </motion.div>
                  </div>
                  {/* Benefits */}
                  <div className="bg-slate-900 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-white mb-4">{t('standardFormBenefits')}</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        'benefit1',
                        'benefit2',
                        'benefit3',
                        'benefit4'
                      ].map((benefit, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 + idx * 0.15, duration: 0.5 }}
                          className="bg-slate-700 rounded-lg p-4 flex items-center gap-3"
                        >
                          <motion.div
                            animate={{ 
                              y: [0, -8, 0],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: idx * 0.3, ease: "easeInOut" }}
                          >
                            <Check className="text-green-400 flex-shrink-0" size={24} />
                          </motion.div>
                          <span className="text-white">{t(benefit)}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
              {/* How to Convert */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 p-1 rounded-2xl"
              >
                <div className="bg-slate-800 rounded-xl p-8">
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center"
                  >
                    {t('howToConvertTitle')}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-xl text-gray-300 mb-6 text-center"
                  >
                    {t('howToConvertConcept')}
                  </motion.p>
                  {/* Steps */}
                  <motion.div
                    className="bg-slate-900 rounded-xl mb-6 overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: showStandardSteps ? 'auto' : 0,
                      opacity: showStandardSteps ? 1 : 0,
                      padding: showStandardSteps ? '1.5rem' : '0'
                    }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <AnimatePresence>
                      {showStandardSteps && (
                        <motion.div 
                          className="p-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {standardFormSteps.map((stepData, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -50 }}
                              animate={{ 
                                opacity: showStandardSteps && currentStep >= idx ? 1 : showStandardSteps ? 0.3 : 0,
                                x: showStandardSteps && currentStep >= idx ? 0 : -50
                              }}
                              transition={{ delay: showStandardSteps && idx === currentStep ? 0.3 : 0, duration: 0.5 }}
                              className="mb-4 last:mb-0"
                            >
                              <div className="flex items-start gap-4 bg-slate-700 rounded-lg p-4">
                                <motion.div
                                  animate={{ 
                                    scale: showStandardSteps && currentStep >= idx ? [1, 1.2, 1] : 1,
                                    rotate: showStandardSteps && currentStep >= idx ? [0, 360] : 0
                                  }}
                                  transition={{ duration: 0.8, repeat: showStandardSteps && currentStep >= idx ? 1 : 0 }}
                                  className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                                >
                                  {idx + 1}
                                </motion.div>
                                <div className="flex-1">
                                  <div className="text-purple-300 text-sm font-semibold mb-1">{t(stepData.step)}</div>
                                  <div className="text-2xl font-mono text-white mb-2">{t(stepData.value)}</div>
                                  <div className="text-gray-400">{t(stepData.explanation)}</div>
                                </div>
                              </div>
                              {idx < standardFormSteps.length - 1 && showStandardSteps && currentStep > idx && (
                                <div className="flex justify-center my-2">
                                  <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                  >
                                    <ChevronRight className="text-purple-400" />
                                  </motion.div>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  {/* Show Steps / Reset Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center mt-6"
                  >
                    {!showStandardSteps ? (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowStandardSteps(true);
                          setCurrentStep(0);
                          standardFormSteps.forEach((_, idx) => {
                            setTimeout(() => {
                              setCurrentStep(idx);
                            }, 300 + idx * 800);
                          });
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles size={20} />
                        </motion.div>
                        {t('showSteps') || 'Show Steps'}
                      </motion.button>
                    ) : (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowStandardSteps(false);
                          setCurrentStep(0);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2"
                      >
                        <RotateCcw size={20} />
                        {t('reset') || 'Reset'}
                      </motion.button>
                    )}
                  </motion.div>
                  {/* Rule */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: showStandardSteps ? 1 : 0, scale: showStandardSteps ? 1 : 0.9 }}
                    transition={{ delay: showStandardSteps ? 3.5 : 0, duration: 0.5 }}
                    className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-4 text-center mt-6"
                  >
                    <div className="text-white text-sm mb-1 flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        💡
                      </motion.div>
                      {t('formula')}:
                    </div>
                    <div className="text-white text-xl font-bold">{t('standardFormRule')}</div>
                  </motion.div>
                </div>
              </motion.div>
              {/* Standard Form Rules */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-r from-orange-500 to-red-500 p-1 rounded-2xl"
              >
                <div className="bg-slate-800 rounded-xl p-8">
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center"
                  >
                    {t('standardFormRulesTitle')}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-xl text-gray-300 mb-6 text-center"
                  >
                    {t('standardFormRulesConcept')}
                  </motion.p>
                  {/* Examples */}
                  <motion.div
                    className="bg-slate-900 rounded-xl mb-6 overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: showStandardRules ? 'auto' : 0,
                      opacity: showStandardRules ? 1 : 0,
                      padding: showStandardRules ? '1.5rem' : '0'
                    }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <AnimatePresence>
                      {showStandardRules && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <h4 className="text-xl font-bold text-white mb-4">{t('example')}s:</h4>
                          {[
                            { number: 'ruleWrong1', reason: 'ruleWrong1Reason', correct: false },
                            { number: 'ruleWrong2', reason: 'ruleWrong2Reason', correct: false },
                            { number: 'ruleCorrect', reason: 'ruleCorrectReason', correct: true }
                          ].map((ex, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 20 }}
                              transition={{ delay: idx * 0.2, duration: 0.5 }}
                              className={`mb-4 last:mb-0 rounded-lg p-4 border-2 ${
                                ex.correct ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'
                              }`}
                            >
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="text-2xl font-mono text-white">{t(ex.number)}</div>
                                <motion.div
                                  animate={{ 
                                    y: showStandardRules ? [0, -5, 0] : 0,
                                    scale: showStandardRules ? [1, 1.1, 1] : 1
                                  }}
                                  transition={{ duration: 0.8, repeat: showStandardRules ? Infinity : 0, delay: idx * 0.3 }}
                                  className={`text-lg font-semibold ${ex.correct ? 'text-green-400' : 'text-red-400'}`}
                                >
                                  {t(ex.reason)}
                                </motion.div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  {/* Show Steps / Reset Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center mt-6"
                  >
                    {!showStandardRules ? (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowStandardRules(true);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles size={20} />
                        </motion.div>
                        {t('showSteps') || 'Show Steps'}
                      </motion.button>
                    ) : (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowStandardRules(false);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2"
                      >
                        <RotateCcw size={20} />
                        {t('reset') || 'Reset'}
                      </motion.button>
                    )}
                  </motion.div>
                  {/* Formula */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: showStandardRules ? 1 : 0, scale: showStandardRules ? 1 : 0.9 }}
                    transition={{ delay: showStandardRules ? 1.8 : 0, duration: 0.5 }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-center mt-6"
                  >
                    <div className="text-white text-sm mb-2 flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        📐
                      </motion.div>
                      {t('formula')}:
                    </div>
                    <div className="text-white text-2xl sm:text-3xl font-bold">{t('standardFormFormula')}</div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
