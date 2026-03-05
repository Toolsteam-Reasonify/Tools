// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: prime_factorisation_division_method.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  // @ts-ignore - react types resolved by project or bundler
} from "react";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  X,
  BookOpen,
  Target,
  Plus,
  // @ts-ignore - lucide-react types resolved by project or bundler
} from "lucide-react";

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  // Primary
  indigo: "#4A4DC9",
  orange: "#FF7212",
  // Gradient endpoints
  gradientStart: "#533086",
  gradientEnd: "#FC9145",
  // Neutrals
  dark: "#4E4E4E",
  grey: "#CACACA",
  lightGrey: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  // Light accents
  lightPurple: "#C1C1EA",
  lightPeach: "#FFF3E4",
  // Solid fills
  solidPurple: "#533086",
  solidOrange: "#FC9145",
  // Functional
  success: "#2ECC71",
  error: "#E74C3C",
  // Typography
  font: "'Poppins', sans-serif",
  // Radii
  pillRadius: "100px",
  cardRadius: "16px",
  chipRadius: "12px",
  nodeRadius: "10px",
  // Shadows
  shadowSm: "0 2px 8px rgba(74, 77, 201, 0.08)",
  shadowMd: "0 4px 20px rgba(74, 77, 201, 0.12)",
  shadowLg: "0 8px 40px rgba(74, 77, 201, 0.16)",
  shadowOrange: "0 4px 16px rgba(255, 114, 18, 0.25)",
  shadowPurple: "0 4px 16px rgba(74, 77, 201, 0.25)",
  // Gradients
  gradientPrimary: "linear-gradient(135deg, #533086, #4A4DC9)",
  gradientAccent: "linear-gradient(135deg, #FF7212, #FC9145)",
  gradientMixed: "linear-gradient(135deg, #533086, #FC9145)",
  gradientSubtle: "linear-gradient(135deg, #C1C1EA, #FFF3E4)",
  gradientLight: "linear-gradient(135deg, #F5F5F5, #FFFFFF)",
};

// Prime factor colour mapping using design system
const PRIME_COLORS: { [key: number]: string } = {
  2: DS.indigo,
  3: DS.orange,
  5: DS.solidPurple,
  7: "#7B61FF",
  11: DS.solidOrange,
  13: "#E74C3C",
};

const PRIME_LIGHT_COLORS: { [key: number]: string } = {
  2: DS.lightPurple,
  3: DS.lightPeach,
  5: "#E8D5F5",
  7: "#DDD6FE",
  11: "#FFECD2",
  13: "#FECACA",
};

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface DivisionStep {
  divisor: number;
  dividend: number;
  quotient: number;
  hint: string;
  teachingNote: string;
}

interface FactorisationData {
  number: number;
  steps: DivisionStep[];
  primeFactors: number[];
  factorisation: string;
}

interface PrimeFactorisationAdditionalProps {
  number?: number;
  showHints?: boolean;
  showTeachingNotes?: boolean;
  primeColors?: { [key: number]: string };
}

