import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedWords from './AnimatedWords';
import { useLanguage } from '../contexts/LanguageContext';

interface AnimatedNumberLineProps {
  numerator: number;
  denominator: number;
  label?: string;
  showAnimation?: boolean;
  showTitle?: boolean;
}

const calculatePosition = (p: number, q: number): number => {
  const value = p / q;
  // Map the value from the range [-2, 2] to a percentage [0, 100%]
  return Math.max(0, Math.min(100, ((value + 2) / 4) * 100));
};

const AnimatedNumberLine: React.FC<AnimatedNumberLineProps> = ({ 
  numerator, 
  denominator, 
  label,
  showAnimation = true,
  showTitle = false
}) => {
  const { t } = useLanguage();
  const position = calculatePosition(numerator, denominator);
  const value = numerator / denominator;
  const numberText = label || `${numerator}/${denominator}`;
  const isNegative = value < 0;

  return (
    <div className="w-full bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 p-6 rounded-3xl border-4 border-purple-300 shadow-xl">
      {showTitle && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-5"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 15, -15, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-3xl"
          >
            📊
          </motion.div>
          <h3 className="text-xl font-extrabold text-gray-800">
            {numberText} on Number Line
          </h3>
        </motion.div>
      )}
      
      <div className="relative h-40 w-full bg-white rounded-2xl shadow-inner p-6 border-2 border-gray-200">
        <svg viewBox="0 0 400 120" className="w-full h-full">
          {/* Main line with animation */}
          <motion.line 
            x1={20} 
            y1={60} 
            x2={380} 
            y2={60} 
            stroke="#64748b" 
            strokeWidth={4} 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
          
          {/* Zero marker (emphasized with bounce) */}
          <motion.line
            x1={200}
            y1={50}
            x2={200}
            y2={70}
            stroke="#1e293b"
            strokeWidth={4}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
          <motion.rect
            x={185}
            y={70}
            width={30}
            height={25}
            fill="#1e293b"
            rx={5}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.7 }}
          />
          <motion.text
            x={200}
            y={87}
            textAnchor="middle"
            fontSize={14}
            fill="white"
            fontWeight="700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            0
          </motion.text>

          {/* Integer markers with bounce animation */}
          {[-2, -1, 1, 2].map((num, idx) => {
            const xPos = 20 + ((num + 2) / 4) * 360;
            return (
              <motion.g
                key={num}
                transform={`translate(${xPos},60)`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.1, type: "spring" }}
              >
                <line x1={0} y1={-15} x2={0} y2={15} stroke="#64748b" strokeWidth={3} />
                <motion.text
                  x={0}
                  y={-25}
                  textAnchor="middle"
                  fontSize={13}
                  fill="#475569"
                  fontWeight="600"
                  animate={{
                    y: [0, -3, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: idx * 0.2
                  }}
                >
                  {num}
                </motion.text>
              </motion.g>
            );
          })}

          {/* Animated Point with jumping effect */}
          {showAnimation && (
            <AnimatePresence mode="wait">
              <motion.g
                key={numberText}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Connecting line from zero with draw animation */}
                <motion.line
                  x1={200}
                  y1={60}
                  x2={20 + (position / 100) * 360}
                  y2={60}
                  stroke={isNegative ? '#ef4444' : '#10b981'}
                  strokeWidth={3}
                  strokeDasharray="5,5"
                  opacity={0.6}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.4 }}
                />
                
                {/* Point circle with jumping animation */}
                <motion.circle
                  cx={20 + (position / 100) * 360}
                  cy={60}
                  r={14}
                  fill={isNegative ? '#ef4444' : '#10b981'}
                  initial={{ r: 6, opacity: 0.6, y: 60 }}
                  animate={{
                    r: 14,
                    opacity: 1,
                    y: [0, -8, 0]
                  }}
                  transition={{
                    r: { duration: 0.8 },
                    opacity: { duration: 0.8 },
                    y: {
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }
                  }}
                  style={{
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                  }}
                />
                
                {/* Pulsing ring around point */}
                <motion.circle
                  cx={20 + (position / 100) * 360}
                  cy={60}
                  r={14}
                  fill="none"
                  stroke={isNegative ? '#ef4444' : '#10b981'}
                  strokeWidth={2}
                  opacity={0.5}
                  animate={{
                    r: [14, 24, 14],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Label with bounce */}
                <motion.text
                  x={20 + (position / 100) * 360}
                  y={35}
                  textAnchor="middle"
                  fontSize={15}
                  fill={isNegative ? '#ef4444' : '#10b981'}
                  fontWeight="800"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{
                    opacity: 1,
                    y: [0, -5, 0]
                  }}
                  transition={{
                    opacity: { delay: 0.6 },
                    y: {
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 0.6
                    }
                  }}
                >
                  {numberText}
                </motion.text>

                {/* Value display with fade in */}
                <motion.text
                  x={20 + (position / 100) * 360}
                  y={95}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#64748b"
                  fontWeight="600"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    opacity: {
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.8
                    }
                  }}
                >
                  ≈ {value.toFixed(3)}
                </motion.text>
              </motion.g>
            </AnimatePresence>
          )}
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-5 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border-l-4 border-blue-500 text-sm text-gray-800 leading-relaxed font-medium"
      >
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="inline-block mr-2 text-lg"
        >
          💡
        </motion.span>
        <strong>Visual Guide:</strong>{' '}
        <AnimatedWords
          text={isNegative
            ? t('rn_visualGuideNegative').replace('{x}', numberText)
            : t('rn_visualGuidePositive').replace('{x}', numberText)}
          className=""
          startDelay={0.1}
          wordDelay={0.035}
          wrapperClassName="inline"
        />
      </motion.div>
    </div>
  );
};

export default AnimatedNumberLine;
