import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  CSSProperties,
} from "react";

// ═══════════════════════════════════════════════════════════════════════════
// SINGULARITY DESIGN SYSTEM TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const DS = {
  colors: {
    primary: "#4A4DC9",
    primaryDark: "#533086",
    secondary: "#FF7212",
    secondaryDark: "#FC9145",
    primaryLight: "#C1C1EA",
    secondaryLight: "#FFF3E4",
    text: "#4E4E4E",
    textLight: "#7A7A7A",
    gray: "#CACACA",
    grayLight: "#EBEBEB",
    surface: "#F5F5F5",
    white: "#FFFFFF",
    success: "#34C759",
    error: "#FF3B30",
    warning: "#FFCC00",
    gradientPrimary: "linear-gradient(135deg, #533086 0%, #FC9145 100%)",
    gradientPrimaryHover: "linear-gradient(135deg, #4A2878 0%, #E8823D 100%)",
    gradientSubtle: "linear-gradient(135deg, #C1C1EA 0%, #FFF3E4 100%)",
    gradientSky:
      "linear-gradient(180deg, #C1C1EA 0%, #FFF3E4 60%, #FFFFFF 100%)",
  },
  font: "'Poppins', sans-serif",
  radius: {
    sm: "8px",
    md: "12px",
    lg: "20px",
    pill: "999px",
    circle: "50%",
  },
  shadow: {
    sm: "0 2px 8px rgba(74, 77, 201, 0.08)",
    md: "0 4px 16px rgba(74, 77, 201, 0.12)",
    lg: "0 8px 32px rgba(74, 77, 201, 0.16)",
    glow: "0 0 20px rgba(74, 77, 201, 0.25)",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  button: {
    height: "40px",
    paddingX: "24px",
    iconGap: "4px",
    fontSize: "14px",
    fontWeight: "600" as const,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

type ModeType = "learn" | "practice" | "realWorld";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription: string;
}

interface PhaseInfo {
  title: string;
  simple: string[];
  example: string[];
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface RealWorldExample {
  id: number;
  title: string;
  location: string;
  description: string;
  category: string;
  impact: string;
  keyFeatures: string[];
  connection: string;
}

interface StepData {
  id: string;
  phase: string;
  name: string;
  icon: string;
}

interface WaterCycleAdditionalProps {
  customPhases?: { [key: string]: PhaseInfo };
  customQuestions?: Question[];
  customExamples?: RealWorldExample[];
  animationDuration?: number;
  waveSpeed?: number;
  rainSpeed?: number;
  skyColor?: string;
  oceanColor?: string;
  cloudColor?: string;
  sunColor?: string;
}

interface WaterCycleToolProps {
  props?: {
    width?: number;
    height?: number;
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
    additionalProps?: WaterCycleAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSIVE HOOK
// ═══════════════════════════════════════════════════════════════════════════

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
};

const useResponsive = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");
  return { isMobile, isTablet, isDesktop, isSmallScreen: isMobile || isTablet };
};

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_PHASES: { [key: string]: PhaseInfo } = {
  evaporation: {
    title: "Evaporation & Transpiration",
    simple: [
      "The Sun heats up water in oceans, rivers, and lakes.",
      "It turns into invisible water vapor (like steam) that rises into the air.",
      "Plants also release water vapor through tiny holes in their leaves called stomata.",
    ],
    example: [
      "Think about a puddle after it rains.",
      "On a sunny day, the puddle gets smaller until it disappears.",
      "The water turned into vapor and went up into the sky!",
      'Trees also "breathe out" water vapor through their leaves.',
    ],
  },
  condensation: {
    title: "Condensation",
    simple: [
      "Water vapor rises high into the sky where it's very cold.",
      "It cools down and turns back into tiny water droplets.",
      "These millions of tiny droplets cluster together to form clouds.",
    ],
    example: [
      "Breathe on a cold window.",
      "You see water droplets form on the glass.",
      "That's condensation!",
      "Your warm breath (water vapor) hits the cold surface and turns back into liquid water.",
    ],
  },
  precipitation: {
    title: "Precipitation",
    simple: [
      "Clouds get too heavy with water droplets.",
      "Gravity pulls the water back down to Earth.",
      "It falls as rain, snow, sleet, or hail depending on temperature.",
    ],
    example: [
      "Clouds are like giant sponges floating in the sky.",
      "When the sponge gets too full, the water falls down.",
      "Warm weather = rain. Cold weather = snow!",
    ],
  },
  collection: {
    title: "Collection & Infiltration",
    simple: [
      "Rainwater flows downhill into rivers, streams, lakes, and oceans.",
      "Some water soaks into the ground through soil and rocks.",
      "This is called infiltration.",
    ],
    example: [
      "After rain, water flows down streets into drains.",
      "It travels to rivers, then lakes or ocean.",
      "Some rainwater soaks into soil where plants drink it.",
    ],
  },
};

const DEFAULT_STEPS: StepData[] = [
  {
    id: "evaporation",
    phase: "EVAPORATION",
    name: "Evaporation & Transpiration",
    icon: "🌊",
  },
  {
    id: "condensation",
    phase: "CONDENSATION",
    name: "Condensation",
    icon: "☁️",
  },
  {
    id: "precipitation",
    phase: "PRECIPITATION",
    name: "Precipitation",
    icon: "💧",
  },
  {
    id: "collection",
    phase: "COLLECTION",
    name: "Collection & Infiltration",
    icon: "🏞️",
  },
];

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "In which three states does water exist in nature?",
    options: [
      "Liquid, Solid, Plasma",
      "Liquid, Solid, Gas",
      "Solid, Gas, Plasma",
      "Liquid, Gas, Plasma",
    ],
    correctAnswer: 1,
    explanation:
      "Water exists as liquid (oceans, rivers, lakes), solid (snow, ice, glaciers), and gas (water vapour in the atmosphere).",
  },
  {
    id: 2,
    question:
      "What is the process called when water vapour rises up, cools down and forms clouds?",
    options: ["Evaporation", "Precipitation", "Condensation", "Transpiration"],
    correctAnswer: 2,
    explanation:
      "Condensation is the process where water vapour cools down and changes back into liquid water, forming clouds.",
  },
  {
    id: 3,
    question: "Through which material does water seep the fastest?",
    options: ["Clay", "Sand", "Gravel", "Rock"],
    correctAnswer: 2,
    explanation:
      "Water seeps fastest through gravel because the spaces between gravel particles are wider compared to sand and clay.",
  },
  {
    id: 4,
    question:
      "What are the underground layers of sediments and rocks that store water called?",
    options: ["Reservoirs", "Aquifers", "Water tables", "Underground lakes"],
    correctAnswer: 1,
    explanation:
      "Aquifers are underground layers of sediments and rocks that store water in their pore spaces, which we access through wells.",
  },
  {
    id: 5,
    question:
      "What is the process of surface water seeping through soil and rocks called?",
    options: ["Percolation", "Evaporation", "Infiltration", "Precipitation"],
    correctAnswer: 2,
    explanation:
      "Infiltration is the process where surface water seeps through soil and rocks beneath Earth's surface to form groundwater.",
  },
];

