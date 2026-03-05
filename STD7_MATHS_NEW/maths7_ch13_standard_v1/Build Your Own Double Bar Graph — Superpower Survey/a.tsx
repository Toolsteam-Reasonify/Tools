// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: double_bar_graph_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  // @ts-expect-error React types resolved by project/bundler
} from "react";

// ==================== INLINE SVG ICONS (no lucide-react dependency) ====================

const IconProps = {
  xmlns: "http://www.w3.org/2000/svg" as const,
  fill: "none" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Check: React.FC<{
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ size = 24, color = "currentColor", style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...IconProps}
    stroke={color}
    strokeWidth="2.5"
    style={style}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const BarChart3: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...IconProps}
    stroke={color}
    strokeWidth="2"
  >
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

const Star: React.FC<{ size?: number; color?: string; fill?: string }> = ({
  size = 24,
  color = "currentColor",
  fill = "none",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ArrowRight: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...IconProps}
    stroke={color}
    strokeWidth="2"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const Zap: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ChevronRight: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...IconProps}
    stroke={color}
    strokeWidth="2"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "real_world" | "hands_on";
type TabType = "superpower" | "temperature";
type StageType = "tally" | "scale" | "bars" | "complete";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface BarEntry {
  category: string;
  group1Value: number;
  group2Value: number;
  group1Input: number | null;
  group2Input: number | null;
  group1Correct: boolean;
  group2Correct: boolean;
}

interface TallyEntry {
  category: string;
  group1Tally: number | null;
  group2Tally: number | null;
  group1Correct: boolean;
  group2Correct: boolean;
  group1Expected: number;
  group2Expected: number;
}

interface DataSet {
  title: string;
  subtitle: string;
  group1Label: string;
  group2Label: string;
  xAxisLabel: string;
  yAxisLabel: string;
  categories: string[];
  group1Values: number[];
  group2Values: number[];
  scaleOptions: number[];
  correctScale: number[];
  rawDataGroup1?: string;
  rawDataGroup2?: string;
  hasTallyStage: boolean;
  insights: string[];
}

