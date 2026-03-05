// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: simultaneous_division_method_tool.tsx
// ═══════════════════════════════════════════════════════════════════════════

// @ts-expect-error - React types resolved by host/bundler
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  X,
  BookOpen,
  Target,
  Star,
  Zap,
  Award,
// @ts-expect-error - lucide-react types resolved by host/bundler
} from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice";

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
  type: "intro" | "explanation" | "practice";
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface SimDivAdditionalProps {
  numberA?: number;
  numberB?: number;
  practiceNumberA?: number;
  practiceNumberB?: number;
}

interface SimDivToolProps {
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
    additionalProps?: SimDivAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

interface DivisionRow {
  divisor: number;
  quotientA: number;
  quotientB: number;
}

interface DecoShapeProps {
  shape: "circle" | "square" | "triangle";
  color: string;
  size?: number;
  style?: React.CSSProperties;
  filled?: boolean;
  opacity?: number;
}

interface SButtonProps {
  label: string;
  variant?: "contained" | "outlined" | "texted";
  color?: "primary" | "accent";
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  size?: "sm" | "md";
}

// ==================== DESIGN TOKENS ====================

const DS = {
  primary: "#4A4DC9",
  primaryDark: "#3638A0",
  primaryLight: "#C1C1EA",
  primaryMuted: "#E8E8F5",
  accent: "#FF7212",
  accentDark: "#D95E0A",
  accentLight: "#FFF3E4",
  accentMuted: "#FC9145",
  gradientStart: "#533086",
  gradientEnd: "#FC9145",
  white: "#FFFFFF",
  bg: "#F5F5F5",
  dark: "#1E1E2E",
  darkSoft: "#4E4E4E",
  grey: "#8A8A9A",
  medGrey: "#CACACA",
  lightGrey: "#EBEBEB",
  border: "#E0E0E8",
  success: "#2EAA6B",
  error: "#E04545",
} as const;

// ==================== HELPER: Simultaneous Division ====================

const computeDivisionSteps = (a: number, b: number): DivisionRow[] => {
  const rows: DivisionRow[] = [];
  let curA = a;
  let curB = b;
  let d = 2;
  while (d <= Math.min(curA, curB)) {
    if (curA % d === 0 && curB % d === 0) {
      rows.push({ divisor: d, quotientA: curA / d, quotientB: curB / d });
      curA = curA / d;
      curB = curB / d;
      d = 2;
    } else {
      d++;
    }
  }
  return rows;
};

const computeHCF = (rows: DivisionRow[]): number => {
  if (rows.length === 0) return 1;
  return rows.reduce((acc, r) => acc * r.divisor, 1);
};

const computeLCM = (a: number, b: number, rows: DivisionRow[]): number => {
  const hcf = computeHCF(rows);
  const lastA = rows.length > 0 ? rows[rows.length - 1].quotientA : a;
  const lastB = rows.length > 0 ? rows[rows.length - 1].quotientB : b;
  return hcf * lastA * lastB;
};

// ==================== KEYFRAMES ====================

const keyframes: string = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInLeft {
        from { opacity: 0; transform: translateX(-16px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeInRight {
        from { opacity: 0; transform: translateX(16px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-12px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes popIn {
        0% { transform: scale(0); opacity: 0; }
        60% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes celebrate {
        0% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.06) rotate(-2deg); }
        50% { transform: scale(1.1) rotate(2deg); }
        75% { transform: scale(1.06) rotate(-1deg); }
        100% { transform: scale(1) rotate(0deg); }
    }
    @keyframes rowSlideIn {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-6px) rotate(3deg); }
    }
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "The Division Table",
    description:
      "We'll find both HCF and LCM of 84 and 180 using a single procedure — the simultaneous division method! Watch the table grow row by row.",
    type: "intro",
    mode: "learn",
  },
  {
    id: 2,
    title: "Divide by 2",
    description:
      "Both 84 and 180 are even. Divide both by 2. We get 42 and 90. The divisor 2 goes in the left column.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 3,
    title: "Divide by 2 Again",
    description:
      "42 and 90 are still both even! Divide by 2 again: 21 and 45. Another 2 added to the left column.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 4,
    title: "Divide by 3",
    description:
      "21 and 45 are both divisible by 3. Divide to get 7 and 15. The 3 joins our left column.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 5,
    title: "Stop! No More Common Primes",
    description:
      "7 and 15 share no common prime factor (7 is prime, 15 = 3 × 5). We stop here. The bottom row is 7, 15.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 6,
    title: "Read Off the HCF",
    description:
      "The HCF is the product of all divisors in the left column: 2 × 2 × 3 = 12. These are exactly the common prime factors!",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 7,
    title: "Read Off the LCM",
    description:
      "The LCM is the product of ALL numbers on the left AND the bottom row: 2 × 2 × 3 × 7 × 15 = 1260. This captures every prime factor at its maximum count!",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 8,
    title: "Guna's Shortcut!",
    description:
      "Guna says: 'Why divide one prime at a time? I can divide by 12 directly!' For 84 and 180: divide by 12 → get 7 and 15. Same HCF (12), same LCM (12 × 7 × 15 = 1260). Fewer steps!",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 10,
    title: "Your Turn: 300 and 150",
    description:
      "Find both HCF and LCM of 300 and 150 using the simultaneous division method. Fill in the divisors!",
    type: "practice",
    mode: "practice",
  },
];

// ==================== DECORATIVE SHAPES ====================

const DecoShape: React.FC<DecoShapeProps> = ({
  shape,
  color,
  size = 24,
  style = {},
  filled = false,
  opacity = 0.5,
}) => {
  const s: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    opacity,
    pointerEvents: "none",
    ...style,
  };

  if (shape === "circle") {
    return (
      <div
        style={{
          ...s,
          borderRadius: "50%",
          border: filled ? "none" : `2px solid ${color}`,
          backgroundColor: filled ? color : "transparent",
        }}
      />
    );
  }
  if (shape === "square") {
    return (
      <div
        style={{
          ...s,
          borderRadius: 3,
          border: filled ? "none" : `2px solid ${color}`,
          backgroundColor: filled ? color : "transparent",
        }}
      />
    );
  }
  if (shape === "triangle") {
    return (
      <div
        style={{
          ...s,
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: filled
            ? `${size}px solid ${color}`
            : `${size}px solid transparent`,
          ...(filled
            ? {}
            : {
                borderBottom: `${size}px solid ${color}`,
                position: "absolute" as const,
              }),
        }}
      />
    );
  }
  return null;
};

// ==================== MAIN COMPONENT ====================

type PropsConfig = NonNullable<SimDivToolProps["props"]>;

const SimultaneousDivisionMethodTool: React.FC<SimDivToolProps> = ({
  props = {} as PropsConfig,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: (props.initialMode ?? "learn") as ModeType,
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: props.enabledModes ?? (["learn", "practice"] as ModeType[]),
      showNavigation: props.showNavigation ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration: props.autoPlayDuration ?? 0,
      themeColor: props.themeColor ?? DS.primary,
      darkMode: props.darkMode ?? false,
      initialStep: props.initialStep ?? 1,
      filterSteps: props.filterSteps ?? null,
    }),
    [props],
  );

  const additionalProps = props.additionalProps || {};
  const numberA: number = additionalProps.numberA ?? 84;
  const numberB: number = additionalProps.numberB ?? 180;
  const practiceA: number = additionalProps.practiceNumberA ?? 300;
  const practiceB: number = additionalProps.practiceNumberB ?? 150;

  const divRows = useMemo(
    () => computeDivisionSteps(numberA, numberB),
    [numberA, numberB],
  );
  const hcf = useMemo(() => computeHCF(divRows), [divRows]);
  const lcm = useMemo(
    () => computeLCM(numberA, numberB, divRows),
    [numberA, numberB, divRows],
  );
  const lastA: number =
    divRows.length > 0 ? divRows[divRows.length - 1].quotientA : numberA;
  const lastB: number =
    divRows.length > 0 ? divRows[divRows.length - 1].quotientB : numberB;

  const pDivRows = useMemo(
    () => computeDivisionSteps(practiceA, practiceB),
    [practiceA, practiceB],
  );
  const pHcf = useMemo(() => computeHCF(pDivRows), [pDivRows]);
  const pLcm = useMemo(
    () => computeLCM(practiceA, practiceB, pDivRows),
    [practiceA, practiceB, pDivRows],
  );
  const pLastA: number =
    pDivRows.length > 0 ? pDivRows[pDivRows.length - 1].quotientA : practiceA;
  const pLastB: number =
    pDivRows.length > 0 ? pDivRows[pDivRows.length - 1].quotientB : practiceB;

  const allSteps: StepDataInterface[] = props.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(() => {
    if (config.filterSteps && config.filterSteps.length > 0)
      return allSteps.filter((s) => config.filterSteps!.includes(s.id));
    return allSteps;
  }, [allSteps, config.filterSteps]);

  const [selectedMode, setSelectedMode] = useState<ModeType>(
    config.initialMode,
  );
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [animKey, setAnimKey] = useState<number>(0);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);
  const [practiceAnswers, setPracticeAnswers] = useState<
    Record<number, number>
  >({});
  const [practiceSubmitted, setPracticeSubmitted] = useState<boolean>(false);
  const [practiceCorrect, setPracticeCorrect] = useState<boolean>(false);

  const modeSteps = useMemo(
    () => availableSteps.filter((s) => s.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const currentStep: StepDataInterface =
    modeSteps[currentStepIndex] || modeSteps[0];

  useEffect(() => {
    const s = document.createElement("style");
    s.id = "simdiv-kf";
    s.textContent = keyframes;
    document.head.appendChild(s);
    return () => {
      const e = document.getElementById("simdiv-kf");
      if (e) document.head.removeChild(e);
    };
  }, []);

  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: modeSteps.length,
        isPaused: true,
        currentMode: selectedMode,
      });
  }, [currentStepIndex, modeSteps.length, selectedMode]);

  const goNext = useCallback((): void => {
    if (currentStepIndex < modeSteps.length - 1) {
      setCurrentStepIndex((p) => p + 1);
      setAnimKey((p) => p + 1);
    }
  }, [currentStepIndex, modeSteps.length]);

  const goPrev = useCallback((): void => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((p) => p - 1);
      setAnimKey((p) => p + 1);
    }
  }, [currentStepIndex]);

  const switchMode = useCallback((mode: ModeType): void => {
    setSelectedMode(mode);
    setCurrentStepIndex(0);
    setAnimKey((p) => p + 1);
    setPracticeAnswers({});
    setPracticeSubmitted(false);
  }, []);

  const resetPractice = useCallback((): void => {
    setPracticeAnswers({});
    setPracticeSubmitted(false);
    setPracticeCorrect(false);
  }, []);

  const visibleRowCount = useMemo((): number => {
    const sid = currentStep?.id;
    if (sid === 1) return 0;
    if (sid === 2) return 1;
    if (sid === 3) return 2;
    if (sid === 4) return 3;
    return divRows.length;
  }, [currentStep, divRows.length]);

  // ─── Singularity Button ───
  const SButton: React.FC<SButtonProps> = ({
    label,
    variant = "contained",
    color = "primary",
    onClick,
    disabled = false,
    icon,
    size = "md",
  }) => {
    const id = `btn-${label.replace(/\s/g, "")}`;
    const isHov = hoveredBtn === id;
    const isPress = pressedBtn === id;

    const colors =
      color === "primary"
        ? {
            base: DS.primary,
            hov: DS.primaryDark,
            light: DS.primaryLight,
            text: DS.white,
          }
        : {
            base: DS.accent,
            hov: DS.accentDark,
            light: DS.accentLight,
            text: DS.white,
          };

    const pad = size === "sm" ? "8px 20px" : "10px 24px";
    const fs = size === "sm" ? 12 : 13;
    const h = size === "sm" ? 34 : 40;

    let style: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: pad,
      height: h,
      borderRadius: 24,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
      fontSize: fs,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
      border: "none",
      outline: "none",
      userSelect: "none" as const,
      whiteSpace: "nowrap" as const,
      opacity: disabled ? 0.45 : 1,
      letterSpacing: 0.2,
    };

    if (variant === "contained") {
      style = {
        ...style,
        backgroundColor: disabled
          ? DS.medGrey
          : isPress
            ? colors.hov
            : isHov
              ? colors.hov
              : colors.base,
        color: disabled ? DS.white : colors.text,
        boxShadow: disabled
          ? "none"
          : isHov
            ? `0 6px 20px ${colors.base}30`
            : `0 2px 8px ${colors.base}20`,
        transform: isPress
          ? "scale(0.96)"
          : isHov
            ? "translateY(-1px)"
            : "none",
      };
    } else if (variant === "outlined") {
      style = {
        ...style,
        backgroundColor: disabled
          ? DS.bg
          : isPress
            ? colors.light
            : isHov
              ? colors.light
              : "transparent",
        color: disabled ? DS.medGrey : colors.base,
        border: `2px solid ${disabled ? DS.lightGrey : colors.base}`,
        transform: isPress
          ? "scale(0.96)"
          : isHov
            ? "translateY(-1px)"
            : "none",
      };
    } else {
      style = {
        ...style,
        backgroundColor: "transparent",
        color: disabled ? DS.medGrey : isHov ? colors.hov : colors.base,
        textDecoration: isHov ? "underline" : "none",
        border: "none",
      };
    }

    return (
      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => setHoveredBtn(id)}
        onMouseLeave={() => {
          setHoveredBtn(null);
          setPressedBtn(null);
        }}
        onMouseDown={() => setPressedBtn(id)}
        onMouseUp={() => setPressedBtn(null)}
        style={style}
      >
        {icon}
        {label}
      </button>
    );
  };

  // ─── Division Table ───
  const renderDivTable = (
    nA: number,
    nB: number,
    rows: DivisionRow[],
    visRows: number,
    showHCF: boolean,
    showLCM: boolean,
    isGuna: boolean = false,
  ): React.ReactNode => {
    const accent = isGuna ? DS.accent : DS.primary;
    const accentL = isGuna ? DS.accentLight : DS.primaryMuted;
    const bA =
      visRows > 0 && visRows <= rows.length ? rows[visRows - 1].quotientA : nA;
    const bB =
      visRows > 0 && visRows <= rows.length ? rows[visRows - 1].quotientB : nB;
    const divs = rows.slice(0, visRows).map((r) => r.divisor);
    const hcfV = divs.length > 0 ? divs.reduce((a, b) => a * b, 1) : 1;

    return (
      <div
        style={{
          display: "flex",
          gap: 24,
          alignItems: "flex-start",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Table */}
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            border: `1.5px solid ${DS.border}`,
            backgroundColor: DS.white,
            boxShadow: `0 4px 24px ${accent}08`,
            minWidth: 280,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "72px 1fr 1fr",
              background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                color: "rgba(255,255,255,0.8)",
                textAlign: "center" as const,
                textTransform: "uppercase" as const,
                letterSpacing: 0.8,
              }}
            >
              Divisor
            </div>
            <div
              style={{
                padding: "12px 14px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: 16,
                color: DS.white,
                textAlign: "center" as const,
              }}
            >
              {nA}
            </div>
            <div
              style={{
                padding: "12px 14px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: 16,
                color: DS.white,
                textAlign: "center" as const,
              }}
            >
              {nB}
            </div>
          </div>

          {/* Rows */}
          {rows.slice(0, visRows).map((row: DivisionRow, i: number) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "72px 1fr 1fr",
                borderBottom: `1px solid ${DS.lightGrey}`,
                animation: `rowSlideIn 0.4s ease-out ${i * 0.12}s both`,
              }}
            >
              <div
                style={{
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: accentL,
                  borderRight: `1.5px solid ${DS.border}`,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800,
                  fontSize: 18,
                  color: accent,
                }}
              >
                {row.divisor}
              </div>
              <div
                style={{
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRight: `1px solid ${DS.lightGrey}`,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: DS.dark,
                }}
              >
                <span style={{ color: DS.grey }}>
                  {i === 0 ? nA : rows[i - 1].quotientA}
                </span>
                <span style={{ margin: "0 6px", color: DS.medGrey }}>→</span>
                <span style={{ fontWeight: 700 }}>{row.quotientA}</span>
              </div>
              <div
                style={{
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: DS.dark,
                }}
              >
                <span style={{ color: DS.grey }}>
                  {i === 0 ? nB : rows[i - 1].quotientB}
                </span>
                <span style={{ margin: "0 6px", color: DS.medGrey }}>→</span>
                <span style={{ fontWeight: 700 }}>{row.quotientB}</span>
              </div>
            </div>
          ))}

          {/* Bottom row */}
          {visRows > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "72px 1fr 1fr",
                backgroundColor: showLCM ? DS.accentLight : DS.bg,
                animation: "fadeInUp 0.4s ease-out both",
              }}
            >
              <div
                style={{
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: showLCM ? DS.accentLight : DS.bg,
                  borderRight: `1.5px solid ${DS.border}`,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: 11,
                  color: DS.grey,
                }}
              >
                {visRows >= rows.length ? "—" : "..."}
              </div>
              <div
                style={{
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRight: `1px solid ${DS.lightGrey}`,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  color:
                    showLCM && visRows >= rows.length ? DS.accent : DS.dark,
                }}
              >
                {bA}
              </div>
              <div
                style={{
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  color:
                    showLCM && visRows >= rows.length ? DS.accent : DS.dark,
                }}
              >
                {bB}
              </div>
            </div>
          )}
        </div>

        {/* HCF / LCM Cards */}
        {(showHCF || showLCM) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              minWidth: 200,
            }}
          >
            {showHCF && (
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: 16,
                  backgroundColor: DS.primaryMuted,
                  border: `1.5px solid ${DS.primaryLight}`,
                  animation: "popIn 0.5s ease-out 0.3s both",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <DecoShape
                  shape="circle"
                  color={DS.primaryLight}
                  size={30}
                  filled
                  style={{ top: -8, right: -8 }}
                  opacity={0.4}
                />
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: 11,
                    color: DS.primary,
                    textTransform: "uppercase" as const,
                    letterSpacing: 0.8,
                  }}
                >
                  HCF (Left Column)
                </div>
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    color: DS.darkSoft,
                    marginTop: 6,
                  }}
                >
                  {divs.join(" × ")} ={" "}
                  <span
                    style={{ color: DS.primary, fontWeight: 800, fontSize: 22 }}
                  >
                    {hcfV}
                  </span>
                </div>
              </div>
            )}
            {showLCM && visRows >= rows.length && (
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: 16,
                  backgroundColor: DS.accentLight,
                  border: `1.5px solid ${DS.accentMuted}40`,
                  animation: "popIn 0.5s ease-out 0.5s both",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <DecoShape
                  shape="triangle"
                  color={DS.accentMuted}
                  size={20}
                  style={{ top: -4, right: 10, opacity: 0.3 }}
                />
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: 11,
                    color: DS.accent,
                    textTransform: "uppercase" as const,
                    letterSpacing: 0.8,
                  }}
                >
                  LCM (All Numbers)
                </div>
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: 12,
                    color: DS.darkSoft,
                    marginTop: 6,
                  }}
                >
                  {divs.join(" × ")} × {bA} × {bB}
                </div>
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 800,
                    fontSize: 24,
                    color: DS.accent,
                    marginTop: 4,
                  }}
                >
                  = {hcfV * bA * bB}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ─── Step 1: Intro ───
  const renderStep1 = (): React.ReactNode => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 28,
          alignItems: "center",
          animation: "fadeInUp 0.6s ease-out both",
        }}
      >
        <div
          style={{
            padding: "22px 38px",
            borderRadius: 20,
            background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.primary})`,
            color: DS.white,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 900,
            fontSize: 38,
            boxShadow: `0 8px 32px ${DS.primary}30`,
            animation: "popIn 0.6s ease-out both",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.15)",
            }}
          />
          {numberA}
        </div>
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: 20,
            color: DS.medGrey,
          }}
        >
          and
        </div>
        <div
          style={{
            padding: "22px 38px",
            borderRadius: 20,
            background: `linear-gradient(135deg, ${DS.accent}, ${DS.accentMuted})`,
            color: DS.white,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 900,
            fontSize: 38,
            boxShadow: `0 8px 32px ${DS.accent}30`,
            animation: "popIn 0.6s ease-out 0.15s both",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: -6,
              left: -6,
              width: 30,
              height: 30,
              borderRadius: 4,
              border: "2px solid rgba(255,255,255,0.15)",
              transform: "rotate(15deg)",
            }}
          />
          {numberB}
        </div>
      </div>

      {/* Story Card */}
      <div
        style={{
          padding: "18px 24px",
          borderRadius: 16,
          background: `linear-gradient(135deg, ${DS.primaryMuted}, ${DS.accentLight})`,
          border: `1.5px solid ${DS.primaryLight}`,
          maxWidth: 480,
          textAlign: "center" as const,
          animation: "fadeInUp 0.5s ease-out 0.3s both",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <DecoShape
          shape="circle"
          color={DS.primaryLight}
          size={40}
          filled
          style={{ top: -15, left: -15 }}
          opacity={0.3}
        />
        <DecoShape
          shape="square"
          color={DS.accentMuted}
          size={20}
          style={{ bottom: -6, right: 20, transform: "rotate(20deg)" }}
          opacity={0.25}
        />
        <div style={{ fontSize: 20, marginBottom: 8 }}>🥦🍅🥕</div>
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            color: DS.dark,
            lineHeight: 1.6,
            position: "relative",
          }}
        >
          At a vegetable market in Bengaluru, a vendor has{" "}
          <strong style={{ color: DS.primary }}>{numberA} kg</strong> of
          tomatoes and{" "}
          <strong style={{ color: DS.accent }}>{numberB} kg</strong> of potatoes
          to pack into bags of equal weight. What's the heaviest bag she can
          use? How much total weight for a complete common order?
        </div>
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            color: DS.primary,
            marginTop: 10,
            textTransform: "uppercase" as const,
            letterSpacing: 0.5,
          }}
        >
          HCF → bag size &nbsp;·&nbsp; LCM → total order
        </div>
      </div>

      <div
        style={{
          borderRadius: 14,
          border: `2px dashed ${DS.border}`,
          padding: "20px 32px",
          animation: "fadeInUp 0.4s ease-out 0.5s both",
          fontFamily: "'Poppins', sans-serif",
          fontSize: 13,
          color: DS.grey,
          fontWeight: 500,
          textAlign: "center" as const,
        }}
      >
        The division table will grow here, row by row →
      </div>
    </div>
  );

  // ─── Step 8: Guna's Shortcut ───
  const renderStep8Guna = (): React.ReactNode => {
    const gunaDiv: number = hcf;
    const gunaQA: number = numberA / hcf;
    const gunaQB: number = numberB / hcf;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeInUp 0.5s ease-out both",
          }}
        >
          {/* Step-by-step card */}
          <div
            style={{
              padding: "18px 22px",
              borderRadius: 16,
              backgroundColor: DS.primaryMuted,
              border: `1.5px solid ${DS.primaryLight}`,
              minWidth: 180,
              textAlign: "center" as const,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <DecoShape
              shape="circle"
              color={DS.primaryLight}
              size={50}
              style={{ bottom: -20, right: -20 }}
              opacity={0.3}
            />
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                color: DS.primary,
                textTransform: "uppercase" as const,
                letterSpacing: 0.7,
              }}
            >
              🪜 One Step at a Time
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                marginTop: 10,
              }}
            >
              {divRows.map((r: DivisionRow, i: number) => (
                <div
                  key={i}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 20,
                    backgroundColor: DS.primary,
                    color: DS.white,
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    animation: `popIn 0.3s ease-out ${i * 0.12}s both`,
                    marginLeft: i * 12,
                  }}
                >
                  ÷ {r.divisor}
                </div>
              ))}
            </div>
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 11,
                color: DS.darkSoft,
                marginTop: 10,
                fontWeight: 500,
              }}
            >
              {divRows.length} steps
            </div>
          </div>

          {/* Guna's card */}
          <div
            style={{
              padding: "18px 22px",
              borderRadius: 16,
              backgroundColor: DS.accentLight,
              border: `1.5px solid ${DS.accentMuted}40`,
              minWidth: 180,
              textAlign: "center" as const,
              animation: "fadeInRight 0.5s ease-out 0.3s both",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <DecoShape
              shape="triangle"
              color={DS.accentMuted}
              size={30}
              style={{ top: -10, left: -5 }}
              opacity={0.2}
            />
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                color: DS.accent,
                textTransform: "uppercase" as const,
                letterSpacing: 0.7,
              }}
            >
              🚀 Guna's Big Leap!
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                marginTop: 10,
              }}
            >
              <div
                style={{
                  padding: "10px 22px",
                  borderRadius: 24,
                  background: `linear-gradient(135deg, ${DS.accent}, ${DS.accentMuted})`,
                  color: DS.white,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  animation: "popIn 0.5s ease-out 0.5s both",
                  boxShadow: `0 6px 20px ${DS.accent}30`,
                }}
              >
                ÷ {gunaDiv}
              </div>
            </div>
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 11,
                color: DS.darkSoft,
                marginTop: 10,
                fontWeight: 500,
              }}
            >
              Just 1 step!
            </div>
          </div>
        </div>

        {/* Guna Table */}
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            border: `1.5px solid ${DS.accentMuted}40`,
            backgroundColor: DS.white,
            boxShadow: `0 4px 24px ${DS.accent}08`,
            animation: "fadeInUp 0.5s ease-out 0.5s both",
            minWidth: 280,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "72px 1fr 1fr",
              background: `linear-gradient(135deg, ${DS.accent}, ${DS.accentMuted})`,
            }}
          >
            <div
              style={{
                padding: "12px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                color: "rgba(255,255,255,0.8)",
                textAlign: "center" as const,
                textTransform: "uppercase" as const,
                letterSpacing: 0.8,
              }}
            >
              Divisor
            </div>
            <div
              style={{
                padding: "12px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: 16,
                color: DS.white,
                textAlign: "center" as const,
              }}
            >
              {numberA}
            </div>
            <div
              style={{
                padding: "12px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: 16,
                color: DS.white,
                textAlign: "center" as const,
              }}
            >
              {numberB}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "72px 1fr 1fr",
              borderBottom: `1px solid ${DS.lightGrey}`,
              animation: "rowSlideIn 0.5s ease-out 0.6s both",
            }}
          >
            <div
              style={{
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: DS.accentLight,
                borderRight: `1.5px solid ${DS.border}`,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: 18,
                color: DS.accent,
              }}
            >
              {gunaDiv}
            </div>
            <div
              style={{
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRight: `1px solid ${DS.lightGrey}`,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                color: DS.dark,
                fontSize: 14,
              }}
            >
              <span style={{ color: DS.grey }}>{numberA}</span>
              <span style={{ margin: "0 6px", color: DS.medGrey }}>→</span>
              <span style={{ fontWeight: 700 }}>{gunaQA}</span>
            </div>
            <div
              style={{
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                color: DS.dark,
                fontSize: 14,
              }}
            >
              <span style={{ color: DS.grey }}>{numberB}</span>
              <span style={{ margin: "0 6px", color: DS.medGrey }}>→</span>
              <span style={{ fontWeight: 700 }}>{gunaQB}</span>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "72px 1fr 1fr",
              backgroundColor: DS.bg,
            }}
          >
            <div
              style={{
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: DS.accentLight,
                borderRight: `1.5px solid ${DS.border}`,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                color: DS.grey,
              }}
            >
              —
            </div>
            <div
              style={{
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRight: `1px solid ${DS.lightGrey}`,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                color: DS.accent,
                fontSize: 20,
              }}
            >
              {gunaQA}
            </div>
            <div
              style={{
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                color: DS.accent,
                fontSize: 20,
              }}
            >
              {gunaQB}
            </div>
          </div>
        </div>

        {/* Results */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeInUp 0.4s ease-out 0.8s both",
          }}
        >
          <div
            style={{
              padding: "10px 20px",
              borderRadius: 24,
              backgroundColor: DS.primary,
              color: DS.white,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              boxShadow: `0 4px 16px ${DS.primary}25`,
              animation: "popIn 0.4s ease-out 0.9s both",
            }}
          >
            HCF = {gunaDiv}
          </div>
          <div
            style={{
              padding: "10px 20px",
              borderRadius: 24,
              background: `linear-gradient(135deg, ${DS.accent}, ${DS.accentMuted})`,
              color: DS.white,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              boxShadow: `0 4px 16px ${DS.accent}25`,
              animation: "popIn 0.4s ease-out 1s both",
            }}
          >
            LCM = {gunaDiv} × {gunaQA} × {gunaQB} = {gunaDiv * gunaQA * gunaQB}
          </div>
        </div>

        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 12,
            fontWeight: 500,
            color: DS.darkSoft,
            textAlign: "center" as const,
            maxWidth: 420,
            lineHeight: 1.6,
            animation: "fadeInUp 0.4s ease-out 1.1s both",
          }}
        >
          Guna divides by any common factor he spots — not just primes! The
          result is the same because the product of all divisors still gives the
          HCF.
        </div>
      </div>
    );
  };

  // ─── Practice Mode ───
  const renderPracticeMode = (): React.ReactNode => {
    const checkAnswers = (): void => {
      let ok = true;
      pDivRows.forEach((row: DivisionRow, i: number) => {
        if ((practiceAnswers[i] || 0) !== row.divisor) ok = false;
      });
      setPracticeCorrect(ok);
      setPracticeSubmitted(true);
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 22,
            fontWeight: 900,
            background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "fadeInUp 0.4s ease-out both",
          }}
        >
          Divide {practiceA} and {practiceB}
        </div>

        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            border: `1.5px solid ${DS.border}`,
            backgroundColor: DS.white,
            boxShadow: `0 4px 24px ${DS.primary}08`,
            animation: "fadeInUp 0.4s ease-out 0.2s both",
            minWidth: 320,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "96px 1fr 1fr",
              background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
            }}
          >
            <div
              style={{
                padding: "12px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: 10,
                color: "rgba(255,255,255,0.8)",
                textAlign: "center" as const,
                textTransform: "uppercase" as const,
                letterSpacing: 0.8,
              }}
            >
              Divisor (you)
            </div>
            <div
              style={{
                padding: "12px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: 16,
                color: DS.white,
                textAlign: "center" as const,
              }}
            >
              {practiceA}
            </div>
            <div
              style={{
                padding: "12px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: 16,
                color: DS.white,
                textAlign: "center" as const,
              }}
            >
              {practiceB}
            </div>
          </div>

          {/* Rows */}
          {pDivRows.map((row: DivisionRow, i: number) => {
            const prevA: number =
              i === 0 ? practiceA : pDivRows[i - 1].quotientA;
            const prevB: number =
              i === 0 ? practiceB : pDivRows[i - 1].quotientB;
            const uv: number | undefined = practiceAnswers[i];
            const exp: number = row.divisor;
            const isC: boolean = practiceSubmitted && uv === exp;
            const isW: boolean = practiceSubmitted && uv !== exp;

            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "96px 1fr 1fr",
                  borderBottom: `1px solid ${DS.lightGrey}`,
                  backgroundColor: isC ? "#F0FDF4" : isW ? "#FEF2F2" : DS.white,
                  transition: "background-color 0.3s ease",
                }}
              >
                <div
                  style={{
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    backgroundColor: isC
                      ? "#D1FAE5"
                      : isW
                        ? "#FEE2E2"
                        : DS.primaryMuted,
                    borderRight: `1.5px solid ${DS.border}`,
                  }}
                >
                  <input
                    type="number"
                    min={2}
                    max={999}
                    value={practiceAnswers[i] ?? ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPracticeAnswers((p) => ({
                        ...p,
                        [i]: parseInt(e.target.value) || 0,
                      }))
                    }
                    disabled={practiceSubmitted}
                    style={{
                      width: 48,
                      height: 36,
                      borderRadius: 10,
                      border: `2px solid ${isC ? DS.success : isW ? DS.error : DS.primary}`,
                      textAlign: "center" as const,
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 16,
                      fontWeight: 700,
                      color: DS.dark,
                      outline: "none",
                      backgroundColor: practiceSubmitted ? DS.bg : DS.white,
                      transition: "border-color 0.2s ease",
                    }}
                  />
                  {isC && <Check size={14} color={DS.success} />}
                  {isW && (
                    <span
                      style={{
                        color: DS.error,
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      →{exp}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRight: `1px solid ${DS.lightGrey}`,
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    color: DS.dark,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: DS.grey }}>{prevA}</span>
                  <span style={{ margin: "0 5px", color: DS.medGrey }}>→</span>
                  <span style={{ fontWeight: 700 }}>{row.quotientA}</span>
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    color: DS.dark,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: DS.grey }}>{prevB}</span>
                  <span style={{ margin: "0 5px", color: DS.medGrey }}>→</span>
                  <span style={{ fontWeight: 700 }}>{row.quotientB}</span>
                </div>
              </div>
            );
          })}

          {/* Bottom */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "96px 1fr 1fr",
              backgroundColor: DS.bg,
            }}
          >
            <div
              style={{
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: DS.primaryMuted,
                borderRight: `1.5px solid ${DS.border}`,
                fontSize: 11,
                color: DS.grey,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
              }}
            >
              —
            </div>
            <div
              style={{
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRight: `1px solid ${DS.lightGrey}`,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                color: DS.dark,
                fontSize: 18,
              }}
            >
              {pLastA}
            </div>
            <div
              style={{
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                color: DS.dark,
                fontSize: 18,
              }}
            >
              {pLastB}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            animation: "fadeInUp 0.4s ease-out 0.4s both",
          }}
        >
          {!practiceSubmitted ? (
            <SButton
              label="Check My Divisors"
              variant="contained"
              color="primary"
              onClick={checkAnswers}
              icon={<Check size={15} />}
            />
          ) : (
            <>
              <div
                style={{
                  padding: "12px 20px",
                  borderRadius: 24,
                  backgroundColor: practiceCorrect ? "#F0FDF4" : "#FEF2F2",
                  border: `2px solid ${practiceCorrect ? DS.success : DS.error}30`,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  color: practiceCorrect ? "#16A34A" : DS.error,
                  animation: practiceCorrect
                    ? "celebrate 0.6s ease-out both"
                    : "fadeInUp 0.3s ease-out both",
                }}
              >
                {practiceCorrect
                  ? `🎉 Perfect! HCF = ${pHcf}, LCM = ${pLcm}`
                  : "🔄 Check which common primes you missed"}
              </div>
              <SButton
                label="Retry"
                variant="outlined"
                color="primary"
                onClick={resetPractice}
                icon={<RotateCcw size={14} />}
                size="sm"
              />
            </>
          )}
        </div>
      </div>
    );
  };

  // ─── Content Router ───
  const renderContent = (): React.ReactNode => {
    if (selectedMode === "practice") return renderPracticeMode();
    const sid = currentStep?.id;
    if (sid === 1) return renderStep1();
    if (sid === 8) return renderStep8Guna();
    const showH = sid !== undefined && sid >= 6;
    const showL = sid !== undefined && sid >= 7;
    return renderDivTable(
      numberA,
      numberB,
      divRows,
      visibleRowCount,
      showH,
      showL,
    );
  };

  const modeIcons: Record<ModeType, React.ReactNode> = {
    learn: <BookOpen size={15} />,
    practice: <Target size={15} />,
  };
  const modeLabels: Record<ModeType, string> = {
    learn: "Learn",
    practice: "Practice",
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: config.width,
        margin: "0 auto",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: DS.white,
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: `0 8px 48px rgba(74, 77, 201, 0.08), 0 2px 8px rgba(0,0,0,0.04)`,
        border: `1.5px solid ${DS.border}`,
      }}
    >
      {/* ═══ Header ═══ */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.primary} 40%, ${DS.gradientEnd})`,
          padding: "22px 28px 18px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative shapes */}
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "2.5px solid rgba(255,255,255,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 70,
            width: 30,
            height: 30,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -8,
            right: 120,
            width: 0,
            height: 0,
            borderLeft: "18px solid transparent",
            borderRight: "18px solid transparent",
            borderBottom: "30px solid rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 5,
            left: "45%",
            width: 24,
            height: 24,
            borderRadius: 3,
            border: "2px solid rgba(255,255,255,0.08)",
            transform: "rotate(20deg)",
          }}
        />

        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 20,
            fontWeight: 800,
            color: DS.white,
            letterSpacing: 0.3,
            position: "relative",
            zIndex: 1,
          }}
        >
          Simultaneous Division Method
        </div>
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 12,
            fontWeight: 500,
            color: "rgba(255,255,255,0.7)",
            marginTop: 4,
            position: "relative",
            zIndex: 1,
          }}
        >
          Ganita Prakash · Grade 7 · Chapter 3: Finding Common Ground
        </div>
      </div>

      {/* ═══ Mode Selector ═══ */}
      {config.showModeSelector && (
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "14px 28px",
            backgroundColor: DS.bg,
            borderBottom: `1.5px solid ${DS.border}`,
          }}
        >
          {config.enabledModes.map((mode: ModeType) => {
            const isA: boolean = selectedMode === mode;
            const isH: boolean = hoveredBtn === `m-${mode}`;
            return (
              <button
                key={mode}
                onClick={() => switchMode(mode)}
                onMouseEnter={() => setHoveredBtn(`m-${mode}`)}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 22px",
                  borderRadius: 24,
                  height: 40,
                  border: isA
                    ? `2px solid ${DS.primary}`
                    : "2px solid transparent",
                  backgroundColor: isA
                    ? DS.white
                    : isH
                      ? DS.white
                      : "transparent",
                  color: isA ? DS.primary : DS.darkSoft,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: isA ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  outline: "none",
                  boxShadow: isA ? `0 2px 10px ${DS.primary}12` : "none",
                }}
              >
                {modeIcons[mode]}
                {modeLabels[mode]}
              </button>
            );
          })}
        </div>
      )}

      {/* ═══ Step Info ═══ */}
      {selectedMode === "learn" && currentStep && (
        <div
          style={{
            padding: "16px 28px",
            borderBottom: `1.5px solid ${DS.border}`,
            animation: "slideDown 0.3s ease-out",
            backgroundColor: DS.white,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.primary})`,
                color: DS.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: 12,
                flexShrink: 0,
                boxShadow: `0 2px 8px ${DS.primary}25`,
              }}
            >
              {currentStepIndex + 1}
            </div>
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: DS.dark,
              }}
            >
              {currentStep.title}
            </div>
          </div>
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 13,
              fontWeight: 400,
              color: DS.darkSoft,
              opacity: 0.85,
              marginTop: 6,
              lineHeight: 1.6,
              marginLeft: 42,
            }}
          >
            {currentStep.description}
          </div>
        </div>
      )}

      {/* ═══ Content ═══ */}
      <div
        key={`${selectedMode}-${currentStepIndex}-${animKey}`}
        style={{
          padding: "28px",
          minHeight: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "fadeInUp 0.4s ease-out both",
          backgroundColor: DS.white,
        }}
      >
        {renderContent()}
      </div>

      {/* ═══ Navigation ═══ */}
      {config.showNavigation && selectedMode === "learn" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 28px",
            borderTop: `1.5px solid ${DS.border}`,
            backgroundColor: DS.bg,
          }}
        >
          <SButton
            label="Back"
            variant="outlined"
            color="primary"
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            icon={<ChevronLeft size={16} />}
            size="sm"
          />
          {config.showStepIndicator && (
            <div style={{ display: "flex", gap: 6 }}>
              {modeSteps.map((_: StepDataInterface, i: number) => (
                <div
                  key={i}
                  onClick={() => {
                    setCurrentStepIndex(i);
                    setAnimKey((p) => p + 1);
                  }}
                  style={{
                    width: i === currentStepIndex ? 28 : 8,
                    height: 8,
                    borderRadius: 4,
                    background:
                      i === currentStepIndex
                        ? `linear-gradient(135deg, ${DS.primary}, ${DS.accent})`
                        : i < currentStepIndex
                          ? DS.primaryLight
                          : DS.lightGrey,
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
              ))}
            </div>
          )}
          <SButton
            label="Next"
            variant="contained"
            color="primary"
            onClick={goNext}
            disabled={currentStepIndex === modeSteps.length - 1}
            icon={<ChevronRight size={16} />}
          />
        </div>
      )}

      {/* ═══ Footer ═══ */}
      <div
        style={{
          padding: "12px 28px",
          background: `linear-gradient(135deg, ${DS.primaryMuted}, ${DS.accentLight})`,
          borderTop: `1.5px solid ${DS.primaryLight}40`,
        }}
      >
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: DS.gradientStart,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Star size={13} fill={DS.accent} color={DS.accent} />
          {selectedMode === "learn"
            ? "The left column divisors multiply to give HCF. All numbers (left column × bottom row) multiply to give LCM!"
            : "Find common prime divisors for both numbers. Keep dividing until no common primes remain!"}
        </div>
      </div>
    </div>
  );
};

export default SimultaneousDivisionMethodTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
