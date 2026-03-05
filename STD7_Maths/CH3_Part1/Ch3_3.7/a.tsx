/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - React types from host; no local node_modules
// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: decimal_add_sub_tool.tsx
// Redesigned to match Singularity Design System
// Zero external icon dependencies — all SVGs inline
// ═══════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

// ==================== INLINE SVG ICONS (fully self-contained) ====================

const SvgZap = ({ s = 20, c = "currentColor" }: { s?: number; c?: string }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke={c}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const SvgLearn = ({
  s = 15,
  c = "currentColor",
}: {
  s?: number;
  c?: string;
}) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke={c}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
const SvgBullseye = ({
  s = 15,
  c = "currentColor",
}: {
  s?: number;
  c?: string;
}) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke={c}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const SvgBars = ({
  s = 15,
  c = "currentColor",
}: {
  s?: number;
  c?: string;
}) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke={c}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);
const SvgStarFill = ({
  s = 14,
  c = "currentColor",
}: {
  s?: number;
  c?: string;
}) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill={c}
    stroke={c}
    strokeWidth={1}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const SvgTick = ({
  s = 20,
  c = "currentColor",
}: {
  s?: number;
  c?: string;
}) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke={c}
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const SvgCross = ({
  s = 20,
  c = "currentColor",
}: {
  s?: number;
  c?: string;
}) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke={c}
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const SvgArrowL = ({
  s = 16,
  c = "currentColor",
}: {
  s?: number;
  c?: string;
}) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke={c}
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const SvgArrowR = ({
  s = 16,
  c = "currentColor",
}: {
  s?: number;
  c?: string;
}) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke={c}
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const SvgTrianglePlay = ({
  s = 18,
  c = "currentColor",
}: {
  s?: number;
  c?: string;
}) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill={c}
    stroke={c}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const SvgDoublebar = ({
  s = 18,
  c = "currentColor",
}: {
  s?: number;
  c?: string;
}) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill={c}
    stroke={c}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

// ==================== DESIGN TOKENS (Singularity) ====================

const DS = {
  primary: "#4A4DC9",
  primaryDark: "#3638A0",
  accent: "#FF7212",
  accentDark: "#E5600A",
  gradientStart: "#533086",
  gradientEnd: "#FC9145",
  primaryLight: "#C1C1EA",
  primaryBg: "#EDEDF8",
  accentLight: "#FFF3E4",
  accentBg: "#FFF9F2",
  textDark: "#4E4E4E",
  textMid: "#7A7A7A",
  gray300: "#CACACA",
  gray200: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",
  success: "#2EA44F",
  successBg: "#E6F9ED",
  error: "#E5484D",
  errorBg: "#FEECEE",
  fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  radiusXL: "24px",
  radiusLG: "16px",
  radiusMD: "12px",
  radiusSM: "8px",
  radiusPill: "100px",
  shadowSoft: "0 4px 24px rgba(74, 77, 201, 0.08)",
  shadowMedium: "0 8px 32px rgba(74, 77, 201, 0.12)",
  shadowStrong: "0 16px 48px rgba(83, 48, 134, 0.18)",
};

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "real_world";

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
  type: "intro" | "explanation" | "practice" | "real_world";
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface DecimalAddSubAdditionalProps {
  number1?: number;
  number2?: number;
  operation?: "add" | "subtract";
  showPlaceValue?: boolean;
  showCarryBorrow?: boolean;
  highlightDecimalPoint?: boolean;
  maxDecimalPlaces?: number;
  practiceProblems?: { num1: number; num2: number; op: "add" | "subtract" }[];
  difficulty?: "easy" | "medium" | "hard";
  realWorldContext?: "shopping" | "measurement" | "weight" | "money";
  currency?: string;
  unit?: string;
}

