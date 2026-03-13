/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Module resolution for 'react' and 'lucide-react' provided by project/workspace
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  X,
  BookOpen,
  Target,
  Zap,
  Star,
} from "lucide-react";

// ==================== TYPE DEFINITIONS ====================
type ModeType = "learn" | "practice" | "real_world" | "hands_on";
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
  type: "intro" | "explanation" | "practice" | "real_world" | "hands_on";
  mode: ModeType;
  data?: any;
}
interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}
interface EquationStep {
  lhs: string;
  rhs: string;
  explanation: string;
  operation?: string;
  highlight?: "lhs" | "rhs" | "both" | "operation";
}
interface EquationExample {
  title: string;
  equation: string;
  steps: EquationStep[];
  solution: string;
  solutionValue: string;
  hasSolution: boolean;
  verification?: EquationStep[];
}
interface EquationSolverAdditionalProps {
  examples?: EquationExample[];
  showBalanceScale?: boolean;
  highlightInverseOps?: boolean;
  showVerification?: boolean;
}
interface EquationSolverToolProps {
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
    additionalProps?: EquationSolverAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== ANIMATION HELPERS ====================
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
  const n1 = 7.5625,
    d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

// ==================== SINGULARITY DESIGN SYSTEM ====================
const DS = {
  indigo: "#4A4DC9",
  orange: "#FF7212",
  purple: "#533086",
  orangeGrad: "#FC9145",
  lightPurple: "#C1C1EA",
  lightOrange: "#FFF3E4",
  dark: "#4E4E4E",
  gray: "#CACACA",
  lightGray: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  success: "#2ECC71",
  error: "#E74C3C",
  font: "'Poppins', sans-serif",
};

// ==================== RESPONSIVE HOOK ====================
type Breakpoint = "xs" | "sm" | "md" | "lg";
const useContainerWidth = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [width, setWidth] = useState(800);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setWidth(entry.contentRect.width);
    });
    ro.observe(ref.current);
    setWidth(ref.current.offsetWidth);
    return () => ro.disconnect();
  }, [ref]);
  const bp: Breakpoint =
    width < 380 ? "xs" : width < 520 ? "sm" : width < 720 ? "md" : "lg";
  return { width, bp };
};

// ==================== RESPONSIVE SCALE HELPER ====================
interface RS {
  bp: Breakpoint;
  // Font sizes
  headingSize: number;
  titleSize: number;
  bodySize: number;
  smallSize: number;
  tinySize: number;
  mathSize: number;
  mathSizeLg: number;
  // Spacing
  pad: number;
  padSm: number;
  gap: number;
  gapSm: number;
  // Radii
  radius: number;
  radiusSm: number;
  radiusPill: number;
  // Icon sizes
  iconSm: number;
  iconMd: number;
  // Button
  btnPadX: number;
  btnPadY: number;
  btnFont: number;
  // Step card
  stepPadX: number;
  stepPadY: number;
  // Input
  inputW: number;
  inputPad: number;
  inputFont: number;
  // Misc
  headerPadX: number;
  headerPadY: number;
  maxContentW: string;
  showModeLabel: boolean;
  stackEquation: boolean;
  introIconSize: number;
}
const getRS = (bp: Breakpoint): RS => {
  switch (bp) {
    case "xs":
      return {
        bp,
        headingSize: 14,
        titleSize: 12,
        bodySize: 11,
        smallSize: 10,
        tinySize: 9,
        mathSize: 14,
        mathSizeLg: 18,
        pad: 10,
        padSm: 6,
        gap: 8,
        gapSm: 4,
        radius: 12,
        radiusSm: 8,
        radiusPill: 40,
        iconSm: 13,
        iconMd: 16,
        btnPadX: 12,
        btnPadY: 6,
        btnFont: 11,
        stepPadX: 10,
        stepPadY: 10,
        inputW: 44,
        inputPad: 6,
        inputFont: 15,
        headerPadX: 12,
        headerPadY: 10,
        maxContentW: "100%",
        showModeLabel: false,
        stackEquation: true,
        introIconSize: 48,
      };
    case "sm":
      return {
        bp,
        headingSize: 15,
        titleSize: 13,
        bodySize: 12,
        smallSize: 11,
        tinySize: 10,
        mathSize: 15,
        mathSizeLg: 20,
        pad: 12,
        padSm: 8,
        gap: 10,
        gapSm: 6,
        radius: 14,
        radiusSm: 10,
        radiusPill: 40,
        iconSm: 14,
        iconMd: 17,
        btnPadX: 16,
        btnPadY: 8,
        btnFont: 12,
        stepPadX: 12,
        stepPadY: 12,
        inputW: 48,
        inputPad: 7,
        inputFont: 16,
        headerPadX: 14,
        headerPadY: 12,
        maxContentW: "100%",
        showModeLabel: true,
        stackEquation: false,
        introIconSize: 56,
      };
    case "md":
      return {
        bp,
        headingSize: 16,
        titleSize: 14,
        bodySize: 12.5,
        smallSize: 11,
        tinySize: 10,
        mathSize: 16,
        mathSizeLg: 24,
        pad: 16,
        padSm: 10,
        gap: 12,
        gapSm: 8,
        radius: 16,
        radiusSm: 12,
        radiusPill: 40,
        iconSm: 15,
        iconMd: 18,
        btnPadX: 20,
        btnPadY: 9,
        btnFont: 13,
        stepPadX: 16,
        stepPadY: 14,
        inputW: 52,
        inputPad: 8,
        inputFont: 18,
        headerPadX: 20,
        headerPadY: 14,
        maxContentW: "100%",
        showModeLabel: true,
        stackEquation: false,
        introIconSize: 64,
      };
    case "lg":
    default:
      return {
        bp,
        headingSize: 17,
        titleSize: 14,
        bodySize: 13,
        smallSize: 11.5,
        tinySize: 10.5,
        mathSize: 17,
        mathSizeLg: 26,
        pad: 20,
        padSm: 12,
        gap: 14,
        gapSm: 10,
        radius: 16,
        radiusSm: 12,
        radiusPill: 40,
        iconSm: 15,
        iconMd: 18,
        btnPadX: 24,
        btnPadY: 10,
        btnFont: 13,
        stepPadX: 18,
        stepPadY: 14,
        inputW: 56,
        inputPad: 9,
        inputFont: 18,
        headerPadX: 24,
        headerPadY: 16,
        maxContentW: "560px",
        showModeLabel: true,
        stackEquation: false,
        introIconSize: 72,
      };
  }
};

