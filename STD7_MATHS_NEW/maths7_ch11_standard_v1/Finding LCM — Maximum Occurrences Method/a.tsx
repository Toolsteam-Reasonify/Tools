// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: lcm_max_occurrences_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════
// @ts-ignore - module may be resolved by parent workspace
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  // @ts-ignore
} from "react";
// @ts-ignore - module may be resolved by parent workspace
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
  Zap,
  Award,
  Star,
  Plus,
  // @ts-ignore
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

interface LCMAdditionalProps {
  numberA?: number;
  numberB?: number;
  practiceNumberA?: number;
  practiceNumberB?: number;
}

interface LCMToolProps {
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
    additionalProps?: LCMAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  // Primary
  indigo: "#4A4DC9",
  orange: "#FF7212",
  // Gradient
  gradientStart: "#533086",
  gradientEnd: "#FC9145",
  // Light tints
  lightPurple: "#C1C1EA",
  lightOrange: "#FFF3E4",
  // Neutrals
  dark: "#4E4E4E",
  grey: "#CACACA",
  lightGrey: "#EBEBEB",
  bg: "#F5F5F5",
  white: "#FFFFFF",
  // Semantic
  success: "#2ECC71",
  error: "#E74C3C",
  // Derived
  indigoHover: "#3B3DB5",
  indigoPressed: "#333599",
  orangeHover: "#E56510",
  indigoLight: "#EEEEF8",
  orangeLight: "#FFF8F0",
};

// ==================== HELPER FUNCTIONS ====================

const primeFactorise = (n: number): number[] => {
  const factors: number[] = [];
  let d = 2;
  let num = n;
  while (d * d <= num) {
    while (num % d === 0) {
      factors.push(d);
      num /= d;
    }
    d++;
  }
  if (num > 1) factors.push(num);
  return factors;
};

const countPrimes = (factors: number[]): Map<number, number> => {
  const counts = new Map<number, number>();
  for (const f of factors) {
    counts.set(f, (counts.get(f) || 0) + 1);
  }
  return counts;
};

const getAllPrimes = (
  countsA: Map<number, number>,
  countsB: Map<number, number>,
): number[] => {
  const primes = new Set<number>();
  countsA.forEach((_, k) => primes.add(k));
  countsB.forEach((_, k) => primes.add(k));
  return Array.from(primes).sort((a, b) => a - b);
};

// ==================== PRIME COLOR MAP (Singularity Palette) ====================

const PRIME_COLORS: Record<number, string> = {
  2: DS.indigo, // blue-indigo for 2s
  3: DS.orange, // orange for 3s
  5: "#2ECC71", // green for 5s
  7: DS.gradientStart, // deep purple for 7s
  11: "#E74C3C", // red
  13: "#1ABC9C", // teal
  17: "#F39C12", // gold
  19: "#E91E63", // rose
};

const PRIME_LIGHT_COLORS: Record<number, string> = {
  2: DS.lightPurple,
  3: DS.lightOrange,
  5: "#E8F8F0",
  7: "#EDE0F5",
  11: "#FDEDED",
  13: "#E0F5F1",
  17: "#FEF5E7",
  19: "#FCE4EC",
};

const getPrimeColor = (p: number): string => PRIME_COLORS[p] || DS.grey;
const getPrimeLightColor = (p: number): string =>
  PRIME_LIGHT_COLORS[p] || DS.bg;

// ==================== SUITCASE ANALOGY ====================

const SUITCASE_ITEMS: Record<number, { emoji: string; name: string }> = {
  2: { emoji: "👕", name: "Shirts" },
  3: { emoji: "👖", name: "Pants" },
  5: { emoji: "🧦", name: "Socks" },
  7: { emoji: "🎩", name: "Hats" },
  11: { emoji: "👟", name: "Shoes" },
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

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Meet the Numbers",
    description:
      "We want to find the LCM (Lowest Common Multiple) of 96 and 360. Let's break them down step by step!",
    type: "intro",
    mode: "learn",
  },
  {
    id: 2,
    title: "Prime Factorisation",
    description:
      "First, let's find the prime factorisation of both numbers using the division method.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 3,
    title: "List ALL Primes",
    description:
      "Collect every prime that appears in EITHER factorisation. This is key — for LCM we need ALL primes, not just the common ones!",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 4,
    title: "Maximum Count: Prime 2",
    description:
      "How many 2s are in each? 96 has FIVE 2s, 360 has THREE 2s. For LCM, take the MAXIMUM → 5 twos.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 5,
    title: "Maximum Count: Prime 3",
    description:
      "How many 3s? 96 has ONE 3, 360 has TWO 3s. Take the MAXIMUM → 2 threes.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 6,
    title: "Maximum Count: Prime 5",
    description:
      "How many 5s? 96 has ZERO 5s, 360 has ONE 5. Take the MAXIMUM → 1 five.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 7,
    title: "Compute the LCM!",
    description:
      "Multiply all the maximum prime powers: 2⁵ × 3² × 5¹ = 32 × 9 × 5 = 1440. The LCM of 96 and 360 is 1440!",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 8,
    title: "HCF vs LCM Symmetry",
    description:
      "HCF takes MINIMUM counts (arrows ↓), LCM takes MAXIMUM counts (arrows ↑). They're mirror images! And HCF × LCM = Product of the two numbers.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 10,
    title: "Your Turn: LCM(30, 72)",
    description:
      "Now try finding the LCM of 30 and 72 using the maximum occurrences method!",
    type: "practice",
    mode: "practice",
  },
];

