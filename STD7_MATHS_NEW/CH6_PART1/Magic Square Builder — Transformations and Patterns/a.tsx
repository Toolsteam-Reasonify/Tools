// @ts-nocheck
// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: magic_square_explorer.tsx
// ═══════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Check,
  RotateCcw,
  Star,
  Award,
  Plus,
  Sparkles,
} from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "explore";

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
  type: "intro" | "transformation" | "practice" | "explore";
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface TransformationConfig {
  label: string;
  description: string;
  grid: number[][];
  magicSum: number;
  operation: string;
  color: string;
}

interface MagicSquareAdditionalProps {
  initialGrid?: number[][];
  transformations?: TransformationConfig[];
  showVerification?: boolean;
  showAlgebra?: boolean;
  centerVariable?: string;
  animationStyle?: "morph" | "flip" | "slide";
}

interface MagicSquareExplorerProps {
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
    additionalProps?: MagicSquareAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DESIGN SYSTEM TOKENS (from Singularity PDF) ====================

const DS = {
  // Primary
  indigo: "#4A4DC9",
  orange: "#FF7212",
  // Gradient endpoints
  purpleDark: "#533086",
  orangeWarm: "#FC9145",
  // Light fills
  indigoLight: "#C1C1EA",
  orangeLight: "#FFF3E4",
  // Greys
  grey900: "#4E4E4E",
  grey500: "#CACACA",
  grey300: "#EBEBEB",
  grey100: "#F5F5F5",
  // Semantic
  white: "#FFFFFF",
  black: "#1A1A2E",
  // Derived
  indigoHover: "#3D3FB5",
  indigoPressed: "#353799",
  orangeHover: "#E5660F",
  successGreen: "#2CB67D",
  successGreenLight: "#D4F5E6",
  successGreenDark: "#1A7A52",
  errorRed: "#E53E3E",
  errorRedLight: "#FEE2E2",
  // Transparency helpers
  indigoAlpha10: "#4A4DC919",
  indigoAlpha20: "#4A4DC933",
  indigoAlpha30: "#4A4DC94D",
  orangeAlpha10: "#FF721219",
  orangeAlpha20: "#FF721233",
};

const FONT = "'Poppins', sans-serif";

const LO_SHU: number[][] = [
  [2, 7, 6],
  [9, 5, 1],
  [4, 3, 8],
];

const DEFAULT_TRANSFORMATIONS: TransformationConfig[] = [
  {
    label: "Lo Shu Square",
    description:
      "The original magic square using numbers 1–9. Every row, column, and diagonal adds to 15!",
    grid: LO_SHU,
    magicSum: 15,
    operation: "Original (1–9)",
    color: DS.indigo,
  },
  {
    label: "Add 1 to Each Cell",
    description:
      "Adding 1 to every number changes the set to 2–10. Each row gains 3 (three 1s), so the magic sum becomes 15 + 3 = 18.",
    grid: LO_SHU.map((row) => row.map((v) => v + 1)),
    magicSum: 18,
    operation: "+1 → (2–10)",
    color: DS.orange,
  },
  {
    label: "Double Each Cell",
    description:
      "Multiplying every number by 2 gives all even numbers. By the distributive property, the magic sum doubles: 15 × 2 = 30.",
    grid: LO_SHU.map((row) => row.map((v) => v * 2)),
    magicSum: 30,
    operation: "×2 → (2,4,...,18)",
    color: DS.purpleDark,
  },
  {
    label: "Add 5 to Each Cell",
    description:
      "Adding 5 to every number shifts the set to 6–14. Each row gains 15 (three 5s), so magic sum = 15 + 15 = 30.",
    grid: LO_SHU.map((row) => row.map((v) => v + 5)),
    magicSum: 30,
    operation: "+5 → (6–14)",
    color: DS.orangeWarm,
  },
  {
    label: "Add 10 to Each Cell",
    description:
      "Adding 10 shifts the set to 11–19. Each row gains 30 (three 10s), so magic sum = 15 + 30 = 45.",
    grid: LO_SHU.map((row) => row.map((v) => v + 10)),
    magicSum: 45,
    operation: "+10 → (11–19)",
    color: DS.indigo,
  },
];

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "The Lo Shu Magic Square",
    description:
      "This is the Lo Shu Square — the oldest known magic square, from ancient China! It uses numbers 1–9, and every row, column, and diagonal adds to 15. Verify all eight sums yourself!",
    teachingNote:
      "Let the student verify all eight sums: 3 rows + 3 columns + 2 diagonals = 8 sums, all equal to 15.",
    type: "intro",
    mode: "learn",
    data: { transformIndex: 0 },
  },
  {
    id: 2,
    title: "Transformation: Add 1",
    description:
      "What happens if we add 1 to every cell? The numbers become 2–10. Each row had 3 cells, so each row sum increases by 3. New magic sum: 15 + 3 = 18!",
    teachingNote:
      "Emphasize that adding 1 to each of 3 cells in a row adds 3 to the row sum.",
    type: "transformation",
    mode: "learn",
    data: { transformIndex: 1, fromIndex: 0 },
  },
  {
    id: 3,
    title: "Transformation: Double",
    description:
      "Now let's double every number. By the distributive property: 2×(a+b+c) = 2a+2b+2c. So the magic sum doubles: 15 × 2 = 30!",
    teachingNote: "Ask WHY doubling works — it is the distributive property.",
    type: "transformation",
    mode: "learn",
    data: { transformIndex: 2, fromIndex: 0 },
  },
  {
    id: 4,
    title: "Transformation: Add 5",
    description:
      "Can you predict the magic sum before looking? Adding 5 to each cell: each row gains 3×5 = 15. New magic sum: 15 + 15 = 30!",
    teachingNote:
      "Enable prediction! Pattern: adding k increases magic sum by 3k.",
    type: "transformation",
    mode: "learn",
    data: { transformIndex: 3, fromIndex: 0 },
  },
  {
    id: 5,
    title: "Transformation: Add 10",
    description:
      "Last one — predict it! Adding 10: each row gains 3×10 = 30. Magic sum = 15 + 30 = 45. The pattern: new sum = 15 + 3k!",
    teachingNote:
      "Connect to algebra: centre number m determines magic sum as 3m.",
    type: "transformation",
    mode: "learn",
    data: { transformIndex: 4, fromIndex: 0 },
  },
  {
    id: 10,
    title: "Practice: Predict the Sum",
    description:
      "If we add 7 to each cell of the Lo Shu, what will the new magic sum be? Use the formula: new sum = 15 + 3×k.",
    teachingNote: "Answer: 15 + 3×7 = 15 + 21 = 36.",
    type: "practice",
    mode: "practice",
    data: { practiceType: "predict", k: 7, answer: 36 },
  },
  {
    id: 11,
    title: "Practice: Triple the Square",
    description:
      "If we triple every number in the Lo Shu, what is the magic sum? Remember the distributive property!",
    teachingNote: "Answer: 15 × 3 = 45.",
    type: "practice",
    mode: "practice",
    data: { practiceType: "multiply", k: 3, answer: 45 },
  },
  {
    id: 20,
    title: "Explore: The Algebra",
    description:
      "If the centre number is m, every number in the magic square can be expressed in terms of m. The magic sum is always 3m! For 1–9: centre = 5, sum = 3×5 = 15.",
    teachingNote: "The generalised magic square has centre m. Magic sum = 3m.",
    type: "explore",
    mode: "explore",
    data: { showAlgebra: true },
  },
];

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

