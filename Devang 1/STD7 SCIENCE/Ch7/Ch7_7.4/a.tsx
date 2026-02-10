import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  CSSProperties,
} from "react";

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

// ═══════════════════════════════════════════════════════════════════════════
// ADDITIONAL PROPS INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PROPS INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

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
// CUSTOM HOOK FOR RESPONSIVE BREAKPOINTS
// ═══════════════════════════════════════════════════════════════════════════

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

const useResponsive = () => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen: isMobile || isTablet,
  };
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
      "Plants also release water vapor through tiny holes in their leaves called stomata."
    ],
    example: [
      "Think about a puddle after it rains.",
      "On a sunny day, the puddle gets smaller until it disappears.",
      "The water turned into vapor and went up into the sky!",
      "Trees also \"breathe out\" water vapor through their leaves."
    ]
  },
  condensation: {
    title: "Condensation",
    simple: [
      "Water vapor rises high into the sky where it's very cold.",
      "It cools down and turns back into tiny water droplets.",
      "These millions of tiny droplets cluster together to form clouds."
    ],
    example: [
      "Breathe on a cold window.",
      "You see water droplets form on the glass.",
      "That's condensation!",
      "Your warm breath (water vapor) hits the cold surface and turns back into liquid water."
    ]
  },
  precipitation: {
    title: "Precipitation",
    simple: [
      "Clouds get too heavy with water droplets.",
      "Gravity pulls the water back down to Earth.",
      "It falls as rain, snow, sleet, or hail depending on temperature."
    ],
    example: [
      "Clouds are like giant sponges floating in the sky.",
      "When the sponge gets too full, the water falls down.",
      "Warm weather = rain. Cold weather = snow!"
    ]
  },
  collection: {
    title: "Collection & Infiltration",
    simple: [
      "Rainwater flows downhill into rivers, streams, lakes, and oceans.",
      "Some water soaks into the ground through soil and rocks.",
      "This is called infiltration."
    ],
    example: [
      "After rain, water flows down streets into drains.",
      "It travels to rivers, then lakes or ocean.",
      "Some rainwater soaks into soil where plants drink it."
    ]
  }
};

const DEFAULT_STEPS: StepData[] = [
  { id: 'evaporation', phase: 'EVAPORATION', name: 'Evaporation & Transpiration', icon: '🌊' },
  { id: 'condensation', phase: 'CONDENSATION', name: 'Condensation', icon: '☁️' },
  { id: 'precipitation', phase: 'PRECIPITATION', name: 'Precipitation', icon: '💧' },
  { id: 'collection', phase: 'COLLECTION', name: 'Collection & Infiltration', icon: '🏞️' }
];

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "In which three states does water exist in nature?",
    options: ["Liquid, Solid, Plasma", "Liquid, Solid, Gas", "Solid, Gas, Plasma", "Liquid, Gas, Plasma"],
    correctAnswer: 1,
    explanation: "Water exists as liquid (oceans, rivers, lakes), solid (snow, ice, glaciers), and gas (water vapour in the atmosphere)."
  },
  {
    id: 2,
    question: "What is the process called when water vapour rises up, cools down and forms clouds?",
    options: ["Evaporation", "Precipitation", "Condensation", "Transpiration"],
    correctAnswer: 2,
    explanation: "Condensation is the process where water vapour cools down and changes back into liquid water, forming clouds."
  },
  {
    id: 3,
    question: "Through which material does water seep the fastest?",
    options: ["Clay", "Sand", "Gravel", "Rock"],
    correctAnswer: 2,
    explanation: "Water seeps fastest through gravel because the spaces between gravel particles are wider compared to sand and clay."
  },
  {
    id: 4,
    question: "What are the underground layers of sediments and rocks that store water called?",
    options: ["Reservoirs", "Aquifers", "Water tables", "Underground lakes"],
    correctAnswer: 1,
    explanation: "Aquifers are underground layers of sediments and rocks that store water in their pore spaces, which we access through wells."
  },
  {
    id: 5,
    question: "What is the process of surface water seeping through soil and rocks called?",
    options: ["Percolation", "Evaporation", "Infiltration", "Precipitation"],
    correctAnswer: 2,
    explanation: "Infiltration is the process where surface water seeps through soil and rocks beneath Earth's surface to form groundwater."
  }
];

