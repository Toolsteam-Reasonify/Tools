// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: units_of_measurement_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

// @ts-ignore - React module (install react and @types/react in the project)
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ==================== INLINE SVG ICONS (no lucide-react dependency) ====================

const Icon = ({
  d,
  size = 16,
  sw = 2,
  ...p
}: {
  d: string;
  size?: number;
  sw?: number;
  [k: string]: any;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d={d} />
  </svg>
);
const IconMulti = ({
  paths,
  size = 16,
  sw = 2,
  ...p
}: {
  paths: string[];
  size?: number;
  sw?: number;
  [k: string]: any;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    {paths.map((d, i) => (
      <path key={i} d={d} />
    ))}
  </svg>
);

const BookOpen = ({ size = 16 }: { size?: number }) => (
  <IconMulti
    size={size}
    paths={[
      "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",
      "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
    ]}
  />
);
const Target = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const Zap = ({ size = 16 }: { size?: number }) => (
  <Icon size={size} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
);
const Star = ({ size = 16 }: { size?: number }) => (
  <Icon
    size={size}
    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
  />
);
const Check = ({ size = 16 }: { size?: number }) => (
  <Icon size={size} d="M20 6L9 17l-5-5" />
);
const X = ({ size = 16 }: { size?: number }) => (
  <IconMulti size={size} paths={["M18 6L6 18", "M6 6l12 12"]} />
);
const ChevronLeft = ({ size = 16 }: { size?: number }) => (
  <Icon size={size} d="M15 18l-6-6 6-6" />
);
const ChevronRight = ({ size = 16 }: { size?: number }) => (
  <Icon size={size} d="M9 18l6-6-6-6" />
);
const Play = ({ size = 16 }: { size?: number }) => (
  <Icon size={size} d="M5 3l14 9-14 9V3z" />
);
const Pause = ({ size = 16 }: { size?: number }) => (
  <IconMulti size={size} paths={["M6 4h4v16H6z", "M14 4h4v16h-4z"]} />
);

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  colors: {
    primary: "#4A4DC9",
    accent: "#FF7212",
    gradientStart: "#533086",
    gradientEnd: "#FC9145",
    lightPrimary: "#C1C1EA",
    lightAccent: "#FFF3E4",
    textDark: "#4E4E4E",
    textMuted: "#CACACA",
    borderLight: "#EBEBEB",
    bgLight: "#F5F5F5",
    bgWhite: "#FFFFFF",
    solidPurple: "#533086",
    solidOrange: "#FC9145",
    success: "#2ECC71",
    error: "#E74C3C",
  },
  font: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  button: {
    height: 40,
    paddingX: 24,
    paddingY: 8,
    fontSize: 14,
    fontWeight: 600,
  },
};

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
  type: "intro" | "explanation" | "practice" | "real_world";
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface UnitConversionAdditionalProps {
  conversionType?: "mm_cm" | "cm_m" | "g_kg" | "rupee_paise" | "mg_g" | "mm_m";
  fromValue?: number;
  toValue?: number;
  fromUnit?: string;
  toUnit?: string;
  showScale?: boolean;
  highlightConversion?: boolean;
  customConversions?: {
    from: number;
    fromUnit: string;
    to: number;
    toUnit: string;
    label?: string;
  }[];
  showRealWorldContext?: string;
  animateConversion?: boolean;
}

interface UnitsToolProps {
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

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Why Do We Need Unit Conversions?",
    description:
      "Just like Sonu's screws had tiny differences, measurements often need smaller units. 1 cm = 10 mm, 1 m = 100 cm, 1 kg = 1000 g. Let's explore how decimal notation helps us convert between units!",
    type: "intro",
    mode: "learn",
  },
  {
    id: 2,
    title: "Millimetres ↔ Centimetres",
    description:
      "1 cm = 10 mm, so 1 mm = 1/10 cm = 0.1 cm. To convert mm to cm, divide by 10. For example, 5 mm = 0.5 cm and 12 mm = 1.2 cm.",
    type: "explanation",
    mode: "learn",
    data: {
      conversionType: "mm_cm",
      examples: [
        { from: 5, result: 0.5 },
        { from: 12, result: 1.2 },
        { from: 56, result: 5.6 },
      ],
    },
  },
  {
    id: 3,
    title: "Centimetres ↔ Metres",
    description:
      "1 m = 100 cm, so 1 cm = 1/100 m = 0.01 m. To convert cm to m, divide by 100. For example, 15 cm = 0.15 m and 325 cm = 3.25 m.",
    type: "explanation",
    mode: "learn",
    data: {
      conversionType: "cm_m",
      examples: [
        { from: 15, result: 0.15 },
        { from: 36, result: 0.36 },
        { from: 325, result: 3.25 },
      ],
    },
  },
  {
    id: 4,
    title: "Grams ↔ Kilograms",
    description:
      "1 kg = 1000 g, so 1 g = 1/1000 kg = 0.001 kg. To convert g to kg, divide by 1000. For example, 254 g = 0.254 kg and 5 g = 0.005 kg.",
    type: "explanation",
    mode: "learn",
    data: {
      conversionType: "g_kg",
      examples: [
        { from: 5, result: 0.005 },
        { from: 254, result: 0.254 },
        { from: 1560, result: 1.56 },
      ],
    },
  },
  {
    id: 5,
    title: "Rupees ↔ Paise",
    description:
      "1 rupee = 100 paise, so 1 paisa = 1/100 rupee = ₹0.01. For example, 75 paise = ₹0.75 and 250 paise = ₹2.50.",
    type: "explanation",
    mode: "learn",
    data: {
      conversionType: "rupee_paise",
      examples: [
        { from: 75, result: 0.75 },
        { from: 10, result: 0.1 },
        { from: 250, result: 2.5 },
      ],
    },
  },
  {
    id: 10,
    title: "Convert mm to cm",
    description: "Convert the given millimetres to centimetres using decimals.",
    type: "practice",
    mode: "practice",
    data: {
      questions: [
        { question: "70 mm = ? cm", answer: 7, unit: "cm" },
        { question: "9 mm = ? cm", answer: 0.9, unit: "cm" },
        { question: "134 mm = ? cm", answer: 13.4, unit: "cm" },
      ],
    },
  },
  {
    id: 11,
    title: "Convert cm to m",
    description: "Convert the given centimetres to metres using decimals.",
    type: "practice",
    mode: "practice",
    data: {
      questions: [
        { question: "36 cm = ? m", answer: 0.36, unit: "m" },
        { question: "50 cm = ? m", answer: 0.5, unit: "m" },
        { question: "4 cm = ? m", answer: 0.04, unit: "m" },
      ],
    },
  },
  {
    id: 12,
    title: "Convert g to kg",
    description: "Convert the given grams to kilograms using decimals.",
    type: "practice",
    mode: "practice",
    data: {
      questions: [
        { question: "465 g = ? kg", answer: 0.465, unit: "kg" },
        { question: "68 g = ? kg", answer: 0.068, unit: "kg" },
        { question: "704 g = ? kg", answer: 0.704, unit: "kg" },
      ],
    },
  },
  {
    id: 13,
    title: "Mixed Conversions",
    description: "Try converting between different units!",
    type: "practice",
    mode: "practice",
    data: {
      questions: [
        { question: "99 paise = ₹ ?", answer: 0.99, unit: "₹" },
        { question: "2036 mm = ? cm", answer: 203.6, unit: "cm" },
        { question: "560 g = ? kg", answer: 0.56, unit: "kg" },
      ],
    },
  },
  {
    id: 20,
    title: "How Small Is a Hair?",
    description:
      "A human hair is about 0.1 mm thick — that's 0.01 cm or 0.0001 m! The smallest ant, Carabera Bruni, is just 0.8–1 mm long. Newspaper thickness ranges from 0.05 to 0.08 mm.",
    type: "real_world",
    mode: "real_world",
    data: {
      context: "tiny_things",
      items: [
        { name: "Human Hair", value: 0.1, unit: "mm", color: "#FF7212" },
        { name: "Newspaper", value: 0.065, unit: "mm", color: "#533086" },
        { name: "Smallest Ant", value: 0.9, unit: "mm", color: "#FC9145" },
        { name: "Mustard Seed", value: 1.5, unit: "mm", color: "#4A4DC9" },
      ],
    },
  },
  {
    id: 21,
    title: "Tiny Ocean Creatures",
    description:
      "The Wolfi Octopus is only 1–2.5 cm long and weighs less than 1 g (0.001 kg)! The Philippine Goby fish is about 0.9 cm. A hummingbird egg is just 1.3 cm long.",
    type: "real_world",
    mode: "real_world",
    data: {
      context: "sea_creatures",
      items: [
        { name: "Philippine Goby", value: 0.9, unit: "cm", color: "#4A4DC9" },
        { name: "Hummingbird Egg", value: 1.3, unit: "cm", color: "#FF7212" },
        { name: "Wolfi Octopus", value: 2.5, unit: "cm", color: "#533086" },
        {
          name: "Irukandji Jellyfish",
          value: 2.0,
          unit: "cm",
          color: "#FC9145",
        },
      ],
    },
  },
  {
    id: 22,
    title: "Decimal Disasters!",
    description:
      "In 2013, Amsterdam paid €188 million instead of €1.8 million due to a cents/euros mix-up! In 1983, a plane ran out of fuel because staff loaded pounds instead of kilograms. Precision with decimals matters!",
    type: "real_world",
    mode: "real_world",
    data: { context: "disasters" },
  },
  {
    id: 23,
    title: "Rice Weights Visualised",
    description:
      "Starting from 1 g heap, each next heap is 10× heavier: 1 g → 10 g → 100 g → 1 kg → 10 kg. Combined: 11.111 kg. Each step is a power of 10 in the decimal system!",
    type: "real_world",
    mode: "real_world",
    data: {
      context: "rice_weights",
      items: [
        { name: "1 g", value: 0.001, unit: "kg", color: "#FF7212" },
        { name: "10 g", value: 0.01, unit: "kg", color: "#FC9145" },
        { name: "100 g", value: 0.1, unit: "kg", color: "#533086" },
        { name: "1 kg", value: 1, unit: "kg", color: "#4A4DC9" },
        { name: "10 kg", value: 10, unit: "kg", color: "#533086" },
      ],
    },
  },
];

