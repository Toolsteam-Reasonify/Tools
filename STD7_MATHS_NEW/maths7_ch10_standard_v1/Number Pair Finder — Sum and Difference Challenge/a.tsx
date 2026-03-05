// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: rakesh_puzzle_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

// @ts-nocheck - React and lucide-react types resolved by project dependencies
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Check,
  X,
  Lightbulb,
  ChevronRight,
  RotateCcw,
  Award,
  Star,
  Plus,
} from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "practice";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface PuzzleProblem {
  id: string;
  sum: number;
  difference: number;
  firstNumber: number;
  secondNumber: number;
  hint: string;
}

interface TrialEntry {
  first: number;
  second: number;
  sumCorrect: boolean;
  diffCorrect: boolean;
  timestamp: number;
}

interface RakeshPuzzleAdditionalProps {
  problems?: PuzzleProblem[];
  maxHintAttempts?: number;
  showTeachingNotes?: boolean;
}

interface RakeshPuzzleToolProps {
  props?: {
    width?: number;
    height?: number;
    themeColor?: string;
    darkMode?: boolean;
    additionalProps?: RakeshPuzzleAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  // Primary palette
  primary: "#4A4DC9",
  primaryDark: "#3638A0",
  primaryLight: "#C1C1EA",
  primaryLightest: "#EEEEF8",

  // Accent / Highlight
  accent: "#FF7212",
  accentDark: "#E5600A",
  accentLight: "#FFF3E4",
  accentMid: "#FC9145",

  // Gradient
  gradientStart: "#533086",
  gradientEnd: "#FC9145",

  // Greys
  grey900: "#4E4E4E",
  grey600: "#7A7A7A",
  grey400: "#CACACA",
  grey200: "#EBEBEB",
  grey100: "#F5F5F5",
  white: "#FFFFFF",

  // Semantic
  success: "#2DB87A",
  successLight: "#E6F9F0",
  error: "#E5453E",
  errorLight: "#FDEDED",
  warning: "#F5A623",
  warningLight: "#FFF8EC",

  // Typography
  fontFamily: "'Poppins', 'Segoe UI', sans-serif",

  // Spacing / Radii (from button spec)
  radiusPill: 100,
  radiusLg: 16,
  radiusMd: 12,
  radiusSm: 8,
  paddingBtn: "10px 24px",
  heightBtn: 40,
};

// ==================== DEFAULT PROBLEMS ====================

const DEFAULT_PROBLEMS: PuzzleProblem[] = [
  {
    id: "p1",
    sum: 25,
    difference: 11,
    firstNumber: 18,
    secondNumber: 7,
    hint: "Both numbers are positive. Try numbers that add to 25, then check if the bigger minus the smaller gives 11.",
  },
  {
    id: "p2",
    sum: 4,
    difference: 12,
    firstNumber: 8,
    secondNumber: -4,
    hint: "The difference is bigger than the sum! One number must be negative. Think: First Number − Second Number = 12.",
  },
  {
    id: "p3",
    sum: 0,
    difference: 10,
    firstNumber: 5,
    secondNumber: -5,
    hint: "When the sum is 0, the two numbers are additive inverses of each other. What two opposite numbers differ by 10?",
  },
  {
    id: "p4",
    sum: -7,
    difference: -1,
    firstNumber: -4,
    secondNumber: -3,
    hint: "Both numbers are negative! A negative sum means both numbers are below zero. Try small negative numbers.",
  },
];

// ==================== CONFETTI COMPONENT ====================

const ConfettiBurst: React.FC<{ active: boolean }> = ({ active }) => {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      rotation: number;
      scale: number;
    }>
  >([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }
    const colors = [
      "#FF9933",
      "#FFFFFF",
      "#138808",
      "#FFD700",
      "#4A4DC9",
      "#FC9145",
      "#533086",
    ];
    const newParticles = Array.from({ length: 55 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 30,
      y: 35 + (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      scale: 0.4 + Math.random() * 0.8,
    }));
    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 3200);
    return () => clearTimeout(timer);
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${7 * p.scale}px`,
            height: `${7 * p.scale}px`,
            backgroundColor: p.color,
            borderRadius:
              p.id % 3 === 0 ? "50%" : p.id % 3 === 1 ? "2px" : "1px",
            transform: `rotate(${p.rotation}deg)`,
            animation: `confettiFall 2.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            animationDelay: `${Math.random() * 0.4}s`,
            opacity: 0.9,
          }}
        />
      ))}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const RakeshPuzzleTool: React.FC<RakeshPuzzleToolProps> = ({
  props: propsIn,
  setStepDetails,
}) => {
  const props = propsIn ?? ({} as NonNullable<RakeshPuzzleToolProps["props"]>);
  const additionalProps = (props.additionalProps ??
    {}) as RakeshPuzzleAdditionalProps;
  const problems: PuzzleProblem[] =
    additionalProps.problems ?? DEFAULT_PROBLEMS;
  const maxHintAttempts = additionalProps.maxHintAttempts || 2;

  // State
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [firstInput, setFirstInput] = useState("");
  const [secondInput, setSecondInput] = useState("");
  const [trials, setTrials] = useState<Map<string, TrialEntry[]>>(new Map());
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState<Map<string, boolean>>(new Map());
  const [showConfetti, setShowConfetti] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const [justSolved, setJustSolved] = useState(false);
  const [animateEntry, setAnimateEntry] = useState(false);
  const [windowWidth, setWindowWidth] = useState(800);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const trialTableRef = useRef<HTMLDivElement>(null);

  const currentProblem = problems[currentProblemIndex];
  const currentTrials = trials.get(currentProblem.id) || [];
  const isSolved = solved.has(currentProblem.id);
  const hintVisible = showHint.get(currentProblem.id) || false;
  const failedAttempts = currentTrials.filter(
    (t) => !(t.sumCorrect && t.diffCorrect),
  ).length;

  // Responsive
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 680;

  // Inject keyframes + Poppins font
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.id = "rakesh-puzzle-singularity-keyframes";
    styleSheet.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeInScale {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
            @keyframes popIn {
                0% { transform: scale(0); opacity: 0; }
                60% { transform: scale(1.08); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                15% { transform: translateX(-5px); }
                30% { transform: translateX(5px); }
                45% { transform: translateX(-3px); }
                60% { transform: translateX(3px); }
                75% { transform: translateX(-2px); }
                90% { transform: translateX(2px); }
            }
            @keyframes confettiFall {
                0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
                100% { transform: translateY(420px) rotate(800deg) scale(0.2); opacity: 0; }
            }
            @keyframes glowPulse {
                0%, 100% { box-shadow: 0 0 8px rgba(45,184,122,0.25); }
                50% { box-shadow: 0 0 20px rgba(45,184,122,0.5); }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            @keyframes starBounce {
                0% { transform: scale(0) rotate(-180deg); }
                60% { transform: scale(1.2) rotate(8deg); }
                100% { transform: scale(1) rotate(0deg); }
            }
            @keyframes rowSlideIn {
                from { opacity: 0; transform: translateX(-16px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes hintReveal {
                from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes dotBounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.15); }
            }
        `;
    document.head.appendChild(styleSheet);
    return () => {
      const el = document.getElementById("rakesh-puzzle-singularity-keyframes");
      if (el) document.head.removeChild(el);
    };
  }, []);

  // Report step details
  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: currentProblemIndex + 1,
        totalSteps: problems.length,
        isPaused: true,
        currentMode: "practice",
      });
    }
  }, [currentProblemIndex, problems.length, setStepDetails]);

  // Animate on problem change
  useEffect(() => {
    setAnimateEntry(true);
    const t = setTimeout(() => setAnimateEntry(false), 600);
    return () => clearTimeout(t);
  }, [currentProblemIndex]);

  // Check guess
  const handleCheck = useCallback(() => {
    const first = parseInt(firstInput, 10);
    const second = parseInt(secondInput, 10);
    if (isNaN(first) || isNaN(second)) return;

    const sumCorrect = first + second === currentProblem.sum;
    const diffCorrect = first - second === currentProblem.difference;
    const entry: TrialEntry = {
      first,
      second,
      sumCorrect,
      diffCorrect,
      timestamp: Date.now(),
    };

    setTrials((prev) => {
      const next = new Map(prev);
      const arr = next.get(currentProblem.id) || [];
      next.set(currentProblem.id, [...arr, entry]);
      return next;
    });

    if (sumCorrect && diffCorrect) {
      setSolved((prev) => new Set(prev).add(currentProblem.id));
      setShowConfetti(true);
      setJustSolved(true);
      setTimeout(() => setShowConfetti(false), 3200);
      setTimeout(() => setJustSolved(false), 2200);
    } else {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);
    }

    setFirstInput("");
    setSecondInput("");
    setTimeout(() => {
      if (trialTableRef.current)
        trialTableRef.current.scrollTop = trialTableRef.current.scrollHeight;
    }, 120);
  }, [firstInput, secondInput, currentProblem]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleCheck();
    },
    [handleCheck],
  );

  const goToNext = useCallback(() => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex((i) => i + 1);
      setFirstInput("");
      setSecondInput("");
    }
  }, [currentProblemIndex, problems.length]);

  const handleHint = useCallback(() => {
    setShowHint((prev) => {
      const next = new Map(prev);
      next.set(currentProblem.id, true);
      return next;
    });
  }, [currentProblem.id]);

  const handleReset = useCallback(() => {
    setCurrentProblemIndex(0);
    setTrials(new Map());
    setSolved(new Set());
    setShowHint(new Map());
    setFirstInput("");
    setSecondInput("");
  }, []);

  const allSolved = problems.every((p) => solved.has(p.id));

  const formatNum = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `${n}`);

  const canSubmit = firstInput !== "" && secondInput !== "";

  // ==================== RENDER ====================

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 920,
        margin: "0 auto",
        fontFamily: DS.fontFamily,
        position: "relative",
        background: DS.white,
        borderRadius: DS.radiusLg + 4,
        overflow: "hidden",
        border: `2px solid ${DS.grey200}`,
        boxShadow:
          "0 4px 24px rgba(74,77,201,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <ConfettiBurst active={showConfetti} />

      {/* ═══════════ HEADER ═══════════ */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.gradientStart} 0%, ${DS.primary} 40%, ${DS.accentMid} 100%)`,
          backgroundSize: "200% 200%",
          animation: "gradientShift 8s ease infinite",
          padding: isMobile ? "18px 18px 16px" : "22px 28px 20px",
          color: DS.white,
          position: "relative",
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.06,
            backgroundImage: `radial-gradient(circle at 20% 50%, ${DS.white} 1px, transparent 1px), radial-gradient(circle at 80% 20%, ${DS.white} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 2,
            }}
          >
            <span style={{ fontSize: isMobile ? 22 : 26 }}>🧩</span>
            <span
              style={{
                fontSize: isMobile ? 20 : 24,
                fontWeight: 700,
                letterSpacing: -0.3,
              }}
            >
              Rakesh's Puzzle
            </span>
          </div>
          <div
            style={{
              fontSize: isMobile ? 12 : 13,
              opacity: 0.8,
              fontWeight: 500,
              marginLeft: isMobile ? 0 : 36,
            }}
          >
            Find two numbers from their Sum & Difference
          </div>

          {/* ── Progress Dots ── */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 16,
              alignItems: "center",
            }}
          >
            {problems.map((p, i) => {
              const done = solved.has(p.id);
              const active = i === currentProblemIndex;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setCurrentProblemIndex(i);
                    setFirstInput("");
                    setSecondInput("");
                  }}
                  style={{
                    width: active ? 36 : 28,
                    height: active ? 36 : 28,
                    borderRadius: "50%",
                    border:
                      active && !done
                        ? `2.5px solid ${DS.white}`
                        : "2px solid transparent",
                    background: done
                      ? DS.success
                      : active
                        ? "rgba(255,255,255,0.95)"
                        : "rgba(255,255,255,0.2)",
                    color: done
                      ? DS.white
                      : active
                        ? DS.primary
                        : "rgba(255,255,255,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: active ? 14 : 12,
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                    animation: active ? "dotBounce 0.4s ease-out" : "none",
                    outline: "none",
                    padding: 0,
                    flexShrink: 0,
                    fontFamily: DS.fontFamily,
                  }}
                >
                  {done ? (
                    <Check size={active ? 16 : 13} strokeWidth={3} />
                  ) : (
                    i + 1
                  )}
                </button>
              );
            })}
            {allSolved && (
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  animation: "starBounce 0.6s ease-out",
                }}
              >
                <Star size={16} fill="#FFD700" color="#FFD700" />
                <span style={{ fontSize: 12, fontWeight: 700 }}>
                  All Clear!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════ MAIN BODY ═══════════ */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          minHeight: isMobile ? "auto" : 400,
        }}
      >
        {/* ── LEFT PANEL — Puzzle Clues ── */}
        <div
          style={{
            flex: isMobile ? "none" : "0 0 42%",
            padding: isMobile ? "20px 18px" : "28px 24px",
            borderRight: isMobile ? "none" : `1.5px solid ${DS.grey200}`,
            borderBottom: isMobile ? `1.5px solid ${DS.grey200}` : "none",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            animation: animateEntry ? "fadeInUp 0.45s ease-out" : "none",
            background: DS.grey100,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: DS.primary,
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            Puzzle {currentProblemIndex + 1} of {problems.length}
          </div>

          {/* Sum Card */}
          <div
            style={{
              background: DS.white,
              borderRadius: DS.radiusMd,
              padding: isMobile ? "16px 18px" : "18px 22px",
              border: `1.5px solid ${DS.primaryLight}`,
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: DS.radiusSm,
                  background: DS.primaryLightest,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus size={14} color={DS.primary} strokeWidth={3} />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: DS.grey600,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Sum
              </span>
            </div>
            <div
              style={{
                fontSize: isMobile ? 38 : 46,
                fontWeight: 800,
                color: DS.primary,
                lineHeight: 1,
                letterSpacing: -1,
              }}
            >
              {formatNum(currentProblem.sum)}
            </div>
            <div
              style={{
                fontSize: 11,
                color: DS.grey400,
                marginTop: 6,
                fontWeight: 500,
              }}
            >
              First Number + Second Number
            </div>
          </div>

          {/* Difference Card */}
          <div
            style={{
              background: DS.white,
              borderRadius: DS.radiusMd,
              padding: isMobile ? "16px 18px" : "18px 22px",
              border: `1.5px solid ${DS.accentLight}`,
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: DS.radiusSm,
                  background: DS.accentLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 800,
                  color: DS.accent,
                }}
              >
                −
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: DS.grey600,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Difference
              </span>
            </div>
            <div
              style={{
                fontSize: isMobile ? 38 : 46,
                fontWeight: 800,
                color: DS.accent,
                lineHeight: 1,
                letterSpacing: -1,
              }}
            >
              {formatNum(currentProblem.difference)}
            </div>
            <div
              style={{
                fontSize: 11,
                color: DS.grey400,
                marginTop: 6,
                fontWeight: 500,
              }}
            >
              First Number − Second Number
            </div>
          </div>

          {/* Hint Button — Outlined style */}
          {!isSolved && failedAttempts >= maxHintAttempts && !hintVisible && (
            <button
              onClick={handleHint}
              onMouseEnter={() => setHoveredBtn("hint")}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: hoveredBtn === "hint" ? DS.warningLight : DS.white,
                color: "#92400E",
                border: `1.5px solid ${DS.warning}`,
                borderRadius: DS.radiusPill,
                padding: DS.paddingBtn,
                height: DS.heightBtn,
                fontFamily: DS.fontFamily,
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.25s ease",
                animation: "fadeInUp 0.35s ease-out",
                outline: "none",
              }}
            >
              <Lightbulb size={16} />
              Need a Hint?
            </button>
          )}

          {/* Hint Text */}
          {hintVisible && !isSolved && (
            <div
              style={{
                background: DS.warningLight,
                border: `1.5px solid ${DS.warning}40`,
                borderRadius: DS.radiusMd,
                padding: "14px 16px",
                fontSize: 12,
                lineHeight: 1.7,
                color: "#78350F",
                fontWeight: 500,
                animation: "hintReveal 0.35s ease-out",
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
                <Lightbulb size={14} color={DS.warning} fill={DS.warning} />
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: DS.warning,
                  }}
                >
                  Hint
                </span>
              </div>
              {currentProblem.hint}
            </div>
          )}

          {/* Solved Badge */}
          {isSolved && (
            <div
              style={{
                background: DS.successLight,
                border: `1.5px solid ${DS.success}30`,
                borderRadius: DS.radiusMd,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                animation: "popIn 0.45s ease-out",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: DS.success,
                  color: DS.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  animation: justSolved
                    ? "glowPulse 1.2s ease-in-out infinite"
                    : "none",
                }}
              >
                <Check size={20} strokeWidth={3} />
              </div>
              <div>
                <div
                  style={{ fontWeight: 700, color: "#065F46", fontSize: 14 }}
                >
                  Solved!
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#047857",
                    fontWeight: 500,
                    marginTop: 2,
                  }}
                >
                  The pair is{" "}
                  <strong>
                    ({formatNum(currentProblem.firstNumber)},{" "}
                    {formatNum(currentProblem.secondNumber)})
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Next Puzzle Button — Contained gradient style */}
          {isSolved && currentProblemIndex < problems.length - 1 && (
            <button
              onClick={goToNext}
              onMouseEnter={() => setHoveredBtn("next")}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background:
                  hoveredBtn === "next"
                    ? DS.accent
                    : `linear-gradient(135deg, ${DS.gradientStart} 0%, ${DS.accentMid} 100%)`,
                color: DS.white,
                border: "none",
                borderRadius: DS.radiusPill,
                padding: DS.paddingBtn,
                height: DS.heightBtn,
                fontFamily: DS.fontFamily,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.25s ease",
                animation: "fadeInUp 0.4s ease-out 0.2s both",
                outline: "none",
                transform: hoveredBtn === "next" ? "scale(1.03)" : "scale(1)",
              }}
            >
              Next Puzzle <ChevronRight size={16} />
            </button>
          )}
        </div>

        {/* ── RIGHT PANEL — Input & Trial Table ── */}
        <div
          style={{
            flex: 1,
            padding: isMobile ? "20px 18px" : "28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            animation: animateEntry
              ? "fadeInUp 0.45s ease-out 0.08s both"
              : "none",
            background: DS.white,
          }}
        >
          {/* Input Area */}
          {!isSolved && (
            <div
              style={{
                animation: shakeInput ? "shake 0.4s ease-out" : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                {/* First Number Input */}
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: DS.grey600,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginBottom: 6,
                      display: "block",
                    }}
                  >
                    First Number
                  </label>
                  <input
                    type="number"
                    value={firstInput}
                    onChange={(e) => setFirstInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder=""
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: 18,
                      fontWeight: 600,
                      fontFamily: DS.fontFamily,
                      border: `2px solid ${DS.grey200}`,
                      borderRadius: DS.radiusMd,
                      outline: "none",
                      transition: "all 0.25s ease",
                      background: DS.grey100,
                      color: DS.grey900,
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = DS.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${DS.primaryLight}`;
                      e.target.style.background = DS.white;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = DS.grey200;
                      e.target.style.boxShadow = "none";
                      e.target.style.background = DS.grey100;
                    }}
                  />
                </div>

                {/* Second Number Input */}
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: DS.grey600,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginBottom: 6,
                      display: "block",
                    }}
                  >
                    Second Number
                  </label>
                  <input
                    type="number"
                    value={secondInput}
                    onChange={(e) => setSecondInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder=""
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: 18,
                      fontWeight: 600,
                      fontFamily: DS.fontFamily,
                      border: `2px solid ${DS.grey200}`,
                      borderRadius: DS.radiusMd,
                      outline: "none",
                      transition: "all 0.25s ease",
                      background: DS.grey100,
                      color: DS.grey900,
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = DS.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${DS.primaryLight}`;
                      e.target.style.background = DS.white;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = DS.grey200;
                      e.target.style.boxShadow = "none";
                      e.target.style.background = DS.grey100;
                    }}
                  />
                </div>
              </div>

              {/* Check Button — Highlight/Contained accent style */}
              <button
                onClick={handleCheck}
                disabled={!canSubmit}
                onMouseEnter={() => canSubmit && setHoveredBtn("check")}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  width: "100%",
                  marginTop: 14,
                  padding: "0 24px",
                  height: 44,
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: DS.fontFamily,
                  color: DS.white,
                  background: !canSubmit
                    ? DS.grey400
                    : hoveredBtn === "check"
                      ? DS.accentDark
                      : DS.accent,
                  border: "none",
                  borderRadius: DS.radiusPill,
                  cursor: !canSubmit ? "not-allowed" : "pointer",
                  transition: "all 0.25s ease",
                  outline: "none",
                  transform:
                    hoveredBtn === "check" ? "scale(1.02)" : "scale(1)",
                  boxShadow:
                    hoveredBtn === "check"
                      ? `0 4px 16px ${DS.accent}50`
                      : canSubmit
                        ? `0 2px 8px ${DS.accent}30`
                        : "none",
                  letterSpacing: 0.3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Check size={16} strokeWidth={3} />
                Check My Guess
              </button>
            </div>
          )}

          {/* ── Trial Table ── */}
          {currentTrials.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: DS.grey600,
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                  marginBottom: 8,
                }}
              >
                Your Attempts
              </div>
              <div
                ref={trialTableRef}
                style={{
                  maxHeight: 210,
                  overflowY: "auto",
                  borderRadius: DS.radiusMd,
                  border: `1.5px solid ${DS.grey200}`,
                  overflow: "hidden",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                    fontFamily: DS.fontFamily,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: DS.grey100,
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                      }}
                    >
                      {[
                        "1st",
                        "2nd",
                        `Sum (${formatNum(currentProblem.sum)})`,
                        `Diff (${formatNum(currentProblem.difference)})`,
                      ].map((h, i) => (
                        <th
                          key={i}
                          style={{
                            padding: "10px 6px",
                            fontWeight: 700,
                            color: DS.grey600,
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: 0.6,
                            textAlign: "center",
                            borderBottom: `1.5px solid ${DS.grey200}`,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentTrials.map((trial, idx) => {
                      const allCorrect = trial.sumCorrect && trial.diffCorrect;
                      return (
                        <tr
                          key={idx}
                          style={{
                            background: allCorrect ? DS.successLight : DS.white,
                            animation: `rowSlideIn 0.3s ease-out ${idx * 0.04}s both`,
                            transition: "background 0.25s ease",
                          }}
                        >
                          <td
                            style={{
                              padding: "9px 6px",
                              textAlign: "center",
                              fontWeight: 600,
                              color: DS.grey900,
                              borderBottom: `1px solid ${DS.grey100}`,
                            }}
                          >
                            {formatNum(trial.first)}
                          </td>
                          <td
                            style={{
                              padding: "9px 6px",
                              textAlign: "center",
                              fontWeight: 600,
                              color: DS.grey900,
                              borderBottom: `1px solid ${DS.grey100}`,
                            }}
                          >
                            {formatNum(trial.second)}
                          </td>
                          <td
                            style={{
                              padding: "9px 6px",
                              textAlign: "center",
                              borderBottom: `1px solid ${DS.grey100}`,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 3,
                                padding: "2px 10px",
                                borderRadius: DS.radiusPill,
                                background: trial.sumCorrect
                                  ? DS.successLight
                                  : DS.accentLight,
                                color: trial.sumCorrect ? "#065F46" : "#9A3412",
                                fontWeight: 600,
                                fontSize: 11,
                              }}
                            >
                              {trial.sumCorrect ? (
                                <Check size={12} strokeWidth={3} />
                              ) : (
                                <X size={12} strokeWidth={3} />
                              )}
                              {formatNum(trial.first + trial.second)}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "9px 6px",
                              textAlign: "center",
                              borderBottom: `1px solid ${DS.grey100}`,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 3,
                                padding: "2px 10px",
                                borderRadius: DS.radiusPill,
                                background: trial.diffCorrect
                                  ? DS.successLight
                                  : DS.accentLight,
                                color: trial.diffCorrect
                                  ? "#065F46"
                                  : "#9A3412",
                                fontWeight: 600,
                                fontSize: 11,
                              }}
                            >
                              {trial.diffCorrect ? (
                                <Check size={12} strokeWidth={3} />
                              ) : (
                                <X size={12} strokeWidth={3} />
                              )}
                              {formatNum(trial.first - trial.second)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {currentTrials.length === 0 && !isSolved && (
            <div
              style={{
                textAlign: "center",
                padding: "28px 16px",
                color: DS.grey400,
                fontSize: 13,
                fontWeight: 500,
                lineHeight: 1.7,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: DS.primaryLightest,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  fontSize: 22,
                }}
              >
                🔍
              </div>
              Enter your guesses above.
              <br />
              Your attempts will appear here.
            </div>
          )}

          {/* Instructions Footer */}
          <div
            style={{
              fontSize: 11,
              color: DS.grey600,
              fontWeight: 500,
              lineHeight: 1.6,
              marginTop: "auto",
              padding: "10px 14px",
              background: DS.grey100,
              borderRadius: DS.radiusSm,
              border: `1px solid ${DS.grey200}`,
            }}
          >
            <strong style={{ color: DS.grey900 }}>Remember:</strong> Difference
            = First Number − Second Number. Negative numbers are allowed!
          </div>
        </div>
      </div>

      {/* ═══════════ ALL SOLVED CELEBRATION ═══════════ */}
      {allSolved && (
        <div
          style={{
            background: `linear-gradient(135deg, ${DS.successLight} 0%, #F0FDF4 100%)`,
            padding: isMobile ? "18px 18px" : "22px 28px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            borderTop: `1.5px solid ${DS.success}25`,
            animation: "fadeInUp 0.45s ease-out",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${DS.success} 0%, #34D399 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse 1.8s infinite",
              flexShrink: 0,
            }}
          >
            <Award size={24} color={DS.white} />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div
              style={{
                fontSize: isMobile ? 17 : 20,
                fontWeight: 700,
                color: "#065F46",
              }}
            >
              Excellent Work! 🎉
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#047857",
                fontWeight: 500,
                marginTop: 2,
              }}
            >
              You solved all {problems.length} puzzles. You've mastered Rakesh's
              Puzzle method!
            </div>
          </div>
          {/* Outlined button */}
          <button
            onClick={handleReset}
            onMouseEnter={() => setHoveredBtn("reset")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: DS.paddingBtn,
              height: DS.heightBtn,
              background:
                hoveredBtn === "reset" ? DS.primaryLightest : DS.white,
              color: DS.primary,
              border: `1.5px solid ${DS.primary}`,
              borderRadius: DS.radiusPill,
              fontFamily: DS.fontFamily,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.25s ease",
              outline: "none",
            }}
          >
            <RotateCcw size={14} /> Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default RakeshPuzzleTool;
