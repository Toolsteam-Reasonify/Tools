// @ts-nocheck
// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: decimal_place_value_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  RotateCcw,
  Plus,
} from "lucide-react";

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  // Primary
  purple: "#4A4DC9",
  orange: "#FF7212",
  // Gradient endpoints
  gradientDark: "#533086",
  gradientLight: "#FC9145",
  // Light tints
  purpleLight: "#C1C1EA",
  orangeLight: "#FFF3E4",
  purpleBg: "#EEEEF8",
  orangeBg: "#FFF8F0",
  // Grays
  gray900: "#4E4E4E",
  gray400: "#CACACA",
  gray200: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",
  // Semantic
  success: "#2ECC71",
  successLight: "#D5F5E3",
  error: "#E74C3C",
  errorLight: "#FADBD8",
  // Typography
  fontFamily:
    "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  // Radii
  radiusPill: "999px",
  radiusLg: "20px",
  radiusMd: "14px",
  radiusSm: "10px",
  radiusXs: "8px",
  // Shadows
  shadowSm: "0 2px 8px rgba(74, 77, 201, 0.08)",
  shadowMd: "0 4px 20px rgba(74, 77, 201, 0.12)",
  shadowLg: "0 12px 40px rgba(74, 77, 201, 0.18)",
  shadowOrange: "0 4px 16px rgba(255, 114, 18, 0.25)",
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

interface DecimalAdditionalProps {
  decimalNumber?: number;
  showPlaceValueTable?: boolean;
  highlightPlace?:
    | "ones"
    | "tenths"
    | "hundredths"
    | "thousandths"
    | "tens"
    | "hundreds";
  conversionType?: "mm_cm" | "cm_m" | "g_kg" | "paise_rupee";
  conversionValue?: number;
  compareNumbers?: [number, number];
  sequenceStart?: number;
  sequenceStep?: number;
  fractionNumerator?: number;
  fractionDenominator?: number;
}

interface DecimalPlaceValueToolProps {
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
    additionalProps?: DecimalAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  // LEARN MODE
  {
    id: 1,
    title: "What is a Decimal Number?",
    description:
      "A decimal point (.) separates the whole number part from the fractional part. For example, 70.5 means 7 tens and 5 tenths. The decimal system is based on powers of 10 — each place value is 10 times smaller as you move right!",
    type: "intro",
    mode: "learn",
    data: { decimalNumber: 70.5, animate: "intro" },
  },
  {
    id: 2,
    title: "Place Value Table",
    description:
      "Every digit in a decimal number has a specific place value. Digits to the LEFT of the decimal point represent whole numbers (ones, tens, hundreds). Digits to the RIGHT represent fractions (tenths, hundredths, thousandths). Each position is 10× smaller than the one to its left.",
    type: "explanation",
    mode: "learn",
    data: { decimalNumber: 7.05, animate: "placeValue" },
  },
  {
    id: 3,
    title: "Tenths — Splitting into 10 Parts",
    description:
      "When we divide 1 unit into 10 equal parts, each part is 1/10 or one-tenth = 0.1. For example, 2 7/10 cm means 2 whole centimeters and 7 one-tenths of a cm, written as 2.7 cm. Ten one-tenths make 1 whole unit!",
    type: "explanation",
    mode: "learn",
    data: { decimalNumber: 2.7, animate: "tenths" },
  },
  {
    id: 4,
    title: "Hundredths — Even Smaller Parts",
    description:
      "Each one-tenth can be split into 10 parts to get one-hundredths (1/100 = 0.01). So 4.45 means 4 units, 4 tenths, and 5 hundredths. 10 one-hundredths = 1 one-tenth, and 100 one-hundredths = 1 unit.",
    type: "explanation",
    mode: "learn",
    data: { decimalNumber: 4.45, animate: "hundredths" },
  },
  {
    id: 5,
    title: "Thousandths — Going Deeper",
    description:
      "Splitting each hundredth into 10 parts gives us thousandths (1/1000 = 0.001). The number 0.274 means 2 tenths + 7 hundredths + 4 thousandths. We read it as 'zero point two seven four', NOT 'zero point two hundred seventy four'!",
    type: "explanation",
    mode: "learn",
    data: { decimalNumber: 0.274, animate: "thousandths" },
  },
  {
    id: 6,
    title: "Adding Decimals",
    description:
      "To add decimals, line up the decimal points and add each column — just like whole numbers! Start from the rightmost place value. If a column sums to 10 or more, carry over. Example: 2.7 + 3.5 = 6.2 (7 tenths + 5 tenths = 12 tenths = 1 unit + 2 tenths).",
    type: "explanation",
    mode: "learn",
    data: { animate: "addition", num1: 2.7, num2: 3.5 },
  },
  {
    id: 7,
    title: "Subtracting Decimals",
    description:
      "To subtract decimals, line up the decimal points and subtract column by column. If a digit is too small, borrow from the next column — just like with whole numbers. Example: 3.5 − 2.7 = 0.8 (borrow 1 unit as 10 tenths: 15 tenths − 7 tenths = 8 tenths).",
    type: "explanation",
    mode: "learn",
    data: { animate: "subtraction", num1: 3.5, num2: 2.7 },
  },

