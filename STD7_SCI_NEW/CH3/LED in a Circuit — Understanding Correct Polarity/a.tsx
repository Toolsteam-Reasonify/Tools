// @ts-expect-error - React types should be available at runtime
import React, { useState, useEffect, useMemo, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

type ModeType = "learn" | "practice" | "real_world" | "hands_on";

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
  [key: string]: any;
}

interface StepDataInterface {
  id: number;
  title: string;
  description: string;
  type: "intro" | "explanation" | "practice" | "real_world" | "hands_on";
  mode: ModeType;
  data?: any;
}

interface StepDetails {
  step: number;
  title: string;
  description: string;
  mode: ModeType;
}

interface CircuitComponent {
  id: string;
  type:
    | "cell"
    | "battery"
    | "lamp"
    | "led"
    | "switch"
    | "wire"
    | "conductor"
    | "insulator";
  position: { x: number; y: number };
  connections: string[];
  state?: "on" | "off" | "open" | "closed";
  polarity?: "correct" | "incorrect" | "neutral";
}

interface Circuit {
  id: string;
  svg: React.ReactElement;
  isCorrect: boolean;
}

interface PracticeQuestion {
  id: string;
  question: string;
  type: "diagram";
  circuits: Circuit[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

interface ElectricalComponent {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
}

interface CircuitAdditionalProps {
  components?: CircuitComponent[];
  highlightComponent?: string;
  showCircuitExample?: boolean;
  customLabels?: {
    positive?: string;
    negative?: string;
  };
  questions?: PracticeQuestion[];
  showHints?: boolean;
  maxAttempts?: number;
  [key: string]: any;
}

interface ElectricCircuitToolProps {
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
    additionalProps?: CircuitAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM TOKENS (from Singularity PDF)
// ═══════════════════════════════════════════════════════════════════════════

const DS = {
  colors: {
    primary: "#4A4DC9",
    secondary: "#FF7212",
    gradientStart: "#533086",
    gradientEnd: "#FC9145",
    lightPrimary: "#C1C1EA",
    lightSecondary: "#FFF3E4",
    neutral900: "#4E4E4E",
    neutral500: "#CACACA",
    neutral300: "#EBEBEB",
    neutral100: "#F5F5F5",
    white: "#FFFFFF",
    black: "#1A1A2E",
    success: "#2ECC71",
    error: "#E74C3C",
    warning: "#F39C12",
  },
  font: "'Poppins', sans-serif",
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    full: "9999px",
  },
  shadow: {
    sm: "0 1px 3px rgba(74, 77, 201, 0.08)",
    md: "0 4px 16px rgba(74, 77, 201, 0.10)",
    lg: "0 12px 32px rgba(74, 77, 201, 0.14)",
    xl: "0 20px 48px rgba(74, 77, 201, 0.18)",
    glow: "0 0 24px rgba(74, 77, 201, 0.25)",
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
    paddingY: "24px",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// SVG ICON COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const CheckCircleIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const XCircleIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const ChevronRightIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ChevronLeftIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const LightbulbIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="9" y1="18" x2="15" y2="18" />
    <line x1="10" y1="22" x2="14" y2="22" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);

const PlayIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const PauseIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const RotateCcwIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const ElectricCircuitTool = ({
  props = {},
  setStepDetails,
  stopAutoNext = false,
  setStopAutoNext,
}) => {
  const {
    width = 800,
    height = 600,
    data = {},
    steps = [],
    initialMode = "learn",
    showModeSelector = true,
    enabledModes = ["learn", "practice", "real_world", "hands_on"],
    showNavigation = true,
    showPlayPause = true,
    showStepIndicator = true,
    initialStep = 0,
    filterSteps,
    animationSpeed = 1,
    autoPlayDuration = 8000,
    themeColor = DS.colors.primary,
    darkMode = false,
    additionalProps = {},
  } = props;

  const {
    components = [],
    highlightComponent,
    showCircuitExample = true,
    customLabels = {},
    questions = [],
    showHints: showHintsDefault = true,
    maxAttempts = 3,
  } = additionalProps;

  // ─────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────
  const [currentMode, setCurrentMode] = useState(initialMode);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [practiceSubmitted, setPracticeSubmitted] = useState({});
  const [showHints, setShowHints] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  // NEW: Learn mode pagination index
  const [learnIndex, setLearnIndex] = useState(0);

  // ─────────────────────────────────────────────────────────────────────
  // INJECT KEYFRAMES + FONT
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap";
    fontLink.rel = "stylesheet";
    fontLink.id = "singularity-font";
    if (!document.getElementById("singularity-font")) {
      document.head.appendChild(fontLink);
    }

    const keyframes = `
      @keyframes sgFadeIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes sgFadeInUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes sgScaleIn {
        from { transform: scale(0.92); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      @keyframes sgPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.04); }
      }
      @keyframes sgSlideRight {
        from { opacity: 0; transform: translateX(16px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes sgGlow {
        0%, 100% { box-shadow: 0 0 8px ${DS.colors.primary}30; }
        50% { box-shadow: 0 0 24px ${DS.colors.primary}60; }
      }
      @keyframes sgGradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes sgFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
      }
      @keyframes sgShimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.id = "singularity-keyframes";
    styleSheet.textContent = keyframes;
    if (!document.getElementById("singularity-keyframes")) {
      document.head.appendChild(styleSheet);
    }
    return () => {
      const existing = document.getElementById("singularity-keyframes");
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────
  // FILTERED STEPS
  // ─────────────────────────────────────────────────────────────────────
  const filteredSteps = useMemo(() => {
    if (!filterSteps) return steps;
    return steps.filter((step) => filterSteps.includes(step.id));
  }, [steps, filterSteps]);

  // ─────────────────────────────────────────────────────────────────────
  // ELECTRICAL COMPONENTS DATA
  // ─────────────────────────────────────────────────────────────────────
  const electricalComponents = useMemo(
    () => [
      {
        id: "cell",
        name: "Electric Cell",
        category: "Power Source",
        description:
          "A single cell that provides electrical energy. The longer line is positive (+), and the shorter line is negative (-).",
        icon: "🔋",
      },
      {
        id: "battery",
        name: "Battery",
        category: "Power Source",
        description:
          "Multiple cells connected together to provide more electrical energy. The longer line is positive (+), and the shorter line is negative (-).",
        icon: "🔋",
      },
      {
        id: "lamp",
        name: "Electric Lamp/Bulb",
        category: "Output Device",
        description:
          "Converts electrical energy to light energy. Represented by a circle with an X inside.",
        icon: "💡",
      },
      {
        id: "led",
        name: "LED (Light Emitting Diode)",
        category: "Output Device",
        description:
          "A special light that only works when connected in the correct direction. Shows arrows representing light rays.",
        icon: "💡",
      },
      {
        id: "switch-on",
        name: "Switch (ON)",
        category: "Control Device",
        description:
          "A switch in the ON position allows electricity to flow through the circuit.",
        icon: "🔘",
      },
      {
        id: "switch-off",
        name: "Switch (OFF)",
        category: "Control Device",
        description:
          "A switch in the OFF position breaks the circuit and stops electricity flow.",
        icon: "🔘",
      },
      {
        id: "wire",
        name: "Connecting Wire",
        category: "Conductor",
        description:
          "Wires connect components and allow electricity to flow through the circuit.",
        icon: "⚡",
      },
    ],
    [],
  );

  // The total number of learn "pages": components + 1 for the complete circuit example
  const totalLearnPages =
    electricalComponents.length + (showCircuitExample ? 1 : 0);

  // ─────────────────────────────────────────────────────────────────────
  // PRACTICE QUESTIONS
  // ─────────────────────────────────────────────────────────────────────
  const practiceQuestions = useMemo(() => {
    if (questions.length > 0) return questions;
    return [
      {
        id: "p1",
        question:
          "Which circuit diagram correctly shows a simple torch circuit with a cell and a lamp?",
        type: "diagram",
        circuits: [
          {
            id: "p1a",
            svg: (
              <svg width="250" height="150" viewBox="0 0 250 150">
                <line
                  x1="40"
                  y1="75"
                  x2="70"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="70"
                  y1="60"
                  x2="70"
                  y2="90"
                  stroke={DS.colors.black}
                  strokeWidth="3"
                />
                <line
                  x1="80"
                  y1="65"
                  x2="80"
                  y2="85"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <line
                  x1="80"
                  y1="75"
                  x2="110"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <circle
                  cx="140"
                  cy="75"
                  r="20"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                  fill="none"
                />
                <line
                  x1="125"
                  y1="60"
                  x2="155"
                  y2="90"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <line
                  x1="155"
                  y1="60"
                  x2="125"
                  y2="90"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <line
                  x1="160"
                  y1="75"
                  x2="210"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="40"
                  y1="75"
                  x2="40"
                  y2="110"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="40"
                  y1="110"
                  x2="210"
                  y2="110"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="210"
                  y1="110"
                  x2="210"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <text
                  x="65"
                  y="50"
                  fontSize="12"
                  fill={DS.colors.primary}
                  fontFamily={DS.font}
                >
                  +
                </text>
                <text
                  x="75"
                  y="105"
                  fontSize="12"
                  fill={DS.colors.secondary}
                  fontFamily={DS.font}
                >
                  -
                </text>
              </svg>
            ),
            isCorrect: true,
          },
          {
            id: "p1b",
            svg: (
              <svg width="250" height="150" viewBox="0 0 250 150">
                <line
                  x1="40"
                  y1="75"
                  x2="70"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="70"
                  y1="60"
                  x2="70"
                  y2="90"
                  stroke={DS.colors.black}
                  strokeWidth="3"
                />
                <line
                  x1="80"
                  y1="65"
                  x2="80"
                  y2="85"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <line
                  x1="80"
                  y1="75"
                  x2="110"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <path
                  d="M 115 75 L 145 60 L 145 90 Z"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                  fill="none"
                />
                <line
                  x1="145"
                  y1="75"
                  x2="155"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="155"
                  y1="60"
                  x2="155"
                  y2="90"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <path
                  d="M 135 50 L 145 40 M 140 50 L 145 40 L 145 45"
                  stroke={DS.colors.secondary}
                  strokeWidth="1.5"
                  fill="none"
                />
                <line
                  x1="155"
                  y1="75"
                  x2="210"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="40"
                  y1="75"
                  x2="40"
                  y2="110"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="40"
                  y1="110"
                  x2="210"
                  y2="110"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="210"
                  y1="110"
                  x2="210"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
              </svg>
            ),
            isCorrect: false,
          },
        ],
        correctAnswer: "p1a",
        explanation:
          "A simple torch circuit needs a cell (power source) and a lamp (light output). The first diagram correctly shows this with proper circuit symbols.",
        hint: "Look for the circuit with a lamp symbol (circle with X) and a single cell.",
      },
      {
        id: "p2",
        question:
          "Which circuit shows a battery connected to an LED in the correct direction?",
        type: "diagram",
        circuits: [
          {
            id: "p2a",
            svg: (
              <svg width="250" height="150" viewBox="0 0 250 150">
                <line
                  x1="30"
                  y1="75"
                  x2="50"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="50"
                  y1="60"
                  x2="50"
                  y2="90"
                  stroke={DS.colors.black}
                  strokeWidth="3"
                />
                <line
                  x1="60"
                  y1="65"
                  x2="60"
                  y2="85"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <line
                  x1="70"
                  y1="60"
                  x2="70"
                  y2="90"
                  stroke={DS.colors.black}
                  strokeWidth="3"
                />
                <line
                  x1="80"
                  y1="65"
                  x2="80"
                  y2="85"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <line
                  x1="80"
                  y1="75"
                  x2="110"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <path
                  d="M 115 75 L 145 60 L 145 90 Z"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                  fill="none"
                />
                <line
                  x1="145"
                  y1="75"
                  x2="155"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="155"
                  y1="60"
                  x2="155"
                  y2="90"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <path
                  d="M 135 50 L 145 40 M 140 50 L 145 40 L 145 45"
                  stroke={DS.colors.secondary}
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M 145 50 L 155 40 M 150 50 L 155 40 L 155 45"
                  stroke={DS.colors.secondary}
                  strokeWidth="1.5"
                  fill="none"
                />
                <line
                  x1="155"
                  y1="75"
                  x2="220"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="30"
                  y1="75"
                  x2="30"
                  y2="110"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="30"
                  y1="110"
                  x2="220"
                  y2="110"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="220"
                  y1="110"
                  x2="220"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <text
                  x="45"
                  y="50"
                  fontSize="12"
                  fill={DS.colors.primary}
                  fontFamily={DS.font}
                >
                  +
                </text>
                <text
                  x="120"
                  y="95"
                  fontSize="12"
                  fill={DS.colors.success}
                  fontFamily={DS.font}
                >
                  +
                </text>
                <text
                  x="150"
                  y="95"
                  fontSize="12"
                  fill={DS.colors.error}
                  fontFamily={DS.font}
                >
                  -
                </text>
              </svg>
            ),
            isCorrect: true,
          },
          {
            id: "p2b",
            svg: (
              <svg width="250" height="150" viewBox="0 0 250 150">
                <line
                  x1="30"
                  y1="75"
                  x2="50"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="50"
                  y1="60"
                  x2="50"
                  y2="90"
                  stroke={DS.colors.black}
                  strokeWidth="3"
                />
                <line
                  x1="60"
                  y1="65"
                  x2="60"
                  y2="85"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <line
                  x1="60"
                  y1="75"
                  x2="110"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <path
                  d="M 115 75 L 145 60 L 145 90 Z"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                  fill="none"
                />
                <line
                  x1="145"
                  y1="75"
                  x2="155"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="155"
                  y1="60"
                  x2="155"
                  y2="90"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <path
                  d="M 135 50 L 145 40 M 140 50 L 145 40 L 145 45"
                  stroke={DS.colors.secondary}
                  strokeWidth="1.5"
                  fill="none"
                />
                <line
                  x1="155"
                  y1="75"
                  x2="220"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="30"
                  y1="75"
                  x2="30"
                  y2="110"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="30"
                  y1="110"
                  x2="220"
                  y2="110"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="220"
                  y1="110"
                  x2="220"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
              </svg>
            ),
            isCorrect: false,
          },
        ],
        correctAnswer: "p2a",
        explanation:
          "LEDs only work when connected in the correct direction. The positive side of the battery must connect to the positive side of the LED (triangle point).",
        hint: "Remember: LEDs need the correct polarity. The triangle points to the positive terminal.",
      },
      {
        id: "p3",
        question:
          "Which circuit shows a switch in the OFF position that would prevent the lamp from lighting?",
        type: "diagram",
        circuits: [
          {
            id: "p3a",
            svg: (
              <svg width="250" height="150" viewBox="0 0 250 150">
                <line
                  x1="40"
                  y1="75"
                  x2="70"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="70"
                  y1="60"
                  x2="70"
                  y2="90"
                  stroke={DS.colors.black}
                  strokeWidth="3"
                />
                <line
                  x1="80"
                  y1="65"
                  x2="80"
                  y2="85"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <line
                  x1="80"
                  y1="75"
                  x2="100"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <circle cx="110" cy="75" r="3" fill={DS.colors.black} />
                <circle cx="140" cy="75" r="3" fill={DS.colors.black} />
                <line
                  x1="110"
                  y1="75"
                  x2="135"
                  y2="65"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <line
                  x1="140"
                  y1="75"
                  x2="160"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <circle
                  cx="185"
                  cy="75"
                  r="20"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                  fill="none"
                />
                <line
                  x1="170"
                  y1="60"
                  x2="200"
                  y2="90"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <line
                  x1="200"
                  y1="60"
                  x2="170"
                  y2="90"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <line
                  x1="205"
                  y1="75"
                  x2="210"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="40"
                  y1="75"
                  x2="40"
                  y2="110"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="40"
                  y1="110"
                  x2="210"
                  y2="110"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="210"
                  y1="110"
                  x2="210"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <text
                  x="120"
                  y="58"
                  fontSize="11"
                  fill={DS.colors.error}
                  fontFamily={DS.font}
                  fontWeight="600"
                >
                  OFF
                </text>
              </svg>
            ),
            isCorrect: true,
          },
          {
            id: "p3b",
            svg: (
              <svg width="250" height="150" viewBox="0 0 250 150">
                <line
                  x1="40"
                  y1="75"
                  x2="70"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="70"
                  y1="60"
                  x2="70"
                  y2="90"
                  stroke={DS.colors.black}
                  strokeWidth="3"
                />
                <line
                  x1="80"
                  y1="65"
                  x2="80"
                  y2="85"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <line
                  x1="80"
                  y1="75"
                  x2="100"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <circle cx="110" cy="75" r="3" fill={DS.colors.black} />
                <circle cx="140" cy="75" r="3" fill={DS.colors.black} />
                <line
                  x1="110"
                  y1="75"
                  x2="140"
                  y2="75"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <line
                  x1="140"
                  y1="75"
                  x2="160"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <circle
                  cx="185"
                  cy="75"
                  r="20"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                  fill="none"
                />
                <line
                  x1="170"
                  y1="60"
                  x2="200"
                  y2="90"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <line
                  x1="200"
                  y1="60"
                  x2="170"
                  y2="90"
                  stroke={DS.colors.black}
                  strokeWidth="2"
                />
                <line
                  x1="205"
                  y1="75"
                  x2="210"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="40"
                  y1="75"
                  x2="40"
                  y2="110"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="40"
                  y1="110"
                  x2="210"
                  y2="110"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <line
                  x1="210"
                  y1="110"
                  x2="210"
                  y2="75"
                  stroke={DS.colors.primary}
                  strokeWidth="2"
                />
                <text
                  x="120"
                  y="58"
                  fontSize="11"
                  fill={DS.colors.success}
                  fontFamily={DS.font}
                  fontWeight="600"
                >
                  ON
                </text>
              </svg>
            ),
            isCorrect: false,
          },
        ],
        correctAnswer: "p3a",
        explanation:
          "When a switch is OFF (open), it creates a gap in the circuit, preventing electricity from flowing and the lamp won't light up.",
        hint: "Look for the switch symbol that shows a gap - this means it's open or OFF.",
      },
    ];
  }, [questions]);

  // ─────────────────────────────────────────────────────────────────────
  // SVG CIRCUIT SYMBOLS
  // ─────────────────────────────────────────────────────────────────────
  const positiveLabel = customLabels.positive || "+";
  const negativeLabel = customLabels.negative || "-";

  const ElectricCellSVG = () => (
    <svg
      width="120"
      height="60"
      viewBox="0 0 120 60"
      aria-label="Electric Cell"
    >
      <line
        x1="10"
        y1="30"
        x2="40"
        y2="30"
        stroke={DS.colors.secondary}
        strokeWidth="3"
      />
      <line
        x1="40"
        y1="20"
        x2="40"
        y2="40"
        stroke={DS.colors.black}
        strokeWidth="4"
      />
      <line
        x1="80"
        y1="15"
        x2="80"
        y2="45"
        stroke={DS.colors.black}
        strokeWidth="4"
      />
      <line
        x1="80"
        y1="30"
        x2="110"
        y2="30"
        stroke={DS.colors.secondary}
        strokeWidth="3"
      />
      <text
        x="35"
        y="15"
        fontSize="12"
        fontWeight="bold"
        fill={DS.colors.error}
        fontFamily={DS.font}
      >
        {negativeLabel}
      </text>
      <text
        x="75"
        y="15"
        fontSize="12"
        fontWeight="bold"
        fill={DS.colors.primary}
        fontFamily={DS.font}
      >
        {positiveLabel}
      </text>
    </svg>
  );

  const BatterySVG = () => (
    <svg width="140" height="60" viewBox="0 0 140 60" aria-label="Battery">
      <line
        x1="10"
        y1="30"
        x2="30"
        y2="30"
        stroke={DS.colors.secondary}
        strokeWidth="3"
      />
      <line
        x1="30"
        y1="20"
        x2="30"
        y2="40"
        stroke={DS.colors.black}
        strokeWidth="4"
      />
      <line
        x1="50"
        y1="15"
        x2="50"
        y2="45"
        stroke={DS.colors.black}
        strokeWidth="4"
      />
      <line
        x1="70"
        y1="20"
        x2="70"
        y2="40"
        stroke={DS.colors.black}
        strokeWidth="4"
      />
      <line
        x1="90"
        y1="15"
        x2="90"
        y2="45"
        stroke={DS.colors.black}
        strokeWidth="4"
      />
      <line
        x1="110"
        y1="20"
        x2="110"
        y2="40"
        stroke={DS.colors.black}
        strokeWidth="4"
      />
      <line
        x1="110"
        y1="30"
        x2="130"
        y2="30"
        stroke={DS.colors.secondary}
        strokeWidth="3"
      />
      <text
        x="25"
        y="15"
        fontSize="12"
        fontWeight="bold"
        fill={DS.colors.error}
        fontFamily={DS.font}
      >
        {negativeLabel}
      </text>
      <text
        x="105"
        y="15"
        fontSize="12"
        fontWeight="bold"
        fill={DS.colors.primary}
        fontFamily={DS.font}
      >
        {positiveLabel}
      </text>
    </svg>
  );

  const ElectricLampSVG = () => (
    <svg
      width="120"
      height="80"
      viewBox="0 0 120 80"
      aria-label="Electric Lamp"
    >
      <line
        x1="10"
        y1="40"
        x2="35"
        y2="40"
        stroke={DS.colors.secondary}
        strokeWidth="3"
      />
      <circle
        cx="60"
        cy="40"
        r="20"
        stroke={DS.colors.black}
        strokeWidth="3"
        fill="none"
      />
      <line
        x1="50"
        y1="30"
        x2="70"
        y2="50"
        stroke={DS.colors.black}
        strokeWidth="2"
      />
      <line
        x1="50"
        y1="50"
        x2="70"
        y2="30"
        stroke={DS.colors.black}
        strokeWidth="2"
      />
      <line
        x1="85"
        y1="40"
        x2="110"
        y2="40"
        stroke={DS.colors.secondary}
        strokeWidth="3"
      />
    </svg>
  );

  const LEDSVG = () => (
    <svg width="140" height="80" viewBox="0 0 140 80" aria-label="LED">
      <line
        x1="10"
        y1="40"
        x2="40"
        y2="40"
        stroke={DS.colors.secondary}
        strokeWidth="3"
      />
      <polygon
        points="40,25 40,55 70,40"
        stroke={DS.colors.black}
        strokeWidth="3"
        fill="none"
      />
      <line
        x1="70"
        y1="25"
        x2="70"
        y2="55"
        stroke={DS.colors.black}
        strokeWidth="3"
      />
      <line
        x1="70"
        y1="40"
        x2="100"
        y2="40"
        stroke={DS.colors.secondary}
        strokeWidth="3"
      />
      <line
        x1="50"
        y1="20"
        x2="60"
        y2="10"
        stroke={DS.colors.secondary}
        strokeWidth="2"
      />
      <polygon points="60,10 55,12 58,15" fill={DS.colors.secondary} />
      <line
        x1="60"
        y1="20"
        x2="70"
        y2="10"
        stroke={DS.colors.secondary}
        strokeWidth="2"
      />
      <polygon points="70,10 65,12 68,15" fill={DS.colors.secondary} />
    </svg>
  );

  const SwitchOnSVG = () => (
    <svg width="120" height="60" viewBox="0 0 120 60" aria-label="Switch ON">
      <line
        x1="10"
        y1="30"
        x2="40"
        y2="30"
        stroke={DS.colors.secondary}
        strokeWidth="3"
      />
      <circle cx="40" cy="30" r="4" fill={DS.colors.black} />
      <line
        x1="40"
        y1="30"
        x2="80"
        y2="30"
        stroke={DS.colors.black}
        strokeWidth="3"
      />
      <circle cx="80" cy="30" r="4" fill={DS.colors.black} />
      <line
        x1="80"
        y1="30"
        x2="110"
        y2="30"
        stroke={DS.colors.secondary}
        strokeWidth="3"
      />
      <text
        x="50"
        y="20"
        fontSize="10"
        fill={DS.colors.success}
        fontWeight="bold"
        fontFamily={DS.font}
      >
        ON
      </text>
    </svg>
  );

  const SwitchOffSVG = () => (
    <svg width="120" height="60" viewBox="0 0 120 60" aria-label="Switch OFF">
      <line
        x1="10"
        y1="30"
        x2="40"
        y2="30"
        stroke={DS.colors.secondary}
        strokeWidth="3"
      />
      <circle cx="40" cy="30" r="4" fill={DS.colors.black} />
      <line
        x1="40"
        y1="30"
        x2="75"
        y2="15"
        stroke={DS.colors.black}
        strokeWidth="3"
      />
      <circle cx="80" cy="30" r="4" fill={DS.colors.black} />
      <line
        x1="80"
        y1="30"
        x2="110"
        y2="30"
        stroke={DS.colors.secondary}
        strokeWidth="3"
      />
      <line
        x1="75"
        y1="15"
        x2="85"
        y2="10"
        stroke={DS.colors.error}
        strokeWidth="1"
        strokeDasharray="2,2"
      />
      <text
        x="50"
        y="12"
        fontSize="10"
        fill={DS.colors.error}
        fontWeight="bold"
        fontFamily={DS.font}
      >
        OFF
      </text>
    </svg>
  );

  const WireSVG = () => (
    <svg width="120" height="40" viewBox="0 0 120 40" aria-label="Wire">
      <line
        x1="10"
        y1="20"
        x2="110"
        y2="20"
        stroke={DS.colors.secondary}
        strokeWidth="4"
      />
      <circle cx="10" cy="20" r="3" fill={DS.colors.black} />
      <circle cx="110" cy="20" r="3" fill={DS.colors.black} />
    </svg>
  );

  const renderSymbol = (id) => {
    switch (id) {
      case "cell":
        return <ElectricCellSVG />;
      case "battery":
        return <BatterySVG />;
      case "lamp":
        return <ElectricLampSVG />;
      case "led":
        return <LEDSVG />;
      case "switch-on":
        return <SwitchOnSVG />;
      case "switch-off":
        return <SwitchOffSVG />;
      case "wire":
        return <WireSVG />;
      default:
        return null;
    }
  };

  // ─────────────────────────────────────────────────────────────────────
  // DESIGN SYSTEM BUTTON COMPONENT
  // ─────────────────────────────────────────────────────────────────────
  const DSButton = ({
    variant = "contained",
    color = "primary",
    disabled = false,
    onClick,
    children,
    style = {},
    fullWidth = false,
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const colorMap = {
      primary: DS.colors.primary,
      secondary: DS.colors.secondary,
      neutral: DS.colors.neutral900,
    };
    const lightMap = {
      primary: DS.colors.lightPrimary,
      secondary: DS.colors.lightSecondary,
      neutral: DS.colors.neutral300,
    };
    const base = colorMap[color];
    const light = lightMap[color];

    const getStyles = () => {
      const common = {
        fontFamily: DS.font,
        fontSize: "14px",
        fontWeight: 600,
        height: DS.button.height,
        padding: `0 ${DS.button.paddingX}`,
        borderRadius: DS.radius.sm,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? "100%" : "auto",
        outline: "none",
        ...style,
      };

      if (variant === "contained") {
        return {
          ...common,
          backgroundColor: disabled
            ? DS.colors.neutral500
            : isPressed
              ? base
              : isHovered
                ? DS.colors.gradientStart
                : base,
          color: DS.colors.white,
          border: "none",
          boxShadow: isHovered && !disabled ? DS.shadow.md : DS.shadow.sm,
          transform: isPressed
            ? "scale(0.97)"
            : isHovered && !disabled
              ? "translateY(-1px)"
              : "none",
        };
      }
      if (variant === "outlined") {
        return {
          ...common,
          backgroundColor: isHovered && !disabled ? light : "transparent",
          color: disabled ? DS.colors.neutral500 : base,
          border: `2px solid ${disabled ? DS.colors.neutral500 : base}`,
          transform: isPressed ? "scale(0.97)" : "none",
        };
      }
      return {
        ...common,
        backgroundColor: isHovered && !disabled ? light : "transparent",
        color: disabled ? DS.colors.neutral500 : base,
        border: "none",
        transform: isPressed ? "scale(0.97)" : "none",
      };
    };

    return (
      <button
        onClick={!disabled ? onClick : undefined}
        style={getStyles()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // CATEGORY BADGE COMPONENT
  // ─────────────────────────────────────────────────────────────────────
  const CategoryBadge = ({ text, color = "primary" }) => (
    <span
      style={{
        display: "inline-block",
        padding: "4px 14px",
        backgroundColor:
          color === "primary"
            ? DS.colors.lightPrimary
            : DS.colors.lightSecondary,
        color: color === "primary" ? DS.colors.primary : DS.colors.secondary,
        borderRadius: DS.radius.full,
        fontSize: "12px",
        fontWeight: 600,
        fontFamily: DS.font,
        letterSpacing: "0.02em",
      }}
    >
      {text}
    </span>
  );

  // ─────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────
  const handlePracticeSubmit = (questionId) => {
    setPracticeSubmitted({ ...practiceSubmitted, [questionId]: true });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < practiceQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    setCurrentStep(0);
    setLearnIndex(0);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (setStopAutoNext) setStopAutoNext(!stopAutoNext);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setPracticeAnswers({});
    setPracticeSubmitted({});
    setShowHints({});
    setCurrentQuestion(0);
    setLearnIndex(0);
  };

  const handleNext = () => {
    if (currentStep < filteredSteps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Learn mode navigation
  const handleLearnNext = () => {
    if (learnIndex < totalLearnPages - 1) setLearnIndex(learnIndex + 1);
  };

  const handleLearnPrevious = () => {
    if (learnIndex > 0) setLearnIndex(learnIndex - 1);
  };

  // ─────────────────────────────────────────────────────────────────────
  // AUTO-PLAY
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying || stopAutoNext || autoPlayDuration === 0) return;
    const timer = setTimeout(() => {
      if (currentStep < filteredSteps.length - 1)
        setCurrentStep(currentStep + 1);
      else setIsPlaying(false);
    }, autoPlayDuration);
    return () => clearTimeout(timer);
  }, [
    isPlaying,
    currentStep,
    filteredSteps.length,
    autoPlayDuration,
    stopAutoNext,
  ]);

  useEffect(() => {
    if (setStepDetails && filteredSteps[currentStep]) {
      const step = filteredSteps[currentStep];
      setStepDetails({
        step: currentStep,
        title: step.title,
        description: step.description,
        mode: step.mode,
      });
    }
  }, [currentStep, filteredSteps, setStepDetails]);

  // ─────────────────────────────────────────────────────────────────────
  // SHARED STYLES
  // ─────────────────────────────────────────────────────────────────────
  const bg = darkMode ? "#16162a" : DS.colors.neutral100;
  const cardBg = darkMode ? "#1e1e3a" : DS.colors.white;
  const textPrimary = darkMode ? "#f0f0f8" : DS.colors.black;
  const textSecondary = darkMode ? "#a0a0c0" : DS.colors.neutral900;
  const borderColor = darkMode ? "#2e2e50" : DS.colors.neutral300;

  // ─────────────────────────────────────────────────────────────────────
  // RENDER: LEARN MODE (PAGINATED - ONE ITEM AT A TIME)
  // ─────────────────────────────────────────────────────────────────────
  const renderLearnMode = () => {
    const isShowingComponent = learnIndex < electricalComponents.length;
    const isShowingCircuitExample =
      showCircuitExample && learnIndex === electricalComponents.length;

    return (
      <div
        style={{
          fontFamily: DS.font,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: DS.spacing.lg,
          backgroundColor: bg,
          color: textPrimary,
          minHeight: "100vh",
        }}
      >
        {/* Hero Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`,
            color: DS.colors.white,
            padding: "40px 32px",
            borderRadius: DS.radius.lg,
            marginBottom: DS.spacing.xl,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            animation: "sgFadeIn 0.6s ease-out",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: "50%",
              border: `2px solid ${DS.colors.white}20`,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -10,
              left: 30,
              width: 60,
              height: 60,
              border: `2px solid ${DS.colors.white}15`,
              pointerEvents: "none",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 20,
              left: -10,
              width: 0,
              height: 0,
              borderLeft: "30px solid transparent",
              borderRight: "30px solid transparent",
              borderBottom: `52px solid ${DS.colors.white}10`,
              pointerEvents: "none",
            }}
          />

          <h1
            style={{
              margin: "0 0 8px 0",
              fontSize: "2.2em",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              position: "relative",
            }}
          >
            ⚡ Electric Circuit Symbols
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "1.05em",
              opacity: 0.9,
              fontWeight: 400,
              position: "relative",
            }}
          >
            Learn the standard symbols used to represent electrical components
          </p>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: "4px",
            backgroundColor: borderColor,
            borderRadius: DS.radius.full,
            marginBottom: DS.spacing.lg,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${((learnIndex + 1) / totalLearnPages) * 100}%`,
              background: `linear-gradient(90deg, ${DS.colors.primary}, ${DS.colors.secondary})`,
              borderRadius: DS.radius.full,
              transition: "width 0.4s ease",
            }}
          />
        </div>

        {/* Single Component Card */}
        {isShowingComponent &&
          (() => {
            const component = electricalComponents[learnIndex];
            return (
              <div
                key={component.id}
                style={{
                  backgroundColor: cardBg,
                  padding: DS.spacing.xl,
                  borderRadius: DS.radius.lg,
                  boxShadow: DS.shadow.lg,
                  border: `2px solid ${DS.colors.primary}20`,
                  animation: "sgScaleIn 0.4s ease-out",
                  position: "relative",
                  overflow: "hidden",
                  maxWidth: "640px",
                  margin: "0 auto",
                }}
              >
                {/* Accent line at top */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${DS.colors.primary}, ${DS.colors.secondary})`,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: DS.spacing.lg,
                    paddingBottom: DS.spacing.md,
                    borderBottom: `1px solid ${borderColor}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "2.4em",
                      marginRight: DS.spacing.lg,
                      background: `linear-gradient(135deg, ${DS.colors.lightPrimary}, ${DS.colors.lightSecondary})`,
                      padding: "14px 16px",
                      borderRadius: DS.radius.md,
                      lineHeight: 1,
                    }}
                    aria-hidden
                  >
                    {component.icon}
                  </div>
                  <div>
                    <h3
                      style={{
                        margin: "0 0 8px 0",
                        color: textPrimary,
                        fontSize: "1.5em",
                        fontWeight: 700,
                        fontFamily: DS.font,
                      }}
                    >
                      {component.name}
                    </h3>
                    <CategoryBadge
                      text={component.category}
                      color={
                        component.category === "Power Source"
                          ? "secondary"
                          : "primary"
                      }
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: DS.spacing.lg,
                    backgroundColor: darkMode
                      ? "#12122a"
                      : DS.colors.neutral100,
                    borderRadius: DS.radius.md,
                    marginBottom: DS.spacing.lg,
                    minHeight: "120px",
                    border: `2px dashed ${borderColor}`,
                  }}
                >
                  {renderSymbol(component.id)}
                </div>

                <p
                  style={{
                    margin: 0,
                    color: textSecondary,
                    fontSize: "1em",
                    lineHeight: 1.7,
                    fontFamily: DS.font,
                  }}
                >
                  {component.description}
                </p>
              </div>
            );
          })()}

        {/* Complete Circuit Example (last page) */}
        {isShowingCircuitExample && (
          <div
            style={{
              backgroundColor: cardBg,
              padding: DS.spacing.xl,
              borderRadius: DS.radius.lg,
              boxShadow: DS.shadow.lg,
              animation: "sgScaleIn 0.4s ease-out",
              border: `1px solid ${borderColor}`,
            }}
          >
            <h2
              style={{
                marginTop: 0,
                color: textPrimary,
                fontFamily: DS.font,
                fontWeight: 700,
                fontSize: "1.5em",
                paddingBottom: DS.spacing.md,
                marginBottom: DS.spacing.lg,
                borderBottom: `3px solid ${DS.colors.primary}`,
                display: "inline-block",
              }}
            >
              Complete Circuit Example
            </h2>

            <svg
              width="100%"
              height="350"
              viewBox="0 0 800 350"
              style={{
                border: `1px solid ${borderColor}`,
                borderRadius: DS.radius.sm,
                backgroundColor: darkMode ? "#12122a" : DS.colors.neutral100,
              }}
            >
              {/* Battery */}
              <g transform="translate(150, 150)">
                <line
                  x1="0"
                  y1="20"
                  x2="0"
                  y2="40"
                  stroke={DS.colors.black}
                  strokeWidth="4"
                />
                <line
                  x1="20"
                  y1="15"
                  x2="20"
                  y2="45"
                  stroke={DS.colors.black}
                  strokeWidth="4"
                />
                <line
                  x1="40"
                  y1="20"
                  x2="40"
                  y2="40"
                  stroke={DS.colors.black}
                  strokeWidth="4"
                />
                <line
                  x1="60"
                  y1="15"
                  x2="60"
                  y2="45"
                  stroke={DS.colors.black}
                  strokeWidth="4"
                />
                <text
                  x="30"
                  y="-5"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="Poppins, sans-serif"
                  fill={DS.colors.primary}
                >
                  Battery
                </text>
                <text
                  x="-15"
                  y="35"
                  fontSize="16"
                  fontWeight="bold"
                  fill={DS.colors.error}
                  fontFamily="Poppins, sans-serif"
                >
                  {negativeLabel}
                </text>
                <text
                  x="75"
                  y="35"
                  fontSize="16"
                  fontWeight="bold"
                  fill={DS.colors.primary}
                  fontFamily="Poppins, sans-serif"
                >
                  {positiveLabel}
                </text>
              </g>

              {/* Wires */}
              <line
                x1="210"
                y1="180"
                x2="210"
                y2="100"
                stroke={DS.colors.secondary}
                strokeWidth="4"
              />
              <line
                x1="210"
                y1="100"
                x2="350"
                y2="100"
                stroke={DS.colors.secondary}
                strokeWidth="4"
              />

              {/* Switch */}
              <g transform="translate(350, 100)">
                <circle cx="0" cy="0" r="5" fill={DS.colors.black} />
                <line
                  x1="0"
                  y1="0"
                  x2="80"
                  y2="0"
                  stroke={DS.colors.black}
                  strokeWidth="4"
                />
                <circle cx="80" cy="0" r="5" fill={DS.colors.black} />
                <text
                  x="40"
                  y="-15"
                  fontSize="13"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill={DS.colors.success}
                  fontFamily="Poppins, sans-serif"
                >
                  Switch (ON)
                </text>
              </g>

              <line
                x1="430"
                y1="100"
                x2="550"
                y2="100"
                stroke={DS.colors.secondary}
                strokeWidth="4"
              />

              {/* Lamp */}
              <g transform="translate(550, 100)">
                <circle
                  cx="0"
                  cy="0"
                  r="32"
                  stroke={DS.colors.black}
                  strokeWidth="3"
                  fill={`${DS.colors.lightSecondary}80`}
                />
                <line
                  x1="-16"
                  y1="-16"
                  x2="16"
                  y2="16"
                  stroke={DS.colors.black}
                  strokeWidth="2.5"
                />
                <line
                  x1="-16"
                  y1="16"
                  x2="16"
                  y2="-16"
                  stroke={DS.colors.black}
                  strokeWidth="2.5"
                />
                <text
                  x="0"
                  y="56"
                  fontSize="13"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="Poppins, sans-serif"
                  fill={DS.colors.primary}
                >
                  Lamp
                </text>
              </g>

              <line
                x1="550"
                y1="132"
                x2="550"
                y2="250"
                stroke={DS.colors.secondary}
                strokeWidth="4"
              />
              <line
                x1="550"
                y1="250"
                x2="150"
                y2="250"
                stroke={DS.colors.secondary}
                strokeWidth="4"
              />
              <line
                x1="150"
                y1="250"
                x2="150"
                y2="180"
                stroke={DS.colors.secondary}
                strokeWidth="4"
              />

              {/* Connection dots */}
              {[
                [210, 180],
                [210, 100],
                [350, 100],
                [430, 100],
                [550, 100],
                [550, 132],
                [550, 250],
                [150, 250],
                [150, 180],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="4" fill={DS.colors.black} />
              ))}

              {/* Current flow indicators */}
              <text
                x="270"
                y="85"
                fontSize="13"
                fill={DS.colors.secondary}
                fontWeight="bold"
                fontFamily="Poppins, sans-serif"
              >
                Current Flow →
              </text>
              <polygon
                points="490,100 485,95 485,105"
                fill={DS.colors.secondary}
              />
              <polygon
                points="550,200 545,195 555,195"
                fill={DS.colors.secondary}
              />
              <polygon
                points="300,250 305,245 305,255"
                fill={DS.colors.secondary}
              />
              <polygon
                points="150,220 145,225 155,225"
                fill={DS.colors.secondary}
              />
            </svg>

            <div
              style={{
                marginTop: DS.spacing.lg,
                padding: DS.spacing.md,
                background: darkMode
                  ? "#12122a"
                  : DS.colors.lightPrimary + "40",
                borderLeft: `4px solid ${DS.colors.primary}`,
                borderRadius: `0 ${DS.radius.sm} ${DS.radius.sm} 0`,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.92em",
                  lineHeight: 1.65,
                  fontFamily: DS.font,
                  color: textSecondary,
                }}
              >
                <strong style={{ color: textPrimary }}>How it works:</strong>{" "}
                This complete circuit shows a battery connected to a lamp
                through a closed switch. When the switch is ON, electricity
                flows in a complete loop (shown by orange arrows), lighting up
                the lamp. If the switch is OFF, the circuit is broken and the
                lamp won't light.
              </p>
            </div>
          </div>
        )}

        {/* Learn Mode Navigation */}
        <div
          style={{
            display: "flex",
            gap: DS.spacing.md,
            justifyContent: "center",
            alignItems: "center",
            marginTop: DS.spacing.xl,
          }}
        >
          <DSButton
            variant="outlined"
            color="neutral"
            disabled={learnIndex === 0}
            onClick={handleLearnPrevious}
            style={{ minWidth: "120px" }}
          >
            <ChevronLeftIcon size={18} /> Previous
          </DSButton>

          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: textSecondary,
              fontFamily: DS.font,
              padding: "0 12px",
              minWidth: "80px",
              textAlign: "center",
            }}
          >
            {learnIndex + 1} / {totalLearnPages}
          </span>

          <DSButton
            variant="contained"
            color="primary"
            disabled={learnIndex >= totalLearnPages - 1}
            onClick={handleLearnNext}
            style={{ minWidth: "120px" }}
          >
            Next <ChevronRightIcon size={18} />
          </DSButton>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // RENDER: PRACTICE MODE
  // ─────────────────────────────────────────────────────────────────────
  const renderPracticeMode = () => {
    const question = practiceQuestions[currentQuestion];
    const isSubmitted = practiceSubmitted[question.id];
    const selectedAnswer = practiceAnswers[question.id];
    const isCorrect = selectedAnswer === question.correctAnswer;

    return (
      <div
        style={{
          minHeight: "100vh",
          background: darkMode
            ? "linear-gradient(160deg, #16162a 0%, #1e1e3a 100%)"
            : `linear-gradient(160deg, ${DS.colors.lightPrimary}30 0%, ${DS.colors.lightSecondary}40 50%, ${DS.colors.neutral100} 100%)`,
          padding: DS.spacing.md,
          fontFamily: DS.font,
        }}
      >
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
          {/* Progress bar */}
          <div
            style={{
              height: "4px",
              backgroundColor: borderColor,
              borderRadius: DS.radius.full,
              marginBottom: DS.spacing.lg,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${((currentQuestion + 1) / practiceQuestions.length) * 100}%`,
                background: `linear-gradient(90deg, ${DS.colors.primary}, ${DS.colors.secondary})`,
                borderRadius: DS.radius.full,
                transition: "width 0.4s ease",
              }}
            />
          </div>

          <div
            style={{
              backgroundColor: cardBg,
              borderRadius: DS.radius.lg,
              boxShadow: DS.shadow.lg,
              padding: DS.spacing.lg,
              animation: "sgScaleIn 0.4s ease-out",
              border: `1px solid ${borderColor}`,
            }}
          >
            {/* Question header */}
            <div
              style={{
                display: "flex",
                gap: DS.spacing.md,
                marginBottom: DS.spacing.lg,
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: "44px",
                  height: "44px",
                  background: `linear-gradient(135deg, ${DS.colors.primary}, ${DS.colors.gradientStart})`,
                  color: DS.colors.white,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "18px",
                  fontFamily: DS.font,
                  boxShadow: DS.shadow.md,
                }}
              >
                {currentQuestion + 1}
              </span>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontWeight: 700,
                    color: textPrimary,
                    fontSize: "17px",
                    marginBottom: "4px",
                    fontFamily: DS.font,
                    lineHeight: 1.4,
                  }}
                >
                  {question.question}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: textSecondary,
                    fontFamily: DS.font,
                    margin: 0,
                  }}
                >
                  Select the correct circuit diagram
                </p>
              </div>
            </div>

            {/* Hint */}
            {question.hint && !isSubmitted && showHintsDefault && (
              <div style={{ marginBottom: DS.spacing.lg }}>
                <button
                  onClick={() =>
                    setShowHints({
                      ...showHints,
                      [question.id]: !showHints[question.id],
                    })
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: DS.colors.secondary,
                    fontWeight: 600,
                    fontSize: "13px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: "8px 0",
                    fontFamily: DS.font,
                    transition: "opacity 0.2s",
                  }}
                >
                  <LightbulbIcon size={18} />
                  {showHints[question.id] ? "Hide Hint" : "Show Hint"}
                </button>
                {showHints[question.id] && (
                  <div
                    style={{
                      marginTop: "8px",
                      padding: DS.spacing.md,
                      backgroundColor: DS.colors.lightSecondary,
                      borderLeft: `4px solid ${DS.colors.secondary}`,
                      borderRadius: `0 ${DS.radius.sm} ${DS.radius.sm} 0`,
                      animation: "sgFadeIn 0.3s ease-out",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "13px",
                        color: DS.colors.neutral900,
                        margin: 0,
                        fontFamily: DS.font,
                      }}
                    >
                      💡 {question.hint}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Circuit options */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: DS.spacing.md,
                marginBottom: DS.spacing.lg,
              }}
            >
              {question.circuits.map((circuit, cIndex) => {
                const isSelected = selectedAnswer === circuit.id;
                const showResult = isSubmitted && isSelected;

                return (
                  <div
                    key={circuit.id}
                    onClick={() =>
                      !isSubmitted &&
                      setPracticeAnswers({
                        ...practiceAnswers,
                        [question.id]: circuit.id,
                      })
                    }
                    style={{
                      position: "relative",
                      borderRadius: DS.radius.md,
                      padding: DS.spacing.md,
                      cursor: isSubmitted ? "not-allowed" : "pointer",
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      animation: `sgSlideRight 0.4s ease-out ${cIndex * 0.1}s both`,
                      border: showResult
                        ? `2px solid ${isCorrect ? DS.colors.success : DS.colors.error}`
                        : isSelected
                          ? `2px solid ${DS.colors.primary}`
                          : `2px solid ${borderColor}`,
                      backgroundColor: showResult
                        ? isCorrect
                          ? `${DS.colors.success}10`
                          : `${DS.colors.error}10`
                        : isSelected
                          ? `${DS.colors.primary}08`
                          : cardBg,
                      boxShadow: isSelected ? DS.shadow.md : DS.shadow.sm,
                      transform:
                        showResult && isCorrect ? "scale(1.01)" : "none",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        backgroundColor: isSelected
                          ? DS.colors.primary
                          : darkMode
                            ? "#2e2e50"
                            : DS.colors.neutral100,
                        border: `1px solid ${isSelected ? DS.colors.primary : borderColor}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        color: isSelected ? DS.colors.white : textSecondary,
                        fontSize: "14px",
                        fontFamily: DS.font,
                        transition: "all 0.2s",
                      }}
                    >
                      {String.fromCharCode(65 + cIndex)}
                    </div>

                    {showResult && (
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          padding: "4px 12px",
                          borderRadius: DS.radius.full,
                          color: DS.colors.white,
                          fontWeight: 700,
                          fontSize: "11px",
                          fontFamily: DS.font,
                          backgroundColor: isCorrect
                            ? DS.colors.success
                            : DS.colors.error,
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          animation: "sgScaleIn 0.3s ease-out",
                        }}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircleIcon size={14} /> Correct!
                          </>
                        ) : (
                          <>
                            <XCircleIcon size={14} /> Wrong
                          </>
                        )}
                      </div>
                    )}

                    <div
                      style={{
                        backgroundColor: darkMode
                          ? "#12122a"
                          : DS.colors.neutral100,
                        borderRadius: DS.radius.sm,
                        padding: DS.spacing.md,
                        marginTop: "36px",
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "130px",
                        border: `2px dashed ${borderColor}`,
                      }}
                    >
                      {circuit.svg}
                    </div>

                    {isSelected && !isSubmitted && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          right: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "26px",
                            height: "26px",
                            backgroundColor: DS.colors.primary,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: DS.shadow.md,
                            animation: "sgPulse 1.5s infinite",
                          }}
                        >
                          <CheckCircleIcon
                            size={16}
                            style={{ color: DS.colors.white }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!isSubmitted ? (
              <DSButton
                variant="contained"
                color={selectedAnswer ? "primary" : "neutral"}
                disabled={!selectedAnswer}
                onClick={() => handlePracticeSubmit(question.id)}
                fullWidth
                style={{
                  height: "48px",
                  fontSize: "15px",
                  borderRadius: DS.radius.md,
                }}
              >
                {selectedAnswer
                  ? "Check Answer"
                  : "Select an answer to continue"}
              </DSButton>
            ) : (
              <div
                style={{
                  padding: DS.spacing.md,
                  borderRadius: DS.radius.md,
                  border: `2px solid ${isCorrect ? DS.colors.success : DS.colors.secondary}`,
                  marginBottom: DS.spacing.md,
                  background: isCorrect
                    ? `linear-gradient(135deg, ${DS.colors.success}08, ${DS.colors.success}15)`
                    : `linear-gradient(135deg, ${DS.colors.secondary}08, ${DS.colors.secondary}15)`,
                  animation: "sgFadeIn 0.4s ease-out",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: DS.spacing.md,
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      backgroundColor: isCorrect
                        ? DS.colors.success
                        : DS.colors.secondary,
                    }}
                  >
                    {isCorrect ? (
                      <CheckCircleIcon
                        size={22}
                        style={{ color: DS.colors.white }}
                      />
                    ) : (
                      <XCircleIcon
                        size={22}
                        style={{ color: DS.colors.white }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontWeight: 700,
                        color: textPrimary,
                        marginBottom: "6px",
                        fontSize: "16px",
                        fontFamily: DS.font,
                      }}
                    >
                      {isCorrect
                        ? "Excellent! You got it right!"
                        : "Not quite right. Let's learn from this!"}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        color: textSecondary,
                        lineHeight: 1.6,
                        fontFamily: DS.font,
                        margin: 0,
                      }}
                    >
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: DS.spacing.md,
                marginTop: DS.spacing.md,
              }}
            >
              <DSButton
                variant="outlined"
                color="neutral"
                disabled={currentQuestion === 0}
                onClick={handlePreviousQuestion}
                style={{ flex: 1 }}
              >
                <ChevronLeftIcon size={18} /> Previous
              </DSButton>
              <DSButton
                variant="contained"
                color="primary"
                disabled={currentQuestion >= practiceQuestions.length - 1}
                onClick={handleNextQuestion}
                style={{ flex: 1 }}
              >
                Next <ChevronRightIcon size={18} />
              </DSButton>
            </div>
          </div>

          <div
            style={{
              marginTop: DS.spacing.lg,
              textAlign: "center",
              color: textSecondary,
              fontSize: "13px",
              fontFamily: DS.font,
            }}
          >
            Question {currentQuestion + 1} of {practiceQuestions.length}
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // RENDER: REAL WORLD MODE
  // ─────────────────────────────────────────────────────────────────────
  const renderRealWorldMode = () => {
    const applications = [
      {
        id: "torch",
        icon: "🔦",
        title: "Torch/Flashlight",
        description:
          "A simple circuit with a battery, switch, and bulb — perfect example of a complete circuit!",
        gradient: `linear-gradient(135deg, ${DS.colors.secondary}, #e65100)`,
      },
      {
        id: "home",
        icon: "🏠",
        title: "Home Lighting",
        description:
          "Your house has circuits connecting the power supply to lights through switches.",
        gradient: `linear-gradient(135deg, ${DS.colors.primary}, #3949ab)`,
      },
      {
        id: "phone",
        icon: "📱",
        title: "Mobile Phones",
        description:
          "Complex circuits with battery, LED screen, and various components working together.",
        gradient: `linear-gradient(135deg, ${DS.colors.gradientStart}, #7b1fa2)`,
      },
      {
        id: "car",
        icon: "🚗",
        title: "Cars & Vehicles",
        description:
          "Headlights, indicators, and dashboard all use electric circuits with switches.",
        gradient: `linear-gradient(135deg, #c62828, #e53935)`,
      },
      {
        id: "toys",
        icon: "🧸",
        title: "Electronic Toys",
        description:
          "Battery-operated toys use simple circuits with motors, lights, and sounds.",
        gradient: `linear-gradient(135deg, #ad1457, #ec407a)`,
      },
      {
        id: "safety",
        icon: "⚠️",
        title: "Safety Devices",
        description:
          "Smoke alarms and emergency lights use circuits to keep us safe.",
        gradient: `linear-gradient(135deg, ${DS.colors.secondary}, ${DS.colors.gradientEnd})`,
      },
    ];

    return (
      <div
        style={{
          minHeight: "100vh",
          background: darkMode
            ? "linear-gradient(160deg, #16162a 0%, #1e1e3a 100%)"
            : `linear-gradient(160deg, ${DS.colors.lightSecondary}60 0%, ${DS.colors.neutral100} 100%)`,
          padding: DS.spacing.lg,
          fontFamily: DS.font,
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: DS.spacing.xl,
              animation: "sgFadeIn 0.6s ease-out",
            }}
          >
            <CategoryBadge text="Real World Applications" color="secondary" />
            <h1
              style={{
                fontSize: "2.2em",
                fontWeight: 800,
                marginTop: DS.spacing.md,
                marginBottom: DS.spacing.sm,
                color: textPrimary,
                fontFamily: DS.font,
                letterSpacing: "-0.02em",
              }}
            >
              Electric Circuits in Real Life 🌍
            </h1>
            <p
              style={{
                fontSize: "1em",
                color: textSecondary,
                fontFamily: DS.font,
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              Discover how electric circuits power the world around you
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: DS.spacing.lg,
            }}
          >
            {applications.map((app, index) => (
              <div
                key={app.id}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: DS.radius.lg,
                  overflow: "hidden",
                  boxShadow: DS.shadow.md,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  animation: `sgFadeInUp 0.5s ease-out ${index * 0.08}s both`,
                  border: `1px solid ${borderColor}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = DS.shadow.xl;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = DS.shadow.md;
                }}
              >
                <div
                  style={{
                    background: app.gradient,
                    padding: "28px",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: -15,
                      right: -15,
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.15)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "3em",
                      marginBottom: "6px",
                      animation: "sgFloat 3s ease-in-out infinite",
                      animationDelay: `${index * 0.2}s`,
                    }}
                  >
                    {app.icon}
                  </div>
                  <h2
                    style={{
                      fontSize: "1.3em",
                      fontWeight: 700,
                      color: DS.colors.white,
                      margin: 0,
                      fontFamily: DS.font,
                    }}
                  >
                    {app.title}
                  </h2>
                </div>
                <div style={{ padding: DS.spacing.lg }}>
                  <p
                    style={{
                      color: textSecondary,
                      fontSize: "0.9em",
                      lineHeight: 1.65,
                      fontFamily: DS.font,
                      margin: 0,
                    }}
                  >
                    {app.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // RENDER: HANDS-ON MODE
  // ─────────────────────────────────────────────────────────────────────
  const renderHandsOnMode = () => {
    const experiments = [
      {
        title: "Simple Torch Circuit",
        materials: [
          "1 battery (1.5V)",
          "1 small bulb",
          "2 wires",
          "1 switch (optional)",
        ],
        steps: [
          "Connect one wire from battery positive (+) to the bulb",
          "Connect another wire from bulb to battery negative (-)",
          "The bulb should light up!",
          "Add a switch to control the light",
        ],
      },
      {
        title: "LED Circuit",
        materials: [
          "1 battery (3V)",
          "1 LED",
          "1 resistor (100 ohm)",
          "2 wires",
        ],
        steps: [
          "Connect resistor to positive (+) terminal",
          "Connect LED long leg to resistor",
          "Connect LED short leg to negative (-) terminal",
          "LED should light up!",
        ],
      },
    ];

    return (
      <div
        style={{
          minHeight: "100vh",
          background: darkMode
            ? "linear-gradient(160deg, #16162a 0%, #1e1e3a 100%)"
            : `linear-gradient(160deg, ${DS.colors.lightPrimary}30 0%, ${DS.colors.neutral100} 100%)`,
          padding: DS.spacing.lg,
          fontFamily: DS.font,
        }}
      >
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
          <div
            style={{
              backgroundColor: cardBg,
              borderRadius: DS.radius.lg,
              padding: DS.spacing.xl,
              boxShadow: DS.shadow.lg,
              animation: "sgScaleIn 0.5s ease-out",
              border: `1px solid ${borderColor}`,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: DS.spacing.xl }}>
              <CategoryBadge text="Hands-On Activity" color="primary" />
              <h1
                style={{
                  fontSize: "1.8em",
                  fontWeight: 800,
                  marginTop: DS.spacing.md,
                  marginBottom: DS.spacing.sm,
                  color: textPrimary,
                  fontFamily: DS.font,
                }}
              >
                🔧 Build Your Own Circuit!
              </h1>
              <p
                style={{
                  fontSize: "1em",
                  color: textSecondary,
                  fontFamily: DS.font,
                  margin: 0,
                }}
              >
                Try these safe experiments at home or in the classroom
              </p>
            </div>

            {/* Safety Warning */}
            <div
              style={{
                background: `linear-gradient(135deg, ${DS.colors.lightSecondary}, ${DS.colors.lightSecondary}80)`,
                borderLeft: `4px solid ${DS.colors.secondary}`,
                padding: DS.spacing.md,
                borderRadius: `0 ${DS.radius.md} ${DS.radius.md} 0`,
                marginBottom: DS.spacing.xl,
              }}
            >
              <h3
                style={{
                  fontSize: "1.1em",
                  fontWeight: 700,
                  color: DS.colors.secondary,
                  marginBottom: "8px",
                  fontFamily: DS.font,
                  marginTop: 0,
                }}
              >
                ⚠️ Safety First!
              </h3>
              <div
                style={{
                  color: DS.colors.neutral900,
                  lineHeight: 1.8,
                  fontSize: "0.9em",
                  fontFamily: DS.font,
                }}
              >
                <div style={{ marginBottom: "4px" }}>
                  • Only use batteries (never mains electricity)
                </div>
                <div style={{ marginBottom: "4px" }}>
                  • Ask an adult to supervise
                </div>
                <div style={{ marginBottom: "4px" }}>
                  • Don't connect batteries directly without a component
                </div>
                <div>• Use proper insulated wires</div>
              </div>
            </div>

            {/* Experiments */}
            <div style={{ display: "grid", gap: DS.spacing.lg }}>
              {experiments.map((experiment, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: darkMode
                      ? "#12122a"
                      : DS.colors.neutral100,
                    borderRadius: DS.radius.md,
                    padding: DS.spacing.lg,
                    border: `1px solid ${borderColor}`,
                    animation: `sgFadeInUp 0.5s ease-out ${index * 0.15}s both`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: `linear-gradient(90deg, ${DS.colors.primary}, ${DS.colors.secondary})`,
                    }}
                  />

                  <h3
                    style={{
                      fontSize: "1.2em",
                      fontWeight: 700,
                      color: DS.colors.primary,
                      marginBottom: DS.spacing.md,
                      fontFamily: DS.font,
                      marginTop: DS.spacing.sm,
                    }}
                  >
                    {experiment.title}
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: DS.spacing.lg,
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontSize: "0.95em",
                          fontWeight: 600,
                          color: textPrimary,
                          marginBottom: DS.spacing.sm,
                          fontFamily: DS.font,
                          marginTop: 0,
                        }}
                      >
                        Materials Needed
                      </h4>
                      <div
                        style={{
                          color: textSecondary,
                          fontSize: "0.88em",
                          fontFamily: DS.font,
                        }}
                      >
                        {experiment.materials.map((material, i) => (
                          <div
                            key={i}
                            style={{
                              padding: "6px 0",
                              borderBottom:
                                i < experiment.materials.length - 1
                                  ? `1px solid ${borderColor}`
                                  : "none",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: DS.colors.secondary,
                                flexShrink: 0,
                              }}
                            />
                            {material}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4
                        style={{
                          fontSize: "0.95em",
                          fontWeight: 600,
                          color: textPrimary,
                          marginBottom: DS.spacing.sm,
                          fontFamily: DS.font,
                          marginTop: 0,
                        }}
                      >
                        Steps
                      </h4>
                      <div
                        style={{
                          color: textSecondary,
                          fontSize: "0.88em",
                          fontFamily: DS.font,
                        }}
                      >
                        {experiment.steps.map((step, i) => (
                          <div
                            key={i}
                            style={{
                              padding: "6px 0",
                              borderBottom:
                                i < experiment.steps.length - 1
                                  ? `1px solid ${borderColor}`
                                  : "none",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "10px",
                            }}
                          >
                            <span
                              style={{
                                width: "22px",
                                height: "22px",
                                borderRadius: "50%",
                                backgroundColor: DS.colors.lightPrimary,
                                color: DS.colors.primary,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: "11px",
                                flexShrink: 0,
                                fontFamily: DS.font,
                              }}
                            >
                              {i + 1}
                            </span>
                            <span style={{ lineHeight: 1.5 }}>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // RENDER: MODE SELECTOR
  // ─────────────────────────────────────────────────────────────────────
  const renderModeSelector = () => {
    if (!showModeSelector) return null;

    const modes = [
      { key: "learn", label: "Learn", icon: "📚" },
      { key: "practice", label: "Practice", icon: "🎯" },
      { key: "real_world", label: "Real World", icon: "🌍" },
      { key: "hands_on", label: "Hands-On", icon: "🔧" },
    ];

    return (
      <div
        style={{
          display: "flex",
          gap: DS.spacing.sm,
          marginBottom: DS.spacing.lg,
          flexWrap: "wrap",
          justifyContent: "center",
          padding: `${DS.spacing.md} 0`,
        }}
      >
        {modes
          .filter((mode) => enabledModes.includes(mode.key))
          .map((mode) => {
            const isActive = currentMode === mode.key;
            return (
              <button
                key={mode.key}
                onClick={() => handleModeChange(mode.key)}
                style={{
                  padding: `0 ${DS.button.paddingX}`,
                  height: DS.button.height,
                  borderRadius: DS.radius.sm,
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: DS.font,
                  backgroundColor: isActive
                    ? DS.colors.primary
                    : darkMode
                      ? "#1e1e3a"
                      : DS.colors.neutral100,
                  color: isActive ? DS.colors.white : textSecondary,
                  border: isActive
                    ? `2px solid ${DS.colors.primary}`
                    : `2px solid ${borderColor}`,
                  boxShadow: isActive ? DS.shadow.md : "none",
                  transform: isActive ? "scale(1.03)" : "scale(1)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = DS.colors.primary;
                    e.currentTarget.style.color = DS.colors.primary;
                    e.currentTarget.style.backgroundColor =
                      DS.colors.lightPrimary + "40";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = borderColor;
                    e.currentTarget.style.color = textSecondary;
                    e.currentTarget.style.backgroundColor = darkMode
                      ? "#1e1e3a"
                      : DS.colors.neutral100;
                  }
                }}
              >
                <span style={{ fontSize: "16px" }}>{mode.icon}</span>
                <span>{mode.label}</span>
              </button>
            );
          })}
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // RENDER: CONTROLS
  // ─────────────────────────────────────────────────────────────────────
  const renderControls = () => {
    if (!showNavigation && !showPlayPause) return null;

    return (
      <div
        style={{
          display: "flex",
          gap: DS.spacing.sm,
          justifyContent: "center",
          marginTop: DS.spacing.lg,
          flexWrap: "wrap",
        }}
      >
        {showNavigation && filteredSteps.length > 0 && (
          <>
            <DSButton
              variant="outlined"
              color="neutral"
              disabled={currentStep === 0}
              onClick={handlePrevious}
            >
              <ChevronLeftIcon size={18} /> Previous
            </DSButton>
            <DSButton
              variant="outlined"
              color="neutral"
              disabled={currentStep >= filteredSteps.length - 1}
              onClick={handleNext}
            >
              Next <ChevronRightIcon size={18} />
            </DSButton>
          </>
        )}
        {showPlayPause && filteredSteps.length > 0 && (
          <DSButton
            variant="contained"
            color="primary"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <>
                <PauseIcon size={18} /> Pause
              </>
            ) : (
              <>
                <PlayIcon size={18} /> Play
              </>
            )}
          </DSButton>
        )}
        <DSButton variant="outlined" color="neutral" onClick={handleReset}>
          <RotateCcwIcon size={18} /> Reset
        </DSButton>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width: "100%",
        minHeight: height,
        fontFamily: DS.font,
        backgroundColor: bg,
      }}
    >
      {renderModeSelector()}
      {currentMode === "learn" && renderLearnMode()}
      {currentMode === "practice" && renderPracticeMode()}
      {currentMode === "real_world" && renderRealWorldMode()}
      {currentMode === "hands_on" && renderHandsOnMode()}
      {renderControls()}
    </div>
  );
};

export default ElectricCircuitTool;
