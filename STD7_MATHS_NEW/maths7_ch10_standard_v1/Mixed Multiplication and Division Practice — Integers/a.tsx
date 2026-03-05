// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: integer_mult_div_practice_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

// @ts-expect-error React types - ensure 'react' and '@types/react' are installed
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Check,
  X,
  ChevronRight,
  RotateCcw,
  Award,
  Snowflake,
  Warehouse,
// @ts-expect-error lucide-react - ensure 'lucide-react' is installed
} from "lucide-react";

// ==================== DESIGN TOKENS (Singularity) ====================

const DS = {
  indigo: "#4A4DC9",
  orange: "#FF7212",
  gradStart: "#533086",
  gradEnd: "#FC9145",
  dark: "#4E4E4E",
  grey: "#CACACA",
  lightGrey: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  purpleTint: "#C1C1EA",
  orangeTint: "#FFF3E4",
  success: "#22A65B",
  error: "#E53935",
  radius: 100,
  cardRadius: 16,
  font: "'Poppins', sans-serif",
};

// ==================== TYPE DEFINITIONS ====================

type ProblemType = "compute" | "fill_blank" | "word_problem";

interface Problem {
  id: string;
  type: ProblemType;
  expression: string;
  displayParts: DisplayPart[];
  answer: number;
  signNote: string;
  blankIndex?: number;
  wordProblemText?: string;
  contextIcon?: "snowflake" | "warehouse";
}

interface DisplayPart {
  text: string;
  isBlank?: boolean;
  isOperator?: boolean;
  isEquals?: boolean;
}

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: string;
}

interface AdditionalProps {
  problems?: Problem[];
  teachingNotes?: string;
  instructionsForStudent?: string;
  [key: string]: any;
}