  // PRACTICE MODE — 5 MCQ Questions
  {
    id: 10,
    title: "Place Value of a Digit",
    description:
      "In the number 83.519, what is the place value of the digit 1?",
    type: "practice",
    mode: "practice",
    data: {
      questionType: "placeValue",
      decimalNumber: 83.519,
      highlightIndex: 4,
      options: ["Tenths", "Hundredths", "Thousandths", "Ones"],
      answer: "Hundredths",
    },
  },
  {
    id: 11,
    title: "Decimal from a Fraction",
    description: "What is the decimal form of 37/100?",
    type: "practice",
    mode: "practice",
    data: {
      questionType: "fractionToDecimal",
      fraction: { numerator: 37, denominator: 100 },
      options: ["3.7", "0.37", "0.037", "37.0"],
      answer: "0.37",
    },
  },
  {
    id: 12,
    title: "Decimal Addition",
    description: "What is 12.6 + 4.85?",
    type: "practice",
    mode: "practice",
    data: {
      questionType: "addition",
      num1: 12.6,
      num2: 4.85,
      options: ["17.45", "16.45", "17.85", "16.85"],
      answer: "17.45",
    },
  },
  {
    id: 13,
    title: "Which is Smaller?",
    description: "Which of these decimal numbers is the smallest?",
    type: "practice",
    mode: "practice",
    data: {
      questionType: "compare",
      num1: 0.509,
      num2: 0.59,
      options: ["0.509", "0.59", "Both are equal"],
      answer: "0.509",
    },
  },
  {
    id: 14,
    title: "Decimal Subtraction",
    description: "What is 20.03 − 8.7?",
    type: "practice",
    mode: "practice",
    data: {
      questionType: "subtraction",
      num1: 20.03,
      num2: 8.7,
      options: ["11.33", "12.33", "11.03", "12.67"],
      answer: "11.33",
    },
  },

  // REAL WORLD MODE
  {
    id: 20,
    title: "Length: Millimeters ↔ Centimeters",
    description:
      "1 cm = 10 mm, so 1 mm = 0.1 cm. A human hair is about 0.1 mm thick! The smallest ant species (Carabera Bruni) is only 0.8–1 mm long. When we write 12 mm = 1.2 cm, we're using tenths.",
    type: "real_world",
    mode: "real_world",
    data: { context: "mm_cm", value: 12, result: 1.2 },
  },
  {
    id: 21,
    title: "Length: Centimeters ↔ Meters",
    description:
      "1 m = 100 cm, so 1 cm = 0.01 m. When you measure your height, 15 cm = 0.15 m. That's 1 tenth and 5 hundredths of a meter.",
    type: "real_world",
    mode: "real_world",
    data: { context: "cm_m", value: 15, result: 0.15 },
  },
  {
    id: 22,
    title: "Weight: Grams ↔ Kilograms",
    description:
      "1 kg = 1000 g, so 1 g = 0.001 kg. If you buy 254 g of rice, that's 0.254 kg — 2 tenths, 5 hundredths, and 4 thousandths of a kg.",
    type: "real_world",
    mode: "real_world",
    data: { context: "g_kg", value: 254, result: 0.254 },
  },
  {
    id: 23,
    title: "Money: Paise ↔ Rupees",
    description:
      "1 rupee = 100 paise, so 1 paisa = ₹0.01. In the 1970s, a masala dosa cost just 50 paise (₹0.50)! Indian Railways charges 45 paise (₹0.45) per person for travel insurance.",
    type: "real_world",
    mode: "real_world",
    data: { context: "paise_rupee", value: 75, result: 0.75 },
  },
  {
    id: 24,
    title: "Decimal Disasters!",
    description:
      "In 2013, Amsterdam City Council sent €188 million instead of €1.8 million — a decimal error! In 1983, an Air Canada plane ran out of fuel mid-air due to a unit mixup. Misreading 0.05 mg as 0.5 mg in medicine means 10× the dose!",
    type: "real_world",
    mode: "real_world",
    data: { context: "disasters" },
  },
];

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

// ==================== HELPER ====================

const breakDecimal = (num: number) => {
  const str = Math.abs(num).toFixed(4);
  const [wholePart, fracPart] = str.split(".");
  const digits = wholePart.split("").map(Number);
  const fracDigits = (fracPart || "").split("").map(Number);
  return {
    hundreds: digits.length >= 3 ? digits[digits.length - 3] : 0,
    tens: digits.length >= 2 ? digits[digits.length - 2] : 0,
    ones: digits.length >= 1 ? digits[digits.length - 1] : 0,
    tenths: fracDigits[0] || 0,
    hundredths: fracDigits[1] || 0,
    thousandths: fracDigits[2] || 0,
    isNegative: num < 0,
  };
};

// ==================== MAIN COMPONENT ====================

type PropsConfig = NonNullable<DecimalPlaceValueToolProps["props"]>;