// ==================== KEYFRAMES ====================

const keyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInLeft {
        from { opacity: 0; transform: translateX(-24px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeInRight {
        from { opacity: 0; transform: translateX(24px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes popIn {
        0% { transform: scale(0); opacity: 0; }
        60% { transform: scale(1.12); }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.06); }
    }
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-16px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes glowIndigo {
        0%, 100% { box-shadow: 0 0 4px rgba(74,77,201,0.2); }
        50% { box-shadow: 0 0 18px rgba(74,77,201,0.45); }
    }
    @keyframes glowOrange {
        0%, 100% { box-shadow: 0 0 4px rgba(255,114,18,0.2); }
        50% { box-shadow: 0 0 18px rgba(255,114,18,0.45); }
    }
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
    }
    @keyframes arrowDown {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(4px); }
    }
    @keyframes arrowUp {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
    }
    @keyframes celebrate {
        0% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.08) rotate(-2deg); }
        50% { transform: scale(1.12) rotate(2deg); }
        75% { transform: scale(1.08) rotate(-1deg); }
        100% { transform: scale(1) rotate(0deg); }
    }
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes ripple {
        0% { transform: scale(0); opacity: 0.4; }
        100% { transform: scale(4); opacity: 0; }
    }
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-4px); }
    }
`;

// ==================== MAIN COMPONENT ====================

type IncomingProps = NonNullable<LCMToolProps["props"]>;

const LCMMaxOccurrencesTool: React.FC<LCMToolProps> = ({
  props: incomingProps,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const props: IncomingProps = incomingProps ?? {};
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: (props.initialMode ?? "learn") as ModeType,
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: props.enabledModes ?? ["learn", "practice"],
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

  const additionalProps = props.additionalProps ?? {};
  const numberA = additionalProps.numberA ?? 96;
  const numberB = additionalProps.numberB ?? 360;
  const practiceA = additionalProps.practiceNumberA ?? 30;
  const practiceB = additionalProps.practiceNumberB ?? 72;

  // Compute factorisations
  const factorsA = useMemo(() => primeFactorise(numberA), [numberA]);
  const factorsB = useMemo(() => primeFactorise(numberB), [numberB]);
  const countsA = useMemo(() => countPrimes(factorsA), [factorsA]);
  const countsB = useMemo(() => countPrimes(factorsB), [factorsB]);
  const allPrimes = useMemo(
    () => getAllPrimes(countsA, countsB),
    [countsA, countsB],
  );

  // Practice
  const pFactorsA = useMemo(() => primeFactorise(practiceA), [practiceA]);
  const pFactorsB = useMemo(() => primeFactorise(practiceB), [practiceB]);
  const pCountsA = useMemo(() => countPrimes(pFactorsA), [pFactorsA]);
  const pCountsB = useMemo(() => countPrimes(pFactorsB), [pFactorsB]);
  const pAllPrimes = useMemo(
    () => getAllPrimes(pCountsA, pCountsB),
    [pCountsA, pCountsB],
  );

  // State
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
  const [animKey, setAnimKey] = useState(0);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);

  // Practice state
  const [practiceAnswers, setPracticeAnswers] = useState<
    Record<string, number>
  >({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [practiceCorrect, setPracticeCorrect] = useState(false);

  const modeSteps = useMemo(
    () => availableSteps.filter((s) => s.mode === selectedMode),
    [availableSteps, selectedMode],
  );

  const currentStep = modeSteps[currentStepIndex] || modeSteps[0];

  // Inject keyframes
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.id = "lcm-singularity-keyframes";
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    return () => {
      const existing = document.getElementById("lcm-singularity-keyframes");
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: modeSteps.length,
        isPaused: !isPlaying,
        currentMode: selectedMode,
      });
    }
  }, [currentStepIndex, modeSteps.length, isPlaying, selectedMode]);

  useEffect(() => {
    if (!isPlaying || config.autoPlayDuration <= 0) return;
    const timer = setTimeout(() => {
      if (currentStepIndex < modeSteps.length - 1) {
        goNext();
      } else {
        setIsPlaying(false);
      }
    }, config.autoPlayDuration);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, config.autoPlayDuration]);

  const goNext = useCallback(() => {
    if (currentStepIndex < modeSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setAnimKey((prev) => prev + 1);
    }
  }, [currentStepIndex, modeSteps.length]);

  const goPrev = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setAnimKey((prev) => prev + 1);
    }
  }, [currentStepIndex]);

  const switchMode = useCallback((mode: ModeType) => {
    setSelectedMode(mode);
    setCurrentStepIndex(0);
    setAnimKey((prev) => prev + 1);
    setPracticeAnswers({});
    setPracticeSubmitted(false);
  }, []);

  const resetPractice = useCallback(() => {
    setPracticeAnswers({});
    setPracticeSubmitted(false);
    setPracticeCorrect(false);
  }, []);

  // ─────────────────────────────────────────
  // DESIGN SYSTEM BUTTON COMPONENT
  // ─────────────────────────────────────────

  const DSButton = ({
    label,
    variant = "contained",
    color = "indigo",
    onClick,
    disabled = false,
    icon,
    size = "md",
  }: {
    label: string;
    variant?: "contained" | "outlined" | "texted" | "highlight";
    color?: "indigo" | "orange";
    onClick?: () => void;
    disabled?: boolean;
    icon?: React.ReactNode;
    size?: "sm" | "md";
  }) => {
    const id = `btn-${label.replace(/\s/g, "")}`;
    const isHov = hoveredBtn === id;
    const isPressed = pressedBtn === id;
    const base = color === "indigo" ? DS.indigo : DS.orange;
    const hov = color === "indigo" ? DS.indigoHover : DS.orangeHover;
    const pressed = color === "indigo" ? DS.indigoPressed : "#CC5A0D";
    const light = color === "indigo" ? DS.lightPurple : DS.lightOrange;
    const pad = size === "sm" ? "6px 16px" : "10px 24px";
    const fs = size === "sm" ? 12 : 14;

    let style: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: pad,
      borderRadius: 24,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
      fontSize: fs,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      border: "none",
      outline: "none",
      userSelect: "none" as const,
      whiteSpace: "nowrap" as const,
    };

    if (variant === "contained") {
      style = {
        ...style,
        backgroundColor: disabled
          ? DS.lightGrey
          : isPressed
            ? pressed
            : isHov
              ? hov
              : base,
        color: disabled ? DS.grey : DS.white,
        boxShadow: disabled
          ? "none"
          : isHov
            ? `0 6px 20px ${base}40`
            : `0 2px 8px ${base}25`,
        transform: isPressed
          ? "scale(0.96)"
          : isHov
            ? "scale(1.03)"
            : "scale(1)",
      };
    } else if (variant === "outlined") {
      style = {
        ...style,
        backgroundColor: disabled
          ? DS.bg
          : isPressed
            ? light
            : isHov
              ? light
              : "transparent",
        color: disabled ? DS.grey : base,
        border: `2px solid ${disabled ? DS.lightGrey : isHov ? hov : base}`,
        transform: isPressed
          ? "scale(0.96)"
          : isHov
            ? "scale(1.02)"
            : "scale(1)",
      };
    } else if (variant === "texted") {
      style = {
        ...style,
        backgroundColor: "transparent",
        color: disabled ? DS.grey : isHov ? hov : base,
        border: "none",
        textDecoration: isHov ? "underline" : "none",
        transform: isPressed ? "scale(0.96)" : "scale(1)",
      };
    } else if (variant === "highlight") {
      style = {
        ...style,
        backgroundColor: disabled
          ? DS.lightGrey
          : isPressed
            ? DS.orangeHover
            : isHov
              ? DS.orangeHover
              : DS.orange,
        color: DS.white,
        boxShadow: disabled
          ? "none"
          : isHov
            ? `0 6px 20px ${DS.orange}40`
            : `0 2px 8px ${DS.orange}25`,
        transform: isPressed
          ? "scale(0.96)"
          : isHov
            ? "scale(1.03)"
            : "scale(1)",
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

  // ─────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────

  const renderPrimeBlock = (
    prime: number,
    index: number,
    delay: number = 0,
    size: number = 38,
  ) => (
    <div
      key={`${prime}-${index}-${delay}`}
      style={{
        width: size,
        height: size,
        borderRadius: size >= 40 ? 12 : 8,
        backgroundColor: getPrimeColor(prime),
        color: DS.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 700,
        fontSize: size * 0.4,
        animation: `popIn 0.4s ease-out ${delay}s both`,
        boxShadow: `0 3px 10px ${getPrimeColor(prime)}30`,
        margin: 2,
        letterSpacing: 0.3,
      }}
    >
      {prime}
    </div>
  );

  const renderFactorisationRow = (
    num: number,
    factors: number[],
    label: string,
    delay: number = 0,
  ) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        animation: `fadeInLeft 0.5s ease-out ${delay}s both`,
        padding: "10px 16px",
        borderRadius: 14,
        backgroundColor: DS.white,
        border: `1.5px solid ${DS.lightGrey}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 22,
          fontWeight: 700,
          color: DS.dark,
          minWidth: 50,
          textAlign: "right",
        }}
      >
        {num}
      </div>
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          color: DS.grey,
          fontSize: 16,
        }}
      >
        =
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          flexWrap: "wrap",
        }}
      >
        {factors.map((f, i) => (
          <React.Fragment key={i}>
            {renderPrimeBlock(f, i, delay + 0.1 + i * 0.07)}
            {i < factors.length - 1 && (
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  color: DS.grey,
                  fontSize: 13,
                  margin: "0 1px",
                }}
              >
                ×
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  // ─────────────────────────────────────────
  // STEP RENDERERS
  // ─────────────────────────────────────────

  const renderStep1 = () => (
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
        {/* Number A - Indigo */}
        <div
          style={{
            padding: "22px 36px",
            borderRadius: 20,
            background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.indigo})`,
            color: DS.white,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            fontSize: 38,
            boxShadow: `0 8px 28px ${DS.indigo}35`,
            animation: "popIn 0.6s ease-out 0.2s both",
            letterSpacing: 1,
          }}
        >
          {numberA}
        </div>
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: 22,
            color: DS.grey,
            animation: "fadeInUp 0.4s ease-out 0.4s both",
          }}
        >
          &amp;
        </div>
        {/* Number B - Orange */}
        <div
          style={{
            padding: "22px 36px",
            borderRadius: 20,
            background: `linear-gradient(135deg, ${DS.orange}, ${DS.gradientEnd})`,
            color: DS.white,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            fontSize: 38,
            boxShadow: `0 8px 28px ${DS.orange}35`,
            animation: "popIn 0.6s ease-out 0.5s both",
            letterSpacing: 1,
          }}
        >
          {numberB}
        </div>
      </div>
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 14,
          fontWeight: 500,
          color: DS.dark,
          textAlign: "center",
          animation: "fadeInUp 0.5s ease-out 0.7s both",
          maxWidth: 420,
          lineHeight: 1.6,
          opacity: 0.8,
        }}
      >
        The LCM is the smallest number that both {numberA} and {numberB} divide
        into evenly.
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        width: "100%",
        maxWidth: 520,
      }}
    >
      {renderFactorisationRow(numberA, factorsA, String(numberA), 0)}
      {renderFactorisationRow(numberB, factorsB, String(numberB), 0.3)}
    </div>
  );

  const renderStep3 = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        alignItems: "center",
      }}
    >
      {renderStep2()}
      <div
        style={{
          marginTop: 10,
          padding: "14px 22px",
          borderRadius: 14,
          background: `linear-gradient(135deg, ${DS.indigoLight}, ${DS.orangeLight})`,
          border: `2px solid ${DS.lightPurple}`,
          animation: "fadeInUp 0.5s ease-out 0.6s both",
        }}
      >
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: 13,
            color: DS.indigo,
            marginBottom: 10,
            textAlign: "center",
            textTransform: "uppercase" as const,
            letterSpacing: 0.8,
          }}
        >
          All primes found in either number
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {allPrimes.map((p, i) => renderPrimeBlock(p, i, 0.7 + i * 0.15, 46))}
        </div>
      </div>
    </div>
  );

  const renderComparisonStep = (primeIndex: number) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
            maxWidth: 520,
          }}
        >
          {renderFactorisationRow(numberA, factorsA, String(numberA), 0)}
          {renderFactorisationRow(numberB, factorsB, String(numberB), 0.1)}
        </div>

        {/* Comparison table */}
        <div
          style={{
            width: "100%",
            maxWidth: 480,
            borderRadius: 16,
            overflow: "hidden",
            border: `2px solid ${DS.lightGrey}`,
            animation: "fadeInUp 0.5s ease-out 0.3s both",
            backgroundColor: DS.white,
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            marginTop: 4,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              background: `linear-gradient(135deg, ${DS.gradientStart}08, ${DS.gradientEnd}08)`,
              padding: "10px 0",
              borderBottom: `1.5px solid ${DS.lightGrey}`,
            }}
          >
            {["Prime", `In ${numberA}`, `In ${numberB}`, "MAX ↑"].map(
              (h, i) => (
                <div
                  key={h}
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: 11,
                    color: i === 3 ? DS.orange : DS.dark,
                    textAlign: "center",
                    textTransform: "uppercase" as const,
                    letterSpacing: 0.6,
                  }}
                >
                  {h}
                </div>
              ),
            )}
          </div>
          {/* Data rows */}
          {allPrimes.slice(0, primeIndex + 1).map((p, ri) => {
            const cA = countsA.get(p) || 0;
            const cB = countsB.get(p) || 0;
            const mx = Math.max(cA, cB);
            const isActive = ri === primeIndex;
            return (
              <div
                key={p}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  padding: "12px 0",
                  backgroundColor: isActive ? `${DS.orange}08` : DS.white,
                  borderTop: ri > 0 ? `1px solid ${DS.lightGrey}` : "none",
                  animation: isActive
                    ? "glowOrange 2s ease-in-out infinite"
                    : undefined,
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {renderPrimeBlock(p, 0, isActive ? 0.4 : 0, 34)}
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: isActive && cA >= cB ? DS.indigo : DS.dark,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: isActive
                      ? "fadeInLeft 0.4s ease-out 0.5s both"
                      : undefined,
                  }}
                >
                  {cA}
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: isActive && cB >= cA ? DS.orange : DS.dark,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: isActive
                      ? "fadeInRight 0.4s ease-out 0.5s both"
                      : undefined,
                  }}
                >
                  {cB}
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 22,
                    fontWeight: 800,
                    color: DS.orange,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: isActive
                      ? "popIn 0.5s ease-out 0.7s both"
                      : undefined,
                  }}
                >
                  {mx}
                </div>
              </div>
            );
          })}
        </div>

        {/* LCM assembly area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 18px",
            borderRadius: 12,
            background: `linear-gradient(135deg, ${DS.indigo}08, ${DS.orange}08)`,
            border: `1.5px solid ${DS.lightPurple}`,
            animation: "fadeInUp 0.4s ease-out 0.8s both",
          }}
        >
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              color: DS.indigo,
              textTransform: "uppercase" as const,
              letterSpacing: 0.5,
            }}
          >
            LCM building:
          </span>
          {allPrimes.slice(0, primeIndex + 1).map((p) => {
            const mx = Math.max(countsA.get(p) || 0, countsB.get(p) || 0);
            return Array.from({ length: mx }).map((_, i) => (
              <React.Fragment key={`${p}-${i}`}>
                {renderPrimeBlock(p, i, 0.9 + i * 0.05, 28)}
              </React.Fragment>
            ));
          })}
        </div>
      </div>
    );
  };

  const renderStep7 = () => {
    const lcmParts: number[] = [];
    allPrimes.forEach((p) => {
      const mx = Math.max(countsA.get(p) || 0, countsB.get(p) || 0);
      for (let i = 0; i < mx; i++) lcmParts.push(p);
    });
    const lcm = lcmParts.reduce((a, b) => a * b, 1);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        {/* Assembly blocks */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeInUp 0.5s ease-out both",
          }}
        >
          {lcmParts.map((p, i) => (
            <React.Fragment key={i}>
              {renderPrimeBlock(p, i, 0.1 + i * 0.07, 38)}
              {i < lcmParts.length - 1 && (
                <span
                  style={{
                    color: DS.grey,
                    fontWeight: 700,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 14,
                  }}
                >
                  ×
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Equation */}
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            color: DS.dark,
            animation: "fadeInUp 0.4s ease-out 0.8s both",
          }}
        >
          {allPrimes
            .map((p) => {
              const mx = Math.max(countsA.get(p) || 0, countsB.get(p) || 0);
              return `${p}${mx > 1 ? `^${mx}` : ""}`;
            })
            .join(" × ")}{" "}
          ={" "}
          <span style={{ color: DS.orange, fontWeight: 800, fontSize: 17 }}>
            {lcm}
          </span>
        </div>

        {/* Big result card */}
        <div
          style={{
            padding: "18px 40px",
            borderRadius: 20,
            background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
            backgroundSize: "200% 200%",
            color: DS.white,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            fontSize: 34,
            boxShadow: `0 10px 36px ${DS.indigo}30`,
            animation: "celebrate 0.8s ease-out 1s both",
            letterSpacing: 1.5,
          }}
        >
          LCM = {lcm}
        </div>

        {/* Suitcase analogy */}
        <div
          style={{
            padding: "14px 18px",
            borderRadius: 14,
            backgroundColor: DS.lightOrange,
            border: `1.5px solid ${DS.orange}22`,
            animation: "fadeInUp 0.5s ease-out 1.2s both",
            maxWidth: 420,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: DS.orange,
              marginBottom: 6,
              textTransform: "uppercase" as const,
              letterSpacing: 0.6,
            }}
          >
            🧳 Suitcase Packing Analogy
          </div>
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 12,
              color: DS.dark,
              lineHeight: 1.6,
              opacity: 0.85,
            }}
          >
            Two friends pack for a trip. For each item, take the MAX of what
            either needs. That's exactly how LCM works with primes!
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              marginTop: 10,
              flexWrap: "wrap",
            }}
          >
            {allPrimes.map((p) => {
              const cA = countsA.get(p) || 0;
              const cB = countsB.get(p) || 0;
              const item = SUITCASE_ITEMS[p] || {
                emoji: "📦",
                name: `Item ${p}`,
              };
              return (
                <div
                  key={p}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 10,
                    backgroundColor: DS.white,
                    border: `1.5px solid ${getPrimeColor(p)}25`,
                    fontSize: 11,
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    color: DS.dark,
                    animation: `popIn 0.3s ease-out ${1.4 + allPrimes.indexOf(p) * 0.1}s both`,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  {item.emoji} max({cA},{cB})={Math.max(cA, cB)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderStep8 = () => {
    const hcfParts: number[] = [];
    const lcmParts: number[] = [];
    allPrimes.forEach((p) => {
      const cA = countsA.get(p) || 0;
      const cB = countsB.get(p) || 0;
      for (let i = 0; i < Math.min(cA, cB); i++) hcfParts.push(p);
      for (let i = 0; i < Math.max(cA, cB); i++) lcmParts.push(p);
    });
    const hcf = hcfParts.length > 0 ? hcfParts.reduce((a, b) => a * b, 1) : 1;
    const lcm = lcmParts.reduce((a, b) => a * b, 1);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* HCF Card - Indigo */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 16,
              backgroundColor: DS.indigoLight,
              border: `2px solid ${DS.lightPurple}`,
              minWidth: 190,
              animation: "fadeInLeft 0.5s ease-out 0.2s both",
            }}
          >
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: 15,
                color: DS.indigo,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              HCF ↓ Minimum
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {allPrimes.map((p) => {
                const cA = countsA.get(p) || 0;
                const cB = countsB.get(p) || 0;
                const mn = Math.min(cA, cB);
                return (
                  <div
                    key={p}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 12,
                    }}
                  >
                    {renderPrimeBlock(p, 0, 0, 24)}
                    <span
                      style={{ color: DS.dark, opacity: 0.7, fontWeight: 500 }}
                    >
                      min({cA},{cB})
                    </span>
                    <span
                      style={{
                        color: DS.indigo,
                        fontWeight: 800,
                        animation: "arrowDown 1s ease infinite",
                      }}
                    >
                      ↓ {mn}
                    </span>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                marginTop: 10,
                padding: "8px 14px",
                borderRadius: 12,
                backgroundColor: DS.indigo,
                color: DS.white,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: 18,
                textAlign: "center",
                boxShadow: `0 4px 14px ${DS.indigo}30`,
              }}
            >
              HCF = {hcf}
            </div>
          </div>

          {/* LCM Card - Orange */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 16,
              backgroundColor: DS.orangeLight,
              border: `2px solid ${DS.lightOrange}`,
              minWidth: 190,
              animation: "fadeInRight 0.5s ease-out 0.4s both",
            }}
          >
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: 15,
                color: DS.orange,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              LCM ↑ Maximum
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {allPrimes.map((p) => {
                const cA = countsA.get(p) || 0;
                const cB = countsB.get(p) || 0;
                const mx = Math.max(cA, cB);
                return (
                  <div
                    key={p}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 12,
                    }}
                  >
                    {renderPrimeBlock(p, 0, 0, 24)}
                    <span
                      style={{ color: DS.dark, opacity: 0.7, fontWeight: 500 }}
                    >
                      max({cA},{cB})
                    </span>
                    <span
                      style={{
                        color: DS.orange,
                        fontWeight: 800,
                        animation: "arrowUp 1s ease infinite",
                      }}
                    >
                      ↑ {mx}
                    </span>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                marginTop: 10,
                padding: "8px 14px",
                borderRadius: 12,
                backgroundColor: DS.orange,
                color: DS.white,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: 18,
                textAlign: "center",
                boxShadow: `0 4px 14px ${DS.orange}30`,
              }}
            >
              LCM = {lcm}
            </div>
          </div>
        </div>

        {/* Product verification */}
        <div
          style={{
            padding: "12px 18px",
            borderRadius: 12,
            background: `linear-gradient(135deg, ${DS.indigoLight}, ${DS.orangeLight})`,
            border: `1.5px solid ${DS.lightPurple}`,
            animation: "fadeInUp 0.5s ease-out 0.8s both",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              color: DS.gradientStart,
              textTransform: "uppercase" as const,
              letterSpacing: 0.5,
            }}
          >
            ✨ Magic Property: HCF × LCM = Product
          </div>
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: DS.dark,
              marginTop: 4,
            }}
          >
            {hcf} × {lcm} = {hcf * lcm} = {numberA} × {numberB} ={" "}
            {numberA * numberB} ✓
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────
  // PRACTICE MODE
  // ─────────────────────────────────────────

  const renderPracticeMode = () => {
    const correctLCMParts: number[] = [];
    pAllPrimes.forEach((p) => {
      const mx = Math.max(pCountsA.get(p) || 0, pCountsB.get(p) || 0);
      for (let i = 0; i < mx; i++) correctLCMParts.push(p);
    });
    const correctLCM = correctLCMParts.reduce((a, b) => a * b, 1);

    const handleAnswerChange = (prime: number, value: string) => {
      const num = parseInt(value) || 0;
      setPracticeAnswers((prev) => ({ ...prev, [prime]: num }));
    };

    const checkAnswers = () => {
      let allCorrect = true;
      pAllPrimes.forEach((p) => {
        const expected = Math.max(pCountsA.get(p) || 0, pCountsB.get(p) || 0);
        if ((practiceAnswers[p] || 0) !== expected) allCorrect = false;
      });
      setPracticeCorrect(allCorrect);
      setPracticeSubmitted(true);
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 20,
            fontWeight: 800,
            background: `linear-gradient(135deg, ${DS.indigo}, ${DS.orange})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "fadeInUp 0.4s ease-out both",
          }}
        >
          Find LCM({practiceA}, {practiceB})
        </div>

        <div style={{ width: "100%", maxWidth: 420 }}>
          {renderFactorisationRow(practiceA, pFactorsA, String(practiceA), 0.1)}
          <div style={{ height: 8 }} />
          {renderFactorisationRow(practiceB, pFactorsB, String(practiceB), 0.2)}
        </div>

        {/* Input table */}
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            borderRadius: 16,
            border: `2px solid ${DS.lightGrey}`,
            overflow: "hidden",
            animation: "fadeInUp 0.5s ease-out 0.4s both",
            backgroundColor: DS.white,
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1.2fr",
              background: `linear-gradient(135deg, ${DS.gradientStart}06, ${DS.gradientEnd}06)`,
              padding: "10px 0",
              borderBottom: `1.5px solid ${DS.lightGrey}`,
            }}
          >
            {["Prime", `In ${practiceA}`, `In ${practiceB}`, "MAX (you)"].map(
              (h, i) => (
                <div
                  key={h}
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: 10,
                    color: i === 3 ? DS.orange : DS.dark,
                    textAlign: "center",
                    textTransform: "uppercase" as const,
                    letterSpacing: 0.5,
                  }}
                >
                  {h}
                </div>
              ),
            )}
          </div>
          {pAllPrimes.map((p, ri) => {
            const cA = pCountsA.get(p) || 0;
            const cB = pCountsB.get(p) || 0;
            const expected = Math.max(cA, cB);
            const userVal = practiceAnswers[p];
            const isCorrect = practiceSubmitted && userVal === expected;
            const isWrong = practiceSubmitted && userVal !== expected;

            return (
              <div
                key={p}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1.2fr",
                  padding: "12px 0",
                  borderTop: ri > 0 ? `1px solid ${DS.lightGrey}` : "none",
                  backgroundColor: isCorrect
                    ? "#F0FDF4"
                    : isWrong
                      ? "#FEF2F2"
                      : DS.white,
                  transition: "background-color 0.3s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {renderPrimeBlock(p, 0, 0, 32)}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: DS.dark,
                  }}
                >
                  {cA}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: DS.dark,
                  }}
                >
                  {cB}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={practiceAnswers[p] ?? ""}
                    onChange={(e) => handleAnswerChange(p, e.target.value)}
                    disabled={practiceSubmitted}
                    style={{
                      width: 42,
                      height: 36,
                      borderRadius: 10,
                      border: `2px solid ${isCorrect ? DS.success : isWrong ? DS.error : DS.lightPurple}`,
                      textAlign: "center",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 16,
                      fontWeight: 700,
                      color: DS.dark,
                      outline: "none",
                      backgroundColor: practiceSubmitted ? DS.bg : DS.white,
                      transition: "all 0.3s ease",
                    }}
                  />
                  {isCorrect && <Check size={16} color={DS.success} />}
                  {isWrong && (
                    <span
                      style={{
                        color: DS.error,
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      →{expected}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            animation: "fadeInUp 0.4s ease-out 0.6s both",
          }}
        >
          {!practiceSubmitted ? (
            <DSButton
              label="Check My Answers"
              variant="contained"
              color="orange"
              onClick={checkAnswers}
              icon={<Check size={15} />}
            />
          ) : (
            <>
              <div
                style={{
                  padding: "10px 20px",
                  borderRadius: 14,
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
                  ? `🎉 Perfect! LCM = ${correctLCM}`
                  : "🔄 Not quite — check the MAX of each row"}
              </div>
              <DSButton
                label="Try Again"
                variant="outlined"
                color="indigo"
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

  // ─────────────────────────────────────────
  // CONTENT ROUTER
  // ─────────────────────────────────────────

  const renderContent = () => {
    if (selectedMode === "practice") return renderPracticeMode();
    const stepId = currentStep?.id;
    switch (stepId) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderComparisonStep(0);
      case 5:
        return renderComparisonStep(1);
      case 6:
        return renderComparisonStep(2);
      case 7:
        return renderStep7();
      case 8:
        return renderStep8();
      default:
        return renderStep1();
    }
  };

  const modeIcons: Record<ModeType, React.ReactNode> = {
    learn: <BookOpen size={15} />,
    practice: <Target size={15} />,
  };

  const modeLabels: Record<ModeType, string> = {
    learn: "Learn",
    practice: "Practice",
  };

  // ─────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────

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
        boxShadow: "0 4px 32px rgba(74,77,201,0.08)",
        border: `1.5px solid ${DS.lightGrey}`,
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
          padding: "18px 24px 14px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative shapes (from design system) */}
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: `3px solid ${DS.white}15`,
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 50,
            width: 40,
            height: 40,
            border: `2px solid ${DS.white}15`,
            opacity: 0.3,
            transform: "rotate(45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -10,
            right: 120,
            width: 0,
            height: 0,
            borderLeft: "20px solid transparent",
            borderRight: "20px solid transparent",
            borderBottom: `35px solid ${DS.white}10`,
            opacity: 0.3,
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
          Finding LCM Through Prime Factorisation
        </div>
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 12,
            fontWeight: 500,
            color: `${DS.white}AA`,
            marginTop: 3,
            position: "relative",
            zIndex: 1,
          }}
        >
          Ganita Prakash · Grade 7 · Chapter 3: Finding Common Ground
        </div>
      </div>

      {/* ===== MODE SELECTOR ===== */}
      {config.showModeSelector && (
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "12px 24px",
            backgroundColor: DS.bg,
            borderBottom: `1.5px solid ${DS.lightGrey}`,
          }}
        >
          {config.enabledModes.map((mode) => {
            const isActive = selectedMode === mode;
            return (
              <button
                key={mode}
                onClick={() => switchMode(mode)}
                onMouseEnter={() => setHoveredBtn(`mode-${mode}`)}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 20px",
                  borderRadius: 24,
                  border: isActive
                    ? `2px solid ${DS.indigo}`
                    : `2px solid transparent`,
                  backgroundColor: isActive
                    ? DS.white
                    : hoveredBtn === `mode-${mode}`
                      ? DS.white
                      : "transparent",
                  color: isActive ? DS.indigo : DS.dark,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isActive ? `0 2px 8px ${DS.indigo}15` : "none",
                  transform:
                    hoveredBtn === `mode-${mode}` && !isActive
                      ? "scale(1.02)"
                      : "scale(1)",
                  outline: "none",
                }}
              >
                {modeIcons[mode]}
                {modeLabels[mode]}
              </button>
            );
          })}
        </div>
      )}

      {/* ===== STEP INFO BAR ===== */}
      {selectedMode === "learn" && currentStep && (
        <div
          style={{
            padding: "14px 24px",
            borderBottom: `1.5px solid ${DS.lightGrey}`,
            animation: "slideDown 0.3s ease-out",
            backgroundColor: DS.white,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${DS.indigo}, ${DS.gradientStart})`,
                color: DS.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: 12,
                flexShrink: 0,
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
              color: DS.dark,
              opacity: 0.7,
              marginTop: 4,
              lineHeight: 1.5,
              marginLeft: 38,
            }}
          >
            {currentStep.description}
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div
        key={`${selectedMode}-${currentStepIndex}-${animKey}`}
        style={{
          padding: "24px",
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

      {/* ===== NAVIGATION ===== */}
      {config.showNavigation && selectedMode === "learn" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 24px",
            borderTop: `1.5px solid ${DS.lightGrey}`,
            backgroundColor: DS.bg,
          }}
        >
          <DSButton
            label="Back"
            variant="outlined"
            color="indigo"
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            icon={<ChevronLeft size={16} />}
            size="sm"
          />

          {/* Step indicator pills */}
          {config.showStepIndicator && (
            <div style={{ display: "flex", gap: 5 }}>
              {modeSteps.map((_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setCurrentStepIndex(i);
                    setAnimKey((prev) => prev + 1);
                  }}
                  style={{
                    width: i === currentStepIndex ? 26 : 8,
                    height: 8,
                    borderRadius: 4,
                    background:
                      i === currentStepIndex
                        ? `linear-gradient(135deg, ${DS.indigo}, ${DS.orange})`
                        : i < currentStepIndex
                          ? DS.lightPurple
                          : DS.lightGrey,
                    cursor: "pointer",
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              ))}
            </div>
          )}

          <DSButton
            label="Next"
            variant="contained"
            color="indigo"
            onClick={goNext}
            disabled={currentStepIndex === modeSteps.length - 1}
            icon={<ChevronRight size={16} />}
          />
        </div>
      )}

      {/* ===== FOOTER TIP ===== */}
      <div
        style={{
          padding: "10px 24px",
          backgroundColor: DS.lightOrange,
          borderTop: `1.5px solid ${DS.orange}15`,
        }}
      >
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 11,
            fontWeight: 500,
            color: DS.orange,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Star size={13} fill={DS.orange} color={DS.orange} />
          {selectedMode === "learn"
            ? "Follow the maximum occurrences method to build the LCM. For each prime, take the MAXIMUM count — the opposite of HCF!"
            : "Fill in the maximum count for each prime factor, then check your answers!"}
        </div>
      </div>
    </div>
  );
};

export default LCMMaxOccurrencesTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
