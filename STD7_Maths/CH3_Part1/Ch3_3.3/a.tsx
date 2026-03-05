// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: hundredths_decimal_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

// @ts-ignore - modules resolved at build
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  // @ts-ignore - module resolved at build
} from "react";
// @ts-ignore - module resolved at build
import katex from "katex";

// ==================== SINGULARITY DESIGN TOKENS ====================

const S = {
  // Primary palette
  purple: "#4A4DC9",
  orange: "#FF7212",
  deepPurple: "#533086",
  softOrange: "#FC9145",
  // Tints
  purpleTint: "#C1C1EA",
  orangeTint: "#FFF3E4",
  // Grays
  gray900: "#4E4E4E",
  gray400: "#CACACA",
  gray200: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",
  // Semantic
  success: "#2ECC71",
  successBg: "#E8F8F0",
  error: "#E74C3C",
  errorBg: "#FDECEB",
  // Typography
  font: "'Poppins', sans-serif",
  // Button specs (from PDF: 40px height, 24px horizontal padding, rounded-full)
  btnHeight: 40,
  btnPadH: 24,
  btnRadius: 100, // fully rounded
  btnIconGap: 4,
};

// ==================== INLINE SVG ICONS ====================

const I = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const PlayIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...I} width={size} height={size}>
    <polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none" />
  </svg>
);
const PauseIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...I} width={size} height={size}>
    <rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none" />
    <rect
      x="14"
      y="4"
      width="4"
      height="16"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);
const ChevronLeftIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...I} width={size} height={size}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRightIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...I} width={size} height={size}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const CheckIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...I} width={size} height={size}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...I} width={size} height={size}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const BookIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...I} width={size} height={size}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
const TargetIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...I} width={size} height={size}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const GlobeIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...I} width={size} height={size}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const TrophyIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...I} width={size} height={size}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);
const StarIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...I} width={size} height={size}>
    <polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

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

interface HundredthsAdditionalProps {
  wholeUnits?: number;
  tenths?: number;
  hundredths?: number;
  showGrid?: boolean;
  gridRows?: number;
  gridCols?: number;
  highlightCount?: number;
  zoomLevel?: "unit" | "tenth" | "hundredth";
  showNumberLine?: boolean;
  numberLineMin?: number;
  numberLineMax?: number;
  numberLineHighlight?: number;
  showConversion?: boolean;
  conversionValue?: string;
  conversionTarget?: "tenths" | "hundredths" | "decimal";
}

interface HundredthsDecimalToolProps {
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
    additionalProps?: HundredthsAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DEFAULT STEPS (answer field on ALL practice) ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  // ── LEARN ──
  {
    id: 1,
    title: "Why Do We Need Hundredths?",
    description:
      "Sometimes tenths aren't precise enough! When we fold a paper measuring 8 9/10 units in half, the result falls between two tenth marks. We need even smaller parts — hundredths!",
    type: "intro",
    mode: "learn",
    data: { visual: "intro_fold" },
  },
  {
    id: 2,
    title: "Splitting a Tenth into 10 Parts",
    description:
      "Each one-tenth can be split into 10 equal parts. Since there are 10 tenths in a unit, that's 10 × 10 = 100 smaller parts in one unit. Each tiny part is one-hundredth (1/100).",
    type: "explanation",
    mode: "learn",
    data: { visual: "split_tenth" },
  },
  {
    id: 3,
    title: "Reading Hundredths",
    description:
      "A length of 4 units, 4 tenths, and 5 hundredths is written as 4 4/10 5/100. We read it as 'four units and four-tenths and five-hundredths'. It can also be written as 4 and 45 hundredths.",
    type: "explanation",
    mode: "learn",
    data: { visual: "read_hundredths" },
  },
  {
    id: 4,
    title: "The 10-100 Connection",
    description:
      "10 hundredths = 1 tenth, and 100 hundredths = 1 unit. This is the foundation of the decimal system — each place value is 10 times the one to its right!",
    type: "explanation",
    mode: "learn",
    data: { visual: "connection" },
  },
  {
    id: 5,
    title: "Adding with Hundredths",
    description:
      "To add numbers with hundredths, add units, tenths, and hundredths separately. If hundredths exceed 10, carry over to tenths. If tenths exceed 10, carry over to units!",
    type: "explanation",
    mode: "learn",
    data: { visual: "addition" },
  },

