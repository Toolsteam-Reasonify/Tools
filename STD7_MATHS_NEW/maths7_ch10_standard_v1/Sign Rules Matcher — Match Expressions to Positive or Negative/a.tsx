// @ts-nocheck - Module resolution (react, lucide-react) depends on project install
// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: sign_rules_matcher.tsx
// Redesigned with Singularity Design System — Award icon fix
// ═══════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Check,
  X,
  RotateCcw,
  Star,
  Plus,
  Minus,
  ChevronRight,
  Trophy,
} from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "real_world" | "hands_on";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface ExpressionCard {
  id: string;
  expression: string;
  displayParts: { left: string; op: string; right: string };
  correctBin: "positive" | "negative";
  hint?: string;
}

interface SignRulesAdditionalProps {
  expressions?: {
    id: string;
    expression: string;
    left: string;
    op: string;
    right: string;
    correctBin: "positive" | "negative";
    hint?: string;
  }[];
  summaryTitle?: string;
  summaryRule?: string;
  positiveBinLabel?: string;
  negativeBinLabel?: string;
  instructionText?: string;
  showHints?: boolean;
  accentColor?: string;
  successColor?: string;
  errorColor?: string;
}

interface SignRulesMatcherProps {
  props?: {
    width?: number;
    height?: number;
    initialMode?: ModeType;
    showModeSelector?: boolean;
    enabledModes?: ModeType[];
    showNavigation?: boolean;
    showPlayPause?: boolean;
    showStepIndicator?: boolean;
    animationSpeed?: number;
    autoPlayDuration?: number;
    themeColor?: string;
    darkMode?: boolean;
    additionalProps?: SignRulesAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  primary: "#4A4DC9",
  highlight: "#FF7212",
  gradStart: "#533086",
  gradEnd: "#FC9145",
  primaryTint: "#C1C1EA",
  highlightTint: "#FFF3E4",
  darkText: "#4E4E4E",
  gray: "#CACACA",
  lightGray: "#EBEBEB",
  surface: "#F5F5F5",
  white: "#FFFFFF",
  positive: "#2D8F4E",
  positiveBg: "#E8F5ED",
  positiveBorder: "#A3D9B1",
  negative: "#D93025",
  negativeBg: "#FDECE9",
  negativeBorder: "#F4A9A0",
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 20,
  radiusXl: 24,
  radiusPill: 40,
  sp4: 4,
  sp8: 8,
  sp12: 12,
  sp16: 16,
  sp20: 20,
  sp24: 24,
  sp32: 32,
  sp40: 40,
  font: "'Poppins', sans-serif",
};

// ==================== INLINE SVG ICON FALLBACKS ====================
// These ensure the component never crashes even if lucide-react icons
// are unavailable in a particular version.

const TrophyIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "currentColor",
}) => {
  // Try lucide Trophy first, fallback to inline SVG
  try {
    if (Trophy) return <Trophy size={size} color={color} />;
  } catch (e) {
    /* fallback below */
  }
  return (
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
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
};

const MedalIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
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
    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
    <path d="M11 12 5.12 2.2" />
    <path d="m13 12 5.88-9.8" />
    <path d="M8 7h8" />
    <circle cx="12" cy="17" r="5" />
    <path d="M12 18v-2h-.5" />
  </svg>
);

// ==================== DEFAULT EXPRESSIONS ====================

