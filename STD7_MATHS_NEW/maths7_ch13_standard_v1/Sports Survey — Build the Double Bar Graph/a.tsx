// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: sports_survey_double_bar_graph.tsx
// Redesigned with Singularity Design System — Lucide-free (inline SVG icons)
// ═══════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  // @ts-expect-error React types resolved by project/bundler
} from "react";

// ==================== INLINE SVG ICON COMPONENTS ====================
// Replacing lucide-react to avoid ReferenceError in environments where
// lucide-react is not bundled or available at runtime.

interface IconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

const IconCheck: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  style,
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
    style={style}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconX: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  style,
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
    style={style}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconBarChart3: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  style,
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
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

const IconRotateCcw: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  style,
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
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const IconSparkles: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  style,
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
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

const IconEye: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  style,
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
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconUsers: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  style,
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
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "real_world" | "hands_on";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface SportData {
  name: string;
  watching: number;
  participating: number;
  emoji: string;
}

interface BarState {
  sportIndex: number;
  type: "watching" | "participating";
  value: number;
  correct: boolean;
  submitted: boolean;
  animating: boolean;
}

interface SportsGraphAdditionalProps {
  sports?: SportData[];
  scaleOptions?: number[];
  defaultScale?: number;
  watchingColor?: string;
  participatingColor?: string;
  showInsightsAfter?: boolean;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface SportsGraphProps {
  props?: {
    width?: number;
    height?: number;
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
    additionalProps?: SportsGraphAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DESIGN SYSTEM TOKENS (Singularity PDF) ====================

const DS = {
  colors: {
    primary: "#4A4DC9",
    accent: "#FF7212",
    gradientStart: "#533086",
    gradientEnd: "#FC9145",
    tintPurple: "#C1C1EA",
    tintPeach: "#FFF3E4",
    neutral900: "#4E4E4E",
    neutral400: "#CACACA",
    neutral200: "#EBEBEB",
    neutral100: "#F5F5F5",
    white: "#FFFFFF",
    success: "#22C55E",
    error: "#EF4444",
    deepPurple: "#533086",
  },
  font: '"Poppins", sans-serif',
  radius: {
    sm: "8px",
    md: "12px",
    lg: "20px",
    xl: "28px",
    pill: "40px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "40px",
  },
  shadow: {
    sm: "0 2px 8px rgba(74, 77, 201, 0.08)",
    md: "0 4px 20px rgba(74, 77, 201, 0.12)",
    lg: "0 12px 40px rgba(74, 77, 201, 0.18)",
    accent: "0 4px 20px rgba(255, 114, 18, 0.25)",
  },
  button: {
    height: "40px",
    paddingX: "24px",
    paddingY: "8px",
  },
};

// ==================== ANIMATION HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

// ==================== DEFAULT DATA ====================

const DEFAULT_SPORTS: SportData[] = [
  { name: "Cricket", watching: 1240, participating: 620, emoji: "🏏" },
  { name: "Basketball", watching: 470, participating: 320, emoji: "🏀" },
  { name: "Swimming", watching: 510, participating: 320, emoji: "🏊" },
  { name: "Hockey", watching: 430, participating: 250, emoji: "🏑" },
  { name: "Athletics", watching: 250, participating: 105, emoji: "🏃" },
];

const DEFAULT_SCALE_OPTIONS = [100, 200, 250];

// ==================== INSIGHT ICON TYPE ====================

type InsightIconType = "eye" | "barchart" | "users" | "sparkles";

const InsightIcon: React.FC<{
  type: InsightIconType;
  size: number;
  color: string;
}> = ({ type, size, color }) => {
  switch (type) {
    case "eye":
      return <IconEye size={size} color={color} />;
    case "barchart":
      return <IconBarChart3 size={size} color={color} />;
    case "users":
      return <IconUsers size={size} color={color} />;
    case "sparkles":
      return <IconSparkles size={size} color={color} />;
    default:
      return null;
  }
};

// ==================== MAIN COMPONENT ====================

const SportsGraphTool: React.FC<SportsGraphProps> = ({
  props = {} as NonNullable<SportsGraphProps["props"]>,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 700,
      themeColor: props.themeColor ?? DS.colors.primary,
      darkMode: props.darkMode ?? false,
      animationSpeed: props.animationSpeed ?? 1,
    }),
    [props],
  );

  const additionalProps = props.additionalProps || {};
  const sports = additionalProps.sports || DEFAULT_SPORTS;
  const scaleOptions = additionalProps.scaleOptions || DEFAULT_SCALE_OPTIONS;
  const watchingColor = additionalProps.watchingColor || DS.colors.primary;
  const participatingColor =
    additionalProps.participatingColor || DS.colors.accent;
  const graphTitle =
    additionalProps.title || "Sports Survey: Watching vs Participating";
  const yAxisLabel = additionalProps.yAxisLabel || "Number of People";

  // ─── STATE ───
  const [phase, setPhase] = useState<"scale" | "build" | "insights">("scale");
  const [selectedScale, setSelectedScale] = useState<number | null>(null);
  const [barStates, setBarStates] = useState<BarState[]>([]);
  const [currentBarIndex, setCurrentBarIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [showFeedback, setShowFeedback] = useState<
    "correct" | "incorrect" | null
  >(null);
  const [completedBars, setCompletedBars] = useState(0);
  const [barAnimations, setBarAnimations] = useState<{ [key: string]: number }>(
    {},
  );
  const [mounted, setMounted] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<
    Array<{ x: number; y: number; color: string; id: number }>
  >([]);
  const [shakeInput, setShakeInput] = useState(false);
  const [hoveredScale, setHoveredScale] = useState<number | null>(null);
  const [pulseBar, setPulseBar] = useState<string | null>(null);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ─── INJECT KEYFRAMES + FONT ───
  useEffect(() => {
    const keyframes = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
            
            @keyframes singFadeInUp {
                from { opacity: 0; transform: translateY(24px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes singFadeInDown {
                from { opacity: 0; transform: translateY(-16px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes singFadeInLeft {
                from { opacity: 0; transform: translateX(-24px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes singFadeInRight {
                from { opacity: 0; transform: translateX(24px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes singPopIn {
                0% { transform: scale(0); opacity: 0; }
                60% { transform: scale(1.12); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes singPulse {
                0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(74, 77, 201, 0.3); }
                50% { transform: scale(1.03); box-shadow: 0 0 0 8px rgba(74, 77, 201, 0); }
            }
            @keyframes singBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-6px); }
            }
            @keyframes singSlidePanel {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes singConfetti {
                0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
                100% { transform: translateY(280px) rotate(540deg) scale(0.3); opacity: 0; }
            }
            @keyframes singCheckDraw {
                0% { stroke-dashoffset: 50; }
                100% { stroke-dashoffset: 0; }
            }
            @keyframes singShake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-6px); }
                40% { transform: translateX(6px); }
                60% { transform: translateX(-4px); }
                80% { transform: translateX(4px); }
            }
            @keyframes singGlow {
                0%, 100% { box-shadow: 0 0 0 0 rgba(74, 77, 201, 0.2); }
                50% { box-shadow: 0 0 0 6px rgba(74, 77, 201, 0.08); }
            }
            @keyframes singFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-4px); }
            }
            @keyframes singGradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
    const styleSheet = document.createElement("style");
    styleSheet.id = "singularity-sports-keyframes";
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    return () => {
      const el = document.getElementById("singularity-sports-keyframes");
      if (el) document.head.removeChild(el);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ─── INITIALIZE BAR STATES ───
  useEffect(() => {
    if (selectedScale) {
      const states: BarState[] = [];
      sports.forEach((_, i) => {
        states.push({
          sportIndex: i,
          type: "watching",
          value: 0,
          correct: false,
          submitted: false,
          animating: false,
        });
        states.push({
          sportIndex: i,
          type: "participating",
          value: 0,
          correct: false,
          submitted: false,
          animating: false,
        });
      });
      setBarStates(states);
      setCurrentBarIndex(0);
      setCompletedBars(0);
      setInputValue("");
    }
  }, [selectedScale, sports]);

  useEffect(() => {
    if (phase === "build" && inputRef.current) inputRef.current.focus();
  }, [currentBarIndex, phase]);

  // ─── COMPUTED ───
  const maxValue = useMemo(
    () => Math.max(...sports.map((s) => Math.max(s.watching, s.participating))),
    [sports],
  );
  const gridLines = useMemo(() => {
    if (!selectedScale) return [];
    const lines: number[] = [];
    for (
      let v = 0;
      v <= Math.ceil(maxValue / selectedScale) * selectedScale;
      v += selectedScale
    )
      lines.push(v);
    return lines;
  }, [selectedScale, maxValue]);
  const maxGridValue = useMemo(
    () => (gridLines.length > 0 ? gridLines[gridLines.length - 1] : 1400),
    [gridLines],
  );

  const currentBar = barStates[currentBarIndex];
  const currentSport = currentBar ? sports[currentBar.sportIndex] : null;
  const currentExpected =
    currentBar && currentSport
      ? currentBar.type === "watching"
        ? currentSport.watching
        : currentSport.participating
      : 0;
  const totalBars = sports.length * 2;
  const allCorrect = barStates.length > 0 && barStates.every((b) => b.correct);

  // ─── INSIGHTS ───
  const insights = useMemo(() => {
    const gaps = sports.map((s) => ({
      name: s.name,
      gap: s.watching - s.participating,
      emoji: s.emoji,
    }));
    const biggestGap = gaps.reduce((a, b) => (a.gap > b.gap ? a : b));
    const smallestGap = gaps.reduce((a, b) => (a.gap < b.gap ? a : b));
    const biggestWatching = sports.reduce((a, b) =>
      a.watching > b.watching ? a : b,
    );
    return [
      {
        iconType: "eye" as InsightIconType,
        title: "Most Watched Sport",
        text: `${biggestWatching.emoji} ${biggestWatching.name} leads with ${biggestWatching.watching} watchers!`,
        color: DS.colors.primary,
        bg: DS.colors.tintPurple,
      },
      {
        iconType: "barchart" as InsightIconType,
        title: "Biggest Gap",
        text: `${biggestGap.emoji} ${biggestGap.name} — gap of ${biggestGap.gap} between watching & participating`,
        color: DS.colors.accent,
        bg: DS.colors.tintPeach,
      },
      {
        iconType: "users" as InsightIconType,
        title: "Smallest Gap",
        text: `${smallestGap.emoji} ${smallestGap.name} — only ${smallestGap.gap} gap. Watchers tend to play too!`,
        color: DS.colors.success,
        bg: "#DCFCE7",
      },
      {
        iconType: "sparkles" as InsightIconType,
        title: "Pattern",
        text: `Watching > Participating for every sport. It's easier to watch than play!`,
        color: DS.colors.deepPurple,
        bg: `${DS.colors.tintPurple}60`,
      },
    ];
  }, [sports]);

  // ─── HANDLERS ───
  const handleScaleSelect = (scale: number) => {
    setSelectedScale(scale);
    setTimeout(() => setPhase("build"), 350);
  };

  const triggerConfetti = useCallback(() => {
    const particles = Array.from({ length: 24 }, (_, i) => ({
      x: Math.random() * 100,
      y: -10,
      color: [
        DS.colors.primary,
        DS.colors.accent,
        DS.colors.tintPurple,
        DS.colors.success,
        DS.colors.deepPurple,
        "#FFD700",
      ][Math.floor(Math.random() * 6)],
      id: Date.now() + i,
    }));
    setConfettiParticles(particles);
    setTimeout(() => setConfettiParticles([]), 2800);
  }, []);

  const handleSubmitBar = () => {
    const val = parseInt(inputValue);
    if (isNaN(val) || val < 0) return;
    const isCorrect = val === currentExpected;
    const key = `${currentBar.sportIndex}-${currentBar.type}`;

    setBarStates((prev) =>
      prev.map((b, i) =>
        i === currentBarIndex
          ? {
              ...b,
              value: val,
              correct: isCorrect,
              submitted: true,
              animating: true,
            }
          : b,
      ),
    );

    const targetHeight = val / maxGridValue;
    let startTime: number | null = null;
    const animateBar = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 550, 1);
      setBarAnimations((prev) => ({
        ...prev,
        [key]: easeOutCubic(progress) * targetHeight,
      }));
      if (progress < 1) requestAnimationFrame(animateBar);
    };
    requestAnimationFrame(animateBar);

    if (isCorrect) {
      setShowFeedback("correct");
      setCompletedBars((prev) => prev + 1);
      setPulseBar(key);
      setTimeout(() => setPulseBar(null), 700);
      if (currentBarIndex === totalBars - 1) {
        triggerConfetti();
        setTimeout(() => {
          setPhase("insights");
        }, 1400);
      } else {
        setTimeout(() => {
          setShowFeedback(null);
          setCurrentBarIndex((prev) => prev + 1);
          setInputValue("");
        }, 850);
      }
    } else {
      setShowFeedback("incorrect");
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);
      setTimeout(() => {
        const correctKey = `${currentBar.sportIndex}-${currentBar.type}`;
        const correctHeight = currentExpected / maxGridValue;
        let st: number | null = null;
        const animCorrect = (ts: number) => {
          if (!st) st = ts;
          const p = Math.min((ts - st) / 550, 1);
          setBarAnimations((prev) => ({
            ...prev,
            [correctKey]: easeOutCubic(p) * correctHeight,
          }));
          if (p < 1) requestAnimationFrame(animCorrect);
        };
        requestAnimationFrame(animCorrect);
        setBarStates((prev) =>
          prev.map((b, i) =>
            i === currentBarIndex
              ? { ...b, value: currentExpected, correct: true, submitted: true }
              : b,
          ),
        );
        setCompletedBars((prev) => prev + 1);
        if (currentBarIndex === totalBars - 1) {
          triggerConfetti();
          setTimeout(() => {
            setPhase("insights");
          }, 1400);
        } else {
          setTimeout(() => {
            setShowFeedback(null);
            setCurrentBarIndex((prev) => prev + 1);
            setInputValue("");
          }, 1100);
        }
      }, 950);
    }
  };

  const handleReset = () => {
    setPhase("scale");
    setSelectedScale(null);
    setBarStates([]);
    setCurrentBarIndex(0);
    setInputValue("");
    setShowFeedback(null);
    setCompletedBars(0);
    setBarAnimations({});
    setConfettiParticles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue) handleSubmitBar();
  };

  // ─── DS BUTTON HELPER ───
  const dsBtn = (
    id: string,
    variant: "contained" | "outlined" | "highlight",
    disabled = false,
  ): React.CSSProperties => {
    const isHover = hoveredBtn === id && !disabled;
    const isPressed = pressedBtn === id && !disabled;
    const base: React.CSSProperties = {
      height: DS.button.height,
      padding: `0 ${DS.button.paddingX}`,
      borderRadius: DS.radius.pill,
      fontFamily: DS.font,
      fontWeight: 600,
      fontSize: "14px",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      border: "none",
      outline: "none",
      letterSpacing: "0.2px",
      transform: isPressed
        ? "scale(0.96)"
        : isHover
          ? "scale(1.03)"
          : "scale(1)",
    };
    if (variant === "contained")
      return {
        ...base,
        background: disabled
          ? DS.colors.neutral200
          : isHover
            ? `linear-gradient(135deg, ${DS.colors.deepPurple}, ${DS.colors.primary})`
            : DS.colors.primary,
        color: disabled ? DS.colors.neutral400 : DS.colors.white,
        boxShadow: disabled ? "none" : isHover ? DS.shadow.lg : DS.shadow.md,
      };
    if (variant === "outlined")
      return {
        ...base,
        background: isHover ? `${DS.colors.primary}08` : "transparent",
        color: disabled ? DS.colors.neutral400 : DS.colors.primary,
        border: `2px solid ${disabled ? DS.colors.neutral200 : DS.colors.primary}`,
        boxShadow: isHover ? DS.shadow.sm : "none",
      };
    return {
      ...base,
      background: disabled
        ? DS.colors.neutral200
        : isHover
          ? `linear-gradient(135deg, ${DS.colors.accent}, ${DS.colors.gradientEnd})`
          : DS.colors.accent,
      color: DS.colors.white,
      boxShadow: disabled
        ? "none"
        : isHover
          ? DS.shadow.accent
          : "0 2px 12px rgba(255, 114, 18, 0.2)",
    };
  };

  // ─── RENDER: SCALE PHASE ───
  const renderScalePhase = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: `${DS.spacing.xxl} ${DS.spacing.lg}`,
        minHeight: "400px",
        animation: "singFadeInUp 0.5s ease-out",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "80px",
          height: "80px",
          marginBottom: DS.spacing.lg,
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          style={{ animation: "singFloat 3s ease-in-out infinite" }}
        >
          <circle
            cx="40"
            cy="40"
            r="30"
            fill="none"
            stroke={DS.colors.tintPurple}
            strokeWidth="3"
          />
          <circle
            cx="40"
            cy="40"
            r="18"
            fill={DS.colors.tintPurple}
            opacity="0.4"
          />
          <rect
            x="52"
            y="8"
            width="20"
            height="20"
            rx="3"
            fill="none"
            stroke={DS.colors.accent}
            strokeWidth="2"
            opacity="0.6"
            style={{ animation: "singBounce 2.5s ease-in-out infinite 0.3s" }}
          />
          <polygon
            points="12,12 22,0 32,12"
            fill="none"
            stroke={DS.colors.primary}
            strokeWidth="2"
            opacity="0.5"
          />
        </svg>
      </div>
      <h2
        style={{
          fontFamily: DS.font,
          fontSize: "26px",
          fontWeight: 700,
          color: DS.colors.deepPurple,
          marginBottom: "6px",
          textAlign: "center",
        }}
      >
        Choose Your Y-Axis Scale
      </h2>
      <p
        style={{
          fontFamily: DS.font,
          fontSize: "14px",
          color: DS.colors.neutral900,
          marginBottom: DS.spacing.xl,
          textAlign: "center",
          maxWidth: "440px",
          lineHeight: 1.7,
          fontWeight: 400,
        }}
      >
        The highest data value is{" "}
        <span style={{ fontWeight: 700, color: DS.colors.accent }}>
          {maxValue}
        </span>
        . Choose a scale that fits neatly on the graph.
      </p>
      <div
        style={{
          display: "flex",
          gap: DS.spacing.md,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {scaleOptions.map((scale, i) => {
          const numLines = Math.ceil(maxValue / scale);
          const isRec = scale === 200;
          const isHov = hoveredScale === scale;
          return (
            <button
              key={scale}
              onClick={() => handleScaleSelect(scale)}
              onMouseEnter={() => setHoveredScale(scale)}
              onMouseLeave={() => setHoveredScale(null)}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "28px 36px",
                borderRadius: DS.radius.lg,
                border: `2.5px solid ${isHov ? DS.colors.primary : DS.colors.neutral200}`,
                background: isHov
                  ? `linear-gradient(135deg, ${DS.colors.tintPurple}30, ${DS.colors.tintPeach}40)`
                  : DS.colors.white,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isHov ? "translateY(-3px)" : "none",
                boxShadow: isHov ? DS.shadow.lg : DS.shadow.sm,
                animation: `singFadeInUp 0.45s ease-out ${i * 0.12}s both`,
                fontFamily: DS.font,
                outline: "none",
              }}
            >
              {isRec && (
                <div
                  style={{
                    position: "absolute",
                    top: "-11px",
                    right: "-6px",
                    background: `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`,
                    color: DS.colors.white,
                    padding: "3px 12px",
                    borderRadius: DS.radius.pill,
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    animation: "singPulse 2.5s ease-in-out infinite",
                    fontFamily: DS.font,
                  }}
                >
                  ★ BEST FIT
                </div>
              )}
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: DS.colors.primary,
                  fontFamily: DS.font,
                }}
              >
                1 : {scale}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: DS.colors.neutral900,
                  marginTop: "6px",
                  fontWeight: 500,
                  fontFamily: DS.font,
                }}
              >
                {numLines} gridlines
              </span>
              {isRec && (
                <div
                  style={{
                    marginTop: "8px",
                    width: "32px",
                    height: "3px",
                    borderRadius: "3px",
                    background: `linear-gradient(90deg, ${DS.colors.primary}, ${DS.colors.accent})`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  // ─── RENDER: GRAPH SVG ───
  const renderGraph = () => {
    const gL = 68,
      gR = 24,
      gT = 16,
      gB = 76;
    const gW = config.width - gL - gR;
    const gH = 300;
    const bGW = gW / sports.length;
    const bW = bGW * 0.26;
    const bGap = bGW * 0.08;

    return (
      <div style={{ position: "relative", width: "100%", overflowX: "auto" }}>
        <svg
          width={config.width}
          height={gH + gT + gB}
          style={{ display: "block", margin: "0 auto", fontFamily: DS.font }}
        >
          <text
            x={12}
            y={(gH + gT) / 2}
            textAnchor="middle"
            transform={`rotate(-90, 12, ${(gH + gT) / 2})`}
            style={{
              fontSize: "11px",
              fill: DS.colors.neutral900,
              fontWeight: 500,
              fontFamily: DS.font,
            }}
          >
            {yAxisLabel}
          </text>
          {gridLines.map((val, i) => {
            const y = gT + gH - (val / maxGridValue) * gH;
            return (
              <g
                key={val}
                style={{
                  animation: `singFadeInLeft 0.35s ease-out ${i * 0.04}s both`,
                }}
              >
                <line
                  x1={gL}
                  y1={y}
                  x2={gL + gW}
                  y2={y}
                  stroke={
                    val === 0 ? DS.colors.neutral900 : DS.colors.neutral200
                  }
                  strokeWidth={val === 0 ? 2 : 1}
                  strokeDasharray={val === 0 ? "none" : "6,4"}
                />
                <text
                  x={gL - 8}
                  y={y + 4}
                  textAnchor="end"
                  style={{
                    fontSize: "11px",
                    fill: DS.colors.neutral900,
                    fontWeight: 600,
                    fontFamily: DS.font,
                  }}
                >
                  {val}
                </text>
              </g>
            );
          })}
          <line
            x1={gL}
            y1={gT + gH}
            x2={gL + gW}
            y2={gT + gH}
            stroke={DS.colors.neutral900}
            strokeWidth={2}
          />
          <line
            x1={gL}
            y1={gT}
            x2={gL}
            y2={gT + gH}
            stroke={DS.colors.neutral900}
            strokeWidth={2}
          />
          {sports.map((sport, si) => {
            const gX = gL + si * bGW + bGW * 0.2;
            const wK = `${si}-watching`,
              pK = `${si}-participating`;
            const wH = (barAnimations[wK] || 0) * gH,
              pH = (barAnimations[pK] || 0) * gH;
            const wB = barStates.find(
              (b) => b.sportIndex === si && b.type === "watching",
            );
            const pB = barStates.find(
              (b) => b.sportIndex === si && b.type === "participating",
            );
            const iCW =
              currentBar?.sportIndex === si &&
              currentBar?.type === "watching" &&
              !currentBar?.submitted;
            const iCP =
              currentBar?.sportIndex === si &&
              currentBar?.type === "participating" &&
              !currentBar?.submitted;
            return (
              <g
                key={si}
                style={{
                  animation: `singFadeInUp 0.4s ease-out ${si * 0.08}s both`,
                }}
              >
                {(iCW || iCP) && (
                  <rect
                    x={gX - 6}
                    y={gT}
                    width={bW * 2 + bGap + 12}
                    height={gH}
                    rx={8}
                    fill={`${DS.colors.primary}06`}
                    stroke={DS.colors.tintPurple}
                    strokeWidth={1.5}
                    strokeDasharray="8,5"
                    style={{ animation: "singGlow 2s ease-in-out infinite" }}
                  />
                )}
                {/* Watching bar */}
                <rect
                  x={gX}
                  y={gT + gH - wH}
                  width={bW}
                  height={wH}
                  rx={5}
                  ry={5}
                  fill={
                    wB?.submitted
                      ? wB.correct
                        ? watchingColor
                        : DS.colors.error
                      : iCW
                        ? `${watchingColor}30`
                        : `${watchingColor}10`
                  }
                  stroke={iCW ? watchingColor : "none"}
                  strokeWidth={iCW ? 2 : 0}
                  strokeDasharray={iCW ? "5,4" : "none"}
                  style={{
                    transition: "fill 0.3s ease",
                    filter:
                      pulseBar === wK
                        ? `drop-shadow(0 0 10px ${watchingColor}80)`
                        : "none",
                  }}
                />
                {wB?.submitted && wH > 14 && (
                  <text
                    x={gX + bW / 2}
                    y={gT + gH - wH - 8}
                    textAnchor="middle"
                    style={{
                      fontSize: "10px",
                      fill: watchingColor,
                      fontWeight: 700,
                      fontFamily: DS.font,
                      animation: "singPopIn 0.35s ease-out",
                    }}
                  >
                    {wB.value}
                  </text>
                )}
                {wB?.submitted && wB.correct && (
                  <g
                    transform={`translate(${gX + bW / 2 - 7}, ${gT + gH - wH - 26})`}
                  >
                    <circle
                      cx={7}
                      cy={7}
                      r={8}
                      fill={DS.colors.success}
                      style={{ animation: "singPopIn 0.3s ease-out" }}
                    />
                    <polyline
                      points="4,7 6.5,9.5 10,4"
                      fill="none"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: 50,
                        animation: "singCheckDraw 0.4s ease-out 0.15s both",
                      }}
                    />
                  </g>
                )}
                {/* Participating bar */}
                <rect
                  x={gX + bW + bGap}
                  y={gT + gH - pH}
                  width={bW}
                  height={pH}
                  rx={5}
                  ry={5}
                  fill={
                    pB?.submitted
                      ? pB.correct
                        ? participatingColor
                        : DS.colors.error
                      : iCP
                        ? `${participatingColor}30`
                        : `${participatingColor}10`
                  }
                  stroke={iCP ? participatingColor : "none"}
                  strokeWidth={iCP ? 2 : 0}
                  strokeDasharray={iCP ? "5,4" : "none"}
                  style={{
                    transition: "fill 0.3s ease",
                    filter:
                      pulseBar === pK
                        ? `drop-shadow(0 0 10px ${participatingColor}80)`
                        : "none",
                  }}
                />
                {pB?.submitted && pH > 14 && (
                  <text
                    x={gX + bW + bGap + bW / 2}
                    y={gT + gH - pH - 8}
                    textAnchor="middle"
                    style={{
                      fontSize: "10px",
                      fill: participatingColor,
                      fontWeight: 700,
                      fontFamily: DS.font,
                      animation: "singPopIn 0.35s ease-out",
                    }}
                  >
                    {pB.value}
                  </text>
                )}
                {pB?.submitted && pB.correct && (
                  <g
                    transform={`translate(${gX + bW + bGap + bW / 2 - 7}, ${gT + gH - pH - 26})`}
                  >
                    <circle
                      cx={7}
                      cy={7}
                      r={8}
                      fill={DS.colors.success}
                      style={{ animation: "singPopIn 0.3s ease-out" }}
                    />
                    <polyline
                      points="4,7 6.5,9.5 10,4"
                      fill="none"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: 50,
                        animation: "singCheckDraw 0.4s ease-out 0.15s both",
                      }}
                    />
                  </g>
                )}
                {/* Labels */}
                <text
                  x={gX + bW + bGap / 2}
                  y={gT + gH + 22}
                  textAnchor="middle"
                  style={{ fontSize: "16px" }}
                >
                  {sport.emoji}
                </text>
                <text
                  x={gX + bW + bGap / 2}
                  y={gT + gH + 40}
                  textAnchor="middle"
                  style={{
                    fontSize: "10px",
                    fill: DS.colors.neutral900,
                    fontWeight: 600,
                    fontFamily: DS.font,
                  }}
                >
                  {sport.name}
                </text>
              </g>
            );
          })}
        </svg>
        {/* Legend */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: DS.spacing.lg,
            marginTop: "2px",
            animation: "singFadeInUp 0.4s ease-out 0.25s both",
          }}
        >
          {[
            { color: watchingColor, label: "Watching" },
            { color: participatingColor, label: "Participating" },
          ].map((item) => (
            <div
              key={item.label}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <div
                style={{
                  width: "18px",
                  height: "12px",
                  borderRadius: "4px",
                  background: item.color,
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: DS.colors.neutral900,
                  fontFamily: DS.font,
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── RENDER: BUILD PHASE ───
  const renderBuildPhase = () => (
    <div
      style={{
        padding: `${DS.spacing.md} ${DS.spacing.lg}`,
        animation: "singFadeInUp 0.45s ease-out",
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: DS.spacing.sm,
          marginBottom: DS.spacing.md,
        }}
      >
        <div
          style={{
            flex: 1,
            height: "8px",
            borderRadius: "8px",
            background: DS.colors.neutral100,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(completedBars / totalBars) * 100}%`,
              height: "100%",
              borderRadius: "8px",
              background: `linear-gradient(90deg, ${DS.colors.primary}, ${DS.colors.accent})`,
              transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: DS.colors.primary,
            fontFamily: DS.font,
            whiteSpace: "nowrap",
          }}
        >
          {completedBars}/{totalBars}
        </span>
      </div>

      {renderGraph()}

      {/* Input card */}
      {currentBar && !allCorrect && (
        <div
          style={{
            marginTop: DS.spacing.md,
            padding: DS.spacing.lg,
            borderRadius: DS.radius.lg,
            background: DS.colors.white,
            border: `1.5px solid ${DS.colors.neutral200}`,
            boxShadow: DS.shadow.md,
            animation: "singSlidePanel 0.35s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: DS.spacing.sm,
              marginBottom: DS.spacing.md,
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background:
                  currentBar.type === "watching"
                    ? `linear-gradient(135deg, ${DS.colors.tintPurple}, ${DS.colors.primary}30)`
                    : `linear-gradient(135deg, ${DS.colors.tintPeach}, ${DS.colors.accent}30)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                animation: "singFloat 2.5s ease-in-out infinite",
              }}
            >
              {currentSport?.emoji}
            </div>
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: DS.colors.deepPurple,
                  fontFamily: DS.font,
                }}
              >
                {currentSport?.name}
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color:
                      currentBar.type === "watching"
                        ? watchingColor
                        : participatingColor,
                    background:
                      currentBar.type === "watching"
                        ? `${DS.colors.tintPurple}60`
                        : DS.colors.tintPeach,
                    padding: "2px 10px",
                    borderRadius: DS.radius.pill,
                  }}
                >
                  {currentBar.type === "watching"
                    ? "👁️ Watching"
                    : "🏃 Participating"}
                </span>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: DS.colors.neutral900,
                  fontFamily: DS.font,
                  fontWeight: 400,
                  marginTop: "2px",
                }}
              >
                Enter the number of people for the{" "}
                <strong
                  style={{
                    color:
                      currentBar.type === "watching"
                        ? watchingColor
                        : participatingColor,
                  }}
                >
                  {currentBar.type === "watching" ? "indigo" : "orange"}
                </strong>{" "}
                bar
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: DS.spacing.sm,
              alignItems: "center",
              animation: shakeInput ? "singShake 0.45s ease-in-out" : "none",
            }}
          >
            <input
              ref={inputRef}
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type value…"
              style={{
                flex: 1,
                height: DS.button.height,
                padding: `0 ${DS.spacing.md}`,
                borderRadius: DS.radius.md,
                border: `2px solid ${showFeedback === "incorrect" ? DS.colors.error : DS.colors.neutral200}`,
                fontSize: "16px",
                fontWeight: 600,
                fontFamily: DS.font,
                outline: "none",
                transition: "all 0.25s ease",
                background: DS.colors.white,
                color: DS.colors.deepPurple,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = DS.colors.primary;
                e.target.style.boxShadow = `0 0 0 3px ${DS.colors.tintPurple}50`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = DS.colors.neutral200;
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              onClick={handleSubmitBar}
              disabled={!inputValue}
              onMouseEnter={() => setHoveredBtn("submit")}
              onMouseLeave={() => {
                setHoveredBtn(null);
                setPressedBtn(null);
              }}
              onMouseDown={() => setPressedBtn("submit")}
              onMouseUp={() => setPressedBtn(null)}
              style={dsBtn("submit", "contained", !inputValue)}
            >
              <IconCheck size={16} color="white" /> Check
            </button>
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div
              style={{
                marginTop: DS.spacing.sm,
                padding: "10px 16px",
                borderRadius: DS.radius.md,
                background: showFeedback === "correct" ? "#F0FDF4" : "#FEF2F2",
                border: `1.5px solid ${showFeedback === "correct" ? "#BBF7D0" : "#FECACA"}`,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                animation: "singPopIn 0.35s ease-out",
                fontFamily: DS.font,
              }}
            >
              {showFeedback === "correct" ? (
                <>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: DS.colors.success,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconCheck size={14} color="white" />
                  </div>
                  <span
                    style={{
                      fontWeight: 600,
                      color: "#166534",
                      fontSize: "13px",
                    }}
                  >
                    Perfect! {currentExpected} is correct.
                  </span>
                </>
              ) : (
                <>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: DS.colors.error,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconX size={14} color="white" />
                  </div>
                  <span
                    style={{
                      fontWeight: 600,
                      color: "#991B1B",
                      fontSize: "13px",
                    }}
                  >
                    Not quite — the answer is <strong>{currentExpected}</strong>
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ─── RENDER: INSIGHTS ───
  const renderInsightsPhase = () => (
    <div
      style={{
        padding: `${DS.spacing.md} ${DS.spacing.lg}`,
        animation: "singFadeInUp 0.45s ease-out",
      }}
    >
      {renderGraph()}
      <div
        style={{
          marginTop: DS.spacing.lg,
          padding: DS.spacing.lg,
          borderRadius: DS.radius.lg,
          background: DS.colors.white,
          border: `1.5px solid ${DS.colors.neutral200}`,
          boxShadow: DS.shadow.md,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: DS.spacing.md,
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconSparkles size={18} color="white" />
          </div>
          <h3
            style={{
              fontFamily: DS.font,
              fontSize: "20px",
              fontWeight: 700,
              color: DS.colors.deepPurple,
              margin: 0,
            }}
          >
            Data Insights
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: DS.spacing.sm,
          }}
        >
          {insights.map((insight, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: DS.spacing.sm,
                padding: "14px 16px",
                borderRadius: DS.radius.md,
                background: DS.colors.neutral100,
                border: `1px solid ${DS.colors.neutral200}`,
                animation: `singSlidePanel 0.4s ease-out ${i * 0.12}s both`,
                transition: "all 0.2s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const d = e.currentTarget as HTMLDivElement;
                d.style.background = insight.bg;
                d.style.borderColor = `${insight.color}40`;
                d.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                const d = e.currentTarget as HTMLDivElement;
                d.style.background = DS.colors.neutral100;
                d.style.borderColor = DS.colors.neutral200;
                d.style.transform = "none";
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: `${insight.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InsightIcon
                  type={insight.iconType}
                  size={16}
                  color={insight.color}
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: insight.color,
                    fontFamily: DS.font,
                    marginBottom: "2px",
                  }}
                >
                  {insight.title}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: DS.colors.neutral900,
                    fontFamily: DS.font,
                    lineHeight: 1.55,
                    fontWeight: 400,
                  }}
                >
                  {insight.text}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Discussion prompt */}
        <div
          style={{
            marginTop: DS.spacing.md,
            padding: "14px 16px",
            borderRadius: DS.radius.md,
            background: `linear-gradient(135deg, ${DS.colors.tintPurple}25, ${DS.colors.tintPeach}30)`,
            border: `1.5px dashed ${DS.colors.primary}30`,
            animation: "singFadeInUp 0.4s ease-out 0.6s both",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: DS.colors.deepPurple,
              fontFamily: DS.font,
              marginBottom: "4px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ fontSize: "16px" }}>💬</span> Think & Discuss
          </div>
          <div
            style={{
              fontSize: "12px",
              color: DS.colors.neutral900,
              fontFamily: DS.font,
              lineHeight: 1.65,
              fontWeight: 400,
            }}
          >
            Why do more people watch Cricket than play it? Swimming has a modest
            gap of 190 — what could explain that? Which sport would you want to
            see grow in participation?
          </div>
        </div>
      </div>
      {/* Reset button */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: DS.spacing.lg,
        }}
      >
        <button
          onClick={handleReset}
          onMouseEnter={() => setHoveredBtn("reset")}
          onMouseLeave={() => {
            setHoveredBtn(null);
            setPressedBtn(null);
          }}
          onMouseDown={() => setPressedBtn("reset")}
          onMouseUp={() => setPressedBtn(null)}
          style={dsBtn("reset", "outlined")}
        >
          <IconRotateCcw size={15} color={DS.colors.primary} /> Try Again
        </button>
      </div>
    </div>
  );

  // ─── CONFETTI ───
  const renderConfetti = () => (
    <>
      {confettiParticles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "0",
            width: `${8 + Math.random() * 6}px`,
            height: `${8 + Math.random() * 6}px`,
            borderRadius: Math.random() > 0.5 ? "50%" : "3px",
            background: p.color,
            animation: `singConfetti ${1.5 + Math.random() * 0.8}s ease-in forwards`,
            animationDelay: `${Math.random() * 0.4}s`,
            zIndex: 50,
            pointerEvents: "none" as const,
          }}
        />
      ))}
    </>
  );

  // ─── DATA TABLE ───
  const renderDataTable = () => (
    <div
      style={{
        margin: `${DS.spacing.md} ${DS.spacing.lg} 0`,
        padding: "12px 16px",
        borderRadius: DS.radius.md,
        background: DS.colors.white,
        border: `1.5px solid ${DS.colors.neutral200}`,
        boxShadow: DS.shadow.sm,
        overflowX: "auto",
        animation: "singFadeInUp 0.35s ease-out 0.15s both",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: DS.font,
          fontSize: "12px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                padding: "6px 10px",
                textAlign: "left",
                fontWeight: 700,
                color: DS.colors.deepPurple,
                borderBottom: `2px solid ${DS.colors.neutral200}`,
                fontSize: "11px",
                textTransform: "uppercase" as const,
                letterSpacing: "0.5px",
              }}
            >
              Sport
            </th>
            {sports.map((s, i) => (
              <th
                key={i}
                style={{
                  padding: "6px 8px",
                  textAlign: "center" as const,
                  fontWeight: 700,
                  color: DS.colors.deepPurple,
                  borderBottom: `2px solid ${DS.colors.neutral200}`,
                  background:
                    currentBar?.sportIndex === i
                      ? `${DS.colors.tintPurple}30`
                      : "transparent",
                  transition: "background 0.2s ease",
                }}
              >
                {s.emoji} {s.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                padding: "8px 10px",
                fontWeight: 600,
                color: watchingColor,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "3px",
                    background: watchingColor,
                  }}
                />
                Watching
              </div>
            </td>
            {sports.map((s, i) => (
              <td
                key={i}
                style={{
                  padding: "8px",
                  textAlign: "center" as const,
                  fontWeight: 700,
                  color: DS.colors.neutral900,
                  background:
                    currentBar?.sportIndex === i &&
                    currentBar?.type === "watching"
                      ? `${watchingColor}12`
                      : "transparent",
                  transition: "background 0.2s ease",
                }}
              >
                {s.watching}
              </td>
            ))}
          </tr>
          <tr>
            <td
              style={{
                padding: "8px 10px",
                fontWeight: 600,
                color: participatingColor,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "3px",
                    background: participatingColor,
                  }}
                />
                Participating
              </div>
            </td>
            {sports.map((s, i) => (
              <td
                key={i}
                style={{
                  padding: "8px",
                  textAlign: "center" as const,
                  fontWeight: 700,
                  color: DS.colors.neutral900,
                  background:
                    currentBar?.sportIndex === i &&
                    currentBar?.type === "participating"
                      ? `${participatingColor}12`
                      : "transparent",
                  transition: "background 0.2s ease",
                }}
              >
                {s.participating}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  // ─── MAIN ───
  return (
    <div
      style={{
        width: "100%",
        maxWidth: `${config.width}px`,
        margin: "0 auto",
        background: DS.colors.neutral100,
        borderRadius: DS.radius.xl,
        overflow: "hidden",
        boxShadow: DS.shadow.lg,
        fontFamily: DS.font,
        position: "relative",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    >
      {renderConfetti()}
      {/* Header */}
      <div
        style={{
          padding: "22px 28px 18px",
          background: `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.primary} 40%, ${DS.colors.gradientEnd})`,
          backgroundSize: "200% 200%",
          animation: "singGradientShift 8s ease-in-out infinite",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            opacity: 0.08,
            width: "200px",
            height: "120px",
          }}
          viewBox="0 0 200 120"
        >
          <circle cx="160" cy="30" r="40" fill="white" />
          <rect x="100" y="60" width="35" height="35" rx="4" fill="white" />
          <polygon points="40,20 60,0 80,20" fill="white" />
          <ellipse cx="30" cy="80" rx="25" ry="15" fill="white" />
        </svg>
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
              borderRadius: DS.radius.md,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconBarChart3 size={22} color="white" />
          </div>
          <div>
            <h1
              style={{
                fontFamily: DS.font,
                fontSize: "20px",
                fontWeight: 700,
                color: DS.colors.white,
                margin: 0,
                letterSpacing: "0.3px",
                animation: "singFadeInUp 0.4s ease-out",
              }}
            >
              {graphTitle}
            </h1>
            <p
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.8)",
                margin: "3px 0 0",
                fontWeight: 500,
                animation: "singFadeInUp 0.4s ease-out 0.08s both",
                fontFamily: DS.font,
              }}
            >
              {phase === "scale" && "Step 1 — Select a scale for the Y-axis"}
              {phase === "build" &&
                `Step 2 — Setting bar heights (${completedBars}/${totalBars})`}
              {phase === "insights" &&
                "✨ Complete — Explore the data insights"}
            </p>
          </div>
        </div>
        {/* Phase dots */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginTop: "14px",
            position: "relative",
            zIndex: 1,
            alignItems: "center",
          }}
        >
          {(["scale", "build", "insights"] as const).map((p, i) => {
            const isA = phase === p,
              isD = ["scale", "build", "insights"].indexOf(phase) > i;
            return (
              <React.Fragment key={p}>
                <div
                  style={{
                    width: isA ? "28px" : "8px",
                    height: "8px",
                    borderRadius: "8px",
                    background:
                      isA || isD
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.25)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
                {i < 2 && (
                  <div
                    style={{
                      flex: 1,
                      height: "2px",
                      background: isD
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(255,255,255,0.12)",
                      transition: "background 0.4s ease",
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {phase !== "insights" && renderDataTable()}
      {phase === "scale" && renderScalePhase()}
      {phase === "build" && renderBuildPhase()}
      {phase === "insights" && renderInsightsPhase()}

      {/* Footer */}
      <div
        style={{
          padding: "10px 24px",
          background: DS.colors.white,
          borderTop: `1px solid ${DS.colors.neutral200}`,
          textAlign: "center",
          fontSize: "10px",
          color: DS.colors.neutral400,
          fontFamily: DS.font,
          fontWeight: 500,
          letterSpacing: "0.3px",
        }}
      >
        GANITA PRAKASH · GRADE 7 · CHAPTER 5 — CONNECTING THE DOTS
      </div>
    </div>
  );
};

export default SportsGraphTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
