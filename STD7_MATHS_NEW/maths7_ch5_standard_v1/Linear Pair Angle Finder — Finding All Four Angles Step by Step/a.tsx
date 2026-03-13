// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: linear_pair_angle_finder.tsx
// ═══════════════════════════════════════════════════════════════════════════

/**
 * NOTE:
 * This file is designed to work in environments where React/icons may be
 * provided globally. To keep this component self-contained, we avoid external
 * imports and provide minimal types + icon components here.
 */

declare const React: any;

declare global {
  // Minimal JSX typing so TS can typecheck without external @types/react.
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
type CSSProperties = Record<string, any>;
type FC<P = {}> = (props: P) => any;

const { useState, useEffect, useCallback, useMemo } = React;

type IconProps = { size?: number; style?: any };
const IconBase = ({
  size = 16,
  style,
  children,
}: IconProps & { children?: ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
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

const ChevronLeft = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M15 18l-6-6 6-6" />
  </IconBase>
);
const ChevronRight = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M9 18l6-6-6-6" />
  </IconBase>
);
const RotateCcw = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M3 2v6h6" />
    <path d="M3.5 13a9 9 0 1 0 2-5.7L3 8" />
  </IconBase>
);
const BookOpen = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M12 19c-2.5-1.6-5-2-8-2V5c3 0 5.5.4 8 2" />
    <path d="M12 19c2.5-1.6 5-2 8-2V5c-3 0-5.5.4-8 2" />
  </IconBase>
);
const Target = (p: IconProps) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M22 12h-2" />
    <path d="M12 22v-2" />
    <path d="M2 12h2" />
  </IconBase>
);
const Zap = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M13 2L3 14h7l-1 8 12-14h-7l-1-6z" />
  </IconBase>
);
const Check = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M20 6L9 17l-5-5" />
  </IconBase>
);
const X = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </IconBase>
);
const Award = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M12 2l2.2 4.4 4.8.7-3.5 3.4.8 4.8L12 13.8 7.7 15.3l.8-4.8L5 7.1l4.8-.7L12 2z" />
    <path d="M8 14v8l4-2 4 2v-8" />
  </IconBase>
);
const Star = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M12 2l3 7 7 .5-5.5 4.5 2 7-6.5-4-6.5 4 2-7L2 9.5 9 9l3-7z" />
  </IconBase>
);

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice";

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
  type: "intro" | "explanation" | "practice";
  mode: ModeType;
  data?: any;
}
interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface LinearPairAdditionalProps {
  startingAngle?: number;
  lineColor?: string;
  lineThickness?: number;
  showDegreeSymbol?: boolean;
  angleColors?: { a?: string; b?: string; c?: string; d?: string };
  highlightColor?: string;
  intersectionDotSize?: number;
  arcRadius?: number;
}

interface LinearPairAngleFinderProps {
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
    additionalProps?: LinearPairAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

interface MCQQuestion {
  id: number;
  givenAngle: number;
  givenLabel: string;
  askAngle: string;
  correctAnswer: number;
  options: number[];
  explanation: string;
  revealOnAnswer: string[];
  highlightPairOnAnswer: string | null;
  showVerticalOnAnswer: boolean;
}

// ==================== DESIGN SYSTEM — SINGULARITY PALETTE ====================

const DS = {
  // Primary
  purple: "#4A4DC9",
  purpleDark: "#533086",
  purpleLight: "#C1C1EA",
  purpleBg: "#EEEDF7",
  // Accent
  orange: "#FF7212",
  orangeMid: "#FC9145",
  orangeLight: "#FFF3E4",
  // Greys
  grey900: "#4E4E4E",
  grey400: "#CACACA",
  grey200: "#EBEBEB",
  grey100: "#F5F5F5",
  white: "#FFFFFF",
  // Functional
  green: "#2ECC71",
  greenBg: "#E8F8F0",
  red: "#E74C3C",
  redBg: "#FDECEB",
  // Angle colors mapped to design system
  angleA: "#4A4DC9", // purple
  angleB: "#FC9145", // orange mid
  angleC: "#533086", // purple dark
  angleD: "#FF7212", // orange
};

// ==================== ANIMATION HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeOutElastic = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Two Lines Intersect",
    description:
      "When two straight lines cross each other, they form four angles at the point of intersection. Let's start with one known angle — ∠a = 120°.",
    type: "intro",
    mode: "learn",
  },
  {
    id: 2,
    title: "Finding ∠b — Linear Pair",
    description:
      "∠a and ∠b sit side by side on a straight line. They form a linear pair, so they must add up to 180°. Therefore, ∠b = 180° − 120° = 60°.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 3,
    title: "Finding ∠c — Linear Pair",
    description:
      "Now ∠b and ∠c form a linear pair on the other straight line. So ∠c = 180° − 60° = 120°. Can you see a pattern?",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 4,
    title: "Finding ∠d — Linear Pair",
    description:
      "∠c and ∠d form a linear pair. So ∠d = 180° − 120° = 60°. Now we know all four angles!",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 5,
    title: "Vertically Opposite Angles",
    description:
      "∠a = ∠c = 120° and ∠b = ∠d = 60°. Angles opposite each other are always equal — these are called vertically opposite angles!",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 10,
    title: "Practice Quiz",
    description:
      "Answer 5 MCQ questions on linear pairs and vertically opposite angles.",
    type: "practice",
    mode: "practice",
  },
];

