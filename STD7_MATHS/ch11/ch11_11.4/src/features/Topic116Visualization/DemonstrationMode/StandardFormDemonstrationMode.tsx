import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Check, Sparkles, ChevronRight, RotateCcw, X } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function StandardFormDemonstrationMode() {
  const { t } = useLanguage();
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [showStandardSteps, setShowStandardSteps] = useState(false);
  const [showPattern, setShowPattern] = useState(false);
  const [showStandardRules, setShowStandardRules] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number }>>([]);

  // Particle animation
  useEffect(() => {
    setParticles(Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2
    })));
  }, []);

  // Use translation keys for steps
  const standardFormSteps = [
    {
      step: t('sf_step1'),
      value: t('sf_example1'),
      explanation: t('sf_step1exp')
    },
    {
      step: t('sf_step2'),
      value: t('sf_example2'),
      explanation: t('sf_step2exp')
    },
    {
      step: t('sf_step3'),
      value: t('sf_example3'),
      explanation: t('sf_step3exp')
    },
    {
      step: t('sf_step4'),
      value: t('sf_example4'),
      explanation: t('sf_step4exp')
    }
  ];

  // Patterns data
  const patternRows = [
    { n: '59', sf: '5.9 × 10¹' },
    { n: '590', sf: '5.9 × 10²' },
    { n: '5,900', sf: '5.9 × 10³' },
    { n: '59,000', sf: '5.9 × 10⁴' },
  ];

  // Big science examples
  const sciExamples = [
    { label: 'Distance: Sun to Galaxy Center', value: '3.0 × 10²⁰ m' },
    { label: 'Earth Mass', value: '5.976 × 10²⁴ kg' },
    { label: 'Uranus Mass', value: '8.68 × 10²⁵ kg' },
  ];

  // Benefits
  const benefits = [
    t('sf_benefit1'),
    t('sf_benefit2'),
    t('sf_benefit3'),
    t('sf_benefit4'),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map(p => (
          <motion.div key={p.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            initial={{ left: `${p.x}%`, top: `${p.y}%` }}
            animate={{ y: [0, -20, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
          />
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-10 relative z-10">
        {/* WHY CARD */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative z-10 mb-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-purple-500/50 p-1 rounded-2xl border border-white/30">
            <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-4 sm:p-6 md:p-8 text-center ring-1 ring-purple-300/30">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
                <motion.div animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                  <Calculator className="text-cyan-400 flex-shrink-0" size={40} />
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 break-words text-center">
                  {t('sf_title')}
                </motion.h1>
                <motion.div animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}>
                  <Sparkles className="text-yellow-400 flex-shrink-0" size={40} />
                </motion.div>
              </motion.div>
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}
                className="text-purple-100 text-base sm:text-lg md:text-xl lg:text-2xl mb-6 break-words px-2">
                {t('sf_intro')}
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col gap-2 bg-slate-900/80 rounded-xl p-4 sm:p-6 mx-auto max-w-xl mb-6">
                <span className="font-bold text-base sm:text-lg md:text-xl text-yellow-300 break-words">{t('sf_why_title')}</span>
                <span className="text-purple-200 text-sm sm:text-base md:text-lg break-words">{t('sf_why_body')}</span>
              </motion.div>
              <div className="flex flex-col gap-6 md:flex-row md:gap-8 justify-center w-full mb-6 px-2">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <span className="font-semibold text-red-400 flex items-center text-sm sm:text-base break-words text-center"><X className="mr-2 flex-shrink-0"/> {t('sf_hard_to_read')}</span>
                  <span className="text-lg sm:text-xl md:text-2xl font-mono text-white break-all">{t('sf_big_example')}</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <span className="font-semibold text-green-400 flex items-center text-sm sm:text-base break-words text-center"><Check className="mr-2 flex-shrink-0"/> {t('sf_std_form')}</span>
                  <span className="text-lg sm:text-xl md:text-2xl font-mono text-white break-words">{t('sf_std_form_example')}</span>
                </div>
              </div>
              <div className="bg-slate-900 rounded-xl p-4 sm:p-6 mt-6">
                <h4 className="text-lg sm:text-xl font-bold text-white mb-4 text-center break-words">{t('sf_benefits_title')}</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {benefits.map((b, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.15, duration: 0.5 }}
                      className="bg-slate-700 rounded-lg p-3 sm:p-4 flex items-start gap-3">
                      <motion.div animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}>
                        <Check className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
                      </motion.div>
                      <span className="text-white text-sm sm:text-base break-words">{b}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        {/* CONVERT STEPS CARD */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 p-1 rounded-2xl">
          <div className="bg-slate-800 rounded-xl p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 text-center break-words px-2">{t('sf_convert_title')}</h2>
            <p className="text-gray-300 mb-6 text-center text-sm sm:text-base md:text-lg break-words px-2">{t('sf_convert_body')}</p>
            <motion.div className="bg-slate-900 rounded-xl mb-6 overflow-hidden"
              initial={{ height: 0, opacity: 0 }} animate={{ height: showStandardSteps ? 'auto' : 0, opacity: showStandardSteps ? 1 : 0, padding: showStandardSteps ? '1.5rem' : '0' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}>
              <AnimatePresence>
                {showStandardSteps && (
                  <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {standardFormSteps.map((s, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, x: -50 }} animate={{ opacity: showStandardSteps && currentStep >= idx ? 1 : showStandardSteps ? 0.3 : 0, x: showStandardSteps && currentStep >= idx ? 0 : -50 }}
                        transition={{ delay: showStandardSteps && idx === currentStep ? 0.3 : 0, duration: 0.5 }}
                        className="mb-4 last:mb-0">
                        <div className="flex items-start gap-4 bg-slate-700 rounded-lg p-4">
                          <motion.div animate={{ scale: showStandardSteps && currentStep >= idx ? [1, 1.2, 1] : 1, rotate: showStandardSteps && currentStep >= idx ? [0, 360] : 0 }}
                            transition={{ duration: 0.8, repeat: showStandardSteps && currentStep >= idx ? 1 : 0 }}
                            className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {idx + 1}
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="text-purple-300 text-xs sm:text-sm font-semibold mb-1 break-words">{s.step}</div>
                            <div className="text-lg sm:text-xl md:text-2xl font-mono text-white mb-2 break-words">{s.value}</div>
                            <div className="text-gray-400 text-sm sm:text-base break-words">{s.explanation}</div>
                          </div>
                        </div>
                        {idx < standardFormSteps.length - 1 && showStandardSteps && currentStep > idx && (
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
              {!showStandardSteps ? (
                <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {
                  setShowStandardSteps(true); setCurrentStep(0); standardFormSteps.forEach((_, idx) => {
                    setTimeout(() => setCurrentStep(idx), 300 + idx * 800);
                  });
                }}
                  className="px-4 sm:px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2 text-sm sm:text-base">
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Sparkles size={20} className="flex-shrink-0" />
                  </motion.div>
                  <span className="break-words">{t('sf_show_steps')}</span>
                </motion.button>
              ) : (
                <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setShowStandardSteps(false); setCurrentStep(0); }}
                  className="px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2 text-sm sm:text-base">
                  <RotateCcw size={20} className="flex-shrink-0" /> <span className="break-words">{t('sf_reset')}</span>
                </motion.button>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: showStandardSteps ? 1 : 0, scale: showStandardSteps ? 1 : 0.9 }}
              transition={{ delay: showStandardSteps ? 3.5 : 0, duration: 0.5 }}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-3 sm:p-4 text-center mt-6">
              <div className="text-white text-xs sm:text-sm mb-1 flex items-center justify-center gap-2 flex-wrap">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>💡</motion.div>
                <span className="break-words">{t('sf_rule_hint')}</span>
              </div>
              <div className="text-white text-base sm:text-lg md:text-xl font-bold break-words px-2">{t('sf_rule_full')}</div>
            </motion.div>
          </div>
        </motion.div>
        {/* RULE & EXAMPLES CARD */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 p-1 rounded-2xl">
          <div className="bg-slate-800 rounded-xl p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 text-center break-words px-2">{t('sf_rules_examples_title')}</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 text-center break-words px-2">{t('sf_rules_examples_body')}</p>
            <motion.div className="bg-slate-900 rounded-xl mb-6 overflow-hidden"
              initial={{ height: 0, opacity: 0 }} animate={{ height: showStandardRules ? 'auto' : 0, opacity: showStandardRules ? 1 : 0, padding: showStandardRules ? '1.5rem' : '0' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}>
              <AnimatePresence>
                {showStandardRules && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h4 className="text-lg sm:text-xl font-bold text-white mb-4 text-center">{t('sf_examples')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                      <div className="bg-slate-800 rounded-lg p-3 sm:p-4 border-2 border-green-500 text-center min-h-[100px] flex flex-col justify-center">
                        <div className="text-sm sm:text-base md:text-lg break-words mb-2">{t('sf_example_5985')}</div>
                        <div className="text-green-400 text-lg sm:text-xl md:text-2xl break-words">{t('sf_example_5985_sf')}</div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3 sm:p-4 border-2 border-blue-500 text-center min-h-[100px] flex flex-col justify-center">
                        <div className="text-sm sm:text-base md:text-lg break-words mb-2">{t('sf_example_59000')}</div>
                        <div className="text-green-400 text-lg sm:text-xl md:text-2xl break-words">{t('sf_example_59000_sf')}</div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3 sm:p-4 border-2 border-yellow-500 text-center min-h-[100px] flex flex-col justify-center">
                        <div className="text-sm sm:text-base md:text-lg break-words mb-2">{t('sf_example_galaxy_dist')}</div>
                        <div className="text-green-400 text-base sm:text-lg md:text-xl break-words">{t('sf_example_galaxy_dist_sf')}</div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3 sm:p-4 border-2 border-purple-500 text-center min-h-[100px] flex flex-col justify-center">
                        <div className="text-sm sm:text-base md:text-lg break-words mb-2">{t('sf_example_earth_mass')}</div>
                        <div className="text-green-400 text-base sm:text-lg md:text-xl break-words">{t('sf_example_earth_mass_sf')}</div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3 sm:p-4 border-2 border-pink-500 text-center min-h-[100px] flex flex-col justify-center">
                        <div className="text-sm sm:text-base md:text-lg break-words mb-2">{t('sf_example_uranus_mass')}</div>
                        <div className="text-green-400 text-base sm:text-lg md:text-xl break-words">{t('sf_example_uranus_mass_sf')}</div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3 sm:p-4 border-2 border-cyan-500 text-center min-h-[100px] flex flex-col justify-center">
                        <div className="text-sm sm:text-base md:text-lg break-words mb-2">{t('sf_example_neptune_mass')}</div>
                        <div className="text-green-400 text-base sm:text-lg md:text-xl break-words">{t('sf_example_neptune_mass_sf')}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-6">
              {!showStandardRules ? (
                <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowStandardRules(true)}
                  className="px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2 text-sm sm:text-base">
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Sparkles size={20} className="flex-shrink-0" />
                  </motion.div>
                  <span className="break-words">{t('sf_show_more_examples')}</span>
                </motion.button>
              ) : (
                <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowStandardRules(false)}
                  className="px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2 text-sm sm:text-base">
                  <RotateCcw size={20} className="flex-shrink-0" /> <span className="break-words">{t('sf_hide_examples')}</span>
                </motion.button>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: showStandardRules ? 1 : 0, scale: showStandardRules ? 1 : 0.9 }}
              transition={{ delay: showStandardRules ? 1.8 : 0, duration: 0.5 }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 sm:p-6 text-center mt-6">
              <div className="text-white text-xs sm:text-sm mb-2 flex items-center justify-center gap-2 flex-wrap">
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>📐</motion.div>
                <span className="break-words">{t('sf_rules_examples_hint')}</span>
              </div>
              <div className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold break-words px-2">{t('sf_rules_examples_full')}</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
