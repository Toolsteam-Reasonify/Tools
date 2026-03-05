import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

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

interface RadiationAdditionalProps {
  showSunDemo?: boolean;
  showFireDemo?: boolean;
  showClothingDemo?: boolean;
  surfaceColors?: string[];
  heatSourceType?: "sun" | "fire" | "heater" | "all";
  showWaveAnimation?: boolean;
  radiationIntensity?: number;
  showMediumComparison?: boolean;
  customScenarios?: {
    name: string;
    source: string;
    receiver: string;
    medium: string;
    description: string;
  }[];
}

interface RadiationToolProps {
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
    additionalProps?: RadiationAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== EASING FUNCTIONS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// ==================== DESIGN TOKENS (Singularity) ====================

const COLORS = {
  primary: "#4A4DC9",
  secondary: "#FF7212",
  gradientStart: "#533086",
  gradientEnd: "#FC9145",
  lightPrimary: "#C1C1EA",
  lightSecondary: "#FFF3E4",
  dark: "#4E4E4E",
  gray: "#CACACA",
  lightGray: "#EBEBEB",
  bgLight: "#F5F5F5",
  white: "#FFFFFF",
  success: "#22C55E",
  error: "#EF4444",
  warmYellow: "#FFC107",
  sunOrange: "#FF9800",
  fireRed: "#E53935",
  heatWave1: "#FF6B35",
  heatWave2: "#FF8A50",
  heatWave3: "#FFB74D",
};

// ==================== SVG ICONS (NO external imports) ====================

const IconPlay = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const IconPause = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);
const IconChevLeft = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconChevRight = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconCheck = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconBook = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
const IconTarget = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const IconGlobe = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const IconFlask = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
    <path d="M8.5 2h7" />
  </svg>
);
const IconSun = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const IconRefresh = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  // LEARN MODE
  {
    id: 1,
    title: "What is Radiation?",
    description:
      "Radiation is the process of heat transfer that does not require any material medium. Heat travels directly from a hot object to cooler surroundings through invisible heat waves — just like light!",
    type: "intro",
    mode: "learn",
  },
  {
    id: 2,
    title: "Heat from the Sun",
    description:
      "The Sun's heat reaches the Earth through radiation. Between the Sun and Earth is the vacuum of space — there is no air or material to conduct or convect heat. Yet, we feel the warmth! This is the power of radiation.",
    type: "explanation",
    mode: "learn",
    data: { scene: "sun_earth" },
  },
  {
    id: 3,
    title: "Warmth from a Fire",
    description:
      "When Pema and Palden sit around a fireplace, the heat reaches them directly through radiation. The fire radiates heat in all directions — you can feel it even without touching the fire!",
    type: "explanation",
    mode: "learn",
    data: { scene: "fireplace" },
  },
  {
    id: 4,
    title: "All Objects Radiate Heat",
    description:
      "Every object radiates heat to its surroundings. A hot utensil kept away from the flame cools down over time by radiating heat. The hotter the object, the more heat it radiates!",
    type: "explanation",
    mode: "learn",
    data: { scene: "hot_object" },
  },
  {
    id: 5,
    title: "No Medium Needed!",
    description:
      "Unlike conduction (which needs a solid) and convection (which needs a fluid), radiation does NOT need any medium. Heat can travel through empty space — that's how sunlight warms the Earth across millions of kilometres!",
    type: "explanation",
    mode: "learn",
    data: { scene: "comparison" },
  },
  {
    id: 6,
    title: "Light vs Dark Colours",
    description:
      "Light-coloured clothes reflect most heat radiation, keeping us cool in summer. Dark-coloured clothes absorb more heat radiation, keeping us warm in winter. That's why we choose clothing colours wisely!",
    type: "explanation",
    mode: "learn",
    data: { scene: "clothing" },
  },

  // PRACTICE MODE
  {
    id: 10,
    title: "Quick Check!",
    description: "How does heat from the Sun reach the Earth?",
    type: "practice",
    mode: "practice",
    data: {
      question: "How does heat from the Sun reach the Earth?",
      options: ["Conduction", "Convection", "Radiation", "All three"],
      answer: 2,
      explanation:
        "Heat from the Sun reaches the Earth through radiation. There is no medium (like air or solid) between the Sun and Earth for conduction or convection!",
    },
  },
  {
    id: 11,
    title: "Think About It!",
    description: "Which type of heat transfer does NOT require a medium?",
    type: "practice",
    mode: "practice",
    data: {
      question: "Which type of heat transfer does NOT require a medium?",
      options: [
        "Conduction",
        "Convection",
        "Radiation",
        "Both conduction and convection",
      ],
      answer: 2,
      explanation:
        "Radiation does not need any medium. It can travel through vacuum (empty space), unlike conduction and convection.",
    },
  },
  {
    id: 12,
    title: "Colour Science!",
    description:
      "Why do we prefer wearing white or light-coloured clothes in summer?",
    type: "practice",
    mode: "practice",
    data: {
      question:
        "Why do we prefer wearing white or light-coloured clothes in summer?",
      options: [
        "They are cheaper",
        "They reflect most heat radiation",
        "They absorb more heat",
        "They are lighter in weight",
      ],
      answer: 1,
      explanation:
        "Light-coloured clothes reflect most of the heat that falls on them, so we feel cooler wearing them in summer.",
    },
  },
  {
    id: 13,
    title: "Hot Utensil!",
    description: "A hot utensil kept away from the flame cools down. Why?",
    type: "practice",
    mode: "practice",
    data: {
      question: "A hot utensil kept away from the flame cools down because it:",
      options: [
        "Absorbs cold from surroundings",
        "Radiates heat to surroundings",
        "Conducts heat to air",
        "Becomes lighter",
      ],
      answer: 1,
      explanation:
        "The hot utensil cools down by radiating heat to its cooler surroundings. All hot objects radiate heat!",
    },
  },

  // REAL WORLD MODE
  {
    id: 20,
    title: "Sitting by a Campfire",
    description:
      "When you sit around a campfire on a cold night, you feel warm. The heat reaches you through radiation — directly from the fire. The further you sit, the less heat you feel because radiation weakens with distance.",
    type: "real_world",
    mode: "real_world",
    data: { scenario: "campfire" },
  },
  {
    id: 21,
    title: "Solar Water Heater",
    description:
      "Solar water heaters use dark-coloured panels to absorb the Sun's radiation and heat water. Dark surfaces are excellent at absorbing radiation — that's the science behind these eco-friendly devices!",
    type: "real_world",
    mode: "real_world",
    data: { scenario: "solar_heater" },
  },
  {
    id: 22,
    title: "Thermos Flask",
    description:
      "A thermos flask has shiny, mirror-like walls inside. These walls reflect radiation, preventing heat from escaping (for hot liquids) or entering (for cold liquids). It uses the science of radiation to keep your drinks at the right temperature!",
    type: "real_world",
    mode: "real_world",
    data: { scenario: "thermos" },
  },

  // HANDS-ON MODE
  {
    id: 30,
    title: "Colour & Heat Experiment",
    description:
      "Drag the slider to change the surface colour from light to dark and observe how much heat radiation gets absorbed vs reflected. Dark surfaces absorb more heat!",
    type: "hands_on",
    mode: "hands_on",
    data: { experiment: "color_absorption" },
  },
  {
    id: 31,
    title: "Distance & Heat Experiment",
    description:
      "Move the person closer or further from the heat source. Watch how the amount of radiation reaching them changes with distance!",
    type: "hands_on",
    mode: "hands_on",
    data: { experiment: "distance_effect" },
  },
];

// ==================== MAIN COMPONENT ====================