const DEFAULT_EXAMPLES: RealWorldExample[] = [
  {
    id: 1,
    title: "Ice Stupa - Ladakh",
    location: "Ladakh, India",
    description: "An innovative water conservation technique where mountain stream water is channeled through underground pipes and sprayed into cold air during winters. The water freezes layer by layer, creating tall cone-shaped ice structures that melt slowly in spring, providing water for farming throughout summer.",
    category: "Water Conservation",
    impact: "Provides water supply during water-scarce spring season when snow hasn't melted enough",
    keyFeatures: [
      "Built during extreme winters",
      "Uses natural freezing temperatures",
      "Melts slowly to provide sustained water supply",
      "Supports agriculture in arid regions"
    ],
    connection: "Ice Stupa utilizes the water cycle by storing water in solid form (ice) during winter, which then melts and evaporates, completing the cycle while providing agricultural water."
  },
  {
    id: 2,
    title: "Rainwater Harvesting Systems",
    location: "Urban Areas, India",
    description: "Systems that collect and store rainwater from rooftops and other surfaces. The collected water is filtered and directed into underground storage tanks or used to recharge groundwater through recharge pits, helping replenish depleting aquifers.",
    category: "Groundwater Recharge",
    impact: "Reduces dependency on municipal water supply and recharges groundwater levels",
    keyFeatures: [
      "Collects rainwater from rooftops",
      "Filters and stores water",
      "Recharges underground aquifers",
      "Reduces urban flooding"
    ],
    connection: "Rainwater harvesting captures precipitation from the water cycle and uses infiltration to recharge aquifers, directly participating in the groundwater formation process."
  },
  {
    id: 3,
    title: "Traditional Houses - Uttarakhand Himalayas",
    location: "Mori Block, Uttarkashi, Uttarakhand",
    description: "Houses built with walls made of two wooden layers filled with cow dung and mud between them. This design utilizes the poor heat conductivity of wood and mud to prevent heat loss, keeping homes warm during harsh winters with heavy snowfall.",
    category: "Heat Transfer Application",
    impact: "Maintains warmth without external heating, saving energy in extreme cold climates",
    keyFeatures: [
      "Double wooden layer walls",
      "Natural insulation with mud and cow dung",
      "Poor conductors prevent heat loss",
      "Sustainable and eco-friendly"
    ],
    connection: "Traditional houses use poor heat conductors to minimize conduction, preventing heat loss and maintaining comfortable indoor temperatures in extreme climates."
  },
  {
    id: 4,
    title: "Hollow Brick Construction",
    location: "Hot and Cold Climate Regions",
    description: "Buildings constructed using hollow bricks that trap air in their cavities. Since air is a poor conductor of heat, these buildings stay warm in winters and cool in summers by preventing heat transfer between inside and outside environments.",
    category: "Thermal Insulation",
    impact: "Reduces energy consumption for heating and cooling, making buildings more sustainable",
    keyFeatures: [
      "Air trapped in hollow spaces",
      "Acts as natural insulator",
      "Reduces energy bills",
      "Effective in extreme climates"
    ],
    connection: "Hollow bricks trap air (a poor conductor) to prevent heat transfer through conduction, demonstrating practical application of thermal insulation principles."
  },
  {
    id: 5,
    title: "Traditional Bukhari Heater",
    location: "Upper Himalayan Regions",
    description: "A traditional room heater consisting of an iron stove burning wood or charcoal, with a chimney pipe for smoke venting. It demonstrates all three heat transfer processes: conduction (from flame to stove), convection (heating air and water), and radiation (warmth felt around it). The flat top can be used for cooking.",
    category: "Heat Transfer",
    impact: "Provides heating and cooking solution in areas with limited modern infrastructure",
    keyFeatures: [
      "Demonstrates conduction, convection, and radiation",
      "Multi-purpose: heating and cooking",
      "Uses locally available fuel",
      "Effective chimney system"
    ],
    connection: "Bukhari demonstrates all three heat transfer methods: conduction (metal heating), convection (air circulation), and radiation (warmth felt nearby)."
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// SIMPLE ICON COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const DropletIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

const PlayIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
);

const ChevronLeftIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const RotateCcwIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M1 4v6h6M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

const BookOpenIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const ClipboardCheckIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" />
  </svg>
);

const GlobeIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION KEYFRAMES
// ═══════════════════════════════════════════════════════════════════════════