// ==================== MCQ QUESTIONS ====================

const MCQ_QUESTIONS: MCQQuestion[] = [
  {
    id: 1,
    givenAngle: 70,
    givenLabel: "a",
    askAngle: "∠b",
    correctAnswer: 110,
    options: [70, 90, 110, 120],
    explanation: "∠a and ∠b form a linear pair. So ∠b = 180° − 70° = 110°.",
    revealOnAnswer: ["a", "b"],
    highlightPairOnAnswer: "ab",
    showVerticalOnAnswer: false,
  },
  {
    id: 2,
    givenAngle: 135,
    givenLabel: "a",
    askAngle: "∠b",
    correctAnswer: 45,
    options: [45, 55, 135, 90],
    explanation: "∠a and ∠b are a linear pair. So ∠b = 180° − 135° = 45°.",
    revealOnAnswer: ["a", "b"],
    highlightPairOnAnswer: "ab",
    showVerticalOnAnswer: false,
  },
  {
    id: 3,
    givenAngle: 55,
    givenLabel: "a",
    askAngle: "∠c",
    correctAnswer: 55,
    options: [55, 125, 35, 180],
    explanation:
      "∠a and ∠c are vertically opposite. They are always equal. So ∠c = 55°.",
    revealOnAnswer: ["a", "b", "c", "d"],
    highlightPairOnAnswer: null,
    showVerticalOnAnswer: true,
  },
  {
    id: 4,
    givenAngle: 100,
    givenLabel: "a",
    askAngle: "∠d",
    correctAnswer: 80,
    options: [100, 80, 90, 60],
    explanation:
      "∠b = 180° − 100° = 80° (linear pair). ∠d = ∠b = 80° (vertically opposite).",
    revealOnAnswer: ["a", "b", "c", "d"],
    highlightPairOnAnswer: "ab",
    showVerticalOnAnswer: true,
  },
  {
    id: 5,
    givenAngle: 65,
    givenLabel: "a",
    askAngle: "∠b + ∠d",
    correctAnswer: 230,
    options: [130, 180, 230, 250],
    explanation:
      "∠b = 180° − 65° = 115°. ∠d = ∠b = 115° (vertically opposite). So ∠b + ∠d = 230°.",
    revealOnAnswer: ["a", "b", "c", "d"],
    highlightPairOnAnswer: null,
    showVerticalOnAnswer: true,
  },
];

// ==================== MAIN COMPONENT ====================

type LinearPairAngleFinderInnerProps =
  NonNullable<LinearPairAngleFinderProps["props"]>;