interface DecimalAddSubToolProps {
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
    additionalProps?: DecimalAddSubAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Adding Decimals — Basics",
    description:
      "Adding decimals works just like adding whole numbers! The key rule: always line up the decimal points before adding.",
    type: "intro",
    mode: "learn",
    data: { num1: 2.7, num2: 3.5, op: "add" },
  },
  {
    id: 2,
    title: "Place Value Alignment",
    description:
      "Align units under units, tenths under tenths, hundredths under hundredths. Then add column by column from right to left.",
    type: "explanation",
    mode: "learn",
    data: { num1: 5.34, num2: 2.68, op: "add" },
  },
  {
    id: 3,
    title: "Carrying Over in Decimals",
    description:
      "When the sum of a column is 10 or more, carry 1 to the next column — just like with whole numbers!",
    type: "explanation",
    mode: "learn",
    data: { num1: 75.345, num2: 86.691, op: "add" },
  },
  {
    id: 4,
    title: "Subtracting Decimals",
    description:
      "Subtraction also requires lining up decimal points. Start from the right and borrow when needed.",
    type: "explanation",
    mode: "learn",
    data: { num1: 3.5, num2: 2.7, op: "subtract" },
  },
  {
    id: 5,
    title: "Borrowing in Decimals",
    description:
      "When the top digit is smaller than the bottom digit, borrow 1 from the next column (which is 10 in that place).",
    type: "explanation",
    mode: "learn",
    data: { num1: 10.4, num2: 4.5, op: "subtract" },
  },
  {
    id: 10,
    title: "Easy Addition",
    description: "Add these decimal numbers. Line up the decimal points!",
    type: "practice",
    mode: "practice",
    data: { num1: 5.3, num2: 2.6, op: "add", answer: 7.9 },
  },
  {
    id: 11,
    title: "Addition with Carrying",
    description: "This one needs carrying! Can you get it right?",
    type: "practice",
    mode: "practice",
    data: { num1: 9.01, num2: 9.1, op: "add", answer: 18.11 },
  },
  {
    id: 12,
    title: "Easy Subtraction",
    description: "Subtract these decimals carefully.",
    type: "practice",
    mode: "practice",
    data: { num1: 5.6, num2: 2.3, op: "subtract", answer: 3.3 },
  },
  {
    id: 13,
    title: "Subtraction with Borrowing",
    description: "You'll need to borrow for this one!",
    type: "practice",
    mode: "practice",
    data: { num1: 18, num2: 8.8, op: "subtract", answer: 9.2 },
  },
  {
    id: 14,
    title: "Three Decimal Places",
    description: "Try this addition with thousandths!",
    type: "practice",
    mode: "practice",
    data: { num1: 6.236, num2: 0.487, op: "add", answer: 6.723 },
  },
  {
    id: 20,
    title: "Cloth Shopping",
    description:
      "Priya needs 2.7 m of cloth for her skirt and Shylaja needs 3.5 m for her kurti. What is the total cloth needed?",
    type: "real_world",
    mode: "real_world",
    data: {
      num1: 2.7,
      num2: 3.5,
      op: "add",
      context: "measurement",
      unit: "m",
      items: ["Skirt cloth", "Kurti cloth"],
    },
  },
  {
    id: 21,
    title: "Grocery Shopping",
    description:
      "Mahi buys 0.25 kg beans, 0.3 kg carrots, and 0.5 kg potatoes. What's the total weight of beans and carrots?",
    type: "real_world",
    mode: "real_world",
    data: {
      num1: 0.25,
      num2: 0.3,
      op: "add",
      context: "weight",
      unit: "kg",
      items: ["Beans", "Carrots"],
    },
  },
  {
    id: 22,
    title: "Weight Change",
    description:
      "Tinku weighed 35.75 kg in January and 34.50 kg in February. How much weight did he lose?",
    type: "real_world",
    mode: "real_world",
    data: {
      num1: 35.75,
      num2: 34.5,
      op: "subtract",
      context: "weight",
      unit: "kg",
      items: ["January weight", "February weight"],
    },
  },
  {
    id: 23,
    title: "Milk Supply",
    description:
      "Pinto supplies 3.79 L and 4.2 L of milk on two days. How much total milk did he supply?",
    type: "real_world",
    mode: "real_world",
    data: {
      num1: 3.79,
      num2: 4.2,
      op: "add",
      context: "measurement",
      unit: "L",
      items: ["Day 1 milk", "Day 2 milk"],
    },
  },
];

// ==================== HELPERS ====================

function getDecimalPlaces(n: number): number {
  const s = n.toString();
  const idx = s.indexOf(".");
  return idx === -1 ? 0 : s.length - idx - 1;
}

function padDecimal(n: number, places: number): string {
  return n.toFixed(places);
}

// ==================== MAIN COMPONENT ====================

type InnerToolProps = NonNullable<DecimalAddSubToolProps["props"]>;