// ==================== CUSTOM MATH TEXT ====================
const MathText: React.FC<{ expr: string; style?: React.CSSProperties }> = ({
  expr,
  style,
}) => {
  const rendered = useMemo(() => {
    const parts: React.ReactNode[] = [];
    let key = 0;
    const vars = new Set([
      "x",
      "y",
      "z",
      "u",
      "v",
      "w",
      "k",
      "m",
      "n",
      "p",
      "q",
      "r",
      "s",
      "f",
      "e",
    ]);
    const chars = expr.split("");
    let i = 0;
    while (i < chars.length) {
      const ch = chars[i];
      const prev = i > 0 ? chars[i - 1] : "";
      const next = i < chars.length - 1 ? chars[i + 1] : "";
      const isWord =
        (prev && /[a-zA-Z]/.test(prev)) || (next && /[a-zA-Z]/.test(next));
      if (/[a-z]/i.test(ch) && !isWord && vars.has(ch.toLowerCase())) {
        parts.push(
          <span
            key={key++}
            style={{
              fontStyle: "italic",
              fontWeight: 600,
              color: DS.indigo,
              margin: "0 1px",
            }}
          >
            {ch}
          </span>,
        );
        i++;
        continue;
      }
      let end = i + 1;
      while (end < chars.length) {
        const c = chars[end];
        const p = chars[end - 1];
        const nx = end < chars.length - 1 ? chars[end + 1] : "";
        const pw = (p && /[a-zA-Z]/.test(p)) || (nx && /[a-zA-Z]/.test(nx));
        if (/[a-z]/i.test(c) && !pw && vars.has(c.toLowerCase())) break;
        end++;
      }
      parts.push(<span key={key++}>{chars.slice(i, end).join("")}</span>);
      i = end;
    }
    return parts;
  }, [expr]);
  return (
    <span
      style={{
        fontFamily: DS.font,
        letterSpacing: "0.3px",
        display: "inline-flex",
        alignItems: "center",
        flexWrap: "wrap",
        ...style,
      }}
    >
      {rendered}
    </span>
  );
};

// ==================== DEFAULT DATA ====================
const DEFAULT_EXAMPLES: EquationExample[] = [
  {
    title: "Example 5: Solve 11y + (–5) = 61",
    equation: "11y + (-5) = 61",
    hasSolution: true,
    steps: [
      {
        lhs: "11y + (–5)",
        rhs: "61",
        explanation: "Start with the original equation. We need to isolate y.",
        highlight: "both",
      },
      {
        lhs: "11y + (–5) – (–5)",
        rhs: "61 – (–5)",
        explanation:
          "Subtract (–5) from both sides to remove the constant term from the LHS.",
        operation: "Subtract (–5) from both sides",
        highlight: "operation",
      },
      {
        lhs: "11y",
        rhs: "66",
        explanation:
          "The (–5) terms cancel on the left. On the right, 61 – (–5) = 61 + 5 = 66.",
        highlight: "both",
      },
      {
        lhs: "11y ÷ 11",
        rhs: "66 ÷ 11",
        explanation: "Divide both sides by 11 to isolate y.",
        operation: "Divide both sides by 11",
        highlight: "operation",
      },
      {
        lhs: "y",
        rhs: "6",
        explanation: "y = 6 is our solution!",
        highlight: "both",
      },
    ],
    solution: "y = 6",
    solutionValue: "6",
    verification: [
      {
        lhs: "11(6) + (–5)",
        rhs: "61",
        explanation: "Substitute y = 6 back into the original equation.",
        highlight: "lhs",
      },
      {
        lhs: "66 + (–5)",
        rhs: "61",
        explanation: "Calculate 11 × 6 = 66.",
        highlight: "lhs",
      },
      {
        lhs: "61",
        rhs: "61",
        explanation: "LHS = RHS ✓ The solution is verified!",
        highlight: "both",
      },
    ],
  },
  {
    title: "Example 6: Solve 6y + 7 = 4y + 21",
    equation: "6y + 7 = 4y + 21",
    hasSolution: true,
    steps: [
      {
        lhs: "6y + 7",
        rhs: "4y + 21",
        explanation: "Notice unknowns (y terms) appear on BOTH sides!",
        highlight: "both",
      },
      {
        lhs: "6y + 7 – 4y",
        rhs: "4y + 21 – 4y",
        explanation:
          "Subtract 4y from both sides to collect unknown terms on the left.",
        operation: "Subtract 4y from both sides",
        highlight: "operation",
      },
      {
        lhs: "2y + 7",
        rhs: "21",
        explanation:
          "6y – 4y = 2y on the left. The 4y terms cancel on the right.",
        highlight: "both",
      },
      {
        lhs: "2y + 7 – 7",
        rhs: "21 – 7",
        explanation: "Subtract 7 from both sides.",
        operation: "Subtract 7 from both sides",
        highlight: "operation",
      },
      {
        lhs: "2y",
        rhs: "14",
        explanation: "The 7s cancel. 21 – 7 = 14.",
        highlight: "both",
      },
      {
        lhs: "2y ÷ 2",
        rhs: "14 ÷ 2",
        explanation: "Divide both sides by 2.",
        operation: "Divide both sides by 2",
        highlight: "operation",
      },
      {
        lhs: "y",
        rhs: "7",
        explanation: "y = 7 is our solution!",
        highlight: "both",
      },
    ],
    solution: "y = 7",
    solutionValue: "7",
    verification: [
      {
        lhs: "6(7) + 7",
        rhs: "4(7) + 21",
        explanation: "Substitute y = 7 into both sides.",
        highlight: "both",
      },
      {
        lhs: "42 + 7",
        rhs: "28 + 21",
        explanation: "6×7 = 42 and 4×7 = 28.",
        highlight: "both",
      },
      {
        lhs: "49",
        rhs: "49",
        explanation: "LHS = RHS ✓ Correct!",
        highlight: "both",
      },
    ],
  },
];
const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Equations with Variables on Both Sides",
    description: "Unknowns on both sides of '='. Let's learn to solve them!",
    type: "intro",
    mode: "learn",
  },
  {
    id: 2,
    title: "Example 5: Single-side Unknown",
    description: "Solve 11y + (–5) = 61 using inverse operations.",
    type: "explanation",
    mode: "learn",
    data: { exampleIndex: 0 },
  },
  {
    id: 3,
    title: "Example 6: Unknowns on Both Sides",
    description: "Solve 6y + 7 = 4y + 21 — y on BOTH sides!",
    type: "explanation",
    mode: "learn",
    data: { exampleIndex: 1 },
  },
  {
    id: 4,
    title: "Key Strategy: Balance It",
    description: "Whatever you do to one side, do to the other!",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 10,
    title: "Solve 3x – 10 = 35",
    description: "Find x.",
    type: "practice",
    mode: "practice",
    data: {
      equation: "3x – 10 = 35",
      answer: 15,
      variable: "x",
      hints: ["Add 10 to both sides", "Divide by 3"],
    },
  },
  {
    id: 11,
    title: "Solve 3u – 7 = 2u + 3",
    description: "Variables on both sides!",
    type: "practice",
    mode: "practice",
    data: {
      equation: "3u – 7 = 2u + 3",
      answer: 10,
      variable: "u",
      hints: ["Subtract 2u from both sides", "Add 7 to both sides"],
    },
  },
  {
    id: 12,
    title: "Solve 5x – 4 = 7",
    description: "Find x!",
    type: "practice",
    mode: "practice",
    data: {
      equation: "5x – 4 = 7",
      answer: 2.2,
      variable: "x",
      hints: ["Add 4 → 5x = 11", "Divide by 5 → x = 2.2"],
    },
  },
  {
    id: 20,
    title: "Weighing Scale Analogy",
    description: "A balanced scale stays balanced with equal changes!",
    type: "real_world",
    mode: "real_world",
  },
  {
    id: 21,
    title: "Savings Problem",
    description: "Jahnavi: ₹4000+₹650/mo. Sunita: ₹5050+₹500/mo. When equal?",
    type: "real_world",
    mode: "real_world",
    data: { exampleIndex: 1 },
  },
  {
    id: 30,
    title: "Build Your Own Equation",
    description: "Create Ax + B = Cx + D and solve it!",
    type: "hands_on",
    mode: "hands_on",
  },
];

