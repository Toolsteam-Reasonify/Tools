// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: decimal_matching_tool.tsx
// ═══════════════════════════════════════════════════════════════════════════

// @ts-ignore - module resolved from workspace/parent
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  // @ts-ignore - react module from workspace/parent
} from "react";
import {
  Check,
  X,
  RotateCcw,
  Award,
  Plus,
  Zap,
  ArrowRight,
  // @ts-ignore - lucide-react module from workspace/parent
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

interface MatchItem {
  id: string;
  label: string;
}

interface NumberLineConfig {
  id: string;
  from: number;
  to: number;
  points: { label: string; value: number }[];
  label: string;
}

interface ComparisonPair {
  id: string;
  left: string;
  right: string;
  answer: string;
  reason: string;
}

interface DecimalMatchingAdditionalProps {
  numberLines?: NumberLineConfig[];
  pointLabels?: MatchItem[];
  pointValues?: MatchItem[];
  comparisonPairs?: MatchItem[];
  comparisonAnswers?: MatchItem[];
  correctPointMatches?: { [leftId: string]: string };
  correctComparisonMatches?: { [leftId: string]: string };
  themeColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    accentLight?: string;
    primaryLight?: string;
    secondaryLight?: string;
    correctGreen?: string;
    incorrectRed?: string;
    textDark?: string;
    textMuted?: string;
    disabled?: string;
    disabledBg?: string;
    surface?: string;
  };
}

