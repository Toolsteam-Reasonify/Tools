// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: equation_balance_tool.tsx
// Singularity Design System — Fully Responsive
// ═══════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  // @ts-ignore - react
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Target,
  // @ts-ignore - lucide-react
} from "lucide-react";

// ==================== DESIGN SYSTEM TOKENS ====================
const DS = {
  primary: "#4A4DC9",
  primaryDark: "#533086",
  accent: "#FF7212",
  accentSoft: "#FC9145",
  primaryTint: "#C1C1EA",
  accentTint: "#FFF3E4",
  primaryLight: "#EEEEFF",
  gray900: "#4E4E4E",
  gray500: "#CACACA",
  gray300: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",
  success: "#2DB87A",
  successTint: "#E6F9F0",
  error: "#E0454B",
  errorTint: "#FDE8E9",
  radius: { sm: 8, md: 14, lg: 20, pill: 999, card: 16 },
  font: "'Poppins','Segoe UI',system-ui,sans-serif",
  shadow: {
    sm: "0 2px 8px rgba(74,77,201,0.08)",
    md: "0 6px 20px rgba(74,77,201,0.12)",
    lg: "0 16px 40px rgba(74,77,201,0.16)",
    accent: "0 4px 16px rgba(255,114,18,0.25)",
  },
};

// ==================== RESPONSIVE HOOK ====================
type Breakpoint = "xs" | "sm" | "md" | "lg";

const useContainerSize = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [size, setSize] = useState({ w: 800, h: 600, bp: "lg" as Breakpoint });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      const bp: Breakpoint =
        w < 380 ? "xs" : w < 520 ? "sm" : w < 700 ? "md" : "lg";
      setSize({ w, h: el.offsetHeight, bp });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
};

// Responsive value helper
const rv = <T,>(bp: Breakpoint, xs: T, sm: T, md: T, lg: T): T => {
  switch (bp) {
    case "xs":
      return xs;
    case "sm":
      return sm;
    case "md":
      return md;
    default:
      return lg;
  }
};

// ==================== TYPES ====================
type ModeType = "learn" | "practice";
type QuestionType = "mcq" | "fill_blank" | "true_false";
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
interface EquationBalanceAdditionalProps {
  initialEquation?: {
    leftExpression: string;
    rightExpression: string;
    leftValue: number;
    rightValue: number;
  };
  availableOperations?: ("add" | "subtract" | "multiply" | "divide")[];
  operandRange?: { min: number; max: number };
  showNumericValues?: boolean;
  presetEquations?: {
    left: string;
    right: string;
    leftVal: number;
    rightVal: number;
    label?: string;
  }[];
}
interface PracticeQuestion {
  id: number;
  type: QuestionType;
  question: string;
  equation?: string;
  options?: string[];
  correctIndex?: number;
  correctAnswer?: string;
  placeholder?: string;
  hint?: string;
  statement?: string;
  correctBool?: boolean;
  explanation: string;
}
interface EquationBalanceToolProps {
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
    additionalProps?: EquationBalanceAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== STEPS & QUESTIONS ====================
const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "What is an Equation?",
    description:
      "An equation is a statement of equality between two expressions. Think of it as a perfectly balanced weighing scale — the Left Hand Side (LHS) has the same value as the Right Hand Side (RHS).",
    type: "intro",
    mode: "learn",
  },
  {
    id: 2,
    title: "The Balance Principle",
    description:
      "If we perform the SAME operation on BOTH sides of an equation, the equality is preserved — just like adding equal weights to both plates of a balanced scale!",
    type: "explanation",
    mode: "learn",
    data: {
      demo: {
        equation: "15 + 8 = 23",
        leftVal: 23,
        rightVal: 23,
        operations: [
          { label: "Add 10 to both sides", leftResult: 33, rightResult: 33 },
          {
            label: "Subtract 5 from both sides",
            leftResult: 18,
            rightResult: 18,
          },
          {
            label: "Multiply both sides by 2",
            leftResult: 46,
            rightResult: 46,
          },
        ],
      },
    },
  },
  {
    id: 3,
    title: "Adding to Both Sides",
    description:
      "15 + 8 = 23. Add 10 to both sides: (15 + 8) + 10 = 23 + 10 → 33 = 33. Equality holds!",
    type: "explanation",
    mode: "learn",
    data: {
      before: { left: "15 + 8", right: "23", leftVal: 23, rightVal: 23 },
      operation: "Add 10 to both sides",
      after: {
        left: "(15 + 8) + 10",
        right: "23 + 10",
        leftVal: 33,
        rightVal: 33,
      },
    },
  },
  {
    id: 4,
    title: "Subtracting from Both Sides",
    description:
      "15 + 8 = 23. Subtract 5 from both sides: (15 + 8) − 5 = 23 − 5 → 18 = 18. Still balanced!",
    type: "explanation",
    mode: "learn",
    data: {
      before: { left: "15 + 8", right: "23", leftVal: 23, rightVal: 23 },
      operation: "Subtract 5 from both sides",
      after: {
        left: "(15 + 8) − 5",
        right: "23 − 5",
        leftVal: 18,
        rightVal: 18,
      },
    },
  },
  {
    id: 5,
    title: "Multiplying & Dividing",
    description:
      "The same rule works for × and ÷! If 23 × 41 × 11 × 8 × 7 = 5,80,888, divide both sides by 7 to get 23 × 41 × 11 × 8 = 82,984.",
    type: "explanation",
    mode: "learn",
    data: {
      before: {
        left: "23×41×11×8×7",
        right: "5,80,888",
        leftVal: 580888,
        rightVal: 580888,
      },
      operation: "Divide both sides by 7",
      after: {
        left: "23×41×11×8",
        right: "82,984",
        leftVal: 82984,
        rightVal: 82984,
      },
    },
  },
  {
    id: 6,
    title: "What Breaks Equality?",
    description:
      "Applying an operation to ONLY ONE side breaks equality! 15 + 8 = 23 → add 10 to left only → 33 ≠ 23.",
    type: "explanation",
    mode: "learn",
    data: {
      before: { left: "15 + 8", right: "23", leftVal: 23, rightVal: 23 },
      operation: "Add 10 to LEFT only ⚠️",
      after: { left: "(15+8)+10", right: "23", leftVal: 33, rightVal: 23 },
      broken: true,
    },
  },
  {
    id: 7,
    title: "Solving Equations",
    description:
      "For 5x − 4 = 7: add 4 to both sides → 5x = 11, divide by 5 → x = 11/5. Each step preserves equality!",
    type: "explanation",
    mode: "learn",
    data: {
      steps: [
        { eq: "5x − 4 = 7", note: "Starting equation" },
        { eq: "5x − 4 + 4 = 7 + 4", note: "Add 4 to both sides" },
        { eq: "5x = 11", note: "Simplified" },
        { eq: "5x ÷ 5 = 11 ÷ 5", note: "Divide both sides by 5" },
        { eq: "x = 11/5", note: "Solution!" },
      ],
    },
  },
  {
    id: 20,
    title: "Practice Time!",
    description:
      "Test your understanding with MCQ, True/False, and Fill in the Blank questions!",
    type: "practice",
    mode: "practice",
  },
];

