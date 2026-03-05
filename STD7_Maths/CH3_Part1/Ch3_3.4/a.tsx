// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: decimal_place_value_tool.tsx
// Singularity Design System — Poppins, #4A4DC9, #FF7212, #533086→#FC9145
// ═══════════════════════════════════════════════════════════════════════════

// @ts-ignore - React types may be resolved by the host project
import React, { useState, useEffect, useCallback, useMemo } from "react";

// ==================== DESIGN TOKENS ====================
const DS = {
  purple: "#4A4DC9",
  orange: "#FF7212",
  gradPurple: "#533086",
  gradOrange: "#FC9145",
  dark: "#4E4E4E",
  gray: "#CACACA",
  lightGray: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  purpleTint: "#C1C1EA",
  orangeTint: "#FFF3E4",
  pad: 24,
  radius: 40,
  radiusSm: 16,
  radiusXs: 10,
  font: "'Poppins', 'Segoe UI', sans-serif",
};

// ==================== ICONS ====================
const SvgI: React.FC<{
  children: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 18, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      display: "inline-flex",
      verticalAlign: "middle",
      flexShrink: 0,
      ...style,
    }}
  >
    {children}
  </svg>
);
const IcoLeft: React.FC<{ size?: number }> = ({ size }) => (
  <SvgI size={size}>
    <path d="M15 18l-6-6 6-6" />
  </SvgI>
);
const IcoRight: React.FC<{ size?: number }> = ({ size }) => (
  <SvgI size={size}>
    <path d="M9 18l6-6-6-6" />
  </SvgI>
);
const IcoCheck: React.FC<{ size?: number }> = ({ size }) => (
  <SvgI size={size}>
    <path d="M20 6L9 17l-5-5" />
  </SvgI>
);
const IcoX: React.FC<{ size?: number }> = ({ size }) => (
  <SvgI size={size}>
    <path d="M18 6L6 18M6 6l12 12" />
  </SvgI>
);
const IcoPlay: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    style={{ display: "inline-flex", verticalAlign: "middle" }}
  >
    <polygon points="6,3 20,12 6,21" />
  </svg>
);
const IcoPause: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    style={{ display: "inline-flex", verticalAlign: "middle" }}
  >
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);
const IcoStar: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    style={{ display: "inline-flex", verticalAlign: "middle" }}
  >
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

// ==================== TYPES ====================
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
  type: string;
  mode: ModeType;
  data?: any;
}
interface DecimalPlaceValueAdditionalProps {
  decimalNumber?: number;
  showPlaceValueChart?: boolean;
  highlightPlace?:
    | "ones"
    | "tenths"
    | "hundredths"
    | "thousandths"
    | "tens"
    | "hundreds";
  showExpandedForm?: boolean;
  compareNumbers?: [number, number];
  conversionType?: string;
  conversionValue?: number;
  practiceQuestions?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}
