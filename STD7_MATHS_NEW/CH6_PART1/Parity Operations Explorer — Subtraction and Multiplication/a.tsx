// @ts-ignore - React types may not be available in this environment
import React, { useState, useEffect, useCallback, useMemo } from "react";
// @ts-ignore - lucide-react types may not be available in this environment
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

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

interface ParityAdditionalProps {
  subtractionExamples?: { a: number; b: number; label?: string }[];
  multiplicationExamples?: { rows: number; cols: number; label?: string }[];
  showConnectionBridge?: boolean;
  accentColor?: string;
  oddColor?: string;
  evenColor?: string;
}

interface ParityOperationsExplorerProps {
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
    additionalProps?: ParityAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN SYSTEM ====================

const DS = {
  // Primary palette from Singularity PDF
  indigo: "#4A4DC9",
  orange: "#FF7212",
  deepPurple: "#533086",
  gradientOrange: "#FC9145",
  lightPurple: "#C1C1EA",
  lightPeach: "#FFF3E4",

  // Grays
  darkGray: "#4E4E4E",
  midGray: "#CACACA",
  borderGray: "#EBEBEB",
  bgGray: "#F5F5F5",

  // Functional
  white: "#FFFFFF",
  black: "#1A1A2E",

  // Semantic for parity
  oddColor: "#FF7212", // orange accent
  evenColor: "#4A4DC9", // indigo primary
  oddBg: "#FFF3E4", // light peach
  evenBg: "#EEEEF9", // very light indigo

  // Button specs from PDF
  btnHeight: 40,
  btnPaddingH: 24,
  btnRadius: 20, // pill-shaped from PDF
  cardRadius: 16,
  iconBtnSize: 40,

  // Font
  font: "'Poppins', sans-serif",
};

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

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Subtraction: Same Parity",
    description:
      "When we subtract two even numbers or two odd numbers, the result is always even. Let's see why using our dot-pairing model!",
    type: "explanation",
    mode: "learn",
    data: { phase: "sub_same" },
  },
  {
    id: 2,
    title: "Subtraction: Different Parity",
    description:
      "What happens when we subtract an odd from an even, or vice versa? The leftover dot tells us the answer is odd!",
    type: "explanation",
    mode: "learn",
    data: { phase: "sub_diff" },
  },
  {
    id: 3,
    title: "Subtraction Rules Summary",
    description:
      "Subtraction mirrors addition! Same parity → even result. Different parity → odd result.",
    type: "explanation",
    mode: "learn",
    data: { phase: "sub_summary" },
  },
  {
    id: 4,
    title: "Multiplication: Grid Exploration",
    description:
      "Discover multiplication parity using colourful rectangular grids. Each grid shows rows × columns of unit squares. Spot the pattern!",
    type: "explanation",
    mode: "learn",
    data: { phase: "mul_grids" },
  },
  {
    id: 5,
    title: "Multiplication Parity Rules",
    description:
      "A product is odd ONLY when both numbers are odd! If even one factor is even, the product is even.",
    type: "explanation",
    mode: "learn",
    data: { phase: "mul_rules" },
  },
  {
    id: 6,
    title: "The Deep Connection",
    description:
      "Multiplication is repeated addition. So 5 × 3 = 3+3+3+3+3 — adding an odd number of odd numbers gives odd!",
    type: "explanation",
    mode: "learn",
    data: { phase: "connection" },
  },
];

// ==================== GEOMETRIC DECORATOR ====================