interface PrimeFactorisationToolProps {
  props?: {
    width?: number;
    height?: number;
    initialMode?: ModeType;
    showModeSelector?: boolean;
    showNavigation?: boolean;
    showPlayPause?: boolean;
    showStepIndicator?: boolean;
    initialStep?: number;
    animationSpeed?: number;
    autoPlayDuration?: number;
    themeColor?: string;
    darkMode?: boolean;
    additionalProps?: PrimeFactorisationAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

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

// ==================== DATA GENERATION ====================

const generate1200Steps = (): DivisionStep[] => [
  {
    divisor: 2,
    dividend: 1200,
    quotient: 600,
    hint: "1200 is even (ends in 0), so divide by 2.",
    teachingNote:
      "Step 1: What is the smallest prime? It's 2! Since 1200 is even, we divide by 2.",
  },
  {
    divisor: 2,
    dividend: 600,
    quotient: 300,
    hint: "600 is still even! Keep dividing by 2.",
    teachingNote: "Step 2: Is 600 still even? Yes! 600 ÷ 2 = 300.",
  },
  {
    divisor: 2,
    dividend: 300,
    quotient: 150,
    hint: "300 is still even — divide by 2 again.",
    teachingNote: "Step 3: Is 300 still even? Yes! 300 ÷ 2 = 150.",
  },
  {
    divisor: 2,
    dividend: 150,
    quotient: 75,
    hint: "150 is even too! One more division by 2.",
    teachingNote:
      "Step 4: 150 is even, so 150 ÷ 2 = 75. We've divided by 2 four times!",
  },
  {
    divisor: 3,
    dividend: 75,
    quotient: 25,
    hint: "75 is odd. Digit sum: 7+5=12, divisible by 3!",
    teachingNote:
      "Step 5: 75 is odd — move past 2. Use digit-sum trick: 7 + 5 = 12 → divisible by 3!",
  },
  {
    divisor: 5,
    dividend: 25,
    quotient: 5,
    hint: "25 ends in 5, so it's divisible by 5.",
    teachingNote: "Step 6: 25 ends in 5, so divide by 5. 25 ÷ 5 = 5.",
  },
  {
    divisor: 5,
    dividend: 5,
    quotient: 1,
    hint: "5 is a prime number itself! Divide by 5 to get 1.",
    teachingNote:
      "Step 7: 5 is prime. 5 ÷ 5 = 1. Done! Assemble the factorisation.",
  },
];

const computeFactorisationData = (num: number): FactorisationData => {
  if (num === 1200) {
    const steps = generate1200Steps();
    return {
      number: 1200,
      steps,
      primeFactors: [2, 2, 2, 2, 3, 5, 5],
      factorisation: "2 × 2 × 2 × 2 × 3 × 5 × 5",
    };
  }
  const steps: DivisionStep[] = [];
  const primeFactors: number[] = [];
  let current = num;
  let d = 2;
  while (current > 1) {
    if (current % d === 0) {
      steps.push({
        divisor: d,
        dividend: current,
        quotient: current / d,
        hint: `${current} is divisible by ${d}.`,
        teachingNote: `Divide ${current} by ${d} to get ${current / d}.`,
      });
      primeFactors.push(d);
      current = current / d;
    } else {
      d++;
    }
  }
  return {
    number: num,
    steps,
    primeFactors,
    factorisation: primeFactors.join(" × "),
  };
};

const PRACTICE_POOL = [
  105, 90, 360, 840, 225, 132, 180, 252, 420, 504, 300, 168, 396, 462, 660,
];
const MAX_PRACTICE_QUESTIONS = 5;

// Shuffle utility (Fisher-Yates)
const shuffleArray = (arr: number[]): number[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ==================== MAIN COMPONENT ====================

type PropsConfig = NonNullable<PrimeFactorisationToolProps["props"]>;

const PrimeFactorisationDivisionMethod: React.FC<
  PrimeFactorisationToolProps
> = ({
  props = {} as PropsConfig,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const width = props.width ?? 800;
  const height = props.height ?? 600;
  const showModeSelector = props.showModeSelector !== false;
  const showNavigation = props.showNavigation !== false;
  const showPlayPause = props.showPlayPause !== false;
  const showStepIndicator = props.showStepIndicator !== false;
  const animationSpeed = props.animationSpeed ?? 1;
  const autoPlayDuration = props.autoPlayDuration ?? 8000;

  const additionalProps = (props.additionalProps ??
    {}) as PrimeFactorisationAdditionalProps;
  const targetNumber = additionalProps.number ?? 1200;
  const showHints = additionalProps.showHints !== false;
  const showTeachingNotes = additionalProps.showTeachingNotes !== false;

  const [currentMode, setCurrentMode] = useState<ModeType>(
    props.initialMode ?? "learn",
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);

  // Practice state
  const [practiceQueue, setPracticeQueue] = useState<number[]>(() =>
    shuffleArray(PRACTICE_POOL).slice(0, MAX_PRACTICE_QUESTIONS),
  );
  const [practiceQuestionIndex, setPracticeQuestionIndex] = useState(0);
  const [practiceInput, setPracticeInput] = useState("");
  const [practiceStep, setPracticeStep] = useState(0);
  const [practiceCorrect, setPracticeCorrect] = useState<boolean | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const [practiceTotal, setPracticeTotal] = useState(0);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [allPracticeDone, setAllPracticeDone] = useState(false);
  const [questionResults, setQuestionResults] = useState<
    { number: number; factorisation: string; correct: boolean }[]
  >([]);

  const practiceNumber =
    practiceQueue[practiceQuestionIndex] || PRACTICE_POOL[0];

  const autoPlayRef = useRef<number | null>(null);
  const factorisationData = useMemo(
    () => computeFactorisationData(targetNumber),
    [targetNumber],
  );
  const practiceData = useMemo(
    () => computeFactorisationData(practiceNumber),
    [practiceNumber],
  );
  const totalSteps = factorisationData.steps.length + 1;

  const getPrimeColor = (p: number) => PRIME_COLORS[p] || DS.dark;
  const getPrimeLightColor = (p: number) =>
    PRIME_LIGHT_COLORS[p] || DS.lightGrey;

  // Step reporting
  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep,
        totalSteps: totalSteps + 1,
        isPaused: !isPlaying,
        currentMode,
      });
    }
  }, [currentStep, isPlaying, currentMode]);

  // Auto-play
  useEffect(() => {
    if (isPlaying && !stopAutoNext && currentMode === "learn") {
      autoPlayRef.current = window.setTimeout(() => {
        if (currentStep <= totalSteps) goToNext();
        else setIsPlaying(false);
      }, autoPlayDuration / animationSpeed);
    }
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [isPlaying, currentStep, stopAutoNext, currentMode]);

  // Navigation
  const goToNext = useCallback(() => {
    if (currentStep <= totalSteps) setCurrentStep((p) => p + 1);
  }, [currentStep, totalSteps]);

  const goToPrev = useCallback(() => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  }, [currentStep]);

  const resetTool = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  // Practice handlers
  const handlePracticeSubmit = useCallback(() => {
    if (!practiceInput.trim()) return;
    const expected = practiceData.steps[practiceStep];
    if (!expected) return;
    const isCorrect = parseInt(practiceInput.trim()) === expected.divisor;
    setPracticeCorrect(isCorrect);
    setPracticeTotal((p) => p + 1);
    if (isCorrect) {
      setPracticeScore((p) => p + 1);
      setTimeout(() => {
        if (practiceStep < practiceData.steps.length - 1) {
          setPracticeStep((p) => p + 1);
          setPracticeCorrect(null);
          setPracticeInput("");
        } else {
          setPracticeCompleted(true);
        }
      }, 1200);
    } else {
      setTimeout(() => {
        setPracticeCorrect(null);
        setPracticeInput("");
      }, 1500);
    }
  }, [practiceInput, practiceStep, practiceData]);

  const nextPracticeNumber = useCallback(() => {
    // Record result for current question
    setQuestionResults((prev) => [
      ...prev,
      {
        number: practiceNumber,
        factorisation: practiceData.factorisation,
        correct: true, // they completed it
      },
    ]);

    const nextIdx = practiceQuestionIndex + 1;
    if (nextIdx >= MAX_PRACTICE_QUESTIONS) {
      // All 5 questions done
      setAllPracticeDone(true);
      setPracticeCompleted(false);
    } else {
      setPracticeQuestionIndex(nextIdx);
      setPracticeStep(0);
      setPracticeInput("");
      setPracticeCorrect(null);
      setPracticeCompleted(false);
    }
  }, [practiceNumber, practiceQuestionIndex, practiceData]);

  const restartPractice = useCallback(() => {
    const newQueue = shuffleArray(PRACTICE_POOL).slice(
      0,
      MAX_PRACTICE_QUESTIONS,
    );
    setPracticeQueue(newQueue);
    setPracticeQuestionIndex(0);
    setPracticeStep(0);
    setPracticeInput("");
    setPracticeCorrect(null);
    setPracticeScore(0);
    setPracticeTotal(0);
    setPracticeCompleted(false);
    setAllPracticeDone(false);
    setQuestionResults([]);
  }, []);

  // ==================== KEYFRAMES ====================

  const keyframes = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

        @keyframes singFadeInUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes singFadeInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes singFadeInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes singPopIn {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.12); }
            100% { transform: scale(1); opacity: 1; }
        }
        @keyframes singGlowPurple {
            0%, 100% { box-shadow: 0 0 0 0 rgba(74, 77, 201, 0); }
            50% { box-shadow: 0 0 0 8px rgba(74, 77, 201, 0.15); }
        }
        @keyframes singGlowOrange {
            0%, 100% { box-shadow: 0 0 0 0 rgba(255, 114, 18, 0); }
            50% { box-shadow: 0 0 0 8px rgba(255, 114, 18, 0.15); }
        }
        @keyframes singChipBounce {
            0% { transform: scale(0) rotate(-8deg); opacity: 0; }
            55% { transform: scale(1.15) rotate(4deg); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes singCelebrate {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            40% { transform: scale(1.2) rotate(6deg); }
            70% { transform: scale(0.95) rotate(-3deg); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes singPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.04); }
        }
        @keyframes singDrawLine {
            from { stroke-dashoffset: 120; }
            to { stroke-dashoffset: 0; }
        }
        @keyframes singShake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-6px); }
            40% { transform: translateX(6px); }
            60% { transform: translateX(-3px); }
            80% { transform: translateX(3px); }
        }
        @keyframes singSlideDown {
            from { opacity: 0; transform: translateY(-12px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes singGradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        @keyframes singFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
        }
        @keyframes singRipple {
            0% { transform: scale(0); opacity: 0.4; }
            100% { transform: scale(3.5); opacity: 0; }
        }
        @keyframes singSparkle {
            0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
            50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
    `;

  useEffect(() => {
    const existing = document.getElementById("sing-pf-keyframes");
    if (existing) document.head.removeChild(existing);
    const s = document.createElement("style");
    s.id = "sing-pf-keyframes";
    s.textContent = keyframes;
    document.head.appendChild(s);
    return () => {
      const el = document.getElementById("sing-pf-keyframes");
      if (el) document.head.removeChild(el);
    };
  }, []);

  // ==================== BUTTON COMPONENT ====================

  const SingButton = ({
    label,
    onClick,
    variant = "contained",
    highlight = false,
    disabled = false,
    icon,
    size = "md",
    id,
  }: {
    label: string;
    onClick: () => void;
    variant?: "contained" | "outlined" | "text";
    highlight?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    size?: "sm" | "md";
    id: string;
  }) => {
    const isHovered = hoveredBtn === id;
    const isPressed = pressedBtn === id;

    const baseStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
      height: size === "sm" ? "32px" : "40px",
      padding: size === "sm" ? "0 16px" : "0 24px",
      borderRadius: DS.pillRadius,
      fontFamily: DS.font,
      fontWeight: 600,
      fontSize: size === "sm" ? "12px" : "13px",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      border: "none",
      outline: "none",
      letterSpacing: "0.2px",
      position: "relative" as const,
      overflow: "hidden",
    };

    let style: React.CSSProperties = { ...baseStyle };

    if (variant === "contained") {
      if (highlight) {
        style.background = disabled
          ? DS.lightGrey
          : isPressed
            ? "#E5650F"
            : isHovered
              ? "#FF8533"
              : DS.gradientAccent;
        style.color = disabled ? DS.grey : DS.white;
        style.boxShadow = disabled
          ? "none"
          : isHovered
            ? DS.shadowOrange
            : DS.shadowSm;
      } else {
        style.background = disabled
          ? DS.lightGrey
          : isPressed
            ? "#3A3DB0"
            : isHovered
              ? "#5C5FD6"
              : DS.indigo;
        style.color = disabled ? DS.grey : DS.white;
        style.boxShadow = disabled
          ? "none"
          : isHovered
            ? DS.shadowPurple
            : DS.shadowSm;
      }
      style.transform = isPressed
        ? "scale(0.96)"
        : isHovered
          ? "scale(1.03)"
          : "scale(1)";
    } else if (variant === "outlined") {
      style.background = isPressed
        ? `${DS.indigo}0D`
        : isHovered
          ? `${DS.indigo}08`
          : "transparent";
      style.border = `2px solid ${disabled ? DS.lightGrey : isHovered ? DS.indigo : DS.grey}`;
      style.color = disabled ? DS.grey : DS.indigo;
      style.transform = isPressed ? "scale(0.96)" : "scale(1)";
    } else {
      style.background = isPressed ? `${DS.indigo}0D` : "transparent";
      style.color = disabled ? DS.grey : isHovered ? DS.solidPurple : DS.indigo;
      style.textDecoration = isHovered ? "underline" : "none";
      style.transform = isPressed ? "scale(0.96)" : "scale(1)";
    }

    return (
      <button
        style={style}
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={() => setHoveredBtn(id)}
        onMouseLeave={() => {
          setHoveredBtn(null);
          setPressedBtn(null);
        }}
        onMouseDown={() => setPressedBtn(id)}
        onMouseUp={() => setPressedBtn(null)}
      >
        {icon && (
          <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
        )}
        {label}
      </button>
    );
  };

  // ==================== DIVISION TABLE ====================

  const renderDivisionTable = () => {
    const visibleSteps = factorisationData.steps.slice(
      0,
      Math.max(0, currentStep),
    );
    const isSummary = currentStep > factorisationData.steps.length;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "0px",
          fontFamily: DS.font,
          padding: "16px 16px 8px 16px",
        }}
      >
        {/* Section label */}
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: DS.indigo,
            marginBottom: "10px",
            letterSpacing: "1.2px",
            textTransform: "uppercase",
          }}
        >
          Division Format
        </div>

        {visibleSteps.map((step, i) => {
          const isCurrent = i === currentStep - 1;
          const delay = `${i * 0.07}s`;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "stretch",
                animation: `singFadeInLeft 0.45s ease-out ${delay} both`,
                width: "100%",
                marginBottom: "1px",
              }}
            >
              {/* Divisor pill */}
              <div
                style={{
                  minWidth: "42px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "15px",
                  color: DS.white,
                  background: isCurrent
                    ? `linear-gradient(135deg, ${getPrimeColor(step.divisor)}, ${getPrimeColor(step.divisor)}cc)`
                    : getPrimeColor(step.divisor),
                  borderRadius: "10px 0 0 10px",
                  animation: isCurrent
                    ? "singGlowPurple 2s ease-in-out infinite"
                    : "none",
                  boxShadow: isCurrent
                    ? `0 0 16px ${getPrimeColor(step.divisor)}33`
                    : "none",
                  transition: "all 0.3s ease",
                }}
              >
                {step.divisor}
              </div>

              {/* Dividend area */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 14px",
                  flex: 1,
                  borderTop: `2px solid ${isCurrent ? getPrimeColor(step.divisor) + "44" : DS.lightGrey}`,
                  borderRight: `2px solid ${isCurrent ? getPrimeColor(step.divisor) + "44" : DS.lightGrey}`,
                  borderBottom: `2px solid ${isCurrent ? getPrimeColor(step.divisor) + "44" : DS.lightGrey}`,
                  borderRadius: "0 10px 10px 0",
                  backgroundColor: isCurrent
                    ? getPrimeLightColor(step.divisor) + "66"
                    : DS.white,
                  transition: "all 0.3s ease",
                  minHeight: "40px",
                }}
              >
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: isCurrent ? getPrimeColor(step.divisor) : DS.dark,
                    fontFamily: DS.font,
                  }}
                >
                  {step.dividend}
                </span>
              </div>
            </div>
          );
        })}

        {/* Remaining quotient */}
        {visibleSteps.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              animation: `singFadeInLeft 0.45s ease-out ${visibleSteps.length * 0.07}s both`,
              paddingLeft: "0",
              marginTop: "1px",
              width: "100%",
            }}
          >
            <div
              style={{
                minWidth: "42px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px 0 0 10px",
                backgroundColor:
                  visibleSteps[visibleSteps.length - 1].quotient === 1
                    ? DS.lightPeach
                    : DS.offWhite,
              }}
            />
            <div
              style={{
                padding: "0 14px",
                flex: 1,
                display: "flex",
                alignItems: "center",
                minHeight: "40px",
                borderRadius: "0 10px 10px 0",
                backgroundColor:
                  visibleSteps[visibleSteps.length - 1].quotient === 1
                    ? DS.lightPeach
                    : DS.offWhite,
              }}
            >
              <span
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  fontFamily: DS.font,
                  color:
                    visibleSteps[visibleSteps.length - 1].quotient === 1
                      ? DS.orange
                      : DS.dark,
                }}
              >
                {visibleSteps[visibleSteps.length - 1].quotient}
                {visibleSteps[visibleSteps.length - 1].quotient === 1 && (
                  <span style={{ marginLeft: "8px", fontSize: "14px" }}>
                    ✓ Done
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== TREE DIAGRAM ====================

  const renderTreeDiagram = () => {
    const visibleSteps = factorisationData.steps.slice(
      0,
      Math.max(0, currentStep),
    );
    if (visibleSteps.length === 0) return null;

    const nodeW = 54;
    const nodeH = 30;
    const levelH = 56;
    const svgW = 260;
    const svgH = Math.max(180, (visibleSteps.length + 1) * levelH + 30);
    const rootX = svgW / 2;
    const rootY = 22;
    const spread = 52;

    interface TreeNode {
      x: number;
      y: number;
      value: number;
      isPrime: boolean;
      color: string;
      level: number;
    }
    interface TreeEdge {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      level: number;
    }

    const nodes: TreeNode[] = [];
    const edges: TreeEdge[] = [];

    nodes.push({
      x: rootX,
      y: rootY,
      value: factorisationData.number,
      isPrime: false,
      color: DS.dark,
      level: 0,
    });

    let parentX = rootX;
    visibleSteps.forEach((step, i) => {
      const parentY = rootY + i * levelH;
      const childY = parentY + levelH;
      const leftX = parentX - spread;
      const rightX = parentX + spread;

      edges.push({
        x1: parentX,
        y1: parentY + nodeH / 2,
        x2: leftX,
        y2: childY - nodeH / 2,
        level: i,
      });
      nodes.push({
        x: leftX,
        y: childY,
        value: step.divisor,
        isPrime: true,
        color: getPrimeColor(step.divisor),
        level: i + 1,
      });

      edges.push({
        x1: parentX,
        y1: parentY + nodeH / 2,
        x2: rightX,
        y2: childY - nodeH / 2,
        level: i,
      });
      nodes.push({
        x: rightX,
        y: childY,
        value: step.quotient,
        isPrime:
          step.quotient <= 1
            ? false
            : i === visibleSteps.length - 1 && step.quotient > 1,
        color: step.quotient === 1 ? DS.success : DS.dark,
        level: i + 1,
      });

      parentX = rightX;
    });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px 8px 8px 8px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: DS.indigo,
            marginBottom: "10px",
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            alignSelf: "flex-start",
            paddingLeft: "8px",
          }}
        >
          Tree Diagram
        </div>
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={DS.indigo} stopOpacity="0.3" />
              <stop offset="100%" stopColor={DS.orange} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {edges.map((e, i) => (
            <line
              key={`e-${i}`}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke={DS.grey}
              strokeWidth="2"
              strokeDasharray="120"
              strokeDashoffset="0"
              style={{
                animation: `singDrawLine 0.5s ease-out ${e.level * 0.12}s both`,
              }}
            />
          ))}
          {nodes.map((n, i) => {
            const isRoot = i === 0;
            return (
              <g
                key={`n-${i}`}
                style={{
                  animation: `singPopIn 0.45s ease-out ${n.level * 0.12}s both`,
                }}
              >
                <rect
                  x={n.x - nodeW / 2}
                  y={n.y - nodeH / 2}
                  width={nodeW}
                  height={nodeH}
                  rx={n.isPrime ? "14" : "8"}
                  fill={n.isPrime ? n.color : isRoot ? DS.offWhite : DS.white}
                  stroke={n.isPrime ? n.color : DS.grey}
                  strokeWidth={n.isPrime ? "0" : "1.5"}
                />
                <text
                  x={n.x}
                  y={n.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="Poppins, sans-serif"
                  fill={n.isPrime ? DS.white : DS.dark}
                >
                  {n.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // ==================== FACTOR CHIPS + FINAL EQUATION ====================

  const renderFactorChips = () => {
    if (currentStep <= factorisationData.steps.length) return null;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          padding: "14px 12px",
          animation: "singFadeInUp 0.5s ease-out both",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: DS.orange,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
          }}
        >
          Prime Factors
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          {factorisationData.primeFactors.map((p, i) => (
            <div
              key={i}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: DS.chipRadius,
                backgroundColor: getPrimeColor(p),
                color: DS.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "15px",
                fontFamily: DS.font,
                animation: `singChipBounce 0.45s ease-out ${i * 0.08}s both`,
                boxShadow: `0 3px 12px ${getPrimeColor(p)}33`,
              }}
            >
              {p}
            </div>
          ))}
        </div>
        {/* Final equation card */}
        <div
          style={{
            marginTop: "4px",
            padding: "12px 20px",
            background: DS.gradientSubtle,
            borderRadius: DS.cardRadius,
            border: `2px solid ${DS.indigo}33`,
            animation: "singCelebrate 0.7s ease-out 0.6s both",
            boxShadow: DS.shadowMd,
          }}
        >
          <span
            style={{
              fontFamily: DS.font,
              fontWeight: 800,
              fontSize: "15px",
              color: DS.solidPurple,
            }}
          >
            {factorisationData.number} ={" "}
            {factorisationData.primeFactors.map((p, i) => (
              <React.Fragment key={i}>
                <span style={{ color: getPrimeColor(p), fontWeight: 900 }}>
                  {p}
                </span>
                {i < factorisationData.primeFactors.length - 1 && (
                  <span style={{ color: DS.grey, margin: "0 4px" }}>×</span>
                )}
              </React.Fragment>
            ))}
          </span>
        </div>
      </div>
    );
  };

  // ==================== TEACHING NOTE BANNER ====================

  const renderTeachingBanner = () => {
    const isIntro = currentStep === 0;
    const isSummary = currentStep > factorisationData.steps.length;
    const activeStep =
      !isIntro && !isSummary ? factorisationData.steps[currentStep - 1] : null;

    const bannerGradient = isIntro
      ? DS.gradientPrimary
      : isSummary
        ? DS.gradientAccent
        : `linear-gradient(135deg, ${getPrimeColor(activeStep?.divisor || 2)}, ${getPrimeColor(activeStep?.divisor || 2)}bb)`;

    return (
      <div
        style={{
          padding: "14px 20px",
          minHeight: "64px",
          background: bannerGradient,
          color: DS.white,
          fontFamily: DS.font,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          animation: "singSlideDown 0.35s ease-out both",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative shapes (from design system) */}
        <div
          style={{
            position: "absolute",
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.15)",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "70px",
            top: "8px",
            width: "0",
            height: "0",
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderBottom: "18px solid rgba(255,255,255,0.08)",
          }}
        />

        {isIntro && (
          <>
            <div style={{ fontSize: "15px", fontWeight: 800, zIndex: 1 }}>
              🔢 Prime Factorisation of {factorisationData.number}
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 500,
                opacity: 0.92,
                lineHeight: 1.5,
                zIndex: 1,
              }}
            >
              Follow the division method step by step. Identify the smallest
              prime that divides the current number. Press Next to begin!
            </div>
          </>
        )}
        {activeStep && showTeachingNotes && (
          <>
            <div style={{ fontSize: "13px", fontWeight: 700, zIndex: 1 }}>
              Step {currentStep}/{factorisationData.steps.length} — Divide{" "}
              {activeStep.dividend} by {activeStep.divisor}
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 500,
                opacity: 0.92,
                lineHeight: 1.45,
                zIndex: 1,
              }}
            >
              {activeStep.teachingNote}
            </div>
          </>
        )}
        {activeStep && !showTeachingNotes && showHints && (
          <>
            <div style={{ fontSize: "13px", fontWeight: 700, zIndex: 1 }}>
              Step {currentStep}: {activeStep.dividend} ÷ {activeStep.divisor} ={" "}
              {activeStep.quotient}
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 500,
                opacity: 0.92,
                zIndex: 1,
              }}
            >
              💡 {activeStep.hint}
            </div>
          </>
        )}
        {isSummary && (
          <>
            <div style={{ fontSize: "15px", fontWeight: 800, zIndex: 1 }}>
              🎉 Factorisation Complete!
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 500,
                opacity: 0.92,
                zIndex: 1,
              }}
            >
              Read off all primes from the left column to write the complete
              factorisation.
            </div>
          </>
        )}
      </div>
    );
  };

  // ==================== LEARN MODE ====================

  const renderLearnMode = () => {
    const isSummary = currentStep > factorisationData.steps.length;

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {renderTeachingBanner()}

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left panel: Division */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              borderRight: `1.5px solid ${DS.lightGrey}`,
              background: DS.white,
            }}
          >
            {currentStep > 0 ? (
              renderDivisionTable()
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gap: "14px",
                  padding: "20px",
                  animation: "singFadeInUp 0.5s ease-out both",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "20px",
                    background: DS.gradientMixed,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: DS.white,
                    fontSize: "28px",
                    fontWeight: 900,
                    fontFamily: DS.font,
                    boxShadow: DS.shadowLg,
                    animation: "singFloat 3s ease-in-out infinite",
                  }}
                >
                  {factorisationData.number}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: DS.dark,
                    fontFamily: DS.font,
                    fontWeight: 500,
                    textAlign: "center",
                    lineHeight: 1.5,
                    maxWidth: "200px",
                  }}
                >
                  We'll factorise this number using the{" "}
                  <strong style={{ color: DS.indigo }}>division method</strong>.
                </div>
              </div>
            )}
          </div>

          {/* Right panel: Tree + chips */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              background: DS.offWhite,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {currentStep > 0 && renderTreeDiagram()}
            {isSummary && renderFactorChips()}
            {currentStep === 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gap: "12px",
                  padding: "20px",
                  animation: "singFadeInRight 0.5s ease-out 0.15s both",
                }}
              >
                {/* Decorative shape from design system */}
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  style={{ animation: "singPulse 3s ease-in-out infinite" }}
                >
                  <polygon
                    points="30,5 55,50 5,50"
                    fill="none"
                    stroke={DS.lightPurple}
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="30"
                    cy="36"
                    r="10"
                    fill="none"
                    stroke={DS.lightPurple}
                    strokeWidth="2"
                  />
                </svg>
                <div
                  style={{
                    fontSize: "13px",
                    color: DS.dark,
                    fontFamily: DS.font,
                    fontWeight: 500,
                    textAlign: "center",
                    lineHeight: 1.5,
                    maxWidth: "200px",
                  }}
                >
                  The tree diagram will build here as you step through each
                  division.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==================== PROGRESS BAR ====================

  const renderProgressBar = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "10px 20px",
        backgroundColor: DS.offWhite,
        borderBottom: `1px solid ${DS.lightGrey}`,
      }}
    >
      {Array.from({ length: MAX_PRACTICE_QUESTIONS }).map((_, i) => {
        const isDone =
          i < practiceQuestionIndex ||
          (i === practiceQuestionIndex && practiceCompleted);
        const isCurrent = i === practiceQuestionIndex && !practiceCompleted;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flex: 1,
            }}
          >
            {/* Dot / Number */}
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                flexShrink: 0,
                background: isDone
                  ? DS.indigo
                  : isCurrent
                    ? DS.gradientAccent
                    : DS.lightGrey,
                color: isDone || isCurrent ? DS.white : DS.grey,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 800,
                fontFamily: DS.font,
                transition: "all 0.3s ease",
                boxShadow: isCurrent ? DS.shadowOrange : "none",
                animation: isCurrent
                  ? "singPulse 2s ease-in-out infinite"
                  : "none",
              }}
            >
              {isDone ? "✓" : i + 1}
            </div>
            {/* Connector line */}
            {i < MAX_PRACTICE_QUESTIONS - 1 && (
              <div
                style={{
                  flex: 1,
                  height: "3px",
                  borderRadius: "2px",
                  backgroundColor: isDone ? DS.indigo : DS.lightGrey,
                  transition: "background-color 0.4s ease",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  // ==================== PRACTICE MODE ====================

  const renderPracticeMode = () => {
    const currentPStep = practiceData.steps[practiceStep];

    // ===== ALL 5 QUESTIONS DONE - FINAL SUMMARY =====
    if (allPracticeDone) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: "14px",
            padding: "20px",
            animation: "singFadeInUp 0.5s ease-out both",
            background: DS.white,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: DS.gradientMixed,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              animation: "singCelebrate 0.7s ease-out both",
              boxShadow: DS.shadowLg,
            }}
          >
            🎓
          </div>
          <div
            style={{
              fontFamily: DS.font,
              fontSize: "22px",
              fontWeight: 900,
              color: DS.solidPurple,
            }}
          >
            Practice Complete!
          </div>
          <div
            style={{
              fontFamily: DS.font,
              fontSize: "14px",
              color: DS.dark,
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            You completed all {MAX_PRACTICE_QUESTIONS} questions
          </div>

          {/* Score badge */}
          <div
            style={{
              padding: "10px 28px",
              borderRadius: DS.pillRadius,
              background: DS.gradientAccent,
              color: DS.white,
              fontFamily: DS.font,
              fontWeight: 800,
              fontSize: "18px",
              boxShadow: DS.shadowOrange,
              animation: "singPopIn 0.5s ease-out 0.3s both",
            }}
          >
            Score: {practiceScore}/{practiceTotal}
          </div>

          {/* Results list */}
          <div
            style={{
              width: "100%",
              maxWidth: "340px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              marginTop: "4px",
            }}
          >
            {questionResults.map((qr, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 14px",
                  borderRadius: DS.chipRadius,
                  backgroundColor: DS.offWhite,
                  animation: `singFadeInUp 0.35s ease-out ${i * 0.08}s both`,
                }}
              >
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: DS.indigo,
                    color: DS.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 800,
                    fontFamily: DS.font,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    flex: 1,
                    fontFamily: DS.font,
                    fontSize: "13px",
                    fontWeight: 600,
                    color: DS.dark,
                  }}
                >
                  {qr.number} ={" "}
                  <span style={{ color: DS.solidPurple, fontWeight: 700 }}>
                    {qr.factorisation}
                  </span>
                </div>
                <span style={{ fontSize: "16px" }}>✅</span>
              </div>
            ))}
          </div>

          {/* Restart button */}
          <div style={{ marginTop: "6px" }}>
            <SingButton
              id="restart-prac"
              label="Restart Practice"
              onClick={restartPractice}
              highlight
            />
          </div>
        </div>
      );
    }

    // Guard - if no step data available
    if (!currentPStep) return null;

    // ===== SINGLE QUESTION COMPLETED - SHOW RESULT + NEXT =====
    if (practiceCompleted) {
      const isLastQuestion =
        practiceQuestionIndex >= MAX_PRACTICE_QUESTIONS - 1;
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: "14px",
            padding: "24px",
            animation: "singFadeInUp 0.5s ease-out both",
            background: DS.white,
          }}
        >
          {/* Progress indicator */}
          {renderProgressBar()}

          <div
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "50%",
              background: DS.gradientAccent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              animation: "singCelebrate 0.7s ease-out both",
              boxShadow: DS.shadowOrange,
            }}
          >
            🏆
          </div>
          <div
            style={{
              fontFamily: DS.font,
              fontSize: "18px",
              fontWeight: 800,
              color: DS.solidPurple,
            }}
          >
            Great Job!
          </div>
          <div
            style={{
              fontFamily: DS.font,
              fontSize: "13px",
              color: DS.dark,
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            You factorised{" "}
            <strong style={{ color: DS.indigo }}>{practiceNumber}</strong>{" "}
            correctly!
          </div>
          <div
            style={{
              padding: "10px 20px",
              background: DS.gradientSubtle,
              borderRadius: DS.cardRadius,
              border: `2px solid ${DS.indigo}22`,
              fontFamily: DS.font,
              fontWeight: 700,
              fontSize: "14px",
              color: DS.solidPurple,
            }}
          >
            {practiceNumber} = {practiceData.factorisation}
          </div>
          <div
            style={{
              fontFamily: DS.font,
              fontSize: "12px",
              color: DS.grey,
              fontWeight: 600,
            }}
          >
            Question {practiceQuestionIndex + 1} of {MAX_PRACTICE_QUESTIONS} •
            Score: {practiceScore}/{practiceTotal}
          </div>
          <SingButton
            id="next-prac"
            label={
              isLastQuestion
                ? "See Results"
                : `Next Question (${practiceQuestionIndex + 2}/${MAX_PRACTICE_QUESTIONS})`
            }
            onClick={nextPracticeNumber}
            highlight
          />
        </div>
      );
    }

    // ===== ACTIVE QUESTION =====
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: DS.white,
        }}
      >
        {/* Practice header */}
        <div
          style={{
            padding: "12px 20px",
            background: DS.gradientAccent,
            color: DS.white,
            fontFamily: DS.font,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative shape */}
          <div
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              width: "32px",
              height: "32px",
              border: "2px solid rgba(255,255,255,0.2)",
              borderRadius: "6px",
              transform: "translateY(-50%) rotate(15deg)",
            }}
          />
          <div
            style={{
              fontSize: "14px",
              fontWeight: 700,
              zIndex: 1,
              position: "relative",
            }}
          >
            🧩 Q{practiceQuestionIndex + 1}/{MAX_PRACTICE_QUESTIONS}: Factorise{" "}
            {practiceNumber}
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 500,
              opacity: 0.92,
              zIndex: 1,
              position: "relative",
            }}
          >
            Step {practiceStep + 1}/{practiceData.steps.length} — What is the
            smallest prime that divides {currentPStep.dividend}?
          </div>
        </div>

        {/* Progress bar */}
        {renderProgressBar()}

        {/* Division table built so far */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
          <div style={{ fontFamily: DS.font }}>
            {practiceData.steps.slice(0, practiceStep).map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  marginBottom: "2px",
                  animation: `singFadeInLeft 0.3s ease-out ${i * 0.04}s both`,
                }}
              >
                <div
                  style={{
                    minWidth: "38px",
                    height: "36px",
                    borderRadius: "8px 0 0 8px",
                    backgroundColor: getPrimeColor(step.divisor),
                    color: DS.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "14px",
                  }}
                >
                  {step.divisor}
                </div>
                <div
                  style={{
                    padding: "0 12px",
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    borderTop: `1.5px solid ${DS.lightGrey}`,
                    borderRight: `1.5px solid ${DS.lightGrey}`,
                    borderBottom: `1.5px solid ${DS.lightGrey}`,
                    borderRadius: "0 8px 8px 0",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: DS.dark,
                    minHeight: "36px",
                    backgroundColor: DS.white,
                  }}
                >
                  {step.dividend}
                </div>
              </div>
            ))}

            {/* Current unknown step */}
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                marginBottom: "2px",
                animation: "singFadeInLeft 0.35s ease-out both",
              }}
            >
              <div
                style={{
                  minWidth: "38px",
                  height: "36px",
                  borderRadius: "8px 0 0 8px",
                  backgroundColor:
                    practiceCorrect === true
                      ? DS.success
                      : practiceCorrect === false
                        ? DS.error
                        : DS.grey,
                  color: DS.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "15px",
                  animation:
                    practiceCorrect === false
                      ? "singShake 0.5s ease-out"
                      : practiceCorrect === null
                        ? "singGlowOrange 2s ease-in-out infinite"
                        : "none",
                  transition: "background-color 0.3s ease",
                }}
              >
                ?
              </div>
              <div
                style={{
                  padding: "0 12px",
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  border: `2px solid ${practiceCorrect === true ? DS.success : practiceCorrect === false ? DS.error : DS.orange}44`,
                  borderRadius: "0 8px 8px 0",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: DS.dark,
                  minHeight: "36px",
                  backgroundColor:
                    practiceCorrect === true
                      ? "#ECFDF5"
                      : practiceCorrect === false
                        ? "#FEF2F2"
                        : DS.lightPeach + "44",
                }}
              >
                {currentPStep.dividend}
              </div>
            </div>
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "16px",
            }}
          >
            <input
              type="number"
              value={practiceInput}
              onChange={(e) => setPracticeInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePracticeSubmit()}
              placeholder="Prime..."
              style={{
                padding: "10px 14px",
                borderRadius: DS.pillRadius,
                border: `2px solid ${practiceCorrect === true ? DS.success : practiceCorrect === false ? DS.error : DS.lightGrey}`,
                fontSize: "15px",
                fontFamily: DS.font,
                fontWeight: 700,
                width: "110px",
                outline: "none",
                transition: "border-color 0.3s ease",
                backgroundColor:
                  practiceCorrect === true
                    ? "#ECFDF5"
                    : practiceCorrect === false
                      ? "#FEF2F2"
                      : DS.white,
              }}
            />
            <SingButton
              id="check"
              label="Check"
              onClick={handlePracticeSubmit}
              variant="contained"
            />
          </div>

          {/* Feedback */}
          {practiceCorrect === true && (
            <div
              style={{
                marginTop: "12px",
                padding: "10px 16px",
                backgroundColor: "#ECFDF5",
                borderRadius: DS.chipRadius,
                border: `1.5px solid ${DS.success}33`,
                color: "#166534",
                fontFamily: DS.font,
                fontWeight: 600,
                fontSize: "13px",
                animation: "singFadeInUp 0.3s ease-out both",
              }}
            >
              ✅ Correct! {currentPStep.dividend} ÷ {currentPStep.divisor} ={" "}
              {currentPStep.quotient}
            </div>
          )}
          {practiceCorrect === false && (
            <div
              style={{
                marginTop: "12px",
                padding: "10px 16px",
                backgroundColor: "#FEF2F2",
                borderRadius: DS.chipRadius,
                border: `1.5px solid ${DS.error}33`,
                color: "#991B1B",
                fontFamily: DS.font,
                fontWeight: 600,
                fontSize: "13px",
                animation: "singShake 0.5s ease-out both",
              }}
            >
              ❌ Try again! Hint: {currentPStep.hint}
            </div>
          )}

          {practiceTotal > 0 && (
            <div
              style={{
                marginTop: "12px",
                fontSize: "12px",
                color: DS.grey,
                fontFamily: DS.font,
                fontWeight: 600,
              }}
            >
              Score: {practiceScore}/{practiceTotal}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==================== MAIN RENDER ====================

  return (
    <div
      style={{
        width: `${width}px`,
        maxWidth: "100%",
        height: `${height}px`,
        fontFamily: DS.font,
        borderRadius: DS.cardRadius,
        overflow: "hidden",
        boxShadow: DS.shadowLg,
        display: "flex",
        flexDirection: "column",
        background: DS.white,
        border: `1.5px solid ${DS.lightGrey}`,
        position: "relative",
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          height: "52px",
          flexShrink: 0,
          background: DS.gradientPrimary,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative shapes from design system */}
        <div
          style={{
            position: "absolute",
            right: "100px",
            top: "-10px",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "60px",
            bottom: "-6px",
            width: "24px",
            height: "24px",
            border: "2px solid rgba(255,255,255,0.06)",
            borderRadius: "4px",
            transform: "rotate(20deg)",
          }}
        />

        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
              backdropFilter: "blur(4px)",
            }}
          >
            🔢
          </div>
          <div>
            <div
              style={{
                color: DS.white,
                fontSize: "14px",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Prime Factorisation
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.4px",
              }}
            >
              Division Method • Grade 7
            </div>
          </div>
        </div>

        {/* Mode selector - pill style */}
        {showModeSelector && (
          <div
            style={{
              display: "flex",
              gap: "3px",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: DS.pillRadius,
              padding: "3px",
              backdropFilter: "blur(4px)",
              zIndex: 1,
            }}
          >
            {[
              {
                key: "learn" as ModeType,
                icon: <BookOpen size={12} />,
                label: "Learn",
              },
              {
                key: "practice" as ModeType,
                icon: <Target size={12} />,
                label: "Practice",
              },
            ].map((mode) => (
              <button
                key={mode.key}
                onClick={() => {
                  setCurrentMode(mode.key);
                  if (mode.key === "learn") resetTool();
                  if (mode.key === "practice") restartPractice();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "5px 14px",
                  borderRadius: DS.pillRadius,
                  border: "none",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: DS.font,
                  color:
                    currentMode === mode.key
                      ? DS.indigo
                      : "rgba(255,255,255,0.7)",
                  backgroundColor:
                    currentMode === mode.key ? DS.white : "transparent",
                  transition: "all 0.3s ease",
                  boxShadow: currentMode === mode.key ? DS.shadowSm : "none",
                }}
              >
                {mode.icon}
                {mode.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===== CONTENT ===== */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {currentMode === "learn" && renderLearnMode()}
        {currentMode === "practice" && renderPracticeMode()}
      </div>

      {/* ===== NAVIGATION BAR (learn only) ===== */}
      {currentMode === "learn" && showNavigation && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            height: "54px",
            backgroundColor: DS.offWhite,
            borderTop: `1.5px solid ${DS.lightGrey}`,
            flexShrink: 0,
          }}
        >
          {/* Back button */}
          <SingButton
            id="prev"
            label="Back"
            variant="outlined"
            icon={<ChevronLeft size={15} />}
            onClick={goToPrev}
            disabled={currentStep === 0}
            size="sm"
          />

          {/* Center: dots + controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {showStepIndicator && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: DS.dark,
                  fontFamily: DS.font,
                }}
              >
                {currentStep === 0
                  ? "Intro"
                  : currentStep > factorisationData.steps.length
                    ? "Summary"
                    : `${currentStep}/${factorisationData.steps.length}`}
              </span>
            )}

            {/* Step dots */}
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              {Array.from({ length: totalSteps + 1 }).map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  style={{
                    width: currentStep === i ? "16px" : "7px",
                    height: "7px",
                    borderRadius: "4px",
                    backgroundColor:
                      currentStep === i
                        ? DS.indigo
                        : i < currentStep
                          ? DS.lightPurple
                          : DS.lightGrey,
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              ))}
            </div>

            {/* Play/Pause */}
            {showPlayPause && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  background: DS.gradientMixed,
                  color: DS.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.25s ease",
                  boxShadow: DS.shadowSm,
                }}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              </button>
            )}

            {/* Reset */}
            <button
              onClick={resetTool}
              onMouseEnter={() => setHoveredBtn("reset")}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                border: `1.5px solid ${DS.lightGrey}`,
                backgroundColor: DS.white,
                color: DS.dark,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transform:
                  hoveredBtn === "reset" ? "rotate(-60deg)" : "rotate(0deg)",
                transition: "all 0.35s ease",
              }}
            >
              <RotateCcw size={12} />
            </button>
          </div>

          {/* Next button */}
          <SingButton
            id="next"
            label="Next"
            variant="contained"
            highlight
            icon={<ChevronRight size={15} />}
            onClick={goToNext}
            disabled={currentStep > totalSteps}
            size="sm"
          />
        </div>
      )}
    </div>
  );
};

export default PrimeFactorisationDivisionMethod;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
