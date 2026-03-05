// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: median_finding_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

// @ts-ignore - React types resolved by project/bundler
import React, { useState, useEffect, useCallback, useMemo } from "react";
// @ts-ignore - lucide-react types resolved by project/bundler
import { ChevronLeft, ChevronRight, RotateCcw, Plus } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "real_world";

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
  teachingNote: string;
  type: "intro" | "explanation" | "practice" | "real_world";
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface MedianAdditionalProps {
  datasets?: {
    label: string;
    values: number[];
    unit?: string;
    outlierIndex?: number;
    highlightColor?: string;
  }[];
  showNumberLine?: boolean;
  showComparison?: boolean;
  comparisonMetrics?: ("mean" | "median")[];
}

interface MedianFindingToolProps {
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
    additionalProps?: MedianAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

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

// ==================== SINGULARITY DESIGN SYSTEM ====================

const DS = {
  // Primary palette
  indigo: "#4A4DC9",
  indigoHover: "#3a3db5",
  indigoPressed: "#533086",
  indigoLight: "#C1C1EA",
  indigoTint: "#EEEEF8",

  // Accent palette
  orange: "#FF7212",
  orangeHover: "#FC9145",
  orangeLight: "#FFF3E4",
  orangeGradientStart: "#533086",
  orangeGradientEnd: "#FC9145",

  // Grays
  gray900: "#4E4E4E",
  gray400: "#CACACA",
  gray200: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",

  // Semantic
  success: "#2ECC71",
  successLight: "#E8F8F0",
  danger: "#FF7212",
  dangerLight: "#FFF3E4",

  // Typography
  font: "'Poppins', sans-serif",

  // Radii
  radiusPill: "100px",
  radiusCard: "16px",
  radiusSmall: "10px",
  radiusTag: "8px",

  // Shadows
  shadowCard: "0 4px 24px rgba(74, 77, 201, 0.08)",
  shadowElevated: "0 12px 40px rgba(74, 77, 201, 0.14)",
  shadowButton: "0 4px 16px rgba(74, 77, 201, 0.20)",

  // Gradients
  gradientPrimary:
    "linear-gradient(135deg, #533086 0%, #4A4DC9 40%, #FC9145 100%)",
  gradientHeader:
    "linear-gradient(135deg, #4A4DC9 0%, #533086 60%, #FC9145 100%)",
  gradientAccent: "linear-gradient(135deg, #FF7212 0%, #FC9145 100%)",
  gradientSubtle: "linear-gradient(135deg, #EEEEF8 0%, #FFF3E4 100%)",
};

// ==================== DATA ====================

const POOVIZHI_DATA = {
  label: "Poovizhi's Family",
  values: [170, 173, 165, 118, 175],
  unit: "cm",
  outlierIndex: 3,
  names: ["Mother", "Father", "Sister", "Young Child", "Brother"],
};

const YAANGBA_DATA = {
  label: "Yaangba's Family",
  values: [169, 173, 155, 165, 160, 164],
  unit: "cm",
  names: [
    "Member 1",
    "Member 2",
    "Member 3",
    "Member 4",
    "Member 5",
    "Member 6",
  ],
};

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Meet the Families",
    description:
      "We have the heights of two Indian families. Let's see if the mean (average) tells us the full story, or if there's a better way to find a 'typical' height.",
    teachingNote:
      "Remind the student that the mean of Poovizhi's family (160.2 cm) seems too low — most members are much taller!",
    type: "intro",
    mode: "learn",
    data: { phase: "raw" },
  },
  {
    id: 2,
    title: "Step 1 — The Raw Data",
    description:
      "Here are the heights of Poovizhi's family members. Notice anything unusual? One value (118 cm) is much lower than the rest — that's a young child!",
    teachingNote:
      "At Step 1 (raw data), remind the student that the mean of 160.2 seems too low — it's less than the heights of 4 out of 5 members.",
    type: "explanation",
    mode: "learn",
    data: { phase: "raw", dataset: "poovizhi" },
  },
  {
    id: 3,
    title: "Step 2 — Sort the Data",
    description:
      "To find the median, we first arrange the values from smallest to largest. Try to sort them in your head before the animation reveals the answer!",
    teachingNote:
      "Ask the student to arrange the values themselves before revealing. Sorting is the essential first step.",
    type: "explanation",
    mode: "learn",
    data: { phase: "sort", dataset: "poovizhi" },
  },
  {
    id: 4,
    title: "Step 3 — Count the Values",
    description:
      "How many values do we have? Poovizhi's family has 5 members. Since 5 is ODD, there will be exactly one middle value.",
    teachingNote:
      "Teach the formula: middle position = (n+1)/2 for odd n. Here, (5+1)/2 = 3rd position.",
    type: "explanation",
    mode: "learn",
    data: { phase: "count", dataset: "poovizhi" },
  },
  {
    id: 5,
    title: "Step 4 — Find the Middle!",
    description:
      "The 3rd value in the sorted list is 170 cm. That's our median! Notice how 170 is much closer to most family members' heights than the mean (160.2).",
    teachingNote:
      "Highlight that 170 is closer to most values than 160.2. The median 'ignores' the extreme value of the young child.",
    type: "explanation",
    mode: "learn",
    data: { phase: "pick", dataset: "poovizhi" },
  },
  {
    id: 6,
    title: "Step 5 — Now, Yaangba's Family",
    description:
      "Yaangba's family has 6 members. Since 6 is EVEN, there's no single middle value — we'll need to average the two middle values.",
    teachingNote:
      "For even data, explain why we average the two middle values. Middle positions are at n/2 and n/2 + 1.",
    type: "explanation",
    mode: "learn",
    data: { phase: "raw", dataset: "yaangba" },
  },
  {
    id: 7,
    title: "Step 6 — Sort & Find (Even Count)",
    description:
      "Sorted: 155, 160, 164, 165, 169, 173. The two middle values are 164 and 165. Their average = (164 + 165) ÷ 2 = 164.5 cm.",
    teachingNote:
      "Show the averaging animation for the two middle values. Position 3 and 4 in a 6-item list.",
    type: "explanation",
    mode: "learn",
    data: { phase: "sort_and_pick", dataset: "yaangba" },
  },
  {
    id: 8,
    title: "Step 7 — Compare Mean vs Median",
    description:
      "Look at the comparison table! For Poovizhi's family (with outlier), mean and median differ a lot. For Yaangba's family (no outlier), they're very close. Which measure would you trust more for Poovizhi's family?",
    teachingNote:
      "Create a simple table and ask: 'Which measure would you trust more for Poovizhi's family?' The median is more resistant to outliers.",
    type: "explanation",
    mode: "learn",
    data: { phase: "compare" },
  },
];

