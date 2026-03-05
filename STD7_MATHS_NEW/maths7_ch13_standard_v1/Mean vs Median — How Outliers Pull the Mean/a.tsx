// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: mean_median_patterns_tool.tsx
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
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Globe,
  BookOpen,
  Target,
  Plus,
  // @ts-expect-error lucide-react types resolved by project/bundler
} from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "real_world" | "hands_on";

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
  type: "intro" | "explanation" | "practice" | "real_world" | "hands_on";
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface ScenarioData {
  name: string;
  label: string;
  dataPoints: number[];
  mean: number;
  median: number;
  relationship: "equal" | "less" | "greater";
  outlierDirection?: "low" | "high" | "none";
  description: string;
  teachingNote: string;
}

interface MeanMedianAdditionalProps {
  scenarios?: ScenarioData[];
  showDotPlots?: boolean;
  meanColor?: string;
  medianColor?: string;
  accentColor?: string;
  fontFamily?: string;
}

interface MeanMedianToolProps {
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
    additionalProps?: MeanMedianAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  indigo: "#4A4DC9",
  orange: "#FF7212",
  gradientDark: "#533086",
  gradientLight: "#FC9145",
  indigoLight: "#C1C1EA",
  orangeLight: "#FFF3E4",
  indigoBg: "#EEEEF8",
  orangeBg: "#FFF8F0",
  dark: "#4E4E4E",
  gray: "#CACACA",
  lightGray: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  textPrimary: "#2D2D3F",
  textSecondary: "#6B6B80",
  textMuted: "#9E9EB0",
  radius: "12px",
  radiusSm: "8px",
  radiusLg: "16px",
  radiusPill: "100px",
  shadowSm: "0 1px 3px rgba(74,77,201,0.08)",
  shadowMd: "0 4px 16px rgba(74,77,201,0.10)",
  shadowLg: "0 8px 32px rgba(74,77,201,0.12)",
  shadowGlow: "0 0 20px rgba(74,77,201,0.18)",
};

// ==================== ANIMATION HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
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

// ==================== DEFAULT SCENARIOS ====================

const DEFAULT_SCENARIOS: ScenarioData[] = [
  {
    name: "Newspaper Pages",
    label: "Balanced Data",
    dataPoints: [10, 16, 16, 18, 20, 22, 26],
    mean: 18.29,
    median: 18,
    relationship: "equal",
    outlierDirection: "none",
    description: "Pages in a newspaper Mon–Sun: 16, 18, 20, 22, 26, 16, 10",
    teachingNote:
      'When data is balanced, mean and median are close together. This is the "normal" case.',
  },
  {
    name: "Poovizhi's Family Heights",
    label: "Low Outlier",
    dataPoints: [118, 165, 170, 173, 175],
    mean: 160.2,
    median: 170,
    relationship: "less",
    outlierDirection: "low",
    description:
      "Heights (cm): 170, 173, 165, 118, 175 — the youngest child (118 cm) is an outlier",
    teachingNote:
      "The low outlier (118 cm) pulls the mean DOWN. Mean < Median. Which direction did the outlier pull the mean?",
  },
  {
    name: "Bookworm Stories",
    label: "High Outlier",
    dataPoints: [0, 0, 1, 2, 3, 5, 5, 6, 7, 8, 8, 10, 12, 15, 40],
    mean: 8.13,
    median: 6,
    relationship: "greater",
    outlierDirection: "high",
    description:
      "Stories read by class: 3, 0, 8, 5, 15, 0, 2, 7, 12, 40, 5, 10, 1, 0, 8",
    teachingNote:
      "The high outlier (40 stories) pulls the mean UP. Mean > Median. Can you predict this pattern now?",
  },
];

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Balanced Data: Newspaper Pages",
    description:
      "The number of pages in a newspaper Mon–Sun: 16, 18, 20, 22, 26, 16, 10. Notice how the mean (≈18.3) and median (18) are very close!",
    type: "intro",
    mode: "learn",
    data: { scenarioIndex: 0 },
  },
  {
    id: 2,
    title: "Low Outlier: Poovizhi’s Family",
    description:
      "Heights: 170, 173, 165, 118, 175 cm. The youngest child (118 cm) is much shorter. See how the mean (160.2) drops below the median (170)!",
    type: "explanation",
    mode: "learn",
    data: { scenarioIndex: 1 },
  },
  {
    id: 3,
    title: "High Outlier: Bookworm Stories",
    description:
      "Stories read: 3, 0, 8, 5, 15, 0, 2, 7, 12, 40, 5, 10, 1, 0, 8. One student read 40 stories! The mean (≈8.1) rises above the median (6).",
    type: "explanation",
    mode: "learn",
    data: { scenarioIndex: 2 },
  },
  {
    id: 4,
    title: "The Pattern Revealed!",
    description:
      "Low outlier → Mean pulled DOWN (Mean < Median). High outlier → Mean pulled UP (Mean > Median). No outlier → Mean ≈ Median. The mean chases outliers, while the median stays steady!",
    type: "explanation",
    mode: "learn",
    data: { scenarioIndex: -1, isPattern: true },
  },
  {
    id: 5,
    title: "Measures of Central Tendency",
    description:
      "Mean and Median are both ‘measures of central tendency’ — they find the centre of data, but in different ways. Mean balances all values equally. Median picks the middle position. Both are useful!",
    type: "explanation",
    mode: "learn",
    data: { scenarioIndex: -1, isCentralTendency: true },
  },
  {
    id: 10,
    title: "Predict the Relationship",
    description:
      "Data: 5, 8, 9, 10, 11, 12, 45. There’s a high outlier (45). Will the mean be greater than, less than, or equal to the median?",
    type: "practice",
    mode: "practice",
    data: { question: "predict_high", answer: "greater" },
  },
  {
    id: 11,
    title: "Spot the Outlier Effect",
    description:
      "Data: 2, 50, 55, 58, 60, 62. There’s a low outlier (2). What will happen to the mean compared to the median?",
    type: "practice",
    mode: "practice",
    data: { question: "predict_low", answer: "less" },
  },
  {
    id: 12,
    title: "Balanced or Skewed?",
    description:
      "Data: 20, 22, 24, 25, 26, 28, 30. No extreme outliers. How will mean and median compare?",
    type: "practice",
    mode: "practice",
    data: { question: "predict_balanced", answer: "equal" },
  },
  {
    id: 20,
    title: "Cricket Scores",
    description:
      "In cricket, most batters score low but a few score big centuries. The median better represents a ‘typical’ score because high scores pull the mean up.",
    type: "real_world",
    mode: "real_world",
    data: { context: "cricket" },
  },
  {
    id: 21,
    title: "Class Test Marks",
    description:
      "If most students score between 60–80 but one scores 15, the mean drops while the median stays near the middle of the main group.",
    type: "real_world",
    mode: "real_world",
    data: { context: "marks" },
  },
];

