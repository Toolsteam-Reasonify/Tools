import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function ScoreCardPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: any };
  const { t } = useLanguage();

  const summary = state?.summary ?? { total: 0, correct: 0, incorrect: 0, skipped: 0, accuracy: 0, avgTimeSec: 0, grade: 'F' };
  const breakdown = state?.breakdown ?? [] as Array<{ prompt: string; status: string; answer?: string; chosen?: number }>;
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-gradient-to-br from-white to-indigo-50 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border-4 border-indigo-300"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: -8 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15, delayChildren: 0.05 } }
        }}
        className="mb-5"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            variants={{ hidden: { opacity: 0, y: -6 }, visible: { opacity: 1, y: 0 } }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="text-3xl"
            aria-hidden
          >
            🎉
          </motion.div>
          <motion.h1
            variants={{ hidden: { opacity: 0, y: -6 }, visible: { opacity: 1, y: 0 } }}
            className="text-3xl font-extrabold text-gray-800 text-center"
          >
            {t('sc_sessionComplete')}
          </motion.h1>
          <motion.div
            variants={{ hidden: { opacity: 0, y: -6 }, visible: { opacity: 1, y: 0 } }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            className="text-3xl"
            aria-hidden
          >
            🎉
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-white border-4 border-green-200 text-center">
          <div className="text-4xl mb-1">✅</div>
          <div className="text-3xl font-extrabold text-green-600">{summary.correct}</div>
          <div className="text-xs text-gray-600 mt-1">{t('correctAnswers')}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-white border-4 border-red-200 text-center">
          <div className="text-4xl mb-1">❌</div>
          <div className="text-3xl font-extrabold text-red-600">{summary.incorrect}</div>
          <div className="text-xs text-gray-600 mt-1">{t('incorrectAnswers')}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border-4 border-purple-200 text-center">
          <div className="text-4xl mb-1">⏭️</div>
          <div className="text-3xl font-extrabold text-purple-600">{summary.skipped}</div>
          <div className="text-xs text-gray-600 mt-1">{t('skippedQuestions')}</div>
        </motion.div>
      </div>

      <motion.div whileHover={{ scale: 1.01 }} className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-white border-4 border-indigo-200 text-center mb-4">
        <div className="text-5xl font-extrabold text-indigo-600">{summary.total}</div>
        <div className="text-xs text-gray-600">{t('sc_totalQuestions')}</div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-white border-4 border-yellow-200 text-center">
          <div className="text-4xl mb-1">🏆</div>
          <div className="text-3xl font-extrabold text-yellow-600">{summary.grade}</div>
          <div className="text-xs text-gray-600 mt-1">{t('sc_finalGrade')}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-white border-4 border-cyan-200 text-center">
          <div className="text-4xl mb-1">🎯</div>
          <div className="text-3xl font-extrabold text-cyan-600">{summary.accuracy}%</div>
          <div className="text-xs text-gray-600 mt-1">{t('sc_accuracyRate')}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-white border-4 border-emerald-200 text-center">
          <div className="text-4xl mb-1">⚡</div>
          <div className="text-3xl font-extrabold text-emerald-600">{summary.avgTimeSec}s</div>
          <div className="text-xs text-gray-600 mt-1">{t('sc_avgTime')}</div>
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"
      >
        {breakdown.map((b: any, i: number) => {
          const baseColor = b.status === 'Correct' ? 'border-green-400' : b.status === 'Skipped' ? 'border-yellow-400' : b.status === 'Incorrect' ? 'border-red-400' : 'border-gray-300';
          const isActive = activeIdx === i;
          const borderClass = isActive ? 'border-blue-400' : baseColor;
          const statusLabel = b.status === 'Correct' ? t('correctAnswers') : b.status === 'Incorrect' ? t('incorrectAnswers') : b.status === 'Skipped' ? t('skipped') : b.status;
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.01 }}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              onClick={() => setActiveIdx(isActive ? null : i)}
              className={`p-3 rounded-xl border-4 ${borderClass} bg-white cursor-pointer`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  {i + 1}. {b.prompt} — <span className="font-semibold">{statusLabel}</span>
                </div>
                {!isActive && (
                  <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">{t('sc_clickToSeeAnswer')}</div>
                )}
              </div>
              {isActive && b.answer && (
                <div className="mt-3 text-2xl font-extrabold text-blue-700">
                  {b.answer}
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/practice')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow"
        >
          {t('sc_startNew')}
        </motion.button>
      </div>
    </motion.div>
  );
}


