// @ts-ignore - workspace may not include react typings
import React, { useState, useEffect, useCallback, useMemo } from "react";
// @ts-ignore - workspace may not include lucide-react typings
import { ChevronLeft, ChevronRight, Check, X, BookOpen, Target } from "lucide-react";

// ==================== DESIGN TOKENS (from Singularity Design System) ====================
const DS = {
  primary: "#4A4DC9",
  accent: "#FF7212",
  gradStart: "#533086",
  gradEnd: "#FC9145",
  lightPurple: "#C1C1EA",
  lightOrange: "#FFF3E4",
  gray900: "#4E4E4E",
  gray400: "#CACACA",
  gray200: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",
  success: "#2DB87E",
  error: "#E5453E",
  font: "'Poppins', sans-serif",
  radius: "24px",
  radiusSm: "14px",
  radiusXs: "10px",
};

// ==================== TYPES ====================
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
interface InverseOpsAdditionalProps {
  examples?: {
    id: string;
    title: string;
    operationPair:
      | "add_subtract"
      | "subtract_add"
      | "multiply_divide"
      | "divide_multiply";
    expression: string;
    knownResult: number;
    termToRemove: string;
    termToRemoveValue: number;
    inverseOperation: string;
    inverseOperationSymbol: string;
    resultExpression: string;
    resultValue: number;
    color: string;
  }[];
  showAllExamples?: boolean;
  highlightExample?: string;
  animationDelay?: number;
  showFormula?: boolean;
}
interface InverseOpsToolProps {
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
    additionalProps?: InverseOpsAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DATA ====================
const DEFAULT_EXAMPLES = [
  {
    id: "ex1",
    title: "Example 1: Remove Addition with Subtraction",
    operationPair: "add_subtract" as const,
    expression: "14593 − 1459 + 145 − 14 + 88",
    knownResult: 13353,
    termToRemove: "+ 88",
    termToRemoveValue: 88,
    inverseOperation: "Subtract 88 from both sides",
    inverseOperationSymbol: "− 88",
    resultExpression: "14593 − 1459 + 145 − 14",
    resultValue: 13265,
    color: DS.primary,
  },
  {
    id: "ex2",
    title: "Example 2: Remove Multiplication with Division",
    operationPair: "multiply_divide" as const,
    expression: "23 × 41 × 11 × 8 × 7",
    knownResult: 580888,
    termToRemove: "× 7",
    termToRemoveValue: 7,
    inverseOperation: "Divide both sides by 7",
    inverseOperationSymbol: "÷ 7",
    resultExpression: "23 × 41 × 11 × 8",
    resultValue: 82984,
    color: DS.gradStart,
  },
  {
    id: "ex3",
    title: "Example 3: Remove Subtraction with Addition",
    operationPair: "subtract_add" as const,
    expression: "12345 − 5432 + 135 − 24 − (−67)",
    knownResult: 7091,
    termToRemove: "− (−67)",
    termToRemoveValue: -67,
    inverseOperation: "Add (−67) to both sides",
    inverseOperationSymbol: "+ (−67)",
    resultExpression: "12345 − 5432 + 135 − 24",
    resultValue: 7024,
    color: DS.accent,
  },
  {
    id: "ex4",
    title: "Example 4: Remove Division with Multiplication",
    operationPair: "divide_multiply" as const,
    expression: "(35/113) × 24 × 14 × (8/9)",
    knownResult: 92.51,
    termToRemove: "× (8/9)",
    termToRemoveValue: 0.889,
    inverseOperation: "Divide both sides by (8/9), i.e., multiply by (9/8)",
    inverseOperationSymbol: "× (9/8)",
    resultExpression: "(35/113) × 24 × 14",
    resultValue: 104.07,
    color: DS.gradEnd,
  },
];

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "What are Inverse Operations?",
    description:
      "Inverse operations are pairs of operations that undo each other. Adding 3 then subtracting 3 returns to the original number.",
    type: "intro",
    mode: "learn",
    data: { phase: "intro" },
  },
  {
    id: 2,
    title: "Example 1: Addition ↔ Subtraction",
    description:
      "Given: 14593 − 1459 + 145 − 14 + 88 = 13353. To find the shorter expression, subtract 88 from both sides.",
    type: "explanation",
    mode: "learn",
    data: { exampleIndex: 0 },
  },
  {
    id: 3,
    title: "Example 2: Multiplication ↔ Division",
    description:
      "Given: 23 × 41 × 11 × 8 × 7 = 5,80,888. To find 23 × 41 × 11 × 8, divide both sides by 7.",
    type: "explanation",
    mode: "learn",
    data: { exampleIndex: 1 },
  },
  {
    id: 4,
    title: "Example 3: Subtraction ↔ Addition",
    description:
      "Given: 12345 − 5432 + 135 − 24 − (−67) = 7091. To remove −(−67), add (−67) to both sides.",
    type: "explanation",
    mode: "learn",
    data: { exampleIndex: 2 },
  },
  {
    id: 5,
    title: "Example 4: Division ↔ Multiplication",
    description:
      "Given: (35/113) × 24 × 14 × (8/9) = 94080/1017. To remove ×(8/9), multiply both sides by (9/8).",
    type: "explanation",
    mode: "learn",
    data: { exampleIndex: 3 },
  },
  {
    id: 10,
    title: "Identify the Inverse",
    description: "Select the correct inverse operation.",
    type: "practice",
    mode: "practice",
    data: {
      questions: [
        {
          question: "What is the inverse of + 88?",
          options: ["+ 88", "− 88", "× 88", "÷ 88"],
          answer: 1,
        },
        {
          question: "What is the inverse of × 7?",
          options: ["× 7", "+ 7", "÷ 7", "− 7"],
          answer: 2,
        },
        {
          question: "What is the inverse of − (−67)?",
          options: ["− 67", "+ (−67)", "× (−67)", "+ 67"],
          answer: 1,
        },
        {
          question: "What is the inverse of × (8/9)?",
          options: ["÷ (8/9)", "× (9/8)", "− (8/9)", "Both A and B"],
          answer: 3,
        },
      ],
    },
  },
  {
    id: 11,
    title: "Apply Inverse Operations",
    description: "Find the value using inverse operations.",
    type: "practice",
    mode: "practice",
    data: {
      questions: [
        {
          question: "If A + 50 = 200, what is A?",
          options: ["250", "150", "200", "100"],
          answer: 1,
        },
        {
          question: "If B × 5 = 100, what is B?",
          options: ["500", "25", "20", "95"],
          answer: 2,
        },
        {
          question: "If C − 30 = 70, what is C?",
          options: ["40", "70", "100", "110"],
          answer: 2,
        },
        {
          question: "If D ÷ 4 = 8, what is D?",
          options: ["2", "12", "32", "4"],
          answer: 2,
        },
      ],
    },
  },
];

