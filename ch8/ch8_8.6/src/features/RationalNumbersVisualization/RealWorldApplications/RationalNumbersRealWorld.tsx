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
      icon: '👨‍🍳',
      title: t('rw_app_temperature_title'),
      description: t('rw_app_temperature_desc'),
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-100 via-cyan-50 to-blue-100',
      borderColor: 'border-blue-400',
      examplePoints: [
        { num: 12, den: 18, label: '12/18 (not standard)' },
        { num: 2, den: 3, label: '2/3 (standard)' }
      ]
    },
    {
      id: 'recipe',
      icon: '💰',
      title: t('rw_app_recipe_title'),
      description: t('rw_app_recipe_desc'),
      color: 'from-green-500 to-teal-500',
      bgColor: 'from-green-100 via-teal-50 to-green-100',
      borderColor: 'border-green-400',
      examplePoints: [
        { num: 45, den: 60, label: '45/60 (not standard)' },
        { num: 3, den: 4, label: '3/4 (standard)' }
      ]
    },
    {
      id: 'distance',
      icon: '⏰',
      title: t('rw_app_distance_title'),
      description: t('rw_app_distance_desc'),
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-100 via-red-50 to-orange-100',
      borderColor: 'border-orange-400',
      examplePoints: [
        { num: 20, den: 30, label: '20/30 (not standard)' },
        { num: 2, den: 3, label: '2/3 (standard)' }
      ]
    },
    {
      id: 'altitude',
      icon: '📊',
      title: t('rw_app_altitude_title'),
      description: t('rw_app_altitude_desc'),
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-100 via-pink-50 to-purple-100',
      borderColor: 'border-purple-400',
      examplePoints: [
        { num: 24, den: 36, label: '24/36 (not standard)' },
        { num: 2, den: 3, label: '2/3 (standard)' }
      ]
    },
    {
      id: 'money',
      icon: '🏷️',
      title: t('rw_app_money_title'),
      description: t('rw_app_money_desc'),
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'from-yellow-100 via-amber-50 to-yellow-100',
      borderColor: 'border-yellow-400',
      examplePoints: [
        { num: 15, den: 25, label: '15/25 (not standard)' },
        { num: 3, den: 5, label: '3/5 (standard)' }
      ]
    },
    {
      id: 'time',
      icon: '🍳',
      title: t('rw_app_time_title'),
      description: t('rw_app_time_desc'),
      color: 'from-indigo-500 to-violet-500',
      bgColor: 'from-indigo-100 via-violet-50 to-indigo-100',
      borderColor: 'border-indigo-400',
      examplePoints: [
        { num: 18, den: 24, label: '18/24 (not standard)' },
        { num: 3, den: 4, label: '3/4 (standard)' }
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
              title="What's this? Tap to see a 6-second animation"
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
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
                        <div className="text-sm uppercase tracking-wide text-slate-400 mb-2">{t('rw_calc')}</div>
                        <div className="text-slate-200">{t('rn_numberLine')}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {app.examplePoints?.map((pt, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
                          <AnimatedNumberLine numerator={pt.num} denominator={pt.den} label={pt.label} />
                        </motion.div>
                      ))}
                    </div>
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

function SeaLevelVisualization() {
  const { t } = useLanguage();
  const [height, setHeight] = useState(-0.75);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <label className="text-lg text-gray-700 font-bold flex-shrink-0">
          Height: <span className={height >= 0 ? 'text-green-600' : 'text-red-600'}>{height >= 0 ? 'Above' : 'Below'}</span> Sea Level
        </label>
        <input
          type="range"
          min={-1.5}
          max={1.5}
          step={0.01}
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          className="flex-1 h-4 bg-gradient-to-r from-cyan-200 via-blue-200 to-cyan-200 rounded-lg appearance-none cursor-pointer accent-cyan-600 shadow-inner"
        />
        <motion.div
          key={height}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-extrabold text-gray-800 min-w-[120px] text-right font-mono"
        >
          {height >= 0 ? '+' : ''}{height.toFixed(2)} km
        </motion.div>
      </div>

      <motion.div
        key={height}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-b from-sky-300 via-blue-200 to-blue-100 p-10 rounded-3xl border-4 border-cyan-400 overflow-hidden shadow-2xl"
        style={{ minHeight: '350px' }}
      >
        {/* Floating bubbles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/30 rounded-full"
            style={{
              width: Math.random() * 30 + 10,
              height: Math.random() * 30 + 10,
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 50}%`
            }}
            animate={{
              y: [0, -200],
              opacity: [0.5, 0],
              scale: [1, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear"
            }}
          />
        ))}

        <svg viewBox="0 0 400 300" className="w-full h-auto relative z-10">
          {/* Sea level line with animation */}
          <motion.line
            x1={0}
            y1={150}
            x2={400}
            y2={150}
            stroke="#0284c7"
            strokeWidth={6}
            strokeDasharray="8,4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
          <motion.text
            x={30}
            y={145}
            fontSize={16}
            fill="#0284c7"
            fontWeight="700"
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            Sea Level (0)
          </motion.text>

          {/* Water area */}
          <rect x={0} y={150} width={400} height={150} fill="#0ea5e9" opacity={0.4} />

          {/* Marker with bouncing animation */}
          <motion.circle
            cx={200}
            cy={150 - (height * 60)}
            r={18}
            fill={height >= 0 ? '#10b981' : '#ef4444'}
            initial={{ scale: 0 }}
            animate={{
              scale: [1, 1.2, 1],
              y: [0, -3, 0]
            }}
            transition={{
              scale: { duration: 1.5, repeat: Infinity },
              y: { duration: 1, repeat: Infinity }
            }}
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}
          />
          <motion.text
            x={200}
            y={height >= 0 ? 150 - (height * 60) - 35 : 150 - (height * 60) + 45}
            textAnchor="middle"
            fontSize={16}
            fill={height >= 0 ? '#10b981' : '#ef4444'}
            fontWeight="800"
            animate={{
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity
            }}
          >
            {height >= 0 ? '+' : ''}{height.toFixed(2)} km
          </motion.text>

          {/* Connecting line with draw animation */}
          <motion.line
            x1={200}
            y1={150}
            x2={200}
            y2={150 - (height * 60)}
            stroke={height >= 0 ? '#10b981' : '#ef4444'}
            strokeWidth={4}
            strokeDasharray="4,4"
            opacity={0.7}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        <motion.div
          key={height}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-5 bg-white/90 backdrop-blur-sm rounded-2xl border-4 border-cyan-300 shadow-xl"
        >
          <div className="text-base text-gray-800 font-semibold">
            <strong className="text-cyan-700">Rational Number:</strong>{' '}
            <span className="text-2xl font-mono font-extrabold">{height.toFixed(2)} km</span>
            {' '}= {height >= 0 ? '' : '-'}{Math.abs(height).toFixed(2)} km
          </div>
        </motion.div>

        {/* Number line */}
        <motion.div
          key={height}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6"
        >
          <AnimatedNumberLine 
            numerator={Math.round(height * 4)} 
            denominator={4}
            label={`${height >= 0 ? '+' : ''}${height.toFixed(2)} km`}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function MeasurementConversion() {
  const { t } = useLanguage();
  const [meters, setMeters] = useState(0.75);

  function toFractionString(x: number) {
    const sgn = x < 0 ? '-' : '';
    x = Math.abs(x);
    let best = { num: 0, den: 1, err: Infinity };
    for (let den = 1; den <= 100; den++) {
      const num = Math.round(x * den);
      const err = Math.abs(x - num / den);
      if (err < best.err) best = { num, den, err };
      if (err === 0) break;
    }
    const g = gcd(best.num, best.den);
    return `${sgn}${best.num / g}/${best.den / g}`;
  }

  function gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    if (b === 0) return a;
    return gcd(b, a % b);
  }

  const kmValue = meters / 1000;
  const fraction = toFractionString(kmValue);

  return (
    <div className="space-y-8">
      <div className="text-lg text-gray-700 font-bold mb-4">Meters (editable):</div>
      <div className="flex items-center gap-6">
        <input
          type="range"
          min={0}
          max={2}
          step={0.01}
          value={meters}
          onChange={(e) => setMeters(Number(e.target.value))}
          className="flex-1 h-5 bg-gradient-to-r from-violet-200 via-purple-200 to-violet-200 rounded-lg appearance-none cursor-pointer accent-violet-600 shadow-inner"
        />
        <motion.div
          key={meters}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-extrabold text-gray-800 min-w-[100px] text-right font-mono"
        >
          {meters.toFixed(2)} m
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          key={`meters-${meters}`}
          initial={{ scale: 0.9, rotateY: -10 }}
          animate={{ scale: 1, rotateY: 0 }}
          className="p-8 bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-100 rounded-3xl border-4 border-blue-400 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={{
                y: [0, -8, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
              className="text-4xl"
            >
              📐
            </motion.div>
            <div className="text-sm text-gray-600 font-semibold">Meters</div>
          </div>
          <div className="text-4xl font-extrabold text-blue-600 font-mono">{meters.toFixed(2)} m</div>
        </motion.div>

        <motion.div
          key={fraction}
          initial={{ scale: 0.9, rotateY: 10 }}
          animate={{ scale: 1, rotateY: 0 }}
          className="p-8 bg-gradient-to-br from-purple-100 via-pink-100 to-purple-100 rounded-3xl border-4 border-purple-400 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="text-4xl"
            >
              🔄
            </motion.div>
            <div className="text-sm text-gray-600 font-semibold">Kilometers (rational form)</div>
          </div>
          <motion.div
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity
            }}
            className="text-3xl font-extrabold text-purple-600 font-mono mb-2"
          >
            {fraction} km
          </motion.div>
          <div className="text-lg text-gray-700 font-semibold">≈ {kmValue.toPrecision(4)} km</div>
        </motion.div>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-8 rounded-3xl bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border-4 border-indigo-300 shadow-xl"
      >
        {(() => {
          const [num, den] = fraction.split('/').map(Number);
          if (den) {
            return <AnimatedNumberLine numerator={num} denominator={den} label={fraction} />;
          }
          return null;
        })()}
      </motion.div>
    </div>
  );
}
