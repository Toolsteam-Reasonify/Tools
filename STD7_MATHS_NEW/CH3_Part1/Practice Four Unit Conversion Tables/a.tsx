// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: unit_conversion_tables_tool.tsx
// ═══════════════════════════════════════════════════════════════════════════
// @ts-nocheck

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Check,
  X,
  RotateCcw,
  Award,
  BookOpen,
  Plus,
  ChevronRight,
} from "lucide-react";

// ==================== DESIGN SYSTEM TOKENS ====================

const DS = {
  colors: {
    primary: "#4A4DC9",
    primaryDark: "#533086",
    secondary: "#FF7212",
    secondaryDark: "#FC9145",
    primaryLight: "#C1C1EA",
    secondaryLight: "#FFF3E4",
    primaryBg: "#EEEEF8",
    secondaryBg: "#FFF8F0",
    text: "#4E4E4E",
    textLight: "#7A7A7A",
    textMuted: "#CACACA",
    border: "#EBEBEB",
    borderLight: "#F5F5F5",
    surface: "#FFFFFF",
    surfaceAlt: "#FAFAFE",
    success: "#34C759",
    successLight: "#EAFFF0",
    error: "#FF3B30",
    errorLight: "#FFF0EF",
    gradient: "linear-gradient(135deg, #533086 0%, #FC9145 100%)",
    gradientSubtle:
      "linear-gradient(135deg, #4A4DC9 0%, #7C5BCC 50%, #FC9145 100%)",
  },
  font: "'Poppins', 'Segoe UI', -apple-system, sans-serif",
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 100,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  shadow: {
    sm: "0 1px 3px rgba(74, 77, 201, 0.06)",
    md: "0 4px 16px rgba(74, 77, 201, 0.10)",
    lg: "0 8px 32px rgba(74, 77, 201, 0.12)",
    glow: "0 0 20px rgba(74, 77, 201, 0.15)",
  },
  button: {
    height: 40,
    paddingH: 24,
    paddingV: 8,
  },
};

// Table-specific header colors from the design system
const TABLE_THEMES = [
  {
    bg: "#4A4DC9",
    light: "#C1C1EA",
    veryLight: "#EEEEF8",
    text: "#FFFFFF",
    accent: "#4A4DC9",
  },
  {
    bg: "#533086",
    light: "#D4B8E8",
    veryLight: "#F3EDF8",
    text: "#FFFFFF",
    accent: "#533086",
  },
  {
    bg: "#FF7212",
    light: "#FFF3E4",
    veryLight: "#FFF8F0",
    text: "#FFFFFF",
    accent: "#FF7212",
  },
  {
    bg: "#FC9145",
    light: "#FFE0C4",
    veryLight: "#FFF5EB",
    text: "#FFFFFF",
    accent: "#FC9145",
  },
];

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

interface ConversionEntry {
  leftValue: string;
  rightValue: string;
  leftBlank: boolean;
  rightBlank: boolean;
  leftUnit: string;
  rightUnit: string;
}

interface ConversionTable {
  title: string;
  headerColor: string;
  headerTextColor: string;
  conversionFactor: string;
  leftUnitLabel: string;
  rightUnitLabel: string;
  entries: ConversionEntry[];
}

interface UnitConversionAdditionalProps {
  tables?: ConversionTable[];
  showFormulaSidebar?: boolean;
  showProgressBar?: boolean;
  title?: string;
  subtitle?: string;
}