interface DoubleBarGraphToolProps {
  props?: {
    width?: number;
    height?: number;
    themeColor?: string;
    darkMode?: boolean;
    initialTab?: TabType;
    additionalProps?: {
      superpowerData?: DataSet;
      temperatureData?: DataSet;
    };
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

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

// ==================== SINGULARITY DESIGN SYSTEM PALETTE ====================
const DS = {
  // Primary
  indigo: "#4A4DC9",
  indigoHover: "#3B3EB5",
  indigoPressed: "#533086",
  indigoMuted: "#C1C1EA",
  indigoGhost: "#EEEEF8",
  // Accent
  orange: "#FF7212",
  orangeHover: "#FC9145",
  orangeMuted: "#FFF3E4",
  orangeDark: "#E5600A",
  // Gradient
  gradientPurpleOrange: "linear-gradient(135deg, #533086 0%, #FC9145 100%)",
  gradientIndigoOrange: "linear-gradient(135deg, #4A4DC9 0%, #FF7212 100%)",
  gradientSubtle: "linear-gradient(135deg, #C1C1EA 0%, #FFF3E4 100%)",
  // Neutrals
  black: "#1A1A1A",
  grey900: "#4E4E4E",
  grey600: "#7A7A7A",
  grey400: "#CACACA",
  grey200: "#EBEBEB",
  grey100: "#F5F5F5",
  white: "#FFFFFF",
  // Semantic
  success: "#2ECC71",
  successLight: "#E8FAF0",
  successDark: "#1EA35A",
  error: "#E74C3C",
  errorLight: "#FDE8E6",
  // Functional
  barGroup1: "#4A4DC9",
  barGroup2: "#FF7212",
  barGroup1Light: "#C1C1EA",
  barGroup2Light: "#FFF3E4",
};

// ==================== DEFAULT DATA ====================

const SUPERPOWER_DATA: DataSet = {
  title: "Superpower Survey",
  subtitle: "Grade 5 vs Grade 9 Preferences",
  group1Label: "Grade 5",
  group2Label: "Grade 9",
  xAxisLabel: "Superpower Choice",
  yAxisLabel: "Number of Students",
  categories: ["Water-borne", "Air-borne", "Space-borne", "None"],
  group1Values: [6, 13, 2, 4],
  group2Values: [6, 9, 8, 2],
  scaleOptions: [1, 2, 3, 5],
  correctScale: [2, 3],
  rawDataGroup1:
    "w, a, a, a, w, n, s, a, n, w, a, a, a, a, a, w, w, s, a, a, n, w, a, a, n",
  rawDataGroup2:
    "n, w, s, a, s, w, s, s, a, a, w, s, s, a, s, a, n, w, s, s, a, w, a, w, a",
  hasTallyStage: true,
  insights: [
    "Air-borne is the most popular choice in Grade 5 (13 students)!",
    "Space-borne gains popularity from Grade 5 (2) to Grade 9 (8).",
    "Water-borne stays equally popular across both grades (6 each).",
    'Fewer Grade 9 students chose "None" compared to Grade 5.',
    "Grade 9 preferences are more evenly spread across options.",
  ],
};

const TEMPERATURE_DATA: DataSet = {
  title: "Jodhpur Temperature",
  subtitle: "Two days across different months",
  group1Label: "Day 1 (Cool month)",
  group2Label: "Day 2 (Hot month)",
  xAxisLabel: "Time of Day",
  yAxisLabel: "Temperature (°C)",
  categories: [
    "12 am",
    "3 am",
    "6 am",
    "9 am",
    "12 pm",
    "3 pm",
    "6 pm",
    "9 pm",
  ],
  group1Values: [20, 18, 16, 20, 26, 34, 30, 24],
  group2Values: [37, 34, 30, 33, 37, 43, 42, 39],
  scaleOptions: [2, 4, 5, 8],
  correctScale: [4, 5],
  hasTallyStage: false,
  insights: [
    "Day 2 is consistently hotter — likely a summer month (May/June).",
    "Day 1 temperatures suggest a winter month (December/January).",
    "Both days peak at 3 PM: 34°C (Day 1) and 43°C (Day 2).",
    "The temperature difference is largest at 12 am (17°C gap).",
    "Early morning (6 am) is the coolest time on both days.",
    "Day 2's minimum (30°C) exceeds Day 1's average (~23.5°C)!",
  ],
};

// ==================== MAIN COMPONENT ====================

const DoubleBarGraphTool: React.FC<DoubleBarGraphToolProps> = ({
  props = {} as NonNullable<DoubleBarGraphToolProps["props"]>,
}) => {
  const additionalProps = props.additionalProps || {};
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<TabType>(
    props.initialTab || "superpower",
  );
  const [stage, setStage] = useState<StageType>("tally");
  const [selectedScale, setSelectedScale] = useState<number | null>(null);
  const [bars, setBars] = useState<BarEntry[]>([]);
  const [tallies, setTallies] = useState<TallyEntry[]>([]);
  const [showInsights, setShowInsights] = useState(false);
  const [score, setScore] = useState(0);
  const [totalChecks, setTotalChecks] = useState(0);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [celebrateId, setCelebrateId] = useState<string | null>(null);
  const [stageTransition, setStageTransition] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const currentData = useMemo(() => {
    if (activeTab === "superpower")
      return additionalProps.superpowerData || SUPERPOWER_DATA;
    return additionalProps.temperatureData || TEMPERATURE_DATA;
  }, [activeTab, additionalProps]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Inject keyframes + Poppins font
  useEffect(() => {
    const id = "singularity-dbg-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
      @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      @keyframes popIn { 0% { transform:scale(0); opacity:0; } 70% { transform:scale(1.08); } 100% { transform:scale(1); opacity:1; } }
      @keyframes slideInRight { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }
      @keyframes shake { 0%,100% { transform:translateX(0); } 20%,60% { transform:translateX(-5px); } 40%,80% { transform:translateX(5px); } }
      @keyframes celebrate { 0% { transform:scale(1); } 30% { transform:scale(1.15); } 60% { transform:scale(0.97); } 100% { transform:scale(1); } }
      @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.04); } }
      @keyframes growBar { from { height:0; } }
      @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
      @keyframes slideDown { from { opacity:0; max-height:0; } to { opacity:1; max-height:700px; } }
      @keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
      @keyframes floatShape { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-4px) rotate(2deg); } }
      @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
      * { box-sizing: border-box; }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(id);
      if (el) document.head.removeChild(el);
    };
  }, []);

  useEffect(() => {
    resetAll();
  }, [activeTab]);

  const resetAll = useCallback(() => {
    setStageTransition(true);
    setTimeout(() => {
      const d =
        activeTab === "superpower"
          ? additionalProps.superpowerData || SUPERPOWER_DATA
          : additionalProps.temperatureData || TEMPERATURE_DATA;

      if (d.hasTallyStage) {
        setStage("tally");
        setTallies(
          d.categories.map((cat, i) => ({
            category: cat,
            group1Tally: null,
            group2Tally: null,
            group1Correct: false,
            group2Correct: false,
            group1Expected: d.group1Values[i],
            group2Expected: d.group2Values[i],
          })),
        );
      } else {
        setStage("scale");
      }

      setSelectedScale(null);
      setBars(
        d.categories.map((cat, i) => ({
          category: cat,
          group1Value: d.group1Values[i],
          group2Value: d.group2Values[i],
          group1Input: null,
          group2Input: null,
          group1Correct: false,
          group2Correct: false,
        })),
      );
      setShowInsights(false);
      setScore(0);
      setTotalChecks(0);
      setStageTransition(false);
    }, 280);
  }, [activeTab, additionalProps]);

  // ===== TALLY =====
  const checkTally = useCallback((catIndex: number, group: 1 | 2) => {
    setTallies((prev) => {
      const copy = [...prev];
      const t = { ...copy[catIndex] };
      const val = group === 1 ? t.group1Tally : t.group2Tally;
      const expected = group === 1 ? t.group1Expected : t.group2Expected;
      const isCorrect = val === expected;
      if (group === 1) t.group1Correct = isCorrect;
      else t.group2Correct = isCorrect;
      copy[catIndex] = t;
      setTotalChecks((p) => p + 1);
      if (isCorrect) {
        setScore((p) => p + 1);
        setCelebrateId(`t-${catIndex}-${group}`);
        setTimeout(() => setCelebrateId(null), 600);
      } else {
        setShakeId(`t-${catIndex}-${group}`);
        setTimeout(() => setShakeId(null), 500);
      }
      return copy;
    });
  }, []);

  const allTalliesCorrect = useMemo(
    () => tallies.every((t) => t.group1Correct && t.group2Correct),
    [tallies],
  );

  const isScaleGood = useMemo(
    () =>
      selectedScale !== null &&
      currentData.correctScale.includes(selectedScale),
    [selectedScale, currentData],
  );

  // ===== BAR CHECK =====
  const checkBar = useCallback((catIndex: number, group: 1 | 2) => {
    setBars((prev) => {
      const copy = [...prev];
      const b = { ...copy[catIndex] };
      const val = group === 1 ? b.group1Input : b.group2Input;
      const expected = group === 1 ? b.group1Value : b.group2Value;
      const isCorrect = val === expected;
      if (group === 1) b.group1Correct = isCorrect;
      else b.group2Correct = isCorrect;
      copy[catIndex] = b;
      setTotalChecks((p) => p + 1);
      if (isCorrect) {
        setScore((p) => p + 1);
        setCelebrateId(`b-${catIndex}-${group}`);
        setTimeout(() => setCelebrateId(null), 600);
      } else {
        setShakeId(`b-${catIndex}-${group}`);
        setTimeout(() => setShakeId(null), 500);
      }
      return copy;
    });
  }, []);

  const allBarsCorrect = useMemo(
    () => bars.every((b) => b.group1Correct && b.group2Correct),
    [bars],
  );

  const maxValue = useMemo(
    () => Math.max(...currentData.group1Values, ...currentData.group2Values),
    [currentData],
  );
  const gridMax = useMemo(() => {
    if (!selectedScale) return maxValue + 5;
    return Math.ceil((maxValue + 2) / selectedScale) * selectedScale;
  }, [maxValue, selectedScale]);

  const advanceStage = useCallback(() => {
    setStageTransition(true);
    setTimeout(() => {
      if (stage === "tally") setStage("scale");
      else if (stage === "scale") setStage("bars");
      else if (stage === "bars") {
        setStage("complete");
        setShowInsights(true);
      }
      setStageTransition(false);
    }, 280);
  }, [stage]);

  // Chart dims
  const chartW = isMobile ? 350 : 620;
  const chartH = isMobile ? 280 : 340;
  const margin = { top: 30, right: 20, bottom: isMobile ? 64 : 50, left: 52 };
  const plotW = chartW - margin.left - margin.right;
  const plotH = chartH - margin.top - margin.bottom;

  const getValueFromY = useCallback(
    (clientY: number, svgEl: SVGSVGElement) => {
      const rect = svgEl.getBoundingClientRect();
      const svgY = clientY - rect.top;
      const plotBottom = margin.top + plotH;
      const plotTop = margin.top;
      const yInPlot = Math.max(plotTop, Math.min(plotBottom, svgY));
      const fraction = 1 - (yInPlot - plotTop) / plotH;
      const rawVal = fraction * gridMax;
      return selectedScale
        ? Math.round(rawVal / selectedScale) * selectedScale
        : Math.round(rawVal);
    },
    [margin, plotH, gridMax, selectedScale],
  );

  const handleBarDrag = useCallback(
    (
      e: React.MouseEvent | React.TouchEvent,
      catIndex: number,
      group: 1 | 2,
    ) => {
      if (stage !== "bars") return;
      const b = bars[catIndex];
      if ((group === 1 && b.group1Correct) || (group === 2 && b.group2Correct))
        return;
      const svgEl = svgRef.current;
      if (!svgEl) return;

      const getClientY = (ev: MouseEvent | TouchEvent) =>
        "touches" in ev
          ? (ev.touches[0]?.clientY ?? 0)
          : (ev as MouseEvent).clientY;

      const onMove = (ev: MouseEvent | TouchEvent) => {
        ev.preventDefault();
        const val = getValueFromY(getClientY(ev), svgEl);
        setBars((prev) => {
          const copy = [...prev];
          const item = { ...copy[catIndex] };
          if (group === 1)
            item.group1Input = Math.max(0, Math.min(gridMax, val));
          else item.group2Input = Math.max(0, Math.min(gridMax, val));
          copy[catIndex] = item;
          return copy;
        });
      };
      const onEnd = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onEnd);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onEnd);
      };
      document.addEventListener("mousemove", onMove, { passive: false });
      document.addEventListener("mouseup", onEnd);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onEnd);
    },
    [bars, stage, getValueFromY, gridMax],
  );

  // ==================== DESIGN SYSTEM BUTTON HELPERS ====================

  const ContainedBtn: React.FC<{
    label: string;
    onClick: () => void;
    disabled?: boolean;
    icon?: React.ReactNode;
    color?: "primary" | "accent" | "success";
    fullWidth?: boolean;
    size?: "sm" | "md";
  }> = ({
    label,
    onClick,
    disabled,
    icon,
    color = "primary",
    fullWidth,
    size = "md",
  }) => {
    const id = `btn-${label}`;
    const isHover = hoveredBtn === id;
    const isPress = pressedBtn === id;
    const bgMap = {
      primary: DS.indigo,
      accent: DS.orange,
      success: DS.success,
    };
    const hoverMap = {
      primary: DS.indigoHover,
      accent: DS.orangeHover,
      success: DS.successDark,
    };
    const pressMap = {
      primary: DS.indigoPressed,
      accent: DS.orangeDark,
      success: "#178F48",
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setHoveredBtn(id)}
        onMouseLeave={() => {
          setHoveredBtn(null);
          setPressedBtn(null);
        }}
        onMouseDown={() => setPressedBtn(id)}
        onMouseUp={() => setPressedBtn(null)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          padding: size === "sm" ? "8px 16px" : "10px 24px",
          height: size === "sm" ? "34px" : "40px",
          borderRadius: "24px",
          border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          fontSize: size === "sm" ? "12px" : "14px",
          color: disabled ? DS.grey400 : DS.white,
          background: disabled
            ? DS.grey200
            : isPress
              ? pressMap[color]
              : isHover
                ? hoverMap[color]
                : bgMap[color],
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isPress
            ? "scale(0.96)"
            : isHover
              ? "scale(1.02)"
              : "scale(1)",
          boxShadow: disabled
            ? "none"
            : isHover
              ? "0 4px 16px rgba(74,77,201,0.3)"
              : "0 2px 8px rgba(74,77,201,0.15)",
          width: fullWidth ? "100%" : "auto",
          letterSpacing: "0.3px",
        }}
      >
        {icon}
        {label}
      </button>
    );
  };

  const OutlinedBtn: React.FC<{
    label: string;
    onClick: () => void;
    active?: boolean;
    color?: string;
    fullWidth?: boolean;
  }> = ({ label, onClick, active, color = DS.indigo, fullWidth }) => {
    const id = `obtn-${label}`;
    const isHover = hoveredBtn === id;
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHoveredBtn(id)}
        onMouseLeave={() => setHoveredBtn(null)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 24px",
          height: "40px",
          borderRadius: "24px",
          border: `2px solid ${active ? color : isHover ? color : DS.grey400}`,
          cursor: "pointer",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          fontSize: "14px",
          color: active ? DS.white : color,
          background: active ? color : isHover ? `${color}10` : "transparent",
          transition: "all 0.25s ease",
          transform: isHover ? "scale(1.02)" : "scale(1)",
          width: fullWidth ? "100%" : "auto",
        }}
      >
        {label}
      </button>
    );
  };

  // ==================== RENDERERS ====================

  const renderHeader = () => (
    <div
      style={{
        background: DS.gradientPurpleOrange,
        padding: isMobile ? "16px 18px" : "20px 28px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: "12px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative geometric shapes */}
      <div
        style={{
          position: "absolute",
          top: "-10px",
          right: "40px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: `2px solid rgba(255,255,255,0.15)`,
          animation: "floatShape 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-8px",
          right: "120px",
          width: "30px",
          height: "30px",
          border: `2px solid rgba(255,255,255,0.12)`,
          transform: "rotate(45deg)",
          animation: "floatShape 8s ease-in-out infinite 1s",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "8px",
          right: "200px",
          width: 0,
          height: 0,
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderBottom: "20px solid rgba(255,255,255,0.1)",
          animation: "floatShape 7s ease-in-out infinite 0.5s",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BarChart3 size={22} color={DS.white} />
        </div>
        <div>
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: isMobile ? "17px" : "22px",
              color: DS.white,
              margin: 0,
              letterSpacing: "-0.3px",
            }}
          >
            Double Bar Graph Builder
          </h1>
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? "11px" : "12px",
              color: "rgba(255,255,255,0.8)",
              margin: 0,
              marginTop: "1px",
            }}
          >
            Ganita Prakash — Grade 7 · Chapter 5
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          zIndex: 1,
          background: "rgba(255,255,255,0.18)",
          borderRadius: "20px",
          padding: "6px 16px",
          backdropFilter: "blur(4px)",
        }}
      >
        <Star size={16} color="#FFD700" fill="#FFD700" />
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            color: DS.white,
            fontSize: "14px",
          }}
        >
          {score}/{totalChecks}
        </span>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div
      style={{
        display: "flex",
        gap: 0,
        background: DS.white,
        borderBottom: `1px solid ${DS.grey200}`,
      }}
    >
      {(["superpower", "temperature"] as TabType[]).map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: isMobile ? "12px 8px" : "14px 20px",
              background: isActive ? DS.white : DS.grey100,
              border: "none",
              borderBottom: isActive
                ? `3px solid ${DS.indigo}`
                : "3px solid transparent",
              cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: isActive ? 700 : 500,
              fontSize: isMobile ? "12px" : "14px",
              color: isActive ? DS.indigo : DS.grey600,
              transition: "all 0.3s ease",
              position: "relative",
            }}
          >
            {tab === "superpower"
              ? "🦸 Superpower Survey"
              : "🌡️ Jodhpur Temperature"}
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  bottom: "-1px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60%",
                  height: "3px",
                  background: DS.gradientIndigoOrange,
                  borderRadius: "2px 2px 0 0",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );

  const renderStageIndicator = () => {
    const stages: { key: StageType; label: string; num: number }[] =
      currentData.hasTallyStage
        ? [
            { key: "tally", label: "Tally", num: 1 },
            { key: "scale", label: "Scale", num: 2 },
            { key: "bars", label: "Build", num: 3 },
            { key: "complete", label: "Done", num: 4 },
          ]
        : [
            { key: "scale", label: "Scale", num: 1 },
            { key: "bars", label: "Build", num: 2 },
            { key: "complete", label: "Done", num: 3 },
          ];
    const currentIdx = stages.findIndex((s) => s.key === stage);

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? "2px" : "4px",
          padding: "16px 20px",
          background: DS.grey100,
        }}
      >
        {stages.map((s, i) => (
          <React.Fragment key={s.key}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: isMobile ? "5px 10px" : "6px 16px",
                borderRadius: "20px",
                background:
                  i < currentIdx
                    ? DS.indigo
                    : i === currentIdx
                      ? DS.gradientPurpleOrange
                      : DS.white,
                border: i <= currentIdx ? "none" : `2px solid ${DS.grey200}`,
                transition: "all 0.4s ease",
                boxShadow:
                  i === currentIdx ? "0 3px 12px rgba(83,48,134,0.25)" : "none",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background:
                    i <= currentIdx ? "rgba(255,255,255,0.25)" : DS.grey200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: "10px",
                  color: i <= currentIdx ? DS.white : DS.grey600,
                }}
              >
                {i < currentIdx ? <Check size={10} /> : s.num}
              </div>
              {!isMobile && (
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: "12px",
                    color: i <= currentIdx ? DS.white : DS.grey600,
                  }}
                >
                  {s.label}
                </span>
              )}
            </div>
            {i < stages.length - 1 && (
              <div
                style={{
                  width: isMobile ? "16px" : "28px",
                  height: "2px",
                  background: i < currentIdx ? DS.indigo : DS.grey200,
                  borderRadius: "1px",
                  transition: "all 0.4s ease",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderInstructions = () => {
    let text = "";
    if (stage === "tally")
      text =
        "Step 1: Count the responses! Tally each code (w = Water, a = Air, s = Space, n = None) for both grades.";
    else if (stage === "scale")
      text = `Step ${currentData.hasTallyStage ? "2" : "1"}: Choose an appropriate scale. The max value is ${maxValue}. Which scale fits best?`;
    else if (stage === "bars")
      text = `Step ${currentData.hasTallyStage ? "3" : "2"}: Set each bar height! Drag the handles or type values, then verify with ✓.`;
    else text = "Your graph is complete! Review the insights below.";

    return (
      <div
        style={{
          margin: "0 20px",
          padding: "12px 18px",
          background: DS.gradientSubtle,
          borderRadius: "14px",
          borderLeft: `4px solid ${DS.indigo}`,
          animation: "fadeInUp 0.4s ease",
        }}
      >
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: isMobile ? "12px" : "13px",
            color: DS.grey900,
            margin: 0,
            lineHeight: 1.6,
            fontWeight: 500,
          }}
        >
          {text}
        </p>
      </div>
    );
  };

  // ===== TALLY STAGE =====
  const renderTallyStage = () => {
    if (!currentData.hasTallyStage) return null;
    return (
      <div style={{ padding: "20px", animation: "fadeInUp 0.4s ease" }}>
        {/* Raw data cards */}
        {[
          {
            label: currentData.group1Label,
            raw: currentData.rawDataGroup1 || "",
            color: DS.barGroup1,
            bgColor: DS.barGroup1Light,
          },
          {
            label: currentData.group2Label,
            raw: currentData.rawDataGroup2 || "",
            color: DS.barGroup2,
            bgColor: DS.barGroup2Light,
          },
        ].map((g, gi) => (
          <div
            key={gi}
            style={{
              marginBottom: "12px",
              padding: "14px 16px",
              background: DS.white,
              borderRadius: "16px",
              border: `2px solid ${g.bgColor}`,
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                color: g.color,
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: g.color,
                }}
              />
              {g.label}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {g.raw.split(",").map((code, ci) => (
                <span
                  key={ci}
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "8px",
                    background: g.bgColor,
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: "11px",
                    color: g.color,
                    border: `1px solid ${g.color}20`,
                  }}
                >
                  {code.trim()}
                </span>
              ))}
            </div>
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "10px",
                color: DS.grey600,
                marginTop: "6px",
                fontWeight: 500,
              }}
            >
              w = Water · a = Air · s = Space · n = None
            </div>
          </div>
        ))}

        {/* Tally grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "12px",
          }}
        >
          {tallies.map((t, ti) => (
            <div
              key={ti}
              style={{
                background: DS.white,
                borderRadius: "16px",
                border: `2px solid ${t.group1Correct && t.group2Correct ? DS.success : DS.grey200}`,
                padding: "14px",
                animation: `fadeInUp 0.4s ease ${ti * 0.08}s both`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "border-color 0.3s ease",
              }}
            >
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: DS.black,
                  marginBottom: "10px",
                }}
              >
                {t.category}
              </div>
              {[1, 2].map((g) => {
                const isG1 = g === 1;
                const val = isG1 ? t.group1Tally : t.group2Tally;
                const correct = isG1 ? t.group1Correct : t.group2Correct;
                const expected = isG1 ? t.group1Expected : t.group2Expected;
                const id = `t-${ti}-${g}`;
                const accentColor = isG1 ? DS.barGroup1 : DS.barGroup2;
                return (
                  <div
                    key={g}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "6px",
                      animation:
                        shakeId === id
                          ? "shake 0.4s ease"
                          : celebrateId === id
                            ? "celebrate 0.5s ease"
                            : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "3px",
                        background: accentColor,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: DS.grey900,
                        minWidth: "56px",
                      }}
                    >
                      {isG1 ? currentData.group1Label : currentData.group2Label}
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={val ?? ""}
                      disabled={correct}
                      onChange={(e) => {
                        const v =
                          e.target.value === ""
                            ? null
                            : parseInt(e.target.value);
                        setTallies((prev) => {
                          const copy = [...prev];
                          const item = { ...copy[ti] };
                          if (isG1) item.group1Tally = v;
                          else item.group2Tally = v;
                          copy[ti] = item;
                          return copy;
                        });
                      }}
                      style={{
                        width: "52px",
                        padding: "6px 8px",
                        borderRadius: "10px",
                        border: `2px solid ${correct ? DS.success : DS.grey400}`,
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 700,
                        fontSize: "14px",
                        textAlign: "center",
                        background: correct ? DS.successLight : DS.white,
                        color: correct ? DS.successDark : DS.black,
                        outline: "none",
                        transition: "all 0.3s ease",
                      }}
                    />
                    {!correct && val !== null && (
                      <button
                        onClick={() => checkTally(ti, g as 1 | 2)}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          border: "none",
                          background: DS.indigo,
                          color: DS.white,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s ease",
                          padding: 0,
                        }}
                      >
                        <Check size={14} />
                      </button>
                    )}
                    {correct && <Check size={18} color={DS.success} />}
                    {!correct && shakeId === id && (
                      <span
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "10px",
                          color: DS.error,
                          fontWeight: 600,
                        }}
                      >
                        Try {expected}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {allTalliesCorrect && (
          <div style={{ marginTop: "18px", animation: "fadeInUp 0.3s ease" }}>
            <ContainedBtn
              label="Continue to Scale Selection"
              icon={<ArrowRight size={16} />}
              onClick={advanceStage}
              color="primary"
              fullWidth
            />
          </div>
        )}
      </div>
    );
  };

  // ===== SCALE STAGE =====
  const renderScaleStage = () => (
    <div style={{ padding: "20px", animation: "fadeInUp 0.4s ease" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        {currentData.scaleOptions.map((s, i) => {
          const isSelected = selectedScale === s;
          const isGood = isSelected && currentData.correctScale.includes(s);
          const isBad = isSelected && !currentData.correctScale.includes(s);

          return (
            <button
              key={s}
              onClick={() => setSelectedScale(s)}
              style={{
                padding: isMobile ? "10px 18px" : "12px 28px",
                borderRadius: "24px",
                border: `2px solid ${isGood ? DS.success : isBad ? DS.error : isSelected ? DS.indigo : DS.grey400}`,
                background: isGood
                  ? DS.successLight
                  : isBad
                    ? DS.errorLight
                    : isSelected
                      ? DS.indigoGhost
                      : DS.white,
                cursor: "pointer",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: isMobile ? "14px" : "15px",
                color: isGood
                  ? DS.successDark
                  : isBad
                    ? DS.error
                    : isSelected
                      ? DS.indigo
                      : DS.grey900,
                transition: "all 0.3s ease",
                animation: `popIn 0.4s ease ${i * 0.08}s both`,
                boxShadow: isSelected
                  ? `0 3px 12px ${isGood ? "rgba(46,204,113,0.2)" : isBad ? "rgba(231,76,60,0.15)" : "rgba(74,77,201,0.15)"}`
                  : "none",
              }}
            >
              1 unit = {s} {activeTab === "temperature" ? "°C" : "students"}
            </button>
          );
        })}
      </div>

      {selectedScale !== null && (
        <div
          style={{
            textAlign: "center",
            padding: "14px 18px",
            borderRadius: "14px",
            animation: "fadeInUp 0.3s ease",
            background: isScaleGood ? DS.successLight : DS.errorLight,
            border: `2px solid ${isScaleGood ? DS.success : DS.error}`,
          }}
        >
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              margin: 0,
              color: isScaleGood ? DS.successDark : DS.error,
              lineHeight: 1.5,
            }}
          >
            {isScaleGood
              ? `Great choice! Max value ${maxValue} needs ${Math.ceil(maxValue / selectedScale)} units on the axis.`
              : `${selectedScale === 1 ? "Too many grid lines — try a bigger scale." : selectedScale > 5 && activeTab === "superpower" ? "Values may be hard to read — try smaller." : "Not ideal. Try another!"}`}
          </p>
        </div>
      )}

      {isScaleGood && (
        <div style={{ marginTop: "16px", animation: "fadeInUp 0.3s ease" }}>
          <ContainedBtn
            label="Build the Bars"
            icon={<ArrowRight size={16} />}
            onClick={advanceStage}
            color="accent"
            fullWidth
          />
        </div>
      )}
    </div>
  );

  // ===== BARS STAGE =====
  const renderBarsStage = () => {
    if (!selectedScale) return null;
    const catCount = currentData.categories.length;
    const clusterGap = plotW / catCount;
    const barWidth = Math.min(clusterGap * 0.3, 28);
    const clusterCenter = (i: number) =>
      margin.left + clusterGap * i + clusterGap / 2;
    const yScale = (val: number) =>
      margin.top + plotH - (val / gridMax) * plotH;
    const gridLines: number[] = [];
    for (let v = 0; v <= gridMax; v += selectedScale) gridLines.push(v);

    return (
      <div
        style={{
          padding: "14px",
          animation: "fadeInUp 0.4s ease",
          overflowX: "auto",
        }}
      >
        {/* Title + Legend */}
        <div style={{ textAlign: "center", marginBottom: "6px" }}>
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              color: DS.black,
            }}
          >
            {currentData.title}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "10px",
          }}
        >
          {[
            { label: currentData.group1Label, color: DS.barGroup1 },
            { label: currentData.group2Label, color: DS.barGroup2 },
          ].map((l) => (
            <div
              key={l.label}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  background: l.color,
                }}
              />
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: DS.grey900,
                }}
              >
                {l.label}
              </span>
            </div>
          ))}
        </div>

        <svg
          ref={svgRef}
          width={chartW}
          height={chartH}
          viewBox={`0 0 ${chartW} ${chartH}`}
          style={{
            display: "block",
            margin: "0 auto",
            background: DS.white,
            borderRadius: "14px",
            border: `2px solid ${DS.grey200}`,
            touchAction: "none",
          }}
        >
          {/* Gridlines */}
          {gridLines.map((v) => (
            <g key={v}>
              <line
                x1={margin.left}
                y1={yScale(v)}
                x2={chartW - margin.right}
                y2={yScale(v)}
                stroke={DS.grey200}
                strokeWidth={v === 0 ? 1 : 0.7}
                strokeDasharray={v === 0 ? "" : "6,4"}
              />
              <text
                x={margin.left - 8}
                y={yScale(v) + 4}
                textAnchor="end"
                fontSize={isMobile ? 9 : 11}
                fontFamily="'Poppins', sans-serif"
                fontWeight={600}
                fill={DS.grey600}
              >
                {v}
              </text>
            </g>
          ))}
          {/* Axes */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={margin.top + plotH}
            stroke={DS.grey900}
            strokeWidth={2}
          />
          <line
            x1={margin.left}
            y1={margin.top + plotH}
            x2={chartW - margin.right}
            y2={margin.top + plotH}
            stroke={DS.grey900}
            strokeWidth={2}
          />
          {/* Y-label */}
          <text
            x={14}
            y={margin.top + plotH / 2}
            textAnchor="middle"
            fontSize={isMobile ? 9 : 11}
            fontFamily="'Poppins', sans-serif"
            fontWeight={600}
            fill={DS.grey600}
            transform={`rotate(-90, 14, ${margin.top + plotH / 2})`}
          >
            {currentData.yAxisLabel}
          </text>

          {/* Bars */}
          {currentData.categories.map((cat, ci) => {
            const cx = clusterCenter(ci);
            const b = bars[ci];
            const g1H =
              b.group1Input !== null ? (b.group1Input / gridMax) * plotH : 0;
            const g2H =
              b.group2Input !== null ? (b.group2Input / gridMax) * plotH : 0;
            const g1X = cx - barWidth - 2;
            const g2X = cx + 2;

            return (
              <g key={ci}>
                <text
                  x={cx}
                  y={margin.top + plotH + (isMobile ? 16 : 20)}
                  textAnchor="middle"
                  fontSize={isMobile ? 8 : 11}
                  fontFamily="'Poppins', sans-serif"
                  fontWeight={600}
                  fill={DS.grey900}
                  transform={
                    isMobile && catCount > 5
                      ? `rotate(-30, ${cx}, ${margin.top + plotH + 16})`
                      : ""
                  }
                >
                  {cat}
                </text>

                {/* Group 1 */}
                <rect
                  x={g1X}
                  y={yScale(b.group1Input ?? 0)}
                  width={barWidth}
                  height={Math.max(0, g1H)}
                  fill={b.group1Correct ? DS.barGroup1 : `${DS.barGroup1}88`}
                  rx={4}
                  ry={4}
                  stroke={b.group1Correct ? DS.indigoHover : "transparent"}
                  strokeWidth={b.group1Correct ? 2 : 0}
                  style={{
                    cursor: b.group1Correct ? "default" : "ns-resize",
                    transition: "all 0.12s ease",
                  }}
                  onMouseDown={(e) => handleBarDrag(e, ci, 1)}
                  onTouchStart={(e) => handleBarDrag(e, ci, 1)}
                />
                {b.group1Input !== null && (
                  <text
                    x={g1X + barWidth / 2}
                    y={yScale(b.group1Input) - 6}
                    textAnchor="middle"
                    fontSize={10}
                    fontFamily="'Poppins', sans-serif"
                    fontWeight={700}
                    fill={b.group1Correct ? DS.indigo : DS.indigoMuted}
                  >
                    {b.group1Input}
                  </text>
                )}
                {!b.group1Correct && (
                  <circle
                    cx={g1X + barWidth / 2}
                    cy={yScale(b.group1Input ?? 0)}
                    r={6}
                    fill={DS.barGroup1}
                    stroke={DS.white}
                    strokeWidth={2.5}
                    style={{ cursor: "ns-resize" }}
                    onMouseDown={(e) => handleBarDrag(e, ci, 1)}
                    onTouchStart={(e) => handleBarDrag(e, ci, 1)}
                  />
                )}

                {/* Group 2 */}
                <rect
                  x={g2X}
                  y={yScale(b.group2Input ?? 0)}
                  width={barWidth}
                  height={Math.max(0, g2H)}
                  fill={b.group2Correct ? DS.barGroup2 : `${DS.barGroup2}88`}
                  rx={4}
                  ry={4}
                  stroke={b.group2Correct ? DS.orangeDark : "transparent"}
                  strokeWidth={b.group2Correct ? 2 : 0}
                  style={{
                    cursor: b.group2Correct ? "default" : "ns-resize",
                    transition: "all 0.12s ease",
                  }}
                  onMouseDown={(e) => handleBarDrag(e, ci, 2)}
                  onTouchStart={(e) => handleBarDrag(e, ci, 2)}
                />
                {b.group2Input !== null && (
                  <text
                    x={g2X + barWidth / 2}
                    y={yScale(b.group2Input) - 6}
                    textAnchor="middle"
                    fontSize={10}
                    fontFamily="'Poppins', sans-serif"
                    fontWeight={700}
                    fill={b.group2Correct ? DS.orange : DS.orangeMuted}
                  >
                    {b.group2Input}
                  </text>
                )}
                {!b.group2Correct && (
                  <circle
                    cx={g2X + barWidth / 2}
                    cy={yScale(b.group2Input ?? 0)}
                    r={6}
                    fill={DS.barGroup2}
                    stroke={DS.white}
                    strokeWidth={2.5}
                    style={{ cursor: "ns-resize" }}
                    onMouseDown={(e) => handleBarDrag(e, ci, 2)}
                    onTouchStart={(e) => handleBarDrag(e, ci, 2)}
                  />
                )}

                {/* Checkmarks */}
                {b.group1Correct && (
                  <g
                    transform={`translate(${g1X + barWidth / 2 - 8}, ${yScale(b.group1Value) - 24})`}
                  >
                    <circle cx={8} cy={8} r={8} fill={DS.success} />
                    <polyline
                      points="4,8 7,11 12,5"
                      fill="none"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}
                {b.group2Correct && (
                  <g
                    transform={`translate(${g2X + barWidth / 2 - 8}, ${yScale(b.group2Value) - 24})`}
                  >
                    <circle cx={8} cy={8} r={8} fill={DS.success} />
                    <polyline
                      points="4,8 7,11 12,5"
                      fill="none"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Input controls */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr 1fr"
              : `repeat(${Math.min(catCount, 4)}, 1fr)`,
            gap: "10px",
            marginTop: "14px",
          }}
        >
          {bars.map((b, ci) => (
            <div
              key={ci}
              style={{
                background: DS.white,
                borderRadius: "14px",
                border: `2px solid ${b.group1Correct && b.group2Correct ? DS.success : DS.grey200}`,
                padding: "10px",
                animation: `slideInRight 0.3s ease ${ci * 0.05}s both`,
                transition: "border-color 0.3s ease",
              }}
            >
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: "11px",
                  color: DS.black,
                  marginBottom: "8px",
                  textAlign: "center",
                }}
              >
                {b.category}
              </div>
              {[1, 2].map((g) => {
                const isG1 = g === 1;
                const val = isG1 ? b.group1Input : b.group2Input;
                const correct = isG1 ? b.group1Correct : b.group2Correct;
                const id = `b-${ci}-${g}`;
                const color = isG1 ? DS.barGroup1 : DS.barGroup2;
                return (
                  <div
                    key={g}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginBottom: "5px",
                      animation:
                        shakeId === id
                          ? "shake 0.4s ease"
                          : celebrateId === id
                            ? "celebrate 0.5s ease"
                            : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        background: color,
                        flexShrink: 0,
                      }}
                    />
                    <input
                      type="number"
                      min={0}
                      max={gridMax}
                      step={selectedScale}
                      value={val ?? ""}
                      disabled={correct}
                      onChange={(e) => {
                        const v =
                          e.target.value === ""
                            ? null
                            : parseInt(e.target.value);
                        setBars((prev) => {
                          const copy = [...prev];
                          const item = { ...copy[ci] };
                          if (isG1) item.group1Input = v;
                          else item.group2Input = v;
                          copy[ci] = item;
                          return copy;
                        });
                      }}
                      style={{
                        width: "44px",
                        padding: "5px 6px",
                        borderRadius: "10px",
                        border: `2px solid ${correct ? DS.success : DS.grey400}`,
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 700,
                        fontSize: "13px",
                        textAlign: "center",
                        background: correct ? DS.successLight : DS.white,
                        color: correct ? DS.successDark : DS.black,
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                    />
                    {!correct && val !== null && (
                      <button
                        onClick={() => checkBar(ci, g as 1 | 2)}
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: "50%",
                          border: "none",
                          background: color,
                          color: DS.white,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                          transition: "all 0.2s ease",
                          flexShrink: 0,
                        }}
                      >
                        <Check size={12} />
                      </button>
                    )}
                    {correct && (
                      <Check
                        size={16}
                        color={DS.success}
                        style={{ flexShrink: 0 }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {allBarsCorrect && (
          <div style={{ marginTop: "16px", animation: "fadeInUp 0.3s ease" }}>
            <ContainedBtn
              label="🎉 View Completed Graph"
              onClick={advanceStage}
              color="success"
              fullWidth
            />
          </div>
        )}
      </div>
    );
  };

  // ===== COMPLETE STAGE =====
  const renderCompleteStage = () => {
    if (!selectedScale) return null;
    const catCount = currentData.categories.length;
    const clusterGap = plotW / catCount;
    const barWidth = Math.min(clusterGap * 0.3, 28);
    const clusterCenter = (i: number) =>
      margin.left + clusterGap * i + clusterGap / 2;
    const yScale = (val: number) =>
      margin.top + plotH - (val / gridMax) * plotH;
    const gridLines: number[] = [];
    for (let v = 0; v <= gridMax; v += selectedScale) gridLines.push(v);

    return (
      <div style={{ padding: "16px", animation: "fadeInUp 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <span
            style={{ fontSize: "36px", animation: "bounce 1s ease infinite" }}
          >
            🎉
          </span>
        </div>
        <div style={{ textAlign: "center", marginBottom: "4px" }}>
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: "18px",
              color: DS.indigo,
            }}
          >
            {currentData.title}
          </span>
        </div>
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: "12px",
              color: DS.grey600,
            }}
          >
            {currentData.subtitle} · Scale: 1 unit = {selectedScale}
          </span>
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "10px",
          }}
        >
          {[
            { label: currentData.group1Label, color: DS.barGroup1 },
            { label: currentData.group2Label, color: DS.barGroup2 },
          ].map((l) => (
            <div
              key={l.label}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  background: l.color,
                }}
              />
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: DS.grey900,
                }}
              >
                {l.label}
              </span>
            </div>
          ))}
        </div>

        <svg
          width={chartW}
          height={chartH}
          viewBox={`0 0 ${chartW} ${chartH}`}
          style={{
            display: "block",
            margin: "0 auto",
            background: DS.white,
            borderRadius: "14px",
            border: `2px solid ${DS.grey200}`,
          }}
        >
          {gridLines.map((v) => (
            <g key={v}>
              <line
                x1={margin.left}
                y1={yScale(v)}
                x2={chartW - margin.right}
                y2={yScale(v)}
                stroke={DS.grey200}
                strokeWidth={v === 0 ? 1 : 0.7}
                strokeDasharray={v === 0 ? "" : "6,4"}
              />
              <text
                x={margin.left - 8}
                y={yScale(v) + 4}
                textAnchor="end"
                fontSize={isMobile ? 9 : 11}
                fontFamily="'Poppins', sans-serif"
                fontWeight={600}
                fill={DS.grey600}
              >
                {v}
              </text>
            </g>
          ))}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={margin.top + plotH}
            stroke={DS.grey900}
            strokeWidth={2}
          />
          <line
            x1={margin.left}
            y1={margin.top + plotH}
            x2={chartW - margin.right}
            y2={margin.top + plotH}
            stroke={DS.grey900}
            strokeWidth={2}
          />
          <text
            x={14}
            y={margin.top + plotH / 2}
            textAnchor="middle"
            fontSize={isMobile ? 9 : 11}
            fontFamily="'Poppins', sans-serif"
            fontWeight={600}
            fill={DS.grey600}
            transform={`rotate(-90, 14, ${margin.top + plotH / 2})`}
          >
            {currentData.yAxisLabel}
          </text>
          <text
            x={margin.left + plotW / 2}
            y={chartH - 4}
            textAnchor="middle"
            fontSize={isMobile ? 9 : 11}
            fontFamily="'Poppins', sans-serif"
            fontWeight={600}
            fill={DS.grey600}
          >
            {currentData.xAxisLabel}
          </text>

          {currentData.categories.map((cat, ci) => {
            const cx = clusterCenter(ci);
            const g1V = currentData.group1Values[ci];
            const g2V = currentData.group2Values[ci];
            const g1X = cx - barWidth - 2;
            const g2X = cx + 2;
            return (
              <g key={ci}>
                <text
                  x={cx}
                  y={margin.top + plotH + (isMobile ? 16 : 20)}
                  textAnchor="middle"
                  fontSize={isMobile ? 8 : 11}
                  fontFamily="'Poppins', sans-serif"
                  fontWeight={600}
                  fill={DS.grey900}
                  transform={
                    isMobile && catCount > 5
                      ? `rotate(-30, ${cx}, ${margin.top + plotH + 16})`
                      : ""
                  }
                >
                  {cat}
                </text>
                <rect
                  x={g1X}
                  y={yScale(g1V)}
                  width={barWidth}
                  height={(g1V / gridMax) * plotH}
                  fill={DS.barGroup1}
                  rx={4}
                  ry={4}
                  style={{ animation: `growBar 0.7s ease ${ci * 0.12}s both` }}
                />
                <text
                  x={g1X + barWidth / 2}
                  y={yScale(g1V) - 6}
                  textAnchor="middle"
                  fontSize={10}
                  fontFamily="'Poppins', sans-serif"
                  fontWeight={700}
                  fill={DS.indigo}
                >
                  {g1V}
                </text>
                <rect
                  x={g2X}
                  y={yScale(g2V)}
                  width={barWidth}
                  height={(g2V / gridMax) * plotH}
                  fill={DS.barGroup2}
                  rx={4}
                  ry={4}
                  style={{
                    animation: `growBar 0.7s ease ${ci * 0.12 + 0.08}s both`,
                  }}
                />
                <text
                  x={g2X + barWidth / 2}
                  y={yScale(g2V) - 6}
                  textAnchor="middle"
                  fontSize={10}
                  fontFamily="'Poppins', sans-serif"
                  fontWeight={700}
                  fill={DS.orange}
                >
                  {g2V}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Insights */}
        {showInsights && (
          <div
            style={{
              marginTop: "16px",
              padding: "18px",
              background: DS.white,
              borderRadius: "18px",
              border: `2px solid ${DS.indigoMuted}`,
              animation: "slideDown 0.6s ease",
              boxShadow: "0 4px 20px rgba(74,77,201,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  background: DS.gradientIndigoOrange,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={16} color={DS.white} />
              </div>
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800,
                  fontSize: "16px",
                  color: DS.indigo,
                }}
              >
                Key Insights
              </span>
            </div>
            {currentData.insights.map((insight, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  marginBottom: "8px",
                  animation: `fadeInUp 0.4s ease ${i * 0.1}s both`,
                  padding: "8px 12px",
                  borderRadius: "12px",
                  background: i % 2 === 0 ? DS.indigoGhost : DS.orangeMuted,
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: i % 2 === 0 ? DS.indigo : DS.orange,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                >
                  <span
                    style={{
                      color: DS.white,
                      fontSize: "10px",
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "13px",
                    color: DS.grey900,
                    margin: 0,
                    lineHeight: 1.6,
                    fontWeight: 500,
                  }}
                >
                  {insight}
                </p>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            marginTop: "14px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <OutlinedBtn
            label="↻  Try Again"
            onClick={resetAll}
            color={DS.indigo}
          />
        </div>
      </div>
    );
  };

  // ==================== MAIN RENDER ====================

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "720px",
        margin: "0 auto",
        fontFamily: "'Poppins', sans-serif",
        background: DS.grey100,
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow:
          "0 12px 48px rgba(74,77,201,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        border: `1px solid ${DS.grey200}`,
        opacity: stageTransition ? 0 : 1,
        transition: "opacity 0.28s ease",
      }}
    >
      {renderHeader()}
      {renderTabs()}
      {renderStageIndicator()}
      <div style={{ padding: "14px 0 0 0" }}>{renderInstructions()}</div>
      <div style={{ minHeight: "320px" }}>
        {stage === "tally" && renderTallyStage()}
        {stage === "scale" && renderScaleStage()}
        {stage === "bars" && renderBarsStage()}
        {stage === "complete" && renderCompleteStage()}
      </div>
      {/* Footer */}
      <div
        style={{
          padding: "12px 20px",
          background: DS.white,
          borderTop: `1px solid ${DS.grey200}`,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "11px",
            color: DS.grey400,
            margin: 0,
            fontWeight: 500,
          }}
        >
          Based on NCERT Ganita Prakash Grade 7 · Chapter 5: Connecting the Dots
        </p>
      </div>
    </div>
  );
};

export default DoubleBarGraphTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