interface DecimalMatchingToolProps {
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
    additionalProps?: DecimalMatchingAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== EASING FUNCTIONS ====================

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

// ==================== SINGULARITY DESIGN SYSTEM COLORS ====================

const DS = {
  primary: "#4A4DC9",
  secondary: "#FF7212",
  gradientStart: "#533086",
  gradientEnd: "#FC9145",
  primaryLight: "#C1C1EA",
  secondaryLight: "#FFF3E4",
  textDark: "#4E4E4E",
  textMuted: "#CACACA",
  disabled: "#EBEBEB",
  surface: "#F5F5F5",
  white: "#FFFFFF",
  correctGreen: "#22C55E",
  incorrectRed: "#EF4444",
  fontFamily: "'Poppins', sans-serif",
};

// ==================== DEFAULT DATA ====================

const DEFAULT_NUMBER_LINES: NumberLineConfig[] = [
  {
    id: "lineA",
    from: 8,
    to: 8.1,
    points: [
      { label: "d", value: 8.03 },
      { label: "e", value: 8.07 },
    ],
    label: "Line A",
  },
  {
    id: "lineB",
    from: 4.3,
    to: 4.8,
    points: [
      { label: "f", value: 4.4 },
      { label: "g", value: 4.55 },
      { label: "h", value: 4.7 },
    ],
    label: "Line B",
  },
];

const DEFAULT_POINT_LABELS: MatchItem[] = [
  { id: "pl_d", label: "Point d" },
  { id: "pl_e", label: "Point e" },
  { id: "pl_f", label: "Point f" },
  { id: "pl_g", label: "Point g" },
  { id: "pl_h", label: "Point h" },
];

const DEFAULT_POINT_VALUES: MatchItem[] = [
  { id: "pv_803", label: "8.03" },
  { id: "pv_807", label: "8.07" },
  { id: "pv_440", label: "4.40" },
  { id: "pv_455", label: "4.55" },
  { id: "pv_470", label: "4.70" },
];

const DEFAULT_COMPARISON_PAIRS: MatchItem[] = [
  { id: "cp_1", label: "1.23  vs  1.32" },
  { id: "cp_2", label: "3.81  vs  13.800" },
  { id: "cp_3", label: "1.009  vs  1.090" },
];

const DEFAULT_COMPARISON_ANSWERS: MatchItem[] = [
  { id: "ca_1", label: "1.32 is greater (tenths: 3 > 2)" },
  { id: "ca_2", label: "13.800 is greater (tens: 1 > 0)" },
  { id: "ca_3", label: "1.090 is greater (hundredths: 9 > 0)" },
];

const DEFAULT_CORRECT_POINT_MATCHES: { [key: string]: string } = {
  pl_d: "pv_803",
  pl_e: "pv_807",
  pl_f: "pv_440",
  pl_g: "pv_455",
  pl_h: "pv_470",
};

const DEFAULT_CORRECT_COMPARISON_MATCHES: { [key: string]: string } = {
  cp_1: "ca_1",
  cp_2: "ca_2",
  cp_3: "ca_3",
};

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ==================== MAIN COMPONENT ====================

type ResolvedProps = NonNullable<DecimalMatchingToolProps["props"]>;

const DecimalMatchingTool: React.FC<DecimalMatchingToolProps> = ({
  props: propsIn = {},
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const props = propsIn as ResolvedProps;
  const additionalProps = props.additionalProps || {};
  const width = props.width ?? 800;
  const height = props.height ?? 600;

  const colors = {
    primary: additionalProps.themeColors?.primary || DS.primary,
    secondary: additionalProps.themeColors?.secondary || DS.secondary,
    accent: additionalProps.themeColors?.accent || DS.gradientEnd,
    accentLight: additionalProps.themeColors?.accentLight || DS.secondaryLight,
    primaryLight: additionalProps.themeColors?.primaryLight || DS.primaryLight,
    correctGreen: additionalProps.themeColors?.correctGreen || DS.correctGreen,
    incorrectRed: additionalProps.themeColors?.incorrectRed || DS.incorrectRed,
    textDark: additionalProps.themeColors?.textDark || DS.textDark,
    textMuted: additionalProps.themeColors?.textMuted || DS.textMuted,
    disabled: additionalProps.themeColors?.disabled || DS.disabled,
    disabledBg: additionalProps.themeColors?.disabledBg || DS.surface,
    surface: additionalProps.themeColors?.surface || DS.surface,
  };

  const numberLines = additionalProps.numberLines || DEFAULT_NUMBER_LINES;
  const correctPointMatches =
    additionalProps.correctPointMatches || DEFAULT_CORRECT_POINT_MATCHES;
  const correctComparisonMatches =
    additionalProps.correctComparisonMatches ||
    DEFAULT_CORRECT_COMPARISON_MATCHES;

  const [shuffledPointLabels] = useState(() =>
    shuffleArray(additionalProps.pointLabels || DEFAULT_POINT_LABELS),
  );
  const [shuffledPointValues] = useState(() =>
    shuffleArray(additionalProps.pointValues || DEFAULT_POINT_VALUES),
  );
  const [shuffledComparisonPairs] = useState(() =>
    shuffleArray(additionalProps.comparisonPairs || DEFAULT_COMPARISON_PAIRS),
  );
  const [shuffledComparisonAnswers] = useState(() =>
    shuffleArray(
      additionalProps.comparisonAnswers || DEFAULT_COMPARISON_ANSWERS,
    ),
  );

  const [pointMatches, setPointMatches] = useState<{
    [leftId: string]: string;
  }>({});
  const [selectedPointLabel, setSelectedPointLabel] = useState<string | null>(
    null,
  );
  const [compMatches, setCompMatches] = useState<{ [leftId: string]: string }>(
    {},
  );
  const [selectedCompPair, setSelectedCompPair] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [pointResults, setPointResults] = useState<{
    [leftId: string]: boolean;
  }>({});
  const [compResults, setCompResults] = useState<{ [leftId: string]: boolean }>(
    {},
  );
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [pressedItem, setPressedItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Inject Poppins font + keyframes
  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    const keyframes = `
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes fadeInRight { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
            @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
            @keyframes confettiFall { 0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
            @keyframes glowGreen { 0%, 100% { box-shadow: 0 0 6px rgba(34, 197, 94, 0.2); } 50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.5); } }
            @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); } 20%, 40%, 60%, 80% { transform: translateX(3px); } }
            @keyframes slideDown { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes scaleIn { from { transform: scale(0.8) rotate(-3deg); opacity: 0; } to { transform: scale(1) rotate(0deg); opacity: 1; } }
            @keyframes gradientFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
            @keyframes pointBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        `;
    const styleSheet = document.createElement("style");
    styleSheet.id = "decimal-matching-singularity-kf";
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    return () => {
      const el = document.getElementById("decimal-matching-singularity-kf");
      if (el) document.head.removeChild(el);
    };
  }, []);

  // ==================== HANDLERS ====================

  const handlePointLabelClick = useCallback(
    (id: string) => {
      if (isChecked) return;
      setSelectedPointLabel((prev) => (prev === id ? null : id));
    },
    [isChecked],
  );

  const handlePointValueClick = useCallback(
    (id: string) => {
      if (isChecked || !selectedPointLabel) return;
      const newMatches = { ...pointMatches };
      for (const key of Object.keys(newMatches)) {
        if (newMatches[key] === id) delete newMatches[key];
      }
      newMatches[selectedPointLabel] = id;
      setPointMatches(newMatches);
      setSelectedPointLabel(null);
    },
    [isChecked, selectedPointLabel, pointMatches],
  );

  const handleCompPairClick = useCallback(
    (id: string) => {
      if (isChecked) return;
      setSelectedCompPair((prev) => (prev === id ? null : id));
    },
    [isChecked],
  );

  const handleCompAnswerClick = useCallback(
    (id: string) => {
      if (isChecked || !selectedCompPair) return;
      const newMatches = { ...compMatches };
      for (const key of Object.keys(newMatches)) {
        if (newMatches[key] === id) delete newMatches[key];
      }
      newMatches[selectedCompPair] = id;
      setCompMatches(newMatches);
      setSelectedCompPair(null);
    },
    [isChecked, selectedCompPair, compMatches],
  );

  const removePointMatch = useCallback(
    (leftId: string) => {
      if (isChecked) return;
      const n = { ...pointMatches };
      delete n[leftId];
      setPointMatches(n);
    },
    [isChecked, pointMatches],
  );

  const removeCompMatch = useCallback(
    (leftId: string) => {
      if (isChecked) return;
      const n = { ...compMatches };
      delete n[leftId];
      setCompMatches(n);
    },
    [isChecked, compMatches],
  );

  const handleCheck = useCallback(() => {
    const pR: { [k: string]: boolean } = {};
    let c = 0;
    for (const [l, r] of Object.entries(pointMatches)) {
      const ok = correctPointMatches[l] === r;
      pR[l] = ok;
      if (ok) c++;
    }
    const cR: { [k: string]: boolean } = {};
    for (const [l, r] of Object.entries(compMatches)) {
      const ok = correctComparisonMatches[l] === r;
      cR[l] = ok;
      if (ok) c++;
    }
    setPointResults(pR);
    setCompResults(cR);
    setScore(c);
    setIsChecked(true);
    if (
      c ===
      Object.keys(correctPointMatches).length +
        Object.keys(correctComparisonMatches).length
    ) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3500);
    }
  }, [
    pointMatches,
    compMatches,
    correctPointMatches,
    correctComparisonMatches,
  ]);

  const handleReset = useCallback(() => {
    setPointMatches({});
    setCompMatches({});
    setSelectedPointLabel(null);
    setSelectedCompPair(null);
    setIsChecked(false);
    setPointResults({});
    setCompResults({});
    setScore(0);
    setShowCelebration(false);
  }, []);

  const totalMatches =
    Object.keys(correctPointMatches).length +
    Object.keys(correctComparisonMatches).length;
  const currentMatches =
    Object.keys(pointMatches).length + Object.keys(compMatches).length;
  const allMatched = currentMatches === totalMatches;
  const isPointValueMatched = useCallback(
    (vid: string) => Object.values(pointMatches).includes(vid),
    [pointMatches],
  );
  const isCompAnswerMatched = useCallback(
    (aid: string) => Object.values(compMatches).includes(aid),
    [compMatches],
  );
  const getMatchedValueLabel = useCallback(
    (lid: string, m: { [k: string]: string }, items: MatchItem[]) => {
      const rid = m[lid];
      if (!rid) return null;
      return items.find((i) => i.id === rid)?.label || null;
    },
    [],
  );

  // ==================== RENDER NUMBER LINE ====================

  const renderNumberLine = useCallback(
    (config: NumberLineConfig, index: number) => {
      const svgWidth = Math.min(width - 64, 720);
      const svgHeight = 76;
      const padding = 44;
      const lineY = 40;
      const usableWidth = svgWidth - padding * 2;
      const range = config.to - config.from;
      const getX = (val: number) =>
        padding + ((val - config.from) / range) * usableWidth;

      let tickStep: number;
      if (range <= 0.2) tickStep = 0.01;
      else if (range <= 1) tickStep = 0.1;
      else tickStep = 0.5;

      const tickCount = Math.round(range / tickStep);
      const ticks: { x: number; value: number; isMajor: boolean }[] = [];
      for (let i = 0; i <= tickCount; i++) {
        const val = config.from + i * tickStep;
        if (val <= config.to + 0.0001) {
          const isMajor =
            range <= 0.2
              ? Math.abs(val * 10 - Math.round(val * 10)) < 0.001
              : Math.abs(val - Math.round(val)) < 0.001 ||
                Math.abs(val * 10 - Math.round(val * 10)) < 0.001;
          ticks.push({
            x: getX(val),
            value: parseFloat(val.toFixed(3)),
            isMajor,
          });
        }
      }

      return (
        <div
          key={config.id}
          style={{
            marginBottom: 8,
            animation: `fadeInUp 0.5s ease-out ${index * 0.15}s both`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                height: 24,
                borderRadius: 8,
                background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: DS.fontFamily,
              }}
            >
              {config.label.charAt(config.label.length - 1)}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: colors.textDark,
                fontFamily: DS.fontFamily,
              }}
            >
              {config.label}:{" "}
              <span style={{ color: colors.primary }}>{config.from}</span> to{" "}
              <span style={{ color: colors.primary }}>{config.to}</span>
            </span>
          </div>
          <svg width={svgWidth} height={svgHeight} style={{ display: "block" }}>
            <line
              x1={padding - 8}
              y1={lineY}
              x2={svgWidth - padding + 8}
              y2={lineY}
              stroke={colors.primary}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <polygon
              points={`${padding - 14},${lineY} ${padding - 4},${lineY - 5} ${padding - 4},${lineY + 5}`}
              fill={colors.primary}
            />
            <polygon
              points={`${svgWidth - padding + 14},${lineY} ${svgWidth - padding + 4},${lineY - 5} ${svgWidth - padding + 4},${lineY + 5}`}
              fill={colors.primary}
            />
            {ticks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={tick.x}
                  y1={lineY - (tick.isMajor ? 10 : 5)}
                  x2={tick.x}
                  y2={lineY + (tick.isMajor ? 10 : 5)}
                  stroke={colors.primary}
                  strokeWidth={tick.isMajor ? 2 : 1}
                  opacity={tick.isMajor ? 0.9 : 0.35}
                />
                {tick.isMajor && (
                  <text
                    x={tick.x}
                    y={lineY + 26}
                    textAnchor="middle"
                    fill={colors.textDark}
                    fontSize={10}
                    fontWeight={600}
                    fontFamily={DS.fontFamily}
                  >
                    {tick.value}
                  </text>
                )}
              </g>
            ))}
            {config.points.map((point, pi) => {
              const px = getX(point.value);
              return (
                <g key={point.label}>
                  <circle
                    cx={px}
                    cy={lineY}
                    r={10}
                    fill="none"
                    stroke={DS.secondary}
                    strokeWidth={1.5}
                    opacity={0.3}
                    style={{
                      animation: `pointBob 2s ease-in-out ${pi * 0.3}s infinite`,
                    }}
                  />
                  <circle
                    cx={px}
                    cy={lineY}
                    r={6}
                    fill={DS.secondary}
                    stroke="#fff"
                    strokeWidth={2.5}
                    style={{
                      animation: `popIn 0.4s ease-out ${0.3 + pi * 0.12}s both`,
                      filter: "drop-shadow(0 2px 4px rgba(255, 114, 18, 0.35))",
                    }}
                  />
                  <rect
                    x={px - 11}
                    y={lineY - 32}
                    width={22}
                    height={18}
                    rx={6}
                    fill={DS.secondary}
                    style={{
                      animation: `popIn 0.4s ease-out ${0.35 + pi * 0.12}s both`,
                    }}
                  />
                  <text
                    x={px}
                    y={lineY - 19}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={11}
                    fontWeight={700}
                    fontFamily={DS.fontFamily}
                    style={{
                      animation: `popIn 0.4s ease-out ${0.35 + pi * 0.12}s both`,
                    }}
                  >
                    {point.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      );
    },
    [width, colors],
  );

  // ==================== RENDER MATCH CHIP ====================

  const renderMatchChip = useCallback(
    (
      item: MatchItem,
      isLeft: boolean,
      isSelected: boolean,
      isMatched: boolean,
      matchResult: boolean | undefined,
      onClick: () => void,
      matchedLabel?: string | null,
      onRemoveMatch?: () => void,
      delay?: number,
    ) => {
      const hasResult = matchResult !== undefined;
      const isHovered = hoveredItem === item.id;
      const isPressed = pressedItem === item.id;

      let bgColor = DS.white;
      let borderColor = colors.primaryLight;
      let textColor = colors.primary;
      let shadowStyle = "0 2px 8px rgba(74, 77, 201, 0.08)";

      if (isSelected) {
        bgColor = DS.secondary;
        borderColor = DS.secondary;
        textColor = "#FFFFFF";
        shadowStyle = "0 4px 16px rgba(255, 114, 18, 0.3)";
      } else if (isMatched && !hasResult) {
        bgColor = DS.primaryLight + "33";
        borderColor = colors.primary;
        textColor = colors.primary;
        shadowStyle = "0 2px 10px rgba(74, 77, 201, 0.12)";
      } else if (isHovered && !isChecked) {
        bgColor = colors.primaryLight + "44";
        borderColor = colors.primary;
        shadowStyle = "0 4px 14px rgba(74, 77, 201, 0.15)";
      }

      if (hasResult) {
        if (matchResult) {
          bgColor = "#E8FFF0";
          borderColor = colors.correctGreen;
          textColor = "#166534";
          shadowStyle = "0 2px 12px rgba(34, 197, 94, 0.15)";
        } else {
          bgColor = "#FFF1F1";
          borderColor = colors.incorrectRed;
          textColor = "#991B1B";
          shadowStyle = "0 2px 12px rgba(239, 68, 68, 0.15)";
        }
      }

      return (
        <div
          key={item.id}
          onClick={onClick}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => {
            setHoveredItem(null);
            setPressedItem(null);
          }}
          onMouseDown={() => setPressedItem(item.id)}
          onMouseUp={() => setPressedItem(null)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 40,
            border: `2px solid ${borderColor}`,
            backgroundColor: bgColor,
            cursor: isChecked ? "default" : "pointer",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            transform:
              isPressed && !isChecked
                ? "scale(0.96)"
                : isHovered && !isChecked
                  ? "scale(1.03)"
                  : "scale(1)",
            boxShadow: shadowStyle,
            fontFamily: DS.fontFamily,
            fontSize: 13,
            fontWeight: 600,
            color: textColor,
            minWidth: isLeft ? 110 : 90,
            animation:
              hasResult && matchResult
                ? "glowGreen 1.5s ease-in-out infinite"
                : hasResult && !matchResult
                  ? "shake 0.5s ease-in-out"
                  : `${isLeft ? "fadeInLeft" : "fadeInRight"} 0.45s ease-out ${(delay || 0) * 0.07}s both`,
            position: "relative" as const,
            userSelect: "none" as const,
            letterSpacing: "0.01em",
          }}
        >
          {hasResult && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 22,
                height: 22,
                borderRadius: "50%",
                backgroundColor: matchResult
                  ? colors.correctGreen
                  : colors.incorrectRed,
                color: "#fff",
                flexShrink: 0,
                animation: "popIn 0.35s ease-out",
              }}
            >
              {matchResult ? (
                <Check size={13} strokeWidth={3} />
              ) : (
                <X size={13} strokeWidth={3} />
              )}
            </span>
          )}
          <span style={{ flex: 1 }}>{item.label}</span>
          {isMatched && !isChecked && isLeft && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onRemoveMatch?.();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                color: colors.incorrectRed,
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.2s ease",
              }}
            >
              <X size={11} strokeWidth={3} />
            </span>
          )}
          {isMatched && isLeft && matchedLabel && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                marginLeft: 2,
                whiteSpace: "nowrap" as const,
                opacity: 0.9,
                color: hasResult
                  ? matchResult
                    ? colors.correctGreen
                    : colors.incorrectRed
                  : isSelected
                    ? "#fff"
                    : colors.primary,
              }}
            >
              → {matchedLabel}
            </span>
          )}
        </div>
      );
    },
    [colors, isChecked, hoveredItem, pressedItem],
  );

  // ==================== SECTION BADGE ====================

  const SectionBadge: React.FC<{ num: number; title: string }> = ({
    num,
    title,
  }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 30,
          height: 30,
          borderRadius: 10,
          background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
          fontFamily: DS.fontFamily,
          boxShadow: "0 4px 12px rgba(83, 48, 134, 0.3)",
        }}
      >
        {num}
      </span>
      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: colors.textDark,
          margin: 0,
          fontFamily: DS.fontFamily,
        }}
      >
        {title}
      </h3>
    </div>
  );

  // ==================== RENDER ====================

  const totalPossible =
    Object.keys(correctPointMatches).length +
    Object.keys(correctComparisonMatches).length;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: width,
        minHeight: height,
        margin: "0 auto",
        fontFamily: DS.fontFamily,
        background: DS.white,
        borderRadius: 24,
        overflow: "hidden",
        boxShadow:
          "0 8px 40px rgba(74, 77, 201, 0.08), 0 1px 4px rgba(0,0,0,0.04)",
        position: "relative",
        border: `1px solid ${DS.disabled}`,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.gradientStart} 0%, ${DS.primary} 40%, ${DS.gradientEnd} 100%)`,
          backgroundSize: "200% 200%",
          animation: "gradientFlow 8s ease infinite",
          padding: "22px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative geometric shapes from DS */}
        <div
          style={{
            position: "absolute",
            top: -20,
            right: 60,
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.12)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -10,
            right: 180,
            width: 40,
            height: 40,
            borderRadius: 8,
            border: "2px solid rgba(255,255,255,0.08)",
            transform: "rotate(15deg)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderBottom: "20px solid rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              color: "#fff",
              fontSize: 17,
              fontWeight: 700,
              margin: 0,
              fontFamily: DS.fontFamily,
              letterSpacing: "-0.2px",
            }}
          >
            Locating, Comparing & Ordering Decimals
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 12,
              margin: "3px 0 0 0",
              fontWeight: 400,
              fontFamily: DS.fontFamily,
            }}
          >
            Match each labeled point to its decimal value. Calculate the value
            per division first!
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            position: "relative",
            zIndex: 1,
          }}
        >
          {isChecked && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                backgroundColor:
                  score === totalPossible
                    ? "rgba(34,197,94,0.9)"
                    : "rgba(255,255,255,0.2)",
                color: "#fff",
                padding: "7px 16px",
                borderRadius: 40,
                fontSize: 13,
                fontWeight: 700,
                animation: "popIn 0.4s ease-out",
                fontFamily: DS.fontFamily,
                backdropFilter: "blur(8px)",
              }}
            >
              <Award size={15} /> {score}/{totalPossible}
            </div>
          )}
          <button
            onClick={handleReset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 18px",
              borderRadius: 40,
              border: "2px solid rgba(255,255,255,0.4)",
              backgroundColor: "transparent",
              color: "#fff",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              transition: "all 0.25s ease",
              fontFamily: DS.fontFamily,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* BODY */}
      <div style={{ padding: "24px 28px 20px" }}>
        {/* SECTION 1 */}
        <div
          style={{
            marginBottom: 20,
            animation: "fadeInUp 0.5s ease-out 0.08s both",
          }}
        >
          <SectionBadge
            num={1}
            title="Match Number Line Points to Decimal Values"
          />
          <div
            style={{
              backgroundColor: DS.surface,
              borderRadius: 16,
              padding: "16px 20px 12px",
              border: `1.5px solid ${DS.disabled}`,
              marginBottom: 16,
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: colors.textMuted,
                margin: "0 0 6px 0",
                fontFamily: DS.fontFamily,
                fontWeight: 500,
              }}
            >
              💡 Count the divisions between labeled values to find what each
              small mark is worth.
            </p>
            {numberLines.map((nl, idx) => renderNumberLine(nl, idx))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 32px 1fr",
              gap: 12,
              alignItems: "start",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: DS.secondary,
                  textTransform: "uppercase" as const,
                  letterSpacing: "1.2px",
                  marginBottom: 2,
                  fontFamily: DS.fontFamily,
                }}
              >
                Point Labels
              </div>
              {shuffledPointLabels.map((item, idx) =>
                renderMatchChip(
                  item,
                  true,
                  selectedPointLabel === item.id,
                  !!pointMatches[item.id],
                  isChecked ? pointResults[item.id] : undefined,
                  () => handlePointLabelClick(item.id),
                  getMatchedValueLabel(
                    item.id,
                    pointMatches,
                    shuffledPointValues,
                  ),
                  () => removePointMatch(item.id),
                  idx,
                ),
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 28,
                gap: 38,
              }}
            >
              {shuffledPointLabels.map((_, i) => (
                <ArrowRight
                  key={i}
                  size={16}
                  color={DS.primaryLight}
                  strokeWidth={2.5}
                />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: colors.primary,
                  textTransform: "uppercase" as const,
                  letterSpacing: "1.2px",
                  marginBottom: 2,
                  fontFamily: DS.fontFamily,
                }}
              >
                Decimal Values
              </div>
              {shuffledPointValues.map((item, idx) =>
                renderMatchChip(
                  item,
                  false,
                  false,
                  isPointValueMatched(item.id),
                  undefined,
                  () => handlePointValueClick(item.id),
                  null,
                  undefined,
                  idx,
                ),
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 2,
            background: `linear-gradient(90deg, transparent, ${DS.primaryLight}, ${DS.secondaryLight}, transparent)`,
            margin: "4px 0 20px 0",
            borderRadius: 1,
          }}
        />

        {/* SECTION 2 */}
        <div style={{ animation: "fadeInUp 0.5s ease-out 0.2s both" }}>
          <SectionBadge
            num={2}
            title="Match Each Comparison to the Correct Answer"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 32px 1fr",
              gap: 12,
              alignItems: "start",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: DS.secondary,
                  textTransform: "uppercase" as const,
                  letterSpacing: "1.2px",
                  marginBottom: 2,
                  fontFamily: DS.fontFamily,
                }}
              >
                Comparison Pairs
              </div>
              {shuffledComparisonPairs.map((item, idx) =>
                renderMatchChip(
                  item,
                  true,
                  selectedCompPair === item.id,
                  !!compMatches[item.id],
                  isChecked ? compResults[item.id] : undefined,
                  () => handleCompPairClick(item.id),
                  getMatchedValueLabel(
                    item.id,
                    compMatches,
                    shuffledComparisonAnswers,
                  ),
                  () => removeCompMatch(item.id),
                  idx,
                ),
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 28,
                gap: 38,
              }}
            >
              {shuffledComparisonPairs.map((_, i) => (
                <ArrowRight
                  key={i}
                  size={16}
                  color={DS.primaryLight}
                  strokeWidth={2.5}
                />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: colors.primary,
                  textTransform: "uppercase" as const,
                  letterSpacing: "1.2px",
                  marginBottom: 2,
                  fontFamily: DS.fontFamily,
                }}
              >
                Answers
              </div>
              {shuffledComparisonAnswers.map((item, idx) =>
                renderMatchChip(
                  item,
                  false,
                  false,
                  isCompAnswerMatched(item.id),
                  undefined,
                  () => handleCompAnswerClick(item.id),
                  null,
                  undefined,
                  idx,
                ),
              )}
            </div>
          </div>
        </div>

        {/* PROGRESS + CHECK */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            animation: "fadeInUp 0.5s ease-out 0.35s both",
          }}
        >
          <div style={{ flex: 1, marginRight: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                fontWeight: 600,
                color: colors.textMuted,
                marginBottom: 6,
                fontFamily: DS.fontFamily,
              }}
            >
              <span>Progress</span>
              <span style={{ color: colors.primary }}>
                {currentMatches}/{totalMatches} matched
              </span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 40,
                backgroundColor: DS.disabled,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(currentMatches / totalMatches) * 100}%`,
                  borderRadius: 40,
                  background: allMatched
                    ? `linear-gradient(90deg, ${colors.correctGreen}, #10B981)`
                    : `linear-gradient(90deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
                  transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </div>
          </div>
          {!isChecked ? (
            <button
              onClick={handleCheck}
              disabled={!allMatched}
              onMouseEnter={(e) => {
                if (allMatched) {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.04)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 6px 20px rgba(83, 48, 134, 0.35)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  allMatched ? "0 4px 14px rgba(83, 48, 134, 0.25)" : "none";
              }}
              onMouseDown={(e) => {
                if (allMatched)
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(0.96)";
              }}
              onMouseUp={(e) => {
                if (allMatched)
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.04)";
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 28px",
                borderRadius: 40,
                border: "none",
                background: allMatched
                  ? `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`
                  : DS.disabled,
                color: allMatched ? "#fff" : colors.textMuted,
                fontSize: 14,
                fontWeight: 600,
                cursor: allMatched ? "pointer" : "not-allowed",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: allMatched
                  ? "0 4px 14px rgba(83, 48, 134, 0.25)"
                  : "none",
                fontFamily: DS.fontFamily,
                letterSpacing: "0.01em",
              }}
            >
              <Check size={17} strokeWidth={2.5} /> Check Answers
            </button>
          ) : (
            <div style={{ animation: "popIn 0.4s ease-out" }}>
              {score === totalPossible ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 24px",
                    borderRadius: 40,
                    background: `linear-gradient(135deg, ${colors.correctGreen}, #10B981)`,
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: DS.fontFamily,
                    boxShadow: "0 4px 16px rgba(34, 197, 94, 0.3)",
                  }}
                >
                  <Zap size={17} /> Perfect Score! 🎉
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 24px",
                    borderRadius: 40,
                    backgroundColor: DS.secondaryLight,
                    color: DS.secondary,
                    fontSize: 13,
                    fontWeight: 700,
                    border: `2px solid ${DS.secondary}44`,
                    fontFamily: DS.fontFamily,
                  }}
                >
                  Try Again — {score}/{totalPossible} correct
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selection hint */}
        {(selectedPointLabel || selectedCompPair) && !isChecked && (
          <div
            style={{
              marginTop: 12,
              padding: "10px 18px",
              borderRadius: 40,
              backgroundColor: DS.secondaryLight,
              border: `1.5px solid ${DS.secondary}33`,
              fontSize: 12,
              color: DS.secondary,
              fontWeight: 600,
              animation: "slideDown 0.25s ease-out",
              fontFamily: DS.fontFamily,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <ArrowRight size={14} /> Now click a value on the right to make the
            match!
          </div>
        )}
      </div>

      {/* CELEBRATION OVERLAY */}
      {showCelebration && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(83, 48, 134, 0.25)",
            backdropFilter: "blur(4px)",
            zIndex: 100,
            pointerEvents: "none",
            animation: "fadeInUp 0.25s ease-out",
          }}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 6 + Math.random() * 10,
                height: 6 + Math.random() * 10,
                borderRadius: Math.random() > 0.5 ? "50%" : "3px",
                backgroundColor: [
                  DS.primary,
                  DS.secondary,
                  DS.gradientEnd,
                  colors.correctGreen,
                  DS.primaryLight,
                  DS.gradientStart,
                ][Math.floor(Math.random() * 6)],
                left: `${Math.random() * 100}%`,
                animation: `confettiFall ${1.5 + Math.random() * 2}s ease-out ${Math.random() * 0.4}s both`,
              }}
            />
          ))}
          <div
            style={{
              backgroundColor: "#fff",
              padding: "28px 44px",
              borderRadius: 24,
              boxShadow: "0 24px 60px rgba(83, 48, 134, 0.25)",
              animation: "scaleIn 0.45s ease-out",
              textAlign: "center" as const,
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 8 }}>🏆</div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: DS.fontFamily,
              }}
            >
              Excellent Work!
            </div>
            <div
              style={{
                fontSize: 13,
                color: colors.textMuted,
                marginTop: 4,
                fontFamily: DS.fontFamily,
                fontWeight: 500,
              }}
            >
              All matches are correct!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecimalMatchingTool;