interface UnitConversionToolProps {
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
    additionalProps?: UnitConversionAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

type UnitConversionToolPropsInput = NonNullable<UnitConversionToolProps["props"]>;

// ==================== EASING FUNCTIONS ====================

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

// ==================== DEFAULT DATA ====================

const DEFAULT_TABLES: ConversionTable[] = [
  {
    title: "Table 1: mm ↔ cm",
    headerColor: "#4A4DC9",
    headerTextColor: "#ffffff",
    conversionFactor: "÷ 10",
    leftUnitLabel: "mm",
    rightUnitLabel: "cm",
    entries: [
      {
        leftValue: "12",
        rightValue: "1.2",
        leftBlank: false,
        rightBlank: false,
        leftUnit: "mm",
        rightUnit: "cm",
      },
      {
        leftValue: "56",
        rightValue: "5.6",
        leftBlank: false,
        rightBlank: false,
        leftUnit: "mm",
        rightUnit: "cm",
      },
      {
        leftValue: "70",
        rightValue: "7",
        leftBlank: false,
        rightBlank: true,
        leftUnit: "mm",
        rightUnit: "cm",
      },
      {
        leftValue: "9",
        rightValue: "0.9",
        leftBlank: true,
        rightBlank: false,
        leftUnit: "mm",
        rightUnit: "cm",
      },
      {
        leftValue: "134",
        rightValue: "13.4",
        leftBlank: false,
        rightBlank: true,
        leftUnit: "mm",
        rightUnit: "cm",
      },
      {
        leftValue: "2036",
        rightValue: "203.6",
        leftBlank: true,
        rightBlank: false,
        leftUnit: "mm",
        rightUnit: "cm",
      },
    ],
  },
  {
    title: "Table 2: cm ↔ m",
    headerColor: "#533086",
    headerTextColor: "#ffffff",
    conversionFactor: "÷ 100",
    leftUnitLabel: "cm",
    rightUnitLabel: "m",
    entries: [
      {
        leftValue: "36",
        rightValue: "0.36",
        leftBlank: false,
        rightBlank: true,
        leftUnit: "cm",
        rightUnit: "m",
      },
      {
        leftValue: "50",
        rightValue: "0.5",
        leftBlank: false,
        rightBlank: true,
        leftUnit: "cm",
        rightUnit: "m",
      },
      {
        leftValue: "89",
        rightValue: "0.89",
        leftBlank: true,
        rightBlank: false,
        leftUnit: "cm",
        rightUnit: "m",
      },
      {
        leftValue: "4",
        rightValue: "0.04",
        leftBlank: false,
        rightBlank: true,
        leftUnit: "cm",
        rightUnit: "m",
      },
      {
        leftValue: "325",
        rightValue: "3.25",
        leftBlank: false,
        rightBlank: true,
        leftUnit: "cm",
        rightUnit: "m",
      },
      {
        leftValue: "207",
        rightValue: "2.07",
        leftBlank: true,
        rightBlank: false,
        leftUnit: "cm",
        rightUnit: "m",
      },
    ],
  },
  {
    title: "Table 3: g ↔ kg",
    headerColor: "#FF7212",
    headerTextColor: "#ffffff",
    conversionFactor: "÷ 1000",
    leftUnitLabel: "g",
    rightUnitLabel: "kg",
    entries: [
      {
        leftValue: "465",
        rightValue: "0.465",
        leftBlank: false,
        rightBlank: true,
        leftUnit: "g",
        rightUnit: "kg",
      },
      {
        leftValue: "68",
        rightValue: "0.068",
        leftBlank: false,
        rightBlank: true,
        leftUnit: "g",
        rightUnit: "kg",
      },
      {
        leftValue: "1560",
        rightValue: "1.56",
        leftBlank: false,
        rightBlank: true,
        leftUnit: "g",
        rightUnit: "kg",
      },
      {
        leftValue: "704",
        rightValue: "0.704",
        leftBlank: false,
        rightBlank: true,
        leftUnit: "g",
        rightUnit: "kg",
      },
      {
        leftValue: "560",
        rightValue: "0.56",
        leftBlank: true,
        rightBlank: false,
        leftUnit: "g",
        rightUnit: "kg",
      },
      {
        leftValue: "2500",
        rightValue: "2.5",
        leftBlank: true,
        rightBlank: false,
        leftUnit: "g",
        rightUnit: "kg",
      },
    ],
  },
  {
    title: "Table 4: Paise ↔ Rupees",
    headerColor: "#FC9145",
    headerTextColor: "#ffffff",
    conversionFactor: "÷ 100",
    leftUnitLabel: "p",
    rightUnitLabel: "₹",
    entries: [
      {
        leftValue: "10",
        rightValue: "0.10",
        leftBlank: false,
        rightBlank: true,
        leftUnit: "p",
        rightUnit: "₹",
      },
      {
        leftValue: "5",
        rightValue: "0.05",
        leftBlank: true,
        rightBlank: false,
        leftUnit: "p",
        rightUnit: "₹",
      },
      {
        leftValue: "36",
        rightValue: "0.36",
        leftBlank: true,
        rightBlank: false,
        leftUnit: "p",
        rightUnit: "₹",
      },
      {
        leftValue: "50",
        rightValue: "0.50",
        leftBlank: true,
        rightBlank: false,
        leftUnit: "p",
        rightUnit: "₹",
      },
      {
        leftValue: "99",
        rightValue: "0.99",
        leftBlank: false,
        rightBlank: true,
        leftUnit: "p",
        rightUnit: "₹",
      },
      {
        leftValue: "250",
        rightValue: "2.50",
        leftBlank: false,
        rightBlank: true,
        leftUnit: "p",
        rightUnit: "₹",
      },
    ],
  },
];

const FORMULAS = [
  {
    label: "1 cm = 10 mm",
    sublabel: "mm → cm: ÷ 10",
    color: "#4A4DC9",
    light: "#C1C1EA",
    icon: "📏",
  },
  {
    label: "1 m = 100 cm",
    sublabel: "cm → m: ÷ 100",
    color: "#533086",
    light: "#D4B8E8",
    icon: "📐",
  },
  {
    label: "1 kg = 1000 g",
    sublabel: "g → kg: ÷ 1000",
    color: "#FF7212",
    light: "#FFF3E4",
    icon: "⚖️",
  },
  {
    label: "₹1 = 100 paise",
    sublabel: "p → ₹: ÷ 100",
    color: "#FC9145",
    light: "#FFE0C4",
    icon: "💰",
  },
];

// ==================== KEYFRAMES ====================

const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes popIn {
    0% { transform: scale(0); opacity: 0; }
    60% { transform: scale(1.08); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.04); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    40% { transform: translateY(-12px); }
    60% { transform: translateY(-6px); }
  }
  @keyframes correctPop {
    0% { box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.5); transform: scale(1); }
    30% { transform: scale(1.04); }
    50% { box-shadow: 0 0 0 8px rgba(52, 199, 89, 0); }
    100% { box-shadow: 0 0 0 0 rgba(52, 199, 89, 0); transform: scale(1); }
  }
  @keyframes incorrectShake {
    0%, 100% { transform: translateX(0); }
    15% { transform: translateX(-5px); }
    30% { transform: translateX(5px); }
    45% { transform: translateX(-4px); }
    60% { transform: translateX(4px); }
    75% { transform: translateX(-2px); }
    90% { transform: translateX(2px); }
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes confettiFall {
    0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
    100% { transform: translateY(60px) rotate(540deg) scale(0); opacity: 0; }
  }
  @keyframes entrySlide {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: translateX(0); }
  }
