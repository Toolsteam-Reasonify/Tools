// ConvectionLearningTool.tsx
// A comprehensive interactive tool for teaching convection in heat transfer
// Supports Learn, Practice, and Real World Application modes
// Redesigned with PDF design system and responsive layout

import React, { useState, useEffect, useRef, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

type ModeType = "learn" | "practice" | "real_world";
type StepType = "intro" | "explanation" | "demonstration" | "interactive";
type Difficulty = "easy" | "medium" | "hard";
type QuestionType = "mcq" | "true-false" | "match" | "sequence";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  stepData: StepDataInterface;
}

interface BaseDataInterface {
  title?: string;
  subtitle?: string;
  description?: string;
}

interface StepDataInterface {
  id: number;
  title: string;
  description: string;
  type: StepType;
  animationData?: {
    experiment:
      | "paper_cups"
      | "hot_air_rising"
      | "water_heating"
      | "sea_breeze"
      | "land_breeze"
      | "convection_intro";
    [key: string]: any;
  };
}

interface PracticeQuestion {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  pairs?: { left: string[]; right: string[] };
  sequence?: string[];
  correctAnswer: string | string[] | Record<string, string>;
  explanation: string;
  difficulty: Difficulty;
  points: number;
}

interface RealWorldApplication {
  id: number;
  title: string;
  category: string;
  description: string;
  howItWorks: string;
  scienceBehind: string;
  realExample: string;
  benefits: string[];
  difficulty: "everyday" | "nature" | "technology";
}

interface ConvectionAdditionalProps {
  // Learn Mode customization
  customSteps?: StepDataInterface[];
  focusedConcept?:
    | "hot_air_rises"
    | "cold_air_sinks"
    | "sea_breeze"
    | "land_breeze"
    | "convection_currents";

  // Practice Mode customization
  customQuestions?: PracticeQuestion[];
  difficultyLevel?: Difficulty;
  questionTypes?: QuestionType[];

  // Real World Mode customization
  customApplications?: RealWorldApplication[];
  filterCategories?: string[];

  // Animation customization
  particleCount?: number;
  animationIntensity?: "low" | "medium" | "high";
  showLabels?: boolean;
  highlightFeatures?: string[];
}

interface ConvectionLearningToolProps {
  props?: {
    // Dimensions
    width?: number;
    height?: number;

    // Data Configuration
    data?: BaseDataInterface;
    steps?: StepDataInterface[];

    // Mode Configuration
    initialMode?: ModeType;
    showModeSelector?: boolean;
    enabledModes?: ModeType[];

    // Navigation Configuration
    showNavigation?: boolean;
    showPlayPause?: boolean;
    showStepIndicator?: boolean;

    // Step Filtering
    initialStep?: number;
    filterSteps?: number[];

    // Animation Configuration
    animationSpeed?: number;
    autoPlayDuration?: number;

    // Theme
    themeColor?: string;
    darkMode?: boolean;

    // Additional Props - Tool-Specific Dynamic Content
    additionalProps?: ConvectionAdditionalProps;
  };

  // External Controls
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// PARTICLE INTERFACE FOR ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  temp: "hot" | "cold";
  opacity: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "What is Convection?",
    description:
      "Convection is the process of heat transfer through the actual movement of particles in fluids (liquids and gases). Unlike conduction where particles stay in place, in convection, the heated particles themselves move from one place to another.",
    type: "intro",
    animationData: { experiment: "convection_intro" },
  },
  {
    id: 2,
    title: "Activity 7.2: Paper Cup Experiment",
    description:
      "Two paper cups are hung on a stick. When a candle is placed under one cup, the hot air inside rises, making that cup tilt upward. This demonstrates that hot air is lighter than cold air and rises up.",
    type: "explanation",
    animationData: { experiment: "paper_cups" },
  },
  {
    id: 3,
    title: "Why Does Hot Air Rise?",
    description:
      "When air is heated, it expands and occupies more space. This makes it less dense (lighter) compared to the surrounding cold air. The lighter hot air rises up, while heavier cold air moves down to take its place.",
    type: "demonstration",
    animationData: { experiment: "hot_air_rising" },
  },
  {
    id: 4,
    title: "Convection in Liquids",
    description:
      "Water at the bottom of a beaker gets heated first. It expands, becomes lighter, and rises up. Cooler water from the sides moves down to replace it. This creates a convection current - a continuous cycle of rising hot water and sinking cold water.",
    type: "demonstration",
    animationData: { experiment: "water_heating" },
  },
  {
    id: 5,
    title: "Interactive: Sea Breeze (Day)",
    description:
      "During the day, land heats up faster than water. Hot air above the land rises, and cooler air from the sea moves toward the land to replace it. This is called sea breeze, which brings relief on hot days.",
    type: "interactive",
    animationData: { experiment: "sea_breeze" },
  },
  {
    id: 6,
    title: "Interactive: Land Breeze (Night)",
    description:
      "At night, land cools faster than water. Air above the sea is warmer and rises. Cooler air from the land moves toward the sea. This is called land breeze, and it reverses the direction of daytime winds.",
    type: "interactive",
    animationData: { experiment: "land_breeze" },
  },
];

const DEFAULT_QUESTIONS: PracticeQuestion[] = [
  {
    id: 1,
    type: "mcq",
    question: "What is convection?",
    options: [
      "Heat transfer through direct contact",
      "Heat transfer through movement of particles",
      "Heat transfer through electromagnetic waves",
      "Heat transfer through vacuum",
    ],
    correctAnswer: "Heat transfer through movement of particles",
    explanation:
      "Convection is the transfer of heat through the actual movement of heated particles in fluids (liquids and gases).",
    difficulty: "easy",
    points: 10,
  },
  {
    id: 2,
    type: "true-false",
    question: "Hot air is heavier than cold air.",
    options: ["True", "False"],
    correctAnswer: "False",
    explanation:
      "Hot air is lighter (less dense) than cold air because when air is heated, it expands and becomes less dense.",
    difficulty: "easy",
    points: 10,
  },
  {
    id: 3,
    type: "mcq",
    question: "What happens to air when it is heated?",
    options: [
      "It contracts and becomes denser",
      "It expands and becomes less dense",
      "It stays the same",
      "It disappears",
    ],
    correctAnswer: "It expands and becomes less dense",
    explanation:
      "When air is heated, the molecules move faster and spread apart, causing the air to expand and become less dense.",
    difficulty: "medium",
    points: 15,
  },
  {
    id: 4,
    type: "match",
    question:
      "Match the following convection phenomena with their characteristics:",
    pairs: {
      left: [
        "Sea Breeze",
        "Land Breeze",
        "Convection Current",
        "Paper Cup Experiment",
      ],
      right: [
        "Occurs at night",
        "Occurs during day",
        "Continuous circulation",
        "Hot air makes cup tilt",
      ],
    },
    correctAnswer: {
      "Sea Breeze": "Occurs during day",
      "Land Breeze": "Occurs at night",
      "Convection Current": "Continuous circulation",
      "Paper Cup Experiment": "Hot air makes cup tilt",
    },
    explanation:
      "Sea breeze occurs during the day when land heats faster. Land breeze occurs at night when land cools faster. Convection currents are continuous cycles of rising hot fluid and sinking cold fluid.",
    difficulty: "medium",
    points: 20,
  },
  {
    id: 5,
    type: "sequence",
    question:
      "Arrange the steps of convection in water heating in correct order:",
    sequence: [
      "Water at bottom gets heated",
      "Hot water expands and becomes lighter",
      "Hot water rises to the top",
      "Cold water from sides moves down",
      "Convection current forms",
    ],
    correctAnswer: [
      "Water at bottom gets heated",
      "Hot water expands and becomes lighter",
      "Hot water rises to the top",
      "Cold water from sides moves down",
      "Convection current forms",
    ],
    explanation:
      "In convection, heat source at bottom heats the fluid, making it lighter so it rises. Colder fluid moves down to replace it, creating a continuous cycle.",
    difficulty: "hard",
    points: 25,
  },
];