// ==================== KEYFRAMES ====================
const keyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 70% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
    @keyframes slideRight { from { width: 0%; } to { width: 100%; } }
`;

// ==================== COMPONENT ====================
const InverseOperationsTool: React.FC<InverseOpsToolProps> = ({
  props: propsIn,
  setStepDetails,
  stopAutoNext,
}) => {
  const props = (propsIn ?? {}) as NonNullable<InverseOpsToolProps["props"]>;
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: props.initialMode ?? "learn",
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: props.enabledModes ?? ["learn", "practice"],
      showNavigation: props.showNavigation ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      initialStep: props.initialStep ?? 1,
      filterSteps: props.filterSteps ?? null,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration:
        props.autoPlayDuration ?? props.data?.autoPlayDuration ?? 10000,
      themeColor: props.themeColor ?? DS.primary,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const examples = props.additionalProps?.examples || DEFAULT_EXAMPLES;
  const allSteps = props.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(
    () =>
      config.filterSteps?.length
        ? allSteps.filter((s) => config.filterSteps!.includes(s.id))
        : allSteps,
    [allSteps, config.filterSteps],
  );

  const [selectedMode, setSelectedMode] = useState<ModeType>(
    config.initialMode as ModeType,
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!stopAutoNext);
  const [animPhase, setAnimPhase] = useState(0);
  const [stepAnimKey, setStepAnimKey] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState<
    Record<string, number | null>
  >({});
  const [showPracticeResult, setShowPracticeResult] = useState<
    Record<string, boolean>
  >({});
  const [practiceQIndex, setPracticeQIndex] = useState(0);

  const modeSteps = useMemo(
    () => availableSteps.filter((s) => s.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const currentStep = modeSteps[currentStepIndex] || modeSteps[0];

  // Pair colors mapped to design system
  const pairThemes: Record<
    string,
    { gradient: string; bg: string; text: string; badge: string }
  > = {
    add_subtract: {
      gradient: `linear-gradient(135deg, ${DS.primary}, #6B6EE0)`,
      bg: DS.lightPurple + "40",
      text: DS.primary,
      badge: DS.lightPurple,
    },
    subtract_add: {
      gradient: `linear-gradient(135deg, ${DS.accent}, ${DS.gradEnd})`,
      bg: DS.lightOrange,
      text: DS.accent,
      badge: DS.lightOrange,
    },
    multiply_divide: {
      gradient: `linear-gradient(135deg, ${DS.gradStart}, ${DS.primary})`,
      bg: DS.lightPurple + "30",
      text: DS.gradStart,
      badge: DS.lightPurple,
    },
    divide_multiply: {
      gradient: `linear-gradient(135deg, ${DS.gradEnd}, ${DS.accent})`,
      bg: DS.lightOrange + "AA",
      text: "#B94600",
      badge: DS.lightOrange,
    },
  };

  useEffect(() => {
    const id = "io-kf";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = keyframes;
      document.head.appendChild(s);
    }
    return () => {
      const e = document.getElementById(id);
      if (e) document.head.removeChild(e);
    };
  }, []);

  useEffect(() => {
    setAnimPhase(0);
    setStepAnimKey((k) => k + 1);
    setPracticeQIndex(0);
    const t: any[] = [];
    t.push(setTimeout(() => setAnimPhase(1), 500 / config.animationSpeed));
    t.push(setTimeout(() => setAnimPhase(2), 1200 / config.animationSpeed));
    t.push(setTimeout(() => setAnimPhase(3), 1900 / config.animationSpeed));
    t.push(setTimeout(() => setAnimPhase(4), 2600 / config.animationSpeed));
    return () => t.forEach(clearTimeout);
  }, [currentStepIndex, selectedMode, config.animationSpeed]);

  useEffect(() => {
    if (!isPlaying || config.autoPlayDuration <= 0) return;
    const t = setTimeout(() => {
      if (currentStepIndex < modeSteps.length - 1)
        setCurrentStepIndex((i) => i + 1);
      else setIsPlaying(false);
    }, config.autoPlayDuration);
    return () => clearTimeout(t);
  }, [isPlaying, currentStepIndex, modeSteps.length, config.autoPlayDuration]);

  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: modeSteps.length,
        isPaused: !isPlaying,
        currentMode: selectedMode,
      });
  }, [currentStepIndex, modeSteps.length, isPlaying, selectedMode]);

  const goNext = useCallback(() => {
    if (currentStepIndex < modeSteps.length - 1)
      setCurrentStepIndex((i) => i + 1);
  }, [currentStepIndex, modeSteps.length]);
  const goPrev = useCallback(() => {
    if (currentStepIndex > 0) setCurrentStepIndex((i) => i - 1);
  }, [currentStepIndex]);
  const changeMode = useCallback((m: ModeType) => {
    setSelectedMode(m);
    setCurrentStepIndex(0);
    setPracticeAnswers({});
    setShowPracticeResult({});
    setPracticeQIndex(0);
  }, []);

  // ─── CONTAINED BUTTON ──────────────────────────────────────────
  const Btn = ({
    children,
    onClick,
    disabled,
    variant = "contained",
    style: sx = {},
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: "contained" | "outlined" | "text" | "highlight";
    style?: React.CSSProperties;
  }) => {
    const base: React.CSSProperties = {
      fontFamily: DS.font,
      fontSize: "13px",
      fontWeight: 600,
      padding: "8px 24px",
      borderRadius: DS.radiusXs,
      cursor: disabled ? "default" : "pointer",
      transition: "all 0.25s ease",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      border: "none",
      opacity: disabled ? 0.45 : 1,
    };
    const variants: Record<string, React.CSSProperties> = {
      contained: {
        background: `linear-gradient(135deg, ${DS.gradStart}, ${DS.gradEnd})`,
        color: DS.white,
        boxShadow: "0 4px 14px rgba(83,48,134,0.3)",
      },
      outlined: {
        background: "transparent",
        color: DS.primary,
        border: `1.5px solid ${DS.primary}`,
      },
      text: { background: "transparent", color: DS.primary },
      highlight: {
        background: `linear-gradient(135deg, ${DS.accent}, #FF8F3F)`,
        color: DS.white,
        boxShadow: "0 4px 14px rgba(255,114,18,0.3)",
      },
    };
    return (
      <button
        onClick={disabled ? undefined : onClick}
        style={{ ...base, ...variants[variant], ...sx }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = "translateY(-1px) scale(1.03)";
            e.currentTarget.style.boxShadow =
              variant === "highlight"
                ? "0 6px 20px rgba(255,114,18,0.4)"
                : "0 6px 20px rgba(83,48,134,0.4)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow =
            variants[variant].boxShadow || "none";
        }}
      >
        {children}
      </button>
    );
  };

  // ─── RENDER: INTRO ─────────────────────────────────────────────
  const renderIntro = () => (
    <div style={{ padding: "36px 32px", textAlign: "center" }}>
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${DS.gradStart}, ${DS.gradEnd})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          animation: "popIn 0.5s ease-out both",
          boxShadow: "0 8px 30px rgba(83,48,134,0.25)",
        }}
      >
        <span style={{ fontSize: "32px" }}>🔄</span>
      </div>
      <h2
        style={{
          fontFamily: DS.font,
          fontSize: "24px",
          fontWeight: 800,
          color: DS.gray900,
          marginBottom: "12px",
          animation: "fadeInUp 0.5s ease-out 0.15s both",
        }}
      >
        Inverse Operations
      </h2>
      <p
        style={{
          fontFamily: DS.font,
          fontSize: "14px",
          color: DS.gray900 + "BB",
          maxWidth: "500px",
          margin: "0 auto 30px",
          lineHeight: 1.75,
          animation: "fadeInUp 0.5s ease-out 0.3s both",
        }}
      >
        Inverse operations <strong>undo</strong> each other. They are like a
        journey there and back — you always return to where you started!
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          maxWidth: "440px",
          margin: "0 auto",
        }}
      >
        {[
          {
            pair: "Addition ↔ Subtraction",
            icon: "➕ ↔ ➖",
            grad: `linear-gradient(135deg, ${DS.primary}14, ${DS.lightPurple}60)`,
            border: DS.primary,
            delay: "0.4s",
          },
          {
            pair: "Multiplication ↔ Division",
            icon: "✖️ ↔ ➗",
            grad: `linear-gradient(135deg, ${DS.accent}14, ${DS.lightOrange})`,
            border: DS.accent,
            delay: "0.55s",
          },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              background: item.grad,
              border: `2px solid ${item.border}25`,
              borderRadius: DS.radiusSm,
              padding: "22px 16px",
              animation: `popIn 0.5s ease-out ${item.delay} both`,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
              e.currentTarget.style.boxShadow = `0 8px 28px ${item.border}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: "26px", marginBottom: "8px" }}>
              {item.icon}
            </div>
            <div
              style={{
                fontFamily: DS.font,
                fontSize: "13px",
                fontWeight: 700,
                color: item.border,
              }}
            >
              {item.pair}
            </div>
          </div>
        ))}
      </div>
      {animPhase >= 2 && (
        <div
          style={{
            marginTop: "28px",
            padding: "14px 22px",
            background: DS.lightOrange,
            border: `1.5px dashed ${DS.accent}50`,
            borderRadius: DS.radiusXs,
            animation: "fadeInUp 0.4s ease-out both",
            maxWidth: "460px",
            margin: "28px auto 0",
          }}
        >
          <span
            style={{
              fontFamily: DS.font,
              fontSize: "13px",
              color: "#7A4500",
              fontWeight: 600,
            }}
          >
            💡 Performing the same operation on both sides of an equation keeps
            it balanced — just like a weighing scale!
          </span>
        </div>
      )}
    </div>
  );

  // ─── RENDER: EXAMPLE ───────────────────────────────────────────
  const renderExample = (exIndex: number) => {
    const ex = examples[exIndex];
    if (!ex) return null;
    const pt = pairThemes[ex.operationPair] || pairThemes.add_subtract;
    return (
      <div style={{ padding: "28px 30px" }} key={`ex-${stepAnimKey}`}>
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: pt.badge,
            borderRadius: "20px",
            padding: "5px 16px",
            marginBottom: "18px",
            animation: "fadeInLeft 0.35s ease-out both",
          }}
        >
          <span
            style={{
              fontFamily: DS.font,
              fontSize: "12px",
              fontWeight: 700,
              color: pt.text,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {ex.operationPair.replace(/_/g, " ↔ ")}
          </span>
        </div>

        {/* Step 1: Given */}
        <div
          style={{
            background: DS.white,
            border: `1.5px solid ${DS.gray200}`,
            borderRadius: DS.radiusSm,
            padding: "20px 22px",
            marginBottom: "14px",
            animation: "fadeInUp 0.4s ease-out 0.08s both",
          }}
        >
          <div
            style={{
              fontFamily: DS.font,
              fontSize: "11px",
              fontWeight: 700,
              color: DS.gray400,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "8px",
            }}
          >
            Step 1 — Given
          </div>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "16px",
              fontWeight: 600,
              color: DS.gray900,
              padding: "6px 0",
            }}
          >
            {ex.expression} ={" "}
            {typeof ex.knownResult === "number" && ex.knownResult % 1 !== 0
              ? ex.knownResult.toFixed(2)
              : ex.knownResult.toLocaleString()}
          </div>
        </div>

        {/* Step 2: Apply inverse */}
        {animPhase >= 1 && (
          <div
            style={{
              background: pt.bg,
              border: `2px solid ${pt.text}30`,
              borderRadius: DS.radiusSm,
              padding: "20px 22px",
              marginBottom: "14px",
              animation: "fadeInUp 0.4s ease-out both",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: pt.gradient,
                animation: "shimmer 2.5s ease-in-out infinite",
                backgroundSize: "200% 100%",
              }}
            />
            <div
              style={{
                fontFamily: DS.font,
                fontSize: "11px",
                fontWeight: 700,
                color: pt.text,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "8px",
              }}
            >
              Step 2 — Apply Inverse
            </div>
            <div
              style={{
                fontFamily: DS.font,
                fontSize: "14px",
                fontWeight: 600,
                color: DS.gray900,
              }}
            >
              {ex.inverseOperation}
            </div>
            <div
              style={{
                marginTop: "12px",
                fontFamily: "'Courier New', monospace",
                fontSize: "14px",
                color: DS.gray900,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span>{ex.expression}</span>
              <span
                style={{
                  color: pt.text,
                  fontWeight: 700,
                  animation: "popIn 0.35s ease-out 0.2s both",
                  background: pt.badge,
                  padding: "2px 10px",
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
              >
                {ex.inverseOperationSymbol}
              </span>
              <span>=</span>
              <span>
                {typeof ex.knownResult === "number" && ex.knownResult % 1 !== 0
                  ? ex.knownResult.toFixed(2)
                  : ex.knownResult.toLocaleString()}
              </span>
              <span
                style={{
                  color: pt.text,
                  fontWeight: 700,
                  animation: "popIn 0.35s ease-out 0.2s both",
                  background: pt.badge,
                  padding: "2px 10px",
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
              >
                {ex.inverseOperationSymbol}
              </span>
            </div>
          </div>
        )}

        {/* Step 3: Cancel */}
        {animPhase >= 2 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "14px",
              animation: "fadeInUp 0.4s ease-out both",
            }}
          >
            <div
              style={{
                flex: 1,
                background: DS.lightOrange,
                border: `1.5px solid ${DS.accent}30`,
                borderRadius: DS.radiusXs,
                padding: "14px 18px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: DS.font,
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#7A4500",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "6px",
                }}
              >
                They Cancel!
              </div>
              <div
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "17px",
                  color: DS.accent,
                  display: "inline-block",
                }}
              >
                <span
                  style={{
                    textDecoration: "line-through",
                    textDecorationColor: DS.error,
                    textDecorationThickness: "2.5px",
                  }}
                >
                  {ex.termToRemove} {ex.inverseOperationSymbol}
                </span>
              </div>
            </div>
            <div
              style={{
                fontSize: "24px",
                color: DS.primary,
                animation: "bounce 1s ease-in-out infinite",
              }}
            >
              →
            </div>
          </div>
        )}

        {/* Step 4: Result */}
        {animPhase >= 3 && (
          <div
            style={{
              background: `linear-gradient(135deg, ${DS.success}12, ${DS.success}06)`,
              border: `2px solid ${DS.success}40`,
              borderRadius: DS.radiusSm,
              padding: "20px 22px",
              animation: "popIn 0.45s ease-out both",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: DS.font,
                fontSize: "11px",
                fontWeight: 700,
                color: DS.success,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "10px",
              }}
            >
              ✅ Result
            </div>
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "17px",
                fontWeight: 700,
                color: "#0A5C3A",
              }}
            >
              {ex.resultExpression} ={" "}
              {typeof ex.resultValue === "number" && ex.resultValue % 1 !== 0
                ? ex.resultValue.toFixed(2)
                : ex.resultValue.toLocaleString()}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── RENDER: PRACTICE ──────────────────────────────────────────
  const renderPractice = () => {
    const data = currentStep?.data;
    if (!data?.questions) return null;
    const questions = data.questions as {
      question: string;
      options: string[];
      answer: number;
    }[];
    const qi = Math.min(practiceQIndex, questions.length - 1);
    const q = questions[qi];
    const key = `${currentStep.id}-${qi}`;
    const selected = practiceAnswers[key];
    const revealed = showPracticeResult[key];
    const isCorrect = selected === q.answer;
    const isFirst = qi === 0;
    const isLast = qi === questions.length - 1;

    return (
      <div style={{ padding: "28px 30px" }} key={`pq-${currentStep.id}-${qi}`}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "22px",
          }}
        >
          <h3
            style={{
              fontFamily: DS.font,
              fontSize: "18px",
              fontWeight: 700,
              color: DS.gray900,
              margin: 0,
              animation: "fadeInDown 0.35s ease-out both",
            }}
          >
            🎯 {currentStep.title}
          </h3>
          <div
            style={{
              fontFamily: DS.font,
              fontSize: "12px",
              fontWeight: 700,
              color: DS.primary,
              background: DS.lightPurple + "60",
              padding: "4px 14px",
              borderRadius: "20px",
            }}
          >
            {qi + 1} / {questions.length}
          </div>
        </div>

        <div
          style={{
            background: DS.white,
            border: `1.5px solid ${revealed ? (isCorrect ? DS.success : DS.error) : DS.gray200}`,
            borderRadius: DS.radiusSm,
            padding: "26px",
            animation: "fadeInUp 0.35s ease-out both",
            transition: "border-color 0.3s ease",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              fontFamily: DS.font,
              fontSize: "16px",
              fontWeight: 600,
              color: DS.gray900,
              marginBottom: "20px",
              lineHeight: 1.5,
            }}
          >
            {q.question}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            {q.options.map((opt, oi) => {
              const isSel = selected === oi;
              const isCor = oi === q.answer;
              let bg = DS.gray100;
              let bdr = DS.gray200;
              let col = DS.gray900;
              if (revealed) {
                if (isCor) {
                  bg = DS.success + "18";
                  bdr = DS.success;
                  col = "#0A5C3A";
                } else if (isSel && !isCor) {
                  bg = DS.error + "12";
                  bdr = DS.error;
                  col = DS.error;
                }
              } else if (isSel) {
                bg = DS.lightPurple + "50";
                bdr = DS.primary;
                col = DS.primary;
              }
              return (
                <button
                  key={oi}
                  onClick={() => {
                    if (revealed) return;
                    setPracticeAnswers((p) => ({ ...p, [key]: oi }));
                    setTimeout(
                      () =>
                        setShowPracticeResult((p) => ({ ...p, [key]: true })),
                      350,
                    );
                  }}
                  style={{
                    fontFamily: DS.font,
                    fontSize: "14px",
                    fontWeight: 600,
                    padding: "12px 16px",
                    borderRadius: DS.radiusXs,
                    border: `1.5px solid ${bdr}`,
                    background: bg,
                    color: col,
                    cursor: revealed ? "default" : "pointer",
                    transition: "all 0.25s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    if (!revealed)
                      e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {revealed && isCor && <Check size={16} color={DS.success} />}
                  {revealed && isSel && !isCor && (
                    <X size={16} color={DS.error} />
                  )}
                  {opt}
                </button>
              );
            })}
          </div>
          {revealed && (
            <div
              style={{
                marginTop: "18px",
                padding: "12px 16px",
                borderRadius: DS.radiusXs,
                background: isCorrect ? DS.success + "10" : DS.error + "0A",
                border: `1px solid ${isCorrect ? DS.success + "30" : DS.error + "25"}`,
                animation: "fadeInUp 0.3s ease-out both",
              }}
            >
              <span
                style={{
                  fontFamily: DS.font,
                  fontSize: "13px",
                  fontWeight: 600,
                  color: isCorrect ? DS.success : DS.error,
                }}
              >
                {isCorrect
                  ? "✅ Correct! Well done!"
                  : `❌ Not quite. The answer is: ${q.options[q.answer]}`}
              </span>
            </div>
          )}
        </div>

        {/* Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Btn
            onClick={() => setPracticeQIndex((i) => Math.max(0, i - 1))}
            disabled={isFirst}
            variant="outlined"
            style={{ padding: "8px 18px" }}
          >
            <ChevronLeft size={15} /> Prev
          </Btn>
          <div style={{ display: "flex", gap: "6px" }}>
            {questions.map((_, di) => {
              const dk = `${currentStep.id}-${di}`;
              const dr = showPracticeResult[dk];
              const dc = practiceAnswers[dk] === questions[di].answer;
              let dc2 = DS.gray200;
              if (di === qi) dc2 = DS.primary;
              else if (dr) dc2 = dc ? DS.success : DS.error;
              return (
                <div
                  key={di}
                  onClick={() => setPracticeQIndex(di)}
                  style={{
                    width: di === qi ? "22px" : "10px",
                    height: "10px",
                    borderRadius: "5px",
                    background: dc2,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              );
            })}
          </div>
          {revealed && !isLast ? (
            <Btn
              onClick={() => setPracticeQIndex((i) => i + 1)}
              variant="highlight"
              style={{
                animation: "pulse 1.5s ease-in-out infinite",
                padding: "8px 18px",
              }}
            >
              Next <ChevronRight size={15} />
            </Btn>
          ) : (
            <Btn
              onClick={() =>
                setPracticeQIndex((i) => Math.min(questions.length - 1, i + 1))
              }
              disabled={isLast}
              variant="contained"
              style={{ padding: "8px 18px" }}
            >
              Next <ChevronRight size={15} />
            </Btn>
          )}
        </div>
      </div>
    );
  };

  // ─── RENDER CONTENT ────────────────────────────────────────────
  const renderContent = () => {
    if (!currentStep) return null;
    if (currentStep.data?.phase === "intro") return renderIntro();
    if (currentStep.data?.exampleIndex !== undefined)
      return renderExample(currentStep.data.exampleIndex);
    if (currentStep.type === "practice") return renderPractice();
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        <h3
          style={{
            fontFamily: DS.font,
            fontSize: "18px",
            fontWeight: 700,
            color: DS.gray900,
          }}
        >
          {currentStep.title}
        </h3>
        <p
          style={{
            fontFamily: DS.font,
            fontSize: "14px",
            color: DS.gray900 + "AA",
            marginTop: "10px",
            lineHeight: 1.7,
          }}
        >
          {currentStep.description}
        </p>
      </div>
    );
  };

  const modeConfig: Record<ModeType, { label: string; icon: React.ReactNode }> =
    {
      learn: { label: "Learn", icon: <BookOpen size={15} /> },
      practice: { label: "Practice", icon: <Target size={15} /> },
    };

  // ─── MAIN RENDER ───────────────────────────────────────────────
  return (
    <div
      style={{
        width: config.width,
        maxWidth: "100%",
        minHeight: config.height,
        background: DS.gray100,
        borderRadius: DS.radius,
        overflow: "hidden",
        boxShadow:
          "0 20px 60px rgba(74,77,201,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        fontFamily: DS.font,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.gradStart}, ${DS.gradEnd})`,
          padding: "18px 26px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30px",
            right: "60px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)",
            }}
          >
            <span style={{ fontSize: "20px" }}>🔄</span>
          </div>
          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: DS.white,
                letterSpacing: "0.2px",
              }}
            >
              Inverse Operations
            </div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.7)",
                marginTop: "1px",
              }}
            >
              Arithmetic Examples 1–4
            </div>
          </div>
        </div>
        {config.showStepIndicator && selectedMode !== "practice" && (
          <div
            style={{
              background: "rgba(255,255,255,0.18)",
              borderRadius: "20px",
              padding: "5px 14px",
              fontSize: "12px",
              fontWeight: 600,
              color: DS.white,
              position: "relative",
              zIndex: 1,
            }}
          >
            {currentStepIndex + 1} / {modeSteps.length}
          </div>
        )}
      </div>

      {/* ── MODE TABS ── */}
      {config.showModeSelector && (
        <div
          style={{
            display: "flex",
            gap: "6px",
            padding: "12px 20px",
            background: DS.white,
            borderBottom: `1px solid ${DS.gray200}`,
          }}
        >
          {config.enabledModes.map((mode) => {
            const active = selectedMode === mode;
            return (
              <button
                key={mode}
                onClick={() => changeMode(mode as ModeType)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                  padding: "9px 12px",
                  borderRadius: DS.radiusXs,
                  border: active
                    ? `1.5px solid ${DS.primary}`
                    : `1.5px solid transparent`,
                  background: active ? DS.lightPurple + "40" : "transparent",
                  color: active ? DS.primary : DS.gray400,
                  fontFamily: DS.font,
                  fontSize: "13px",
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {modeConfig[mode as ModeType]?.icon}{" "}
                {modeConfig[mode as ModeType]?.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, overflow: "auto", background: DS.white }}>
        {renderContent()}
      </div>

      {/* ── BOTTOM NAV (learn only) ── */}
      {config.showNavigation && selectedMode !== "practice" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 22px",
            borderTop: `1px solid ${DS.gray200}`,
            background: DS.white,
          }}
        >
          <Btn
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            variant="outlined"
            style={{ padding: "8px 20px" }}
          >
            <ChevronLeft size={15} /> Prev
          </Btn>
          <div style={{ display: "flex", gap: "6px" }}>
            {modeSteps.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentStepIndex(i)}
                style={{
                  width: i === currentStepIndex ? "22px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background:
                    i === currentStepIndex
                      ? `linear-gradient(90deg, ${DS.gradStart}, ${DS.gradEnd})`
                      : DS.gray200,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
          <Btn
            onClick={goNext}
            disabled={currentStepIndex === modeSteps.length - 1}
            variant="contained"
            style={{ padding: "8px 20px" }}
          >
            Next <ChevronRight size={15} />
          </Btn>
        </div>
      )}

      {/* ── TEACHING NOTE (learn only) ── */}
      {selectedMode !== "practice" && (
        <div
          style={{
            padding: "9px 22px",
            background: DS.lightOrange,
            borderTop: `1px solid ${DS.accent}15`,
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          <span style={{ fontSize: "12px" }}>📝</span>
          <span
            style={{
              fontFamily: DS.font,
              fontSize: "11px",
              fontWeight: 500,
              color: "#7A4500",
            }}
          >
            Teaching Note: Guide students through this interactive tool.
            Encourage exploration and discussion.
          </span>
        </div>
      )}
    </div>
  );
};

export default InverseOperationsTool;