const GeoDecorator: React.FC<{
  shape: "circle" | "triangle" | "square";
  size: number;
  color: string;
  filled?: boolean;
  style?: React.CSSProperties;
}> = ({ shape, size, color, filled = false, style = {} }) => {
  if (shape === "circle") {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: filled ? color : "transparent",
          border: filled ? "none" : `2px solid ${color}`,
          opacity: 0.15,
          ...style,
        }}
      />
    );
  }
  if (shape === "triangle") {
    return (
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size * 0.866}px solid ${filled ? color : "transparent"}`,
          ...(filled
            ? {}
            : {
                position: "relative" as const,
              }),
          opacity: 0.12,
          ...style,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: filled ? color : "transparent",
        border: filled ? "none" : `2px solid ${color}`,
        borderRadius: 3,
        opacity: 0.12,
        ...style,
      }}
    />
  );
};

// ==================== CONTAINED BUTTON (Singularity) ====================

const DSButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "accent" | "gray";
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  children,
  onClick,
  variant = "contained",
  color = "primary",
  disabled = false,
  icon,
  style = {},
}) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const baseColor =
    color === "primary"
      ? DS.indigo
      : color === "accent"
        ? DS.orange
        : DS.midGray;
  const hoverColor =
    color === "primary"
      ? DS.deepPurple
      : color === "accent"
        ? DS.gradientOrange
        : DS.darkGray;

  let bg = "transparent";
  let textColor = baseColor;
  let border = "none";

  if (variant === "contained") {
    bg = disabled
      ? DS.borderGray
      : pressed
        ? hoverColor
        : hovered
          ? hoverColor
          : baseColor;
    textColor = disabled ? DS.midGray : DS.white;
  } else if (variant === "outlined") {
    bg = disabled ? "transparent" : hovered ? `${baseColor}0D` : "transparent";
    textColor = disabled ? DS.midGray : baseColor;
    border = `1.5px solid ${disabled ? DS.borderGray : baseColor}`;
  } else {
    bg = hovered ? `${baseColor}0D` : "transparent";
    textColor = disabled ? DS.midGray : baseColor;
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        height: DS.btnHeight,
        padding: `0 ${DS.btnPaddingH}px`,
        borderRadius: DS.btnRadius,
        backgroundColor: bg,
        color: textColor,
        border,
        fontFamily: DS.font,
        fontWeight: 600,
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: pressed
          ? "scale(0.96)"
          : hovered
            ? "scale(1.02)"
            : "scale(1)",
        boxShadow:
          variant === "contained" && !disabled && hovered
            ? `0 6px 20px ${baseColor}33`
            : "none",
        outline: "none",
        letterSpacing: 0.2,
        ...style,
      }}
    >
      {icon && (
        <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      )}
      {children}
    </button>
  );
};

// ==================== SUBTRACTION VISUAL ====================

const SubtractionVisual: React.FC<{
  a: number;
  b: number;
  animDelay: number;
}> = ({ a, b, animDelay }) => {
  const [phase, setPhase] = useState(0);
  const result = a - b;
  const isOdd = result % 2 !== 0;

  useEffect(() => {
    setPhase(0);
    const t1 = setTimeout(() => setPhase(1), animDelay);
    const t2 = setTimeout(() => setPhase(2), animDelay + 700);
    const t3 = setTimeout(() => setPhase(3), animDelay + 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [a, b, animDelay]);

  const dots: any[] = [];
  for (let i = 0; i < a; i++) {
    const removed = phase >= 2 && i >= result;
    dots.push(
      <div
        key={i}
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: removed ? DS.bgGray : DS.indigo,
          border: removed
            ? `2px dashed ${DS.midGray}`
            : `2px solid ${DS.indigo}`,
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: phase >= 1 ? "scale(1)" : "scale(0)",
          opacity: removed ? 0.25 : 1,
          boxShadow:
            !removed && phase >= 1 ? `0 2px 8px ${DS.indigo}22` : "none",
        }}
      />,
    );
  }

  // Pair brackets for remaining dots
  const pairBrackets: any[] = [];
  if (phase >= 3) {
    const remaining = result;
    const pairCount = Math.floor(remaining / 2);
    for (let i = 0; i < pairCount; i++) {
      pairBrackets.push(
        <div
          key={`br-${i}`}
          style={{
            position: "absolute",
            left: i * 2 * 26 - 2,
            bottom: -8,
            width: 48,
            height: 6,
            borderBottom: `2px solid ${DS.lightPurple}`,
            borderLeft: `2px solid ${DS.lightPurple}`,
            borderRight: `2px solid ${DS.lightPurple}`,
            borderRadius: "0 0 6px 6px",
            animation: "fadeInUp 0.3s ease forwards",
            animationDelay: `${i * 0.08}s`,
            opacity: 0,
          }}
        />,
      );
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: "20px 24px",
        borderRadius: DS.cardRadius,
        backgroundColor: DS.white,
        border: `1.5px solid ${phase >= 3 ? (isOdd ? DS.orange + "44" : DS.indigo + "44") : DS.borderGray}`,
        boxShadow:
          phase >= 3
            ? `0 4px 20px ${isOdd ? DS.orange : DS.indigo}11`
            : "0 2px 8px rgba(0,0,0,0.04)",
        transition: "all 0.4s ease",
        minWidth: 140,
      }}
    >
      <div
        style={{
          fontFamily: DS.font,
          fontWeight: 700,
          fontSize: 18,
          color: DS.black,
          letterSpacing: -0.3,
        }}
      >
        {a} − {b}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          justifyContent: "center",
          maxWidth: 180,
          position: "relative",
          paddingBottom: phase >= 3 ? 12 : 0,
        }}
      >
        {dots}
        {pairBrackets}
      </div>
      {phase >= 2 && (
        <div
          style={{
            fontFamily: DS.font,
            fontSize: 12,
            color: DS.darkGray,
            fontStyle: "italic",
            animation: "fadeInUp 0.3s ease forwards",
          }}
        >
          Remove {b} dots
        </div>
      )}
      {phase >= 3 && (
        <div
          style={{
            fontFamily: DS.font,
            fontWeight: 700,
            fontSize: 14,
            color: isOdd ? DS.oddColor : DS.evenColor,
            padding: "4px 16px",
            borderRadius: DS.btnRadius,
            backgroundColor: isOdd ? DS.oddBg : DS.evenBg,
            animation: "popIn 0.5s ease forwards",
            border: `1.5px solid ${isOdd ? DS.oddColor + "33" : DS.evenColor + "33"}`,
          }}
        >
          = {result} ({isOdd ? "Odd" : "Even"})
        </div>
      )}
    </div>
  );
};

// ==================== RULE CARD (Singularity style) ====================

const RuleCard: React.FC<{
  operation: string;
  left: string;
  right: string;
  result: string;
  isOdd: boolean;
  delay: number;
  example: string;
}> = ({ operation, left, right, result, isOdd, delay, example }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(false);
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const resultColor = isOdd ? DS.oddColor : DS.evenColor;
  const resultBg = isOdd ? DS.oddBg : DS.evenBg;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 20px",
        borderRadius: 12,
        backgroundColor: DS.white,
        border: `1.5px solid ${DS.borderGray}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        flexWrap: "wrap",
        fontFamily: DS.font,
      }}
    >
      <span
        style={{
          fontWeight: 600,
          fontSize: 14,
          color: DS.black,
          minWidth: 160,
        }}
      >
        <span style={{ color: DS.deepPurple }}>{left}</span> {operation}{" "}
        <span style={{ color: DS.deepPurple }}>{right}</span>
      </span>
      <span style={{ fontSize: 15, color: DS.midGray, fontWeight: 300 }}>
        =
      </span>
      <span
        style={{
          fontWeight: 700,
          fontSize: 13,
          color: resultColor,
          padding: "3px 14px",
          borderRadius: DS.btnRadius,
          backgroundColor: resultBg,
          border: `1px solid ${resultColor}22`,
        }}
      >
        {result}
      </span>
      <span
        style={{
          fontSize: 12,
          color: DS.darkGray,
          fontStyle: "italic",
          opacity: 0.7,
        }}
      >
        e.g. {example}
      </span>
    </div>
  );
};

