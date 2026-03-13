// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: parallel_line_constructor.tsx
// ═══════════════════════════════════════════════════════════════════════════

/** Self-contained (no external React/icon imports) for typecheck without @types/react. */
declare const React: any;
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface Element {}
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}
type ReactNode = any;
type FC<P = {}> = (props: P) => any;

const { useState, useEffect, useRef, useCallback, useMemo } = React;

type IconProps = { size?: number; style?: any; color?: string; [key: string]: any };
const IconBase = ({
  size = 16,
  style,
  color,
  children,
}: IconProps & { children?: ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color ?? "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);
const Play = (p: IconProps) => (
  <IconBase {...p}><path d="M8 5v14l11-7z" /></IconBase>
);
const Pause = (p: IconProps) => (
  <IconBase {...p}><path d="M6 4h4v16H6z" /><path d="M14 4h4v16h-4z" /></IconBase>
);
const ChevronLeft = (p: IconProps) => (
  <IconBase {...p}><path d="M15 18l-6-6 6-6" /></IconBase>
);
const ChevronRight = (p: IconProps) => (
  <IconBase {...p}><path d="M9 18l6-6-6-6" /></IconBase>
);
const RotateCcw = (p: IconProps) => (
  <IconBase {...p}><path d="M3 2v6h6" /><path d="M3.5 13a9 9 0 1 0 2-5.7L3 8" /></IconBase>
);
const Check = (p: IconProps) => (
  <IconBase {...p}><path d="M20 6L9 17l-5-5" /></IconBase>
);
const X = (p: IconProps) => (
  <IconBase {...p}><path d="M18 6L6 18" /><path d="M6 6l12 12" /></IconBase>
);
const BookOpen = (p: IconProps) => (
  <IconBase {...p}><path d="M12 19c-2.5-1.6-5-2-8-2V5c3 0 5.5.4 8 2" /><path d="M12 19c2.5-1.6 5-2 8-2V5c-3 0-5.5.4-8 2" /></IconBase>
);
const Target = (p: IconProps) => (
  <IconBase {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M22 12h-2" /><path d="M12 22v-2" /><path d="M2 12h2" /></IconBase>
);
const Zap = (p: IconProps) => (
  <IconBase {...p}><path d="M13 2L3 14h7l-1 8 12-14h-7l-1-6z" /></IconBase>
);
const Eye = (p: IconProps) => (
  <IconBase {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></IconBase>
);
const Award = (p: IconProps) => (
  <IconBase {...p}><path d="M12 2l2.2 4.4 4.8.7-3.5 3.4.8 4.8L12 13.8 7.7 15.3l.8-4.8L5 7.1l4.8-.7L12 2z" /><path d="M8 14v8l4-2 4 2v-8" /></IconBase>
);

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "explore" | "real_world";

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
  teachingNote?: string;
  type: "intro" | "explanation" | "practice" | "real_world" | "explore";
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface ParallelLineAdditionalProps {
  initialAngle?: number;
  minAngle?: number;
  maxAngle?: number;
  showProtractor?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  highlightCorresponding?: boolean;
  lineColorL?: string;
  lineColorM?: string;
  transversalColor?: string;
  angleHighlightColor?: string;
}

interface ParallelLineConstructorProps {
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
    additionalProps?: ParallelLineAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  colors: {
    primary: "#4A4DC9",
    accent: "#FF7212",
    deepPurple: "#533086",
    orange: "#FC9145",
    lightPurple: "#C1C1EA",
    lightOrange: "#FFF3E4",
    gray900: "#4E4E4E",
    gray400: "#CACACA",
    gray200: "#EBEBEB",
    gray100: "#F5F5F5",
    white: "#FFFFFF",
    success: "#22C55E",
    error: "#EF4444",
    bgGradient: "linear-gradient(135deg, #533086 0%, #FC9145 100%)",
    bgGradientSubtle: "linear-gradient(135deg, #C1C1EA 0%, #FFF3E4 100%)",
  },
  font: "'Poppins', sans-serif",
  radius: { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 },
  shadow: {
    sm: "0 2px 8px rgba(74,77,201,0.08)",
    md: "0 4px 16px rgba(74,77,201,0.12)",
    lg: "0 8px 32px rgba(74,77,201,0.16)",
    glow: "0 0 24px rgba(74,77,201,0.25)",
  },
};

// ==================== MCQ QUESTIONS ====================

const MCQ_QUESTIONS: MCQQuestion[] = [
  {
    id: 1,
    question:
      "When a transversal intersects two parallel lines, the corresponding angles are:",
    options: [
      "Always supplementary (add to 180°)",
      "Always equal",
      "Always complementary (add to 90°)",
      "Sometimes equal, sometimes not",
    ],
    correctIndex: 1,
    explanation:
      "Corresponding angles formed by a transversal on parallel lines are always equal. This is the key property we used to construct parallel lines!",
  },
  {
    id: 2,
    question:
      "In our construction, if ∠a at point X is 60°, what should ∠b at point Y be to make lines l and m parallel?",
    options: ["120°", "90°", "60°", "30°"],
    correctIndex: 2,
    explanation:
      "For lines l and m to be parallel, the corresponding angle ∠b must equal ∠a. Since ∠a = 60°, ∠b must also be 60°.",
  },
  {
    id: 3,
    question:
      "A transversal crosses two lines making corresponding angles of 75° and 85°. Are the two lines parallel?",
    options: [
      "Yes, because both angles are acute",
      "Yes, because they add up to 160°",
      "No, because corresponding angles are not equal",
      "Cannot be determined",
    ],
    correctIndex: 2,
    explanation:
      "The lines are NOT parallel. For lines to be parallel, corresponding angles must be exactly equal. Here 75° ≠ 85°, so the lines will eventually meet.",
  },
  {
    id: 4,
    question:
      "When a transversal intersects two lines forming 8 angles, what is the maximum number of distinct angle values possible?",
    options: ["8", "6", "4", "2"],
    correctIndex: 2,
    explanation:
      "At each intersection, vertically opposite angles are equal, giving at most 2 distinct values per point. Across both points, maximum 4 distinct values. If lines are parallel, it reduces to just 2!",
  },
  {
    id: 5,
    question:
      "If a transversal is perpendicular to line l (making 90°), what angle must it make with line m for l ∥ m?",
    options: ["45°", "180°", "90°", "60°"],
    correctIndex: 2,
    explanation:
      "If the transversal is perpendicular to l (90°), it must also be perpendicular to m (90°) for the corresponding angles to be equal, making l ∥ m.",
  },
];

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Draw Line l and Transversal t",
    description:
      "We begin by drawing a horizontal line l and a diagonal transversal t crossing it at point X. Two lines meeting always create angles!",
    teachingNote:
      "Ask: How many distinct angles form when two lines cross? Answer: 2 distinct values — they are linear pairs adding to 180°.",
    type: "intro",
    mode: "learn",
  },
  {
    id: 2,
    title: "Measure ∠a with a Protractor",
    description:
      "Place a protractor at point X. The angle ∠a between line l and transversal t measures 60°. Its supplementary partner is 120°.",
    teachingNote:
      "Since linear pairs sum to 180°, knowing one angle gives the other. Two distinct values: 60° and 120°.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 3,
    title: "Mark Point Y on Transversal",
    description:
      "We mark a new point Y on the transversal below X. This is where our second line m will pass through.",
    teachingNote:
      "Ask: What angle at Y would give only 2 distinct angle values across both intersections? The same angle — 60°!",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 4,
    title: "Draw Line m at Equal Angle",
    description:
      "Draw line m through Y making the same 60° angle with the transversal. Now ∠a = ∠b — the corresponding angles are EQUAL!",
    teachingNote:
      "These equal angles at matching positions are called corresponding angles. Equal corresponding angles ⟹ parallel lines.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 5,
    title: "Lines l and m are Parallel!",
    description:
      "Extend both lines as far as you like — they NEVER meet! Equal corresponding angles always guarantee parallel lines.",
    teachingNote:
      "This is a proof-level result: equal corresponding angles ↔ parallel lines. It works both ways!",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 6,
    title: "Explore with the Angle Slider",
    description:
      "Drag the slider to change the starting angle. For ANY value between 10° and 170°, equal corresponding angles always produce parallel lines!",
    teachingNote:
      "Let students experiment freely. The visual proof holds for every angle — this is the universality of the property.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 10,
    title: "Test Your Understanding",
    description:
      "Answer 5 multiple-choice questions about corresponding angles and parallel lines.",
    type: "practice",
    mode: "practice",
  },
  {
    id: 20,
    title: "Free Exploration",
    description:
      "Move the angle slider freely. Try extreme angles near 10° and 170° — the lines stay parallel!",
    type: "explore",
    mode: "explore",
  },
  {
    id: 30,
    title: "Parallel Lines in India",
    description:
      "Think of two chauraha crossings on a National Highway. If the highway meets both crossroads at the same angle, those crossroads run parallel — exactly like our lines l and m!",
    type: "real_world",
    mode: "real_world",
  },
];

// ==================== ANIMATION HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeOutBounce = (t: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

// ==================== MAIN COMPONENT ====================

type ParallelLineConstructorInnerProps =
  NonNullable<ParallelLineConstructorProps["props"]>;

const ParallelLineConstructor: FC<ParallelLineConstructorProps> = ({
  props: incomingProps,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const props: ParallelLineConstructorInnerProps = incomingProps ?? {};
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: props.initialMode ?? "learn",
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: props.enabledModes ?? [
        "learn",
        "practice",
        "explore",
        "real_world",
      ],
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      initialStep: props.initialStep ?? 1,
      filterSteps: props.filterSteps ?? null,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration: props.autoPlayDuration ?? 0,
      themeColor: props.themeColor ?? DS.colors.primary,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const additionalProps: ParallelLineAdditionalProps = props.additionalProps ?? {};
  const toolConfig = useMemo(
    () => ({
      initialAngle: additionalProps.initialAngle ?? 60,
      minAngle: additionalProps.minAngle ?? 10,
      maxAngle: additionalProps.maxAngle ?? 170,
      showProtractor: additionalProps.showProtractor ?? true,
      showGrid: additionalProps.showGrid ?? true,
      showLabels: additionalProps.showLabels ?? true,
      highlightCorresponding: additionalProps.highlightCorresponding ?? true,
      lineColorL: additionalProps.lineColorL ?? DS.colors.deepPurple,
      lineColorM: additionalProps.lineColorM ?? DS.colors.deepPurple,
      transversalColor: additionalProps.transversalColor ?? DS.colors.gray900,
      angleHighlightColor:
        additionalProps.angleHighlightColor ?? DS.colors.accent,
    }),
    [additionalProps],
  );

  // ─── STATE ───
  const allSteps = props.steps || DEFAULT_STEPS;
  const [selectedMode, setSelectedMode] = useState(
    config.initialMode as ModeType,
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [angle, setAngle] = useState(toolConfig.initialAngle);
  const [stepAnimPhase, setStepAnimPhase] = useState(0);
  const [showTeachingNote, setShowTeachingNote] = useState(false);
  const [glowLines, setGlowLines] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null as string | null);
  const [sliderDragging, setSliderDragging] = useState(false);

  // MCQ state
  const [currentMCQ, setCurrentMCQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null as number | null);
  const [showResult, setShowResult] = useState(false);
  const [mcqScore, setMcqScore] = useState(0);
  const [mcqCompleted, setMcqCompleted] = useState(false);

  const containerRef = useRef(null as any);

  const availableSteps = useMemo(() => {
    let steps = allSteps;
    if (config.filterSteps && config.filterSteps.length > 0) {
      steps = steps.filter((s) => config.filterSteps!.includes(s.id));
    }
    return steps.filter((s) => s.mode === selectedMode);
  }, [allSteps, selectedMode, config.filterSteps]);

  const currentStep = availableSteps[currentStepIndex] || availableSteps[0];

  // ─── INJECT STYLES ───
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.id = "plc-singularity-kf";
    styleSheet.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes fadeInScale { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
            @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 70% { transform: scale(1.12); } 100% { transform: scale(1); opacity: 1; } }
            @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes glowPulse { 0%, 100% { filter: drop-shadow(0 0 3px rgba(74,77,201,0.3)); } 50% { filter: drop-shadow(0 0 14px rgba(83,48,134,0.65)); } }
            @keyframes rotateIn { from { transform: rotate(-60deg) scale(0); opacity: 0; } to { transform: rotate(0deg) scale(1); opacity: 1; } }
            @keyframes shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
            @keyframes celebrate { 0% { transform: scale(1); } 25% { transform: scale(1.06) rotate(-2deg); } 50% { transform: scale(1.1) rotate(2deg); } 100% { transform: scale(1); } }
            input[type='range'].s-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 3px; outline: none; cursor: pointer; }
            input[type='range'].s-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg, #4A4DC9, #FF7212); border: 3px solid #fff; box-shadow: 0 2px 10px rgba(74,77,201,0.35); cursor: grab; transition: transform 0.15s ease; }
            input[type='range'].s-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
            input[type='range'].s-slider::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.1); }
            input[type='range'].s-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg, #4A4DC9, #FF7212); border: 3px solid #fff; box-shadow: 0 2px 10px rgba(74,77,201,0.35); cursor: grab; }
        `;
    document.head.appendChild(styleSheet);
    return () => {
      const e = document.getElementById("plc-singularity-kf");
      if (e) document.head.removeChild(e);
    };
  }, []);

  // Step animation
  useEffect(() => {
    setStepAnimPhase(0);
    setShowTeachingNote(false);
    setGlowLines(false);
    const t: ReturnType<typeof setTimeout>[] = [];
    t.push(setTimeout(() => setStepAnimPhase(1), 200));
    t.push(setTimeout(() => setStepAnimPhase(2), 600));
    t.push(setTimeout(() => setStepAnimPhase(3), 1100));
    if (currentStep?.id === 5) {
      t.push(setTimeout(() => setGlowLines(true), 1400));
      t.push(setTimeout(() => setGlowLines(false), 3000));
    }
    return () => t.forEach(clearTimeout);
  }, [currentStepIndex, selectedMode]);

  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: availableSteps.length,
        isPaused: !isPlaying,
        currentMode: selectedMode,
      });
  }, [currentStepIndex, availableSteps.length, isPlaying, selectedMode]);

  useEffect(() => {
    if (selectedMode === "practice") {
      setCurrentMCQ(0);
      setSelectedOption(null);
      setShowResult(false);
      setMcqScore(0);
      setMcqCompleted(false);
    }
  }, [selectedMode]);

  const goNext = useCallback(() => {
    if (currentStepIndex < availableSteps.length - 1)
      setCurrentStepIndex((p) => p + 1);
  }, [currentStepIndex, availableSteps.length]);
  const goPrev = useCallback(() => {
    if (currentStepIndex > 0) setCurrentStepIndex((p) => p - 1);
  }, [currentStepIndex]);
  const resetAll = useCallback(() => {
    setCurrentStepIndex(0);
    setAngle(toolConfig.initialAngle);
    setIsPlaying(false);
  }, [toolConfig.initialAngle]);

  const handleOptionSelect = (idx: number) => {
    if (showResult) return;
    setSelectedOption(idx);
    setShowResult(true);
    if (idx === MCQ_QUESTIONS[currentMCQ].correctIndex)
      setMcqScore((p) => p + 1);
  };
  const handleNextMCQ = () => {
    if (currentMCQ < MCQ_QUESTIONS.length - 1) {
      setCurrentMCQ((p) => p + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else setMcqCompleted(true);
  };
  const handleRetryMCQ = () => {
    setCurrentMCQ(0);
    setSelectedOption(null);
    setShowResult(false);
    setMcqScore(0);
    setMcqCompleted(false);
  };

  // Geometry
  const stepId = currentStep?.id ?? 1;
  const isExplore = selectedMode === "explore";
  const showLineL = stepId >= 1 || isExplore;
  const showTransversal = stepId >= 1 || isExplore;
  const showPointX = stepId >= 1 || isExplore;
  const showProtractorX = stepId === 2 && toolConfig.showProtractor;
  const showAngleA = stepId >= 2 || isExplore;
  const showPointY = stepId >= 3 || isExplore;
  const showLineM = stepId >= 4 || isExplore;
  const showProtractorY = stepId === 4 && toolConfig.showProtractor;
  const showAngleB = stepId >= 4 || isExplore;
  const showCorrespondingLabel =
    (stepId >= 4 && toolConfig.highlightCorresponding) || isExplore;
  const showExtensions = stepId >= 5 || isExplore;
  const showParallelLabel = stepId >= 5 || isExplore;
  const showSlider = stepId >= 6 || isExplore;
  const showArrowMarks = stepId >= 5 || isExplore;

  const canvasW = config.width;
  const canvasH = selectedMode === "practice" ? 0 : config.height - 230;
  const angleRad = (angle * Math.PI) / 180;
  const pX = { x: canvasW * 0.52, y: canvasH * 0.33 };
  const tDx = Math.cos(angleRad);
  const tDy = -Math.sin(angleRad);
  const dist = 125;
  const pYCalc = { x: pX.x - tDx * dist, y: pX.y - tDy * dist };
  const tLen = showExtensions ? 420 : 210;
  const tStart = { x: pX.x + tDx * tLen, y: pX.y + tDy * tLen };
  const tEnd = { x: pYCalc.x - tDx * tLen, y: pYCalc.y - tDy * tLen };
  const lLen = showExtensions ? 340 : 210;

  const drawArc = (cx: number, cy: number, r: number, s: number, e: number) => {
    const sr = (s * Math.PI) / 180;
    const er = (e * Math.PI) / 180;
    const la = Math.abs(e - s) > 180 ? 1 : 0;
    return `M ${cx + r * Math.cos(sr)} ${cy - r * Math.sin(sr)} A ${r} ${r} 0 ${la} 0 ${cx + r * Math.cos(er)} ${cy - r * Math.sin(er)}`;
  };
  const drawFilledArc = (
    cx: number,
    cy: number,
    r: number,
    s: number,
    e: number,
  ) => `${drawArc(cx, cy, r, s, e)} L ${cx} ${cy} Z`;

  const modeConfig: Record<ModeType, { label: string; icon: ReactNode }> =
    {
      learn: { label: "Learn", icon: <BookOpen size={13} /> },
      practice: { label: "Practice", icon: <Target size={13} /> },
      explore: { label: "Explore", icon: <Zap size={13} /> },
      real_world: { label: "Real World", icon: <Eye size={13} /> },
    };

  return (
    <div
      ref={containerRef}
      style={{
        width: config.width,
        maxWidth: "100%",
        fontFamily: DS.font,
        background: DS.colors.white,
        borderRadius: DS.radius.xl,
        overflow: "hidden",
        boxShadow: DS.shadow.lg,
        color: DS.colors.gray900,
        position: "relative",
        border: `1px solid ${DS.colors.gray200}`,
      }}
    >
      {/* ═══ HEADER ═══ */}
      <div
        style={{
          background: DS.colors.bgGradient,
          padding: "16px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -12,
            right: 55,
            width: 50,
            height: 50,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -18,
            right: 130,
            width: 35,
            height: 35,
            border: "2px solid rgba(255,255,255,0.08)",
            transform: "rotate(45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 16,
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderBottom: "16px solid rgba(255,255,255,0.06)",
          }}
        />
        <div style={{ zIndex: 1 }}>
          <h1
            style={{
              fontFamily: DS.font,
              fontSize: 18,
              fontWeight: 800,
              color: "#fff",
              margin: 0,
              letterSpacing: "-0.3px",
            }}
          >
            Drawing Parallel Lines
          </h1>
          <p
            style={{
              fontSize: 10.5,
              color: "rgba(255,255,255,0.72)",
              margin: "2px 0 0",
              fontWeight: 500,
              letterSpacing: "0.2px",
            }}
          >
            Using Corresponding Angles • Ganita Prakash, Grade 7
          </p>
        </div>
        <button
          onClick={resetAll}
          onMouseEnter={() => setHoveredBtn("reset")}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            background: "rgba(255,255,255,0.14)",
            border: "1.5px solid rgba(255,255,255,0.22)",
            borderRadius: DS.radius.md,
            color: "#fff",
            padding: "6px 8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            transition: "all 0.25s ease",
            transform:
              hoveredBtn === "reset" ? "scale(1.1) rotate(-45deg)" : "scale(1)",
            zIndex: 1,
          }}
          title="Reset"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* ═══ MODE TABS ═══ */}
      {config.showModeSelector && (
        <div
          style={{
            display: "flex",
            gap: 0,
            padding: "0 18px",
            background: DS.colors.gray100,
            borderBottom: `1px solid ${DS.colors.gray200}`,
          }}
        >
          {config.enabledModes.map((mode) => {
            const mc = modeConfig[mode];
            const isActive = selectedMode === mode;
            return (
              <button
                key={mode}
                onClick={() => {
                  setSelectedMode(mode);
                  setCurrentStepIndex(0);
                }}
                onMouseEnter={() => setHoveredBtn(`m-${mode}`)}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  padding: "9px 16px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: DS.font,
                  fontSize: 11.5,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? DS.colors.primary : DS.colors.gray900,
                  background: isActive ? DS.colors.white : "transparent",
                  borderBottom: isActive
                    ? `3px solid ${DS.colors.primary}`
                    : "3px solid transparent",
                  borderRadius: isActive
                    ? `${DS.radius.sm}px ${DS.radius.sm}px 0 0`
                    : "0",
                  transition: "all 0.25s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  position: "relative",
                  top: isActive ? 1 : 0,
                }}
              >
                <span
                  style={{
                    color: isActive ? DS.colors.accent : DS.colors.gray400,
                  }}
                >
                  {mc.icon}
                </span>
                {mc.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ═══ CANVAS ═══ */}
      {selectedMode !== "practice" && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: canvasH,
            background: DS.colors.white,
            overflow: "hidden",
          }}
        >
          {toolConfig.showGrid && (
            <svg
              width="100%"
              height="100%"
              style={{ position: "absolute", top: 0, left: 0, opacity: 0.3 }}
            >
              <defs>
                <pattern
                  id="sgd"
                  width="26"
                  height="26"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="13"
                    cy="13"
                    r="0.7"
                    fill={DS.colors.lightPurple}
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#sgd)" />
            </svg>
          )}
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${canvasW} ${canvasH}`}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <defs>
              <marker
                id="aP"
                markerWidth="8"
                markerHeight="6"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill={DS.colors.deepPurple} />
              </marker>
              <marker
                id="aG"
                markerWidth="8"
                markerHeight="6"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill={DS.colors.gray900} />
              </marker>
              <filter id="gF">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="aGr" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={DS.colors.primary} />
                <stop offset="100%" stopColor={DS.colors.accent} />
              </linearGradient>
            </defs>

            {/* LINE L */}
            {showLineL && (
              <g
                style={{
                  animation:
                    stepId === 1 && stepAnimPhase >= 1
                      ? "fadeInLeft 0.6s ease-out"
                      : undefined,
                }}
              >
                <line
                  x1={pX.x - lLen}
                  y1={pX.y}
                  x2={pX.x + lLen}
                  y2={pX.y}
                  stroke={DS.colors.deepPurple}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  markerEnd={showArrowMarks ? "url(#aP)" : undefined}
                  style={{
                    filter: glowLines ? "url(#gF)" : undefined,
                    animation: glowLines
                      ? "glowPulse 1s ease-in-out 3"
                      : undefined,
                  }}
                />
                {showArrowMarks && (
                  <polygon
                    points={`${pX.x + 65},${pX.y - 5} ${pX.x + 73},${pX.y} ${pX.x + 65},${pX.y + 5}`}
                    fill={DS.colors.primary}
                    style={{ animation: "popIn 0.4s ease-out" }}
                  />
                )}
                {toolConfig.showLabels && (
                  <text
                    x={pX.x + lLen - 10}
                    y={pX.y - 12}
                    fill={DS.colors.deepPurple}
                    fontSize={15}
                    fontWeight={700}
                    fontFamily={DS.font}
                    fontStyle="italic"
                  >
                    l
                  </text>
                )}
              </g>
            )}

            {/* TRANSVERSAL */}
            {showTransversal && (
              <g
                style={{
                  animation:
                    stepId === 1 && stepAnimPhase >= 1
                      ? "fadeInUp 0.6s ease-out 0.15s both"
                      : undefined,
                }}
              >
                <line
                  x1={tStart.x}
                  y1={tStart.y}
                  x2={tEnd.x}
                  y2={tEnd.y}
                  stroke={DS.colors.gray900}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  markerEnd="url(#aG)"
                />
                {toolConfig.showLabels && (
                  <text
                    x={tEnd.x + 8}
                    y={tEnd.y + 4}
                    fill={DS.colors.gray900}
                    fontSize={15}
                    fontWeight={700}
                    fontFamily={DS.font}
                    fontStyle="italic"
                  >
                    t
                  </text>
                )}
              </g>
            )}

            {/* POINT X */}
            {showPointX && (
              <g style={{ animation: "popIn 0.5s ease-out 0.35s both" }}>
                <circle cx={pX.x} cy={pX.y} r={5} fill={DS.colors.primary} />
                <text
                  x={pX.x + 10}
                  y={pX.y - 10}
                  fill={DS.colors.primary}
                  fontSize={13}
                  fontWeight={800}
                  fontFamily={DS.font}
                >
                  X
                </text>
              </g>
            )}

            {/* ANGLE A */}
            {showAngleA && (
              <g style={{ animation: "rotateIn 0.5s ease-out" }}>
                <path
                  d={drawFilledArc(pX.x, pX.y, 30, 0, angle)}
                  fill={DS.colors.accent + "1E"}
                />
                <path
                  d={drawArc(pX.x, pX.y, 30, 0, angle)}
                  fill="none"
                  stroke={DS.colors.accent}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
                <text
                  x={pX.x + 42 * Math.cos(((angle / 2) * Math.PI) / 180)}
                  y={pX.y - 42 * Math.sin(((angle / 2) * Math.PI) / 180)}
                  fill={DS.colors.accent}
                  fontSize={11}
                  fontWeight={800}
                  fontFamily={DS.font}
                  textAnchor="middle"
                >
                  ∠a={angle}°
                </text>
                {stepId === 2 && (
                  <text
                    x={pX.x - 42}
                    y={pX.y - 5}
                    fill={DS.colors.gray400}
                    fontSize={9.5}
                    fontWeight={600}
                    fontFamily={DS.font}
                    opacity={0.55}
                  >
                    {180 - angle}°
                  </text>
                )}
              </g>
            )}

            {/* PROTRACTOR X */}
            {showProtractorX && (
              <g style={{ animation: "popIn 0.6s ease-out", opacity: 0.22 }}>
                <path
                  d={drawArc(pX.x, pX.y, 56, 0, 180)}
                  fill="none"
                  stroke={DS.colors.primary}
                  strokeWidth={1}
                  strokeDasharray="3 2"
                />
                {[0, 30, 60, 90, 120, 150, 180].map((d) => (
                  <g key={`px${d}`}>
                    <line
                      x1={pX.x + 52 * Math.cos((d * Math.PI) / 180)}
                      y1={pX.y - 52 * Math.sin((d * Math.PI) / 180)}
                      x2={pX.x + 60 * Math.cos((d * Math.PI) / 180)}
                      y2={pX.y - 60 * Math.sin((d * Math.PI) / 180)}
                      stroke={DS.colors.primary}
                      strokeWidth={0.8}
                    />
                    <text
                      x={pX.x + 69 * Math.cos((d * Math.PI) / 180)}
                      y={pX.y - 69 * Math.sin((d * Math.PI) / 180) + 3}
                      fill={DS.colors.primary}
                      fontSize={6.5}
                      fontWeight={600}
                      fontFamily={DS.font}
                      textAnchor="middle"
                    >
                      {d}°
                    </text>
                  </g>
                ))}
              </g>
            )}

            {/* POINT Y */}
            {showPointY && (
              <g style={{ animation: "popIn 0.5s ease-out" }}>
                <circle
                  cx={pYCalc.x}
                  cy={pYCalc.y}
                  r={5}
                  fill={DS.colors.primary}
                >
                  {stepId === 3 && (
                    <animate
                      attributeName="r"
                      values="5;8;5"
                      dur="1.1s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
                {stepId === 3 && (
                  <circle
                    cx={pYCalc.x}
                    cy={pYCalc.y}
                    r={12}
                    fill="none"
                    stroke={DS.colors.accent}
                    strokeWidth={1.5}
                    opacity={0.4}
                  >
                    <animate
                      attributeName="r"
                      values="8;18;8"
                      dur="1.1s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.5;0;0.5"
                      dur="1.1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                <text
                  x={pYCalc.x + 11}
                  y={pYCalc.y + 15}
                  fill={DS.colors.primary}
                  fontSize={13}
                  fontWeight={800}
                  fontFamily={DS.font}
                >
                  Y
                </text>
              </g>
            )}

            {/* LINE M */}
            {showLineM && (
              <g style={{ animation: "fadeInLeft 0.6s ease-out" }}>
                <line
                  x1={pYCalc.x - lLen}
                  y1={pYCalc.y}
                  x2={pYCalc.x + lLen}
                  y2={pYCalc.y}
                  stroke={DS.colors.deepPurple}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  markerEnd={showArrowMarks ? "url(#aP)" : undefined}
                  style={{
                    filter: glowLines ? "url(#gF)" : undefined,
                    animation: glowLines
                      ? "glowPulse 1s ease-in-out 3"
                      : undefined,
                  }}
                />
                {showArrowMarks && (
                  <polygon
                    points={`${pYCalc.x + 65},${pYCalc.y - 5} ${pYCalc.x + 73},${pYCalc.y} ${pYCalc.x + 65},${pYCalc.y + 5}`}
                    fill={DS.colors.primary}
                    style={{ animation: "popIn 0.4s ease-out 0.15s both" }}
                  />
                )}
                {toolConfig.showLabels && (
                  <text
                    x={pYCalc.x + lLen - 10}
                    y={pYCalc.y - 12}
                    fill={DS.colors.deepPurple}
                    fontSize={15}
                    fontWeight={700}
                    fontFamily={DS.font}
                    fontStyle="italic"
                  >
                    m
                  </text>
                )}
              </g>
            )}

            {/* ANGLE B */}
            {showAngleB && (
              <g style={{ animation: "rotateIn 0.5s ease-out 0.15s both" }}>
                <path
                  d={drawFilledArc(pYCalc.x, pYCalc.y, 30, 0, angle)}
                  fill={DS.colors.accent + "1E"}
                />
                <path
                  d={drawArc(pYCalc.x, pYCalc.y, 30, 0, angle)}
                  fill="none"
                  stroke={DS.colors.accent}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
                <text
                  x={pYCalc.x + 42 * Math.cos(((angle / 2) * Math.PI) / 180)}
                  y={pYCalc.y - 42 * Math.sin(((angle / 2) * Math.PI) / 180)}
                  fill={DS.colors.accent}
                  fontSize={11}
                  fontWeight={800}
                  fontFamily={DS.font}
                  textAnchor="middle"
                >
                  ∠b={angle}°
                </text>
              </g>
            )}

            {/* PROTRACTOR Y */}
            {showProtractorY && (
              <g
                style={{
                  animation: "popIn 0.6s ease-out 0.25s both",
                  opacity: 0.22,
                }}
              >
                <path
                  d={drawArc(pYCalc.x, pYCalc.y, 56, 0, 180)}
                  fill="none"
                  stroke={DS.colors.primary}
                  strokeWidth={1}
                  strokeDasharray="3 2"
                />
                {[0, 30, 60, 90, 120, 150, 180].map((d) => (
                  <line
                    key={`py${d}`}
                    x1={pYCalc.x + 52 * Math.cos((d * Math.PI) / 180)}
                    y1={pYCalc.y - 52 * Math.sin((d * Math.PI) / 180)}
                    x2={pYCalc.x + 60 * Math.cos((d * Math.PI) / 180)}
                    y2={pYCalc.y - 60 * Math.sin((d * Math.PI) / 180)}
                    stroke={DS.colors.primary}
                    strokeWidth={0.8}
                  />
                ))}
              </g>
            )}

            {/* EXTENSIONS */}
            {showExtensions && (
              <g style={{ animation: "fadeInLeft 0.7s ease-out" }}>
                {[
                  [pX.x - lLen, pX.y, pX.x - lLen - 55, pX.y],
                  [pX.x + lLen, pX.y, pX.x + lLen + 55, pX.y],
                  [pYCalc.x - lLen, pYCalc.y, pYCalc.x - lLen - 55, pYCalc.y],
                  [pYCalc.x + lLen, pYCalc.y, pYCalc.x + lLen + 55, pYCalc.y],
                ].map((p, i) => (
                  <line
                    key={`e${i}`}
                    x1={p[0]}
                    y1={p[1]}
                    x2={p[2]}
                    y2={p[3]}
                    stroke={DS.colors.deepPurple}
                    strokeWidth={1.5}
                    strokeDasharray="5 3"
                    opacity={0.4}
                  />
                ))}
              </g>
            )}

            {/* BRACKET */}
            {showCorrespondingLabel && stepAnimPhase >= 2 && (
              <line
                x1={pX.x + 48 * Math.cos(((angle / 2) * Math.PI) / 180) + 20}
                y1={pX.y - 48 * Math.sin(((angle / 2) * Math.PI) / 180)}
                x2={
                  pYCalc.x + 48 * Math.cos(((angle / 2) * Math.PI) / 180) + 20
                }
                y2={pYCalc.y - 48 * Math.sin(((angle / 2) * Math.PI) / 180)}
                stroke={DS.colors.accent}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                opacity={0.45}
                style={{ animation: "fadeInUp 0.4s ease-out" }}
              />
            )}

            {/* PARALLEL BADGE */}
            {showParallelLabel && stepAnimPhase >= 2 && (
              <g style={{ animation: "popIn 0.6s ease-out" }}>
                <rect
                  x={canvasW / 2 - 108}
                  y={8}
                  width={216}
                  height={32}
                  rx={16}
                  fill="url(#aGr)"
                  opacity={0.9}
                />
                <text
                  x={canvasW / 2}
                  y={29}
                  fill="#fff"
                  fontSize={11.5}
                  fontWeight={700}
                  fontFamily={DS.font}
                  textAnchor="middle"
                >
                  ✨ PARALLEL — Lines never meet!
                </text>
              </g>
            )}
          </svg>

          {/* Overlay badge step 4 */}
          {showCorrespondingLabel && stepId === 4 && stepAnimPhase >= 2 && (
            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: "50%",
                transform: "translateX(-50%)",
                background: DS.colors.bgGradient,
                color: "#fff",
                padding: "7px 20px",
                borderRadius: DS.radius.full,
                fontSize: 11.5,
                fontWeight: 700,
                fontFamily: DS.font,
                boxShadow: DS.shadow.glow,
                animation: "fadeInUp 0.4s ease-out",
                whiteSpace: "nowrap",
              }}
            >
              ∠a = ∠b = {angle}° — Corresponding angles are EQUAL
            </div>
          )}
        </div>
      )}

      {/* ═══ PRACTICE MCQ ═══ */}
      {selectedMode === "practice" && (
        <div
          style={{
            padding: "18px 22px",
            minHeight: 360,
            animation: "fadeInScale 0.35s ease-out",
          }}
        >
          {!mcqCompleted ? (
            <>
              {/* Progress */}
              <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
                {MCQ_QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 5,
                      borderRadius: 3,
                      background:
                        i < currentMCQ
                          ? DS.colors.primary
                          : i === currentMCQ
                            ? DS.colors.bgGradient
                            : DS.colors.gray200,
                      transition: "all 0.35s ease",
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    background: DS.colors.bgGradient,
                    color: "#fff",
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: "3px 11px",
                    borderRadius: DS.radius.full,
                    fontFamily: DS.font,
                  }}
                >
                  Q{currentMCQ + 1}/{MCQ_QUESTIONS.length}
                </span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: DS.colors.gray400,
                  }}
                >
                  Score: {mcqScore}/{MCQ_QUESTIONS.length}
                </span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: 1.6,
                  color: DS.colors.gray900,
                  margin: "0 0 16px",
                  fontFamily: DS.font,
                }}
              >
                {MCQ_QUESTIONS[currentMCQ].question}
              </p>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {MCQ_QUESTIONS[currentMCQ].options.map((opt, i) => {
                  const isSel = selectedOption === i;
                  const isCorr = i === MCQ_QUESTIONS[currentMCQ].correctIndex;
                  const showC = showResult && isCorr;
                  const showW = showResult && isSel && !isCorr;

                  let bg = DS.colors.white,
                    bdr = `1.5px solid ${DS.colors.gray200}`,
                    tc = DS.colors.gray900,
                    iBg = DS.colors.gray100;
                  if (showC) {
                    bg = "#ECFDF5";
                    bdr = `2px solid ${DS.colors.success}`;
                    tc = "#065F46";
                    iBg = DS.colors.success;
                  } else if (showW) {
                    bg = "#FEF2F2";
                    bdr = `2px solid ${DS.colors.error}`;
                    tc = "#991B1B";
                    iBg = DS.colors.error;
                  } else if (!showResult && hoveredBtn === `o-${i}`) {
                    bg = DS.colors.lightPurple + "25";
                    bdr = `1.5px solid ${DS.colors.primary}50`;
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(i)}
                      onMouseEnter={() => setHoveredBtn(`o-${i}`)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 11,
                        padding: "11px 14px",
                        borderRadius: DS.radius.md,
                        background: bg,
                        border: bdr,
                        cursor: showResult ? "default" : "pointer",
                        fontFamily: DS.font,
                        fontSize: 12.5,
                        fontWeight: 500,
                        color: tc,
                        textAlign: "left",
                        transition: "all 0.25s ease",
                        animation: showW
                          ? "shake 0.4s ease-out"
                          : showC
                            ? "celebrate 0.45s ease-out"
                            : undefined,
                        transform:
                          !showResult && hoveredBtn === `o-${i}`
                            ? "translateX(3px)"
                            : "none",
                      }}
                    >
                      <span
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: DS.radius.sm,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: showC || showW ? iBg : DS.colors.gray100,
                          color: showC || showW ? "#fff" : DS.colors.gray900,
                          fontSize: 11.5,
                          fontWeight: 700,
                          flexShrink: 0,
                          transition: "all 0.25s ease",
                        }}
                      >
                        {showC ? (
                          <Check size={13} />
                        ) : showW ? (
                          <X size={13} />
                        ) : (
                          String.fromCharCode(65 + i)
                        )}
                      </span>
                      <span style={{ flex: 1 }}>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showResult && (
                <div
                  style={{
                    marginTop: 14,
                    padding: "12px 14px",
                    background:
                      selectedOption === MCQ_QUESTIONS[currentMCQ].correctIndex
                        ? "#ECFDF5"
                        : DS.colors.lightOrange,
                    borderRadius: DS.radius.md,
                    borderLeft: `4px solid ${selectedOption === MCQ_QUESTIONS[currentMCQ].correctIndex ? DS.colors.success : DS.colors.accent}`,
                    animation: "slideIn 0.3s ease-out",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      marginBottom: 3,
                      fontFamily: DS.font,
                      color:
                        selectedOption ===
                        MCQ_QUESTIONS[currentMCQ].correctIndex
                          ? "#065F46"
                          : "#9A3412",
                    }}
                  >
                    {selectedOption === MCQ_QUESTIONS[currentMCQ].correctIndex
                      ? "✓ Correct!"
                      : "✗ Not quite!"}
                  </div>
                  <p
                    style={{
                      fontSize: 11.5,
                      lineHeight: 1.55,
                      margin: 0,
                      color: DS.colors.gray900,
                      fontWeight: 400,
                    }}
                  >
                    {MCQ_QUESTIONS[currentMCQ].explanation}
                  </p>
                </div>
              )}

              {showResult && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 12,
                  }}
                >
                  <button
                    onClick={handleNextMCQ}
                    onMouseEnter={() => setHoveredBtn("mn")}
                    onMouseLeave={() => setHoveredBtn(null)}
                    style={{
                      padding: "9px 22px",
                      borderRadius: DS.radius.full,
                      border: "none",
                      background: DS.colors.bgGradient,
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: DS.font,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      transition: "all 0.25s ease",
                      transform:
                        hoveredBtn === "mn" ? "translateX(2px)" : "none",
                      boxShadow:
                        hoveredBtn === "mn" ? DS.shadow.glow : DS.shadow.sm,
                    }}
                  >
                    {currentMCQ < MCQ_QUESTIONS.length - 1
                      ? "Next Question"
                      : "See Results"}{" "}
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* SCORE */
            <div
              style={{
                textAlign: "center",
                padding: "28px 18px",
                animation: "fadeInScale 0.45s ease-out",
              }}
            >
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  background:
                    mcqScore >= 4 ? DS.colors.bgGradient : DS.colors.gray200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                  boxShadow:
                    mcqScore >= 4
                      ? "0 8px 28px rgba(83,48,134,0.3)"
                      : DS.shadow.sm,
                  animation:
                    mcqScore >= 4 ? "celebrate 0.7s ease-out" : undefined,
                }}
              >
                <Award size={34} color="#fff" />
              </div>
              <h2
                style={
                  {
                    fontSize: 26,
                    fontWeight: 900,
                    margin: "0 0 3px",
                    fontFamily: DS.font,
                    background: DS.colors.bgGradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  } as any
                }
              >
                {mcqScore}/{MCQ_QUESTIONS.length}
              </h2>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: DS.colors.gray900,
                  margin: "0 0 3px",
                }}
              >
                {mcqScore === 5
                  ? "Perfect Score! 🎉"
                  : mcqScore >= 4
                    ? "Excellent! 🌟"
                    : mcqScore >= 3
                      ? "Good Job! 👍"
                      : "Keep Practicing! 💪"}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: DS.colors.gray400,
                  margin: "0 0 18px",
                }}
              >
                {mcqScore >= 4
                  ? "You understand corresponding angles very well!"
                  : "Review the Learn mode and try again."}
              </p>
              <button
                onClick={handleRetryMCQ}
                onMouseEnter={() => setHoveredBtn("rt")}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  padding: "9px 26px",
                  borderRadius: DS.radius.full,
                  border: "none",
                  background: DS.colors.bgGradient,
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: DS.font,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  transform: hoveredBtn === "rt" ? "scale(1.05)" : "scale(1)",
                  boxShadow:
                    hoveredBtn === "rt" ? DS.shadow.glow : DS.shadow.sm,
                }}
              >
                <RotateCcw
                  size={13}
                  style={{ marginRight: 5, verticalAlign: "middle" }}
                />{" "}
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ INFO PANEL ═══ */}
      {selectedMode !== "practice" && (
        <div
          style={{
            padding: "12px 18px 14px",
            background: DS.colors.white,
            borderTop: `1px solid ${DS.colors.gray200}`,
          }}
        >
          <div style={{ animation: "slideIn 0.3s ease-out", minHeight: 50 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  background: DS.colors.bgGradient,
                  color: "#fff",
                  fontSize: 9.5,
                  fontWeight: 700,
                  padding: "2px 9px",
                  borderRadius: DS.radius.full,
                  fontFamily: DS.font,
                }}
              >
                {currentStepIndex + 1}/{availableSteps.length}
              </span>
              <h3
                style={{
                  margin: 0,
                  fontSize: 13.5,
                  fontWeight: 700,
                  fontFamily: DS.font,
                  color: DS.colors.gray900,
                }}
              >
                {currentStep?.title}
              </h3>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                lineHeight: 1.5,
                color: DS.colors.gray900,
                fontWeight: 400,
                opacity: 0.72,
              }}
            >
              {currentStep?.description}
            </p>

            {currentStep?.teachingNote && (
              <div style={{ marginTop: 7 }}>
                <button
                  onClick={() => setShowTeachingNote(!showTeachingNote)}
                  style={{
                    background: showTeachingNote
                      ? DS.colors.lightPurple + "35"
                      : "transparent",
                    border: `1.5px solid ${DS.colors.primary}28`,
                    borderRadius: DS.radius.sm,
                    padding: "3px 10px",
                    cursor: "pointer",
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: DS.colors.primary,
                    fontFamily: DS.font,
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <BookOpen size={11} /> {showTeachingNote ? "Hide" : "Show"}{" "}
                  Teaching Note
                </button>
                {showTeachingNote && (
                  <div
                    style={{
                      marginTop: 5,
                      padding: "8px 12px",
                      background: DS.colors.lightOrange,
                      borderRadius: DS.radius.sm,
                      borderLeft: `3px solid ${DS.colors.accent}`,
                      fontSize: 11,
                      lineHeight: 1.5,
                      color: DS.colors.deepPurple,
                      fontWeight: 500,
                      animation: "slideIn 0.25s ease-out",
                    }}
                  >
                    {currentStep.teachingNote}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SLIDER */}
          {showSlider && (
            <div
              style={{
                marginTop: 12,
                padding: "10px 14px",
                background: DS.colors.gray100,
                borderRadius: DS.radius.md,
                border: `1px solid ${DS.colors.gray200}`,
                animation: "fadeInUp 0.35s ease-out",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 7,
                }}
              >
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: DS.colors.primary,
                    fontFamily: DS.font,
                  }}
                >
                  Angle Control
                </span>
                <span
                  style={{
                    background: DS.colors.bgGradient,
                    color: "#fff",
                    padding: "2px 12px",
                    borderRadius: DS.radius.full,
                    fontSize: 13,
                    fontWeight: 800,
                    fontFamily: DS.font,
                    minWidth: 44,
                    textAlign: "center",
                    boxShadow: sliderDragging ? DS.shadow.glow : "none",
                    transition: "box-shadow 0.2s ease",
                  }}
                >
                  {angle}°
                </span>
              </div>
              <input
                type="range"
                className="s-slider"
                min={toolConfig.minAngle}
                max={toolConfig.maxAngle}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                onMouseDown={() => setSliderDragging(true)}
                onMouseUp={() => setSliderDragging(false)}
                onTouchStart={() => setSliderDragging(true)}
                onTouchEnd={() => setSliderDragging(false)}
                style={{
                  background: `linear-gradient(to right, ${DS.colors.primary} 0%, ${DS.colors.accent} ${((angle - toolConfig.minAngle) / (toolConfig.maxAngle - toolConfig.minAngle)) * 100}%, ${DS.colors.gray200} ${((angle - toolConfig.minAngle) / (toolConfig.maxAngle - toolConfig.minAngle)) * 100}%, ${DS.colors.gray200} 100%)`,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 9,
                  fontWeight: 600,
                  color: DS.colors.gray400,
                  marginTop: 3,
                }}
              >
                <span>{toolConfig.minAngle}°</span>
                <span
                  style={{
                    color: DS.colors.primary,
                    fontWeight: 700,
                    fontSize: 9.5,
                  }}
                >
                  ∠a = ∠b → Always Parallel!
                </span>
                <span>{toolConfig.maxAngle}°</span>
              </div>
            </div>
          )}

          {/* NAV */}
          {config.showNavigation && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 12,
                gap: 6,
              }}
            >
              <button
                onClick={goPrev}
                disabled={currentStepIndex === 0}
                onMouseEnter={() => setHoveredBtn("pv")}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  padding: "7px 16px",
                  borderRadius: DS.radius.full,
                  border: `1.5px solid ${currentStepIndex === 0 ? DS.colors.gray200 : DS.colors.primary}`,
                  background:
                    hoveredBtn === "pv" && currentStepIndex > 0
                      ? DS.colors.lightPurple + "28"
                      : DS.colors.white,
                  color:
                    currentStepIndex === 0
                      ? DS.colors.gray400
                      : DS.colors.primary,
                  fontSize: 11.5,
                  fontWeight: 600,
                  fontFamily: DS.font,
                  cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",
                  transition: "all 0.25s ease",
                }}
              >
                <ChevronLeft size={14} /> Previous
              </button>
              {config.showStepIndicator && (
                <div style={{ display: "flex", gap: 4 }}>
                  {availableSteps.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setCurrentStepIndex(i)}
                      style={{
                        width: i === currentStepIndex ? 20 : 7,
                        height: 7,
                        borderRadius: 4,
                        background:
                          i === currentStepIndex
                            ? DS.colors.bgGradient
                            : DS.colors.gray200,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={goNext}
                disabled={currentStepIndex >= availableSteps.length - 1}
                onMouseEnter={() => setHoveredBtn("nx")}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  padding: "7px 16px",
                  borderRadius: DS.radius.full,
                  border: "none",
                  background:
                    currentStepIndex >= availableSteps.length - 1
                      ? DS.colors.gray200
                      : DS.colors.bgGradient,
                  color:
                    currentStepIndex >= availableSteps.length - 1
                      ? DS.colors.gray400
                      : "#fff",
                  fontSize: 11.5,
                  fontWeight: 600,
                  fontFamily: DS.font,
                  cursor:
                    currentStepIndex >= availableSteps.length - 1
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.25s ease",
                  boxShadow:
                    hoveredBtn === "nx" &&
                    currentStepIndex < availableSteps.length - 1
                      ? DS.shadow.glow
                      : "none",
                  transform:
                    hoveredBtn === "nx" &&
                    currentStepIndex < availableSteps.length - 1
                      ? "translateX(2px)"
                      : "none",
                }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ParallelLineConstructor;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
