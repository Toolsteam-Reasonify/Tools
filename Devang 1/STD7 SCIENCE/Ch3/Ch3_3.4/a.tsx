// @ts-nocheck — React types not resolved in this workspace; runtime unchanged.
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// SINGULARITY DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════
const DESIGN = {
  colors: {
    primary: "#4A4DC9",
    secondary: "#FF7212",
    gradientStart: "#533086",
    gradientEnd: "#FC9145",
    lightPrimary: "#C1C1EA",
    lightSecondary: "#FFF3E4",
    dark: "#4E4E4E",
    mid: "#CACACA",
    light: "#EBEBEB",
    surface: "#F5F5F5",
    white: "#FFFFFF",
    success: "#2ECC71",
    error: "#E74C3C",
    textPrimary: "#2D2D3F",
    textSecondary: "#6B6B80",
    textMuted: "#9B9BB0",
  },
  radius: { sm: "8px", md: "12px", lg: "16px", xl: "24px", full: "9999px" },
  shadow: {
    sm: "0 2px 8px rgba(74,77,201,0.08)",
    md: "0 4px 16px rgba(74,77,201,0.12)",
    lg: "0 8px 32px rgba(74,77,201,0.16)",
    xl: "0 16px 48px rgba(74,77,201,0.20)",
    glow: "0 0 24px rgba(74,77,201,0.25)",
    orangeGlow: "0 0 24px rgba(255,114,18,0.25)",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT MATERIALS
// ═══════════════════════════════════════════════════════════════════════════
const DEFAULT_MATERIALS = [
  {
    id: "iron",
    label: "Iron Rod",
    type: "conductor",
    color: "#4A4DC9",
    description: "a metal that allows electricity to flow through it",
  },
  {
    id: "copper",
    label: "Copper Rod",
    type: "conductor",
    color: "#C98A5A",
    description: "an excellent conductor of electricity",
  },
  {
    id: "graphite",
    label: "Graphite",
    type: "conductor",
    color: "#6B6B80",
    description: "the 'lead' in pencils, which conducts electricity",
  },
  {
    id: "wood",
    label: "Wood",
    type: "insulator",
    color: "#8B6B4A",
    description: "a natural material that does not conduct electricity",
  },
  {
    id: "plastic",
    label: "Plastic",
    type: "insulator",
    color: "#FF7212",
    description: "a synthetic material that blocks electricity",
  },
  {
    id: "pencil",
    label: "Pencil",
    type: "insulator",
    color: "#E74C3C",
    description:
      "the wooden body of a pencil, which does not conduct electricity",
  },
  {
    id: "rubber",
    label: "Rubber",
    type: "insulator",
    color: "#533086",
    description: "used to cover wires because it stops electricity",
  },
  {
    id: "glass",
    label: "Glass",
    type: "insulator",
    color: "#7BC8E8",
    description: "transparent material that does not conduct electricity",
  },
];

const GAP_POSITION = { x: 230, y: 150 };
const SNAP_DISTANCE = 40;

// ═══════════════════════════════════════════════════════════════════════════
// QUESTION BANK
// ═══════════════════════════════════════════════════════════════════════════
const questionBank = [
  {
    id: "ci_1",
    type: "mcq",
    difficulty: "easy",
    question: "Which of the following is a conductor of electricity?",
    options: ["Plastic scale", "Copper wire", "Rubber eraser", "Wooden stick"],
    correctAnswer: 1,
    explanation:
      "Copper wire is a conductor because it is made of metal. Metals allow electricity to flow through them easily.",
    topic: "identification",
  },
  {
    id: "ci_2",
    type: "mcq",
    difficulty: "easy",
    question: "Which material is an insulator?",
    options: ["Iron nail", "Aluminum foil", "Glass bangle", "Steel spoon"],
    correctAnswer: 2,
    explanation:
      "Glass bangle is an insulator because glass does not allow electricity to pass through it.",
    topic: "identification",
  },
  {
    id: "ci_3",
    type: "trueFalse",
    difficulty: "easy",
    question: "All metals are good conductors of electricity.",
    options: ["True", "False"],
    correctAnswer: 0,
    explanation:
      "True! All metals like copper, iron, aluminum, gold, and silver are good conductors of electricity.",
    topic: "properties",
  },
  {
    id: "ci_4",
    type: "trueFalse",
    difficulty: "easy",
    question: "Plastic is a good conductor of electricity.",
    options: ["True", "False"],
    correctAnswer: 1,
    explanation:
      "False! Plastic is an insulator. That's why wires are covered with plastic.",
    topic: "properties",
  },
  {
    id: "ci_5",
    type: "mcq",
    difficulty: "medium",
    question: "Why are electric wires made of copper or aluminum?",
    options: [
      "Because they are cheap",
      "Because they are good conductors",
      "Because they are colorful",
      "Because they are light",
    ],
    correctAnswer: 1,
    explanation:
      "Copper and aluminum are good conductors of electricity, allowing current to flow easily.",
    topic: "wires",
  },
  {
    id: "ci_6",
    type: "mcq",
    difficulty: "medium",
    question: "Why are electric wires covered with plastic or rubber?",
    options: [
      "To look colorful",
      "To protect from electric shock",
      "To make them stronger",
      "To make them waterproof",
    ],
    correctAnswer: 1,
    explanation:
      "Plastic and rubber are insulators that prevent electricity from flowing out and protect us from shocks.",
    topic: "wires",
  },
  {
    id: "ci_7",
    type: "mcq",
    difficulty: "medium",
    question: "What happens if we use wooden sticks instead of metal wires?",
    options: [
      "Lamp glows brighter",
      "Lamp will not glow",
      "Circuit works better",
      "Nothing changes",
    ],
    correctAnswer: 1,
    explanation:
      "Wood is an insulator, so it does not allow electricity to pass through. The lamp will not glow.",
    topic: "wires",
  },
  {
    id: "ci_8",
    type: "trueFalse",
    difficulty: "medium",
    question: "Silver is the best conductor of electricity among all metals.",
    options: ["True", "False"],
    correctAnswer: 0,
    explanation:
      "True! Silver is the best conductor, followed by copper and gold. Copper is most commonly used because silver is expensive.",
    topic: "properties",
  },
  {
    id: "ci_9",
    type: "mcq",
    difficulty: "medium",
    question: "In a conduction tester, what does a glowing lamp mean?",
    options: [
      "Object is an insulator",
      "Object is a conductor",
      "Tester is broken",
      "Battery is dead",
    ],
    correctAnswer: 1,
    explanation:
      "If the lamp glows, electricity can flow through the object — it is a conductor.",
    topic: "testing",
  },
  {
    id: "ci_10",
    type: "mcq",
    difficulty: "medium",
    question: "What are the main components of a conduction tester?",
    options: [
      "Cell, lamp, and wires",
      "Only a battery",
      "Switch and bulb only",
      "Magnet and compass",
    ],
    correctAnswer: 0,
    explanation:
      "A conduction tester needs a cell (battery), a lamp, and wires with free ends for testing.",
    topic: "testing",
  },
  {
    id: "ci_11",
    type: "mcq",
    difficulty: "medium",
    question: "Why should we never touch appliances with wet hands?",
    options: [
      "Water makes appliances dirty",
      "Water conducts electricity increasing shock risk",
      "It damages the appliance",
      "It wastes electricity",
    ],
    correctAnswer: 1,
    explanation:
      "Water with dissolved salts is a conductor. Wet hands increase risk of electric current passing through our body.",
    topic: "safety",
  },
  {
    id: "ci_12",
    type: "trueFalse",
    difficulty: "hard",
    question: "The human body is a conductor of electricity.",
    options: ["True", "False"],
    correctAnswer: 0,
    explanation:
      "True! The human body contains water and salts that make it a conductor. This is why electric shock is dangerous.",
    topic: "safety",
  },
  {
    id: "ci_13",
    type: "mcq",
    difficulty: "hard",
    question: "What should you do if you see a wire with damaged insulation?",
    options: [
      "Touch it to check",
      "Leave it as it is",
      "Inform an adult, do not touch",
      "Try to repair it",
    ],
    correctAnswer: 2,
    explanation:
      "Damaged insulation exposes conducting wire. Always inform an adult and never touch it.",
    topic: "safety",
  },
  {
    id: "ci_14",
    type: "mcq",
    difficulty: "medium",
    question: "Why are handles of electric tools made of plastic or rubber?",
    options: [
      "Comfortable to hold",
      "Protect from electric shock",
      "Look nice",
      "Make them cheaper",
    ],
    correctAnswer: 1,
    explanation:
      "Plastic and rubber are insulators that prevent electricity from reaching our hands.",
    topic: "applications",
  },
  {
    id: "ci_15",
    type: "mcq",
    difficulty: "hard",
    question: "A bird on a single electric wire doesn't get shocked. Why?",
    options: [
      "Birds are insulators",
      "Thick feathers",
      "Current needs a complete path",
      "Low voltage wire",
    ],
    correctAnswer: 2,
    explanation:
      "Electric current needs a complete circuit. The bird touches only one wire, so no complete path exists.",
    topic: "applications",
  },
  {
    id: "ci_16",
    type: "mcq",
    difficulty: "hard",
    question:
      "Your tester's lamp doesn't glow when testing a coin. What's wrong?",
    options: [
      "Coin is not a conductor",
      "Battery may be dead or wires loose",
      "Coins cannot conduct",
      "Lamp is too bright",
    ],
    correctAnswer: 1,
    explanation:
      "Coins are metal conductors. If the lamp doesn't glow, check the battery and connections first.",
    topic: "testing",
  },
  {
    id: "ci_17",
    type: "mcq",
    difficulty: "hard",
    question: "Which material combination is BEST for a safe electrical plug?",
    options: [
      "Metal pins with plastic body",
      "All plastic",
      "All metal",
      "Wood pins with metal body",
    ],
    correctAnswer: 0,
    explanation:
      "Metal pins conduct electricity for connection, while the plastic body insulates and protects us.",
    topic: "applications",
  },
  {
    id: "ci_18",
    type: "trueFalse",
    difficulty: "hard",
    question: "Pure distilled water is a poor conductor of electricity.",
    options: ["True", "False"],
    correctAnswer: 0,
    explanation:
      "True! Pure water doesn't conduct well. Daily-use water has dissolved salts making it a good conductor.",
    topic: "properties",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function ConductorsInsulatorsCircuitTool() {
  const [currentMode, setCurrentMode] = useState("learn");
  const [materialPositions, setMaterialPositions] = useState(() => {
    const positions = {};
    DEFAULT_MATERIALS.forEach((mat, i) => {
      const row = Math.floor(i / 4);
      const col = i % 4;
      positions[mat.id] = { x: 120 + col * 80, y: 270 + row * 50 };
    });
    return positions;
  });

  const [draggedMaterial, setDraggedMaterial] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [materialInGap, setMaterialInGap] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [showPredictionUI, setShowPredictionUI] = useState(false);
  const [testedMaterials, setTestedMaterials] = useState([]);
  const [showCurrentFlow, setShowCurrentFlow] = useState(true);
  const [nearGap, setNearGap] = useState(false);

  // Practice state
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Responsive
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  const svgRef = useRef(null);
  const isBulbOn = materialInGap?.type === "conductor";
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ─── SVG coordinate conversion ───
  const screenToSVG = useCallback((clientX, clientY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(screenCTM.inverse());
    return { x: svgP.x, y: svgP.y };
  }, []);

  const isNearGap = useCallback((x, y) => {
    return (
      Math.sqrt(
        Math.pow(x - GAP_POSITION.x, 2) + Math.pow(y - GAP_POSITION.y, 2),
      ) < SNAP_DISTANCE
    );
  }, []);

  // ─── Drag Handlers ───
  const handlePointerDown = useCallback(
    (e, material) => {
      e.preventDefault();
      e.target.setPointerCapture?.(e.pointerId);
      const svgCoords = screenToSVG(e.clientX, e.clientY);
      const pos = materialPositions[material.id];
      setDraggedMaterial(material);
      setDragOffset({ x: svgCoords.x - pos.x, y: svgCoords.y - pos.y });
    },
    [materialPositions, screenToSVG],
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!draggedMaterial) return;
      e.preventDefault();
      const svgCoords = screenToSVG(e.clientX, e.clientY);
      const newX = Math.max(50, Math.min(450, svgCoords.x - dragOffset.x));
      const newY = Math.max(50, Math.min(370, svgCoords.y - dragOffset.y));
      setMaterialPositions((prev) => ({
        ...prev,
        [draggedMaterial.id]: { x: newX, y: newY },
      }));
      setNearGap(isNearGap(newX, newY));
    },
    [draggedMaterial, dragOffset, isNearGap, screenToSVG],
  );

  const handlePointerUp = useCallback(
    (e) => {
      if (!draggedMaterial) return;
      e.preventDefault();
      const pos = materialPositions[draggedMaterial.id];
      if (isNearGap(pos.x, pos.y)) {
        setMaterialPositions((prev) => ({
          ...prev,
          [draggedMaterial.id]: { x: GAP_POSITION.x, y: GAP_POSITION.y },
        }));
        if (materialInGap && materialInGap.id !== draggedMaterial.id) {
          setMaterialPositions((prev) => ({
            ...prev,
            [materialInGap.id]: {
              x: prev[materialInGap.id].x + 60,
              y: prev[materialInGap.id].y + 40,
            },
          }));
        }
        setMaterialInGap(draggedMaterial);
        setPrediction(null);
        setShowPredictionUI(false);
        if (!testedMaterials.find((m) => m.id === draggedMaterial.id)) {
          setTestedMaterials((prev) => [...prev, draggedMaterial]);
        }
      } else if (materialInGap?.id === draggedMaterial.id) {
        setMaterialInGap(null);
        setPrediction(null);
        setShowPredictionUI(false);
      }
      setDraggedMaterial(null);
      setNearGap(false);
    },
    [
      draggedMaterial,
      materialPositions,
      isNearGap,
      materialInGap,
      testedMaterials,
    ],
  );

  useEffect(() => {
    if (draggedMaterial) {
      const move = (e) => handlePointerMove(e);
      const up = (e) => handlePointerUp(e);
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
      return () => {
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
      };
    }
  }, [draggedMaterial, handlePointerMove, handlePointerUp]);

  const resetSimulation = () => {
    const positions = {};
    DEFAULT_MATERIALS.forEach((mat, i) => {
      const row = Math.floor(i / 4);
      const col = i % 4;
      positions[mat.id] = { x: 120 + col * 80, y: 270 + row * 50 };
    });
    setMaterialPositions(positions);
    setMaterialInGap(null);
    setPrediction(null);
    setShowPredictionUI(false);
    setDraggedMaterial(null);
    setTestedMaterials([]);
  };

  // ─── Practice Mode ───
  const startPractice = useCallback(() => {
    const shuffled = [...questionBank]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setCurrentQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers(Array(shuffled.length).fill(null));
    setShowResults(false);
  }, []);

  useEffect(() => {
    if (currentMode === "practice" && currentQuestions.length === 0)
      startPractice();
  }, [currentMode, currentQuestions.length, startPractice]);

  const handleSubmit = () => {
    if (selectedAnswer !== null && !isAnswered) {
      setIsAnswered(true);
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setUserAnswers(newAnswers);
      if (
        selectedAnswer === currentQuestions[currentQuestionIndex].correctAnswer
      )
        setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else setShowResults(true);
  };

  const isPredictionCorrect = prediction === materialInGap?.type;

  // ═══════════════════════════════════════════════════════════════════════════
  // STYLES (Singularity Design System)
  // ═══════════════════════════════════════════════════════════════════════════

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
    
    * { box-sizing: border-box; }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes popIn {
      0% { transform: scale(0.8); opacity: 0; }
      70% { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(74,77,201,0.3); }
      50% { box-shadow: 0 0 20px 4px rgba(74,77,201,0.15); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-16px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  const ModeTab = ({ mode, icon, label }) => (
    <button
      onClick={() => setCurrentMode(mode)}
      style={{
        padding: isMobile ? "10px 16px" : "12px 24px",
        border:
          currentMode === mode ? "none" : `2px solid ${DESIGN.colors.light}`,
        borderRadius: DESIGN.radius.full,
        fontSize: isMobile ? "13px" : "15px",
        fontWeight: 600,
        fontFamily: "Poppins, sans-serif",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background:
          currentMode === mode
            ? `linear-gradient(135deg, ${DESIGN.colors.primary} 0%, ${DESIGN.colors.gradientStart} 100%)`
            : DESIGN.colors.white,
        color:
          currentMode === mode
            ? DESIGN.colors.white
            : DESIGN.colors.textSecondary,
        boxShadow: currentMode === mode ? DESIGN.shadow.md : DESIGN.shadow.sm,
        transform: currentMode === mode ? "scale(1.02)" : "scale(1)",
        whiteSpace: "nowrap",
      }}
    >
      {icon} {label}
    </button>
  );

  const SingularityButton = ({
    children,
    variant = "contained",
    color = "primary",
    onClick,
    disabled = false,
    style: extraStyle = {},
  }: {
    children?: React.ReactNode;
    variant?: string;
    color?: string;
    onClick?: () => void;
    disabled?: boolean;
    style?: React.CSSProperties;
  }) => {
    const c =
      color === "primary"
        ? DESIGN.colors.primary
        : color === "secondary"
          ? DESIGN.colors.secondary
          : color;
    const bg =
      variant === "contained"
        ? `linear-gradient(135deg, ${c}, ${c}dd)`
        : "transparent";
    const textColor = variant === "contained" ? DESIGN.colors.white : c;
    const border = variant === "outlined" ? `2px solid ${c}` : "none";
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          padding: "12px 24px",
          border,
          borderRadius: DESIGN.radius.full,
          fontSize: "14px",
          fontWeight: 600,
          fontFamily: "Poppins, sans-serif",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          background: disabled ? DESIGN.colors.light : bg,
          color: disabled ? DESIGN.colors.mid : textColor,
          boxShadow:
            variant === "contained" && !disabled ? `0 4px 14px ${c}33` : "none",
          opacity: disabled ? 0.6 : 1,
          ...extraStyle,
        }}
      >
        {children}
      </button>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PRACTICE MODE RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const renderPractice = () => {
    if (showResults) {
      const pct = Math.round((score / currentQuestions.length) * 100);
      return (
        <div
          style={{
            padding: isMobile ? "16px" : "32px",
            maxWidth: "700px",
            margin: "0 auto",
            animation: "fadeInUp 0.5s ease-out",
          }}
        >
          <div
            style={{
              background: DESIGN.colors.white,
              borderRadius: DESIGN.radius.xl,
              padding: isMobile ? "24px" : "40px",
              boxShadow: DESIGN.shadow.lg,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "56px",
                marginBottom: "12px",
                animation: "popIn 0.5s ease-out",
              }}
            >
              {pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "📚"}
            </div>
            <h2
              style={{
                fontFamily: "Poppins",
                fontSize: isMobile ? "24px" : "32px",
                fontWeight: 700,
                color: DESIGN.colors.textPrimary,
                margin: "0 0 8px",
              }}
            >
              {pct >= 80
                ? "Excellent!"
                : pct >= 60
                  ? "Good Job!"
                  : "Keep Going!"}
            </h2>
            <p
              style={{
                fontFamily: "Poppins",
                fontSize: "15px",
                color: DESIGN.colors.textSecondary,
                margin: "0 0 28px",
              }}
            >
              {pct >= 80
                ? "You've mastered this topic!"
                : pct >= 60
                  ? "Almost there — keep practicing!"
                  : "Don't give up, you're learning!"}
            </p>

            <div
              style={{
                background: `linear-gradient(135deg, ${DESIGN.colors.lightPrimary}40, ${DESIGN.colors.lightSecondary}40)`,
                padding: "28px",
                borderRadius: DESIGN.radius.lg,
                marginBottom: "24px",
                border: `2px solid ${DESIGN.colors.lightPrimary}`,
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: 800,
                  fontFamily: "Poppins",
                  background: `linear-gradient(135deg, ${DESIGN.colors.primary}, ${DESIGN.colors.secondary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {score}/{currentQuestions.length}
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  fontFamily: "Poppins",
                  color: DESIGN.colors.primary,
                }}
              >
                {pct}%
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                marginBottom: "28px",
              }}
            >
              {[
                {
                  emoji: "✓",
                  val: score,
                  label: "Correct",
                  bg: "#E8F8F0",
                  border: "#2ECC71",
                  color: "#1A7D45",
                },
                {
                  emoji: "✗",
                  val: currentQuestions.length - score,
                  label: "Wrong",
                  bg: "#FDECEB",
                  border: "#E74C3C",
                  color: "#A82D22",
                },
                {
                  emoji: "🎯",
                  val: currentQuestions.length,
                  label: "Total",
                  bg: DESIGN.colors.lightPrimary + "40",
                  border: DESIGN.colors.primary,
                  color: DESIGN.colors.primary,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: item.bg,
                    padding: "16px 8px",
                    borderRadius: DESIGN.radius.md,
                    border: `2px solid ${item.border}30`,
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "4px" }}>
                    {item.emoji}
                  </div>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      color: item.color,
                      fontFamily: "Poppins",
                    }}
                  >
                    {item.val}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: item.color,
                      fontFamily: "Poppins",
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <SingularityButton onClick={startPractice}>
              🔄 Try Again
            </SingularityButton>
          </div>
        </div>
      );
    }

    const q = currentQuestions[currentQuestionIndex];
    if (!q) return null;
    const isCorrect = selectedAnswer === q.correctAnswer;

    return (
      <div
        style={{
          padding: isMobile ? "16px" : "32px",
          maxWidth: "800px",
          margin: "0 auto",
          animation: "fadeInUp 0.4s ease-out",
        }}
      >
        <div
          style={{
            background: DESIGN.colors.white,
            borderRadius: DESIGN.radius.xl,
            padding: isMobile ? "20px" : "32px",
            boxShadow: DESIGN.shadow.md,
          }}
        >
          {/* Progress */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                fontFamily: "Poppins",
                fontSize: "13px",
                fontWeight: 600,
                color: DESIGN.colors.textSecondary,
              }}
            >
              <span>
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </span>
              <span>Score: {score}</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "6px",
                background: DESIGN.colors.light,
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${DESIGN.colors.primary}, ${DESIGN.colors.secondary})`,
                  transition: "width 0.5s ease",
                  borderRadius: "3px",
                }}
              />
            </div>
          </div>

          {/* Difficulty */}
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: DESIGN.radius.full,
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "Poppins",
              marginBottom: "16px",
              background:
                q.difficulty === "easy"
                  ? "#E8F8F0"
                  : q.difficulty === "medium"
                    ? DESIGN.colors.lightSecondary
                    : "#FDECEB",
              color:
                q.difficulty === "easy"
                  ? "#1A7D45"
                  : q.difficulty === "medium"
                    ? "#B85C00"
                    : "#A82D22",
            }}
          >
            {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
          </span>

          {/* Question */}
          <div
            style={{
              background: `linear-gradient(135deg, ${DESIGN.colors.lightPrimary}30, ${DESIGN.colors.lightSecondary}30)`,
              padding: isMobile ? "16px" : "24px",
              borderRadius: DESIGN.radius.lg,
              marginBottom: "20px",
              border: `1.5px solid ${DESIGN.colors.lightPrimary}60`,
            }}
          >
            <h3
              style={{
                fontFamily: "Poppins",
                fontSize: isMobile ? "16px" : "18px",
                fontWeight: 600,
                color: DESIGN.colors.textPrimary,
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {q.question}
            </h3>
          </div>

          {/* Options */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            {q.options?.map((opt, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrectOpt = i === q.correctAnswer;
              let bg = DESIGN.colors.white;
              let border = `2px solid ${DESIGN.colors.light}`;
              let textCol = DESIGN.colors.textPrimary;
              let circBg = DESIGN.colors.surface;
              let circCol = DESIGN.colors.textMuted;

              if (isAnswered) {
                if (isCorrectOpt) {
                  bg = "#E8F8F0";
                  border = "2px solid #2ECC71";
                  textCol = "#1A7D45";
                  circBg = "#2ECC71";
                  circCol = "#fff";
                } else if (isSelected) {
                  bg = "#FDECEB";
                  border = "2px solid #E74C3C";
                  textCol = "#A82D22";
                  circBg = "#E74C3C";
                  circCol = "#fff";
                } else {
                  textCol = DESIGN.colors.textMuted;
                }
              } else if (isSelected) {
                bg = DESIGN.colors.lightPrimary + "30";
                border = `2px solid ${DESIGN.colors.primary}`;
                circBg = DESIGN.colors.primary;
                circCol = "#fff";
              }

              return (
                <button
                  key={i}
                  onClick={() => !isAnswered && setSelectedAnswer(i)}
                  disabled={isAnswered}
                  style={{
                    width: "100%",
                    padding: isMobile ? "12px" : "14px 16px",
                    border,
                    borderRadius: DESIGN.radius.md,
                    background: bg,
                    color: textCol,
                    cursor: isAnswered ? "default" : "pointer",
                    textAlign: "left",
                    fontSize: "15px",
                    fontFamily: "Poppins",
                    fontWeight: isSelected || isCorrectOpt ? 600 : 400,
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    animation: `slideIn ${0.3 + i * 0.08}s ease-out`,
                  }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: 700,
                      background: circBg,
                      color: circCol,
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span style={{ flex: 1 }}>{opt}</span>
                  {isAnswered && isCorrectOpt && (
                    <span style={{ fontSize: "20px" }}>✓</span>
                  )}
                  {isAnswered && isSelected && !isCorrectOpt && (
                    <span style={{ fontSize: "20px" }}>✗</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isAnswered && (
            <div
              style={{
                padding: "18px",
                borderRadius: DESIGN.radius.md,
                marginBottom: "20px",
                background: isCorrect ? "#E8F8F0" : "#FDECEB",
                border: `2px solid ${isCorrect ? "#2ECC71" : "#E74C3C"}30`,
                animation: "popIn 0.35s ease-out",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: "22px" }}>
                  {isCorrect ? "✓" : "✗"}
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: isCorrect ? "#1A7D45" : "#A82D22",
                      marginBottom: "6px",
                    }}
                  >
                    {isCorrect ? "Correct!" : "Not Quite"}
                  </div>
                  {!isCorrect && (
                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "13px",
                        color: "#A82D22",
                        margin: "0 0 4px",
                      }}
                    >
                      <strong>Answer:</strong> {q.options?.[q.correctAnswer]}
                    </p>
                  )}
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "13px",
                      color: isCorrect ? "#1A7D45" : "#A82D22",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {q.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Nav Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            {!isAnswered ? (
              <SingularityButton
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                color={selectedAnswer === null ? DESIGN.colors.mid : "primary"}
                style={{ flex: 1 }}
              >
                Submit Answer
              </SingularityButton>
            ) : (
              <SingularityButton onClick={handleNext} style={{ flex: 1 }}>
                {currentQuestionIndex < currentQuestions.length - 1
                  ? "Next Question →"
                  : "See Results"}
              </SingularityButton>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // REAL WORLD RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const renderRealWorld = () => {
    const cards = [
      {
        icon: "🍳",
        title: "Cooking",
        desc: "Electric stoves, microwaves, kettles & toasters",
        color: DESIGN.colors.secondary,
        items: ["Electric Stove", "Microwave", "Kettle", "Toaster"],
      },
      {
        icon: "💡",
        title: "Lighting",
        desc: "LED bulbs, street lights, flashlights & lamps",
        color: "#EAB308",
        items: ["LED Bulbs", "Street Lights", "Flashlights", "Lamps"],
      },
      {
        icon: "🚗",
        title: "Transport",
        desc: "Electric cars, trains, trams & e-bikes",
        color: DESIGN.colors.primary,
        items: ["Electric Cars", "Trains", "Trams", "E-Bikes"],
      },
      {
        icon: "❄️",
        title: "Climate",
        desc: "ACs, heaters, electric blankets & fans",
        color: "#06B6D4",
        items: ["AC", "Heaters", "Blankets", "Fans"],
      },
      {
        icon: "📺",
        title: "Entertainment",
        desc: "TVs, computers, gaming consoles & speakers",
        color: DESIGN.colors.gradientStart,
        items: ["Television", "Computers", "Consoles", "Speakers"],
      },
      {
        icon: "📱",
        title: "Communication",
        desc: "Phones, routers, radios & satellites",
        color: "#14B8A6",
        items: ["Phones", "Routers", "Radios", "Satellites"],
      },
    ];

    return (
      <div style={{ padding: isMobile ? "16px" : "32px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "Poppins",
              fontSize: isMobile ? "24px" : "30px",
              fontWeight: 700,
              textAlign: "center",
              color: DESIGN.colors.textPrimary,
              margin: "0 0 4px",
            }}
          >
            Real World Applications
          </h2>
          <p
            style={{
              fontFamily: "Poppins",
              fontSize: "15px",
              textAlign: "center",
              color: DESIGN.colors.textSecondary,
              margin: "0 0 28px",
            }}
          >
            How conductors and insulators power everyday life
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : isTablet
                  ? "repeat(2, 1fr)"
                  : "repeat(3, 1fr)",
              gap: "20px",
              marginBottom: "28px",
            }}
          >
            {cards.map((card, i) => (
              <div
                key={i}
                style={{
                  background: DESIGN.colors.white,
                  borderRadius: DESIGN.radius.lg,
                  overflow: "hidden",
                  boxShadow: DESIGN.shadow.sm,
                  transition: "all 0.3s ease",
                  animation: `fadeInUp ${0.3 + i * 0.08}s ease-out`,
                  border: `1.5px solid ${DESIGN.colors.light}`,
                }}
              >
                <div
                  style={{
                    background: `linear-gradient(135deg, ${card.color}, ${card.color}bb)`,
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "40px", marginBottom: "4px" }}>
                    {card.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#fff",
                      margin: 0,
                    }}
                  >
                    {card.title}
                  </h3>
                </div>
                <div style={{ padding: "16px" }}>
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "13px",
                      color: DESIGN.colors.textSecondary,
                      margin: "0 0 12px",
                      lineHeight: 1.5,
                    }}
                  >
                    {card.desc}
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px",
                    }}
                  >
                    {card.items.map((item, j) => (
                      <div
                        key={j}
                        style={{
                          padding: "6px 10px",
                          background: DESIGN.colors.surface,
                          borderRadius: DESIGN.radius.sm,
                          fontSize: "12px",
                          fontFamily: "Poppins",
                          fontWeight: 500,
                          color: DESIGN.colors.textSecondary,
                          textAlign: "center",
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Safety */}
          <div
            style={{
              background: `linear-gradient(135deg, #FDECEB, ${DESIGN.colors.lightSecondary})`,
              border: `2px solid ${DESIGN.colors.secondary}30`,
              borderRadius: DESIGN.radius.lg,
              padding: isMobile ? "16px" : "24px",
            }}
          >
            <h3
              style={{
                fontFamily: "Poppins",
                fontSize: "20px",
                fontWeight: 700,
                color: "#A82D22",
                margin: "0 0 14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ⚠️ Safety First
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "8px",
              }}
            >
              {[
                "Never experiment with household electricity",
                "Use only batteries for experiments",
                "Never touch switches with wet hands",
                "Don't use damaged equipment",
                "Ask an adult for help",
              ].map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.6)",
                    borderRadius: DESIGN.radius.sm,
                    fontFamily: "Poppins",
                    fontSize: "13px",
                    color: "#7f1d1d",
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ flexShrink: 0 }}>⚠️</span> {r}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // LEARN MODE RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const renderLearn = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "5fr 3fr",
        gap: "20px",
      }}
    >
      {/* Circuit Panel */}
      <div
        style={{
          background: DESIGN.colors.white,
          borderRadius: DESIGN.radius.lg,
          padding: isMobile ? "16px" : "24px",
          boxShadow: DESIGN.shadow.sm,
          border: `1.5px solid ${DESIGN.colors.light}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <h2
            style={{
              fontFamily: "Poppins",
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: 700,
              color: DESIGN.colors.textPrimary,
              margin: 0,
            }}
          >
            Circuit Test Area
          </h2>
          <div style={{ display: "flex", gap: "8px" }}>
            <SingularityButton
              variant="outlined"
              onClick={() => setShowCurrentFlow(!showCurrentFlow)}
              style={{ padding: "8px 14px", fontSize: "13px" }}
            >
              {showCurrentFlow ? "Hide Current" : "Show Current"}
            </SingularityButton>
            <SingularityButton
              variant="outlined"
              color="secondary"
              onClick={resetSimulation}
              style={{ padding: "8px 14px", fontSize: "13px" }}
            >
              🔄 Reset
            </SingularityButton>
          </div>
        </div>

        {/* SVG Circuit */}
        <svg
          ref={svgRef}
          viewBox="0 0 500 370"
          style={{
            width: "100%",
            borderRadius: DESIGN.radius.md,
            background: `linear-gradient(180deg, ${DESIGN.colors.surface} 0%, #fff 100%)`,
            border: `1.5px solid ${DESIGN.colors.light}`,
            cursor: draggedMaterial ? "grabbing" : "default",
            touchAction: "none",
          }}
        >
          {/* Battery */}
          <g transform="translate(80, 150)">
            <defs>
              <linearGradient id="battGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop
                  offset="0%"
                  style={{ stopColor: DESIGN.colors.gradientStart }}
                />
                <stop offset="100%" style={{ stopColor: "#3a1f5c" }} />
              </linearGradient>
            </defs>
            <rect
              x="-15"
              y="-35"
              width="30"
              height="70"
              rx="4"
              fill="url(#battGrad)"
              stroke={DESIGN.colors.primary}
              strokeWidth="1.5"
            />
            <rect
              x="-5"
              y="-42"
              width="10"
              height="7"
              rx="2"
              fill={DESIGN.colors.mid}
            />
            <text
              x="-15"
              y="-48"
              fontSize="14"
              fill={DESIGN.colors.secondary}
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="Poppins"
            >
              +
            </text>
            <text
              x="-15"
              y="55"
              fontSize="14"
              fill={DESIGN.colors.primary}
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="Poppins"
            >
              −
            </text>
            <rect
              x="-8"
              y="-15"
              width="16"
              height="8"
              fill={DESIGN.colors.primary}
              opacity="0.5"
              rx="2"
            />
            <rect
              x="-8"
              y="7"
              width="16"
              height="8"
              fill={DESIGN.colors.secondary}
              opacity="0.5"
              rx="2"
            />
            <circle cx="0" cy="-35" r="3" fill={DESIGN.colors.secondary} />
            <circle cx="0" cy="35" r="3" fill={DESIGN.colors.secondary} />
          </g>

          {/* Wires */}
          {[
            { x1: 80, y1: 185, x2: 80, y2: 220 },
            { x1: 80, y1: 220, x2: 180, y2: 220 },
            { x1: 180, y1: 220, x2: 180, y2: 150 },
            { x1: 280, y1: 150, x2: 360, y2: 150 },
            { x1: 360, y1: 150, x2: 360, y2: 80 },
            { x1: 360, y1: 55, x2: 360, y2: 30 },
            { x1: 360, y1: 30, x2: 80, y2: 30 },
            { x1: 80, y1: 30, x2: 80, y2: 115 },
          ].map((w, i) => (
            <g key={i}>
              <line
                {...w}
                stroke={DESIGN.colors.gradientStart}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <line
                {...w}
                stroke={DESIGN.colors.lightPrimary}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          ))}

          {/* Terminals */}
          <circle
            cx="180"
            cy="150"
            r="5"
            fill={DESIGN.colors.lightPrimary}
            stroke={DESIGN.colors.primary}
            strokeWidth="2"
          />
          <circle
            cx="280"
            cy="150"
            r="5"
            fill={DESIGN.colors.lightPrimary}
            stroke={DESIGN.colors.primary}
            strokeWidth="2"
          />

          {/* Gap area */}
          <circle
            cx={GAP_POSITION.x}
            cy={GAP_POSITION.y}
            r={SNAP_DISTANCE}
            fill={nearGap ? DESIGN.colors.primary : "transparent"}
            opacity={nearGap ? 0.1 : 0}
            stroke={nearGap ? DESIGN.colors.primary : DESIGN.colors.mid}
            strokeWidth="2"
            strokeDasharray="6,4"
          />

          {/* Bulb */}
          <g transform="translate(360, 80)">
            <defs>
              <radialGradient id="bulbG">
                <stop
                  offset="0%"
                  style={{
                    stopColor: isBulbOn ? "#FFE066" : DESIGN.colors.light,
                  }}
                />
                <stop
                  offset="70%"
                  style={{
                    stopColor: isBulbOn
                      ? DESIGN.colors.secondary
                      : DESIGN.colors.mid,
                    stopOpacity: 0.8,
                  }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: isBulbOn ? "#E65C00" : "#999" }}
                />
              </radialGradient>
            </defs>
            {isBulbOn && (
              <>
                <circle
                  cx="0"
                  cy="0"
                  r="35"
                  fill={DESIGN.colors.secondary}
                  opacity="0.15"
                >
                  <animate
                    attributeName="opacity"
                    values="0.08;0.2;0.08"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx="0"
                  cy="0"
                  r="42"
                  fill={DESIGN.colors.secondary}
                  opacity="0.06"
                >
                  <animate
                    attributeName="opacity"
                    values="0.03;0.1;0.03"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}
            <circle
              cx="0"
              cy="0"
              r="25"
              fill="url(#bulbG)"
              stroke={isBulbOn ? DESIGN.colors.secondary : "#888"}
              strokeWidth="2"
            />
            <path
              d="M -8,-8 L -4,-4 L -8,0 L -4,4 L -8,8 M 8,-8 L 4,-4 L 8,0 L 4,4 L 8,8 M -4,-4 L 4,-4 M -4,4 L 4,4"
              stroke={isBulbOn ? "#FF4500" : "#666"}
              strokeWidth="2"
              fill="none"
            />
            <rect x="-8" y="20" width="16" height="3" fill="#A0A0A0" />
            <rect x="-8" y="23" width="16" height="2" fill="#888" />
            <rect x="-8" y="25" width="16" height="3" fill="#A0A0A0" />
            <rect x="-6" y="28" width="12" height="4" fill="#777" rx="1" />
          </g>

          {/* Current flow */}
          {isBulbOn && showCurrentFlow && (
            <>
              <circle r="4" fill={DESIGN.colors.secondary} opacity="0.85">
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  path="M80,115 L80,30 L360,30 L360,55"
                />
              </circle>
              <circle r="4" fill={DESIGN.colors.secondary} opacity="0.85">
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  begin="1s"
                  path="M360,80 L360,150 L280,150"
                />
              </circle>
              <circle r="4" fill={DESIGN.colors.secondary} opacity="0.85">
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  begin="2s"
                  path="M180,150 L180,220 L80,220 L80,185"
                />
              </circle>
            </>
          )}

          {/* Labels */}
          <text
            x="50"
            y="150"
            fontSize="12"
            fill={DESIGN.colors.textPrimary}
            textAnchor="middle"
            fontWeight="600"
            fontFamily="Poppins"
          >
            Cell
          </text>
          <text
            x="360"
            y="15"
            fontSize="12"
            fill={DESIGN.colors.textPrimary}
            textAnchor="middle"
            fontWeight="600"
            fontFamily="Poppins"
          >
            Bulb
          </text>
          <text
            x="230"
            y="178"
            fontSize="10"
            fill={DESIGN.colors.textMuted}
            textAnchor="middle"
            fontFamily="Poppins"
            fontStyle="italic"
          >
            {materialInGap ? "Connected" : "↓ Drop Material Here"}
          </text>
          <text
            x="250"
            y="248"
            fontSize="11"
            fill={DESIGN.colors.textSecondary}
            textAnchor="middle"
            fontWeight="600"
            fontFamily="Poppins"
          >
            Drag Materials Into Gap
          </text>

          {/* Materials */}
          {DEFAULT_MATERIALS.map((mat) => {
            const pos = materialPositions[mat.id];
            const inGap = materialInGap?.id === mat.id;
            const dragging = draggedMaterial?.id === mat.id;
            return (
              <g
                key={mat.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                style={{
                  cursor: dragging ? "grabbing" : "grab",
                  touchAction: "none",
                }}
                onPointerDown={(e) => handlePointerDown(e, mat)}
                opacity={dragging ? 0.7 : 1}
              >
                <defs>
                  <linearGradient
                    id={`mg-${mat.id}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" style={{ stopColor: mat.color }} />
                    <stop
                      offset="100%"
                      style={{ stopColor: mat.color + "bb" }}
                    />
                  </linearGradient>
                </defs>
                <rect
                  x="-30"
                  y="-12"
                  width="60"
                  height="24"
                  rx="6"
                  fill={`url(#mg-${mat.id})`}
                  stroke={
                    inGap
                      ? DESIGN.colors.success
                      : DESIGN.colors.textPrimary + "40"
                  }
                  strokeWidth={inGap ? 2.5 : 1.5}
                />
                <rect
                  x="-26"
                  y="-9"
                  width="16"
                  height="5"
                  rx="2"
                  fill="white"
                  opacity="0.3"
                />
                <text
                  x="0"
                  y="3"
                  fontSize="7.5"
                  fill="white"
                  textAnchor="middle"
                  fontWeight="600"
                  style={{
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    pointerEvents: "none",
                  }}
                  fontFamily="Poppins"
                >
                  {mat.label.length > 10
                    ? mat.label.substring(0, 9) + "…"
                    : mat.label}
                </text>
                {inGap && (
                  <>
                    <line
                      x1="-30"
                      y1="0"
                      x2="-50"
                      y2="0"
                      stroke={DESIGN.colors.success}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <line
                      x1="30"
                      y1="0"
                      x2="50"
                      y2="0"
                      stroke={DESIGN.colors.success}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Prediction */}
        {materialInGap && !showPredictionUI && (
          <div
            style={{
              marginTop: "14px",
              padding: "18px",
              borderRadius: DESIGN.radius.md,
              background: `linear-gradient(135deg, ${DESIGN.colors.lightSecondary}, ${DESIGN.colors.lightPrimary}30)`,
              border: `1.5px solid ${DESIGN.colors.secondary}40`,
              animation: "popIn 0.35s ease-out",
            }}
          >
            <p
              style={{
                fontFamily: "Poppins",
                fontSize: "14px",
                fontWeight: 600,
                color: DESIGN.colors.textPrimary,
                margin: "0 0 12px",
              }}
            >
              Predict: Will <strong>{materialInGap.label}</strong> complete the
              circuit?
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <SingularityButton
                onClick={() => {
                  setPrediction("conductor");
                  setShowPredictionUI(true);
                }}
                color={DESIGN.colors.success}
                style={{ flex: 1 }}
              >
                ⚡ Yes, it conducts!
              </SingularityButton>
              <SingularityButton
                onClick={() => {
                  setPrediction("insulator");
                  setShowPredictionUI(true);
                }}
                color={DESIGN.colors.error}
                style={{ flex: 1 }}
              >
                🚫 No, it insulates
              </SingularityButton>
            </div>
          </div>
        )}

        {materialInGap && showPredictionUI && (
          <div
            style={{
              marginTop: "14px",
              padding: "18px",
              borderRadius: DESIGN.radius.md,
              animation: "popIn 0.35s ease-out",
              background: isPredictionCorrect ? "#E8F8F0" : "#FDECEB",
              border: `2px solid ${isPredictionCorrect ? "#2ECC71" : "#E74C3C"}30`,
            }}
          >
            <p
              style={{
                fontFamily: "Poppins",
                fontSize: "16px",
                fontWeight: 700,
                color: isPredictionCorrect ? "#1A7D45" : "#A82D22",
                margin: "0 0 6px",
              }}
            >
              {isPredictionCorrect ? "✓ Correct!" : "✗ Not quite!"}
            </p>
            <p
              style={{
                fontFamily: "Poppins",
                fontSize: "13px",
                color: isPredictionCorrect ? "#1A7D45" : "#A82D22",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              <strong>{materialInGap.label}</strong> is a{" "}
              <strong>{materialInGap.type}</strong> —{" "}
              {materialInGap.description}.
            </p>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div
        style={{
          background: DESIGN.colors.white,
          borderRadius: DESIGN.radius.lg,
          padding: isMobile ? "16px" : "24px",
          boxShadow: DESIGN.shadow.sm,
          border: `1.5px solid ${DESIGN.colors.light}`,
          alignSelf: "start",
        }}
      >
        <h2
          style={{
            fontFamily: "Poppins",
            fontSize: "18px",
            fontWeight: 700,
            color: DESIGN.colors.textPrimary,
            margin: "0 0 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: DESIGN.colors.lightPrimary,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
            }}
          >
            ℹ
          </span>
          Information
        </h2>

        {materialInGap ? (
          <div>
            <div
              style={{
                marginBottom: "14px",
                paddingBottom: "14px",
                borderBottom: `1px solid ${DESIGN.colors.light}`,
              }}
            >
              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: "12px",
                  color: DESIGN.colors.textMuted,
                  margin: "0 0 4px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Material
              </p>
              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: "17px",
                  fontWeight: 700,
                  color: DESIGN.colors.textPrimary,
                  margin: 0,
                }}
              >
                {materialInGap.label}
              </p>
            </div>
            <div
              style={{
                marginBottom: "14px",
                paddingBottom: "14px",
                borderBottom: `1px solid ${DESIGN.colors.light}`,
              }}
            >
              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: "12px",
                  color: DESIGN.colors.textMuted,
                  margin: "0 0 6px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Type
              </p>
              <span
                style={{
                  display: "inline-block",
                  padding: "5px 14px",
                  borderRadius: DESIGN.radius.full,
                  fontSize: "13px",
                  fontWeight: 600,
                  fontFamily: "Poppins",
                  background:
                    materialInGap.type === "conductor"
                      ? `linear-gradient(135deg, ${DESIGN.colors.primary}, ${DESIGN.colors.gradientStart})`
                      : `linear-gradient(135deg, ${DESIGN.colors.secondary}, ${DESIGN.colors.gradientEnd})`,
                  color: "#fff",
                }}
              >
                {materialInGap.type === "conductor"
                  ? "⚡ Conductor"
                  : "🚫 Insulator"}
              </span>
            </div>
            <div
              style={{
                marginBottom: "14px",
                paddingBottom: "14px",
                borderBottom: `1px solid ${DESIGN.colors.light}`,
              }}
            >
              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: "12px",
                  color: DESIGN.colors.textMuted,
                  margin: "0 0 6px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Bulb
              </p>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ fontSize: "18px" }}>
                  {isBulbOn ? "💡" : "⚫"}
                </span>
                <span
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: isBulbOn
                      ? DESIGN.colors.success
                      : DESIGN.colors.textMuted,
                  }}
                >
                  {isBulbOn ? "ON ✨" : "OFF"}
                </span>
              </div>
            </div>
            <p
              style={{
                fontFamily: "Poppins",
                fontSize: "13px",
                color: DESIGN.colors.textSecondary,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              <strong>{materialInGap.label}</strong> is{" "}
              {materialInGap.description}.
              {isBulbOn
                ? " It allows current to flow — the bulb glows!"
                : " It blocks current — the bulb stays off."}
            </p>
          </div>
        ) : (
          <p
            style={{
              fontFamily: "Poppins",
              fontSize: "14px",
              color: DESIGN.colors.textMuted,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            👆 Drag a material into the circuit gap to test if it conducts
            electricity!
          </p>
        )}

        {/* Tested Materials */}
        {testedMaterials.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3
              style={{
                fontFamily: "Poppins",
                fontSize: "14px",
                fontWeight: 700,
                margin: "0 0 10px",
                color: DESIGN.colors.textPrimary,
              }}
            >
              Test Results
            </h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "Poppins",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr>
                  {["Material", "Type", "Bulb"].map((h, i) => (
                    <th
                      key={i}
                      style={{
                        padding: "8px 6px",
                        textAlign: i === 0 ? "left" : "center",
                        fontWeight: 600,
                        color: DESIGN.colors.textSecondary,
                        borderBottom: `2px solid ${DESIGN.colors.light}`,
                        fontSize: "12px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {testedMaterials.map((m) => (
                  <tr key={m.id}>
                    <td
                      style={{
                        padding: "8px 6px",
                        borderBottom: `1px solid ${DESIGN.colors.light}`,
                        color: DESIGN.colors.textPrimary,
                        fontWeight: 500,
                      }}
                    >
                      {m.label}
                    </td>
                    <td
                      style={{
                        padding: "8px 6px",
                        borderBottom: `1px solid ${DESIGN.colors.light}`,
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "2px 8px",
                          borderRadius: DESIGN.radius.full,
                          fontWeight: 600,
                          background:
                            m.type === "conductor"
                              ? DESIGN.colors.lightPrimary + "50"
                              : DESIGN.colors.lightSecondary,
                          color:
                            m.type === "conductor"
                              ? DESIGN.colors.primary
                              : DESIGN.colors.secondary,
                        }}
                      >
                        {m.type === "conductor" ? "C" : "I"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "8px 6px",
                        borderBottom: `1px solid ${DESIGN.colors.light}`,
                        textAlign: "center",
                        fontSize: "16px",
                      }}
                    >
                      {m.type === "conductor" ? "✓" : "✗"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => setTestedMaterials([])}
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "8px",
                border: `1.5px solid ${DESIGN.colors.light}`,
                borderRadius: DESIGN.radius.sm,
                fontSize: "12px",
                fontFamily: "Poppins",
                fontWeight: 500,
                cursor: "pointer",
                background: DESIGN.colors.surface,
                color: DESIGN.colors.textSecondary,
                transition: "all 0.2s ease",
              }}
            >
              Clear Results
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN RETURN
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${DESIGN.colors.surface} 0%, #E8E8F8 40%, ${DESIGN.colors.lightSecondary}40 100%)`,
        padding: isMobile ? "12px" : "24px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <style>{css}</style>

      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          background: `${DESIGN.colors.white}e6`,
          borderRadius: DESIGN.radius.xl,
          boxShadow: DESIGN.shadow.xl,
          overflow: "hidden",
          backdropFilter: "blur(20px)",
          border: `1px solid ${DESIGN.colors.lightPrimary}40`,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${DESIGN.colors.gradientStart} 0%, ${DESIGN.colors.primary} 50%, ${DESIGN.colors.gradientEnd} 100%)`,
            backgroundSize: "200% 200%",
            animation: "gradientShift 8s ease infinite",
            padding: isMobile ? "24px 16px" : "36px 32px",
            color: "#fff",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative shapes */}
          <div
            style={{
              position: "absolute",
              top: -20,
              left: -20,
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.15)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -10,
              right: 40,
              width: 60,
              height: 60,
              border: "2px solid rgba(255,255,255,0.1)",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 20,
              right: -10,
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            }}
          />

          <h1
            style={{
              fontSize: isMobile ? "24px" : "34px",
              fontWeight: 800,
              margin: "0 0 6px",
              animation: "fadeInUp 0.6s ease-out",
              position: "relative",
              letterSpacing: "-0.5px",
            }}
          >
            ⚡ Conductors & Insulators
          </h1>
          <p
            style={{
              fontSize: isMobile ? "14px" : "17px",
              opacity: 0.9,
              margin: 0,
              animation: "fadeInUp 0.8s ease-out",
              position: "relative",
              fontWeight: 300,
            }}
          >
            Drag materials into the circuit to discover what conducts
            electricity
          </p>
        </div>

        {/* Mode Tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: isMobile ? "12px 16px" : "16px 32px",
            background: DESIGN.colors.surface,
            borderBottom: `1.5px solid ${DESIGN.colors.light}`,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <ModeTab mode="learn" icon="📚" label="Learn" />
          <ModeTab mode="practice" icon="🎯" label="Practice" />
          <ModeTab mode="real_world" icon="🌍" label="Real World" />
        </div>

        {/* Content */}
        <div style={{ padding: isMobile ? "16px" : "24px 32px 32px" }}>
          {currentMode === "practice"
            ? renderPractice()
            : currentMode === "real_world"
              ? renderRealWorld()
              : renderLearn()}
        </div>
      </div>
    </div>
  );
}