// ==================== RECTANGULAR GRID ====================

const RectGrid: React.FC<{
  rows: number;
  cols: number;
  label?: string;
  animDelay: number;
  cellSize?: number;
}> = ({ rows, cols, label, animDelay, cellSize = 20 }) => {
  const [filledCount, setFilledCount] = useState(0);
  const total = rows * cols;
  const isOdd = total % 2 !== 0;

  useEffect(() => {
    setFilledCount(0);
    const timer = setTimeout(() => {
      let count = 0;
      const step = Math.max(1, Math.floor(total / 25));
      const interval = setInterval(() => {
        count += step;
        if (count > total) count = total;
        setFilledCount(count);
        if (count >= total) clearInterval(interval);
      }, 35);
      return () => clearInterval(interval);
    }, animDelay);
    return () => clearTimeout(timer);
  }, [rows, cols, animDelay, total]);

  const baseColor = isOdd ? DS.orange : DS.indigo;
  const done = filledCount >= total;

  const cells: any[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const isFilled = idx < filledCount;
      cells.push(
        <div
          key={`${r}-${c}`}
          style={{
            width: cellSize,
            height: cellSize,
            borderRadius: 3,
            backgroundColor: isFilled ? baseColor : DS.bgGray,
            border: `1px solid ${isFilled ? baseColor + "66" : DS.borderGray}`,
            transition: "all 0.12s ease",
            transform: isFilled ? "scale(1)" : "scale(0.75)",
            opacity: isFilled ? 1 : 0.35,
          }}
        />,
      );
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        padding: "16px 18px",
        borderRadius: DS.cardRadius,
        backgroundColor: DS.white,
        border: `1.5px solid ${done ? baseColor + "33" : DS.borderGray}`,
        boxShadow: done
          ? `0 4px 24px ${baseColor}15`
          : "0 2px 8px rgba(0,0,0,0.04)",
        transition: "all 0.5s ease",
        animation: done
          ? isOdd
            ? "glowOrange 2.5s ease infinite"
            : "glowIndigo 2.5s ease infinite"
          : "none",
      }}
    >
      <div
        style={{
          fontFamily: DS.font,
          fontWeight: 600,
          fontSize: 13,
          color: DS.darkGray,
          letterSpacing: 0.2,
        }}
      >
        {label || `${rows} × ${cols}`}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gap: 3,
        }}
      >
        {cells}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: DS.font,
          fontSize: 13,
          fontWeight: 700,
          color: isOdd ? DS.oddColor : DS.evenColor,
          opacity: done ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <span
          style={{
            padding: "3px 14px",
            borderRadius: DS.btnRadius,
            backgroundColor: isOdd ? DS.oddBg : DS.evenBg,
            border: `1px solid ${isOdd ? DS.oddColor + "22" : DS.evenColor + "22"}`,
          }}
        >
          = {total} ({isOdd ? "Odd" : "Even"})
        </span>
      </div>
    </div>
  );
};

