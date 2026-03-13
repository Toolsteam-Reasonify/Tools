// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: draw_parallel_lines_tool.tsx
// Singularity Design System — Fully Responsive All Devices
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Self-contained (no external React/icon imports) for typecheck without @types/react.
 */
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
type CSSProperties = Record<string, any>;
type FC<P = {}> = (props: P) => any;

const { useState, useEffect, useRef, useCallback, useMemo } = React;

type IconProps = {
  size?: number;
  style?: any;
  color?: string;
  strokeWidth?: number;
  fill?: string;
  [key: string]: any;
};
const IconBase = ({
  size = 16,
  style,
  color,
  strokeWidth = 2,
  fill,
  children,
  ...rest
}: IconProps & { children?: ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill ?? "none"}
    stroke={color ?? "currentColor"}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    aria-hidden="true"
    focusable="false"
    {...rest}
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
const Globe = (p: IconProps) => (
  <IconBase {...p}><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></IconBase>
);
const Eye = (p: IconProps) => (
  <IconBase {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></IconBase>
);
const Zap = (p: IconProps) => (
  <IconBase {...p}><path d="M13 2L3 14h7l-1 8 12-14h-7l-1-6z" /></IconBase>
);
const Star = (p: IconProps) => (
  <IconBase {...p}><path d="M12 2l3 7 7 .5-5.5 4.5 2 7-6.5-4-6.5 4 2-7L2 9.5 9 9l3-7z" /></IconBase>
);
const Award = (p: IconProps) => (
  <IconBase {...p}><path d="M12 2l2.2 4.4 4.8.7-3.5 3.4.8 4.8L12 13.8 7.7 15.3l.8-4.8L5 7.1l4.8-.7L12 2z" /><path d="M8 14v8l4-2 4 2v-8" /></IconBase>
);
const HelpCircle = (p: IconProps) => (
  <IconBase {...p}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></IconBase>
);
const Plus = (p: IconProps) => (
  <IconBase {...p}><path d="M12 5v14" /><path d="M5 12h14" /></IconBase>
);

// ==================== TYPES ====================

type ModeType = "learn" | "practice" | "real_world" | "hands_on";
type Breakpoint = "xs" | "sm" | "md" | "lg";
type BtnVariant = "contained" | "outlined" | "texted" | "highlight";
type BtnState = "enabled" | "disabled" | "hover" | "pressed";

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
  type: string;
  mode: ModeType;
  data?: any;
}
interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}
interface Challenge {
  givenLine: { start: [number, number]; end: [number, number] };
  difficulty: "Easy" | "Medium" | "Hard";
  hint: string;
  label: string;
}
interface DrawnLine {
  start: [number, number];
  end: [number, number];
  isCorrect: boolean;
  opacity: number;
}
interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface DrawParallelLinesAdditionalProps {
  gridCols?: number;
  gridRows?: number;
  dotSize?: number;
  challenges?: Challenge[];
  primaryColor?: string;
  accentColor?: string;
  givenLineColor?: string;
  correctColor?: string;
  incorrectColor?: string;
  slopeTolerance?: number;
  showGrid?: boolean;
}

interface DrawParallelLinesToolProps {
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
    additionalProps?: DrawParallelLinesAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  primary: "#4A4DC9",
  primaryHover: "#3A3DA9",
  primaryPressed: "#333599",
  primaryLight: "#C1C1EA",
  primaryGhost: "#EDEDF8",
  accent: "#FF7212",
  accentHover: "#E56400",
  accentPressed: "#D05A00",
  accentLight: "#FFF3E4",
  accentMid: "#FC9145",
  gradientStart: "#533086",
  gradientEnd: "#FC9145",
  neutral900: "#4E4E4E",
  neutral600: "#7A7A7A",
  neutral400: "#CACACA",
  neutral200: "#EBEBEB",
  neutral100: "#F5F5F5",
  white: "#FFFFFF",
  success: "#2ECC71",
  successDark: "#27AE60",
  successLight: "#E8F8F0",
  error: "#E74C3C",
  errorDark: "#C0392B",
  errorLight: "#FDE8E6",
  fontFamily: '"Poppins", sans-serif',
  btnRadius: "9999px",
  radius: { sm: "8px", md: "12px", lg: "16px", xl: "24px", pill: "9999px" },
  shadow: {
    sm: "0 1px 3px rgba(74,77,201,0.08)",
    md: "0 4px 12px rgba(74,77,201,0.12)",
    lg: "0 8px 24px rgba(74,77,201,0.14)",
    xl: "0 12px 40px rgba(74,77,201,0.16)",
  },
};

// ==================== RESPONSIVE VALUES ====================

interface RV {
  btnH: number;
  btnPx: number;
  btnFs: number;
  btnGap: number;
  btnIcon: number;
  modeBtnH: number;
  modeBtnPx: number;
  modeBtnFs: number;
  modeIcon: number;
  hdrPx: number;
  hdrPy: number;
  hdrTitle: number;
  hdrSub: number;
  hdrStepFs: number;
  hdrStepPx: number;
  gridPad: number;
  dotTap: number;
  dotBase: number;
  lineW: number;
  endR: number;
  hintFs: number;
  feedbackFs: number;
  feedbackPx: number;
  feedbackPy: number;
  mcqQFs: number;
  mcqQPad: number;
  mcqOptFs: number;
  mcqOptPad: number;
  mcqCircle: number;
  mcqCircleFs: number;
  mcqExpFs: number;
  navPad: number;
  celebIcon: number;
  celebTitle: number;
  celebBody: number;
  celebStar: number;
  celebPad: number;
  rwFs: number;
  rwPad: number;
  contentGap: number;
  showBtnLabel: boolean;
  showModeLabel: boolean;
  showGivenLabel: boolean;
  showHintLabel: boolean;
}

