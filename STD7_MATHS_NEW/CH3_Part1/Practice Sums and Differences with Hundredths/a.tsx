// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: hundredths_arithmetic_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Check,
  X,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Star,
  Award,
  Zap,
  Plus,
} from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "real_world" | "hands_on";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface ProblemDef {
  id: string;
  label: string;
  type: "addition" | "subtraction";
  op1: [number, number, number];
  op2: [number, number, number];
  answer: [number, number, number];
  carries: [number, number, number];
  hint: string;
  fractionDisplay: string;
}

interface HundredthsArithmeticToolProps {
  props?: {
    width?: number;
    height?: number;
    themeColor?: string;
    darkMode?: boolean;
    additionalProps?: {
      problems?: ProblemDef[];
      showHints?: boolean;
      showProgress?: boolean;
      title?: string;
      subtitle?: string;
    };
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  // Primary
  primary: "#4A4DC9",
  primaryDark: "#533086",
  accent: "#FF7212",
  accentDark: "#FC9145",

  // Gradient
  gradientPrimary:
    "linear-gradient(135deg, #533086 0%, #4A4DC9 50%, #FC9145 100%)",
  gradientAccent: "linear-gradient(135deg, #FF7212 0%, #FC9145 100%)",
  gradientSubtle: "linear-gradient(135deg, #533086 0%, #4A4DC9 100%)",
  gradientHeader:
    "linear-gradient(135deg, #533086 0%, #4A4DC9 60%, #FC9145 100%)",

  // Tints
  primaryTint: "#C1C1EA",
  accentTint: "#FFF3E4",
  primaryTintLight: "#E8E8F5",
  accentTintLight: "#FFF9F0",

  // Grays
  gray900: "#4E4E4E",
  gray500: "#CACACA",
  gray300: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",

  // Semantic
  success: "#2DBE6D",
  successLight: "#E3F9EC",
  successDark: "#1A9E54",
  error: "#E5453F",
  errorLight: "#FDE8E7",
  errorDark: "#C7312C",
  warning: "#FC9145",
  warningLight: "#FFF3E4",

  // Typography
  fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  monoFont: "'JetBrains Mono', 'Fira Code', monospace",

  // Spacing
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusPill: 100,

  // Shadows
  shadowSm: "0 2px 8px rgba(74, 77, 201, 0.08)",
  shadowMd: "0 4px 20px rgba(74, 77, 201, 0.12)",
  shadowLg: "0 12px 40px rgba(83, 48, 134, 0.15)",
  shadowXl: "0 20px 60px rgba(83, 48, 134, 0.18)",
  shadowAccent: "0 4px 16px rgba(255, 114, 18, 0.25)",
  shadowPrimary: "0 4px 16px rgba(74, 77, 201, 0.25)",
};

// ==================== DEFAULT PROBLEMS ====================

const DEFAULT_PROBLEMS: ProblemDef[] = [
  {
    id: "a",
    label: "(a)",
    type: "addition",
    fractionDisplay: "3/10 + 3 4/100",
    op1: [0, 3, 0],
    op2: [3, 0, 4],
    answer: [3, 3, 4],
    carries: [0, 0, 0],
    hint: "Convert 3/10 to 0.30 (thirty hundredths), then add 3.04. Line up the decimal points!",
  },
  {
    id: "b",
    label: "(b)",
    type: "addition",
    fractionDisplay: "9 5/10 7/100 + 2 1/10 3/100",
    op1: [9, 5, 7],
    op2: [2, 1, 3],
    answer: [1, 7, 0],
    carries: [1, 0, 0],
    hint: "Add hundredths first: 7+3=10. Write 0, carry 1 tenth. Then tenths: 5+1+1=7. Units: 9+2=11.",
  },
  {
    id: "c",
    label: "(c)",
    type: "addition",
    fractionDisplay: "15 6/10 4/100 + 14 3/10 6/100",
    op1: [5, 6, 4],
    op2: [4, 3, 6],
    answer: [0, 0, 0],
    carries: [1, 1, 1],
    hint: "Hundredths: 4+6=10, write 0, carry 1. Tenths: 6+3+1=10, write 0, carry 1. Units: 5+4+1=10, write 0, carry 1. Tens: 1+1+1=3. Answer is 30.00!",
  },
  {
    id: "d",
    label: "(d)",
    type: "subtraction",
    fractionDisplay: "7 7/100 − 4 4/100",
    op1: [7, 0, 7],
    op2: [4, 0, 4],
    answer: [3, 0, 3],
    carries: [0, 0, 0],
    hint: "Hundredths: 7−4=3. Tenths: 0−0=0. Units: 7−4=3. Answer is 3.03.",
  },
  {
    id: "e",
    label: "(e)",
    type: "subtraction",
    fractionDisplay: "8 6/100 − 5 3/100",
    op1: [8, 0, 6],
    op2: [5, 0, 3],
    answer: [3, 0, 3],
    carries: [0, 0, 0],
    hint: "Hundredths: 6−3=3. Tenths: 0−0=0. Units: 8−5=3. Answer is 3.03.",
  },
  {
    id: "f",
    label: "(f)",
    type: "subtraction",
    fractionDisplay: "12 6/10 2/100 − 9/10 9/100",
    op1: [2, 6, 2],
    op2: [0, 9, 9],
    answer: [1, 6, 3],
    carries: [1, 1, 0],
    hint: "Double borrowing! Hundredths: 2<9, borrow from tenths: 12−9=3. Tenths: 5<9 (was 6, gave 1), borrow from units: 15−9=6. Units: 1−0=1. Tens: 1−0=1. Answer: 11.63.",
  },
];

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
const easeOutBounce = (t: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

// ==================== KEYFRAMES ====================

const keyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInScale {
        from { opacity: 0; transform: scale(0.85); }
        to { opacity: 1; transform: scale(1); }
    }
    @keyframes popIn {
        0% { transform: scale(0); opacity: 0; }
        60% { transform: scale(1.15); }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.04); }
    }
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        15% { transform: translateX(-5px) rotate(-1deg); }
        30% { transform: translateX(5px) rotate(1deg); }
        45% { transform: translateX(-4px); }
        60% { transform: translateX(4px); }
        75% { transform: translateX(-2px); }
    }
    @keyframes celebrateBounce {
        0% { transform: translateY(0) scale(1); }
        25% { transform: translateY(-24px) scale(1.08); }
        50% { transform: translateY(0) scale(1); }
        75% { transform: translateY(-8px) scale(1.03); }
        100% { transform: translateY(0) scale(1); }
    }
    @keyframes confettiDrop {
        0% { transform: translateY(-30px) rotate(0deg) scale(1); opacity: 1; }
        100% { transform: translateY(80px) rotate(720deg) scale(0.3); opacity: 0; }
    }
    @keyframes slideRight {
        from { opacity: 0; transform: translateX(32px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideLeft {
        from { opacity: 0; transform: translateX(-32px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(74, 77, 201, 0); }
        50% { box-shadow: 0 0 0 8px rgba(74, 77, 201, 0.12); }
    }
    @keyframes floatUp {
        0% { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-36px) scale(1.4); }
    }
    @keyframes starSpin {
        from { transform: rotate(0deg) scale(0); opacity: 0; }
        50% { opacity: 1; }
        to { transform: rotate(360deg) scale(1); opacity: 1; }
    }
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes borderGlow {
        0%, 100% { border-color: #C1C1EA; }
        50% { border-color: #4A4DC9; }
    }
    @keyframes rippleOut {
        0% { transform: scale(0.6); opacity: 0.4; }
        100% { transform: scale(2.5); opacity: 0; }
    }
    @keyframes dotBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.25); }
    }
`;

// ==================== SOLUTION COMPUTATION ====================

interface FullSolution {
  row1: number[];
  row2: number[];
  answerRow: number[];
  carryRow: number[];
  hasTens: boolean;
}

function computeSolution(p: ProblemDef): FullSolution {
  if (p.id === "a") {
    return {
      row1: [0, 0, 3, 0],
      row2: [0, 3, 0, 4],
      answerRow: [0, 3, 3, 4],
      carryRow: [0, 0, 0, 0],
      hasTens: false,
    };
  }
  if (p.id === "b") {
    return {
      row1: [0, 9, 5, 7],
      row2: [0, 2, 1, 3],
      answerRow: [1, 1, 7, 0],
      carryRow: [0, 1, 1, 0],
      hasTens: true,
    };
  }
  if (p.id === "c") {
    return {
      row1: [1, 5, 6, 4],
      row2: [1, 4, 3, 6],
      answerRow: [3, 0, 0, 0],
      carryRow: [1, 1, 1, 0],
      hasTens: true,
    };
  }
  if (p.id === "d") {
    return {
      row1: [0, 7, 0, 7],
      row2: [0, 4, 0, 4],
      answerRow: [0, 3, 0, 3],
      carryRow: [0, 0, 0, 0],
      hasTens: false,
    };
  }
  if (p.id === "e") {
    return {
      row1: [0, 8, 0, 6],
      row2: [0, 5, 0, 3],
      answerRow: [0, 3, 0, 3],
      carryRow: [0, 0, 0, 0],
      hasTens: false,
    };
  }
  if (p.id === "f") {
    return {
      row1: [1, 2, 6, 2],
      row2: [0, 0, 9, 9],
      answerRow: [1, 1, 6, 3],
      carryRow: [0, 1, 1, 0],
      hasTens: true,
    };
  }
  return {
    row1: [0, 0, 0, 0],
    row2: [0, 0, 0, 0],
    answerRow: [0, 0, 0, 0],
    carryRow: [0, 0, 0, 0],
    hasTens: false,
  };
}

// ==================== MAIN COMPONENT ====================

const HundredthsArithmeticTool: React.FC<HundredthsArithmeticToolProps> = ({
  props = {},
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const additionalProps = props.additionalProps || {};
  const problems = additionalProps.problems || DEFAULT_PROBLEMS;
  const showHints = additionalProps.showHints ?? true;
  const showProgress = additionalProps.showProgress ?? true;
  const title = additionalProps.title ?? "Figure it Out";
  const subtitle =
    additionalProps.subtitle ?? "Sums & Differences with Hundredths";

  // ─── STATE ───
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const [userInputs, setUserInputs] = useState<{
    [key: string]: (string | null)[];
  }>({});
  const [feedback, setFeedback] = useState<{
    [key: string]: (boolean | null)[];
  }>({});
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(
    new Set(),
  );
  const [showHint, setShowHint] = useState<{ [key: string]: boolean }>({});
  const [animatingCell, setAnimatingCell] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<
    { x: number; color: string; delay: number; size: number }[]
  >([]);
  const [mounted, setMounted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [hoverBtn, setHoverBtn] = useState<string | null>(null);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const currentProblem = problems[currentProblemIdx];
  const solution = useMemo(
    () => computeSolution(currentProblem),
    [currentProblem],
  );

  const columns = solution.hasTens
    ? ["Tens", "Units", "Tenths", "Hundredths"]
    : ["Units", "Tenths", "Hundredths"];
  const dataStartIdx = solution.hasTens ? 0 : 1;

  // ─── INIT ───
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.id = "singularity-hundredths-keyframes";
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    setTimeout(() => setMounted(true), 80);
    return () => {
      const existing = document.getElementById(
        "singularity-hundredths-keyframes",
      );
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  useEffect(() => {
    if (!userInputs[currentProblem.id]) {
      const numCols = columns.length;
      setUserInputs((prev) => ({
        ...prev,
        [currentProblem.id]: Array(numCols).fill(null),
      }));
      setFeedback((prev) => ({
        ...prev,
        [currentProblem.id]: Array(numCols).fill(null),
      }));
    }
  }, [currentProblem.id, columns.length]);

  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: currentProblemIdx + 1,
        totalSteps: problems.length,
        isPaused: true,
        currentMode: "practice",
      });
    }
  }, [currentProblemIdx]);

  // ─── HANDLERS ───
  const getAnswerDigit = useCallback(
    (colIdx: number): number => {
      return solution.answerRow[dataStartIdx + colIdx];
    },
    [solution, dataStartIdx],
  );

  const handleInput = useCallback(
    (colIdx: number, value: string) => {
      const pid = currentProblem.id;
      const digit = value.replace(/[^0-9]/g, "").slice(-1);

      setUserInputs((prev) => {
        const arr = [...(prev[pid] || Array(columns.length).fill(null))];
        arr[colIdx] = digit || null;
        return { ...prev, [pid]: arr };
      });

      if (digit) {
        const expected = getAnswerDigit(colIdx);
        const isCorrect = parseInt(digit) === expected;
        const cellKey = `${pid}-${colIdx}`;
        setAnimatingCell(cellKey);
        setTimeout(() => setAnimatingCell(null), 500);

        setFeedback((prev) => {
          const arr = [...(prev[pid] || Array(columns.length).fill(null))];
          arr[colIdx] = isCorrect;
          return { ...prev, [pid]: arr };
        });

        if (isCorrect) {
          setTimeout(() => {
            for (let i = colIdx - 1; i >= 0; i--) {
              const ref = inputRefs.current[`${pid}-${i}`];
              const currentInputs = userInputs[pid] || [];
              if (!currentInputs[i] && ref) {
                ref.focus();
                break;
              }
            }
          }, 300);
        }

        setTimeout(() => {
          setFeedback((prev) => {
            const fb = prev[pid] || [];
            const allCorrect =
              fb.length === columns.length && fb.every((v) => v === true);
            if (allCorrect && !completedProblems.has(pid)) {
              setCompletedProblems((prev2) => new Set([...prev2, pid]));
              const newCompleted = new Set([...completedProblems, pid]);
              if (newCompleted.size === problems.length) {
                triggerCelebration();
              }
            }
            return prev;
          });
        }, 400);
      } else {
        setFeedback((prev) => {
          const arr = [...(prev[pid] || Array(columns.length).fill(null))];
          arr[colIdx] = null;
          return { ...prev, [pid]: arr };
        });
      }
    },
    [
      currentProblem,
      columns.length,
      getAnswerDigit,
      completedProblems,
      problems.length,
      userInputs,
    ],
  );

  const triggerCelebration = () => {
    setShowCelebration(true);
    const pieces = Array.from({ length: 24 }, (_, i) => ({
      x: Math.random() * 100,
      color: [
        DS.primary,
        DS.accent,
        DS.primaryTint,
        DS.accentDark,
        DS.success,
        "#533086",
      ][i % 6],
      delay: Math.random() * 1,
      size: 6 + Math.random() * 8,
    }));
    setConfettiPieces(pieces);
    setTimeout(() => setShowCelebration(false), 4500);
  };

  const navigateProblem = (direction: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentProblemIdx((prev) => {
        const next = prev + direction;
        if (next < 0) return problems.length - 1;
        if (next >= problems.length) return 0;
        return next;
      });
      setShowHint({});
      setTimeout(() => setTransitioning(false), 50);
    }, 220);
  };

  const resetProblem = (pid: string) => {
    setUserInputs((prev) => ({
      ...prev,
      [pid]: Array(columns.length).fill(null),
    }));
    setFeedback((prev) => ({
      ...prev,
      [pid]: Array(columns.length).fill(null),
    }));
    setCompletedProblems((prev) => {
      const next = new Set(prev);
      next.delete(pid);
      return next;
    });
  };

  const isAllCorrectForCurrent = () => {
    const fb = feedback[currentProblem.id] || [];
    return fb.length === columns.length && fb.every((v) => v === true);
  };

  // ─── SINGULARITY BUTTON COMPONENT ───
  const SingularityBtn = ({
    id,
    variant,
    color,
    label,
    onClick,
    icon,
    disabled,
    fullWidth,
  }: {
    id: string;
    variant: "contained" | "outlined" | "text";
    color: "primary" | "accent" | "gray";
    label: string | React.ReactNode;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    fullWidth?: boolean;
  }) => {
    const isHover = hoverBtn === id && !disabled;
    const isPressed = pressedBtn === id && !disabled;

    const palette = {
      primary: {
        bg: DS.primary,
        hover: "#3A3DB8",
        text: DS.white,
        border: DS.primary,
        tint: DS.primaryTintLight,
      },
      accent: {
        bg: DS.accent,
        hover: "#E5650F",
        text: DS.white,
        border: DS.accent,
        tint: DS.accentTint,
      },
      gray: {
        bg: DS.gray300,
        hover: DS.gray500,
        text: DS.gray900,
        border: DS.gray500,
        tint: DS.gray100,
      },
    }[color];

    let bg: string, textColor: string, border: string, shadow: string;

    if (disabled) {
      bg = variant === "contained" ? DS.gray300 : "transparent";
      textColor = DS.gray500;
      border = variant === "outlined" ? DS.gray300 : "transparent";
      shadow = "none";
    } else if (variant === "contained") {
      bg = isPressed ? palette.hover : isHover ? palette.hover : palette.bg;
      textColor = palette.text;
      border = "transparent";
      shadow = isHover
        ? color === "accent"
          ? DS.shadowAccent
          : DS.shadowPrimary
        : DS.shadowSm;
    } else if (variant === "outlined") {
      bg = isHover ? palette.tint : "transparent";
      textColor = palette.bg;
      border = palette.border;
      shadow = "none";
    } else {
      bg = isHover ? palette.tint : "transparent";
      textColor = palette.bg;
      border = "transparent";
      shadow = "none";
    }

    return (
      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => setHoverBtn(id)}
        onMouseLeave={() => {
          setHoverBtn(null);
          setPressedBtn(null);
        }}
        onMouseDown={() => setPressedBtn(id)}
        onMouseUp={() => setPressedBtn(null)}
        disabled={disabled}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "0 24px",
          height: 40,
          borderRadius: DS.radiusPill,
          border: `2px solid ${border}`,
          background: bg,
          color: textColor,
          fontFamily: DS.fontFamily,
          fontSize: 13,
          fontWeight: 600,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isPressed
            ? "scale(0.96)"
            : isHover
              ? "scale(1.02)"
              : "scale(1)",
          boxShadow: shadow,
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
          width: fullWidth ? "100%" : "auto",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {icon && (
          <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
        )}
        {label}
      </button>
    );
  };

  // ─── GRID CELL STYLES ───
  const gridCellBase: React.CSSProperties = {
    width: 54,
    height: 58,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: DS.monoFont,
    fontSize: 22,
    fontWeight: 600,
    borderRadius: DS.radiusMd,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const staticCellStyle = (delay: number): React.CSSProperties => ({
    ...gridCellBase,
    background: DS.gray100,
    border: `2px solid ${DS.gray300}`,
    color: DS.gray900,
    animation: `fadeInScale 0.35s ease ${delay}s both`,
  });

  const getInputCellStyle = (
    colIdx: number,
    fbVal: boolean | null,
  ): React.CSSProperties => {
    const cellKey = `${currentProblem.id}-${colIdx}`;
    const isAnimating = animatingCell === cellKey;
    let bgColor = DS.white;
    let borderColor = DS.primaryTint;
    let shadowVal = `0 0 0 3px ${DS.primaryTint}40`;

    if (fbVal === true) {
      bgColor = DS.successLight;
      borderColor = DS.success;
      shadowVal = `0 0 0 3px ${DS.success}30`;
    } else if (fbVal === false) {
      bgColor = DS.errorLight;
      borderColor = DS.error;
      shadowVal = `0 0 0 3px ${DS.error}30`;
    }

    return {
      ...gridCellBase,
      background: bgColor,
      border: `2.5px solid ${borderColor}`,
      color: fbVal === false ? DS.error : DS.gray900,
      boxShadow: shadowVal,
      outline: "none",
      cursor: fbVal === true ? "default" : "text",
      textAlign: "center" as const,
      caretColor: DS.primary,
      animation: isAnimating
        ? fbVal === true
          ? "popIn 0.4s ease"
          : fbVal === false
            ? "shake 0.4s ease"
            : "none"
        : "none",
      padding: 0,
    };
  };

  const decimalDot: React.CSSProperties = {
    fontSize: 30,
    fontWeight: 800,
    fontFamily: DS.monoFont,
    color: DS.primary,
    marginLeft: -2,
    marginRight: -2,
    width: 14,
    textAlign: "center",
    userSelect: "none",
  };

  // ─── RENDER GRID ───
  const renderProblemGrid = () => {
    const pid = currentProblem.id;
    const fb = feedback[pid] || [];
    const inputs = userInputs[pid] || [];
    const isAdd = currentProblem.type === "addition";
    const sol = solution;
    const decIdx = solution.hasTens ? 2 : 1;

    const Dot = ({ i }: { i: number }) =>
      i === decIdx ? <div style={decimalDot}>.</div> : null;

    const DotSpacer = ({ i }: { i: number }) =>
      i === decIdx ? <div style={{ width: 14 }} /> : null;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 5,
        }}
      >
        {/* Column Headers */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 6,
            alignItems: "center",
          }}
        >
          <div style={{ width: 44 }} />
          {columns.map((col, i) => (
            <React.Fragment key={col}>
              <Dot i={i} />
              <div
                style={{
                  width: 54,
                  textAlign: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: DS.primary,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontFamily: DS.fontFamily,
                  animation: `fadeInUp 0.3s ease ${i * 0.06}s both`,
                  background: DS.primaryTintLight,
                  padding: "4px 0",
                  borderRadius: DS.radiusSm,
                }}
              >
                {col}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Carry/Borrow Row */}
        <div
          style={{
            display: "flex",
            gap: 8,
            minHeight: 26,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 44,
              textAlign: "center",
              fontSize: 9,
              fontWeight: 600,
              color: DS.gray500,
              fontFamily: DS.fontFamily,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {isAdd ? "Carry" : "Borr."}
          </div>
          {columns.map((_, i) => {
            const arrIdx = dataStartIdx + i;
            const carryVal = sol.carryRow[arrIdx];
            const showCarry = carryVal !== 0;
            const shouldReveal =
              showCarry && i < columns.length - 1 && fb[i + 1] === true;

            return (
              <React.Fragment key={i}>
                <Dot i={i} />
                <div
                  style={{
                    width: 54,
                    height: 26,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: DS.monoFont,
                    color: isAdd ? DS.accent : DS.primaryDark,
                    background: shouldReveal
                      ? isAdd
                        ? DS.accentTint
                        : DS.primaryTintLight
                      : "transparent",
                    borderRadius: DS.radiusSm,
                    opacity: shouldReveal ? 1 : 0,
                    transform: shouldReveal
                      ? "scale(1) translateY(0)"
                      : "scale(0.5) translateY(6px)",
                    transition: "all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  {showCarry && (isAdd ? `+${carryVal}` : `−${carryVal}`)}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Operand 1 Row */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 44 }} />
          {columns.map((_, i) => (
            <React.Fragment key={i}>
              <Dot i={i} />
              <div style={staticCellStyle(i * 0.05)}>
                {sol.row1[dataStartIdx + i]}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Operator + Operand 2 Row */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div
            style={{
              width: 44,
              height: 58,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 800,
              fontFamily: DS.monoFont,
              color: isAdd ? DS.primary : DS.accent,
              background: isAdd ? DS.primaryTintLight : DS.accentTint,
              borderRadius: DS.radiusMd,
              animation: "popIn 0.4s ease 0.1s both",
            }}
          >
            {isAdd ? "+" : "−"}
          </div>
          {columns.map((_, i) => (
            <React.Fragment key={i}>
              <Dot i={i} />
              <div style={staticCellStyle(0.1 + i * 0.05)}>
                {sol.row2[dataStartIdx + i]}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            margin: "3px 0",
          }}
        >
          <div style={{ width: 44 }} />
          <div
            style={{
              height: 3,
              borderRadius: 2,
              background: DS.gradientPrimary,
              backgroundSize: "200% 200%",
              animation: "gradientShift 3s ease infinite",
              width: columns.length * 54 + (columns.length - 1) * 8 + 14,
            }}
          />
        </div>

        {/* Answer Row (Input) */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div
            style={{
              width: 44,
              height: 58,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 800,
              fontFamily: DS.monoFont,
              color: DS.primary,
            }}
          >
            =
          </div>
          {columns.map((_, i) => {
            const fbVal = fb[i] ?? null;
            return (
              <React.Fragment key={i}>
                <Dot i={i} />
                <input
                  ref={(el) => {
                    inputRefs.current[`${pid}-${i}`] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={inputs[i] ?? ""}
                  onChange={(e) => handleInput(i, e.target.value)}
                  disabled={fb[i] === true}
                  style={getInputCellStyle(i, fbVal)}
                  onFocus={(e) => e.target.select()}
                />
              </React.Fragment>
            );
          })}
        </div>

        {/* Feedback icons */}
        <div
          style={{
            display: "flex",
            gap: 8,
            minHeight: 22,
            marginTop: 2,
            alignItems: "center",
          }}
        >
          <div style={{ width: 44 }} />
          {columns.map((_, i) => {
            const fbVal = fb[i] ?? null;
            return (
              <React.Fragment key={i}>
                <DotSpacer i={i} />
                <div
                  style={{
                    width: 54,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {fbVal === true && (
                    <Check
                      size={17}
                      color={DS.success}
                      strokeWidth={3}
                      style={{ animation: "popIn 0.3s ease" }}
                    />
                  )}
                  {fbVal === false && (
                    <X
                      size={17}
                      color={DS.error}
                      strokeWidth={3}
                      style={{ animation: "shake 0.3s ease" }}
                    />
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── MAIN RENDER ───
  return (
    <div
      style={{
        fontFamily: DS.fontFamily,
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        background: DS.white,
        borderRadius: DS.radiusXl,
        overflow: "hidden",
        boxShadow: DS.shadowXl,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        border: `1px solid ${DS.gray300}`,
      }}
    >
      {/* ═══ HEADER ═══ */}
      <div
        style={{
          background: DS.gradientHeader,
          backgroundSize: "200% 200%",
          animation: "gradientShift 8s ease infinite",
          padding: "32px 36px 28px",
          color: DS.white,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative geometric shapes from design system */}
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 50,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -15,
            left: "35%",
            width: 0,
            height: 0,
            borderLeft: "30px solid transparent",
            borderRight: "30px solid transparent",
            borderBottom: "52px solid rgba(255,255,255,0.04)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: "15%",
            width: 40,
            height: 40,
            border: "2px solid rgba(255,255,255,0.08)",
            borderRadius: 6,
            transform: "rotate(15deg)",
          }}
        />

        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            opacity: 0.8,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 6,
            animation: "fadeInUp 0.4s ease both",
          }}
        >
          Ganita Prakash · Grade 7 · Chapter 3
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.15,
            animation: "fadeInUp 0.4s ease 0.05s both",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 14,
            margin: "6px 0 0",
            opacity: 0.9,
            fontWeight: 500,
            animation: "fadeInUp 0.4s ease 0.1s both",
          }}
        >
          {subtitle}
        </p>

        {showProgress && (
          <div
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "center",
              gap: 12,
              animation: "fadeInUp 0.4s ease 0.15s both",
            }}
          >
            <div
              style={{
                flex: 1,
                height: 6,
                background: "rgba(255,255,255,0.2)",
                borderRadius: DS.radiusPill,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(completedProblems.size / problems.length) * 100}%`,
                  background: "linear-gradient(90deg, #34d399, #6ee7b7)",
                  borderRadius: DS.radiusPill,
                  transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 0 10px rgba(52, 211, 153, 0.4)",
                }}
              />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.95 }}>
              {completedProblems.size}/{problems.length}
            </span>
          </div>
        )}
      </div>

      {/* ═══ INSTRUCTIONS ═══ */}
      <div
        style={{
          margin: "20px 28px 0",
          padding: "14px 20px",
          background: DS.primaryTintLight,
          borderRadius: DS.radiusLg,
          border: `1.5px solid ${DS.primaryTint}`,
          animation: "fadeInUp 0.5s ease 0.2s both",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: DS.primaryDark,
            fontWeight: 500,
            lineHeight: 1.6,
          }}
        >
          <strong style={{ fontWeight: 700 }}>Instructions:</strong> Solve each
          problem using the column method. Enter digits in the Units, Tenths,
          and Hundredths columns, starting from the <em>right</em> (hundredths
          first). The tool checks each digit as you go!
        </p>
      </div>

      {/* ═══ PROBLEM NAV DOTS ═══ */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          margin: "18px 28px 6px",
          animation: "fadeInUp 0.5s ease 0.25s both",
        }}
      >
        {problems.map((p, idx) => {
          const isActive = idx === currentProblemIdx;
          const isDone = completedProblems.has(p.id);
          return (
            <button
              key={p.id}
              onClick={() => {
                if (idx !== currentProblemIdx) {
                  setTransitioning(true);
                  setTimeout(() => {
                    setCurrentProblemIdx(idx);
                    setShowHint({});
                    setTimeout(() => setTransitioning(false), 50);
                  }, 200);
                }
              }}
              style={{
                width: isActive ? 52 : 40,
                height: 40,
                borderRadius: DS.radiusPill,
                border: isActive
                  ? `2.5px solid ${DS.primary}`
                  : `2px solid ${isDone ? DS.success : DS.gray300}`,
                background: isDone
                  ? DS.success
                  : isActive
                    ? DS.white
                    : DS.gray100,
                color: isDone ? DS.white : isActive ? DS.primary : DS.gray500,
                fontFamily: DS.fontFamily,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isActive
                  ? DS.shadowPrimary
                  : isDone
                    ? `0 2px 8px ${DS.success}30`
                    : "none",
                transform: isActive ? "scale(1.08)" : "scale(1)",
                animation: isActive ? "dotBounce 0.4s ease" : "none",
              }}
            >
              {isDone ? <Check size={16} strokeWidth={3} /> : p.label}
            </button>
          );
        })}
      </div>

      {/* ═══ PROBLEM CARD ═══ */}
      <div
        style={{
          background: DS.white,
          margin: "12px 28px 0",
          borderRadius: DS.radiusLg,
          padding: "28px 28px 24px",
          boxShadow: DS.shadowMd,
          border: `2px solid ${isAllCorrectForCurrent() ? DS.success : DS.gray300}`,
          transition: "all 0.4s ease",
          opacity: transitioning ? 0 : 1,
          transform: transitioning
            ? "translateX(24px) scale(0.98)"
            : "translateX(0) scale(1)",
        }}
      >
        {/* Problem Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                background:
                  currentProblem.type === "addition"
                    ? DS.gradientSubtle
                    : DS.gradientAccent,
                color: DS.white,
                padding: "5px 14px",
                borderRadius: DS.radiusPill,
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {currentProblem.type === "addition"
                ? "＋ Addition"
                : "− Subtraction"}
            </span>
            <span style={{ fontSize: 16, fontWeight: 700, color: DS.gray900 }}>
              Problem {currentProblem.label}
            </span>
          </div>
          <SingularityBtn
            id="reset"
            variant="outlined"
            color="gray"
            label="Reset"
            onClick={() => resetProblem(currentProblem.id)}
            icon={<RotateCcw size={13} />}
          />
        </div>

        {/* Fraction Display */}
        <div
          style={{
            fontSize: 14.5,
            color: DS.gray900,
            marginBottom: 22,
            fontFamily: DS.monoFont,
            fontWeight: 600,
            padding: "10px 16px",
            background: DS.gray100,
            borderRadius: DS.radiusMd,
            border: `1.5px solid ${DS.gray300}`,
            textAlign: "center",
            letterSpacing: "0.02em",
          }}
        >
          {currentProblem.fractionDisplay}
        </div>

        {renderProblemGrid()}

        {/* Completion Badge */}
        {isAllCorrectForCurrent() && (
          <div
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "12px 24px",
              background: DS.successLight,
              borderRadius: DS.radiusPill,
              border: `2px solid ${DS.success}`,
              animation: "celebrateBounce 0.6s ease",
            }}
          >
            <Star
              size={18}
              color={DS.successDark}
              fill={DS.success}
              style={{ animation: "starSpin 0.6s ease" }}
            />
            <span
              style={{ fontSize: 14, fontWeight: 700, color: DS.successDark }}
            >
              Correct! Well done!
            </span>
            <Star
              size={18}
              color={DS.successDark}
              fill={DS.success}
              style={{ animation: "starSpin 0.6s ease 0.2s both" }}
            />
          </div>
        )}

        {/* Hint */}
        {showHints && (
          <div style={{ marginTop: 18 }}>
            <SingularityBtn
              id="hint"
              variant={showHint[currentProblem.id] ? "contained" : "outlined"}
              color="accent"
              label={showHint[currentProblem.id] ? "Hide Hint" : "Show Hint"}
              onClick={() =>
                setShowHint((prev) => ({
                  ...prev,
                  [currentProblem.id]: !prev[currentProblem.id],
                }))
              }
              icon={<Zap size={14} />}
            />
            {showHint[currentProblem.id] && (
              <div
                style={{
                  marginTop: 12,
                  padding: "16px 20px",
                  background: DS.accentTint,
                  borderRadius: DS.radiusMd,
                  border: `1.5px solid ${DS.accentDark}40`,
                  fontSize: 13,
                  color: "#7C3A10",
                  lineHeight: 1.7,
                  fontWeight: 500,
                  animation: "fadeInUp 0.3s ease",
                }}
              >
                💡 {currentProblem.hint}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══ NAVIGATION ═══ */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 28px 8px",
        }}
      >
        <SingularityBtn
          id="prev"
          variant="outlined"
          color="primary"
          label="Previous"
          onClick={() => navigateProblem(-1)}
          icon={<ChevronLeft size={18} />}
        />
        <span style={{ fontSize: 12, color: DS.gray500, fontWeight: 600 }}>
          {currentProblemIdx + 1} of {problems.length}
        </span>
        <SingularityBtn
          id="next"
          variant="contained"
          color="primary"
          label={
            <>
              <span>Next</span>
              <ChevronRight size={18} />
            </>
          }
          onClick={() => navigateProblem(1)}
        />
      </div>

      {/* ═══ TEACHING NOTE ═══ */}
      <div
        style={{
          margin: "12px 28px 24px",
          padding: "14px 20px",
          background: DS.accentTintLight,
          borderRadius: DS.radiusMd,
          border: `1.5px solid ${DS.accentDark}20`,
          fontSize: 12,
          color: "#7C3A10",
          fontWeight: 500,
          lineHeight: 1.6,
        }}
      >
        <strong>📝 Teaching Note:</strong> Present AFTER teaching the column
        method for hundredths arithmetic. Problem (f) requires double borrowing
        — let students struggle before offering hints.
      </div>

      {/* ═══ CELEBRATION ═══ */}
      {showCelebration && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(83, 48, 134, 0.35)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            animation: "fadeInScale 0.3s ease",
          }}
        >
          {confettiPieces.map((piece, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "25%",
                left: `${piece.x}%`,
                width: piece.size,
                height: piece.size,
                borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? 2 : 0,
                background: piece.color,
                animation: `confettiDrop 1.8s ease ${piece.delay}s both`,
                transform: i % 2 === 0 ? "rotate(45deg)" : "none",
              }}
            />
          ))}
          <div
            style={{
              background: DS.white,
              borderRadius: DS.radiusXl,
              padding: "44px 52px",
              textAlign: "center",
              boxShadow: DS.shadowXl,
              animation: "celebrateBounce 0.8s ease",
              border: `3px solid ${DS.primaryTint}`,
            }}
          >
            <div style={{ animation: "starSpin 0.8s ease" }}>
              <Award size={60} color={DS.accent} />
            </div>
            <h2
              style={{
                fontFamily: DS.fontFamily,
                fontSize: 28,
                fontWeight: 800,
                background: DS.gradientPrimary,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                margin: "18px 0 8px",
              }}
            >
              All Problems Solved! 🎉
            </h2>
            <p
              style={{
                fontFamily: DS.fontFamily,
                fontSize: 15,
                color: DS.gray500,
                margin: 0,
                fontWeight: 500,
              }}
            >
              You've mastered sums & differences with hundredths!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HundredthsArithmeticTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