// ==================== CONNECTION BRIDGE ====================

const ConnectionBridge: React.FC<{ animDelay: number }> = ({ animDelay }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
    const timers = [
      setTimeout(() => setStep(1), animDelay),
      setTimeout(() => setStep(2), animDelay + 800),
      setTimeout(() => setStep(3), animDelay + 1600),
      setTimeout(() => setStep(4), animDelay + 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [animDelay]);

  const examples = [
    {
      expr: "5 × 3",
      expanded: "3 + 3 + 3 + 3 + 3",
      note: "5 odd addends → odd",
      result: "15 (Odd)",
      isOdd: true,
    },
    {
      expr: "4 × 3",
      expanded: "3 + 3 + 3 + 3",
      note: "4 odd addends → even",
      result: "12 (Even)",
      isOdd: false,
    },
    {
      expr: "5 × 4",
      expanded: "4 + 4 + 4 + 4 + 4",
      note: "5 even addends → even",
      result: "20 (Even)",
      isOdd: false,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        width: "100%",
        fontFamily: DS.font,
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 17,
          background: `linear-gradient(135deg, ${DS.indigo}, ${DS.deepPurple})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: step >= 1 ? 1 : 0,
          transition: "opacity 0.5s ease",
          letterSpacing: -0.3,
        }}
      >
        Multiplication = Repeated Addition
      </div>

      {examples.map((ex, i) => {
        const color = ex.isOdd ? DS.oddColor : DS.evenColor;
        const bg = ex.isOdd ? DS.oddBg : DS.evenBg;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 18px",
              borderRadius: 12,
              backgroundColor: DS.white,
              border: `1.5px solid ${step >= i + 2 ? color + "33" : DS.borderGray}`,
              boxShadow:
                step >= i + 2
                  ? `0 2px 12px ${color}11`
                  : "0 1px 4px rgba(0,0,0,0.03)",
              opacity: step >= i + 2 ? 1 : 0.15,
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: step >= i + 2 ? "translateX(0)" : "translateX(-20px)",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: DS.black,
                minWidth: 50,
              }}
            >
              {ex.expr}
            </span>
            <span style={{ color: DS.midGray, fontSize: 14, fontWeight: 300 }}>
              =
            </span>
            <span
              style={{
                fontSize: 13,
                color: DS.darkGray,
                flex: 1,
                minWidth: 90,
              }}
            >
              {ex.expanded}
            </span>
            <span
              style={{
                fontSize: 11,
                fontStyle: "italic",
                color: DS.darkGray,
                opacity: 0.7,
                minWidth: 110,
              }}
            >
              ({ex.note})
            </span>
            <span
              style={{
                fontWeight: 700,
                fontSize: 12,
                color,
                padding: "3px 12px",
                borderRadius: DS.btnRadius,
                backgroundColor: bg,
                border: `1px solid ${color}22`,
              }}
            >
              {ex.result}
            </span>
          </div>
        );
      })}

      {step >= 4 && (
        <div
          style={{
            textAlign: "center",
            padding: 18,
            borderRadius: DS.cardRadius,
            background: `linear-gradient(135deg, ${DS.evenBg}, ${DS.oddBg})`,
            border: `1.5px solid ${DS.indigo}22`,
            animation: "fadeInUp 0.6s ease forwards",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative shapes */}
          <div
            style={{ position: "absolute", top: 8, right: 12, opacity: 0.08 }}
          >
            <GeoDecorator shape="circle" size={28} color={DS.indigo} filled />
          </div>
          <div
            style={{ position: "absolute", bottom: 8, left: 14, opacity: 0.08 }}
          >
            <GeoDecorator shape="triangle" size={22} color={DS.orange} filled />
          </div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: DS.deepPurple,
              marginBottom: 6,
            }}
          >
            ✨ The Key Insight
          </div>
          <div style={{ fontSize: 13, color: DS.darkGray, lineHeight: 1.7 }}>
            <b style={{ color: DS.oddColor }}>odd × odd</b> = odd number of odd
            addends →{" "}
            <span
              style={{
                fontWeight: 700,
                color: DS.oddColor,
                padding: "1px 8px",
                borderRadius: 10,
                backgroundColor: DS.oddBg,
              }}
            >
              Odd
            </span>
            <br />
            <b style={{ color: DS.evenColor }}>even × anything</b> = even
            addends or even count →{" "}
            <span
              style={{
                fontWeight: 700,
                color: DS.evenColor,
                padding: "1px 8px",
                borderRadius: 10,
                backgroundColor: DS.evenBg,
              }}
            >
              Even
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const ParityOperationsExplorer: React.FC<ParityOperationsExplorerProps> = ({
  props: incomingProps,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const props = (incomingProps ?? {}) as ParityOperationsExplorerProps["props"];
  const config = useMemo(
    () => ({
      width: props?.width ?? 800,
      height: props?.height ?? 600,
      initialMode: props?.initialMode ?? ("learn" as ModeType),
      showModeSelector: props?.showModeSelector ?? false,
      enabledModes: props?.enabledModes ?? (["learn"] as ModeType[]),
      showNavigation: props?.showNavigation ?? true,
      showPlayPause: props?.showPlayPause ?? true,
      showStepIndicator: props?.showStepIndicator ?? true,
      initialStep: props?.initialStep ?? 1,
      filterSteps: props?.filterSteps ?? null,
      animationSpeed: props?.animationSpeed ?? 1,
      autoPlayDuration:
        props?.autoPlayDuration ?? props?.data?.autoPlayDuration ?? 0,
      themeColor: props?.themeColor ?? props?.data?.themeColor ?? DS.indigo,
      darkMode: props?.darkMode ?? false,
    }),
    [props],
  );

  const allSteps = props?.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(() => {
    if (config.filterSteps && config.filterSteps.length > 0) {
      return allSteps.filter((s) => config.filterSteps!.includes(s.id));
    }
    return allSteps;
  }, [allSteps, config.filterSteps]);

  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    if (config.initialStep) {
      const idx = availableSteps.findIndex((s) => s.id === config.initialStep);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const currentStep = availableSteps[currentStepIndex];
  const totalSteps = availableSteps.length;

  // Inject keyframes + Poppins font
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.id = "parity-singularity-keyframes";
    styleSheet.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(18px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes popIn {
                0% { transform: scale(0); opacity: 0; }
                60% { transform: scale(1.08); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes glowOrange {
                0%, 100% { box-shadow: 0 4px 24px rgba(255,114,18,0.08); }
                50% { box-shadow: 0 4px 32px rgba(255,114,18,0.18); }
            }
            @keyframes glowIndigo {
                0%, 100% { box-shadow: 0 4px 24px rgba(74,77,201,0.08); }
                50% { box-shadow: 0 4px 32px rgba(74,77,201,0.18); }
            }
            @keyframes slideInLeft {
                from { opacity: 0; transform: translateX(-24px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(24px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes floatSlow {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-8px) rotate(3deg); }
            }
            @keyframes progressPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
        `;
    document.head.appendChild(styleSheet);
    return () => {
      const existing = document.getElementById("parity-singularity-keyframes");
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  // Notify parent
  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps,
        isPaused: !isPlaying,
        currentMode: "learn",
      });
    }
  }, [currentStepIndex, totalSteps, isPlaying, setStepDetails]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying || config.autoPlayDuration <= 0) return;
    const timer = setTimeout(() => {
      if (currentStepIndex < totalSteps - 1) {
        goToStep(currentStepIndex + 1);
      } else {
        setIsPlaying(false);
      }
    }, config.autoPlayDuration);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, config.autoPlayDuration, totalSteps]);

  const goToStep = useCallback((idx: number) => {
    setCurrentStepIndex(idx);
    setAnimKey((k) => k + 1);
  }, []);

  const goNext = () => {
    if (currentStepIndex < totalSteps - 1) goToStep(currentStepIndex + 1);
  };
  const goPrev = () => {
    if (currentStepIndex > 0) goToStep(currentStepIndex - 1);
  };
  const resetStep = () => setAnimKey((k) => k + 1);

  // Determine phase section
  const phaseSection = currentStep?.data?.phase?.startsWith("sub")
    ? "subtraction"
    : currentStep?.data?.phase?.startsWith("mul") ||
        currentStep?.data?.phase === "connection"
      ? "multiplication"
      : "";

  // ==================== RENDER PHASE CONTENT ====================

  const renderPhaseContent = () => {
    if (!currentStep) return null;
    const phase = currentStep.data?.phase;

    switch (phase) {
      case "sub_same":
        return (
          <div
            key={animKey}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              animation: "fadeInUp 0.5s ease forwards",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 18,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <SubtractionVisual a={8} b={4} animDelay={200} />
              <SubtractionVisual a={9} b={5} animDelay={700} />
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <RuleCard
                operation="−"
                left="Even"
                right="Even"
                result="Even"
                isOdd={false}
                delay={1800}
                example="8 − 4 = 4"
              />
              <RuleCard
                operation="−"
                left="Odd"
                right="Odd"
                result="Even"
                isOdd={false}
                delay={2100}
                example="9 − 5 = 4"
              />
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: 13,
                color: DS.darkGray,
                fontFamily: DS.font,
                fontStyle: "italic",
                marginTop: 4,
                animation: "fadeInUp 0.5s ease 2.5s forwards",
                opacity: 0,
              }}
            >
              Same parity → the leftover dots always pair up perfectly!
            </div>
          </div>
        );

      case "sub_diff":
        return (
          <div
            key={animKey}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              animation: "fadeInUp 0.5s ease forwards",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 18,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <SubtractionVisual a={8} b={3} animDelay={200} />
              <SubtractionVisual a={7} b={4} animDelay={700} />
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <RuleCard
                operation="−"
                left="Even"
                right="Odd"
                result="Odd"
                isOdd={true}
                delay={1800}
                example="8 − 3 = 5"
              />
              <RuleCard
                operation="−"
                left="Odd"
                right="Even"
                result="Odd"
                isOdd={true}
                delay={2100}
                example="7 − 4 = 3"
              />
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: 13,
                color: DS.darkGray,
                fontFamily: DS.font,
                fontStyle: "italic",
                marginTop: 4,
                animation: "fadeInUp 0.5s ease 2.5s forwards",
                opacity: 0,
              }}
            >
              Different parity → there's always one unpaired dot left over!
            </div>
          </div>
        );

      case "sub_summary":
        return (
          <div
            key={animKey}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              animation: "fadeInUp 0.5s ease forwards",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontWeight: 700,
                fontSize: 17,
                fontFamily: DS.font,
                background: `linear-gradient(135deg, ${DS.indigo}, ${DS.deepPurple})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: -0.3,
                marginBottom: 4,
              }}
            >
              Subtraction Parity Rules
            </div>
            <RuleCard
              operation="−"
              left="Even"
              right="Even"
              result="Even"
              isOdd={false}
              delay={200}
              example="10 − 6 = 4"
            />
            <RuleCard
              operation="−"
              left="Odd"
              right="Odd"
              result="Even"
              isOdd={false}
              delay={350}
              example="11 − 7 = 4"
            />
            <RuleCard
              operation="−"
              left="Even"
              right="Odd"
              result="Odd"
              isOdd={true}
              delay={500}
              example="12 − 5 = 7"
            />
            <RuleCard
              operation="−"
              left="Odd"
              right="Even"
              result="Odd"
              isOdd={true}
              delay={650}
              example="9 − 2 = 7"
            />
            <div
              style={{
                textAlign: "center",
                padding: "14px 20px",
                borderRadius: DS.cardRadius,
                background: `linear-gradient(135deg, ${DS.evenBg}, ${DS.oddBg})`,
                border: `1.5px solid ${DS.indigo}18`,
                fontFamily: DS.font,
                fontSize: 14,
                color: DS.black,
                fontWeight: 600,
                animation: "fadeInUp 0.5s ease 1s forwards",
                opacity: 0,
                lineHeight: 1.7,
              }}
            >
              Just like addition: same parity →{" "}
              <span style={{ color: DS.evenColor, fontWeight: 700 }}>Even</span>
              {", "}different parity →{" "}
              <span style={{ color: DS.oddColor, fontWeight: 700 }}>Odd</span>
            </div>
          </div>
        );

      case "mul_grids":
        return (
          <div
            key={animKey}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              animation: "fadeInUp 0.5s ease forwards",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontWeight: 600,
                fontSize: 14,
                fontFamily: DS.font,
                color: DS.deepPurple,
              }}
            >
              Count the squares in each grid — is the total odd or even?
            </div>
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              <RectGrid
                rows={7}
                cols={5}
                label="7 × 5 (odd × odd)"
                animDelay={300}
                cellSize={16}
              />
              <RectGrid
                rows={4}
                cols={7}
                label="4 × 7 (even × odd)"
                animDelay={800}
                cellSize={16}
              />
              <RectGrid
                rows={6}
                cols={8}
                label="6 × 8 (even × even)"
                animDelay={1300}
                cellSize={16}
              />
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: 13,
                color: DS.darkGray,
                fontFamily: DS.font,
                fontStyle: "italic",
                animation: "fadeInUp 0.5s ease 2.5s forwards",
                opacity: 0,
              }}
            >
              Notice: the product is odd ONLY when <b>both</b> factors are odd!
            </div>
          </div>
        );

      case "mul_rules":
        return (
          <div
            key={animKey}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              animation: "fadeInUp 0.5s ease forwards",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontWeight: 700,
                fontSize: 17,
                fontFamily: DS.font,
                background: `linear-gradient(135deg, ${DS.indigo}, ${DS.deepPurple})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: -0.3,
                marginBottom: 4,
              }}
            >
              Multiplication Parity Rules
            </div>
            <RuleCard
              operation="×"
              left="Odd"
              right="Odd"
              result="Odd"
              isOdd={true}
              delay={200}
              example="3 × 5 = 15"
            />
            <RuleCard
              operation="×"
              left="Even"
              right="Even"
              result="Even"
              isOdd={false}
              delay={350}
              example="4 × 6 = 24"
            />
            <RuleCard
              operation="×"
              left="Odd"
              right="Even"
              result="Even"
              isOdd={false}
              delay={500}
              example="3 × 4 = 12"
            />
            <RuleCard
              operation="×"
              left="Even"
              right="Odd"
              result="Even"
              isOdd={false}
              delay={650}
              example="6 × 5 = 30"
            />

            <div
              style={{
                display: "flex",
                gap: 14,
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: 8,
                animation: "fadeInUp 0.5s ease 1s forwards",
                opacity: 0,
              }}
            >
              <div
                style={{
                  padding: "14px 20px",
                  borderRadius: DS.cardRadius,
                  backgroundColor: DS.oddBg,
                  border: `1.5px solid ${DS.orange}22`,
                  textAlign: "center",
                  maxWidth: 220,
                }}
              >
                <div
                  style={{
                    fontFamily: DS.font,
                    fontWeight: 700,
                    color: DS.oddColor,
                    fontSize: 14,
                  }}
                >
                  odd × odd = ODD
                </div>
                <div
                  style={{
                    fontFamily: DS.font,
                    fontSize: 11,
                    color: DS.darkGray,
                    marginTop: 6,
                    lineHeight: 1.5,
                  }}
                >
                  Think: classroom with odd rows &amp; odd columns of tiles
                </div>
              </div>
              <div
                style={{
                  padding: "14px 20px",
                  borderRadius: DS.cardRadius,
                  backgroundColor: DS.evenBg,
                  border: `1.5px solid ${DS.indigo}22`,
                  textAlign: "center",
                  maxWidth: 220,
                }}
              >
                <div
                  style={{
                    fontFamily: DS.font,
                    fontWeight: 700,
                    color: DS.evenColor,
                    fontSize: 14,
                  }}
                >
                  Any even factor → EVEN
                </div>
                <div
                  style={{
                    fontFamily: DS.font,
                    fontSize: 11,
                    color: DS.darkGray,
                    marginTop: 6,
                    lineHeight: 1.5,
                  }}
                >
                  Think: playground grid with one even side
                </div>
              </div>
            </div>
          </div>
        );

      case "connection":
        return (
          <div
            key={animKey}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              animation: "fadeInUp 0.5s ease forwards",
            }}
          >
            <ConnectionBridge animDelay={200} />
          </div>
        );

      default:
        return null;
    }
  };

  // ==================== RENDER ====================

  return (
    <div
      style={{
        width: "100%",
        maxWidth: config.width,
        margin: "0 auto",
        fontFamily: DS.font,
        backgroundColor: DS.white,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow:
          "0 8px 48px rgba(74,77,201,0.10), 0 2px 8px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* ═══ HEADER with gradient from design system ═══ */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.indigo} 0%, ${DS.deepPurple} 55%, ${DS.gradientOrange} 100%)`,
          padding: "22px 28px 20px",
          color: DS.white,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative geometric shapes from Singularity */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 20,
            animation: "floatSlow 5s ease infinite",
          }}
        >
          <GeoDecorator
            shape="circle"
            size={40}
            color={DS.white}
            filled
            style={{ opacity: 0.1 }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 70,
            animation: "floatSlow 6s ease infinite 0.5s",
          }}
        >
          <GeoDecorator
            shape="triangle"
            size={24}
            color={DS.white}
            style={{ opacity: 0.08 }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 120,
            animation: "floatSlow 7s ease infinite 1s",
          }}
        >
          <GeoDecorator
            shape="square"
            size={18}
            color={DS.white}
            style={{ opacity: 0.07 }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -8,
            left: -8,
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.04)",
          }}
        />

        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            opacity: 0.75,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Ganita Prakash · Grade 7 · Chapter 6
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: -0.5,
            lineHeight: 1.2,
          }}
        >
          Parity of Subtraction, Products
          <br />
          <span style={{ fontSize: 18, fontWeight: 600, opacity: 0.85 }}>
            &amp; Grid Squares
          </span>
        </div>
      </div>

      {/* ═══ STEP PROGRESS BAR ═══ */}
      {config.showStepIndicator && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            padding: "0 28px",
            height: 48,
            backgroundColor: DS.bgGray,
            borderBottom: `1px solid ${DS.borderGray}`,
          }}
        >
          {availableSteps.map((s, i) => {
            const isActive = i === currentStepIndex;
            const isDone = i < currentStepIndex;
            const sectionColor = s.data?.phase?.startsWith("sub")
              ? DS.indigo
              : DS.orange;

            return (
              <React.Fragment key={s.id}>
                <div
                  onClick={() => goToStep(i)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: DS.font,
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    backgroundColor: isActive
                      ? sectionColor
                      : isDone
                        ? sectionColor
                        : DS.white,
                    color: isActive || isDone ? DS.white : DS.midGray,
                    border: isActive
                      ? `2px solid ${sectionColor}`
                      : isDone
                        ? "none"
                        : `1.5px solid ${DS.borderGray}`,
                    transform: isActive ? "scale(1.15)" : "scale(1)",
                    boxShadow: isActive
                      ? `0 2px 12px ${sectionColor}33`
                      : "none",
                  }}
                >
                  {isDone ? "✓" : i + 1}
                </div>
                {i < availableSteps.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      backgroundColor: isDone ? sectionColor : DS.borderGray,
                      transition: "background-color 0.3s ease",
                      margin: "0 4px",
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* ═══ SECTION TAG + TITLE ═══ */}
      <div
        style={{
          padding: "18px 28px 0",
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        {/* Section badge */}
        <div
          style={{
            padding: "4px 12px",
            borderRadius: DS.btnRadius,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            flexShrink: 0,
            backgroundColor:
              phaseSection === "subtraction" ? DS.evenBg : DS.oddBg,
            color: phaseSection === "subtraction" ? DS.indigo : DS.orange,
            border: `1px solid ${phaseSection === "subtraction" ? DS.indigo + "22" : DS.orange + "22"}`,
          }}
        >
          {phaseSection === "subtraction"
            ? "− Subtraction"
            : "× Multiplication"}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: DS.black,
              letterSpacing: -0.3,
              lineHeight: 1.3,
            }}
          >
            {currentStep?.title}
          </div>
          <div
            style={{
              fontSize: 13,
              color: DS.darkGray,
              lineHeight: 1.5,
              marginTop: 4,
            }}
          >
            {currentStep?.description}
          </div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <div
        style={{
          flex: 1,
          padding: "18px 28px 20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: 280,
        }}
      >
        {renderPhaseContent()}
      </div>

      {/* ═══ NAVIGATION (Singularity button style) ═══ */}
      {config.showNavigation && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 28px 18px",
            borderTop: `1px solid ${DS.borderGray}`,
            backgroundColor: DS.bgGray,
          }}
        >
          <DSButton
            variant="outlined"
            color="primary"
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            icon={<ChevronLeft size={16} />}
          >
            Previous
          </DSButton>

          <DSButton
            variant="text"
            color="gray"
            onClick={resetStep}
            icon={<RotateCcw size={14} />}
          >
            Replay
          </DSButton>

          <DSButton
            variant="contained"
            color={currentStepIndex < totalSteps - 1 ? "primary" : "accent"}
            onClick={goNext}
            disabled={currentStepIndex === totalSteps - 1}
            icon={currentStepIndex < totalSteps - 1 ? undefined : undefined}
          >
            {currentStepIndex === totalSteps - 1 ? (
              "✓ Done!"
            ) : (
              <>
                Next <ChevronRight size={16} />
              </>
            )}
          </DSButton>
        </div>
      )}
    </div>
  );
};

export default ParityOperationsExplorer;
