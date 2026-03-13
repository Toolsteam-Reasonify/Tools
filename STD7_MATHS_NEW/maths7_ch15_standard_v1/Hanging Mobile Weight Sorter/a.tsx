// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: hanging_scale_tool.tsx
// Singularity Design System — Fully Responsive
// ═══════════════════════════════════════════════════════════════════════════

// @ts-ignore - module resolved by host/bundler
import React, { useState, useEffect, useCallback, useRef } from "react";
// @ts-ignore - module resolved by host/bundler
import { Check, RotateCcw, Star, ChevronRight, Target } from "lucide-react";

// ==================== DESIGN TOKENS ====================

const DS = {
  primary: "#4A4DC9",
  accent: "#FF7212",
  gradStart: "#533086",
  gradEnd: "#FC9145",
  primaryLight: "#C1C1EA",
  accentLight: "#FFF3E4",
  dark: "#4E4E4E",
  grey: "#CACACA",
  lightGrey: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  success: "#2ECC71",
  successLight: "#E8F8F0",
  error: "#E74C3C",
  errorLight: "#FDECEB",
  font: "'Poppins', sans-serif",
  radiusPill: 100,
  radiusCard: 16,
  radiusLg: 20,
  radiusMd: 12,
  radiusSm: 8,
} as const;

// ==================== RESPONSIVE HOOK ====================

type Breakpoint = "xs" | "sm" | "md" | "lg";

interface ResponsiveValues {
  bp: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  containerW: number;
  containerH: number;
  // Scaled values
  pad: number;
  gap: number;
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  btnH: number;
  btnPx: number;
  btnFs: number;
  svgSize: { grid: number; solve: number };
  gridCols: number;
  headerPad: string;
  headerTitleFs: number;
  headerSubFs: number;
  iconSize: number;
  cardPad: number;
  solveLayout: "row" | "column";
  solveMobileFlex: string;
  scoreGap: number;
  scoreFs: { grade: number; value: number; label: number };
  chipFs: number;
  chipPad: string;
  dotSize: number;
  miniMapSize: number;
}