// ==================== ANIMATION HELPERS ====================

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

// ==================== MAIN COMPONENT ====================

type PropsConfig = NonNullable<UnitsToolProps["props"]>;

const UnitsOfMeasurementTool: React.FC<UnitsToolProps> = ({
  props = {},
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const safeProps = (props ?? {}) as PropsConfig;
  const config = useMemo(
    () => ({
      width: safeProps.width ?? 800,
      height: safeProps.height ?? 600,
      initialMode: safeProps.initialMode ?? "learn",
      showModeSelector: safeProps.showModeSelector ?? true,
      enabledModes: safeProps.enabledModes ?? ["learn", "practice", "real_world"],
      showNavigation: safeProps.showNavigation ?? true,
      showPlayPause: safeProps.showPlayPause ?? true,
      showStepIndicator: safeProps.showStepIndicator ?? true,
      initialStep: safeProps.initialStep ?? 1,
      filterSteps: safeProps.filterSteps ?? null,
      animationSpeed: safeProps.animationSpeed ?? 1,
      autoPlayDuration:
        safeProps.autoPlayDuration ?? safeProps.data?.autoPlayDuration ?? 10000,
      themeColor: safeProps.themeColor ?? DS.colors.primary,
      darkMode: safeProps.darkMode ?? false,
    }),
    [props],
  );

  const allSteps = safeProps.steps || DEFAULT_STEPS;
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [buttonStates, setButtonStates] = useState<{
    [key: string]: "idle" | "hover" | "active";
  }>({});
  const [contentOpacity, setContentOpacity] = useState(1);
  const [contentTransform, setContentTransform] = useState("translateY(0)");
  const [practiceInput, setPracticeInput] = useState("");
  const [practiceQIndex, setPracticeQIndex] = useState(0);
  const [practiceResult, setPracticeResult] = useState<
    "correct" | "wrong" | null
  >(null);
  const [score, setScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();
  const filteredSteps = useMemo(
    () => availableSteps.filter((step) => step.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const currentStep = filteredSteps[currentStepIndex] || filteredSteps[0];

  // ─────── INJECT POPPINS + KEYFRAMES ───────
  useEffect(() => {
    if (!document.getElementById("poppins-font-link")) {
      const fontLink = document.createElement("link");
      fontLink.href =
        "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap";
      fontLink.rel = "stylesheet";
      fontLink.id = "poppins-font-link";
      document.head.appendChild(fontLink);
    }
    const keyframes = `
            @keyframes sFadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
            @keyframes sPulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
            @keyframes sPopIn { 0% { transform:scale(0); opacity:0; } 60% { transform:scale(1.12); } 100% { transform:scale(1); opacity:1; } }
            @keyframes sConfetti { 0% { transform:translateY(-16px) rotate(0deg); opacity:1; } 100% { transform:translateY(140px) rotate(540deg); opacity:0; } }
            @keyframes sBarGrow { from { transform:scaleX(0); } to { transform:scaleX(1); } }
            @keyframes sGradShift { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
        `;
    const s = document.createElement("style");
    s.id = "sing-kf";
    s.textContent = keyframes;
    document.head.appendChild(s);
    return () => {
      const e = document.getElementById("sing-kf");
      if (e) document.head.removeChild(e);
    };
  }, []);

  // ─────── CANVAS ───────
  const drawConversionVisual = useCallback(
    (ctx: CanvasRenderingContext2D, progress: number) => {
      const w = config.width - 64;
      const h = 200;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = DS.colors.bgLight;
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, DS.radius.lg);
      ctx.fill();
      if (!currentStep?.data?.examples) return;
      const examples = currentStep.data.examples;
      const convType = currentStep.data.conversionType;
      const unitLabels: Record<
        string,
        { from: string; to: string; factor: number }
      > = {
        mm_cm: { from: "mm", to: "cm", factor: 10 },
        cm_m: { from: "cm", to: "m", factor: 100 },
        g_kg: { from: "g", to: "kg", factor: 1000 },
        rupee_paise: { from: "paise", to: "₹", factor: 100 },
      };
      const info = unitLabels[convType] || { from: "?", to: "?", factor: 1 };
      const spacing = w / (examples.length + 0.2);
      examples.forEach((ex: any, i: number) => {
        const delay = i * 0.18;
        const p = Math.max(0, Math.min((progress - delay) * 2.2, 1));
        if (p <= 0) return;
        const cx = spacing * (i + 0.6);
        const scale = easeOutElastic(p);
        const boxW = 90;
        const boxH = 52;
        // From box
        ctx.save();
        ctx.translate(cx - boxW - 22, 30);
        ctx.scale(scale, scale);
        ctx.fillStyle = DS.colors.lightPrimary;
        ctx.beginPath();
        ctx.roundRect(0, 0, boxW, boxH, DS.radius.sm);
        ctx.fill();
        ctx.strokeStyle = DS.colors.primary;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.font = `600 16px Poppins, sans-serif`;
        ctx.fillStyle = DS.colors.primary;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${ex.from} ${info.from}`, boxW / 2, boxH / 2);
        ctx.restore();
        // Arrow
        if (p > 0.4) {
          const ap = Math.min((p - 0.4) * 1.67, 1);
          ctx.save();
          ctx.globalAlpha = ap;
          const grd = ctx.createLinearGradient(cx - 16, 56, cx + 16, 56);
          grd.addColorStop(0, DS.colors.gradientStart);
          grd.addColorStop(1, DS.colors.gradientEnd);
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.roundRect(cx - 16, 50, 32, 12, 6);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(cx + 18, 56);
          ctx.lineTo(cx + 10, 48);
          ctx.lineTo(cx + 10, 64);
          ctx.closePath();
          ctx.fill();
          ctx.font = `500 11px Poppins, sans-serif`;
          ctx.fillStyle = DS.colors.textDark;
          ctx.textAlign = "center";
          ctx.fillText(`÷ ${info.factor}`, cx, 80);
          ctx.restore();
        }
        // To box
        if (p > 0.55) {
          const tp = Math.min((p - 0.55) * 2.2, 1);
          const toScale = easeOutBounce(tp);
          ctx.save();
          ctx.translate(cx + 22, 30);
          ctx.scale(toScale, toScale);
          ctx.fillStyle = DS.colors.lightAccent;
          ctx.beginPath();
          ctx.roundRect(0, 0, boxW, boxH, DS.radius.sm);
          ctx.fill();
          ctx.strokeStyle = DS.colors.accent;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.font = `700 16px Poppins, sans-serif`;
          ctx.fillStyle = DS.colors.accent;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`${ex.result} ${info.to}`, boxW / 2, boxH / 2);
          ctx.restore();
        }
      });
      if (progress > 0.75) {
        ctx.globalAlpha = Math.min((progress - 0.75) * 4, 1);
        ctx.font = `700 15px Poppins, sans-serif`;
        ctx.fillStyle = DS.colors.solidPurple;
        ctx.textAlign = "center";
        ctx.fillText(
          `1 ${info.from}  =  1/${info.factor} ${info.to}  =  ${(1 / info.factor).toFixed(info.factor >= 1000 ? 3 : info.factor >= 100 ? 2 : 1)} ${info.to}`,
          w / 2,
          h - 28,
        );
        ctx.globalAlpha = 1;
      }
    },
    [config, currentStep],
  );

  useEffect(() => {
    if (selectedMode !== "learn" || !currentStep?.data?.examples) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let startTime: number | null = null;
    const duration = 2500 / config.animationSpeed;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      drawConversionVisual(ctx, p);
      if (p < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [currentStep, drawConversionVisual, config.animationSpeed, selectedMode]);

  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: filteredSteps.length,
        isPaused: !isPlaying,
        currentMode: selectedMode,
      });
  }, [
    currentStepIndex,
    filteredSteps.length,
    isPlaying,
    selectedMode,
    setStepDetails,
  ]);
  useEffect(() => {
    if (!isPlaying || stopAutoNext || config.autoPlayDuration === 0) return;
    const t = setTimeout(() => {
      if (currentStepIndex < filteredSteps.length - 1)
        animateStepChange("next");
      else setIsPlaying(false);
    }, config.autoPlayDuration);
    return () => clearTimeout(t);
  }, [
    isPlaying,
    currentStepIndex,
    stopAutoNext,
    filteredSteps.length,
    config.autoPlayDuration,
  ]);

  const animateStepChange = useCallback(
    (dir: "next" | "prev") => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setContentOpacity(0);
      setContentTransform(
        dir === "next" ? "translateY(-24px)" : "translateY(24px)",
      );
      setTimeout(() => {
        setCurrentStepIndex((prev) => (dir === "next" ? prev + 1 : prev - 1));
        setPracticeInput("");
        setPracticeResult(null);
        setPracticeQIndex(0);
        setContentTransform(
          dir === "next" ? "translateY(24px)" : "translateY(-24px)",
        );
        setTimeout(() => {
          setContentOpacity(1);
          setContentTransform("translateY(0)");
          setIsTransitioning(false);
        }, 50);
      }, 280);
    },
    [isTransitioning],
  );

  const nextStep = () => {
    if (currentStepIndex < filteredSteps.length - 1 && !isTransitioning)
      animateStepChange("next");
  };
  const prevStep = () => {
    if (currentStepIndex > 0 && !isTransitioning) animateStepChange("prev");
  };
  const changeMode = (mode: ModeType) => {
    if (mode === selectedMode) return;
    setIsTransitioning(true);
    setContentOpacity(0);
    setTimeout(() => {
      setSelectedMode(mode);
      setCurrentStepIndex(0);
      setPracticeInput("");
      setPracticeResult(null);
      setPracticeQIndex(0);
      setScore(0);
      setTotalAttempted(0);
      setTimeout(() => {
        setContentOpacity(1);
        setIsTransitioning(false);
      }, 50);
    }, 280);
  };
  const hbi = (id: string, st: "idle" | "hover" | "active") =>
    setButtonStates((prev) => ({ ...prev, [id]: st }));
  const gbt = (id: string) => {
    const s = buttonStates[id] || "idle";
    return s === "active"
      ? "scale(0.95)"
      : s === "hover"
        ? "scale(1.03)"
        : "scale(1)";
  };

  const checkAnswer = () => {
    if (!currentStep?.data?.questions) return;
    const q = currentStep.data.questions[practiceQIndex];
    const isCorrect = Math.abs(parseFloat(practiceInput) - q.answer) < 0.001;
    setPracticeResult(isCorrect ? "correct" : "wrong");
    setTotalAttempted((p) => p + 1);
    if (isCorrect) {
      setScore((p) => p + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };
  const nextQuestion = () => {
    if (!currentStep?.data?.questions) return;
    if (practiceQIndex < currentStep.data.questions.length - 1) {
      setPracticeQIndex((p) => p + 1);
      setPracticeInput("");
      setPracticeResult(null);
    } else if (currentStepIndex < filteredSteps.length - 1)
      animateStepChange("next");
  };

  const modeConfig: Record<ModeType, { icon: any; label: string }> = {
    learn: { icon: BookOpen, label: "Learn" },
    practice: { icon: Target, label: "Practice" },
    real_world: { icon: Zap, label: "Real World" },
  };

  // ─── Singularity Button ───
  const SBtn = ({
    id,
    variant = "contained",
    onClick,
    disabled = false,
    children,
    cs = {},
  }: {
    id: string;
    variant?: "contained" | "outlined" | "text" | "highlight";
    onClick: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
    cs?: React.CSSProperties;
  }) => {
    const base: React.CSSProperties = {
      fontFamily: DS.font,
      fontSize: DS.button.fontSize,
      fontWeight: DS.button.fontWeight,
      height: DS.button.height,
      padding: `0 ${DS.button.paddingX}px`,
      borderRadius: DS.radius.full,
      cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: DS.spacing.xs,
      transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
      transform: gbt(id),
      outline: "none",
      opacity: disabled ? 0.45 : 1,
      ...cs,
    };
    const styles: Record<string, React.CSSProperties> = {
      contained: {
        ...base,
        background: DS.colors.primary,
        color: "#fff",
        border: "none",
        boxShadow:
          buttonStates[id] === "hover"
            ? `0 6px 20px ${DS.colors.primary}40`
            : "0 2px 8px rgba(0,0,0,0.06)",
      },
      highlight: {
        ...base,
        background: DS.colors.accent,
        color: "#fff",
        border: "none",
        boxShadow:
          buttonStates[id] === "hover"
            ? `0 6px 20px ${DS.colors.accent}40`
            : "0 2px 8px rgba(0,0,0,0.06)",
      },
      outlined: {
        ...base,
        background: "transparent",
        color: DS.colors.primary,
        border: `2px solid ${DS.colors.primary}`,
        ...(buttonStates[id] === "hover"
          ? { background: DS.colors.lightPrimary + "40" }
          : {}),
      },
      text: {
        ...base,
        background: "transparent",
        color: DS.colors.primary,
        border: "none",
        ...(buttonStates[id] === "hover"
          ? { background: DS.colors.lightPrimary + "30" }
          : {}),
      },
    };
    return (
      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => hbi(id, "hover")}
        onMouseLeave={() => hbi(id, "idle")}
        onMouseDown={() => hbi(id, "active")}
        onMouseUp={() => hbi(id, "hover")}
        style={styles[variant] || styles.contained}
      >
        {children}
      </button>
    );
  };

  // ═══════════════════ RENDER SECTIONS ═══════════════════

  const renderLearn = () => {
    if (!currentStep) return null;
    return (
      <div
        style={{
          padding: `${DS.spacing.md}px ${DS.spacing.lg}px`,
          display: "flex",
          flexDirection: "column",
          gap: DS.spacing.md,
        }}
      >
        <div
          style={{
            fontSize: 15,
            lineHeight: 1.75,
            color: DS.colors.textDark,
            animation: "sFadeUp 0.5s ease-out",
            background: "#fff",
            borderRadius: DS.radius.lg,
            padding: `${DS.spacing.md}px ${DS.spacing.lg}px`,
            boxShadow: "0 2px 12px rgba(74,77,201,0.06)",
            border: `1px solid ${DS.colors.borderLight}`,
            fontFamily: DS.font,
          }}
        >
          {currentStep.description}
        </div>
        {currentStep.data?.examples && (
          <canvas
            ref={canvasRef}
            width={config.width - 64}
            height={200}
            style={{
              borderRadius: DS.radius.lg,
              animation: "sFadeUp 0.6s ease-out 0.15s both",
            }}
          />
        )}
        {currentStep.data?.conversionType && (
          <div
            style={{
              display: "flex",
              gap: DS.spacing.sm,
              flexWrap: "wrap",
              justifyContent: "center",
              animation: "sFadeUp 0.6s ease-out 0.3s both",
            }}
          >
            {(currentStep.data.examples || []).map((ex: any, i: number) => (
              <div
                key={i}
                style={{
                  background: `linear-gradient(135deg, ${DS.colors.lightPrimary}60, ${DS.colors.lightAccent}80)`,
                  borderRadius: DS.radius.full,
                  padding: `${DS.spacing.sm}px ${DS.spacing.lg}px`,
                  border: `1.5px solid ${DS.colors.primary}20`,
                  fontSize: 14,
                  fontWeight: 600,
                  color: DS.colors.solidPurple,
                  fontFamily: DS.font,
                  animation: `sPopIn 0.4s ease-out ${0.4 + i * 0.12}s both`,
                  transition: "transform 0.2s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.06)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {ex.from} → {ex.result}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPractice = () => {
    if (!currentStep?.data?.questions) return null;
    const q = currentStep.data.questions[practiceQIndex];
    return (
      <div
        style={{
          padding: `${DS.spacing.md}px ${DS.spacing.lg}px`,
          display: "flex",
          flexDirection: "column",
          gap: DS.spacing.md,
          alignItems: "center",
          fontFamily: DS.font,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: DS.spacing.md,
            animation: "sFadeUp 0.4s ease-out",
          }}
        >
          <div
            style={{
              background: DS.colors.lightAccent,
              borderRadius: DS.radius.full,
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: DS.colors.accent,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Star size={15} /> {score}/{totalAttempted}
          </div>
          <div
            style={{
              background: DS.colors.lightPrimary,
              borderRadius: DS.radius.full,
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: DS.colors.primary,
            }}
          >
            Q {practiceQIndex + 1}/{currentStep.data.questions.length}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: DS.radius.xl,
            padding: `${DS.spacing.xl}px`,
            boxShadow: "0 8px 32px rgba(74,77,201,0.08)",
            border: `1.5px solid ${DS.colors.borderLight}`,
            width: "100%",
            maxWidth: 480,
            textAlign: "center",
            animation: "sPopIn 0.5s ease-out",
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: DS.colors.solidPurple,
              marginBottom: 24,
            }}
          >
            {q.question}
          </div>
          <div
            style={{
              display: "flex",
              gap: DS.spacing.sm,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={practiceInput}
              onChange={(e) => setPracticeInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !practiceResult && checkAnswer()
              }
              placeholder="Answer..."
              disabled={practiceResult !== null}
              style={{
                padding: "10px 20px",
                fontSize: 22,
                fontWeight: 700,
                borderRadius: DS.radius.md,
                border: `2px solid ${practiceResult === "correct" ? DS.colors.success : practiceResult === "wrong" ? DS.colors.error : DS.colors.borderLight}`,
                outline: "none",
                width: 150,
                textAlign: "center",
                transition: "all 0.3s ease",
                background:
                  practiceResult === "correct"
                    ? "#EAFAF1"
                    : practiceResult === "wrong"
                      ? "#FDEDEC"
                      : "#fff",
                fontFamily: DS.font,
                color: DS.colors.textDark,
              }}
            />
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: DS.colors.textMuted,
              }}
            >
              {q.unit}
            </span>
          </div>
          {practiceResult && (
            <div
              style={{
                marginTop: DS.spacing.md,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                animation: "sPopIn 0.4s ease-out",
                color:
                  practiceResult === "correct"
                    ? DS.colors.success
                    : DS.colors.error,
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              {practiceResult === "correct" ? (
                <Check size={20} />
              ) : (
                <X size={20} />
              )}
              {practiceResult === "correct"
                ? "Correct!"
                : `Answer: ${q.answer} ${q.unit}`}
            </div>
          )}
          <div
            style={{
              marginTop: DS.spacing.lg,
              display: "flex",
              gap: DS.spacing.sm,
              justifyContent: "center",
            }}
          >
            {!practiceResult && (
              <SBtn id="chk" onClick={checkAnswer}>
                <Check size={16} /> Check
              </SBtn>
            )}
            {practiceResult && (
              <SBtn id="nxq" variant="highlight" onClick={nextQuestion}>
                Next <ChevronRight size={16} />
              </SBtn>
            )}
          </div>
        </div>
        {showConfetti && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 25}%`,
                  width: 8,
                  height: 8,
                  borderRadius: Math.random() > 0.5 ? "50%" : 2,
                  background: [
                    DS.colors.primary,
                    DS.colors.accent,
                    DS.colors.solidPurple,
                    DS.colors.gradientEnd,
                    DS.colors.lightPrimary,
                  ][Math.floor(Math.random() * 5)],
                  animation: `sConfetti ${1.2 + Math.random() * 1.2}s ease-out ${Math.random() * 0.4}s both`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderRealWorld = () => {
    if (!currentStep) return null;
    return (
      <div
        style={{
          padding: `${DS.spacing.md}px ${DS.spacing.lg}px`,
          display: "flex",
          flexDirection: "column",
          gap: DS.spacing.md,
          fontFamily: DS.font,
        }}
      >
        <div
          style={{
            fontSize: 15,
            lineHeight: 1.75,
            color: DS.colors.textDark,
            animation: "sFadeUp 0.5s ease-out",
            background: "#fff",
            borderRadius: DS.radius.lg,
            padding: `${DS.spacing.md}px ${DS.spacing.lg}px`,
            boxShadow: "0 2px 12px rgba(74,77,201,0.06)",
            border: `1px solid ${DS.colors.borderLight}`,
          }}
        >
          {currentStep.description}
        </div>
        {currentStep.data?.items && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              animation: "sFadeUp 0.5s ease-out 0.15s both",
            }}
          >
            {currentStep.data.items.map((item: any, i: number) => {
              const maxVal = Math.max(
                ...currentStep.data.items.map((it: any) => it.value),
              );
              const barW = Math.max((item.value / maxVal) * 100, 10);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    background: "#fff",
                    borderRadius: DS.radius.md,
                    padding: `10px ${DS.spacing.md}px`,
                    border: `1px solid ${DS.colors.borderLight}`,
                    animation: `sFadeUp 0.45s ease-out ${0.25 + i * 0.1}s both`,
                    transition: "box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = `0 4px 16px ${item.color}18`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: item.color,
                      flexShrink: 0,
                      animation: `sPulse 2.5s ease-in-out ${i * 0.25}s infinite`,
                    }}
                  />
                  <div
                    style={{
                      minWidth: 120,
                      fontSize: 13,
                      fontWeight: 600,
                      color: DS.colors.textDark,
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: DS.colors.bgLight,
                      borderRadius: DS.radius.sm,
                      height: 30,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${barW}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${item.color}, ${item.color}bb)`,
                        borderRadius: DS.radius.sm,
                        animation: `sBarGrow 0.7s ease-out ${0.4 + i * 0.12}s both`,
                        transformOrigin: "left",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        paddingRight: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#fff",
                          textShadow: "0 1px 3px rgba(0,0,0,0.25)",
                        }}
                      >
                        {item.value} {item.unit}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {currentStep.data?.context === "disasters" && (
          <div
            style={{
              display: "flex",
              gap: DS.spacing.md,
              flexWrap: "wrap",
              justifyContent: "center",
              animation: "sFadeUp 0.5s ease-out 0.25s both",
            }}
          >
            {[
              {
                emoji: "🏛️",
                title: "Amsterdam 2013",
                detail: "€1.8M → €188M",
                bg: DS.colors.lightPrimary,
              },
              {
                emoji: "✈️",
                title: "Air Canada 1983",
                detail: "lbs ≠ kg",
                bg: DS.colors.lightAccent,
              },
              {
                emoji: "💊",
                title: "Medical Errors",
                detail: "0.05mg ≠ 0.5mg",
                bg: `${DS.colors.lightPrimary}80`,
              },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  background: c.bg,
                  borderRadius: DS.radius.lg,
                  padding: `${DS.spacing.md}px ${DS.spacing.lg}px`,
                  minWidth: 170,
                  textAlign: "center",
                  animation: `sPopIn 0.45s ease-out ${0.35 + i * 0.12}s both`,
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  cursor: "default",
                  border: `1px solid ${DS.colors.borderLight}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-4px) scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(83,48,134,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: 30 }}>{c.emoji}</div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: DS.colors.solidPurple,
                    marginTop: 8,
                  }}
                >
                  {c.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: DS.colors.textDark,
                    marginTop: 4,
                    fontWeight: 500,
                  }}
                >
                  {c.detail}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ═══════════════════ MAIN LAYOUT ═══════════════════

  return (
    <div
      style={{
        width: config.width,
        maxWidth: "100%",
        background: "#fff",
        borderRadius: DS.radius.xl,
        overflow: "hidden",
        boxShadow:
          "0 20px 60px rgba(83,48,134,0.10), 0 2px 8px rgba(0,0,0,0.04)",
        fontFamily: DS.font,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        border: `1px solid ${DS.colors.borderLight}`,
      }}
    >
      {/* HEADER — Singularity gradient */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`,
          backgroundSize: "200% 200%",
          animation: "sGradShift 8s ease infinite",
          padding: `${DS.spacing.lg}px ${DS.spacing.lg}px ${DS.spacing.md}px`,
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: DS.spacing.sm,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 500,
                opacity: 0.75,
                textTransform: "uppercase",
                letterSpacing: 1.5,
              }}
            >
              Chapter 3 • Section 3.5
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                marginTop: 2,
                letterSpacing: -0.3,
              }}
            >
              Units of Measurement
            </div>
          </div>
          {config.showStepIndicator && (
            <div
              style={{
                background: "rgba(255,255,255,0.18)",
                borderRadius: DS.radius.full,
                padding: "6px 16px",
                fontSize: 13,
                fontWeight: 600,
                backdropFilter: "blur(8px)",
              }}
            >
              {currentStepIndex + 1} / {filteredSteps.length}
            </div>
          )}
        </div>
        {config.showModeSelector && (
          <div
            style={{
              display: "flex",
              gap: 6,
              background: "rgba(255,255,255,0.12)",
              borderRadius: DS.radius.full,
              padding: 4,
            }}
          >
            {config.enabledModes.map((mode) => {
              const mc = modeConfig[mode];
              const Icon = mc.icon;
              const isA = selectedMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => changeMode(mode)}
                  onMouseEnter={() => hbi(`m-${mode}`, "hover")}
                  onMouseLeave={() => hbi(`m-${mode}`, "idle")}
                  onMouseDown={() => hbi(`m-${mode}`, "active")}
                  onMouseUp={() => hbi(`m-${mode}`, "hover")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 20px",
                    borderRadius: DS.radius.full,
                    border: "none",
                    cursor: "pointer",
                    background: isA ? "#fff" : "transparent",
                    color: isA
                      ? DS.colors.solidPurple
                      : "rgba(255,255,255,0.85)",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: DS.font,
                    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                    transform: gbt(`m-${mode}`),
                    boxShadow: isA ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <Icon size={15} />
                  {mc.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* STEP TITLE */}
      {currentStep && (
        <div
          style={{
            padding: `${DS.spacing.md}px ${DS.spacing.lg}px 0`,
            opacity: contentOpacity,
            transform: contentTransform,
            transition: "opacity 0.28s ease, transform 0.28s ease",
          }}
        >
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: DS.colors.solidPurple,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: DS.font,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${DS.colors.primary}, ${DS.colors.accent})`,
                animation: "sPulse 2s ease-in-out infinite",
              }}
            />
            {currentStep.title}
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          minHeight: 280,
          opacity: contentOpacity,
          transform: contentTransform,
          transition: "opacity 0.28s ease, transform 0.28s ease",
          position: "relative",
        }}
      >
        {selectedMode === "learn" && renderLearn()}
        {selectedMode === "practice" && renderPractice()}
        {selectedMode === "real_world" && renderRealWorld()}
      </div>

      {/* NAVIGATION — Singularity style */}
      {config.showNavigation && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: `${DS.spacing.sm}px ${DS.spacing.lg}px ${DS.spacing.md}px`,
            borderTop: `1px solid ${DS.colors.borderLight}`,
            background: DS.colors.bgLight,
          }}
        >
          <SBtn
            id="prev"
            variant="outlined"
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            cs={{ height: 36, padding: "0 16px", fontSize: 13 }}
          >
            <ChevronLeft size={16} /> Prev
          </SBtn>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: DS.spacing.md,
            }}
          >
            {config.showPlayPause && selectedMode === "learn" && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                onMouseEnter={() => hbi("play", "hover")}
                onMouseLeave={() => hbi("play", "idle")}
                onMouseDown={() => hbi("play", "active")}
                onMouseUp={() => hbi("play", "hover")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "none",
                  background: `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`,
                  color: "#fff",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  transform: gbt("play"),
                  boxShadow: "0 2px 10px rgba(83,48,134,0.2)",
                }}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              </button>
            )}
            <div style={{ display: "flex", gap: 5 }}>
              {filteredSteps.map((_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (i !== currentStepIndex) {
                      setContentOpacity(0);
                      setTimeout(() => {
                        setCurrentStepIndex(i);
                        setPracticeInput("");
                        setPracticeResult(null);
                        setPracticeQIndex(0);
                        setTimeout(() => setContentOpacity(1), 50);
                      }, 200);
                    }
                  }}
                  style={{
                    width: i === currentStepIndex ? 22 : 8,
                    height: 8,
                    borderRadius: DS.radius.full,
                    background:
                      i === currentStepIndex
                        ? `linear-gradient(90deg, ${DS.colors.primary}, ${DS.colors.accent})`
                        : DS.colors.textMuted,
                    transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
          <SBtn
            id="next"
            variant="highlight"
            onClick={nextStep}
            disabled={currentStepIndex >= filteredSteps.length - 1}
            cs={{ height: 36, padding: "0 16px", fontSize: 13 }}
          >
            Next <ChevronRight size={16} />
          </SBtn>
        </div>
      )}
    </div>
  );
};

export default UnitsOfMeasurementTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
