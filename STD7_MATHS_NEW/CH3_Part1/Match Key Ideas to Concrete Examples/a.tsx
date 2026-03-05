// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: chapter_summary_matching_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

// @ts-ignore - react types may be missing in environment
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
// @ts-ignore - lucide-react types may be missing in environment
import { Check, RotateCcw, Star, Award, Sparkles } from "lucide-react";

// ==================== DESIGN TOKENS (Singularity) ====================

const DS = {
  colors: {
    primary: "#4A4DC9",
    accent: "#FF7212",
    gradientStart: "#533086",
    gradientEnd: "#FC9145",
    lightPurple: "#C1C1EA",
    lightPeach: "#FFF3E4",
    bgPurpleSoft: "#EEEDF8",
    bgPeachSoft: "#FFF8F0",
    textDark: "#4E4E4E",
    textMid: "#6B6B6B",
    textLight: "#9B9B9B",
    gray100: "#F5F5F5",
    gray200: "#EBEBEB",
    gray300: "#CACACA",
    gray400: "#4E4E4E",
    white: "#FFFFFF",
    success: "#2EAE6D",
    successLight: "#E6F9EF",
    successBorder: "#A8E6C8",
    error: "#E34850",
    errorLight: "#FDECEC",
  },
  font: "'Poppins', 'Segoe UI', system-ui, -apple-system, sans-serif",
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  shadow: {
    sm: "0 1px 3px rgba(74, 77, 201, 0.06)",
    md: "0 4px 12px rgba(74, 77, 201, 0.08)",
    lg: "0 8px 24px rgba(74, 77, 201, 0.12)",
    xl: "0 12px 40px rgba(74, 77, 201, 0.16)",
    glow: "0 0 20px rgba(74, 77, 201, 0.2)",
    accentGlow: "0 0 20px rgba(255, 114, 18, 0.2)",
  },
};

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "real_world" | "hands_on";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface MatchPair {
  id: string;
  statement: string;
  example: string;
  statementLabel: string;
  exampleLabel: string;
}

interface MatchingAdditionalProps {
  pairs?: MatchPair[];
  statementCardColor?: string;
  statementTextColor?: string;
  exampleCardColor?: string;
  exampleTextColor?: string;
  correctLineColor?: string;
  incorrectLineColor?: string;
  title?: string;
  instructions?: string;
  congratsMessage?: string;
  teachingNotes?: string;
}

interface ChapterSummaryMatchingToolProps {
  props?: {
    width?: number;
    height?: number;
    themeColor?: string;
    darkMode?: boolean;
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
    additionalProps?: MatchingAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DEFAULT DATA ====================

const DEFAULT_PAIRS: MatchPair[] = [
  {
    id: "1",
    statementLabel: "1",
    statement: "Splitting units into smaller parts gives accuracy",
    exampleLabel: "A",
    example: "Sonu's screws needed tenths of a cm to tell them apart",
  },
  {
    id: "2",
    statementLabel: "2",
    statement: "1 unit = 10 tenths = 100 hundredths = 1000 thousandths",
    exampleLabel: "B",
    example: "Folding paper: each tenth splits into 10 hundredths",
  },
  {
    id: "3",
    statementLabel: "3",
    statement: "The decimal point separates whole from fractional part",
    exampleLabel: "C",
    example: "₹705, ₹70.5, ₹7.05 — same digits, dot changes value",
  },
  {
    id: "4",
    statementLabel: "4",
    statement: "We can compare, locate, add, and subtract decimals",
    exampleLabel: "D",
    example: "56.456 < 56.465; 18 + 8.8 = 26.8",
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

// ==================== SHUFFLE HELPER ====================

function shuffleArray<T>(arr: T[], seed: number): T[] {
  const shuffled = [...arr];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ==================== CONFETTI COMPONENT ====================

const Confetti: React.FC<{ active: boolean }> = ({ active }) => {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      rotation: number;
      scale: number;
      shape: "circle" | "square" | "star";
    }>
  >([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }
    const colors = [
      DS.colors.primary,
      DS.colors.accent,
      DS.colors.gradientStart,
      DS.colors.gradientEnd,
      DS.colors.lightPurple,
      "#FFD700",
      DS.colors.success,
      "#FF6B9C",
    ];
    const newParticles = Array.from({ length: 70 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      scale: 0.4 + Math.random() * 0.8,
      shape: (["circle", "square", "star"] as const)[
        Math.floor(Math.random() * 3)
      ],
    }));
    setParticles(newParticles);
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 100,
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.shape === "star" ? 14 * p.scale : 10 * p.scale,
            height: p.shape === "star" ? 14 * p.scale : 10 * p.scale,
            backgroundColor: p.color,
            borderRadius:
              p.shape === "circle" ? "50%" : p.shape === "square" ? "3px" : 0,
            transform: `rotate(${p.rotation}deg)`,
            animation: `confettiFall ${2 + Math.random() * 2}s ease-in forwards`,
            animationDelay: `${Math.random() * 0.6}s`,
            ...(p.shape === "star"
              ? {
                  clipPath:
                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                }
              : {}),
          }}
        />
      ))}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