const useResponsive = (
  containerRef: React.RefObject<HTMLDivElement | null>,
): ResponsiveValues => {
  const [size, setSize] = useState({ w: 800, h: 600 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      setSize({ w: rect.width, h: rect.height });
    };

    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [containerRef]);

  const w = size.w;
  const h = size.h;

  const bp: Breakpoint =
    w < 420 ? "xs" : w < 600 ? "sm" : w < 860 ? "md" : "lg";
  const isMobile = bp === "xs" || bp === "sm";
  const isTablet = bp === "md";
  const isDesktop = bp === "lg";

  return {
    bp,
    isMobile,
    isTablet,
    isDesktop,
    containerW: w,
    containerH: h,
    pad: isMobile ? 10 : isTablet ? 14 : 20,
    gap: isMobile ? 6 : isTablet ? 8 : 10,
    fontSize: {
      xs: isMobile ? 8 : 9,
      sm: isMobile ? 9 : 10,
      md: isMobile ? 10 : 11,
      lg: isMobile ? 11 : isTablet ? 12 : 13,
      xl: isMobile ? 13 : isTablet ? 14 : 15,
      xxl: isMobile ? 16 : isTablet ? 19 : 22,
    },
    btnH: isMobile ? 34 : 40,
    btnPx: isMobile ? 16 : 24,
    btnFs: isMobile ? 11 : 13,
    svgSize: {
      grid: isMobile ? 100 : isTablet ? 115 : 130,
      solve: isMobile ? 180 : isTablet ? 210 : 250,
    },
    gridCols: isMobile ? 2 : 3,
    headerPad: isMobile ? "8px 12px" : "9px 20px",
    headerTitleFs: isMobile ? 12 : 14,
    headerSubFs: isMobile ? 8 : 9,
    iconSize: isMobile ? 14 : 16,
    cardPad: isMobile ? 8 : isTablet ? 10 : 12,
    solveLayout: isMobile ? "column" : "row",
    solveMobileFlex: isMobile ? "1 1 auto" : "0 0 46%",
    scoreGap: isMobile ? 16 : 28,
    scoreFs: {
      grade: isMobile ? 24 : 32,
      value: isMobile ? 20 : 26,
      label: isMobile ? 9 : 10,
    },
    chipFs: isMobile ? 9 : 10,
    chipPad: isMobile ? "2px 8px" : "3px 11px",
    dotSize: isMobile ? 6 : 7,
    miniMapSize: isMobile ? 22 : 26,
  };
};

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "real_world" | "hands_on";
type DifficultyType = "easy" | "medium" | "hard";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}
interface BranchItem {
  label: string;
  weight: number;
  color: string;
  isUnknown?: boolean;
}
interface MobileBranch {
  items: BranchItem[];
}
interface PuzzleData {
  id: number;
  totalWeight: number;
  branches: MobileBranch[];
  unknownLabel: string;
  answer: number;
  difficulty: DifficultyType;
  hint: string;
  figLabel: string;
}
interface HangingScaleAdditionalProps {
  puzzles?: PuzzleData[];
  showDifficultySort?: boolean;
  allowHints?: boolean;
  maxAttempts?: number;
}
interface HangingScaleToolProps {
  props?: {
    width?: number;
    height?: number;
    initialMode?: ModeType;
    showModeSelector?: boolean;
    enabledModes?: ModeType[];
    showNavigation?: boolean;
    animationSpeed?: number;
    themeColor?: string;
    darkMode?: boolean;
    additionalProps?: HangingScaleAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DEFAULT PUZZLES ====================

const DEFAULT_PUZZLES: PuzzleData[] = [
  {
    id: 1,
    totalWeight: 16,
    branches: [
      {
        items: [{ label: "🌵", weight: 3, color: "#4A4DC9", isUnknown: false }],
      },
      {
        items: [{ label: "🪴", weight: -1, color: "#533086", isUnknown: true }],
      },
      {
        items: [{ label: "🌸", weight: -1, color: "#FC9145", isUnknown: true }],
      },
    ],
    unknownLabel: "🪴 and 🌸",
    answer: 5,
    difficulty: "easy",
    hint: "The cactus weighs 3. Two unknowns share the rest. Total is 16.",
    figLabel: "Fig 7.1",
  },
  {
    id: 2,
    totalWeight: 24,
    branches: [
      {
        items: [{ label: "⭐", weight: 2, color: "#FC9145", isUnknown: false }],
      },
      {
        items: [{ label: "🐟", weight: -1, color: "#4A4DC9", isUnknown: true }],
      },
      {
        items: [{ label: "🐚", weight: -1, color: "#533086", isUnknown: true }],
      },
    ],
    unknownLabel: "🐟 and 🐚",
    answer: 4,
    difficulty: "easy",
    hint: "Each starfish weighs 2. How much is left after the known items?",
    figLabel: "Fig 7.2",
  },
  {
    id: 3,
    totalWeight: 8,
    branches: [
      {
        items: [{ label: "📕", weight: -1, color: "#FF7212", isUnknown: true }],
      },
      {
        items: [{ label: "📗", weight: -1, color: "#4A4DC9", isUnknown: true }],
      },
      {
        items: [{ label: "📄", weight: -1, color: "#C1C1EA", isUnknown: true }],
      },
    ],
    unknownLabel: "📕, 📗, 📄",
    answer: 2,
    difficulty: "medium",
    hint: "All items have equal weight. Split 8 equally among them.",
    figLabel: "Fig 7.3",
  },
  {
    id: 4,
    totalWeight: 18,
    branches: [
      {
        items: [{ label: "☀️", weight: 5, color: "#FC9145", isUnknown: false }],
      },
      {
        items: [
          { label: "🌧️", weight: -1, color: "#4A4DC9", isUnknown: true },
          { label: "🌧️", weight: -1, color: "#4A4DC9", isUnknown: true },
        ],
      },
      {
        items: [{ label: "⚡", weight: -1, color: "#FF7212", isUnknown: true }],
      },
    ],
    unknownLabel: "🌧️ and ⚡",
    answer: 3,
    difficulty: "medium",
    hint: "Sun weighs 5. Subtract it, then split the rest among unknowns.",
    figLabel: "Fig 7.4",
  },
  {
    id: 5,
    totalWeight: 40,
    branches: [
      {
        items: [
          { label: "🔥", weight: -1, color: "#FF7212", isUnknown: true },
          { label: "🔥", weight: -1, color: "#FF7212", isUnknown: true },
        ],
      },
      {
        items: [
          { label: "🟢", weight: 4, color: "#4A4DC9", isUnknown: false },
          { label: "🟢", weight: 4, color: "#4A4DC9", isUnknown: false },
          { label: "🟢", weight: 4, color: "#4A4DC9", isUnknown: false },
          { label: "🟢", weight: 4, color: "#4A4DC9", isUnknown: false },
        ],
      },
      {
        items: [{ label: "🍌", weight: -1, color: "#FC9145", isUnknown: true }],
      },
    ],
    unknownLabel: "🔥 and 🍌",
    answer: 8,
    difficulty: "hard",
    hint: "Greens total 16. Remaining 24 is shared by 3 unknowns.",
    figLabel: "Fig 7.5",
  },
  {
    id: 6,
    totalWeight: 30,
    branches: [
      {
        items: [
          { label: "🎈", weight: -1, color: "#FF7212", isUnknown: true },
          { label: "🎈", weight: -1, color: "#FF7212", isUnknown: true },
        ],
      },
      {
        items: [{ label: "🎁", weight: 6, color: "#533086", isUnknown: false }],
      },
      {
        items: [
          { label: "🧸", weight: -1, color: "#FC9145", isUnknown: true },
          { label: "🧸", weight: -1, color: "#FC9145", isUnknown: true },
        ],
      },
    ],
    unknownLabel: "🎈 and 🧸",
    answer: 6,
    difficulty: "hard",
    hint: "Gift = 6. Remaining 24 shared by 4 unknowns.",
    figLabel: "Fig 7.6",
  },
];

// ==================== MAIN COMPONENT ====================

const HangingScaleTool: React.FC<HangingScaleToolProps> = ({ props: propsIn }) => {
  const props = (propsIn ?? {}) as NonNullable<HangingScaleToolProps["props"]>;
  const { additionalProps = {} } = props;
  const {
    puzzles = DEFAULT_PUZZLES,
    allowHints = true,
    maxAttempts = 3,
  } = additionalProps as HangingScaleAdditionalProps;

  const containerRef = useRef<HTMLDivElement>(null);
  const R = useResponsive(containerRef);

  // ==================== STATE ====================

  type PhaseType = "categorize" | "solve" | "complete";
  const [phase, setPhase] = useState<PhaseType>("categorize");
  const [categorized, setCategorized] = useState<
    Record<number, DifficultyType>
  >({});
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [attempts, setAttempts] = useState<Record<number, number>>({});
  const [solved, setSolved] = useState<Record<number, boolean>>({});
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [animateIn, setAnimateIn] = useState(true);
  const [swingAngle, setSwingAngle] = useState(0);
  const [score, setScore] = useState(0);
  const [sortedPuzzles, setSortedPuzzles] = useState<PuzzleData[]>([]);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ==================== KEYFRAMES ====================

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.id = "sg-kf-responsive";
    styleSheet.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
            @keyframes sg-fadeInUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
            @keyframes sg-fadeInDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
            @keyframes sg-popIn { 0%{transform:scale(0);opacity:0} 65%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
            @keyframes sg-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
            @keyframes sg-shakeX { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
            @keyframes sg-slideInLeft { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
            @keyframes sg-slideInRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
            @keyframes sg-slideInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
            @keyframes sg-dropIn { 0%{transform:translateY(-40px) scale(0.6);opacity:0} 60%{transform:translateY(6px) scale(1.03);opacity:1} 100%{transform:translateY(0) scale(1);opacity:1} }
            @keyframes sg-starSpin { from{transform:rotate(0deg) scale(0);opacity:0} to{transform:rotate(360deg) scale(1);opacity:1} }
            @keyframes sg-gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        `;
    document.head.appendChild(styleSheet);
    return () => {
      const el = document.getElementById("sg-kf-responsive");
      if (el) document.head.removeChild(el);
    };
  }, []);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const t = ((ts - start) % 4000) / 4000;
      setSwingAngle(Math.sin(t * Math.PI * 2) * 2);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    setAnimateIn(false);
    const t = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(t);
  }, [currentPuzzleIndex, phase]);
  useEffect(() => {
    if (phase === "solve" && inputRef.current)
      setTimeout(() => inputRef.current?.focus(), 500);
  }, [phase, currentPuzzleIndex]);

  // ==================== TOKENS ====================

  const diffTokens: Record<
    DifficultyType,
    { bg: string; text: string; border: string; dot: string; label: string }
  > = {
    easy: {
      bg: DS.accentLight,
      text: "#B45309",
      border: DS.accent,
      dot: "#22C55E",
      label: "Easy",
    },
    medium: {
      bg: "#F3EEFF",
      text: DS.gradStart,
      border: DS.primaryLight,
      dot: "#F59E0B",
      label: "Medium",
    },
    hard: {
      bg: "#FDE8E8",
      text: "#B91C1C",
      border: "#FCA5A5",
      dot: "#EF4444",
      label: "Hard",
    },
  };

  // ==================== BUTTON (Singularity) ====================

  const SgButton: React.FC<{
    variant?: "contained" | "outlined" | "text" | "highlight";
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    icon?: React.ReactNode;
    size?: "sm" | "md";
    id?: string;
  }> = ({
    variant = "contained",
    children,
    onClick,
    disabled = false,
    icon,
    size = "md",
    id = "",
  }) => {
    const btnId = id || `btn-${variant}-${String(children)}`;
    const isH = hoveredBtn === btnId;
    const isP = pressedBtn === btnId;
    const h = size === "sm" ? (R.isMobile ? 28 : 32) : R.btnH;
    const px = size === "sm" ? (R.isMobile ? 12 : 16) : R.btnPx;
    const fs = size === "sm" ? (R.isMobile ? 10 : 12) : R.btnFs;

    let bg = "",
      clr = "",
      bdr = "",
      shd = "";
    if (disabled) {
      bg = DS.lightGrey;
      clr = DS.grey;
      bdr = "none";
    } else if (variant === "contained") {
      bg = isP
        ? DS.gradStart
        : isH
          ? `linear-gradient(135deg,${DS.gradStart},${DS.primary})`
          : DS.primary;
      clr = DS.white;
      bdr = "none";
      shd = isH
        ? "0 6px 20px rgba(74,77,201,.3)"
        : "0 2px 8px rgba(74,77,201,.18)";
    } else if (variant === "outlined") {
      bg = isH ? DS.primaryLight + "33" : "transparent";
      clr = DS.primary;
      bdr = `2px solid ${isH ? DS.primary : DS.primaryLight}`;
      shd = isH ? "0 2px 12px rgba(74,77,201,.1)" : "none";
    } else if (variant === "text") {
      bg = isH ? DS.primaryLight + "22" : "transparent";
      clr = DS.primary;
      bdr = isH ? `1px solid ${DS.primaryLight}` : "1px solid transparent";
    } else if (variant === "highlight") {
      bg = isP
        ? "#E5600F"
        : isH
          ? `linear-gradient(135deg,${DS.accent},${DS.gradEnd})`
          : DS.accent;
      clr = DS.white;
      bdr = "none";
      shd = isH
        ? "0 6px 20px rgba(255,114,18,.3)"
        : "0 2px 8px rgba(255,114,18,.18)";
    }

    return (
      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => !disabled && setHoveredBtn(btnId)}
        onMouseLeave={() => {
          setHoveredBtn(null);
          setPressedBtn(null);
        }}
        onMouseDown={() => !disabled && setPressedBtn(btnId)}
        onMouseUp={() => setPressedBtn(null)}
        style={{
          height: h,
          padding: `0 ${px}px`,
          borderRadius: DS.radiusPill,
          border: bdr,
          background: bg,
          color: clr,
          fontFamily: DS.font,
          fontWeight: 600,
          fontSize: fs,
          cursor: disabled ? "not-allowed" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          boxShadow: shd,
          transition: "all .22s cubic-bezier(.4,0,.2,1)",
          transform: isP
            ? "scale(.96)"
            : isH && !disabled
              ? "scale(1.02)"
              : "scale(1)",
          outline: "none",
          whiteSpace: "nowrap" as const,
          letterSpacing: 0.2,
          opacity: disabled ? 0.55 : 1,
          boxSizing: "border-box" as const,
        }}
      >
        {icon && (
          <span
            style={{ display: "flex", alignItems: "center", marginRight: 2 }}
          >
            {icon}
          </span>
        )}
        {children}
      </button>
    );
  };

  // ==================== HANDLERS ====================

  const handleCategorize = (pid: number, d: DifficultyType) =>
    setCategorized((p) => ({ ...p, [pid]: d }));

  const startSolving = useCallback(() => {
    const order: DifficultyType[] = ["easy", "medium", "hard"];
    const sorted = [...puzzles].sort(
      (a, b) =>
        order.indexOf(categorized[a.id] || a.difficulty) -
        order.indexOf(categorized[b.id] || b.difficulty),
    );
    setSortedPuzzles(sorted);
    setCurrentPuzzleIndex(0);
    setPhase("solve");
  }, [puzzles, categorized]);

  const allCategorized = puzzles.every((p) => categorized[p.id]);
  const currentPuzzle = sortedPuzzles[currentPuzzleIndex];

  const handleSubmit = useCallback(() => {
    if (!currentPuzzle || userAnswer.trim() === "") return;
    const num = parseFloat(userAnswer);
    const pa = (attempts[currentPuzzle.id] || 0) + 1;
    setAttempts((p) => ({ ...p, [currentPuzzle.id]: pa }));
    if (num === currentPuzzle.answer) {
      setFeedback("correct");
      setSolved((p) => ({ ...p, [currentPuzzle.id]: true }));
      setScore((p) => p + Math.max(1, maxAttempts - pa + 1) * 10);
      setTimeout(() => {
        setFeedback(null);
        setUserAnswer("");
        setShowHint(false);
        if (currentPuzzleIndex < sortedPuzzles.length - 1)
          setCurrentPuzzleIndex((p) => p + 1);
        else setPhase("complete");
      }, 1600);
    } else {
      setFeedback("wrong");
      if (pa >= maxAttempts) {
        setTimeout(() => {
          setFeedback(null);
          setUserAnswer("");
          setShowHint(false);
          setSolved((p) => ({ ...p, [currentPuzzle.id]: false }));
          if (currentPuzzleIndex < sortedPuzzles.length - 1)
            setCurrentPuzzleIndex((p) => p + 1);
          else setPhase("complete");
        }, 1800);
      } else setTimeout(() => setFeedback(null), 1000);
    }
  }, [
    currentPuzzle,
    userAnswer,
    attempts,
    maxAttempts,
    currentPuzzleIndex,
    sortedPuzzles.length,
  ]);

  const handleReset = () => {
    setPhase("categorize");
    setCategorized({});
    setCurrentPuzzleIndex(0);
    setUserAnswer("");
    setAttempts({});
    setSolved({});
    setShowHint(false);
    setFeedback(null);
    setScore(0);
    setSortedPuzzles([]);
  };
  const totalSolved = Object.values(solved).filter(Boolean).length;

  // ==================== SVG RENDERER ====================

  const renderMobileSVG = (puzzle: PuzzleData, size: number) => {
    const cx = size / 2;
    const topY = 14;
    const barY = topY + 26;
    const bc = puzzle.branches.length;
    const sp = (size - 48) / Math.max(bc - 1, 1);
    const sx = 24;
    const itemR = Math.max(9, size * 0.05);
    const itemFs = Math.max(9, size * 0.052);
    const labelFs = Math.max(7, size * 0.032);
    const weightFs = Math.max(9, size * 0.048);

    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: "visible" }}
      >
        <polygon
          points={`${cx},${topY - 10} ${cx - 6},${topY + 2} ${cx + 6},${topY + 2}`}
          fill={DS.gradStart}
          stroke={DS.primary}
          strokeWidth="1"
        />
        <circle
          cx={cx}
          cy={topY + 12}
          r={Math.max(11, size * 0.058)}
          fill={`url(#sgG${puzzle.id})`}
          stroke={DS.primary}
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id={`sgG${puzzle.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={DS.gradStart} />
            <stop offset="100%" stopColor={DS.gradEnd} />
          </linearGradient>
        </defs>
        <text
          x={cx}
          y={topY + 16}
          textAnchor="middle"
          fill="white"
          fontWeight="700"
          fontSize={weightFs}
          fontFamily="Poppins,sans-serif"
        >
          {puzzle.totalWeight}
        </text>
        <line
          x1={cx}
          y1={topY + 24}
          x2={cx}
          y2={barY + 12}
          stroke={DS.dark}
          strokeWidth="1.8"
        />
        <line
          x1={sx - 3}
          y1={barY + 12}
          x2={size - sx + 3}
          y2={barY + 12}
          stroke={DS.dark}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {puzzle.branches.map((branch, bi) => {
          const bx = bc === 1 ? cx : sx + bi * sp;
          const wl = 22 + (branch.items.length > 2 ? 6 : 0);
          return (
            <g
              key={bi}
              style={{
                animation: animateIn
                  ? `sg-dropIn .5s ease-out ${bi * 0.1}s both`
                  : "none",
              }}
            >
              <line
                x1={bx}
                y1={barY + 12}
                x2={bx}
                y2={barY + 12 + wl}
                stroke={DS.grey}
                strokeWidth="1"
                strokeDasharray="3 2"
              />
              {branch.items.map((item, ii) => {
                const iy = barY + 12 + wl + ii * (itemR * 2 + 6);
                return (
                  <g key={ii}>
                    {ii > 0 && (
                      <line
                        x1={bx}
                        y1={iy - itemR - 2}
                        x2={bx}
                        y2={iy}
                        stroke={DS.lightGrey}
                        strokeWidth=".8"
                      />
                    )}
                    <circle
                      cx={bx}
                      cy={iy + itemR - 2}
                      r={itemR}
                      fill={
                        item.isUnknown ? DS.offWhite : DS.primaryLight + "55"
                      }
                      stroke={item.isUnknown ? DS.accent : DS.primary}
                      strokeWidth={item.isUnknown ? 1.6 : 1.2}
                      strokeDasharray={item.isUnknown ? "3 2" : "none"}
                    />
                    <text
                      x={bx}
                      y={iy + itemR + 2}
                      textAnchor="middle"
                      fontSize={itemFs}
                    >
                      {item.label}
                    </text>
                    <text
                      x={bx}
                      y={iy + itemR + 2 + labelFs + 2}
                      textAnchor="middle"
                      fontSize={labelFs}
                      fill={item.isUnknown ? DS.accent : DS.dark}
                      fontWeight={item.isUnknown ? "700" : "600"}
                      fontFamily="Poppins,sans-serif"
                    >
                      {item.isUnknown ? "= ?" : `=${item.weight}`}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    );
  };

  // ==================== DIFF CHIP ====================

  const DiffChip: React.FC<{
    diff: DifficultyType;
    selected: boolean;
    onClick: () => void;
  }> = ({ diff, selected, onClick }) => {
    const t = diffTokens[diff];
    return (
      <button
        onClick={onClick}
        style={{
          padding: R.chipPad,
          borderRadius: DS.radiusPill,
          border: `2px solid ${selected ? t.border : DS.lightGrey}`,
          background: selected ? t.bg : DS.white,
          color: selected ? t.text : DS.grey,
          fontWeight: selected ? 700 : 500,
          fontSize: R.chipFs,
          fontFamily: DS.font,
          cursor: "pointer",
          transition: "all .22s ease",
          transform: selected ? "scale(1.06)" : "scale(1)",
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
          outline: "none",
        }}
      >
        <span
          style={{
            width: R.dotSize,
            height: R.dotSize,
            borderRadius: "50%",
            background: selected ? t.dot : DS.lightGrey,
            display: "inline-block",
            transition: "background .2s ease",
          }}
        />
        {t.label}
      </button>
    );
  };

  // ==================== PHASE: CATEGORIZE ====================

  const renderCategorize = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column" as const,
        height: "100%",
        padding: `${R.pad}px`,
        gap: R.gap,
      }}
    >
      <div
        style={{
          textAlign: "center" as const,
          animation: "sg-fadeInDown .5s ease-out",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: `linear-gradient(135deg,${DS.gradStart},${DS.gradEnd})`,
            backgroundSize: "200% 200%",
            animation: "sg-gradientShift 6s ease infinite",
            color: DS.white,
            padding: R.isMobile ? "5px 14px" : "7px 22px",
            borderRadius: DS.radiusPill,
            fontWeight: 700,
            fontSize: R.fontSize.lg,
            fontFamily: DS.font,
            boxShadow: "0 4px 16px rgba(83,48,134,.25)",
          }}
        >
          <Target size={R.iconSize} /> Step 1: Categorize
        </div>
        <p
          style={{
            color: DS.dark,
            fontSize: R.fontSize.md,
            marginTop: 4,
            marginBottom: 0,
            fontFamily: DS.font,
            fontWeight: 400,
          }}
        >
          {R.isMobile
            ? "Tap Easy, Medium, or Hard for each"
            : "Look at each mobile puzzle and decide if it's Easy, Medium, or Hard"}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${R.gridCols}, 1fr)`,
          gap: R.gap,
          flex: 1,
          overflow: "auto",
          alignContent: "start",
        }}
      >
        {puzzles.map((puzzle, i) => {
          const cat = categorized[puzzle.id];
          const ct = cat ? diffTokens[cat] : null;
          return (
            <div
              key={puzzle.id}
              style={{
                background: ct ? ct.bg : DS.white,
                border: `2px solid ${ct ? ct.border : DS.lightGrey}`,
                borderRadius: R.isMobile ? DS.radiusMd : DS.radiusCard,
                padding: R.isMobile ? 6 : 8,
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center",
                gap: 2,
                animation: `sg-popIn .45s ease-out ${i * 0.07}s both`,
                transition: "all .25s ease",
              }}
            >
              <div
                style={{
                  fontSize: R.fontSize.xs,
                  fontWeight: 700,
                  color: DS.grey,
                  textTransform: "uppercase" as const,
                  letterSpacing: 1,
                  fontFamily: DS.font,
                }}
              >
                {puzzle.figLabel}
              </div>
              <div
                style={{
                  transform: `rotate(${swingAngle * 0.4}deg)`,
                  transformOrigin: "top center",
                }}
              >
                {renderMobileSVG(puzzle, R.svgSize.grid)}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 3,
                  marginTop: 1,
                  flexWrap: "wrap" as const,
                  justifyContent: "center",
                }}
              >
                {(["easy", "medium", "hard"] as DifficultyType[]).map((d) => (
                  <DiffChip
                    key={d}
                    diff={d}
                    selected={cat === d}
                    onClick={() => handleCategorize(puzzle.id, d)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center" as const, paddingBottom: 2 }}>
        <SgButton
          variant={allCategorized ? "highlight" : "contained"}
          onClick={startSolving}
          disabled={!allCategorized}
          icon={<ChevronRight size={R.iconSize} />}
        >
          Start Solving
        </SgButton>
        {!allCategorized && (
          <p
            style={{
              fontSize: R.fontSize.sm,
              color: DS.grey,
              marginTop: 3,
              marginBottom: 0,
              fontFamily: DS.font,
            }}
          >
            Categorize all {puzzles.length} puzzles to continue
          </p>
        )}
      </div>
    </div>
  );

  // ==================== PHASE: SOLVE ====================

  const renderSolve = () => {
    if (!currentPuzzle) return null;
    const pa = attempts[currentPuzzle.id] || 0;
    const al = maxAttempts - pa;
    const cat = categorized[currentPuzzle.id] || currentPuzzle.difficulty;
    const dt = diffTokens[cat];
    let knownTotal = 0,
      unknownCount = 0;
    currentPuzzle.branches.forEach((b) =>
      b.items.forEach((it) => {
        if (it.isUnknown) unknownCount++;
        else knownTotal += it.weight;
      }),
    );

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column" as const,
          height: "100%",
          padding: `${R.pad}px`,
          gap: R.gap,
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            animation: "sg-fadeInDown .4s ease-out",
            flexWrap: "wrap" as const,
            gap: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                background: dt.bg,
                color: dt.text,
                padding: R.chipPad,
                borderRadius: DS.radiusPill,
                fontSize: R.fontSize.sm,
                fontWeight: 700,
                border: `1.5px solid ${dt.border}`,
                fontFamily: DS.font,
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: dt.dot,
                  display: "inline-block",
                }}
              />
              {dt.label}
            </span>
            <span
              style={{
                fontSize: R.fontSize.lg,
                fontWeight: 600,
                color: DS.dark,
                fontFamily: DS.font,
              }}
            >
              {currentPuzzle.figLabel} · {currentPuzzleIndex + 1}/
              {sortedPuzzles.length}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                background: DS.accentLight,
                padding: R.chipPad,
                borderRadius: DS.radiusPill,
                fontSize: R.fontSize.md,
                fontWeight: 700,
                color: "#B45309",
                fontFamily: DS.font,
              }}
            >
              <Star
                size={R.isMobile ? 11 : 13}
                fill={DS.accent}
                stroke={DS.accent}
              />{" "}
              {score}
            </div>
            <div
              style={{
                fontSize: R.fontSize.sm,
                color: al <= 1 ? DS.error : DS.grey,
                fontWeight: 600,
                fontFamily: DS.font,
              }}
            >
              {al} {al === 1 ? "try" : "tries"}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div
          style={{
            height: 4,
            background: DS.lightGrey,
            borderRadius: DS.radiusPill,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(currentPuzzleIndex / sortedPuzzles.length) * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg,${DS.gradStart},${DS.gradEnd})`,
              borderRadius: DS.radiusPill,
              transition: "width .5s cubic-bezier(.4,0,.2,1)",
            }}
          />
        </div>

        {/* Main — row on desktop, column on mobile */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: R.solveLayout as any,
            gap: R.isMobile ? 8 : 14,
            minHeight: 0,
            overflow: R.isMobile ? "auto" : "hidden",
          }}
        >
          {/* Mobile visual */}
          <div
            style={{
              flex: R.solveMobileFlex,
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              justifyContent: "center",
              background: DS.offWhite,
              borderRadius: R.isMobile ? DS.radiusMd : DS.radiusLg,
              padding: R.isMobile ? 6 : 10,
              animation: animateIn
                ? R.isMobile
                  ? "sg-slideInUp .5s ease-out"
                  : "sg-slideInLeft .5s ease-out"
                : "none",
              position: "relative" as const,
              overflow: "hidden",
              border: `1px solid ${DS.lightGrey}`,
              minHeight: R.isMobile ? "auto" : 0,
            }}
          >
            {!R.isMobile && (
              <>
                <div
                  style={{
                    position: "absolute" as const,
                    top: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    border: `2px solid ${DS.primaryLight}`,
                    borderRadius: "50%",
                    opacity: 0.4,
                  }}
                />
                <div
                  style={{
                    position: "absolute" as const,
                    bottom: 10,
                    left: 10,
                    width: 20,
                    height: 20,
                    border: `2px solid ${DS.accentLight}`,
                    borderRadius: 3,
                    opacity: 0.5,
                    transform: "rotate(15deg)",
                  }}
                />
              </>
            )}
            <div
              style={{
                transform: `rotate(${swingAngle}deg)`,
                transformOrigin: "top center",
              }}
            >
              {renderMobileSVG(currentPuzzle, R.svgSize.solve)}
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: R.fontSize.md,
                color: DS.primary,
                fontWeight: 600,
                background: DS.primaryLight + "44",
                padding: "2px 12px",
                borderRadius: DS.radiusPill,
                fontFamily: DS.font,
                border: `1px solid ${DS.primaryLight}`,
              }}
            >
              Total = {currentPuzzle.totalWeight}
            </div>
          </div>

          {/* Solve panel */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column" as const,
              justifyContent: R.isMobile ? "flex-start" : "center",
              gap: R.gap + 2,
              animation: animateIn
                ? R.isMobile
                  ? "sg-slideInUp .5s ease-out .1s both"
                  : "sg-slideInRight .5s ease-out"
                : "none",
            }}
          >
            {/* Question */}
            <div
              style={{
                background: DS.white,
                borderRadius: R.isMobile ? DS.radiusMd : DS.radiusCard,
                padding: `${R.cardPad}px`,
                boxShadow: "0 1px 8px rgba(0,0,0,.05)",
                border: `1px solid ${DS.lightGrey}`,
              }}
            >
              <div
                style={{
                  fontSize: R.fontSize.lg,
                  fontWeight: 700,
                  color: DS.gradStart,
                  marginBottom: 4,
                  fontFamily: DS.font,
                }}
              >
                🔍 Find the unknown weight
              </div>
              <p
                style={{
                  fontSize: R.fontSize.md,
                  color: DS.dark,
                  margin: 0,
                  lineHeight: 1.5,
                  fontFamily: DS.font,
                  fontWeight: 400,
                }}
              >
                Items{" "}
                <strong style={{ color: DS.accent }}>
                  ({currentPuzzle.unknownLabel})
                </strong>{" "}
                each have the{" "}
                <strong style={{ color: DS.primary }}>same weight</strong>. What
                is it?
              </p>
              <div
                style={{
                  marginTop: 6,
                  padding: "4px 10px",
                  background: DS.offWhite,
                  borderRadius: DS.radiusSm,
                  fontSize: R.fontSize.sm,
                  color: DS.dark,
                  display: "flex",
                  gap: R.isMobile ? 8 : 14,
                  fontFamily: DS.font,
                  fontWeight: 500,
                  border: `1px solid ${DS.lightGrey}`,
                  flexWrap: "wrap" as const,
                }}
              >
                <span>
                  📊 Known:{" "}
                  <strong style={{ color: DS.primary }}>{knownTotal}</strong>
                </span>
                <span>
                  ❓ Unknowns:{" "}
                  <strong style={{ color: DS.accent }}>{unknownCount}</strong>
                </span>
              </div>
            </div>

            {/* Input */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                ref={inputRef}
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Weight..."
                disabled={feedback === "correct"}
                style={{
                  flex: 1,
                  height: R.btnH,
                  padding: "0 14px",
                  borderRadius: DS.radiusPill,
                  border: `2px solid ${feedback === "correct" ? DS.success : feedback === "wrong" ? DS.error : DS.primaryLight}`,
                  fontSize: R.fontSize.xl,
                  fontWeight: 600,
                  color: DS.dark,
                  fontFamily: DS.font,
                  outline: "none",
                  transition: "all .25s ease",
                  background:
                    feedback === "correct"
                      ? DS.successLight
                      : feedback === "wrong"
                        ? DS.errorLight
                        : DS.white,
                  animation:
                    feedback === "wrong" ? "sg-shakeX .4s ease" : "none",
                  boxSizing: "border-box" as const,
                  minWidth: 0,
                }}
              />
              <SgButton
                variant="contained"
                onClick={handleSubmit}
                disabled={userAnswer.trim() === "" || feedback === "correct"}
                icon={<Check size={R.isMobile ? 13 : 15} />}
              >
                {R.isMobile ? "✓" : "Check"}
              </SgButton>
            </div>

            {/* Feedback */}
            {feedback && (
              <div
                style={{
                  padding: `${R.cardPad - 2}px ${R.cardPad}px`,
                  borderRadius: DS.radiusMd,
                  background:
                    feedback === "correct"
                      ? `linear-gradient(135deg,${DS.successLight},#D1FAE5)`
                      : `linear-gradient(135deg,${DS.errorLight},#FEE2E2)`,
                  border: `2px solid ${feedback === "correct" ? DS.success : "#FCA5A5"}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  animation:
                    feedback === "correct"
                      ? "sg-popIn .35s ease-out"
                      : "sg-shakeX .35s ease",
                }}
              >
                <span style={{ fontSize: R.isMobile ? 16 : 20 }}>
                  {feedback === "correct" ? "🎉" : "🤔"}
                </span>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: feedback === "correct" ? "#166534" : "#991B1B",
                      fontSize: R.fontSize.lg,
                      fontFamily: DS.font,
                    }}
                  >
                    {feedback === "correct" ? "Correct!" : "Not quite!"}
                  </div>
                  <div
                    style={{
                      fontSize: R.fontSize.sm,
                      color: feedback === "correct" ? "#15803D" : "#B91C1C",
                      fontFamily: DS.font,
                    }}
                  >
                    {feedback === "correct"
                      ? `Each = ${currentPuzzle.answer}`
                      : al - 1 > 0
                        ? `Try again — ${al - 1} left`
                        : `Answer: ${currentPuzzle.answer}`}
                  </div>
                </div>
              </div>
            )}

            {/* Hint */}
            {allowHints && !showHint && !feedback && pa > 0 && (
              <div>
                <SgButton
                  variant="outlined"
                  size="sm"
                  onClick={() => setShowHint(true)}
                  icon={<span style={{ fontSize: R.fontSize.lg }}>💡</span>}
                >
                  Show Hint
                </SgButton>
              </div>
            )}
            {showHint && (
              <div
                style={{
                  padding: `${R.cardPad - 2}px ${R.cardPad}px`,
                  borderRadius: DS.radiusMd,
                  background: DS.accentLight,
                  border: `1.5px solid ${DS.accent}44`,
                  fontSize: R.fontSize.md,
                  color: "#92400E",
                  fontFamily: DS.font,
                  lineHeight: 1.5,
                  animation: "sg-fadeInUp .35s ease-out",
                }}
              >
                💡 <strong>Hint:</strong> {currentPuzzle.hint}
              </div>
            )}
          </div>
        </div>

        {/* Mini-map */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 4,
            paddingTop: 2,
          }}
        >
          {sortedPuzzles.map((p, i) => {
            const s = solved[p.id] === true;
            const f = solved[p.id] === false;
            const c = i === currentPuzzleIndex;
            return (
              <div
                key={p.id}
                style={{
                  width: R.miniMapSize,
                  height: R.miniMapSize,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: R.fontSize.sm,
                  fontWeight: 700,
                  fontFamily: DS.font,
                  border: `2px solid ${s ? DS.success : f ? "#FCA5A5" : c ? DS.primary : DS.lightGrey}`,
                  background: s
                    ? DS.successLight
                    : f
                      ? DS.errorLight
                      : c
                        ? DS.primaryLight + "44"
                        : DS.white,
                  color: s
                    ? "#166534"
                    : f
                      ? "#991B1B"
                      : c
                        ? DS.primary
                        : DS.grey,
                  transition: "all .25s ease",
                  animation: c ? "sg-pulse 2s ease-in-out infinite" : "none",
                }}
              >
                {s ? "✓" : f ? "✗" : i + 1}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ==================== PHASE: COMPLETE ====================

  const renderComplete = () => {
    const max = puzzles.length * maxAttempts * 10;
    const pct = Math.round((score / max) * 100);
    const grade =
      pct >= 90
        ? "A+"
        : pct >= 75
          ? "A"
          : pct >= 60
            ? "B"
            : pct >= 40
              ? "C"
              : "D";
    const gc = pct >= 75 ? DS.success : pct >= 50 ? DS.accent : DS.error;
    const msg =
      pct >= 90
        ? "Outstanding! You mastered it!"
        : pct >= 75
          ? "Great work!"
          : pct >= 50
            ? "Good effort!"
            : "Keep practising!";

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: R.pad,
          gap: R.isMobile ? 10 : 14,
          overflow: "auto",
          background: `linear-gradient(180deg,${DS.white} 0%,${DS.offWhite} 50%,${DS.primaryLight}22 100%)`,
        }}
      >
        <div
          style={{
            animation: "sg-starSpin .7s ease-out",
            fontSize: R.isMobile ? 40 : 52,
          }}
        >
          🏆
        </div>
        <div
          style={{
            textAlign: "center" as const,
            animation: "sg-fadeInUp .5s ease-out .2s both",
          }}
        >
          <h2
            style={{
              fontSize: R.fontSize.xxl,
              fontWeight: 800,
              color: DS.gradStart,
              margin: "0 0 4px",
              fontFamily: DS.font,
            }}
          >
            Puzzle Complete!
          </h2>
          <p
            style={{
              fontSize: R.fontSize.lg,
              color: DS.dark,
              margin: 0,
              fontFamily: DS.font,
              fontWeight: 400,
            }}
          >
            {msg}
          </p>
        </div>

        {/* Score card */}
        <div
          style={{
            background: DS.white,
            borderRadius: DS.radiusLg,
            padding: R.isMobile ? "12px 16px" : "16px 28px",
            boxShadow: "0 4px 24px rgba(0,0,0,.06)",
            border: `1px solid ${DS.lightGrey}`,
            display: "flex",
            gap: R.scoreGap,
            alignItems: "center",
            animation: "sg-fadeInUp .5s ease-out .4s both",
            flexWrap: "wrap" as const,
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" as const }}>
            <div
              style={{
                fontSize: R.scoreFs.grade,
                fontWeight: 800,
                color: gc,
                lineHeight: 1,
                fontFamily: DS.font,
              }}
            >
              {grade}
            </div>
            <div
              style={{
                fontSize: R.scoreFs.label,
                color: DS.grey,
                fontWeight: 600,
                fontFamily: DS.font,
              }}
            >
              Grade
            </div>
          </div>
          {!R.isMobile && (
            <div style={{ width: 1, height: 44, background: DS.lightGrey }} />
          )}
          <div style={{ textAlign: "center" as const }}>
            <div
              style={{
                fontSize: R.scoreFs.value,
                fontWeight: 800,
                color: DS.accent,
                lineHeight: 1,
                fontFamily: DS.font,
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Star
                size={R.isMobile ? 14 : 18}
                fill={DS.accent}
                stroke={DS.accent}
              />{" "}
              {score}
            </div>
            <div
              style={{
                fontSize: R.scoreFs.label,
                color: DS.grey,
                fontWeight: 600,
                fontFamily: DS.font,
              }}
            >
              Points
            </div>
          </div>
          {!R.isMobile && (
            <div style={{ width: 1, height: 44, background: DS.lightGrey }} />
          )}
          <div style={{ textAlign: "center" as const }}>
            <div
              style={{
                fontSize: R.scoreFs.value,
                fontWeight: 800,
                color: DS.success,
                lineHeight: 1,
                fontFamily: DS.font,
              }}
            >
              {totalSolved}/{puzzles.length}
            </div>
            <div
              style={{
                fontSize: R.scoreFs.label,
                color: DS.grey,
                fontWeight: 600,
                fontFamily: DS.font,
              }}
            >
              Solved
            </div>
          </div>
        </div>

        {/* Results */}
        <div
          style={{
            display: "flex",
            gap: 5,
            flexWrap: "wrap" as const,
            justifyContent: "center",
            animation: "sg-fadeInUp .5s ease-out .6s both",
          }}
        >
          {sortedPuzzles.map((p) => {
            const s = solved[p.id] === true;
            const c2 = categorized[p.id] || p.difficulty;
            const d2 = diffTokens[c2];
            return (
              <div
                key={p.id}
                style={{
                  background: s ? DS.successLight : DS.errorLight,
                  border: `1.5px solid ${s ? DS.success : "#FCA5A5"}`,
                  borderRadius: DS.radiusMd,
                  padding: "4px 10px",
                  fontSize: R.fontSize.sm,
                  fontWeight: 600,
                  fontFamily: DS.font,
                  color: s ? "#166534" : "#991B1B",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                {s ? "✅" : "❌"} {p.figLabel}
                <span
                  style={{
                    fontSize: R.fontSize.xs,
                    padding: "1px 5px",
                    borderRadius: DS.radiusPill,
                    background: d2.bg,
                    color: d2.text,
                    fontWeight: 700,
                  }}
                >
                  {d2.label}
                </span>
              </div>
            );
          })}
        </div>

        <SgButton
          variant="highlight"
          onClick={handleReset}
          icon={<RotateCcw size={R.iconSize} />}
        >
          Try Again
        </SgButton>
      </div>
    );
  };

  // ==================== RENDER ====================

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: 860,
        height: "auto",
        minHeight: 400,
        aspectRatio: "4 / 3",
        fontFamily: DS.font,
        background: DS.white,
        borderRadius: R.isMobile ? DS.radiusMd : DS.radiusLg,
        overflow: "hidden",
        boxShadow: "0 16px 48px rgba(74,77,201,.08), 0 0 0 1px rgba(0,0,0,.04)",
        display: "flex",
        flexDirection: "column" as const,
        position: "relative" as const,
        margin: "0 auto",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: `linear-gradient(135deg,${DS.gradStart} 0%,${DS.primary} 40%,${DS.gradEnd} 100%)`,
          backgroundSize: "200% 200%",
          animation: "sg-gradientShift 8s ease infinite",
          padding: R.headerPad,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: R.isMobile ? 6 : 10,
          }}
        >
          <div
            style={{
              width: R.isMobile ? 26 : 32,
              height: R.isMobile ? 26 : 32,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: R.isMobile ? 13 : 16,
              flexShrink: 0,
            }}
          >
            ⚖️
          </div>
          <div>
            <div
              style={{
                fontSize: R.headerTitleFs,
                fontWeight: 700,
                color: DS.white,
                fontFamily: DS.font,
                letterSpacing: 0.3,
              }}
            >
              Hanging Scale Puzzles
            </div>
            <div
              style={{
                fontSize: R.headerSubFs,
                color: "rgba(255,255,255,.65)",
                fontFamily: DS.font,
                fontWeight: 500,
              }}
            >
              {R.isMobile
                ? "Ch 7 · Unknown Weights"
                : "Finding Unknown Weights · Ch 7"}
            </div>
          </div>
        </div>
        {phase !== "categorize" && (
          <button
            onClick={handleReset}
            onMouseEnter={() => setHoveredBtn("hdr-r")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              height: R.isMobile ? 24 : 28,
              padding: R.isMobile ? "0 8px" : "0 14px",
              borderRadius: DS.radiusPill,
              border: "1.5px solid rgba(255,255,255,.3)",
              background:
                hoveredBtn === "hdr-r"
                  ? "rgba(255,255,255,.15)"
                  : "rgba(255,255,255,.08)",
              color: "rgba(255,255,255,.85)",
              fontFamily: DS.font,
              fontWeight: 600,
              fontSize: R.isMobile ? 9 : 10,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 3,
              transition: "all .2s ease",
              outline: "none",
            }}
          >
            <RotateCcw size={R.isMobile ? 9 : 11} /> Reset
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column" as const,
        }}
      >
        {phase === "categorize" && renderCategorize()}
        {phase === "solve" && renderSolve()}
        {phase === "complete" && renderComplete()}
      </div>

      {/* FOOTER ACCENT */}
      <div
        style={{
          height: 3,
          background: `linear-gradient(90deg,${DS.primary},${DS.accent},${DS.gradEnd})`,
          flexShrink: 0,
        }}
      />
    </div>
  );
};

export default HangingScaleTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