// ==================== MAIN COMPONENT ====================

const MagicSquareExplorer: React.FC<MagicSquareExplorerProps> = ({
  props = {},
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
      enabledModes:
        props.enabledModes ?? (["learn", "practice", "explore"] as ModeType[]),
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      initialStep: props.initialStep ?? 1,
      filterSteps: props.filterSteps ?? null,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration:
        props.autoPlayDuration ?? props.data?.autoPlayDuration ?? 10000,
      themeColor: props.themeColor ?? DS.indigo,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const additionalProps = props.additionalProps || {};
  const transformations =
    additionalProps.transformations || DEFAULT_TRANSFORMATIONS;

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<number[][]>(
    transformations[0].grid,
  );
  const [prevValues, setPrevValues] = useState<number[][]>(
    transformations[0].grid,
  );
  const [morphProgress, setMorphProgress] = useState(1);
  const [verifiedSums, setVerifiedSums] = useState<Set<string>>(new Set());
  const [showSumAnimation, setShowSumAnimation] = useState<string | null>(null);
  const [magicSumDisplay, setMagicSumDisplay] = useState(
    transformations[0].magicSum,
  );
  const [magicSumPulse, setMagicSumPulse] = useState(false);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceResult, setPracticeResult] = useState<
    "correct" | "wrong" | null
  >(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [buttonStates, setButtonStates] = useState<{
    [key: string]: "idle" | "hover" | "active";
  }>({});

  const morphRef = useRef<number>();
  const autoPlayRef = useRef<NodeJS.Timeout>();

  const filteredSteps = useMemo(() => {
    return availableSteps.filter((step) => step.mode === selectedMode);
  }, [availableSteps, selectedMode]);

  const currentStep = filteredSteps[currentStepIndex] || filteredSteps[0];

  // ─── Inject Keyframes ────────────────────────────────────────────────
  useEffect(() => {
    const keyframes = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

            @keyframes mse_fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes mse_fadeInScale {
                from { opacity: 0; transform: scale(0.88); }
                to { opacity: 1; transform: scale(1); }
            }
            @keyframes mse_popIn {
                0% { transform: scale(0); opacity: 0; }
                60% { transform: scale(1.12); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes mse_pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.06); }
            }
            @keyframes mse_pulseShadow {
                0%, 100% { box-shadow: 0 0 0 0 rgba(255, 114, 18, 0.35); }
                50% { box-shadow: 0 0 0 14px rgba(255, 114, 18, 0); }
            }
            @keyframes mse_bounceIn {
                0% { transform: scale(0); }
                50% { transform: scale(1.15); }
                70% { transform: scale(0.92); }
                100% { transform: scale(1); }
            }
            @keyframes mse_slideInRight {
                from { opacity: 0; transform: translateX(24px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes mse_slideInLeft {
                from { opacity: 0; transform: translateX(-24px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes mse_shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            @keyframes mse_float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
            @keyframes mse_gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes mse_ringPulse {
                0% { transform: scale(0.95); opacity: 1; }
                100% { transform: scale(1.4); opacity: 0; }
            }
            @keyframes mse_checkDraw {
                from { stroke-dashoffset: 24; }
                to { stroke-dashoffset: 0; }
            }
        `;
    const styleSheet = document.createElement("style");
    styleSheet.id = "mse-keyframes";
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    return () => {
      const el = document.getElementById("mse-keyframes");
      if (el) document.head.removeChild(el);
    };
  }, []);

  // ─── Morph Animation ─────────────────────────────────────────────────
  const animateMorph = useCallback(
    (fromGrid: number[][], toGrid: number[][], duration: number = 800) => {
      setPrevValues(fromGrid);
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        setMorphProgress(eased);
        const interpolated = fromGrid.map((row, r) =>
          row.map((val, c) => Math.round(val + (toGrid[r][c] - val) * eased)),
        );
        setAnimatedValues(interpolated);
        if (progress < 1) {
          morphRef.current = requestAnimationFrame(animate);
        } else {
          setAnimatedValues(toGrid);
          setMorphProgress(1);
        }
      };
      if (morphRef.current) cancelAnimationFrame(morphRef.current);
      morphRef.current = requestAnimationFrame(animate);
    },
    [],
  );

  // ─── Step Change ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentStep) return;
    const transformIndex = currentStep.data?.transformIndex;
    if (
      transformIndex !== undefined &&
      transformIndex < transformations.length
    ) {
      const fromIndex =
        currentStep.data?.fromIndex ?? Math.max(0, transformIndex - 1);
      const fromGrid = transformations[fromIndex].grid;
      const toGrid = transformations[transformIndex].grid;
      setVerifiedSums(new Set());
      setPracticeAnswer("");
      setPracticeResult(null);
      if (fromIndex !== transformIndex) {
        animateMorph(fromGrid, toGrid, 1000 / config.animationSpeed);
        setTimeout(() => {
          setMagicSumDisplay(transformations[transformIndex].magicSum);
          setMagicSumPulse(true);
          setTimeout(() => setMagicSumPulse(false), 1200);
        }, 600 / config.animationSpeed);
      } else {
        setAnimatedValues(toGrid);
        setMagicSumDisplay(transformations[transformIndex].magicSum);
      }
    }
  }, [currentStep, transformations, config.animationSpeed, animateMorph]);

  // Report step details
  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: filteredSteps.length,
        isPaused: !isPlaying,
        currentMode: selectedMode,
      });
    }
  }, [
    currentStepIndex,
    filteredSteps.length,
    isPlaying,
    selectedMode,
    setStepDetails,
  ]);

  // Auto-play
  useEffect(() => {
    if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    if (isPlaying && !stopAutoNext && config.autoPlayDuration > 0) {
      autoPlayRef.current = setTimeout(() => {
        if (currentStepIndex < filteredSteps.length - 1) {
          goToStep(currentStepIndex + 1);
        } else {
          setIsPlaying(false);
        }
      }, config.autoPlayDuration);
    }
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [
    isPlaying,
    currentStepIndex,
    filteredSteps.length,
    config.autoPlayDuration,
    stopAutoNext,
  ]);

  // ─── Navigation ──────────────────────────────────────────────────────
  const goToStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= filteredSteps.length || isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex(index);
        setIsTransitioning(false);
      }, 280);
    },
    [filteredSteps.length, isTransitioning],
  );

  // ─── Compute Sums ────────────────────────────────────────────────────
  const computeSums = useCallback((grid: number[][]) => {
    const sums: { [key: string]: number } = {};
    for (let r = 0; r < 3; r++)
      sums[`row-${r}`] = grid[r].reduce((a, b) => a + b, 0);
    for (let c = 0; c < 3; c++)
      sums[`col-${c}`] = grid[0][c] + grid[1][c] + grid[2][c];
    sums["diag-0"] = grid[0][0] + grid[1][1] + grid[2][2];
    sums["diag-1"] = grid[0][2] + grid[1][1] + grid[2][0];
    return sums;
  }, []);

  const currentSums = useMemo(
    () => computeSums(animatedValues),
    [animatedValues, computeSums],
  );

  const handleVerifySum = useCallback((key: string) => {
    setShowSumAnimation(key);
    setTimeout(() => {
      setVerifiedSums((prev) => new Set([...prev, key]));
      setShowSumAnimation(null);
    }, 500);
  }, []);

  const handleCheckPractice = useCallback(() => {
    const answer = parseInt(practiceAnswer);
    if (isNaN(answer)) return;
    setPracticeResult(
      answer === currentStep?.data?.answer ? "correct" : "wrong",
    );
  }, [practiceAnswer, currentStep]);

  const handleModeChange = useCallback(
    (mode: ModeType) => {
      if (mode === selectedMode) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedMode(mode);
        setCurrentStepIndex(0);
        setVerifiedSums(new Set());
        setPracticeAnswer("");
        setPracticeResult(null);
        setIsTransitioning(false);
      }, 280);
    },
    [selectedMode],
  );

  const setBtnState = useCallback(
    (id: string, state: "idle" | "hover" | "active") => {
      setButtonStates((prev) => ({ ...prev, [id]: state }));
    },
    [],
  );

  const currentTransformIndex = currentStep?.data?.transformIndex ?? 0;
  const currentTransform =
    transformations[currentTransformIndex] || transformations[0];

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER HELPERS
  // ═══════════════════════════════════════════════════════════════════════

  // ─── Contained Button (DS) ───────────────────────────────────────────
  const renderContainedBtn = (
    id: string,
    label: string,
    onClick: () => void,
    opts: {
      disabled?: boolean;
      icon?: React.ReactNode;
      highlight?: boolean;
      small?: boolean;
    } = {},
  ) => {
    const { disabled = false, icon, highlight = false, small = false } = opts;
    const st = buttonStates[id] || "idle";
    const bg = disabled
      ? DS.grey300
      : highlight
        ? st === "hover"
          ? DS.orangeHover
          : st === "active"
            ? "#CC5B0E"
            : DS.orange
        : st === "hover"
          ? DS.indigoHover
          : st === "active"
            ? DS.indigoPressed
            : DS.indigo;
    const color = disabled ? DS.grey500 : DS.white;

    return (
      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => !disabled && setBtnState(id, "hover")}
        onMouseLeave={() => setBtnState(id, "idle")}
        onMouseDown={() => !disabled && setBtnState(id, "active")}
        onMouseUp={() => !disabled && setBtnState(id, "hover")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          height: small ? "34px" : "40px",
          padding: small ? "0 16px" : "0 24px",
          borderRadius: "20px",
          border: "none",
          background: bg,
          color,
          fontFamily: FONT,
          fontSize: small ? "13px" : "14px",
          fontWeight: 600,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          transform:
            st === "active"
              ? "scale(0.96)"
              : st === "hover"
                ? "scale(1.03)"
                : "scale(1)",
          opacity: disabled ? 0.6 : 1,
          outline: "none",
          boxShadow:
            st === "hover" && !disabled
              ? "0 4px 14px rgba(74,77,201,0.25)"
              : "none",
        }}
      >
        {icon && icon}
        {label}
      </button>
    );
  };

  // ─── Outlined Button (DS) ────────────────────────────────────────────
  const renderOutlinedBtn = (
    id: string,
    label: string,
    onClick: () => void,
    opts: {
      disabled?: boolean;
      icon?: React.ReactNode;
      active?: boolean;
      small?: boolean;
    } = {},
  ) => {
    const { disabled = false, icon, active = false, small = false } = opts;
    const st = buttonStates[id] || "idle";
    const borderColor = disabled
      ? DS.grey300
      : active
        ? DS.indigo
        : st === "hover"
          ? DS.indigo
          : DS.grey500;
    const bgColor = disabled
      ? DS.white
      : active
        ? DS.indigoAlpha10
        : st === "hover"
          ? DS.indigoAlpha10
          : DS.white;
    const textColor = disabled
      ? DS.grey500
      : active
        ? DS.indigo
        : st === "hover"
          ? DS.indigo
          : DS.grey900;

    return (
      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => !disabled && setBtnState(id, "hover")}
        onMouseLeave={() => setBtnState(id, "idle")}
        onMouseDown={() => !disabled && setBtnState(id, "active")}
        onMouseUp={() => !disabled && setBtnState(id, "hover")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          height: small ? "34px" : "40px",
          padding: small ? "0 14px" : "0 24px",
          borderRadius: "20px",
          border: `1.5px solid ${borderColor}`,
          background: bgColor,
          color: textColor,
          fontFamily: FONT,
          fontSize: small ? "13px" : "14px",
          fontWeight: 600,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          transform: st === "active" ? "scale(0.96)" : "scale(1)",
          opacity: disabled ? 0.5 : 1,
          outline: "none",
        }}
      >
        {icon && icon}
        {label}
      </button>
    );
  };

  // ─── Texted Button (DS) ──────────────────────────────────────────────
  const renderTextedBtn = (
    id: string,
    label: string,
    onClick: () => void,
    opts: { disabled?: boolean; icon?: React.ReactNode; active?: boolean } = {},
  ) => {
    const { disabled = false, icon, active = false } = opts;
    const st = buttonStates[id] || "idle";
    const textColor = disabled
      ? DS.grey500
      : active
        ? DS.indigo
        : st === "hover"
          ? DS.indigo
          : DS.grey900;

    return (
      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => !disabled && setBtnState(id, "hover")}
        onMouseLeave={() => setBtnState(id, "idle")}
        onMouseDown={() => !disabled && setBtnState(id, "active")}
        onMouseUp={() => !disabled && setBtnState(id, "hover")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          height: "40px",
          padding: "0 12px",
          borderRadius: "8px",
          border: "none",
          background:
            st === "hover" && !disabled ? DS.indigoAlpha10 : "transparent",
          color: textColor,
          fontFamily: FONT,
          fontSize: "14px",
          fontWeight: 600,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          textDecoration: active ? "none" : "none",
          borderBottom: active
            ? `2px solid ${DS.indigo}`
            : "2px solid transparent",
          outline: "none",
        }}
      >
        {icon && icon}
        {label}
      </button>
    );
  };

  // ─── Grid ────────────────────────────────────────────────────────────
  const renderGrid = () => {
    const cellSize = Math.min(68, (config.width - 240) / 5);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          animation: "mse_fadeInScale 0.5s ease-out",
        }}
      >
        {/* Magic Sum Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 24px",
            background: `linear-gradient(135deg, ${DS.orangeLight}, ${DS.orangeAlpha20})`,
            borderRadius: "24px",
            border: `2px solid ${DS.orangeWarm}40`,
            animation: magicSumPulse
              ? "mse_pulseShadow 0.5s ease-out 2"
              : "none",
            transition: "all 0.4s ease",
            position: "relative" as const,
          }}
        >
          {magicSumPulse && (
            <div
              style={{
                position: "absolute",
                inset: "-2px",
                borderRadius: "26px",
                border: `2px solid ${DS.orange}`,
                animation: "mse_ringPulse 0.8s ease-out",
                pointerEvents: "none" as const,
              }}
            />
          )}
          <Sparkles size={18} color={DS.orange} />
          <span
            style={{
              fontFamily: FONT,
              fontSize: "14px",
              fontWeight: 600,
              color: DS.grey900,
            }}
          >
            Magic Sum
          </span>
          <span
            style={{
              fontFamily: FONT,
              fontSize: "28px",
              fontWeight: 800,
              color: DS.orange,
              animation: magicSumPulse ? "mse_bounceIn 0.5s ease-out" : "none",
              minWidth: "40px",
              textAlign: "center" as const,
              lineHeight: 1,
            }}
          >
            {magicSumDisplay}
          </span>
        </div>

        {/* Grid Container */}
        <div
          style={{
            position: "relative" as const,
            padding: "16px",
            borderRadius: "20px",
            background: DS.white,
            border: `2.5px solid ${DS.indigo}30`,
            boxShadow: `0 6px 28px ${DS.indigoAlpha10}, 0 1px 4px rgba(0,0,0,0.06)`,
            transition: "all 0.5s ease",
          }}
        >
          {/* Decorative corner dots — rangoli inspired */}
          {[
            { top: -5, left: -5 },
            { top: -5, right: -5 },
            { bottom: -5, left: -5 },
            { bottom: -5, right: -5 },
          ].map((pos, i) => (
            <div
              key={`dot-${i}`}
              style={{
                position: "absolute" as const,
                ...(pos as any),
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: i % 2 === 0 ? DS.indigo : DS.orange,
                transition: "background 0.4s ease",
              }}
            />
          ))}

          <div style={{ display: "flex", gap: "6px" }}>
            {/* 3x3 Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(3, ${cellSize}px)`,
                gridTemplateRows: `repeat(3, ${cellSize}px)`,
                gap: "5px",
              }}
            >
              {animatedValues.map((row, r) =>
                row.map((val, c) => {
                  const cellKey = `${r}-${c}`;
                  const isHovered = hoveredCell === cellKey;
                  const isCenter = r === 1 && c === 1;

                  return (
                    <div
                      key={cellKey}
                      onMouseEnter={() => setHoveredCell(cellKey)}
                      onMouseLeave={() => setHoveredCell(null)}
                      style={{
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "14px",
                        background: isCenter
                          ? `linear-gradient(135deg, ${DS.indigoAlpha10}, ${DS.indigoAlpha20})`
                          : isHovered
                            ? DS.grey100
                            : DS.grey100,
                        border: isCenter
                          ? `2.5px solid ${DS.indigo}`
                          : isHovered
                            ? `2px solid ${DS.indigoLight}`
                            : `1.5px solid ${DS.grey300}`,
                        fontFamily: FONT,
                        fontSize: val > 9 ? "20px" : "24px",
                        fontWeight: 700,
                        color: isCenter ? DS.indigo : DS.black,
                        transition: "all 0.25s ease",
                        transform: isHovered ? "scale(1.07)" : "scale(1)",
                        cursor: "default",
                        boxShadow: isHovered
                          ? `0 4px 12px ${DS.indigoAlpha20}`
                          : "none",
                        animation:
                          morphProgress >= 1
                            ? `mse_popIn 0.35s ease-out ${(r * 3 + c) * 0.05}s both`
                            : "none",
                      }}
                    >
                      {val}
                    </div>
                  );
                }),
              )}
            </div>

            {/* Row sum indicators */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                justifyContent: "center",
              }}
            >
              {[0, 1, 2].map((r) => {
                const key = `row-${r}`;
                const verified = verifiedSums.has(key);
                const animating = showSumAnimation === key;
                return (
                  <div
                    key={key}
                    onClick={() => !verified && handleVerifySum(key)}
                    style={{
                      width: "48px",
                      height: `${cellSize}px`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "12px",
                      background: verified
                        ? DS.successGreenLight
                        : animating
                          ? DS.orangeLight
                          : "transparent",
                      border: verified
                        ? `2px solid ${DS.successGreen}`
                        : `1.5px dashed ${DS.grey500}`,
                      fontFamily: FONT,
                      fontSize: "14px",
                      fontWeight: 700,
                      color: verified ? DS.successGreenDark : DS.grey500,
                      cursor: verified ? "default" : "pointer",
                      transition: "all 0.3s ease",
                      animation: animating
                        ? "mse_pulse 0.3s ease-out 2"
                        : verified
                          ? "mse_popIn 0.35s ease-out"
                          : "none",
                    }}
                  >
                    {verified ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                      >
                        {currentSums[key]}
                        <Check size={13} color={DS.successGreen} />
                      </span>
                    ) : (
                      <span style={{ fontSize: "16px", color: DS.grey500 }}>
                        →
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column sum indicators */}
          <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
            {[0, 1, 2].map((c) => {
              const key = `col-${c}`;
              const verified = verifiedSums.has(key);
              const animating = showSumAnimation === key;
              return (
                <div
                  key={key}
                  onClick={() => !verified && handleVerifySum(key)}
                  style={{
                    width: `${cellSize}px`,
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                    background: verified
                      ? DS.successGreenLight
                      : animating
                        ? DS.orangeLight
                        : "transparent",
                    border: verified
                      ? `2px solid ${DS.successGreen}`
                      : `1.5px dashed ${DS.grey500}`,
                    fontFamily: FONT,
                    fontSize: "14px",
                    fontWeight: 700,
                    color: verified ? DS.successGreenDark : DS.grey500,
                    cursor: verified ? "default" : "pointer",
                    transition: "all 0.3s ease",
                    animation: animating
                      ? "mse_pulse 0.3s ease-out 2"
                      : verified
                        ? "mse_popIn 0.35s ease-out"
                        : "none",
                  }}
                >
                  {verified ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      {currentSums[key]}
                      <Check size={13} color={DS.successGreen} />
                    </span>
                  ) : (
                    <span style={{ fontSize: "16px", color: DS.grey500 }}>
                      ↓
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Diagonal sum indicators */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "6px",
              paddingInline: "2px",
            }}
          >
            {["diag-0", "diag-1"].map((key, i) => {
              const verified = verifiedSums.has(key);
              const animating = showSumAnimation === key;
              return (
                <div
                  key={key}
                  onClick={() => !verified && handleVerifySum(key)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: "10px",
                    background: verified
                      ? DS.successGreenLight
                      : animating
                        ? DS.orangeLight
                        : "transparent",
                    border: verified
                      ? `2px solid ${DS.successGreen}`
                      : `1.5px dashed ${DS.grey500}`,
                    fontFamily: FONT,
                    fontSize: "12px",
                    fontWeight: 600,
                    color: verified ? DS.successGreenDark : DS.grey500,
                    cursor: verified ? "default" : "pointer",
                    transition: "all 0.3s ease",
                    animation: animating
                      ? "mse_pulse 0.3s ease-out 2"
                      : verified
                        ? "mse_popIn 0.35s ease-out"
                        : "none",
                  }}
                >
                  {verified ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      {i === 0 ? "↘" : "↙"} {currentSums[key]}{" "}
                      <Check size={12} color={DS.successGreen} />
                    </span>
                  ) : (
                    <span>{i === 0 ? "↘ Diagonal" : "↙ Diagonal"}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* All verified celebration */}
          {verifiedSums.size === 8 && (
            <div
              style={{
                marginTop: "10px",
                padding: "8px 20px",
                background: `linear-gradient(135deg, ${DS.successGreenLight}, ${DS.successGreen}15)`,
                borderRadius: "14px",
                border: `2px solid ${DS.successGreen}`,
                textAlign: "center" as const,
                fontFamily: FONT,
                fontSize: "13px",
                fontWeight: 700,
                color: DS.successGreenDark,
                animation: "mse_bounceIn 0.5s ease-out",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <Award size={16} />
              All 8 sums verified — It's magic! ✨
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── Transformation Callout Card ─────────────────────────────────────
  const renderTransformationCallout = () => {
    if (!currentTransform) return null;
    return (
      <div
        style={{
          padding: "16px 20px",
          background: DS.white,
          borderRadius: "16px",
          border: `1.5px solid ${DS.grey300}`,
          borderLeft: `4px solid ${DS.indigo}`,
          boxShadow: `0 2px 12px ${DS.indigoAlpha10}`,
          animation: "mse_slideInRight 0.4s ease-out",
          maxWidth: "300px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 12px",
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${DS.purpleDark}, ${DS.orangeWarm})`,
            fontFamily: FONT,
            fontSize: "11px",
            fontWeight: 700,
            color: DS.white,
            letterSpacing: "0.6px",
            textTransform: "uppercase" as const,
            marginBottom: "8px",
          }}
        >
          {currentTransform.operation}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: "13px",
            fontWeight: 500,
            color: DS.grey900,
            lineHeight: 1.6,
          }}
        >
          {currentTransform.description}
        </div>
      </div>
    );
  };

  // ─── Practice Section ────────────────────────────────────────────────
  const renderPractice = () => {
    if (currentStep?.type !== "practice") return null;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          padding: "24px",
          background: DS.white,
          borderRadius: "20px",
          border: `1.5px solid ${DS.grey300}`,
          boxShadow: `0 4px 16px ${DS.indigoAlpha10}`,
          animation: "mse_fadeInUp 0.4s ease-out",
          maxWidth: "380px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "6px 16px",
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${DS.purpleDark}, ${DS.orangeWarm})`,
            fontFamily: FONT,
            fontSize: "14px",
            fontWeight: 700,
            color: DS.white,
          }}
        >
          Predict the Magic Sum!
        </div>
        <p
          style={{
            margin: 0,
            fontFamily: FONT,
            fontSize: "14px",
            fontWeight: 500,
            color: DS.grey900,
            textAlign: "center" as const,
            lineHeight: 1.6,
          }}
        >
          {currentStep.description}
        </p>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="number"
            value={practiceAnswer}
            onChange={(e) => {
              setPracticeAnswer(e.target.value);
              setPracticeResult(null);
            }}
            placeholder="?"
            style={{
              width: "80px",
              height: "44px",
              padding: "0 14px",
              borderRadius: "14px",
              border: `2px solid ${practiceResult === "correct" ? DS.successGreen : practiceResult === "wrong" ? DS.errorRed : DS.indigo}`,
              fontFamily: FONT,
              fontSize: "20px",
              fontWeight: 700,
              textAlign: "center" as const,
              color: DS.black,
              outline: "none",
              transition: "border-color 0.3s ease",
              background: DS.grey100,
            }}
            onKeyDown={(e) => e.key === "Enter" && handleCheckPractice()}
          />
          {renderContainedBtn("check", "Check", handleCheckPractice, {
            highlight: true,
          })}
        </div>
        {practiceResult === "correct" && (
          <div
            style={{
              padding: "10px 20px",
              background: DS.successGreenLight,
              borderRadius: "14px",
              border: `2px solid ${DS.successGreen}`,
              fontFamily: FONT,
              fontSize: "14px",
              fontWeight: 700,
              color: DS.successGreenDark,
              animation: "mse_bounceIn 0.4s ease-out",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Check size={16} /> Correct! The magic sum is{" "}
            {currentStep.data?.answer}!
          </div>
        )}
        {practiceResult === "wrong" && (
          <div
            style={{
              padding: "10px 20px",
              background: DS.errorRedLight,
              borderRadius: "14px",
              border: `2px solid ${DS.errorRed}30`,
              fontFamily: FONT,
              fontSize: "14px",
              fontWeight: 600,
              color: DS.errorRed,
              animation: "mse_fadeInUp 0.3s ease-out",
            }}
          >
            Not quite — try again! Hint: new sum = 15 + 3×k
          </div>
        )}
      </div>
    );
  };

  // ─── Algebra Explore ─────────────────────────────────────────────────
  const renderAlgebraExplore = () => {
    if (currentStep?.type !== "explore") return null;
    const algebraGrid = [
      ["m−3", "m+2", "m+1"],
      ["m+4", "m", "m−4"],
      ["m−1", "m−2", "m+3"],
    ];
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
          animation: "mse_fadeInUp 0.5s ease-out",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "6px 18px",
            borderRadius: "14px",
            background: `linear-gradient(135deg, ${DS.purpleDark}, ${DS.indigo})`,
            fontFamily: FONT,
            fontSize: "15px",
            fontWeight: 700,
            color: DS.white,
          }}
        >
          Generalised Magic Square
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 80px)",
            gridTemplateRows: "repeat(3, 52px)",
            gap: "4px",
            padding: "14px",
            border: `2.5px solid ${DS.indigo}`,
            borderRadius: "18px",
            background: DS.white,
            boxShadow: `0 4px 20px ${DS.indigoAlpha20}`,
          }}
        >
          {algebraGrid.map((row, r) =>
            row.map((expr, c) => (
              <div
                key={`alg-${r}-${c}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                  background:
                    r === 1 && c === 1 ? DS.indigoAlpha20 : DS.grey100,
                  border:
                    r === 1 && c === 1
                      ? `2px solid ${DS.indigo}`
                      : `1px solid ${DS.grey300}`,
                  fontFamily: FONT,
                  fontSize: "13px",
                  fontWeight: 700,
                  color: r === 1 && c === 1 ? DS.indigo : DS.black,
                  animation: `mse_popIn 0.35s ease-out ${(r * 3 + c) * 0.06}s both`,
                }}
              >
                {expr}
              </div>
            )),
          )}
        </div>
        <div
          style={{
            padding: "12px 24px",
            background: DS.orangeLight,
            borderRadius: "16px",
            border: `2px solid ${DS.orangeWarm}30`,
            fontFamily: FONT,
            fontSize: "14px",
            fontWeight: 700,
            color: DS.grey900,
            textAlign: "center" as const,
          }}
        >
          Magic Sum ={" "}
          <span style={{ fontSize: "22px", color: DS.orange, fontWeight: 800 }}>
            3m
          </span>
          <br />
          <span
            style={{ fontSize: "12px", fontWeight: 500, color: DS.grey900 }}
          >
            For 1–9: m = 5, sum = 15 &nbsp;|&nbsp; For 2–10: m = 6, sum = 18
          </span>
        </div>
      </div>
    );
  };

  // ─── Mode Labels ─────────────────────────────────────────────────────
  const modeIcons: { [key in ModeType]: string } = {
    learn: "📖",
    practice: "✏️",
    explore: "🔬",
  };
  const modeLabels: { [key in ModeType]: string } = {
    learn: "Learn",
    practice: "Practice",
    explore: "Explore",
  };

  // ═══════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <div
      style={{
        width: `${config.width}px`,
        maxWidth: "100%",
        minHeight: `${config.height}px`,
        fontFamily: FONT,
        background: DS.grey100,
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 12px 48px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ─── Header with gradient ─────────────────────────────── */}
      <div
        style={{
          padding: "18px 24px 14px",
          background: `linear-gradient(135deg, ${DS.purpleDark} 0%, ${DS.indigo} 40%, ${DS.orangeWarm} 100%)`,
          backgroundSize: "200% 200%",
          animation: "mse_gradientShift 8s ease infinite",
          color: DS.white,
          textAlign: "center" as const,
          position: "relative" as const,
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          style={{
            position: "absolute" as const,
            inset: 0,
            opacity: 0.06,
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                                      radial-gradient(circle at 80% 50%, white 1px, transparent 1px),
                                      radial-gradient(circle at 50% 20%, white 1px, transparent 1px),
                                      radial-gradient(circle at 50% 80%, white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            pointerEvents: "none" as const,
          }}
        />
        <h1
          style={{
            margin: 0,
            fontFamily: FONT,
            fontSize: "20px",
            fontWeight: 800,
            letterSpacing: "0.3px",
            position: "relative" as const,
          }}
        >
          ✦ Magic Square Explorer ✦
        </h1>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "12px",
            fontWeight: 500,
            opacity: 0.85,
            position: "relative" as const,
          }}
        >
          Discover how transformations change the magic sum
        </p>
      </div>

      {/* ─── Mode Selector (Outlined button style) ────────────── */}
      {config.showModeSelector && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 16px",
            background: DS.white,
            borderBottom: `1px solid ${DS.grey300}`,
          }}
        >
          {config.enabledModes.map((mode) => (
            <React.Fragment key={mode}>
              {renderOutlinedBtn(
                `mode-${mode}`,
                `${modeIcons[mode]} ${modeLabels[mode]}`,
                () => handleModeChange(mode),
                { active: selectedMode === mode, small: true },
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* ─── Main Content Area ────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          padding: "18px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "translateY(10px)" : "translateY(0)",
          transition: "opacity 0.28s ease, transform 0.28s ease",
          overflowY: "auto",
          background: DS.grey100,
        }}
      >
        {/* Step Title & Description */}
        {currentStep && (
          <div
            style={{
              textAlign: "center" as const,
              maxWidth: "520px",
              animation: "mse_fadeInUp 0.35s ease-out",
            }}
          >
            <h2
              style={{
                margin: "0 0 6px",
                fontFamily: FONT,
                fontSize: "17px",
                fontWeight: 700,
                color: DS.indigo,
              }}
            >
              {currentStep.title}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                fontWeight: 500,
                color: DS.grey900,
                lineHeight: 1.6,
              }}
            >
              {currentStep.description}
            </p>
          </div>
        )}

        {/* Grid + Callout */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "18px",
            width: "100%",
          }}
        >
          {(currentStep?.type === "intro" ||
            currentStep?.type === "transformation") &&
            renderGrid()}
          {currentStep?.type === "transformation" &&
            renderTransformationCallout()}
        </div>

        {/* Intro hint */}
        {currentStep?.type === "intro" && (
          <div
            style={{
              padding: "10px 18px",
              background: DS.orangeLight,
              borderRadius: "14px",
              border: `1.5px solid ${DS.orangeWarm}25`,
              fontFamily: FONT,
              fontSize: "12px",
              fontWeight: 600,
              color: DS.grey900,
              textAlign: "center" as const,
              animation: "mse_fadeInUp 0.4s ease-out 0.3s both",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "16px" }}>💡</span>
            Click the arrows (→ ↓) and diagonal labels to verify each sum!
          </div>
        )}

        {/* Practice & Explore */}
        {currentStep?.type === "practice" && renderPractice()}
        {currentStep?.type === "explore" && renderAlgebraExplore()}

        {/* Step dots */}
        {config.showStepIndicator && filteredSteps.length > 1 && (
          <div
            style={{
              display: "flex",
              gap: "6px",
              justifyContent: "center",
              marginTop: "4px",
            }}
          >
            {filteredSteps.map((_, i) => (
              <div
                key={i}
                onClick={() => goToStep(i)}
                style={{
                  width: i === currentStepIndex ? "22px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background:
                    i === currentStepIndex
                      ? `linear-gradient(135deg, ${DS.indigo}, ${DS.orangeWarm})`
                      : DS.grey300,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── Navigation Bar ───────────────────────────────────── */}
      {config.showNavigation && filteredSteps.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            padding: "14px 24px 18px",
            background: DS.white,
            borderTop: `1px solid ${DS.grey300}`,
          }}
        >
          {renderOutlinedBtn(
            "prev",
            "Prev",
            () => goToStep(currentStepIndex - 1),
            {
              disabled: currentStepIndex === 0,
              icon: <ChevronLeft size={16} />,
              small: true,
            },
          )}

          {config.showPlayPause && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              onMouseEnter={() => setBtnState("play", "hover")}
              onMouseLeave={() => setBtnState("play", "idle")}
              onMouseDown={() => setBtnState("play", "active")}
              onMouseUp={() => setBtnState("play", "hover")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "none",
                background: `linear-gradient(135deg, ${DS.indigo}, ${DS.purpleDark})`,
                color: DS.white,
                cursor: "pointer",
                transition: "all 0.2s ease",
                transform:
                  buttonStates["play"] === "active"
                    ? "scale(0.92)"
                    : buttonStates["play"] === "hover"
                      ? "scale(1.08)"
                      : "scale(1)",
                boxShadow:
                  buttonStates["play"] === "hover"
                    ? `0 4px 16px ${DS.indigoAlpha30}`
                    : "none",
                outline: "none",
              }}
            >
              {isPlaying ? (
                <Pause size={16} />
              ) : (
                <Play size={16} style={{ marginLeft: "2px" }} />
              )}
            </button>
          )}

          <span
            style={{
              fontFamily: FONT,
              fontSize: "12px",
              fontWeight: 700,
              color: DS.grey500,
              minWidth: "40px",
              textAlign: "center" as const,
            }}
          >
            {currentStepIndex + 1}/{filteredSteps.length}
          </span>

          {renderContainedBtn(
            "next",
            "Next",
            () => goToStep(currentStepIndex + 1),
            {
              disabled: currentStepIndex === filteredSteps.length - 1,
              icon: <ChevronRight size={16} />,
              small: true,
            },
          )}
        </div>
      )}
    </div>
  );
};

export default MagicSquareExplorer;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