const DEFAULT_EXPRESSIONS: ExpressionCard[] = [
  {
    id: "e1",
    expression: "(+3) × (+7)",
    displayParts: { left: "+3", op: "×", right: "+7" },
    correctBin: "positive",
    hint: "Both positive → positive",
  },
  {
    id: "e2",
    expression: "(−4) × (−6)",
    displayParts: { left: "−4", op: "×", right: "−6" },
    correctBin: "positive",
    hint: "Both negative → positive",
  },
  {
    id: "e3",
    expression: "(+5) × (−8)",
    displayParts: { left: "+5", op: "×", right: "−8" },
    correctBin: "negative",
    hint: "Different signs → negative",
  },
  {
    id: "e4",
    expression: "(−9) × (+2)",
    displayParts: { left: "−9", op: "×", right: "+2" },
    correctBin: "negative",
    hint: "Different signs → negative",
  },
  {
    id: "e5",
    expression: "(−1) × (−1)",
    displayParts: { left: "−1", op: "×", right: "−1" },
    correctBin: "positive",
    hint: "Both negative → positive!",
  },
  {
    id: "e6",
    expression: "(−1) × (+5)",
    displayParts: { left: "−1", op: "×", right: "+5" },
    correctBin: "negative",
    hint: "This gives the additive inverse: −5",
  },
  {
    id: "e7",
    expression: "(−12) × (−3)",
    displayParts: { left: "−12", op: "×", right: "−3" },
    correctBin: "positive",
    hint: "Both negative → positive",
  },
  {
    id: "e8",
    expression: "(+10) × (−17)",
    displayParts: { left: "+10", op: "×", right: "−17" },
    correctBin: "negative",
    hint: "Different signs → negative",
  },
];

// ==================== HELPERS ====================

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ==================== MAIN COMPONENT ====================

