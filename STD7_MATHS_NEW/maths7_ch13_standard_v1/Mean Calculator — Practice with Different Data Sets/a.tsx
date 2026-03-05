// @ts-ignore - React types resolved by project/bundler
import React, { useState, useEffect, useCallback, useRef } from "react";
// @ts-ignore - lucide-react types resolved by project/bundler
import {
  Check,
  X,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  Plus,
  // @ts-expect-error lucide-react types resolved by project/bundler
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM TOKENS — Singularity Design
// ═══════════════════════════════════════════════════════════════════════════

const DS = {
  // Primary
  indigo: "#4A4DC9",
  orange: "#FF7212",
  // Gradient
  gradientPurple: "#533086",
  gradientOrange: "#FC9145",
  // Neutrals
  dark: "#4E4E4E",
  grey: "#CACACA",
  lightGrey: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  // Tints
  indigoLight: "#C1C1EA",
  orangeLight: "#FFF3E4",
  // Functional
  success: "#2DB562",
  successLight: "#E6F7ED",
  error: "#E5322D",
  errorLight: "#FDECEC",
  // Shadows
  shadowSm: "0 2px 8px rgba(74,77,201,0.08)",
  shadowMd: "0 4px 20px rgba(74,77,201,0.12)",
  shadowLg: "0 8px 40px rgba(74,77,201,0.16)",
  shadowOrange: "0 4px 16px rgba(255,114,18,0.25)",
  // Radius
  radiusPill: 40,
  radiusCard: 20,
  radiusChip: 14,
  radiusInput: 12,
  // Font
  font: "'Poppins', sans-serif",
};

// ═══════════════════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

interface ProblemData {
  id: string;
  title: string;
  emoji: string;
  description: string;
  values: number[];
  correctSum: number;
  correctCount: number;
  correctMean: number;
  meanDisplay: string;
  chipColor: string;
  chipGradient: string;
  note?: string;
}

interface StepState {
  sumInput: string;
  countInput: string;
  meanInput: string;
  sumChecked: boolean;
  countChecked: boolean;
  meanChecked: boolean;
  sumCorrect: boolean;
  countCorrect: boolean;
  meanCorrect: boolean;
  currentStep: number;
}

interface MeanPracticeToolProps {
  props?: {
    width?: number;
    height?: number;
    additionalProps?: { [key: string]: any };
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PROBLEM DATA — Mapped to Singularity palette
// ═══════════════════════════════════════════════════════════════════════════

const PROBLEMS: ProblemData[] = [
  {
    id: "ball",
    title: "Ball Bouncing",
    emoji: "🏏",
    description:
      "Shreyas bounces a ball on his bat. Calculate the average bounces across 8 attempts.",
    values: [6, 2, 9, 5, 4, 6, 3, 5],
    correctSum: 40,
    correctCount: 8,
    correctMean: 5,
    meanDisplay: "5",
    chipColor: DS.indigo,
    chipGradient: `linear-gradient(135deg, ${DS.indigo}, ${DS.gradientPurple})`,
    note: "The mean tells us if every attempt had the same bounces, each would have 5!",
  },
  {
    id: "nikhil",
    title: "Nikhil's Running",
    emoji: "🏃",
    description:
      "Nikhil is training for a 100m race. His times (in seconds) over the past week:",
    values: [17, 18, 17, 16, 19, 17, 18],
    correctSum: 122,
    correctCount: 7,
    correctMean: 17.43,
    meanDisplay: "17.43",
    chipColor: DS.gradientPurple,
    chipGradient: `linear-gradient(135deg, ${DS.gradientPurple}, #7B52AB)`,
  },
  {
    id: "sunil",
    title: "Sunil's Running",
    emoji: "🏃‍♂️",
    description:
      "Sunil is also training. Before calculating, guess: will his mean be higher or lower than Nikhil's?",
    values: [20, 18, 18, 17, 16, 16, 17],
    correctSum: 122,
    correctCount: 7,
    correctMean: 17.43,
    meanDisplay: "17.43",
    chipColor: DS.orange,
    chipGradient: `linear-gradient(135deg, ${DS.orange}, ${DS.gradientOrange})`,
  },
  {
    id: "enrolment",
    title: "School Enrolment",
    emoji: "🏫",
    description:
      "Find the mean enrolment of a school over six consecutive years.",
    values: [1555, 1670, 1750, 2013, 2040, 2126],
    correctSum: 11154,
    correctCount: 6,
    correctMean: 1859,
    meanDisplay: "1859",
    chipColor: DS.success,
    chipGradient: `linear-gradient(135deg, ${DS.success}, #1A9C4E)`,
    note: "Notice that the mean (1859) falls between the minimum (1555) and maximum (2126).",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// EASING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// KEYFRAMES — Singularity themed
// ═══════════════════════════════════════════════════════════════════════════

const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

  @keyframes popIn {
    0% { transform: scale(0) rotate(-10deg); opacity: 0; }
    70% { transform: scale(1.12) rotate(2deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
  @keyframes glowSuccess {
    0% { box-shadow: 0 0 0 0 rgba(45,181,98,0.45); }
    50% { box-shadow: 0 0 18px 4px rgba(45,181,98,0.2); }
    100% { box-shadow: 0 0 0 0 rgba(45,181,98,0); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes surpriseReveal {
    0% { transform: scale(0.3) rotate(-12deg); opacity: 0; }
    50% { transform: scale(1.08) rotate(2deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes countPulse {
    0% { transform: scale(1); color: ${DS.orange}; }
    50% { transform: scale(1.25); color: ${DS.gradientOrange}; }
    100% { transform: scale(1); color: ${DS.orange}; }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-16px); max-height: 0; }
    to { opacity: 1; transform: translateY(0); max-height: 200px; }
  }
  @keyframes floatShape {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(3deg); }
  }
  @keyframes spinSlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes ripple {
    0% { transform: scale(0); opacity: 0.4; }
    100% { transform: scale(3.5); opacity: 0; }
  }
  @keyframes shimmerGradient {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes tabUnderline {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// DECORATIVE GEOMETRIC SHAPES (from Singularity design PDF)
// ═══════════════════════════════════════════════════════════════════════════

const GeoCircle: React.FC<{
  size: number;
  color: string;
  style?: React.CSSProperties;
}> = ({ size, color, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      border: `2.5px solid ${color}`,
      position: "absolute",
      animation: "floatShape 6s ease-in-out infinite",
      pointerEvents: "none",
      ...style,
    }}
  />
);

const GeoTriangle: React.FC<{
  size: number;
  color: string;
  style?: React.CSSProperties;
}> = ({ size, color, style }) => (
  <div
    style={{
      width: 0,
      height: 0,
      position: "absolute",
      pointerEvents: "none",
      animation: "floatShape 8s ease-in-out infinite 1s",
      ...style,
    }}
  >
    <svg
      width={size}
      height={size * 0.866}
      viewBox={`0 0 ${size} ${size * 0.866}`}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <polygon
        points={`${size / 2},2 ${size - 2},${size * 0.866 - 2} 2,${size * 0.866 - 2}`}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
    </svg>
  </div>
);

const GeoSquare: React.FC<{
  size: number;
  color: string;
  style?: React.CSSProperties;
}> = ({ size, color, style }) => (
  <div
    style={{
      width: size,
      height: size,
      border: `2.5px solid ${color}`,
      position: "absolute",
      pointerEvents: "none",
      animation: "floatShape 7s ease-in-out infinite 0.5s",
      ...style,
    }}
  />
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const MeanPracticeTool: React.FC<MeanPracticeToolProps> = ({ props = {} }) => {
  const [activeProblem, setActiveProblem] = useState<string>("ball");
  const [states, setStates] = useState<Record<string, StepState>>({});
  const [showCompare, setShowCompare] = useState(false);
  const [compareAnimating, setCompareAnimating] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [animatingChipIdx, setAnimatingChipIdx] = useState<number>(-1);
  const [sumAnimValue, setSumAnimValue] = useState<number>(0);
  const [showSumAnim, setShowSumAnim] = useState(false);
  const [hintText, setHintText] = useState<string>("");
  const [showHint, setShowHint] = useState(false);
  const [shakeField, setShakeField] = useState<string>("");
  const [completedCount, setCompletedCount] = useState(0);
  const [hoveredBtn, setHoveredBtn] = useState<string>("");
  const [pressedBtn, setPressedBtn] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize states
  useEffect(() => {
    const initial: Record<string, StepState> = {};
    PROBLEMS.forEach((p) => {
      initial[p.id] = {
        sumInput: "",
        countInput: "",
        meanInput: "",
        sumChecked: false,
        countChecked: false,
        meanChecked: false,
        sumCorrect: false,
        countCorrect: false,
        meanCorrect: false,
        currentStep: 0,
      };
    });
    setStates(initial);
  }, []);

  // Inject keyframes
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "mean-practice-keyframes-v2";
    style.textContent = keyframes;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById("mean-practice-keyframes-v2");
      if (el) document.head.removeChild(el);
    };
  }, []);

  // Focus input on step change
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [activeProblem, states[activeProblem]?.currentStep]);

  const currentProblem = PROBLEMS.find((p) => p.id === activeProblem)!;
  const currentState = states[activeProblem];

  const nikhilDone = states["nikhil"]?.currentStep === 3;
  const sunilDone = states["sunil"]?.currentStep === 3;
  const canCompare = nikhilDone && sunilDone && !showCompare;

  useEffect(() => {
    let count = 0;
    PROBLEMS.forEach((p) => {
      if (states[p.id]?.currentStep === 3) count++;
    });
    setCompletedCount(count);
  }, [states]);

  const updateState = useCallback(
    (problemId: string, updates: Partial<StepState>) => {
      setStates((prev) => ({
        ...prev,
        [problemId]: { ...prev[problemId], ...updates },
      }));
    },
    [],
  );

  const animateSum = useCallback((problem: ProblemData) => {
    setShowSumAnim(true);
    setSumAnimValue(0);
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < problem.values.length) {
        setAnimatingChipIdx(idx);
        setSumAnimValue((prev) => prev + problem.values[idx]);
        idx++;
      } else {
        clearInterval(interval);
        setAnimatingChipIdx(-1);
        setTimeout(() => setShowSumAnim(false), 1500);
      }
    }, 280);
  }, []);

  const checkAnswer = useCallback(
    (field: "sum" | "count" | "mean") => {
      const state = states[activeProblem];
      if (!state) return;
      const problem = currentProblem;
      let inputVal: number;

      if (field === "sum") {
        inputVal = parseFloat(state.sumInput);
        if (inputVal === problem.correctSum) {
          updateState(activeProblem, {
            sumChecked: true,
            sumCorrect: true,
            currentStep: 1,
          });
          animateSum(problem);
        } else {
          updateState(activeProblem, { sumChecked: true, sumCorrect: false });
          setShakeField("sum");
          setHintText(`Add all the values: ${problem.values.join(" + ")} = ?`);
          setShowHint(true);
          setTimeout(() => {
            setShakeField("");
            setShowHint(false);
          }, 3000);
        }
      } else if (field === "count") {
        inputVal = parseFloat(state.countInput);
        if (inputVal === problem.correctCount) {
          updateState(activeProblem, {
            countChecked: true,
            countCorrect: true,
            currentStep: 2,
          });
        } else {
          updateState(activeProblem, {
            countChecked: true,
            countCorrect: false,
          });
          setShakeField("count");
          setHintText(`Count the number of values in the data set.`);
          setShowHint(true);
          setTimeout(() => {
            setShakeField("");
            setShowHint(false);
          }, 3000);
        }
      } else if (field === "mean") {
        inputVal = parseFloat(state.meanInput);
        if (Math.abs(inputVal - problem.correctMean) < 0.01) {
          updateState(activeProblem, {
            meanChecked: true,
            meanCorrect: true,
            currentStep: 3,
          });
        } else {
          updateState(activeProblem, { meanChecked: true, meanCorrect: false });
          setShakeField("mean");
          setHintText(
            `Mean = Sum ÷ Count = ${problem.correctSum} ÷ ${problem.correctCount} = ?`,
          );
          setShowHint(true);
          setTimeout(() => {
            setShakeField("");
            setShowHint(false);
          }, 3000);
        }
      }
    },
    [states, activeProblem, currentProblem, updateState, animateSum],
  );

  const resetProblem = useCallback(
    (id: string) => {
      updateState(id, {
        sumInput: "",
        countInput: "",
        meanInput: "",
        sumChecked: false,
        countChecked: false,
        meanChecked: false,
        sumCorrect: false,
        countCorrect: false,
        meanCorrect: false,
        currentStep: 0,
      });
      if (id === "nikhil" || id === "sunil") {
        setShowCompare(false);
        setCompareAnimating(false);
      }
    },
    [updateState],
  );

  const handleCompare = () => {
    setCompareAnimating(true);
    setTimeout(() => setShowCompare(true), 200);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    field: "sum" | "count" | "mean",
  ) => {
    if (e.key === "Enter") checkAnswer(field);
  };

  if (!currentState) return null;

  // ═════════════════════════════════════════════════════════════════════
  // CONTAINED BUTTON — Singularity Design (pill shape, 40px radius)
  // Supports: primary | highlight | outlined variants
  // States: enabled, hover, pressed, disabled
  // ═════════════════════════════════════════════════════════════════════
  const ContainedButton: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    variant?: "primary" | "highlight" | "outlined";
    disabled?: boolean;
    fullWidth?: boolean;
    id?: string;
  }> = ({
    onClick,
    children,
    variant = "primary",
    disabled = false,
    fullWidth = false,
    id = "",
  }) => {
    const isHovered = hoveredBtn === id;
    const isPressed = pressedBtn === id;

    const bgMap = {
      primary: `linear-gradient(135deg, ${DS.indigo}, ${DS.gradientPurple})`,
      highlight: `linear-gradient(135deg, ${DS.orange}, ${DS.gradientOrange})`,
      outlined: "transparent",
    };
    const hoverBgMap = {
      primary: `linear-gradient(135deg, ${DS.gradientPurple}, ${DS.indigo})`,
      highlight: `linear-gradient(135deg, ${DS.gradientOrange}, ${DS.orange})`,
      outlined: DS.offWhite,
    };

    return (
      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => setHoveredBtn(id)}
        onMouseLeave={() => {
          setHoveredBtn("");
          setPressedBtn("");
        }}
        onMouseDown={() => setPressedBtn(id)}
        onMouseUp={() => setPressedBtn("")}
        disabled={disabled}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "12px 24px",
          borderRadius: DS.radiusPill,
          border: variant === "outlined" ? `2px solid ${DS.indigo}` : "none",
          background: disabled
            ? DS.lightGrey
            : isPressed
              ? hoverBgMap[variant]
              : isHovered
                ? hoverBgMap[variant]
                : bgMap[variant],
          color: disabled
            ? DS.grey
            : variant === "outlined"
              ? DS.indigo
              : DS.white,
          fontFamily: DS.font,
          fontWeight: 600,
          fontSize: 14,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isPressed
            ? "scale(0.96)"
            : isHovered
              ? "translateY(-1px)"
              : "none",
          boxShadow: disabled
            ? "none"
            : variant === "outlined"
              ? "none"
              : isHovered
                ? variant === "highlight"
                  ? DS.shadowOrange
                  : DS.shadowMd
                : DS.shadowSm,
          width: fullWidth ? "100%" : "auto",
          minHeight: 44,
          letterSpacing: 0.2,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {children}
      </button>
    );
  };

  // ═════════════════════════════════════════════════════════════════════
  // STEP CARD RENDERER
  // ═════════════════════════════════════════════════════════════════════
  const renderStepCard = (
    stepNum: number,
    title: string,
    field: "sum" | "count" | "mean",
    placeholder: string,
    value: string,
    checked: boolean,
    correct: boolean,
    correctValue: string | number,
    animDelay: string = "0s",
  ) => {
    const isCurrent = currentState.currentStep === stepNum;
    const isAccessible = currentState.currentStep >= stepNum;
    if (!isAccessible) return null;

    return (
      <div
        style={{
          background: correct
            ? DS.successLight
            : isCurrent
              ? DS.orangeLight
              : DS.offWhite,
          borderRadius: DS.radiusCard,
          padding: "20px 22px",
          marginBottom: 14,
          border: correct
            ? `2px solid ${DS.success}30`
            : isCurrent
              ? `2px solid ${DS.gradientOrange}30`
              : `2px solid ${DS.lightGrey}`,
          transition: "all 0.4s ease",
          animation: `slideInRight 0.4s ease ${animDelay} both`,
        }}
      >
        <div
          style={{
            fontFamily: DS.font,
            fontWeight: 700,
            fontSize: 14,
            color: correct ? DS.success : DS.dark,
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: correct
                ? DS.success
                : `linear-gradient(135deg, ${DS.indigo}, ${DS.gradientPurple})`,
              color: DS.white,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {correct ? <Check size={14} strokeWidth={3} /> : stepNum + 1}
          </span>
          {title}
        </div>

        {correct ? (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: DS.white,
              color: DS.success,
              padding: "10px 20px",
              borderRadius: DS.radiusPill,
              fontWeight: 700,
              fontSize: 15,
              boxShadow: "0 2px 8px rgba(45,181,98,0.12)",
              animation: "glowSuccess 1s ease",
            }}
          >
            <Check size={16} strokeWidth={3} />{" "}
            {field === "sum" ? "Sum" : field === "count" ? "Count" : "Mean"} ={" "}
            {correctValue}
          </div>
        ) : isCurrent ? (
          <>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap" as const,
              }}
            >
              <input
                ref={isCurrent ? inputRef : undefined}
                type="number"
                step={field === "mean" ? "any" : undefined}
                placeholder={placeholder}
                value={value}
                onChange={(e) =>
                  updateState(activeProblem, {
                    [`${field}Input`]: e.target.value,
                    [`${field}Checked`]: false,
                  } as any)
                }
                onKeyDown={(e) => handleKeyDown(e, field)}
                style={{
                  flex: 1,
                  minWidth: 120,
                  padding: "12px 18px",
                  borderRadius: DS.radiusInput,
                  border:
                    checked && !correct
                      ? `2px solid ${DS.error}`
                      : `2px solid ${DS.lightGrey}`,
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: DS.font,
                  outline: "none",
                  transition: "all 0.3s ease",
                  background: checked && !correct ? DS.errorLight : DS.white,
                  color: DS.dark,
                  animation:
                    shakeField === field ? "shake 0.5s ease" : undefined,
                }}
              />
              <ContainedButton
                onClick={() => checkAnswer(field)}
                variant="highlight"
                id={`check-${field}`}
              >
                Check <ArrowRight size={15} />
              </ContainedButton>
            </div>
            {showHint && shakeField === field && (
              <div
                style={{
                  background: DS.errorLight,
                  border: `1.5px solid ${DS.error}30`,
                  borderRadius: DS.radiusInput,
                  padding: "10px 16px",
                  marginTop: 10,
                  fontSize: 12,
                  color: DS.error,
                  fontWeight: 600,
                  animation: "slideDown 0.3s ease both",
                }}
              >
                💡 {hintText}
              </div>
            )}
          </>
        ) : null}
      </div>
    );
  };

  // ═════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════

  return (
    <div
      style={{
        fontFamily: DS.font,
        width: "100%",
        maxWidth: 920,
        margin: "0 auto",
        background: DS.white,
        borderRadius: DS.radiusCard,
        overflow: "hidden",
        boxShadow: DS.shadowLg,
        position: "relative",
      }}
    >
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* HEADER — Singularity gradient with geometric shapes         */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.gradientPurple} 0%, ${DS.indigo} 40%, ${DS.gradientOrange} 100%)`,
          padding: "28px 32px 22px",
          color: DS.white,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <GeoCircle
          size={50}
          color="rgba(255,255,255,0.15)"
          style={{ top: -10, right: 60 }}
        />
        <GeoCircle
          size={30}
          color="rgba(255,255,255,0.1)"
          style={{ top: 40, right: 20, animationDelay: "2s" }}
        />
        <GeoTriangle
          size={36}
          color="rgba(255,255,255,0.12)"
          style={{ bottom: 8, right: 140, animationDelay: "1s" }}
        />
        <GeoSquare
          size={24}
          color="rgba(255,255,255,0.1)"
          style={{ top: 8, right: 200, animationDelay: "3s" }}
        />
        <GeoCircle
          size={18}
          color="rgba(255,255,255,0.08)"
          style={{ bottom: 12, left: "45%", animationDelay: "4s" }}
        />

        <div
          style={{
            position: "absolute",
            top: "-40%",
            right: "-10%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(252,145,69,0.25) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <h1
          style={{
            fontFamily: DS.font,
            fontWeight: 800,
            fontSize: 24,
            margin: 0,
            letterSpacing: -0.3,
            position: "relative",
            zIndex: 1,
          }}
        >
          📊 Figure it Out — Arithmetic Mean
        </h1>
        <p
          style={{
            fontSize: 13,
            opacity: 0.85,
            margin: "6px 0 0",
            fontWeight: 500,
            position: "relative",
            zIndex: 1,
            lineHeight: 1.5,
          }}
        >
          Calculate the mean step by step. You might discover something
          surprising!
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
            borderRadius: DS.radiusPill,
            fontSize: 12,
            fontWeight: 700,
            position: "absolute",
            top: 24,
            right: 28,
            zIndex: 2,
          }}
        >
          <Trophy size={13} /> {completedCount}/{PROBLEMS.length}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB BAR                                                     */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          display: "flex",
          gap: 0,
          background: DS.offWhite,
          borderBottom: `1.5px solid ${DS.lightGrey}`,
          overflowX: "auto",
        }}
      >
        {PROBLEMS.map((p) => {
          const isActive = activeProblem === p.id;
          const isDone = states[p.id]?.currentStep === 3;
          const isHovered = hoveredTab === p.id;
          return (
            <div
              key={p.id}
              style={{
                flex: "1 1 0",
                padding: "14px 12px",
                textAlign: "center" as const,
                cursor: "pointer",
                fontWeight: isActive ? 700 : 500,
                fontSize: 13,
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                position: "relative" as const,
                whiteSpace: "nowrap" as const,
                color: isActive ? DS.indigo : isHovered ? DS.dark : DS.grey,
                background: isActive
                  ? DS.white
                  : isHovered
                    ? "#FAFAFA"
                    : "transparent",
              }}
              onClick={() => setActiveProblem(p.id)}
              onMouseEnter={() => setHoveredTab(p.id)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <span style={{ fontSize: 15, marginRight: 5 }}>{p.emoji}</span>
              {p.title}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "15%",
                    width: "70%",
                    height: 3,
                    borderRadius: 3,
                    background: `linear-gradient(90deg, ${DS.indigo}, ${DS.orange})`,
                    animation: "tabUnderline 0.3s ease both",
                    transformOrigin: "left",
                  }}
                />
              )}
              {isDone && (
                <span
                  style={{
                    position: "absolute" as const,
                    top: 5,
                    right: 8,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: DS.success,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(45,181,98,0.3)",
                  }}
                >
                  <Check size={10} color="#fff" strokeWidth={3} />
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* BODY                                                        */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "24px 30px 36px" }} key={activeProblem}>
        <p
          style={{
            fontSize: 14,
            color: DS.dark,
            lineHeight: 1.65,
            marginBottom: 22,
            animation: "fadeInUp 0.5s ease both",
            fontWeight: 400,
          }}
        >
          {currentProblem.description}
        </p>

        {/* Number Chips */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap" as const,
            gap: 10,
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          {currentProblem.values.map((v, i) => (
            <div
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 54,
                height: 54,
                borderRadius: DS.radiusChip,
                color: DS.white,
                fontWeight: 700,
                fontSize: 17,
                letterSpacing: 0.3,
                background: currentProblem.chipGradient,
                padding: "0 16px",
                boxShadow:
                  animatingChipIdx === i
                    ? `0 6px 24px ${currentProblem.chipColor}40`
                    : "0 3px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                cursor: "default",
                animation: `popIn 0.4s ease ${i * 0.06}s both`,
                transform:
                  animatingChipIdx === i
                    ? "scale(1.18) translateY(-4px)"
                    : "scale(1)",
              }}
            >
              {v}
            </div>
          ))}
        </div>

        {/* Sum animation line */}
        <div
          style={{
            textAlign: "center" as const,
            margin: "12px 0 22px",
            fontSize: 13,
            color: DS.grey,
            fontWeight: 600,
            minHeight: 24,
          }}
        >
          {showSumAnim ? (
            <span
              style={{
                animation: "countPulse 0.3s ease",
                color: DS.orange,
                fontSize: 17,
                fontWeight: 700,
              }}
            >
              Running total: {sumAnimValue}
            </span>
          ) : currentState.sumCorrect ? (
            <span style={{ color: DS.success, fontWeight: 600 }}>
              {currentProblem.values.join(" + ")} = {currentProblem.correctSum}
            </span>
          ) : (
            <span>{currentProblem.values.join(" + ")} = ?</span>
          )}
        </div>

        {/* Formula Box */}
        <div
          style={{
            background: DS.orangeLight,
            border: `2px dashed ${DS.gradientOrange}40`,
            borderRadius: DS.radiusChip,
            padding: "11px 18px",
            textAlign: "center" as const,
            marginBottom: 20,
            fontSize: 13,
            color: DS.gradientPurple,
            fontWeight: 600,
          }}
        >
          Mean = Sum of all values ÷ Number of values
        </div>

        {/* Step Cards */}
        {renderStepCard(
          0,
          "Step 1: Find the Sum",
          "sum",
          "Enter the sum...",
          currentState.sumInput,
          currentState.sumChecked,
          currentState.sumCorrect,
          currentProblem.correctSum,
          "0s",
        )}

        {renderStepCard(
          1,
          "Step 2: Count the Values",
          "count",
          "How many values?",
          currentState.countInput,
          currentState.countChecked,
          currentState.countCorrect,
          currentProblem.correctCount,
          "0.1s",
        )}

        {renderStepCard(
          2,
          `Step 3: Calculate the Mean (${currentProblem.correctSum} ÷ ${currentProblem.correctCount})`,
          "mean",
          "Enter the mean...",
          currentState.meanInput,
          currentState.meanChecked,
          currentState.meanCorrect,
          currentProblem.meanDisplay,
          "0.2s",
        )}

        {/* Summary Card */}
        {currentState.currentStep === 3 && (
          <div
            style={{
              background: `linear-gradient(135deg, ${DS.indigoLight}30, ${DS.orangeLight})`,
              borderRadius: DS.radiusCard,
              padding: "22px 26px",
              marginTop: 18,
              border: `2px solid ${DS.indigoLight}50`,
              animation: "fadeInUp 0.6s ease both",
              position: "relative" as const,
              overflow: "hidden",
            }}
          >
            <GeoCircle
              size={28}
              color={`${DS.indigo}15`}
              style={{ top: 10, right: 10 }}
            />
            <GeoSquare
              size={16}
              color={`${DS.orange}15`}
              style={{ bottom: 10, right: 50 }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
                position: "relative",
                zIndex: 1,
              }}
            >
              <span
                style={{
                  fontFamily: DS.font,
                  fontWeight: 800,
                  fontSize: 16,
                  color: DS.gradientPurple,
                }}
              >
                ✨ Problem Complete!
              </span>
              <ContainedButton
                onClick={() => resetProblem(activeProblem)}
                variant="outlined"
                id="reset-btn"
              >
                <RotateCcw size={13} /> Try Again
              </ContainedButton>
            </div>
            <div
              style={{
                fontSize: 14,
                color: DS.dark,
                lineHeight: 1.7,
                position: "relative",
                zIndex: 1,
              }}
            >
              <strong style={{ color: DS.indigo }}>
                Mean = {currentProblem.correctSum} ÷{" "}
                {currentProblem.correctCount} = {currentProblem.meanDisplay}
              </strong>
              {currentProblem.note && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "10px 16px",
                    background: DS.orangeLight,
                    borderRadius: DS.radiusInput,
                    border: `1px solid ${DS.gradientOrange}25`,
                    fontSize: 12,
                    color: DS.dark,
                    fontWeight: 500,
                  }}
                >
                  💡 {currentProblem.note}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compare Button */}
        {canCompare &&
          (activeProblem === "sunil" || activeProblem === "nikhil") && (
            <div style={{ marginTop: 20 }}>
              <ContainedButton
                onClick={handleCompare}
                variant="primary"
                fullWidth
                id="compare-btn"
              >
                <Sparkles size={18} /> Compare Nikhil & Sunil!
              </ContainedButton>
            </div>
          )}

        {/* Compare Result */}
        {showCompare &&
          (activeProblem === "nikhil" || activeProblem === "sunil") && (
            <div
              style={{
                background: `linear-gradient(135deg, ${DS.indigoLight}40, ${DS.orangeLight})`,
                borderRadius: DS.radiusCard,
                padding: 28,
                marginTop: 20,
                border: `2px solid ${DS.indigoLight}60`,
                animation: "surpriseReveal 0.8s ease both",
                textAlign: "center" as const,
                position: "relative" as const,
                overflow: "hidden",
              }}
            >
              <GeoCircle
                size={40}
                color={`${DS.indigo}12`}
                style={{ top: -8, left: -8 }}
              />
              <GeoTriangle
                size={28}
                color={`${DS.orange}12`}
                style={{ top: 10, right: 10 }}
              />
              <GeoSquare
                size={22}
                color={`${DS.indigo}10`}
                style={{ bottom: 10, left: 20 }}
              />

              <div
                style={{
                  fontSize: 42,
                  marginBottom: 12,
                  animation: "bounce 0.6s ease",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                🤯
              </div>
              <div
                style={{
                  fontFamily: DS.font,
                  fontWeight: 800,
                  fontSize: 22,
                  background: `linear-gradient(135deg, ${DS.indigo}, ${DS.orange})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 16,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                They have the SAME mean!
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 20,
                  marginBottom: 18,
                  flexWrap: "wrap" as const,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    padding: "16px 22px",
                    background: DS.white,
                    borderRadius: 16,
                    minWidth: 150,
                    border: `2px solid ${DS.indigoLight}`,
                    boxShadow: DS.shadowSm,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: DS.indigo,
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    🏃 Nikhil
                  </div>
                  <div
                    style={{ fontSize: 11, color: DS.grey, marginBottom: 6 }}
                  >
                    17, 18, 17, 16, 19, 17, 18
                  </div>
                  <div
                    style={{
                      fontFamily: DS.font,
                      fontWeight: 800,
                      fontSize: 22,
                      color: DS.indigo,
                    }}
                  >
                    17.43
                  </div>
                </div>
                <div
                  style={{
                    padding: "16px 22px",
                    background: DS.white,
                    borderRadius: 16,
                    minWidth: 150,
                    border: `2px solid ${DS.gradientOrange}30`,
                    boxShadow: DS.shadowSm,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: DS.orange,
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    🏃‍♂️ Sunil
                  </div>
                  <div
                    style={{ fontSize: 11, color: DS.grey, marginBottom: 6 }}
                  >
                    20, 18, 18, 17, 16, 16, 17
                  </div>
                  <div
                    style={{
                      fontFamily: DS.font,
                      fontWeight: 800,
                      fontSize: 22,
                      color: DS.orange,
                    }}
                  >
                    17.43
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: DS.white,
                  borderRadius: DS.radiusInput,
                  padding: "14px 18px",
                  fontSize: 13,
                  color: DS.dark,
                  lineHeight: 1.7,
                  textAlign: "left" as const,
                  border: `1px solid ${DS.lightGrey}`,
                  position: "relative",
                  zIndex: 1,
                  fontWeight: 400,
                }}
              >
                <strong style={{ color: DS.gradientPurple }}>
                  Key Insight:
                </strong>{" "}
                Different data sets can have the <strong>same mean</strong>!
                Nikhil's times cluster around 17–18 seconds, while Sunil's are
                more spread out (16 to 20). Yet both average to{" "}
                <strong style={{ color: DS.indigo }}>122 ÷ 7 ≈ 17.43</strong>.
              </div>
            </div>
          )}

        {/* All Done */}
        {completedCount === 4 && (
          <div
            style={{
              textAlign: "center" as const,
              marginTop: 24,
              padding: 24,
              background: `linear-gradient(135deg, ${DS.successLight}, ${DS.orangeLight})`,
              borderRadius: DS.radiusCard,
              animation: "fadeInUp 0.6s ease both",
              border: `2px solid ${DS.success}25`,
              position: "relative" as const,
              overflow: "hidden",
            }}
          >
            <GeoCircle
              size={32}
              color={`${DS.success}15`}
              style={{ top: -6, right: -6 }}
            />
            <GeoTriangle
              size={24}
              color={`${DS.orange}12`}
              style={{ bottom: 6, left: 12 }}
            />
            <div
              style={{
                fontSize: 38,
                animation: "bounce 1s ease infinite",
                position: "relative",
                zIndex: 1,
              }}
            >
              🎉
            </div>
            <div
              style={{
                fontFamily: DS.font,
                fontWeight: 800,
                fontSize: 18,
                color: DS.success,
                marginTop: 10,
                position: "relative",
                zIndex: 1,
              }}
            >
              All Problems Complete!
            </div>
            <div
              style={{
                fontSize: 13,
                color: DS.dark,
                marginTop: 6,
                fontWeight: 400,
                position: "relative",
                zIndex: 1,
              }}
            >
              You've mastered calculating the arithmetic mean. Great work!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeanPracticeTool;
