// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: zoom_number_line_tool.tsx
// Redesigned with Singularity Design System
// Colors: #4A4DC9 (Primary Purple), #FF7212 (Primary Orange),
//         #533086→#FC9145 (Gradient), #C1C1EA (Light Purple), #FFF3E4 (Light Orange)
// Font: Poppins | Buttons: Contained/Outlined/Texted with 24px padding, 40px height
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Check, Search, Award, Plus } from 'lucide-react';

// ==================== DESIGN TOKENS (from Singularity PDF) ====================

const DS = {
  // Primary
  purple: '#4A4DC9',
  orange: '#FF7212',
  // Gradient endpoints
  gradientStart: '#533086',
  gradientEnd: '#FC9145',
  // Light / tint variants
  lightPurple: '#C1C1EA',
  lightOrange: '#FFF3E4',
  // Hover / pressed shades
  hoverPurple: '#533086',
  hoverOrange: '#FC9145',
  // Neutrals
  dark: '#4E4E4E',
  grey: '#CACACA',
  lightGrey: '#EBEBEB',
  offWhite: '#F5F5F5',
  white: '#FFFFFF',
  // Semantic
  disabledBg: '#EBEBEB',
  disabledText: '#CACACA',
  // Typography
  fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  // Radii
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 20,
  radiusXl: 24,
  radiusFull: 9999,
  // Spacing
  btnPadX: 24,
  btnPadY: 8,
  btnHeight: 40,
} as const;

// ==================== TYPE DEFINITIONS ====================