// ==================== MAIN COMPONENT ====================
type PropsShape = NonNullable<EquationSolverToolProps["props"]>;
const EquationSolverTool: React.FC<EquationSolverToolProps> = ({
  props = {} as PropsShape,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerW, bp } = useContainerWidth(containerRef);
  const r = useMemo(() => getRS(bp), [bp]);

  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: props.initialMode ?? "learn",
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: props.enabledModes ?? [
        "learn",
        "practice",
        "real_world",
        "hands_on",
      ],
      showNavigation: props.showNavigation ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      filterSteps: props.filterSteps ?? null,
      autoPlayDuration: props.autoPlayDuration ?? 0,
      themeColor: props.themeColor ?? DS.indigo,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const examples = props.additionalProps?.examples || DEFAULT_EXAMPLES;
  const showVerification = props.additionalProps?.showVerification ?? true;
  const allSteps = props.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(() => {
    if (config.filterSteps?.length)
      return allSteps.filter((s) => config.filterSteps!.includes(s.id));
    return allSteps;
  }, [allSteps, config.filterSteps]);

  const [selectedMode, setSelectedMode] = useState<ModeType>(
    config.initialMode,
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [exampleStepIndex, setExampleStepIndex] = useState(0);
  const [showingVerification, setShowingVerification] = useState(false);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceResult, setPracticeResult] = useState<
    "correct" | "incorrect" | null
  >(null);
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [customA, setCustomA] = useState("5");
  const [customB, setCustomB] = useState("3");
  const [customC, setCustomC] = useState("2");
  const [customD, setCustomD] = useState("18");
  const [customSolved, setCustomSolved] = useState(false);
  const [customSolution, setCustomSolution] = useState("");

  const filteredSteps = useMemo(
    () => availableSteps.filter((s) => s.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const currentStep = filteredSteps[currentStepIndex] || filteredSteps[0];

  useEffect(() => {
    setExampleStepIndex(0);
    setShowingVerification(false);
    setPracticeAnswer("");
    setPracticeResult(null);
    setShowHints(false);
    setCurrentHintIndex(0);
    setCustomSolved(false);
  }, [currentStepIndex, selectedMode]);
  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: currentStepIndex,
        totalSteps: filteredSteps.length,
        isPaused: true,
        currentMode: selectedMode,
      });
  }, [currentStepIndex, filteredSteps.length, selectedMode]);

  useEffect(() => {
    const s = document.createElement("style");
    s.id = "sg-eq-v4";
    s.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
            @keyframes sgFadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
            @keyframes sgFadeLeft{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
            @keyframes sgFadeRight{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
            @keyframes sgPopIn{0%{transform:scale(0);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
            @keyframes sgPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
            @keyframes sgGlow{0%,100%{box-shadow:0 0 0 0 ${DS.indigo}00}50%{box-shadow:0 0 20px 4px ${DS.indigo}25}}
            @keyframes sgBounce{0%{transform:scale(1)}20%{transform:scale(1.15)}40%{transform:scale(0.96)}60%{transform:scale(1.06)}100%{transform:scale(1)}}
            @keyframes sgShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
            @keyframes sgSlideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
            @keyframes sgFloat{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-6px) rotate(1deg)}75%{transform:translateY(4px) rotate(-1deg)}}
            @keyframes sgScaleEqual{from{opacity:0;transform:scaleX(0)}to{opacity:1;transform:scaleX(1)}}
        `;
    document.head.appendChild(s);
    return () => {
      const e = document.getElementById("sg-eq-v4");
      if (e) document.head.removeChild(e);
    };
  }, []);

  const navigateStep = useCallback(
    (dir: "next" | "prev") => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        if (dir === "next" && currentStepIndex < filteredSteps.length - 1)
          setCurrentStepIndex((p) => p + 1);
        else if (dir === "prev" && currentStepIndex > 0)
          setCurrentStepIndex((p) => p - 1);
        setTimeout(() => setIsTransitioning(false), 350);
      }, 200);
    },
    [currentStepIndex, filteredSteps.length, isTransitioning],
  );
  const handleModeChange = useCallback(
    (mode: ModeType) => {
      if (mode === selectedMode) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedMode(mode);
        setCurrentStepIndex(0);
        setTimeout(() => setIsTransitioning(false), 350);
      }, 200);
    },
    [selectedMode],
  );
  const checkAnswer = useCallback(() => {
    if (!currentStep?.data) return;
    setPracticeResult(
      Math.abs(parseFloat(practiceAnswer) - currentStep.data.answer) < 0.05
        ? "correct"
        : "incorrect",
    );
  }, [practiceAnswer, currentStep]);
  const solveCustom = useCallback(() => {
    const a = parseFloat(customA) || 0,
      b = parseFloat(customB) || 0,
      c = parseFloat(customC) || 0,
      d = parseFloat(customD) || 0;
    if (a === c)
      setCustomSolution(
        b === d ? "Infinite solutions!" : "No solution! " + b + " ≠ " + d,
      );
    else
      setCustomSolution(
        "x = (" +
          d +
          " – " +
          b +
          ") / (" +
          a +
          " – " +
          c +
          ") = " +
          Math.round(((d - b) / (a - c)) * 1000) / 1000,
      );
    setCustomSolved(true);
  }, [customA, customB, customC, customD]);

  const modeConf: {
    [k in ModeType]: { icon: any; label: string; color: string; bg: string };
  } = {
    learn: {
      icon: BookOpen,
      label: "Learn",
      color: DS.indigo,
      bg: DS.lightPurple,
    },
    practice: {
      icon: Target,
      label: "Practice",
      color: DS.purple,
      bg: "#E8D5F5",
    },
    real_world: {
      icon: Zap,
      label: "Real World",
      color: DS.orange,
      bg: DS.lightOrange,
    },
    hands_on: {
      icon: Star,
      label: "Hands On",
      color: "#2ECC71",
      bg: "#E8F8F0",
    },
  };

  // ==================== RESPONSIVE BUTTONS ====================
  const ContainedBtn: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    color?: string;
    disabled?: boolean;
  }> = ({ onClick, children, color = DS.indigo, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: r.bp === "xs" ? "4px" : "6px",
        padding: `${r.btnPadY}px ${r.btnPadX}px`,
        borderRadius: r.radiusPill,
        border: "none",
        background: disabled ? DS.lightGray : color,
        color: disabled ? DS.gray : DS.white,
        fontSize: `${r.btnFont}px`,
        fontWeight: 600,
        fontFamily: DS.font,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.25s ease",
        boxShadow: disabled ? "none" : `0 4px 14px ${color}35`,
        whiteSpace: "nowrap" as const,
      }}
      onMouseOver={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "scale(1.04)";
          e.currentTarget.style.boxShadow = `0 6px 20px ${color}50`;
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = disabled
          ? "none"
          : `0 4px 14px ${color}35`;
      }}
    >
      {children}
    </button>
  );
  const OutlinedBtn: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    color?: string;
    disabled?: boolean;
  }> = ({ onClick, children, color = DS.indigo, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: r.bp === "xs" ? "3px" : "6px",
        padding: `${r.btnPadY - 1}px ${r.btnPadX}px`,
        borderRadius: r.radiusPill,
        border: `2px solid ${disabled ? DS.gray : color}`,
        background: "transparent",
        color: disabled ? DS.gray : color,
        fontSize: `${r.btnFont}px`,
        fontWeight: 600,
        fontFamily: DS.font,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.25s ease",
        whiteSpace: "nowrap" as const,
      }}
      onMouseOver={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = `${color}0D`;
          e.currentTarget.style.transform = "scale(1.03)";
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {children}
    </button>
  );
  const TextBtn: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    color?: string;
  }> = ({ onClick, children, color = DS.indigo }) => (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: `${r.btnPadY - 2}px ${r.btnPadX - 6}px`,
        borderRadius: r.radiusPill,
        border: "none",
        background: "transparent",
        color,
        fontSize: `${r.btnFont}px`,
        fontWeight: 600,
        fontFamily: DS.font,
        cursor: "pointer",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap" as const,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = `${color}0D`;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </button>
  );

  // ==================== DECORATIVE SHAPES ====================
  const GeoShapes: React.FC<{ variant?: "purple" | "orange" }> = ({
    variant = "purple",
  }) => {
    const sc = variant === "purple" ? DS.indigo : DS.orange;
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          overflow: "hidden",
          pointerEvents: "none",
          opacity: 0.1,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: r.bp === "xs" ? "60px" : "100px",
            height: r.bp === "xs" ? "60px" : "100px",
            borderRadius: "50%",
            border: `3px solid ${sc}`,
            animation: "sgFloat 8s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-15px",
            left: "10%",
            width: r.bp === "xs" ? "36px" : "60px",
            height: r.bp === "xs" ? "36px" : "60px",
            border: `3px solid ${sc}`,
            transform: "rotate(45deg)",
            animation: "sgFloat 6s ease-in-out infinite 1s",
          }}
        />
        {r.bp !== "xs" && (
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "-25px",
              width: "0",
              height: "0",
              borderLeft: "30px solid transparent",
              borderRight: "30px solid transparent",
              borderBottom: `52px solid ${sc}`,
              animation: "sgFloat 7s ease-in-out infinite 0.5s",
            }}
          />
        )}
      </div>
    );
  };

  // ==================== RENDER WALKTHROUGH ====================
  const renderWalkthrough = (ex: EquationExample) => {
    const steps = showingVerification ? ex.verification || [] : ex.steps;
    const vis = Math.min(exampleStepIndex + 1, steps.length);
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${r.gap}px`,
          width: "100%",
          maxWidth: r.maxContentW,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontSize: `${r.headingSize}px`,
            fontWeight: 700,
            color: DS.purple,
            fontFamily: DS.font,
            animation: "sgFadeUp 0.5s ease-out",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            flexWrap: "wrap",
          }}
        >
          {showingVerification && (
            <span style={{ fontSize: `${r.headingSize + 2}px` }}>🔍</span>
          )}
          {showingVerification ? "Verification" : ex.title}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: `${r.gapSm}px`,
            maxHeight:
              r.bp === "xs" ? "260px" : r.bp === "sm" ? "290px" : "330px",
            overflowY: "auto",
            padding: "2px 2px",
          }}
        >
          {steps.slice(0, vis).map((st, idx) => {
            const latest = idx === vis - 1;
            return (
              <div
                key={`${showingVerification ? "v" : "s"}-${idx}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: `${r.gapSm}px`,
                  padding: `${r.stepPadY}px ${r.stepPadX}px`,
                  borderRadius: `${r.radius}px`,
                  background: latest
                    ? `linear-gradient(135deg, ${DS.white}, ${DS.lightPurple}30)`
                    : DS.white,
                  border: latest
                    ? `2px solid ${DS.indigo}40`
                    : `1.5px solid ${DS.lightGray}`,
                  opacity: latest ? 1 : 0.65,
                  animation: latest
                    ? "sgFadeUp 0.45s ease-out, sgGlow 2.5s ease-in-out infinite"
                    : undefined,
                  transition: "all 0.35s ease",
                  boxShadow: latest
                    ? `0 6px 24px ${DS.indigo}12`
                    : "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      width: `${r.bp === "xs" ? 20 : 26}px`,
                      height: `${r.bp === "xs" ? 20 : 26}px`,
                      borderRadius: "50%",
                      background: latest
                        ? `linear-gradient(135deg, ${DS.indigo}, ${DS.purple})`
                        : DS.lightGray,
                      color: latest ? DS.white : DS.dark,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: `${r.tinySize}px`,
                      fontWeight: 700,
                      fontFamily: DS.font,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>
                  {st.operation && (
                    <span
                      style={{
                        padding: `2px ${r.padSm}px`,
                        borderRadius: r.radiusPill + "px",
                        background: `linear-gradient(135deg, ${DS.lightOrange}, ${DS.orange}15)`,
                        border: `1px solid ${DS.orange}30`,
                        fontSize: `${r.tinySize}px`,
                        fontWeight: 600,
                        color: DS.orange,
                        fontFamily: DS.font,
                        animation: latest ? "sgPopIn 0.4s ease-out" : undefined,
                      }}
                    >
                      ⚡ {st.operation}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: r.stackEquation ? "6px" : `${r.gap}px`,
                    flexWrap: "wrap",
                    flexDirection: r.stackEquation ? "column" : "row",
                    padding: `${r.gapSm - 2}px 0`,
                  }}
                >
                  <div
                    style={{
                      padding: `${r.padSm}px ${r.pad}px`,
                      borderRadius: `${r.radiusSm}px`,
                      background:
                        st.highlight === "lhs" ||
                        st.highlight === "both" ||
                        st.highlight === "operation"
                          ? `${DS.lightPurple}50`
                          : "transparent",
                      transition: "all 0.3s ease",
                      animation:
                        latest &&
                        (st.highlight === "lhs" || st.highlight === "both")
                          ? "sgFadeLeft 0.45s ease-out"
                          : undefined,
                    }}
                  >
                    <MathText
                      expr={st.lhs}
                      style={{
                        fontSize: `${r.mathSize}px`,
                        color: DS.dark,
                        fontWeight: 600,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: `${r.mathSize + 4}px`,
                      fontWeight: 800,
                      fontFamily: DS.font,
                      background: `linear-gradient(135deg, ${DS.indigo}, ${DS.orange})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      animation: latest
                        ? "sgScaleEqual 0.4s ease-out"
                        : undefined,
                    }}
                  >
                    =
                  </span>
                  <div
                    style={{
                      padding: `${r.padSm}px ${r.pad}px`,
                      borderRadius: `${r.radiusSm}px`,
                      background:
                        st.highlight === "rhs" ||
                        st.highlight === "both" ||
                        st.highlight === "operation"
                          ? `${DS.lightOrange}80`
                          : "transparent",
                      transition: "all 0.3s ease",
                      animation:
                        latest &&
                        (st.highlight === "rhs" || st.highlight === "both")
                          ? "sgFadeRight 0.45s ease-out"
                          : undefined,
                    }}
                  >
                    <MathText
                      expr={st.rhs}
                      style={{
                        fontSize: `${r.mathSize}px`,
                        color: DS.dark,
                        fontWeight: 600,
                      }}
                    />
                  </div>
                </div>
                {latest && (
                  <div
                    style={{
                      fontSize: `${r.smallSize}px`,
                      color: DS.dark,
                      textAlign: "center",
                      fontStyle: "italic",
                      animation: "sgFadeUp 0.5s ease-out 0.15s both",
                      lineHeight: 1.6,
                      fontFamily: DS.font,
                      fontWeight: 400,
                      opacity: 0.75,
                      padding: `0 ${r.padSm}px`,
                    }}
                  >
                    {st.explanation}
                  </div>
                )}
              </div>
            );
          })}
          {!showingVerification &&
            exampleStepIndex >= steps.length - 1 &&
            ex.hasSolution && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: `${r.gapSm}px`,
                  padding: `${r.pad}px`,
                  borderRadius: `${r.radius}px`,
                  background: `linear-gradient(135deg, ${DS.indigo}10, ${DS.orange}10)`,
                  border: `2px solid ${DS.indigo}30`,
                  animation: "sgBounce 0.6s ease-out",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${DS.indigo}, ${DS.orange})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check size={r.iconSm} color={DS.white} />
                </div>
                <span
                  style={{
                    fontSize: `${r.headingSize + 1}px`,
                    fontWeight: 700,
                    fontFamily: DS.font,
                    background: `linear-gradient(135deg, ${DS.indigo}, ${DS.orange})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Solution: {ex.solution}
                </span>
                <span style={{ fontSize: "18px" }}>🎉</span>
              </div>
            )}
          {showingVerification && exampleStepIndex >= steps.length - 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: `${r.gapSm}px`,
                padding: `${r.pad}px`,
                borderRadius: `${r.radius}px`,
                background: "#2ECC7112",
                border: "2px solid #2ECC7140",
                animation: "sgBounce 0.6s ease-out",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: "20px" }}>✅</span>
              <span
                style={{
                  fontSize: `${r.bodySize + 1}px`,
                  fontWeight: 700,
                  fontFamily: DS.font,
                  color: "#2ECC71",
                }}
              >
                LHS = RHS — Verified!
              </span>
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: `${r.gapSm}px`,
            flexWrap: "wrap",
            marginTop: "4px",
          }}
        >
          {exampleStepIndex > 0 && (
            <OutlinedBtn onClick={() => setExampleStepIndex((p) => p - 1)}>
              <ChevronLeft size={r.iconSm} /> Prev
            </OutlinedBtn>
          )}
          {exampleStepIndex < steps.length - 1 && (
            <ContainedBtn onClick={() => setExampleStepIndex((p) => p + 1)}>
              Next <ChevronRight size={r.iconSm} />
            </ContainedBtn>
          )}
          {!showingVerification &&
            exampleStepIndex >= steps.length - 1 &&
            showVerification &&
            ex.verification && (
              <ContainedBtn
                onClick={() => {
                  setShowingVerification(true);
                  setExampleStepIndex(0);
                }}
                color={DS.success}
              >
                ✓ Verify
              </ContainedBtn>
            )}
          <TextBtn
            onClick={() => {
              setExampleStepIndex(0);
              setShowingVerification(false);
            }}
            color={DS.dark}
          >
            <RotateCcw size={r.iconSm - 2} /> Reset
          </TextBtn>
        </div>
      </div>
    );
  };

  // ==================== RENDER INTRO ====================
  const renderIntro = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: `${r.gap + 4}px`,
        animation: "sgFadeUp 0.6s ease-out",
        padding: `${r.pad}px`,
      }}
    >
      <div
        style={{
          width: `${r.introIconSize}px`,
          height: `${r.introIconSize}px`,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${DS.indigo}, ${DS.orange})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "sgPulse 2.5s infinite",
          boxShadow: `0 8px 30px ${DS.indigo}30`,
        }}
      >
        <span style={{ fontSize: `${r.introIconSize * 0.5}px` }}>⚖️</span>
      </div>
      <div
        style={{
          fontSize: `${r.headingSize + 2}px`,
          fontWeight: 700,
          color: DS.dark,
          textAlign: "center",
          fontFamily: DS.font,
          lineHeight: 1.5,
        }}
      >
        Solving Equations with
        <br />
        <span
          style={{
            background: `linear-gradient(135deg, ${DS.indigo}, ${DS.orange})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Variables on Both Sides
        </span>
      </div>
      <div
        style={{
          display: "flex",
          gap: `${r.gapSm}px`,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          { n: "1", t: "Collect variables on one side", c: DS.indigo },
          { n: "2", t: "Constants on the other", c: DS.purple },
          { n: "3", t: "Solve for the variable", c: DS.orange },
          { n: "4", t: "Verify your solution!", c: "#2ECC71" },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: `${r.gapSm}px`,
              padding: `${r.padSm}px ${r.pad}px`,
              borderRadius: `${r.radius}px`,
              background: DS.white,
              border: `1.5px solid ${DS.lightGray}`,
              animation: `sgFadeUp 0.45s ease-out ${i * 0.1}s both`,
              fontFamily: DS.font,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              maxWidth: r.bp === "xs" ? "100%" : "auto",
            }}
          >
            <span
              style={{
                width: `${r.bp === "xs" ? 22 : 28}px`,
                height: `${r.bp === "xs" ? 22 : 28}px`,
                borderRadius: "50%",
                background: item.c,
                color: DS.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: `${r.smallSize}px`,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {item.n}
            </span>
            <span
              style={{
                fontSize: `${r.smallSize}px`,
                color: DS.dark,
                fontWeight: 500,
              }}
            >
              {item.t}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          padding: `${r.pad}px`,
          borderRadius: `${r.radius}px`,
          background: `linear-gradient(135deg, ${DS.lightPurple}40, ${DS.lightOrange}60)`,
          border: `1.5px solid ${DS.lightPurple}80`,
          fontSize: `${r.smallSize}px`,
          color: DS.dark,
          textAlign: "center",
          maxWidth: "500px",
          lineHeight: 1.7,
          fontFamily: DS.font,
          animation: "sgFadeUp 0.5s ease-out 0.4s both",
          fontWeight: 400,
          width: "100%",
          boxSizing: "border-box" as const,
        }}
      >
        <span style={{ fontWeight: 700, color: DS.indigo }}>💡 Key Idea:</span>{" "}
        Whatever you do to one side, do the same to the other!
      </div>
    </div>
  );

  // ==================== RENDER STRATEGY ====================
  const renderStrategy = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: `${r.gap + 4}px`,
        alignItems: "center",
        animation: "sgFadeUp 0.5s ease-out",
        padding: `${r.pad}px`,
      }}
    >
      <div
        style={{
          fontSize: `${r.introIconSize * 0.7}px`,
          animation: "sgFloat 4s ease-in-out infinite",
        }}
      >
        ⚖️
      </div>
      <div
        style={{
          fontSize: `${r.headingSize}px`,
          fontWeight: 700,
          color: DS.dark,
          fontFamily: DS.font,
        }}
      >
        The Balance Principle
      </div>
      <div
        style={{
          display: "flex",
          gap: `${r.gapSm}px`,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          { op: "+", d: "Add same to both", c: DS.indigo },
          { op: "−", d: "Subtract same", c: DS.purple },
          { op: "×", d: "Multiply both", c: DS.orange },
          { op: "÷", d: "Divide both", c: DS.orangeGrad },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: `${r.gapSm}px`,
              padding: `${r.padSm}px ${r.pad}px`,
              borderRadius: `${r.radius}px`,
              background: DS.white,
              border: `1.5px solid ${DS.lightGray}`,
              animation: `sgPopIn 0.4s ease-out ${i * 0.08}s both`,
              fontFamily: DS.font,
            }}
          >
            <span
              style={{
                width: `${r.bp === "xs" ? 26 : 34}px`,
                height: `${r.bp === "xs" ? 26 : 34}px`,
                borderRadius: "50%",
                background: item.c,
                color: DS.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: `${r.bp === "xs" ? 14 : 18}px`,
              }}
            >
              {item.op}
            </span>
            <span
              style={{
                fontSize: `${r.smallSize}px`,
                color: DS.dark,
                fontWeight: 500,
              }}
            >
              {item.d}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          padding: `${r.pad}px`,
          borderRadius: `${r.radius}px`,
          background: `linear-gradient(135deg, ${DS.lightOrange}80, ${DS.lightPurple}40)`,
          border: `1.5px solid ${DS.orange}20`,
          fontSize: `${r.smallSize}px`,
          color: DS.dark,
          textAlign: "center",
          maxWidth: "480px",
          lineHeight: 1.7,
          fontFamily: DS.font,
          animation: "sgFadeUp 0.4s ease-out 0.3s both",
          width: "100%",
          boxSizing: "border-box" as const,
        }}
      >
        <span style={{ fontWeight: 700, color: DS.orange }}>🎯 Strategy:</span>{" "}
        Move variable terms to one side, constants to the other, then solve!
      </div>
    </div>
  );

  // ==================== RENDER PRACTICE ====================
  const renderPractice = () => {
    if (!currentStep?.data) return null;
    const { equation, variable, hints } = currentStep.data;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: `${r.gap + 4}px`,
          animation: "sgFadeUp 0.5s ease-out",
          padding: `${r.pad}px`,
        }}
      >
        <div
          style={{
            padding: `${r.pad}px ${r.pad + 8}px`,
            borderRadius: `${r.radius + 4}px`,
            background: `linear-gradient(135deg, ${DS.lightPurple}50, ${DS.lightOrange}50)`,
            border: `2px solid ${DS.indigo}25`,
            animation: "sgGlow 2.5s infinite",
            maxWidth: "100%",
            boxSizing: "border-box" as const,
            textAlign: "center" as const,
          }}
        >
          <MathText
            expr={equation}
            style={{
              fontSize: `${r.mathSizeLg}px`,
              color: DS.dark,
              fontWeight: 700,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: `${r.gapSm}px`,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: `${r.mathSizeLg - 4}px`,
              fontWeight: 700,
              color: DS.indigo,
              fontFamily: DS.font,
              fontStyle: "italic",
            }}
          >
            {variable} =
          </span>
          <input
            type="text"
            value={practiceAnswer}
            onChange={(e) => {
              setPracticeAnswer(e.target.value);
              setPracticeResult(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") checkAnswer();
            }}
            placeholder="?"
            style={{
              width: `${r.inputW + 30}px`,
              padding: `${r.inputPad}px ${r.pad}px`,
              borderRadius: `${r.radius}px`,
              border: `2px solid ${practiceResult === "correct" ? "#2ECC71" : practiceResult === "incorrect" ? DS.error : DS.lightGray}`,
              fontSize: `${r.inputFont + 2}px`,
              textAlign: "center" as const,
              outline: "none",
              background: DS.white,
              color: DS.dark,
              transition: "all 0.3s ease",
              animation:
                practiceResult === "incorrect"
                  ? "sgShake 0.5s ease-out"
                  : undefined,
              fontFamily: DS.font,
              fontWeight: 600,
            }}
          />
          <ContainedBtn onClick={checkAnswer}>
            <Check size={r.iconSm} /> Check
          </ContainedBtn>
        </div>
        {practiceResult === "correct" && (
          <div
            style={{
              padding: `${r.padSm}px ${r.pad}px`,
              borderRadius: r.radiusPill + "px",
              background: "#2ECC7115",
              border: "2px solid #2ECC7140",
              color: "#2ECC71",
              fontWeight: 600,
              animation: "sgBounce 0.6s ease-out",
              fontSize: `${r.bodySize}px`,
              fontFamily: DS.font,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            🎉 Correct!
          </div>
        )}
        {practiceResult === "incorrect" && (
          <div
            style={{
              padding: `${r.padSm}px ${r.pad}px`,
              borderRadius: r.radiusPill + "px",
              background: `${DS.error}12`,
              border: `2px solid ${DS.error}35`,
              color: DS.error,
              fontWeight: 600,
              animation: "sgShake 0.5s ease-out",
              fontSize: `${r.bodySize}px`,
              fontFamily: DS.font,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <X size={r.iconSm} /> Try again!
          </div>
        )}
        {hints && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: `${r.gapSm}px`,
              width: "100%",
              maxWidth: "380px",
              alignItems: "center",
            }}
          >
            <OutlinedBtn
              onClick={() => {
                setShowHints(true);
                setCurrentHintIndex((p) => Math.min(p + 1, hints.length));
              }}
              color={DS.orange}
              disabled={showHints && currentHintIndex >= hints.length}
            >
              💡{" "}
              {showHints && currentHintIndex >= hints.length
                ? "All shown"
                : showHints
                  ? "Next Hint"
                  : "Hint"}
            </OutlinedBtn>
            {showHints &&
              hints.slice(0, currentHintIndex).map((h: string, i: number) => (
                <div
                  key={i}
                  style={{
                    padding: `${r.padSm}px ${r.pad}px`,
                    borderRadius: `${r.radiusSm}px`,
                    background: DS.lightOrange,
                    border: `1px solid ${DS.orange}20`,
                    fontSize: `${r.smallSize}px`,
                    color: DS.dark,
                    animation: "sgSlideDown 0.35s ease-out",
                    width: "100%",
                    fontFamily: DS.font,
                    boxSizing: "border-box" as const,
                  }}
                >
                  💡 {h}
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  // ==================== RENDER REAL WORLD ====================
  const renderRealWorld = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: `${r.gap + 4}px`,
        animation: "sgFadeUp 0.5s ease-out",
        padding: `${r.pad}px`,
      }}
    >
      <div
        style={{
          fontSize: `${r.introIconSize * 0.75}px`,
          animation: "sgFloat 4s ease-in-out infinite",
        }}
      >
        ⚖️
      </div>
      <div
        style={{
          fontSize: `${r.headingSize}px`,
          fontWeight: 700,
          color: DS.dark,
          textAlign: "center",
          fontFamily: DS.font,
        }}
      >
        {currentStep?.title}
      </div>
      <div
        style={{
          fontSize: `${r.bodySize}px`,
          color: DS.dark,
          textAlign: "center",
          maxWidth: "480px",
          lineHeight: 1.7,
          fontFamily: DS.font,
          opacity: 0.7,
        }}
      >
        {currentStep?.description}
      </div>
      {currentStep?.id === 21 && (
        <div
          style={{
            padding: `${r.pad}px`,
            borderRadius: `${r.radius + 2}px`,
            background: DS.white,
            border: `1.5px solid ${DS.lightGray}`,
            boxShadow: `0 4px 20px ${DS.indigo}08`,
            textAlign: "center" as const,
            fontFamily: DS.font,
            width: "100%",
            maxWidth: "460px",
            boxSizing: "border-box" as const,
          }}
        >
          <MathText
            expr="4000 + 650m = 5050 + 500m"
            style={{
              fontSize: `${r.mathSize}px`,
              color: DS.dark,
              fontWeight: 600,
            }}
          />
          <div
            style={{
              marginTop: `${r.gap}px`,
              padding: `${r.padSm}px ${r.pad}px`,
              borderRadius: `${r.radiusSm}px`,
              background: `linear-gradient(135deg, ${DS.lightPurple}40, ${DS.lightOrange}60)`,
              fontSize: `${r.smallSize}px`,
              color: DS.dark,
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            Brahmagupta's formula:{" "}
            <span style={{ color: DS.indigo, fontWeight: 700 }}>
              m = 7 months
            </span>
          </div>
        </div>
      )}
    </div>
  );

  // ==================== RENDER HANDS ON ====================
  const renderHandsOn = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: `${r.gap + 4}px`,
        animation: "sgFadeUp 0.5s ease-out",
        padding: `${r.pad}px`,
      }}
    >
      <div
        style={{
          fontSize: `${r.headingSize}px`,
          fontWeight: 700,
          color: DS.dark,
          fontFamily: DS.font,
          textAlign: "center",
        }}
      >
        Build: <span style={{ color: DS.indigo }}>A</span>x +{" "}
        <span style={{ color: DS.indigo }}>B</span> ={" "}
        <span style={{ color: DS.orange }}>C</span>x +{" "}
        <span style={{ color: DS.orange }}>D</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: r.bp === "xs" ? "4px" : "6px",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: `${r.pad}px`,
          borderRadius: `${r.radius + 2}px`,
          background: DS.white,
          border: `1.5px solid ${DS.lightGray}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          width: "100%",
          maxWidth: "420px",
          boxSizing: "border-box" as const,
        }}
      >
        <input
          value={customA}
          onChange={(e) => {
            setCustomA(e.target.value);
            setCustomSolved(false);
          }}
          style={{
            width: `${r.inputW}px`,
            padding: `${r.inputPad}px`,
            borderRadius: `${r.radiusSm}px`,
            border: `2px solid ${DS.lightGray}`,
            fontSize: `${r.inputFont}px`,
            textAlign: "center" as const,
            outline: "none",
            fontWeight: 600,
            fontFamily: DS.font,
            background: `${DS.lightPurple}40`,
            transition: "all 0.3s ease",
            boxSizing: "border-box" as const,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = DS.indigo;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = DS.lightGray;
          }}
        />
        <span
          style={{
            fontSize: `${r.bodySize + 1}px`,
            color: DS.indigo,
            fontStyle: "italic",
            fontWeight: 600,
          }}
        >
          x +
        </span>
        <input
          value={customB}
          onChange={(e) => {
            setCustomB(e.target.value);
            setCustomSolved(false);
          }}
          style={{
            width: `${r.inputW}px`,
            padding: `${r.inputPad}px`,
            borderRadius: `${r.radiusSm}px`,
            border: `2px solid ${DS.lightGray}`,
            fontSize: `${r.inputFont}px`,
            textAlign: "center" as const,
            outline: "none",
            fontWeight: 600,
            fontFamily: DS.font,
            background: `${DS.lightPurple}40`,
            transition: "all 0.3s ease",
            boxSizing: "border-box" as const,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = DS.indigo;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = DS.lightGray;
          }}
        />
        <span
          style={{
            fontSize: `${r.mathSize + 4}px`,
            fontWeight: 800,
            background: `linear-gradient(135deg, ${DS.indigo}, ${DS.orange})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: `0 ${r.bp === "xs" ? "4" : "8"}px`,
          }}
        >
          =
        </span>
        <input
          value={customC}
          onChange={(e) => {
            setCustomC(e.target.value);
            setCustomSolved(false);
          }}
          style={{
            width: `${r.inputW}px`,
            padding: `${r.inputPad}px`,
            borderRadius: `${r.radiusSm}px`,
            border: `2px solid ${DS.lightGray}`,
            fontSize: `${r.inputFont}px`,
            textAlign: "center" as const,
            outline: "none",
            fontWeight: 600,
            fontFamily: DS.font,
            background: `${DS.lightOrange}80`,
            transition: "all 0.3s ease",
            boxSizing: "border-box" as const,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = DS.orange;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = DS.lightGray;
          }}
        />
        <span
          style={{
            fontSize: `${r.bodySize + 1}px`,
            color: DS.orange,
            fontStyle: "italic",
            fontWeight: 600,
          }}
        >
          x +
        </span>
        <input
          value={customD}
          onChange={(e) => {
            setCustomD(e.target.value);
            setCustomSolved(false);
          }}
          style={{
            width: `${r.inputW}px`,
            padding: `${r.inputPad}px`,
            borderRadius: `${r.radiusSm}px`,
            border: `2px solid ${DS.lightGray}`,
            fontSize: `${r.inputFont}px`,
            textAlign: "center" as const,
            outline: "none",
            fontWeight: 600,
            fontFamily: DS.font,
            background: `${DS.lightOrange}80`,
            transition: "all 0.3s ease",
            boxSizing: "border-box" as const,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = DS.orange;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = DS.lightGray;
          }}
        />
      </div>
      <ContainedBtn onClick={solveCustom} color={DS.orange}>
        <Zap size={r.iconSm} /> Solve
      </ContainedBtn>
      {customSolved && (
        <div
          style={{
            padding: `${r.pad}px`,
            borderRadius: `${r.radius}px`,
            background: DS.white,
            border: `2px solid ${customSolution.includes("No") ? DS.error : customSolution.includes("Inf") ? DS.orange : DS.indigo}30`,
            animation: "sgBounce 0.5s ease-out",
            textAlign: "center" as const,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            width: "100%",
            maxWidth: "400px",
            boxSizing: "border-box" as const,
          }}
        >
          <div
            style={{
              fontSize: `${r.tinySize}px`,
              color: DS.gray,
              fontFamily: DS.font,
              marginBottom: "4px",
              fontWeight: 500,
              textTransform: "uppercase" as const,
              letterSpacing: "0.5px",
            }}
          >
            x = (D – B) / (A – C)
          </div>
          <div
            style={{
              fontSize: `${r.headingSize}px`,
              fontWeight: 700,
              fontFamily: DS.font,
              color: customSolution.includes("No")
                ? DS.error
                : customSolution.includes("Inf")
                  ? DS.orange
                  : DS.indigo,
              wordBreak: "break-word" as const,
            }}
          >
            {customSolution}
          </div>
        </div>
      )}
      <div
        style={{
          padding: `${r.padSm}px ${r.pad}px`,
          borderRadius: `${r.radius}px`,
          background: DS.lightOrange,
          border: `1px solid ${DS.orange}15`,
          fontSize: `${r.smallSize}px`,
          color: DS.dark,
          textAlign: "center" as const,
          maxWidth: "400px",
          lineHeight: 1.6,
          fontFamily: DS.font,
          width: "100%",
          boxSizing: "border-box" as const,
        }}
      >
        💡 Try A = C to see what happens!
      </div>
    </div>
  );

  // ==================== RENDER CONTENT ====================
  const renderContent = () => {
    if (!currentStep) return null;
    if (currentStep.mode === "learn") {
      if (currentStep.type === "intro") return renderIntro();
      if (currentStep.data?.exampleIndex !== undefined) {
        const ex = examples[currentStep.data.exampleIndex];
        if (ex) return renderWalkthrough(ex);
      }
      return renderStrategy();
    }
    if (currentStep.mode === "practice") return renderPractice();
    if (currentStep.mode === "real_world") return renderRealWorld();
    if (currentStep.mode === "hands_on") return renderHandsOn();
    return null;
  };

  // ==================== MAIN RENDER ====================
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: `${config.width}px`,
        minHeight: r.bp === "xs" ? "auto" : `${config.height}px`,
        display: "flex",
        flexDirection: "column",
        background: DS.offWhite,
        borderRadius: r.bp === "xs" ? "16px" : "24px",
        overflow: "hidden",
        boxShadow:
          "0 20px 60px rgba(74,77,201,0.08), 0 0 0 1px rgba(74,77,201,0.06)",
        fontFamily: DS.font,
        position: "relative",
        boxSizing: "border-box" as const,
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{
          padding: `${r.headerPadY}px ${r.headerPadX}px`,
          background: `linear-gradient(135deg, ${DS.purple}, ${DS.orangeGrad})`,
          color: DS.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-30px",
            right: "-30px",
            width: r.bp === "xs" ? "60px" : "100px",
            height: r.bp === "xs" ? "60px" : "100px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: r.bp === "xs" ? "8px" : "12px",
            zIndex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: r.bp === "xs" ? "32px" : "40px",
              height: r.bp === "xs" ? "32px" : "40px",
              borderRadius: r.bp === "xs" ? "8px" : "12px",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: r.bp === "xs" ? "18px" : "22px" }}>
              ⚖️
            </span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: `${r.titleSize + 1}px`,
                fontWeight: 700,
                whiteSpace: "nowrap" as const,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Solving Equations
            </div>
            <div
              style={{
                fontSize: `${r.tinySize}px`,
                opacity: 0.8,
                fontWeight: 400,
                whiteSpace: "nowrap" as const,
              }}
            >
              Variables on Both Sides
            </div>
          </div>
        </div>
        {config.showStepIndicator && (
          <div
            style={{
              padding: `4px ${r.pad}px`,
              borderRadius: r.radiusPill + "px",
              background: "rgba(255,255,255,0.18)",
              fontSize: `${r.tinySize + 1}px`,
              fontWeight: 600,
              zIndex: 1,
              flexShrink: 0,
              whiteSpace: "nowrap" as const,
            }}
          >
            {currentStepIndex + 1}/{filteredSteps.length}
          </div>
        )}
      </div>

      {/* ===== MODE TABS ===== */}
      {config.showModeSelector && (
        <div
          style={{
            display: "flex",
            gap: "3px",
            padding: `${r.padSm}px ${r.padSm + 2}px`,
            background: DS.white,
            borderBottom: `1px solid ${DS.lightGray}`,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch" as any,
            scrollbarWidth: "none" as any,
            msOverflowStyle: "none" as any,
          }}
        >
          {config.enabledModes.map((mode) => {
            const mc = modeConf[mode];
            const Icon = mc.icon;
            const active = mode === selectedMode;
            return (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: r.bp === "xs" ? "4px" : "6px",
                  padding: `${r.padSm}px ${r.bp === "xs" ? "10" : "16"}px`,
                  borderRadius: r.radiusPill + "px",
                  border: active
                    ? `2px solid ${mc.color}35`
                    : "2px solid transparent",
                  cursor: "pointer",
                  background: active ? `${mc.bg}80` : "transparent",
                  color: active ? mc.color : DS.gray,
                  fontWeight: active ? 700 : 500,
                  fontSize: `${r.bp === "xs" ? 11 : r.bodySize}px`,
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap" as const,
                  fontFamily: DS.font,
                  flexShrink: 0,
                }}
                onMouseOver={(e) => {
                  if (!active) e.currentTarget.style.background = `${mc.bg}40`;
                }}
                onMouseOut={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon size={r.iconSm} />
                {r.showModeLabel ? mc.label : null}
              </button>
            );
          })}
        </div>
      )}

      {/* ===== STEP DESCRIPTION ===== */}
      {currentStep && (
        <div
          style={{
            padding: `${r.padSm + 2}px ${r.headerPadX}px`,
            borderBottom: `1px solid ${DS.lightGray}`,
            background: DS.white,
          }}
        >
          <div
            style={{
              fontSize: `${r.titleSize}px`,
              fontWeight: 700,
              color: DS.dark,
              fontFamily: DS.font,
            }}
          >
            {currentStep.title}
          </div>
          <div
            style={{
              fontSize: `${r.smallSize}px`,
              color: DS.gray,
              marginTop: "2px",
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            {currentStep.description}
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div
        style={{
          flex: 1,
          padding: `${r.padSm}px`,
          overflow: "auto",
          position: "relative",
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "translateY(16px)" : "translateY(0)",
          transition: "all 0.3s ease",
        }}
      >
        <GeoShapes
          variant={
            selectedMode === "real_world" || selectedMode === "hands_on"
              ? "orange"
              : "purple"
          }
        />
        <div style={{ position: "relative", zIndex: 1 }}>{renderContent()}</div>
      </div>

      {/* ===== NAVIGATION ===== */}
      {config.showNavigation && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `${r.padSm + 2}px ${r.headerPadX}px`,
            borderTop: `1px solid ${DS.lightGray}`,
            background: DS.white,
            gap: `${r.gapSm}px`,
          }}
        >
          <OutlinedBtn
            onClick={() => navigateStep("prev")}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft size={r.iconMd} />
            {r.bp !== "xs" && " Prev"}
          </OutlinedBtn>
          <div
            style={{
              display: "flex",
              gap: r.bp === "xs" ? "4px" : "6px",
              alignItems: "center",
              flexShrink: 1,
              overflow: "hidden",
              justifyContent: "center",
            }}
          >
            {filteredSteps.map((_, i) => (
              <div
                key={i}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentStepIndex(i);
                      setTimeout(() => setIsTransitioning(false), 350);
                    }, 200);
                  }
                }}
                style={{
                  width:
                    i === currentStepIndex
                      ? r.bp === "xs"
                        ? "16px"
                        : "24px"
                      : r.bp === "xs"
                        ? "6px"
                        : "8px",
                  height: r.bp === "xs" ? "6px" : "8px",
                  borderRadius: "4px",
                  background:
                    i === currentStepIndex
                      ? `linear-gradient(90deg, ${DS.indigo}, ${DS.orange})`
                      : DS.lightGray,
                  transition: "all 0.35s ease",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
          <ContainedBtn
            onClick={() => navigateStep("next")}
            disabled={currentStepIndex === filteredSteps.length - 1}
          >
            {r.bp !== "xs" && "Next "}
            <ChevronRight size={r.iconMd} />
          </ContainedBtn>
        </div>
      )}
    </div>
  );
};

export default EquationSolverTool;