const getRV = (bp: Breakpoint): RV => {
  switch (bp) {
    case "xs":
      return {
        btnH: 28,
        btnPx: 10,
        btnFs: 10,
        btnGap: 3,
        btnIcon: 12,
        modeBtnH: 26,
        modeBtnPx: 8,
        modeBtnFs: 9,
        modeIcon: 10,
        hdrPx: 10,
        hdrPy: 8,
        hdrTitle: 13,
        hdrSub: 9,
        hdrStepFs: 9,
        hdrStepPx: 6,
        gridPad: 10,
        dotTap: 34,
        dotBase: 3,
        lineW: 2,
        endR: 4,
        hintFs: 9,
        feedbackFs: 12,
        feedbackPx: 14,
        feedbackPy: 7,
        mcqQFs: 12,
        mcqQPad: 10,
        mcqOptFs: 11,
        mcqOptPad: 8,
        mcqCircle: 22,
        mcqCircleFs: 10,
        mcqExpFs: 10,
        navPad: 6,
        celebIcon: 44,
        celebTitle: 16,
        celebBody: 10,
        celebStar: 18,
        celebPad: 14,
        rwFs: 12,
        rwPad: 12,
        contentGap: 8,
        showBtnLabel: false,
        showModeLabel: false,
        showGivenLabel: false,
        showHintLabel: false,
      };
    case "sm":
      return {
        btnH: 32,
        btnPx: 14,
        btnFs: 11,
        btnGap: 4,
        btnIcon: 13,
        modeBtnH: 30,
        modeBtnPx: 12,
        modeBtnFs: 10,
        modeIcon: 12,
        hdrPx: 12,
        hdrPy: 10,
        hdrTitle: 14,
        hdrSub: 10,
        hdrStepFs: 10,
        hdrStepPx: 8,
        gridPad: 14,
        dotTap: 38,
        dotBase: 3.5,
        lineW: 2.5,
        endR: 5,
        hintFs: 10,
        feedbackFs: 13,
        feedbackPx: 18,
        feedbackPy: 9,
        mcqQFs: 13,
        mcqQPad: 12,
        mcqOptFs: 12,
        mcqOptPad: 10,
        mcqCircle: 24,
        mcqCircleFs: 11,
        mcqExpFs: 11,
        navPad: 8,
        celebIcon: 52,
        celebTitle: 18,
        celebBody: 11,
        celebStar: 20,
        celebPad: 18,
        rwFs: 13,
        rwPad: 14,
        contentGap: 10,
        showBtnLabel: false,
        showModeLabel: true,
        showGivenLabel: false,
        showHintLabel: false,
      };
    case "md":
      return {
        btnH: 36,
        btnPx: 20,
        btnFs: 12,
        btnGap: 4,
        btnIcon: 14,
        modeBtnH: 34,
        modeBtnPx: 16,
        modeBtnFs: 12,
        modeIcon: 13,
        hdrPx: 16,
        hdrPy: 12,
        hdrTitle: 16,
        hdrSub: 11,
        hdrStepFs: 11,
        hdrStepPx: 10,
        gridPad: 20,
        dotTap: 42,
        dotBase: 3.5,
        lineW: 3,
        endR: 6,
        hintFs: 11,
        feedbackFs: 15,
        feedbackPx: 24,
        feedbackPy: 11,
        mcqQFs: 15,
        mcqQPad: 14,
        mcqOptFs: 13,
        mcqOptPad: 12,
        mcqCircle: 28,
        mcqCircleFs: 12,
        mcqExpFs: 12,
        navPad: 10,
        celebIcon: 60,
        celebTitle: 22,
        celebBody: 13,
        celebStar: 24,
        celebPad: 28,
        rwFs: 15,
        rwPad: 20,
        contentGap: 12,
        showBtnLabel: true,
        showModeLabel: true,
        showGivenLabel: true,
        showHintLabel: true,
      };
    default:
      return {
        btnH: 40,
        btnPx: 24,
        btnFs: 13,
        btnGap: 4,
        btnIcon: 15,
        modeBtnH: 38,
        modeBtnPx: 20,
        modeBtnFs: 13,
        modeIcon: 14,
        hdrPx: 20,
        hdrPy: 14,
        hdrTitle: 17,
        hdrSub: 12,
        hdrStepFs: 11,
        hdrStepPx: 12,
        gridPad: 24,
        dotTap: 44,
        dotBase: 3.5,
        lineW: 3.5,
        endR: 7,
        hintFs: 12,
        feedbackFs: 16,
        feedbackPx: 28,
        feedbackPy: 12,
        mcqQFs: 16,
        mcqQPad: 16,
        mcqOptFs: 14,
        mcqOptPad: 14,
        mcqCircle: 32,
        mcqCircleFs: 13,
        mcqExpFs: 13,
        navPad: 12,
        celebIcon: 72,
        celebTitle: 26,
        celebBody: 14,
        celebStar: 28,
        celebPad: 40,
        rwFs: 16,
        rwPad: 24,
        contentGap: 14,
        showBtnLabel: true,
        showModeLabel: true,
        showGivenLabel: true,
        showHintLabel: true,
      };
  }
};

const getBreakpoint = (w: number): Breakpoint =>
  w < 380 ? "xs" : w < 600 ? "sm" : w < 900 ? "md" : "lg";

// ==================== BUTTON STYLE CALCULATOR ====================

const getSingBtnStyle = (
  variant: BtnVariant,
  state: BtnState,
  rv: RV,
): CSSProperties => {
  let bg = "transparent",
    color = DS.primary,
    border = "none",
    shadow = "none";
  if (variant === "contained") {
    bg =
      state === "disabled"
        ? DS.neutral200
        : state === "pressed"
          ? DS.primaryPressed
          : state === "hover"
            ? DS.primaryHover
            : DS.primary;
    color = state === "disabled" ? DS.neutral400 : DS.white;
    shadow = state === "hover" ? DS.shadow.md : DS.shadow.sm;
  } else if (variant === "highlight") {
    bg =
      state === "disabled"
        ? DS.neutral200
        : state === "pressed"
          ? DS.accentPressed
          : state === "hover"
            ? DS.accentHover
            : DS.accent;
    color = state === "disabled" ? DS.neutral400 : DS.white;
    shadow = state === "hover" ? DS.shadow.md : DS.shadow.sm;
  } else if (variant === "outlined") {
    bg =
      state === "hover"
        ? DS.primaryGhost
        : state === "pressed"
          ? DS.primaryGhost
          : "transparent";
    color = state === "disabled" ? DS.neutral400 : DS.primary;
    border = `2px solid ${state === "disabled" ? DS.neutral200 : state === "hover" ? DS.primary : DS.neutral400}`;
  } else {
    bg = state === "hover" ? DS.primaryGhost : "transparent";
    color = state === "disabled" ? DS.neutral400 : DS.primary;
  }
  if (state === "disabled") shadow = "none";
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: `${rv.btnGap}px`,
    height: `${rv.btnH}px`,
    padding: `0 ${rv.btnPx}px`,
    borderRadius: DS.btnRadius,
    border,
    background: bg,
    color,
    fontFamily: DS.fontFamily,
    fontWeight: 600,
    fontSize: `${rv.btnFs}px`,
    cursor: state === "disabled" ? "not-allowed" : "pointer",
    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
    boxShadow: shadow,
    transform: state === "pressed" ? "scale(0.96)" : "scale(1)",
    whiteSpace: "nowrap" as const,
    outline: "none",
    opacity: 1,
    minWidth: 0,
  };
};