type ModeType = 'learn' | 'practice';

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface StepDataInterface {
  id: number;
  title: string;
  description: string;
  type: 'intro' | 'explanation' | 'practice';
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface ZoomLevel {
  min: number;
  max: number;
  divisions: number;
  label: string;
  labelColor: string;
  highlightMin?: number;
  highlightMax?: number;
  highlightColor?: string;
  targetMark?: number;
  targetColor?: string;
}

interface ZoomNumberLineAdditionalProps {
  targetNumber?: number;
  practiceNumber?: number;
  zoomLevels?: ZoomLevel[];
  showMagnifyingGlass?: boolean;
  levelLabels?: string[];
  levelLabelColor?: string;
  highlightColor?: string;
  targetMarkColor?: string;
  animationDurationMs?: number;
}

interface ZoomNumberLineToolProps {
  props?: {
    width?: number;
    height?: number;
    data?: BaseDataInterface;
    steps?: StepDataInterface[];
    initialMode?: ModeType;
    showModeSelector?: boolean;
    enabledModes?: ModeType[];
    showNavigation?: boolean;
    showPlayPause?: boolean;
    showStepIndicator?: boolean;
    initialStep?: number;
    filterSteps?: number[];
    animationSpeed?: number;
    autoPlayDuration?: number;
    themeColor?: string;
    darkMode?: boolean;
    additionalProps?: ZoomNumberLineAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: 'Ones — The Big Picture (0 to 10)',
    description:
      'We start with the whole number line from 0 to 10. To locate 4.185, first find which two whole numbers it lies between. Since 4.185 is between 4 and 5, let\'s zoom into that segment!',
    type: 'intro',
    mode: 'learn',
    data: { zoomLevel: 0 },
  },
  {
    id: 2,
    title: 'Tenths — Zooming In (4.0 to 5.0)',
    description:
      'Now we see the segment 4 to 5, divided into 10 equal parts. Each part is 0.1 (one-tenth). Since 4.185 is between 4.1 and 4.2, let\'s zoom deeper!',
    type: 'explanation',
    mode: 'learn',
    data: { zoomLevel: 1 },
  },
  {
    id: 3,
    title: 'Hundredths — Even Closer (4.10 to 4.20)',
    description:
      'We\'ve zoomed into 4.1 to 4.2, divided into 10 parts. Each part is 0.01 (one-hundredth). 4.185 lies between 4.18 and 4.19. One more zoom!',
    type: 'explanation',
    mode: 'learn',
    data: { zoomLevel: 2 },
  },
  {
    id: 4,
    title: 'Thousandths — Pinpointed! (4.180 to 4.190)',
    description:
      'Now each tiny part is 0.001 (one-thousandth). Count 5 parts from 4.180 and we arrive exactly at 4.185! 🎯 We located it by zooming in three times.',
    type: 'explanation',
    mode: 'learn',
    data: { zoomLevel: 3 },
  },
  {
    id: 5,
    title: 'Your Turn — Locate 9.876!',
    description:
      'Now try it yourself! Click on the correct segment at each zoom level to locate 9.876. Start by clicking the segment between 9 and 10.',
    type: 'practice',
    mode: 'practice',
    data: { zoomLevel: 0, practiceMode: true },
  },
];

// ==================== ANIMATION HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// ==================== KEYFRAMES ====================

const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.06); }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(74,77,201,0.4); }
    50%      { box-shadow: 0 0 24px 8px rgba(74,77,201,0.18); }
  }
  @keyframes pulseGlowOrange {
    0%, 100% { filter: drop-shadow(0 0 0px rgba(255,114,18,0)); }
    50%      { filter: drop-shadow(0 0 14px rgba(255,114,18,0.45)); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes popIn {
    0%   { transform: scale(0); opacity: 0; }
    70%  { transform: scale(1.12); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes magnifyIn {
    0%   { transform: scale(0.3) rotate(-15deg); opacity: 0; }
    60%  { transform: scale(1.15) rotate(4deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes zoomTransition {
    0%   { opacity: 1; transform: scale(1); filter: blur(0px); }
    35%  { opacity: 0; transform: scale(2.2); filter: blur(5px); }
    65%  { opacity: 0; transform: scale(0.55); filter: blur(5px); }
    100% { opacity: 1; transform: scale(1); filter: blur(0px); }
  }
  @keyframes drawLine {
    from { stroke-dashoffset: 2000; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes tickAppear {
    from { transform: scaleY(0); opacity: 0; }
    to   { transform: scaleY(1); opacity: 1; }
  }
  @keyframes bounceIn {
    0%   { transform: scale(0); }
    50%  { transform: scale(1.2); }
    70%  { transform: scale(0.92); }
    100% { transform: scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-5px); }
  }
  @keyframes highlightPulse {
    0%   { opacity: 0.22; }
    50%  { opacity: 0.48; }
    100% { opacity: 0.22; }
  }
  @keyframes ringPulse {
    0%, 100% { stroke-width: 2.5; opacity: 0.7; }
    50%      { stroke-width: 4; opacity: 1; }
  }
  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes subtleRotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes successScale {
    0%   { transform: scale(0) rotate(-30deg); }
    60%  { transform: scale(1.15) rotate(5deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
`;

// ==================== HELPER — gradient string ====================
const gradient = (deg: number = 135) =>
  `linear-gradient(${deg}deg, ${DS.gradientStart} 0%, ${DS.gradientEnd} 100%)`;

// ==================== MAIN COMPONENT ====================

const ZoomNumberLineTool: React.FC<ZoomNumberLineToolProps> = ({
  props = {},
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  /* ---------- configuration with defaults ---------- */
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: (props.initialMode ?? 'learn') as ModeType,
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: (props.enabledModes ?? ['learn', 'practice']) as ModeType[],
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      initialStep: props.initialStep ?? 1,
      filterSteps: props.filterSteps ?? null,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration: props.autoPlayDuration ?? props.data?.autoPlayDuration ?? 0,
      themeColor: props.themeColor ?? DS.purple,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const additionalProps = props.additionalProps || {};
  const toolConfig = useMemo(
    () => ({
      targetNumber: additionalProps.targetNumber ?? 4.185,
      practiceNumber: additionalProps.practiceNumber ?? 9.876,
      showMagnifyingGlass: additionalProps.showMagnifyingGlass ?? true,
      levelLabelColor: additionalProps.levelLabelColor ?? DS.purple,
      highlightColor: additionalProps.highlightColor ?? DS.orange,
      targetMarkColor: additionalProps.targetMarkColor ?? DS.orange,
      animationDurationMs: additionalProps.animationDurationMs ?? 700,
    }),
    [additionalProps],
  );

  /* ---------- zoom level data ---------- */
  const demoZoomLevels: ZoomLevel[] = useMemo(
    () => [
      { min: 0, max: 10, divisions: 10, label: 'Ones', labelColor: DS.purple, highlightMin: 4, highlightMax: 5, highlightColor: DS.orange },
      { min: 4, max: 5, divisions: 10, label: 'Tenths', labelColor: DS.gradientStart, highlightMin: 4.1, highlightMax: 4.2, highlightColor: DS.gradientStart },
      { min: 4.1, max: 4.2, divisions: 10, label: 'Hundredths', labelColor: DS.purple, highlightMin: 4.18, highlightMax: 4.19, highlightColor: DS.purple },
      { min: 4.18, max: 4.19, divisions: 10, label: 'Thousandths', labelColor: DS.gradientStart, targetMark: 4.185, targetColor: DS.orange },
    ],
    [],
  );

  const practiceZoomLevels: ZoomLevel[] = useMemo(
    () => [
      { min: 0, max: 10, divisions: 10, label: 'Ones', labelColor: DS.purple, highlightMin: 9, highlightMax: 10, highlightColor: DS.orange },
      { min: 9, max: 10, divisions: 10, label: 'Tenths', labelColor: DS.gradientStart, highlightMin: 9.8, highlightMax: 9.9, highlightColor: DS.gradientStart },
      { min: 9.8, max: 9.9, divisions: 10, label: 'Hundredths', labelColor: DS.purple, highlightMin: 9.87, highlightMax: 9.88, highlightColor: DS.purple },
      { min: 9.87, max: 9.88, divisions: 10, label: 'Thousandths', labelColor: DS.gradientStart, targetMark: 9.876, targetColor: DS.orange },
    ],
    [],
  );

  /* ---------- state ---------- */
  const allSteps = props.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(() => {
    if (config.filterSteps && config.filterSteps.length > 0)
      return allSteps.filter((s) => config.filterSteps!.includes(s.id));
    return allSteps;
  }, [allSteps, config.filterSteps]);

  const [selectedMode, setSelectedMode] = useState<ModeType>(config.initialMode);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);

  // practice
  const [practiceZoomLevel, setPracticeZoomLevel] = useState(0);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [practiceWrongClick, setPracticeWrongClick] = useState(false);
  const [practiceCorrectSegments, setPracticeCorrectSegments] = useState<number[]>([]);

  const modeSteps = useMemo(
    () => availableSteps.filter((s) => s.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const currentStep = modeSteps[currentStepIndex] || modeSteps[0];
  const containerRef = useRef<HTMLDivElement>(null);

  /* ---------- inject keyframes ---------- */
  useEffect(() => {
    const id = 'zoom-nl-singularity-kf';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id;
      s.textContent = keyframes;
      document.head.appendChild(s);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) document.head.removeChild(el);
    };
  }, []);

  /* ---------- step details callback ---------- */
  useEffect(() => {
    setStepDetails?.({
      currentStep: currentStepIndex + 1,
      totalSteps: modeSteps.length,
      isPaused: !isPlaying,
      currentMode: selectedMode,
    });
  }, [currentStepIndex, modeSteps.length, isPlaying, selectedMode]);

  /* ---------- auto-play ---------- */
  useEffect(() => {
    if (!isPlaying || config.autoPlayDuration <= 0) return;
    const t = setInterval(() => goToNextStep(), config.autoPlayDuration);
    return () => clearInterval(t);
  }, [isPlaying, config.autoPlayDuration, currentStepIndex, modeSteps.length]);

  /* ---------- navigation helpers ---------- */
  const triggerTransition = useCallback(() => {
    setIsTransitioning(true);
    setShowMagnifier(true);
    setTimeout(() => {
      setShowMagnifier(false);
      setIsTransitioning(false);
      setAnimKey((k) => k + 1);
    }, toolConfig.animationDurationMs);
  }, [toolConfig.animationDurationMs]);

  const goToNextStep = useCallback(() => {
    if (currentStepIndex < modeSteps.length - 1) {
      triggerTransition();
      setTimeout(() => setCurrentStepIndex((p) => p + 1), toolConfig.animationDurationMs * 0.4);
    } else setIsPlaying(false);
  }, [currentStepIndex, modeSteps.length, triggerTransition]);

  const goToPrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      triggerTransition();
      setTimeout(() => setCurrentStepIndex((p) => p - 1), toolConfig.animationDurationMs * 0.4);
    }
  }, [currentStepIndex, triggerTransition]);

  const handleModeChange = useCallback((mode: ModeType) => {
    setSelectedMode(mode);
    setCurrentStepIndex(0);
    setAnimKey((k) => k + 1);
    setPracticeZoomLevel(0);
    setPracticeCompleted(false);
    setPracticeCorrectSegments([]);
    setPracticeWrongClick(false);
  }, []);

  const resetPractice = useCallback(() => {
    setPracticeZoomLevel(0);
    setPracticeCompleted(false);
    setPracticeCorrectSegments([]);
    setPracticeWrongClick(false);
    setAnimKey((k) => k + 1);
  }, []);

  /* ---------- practice click handler ---------- */
  const handlePracticeSegmentClick = useCallback(
    (segIndex: number, zoomLvl: number) => {
      const levels = practiceZoomLevels;
      const level = levels[zoomLvl];
      if (!level) return;

      const stepSize = (level.max - level.min) / level.divisions;

      if (level.targetMark !== undefined && !level.highlightMin) {
        const targetIndex = Math.round((level.targetMark - level.min) / stepSize);
        if (segIndex === targetIndex) {
          setPracticeCompleted(true);
          setPracticeCorrectSegments((p) => [...p, zoomLvl]);
        } else {
          setPracticeWrongClick(true);
          setTimeout(() => setPracticeWrongClick(false), 800);
        }
        return;
      }

      if (level.highlightMin === undefined || level.highlightMax === undefined) return;
      const segStart = level.min + segIndex * stepSize;
      const segEnd = segStart + stepSize;

      if (
        Math.abs(segStart - level.highlightMin) < 1e-9 &&
        Math.abs(segEnd - level.highlightMax) < 1e-9
      ) {
        setPracticeCorrectSegments((p) => [...p, zoomLvl]);
        triggerTransition();
        setTimeout(() => {
          setPracticeZoomLevel((p) => p + 1);
          setAnimKey((k) => k + 1);
        }, toolConfig.animationDurationMs * 0.4);
      } else {
        setPracticeWrongClick(true);
        setTimeout(() => setPracticeWrongClick(false), 800);
      }
    },
    [practiceZoomLevels, triggerTransition, toolConfig.animationDurationMs],
  );

  // ==================== SVG NUMBER LINE RENDERER ====================
  const renderNumberLine = useCallback(
    (level: ZoomLevel, isPractice: boolean, practiceZLevel: number, svgW: number, svgH: number) => {
      const pad = 54;
      const lineY = svgH * 0.52;
      const x0 = pad + 10;
      const x1 = svgW - pad - 10;
      const len = x1 - x0;
      const stepSize = (level.max - level.min) / level.divisions;
      const tickSp = len / level.divisions;
      const fmt = (n: number): string => {
        const d = Math.max(0, Math.ceil(-Math.log10(stepSize + 1e-15)));
        return n.toFixed(Math.min(d, 3));
      };

      const els: JSX.Element[] = [];

      /* --- gradient defs --- */
      els.push(
        <defs key="defs">
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={DS.gradientStart} />
            <stop offset="100%" stopColor={DS.gradientEnd} />
          </linearGradient>
          <linearGradient id="hlGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={level.highlightColor || DS.orange} stopOpacity="0.35" />
            <stop offset="100%" stopColor={level.highlightColor || DS.orange} stopOpacity="0.15" />
          </linearGradient>
          <filter id="glowOrange">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowPurple">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>,
      );

      /* --- main line --- */
      els.push(
        <line
          key="line"
          x1={x0} y1={lineY} x2={x1} y2={lineY}
          stroke="url(#lineGrad)" strokeWidth={3} strokeLinecap="round"
          style={{ strokeDasharray: 2000, strokeDashoffset: 0, animation: 'drawLine 0.9s ease-out forwards' }}
        />,
      );

      /* --- arrows --- */
      els.push(
        <polygon key="arrL" points={`${x0 - 8},${lineY} ${x0 + 3},${lineY - 6} ${x0 + 3},${lineY + 6}`} fill={DS.gradientStart}
          style={{ animation: 'popIn 0.5s ease-out 0.3s both' }} />,
      );
      els.push(
        <polygon key="arrR" points={`${x1 + 8},${lineY} ${x1 - 3},${lineY - 6} ${x1 - 3},${lineY + 6}`} fill={DS.gradientEnd}
          style={{ animation: 'popIn 0.5s ease-out 0.3s both' }} />,
      );

      /* --- highlight segment --- */
      if (level.highlightMin !== undefined && level.highlightMax !== undefined && level.highlightColor) {
        const hx0 = x0 + ((level.highlightMin - level.min) / (level.max - level.min)) * len;
        const hx1 = x0 + ((level.highlightMax - level.min) / (level.max - level.min)) * len;
        els.push(
          <rect key="hl-bg" x={hx0} y={lineY - 30} width={hx1 - hx0} height={60} rx={8}
            fill="url(#hlGrad)"
            style={{ animation: 'highlightPulse 2s ease-in-out infinite' }} />,
        );
        els.push(
          <rect key="hl-bar" x={hx0} y={lineY - 3.5} width={hx1 - hx0} height={7} rx={3.5}
            fill={level.highlightColor} opacity={0.75}
            style={{ animation: 'fadeInScale 0.6s ease-out 0.7s both' }} />,
        );
        /* bracket lines */
        els.push(
          <line key="hl-l" x1={hx0} y1={lineY - 30} x2={hx0} y2={lineY + 30}
            stroke={level.highlightColor} strokeWidth={2} strokeDasharray="4 3" opacity={0.5}
            style={{ animation: 'tickAppear 0.4s ease-out 0.9s both' }} />,
        );
        els.push(
          <line key="hl-r" x1={hx1} y1={lineY - 30} x2={hx1} y2={lineY + 30}
            stroke={level.highlightColor} strokeWidth={2} strokeDasharray="4 3" opacity={0.5}
            style={{ animation: 'tickAppear 0.4s ease-out 1s both' }} />,
        );
      }

      /* --- ticks & labels --- */
      for (let i = 0; i <= level.divisions; i++) {
        const cx = x0 + i * tickSp;
        const val = level.min + i * stepSize;
        const isHL =
          level.highlightMin !== undefined &&
          (Math.abs(val - level.highlightMin) < 1e-9 || Math.abs(val - (level.highlightMax ?? 0)) < 1e-9);
        const isMajor = i === 0 || i === level.divisions;
        const th = isMajor ? 18 : isHL ? 16 : 11;

        els.push(
          <line key={`t${i}`} x1={cx} y1={lineY - th} x2={cx} y2={lineY + th}
            stroke={isHL ? (level.highlightColor || DS.orange) : DS.dark}
            strokeWidth={isHL ? 2.5 : isMajor ? 2 : 1.2}
            strokeLinecap="round"
            style={{ transformOrigin: `${cx}px ${lineY}px`, animation: `tickAppear 0.35s ease-out ${0.25 + i * 0.04}s both` }} />,
        );

        const showLbl = isMajor || level.divisions <= 10;
        if (showLbl) {
          els.push(
            <text key={`lb${i}`} x={cx} y={lineY + th + 20} textAnchor="middle"
              fontSize={isMajor ? 13 : 11}
              fontFamily={DS.fontFamily}
              fontWeight={isMajor || isHL ? 700 : 500}
              fill={isHL ? (level.highlightColor || DS.orange) : DS.dark}
              style={{ animation: `fadeInUp 0.35s ease-out ${0.3 + i * 0.04}s both` }}>
              {fmt(val)}
            </text>,
          );
        }
      }

      /* --- target mark --- */
      if (level.targetMark !== undefined && level.targetColor) {
        const tx = x0 + ((level.targetMark - level.min) / (level.max - level.min)) * len;
        // outer ring
        els.push(
          <circle key="tgt-o" cx={tx} cy={lineY} r={16} fill="none"
            stroke={level.targetColor} strokeWidth={3}
            filter="url(#glowOrange)"
            style={{ animation: 'ringPulse 1.8s ease-in-out infinite, bounceIn 0.6s ease-out 0.9s both' }} />,
        );
        // inner fill
        els.push(
          <circle key="tgt-i" cx={tx} cy={lineY} r={7} fill={level.targetColor}
            style={{ animation: 'bounceIn 0.6s ease-out 0.9s both' }} />,
        );
        // label
        els.push(
          <text key="tgt-lb" x={tx} y={lineY - 30} textAnchor="middle" fontSize={15}
            fontFamily={DS.fontFamily} fontWeight={800} fill={level.targetColor}
            style={{ animation: 'popIn 0.5s ease-out 1.1s both' }}>
            {fmt(level.targetMark)}
          </text>,
        );
        // animated arrow
        els.push(
          <polygon key="tgt-ar"
            points={`${tx},${lineY - 20} ${tx - 5},${lineY - 27} ${tx + 5},${lineY - 27}`}
            fill={level.targetColor}
            style={{ animation: 'float 1.6s ease-in-out infinite, popIn 0.5s ease-out 1.1s both' }} />,
        );
      }

      /* --- practice click areas --- */
      if (isPractice) {
        for (let i = 0; i < level.divisions; i++) {
          const sx = x0 + i * tickSp;
          els.push(
            <rect key={`ps${i}`} x={sx} y={lineY - 32} width={tickSp} height={64}
              fill="transparent" rx={4}
              style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              onMouseEnter={(e) => (e.target as SVGRectElement).setAttribute('fill', `${DS.lightPurple}44`)}
              onMouseLeave={(e) => (e.target as SVGRectElement).setAttribute('fill', 'transparent')}
              onClick={() => handlePracticeSegmentClick(i, practiceZLevel)} />,
          );
        }
      }

      return els;
    },
    [handlePracticeSegmentClick],
  );

  // ==================== LEVEL BADGE ====================
  const renderLevelBadge = useCallback((label: string, color: string) => (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: `${DS.btnPadY}px ${DS.btnPadX}px`,
      borderRadius: DS.radiusFull,
      background: `linear-gradient(135deg, ${color} 0%, ${DS.gradientEnd} 140%)`,
      color: DS.white,
      fontFamily: DS.fontFamily, fontWeight: 700, fontSize: 13, letterSpacing: 0.4,
      animation: 'popIn 0.5s ease-out 0.15s both',
      boxShadow: `0 4px 16px ${color}33`,
      height: DS.btnHeight,
      boxSizing: 'border-box' as const,
    }}>
      <Search size={15} /> {label}
    </div>
  ), []);

  // ==================== MAGNIFIER OVERLAY ====================
  const renderMagnifier = useCallback(() => {
    if (!showMagnifier) return null;
    return (
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', zIndex: 100,
        animation: 'magnifyIn 0.55s ease-out forwards', pointerEvents: 'none',
      }}>
        <div style={{
          width: 90, height: 90, borderRadius: '50%',
          background: `linear-gradient(135deg, ${DS.lightPurple}66, ${DS.lightOrange}66)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
          border: `3px solid ${DS.purple}44`,
        }}>
          <Search size={42} color={DS.purple} strokeWidth={2.2} />
        </div>
      </div>
    );
  }, [showMagnifier]);

  // ==================== PRACTICE COMPLETE OVERLAY ====================
  const renderPracticeComplete = useCallback(() => {
    if (!practiceCompleted) return null;
    return (
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(8px)', zIndex: 200,
        animation: 'fadeInScale 0.45s ease-out forwards',
      }}>
        {/* decorative ring */}
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: DS.lightOrange,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'successScale 0.6s ease-out 0.15s both',
          boxShadow: `0 8px 32px ${DS.orange}22`,
        }}>
          <Award size={52} color={DS.orange} strokeWidth={2} />
        </div>
        <div style={{
          fontFamily: DS.fontFamily, fontSize: 26, fontWeight: 800,
          background: gradient(), WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginTop: 14, animation: 'fadeInUp 0.45s ease-out 0.35s both',
        } as any}>
          Excellent! 🎉
        </div>
        <div style={{
          fontFamily: DS.fontFamily, fontSize: 14, color: DS.dark,
          marginTop: 6, textAlign: 'center', animation: 'fadeInUp 0.45s ease-out 0.5s both',
        }}>
          You located <strong style={{ color: DS.orange }}>9.876</strong> by zooming step by step!
        </div>
        {/* Contained button (Singularity style) */}
        <button onClick={resetPractice} style={{
          marginTop: 22, height: DS.btnHeight,
          padding: `0 ${DS.btnPadX}px`, borderRadius: DS.radiusFull,
          border: 'none', cursor: 'pointer',
          background: DS.purple, color: DS.white,
          fontFamily: DS.fontFamily, fontWeight: 700, fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'all 0.3s ease',
          animation: 'fadeInUp 0.45s ease-out 0.65s both',
          boxShadow: `0 4px 16px ${DS.purple}33`,
        }}
          onMouseEnter={(e) => {
            const b = e.currentTarget; b.style.background = DS.hoverPurple; b.style.transform = 'scale(1.04)';
            b.style.boxShadow = `0 6px 20px ${DS.purple}44`;
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget; b.style.background = DS.purple; b.style.transform = 'scale(1)';
            b.style.boxShadow = `0 4px 16px ${DS.purple}33`;
          }}>
          <RotateCcw size={15} /> Try Again
        </button>
      </div>
    );
  }, [practiceCompleted, resetPractice]);

  // ==================== CURRENT ZOOM RENDER ====================
  const renderCurrentZoom = useCallback(() => {
    const isPractice = currentStep?.data?.practiceMode;
    const zoomLevel = isPractice ? practiceZoomLevel : (currentStep?.data?.zoomLevel ?? 0);
    const levels = isPractice ? practiceZoomLevels : demoZoomLevels;
    const level = levels[zoomLevel];
    if (!level) return null;

    const svgW = config.width - 48;
    const svgH = 195;

    return (
      <div key={`z-${animKey}-${zoomLevel}`} style={{
        position: 'relative',
        animation: isTransitioning
          ? `zoomTransition ${toolConfig.animationDurationMs}ms ease-in-out forwards`
          : 'fadeInScale 0.55s ease-out forwards',
      }}>
        {/* Level badge */}
        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          {renderLevelBadge(level.label, level.labelColor)}
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 12, animation: 'fadeInUp 0.4s ease-out 0.25s both' }}>
          {levels.map((l, i) => (
            <div key={i} style={{
              width: i <= zoomLevel ? 30 : 10, height: 6, borderRadius: 3,
              background: i < zoomLevel ? DS.purple : (i === zoomLevel ? `linear-gradient(90deg, ${DS.purple}, ${DS.orange})` : DS.lightGrey),
              transition: 'all 0.45s ease', opacity: i <= zoomLevel ? 1 : 0.35,
            }} />
          ))}
        </div>

        {/* SVG */}
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}
          style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}>
          {renderNumberLine(level, isPractice, zoomLevel, svgW, svgH)}
        </svg>

        {/* Wrong click toast */}
        {practiceWrongClick && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: `linear-gradient(135deg, #e53e3e, #c53030)`, color: DS.white,
            padding: '10px 24px', borderRadius: DS.radiusFull,
            fontFamily: DS.fontFamily, fontWeight: 700, fontSize: 13,
            animation: 'popIn 0.3s ease-out forwards', zIndex: 50,
            boxShadow: '0 4px 20px rgba(229,62,62,0.3)',
          }}>
            Not quite — try another segment!
          </div>
        )}

        {/* Practice hint */}
        {isPractice && !practiceCompleted && (
          <div style={{
            textAlign: 'center', marginTop: 10,
            fontFamily: DS.fontFamily, fontSize: 12.5, color: DS.grey,
            animation: 'fadeInUp 0.5s ease-out 0.5s both',
          }}>
            {zoomLevel < 3
              ? `👆 Click the segment that contains ${toolConfig.practiceNumber}`
              : `👆 Click the exact position of ${toolConfig.practiceNumber}`}
          </div>
        )}
      </div>
    );
  }, [currentStep, practiceZoomLevel, animKey, isTransitioning, config.width,
    demoZoomLevels, practiceZoomLevels, renderNumberLine, renderLevelBadge,
    practiceWrongClick, practiceCompleted, toolConfig]);

  // ==================== STEP DOTS ====================
  const renderProgressDots = useCallback(() => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
      {modeSteps.map((_, i) => (
        <div key={i} onClick={() => {
          if (selectedMode === 'learn') {
            triggerTransition();
            setTimeout(() => setCurrentStepIndex(i), toolConfig.animationDurationMs * 0.4);
          }
        }} style={{
          width: i === currentStepIndex ? 28 : 10, height: 10, borderRadius: 5,
          background: i === currentStepIndex
            ? `linear-gradient(90deg, ${DS.purple}, ${DS.orange})`
            : (i < currentStepIndex ? DS.lightPurple : DS.lightGrey),
          cursor: selectedMode === 'learn' ? 'pointer' : 'default',
          transition: 'all 0.4s ease',
        }} />
      ))}
    </div>
  ), [modeSteps, currentStepIndex, selectedMode, triggerTransition, toolConfig.animationDurationMs]);

  // ==================== DS BUTTON COMPONENT ====================
  const DSButton = useCallback(({
    children, onClick, disabled, variant = 'contained',
    style: extraStyle = {},
  }: {
    children: React.ReactNode; onClick?: () => void; disabled?: boolean;
    variant?: 'contained' | 'outlined' | 'text' | 'highlight';
    style?: React.CSSProperties;
  }) => {
    const base: React.CSSProperties = {
      height: DS.btnHeight,
      padding: `0 ${DS.btnPadX}px`,
      borderRadius: DS.radiusFull,
      fontFamily: DS.fontFamily,
      fontWeight: 700,
      fontSize: 13,
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      transition: 'all 0.3s ease',
      border: 'none',
      outline: 'none',
      boxSizing: 'border-box' as const,
    };

    const variants: Record<string, React.CSSProperties> = {
      contained: {
        background: disabled ? DS.disabledBg : DS.purple,
        color: disabled ? DS.disabledText : DS.white,
        boxShadow: disabled ? 'none' : `0 4px 16px ${DS.purple}28`,
      },
      outlined: {
        background: 'transparent',
        color: disabled ? DS.disabledText : DS.purple,
        border: `2px solid ${disabled ? DS.disabledBg : DS.purple}`,
      },
      text: {
        background: 'transparent',
        color: disabled ? DS.disabledText : DS.purple,
      },
      highlight: {
        background: disabled ? DS.disabledBg : DS.orange,
        color: disabled ? DS.disabledText : DS.white,
        boxShadow: disabled ? 'none' : `0 4px 16px ${DS.orange}28`,
      },
    };

    return (
      <button onClick={disabled ? undefined : onClick}
        style={{ ...base, ...variants[variant], ...extraStyle, opacity: disabled ? 0.55 : 1 }}
        onMouseEnter={(e) => {
          if (disabled) return;
          const b = e.currentTarget;
          b.style.transform = 'scale(1.04)';
          if (variant === 'contained') { b.style.background = DS.hoverPurple; b.style.boxShadow = `0 6px 22px ${DS.purple}38`; }
          if (variant === 'highlight') { b.style.background = DS.hoverOrange; b.style.boxShadow = `0 6px 22px ${DS.orange}38`; }
          if (variant === 'outlined') { b.style.background = DS.lightPurple + '33'; }
          if (variant === 'text') { b.style.background = DS.lightPurple + '22'; }
        }}
        onMouseLeave={(e) => {
          if (disabled) return;
          const b = e.currentTarget;
          b.style.transform = 'scale(1)';
          b.style.background = (variants[variant].background as string) || 'transparent';
          b.style.boxShadow = (variants[variant].boxShadow as string) || 'none';
        }}
        onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.96)'; }}
        onMouseUp={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(1.04)'; }}>
        {children}
      </button>
    );
  }, []);

  // ==================== MAIN RENDER ====================
  return (
    <div ref={containerRef} style={{
      width: config.width, maxWidth: '100%', minHeight: config.height,
      background: DS.white, borderRadius: DS.radiusXl,
      overflow: 'hidden',
      boxShadow: '0 20px 60px -15px rgba(74,77,201,0.12), 0 4px 20px rgba(0,0,0,0.06)',
      display: 'flex', flexDirection: 'column',
      fontFamily: DS.fontFamily, position: 'relative',
      border: `1px solid ${DS.lightGrey}`,
    }}>
      {/* ═══ HEADER ═══ */}
      <div style={{
        background: gradient(),
        backgroundSize: '200% 200%',
        animation: 'gradientShift 8s ease infinite',
        padding: '18px 24px',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left — title block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, animation: 'slideInLeft 0.5s ease-out forwards' }}>
            <div style={{
              width: 42, height: 42, borderRadius: DS.radiusMd,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <Search size={20} color={DS.white} />
            </div>
            <div>
              <div style={{ color: DS.white, fontSize: 16, fontWeight: 800, letterSpacing: 0.2 }}>
                Zooming Into Number Lines
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 500 }}>
                Locate precise decimals by progressive magnification
              </div>
            </div>
          </div>

          {/* Right — mode selector */}
          {config.showModeSelector && (
            <div style={{
              display: 'flex', gap: 4,
              background: 'rgba(0,0,0,0.18)', borderRadius: DS.radiusFull, padding: 3,
              animation: 'slideInRight 0.5s ease-out forwards',
            }}>
              {config.enabledModes.map((mode) => (
                <button key={mode} onClick={() => handleModeChange(mode)} style={{
                  padding: '6px 18px', borderRadius: DS.radiusFull, border: 'none', cursor: 'pointer',
                  background: selectedMode === mode ? DS.white : 'transparent',
                  color: selectedMode === mode ? DS.purple : 'rgba(255,255,255,0.65)',
                  fontFamily: DS.fontFamily, fontWeight: 700, fontSize: 12,
                  transition: 'all 0.3s ease', textTransform: 'capitalize',
                }}>
                  {mode === 'learn' ? '📖 Learn' : '🎯 Practice'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ STEP INFO ═══ */}
      <div style={{
        padding: '16px 24px 8px',
        animation: 'fadeInUp 0.45s ease-out forwards',
        borderBottom: `1px solid ${DS.offWhite}`,
      }}>
        <div style={{
          fontSize: 16, fontWeight: 800,
          background: gradient(), WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 4,
        } as any}>
          {currentStep?.title}
        </div>
        <div style={{ fontSize: 13, color: DS.dark, lineHeight: 1.6, fontWeight: 500 }}>
          {currentStep?.description}
        </div>
      </div>

      {/* ═══ MAIN CANVAS ═══ */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '12px 20px 16px', position: 'relative', minHeight: 290,
        background: `radial-gradient(circle at 50% 80%, ${DS.lightPurple}11 0%, transparent 70%)`,
      }}>
        {renderMagnifier()}
        {renderPracticeComplete()}
        {renderCurrentZoom()}
      </div>

      {/* ═══ FOOTER — Learn navigation ═══ */}
      {config.showNavigation && selectedMode === 'learn' && (
        <div style={{
          padding: '14px 24px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: `1px solid ${DS.offWhite}`,
          background: DS.offWhite + '88',
        }}>
          <DSButton variant="outlined" onClick={goToPrevStep} disabled={currentStepIndex === 0}>
            <ChevronLeft size={16} /> Previous
          </DSButton>

          {config.showStepIndicator && renderProgressDots()}

          <DSButton variant="highlight" onClick={goToNextStep} disabled={currentStepIndex === modeSteps.length - 1}>
            Next Zoom <ChevronRight size={16} />
          </DSButton>
        </div>
      )}

      {/* ═══ FOOTER — Practice ═══ */}
      {selectedMode === 'practice' && !practiceCompleted && (
        <div style={{
          padding: '14px 24px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: `1px solid ${DS.offWhite}`,
          background: DS.offWhite + '88',
        }}>
          <DSButton variant="outlined" onClick={resetPractice}>
            <RotateCcw size={15} /> Reset
          </DSButton>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            {practiceZoomLevels.map((l, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 14px', borderRadius: DS.radiusFull,
                background: i < practiceZoomLevel ? DS.lightPurple + '55' : (i === practiceZoomLevel ? DS.lightOrange : DS.offWhite),
                border: i === practiceZoomLevel ? `2px solid ${DS.orange}` : `1px solid ${DS.lightGrey}`,
                fontSize: 11, fontWeight: 700, color: i <= practiceZoomLevel ? DS.purple : DS.grey,
                transition: 'all 0.35s ease',
              }}>
                {i < practiceZoomLevel && <Check size={12} color={DS.purple} strokeWidth={3} />}
                {l.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoomNumberLineTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════