const QUESTION_BANK: PracticeQuestion[] = [
  {
    id: 1,
    type: "mcq",
    question:
      "If 3x + 7 = 22, what should we do to BOTH sides to start solving for x?",
    equation: "3x + 7 = 22",
    options: [
      "Subtract 7 from both sides",
      "Add 7 to both sides",
      "Subtract 7 from left only",
      "Divide both sides by 7",
    ],
    correctIndex: 0,
    explanation: "Subtract 7 from both sides: 3x = 15.",
  },
  {
    id: 2,
    type: "mcq",
    question: "If we multiply BOTH sides of 10 + 6 = 16 by 3, we get?",
    equation: "10 + 6 = 16",
    options: ["48 = 48", "48 = 16", "16 = 48", "36 = 48"],
    correctIndex: 0,
    explanation: "(10+6)×3 = 16×3 → 48 = 48.",
  },
  {
    id: 3,
    type: "mcq",
    question: "Which will BREAK the equality 8 = 8?",
    equation: "8 = 8",
    options: [
      "Add 5 to left only",
      "Add 5 to both sides",
      "Subtract 3 from both",
      "Multiply both by 2",
    ],
    correctIndex: 0,
    explanation: "Adding to one side only: 13 ≠ 8.",
  },
  {
    id: 4,
    type: "mcq",
    question: "If 2y = 14, what isolates y?",
    equation: "2y = 14",
    options: [
      "Divide both by 2",
      "Subtract 2 from both",
      "Multiply both by 2",
      "Add 2 to both",
    ],
    correctIndex: 0,
    explanation: "2y ÷ 2 = 14 ÷ 2 → y = 7.",
  },
  {
    id: 5,
    type: "mcq",
    question: "First step for 6y + 7 = 4y + 21?",
    equation: "6y + 7 = 4y + 21",
    options: [
      "Subtract 4y from both",
      "Add 4y to both",
      "Divide both by 6",
      "Subtract 21 from both",
    ],
    correctIndex: 0,
    explanation: "6y−4y + 7 = 21 → 2y + 7 = 21.",
  },
  {
    id: 6,
    type: "mcq",
    question: "If A + 88 = 13353, how to find A?",
    options: [
      "Subtract 88 from both",
      "Add 88 to both",
      "Divide both by 88",
      "Calculate separately",
    ],
    correctIndex: 0,
    explanation: "A = 13353 − 88 = 13265.",
  },
  {
    id: 10,
    type: "true_false",
    statement: "Adding 10 to both sides of 15 + 8 = 23 preserves equality.",
    correctBool: true,
    question: "",
    explanation: "True! 33 = 33.",
  },
  {
    id: 11,
    type: "true_false",
    statement: "Subtracting from left and adding to right preserves equality.",
    correctBool: false,
    question: "",
    explanation: "False! Must apply SAME operation to both sides.",
  },
  {
    id: 12,
    type: "true_false",
    statement: "Multiplying both sides by 0 preserves meaningful equality.",
    correctBool: false,
    question: "",
    explanation: "False! It destroys information.",
  },
  {
    id: 13,
    type: "true_false",
    statement: "To solve u/15 = 6, multiply both sides by 15.",
    correctBool: true,
    question: "",
    explanation: "True! u = 90.",
  },
  {
    id: 14,
    type: "true_false",
    statement: "2n + 1 = 99 → subtracting 1 from both sides is valid.",
    correctBool: true,
    question: "",
    explanation: "True! 2n = 98, n = 49.",
  },
  {
    id: 15,
    type: "true_false",
    statement: "Removing equal weights from both plates unbalances the scale.",
    correctBool: false,
    question: "",
    explanation: "False! Equal removal preserves balance.",
  },
  {
    id: 16,
    type: "true_false",
    statement: "4x + 6 = 10 → 4x = 10 + 6 is correct.",
    correctBool: false,
    question: "",
    explanation: "False! 4x = 10 − 6 = 4.",
  },
  {
    id: 20,
    type: "fill_blank",
    question: "3x − 10 = 35. Adding 10 to both sides: 3x = ___",
    correctAnswer: "45",
    placeholder: "Number",
    hint: "35 + 10",
    explanation: "3x = 45.",
  },
  {
    id: 21,
    type: "fill_blank",
    question: "2y + 7 = 21. Solving: y = ___",
    correctAnswer: "7",
    placeholder: "Number",
    hint: "(21−7) ÷ 2",
    explanation: "y = 7.",
  },
  {
    id: 22,
    type: "fill_blank",
    question: "11y + (−5) = 61. Then 11y = ___",
    correctAnswer: "66",
    placeholder: "Number",
    hint: "61 + 5",
    explanation: "11y = 66.",
  },
  {
    id: 23,
    type: "fill_blank",
    question: "u/15 = 6. Then u = ___",
    correctAnswer: "90",
    placeholder: "Number",
    hint: "6 × 15",
    explanation: "u = 90.",
  },
  {
    id: 24,
    type: "fill_blank",
    question: "2n + 1 = 99. Then n = ___",
    correctAnswer: "49",
    placeholder: "Number",
    hint: "(99−1) ÷ 2",
    explanation: "n = 49.",
  },
  {
    id: 25,
    type: "fill_blank",
    question: "25p + 50 = 500. Then p = ___",
    correctAnswer: "18",
    placeholder: "Number",
    hint: "450 ÷ 25",
    explanation: "p = 18.",
  },
  {
    id: 26,
    type: "fill_blank",
    question: "150m = 1050. Then m = ___",
    correctAnswer: "7",
    placeholder: "Number",
    hint: "1050 ÷ 150",
    explanation: "m = 7.",
  },
];