// ==================== KEYFRAMES ====================

const keyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(28px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-18px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes popIn {
        0% { transform: scale(0); opacity: 0; }
        60% { transform: scale(1.12); }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes pulseIndigo {
        0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(74, 77, 201, 0.35); }
        50% { transform: scale(1.06); box-shadow: 0 0 18px 6px rgba(74, 77, 201, 0.18); }
    }
    @keyframes pulseSuccess {
        0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.35); }
        50% { transform: scale(1.06); box-shadow: 0 0 18px 6px rgba(46, 204, 113, 0.18); }
    }
    @keyframes glowMedian {
        0%, 100% { box-shadow: 0 0 8px rgba(74, 77, 201, 0.2), 0 0 0 3px rgba(74, 77, 201, 0.1); }
        50% { box-shadow: 0 0 24px rgba(74, 77, 201, 0.4), 0 0 0 6px rgba(74, 77, 201, 0.15), 0 0 48px rgba(252, 145, 69, 0.15); }
    }
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-50px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
    }
    @keyframes countBadge {
        0% { transform: scale(0) rotate(-8deg); opacity: 0; }
        60% { transform: scale(1.15) rotate(2deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes tableSlideIn {
        from { opacity: 0; transform: translateY(36px) scale(0.96); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes numberLineGrow {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
    }
    @keyframes shimmerGradient {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
    }
    @keyframes ringPulse {
        0% { transform: scale(0.8); opacity: 0; }
        50% { opacity: 0.4; }
        100% { transform: scale(2.2); opacity: 0; }
    }
    @keyframes sortArrow {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-4px) scale(1.15); }
    }
    @keyframes outlierWiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-3deg); }
        75% { transform: rotate(3deg); }
    }
