// @ts-expect-error React types - ensure 'react' and '@types/react' are installed in the project
import React, { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

interface DivisionProblem {
  id: string;
  dividend: number;
  divisor: number;
  quotient: number;
  context?: string;
  multiplicationFact: string;
}

interface DivisionSignRulesProps {
  props?: {
    width?: number;
    height?: number;
    themeColor?: string;
    darkMode?: boolean;
    animationSpeed?: number;
    additionalProps?: {
      problems?: DivisionProblem[];
      showSignReminder?: boolean;
      title?: string;
    };
  };
  setStepDetails?: (stepDetails: any) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// EASING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

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
  const n1 = 7.5625,
    d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT PROBLEMS
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_PROBLEMS: DivisionProblem[] = [
  {
    id: "d1",
    dividend: -100,
    divisor: 25,
    quotient: -4,
    context: "A kirana store loses ₹100 over 25 days equally.",
    multiplicationFact: "25 × (−4) = −100",
  },
  {
    id: "d2",
    dividend: -100,
    divisor: -4,
    quotient: 25,
    context: "If ₹100 debt is split into ₹4 debt-parts…",
    multiplicationFact: "(−4) × 25 = −100",
  },
  {
    id: "d3",
    dividend: 50,
    divisor: -25,
    quotient: -2,
    context: "₹50 profit divided among 25 debt accounts.",
    multiplicationFact: "(−25) × (−2) = 50",
  },
  {
    id: "d4",
    dividend: -46,
    divisor: -23,
    quotient: 2,
    context: "From the textbook practice set — same signs!",
    multiplicationFact: "(−23) × 2 = −46",
  },
  {
    id: "d5",
    dividend: 36,
    divisor: -18,
    quotient: -2,
    context: "From the textbook practice set — different signs!",
    multiplicationFact: "(−18) × (−2) = 36",
  },
  {
    id: "d6",
    dividend: -30,
    divisor: 6,
    quotient: -5,
    context: "Ladakh temperature drops 30°C over 6 hours.",
    multiplicationFact: "6 × (−5) = −30",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// SINGULARITY DESIGN SYSTEM — COLORS
// ═══════════════════════════════════════════════════════════════════════════

const C = {
  // Primary
  purple: "#4A4DC9",
  purpleDark: "#533086",
  orange: "#FF7212",
  orangeMid: "#FC9145",
  // Light fills
  lavender: "#C1C1EA",
  peach: "#FFF3E4",
  lavenderLight: "#E8E8F6",
  // Neutrals
  dark: "#4E4E4E",
  grey: "#CACACA",
  greyLight: "#EBEBEB",
  greyBg: "#F5F5F5",
  white: "#FFFFFF",
  // Semantic
  success: "#2EAD5E",
  successLight: "#E0F5E8",
  error: "#E04444",
  errorLight: "#FDEAEA",
  // Derived
  textPrimary: "#2D2D3F",
  textSecondary: "#6B6B80",
  textMuted: "#9E9EB0",
};

// ═══════════════════════════════════════════════════════════════════════════
// KEYFRAMES
// ═══════════════════════════════════════════════════════════════════════════

const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.88); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes popIn {
    0% { transform: scale(0); opacity: 0; }
    60% { transform: scale(1.12); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.06); }
    70% { transform: scale(0.96); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes checkDraw {
    0% { stroke-dashoffset: 30; }
    100% { stroke-dashoffset: 0; }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    15% { transform: translateX(-10px); }
    30% { transform: translateX(10px); }
    45% { transform: translateX(-7px); }
    60% { transform: translateX(7px); }
    75% { transform: translateX(-3px); }
    90% { transform: translateX(3px); }
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-16px); max-height: 0; }
    to { opacity: 1; transform: translateY(0); max-height: 300px; }
  }

  @keyframes numberRoll {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes floatShape {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(3deg); }
  }

  @keyframes floatShape2 {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-6px) rotate(-4deg); }
  }

  @keyframes dotBounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.35); }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// GEOMETRIC SHAPE DECORATIONS (Singularity design motifs)
// ═══════════════════════════════════════════════════════════════════════════