const RadiationTool: React.FC<RadiationToolProps> = ({
  props = {},
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  // Config extraction
  const {
    width = 800,
    height = 600,
    initialMode = "learn",
    showModeSelector = true,
    enabledModes = ["learn", "practice", "real_world", "hands_on"],
    showNavigation = true,
    showPlayPause = true,
    showStepIndicator = true,
    initialStep,
    filterSteps,
    animationSpeed = 1,
    autoPlayDuration = 8000,
    themeColor = COLORS.primary,
    darkMode = false,
    additionalProps = {},
  } = props;

  // State
  const [currentMode, setCurrentMode] = useState<ModeType>(initialMode);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [hoverBtn, setHoverBtn] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState(50);
  const [distanceValue, setDistanceValue] = useState(50);
  const [wavePhase, setWavePhase] = useState(0);
  const [animTime, setAnimTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const waveRef = useRef<number>(0);
  const startTimeRef = useRef<number>(performance.now());

  // Filter steps
  const allSteps = useMemo(() => {
    let steps = DEFAULT_STEPS;
    if (filterSteps && filterSteps.length > 0) {
      steps = steps.filter((s) => filterSteps.includes(s.id));
    }
    return steps;
  }, [filterSteps]);

  const modeSteps = useMemo(() => {
    return allSteps.filter((s) => s.mode === currentMode);
  }, [allSteps, currentMode]);

  const currentStep = modeSteps[currentStepIndex] || modeSteps[0];

  // Inject keyframes
  useEffect(() => {
    const id = "radiation-tool-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
            @keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
            @keyframes fadeInLeft { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0); } }
            @keyframes fadeInRight { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
            @keyframes popIn { 0% { transform:scale(0); opacity:0; } 70% { transform:scale(1.08); } 85% { transform:scale(0.97); } 100% { transform:scale(1); opacity:1; } }
            @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.06); } }
            @keyframes glow { 0%,100% { box-shadow:0 0 8px rgba(255,114,18,0.3); } 50% { box-shadow:0 0 24px rgba(255,114,18,0.7); } }
            @keyframes sunPulse { 0%,100% { transform:scale(1); filter:brightness(1) drop-shadow(0 0 15px rgba(255,179,0,0.5)); } 50% { transform:scale(1.06); filter:brightness(1.12) drop-shadow(0 0 30px rgba(255,179,0,0.8)); } }
            @keyframes waveMove { 0% { transform:translateX(0); } 100% { transform:translateX(20px); } }
            @keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
            @keyframes fireFlicker1 { 0% { transform:scaleY(1) scaleX(1) translateY(0); } 20% { transform:scaleY(1.06) scaleX(0.96) translateY(-2px); } 40% { transform:scaleY(0.97) scaleX(1.03) translateY(1px); } 60% { transform:scaleY(1.04) scaleX(0.98) translateY(-3px); } 80% { transform:scaleY(0.98) scaleX(1.01) translateY(-1px); } 100% { transform:scaleY(1) scaleX(1) translateY(0); } }
            @keyframes fireFlicker2 { 0% { transform:scaleY(1) scaleX(1) rotate(0deg); opacity:0.85; } 30% { transform:scaleY(1.08) scaleX(0.93) rotate(-2deg); opacity:0.75; } 60% { transform:scaleY(0.94) scaleX(1.04) rotate(1deg); opacity:0.9; } 100% { transform:scaleY(1) scaleX(1) rotate(0deg); opacity:0.85; } }
            @keyframes fireFlicker3 { 0% { transform:scaleY(1) rotate(0deg); opacity:0.7; } 25% { transform:scaleY(1.12) rotate(3deg); opacity:0.6; } 50% { transform:scaleY(0.9) rotate(-2deg); opacity:0.75; } 75% { transform:scaleY(1.05) rotate(1deg); opacity:0.65; } 100% { transform:scaleY(1) rotate(0deg); opacity:0.7; } }
            @keyframes radiateOut { 0% { transform:scale(0.5); opacity:0.6; } 100% { transform:scale(3); opacity:0; } }
            @keyframes floatUp { 0% { transform:translateY(0) scale(1); opacity:0.7; } 100% { transform:translateY(-60px) scale(0.5); opacity:0; } }
            @keyframes slideInScale { from { opacity:0; transform:scale(0.9) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
            @keyframes bounceIn { 0% { transform:scale(0); } 50% { transform:scale(1.08); } 70% { transform:scale(0.96); } 100% { transform:scale(1); } }
            @keyframes heatWave { 0% { d:path("M0,20 Q10,10 20,20 T40,20 T60,20 T80,20"); } 50% { d:path("M0,20 Q10,30 20,20 T40,20 T60,20 T80,20"); } 100% { d:path("M0,20 Q10,10 20,20 T40,20 T60,20 T80,20"); } }
            @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
            @keyframes colorShift { 0% { stop-color:#FF6B35; } 50% { stop-color:#FFB74D; } 100% { stop-color:#FF6B35; } }
            @keyframes ripple { 0% { transform:scale(0); opacity:0.5; } 100% { transform:scale(4); opacity:0; } }
            @keyframes ember { 0% { transform:translateY(0) translateX(0) scale(1); opacity:0.9; } 30% { transform:translateY(-20px) translateX(6px) scale(0.85); opacity:0.7; } 60% { transform:translateY(-45px) translateX(-4px) scale(0.6); opacity:0.4; } 100% { transform:translateY(-70px) translateX(8px) scale(0.2); opacity:0; } }
            @keyframes heatRise { 0% { transform:translateY(0) scaleX(1); opacity:0.5; } 50% { transform:translateY(-30px) scaleX(1.15); opacity:0.3; } 100% { transform:translateY(-65px) scaleX(0.85); opacity:0; } }
            @keyframes gentleBob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-3px); } }
            @keyframes coronaPulse { 0%,100% { opacity:0.15; transform:scale(1); } 50% { opacity:0.3; transform:scale(1.05); } }
            @keyframes arrowFlow { 0% { stroke-dashoffset:20; } 100% { stroke-dashoffset:0; } }
            @font-face { font-family:'Poppins'; font-style:normal; font-weight:400; src:local('Poppins'); }
        `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(id);
      if (el) document.head.removeChild(el);
    };
  }, []);

  // Smooth time-based animation loop (frame-rate independent)
  useEffect(() => {
    const animate = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000; // seconds
      setWavePhase(elapsed);
      setAnimTime(elapsed);
      waveRef.current = requestAnimationFrame(animate);
    };
    startTimeRef.current = performance.now();
    waveRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(waveRef.current);
  }, []);

  // Auto-play
  useEffect(() => {
    if (isPlaying && autoPlayDuration > 0 && !stopAutoNext) {
      autoPlayRef.current = setTimeout(() => {
        goNext();
      }, autoPlayDuration / animationSpeed);
    }
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [
    isPlaying,
    currentStepIndex,
    currentMode,
    stopAutoNext,
    autoPlayDuration,
    animationSpeed,
  ]);

  // Step details callback
  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: modeSteps.length,
        isPaused: !isPlaying,
        currentMode,
      });
    }
  }, [currentStepIndex, modeSteps.length, isPlaying, currentMode]);

  // Navigation
  const goNext = useCallback(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    if (currentStepIndex < modeSteps.length - 1) {
      setCurrentStepIndex((i) => i + 1);
      setAnimKey((k) => k + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentStepIndex, modeSteps.length]);

  const goPrev = useCallback(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((i) => i - 1);
      setAnimKey((k) => k + 1);
    }
  }, [currentStepIndex]);

  const switchMode = useCallback((mode: ModeType) => {
    setCurrentMode(mode);
    setCurrentStepIndex(0);
    setAnimKey((k) => k + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  }, []);

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    setTotalAttempted((t) => t + 1);
    if (idx === currentStep?.data?.answer) {
      setScore((s) => s + 1);
    }
  };

  // ==================== RENDERING HELPERS ====================

  // Helper: Generate a smooth sinusoidal SVG path
  const generateWavePath = (
    startX: number,
    endX: number,
    centerY: number,
    amplitude: number,
    frequency: number,
    phaseOffset: number,
  ): string => {
    const t = wavePhase;
    const points: string[] = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const frac = i / steps;
      const x = startX + frac * (endX - startX);
      const y =
        centerY +
        Math.sin(frac * frequency * Math.PI * 2 - t * 2.5 + phaseOffset) *
          amplitude;
      points.push(i === 0 ? `M ${x},${y}` : `L ${x},${y}`);
    }
    return points.join(" ");
  };

  // Sun-Earth radiation scene — smooth electromagnetic waves
  const renderSunEarthScene = () => {
    // Propagating wave particles (photon dots traveling from sun to earth)
    const photons = Array.from({ length: 8 }, (_, i) => {
      const progress = (wavePhase * 0.4 + i * 0.125) % 1;
      const x = 160 + progress * 460;
      const baseY = 150;
      const y =
        baseY + Math.sin(progress * Math.PI * 6 + i * 1.5) * (8 + i * 2);
      const opacity = Math.sin(progress * Math.PI) * 0.8; // fade in/out at edges
      return { x, y, opacity, size: 2.5 + Math.sin(wavePhase + i) * 0.8 };
    });

    return (
      <svg
        width="100%"
        height="300"
        viewBox="0 0 700 300"
        style={{ overflow: "visible" }}
      >
        <defs>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="30%" stopColor="#FFF176" />
            <stop offset="60%" stopColor="#FFB300" />
            <stop offset="85%" stopColor="#FF8F00" />
            <stop offset="100%" stopColor="#E65100" />
          </radialGradient>
          <radialGradient id="sunCorona" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB300" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#FF8F00" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FF6F00" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="earthGrad" cx="40%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#81C784" />
            <stop offset="30%" stopColor="#4CAF50" />
            <stop offset="60%" stopColor="#2196F3" />
            <stop offset="100%" stopColor="#0D47A1" />
          </radialGradient>
          <radialGradient id="earthAtmo" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#64B5F6" stopOpacity="0" />
            <stop offset="90%" stopColor="#64B5F6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#90CAF9" stopOpacity="0.08" />
          </radialGradient>
          <filter id="sunGlow">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur stdDeviation="14" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="waveGrad1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF8F00" stopOpacity="0.0" />
            <stop offset="15%" stopColor="#FF8F00" stopOpacity="0.7" />
            <stop offset="85%" stopColor="#FFB74D" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFB74D" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="waveGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF6D00" stopOpacity="0.0" />
            <stop offset="15%" stopColor="#FF6D00" stopOpacity="0.5" />
            <stop offset="85%" stopColor="#FFAB40" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFAB40" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="waveGrad3" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFD54F" stopOpacity="0.0" />
            <stop offset="15%" stopColor="#FFD54F" stopOpacity="0.4" />
            <stop offset="85%" stopColor="#FFF176" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFF176" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Starfield background dots */}
        {[
          { x: 200, y: 40 },
          { x: 350, y: 25 },
          { x: 500, y: 55 },
          { x: 280, y: 265 },
          { x: 450, y: 275 },
          { x: 580, y: 35 },
          { x: 170, y: 250 },
        ].map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r="1.2"
            fill="#fff"
            opacity={0.15 + Math.sin(wavePhase * 0.8 + i * 2) * 0.1}
          />
        ))}

        {/* VACUUM label */}
        <text
          x="370"
          y="28"
          textAnchor="middle"
          fill={COLORS.gray}
          fontSize="12"
          fontFamily="Poppins, sans-serif"
          letterSpacing="3"
          opacity="0.7"
        >
          VACUUM OF SPACE
        </text>

        {/* Sun corona glow */}
        <circle
          cx="90"
          cy="155"
          r="95"
          fill="url(#sunCorona)"
          style={{ animation: "coronaPulse 4s ease-in-out infinite" }}
        />
        <circle
          cx="90"
          cy="155"
          r="80"
          fill="url(#sunCorona)"
          opacity="0.5"
          style={{ animation: "coronaPulse 3s ease-in-out infinite 1s" }}
        />

        {/* Sun body */}
        <g style={{ animation: "sunPulse 4s ease-in-out infinite" }}>
          <circle
            cx="90"
            cy="155"
            r="55"
            fill="url(#sunGrad)"
            filter="url(#sunGlow)"
          />
          {/* Sun surface details */}
          <circle cx="75" cy="140" r="8" fill="#FFE082" opacity="0.3" />
          <circle cx="105" cy="160" r="6" fill="#FFE082" opacity="0.25" />
        </g>
        <text
          x="90"
          y="160"
          textAnchor="middle"
          fill="#fff"
          fontWeight="700"
          fontSize="14"
          fontFamily="Poppins, sans-serif"
        >
          Sun
        </text>

        {/* Electromagnetic wave paths — 3 layers with different frequencies */}
        <path
          d={generateWavePath(155, 610, 140, 14, 4.5, 0)}
          fill="none"
          stroke="url(#waveGrad1)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d={generateWavePath(155, 610, 155, 10, 5.5, 2.1)}
          fill="none"
          stroke="url(#waveGrad2)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d={generateWavePath(155, 610, 168, 12, 3.8, 4.2)}
          fill="none"
          stroke="url(#waveGrad3)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Photon particles traveling along the wave */}
        {photons.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={p.size + 3}
              fill="#FFB300"
              opacity={p.opacity * 0.15}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={p.size}
              fill="#FFF176"
              opacity={p.opacity}
            />
          </g>
        ))}

        {/* Direction arrow */}
        <polygon
          points="615,148 628,155 615,162"
          fill={COLORS.secondary}
          opacity={0.6 + Math.sin(wavePhase * 2) * 0.3}
        />

        {/* Earth */}
        <circle cx="655" cy="155" r="38" fill="url(#earthGrad)" />
        <circle cx="655" cy="155" r="42" fill="url(#earthAtmo)" />
        {/* Simple continent shapes */}
        <ellipse
          cx="648"
          cy="145"
          rx="12"
          ry="8"
          fill="#66BB6A"
          opacity="0.4"
        />
        <ellipse
          cx="665"
          cy="162"
          rx="8"
          ry="10"
          fill="#66BB6A"
          opacity="0.35"
        />
        <text
          x="655"
          y="160"
          textAnchor="middle"
          fill="#fff"
          fontWeight="700"
          fontSize="12"
          fontFamily="Poppins, sans-serif"
        >
          Earth
        </text>

        {/* Bottom label */}
        <text
          x="370"
          y="275"
          textAnchor="middle"
          fill={COLORS.secondary}
          fontSize="13"
          fontWeight="600"
          fontFamily="Poppins, sans-serif"
        >
          Heat waves travel through empty space — no medium needed!
        </text>
        <rect
          x="180"
          y="283"
          width="380"
          height="1"
          rx="1"
          fill={COLORS.secondary}
          opacity="0.2"
        />
      </svg>
    );
  };

  // Fireplace radiation scene — multi-layered fire with embers
  const renderFireplaceScene = () => {
    // Generate ember particles
    const embers = Array.from({ length: 6 }, (_, i) => {
      const cycle = ((wavePhase * 0.5 + i * 0.4) % 3) / 3;
      const x =
        340 +
        Math.sin(wavePhase * 1.5 + i * 2.3) * 20 +
        (i % 2 === 0 ? -10 : 10);
      const y = 200 - cycle * 80;
      const opacity = Math.max(0, (1 - cycle) * 0.8);
      const size = 1.5 + (1 - cycle) * 1.5;
      return { x, y, opacity, size };
    });

    // Radiation ring opacity pulsing
    const ringPulse = (i: number) => {
      const phase = (wavePhase * 0.6 + i * 0.8) % (Math.PI * 2);
      return 0.08 + Math.sin(phase) * 0.06;
    };

    return (
      <svg
        width="100%"
        height="290"
        viewBox="0 0 700 290"
        style={{ overflow: "visible" }}
      >
        <defs>
          <radialGradient id="fireGradOuter" cx="50%" cy="80%" r="50%">
            <stop offset="0%" stopColor="#FF9800" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#E65100" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#BF360C" stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id="fireGradMiddle" cx="50%" cy="75%" r="50%">
            <stop offset="0%" stopColor="#FFEB3B" />
            <stop offset="50%" stopColor="#FF9800" />
            <stop offset="100%" stopColor="#F4511E" stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id="fireGradInner" cx="50%" cy="70%" r="50%">
            <stop offset="0%" stopColor="#FFFDE7" />
            <stop offset="40%" stopColor="#FFF9C4" />
            <stop offset="100%" stopColor="#FFD54F" stopOpacity="0.5" />
          </radialGradient>
          <radialGradient id="fireGlow" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#FF6F00" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FF6F00" stopOpacity="0" />
          </radialGradient>
          <filter id="fireBlur">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Title */}
        <text
          x="350"
          y="22"
          textAnchor="middle"
          fill={COLORS.secondary}
          fontWeight="600"
          fontSize="13"
          fontFamily="Poppins, sans-serif"
        >
          Heat radiates in ALL directions from the fire
        </text>

        {/* Fireplace structure */}
        <rect x="290" y="140" width="120" height="110" rx="6" fill="#4E342E" />
        <rect x="295" y="135" width="110" height="8" rx="3" fill="#5D4037" />
        <rect x="300" y="150" width="100" height="95" rx="3" fill="#2C1A0E" />
        {/* Log */}
        <ellipse cx="350" cy="240" rx="30" ry="6" fill="#4E342E" />
        <ellipse cx="340" cy="237" rx="25" ry="5" fill="#3E2723" />

        {/* Fire glow behind */}
        <circle cx="350" cy="200" r="55" fill="url(#fireGlow)" />

        {/* Fire layers — each with unique flicker animation */}
        <ellipse
          cx="350"
          cy="205"
          rx="32"
          ry="48"
          fill="url(#fireGradOuter)"
          filter="url(#fireBlur)"
          style={{
            animation: "fireFlicker1 1.2s ease-in-out infinite",
            transformOrigin: "350px 245px",
          }}
        />
        <ellipse
          cx="350"
          cy="208"
          rx="24"
          ry="38"
          fill="url(#fireGradMiddle)"
          style={{
            animation: "fireFlicker2 0.9s ease-in-out infinite 0.15s",
            transformOrigin: "350px 245px",
          }}
        />
        <ellipse
          cx="350"
          cy="212"
          rx="14"
          ry="26"
          fill="url(#fireGradInner)"
          style={{
            animation: "fireFlicker3 0.7s ease-in-out infinite 0.3s",
            transformOrigin: "350px 245px",
          }}
        />
        {/* Bright core */}
        <ellipse
          cx="350"
          cy="222"
          rx="8"
          ry="10"
          fill="#FFFDE7"
          opacity={0.5 + Math.sin(wavePhase * 6) * 0.2}
        />

        {/* Embers floating up */}
        {embers.map((e, i) => (
          <circle
            key={i}
            cx={e.x}
            cy={e.y}
            r={e.size}
            fill={i % 2 === 0 ? "#FF6F00" : "#FFAB40"}
            opacity={e.opacity}
          />
        ))}

        {/* Radiation rings — smooth expanding circles */}
        {[1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            cx="350"
            cy="200"
            r={60 + i * 45}
            fill="none"
            stroke={COLORS.heatWave2}
            strokeWidth={1.5 - i * 0.2}
            strokeDasharray="4 8"
            opacity={ringPulse(i)}
            style={{
              animation: `radiateOut ${3 + i * 0.8}s ease-out infinite ${i * 0.7}s`,
              transformOrigin: "350px 200px",
            }}
          />
        ))}

        {/* Wavy heat lines to Pema */}
        <path
          d={generateWavePath(270, 155, 190, 6, 2.5, 0.5)}
          fill="none"
          stroke={COLORS.heatWave2}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* Wavy heat lines to Palden */}
        <path
          d={generateWavePath(430, 555, 190, 6, 2.5, 3.0)}
          fill="none"
          stroke={COLORS.heatWave2}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Person left — Pema */}
        <g
          style={{
            animation: "fadeInLeft 0.8s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          <circle cx="120" cy="175" r="18" fill={COLORS.lightPrimary} />
          <rect
            x="108"
            y="195"
            width="24"
            height="40"
            rx="8"
            fill={COLORS.primary}
          />
          <text x="120" y="180" textAnchor="middle" fontSize="13">
            😊
          </text>
          <text
            x="120"
            y="260"
            textAnchor="middle"
            fill={COLORS.dark}
            fontSize="11"
            fontWeight="500"
            fontFamily="Poppins, sans-serif"
          >
            Pema
          </text>
          {/* Warmth indicator */}
          <text
            x="120"
            y="150"
            textAnchor="middle"
            fontSize="10"
            fontFamily="Poppins, sans-serif"
            fill={COLORS.heatWave1}
            style={{ animation: "gentleBob 2s ease-in-out infinite" }}
          >
            feels warm!
          </text>
        </g>

        {/* Person right — Palden */}
        <g
          style={{
            animation: "fadeInRight 0.8s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          <circle cx="580" cy="175" r="18" fill={COLORS.lightSecondary} />
          <rect
            x="568"
            y="195"
            width="24"
            height="40"
            rx="8"
            fill={COLORS.secondary}
          />
          <text x="580" y="180" textAnchor="middle" fontSize="13">
            😊
          </text>
          <text
            x="580"
            y="260"
            textAnchor="middle"
            fill={COLORS.dark}
            fontSize="11"
            fontWeight="500"
            fontFamily="Poppins, sans-serif"
          >
            Palden
          </text>
          <text
            x="580"
            y="150"
            textAnchor="middle"
            fontSize="10"
            fontFamily="Poppins, sans-serif"
            fill={COLORS.heatWave1}
            style={{ animation: "gentleBob 2s ease-in-out infinite 0.5s" }}
          >
            feels warm!
          </text>
        </g>
      </svg>
    );
  };

  // Hot object cooling scene — smooth heat shimmer waves
  const renderHotObjectScene = () => {
    // Rising heat wave paths
    const heatWaves = Array.from({ length: 5 }, (_, i) => {
      const baseX = 310 + i * 22;
      const cycle = ((wavePhase * 0.6 + i * 0.5) % 2.5) / 2.5;
      const yStart = 115;
      const yEnd = yStart - cycle * 70;
      const opacity = Math.max(0, (1 - cycle * 1.2) * 0.55);
      const xWobble = Math.sin(wavePhase * 2 + i * 1.8) * 6;
      // Build a small wavy path
      const path = `M ${baseX},${yStart} Q ${baseX + xWobble},${(yStart + yEnd) / 2} ${baseX - xWobble * 0.5},${yEnd}`;
      return { path, opacity };
    });

    // Radiation arrows outward
    const arrows = [0, 40, 80, 120, 160, 200].map((angle, i) => {
      const rad = ((angle - 10) * Math.PI) / 180;
      const cx = 350,
        cy = 130;
      const innerR = 90;
      const outerR = 90 + 55;
      const pulse = 0.3 + Math.sin(wavePhase * 1.5 + i * 1.1) * 0.2;
      return {
        x1: cx + Math.cos(rad) * innerR * 0.38,
        y1: cy - Math.sin(rad) * innerR * 0.14,
        x2: cx + Math.cos(rad) * outerR * 0.38,
        y2: cy - Math.sin(rad) * outerR * 0.35,
        opacity: pulse,
      };
    });

    return (
      <svg
        width="100%"
        height="270"
        viewBox="0 0 700 270"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="panGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="100%" stopColor="#C62828" />
          </linearGradient>
          <linearGradient id="panShine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF8A65" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#FFCCBC" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF8A65" stopOpacity="0.4" />
          </linearGradient>
          <filter id="heatGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Hot pan glow */}
        <ellipse
          cx="350"
          cy="140"
          rx="95"
          ry="30"
          fill="#FF6B35"
          opacity="0.08"
        />

        {/* Hot pan body */}
        <rect
          x="270"
          y="122"
          width="160"
          height="22"
          rx="4"
          fill="url(#panGrad)"
          filter="url(#heatGlow)"
        />
        <rect
          x="270"
          y="122"
          width="160"
          height="10"
          rx="4"
          fill="url(#panShine)"
        />
        {/* Handle */}
        <rect x="430" y="125" width="70" height="10" rx="5" fill="#6D4C41" />
        <rect
          x="430"
          y="127"
          width="70"
          height="4"
          rx="2"
          fill="#8D6E63"
          opacity="0.5"
        />
        {/* Pan bottom curve */}
        <ellipse
          cx="350"
          cy="144"
          rx="80"
          ry="14"
          fill="#D84315"
          opacity="0.5"
        />

        <text
          x="350"
          y="105"
          textAnchor="middle"
          fill={COLORS.fireRed}
          fontSize="12"
          fontWeight="600"
          fontFamily="Poppins, sans-serif"
        >
          🔥 Hot Utensil
        </text>

        {/* Rising heat shimmer waves */}
        {heatWaves.map((w, i) => (
          <path
            key={i}
            d={w.path}
            fill="none"
            stroke={COLORS.heatWave2}
            strokeWidth="2"
            strokeLinecap="round"
            opacity={w.opacity}
          />
        ))}

        {/* Radiation arrows spreading outward */}
        {arrows.map((a, i) => (
          <line
            key={i}
            x1={a.x1}
            y1={a.y1}
            x2={a.x2}
            y2={a.y2}
            stroke={COLORS.heatWave1}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="5 4"
            opacity={a.opacity}
          />
        ))}

        {/* Temperature indicator */}
        <g
          style={{
            animation: "fadeInUp 0.8s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          <rect
            x="285"
            y="175"
            width="130"
            height="28"
            rx="14"
            fill={COLORS.lightSecondary}
          />
          <text
            x="350"
            y="194"
            textAnchor="middle"
            fill={COLORS.secondary}
            fontSize="11"
            fontWeight="600"
            fontFamily="Poppins, sans-serif"
          >
            Radiating heat → Cooling
          </text>
        </g>

        <text
          x="350"
          y="230"
          textAnchor="middle"
          fill={COLORS.dark}
          fontSize="12"
          fontFamily="Poppins, sans-serif"
        >
          Hot objects radiate heat and cool down over time
        </text>
        <text
          x="350"
          y="250"
          textAnchor="middle"
          fill={COLORS.gray}
          fontSize="11"
          fontFamily="Poppins, sans-serif"
        >
          The hotter the object, the more heat it radiates
        </text>
      </svg>
    );
  };

  // Comparison scene (conduction vs convection vs radiation) — smooth cascading cards
  const renderComparisonScene = () => (
    <div
      style={{
        display: "flex",
        gap: "16px",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {[
        {
          title: "Conduction",
          icon: "🥄",
          desc: "Through solids",
          medium: "Needs solid medium",
          color: COLORS.primary,
          bg: COLORS.lightPrimary,
          example: "e.g. hot spoon",
        },
        {
          title: "Convection",
          icon: "💨",
          desc: "Through fluids",
          medium: "Needs liquid/gas",
          color: COLORS.gradientStart,
          bg: "#E8DEF8",
          example: "e.g. boiling water",
        },
        {
          title: "Radiation",
          icon: "☀️",
          desc: "Through space!",
          medium: "NO medium needed!",
          color: COLORS.secondary,
          bg: COLORS.lightSecondary,
          example: "e.g. sunlight",
        },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            background: item.bg,
            borderRadius: "18px",
            padding: "22px 18px",
            width: "185px",
            textAlign: "center",
            border:
              i === 2
                ? `2.5px solid ${COLORS.secondary}`
                : "2px solid transparent",
            animation: `popIn 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 0.18}s both`,
            boxShadow:
              i === 2
                ? `0 6px 24px rgba(255,114,18,0.2)`
                : "0 2px 10px rgba(0,0,0,0.06)",
            transition:
              "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease",
            position: "relative" as const,
            overflow: "hidden",
          }}
        >
          {i === 2 && (
            <div
              style={{
                position: "absolute",
                top: "-1px",
                right: "16px",
                background: COLORS.secondary,
                color: "#fff",
                fontSize: "9px",
                fontWeight: 700,
                fontFamily: "Poppins, sans-serif",
                padding: "3px 10px",
                borderRadius: "0 0 8px 8px",
                letterSpacing: "0.5px",
              }}
            >
              TODAY'S TOPIC
            </div>
          )}
          <div
            style={{
              fontSize: "40px",
              marginBottom: "10px",
              animation: `bounceIn 0.6s ease ${0.4 + i * 0.15}s both`,
            }}
          >
            {item.icon}
          </div>
          <div
            style={{
              fontWeight: 700,
              fontSize: "15px",
              color: item.color,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {item.title}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: COLORS.dark,
              marginTop: "4px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {item.desc}
          </div>
          <div
            style={{
              fontSize: "10px",
              color: COLORS.gray,
              marginTop: "2px",
              fontFamily: "Poppins, sans-serif",
              fontStyle: "italic",
            }}
          >
            {item.example}
          </div>
          <div
            style={{
              marginTop: "12px",
              padding: "7px 12px",
              borderRadius: "20px",
              background: i === 2 ? COLORS.secondary : item.color,
              color: "#fff",
              fontSize: "11px",
              fontWeight: 600,
              fontFamily: "Poppins, sans-serif",
              animation: `fadeInUp 0.5s ease ${0.6 + i * 0.15}s both`,
            }}
          >
            {item.medium}
          </div>
        </div>
      ))}
    </div>
  );

  // Clothing colour scene — SVG animated with radiation arrows
  const renderClothingScene = () => (
    <svg
      width="100%"
      height="280"
      viewBox="0 0 600 280"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="sunRayGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>
      </defs>

      {/* Sun at top center */}
      <g style={{ animation: "sunPulse 3.5s ease-in-out infinite" }}>
        <circle cx="300" cy="35" r="22" fill="#FFB300" />
        <circle cx="300" cy="35" r="30" fill="#FFB300" opacity="0.15" />
        <text
          x="300"
          y="40"
          textAnchor="middle"
          fill="#fff"
          fontSize="14"
          fontWeight="700"
          fontFamily="Poppins, sans-serif"
        >
          ☀️
        </text>
      </g>

      {/* ====== LIGHT CLOTHES (LEFT) ====== */}
      <g
        style={{
          animation: "fadeInLeft 0.8s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        {/* T-shirt shape */}
        <rect
          x="90"
          y="115"
          width="100"
          height="110"
          rx="14"
          fill="#F5F5F5"
          stroke="#E0E0E0"
          strokeWidth="2"
        />
        <rect
          x="110"
          y="100"
          width="60"
          height="25"
          rx="8"
          fill="#FAFAFA"
          stroke="#E0E0E0"
          strokeWidth="1.5"
        />
        <text x="140" y="177" textAnchor="middle" fontSize="36">
          👕
        </text>

        {/* Incoming rays */}
        {[0, 1, 2].map((i) => {
          const startX = 260 - i * 10;
          const startY = 60 + i * 8;
          const endX = 190;
          const endY = 120 + i * 20;
          const opacity = 0.4 + Math.sin(wavePhase * 1.5 + i) * 0.15;
          return (
            <line
              key={`in-${i}`}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="url(#sunRayGrad)"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity={opacity}
            />
          );
        })}

        {/* Reflected rays bouncing back */}
        {[0, 1, 2].map((i) => {
          const startX = 190;
          const startY = 120 + i * 20;
          const endX = 100 - i * 15;
          const endY = 80 + i * 10;
          const opacity = 0.3 + Math.sin(wavePhase * 1.8 + i * 1.2) * 0.2;
          return (
            <g key={`ref-${i}`}>
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="#81C784"
                strokeWidth="2"
                strokeDasharray="5 5"
                opacity={opacity}
              />
              <circle
                cx={endX}
                cy={endY}
                r="2.5"
                fill="#66BB6A"
                opacity={opacity}
              />
            </g>
          );
        })}

        {/* Labels */}
        <text
          x="140"
          y="248"
          textAnchor="middle"
          fill={COLORS.primary}
          fontSize="14"
          fontWeight="700"
          fontFamily="Poppins, sans-serif"
        >
          Light Clothes
        </text>
        <text
          x="140"
          y="266"
          textAnchor="middle"
          fill={COLORS.success}
          fontSize="11"
          fontFamily="Poppins, sans-serif"
        >
          Reflects heat → Cool in summer ☀️
        </text>
        {/* Reflect badge */}
        <rect
          x="70"
          y="85"
          width="65"
          height="20"
          rx="10"
          fill="#E8F5E9"
          stroke="#81C784"
          strokeWidth="1"
          style={{ animation: "gentleBob 2.5s ease-in-out infinite" }}
        />
        <text
          x="102"
          y="99"
          textAnchor="middle"
          fill="#2E7D32"
          fontSize="9"
          fontWeight="600"
          fontFamily="Poppins, sans-serif"
        >
          REFLECTS ↗
        </text>
      </g>

      {/* VS divider */}
      <text
        x="300"
        y="175"
        textAnchor="middle"
        fill={COLORS.gray}
        fontSize="18"
        fontWeight="700"
        fontFamily="Poppins, sans-serif"
      >
        VS
      </text>
      <line
        x1="300"
        y1="110"
        x2="300"
        y2="150"
        stroke={COLORS.lightGray}
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <line
        x1="300"
        y1="190"
        x2="300"
        y2="230"
        stroke={COLORS.lightGray}
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />

      {/* ====== DARK CLOTHES (RIGHT) ====== */}
      <g
        style={{
          animation: "fadeInRight 0.8s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        {/* Jacket shape */}
        <rect
          x="410"
          y="115"
          width="100"
          height="110"
          rx="14"
          fill="#333"
          stroke="#555"
          strokeWidth="2"
        />
        <rect
          x="430"
          y="100"
          width="60"
          height="25"
          rx="8"
          fill="#2C2C2C"
          stroke="#555"
          strokeWidth="1.5"
        />
        <text x="460" y="177" textAnchor="middle" fontSize="36">
          🧥
        </text>

        {/* Incoming rays */}
        {[0, 1, 2].map((i) => {
          const startX = 340 + i * 10;
          const startY = 60 + i * 8;
          const endX = 410;
          const endY = 120 + i * 20;
          const opacity = 0.4 + Math.sin(wavePhase * 1.5 + i) * 0.15;
          return (
            <line
              key={`in2-${i}`}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="url(#sunRayGrad)"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity={opacity}
            />
          );
        })}

        {/* Absorbed — rays going INTO the dark surface (arrows pointing inward) */}
        {[0, 1, 2].map((i) => {
          const x = 410;
          const y = 125 + i * 20;
          const glowR = 6 + Math.sin(wavePhase * 2 + i * 1.5) * 3;
          return (
            <circle
              key={`abs-${i}`}
              cx={x + 15}
              cy={y + 5}
              r={glowR}
              fill="#FF6F00"
              opacity={0.15 + Math.sin(wavePhase * 2 + i) * 0.08}
            />
          );
        })}

        {/* Labels */}
        <text
          x="460"
          y="248"
          textAnchor="middle"
          fill={COLORS.secondary}
          fontSize="14"
          fontWeight="700"
          fontFamily="Poppins, sans-serif"
        >
          Dark Clothes
        </text>
        <text
          x="460"
          y="266"
          textAnchor="middle"
          fill={COLORS.fireRed}
          fontSize="11"
          fontFamily="Poppins, sans-serif"
        >
          Absorbs heat → Warm in winter ❄️
        </text>
        {/* Absorb badge */}
        <rect
          x="470"
          y="85"
          width="65"
          height="20"
          rx="10"
          fill="#FFF3E0"
          stroke="#FFB74D"
          strokeWidth="1"
          style={{ animation: "gentleBob 2.5s ease-in-out infinite 0.5s" }}
        />
        <text
          x="502"
          y="99"
          textAnchor="middle"
          fill="#E65100"
          fontSize="9"
          fontWeight="600"
          fontFamily="Poppins, sans-serif"
        >
          ABSORBS ↘
        </text>
      </g>
    </svg>
  );

  // ==================== HANDS-ON EXPERIMENTS ====================

  const renderColorExperiment = () => {
    const darkness = sliderValue / 100;
    const absorbedPercent = Math.round(darkness * 90 + 10);
    const reflectedPercent = 100 - absorbedPercent;
    const surfaceColor = `rgb(${Math.round(255 * (1 - darkness))}, ${Math.round(255 * (1 - darkness))}, ${Math.round(255 * (1 - darkness))})`;

    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          {/* Sun */}
          <div style={{ animation: "sunPulse 2s ease-in-out infinite" }}>
            <IconSun />
            <div
              style={{
                fontSize: "11px",
                color: COLORS.sunOrange,
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
              }}
            >
              Radiation
            </div>
          </div>
          {/* Arrows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div
              style={{
                fontSize: "11px",
                color: COLORS.success,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              ↗ Reflected: {reflectedPercent}%
            </div>
            <div style={{ fontSize: "20px" }}>→→→</div>
            <div
              style={{
                fontSize: "11px",
                color: COLORS.fireRed,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              ↘ Absorbed: {absorbedPercent}%
            </div>
          </div>
          {/* Surface */}
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "16px",
              background: surfaceColor,
              border: "3px solid " + COLORS.lightGray,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: `0 0 ${absorbedPercent / 3}px rgba(255,107,53,${darkness})`,
              transition: "all 0.3s ease",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: darkness > 0.5 ? "#fff" : "#333",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {darkness > 0.5 ? "🔥 Hot!" : "❄️ Cool"}
            </span>
          </div>
        </div>
        {/* Slider */}
        <div style={{ maxWidth: "350px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              color: COLORS.dark,
              fontFamily: "Poppins, sans-serif",
              marginBottom: "6px",
            }}
          >
            <span>Light Surface</span>
            <span>Dark Surface</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: COLORS.secondary,
              cursor: "pointer",
            }}
          />
        </div>
        {/* Bars */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "16px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "60px",
                height: `${absorbedPercent}px`,
                maxHeight: "90px",
                background: `linear-gradient(180deg, ${COLORS.heatWave1}, ${COLORS.fireRed})`,
                borderRadius: "8px 8px 0 0",
                transition: "height 0.4s ease",
              }}
            />
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: COLORS.fireRed,
                fontFamily: "Poppins, sans-serif",
                marginTop: "4px",
              }}
            >
              Absorbed
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "60px",
                height: `${reflectedPercent}px`,
                maxHeight: "90px",
                background: `linear-gradient(180deg, #81C784, ${COLORS.success})`,
                borderRadius: "8px 8px 0 0",
                transition: "height 0.4s ease",
              }}
            />
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: COLORS.success,
                fontFamily: "Poppins, sans-serif",
                marginTop: "4px",
              }}
            >
              Reflected
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDistanceExperiment = () => {
    const normalizedDist = distanceValue / 100;
    const heatFelt = Math.round(
      Math.max(5, 100 * Math.pow(1 - normalizedDist, 2)),
    );
    const personX = 120 + normalizedDist * 400;

    return (
      <div style={{ textAlign: "center" }}>
        <svg width="100%" height="200" viewBox="0 0 650 200">
          <defs>
            <radialGradient id="fireGrad" cx="50%" cy="70%" r="50%">
              <stop offset="0%" stopColor="#FFEB3B" />
              <stop offset="40%" stopColor="#FF9800" />
              <stop offset="100%" stopColor="#E53935" />
            </radialGradient>
          </defs>
          {/* Fire */}
          <ellipse
            cx="80"
            cy="120"
            rx="30"
            ry="40"
            fill="url(#fireGrad)"
            style={{
              animation: "fireFlicker1 0.9s ease-in-out infinite",
              transformOrigin: "80px 160px",
            }}
          />
          <text
            x="80"
            y="180"
            textAnchor="middle"
            fill={COLORS.dark}
            fontSize="11"
            fontFamily="Poppins, sans-serif"
          >
            🔥 Fire
          </text>
          {/* Radiation lines */}
          {[0, 1, 2].map((i) => (
            <line
              key={i}
              x1="115"
              y1={110 + i * 10}
              x2={personX - 20}
              y2={110 + i * 10}
              stroke={COLORS.heatWave2}
              strokeWidth="2"
              strokeDasharray="8 5"
              opacity={Math.max(0.1, 0.7 - normalizedDist * 0.6)}
              style={{ transition: "all 0.3s ease" }}
            />
          ))}
          {/* Person */}
          <g
            style={{ transition: "transform 0.3s ease" }}
            transform={`translate(${personX}, 100)`}
          >
            <circle r="18" fill={COLORS.lightPrimary} />
            <text textAnchor="middle" y="5" fontSize="14">
              {heatFelt > 60 ? "🥵" : heatFelt > 30 ? "😊" : "🥶"}
            </text>
            <text
              y="40"
              textAnchor="middle"
              fill={COLORS.dark}
              fontSize="11"
              fontFamily="Poppins, sans-serif"
            >
              Person
            </text>
          </g>
        </svg>
        {/* Heat meter */}
        <div style={{ maxWidth: "350px", margin: "0 auto", marginTop: "4px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              color: COLORS.dark,
              fontFamily: "Poppins, sans-serif",
              marginBottom: "4px",
            }}
          >
            <span>🔥 Close</span>
            <span>Far Away ❄️</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={distanceValue}
            onChange={(e) => setDistanceValue(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: COLORS.secondary,
              cursor: "pointer",
            }}
          />
        </div>
        <div
          style={{
            marginTop: "12px",
            padding: "10px 20px",
            borderRadius: "12px",
            background: `linear-gradient(90deg, ${COLORS.fireRed} ${heatFelt}%, ${COLORS.lightGray} ${heatFelt}%)`,
            display: "inline-block",
            transition: "background 0.3s ease",
          }}
        >
          <span
            style={{
              fontWeight: 700,
              color: "#fff",
              fontSize: "14px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Heat felt: {heatFelt}%
          </span>
        </div>
      </div>
    );
  };

  // ==================== SCENE RENDERER ====================

  const renderScene = () => {
    if (!currentStep) return null;
    const { data, mode } = currentStep;

    if (mode === "learn") {
      switch (data?.scene) {
        case "sun_earth":
          return renderSunEarthScene();
        case "fireplace":
          return renderFireplaceScene();
        case "hot_object":
          return renderHotObjectScene();
        case "comparison":
          return renderComparisonScene();
        case "clothing":
          return renderClothingScene();
        default:
          // Intro scene
          return (
            <div style={{ textAlign: "center", padding: "16px" }}>
              <svg
                width="220"
                height="220"
                viewBox="0 0 220 220"
                style={{ overflow: "visible" }}
              >
                <defs>
                  <radialGradient id="introSun" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFDE7" />
                    <stop offset="25%" stopColor="#FFF176" />
                    <stop offset="55%" stopColor="#FFB300" />
                    <stop offset="80%" stopColor="#FF8F00" />
                    <stop offset="100%" stopColor="#E65100" />
                  </radialGradient>
                  <radialGradient id="introGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFB300" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#FF6F00" stopOpacity="0" />
                  </radialGradient>
                  <filter id="introSunGlow">
                    <feGaussianBlur stdDeviation="5" result="b1" />
                    <feGaussianBlur stdDeviation="12" result="b2" />
                    <feMerge>
                      <feMergeNode in="b2" />
                      <feMergeNode in="b1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Background glow */}
                <circle
                  cx="110"
                  cy="110"
                  r="100"
                  fill="url(#introGlow)"
                  style={{ animation: "coronaPulse 3.5s ease-in-out infinite" }}
                />

                {/* Sun */}
                <g style={{ animation: "sunPulse 3.5s ease-in-out infinite" }}>
                  <circle
                    cx="110"
                    cy="110"
                    r="45"
                    fill="url(#introSun)"
                    filter="url(#introSunGlow)"
                  />
                </g>

                {/* Animated rays */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  const pulse = 0.5 + Math.sin(wavePhase * 1.5 + i * 0.8) * 0.3;
                  const innerR = 55;
                  const outerR = 78 + Math.sin(wavePhase * 2 + i * 1.1) * 6;
                  return (
                    <line
                      key={i}
                      x1={110 + Math.cos(rad) * innerR}
                      y1={110 + Math.sin(rad) * innerR}
                      x2={110 + Math.cos(rad) * outerR}
                      y2={110 + Math.sin(rad) * outerR}
                      stroke="#FFB300"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity={pulse}
                    />
                  );
                })}

                {/* Radiation rings expanding */}
                {[1, 2, 3].map((i) => (
                  <circle
                    key={i}
                    cx="110"
                    cy="110"
                    r={50 + i * 22}
                    fill="none"
                    stroke="#FFB300"
                    strokeWidth={1.2 - i * 0.2}
                    strokeDasharray="3 6"
                    opacity={0.15 / i}
                    style={{
                      animation: `radiateOut ${2.5 + i * 0.8}s ease-out infinite ${i * 0.6}s`,
                      transformOrigin: "110px 110px",
                    }}
                  />
                ))}
              </svg>
              <div
                style={{
                  color: COLORS.secondary,
                  fontWeight: 700,
                  fontSize: "16px",
                  fontFamily: "Poppins, sans-serif",
                  marginTop: "6px",
                  animation:
                    "fadeInUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both",
                }}
              >
                ✨ Radiation — Heat without a medium!
              </div>
            </div>
          );
      }
    }

    if (mode === "practice") {
      return (
        <div style={{ padding: "10px 0" }}>
          <div
            style={{
              background: COLORS.lightSecondary,
              borderRadius: "16px",
              padding: "18px 22px",
              marginBottom: "16px",
              fontWeight: 600,
              color: COLORS.dark,
              fontSize: "15px",
              fontFamily: "Poppins, sans-serif",
              animation: "slideInScale 0.5s ease both",
            }}
          >
            ❓ {data?.question}
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {data?.options?.map((opt: string, idx: number) => {
              const isCorrect = idx === data.answer;
              const isSelected = idx === selectedAnswer;
              let bg = COLORS.white;
              let border = `2px solid ${COLORS.lightGray}`;
              let textColor = COLORS.dark;
              if (showResult && isSelected && isCorrect) {
                bg = "#E8F5E9";
                border = `2px solid ${COLORS.success}`;
                textColor = COLORS.success;
              } else if (showResult && isSelected && !isCorrect) {
                bg = "#FFEBEE";
                border = `2px solid ${COLORS.error}`;
                textColor = COLORS.error;
              } else if (showResult && isCorrect) {
                bg = "#E8F5E9";
                border = `2px solid ${COLORS.success}`;
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  onMouseEnter={() => setHoverBtn(`opt-${idx}`)}
                  onMouseLeave={() => setHoverBtn(null)}
                  style={{
                    background: bg,
                    border,
                    borderRadius: "12px",
                    padding: "14px 18px",
                    textAlign: "left",
                    cursor: showResult ? "default" : "pointer",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    color: textColor,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transform:
                      hoverBtn === `opt-${idx}` && !showResult
                        ? "scale(1.02)"
                        : "scale(1)",
                    boxShadow:
                      hoverBtn === `opt-${idx}` && !showResult
                        ? "0 4px 14px rgba(0,0,0,0.1)"
                        : "0 1px 4px rgba(0,0,0,0.04)",
                    transition: "all 0.25s ease",
                    animation: `fadeInUp 0.4s ease ${idx * 0.1}s both`,
                  }}
                >
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        showResult && isCorrect
                          ? COLORS.success
                          : showResult && isSelected
                            ? COLORS.error
                            : COLORS.lightPrimary,
                      color:
                        showResult && (isCorrect || isSelected)
                          ? "#fff"
                          : COLORS.primary,
                      fontWeight: 700,
                      fontSize: "12px",
                      flexShrink: 0,
                    }}
                  >
                    {showResult && isSelected && isCorrect ? (
                      <IconCheck />
                    ) : showResult && isSelected ? (
                      <IconX />
                    ) : (
                      String.fromCharCode(65 + idx)
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
                marginTop: "14px",
                padding: "14px 18px",
                borderRadius: "12px",
                background:
                  selectedAnswer === data?.answer ? "#E8F5E9" : "#FFF3E0",
                border: `1.5px solid ${selectedAnswer === data?.answer ? COLORS.success : COLORS.secondary}`,
                animation: "slideInScale 0.4s ease both",
                fontFamily: "Poppins, sans-serif",
                fontSize: "13px",
                color: COLORS.dark,
              }}
            >
              <strong>
                {selectedAnswer === data?.answer
                  ? "✅ Correct!"
                  : "💡 Not quite!"}
              </strong>
              <br />
              {data?.explanation}
            </div>
          )}
        </div>
      );
    }

    if (mode === "real_world") {
      const scenarios: Record<
        string,
        { icon: string; visual: React.ReactNode }
      > = {
        campfire: {
          icon: "🏕️",
          visual: (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                flexWrap: "wrap",
                animation: "fadeInUp 0.6s ease both",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "16px",
                  background: "#FFF8E1",
                  borderRadius: "16px",
                  width: "280px",
                }}
              >
                <div
                  style={{
                    fontSize: "60px",
                    animation: "fireFlicker1 1.2s ease-in-out infinite",
                  }}
                >
                  🔥
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: COLORS.dark,
                    fontFamily: "Poppins, sans-serif",
                    marginTop: "8px",
                  }}
                >
                  The closer you are, the warmer you feel! Radiation weakens
                  with distance.
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                    marginTop: "12px",
                  }}
                >
                  {["🥵 Close", "😊 Medium", "🥶 Far"].map((label, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "11px",
                        fontFamily: "Poppins, sans-serif",
                        color: COLORS.dark,
                        animation: `popIn 0.5s ease ${0.3 + i * 0.2}s both`,
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ),
        },
        solar_heater: {
          icon: "☀️",
          visual: (
            <div
              style={{
                textAlign: "center",
                animation: "fadeInUp 0.6s ease both",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    fontSize: "50px",
                    animation: "sunPulse 2s ease-in-out infinite",
                  }}
                >
                  ☀️
                </div>
                <div style={{ fontSize: "24px" }}>→→→</div>
                <div
                  style={{
                    width: "100px",
                    height: "80px",
                    background: "linear-gradient(135deg, #1a1a1a, #333)",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 0 12px rgba(255,107,53,0.4)",
                    animation: "glow 2s ease-in-out infinite",
                  }}
                >
                  <span
                    style={{
                      color: "#fff",
                      fontSize: "12px",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Dark Panel
                  </span>
                </div>
                <div style={{ fontSize: "20px" }}>→</div>
                <div style={{ fontSize: "40px" }}>🚿</div>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: COLORS.dark,
                  fontFamily: "Poppins, sans-serif",
                  marginTop: "12px",
                }}
              >
                Dark panels absorb radiation → Heats water → Hot water for your
                home!
              </div>
            </div>
          ),
        },
        thermos: {
          icon: "🧴",
          visual: (
            <div
              style={{
                textAlign: "center",
                animation: "fadeInUp 0.6s ease both",
              }}
            >
              <div style={{ display: "inline-block", position: "relative" }}>
                <div
                  style={{
                    width: "80px",
                    height: "140px",
                    background: "linear-gradient(135deg, #B0BEC5, #CFD8DC)",
                    borderRadius: "10px",
                    margin: "0 auto",
                    border: "3px solid #90A4AE",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: "8px",
                      background: "linear-gradient(135deg, #E0E0E0, #F5F5F5)",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontFamily: "Poppins, sans-serif",
                        color: COLORS.dark,
                        fontWeight: 600,
                      }}
                    >
                      Mirror
                      <br />
                      Walls
                    </span>
                  </div>
                </div>
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: 30 + i * 30,
                      right: -35,
                      fontSize: "11px",
                      color: COLORS.secondary,
                      fontFamily: "Poppins, sans-serif",
                      animation: `fadeInRight 0.5s ease ${i * 0.3}s both`,
                    }}
                  >
                    ↗ Reflects!
                  </div>
                ))}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: COLORS.dark,
                  fontFamily: "Poppins, sans-serif",
                  marginTop: "14px",
                }}
              >
                Shiny mirror walls <strong>reflect radiation</strong> to keep
                drinks hot or cold!
              </div>
            </div>
          ),
        },
      };
      const sc = scenarios[data?.scenario || "campfire"] || scenarios.campfire;
      return sc.visual;
    }

    if (mode === "hands_on") {
      if (data?.experiment === "color_absorption")
        return renderColorExperiment();
      if (data?.experiment === "distance_effect")
        return renderDistanceExperiment();
    }

    return null;
  };

  // ==================== MODE LABELS ====================

  const modeInfo: Record<
    ModeType,
    { label: string; icon: React.ReactNode; color: string }
  > = {
    learn: { label: "Learn", icon: <IconBook />, color: COLORS.primary },
    practice: {
      label: "Practice",
      icon: <IconTarget />,
      color: COLORS.secondary,
    },
    real_world: {
      label: "Real World",
      icon: <IconGlobe />,
      color: COLORS.gradientStart,
    },
    hands_on: { label: "Hands On", icon: <IconFlask />, color: "#0097A7" },
  };

  // ==================== MAIN RENDER ====================

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: `${width}px`,
        minHeight: `${height}px`,
        fontFamily: "'Poppins', sans-serif",
        background: darkMode ? "#1a1a2e" : COLORS.white,
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow:
          "0 8px 40px rgba(74,77,201,0.10), 0 1.5px 6px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
        border: `1.5px solid ${darkMode ? "#333" : COLORS.lightGray}`,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.gradientStart}, ${COLORS.gradientEnd})`,
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ animation: "sunPulse 2.5s ease-in-out infinite" }}>
            <IconSun />
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "18px" }}>
              Radiation — Heat Transfer
            </div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>
              Chapter 7.3 • Grade 7 Science
            </div>
          </div>
        </div>
        {currentMode === "practice" && totalAttempted > 0 && (
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: "20px",
              padding: "6px 16px",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Score: {score}/{totalAttempted}
          </div>
        )}
      </div>

      {/* MODE SELECTOR */}
      {showModeSelector && (
        <div
          style={{
            display: "flex",
            gap: "6px",
            padding: "12px 20px",
            background: darkMode ? "#22223a" : COLORS.bgLight,
            borderBottom: `1px solid ${darkMode ? "#333" : COLORS.lightGray}`,
            overflowX: "auto",
          }}
        >
          {enabledModes.map((mode) => {
            const info = modeInfo[mode];
            const isActive = currentMode === mode;
            return (
              <button
                key={mode}
                onClick={() => switchMode(mode)}
                onMouseEnter={() => setHoverBtn(`mode-${mode}`)}
                onMouseLeave={() => setHoverBtn(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "none",
                  background: isActive ? info.color : "transparent",
                  color: isActive ? "#fff" : COLORS.dark,
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif",
                  cursor: "pointer",
                  transform:
                    hoverBtn === `mode-${mode}` ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.3s ease",
                  boxShadow: isActive ? `0 3px 12px ${info.color}44` : "none",
                  whiteSpace: "nowrap",
                }}
              >
                {info.icon}
                {info.label}
              </button>
            );
          })}
        </div>
      )}

      {/* CONTENT AREA */}
      <div
        key={animKey}
        style={{
          flex: 1,
          padding: "20px 24px",
          overflowY: "auto",
          animation: "slideInScale 0.5s ease both",
        }}
      >
        {/* Step title and description */}
        <div style={{ marginBottom: "16px" }}>
          <h3
            style={{
              margin: "0 0 8px 0",
              fontSize: "17px",
              fontWeight: 700,
              color: darkMode ? "#fff" : COLORS.dark,
              fontFamily: "Poppins, sans-serif",
              animation: "fadeInUp 0.5s ease both",
            }}
          >
            {currentStep?.title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              lineHeight: "1.65",
              color: darkMode ? "#ccc" : "#555",
              fontFamily: "Poppins, sans-serif",
              animation: "fadeInUp 0.5s ease 0.1s both",
            }}
          >
            {currentStep?.description}
          </p>
        </div>

        {/* Visual / Interactive scene */}
        <div
          style={{
            minHeight: "220px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: darkMode ? "#22223a" : COLORS.bgLight,
            borderRadius: "16px",
            padding: "16px",
            border: `1px solid ${darkMode ? "#333" : COLORS.lightGray}`,
          }}
        >
          {renderScene()}
        </div>
      </div>

      {/* NAVIGATION BAR */}
      {(showNavigation || showPlayPause || showStepIndicator) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            background: darkMode ? "#22223a" : COLORS.bgLight,
            borderTop: `1px solid ${darkMode ? "#333" : COLORS.lightGray}`,
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {/* Left: step indicator */}
          {showStepIndicator && (
            <div
              style={{
                fontSize: "12px",
                color: COLORS.gray,
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                minWidth: "80px",
              }}
            >
              Step {currentStepIndex + 1} of {modeSteps.length}
            </div>
          )}
          {/* Center: dots */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              justifyContent: "center",
              flex: 1,
            }}
          >
            {modeSteps.map((_, i) => (
              <div
                key={i}
                onClick={() => {
                  setCurrentStepIndex(i);
                  setAnimKey((k) => k + 1);
                  setSelectedAnswer(null);
                  setShowResult(false);
                }}
                style={{
                  width: i === currentStepIndex ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  background:
                    i === currentStepIndex
                      ? modeInfo[currentMode].color
                      : COLORS.lightGray,
                  transition: "all 0.35s ease",
                }}
              />
            ))}
          </div>
          {/* Right: nav buttons */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {showPlayPause && currentMode === "learn" && (
              <button
                onClick={() => setIsPlaying((p) => !p)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  background: COLORS.primary,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  transform: hoverBtn === "play" ? "scale(1.1)" : "scale(1)",
                }}
                onMouseEnter={() => setHoverBtn("play")}
                onMouseLeave={() => setHoverBtn(null)}
              >
                {isPlaying ? <IconPause /> : <IconPlay />}
              </button>
            )}
            {showNavigation && (
              <>
                <button
                  onClick={goPrev}
                  disabled={currentStepIndex === 0}
                  onMouseEnter={() => setHoverBtn("prev")}
                  onMouseLeave={() => setHoverBtn(null)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: `2px solid ${COLORS.lightGray}`,
                    background: COLORS.white,
                    color: COLORS.dark,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",
                    opacity: currentStepIndex === 0 ? 0.4 : 1,
                    transition: "all 0.25s ease",
                    transform: hoverBtn === "prev" ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <IconChevLeft />
                </button>
                <button
                  onClick={goNext}
                  disabled={currentStepIndex === modeSteps.length - 1}
                  onMouseEnter={() => setHoverBtn("next")}
                  onMouseLeave={() => setHoverBtn(null)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "none",
                    background: `linear-gradient(135deg, ${COLORS.gradientStart}, ${COLORS.gradientEnd})`,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor:
                      currentStepIndex === modeSteps.length - 1
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      currentStepIndex === modeSteps.length - 1 ? 0.4 : 1,
                    transition: "all 0.25s ease",
                    transform: hoverBtn === "next" ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <IconChevRight />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RadiationTool;