const DecimalPlaceValueTool: React.FC<DecimalPlaceValueToolProps> = ({
  props = {} as PropsConfig,
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
      themeColor: props.themeColor ?? DS.purple,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const additionalProps = props.additionalProps || {};

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
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    const steps = availableSteps.filter((s) => s.mode === config.initialMode);
    if (config.initialStep) {
      const idx = steps.findIndex((s) => s.id === config.initialStep);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });
  const [isPlaying, setIsPlaying] = useState(!stopAutoNext);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [buttonStates, setButtonStates] = useState<{
    [key: string]: "idle" | "hover" | "active";
  }>({});
  const [contentOpacity, setContentOpacity] = useState(1);
  const [contentTransform, setContentTransform] = useState("translateY(0)");
  const [animProgress, setAnimProgress] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const animFrameRef = useRef<number>();
  const animStartRef = useRef<number | null>(null);

  const filteredSteps = useMemo(
    () => availableSteps.filter((step) => step.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const currentStep = filteredSteps[currentStepIndex] || filteredSteps[0];

  // Mode styling config — Singularity palette
  const modeConfig: {
    [key in ModeType]: {
      gradient: string;
      bg: string;
      accent: string;
      label: string;
    };
  } = {
    learn: {
      gradient: `linear-gradient(135deg, ${DS.gradientDark}, ${DS.purple})`,
      bg: DS.purpleBg,
      accent: DS.purple,
      label: "Learn",
    },
    practice: {
      gradient: `linear-gradient(135deg, ${DS.orange}, ${DS.gradientLight})`,
      bg: DS.orangeBg,
      accent: DS.orange,
      label: "Practice",
    },
    real_world: {
      gradient: `linear-gradient(135deg, ${DS.gradientDark}, ${DS.gradientLight})`,
      bg: "#F8F0FF",
      accent: DS.gradientDark,
      label: "Real World",
    },
  };

  const mc = modeConfig[selectedMode];

  // ─── INJECT KEYFRAMES + POPPINS FONT ───
  useEffect(() => {
    const keyframes = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
            @keyframes fadeInUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
            @keyframes fadeInLeft { from { opacity:0; transform:translateX(-30px); } to { opacity:1; transform:translateX(0); } }
            @keyframes popIn { 0% { transform:scale(0); opacity:0; } 70% { transform:scale(1.12); } 100% { transform:scale(1); opacity:1; } }
            @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
            @keyframes glowPurple { 0%,100% { box-shadow:0 0 0 0 ${DS.purpleLight}; } 50% { box-shadow:0 0 0 8px ${DS.purpleLight}00; } }
            @keyframes glowOrange { 0%,100% { box-shadow:0 0 0 0 ${DS.orangeLight}; } 50% { box-shadow:0 0 0 8px ${DS.orangeLight}00; } }
            @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
            @keyframes shake { 0%,100% { transform:translateX(0); } 25% { transform:translateX(-5px); } 75% { transform:translateX(5px); } }
            @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
            @keyframes slideRight { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
            @keyframes drawIn { from { clip-path:inset(0 100% 0 0); } to { clip-path:inset(0 0% 0 0); } }
            @keyframes spinSlow { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        `;
    const styleSheet = document.createElement("style");
    styleSheet.id = "decimal-singularity-keyframes";
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    return () => {
      const existing = document.getElementById("decimal-singularity-keyframes");
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  // ─── ANIMATION LOOP ───
  useEffect(() => {
    animStartRef.current = null;
    setAnimProgress(0);
    const duration = 2500 / config.animationSpeed;
    const animate = (timestamp: number) => {
      if (!animStartRef.current) animStartRef.current = timestamp;
      const elapsed = timestamp - animStartRef.current;
      const progress = Math.min(elapsed / duration, 1);
      setAnimProgress(easeOutCubic(progress));
      if (progress < 1) animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentStep, config.animationSpeed, additionalProps]);

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
    if (
      !isPlaying ||
      stopAutoNext ||
      config.autoPlayDuration === 0 ||
      selectedMode === "practice"
    )
      return;
    const timer = setTimeout(() => {
      if (currentStepIndex < filteredSteps.length - 1)
        animateStepChange("next");
      else setIsPlaying(false);
    }, config.autoPlayDuration);
    return () => clearTimeout(timer);
  }, [
    isPlaying,
    currentStepIndex,
    stopAutoNext,
    filteredSteps.length,
    config.autoPlayDuration,
    selectedMode,
  ]);

  // ─── NAVIGATION ───
  const animateStepChange = useCallback(
    (direction: "next" | "prev") => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setContentOpacity(0);
      setContentTransform(
        direction === "next" ? "translateY(-24px)" : "translateY(24px)",
      );
      setTimeout(() => {
        setCurrentStepIndex((prev) =>
          direction === "next" ? prev + 1 : prev - 1,
        );
        setSelectedAnswer(null);
        setShowResult(false);
        setContentTransform(
          direction === "next" ? "translateY(24px)" : "translateY(-24px)",
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
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeout(() => {
        setContentOpacity(1);
        setIsTransitioning(false);
      }, 50);
    }, 280);
  };

  const handleButtonInteraction = (
    id: string,
    state: "idle" | "hover" | "active",
  ) => setButtonStates((prev) => ({ ...prev, [id]: state }));
  const getButtonStyle = (
    id: string,
    base: React.CSSProperties,
  ): React.CSSProperties => {
    const state = buttonStates[id] || "idle";
    return {
      ...base,
      transform:
        state === "active"
          ? "scale(0.96)"
          : state === "hover"
            ? "scale(1.04)"
            : "scale(1)",
    };
  };

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    setAttempts((prev) => prev + 1);
    if (answer === currentStep?.data?.answer) setScore((prev) => prev + 1);
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDERERS
  // ═══════════════════════════════════════════════════════════════

  // ─── PLACE VALUE TABLE ───
  const renderPlaceValueTable = (num: number, highlightPlace?: string) => {
    const parts = breakDecimal(num);
    const places = [
      {
        label: "Hundreds",
        value: parts.hundreds,
        placeVal: "×100",
        key: "hundreds",
        side: "whole",
      },
      {
        label: "Tens",
        value: parts.tens,
        placeVal: "×10",
        key: "tens",
        side: "whole",
      },
      {
        label: "Ones",
        value: parts.ones,
        placeVal: "×1",
        key: "ones",
        side: "whole",
      },
      { label: "•", value: ".", placeVal: "", key: "point", side: "point" },
      {
        label: "Tenths",
        value: parts.tenths,
        placeVal: "×¹⁄₁₀",
        key: "tenths",
        side: "frac",
      },
      {
        label: "Hundredths",
        value: parts.hundredths,
        placeVal: "×¹⁄₁₀₀",
        key: "hundredths",
        side: "frac",
      },
      {
        label: "Thousandths",
        value: parts.thousandths,
        placeVal: "×¹⁄₁₀₀₀",
        key: "thousandths",
        side: "frac",
      },
    ];
    let startIdx = 0;
    if (parts.hundreds === 0 && parts.tens === 0) startIdx = 2;
    else if (parts.hundreds === 0) startIdx = 1;
    let endIdx = places.length;
    if (parts.thousandths === 0 && parts.hundredths === 0 && parts.tenths === 0)
      endIdx = 3;
    else if (parts.thousandths === 0 && parts.hundredths === 0) endIdx = 5;
    else if (parts.thousandths === 0) endIdx = 6;
    const visible = places.slice(startIdx, endIdx);

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "6px",
          flexWrap: "wrap",
          margin: "20px 0",
        }}
      >
        {visible.map((p, idx) => {
          const isPoint = p.key === "point";
          const isHl = highlightPlace === p.key;
          const isWhole = p.side === "whole";
          const delay = idx * 0.08;
          const show = animProgress > delay;
          return (
            <div
              key={p.key}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: show ? 1 : 0,
                transform: show
                  ? "translateY(0) scale(1)"
                  : "translateY(16px) scale(0.85)",
                transition: `all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`,
              }}
            >
              {!isPoint && (
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: isHl ? DS.orange : DS.gray400,
                    marginBottom: "5px",
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    fontFamily: DS.fontFamily,
                    textAlign: "center",
                    minWidth: "62px",
                  }}
                >
                  {p.label}
                </div>
              )}
              <div
                style={{
                  width: isPoint ? "28px" : "58px",
                  height: "58px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isPoint ? "28px" : "24px",
                  fontWeight: 700,
                  borderRadius: isPoint ? "0" : DS.radiusMd,
                  fontFamily: DS.fontFamily,
                  background: isPoint
                    ? "transparent"
                    : isHl
                      ? `linear-gradient(135deg, ${DS.orange}, ${DS.gradientLight})`
                      : isWhole
                        ? DS.purpleBg
                        : DS.orangeLight,
                  color: isPoint
                    ? DS.orange
                    : isHl
                      ? DS.white
                      : isWhole
                        ? DS.purple
                        : DS.orange,
                  border: isPoint
                    ? "none"
                    : `2px solid ${isHl ? DS.orange : isWhole ? DS.purpleLight : "#FFD9B3"}`,
                  animation: isHl ? "pulse 2s infinite" : "none",
                  boxShadow: isHl ? DS.shadowOrange : "none",
                }}
              >
                {p.value}
              </div>
              {!isPoint && (
                <div
                  style={{
                    fontSize: "9px",
                    color: DS.gray400,
                    marginTop: "4px",
                    fontFamily: DS.fontFamily,
                    fontWeight: 500,
                  }}
                >
                  {p.placeVal}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ─── BAR SPLITTER ───
  const renderBarSplitter = (
    num: number,
    type: "tenths" | "hundredths" | "thousandths",
  ) => {
    const parts = breakDecimal(num);
    const wholeUnits = Math.floor(num);
    const fracPart =
      type === "tenths"
        ? parts.tenths
        : type === "hundredths"
          ? parts.tenths * 10 + parts.hundredths
          : parts.tenths * 100 + parts.hundredths * 10 + parts.thousandths;
    const barCount = Math.min(type === "tenths" ? 10 : 20, 20);
    const filled = Math.min(fracPart, barCount);
    const unitLabel =
      type === "tenths" ? "1/10" : type === "hundredths" ? "1/100" : "1/1000";

    return (
      <div style={{ margin: "16px 0" }}>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {Array.from({ length: wholeUnits }).map((_, i) => (
            <div
              key={`w-${i}`}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: DS.radiusSm,
                background: `linear-gradient(135deg, ${DS.purple}, ${DS.gradientDark})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: DS.white,
                fontWeight: 700,
                fontSize: "17px",
                fontFamily: DS.fontFamily,
                opacity: animProgress > 0.1 ? 1 : 0,
                transform: animProgress > 0.1 ? "scale(1)" : "scale(0)",
                transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.08}s`,
                boxShadow: DS.shadowSm,
              }}
            >
              1
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: "3px",
            padding: "12px",
            background: DS.gray100,
            borderRadius: DS.radiusMd,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {Array.from({ length: barCount }).map((_, i) => {
            const isFilled = i < filled;
            const d = 0.3 + i * 0.025;
            const show = animProgress > d * 0.5;
            return (
              <div
                key={`b-${i}`}
                style={{
                  width: type === "tenths" ? "30px" : "18px",
                  height: "42px",
                  borderRadius: DS.radiusXs,
                  background: isFilled
                    ? `linear-gradient(180deg, ${DS.orange}, ${DS.gradientLight})`
                    : DS.gray200,
                  opacity: show ? 1 : 0,
                  transform: show ? "scaleY(1)" : "scaleY(0)",
                  transition: `all 0.3s ease ${d * 0.25}s`,
                  transformOrigin: "bottom",
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            fontSize: "13px",
            color: DS.gray900,
            fontWeight: 600,
            fontFamily: DS.fontFamily,
          }}
        >
          <span style={{ color: DS.orange, fontWeight: 700 }}>{filled}</span>{" "}
          parts of {unitLabel} filled ={" "}
          <span style={{ color: DS.purple, fontWeight: 700 }}>
            {num.toFixed(type === "tenths" ? 1 : type === "hundredths" ? 2 : 3)}
          </span>
        </div>
      </div>
    );
  };

  // ─── OPERATION VISUAL ───
  const renderOperation = (
    op: "addition" | "subtraction",
    n1: number,
    n2: number,
  ) => {
    const result = op === "addition" ? n1 + n2 : n1 - n2;
    const symbol = op === "addition" ? "+" : "−";
    const lines = [
      { label: "", val: n1.toFixed(2) },
      { label: symbol, val: n2.toFixed(2) },
      { label: "=", val: result.toFixed(2) },
    ];
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "6px",
          background: DS.gray100,
          padding: "28px 44px",
          borderRadius: DS.radiusLg,
          margin: "16px auto",
          width: "fit-content",
          fontFamily: DS.fontFamily,
          fontSize: "28px",
          fontWeight: 700,
          boxShadow: DS.shadowSm,
        }}
      >
        {lines.map((line, idx) => {
          const d = idx * 0.25;
          const show = animProgress > d * 0.5;
          const isResult = idx === 2;
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "center",
                opacity: show ? 1 : 0,
                transform: show ? "translateX(0)" : "translateX(24px)",
                transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${d}s`,
                borderTop: isResult ? `3px solid ${DS.purple}` : "none",
                paddingTop: isResult ? "14px" : "0",
                marginTop: isResult ? "6px" : "0",
                color: isResult ? DS.purple : DS.gray900,
              }}
            >
              <span
                style={{
                  width: "24px",
                  textAlign: "center",
                  fontSize: "22px",
                  color: DS.orange,
                }}
              >
                {line.label}
              </span>
              <span>{line.val}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // ─── CONVERSION VISUAL ───
  const renderConversion = (context: string, value: number, result: number) => {
    const conversions: {
      [k: string]: { from: string; to: string; factor: string; emoji: string };
    } = {
      mm_cm: { from: "mm", to: "cm", factor: "÷ 10", emoji: "📏" },
      cm_m: { from: "cm", to: "m", factor: "÷ 100", emoji: "📐" },
      g_kg: { from: "g", to: "kg", factor: "÷ 1000", emoji: "⚖️" },
      paise_rupee: {
        from: "paise",
        to: "rupees",
        factor: "÷ 100",
        emoji: "💰",
      },
    };
    const conv = conversions[context];
    if (!conv) return null;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "18px",
          margin: "24px 0",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            padding: "22px 30px",
            borderRadius: DS.radiusLg,
            background: DS.orangeLight,
            border: `2px solid #FFD9B3`,
            fontSize: "22px",
            fontWeight: 700,
            fontFamily: DS.fontFamily,
            color: DS.orange,
            opacity: animProgress > 0.1 ? 1 : 0,
            transform: animProgress > 0.1 ? "scale(1)" : "scale(0.7)",
            transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "34px", marginBottom: "4px" }}>
            {conv.emoji}
          </div>
          {value} {conv.from}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: animProgress > 0.3 ? 1 : 0,
            transition: "all 0.4s ease 0.2s",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: DS.purple,
              fontFamily: DS.fontFamily,
              marginBottom: "4px",
              background: DS.purpleBg,
              padding: "4px 14px",
              borderRadius: DS.radiusPill,
            }}
          >
            {conv.factor}
          </div>
          <div style={{ fontSize: "28px", color: DS.gradientDark }}>→</div>
        </div>
        <div
          style={{
            padding: "22px 30px",
            borderRadius: DS.radiusLg,
            background: DS.purpleBg,
            border: `2px solid ${DS.purpleLight}`,
            fontSize: "22px",
            fontWeight: 700,
            fontFamily: DS.fontFamily,
            color: DS.purple,
            opacity: animProgress > 0.5 ? 1 : 0,
            transform: animProgress > 0.5 ? "scale(1)" : "scale(0.7)",
            transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s",
            textAlign: "center",
            animation: animProgress > 0.8 ? "glowPurple 2s infinite" : "none",
          }}
        >
          <div style={{ fontSize: "34px", marginBottom: "4px" }}>✨</div>
          {result} {conv.to}
        </div>
      </div>
    );
  };

  // ─── PRACTICE ───
  const renderPractice = () => {
    const data = currentStep?.data;
    if (!data) return null;
    let questionDisplay: React.ReactNode = null;

    if (data.questionType === "placeValue") {
      const numStr = data.decimalNumber.toString();
      questionDisplay = (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "5px",
            margin: "18px 0",
            fontSize: "38px",
            fontWeight: 800,
            fontFamily: DS.fontFamily,
          }}
        >
          {numStr.split("").map((ch: string, i: number) => (
            <span
              key={i}
              style={{
                padding: "6px 12px",
                borderRadius: DS.radiusSm,
                background:
                  i === data.highlightIndex
                    ? `linear-gradient(135deg, ${DS.orange}, ${DS.gradientLight})`
                    : "transparent",
                color: i === data.highlightIndex ? DS.white : DS.gray900,
                animation:
                  i === data.highlightIndex ? "pulse 1.5s infinite" : "none",
                boxShadow: i === data.highlightIndex ? DS.shadowOrange : "none",
              }}
            >
              {ch}
            </span>
          ))}
        </div>
      );
    } else if (data.questionType === "fractionToDecimal") {
      questionDisplay = (
        <div
          style={{
            textAlign: "center",
            margin: "18px 0",
            fontFamily: DS.fontFamily,
          }}
        >
          <div style={{ fontSize: "38px", fontWeight: 800, color: DS.purple }}>
            <span
              style={{
                borderBottom: `3px solid ${DS.purple}`,
                padding: "0 10px",
              }}
            >
              {data.fraction.numerator}
            </span>
          </div>
          <div
            style={{
              fontSize: "38px",
              fontWeight: 800,
              color: DS.purple,
              marginTop: "4px",
            }}
          >
            {data.fraction.denominator}
          </div>
        </div>
      );
    } else if (
      data.questionType === "addition" ||
      data.questionType === "subtraction"
    ) {
      questionDisplay = (
        <div
          style={{
            textAlign: "center",
            margin: "18px 0",
            fontSize: "34px",
            fontWeight: 800,
            fontFamily: DS.fontFamily,
            color: DS.gray900,
          }}
        >
          <span style={{ color: DS.purple }}>{data.num1}</span>
          <span style={{ color: DS.orange, margin: "0 10px" }}>
            {data.questionType === "addition" ? "+" : "−"}
          </span>
          <span style={{ color: DS.purple }}>{data.num2}</span>
          <span style={{ color: DS.gray400 }}> = ?</span>
        </div>
      );
    } else if (data.questionType === "compare") {
      questionDisplay = (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            alignItems: "center",
            margin: "18px 0",
            fontFamily: DS.fontFamily,
          }}
        >
          <div
            style={{
              padding: "16px 26px",
              borderRadius: DS.radiusMd,
              background: DS.purpleBg,
              border: `2px solid ${DS.purpleLight}`,
              fontSize: "28px",
              fontWeight: 800,
              color: DS.purple,
            }}
          >
            {data.num1}
          </div>
          <div style={{ fontSize: "24px", color: DS.orange, fontWeight: 700 }}>
            vs
          </div>
          <div
            style={{
              padding: "16px 26px",
              borderRadius: DS.radiusMd,
              background: DS.orangeLight,
              border: `2px solid #FFD9B3`,
              fontSize: "28px",
              fontWeight: 800,
              color: DS.orange,
            }}
          >
            {data.num2}
          </div>
        </div>
      );
    } else if (data.questionType === "sequence") {
      questionDisplay = (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            alignItems: "center",
            margin: "18px 0",
            flexWrap: "wrap",
            fontFamily: DS.fontFamily,
          }}
        >
          {data.sequence.map((n: number, i: number) => (
            <React.Fragment key={i}>
              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: DS.radiusSm,
                  background: DS.purpleBg,
                  fontSize: "20px",
                  fontWeight: 700,
                  color: DS.purple,
                }}
              >
                {n}
              </div>
              {i < data.sequence.length - 1 && (
                <span style={{ fontSize: "16px", color: DS.gray400 }}>→</span>
              )}
            </React.Fragment>
          ))}
          <span style={{ fontSize: "16px", color: DS.gray400 }}>→</span>
          <div
            style={{
              padding: "10px 16px",
              borderRadius: DS.radiusSm,
              background: DS.orangeLight,
              border: `2px dashed ${DS.orange}`,
              fontSize: "20px",
              fontWeight: 700,
              color: DS.orange,
              animation: "pulse 2s infinite",
            }}
          >
            ?
          </div>
        </div>
      );
    }

    return (
      <div>
        {questionDisplay}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
            margin: "22px auto",
            maxWidth: "480px",
          }}
        >
          {data.options?.map((opt: string, i: number) => {
            const isSelected = selectedAnswer === opt;
            const isCorrect = opt === data.answer;
            let bg = DS.white;
            let borderColor = DS.gray200;
            let textColor = DS.gray900;
            if (showResult) {
              if (isCorrect) {
                bg = DS.successLight;
                borderColor = DS.success;
                textColor = "#1B7A3D";
              } else if (isSelected && !isCorrect) {
                bg = DS.errorLight;
                borderColor = DS.error;
                textColor = "#922B21";
              }
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                onMouseEnter={() =>
                  handleButtonInteraction(`opt-${i}`, "hover")
                }
                onMouseLeave={() => handleButtonInteraction(`opt-${i}`, "idle")}
                onMouseDown={() =>
                  handleButtonInteraction(`opt-${i}`, "active")
                }
                onMouseUp={() => handleButtonInteraction(`opt-${i}`, "hover")}
                style={getButtonStyle(`opt-${i}`, {
                  padding: "16px 20px",
                  borderRadius: DS.radiusMd,
                  border: `2px solid ${borderColor}`,
                  background: bg,
                  cursor: showResult ? "default" : "pointer",
                  fontWeight: 600,
                  fontSize: "17px",
                  fontFamily: DS.fontFamily,
                  color: textColor,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  animation:
                    showResult && isCorrect
                      ? "bounce 0.5s ease"
                      : showResult && isSelected && !isCorrect
                        ? "shake 0.35s ease"
                        : "none",
                  boxShadow:
                    !showResult && buttonStates[`opt-${i}`] === "hover"
                      ? DS.shadowMd
                      : "none",
                })}
              >
                {showResult && isCorrect && (
                  <Check size={18} color={DS.success} strokeWidth={3} />
                )}
                {showResult && isSelected && !isCorrect && (
                  <X size={18} color={DS.error} strokeWidth={3} />
                )}
                {opt}
              </button>
            );
          })}
        </div>
        {attempts > 0 && (
          <div
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: DS.gray900,
              fontWeight: 600,
              fontFamily: DS.fontFamily,
              padding: "8px 16px",
              background: DS.purpleBg,
              borderRadius: DS.radiusPill,
              maxWidth: "180px",
              margin: "0 auto",
            }}
          >
            Score: <span style={{ color: DS.purple }}>{score}</span>/{attempts}
          </div>
        )}
      </div>
    );
  };

  // ─── LEARN CONTENT ───
  const renderLearnContent = () => {
    const data = currentStep?.data;
    if (!data) return null;
    const decNum = additionalProps.decimalNumber ?? data.decimalNumber ?? 0;
    const highlight = additionalProps.highlightPlace ?? data.highlightPlace;
    return (
      <div>
        {(data.animate === "intro" ||
          data.animate === "placeValue" ||
          data.animate === "hundredths" ||
          data.animate === "thousandths") && (
          <>
            <div
              style={{
                textAlign: "center",
                fontSize: "46px",
                fontWeight: 800,
                fontFamily: DS.fontFamily,
                color: DS.purple,
                margin: "12px 0",
                opacity: animProgress > 0.1 ? 1 : 0,
                transform: animProgress > 0.1 ? "scale(1)" : "scale(0.5)",
                transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                animation:
                  animProgress > 0.5 ? "float 3s ease-in-out infinite" : "none",
              }}
            >
              {decNum}
            </div>
            {renderPlaceValueTable(decNum, highlight)}
          </>
        )}
        {data.animate === "tenths" && (
          <>
            <div
              style={{
                textAlign: "center",
                fontSize: "46px",
                fontWeight: 800,
                fontFamily: DS.fontFamily,
                color: DS.orange,
                margin: "12px 0",
                opacity: animProgress > 0.1 ? 1 : 0,
                transition: "all 0.5s ease",
              }}
            >
              {decNum}
            </div>
            {renderBarSplitter(decNum, "tenths")}
            {renderPlaceValueTable(decNum, "tenths")}
          </>
        )}
        {data.animate === "addition" &&
          renderOperation("addition", data.num1, data.num2)}
        {data.animate === "subtraction" &&
          renderOperation("subtraction", data.num1, data.num2)}
      </div>
    );
  };

  // ─── REAL WORLD CONTENT ───
  const renderRealWorldContent = () => {
    const data = currentStep?.data;
    if (!data) return null;
    if (data.context === "disasters") {
      const disasters = [
        {
          emoji: "🏦",
          title: "€188M Mistake",
          desc: "Amsterdam sent €188M instead of €1.8M",
          year: "2013",
          bg: DS.orangeLight,
        },
        {
          emoji: "✈️",
          title: "Fuel Miscalculation",
          desc: "Loaded pounds instead of kilograms",
          year: "1983",
          bg: DS.errorLight,
        },
        {
          emoji: "💊",
          title: "Medicine Dosage",
          desc: "0.05 mg read as 0.5 mg = 10× overdose",
          year: "Ongoing",
          bg: DS.purpleBg,
        },
      ];
      return (
        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            justifyContent: "center",
            margin: "18px 0",
          }}
        >
          {disasters.map((d, i) => (
            <div
              key={i}
              style={{
                padding: "22px",
                borderRadius: DS.radiusLg,
                background: d.bg,
                border: `1px solid ${DS.gray200}`,
                flex: "1 1 200px",
                maxWidth: "220px",
                fontFamily: DS.fontFamily,
                boxShadow: DS.shadowSm,
                opacity: animProgress > 0.15 + i * 0.12 ? 1 : 0,
                transform:
                  animProgress > 0.15 + i * 0.12
                    ? "translateY(0)"
                    : "translateY(24px)",
                transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.12}s`,
              }}
            >
              <div style={{ fontSize: "38px", marginBottom: "8px" }}>
                {d.emoji}
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "14px",
                  color: DS.gray900,
                  marginBottom: "4px",
                }}
              >
                {d.title}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: DS.gray900,
                  lineHeight: 1.5,
                  opacity: 0.75,
                }}
              >
                {d.desc}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: DS.purple,
                  marginTop: "8px",
                  fontWeight: 600,
                }}
              >
                {d.year}
              </div>
            </div>
          ))}
        </div>
      );
    }
    return renderConversion(data.context, data.value, data.result);
  };

  // ═══════════════════════════════════════════════════════════════
  // MAIN RENDER — SINGULARITY DESIGN
  // ═══════════════════════════════════════════════════════════════
  return (
    <div
      style={{
        width: "100%",
        maxWidth: `${config.width}px`,
        margin: "0 auto",
        background: DS.white,
        borderRadius: DS.radiusLg,
        overflow: "hidden",
        boxShadow: DS.shadowLg,
        fontFamily: DS.fontFamily,
        border: `1px solid ${DS.gray200}`,
      }}
    >
      {/* ── MODE SELECTOR ── */}
      {config.showModeSelector && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            padding: "16px 24px",
            background: DS.gray100,
            borderBottom: `1px solid ${DS.gray200}`,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {config.enabledModes.map((mode) => {
            const isSelected = selectedMode === mode;
            const m = modeConfig[mode];
            return (
              <button
                key={mode}
                onClick={() => changeMode(mode)}
                onMouseEnter={() =>
                  handleButtonInteraction(`m-${mode}`, "hover")
                }
                onMouseLeave={() =>
                  handleButtonInteraction(`m-${mode}`, "idle")
                }
                onMouseDown={() =>
                  handleButtonInteraction(`m-${mode}`, "active")
                }
                onMouseUp={() => handleButtonInteraction(`m-${mode}`, "hover")}
                style={getButtonStyle(`m-${mode}`, {
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 24px",
                  height: "40px",
                  borderRadius: DS.radiusPill,
                  border: isSelected ? "none" : `2px solid ${DS.gray200}`,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "13px",
                  fontFamily: DS.fontFamily,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: isSelected ? m.gradient : DS.white,
                  color: isSelected ? DS.white : DS.gray900,
                  boxShadow: isSelected ? DS.shadowMd : "none",
                })}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── HEADER ── */}
      <div
        style={{
          padding: "28px 32px 22px",
          color: DS.white,
          position: "relative",
          overflow: "hidden",
          background: mc.gradient,
        }}
      >
        {/* Decorative shapes — Singularity geometric style */}
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "40px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            animation: "spinSlow 20s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10px",
            right: "140px",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "200px",
            width: "0",
            height: "0",
            borderLeft: "15px solid transparent",
            borderRight: "15px solid transparent",
            borderBottom: "26px solid rgba(255,255,255,0.07)",
          }}
        />

        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
            margin: 0,
            fontFamily: DS.fontFamily,
            animation: "fadeInUp 0.5s ease-out",
          }}
        >
          {currentStep?.title}
        </h2>
        {config.showStepIndicator && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255,255,255,0.2)",
              padding: "5px 14px",
              borderRadius: DS.radiusPill,
              fontSize: "12px",
              marginTop: "10px",
              fontFamily: DS.fontFamily,
              fontWeight: 500,
              backdropFilter: "blur(8px)",
            }}
          >
            Step {currentStepIndex + 1} of {filteredSteps.length}
          </span>
        )}
      </div>

      {/* ── PROGRESS BAR ── */}
      <div
        style={{ height: "4px", background: DS.gray200, overflow: "hidden" }}
      >
        <div
          style={{
            height: "100%",
            background: mc.gradient,
            transition: "width 0.5s ease-out",
            width: `${((currentStepIndex + 1) / filteredSteps.length) * 100}%`,
          }}
        />
      </div>

      {/* ── CONTENT ── */}
      <div
        style={{
          padding: "24px 28px",
          opacity: contentOpacity,
          transform: contentTransform,
          transition: `all ${280 / config.animationSpeed}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          minHeight: "280px",
        }}
      >
        {selectedMode === "learn" && renderLearnContent()}
        {selectedMode === "practice" && renderPractice()}
        {selectedMode === "real_world" && renderRealWorldContent()}

        {/* Description card */}
        <div
          style={{
            fontSize: "14px",
            lineHeight: 1.75,
            color: DS.gray900,
            fontFamily: DS.fontFamily,
            padding: "18px 22px",
            background: mc.bg,
            borderRadius: DS.radiusMd,
            borderLeft: `4px solid ${mc.accent}`,
            marginTop: "18px",
            fontWeight: 400,
          }}
        >
          {currentStep?.description}
        </div>
      </div>

      {/* ── NAVIGATION ── */}
      {(config.showNavigation || config.showPlayPause) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 24px",
            background: DS.gray100,
            borderTop: `1px solid ${DS.gray200}`,
          }}
        >
          {config.showNavigation ? (
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0 || isTransitioning}
              onMouseEnter={() => handleButtonInteraction("prev", "hover")}
              onMouseLeave={() => handleButtonInteraction("prev", "idle")}
              onMouseDown={() => handleButtonInteraction("prev", "active")}
              onMouseUp={() => handleButtonInteraction("prev", "hover")}
              style={getButtonStyle("prev", {
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0 24px",
                height: "40px",
                borderRadius: DS.radiusPill,
                border: `2px solid ${currentStepIndex === 0 ? DS.gray200 : DS.purple}`,
                cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",
                fontWeight: 600,
                fontSize: "13px",
                fontFamily: DS.fontFamily,
                transition: "all 0.3s ease",
                background: DS.white,
                color: currentStepIndex === 0 ? DS.gray400 : DS.purple,
                opacity: currentStepIndex === 0 ? 0.5 : 1,
              })}
            >
              <ChevronLeft size={16} /> Previous
            </button>
          ) : (
            <div />
          )}

          {config.showPlayPause && selectedMode !== "practice" && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              onMouseEnter={() => handleButtonInteraction("play", "hover")}
              onMouseLeave={() => handleButtonInteraction("play", "idle")}
              onMouseDown={() => handleButtonInteraction("play", "active")}
              onMouseUp={() => handleButtonInteraction("play", "hover")}
              style={getButtonStyle("play", {
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0 28px",
                height: "40px",
                borderRadius: DS.radiusPill,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
                fontFamily: DS.fontFamily,
                color: DS.white,
                transition: "all 0.3s ease",
                background: mc.gradient,
                boxShadow: DS.shadowMd,
              })}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? "Pause" : "Play"}
            </button>
          )}

          {selectedMode === "practice" &&
            showResult &&
            currentStepIndex < filteredSteps.length - 1 && (
              <button
                onClick={nextStep}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0 28px",
                  height: "40px",
                  borderRadius: DS.radiusPill,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "13px",
                  fontFamily: DS.fontFamily,
                  color: DS.white,
                  transition: "all 0.3s ease",
                  background: `linear-gradient(135deg, ${DS.orange}, ${DS.gradientLight})`,
                  boxShadow: DS.shadowOrange,
                }}
              >
                Next Question <ChevronRight size={16} />
              </button>
            )}

          {config.showNavigation ? (
            <button
              onClick={nextStep}
              disabled={
                currentStepIndex === filteredSteps.length - 1 || isTransitioning
              }
              onMouseEnter={() => handleButtonInteraction("next", "hover")}
              onMouseLeave={() => handleButtonInteraction("next", "idle")}
              onMouseDown={() => handleButtonInteraction("next", "active")}
              onMouseUp={() => handleButtonInteraction("next", "hover")}
              style={getButtonStyle("next", {
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0 24px",
                height: "40px",
                borderRadius: DS.radiusPill,
                border: "none",
                cursor:
                  currentStepIndex === filteredSteps.length - 1
                    ? "not-allowed"
                    : "pointer",
                fontWeight: 600,
                fontSize: "13px",
                fontFamily: DS.fontFamily,
                transition: "all 0.3s ease",
                background:
                  currentStepIndex === filteredSteps.length - 1
                    ? DS.gray200
                    : mc.gradient,
                color:
                  currentStepIndex === filteredSteps.length - 1
                    ? DS.gray400
                    : DS.white,
                opacity:
                  currentStepIndex === filteredSteps.length - 1 ? 0.5 : 1,
                boxShadow:
                  currentStepIndex === filteredSteps.length - 1
                    ? "none"
                    : DS.shadowMd,
              })}
            >
              Next <ChevronRight size={16} />
            </button>
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