const DEFAULT_APPLICATIONS: RealWorldApplication[] = [
  {
    id: 1,
    title: "Sea and Land Breezes",
    category: "Nature",
    description:
      "Daily wind patterns near coastal areas caused by temperature differences between land and sea.",
    howItWorks:
      "During the day, land heats up faster than water. Hot air over land rises, and cooler air from the sea moves in to replace it (sea breeze). At night, land cools faster, and the pattern reverses (land breeze).",
    scienceBehind:
      "Different heat capacities of land and water create temperature gradients. Air moves from high to low pressure zones, creating predictable wind patterns.",
    realExample:
      "In Mumbai, India, sea breezes bring cool relief during hot afternoons. Fishermen plan their trips around these predictable wind patterns.",
    benefits: [
      "Natural air conditioning for coastal cities",
      "Helps regulate coastal temperatures",
      "Important for maritime navigation",
      "Influences local weather patterns",
    ],
    difficulty: "nature",
  },
  {
    id: 2,
    title: "Hot Air Balloons",
    category: "Technology",
    description:
      "Aircraft that float because hot air inside is less dense than cooler surrounding air.",
    howItWorks:
      "A burner heats air inside the balloon envelope. The heated air becomes less dense than outside air, creating buoyancy that lifts the balloon.",
    scienceBehind:
      "Hot air has lower density than cold air. The difference in density creates an upward buoyant force equal to the weight of displaced air.",
    realExample:
      "The Albuquerque International Balloon Fiesta in New Mexico features hundreds of hot air balloons, showcasing this principle beautifully.",
    benefits: [
      "Demonstrates convection principles clearly",
      "Used for tourism and recreation",
      "Low environmental impact transport",
      "Important for meteorological research",
    ],
    difficulty: "everyday",
  },
  {
    id: 3,
    title: "Air Conditioning and Heating",
    category: "Home",
    description:
      "Climate control systems that use convection to distribute warm or cool air throughout buildings.",
    howItWorks:
      "AC units cool air, which sinks and spreads. Heaters warm air, which rises and circulates. Vents are strategically placed based on these convection patterns.",
    scienceBehind:
      "Cold air is denser and sinks while warm air is less dense and rises. Proper vent placement ensures efficient air circulation throughout the space.",
    realExample:
      "AC vents are typically placed high on walls because cold air will naturally sink and cool the room. Heaters are placed low so warm air can rise.",
    benefits: [
      "Energy-efficient temperature control",
      "Uniform temperature distribution",
      "Improved air quality through circulation",
      "Reduced energy costs with proper design",
    ],
    difficulty: "everyday",
  },
  {
    id: 4,
    title: "Boiling Water and Cooking",
    category: "Kitchen",
    description:
      "Heat transfer in cooking relies on convection currents in liquids to distribute heat evenly.",
    howItWorks:
      "Water at the bottom of a pot heats first and rises. Cooler water descends to be heated, creating rolling convection currents that cook food uniformly.",
    scienceBehind:
      "Heated water molecules have more kinetic energy, expand, become less dense, and rise. This creates continuous circulation that transfers heat throughout the liquid.",
    realExample:
      "When making soup, you can see bubbles rising and liquid circulating. This convection ensures ingredients cook evenly without burning at the bottom.",
    benefits: [
      "Even cooking without constant stirring",
      "Prevents hot spots and burning",
      "More efficient energy use",
      "Better food quality and taste",
    ],
    difficulty: "everyday",
  },
  {
    id: 5,
    title: "Refrigerator Cooling",
    category: "Appliances",
    description:
      "Refrigerators use convection to maintain uniform cold temperatures throughout the storage space.",
    howItWorks:
      "The freezer compartment (top or back) cools air, which becomes denser and sinks. Warmer air rises to be cooled, creating natural circulation.",
    scienceBehind:
      "Cold air is denser than warm air. The cooling coils create a cold zone where air sinks, while warmer air from the bottom rises to be cooled, establishing a convection loop.",
    realExample:
      "This is why freezers are typically at the top of older refrigerators - the cold air naturally sinks to cool the entire fridge without fans.",
    benefits: [
      "Energy-efficient cooling without fans",
      "Uniform temperature maintenance",
      "Preserves food quality better",
      "Reduced mechanical noise",
    ],
    difficulty: "everyday",
  },
  {
    id: 6,
    title: "Thunderstorm Formation",
    category: "Nature",
    description:
      "Powerful weather systems driven by intense convection currents in the atmosphere.",
    howItWorks:
      "Sun heats the ground, which heats the air above it. This hot air rises rapidly (updraft), creating towering cumulonimbus clouds. Cool air descends (downdraft), creating powerful wind patterns.",
    scienceBehind:
      "Rapid vertical air movement due to temperature differences creates unstable atmospheric conditions. Water vapor condenses at higher altitudes, releasing latent heat that fuels the storm.",
    realExample:
      "Summer thunderstorms in tropical regions can reach heights of 15 km, with updrafts exceeding 100 km/h, all powered by convection.",
    benefits: [
      "Essential part of Earth's water cycle",
      "Redistributes heat in atmosphere",
      "Brings rainfall to agricultural areas",
      "Demonstrates convection on massive scale",
    ],
    difficulty: "nature",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// EASING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const ConvectionLearningTool: React.FC<ConvectionLearningToolProps> = ({
  props = {},
  setStepDetails,
  stopAutoNext = false,
  setStopAutoNext,
}) => {
  // Extract props with defaults
  const {
    width = 800,
    height = 600,
    data = {},
    initialMode = "learn",
    showModeSelector = true,
    enabledModes = ["learn", "practice", "real_world"],
    showNavigation = true,
    showPlayPause = true,
    showStepIndicator = true,
    initialStep = 0,
    filterSteps,
    animationSpeed = 1,
    autoPlayDuration = 8000,
    themeColor = "#4A4DC9",
    darkMode = false,
    additionalProps = {},
  } = props;

  // Extract additional props with defaults
  const {
    customSteps,
    focusedConcept,
    customQuestions,
    difficultyLevel,
    questionTypes,
    customApplications,
    filterCategories,
    particleCount = 30,
    animationIntensity = "medium",
    showLabels = true,
    highlightFeatures = [],
  } = additionalProps;

  // State management
  const [currentMode, setCurrentMode] = useState<ModeType>(initialMode);
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [isPlaying, setIsPlaying] = useState(!stopAutoNext);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  // Practice mode state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<
    string | string[] | Record<string, string>
  >("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [matchPairs, setMatchPairs] = useState<Record<string, string>>({});
  const [sequenceOrder, setSequenceOrder] = useState<string[]>([]);

  // Real world mode state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedApp, setExpandedApp] = useState<number | null>(null);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Determine steps based on customSteps or filterSteps
  const steps = useMemo(() => {
    let baseSteps = customSteps || DEFAULT_STEPS;

    if (filterSteps && filterSteps.length > 0) {
      baseSteps = baseSteps.filter((step) => filterSteps.includes(step.id));
    }

    if (focusedConcept) {
      const conceptMap: Record<string, string> = {
        hot_air_rises: "hot_air_rising",
        cold_air_sinks: "hot_air_rising",
        sea_breeze: "sea_breeze",
        land_breeze: "land_breeze",
        convection_currents: "water_heating",
      };
      const experiment = conceptMap[focusedConcept];
      baseSteps = baseSteps.filter(
        (step) =>
          step.animationData?.experiment === experiment || step.id === 1,
      );
    }

    return baseSteps;
  }, [customSteps, filterSteps, focusedConcept]);

  // Determine questions
  const questions = useMemo(() => {
    let baseQuestions = customQuestions || DEFAULT_QUESTIONS;

    if (difficultyLevel) {
      baseQuestions = baseQuestions.filter(
        (q) => q.difficulty === difficultyLevel,
      );
    }

    if (questionTypes && questionTypes.length > 0) {
      baseQuestions = baseQuestions.filter((q) =>
        questionTypes.includes(q.type),
      );
    }

    return baseQuestions;
  }, [customQuestions, difficultyLevel, questionTypes]);

  // Determine applications
  const applications = useMemo(() => {
    let baseApps = customApplications || DEFAULT_APPLICATIONS;

    if (filterCategories && filterCategories.length > 0) {
      baseApps = baseApps.filter((app) =>
        filterCategories.includes(app.category),
      );
    }

    return baseApps;
  }, [customApplications, filterCategories]);

  const currentStep = steps[currentStepIndex];
  const currentQuestion = questions[currentQuestionIndex];

  // Inject keyframe animations and font
  useEffect(() => {
    setMounted(true);
    const styleId = "convection-animations";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Update parent component
  useEffect(() => {
    if (setStepDetails && currentMode === "learn") {
      setStepDetails({
        currentStep: currentStepIndex,
        totalSteps: steps.length,
        stepData: currentStep,
      });
    }
  }, [
    currentStepIndex,
    currentStep,
    steps.length,
    currentMode,
    setStepDetails,
  ]);

  // Auto-play functionality
  useEffect(() => {
    if (
      currentMode === "learn" &&
      isPlaying &&
      !stopAutoNext &&
      autoPlayDuration > 0
    ) {
      const timer = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, autoPlayDuration / animationSpeed);
      return () => clearTimeout(timer);
    }
  }, [
    isPlaying,
    currentStepIndex,
    steps.length,
    currentMode,
    stopAutoNext,
    autoPlayDuration,
    animationSpeed,
  ]);

  // Initialize particles for current step
  useEffect(() => {
    if (currentMode === "learn") {
      initializeAnimation();
    }
  }, [currentStep, currentMode, particleCount]);

  // Animation loop
  useEffect(() => {
    if (currentMode === "learn") {
      const animate = () => {
        setAnimationFrame((prev) => prev + 1);
        drawAnimation();
        animationRef.current = requestAnimationFrame(animate);
      };

      if (isPlaying || mounted) {
        animationRef.current = requestAnimationFrame(animate);
      }

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying, particles, currentStep, currentMode, mounted]);

  // Initialize sequence for practice mode
  useEffect(() => {
    if (
      currentMode === "practice" &&
      currentQuestion?.type === "sequence" &&
      sequenceOrder.length === 0
    ) {
      setSequenceOrder(
        [...(currentQuestion.sequence || [])].sort(() => Math.random() - 0.5),
      );
    }
  }, [currentQuestionIndex, currentQuestion, currentMode]);

  // ═════════════════════════════════════════════════════════════════════════
  // ANIMATION FUNCTIONS
  // ═════════════════════════════════════════════════════════════════════════

  const initializeAnimation = () => {
    const newParticles: Particle[] = [];
    const intensity =
      animationIntensity === "high"
        ? 1.5
        : animationIntensity === "low"
          ? 0.5
          : 1;

    if (currentStep?.animationData?.experiment === "hot_air_rising") {
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: width / 2 + (Math.random() - 0.5) * 100,
          y: height - 100 + Math.random() * 50,
          vx: (Math.random() - 0.5) * 0.5 * intensity,
          vy: (-1 - Math.random() * 0.5) * intensity,
          temp: "hot",
          opacity: 0.7 + Math.random() * 0.3,
        });
      }

      for (let i = 0; i < particleCount * 0.7; i++) {
        newParticles.push({
          x: Math.random() * width,
          y: Math.random() * 150,
          vx: (Math.random() - 0.5) * 0.3 * intensity,
          vy: (0.5 + Math.random() * 0.3) * intensity,
          temp: "cold",
          opacity: 0.5 + Math.random() * 0.3,
        });
      }
    }

    setParticles(newParticles);
  };

  const drawAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const experiment = currentStep?.animationData?.experiment;

    switch (experiment) {
      case "paper_cups":
        drawPaperCupsExperiment(ctx);
        break;
      case "hot_air_rising":
        drawHotAirRising(ctx);
        break;
      case "water_heating":
        drawWaterHeating(ctx);
        break;
      case "sea_breeze":
        drawSeaBreeze(ctx);
        break;
      case "land_breeze":
        drawLandBreeze(ctx);
        break;
      default:
        drawIntroAnimation(ctx);
    }

    updateParticles();
  };

  const drawPaperCupsExperiment = (ctx: CanvasRenderingContext2D) => {
    // Draw wooden stick
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(width / 2 - 200, 150, 400, 10);

    // Draw strings
    ctx.strokeStyle = "#4E4E4E";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(width / 2 - 120, 150);
    ctx.lineTo(width / 2 - 120, 230);
    ctx.stroke();

    const tiltY = Math.sin(animationFrame * 0.05) * 20;
    ctx.beginPath();
    ctx.moveTo(width / 2 + 120, 150);
    ctx.lineTo(width / 2 + 120, 230 - tiltY);
    ctx.stroke();

    // Draw cup 1 (cold)
    ctx.fillStyle = "#F5F5DC";
    ctx.beginPath();
    ctx.moveTo(width / 2 - 140, 230);
    ctx.lineTo(width / 2 - 100, 230);
    ctx.lineTo(width / 2 - 95, 280);
    ctx.lineTo(width / 2 - 145, 280);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#8B7355";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw cup 2 (hot, tilted)
    ctx.save();
    ctx.translate(width / 2 + 120, 230 - tiltY);
    ctx.rotate(-tiltY * 0.01);
    ctx.translate(-(width / 2 + 120), -(230 - tiltY));

    ctx.fillStyle = "#FFE4B5";
    ctx.beginPath();
    ctx.moveTo(width / 2 + 100, 230 - tiltY);
    ctx.lineTo(width / 2 + 140, 230 - tiltY);
    ctx.lineTo(width / 2 + 145, 280 - tiltY);
    ctx.lineTo(width / 2 + 95, 280 - tiltY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#8B7355";
    ctx.stroke();
    ctx.restore();

    // Draw candle
    drawCandle(ctx, width / 2 + 120, height - 80);

    // Draw heat waves
    for (let i = 0; i < 5; i++) {
      const offset = (animationFrame + i * 10) % 100;
      ctx.fillStyle = `rgba(255, 114, 18, ${0.3 - offset / 300})`;
      ctx.beginPath();
      ctx.arc(
        width / 2 + 120,
        height - 80 - offset,
        15 - offset / 10,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }

    // Draw labels
    if (showLabels) {
      ctx.fillStyle = "#4E4E4E";
      ctx.font = "bold 16px Poppins, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Cup 1 (Cold)", width / 2 - 120, 310);
      ctx.fillText("Cup 2 (Heated)", width / 2 + 120, 310 - tiltY);
    }
  };

  const drawHotAirRising = (ctx: CanvasRenderingContext2D) => {
    // Draw candle at bottom
    drawCandle(ctx, width / 2, height - 60);

    // Draw particles
    particles.forEach((particle) => {
      if (particle.temp === "hot") {
        ctx.fillStyle = `rgba(255, 114, 18, ${particle.opacity})`;
      } else {
        ctx.fillStyle = `rgba(74, 77, 201, ${particle.opacity})`;
      }
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw velocity vectors
      ctx.strokeStyle =
        particle.temp === "hot"
          ? "rgba(255, 114, 18, 0.5)"
          : "rgba(74, 77, 201, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(particle.x + particle.vx * 20, particle.y + particle.vy * 20);
      ctx.stroke();
    });

    // Draw labels
    if (showLabels) {
      ctx.fillStyle = "#FF7212";
      ctx.font = "bold 18px Poppins, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Hot Air Rises ↑", width / 2, 50);

      ctx.fillStyle = "#4A4DC9";
      ctx.fillText("Cold Air Sinks ↓", width / 2 + 80, height - 20);
    }
  };

  const drawWaterHeating = (ctx: CanvasRenderingContext2D) => {
    // Draw beaker
    ctx.strokeStyle = "#4E4E4E";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 120, 120);
    ctx.lineTo(width / 2 - 100, 140);
    ctx.lineTo(width / 2 - 100, 350);
    ctx.lineTo(width / 2 + 100, 350);
    ctx.lineTo(width / 2 + 100, 140);
    ctx.lineTo(width / 2 + 120, 120);
    ctx.stroke();

    // Draw water
    ctx.fillStyle = "rgba(74, 77, 201, 0.2)";
    ctx.fillRect(width / 2 - 100, 150, 200, 200);

    const time = animationFrame * 0.02;

    // Draw hot water rising (center)
    ctx.strokeStyle = `rgba(255, 114, 18, ${0.5 + Math.sin(time) * 0.3})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width / 2, 340);
    for (let y = 340; y > 160; y -= 10) {
      const x = width / 2 + Math.sin((340 - y) * 0.1 + time) * 15;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw cold water sinking (sides)
    ctx.strokeStyle = `rgba(74, 77, 201, ${0.5 + Math.cos(time) * 0.3})`;

    ctx.beginPath();
    ctx.moveTo(width / 2 - 80, 160);
    for (let y = 160; y < 340; y += 10) {
      const x = width / 2 - 80 + Math.sin((y - 160) * 0.1 + time) * 10;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 2 + 80, 160);
    for (let y = 160; y < 340; y += 10) {
      const x = width / 2 + 80 + Math.sin((y - 160) * 0.1 + time) * 10;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw candle
    drawCandle(ctx, width / 2, height - 40);

    // Draw arrows
    drawArrow(
      ctx,
      width / 2,
      300,
      width / 2,
      180,
      "rgba(255, 114, 18, 0.7)",
      3,
    );
    drawArrow(
      ctx,
      width / 2 + 80,
      180,
      width / 2 + 80,
      300,
      "rgba(74, 77, 201, 0.7)",
      3,
    );

    // Draw labels
    if (showLabels) {
      ctx.fillStyle = "#4E4E4E";
      ctx.font = "14px Poppins, Arial, sans-serif";
      ctx.fillText("Hot Water Rises", width / 2 - 150, 250);
      ctx.fillText("Cold Water Sinks", width / 2 + 110, 250);
    }
  };

  const drawSeaBreeze = (ctx: CanvasRenderingContext2D) => {
    // Draw sun
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(width - 80, 60, 35, 0, Math.PI * 2);
    ctx.fill();

    // Sun rays
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width - 80 + Math.cos(angle) * 40, 60 + Math.sin(angle) * 40);
      ctx.lineTo(width - 80 + Math.cos(angle) * 55, 60 + Math.sin(angle) * 55);
      ctx.stroke();
    }

    // Draw land
    ctx.fillStyle = "#DEB887";
    ctx.fillRect(0, height / 2, width / 2, height / 2);

    // Heat waves over land
    ctx.strokeStyle = "rgba(255, 114, 18, 0.7)";
    ctx.lineWidth = 2;
    for (let y = height / 2 + 30; y < height / 2 + 100; y += 20) {
      ctx.beginPath();
      for (let x = 0; x < width / 2; x += 20) {
        const waveY = y + Math.sin((x - animationFrame * 2) * 0.12) * 4;
        if (x === 0) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      ctx.stroke();
    }

    // Draw sea
    const gradient = ctx.createLinearGradient(width / 2, 0, width, 0);
    gradient.addColorStop(0, "#4682B4");
    gradient.addColorStop(1, "#1E90FF");
    ctx.fillStyle = gradient;
    ctx.fillRect(width / 2, height / 2, width / 2, height / 2);

    // Sea waves
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 2;
    for (let y = height / 2 + 40; y < height; y += 30) {
      ctx.beginPath();
      for (let x = width / 2; x < width; x += 20) {
        const waveY = y + Math.sin((x - animationFrame * 2) * 0.1) * 5;
        if (x === width / 2) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      ctx.stroke();
    }

    // Rising hot air particles
    for (let i = 0; i < 4; i++) {
      const offset = (animationFrame + i * 15) % 120;
      const x = width / 4 + (Math.random() - 0.5) * 100;
      ctx.fillStyle = `rgba(255, 114, 18, ${0.4 - offset / 300})`;
      ctx.beginPath();
      ctx.arc(x, height / 2 - offset, 20 - offset / 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sea breeze arrows
    const arrowY = height / 2 - 60;
    for (let i = 0; i < 3; i++) {
      const x = width / 2 + 250 - ((animationFrame + i * 40) % 250);
      if (x > width / 2 + 20) {
        drawArrow(ctx, x, arrowY, x - 30, arrowY, "#4A4DC9", 3);
      }
    }

    // Labels
    if (showLabels) {
      ctx.fillStyle = "#4E4E4E";
      ctx.font = "bold 18px Poppins, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Daytime", width / 2, 30);

      ctx.font = "16px Poppins, Arial, sans-serif";
      ctx.fillText("Warmer Land", width / 4, height - 30);
      ctx.fillText("Cooler Sea", (width * 3) / 4, height - 30);

      ctx.fillStyle = "#4A4DC9";
      ctx.font = "bold 16px Poppins, Arial, sans-serif";
      ctx.fillText("Sea Breeze →", width / 2, arrowY - 20);
    }
  };

  const drawLandBreeze = (ctx: CanvasRenderingContext2D) => {
    // Draw moon and stars
    ctx.fillStyle = "#F0E68C";
    ctx.beginPath();
    ctx.arc(width - 80, 60, 30, 0, Math.PI * 2);
    ctx.fill();

    // Moon craters
    ctx.fillStyle = "rgba(200, 200, 150, 0.5)";
    ctx.beginPath();
    ctx.arc(width - 90, 55, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width - 70, 65, 6, 0, Math.PI * 2);
    ctx.fill();

    // Stars
    ctx.fillStyle = "#FFF";
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = Math.random() * (height / 2);
      const size = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw land (cooler)
    ctx.fillStyle = "#8B7355";
    ctx.fillRect(0, height / 2, width / 2, height / 2);

    // Draw sea (warmer)
    const gradient = ctx.createLinearGradient(width / 2, 0, width, 0);
    gradient.addColorStop(0, "#2F4F4F");
    gradient.addColorStop(1, "#4682B4");
    ctx.fillStyle = gradient;
    ctx.fillRect(width / 2, height / 2, width / 2, height / 2);

    // Warmer sea waves
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 2;
    for (let y = height / 2 + 30; y < height / 2 + 90; y += 20) {
      ctx.beginPath();
      for (let x = width / 2; x < width; x += 20) {
        const waveY = y + Math.sin((x + animationFrame * 2) * 0.12) * 5;
        if (x === width / 2) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      ctx.stroke();
    }

    // Rising warm air from sea
    for (let i = 0; i < 4; i++) {
      const offset = (animationFrame + i * 15) % 120;
      const x = (width * 3) / 4 + (Math.random() - 0.5) * 100;
      ctx.fillStyle = `rgba(255, 200, 100, ${0.3 - offset / 400})`;
      ctx.beginPath();
      ctx.arc(x, height / 2 - offset, 18 - offset / 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Land breeze arrows
    const arrowY = height / 2 - 60;
    for (let i = 0; i < 3; i++) {
      const x = width / 2 - 250 + ((animationFrame + i * 40) % 250);
      if (x < width / 2 - 20) {
        drawArrow(ctx, x, arrowY, x + 30, arrowY, "#533086", 3);
      }
    }

    // Labels
    if (showLabels) {
      ctx.fillStyle = "#FFF";
      ctx.font = "bold 18px Poppins, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Nighttime", width / 2, 30);

      ctx.font = "16px Poppins, Arial, sans-serif";
      ctx.fillText("Cooler Land", width / 4, height - 30);
      ctx.fillText("Warmer Sea", (width * 3) / 4, height - 30);

      ctx.fillStyle = "#533086";
      ctx.font = "bold 16px Poppins, Arial, sans-serif";
      ctx.fillText("← Land Breeze", width / 2, arrowY - 20);
    }
  };

  const drawIntroAnimation = (ctx: CanvasRenderingContext2D) => {
    // Draw container
    ctx.strokeStyle = "#4E4E4E";
    ctx.lineWidth = 3;
    ctx.strokeRect(width / 2 - 150, height / 2 - 150, 300, 300);

    // Rising hot particles
    for (let i = 0; i < 8; i++) {
      const y = height / 2 + 130 - ((animationFrame + i * 20) % 250);
      ctx.fillStyle = `rgba(255, 114, 18, ${0.7 - ((animationFrame + i * 20) % 250) / 350})`;
      ctx.beginPath();
      ctx.arc(width / 2, y, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sinking cold particles
    for (let i = 0; i < 8; i++) {
      const y = height / 2 - 130 + ((animationFrame + i * 20) % 250);
      ctx.fillStyle = `rgba(74, 77, 201, ${0.7 - ((animationFrame + i * 20) % 250) / 350})`;
      ctx.beginPath();
      ctx.arc(width / 2 + 100, y, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Labels
    if (showLabels) {
      ctx.fillStyle = "#FF7212";
      ctx.font = "bold 20px Poppins, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("HOT ↑", width / 2, height / 2 + 180);

      ctx.fillStyle = "#4A4DC9";
      ctx.fillText("COLD ↓", width / 2, height / 2 - 180);

      ctx.fillStyle = "#4E4E4E";
      ctx.font = "bold 24px Poppins, Arial, sans-serif";
      ctx.fillText("Convection Current", width / 2, height / 2 + 230);
    }
  };

  const drawCandle = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Candle body
    ctx.fillStyle = "#FBBF24";
    ctx.fillRect(x - 10, y, 20, 35);
    ctx.fillStyle = "#F59E0B";
    ctx.fillRect(x - 10, y, 20, 8);

    // Wick
    ctx.fillStyle = "#4E4E4E";
    ctx.fillRect(x - 1, y - 5, 2, 8);

    // Flame
    ctx.fillStyle = "#FCD34D";
    ctx.beginPath();
    ctx.ellipse(x, y - 8, 6, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FF7212";
    ctx.beginPath();
    ctx.ellipse(x, y - 8, 3, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    lineWidth: number = 2,
  ) => {
    const headLength = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6),
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6),
    );
    ctx.closePath();
    ctx.fill();
  };

  const updateParticles = () => {
    setParticles((prevParticles) =>
      prevParticles.map((particle) => {
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;

        if (particle.temp === "hot") {
          if (newY < 50) {
            newY = height - 100;
            newX = width / 2 + (Math.random() - 0.5) * 100;
          }
        } else {
          if (newY > height - 50) {
            newY = 50;
            newX = Math.random() * width;
          }
        }

        if (newX < 0) newX = width;
        if (newX > width) newX = 0;

        return { ...particle, x: newX, y: newY };
      }),
    );
  };

  // ═════════════════════════════════════════════════════════════════════════
  // NAVIGATION FUNCTIONS
  // ═════════════════════════════════════════════════════════════════════════

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setAnimationFrame(0);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setAnimationFrame(0);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (setStopAutoNext) {
      setStopAutoNext(isPlaying);
    }
  };

  const resetLearn = () => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setAnimationFrame(0);
    if (setStopAutoNext) {
      setStopAutoNext(false);
    }
  };

  // ═════════════════════════════════════════════════════════════════════════
  // PRACTICE MODE FUNCTIONS
  // ═════════════════════════════════════════════════════════════════════════

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleMatchPair = (left: string, right: string) => {
    setMatchPairs((prev) => ({
      ...prev,
      [left]: right,
    }));
  };

  const handleSequenceMove = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index > 0) {
      const newOrder = [...sequenceOrder];
      [newOrder[index], newOrder[index - 1]] = [
        newOrder[index - 1],
        newOrder[index],
      ];
      setSequenceOrder(newOrder);
    } else if (direction === "down" && index < sequenceOrder.length - 1) {
      const newOrder = [...sequenceOrder];
      [newOrder[index], newOrder[index + 1]] = [
        newOrder[index + 1],
        newOrder[index],
      ];
      setSequenceOrder(newOrder);
    }
  };

  const handleSubmit = () => {
    let isCorrect = false;

    if (currentQuestion.type === "match") {
      const correctPairs = currentQuestion.correctAnswer as Record<
        string,
        string
      >;
      isCorrect = Object.keys(correctPairs).every(
        (key) => matchPairs[key] === correctPairs[key],
      );
    } else if (currentQuestion.type === "sequence") {
      isCorrect =
        JSON.stringify(sequenceOrder) ===
        JSON.stringify(currentQuestion.correctAnswer);
    } else {
      isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    }

    if (isCorrect && !answeredQuestions.includes(currentQuestion.id)) {
      setScore(score + currentQuestion.points);
    }

    if (!answeredQuestions.includes(currentQuestion.id)) {
      setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowFeedback(false);
      setMatchPairs({});
      setSequenceOrder([]);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer("");
      setShowFeedback(false);
      setMatchPairs({});
      setSequenceOrder([]);
    }
  };

  const handleRestartPractice = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions([]);
    setMatchPairs({});
    setSequenceOrder([]);
  };

  const isAnswerCorrect = () => {
    if (currentQuestion.type === "match") {
      const correctPairs = currentQuestion.correctAnswer as Record<
        string,
        string
      >;
      return Object.keys(correctPairs).every(
        (key) => matchPairs[key] === correctPairs[key],
      );
    } else if (currentQuestion.type === "sequence") {
      return (
        JSON.stringify(sequenceOrder) ===
        JSON.stringify(currentQuestion.correctAnswer)
      );
    }
    return selectedAnswer === currentQuestion.correctAnswer;
  };

  const canSubmit = () => {
    if (currentQuestion.type === "match") {
      return (
        Object.keys(matchPairs).length === currentQuestion.pairs?.left.length
      );
    } else if (currentQuestion.type === "sequence") {
      return sequenceOrder.length > 0;
    }
    return selectedAnswer !== "";
  };

  // ═════════════════════════════════════════════════════════════════════════
  // REAL WORLD MODE FUNCTIONS
  // ═════════════════════════════════════════════════════════════════════════

  const toggleExpand = (id: number) => {
    setExpandedApp(expandedApp === id ? null : id);
  };

  const filteredApplications =
    selectedCategory === "all"
      ? applications
      : applications.filter((app) => app.category === selectedCategory);

  // ═════════════════════════════════════════════════════════════════════════
  // STYLES - PDF DESIGN SYSTEM WITH RESPONSIVE DESIGN
  // ═════════════════════════════════════════════════════════════════════════

  const baseColors = {
    primary: "#4A4DC9",
    secondary: "#FF7212",
    gradientStart: "#533086",
    gradientEnd: "#FC9145",
    background: darkMode ? "#1a1a1a" : "#F5F5F5",
    text: darkMode ? "#ffffff" : "#4E4E4E",
    textSecondary: darkMode ? "#a0a0a0" : "#666666",
    border: darkMode ? "#333333" : "#CACACA",
    borderLight: "#EBEBEB",
    hover: darkMode ? "#2a2a2a" : "#ffffff",
    disabled: "#CACACA",
    lightPurple: "#C1C1EA",
    lightOrange: "#FFF3E4",
  };

  const styles = {
    container: {
      width: "100%",
      maxWidth: `${width}px`,
      fontFamily: "'Poppins', Arial, sans-serif",
      backgroundColor: baseColors.background,
      color: baseColors.text,
      borderRadius: "16px",
      boxShadow: darkMode
        ? "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
        : "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      margin: "0 auto",
    },
    header: {
      background: `linear-gradient(135deg, ${baseColors.gradientStart} 0%, ${baseColors.gradientEnd} 100%)`,
      color: "#ffffff",
      padding: "clamp(16px, 4vw, 24px)",
      position: "relative" as const,
      overflow: "hidden",
    },
    modeSelector: {
      display: "flex",
      gap: "8px",
      marginBottom: "16px",
      flexWrap: "wrap" as const,
    },
    modeButton: (isActive: boolean) => ({
      padding: "10px 20px",
      minHeight: "40px",
      border: "none",
      borderRadius: "8px",
      backgroundColor: isActive
        ? "rgba(255, 255, 255, 0.95)"
        : "rgba(255, 255, 255, 0.2)",
      color: isActive ? baseColors.primary : "#ffffff",
      cursor: "pointer",
      fontWeight: "600" as const,
      fontSize: "clamp(12px, 2vw, 14px)",
      fontFamily: "'Poppins', Arial, sans-serif",
      transition: "all 0.3s ease",
      transform: isActive ? "scale(1.05)" : "scale(1)",
      animation: mounted ? "fadeIn 0.5s ease" : "none",
    }),
    canvasContainer: {
      padding: "clamp(12px, 3vw, 24px)",
      backgroundColor: darkMode ? "#252525" : "#ffffff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "clamp(300px, 50vw, 400px)",
      overflow: "auto",
    },
    canvas: {
      borderRadius: "12px",
      boxShadow: darkMode
        ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)"
        : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#ffffff",
      maxWidth: "100%",
      height: "auto",
    },
    description: {
      padding: "clamp(16px, 3vw, 24px)",
      backgroundColor: darkMode ? "#2a2a2a" : baseColors.lightPurple,
      borderLeft: `4px solid ${baseColors.primary}`,
      margin: "clamp(12px, 2vw, 16px) clamp(12px, 3vw, 24px)",
      borderRadius: "8px",
      animation: mounted ? "slideInLeft 0.5s ease" : "none",
    },
    controls: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "clamp(16px, 3vw, 24px)",
      backgroundColor: darkMode ? "#2a2a2a" : "#ffffff",
      borderTop: `1px solid ${baseColors.borderLight}`,
      flexWrap: "wrap" as const,
      gap: "12px",
    },
    button: {
      padding: "12px 24px",
      minHeight: "40px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600" as const,
      fontSize: "clamp(12px, 2vw, 14px)",
      fontFamily: "'Poppins', Arial, sans-serif",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
      whiteSpace: "nowrap" as const,
    },
    primaryButton: {
      backgroundColor: baseColors.primary,
      color: "#ffffff",
    },
    secondaryButton: {
      backgroundColor: darkMode ? "#404040" : baseColors.borderLight,
      color: baseColors.text,
    },
    highlightButton: {
      backgroundColor: baseColors.secondary,
      color: "#ffffff",
    },
    questionCard: {
      padding: "clamp(16px, 3vw, 24px)",
      margin: "clamp(12px, 2vw, 16px) clamp(12px, 3vw, 24px)",
      backgroundColor: darkMode ? "#2a2a2a" : "#ffffff",
      borderRadius: "12px",
      border: `1px solid ${baseColors.borderLight}`,
      animation: mounted ? "scaleIn 0.5s ease" : "none",
    },
    optionButton: (
      isSelected: boolean,
      isCorrect: boolean,
      showFeedback: boolean,
    ) => ({
      width: "100%",
      padding: "clamp(12px, 2vw, 16px)",
      marginBottom: "12px",
      border: `2px solid ${
        showFeedback
          ? isCorrect
            ? "#10b981"
            : isSelected
              ? "#ef4444"
              : baseColors.borderLight
          : isSelected
            ? baseColors.primary
            : baseColors.borderLight
      }`,
      borderRadius: "8px",
      backgroundColor: showFeedback
        ? isCorrect
          ? "rgba(16, 185, 129, 0.1)"
          : isSelected
            ? "rgba(239, 68, 68, 0.1)"
            : "transparent"
        : isSelected
          ? baseColors.lightPurple
          : "transparent",
      color: baseColors.text,
      cursor: showFeedback ? "not-allowed" : "pointer",
      textAlign: "left" as const,
      fontSize: "clamp(14px, 2vw, 16px)",
      fontFamily: "'Poppins', Arial, sans-serif",
      transition: "all 0.3s ease",
      fontWeight: isSelected ? ("600" as const) : ("400" as const),
    }),
    feedbackBox: (isCorrect: boolean) => ({
      padding: "clamp(16px, 3vw, 20px)",
      marginTop: "16px",
      borderRadius: "12px",
      border: `2px solid ${isCorrect ? "#10b981" : "#ef4444"}`,
      backgroundColor: isCorrect
        ? "rgba(16, 185, 129, 0.1)"
        : "rgba(239, 68, 68, 0.1)",
      animation: mounted ? "slideInRight 0.5s ease" : "none",
    }),
    appCard: {
      marginBottom: "clamp(16px, 3vw, 24px)",
      backgroundColor: darkMode ? "#2a2a2a" : "#ffffff",
      borderRadius: "16px",
      border: `1px solid ${baseColors.borderLight}`,
      overflow: "hidden",
      transition: "all 0.3s ease",
      animation: mounted ? "fadeIn 0.5s ease" : "none",
    },
    appHeader: {
      padding: "clamp(16px, 3vw, 24px)",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    appExpanded: {
      padding: "clamp(16px, 3vw, 24px)",
      backgroundColor: darkMode ? "#1f1f1f" : baseColors.background,
      borderTop: `1px solid ${baseColors.borderLight}`,
    },
    badge: {
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "clamp(10px, 1.5vw, 12px)",
      fontWeight: "600" as const,
      fontFamily: "'Poppins', Arial, sans-serif",
    },
  };

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════════

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        {showModeSelector && (
          <div style={styles.modeSelector}>
            {enabledModes.includes("learn") && (
              <button
                style={styles.modeButton(currentMode === "learn")}
                onClick={() => setCurrentMode("learn")}
                onMouseEnter={(e) => {
                  if (currentMode !== "learn") {
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentMode !== "learn") {
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1)";
                  }
                }}
              >
                📚 Learn
              </button>
            )}
            {enabledModes.includes("practice") && (
              <button
                style={styles.modeButton(currentMode === "practice")}
                onClick={() => setCurrentMode("practice")}
                onMouseEnter={(e) => {
                  if (currentMode !== "practice") {
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentMode !== "practice") {
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1)";
                  }
                }}
              >
                🎯 Practice
              </button>
            )}
            {enabledModes.includes("real_world") && (
              <button
                style={styles.modeButton(currentMode === "real_world")}
                onClick={() => setCurrentMode("real_world")}
                onMouseEnter={(e) => {
                  if (currentMode !== "real_world") {
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentMode !== "real_world") {
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1)";
                  }
                }}
              >
                🌍 Real World
              </button>
            )}
          </div>
        )}

        <h1
          style={{
            fontSize: "clamp(24px, 5vw, 32px)",
            fontWeight: "700",
            margin: "0 0 8px 0",
          }}
        >
          {data.title || "Convection - Heat Transfer"}
        </h1>
        <p
          style={{
            fontSize: "clamp(14px, 2vw, 16px)",
            margin: 0,
            opacity: 0.95,
            fontWeight: "400",
          }}
        >
          {data.subtitle || "Understanding heat transfer through fluid motion"}
        </p>

        {showStepIndicator && currentMode === "learn" && (
          <div
            style={{
              marginTop: "16px",
              fontSize: "clamp(12px, 2vw, 14px)",
              opacity: 0.95,
              fontWeight: "500",
            }}
          >
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        )}
      </div>

      {/* Learn Mode */}
      {currentMode === "learn" && (
        <>
          <div style={styles.canvasContainer}>
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              style={styles.canvas}
            />
          </div>

          <div style={styles.description}>
            <h2
              style={{
                fontSize: "clamp(18px, 3vw, 24px)",
                fontWeight: "600",
                marginBottom: "12px",
                color: baseColors.primary,
              }}
            >
              {currentStep?.title}
            </h2>
            <p
              style={{
                fontSize: "clamp(14px, 2vw, 16px)",
                lineHeight: "1.6",
                margin: 0,
                fontWeight: "400",
              }}
            >
              {currentStep?.description}
            </p>
          </div>

          {showNavigation && (
            <div style={styles.controls}>
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                onMouseEnter={(e) => {
                  if (currentStepIndex !== 0) {
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                ← Previous
              </button>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {showPlayPause && (
                  <button
                    style={{ ...styles.button, ...styles.primaryButton }}
                    onClick={togglePlay}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.transform =
                        "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.transform =
                        "scale(1)";
                    }}
                  >
                    {isPlaying ? "⏸ Pause" : "▶ Play"}
                  </button>
                )}

                <button
                  style={{ ...styles.button, ...styles.secondaryButton }}
                  onClick={resetLearn}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1)";
                  }}
                >
                  ↻ Reset
                </button>
              </div>

              <button
                style={{ ...styles.button, ...styles.primaryButton }}
                onClick={nextStep}
                disabled={currentStepIndex === steps.length - 1}
                onMouseEnter={(e) => {
                  if (currentStepIndex !== steps.length - 1) {
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Practice Mode */}
      {currentMode === "practice" && questions.length > 0 && (
        <>
          <div style={styles.questionCard}>
            <div
              style={{
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: baseColors.primary,
                  color: "#ffffff",
                }}
              >
                Question {currentQuestionIndex + 1} / {questions.length}
              </span>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor:
                    currentQuestion.difficulty === "easy"
                      ? "#10b981"
                      : currentQuestion.difficulty === "medium"
                        ? "#f59e0b"
                        : "#ef4444",
                  color: "#ffffff",
                }}
              >
                {currentQuestion.difficulty.toUpperCase()}
              </span>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: baseColors.secondary,
                  color: "#ffffff",
                }}
              >
                {currentQuestion.points} points
              </span>
            </div>

            <h3
              style={{
                fontSize: "clamp(16px, 3vw, 20px)",
                fontWeight: "600",
                marginBottom: "20px",
              }}
            >
              {currentQuestion.question}
            </h3>

            {/* MCQ & True/False */}
            {(currentQuestion.type === "mcq" ||
              currentQuestion.type === "true-false") && (
              <div>
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    style={styles.optionButton(
                      selectedAnswer === option,
                      option === currentQuestion.correctAnswer,
                      showFeedback,
                    )}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showFeedback}
                    onMouseEnter={(e) => {
                      if (!showFeedback) {
                        (e.target as HTMLButtonElement).style.transform =
                          "translateX(4px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.transform =
                        "translateX(0)";
                    }}
                  >
                    {option}
                    {showFeedback && selectedAnswer === option && (
                      <span style={{ marginLeft: "auto", fontSize: "20px" }}>
                        {isAnswerCorrect() ? "✓" : "✗"}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Match Type */}
            {currentQuestion.type === "match" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                }}
              >
                <div>
                  <h4
                    style={{
                      fontWeight: "600",
                      marginBottom: "12px",
                      color: baseColors.primary,
                      fontSize: "clamp(14px, 2vw, 16px)",
                    }}
                  >
                    Processes
                  </h4>
                  {currentQuestion.pairs?.left.map((item) => (
                    <div
                      key={item}
                      style={{
                        padding: "12px",
                        marginBottom: "12px",
                        backgroundColor: darkMode
                          ? "#3a3a3a"
                          : baseColors.lightPurple,
                        borderRadius: "8px",
                        border: `2px solid ${baseColors.primary}40`,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          marginBottom: "8px",
                          fontSize: "clamp(12px, 2vw, 14px)",
                        }}
                      >
                        {item}
                      </div>
                      <select
                        value={matchPairs[item] || ""}
                        onChange={(e) => handleMatchPair(item, e.target.value)}
                        disabled={showFeedback}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "4px",
                          border: `1px solid ${baseColors.border}`,
                          backgroundColor: baseColors.background,
                          color: baseColors.text,
                          fontFamily: "'Poppins', Arial, sans-serif",
                          fontSize: "clamp(12px, 2vw, 14px)",
                        }}
                      >
                        <option value="">Select...</option>
                        {currentQuestion.pairs?.right.map((right) => (
                          <option key={right} value={right}>
                            {right}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div>
                  <h4
                    style={{
                      fontWeight: "600",
                      marginBottom: "12px",
                      color: baseColors.secondary,
                      fontSize: "clamp(14px, 2vw, 16px)",
                    }}
                  >
                    Characteristics
                  </h4>
                  {currentQuestion.pairs?.right.map((item) => (
                    <div
                      key={item}
                      style={{
                        padding: "12px",
                        marginBottom: "12px",
                        backgroundColor: darkMode
                          ? "#3a3a3a"
                          : baseColors.lightOrange,
                        borderRadius: "8px",
                        border: `2px solid ${baseColors.secondary}40`,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "clamp(12px, 2vw, 14px)",
                        }}
                      >
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sequence Type */}
            {currentQuestion.type === "sequence" && (
              <div>
                <p
                  style={{
                    marginBottom: "16px",
                    color: baseColors.textSecondary,
                    fontSize: "clamp(12px, 2vw, 14px)",
                  }}
                >
                  Arrange the steps in correct order using ▲ and ▼ buttons
                </p>
                {sequenceOrder.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px",
                      marginBottom: "8px",
                      backgroundColor: darkMode ? "#3a3a3a" : "#ffffff",
                      border: `2px solid ${baseColors.borderLight}`,
                      borderRadius: "8px",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: baseColors.primary,
                        color: "#ffffff",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontWeight: "600",
                        minWidth: "40px",
                        textAlign: "center",
                        fontSize: "clamp(12px, 2vw, 14px)",
                      }}
                    >
                      {index + 1}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: "clamp(13px, 2vw, 15px)",
                      }}
                    >
                      {item}
                    </span>
                    {!showFeedback && (
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          onClick={() => handleSequenceMove(index, "up")}
                          disabled={index === 0}
                          style={{
                            padding: "6px 12px",
                            border: "none",
                            borderRadius: "4px",
                            backgroundColor:
                              index === 0
                                ? baseColors.disabled
                                : baseColors.primary,
                            color: "#ffffff",
                            cursor: index === 0 ? "not-allowed" : "pointer",
                            fontWeight: "600",
                            fontFamily: "'Poppins', Arial, sans-serif",
                            fontSize: "clamp(12px, 2vw, 14px)",
                          }}
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleSequenceMove(index, "down")}
                          disabled={index === sequenceOrder.length - 1}
                          style={{
                            padding: "6px 12px",
                            border: "none",
                            borderRadius: "4px",
                            backgroundColor:
                              index === sequenceOrder.length - 1
                                ? baseColors.disabled
                                : baseColors.primary,
                            color: "#ffffff",
                            cursor:
                              index === sequenceOrder.length - 1
                                ? "not-allowed"
                                : "pointer",
                            fontWeight: "600",
                            fontFamily: "'Poppins', Arial, sans-serif",
                            fontSize: "clamp(12px, 2vw, 14px)",
                          }}
                        >
                          ▼
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {showFeedback && (
              <div style={styles.feedbackBox(isAnswerCorrect())}>
                <div
                  style={{
                    fontSize: "clamp(16px, 3vw, 18px)",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  {isAnswerCorrect() ? "✓ Correct!" : "✗ Incorrect"}
                </div>
                <p
                  style={{
                    margin: 0,
                    lineHeight: "1.6",
                    fontSize: "clamp(13px, 2vw, 15px)",
                  }}
                >
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>

          <div style={styles.controls}>
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              onMouseEnter={(e) => {
                if (currentQuestionIndex !== 0) {
                  (e.target as HTMLButtonElement).style.transform =
                    "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform = "scale(1)";
              }}
            >
              ← Previous
            </button>

            <div>
              {!showFeedback ? (
                <button
                  style={{ ...styles.button, ...styles.highlightButton }}
                  onClick={handleSubmit}
                  disabled={!canSubmit()}
                  onMouseEnter={(e) => {
                    if (canSubmit()) {
                      (e.target as HTMLButtonElement).style.transform =
                        "scale(1.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1)";
                  }}
                >
                  Submit Answer
                </button>
              ) : currentQuestionIndex < questions.length - 1 ? (
                <button
                  style={{ ...styles.button, ...styles.primaryButton }}
                  onClick={handleNextQuestion}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1)";
                  }}
                >
                  Next Question →
                </button>
              ) : (
                <button
                  style={{ ...styles.button, ...styles.highlightButton }}
                  onClick={handleRestartPractice}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1)";
                  }}
                >
                  ↻ Try Again
                </button>
              )}
            </div>

            <div
              style={{
                fontSize: "clamp(16px, 3vw, 18px)",
                fontWeight: "600",
                color: baseColors.primary,
              }}
            >
              Score: {score} / {questions.reduce((sum, q) => sum + q.points, 0)}
            </div>
          </div>
        </>
      )}

      {/* Real World Applications Mode */}
      {currentMode === "real_world" && (
        <div style={{ padding: "clamp(16px, 3vw, 24px)" }}>
          <div
            style={{
              marginBottom: "clamp(16px, 3vw, 24px)",
              padding: "clamp(16px, 3vw, 20px)",
              backgroundColor: darkMode ? "#2a2a2a" : baseColors.lightPurple,
              borderRadius: "12px",
              border: `1px solid ${baseColors.borderLight}`,
            }}
          >
            <h3
              style={{
                fontSize: "clamp(16px, 3vw, 18px)",
                fontWeight: "600",
                marginBottom: "12px",
              }}
            >
              Filter by Category
            </h3>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                "all",
                "Nature",
                "Home",
                "Kitchen",
                "Appliances",
                "Technology",
              ].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: "8px 16px",
                    minHeight: "40px",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor:
                      selectedCategory === category
                        ? baseColors.primary
                        : baseColors.borderLight,
                    color:
                      selectedCategory === category
                        ? "#ffffff"
                        : baseColors.text,
                    cursor: "pointer",
                    fontWeight: selectedCategory === category ? "600" : "400",
                    fontFamily: "'Poppins', Arial, sans-serif",
                    fontSize: "clamp(12px, 2vw, 14px)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category) {
                      (e.target as HTMLButtonElement).style.transform =
                        "scale(1.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.transform =
                      "scale(1)";
                  }}
                >
                  {category === "all" ? "All" : category}
                </button>
              ))}
            </div>
            <div
              style={{
                marginTop: "12px",
                fontSize: "clamp(12px, 2vw, 14px)",
                color: baseColors.textSecondary,
                fontWeight: "500",
              }}
            >
              Showing {filteredApplications.length} application
              {filteredApplications.length !== 1 ? "s" : ""}
            </div>
          </div>

          {filteredApplications.map((app) => (
            <div key={app.id} style={styles.appCard}>
              <div
                style={styles.appHeader}
                onClick={() => toggleExpand(app.id)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    baseColors.hover;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "clamp(18px, 3vw, 20px)",
                          fontWeight: "600",
                          margin: 0,
                        }}
                      >
                        {app.title}
                      </h3>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor: baseColors.lightPurple,
                          color: baseColors.primary,
                        }}
                      >
                        {app.category}
                      </span>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor:
                            app.difficulty === "everyday"
                              ? baseColors.lightOrange
                              : app.difficulty === "nature"
                                ? baseColors.lightPurple
                                : "#E0E7FF",
                          color:
                            app.difficulty === "everyday"
                              ? baseColors.secondary
                              : app.difficulty === "nature"
                                ? baseColors.primary
                                : "#4338CA",
                        }}
                      >
                        {app.difficulty}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: baseColors.textSecondary,
                        lineHeight: "1.6",
                        fontSize: "clamp(13px, 2vw, 15px)",
                      }}
                    >
                      {app.description}
                    </p>
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(20px, 3vw, 24px)",
                      flexShrink: 0,
                    }}
                  >
                    {expandedApp === app.id ? "▼" : "▶"}
                  </div>
                </div>
              </div>

              {expandedApp === app.id && (
                <div style={styles.appExpanded}>
                  <div style={{ marginBottom: "20px" }}>
                    <h4
                      style={{
                        fontSize: "clamp(14px, 2vw, 16px)",
                        fontWeight: "600",
                        marginBottom: "8px",
                        color: baseColors.primary,
                      }}
                    >
                      How It Works
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        lineHeight: "1.6",
                        fontSize: "clamp(13px, 2vw, 15px)",
                      }}
                    >
                      {app.howItWorks}
                    </p>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <h4
                      style={{
                        fontSize: "clamp(14px, 2vw, 16px)",
                        fontWeight: "600",
                        marginBottom: "8px",
                        color: baseColors.secondary,
                      }}
                    >
                      Science Behind It
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        lineHeight: "1.6",
                        fontSize: "clamp(13px, 2vw, 15px)",
                      }}
                    >
                      {app.scienceBehind}
                    </p>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <h4
                      style={{
                        fontSize: "clamp(14px, 2vw, 16px)",
                        fontWeight: "600",
                        marginBottom: "8px",
                        color: baseColors.primary,
                      }}
                    >
                      Real Life Example
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        lineHeight: "1.6",
                        fontStyle: "italic",
                        fontSize: "clamp(13px, 2vw, 15px)",
                      }}
                    >
                      {app.realExample}
                    </p>
                  </div>

                  <div>
                    <h4
                      style={{
                        fontSize: "clamp(14px, 2vw, 16px)",
                        fontWeight: "600",
                        marginBottom: "12px",
                        color: baseColors.secondary,
                      }}
                    >
                      Benefits & Impact
                    </h4>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: "20px",
                        lineHeight: "1.8",
                      }}
                    >
                      {app.benefits.map((benefit, index) => (
                        <li
                          key={index}
                          style={{ fontSize: "clamp(13px, 2vw, 15px)" }}
                        >
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConvectionLearningTool;