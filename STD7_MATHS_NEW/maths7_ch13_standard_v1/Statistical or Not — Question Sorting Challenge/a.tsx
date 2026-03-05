// @ts-ignore - React types resolved by project/bundler
import React, { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════

interface IconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

interface QuestionCard {
  id: number;
  text: string;
  isStatistical: boolean;
  explanation: string;
  hint: string;
  icon: string;
}

interface AdditionalProps {
  questions?: QuestionCard[];
  themeColor?: string;
  title?: string;
  subtitle?: string;
}

interface ToolProps {
  props?: {
    width?: number;
    height?: number;
    themeColor?: string;
    darkMode?: boolean;
    additionalProps?: AdditionalProps;
  };
  setStepDetails?: (details: unknown) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (val: boolean) => void;
}

type SortStatus = "unsorted" | "correct" | "incorrect";
type DragBin = "statistical" | "nonstatistical" | null;

interface CardState {
  id: number;
  status: SortStatus;
  placedIn: DragBin;
  shaking: boolean;
  celebrating: boolean;
}

interface ConfettiPieceData {
  x: number;
  color: string;
  delay: number;
  size: number;
}

interface SingularityButtonProps {
  children: React.ReactNode;
  variant?: "contained" | "outlined" | "text";
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  highlight?: boolean;
  style?: React.CSSProperties;
}

// ═══════════════════════════════════════════════════════════════════
// INLINE SVG ICONS (replacing lucide-react to avoid import errors)
// ═══════════════════════════════════════════════════════════════════

const IconBarChart: React.FC<IconProps> = ({
  size = 18,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const IconCalculator: React.FC<IconProps> = ({
  size = 18,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="16" y1="14" x2="16" y2="18" />
    <line x1="8" y1="11" x2="8" y2="11.01" />
    <line x1="12" y1="11" x2="12" y2="11.01" />
    <line x1="16" y1="11" x2="16" y2="11.01" />
    <line x1="8" y1="15" x2="8" y2="15.01" />
    <line x1="12" y1="15" x2="12" y2="15.01" />
    <line x1="8" y1="19" x2="8" y2="19.01" />
    <line x1="12" y1="19" x2="12" y2="19.01" />
  </svg>
);

const IconCheck: React.FC<IconProps> = ({
  size = 16,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconRefresh: React.FC<IconProps> = ({
  size = 14,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const IconTrophy: React.FC<IconProps> = ({
  size = 22,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 22V8a6 6 0 0 0-6-6h16a6 6 0 0 0-6 6v14" />
  </svg>
);

const IconSparkles: React.FC<IconProps> = ({
  size = 14,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

const IconChevronDown: React.FC<IconProps> = ({
  size = 14,
  color = "currentColor",
  style = {},
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconInfo: React.FC<IconProps> = ({
  size = 18,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════
// DESIGN SYSTEM — Singularity Theme
// ═══════════════════════════════════════════════════════════════════

const DS = {
  // Primary
  purple: "#4A4DC9",
  orange: "#FF7212",
  // Deep
  deepPurple: "#533086",
  deepOrange: "#FC9145",
  // Tints
  softPurple: "#C1C1EA",
  softOrange: "#FFF3E4",
  // Neutrals
  dark: "#4E4E4E",
  gray: "#CACACA",
  lightGray: "#EBEBEB",
  offWhite: "#F5F5F5",
  // Functional
  success: "#2EAE6D",
  error: "#D94444",
  // Gradients
  gradPurpleOrange: "linear-gradient(135deg, #533086 0%, #FC9145 100%)",
  gradPurple: "linear-gradient(135deg, #4A4DC9 0%, #533086 100%)",
  gradOrange: "linear-gradient(135deg, #FF7212 0%, #FC9145 100%)",
  // Font
  font: "'Poppins', sans-serif",
  // Radius
  radius: {
    sm: 8,
    md: 14,
    lg: 20,
    pill: 999,
  } as const,
} as const;

// ═══════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ═══════════════════════════════════════════════════════════════════

const DEFAULT_QUESTIONS: QuestionCard[] = [
  {
    id: 1,
    text: "How many students in Grade 7 walk to school?",
    isStatistical: true,
    explanation:
      "This is statistical because answers vary from student to student — you must collect data from multiple students to answer it.",
    hint: "Would every student give the same answer?",
    icon: "🚶",
  },
  {
    id: 2,
    text: "What is 7 × 8?",
    isStatistical: false,
    explanation:
      "Not statistical — this has exactly ONE fixed answer (56). No data collection or variability involved.",
    hint: "Does this have one fixed answer?",
    icon: "✖️",
  },
  {
    id: 3,
    text: "What are the prices of onions at different shops in the sabzi mandi this week?",
    isStatistical: true,
    explanation:
      "Statistical! Prices vary from shop to shop and change over time. You need to collect data from multiple shops to answer this.",
    hint: "Would prices be the same at every shop?",
    icon: "🧅",
  },
  {
    id: 4,
    text: "How many legs does a spider have?",
    isStatistical: false,
    explanation:
      "Not statistical — all spiders have exactly 8 legs. There is no variability; the answer is always the same.",
    hint: "Is the answer always the same for every spider?",
    icon: "🕷️",
  },
  {
    id: 5,
    text: "How much time do students in our class spend on homework each day?",
    isStatistical: true,
    explanation:
      "Statistical! Different students spend different amounts of time. This requires collecting data to understand the pattern.",
    hint: "Would every student spend the same time?",
    icon: "📚",
  },
  {
    id: 6,
    text: "What is the capital of Maharashtra?",
    isStatistical: false,
    explanation:
      "Not statistical — Mumbai is always the answer. This is a fixed fact with no variability.",
    hint: "Does the answer change depending on who you ask?",
    icon: "🗺️",
  },
  {
    id: 7,
    text: "What is the most popular sport among Grade 7 students at our school?",
    isStatistical: true,
    explanation:
      "Statistical! Different students prefer different sports. You need a survey (data collection) to find out which sport is most popular.",
    hint: "Would you need to ask multiple students?",
    icon: "🏏",
  },
  {
    id: 8,
    text: "How tall are the students in our school?",
    isStatistical: true,
    explanation:
      "Statistical! Heights vary from student to student. You need to measure multiple students and the answers will differ — classic variability!",
    hint: "Are all students the same height?",
    icon: "📏",
  },
];

// ═══════════════════════════════════════════════════════════════════
// KEYFRAME INJECTOR
// ═══════════════════════════════════════════════════════════════════

function injectKeyframes(): () => void {
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      15% { transform: translateX(-8px) rotate(-2deg); }
      30% { transform: translateX(8px) rotate(2deg); }
      45% { transform: translateX(-6px) rotate(-1deg); }
      60% { transform: translateX(6px) rotate(1deg); }
      75% { transform: translateX(-3px); }
    }
    @keyframes celebrate {
      0% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.06) rotate(-2deg); }
      50% { transform: scale(1.1) rotate(2deg); }
      75% { transform: scale(1.04) rotate(-1deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
    @keyframes popIn {
      0% { transform: scale(0.5); opacity: 0; }
      70% { transform: scale(1.04); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes slideDown {
      0% { transform: translateY(-16px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    @keyframes confetti {
      0% { transform: translateY(0) rotateZ(0deg); opacity: 1; }
      100% { transform: translateY(140px) rotateZ(720deg); opacity: 0; }
    }
    @keyframes bounceIn {
      0% { transform: translateY(24px); opacity: 0; }
      60% { transform: translateY(-6px); opacity: 1; }
      80% { transform: translateY(3px); }
      100% { transform: translateY(0); }
    }
    @keyframes hintPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .drag-card {
      cursor: grab;
      user-select: none;
      touch-action: none;
    }
    .drag-card:active { cursor: grabbing; }
  `;
  document.head.appendChild(style);
  return () => {
    document.head.removeChild(style);
  };
}

// ═══════════════════════════════════════════════════════════════════
// CONFETTI COMPONENT
// ═══════════════════════════════════════════════════════════════════

const ConfettiPiece: React.FC<ConfettiPieceData> = ({
  x,
  color,
  delay,
  size,
}) => (
  <div
    style={{
      position: "absolute",
      left: `${x}%`,
      top: 0,
      width: size,
      height: size,
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      backgroundColor: color,
      animation: `confetti ${1.2 + Math.random() * 0.8}s ease-out ${delay}s forwards`,
      zIndex: 100,
      pointerEvents: "none",
    }}
  />
);

// ═══════════════════════════════════════════════════════════════════
// BUTTON COMPONENT — Matches Singularity Design System
// ═══════════════════════════════════════════════════════════════════

const SingularityButton: React.FC<SingularityButtonProps> = ({
  children,
  variant = "contained",
  onClick,
  disabled = false,
  icon = null,
  highlight = false,
  style: extraStyle = {},
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const base: React.CSSProperties = {
    fontFamily: DS.font,
    fontSize: 13,
    fontWeight: 600,
    borderRadius: DS.radius.pill,
    padding: "10px 24px",
    cursor: disabled ? "default" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    transition: "all 0.2s ease",
    border: "none",
    outline: "none",
    opacity: disabled ? 0.45 : 1,
  };

  let specific: React.CSSProperties = {};
  if (highlight) {
    specific = {
      background: isPressed ? "#e5620f" : isHovered ? "#ff8533" : DS.orange,
      color: "white",
      boxShadow: isHovered
        ? "0 6px 20px rgba(255,114,18,0.35)"
        : "0 2px 10px rgba(255,114,18,0.2)",
    };
  } else if (variant === "contained") {
    specific = {
      background: isPressed ? "#3a3db0" : isHovered ? "#5558d4" : DS.purple,
      color: "white",
      boxShadow: isHovered
        ? "0 6px 20px rgba(74,77,201,0.35)"
        : "0 2px 10px rgba(74,77,201,0.2)",
    };
  } else if (variant === "outlined") {
    specific = {
      background: isHovered ? DS.softPurple + "33" : "transparent",
      color: DS.purple,
      border: `1.5px solid ${isHovered ? DS.purple : DS.softPurple}`,
    };
  } else {
    specific = {
      background: "transparent",
      color: isHovered ? DS.deepPurple : DS.purple,
      textDecoration: isHovered ? "underline" : "none",
    };
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{ ...base, ...specific, ...extraStyle }}
    >
      {icon && (
        <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      )}
      {children}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

const StatisticalQuestionsToolComponent: React.FC<ToolProps> = ({
  props = {} as NonNullable<ToolProps["props"]>,
}) => {
  const { additionalProps = {} } = props;

  const questions: QuestionCard[] =
    additionalProps.questions || DEFAULT_QUESTIONS;
  const title: string =
    additionalProps.title || "Statistical vs Non-Statistical Questions";
  const subtitle: string =
    additionalProps.subtitle ||
    "Chapter 5: Connecting the Dots — Grade 7 Mathematics";

  // Shuffle questions on mount
  const [shuffledQuestions] = useState<QuestionCard[]>(() => {
    const arr = [...questions];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const [cardStates, setCardStates] = useState<Map<number, CardState>>(() => {
    const map = new Map<number, CardState>();
    questions.forEach((q) => {
      map.set(q.id, {
        id: q.id,
        status: "unsorted",
        placedIn: null,
        shaking: false,
        celebrating: false,
      });
    });
    return map;
  });

  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [draggingOver, setDraggingOver] = useState<DragBin>(null);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [confettiPieces] = useState<ConfettiPieceData[]>(() =>
    Array.from({ length: 30 }, (_, i) => ({
      x: Math.random() * 100,
      color: [
        DS.purple,
        DS.orange,
        DS.deepPurple,
        DS.deepOrange,
        DS.softPurple,
      ][i % 5],
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 8,
    })),
  );

  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [expandedExplanation, setExpandedExplanation] = useState<number | null>(
    null,
  );
  const [hintCard, setHintCard] = useState<number | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const cleanup = injectKeyframes();
    setTimeout(() => setMounted(true), 100);
    return cleanup;
  }, []);

  const allSorted: boolean = Array.from<CardState>(cardStates.values()).every(
    (s) => s.status !== "unsorted",
  );
  const correctCount: number = Array.from<CardState>(cardStates.values()).filter(
    (s) => s.status === "correct",
  ).length;

  // ── DRAG LOGIC ──────────────────────────────────────────────────

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, id: number) => {
      const state = cardStates.get(id);
      if (state?.status === "correct") return;
      e.preventDefault();
      setDraggedId(id);
      setIsDragging(true);
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      setDragPos({ x: e.clientX, y: e.clientY });
    },
    [cardStates],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, id: number) => {
      const state = cardStates.get(id);
      if (state?.status === "correct") return;
      const touch = e.touches[0];
      setDraggedId(id);
      setIsDragging(true);
      dragStartPos.current = { x: touch.clientX, y: touch.clientY };
      setDragPos({ x: touch.clientX, y: touch.clientY });
    },
    [cardStates],
  );

  useEffect(() => {
    const detectBin = (clientX: number, clientY: number): void => {
      const statBin = document.getElementById("bin-statistical");
      const nonBin = document.getElementById("bin-nonstatistical");
      if (statBin) {
        const r = statBin.getBoundingClientRect();
        if (
          clientX >= r.left &&
          clientX <= r.right &&
          clientY >= r.top &&
          clientY <= r.bottom
        ) {
          setDraggingOver("statistical");
          return;
        }
      }
      if (nonBin) {
        const r = nonBin.getBoundingClientRect();
        if (
          clientX >= r.left &&
          clientX <= r.right &&
          clientY >= r.top &&
          clientY <= r.bottom
        ) {
          setDraggingOver("nonstatistical");
          return;
        }
      }
      setDraggingOver(null);
    };

    const handleMouseMove = (e: MouseEvent): void => {
      if (!isDragging) return;
      setDragPos({ x: e.clientX, y: e.clientY });
      detectBin(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent): void => {
      if (!isDragging) return;
      const touch = e.touches[0];
      setDragPos({ x: touch.clientX, y: touch.clientY });
      detectBin(touch.clientX, touch.clientY);
    };

    const handleEnd = (): void => {
      if (!isDragging || draggedId === null) {
        setIsDragging(false);
        setDraggedId(null);
        setDraggingOver(null);
        return;
      }
      if (draggingOver) dropCard(draggedId, draggingOver);
      setIsDragging(false);
      setDraggedId(null);
      setDraggingOver(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, draggedId, draggingOver]);

  const dropCard = useCallback(
    (id: number, bin: DragBin): void => {
      const question = questions.find((q) => q.id === id);
      if (!question || !bin) return;
      const isCorrect = (bin === "statistical") === question.isStatistical;

      setCardStates((prev) => {
        const next = new Map(prev);
        next.set(id, {
          id,
          status: isCorrect ? "correct" : "incorrect",
          placedIn: isCorrect ? bin : null,
          shaking: !isCorrect,
          celebrating: isCorrect,
        });
        return next;
      });

      if (!isCorrect) {
        setTimeout(() => {
          setCardStates((prev) => {
            const next = new Map(prev);
            const cur = next.get(id);
            if (cur)
              next.set(id, {
                ...cur,
                status: "unsorted",
                shaking: false,
                placedIn: null,
              });
            return next;
          });
          setHintCard(id);
          setTimeout(() => setHintCard(null), 3000);
        }, 700);
      } else {
        setTimeout(() => {
          setCardStates((prev) => {
            const next = new Map(prev);
            const cur = next.get(id);
            if (cur) next.set(id, { ...cur, celebrating: false });
            return next;
          });
        }, 800);
        setTimeout(() => {
          setCardStates((current) => {
            const allDone = Array.from<CardState>(current.values()).every(
              (s) => s.status === "correct",
            );
            if (allDone) {
              setShowConfetti(true);
              setTimeout(() => {
                setShowConfetti(false);
                setShowSummary(true);
              }, 2000);
            }
            return current;
          });
        }, 300);
      }
    },
    [questions],
  );

  const handleReset = (): void => {
    setShowSummary(false);
    setShowConfetti(false);
    setExpandedExplanation(null);
    setHintCard(null);
    setCardStates(() => {
      const map = new Map<number, CardState>();
      questions.forEach((q) => {
        map.set(q.id, {
          id: q.id,
          status: "unsorted",
          placedIn: null,
          shaking: false,
          celebrating: false,
        });
      });
      return map;
    });
  };

  // ── DERIVED STATE ───────────────────────────────────────────────

  const draggedQuestion: QuestionCard | undefined =
    draggedId !== null ? questions.find((q) => q.id === draggedId) : undefined;

  const sortedInBin = (bin: "statistical" | "nonstatistical"): QuestionCard[] =>
    shuffledQuestions.filter((q) => {
      const state = cardStates.get(q.id);
      return state?.status === "correct" && state.placedIn === bin;
    });

  const unsortedCards: QuestionCard[] = shuffledQuestions.filter((q) => {
    const s = cardStates.get(q.id);
    return s?.status === "unsorted" || s?.status === "incorrect";
  });

  const isStatBin: boolean = draggingOver === "statistical";
  const isNonBin: boolean = draggingOver === "nonstatistical";

  // ── STYLES ──────────────────────────────────────────────────────

  const getCardStyle = (
    state: CardState,
    question: QuestionCard,
  ): React.CSSProperties => {
    const isDragged = draggedId === question.id;
    const isShaking = state.shaking;
    const isCelebrating = state.celebrating;
    const isCorrect = state.status === "correct";
    const isHinted = hintCard === question.id;

    return {
      background: isCorrect ? "#f0faf5" : isShaking ? "#fef2f2" : "white",
      border: `2px solid ${isCorrect ? DS.success : isShaking ? DS.error : DS.lightGray}`,
      borderRadius: DS.radius.md,
      padding: "14px 16px",
      cursor: isCorrect ? "default" : "grab",
      opacity: isDragged ? 0.25 : 1,
      transition: isShaking
        ? "none"
        : "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      animation: isShaking
        ? "shake 0.6s ease-in-out"
        : isCelebrating
          ? "celebrate 0.6s ease-in-out"
          : isHinted
            ? "hintPulse 1s ease-in-out infinite"
            : undefined,
      boxShadow: isCorrect
        ? "0 4px 16px rgba(46,174,109,0.2)"
        : isHinted
          ? `0 0 0 3px ${DS.deepOrange}55, 0 4px 16px rgba(0,0,0,0.06)`
          : "0 2px 12px rgba(74,77,201,0.08)",
      userSelect: "none" as const,
      position: "relative" as const,
    };
  };

  const getBinStyle = (
    type: "statistical" | "nonstatistical",
    isHovering: boolean,
  ): React.CSSProperties => ({
    flex: 1,
    minWidth: 240,
    background:
      type === "statistical"
        ? isHovering
          ? `${DS.softPurple}44`
          : `${DS.softPurple}22`
        : isHovering
          ? DS.softOrange
          : `${DS.softOrange}88`,
    border: `2px dashed ${
      type === "statistical"
        ? isHovering
          ? DS.purple
          : DS.softPurple
        : isHovering
          ? DS.orange
          : DS.deepOrange + "66"
    }`,
    borderRadius: DS.radius.lg,
    padding: 16,
    minHeight: 220,
    transition: "all 0.25s ease",
    transform: isHovering ? "scale(1.015)" : "scale(1)",
    boxShadow: isHovering
      ? `0 8px 30px ${type === "statistical" ? "rgba(74,77,201,0.2)" : "rgba(255,114,18,0.2)"}`
      : "0 2px 12px rgba(0,0,0,0.04)",
  });

  // ── RENDER ──────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: DS.font,
        background: DS.offWhite,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Confetti */}
      {showConfetti && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            pointerEvents: "none",
            zIndex: 999,
          }}
        >
          {confettiPieces.map((p, i) => (
            <ConfettiPiece key={i} {...p} />
          ))}
        </div>
      )}

      {/* Ghost drag element */}
      {isDragging && draggedQuestion && (
        <div
          style={{
            position: "fixed",
            left: dragPos.x - 130,
            top: dragPos.y - 40,
            width: 260,
            background: DS.gradPurpleOrange,
            color: "white",
            borderRadius: DS.radius.md,
            padding: "12px 16px",
            boxShadow: "0 20px 60px rgba(83,48,134,0.4)",
            zIndex: 9999,
            pointerEvents: "none",
            transform: "rotate(-2deg) scale(1.04)",
            opacity: 0.95,
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 20 }}>{draggedQuestion.icon}</span>
          <span style={{ lineHeight: 1.4 }}>{draggedQuestion.text}</span>
        </div>
      )}

      {/* ═══ HEADER ═══ */}
      <div
        style={{
          background: DS.gradPurpleOrange,
          backgroundSize: "200% 200%",
          animation: "gradientShift 8s ease infinite",
          padding: "28px 28px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative shapes */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: 60,
            width: 70,
            height: 70,
            border: "2px solid rgba(255,255,255,0.08)",
            transform: "rotate(45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 120,
            width: 0,
            height: 0,
            borderLeft: "20px solid transparent",
            borderRight: "20px solid transparent",
            borderBottom: "35px solid rgba(255,255,255,0.06)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(10px)",
                borderRadius: DS.radius.sm,
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <IconBarChart size={16} color="white" />
              <span
                style={{
                  color: "white",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                }}
              >
                Grade 7 Maths
              </span>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                borderRadius: DS.radius.sm,
                padding: "4px 10px",
                color: "rgba(255,255,255,0.85)",
                fontSize: 10.5,
                fontWeight: 500,
              }}
            >
              {subtitle}
            </div>
          </div>

          <h1
            style={{
              color: "white",
              fontSize: 24,
              fontWeight: 800,
              margin: 0,
              letterSpacing: -0.3,
            }}
          >
            {title}
          </h1>

          {/* Progress bar */}
          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 6,
                background: "rgba(255,255,255,0.2)",
                borderRadius: DS.radius.pill,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(correctCount / questions.length) * 100}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.8) 100%)",
                  borderRadius: DS.radius.pill,
                  transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              />
            </div>
            <span
              style={{
                color: "white",
                fontSize: 13,
                fontWeight: 700,
                minWidth: 45,
              }}
            >
              {correctCount}/{questions.length}
            </span>
          </div>
        </div>
      </div>

      {/* ═══ INSTRUCTIONS ═══ */}
      <div
        style={{
          margin: "18px 20px 0",
          background: `${DS.softPurple}33`,
          border: `1.5px solid ${DS.softPurple}`,
          borderRadius: DS.radius.md,
          padding: "14px 16px",
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          animation: mounted ? "slideDown 0.5s ease forwards" : "none",
          opacity: mounted ? 1 : 0,
        }}
      >
        <IconInfo size={18} color={DS.purple} />
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: DS.deepPurple,
              fontWeight: 700,
              marginBottom: 3,
            }}
          >
            📋 How to play
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 12.5,
              color: DS.dark,
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            Read each card. Does it have <strong>ONE fixed answer</strong> — or
            would you get <strong>DIFFERENT answers</strong> from different
            people or times? Drag each card to the correct bin!
          </p>
        </div>
      </div>

      {/* ═══ BINS ═══ */}
      <div
        style={{
          display: "flex",
          gap: 14,
          margin: "16px 20px",
          flexWrap: "wrap",
          animation: mounted ? "fadeIn 0.6s ease 0.2s both" : "none",
        }}
      >
        {/* Statistical Bin */}
        <div id="bin-statistical" style={getBinStyle("statistical", isStatBin)}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                background: DS.gradPurple,
                borderRadius: DS.radius.sm,
                padding: "6px 8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconBarChart size={16} color="white" />
            </div>
            <div>
              <div
                style={{ fontSize: 14, fontWeight: 700, color: DS.deepPurple }}
              >
                Statistical Question
              </div>
              <div
                style={{ fontSize: 10.5, color: DS.purple, fontWeight: 500 }}
              >
                Needs data • Shows variability
              </div>
            </div>
            <div
              style={{
                marginLeft: "auto",
                background: DS.purple,
                color: "white",
                borderRadius: DS.radius.pill,
                padding: "2px 10px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {sortedInBin("statistical").length}
            </div>
          </div>

          {sortedInBin("statistical").length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: DS.softPurple,
                fontSize: 12.5,
                fontWeight: 600,
                padding: "20px 0",
                border: `2px dashed ${DS.softPurple}88`,
                borderRadius: DS.radius.sm,
              }}
            >
              Drop cards here ↓
            </div>
          )}

          {sortedInBin("statistical").map((q) => (
            <div
              key={q.id}
              style={{
                background: "white",
                borderRadius: DS.radius.sm,
                padding: "8px 12px",
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: `0 2px 8px ${DS.purple}18`,
                animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                border: `1px solid ${DS.softPurple}55`,
              }}
            >
              <span style={{ fontSize: 18 }}>{q.icon}</span>
              <span
                style={{
                  fontSize: 12,
                  color: DS.deepPurple,
                  fontWeight: 600,
                  flex: 1,
                }}
              >
                {q.text}
              </span>
              <IconCheck size={16} color={DS.purple} />
            </div>
          ))}
        </div>

        {/* Non-Statistical Bin */}
        <div
          id="bin-nonstatistical"
          style={getBinStyle("nonstatistical", isNonBin)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                background: DS.gradOrange,
                borderRadius: DS.radius.sm,
                padding: "6px 8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconCalculator size={16} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#7a3d00" }}>
                Non-Statistical Question
              </div>
              <div
                style={{ fontSize: 10.5, color: DS.orange, fontWeight: 500 }}
              >
                Fixed answer • No variability
              </div>
            </div>
            <div
              style={{
                marginLeft: "auto",
                background: DS.orange,
                color: "white",
                borderRadius: DS.radius.pill,
                padding: "2px 10px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {sortedInBin("nonstatistical").length}
            </div>
          </div>

          {sortedInBin("nonstatistical").length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: DS.deepOrange,
                fontSize: 12.5,
                fontWeight: 600,
                padding: "20px 0",
                border: `2px dashed ${DS.deepOrange}55`,
                borderRadius: DS.radius.sm,
              }}
            >
              Drop cards here ↓
            </div>
          )}

          {sortedInBin("nonstatistical").map((q) => (
            <div
              key={q.id}
              style={{
                background: "white",
                borderRadius: DS.radius.sm,
                padding: "8px 12px",
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: `0 2px 8px ${DS.orange}18`,
                animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                border: `1px solid ${DS.softOrange}`,
              }}
            >
              <span style={{ fontSize: 18 }}>{q.icon}</span>
              <span
                style={{
                  fontSize: 12,
                  color: "#7a3d00",
                  fontWeight: 600,
                  flex: 1,
                }}
              >
                {q.text}
              </span>
              <IconCheck size={16} color={DS.orange} />
            </div>
          ))}
        </div>
      </div>

      {/* ═══ CARD GRID ═══ */}
      {unsortedCards.length > 0 && (
        <div style={{ padding: "0 20px 20px" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: DS.purple,
              letterSpacing: 1.2,
              marginBottom: 12,
              textTransform: "uppercase",
            }}
          >
            🃏 Cards to Sort — {unsortedCards.length} remaining
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
              gap: 12,
            }}
          >
            {unsortedCards.map((question, idx) => {
              const state = cardStates.get(question.id)!;
              const isHinted = hintCard === question.id;
              return (
                <div
                  key={question.id}
                  className="drag-card"
                  onMouseDown={(e) => handleMouseDown(e, question.id)}
                  onTouchStart={(e) => handleTouchStart(e, question.id)}
                  style={{
                    ...getCardStyle(state, question),
                    animation: state.shaking
                      ? "shake 0.6s ease-in-out"
                      : isHinted
                        ? "hintPulse 1s ease-in-out infinite"
                        : mounted
                          ? `bounceIn 0.4s ease ${idx * 0.07}s both`
                          : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 24, flexShrink: 0 }}>
                      {question.icon}
                    </span>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 600,
                        color: DS.dark,
                        lineHeight: 1.45,
                        flex: 1,
                      }}
                    >
                      {question.text}
                    </p>
                  </div>

                  {isHinted && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: "6px 10px",
                        background: DS.softOrange,
                        borderRadius: DS.radius.sm,
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                        animation: "slideDown 0.3s ease",
                        border: `1px solid ${DS.deepOrange}44`,
                      }}
                    >
                      <span style={{ fontSize: 14 }}>💡</span>
                      <span
                        style={{
                          fontSize: 11.5,
                          color: "#7a3d00",
                          fontWeight: 600,
                        }}
                      >
                        Hint: {question.hint}
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 10.5,
                      color: DS.gray,
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span>⬆</span>
                    <span>Drag to a bin above</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ ALL SORTED — TRANSITIONAL ═══ */}
      {allSorted && !showSummary && (
        <div
          style={{
            margin: "0 20px 20px",
            background: DS.gradPurpleOrange,
            borderRadius: DS.radius.lg,
            padding: 28,
            textAlign: "center",
            animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
            boxShadow: "0 10px 40px rgba(83,48,134,0.3)",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
          <div
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: 800,
              marginBottom: 4,
            }}
          >
            Excellent work! All {questions.length} cards sorted correctly!
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 13,
              fontWeight: 400,
            }}
          >
            Loading your results summary…
          </div>
        </div>
      )}

      {/* ═══ SUMMARY TABLE ═══ */}
      {showSummary && (
        <div style={{ margin: "0 20px 24px", animation: "bounceIn 0.6s ease" }}>
          <div
            style={{
              background: DS.gradPurpleOrange,
              borderRadius: `${DS.radius.lg}px ${DS.radius.lg}px 0 0`,
              padding: "18px 22px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <IconTrophy size={22} color="#fbbf24" />
                <span style={{ color: "white", fontSize: 18, fontWeight: 800 }}>
                  Results Summary
                </span>
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 12.5,
                  marginTop: 2,
                  fontWeight: 400,
                }}
              >
                Score: {correctCount}/{questions.length} • Click any row to see
                explanation
              </div>
            </div>
            <SingularityButton
              onClick={handleReset}
              variant="outlined"
              icon={<IconRefresh size={14} color="white" />}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1.5px solid rgba(255,255,255,0.4)",
                color: "white",
                borderRadius: DS.radius.sm,
              }}
            >
              Try Again
            </SingularityButton>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: `0 0 ${DS.radius.lg}px ${DS.radius.lg}px`,
              overflow: "hidden",
              boxShadow: `0 10px 40px ${DS.purple}18`,
            }}
          >
            {/* Table Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                padding: "10px 20px",
                background: `${DS.softPurple}22`,
                borderBottom: `1.5px solid ${DS.softPurple}55`,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: DS.purple,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Question
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: DS.purple,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                Category
              </div>
            </div>

            {questions.map((q, idx) => (
              <div key={q.id}>
                <div
                  onClick={() =>
                    setExpandedExplanation(
                      expandedExplanation === q.id ? null : q.id,
                    )
                  }
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    padding: "12px 20px",
                    borderBottom: `1px solid ${DS.lightGray}`,
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                    background:
                      expandedExplanation === q.id
                        ? `${DS.softPurple}15`
                        : "white",
                    animation: `bounceIn 0.3s ease ${idx * 0.05}s both`,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ fontSize: 18 }}>{q.icon}</span>
                    <span
                      style={{
                        fontSize: 12.5,
                        color: DS.dark,
                        fontWeight: 500,
                        lineHeight: 1.4,
                      }}
                    >
                      {q.text}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        padding: "4px 12px",
                        borderRadius: DS.radius.pill,
                        background: q.isStatistical
                          ? `${DS.softPurple}44`
                          : DS.softOrange,
                        color: q.isStatistical ? DS.deepPurple : "#7a3d00",
                        fontSize: 11,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {q.isStatistical
                        ? "📊 Statistical"
                        : "🔢 Non-Statistical"}
                    </div>
                    <IconChevronDown
                      size={14}
                      color={DS.softPurple}
                      style={{
                        transition: "transform 0.3s ease",
                        transform:
                          expandedExplanation === q.id
                            ? "rotate(180deg)"
                            : "none",
                      }}
                    />
                  </div>
                </div>

                {expandedExplanation === q.id && (
                  <div
                    style={{
                      padding: "10px 20px 14px",
                      background: `${DS.softPurple}18`,
                      borderBottom: `1px solid ${DS.softPurple}44`,
                      animation: "slideDown 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                      }}
                    >
                      <IconSparkles size={14} color={DS.purple} />
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12.5,
                          color: DS.deepPurple,
                          lineHeight: 1.6,
                          fontWeight: 500,
                        }}
                      >
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Key Takeaway */}
            <div
              style={{
                padding: "16px 20px",
                background: DS.softOrange,
                borderTop: `1.5px solid ${DS.deepOrange}44`,
              }}
            >
              <div
                style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
              >
                <span style={{ fontSize: 18 }}>🔑</span>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#7a3d00",
                      marginBottom: 3,
                    }}
                  >
                    Key Pattern to Remember
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12.5,
                      color: "#92400e",
                      lineHeight: 1.55,
                    }}
                  >
                    A question is <strong>statistical</strong> when it expects{" "}
                    <strong>variability</strong> in answers — different people,
                    places, or times give different results, so you must{" "}
                    <strong>collect data</strong> to answer it. A{" "}
                    <strong>non-statistical</strong> question has exactly ONE
                    correct answer that doesn't change.
                  </p>
                </div>
              </div>
            </div>

            {/* Teacher Note */}
            <div
              style={{
                padding: "12px 20px",
                background: `${DS.softPurple}18`,
                borderTop: `1px solid ${DS.softPurple}44`,
              }}
            >
              <div
                style={{
                  fontSize: 11.5,
                  color: DS.purple,
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                🎯 Now try this:
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: DS.deepPurple,
                  lineHeight: 1.5,
                }}
              >
                Can you create one <strong>statistical question</strong> and one{" "}
                <strong>non-statistical question</strong> of your own? Think
                about your school, neighbourhood, or sabzi mandi!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ BOTTOM RESET ═══ */}
      {!showSummary && (
        <div style={{ padding: "0 20px 28px", textAlign: "center" }}>
          <SingularityButton
            onClick={handleReset}
            variant="outlined"
            icon={<IconRefresh size={14} color={DS.purple} />}
          >
            Reset & Shuffle
          </SingularityButton>
        </div>
      )}
    </div>
  );
};

export default StatisticalQuestionsToolComponent;