const KEYFRAMES_CSS = `
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
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
`;

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
  themeColor: string;
  setStepDetails?: (details: StepDetails) => void;
}> = ({
  steps,
  phases,
  autoPlayDuration,
  animationSpeed,
  showNavigation,
  showPlayPause,
  showStepIndicator,
  themeColor,
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
      'EVAPORATION': cloudNum === 1 ? 'translate(200px, 110px)' : 'translate(340px, 115px)',
      'CONDENSATION': cloudNum === 1 ? 'translate(530px, 110px)' : 'translate(670px, 115px)',
      'PRECIPITATION': cloudNum === 1 ? 'translate(530px, 110px)' : 'translate(670px, 115px)',
      'COLLECTION': cloudNum === 1 ? 'translate(530px, 110px)' : 'translate(670px, 115px)',
    };
    const opacity = currentPhase === 'COLLECTION' ? 0 : 1;
    const transition = currentPhase === 'CONDENSATION' ? 'transform 5s ease, opacity 1s ease' :
      currentPhase === 'COLLECTION' ? 'opacity 1.5s ease' : 'transform 1s ease, opacity 1s ease';
    return { transform: positions[currentPhase], opacity, transition };
  };

  const getCloudFill = () => currentPhase === 'CONDENSATION' || currentPhase === 'PRECIPITATION' ? '#5a7c8a' : '#ffffff';
  const getCloudStroke = () => currentPhase === 'CONDENSATION' || currentPhase === 'PRECIPITATION' ? '#456672' : '#e8e8e8';

  const styles = {
    container: {
      width: '100%',
      height: '100%',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column' as const,
      fontFamily: 'Poppins, "Noto Sans", sans-serif',
    },
    header: {
      background: `linear-gradient(90deg, ${themeColor}, #1976d2)`,
      color: 'white',
      padding: isMobile ? '8px 12px' : '10px 20px',
      textAlign: 'center' as const,
      flexShrink: 0,
    },
    title: {
      margin: 0,
      fontSize: isMobile ? '18px' : isTablet ? '20px' : '24px',
      fontWeight: 'bold' as const,
    },
    subtitle: {
      margin: '3px 0 0 0',
      fontSize: isMobile ? '10px' : '12px',
      opacity: 0.95,
    },
    contentArea: {
      display: 'flex',
      flexDirection: isSmallScreen ? 'column' as const : 'row' as const,
      flex: 1,
      overflow: 'hidden' as const,
      minHeight: 0,
    },
    leftPanel: {
      width: isSmallScreen ? '100%' : '62%',
      padding: isMobile ? '8px' : '12px',
      display: 'flex',
      flexDirection: 'column' as const,
      minHeight: isSmallScreen ? '300px' : 'auto',
    },
    svgContainer: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
      borderRadius: isMobile ? '8px' : '16px',
      padding: isMobile ? '6px' : '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      overflow: 'hidden' as const,
    },
    svg: {
      width: '100%',
      height: 'auto',
      maxHeight: isSmallScreen ? '350px' : '100%',
      display: 'block' as const,
    },
    rightPanel: {
      width: isSmallScreen ? '100%' : '38%',
      display: 'flex',
      flexDirection: 'column' as const,
      padding: isMobile ? '8px' : '12px',
      overflow: isSmallScreen ? 'visible' as const : 'hidden' as const,
      maxHeight: isSmallScreen ? 'none' : '100%',
    },
    topicHeader: {
      background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
      padding: isMobile ? '10px 14px' : '12px 18px',
      borderRadius: '10px',
      marginBottom: isMobile ? '8px' : '12px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
      border: `2px solid ${themeColor}`,
      flexShrink: 0,
    },
    topicTitle: {
      color: '#1565c0',
      fontSize: isMobile ? '14px' : isTablet ? '16px' : '18px',
      fontWeight: 'bold' as const,
      margin: 0,
      textAlign: 'center' as const,
    },
    infoSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: isMobile ? '12px' : '16px',
      flex: 1,
      overflow: isSmallScreen ? 'visible' as const : 'auto' as const,
    },
    infoBox: {
      background: 'white',
      padding: isMobile ? '10px 12px' : '12px 14px',
      borderRadius: '10px',
      borderLeft: `4px solid ${themeColor}`,
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    },
    infoTitle: {
      fontSize: isMobile ? '13px' : '15px',
      fontWeight: 'bold' as const,
      color: '#1976d2',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    infoSentence: {
      fontSize: isMobile ? '11px' : '13px',
      color: '#444',
      lineHeight: '1.5',
      margin: '0 0 4px 0',
      paddingLeft: '4px',
      fontWeight: '500' as const,
    },
    footer: {
      background: '#ffffff',
      padding: isMobile ? '10px 12px' : '14px 20px',
      boxShadow: '0 -6px 16px rgba(0,0,0,0.08)',
      flexShrink: 0,
    },
    controls: {
      display: 'flex',
      justifyContent: 'center',
      gap: isMobile ? '6px' : '8px',
      flexWrap: 'wrap' as const,
      marginBottom: isMobile ? '6px' : '8px',
    },
    btn: (variant: string, disabled: boolean = false): CSSProperties => {
      const colors: { [key: string]: { bg: string; hover: string } } = {
        default: { bg: themeColor, hover: '#1976d2' },
        play: { bg: '#4caf50', hover: '#388e3c' },
        reset: { bg: '#ff9800', hover: '#f57c00' },
      };
      const color = colors[variant] || colors.default;
      return {
        padding: isMobile ? '7px 12px' : '9px 18px',
        fontSize: isMobile ? '11px' : '13px',
        fontWeight: '600' as const,
        background: color.bg,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.3s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '4px' : '6px',
        whiteSpace: 'nowrap' as const,
      };
    },
    dots: {
      display: 'flex',
      justifyContent: 'center',
      gap: isMobile ? '6px' : '8px',
      flexWrap: 'wrap' as const,
    },
    dot: (isActive: boolean): CSSProperties => ({
      width: isMobile ? '32px' : '36px',
      height: isMobile ? '32px' : '36px',
      borderRadius: '50%',
      border: 'none',
      background: isActive ? themeColor : 'white',
      color: isActive ? 'white' : themeColor,
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: 'bold' as const,
      cursor: 'pointer',
      boxShadow: isActive ? `0 0 0 3px rgba(33,150,243,0.3)` : '0 3px 8px rgba(0,0,0,0.2)',
      transition: 'all 0.3s',
    }),
  };

  return (
    <div style={styles.container}>
      <style>{KEYFRAMES_CSS}</style>
      
      <div style={styles.header}>
        <h1 style={styles.title}>🌊 The Water Cycle</h1>
        <p style={styles.subtitle}>Learn how water moves around our planet in a continuous cycle!</p>
      </div>

      <div style={styles.contentArea}>
        <div style={styles.leftPanel}>
          <div style={styles.svgContainer}>
            <svg style={styles.svg} viewBox="0 0 800 460" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#87ceeb" />
                  <stop offset="100%" stopColor="#b3e5fc" />
                </linearGradient>
                <radialGradient id="sunGradient">
                  <stop offset="0%" stopColor="#fff59d" />
                  <stop offset="100%" stopColor="#ffeb3b" />
                </radialGradient>
                <filter id="cloudShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                  <feOffset dx="0" dy="3" />
                  <feComponentTransfer><feFuncA type="linear" slope="0.25" /></feComponentTransfer>
                  <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              <rect x="0" y="0" width="800" height="280" fill="url(#skyGradient)" />

              <g style={{ animation: 'sunPulse 4s ease-in-out infinite' }}>
                <circle cx="90" cy="60" r="38" fill="url(#sunGradient)" stroke="#fbc02d" strokeWidth="3" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  return (
                    <line
                      key={i}
                      x1={90 + Math.cos(rad) * 46}
                      y1={60 + Math.sin(rad) * 46}
                      x2={90 + Math.cos(rad) * 56}
                      y2={60 + Math.sin(rad) * 56}
                      stroke="#fff59d"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      opacity="0.8"
                      style={{ animation: 'rayPulse 2.5s ease-in-out infinite' }}
                    />
                  );
                })}
                <text x="90" y="65" textAnchor="middle" fontSize="12" fill="#f57c00" fontWeight="800">Sun</text>
              </g>

              <g>
                <path d="M 600 280 L 680 200 L 750 260 L 800 240 L 800 280 Z" fill="#81c784" opacity="0.6" />
                <path d="M 500 280 L 600 180 L 700 260 L 750 220 L 800 260 L 800 280 Z" fill="#66bb6a" opacity="0.7" />
              </g>

              <rect x="0" y="280" width="450" height="85" fill="#2196f3" />
              <path
                d="M 0 285 Q 50 280, 100 285 T 200 285 T 300 285 T 450 285"
                fill="none"
                stroke="#64b5f6"
                strokeWidth="2.5"
                opacity="0.7"
                style={{ animation: 'waveMotion 3s ease-in-out infinite' }}
              />
              <text x="225" y="325" textAnchor="middle" fill="#1a237e" fontSize="14" fontWeight="700">Ocean / Lake</text>

              <rect x="450" y="280" width="350" height="85" fill="#a5d6a7" />
              <text x="625" y="325" textAnchor="middle" fill="#1a237e" fontSize="14" fontWeight="700">Land</text>

              <path
                d="M 550 280 C 570 310, 510 340, 470 360 C 410 385, 350 360, 290 360"
                fill="none"
                stroke="#42a5f5"
                strokeWidth="6"
                strokeDasharray={currentPhase === 'COLLECTION' ? '12 8' : '0'}
                style={currentPhase === 'COLLECTION' ? { animation: 'riverFlow 1.5s linear infinite' } : {}}
              />

              <g>
                <rect x="520" y="255" width="12" height="32" fill="#6d4c41" />
                <circle cx="526" cy="250" r="16" fill="#388e3c" />
                <rect x="560" y="255" width="12" height="32" fill="#6d4c41" />
                <circle cx="566" cy="250" r="16" fill="#388e3c" />
              </g>

              <rect x="0" y="365" width="800" height="40" fill="#8d6e63" />
              <text x="400" y="388" textAnchor="middle" fill="#3e2723" fontSize="13" fontWeight="700">Soil</text>

              <rect x="0" y="405" width="800" height="55" fill="#5d4037" />
              <rect x="230" y="410" width="260" height="35" fill="#4fc3f7" opacity="0.75" />
              <text x="360" y="432" textAnchor="middle" fill="#01579b" fontSize="13" fontWeight="700">Aquifer (Groundwater)</text>

              <g style={{ opacity: currentPhase === 'EVAPORATION' ? 1 : 0, transition: 'opacity 0.8s' }}>
                {currentPhase === 'EVAPORATION' && (
                  <text x="225" y="250" textAnchor="middle" fill="#0d47a1" fontSize="14" fontWeight="800">Evaporation</text>
                )}
                {[80, 140, 200, 260, 320, 380].map((x, i) => (
                  <g
                    key={i}
                    style={{
                      animation: currentPhase === 'EVAPORATION' ? 'vaporRise 3s ease-out infinite' : 'none',
                      animationDelay: `${i * 0.3}s`,
                      opacity: 0
                    }}
                  >
                    <path d={`M ${x} 275 Q ${x - 5} 260, ${x} 245 T ${x} 215 T ${x} 185`} stroke="#4fc3f7" strokeWidth="2" fill="none" strokeDasharray="3 3" />
                    <path d={`M ${x + 8} 275 Q ${x + 3} 260, ${x + 8} 245 T ${x + 8} 215 T ${x + 8} 185`} stroke="#4fc3f7" strokeWidth="2" fill="none" strokeDasharray="3 3" />
                  </g>
                ))}
              </g>

              <g style={{ opacity: currentPhase === 'EVAPORATION' ? 1 : 0, transition: 'opacity 0.8s' }}>
                {currentPhase === 'EVAPORATION' && (
                  <text x="540" y="220" textAnchor="middle" fill="#1b5e20" fontSize="14" fontWeight="800">Transpiration</text>
                )}
                {[520, 535, 550, 565].map((x, i) => (
                  <g
                    key={i}
                    style={{
                      animation: currentPhase === 'EVAPORATION' ? 'transpirationRise 2.5s ease-out infinite' : 'none',
                      animationDelay: `${i * 0.2}s`,
                      opacity: 0
                    }}
                  >
                    <path d={`M ${x} 245 Q ${x - 3} 235, ${x} 225 T ${x} 205`} stroke="#66bb6a" strokeWidth="1.5" fill="none" strokeDasharray="2 2" />
                  </g>
                ))}
              </g>

              <g>
                {[1, 2].map(cloudNum => (
                  <g key={cloudNum} style={getCloudStyles(cloudNum)}>
                    {cloudNum === 1 && (
                      <text x="0" y="-45" textAnchor="middle" fill="#0d47a1" fontSize="13" fontWeight="700">
                        {currentPhase === 'CONDENSATION' && 'Condensation'}
                        {currentPhase === 'PRECIPITATION' && 'Precipitation'}
                      </text>
                    )}
                    <g filter="url(#cloudShadow)">
                      {[
                        { cx: 0, cy: 0, r: 32 },
                        { cx: -25, cy: 5, r: 23 },
                        { cx: 25, cy: 5, r: 23 },
                        { cx: -10, cy: -8, r: 20 },
                        { cx: 10, cy: -8, r: 20 }
                      ].map((c, i) => (
                        <circle
                          key={i}
                          {...c}
                          fill={getCloudFill()}
                          stroke={getCloudStroke()}
                          strokeWidth="1"
                          style={{ transition: 'fill 5s, stroke 5s' }}
                        />
                      ))}
                    </g>
                  </g>
                ))}
              </g>

              <g style={{ opacity: currentPhase === 'PRECIPITATION' ? 1 : 0, transition: 'opacity 0.8s' }}>
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
                        animation: currentPhase === 'PRECIPITATION' ? 'rainDropFall 1s linear infinite' : 'none',
                        animationDelay: `${(col * 0.12) + (row * 0.05)}s`
                      }}
                    >
                      <circle cx={x} cy={y} r="3" fill="#4a90b8" opacity="0.9" />
                      <ellipse cx={x} cy={y + 4} rx="2" ry="5" fill="#4a90b8" opacity="0.9" />
                    </g>
                  );
                })}
                {[500, 520, 540, 560, 580, 640, 660, 680, 700, 720].map((x, i) => (
                  <ellipse
                    key={i}
                    cx={x}
                    cy={278}
                    rx={6}
                    ry={2}
                    fill="#64b5f6"
                    opacity="0"
                    style={{
                      animation: currentPhase === 'PRECIPITATION' ? 'splashEffect 1s linear infinite' : 'none',
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </g>

              <g style={{ opacity: currentPhase === 'COLLECTION' ? 1 : 0, transition: 'opacity 0.8s' }}>
                <text x="610" y="345" textAnchor="middle" fill="#0d47a1" fontSize="14" fontWeight="800">Infiltration</text>
                {[500, 560, 620, 680, 730].map((x, i) => (
                  <g
                    key={i}
                    style={{
                      animation: currentPhase === 'COLLECTION' ? 'infiltrationDrop 2.5s ease-in infinite' : 'none',
                      animationDelay: `${i * 0.25}s`
                    }}
                  >
                    <line x1={x} y1={350} x2={x} y2={380} stroke="#1976d2" strokeWidth="2.5" strokeLinecap="round" opacity="0" />
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>

        <div style={styles.rightPanel}>
          <div style={styles.topicHeader}>
            <h2 style={styles.topicTitle}>{currentInfo.title}</h2>
          </div>

          <div style={styles.infoSection}>
            <div style={styles.infoBox}>
              <div style={styles.infoTitle}>
                <span>📖</span> What is it?
              </div>
              {currentInfo.simple.map((sentence, index) => (
                <p key={`simple-${index}`} style={styles.infoSentence}>• {sentence}</p>
              ))}
            </div>

            <div style={styles.infoBox}>
              <div style={styles.infoTitle}>
                <span>💡</span> Real-Life Example
              </div>
              {currentInfo.example.map((sentence, index) => (
                <p key={`example-${index}`} style={styles.infoSentence}>• {sentence}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        {(showNavigation || showPlayPause) && (
          <div style={styles.controls}>
            {showNavigation && (
              <button
                style={styles.btn('default', isAutoPlaying)}
                onClick={() => setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length)}
                disabled={isAutoPlaying}
              >
                <ChevronLeftIcon size={isMobile ? 14 : 16} />
                {!isMobile && 'Previous'}
              </button>
            )}
            {showPlayPause && (
              <button
                style={styles.btn('play')}
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              >
                {isAutoPlaying ? <PauseIcon size={isMobile ? 14 : 16} /> : <PlayIcon size={isMobile ? 14 : 16} />}
                {isAutoPlaying ? 'Pause' : isMobile ? 'Play' : 'Auto Play'}
              </button>
            )}
            {showNavigation && (
              <button
                style={styles.btn('default', isAutoPlaying)}
                onClick={() => setCurrentStep((prev) => (prev + 1) % steps.length)}
                disabled={isAutoPlaying}
              >
                {!isMobile && 'Next'}
                <ChevronRightIcon size={isMobile ? 14 : 16} />
              </button>
            )}
            <button
              style={styles.btn('reset')}
              onClick={() => { setCurrentStep(0); setIsAutoPlaying(false); }}
            >
              <RotateCcwIcon size={isMobile ? 14 : 16} />
              {!isMobile && 'Reset'}
            </button>
          </div>
        )}

        {showStepIndicator && (
          <div style={styles.dots}>
            {steps.map((_, i) => (
              <button
                key={i}
                style={styles.dot(i === currentStep)}
                onClick={() => { setCurrentStep(i); setIsAutoPlaying(false); }}
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
  themeColor: string;
}> = ({ questions, themeColor }) => {
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
      setScore(prev => prev + 1);
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

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: isMobile ? '12px' : isTablet ? '16px' : '20px',
      fontFamily: 'Poppins, "Noto Sans", sans-serif',
    },
    header: {
      background: `linear-gradient(135deg, ${themeColor} 0%, #764ba2 100%)`,
      color: 'white',
      padding: isMobile ? '20px' : '30px',
      borderRadius: isMobile ? '10px' : '15px',
      marginBottom: isMobile ? '20px' : '30px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    },
    headerTitle: {
      margin: '0 0 20px 0',
      fontSize: isMobile ? '1.3em' : isTablet ? '1.6em' : '2em',
    },
    progressInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '15px',
      fontSize: isMobile ? '0.9em' : '1.1em',
      flexWrap: 'wrap' as const,
      gap: '8px',
    },
    progressBar: {
      background: 'rgba(255, 255, 255, 0.3)',
      height: isMobile ? '8px' : '10px',
      borderRadius: '5px',
      overflow: 'hidden' as const,
    },
    progressFill: (width: number) => ({
      background: 'white',
      height: '100%',
      width: `${width}%`,
      transition: 'width 0.3s ease',
    }),
    questionCard: {
      background: 'white',
      padding: isMobile ? '20px' : '30px',
      borderRadius: isMobile ? '10px' : '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
    },
    questionText: {
      fontSize: isMobile ? '1.1em' : isTablet ? '1.2em' : '1.4em',
      color: '#333',
      marginBottom: isMobile ? '20px' : '30px',
      lineHeight: '1.6',
    },
    optionsContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: isMobile ? '12px' : '15px',
      marginBottom: isMobile ? '20px' : '25px',
    },
    optionButton: (isSelected: boolean, isCorrect: boolean, isIncorrect: boolean, isDisabled: boolean) => ({
      display: 'flex',
      alignItems: 'center',
      padding: isMobile ? '14px' : '20px',
      border: `2px solid ${isCorrect ? '#4caf50' : isIncorrect ? '#f44336' : isSelected ? themeColor : '#e0e0e0'}`,
      borderRadius: '10px',
      background: isCorrect ? '#e8f5e9' : isIncorrect ? '#ffebee' : isSelected ? '#f0f4ff' : 'white',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      fontSize: isMobile ? '0.9em' : '1em',
      textAlign: 'left' as const,
    }),
    optionLabel: (isCorrect: boolean, isIncorrect: boolean) => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: isMobile ? '28px' : '35px',
      height: isMobile ? '28px' : '35px',
      background: isCorrect ? '#4caf50' : isIncorrect ? '#f44336' : themeColor,
      color: 'white',
      borderRadius: '50%',
      fontWeight: 'bold' as const,
      marginRight: isMobile ? '10px' : '15px',
      flexShrink: 0,
      fontSize: isMobile ? '0.85em' : '1em',
    }),
    optionText: {
      flex: 1,
    },
    icon: {
      marginLeft: '10px',
      fontSize: '1.5em',
      fontWeight: 'bold' as const,
    },
    explanationBox: {
      background: '#fff8e1',
      borderLeft: '4px solid #ffc107',
      padding: isMobile ? '15px' : '20px',
      borderRadius: '8px',
      marginBottom: isMobile ? '15px' : '20px',
    },
    explanationTitle: {
      margin: '0 0 10px 0',
      color: '#f57c00',
      fontSize: isMobile ? '1em' : '1.1em',
    },
    explanationText: {
      margin: 0,
      lineHeight: '1.6',
      color: '#333',
      fontSize: isMobile ? '0.9em' : '1em',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    submitButton: (isDisabled: boolean) => ({
      padding: isMobile ? '12px 30px' : '15px 40px',
      fontSize: isMobile ? '1em' : '1.1em',
      fontWeight: 'bold' as const,
      border: 'none',
      borderRadius: '25px',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      background: isDisabled ? '#ccc' : `linear-gradient(135deg, ${themeColor} 0%, #764ba2 100%)`,
      color: 'white',
    }),
    nextButton: {
      padding: isMobile ? '12px 30px' : '15px 40px',
      fontSize: isMobile ? '1em' : '1.1em',
      fontWeight: 'bold' as const,
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
      color: 'white',
    },
    quizCompleted: {
      textAlign: 'center' as const,
      padding: isMobile ? '20px' : '40px',
    },
    completedTitle: {
      fontSize: isMobile ? '1.8em' : isTablet ? '2.2em' : '2.5em',
      color: themeColor,
      marginBottom: isMobile ? '20px' : '30px',
    },
    scoreDisplay: {
      background: `linear-gradient(135deg, ${themeColor} 0%, #764ba2 100%)`,
      color: 'white',
      padding: isMobile ? '30px' : '40px',
      borderRadius: isMobile ? '10px' : '15px',
      marginBottom: isMobile ? '20px' : '30px',
    },
    scoreNumber: {
      fontSize: isMobile ? '2.5em' : isTablet ? '3.2em' : '4em',
      fontWeight: 'bold' as const,
    },
    scoreTotal: {
      fontSize: isMobile ? '1.5em' : '2em',
      opacity: 0.8,
    },
    scorePercentage: {
      fontSize: isMobile ? '1.2em' : '1.5em',
      margin: '10px 0',
    },
    performanceMessage: {
      fontSize: isMobile ? '1.1em' : '1.3em',
      color: '#333',
      margin: '20px 0',
      padding: isMobile ? '15px' : '20px',
      background: '#f5f5f5',
      borderRadius: '10px',
    },
    restartButton: {
      padding: isMobile ? '12px 40px' : '15px 50px',
      fontSize: isMobile ? '1.1em' : '1.2em',
      fontWeight: 'bold' as const,
      background: `linear-gradient(135deg, ${themeColor} 0%, #764ba2 100%)`,
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
  };

  if (quizCompleted) {
    const percentage = (score / questions.length) * 100;
    let message = '';
    if (score === questions.length) message = '🌟 Perfect! You\'re a Water Cycle expert!';
    else if (percentage >= 80) message = '🎯 Excellent work! You understand the water cycle well!';
    else if (percentage >= 60) message = '👍 Good job! Keep learning about the water cycle!';
    else message = '📚 Keep practicing! Review the water cycle concepts.';

    return (
      <div style={styles.container}>
        <div style={styles.quizCompleted}>
          <h1 style={styles.completedTitle}>🎉 Quiz Completed!</h1>
          <div style={styles.scoreDisplay}>
            <h2>Your Score</h2>
            <div>
              <span style={styles.scoreNumber}>{score}</span>
              <span style={styles.scoreTotal}>/ {questions.length}</span>
            </div>
            <p style={styles.scorePercentage}>{percentage.toFixed(0)}%</p>
          </div>
          <div style={styles.performanceMessage}>
            <p>{message}</p>
          </div>
          <button style={styles.restartButton} onClick={handleRestart}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Water Cycle Practice</h1>
        <div style={styles.progressInfo}>
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div style={styles.progressBar}>
          <div style={styles.progressFill(((currentQuestion + 1) / questions.length) * 100)} />
        </div>
      </div>

      <div style={styles.questionCard}>
        <h2 style={styles.questionText}>{questions[currentQuestion].question}</h2>
        
        <div style={styles.optionsContainer}>
          {questions[currentQuestion].options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = showExplanation && index === questions[currentQuestion].correctAnswer;
            const isIncorrect = showExplanation && selectedAnswer === index && index !== questions[currentQuestion].correctAnswer;
            
            return (
              <button
                key={index}
                style={styles.optionButton(isSelected, isCorrect, isIncorrect, showExplanation)}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
              >
                <span style={styles.optionLabel(isCorrect, isIncorrect)}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span style={styles.optionText}>{option}</span>
                {isCorrect && <span style={styles.icon}>✓</span>}
                {isIncorrect && <span style={styles.icon}>✗</span>}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div style={styles.explanationBox}>
            <h3 style={styles.explanationTitle}>💡 Explanation</h3>
            <p style={styles.explanationText}>{questions[currentQuestion].explanation}</p>
          </div>
        )}

        <div style={styles.buttonContainer}>
          {!showExplanation ? (
            <button 
              style={styles.submitButton(selectedAnswer === null)} 
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </button>
          ) : (
            <button style={styles.nextButton} onClick={handleNext}>
              {currentQuestion < questions.length - 1 ? 'Next Question →' : 'View Results'}
            </button>
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
  themeColor: string;
}> = ({ examples, themeColor }) => {
  const [selectedExample, setSelectedExample] = useState(0);
  const { isMobile, isTablet } = useResponsive();

  const iconMap: { [key: number]: string } = {
    1: "🏔️",
    2: "🏠",
    3: "🛖",
    4: "🧱",
    5: "♨️"
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '12px' : isTablet ? '16px' : '20px',
      fontFamily: 'Poppins, "Noto Sans", sans-serif',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: isMobile ? '24px' : isTablet ? '32px' : '40px',
    },
    title: {
      fontSize: isMobile ? '1.6em' : isTablet ? '2em' : '2.5em',
      background: `linear-gradient(135deg, ${themeColor} 0%, #764ba2 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '10px',
    },
    subtitle: {
      fontSize: isMobile ? '1em' : '1.2em',
      color: '#666',
      padding: '0 10px',
    },
    examplesGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: isMobile ? '12px' : '20px',
      marginBottom: isMobile ? '24px' : isTablet ? '32px' : '40px',
    },
    exampleCard: (isActive: boolean) => ({
      background: isActive ? 'linear-gradient(135deg, #f0f4ff 0%, #e8ebff 100%)' : 'white',
      padding: isMobile ? '16px' : '20px',
      borderRadius: isMobile ? '10px' : '15px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center' as const,
      border: `3px solid ${isActive ? themeColor : 'transparent'}`,
    }),
    exampleIcon: {
      fontSize: isMobile ? '2.5em' : '3em',
      marginBottom: isMobile ? '10px' : '15px',
    },
    exampleTitle: {
      fontSize: isMobile ? '1em' : '1.1em',
      color: '#333',
      marginBottom: '10px',
    },
    exampleLocation: {
      fontSize: isMobile ? '0.85em' : '0.9em',
      color: '#666',
      marginBottom: '10px',
    },
    exampleCategory: {
      display: 'inline-block',
      padding: isMobile ? '4px 12px' : '5px 15px',
      background: themeColor,
      color: 'white',
      borderRadius: '20px',
      fontSize: isMobile ? '0.8em' : '0.85em',
      fontWeight: 'bold' as const,
    },
    detailSection: {
      background: 'white',
      borderRadius: isMobile ? '10px' : '15px',
      padding: isMobile ? '20px' : isTablet ? '25px' : '30px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
    },
    detailHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isMobile ? '20px' : '25px',
      paddingBottom: isMobile ? '15px' : '20px',
      borderBottom: '2px solid #f0f0f0',
      flexWrap: 'wrap' as const,
      gap: isMobile ? '10px' : '15px',
    },
    detailTitle: {
      color: '#333',
      margin: 0,
      fontSize: isMobile ? '1.4em' : isTablet ? '1.7em' : '2em',
    },
    detailCategory: {
      padding: isMobile ? '6px 16px' : '8px 20px',
      background: `linear-gradient(135deg, ${themeColor} 0%, #764ba2 100%)`,
      color: 'white',
      borderRadius: '20px',
      fontWeight: 'bold' as const,
      fontSize: isMobile ? '0.85em' : '1em',
    },
    locationBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: isMobile ? '8px' : '10px',
      padding: isMobile ? '10px 16px' : '12px 20px',
      background: '#f0f4ff',
      borderRadius: '10px',
      marginBottom: isMobile ? '16px' : '20px',
      fontSize: isMobile ? '0.9em' : '1em',
    },
    description: {
      fontSize: isMobile ? '1em' : '1.1em',
      lineHeight: '1.8',
      color: '#444',
      marginBottom: isMobile ? '20px' : '30px',
    },
    sectionTitle: {
      color: themeColor,
      marginBottom: isMobile ? '16px' : '20px',
      fontSize: isMobile ? '1.1em' : '1.3em',
    },
    featuresList: {
      listStyle: 'none',
      padding: 0,
    },
    featureItem: {
      display: 'flex',
      alignItems: 'flex-start',
      padding: isMobile ? '12px' : '15px',
      marginBottom: '10px',
      background: '#f8f9fa',
      borderRadius: '10px',
      fontSize: isMobile ? '0.95em' : '1.05em',
      lineHeight: '1.6',
    },
    featureIcon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: isMobile ? '22px' : '25px',
      height: isMobile ? '22px' : '25px',
      background: '#4caf50',
      color: 'white',
      borderRadius: '50%',
      marginRight: isMobile ? '12px' : '15px',
      flexShrink: 0,
      fontWeight: 'bold' as const,
      fontSize: isMobile ? '0.8em' : '0.9em',
    },
    impactCard: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: isMobile ? '12px' : '20px',
      padding: isMobile ? '18px' : '25px',
      background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
      borderRadius: isMobile ? '10px' : '15px',
      marginBottom: isMobile ? '18px' : '25px',
      borderLeft: '5px solid #ffc107',
      flexDirection: isMobile ? 'column' as const : 'row' as const,
      alignItems: isMobile ? 'center' : 'flex-start',
    },
    impactIcon: {
      fontSize: isMobile ? '2em' : '2.5em',
      flexShrink: 0,
    },
    impactText: {
      fontSize: isMobile ? '1em' : '1.1em',
      lineHeight: '1.7',
      color: '#333',
      margin: 0,
      flex: 1,
    },
    connectionBox: {
      padding: isMobile ? '18px' : '25px',
      background: '#e8f5e9',
      borderRadius: isMobile ? '10px' : '15px',
      borderLeft: '5px solid #4caf50',
    },
    connectionTitle: {
      color: '#2e7d32',
      margin: '0 0 15px 0',
      fontSize: isMobile ? '1.1em' : '1.2em',
    },
    connectionText: {
      fontSize: isMobile ? '1em' : '1.05em',
      lineHeight: '1.7',
      color: '#333',
      margin: 0,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🌍 Real World Applications</h1>
        <p style={styles.subtitle}>Discover how heat transfer and water cycle concepts are applied in real life</p>
      </div>

      <div style={styles.examplesGrid}>
        {examples.map((example, index) => (
          <div
            key={example.id}
            style={styles.exampleCard(selectedExample === index)}
            onClick={() => setSelectedExample(index)}
          >
            <div style={styles.exampleIcon}>{iconMap[example.id]}</div>
            <h3 style={styles.exampleTitle}>{example.title}</h3>
            <p style={styles.exampleLocation}>📍 {example.location}</p>
            <span style={styles.exampleCategory}>{example.category}</span>
          </div>
        ))}
      </div>

      <div style={styles.detailSection}>
        <div style={styles.detailHeader}>
          <h2 style={styles.detailTitle}>{examples[selectedExample].title}</h2>
          <span style={styles.detailCategory}>{examples[selectedExample].category}</span>
        </div>

        <div style={styles.locationBadge}>
          <span style={{ fontSize: '1.3em' }}>📍</span>
          <strong>Location:</strong> {examples[selectedExample].location}
        </div>

        <p style={styles.description}>{examples[selectedExample].description}</p>

        <div style={styles.impactCard}>
          <span style={styles.impactIcon}>⚡</span>
          <p style={styles.impactText}>
            <strong>Real-World Impact:</strong> {examples[selectedExample].impact}
          </p>
        </div>

        <h3 style={styles.sectionTitle}>Key Features</h3>
        <ul style={styles.featuresList}>
          {examples[selectedExample].keyFeatures.map((feature, index) => (
            <li key={index} style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              {feature}
            </li>
          ))}
        </ul>

        <div style={styles.connectionBox}>
          <h3 style={styles.connectionTitle}>🔗 Connection to Water Cycle & Heat Transfer</h3>
          <p style={styles.connectionText}>{examples[selectedExample].connection}</p>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const WaterCycleTool: React.FC<WaterCycleToolProps> = ({ props = {}, setStepDetails, stopAutoNext, setStopAutoNext }) => {
  const {
    width = 800,
    height = 600,
    initialMode = "learn",
    showModeSelector = true,
    enabledModes = ["learn", "practice", "realWorld"],
    showNavigation = true,
    showPlayPause = true,
    showStepIndicator = true,
    initialStep = 0,
    filterSteps,
    animationSpeed = 1,
    autoPlayDuration = 7000,
    themeColor = "#2196f3",
    darkMode = false,
    additionalProps = {},
  } = props;

  const {
    customPhases,
    customQuestions,
    customExamples,
  } = additionalProps;

  const [activeTab, setActiveTab] = useState<ModeType>(initialMode);
  const { isMobile, isTablet, isSmallScreen } = useResponsive();

  const phases = useMemo(() => customPhases || DEFAULT_PHASES, [customPhases]);
  const questions = useMemo(() => customQuestions || DEFAULT_QUESTIONS, [customQuestions]);
  const examples = useMemo(() => customExamples || DEFAULT_EXAMPLES, [customExamples]);
  
  const steps = useMemo(() => {
    let allSteps = DEFAULT_STEPS;
    if (filterSteps && filterSteps.length > 0) {
      allSteps = allSteps.filter((_, index) => filterSteps.includes(index + 1));
    }
    return allSteps;
  }, [filterSteps]);

  useEffect(() => {
    const styleId = "water-cycle-animations";
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

  const appContainerStyle: CSSProperties = {
    minHeight: '100vh',
    background: darkMode
      ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
      : 'linear-gradient(135deg, #eff6ff 0%, #d1fae5 100%)',
  };

  const navStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    background: darkMode ? '#1f2937' : '#ffffff',
    borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  const navContentStyle: CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: isMobile ? '0 12px' : '0 16px',
  };

  const navInnerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: isMobile ? '56px' : '64px',
    gap: '12px',
  };

  const logoStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '6px' : '8px',
  };

  const logoTextStyle: CSSProperties = {
    fontSize: isMobile ? '16px' : '20px',
    fontWeight: '700',
    background: `linear-gradient(135deg, ${themeColor} 0%, #14b8a6 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    whiteSpace: 'nowrap' as const,
  };

  const tabsStyle: CSSProperties = {
    display: 'flex',
    gap: isMobile ? '4px' : '8px',
    flexWrap: 'wrap' as const,
  };

  const tabButtonBaseStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '4px' : '8px',
    padding: isMobile ? '6px 10px' : '8px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: isMobile ? '12px' : '14px',
    whiteSpace: 'nowrap' as const,
  };

  const getTabStyle = (tab: ModeType): CSSProperties => ({
    ...tabButtonBaseStyle,
    background: activeTab === tab ? `linear-gradient(135deg, ${themeColor} 0%, #14b8a6 100%)` : 'transparent',
    color: activeTab === tab ? '#ffffff' : darkMode ? '#e5e7eb' : '#374151',
  });

  const contentStyle: CSSProperties = {
    paddingTop: isMobile ? '56px' : '64px',
    padding: isMobile ? '56px 0 0' : '64px 16px 16px',
  };

  return (
    <div style={appContainerStyle}>
      {showModeSelector && (
        <nav style={navStyle}>
          <div style={navContentStyle}>
            <div style={navInnerStyle}>
              <div style={logoStyle}>
                <DropletIcon size={isMobile ? 20 : 24} color={themeColor} />
                <span style={logoTextStyle}>Water Cycle</span>
              </div>

              <div style={tabsStyle}>
                {enabledModes.includes("learn") && (
                  <button onClick={() => setActiveTab("learn")} style={getTabStyle("learn")}>
                    <BookOpenIcon size={isMobile ? 16 : 20} />
                    {!isMobile && 'Learn'}
                  </button>
                )}
                {enabledModes.includes("practice") && (
                  <button onClick={() => setActiveTab("practice")} style={getTabStyle("practice")}>
                    <ClipboardCheckIcon size={isMobile ? 16 : 20} />
                    {!isMobile && 'Practice'}
                  </button>
                )}
                {enabledModes.includes("realWorld") && (
                  <button onClick={() => setActiveTab("realWorld")} style={getTabStyle("realWorld")}>
                    <GlobeIcon size={isMobile ? 16 : 20} />
                    {!isMobile && 'Real World'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      <div style={contentStyle}>
        {activeTab === "learn" ? (
          <LearnMode
            steps={steps}
            phases={phases}
            autoPlayDuration={autoPlayDuration}
            animationSpeed={animationSpeed}
            showNavigation={showNavigation}
            showPlayPause={showPlayPause}
            showStepIndicator={showStepIndicator}
            themeColor={themeColor}
            setStepDetails={setStepDetails}
          />
        ) : activeTab === "practice" ? (
          <PracticeMode questions={questions} themeColor={themeColor} />
        ) : (
          <RealWorldMode examples={examples} themeColor={themeColor} />
        )}
      </div>
    </div>
  );
};

export default WaterCycleTool;