`;

// ==================== COMPONENT ====================

const UnitConversionTablesTool: React.FC<UnitConversionToolProps> = ({
  props = {} as UnitConversionToolPropsInput,
  setStepDetails,
}) => {
  const additionalProps = (props.additionalProps ||
    {}) as UnitConversionAdditionalProps;
  const {
    tables = DEFAULT_TABLES,
    showFormulaSidebar = true,
    showProgressBar = true,
    title = "Practice: All Unit Conversion Tables",
    subtitle = "Complete all four tables using the correct conversion factor!",
  } = additionalProps;

  const width = props.width || 800;
  const height = props.height || 600;

  // State
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<
    Record<string, "correct" | "incorrect" | null>
  >({});
  const [mounted, setMounted] = useState(false);
  const [celebrateComplete, setCelebrateComplete] = useState(false);
  const [hoveredFormula, setHoveredFormula] = useState<number | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [hoveredReset, setHoveredReset] = useState(false);
  const [hoveredClose, setHoveredClose] = useState(false);
  const [activeTableHover, setActiveTableHover] = useState<number | null>(null);

  // Computed
  const totalBlanks = useMemo(() => {
    let count = 0;
    tables.forEach((table) => {
      table.entries.forEach((entry) => {
        if (entry.leftBlank) count++;
        if (entry.rightBlank) count++;
      });
    });
    return count;
  }, [tables]);

  const correctCount = useMemo(() => {
    return Object.values(feedback).filter((v) => v === "correct").length;
  }, [feedback]);

  // Inject keyframes + font
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.id = "unit-conv-ds-keyframes";
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    setTimeout(() => setMounted(true), 80);
    return () => {
      const existing = document.getElementById("unit-conv-ds-keyframes");
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  // Celebration trigger
  useEffect(() => {
    if (correctCount === totalBlanks && totalBlanks > 0) {
      setCelebrateComplete(true);
    }
  }, [correctCount, totalBlanks]);

  // Helpers
  const normalizeAnswer = (val: string): string => {
    const n = parseFloat(val);
    if (isNaN(n)) return val.trim().toLowerCase();
    return String(n);
  };

  const handleInputChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (feedback[key]) {
      setFeedback((prev) => ({ ...prev, [key]: null }));
    }
  };

  const checkAnswer = (key: string, correctValue: string) => {
    const userAnswer = normalizeAnswer(answers[key] || "");
    const expected = normalizeAnswer(correctValue);
    const isCorrect = userAnswer === expected;
    setFeedback((prev) => ({
      ...prev,
      [key]: isCorrect ? "correct" : "incorrect",
    }));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    key: string,
    correctValue: string,
  ) => {
    if (e.key === "Enter") {
      checkAnswer(key, correctValue);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setFeedback({});
    setCelebrateComplete(false);
  };

  // ==================== PROGRESS BAR ====================

  const renderProgressBar = () => {
    if (!showProgressBar) return null;
    const pct = totalBlanks > 0 ? (correctCount / totalBlanks) * 100 : 0;
    return (
      <div
        style={{
          width: "100%",
          padding: "0 0 4px 0",
          animation: mounted ? "fadeInUp 0.5s ease-out 0.2s both" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
            fontFamily: DS.font,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.65)",
              fontWeight: 500,
              letterSpacing: 0.4,
              textTransform: "uppercase",
            }}
          >
            Progress
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: pct === 100 ? "#7DFFB0" : "#FFFFFF",
              transition: "color 0.4s ease",
            }}
          >
            {correctCount} / {totalBlanks}
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: 8,
            borderRadius: DS.radius.pill,
            background: "rgba(255,255,255,0.15)",
            overflow: "hidden",
            position: "relative",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              borderRadius: DS.radius.pill,
              background:
                pct === 100
                  ? "linear-gradient(90deg, #34C759, #7DFFB0)"
                  : "linear-gradient(90deg, #FFFFFF, #C1C1EA)",
              transition:
                "width 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.4s ease",
              boxShadow: pct > 0 ? "0 0 12px rgba(255,255,255,0.25)" : "none",
            }}
          />
          {pct === 100 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.8s infinite",
              }}
            />
          )}
        </div>
      </div>
    );
  };

  // ==================== FORMULA SIDEBAR ====================

  const renderFormulaSidebar = () => {
    if (!showFormulaSidebar) return null;
    return (
      <div
        style={{
          width: 192,
          minWidth: 192,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          animation: mounted ? "slideInRight 0.6s ease-out 0.3s both" : "none",
          flexShrink: 0,
        }}
      >
        {/* Sidebar header card */}
        <div
          style={{
            background: DS.colors.surface,
            borderRadius: DS.radius.lg,
            padding: "16px 14px 14px",
            border: `1px solid ${DS.colors.border}`,
            boxShadow: DS.shadow.sm,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: DS.radius.sm,
                background: DS.colors.primaryBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={14} color={DS.colors.primary} strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontFamily: DS.font,
                fontWeight: 700,
                fontSize: 13,
                color: DS.colors.text,
                letterSpacing: -0.2,
              }}
            >
              Key Formulas
            </span>
          </div>

          {/* Formula cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FORMULAS.map((f, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredFormula(i)}
                onMouseLeave={() => setHoveredFormula(null)}
                style={{
                  padding: "10px 12px",
                  borderRadius: DS.radius.md,
                  background:
                    hoveredFormula === i
                      ? `${f.color}0D`
                      : DS.colors.surfaceAlt,
                  border: `1.5px solid ${hoveredFormula === i ? `${f.color}40` : DS.colors.border}`,
                  cursor: "default",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform:
                    hoveredFormula === i ? "translateX(-3px)" : "translateX(0)",
                  boxShadow:
                    hoveredFormula === i ? `3px 3px 0 0 ${f.color}18` : "none",
                  animation: mounted
                    ? `popIn 0.45s ease-out ${0.4 + i * 0.1}s both`
                    : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 3,
                  }}
                >
                  <span style={{ fontSize: 14, lineHeight: 1 }}>{f.icon}</span>
                  <span
                    style={{
                      fontFamily: DS.font,
                      fontWeight: 700,
                      fontSize: 12,
                      color: f.color,
                      letterSpacing: -0.1,
                    }}
                  >
                    {f.label}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: DS.font,
                    fontWeight: 500,
                    fontSize: 10,
                    color: DS.colors.textLight,
                    letterSpacing: 0.2,
                  }}
                >
                  {f.sublabel}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tip card */}
        <div
          style={{
            background: DS.colors.secondaryLight,
            borderRadius: DS.radius.md,
            padding: "12px 14px",
            border: `1.5px dashed ${DS.colors.secondary}40`,
            animation: mounted ? "fadeInUp 0.5s ease-out 0.8s both" : "none",
          }}
        >
          <div
            style={{
              fontFamily: DS.font,
              fontSize: 11,
              color: DS.colors.secondary,
              fontWeight: 600,
              lineHeight: 1.6,
            }}
          >
            💡 Moving the decimal point left = dividing by 10, 100, or 1000!
          </div>
        </div>
      </div>
    );
  };

  // ==================== INPUT CELL ====================

  const renderInputCell = (
    tableIdx: number,
    entryIdx: number,
    side: "left" | "right",
    correctValue: string,
    unit: string,
    themeAccent: string,
  ) => {
    const key = `${tableIdx}-${entryIdx}-${side}`;
    const fb = feedback[key];
    const isFocused = focusedInput === key;

    const borderColor =
      fb === "correct"
        ? DS.colors.success
        : fb === "incorrect"
          ? DS.colors.error
          : isFocused
            ? themeAccent
            : DS.colors.primaryLight;

    const bgColor =
      fb === "correct"
        ? DS.colors.successLight
        : fb === "incorrect"
          ? DS.colors.errorLight
          : isFocused
            ? `${themeAccent}08`
            : `${DS.colors.primaryLight}30`;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          animation:
            fb === "incorrect"
              ? "incorrectShake 0.45s ease"
              : fb === "correct"
                ? "correctPop 0.6s ease"
                : "none",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={answers[key] || ""}
            onChange={(e) => handleInputChange(key, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, key, correctValue)}
            onBlur={() => {
              if ((answers[key] || "").trim() !== "") {
                checkAnswer(key, correctValue);
              }
              setFocusedInput(null);
            }}
            onFocus={() => setFocusedInput(key)}
            placeholder="?"
            disabled={fb === "correct"}
            style={{
              width: 76,
              height: 38,
              borderRadius: DS.radius.sm,
              border: `2px solid ${borderColor}`,
              background: bgColor,
              textAlign: "center",
              fontFamily: DS.font,
              fontWeight: 600,
              fontSize: 14,
              color: fb === "correct" ? DS.colors.success : DS.colors.text,
              outline: "none",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: isFocused
                ? `0 0 0 3px ${themeAccent}15`
                : DS.shadow.sm,
              cursor: fb === "correct" ? "default" : "text",
            }}
          />
          {/* Feedback badges */}
          {fb === "correct" && (
            <div
              style={{
                position: "absolute",
                right: -7,
                top: -7,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: DS.colors.success,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "popIn 0.35s ease-out",
                boxShadow: `0 2px 8px ${DS.colors.success}50`,
              }}
            >
              <Check size={11} color="#fff" strokeWidth={3} />
            </div>
          )}
          {fb === "incorrect" && (
            <div
              style={{
                position: "absolute",
                right: -7,
                top: -7,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: DS.colors.error,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "popIn 0.35s ease-out",
                boxShadow: `0 2px 8px ${DS.colors.error}50`,
              }}
            >
              <X size={11} color="#fff" strokeWidth={3} />
            </div>
          )}
        </div>
        <span
          style={{
            fontFamily: DS.font,
            fontWeight: 600,
            fontSize: 12,
            color: DS.colors.textLight,
          }}
        >
          {unit}
        </span>
      </div>
    );
  };

  // ==================== GIVEN CELL ====================

  const renderGivenCell = (value: string, unit: string) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div
        style={{
          width: 76,
          height: 38,
          borderRadius: DS.radius.sm,
          border: `1.5px solid ${DS.colors.border}`,
          background: DS.colors.surface,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: DS.font,
          fontWeight: 600,
          fontSize: 14,
          color: DS.colors.text,
        }}
      >
        {value}
      </div>
      <span
        style={{
          fontFamily: DS.font,
          fontWeight: 600,
          fontSize: 12,
          color: DS.colors.textLight,
        }}
      >
        {unit}
      </span>
    </div>
  );

  // ==================== TABLE ====================

  const renderTable = (table: ConversionTable, tableIdx: number) => {
    const theme = TABLE_THEMES[tableIdx % TABLE_THEMES.length];
    const isHovered = activeTableHover === tableIdx;

    return (
      <div
        key={tableIdx}
        onMouseEnter={() => setActiveTableHover(tableIdx)}
        onMouseLeave={() => setActiveTableHover(null)}
        style={{
          borderRadius: DS.radius.lg,
          overflow: "hidden",
          border: `1.5px solid ${isHovered ? `${theme.accent}35` : DS.colors.border}`,
          boxShadow: isHovered ? `0 6px 24px ${theme.accent}12` : DS.shadow.sm,
          animation: mounted
            ? `fadeInUp 0.5s ease-out ${0.1 + tableIdx * 0.1}s both`
            : "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          background: DS.colors.surface,
        }}
      >
        {/* Table Header */}
        <div
          style={{
            background: table.headerColor,
            padding: "11px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative gradient overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "50%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.08))",
              pointerEvents: "none",
            }}
          />
          <span
            style={{
              fontFamily: DS.font,
              fontWeight: 700,
              fontSize: 13,
              color: table.headerTextColor,
              letterSpacing: 0.2,
              position: "relative",
              zIndex: 1,
            }}
          >
            {table.title}
          </span>
          <span
            style={{
              fontFamily: DS.font,
              fontWeight: 600,
              fontSize: 11,
              color: table.headerTextColor,
              background: "rgba(255,255,255,0.18)",
              padding: "4px 12px",
              borderRadius: DS.radius.pill,
              position: "relative",
              zIndex: 1,
              letterSpacing: 0.3,
            }}
          >
            Factor: {table.conversionFactor}
          </span>
        </div>

        {/* Column Headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 36px 1fr",
            padding: "9px 18px",
            background: theme.veryLight,
            borderBottom: `1px solid ${DS.colors.border}`,
          }}
        >
          <span
            style={{
              fontFamily: DS.font,
              fontWeight: 600,
              fontSize: 11,
              color: theme.accent,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {table.leftUnitLabel}
          </span>
          <span
            style={{
              fontFamily: DS.font,
              fontWeight: 700,
              fontSize: 13,
              color: DS.colors.textMuted,
              textAlign: "center",
            }}
          >
            =
          </span>
          <span
            style={{
              fontFamily: DS.font,
              fontWeight: 600,
              fontSize: 11,
              color: theme.accent,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {table.rightUnitLabel}
          </span>
        </div>

        {/* Rows */}
        {table.entries.map((entry, entryIdx) => {
          const isEven = entryIdx % 2 === 0;
          return (
            <div
              key={entryIdx}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 36px 1fr",
                padding: "9px 18px",
                alignItems: "center",
                background: isEven ? DS.colors.surface : DS.colors.surfaceAlt,
                borderBottom:
                  entryIdx < table.entries.length - 1
                    ? `1px solid ${DS.colors.borderLight}`
                    : "none",
                transition: "background 0.2s ease",
                animation: mounted
                  ? `entrySlide 0.4s ease-out ${0.2 + tableIdx * 0.1 + entryIdx * 0.04}s both`
                  : "none",
              }}
            >
              {entry.leftBlank
                ? renderInputCell(
                    tableIdx,
                    entryIdx,
                    "left",
                    entry.leftValue,
                    entry.leftUnit,
                    theme.accent,
                  )
                : renderGivenCell(entry.leftValue, entry.leftUnit)}
              <span
                style={{
                  fontFamily: DS.font,
                  fontWeight: 700,
                  fontSize: 15,
                  color: DS.colors.textMuted,
                  textAlign: "center",
                }}
              >
                =
              </span>
              {entry.rightBlank
                ? renderInputCell(
                    tableIdx,
                    entryIdx,
                    "right",
                    entry.rightValue,
                    entry.rightUnit,
                    theme.accent,
                  )
                : renderGivenCell(entry.rightValue, entry.rightUnit)}
            </div>
          );
        })}
      </div>
    );
  };

  // ==================== CELEBRATION ====================

  const renderCelebration = () => {
    if (!celebrateComplete) return null;

    const confettiColors = [
      DS.colors.primary,
      DS.colors.secondary,
      DS.colors.primaryLight,
      "#FFD700",
      "#7DFFB0",
    ];

    return (
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
          background: "rgba(83, 48, 134, 0.3)",
          backdropFilter: "blur(6px)",
          zIndex: 100,
          animation: "fadeInUp 0.35s ease-out",
          borderRadius: DS.radius.xl,
        }}
      >
        {/* Confetti particles */}
        {confettiColors.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "35%",
              left: `${20 + i * 15}%`,
              width: 8,
              height: 8,
              borderRadius: i % 2 === 0 ? "50%" : 2,
              background: c,
              animation: `confettiFall 1.2s ease-out ${i * 0.1}s both`,
              transform: `rotate(${i * 45}deg)`,
            }}
          />
        ))}

        <div
          style={{
            background: DS.colors.surface,
            borderRadius: DS.radius.xl,
            padding: "36px 44px",
            textAlign: "center",
            boxShadow: "0 25px 60px rgba(83, 48, 134, 0.25)",
            animation: "popIn 0.55s ease-out 0.1s both",
            maxWidth: 380,
            border: `2px solid ${DS.colors.primaryLight}`,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: DS.colors.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              animation: "bounce 1.2s ease infinite",
              boxShadow: `0 8px 24px ${DS.colors.primary}30`,
            }}
          >
            <Award size={32} color="#fff" strokeWidth={1.8} />
          </div>
          <h2
            style={{
              fontFamily: DS.font,
              fontWeight: 800,
              fontSize: 22,
              color: DS.colors.primaryDark,
              margin: "0 0 8px 0",
              letterSpacing: -0.5,
            }}
          >
            Excellent Work! 🎉
          </h2>
          <p
            style={{
              fontFamily: DS.font,
              fontSize: 13,
              color: DS.colors.textLight,
              margin: "0 0 24px 0",
              lineHeight: 1.7,
              fontWeight: 500,
            }}
          >
            You completed all {totalBlanks} conversions correctly!
            <br />
            You've mastered unit conversions!
          </p>
          {/* Contained pill button (design system style) */}
          <button
            onClick={() => setCelebrateComplete(false)}
            onMouseEnter={() => setHoveredClose(true)}
            onMouseLeave={() => setHoveredClose(false)}
            style={{
              height: DS.button.height,
              padding: `0 ${DS.button.paddingH}px`,
              borderRadius: DS.radius.pill,
              border: "none",
              background: hoveredClose
                ? DS.colors.secondary
                : DS.colors.primary,
              color: "#fff",
              fontFamily: DS.font,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: hoveredClose
                ? `0 6px 20px ${DS.colors.secondary}40`
                : `0 4px 14px ${DS.colors.primary}30`,
              transform: hoveredClose ? "scale(1.04)" : "scale(1)",
              letterSpacing: 0.3,
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  // ==================== MAIN RENDER ====================

  return (
    <div
      style={{
        width: "100%",
        maxWidth: width,
        minHeight: height,
        margin: "0 auto",
        fontFamily: DS.font,
        background: DS.colors.surface,
        borderRadius: DS.radius.xl,
        overflow: "hidden",
        boxShadow: DS.shadow.lg,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${DS.colors.border}`,
      }}
    >
      {/* ═══ HEADER ═══ */}
      <div
        style={{
          background: DS.colors.gradient,
          backgroundSize: "200% 200%",
          animation: "gradientShift 8s ease infinite",
          padding: "20px 24px 16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle dot pattern overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{ animation: mounted ? "fadeInUp 0.5s ease-out" : "none" }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: 19,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: -0.3,
                lineHeight: 1.35,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                margin: "5px 0 0 0",
                fontSize: 12,
                color: "rgba(255,255,255,0.7)",
                fontWeight: 500,
                letterSpacing: 0.2,
              }}
            >
              {subtitle}
            </p>
          </div>
          {/* Reset — Outlined pill button (DS style) */}
          <button
            onClick={handleReset}
            onMouseEnter={() => setHoveredReset(true)}
            onMouseLeave={() => setHoveredReset(false)}
            title="Reset all answers"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 34,
              padding: "0 16px",
              borderRadius: DS.radius.pill,
              border: "1.5px solid rgba(255,255,255,0.3)",
              background: hoveredReset
                ? "rgba(255,255,255,0.15)"
                : "rgba(255,255,255,0.06)",
              color: "#FFFFFF",
              cursor: "pointer",
              fontFamily: DS.font,
              fontWeight: 600,
              fontSize: 12,
              transition: "all 0.25s ease",
              flexShrink: 0,
              letterSpacing: 0.3,
              transform: hoveredReset ? "scale(1.03)" : "scale(1)",
              animation: mounted
                ? "fadeInDown 0.5s ease-out 0.1s both"
                : "none",
            }}
          >
            <RotateCcw size={13} strokeWidth={2.5} />
            Reset
          </button>
        </div>

        {/* Progress bar in header */}
        <div style={{ marginTop: 14, position: "relative", zIndex: 1 }}>
          {renderProgressBar()}
        </div>
      </div>

      {/* ═══ BODY ═══ */}
      <div
        style={{
          display: "flex",
          flex: 1,
          padding: DS.spacing.md,
          gap: DS.spacing.md,
          overflow: "auto",
          background: `linear-gradient(180deg, ${DS.colors.surfaceAlt} 0%, ${DS.colors.surface} 100%)`,
        }}
      >
        {/* Tables column */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minWidth: 0,
          }}
        >
          {tables.map((table, idx) => renderTable(table, idx))}
        </div>

        {/* Sidebar */}
        {renderFormulaSidebar()}
      </div>

      {/* ═══ CELEBRATION OVERLAY ═══ */}
      {renderCelebration()}
    </div>
  );
};

export default UnitConversionTablesTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