const SignRulesMatcher: React.FC<SignRulesMatcherProps> = ({
  props: propsIn,
  setStepDetails,
}) => {
  const props = (propsIn ?? {}) as NonNullable<
    SignRulesMatcherProps["props"]
  >;
  const additionalProps = (props.additionalProps ||
    {}) as SignRulesAdditionalProps;

  const posLabel = additionalProps.positiveBinLabel || "Positive Result (+)";
  const negLabel = additionalProps.negativeBinLabel || "Negative Result (−)";
  const summaryTitle =
    additionalProps.summaryTitle || "Sign Rules for Multiplication";
  const summaryRule =
    additionalProps.summaryRule ||
    "Same signs → Positive  |  Different signs → Negative";
  const instructionText =
    additionalProps.instructionText ||
    "Drag each expression to the correct bin. Determine the sign of the result — no calculation needed!";

  const expressions: ExpressionCard[] = useMemo(() => {
    if (additionalProps.expressions && additionalProps.expressions.length > 0) {
      return additionalProps.expressions.map((e) => ({
        id: e.id,
        expression: e.expression,
        displayParts: { left: e.left, op: e.op, right: e.right },
        correctBin: e.correctBin,
        hint: e.hint,
      }));
    }
    return DEFAULT_EXPRESSIONS;
  }, [additionalProps.expressions]);

  const [shuffledCards, setShuffledCards] = useState<ExpressionCard[]>([]);
  const [placedCards, setPlacedCards] = useState<{
    [id: string]: "positive" | "negative";
  }>({});
  const [correctCards, setCorrectCards] = useState<Set<string>>(new Set());
  const [feedbackCard, setFeedbackCard] = useState<{
    id: string;
    correct: boolean;
  } | null>(null);
  const [shakeCard, setShakeCard] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [hoveredBin, setHoveredBin] = useState<"positive" | "negative" | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [touchDragPos, setTouchDragPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const positiveBinRef = useRef<HTMLDivElement>(null);
  const negativeBinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShuffledCards(shuffleArray(expressions));
    setMounted(true);
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [expressions]);

  useEffect(() => {
    const id = "srm-singularity-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
            @keyframes srm-fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes srm-popIn { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
            @keyframes srm-bounce { 0% { transform: scale(0.2); opacity: 0; } 50% { transform: scale(1.1); } 70% { transform: scale(0.95); } 100% { transform: scale(1); opacity: 1; } }
            @keyframes srm-shake { 0%, 100% { transform: translateX(0); } 15% { transform: translateX(-7px) rotate(-1.5deg); } 30% { transform: translateX(7px) rotate(1.5deg); } 45% { transform: translateX(-5px) rotate(-1deg); } 60% { transform: translateX(5px) rotate(1deg); } 75% { transform: translateX(-2px); } 90% { transform: translateX(2px); } }
            @keyframes srm-slideUp { from { opacity: 0; transform: translateY(60px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
            @keyframes srm-tickDraw { 0% { stroke-dashoffset: 30; } 100% { stroke-dashoffset: 0; } }
            @keyframes srm-gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
            @keyframes srm-ringPulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
        `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(id);
      if (el) document.head.removeChild(el);
    };
  }, []);

  useEffect(() => {
    if (correctCards.size === expressions.length && expressions.length > 0) {
      setTimeout(() => setShowSummary(true), 600);
    }
  }, [correctCards, expressions.length]);

  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: correctCards.size,
        totalSteps: expressions.length,
        isPaused: false,
        currentMode: "practice",
      });
    }
  }, [correctCards.size, expressions.length, setStepDetails]);

  const handleDrop = useCallback(
    (cardId: string, bin: "positive" | "negative") => {
      const card = expressions.find((c) => c.id === cardId);
      if (!card || correctCards.has(cardId)) return;
      setAttempts((prev) => prev + 1);
      if (card.correctBin === bin) {
        setPlacedCards((prev) => ({ ...prev, [cardId]: bin }));
        setCorrectCards((prev) => new Set(prev).add(cardId));
        setFeedbackCard({ id: cardId, correct: true });
        setScore((prev) => prev + 1);
        setTimeout(() => setFeedbackCard(null), 1200);
      } else {
        setShakeCard(cardId);
        setFeedbackCard({ id: cardId, correct: false });
        setTimeout(() => {
          setShakeCard(null);
          setFeedbackCard(null);
        }, 800);
      }
      setDraggedCard(null);
      setHoveredBin(null);
      setTouchDragPos(null);
    },
    [expressions, correctCards],
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, cardId: string) => {
      if (correctCards.has(cardId)) return;
      e.dataTransfer.setData("text/plain", cardId);
      setDraggedCard(cardId);
    },
    [correctCards],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);
  const handleBinDragEnter = useCallback((bin: "positive" | "negative") => {
    setHoveredBin(bin);
  }, []);
  const handleBinDragLeave = useCallback(() => {
    setHoveredBin(null);
  }, []);
  const handleBinDrop = useCallback(
    (e: React.DragEvent, bin: "positive" | "negative") => {
      e.preventDefault();
      const cardId = e.dataTransfer.getData("text/plain");
      if (cardId) handleDrop(cardId, bin);
    },
    [handleDrop],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!draggedCard) return;
      const touch = e.touches[0];
      setTouchDragPos({ x: touch.clientX, y: touch.clientY });
      if (positiveBinRef.current && negativeBinRef.current) {
        const posRect = positiveBinRef.current.getBoundingClientRect();
        const negRect = negativeBinRef.current.getBoundingClientRect();
        if (
          touch.clientX >= posRect.left &&
          touch.clientX <= posRect.right &&
          touch.clientY >= posRect.top &&
          touch.clientY <= posRect.bottom
        )
          setHoveredBin("positive");
        else if (
          touch.clientX >= negRect.left &&
          touch.clientX <= negRect.right &&
          touch.clientY >= negRect.top &&
          touch.clientY <= negRect.bottom
        )
          setHoveredBin("negative");
        else setHoveredBin(null);
      }
    },
    [draggedCard],
  );

  const handleTouchEnd = useCallback(() => {
    if (draggedCard && hoveredBin) handleDrop(draggedCard, hoveredBin);
    else {
      setDraggedCard(null);
      setTouchDragPos(null);
      setHoveredBin(null);
    }
  }, [draggedCard, hoveredBin, handleDrop]);

  const handleCardTap = useCallback(
    (cardId: string) => {
      if (correctCards.has(cardId)) return;
      setDraggedCard((prev) => (prev === cardId ? null : cardId));
    },
    [correctCards],
  );

  const handleBinTap = useCallback(
    (bin: "positive" | "negative") => {
      if (draggedCard) handleDrop(draggedCard, bin);
    },
    [draggedCard, handleDrop],
  );

  const handleReset = useCallback(() => {
    setShuffledCards(shuffleArray(expressions));
    setPlacedCards({});
    setCorrectCards(new Set());
    setFeedbackCard(null);
    setShakeCard(null);
    setShowSummary(false);
    setDraggedCard(null);
    setHoveredBin(null);
    setScore(0);
    setAttempts(0);
    setTouchDragPos(null);
  }, [expressions]);

  const remainingCards = useMemo(
    () => shuffledCards.filter((c) => !correctCards.has(c.id)),
    [shuffledCards, correctCards],
  );
  const positiveBinCards = useMemo(
    () => shuffledCards.filter((c) => placedCards[c.id] === "positive"),
    [shuffledCards, placedCards],
  );
  const negativeBinCards = useMemo(
    () => shuffledCards.filter((c) => placedCards[c.id] === "negative"),
    [shuffledCards, placedCards],
  );
  const progress =
    expressions.length > 0 ? (correctCards.size / expressions.length) * 100 : 0;

  // ==================== RENDER ====================

  return (
    <div
      ref={containerRef}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        width: "100%",
        maxWidth: props.width || 900,
        minHeight: props.height || 620,
        margin: "0 auto",
        fontFamily: DS.font,
        color: DS.darkText,
        background: DS.white,
        borderRadius: DS.radiusXl,
        overflow: "hidden",
        boxShadow:
          "0 4px 32px rgba(74,77,201,0.10), 0 1.5px 6px rgba(0,0,0,0.04)",
        position: "relative",
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${DS.lightGray}`,
      }}
    >
      {/* ═══════════ HEADER ═══════════ */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.gradStart} 0%, ${DS.primary} 45%, ${DS.gradEnd} 100%)`,
          backgroundSize: "200% 200%",
          animation: "srm-gradientShift 8s ease infinite",
          padding: isMobile ? "18px 16px 16px" : "24px 32px 20px",
          display: "flex",
          flexDirection: "column",
          gap: DS.sp8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: DS.sp8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: DS.sp12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <polygon
                  points="14,3 26,25 2,25"
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                />
                <polygon
                  points="14,8 22,22 6,22"
                  fill="rgba(255,255,255,0.15)"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <h1
              style={{
                fontFamily: DS.font,
                fontWeight: 700,
                fontSize: isMobile ? 18 : 24,
                color: DS.white,
                margin: 0,
                letterSpacing: "-0.3px",
              }}
            >
              Sign Rules Matcher
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: DS.sp8 }}>
            <div
              style={{
                background: "rgba(255,255,255,0.18)",
                borderRadius: DS.radiusPill,
                padding: "6px 16px",
                fontSize: 13,
                fontWeight: 600,
                color: DS.white,
                display: "flex",
                alignItems: "center",
                gap: 6,
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <Star size={14} fill={DS.white} stroke={DS.white} />
              {score} / {expressions.length}
            </div>
            <button
              onClick={handleReset}
              style={{
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,0.35)",
                borderRadius: DS.radiusMd,
                padding: "6px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: DS.white,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
              }}
              title="Reset"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
        <div
          style={{
            height: 5,
            borderRadius: 3,
            background: "rgba(255,255,255,0.15)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              borderRadius: 3,
              background: `linear-gradient(90deg, ${DS.highlight} 0%, #FFD166 100%)`,
              transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: progress > 0 ? `0 0 8px ${DS.highlight}66` : "none",
            }}
          />
        </div>
        <p
          style={{
            fontSize: isMobile ? 11.5 : 13,
            color: "rgba(255,255,255,0.8)",
            margin: 0,
            lineHeight: 1.45,
            fontWeight: 400,
          }}
        >
          {instructionText}
        </p>
      </div>

      {/* ═══════════ EXPRESSION CARDS ═══════════ */}
      <div
        style={{
          padding: isMobile ? "14px 12px 8px" : "20px 28px 12px",
          background: DS.surface,
          borderBottom: `1px solid ${DS.lightGray}`,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase" as const,
            letterSpacing: 1.8,
            color: DS.gray,
            marginBottom: DS.sp8,
          }}
        >
          {remainingCards.length > 0
            ? `Expressions · ${remainingCards.length} remaining`
            : "All placed ✓"}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: isMobile ? DS.sp8 : DS.sp12,
            justifyContent: "center",
            minHeight: 52,
            padding: "4px 0",
          }}
        >
          {remainingCards.map((card, idx) => {
            const isShaking = shakeCard === card.id;
            const isDragging = draggedCard === card.id;
            const isFeedback = feedbackCard?.id === card.id;
            const feedbackCorrect = feedbackCard?.correct;
            return (
              <div
                key={card.id}
                draggable={!isMobile}
                onDragStart={(e) => handleDragStart(e, card.id)}
                onDragEnd={() => {
                  setDraggedCard(null);
                  setHoveredBin(null);
                }}
                onTouchStart={() => handleCardTap(card.id)}
                onClick={() => isMobile && handleCardTap(card.id)}
                style={{
                  background: isDragging
                    ? `linear-gradient(135deg, ${DS.primaryTint}44, ${DS.primaryTint}88)`
                    : isFeedback && !feedbackCorrect
                      ? DS.negativeBg
                      : DS.white,
                  border: `2px solid ${isDragging ? DS.primary : isFeedback && !feedbackCorrect ? DS.negative : DS.lightGray}`,
                  borderRadius: DS.radiusPill,
                  padding: isMobile ? "8px 16px" : "10px 24px",
                  cursor: "grab",
                  fontFamily: DS.font,
                  fontWeight: 700,
                  fontSize: isMobile ? 15 : 19,
                  color: DS.darkText,
                  boxShadow: isDragging
                    ? `0 6px 20px ${DS.primary}25`
                    : "0 1px 4px rgba(0,0,0,0.05)",
                  transition: isShaking ? "none" : "all 0.22s ease",
                  animation: isShaking
                    ? "srm-shake 0.5s ease"
                    : mounted
                      ? `srm-popIn 0.35s ease ${idx * 0.06}s both`
                      : "none",
                  opacity: isDragging ? 0.75 : 1,
                  transform: isDragging ? "scale(1.05)" : "scale(1)",
                  position: "relative",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  minHeight: DS.sp40,
                }}
                onMouseEnter={(e) => {
                  if (!isDragging) {
                    e.currentTarget.style.transform =
                      "scale(1.04) translateY(-1px)";
                    e.currentTarget.style.boxShadow = `0 4px 14px ${DS.primary}18`;
                    e.currentTarget.style.borderColor = DS.primary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDragging) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 1px 4px rgba(0,0,0,0.05)";
                    e.currentTarget.style.borderColor = DS.lightGray;
                  }
                }}
              >
                <span
                  style={{
                    color: card.displayParts.left.startsWith("−")
                      ? DS.highlight
                      : DS.primary,
                  }}
                >
                  ({card.displayParts.left})
                </span>
                <span
                  style={{
                    color: DS.gray,
                    fontSize: isMobile ? 13 : 16,
                    margin: "0 1px",
                    fontWeight: 500,
                  }}
                >
                  {card.displayParts.op}
                </span>
                <span
                  style={{
                    color: card.displayParts.right.startsWith("−")
                      ? DS.highlight
                      : DS.primary,
                  }}
                >
                  ({card.displayParts.right})
                </span>
                {isDragging && isMobile && (
                  <div
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: DS.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      animation: "srm-popIn 0.2s ease",
                      boxShadow: `0 2px 6px ${DS.primary}55`,
                    }}
                  >
                    <Check size={11} color={DS.white} strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })}
          {remainingCards.length === 0 && !showSummary && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: DS.sp8,
                padding: "10px 20px",
                color: DS.positive,
                fontWeight: 600,
                fontSize: 14,
                animation: "srm-fadeInUp 0.4s ease",
                background: DS.positiveBg,
                borderRadius: DS.radiusPill,
              }}
            >
              <TrophyIcon size={18} color={DS.positive} /> All expressions
              sorted correctly!
            </div>
          )}
        </div>
      </div>

      {/* Mobile tap instruction */}
      {isMobile && draggedCard && !correctCards.has(draggedCard) && (
        <div
          style={{
            textAlign: "center",
            fontSize: 12,
            color: DS.primary,
            fontWeight: 600,
            padding: "6px 12px",
            background: `${DS.primaryTint}33`,
            animation: "srm-fadeInUp 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <ChevronRight size={14} /> Tap a bin below to place it
        </div>
      )}

      {/* ═══════════ BINS ═══════════ */}
      <div
        style={{
          display: "flex",
          gap: isMobile ? DS.sp12 : DS.sp20,
          padding: isMobile ? "12px 12px 20px" : "16px 28px 28px",
          flex: 1,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* POSITIVE BIN */}
        <div
          ref={positiveBinRef}
          onDragOver={handleDragOver}
          onDragEnter={() => handleBinDragEnter("positive")}
          onDragLeave={handleBinDragLeave}
          onDrop={(e) => handleBinDrop(e, "positive")}
          onClick={() => isMobile && handleBinTap("positive")}
          style={{
            flex: 1,
            border: `2.5px ${hoveredBin === "positive" ? "solid" : "dashed"} ${DS.positiveBorder}`,
            borderRadius: DS.radiusLg,
            background: hoveredBin === "positive" ? DS.positiveBg : DS.white,
            padding: isMobile ? DS.sp12 : DS.sp16,
            minHeight: isMobile ? 100 : 150,
            transition: "all 0.25s ease",
            display: "flex",
            flexDirection: "column",
            animation: mounted ? "srm-fadeInUp 0.5s ease 0.3s both" : "none",
            boxShadow:
              hoveredBin === "positive"
                ? `0 0 0 4px ${DS.positiveBorder}44, 0 4px 16px rgba(45,143,78,0.1)`
                : "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: DS.sp8,
              marginBottom: DS.sp12,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: DS.radiusSm,
                background: DS.positive,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={18} color={DS.white} strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontFamily: DS.font,
                fontWeight: 700,
                fontSize: isMobile ? 13 : 15,
                color: DS.positive,
              }}
            >
              {posLabel}
            </span>
          </div>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: DS.sp8, flex: 1 }}
          >
            {positiveBinCards.map((card) => (
              <div
                key={card.id}
                style={{
                  background: DS.positiveBg,
                  border: `1.5px solid ${DS.positiveBorder}`,
                  borderRadius: DS.radiusPill,
                  padding: isMobile ? "5px 12px" : "6px 16px",
                  fontFamily: DS.font,
                  fontWeight: 600,
                  fontSize: isMobile ? 12 : 14,
                  color: DS.positive,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  animation: "srm-bounce 0.35s ease",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <circle
                    cx="7"
                    cy="7"
                    r="6"
                    fill={DS.positive}
                    opacity={0.15}
                  />
                  <path
                    d="M3.5 7 L6 9.5 L10.5 4.5"
                    fill="none"
                    stroke={DS.positive}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: 30,
                      animation: "srm-tickDraw 0.35s ease forwards",
                    }}
                  />
                </svg>
                {card.expression}
              </div>
            ))}
            {positiveBinCards.length === 0 && (
              <div
                style={{
                  color: DS.positiveBorder,
                  fontSize: 12.5,
                  fontWeight: 500,
                  padding: "6px 0",
                  fontStyle: "italic",
                }}
              >
                Drop positive results here
              </div>
            )}
          </div>
        </div>

        {/* NEGATIVE BIN */}
        <div
          ref={negativeBinRef}
          onDragOver={handleDragOver}
          onDragEnter={() => handleBinDragEnter("negative")}
          onDragLeave={handleBinDragLeave}
          onDrop={(e) => handleBinDrop(e, "negative")}
          onClick={() => isMobile && handleBinTap("negative")}
          style={{
            flex: 1,
            border: `2.5px ${hoveredBin === "negative" ? "solid" : "dashed"} ${DS.negativeBorder}`,
            borderRadius: DS.radiusLg,
            background: hoveredBin === "negative" ? DS.negativeBg : DS.white,
            padding: isMobile ? DS.sp12 : DS.sp16,
            minHeight: isMobile ? 100 : 150,
            transition: "all 0.25s ease",
            display: "flex",
            flexDirection: "column",
            animation: mounted ? "srm-fadeInUp 0.5s ease 0.4s both" : "none",
            boxShadow:
              hoveredBin === "negative"
                ? `0 0 0 4px ${DS.negativeBorder}44, 0 4px 16px rgba(217,48,37,0.1)`
                : "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: DS.sp8,
              marginBottom: DS.sp12,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: DS.radiusSm,
                background: DS.negative,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Minus size={18} color={DS.white} strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontFamily: DS.font,
                fontWeight: 700,
                fontSize: isMobile ? 13 : 15,
                color: DS.negative,
              }}
            >
              {negLabel}
            </span>
          </div>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: DS.sp8, flex: 1 }}
          >
            {negativeBinCards.map((card) => (
              <div
                key={card.id}
                style={{
                  background: DS.negativeBg,
                  border: `1.5px solid ${DS.negativeBorder}`,
                  borderRadius: DS.radiusPill,
                  padding: isMobile ? "5px 12px" : "6px 16px",
                  fontFamily: DS.font,
                  fontWeight: 600,
                  fontSize: isMobile ? 12 : 14,
                  color: DS.negative,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  animation: "srm-bounce 0.35s ease",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <circle
                    cx="7"
                    cy="7"
                    r="6"
                    fill={DS.negative}
                    opacity={0.15}
                  />
                  <path
                    d="M3.5 7 L6 9.5 L10.5 4.5"
                    fill="none"
                    stroke={DS.negative}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: 30,
                      animation: "srm-tickDraw 0.35s ease forwards",
                    }}
                  />
                </svg>
                {card.expression}
              </div>
            ))}
            {negativeBinCards.length === 0 && (
              <div
                style={{
                  color: DS.negativeBorder,
                  fontSize: 12.5,
                  fontWeight: 500,
                  padding: "6px 0",
                  fontStyle: "italic",
                }}
              >
                Drop negative results here
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════ FEEDBACK TOAST ═══════════ */}
      {feedbackCard && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: feedbackCard.correct ? DS.positive : DS.negative,
            color: DS.white,
            padding: "12px 28px",
            borderRadius: DS.radiusPill,
            fontFamily: DS.font,
            fontWeight: 700,
            fontSize: 17,
            boxShadow: feedbackCard.correct
              ? "0 8px 28px rgba(45,143,78,0.35)"
              : "0 8px 28px rgba(217,48,37,0.35)",
            display: "flex",
            alignItems: "center",
            gap: DS.sp8,
            animation: "srm-popIn 0.25s ease",
            zIndex: 100,
            pointerEvents: "none",
            letterSpacing: "-0.2px",
          }}
        >
          {feedbackCard.correct ? (
            <>
              <Check size={20} strokeWidth={3} /> Correct!
            </>
          ) : (
            <>
              <X size={20} strokeWidth={3} /> Try Again!
            </>
          )}
        </div>
      )}

      {/* ═══════════ SUMMARY OVERLAY ═══════════ */}
      {showSummary && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(83,48,134,0.45)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: DS.sp16,
          }}
        >
          <div
            style={{
              background: DS.white,
              borderRadius: DS.radiusXl,
              padding: isMobile ? "28px 20px" : "36px 44px",
              maxWidth: 500,
              width: "100%",
              boxShadow: "0 24px 64px rgba(83,48,134,0.25)",
              animation: "srm-slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              textAlign: "center",
            }}
          >
            {/* Trophy icon — using safe inline SVG */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${DS.highlight}, ${DS.gradEnd})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
                boxShadow: `0 6px 20px ${DS.highlight}44`,
                animation: "srm-bounce 0.6s ease",
                position: "relative",
              }}
            >
              <TrophyIcon size={28} color={DS.white} />
              <div
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  border: `2px solid ${DS.highlight}55`,
                  animation: "srm-ringPulse 1.5s ease infinite",
                }}
              />
            </div>
            <h2
              style={{
                fontFamily: DS.font,
                fontWeight: 800,
                fontSize: isMobile ? 20 : 24,
                color: DS.gradStart,
                margin: "0 0 4px",
                letterSpacing: "-0.3px",
              }}
            >
              {summaryTitle}
            </h2>
            <p
              style={{
                color: DS.gray,
                fontSize: 13,
                fontWeight: 500,
                margin: "0 0 22px",
              }}
            >
              Score: {score}/{expressions.length}
              {attempts > expressions.length && ` · ${attempts} attempts`}
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: DS.sp8,
                marginBottom: DS.sp20,
              }}
            >
              <div
                style={{
                  background: DS.positiveBg,
                  border: `1.5px solid ${DS.positiveBorder}`,
                  borderRadius: DS.radiusMd,
                  padding: "14px 16px",
                  animation: "srm-fadeInUp 0.4s ease 0.2s both",
                }}
              >
                <div
                  style={{
                    fontFamily: DS.font,
                    fontWeight: 700,
                    fontSize: isMobile ? 14 : 16,
                    color: DS.positive,
                    marginBottom: 3,
                  }}
                >
                  Same Signs → Positive Result
                </div>
                <div
                  style={{ fontSize: 12.5, color: "#5CBB76", fontWeight: 500 }}
                >
                  (+) × (+) = (+) &nbsp;&nbsp;|&nbsp;&nbsp; (−) × (−) = (+)
                </div>
              </div>
              <div
                style={{
                  background: DS.negativeBg,
                  border: `1.5px solid ${DS.negativeBorder}`,
                  borderRadius: DS.radiusMd,
                  padding: "14px 16px",
                  animation: "srm-fadeInUp 0.4s ease 0.35s both",
                }}
              >
                <div
                  style={{
                    fontFamily: DS.font,
                    fontWeight: 700,
                    fontSize: isMobile ? 14 : 16,
                    color: DS.negative,
                    marginBottom: 3,
                  }}
                >
                  Different Signs → Negative Result
                </div>
                <div
                  style={{ fontSize: 12.5, color: "#E57373", fontWeight: 500 }}
                >
                  (+) × (−) = (−) &nbsp;&nbsp;|&nbsp;&nbsp; (−) × (+) = (−)
                </div>
              </div>
            </div>
            <div
              style={{
                background: `linear-gradient(135deg, ${DS.primaryTint}44, ${DS.highlightTint})`,
                border: `1.5px solid ${DS.primaryTint}`,
                borderRadius: DS.radiusPill,
                padding: "10px 18px",
                fontFamily: DS.font,
                fontWeight: 700,
                fontSize: isMobile ? 12 : 14,
                color: DS.gradStart,
                marginBottom: DS.sp20,
                animation: "srm-fadeInUp 0.4s ease 0.5s both",
              }}
            >
              {summaryRule}
            </div>
            <div
              style={{
                background: DS.highlightTint,
                border: "1.5px solid #FFDCB5",
                borderRadius: DS.radiusMd,
                padding: "10px 14px",
                fontSize: 12,
                color: "#8B5E2F",
                lineHeight: 1.55,
                marginBottom: DS.sp20,
                textAlign: "left",
                animation: "srm-fadeInUp 0.4s ease 0.6s both",
                fontWeight: 400,
              }}
            >
              <span style={{ fontWeight: 700 }}>Did you know?</span> Brahmagupta
              first stated these sign rules in 628 CE in his
              Brāhmasphuṭasiddhānta, using 'fortune' for positive and 'debt' for
              negative values!
            </div>
            <button
              onClick={handleReset}
              style={{
                background: `linear-gradient(135deg, ${DS.gradStart}, ${DS.primary})`,
                color: DS.white,
                border: "none",
                borderRadius: DS.radiusPill,
                padding: "12px 36px",
                fontFamily: DS.font,
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: `0 4px 14px ${DS.gradStart}33`,
                transition: "all 0.2s ease",
                animation: "srm-fadeInUp 0.4s ease 0.7s both",
                minHeight: DS.sp40,
                letterSpacing: "0.2px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.boxShadow = `0 6px 22px ${DS.gradStart}44`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = `0 4px 14px ${DS.gradStart}33`;
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.97)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1.04)";
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Touch drag ghost */}
      {touchDragPos && draggedCard && (
        <div
          style={{
            position: "fixed",
            left: touchDragPos.x - 60,
            top: touchDragPos.y - 24,
            background: DS.white,
            border: `2px solid ${DS.primary}`,
            borderRadius: DS.radiusPill,
            padding: "7px 18px",
            fontFamily: DS.font,
            fontWeight: 700,
            fontSize: 15,
            color: DS.darkText,
            pointerEvents: "none",
            zIndex: 300,
            opacity: 0.92,
            boxShadow: `0 8px 24px ${DS.primary}30`,
          }}
        >
          {expressions.find((e) => e.id === draggedCard)?.expression}
        </div>
      )}
    </div>
  );
};

export default SignRulesMatcher;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