const ShapeDecor: React.FC<{
  type: "circle" | "triangle" | "square";
  size: number;
  color: string;
  filled?: boolean;
  style?: React.CSSProperties;
}> = ({ type, size, color, filled = false, style = {} }) => {
  if (type === "circle") {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: filled ? "none" : `2px solid ${color}`,
          background: filled ? color : "transparent",
          ...style,
        }}
      />
    );
  }
  if (type === "triangle") {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
        <polygon
          points="20,4 36,36 4,36"
          fill={filled ? color : "none"}
          stroke={color}
          strokeWidth="2"
        />
      </svg>
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "4px",
        border: filled ? "none" : `2px solid ${color}`,
        background: filled ? color : "transparent",
        ...style,
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const DivisionSignRulesTool: React.FC<DivisionSignRulesProps> = ({
  props: propsIn,
}) => {
  const props = (propsIn ?? {}) as NonNullable<DivisionSignRulesProps["props"]>;
  const additionalProps = props?.additionalProps ?? {};
  const problems = additionalProps.problems || DEFAULT_PROBLEMS;
  const showSignReminder = additionalProps.showSignReminder !== false;
  const title = additionalProps.title || "Division of Integers — Sign Rules";

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [selectedSign, setSelectedSign] = useState<"+" | "-">("+");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showMultFact, setShowMultFact] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);
  const [completedProblems, setCompletedProblems] = useState<Set<number>>(
    new Set(),
  );
  const [allDone, setAllDone] = useState(false);
  const [cardAnim, setCardAnim] = useState(true);
  const [hoverCheck, setHoverCheck] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [hoverReset, setHoverReset] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentProblem = problems[currentProblemIndex];

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.id = "division-tool-keyframes-v2";
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    return () => {
      const existing = document.getElementById("division-tool-keyframes-v2");
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  useEffect(() => {
    if (!submitted && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [currentProblemIndex, submitted]);

  useEffect(() => {
    setCardAnim(true);
    const t = setTimeout(() => setCardAnim(false), 600);
    return () => clearTimeout(t);
  }, [currentProblemIndex]);

  const formatNumber = (n: number): string => {
    if (n < 0) return `(−${Math.abs(n)})`;
    return `${n}`;
  };

  const formatExpression = (p: DivisionProblem): string => {
    return `${formatNumber(p.dividend)} ÷ ${formatNumber(p.divisor)} = ?`;
  };

  const handleSubmit = useCallback(() => {
    const numVal = parseInt(inputValue);
    if (isNaN(numVal) || inputValue.trim() === "") return;
    const userAnswer =
      selectedSign === "-" ? -Math.abs(numVal) : Math.abs(numVal);
    const correct = userAnswer === currentProblem.quotient;
    setSubmitted(true);
    setIsCorrect(correct);
    if (correct) {
      setTimeout(() => setShowMultFact(true), 600);
      setCompletedProblems((prev) => new Set([...prev, currentProblemIndex]));
    } else {
      setShakeCard(true);
      setTimeout(() => setShakeCard(false), 600);
      setTimeout(() => setShowMultFact(true), 1200);
    }
  }, [inputValue, selectedSign, currentProblem, currentProblemIndex]);

  const handleNext = useCallback(() => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex((prev) => prev + 1);
      setInputValue("");
      setSelectedSign("+");
      setSubmitted(false);
      setIsCorrect(false);
      setShowMultFact(false);
    } else {
      setAllDone(true);
    }
  }, [currentProblemIndex, problems.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        if (submitted && showMultFact) handleNext();
        else if (!submitted) handleSubmit();
      }
    },
    [submitted, showMultFact, handleSubmit, handleNext],
  );

  const handleReset = useCallback(() => {
    setCurrentProblemIndex(0);
    setInputValue("");
    setSelectedSign("+");
    setSubmitted(false);
    setIsCorrect(false);
    setShowMultFact(false);
    setCompletedProblems(new Set());
    setAllDone(false);
  }, []);

  const sameSign = (a: number, b: number) =>
    (a > 0 && b > 0) || (a < 0 && b < 0);

  // Singularity pill button helper
  const pillBtn = (
    bg: string,
    color: string,
    disabled = false,
    hover = false,
  ): React.CSSProperties => ({
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: "15px",
    padding: "0 24px",
    height: "44px",
    lineHeight: "44px",
    background: disabled ? C.greyLight : bg,
    color: disabled ? C.grey : color,
    border: "none",
    borderRadius: "40px",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
    boxShadow:
      hover && !disabled
        ? "0 6px 20px rgba(83,48,134,0.25)"
        : disabled
          ? "none"
          : "0 2px 8px rgba(83,48,134,0.12)",
    transform: hover && !disabled ? "translateY(-1px) scale(1.03)" : "scale(1)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    whiteSpace: "nowrap" as const,
    letterSpacing: "0.3px",
  });

  // ═════════════════════════════════════════════════════════════════════
  // COMPLETION SCREEN
  // ═════════════════════════════════════════════════════════════════════
  if (allDone) {
    const score = completedProblems.size;
    return (
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          background: C.greyBg,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <ShapeDecor
          type="circle"
          size={140}
          color={C.lavender}
          filled
          style={{
            position: "absolute",
            top: "-30px",
            left: "-40px",
            opacity: 0.35,
            animation: "floatShape 6s ease-in-out infinite",
          }}
        />
        <ShapeDecor
          type="triangle"
          size={80}
          color={C.orangeMid}
          filled={false}
          style={{
            position: "absolute",
            top: "60px",
            right: "30px",
            opacity: 0.25,
            animation: "floatShape2 5s ease-in-out infinite",
          }}
        />
        <ShapeDecor
          type="square"
          size={60}
          color={C.lavender}
          filled={false}
          style={{
            position: "absolute",
            bottom: "80px",
            left: "40px",
            opacity: 0.2,
            animation: "floatShape 7s ease-in-out infinite",
          }}
        />

        <div
          style={{
            background: C.white,
            borderRadius: "24px",
            padding: "48px 40px",
            maxWidth: "500px",
            width: "100%",
            textAlign: "center",
            boxShadow:
              "0 20px 60px rgba(74, 77, 201, 0.08), 0 1px 3px rgba(0,0,0,0.04)",
            animation: "bounceIn 0.7s ease-out",
            border: `1.5px solid ${C.greyLight}`,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60px",
              height: "4px",
              background: `linear-gradient(90deg, ${C.purple}, ${C.orangeMid})`,
              borderRadius: "0 0 4px 4px",
            }}
          />

          <div
            style={{
              fontSize: "56px",
              marginBottom: "12px",
              animation: "popIn 0.5s ease-out 0.3s both",
            }}
          >
            🎉
          </div>

          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: "28px",
              color: C.purpleDark,
              margin: "0 0 8px 0",
              animation: "fadeInUp 0.5s ease-out 0.4s both",
            }}
          >
            All Done!
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: C.textSecondary,
              margin: "0 0 28px 0",
              lineHeight: "1.6",
              animation: "fadeInUp 0.5s ease-out 0.55s both",
              fontWeight: 500,
            }}
          >
            You solved{" "}
            <strong style={{ color: C.success, fontWeight: 700 }}>
              {score}
            </strong>{" "}
            out of{" "}
            <strong style={{ fontWeight: 700 }}>{problems.length}</strong>{" "}
            problems correctly on first try.
          </p>

          <div
            style={{
              background: C.peach,
              borderRadius: "16px",
              padding: "20px 24px",
              marginBottom: "28px",
              border: `1.5px solid ${C.orangeMid}44`,
              animation: "fadeInUp 0.5s ease-out 0.7s both",
              position: "relative",
            }}
          >
            <ShapeDecor
              type="triangle"
              size={24}
              color={C.orangeMid}
              filled
              style={{
                position: "absolute",
                top: "-12px",
                right: "20px",
                opacity: 0.6,
              }}
            />
            <p
              style={{
                fontWeight: 700,
                fontSize: "13px",
                textTransform: "uppercase" as const,
                letterSpacing: "1.2px",
                color: C.orange,
                margin: "0 0 6px 0",
              }}
            >
              Key Takeaway
            </p>
            <p
              style={{
                fontSize: "14px",
                color: C.textPrimary,
                margin: 0,
                lineHeight: "1.55",
                fontWeight: 500,
              }}
            >
              The sign rules for division are the <em>same</em> as
              multiplication!
              <br />
              Same signs → positive · Different signs → negative
            </p>
          </div>

          <button
            onClick={handleReset}
            onMouseEnter={() => setHoverReset(true)}
            onMouseLeave={() => setHoverReset(false)}
            style={{
              ...pillBtn(
                `linear-gradient(135deg, ${C.purple}, ${C.purpleDark})`,
                C.white,
                false,
                hoverReset,
              ),
              fontSize: "16px",
              padding: "0 32px",
              height: "48px",
              lineHeight: "48px",
              animation: "fadeInUp 0.5s ease-out 0.9s both",
            }}
          >
            ↻ Try Again
          </button>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════
  // MAIN TOOL
  // ═════════════════════════════════════════════════════════════════════
  const progressPercent =
    ((currentProblemIndex + (submitted ? 1 : 0)) / problems.length) * 100;
  const signInfo = sameSign(currentProblem.dividend, currentProblem.divisor);
  const isCheckDisabled = inputValue.trim() === "";

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: C.greyBg,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 16px 110px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Background Shapes */}
      <ShapeDecor
        type="circle"
        size={200}
        color={C.lavender}
        filled
        style={{
          position: "fixed",
          top: "-80px",
          right: "-60px",
          opacity: 0.18,
          animation: "floatShape 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <ShapeDecor
        type="triangle"
        size={100}
        color={C.orange}
        filled={false}
        style={{
          position: "fixed",
          bottom: "140px",
          left: "-20px",
          opacity: 0.12,
          animation: "floatShape2 7s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <ShapeDecor
        type="square"
        size={70}
        color={C.lavender}
        filled={false}
        style={{
          position: "fixed",
          top: "35%",
          right: "-15px",
          opacity: 0.1,
          animation: "floatShape 9s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <ShapeDecor
        type="circle"
        size={50}
        color={C.orangeMid}
        filled={false}
        style={{
          position: "fixed",
          bottom: "200px",
          right: "50px",
          opacity: 0.1,
          animation: "floatShape2 6s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* ─── Header ─── */}
      <div
        style={{
          width: "100%",
          maxWidth: "580px",
          marginBottom: "20px",
          animation: "fadeInUp 0.4s ease-out",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(20px, 4.5vw, 26px)",
            color: C.purpleDark,
            textAlign: "center",
            margin: "0 0 18px 0",
            letterSpacing: "-0.3px",
          }}
        >
          {title}
        </h1>

        {/* Progress Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <span
            style={{
              fontWeight: 600,
              fontSize: "13px",
              color: C.textSecondary,
              whiteSpace: "nowrap",
            }}
          >
            {currentProblemIndex + 1} / {problems.length}
          </span>

          <div
            style={{
              flex: 1,
              height: "8px",
              background: C.greyLight,
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${C.purple}, ${C.orangeMid})`,
                borderRadius: "8px",
                transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2.5s infinite",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>

          {/* Step dots — elongated active dot (Singularity style) */}
          <div style={{ display: "flex", gap: "4px" }}>
            {problems.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === currentProblemIndex ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: completedProblems.has(i)
                    ? C.success
                    : i === currentProblemIndex
                      ? C.purple
                      : C.grey,
                  transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── Problem Card ─── */}
      <div
        style={{
          width: "100%",
          maxWidth: "580px",
          background: C.white,
          borderRadius: "20px",
          padding: "clamp(24px, 5vw, 36px)",
          boxShadow: submitted
            ? isCorrect
              ? `0 16px 48px rgba(46, 173, 94, 0.1), 0 0 0 2px ${C.success}`
              : `0 16px 48px rgba(224, 68, 68, 0.1), 0 0 0 2px ${C.error}`
            : "0 8px 32px rgba(74, 77, 201, 0.06), 0 1px 3px rgba(0,0,0,0.03)",
          border: submitted ? "none" : `1.5px solid ${C.greyLight}`,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          animation: shakeCard
            ? "shake 0.6s ease"
            : cardAnim
              ? "fadeInScale 0.45s ease-out"
              : "none",
          position: "relative",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        {/* Card top gradient accent (Singularity purple→orange) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: `linear-gradient(90deg, ${C.purple}, ${C.orangeMid})`,
          }}
        />

        {/* Status badge */}
        {submitted && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: isCorrect ? C.success : C.error,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "popIn 0.4s ease-out 0.15s both",
              boxShadow: isCorrect
                ? "0 4px 14px rgba(46, 173, 94, 0.3)"
                : "0 4px 14px rgba(224, 68, 68, 0.3)",
            }}
          >
            {isCorrect ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline
                  points="20 6 9 17 4 12"
                  style={{
                    strokeDasharray: 30,
                    animation: "checkDraw 0.35s ease-out 0.4s both",
                  }}
                />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
          </div>
        )}

        {/* Division Expression */}
        <div
          style={{ textAlign: "center", marginBottom: "6px", marginTop: "8px" }}
        >
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(28px, 7vw, 42px)",
              color: C.textPrimary,
              letterSpacing: "1px",
              lineHeight: "1.25",
              animation: cardAnim ? "fadeInUp 0.4s ease-out 0.1s both" : "none",
            }}
          >
            {formatExpression(currentProblem)}
          </div>
        </div>

        {/* Context note */}
        {currentProblem.context && (
          <p
            style={{
              textAlign: "center",
              fontStyle: "italic",
              color: C.textMuted,
              fontSize: "13px",
              margin: "0 0 18px 0",
              lineHeight: "1.45",
              fontWeight: 500,
              animation: cardAnim ? "fadeInUp 0.4s ease-out 0.2s both" : "none",
            }}
          >
            {currentProblem.context}
          </p>
        )}

        {/* Sign Hint Badge */}
        {!submitted && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "22px",
              animation: cardAnim
                ? "fadeInUp 0.4s ease-out 0.25s both"
                : "none",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 18px",
                borderRadius: "40px",
                fontSize: "12.5px",
                fontWeight: 600,
                background: signInfo ? C.successLight : C.errorLight,
                color: signInfo ? C.success : C.error,
                border: `1.5px solid ${signInfo ? C.success + "33" : C.error + "33"}`,
                letterSpacing: "0.2px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: signInfo ? C.success : C.error,
                  display: "inline-block",
                }}
              />
              {signInfo
                ? "Same signs → expect (+) quotient"
                : "Different signs → expect (−) quotient"}
            </span>
          </div>
        )}

        {/* ─── Input Area ─── */}
        {!submitted ? (
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              animation: cardAnim ? "fadeInUp 0.4s ease-out 0.3s both" : "none",
            }}
          >
            {/* Sign Toggle — Singularity outlined pill */}
            <div
              style={{
                display: "flex",
                borderRadius: "40px",
                overflow: "hidden",
                border: `2px solid ${C.purple}`,
                transition: "all 0.3s ease",
              }}
            >
              <button
                onClick={() => setSelectedSign("+")}
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: "22px",
                  padding: "0 18px",
                  height: "44px",
                  border: "none",
                  cursor: "pointer",
                  background: selectedSign === "+" ? C.purple : C.white,
                  color: selectedSign === "+" ? C.white : C.purple,
                  transition: "all 0.2s ease",
                  lineHeight: "44px",
                }}
              >
                +
              </button>
              <div style={{ width: "2px", background: C.purple }} />
              <button
                onClick={() => setSelectedSign("-")}
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: "22px",
                  padding: "0 18px",
                  height: "44px",
                  border: "none",
                  cursor: "pointer",
                  background: selectedSign === "-" ? C.purple : C.white,
                  color: selectedSign === "-" ? C.white : C.purple,
                  transition: "all 0.2s ease",
                  lineHeight: "44px",
                }}
              >
                −
              </button>
            </div>

            {/* Number Input */}
            <input
              ref={inputRef}
              type="number"
              min="0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="value"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "20px",
                fontWeight: 700,
                padding: "0 18px",
                height: "44px",
                borderRadius: "40px",
                border: `2px solid ${C.greyLight}`,
                outline: "none",
                width: "130px",
                textAlign: "center",
                color: C.textPrimary,
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                background: C.white,
                lineHeight: "44px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = C.purple;
                e.target.style.boxShadow = `0 0 0 3px ${C.purple}18`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = C.greyLight;
                e.target.style.boxShadow = "none";
              }}
            />

            {/* Check Button — Singularity highlight orange */}
            <button
              onClick={handleSubmit}
              disabled={isCheckDisabled}
              onMouseEnter={() => setHoverCheck(true)}
              onMouseLeave={() => setHoverCheck(false)}
              style={pillBtn(
                `linear-gradient(135deg, ${C.orange}, ${C.orangeMid})`,
                C.white,
                isCheckDisabled,
                hoverCheck,
              )}
            >
              Check ✓
            </button>
          </div>
        ) : (
          /* ─── Result Display ─── */
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                animation: "numberRoll 0.4s ease-out",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(20px, 5vw, 28px)",
                  color: isCorrect ? C.success : C.error,
                }}
              >
                {isCorrect ? "Correct! " : "Not quite. "}
              </span>
              {!isCorrect && (
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(18px, 4.5vw, 26px)",
                    color: C.textPrimary,
                  }}
                >
                  Answer: {currentProblem.quotient > 0 ? "+" : ""}
                  {currentProblem.quotient}
                </span>
              )}
            </div>

            {/* Multiplication Connection Panel — Singularity peach */}
            {showMultFact && (
              <div
                style={{
                  background: C.peach,
                  border: `1.5px solid ${C.orangeMid}44`,
                  borderRadius: "16px",
                  padding: "20px 24px",
                  margin: "16px 0",
                  animation: "slideDown 0.45s ease-out",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-8px",
                    left: "20px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: C.orangeMid,
                    opacity: 0.35,
                  }}
                />
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "11.5px",
                    textTransform: "uppercase" as const,
                    letterSpacing: "1.5px",
                    color: C.orange,
                    marginBottom: "8px",
                  }}
                >
                  🔗 Multiplication Connection
                </div>
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(19px, 5vw, 26px)",
                    color: C.textPrimary,
                    animation: "fadeInUp 0.35s ease-out 0.15s both",
                  }}
                >
                  {currentProblem.multiplicationFact}
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    color: C.textSecondary,
                    margin: "8px 0 0 0",
                    lineHeight: "1.45",
                    fontWeight: 500,
                    animation: "fadeInUp 0.35s ease-out 0.3s both",
                  }}
                >
                  Division undoes multiplication — the sign rules are the same!
                </p>
              </div>
            )}

            {/* Next Button — Singularity primary purple */}
            {showMultFact && (
              <button
                onClick={handleNext}
                onMouseEnter={() => setHoverNext(true)}
                onMouseLeave={() => setHoverNext(false)}
                style={{
                  ...pillBtn(
                    `linear-gradient(135deg, ${C.purple}, ${C.purpleDark})`,
                    C.white,
                    false,
                    hoverNext,
                  ),
                  fontSize: "15px",
                  padding: "0 30px",
                  height: "46px",
                  lineHeight: "46px",
                  animation: "fadeInUp 0.35s ease-out 0.4s both",
                  marginTop: "6px",
                }}
              >
                {currentProblemIndex < problems.length - 1
                  ? "Next Problem →"
                  : "See Results 🎉"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Instructions Panel */}
      {currentProblemIndex === 0 && !submitted && (
        <div
          style={{
            maxWidth: "580px",
            width: "100%",
            marginTop: "14px",
            padding: "14px 20px",
            background: C.white,
            borderRadius: "14px",
            border: `1.5px dashed ${C.lavender}`,
            animation: "fadeInUp 0.4s ease-out 0.5s both",
            position: "relative",
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: C.textSecondary,
              margin: 0,
              lineHeight: "1.6",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            <strong style={{ color: C.purple, fontWeight: 700 }}>
              How to play:
            </strong>{" "}
            First, predict the sign (+/−) using the toggle. Then enter the
            magnitude. Hit{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${C.orange}, ${C.orangeMid})`,
                color: C.white,
                padding: "1px 10px",
                borderRadius: "20px",
                fontWeight: 600,
                fontSize: "12px",
              }}
            >
              Check ✓
            </span>{" "}
            to see if you're right!
          </p>
        </div>
      )}

      {/* ─── Persistent Footer (Singularity deep purple gradient) ─── */}
      {showSignReminder && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: `linear-gradient(135deg, ${C.purpleDark}, ${C.purple})`,
            padding: "12px 20px",
            textAlign: "center",
            zIndex: 100,
            boxShadow: "0 -4px 24px rgba(83, 48, 134, 0.15)",
          }}
        >
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(12px, 2.8vw, 14.5px)",
              color: C.white,
              letterSpacing: "0.3px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                background: "rgba(255,255,255,0.12)",
                padding: "5px 16px",
                borderRadius: "40px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#7CEB9B",
                  display: "inline-block",
                }}
              />
              Same signs →{" "}
              <span style={{ color: "#7CEB9B", fontWeight: 700 }}>(+)</span>{" "}
              quotient
            </span>
            <span style={{ opacity: 0.3, fontSize: "16px" }}>·</span>
            <span
              style={{
                background: "rgba(255,255,255,0.12)",
                padding: "5px 16px",
                borderRadius: "40px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: C.orangeMid,
                  display: "inline-block",
                }}
              />
              Different signs →{" "}
              <span style={{ color: C.orangeMid, fontWeight: 700 }}>(−)</span>{" "}
              quotient
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DivisionSignRulesTool;