  // ── PRACTICE (all have answer field) ──
  {
    id: 10,
    title: "Identify the Hundredths",
    description: "How many hundredths are shaded in the grid?",
    type: "practice",
    mode: "practice",
    data: {
      questionType: "count_hundredths",
      shaded: 45,
      answer: 45,
      options: [35, 45, 54, 55],
    },
  },
  {
    id: 11,
    title: "Convert to Hundredths",
    description: "How many hundredths are in 3 tenths?",
    type: "practice",
    mode: "practice",
    data: {
      questionType: "convert",
      question: "3 tenths = ? hundredths",
      answer: 30,
      options: [3, 13, 30, 300],
    },
  },
  {
    id: 12,
    title: "Add with Hundredths",
    description: "Find the sum: 15 3/10 4/100 + 2 6/10 8/100",
    type: "practice",
    mode: "practice",
    data: {
      questionType: "addition",
      answer: "18 2/100",
      options: ["17 9/10 12/100", "18 2/100", "17 12/100", "18 12/100"],
    },
  },
  {
    id: 13,
    title: "Compare Hundredths",
    description: "Which is larger: 3 6/10 or 3 6/100?",
    type: "practice",
    mode: "practice",
    data: {
      questionType: "compare",
      answer: "3 6/10",
      options: ["3 6/10", "3 6/100", "They are equal"],
    },
  },
  {
    id: 14,
    title: "Subtract with Hundredths",
    description: "Find the difference: 25 9/10 − 6 4/10 7/100",
    type: "practice",
    mode: "practice",
    data: {
      questionType: "subtraction",
      answer: "19 4/10 3/100",
      options: [
        "19 4/10 3/100",
        "19 5/10 3/100",
        "18 4/10 3/100",
        "19 3/10 4/100",
      ],
    },
  },

  // ── REAL WORLD ──
  {
    id: 20,
    title: "Money: Rupees and Paise",
    description:
      "100 paise = 1 rupee, so 1 paisa = 1/100 rupee = 0.01 rupee. When you see ₹4.75, it means 4 rupees and 75 hundredths of a rupee, i.e., 75 paise!",
    type: "real_world",
    mode: "real_world",
    data: { context: "money" },
  },
  {
    id: 21,
    title: "Length: cm and m",
    description:
      "1 meter = 100 cm, so 1 cm = 1/100 m = 0.01 m. A pencil 15 cm long is 0.15 m. The hundredths place tells us the centimeters!",
    type: "real_world",
    mode: "real_world",
    data: { context: "length" },
  },
  {
    id: 22,
    title: "Weight: Grams and Kilograms",
    description:
      "1 kg = 1000 g, and 10 g = 1/100 kg = 0.01 kg. So 254 g = 0.254 kg. The hundredths digit tells us tens of grams!",
    type: "real_world",
    mode: "real_world",
    data: { context: "weight" },
  },
  {
    id: 23,
    title: "Decimal Disasters!",
    description:
      "In 2013, Amsterdam City Council mistakenly paid €188 million instead of €1.8 million — a decimal error! Precision with hundredths matters in real life.",
    type: "real_world",
    mode: "real_world",
    data: { context: "disaster" },
  },
];

// ==================== KATEX RENDERER ====================

const KaTeX: React.FC<{ math: string; display?: boolean }> = ({
  math,
  display = false,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(math, ref.current, {
          displayMode: display,
          throwOnError: false,
        });
      } catch (e) {
        if (ref.current) ref.current.textContent = math;
      }
    }
  }, [math, display]);
  return <span ref={ref} />;
};

// ==================== MAIN COMPONENT ====================

type PropsConfig = NonNullable<HundredthsDecimalToolProps["props"]>;