`;

// ==================== MAIN COMPONENT ====================

const MedianFindingTool: React.FC<MedianFindingToolProps> = ({
  props = {} as NonNullable<MedianFindingToolProps["props"]>,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: props.initialMode ?? ("learn" as ModeType),
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: props.enabledModes ?? (["learn"] as ModeType[]),
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      initialStep: props.initialStep ?? 1,
      filterSteps: props.filterSteps ?? null,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration: props.autoPlayDuration ?? 0,
      themeColor: props.themeColor ?? DS.indigo,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const additionalProps = props.additionalProps || {};

  // ─── STATE ────────────────────────────────────────────────────────

  const allSteps = props.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(() => {
    if (config.filterSteps && config.filterSteps.length > 0) {
      return allSteps.filter((s) => config.filterSteps!.includes(s.id));
    }
    return allSteps;
  }, [allSteps, config.filterSteps]);

  const [selectedMode, setSelectedMode] = useState<ModeType>(
    config.initialMode,
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSorted, setShowSorted] = useState(false);
  const [showCount, setShowCount] = useState(false);
  const [showMedianHighlight, setShowMedianHighlight] = useState(false);
  const [showAveraging, setShowAveraging] = useState(false);
  const [showComparisonTable, setShowComparisonTable] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const modeSteps = useMemo(() => {
    return availableSteps.filter((s) => s.mode === selectedMode);
  }, [availableSteps, selectedMode]);

  const currentStep = modeSteps[currentStepIndex] || modeSteps[0];

  // ─── COMPUTED DATA ────────────────────────────────────────────────

  const poovizhiSorted = useMemo(
    () => [...POOVIZHI_DATA.values].sort((a, b) => a - b),
    [],
  );
  const yaangbaSorted = useMemo(
    () => [...YAANGBA_DATA.values].sort((a, b) => a - b),
    [],
  );

  const poovizhiMean = useMemo(() => {
    const sum = POOVIZHI_DATA.values.reduce((a, b) => a + b, 0);
    return Number((sum / POOVIZHI_DATA.values.length).toFixed(1));
  }, []);

  const yaangbaMean = useMemo(() => {
    const sum = YAANGBA_DATA.values.reduce((a, b) => a + b, 0);
    return Number((sum / YAANGBA_DATA.values.length).toFixed(1));
  }, []);

  const poovizhiMedian = 170;
  const yaangbaMedian = 164.5;

  // ─── EFFECTS ──────────────────────────────────────────────────────

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.id = "median-tool-keyframes-v2";
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    return () => {
      const existing = document.getElementById("median-tool-keyframes-v2");
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  useEffect(() => {
    setShowSorted(false);
    setShowCount(false);
    setShowMedianHighlight(false);
    setShowAveraging(false);
    setShowComparisonTable(false);
    setTransitionKey((prev) => prev + 1);

    const step = currentStep;
    if (!step) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (step.data?.phase === "sort" || step.data?.phase === "sort_and_pick") {
      timers.push(setTimeout(() => setShowSorted(true), 800));
      if (step.data?.phase === "sort_and_pick") {
        timers.push(setTimeout(() => setShowCount(true), 1800));
        timers.push(setTimeout(() => setShowMedianHighlight(true), 2600));
        timers.push(setTimeout(() => setShowAveraging(true), 3200));
      }
    }
    if (step.data?.phase === "count") {
      timers.push(setTimeout(() => setShowSorted(true), 200));
      timers.push(setTimeout(() => setShowCount(true), 1000));
    }
    if (step.data?.phase === "pick") {
      timers.push(setTimeout(() => setShowSorted(true), 200));
      timers.push(setTimeout(() => setShowCount(true), 600));
      timers.push(setTimeout(() => setShowMedianHighlight(true), 1200));
    }
    if (step.data?.phase === "compare") {
      timers.push(setTimeout(() => setShowComparisonTable(true), 600));
    }

    return () => timers.forEach(clearTimeout);
  }, [currentStepIndex, selectedMode]);

  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: modeSteps.length,
        isPaused: !isPlaying,
        currentMode: selectedMode,
      });
    }
  }, [
    currentStepIndex,
    modeSteps.length,
    isPlaying,
    selectedMode,
    setStepDetails,
  ]);

  useEffect(() => {
    if (!isPlaying || config.autoPlayDuration <= 0) return;
    const timer = setTimeout(() => {
      if (currentStepIndex < modeSteps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, config.autoPlayDuration);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, config.autoPlayDuration, modeSteps.length]);

  // ─── NAVIGATION ───────────────────────────────────────────────────

  const goNext = useCallback(() => {
    if (currentStepIndex < modeSteps.length - 1)
      setCurrentStepIndex((prev) => prev + 1);
  }, [currentStepIndex, modeSteps.length]);

  const goPrev = useCallback(() => {
    if (currentStepIndex > 0) setCurrentStepIndex((prev) => prev - 1);
  }, [currentStepIndex]);

  const goToStep = useCallback(
    (index: number) => setCurrentStepIndex(index),
    [],
  );
  const resetTool = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  // ─── RENDER: DATA CARD ────────────────────────────────────────────

  const renderDataCard = (
    value: number,
    index: number,
    opts: {
      isOutlier?: boolean;
      isMedian?: boolean;
      showGlow?: boolean;
      delay?: number;
      label?: string;
    } = {},
  ) => {
    const { isOutlier, isMedian, delay = 0, showGlow, label } = opts;

    let bgColor = DS.white;
    let borderColor = DS.indigo;
    let textColor = DS.indigo;
    let anim = `popIn 0.5s ease-out ${delay}s both`;

    if (isOutlier) {
      bgColor = DS.orangeLight;
      borderColor = DS.orange;
      textColor = DS.orange;
    }
    if (isMedian && showGlow) {
      bgColor = DS.indigoTint;
      borderColor = DS.indigo;
      textColor = DS.indigo;
      anim = `glowMedian 2s ease-in-out infinite`;
    }

    return (
      <div
        key={`card-${value}-${index}-${transitionKey}`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "5px",
          animation: anim,
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: DS.radiusSmall,
            background: bgColor,
            border: `2.5px solid ${borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: DS.font,
            fontWeight: 700,
            fontSize: "17px",
            color: textColor,
            boxShadow:
              showGlow && isMedian ? `0 0 20px ${DS.indigo}30` : DS.shadowCard,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "default",
            position: "relative",
          }}
        >
          {value}
          {isOutlier && (
            <div
              style={{
                position: "absolute",
                top: "-9px",
                right: "-9px",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: DS.gradientAccent,
                color: DS.white,
                fontSize: "12px",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: `popIn 0.4s ease-out ${delay + 0.3}s both`,
                boxShadow: "0 2px 8px rgba(255, 114, 18, 0.3)",
              }}
            >
              !
            </div>
          )}
        </div>
        {label && (
          <span
            style={{
              fontFamily: DS.font,
              fontSize: "10px",
              color: DS.gray400,
              fontWeight: 500,
              maxWidth: "72px",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {label}
          </span>
        )}
      </div>
    );
  };

  // ─── RENDER: NUMBER LINE ──────────────────────────────────────────

  const renderNumberLine = (
    data: number[],
    mean: number,
    median: number,
    label: string,
    delay: number = 0,
  ) => {
    const minVal = Math.min(...data) - 5;
    const maxVal = Math.max(...data) + 5;
    const range = maxVal - minVal;
    const lineWidth = Math.min(config.width - 80, 620);

    const getPos = (v: number) => ((v - minVal) / range) * lineWidth;

    return (
      <div
        style={{
          animation: `fadeInUp 0.6s ease-out ${delay}s both`,
          marginTop: "14px",
        }}
      >
        {label && (
          <div
            style={{
              fontFamily: DS.font,
              fontSize: "11px",
              fontWeight: 600,
              color: DS.indigo,
              marginBottom: "10px",
              textAlign: "center",
              letterSpacing: "0.02em",
            }}
          >
            {label}
          </div>
        )}
        <div
          style={{
            position: "relative",
            height: "64px",
            marginLeft: "30px",
            width: lineWidth,
          }}
        >
          {/* Line */}
          <div
            style={{
              position: "absolute",
              top: "28px",
              left: 0,
              width: "100%",
              height: "3px",
              background: DS.indigoLight,
              borderRadius: "2px",
              transformOrigin: "left",
              animation: `numberLineGrow 0.8s ease-out ${delay}s both`,
            }}
          />

          {/* Ticks */}
          {[
            minVal,
            minVal + Math.round(range / 4),
            minVal + Math.round(range / 2),
            minVal + Math.round((3 * range) / 4),
            maxVal,
          ].map((tick, i) => (
            <div
              key={`tick-${tick}`}
              style={{
                position: "absolute",
                left: `${getPos(tick)}px`,
                top: "22px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                animation: `fadeIn 0.4s ease-out ${delay + 0.3 + i * 0.08}s both`,
              }}
            >
              <div
                style={{ width: "1px", height: "14px", background: DS.gray200 }}
              />
              <span
                style={{
                  fontFamily: DS.font,
                  fontSize: "9px",
                  color: DS.gray400,
                  marginTop: "2px",
                  fontWeight: 500,
                }}
              >
                {tick}
              </span>
            </div>
          ))}

          {/* Data dots */}
          {data.map((val, idx) => (
            <div
              key={`dot-${val}-${idx}`}
              style={{
                position: "absolute",
                left: `${getPos(val) - 5}px`,
                top: "22px",
                width: "11px",
                height: "11px",
                borderRadius: "50%",
                background:
                  val === Math.min(...data) && label.includes("Poovizhi")
                    ? DS.orange
                    : DS.indigo,
                border: `2px solid ${DS.white}`,
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                animation: `popIn 0.4s ease-out ${delay + 0.5 + idx * 0.07}s both`,
                zIndex: 2,
              }}
            />
          ))}

          {/* Mean marker */}
          <div
            style={{
              position: "absolute",
              left: `${getPos(mean) - 1}px`,
              top: "6px",
              width: "2px",
              height: "22px",
              background: DS.orange,
              animation: `fadeIn 0.4s ease-out ${delay + 1}s both`,
              zIndex: 3,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "-17px",
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: DS.font,
                fontSize: "8px",
                fontWeight: 700,
                color: DS.orange,
                whiteSpace: "nowrap",
                background: DS.orangeLight,
                padding: "1px 6px",
                borderRadius: DS.radiusTag,
              }}
            >
              Mean={mean}
            </span>
          </div>

          {/* Median marker */}
          <div
            style={{
              position: "absolute",
              left: `${getPos(median) - 1}px`,
              top: "6px",
              width: "2px",
              height: "22px",
              background: DS.indigo,
              animation: `fadeIn 0.4s ease-out ${delay + 1.2}s both`,
              zIndex: 3,
            }}
          >
            <span
              style={{
                position: "absolute",
                bottom: "-17px",
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: DS.font,
                fontSize: "8px",
                fontWeight: 700,
                color: DS.indigo,
                whiteSpace: "nowrap",
                background: DS.indigoTint,
                padding: "1px 6px",
                borderRadius: DS.radiusTag,
              }}
            >
              Median={median}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ─── RENDER: PILL BADGE ───────────────────────────────────────────

  const PillBadge = ({
    text,
    color,
    bg,
  }: {
    text: string;
    color: string;
    bg: string;
  }) => (
    <span
      style={{
        display: "inline-block",
        padding: "4px 14px",
        borderRadius: DS.radiusPill,
        background: bg,
        fontFamily: DS.font,
        fontSize: "12px",
        fontWeight: 600,
        color,
        letterSpacing: "0.01em",
      }}
    >
      {text}
    </span>
  );

  // ─── STEP RENDERERS ───────────────────────────────────────────────

  const renderIntro = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        animation: "fadeInUp 0.6s ease-out both",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Poovizhi card */}
        <div
          style={{
            background: DS.white,
            borderRadius: DS.radiusCard,
            padding: "20px",
            minWidth: "270px",
            border: `1.5px solid ${DS.indigoLight}`,
            boxShadow: DS.shadowCard,
            animation: "slideInLeft 0.6s ease-out 0.2s both",
          }}
        >
          <div
            style={{
              fontFamily: DS.font,
              fontSize: "15px",
              fontWeight: 700,
              color: DS.indigo,
              marginBottom: "14px",
              textAlign: "center",
            }}
          >
            Poovizhi's Family
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {POOVIZHI_DATA.values.map((v, i) =>
              renderDataCard(v, i, {
                isOutlier: i === POOVIZHI_DATA.outlierIndex,
                delay: 0.3 + i * 0.1,
                label: POOVIZHI_DATA.names[i],
              }),
            )}
          </div>
          <div
            style={{
              marginTop: "14px",
              textAlign: "center",
              animation: "fadeIn 0.5s ease-out 1.1s both",
            }}
          >
            <PillBadge
              text={`Mean = ${poovizhiMean} cm`}
              color={DS.orange}
              bg={DS.orangeLight}
            />
          </div>
        </div>

        {/* Yaangba card */}
        <div
          style={{
            background: DS.white,
            borderRadius: DS.radiusCard,
            padding: "20px",
            minWidth: "270px",
            border: `1.5px solid ${DS.indigoLight}`,
            boxShadow: DS.shadowCard,
            animation: "slideInRight 0.6s ease-out 0.4s both",
          }}
        >
          <div
            style={{
              fontFamily: DS.font,
              fontSize: "15px",
              fontWeight: 700,
              color: DS.indigo,
              marginBottom: "14px",
              textAlign: "center",
            }}
          >
            Yaangba's Family
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {YAANGBA_DATA.values.map((v, i) =>
              renderDataCard(v, i, {
                delay: 0.5 + i * 0.1,
                label: YAANGBA_DATA.names[i],
              }),
            )}
          </div>
          <div
            style={{
              marginTop: "14px",
              textAlign: "center",
              animation: "fadeIn 0.5s ease-out 1.5s both",
            }}
          >
            <PillBadge
              text={`Mean = ${yaangbaMean} cm`}
              color={DS.indigo}
              bg={DS.indigoTint}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPoovizhiRaw = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        animation: "fadeInUp 0.6s ease-out both",
      }}
    >
      <div
        style={{
          fontFamily: DS.font,
          fontSize: "16px",
          fontWeight: 700,
          color: DS.indigo,
          animation: "fadeInDown 0.5s ease-out 0.1s both",
        }}
      >
        Poovizhi's Family Heights
      </div>
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {POOVIZHI_DATA.values.map((v, i) =>
          renderDataCard(v, i, {
            isOutlier: i === POOVIZHI_DATA.outlierIndex,
            delay: 0.2 + i * 0.13,
            label: POOVIZHI_DATA.names[i],
          }),
        )}
      </div>
      <div
        style={{
          marginTop: "8px",
          padding: "12px 22px",
          background: DS.orangeLight,
          borderRadius: DS.radiusSmall,
          border: `1.5px solid ${DS.orangeHover}40`,
          fontFamily: DS.font,
          fontSize: "12px",
          color: DS.gray900,
          fontWeight: 500,
          animation: "fadeInUp 0.5s ease-out 1.2s both",
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        The young child's height (118 cm) is an{" "}
        <strong style={{ color: DS.orange, fontWeight: 700 }}>outlier</strong> —
        very different from the rest!
      </div>
      {renderNumberLine(
        POOVIZHI_DATA.values,
        poovizhiMean,
        poovizhiMedian,
        "",
        1.5,
      )}
    </div>
  );

  const renderPoovizhiSort = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        animation: "fadeInUp 0.5s ease-out both",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: DS.font,
            fontSize: "12px",
            fontWeight: 600,
            color: DS.gray400,
            marginBottom: "10px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Original order
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          {POOVIZHI_DATA.values.map((v, i) =>
            renderDataCard(v, i, {
              isOutlier: i === POOVIZHI_DATA.outlierIndex,
              delay: 0.1 + i * 0.08,
            }),
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          opacity: showSorted ? 1 : 0,
          transition: "opacity 0.4s ease",
          animation: showSorted ? "sortArrow 1.2s ease-in-out" : "none",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: DS.gradientPrimary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: DS.white,
            fontSize: "18px",
            boxShadow: DS.shadowButton,
          }}
        >
          ↓
        </div>
        <span
          style={{
            fontFamily: DS.font,
            fontSize: "13px",
            fontWeight: 600,
            color: DS.indigo,
          }}
        >
          Sort ascending
        </span>
      </div>

      {showSorted && (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: DS.font,
              fontSize: "12px",
              fontWeight: 600,
              color: DS.success,
              marginBottom: "10px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              animation: "fadeIn 0.4s ease-out both",
            }}
          >
            Sorted (ascending)
          </div>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            {poovizhiSorted.map((v, i) =>
              renderDataCard(v, i, {
                isOutlier: v === 118,
                delay: 0.1 + i * 0.13,
              }),
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderPoovizhiCount = () => {
    const sorted = poovizhiSorted;
    const n = sorted.length;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
          animation: "fadeInUp 0.5s ease-out both",
        }}
      >
        <div
          style={{
            fontFamily: DS.font,
            fontSize: "12px",
            fontWeight: 600,
            color: DS.gray400,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Sorted data
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {sorted.map((v, i) => (
            <div key={`count-${v}-${i}`} style={{ position: "relative" }}>
              {renderDataCard(v, i, {
                isOutlier: v === 118,
                delay: 0.05 + i * 0.05,
              })}
              <div
                style={{
                  position: "absolute",
                  bottom: "-22px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: DS.font,
                  fontSize: "10px",
                  fontWeight: 700,
                  color: DS.indigo,
                  animation: `fadeInUp 0.4s ease-out ${0.3 + i * 0.08}s both`,
                }}
              >
                #{i + 1}
              </div>
            </div>
          ))}

          {showCount && (
            <div
              style={{
                position: "absolute",
                top: "-42px",
                left: "50%",
                transform: "translateX(-50%)",
                background: DS.gradientHeader,
                color: DS.white,
                padding: "7px 20px",
                borderRadius: DS.radiusPill,
                fontFamily: DS.font,
                fontSize: "13px",
                fontWeight: 700,
                whiteSpace: "nowrap",
                animation: "countBadge 0.6s ease-out both",
                boxShadow: DS.shadowButton,
              }}
            >
              n = {n} (ODD) → Middle = position {Math.ceil(n / 2)}
            </div>
          )}
        </div>

        {showCount && (
          <div
            style={{
              marginTop: "14px",
              padding: "14px 24px",
              background: DS.indigoTint,
              borderRadius: DS.radiusSmall,
              border: `1.5px solid ${DS.indigoLight}`,
              fontFamily: DS.font,
              fontSize: "13px",
              color: DS.gray900,
              fontWeight: 500,
              animation: "fadeInUp 0.5s ease-out 0.3s both",
              textAlign: "center",
            }}
          >
            Formula: Middle position = (n + 1) ÷ 2 = ({n} + 1) ÷ 2 ={" "}
            <strong style={{ color: DS.indigo, fontWeight: 700 }}>
              position {(n + 1) / 2}
            </strong>
          </div>
        )}
      </div>
    );
  };

  const renderPoovizhiPick = () => {
    const sorted = poovizhiSorted;
    const medianIdx = 2;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          animation: "fadeInUp 0.5s ease-out both",
        }}
      >
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          {sorted.map((v, i) => (
            <div key={`pick-${v}-${i}`} style={{ position: "relative" }}>
              {renderDataCard(v, i, {
                isOutlier: v === 118,
                isMedian: i === medianIdx,
                showGlow: showMedianHighlight,
                delay: 0.05 + i * 0.05,
              })}
              <div
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: DS.font,
                  fontSize: "10px",
                  fontWeight: 700,
                  color:
                    i === medianIdx && showMedianHighlight
                      ? DS.indigo
                      : DS.gray400,
                }}
              >
                #{i + 1}
              </div>
            </div>
          ))}
        </div>

        {showMedianHighlight && (
          <>
            <div
              style={{
                padding: "12px 28px",
                background: DS.gradientHeader,
                borderRadius: DS.radiusPill,
                color: DS.white,
                fontFamily: DS.font,
                fontSize: "18px",
                fontWeight: 700,
                boxShadow: DS.shadowElevated,
                animation: "pulseIndigo 2.5s ease-in-out infinite",
                letterSpacing: "0.02em",
              }}
            >
              Median = 170 cm
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                justifyContent: "center",
                animation: "fadeInUp 0.5s ease-out 0.5s both",
              }}
            >
              <PillBadge
                text={`Mean = ${poovizhiMean} cm`}
                color={DS.orange}
                bg={DS.orangeLight}
              />
              <PillBadge
                text="Median = 170 cm ← closer to most values!"
                color={DS.indigo}
                bg={DS.indigoTint}
              />
            </div>

            {renderNumberLine(
              POOVIZHI_DATA.values,
              poovizhiMean,
              poovizhiMedian,
              "Poovizhi — Mean vs Median on Number Line",
              0.7,
            )}
          </>
        )}
      </div>
    );
  };

  const renderYaangbaRaw = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        animation: "fadeInUp 0.6s ease-out both",
      }}
    >
      <div
        style={{
          fontFamily: DS.font,
          fontSize: "16px",
          fontWeight: 700,
          color: DS.indigo,
          animation: "fadeInDown 0.5s ease-out 0.1s both",
        }}
      >
        Yaangba's Family Heights
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {YAANGBA_DATA.values.map((v, i) =>
          renderDataCard(v, i, { delay: 0.2 + i * 0.1 }),
        )}
      </div>
      <div
        style={{
          padding: "12px 22px",
          background: DS.indigoTint,
          borderRadius: DS.radiusSmall,
          border: `1.5px solid ${DS.indigoLight}`,
          fontFamily: DS.font,
          fontSize: "12px",
          color: DS.gray900,
          fontWeight: 500,
          animation: "fadeInUp 0.5s ease-out 1.1s both",
          textAlign: "center",
        }}
      >
        6 members → <strong style={{ color: DS.indigo }}>EVEN</strong> count!
        We'll need the average of two middle values.
      </div>
    </div>
  );

  const renderYaangbaSortAndPick = () => {
    const sorted = yaangbaSorted;
    const mid1 = 2;
    const mid2 = 3;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
          animation: "fadeInUp 0.5s ease-out both",
        }}
      >
        <div
          style={{
            fontFamily: DS.font,
            fontSize: "12px",
            fontWeight: 500,
            color: DS.gray400,
            textAlign: "center",
          }}
        >
          Original: {YAANGBA_DATA.values.join(", ")}
        </div>

        {showSorted && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: DS.font,
                fontSize: "12px",
                fontWeight: 600,
                color: DS.success,
                marginBottom: "8px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                animation: "fadeIn 0.4s ease-out both",
              }}
            >
              Sorted
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {sorted.map((v, i) => (
                <div key={`ysort-${v}-${i}`} style={{ position: "relative" }}>
                  {renderDataCard(v, i, {
                    isMedian: i === mid1 || i === mid2,
                    showGlow: showMedianHighlight && (i === mid1 || i === mid2),
                    delay: 0.1 + i * 0.1,
                  })}
                  {showCount && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontFamily: DS.font,
                        fontSize: "10px",
                        fontWeight: 700,
                        color:
                          i === mid1 || i === mid2 ? DS.indigo : DS.gray400,
                      }}
                    >
                      #{i + 1}
                    </div>
                  )}
                </div>
              ))}

              {showCount && (
                <div
                  style={{
                    position: "absolute",
                    top: "-38px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: DS.gradientHeader,
                    color: DS.white,
                    padding: "6px 16px",
                    borderRadius: DS.radiusPill,
                    fontFamily: DS.font,
                    fontSize: "12px",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    animation: "countBadge 0.6s ease-out both",
                    boxShadow: DS.shadowButton,
                  }}
                >
                  n = 6 (EVEN) → Middle = positions 3 & 4
                </div>
              )}
            </div>
          </div>
        )}

        {showAveraging && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              animation: "fadeInUp 0.5s ease-out both",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: DS.font,
                fontSize: "15px",
                fontWeight: 700,
                color: DS.gray900,
              }}
            >
              <span
                style={{
                  padding: "5px 14px",
                  background: DS.indigoTint,
                  borderRadius: DS.radiusSmall,
                  color: DS.indigo,
                  border: `1.5px solid ${DS.indigoLight}`,
                  animation: "pulseIndigo 2s ease-in-out infinite",
                }}
              >
                164
              </span>
              <span style={{ color: DS.gray400 }}>+</span>
              <span
                style={{
                  padding: "5px 14px",
                  background: DS.indigoTint,
                  borderRadius: DS.radiusSmall,
                  color: DS.indigo,
                  border: `1.5px solid ${DS.indigoLight}`,
                  animation: "pulseIndigo 2s ease-in-out infinite 0.3s",
                }}
              >
                165
              </span>
              <span style={{ color: DS.gray400 }}>÷ 2 =</span>
              <span
                style={{
                  padding: "8px 20px",
                  background: DS.gradientHeader,
                  borderRadius: DS.radiusPill,
                  color: DS.white,
                  fontFamily: DS.font,
                  fontSize: "17px",
                  fontWeight: 700,
                  animation: "popIn 0.5s ease-out 0.5s both",
                  boxShadow: DS.shadowElevated,
                }}
              >
                164.5
              </span>
            </div>
            <PillBadge
              text="Median of Yaangba's family = 164.5 cm"
              color={DS.indigo}
              bg={DS.indigoTint}
            />
          </div>
        )}

        {showAveraging &&
          renderNumberLine(
            YAANGBA_DATA.values,
            yaangbaMean,
            yaangbaMedian,
            "Yaangba — Mean & Median are close!",
            0.8,
          )}
      </div>
    );
  };

  const renderComparison = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "18px",
        animation: "fadeInUp 0.5s ease-out both",
      }}
    >
      {showComparisonTable && (
        <>
          <div
            style={{
              animation: "tableSlideIn 0.7s ease-out both",
              borderRadius: DS.radiusCard,
              overflow: "hidden",
              boxShadow: DS.shadowElevated,
              border: `1.5px solid ${DS.gray200}`,
              width: "100%",
              maxWidth: "520px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: DS.font,
              }}
            >
              <thead>
                <tr style={{ background: DS.gradientHeader }}>
                  <th
                    style={{
                      padding: "14px 16px",
                      color: DS.white,
                      fontSize: "12px",
                      fontWeight: 700,
                      textAlign: "left",
                      letterSpacing: "0.03em",
                    }}
                  >
                    Family
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      color: DS.white,
                      fontSize: "12px",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    Mean
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      color: DS.white,
                      fontSize: "12px",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    Median
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      color: DS.white,
                      fontSize: "12px",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    Gap
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  style={{
                    background: DS.orangeLight,
                    animation: "slideInRight 0.5s ease-out 0.3s both",
                  }}
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: 600,
                      fontSize: "13px",
                      color: DS.gray900,
                    }}
                  >
                    Poovizhi's
                    <span
                      style={{
                        marginLeft: "8px",
                        padding: "3px 10px",
                        background: DS.gradientAccent,
                        color: DS.white,
                        borderRadius: DS.radiusPill,
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      Outlier
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: "14px",
                      color: DS.orange,
                    }}
                  >
                    {poovizhiMean}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: "14px",
                      color: DS.indigo,
                    }}
                  >
                    {poovizhiMedian}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      textAlign: "center",
                      fontWeight: 800,
                      fontSize: "14px",
                      color: DS.orange,
                    }}
                  >
                    {(poovizhiMedian - poovizhiMean).toFixed(1)} cm
                  </td>
                </tr>
                <tr
                  style={{
                    background: DS.indigoTint,
                    animation: "slideInRight 0.5s ease-out 0.5s both",
                  }}
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: 600,
                      fontSize: "13px",
                      color: DS.gray900,
                    }}
                  >
                    Yaangba's
                    <span
                      style={{
                        marginLeft: "8px",
                        padding: "3px 10px",
                        background: DS.indigo,
                        color: DS.white,
                        borderRadius: DS.radiusPill,
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      No Outlier
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: "14px",
                      color: DS.orange,
                    }}
                  >
                    {yaangbaMean}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: "14px",
                      color: DS.indigo,
                    }}
                  >
                    {yaangbaMedian}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      textAlign: "center",
                      fontWeight: 800,
                      fontSize: "14px",
                      color: DS.success,
                    }}
                  >
                    {Math.abs(yaangbaMedian - yaangbaMean).toFixed(1)} cm
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            style={{
              padding: "16px 24px",
              background: DS.gradientSubtle,
              borderRadius: DS.radiusSmall,
              border: `1.5px solid ${DS.indigoLight}`,
              fontFamily: DS.font,
              fontSize: "13px",
              color: DS.gray900,
              fontWeight: 500,
              animation: "fadeInUp 0.5s ease-out 0.8s both",
              textAlign: "center",
              maxWidth: "520px",
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: DS.indigo }}>Key Insight:</strong> When data
            has an outlier, the median represents the 'typical' value better
            than the mean. The median is{" "}
            <strong style={{ color: DS.indigo }}>resistant to outliers</strong>!
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              justifyContent: "center",
              animation: "fadeInUp 0.5s ease-out 1s both",
            }}
          >
            {renderNumberLine(
              POOVIZHI_DATA.values,
              poovizhiMean,
              poovizhiMedian,
              "Poovizhi's Family",
              1.2,
            )}
            {renderNumberLine(
              YAANGBA_DATA.values,
              yaangbaMean,
              yaangbaMedian,
              "Yaangba's Family",
              1.4,
            )}
          </div>
        </>
      )}
    </div>
  );

  // ─── MAIN STEP RENDERER ───────────────────────────────────────────

  const renderStepContent = () => {
    if (!currentStep) return null;
    const phase = currentStep.data?.phase;
    const dataset = currentStep.data?.dataset;

    if (currentStep.id === 1) return renderIntro();
    if (phase === "raw" && dataset === "poovizhi") return renderPoovizhiRaw();
    if (phase === "sort" && dataset === "poovizhi") return renderPoovizhiSort();
    if (phase === "count" && dataset === "poovizhi")
      return renderPoovizhiCount();
    if (phase === "pick" && dataset === "poovizhi") return renderPoovizhiPick();
    if (phase === "raw" && dataset === "yaangba") return renderYaangbaRaw();
    if (phase === "sort_and_pick" && dataset === "yaangba")
      return renderYaangbaSortAndPick();
    if (phase === "compare") return renderComparison();
    return renderIntro();
  };

  // ─── MAIN RENDER ──────────────────────────────────────────────────

  const isNextDisabled = currentStepIndex >= modeSteps.length - 1;
  const isPrevDisabled = currentStepIndex === 0;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: `${config.width}px`,
        minHeight: `${config.height}px`,
        margin: "0 auto",
        fontFamily: DS.font,
        background: DS.gray100,
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: DS.shadowElevated,
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${DS.gray200}`,
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          background: DS.gradientHeader,
          padding: "22px 28px 18px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative geometric shapes from design system */}
        <div
          style={{
            position: "absolute",
            top: "-15px",
            right: "40px",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            border: `2px solid rgba(255,255,255,0.1)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10px",
            right: "90px",
            width: "40px",
            height: "40px",
            border: `2px solid rgba(255,255,255,0.08)`,
            transform: "rotate(45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: 0,
            height: 0,
            borderLeft: "18px solid transparent",
            borderRight: "18px solid transparent",
            borderBottom: "30px solid rgba(255,255,255,0.06)",
          }}
        />

        <div
          style={{
            fontFamily: DS.font,
            fontSize: "22px",
            fontWeight: 800,
            color: DS.white,
            marginBottom: "4px",
            animation: "fadeInDown 0.5s ease-out both",
            letterSpacing: "-0.01em",
          }}
        >
          Finding the Median
        </div>
        <div
          style={{
            fontFamily: DS.font,
            fontSize: "12px",
            color: "rgba(255,255,255,0.75)",
            fontWeight: 500,
            animation: "fadeIn 0.5s ease-out 0.2s both",
            letterSpacing: "0.02em",
          }}
        >
          Sorting Data & Finding the Middle — Grade 7 Mathematics
        </div>
      </div>

      {/* ── STEP INDICATOR ── */}
      {config.showStepIndicator && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "14px 28px",
            background: DS.white,
            borderBottom: `1px solid ${DS.gray200}`,
          }}
        >
          {modeSteps.map((_, i) => (
            <button
              key={`step-dot-${i}`}
              onClick={() => goToStep(i)}
              style={{
                width: i === currentStepIndex ? "30px" : "10px",
                height: "10px",
                borderRadius: DS.radiusPill,
                border: "none",
                background:
                  i === currentStepIndex
                    ? DS.gradientPrimary
                    : i < currentStepIndex
                      ? DS.indigoLight
                      : DS.gray200,
                cursor: "pointer",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: 0,
              }}
            />
          ))}
          <span
            style={{
              marginLeft: "auto",
              fontFamily: DS.font,
              fontSize: "11px",
              fontWeight: 600,
              color: DS.gray400,
            }}
          >
            Step {currentStepIndex + 1} of {modeSteps.length}
          </span>
        </div>
      )}

      {/* ── STEP TITLE + DESCRIPTION ── */}
      <div
        key={`desc-${currentStepIndex}`}
        style={{
          padding: "18px 28px 10px",
          animation: "fadeInUp 0.4s ease-out both",
          background: DS.white,
        }}
      >
        <div
          style={{
            fontFamily: DS.font,
            fontSize: "17px",
            fontWeight: 700,
            color: DS.indigo,
            marginBottom: "6px",
            letterSpacing: "-0.01em",
          }}
        >
          {currentStep?.title}
        </div>
        <div
          style={{
            fontFamily: DS.font,
            fontSize: "13px",
            color: DS.gray900,
            lineHeight: 1.65,
            fontWeight: 400,
          }}
        >
          {currentStep?.description}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div
        key={`content-${currentStepIndex}-${transitionKey}`}
        style={{
          flex: 1,
          padding: "14px 28px 18px",
          overflowY: "auto",
          overflowX: "hidden",
          background: DS.white,
        }}
      >
        {renderStepContent()}
      </div>

      {/* ── TEACHING NOTE ── */}
      {currentStep?.teachingNote && (
        <div
          style={{
            padding: "10px 28px",
            background: DS.orangeLight,
            borderTop: `1px solid ${DS.orangeHover}30`,
            fontFamily: DS.font,
            fontSize: "11px",
            color: DS.gray900,
            fontWeight: 500,
            animation: "fadeIn 0.4s ease-out 0.5s both",
            lineHeight: 1.5,
          }}
        >
          💡{" "}
          <em style={{ color: DS.orange, fontWeight: 600 }}>Teaching tip:</em>{" "}
          <em>{currentStep.teachingNote}</em>
        </div>
      )}

      {/* ── NAVIGATION ── */}
      {config.showNavigation && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 28px 18px",
            background: DS.white,
            borderTop: `1px solid ${DS.gray200}`,
          }}
        >
          {/* Back — Outlined button style */}
          <button
            onClick={goPrev}
            disabled={isPrevDisabled}
            onMouseEnter={() => setHoveredBtn("prev")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "0 24px",
              height: "40px",
              borderRadius: DS.radiusPill,
              border: `2px solid ${isPrevDisabled ? DS.gray200 : hoveredBtn === "prev" ? DS.indigoHover : DS.indigo}`,
              background: DS.white,
              color: isPrevDisabled ? DS.gray400 : DS.indigo,
              fontFamily: DS.font,
              fontSize: "13px",
              fontWeight: 600,
              cursor: isPrevDisabled ? "not-allowed" : "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: isPrevDisabled ? 0.5 : 1,
              transform:
                hoveredBtn === "prev" && !isPrevDisabled
                  ? "scale(1.03)"
                  : "scale(1)",
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>

          {/* Reset */}
          <button
            onClick={resetTool}
            onMouseEnter={() => setHoveredBtn("reset")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              padding: "0",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: `2px solid ${DS.gray200}`,
              background: hoveredBtn === "reset" ? DS.gray100 : DS.white,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              color: DS.gray400,
            }}
          >
            <RotateCcw size={15} />
          </button>

          {/* Next — Contained button style */}
          <button
            onClick={goNext}
            disabled={isNextDisabled}
            onMouseEnter={() => setHoveredBtn("next")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "0 24px",
              height: "40px",
              borderRadius: DS.radiusPill,
              border: "none",
              background: isNextDisabled
                ? DS.gray200
                : hoveredBtn === "next"
                  ? DS.gradientAccent
                  : DS.gradientHeader,
              color: isNextDisabled ? DS.gray400 : DS.white,
              fontFamily: DS.font,
              fontSize: "13px",
              fontWeight: 600,
              cursor: isNextDisabled ? "not-allowed" : "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: isNextDisabled ? "none" : DS.shadowButton,
              transform:
                hoveredBtn === "next" && !isNextDisabled
                  ? "scale(1.03)"
                  : "scale(1)",
            }}
          >
            {isNextDisabled ? "Done!" : "Next"} <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div
        style={{
          padding: "10px 28px",
          background: DS.indigoTint,
          borderTop: `1px solid ${DS.indigoLight}`,
          fontFamily: DS.font,
          fontSize: "11px",
          color: DS.indigo,
          fontWeight: 500,
          textAlign: "center",
          letterSpacing: "0.01em",
        }}
      >
        👆 Tap <strong>Next</strong> to advance through each step. Try to
        predict what comes next!
      </div>
    </div>
  );
};

export default MedianFindingTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