const LinearPairAngleFinder: FC<LinearPairAngleFinderProps> = ({
  props: incomingProps,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const props: LinearPairAngleFinderInnerProps = incomingProps ?? {};
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: props.initialMode ?? ("learn" as ModeType),
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: props.enabledModes ?? (["learn", "practice"] as ModeType[]),
      showNavigation: props.showNavigation ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      filterSteps: props.filterSteps ?? null,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration: props.autoPlayDuration ?? 8000,
    }),
    [props],
  );

  const additionalProps: LinearPairAdditionalProps = props.additionalProps ?? {};
  const toolConfig = useMemo(
    () => ({
      startingAngle: additionalProps.startingAngle ?? 120,
      lineColor: additionalProps.lineColor ?? DS.grey900,
      lineThickness: additionalProps.lineThickness ?? 2.5,
      angleColors: { a: DS.angleA, b: DS.angleB, c: DS.angleC, d: DS.angleD },
      highlightColor: DS.purpleLight,
      intersectionDotSize: additionalProps.intersectionDotSize ?? 7,
      arcRadius: additionalProps.arcRadius ?? 55,
    }),
    [additionalProps],
  );

  // ─── STATE ───
  const allSteps = props.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(
    () =>
      config.filterSteps?.length
        ? allSteps.filter((s) => config.filterSteps!.includes(s.id))
        : allSteps,
    [allSteps, config.filterSteps],
  );

  const [selectedMode, setSelectedMode] = useState(config.initialMode as ModeType);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const [mcqIndex, setMcqIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null as number | null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [mcqAnimKey, setMcqAnimKey] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(
    {} as Record<number, { selected: number; correct: boolean }>,
  );

  const [revealedAngles, setRevealedAngles] = useState(
    new Set(["a"]) as Set<string>,
  );
  const [activeLinearPair, setActiveLinearPair] = useState(
    null as string | null,
  );
  const [showVerticalPairs, setShowVerticalPairs] = useState(false);
  const [fadeInAngle, setFadeInAngle] = useState("a" as string | null);

  const filteredSteps = useMemo(
    () => availableSteps.filter((s) => s.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const currentStep = filteredSteps[currentStepIndex] || filteredSteps[0];
  const currentQuestion = MCQ_QUESTIONS[mcqIndex] || MCQ_QUESTIONS[0];

  const learnAngleA = toolConfig.startingAngle;
  const learnAngleB = 180 - learnAngleA;
  const angleA =
    selectedMode === "practice" ? currentQuestion.givenAngle : learnAngleA;
  const angleB = 180 - angleA;
  const angleC = angleA;
  const angleD = angleB;

  // ─── KEYFRAMES ───
  useEffect(() => {
    const kf = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes arcDraw { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } }
            @keyframes arcPulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
            @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.12); } 100% { transform: scale(1); opacity: 1; } }
            @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.06); } 70% { transform: scale(0.96); } 100% { transform: scale(1); } }
            @keyframes equalSign { from { opacity: 0; transform: scale(0) rotate(-180deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
            @keyframes drawLine { from { stroke-dashoffset: 600; } to { stroke-dashoffset: 0; } }
            @keyframes shakeWrong { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-5px); } 40% { transform: translateX(5px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(3px); } }
            @keyframes correctPop { 0% { transform: scale(1); } 40% { transform: scale(1.06); } 100% { transform: scale(1); } }
            @keyframes scoreReveal { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
            @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
            @keyframes glowPurple { 0%, 100% { box-shadow: 0 0 0 0 rgba(74,77,201,0); } 50% { box-shadow: 0 0 0 6px rgba(74,77,201,0.12); } }
        `;
    const ss = document.createElement("style");
    ss.id = "lp-kf";
    ss.textContent = kf;
    document.head.appendChild(ss);
    return () => {
      const e = document.getElementById("lp-kf");
      if (e) document.head.removeChild(e);
    };
  }, []);

  // ─── LEARN STEP LOGIC ───
  const updateStepState = useCallback(
    (stepId: number) => {
      if (selectedMode === "practice") return;
      setShowVerticalPairs(false);
      setActiveLinearPair(null);
      setFadeInAngle(null);
      if (stepId === 1) {
        setRevealedAngles(new Set(["a"]));
        setFadeInAngle("a");
      } else if (stepId === 2) {
        setRevealedAngles(new Set(["a", "b"]));
        setActiveLinearPair("ab");
        setFadeInAngle("b");
      } else if (stepId === 3) {
        setRevealedAngles(new Set(["a", "b", "c"]));
        setActiveLinearPair("bc");
        setFadeInAngle("c");
      } else if (stepId === 4) {
        setRevealedAngles(new Set(["a", "b", "c", "d"]));
        setActiveLinearPair("cd");
        setFadeInAngle("d");
      } else if (stepId === 5) {
        setRevealedAngles(new Set(["a", "b", "c", "d"]));
        setShowVerticalPairs(true);
      }
    },
    [selectedMode],
  );

  useEffect(() => {
    if (currentStep && selectedMode === "learn") {
      updateStepState(currentStep.id);
      setAnimKey((p) => p + 1);
    }
  }, [currentStep, updateStepState, selectedMode]);

  useEffect(() => {
    if (selectedMode !== "practice" || quizComplete) return;
    const q = MCQ_QUESTIONS[mcqIndex];
    if (!q) return;
    if (isAnswered) {
      setRevealedAngles(new Set(q.revealOnAnswer));
      setActiveLinearPair(q.highlightPairOnAnswer);
      setShowVerticalPairs(q.showVerticalOnAnswer);
      setFadeInAngle(null);
    } else {
      setRevealedAngles(new Set([q.givenLabel]));
      setActiveLinearPair(null);
      setShowVerticalPairs(false);
      setFadeInAngle(q.givenLabel);
    }
  }, [selectedMode, mcqIndex, isAnswered, quizComplete]);

  useEffect(() => {
    if (setStepDetails && currentStep)
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: filteredSteps.length,
        isPaused: !isPlaying,
        currentMode: selectedMode,
      });
  }, [
    currentStepIndex,
    filteredSteps.length,
    isPlaying,
    selectedMode,
    setStepDetails,
    currentStep,
  ]);

  useEffect(() => {
    if (!isPlaying || config.autoPlayDuration === 0 || selectedMode !== "learn")
      return;
    const t = setTimeout(() => {
      if (currentStepIndex < filteredSteps.length - 1)
        setCurrentStepIndex((p) => p + 1);
      else setIsPlaying(false);
    }, config.autoPlayDuration);
    return () => clearTimeout(t);
  }, [
    isPlaying,
    currentStepIndex,
    filteredSteps.length,
    config.autoPlayDuration,
    selectedMode,
  ]);

  // ─── HANDLERS ───
  const goNext = useCallback(() => {
    if (currentStepIndex < filteredSteps.length - 1)
      setCurrentStepIndex((p) => p + 1);
  }, [currentStepIndex, filteredSteps.length]);
  const goPrev = useCallback(() => {
    if (currentStepIndex > 0) setCurrentStepIndex((p) => p - 1);
  }, [currentStepIndex]);

  const handleModeChange = useCallback((mode: ModeType) => {
    setSelectedMode(mode);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    if (mode === "practice") {
      setMcqIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setScore(0);
      setQuizComplete(false);
      setMcqAnimKey((p) => p + 1);
      setAnsweredQuestions({});
    }
    if (mode === "learn") {
      setRevealedAngles(new Set(["a"]));
      setActiveLinearPair(null);
      setShowVerticalPairs(false);
      setFadeInAngle("a");
    }
  }, []);

  const handleOptionSelect = useCallback(
    (option: number) => {
      if (isAnswered) return;
      setSelectedOption(option);
      setIsAnswered(true);
      const correct = option === currentQuestion.correctAnswer;
      if (correct) setScore((p) => p + 1);
      setAnsweredQuestions((p) => ({
        ...p,
        [mcqIndex]: { selected: option, correct },
      }));
    },
    [isAnswered, currentQuestion, mcqIndex],
  );

  const handleNextQuestion = useCallback(() => {
    if (mcqIndex < MCQ_QUESTIONS.length - 1) {
      setMcqIndex((p) => p + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setMcqAnimKey((p) => p + 1);
    } else {
      setQuizComplete(true);
      setMcqAnimKey((p) => p + 1);
    }
  }, [mcqIndex]);

  const handleRetakeQuiz = useCallback(() => {
    setMcqIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizComplete(false);
    setMcqAnimKey((p) => p + 1);
    setAnsweredQuestions({});
  }, []);

  // ─── SVG GEOMETRY ───
  const cx = 300,
    cy = 210,
    lineLen = 200;
  const line1 = { x1: cx - lineLen, y1: cy, x2: cx + lineLen, y2: cy };
  const ar = (angleA * Math.PI) / 180;
  const line2 = {
    x1: cx - lineLen * Math.cos(ar),
    y1: cy + lineLen * Math.sin(ar),
    x2: cx + lineLen * Math.cos(ar),
    y2: cy - lineLen * Math.sin(ar),
  };

  const arcPath = (s: number, e: number, r: number) => {
    const sr = (-s * Math.PI) / 180,
      er = (-e * Math.PI) / 180;
    const x1 = cx + r * Math.cos(sr),
      y1 = cy + r * Math.sin(sr),
      x2 = cx + r * Math.cos(er),
      y2 = cy + r * Math.sin(er);
    return `M ${x1} ${y1} A ${r} ${r} 0 ${Math.abs(e - s) > 180 ? 1 : 0} ${e - s > 0 ? 0 : 1} ${x2} ${y2}`;
  };
  const lpArcPath = (s: number, r: number) => {
    const sr = (-s * Math.PI) / 180,
      er = (-(s + 180) * Math.PI) / 180;
    return `M ${cx + r * Math.cos(sr)} ${cy + r * Math.sin(sr)} A ${r} ${r} 0 1 0 ${cx + r * Math.cos(er)} ${cy + r * Math.sin(er)}`;
  };
  const labelPos = (mid: number, d: number) => ({
    x: cx + d * Math.cos((-mid * Math.PI) / 180),
    y: cy + d * Math.sin((-mid * Math.PI) / 180),
  });

  const tc = toolConfig.angleColors;
  const angleDefs = {
    a: { start: 0, end: angleA, value: angleA, color: tc.a, label: "a" },
    b: { start: angleA, end: 180, value: angleB, color: tc.b, label: "b" },
    c: {
      start: 180,
      end: 180 + angleA,
      value: angleC,
      color: tc.c,
      label: "c",
    },
    d: {
      start: 180 + angleA,
      end: 360,
      value: angleD,
      color: tc.d,
      label: "d",
    },
  };
  const lpDefs: { [k: string]: { start: number } } = {
    ab: { start: 0 },
    bc: { start: angleA },
    cd: { start: 180 },
    da: { start: 180 + angleA },
  };

  // ─── RENDER SVG ───
  const renderGeometry = () => {
    const arcR = toolConfig.arcRadius,
      lpR = arcR + 25;
    const ak = selectedMode === "practice" ? mcqAnimKey : animKey;
    return (
      <svg
        viewBox="0 0 600 420"
        style={{
          width: "100%",
          maxWidth: 520,
          height: "auto",
          display: "block",
          margin: "0 auto",
        }}
      >
        {Object.entries(angleDefs).map(([k, d]) => {
          if (!revealedAngles.has(k)) return null;
          return (
            <path
              key={`f-${k}-${ak}`}
              d={arcPath(d.start, d.end, arcR)}
              fill="none"
              stroke={d.color}
              strokeWidth={arcR * 0.2}
              opacity={0.18}
              strokeLinecap="round"
              style={{
                animation:
                  fadeInAngle === k
                    ? "fadeIn 0.6s ease-out forwards"
                    : undefined,
              }}
            />
          );
        })}
        {Object.entries(angleDefs).map(([k, d]) => {
          if (!revealedAngles.has(k)) return null;
          return (
            <path
              key={`a-${k}-${ak}`}
              d={arcPath(d.start, d.end, arcR)}
              fill="none"
              stroke={d.color}
              strokeWidth={2.5}
              strokeLinecap="round"
              style={{
                animation:
                  fadeInAngle === k
                    ? "arcDraw 0.8s ease-out forwards"
                    : undefined,
              }}
            />
          );
        })}
        {activeLinearPair && lpDefs[activeLinearPair] && (
          <g key={`lp-${activeLinearPair}-${ak}`}>
            <path
              d={lpArcPath(lpDefs[activeLinearPair].start, lpR)}
              fill="none"
              stroke={DS.purpleLight}
              strokeWidth={2.5}
              strokeDasharray="6 4"
              opacity={0.85}
              style={{
                animation:
                  "arcDraw 1s ease-out forwards, arcPulse 2s ease-in-out infinite 1s",
              }}
              strokeDashoffset={200}
            />
            {(() => {
              const p = labelPos(lpDefs[activeLinearPair].start + 90, lpR + 15);
              return (
                <text
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={DS.purple}
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="'Poppins', sans-serif"
                  style={{ animation: "fadeIn 0.6s ease-out 0.5s both" }}
                >
                  180°
                </text>
              );
            })()}
          </g>
        )}
        {showVerticalPairs && (
          <g key={`vp-${ak}`}>
            {[
              ["a", "c", DS.purple],
              ["b", "d", DS.orangeMid],
            ].map(([k1, k2, col], gi) => (
              <g key={gi}>
                <path
                  d={arcPath(
                    angleDefs[k1 as keyof typeof angleDefs].start,
                    angleDefs[k1 as keyof typeof angleDefs].end,
                    arcR + 8,
                  )}
                  fill="none"
                  stroke={col as string}
                  strokeWidth={4}
                  opacity={0.4}
                  style={{
                    animation: `fadeIn 0.5s ease-out ${gi * 0.3}s both`,
                  }}
                />
                <path
                  d={arcPath(
                    angleDefs[k2 as keyof typeof angleDefs].start,
                    angleDefs[k2 as keyof typeof angleDefs].end,
                    arcR + 8,
                  )}
                  fill="none"
                  stroke={col as string}
                  strokeWidth={4}
                  opacity={0.4}
                  style={{
                    animation: `fadeIn 0.5s ease-out ${gi * 0.3 + 0.15}s both`,
                  }}
                />
                {(() => {
                  const p1 = labelPos(
                    (angleDefs[k1 as keyof typeof angleDefs].start +
                      angleDefs[k1 as keyof typeof angleDefs].end) /
                      2,
                    arcR + 28,
                  );
                  const p2 = labelPos(
                    (angleDefs[k2 as keyof typeof angleDefs].start +
                      angleDefs[k2 as keyof typeof angleDefs].end) /
                      2,
                    arcR + 28,
                  );
                  return (
                    <>
                      <text
                        x={p1.x}
                        y={p1.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={col as string}
                        fontSize="10"
                        fontWeight="700"
                        fontFamily="'Poppins'"
                        style={{
                          animation: `equalSign 0.5s ease-out ${0.8 + gi * 0.4}s both`,
                        }}
                      >
                        =
                      </text>
                      <text
                        x={p2.x}
                        y={p2.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={col as string}
                        fontSize="10"
                        fontWeight="700"
                        fontFamily="'Poppins'"
                        style={{
                          animation: `equalSign 0.5s ease-out ${1 + gi * 0.4}s both`,
                        }}
                      >
                        =
                      </text>
                    </>
                  );
                })()}
              </g>
            ))}
          </g>
        )}
        <line
          x1={line1.x1}
          y1={line1.y1}
          x2={line1.x2}
          y2={line1.y2}
          stroke={toolConfig.lineColor}
          strokeWidth={toolConfig.lineThickness}
          strokeLinecap="round"
          strokeDasharray="600"
          style={{ animation: "drawLine 0.8s ease-out forwards" }}
        />
        <line
          x1={line2.x1}
          y1={line2.y1}
          x2={line2.x2}
          y2={line2.y2}
          stroke={toolConfig.lineColor}
          strokeWidth={toolConfig.lineThickness}
          strokeLinecap="round"
          strokeDasharray="600"
          style={{ animation: "drawLine 0.8s ease-out 0.2s both" }}
        />
        <text
          x={line1.x2 - 5}
          y={line1.y2 - 12}
          fill={DS.grey400}
          fontSize="13"
          fontWeight="600"
          fontFamily="'Poppins'"
          fontStyle="italic"
          style={{ animation: "fadeIn 0.5s ease-out 0.6s both" }}
        >
          l
        </text>
        <text
          x={line2.x2 + 5}
          y={line2.y2 + 5}
          fill={DS.grey400}
          fontSize="13"
          fontWeight="600"
          fontFamily="'Poppins'"
          fontStyle="italic"
          style={{ animation: "fadeIn 0.5s ease-out 0.6s both" }}
        >
          m
        </text>
        <circle
          cx={cx}
          cy={cy}
          r={toolConfig.intersectionDotSize}
          fill={DS.grey900}
          style={{ animation: "popIn 0.5s ease-out 0.4s both" }}
        />
        {Object.entries(angleDefs).map(([k, d]) => {
          if (!revealedAngles.has(k)) return null;
          const isFading = fadeInAngle === k;
          const p = labelPos((d.start + d.end) / 2, arcR - 18);
          return (
            <g key={`lb-${k}-${ak}`}>
              <text
                x={p.x}
                y={p.y - 7}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={d.color}
                fontSize="14"
                fontWeight="700"
                fontFamily="'Poppins'"
                style={{
                  animation: isFading
                    ? "bounceIn 0.7s ease-out forwards"
                    : "fadeIn 0.3s ease-out forwards",
                }}
              >
                ∠{d.label}
              </text>
              <text
                x={p.x}
                y={p.y + 9}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={d.color}
                fontSize="12"
                fontWeight="600"
                fontFamily="'Poppins'"
                style={{
                  animation: isFading
                    ? "bounceIn 0.7s ease-out 0.2s both"
                    : "fadeIn 0.3s ease-out forwards",
                }}
              >
                {d.value}°
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // ─── LEARN PANEL ───
  const renderLearnStepInfo = () => {
    if (!currentStep) return null;
    const sid = currentStep.id;
    const aA = learnAngleA,
      aB = 180 - aA;

    const calcFor = (
      pair: [string, string],
      given: number,
      gCol: string,
      fCol: string,
      fLabel: string,
      result: number,
    ) => (
      <div
        style={{
          background: DS.grey100,
          borderRadius: 14,
          padding: "14px 18px",
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "'Poppins'",
          lineHeight: 1.8,
          borderLeft: `4px solid ${fCol}`,
          animation: "fadeInUp 0.5s ease-out 0.3s both",
        }}
      >
        <span style={{ color: gCol }}>∠{pair[0]}</span> +{" "}
        <span style={{ color: fCol }}>∠{pair[1]}</span> = 180°
        <br />
        <span style={{ color: gCol }}>{given}°</span> +{" "}
        <span style={{ color: fCol }}>∠{fLabel}</span> = 180°
        <br />
        <span style={{ fontWeight: 700, color: fCol }}>
          ∴ ∠{fLabel} = {result}°
        </span>
      </div>
    );

    let calc: ReactNode = null;
    if (sid === 2) calc = calcFor(["a", "b"], aA, tc.a, tc.b, "b", aB);
    else if (sid === 3) calc = calcFor(["b", "c"], aB, tc.b, tc.c, "c", aA);
    else if (sid === 4) calc = calcFor(["c", "d"], aA, tc.c, tc.d, "d", aB);
    else if (sid === 5)
      calc = (
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            animation: "fadeInUp 0.5s ease-out 0.3s both",
          }}
        >
          <div
            style={{
              background: DS.purpleBg,
              borderRadius: 12,
              padding: "10px 16px",
              flex: "1 1 150px",
              borderLeft: `4px solid ${DS.purple}`,
            }}
          >
            <span
              style={{
                color: DS.purple,
                fontWeight: 700,
                fontSize: 14,
                fontFamily: "'Poppins'",
              }}
            >
              ∠a = ∠c = {aA}°
            </span>
            <div
              style={{
                fontSize: 11,
                color: DS.grey400,
                marginTop: 2,
                fontFamily: "'Poppins'",
              }}
            >
              Vertically Opposite
            </div>
          </div>
          <div
            style={{
              background: DS.orangeLight,
              borderRadius: 12,
              padding: "10px 16px",
              flex: "1 1 150px",
              borderLeft: `4px solid ${DS.orange}`,
            }}
          >
            <span
              style={{
                color: DS.orange,
                fontWeight: 700,
                fontSize: 14,
                fontFamily: "'Poppins'",
              }}
            >
              ∠b = ∠d = {aB}°
            </span>
            <div
              style={{
                fontSize: 11,
                color: DS.grey400,
                marginTop: 2,
                fontFamily: "'Poppins'",
              }}
            >
              Vertically Opposite
            </div>
          </div>
        </div>
      );

    return (
      <div
        key={`s-${sid}-${animKey}`}
        style={{ animation: "fadeInUp 0.5s ease-out forwards" }}
      >
        <div style={S.stepTitle}>{currentStep.title}</div>
        <div style={S.stepDesc}>{currentStep.description}</div>
        {calc}
      </div>
    );
  };

  // ─── MCQ PANEL ───
  const renderPracticeMode = () => {
    if (quizComplete) {
      const pct = Math.round((score / MCQ_QUESTIONS.length) * 100);
      const emoji = pct === 100 ? "🌟" : pct >= 60 ? "👏" : "💪";
      const msg =
        pct === 100
          ? "Perfect Score! Geometry star!"
          : pct >= 80
            ? "Excellent! Almost perfect!"
            : pct >= 60
              ? "Good job! Keep practising!"
              : "Review Learn mode and try again.";
      return (
        <div
          key={`done-${mcqAnimKey}`}
          style={{
            textAlign: "center" as const,
            padding: "10px 0",
            animation: "fadeInUp 0.5s ease-out forwards",
          }}
        >
          <div
            style={{
              fontSize: 38,
              animation: "scoreReveal 0.6s ease-out both",
              marginBottom: 4,
            }}
          >
            {emoji}
          </div>
          <div
            style={{
              fontFamily: "'Poppins'",
              fontSize: 20,
              fontWeight: 700,
              color: DS.purpleDark,
              marginBottom: 6,
              animation: "scoreReveal 0.6s ease-out 0.2s both",
            }}
          >
            Quiz Complete!
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: pct >= 60 ? DS.greenBg : DS.redBg,
              border: `2px solid ${pct >= 60 ? DS.green : DS.red}`,
              borderRadius: 40,
              padding: "8px 24px",
              fontSize: 18,
              fontWeight: 700,
              color: pct >= 60 ? DS.green : DS.red,
              fontFamily: "'Poppins'",
              animation: "scoreReveal 0.6s ease-out 0.4s both",
            }}
          >
            <Award size={20} />
            {score} / {MCQ_QUESTIONS.length}
          </div>
          <div
            style={{
              fontSize: 13,
              color: DS.grey900,
              fontWeight: 500,
              marginTop: 8,
              fontFamily: "'Poppins'",
              animation: "fadeIn 0.5s ease-out 0.6s both",
            }}
          >
            {msg}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginTop: 12,
              animation: "fadeIn 0.5s ease-out 0.8s both",
              flexWrap: "wrap" as const,
            }}
          >
            {MCQ_QUESTIONS.map((_, i) => {
              const a = answeredQuestions[i];
              return (
                <div
                  key={i}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: a?.correct ? DS.greenBg : DS.redBg,
                    border: `2px solid ${a?.correct ? DS.green : DS.red}`,
                    color: a?.correct ? DS.green : DS.red,
                  }}
                >
                  {a?.correct ? <Check size={15} /> : <X size={15} />}
                </div>
              );
            })}
          </div>
          <button
            onClick={handleRetakeQuiz}
            style={{
              ...S.btnContained,
              marginTop: 16,
              animation: "fadeIn 0.5s ease-out 1s both",
            }}
          >
            <RotateCcw size={14} /> Retake Quiz
          </button>
        </div>
      );
    }

    const q = currentQuestion;
    const isCorrect = selectedOption === q.correctAnswer;

    return (
      <div
        key={`mcq-${mcqIndex}-${mcqAnimKey}`}
        style={{ animation: "fadeInUp 0.4s ease-out forwards" }}
      >
        {/* Progress */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: DS.grey400,
              fontFamily: "'Poppins'",
            }}
          >
            Q{mcqIndex + 1}/{MCQ_QUESTIONS.length}
          </span>
          <div
            style={{
              flex: 1,
              height: 5,
              background: DS.grey200,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${((mcqIndex + (isAnswered ? 1 : 0)) / MCQ_QUESTIONS.length) * 100}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${DS.purple}, ${DS.orangeMid})`,
                borderRadius: 3,
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              fontSize: 12,
              fontWeight: 700,
              color: DS.purple,
              fontFamily: "'Poppins'",
            }}
          >
            <Star size={12} />
            {score}
          </div>
        </div>

        {/* Question card */}
        <div
          style={{
            background: DS.purpleBg,
            borderRadius: 14,
            padding: "14px 18px",
            borderLeft: `4px solid ${DS.purple}`,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: DS.purpleDark,
              fontFamily: "'Poppins'",
            }}
          >
            If ∠{q.givenLabel} = {q.givenAngle}°, what is {q.askAngle}?
          </div>
        </div>

        {/* Options */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          {q.options.map((opt, i) => {
            const isSel = selectedOption === opt,
              isCor = opt === q.correctAnswer;
            let bg = DS.white,
              bc = DS.grey200,
              txtC = DS.grey900,
              icon: ReactNode = null,
              anim: any = {
                animation: `fadeInUp 0.3s ease-out ${i * 0.06}s both`,
              };

            if (isAnswered) {
              if (isCor) {
                bg = DS.greenBg;
                bc = DS.green;
                txtC = DS.green;
                icon = <Check size={15} />;
                anim = { animation: "correctPop 0.4s ease-out forwards" };
              } else if (isSel && !isCor) {
                bg = DS.redBg;
                bc = DS.red;
                txtC = DS.red;
                icon = <X size={15} />;
                anim = { animation: "shakeWrong 0.5s ease-out forwards" };
              } else {
                bg = DS.grey100;
                bc = DS.grey200;
                txtC = DS.grey400;
                anim = {};
              }
            }

            return (
              <button
                key={`${opt}-${i}`}
                onClick={() => handleOptionSelect(opt)}
                disabled={isAnswered}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "12px 14px",
                  borderRadius: 40,
                  border: `2px solid ${bc}`,
                  background: bg,
                  color: txtC,
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: "'Poppins'",
                  cursor: isAnswered ? "default" : "pointer",
                  transition: "all 0.2s ease",
                  ...anim,
                }}
              >
                {icon}
                {opt}°
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div style={{ animation: "fadeInUp 0.4s ease-out 0.2s both" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 12,
                padding: "10px 14px",
                borderRadius: 14,
                background: isCorrect ? DS.greenBg : DS.redBg,
                border: `1.5px solid ${isCorrect ? DS.green : DS.red}`,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: isCorrect ? DS.green : DS.red,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isCorrect ? (
                  <Check size={14} style={{ color: DS.white }} />
                ) : (
                  <X size={14} style={{ color: DS.white }} />
                )}
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: isCorrect ? "#166534" : "#991b1b",
                  fontFamily: "'Poppins'",
                }}
              >
                {isCorrect
                  ? "Correct! Well done!"
                  : `Not quite! Answer: ${q.correctAnswer}°`}
              </span>
            </div>
            <div
              style={{
                marginTop: 8,
                padding: "10px 14px",
                borderRadius: 12,
                background: DS.orangeLight,
                borderLeft: `3px solid ${DS.orangeMid}`,
                fontSize: 12,
                fontWeight: 500,
                color: DS.grey900,
                lineHeight: 1.6,
                fontFamily: "'Poppins'",
                animation: "fadeIn 0.4s ease-out 0.4s both",
              }}
            >
              <span style={{ fontWeight: 700, color: DS.orange }}>
                Explanation:{" "}
              </span>
              {q.explanation}
            </div>
            <button
              onClick={handleNextQuestion}
              style={{
                ...S.btnContained,
                marginTop: 12,
                animation: "fadeIn 0.4s ease-out 0.5s both",
              }}
            >
              {mcqIndex < MCQ_QUESTIONS.length - 1
                ? "Next Question →"
                : "See Results →"}
            </button>
          </div>
        )}
      </div>
    );
  };

  // ─── MAIN RENDER ───
  return (
    <div
      style={{
        ...S.container,
        width: config.width,
        maxWidth: "100%",
        minHeight: config.height,
      }}
    >
      {/* Header with gradient */}
      <div style={S.header}>
        <div style={S.headerTitle}>Angles at Intersection & Linear Pairs</div>
        <div style={S.headerSub}>
          {selectedMode === "learn"
            ? "Step-by-step exploration using linear pairs"
            : "5 MCQ questions — test your understanding"}
        </div>
      </div>

      {/* Mode tabs */}
      {config.showModeSelector && (
        <div style={S.modeBar}>
          {config.enabledModes.map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              style={{
                ...S.modeTab,
                ...(selectedMode === mode ? S.modeTabActive : {}),
              }}
            >
              {mode === "learn" ? <BookOpen size={15} /> : <Target size={15} />}
              <span>{mode === "learn" ? "Learn" : "Practice"}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <div style={S.mainContent}>
        <div style={S.svgCard}>{renderGeometry()}</div>
        <div style={S.infoPanel}>
          {selectedMode === "learn"
            ? renderLearnStepInfo()
            : renderPracticeMode()}
        </div>
      </div>

      {/* Navigation (learn) */}
      {selectedMode === "learn" && config.showNavigation && (
        <div style={S.navBar}>
          <button
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            style={{
              ...S.btnOutlined,
              opacity: currentStepIndex === 0 ? 0.4 : 1,
            }}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          {config.showStepIndicator && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {filteredSteps.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === currentStepIndex ? 22 : 8,
                    height: 8,
                    borderRadius: 4,
                    background:
                      i === currentStepIndex ? DS.purple : DS.purpleLight,
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          )}
          <button
            onClick={goNext}
            disabled={currentStepIndex === filteredSteps.length - 1}
            style={{
              ...S.btnOutlined,
              opacity: currentStepIndex === filteredSteps.length - 1 ? 0.4 : 1,
            }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Footer */}
      <div style={S.footer}>
        <Zap size={12} style={{ marginRight: 4 }} />
        {selectedMode === "learn"
          ? "Navigate with arrows. Linear pairs add to 180°."
          : quizComplete
            ? "Switch to Learn to review."
            : "Wrong answers reveal the correct option."}
      </div>
    </div>
  );
};

// ==================== STYLES (Singularity Design System) ====================

const S: { [k: string]: CSSProperties } = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(74,77,201,0.10), 0 2px 8px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    border: `1px solid ${DS.grey200}`,
    background: DS.white,
  },
  header: {
    background: `linear-gradient(135deg, ${DS.purpleDark} 0%, ${DS.purple} 40%, ${DS.orangeMid} 100%)`,
    padding: "20px 24px 16px",
    textAlign: "center" as const,
  },
  headerTitle: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: DS.white,
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  headerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.82)",
    fontWeight: 500,
    fontFamily: "'Poppins'",
  },
  modeBar: {
    display: "flex",
    background: DS.grey100,
    borderBottom: `1px solid ${DS.grey200}`,
  },
  modeTab: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "11px 16px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    color: DS.grey400,
    fontFamily: "'Poppins'",
    transition: "all 0.3s ease",
    borderBottom: "3px solid transparent",
  },
  modeTabActive: {
    color: DS.purple,
    borderBottom: `3px solid ${DS.purple}`,
    background: DS.white,
  },
  mainContent: {
    display: "flex",
    flexDirection: "column" as const,
    padding: "16px 20px",
    gap: 14,
    flex: 1,
  },
  svgCard: {
    background: DS.grey100,
    borderRadius: 16,
    border: `1px solid ${DS.grey200}`,
    padding: "10px 6px",
  },
  infoPanel: { padding: "2px 2px 0", minHeight: 90 },
  stepTitle: {
    fontFamily: "'Poppins'",
    fontSize: 16,
    fontWeight: 700,
    color: DS.purpleDark,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 13,
    color: DS.grey900,
    lineHeight: 1.6,
    fontWeight: 500,
    marginBottom: 10,
    fontFamily: "'Poppins'",
  },
  navBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    borderTop: `1px solid ${DS.grey200}`,
    background: DS.grey100,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 20px",
    background: DS.purpleBg,
    fontSize: 11,
    color: DS.purple,
    fontWeight: 600,
    borderTop: `1px solid ${DS.purpleLight}`,
    fontFamily: "'Poppins'",
  },
  // Buttons — Singularity "Contained" style
  btnContained: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "0 24px",
    height: 40,
    borderRadius: 40,
    border: "none",
    background: `linear-gradient(135deg, ${DS.purple}, ${DS.orangeMid})`,
    color: DS.white,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'Poppins'",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  // Buttons — Singularity "Outlined" style
  btnOutlined: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "0 20px",
    height: 36,
    borderRadius: 40,
    border: `1.5px solid ${DS.purple}`,
    background: DS.white,
    color: DS.purple,
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "'Poppins'",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};

export default LinearPairAngleFinder;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