type ResolvedProps = NonNullable<ChapterSummaryMatchingToolProps["props"]>;

const ChapterSummaryMatchingTool: React.FC<ChapterSummaryMatchingToolProps> = ({
  props: propsIn,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const props: ResolvedProps = (propsIn ?? {}) as ResolvedProps;
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      themeColor: props.themeColor ?? DS.colors.primary,
      darkMode: props.darkMode ?? false,
      animationSpeed: props.animationSpeed ?? 1,
    }),
    [props],
  );

  const additionalProps = (props.additionalProps ||
    {}) as MatchingAdditionalProps;

  const pairs = additionalProps.pairs ?? DEFAULT_PAIRS;
  const statementCardColor =
    additionalProps.statementCardColor ?? DS.colors.lightPurple;
  const statementTextColor = additionalProps.statementTextColor ?? "#1B1464";
  const exampleCardColor =
    additionalProps.exampleCardColor ?? DS.colors.lightPeach;
  const exampleTextColor = additionalProps.exampleTextColor ?? "#3D1E00";
  const correctLineColor =
    additionalProps.correctLineColor ?? DS.colors.success;
  const incorrectLineColor =
    additionalProps.incorrectLineColor ?? DS.colors.error;
  const title =
    additionalProps.title ??
    "Chapter Summary — Key Ideas of the Decimal System";
  const instructions =
    additionalProps.instructions ??
    "Match each key idea to the example that best illustrates it. Think back to the chapter!";
  const congratsMessage =
    additionalProps.congratsMessage ??
    "Congratulations! You matched all key ideas correctly!";

  // ─── STATE ───
  const [shuffledExamples, setShuffledExamples] = useState<MatchPair[]>([]);
  const [selectedStatement, setSelectedStatement] = useState<string | null>(
    null,
  );
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [correctMatches, setCorrectMatches] = useState<Set<string>>(new Set());
  const [incorrectFlash, setIncorrectFlash] = useState<{
    statementId: string;
    exampleId: string;
  } | null>(null);
  const [allCorrect, setAllCorrect] = useState(false);
  const [mountAnim, setMountAnim] = useState(false);
  const [hoverStatement, setHoverStatement] = useState<string | null>(null);
  const [hoverExample, setHoverExample] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [resetBtnHover, setResetBtnHover] = useState(false);
  const [resetBtnActive, setResetBtnActive] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const statementRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const exampleRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const svgRef = useRef<SVGSVGElement>(null);

  // ─── INIT ───
  useEffect(() => {
    setShuffledExamples(shuffleArray(pairs, 42));
    setTimeout(() => setMountAnim(true), 100);
  }, [pairs]);

  // ─── INJECT KEYFRAMES + POPPINS ───
  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.id = "poppins-font-link";
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap";
    if (!document.getElementById("poppins-font-link")) {
      document.head.appendChild(fontLink);
    }

    const keyframes = `
            @keyframes smFadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes smFadeInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes smFadeInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes smPopIn { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
            @keyframes smPulse { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(74,77,201,0.3); } 50% { transform: scale(1.03); box-shadow: 0 0 0 8px rgba(74,77,201,0); } }
            @keyframes smShake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
            @keyframes smCorrectGlow { 0% { box-shadow: 0 0 0 0 rgba(46,174,109,0.5); } 50% { box-shadow: 0 0 18px 6px rgba(46,174,109,0.2); } 100% { box-shadow: 0 4px 16px rgba(46,174,109,0.1); } }
            @keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(650px) rotate(780deg); opacity: 0; } }
            @keyframes smCelebrate { 0%, 100% { transform: scale(1); } 20% { transform: scale(1.06) rotate(-1.5deg); } 40% { transform: scale(1.1); } 60% { transform: scale(1.06) rotate(1.5deg); } 80% { transform: scale(1.03); } }
            @keyframes smDrawLine { from { stroke-dashoffset: 500; } to { stroke-dashoffset: 0; } }
            @keyframes smStarSpin { from { transform: rotate(0deg) scale(0); opacity: 0; } to { transform: rotate(360deg) scale(1); opacity: 1; } }
            @keyframes smSlideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 80px; } }
            @keyframes smGradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
            @keyframes smBadgePop { 0% { transform: scale(0) rotate(-30deg); opacity: 0; } 60% { transform: scale(1.15) rotate(5deg); } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
        `;

    const styleSheet = document.createElement("style");
    styleSheet.id = "sm-matching-tool-keyframes";
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);

    return () => {
      const existing = document.getElementById("sm-matching-tool-keyframes");
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  // ─── MATCH LOGIC ───
  const handleStatementClick = useCallback(
    (id: string) => {
      if (correctMatches.has(id)) return;
      setSelectedStatement((prev) => (prev === id ? null : id));
      setShowInstructions(false);
    },
    [correctMatches],
  );

  const handleExampleClick = useCallback(
    (id: string) => {
      if (correctMatches.has(id)) return;
      setSelectedExample((prev) => (prev === id ? null : id));
      setShowInstructions(false);
    },
    [correctMatches],
  );

  useEffect(() => {
    if (selectedStatement && selectedExample) {
      const statementPair = pairs.find((p) => p.id === selectedStatement);
      if (statementPair && statementPair.id === selectedExample) {
        setCorrectMatches((prev) => new Set([...prev, selectedStatement]));
        setMatches((prev) => ({
          ...prev,
          [selectedStatement]: selectedExample,
        }));
        setTimeout(() => {
          setSelectedStatement(null);
          setSelectedExample(null);
        }, 600);
      } else {
        setIncorrectFlash({
          statementId: selectedStatement,
          exampleId: selectedExample,
        });
        setTimeout(() => {
          setIncorrectFlash(null);
          setSelectedStatement(null);
          setSelectedExample(null);
        }, 800);
      }
    }
  }, [selectedStatement, selectedExample, pairs]);

  useEffect(() => {
    if (correctMatches.size === pairs.length && pairs.length > 0) {
      setTimeout(() => setAllCorrect(true), 500);
    }
  }, [correctMatches, pairs.length]);

  // ─── SVG LINES ───
  const getCardCenter = useCallback(
    (
      ref: HTMLDivElement | null,
      side: "right" | "left",
    ): { x: number; y: number } => {
      if (!ref || !containerRef.current) return { x: 0, y: 0 };
      const cR = containerRef.current.getBoundingClientRect();
      const r = ref.getBoundingClientRect();
      return {
        x: side === "right" ? r.right - cR.left : r.left - cR.left,
        y: r.top + r.height / 2 - cR.top,
      };
    },
    [],
  );

  const renderLines = useCallback(() => {
    const lines: React.ReactElement[] = [];

    correctMatches.forEach((id) => {
      const s = getCardCenter(statementRefs.current[id], "right");
      const e = getCardCenter(exampleRefs.current[id], "left");
      if (s.x === 0 && s.y === 0) return;
      const mx = (s.x + e.x) / 2;
      const path = `M ${s.x} ${s.y} C ${mx} ${s.y}, ${mx} ${e.y}, ${e.x} ${e.y}`;
      lines.push(
        <g key={`correct-${id}`}>
          <path
            d={path}
            stroke={correctLineColor}
            strokeWidth="8"
            fill="none"
            opacity={0.12}
            strokeLinecap="round"
          />
          <path
            d={path}
            stroke={correctLineColor}
            strokeWidth="3"
            fill="none"
            strokeDasharray="500"
            strokeLinecap="round"
            style={{ animation: "smDrawLine 0.7s ease-out forwards" }}
          />
          <circle
            cx={s.x}
            cy={s.y}
            r="5"
            fill={correctLineColor}
            opacity={0.8}
          />
          <circle
            cx={e.x}
            cy={e.y}
            r="5"
            fill={correctLineColor}
            opacity={0.8}
          />
        </g>,
      );
    });

    if (selectedStatement && !selectedExample) {
      const s = getCardCenter(
        statementRefs.current[selectedStatement],
        "right",
      );
      if (s.x > 0)
        lines.push(
          <circle
            key="active-dot"
            cx={s.x}
            cy={s.y}
            r="7"
            fill={DS.colors.primary}
            opacity={0.6}
            style={{ animation: "smPulse 1.2s ease-in-out infinite" }}
          />,
        );
    }

    if (incorrectFlash) {
      const s = getCardCenter(
        statementRefs.current[incorrectFlash.statementId],
        "right",
      );
      const e = getCardCenter(
        exampleRefs.current[incorrectFlash.exampleId],
        "left",
      );
      if (s.x > 0) {
        const mx = (s.x + e.x) / 2;
        lines.push(
          <path
            key="incorrect-line"
            d={`M ${s.x} ${s.y} C ${mx} ${s.y}, ${mx} ${e.y}, ${e.x} ${e.y}`}
            stroke={incorrectLineColor}
            strokeWidth="3"
            fill="none"
            strokeDasharray="8,6"
            strokeLinecap="round"
            opacity={0.7}
          />,
        );
      }
    }
    return lines;
  }, [
    correctMatches,
    selectedStatement,
    selectedExample,
    incorrectFlash,
    getCardCenter,
    correctLineColor,
    incorrectLineColor,
  ]);

  // ─── RESET ───
  const handleReset = useCallback(() => {
    setSelectedStatement(null);
    setSelectedExample(null);
    setMatches({});
    setCorrectMatches(new Set());
    setIncorrectFlash(null);
    setAllCorrect(false);
    setShowInstructions(true);
    setShuffledExamples(shuffleArray(pairs, Date.now()));
  }, [pairs]);

  // ─── STEP DETAILS ───
  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: correctMatches.size,
        totalSteps: pairs.length,
        isPaused: true,
        currentMode: "practice",
      });
  }, [correctMatches.size, pairs.length, setStepDetails]);

  // ─── HELPERS ───
  const isCorrect = (id: string) => correctMatches.has(id);
  const isStmtSel = (id: string) => selectedStatement === id;
  const isExSel = (id: string) => selectedExample === id;
  const isStmtErr = (id: string) => incorrectFlash?.statementId === id;
  const isExErr = (id: string) => incorrectFlash?.exampleId === id;
  const progressPercent = (correctMatches.size / pairs.length) * 100;

  // ═══════════ RENDER ═══════════
  return (
    <div
      ref={containerRef}
      style={{
        width: config.width,
        maxWidth: "100%",
        minHeight: config.height,
        fontFamily: DS.font,
        background: `linear-gradient(160deg, ${DS.colors.bgPurpleSoft} 0%, ${DS.colors.white} 40%, ${DS.colors.bgPeachSoft} 100%)`,
        backgroundSize: "200% 200%",
        animation: "smGradientShift 15s ease infinite",
        borderRadius: DS.radius.xl,
        overflow: "hidden",
        position: "relative",
        boxShadow: DS.shadow.xl,
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${DS.colors.gray200}`,
      }}
    >
      <Confetti active={allCorrect} />

      {/* ══ HEADER ══ */}
      <div
        style={{
          padding: "24px 28px 16px",
          textAlign: "center",
          animation: mountAnim ? "smFadeInUp 0.6s ease-out" : "none",
          opacity: mountAnim ? 1 : 0,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: DS.colors.white,
            padding: "10px 24px",
            borderRadius: DS.radius.full,
            boxShadow: DS.shadow.md,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: mountAnim ? "smStarSpin 0.8s ease-out" : "none",
            }}
          >
            <Sparkles size={17} color={DS.colors.white} strokeWidth={2.5} />
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 700,
              color: DS.colors.gradientStart,
              letterSpacing: "-0.2px",
            }}
          >
            {title}
          </h2>
        </div>

        {showInstructions && (
          <div
            style={{
              animation: "smSlideDown 0.4s ease-out forwards",
              overflow: "hidden",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: DS.colors.textMid,
                fontWeight: 400,
                lineHeight: 1.5,
              }}
            >
              {instructions}
            </p>
          </div>
        )}

        {/* Progress */}
        <div
          style={{
            marginTop: 14,
            height: 6,
            borderRadius: DS.radius.full,
            background: DS.colors.gray200,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: DS.radius.full,
              background: allCorrect
                ? `linear-gradient(90deg, ${DS.colors.success}, #34D399)`
                : `linear-gradient(90deg, ${DS.colors.primary}, ${DS.colors.accent})`,
              width: `${progressPercent}%`,
              transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          />
        </div>
        <div
          style={{
            fontSize: 11,
            color: DS.colors.textLight,
            marginTop: 6,
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          {correctMatches.size} / {pairs.length} matched
        </div>
      </div>

      {/* SVG */}
      <svg
        ref={svgRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        {renderLines()}
      </svg>

      {/* ══ MATCHING AREA ══ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: 20,
          padding: "4px 24px 20px",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* LEFT: KEY IDEAS */}
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              textTransform: "uppercase",
              color: DS.colors.primary,
              letterSpacing: "2px",
              textAlign: "center",
              padding: "4px 0 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 18,
                height: 2,
                borderRadius: 1,
                background: `linear-gradient(90deg, transparent, ${DS.colors.primary})`,
              }}
            />
            Key Ideas
            <div
              style={{
                width: 18,
                height: 2,
                borderRadius: 1,
                background: `linear-gradient(90deg, ${DS.colors.primary}, transparent)`,
              }}
            />
          </div>

          {pairs.map((pair, index) => {
            const c = isCorrect(pair.id),
              s = isStmtSel(pair.id),
              e = isStmtErr(pair.id);
            return (
              <div
                key={`stmt-${pair.id}`}
                ref={(el) => {
                  statementRefs.current[pair.id] = el;
                }}
                onClick={() => handleStatementClick(pair.id)}
                onMouseEnter={() => !c && setHoverStatement(pair.id)}
                onMouseLeave={() => setHoverStatement(null)}
                style={{
                  padding: "14px 16px",
                  borderRadius: DS.radius.md,
                  position: "relative",
                  overflow: "hidden",
                  background: c
                    ? DS.colors.successLight
                    : s
                      ? DS.colors.lightPurple
                      : e
                        ? DS.colors.errorLight
                        : statementCardColor,
                  color: c ? "#065F46" : statementTextColor,
                  cursor: c ? "default" : "pointer",
                  border: c
                    ? `2px solid ${DS.colors.successBorder}`
                    : s
                      ? `2px solid ${DS.colors.primary}`
                      : e
                        ? `2px solid ${DS.colors.error}`
                        : "2px solid transparent",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: s
                    ? "scale(1.025) translateX(4px)"
                    : hoverStatement === pair.id && !c
                      ? "scale(1.015) translateX(2px)"
                      : "scale(1)",
                  boxShadow: s
                    ? "0 4px 20px rgba(74,77,201,0.2)"
                    : c
                      ? "0 2px 12px rgba(46,174,109,0.12)"
                      : hoverStatement === pair.id
                        ? DS.shadow.md
                        : DS.shadow.sm,
                  animation: e
                    ? "smShake 0.5s ease-in-out"
                    : c
                      ? "smCorrectGlow 0.8s ease-out forwards"
                      : mountAnim
                        ? `smFadeInLeft 0.45s ease-out ${index * 0.1 + 0.1}s both`
                        : "none",
                }}
              >
                {s && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(135deg, ${DS.colors.primary}08, ${DS.colors.primary}15)`,
                      borderRadius: DS.radius.md,
                    }}
                  />
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      minWidth: 30,
                      height: 30,
                      borderRadius: DS.radius.sm,
                      background: c
                        ? DS.colors.success
                        : s
                          ? DS.colors.primary
                          : DS.colors.gradientStart,
                      color: DS.colors.white,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      transition: "all 0.3s ease",
                      flexShrink: 0,
                      boxShadow: s ? DS.shadow.glow : "none",
                    }}
                  >
                    {c ? (
                      <Check size={16} strokeWidth={3} />
                    ) : (
                      pair.statementLabel
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 500,
                      lineHeight: "1.5",
                      color: c ? "#065F46" : statementTextColor,
                    }}
                  >
                    {pair.statement}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: EXAMPLES */}
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              textTransform: "uppercase",
              color: DS.colors.accent,
              letterSpacing: "2px",
              textAlign: "center",
              padding: "4px 0 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 18,
                height: 2,
                borderRadius: 1,
                background: `linear-gradient(90deg, transparent, ${DS.colors.accent})`,
              }}
            />
            Examples
            <div
              style={{
                width: 18,
                height: 2,
                borderRadius: 1,
                background: `linear-gradient(90deg, ${DS.colors.accent}, transparent)`,
              }}
            />
          </div>

          {shuffledExamples.map((pair, index) => {
            const c = isCorrect(pair.id),
              s = isExSel(pair.id),
              e = isExErr(pair.id);
            return (
              <div
                key={`ex-${pair.id}`}
                ref={(el) => {
                  exampleRefs.current[pair.id] = el;
                }}
                onClick={() => handleExampleClick(pair.id)}
                onMouseEnter={() => !c && setHoverExample(pair.id)}
                onMouseLeave={() => setHoverExample(null)}
                style={{
                  padding: "14px 16px",
                  borderRadius: DS.radius.md,
                  position: "relative",
                  overflow: "hidden",
                  background: c
                    ? DS.colors.successLight
                    : s
                      ? DS.colors.lightPeach
                      : e
                        ? DS.colors.errorLight
                        : exampleCardColor,
                  color: c ? "#065F46" : exampleTextColor,
                  cursor: c ? "default" : "pointer",
                  border: c
                    ? `2px solid ${DS.colors.successBorder}`
                    : s
                      ? `2px solid ${DS.colors.accent}`
                      : e
                        ? `2px solid ${DS.colors.error}`
                        : "2px solid transparent",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: s
                    ? "scale(1.025) translateX(-4px)"
                    : hoverExample === pair.id && !c
                      ? "scale(1.015) translateX(-2px)"
                      : "scale(1)",
                  boxShadow: s
                    ? "0 4px 20px rgba(255,114,18,0.2)"
                    : c
                      ? "0 2px 12px rgba(46,174,109,0.12)"
                      : hoverExample === pair.id
                        ? DS.shadow.md
                        : DS.shadow.sm,
                  animation: e
                    ? "smShake 0.5s ease-in-out"
                    : c
                      ? "smCorrectGlow 0.8s ease-out forwards"
                      : mountAnim
                        ? `smFadeInRight 0.45s ease-out ${index * 0.1 + 0.1}s both`
                        : "none",
                }}
              >
                {s && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(135deg, ${DS.colors.accent}08, ${DS.colors.accent}15)`,
                      borderRadius: DS.radius.md,
                    }}
                  />
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      minWidth: 30,
                      height: 30,
                      borderRadius: DS.radius.sm,
                      background: c
                        ? DS.colors.success
                        : s
                          ? DS.colors.accent
                          : DS.colors.gradientEnd,
                      color: DS.colors.white,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      transition: "all 0.3s ease",
                      flexShrink: 0,
                      boxShadow: s ? DS.shadow.accentGlow : "none",
                    }}
                  >
                    {c ? (
                      <Check size={16} strokeWidth={3} />
                    ) : (
                      pair.exampleLabel
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 500,
                      lineHeight: "1.5",
                      color: c ? "#065F46" : exampleTextColor,
                    }}
                  >
                    {pair.example}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ CONGRATS ══ */}
      {allCorrect && (
        <div
          style={{
            margin: "0 24px 16px",
            padding: "20px 28px",
            borderRadius: DS.radius.lg,
            background: `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.primary}, ${DS.colors.gradientEnd})`,
            color: DS.colors.white,
            textAlign: "center",
            animation: "smCelebrate 0.8s ease-out",
            boxShadow: "0 8px 32px rgba(83,48,134,0.35)",
            zIndex: 20,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <div style={{ animation: "smBadgePop 0.6s ease-out 0.2s both" }}>
              <Award size={28} strokeWidth={2} />
            </div>
            <span
              style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.3px" }}
            >
              Excellent Work!
            </span>
            <div style={{ animation: "smBadgePop 0.6s ease-out 0.4s both" }}>
              <Award size={28} strokeWidth={2} />
            </div>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 400,
              opacity: 0.9,
              lineHeight: 1.5,
            }}
          >
            {congratsMessage}
          </p>
        </div>
      )}

      {/* ══ FOOTER ══ */}
      <div
        style={{
          padding: "8px 24px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 20,
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: DS.colors.textLight,
            maxWidth: "58%",
            lineHeight: 1.5,
          }}
        >
          <span style={{ fontWeight: 600, color: DS.colors.textMid }}>
            Teaching Tip:{" "}
          </span>
          Try matching without notes first, then verify. Discuss mismatches as a
          class.
        </div>

        <button
          onClick={handleReset}
          onMouseEnter={() => setResetBtnHover(true)}
          onMouseLeave={() => {
            setResetBtnHover(false);
            setResetBtnActive(false);
          }}
          onMouseDown={() => setResetBtnActive(true)}
          onMouseUp={() => setResetBtnActive(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 24px",
            height: 40,
            borderRadius: DS.radius.full,
            border: `2px solid ${resetBtnHover ? DS.colors.primary : DS.colors.gray300}`,
            background: resetBtnHover
              ? `linear-gradient(135deg, ${DS.colors.primary}08, ${DS.colors.primary}12)`
              : DS.colors.white,
            color: resetBtnHover ? DS.colors.primary : DS.colors.textDark,
            fontFamily: DS.font,
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.25s ease",
            transform: resetBtnActive
              ? "scale(0.95)"
              : resetBtnHover
                ? "scale(1.03)"
                : "scale(1)",
            boxShadow: resetBtnHover ? DS.shadow.md : "none",
            outline: "none",
          }}
        >
          <RotateCcw size={15} strokeWidth={2.5} /> Reset
        </button>
      </div>
    </div>
  );
};

export default ChapterSummaryMatchingTool;