// ==================== EASING ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOutElastic = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};
const easeOutBounce = (t: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

// ==================== DATA ====================

const DEFAULT_CHALLENGES: Challenge[] = [
  {
    givenLine: { start: [1, 3], end: [6, 3] },
    difficulty: "Easy",
    hint: "Horizontal — same row!",
    label: "Horizontal",
  },
  {
    givenLine: { start: [4, 1], end: [4, 6] },
    difficulty: "Easy",
    hint: "Vertical — same column!",
    label: "Vertical",
  },
  {
    givenLine: { start: [1, 1], end: [5, 5] },
    difficulty: "Medium",
    hint: "45° — equal right and down!",
    label: "45° Diagonal",
  },
  {
    givenLine: { start: [2, 1], end: [6, 3] },
    difficulty: "Hard",
    hint: "4 right → 2 down!",
    label: "Gentle Slope",
  },
  {
    givenLine: { start: [1, 2], end: [4, 7] },
    difficulty: "Hard",
    hint: "3 right → 5 down!",
    label: "Steep Slope",
  },
];

const MCQ_QUESTIONS: MCQQuestion[] = [
  {
    id: 1,
    question: "Which best describes parallel lines?",
    options: [
      "Lines that cross at one point",
      "Lines on the same plane that never meet",
      "Lines that form a right angle",
      "Lines of different lengths",
    ],
    correctIndex: 1,
    explanation: "Parallel lines lie on the same plane and never intersect.",
  },
  {
    id: 2,
    question: "Vertically opposite angles are:",
    options: [
      "Always 90°",
      "Always supplementary",
      "Always equal",
      "Always different",
    ],
    correctIndex: 2,
    explanation: "Vertically opposite angles are always equal.",
  },
  {
    id: 3,
    question: "If a corresponding angle is 65°, the other is:",
    options: ["115°", "65°", "90°", "25°"],
    correctIndex: 1,
    explanation: "Corresponding angles on parallel lines are equal.",
  },
  {
    id: 4,
    question: "Lines are parallel if they have the same:",
    options: ["Length", "Colour", "Slope (rise/run)", "Dots"],
    correctIndex: 2,
    explanation: "Parallel lines share the same slope.",
  },
  {
    id: 5,
    question: "Co-interior angles add up to:",
    options: ["90°", "360°", "180°", "270°"],
    correctIndex: 2,
    explanation: "Co-interior angles are supplementary — 180°.",
  },
];

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Horizontal Parallel",
    description: "Draw a parallel to this horizontal line.",
    type: "intro",
    mode: "learn",
    data: { challengeIndex: 0 },
  },
  {
    id: 2,
    title: "Vertical Parallel",
    description: "Draw a parallel to this vertical line.",
    type: "explanation",
    mode: "learn",
    data: { challengeIndex: 1 },
  },
  {
    id: 3,
    title: "45° Diagonal",
    description: "Match the slope — equal right and down.",
    type: "explanation",
    mode: "learn",
    data: { challengeIndex: 2 },
  },
  {
    id: 4,
    title: "Gentle Slope",
    description: "4 right, 2 down. Keep the ratio!",
    type: "explanation",
    mode: "learn",
    data: { challengeIndex: 3 },
  },
  {
    id: 5,
    title: "Steep Slope",
    description: "3 right, 5 down. Hardest!",
    type: "explanation",
    mode: "learn",
    data: { challengeIndex: 4 },
  },
  {
    id: 10,
    title: "Q1 of 5",
    description: "",
    type: "practice",
    mode: "practice",
    data: { mcqIndex: 0 },
  },
  {
    id: 11,
    title: "Q2 of 5",
    description: "",
    type: "practice",
    mode: "practice",
    data: { mcqIndex: 1 },
  },
  {
    id: 12,
    title: "Q3 of 5",
    description: "",
    type: "practice",
    mode: "practice",
    data: { mcqIndex: 2 },
  },
  {
    id: 13,
    title: "Q4 of 5",
    description: "",
    type: "practice",
    mode: "practice",
    data: { mcqIndex: 3 },
  },
  {
    id: 14,
    title: "Q5 of 5",
    description: "",
    type: "practice",
    mode: "practice",
    data: { mcqIndex: 4 },
  },
  {
    id: 20,
    title: "Railway Tracks",
    description: "Railway tracks are parallel — two rails never meet.",
    type: "real_world",
    mode: "real_world",
  },
  {
    id: 21,
    title: "Ruled Notebook",
    description: "Notebook lines are parallel.",
    type: "real_world",
    mode: "real_world",
  },
  {
    id: 22,
    title: "Building Edges",
    description: "Opposite edges of windows are parallel.",
    type: "real_world",
    mode: "real_world",
  },
  {
    id: 30,
    title: "Free Draw",
    description: "Complete all 5 challenges!",
    type: "hands_on",
    mode: "hands_on",
    data: { freeMode: true, challengeIndex: 0 },
  },
];

const modeConfig: {
  [key in ModeType]: { label: string; from: string; to: string };
} = {
  learn: { label: "Learn", from: "#4A4DC9", to: "#7B7FE0" },
  practice: { label: "Practice", from: "#FF7212", to: "#FC9145" },
  real_world: { label: "Real World", from: "#533086", to: "#8B5CF6" },
  hands_on: { label: "Hands On", from: "#E56400", to: "#FF7212" },
};
const getModeIcon = (m: ModeType, s: number) => {
  switch (m) {
    case "learn":
      return <BookOpen size={s} />;
    case "practice":
      return <Target size={s} />;
    case "real_world":
      return <Globe size={s} />;
    case "hands_on":
      return <Zap size={s} />;
  }
};

// ==================== MAIN COMPONENT ====================

type DrawParallelLinesToolInnerProps =
  NonNullable<DrawParallelLinesToolProps["props"]>;