// ==================== MAIN COMPONENT ====================

const MeanMedianPatternsTool: React.FC<MeanMedianToolProps> = ({
  props = {} as NonNullable<MeanMedianToolProps["props"]>,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: props.initialMode ?? "learn",
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: props.enabledModes ?? ["learn", "practice", "real_world"],
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      initialStep: props.initialStep ?? 1,
      filterSteps: props.filterSteps ?? null,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration:
        props.autoPlayDuration ?? props.data?.autoPlayDuration ?? 10000,
      themeColor: props.themeColor ?? props.data?.themeColor ?? DS.indigo,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const additionalProps = props.additionalProps || {};
  const toolConfig = useMemo(
    () => ({
      scenarios: additionalProps.scenarios ?? DEFAULT_SCENARIOS,
      showDotPlots: additionalProps.showDotPlots ?? true,
      meanColor: additionalProps.meanColor ?? DS.indigo,
      medianColor: additionalProps.medianColor ?? DS.orange,
      accentColor: additionalProps.accentColor ?? DS.gradientDark,
      fontFamily: additionalProps.fontFamily ?? "'Poppins', sans-serif",
    }),
    [additionalProps],
  );

  const allSteps = props.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(() => {
    if (config.filterSteps && config.filterSteps.length > 0)
      return allSteps.filter((s) => config.filterSteps!.includes(s.id));
    return allSteps;
  }, [allSteps, config.filterSteps]);

  const [selectedMode, setSelectedMode] = useState<ModeType>(
    config.initialMode,
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!stopAutoNext);
  const [revealedRows, setRevealedRows] = useState<number[]>([]);
  const [animatingRow, setAnimatingRow] = useState<number | null>(null);
  const [practiceAnswer, setPracticeAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const modeSteps = useMemo(
    () => availableSteps.filter((s) => s.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const currentStep = modeSteps[currentStepIndex] || modeSteps[0];
  const MEAN_COLOR = toolConfig.meanColor;
  const MEDIAN_COLOR = toolConfig.medianColor;

  // ─── KEYFRAMES ───
  useEffect(() => {
    const kf = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
            @keyframes slideInFromRight { 0%{opacity:0;transform:translateX(50px) scale(0.96)} 60%{opacity:1;transform:translateX(-4px) scale(1.005)} 100%{opacity:1;transform:translateX(0) scale(1)} }
            @keyframes slideInFromLeft { 0%{opacity:0;transform:translateX(-50px) scale(0.96)} 60%{opacity:1;transform:translateX(4px) scale(1.005)} 100%{opacity:1;transform:translateX(0) scale(1)} }
            @keyframes fadeInUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
            @keyframes fadeIn { from{opacity:0} to{opacity:1} }
            @keyframes popIn { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }
            @keyframes softGlow { 0%,100%{box-shadow:0 0 8px rgba(74,77,201,0.12)} 50%{box-shadow:0 0 24px rgba(74,77,201,0.28)} }
            @keyframes pulseArrow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
            @keyframes pulseArrowUp { 0%,100%{transform:translateY(0) rotate(180deg)} 50%{transform:translateY(-5px) rotate(180deg)} }
            @keyframes bounceIn { 0%{transform:scale(0.3);opacity:0} 50%{transform:scale(1.06)} 70%{transform:scale(0.94)} 100%{transform:scale(1);opacity:1} }
            @keyframes drawDot { 0%{transform:scale(0);opacity:0} 80%{transform:scale(1.3)} 100%{transform:scale(1);opacity:1} }
            @keyframes numberCount { from{opacity:0;transform:translateY(8px) scale(0.9)} to{opacity:1;transform:translateY(0) scale(1)} }
            @keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        `;
    const s = document.createElement("style");
    s.id = "mm-kf-singularity";
    s.textContent = kf;
    document.head.appendChild(s);
    return () => {
      const e = document.getElementById("mm-kf-singularity");
      if (e) document.head.removeChild(e);
    };
  }, []);

  // ─── ROW REVEAL ───
  useEffect(() => {
    if (
      selectedMode === "learn" &&
      currentStep?.data?.scenarioIndex !== undefined
    ) {
      const idx = currentStep.data.scenarioIndex;
      if (idx >= 0 && !revealedRows.includes(idx)) {
        setAnimatingRow(idx);
        setTimeout(() => {
          setRevealedRows((prev) => [...prev, idx]);
          setTimeout(() => setAnimatingRow(null), 600);
        }, 100);
      }
      if (currentStep.data.isPattern && !revealedRows.includes(100)) {
        setAnimatingRow(100);
        setTimeout(() => {
          setRevealedRows((prev) => [...prev, 100]);
          setTimeout(() => setAnimatingRow(null), 600);
        }, 100);
      }
      if (currentStep.data.isCentralTendency && !revealedRows.includes(101)) {
        setAnimatingRow(101);
        setTimeout(() => {
          setRevealedRows((prev) => [...prev, 101]);
          setTimeout(() => setAnimatingRow(null), 600);
        }, 100);
      }
    }
  }, [currentStep, selectedMode]);

  // ─── AUTO-PLAY ───
  useEffect(() => {
    if (!isPlaying || config.autoPlayDuration === 0) return;
    const t = setInterval(() => {
      setCurrentStepIndex((p) => {
        if (p < modeSteps.length - 1) return p + 1;
        setIsPlaying(false);
        return p;
      });
    }, config.autoPlayDuration);
    return () => clearInterval(t);
  }, [isPlaying, config.autoPlayDuration, modeSteps.length]);

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
    if (currentStepIndex < modeSteps.length - 1) {
      setCurrentStepIndex((p) => p + 1);
    }
  }, [currentStepIndex, modeSteps.length]);
  const goPrev = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((p) => p - 1);
    }
  }, [currentStepIndex]);
  const switchMode = useCallback((m: ModeType) => {
    setSelectedMode(m);
    setCurrentStepIndex(0);
  }, []);

  // Reset practice state whenever step or mode changes
  useEffect(() => {
    setPracticeAnswer(null);
    setShowFeedback(false);
  }, [currentStepIndex, selectedMode]);

  // ═══════════════════════════════════════════════════════════════
  // MINI DOT PLOT
  // ═══════════════════════════════════════════════════════════════
  const MiniDotPlot: React.FC<{ scenario: ScenarioData; animate: boolean }> = ({
    scenario,
    animate,
  }) => {
    const sorted = [...scenario.dataPoints].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min || 1;
    const W = 210;
    const H = 48;
    const getX = (v: number) => 12 + ((v - min) / range) * (W - 24);
    const dots: { x: number; y: number }[] = [];
    const cnt: Record<string, number> = {};
    sorted.forEach((v) => {
      const k = v.toString();
      cnt[k] = (cnt[k] || 0) + 1;
      dots.push({ x: getX(v), y: Math.max(H - 8 - (cnt[k] - 1) * 9, 4) });
    });
    const mX = getX(scenario.mean);
    const mdX = getX(scenario.median);
    return (
      <svg width={W} height={H + 18} style={{ overflow: "visible" }}>
        <line
          x1={6}
          y1={H}
          x2={W - 6}
          y2={H}
          stroke={DS.lightGray}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <text
          x={12}
          y={H + 13}
          fontSize={8}
          fill={DS.textMuted}
          fontFamily="'Poppins',sans-serif"
          fontWeight={500}
        >
          {min}
        </text>
        <text
          x={W - 14}
          y={H + 13}
          fontSize={8}
          fill={DS.textMuted}
          textAnchor="end"
          fontFamily="'Poppins',sans-serif"
          fontWeight={500}
        >
          {max}
        </text>
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={3.5}
            fill={DS.gray}
            stroke={DS.white}
            strokeWidth={0.5}
            style={{
              animation: animate
                ? `drawDot 0.35s ease-out ${i * 0.04}s both`
                : "none",
            }}
          />
        ))}
        <line
          x1={mX}
          y1={3}
          x2={mX}
          y2={H - 3}
          stroke={MEAN_COLOR}
          strokeWidth={2.5}
          strokeDasharray="3,2"
          strokeLinecap="round"
          style={{
            animation: animate ? "fadeIn 0.5s ease-out 0.7s both" : "none",
          }}
        />
        <rect
          x={mX - 16}
          y={H + 2}
          width={32}
          height={14}
          rx={4}
          fill={DS.indigoBg}
          style={{
            animation: animate ? "fadeIn 0.5s ease-out 0.8s both" : "none",
          }}
        />
        <text
          x={mX}
          y={H + 13}
          fontSize={7.5}
          fill={MEAN_COLOR}
          textAnchor="middle"
          fontWeight={700}
          fontFamily="'Poppins',sans-serif"
          style={{
            animation: animate ? "fadeIn 0.5s ease-out 0.85s both" : "none",
          }}
        >
          x̄={scenario.mean.toFixed(1)}
        </text>
        <line
          x1={mdX}
          y1={3}
          x2={mdX}
          y2={H - 3}
          stroke={MEDIAN_COLOR}
          strokeWidth={2.5}
          strokeLinecap="round"
          style={{
            animation: animate ? "fadeIn 0.5s ease-out 0.9s both" : "none",
          }}
        />
        <text
          x={mdX}
          y={H + 18}
          fontSize={7.5}
          fill={MEDIAN_COLOR}
          textAnchor="middle"
          fontWeight={700}
          fontFamily="'Poppins',sans-serif"
          style={{
            animation: animate ? "fadeIn 0.5s ease-out 0.95s both" : "none",
          }}
        >
          Md={scenario.median}
        </text>
      </svg>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // RELATIONSHIP ICON
  // ═══════════════════════════════════════════════════════════════
  const RelIcon: React.FC<{ rel: string; animate: boolean }> = ({
    rel,
    animate,
  }) => {
    const base: React.CSSProperties = {
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2px",
      animation: animate ? "bounceIn 0.5s ease-out 0.4s both" : "none",
    };
    if (rel === "equal")
      return (
        <span
          style={{
            ...base,
            background: `linear-gradient(135deg, ${DS.indigoBg}, ${DS.orangeLight})`,
            padding: "6px 10px",
            borderRadius: DS.radiusSm,
          }}
        >
          <span
            style={{
              fontSize: "22px",
              fontWeight: 900,
              color: DS.gradientDark,
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            ≈
          </span>
          <span
            style={{
              fontSize: "8px",
              color: DS.textSecondary,
              fontWeight: 600,
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            Close!
          </span>
        </span>
      );
    if (rel === "less")
      return (
        <span style={base}>
          <span
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#EF4444,#DC2626)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: DS.white,
              fontSize: "14px",
              animation: "pulseArrow 1.4s ease-in-out infinite",
              boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
            }}
          >
            ▼
          </span>
          <span
            style={{
              fontSize: "8px",
              color: "#EF4444",
              fontWeight: 700,
              fontFamily: "'Poppins',sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            Pulled down
          </span>
        </span>
      );
    return (
      <span style={base}>
        <span
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,#EF4444,#DC2626)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: DS.white,
            fontSize: "14px",
            animation: "pulseArrowUp 1.4s ease-in-out infinite",
            boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
          }}
        >
          ▼
        </span>
        <span
          style={{
            fontSize: "8px",
            color: "#EF4444",
            fontWeight: 700,
            fontFamily: "'Poppins',sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          Pulled up
        </span>
      </span>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // LEARN MODE TABLE
  // ═══════════════════════════════════════════════════════════════
  const renderLearn = () => {
    const scenarios = toolConfig.scenarios;
    const activeIdx = currentStep?.data?.scenarioIndex ?? -1;
    return (
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          padding: "0 2px",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "600px",
            borderCollapse: "separate",
            borderSpacing: "0 8px",
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  fontSize: "10px",
                  color: DS.textMuted,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  width: "22%",
                }}
              >
                Scenario
              </th>
              <th
                style={{
                  padding: "10px 16px",
                  textAlign: "center",
                  fontSize: "13px",
                  color: DS.white,
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${DS.indigo}, ${DS.gradientDark})`,
                  borderRadius: "10px 0 0 10px",
                  width: "17%",
                }}
              >
                Mean
              </th>
              <th
                style={{
                  padding: "10px 8px",
                  textAlign: "center",
                  fontSize: "10px",
                  color: DS.textMuted,
                  fontWeight: 500,
                  width: "11%",
                }}
              >
                Relation
              </th>
              <th
                style={{
                  padding: "10px 16px",
                  textAlign: "center",
                  fontSize: "13px",
                  color: DS.white,
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${DS.orange}, ${DS.gradientLight})`,
                  borderRadius: "0 10px 10px 0",
                  width: "17%",
                }}
              >
                Median
              </th>
              <th
                style={{
                  padding: "10px 12px",
                  textAlign: "center",
                  fontSize: "10px",
                  color: DS.textMuted,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  width: "33%",
                }}
              >
                Dot Plot
              </th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((sc, idx) => {
              const isRevealed = revealedRows.includes(idx);
              const isAnim = animatingRow === idx;
              const isActive = activeIdx === idx;
              if (!isRevealed && !isAnim) return null;
              const borderCol =
                sc.outlierDirection === "none"
                  ? DS.indigo
                  : sc.outlierDirection === "low"
                    ? DS.gradientDark
                    : DS.orange;
              const badgeBg =
                sc.outlierDirection === "none"
                  ? `linear-gradient(135deg,${DS.indigo},${DS.gradientDark})`
                  : sc.outlierDirection === "low"
                    ? `linear-gradient(135deg,${DS.gradientDark},#7C3AED)`
                    : `linear-gradient(135deg,${DS.orange},${DS.gradientLight})`;
              return (
                <tr
                  key={idx}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    animation: isAnim
                      ? "slideInFromRight 0.65s ease-out both"
                      : "none",
                    background: isActive
                      ? `linear-gradient(90deg,${DS.indigoBg},${DS.offWhite})`
                      : hoveredRow === idx
                        ? DS.offWhite
                        : "transparent",
                    borderRadius: DS.radius,
                    transition: "background 0.3s ease, box-shadow 0.3s ease",
                    boxShadow: isActive ? DS.shadowGlow : "none",
                  }}
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      borderLeft: `4px solid ${borderCol}`,
                      borderRadius: "10px 0 0 10px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "13px",
                        color: DS.textPrimary,
                        lineHeight: 1.3,
                      }}
                    >
                      {sc.name}
                    </div>
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                        color: DS.white,
                        textTransform: "uppercase",
                        background: badgeBg,
                        padding: "2px 10px",
                        borderRadius: DS.radiusPill,
                        display: "inline-block",
                        marginTop: "5px",
                      }}
                    >
                      {sc.label}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "14px 12px",
                      textAlign: "center",
                      background: DS.indigoBg,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "22px",
                        fontWeight: 800,
                        color: DS.indigo,
                        fontFamily: "'Poppins',sans-serif",
                        animation: isAnim
                          ? "numberCount 0.5s ease-out 0.25s both"
                          : "none",
                      }}
                    >
                      {sc.mean.toFixed(1)}
                    </span>
                  </td>
                  <td style={{ padding: "8px 4px", textAlign: "center" }}>
                    <RelIcon rel={sc.relationship} animate={isAnim} />
                  </td>
                  <td
                    style={{
                      padding: "14px 12px",
                      textAlign: "center",
                      background: DS.orangeLight,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "22px",
                        fontWeight: 800,
                        color: DS.orange,
                        fontFamily: "'Poppins',sans-serif",
                        animation: isAnim
                          ? "numberCount 0.5s ease-out 0.35s both"
                          : "none",
                      }}
                    >
                      {sc.median}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "8px 6px",
                      textAlign: "center",
                      borderRadius: "0 10px 10px 0",
                    }}
                  >
                    {toolConfig.showDotPlots && (
                      <MiniDotPlot scenario={sc} animate={isAnim} />
                    )}
                  </td>
                </tr>
              );
            })}

            {/* Pattern Row */}
            {(revealedRows.includes(100) || animatingRow === 100) && (
              <tr
                style={{
                  animation:
                    animatingRow === 100
                      ? "slideInFromLeft 0.65s ease-out both"
                      : "none",
                }}
              >
                <td
                  colSpan={5}
                  style={{
                    padding: "18px 20px",
                    borderRadius: DS.radiusLg,
                    background: `linear-gradient(135deg,${DS.indigoBg},${DS.orangeLight})`,
                    border: `1px solid ${DS.indigoLight}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "14px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {[
                      {
                        icon: "⬇",
                        label: "Low Outlier",
                        sub: "Mean < Median",
                        bg: `linear-gradient(135deg,${DS.gradientDark},#7C3AED)`,
                        borderC: `${DS.gradientDark}30`,
                        labelC: DS.gradientDark,
                        delay: "0.15s",
                      },
                      {
                        icon: "⚖",
                        label: "No Outlier",
                        sub: "Mean ≈ Median",
                        bg: `linear-gradient(135deg,${DS.indigo},${DS.gradientDark})`,
                        borderC: `${DS.indigo}30`,
                        labelC: DS.indigo,
                        delay: "0.35s",
                      },
                      {
                        icon: "⬆",
                        label: "High Outlier",
                        sub: "Mean > Median",
                        bg: `linear-gradient(135deg,${DS.orange},${DS.gradientLight})`,
                        borderC: `${DS.orange}30`,
                        labelC: DS.orange,
                        delay: "0.55s",
                      },
                    ].map((c, i) => (
                      <div
                        key={i}
                        style={{
                          background: DS.white,
                          padding: "12px 18px",
                          borderRadius: DS.radius,
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          border: `2px solid ${c.borderC}`,
                          boxShadow: DS.shadowSm,
                          animation: `popIn 0.5s ease-out ${c.delay} both`,
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: c.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            color: DS.white,
                          }}
                        >
                          {c.icon}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              color: c.labelC,
                              fontFamily: "'Poppins',sans-serif",
                            }}
                          >
                            {c.label}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: DS.textPrimary,
                              fontWeight: 600,
                              fontFamily: "'Poppins',sans-serif",
                            }}
                          >
                            {c.sub}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "12px",
                      fontSize: "12px",
                      color: DS.textSecondary,
                      fontWeight: 500,
                      fontStyle: "italic",
                      fontFamily: "'Poppins',sans-serif",
                      animation: "fadeInUp 0.5s ease-out 0.7s both",
                    }}
                  >
                    The mean chases outliers, while the median stays steady in
                    the middle!
                  </div>
                </td>
              </tr>
            )}

            {/* Central Tendency Row */}
            {(revealedRows.includes(101) || animatingRow === 101) && (
              <tr
                style={{
                  animation:
                    animatingRow === 101
                      ? "slideInFromRight 0.65s ease-out both"
                      : "none",
                }}
              >
                <td
                  colSpan={5}
                  style={{
                    padding: "20px",
                    borderRadius: DS.radiusLg,
                    background: DS.white,
                    border: `2px dashed ${DS.indigoLight}`,
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "15px",
                      fontWeight: 800,
                      fontFamily: "'Poppins',sans-serif",
                      background: `linear-gradient(135deg,${DS.indigo},${DS.orange})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      marginBottom: "14px",
                      animation: "bounceIn 0.6s ease-out 0.2s both",
                    }}
                  >
                    📊 Measures of Central Tendency
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "16px",
                      justifyContent: "center",
                    }}
                  >
                    {/* Mean card */}
                    <div
                      style={{
                        flex: "1 1 200px",
                        maxWidth: "280px",
                        background: DS.indigoBg,
                        padding: "16px",
                        borderRadius: DS.radius,
                        border: `2px solid ${DS.indigoLight}`,
                        animation: "fadeInUp 0.5s ease-out 0.4s both",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 800,
                          color: DS.indigo,
                          marginBottom: "8px",
                          fontFamily: "'Poppins',sans-serif",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "6px",
                            background: `linear-gradient(135deg,${DS.indigo},${DS.gradientDark})`,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: DS.white,
                            fontSize: "12px",
                          }}
                        >
                          x̄
                        </span>
                        Mean (Average)
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: DS.textPrimary,
                          lineHeight: 1.6,
                          fontFamily: "'Poppins',sans-serif",
                        }}
                      >
                        Add all values and divide by count. Balances{" "}
                        <strong>all</strong> values equally — sensitive to
                        outliers.
                      </div>
                      <div
                        style={{
                          marginTop: "10px",
                          fontSize: "11px",
                          background: DS.white,
                          padding: "8px 12px",
                          borderRadius: DS.radiusSm,
                          color: DS.indigo,
                          fontWeight: 700,
                          fontFamily: "'Poppins',sans-serif",
                          textAlign: "center",
                          border: `1px solid ${DS.indigoLight}`,
                        }}
                      >
                        Sum ÷ Count
                      </div>
                    </div>
                    {/* Median card */}
                    <div
                      style={{
                        flex: "1 1 200px",
                        maxWidth: "280px",
                        background: DS.orangeLight,
                        padding: "16px",
                        borderRadius: DS.radius,
                        border: `2px solid ${DS.orange}30`,
                        animation: "fadeInUp 0.5s ease-out 0.6s both",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 800,
                          color: DS.orange,
                          marginBottom: "8px",
                          fontFamily: "'Poppins',sans-serif",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "6px",
                            background: `linear-gradient(135deg,${DS.orange},${DS.gradientLight})`,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: DS.white,
                            fontSize: "11px",
                            fontWeight: 800,
                          }}
                        >
                          Md
                        </span>
                        Median (Middle)
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: DS.textPrimary,
                          lineHeight: 1.6,
                          fontFamily: "'Poppins',sans-serif",
                        }}
                      >
                        Sort all values and pick the middle one. Focuses on{" "}
                        <strong>position</strong> — resistant to outliers.
                      </div>
                      <div
                        style={{
                          marginTop: "10px",
                          fontSize: "11px",
                          background: DS.white,
                          padding: "8px 12px",
                          borderRadius: DS.radiusSm,
                          color: DS.orange,
                          fontWeight: 700,
                          fontFamily: "'Poppins',sans-serif",
                          textAlign: "center",
                          border: `1px solid ${DS.orange}30`,
                        }}
                      >
                        Middle of sorted data
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // PRACTICE MODE
  // ═══════════════════════════════════════════════════════════════
  const renderPractice = () => {
    const data = currentStep?.data;
    if (!data) return null;
    const handleAnswer = (a: string) => {
      setPracticeAnswer(a);
      setShowFeedback(true);
      if (setStopAutoNext) setStopAutoNext(true);
    };
    const isCorrect = practiceAnswer === data.answer;
    const correctLabel =
      data.answer === "greater"
        ? "Mean > Median"
        : data.answer === "less"
          ? "Mean < Median"
          : "Mean ≈ Median";
    const opts = [
      { key: "greater", label: "Mean > Median", icon: "⬆" },
      { key: "less", label: "Mean < Median", icon: "⬇" },
      { key: "equal", label: "Mean ≈ Median", icon: "⚖" },
    ];
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          padding: "24px",
          animation: "fadeInUp 0.5s ease-out both",
        }}
      >
        <div
          style={{
            background: DS.offWhite,
            borderRadius: DS.radiusLg,
            padding: "20px 28px",
            maxWidth: "520px",
            width: "100%",
            border: `1px solid ${DS.lightGray}`,
            boxShadow: DS.shadowSm,
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: DS.textPrimary,
              textAlign: "center",
              lineHeight: 1.7,
              fontFamily: "'Poppins',sans-serif",
              fontWeight: 500,
            }}
          >
            {currentStep.description}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {opts.map((o) => {
            const isSel = practiceAnswer === o.key;
            const isThisCorrect = o.key === data.answer;
            const isR = isSel && isCorrect;
            const isW = isSel && !isCorrect;
            // After feedback: highlight correct answer green even if not selected
            const showAsCorrect = showFeedback && !isCorrect && isThisCorrect;
            return (
              <button
                key={o.key}
                onClick={() => handleAnswer(o.key)}
                disabled={showFeedback}
                onMouseEnter={() =>
                  !showFeedback && setHoveredBtn(`p-${o.key}`)
                }
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0 24px",
                  height: "44px",
                  borderRadius: DS.radiusPill,
                  border:
                    isR || showAsCorrect
                      ? "2px solid #22C55E"
                      : isW
                        ? "2px solid #EF4444"
                        : `2px solid ${DS.indigoLight}`,
                  background:
                    isR || showAsCorrect
                      ? "#F0FDF4"
                      : isW
                        ? "#FEF2F2"
                        : hoveredBtn === `p-${o.key}`
                          ? DS.indigoBg
                          : DS.white,
                  fontSize: "13px",
                  fontWeight: 600,
                  color:
                    isR || showAsCorrect
                      ? "#16A34A"
                      : isW
                        ? "#DC2626"
                        : DS.indigo,
                  cursor: showFeedback ? "default" : "pointer",
                  transition: "all 0.25s ease",
                  transform:
                    isSel || showAsCorrect
                      ? "scale(1.04)"
                      : hoveredBtn === `p-${o.key}`
                        ? "scale(1.02)"
                        : "scale(1)",
                  fontFamily: "'Poppins',sans-serif",
                  boxShadow: isSel || showAsCorrect ? DS.shadowMd : "none",
                  animation: showAsCorrect
                    ? "bounceIn 0.5s ease-out 0.3s both"
                    : "none",
                }}
              >
                {showAsCorrect && <span style={{ fontSize: "14px" }}>✅</span>}
                <span style={{ fontSize: "16px" }}>{o.icon}</span>
                {o.label}
              </button>
            );
          })}
        </div>
        {showFeedback && (
          <div
            style={{
              padding: "16px 28px",
              borderRadius: DS.radius,
              background: isCorrect
                ? "linear-gradient(135deg,#F0FDF4,#DCFCE7)"
                : "linear-gradient(135deg,#FEF2F2,#FFF3E4)",
              border: `2px solid ${isCorrect ? "#22C55E" : "#EF4444"}`,
              fontWeight: 600,
              fontSize: "14px",
              animation: "bounceIn 0.5s ease-out both",
              textAlign: "center",
              maxWidth: "440px",
              fontFamily: "'Poppins',sans-serif",
              boxShadow: DS.shadowSm,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
            }}
          >
            {isCorrect ? (
              <span style={{ color: "#15803D" }}>
                {"🎉"} Correct! You understand the pattern!
              </span>
            ) : (
              <>
                <span style={{ color: "#DC2626" }}>{"❌"} Not quite!</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#F0FDF4",
                    border: "1.5px solid #22C55E",
                    borderRadius: DS.radiusPill,
                    padding: "6px 18px",
                    animation: "fadeInUp 0.4s ease-out 0.3s both",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{"✅"}</span>
                  <span
                    style={{
                      color: "#15803D",
                      fontWeight: 700,
                      fontSize: "13px",
                    }}
                  >
                    Correct answer: {correctLabel}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // REAL WORLD MODE
  // ═══════════════════════════════════════════════════════════════
  const renderRealWorld = () => {
    const ctx = currentStep?.data?.context;
    const exs: Record<
      string,
      {
        title: string;
        icon: string;
        desc: string;
        meanNote: string;
        medianNote: string;
      }
    > = {
      cricket: {
        title: "Cricket Scores",
        icon: "🏐",
        desc: "Most batters score low, but a few score big centuries.",
        meanNote: "Mean gets pulled up by high scores (centuries)",
        medianNote: "Median represents the “typical” batter score",
      },
      marks: {
        title: "Class Test Marks",
        icon: "📝",
        desc: "Most students score 60–80, but one student scored only 15.",
        meanNote: "Mean drops because of the very low score",
        medianNote: "Median stays near the main group (60–80)",
      },
    };
    const ex = exs[ctx || "cricket"];
    if (!ex) return null;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          padding: "24px",
          animation: "fadeInUp 0.5s ease-out both",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: `linear-gradient(135deg,${DS.indigoBg},${DS.orangeLight})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            animation: "bounceIn 0.6s ease-out both",
            boxShadow: DS.shadowMd,
          }}
        >
          {ex.icon}
        </div>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: DS.textPrimary,
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          {ex.title}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: DS.textSecondary,
            textAlign: "center",
            maxWidth: "420px",
            lineHeight: 1.6,
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          {ex.desc}
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: DS.indigoBg,
              border: `2px solid ${DS.indigoLight}`,
              padding: "14px 20px",
              borderRadius: DS.radius,
              maxWidth: "230px",
              animation: "slideInFromLeft 0.5s ease-out 0.2s both",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: DS.indigo,
                fontFamily: "'Poppins',sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "4px",
                  background: `linear-gradient(135deg,${DS.indigo},${DS.gradientDark})`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: DS.white,
                  fontSize: "9px",
                  fontWeight: 800,
                }}
              >
                x̄
              </span>
              Mean
            </div>
            <div
              style={{
                fontSize: "11px",
                color: DS.textPrimary,
                marginTop: "6px",
                fontFamily: "'Poppins',sans-serif",
                lineHeight: 1.5,
              }}
            >
              {ex.meanNote}
            </div>
          </div>
          <div
            style={{
              background: DS.orangeLight,
              border: `2px solid ${DS.orange}30`,
              padding: "14px 20px",
              borderRadius: DS.radius,
              maxWidth: "230px",
              animation: "slideInFromRight 0.5s ease-out 0.2s both",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: DS.orange,
                fontFamily: "'Poppins',sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "4px",
                  background: `linear-gradient(135deg,${DS.orange},${DS.gradientLight})`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: DS.white,
                  fontSize: "8px",
                  fontWeight: 800,
                }}
              >
                Md
              </span>
              Median
            </div>
            <div
              style={{
                fontSize: "11px",
                color: DS.textPrimary,
                marginTop: "6px",
                fontFamily: "'Poppins',sans-serif",
                lineHeight: 1.5,
              }}
            >
              {ex.medianNote}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const modeConfig: Record<string, { icon: React.ReactNode; label: string }> = {
    learn: { icon: <BookOpen size={14} />, label: "Learn" },
    practice: { icon: <Target size={14} />, label: "Practice" },
    real_world: { icon: <Globe size={14} />, label: "Real World" },
  };

  // ═══════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: `${config.width}px`,
        minHeight: `${config.height}px`,
        margin: "0 auto",
        fontFamily: "'Poppins',sans-serif",
        background: DS.white,
        borderRadius: DS.radiusLg,
        overflow: "hidden",
        boxShadow: DS.shadowLg,
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${DS.lightGray}`,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: `linear-gradient(135deg,${DS.gradientDark},${DS.indigo} 40%,${DS.gradientLight})`,
          backgroundSize: "200% 200%",
          animation: "gradientShift 8s ease infinite",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "17px",
              fontWeight: 800,
              color: DS.white,
              fontFamily: "'Poppins',sans-serif",
              letterSpacing: "0.3px",
            }}
          >
            Mean vs Median Patterns
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.75)",
              fontWeight: 500,
              marginTop: "3px",
            }}
          >
            Measures of Central Tendency • Grade 7
          </div>
        </div>
        {config.showModeSelector && (
          <div
            style={{
              display: "flex",
              gap: "4px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: DS.radiusPill,
              padding: "4px",
              backdropFilter: "blur(8px)",
            }}
          >
            {config.enabledModes.map((mode) => {
              const mc = modeConfig[mode];
              const isA = selectedMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => switchMode(mode)}
                  onMouseEnter={() => setHoveredBtn(`m-${mode}`)}
                  onMouseLeave={() => setHoveredBtn(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 16px",
                    borderRadius: DS.radiusPill,
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: isA ? 700 : 500,
                    background: isA ? DS.white : "transparent",
                    color: isA ? DS.indigo : "rgba(255,255,255,0.9)",
                    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                    transform:
                      hoveredBtn === `m-${mode}` && !isA
                        ? "scale(1.04)"
                        : "scale(1)",
                    fontFamily: "'Poppins',sans-serif",
                    boxShadow: isA ? DS.shadowSm : "none",
                  }}
                >
                  {mc?.icon}
                  {mc?.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* STEP BAR */}
      <div
        style={{
          padding: "12px 24px",
          background: `linear-gradient(90deg,${DS.offWhite},${DS.white})`,
          borderBottom: `1px solid ${DS.lightGray}`,
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg,${DS.indigo},${DS.gradientDark})`,
            color: DS.white,
            padding: "3px 12px",
            borderRadius: DS.radiusPill,
            fontSize: "10px",
            fontWeight: 700,
            whiteSpace: "nowrap",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          Step {currentStepIndex + 1}/{modeSteps.length}
        </div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: DS.textPrimary,
            fontFamily: "'Poppins',sans-serif",
            flex: 1,
          }}
        >
          {currentStep?.title}
        </div>
      </div>

      {/* DESCRIPTION */}
      <div
        key={`d-${currentStepIndex}-${selectedMode}`}
        style={{
          padding: "14px 24px",
          fontSize: "13px",
          color: DS.textSecondary,
          lineHeight: 1.65,
          background: DS.offWhite,
          borderBottom: `1px solid ${DS.lightGray}`,
          animation: "fadeIn 0.4s ease-out both",
          fontFamily: "'Poppins',sans-serif",
          fontWeight: 400,
        }}
      >
        {currentStep?.description}
      </div>

      {/* CONTENT */}
      <div
        key={`c-${selectedMode}`}
        style={{
          flex: 1,
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          overflowY: "auto",
        }}
      >
        {selectedMode === "learn" && renderLearn()}
        {selectedMode === "practice" && renderPractice()}
        {selectedMode === "real_world" && renderRealWorld()}
      </div>

      {/* TEACHING NOTE */}
      {selectedMode === "learn" && currentStep?.data?.scenarioIndex >= 0 && (
        <div
          key={`n-${currentStepIndex}`}
          style={{
            padding: "12px 24px",
            background: `linear-gradient(90deg,${DS.orangeLight},${DS.offWhite})`,
            borderTop: `1px solid ${DS.orange}25`,
            fontSize: "12px",
            color: "#92400E",
            fontStyle: "italic",
            animation: "fadeIn 0.5s ease-out 0.4s both",
            fontFamily: "'Poppins',sans-serif",
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          💡 <strong>Teaching Note:</strong>{" "}
          {toolConfig.scenarios[currentStep.data.scenarioIndex]?.teachingNote}
        </div>
      )}

      {/* NAVIGATION */}
      {config.showNavigation && (
        <div
          style={{
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${DS.lightGray}`,
            background: DS.offWhite,
          }}
        >
          <button
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            onMouseEnter={() => setHoveredBtn("prev")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "0 24px",
              height: "40px",
              borderRadius: DS.radiusPill,
              border: `2px solid ${DS.indigo}`,
              background:
                hoveredBtn === "prev" && currentStepIndex > 0
                  ? DS.indigoBg
                  : "transparent",
              color: DS.indigo,
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "'Poppins',sans-serif",
              cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",
              opacity: currentStepIndex === 0 ? 0.4 : 1,
              transition: "all 0.25s ease",
              transform:
                hoveredBtn === "prev" && currentStepIndex > 0
                  ? "scale(1.03)"
                  : "scale(1)",
            }}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>
            {modeSteps.map((_, i) => (
              <div
                key={i}
                onClick={() => {
                  setCurrentStepIndex(i);
                }}
                style={{
                  width: i === currentStepIndex ? "22px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background:
                    i === currentStepIndex
                      ? `linear-gradient(135deg,${DS.indigo},${DS.orange})`
                      : i < currentStepIndex
                        ? DS.indigoLight
                        : DS.lightGray,
                  transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={currentStepIndex === modeSteps.length - 1}
            onMouseEnter={() => setHoveredBtn("next")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "0 24px",
              height: "40px",
              borderRadius: DS.radiusPill,
              border: "none",
              background:
                currentStepIndex === modeSteps.length - 1
                  ? DS.lightGray
                  : hoveredBtn === "next"
                    ? `linear-gradient(135deg,${DS.gradientDark},${DS.indigo})`
                    : `linear-gradient(135deg,${DS.indigo},${DS.gradientDark})`,
              color:
                currentStepIndex === modeSteps.length - 1 ? DS.gray : DS.white,
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "'Poppins',sans-serif",
              cursor:
                currentStepIndex === modeSteps.length - 1
                  ? "not-allowed"
                  : "pointer",
              opacity: currentStepIndex === modeSteps.length - 1 ? 0.6 : 1,
              transition: "all 0.25s ease",
              transform:
                hoveredBtn === "next" && currentStepIndex < modeSteps.length - 1
                  ? "scale(1.03)"
                  : "scale(1)",
              boxShadow: hoveredBtn === "next" ? DS.shadowMd : "none",
            }}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MeanMedianPatternsTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
