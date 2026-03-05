// @ts-expect-error - React types should be available at runtime
import React, { useState, useRef, useEffect, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM COLORS (from PDF)
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = {
  primary: "#4A4DC9",
  primaryDark: "#533086",
  secondary: "#FF7212",
  secondaryDark: "#FC9145",
  darkGray: "#4E4E4E",
  mediumGray: "#CACACA",
  lightGray: "#EBEBEB",
  background: "#F5F5F5",
  lightPurple: "#C1C1EA",
  lightOrange: "#FFF3E4",
  white: "#FFFFFF",
  // Gradient
  gradientStart: "#533086",
  gradientEnd: "#FC9145",
  // Functional colors
  success: "#10B981",
  error: "#DC2626",
  warning: "#F59E0B",
  info: "#3B82F6",
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

type ModeType = "learn" | "practice" | "real_world";

interface Pin {
  id: string;
  label: string;
  xPosition: number;
  fallOrder: number;
  color: string;
}

interface Material {
  id: string;
  name: string;
  type: "conductor" | "insulator";
  color: string;
  emoji: string;
}

interface Question {
  id: number;
  type: "mcq" | "true-false" | "fill-blank" | "match" | "ordering" | "classify";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
}

interface Application {
  id: number;
  title: string;
  category: string;
  description: string;
  howItWorks: string;
  conductor: string;
  insulator: string;
  scienceBehind: string;
  realExample: string;
  benefits: string[];
  difficulty: "everyday" | "industrial" | "advanced";
}

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  mode: ModeType;
}

interface ConductionData {
  pins?: Pin[];
  materials?: Material[];
  questions?: Question[];
  applications?: Application[];
}

interface HeatConductionAdditionalProps {
  numberOfPins?: number;
  pinSpacing?: number;
  customPins?: Array<{
    label: string;
    xPosition: number;
    fallOrder: number;
    color: string;
  }>;
  maxHeatIntensity?: number;
  heatSpeed?: number;
  customMaterials?: Array<{
    name: string;
    type: "conductor" | "insulator";
    color: string;
    emoji: string;
  }>;
  customQuestions?: Question[];
  customApplications?: Application[];
  showLabels?: boolean;
  showHeatVisualization?: boolean;
  enableDragDrop?: boolean;
  [key: string]: any;
}

interface HeatConductionToolProps {
  props?: {
    width?: number;
    height?: number;
    data?: ConductionData;
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
    additionalProps?: HeatConductionAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

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
// DEFAULT DATA
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_PINS: Pin[] = [
  { id: "pin1", label: "I", xPosition: 360, fallOrder: 1, color: "#EF4444" },
  { id: "pin2", label: "II", xPosition: 290, fallOrder: 2, color: "#F97316" },
  { id: "pin3", label: "III", xPosition: 220, fallOrder: 3, color: "#FBBF24" },
  { id: "pin4", label: "IV", xPosition: 150, fallOrder: 4, color: "#10B981" },
];

const DEFAULT_MATERIALS: Material[] = [
  {
    id: "steel",
    name: "Steel",
    type: "conductor",
    color: "#64748B",
    emoji: "🔧",
  },
  {
    id: "copper",
    name: "Copper",
    type: "conductor",
    color: "#C87533",
    emoji: "🟠",
  },
  {
    id: "aluminum",
    name: "Aluminum",
    type: "conductor",
    color: "#A8A9AD",
    emoji: "⚪",
  },
  {
    id: "wood",
    name: "Wood",
    type: "insulator",
    color: "#8B5A2B",
    emoji: "🪵",
  },
  {
    id: "plastic",
    name: "Plastic",
    type: "insulator",
    color: COLORS.primary,
    emoji: "🔴",
  },
  {
    id: "glass",
    name: "Glass",
    type: "insulator",
    color: "#93C5FD",
    emoji: "💎",
  },
];

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 1,
    type: "mcq",
    question: "What is conduction?",
    options: [
      "Transfer of heat through direct contact",
      "Transfer of heat through air currents",
      "Transfer of heat through electromagnetic waves",
      "Transfer of heat through vacuum",
    ],
    correctAnswer: "Transfer of heat through direct contact",
    explanation:
      "Conduction is the transfer of thermal energy through direct contact between particles of matter.",
    difficulty: "easy",
    points: 10,
  },
  {
    id: 2,
    type: "true-false",
    question: "Metals are good conductors of heat.",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation:
      "Metals have free electrons that allow heat to transfer quickly through the material.",
    difficulty: "easy",
    points: 10,
  },
  {
    id: 3,
    type: "mcq",
    question: "Which material is the best conductor of heat?",
    options: ["Wood", "Plastic", "Copper", "Rubber"],
    correctAnswer: "Copper",
    explanation:
      "Copper is an excellent conductor of heat due to its atomic structure and free electrons.",
    difficulty: "medium",
    points: 15,
  },
];

const DEFAULT_APPLICATIONS: Application[] = [
  {
    id: 1,
    title: "Cooking Utensils",
    category: "Kitchen",
    description: "Metal pots and pans with insulated handles for safe cooking",
    howItWorks:
      "The metal body conducts heat from the stove to food, while the handle stays cool",
    conductor: "Aluminum or stainless steel body",
    insulator: "Wooden or plastic handle",
    scienceBehind:
      "Metal efficiently transfers heat to cook food, insulator protects hands from burns",
    realExample:
      "A frying pan with a wooden handle - you can cook on high heat without burning your hand",
    benefits: ["Efficient cooking", "Energy saving", "Safety"],
    difficulty: "everyday",
  },
  {
    id: 2,
    title: "Building Insulation",
    category: "Architecture",
    description:
      "Foam or fiberglass insulation in walls to maintain indoor temperature",
    howItWorks:
      "Insulating materials trap air and prevent heat from escaping or entering",
    conductor: "Metal framing (structural)",
    insulator: "Foam, fiberglass, or cellulose insulation",
    scienceBehind:
      "Air pockets in insulation slow down heat transfer by conduction",
    realExample:
      "Houses stay warm in winter and cool in summer with proper insulation",
    benefits: ["Energy efficiency", "Cost savings", "Comfort"],
    difficulty: "industrial",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const HeatConductionTool: React.FC<HeatConductionToolProps> = ({
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
    animationSpeed = 1,
    autoPlayDuration = 8000,
    themeColor = COLORS.primary,
    darkMode = false,
    additionalProps = {},
  } = props;

  const {
    numberOfPins = 4,
    customPins,
    maxHeatIntensity = 100,
    heatSpeed = 100,
    customMaterials,
    customQuestions,
    customApplications,
    showLabels = true,
    showHeatVisualization = true,
    enableDragDrop = true,
  } = additionalProps;

  // State management
  const [mode, setMode] = useState<ModeType>(initialMode);
  const [heatIntensity, setHeatIntensity] = useState(0);
  const [fallenPins, setFallenPins] = useState<string[]>([]);
  const [isHeating, setIsHeating] = useState(false);
  const [currentFallingPin, setCurrentFallingPin] = useState<string | null>(
    null,
  );

  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [testedMaterials, setTestedMaterials] = useState<string[]>([]);
  const [showMaterialResult, setShowMaterialResult] = useState(false);
  const [draggedMaterial, setDraggedMaterial] = useState<string | null>(null);
  const [materialPositions, setMaterialPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [materialInTest, setMaterialInTest] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  const [expandedApp, setExpandedApp] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const svgRef = useRef<SVGSVGElement>(null);

  const pins = customPins || data.pins || DEFAULT_PINS;
  const materials = customMaterials || data.materials || DEFAULT_MATERIALS;
  const questions = customQuestions || data.questions || DEFAULT_QUESTIONS;
  const applications =
    customApplications || data.applications || DEFAULT_APPLICATIONS;

  // Inject animations and Poppins font
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeInScale {
        from { opacity: 0; transform: scale(0.5); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes smoothFall {
        0% { transform: translateY(0); opacity: 1; }
        20% { transform: translateY(10px); opacity: 0.9; }
        50% { transform: translateY(40px); opacity: 0.7; }
        80% { transform: translateY(90px); opacity: 0.5; }
        100% { transform: translateY(115px); opacity: 1; }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      @keyframes slideInFromTop {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes slideInFromBottom {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes scaleIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    materials.forEach((material, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      positions[material.id] = {
        x: 100 + col * 100,
        y: 280 + row * 60,
      };
    });
    setMaterialPositions(positions);
  }, [materials]);

  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: mode === "practice" ? currentQuestionIndex + 1 : 1,
        totalSteps: mode === "practice" ? questions.length : 1,
        mode,
      });
    }
  }, [mode, currentQuestionIndex, questions.length, setStepDetails]);

  const startHeating = () => {
    setIsHeating(true);
    setHeatIntensity(0);
    setFallenPins([]);
    setCurrentFallingPin(null);

    const heatInterval = setInterval(() => {
      setHeatIntensity((prev) => {
        const newIntensity = prev + 1;

        pins.forEach((pin) => {
          const triggerPoint = pin.fallOrder * 25;

          if (
            newIntensity === triggerPoint - 2 &&
            !fallenPins.includes(pin.id) &&
            currentFallingPin !== pin.id
          ) {
            setTimeout(() => {
              setCurrentFallingPin(pin.id);
              setTimeout(() => {
                setFallenPins((prevPins) => [...prevPins, pin.id]);
                setCurrentFallingPin(null);
              }, 1000);
            }, 100);
          }
        });

        if (newIntensity >= maxHeatIntensity) {
          clearInterval(heatInterval);
          setTimeout(() => setIsHeating(false), 500);
          return maxHeatIntensity;
        }
        return newIntensity;
      });
    }, heatSpeed / animationSpeed);
  };

  const resetHeating = () => {
    setHeatIntensity(0);
    setFallenPins([]);
    setIsHeating(false);
    setCurrentFallingPin(null);
  };

  const screenToSVG = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: svgP.x, y: svgP.y };
  };

  const handleMaterialMouseDown = (e: React.MouseEvent, materialId: string) => {
    e.preventDefault();
    setDraggedMaterial(materialId);
  };

  const handleMaterialMouseMove = (e: React.MouseEvent) => {
    if (!draggedMaterial || !svgRef.current || !enableDragDrop) return;
    e.preventDefault();

    const svgCoords = screenToSVG(e.clientX, e.clientY);
    setMaterialPositions((prev) => ({
      ...prev,
      [draggedMaterial]: { x: svgCoords.x, y: svgCoords.y },
    }));
  };

  const handleMaterialMouseUp = () => {
    if (!draggedMaterial) return;

    const pos = materialPositions[draggedMaterial];
    const testZone = { x: 230, y: 150, radius: 50 };
    const distance = Math.sqrt(
      Math.pow(pos.x - testZone.x, 2) + Math.pow(pos.y - testZone.y, 2),
    );

    if (distance < testZone.radius) {
      setMaterialPositions((prev) => ({
        ...prev,
        [draggedMaterial]: { x: testZone.x, y: testZone.y },
      }));
      setMaterialInTest(draggedMaterial);
      setSelectedMaterial(draggedMaterial);
      if (!testedMaterials.includes(draggedMaterial)) {
        setTestedMaterials((prev) => [...prev, draggedMaterial]);
      }
      setShowMaterialResult(true);
    }

    setDraggedMaterial(null);
  };

  const testMaterial = (materialId: string) => {
    setSelectedMaterial(materialId);
    setShowMaterialResult(true);
    if (!testedMaterials.includes(materialId)) {
      setTestedMaterials((prev) => [...prev, materialId]);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect && !answeredQuestions.includes(currentQuestion.id)) {
      setScore(score + currentQuestion.points);
    }

    if (!answeredQuestions.includes(currentQuestion.id)) {
      setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
    }

    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowFeedback(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer("");
      setShowFeedback(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions([]);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RESPONSIVE STYLES
  // ═══════════════════════════════════════════════════════════════════════════

  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: `${width}px`,
    margin: "0 auto",
    fontFamily: "'Poppins', -apple-system, sans-serif",
    backgroundColor: darkMode ? COLORS.darkGray : COLORS.background,
    minHeight: `${height}px`,
    padding: "clamp(12px, 3vw, 20px)",
    boxSizing: "border-box",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    gap: "clamp(8px, 2vw, 12px)",
    marginBottom: "clamp(16px, 3vw, 24px)",
    flexWrap: "wrap",
    animation: "slideInFromTop 0.5s ease-out",
  };

  const modeButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: "clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)",
    borderRadius: "12px",
    border: "none",
    fontSize: "clamp(14px, 2vw, 16px)",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: isActive
      ? themeColor
      : darkMode
        ? COLORS.darkGray
        : COLORS.white,
    color: isActive
      ? COLORS.white
      : darkMode
        ? COLORS.lightGray
        : COLORS.darkGray,
    boxShadow: isActive
      ? "0 4px 12px rgba(74, 77, 201, 0.3)"
      : "0 2px 4px rgba(0,0,0,0.1)",
    transform: isActive ? "scale(1.05)" : "scale(1)",
  });

  const cardStyle: React.CSSProperties = {
    backgroundColor: darkMode ? COLORS.darkGray : COLORS.white,
    borderRadius: "clamp(12px, 2vw, 16px)",
    padding: "clamp(16px, 3vw, 24px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: "clamp(16px, 2vw, 20px)",
    animation: "scaleIn 0.5s ease-out",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)",
    borderRadius: "8px",
    border: "none",
    fontSize: "clamp(13px, 1.8vw, 14px)",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: themeColor,
    color: COLORS.white,
    boxShadow: "0 2px 8px rgba(74, 77, 201, 0.25)",
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: COLORS.mediumGray,
    cursor: "not-allowed",
    opacity: 0.6,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER LEARN MODE
  // ═══════════════════════════════════════════════════════════════════════════

  const renderLearnMode = () => (
    <div style={cardStyle}>
      <h2
        style={{
          fontSize: "clamp(20px, 3vw, 24px)",
          fontWeight: "700",
          marginBottom: "clamp(16px, 3vw, 24px)",
          color: darkMode ? COLORS.white : COLORS.darkGray,
          animation: "fadeIn 0.5s ease-out",
        }}
      >
        🔥 Interactive Conduction Experiment
      </h2>

      <div
        style={{
          display: "flex",
          gap: "clamp(8px, 2vw, 12px)",
          marginBottom: "clamp(16px, 3vw, 24px)",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={startHeating}
          disabled={isHeating}
          style={isHeating ? disabledButtonStyle : buttonStyle}
          onMouseEnter={(e) =>
            !isHeating && (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          🔥 Start Heating
        </button>
        <button
          onClick={resetHeating}
          style={{ ...buttonStyle, backgroundColor: COLORS.darkGray }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          🔄 Reset
        </button>
      </div>

      {showStepIndicator && (
        <div
          style={{
            marginBottom: "clamp(16px, 2vw, 20px)",
            padding: "clamp(10px, 2vw, 12px)",
            backgroundColor: darkMode ? "#2C2C2C" : COLORS.lightGray,
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              fontSize: "clamp(12px, 1.8vw, 14px)",
              fontWeight: "600",
              color: darkMode ? COLORS.mediumGray : COLORS.darkGray,
            }}
          >
            <span>Heat Intensity</span>
            <span style={{ color: themeColor }}>{heatIntensity}%</span>
          </div>
          <div
            style={{
              width: "100%",
              height: "clamp(10px, 1.5vw, 12px)",
              backgroundColor: darkMode ? COLORS.darkGray : COLORS.mediumGray,
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${heatIntensity}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${COLORS.gradientStart}, ${COLORS.secondary})`,
                transition: "width 0.3s ease",
                animation: heatIntensity > 0 ? "pulse 1s infinite" : "none",
              }}
            />
          </div>
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox="0 0 500 280"
        style={{
          width: "100%",
          height: "auto",
          backgroundColor: darkMode ? "#2C2C2C" : COLORS.white,
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          marginBottom: "clamp(16px, 2vw, 20px)",
        }}
      >
        <defs>
          <linearGradient id="woodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="50%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#654321" />
          </linearGradient>
          <radialGradient id="heatGlow" cx="50%" cy="50%">
            <stop
              offset="0%"
              stopColor={COLORS.warning}
              stopOpacity={heatIntensity / 100}
            />
            <stop
              offset="50%"
              stopColor={COLORS.secondary}
              stopOpacity={heatIntensity / 150}
            />
            <stop offset="100%" stopColor={COLORS.error} stopOpacity="0" />
          </radialGradient>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill={COLORS.secondary} />
          </marker>
        </defs>

        <rect
          x="20"
          y="240"
          width="460"
          height="30"
          fill="url(#woodGradient)"
          stroke="#5C2E0A"
          strokeWidth="2"
          rx="4"
        />
        <rect
          x="50"
          y="80"
          width="12"
          height="160"
          fill="#2C3E50"
          stroke="#1a252f"
          strokeWidth="1.5"
          rx="2"
        />
        <ellipse cx="56" cy="245" rx="25" ry="8" fill="#34495E" />
        <rect
          x="58"
          y="95"
          width="20"
          height="12"
          fill="#34495E"
          stroke="#1a252f"
          strokeWidth="1"
          rx="2"
        />
        <circle cx="68" cy="101" r="3" fill="#7F8C8D" />
        <rect
          x="78"
          y="98"
          width="340"
          height="8"
          fill="#94A3B8"
          stroke="#64748B"
          strokeWidth="2"
          rx="2"
        />
        <rect
          x="78"
          y="99"
          width="340"
          height="2"
          fill="#CBD5E1"
          opacity="0.6"
          rx="1"
        />

        {showHeatVisualization && heatIntensity > 0 && (
          <>
            <circle
              cx="415"
              cy="102"
              r={40 + heatIntensity / 5}
              fill="url(#heatGlow)"
            />
            <circle
              cx="415"
              cy="102"
              r={25 + heatIntensity / 10}
              fill={COLORS.secondary}
              opacity={heatIntensity / 200}
            />

            {[...Array(3)].map((_, i) => {
              const offset = (heatIntensity / 100) * 320;
              return (
                <line
                  key={i}
                  x1={415 - offset + i * 30}
                  y1="102"
                  x2={415 - offset + i * 30 - 20}
                  y2="102"
                  stroke={COLORS.secondary}
                  strokeWidth="3"
                  opacity={(heatIntensity / 100) * (1 - i * 0.3)}
                  style={{ transition: "all 0.3s ease" }}
                />
              );
            })}
          </>
        )}

        {pins.map((pin) => {
          const hasFallen = fallenPins.includes(pin.id);
          const isFalling = currentFallingPin === pin.id;
          const pinTopY = hasFallen ? 200 : isFalling ? 150 : 85;
          const waxMelted = hasFallen || isFalling;
          const showGlow = heatIntensity >= pin.fallOrder * 20;

          return (
            <g key={pin.id}>
              {!waxMelted && (
                <>
                  <ellipse
                    cx={pin.xPosition}
                    cy="95"
                    rx="10"
                    ry="7"
                    fill="#FCD34D"
                    opacity={showGlow ? 0.5 : 1}
                    style={{ transition: "opacity 0.5s ease" }}
                  />
                  {showGlow && (
                    <circle
                      cx={pin.xPosition}
                      cy="95"
                      r="15"
                      fill={COLORS.warning}
                      opacity="0.2"
                      style={{ animation: "pulse 1s infinite" }}
                    />
                  )}
                </>
              )}

              {isFalling && (
                <g style={{ animation: "fadeIn 0.3s ease-in" }}>
                  <ellipse
                    cx={pin.xPosition}
                    cy="100"
                    rx="8"
                    ry="5"
                    fill="#FCD34D"
                    opacity="0.7"
                  />
                  <ellipse
                    cx={pin.xPosition}
                    cy="105"
                    rx="6"
                    ry="4"
                    fill="#FCD34D"
                    opacity="0.5"
                  />
                  <ellipse
                    cx={pin.xPosition}
                    cy="110"
                    rx="4"
                    ry="3"
                    fill="#FCD34D"
                    opacity="0.3"
                  />
                </g>
              )}

              <g
                style={{
                  transition:
                    "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transform: `translateY(${pinTopY - 85}px)`,
                }}
              >
                <circle
                  cx={pin.xPosition}
                  cy={85}
                  r="5"
                  fill={pin.color}
                  stroke={COLORS.darkGray}
                  strokeWidth="1"
                />
                <line
                  x1={pin.xPosition}
                  y1={90}
                  x2={pin.xPosition}
                  y2={110}
                  stroke={pin.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <polygon
                  points={`${pin.xPosition},110 ${pin.xPosition - 2.5},106 ${pin.xPosition + 2.5},106`}
                  fill={pin.color}
                />
              </g>

              {showLabels && (
                <text
                  x={pin.xPosition}
                  y="75"
                  textAnchor="middle"
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    fontFamily: "Poppins",
                  }}
                  fill={hasFallen ? pin.color : COLORS.darkGray}
                >
                  {pin.label}
                </text>
              )}
            </g>
          );
        })}

        <g>
          <rect
            x="405"
            y="150"
            width="20"
            height="40"
            fill="#FBBF24"
            stroke={COLORS.secondary}
            strokeWidth="1.5"
            rx="2"
          />
          <rect x="405" y="150" width="20" height="8" fill="#FCD34D" rx="2" />
          <rect x="413.5" y="145" width="1.5" height="8" fill="#2C3E50" />
          <ellipse
            cx="414.5"
            cy="138"
            rx="6"
            ry="10"
            fill="#FCD34D"
            style={{ animation: isHeating ? "pulse 1s infinite" : "none" }}
          />
          {isHeating && (
            <>
              <path
                d="M 414.5 133 Q 412 128, 414.5 123"
                stroke={COLORS.secondary}
                strokeWidth="2.5"
                fill="none"
                style={{ animation: "pulse 1s infinite" }}
              />
              <path
                d="M 414.5 133 Q 417 128, 414.5 123"
                stroke="#FBBF24"
                strokeWidth="2"
                fill="none"
                style={{ animation: "pulse 1s infinite" }}
              />
            </>
          )}
          <rect
            x="402"
            y="190"
            width="26"
            height="4"
            fill={COLORS.mediumGray}
            rx="1"
          />
          <rect
            x="400"
            y="194"
            width="30"
            height="8"
            fill={COLORS.darkGray}
            rx="2"
          />
        </g>

        <line
          x1="390"
          y1="125"
          x2="100"
          y2="125"
          stroke={COLORS.secondary}
          strokeWidth="3"
          strokeDasharray="8,4"
          markerEnd="url(#arrowhead)"
          opacity="0.7"
        />
        {showLabels && (
          <text
            x="245"
            y="145"
            textAnchor="middle"
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              fontFamily: "Poppins",
            }}
            fill={COLORS.secondary}
          >
            Heat Flow →
          </text>
        )}
      </svg>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "clamp(10px, 2vw, 12px)",
          animation: "slideInFromBottom 0.5s ease-out",
        }}
      >
        {pins.map((pin) => {
          const hasFallen = fallenPins.includes(pin.id);
          const expectedFall = heatIntensity >= pin.fallOrder * 25;

          return (
            <div
              key={pin.id}
              style={{
                padding: "clamp(12px, 2vw, 16px)",
                borderRadius: "12px",
                border: `2px solid ${hasFallen ? COLORS.success : expectedFall ? COLORS.warning : COLORS.lightGray}`,
                backgroundColor: hasFallen
                  ? "#ECFDF5"
                  : expectedFall
                    ? COLORS.lightOrange
                    : darkMode
                      ? COLORS.darkGray
                      : COLORS.background,
                transition: "all 0.3s ease",
                textAlign: "center",
                animation:
                  expectedFall && !hasFallen ? "pulse 1s infinite" : "none",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(18px, 2.5vw, 20px)",
                  fontWeight: "700",
                  color: pin.color,
                  marginBottom: "8px",
                }}
              >
                Pin {pin.label}
              </div>
              <div
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  color: darkMode ? COLORS.mediumGray : COLORS.darkGray,
                  marginBottom: "8px",
                }}
              >
                Order: {pin.fallOrder}
              </div>
              {hasFallen && (
                <div
                  style={{
                    fontSize: "clamp(12px, 1.8vw, 14px)",
                    fontWeight: "600",
                    color: COLORS.success,
                  }}
                >
                  ✓ Fallen
                </div>
              )}
              {expectedFall && !hasFallen && (
                <div
                  style={{
                    fontSize: "clamp(12px, 1.8vw, 14px)",
                    fontWeight: "600",
                    color: COLORS.warning,
                  }}
                >
                  ⏳ Falling...
                </div>
              )}
              {!expectedFall && !hasFallen && (
                <div
                  style={{
                    fontSize: "clamp(12px, 1.8vw, 14px)",
                    color: COLORS.mediumGray,
                  }}
                >
                  ⏸️ Waiting
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "clamp(24px, 4vw, 32px)",
          padding: "clamp(16px, 3vw, 24px)",
          backgroundColor: darkMode ? "#2C2C2C" : COLORS.lightGray,
          borderRadius: "12px",
        }}
      >
        <h3
          style={{
            fontSize: "clamp(18px, 2.5vw, 20px)",
            fontWeight: "700",
            marginBottom: "clamp(12px, 2vw, 16px)",
            color: darkMode ? COLORS.white : COLORS.darkGray,
          }}
        >
          🧪 Test Different Materials
        </h3>

        <svg
          ref={svgRef}
          viewBox="0 0 500 400"
          style={{
            width: "100%",
            height: "auto",
            backgroundColor: darkMode ? COLORS.darkGray : COLORS.white,
            borderRadius: "12px",
            marginBottom: "clamp(12px, 2vw, 16px)",
          }}
          onMouseMove={handleMaterialMouseMove}
          onMouseUp={handleMaterialMouseUp}
          onMouseLeave={handleMaterialMouseUp}
        >
          <circle
            cx="230"
            cy="150"
            r="50"
            fill="none"
            stroke={COLORS.success}
            strokeWidth="3"
            strokeDasharray="8,4"
            opacity="0.5"
          />
          <text
            x="230"
            y="90"
            textAnchor="middle"
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              fontFamily: "Poppins",
            }}
            fill={COLORS.success}
          >
            Drop here to test
          </text>

          <g>
            <circle
              cx="80"
              cy="150"
              r="35"
              fill="#FCD34D"
              opacity="0.3"
              style={{ animation: "pulse 1s infinite" }}
            />
            <circle
              cx="80"
              cy="150"
              r="25"
              fill={COLORS.secondary}
              opacity="0.5"
              style={{ animation: "pulse 1s infinite" }}
            />
            <text
              x="80"
              y="155"
              textAnchor="middle"
              style={{ fontSize: "24px" }}
            >
              🔥
            </text>
            <text
              x="80"
              y="200"
              textAnchor="middle"
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                fontFamily: "Poppins",
              }}
              fill={COLORS.secondary}
            >
              Heat Source
            </text>
          </g>

          {materialInTest && (
            <>
              <line
                x1="115"
                y1="150"
                x2="180"
                y2="150"
                stroke={COLORS.secondary}
                strokeWidth="3"
                strokeDasharray="5,5"
                style={{ animation: "pulse 1s infinite" }}
              />

              {materials.find((m) => m.id === materialInTest)?.type ===
              "conductor" ? (
                <>
                  <line
                    x1="280"
                    y1="150"
                    x2="345"
                    y2="150"
                    stroke={COLORS.success}
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    style={{ animation: "pulse 1s infinite" }}
                  />
                  <circle
                    cx="380"
                    cy="150"
                    r="25"
                    fill="#FCD34D"
                    style={{ animation: "pulse 1s infinite" }}
                  />
                  <text
                    x="380"
                    y="155"
                    textAnchor="middle"
                    style={{ fontSize: "24px" }}
                  >
                    💡
                  </text>
                  <text
                    x="380"
                    y="190"
                    textAnchor="middle"
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      fontFamily: "Poppins",
                    }}
                    fill={COLORS.success}
                  >
                    Heat passes!
                  </text>
                </>
              ) : (
                <>
                  <line
                    x1="280"
                    y1="150"
                    x2="345"
                    y2="150"
                    stroke={COLORS.error}
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    opacity="0.5"
                  />
                  <text
                    x="315"
                    y="145"
                    textAnchor="middle"
                    style={{ fontSize: "24px" }}
                  >
                    🚫
                  </text>
                  <circle
                    cx="380"
                    cy="150"
                    r="25"
                    fill={COLORS.darkGray}
                    opacity="0.3"
                  />
                  <text
                    x="380"
                    y="155"
                    textAnchor="middle"
                    style={{ fontSize: "24px", opacity: 0.5 }}
                  >
                    💡
                  </text>
                  <text
                    x="380"
                    y="190"
                    textAnchor="middle"
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      fontFamily: "Poppins",
                    }}
                    fill={COLORS.error}
                  >
                    Heat blocked!
                  </text>
                </>
              )}
            </>
          )}

          {materials.map((material) => {
            const pos = materialPositions[material.id] || { x: 0, y: 0 };
            const isDragging = draggedMaterial === material.id;
            const isInTest = materialInTest === material.id;

            return (
              <g
                key={material.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseDown={(e) =>
                  enableDragDrop &&
                  handleMaterialMouseDown(e as any, material.id)
                }
                style={{
                  cursor: enableDragDrop
                    ? isDragging
                      ? "grabbing"
                      : "grab"
                    : "pointer",
                  opacity: isDragging ? 0.8 : 1,
                  transition: "opacity 0.2s ease",
                }}
              >
                <rect
                  x="-35"
                  y="-15"
                  width="70"
                  height="30"
                  rx="5"
                  fill={material.color}
                  stroke={isInTest ? COLORS.success : COLORS.darkGray}
                  strokeWidth={isInTest ? 3 : 2}
                  opacity="0.9"
                />
                <text
                  x="0"
                  y="5"
                  textAnchor="middle"
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    pointerEvents: "none",
                    fontFamily: "Poppins",
                  }}
                  fill="white"
                >
                  {material.emoji} {material.name}
                </text>
              </g>
            );
          })}
        </svg>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
            gap: "clamp(6px, 1.5vw, 8px)",
            marginBottom: "clamp(12px, 2vw, 16px)",
          }}
        >
          {materials.map((material) => (
            <button
              key={material.id}
              onClick={() => testMaterial(material.id)}
              style={{
                padding: "clamp(8px, 1.5vw, 10px)",
                borderRadius: "8px",
                border:
                  selectedMaterial === material.id
                    ? `2px solid ${themeColor}`
                    : `2px solid ${COLORS.lightGray}`,
                backgroundColor:
                  selectedMaterial === material.id
                    ? COLORS.lightPurple
                    : darkMode
                      ? COLORS.darkGray
                      : COLORS.white,
                cursor: "pointer",
                fontSize: "clamp(11px, 1.5vw, 12px)",
                fontWeight: "600",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {material.emoji} {material.name}
            </button>
          ))}
        </div>

        {selectedMaterial && showMaterialResult && (
          <div
            style={{
              padding: "clamp(12px, 2vw, 16px)",
              backgroundColor: darkMode ? COLORS.darkGray : COLORS.white,
              borderRadius: "8px",
              border: `2px solid ${COLORS.mediumGray}`,
              animation: "scaleIn 0.3s ease-out",
            }}
          >
            {(() => {
              const material = materials.find((m) => m.id === selectedMaterial);
              if (!material) return null;
              const isCondutor = material.type === "conductor";

              return (
                <>
                  <h4
                    style={{
                      fontSize: "clamp(14px, 2vw, 16px)",
                      fontWeight: "700",
                      marginBottom: "12px",
                      color: darkMode ? COLORS.white : COLORS.darkGray,
                    }}
                  >
                    Test Result: {material.emoji} {material.name}
                  </h4>
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: isCondutor ? "#ECFDF5" : "#FEF2F2",
                      borderRadius: "6px",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "clamp(12px, 1.8vw, 14px)",
                        fontWeight: "600",
                        color: isCondutor ? COLORS.success : COLORS.error,
                        marginBottom: "4px",
                      }}
                    >
                      {isCondutor
                        ? "✓ Good Conductor"
                        : "✗ Poor Conductor (Insulator)"}
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(11px, 1.5vw, 12px)",
                        color: COLORS.darkGray,
                      }}
                    >
                      {isCondutor
                        ? "Heat transfers quickly through this material"
                        : "Heat transfer is blocked or very slow"}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER PRACTICE MODE
  // ═══════════════════════════════════════════════════════════════════════════

  const renderPracticeMode = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    return (
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "clamp(16px, 3vw, 24px)",
            flexWrap: "wrap",
            gap: "clamp(10px, 2vw, 12px)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "clamp(10px, 2vw, 12px)",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                padding: "clamp(6px, 1.5vw, 8px) clamp(12px, 2vw, 16px)",
                backgroundColor: COLORS.lightPurple,
                color: COLORS.primary,
                borderRadius: "20px",
                fontSize: "clamp(12px, 1.8vw, 14px)",
                fontWeight: "700",
              }}
            >
              Question {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span
              style={{
                padding: "clamp(6px, 1.5vw, 8px) clamp(12px, 2vw, 16px)",
                backgroundColor:
                  currentQuestion.difficulty === "easy"
                    ? "#ECFDF5"
                    : currentQuestion.difficulty === "medium"
                      ? COLORS.lightOrange
                      : "#FEF2F2",
                color:
                  currentQuestion.difficulty === "easy"
                    ? COLORS.success
                    : currentQuestion.difficulty === "medium"
                      ? COLORS.warning
                      : COLORS.error,
                borderRadius: "20px",
                fontSize: "clamp(12px, 1.8vw, 14px)",
                fontWeight: "700",
              }}
            >
              {currentQuestion.difficulty.charAt(0).toUpperCase() +
                currentQuestion.difficulty.slice(1)}
            </span>
          </div>
          <div
            style={{
              fontSize: "clamp(14px, 2vw, 16px)",
              fontWeight: "700",
              color: darkMode ? COLORS.white : COLORS.darkGray,
            }}
          >
            Score: {score} / {totalPoints}
          </div>
        </div>

        <h3
          style={{
            fontSize: "clamp(18px, 2.5vw, 20px)",
            fontWeight: "700",
            marginBottom: "clamp(16px, 3vw, 24px)",
            color: darkMode ? COLORS.white : COLORS.darkGray,
          }}
        >
          {currentQuestion.question}
        </h3>

        <div style={{ marginBottom: "clamp(16px, 3vw, 24px)" }}>
          {currentQuestion.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={showFeedback}
              style={{
                width: "100%",
                padding: "clamp(12px, 2vw, 16px)",
                marginBottom: "clamp(10px, 2vw, 12px)",
                borderRadius: "12px",
                border:
                  selectedAnswer === option
                    ? showFeedback
                      ? isCorrect
                        ? `2px solid ${COLORS.success}`
                        : `2px solid ${COLORS.error}`
                      : `2px solid ${themeColor}`
                    : `2px solid ${COLORS.lightGray}`,
                backgroundColor:
                  selectedAnswer === option
                    ? showFeedback
                      ? isCorrect
                        ? "#ECFDF5"
                        : "#FEF2F2"
                      : COLORS.lightPurple
                    : darkMode
                      ? COLORS.darkGray
                      : COLORS.white,
                color: darkMode ? COLORS.white : COLORS.darkGray,
                fontSize: "clamp(14px, 2vw, 16px)",
                textAlign: "left",
                cursor: showFeedback ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                fontWeight: selectedAnswer === option ? "600" : "400",
              }}
              onMouseEnter={(e) =>
                !showFeedback &&
                (e.currentTarget.style.transform = "translateX(8px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateX(0)")
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{option}</span>
                {showFeedback && selectedAnswer === option && (
                  <span style={{ fontSize: "clamp(18px, 2.5vw, 20px)" }}>
                    {isCorrect ? "✓" : "✗"}
                  </span>
                )}
                {showFeedback &&
                  option === currentQuestion.correctAnswer &&
                  selectedAnswer !== option && (
                    <span
                      style={{
                        fontSize: "clamp(18px, 2.5vw, 20px)",
                        color: COLORS.success,
                      }}
                    >
                      ✓
                    </span>
                  )}
              </div>
            </button>
          ))}
        </div>

        {showFeedback && (
          <div
            style={{
              padding: "clamp(16px, 2vw, 20px)",
              backgroundColor: isCorrect ? "#ECFDF5" : "#FEF2F2",
              border: `2px solid ${isCorrect ? COLORS.success : COLORS.error}`,
              borderRadius: "12px",
              marginBottom: "clamp(16px, 3vw, 24px)",
              animation: "scaleIn 0.3s ease-out",
            }}
          >
            <div
              style={{
                fontSize: "clamp(16px, 2.5vw, 18px)",
                fontWeight: "700",
                color: isCorrect ? COLORS.success : COLORS.error,
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "clamp(20px, 3vw, 24px)" }}>
                {isCorrect ? "✓" : "✗"}
              </span>
              {isCorrect ? "Correct!" : "Incorrect"}
            </div>
            <p
              style={{
                fontSize: "clamp(12px, 1.8vw, 14px)",
                color: darkMode ? COLORS.mediumGray : COLORS.darkGray,
                lineHeight: "1.6",
              }}
            >
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "clamp(16px, 2vw, 20px)",
            borderTop: `2px solid ${COLORS.lightGray}`,
            flexWrap: "wrap",
            gap: "clamp(10px, 2vw, 12px)",
          }}
        >
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            style={
              currentQuestionIndex === 0
                ? disabledButtonStyle
                : { ...buttonStyle, backgroundColor: COLORS.darkGray }
            }
            onMouseEnter={(e) =>
              currentQuestionIndex !== 0 &&
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            ← Previous
          </button>

          <div style={{ display: "flex", gap: "clamp(10px, 2vw, 12px)" }}>
            {!showFeedback ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                style={!selectedAnswer ? disabledButtonStyle : buttonStyle}
                onMouseEnter={(e) =>
                  selectedAnswer &&
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Submit Answer
              </button>
            ) : (
              <>
                {!isLastQuestion ? (
                  <button
                    onClick={handleNext}
                    style={{ ...buttonStyle, backgroundColor: COLORS.success }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    onClick={handleRestart}
                    style={{ ...buttonStyle, backgroundColor: COLORS.primary }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    🔄 Restart Quiz
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {isLastQuestion && showFeedback && (
          <div
            style={{
              marginTop: "clamp(24px, 4vw, 32px)",
              padding: "clamp(16px, 3vw, 24px)",
              backgroundColor: COLORS.lightOrange,
              borderRadius: "12px",
              border: `2px solid ${COLORS.secondary}`,
              textAlign: "center",
              animation: "scaleIn 0.5s ease-out",
            }}
          >
            <div
              style={{
                fontSize: "clamp(40px, 6vw, 48px)",
                marginBottom: "16px",
              }}
            >
              🏆
            </div>
            <h3
              style={{
                fontSize: "clamp(20px, 3vw, 24px)",
                fontWeight: "700",
                marginBottom: "12px",
                color: COLORS.darkGray,
              }}
            >
              Quiz Complete!
            </h3>
            <p
              style={{
                fontSize: "clamp(16px, 2.5vw, 18px)",
                color: COLORS.darkGray,
                marginBottom: "16px",
              }}
            >
              Final Score:{" "}
              <strong>
                {score} / {totalPoints}
              </strong>{" "}
              ({Math.round((score / totalPoints) * 100)}%)
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "clamp(10px, 2vw, 12px)",
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  padding: "clamp(12px, 2vw, 16px)",
                  backgroundColor: COLORS.white,
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(20px, 3vw, 24px)",
                    fontWeight: "700",
                    color: COLORS.success,
                  }}
                >
                  {answeredQuestions.length}
                </div>
                <div
                  style={{
                    fontSize: "clamp(11px, 1.5vw, 12px)",
                    color: COLORS.darkGray,
                  }}
                >
                  Questions Answered
                </div>
              </div>
              <div
                style={{
                  padding: "clamp(12px, 2vw, 16px)",
                  backgroundColor: COLORS.white,
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(20px, 3vw, 24px)",
                    fontWeight: "700",
                    color: COLORS.info,
                  }}
                >
                  {Math.round((score / totalPoints) * 100)}%
                </div>
                <div
                  style={{
                    fontSize: "clamp(11px, 1.5vw, 12px)",
                    color: COLORS.darkGray,
                  }}
                >
                  Score Percentage
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER REAL WORLD MODE
  // ═══════════════════════════════════════════════════════════════════════════

  const renderRealWorldMode = () => {
    const categories = [
      "all",
      ...Array.from(new Set(applications.map((app) => app.category))),
    ];
    const filteredApps =
      selectedCategory === "all"
        ? applications
        : applications.filter((app) => app.category === selectedCategory);

    return (
      <div>
        <div
          style={{
            ...cardStyle,
            marginBottom: "clamp(16px, 2vw, 20px)",
          }}
        >
          <h3
            style={{
              fontSize: "clamp(18px, 2.5vw, 20px)",
              fontWeight: "700",
              marginBottom: "clamp(12px, 2vw, 16px)",
              color: darkMode ? COLORS.white : COLORS.darkGray,
            }}
          >
            Filter by Category
          </h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "clamp(10px, 2vw, 12px)",
            }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: "clamp(8px, 1.5vw, 10px) clamp(16px, 2.5vw, 20px)",
                  borderRadius: "20px",
                  border: "none",
                  fontSize: "clamp(12px, 1.8vw, 14px)",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor:
                    selectedCategory === category
                      ? themeColor
                      : darkMode
                        ? COLORS.darkGray
                        : COLORS.lightGray,
                  color:
                    selectedCategory === category
                      ? COLORS.white
                      : darkMode
                        ? COLORS.mediumGray
                        : COLORS.darkGray,
                  boxShadow:
                    selectedCategory === category
                      ? "0 4px 12px rgba(74, 77, 201, 0.3)"
                      : "none",
                  transform:
                    selectedCategory === category ? "scale(1.05)" : "scale(1)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform =
                    selectedCategory === category ? "scale(1.05)" : "scale(1)")
                }
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          <p
            style={{
              marginTop: "12px",
              fontSize: "clamp(12px, 1.8vw, 14px)",
              color: darkMode ? COLORS.mediumGray : COLORS.darkGray,
            }}
          >
            Showing {filteredApps.length} application
            {filteredApps.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(16px, 2vw, 20px)",
          }}
        >
          {filteredApps.map((app, index) => {
            const isExpanded = expandedApp === app.id;

            return (
              <div
                key={app.id}
                style={{
                  ...cardStyle,
                  animation: `slideInFromBottom ${0.3 + index * 0.1}s ease-out`,
                }}
              >
                <div
                  onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                  style={{
                    cursor: "pointer",
                    paddingBottom: "clamp(12px, 2vw, 16px)",
                    borderBottom: `2px solid ${COLORS.lightGray}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "12px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: "clamp(16px, 2.5vw, 18px)",
                          fontWeight: "700",
                          marginBottom: "8px",
                          color: darkMode ? COLORS.white : COLORS.darkGray,
                        }}
                      >
                        {app.title}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            padding: "4px 12px",
                            backgroundColor: COLORS.lightPurple,
                            color: themeColor,
                            borderRadius: "12px",
                            fontSize: "clamp(11px, 1.5vw, 12px)",
                            fontWeight: "600",
                          }}
                        >
                          {app.category}
                        </span>
                        <span
                          style={{
                            padding: "4px 12px",
                            backgroundColor:
                              app.difficulty === "everyday"
                                ? "#ECFDF5"
                                : app.difficulty === "industrial"
                                  ? COLORS.lightOrange
                                  : "#FEF2F2",
                            color:
                              app.difficulty === "everyday"
                                ? COLORS.success
                                : app.difficulty === "industrial"
                                  ? COLORS.warning
                                  : COLORS.error,
                            borderRadius: "12px",
                            fontSize: "clamp(11px, 1.5vw, 12px)",
                            fontWeight: "600",
                          }}
                        >
                          {app.difficulty.charAt(0).toUpperCase() +
                            app.difficulty.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(18px, 2.5vw, 20px)",
                        transition: "transform 0.3s ease",
                        transform: isExpanded
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      ▼
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: "clamp(12px, 1.8vw, 14px)",
                      color: darkMode ? COLORS.mediumGray : COLORS.darkGray,
                      lineHeight: "1.6",
                      marginBottom: "12px",
                    }}
                  >
                    {app.description}
                  </p>

                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: darkMode ? "#2C2C2C" : COLORS.background,
                      borderRadius: "8px",
                      borderLeft: `4px solid ${themeColor}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "clamp(11px, 1.5vw, 12px)",
                        fontWeight: "600",
                        color: darkMode ? COLORS.mediumGray : COLORS.darkGray,
                        marginBottom: "4px",
                      }}
                    >
                      Real-Life Example:
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(12px, 1.8vw, 14px)",
                        color: darkMode ? COLORS.mediumGray : COLORS.darkGray,
                        fontStyle: "italic",
                      }}
                    >
                      {app.realExample}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div
                    style={{
                      marginTop: "clamp(12px, 2vw, 16px)",
                      animation: "slideInFromBottom 0.3s ease-out",
                    }}
                  >
                    <div
                      style={{
                        padding: "clamp(12px, 2vw, 16px)",
                        backgroundColor: "#EFF6FF",
                        borderRadius: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "clamp(12px, 1.8vw, 14px)",
                          fontWeight: "700",
                          color: "#1E40AF",
                          marginBottom: "8px",
                        }}
                      >
                        How It Works
                      </h4>
                      <p
                        style={{
                          fontSize: "clamp(12px, 1.8vw, 14px)",
                          color: COLORS.darkGray,
                          lineHeight: "1.6",
                        }}
                      >
                        {app.howItWorks}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        style={{
                          padding: "12px",
                          backgroundColor: "#ECFDF5",
                          borderRadius: "8px",
                          border: `2px solid ${COLORS.success}`,
                        }}
                      >
                        <h4
                          style={{
                            fontSize: "clamp(11px, 1.5vw, 12px)",
                            fontWeight: "700",
                            color: COLORS.success,
                            marginBottom: "4px",
                          }}
                        >
                          ⚡ Good Conductor
                        </h4>
                        <p
                          style={{
                            fontSize: "clamp(11px, 1.5vw, 13px)",
                            color: COLORS.darkGray,
                            fontWeight: "600",
                          }}
                        >
                          {app.conductor}
                        </p>
                      </div>

                      <div
                        style={{
                          padding: "12px",
                          backgroundColor: "#FEF2F2",
                          borderRadius: "8px",
                          border: `2px solid ${COLORS.error}`,
                        }}
                      >
                        <h4
                          style={{
                            fontSize: "clamp(11px, 1.5vw, 12px)",
                            fontWeight: "700",
                            color: COLORS.error,
                            marginBottom: "4px",
                          }}
                        >
                          🛡️ Insulator
                        </h4>
                        <p
                          style={{
                            fontSize: "clamp(11px, 1.5vw, 13px)",
                            color: COLORS.darkGray,
                            fontWeight: "600",
                          }}
                        >
                          {app.insulator}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "clamp(12px, 2vw, 16px)",
                        backgroundColor: COLORS.lightOrange,
                        borderRadius: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "clamp(12px, 1.8vw, 14px)",
                          fontWeight: "700",
                          color: "#92400E",
                          marginBottom: "8px",
                        }}
                      >
                        🔬 Science Behind It
                      </h4>
                      <p
                        style={{
                          fontSize: "clamp(12px, 1.8vw, 14px)",
                          color: COLORS.darkGray,
                          lineHeight: "1.6",
                        }}
                      >
                        {app.scienceBehind}
                      </p>
                    </div>

                    <div
                      style={{
                        padding: "clamp(12px, 2vw, 16px)",
                        backgroundColor: darkMode ? "#2C2C2C" : COLORS.white,
                        borderRadius: "8px",
                        border: `2px solid ${COLORS.mediumGray}`,
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "clamp(12px, 1.8vw, 14px)",
                          fontWeight: "700",
                          color: darkMode ? COLORS.white : COLORS.darkGray,
                          marginBottom: "8px",
                        }}
                      >
                        ✨ Benefits & Impact
                      </h4>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: "20px",
                          listStyleType: "none",
                        }}
                      >
                        {app.benefits.map((benefit, idx) => (
                          <li
                            key={idx}
                            style={{
                              fontSize: "clamp(12px, 1.8vw, 14px)",
                              color: darkMode
                                ? COLORS.mediumGray
                                : COLORS.darkGray,
                              marginBottom: "6px",
                              display: "flex",
                              alignItems: "start",
                              gap: "8px",
                            }}
                          >
                            <span
                              style={{
                                color: themeColor,
                                fontSize: "clamp(14px, 2vw, 16px)",
                              }}
                            >
                              ✓
                            </span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div style={containerStyle}>
      {showModeSelector && (
        <div style={headerStyle}>
          {enabledModes.includes("learn") && (
            <button
              onClick={() => setMode("learn")}
              style={modeButtonStyle(mode === "learn")}
              onMouseEnter={(e) =>
                mode !== "learn" &&
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform =
                  mode === "learn" ? "scale(1.05)" : "scale(1)")
              }
            >
              📚 Learn
            </button>
          )}
          {enabledModes.includes("practice") && (
            <button
              onClick={() => setMode("practice")}
              style={modeButtonStyle(mode === "practice")}
              onMouseEnter={(e) =>
                mode !== "practice" &&
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform =
                  mode === "practice" ? "scale(1.05)" : "scale(1)")
              }
            >
              🎯 Practice
            </button>
          )}
          {enabledModes.includes("real_world") && (
            <button
              onClick={() => setMode("real_world")}
              style={modeButtonStyle(mode === "real_world")}
              onMouseEnter={(e) =>
                mode !== "real_world" &&
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform =
                  mode === "real_world" ? "scale(1.05)" : "scale(1)")
              }
            >
              🌍 Real World
            </button>
          )}
        </div>
      )}

      {mode === "learn" && renderLearnMode()}
      {mode === "practice" && renderPracticeMode()}
      {mode === "real_world" && renderRealWorldMode()}
    </div>
  );
};

export default HeatConductionTool;
