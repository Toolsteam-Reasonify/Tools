import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { RotateCcw, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ExponentsDemonstrationMode() {
  const { t } = useLanguage();
  const [currentLaw, setCurrentLaw] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number }>>([]);

  // Laws data with examples
  const laws = [
    {
      id: 1,
      titleKey: 'law1Title',
      formulaKey: 'law1Formula',
      descKey: 'law1Description',
      exampleKey: 'law1Example',
      exampleValues: { base1: '2³', base2: '2²', result: '2⁵', equals: '32' },
      icon: '➕',
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-400/20'
    },
    {
      id: 2,
      titleKey: 'law2Title',
      formulaKey: 'law2Formula',
      descKey: 'law2Description',
      exampleKey: 'law2Example',
      exampleValues: { base1: '5⁴', base2: '5²', result: '5²', equals: '25' },
      icon: '➗',
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-400/20'
    },
    {
      id: 3,
      titleKey: 'law3Title',
      formulaKey: 'law3Formula',
      descKey: 'law3Description',
      exampleKey: 'law3Example',
      exampleValues: { base1: '(3²)', base2: '³', result: '3⁶', equals: '729' },
      icon: '⚡',
      color: 'from-orange-500/20 to-red-500/20',
      borderColor: 'border-orange-400/20'
    },
    {
      id: 4,
      titleKey: 'law4Title',
      formulaKey: 'law4Formula',
      descKey: 'law4Description',
      exampleKey: 'law4Example',
      exampleValues: { base1: '2³', base2: '5³', result: '10³', equals: '1,000' },
      icon: '✖️',
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-400/20'
    },
    {
      id: 5,
      titleKey: 'law5Title',
      formulaKey: 'law5Formula',
      descKey: 'law5Description',
      exampleKey: 'law5Example',
      exampleValues: { base1: '8²', base2: '2²', result: '4²', equals: '16' },
      icon: '÷',
      color: 'from-indigo-500/20 to-violet-500/20',
      borderColor: 'border-indigo-400/20'
    },
    {
      id: 6,
      titleKey: 'law6Title',
      formulaKey: 'law6Formula',
      descKey: 'law6Description',
      exampleKey: 'law6Example',
      exampleValues: { base1: '5⁰', base2: '', result: '1', equals: '' },
      icon: '0️⃣',
      color: 'from-teal-500/20 to-cyan-500/20',
      borderColor: 'border-teal-400/20'
    }
  ];

  // Step-by-step examples for each law
  const getLawSteps = (lawId: number) => {
    const stepKeys: { [key: number]: { textKey: string[]; explanationKey: string[] } } = {
      1: {
        textKey: ['law1_step1_text', 'law1_step2_text', 'law1_step3_text', 'law1_step4_text', 'law1_step5_text'],
        explanationKey: ['law1_step1_explanation', 'law1_step2_explanation', 'law1_step3_explanation', 'law1_step4_explanation', 'law1_step5_explanation']
      },
      2: {
        textKey: ['law2_step1_text', 'law2_step2_text', 'law2_step3_text', 'law2_step4_text', 'law2_step5_text'],
        explanationKey: ['law2_step1_explanation', 'law2_step2_explanation', 'law2_step3_explanation', 'law2_step4_explanation', 'law2_step5_explanation']
      },
      3: {
        textKey: ['law3_step1_text', 'law3_step2_text', 'law3_step3_text', 'law3_step4_text', 'law3_step5_text'],
        explanationKey: ['law3_step1_explanation', 'law3_step2_explanation', 'law3_step3_explanation', 'law3_step4_explanation', 'law3_step5_explanation']
      },
      4: {
        textKey: ['law4_step1_text', 'law4_step2_text', 'law4_step3_text', 'law4_step4_text', 'law4_step5_text'],
        explanationKey: ['law4_step1_explanation', 'law4_step2_explanation', 'law4_step3_explanation', 'law4_step4_explanation', 'law4_step5_explanation']
      },
      5: {
        textKey: ['law5_step1_text', 'law5_step2_text', 'law5_step3_text', 'law5_step4_text', 'law5_step5_text'],
        explanationKey: ['law5_step1_explanation', 'law5_step2_explanation', 'law5_step3_explanation', 'law5_step4_explanation', 'law5_step5_explanation']
      },
      6: {
        textKey: ['law6_step1_text', 'law6_step2_text', 'law6_step3_text', 'law6_step4_text', 'law6_step5_text'],
        explanationKey: ['law6_step1_explanation', 'law6_step2_explanation', 'law6_step3_explanation', 'law6_step4_explanation', 'law6_step5_explanation']
      }
    };
    
    const keys = stepKeys[lawId];
    if (!keys) return [];
    
    return keys.textKey.map((textKey, idx) => ({
      text: t(textKey),
      explanation: t(keys.explanationKey[idx])
    }));
  };

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
    setShowExample(false);
    setIsAnimating(false);
    setCurrentStep(0);
    setShowSteps(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLaw]);

  const playAnimation = () => {
    setShowSteps(true);
    setIsAnimating(true);
    setShowExample(false);
    setCurrentStep(0);
    setTimeout(() => {
      setShowExample(true);
      setCurrentStep(0);
      const steps = getLawSteps(laws[currentLaw].id);
      // Animate steps sequentially
      steps.forEach((_, idx) => {
        setTimeout(() => {
          setCurrentStep(idx);
        }, 300 + idx * 800);
      });
      setTimeout(() => {
        setIsAnimating(false);
      }, steps.length * 800 + 300);
    }, 300);
  };

  const resetAnimation = () => {
    setShowSteps(false);
    setShowExample(false);
    setIsAnimating(false);
    setCurrentStep(0);
  };

  const nextLaw = () => {
    setCurrentLaw((prev) => (prev + 1) % laws.length);
  };

  const prevLaw = () => {
    setCurrentLaw((prev) => (prev - 1 + laws.length) % laws.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.6; }
        }
      `}</style>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
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
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Glowing particles inside hero */}
          <AnimatePresence>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.5, 0],
                  x: [0, 100],
                  y: [0, -50]
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.8,
                }}
                className="absolute w-2 h-2 bg-cyan-400/40 rounded-full blur-sm"
                style={{
                  top: `${20 + i * 20}%`,
                  left: `${10 + i * 20}%`,
                }}
              />
            ))}
          </AnimatePresence>

          <div className="relative z-10 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-300 to-purple-300 mb-4"
              >
                {t('exponentsTitle')}
              </motion.h1>
              
              {/* Sequential line-by-line animation for intro sentences */}
              <div className="text-purple-200 text-base sm:text-lg md:text-xl max-w-3xl mx-auto space-y-2">
                <AnimatePresence mode="wait">
                {[t('expHeroLine1'), t('expHeroLine2')].map((sentence, idx) => (
                    <motion.p
                    key={idx}
                      initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ delay: 0.6 + idx * 0.3, duration: 0.5 }}
                  >
                    {sentence}
                    </motion.p>
                  ))}
                </AnimatePresence>
              </div>
          </div>
        </motion.div>

        {/* Law Counter */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          <div className="inline-flex gap-2">
            {laws.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentLaw ? 'w-12 bg-purple-400' : 'w-2 bg-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-purple-200 mt-2 text-sm">{t('lawCounter').replace('{current}', String(currentLaw + 1)).replace('{total}', String(laws.length))}</p>
        </motion.div>

        {/* Single Law Display */}
        <AnimatePresence mode="wait">
          {laws.map((law, idx) => (
            idx === currentLaw && (
            <motion.div
                key={law.id}
                initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className={`bg-gradient-to-br ${law.color} border-2 ${law.borderColor} rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden mb-6`}
              >
                {/* Animated Icon */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-5xl mb-4 text-center"
                >
                  {law.icon}
                </motion.div>

                {/* Law Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-2xl sm:text-3xl font-bold mb-4 text-center text-purple-100"
                >
                  {t(law.titleKey)}
                </motion.h3>

                {/* Formula */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="bg-black/30 rounded-xl p-6 mb-4 border border-white/10"
                >
                <motion.div
                    animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-cyan-300 font-mono"
                >
                    {t(law.formulaKey)}
              </motion.div>
                </motion.div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-base sm:text-lg text-purple-200 mb-6 text-center"
                >
                  {t(law.descKey)}
                </motion.p>

                {/* Example - Step-by-Step Animation */}
                <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-purple-400 mb-6 text-center">
                    {t('exampleLabel')}: {t(law.exampleKey)}
                  </h3>
                  
                  <motion.div className="bg-slate-800 rounded-xl mb-6 overflow-hidden"
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: showSteps ? 'auto' : 0, opacity: showSteps ? 1 : 0, padding: showSteps ? '1.5rem' : '0' }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}>
                    <AnimatePresence>
                      {showSteps && (
                        <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {getLawSteps(law.id).map((step, stepIdx) => (
                            <motion.div 
                              key={stepIdx} 
                              initial={{ opacity: 0, x: -50 }} 
                              animate={{ opacity: showSteps && currentStep >= stepIdx ? 1 : showSteps ? 0.3 : 0, x: showSteps && currentStep >= stepIdx ? 0 : -50 }}
                              transition={{ delay: showSteps && stepIdx === currentStep ? 0.3 : 0, duration: 0.5 }}
                              className="mb-4 last:mb-0">
                              <div className="flex items-start gap-4 bg-slate-700 rounded-lg p-4">
                                <motion.div 
                                  animate={{ scale: showSteps && currentStep >= stepIdx ? [1, 1.2, 1] : 1, rotate: showSteps && currentStep >= stepIdx ? [0, 360] : 0 }}
                                  transition={{ duration: 0.8, repeat: showSteps && currentStep >= stepIdx ? 1 : 0 }}
                                  className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                  {stepIdx + 1}
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-lg sm:text-xl md:text-2xl font-mono text-white mb-2 break-words">{step.text}</div>
                                  <div className="text-gray-400 text-sm sm:text-base break-words">{step.explanation}</div>
                                </div>
                              </div>
                              {stepIdx < getLawSteps(law.id).length - 1 && showSteps && currentStep > stepIdx && (
                                <div className="flex justify-center my-2">
                                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>
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
                  
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-6">
                    {!showSteps ? (
                      <motion.button 
                        type="button" 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        onClick={playAnimation}
                        disabled={isAnimating}
                        className={`px-4 sm:px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2 text-sm sm:text-base ${isAnimating ? 'cursor-not-allowed opacity-50' : ''}`}>
                        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                          <Sparkles size={20} className="flex-shrink-0" />
                        </motion.div>
                        <span className="break-words">{t('showSteps')}</span>
                      </motion.button>
                    ) : (
                      <motion.button 
                        type="button" 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        onClick={resetAnimation}
                        className="px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2 text-sm sm:text-base">
                        <RotateCcw size={20} className="flex-shrink-0" /> 
                        <span className="break-words">{t('reset')}</span>
                      </motion.button>
                    )}
                  </motion.div>
                </div>
                      </motion.div>
            )
                  ))}
        </AnimatePresence>

        {/* Navigation */}
                    <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <button
            onClick={prevLaw}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
          >
            <ChevronLeft size={20} />
            {t('previousLaw')}
          </button>
          
          <div className="text-center">
            <p className="text-purple-300 text-sm mb-2">{t('quickNavigation')}</p>
            <div className="flex gap-2">
              {laws.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentLaw(idx);
                    resetAnimation();
                  }}
                  className={`w-10 h-10 rounded-lg font-bold transition-all ${
                    idx === currentLaw
                      ? 'bg-purple-500 text-white scale-110'
                      : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                  }`}
                >
                  {idx + 1}
                </button>
                      ))}
                    </div>
                    </div>

          <button
            onClick={nextLaw}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
          >
            {t('nextLaw')}
            <ChevronRight size={20} />
          </button>
            </motion.div>
      </div>
    </div>
  );
}