const HundredthsDecimalTool: React.FC<HundredthsDecimalToolProps> = ({
  props = {} as PropsConfig,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  // ── CONFIG ──
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 620,
      initialMode: props.initialMode ?? ("learn" as ModeType),
      showModeSelector: props.showModeSelector ?? true,
      enabledModes:
        props.enabledModes ??
        (["learn", "practice", "real_world"] as ModeType[]),
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      filterSteps: props.filterSteps ?? null,
      autoPlayDuration:
        props.autoPlayDuration ?? props.data?.autoPlayDuration ?? 10000,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const additionalProps = props.additionalProps || {};
  const gridConfig = useMemo(
    () => ({
      highlightCount: additionalProps.highlightCount ?? 45,
    }),
    [additionalProps],
  );

  // ── STATE ──
  const allSteps = props.steps || DEFAULT_STEPS;
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
  const [animKey, setAnimKey] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [animatedCells, setAnimatedCells] = useState(0);

  const modeSteps = useMemo(
    () => availableSteps.filter((s) => s.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const currentStep = modeSteps[currentStepIndex] || modeSteps[0];

  // ── INJECT KEYFRAMES + POPPINS ──
  useEffect(() => {
    const id = "singularity-hdt-styles";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
      @keyframes s-fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      @keyframes s-fadeLeft { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
      @keyframes s-fadeRight { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
      @keyframes s-pop { 0% { transform:scale(0); opacity:0; } 60% { transform:scale(1.08); } 100% { transform:scale(1); opacity:1; } }
      @keyframes s-pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
      @keyframes s-shake { 0%,100% { transform:translateX(0); } 20% { transform:translateX(-5px); } 40% { transform:translateX(5px); } 60% { transform:translateX(-3px); } 80% { transform:translateX(3px); } }
      @keyframes s-zoom { from { transform:scale(0.4); opacity:0; } to { transform:scale(1); opacity:1; } }
      @keyframes s-bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
      @keyframes s-glow { 0%,100% { box-shadow:0 0 0 0 rgba(74,77,201,0); } 50% { box-shadow:0 0 0 8px rgba(74,77,201,0.15); } }
    `;
    document.head.appendChild(el);
    return () => {
      const x = document.getElementById(id);
      if (x) document.head.removeChild(x);
    };
  }, []);

  // ── CELL ANIMATION ──
  useEffect(() => {
    setAnimatedCells(0);
    const target = currentStep?.data?.shaded || gridConfig.highlightCount;
    let count = 0;
    const iv = setInterval(() => {
      count++;
      setAnimatedCells(count);
      if (count >= target) clearInterval(iv);
    }, 14);
    return () => clearInterval(iv);
  }, [currentStepIndex, selectedMode, animKey]);

  useEffect(() => {
    setCurrentStepIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnimKey((k) => k + 1);
  }, [selectedMode]);
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setAnimKey((k) => k + 1);
  }, [currentStepIndex]);

  // Auto-play
  useEffect(() => {
    if (
      !isPlaying ||
      config.autoPlayDuration <= 0 ||
      selectedMode === "practice"
    )
      return;
    const t = setTimeout(() => {
      if (currentStepIndex < modeSteps.length - 1)
        setCurrentStepIndex((i) => i + 1);
      else setIsPlaying(false);
    }, config.autoPlayDuration);
    return () => clearTimeout(t);
  }, [
    isPlaying,
    currentStepIndex,
    config.autoPlayDuration,
    modeSteps.length,
    selectedMode,
  ]);

  useEffect(() => {
    if (setStepDetails && currentStep)
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: modeSteps.length,
        isPaused: !isPlaying,
        currentMode: selectedMode,
      });
  }, [currentStepIndex, isPlaying, selectedMode, modeSteps.length]);

  // ── HANDLERS ──
  const goNext = useCallback(() => {
    if (currentStepIndex < modeSteps.length - 1)
      setCurrentStepIndex((i) => i + 1);
  }, [currentStepIndex, modeSteps.length]);
  const goPrev = useCallback(() => {
    if (currentStepIndex > 0) setCurrentStepIndex((i) => i - 1);
  }, [currentStepIndex]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (showResult) return;
      setSelectedAnswer(answer);
      setShowResult(true);
      setTotalAttempted((t) => t + 1);
      const correctAnswer = currentStep?.data?.answer;
      if (answer === String(correctAnswer)) setScore((s) => s + 1);
    },
    [showResult, currentStep],
  );

  // ── MODE META ──
  const modeMeta: Record<
    ModeType,
    { icon: React.ReactNode; label: string; color: string; tint: string }
  > = {
    learn: {
      icon: <BookIcon size={15} />,
      label: "Learn",
      color: S.purple,
      tint: S.purpleTint,
    },
    practice: {
      icon: <TargetIcon size={15} />,
      label: "Practice",
      color: S.orange,
      tint: S.orangeTint,
    },
    real_world: {
      icon: <GlobeIcon size={15} />,
      label: "Real World",
      color: S.deepPurple,
      tint: S.purpleTint,
    },
  };

  // ══════════════════════════════════════════════════════
  // SINGULARITY BUTTON COMPONENTS
  // ══════════════════════════════════════════════════════

  const ContainedBtn: React.FC<{
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    color?: string;
    textColor?: string;
    icon?: React.ReactNode;
    highlight?: boolean;
  }> = ({
    children,
    onClick,
    disabled,
    color = S.purple,
    textColor = S.white,
    icon,
    highlight,
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: icon ? S.btnIconGap : 0,
        height: S.btnHeight,
        padding: `0 ${S.btnPadH}px`,
        borderRadius: S.btnRadius,
        border: "none",
        background: disabled ? S.gray200 : highlight ? S.orange : color,
        color: disabled ? S.gray400 : textColor,
        fontFamily: S.font,
        fontSize: 13,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        outline: "none",
        opacity: disabled ? 0.6 : 1,
        boxShadow: disabled ? "none" : "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {icon}
      {children}
    </button>
  );

  const OutlinedBtn: React.FC<{
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    color?: string;
    icon?: React.ReactNode;
  }> = ({ children, onClick, disabled, color = S.purple, icon }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: icon ? S.btnIconGap : 0,
        height: S.btnHeight,
        padding: `0 ${S.btnPadH}px`,
        borderRadius: S.btnRadius,
        border: `2px solid ${disabled ? S.gray200 : color}`,
        background: "transparent",
        color: disabled ? S.gray400 : color,
        fontFamily: S.font,
        fontSize: 13,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        outline: "none",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon}
      {children}
    </button>
  );

  // ══════════════════════════════════════════════════════
  // 10×10 GRID
  // ══════════════════════════════════════════════════════

  const renderGrid = useCallback(
    (
      highlightCount: number,
      size: number = 200,
      label?: string,
      animate: boolean = true,
    ) => {
      const cs = size / 10;
      const cells: React.ReactElement[] = [];
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          const idx = r * 10 + c;
          const lit = idx < highlightCount;
          const anim = animate ? idx < animatedCells : lit;
          const fullTenths = idx < Math.floor(highlightCount / 10) * 10;
          cells.push(
            <div
              key={idx}
              onMouseEnter={() => setHoveredCell(idx)}
              onMouseLeave={() => setHoveredCell(null)}
              style={{
                width: cs - 2,
                height: cs - 2,
                margin: 1,
                borderRadius: 3,
                background:
                  anim && lit
                    ? fullTenths
                      ? `linear-gradient(135deg, ${S.purple}, ${S.deepPurple})`
                      : `linear-gradient(135deg, ${S.softOrange}, ${S.orange})`
                    : S.gray100,
                opacity: anim && lit ? 1 : 0.3,
                transition: `all 0.15s ease ${idx * 0.006}s`,
                transform: hoveredCell === idx ? "scale(1.35)" : "scale(1)",
              }}
            />,
          );
        }
      }
      return (
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(10, ${cs}px)`,
              border: `2px solid ${S.purpleTint}`,
              borderRadius: 12,
              padding: 4,
              background: S.white,
              boxShadow: "0 4px 20px rgba(74,77,201,0.06)",
            }}
          >
            {cells}
          </div>
          {label && (
            <div
              style={{
                marginTop: 8,
                fontSize: 11,
                fontWeight: 600,
                color: S.gray900,
                fontFamily: S.font,
              }}
            >
              {label}
            </div>
          )}
        </div>
      );
    },
    [animatedCells, hoveredCell],
  );

  // ══════════════════════════════════════════════════════
  // PLACE VALUE TABLE
  // ══════════════════════════════════════════════════════

  const renderPlaceValue = useCallback((u: number, t: number, h: number) => {
    const cols = [
      { lbl: "Units", val: u, color: S.deepPurple },
      { lbl: "•", val: ".", color: S.gray400 },
      { lbl: "Tenths", val: t, color: S.purple },
      { lbl: "Hundredths", val: h, color: S.orange },
    ];
    return (
      <div
        style={{
          display: "flex",
          gap: 3,
          justifyContent: "center",
          animation: "s-fadeUp 0.5s ease-out both",
        }}
      >
        {cols.map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: c.lbl === "•" ? "10px 8px" : "10px 20px",
              background: c.lbl === "•" ? "transparent" : `${c.color}0C`,
              borderRadius: 14,
              border: c.lbl === "•" ? "none" : `2px solid ${c.color}25`,
              animation: `s-pop 0.4s ease-out ${i * 0.08}s both`,
              fontFamily: S.font,
            }}
          >
            {c.lbl !== "•" && (
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: c.color,
                  textTransform: "uppercase" as const,
                  letterSpacing: 1,
                }}
              >
                {c.lbl}
              </div>
            )}
            <div
              style={{
                fontSize: c.lbl === "•" ? 34 : 32,
                fontWeight: 800,
                color: c.color,
                lineHeight: 1.1,
              }}
            >
              {c.val}
            </div>
          </div>
        ))}
      </div>
    );
  }, []);

  // ══════════════════════════════════════════════════════
  // LEARN CONTENT
  // ══════════════════════════════════════════════════════

  const renderLearn = useCallback(() => {
    if (!currentStep) return null;
    const v = currentStep.data?.visual;

    if (v === "intro_fold")
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 28,
              alignItems: "center",
              flexWrap: "wrap" as const,
              justifyContent: "center",
            }}
          >
            <div style={{ animation: "s-fadeLeft 0.5s ease-out both" }}>
              {renderGrid(89, 150, "Paper: 8 9/10 units")}
            </div>
            <div
              style={{
                fontSize: 30,
                color: S.orange,
                animation: "s-pulse 1.5s infinite",
              }}
            >
              →
            </div>
            <div style={{ animation: "s-fadeRight 0.6s ease-out 0.2s both" }}>
              {renderGrid(45, 150, "Folded: between 4 4/10 and 4 5/10")}
            </div>
          </div>
          <div
            style={{
              padding: "14px 22px",
              background: S.orangeTint,
              borderRadius: 14,
              borderLeft: `4px solid ${S.orange}`,
              fontSize: 13,
              color: S.gray900,
              maxWidth: 440,
              animation: "s-fadeUp 0.5s ease-out 0.4s both",
              fontFamily: S.font,
              lineHeight: 1.6,
            }}
          >
            We can't measure exactly with only tenths! We need{" "}
            <strong style={{ color: S.orange }}>hundredths</strong> — splitting
            each tenth into 10 more parts.
          </div>
        </div>
      );

    if (v === "split_tenth")
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            fontFamily: S.font,
          }}
        >
          <div style={{ animation: "s-fadeUp 0.5s ease-out both" }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: S.deepPurple,
                textTransform: "uppercase" as const,
                letterSpacing: 1.2,
                marginBottom: 6,
              }}
            >
              1 Unit = 10 Tenths
            </div>
            <div
              style={{
                display: "flex",
                width: 320,
                height: 30,
                border: `2px solid ${S.deepPurple}`,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: i === 0 ? S.purpleTint : "transparent",
                    borderRight: i < 9 ? `1px solid ${S.purpleTint}` : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 8,
                    color: S.gray400,
                    fontWeight: 600,
                  }}
                >
                  <KaTeX math={`\\frac{${i + 1}}{10}`} />
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              color: S.purple,
              fontSize: 22,
              animation: "s-fadeUp 0.4s ease-out 0.25s both",
            }}
          >
            ⤵ zoom into 1 tenth
          </div>
          <div style={{ animation: "s-zoom 0.6s ease-out 0.4s both" }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: S.orange,
                textTransform: "uppercase" as const,
                letterSpacing: 1.2,
                marginBottom: 6,
              }}
            >
              1 Tenth = 10 Hundredths
            </div>
            <div
              style={{
                display: "flex",
                width: 320,
                height: 30,
                border: `2px solid ${S.orange}`,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: i < 5 ? S.orangeTint : "transparent",
                    borderRight: i < 9 ? `1px solid ${S.softOrange}40` : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 7,
                    color: S.gray400,
                    fontWeight: 600,
                  }}
                >
                  <KaTeX math={`\\frac{${i + 1}}{100}`} />
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              padding: "12px 22px",
              background: `linear-gradient(135deg, ${S.purpleTint}50, ${S.orangeTint})`,
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              color: S.deepPurple,
              animation: "s-fadeUp 0.5s ease-out 0.7s both",
            }}
          >
            10 hundredths = 1 tenth &nbsp;•&nbsp; 100 hundredths = 1 unit
          </div>
        </div>
      );

    if (v === "read_hundredths")
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            fontFamily: S.font,
          }}
        >
          {renderPlaceValue(4, 4, 5)}
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              flexWrap: "wrap" as const,
              justifyContent: "center",
              animation: "s-fadeUp 0.5s ease-out 0.3s both",
            }}
          >
            {renderGrid(45, 140, "45 hundredths shaded")}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { text: "4 tenths = 40 hundredths", color: S.purple },
                { text: "+ 5 hundredths", color: S.orange },
                { text: "= 45 hundredths = 0.45", color: S.deepPurple },
              ].map((r, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 16px",
                    background: `${r.color}0C`,
                    borderRadius: 10,
                    borderLeft: `3px solid ${r.color}`,
                    fontSize: 12,
                    fontWeight: i === 2 ? 700 : 500,
                    color: r.color,
                    animation: `s-fadeLeft 0.4s ease-out ${0.5 + i * 0.1}s both`,
                  }}
                >
                  {r.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    if (v === "connection") {
      const chain = [
        {
          lbl: "1 Unit",
          eq: "= 10 tenths = 100 hundredths",
          color: S.deepPurple,
          n: "1",
          tint: S.purpleTint,
        },
        {
          lbl: "1 Tenth",
          eq: "= 10 hundredths = 1/10 unit",
          color: S.purple,
          n: "¹⁄₁₀",
          tint: S.purpleTint,
        },
        {
          lbl: "1 Hundredth",
          eq: "= 1/10 tenth = 1/100 unit",
          color: S.orange,
          n: "¹⁄₁₀₀",
          tint: S.orangeTint,
        },
      ];
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            alignItems: "center",
            fontFamily: S.font,
          }}
        >
          {chain.map((b, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 24px",
                background: `${b.tint}40`,
                border: `2px solid ${b.color}20`,
                borderRadius: 16,
                minWidth: 360,
                animation: `s-fadeUp 0.5s ease-out ${i * 0.12}s both`,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${b.color}, ${b.color}cc)`,
                  color: S.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 12,
                  flexShrink: 0,
                  animation: `s-pop 0.5s ease-out ${i * 0.12 + 0.1}s both`,
                }}
              >
                {b.n}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: b.color, fontSize: 15 }}>
                  {b.lbl}
                </div>
                <div style={{ fontSize: 12, color: S.gray900 }}>{b.eq}</div>
              </div>
              {i < 2 && (
                <div
                  style={{
                    marginLeft: "auto",
                    padding: "5px 14px",
                    background: `${b.color}12`,
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    color: b.color,
                  }}
                >
                  ÷10 ↓
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (v === "addition") {
      const steps = [
        { s: "Hundredths: 4 + 8 = 12", c: S.orange, d: 0.2 },
        {
          s: "→ 12 hundredths = 1 tenth + 2 hundredths",
          c: S.softOrange,
          d: 0.4,
        },
        { s: "Tenths: 3 + 6 + 1(carry) = 10", c: S.purple, d: 0.6 },
        { s: "→ 10 tenths = 1 unit + 0 tenths", c: S.purpleTint, d: 0.8 },
        { s: "Units: 15 + 2 + 1(carry) = 18", c: S.deepPurple, d: 1.0 },
        { s: "Result: 18  2/100 = 18.02", c: S.deepPurple, d: 1.2 },
      ];
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            fontFamily: S.font,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: S.gray900,
              animation: "s-fadeUp 0.4s ease-out both",
            }}
          >
            <KaTeX math="15\\tfrac{3}{10}\\tfrac{4}{100} + 2\\tfrac{6}{10}\\tfrac{8}{100}" />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              padding: 18,
              background: S.white,
              borderRadius: 16,
              border: `1px solid ${S.gray200}`,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              animation: "s-fadeUp 0.5s ease-out 0.1s both",
            }}
          >
            {steps.map((it, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 16px",
                  background: `${it.c}10`,
                  borderLeft: `3px solid ${it.c}`,
                  borderRadius: "0 10px 10px 0",
                  fontSize: 12,
                  fontWeight: i === 5 ? 700 : 500,
                  color: it.c,
                  animation: `s-fadeLeft 0.4s ease-out ${it.d}s both`,
                }}
              >
                {it.s}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  }, [currentStep, animatedCells, renderGrid, renderPlaceValue]);

  // ══════════════════════════════════════════════════════
  // PRACTICE CONTENT
  // ══════════════════════════════════════════════════════

  const renderPractice = useCallback(() => {
    if (!currentStep?.data) return null;
    const d = currentStep.data;
    const opts: string[] = (d.options || []).map(String);
    const correctStr = String(d.answer);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          fontFamily: S.font,
        }}
      >
        {/* Visual for grid questions */}
        {d.questionType === "count_hundredths" && (
          <div style={{ animation: "s-pop 0.5s ease-out" }}>
            {renderGrid(d.shaded, 180)}
          </div>
        )}
        {d.questionType === "compare" && (
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "center",
              animation: "s-fadeUp 0.5s ease-out",
            }}
          >
            {renderGrid(60, 110, "3  6/10 = 60 hundredths")}
            <div
              style={{
                fontSize: 22,
                color: S.orange,
                fontWeight: 800,
                animation: "s-pulse 1.5s infinite",
              }}
            >
              VS
            </div>
            {renderGrid(6, 110, "3  6/100 = 6 hundredths")}
          </div>
        )}

        {/* Options — Singularity button style */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap" as const,
            gap: 10,
            justifyContent: "center",
            animation: "s-fadeUp 0.4s ease-out 0.2s both",
          }}
        >
          {opts.map((opt, i) => {
            const isSel = selectedAnswer === opt;
            const isCorr = opt === correctStr;
            const rev = showResult;

            let bg = S.white;
            let brd = S.gray200;
            let col = S.gray900;

            if (rev) {
              if (isCorr) {
                bg = S.successBg;
                brd = S.success;
                col = "#166534";
              } else if (isSel) {
                bg = S.errorBg;
                brd = S.error;
                col = "#991B1B";
              } else {
                bg = S.gray100;
                brd = S.gray200;
                col = S.gray400;
              }
            } else if (isSel) {
              bg = `${S.purple}0C`;
              brd = S.purple;
              col = S.purple;
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                disabled={showResult}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  height: S.btnHeight + 4,
                  padding: `0 ${S.btnPadH + 4}px`,
                  background: bg,
                  border: `2px solid ${brd}`,
                  borderRadius: S.btnRadius,
                  fontSize: 14,
                  fontWeight: 600,
                  color: col,
                  fontFamily: S.font,
                  cursor: showResult ? "default" : "pointer",
                  transition: "all 0.25s ease",
                  outline: "none",
                  animation:
                    rev && isCorr
                      ? "s-pulse 0.5s ease-out"
                      : rev && isSel && !isCorr
                        ? "s-shake 0.4s ease-out"
                        : "none",
                  boxShadow:
                    rev && isCorr
                      ? `0 0 0 4px ${S.success}25`
                      : rev && isSel && !isCorr
                        ? `0 0 0 4px ${S.error}25`
                        : "none",
                  minWidth: 110,
                }}
              >
                {rev && isCorr && <CheckIcon size={16} />}
                {rev && isSel && !isCorr && <XIcon size={16} />}
                {opt}
              </button>
            );
          })}
        </div>

        {/* Result feedback */}
        {showResult && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 24px",
              borderRadius: S.btnRadius,
              background:
                selectedAnswer === correctStr
                  ? `linear-gradient(135deg, ${S.successBg}, #D1FAE5)`
                  : `linear-gradient(135deg, ${S.errorBg}, #FEE2E2)`,
              color: selectedAnswer === correctStr ? "#166534" : "#991B1B",
              fontWeight: 600,
              fontSize: 14,
              fontFamily: S.font,
              animation: "s-pop 0.4s ease-out",
            }}
          >
            {selectedAnswer === correctStr ? (
              <>
                <StarIcon size={18} /> Correct! Well done!
              </>
            ) : (
              <>
                <XIcon size={16} /> The answer is: <strong>{correctStr}</strong>
              </>
            )}
          </div>
        )}
      </div>
    );
  }, [
    currentStep,
    selectedAnswer,
    showResult,
    handleAnswer,
    renderGrid,
    animatedCells,
  ]);

  // ══════════════════════════════════════════════════════
  // REAL WORLD CONTENT
  // ══════════════════════════════════════════════════════

  const renderRealWorld = useCallback(() => {
    if (!currentStep?.data) return null;
    const ctx = currentStep.data.context;

    const Card = ({
      icon,
      title,
      rows,
    }: {
      icon: string;
      title: string;
      rows: { l: string; r: string; c: string }[];
    }) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          fontFamily: S.font,
        }}
      >
        <div style={{ fontSize: 52, animation: "s-bounce 2s infinite" }}>
          {icon}
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 17,
            color: S.deepPurple,
            animation: "s-fadeUp 0.4s ease-out 0.1s both",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
            maxWidth: 400,
          }}
        >
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 18px",
                background: `${row.c}0A`,
                borderRadius: 14,
                borderLeft: `4px solid ${row.c}`,
                animation: `s-fadeLeft 0.4s ease-out ${0.2 + i * 0.08}s both`,
              }}
            >
              <span style={{ fontSize: 13, color: S.gray900, fontWeight: 500 }}>
                {row.l}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: row.c,
                  fontFamily: "monospace",
                }}
              >
                {row.r}
              </span>
            </div>
          ))}
        </div>
      </div>
    );

    if (ctx === "money")
      return (
        <Card
          icon="💰"
          title="Rupees & Paise — Hundredths in Action"
          rows={[
            { l: "1 rupee", r: "= 100 paise", c: S.deepPurple },
            { l: "1 paisa", r: "= ₹0.01 (1 hundredth)", c: S.orange },
            { l: "75 paise", r: "= ₹0.75", c: S.purple },
            { l: "₹2.45", r: "= 2 rupees 45 paise", c: S.deepPurple },
          ]}
        />
      );

    if (ctx === "length")
      return (
        <Card
          icon="📏"
          title="Centimeters & Meters"
          rows={[
            { l: "1 meter", r: "= 100 cm", c: S.deepPurple },
            { l: "1 cm", r: "= 0.01 m (1 hundredth)", c: S.orange },
            { l: "15 cm", r: "= 0.15 m", c: S.purple },
            { l: "1.25 m", r: "= 125 cm", c: S.deepPurple },
          ]}
        />
      );

    if (ctx === "weight")
      return (
        <Card
          icon="⚖️"
          title="Grams & Kilograms"
          rows={[
            { l: "1 kg", r: "= 1000 g", c: S.deepPurple },
            { l: "10 g", r: "= 0.01 kg (1 hundredth)", c: S.orange },
            { l: "254 g", r: "= 0.254 kg", c: S.purple },
            { l: "1.5 kg", r: "= 1500 g", c: S.deepPurple },
          ]}
        />
      );

    if (ctx === "disaster")
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            fontFamily: S.font,
          }}
        >
          <div style={{ fontSize: 52, animation: "s-shake 0.6s ease-out" }}>
            ⚠️
          </div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: S.error,
              animation: "s-fadeUp 0.4s ease-out",
            }}
          >
            Decimal Disasters!
          </div>
          <div
            style={{
              maxWidth: 420,
              background: S.white,
              borderRadius: 16,
              border: `1px solid ${S.error}20`,
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
              animation: "s-fadeUp 0.5s ease-out 0.2s both",
            }}
          >
            {[
              {
                yr: "2013",
                desc: "Amsterdam paid €188M instead of €1.8M — a cent-to-euro error!",
                tag: "€186M loss",
              },
              {
                yr: "1983",
                desc: "Air Canada loaded fuel in pounds not kg — plane ran out mid-air!",
                tag: "Emergency",
              },
              {
                yr: "Medical",
                desc: "Reading 0.05 mg as 0.5 mg = 10× overdose!",
                tag: "Life risk",
              },
            ].map((it, i) => (
              <div
                key={i}
                style={{
                  padding: "14px 18px",
                  borderBottom: i < 2 ? `1px solid ${S.gray200}` : "none",
                  animation: `s-fadeLeft 0.4s ease-out ${0.3 + i * 0.1}s both`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      color: S.softOrange,
                      fontSize: 12,
                    }}
                  >
                    {it.yr}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      padding: "3px 12px",
                      background: `${S.error}10`,
                      color: S.error,
                      borderRadius: S.btnRadius,
                      fontWeight: 600,
                    }}
                  >
                    {it.tag}
                  </span>
                </div>
                <div
                  style={{ fontSize: 12, color: S.gray900, lineHeight: 1.6 }}
                >
                  {it.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    return null;
  }, [currentStep]);

  // ══════════════════════════════════════════════════════
  // MAIN LAYOUT
  // ══════════════════════════════════════════════════════

  const atEnd = currentStepIndex >= modeSteps.length - 1;
  const atStart = currentStepIndex === 0;

  return (
    <div
      style={{
        width: config.width,
        maxWidth: "100%",
        minHeight: config.height,
        fontFamily: S.font,
        background: S.gray100,
        borderRadius: 24,
        overflow: "hidden",
        boxShadow:
          "0 20px 60px rgba(74,77,201,0.08), 0 4px 24px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ═══ HEADER ═══ */}
      <div
        style={{
          background: `linear-gradient(135deg, ${S.purple} 0%, ${S.deepPurple} 55%, ${S.softOrange} 100%)`,
          padding: "20px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Title row */}
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
                fontSize: 20,
                fontWeight: 800,
                color: S.white,
                letterSpacing: -0.3,
              }}
            >
              A Peek Beyond the Point
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#ffffffaa",
                fontWeight: 500,
                marginTop: 3,
              }}
            >
              Hundredths &amp; Decimal System • Ganita Prakash Grade 7
            </div>
          </div>
          {selectedMode === "practice" && totalAttempted > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 18px",
                background: "rgba(255,255,255,0.18)",
                borderRadius: S.btnRadius,
                color: S.white,
                fontSize: 13,
                fontWeight: 700,
                animation: "s-pop 0.3s ease-out",
                backdropFilter: "blur(4px)",
              }}
            >
              <TrophyIcon size={16} /> {score}/{totalAttempted}
            </div>
          )}
        </div>

        {/* ═══ MODE TABS — Singularity Contained / active vs ghost ═══ */}
        {config.showModeSelector && (
          <div style={{ display: "flex", gap: 8 }}>
            {config.enabledModes.map((mode) => {
              const active = selectedMode === mode;
              const meta = modeMeta[mode];
              return (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    height: S.btnHeight,
                    padding: `0 ${S.btnPadH}px`,
                    borderRadius: S.btnRadius,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: S.font,
                    background: active ? S.white : "rgba(255,255,255,0.14)",
                    color: active ? meta.color : "#ffffffcc",
                    transition: "all 0.3s ease",
                    outline: "none",
                    boxShadow: active ? "0 4px 16px rgba(0,0,0,0.10)" : "none",
                  }}
                >
                  {meta.icon} {meta.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══ STEP TITLE ═══ */}
      {currentStep && (
        <div
          key={`t-${currentStepIndex}-${selectedMode}`}
          style={{
            padding: "20px 28px 10px",
            animation: "s-fadeUp 0.4s ease-out",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: S.gray900,
              fontFamily: S.font,
            }}
          >
            {currentStep.title}
          </div>
          <div
            style={{
              fontSize: 13,
              color: S.gray400,
              lineHeight: 1.65,
              fontFamily: S.font,
              marginTop: 5,
            }}
          >
            {currentStep.description}
          </div>
        </div>
      )}

      {/* ═══ CONTENT ═══ */}
      <div
        key={`c-${currentStepIndex}-${selectedMode}-${animKey}`}
        style={{
          flex: 1,
          padding: "10px 28px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
          animation: "s-fadeUp 0.5s ease-out",
        }}
      >
        {selectedMode === "learn" && renderLearn()}
        {selectedMode === "practice" && renderPractice()}
        {selectedMode === "real_world" && renderRealWorld()}
      </div>

      {/* ═══ NAVIGATION BAR — Singularity Buttons ═══ */}
      {config.showNavigation && (
        <div
          style={{
            padding: "16px 28px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${S.gray200}`,
            background: S.white,
          }}
        >
          {/* Previous — Outlined Button */}
          <OutlinedBtn
            onClick={goPrev}
            disabled={atStart}
            color={S.purple}
            icon={<ChevronLeftIcon size={16} />}
          >
            Previous
          </OutlinedBtn>

          {/* Step Indicator Dots */}
          {config.showStepIndicator && (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {modeSteps.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentStepIndex(i)}
                  style={{
                    width: i === currentStepIndex ? 28 : 8,
                    height: 8,
                    borderRadius: 4,
                    background:
                      i === currentStepIndex
                        ? `linear-gradient(90deg, ${S.purple}, ${S.orange})`
                        : S.gray200,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          )}

          {/* Play/Pause — Contained Circle */}
          {config.showPlayPause && selectedMode !== "practice" && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "none",
                background: `linear-gradient(135deg, ${S.purple}, ${S.deepPurple})`,
                color: S.white,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
                transition: "all 0.25s ease",
                boxShadow: "0 3px 12px rgba(74,77,201,0.22)",
              }}
            >
              {isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
            </button>
          )}

          {/* Next — Contained Button */}
          <ContainedBtn
            onClick={goNext}
            disabled={atEnd}
            color={S.purple}
            icon={<ChevronRightIcon size={16} />}
          >
            Next
          </ContainedBtn>
        </div>
      )}
    </div>
  );
};

export default HundredthsDecimalTool;