const DrawParallelLinesTool: FC<DrawParallelLinesToolProps> = ({
  props: incomingProps,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const props: DrawParallelLinesToolInnerProps = incomingProps ?? {};
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: props.initialMode ?? ("learn" as ModeType),
      showModeSelector: props.showModeSelector ?? true,
      enabledModes:
        props.enabledModes ??
        (["learn", "practice", "real_world", "hands_on"] as ModeType[]),
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      initialStep: props.initialStep ?? 1,
      filterSteps: props.filterSteps ?? null,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration:
        props.autoPlayDuration ?? props.data?.autoPlayDuration ?? 8000,
      themeColor: props.themeColor ?? DS.primary,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );
  const additionalProps = props.additionalProps;
  const toolConfig = useMemo(
    () => ({
      gridCols: additionalProps?.gridCols ?? 10,
      gridRows: additionalProps?.gridRows ?? 8,
      dotSize: additionalProps?.dotSize ?? 7,
      challenges: additionalProps?.challenges ?? DEFAULT_CHALLENGES,
      slopeTolerance: additionalProps?.slopeTolerance ?? 0.001,
      showGrid: additionalProps?.showGrid ?? false,
    }),
    [additionalProps],
  );

  // ── RESPONSIVE ──
  const containerRef = useRef(null as any);
  const [cSize, setCSize] = useState({ w: config.width, h: config.height });
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const p = el.parentElement;
      if (!p) return;
      const w = Math.max(280, Math.floor(p.getBoundingClientRect().width));
      const b = getBreakpoint(w);
      let h: number;
      if (b === "xs")
        h = Math.max(480, Math.min(window.innerHeight * 0.88, 660));
      else if (b === "sm")
        h = Math.max(520, Math.min(window.innerHeight * 0.85, 700));
      else if (b === "md") h = Math.max(560, Math.min(w * 0.78, 680));
      else h = Math.max(560, Math.min(w * 0.75, config.height));
      setCSize((prev) =>
        prev.w === w && prev.h === Math.floor(h)
          ? prev
          : { w, h: Math.floor(h) },
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (el.parentElement) ro.observe(el.parentElement);
    const hO = () => setTimeout(measure, 150);
    window.addEventListener("orientationchange", hO);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", hO);
      window.removeEventListener("resize", measure);
    };
  }, [config.width, config.height]);
  const bp = useMemo(() => getBreakpoint(cSize.w), [cSize.w]);
  const rv = useMemo(() => getRV(bp), [bp]);

  // ── STEPS + MODE ──
  const allSteps = props.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(
    () =>
      config.filterSteps?.length
        ? allSteps.filter((s) => config.filterSteps!.includes(s.id))
        : allSteps,
    [allSteps, config.filterSteps],
  );
  const [selectedMode, setSelectedMode] = useState(
    config.initialMode as ModeType,
  );
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!stopAutoNext);
  const [isTrans, setIsTrans] = useState(false);
  const [cOpacity, setCOpacity] = useState(1);
  const [cTransform, setCTransform] = useState("translateY(0)");
  const [btnSt, setBtnSt] = useState({} as Record<string, BtnState>);
  const [selectedDots, setSelectedDots] = useState([] as [number, number][]);
  const [drawnLines, setDrawnLines] = useState([] as DrawnLine[]);
  const [hoveredDot, setHoveredDot] = useState(null as [number, number] | null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(
    null as { type: "correct" | "incorrect"; message: string } | null,
  );
  const [compChallenges, setCompChallenges] = useState(
    new Array(toolConfig.challenges.length).fill(false) as boolean[],
  );
  const [showCeleb, setShowCeleb] = useState(false);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [glAnim, setGlAnim] = useState(0);
  const animRef = useRef(0 as any);
  const touchRef = useRef(0);
  const [mcqAns, setMcqAns] = useState({} as Record<number, number | null>);
  const [mcqRev, setMcqRev] = useState({} as Record<number, boolean>);
  const [mcqScore, setMcqScore] = useState(0);
  const selRef = useRef(selectedDots);
  selRef.current = selectedDots;
  const fbRef = useRef(feedback);
  fbRef.current = feedback;
  const compRef = useRef(compChallenges);
  compRef.current = compChallenges;

  const fSteps = useMemo(
    () => availableSteps.filter((s) => s.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const curStep = fSteps[stepIdx] || fSteps[0];
  const aCI = curStep?.data?.challengeIndex ?? 0;
  const curCh = toolConfig.challenges[aCI];
  const showGrid =
    (selectedMode === "learn" || selectedMode === "hands_on") &&
    curStep?.data?.challengeIndex !== undefined;
  const aMI = curStep?.data?.mcqIndex;
  const aMcq = aMI !== undefined ? MCQ_QUESTIONS[aMI] : null;
  const mg = modeConfig[selectedMode];
  const colors = useMemo(
    () => ({
      bg: config.darkMode ? "#1a1a2e" : DS.neutral100,
      surface: config.darkMode ? "#16213e" : DS.white,
      text: config.darkMode ? "#e2e8f0" : DS.neutral900,
      textSec: config.darkMode ? "#94a3b8" : DS.neutral600,
      border: config.darkMode ? "#334155" : DS.neutral200,
    }),
    [config.darkMode],
  );
  const pPct = fSteps.length > 0 ? ((stepIdx + 1) / fSteps.length) * 100 : 0;

  // ── KEYFRAMES ──
  useEffect(() => {
    const kf = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');@keyframes fadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}@keyframes popIn{0%{transform:scale(0);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}@keyframes singShake{0%,100%{transform:translateX(0)}15%{transform:translateX(-6px)}30%{transform:translateX(6px)}45%{transform:translateX(-4px)}60%{transform:translateX(4px)}75%{transform:translateX(-2px)}}@keyframes singCelebrate{0%{transform:scale(0) rotate(-8deg);opacity:0}50%{transform:scale(1.1) rotate(3deg)}100%{transform:scale(1) rotate(0);opacity:1}}@keyframes singConfetti{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(300px) rotate(720deg);opacity:0}}@keyframes singSlideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}@keyframes singDotPing{0%{transform:scale(1);opacity:1}75%{transform:scale(2);opacity:0}100%{transform:scale(2);opacity:0}}@keyframes optionPop{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`;
    const s = document.createElement("style");
    s.id = "dp-kf";
    s.textContent = kf;
    document.head.appendChild(s);
    return () => {
      const e = document.getElementById("dp-kf");
      if (e) document.head.removeChild(e);
    };
  }, []);
  useEffect(() => {
    if (!showGrid) return;
    setGlAnim(0);
    let s: number | null = null;
    const d = 700 / config.animationSpeed;
    const run = (t: number) => {
      if (!s) s = t;
      const p = Math.min((t - s) / d, 1);
      setGlAnim(easeOutCubic(p));
      if (p < 1) animRef.current = requestAnimationFrame(run);
    };
    animRef.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(animRef.current);
  }, [aCI, showGrid, config.animationSpeed]);
  const [isReAnim, setIsReAnim] = useState(false);
  useEffect(() => {
    if (additionalProps) {
      setIsReAnim(true);
      const t = setTimeout(() => setIsReAnim(false), 1000);
      return () => clearTimeout(t);
    }
  }, [additionalProps]);
  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: stepIdx + 1,
        totalSteps: fSteps.length,
        isPaused: !isPlaying,
        currentMode: selectedMode,
      });
  }, [stepIdx, fSteps.length, isPlaying, selectedMode, setStepDetails]);
  useEffect(() => {
    if (
      !isPlaying ||
      stopAutoNext ||
      config.autoPlayDuration === 0 ||
      selectedMode !== "real_world"
    )
      return;
    const t = setTimeout(() => {
      if (stepIdx < fSteps.length - 1) animStep("next");
      else setIsPlaying(false);
    }, config.autoPlayDuration);
    return () => clearTimeout(t);
  }, [
    isPlaying,
    stepIdx,
    stopAutoNext,
    fSteps.length,
    config.autoPlayDuration,
    selectedMode,
  ]);

  const animStep = useCallback(
    (dir: "next" | "prev") => {
      if (isTrans) return;
      setIsTrans(true);
      setCOpacity(0);
      setCTransform(dir === "next" ? "translateY(-24px)" : "translateY(24px)");
      setTimeout(() => {
        setStepIdx((p) =>
          dir === "next"
            ? Math.min(p + 1, fSteps.length - 1)
            : Math.max(p - 1, 0),
        );
        setSelectedDots([]);
        setDrawnLines([]);
        setFeedback(null);
        setShowHint(false);
        setCTransform(
          dir === "next" ? "translateY(24px)" : "translateY(-24px)",
        );
        setTimeout(() => {
          setCOpacity(1);
          setCTransform("translateY(0)");
          setIsTrans(false);
        }, 50);
      }, 280);
    },
    [isTrans, fSteps.length],
  );
  const nextS = useCallback(() => {
    if (stepIdx < fSteps.length - 1 && !isTrans) animStep("next");
  }, [stepIdx, fSteps.length, isTrans, animStep]);
  const prevS = useCallback(() => {
    if (stepIdx > 0 && !isTrans) animStep("prev");
  }, [stepIdx, isTrans, animStep]);
  const chMode = useCallback(
    (m: ModeType) => {
      if (m === selectedMode) return;
      setIsTrans(true);
      setCOpacity(0);
      setTimeout(() => {
        setSelectedMode(m);
        setStepIdx(0);
        setSelectedDots([]);
        setDrawnLines([]);
        setFeedback(null);
        setShowHint(false);
        setCompChallenges(new Array(toolConfig.challenges.length).fill(false));
        setMcqAns({});
        setMcqRev({});
        setMcqScore(0);
        setTimeout(() => {
          setCOpacity(1);
          setIsTrans(false);
        }, 50);
      }, 280);
    },
    [selectedMode, toolConfig.challenges.length],
  );

  // ── BUTTON ──
  const SBtn = ({
    id,
    variant = "contained" as BtnVariant,
    label,
    icon,
    onClick,
    disabled = false,
  }: {
    id: string;
    variant?: BtnVariant;
    label?: string;
    icon?: ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }) => {
    const st = disabled
      ? ("disabled" as BtnState)
      : ((btnSt[id] || "enabled") as BtnState);
    return (
      <button
        onMouseEnter={() =>
          !disabled && setBtnSt((p) => ({ ...p, [id]: "hover" }))
        }
        onMouseLeave={() => setBtnSt((p) => ({ ...p, [id]: "enabled" }))}
        onMouseDown={() =>
          !disabled && setBtnSt((p) => ({ ...p, [id]: "pressed" }))
        }
        onMouseUp={() =>
          !disabled && setBtnSt((p) => ({ ...p, [id]: "hover" }))
        }
        onClick={disabled ? undefined : onClick}
        style={getSingBtnStyle(variant, st, rv)}
      >
        {icon}
        {label}
      </button>
    );
  };

  // ── GRID ──
  const hdrH =
    rv.hdrPy * 2 +
    rv.hdrTitle +
    (rv.hdrSub + 4) +
    (rv.hdrStepFs + rv.hdrStepPx + 6) +
    (showGrid ? 32 : 0);
  const modeBarH = config.showModeSelector ? rv.modeBtnH + 20 : 0;
  const navH =
    config.showNavigation || config.showPlayPause ? rv.btnH + rv.navPad * 2 : 0;
  const topChrome = modeBarH + hdrH + 3;

  const getGD = useCallback(() => {
    const aw = cSize.w - rv.gridPad * 2;
    const ah = cSize.h - topChrome - navH - rv.gridPad;
    const cS = Math.min(
      aw / (toolConfig.gridCols - 1),
      ah / (toolConfig.gridRows - 1),
    );
    const gw = cS * (toolConfig.gridCols - 1);
    const gh = cS * (toolConfig.gridRows - 1);
    return {
      cs: cS,
      ox: (cSize.w - gw) / 2,
      oy: (ah - gh) / 2 + rv.gridPad / 2,
    };
  }, [
    cSize,
    rv.gridPad,
    topChrome,
    navH,
    toolConfig.gridCols,
    toolConfig.gridRows,
  ]);
  const dPos = useCallback(
    (c: number, r: number) => {
      const { cs: cS, ox, oy } = getGD();
      return { x: ox + c * cS, y: oy + r * cS };
    },
    [getGD],
  );
  const gSlope = useCallback(
    (s: [number, number], e: [number, number]): number | "v" => {
      const dx = e[0] - s[0];
      return dx === 0 ? "v" : (e[1] - s[1]) / dx;
    },
    [],
  );
  const slEq = useCallback(
    (a: number | "v", b: number | "v") =>
      a === "v" && b === "v"
        ? true
        : a === "v" || b === "v"
          ? false
          : Math.abs((a as number) - (b as number)) < toolConfig.slopeTolerance,
    [toolConfig.slopeTolerance],
  );
  const onGL = useCallback(
    (d: [number, number]) => {
      if (!curCh) return false;
      const { start: s, end: e } = curCh.givenLine;
      return (
        (e[0] - s[0]) * (d[1] - s[1]) - (e[1] - s[1]) * (d[0] - s[0]) === 0
      );
    },
    [curCh],
  );

  const dotClick = useCallback(
    (col: number, row: number) => {
      const cS = selRef.current;
      const cF = fbRef.current;
      const cC = compRef.current;
      if (!curCh || cC[aCI] || cF?.type === "correct") return;
      const dot: [number, number] = [col, row];
      if (cS.length === 0) {
        setSelectedDots([dot]);
        setFeedback(null);
        setShowHint(false);
      } else if (cS.length === 1) {
        const f = cS[0];
        if (f[0] === dot[0] && f[1] === dot[1]) return;
        const ok =
          slEq(
            gSlope(f, dot),
            gSlope(curCh.givenLine.start, curCh.givenLine.end),
          ) && !(onGL(f) && onGL(dot));
        setDrawnLines((p) => [
          ...p,
          { start: f, end: dot, isCorrect: ok, opacity: 1 },
        ]);
        setSelectedDots([]);
        if (ok) {
          setFeedback({ type: "correct", message: "Parallel!" });
          setCompChallenges((p) => {
            const nc = [...p];
            nc[aCI] = true;
            if (nc.every(Boolean)) setTimeout(() => setShowCeleb(true), 900);
            return nc;
          });
        } else {
          setFeedback({ type: "incorrect", message: "Try again!" });
          setShakeWrong(true);
          setTimeout(() => setShakeWrong(false), 600);
          setTimeout(() => {
            setDrawnLines((p) => p.filter((l) => l.isCorrect));
            setFeedback(null);
          }, 1200);
        }
      }
    },
    [curCh, aCI, gSlope, slEq, onGL],
  );
  const hTouch = useCallback(
    (c: number, r: number, e: any) => {
      e.preventDefault();
      touchRef.current = Date.now();
      dotClick(c, r);
    },
    [dotClick],
  );
  const hClick = useCallback(
    (c: number, r: number) => {
      if (Date.now() - touchRef.current < 300) return;
      dotClick(c, r);
    },
    [dotClick],
  );
  const hMcq = useCallback(
    (qId: number, oi: number) => {
      if (mcqRev[qId]) return;
      const q = MCQ_QUESTIONS.find((m) => m.id === qId);
      if (!q) return;
      setMcqAns((p) => ({ ...p, [qId]: oi }));
      setMcqRev((p) => ({ ...p, [qId]: true }));
      if (oi === q.correctIndex) setMcqScore((p) => p + 1);
    },
    [mcqRev],
  );

  const { cs: cellSz } = getGD();
  const contentH = cSize.h - topChrome - navH;

  // ── RENDERERS ──
  const renderGrid = () => {
    if (!curCh) return null;
    const gs = dPos(curCh.givenLine.start[0], curCh.givenLine.start[1]);
    const ge = dPos(curCh.givenLine.end[0], curCh.givenLine.end[1]);
    const ax = gs.x + (ge.x - gs.x) * glAnim;
    const ay = gs.y + (ge.y - gs.y) * glAnim;
    return (
      <div
        style={{
          width: "100%",
          height: contentH,
          position: "relative",
          overflow: "hidden",
          background: colors.bg,
          animation: shakeWrong ? "singShake 0.5s ease" : "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.025,
            pointerEvents: "none",
            backgroundImage: `radial-gradient(circle,${DS.primary} 1px,transparent 1px)`,
            backgroundSize: `${Math.max(10, cellSz * 0.35)}px ${Math.max(10, cellSz * 0.35)}px`,
          }}
        />
        {showHint && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 15,
              margin: `0 ${rv.gridPad}px`,
              padding: `${rv.gridPad / 2}px ${rv.gridPad}px`,
              background: DS.accentLight,
              border: `1.5px solid ${DS.accentMid}40`,
              borderRadius: DS.radius.md,
              fontSize: rv.hintFs,
              color: DS.accentHover,
              fontWeight: 500,
              fontFamily: DS.fontFamily,
              animation: "singSlideDown 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: `${rv.btnGap}px`,
            }}
          >
            <span>💡</span>
            {curCh.hint}
          </div>
        )}
        <svg
          width={cSize.w}
          height={contentH}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          <line
            x1={gs.x}
            y1={gs.y}
            x2={ax}
            y2={ay}
            stroke={DS.primaryLight}
            strokeWidth={rv.lineW * 2.5}
            strokeLinecap="round"
            opacity={0.35}
          />
          <line
            x1={gs.x}
            y1={gs.y}
            x2={ax}
            y2={ay}
            stroke={DS.primary}
            strokeWidth={rv.lineW}
            strokeLinecap="round"
          />
          {glAnim > 0.05 && (
            <circle
              cx={gs.x}
              cy={gs.y}
              r={rv.endR}
              fill={DS.primary}
              stroke={DS.white}
              strokeWidth={1.5}
            />
          )}
          {glAnim > 0.9 && (
            <circle
              cx={ge.x}
              cy={ge.y}
              r={rv.endR}
              fill={DS.primary}
              stroke={DS.white}
              strokeWidth={1.5}
            />
          )}
          {glAnim >= 1 && rv.showGivenLabel && (
            <g style={{ animation: "fadeInUp 0.3s ease" }}>
              <rect
                x={(gs.x + ge.x) / 2 - 36}
                y={(gs.y + ge.y) / 2 - 24}
                width={72}
                height={16}
                rx={8}
                fill={DS.primaryGhost}
                stroke={DS.primaryLight}
                strokeWidth={1}
              />
              <text
                x={(gs.x + ge.x) / 2}
                y={(gs.y + ge.y) / 2 - 12}
                textAnchor="middle"
                fill={DS.primary}
                fontFamily={DS.fontFamily}
                fontWeight="600"
                fontSize="9"
              >
                Given Line
              </text>
            </g>
          )}
          {selectedDots.length === 1 &&
            hoveredDot &&
            (() => {
              const s = dPos(selectedDots[0][0], selectedDots[0][1]);
              const e = dPos(hoveredDot[0], hoveredDot[1]);
              return (
                <>
                  <line
                    x1={s.x}
                    y1={s.y}
                    x2={e.x}
                    y2={e.y}
                    stroke={DS.accentLight}
                    strokeWidth={rv.lineW * 2}
                    strokeLinecap="round"
                    opacity={0.5}
                  />
                  <line
                    x1={s.x}
                    y1={s.y}
                    x2={e.x}
                    y2={e.y}
                    stroke={DS.accent}
                    strokeWidth={rv.lineW * 0.7}
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                    opacity={0.7}
                  />
                </>
              );
            })()}
          {drawnLines.map((l, i) => {
            const s = dPos(l.start[0], l.start[1]);
            const e = dPos(l.end[0], l.end[1]);
            const c = l.isCorrect ? DS.success : DS.error;
            return (
              <g key={i}>
                <line
                  x1={s.x}
                  y1={s.y}
                  x2={e.x}
                  y2={e.y}
                  stroke={c}
                  strokeWidth={rv.lineW * 2.5}
                  strokeLinecap="round"
                  opacity={0.15}
                />
                <line
                  x1={s.x}
                  y1={s.y}
                  x2={e.x}
                  y2={e.y}
                  stroke={c}
                  strokeWidth={rv.lineW}
                  strokeLinecap="round"
                />
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={rv.endR - 1}
                  fill={c}
                  stroke={DS.white}
                  strokeWidth={1.5}
                />
                <circle
                  cx={e.x}
                  cy={e.y}
                  r={rv.endR - 1}
                  fill={c}
                  stroke={DS.white}
                  strokeWidth={1.5}
                />
                {l.isCorrect && (
                  <g style={{ animation: "popIn 0.4s ease forwards" }}>
                    <circle
                      cx={(s.x + e.x) / 2}
                      cy={(s.y + e.y) / 2}
                      r={rv.endR + 5}
                      fill={DS.success}
                      stroke={DS.white}
                      strokeWidth={1.5}
                    />
                    <text
                      x={(s.x + e.x) / 2}
                      y={(s.y + e.y) / 2 + 4}
                      textAnchor="middle"
                      fill={DS.white}
                      fontSize={rv.endR + 4}
                      fontWeight="bold"
                    >
                      ✓
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
        {Array.from({ length: toolConfig.gridRows }).map((_, r) =>
          Array.from({ length: toolConfig.gridCols }).map((_, c) => {
            const p = dPos(c, r);
            const isH = hoveredDot?.[0] === c && hoveredDot?.[1] === r;
            const isSel = selectedDots.some((d) => d[0] === c && d[1] === r);
            const isGE =
              curCh &&
              ((c === curCh.givenLine.start[0] &&
                r === curCh.givenLine.start[1]) ||
                (c === curCh.givenLine.end[0] && r === curCh.givenLine.end[1]));
            const done = compChallenges[aCI];
            let dc = DS.neutral600,
              dr = rv.dotBase;
            if (isGE) {
              dc = DS.primary;
              dr = rv.dotBase + 1.5;
            } else if (isSel) {
              dc = DS.accent;
              dr = rv.dotBase + 2;
            } else if (isH && !done) {
              dc = DS.accent;
              dr = rv.dotBase + 1.5;
            }
            return (
              <div
                key={`${c}-${r}`}
                onMouseEnter={() => setHoveredDot([c, r])}
                onMouseLeave={() => setHoveredDot(null)}
                onTouchStart={(e) => hTouch(c, r, e)}
                onClick={() => hClick(c, r)}
                style={{
                  position: "absolute",
                  left: p.x - rv.dotTap / 2,
                  top: p.y - rv.dotTap / 2,
                  width: rv.dotTap,
                  height: rv.dotTap,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: done ? "default" : "pointer",
                  zIndex: 10,
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                }}
              >
                {isSel && (
                  <div
                    style={{
                      position: "absolute",
                      width: dr * 2 + 4,
                      height: dr * 2 + 4,
                      borderRadius: "50%",
                      border: `2px solid ${DS.accent}`,
                      animation: "singDotPing 1s ease-out infinite",
                    }}
                  />
                )}
                {(isSel || (isH && !done)) && (
                  <div
                    style={{
                      position: "absolute",
                      width: dr * 2 + 16,
                      height: dr * 2 + 16,
                      borderRadius: "50%",
                      background: `${DS.accent}${isSel ? "22" : "11"}`,
                      transition: "all 0.2s",
                    }}
                  />
                )}
                <div
                  style={{
                    width: dr * 2,
                    height: dr * 2,
                    borderRadius: "50%",
                    background: dc,
                    transition: "all 0.2s",
                    transform: isSel
                      ? "scale(1.4)"
                      : isH && !done
                        ? "scale(1.25)"
                        : "scale(1)",
                    boxShadow: isSel
                      ? `0 0 0 2px ${DS.white},0 0 0 4px ${DS.accent}`
                      : "none",
                    position: "relative",
                    zIndex: 2,
                  }}
                />
              </div>
            );
          }),
        )}
        {feedback && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              padding: `${rv.feedbackPy}px ${rv.feedbackPx}px`,
              borderRadius: DS.btnRadius,
              background:
                feedback.type === "correct"
                  ? `linear-gradient(135deg,${DS.success},${DS.successDark})`
                  : `linear-gradient(135deg,${DS.error},${DS.errorDark})`,
              color: DS.white,
              fontFamily: DS.fontFamily,
              fontSize: rv.feedbackFs,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: `${rv.btnGap}px`,
              animation:
                feedback.type === "correct"
                  ? "singCelebrate 0.5s ease forwards"
                  : "singShake 0.5s ease",
              zIndex: 20,
              pointerEvents: "none" as const,
              maxWidth: "85%",
            }}
          >
            {feedback.type === "correct" ? (
              <Check size={rv.feedbackFs} strokeWidth={3} />
            ) : (
              <X size={rv.feedbackFs} strokeWidth={3} />
            )}
            {feedback.message}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            top: rv.gridPad / 3,
            right: rv.gridPad,
            zIndex: 15,
            display: "flex",
            gap: `${rv.btnGap}px`,
          }}
        >
          <SBtn
            id="h-g"
            variant="outlined"
            label={rv.showHintLabel ? "Hint" : undefined}
            icon={<HelpCircle size={rv.btnIcon - 2} />}
            onClick={() => setShowHint((p) => !p)}
          />
          <SBtn
            id="r-g"
            variant="outlined"
            label={rv.showHintLabel ? "Reset" : undefined}
            icon={<RotateCcw size={rv.btnIcon - 2} />}
            onClick={() => {
              setSelectedDots([]);
              setDrawnLines([]);
              setFeedback(null);
              setShowHint(false);
              setCompChallenges((p) => {
                const nc = [...p];
                nc[aCI] = false;
                return nc;
              });
            }}
          />
        </div>
      </div>
    );
  };

  const renderMCQ = () => {
    if (!aMcq) return null;
    const ans = mcqRev[aMcq.id];
    const sel = mcqAns[aMcq.id];
    const isOk = sel === aMcq.correctIndex;
    return (
      <div
        style={{
          padding: `${rv.mcqQPad}px`,
          display: "flex",
          flexDirection: "column",
          gap: `${rv.contentGap}px`,
          height: contentH,
          overflowY: "auto",
          fontFamily: DS.fontFamily,
        }}
      >
        <div
          style={{
            fontSize: rv.mcqQFs,
            fontWeight: 600,
            color: colors.text,
            lineHeight: 1.6,
            padding: `${rv.mcqQPad}px`,
            background: colors.surface,
            borderRadius: DS.radius.lg,
            borderLeft: `4px solid ${DS.accent}`,
            animation: "fadeInUp 0.4s ease",
          }}
        >
          {aMcq.question}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: `${rv.contentGap - 2}px`,
          }}
        >
          {aMcq.options.map((opt, idx) => {
            const isSel = sel === idx;
            const isC = idx === aMcq.correctIndex;
            let bg = colors.surface,
              bc = colors.border,
              tc = colors.text;
            if (ans) {
              if (isC) {
                bg = DS.successLight;
                bc = DS.success;
                tc = DS.successDark;
              } else if (isSel) {
                bg = DS.errorLight;
                bc = DS.error;
                tc = DS.errorDark;
              }
            }
            return (
              <button
                key={idx}
                onClick={() => hMcq(aMcq.id, idx)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: `${rv.contentGap}px`,
                  padding: `${rv.mcqOptPad}px`,
                  borderRadius: DS.radius.md,
                  border: `2px solid ${bc}`,
                  background: bg,
                  color: tc,
                  fontFamily: DS.fontFamily,
                  fontSize: rv.mcqOptFs,
                  fontWeight: 500,
                  cursor: ans ? "default" : "pointer",
                  textAlign: "left" as const,
                  transition: "all 0.3s",
                  animation: `optionPop 0.35s ease ${0.06 * idx}s both`,
                  outline: "none",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: rv.mcqCircle,
                    height: rv.mcqCircle,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background:
                      ans && isC
                        ? DS.success
                        : ans && isSel
                          ? DS.error
                          : `${DS.primary}15`,
                    color: ans && (isC || isSel) ? DS.white : DS.primary,
                    fontWeight: 700,
                    fontSize: rv.mcqCircleFs,
                    transition: "all 0.3s",
                  }}
                >
                  {ans && isC ? (
                    <Check size={rv.mcqCircleFs} strokeWidth={3} />
                  ) : ans && isSel ? (
                    <X size={rv.mcqCircleFs} strokeWidth={3} />
                  ) : (
                    String.fromCharCode(65 + idx)
                  )}
                </div>
                <span style={{ flex: 1 }}>{opt}</span>
              </button>
            );
          })}
        </div>
        {ans && (
          <div
            style={{
              padding: `${rv.mcqOptPad}px`,
              borderRadius: DS.radius.md,
              background: isOk ? `${DS.success}08` : `${DS.accent}08`,
              border: `1.5px solid ${isOk ? DS.success : DS.accent}30`,
              fontSize: rv.mcqExpFs,
              lineHeight: 1.6,
              color: colors.text,
              animation: "singSlideDown 0.4s ease",
              fontWeight: 500,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: `${rv.btnGap}px`,
                marginBottom: 4,
                fontWeight: 700,
                fontSize: rv.mcqExpFs + 1,
                color: isOk ? DS.success : DS.accent,
              }}
            >
              {isOk ? (
                <>
                  <Check size={rv.mcqExpFs} strokeWidth={3} /> Correct!
                </>
              ) : (
                <>
                  <X size={rv.mcqExpFs} strokeWidth={3} /> Not quite:
                </>
              )}
            </div>
            {aMcq.explanation}
          </div>
        )}
        {Object.keys(mcqRev).length === MCQ_QUESTIONS.length && (
          <div
            style={{
              textAlign: "center",
              padding: `${rv.mcqQPad}px`,
              background: `linear-gradient(135deg,${DS.gradientStart}10,${DS.gradientEnd}10)`,
              borderRadius: DS.radius.lg,
              animation: "popIn 0.5s ease",
            }}
          >
            <div
              style={{
                fontSize: rv.celebTitle - 2,
                fontWeight: 800,
                color: DS.gradientStart,
              }}
            >
              Score: {mcqScore}/{MCQ_QUESTIONS.length}
            </div>
            <div
              style={{
                fontSize: rv.mcqExpFs,
                color: DS.neutral600,
                marginTop: 4,
              }}
            >
              {mcqScore === 5
                ? "Perfect!"
                : mcqScore >= 3
                  ? "Good job!"
                  : "Keep learning!"}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRW = () => (
    <div
      style={{
        padding: `${rv.rwPad}px`,
        display: "flex",
        flexDirection: "column",
        gap: `${rv.contentGap}px`,
        height: contentH,
        justifyContent: "center",
        fontFamily: DS.fontFamily,
      }}
    >
      <div
        style={{
          fontSize: rv.rwFs,
          lineHeight: 1.7,
          color: colors.text,
          padding: `${rv.rwPad}px`,
          background: colors.surface,
          borderRadius: DS.radius.lg,
          borderLeft: `4px solid ${modeConfig.real_world.from}`,
          animation: "fadeInUp 0.5s ease",
        }}
      >
        {curStep?.description}
      </div>
      <div
        style={{
          textAlign: "center",
          padding: `${rv.rwPad / 2}px`,
          animation: "fadeInUp 0.6s ease 0.2s both",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: `${rv.btnGap}px`,
            padding: `${rv.mcqOptPad}px ${rv.rwPad}px`,
            background: `${modeConfig.real_world.from}10`,
            borderRadius: DS.btnRadius,
            color: modeConfig.real_world.from,
            fontWeight: 600,
            fontSize: rv.mcqOptFs,
          }}
        >
          <Eye size={rv.btnIcon} />
          Spot parallel lines around you!
        </div>
      </div>
    </div>
  );

  // ── MAIN RENDER ──
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "100%",
        height: cSize.h,
        margin: "0 auto",
        background: colors.surface,
        borderRadius:
          bp === "xs"
            ? DS.radius.md
            : bp === "sm"
              ? DS.radius.lg
              : DS.radius.xl,
        overflow: "hidden",
        boxShadow: DS.shadow.xl,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        fontFamily: DS.fontFamily,
        border: `1px solid ${colors.border}`,
        animation: "fadeInUp 0.5s ease",
        touchAction: "manipulation",
      }}
    >
      {/* MODE SELECTOR */}
      <div
        style={{
          display: config.showModeSelector ? "flex" : "none",
          gap: `${rv.btnGap + 2}px`,
          padding: `${rv.navPad}px ${rv.hdrPx}px`,
          background: colors.bg,
          borderBottom: `1px solid ${colors.border}`,
          justifyContent: "center",
          flexWrap: "wrap" as const,
          flexShrink: 0,
        }}
      >
        {config.enabledModes.map((mode) => {
          const isSel = selectedMode === mode;
          const mc = modeConfig[mode];
          const bst = btnSt[`m-${mode}`] || "enabled";
          return (
            <button
              key={mode}
              onClick={() => chMode(mode)}
              onMouseEnter={() =>
                setBtnSt((p) => ({ ...p, [`m-${mode}`]: "hover" }))
              }
              onMouseLeave={() =>
                setBtnSt((p) => ({ ...p, [`m-${mode}`]: "enabled" }))
              }
              onMouseDown={() =>
                setBtnSt((p) => ({ ...p, [`m-${mode}`]: "pressed" }))
              }
              onMouseUp={() =>
                setBtnSt((p) => ({ ...p, [`m-${mode}`]: "hover" }))
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: `${rv.btnGap}px`,
                height: rv.modeBtnH,
                padding: `0 ${rv.modeBtnPx}px`,
                borderRadius: DS.btnRadius,
                border: isSel
                  ? "none"
                  : `2px solid ${bst === "hover" ? DS.primary : DS.neutral400}`,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: rv.modeBtnFs,
                fontFamily: DS.fontFamily,
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                whiteSpace: "nowrap" as const,
                outline: "none",
                background: isSel
                  ? `linear-gradient(135deg,${mc.from},${mc.to})`
                  : bst === "hover"
                    ? DS.primaryGhost
                    : "transparent",
                color: isSel
                  ? DS.white
                  : bst === "hover"
                    ? DS.primary
                    : colors.text,
                boxShadow: isSel ? DS.shadow.md : "none",
                transform: bst === "pressed" ? "scale(0.96)" : "scale(1)",
              }}
            >
              {getModeIcon(mode, rv.modeIcon)}
              {rv.showModeLabel && mc.label}
            </button>
          );
        })}
      </div>

      {/* HEADER */}
      <div
        style={{
          padding: `${rv.hdrPy}px ${rv.hdrPx}px`,
          color: DS.white,
          position: "relative" as const,
          overflow: "hidden",
          flexShrink: 0,
          background: `linear-gradient(135deg,${mg.from},${mg.to})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -16,
            right: -8,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            fontSize: rv.hdrTitle,
            fontWeight: 700,
            marginBottom: 2,
            animation: "fadeInUp 0.4s ease",
          }}
        >
          {curStep?.title || "Drawing Parallel Lines"}
        </div>
        {curStep?.description && selectedMode !== "practice" && (
          <div style={{ fontSize: rv.hdrSub, opacity: 0.85, lineHeight: 1.4 }}>
            {curStep.description}
          </div>
        )}
        <div
          style={{
            display: config.showStepIndicator ? "inline-flex" : "none",
            alignItems: "center",
            gap: `${rv.btnGap}px`,
            background: "rgba(255,255,255,0.2)",
            padding: `2px ${rv.hdrStepPx}px`,
            borderRadius: DS.btnRadius,
            fontSize: rv.hdrStepFs,
            marginTop: 4,
            backdropFilter: "blur(8px)",
          }}
        >
          Step {stepIdx + 1}/{fSteps.length}
        </div>
      </div>

      {/* PROGRESS */}
      <div
        style={{
          height: 3,
          background: colors.border,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            height: "100%",
            background: `linear-gradient(90deg,${mg.from},${mg.to})`,
            borderRadius: 2,
            transition: "width 0.5s ease-out",
            width: `${pPct}%`,
          }}
        />
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          position: "relative" as const,
          opacity: cOpacity,
          transform: cTransform,
          transition: `all ${280 / config.animationSpeed}ms cubic-bezier(0.4,0,0.2,1)`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {(selectedMode === "learn" || selectedMode === "hands_on") &&
          showGrid &&
          renderGrid()}
        {selectedMode === "practice" && renderMCQ()}
        {selectedMode === "real_world" && renderRW()}
      </div>

      {/* NAVIGATION */}
      <div
        style={{
          display:
            config.showNavigation || config.showPlayPause ? "flex" : "none",
          justifyContent: "space-between",
          alignItems: "center",
          padding: `${rv.navPad}px ${rv.hdrPx}px`,
          background: colors.bg,
          borderTop: `1px solid ${colors.border}`,
          flexShrink: 0,
        }}
      >
        <SBtn
          id="n-p"
          variant="outlined"
          disabled={stepIdx === 0 || isTrans}
          label={rv.showBtnLabel ? "Previous" : undefined}
          icon={<ChevronLeft size={rv.btnIcon} />}
          onClick={prevS}
        />
        <SBtn
          id="n-pl"
          variant="contained"
          label={rv.showBtnLabel ? (isPlaying ? "Pause" : "Play") : undefined}
          icon={
            isPlaying ? <Pause size={rv.btnIcon} /> : <Play size={rv.btnIcon} />
          }
          onClick={() => setIsPlaying(!isPlaying)}
        />
        <SBtn
          id="n-n"
          variant="highlight"
          disabled={stepIdx === fSteps.length - 1 || isTrans}
          label={rv.showBtnLabel ? "Next" : undefined}
          icon={<ChevronRight size={rv.btnIcon} />}
          onClick={nextS}
        />
      </div>

      {/* CELEBRATION */}
      {showCeleb && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(5px)",
            zIndex: 50,
          }}
        >
          {Array.from({ length: 22 }).map((_, i) => {
            const cls = [
              DS.primary,
              DS.accent,
              DS.accentMid,
              DS.primaryLight,
              DS.success,
            ];
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: `${Math.random() * 15}%`,
                  left: `${Math.random() * 100}%`,
                  width: 5 + Math.random() * 7,
                  height: 5 + Math.random() * 7,
                  borderRadius: i % 2 === 0 ? "50%" : "2px",
                  background: cls[i % cls.length],
                  animation: `singConfetti ${1.5 + Math.random() * 1.5}s ease-out ${Math.random() * 0.5}s forwards`,
                }}
              />
            );
          })}
          <div
            style={{
              textAlign: "center",
              padding: rv.celebPad,
              animation: "singCelebrate 0.6s ease forwards",
              maxWidth: "92%",
            }}
          >
            <div
              style={{
                width: rv.celebIcon,
                height: rv.celebIcon,
                borderRadius: "50%",
                margin: "0 auto 10px",
                background: `linear-gradient(135deg,${DS.gradientStart},${DS.gradientEnd})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 24px rgba(83,48,134,0.3)",
              }}
            >
              <Award size={rv.celebIcon * 0.5} color={DS.white} />
            </div>
            <div
              style={{
                fontFamily: DS.fontFamily,
                fontSize: rv.celebTitle,
                fontWeight: 800,
                color: DS.gradientStart,
                marginBottom: 4,
              }}
            >
              All Complete!
            </div>
            <div
              style={{
                fontFamily: DS.fontFamily,
                fontSize: rv.celebBody,
                color: DS.neutral600,
                fontWeight: 500,
                marginBottom: 14,
              }}
            >
              Parallel lines mastered!
            </div>
            <div
              style={{
                display: "flex",
                gap: `${rv.btnGap}px`,
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={rv.celebStar}
                  fill={DS.accent}
                  color={DS.accent}
                  style={{ animation: `popIn 0.4s ease ${0.1 * i}s both` }}
                />
              ))}
            </div>
            <SBtn
              id="pa"
              variant="highlight"
              label="Play Again"
              icon={<RotateCcw size={rv.btnIcon} />}
              onClick={() => {
                setShowCeleb(false);
                setCompChallenges(
                  new Array(toolConfig.challenges.length).fill(false),
                );
                setSelectedDots([]);
                setDrawnLines([]);
                setFeedback(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawParallelLinesTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