interface DecimalPlaceValueToolProps {
  props?: {
    width?: number;
    height?: number;
    data?: any;
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
    additionalProps?: DecimalPlaceValueAdditionalProps;
  };
  setStepDetails?: (s: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (v: boolean) => void;
}

// ==================== DEFAULT STEPS ====================
const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Why Do We Need Decimals?",
    description:
      "When we measure things precisely, whole numbers aren't enough. A screw might be between 2 cm and 3 cm — we need a way to express parts of a unit. That's where decimals come in!",
    type: "intro",
    mode: "learn",
    data: { visual: "intro_ruler" },
  },
  {
    id: 2,
    title: "Tenths — Splitting into 10",
    description:
      "Divide 1 unit into 10 equal parts — each part is one-tenth (1/10 = 0.1). So 3 and 4 tenths is written as 3.4, meaning 3 + 4 × (1/10).",
    type: "explanation",
    mode: "learn",
    data: { visual: "tenths", decimalNumber: 3.4 },
  },
  {
    id: 3,
    title: "Hundredths — Even Smaller",
    description:
      "Each tenth splits into 10 parts giving hundredths (1/100 = 0.01). 4.45 means 4 units + 4 tenths + 5 hundredths.",
    type: "explanation",
    mode: "learn",
    data: { visual: "hundredths", decimalNumber: 4.45 },
  },
  {
    id: 4,
    title: "Thousandths — Deeper Still",
    description:
      "Splitting each hundredth into 10 gives thousandths (1/1000 = 0.001). 7.385 = 7 + 3/10 + 8/100 + 5/1000.",
    type: "explanation",
    mode: "learn",
    data: { visual: "thousandths", decimalNumber: 7.385 },
  },
  {
    id: 5,
    title: "The Place Value Chart",
    description:
      "Each place is 10× the one to its right. The decimal point separates whole numbers from fractions.",
    type: "explanation",
    mode: "learn",
    data: { visual: "place_value_chart", decimalNumber: 285.347 },
  },
  {
    id: 6,
    title: "Reading Decimal Numbers",
    description:
      "70.5 → 'seventy point five'. 7.05 → 'seven point zero five'. 0.274 → 'zero point two seven four'.",
    type: "explanation",
    mode: "learn",
    data: { visual: "reading_decimals" },
  },
  {
    id: 10,
    title: "Identify the Place Value",
    description: "What does each digit represent based on its position?",
    type: "practice",
    mode: "practice",
    data: {
      decimalNumber: 36.72,
      questions: [
        {
          question: "What is the place value of 7 in 36.72?",
          options: ["7 ones", "7 tenths", "7 hundredths", "7 tens"],
          correctIndex: 1,
          explanation: "7 is in the tenths place → 7/10 = 0.7",
        },
      ],
    },
  },
  {
    id: 11,
    title: "Fractions → Decimals",
    description: "Convert the fraction into decimal form.",
    type: "practice",
    mode: "practice",
    data: {
      questions: [
        {
          question: "Write 5/100 as a decimal",
          options: ["0.5", "0.05", "5.0", "0.005"],
          correctIndex: 1,
          explanation: "5/100 = 5 hundredths = 0.05",
        },
      ],
    },
  },
  {
    id: 12,
    title: "Compare Decimals",
    description: "Which decimal number is greater?",
    type: "practice",
    mode: "practice",
    data: {
      questions: [
        {
          question: "Which is greater: 6.456 or 6.465?",
          options: ["6.456", "6.465", "They are equal"],
          correctIndex: 1,
          explanation: "Same units & tenths, but 6.465 has 6 hundredths vs 5.",
        },
      ],
    },
  },
  {
    id: 13,
    title: "Expanded Form",
    description: "Express the number using place values.",
    type: "practice",
    mode: "practice",
    data: {
      questions: [
        {
          question: "Expanded form of 9.23?",
          options: [
            "9 + 2/10 + 3/100",
            "9 + 23/10",
            "92 + 3/10",
            "9 + 2/100 + 3/1000",
          ],
          correctIndex: 0,
          explanation: "9.23 = 9 ones + 2 tenths + 3 hundredths",
        },
      ],
    },
  },
  {
    id: 14,
    title: "Add & Subtract",
    description: "Solve by aligning place values.",
    type: "practice",
    mode: "practice",
    data: {
      questions: [
        {
          question: "5.3 + 2.6 = ?",
          options: ["7.9", "7.09", "8.9", "7.0"],
          correctIndex: 0,
          explanation: "Ones: 5+2=7, Tenths: 3+6=9 → 7.9",
        },
      ],
    },
  },
  {
    id: 20,
    title: "Length: mm ↔ cm",
    description: "1 cm = 10 mm, so 1 mm = 0.1 cm. A human hair ≈ 0.1 mm thick!",
    type: "real_world",
    mode: "real_world",
    data: { conversion: { from: "mm", to: "cm", factor: 0.1 } },
  },
  {
    id: 21,
    title: "Length: cm ↔ m",
    description:
      "1 m = 100 cm, so 1 cm = 0.01 m. A hummingbird egg ≈ 1.3 cm (0.013 m).",
    type: "real_world",
    mode: "real_world",
    data: { conversion: { from: "cm", to: "m", factor: 0.01 } },
  },
  {
    id: 22,
    title: "Weight: g ↔ kg",
    description: "1 kg = 1000 g, so 1 g = 0.001 kg. A 254 g apple = 0.254 kg.",
    type: "real_world",
    mode: "real_world",
    data: { conversion: { from: "g", to: "kg", factor: 0.001 } },
  },
  {
    id: 23,
    title: "Money: ₹ & Paise",
    description:
      "₹1 = 100 paise → 1 paisa = ₹0.01. In the 1970s, a dosa cost 50 paise!",
    type: "real_world",
    mode: "real_world",
    data: { conversion: { from: "paise", to: "₹", factor: 0.01 } },
  },
  {
    id: 24,
    title: "Decimal Disasters!",
    description:
      "Amsterdam (2013): sent €188M instead of €1.8M — cents vs euros! Air Canada (1983): half fuel loaded — lbs vs kg!",
    type: "real_world",
    mode: "real_world",
    data: {},
  },
];

