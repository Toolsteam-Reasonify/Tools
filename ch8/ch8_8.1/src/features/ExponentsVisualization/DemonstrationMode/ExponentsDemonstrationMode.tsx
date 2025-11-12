import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function ExponentsDemonstrationMode() {
  const { t } = useLanguage();
  const [base, setBase] = useState(10);
  const [exp, setExp] = useState(4);
  const [activeTab, setActiveTab] = useState<'introduction' | 'exponents'>('introduction');

  const examples = [
    { label: '1,000', exp: 3, base: 10 },
    { label: '1,00,000', exp: 5, base: 10 },
    { label: '81', exp: 4, base: 3 },
    { label: '243', exp: 5, base: 3 },
    { label: '64', exp: 6, base: 2 },
    { label: '625', exp: 4, base: 5 },
  ];

  function pow(b: number, e: number) {
    return Math.pow(b, e);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 lg:py-10 space-y-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl relative overflow-hidden"
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

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex-1 min-w-0 w-full md:w-auto max-w-full">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-300 to-purple-300 mt-2 break-words leading-tight"
              >
                {t('exponentsTitle')}
              </motion.h1>
              
              <p className="text-purple-100/90 mt-3 max-w-4xl break-words text-xs sm:text-sm md:text-base leading-relaxed">
                {[t('expHeroLine1'), t('expHeroLine2')].map((sentence, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + idx * 0.2, duration: 0.5 }}
                    className="block mb-1"
                  >
                    {sentence}
                  </motion.span>
                ))}
              </p>
            </div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/20 rounded-2xl p-5 w-full md:w-80"
            >
              <div className="text-sm text-purple-100/80">{t('interactivePreview')}</div>
              <div className="mt-2 text-2xl font-bold">
                {base}
                <sup className="ml-1 align-super text-cyan-300">{exp}</sup>
                <span className="ml-3 text-purple-200">=</span>
              </div>
              <motion.div
                key={`${base}-${exp}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-2xl sm:text-3xl font-extrabold text-cyan-300 break-all overflow-wrap-anywhere whitespace-normal px-2"
              >
                {pow(base, exp).toLocaleString('en-IN')}
              </motion.div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                  <div className="text-xs text-purple-200 mb-2">{t('base')}</div>
                  <input
                    type="number"
                    value={base}
                    onChange={(e) => {
                      const val = parseInt(e.target.value || '0', 10);
                      if (!isNaN(val)) setBase(val);
                    }}
                    className="text-lg font-semibold w-full text-center bg-transparent border-2 border-white/20 rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                  <div className="text-xs text-purple-200 mb-2">{t('exponent')}</div>
                  <input
                    type="number"
                    value={exp}
                    onChange={(e) => {
                      const val = parseInt(e.target.value || '0', 10);
                      if (!isNaN(val) && val >= 0) setExp(val);
                    }}
                    className="text-lg font-semibold w-full text-center bg-transparent border-2 border-white/20 rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
            </motion.div>
          </div>
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
              onClick={() => setActiveTab('introduction')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'introduction' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'bg-white/5 text-purple-200 hover:bg-white/10'
              }`}
            >
              {t('tabIntroduction')}
            </button>
            <button
              onClick={() => setActiveTab('exponents')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'exponents' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'bg-white/5 text-purple-200 hover:bg-white/10'
              }`}
            >
              {t('tabExponents')}
            </button>
          </div>
        </motion.div>

        {/* Animated tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'introduction' ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Introduction to Exponents Section */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="col-span-1 md:col-span-3 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-400/20 rounded-2xl p-8 mb-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-4 text-center"
                >
                  📚
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 text-center"
                >
                  {t('expHeroTitle')}
                </motion.div>
                <p className="text-purple-100 text-lg max-w-3xl mx-auto text-center mb-6">
                  {[t('expHeroLine1'), t('expHeroLine2')].map((sentence, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + idx * 0.2, duration: 0.5 }}
                      className="block"
                    >
                      {sentence}
                      {idx === 0 && <br />}
                    </motion.span>
                  ))}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { num: '5³', desc: t('powerOf3'), result: '125' },
                    { num: '3⁴', desc: t('powerOf4'), result: '81' },
                    { num: '2⁶', desc: t('powerOf6'), result: '64' }
                  ].map((ex, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/5 rounded-xl p-5 border border-white/10 text-center"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                        className="text-3xl font-bold mb-2 text-cyan-300"
                      >
                        {ex.num}
                      </motion.div>
                      <div className="text-sm text-purple-200 mb-2">{ex.desc}</div>
                      <motion.div
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
                        className="text-lg font-semibold text-green-400"
                      >
                        = {ex.result}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Real World Examples */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="rounded-2xl p-5 bg-gradient-to-br from-teal-600/20 to-cyan-600/20 border border-teal-400/20 cursor-pointer"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-4xl"
                >
                  🌍
                </motion.div>
                <div className="mt-3 text-lg font-semibold">{t('massOfEarth')}</div>
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-1 text-purple-100"
                >
                  5.97 × 10²⁴ kg
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="rounded-2xl p-5 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-400/20 cursor-pointer"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                  className="text-4xl"
                >
                  🪐
                </motion.div>
                <div className="mt-3 text-lg font-semibold">{t('massOfUranus')}</div>
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 0.1 }}
                  className="mt-1 text-purple-100"
                >
                  8.68 × 10²⁵ kg
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="rounded-2xl p-5 bg-gradient-to-br from-pink-600/20 to-orange-600/20 border border-pink-400/20 cursor-pointer"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="text-4xl"
                >
                  🚀
                </motion.div>
                <div className="mt-3 text-lg font-semibold">{t('distancesInSpace')}</div>
                <div className="mt-1 text-purple-100">{t('hugeNumbersReadable')}</div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="exponents"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 border border-white/20 rounded-2xl p-8 space-y-6"
              >
                <div className="text-2xl font-bold mb-6">{t('exponentsBasicConcepts')}</div>
                
                {/* Animated Exponential Form Demo */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 rounded-xl p-6 mb-6">
                  <div className="text-sm text-purple-200 mb-4">📐 {t('visualExponentialForm')}</div>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl font-bold"
                    >
                      10
                    </motion.span>
                    <motion.sup
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="text-2xl text-cyan-300 font-bold"
                    >
                      4
                    </motion.sup>
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-3xl mx-2"
                    >
                      =
                    </motion.span>
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.2 + 0.5, duration: 0.5 }}
                        className="relative flex items-center"
                      >
                        <div className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-bold text-lg shadow-lg">
                          10
                        </div>
                        {i < 3 && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="text-2xl font-bold text-purple-300 mx-1"
                          >
                            ×
                          </motion.span>
                        )}
                      </motion.div>
                    ))}
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.5, duration: 0.5 }}
                      className="text-2xl font-bold text-amber-300 ml-2"
                    >
                      = 10,000
                    </motion.span>
                  </div>
                </div>

                {/* Key Terms with Animated Icons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { term: t('base'), desc: t('baseDescription'), icon: '🔢', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-400/20' },
                    { term: t('exponent'), desc: t('exponentDescription'), icon: '⬆️', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-400/20' },
                    { term: t('power'), desc: t('powerDescription'), icon: '⚡', color: 'from-orange-500/20 to-red-500/20', border: 'border-orange-400/20' }
                  ].map((item, idx) => (
                    <motion.div
                      key={item.term}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      className={`rounded-xl p-5 bg-gradient-to-br ${item.color} border ${item.border}`}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: idx * 0.3 }}
                        className="text-3xl mb-2"
                      >
                        {item.icon}
                      </motion.div>
                      <div className="text-sm text-purple-200 font-semibold">{item.term}</div>
                      <div className="text-sm text-purple-100 mt-1">{item.desc}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Animated Example Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {examples.map((e, idx) => (
                    <motion.div
                      key={e.label}
                      initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.6, type: "spring" }}
                      whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
                      className="rounded-xl p-4 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 border border-white/10 text-center cursor-pointer overflow-hidden"
                    >
                      <div className="text-sm text-purple-200">{e.label}</div>
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                        className="text-lg font-bold mt-1"
                      >
                        {e.base}<sup className="ml-0.5 text-cyan-300">{e.exp}</sup>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl p-6 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-400/20"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-sm text-purple-200 mb-2"
                  >
                    {t('specialName')}
                  </motion.div>
                  <div className="text-2xl font-extrabold">10<sup>2</sup> — {t('squared')}</div>
                  <motion.div
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-purple-100 mt-1"
                  >
                    {t('tenSquared')}
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="rounded-2xl p-6 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-400/20"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
                    className="text-sm text-purple-200 mb-2"
                  >
                    {t('specialName')}
                  </motion.div>
                  <div className="text-2xl font-extrabold">10<sup>3</sup> — {t('cubed')}</div>
                  <motion.div
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="text-purple-100 mt-1"
                  >
                    {t('tenCubed')}
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-2xl p-6 bg-gradient-to-br from-rose-600/20 to-orange-600/20 border border-rose-400/20"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
                    className="text-sm text-purple-200 mb-2"
                  >
                    {t('primeFactorization')}
                  </motion.div>
                  <div className="text-2xl font-extrabold">72 = 2<sup>3</sup> × 3<sup>2</sup></div>
                  <div className="text-purple-100 mt-1">{t('primeFactorizationDesc')}</div>
                </motion.div>
              </motion.section>

              {/* Advanced Concepts with Animated Symbols */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 border border-white/20 rounded-2xl p-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  {/* Negative Bases with Animation */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className="rounded-xl p-5 bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-sm text-purple-200">{t('negativeBases')}</div>
                      <motion.span
                        animate={{ rotate: [0, 180, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-xl"
                      >
                        ➡️
                      </motion.span>
                    </div>
                    <div className="space-y-2">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl font-bold mt-1"
                      >
                        <motion.span
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          (–2)
                        </motion.span>
                        <motion.sup
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
                        >
                          3
                        </motion.sup>
                        <span> = </span>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                          className="text-red-400"
                        >
                          –8
                        </motion.span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl font-bold"
                      >
                        <span>(–2)</span>
                        <motion.sup
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                        >
                          4
                        </motion.sup>
                        <span> = </span>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8, type: "spring" }}
                          className="text-green-400"
                        >
                          16
                        </motion.span>
                      </motion.div>
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="inline-block px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-sm"
                      >
                        (–1)<sup>odd</sup> = –1
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="inline-block px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-sm"
                      >
                        (–1)<sup>even</sup> = +1
                      </motion.span>
                    </div>
                  </motion.div>

                  {/* General Notation with Expanding Arrows */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="rounded-xl p-5 bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-sm text-purple-200">{t('generalNotation')}</div>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="text-lg"
                      >
                        ⬆️
                      </motion.span>
                    </div>
                    <div className="space-y-1 mt-1 text-lg">
                      {[0, 1, 2, 3].map((idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.15 }}
                          className="flex items-center gap-2"
                        >
                          <span>
                            {idx === 0 && t('generalNotationA2')}
                            {idx === 1 && t('generalNotationA3')}
                            {idx === 2 && t('generalNotationA7')}
                            {idx === 3 && t('generalNotationA3B2')}
                          </span>
                          <motion.span
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
                            className="text-purple-300"
                          >
                            →
                          </motion.span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Important Points with Pulsing Icons */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    className="rounded-xl p-5 bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-sm text-purple-200">{t('importantPoints')}</div>
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        💡
                      </motion.span>
                    </div>
                    <ul className="mt-2 space-y-2 list-disc list-inside text-purple-100">
                      {[
                        t('pointAnyBase'),
                        t('pointExponentialForm'),
                        t('pointPrimeFactorization')
                      ].map((point, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 + 0.3 }}
                          className="flex items-center gap-2"
                        >
                          <motion.span
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                          >
                            ✓
                          </motion.span>
                          <span>{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </motion.section>

              
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


