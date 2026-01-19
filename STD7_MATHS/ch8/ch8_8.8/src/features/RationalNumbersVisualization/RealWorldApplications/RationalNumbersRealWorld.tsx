import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedNumberLine from '../../../components/AnimatedNumberLine';

export default function RationalNumbersRealWorld() {
  const { t, language } = useLanguage();
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const applications = [
    {
      id: 'temperature',
      icon: '🌡️',
      title: t('rw88_temp_title'),
      description: t('rw88_temp_desc'),
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-100 via-cyan-50 to-blue-100',
      borderColor: 'border-blue-400',
      examplePoints: [
        { num: 205, den: 10, label: '20.5°C', description: t('rw88_temp_start') },
        { num: 2055, den: 100, label: '20.55°C', description: t('rw88_temp_inter1') },
        { num: 206, den: 10, label: '20.6°C', description: t('rw88_temp_mid') },
        { num: 2065, den: 100, label: '20.65°C', description: t('rw88_temp_inter2') },
        { num: 207, den: 10, label: '20.7°C', description: t('rw88_temp_end') }
      ]
    },
    {
      id: 'measurement',
      icon: '📏',
      title: t('rw88_measure_title'),
      description: t('rw88_measure_desc'),
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-100 via-red-50 to-orange-100',
      borderColor: 'border-orange-400',
      examplePoints: [
        { num: 25, den: 10, label: '2.5 cm', description: t('rw88_measure_lower') },
        { num: 252, den: 100, label: '2.52 cm', description: t('rw88_measure_precise') },
        { num: 255, den: 100, label: '2.55 cm', description: t('rw88_measure_mid') },
        { num: 258, den: 100, label: '2.58 cm', description: t('rw88_measure_another') },
        { num: 26, den: 10, label: '2.6 cm', description: t('rw88_measure_upper') }
      ]
    },
    {
      id: 'music',
      icon: '🎵',
      title: t('rw88_music_title'),
      description: t('rw88_music_desc'),
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-100 via-pink-50 to-purple-100',
      borderColor: 'border-purple-400',
      examplePoints: [
        { num: 440, den: 1, label: '440 Hz (A)', description: t('rw88_music_a') },
        { num: 450, den: 1, label: '450 Hz', description: t('rw88_music_between_a') },
        { num: 467, den: 1, label: '467 Hz', description: t('rw88_music_mid') },
        { num: 480, den: 1, label: '480 Hz', description: t('rw88_music_between_b') },
        { num: 494, den: 1, label: '494 Hz (B)', description: t('rw88_music_b') }
      ]
    },
    {
      id: 'recipe',
      icon: '🍳',
      title: t('rw88_recipe_title'),
      description: t('rw88_recipe_desc'),
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-100 via-emerald-50 to-green-100',
      borderColor: 'border-green-400',
      examplePoints: [
        { num: 1, den: 2, label: '1/2 cup', description: t('rw88_measure_lower') },
        { num: 5, den: 8, label: '5/8 cup', description: t('rw88_recipe_between') },
        { num: 2, den: 3, label: '2/3 cup', description: t('rw88_recipe_approx') },
        { num: 11, den: 16, label: '11/16 cup', description: t('rw88_recipe_precise') },
        { num: 3, den: 4, label: '3/4 cup', description: t('rw88_measure_upper') }
      ]
    },
    {
      id: 'time',
      icon: '⏱️',
      title: t('rw88_time_title'),
      description: t('rw88_time_desc'),
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'from-yellow-100 via-amber-50 to-yellow-100',
      borderColor: 'border-yellow-400',
      examplePoints: [
        { num: 25, den: 10, label: '2.5 sec', description: t('rw88_time_start') },
        { num: 26, den: 10, label: '2.6 sec', description: t('rw88_time_check') },
        { num: 275, den: 100, label: '2.75 sec', description: t('rw88_measure_mid') },
        { num: 29, den: 10, label: '2.9 sec', description: t('rw88_time_near') },
        { num: 3, den: 1, label: '3.0 sec', description: t('rw88_time_end') }
      ]
    },
    {
      id: 'score',
      icon: '📊',
      title: t('rw88_rating_title'),
      description: t('rw88_rating_desc'),
      color: 'from-indigo-500 to-violet-500',
      bgColor: 'from-indigo-100 via-violet-50 to-indigo-100',
      borderColor: 'border-indigo-400',
      examplePoints: [
        { num: 45, den: 10, label: '4.5 ★', description: t('rw88_rating_lower') },
        { num: 455, den: 100, label: '4.55 ★', description: t('rw88_rating_increase') },
        { num: 46, den: 10, label: '4.6 ★', description: t('rw88_measure_mid') },
        { num: 465, den: 100, label: '4.65 ★', description: t('rw88_rating_higher') },
        { num: 47, den: 10, label: '4.7 ★', description: t('rw88_measure_upper') }
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 via-blue-50 to-violet-50 p-6 sm:p-8 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Animated Header with Multiple Bouncing Icons */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 relative"
        >
          <div className="flex items-center justify-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-6 px-6 sm:px-8 md:px-12 lg:px-16 w-full max-w-7xl mx-auto">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              🌍
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent leading-[1.3] px-4 sm:px-6 md:px-8 break-words w-full max-w-7xl mx-auto py-3">
              {t('rw_title')}
            </h1>
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              🚀
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-700 text-lg sm:text-xl md:text-2xl font-medium px-6 sm:px-8 md:px-12 lg:px-16 max-w-6xl mx-auto"
          >
            {t('rw_desc')}
          </motion.p>
        </motion.div>

        {/* Applications Grid with Bouncing Icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {applications.map((app, idx) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 50, rotateY: -20 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ delay: idx * 0.2, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.08, y: -10, rotateY: 5 }}
              onClick={() => setSelectedApp(selectedApp === app.id ? null : app.id)}
              className={`bg-gradient-to-br ${app.bgColor} p-10 sm:p-12 md:p-14 rounded-3xl shadow-2xl border-4 ${app.borderColor} cursor-pointer transition-all relative overflow-hidden group`}
              title={t('rw_tapToExpand')}
            >
              {/* Animated background particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-white/40 rounded-full"
                  initial={{
                    x: Math.random() * 300,
                    y: Math.random() * 300,
                    opacity: 0
                  }}
                  animate={{
                    x: [null, Math.random() * 300],
                    y: [null, Math.random() * 300],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}

              <div className="relative z-10">
                <div className="text-7xl mb-5 text-center">
                  {app.icon}
                </div>
                <h3 className="text-2xl font-extrabold text-gray-800 mb-4 text-center">{app.title}</h3>
                <p className="text-gray-700 leading-relaxed mb-6 text-center font-medium">{app.description}</p>

                {selectedApp !== app.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-center"
                  >
                    <motion.div
                      animate={{
                        y: [0, 5, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity
                      }}
                      className="text-sm text-gray-600 font-semibold"
                    >
                      👆 {t('rw_tapToExpand')}
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Expanded Section with Number Lines */}
        <AnimatePresence>
          {selectedApp && (
            <motion.div
              key={selectedApp}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="mt-6 bg-slate-900 text-slate-100 p-6 rounded-3xl border-4 border-indigo-400 shadow-2xl"
            >
              {(() => {
                const app = applications.find(a => a.id === selectedApp)!;
                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                          className="text-4xl"
                        >
                          {app.icon}
                        </motion.div>
                        <h2 className="text-2xl font-extrabold">{app.title}</h2>
                      </div>
                      <button onClick={() => setSelectedApp(null)} className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-600 hover:bg-slate-700">✕</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
                        <div className="text-sm uppercase tracking-wide text-slate-400 mb-2">{t('rw_overview')}</div>
                        <div className="text-slate-200">{app.description}</div>
                        <div className="mt-3 text-sm text-emerald-400 font-semibold">
                          💡 {t('rw88_infinite_values')}
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
                        <div className="text-sm uppercase tracking-wide text-slate-400 mb-2">{t('rw_calc')}</div>
                        <div className="text-slate-200">{t('rw88_visual_guide')}</div>
                        <div className="mt-3 text-sm text-cyan-400 font-semibold">
                          📊 {t('rw88_continuous')}
                        </div>
                      </div>
                    </div>

                    {/* Grid of Number Lines showing different values */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {app.examplePoints?.slice(0, 4).map((pt, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.15 }}
                          className="p-4 rounded-2xl bg-slate-800 border border-slate-700"
                        >
                          <div className="mb-2">
                            <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                              {language === 'hi' ? '📍 वर्चुअल गाइड' : language === 'gu' ? '📍 વર્ચ્યુઅલ ગાઇડ' : '📍 Virtual Guide'}
                            </div>
                            <div className="text-sm text-slate-300 font-semibold">
                              {pt.description}
                            </div>
                          </div>
                          <AnimatedNumberLine numerator={pt.num} denominator={pt.den} label={pt.label} />
                        </motion.div>
                      ))}
                    </div>

                    {/* Additional info showing infinite nature */}
                    {app.examplePoints && app.examplePoints.length > 4 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">∞</span>
                          <div>
                            <div className="text-lg font-bold text-purple-200">{t('rw88_more_examples')}</div>
                            <div className="text-sm text-slate-300">
                              {t('rw88_between_text')}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {app.examplePoints.slice(4).map((pt, idx) => (
                            <motion.span
                              key={idx}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.8 + idx * 0.1 }}
                              className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-lg text-sm font-mono border border-purple-400"
                            >
                              {pt.label}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