interface IntegerMultDivToolProps {
  props?: {
    width?: number;
    height?: number;
    themeColor?: string;
    darkMode?: boolean;
    additionalProps?: AdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DEFAULT PROBLEMS ====================

const DEFAULT_PROBLEMS: Problem[] = [
  {
    id: "m1",
    type: "compute",
    expression: "14 × (−15)",
    displayParts: [
      { text: "14" },
      { text: " × ", isOperator: true },
      { text: "(−15)" },
      { text: " = ", isEquals: true },
    ],
    answer: -210,
    signNote:
      "Positive × Negative → Negative. Magnitude: 14 × 15 = 210. So the answer is −210.",
  },
  {
    id: "m2",
    type: "compute",
    expression: "(−16) × (−5)",
    displayParts: [
      { text: "(−16)" },
      { text: " × ", isOperator: true },
      { text: "(−5)" },
      { text: " = ", isEquals: true },
    ],
    answer: 80,
    signNote:
      "Negative × Negative → Positive. Magnitude: 16 × 5 = 80. So the answer is +80.",
  },
  {
    id: "m3",
    type: "compute",
    expression: "36 ÷ (−18)",
    displayParts: [
      { text: "36" },
      { text: " ÷ ", isOperator: true },
      { text: "(−18)" },
      { text: " = ", isEquals: true },
    ],
    answer: -2,
    signNote:
      "Positive ÷ Negative → Negative. Magnitude: 36 ÷ 18 = 2. So the answer is −2.",
  },
  {
    id: "m4",
    type: "compute",
    expression: "(−46) ÷ (−23)",
    displayParts: [
      { text: "(−46)" },
      { text: " ÷ ", isOperator: true },
      { text: "(−23)" },
      { text: " = ", isEquals: true },
    ],
    answer: 2,
    signNote:
      "Negative ÷ Negative → Positive. Magnitude: 46 ÷ 23 = 2. So the answer is +2.",
  },
  {
    id: "m5",
    type: "fill_blank",
    expression: "(−3) × ___ = 27",
    displayParts: [
      { text: "(−3)" },
      { text: " × ", isOperator: true },
      { text: "___", isBlank: true },
      { text: " = ", isEquals: true },
      { text: "27" },
    ],
    answer: -9,
    blankIndex: 2,
    signNote:
      "We need: (−3) × ? = 27. Since the product is positive and one factor is negative, the missing factor must be negative. 27 ÷ 3 = 9, so the answer is −9.",
  },
  {
    id: "m6",
    type: "fill_blank",
    expression: "5 × ___ = (−35)",
    displayParts: [
      { text: "5" },
      { text: " × ", isOperator: true },
      { text: "___", isBlank: true },
      { text: " = ", isEquals: true },
      { text: "(−35)" },
    ],
    answer: -7,
    blankIndex: 2,
    signNote:
      "We need: 5 × ? = −35. Since the product is negative and 5 is positive, the missing factor must be negative. 35 ÷ 5 = 7, so the answer is −7.",
  },
  {
    id: "m7",
    type: "fill_blank",
    expression: "___ ÷ (−8) = 7",
    displayParts: [
      { text: "___", isBlank: true },
      { text: " ÷ ", isOperator: true },
      { text: "(−8)" },
      { text: " = ", isEquals: true },
      { text: "7" },
    ],
    answer: -56,
    blankIndex: 0,
    signNote:
      "We need: ? ÷ (−8) = 7. Reverse: 7 × (−8) = −56. Positive × Negative → Negative. So the answer is −56.",
  },
  {
    id: "m8",
    type: "word_problem",
    expression: "32 + 10 × (−5)",
    displayParts: [
      { text: "32" },
      { text: " + ", isOperator: true },
      { text: "10" },
      { text: " × ", isOperator: true },
      { text: "(−5)" },
      { text: " = ", isEquals: true },
    ],
    answer: -18,
    wordProblemText:
      "A cold storage unit in Nashik, Maharashtra stores mangoes at a controlled temperature. The freezing process requires that the room temperature be lowered from 32°C at the rate of 5°C every hour. What will be the room temperature 10 hours after the process begins?",
    contextIcon: "snowflake",
    signNote:
      "Expression: 32 + 10 × (−5) = 32 + (−50) = −18. The rate of cooling is −5°C per hour (negative because temperature drops). After 10 hours: 10 × (−5) = −50. Starting from 32°C: 32 + (−50) = −18°C.",
  },
];

// ==================== DECORATIVE SHAPES ====================

const GeoShapes: React.FC<{ variant: "top" | "bottom" }> = ({ variant }) => {
  if (variant === "top") {
    return (
      <div
        style={{
          position: "absolute" as const,
          top: -28,
          right: -18,
          opacity: 0.09,
          pointerEvents: "none" as const,
        }}
      >
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle
            cx="35"
            cy="35"
            r="30"
            fill="none"
            stroke={DS.indigo}
            strokeWidth="2"
          />
          <polygon
            points="95,8 125,65 65,65"
            fill="none"
            stroke={DS.orange}
            strokeWidth="2"
          />
          <rect
            x="80"
            y="78"
            width="42"
            height="42"
            fill={DS.purpleTint}
            opacity="0.5"
            rx="3"
          />
        </svg>
      </div>
    );
  }
  return (
    <div
      style={{
        position: "absolute" as const,
        bottom: -22,
        left: -12,
        opacity: 0.07,
        pointerEvents: "none" as const,
      }}
    >
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle
          cx="25"
          cy="85"
          r="20"
          fill={DS.orangeTint}
          stroke={DS.orange}
          strokeWidth="1.5"
        />
        <polygon
          points="75,25 105,85 45,85"
          fill={DS.purpleTint}
          opacity="0.4"
          stroke={DS.indigo}
          strokeWidth="1.5"
        />
        <rect
          x="3"
          y="3"
          width="30"
          height="30"
          fill="none"
          stroke={DS.orange}
          strokeWidth="1.5"
          rx="2"
        />
      </svg>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const IntegerMultDivPracticeTool: React.FC<IntegerMultDivToolProps> = ({
  props: propsIn,
}) => {
  const props = (propsIn ?? {}) as NonNullable<IntegerMultDivToolProps["props"]>;
  const additionalProps = props?.additionalProps ?? {};
  const problems: Problem[] = additionalProps.problems || DEFAULT_PROBLEMS;
  const totalProblems = problems.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showSignNote, setShowSignNote] = useState(false);
  const [results, setResults] = useState<(boolean | null)[]>(
    new Array(totalProblems).fill(null),
  );
  const [showSummary, setShowSummary] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const [glowCorrect, setGlowCorrect] = useState(false);
  const [slideIn, setSlideIn] = useState(true);
  const [noteSlideIn, setNoteSlideIn] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const currentProblem = problems[currentIndex];
  const completedCount = results.filter((r) => r !== null).length;

  // ── Inject keyframes + Poppins font ──
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.id = "singularity-mult-div-kf";
    styleSheet.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

      @keyframes s_fadeInUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes s_fadeInDown {
        from { opacity: 0; transform: translateY(-16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes s_slideInRight {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes s_popIn {
        0% { transform: scale(0); opacity: 0; }
        70% { transform: scale(1.08); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes s_shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }
      @keyframes s_glowSuccess {
        0% { box-shadow: 0 0 0 0 rgba(34,166,91,0.4); }
        50% { box-shadow: 0 0 22px 6px rgba(34,166,91,0.18); }
        100% { box-shadow: 0 0 0 0 rgba(34,166,91,0); }
      }
      @keyframes s_noteSlide {
        from { opacity: 0; transform: translateY(16px) scale(0.97); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes s_bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.04); }
        70% { transform: scale(0.97); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes s_starBurst {
        0% { transform: scale(0) rotate(0deg); opacity: 0; }
        50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
        100% { transform: scale(1) rotate(360deg); opacity: 1; }
      }
      @keyframes s_float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      @keyframes s_gradShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes s_dotPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.35); }
      }
      @keyframes s_rotateGeo {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      const el = document.getElementById("singularity-mult-div-kf");
      if (el) document.head.removeChild(el);
    };
  }, []);

  useEffect(() => {
    setSlideIn(true);
    const t = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(t);
  }, [currentIndex]);

  // ── Handlers ──
  const handleSubmit = useCallback(() => {
    if (userAnswer.trim() === "" || submitted) return;
    const parsed = parseInt(userAnswer, 10);
    if (isNaN(parsed)) return;
    const correct = parsed === currentProblem.answer;
    setIsCorrect(correct);
    setSubmitted(true);
    const nr = [...results];
    nr[currentIndex] = correct;
    setResults(nr);
    if (correct) {
      setGlowCorrect(true);
      setTimeout(() => setGlowCorrect(false), 1200);
    } else {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 600);
    }
    setTimeout(() => {
      setShowSignNote(true);
      setNoteSlideIn(true);
    }, 500);
  }, [userAnswer, submitted, currentProblem, currentIndex, results]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalProblems - 1) {
      setSlideIn(false);
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setUserAnswer("");
        setSubmitted(false);
        setIsCorrect(false);
        setShowSignNote(false);
        setNoteSlideIn(false);
        setGlowCorrect(false);
      }, 250);
    } else setShowSummary(true);
  }, [currentIndex, totalProblems]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setUserAnswer("");
    setSubmitted(false);
    setIsCorrect(false);
    setShowSignNote(false);
    setNoteSlideIn(false);
    setResults(new Array(totalProblems).fill(null));
    setShowSummary(false);
    setGlowCorrect(false);
  }, [totalProblems]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        if (submitted && showSignNote) handleNext();
        else handleSubmit();
      }
    },
    [submitted, showSignNote, handleSubmit, handleNext],
  );

  const getTypeTag = (type: ProblemType) => {
    switch (type) {
      case "compute":
        return { label: "Compute", bg: DS.indigo, color: DS.white };
      case "fill_blank":
        return {
          label: "Fill in the Blank",
          bg: `linear-gradient(135deg, ${DS.gradStart}, ${DS.gradEnd})`,
          color: DS.white,
        };
      case "word_problem":
        return { label: "Word Problem", bg: DS.orange, color: DS.white };
    }
  };

  const progressPercent = (completedCount / totalProblems) * 100;
  const score = results.filter((r) => r === true).length;

  // Contained pill button
  const pillContained = (
    bg: string,
    color: string,
    hov: boolean,
    dis = false,
  ): React.CSSProperties => ({
    padding: "12px 28px",
    borderRadius: DS.radius,
    border: "none",
    fontFamily: DS.font,
    fontSize: 14,
    fontWeight: 600,
    cursor: dis ? "not-allowed" : "pointer",
    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
    transform: hov && !dis ? "scale(1.04)" : "scale(1)",
    background: dis ? DS.lightGrey : bg,
    color: dis ? DS.grey : color,
    boxShadow:
      hov && !dis
        ? "0 6px 20px rgba(74,77,201,0.25)"
        : "0 2px 8px rgba(0,0,0,0.06)",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    letterSpacing: "0.2px",
  });

  // Outlined pill button
  const pillOutlined = (
    borderColor: string,
    hov: boolean,
  ): React.CSSProperties => ({
    padding: "11px 26px",
    borderRadius: DS.radius,
    border: `2px solid ${borderColor}`,
    fontFamily: DS.font,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
    transform: hov ? "scale(1.04)" : "scale(1)",
    background: hov ? borderColor : "transparent",
    color: hov ? DS.white : borderColor,
    boxShadow: hov ? "0 6px 20px rgba(74,77,201,0.25)" : "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    letterSpacing: "0.2px",
  });

  // ═══════════════════════════════════════════
  // SUMMARY SCREEN
  // ═══════════════════════════════════════════
  if (showSummary) {
    const incorrectIndices = results
      .map((r, i) => (r === false ? i : -1))
      .filter((i) => i !== -1);
    return (
      <div style={containerStyle}>
        <div
          style={{
            position: "absolute" as const,
            top: 40,
            left: 30,
            opacity: 0.05,
            animation: "s_rotateGeo 60s linear infinite",
            pointerEvents: "none" as const,
          }}
        >
          <svg width="200" height="200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={DS.indigo}
              strokeWidth="3"
            />
          </svg>
        </div>
        <div
          style={{
            position: "absolute" as const,
            bottom: 30,
            right: 30,
            opacity: 0.05,
            pointerEvents: "none" as const,
          }}
        >
          <svg width="150" height="150">
            <polygon
              points="75,10 140,140 10,140"
              fill="none"
              stroke={DS.orange}
              strokeWidth="3"
            />
          </svg>
        </div>

        <div
          style={{
            ...cardStyle,
            animation: "s_bounceIn 0.6s ease-out both",
            textAlign: "center" as const,
            maxWidth: 500,
            position: "relative" as const,
            overflow: "hidden" as const,
          }}
        >
          <div
            style={{
              position: "absolute" as const,
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              background: `linear-gradient(90deg, ${DS.indigo}, ${DS.gradStart}, ${DS.gradEnd}, ${DS.orange})`,
              backgroundSize: "200% 100%",
              animation: "s_gradShift 4s ease infinite",
            }}
          />

          <div
            style={{
              animation: "s_starBurst 0.8s ease-out 0.3s both",
              marginTop: 16,
            }}
          >
            <Award
              size={56}
              color={score >= 6 ? DS.success : DS.orange}
              strokeWidth={1.5}
            />
          </div>

          <h1
            style={{
              fontFamily: DS.font,
              fontSize: 26,
              fontWeight: 800,
              color: DS.dark,
              margin: "14px 0 6px",
              animation: "s_fadeInUp 0.5s ease-out 0.5s both",
            }}
          >
            {score >= 7
              ? "Excellent Work!"
              : score >= 5
                ? "Good Job!"
                : "Keep Practising!"}
          </h1>

          <p
            style={{
              fontFamily: DS.font,
              fontSize: 16,
              color: DS.grey,
              fontWeight: 500,
              margin: "0 0 20px",
              animation: "s_fadeInUp 0.5s ease-out 0.7s both",
            }}
          >
            You scored{" "}
            <span style={{ fontWeight: 800, color: DS.indigo, fontSize: 20 }}>
              {score}
            </span>
            <span style={{ color: "#999" }}> / {totalProblems}</span>
          </p>

          <div
            style={{
              width: "100%",
              height: 10,
              borderRadius: 5,
              background: DS.offWhite,
              overflow: "hidden",
              marginBottom: 24,
              animation: "s_fadeInUp 0.5s ease-out 0.9s both",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 5,
                background:
                  score >= 7
                    ? `linear-gradient(90deg, ${DS.success}, #4ade80)`
                    : score >= 5
                      ? `linear-gradient(90deg, ${DS.orange}, ${DS.gradEnd})`
                      : `linear-gradient(90deg, ${DS.error}, #f87171)`,
                width: `${(score / totalProblems) * 100}%`,
                transition: "width 1.5s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>

          {incorrectIndices.length > 0 && (
            <div
              style={{
                background: "#FEF5F5",
                borderRadius: 12,
                padding: "14px 18px",
                marginBottom: 22,
                textAlign: "left" as const,
                animation: "s_fadeInUp 0.5s ease-out 1.1s both",
                border: "1px solid #FDDCDC",
              }}
            >
              <p
                style={{
                  fontFamily: DS.font,
                  fontWeight: 700,
                  color: DS.error,
                  fontSize: 13,
                  margin: "0 0 8px",
                  letterSpacing: "0.3px",
                }}
              >
                Review these problems:
              </p>
              {incorrectIndices.map((idx, i) => (
                <div
                  key={idx}
                  style={{
                    fontFamily: DS.font,
                    fontSize: 13,
                    color: DS.dark,
                    padding: "5px 0",
                    borderBottom:
                      i < incorrectIndices.length - 1
                        ? "1px solid #FDDCDC"
                        : "none",
                  }}
                >
                  <span style={{ fontWeight: 700, color: DS.indigo }}>
                    Q{idx + 1}:
                  </span>{" "}
                  {problems[idx].expression} ={" "}
                  <span style={{ fontWeight: 800, color: DS.success }}>
                    {problems[idx].answer}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleReset}
            onMouseEnter={() => setHoveredBtn("reset")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              ...pillContained(
                `linear-gradient(135deg, ${DS.indigo}, ${DS.gradStart})`,
                DS.white,
                hoveredBtn === "reset",
              ),
              animation: "s_fadeInUp 0.5s ease-out 1.3s both",
            }}
          >
            <RotateCcw size={16} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // MAIN PROBLEM VIEW
  // ═══════════════════════════════════════════
  const tag = getTypeTag(currentProblem.type);

  return (
    <div style={containerStyle}>
      {/* Background decoration */}
      <div
        style={{
          position: "absolute" as const,
          top: 20,
          left: 20,
          opacity: 0.035,
          pointerEvents: "none" as const,
        }}
      >
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle
            cx="90"
            cy="90"
            r="80"
            fill="none"
            stroke={DS.indigo}
            strokeWidth="2.5"
          />
          <circle
            cx="90"
            cy="90"
            r="50"
            fill="none"
            stroke={DS.purpleTint}
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <div
        style={{
          position: "absolute" as const,
          bottom: 20,
          right: 20,
          opacity: 0.035,
          pointerEvents: "none" as const,
        }}
      >
        <svg width="160" height="160" viewBox="0 0 160 160">
          <polygon
            points="80,10 150,150 10,150"
            fill="none"
            stroke={DS.orange}
            strokeWidth="2.5"
          />
          <rect
            x="40"
            y="40"
            width="60"
            height="60"
            fill="none"
            stroke={DS.orangeTint}
            strokeWidth="1.5"
            rx="3"
          />
        </svg>
      </div>

      {/* ── Progress header ── */}
      <div
        style={{
          width: "100%",
          maxWidth: 580,
          marginBottom: 18,
          animation: "s_fadeInDown 0.5s ease-out both",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: DS.font,
              fontSize: 13,
              fontWeight: 600,
              color: DS.grey,
            }}
          >
            {completedCount} of {totalProblems} complete
          </span>
          <span
            style={{
              fontFamily: DS.font,
              fontSize: 12,
              fontWeight: 700,
              color: DS.indigo,
              background: DS.purpleTint,
              padding: "3px 14px",
              borderRadius: 20,
            }}
          >
            Q{currentIndex + 1}
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: 7,
            borderRadius: 4,
            background: DS.offWhite,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 4,
              background: `linear-gradient(90deg, ${DS.indigo}, ${DS.gradStart}, ${DS.gradEnd})`,
              backgroundSize: "200% 100%",
              animation: "s_gradShift 3s ease infinite",
              width: `${progressPercent}%`,
              transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
      </div>

      {/* ── Problem Card ── */}
      <div
        key={currentIndex}
        style={{
          ...cardStyle,
          animation: slideIn ? "s_slideInRight 0.45s ease-out both" : "none",
          opacity: slideIn ? 1 : 0,
          maxWidth: 580,
          position: "relative" as const,
          overflow: "hidden" as const,
        }}
      >
        {/* Top gradient accent */}
        <div
          style={{
            position: "absolute" as const,
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${DS.indigo}, ${DS.gradEnd})`,
          }}
        />
        <GeoShapes variant="top" />
        <GeoShapes variant="bottom" />

        {/* Type tag pill */}
        <div
          style={{
            display: "inline-block",
            padding: "5px 16px",
            borderRadius: DS.radius,
            background: tag.bg,
            color: tag.color,
            fontFamily: DS.font,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.6px",
            textTransform: "uppercase" as const,
            marginBottom: 22,
            animation: "s_popIn 0.4s ease-out 0.2s both",
          }}
        >
          {tag.label}
        </div>

        {/* Word problem text */}
        {currentProblem.type === "word_problem" &&
          currentProblem.wordProblemText && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                background: DS.orangeTint,
                borderRadius: 14,
                padding: "16px 18px",
                marginBottom: 22,
                animation: "s_fadeInUp 0.5s ease-out 0.3s both",
                border: "1px solid rgba(255,114,18,0.12)",
              }}
            >
              <div
                style={{
                  minWidth: 42,
                  height: 42,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${DS.gradStart}, ${DS.gradEnd})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "s_float 2.5s ease-in-out infinite",
                }}
              >
                {currentProblem.contextIcon === "snowflake" ? (
                  <Snowflake size={20} color={DS.white} />
                ) : (
                  <Warehouse size={20} color={DS.white} />
                )}
              </div>
              <p
                style={{
                  fontFamily: DS.font,
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: DS.dark,
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                {currentProblem.wordProblemText}
              </p>
            </div>
          )}

        {/* ── Expression ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            marginBottom: 28,
            animation: "s_fadeInUp 0.5s ease-out 0.4s both",
          }}
        >
          {currentProblem.displayParts.map((part, i) => {
            if (part.isBlank && !submitted) {
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    minWidth: 80,
                    borderBottom: `3px solid ${DS.indigo}`,
                    paddingBottom: 2,
                    justifyContent: "center",
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                      fontFamily: DS.font,
                      fontSize: 34,
                      fontWeight: 700,
                      width: 80,
                      textAlign: "center" as const,
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      color: DS.indigo,
                      caretColor: DS.indigo,
                      animation: shakeInput
                        ? "s_shake 0.5s ease-in-out"
                        : "none",
                    }}
                    placeholder="?"
                  />
                </span>
              );
            }
            if (part.isBlank && submitted) {
              return (
                <span
                  key={i}
                  style={{
                    fontFamily: DS.font,
                    fontSize: 34,
                    fontWeight: 800,
                    color: isCorrect ? DS.success : DS.error,
                    animation: isCorrect
                      ? "s_glowSuccess 1s ease-out"
                      : "s_shake 0.5s ease-in-out",
                    display: "inline-block",
                    minWidth: 60,
                    textAlign: "center" as const,
                  }}
                >
                  {isCorrect ? userAnswer : currentProblem.answer}
                </span>
              );
            }
            return (
              <span
                key={i}
                style={{
                  fontFamily: DS.font,
                  fontSize: part.isOperator || part.isEquals ? 28 : 34,
                  fontWeight: part.isOperator || part.isEquals ? 500 : 700,
                  color: part.isOperator ? DS.grey : DS.dark,
                }}
              >
                {part.text}
              </span>
            );
          })}

          {/* Compute/word problem input */}
          {(currentProblem.type === "compute" ||
            currentProblem.type === "word_problem") &&
            !submitted && (
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  fontFamily: DS.font,
                  fontSize: 34,
                  fontWeight: 700,
                  width: 110,
                  textAlign: "center" as const,
                  border: "none",
                  borderBottom: `3px solid ${DS.indigo}`,
                  outline: "none",
                  background: "transparent",
                  color: DS.indigo,
                  caretColor: DS.orange,
                  paddingBottom: 2,
                  animation: shakeInput ? "s_shake 0.5s ease-in-out" : "none",
                }}
                placeholder="?"
              />
            )}
          {(currentProblem.type === "compute" ||
            currentProblem.type === "word_problem") &&
            submitted && (
              <span
                style={{
                  fontFamily: DS.font,
                  fontSize: 34,
                  fontWeight: 800,
                  color: isCorrect ? DS.success : DS.error,
                  animation: isCorrect ? "s_glowSuccess 1s ease-out" : "none",
                  display: "inline-block",
                  minWidth: 60,
                  textAlign: "center" as const,
                }}
              >
                {isCorrect ? userAnswer : currentProblem.answer}
              </span>
            )}
        </div>

        {/* Feedback badge */}
        {submitted && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 14,
              animation: "s_popIn 0.4s ease-out both",
            }}
          >
            {isCorrect ? (
              <>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: DS.success,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check size={16} color={DS.white} strokeWidth={3} />
                </div>
                <span
                  style={{
                    fontFamily: DS.font,
                    fontWeight: 700,
                    color: DS.success,
                    fontSize: 15,
                  }}
                >
                  Correct!
                </span>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: DS.error,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={16} color={DS.white} strokeWidth={3} />
                </div>
                <span
                  style={{
                    fontFamily: DS.font,
                    fontWeight: 700,
                    color: DS.error,
                    fontSize: 15,
                  }}
                >
                  Not quite — answer is {currentProblem.answer}
                </span>
              </>
            )}
          </div>
        )}

        {/* Check Answer — Contained pill */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={userAnswer.trim() === ""}
            onMouseEnter={() => setHoveredBtn("check")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              ...pillContained(
                `linear-gradient(135deg, ${DS.indigo}, ${DS.gradStart})`,
                DS.white,
                hoveredBtn === "check",
                userAnswer.trim() === "",
              ),
              margin: "0 auto",
              animation: "s_fadeInUp 0.5s ease-out 0.6s both",
            }}
          >
            <Check size={16} /> Check Answer
          </button>
        )}

        {/* Sign Note */}
        {showSignNote && (
          <div
            style={{
              background: DS.offWhite,
              borderRadius: 14,
              padding: "16px 20px",
              marginTop: 16,
              borderLeft: `4px solid ${isCorrect ? DS.success : DS.orange}`,
              animation: noteSlideIn
                ? "s_noteSlide 0.45s ease-out both"
                : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: isCorrect ? DS.success : DS.orange,
                }}
              />
              <p
                style={{
                  fontFamily: DS.font,
                  fontSize: 11,
                  fontWeight: 700,
                  color: isCorrect ? DS.success : DS.orange,
                  margin: 0,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.8px",
                }}
              >
                Sign Note
              </p>
            </div>
            <p
              style={{
                fontFamily: DS.font,
                fontSize: 13,
                lineHeight: 1.65,
                color: DS.dark,
                margin: 0,
                fontWeight: 400,
              }}
            >
              {currentProblem.signNote}
            </p>
          </div>
        )}

        {/* Next — Outlined pill */}
        {submitted && showSignNote && (
          <button
            onClick={handleNext}
            onMouseEnter={() => setHoveredBtn("next")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              ...pillOutlined(DS.indigo, hoveredBtn === "next"),
              margin: "18px auto 0",
              animation: "s_fadeInUp 0.4s ease-out both",
            }}
          >
            {currentIndex < totalProblems - 1 ? "Next Problem" : "See Results"}
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Problem dots */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 20,
          animation: "s_fadeInUp 0.5s ease-out 0.8s both",
        }}
      >
        {problems.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === currentIndex ? 12 : 9,
              height: i === currentIndex ? 12 : 9,
              borderRadius: "50%",
              background:
                results[i] === true
                  ? DS.success
                  : results[i] === false
                    ? DS.error
                    : i === currentIndex
                      ? DS.indigo
                      : DS.lightGrey,
              transition: "all 0.3s ease",
              animation:
                i === currentIndex
                  ? "s_dotPulse 1.5s ease-in-out infinite"
                  : "none",
              border:
                i === currentIndex
                  ? `2px solid ${DS.purpleTint}`
                  : "2px solid transparent",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ==================== BASE STYLES ====================

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  background: DS.white,
  padding: "28px 16px",
  fontFamily: DS.font,
  boxSizing: "border-box",
  position: "relative",
  overflow: "hidden",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  background: DS.white,
  borderRadius: DS.cardRadius,
  padding: "32px 28px",
  boxShadow: "0 2px 24px rgba(74,77,201,0.06), 0 1px 4px rgba(0,0,0,0.03)",
  border: `1px solid ${DS.lightGrey}`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export default IntegerMultDivPracticeTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