// ==================== MAIN COMPONENT ====================
type PropsShape = NonNullable<DecimalPlaceValueToolProps["props"]>;
const DecimalPlaceValueTool: React.FC<DecimalPlaceValueToolProps> = ({
  props = {} as PropsShape,
  setStepDetails,
  stopAutoNext,
}) => {
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 700,
      initialMode: (props.initialMode ?? "learn") as ModeType,
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: (props.enabledModes ?? [
        "learn",
        "practice",
        "real_world",
      ]) as ModeType[],
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      initialStep: props.initialStep ?? 1,
      filterSteps: props.filterSteps ?? (null as number[] | null),
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration: props.autoPlayDuration ?? 0,
    }),
    [props],
  );

  const ap = props.additionalProps || {};
  const allSteps = props.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(
    () =>
      config.filterSteps?.length
        ? allSteps.filter((s) => config.filterSteps!.includes(s.id))
        : allSteps,
    [allSteps, config.filterSteps],
  );

  const [mode, setMode] = useState<ModeType>(config.initialMode);
  const [stepIdx, setStepIdx] = useState(() => {
    const s = availableSteps.filter((x) => x.mode === config.initialMode);
    const i = s.findIndex((x) => x.id === config.initialStep);
    return i >= 0 ? i : 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [contentVis, setContentVis] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [convInput, setConvInput] = useState("");
  const [convResult, setConvResult] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const steps = useMemo(
    () => availableSteps.filter((s) => s.mode === mode),
    [availableSteps, mode],
  );
  const step = steps[stepIdx] || steps[0];

  // Inject keyframes + font
  useEffect(() => {
    const css = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
@keyframes dpv-fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes dpv-popIn{0%{transform:scale(0);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
@keyframes dpv-slideR{from{transform:translateX(-100%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes dpv-glow{0%,100%{box-shadow:0 0 0 0 #4A4DC900}50%{box-shadow:0 0 0 8px #4A4DC930}}
@keyframes dpv-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes dpv-shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
@keyframes dpv-correct{0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}
@keyframes dpv-gradMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}`;
    const el = document.createElement("style");
    el.id = "dpv-kf";
    el.textContent = css;
    document.head.appendChild(el);
    return () => {
      document.getElementById("dpv-kf")?.remove();
    };
  }, []);

  useEffect(() => {
    setStepDetails?.({
      currentStep: stepIdx + 1,
      totalSteps: steps.length,
      isPaused: !isPlaying,
      currentMode: mode,
    });
  }, [stepIdx, steps.length, isPlaying, mode]);
  useEffect(() => {
    if (!isPlaying || stopAutoNext || !config.autoPlayDuration) return;
    const t = setTimeout(() => {
      if (stepIdx < steps.length - 1) goStep("next");
      else setIsPlaying(false);
    }, config.autoPlayDuration);
    return () => clearTimeout(t);
  }, [isPlaying, stepIdx, stopAutoNext, steps.length, config.autoPlayDuration]);
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setConvInput("");
    setConvResult(null);
  }, [stepIdx, mode]);

  const goStep = useCallback(
    (dir: "next" | "prev") => {
      if (transitioning) return;
      setTransitioning(true);
      setContentVis(false);
      setTimeout(() => {
        setStepIdx((p) => (dir === "next" ? p + 1 : p - 1));
        setTimeout(() => {
          setContentVis(true);
          setTransitioning(false);
        }, 60);
      }, 220);
    },
    [transitioning],
  );

  const switchMode = (m: ModeType) => {
    if (m === mode) return;
    setTransitioning(true);
    setContentVis(false);
    setTimeout(() => {
      setMode(m);
      setStepIdx(0);
      setScore(0);
      setAttempts(0);
      setTimeout(() => {
        setContentVis(true);
        setTransitioning(false);
      }, 60);
    }, 220);
  };

  const modeP: Record<ModeType, { bg: string; label: string; emoji: string }> =
    {
      learn: { bg: DS.purple, label: "Learn", emoji: "📖" },
      practice: { bg: DS.orange, label: "Practice", emoji: "🎯" },
      real_world: { bg: DS.gradPurple, label: "Real World", emoji: "⚡" },
    };

  // ─── SINGULARITY BUTTON ───
  const SBtn: React.FC<{
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    variant?: "contained" | "outlined" | "highlight";
    color?: string;
    style?: React.CSSProperties;
  }> = ({
    children,
    onClick,
    disabled,
    variant = "contained",
    color = DS.purple,
    style: sx,
  }) => {
    const [st, setSt] = useState<"idle" | "hover" | "pressed">("idle");
    const base: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "10px 24px",
      borderRadius: DS.radius,
      border: "none",
      fontFamily: DS.font,
      fontWeight: 600,
      fontSize: 14,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
      opacity: disabled ? 0.45 : 1,
      outline: "none",
      userSelect: "none" as const,
    };
    let sp: React.CSSProperties = {};
    if (variant === "contained")
      sp = {
        background: color,
        color: DS.white,
        boxShadow:
          st === "hover"
            ? `0 6px 20px ${color}50`
            : st === "pressed"
              ? `0 2px 8px ${color}30`
              : `0 3px 12px ${color}30`,
        transform:
          st === "pressed"
            ? "scale(0.96)"
            : st === "hover"
              ? "scale(1.04)"
              : "scale(1)",
      };
    else if (variant === "outlined")
      sp = {
        background: "transparent",
        color,
        border: `2px solid ${color}`,
        transform:
          st === "pressed"
            ? "scale(0.96)"
            : st === "hover"
              ? "scale(1.03)"
              : "scale(1)",
        boxShadow: st === "hover" ? `0 4px 16px ${color}20` : "none",
      };
    else
      sp = {
        background: DS.orange,
        color: DS.white,
        boxShadow:
          st === "hover"
            ? `0 6px 20px ${DS.orange}50`
            : `0 3px 12px ${DS.orange}30`,
        transform:
          st === "pressed"
            ? "scale(0.96)"
            : st === "hover"
              ? "scale(1.04)"
              : "scale(1)",
      };
    return (
      <button
        onClick={disabled ? undefined : onClick}
        style={{ ...base, ...sp, ...sx }}
        onMouseEnter={() => !disabled && setSt("hover")}
        onMouseLeave={() => setSt("idle")}
        onMouseDown={() => !disabled && setSt("pressed")}
        onMouseUp={() => !disabled && setSt("hover")}
      >
        {children}
      </button>
    );
  };

  // ─── PLACE VALUE CHART ───
  const PlaceValueChart: React.FC<{ num: number; hl?: string }> = ({
    num,
    hl,
  }) => {
    const s = num.toString().split(".");
    const w = s[0] || "0";
    const f = (s[1] || "").padEnd(3, "0").slice(0, 3);
    const wd = w.padStart(3, " ").split("");
    const fd = f.split("");
    const names = [
      "Hundreds",
      "Tens",
      "Ones",
      "•",
      "Tenths",
      "Hundredths",
      "Thousandths",
    ];
    const keys = [
      "hundreds",
      "tens",
      "ones",
      "point",
      "tenths",
      "hundredths",
      "thousandths",
    ];
    const vals = ["×100", "×10", "×1", "", "×0.1", "×0.01", "×0.001"];
    const cols = [
      DS.orange,
      "#E85D04",
      "#DC2626",
      "",
      DS.purple,
      "#3730A3",
      DS.gradPurple,
    ];
    const all = [...wd, ".", ...fd];
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 5,
          padding: "12px 4px",
          flexWrap: "wrap",
        }}
      >
        {all.map((d, i) => {
          if (d === " ") return null;
          const isP = d === ".";
          const isHl = hl === keys[i];
          const c = cols[i] || DS.dark;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                animation: `dpv-popIn 0.35s ease-out ${i * 0.07}s both`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: isP ? "transparent" : c,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  fontFamily: DS.font,
                }}
              >
                {names[i]}
              </div>
              <div
                style={{
                  width: isP ? 20 : 50,
                  height: 56,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isP ? 26 : 30,
                  fontWeight: 800,
                  fontFamily: DS.font,
                  color: isP ? DS.gray : DS.white,
                  background: isP
                    ? "transparent"
                    : `linear-gradient(135deg, ${c}, ${c}cc)`,
                  borderRadius: DS.radiusXs,
                  boxShadow: isP ? "none" : `0 4px 14px ${c}35`,
                  animation: isHl
                    ? "dpv-glow 1.4s ease-in-out infinite"
                    : "none",
                  border: isHl ? `3px solid ${c}` : "2px solid transparent",
                }}
              >
                {d}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: DS.gray,
                  fontWeight: 500,
                  fontFamily: DS.font,
                }}
              >
                {vals[i]}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ─── EXPANDED FORM ───
  const ExpandedForm: React.FC<{ num: number }> = ({ num }) => {
    const parts: { expr: string; val: string; color: string }[] = [];
    const [w, f] = num.toString().split(".");
    const n = parseInt(w);
    const h = Math.floor(n / 100),
      t = Math.floor((n % 100) / 10),
      o = n % 10;
    if (h)
      parts.push({ expr: `${h}×100`, val: `${h * 100}`, color: DS.orange });
    if (t) parts.push({ expr: `${t}×10`, val: `${t * 10}`, color: "#E85D04" });
    if (o) parts.push({ expr: `${o}×1`, val: `${o}`, color: "#DC2626" });
    if (f) {
      const fc = [DS.purple, "#3730A3", DS.gradPurple],
        fd = [10, 100, 1000];
      f.split("").forEach((d, i) => {
        if (parseInt(d) > 0 && i < 3)
          parts.push({
            expr: `${d}×1/${fd[i]}`,
            val: `${parseInt(d) / fd[i]}`,
            color: fc[i],
          });
      });
    }
    return (
      <div style={{ padding: "10px 0" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: DS.dark,
            marginBottom: 8,
            fontFamily: DS.font,
          }}
        >
          Expanded Form of <span style={{ color: DS.purple }}>{num}</span>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
          }}
        >
          {parts.map((p, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <span style={{ fontSize: 18, fontWeight: 800, color: DS.gray }}>
                  +
                </span>
              )}
              <div
                style={{
                  padding: "8px 14px",
                  background: `${p.color}10`,
                  border: `2px solid ${p.color}30`,
                  borderRadius: DS.radiusXs,
                  animation: `dpv-fadeIn 0.35s ease-out ${i * 0.12}s both`,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: p.color,
                    fontFamily: DS.font,
                  }}
                >
                  {p.expr}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: DS.dark,
                    textAlign: "center",
                    fontFamily: DS.font,
                  }}
                >
                  = {p.val}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // ─── TENTHS BAR ───
  const TenthsBar: React.FC<{ num: number }> = ({ num }) => {
    const whole = Math.floor(num),
      tenths = Math.round((num - whole) * 10);
    const bars: React.ReactNode[] = [];
    for (let u = 0; u < whole; u++)
      bars.push(
        <div
          key={`w${u}`}
          style={{
            display: "flex",
            gap: 2,
            animation: `dpv-fadeIn 0.3s ease-out ${u * 0.08}s both`,
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 32,
                background: `linear-gradient(135deg,${DS.purple},${DS.gradPurple})`,
                borderRadius: 4,
                animation: `dpv-popIn 0.25s ease-out ${(u * 10 + i) * 0.015}s both`,
              }}
            />
          ))}
        </div>,
      );
    if (tenths > 0)
      bars.push(
        <div
          key="f"
          style={{
            display: "flex",
            gap: 2,
            animation: `dpv-fadeIn 0.3s ease-out ${whole * 0.08 + 0.1}s both`,
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 32,
                borderRadius: 4,
                background:
                  i < tenths
                    ? `linear-gradient(135deg,${DS.orange},${DS.gradOrange})`
                    : DS.lightGray,
                border: i >= tenths ? `1px dashed ${DS.gray}` : "none",
                animation: `dpv-popIn 0.25s ease-out ${(whole * 10 + i) * 0.015 + 0.15}s both`,
              }}
            />
          ))}
        </div>,
      );
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "6px 0",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>{bars}</div>
        <div style={{ fontSize: 13, color: DS.dark, fontFamily: DS.font }}>
          <b style={{ color: DS.purple }}>
            {whole} unit{whole !== 1 ? "s" : ""}
          </b>
          {tenths > 0 && (
            <>
              {" "}
              + <b style={{ color: DS.orange }}>{tenths} tenths</b>
            </>
          )}
          {" = "}
          <b>{num}</b>
        </div>
      </div>
    );
  };

  // ─── CONVERSION WIDGET ───
  const ConversionWidget: React.FC<{ data: any }> = ({ data }) => {
    const c = data?.conversion;
    if (!c)
      return (
        <div
          style={{
            padding: 20,
            textAlign: "center",
            color: DS.dark,
            fontFamily: DS.font,
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          {step.description}
        </div>
      );
    const dec = c.factor < 0.01 ? 3 : c.factor < 0.1 ? 2 : 1;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div
          style={{
            padding: "12px 18px",
            background: DS.purpleTint + "50",
            borderRadius: DS.radiusXs,
            border: `2px solid ${DS.purpleTint}`,
            fontSize: 15,
            fontWeight: 700,
            color: DS.purple,
            fontFamily: DS.font,
            animation: "dpv-fadeIn 0.4s ease-out",
          }}
        >
          1 {c.from} = {c.factor} {c.to}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {[5, 12, 254].map((v, i) => (
            <div
              key={i}
              style={{
                flex: "1 1 130px",
                padding: 14,
                background: DS.white,
                borderRadius: DS.radiusXs,
                border: `1.5px solid ${DS.lightGray}`,
                animation: `dpv-fadeIn 0.35s ease-out ${i * 0.1 + 0.15}s both`,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: DS.gray,
                  fontFamily: DS.font,
                  fontWeight: 500,
                }}
              >
                {v} {c.from}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: DS.dark,
                  fontFamily: DS.font,
                  marginTop: 2,
                }}
              >
                = {(v * c.factor).toFixed(dec)} {c.to}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="number"
            placeholder={`Enter ${c.from}`}
            value={convInput}
            onChange={(e) => {
              setConvInput(e.target.value);
              const v = parseFloat(e.target.value);
              setConvResult(
                !isNaN(v) ? (v * c.factor).toFixed(dec) + " " + c.to : null,
              );
            }}
            style={{
              flex: 1,
              padding: "11px 16px",
              borderRadius: DS.radiusXs,
              border: `2px solid ${DS.lightGray}`,
              fontSize: 15,
              fontFamily: DS.font,
              fontWeight: 500,
              outline: "none",
              transition: "border 0.25s",
            }}
            onFocus={(e) => (e.target.style.borderColor = DS.purple)}
            onBlur={(e) => (e.target.style.borderColor = DS.lightGray)}
          />
          <span
            style={{
              fontSize: 14,
              color: DS.gray,
              fontFamily: DS.font,
              fontWeight: 600,
            }}
          >
            {c.from} =
          </span>
          <div
            style={{
              padding: "11px 18px",
              borderRadius: DS.radiusXs,
              background: convResult ? DS.orangeTint : DS.offWhite,
              fontWeight: 700,
              fontSize: 15,
              fontFamily: DS.font,
              color: convResult ? DS.orange : DS.gray,
              minWidth: 90,
              textAlign: "center",
              transition: "all 0.25s",
            }}
          >
            {convResult || "?"}
          </div>
        </div>
      </div>
    );
  };

  // ─── QUIZ WIDGET ───
  const QuizWidget: React.FC<{ questions: any[] }> = ({ questions }) => {
    const q = questions?.[0];
    if (!q) return null;
    const pick = (i: number) => {
      if (showResult) return;
      setSelectedAnswer(i);
      setShowResult(true);
      setAttempts((p) => p + 1);
      if (i === q.correctIndex) setScore((p) => p + 1);
    };
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div
          style={{
            padding: "14px 18px",
            background: DS.orangeTint,
            borderRadius: DS.radiusXs,
            border: `2px solid ${DS.gradOrange}40`,
            fontSize: 15,
            fontWeight: 700,
            color: "#7C2D12",
            fontFamily: DS.font,
            animation: "dpv-fadeIn 0.35s ease-out",
          }}
        >
          {q.question}
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          {q.options.map((opt: string, i: number) => {
            const sel = selectedAnswer === i,
              cor = i === q.correctIndex;
            let bg = DS.white,
              bd = `2px solid ${DS.lightGray}`,
              cl = DS.dark,
              an = "";
            if (showResult) {
              if (cor) {
                bg = "#DCFCE7";
                bd = "2px solid #22C55E";
                cl = "#166534";
                if (sel) an = "dpv-correct 0.45s ease-out";
              } else if (sel) {
                bg = "#FEF2F2";
                bd = "2px solid #EF4444";
                cl = "#991B1B";
                an = "dpv-shake 0.45s ease-out";
              }
            }
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                onMouseEnter={() => !showResult && setHoverId(`q${i}`)}
                onMouseLeave={() => setHoverId(null)}
                style={{
                  padding: "13px 14px",
                  borderRadius: DS.radiusXs,
                  background: bg,
                  border: bd,
                  color: cl,
                  cursor: showResult ? "default" : "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                  fontFamily: DS.font,
                  transition: "all 0.2s",
                  animation:
                    an || `dpv-fadeIn 0.25s ease-out ${i * 0.06}s both`,
                  transform: hoverId === `q${i}` ? "scale(1.03)" : "scale(1)",
                  textAlign: "left" as const,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    marginRight: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    background:
                      showResult && cor
                        ? "#22C55E"
                        : showResult && sel
                          ? "#EF4444"
                          : DS.offWhite,
                    color: showResult && (cor || sel) ? DS.white : DS.dark,
                  }}
                >
                  {showResult && cor ? (
                    <IcoCheck size={13} />
                  ) : showResult && sel ? (
                    <IcoX size={13} />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
        {showResult && (
          <div
            style={{
              padding: "13px 16px",
              borderRadius: DS.radiusXs,
              background:
                selectedAnswer === q.correctIndex ? "#F0FDF4" : "#FEF2F2",
              border: `1px solid ${selectedAnswer === q.correctIndex ? "#86EFAC" : "#FECACA"}`,
              animation: "dpv-fadeIn 0.3s ease-out",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 14,
                color:
                  selectedAnswer === q.correctIndex ? "#166534" : "#991B1B",
                fontFamily: DS.font,
                marginBottom: 3,
              }}
            >
              {selectedAnswer === q.correctIndex
                ? "✨ Correct!"
                : "✗ Not quite!"}
            </div>
            <div
              style={{
                fontSize: 13,
                color: DS.dark,
                fontFamily: DS.font,
                lineHeight: 1.5,
              }}
            >
              {q.explanation}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── RENDER VISUAL ───
  const renderVisual = () => {
    const d = step?.data || {};
    const vis = d.visual;
    const dn = ap.decimalNumber ?? d.decimalNumber;

    if (mode === "practice") {
      const qs = ap.practiceQuestions || d.questions;
      return (
        <>
          {d.decimalNumber && <PlaceValueChart num={d.decimalNumber} />}
          {qs && <QuizWidget questions={qs} />}
        </>
      );
    }
    if (mode === "real_world") return <ConversionWidget data={d} />;

    switch (vis) {
      case "intro_ruler":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: 52,
                background: `linear-gradient(90deg,${DS.orangeTint},#FDE68A)`,
                borderRadius: 8,
                position: "relative",
                border: `2px solid ${DS.gradOrange}60`,
                animation: "dpv-fadeIn 0.4s ease-out",
                overflow: "hidden",
              }}
            >
              {Array.from({ length: 11 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${i * 10}%`,
                    top: 0,
                    height: i % 5 === 0 ? "100%" : "45%",
                    width: 2,
                    background: "#92400E",
                    animation: `dpv-popIn 0.25s ease-out ${i * 0.04}s both`,
                  }}
                >
                  {i % 5 === 0 && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: -20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#92400E",
                        fontFamily: DS.font,
                      }}
                    >
                      {i}
                    </div>
                  )}
                </div>
              ))}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: -26,
                  width: "27%",
                  height: 18,
                  background: `linear-gradient(90deg,${DS.gray},#9CA3AF)`,
                  borderRadius: "2px 8px 8px 2px",
                  animation: "dpv-slideR 0.5s ease-out 0.2s both",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: -48,
                  width: "32%",
                  height: 18,
                  background: "linear-gradient(90deg,#78716C,#57534E)",
                  borderRadius: "2px 8px 8px 2px",
                  animation: "dpv-slideR 0.5s ease-out 0.35s both",
                }}
              />
            </div>
            <div style={{ marginTop: 20, display: "flex", gap: 16 }}>
              {[
                { l: "Screw A", v: "2.7 cm" },
                { l: "Screw B", v: "3.2 cm" },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 20px",
                    background: DS.offWhite,
                    borderRadius: DS.radiusXs,
                    border: `1.5px solid ${DS.lightGray}`,
                    animation: `dpv-fadeIn 0.35s ease-out ${0.5 + i * 0.1}s both`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: DS.gray,
                      fontFamily: DS.font,
                      fontWeight: 600,
                    }}
                  >
                    {s.l}
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: DS.dark,
                      fontFamily: DS.font,
                    }}
                  >
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "tenths":
        return (
          <>
            <TenthsBar num={dn || 3.4} />
            <PlaceValueChart num={dn || 3.4} hl="tenths" />
          </>
        );
      case "hundredths":
        return (
          <>
            <TenthsBar num={dn || 4.45} />
            <PlaceValueChart num={dn || 4.45} hl="hundredths" />
            <ExpandedForm num={dn || 4.45} />
          </>
        );
      case "thousandths":
        return (
          <>
            <PlaceValueChart num={dn || 7.385} hl="thousandths" />
            <ExpandedForm num={dn || 7.385} />
          </>
        );
      case "place_value_chart":
        return (
          <>
            <PlaceValueChart num={dn || 285.347} />
            <ExpandedForm num={dn || 285.347} />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 3,
                alignItems: "center",
                padding: 10,
                flexWrap: "wrap",
                animation: "dpv-fadeIn 0.4s ease-out 0.4s both",
              }}
            >
              {["1000", "100", "10", "1", "•", "0.1", "0.01", "0.001"].map(
                (v, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && i !== 4 && (
                      <span
                        style={{
                          fontSize: 9,
                          color: DS.gray,
                          margin: "0 1px",
                          fontFamily: DS.font,
                        }}
                      >
                        {i < 4 ? "×10←" : "→÷10"}
                      </span>
                    )}
                    <div
                      style={{
                        padding: v === "•" ? "3px 5px" : "5px 9px",
                        background:
                          v === "•"
                            ? "transparent"
                            : i < 4
                              ? DS.orangeTint
                              : DS.purpleTint + "60",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: DS.font,
                        color:
                          v === "•" ? DS.gray : i < 4 ? DS.orange : DS.purple,
                        border:
                          v === "•"
                            ? "none"
                            : `1px solid ${i < 4 ? DS.gradOrange + "40" : DS.purpleTint}`,
                      }}
                    >
                      {v}
                    </div>
                  </React.Fragment>
                ),
              )}
            </div>
          </>
        );
      case "reading_decimals":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { n: "705", r: "Seven hundred and five", v: "700 + 0 + 5" },
              { n: "70.5", r: "Seventy point five", v: "70 + 0.5" },
              { n: "7.05", r: "Seven point zero five", v: "7 + 0.05" },
              {
                n: "0.274",
                r: "Zero point two seven four",
                v: "0.2 + 0.07 + 0.004",
              },
            ].map((e, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 16px",
                  background: DS.white,
                  borderRadius: DS.radiusXs,
                  border: `1.5px solid ${DS.lightGray}`,
                  animation: `dpv-fadeIn 0.3s ease-out ${i * 0.1}s both`,
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: DS.purple,
                    fontFamily: "Courier New, monospace",
                    minWidth: 70,
                  }}
                >
                  {e.n}
                </div>
                <div style={{ flex: 1, fontFamily: DS.font }}>
                  <div
                    style={{ fontSize: 14, fontWeight: 600, color: DS.dark }}
                  >
                    "{e.r}"
                  </div>
                  <div style={{ fontSize: 12, color: DS.gray }}>= {e.v}</div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        if (dn)
          return (
            <>
              <PlaceValueChart num={dn} hl={ap.highlightPlace} />
              {ap.showExpandedForm !== false && <ExpandedForm num={dn} />}
            </>
          );
        return null;
    }
  };

  // ═══════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════
  const mp = modeP[mode];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: config.width,
        margin: "0 auto",
        background: DS.white,
        borderRadius: DS.radiusSm,
        overflow: "hidden",
        boxShadow:
          "0 8px 40px rgba(74,77,201,0.10), 0 1.5px 6px rgba(0,0,0,0.04)",
        fontFamily: DS.font,
      }}
    >
      {/* MODE TABS */}
      {config.showModeSelector && (
        <div
          style={{
            display: "flex",
            gap: 10,
            padding: `${DS.pad}px`,
            background: DS.offWhite,
            borderBottom: `1.5px solid ${DS.lightGray}`,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {config.enabledModes.map((m) => {
            const p = modeP[m];
            const sel = mode === m;
            return (
              <SBtn
                key={m}
                onClick={() => switchMode(m)}
                variant={sel ? "contained" : "outlined"}
                color={p.bg}
              >
                <span style={{ fontSize: 15 }}>{p.emoji}</span> {p.label}
              </SBtn>
            );
          })}
          {mode === "practice" && attempts > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "8px 16px",
                background: DS.orangeTint,
                borderRadius: DS.radius,
                fontSize: 13,
                fontWeight: 700,
                color: DS.orange,
                animation: "dpv-pulse 2s infinite",
              }}
            >
              <IcoStar size={15} /> {score}/{attempts}
            </div>
          )}
        </div>
      )}

      {/* HEADER */}
      <div
        style={{
          padding: `${DS.pad}px ${DS.pad}px 20px`,
          color: DS.white,
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg,${DS.gradPurple},${mp.bg},${DS.gradOrange})`,
          backgroundSize: "200% 200%",
          animation: "dpv-gradMove 8s ease infinite",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            margin: "0 0 6px",
            lineHeight: 1.35,
            animation: "dpv-fadeIn 0.4s ease-out",
            fontFamily: DS.font,
            position: "relative",
          }}
        >
          {step?.title}
        </h2>
        {config.showStepIndicator && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(255,255,255,0.18)",
              padding: "4px 14px",
              borderRadius: DS.radius,
              fontSize: 12,
              fontWeight: 600,
              backdropFilter: "blur(8px)",
              position: "relative",
            }}
          >
            Step {stepIdx + 1} / {steps.length}
          </span>
        )}
      </div>

      {/* PROGRESS BAR */}
      <div style={{ height: 4, background: DS.lightGray, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            background: `linear-gradient(90deg,${DS.purple},${DS.orange})`,
            transition: "width 0.45s ease-out",
            width: `${((stepIdx + 1) / steps.length) * 100}%`,
          }}
        />
      </div>

      {/* CONTENT */}
      <div
        style={{
          padding: DS.pad,
          minHeight: 280,
          opacity: contentVis ? 1 : 0,
          transform: contentVis ? "translateY(0)" : "translateY(14px)",
          transition: `all ${220 / config.animationSpeed}ms cubic-bezier(.4,0,.2,1)`,
        }}
      >
        <div
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: DS.dark,
            fontFamily: DS.font,
            padding: "14px 18px",
            background: DS.offWhite,
            borderRadius: DS.radiusXs,
            borderLeft: `4px solid ${mode === "learn" ? DS.purple : mode === "practice" ? DS.orange : DS.gradPurple}`,
            marginBottom: 18,
            animation: "dpv-fadeIn 0.35s ease-out",
          }}
        >
          {step?.description}
        </div>
        {renderVisual()}
      </div>

      {/* NAVIGATION */}
      {(config.showNavigation || config.showPlayPause) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: `16px ${DS.pad}px`,
            background: DS.offWhite,
            borderTop: `1.5px solid ${DS.lightGray}`,
          }}
        >
          {config.showNavigation ? (
            <SBtn
              onClick={() => goStep("prev")}
              disabled={stepIdx === 0}
              variant="outlined"
              color={DS.purple}
            >
              <IcoLeft size={16} /> Prev
            </SBtn>
          ) : (
            <div />
          )}
          {config.showPlayPause && config.autoPlayDuration > 0 && (
            <SBtn
              onClick={() => setIsPlaying(!isPlaying)}
              variant="contained"
              color={DS.purple}
            >
              {isPlaying ? <IcoPause size={16} /> : <IcoPlay size={16} />}
              {isPlaying ? "Pause" : "Play"}
            </SBtn>
          )}
          {config.showNavigation ? (
            <SBtn
              onClick={() => goStep("next")}
              disabled={stepIdx === steps.length - 1}
              variant="highlight"
            >
              Next <IcoRight size={16} />
            </SBtn>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
};

export default DecimalPlaceValueTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