const DEFAULT_EXAMPLES: RealWorldExample[] = [
  {
    id: 1,
    title: "Ice Stupa - Ladakh",
    location: "Ladakh, India",
    description:
      "An innovative water conservation technique where mountain stream water is channeled through underground pipes and sprayed into cold air during winters. The water freezes layer by layer, creating tall cone-shaped ice structures that melt slowly in spring, providing water for farming throughout summer.",
    category: "Water Conservation",
    impact:
      "Provides water supply during water-scarce spring season when snow hasn't melted enough",
    keyFeatures: [
      "Built during extreme winters",
      "Uses natural freezing temperatures",
      "Melts slowly to provide sustained water supply",
      "Supports agriculture in arid regions",
    ],
    connection:
      "Ice Stupa utilizes the water cycle by storing water in solid form (ice) during winter, which then melts and evaporates, completing the cycle while providing agricultural water.",
  },
  {
    id: 2,
    title: "Rainwater Harvesting Systems",
    location: "Urban Areas, India",
    description:
      "Systems that collect and store rainwater from rooftops and other surfaces. The collected water is filtered and directed into underground storage tanks or used to recharge groundwater through recharge pits, helping replenish depleting aquifers.",
    category: "Groundwater Recharge",
    impact:
      "Reduces dependency on municipal water supply and recharges groundwater levels",
    keyFeatures: [
      "Collects rainwater from rooftops",
      "Filters and stores water",
      "Recharges underground aquifers",
      "Reduces urban flooding",
    ],
    connection:
      "Rainwater harvesting captures precipitation from the water cycle and uses infiltration to recharge aquifers, directly participating in the groundwater formation process.",
  },
  {
    id: 3,
    title: "Traditional Houses - Uttarakhand Himalayas",
    location: "Mori Block, Uttarkashi, Uttarakhand",
    description:
      "Houses built with walls made of two wooden layers filled with cow dung and mud between them. This design utilizes the poor heat conductivity of wood and mud to prevent heat loss, keeping homes warm during harsh winters with heavy snowfall.",
    category: "Heat Transfer Application",
    impact:
      "Maintains warmth without external heating, saving energy in extreme cold climates",
    keyFeatures: [
      "Double wooden layer walls",
      "Natural insulation with mud and cow dung",
      "Poor conductors prevent heat loss",
      "Sustainable and eco-friendly",
    ],
    connection:
      "Traditional houses use poor heat conductors to minimize conduction, preventing heat loss and maintaining comfortable indoor temperatures in extreme climates.",
  },
  {
    id: 4,
    title: "Hollow Brick Construction",
    location: "Hot and Cold Climate Regions",
    description:
      "Buildings constructed using hollow bricks that trap air in their cavities. Since air is a poor conductor of heat, these buildings stay warm in winters and cool in summers by preventing heat transfer between inside and outside environments.",
    category: "Thermal Insulation",
    impact:
      "Reduces energy consumption for heating and cooling, making buildings more sustainable",
    keyFeatures: [
      "Air trapped in hollow spaces",
      "Acts as natural insulator",
      "Reduces energy bills",
      "Effective in extreme climates",
    ],
    connection:
      "Hollow bricks trap air (a poor conductor) to prevent heat transfer through conduction, demonstrating practical application of thermal insulation principles.",
  },
  {
    id: 5,
    title: "Traditional Bukhari Heater",
    location: "Upper Himalayan Regions",
    description:
      "A traditional room heater consisting of an iron stove burning wood or charcoal, with a chimney pipe for smoke venting. It demonstrates all three heat transfer processes: conduction (from flame to stove), convection (heating air and water), and radiation (warmth felt around it). The flat top can be used for cooking.",
    category: "Heat Transfer",
    impact:
      "Provides heating and cooking solution in areas with limited modern infrastructure",
    keyFeatures: [
      "Demonstrates conduction, convection, and radiation",
      "Multi-purpose: heating and cooking",
      "Uses locally available fuel",
      "Effective chimney system",
    ],
    connection:
      "Bukhari demonstrates all three heat transfer methods: conduction (metal heating), convection (air circulation), and radiation (warmth felt nearby).",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// SVG ICON COMPONENTS (Singularity geometric style)
// ═══════════════════════════════════════════════════════════════════════════

const DropletIcon = ({
  size = 24,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

const PlayIcon = ({
  size = 24,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = ({
  size = 24,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
);

const ChevronLeftIcon = ({
  size = 24,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = ({
  size = 24,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const RotateCcwIcon = ({
  size = 24,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <path d="M1 4v6h6M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

const BookOpenIcon = ({
  size = 24,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const ClipboardCheckIcon = ({
  size = 24,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" />
  </svg>
);

const GlobeIcon = ({
  size = 24,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION KEYFRAMES — Singularity palette-aware
// ═══════════════════════════════════════════════════════════════════════════

const KEYFRAMES_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

@keyframes sunPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.92; } }
@keyframes rayPulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
@keyframes waveMotion { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
@keyframes riverFlow { to { stroke-dashoffset: -20; } }
@keyframes vaporRise {
  0% { opacity: 0; transform: translateY(0); }
  20% { opacity: 1; }
  80% { opacity: 1; transform: translateY(-90px); }
  100% { opacity: 0; transform: translateY(-100px); }
}
@keyframes transpirationRise {
  0% { opacity: 0; transform: translateY(0); }
  20% { opacity: 0.8; }
  80% { opacity: 0.8; transform: translateY(-40px); }
  100% { opacity: 0; transform: translateY(-50px); }
}
@keyframes rainDropFall {
  0% { transform: translateY(0); opacity: 0; }
  5% { opacity: 0.9; }
  95% { transform: translateY(130px); opacity: 0.9; }
  100% { transform: translateY(135px); opacity: 0; }
}
@keyframes splashEffect {
  0%, 90% { opacity: 0; transform: scale(0.5); }
  94% { opacity: 1; transform: scale(1.4); }
  100% { opacity: 0; transform: scale(2); }
}
@keyframes infiltrationDrop {
  0% { opacity: 0; transform: translateY(0); }
  20% { opacity: 1; }
  80% { opacity: 1; transform: translateY(30px); }
  100% { opacity: 0; transform: translateY(30px); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes dotBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
@keyframes progressGlow {
  0%, 100% { box-shadow: 0 0 8px rgba(74, 77, 201, 0.3); }
  50% { box-shadow: 0 0 16px rgba(74, 77, 201, 0.6); }
}
`;

// ═══════════════════════════════════════════════════════════════════════════
// SHARED BUTTON COMPONENT — matches Singularity design spec
// ═══════════════════════════════════════════════════════════════════════════

const DSButton: React.FC<{
  variant?: "contained" | "outlined" | "text" | "highlight";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: CSSProperties;
}> = ({
  variant = "contained",
  onClick,
  disabled = false,
  children,
  style,
}) => {
  const [hovered, setHovered] = useState(false);

  const base: CSSProperties = {
    fontFamily: DS.font,
    fontSize: DS.button.fontSize,
    fontWeight: DS.button.fontWeight,
    height: DS.button.height,
    padding: `0 ${DS.button.paddingX}`,
    borderRadius: DS.radius.pill,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
    border: "none",
    outline: "none",
    whiteSpace: "nowrap" as const,
    opacity: disabled ? 0.45 : 1,
  };

  const variants: { [key: string]: CSSProperties } = {
    contained: {
      background:
        hovered && !disabled ? DS.colors.primaryDark : DS.colors.primary,
      color: DS.colors.white,
      boxShadow: hovered && !disabled ? DS.shadow.glow : DS.shadow.sm,
    },
    outlined: {
      background:
        hovered && !disabled ? `${DS.colors.primary}0D` : "transparent",
      color: DS.colors.primary,
      border: `2px solid ${disabled ? DS.colors.gray : DS.colors.primary}`,
    },
    text: {
      background:
        hovered && !disabled ? `${DS.colors.primary}0D` : "transparent",
      color: disabled ? DS.colors.gray : DS.colors.primary,
    },
    highlight: {
      background:
        hovered && !disabled ? DS.colors.secondaryDark : DS.colors.secondary,
      color: DS.colors.white,
      boxShadow:
        hovered && !disabled ? "0 0 20px rgba(255,114,18,0.35)" : DS.shadow.sm,
    },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// LEARN MODE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const LearnMode: React.FC<{
  steps: StepData[];
  phases: { [key: string]: PhaseInfo };
  autoPlayDuration: number;
  animationSpeed: number;
  showNavigation: boolean;
  showPlayPause: boolean;
  showStepIndicator: boolean;
  setStepDetails?: (details: StepDetails) => void;
}> = ({
  steps,
  phases,
  autoPlayDuration,
  animationSpeed,
  showNavigation,
  showPlayPause,
  showStepIndicator,
  setStepDetails,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const { isMobile, isTablet, isSmallScreen } = useResponsive();

  const currentPhase = steps[currentStep].phase;
  const currentInfo = phases[steps[currentStep].id];

  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: currentStep + 1,
        totalSteps: steps.length,
        stepTitle: currentInfo.title,
        stepDescription: currentInfo.simple[0],
      });
    }
  }, [currentStep, steps, currentInfo, setStepDetails]);

  useEffect(() => {
    if (isAutoPlaying && autoPlayDuration > 0) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, autoPlayDuration / animationSpeed);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, autoPlayDuration, animationSpeed, steps.length]);

  const getCloudStyles = (cloudNum: number) => {
    const positions: { [key: string]: string } = {
      EVAPORATION:
        cloudNum === 1 ? "translate(200px, 110px)" : "translate(340px, 115px)",
      CONDENSATION:
        cloudNum === 1 ? "translate(530px, 110px)" : "translate(670px, 115px)",
      PRECIPITATION:
        cloudNum === 1 ? "translate(530px, 110px)" : "translate(670px, 115px)",
      COLLECTION:
        cloudNum === 1 ? "translate(530px, 110px)" : "translate(670px, 115px)",
    };
    const opacity = currentPhase === "COLLECTION" ? 0 : 1;
    const transition =
      currentPhase === "CONDENSATION"
        ? "transform 5s ease, opacity 1s ease"
        : currentPhase === "COLLECTION"
          ? "opacity 1.5s ease"
          : "transform 1s ease, opacity 1s ease";
    return { transform: positions[currentPhase], opacity, transition };
  };

  const getCloudFill = () =>
    currentPhase === "CONDENSATION" || currentPhase === "PRECIPITATION"
      ? "#8A8ABA"
      : "#ffffff";
  const getCloudStroke = () =>
    currentPhase === "CONDENSATION" || currentPhase === "PRECIPITATION"
      ? "#6A6AA0"
      : "#E0E0E0";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: DS.colors.white,
        display: "flex",
        flexDirection: "column",
        fontFamily: DS.font,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: DS.colors.gradientPrimary,
          color: DS.colors.white,
          padding: isMobile ? "10px 16px" : "14px 24px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: isMobile ? "18px" : isTablet ? "22px" : "26px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          🌊 The Water Cycle
        </h1>
        <p
          style={{
            margin: "4px 0 0 0",
            fontSize: isMobile ? "11px" : "13px",
            opacity: 0.9,
            fontWeight: 400,
          }}
        >
          Learn how water moves around our planet in a continuous cycle!
        </p>
      </div>

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          flex: 1,
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {/* SVG Panel */}
        <div
          style={{
            width: isSmallScreen ? "100%" : "62%",
            padding: isMobile ? "8px" : "14px",
            display: "flex",
            flexDirection: "column",
            minHeight: isSmallScreen ? "300px" : "auto",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: DS.colors.surface,
              borderRadius: DS.radius.lg,
              padding: isMobile ? "8px" : "14px",
              boxShadow: DS.shadow.md,
              border: `1px solid ${DS.colors.grayLight}`,
              overflow: "hidden",
            }}
          >
            <svg
              style={{
                width: "100%",
                height: "auto",
                maxHeight: isSmallScreen ? "350px" : "100%",
                display: "block",
              }}
              viewBox="0 0 800 460"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#C1C1EA" />
                  <stop offset="100%" stopColor="#FFF3E4" />
                </linearGradient>
                <radialGradient id="sunGrad">
                  <stop offset="0%" stopColor="#FFF3E4" />
                  <stop offset="100%" stopColor="#FC9145" />
                </radialGradient>
                <linearGradient
                  id="waterGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#4A4DC9" />
                  <stop offset="100%" stopColor="#6A6DFF" />
                </linearGradient>
                <filter
                  id="cloudShadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                  <feOffset dx="0" dy="3" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.2" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Sky */}
              <rect x="0" y="0" width="800" height="280" fill="url(#skyGrad)" />

              {/* Sun */}
              <g style={{ animation: "sunPulse 4s ease-in-out infinite" }}>
                <circle
                  cx="90"
                  cy="60"
                  r="38"
                  fill="url(#sunGrad)"
                  stroke="#FC9145"
                  strokeWidth="2.5"
                />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  return (
                    <line
                      key={i}
                      x1={90 + Math.cos(rad) * 46}
                      y1={60 + Math.sin(rad) * 46}
                      x2={90 + Math.cos(rad) * 56}
                      y2={60 + Math.sin(rad) * 56}
                      stroke="#FC9145"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.7"
                      style={{
                        animation: "rayPulse 2.5s ease-in-out infinite",
                      }}
                    />
                  );
                })}
                <text
                  x="90"
                  y="65"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#533086"
                  fontWeight="700"
                  fontFamily={DS.font}
                >
                  Sun
                </text>
              </g>

              {/* Mountains */}
              <g>
                <path
                  d="M 600 280 L 680 200 L 750 260 L 800 240 L 800 280 Z"
                  fill="#C1C1EA"
                  opacity="0.5"
                />
                <path
                  d="M 500 280 L 600 180 L 700 260 L 750 220 L 800 260 L 800 280 Z"
                  fill="#9A9AD0"
                  opacity="0.5"
                />
              </g>

              {/* Ocean */}
              <rect
                x="0"
                y="280"
                width="450"
                height="85"
                fill="url(#waterGrad)"
              />
              <path
                d="M 0 285 Q 50 280, 100 285 T 200 285 T 300 285 T 450 285"
                fill="none"
                stroke="#7A7DFF"
                strokeWidth="2.5"
                opacity="0.6"
                style={{ animation: "waveMotion 3s ease-in-out infinite" }}
              />
              <text
                x="225"
                y="325"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="13"
                fontWeight="700"
                fontFamily={DS.font}
              >
                Ocean / Lake
              </text>

              {/* Land */}
              <rect
                x="450"
                y="280"
                width="350"
                height="85"
                fill="#C1C1EA"
                opacity="0.4"
              />
              <rect
                x="450"
                y="280"
                width="350"
                height="85"
                fill="#8BC34A"
                opacity="0.35"
              />
              <text
                x="625"
                y="325"
                textAnchor="middle"
                fill="#533086"
                fontSize="13"
                fontWeight="700"
                fontFamily={DS.font}
              >
                Land
              </text>

              {/* River */}
              <path
                d="M 550 280 C 570 310, 510 340, 470 360 C 410 385, 350 360, 290 360"
                fill="none"
                stroke="#4A4DC9"
                strokeWidth="5"
                strokeDasharray={currentPhase === "COLLECTION" ? "12 8" : "0"}
                style={
                  currentPhase === "COLLECTION"
                    ? { animation: "riverFlow 1.5s linear infinite" }
                    : {}
                }
              />

              {/* Trees */}
              <g>
                <rect
                  x="520"
                  y="255"
                  width="10"
                  height="30"
                  fill="#795548"
                  rx="2"
                />
                <circle cx="525" cy="248" r="15" fill="#4CAF50" />
                <rect
                  x="560"
                  y="255"
                  width="10"
                  height="30"
                  fill="#795548"
                  rx="2"
                />
                <circle cx="565" cy="248" r="15" fill="#4CAF50" />
              </g>

              {/* Soil */}
              <rect x="0" y="365" width="800" height="40" fill="#A1887F" />
              <text
                x="400"
                y="389"
                textAnchor="middle"
                fill="#3E2723"
                fontSize="12"
                fontWeight="600"
                fontFamily={DS.font}
              >
                Soil
              </text>

              {/* Aquifer */}
              <rect x="0" y="405" width="800" height="55" fill="#795548" />
              <rect
                x="230"
                y="412"
                width="260"
                height="32"
                fill="#4A4DC9"
                opacity="0.45"
                rx="6"
              />
              <text
                x="360"
                y="433"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="600"
                fontFamily={DS.font}
              >
                Aquifer (Groundwater)
              </text>

              {/* Evaporation arrows */}
              <g
                style={{
                  opacity: currentPhase === "EVAPORATION" ? 1 : 0,
                  transition: "opacity 0.8s",
                }}
              >
                {currentPhase === "EVAPORATION" && (
                  <text
                    x="225"
                    y="250"
                    textAnchor="middle"
                    fill="#533086"
                    fontSize="13"
                    fontWeight="800"
                    fontFamily={DS.font}
                  >
                    Evaporation
                  </text>
                )}
                {[80, 140, 200, 260, 320, 380].map((x, i) => (
                  <g
                    key={i}
                    style={{
                      animation:
                        currentPhase === "EVAPORATION"
                          ? "vaporRise 3s ease-out infinite"
                          : "none",
                      animationDelay: `${i * 0.3}s`,
                      opacity: 0,
                    }}
                  >
                    <path
                      d={`M ${x} 275 Q ${x - 5} 260, ${x} 245 T ${x} 215 T ${x} 185`}
                      stroke="#7A7DFF"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="3 3"
                    />
                    <path
                      d={`M ${x + 8} 275 Q ${x + 3} 260, ${x + 8} 245 T ${x + 8} 215 T ${x + 8} 185`}
                      stroke="#7A7DFF"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="3 3"
                    />
                  </g>
                ))}
              </g>

              {/* Transpiration */}
              <g
                style={{
                  opacity: currentPhase === "EVAPORATION" ? 1 : 0,
                  transition: "opacity 0.8s",
                }}
              >
                {currentPhase === "EVAPORATION" && (
                  <text
                    x="540"
                    y="220"
                    textAnchor="middle"
                    fill="#2E7D32"
                    fontSize="13"
                    fontWeight="800"
                    fontFamily={DS.font}
                  >
                    Transpiration
                  </text>
                )}
                {[520, 535, 550, 565].map((x, i) => (
                  <g
                    key={i}
                    style={{
                      animation:
                        currentPhase === "EVAPORATION"
                          ? "transpirationRise 2.5s ease-out infinite"
                          : "none",
                      animationDelay: `${i * 0.2}s`,
                      opacity: 0,
                    }}
                  >
                    <path
                      d={`M ${x} 245 Q ${x - 3} 235, ${x} 225 T ${x} 205`}
                      stroke="#66bb6a"
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray="2 2"
                    />
                  </g>
                ))}
              </g>

              {/* Clouds */}
              <g>
                {[1, 2].map((cloudNum) => (
                  <g key={cloudNum} style={getCloudStyles(cloudNum)}>
                    {cloudNum === 1 && (
                      <text
                        x="0"
                        y="-45"
                        textAnchor="middle"
                        fill="#533086"
                        fontSize="12"
                        fontWeight="700"
                        fontFamily={DS.font}
                      >
                        {currentPhase === "CONDENSATION" && "Condensation"}
                        {currentPhase === "PRECIPITATION" && "Precipitation"}
                      </text>
                    )}
                    <g filter="url(#cloudShadow)">
                      {[
                        { cx: 0, cy: 0, r: 32 },
                        { cx: -25, cy: 5, r: 23 },
                        { cx: 25, cy: 5, r: 23 },
                        { cx: -10, cy: -8, r: 20 },
                        { cx: 10, cy: -8, r: 20 },
                      ].map((c, i) => (
                        <circle
                          key={i}
                          {...c}
                          fill={getCloudFill()}
                          stroke={getCloudStroke()}
                          strokeWidth="1"
                          style={{ transition: "fill 5s, stroke 5s" }}
                        />
                      ))}
                    </g>
                  </g>
                ))}
              </g>

              {/* Rain */}
              <g
                style={{
                  opacity: currentPhase === "PRECIPITATION" ? 1 : 0,
                  transition: "opacity 0.8s",
                }}
              >
                {Array.from({ length: 72 }).map((_, i) => {
                  const cloudBase = i < 36 ? 495 : 635;
                  const col = (i % 36) % 6;
                  const row = Math.floor((i % 36) / 6);
                  const x = cloudBase + col * 16;
                  const y = 145 + row * 5;
                  return (
                    <g
                      key={i}
                      style={{
                        animation:
                          currentPhase === "PRECIPITATION"
                            ? "rainDropFall 1s linear infinite"
                            : "none",
                        animationDelay: `${col * 0.12 + row * 0.05}s`,
                      }}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r="3"
                        fill="#4A4DC9"
                        opacity="0.8"
                      />
                      <ellipse
                        cx={x}
                        cy={y + 4}
                        rx="2"
                        ry="5"
                        fill="#4A4DC9"
                        opacity="0.8"
                      />
                    </g>
                  );
                })}
                {[500, 520, 540, 560, 580, 640, 660, 680, 700, 720].map(
                  (x, i) => (
                    <ellipse
                      key={i}
                      cx={x}
                      cy={278}
                      rx={6}
                      ry={2}
                      fill="#7A7DFF"
                      opacity="0"
                      style={{
                        animation:
                          currentPhase === "PRECIPITATION"
                            ? "splashEffect 1s linear infinite"
                            : "none",
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ),
                )}
              </g>

              {/* Infiltration */}
              <g
                style={{
                  opacity: currentPhase === "COLLECTION" ? 1 : 0,
                  transition: "opacity 0.8s",
                }}
              >
                <text
                  x="610"
                  y="345"
                  textAnchor="middle"
                  fill="#533086"
                  fontSize="13"
                  fontWeight="800"
                  fontFamily={DS.font}
                >
                  Infiltration
                </text>
                {[500, 560, 620, 680, 730].map((x, i) => (
                  <g
                    key={i}
                    style={{
                      animation:
                        currentPhase === "COLLECTION"
                          ? "infiltrationDrop 2.5s ease-in infinite"
                          : "none",
                      animationDelay: `${i * 0.25}s`,
                    }}
                  >
                    <line
                      x1={x}
                      y1={350}
                      x2={x}
                      y2={380}
                      stroke="#4A4DC9"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0"
                    />
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>

        {/* Info Panel */}
        <div
          style={{
            width: isSmallScreen ? "100%" : "38%",
            display: "flex",
            flexDirection: "column",
            padding: isMobile ? "8px" : "14px",
            overflow: isSmallScreen ? "visible" : "hidden",
            maxHeight: isSmallScreen ? "none" : "100%",
          }}
        >
          {/* Phase title card */}
          <div
            style={{
              background: DS.colors.gradientSubtle,
              padding: isMobile ? "12px 16px" : "14px 20px",
              borderRadius: DS.radius.md,
              marginBottom: isMobile ? "10px" : "14px",
              boxShadow: DS.shadow.sm,
              border: `2px solid ${DS.colors.primaryLight}`,
              flexShrink: 0,
            }}
          >
            <h2
              style={{
                color: DS.colors.primaryDark,
                fontSize: isMobile ? "15px" : isTablet ? "17px" : "19px",
                fontWeight: 700,
                margin: 0,
                textAlign: "center",
                fontFamily: DS.font,
              }}
            >
              {currentInfo.title}
            </h2>
          </div>

          {/* Info cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? "12px" : "16px",
              flex: 1,
              overflow: isSmallScreen ? "visible" : "auto",
            }}
          >
            {/* What is it */}
            <div
              style={{
                background: DS.colors.white,
                padding: isMobile ? "12px 14px" : "14px 18px",
                borderRadius: DS.radius.md,
                borderLeft: `4px solid ${DS.colors.primary}`,
                boxShadow: DS.shadow.sm,
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? "13px" : "15px",
                  fontWeight: 700,
                  color: DS.colors.primary,
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: DS.font,
                }}
              >
                <span>📖</span> What is it?
              </div>
              {currentInfo.simple.map((sentence, index) => (
                <p
                  key={`s-${index}`}
                  style={{
                    fontSize: isMobile ? "12px" : "13px",
                    color: DS.colors.text,
                    lineHeight: "1.6",
                    margin: "0 0 5px 0",
                    paddingLeft: "4px",
                    fontWeight: 500,
                    fontFamily: DS.font,
                  }}
                >
                  • {sentence}
                </p>
              ))}
            </div>

            {/* Example */}
            <div
              style={{
                background: DS.colors.white,
                padding: isMobile ? "12px 14px" : "14px 18px",
                borderRadius: DS.radius.md,
                borderLeft: `4px solid ${DS.colors.secondary}`,
                boxShadow: DS.shadow.sm,
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? "13px" : "15px",
                  fontWeight: 700,
                  color: DS.colors.secondary,
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: DS.font,
                }}
              >
                <span>💡</span> Real-Life Example
              </div>
              {currentInfo.example.map((sentence, index) => (
                <p
                  key={`e-${index}`}
                  style={{
                    fontSize: isMobile ? "12px" : "13px",
                    color: DS.colors.text,
                    lineHeight: "1.6",
                    margin: "0 0 5px 0",
                    paddingLeft: "4px",
                    fontWeight: 500,
                    fontFamily: DS.font,
                  }}
                >
                  • {sentence}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Controls */}
      <div
        style={{
          background: DS.colors.white,
          padding: isMobile ? "10px 12px" : "14px 24px",
          boxShadow: "0 -4px 16px rgba(74, 77, 201, 0.06)",
          flexShrink: 0,
          borderTop: `1px solid ${DS.colors.grayLight}`,
        }}
      >
        {(showNavigation || showPlayPause) && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: isMobile ? "8px" : "10px",
              flexWrap: "wrap",
              marginBottom: isMobile ? "8px" : "10px",
            }}
          >
            {showNavigation && (
              <DSButton
                variant="outlined"
                onClick={() =>
                  setCurrentStep(
                    (prev) => (prev - 1 + steps.length) % steps.length,
                  )
                }
                disabled={isAutoPlaying}
              >
                <ChevronLeftIcon size={isMobile ? 14 : 16} />
                {!isMobile && "Previous"}
              </DSButton>
            )}
            {showPlayPause && (
              <DSButton
                variant="contained"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              >
                {isAutoPlaying ? (
                  <PauseIcon size={isMobile ? 14 : 16} color="#fff" />
                ) : (
                  <PlayIcon size={isMobile ? 14 : 16} color="#fff" />
                )}
                {isAutoPlaying ? "Pause" : isMobile ? "Play" : "Auto Play"}
              </DSButton>
            )}
            {showNavigation && (
              <DSButton
                variant="outlined"
                onClick={() =>
                  setCurrentStep((prev) => (prev + 1) % steps.length)
                }
                disabled={isAutoPlaying}
              >
                {!isMobile && "Next"}
                <ChevronRightIcon size={isMobile ? 14 : 16} />
              </DSButton>
            )}
            <DSButton
              variant="highlight"
              onClick={() => {
                setCurrentStep(0);
                setIsAutoPlaying(false);
              }}
            >
              <RotateCcwIcon size={isMobile ? 14 : 16} color="#fff" />
              {!isMobile && "Reset"}
            </DSButton>
          </div>
        )}

        {showStepIndicator && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: isMobile ? "8px" : "10px",
              flexWrap: "wrap",
            }}
          >
            {steps.map((step, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentStep(i);
                  setIsAutoPlaying(false);
                }}
                style={{
                  width: isMobile ? "34px" : "38px",
                  height: isMobile ? "34px" : "38px",
                  borderRadius: DS.radius.circle,
                  border:
                    i === currentStep
                      ? `2px solid ${DS.colors.primary}`
                      : `2px solid ${DS.colors.grayLight}`,
                  background:
                    i === currentStep ? DS.colors.primary : DS.colors.white,
                  color:
                    i === currentStep ? DS.colors.white : DS.colors.primary,
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: i === currentStep ? DS.shadow.glow : DS.shadow.sm,
                  transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                  fontFamily: DS.font,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: i === currentStep ? "dotBounce 0.4s ease" : "none",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PRACTICE MODE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const PracticeMode: React.FC<{
  questions: Question[];
}> = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { isMobile, isTablet } = useResponsive();

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowExplanation(true);
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const percentage = (score / questions.length) * 100;
    let message = "";
    if (score === questions.length)
      message = "🌟 Perfect! You're a Water Cycle expert!";
    else if (percentage >= 80)
      message = "🎯 Excellent work! You understand the water cycle well!";
    else if (percentage >= 60)
      message = "👍 Good job! Keep learning about the water cycle!";
    else message = "📚 Keep practicing! Review the water cycle concepts.";

    return (
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: isMobile ? "16px" : "24px",
          fontFamily: DS.font,
        }}
      >
        <div style={{ textAlign: "center", animation: "slideUp 0.5s ease" }}>
          <h1
            style={{
              fontSize: isMobile ? "1.8em" : "2.4em",
              background: DS.colors.gradientPrimary,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "24px",
              fontWeight: 800,
            }}
          >
            🎉 Quiz Completed!
          </h1>
          <div
            style={{
              background: DS.colors.gradientPrimary,
              color: DS.colors.white,
              padding: isMobile ? "30px" : "40px",
              borderRadius: DS.radius.lg,
              marginBottom: "24px",
              boxShadow: DS.shadow.lg,
            }}
          >
            <p style={{ fontSize: "16px", margin: "0 0 8px 0", opacity: 0.9 }}>
              Your Score
            </p>
            <div>
              <span
                style={{
                  fontSize: isMobile ? "2.5em" : "3.5em",
                  fontWeight: 800,
                }}
              >
                {score}
              </span>
              <span
                style={{ fontSize: isMobile ? "1.4em" : "1.8em", opacity: 0.7 }}
              >
                {" "}
                / {questions.length}
              </span>
            </div>
            <p
              style={{ fontSize: "1.2em", margin: "10px 0 0 0", opacity: 0.9 }}
            >
              {percentage.toFixed(0)}%
            </p>
          </div>
          <div
            style={{
              fontSize: isMobile ? "1em" : "1.15em",
              color: DS.colors.text,
              margin: "0 0 24px 0",
              padding: "18px",
              background: DS.colors.surface,
              borderRadius: DS.radius.md,
              border: `1px solid ${DS.colors.grayLight}`,
            }}
          >
            {message}
          </div>
          <DSButton variant="contained" onClick={handleRestart}>
            Try Again
          </DSButton>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: isMobile ? "16px" : "24px",
        fontFamily: DS.font,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: DS.colors.gradientPrimary,
          color: DS.colors.white,
          padding: isMobile ? "20px" : "28px",
          borderRadius: DS.radius.lg,
          marginBottom: isMobile ? "20px" : "28px",
          boxShadow: DS.shadow.lg,
        }}
      >
        <h1
          style={{
            margin: "0 0 16px 0",
            fontSize: isMobile ? "1.3em" : "1.7em",
            fontWeight: 700,
          }}
        >
          Water Cycle Practice
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
            fontSize: isMobile ? "0.9em" : "1em",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <span>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span>Score: {score}</span>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.25)",
            height: "8px",
            borderRadius: DS.radius.pill,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: DS.colors.white,
              height: "100%",
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              transition: "width 0.4s cubic-bezier(.4,0,.2,1)",
              borderRadius: DS.radius.pill,
            }}
          />
        </div>
      </div>

      {/* Question card */}
      <div
        style={{
          background: DS.colors.white,
          padding: isMobile ? "20px" : "28px",
          borderRadius: DS.radius.lg,
          boxShadow: DS.shadow.md,
          border: `1px solid ${DS.colors.grayLight}`,
          animation: "fadeIn 0.3s ease",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "1.05em" : "1.25em",
            color: DS.colors.text,
            marginBottom: isMobile ? "20px" : "28px",
            lineHeight: 1.6,
            fontWeight: 600,
          }}
        >
          {questions[currentQuestion].question}
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "10px" : "12px",
            marginBottom: isMobile ? "20px" : "24px",
          }}
        >
          {questions[currentQuestion].options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect =
              showExplanation &&
              index === questions[currentQuestion].correctAnswer;
            const isIncorrect =
              showExplanation &&
              selectedAnswer === index &&
              index !== questions[currentQuestion].correctAnswer;

            let borderColor = DS.colors.grayLight;
            let bgColor = DS.colors.white;
            let labelBg = DS.colors.primary;

            if (isCorrect) {
              borderColor = DS.colors.success;
              bgColor = "#E8F9ED";
              labelBg = DS.colors.success;
            } else if (isIncorrect) {
              borderColor = DS.colors.error;
              bgColor = "#FFEDED";
              labelBg = DS.colors.error;
            } else if (isSelected) {
              borderColor = DS.colors.primary;
              bgColor = `${DS.colors.primary}08`;
              labelBg = DS.colors.primary;
            }

            return (
              <button
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: isMobile ? "14px" : "18px",
                  border: `2px solid ${borderColor}`,
                  borderRadius: DS.radius.md,
                  background: bgColor,
                  cursor: showExplanation ? "not-allowed" : "pointer",
                  transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                  fontSize: isMobile ? "0.9em" : "1em",
                  textAlign: "left",
                  fontFamily: DS.font,
                  fontWeight: 500,
                  color: DS.colors.text,
                }}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: isMobile ? "28px" : "34px",
                    height: isMobile ? "28px" : "34px",
                    background: labelBg,
                    color: DS.colors.white,
                    borderRadius: DS.radius.circle,
                    fontWeight: 700,
                    marginRight: isMobile ? "12px" : "16px",
                    flexShrink: 0,
                    fontSize: isMobile ? "0.85em" : "0.95em",
                  }}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span style={{ flex: 1 }}>{option}</span>
                {isCorrect && (
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "1.3em",
                      color: DS.colors.success,
                    }}
                  >
                    ✓
                  </span>
                )}
                {isIncorrect && (
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "1.3em",
                      color: DS.colors.error,
                    }}
                  >
                    ✗
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div
            style={{
              background: DS.colors.secondaryLight,
              borderLeft: `4px solid ${DS.colors.secondary}`,
              padding: isMobile ? "14px" : "18px",
              borderRadius: DS.radius.sm,
              marginBottom: isMobile ? "16px" : "20px",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px 0",
                color: DS.colors.secondary,
                fontSize: isMobile ? "0.95em" : "1.05em",
                fontWeight: 700,
              }}
            >
              💡 Explanation
            </h3>
            <p
              style={{
                margin: 0,
                lineHeight: 1.65,
                color: DS.colors.text,
                fontSize: isMobile ? "0.9em" : "0.95em",
              }}
            >
              {questions[currentQuestion].explanation}
            </p>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center" }}>
          {!showExplanation ? (
            <DSButton
              variant="contained"
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </DSButton>
          ) : (
            <DSButton
              variant="contained"
              onClick={handleNext}
              style={{ background: DS.colors.success }}
            >
              {currentQuestion < questions.length - 1
                ? "Next Question →"
                : "View Results"}
            </DSButton>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// REAL WORLD MODE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const RealWorldMode: React.FC<{
  examples: RealWorldExample[];
}> = ({ examples }) => {
  const [selectedExample, setSelectedExample] = useState(0);
  const { isMobile, isTablet } = useResponsive();

  const iconMap: { [key: number]: string } = {
    1: "🏔️",
    2: "🏠",
    3: "🛖",
    4: "🧱",
    5: "♨️",
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: isMobile ? "16px" : "24px",
        fontFamily: DS.font,
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: isMobile ? "24px" : "36px",
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? "1.6em" : isTablet ? "2em" : "2.4em",
            background: DS.colors.gradientPrimary,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px",
            fontWeight: 800,
          }}
        >
          🌍 Real World Applications
        </h1>
        <p
          style={{
            fontSize: isMobile ? "0.95em" : "1.1em",
            color: DS.colors.textLight,
            padding: "0 10px",
          }}
        >
          Discover how heat transfer and water cycle concepts are applied in
          real life
        </p>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : isTablet
              ? "repeat(2, 1fr)"
              : "repeat(auto-fit, minmax(200px, 1fr))",
          gap: isMobile ? "12px" : "18px",
          marginBottom: isMobile ? "24px" : "36px",
        }}
      >
        {examples.map((example, index) => {
          const isActive = selectedExample === index;
          return (
            <div
              key={example.id}
              onClick={() => setSelectedExample(index)}
              style={{
                background: isActive
                  ? DS.colors.gradientSubtle
                  : DS.colors.white,
                padding: isMobile ? "18px" : "22px",
                borderRadius: DS.radius.lg,
                boxShadow: isActive ? DS.shadow.glow : DS.shadow.sm,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                textAlign: "center",
                border: `2px solid ${isActive ? DS.colors.primary : "transparent"}`,
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? "2.2em" : "2.6em",
                  marginBottom: "10px",
                }}
              >
                {iconMap[example.id]}
              </div>
              <h3
                style={{
                  fontSize: isMobile ? "0.95em" : "1.05em",
                  color: DS.colors.text,
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                {example.title}
              </h3>
              <p
                style={{
                  fontSize: isMobile ? "0.8em" : "0.85em",
                  color: DS.colors.textLight,
                  marginBottom: "10px",
                }}
              >
                📍 {example.location}
              </p>
              <span
                style={{
                  display: "inline-block",
                  padding: isMobile ? "4px 14px" : "5px 16px",
                  background: DS.colors.primary,
                  color: DS.colors.white,
                  borderRadius: DS.radius.pill,
                  fontSize: isMobile ? "0.75em" : "0.8em",
                  fontWeight: 600,
                }}
              >
                {example.category}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detail section */}
      <div
        key={selectedExample}
        style={{
          background: DS.colors.white,
          borderRadius: DS.radius.lg,
          padding: isMobile ? "20px" : isTablet ? "28px" : "34px",
          boxShadow: DS.shadow.md,
          border: `1px solid ${DS.colors.grayLight}`,
          animation: "fadeIn 0.35s ease",
        }}
      >
        {/* Title row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: isMobile ? "18px" : "24px",
            paddingBottom: isMobile ? "14px" : "18px",
            borderBottom: `2px solid ${DS.colors.grayLight}`,
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h2
            style={{
              color: DS.colors.text,
              margin: 0,
              fontSize: isMobile ? "1.3em" : isTablet ? "1.6em" : "1.8em",
              fontWeight: 700,
            }}
          >
            {examples[selectedExample].title}
          </h2>
          <span
            style={{
              padding: isMobile ? "6px 18px" : "8px 22px",
              background: DS.colors.gradientPrimary,
              color: DS.colors.white,
              borderRadius: DS.radius.pill,
              fontWeight: 600,
              fontSize: isMobile ? "0.85em" : "0.95em",
            }}
          >
            {examples[selectedExample].category}
          </span>
        </div>

        {/* Location */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: isMobile ? "10px 16px" : "12px 20px",
            background: DS.colors.surface,
            borderRadius: DS.radius.md,
            marginBottom: isMobile ? "18px" : "22px",
            fontSize: isMobile ? "0.9em" : "1em",
            border: `1px solid ${DS.colors.grayLight}`,
          }}
        >
          <span style={{ fontSize: "1.2em" }}>📍</span>
          <strong style={{ color: DS.colors.text }}>Location:</strong>
          <span style={{ color: DS.colors.textLight }}>
            {examples[selectedExample].location}
          </span>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: isMobile ? "0.95em" : "1.05em",
            lineHeight: 1.8,
            color: DS.colors.text,
            marginBottom: isMobile ? "20px" : "28px",
          }}
        >
          {examples[selectedExample].description}
        </p>

        {/* Impact */}
        <div
          style={{
            display: "flex",
            alignItems: isMobile ? "center" : "flex-start",
            gap: isMobile ? "14px" : "20px",
            padding: isMobile ? "18px" : "24px",
            background: DS.colors.secondaryLight,
            borderRadius: DS.radius.md,
            marginBottom: isMobile ? "20px" : "28px",
            borderLeft: `5px solid ${DS.colors.secondary}`,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <span
            style={{ fontSize: isMobile ? "1.8em" : "2.2em", flexShrink: 0 }}
          >
            ⚡
          </span>
          <p
            style={{
              fontSize: isMobile ? "0.95em" : "1.05em",
              lineHeight: 1.7,
              color: DS.colors.text,
              margin: 0,
              flex: 1,
            }}
          >
            <strong style={{ color: DS.colors.secondary }}>
              Real-World Impact:
            </strong>{" "}
            {examples[selectedExample].impact}
          </p>
        </div>

        {/* Features */}
        <h3
          style={{
            color: DS.colors.primary,
            marginBottom: isMobile ? "14px" : "18px",
            fontSize: isMobile ? "1.05em" : "1.2em",
            fontWeight: 700,
          }}
        >
          Key Features
        </h3>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            marginBottom: isMobile ? "20px" : "28px",
          }}
        >
          {examples[selectedExample].keyFeatures.map((feature, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                padding: isMobile ? "12px" : "14px",
                marginBottom: "8px",
                background: DS.colors.surface,
                borderRadius: DS.radius.sm,
                fontSize: isMobile ? "0.9em" : "1em",
                lineHeight: 1.5,
                border: `1px solid ${DS.colors.grayLight}`,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  background: DS.colors.success,
                  color: DS.colors.white,
                  borderRadius: DS.radius.circle,
                  marginRight: "14px",
                  flexShrink: 0,
                  fontWeight: 700,
                  fontSize: "0.75em",
                }}
              >
                ✓
              </span>
              <span style={{ color: DS.colors.text }}>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Connection */}
        <div
          style={{
            padding: isMobile ? "18px" : "24px",
            background: `${DS.colors.primary}08`,
            borderRadius: DS.radius.md,
            borderLeft: `5px solid ${DS.colors.primary}`,
          }}
        >
          <h3
            style={{
              color: DS.colors.primaryDark,
              margin: "0 0 12px 0",
              fontSize: isMobile ? "1.05em" : "1.15em",
              fontWeight: 700,
            }}
          >
            🔗 Connection to Water Cycle & Heat Transfer
          </h3>
          <p
            style={{
              fontSize: isMobile ? "0.95em" : "1em",
              lineHeight: 1.7,
              color: DS.colors.text,
              margin: 0,
            }}
          >
            {examples[selectedExample].connection}
          </p>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const WaterCycleTool: React.FC<WaterCycleToolProps> = ({
  props = {},
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const {
    initialMode = "learn",
    showModeSelector = true,
    enabledModes = ["learn", "practice", "realWorld"],
    showNavigation = true,
    showPlayPause = true,
    showStepIndicator = true,
    filterSteps,
    animationSpeed = 1,
    autoPlayDuration = 7000,
    darkMode = false,
    additionalProps = {},
  } = props;

  const { customPhases, customQuestions, customExamples } = additionalProps;

  const [activeTab, setActiveTab] = useState<ModeType>(initialMode);
  const { isMobile, isTablet, isSmallScreen } = useResponsive();

  const phases = useMemo(() => customPhases || DEFAULT_PHASES, [customPhases]);
  const questions = useMemo(
    () => customQuestions || DEFAULT_QUESTIONS,
    [customQuestions],
  );
  const examples = useMemo(
    () => customExamples || DEFAULT_EXAMPLES,
    [customExamples],
  );

  const steps = useMemo(() => {
    let allSteps = DEFAULT_STEPS;
    if (filterSteps && filterSteps.length > 0) {
      allSteps = allSteps.filter((_, index) => filterSteps.includes(index + 1));
    }
    return allSteps;
  }, [filterSteps]);

  useEffect(() => {
    const styleId = "singularity-water-cycle-keyframes";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = KEYFRAMES_CSS;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);

  const tabConfig: {
    mode: ModeType;
    label: string;
    Icon: React.FC<{ size?: number; color?: string }>;
  }[] = [
    { mode: "learn", label: "Learn", Icon: BookOpenIcon },
    { mode: "practice", label: "Practice", Icon: ClipboardCheckIcon },
    { mode: "realWorld", label: "Real World", Icon: GlobeIcon },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode ? "#1A1A2E" : DS.colors.surface,
        fontFamily: DS.font,
      }}
    >
      <style>{KEYFRAMES_CSS}</style>

      {/* Navigation Bar */}
      {showModeSelector && (
        <nav
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: darkMode ? "#1A1A2E" : DS.colors.white,
            borderBottom: `1px solid ${darkMode ? "#2A2A4A" : DS.colors.grayLight}`,
            boxShadow: DS.shadow.sm,
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: isMobile ? "0 12px" : "0 20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: isMobile ? "56px" : "64px",
                gap: "12px",
              }}
            >
              {/* Logo */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? "6px" : "10px",
                }}
              >
                <DropletIcon
                  size={isMobile ? 20 : 24}
                  color={DS.colors.primary}
                />
                <span
                  style={{
                    fontSize: isMobile ? "16px" : "20px",
                    fontWeight: 800,
                    background: DS.colors.gradientPrimary,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    whiteSpace: "nowrap",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Water Cycle
                </span>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: isMobile ? "4px" : "8px" }}>
                {tabConfig.map(
                  ({ mode, label, Icon }) =>
                    enabledModes.includes(mode) && (
                      <button
                        key={mode}
                        onClick={() => setActiveTab(mode)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: isMobile ? "4px" : "8px",
                          padding: isMobile ? "6px 12px" : "8px 18px",
                          borderRadius: DS.radius.pill,
                          fontWeight: 600,
                          border:
                            activeTab === mode
                              ? "none"
                              : `1.5px solid ${darkMode ? "#444" : DS.colors.grayLight}`,
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                          fontSize: isMobile ? "12px" : "14px",
                          whiteSpace: "nowrap",
                          fontFamily: DS.font,
                          background:
                            activeTab === mode
                              ? DS.colors.gradientPrimary
                              : "transparent",
                          color:
                            activeTab === mode
                              ? DS.colors.white
                              : darkMode
                                ? "#CCC"
                                : DS.colors.text,
                          boxShadow:
                            activeTab === mode ? DS.shadow.glow : "none",
                        }}
                      >
                        <Icon
                          size={isMobile ? 16 : 18}
                          color={
                            activeTab === mode ? "#fff" : DS.colors.primary
                          }
                        />
                        {!isMobile && label}
                      </button>
                    ),
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Content */}
      <div
        style={{
          paddingTop: showModeSelector ? (isMobile ? "56px" : "64px") : 0,
        }}
      >
        {activeTab === "learn" ? (
          <LearnMode
            steps={steps}
            phases={phases}
            autoPlayDuration={autoPlayDuration}
            animationSpeed={animationSpeed}
            showNavigation={showNavigation}
            showPlayPause={showPlayPause}
            showStepIndicator={showStepIndicator}
            setStepDetails={setStepDetails}
          />
        ) : activeTab === "practice" ? (
          <PracticeMode questions={questions} />
        ) : (
          <RealWorldMode examples={examples} />
        )}
      </div>
    </div>
  );
};

export default WaterCycleTool;