const DecimalAddSubTool: React.FC<DecimalAddSubToolProps> = ({
  props: propsIn,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const props: InnerToolProps = propsIn ?? {};
  // ─── CONFIGURATION ───
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: props.initialMode ?? "learn",
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: props.enabledModes ?? ["learn", "practice", "real_world"],
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      initialStep: props.initialStep ?? undefined,
      filterSteps: props.filterSteps ?? null,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration:
        props.autoPlayDuration ?? props.data?.autoPlayDuration ?? 10000,
      themeColor: props.themeColor ?? DS.primary,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const additionalProps = props.additionalProps || {};
  const allSteps = props.steps || DEFAULT_STEPS;

  const availableSteps = useMemo(() => {
    if (config.filterSteps && config.filterSteps.length > 0) {
      return allSteps.filter((s) => config.filterSteps!.includes(s.id));
    }
    return allSteps;
  }, [allSteps, config.filterSteps]);

  // ─── STATE ───
  const [selectedMode, setSelectedMode] = useState<ModeType>(
    config.initialMode as ModeType,
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!stopAutoNext);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [buttonStates, setButtonStates] = useState<{
    [k: string]: "idle" | "hover" | "active";
  }>({});
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [revealedCols, setRevealedCols] = useState(0);
  const [contentOpacity, setContentOpacity] = useState(1);
  const timerRef = useRef<any>();

  const filteredSteps = useMemo(
    () => availableSteps.filter((step) => step.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const currentStep = filteredSteps[currentStepIndex] || filteredSteps[0];

  // ─── INJECT POPPINS + KEYFRAMES ───
  useEffect(() => {
    if (!document.getElementById("singularity-font")) {
      const link = document.createElement("link");
      link.id = "singularity-font";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(link);
    }

    const kf = `
            @keyframes dsFadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
            @keyframes dsDown { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }
            @keyframes dsPop { 0% { transform:scale(0); opacity:0; } 60% { transform:scale(1.12); } 100% { transform:scale(1); opacity:1; } }
            @keyframes dsThrob { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
            @keyframes dsBnc { 0% { transform:scale(0.3); opacity:0; } 50% { transform:scale(1.08); } 70% { transform:scale(0.95); } 100% { transform:scale(1); opacity:1; } }
            @keyframes dsWipeL { from { opacity:0; transform:translateX(-30px); } to { opacity:1; transform:translateX(0); } }
            @keyframes dsReveal { 0% { opacity:0; transform:translateY(-12px) scale(0.8); } 60% { opacity:1; transform:translateY(3px) scale(1.05); } 100% { opacity:1; transform:translateY(0) scale(1); } }
        `;
    const style = document.createElement("style");
    style.id = "singularity-kf";
    style.textContent = kf;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById("singularity-kf");
      if (el) document.head.removeChild(el);
    };
  }, []);

  // ─── NAVIGATION ───
  const transitionTo = useCallback(
    (idx: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setContentOpacity(0);
      setTimeout(() => {
        setCurrentStepIndex(idx);
        setRevealedCols(0);
        setUserAnswer("");
        setShowResult(null);
        setContentOpacity(1);
        setIsTransitioning(false);
      }, 280);
    },
    [isTransitioning],
  );

  const goNext = useCallback(() => {
    if (currentStepIndex < filteredSteps.length - 1)
      transitionTo(currentStepIndex + 1);
  }, [currentStepIndex, filteredSteps.length, transitionTo]);

  const goPrev = useCallback(() => {
    if (currentStepIndex > 0) transitionTo(currentStepIndex - 1);
  }, [currentStepIndex, transitionTo]);

  const switchMode = useCallback(
    (mode: ModeType) => {
      if (mode === selectedMode) return;
      setIsTransitioning(true);
      setContentOpacity(0);
      setTimeout(() => {
        setSelectedMode(mode);
        setCurrentStepIndex(0);
        setRevealedCols(0);
        setUserAnswer("");
        setShowResult(null);
        setContentOpacity(1);
        setIsTransitioning(false);
      }, 280);
    },
    [selectedMode],
  );

  // Column reveal
  useEffect(() => {
    if (!currentStep) return;
    const d = currentStep.data || {};
    const n1 = additionalProps.number1 ?? d.num1 ?? 2.7;
    const n2 = additionalProps.number2 ?? d.num2 ?? 3.5;
    const maxDec = Math.max(getDecimalPlaces(n1), getDecimalPlaces(n2));
    const totalCols = padDecimal(n1, maxDec).replace(".", "").length + 1;

    if (selectedMode === "learn") {
      const iv = setInterval(() => {
        setRevealedCols((p) => {
          if (p >= totalCols) {
            clearInterval(iv);
            return p;
          }
          return p + 1;
        });
      }, 700 / config.animationSpeed);
      return () => clearInterval(iv);
    } else {
      setRevealedCols(totalCols);
    }
  }, [currentStep, selectedMode, config.animationSpeed, additionalProps]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying || config.autoPlayDuration === 0) return;
    timerRef.current = setTimeout(goNext, config.autoPlayDuration);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, goNext, config.autoPlayDuration]);

  // Report step details
  useEffect(() => {
    if (setStepDetails && currentStep) {
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: filteredSteps.length,
        isPaused: !isPlaying,
        currentMode: selectedMode,
      });
    }
  }, [
    currentStepIndex,
    filteredSteps.length,
    isPlaying,
    selectedMode,
    setStepDetails,
    currentStep,
  ]);

  // Practice answer check
  const checkAnswer = useCallback(() => {
    if (!currentStep?.data?.answer) return;
    const correct =
      Math.abs(parseFloat(userAnswer) - currentStep.data.answer) < 0.001;
    setShowResult(correct ? "correct" : "wrong");
    setAttempts((p) => p + 1);
    if (correct) setScore((p) => p + 1);
  }, [userAnswer, currentStep]);

  // ─── COLUMN MATH VISUAL ───
  const renderColumnMath = useCallback(
    (num1: number, num2: number, op: "add" | "subtract", showAll: boolean) => {
      const maxDec = Math.max(getDecimalPlaces(num1), getDecimalPlaces(num2));
      const s1 = padDecimal(num1, maxDec);
      const s2 = padDecimal(num2, maxDec);
      const result = op === "add" ? num1 + num2 : num1 - num2;
      const sR = padDecimal(
        Math.round(Math.abs(result) * Math.pow(10, maxDec)) /
          Math.pow(10, maxDec),
        maxDec,
      );
      const maxLen = Math.max(s1.length, s2.length, sR.length);
      const p1 = s1.padStart(maxLen, " ");
      const p2 = s2.padStart(maxLen, " ");
      const pR = sR.padStart(maxLen, " ");
      const colW = 40;
      const totalW = maxLen * colW + 56;

      const cellStyle = (
        ch: string,
        delay: number,
        clr: string,
      ): React.CSSProperties => ({
        width: `${colW}px`,
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: ch === "." ? "30px" : "24px",
        fontWeight: 600,
        fontFamily: DS.fontFamily,
        color: ch === "." ? DS.accent : clr,
        animation: `dsPop 0.4s ease-out ${delay}s both`,
      });

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            animation: "dsDown 0.5s ease-out",
          }}
        >
          {/* Number 1 */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "36px" }} />
            {p1.split("").map((ch, i) => (
              <div key={`a${i}`} style={cellStyle(ch, i * 0.06, DS.textDark)}>
                {ch === " " ? "" : ch}
              </div>
            ))}
          </div>

          {/* Operator + Number 2 */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "36px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: 800,
                fontFamily: DS.fontFamily,
                color: op === "add" ? DS.primary : DS.accent,
                animation: "dsPop 0.5s ease-out 0.15s both",
              }}
            >
              {op === "add" ? "+" : "−"}
            </div>
            {p2.split("").map((ch, i) => (
              <div
                key={`b${i}`}
                style={cellStyle(ch, 0.2 + i * 0.06, DS.textDark)}
              >
                {ch === " " ? "" : ch}
              </div>
            ))}
          </div>

          {/* Gradient divider line */}
          <div
            style={{
              width: `${totalW}px`,
              height: "3px",
              borderRadius: "2px",
              background: `linear-gradient(90deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
              animation: "dsWipeL 0.5s ease-out 0.5s both",
              marginTop: "2px",
              marginBottom: "2px",
            }}
          />

          {/* Result row */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "36px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: 700,
                fontFamily: DS.fontFamily,
                color: DS.primary,
              }}
            >
              =
            </div>
            {pR.split("").map((ch, i) => {
              const colIdx = pR.length - 1 - i;
              const isRev = showAll || revealedCols > colIdx;
              return (
                <div
                  key={`c${i}`}
                  style={{
                    width: `${colW}px`,
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: ch === "." ? "30px" : "24px",
                    fontWeight: 800,
                    fontFamily: DS.fontFamily,
                    color: ch === "." ? DS.accent : DS.primary,
                    backgroundColor:
                      isRev && ch !== "." && ch !== " "
                        ? DS.primaryBg
                        : "transparent",
                    borderRadius: DS.radiusSM,
                    transition: "all 0.35s ease",
                    animation: isRev
                      ? `dsReveal 0.45s ease-out ${0.6 + i * 0.08}s both`
                      : "none",
                    opacity: isRev ? 1 : 0.18,
                  }}
                >
                  {ch === " " ? "" : isRev ? ch : "?"}
                </div>
              );
            })}
          </div>

          {/* Decimal alignment hint */}
          {additionalProps.highlightDecimalPoint !== false && maxDec > 0 && (
            <div
              style={{
                marginTop: "10px",
                padding: "6px 18px",
                backgroundColor: DS.accentLight,
                borderRadius: DS.radiusPill,
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: DS.fontFamily,
                color: DS.accentDark,
                animation: "dsDown 0.4s ease-out 1s both",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{ color: DS.accent, fontSize: "16px", fontWeight: 800 }}
              >
                .
              </span>
              Decimal points are aligned!
            </div>
          )}
        </div>
      );
    },
    [revealedCols, additionalProps],
  );

  // ─── LEARN MODE ───
  const renderLearnContent = useCallback(() => {
    if (!currentStep) return null;
    const d = currentStep.data || {};
    const n1 = additionalProps.number1 ?? d.num1 ?? 2.7;
    const n2 = additionalProps.number2 ?? d.num2 ?? 3.5;
    const op = additionalProps.operation ?? d.op ?? "add";
    const maxDec = Math.max(getDecimalPlaces(n1), getDecimalPlaces(n2));

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
          padding: "20px 16px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            color: DS.textMid,
            textAlign: "center",
            maxWidth: "580px",
            lineHeight: "1.7",
            fontFamily: DS.fontFamily,
            fontWeight: 500,
            animation: "dsDown 0.4s ease-out",
          }}
        >
          {currentStep.description}
        </div>

        <div
          style={{
            backgroundColor: DS.white,
            borderRadius: DS.radiusXL,
            padding: "28px 36px",
            boxShadow: DS.shadowMedium,
            border: `1.5px solid ${DS.primaryLight}`,
          }}
        >
          {renderColumnMath(n1, n2, op, false)}
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 28px",
            backgroundColor: DS.primaryBg,
            borderRadius: DS.radiusPill,
            fontSize: "18px",
            fontWeight: 700,
            color: DS.primary,
            fontFamily: DS.fontFamily,
            animation: "dsDown 0.5s ease-out 0.3s both",
            border: `1.5px solid ${DS.primaryLight}`,
          }}
        >
          {n1} {op === "add" ? "+" : "−"} {n2}
          <span style={{ color: DS.accent }}>=</span>
          <span style={{ color: DS.gradientStart }}>
            {padDecimal(op === "add" ? n1 + n2 : n1 - n2, maxDec)}
          </span>
        </div>
      </div>
    );
  }, [currentStep, additionalProps, renderColumnMath]);

  // ─── PRACTICE MODE ───
  const renderPracticeContent = useCallback(() => {
    if (!currentStep) return null;
    const d = currentStep.data || {};
    const { num1, num2, op } = d;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
          padding: "20px 16px",
        }}
      >
        {/* Score */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            animation: "dsDown 0.3s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 18px",
              backgroundColor: DS.accentLight,
              borderRadius: DS.radiusPill,
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: DS.fontFamily,
              color: DS.accentDark,
            }}
          >
            <SvgStarFill s={14} c={DS.accentDark} /> {score} / {attempts}
          </div>
        </div>

        {/* Question */}
        <div
          style={{
            backgroundColor: DS.white,
            borderRadius: DS.radiusXL,
            padding: "24px 36px",
            boxShadow: DS.shadowSoft,
            border: `1.5px solid ${DS.gray200}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: DS.textMid,
              fontWeight: 600,
              fontFamily: DS.fontFamily,
            }}
          >
            {currentStep.description}
          </div>
          <div
            style={{
              fontSize: "30px",
              fontWeight: 800,
              fontFamily: DS.fontFamily,
              color: DS.textDark,
              animation: "dsPop 0.5s ease-out",
            }}
          >
            {num1} {op === "add" ? "+" : "−"} {num2} ={" "}
            <span style={{ color: DS.primary }}>?</span>
          </div>
        </div>

        {/* Input + check button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "dsDown 0.4s ease-out 0.2s both",
          }}
        >
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              setShowResult(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
            placeholder="Your answer"
            style={{
              padding: "12px 20px",
              fontSize: "20px",
              fontWeight: 700,
              fontFamily: DS.fontFamily,
              border: `2.5px solid ${showResult === "correct" ? DS.success : showResult === "wrong" ? DS.error : DS.primaryLight}`,
              borderRadius: DS.radiusMD,
              outline: "none",
              textAlign: "center",
              width: "180px",
              transition: "all 0.3s ease",
              backgroundColor:
                showResult === "correct"
                  ? DS.successBg
                  : showResult === "wrong"
                    ? DS.errorBg
                    : DS.white,
              color: DS.textDark,
            }}
          />
          <button
            onClick={checkAnswer}
            onMouseEnter={() => setButtonStates((s) => ({ ...s, ck: "hover" }))}
            onMouseLeave={() => setButtonStates((s) => ({ ...s, ck: "idle" }))}
            onMouseDown={() => setButtonStates((s) => ({ ...s, ck: "active" }))}
            onMouseUp={() => setButtonStates((s) => ({ ...s, ck: "hover" }))}
            style={{
              padding: "12px 28px",
              height: "48px",
              background:
                buttonStates["ck"] === "hover"
                  ? `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`
                  : DS.primary,
              color: DS.white,
              border: "none",
              borderRadius: DS.radiusPill,
              fontSize: "15px",
              fontWeight: 700,
              fontFamily: DS.fontFamily,
              cursor: "pointer",
              transition: "all 0.25s ease",
              transform:
                buttonStates["ck"] === "active"
                  ? "scale(0.95)"
                  : buttonStates["ck"] === "hover"
                    ? "scale(1.03)"
                    : "scale(1)",
              boxShadow:
                buttonStates["ck"] === "hover"
                  ? `0 8px 24px ${DS.primary}40`
                  : DS.shadowSoft,
            }}
          >
            Check
          </button>
        </div>

        {/* Feedback */}
        {showResult && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              borderRadius: DS.radiusPill,
              backgroundColor:
                showResult === "correct" ? DS.successBg : DS.errorBg,
              color: showResult === "correct" ? DS.success : DS.error,
              fontWeight: 700,
              fontSize: "15px",
              fontFamily: DS.fontFamily,
              animation: "dsBnc 0.45s ease-out",
              border: `1.5px solid ${showResult === "correct" ? DS.success + "30" : DS.error + "30"}`,
            }}
          >
            {showResult === "correct" ? (
              <SvgTick s={20} c={DS.success} />
            ) : (
              <SvgCross s={20} c={DS.error} />
            )}
            {showResult === "correct"
              ? " Correct! Well done!"
              : ` Not quite. Answer: ${d.answer}`}
          </div>
        )}

        {/* Show working on wrong */}
        {showResult === "wrong" && (
          <div
            style={{
              backgroundColor: DS.white,
              borderRadius: DS.radiusLG,
              padding: "20px 28px",
              boxShadow: DS.shadowSoft,
              animation: "dsDown 0.4s ease-out",
            }}
          >
            {renderColumnMath(num1, num2, op, true)}
          </div>
        )}
      </div>
    );
  }, [
    currentStep,
    userAnswer,
    showResult,
    score,
    attempts,
    buttonStates,
    checkAnswer,
    renderColumnMath,
  ]);

  // ─── REAL WORLD MODE ───
  const renderRealWorldContent = useCallback(() => {
    if (!currentStep) return null;
    const d = currentStep.data || {};
    const {
      num1,
      num2,
      op,
      unit = "",
      items = ["Item 1", "Item 2"],
      context = "measurement",
    } = d;
    const result = op === "add" ? num1 + num2 : Math.abs(num1 - num2);
    const maxDec = Math.max(getDecimalPlaces(num1), getDecimalPlaces(num2));
    const ctxIcons: Record<string, string> = {
      measurement: "📏",
      weight: "⚖️",
      money: "💰",
      shopping: "🛒",
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
          padding: "20px 16px",
        }}
      >
        {/* Story card */}
        <div
          style={{
            background: `linear-gradient(135deg, ${DS.primaryBg}, ${DS.accentLight})`,
            borderRadius: DS.radiusXL,
            padding: "20px 28px",
            border: `1.5px solid ${DS.primaryLight}`,
            maxWidth: "540px",
            textAlign: "center",
            animation: "dsDown 0.4s ease-out",
          }}
        >
          <div style={{ fontSize: "30px", marginBottom: "6px" }}>
            {ctxIcons[context]}
          </div>
          <div
            style={{
              fontSize: "14px",
              color: DS.textMid,
              lineHeight: "1.7",
              fontFamily: DS.fontFamily,
              fontWeight: 500,
            }}
          >
            {currentStep.description}
          </div>
        </div>

        {/* Value cards */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            alignItems: "center",
            animation: "dsDown 0.4s ease-out 0.15s both",
          }}
        >
          <div
            style={{
              padding: "14px 22px",
              backgroundColor: DS.primaryBg,
              borderRadius: DS.radiusLG,
              textAlign: "center",
              border: `1.5px solid ${DS.primaryLight}`,
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: DS.textMid,
                fontWeight: 600,
                fontFamily: DS.fontFamily,
                marginBottom: "2px",
              }}
            >
              {items[0]}
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: DS.primary,
                fontFamily: DS.fontFamily,
              }}
            >
              {num1} {unit}
            </div>
          </div>

          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: 800,
              color: DS.white,
              animation: "dsThrob 1.8s ease-in-out infinite",
              boxShadow: `0 4px 16px ${DS.gradientStart}40`,
            }}
          >
            {op === "add" ? "+" : "−"}
          </div>

          <div
            style={{
              padding: "14px 22px",
              backgroundColor: DS.accentLight,
              borderRadius: DS.radiusLG,
              textAlign: "center",
              border: `1.5px solid ${DS.accent}25`,
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: DS.textMid,
                fontWeight: 600,
                fontFamily: DS.fontFamily,
                marginBottom: "2px",
              }}
            >
              {items[1]}
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: DS.accentDark,
                fontFamily: DS.fontFamily,
              }}
            >
              {num2} {unit}
            </div>
          </div>
        </div>

        {/* Working */}
        <div
          style={{
            backgroundColor: DS.white,
            borderRadius: DS.radiusXL,
            padding: "24px 32px",
            boxShadow: DS.shadowMedium,
            border: `1.5px solid ${DS.primaryLight}`,
            animation: "dsDown 0.4s ease-out 0.3s both",
          }}
        >
          {renderColumnMath(num1, num2, op, true)}
        </div>

        {/* Answer pill */}
        <div
          style={{
            padding: "12px 36px",
            background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
            borderRadius: DS.radiusPill,
            color: DS.white,
            fontSize: "18px",
            fontWeight: 800,
            fontFamily: DS.fontFamily,
            animation: "dsBnc 0.5s ease-out 0.6s both",
            boxShadow: `0 8px 28px ${DS.gradientStart}35`,
          }}
        >
          {op === "add" ? "Total" : "Difference"}: {padDecimal(result, maxDec)}{" "}
          {unit}
        </div>
      </div>
    );
  }, [currentStep, renderColumnMath, additionalProps]);

  // ─── MODE TAB CONFIG ───
  const modeTabData: Record<
    ModeType,
    { icon: React.ReactNode; label: string; color: string; bg: string }
  > = {
    learn: {
      icon: <SvgLearn s={15} />,
      label: "Learn",
      color: DS.primary,
      bg: DS.primaryBg,
    },
    practice: {
      icon: <SvgBullseye s={15} />,
      label: "Practice",
      color: DS.accent,
      bg: DS.accentLight,
    },
    real_world: {
      icon: <SvgBars s={15} />,
      label: "Real World",
      color: DS.gradientStart,
      bg: "#F3EDF9",
    },
  };

  // ═══ MAIN RENDER ═══
  return (
    <div
      style={{
        width: `${config.width}px`,
        maxWidth: "100%",
        minHeight: `${config.height}px`,
        backgroundColor: DS.gray100,
        borderRadius: DS.radiusXL,
        overflow: "hidden",
        boxShadow: DS.shadowStrong,
        display: "flex",
        flexDirection: "column",
        fontFamily: DS.fontFamily,
        position: "relative",
      }}
    >
      {/* ═══ HEADER ═══ */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: DS.radiusMD,
              backgroundColor: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "dsThrob 2.5s ease-in-out infinite",
            }}
          >
            <SvgZap s={20} c="white" />
          </div>
          <div>
            <div
              style={{
                color: DS.white,
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: DS.fontFamily,
              }}
            >
              {currentStep?.title || "Decimal Addition & Subtraction"}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "11px",
                fontWeight: 500,
                fontFamily: DS.fontFamily,
              }}
            >
              Ganita Prakash — Chapter 3.7
            </div>
          </div>
        </div>

        {config.showStepIndicator && (
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: "5px 14px",
              borderRadius: DS.radiusPill,
              color: DS.white,
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: DS.fontFamily,
            }}
          >
            {currentStepIndex + 1} / {filteredSteps.length}
          </div>
        )}
      </div>

      {/* ═══ MODE TABS ═══ */}
      {config.showModeSelector && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "14px 24px",
            backgroundColor: DS.white,
            borderBottom: `1px solid ${DS.gray200}`,
          }}
        >
          {(config.enabledModes as ModeType[]).map((mode) => {
            const mc = modeTabData[mode];
            const isActive = selectedMode === mode;
            return (
              <button
                key={mode}
                onClick={() => switchMode(mode)}
                onMouseEnter={() =>
                  setButtonStates((s) => ({ ...s, [`t${mode}`]: "hover" }))
                }
                onMouseLeave={() =>
                  setButtonStates((s) => ({ ...s, [`t${mode}`]: "idle" }))
                }
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: DS.radiusPill,
                  border: isActive ? "none" : `1.5px solid ${DS.gray200}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  fontSize: "13px",
                  fontWeight: 700,
                  fontFamily: DS.fontFamily,
                  transition: "all 0.3s ease",
                  backgroundColor: isActive
                    ? mc.color
                    : buttonStates[`t${mode}`] === "hover"
                      ? mc.bg
                      : DS.white,
                  color: isActive ? DS.white : mc.color,
                  transform: isActive ? "scale(1.02)" : "scale(1)",
                  boxShadow: isActive ? `0 4px 16px ${mc.color}35` : "none",
                }}
              >
                {mc.icon} {mc.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ═══ CONTENT ═══ */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "4px",
          transition: "opacity 0.28s ease, transform 0.28s ease",
          opacity: contentOpacity,
          transform: contentOpacity === 0 ? "translateY(8px)" : "translateY(0)",
        }}
      >
        {selectedMode === "learn" && renderLearnContent()}
        {selectedMode === "practice" && renderPracticeContent()}
        {selectedMode === "real_world" && renderRealWorldContent()}
      </div>

      {/* ═══ NAVIGATION ═══ */}
      {config.showNavigation && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 24px",
            backgroundColor: DS.white,
            borderTop: `1px solid ${DS.gray200}`,
          }}
        >
          {/* Outlined prev button */}
          <button
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            onMouseEnter={() => setButtonStates((s) => ({ ...s, pv: "hover" }))}
            onMouseLeave={() => setButtonStates((s) => ({ ...s, pv: "idle" }))}
            style={{
              padding: "10px 22px",
              borderRadius: DS.radiusPill,
              border: `2px solid ${currentStepIndex === 0 ? DS.gray200 : DS.primary}`,
              cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: DS.fontFamily,
              backgroundColor:
                buttonStates["pv"] === "hover" && currentStepIndex > 0
                  ? DS.primaryBg
                  : DS.white,
              color: currentStepIndex === 0 ? DS.gray300 : DS.primary,
              transition: "all 0.25s ease",
              transform:
                buttonStates["pv"] === "hover" && currentStepIndex > 0
                  ? "scale(1.03)"
                  : "scale(1)",
            }}
          >
            <SvgArrowL s={16} /> Previous
          </button>

          {/* Play/Pause gradient circle */}
          {config.showPlayPause && (
            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
                if (setStopAutoNext) setStopAutoNext(isPlaying);
              }}
              onMouseEnter={() =>
                setButtonStates((s) => ({ ...s, pp: "hover" }))
              }
              onMouseLeave={() =>
                setButtonStates((s) => ({ ...s, pp: "idle" }))
              }
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
                color: DS.white,
                transition: "all 0.25s ease",
                transform:
                  buttonStates["pp"] === "hover" ? "scale(1.1)" : "scale(1)",
                boxShadow: `0 4px 16px ${DS.gradientStart}40`,
              }}
            >
              {isPlaying ? (
                <SvgDoublebar s={18} c="white" />
              ) : (
                <SvgTrianglePlay s={18} c="white" />
              )}
            </button>
          )}

          {/* Contained next button */}
          <button
            onClick={goNext}
            disabled={currentStepIndex >= filteredSteps.length - 1}
            onMouseEnter={() => setButtonStates((s) => ({ ...s, nx: "hover" }))}
            onMouseLeave={() => setButtonStates((s) => ({ ...s, nx: "idle" }))}
            onMouseDown={() => setButtonStates((s) => ({ ...s, nx: "active" }))}
            onMouseUp={() => setButtonStates((s) => ({ ...s, nx: "hover" }))}
            style={{
              padding: "10px 22px",
              borderRadius: DS.radiusPill,
              border: "none",
              cursor:
                currentStepIndex >= filteredSteps.length - 1
                  ? "not-allowed"
                  : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: DS.fontFamily,
              backgroundColor:
                currentStepIndex >= filteredSteps.length - 1
                  ? DS.gray200
                  : DS.primary,
              color:
                currentStepIndex >= filteredSteps.length - 1
                  ? DS.gray300
                  : DS.white,
              transition: "all 0.25s ease",
              transform:
                buttonStates["nx"] === "active"
                  ? "scale(0.95)"
                  : buttonStates["nx"] === "hover" &&
                      currentStepIndex < filteredSteps.length - 1
                    ? "scale(1.03)"
                    : "scale(1)",
              boxShadow:
                currentStepIndex >= filteredSteps.length - 1
                  ? "none"
                  : `0 4px 16px ${DS.primary}35`,
            }}
          >
            Next <SvgArrowR s={16} />
          </button>
        </div>
      )}

      {/* ═══ PROGRESS DOTS ═══ */}
      {filteredSteps.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "6px",
            padding: "0 24px 14px",
            backgroundColor: DS.white,
          }}
        >
          {filteredSteps.map((_, idx) => (
            <div
              key={idx}
              onClick={() => transitionTo(idx)}
              style={{
                width: idx === currentStepIndex ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background:
                  idx === currentStepIndex
                    ? `linear-gradient(90deg, ${DS.gradientStart}, ${DS.gradientEnd})`
                    : DS.gray200,
                transition: "all 0.35s ease",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DecimalAddSubTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