// ==================== MAIN COMPONENT ====================
type ToolConfigProps = NonNullable<EquationBalanceToolProps["props"]>;
const EquationBalanceTool: React.FC<EquationBalanceToolProps> = ({
  props = {} as ToolConfigProps,
  setStepDetails,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { w: cw, bp } = useContainerSize(containerRef);
  const isMobile = bp === "xs" || bp === "sm";
  const isXs = bp === "xs";

  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: (props.initialMode ?? "learn") as ModeType,
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: (props.enabledModes ?? ["learn", "practice"]) as ModeType[],
      showNavigation: props.showNavigation ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      filterSteps: props.filterSteps ?? null,
    }),
    [props],
  );

  const allSteps = props.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(
    () =>
      config.filterSteps?.length
        ? allSteps.filter((s) => config.filterSteps!.includes(s.id))
        : allSteps,
    [allSteps, config.filterSteps],
  );
  const [selectedMode, setSelectedMode] = useState<ModeType>(
    config.initialMode,
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeDemoStep, setActiveDemoStep] = useState(0);
  const [showDemoResult, setShowDemoResult] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState<
    PracticeQuestion[]
  >([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedMCQ, setSelectedMCQ] = useState<number | null>(null);
  const [fillAnswer, setFillAnswer] = useState("");
  const [selectedTF, setSelectedTF] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [shakeWrong, setShakeWrong] = useState(false);
  const filteredSteps = useMemo(
    () => availableSteps.filter((s) => s.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const currentStep = filteredSteps[currentStepIndex] || filteredSteps[0];

  const generatePracticeSet = useCallback(() => {
    const sh = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
    setPracticeQuestions(
      [
        ...sh.filter((q) => q.type === "mcq").slice(0, 3),
        ...sh.filter((q) => q.type === "true_false").slice(0, 4),
        ...sh.filter((q) => q.type === "fill_blank").slice(0, 3),
      ].sort(() => Math.random() - 0.5),
    );
    setCurrentQIndex(0);
    resetAnswer();
    setScore(0);
    setTotalAnswered(0);
  }, []);
  useEffect(() => {
    if (selectedMode === "practice" && !practiceQuestions.length)
      generatePracticeSet();
  }, [selectedMode, practiceQuestions.length, generatePracticeSet]);
  const resetAnswer = () => {
    setSelectedMCQ(null);
    setFillAnswer("");
    setSelectedTF(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    setShakeWrong(false);
  };

  useEffect(() => {
    const kf = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
            @keyframes fadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
            @keyframes fadeInDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
            @keyframes popIn{0%{transform:scale(0);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
            @keyframes shake{0%,100%{transform:translateX(0)}15%,55%,85%{transform:translateX(-5px)}35%,65%{transform:translateX(5px)}}
            @keyframes slideInLeft{from{opacity:0;transform:translateX(-32px)}to{opacity:1;transform:translateX(0)}}
            @keyframes slideInRight{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)}}
            @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
            @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
            @keyframes glowPrimary{0%,100%{box-shadow:0 0 0 0 rgba(74,77,201,0)}50%{box-shadow:0 0 0 6px rgba(74,77,201,0.15)}}
        `;
    const s = document.createElement("style");
    s.id = "eq-kf";
    s.textContent = kf;
    document.head.appendChild(s);
    return () => {
      const e = document.getElementById("eq-kf");
      if (e) document.head.removeChild(e);
    };
  }, []);

  const goToStep = useCallback(
    (dir: "next" | "prev") => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      const n =
        dir === "next"
          ? Math.min(currentStepIndex + 1, filteredSteps.length - 1)
          : Math.max(currentStepIndex - 1, 0);
      setTimeout(() => {
        setCurrentStepIndex(n);
        setActiveDemoStep(0);
        setShowDemoResult(false);
        setIsTransitioning(false);
      }, 280);
    },
    [currentStepIndex, filteredSteps.length, isTransitioning],
  );

  const changeMode = useCallback(
    (mode: ModeType) => {
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedMode(mode);
        setCurrentStepIndex(0);
        setActiveDemoStep(0);
        setShowDemoResult(false);
        if (mode === "practice") generatePracticeSet();
        setIsTransitioning(false);
      }, 280);
    },
    [generatePracticeSet],
  );

  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: filteredSteps.length,
        isPaused: true,
        currentMode: selectedMode,
      });
  }, [currentStepIndex, filteredSteps.length, selectedMode, setStepDetails]);

  const handleCheck = useCallback(() => {
    if (isAnswered || !practiceQuestions.length) return;
    const q = practiceQuestions[currentQIndex];
    let c = false;
    if (q.type === "mcq") {
      if (selectedMCQ === null) return;
      c = selectedMCQ === q.correctIndex;
    } else if (q.type === "fill_blank") {
      if (!fillAnswer.trim()) return;
      c = fillAnswer.trim() === q.correctAnswer;
    } else if (q.type === "true_false") {
      if (selectedTF === null) return;
      c = selectedTF === q.correctBool;
    }
    setIsCorrect(c);
    setIsAnswered(true);
    setTotalAnswered((p) => p + 1);
    if (c) setScore((p) => p + 1);
    else {
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 600);
    }
  }, [
    isAnswered,
    practiceQuestions,
    currentQIndex,
    selectedMCQ,
    fillAnswer,
    selectedTF,
  ]);

  const nextQ = useCallback(() => {
    if (currentQIndex < practiceQuestions.length - 1) {
      setCurrentQIndex((p) => p + 1);
      resetAnswer();
    }
  }, [currentQIndex, practiceQuestions.length]);

  // ─── RESPONSIVE SCALE SVG ───
  const renderScale = (lv: number, rightVal: number, anim?: boolean) => {
    const bal = Math.abs(lv - rightVal) < 0.001;
    const ang = bal ? 0 : lv > rightVal ? -12 : 12;
    const svgW = rv(bp, 240, 260, 280, 300);
    const svgH = rv(bp, 100, 108, 115, 120);
    const cx = svgW / 2;
    const fs = rv(bp, 10, 11, 12, 13);
    return (
      <svg
        width="100%"
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block", margin: "6px auto", maxWidth: svgW }}
      >
        <polygon
          points={`${cx - 15},${svgH - 8} ${cx + 15},${svgH - 8} ${cx},${svgH - 38}`}
          fill={DS.gray500}
          stroke={DS.gray900}
          strokeWidth="1"
        />
        <circle
          cx={cx}
          cy={svgH - 40}
          r={rv(bp, 4, 4, 5, 5)}
          fill={DS.primary}
          stroke={DS.white}
          strokeWidth="1.5"
        />
        <g
          style={{
            transformOrigin: `${cx}px ${svgH - 40}px`,
            transform: `rotate(${ang}deg)`,
            transition: anim
              ? "transform 0.7s cubic-bezier(0.34,1.56,0.64,1)"
              : "none",
          }}
        >
          <rect
            x={12}
            y={svgH - 44}
            width={svgW - 24}
            height={6}
            rx={3}
            fill={DS.primaryDark}
          />
          <line
            x1={svgW * 0.15}
            y1={svgH - 38}
            x2={svgW * 0.15}
            y2={svgH - 24}
            stroke={DS.gray900}
            strokeWidth="1.5"
          />
          <rect
            x={svgW * 0.15 - 28}
            y={svgH - 24}
            width={56}
            height={4}
            rx={2}
            fill={bal ? DS.success : DS.error}
            style={{ transition: "fill 0.4s" }}
          />
          <text
            x={svgW * 0.15}
            y={svgH - 52}
            textAnchor="middle"
            fontSize={fs}
            fontWeight="700"
            fill={bal ? DS.success : DS.error}
            fontFamily={DS.font}
          >
            {Number.isInteger(lv) ? lv : lv.toFixed(1)}
          </text>
          <line
            x1={svgW * 0.85}
            y1={svgH - 38}
            x2={svgW * 0.85}
            y2={svgH - 24}
            stroke={DS.gray900}
            strokeWidth="1.5"
          />
          <rect
            x={svgW * 0.85 - 28}
            y={svgH - 24}
            width={56}
            height={4}
            rx={2}
            fill={bal ? DS.success : DS.error}
            style={{ transition: "fill 0.4s" }}
          />
          <text
            x={svgW * 0.85}
            y={svgH - 52}
            textAnchor="middle"
            fontSize={fs}
            fontWeight="700"
            fill={bal ? DS.success : DS.error}
            fontFamily={DS.font}
          >
            {Number.isInteger(rightVal) ? rightVal : rightVal.toFixed(1)}
          </text>
        </g>
        <circle
          cx={cx}
          cy={16}
          r={rv(bp, 11, 12, 13, 13)}
          fill={bal ? DS.success : DS.error}
          style={{ animation: anim ? "popIn 0.5s ease-out" : "none" }}
        />
        <text
          x={cx}
          y={rv(bp, 20, 21, 21, 21)}
          textAnchor="middle"
          fontSize={rv(bp, 10, 11, 12, 12)}
          fill="white"
          fontWeight="bold"
        >
          {bal ? "✓" : "✗"}
        </text>
      </svg>
    );
  };
  // Fix: rv2 is rightValue param, rename to avoid conflict with rv helper
  const renderScaleFn = (lv: number, rightVal: number, anim?: boolean) => {
    const bal = Math.abs(lv - rightVal) < 0.001;
    const ang = bal ? 0 : lv > rightVal ? -12 : 12;
    const svgW = isMobile ? (isXs ? 240 : 270) : bp === "md" ? 290 : 310;
    const svgH = isMobile ? (isXs ? 95 : 105) : 120;
    const cx = svgW / 2;
    const fs = isMobile ? 10 : 12;
    const lx = svgW * 0.16;
    const rx = svgW * 0.84;
    return (
      <svg
        width="100%"
        viewBox={`0 0 ${svgW} ${svgH}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block", margin: "6px auto", maxWidth: svgW }}
      >
        <polygon
          points={`${cx - 14},${svgH - 6} ${cx + 14},${svgH - 6} ${cx},${svgH - 34}`}
          fill={DS.gray500}
          stroke={DS.gray900}
          strokeWidth="1"
        />
        <circle
          cx={cx}
          cy={svgH - 36}
          r={4}
          fill={DS.primary}
          stroke={DS.white}
          strokeWidth="1.5"
        />
        <g
          style={{
            transformOrigin: `${cx}px ${svgH - 36}px`,
            transform: `rotate(${ang}deg)`,
            transition: anim
              ? "transform 0.7s cubic-bezier(0.34,1.56,0.64,1)"
              : "none",
          }}
        >
          <rect
            x={10}
            y={svgH - 40}
            width={svgW - 20}
            height={6}
            rx={3}
            fill={DS.primaryDark}
          />
          <line
            x1={lx}
            y1={svgH - 34}
            x2={lx}
            y2={svgH - 20}
            stroke={DS.gray900}
            strokeWidth="1.2"
          />
          <rect
            x={lx - 24}
            y={svgH - 20}
            width={48}
            height={4}
            rx={2}
            fill={bal ? DS.success : DS.error}
          />
          <text
            x={lx}
            y={svgH - 48}
            textAnchor="middle"
            fontSize={fs}
            fontWeight="700"
            fill={bal ? DS.success : DS.error}
            fontFamily={DS.font}
          >
            {Number.isInteger(lv) ? lv : lv.toFixed(1)}
          </text>
          <line
            x1={rx}
            y1={svgH - 34}
            x2={rx}
            y2={svgH - 20}
            stroke={DS.gray900}
            strokeWidth="1.2"
          />
          <rect
            x={rx - 24}
            y={svgH - 20}
            width={48}
            height={4}
            rx={2}
            fill={bal ? DS.success : DS.error}
          />
          <text
            x={rx}
            y={svgH - 48}
            textAnchor="middle"
            fontSize={fs}
            fontWeight="700"
            fill={bal ? DS.success : DS.error}
            fontFamily={DS.font}
          >
            {Number.isInteger(rightVal) ? rightVal : rightVal.toFixed(1)}
          </text>
        </g>
        <circle
          cx={cx}
          cy={14}
          r={isMobile ? 10 : 12}
          fill={bal ? DS.success : DS.error}
          style={{ animation: anim ? "popIn 0.5s ease-out" : "none" }}
        />
        <text
          x={cx}
          y={isMobile ? 18 : 19}
          textAnchor="middle"
          fontSize={isMobile ? 9 : 11}
          fill="white"
          fontWeight="bold"
        >
          {bal ? "✓" : "✗"}
        </text>
      </svg>
    );
  };

  // Responsive sizes
  const pad = isMobile ? (isXs ? 12 : 14) : 20;
  const titleFs = isMobile ? 14 : 17;
  const descFs = isMobile ? 12 : 13;
  const eqFs = isMobile ? (isXs ? 14 : 16) : 20;
  const cardPad = isMobile ? (isXs ? 10 : 12) : 16;
  const btnPad = isMobile ? "8px 16px" : "10px 20px";
  const btnFs = isMobile ? 12 : 13;

  // ─── LEARN RENDERS ───
  const renderEquationTransform = (data: any) => {
    if (!data?.before || !data?.after) return null;
    const broken = data.broken;
    const afterBal = Math.abs(data.after.leftVal - data.after.rightVal) < 0.001;
    return (
      <div style={{ animation: "fadeInUp 0.45s ease-out" }}>
        <div
          style={{
            padding: cardPad,
            borderRadius: DS.radius.card,
            background: DS.primaryLight,
            border: `2px solid ${DS.primaryTint}`,
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: DS.primaryDark,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
              fontFamily: DS.font,
            }}
          >
            Starting Equation
          </div>
          <div
            style={{
              fontSize: eqFs,
              fontWeight: 800,
              fontFamily: '"Courier New",monospace',
              color: DS.primaryDark,
              wordBreak: "break-all",
            }}
          >
            {data.before.left}{" "}
            <span style={{ color: DS.success, margin: "0 4px" }}>=</span>{" "}
            {data.before.right}
          </div>
          {renderScaleFn(data.before.leftVal, data.before.rightVal, false)}
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "5px 0",
            animation: "fadeInUp 0.45s ease-out 0.15s both",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: isMobile ? "6px 14px" : "8px 20px",
              borderRadius: DS.radius.pill,
              background: broken ? DS.accentTint : DS.successTint,
              border: `2px solid ${broken ? DS.accent : DS.success}`,
              fontWeight: 700,
              fontSize: isMobile ? 11 : 13,
              color: broken ? "#9A4A00" : "#0D6E4F",
              fontFamily: DS.font,
            }}
          >
            ↓ {data.operation} ↓
          </div>
        </div>
        <div
          style={{
            padding: cardPad,
            borderRadius: DS.radius.card,
            background: afterBal ? DS.successTint : DS.errorTint,
            border: `2px solid ${afterBal ? DS.success : DS.error}`,
            textAlign: "center",
            animation: broken
              ? "shake 0.5s ease 0.5s"
              : "fadeInUp 0.45s ease-out 0.3s both",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: afterBal ? "#0D6E4F" : DS.error,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
              fontFamily: DS.font,
            }}
          >
            {afterBal ? "✓ Still Balanced!" : "✗ Equality Broken!"}
          </div>
          <div
            style={{
              fontSize: eqFs,
              fontWeight: 800,
              fontFamily: '"Courier New",monospace',
              color: afterBal ? "#0D6E4F" : DS.error,
              wordBreak: "break-all",
            }}
          >
            {data.after.left}{" "}
            <span style={{ margin: "0 4px" }}>{afterBal ? "=" : "≠"}</span>{" "}
            {data.after.right}
          </div>
          {renderScaleFn(data.after.leftVal, data.after.rightVal, true)}
        </div>
      </div>
    );
  };

  const renderSolveSteps = (data: any) => {
    if (!data?.steps) return null;
    return (
      <div
        style={{
          padding: cardPad,
          borderRadius: DS.radius.card,
          background: `linear-gradient(135deg,${DS.primaryLight},#F8F0FF)`,
          border: `2px solid ${DS.primaryTint}`,
          animation: "fadeInUp 0.45s ease-out",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: DS.primaryDark,
            textTransform: "uppercase",
            letterSpacing: 1.2,
            marginBottom: 10,
            fontFamily: DS.font,
          }}
        >
          Step by Step
        </div>
        {data.steps.map((s: any, i: number) => {
          const last = i === data.steps.length - 1;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: isMobile ? "flex-start" : "center",
                gap: isMobile ? 8 : 12,
                padding: isMobile ? "8px 10px" : "10px 14px",
                marginBottom: 5,
                borderRadius: DS.radius.md,
                background: last ? DS.successTint : DS.white,
                border: `1.5px solid ${last ? DS.success : DS.primaryTint}`,
                animation: `slideInLeft 0.4s ease-out ${i * 0.1}s both`,
              }}
            >
              <div
                style={{
                  width: isMobile ? 22 : 28,
                  height: isMobile ? 22 : 28,
                  borderRadius: DS.radius.pill,
                  background: last ? DS.success : DS.primary,
                  color: DS.white,
                  fontSize: isMobile ? 10 : 12,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontFamily: DS.font,
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: isMobile ? 13 : 16,
                    fontWeight: 700,
                    fontFamily: '"Courier New",monospace',
                    color: last ? "#0D6E4F" : DS.gray900,
                    wordBreak: "break-all",
                  }}
                >
                  {s.eq}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 10 : 11,
                    color: DS.gray500,
                    fontStyle: "italic",
                    marginTop: 1,
                    fontFamily: DS.font,
                  }}
                >
                  {s.note}
                </div>
              </div>
              {last && (
                <span
                  style={{
                    fontSize: isMobile ? 16 : 20,
                    animation: "popIn 0.4s ease-out 0.5s both",
                  }}
                >
                  🎉
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderInteractiveDemo = (data: any) => {
    if (!data?.demo) return null;
    const d = data.demo;
    return (
      <div
        style={{
          padding: cardPad,
          borderRadius: DS.radius.card,
          background: DS.successTint,
          border: `2px solid ${DS.success}`,
          animation: "fadeInUp 0.45s ease-out",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 10,
            fontSize: eqFs,
            fontWeight: 800,
            fontFamily: '"Courier New",monospace',
            color: "#0D6E4F",
          }}
        >
          {d.equation}
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#0D6E4F",
            marginBottom: 8,
            textAlign: "center",
            fontFamily: DS.font,
          }}
        >
          Tap an operation:
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          {d.operations.map((op: any, i: number) => (
            <button
              key={i}
              onClick={() => {
                setActiveDemoStep(i);
                setShowDemoResult(true);
              }}
              style={{
                padding: isMobile ? "8px 12px" : "10px 20px",
                borderRadius: DS.radius.pill,
                border:
                  activeDemoStep === i && showDemoResult
                    ? `2px solid ${DS.primary}`
                    : `2px solid ${DS.primaryTint}`,
                background:
                  activeDemoStep === i && showDemoResult
                    ? DS.primary
                    : DS.white,
                color:
                  activeDemoStep === i && showDemoResult
                    ? DS.white
                    : DS.primaryDark,
                fontWeight: 600,
                fontSize: isMobile ? 11 : 13,
                cursor: "pointer",
                fontFamily: DS.font,
                transition: "all 0.25s ease",
                animation: `fadeInUp 0.3s ease-out ${i * 0.08}s both`,
              }}
            >
              {op.label}
            </button>
          ))}
        </div>
        {showDemoResult && (
          <div
            style={{
              textAlign: "center",
              padding: cardPad,
              borderRadius: DS.radius.md,
              background: DS.white,
              border: `2px solid ${DS.success}`,
              animation: "popIn 0.35s ease-out",
            }}
          >
            <div
              style={{
                fontSize: isMobile ? 18 : 22,
                fontWeight: 800,
                fontFamily: '"Courier New",monospace',
                color: "#0D6E4F",
              }}
            >
              {d.operations[activeDemoStep].leftResult} ={" "}
              {d.operations[activeDemoStep].rightResult}
            </div>
            <div
              style={{
                marginTop: 6,
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: DS.radius.pill,
                background: DS.success,
                color: DS.white,
                fontWeight: 700,
                fontSize: 11,
                fontFamily: DS.font,
              }}
            >
              ✓ Equality Preserved!
            </div>
            {renderScaleFn(
              d.operations[activeDemoStep].leftResult,
              d.operations[activeDemoStep].rightResult,
              true,
            )}
          </div>
        )}
      </div>
    );
  };

  const renderLearn = () => {
    if (!currentStep) return null;
    const d = currentStep.data;
    if (d?.demo) return renderInteractiveDemo(d);
    if (d?.before && d?.after) return renderEquationTransform(d);
    if (d?.steps) return renderSolveSteps(d);
    if (currentStep.id === 1) {
      return (
        <div
          style={{
            padding: isMobile ? 16 : 24,
            borderRadius: DS.radius.card,
            background: DS.primaryLight,
            border: `2px solid ${DS.primaryTint}`,
            textAlign: "center",
            animation: "fadeInUp 0.5s ease-out",
          }}
        >
          <div
            style={{
              fontSize: isMobile ? 36 : 48,
              marginBottom: 10,
              animation: "bounce 2s ease infinite",
            }}
          >
            ⚖️
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: isMobile ? 10 : 16,
              fontSize: isMobile ? 18 : 22,
              fontWeight: 800,
              fontFamily: DS.font,
              color: DS.primaryDark,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                padding: isMobile ? "8px 16px" : "10px 24px",
                background: DS.white,
                borderRadius: DS.radius.md,
                boxShadow: DS.shadow.sm,
                animation: "slideInLeft 0.5s ease-out",
              }}
            >
              LHS
            </span>
            <span
              style={{
                width: isMobile ? 38 : 48,
                height: isMobile ? 38 : 48,
                borderRadius: DS.radius.pill,
                background: `linear-gradient(135deg,${DS.primary},${DS.primaryDark})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: DS.white,
                fontWeight: 900,
                fontSize: isMobile ? 18 : 24,
                animation: "popIn 0.5s ease-out 0.15s both",
                boxShadow: DS.shadow.md,
              }}
            >
              =
            </span>
            <span
              style={{
                padding: isMobile ? "8px 16px" : "10px 24px",
                background: DS.white,
                borderRadius: DS.radius.md,
                boxShadow: DS.shadow.sm,
                animation: "slideInRight 0.5s ease-out",
              }}
            >
              RHS
            </span>
          </div>
          {renderScaleFn(23, 23, false)}
        </div>
      );
    }
    return null;
  };

  // ─── PRACTICE RENDERS ───
  const badge = (type: QuestionType) => {
    const m: Record<
      QuestionType,
      { l: string; bg: string; bc: string; c: string; i: string }
    > = {
      mcq: {
        l: "MCQ",
        bg: DS.primaryLight,
        bc: DS.primaryTint,
        c: DS.primary,
        i: "🔘",
      },
      fill_blank: {
        l: "Fill Blank",
        bg: DS.accentTint,
        bc: "#FFDCB8",
        c: "#9A4A00",
        i: "✏️",
      },
      true_false: {
        l: "True / False",
        bg: "#F8F0FF",
        bc: "#D4B8F0",
        c: DS.primaryDark,
        i: "⚡",
      },
    };
    const v = m[type];
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "4px 12px",
          borderRadius: DS.radius.pill,
          background: v.bg,
          border: `1.5px solid ${v.bc}`,
          fontSize: 10,
          fontWeight: 700,
          color: v.c,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          fontFamily: DS.font,
        }}
      >
        {v.i} {v.l}
      </div>
    );
  };

  const renderMCQ = (q: PracticeQuestion) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {q.options?.map((opt, i) => {
        let bg = DS.white,
          bc = DS.gray300,
          tc = DS.gray900;
        if (isAnswered) {
          if (i === q.correctIndex) {
            bg = DS.successTint;
            bc = DS.success;
            tc = "#0D6E4F";
          } else if (i === selectedMCQ) {
            bg = DS.errorTint;
            bc = DS.error;
            tc = DS.error;
          }
        } else if (selectedMCQ === i) {
          bg = DS.primaryLight;
          bc = DS.primary;
          tc = DS.primary;
        }
        return (
          <button
            key={i}
            onClick={() => {
              if (!isAnswered) setSelectedMCQ(i);
            }}
            disabled={isAnswered}
            style={{
              padding: isMobile ? "10px 12px" : "12px 16px",
              borderRadius: DS.radius.md,
              border: `2px solid ${bc}`,
              background: bg,
              color: tc,
              fontSize: isMobile ? 12 : 14,
              fontWeight: 600,
              cursor: isAnswered ? "default" : "pointer",
              textAlign: "left",
              transition: "all 0.25s ease",
              display: "flex",
              alignItems: "flex-start",
              gap: isMobile ? 8 : 12,
              fontFamily: DS.font,
              animation: `fadeInUp 0.3s ease-out ${i * 0.06}s both`,
              lineHeight: 1.4,
            }}
          >
            <div
              style={{
                width: isMobile ? 22 : 28,
                height: isMobile ? 22 : 28,
                borderRadius: DS.radius.pill,
                flexShrink: 0,
                border: `2px solid ${bc}`,
                background:
                  isAnswered && i === q.correctIndex
                    ? DS.success
                    : selectedMCQ === i
                      ? DS.primary
                      : DS.white,
                color:
                  (isAnswered && i === q.correctIndex) || selectedMCQ === i
                    ? DS.white
                    : DS.gray500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isMobile ? 10 : 12,
                fontWeight: 800,
                transition: "all 0.25s ease",
                fontFamily: DS.font,
                marginTop: 1,
              }}
            >
              {isAnswered && i === q.correctIndex
                ? "✓"
                : String.fromCharCode(65 + i)}
            </div>
            <span style={{ flex: 1, minWidth: 0, wordBreak: "break-word" }}>
              {opt}
            </span>
          </button>
        );
      })}
    </div>
  );

  const renderTF = (q: PracticeQuestion) => (
    <div>
      <div
        style={{
          padding: isMobile ? "12px 14px" : "16px 20px",
          borderRadius: DS.radius.md,
          background: DS.gray100,
          border: `1.5px solid ${DS.gray300}`,
          fontSize: isMobile ? 13 : 15,
          fontWeight: 600,
          color: DS.gray900,
          lineHeight: 1.6,
          marginBottom: 12,
          fontStyle: "italic",
          fontFamily: DS.font,
        }}
      >
        "{q.statement}"
      </div>
      <div
        style={{
          display: "flex",
          gap: isMobile ? 8 : 12,
          justifyContent: "center",
        }}
      >
        {[true, false].map((val) => {
          let bg = DS.white,
            bc = DS.gray300,
            tc = DS.gray900;
          if (isAnswered) {
            if (val === q.correctBool) {
              bg = DS.successTint;
              bc = DS.success;
              tc = "#0D6E4F";
            } else if (val === selectedTF) {
              bg = DS.errorTint;
              bc = DS.error;
              tc = DS.error;
            }
          } else if (selectedTF === val) {
            bg = DS.primaryLight;
            bc = DS.primary;
            tc = DS.primary;
          }
          return (
            <button
              key={String(val)}
              onClick={() => {
                if (!isAnswered) setSelectedTF(val);
              }}
              disabled={isAnswered}
              style={{
                flex: 1,
                padding: isMobile ? "12px 8px" : "14px 24px",
                borderRadius: DS.radius.md,
                border: `2.5px solid ${bc}`,
                background: bg,
                color: tc,
                fontSize: isMobile ? 14 : 17,
                fontWeight: 700,
                cursor: isAnswered ? "default" : "pointer",
                fontFamily: DS.font,
                transition: "all 0.25s ease",
              }}
            >
              {val ? "✅ True" : "❌ False"}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderFill = (q: PracticeQuestion) => (
    <div style={{ animation: "fadeInUp 0.4s ease-out" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <input
          type="text"
          inputMode="numeric"
          value={fillAnswer}
          onChange={(e) => {
            if (!isAnswered) setFillAnswer(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCheck();
          }}
          placeholder={q.placeholder}
          disabled={isAnswered}
          style={{
            padding: isMobile ? "10px 16px" : "12px 20px",
            borderRadius: DS.radius.md,
            fontSize: isMobile ? 18 : 22,
            fontWeight: 800,
            fontFamily: '"Courier New",monospace',
            textAlign: "center",
            width: isMobile ? 130 : 160,
            border: `2.5px solid ${isAnswered ? (isCorrect ? DS.success : DS.error) : fillAnswer ? DS.primary : DS.gray300}`,
            background: isAnswered
              ? isCorrect
                ? DS.successTint
                : DS.errorTint
              : DS.white,
            color: isAnswered ? (isCorrect ? "#0D6E4F" : DS.error) : DS.gray900,
            outline: "none",
            transition: "all 0.3s ease",
            animation:
              isAnswered && !isCorrect
                ? "shake 0.5s ease"
                : "glowPrimary 2s ease infinite",
          }}
        />
      </div>
      {q.hint && !isAnswered && (
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setShowHint(!showHint)}
            style={{
              padding: "5px 14px",
              borderRadius: DS.radius.pill,
              border: "1.5px solid #FFDCB8",
              background: DS.accentTint,
              color: "#9A4A00",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: DS.font,
            }}
          >
            {showHint ? "💡 Hide" : "💡 Hint"}
          </button>
          {showHint && (
            <div
              style={{
                marginTop: 6,
                padding: "6px 12px",
                borderRadius: DS.radius.sm,
                background: "#FEF9C3",
                border: "1px solid #FDE68A",
                color: "#78350F",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: DS.font,
                animation: "fadeInUp 0.3s ease-out",
              }}
            >
              {q.hint}
            </div>
          )}
        </div>
      )}
      {isAnswered && !isCorrect && (
        <div
          style={{
            textAlign: "center",
            marginTop: 6,
            fontSize: isMobile ? 13 : 15,
            fontWeight: 700,
            color: "#0D6E4F",
            fontFamily: DS.font,
          }}
        >
          Answer:{" "}
          <span
            style={{
              padding: "3px 10px",
              borderRadius: DS.radius.sm,
              background: DS.successTint,
              fontFamily: '"Courier New",monospace',
              fontSize: isMobile ? 16 : 18,
              border: `1px solid ${DS.success}`,
            }}
          >
            {q.correctAnswer}
          </span>
        </div>
      )}
    </div>
  );

  const renderPractice = () => {
    if (!practiceQuestions.length) return null;
    if (currentQIndex >= practiceQuestions.length) {
      return (
        <div
          style={{
            textAlign: "center",
            padding: isMobile ? 20 : 32,
            animation: "fadeInUp 0.5s ease-out",
          }}
        >
          <div
            style={{
              fontSize: isMobile ? 44 : 56,
              marginBottom: 12,
              animation: "bounce 1.5s ease infinite",
            }}
          >
            🏆
          </div>
          <div
            style={{
              fontSize: isMobile ? 18 : 22,
              fontWeight: 800,
              color: DS.primaryDark,
              marginBottom: 6,
              fontFamily: DS.font,
            }}
          >
            Complete!
          </div>
          <div
            style={{
              fontSize: isMobile ? 28 : 38,
              fontWeight: 900,
              color: DS.primary,
              marginBottom: 6,
              fontFamily: DS.font,
            }}
          >
            {score}/{totalAnswered}
          </div>
          <div
            style={{
              fontSize: isMobile ? 12 : 14,
              color: DS.gray900,
              marginBottom: 20,
              fontFamily: DS.font,
            }}
          >
            {score === totalAnswered
              ? "Perfect! 🌟"
              : score >= totalAnswered * 0.7
                ? "Great job! 💪"
                : "Keep trying! 📖"}
          </div>
          <button
            onClick={generatePracticeSet}
            style={{
              padding: isMobile ? "12px 28px" : "14px 36px",
              borderRadius: DS.radius.pill,
              border: "none",
              background: `linear-gradient(135deg,${DS.primary},${DS.primaryDark})`,
              color: DS.white,
              fontSize: isMobile ? 14 : 16,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: DS.font,
              boxShadow: DS.shadow.md,
            }}
          >
            🔄 Again
          </button>
        </div>
      );
    }
    const q = practiceQuestions[currentQIndex];
    const can =
      (q.type === "mcq" && selectedMCQ !== null) ||
      (q.type === "fill_blank" && fillAnswer.trim()) ||
      (q.type === "true_false" && selectedTF !== null);
    return (
      <div
        style={{
          animation: shakeWrong ? "shake 0.5s ease" : "fadeInUp 0.4s ease-out",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 5,
              borderRadius: 3,
              background: DS.gray300,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 3,
                background: `linear-gradient(90deg,${DS.primary},${DS.accentSoft})`,
                width: `${(currentQIndex / practiceQuestions.length) * 100}%`,
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: DS.gray900,
              fontFamily: DS.font,
              whiteSpace: "nowrap",
            }}
          >
            {currentQIndex + 1}/{practiceQuestions.length}
          </span>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: DS.radius.pill,
              background: DS.successTint,
              fontSize: 11,
              fontWeight: 800,
              color: DS.success,
              fontFamily: DS.font,
            }}
          >
            {score}✓
          </span>
        </div>
        <div style={{ marginBottom: 10 }}>{badge(q.type)}</div>
        <div
          style={{
            fontSize: isMobile ? 13 : 15,
            fontWeight: 600,
            color: DS.gray900,
            lineHeight: 1.65,
            marginBottom: 6,
            fontFamily: DS.font,
          }}
        >
          {q.question}
        </div>
        {q.equation && (
          <div
            style={{
              textAlign: "center",
              padding: isMobile ? "8px 12px" : "10px 20px",
              marginBottom: 12,
              borderRadius: DS.radius.md,
              background: DS.primaryLight,
              border: `2px solid ${DS.primaryTint}`,
              fontSize: isMobile ? 16 : 20,
              fontWeight: 800,
              fontFamily: '"Courier New",monospace',
              color: DS.primary,
              wordBreak: "break-all",
            }}
          >
            {q.equation}
          </div>
        )}
        {q.type === "mcq" && renderMCQ(q)}
        {q.type === "true_false" && renderTF(q)}
        {q.type === "fill_blank" && renderFill(q)}
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            marginTop: 16,
            flexWrap: "wrap",
          }}
        >
          {!isAnswered ? (
            <button
              onClick={handleCheck}
              disabled={!can}
              style={{
                padding: isMobile ? "10px 28px" : "12px 36px",
                borderRadius: DS.radius.pill,
                border: "none",
                background: !can
                  ? DS.gray300
                  : `linear-gradient(135deg,${DS.primary},${DS.primaryDark})`,
                color: !can ? DS.gray500 : DS.white,
                fontSize: isMobile ? 13 : 15,
                fontWeight: 700,
                cursor: !can ? "not-allowed" : "pointer",
                fontFamily: DS.font,
                boxShadow: can ? DS.shadow.md : "none",
                transition: "all 0.25s ease",
                width: isMobile ? "100%" : "auto",
              }}
            >
              Check Answer
            </button>
          ) : (
            <div style={{ width: "100%" }}>
              <div
                style={{
                  padding: isMobile ? "10px 14px" : "14px 18px",
                  borderRadius: DS.radius.md,
                  marginBottom: 12,
                  background: isCorrect ? DS.successTint : DS.errorTint,
                  border: `2px solid ${isCorrect ? DS.success : DS.error}`,
                  animation: "fadeInUp 0.35s ease-out",
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? 13 : 14,
                    fontWeight: 800,
                    marginBottom: 3,
                    color: isCorrect ? "#0D6E4F" : DS.error,
                    fontFamily: DS.font,
                  }}
                >
                  {isCorrect ? "🎉 Correct!" : "❌ Not Quite"}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 11 : 13,
                    color: isCorrect ? "#0D6E4F" : "#A33",
                    lineHeight: 1.5,
                    fontFamily: DS.font,
                  }}
                >
                  {q.explanation}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={
                    currentQIndex < practiceQuestions.length - 1
                      ? nextQ
                      : () => setCurrentQIndex(practiceQuestions.length)
                  }
                  style={{
                    padding: isMobile ? "10px 24px" : "12px 32px",
                    borderRadius: DS.radius.pill,
                    border: "none",
                    background: `linear-gradient(135deg,${DS.accent},${DS.accentSoft})`,
                    color: DS.white,
                    fontSize: isMobile ? 13 : 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: DS.font,
                    boxShadow: DS.shadow.accent,
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  {currentQIndex < practiceQuestions.length - 1
                    ? "Next →"
                    : "Results 🏆"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── MAIN RENDER ───
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: config.width,
        minHeight: isMobile ? "auto" : config.height,
        background: `linear-gradient(170deg,${DS.white} 0%,${DS.primaryLight} 50%,#FFF8F2 100%)`,
        borderRadius: isMobile ? DS.radius.md : DS.radius.lg,
        overflow: "hidden",
        boxShadow: DS.shadow.lg,
        fontFamily: DS.font,
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: isMobile
            ? `${isXs ? 14 : 16}px ${isXs ? 14 : 16}px ${isXs ? 10 : 12}px`
            : "22px 24px 16px",
          background: `linear-gradient(135deg,${DS.primary},${DS.primaryDark})`,
          color: DS.white,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: isMobile ? 80 : 120,
            height: isMobile ? 80 : 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <h2
          style={{
            margin: 0,
            fontSize: isMobile ? 16 : 20,
            fontWeight: 800,
            letterSpacing: -0.3,
            position: "relative",
            animation: "fadeInDown 0.45s ease-out",
          }}
        >
          ⚖️ Preserving Equality
        </h2>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: isMobile ? 11 : 12.5,
            opacity: 0.88,
            fontWeight: 500,
            position: "relative",
            lineHeight: 1.5,
            animation: "fadeInDown 0.45s ease-out 0.08s both",
          }}
        >
          Same operation on both sides preserves equality.
        </p>
      </div>
      {/* Mode Tabs */}
      {config.showModeSelector && (
        <div
          style={{
            display: "flex",
            gap: isMobile ? 4 : 6,
            padding: isMobile ? "8px 12px" : "10px 20px",
            background: DS.white,
            borderBottom: `1.5px solid ${DS.gray300}`,
          }}
        >
          {config.enabledModes.map((mode, i) => (
            <button
              key={mode}
              onClick={() => changeMode(mode)}
              style={{
                flex: 1,
                padding: isMobile ? "8px 6px" : "10px 12px",
                borderRadius: DS.radius.pill,
                border:
                  selectedMode === mode
                    ? "none"
                    : `2px solid ${DS.primaryTint}`,
                background:
                  selectedMode === mode
                    ? `linear-gradient(135deg,${DS.primary},${DS.primaryDark})`
                    : DS.white,
                color: selectedMode === mode ? DS.white : DS.gray900,
                fontSize: isMobile ? 12 : 13,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: isMobile ? 4 : 6,
                transition: "all 0.25s ease",
                boxShadow: selectedMode === mode ? DS.shadow.sm : "none",
              }}
            >
              {mode === "learn" ? (
                <BookOpen size={isMobile ? 13 : 15} />
              ) : (
                <Target size={isMobile ? 13 : 15} />
              )}{" "}
              {mode === "learn" ? "Learn" : "Practice"}
            </button>
          ))}
        </div>
      )}
      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: pad,
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "translateY(8px)" : "translateY(0)",
          transition: "all 0.28s ease",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {currentStep && (
          <div
            style={{
              marginBottom: isMobile ? 10 : 16,
              animation: "fadeInUp 0.4s ease-out",
            }}
          >
            <h3
              style={{
                margin: "0 0 4px",
                fontSize: titleFs,
                fontWeight: 800,
                color: DS.primaryDark,
              }}
            >
              {currentStep.title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: descFs,
                color: DS.gray900,
                lineHeight: 1.6,
                opacity: 0.8,
              }}
            >
              {currentStep.description}
            </p>
          </div>
        )}
        {selectedMode === "learn" && renderLearn()}
        {selectedMode === "practice" && renderPractice()}
      </div>
      {/* Nav */}
      {config.showNavigation &&
        selectedMode === "learn" &&
        filteredSteps.length > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: isMobile ? "10px 12px" : "12px 20px",
              borderTop: `1.5px solid ${DS.gray300}`,
              background: DS.white,
              gap: 8,
            }}
          >
            <button
              onClick={() => goToStep("prev")}
              disabled={currentStepIndex === 0}
              style={{
                padding: isMobile ? "7px 12px" : "8px 20px",
                borderRadius: DS.radius.pill,
                border: `2px solid ${currentStepIndex === 0 ? DS.gray300 : DS.primaryTint}`,
                background: DS.white,
                color: currentStepIndex === 0 ? DS.gray500 : DS.primaryDark,
                fontSize: isMobile ? 11 : 13,
                fontWeight: 600,
                cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
              }}
            >
              <ChevronLeft size={isMobile ? 14 : 16} /> {isXs ? "" : "Prev"}
            </button>
            {config.showStepIndicator && !isXs && (
              <div
                style={{
                  display: "flex",
                  gap: 5,
                  flexShrink: 1,
                  overflow: "hidden",
                }}
              >
                {filteredSteps.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === currentStepIndex ? 18 : 6,
                      height: 6,
                      borderRadius: 3,
                      background:
                        i === currentStepIndex ? DS.primary : DS.gray300,
                      transition: "all 0.3s ease",
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            )}
            {isXs && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: DS.gray900,
                  fontFamily: DS.font,
                }}
              >
                {currentStepIndex + 1}/{filteredSteps.length}
              </span>
            )}
            <button
              onClick={() => goToStep("next")}
              disabled={currentStepIndex === filteredSteps.length - 1}
              style={{
                padding: isMobile ? "7px 12px" : "8px 20px",
                borderRadius: DS.radius.pill,
                border: "none",
                background:
                  currentStepIndex === filteredSteps.length - 1
                    ? DS.gray300
                    : `linear-gradient(135deg,${DS.accent},${DS.accentSoft})`,
                color:
                  currentStepIndex === filteredSteps.length - 1
                    ? DS.gray500
                    : DS.white,
                fontSize: isMobile ? 11 : 13,
                fontWeight: 600,
                cursor:
                  currentStepIndex === filteredSteps.length - 1
                    ? "not-allowed"
                    : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "all 0.25s ease",
                boxShadow:
                  currentStepIndex < filteredSteps.length - 1
                    ? DS.shadow.accent
                    : "none",
                whiteSpace: "nowrap",
              }}
            >
              {isXs ? "" : "Next"} <ChevronRight size={isMobile ? 14 : 16} />
            </button>
          </div>
        )}
      {/* Footer */}
      <div
        style={{
          padding: isMobile ? "6px 12px 8px" : "8px 20px 10px",
          background: DS.gray100,
          borderTop: `1px solid ${DS.gray300}`,
          fontSize: isMobile ? 10 : 11,
          color: DS.gray500,
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        📖 Guide students through this tool. Encourage discussion.
      </div>
    </div>
  );
};

export default EquationBalanceTool;
// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
