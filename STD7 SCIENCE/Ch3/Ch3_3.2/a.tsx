import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================================
// DESIGN TOKENS (from Singularity Design System PDF)
// ============================================================================
const TOKENS = {
  color: {
    primary: "#4A4DC9",
    primaryLight: "#C1C1EA",
    primaryBg: "#EEEEF8",
    secondary: "#FF7212",
    secondaryLight: "#FFF3E4",
    secondaryAccent: "#FC9145",
    gradientStart: "#533086",
    gradientEnd: "#FC9145",
    neutral900: "#1a1a2e",
    neutral700: "#4E4E4E",
    neutral400: "#CACACA",
    neutral200: "#EBEBEB",
    neutral100: "#F5F5F5",
    white: "#FFFFFF",
    success: "#22c55e",
    error: "#ef4444",
  },
  radius: { sm: "8px", md: "12px", lg: "16px", xl: "24px", full: "999px" },
  shadow: {
    sm: "0 2px 8px rgba(74,77,201,0.08)",
    md: "0 4px 20px rgba(74,77,201,0.12)",
    lg: "0 8px 40px rgba(74,77,201,0.16)",
    glow: "0 0 24px rgba(74,77,201,0.25)",
  },
  font: "'Poppins', sans-serif",
};

// ============================================================================
// DATA
// ============================================================================
const learnSteps = [
  {
    id: 1,
    title: "What is a Circuit Diagram?",
    description:
      "A circuit diagram uses symbols to represent electrical components, making circuits easier to understand and draw.",
    explanation:
      "Instead of drawing realistic pictures, we use simple symbols — like using symbols on a map!",
  },
  {
    id: 2,
    title: "Electric Cell Symbol",
    description:
      "An electric cell is shown with two parallel lines — one long (positive) and one short (negative).",
    explanation:
      "The longer line represents the positive (+) terminal, and the shorter line represents the negative (–) terminal.",
    symbolType: "cell",
  },
  {
    id: 3,
    title: "Battery Symbol",
    description:
      "A battery is multiple cells connected together, shown as multiple pairs of long and short lines.",
    explanation:
      "Two or more cells connected in series form a battery. The positive of one connects to the negative of the next.",
    symbolType: "battery",
  },
  {
    id: 4,
    title: "Electric Lamp Symbol",
    description: "An electric lamp is shown as a circle with an X inside it.",
    explanation:
      "The X represents the filament that glows when current passes through it.",
    symbolType: "lamp",
  },
  {
    id: 5,
    title: "LED Symbol",
    description:
      "An LED has a special symbol with a triangle and arrows showing light emission.",
    explanation:
      "The triangle shows current direction, and arrows show light is emitted. LEDs only work in one direction!",
    symbolType: "led",
  },
  {
    id: 6,
    title: "Switch Symbols",
    description:
      "A switch is shown as a gap that can be open (OFF) or closed (ON).",
    explanation:
      "When ON, the circuit is complete and current flows. When OFF, there is a gap and no current flows.",
    symbolType: "switch_on",
  },
  {
    id: 7,
    title: "Complete Circuit Diagram",
    description:
      "Here is a complete circuit diagram with battery, switch, and lamp connected in a closed loop.",
    explanation:
      "This circuit shows:\n• Battery on the left (provides electrical energy)\n• Switch on top right (controls current flow — shown in OFF position)\n• Light bulb at the bottom (converts electrical energy to light)\n• Wires forming a complete rectangular path\n\nWhen the switch is closed (ON), current flows from the battery's positive terminal through the wires, through the lamp (making it glow), and back to the negative terminal!",
    symbolType: "complete_circuit",
    circuitComplete: true,
    currentFlowing: false,
  },
];

const practiceQuestions = [
  {
    id: 1,
    question:
      "In an electric cell symbol, which line represents the positive terminal?",
    options: [
      "The shorter line",
      "The longer line",
      "Both lines are equal",
      "Neither line",
    ],
    correctAnswer: 1,
    explanation:
      "The longer line represents the positive (+) terminal, while the shorter line represents the negative (–) terminal.",
    symbolType: "cell",
  },
  {
    id: 2,
    question: "What does the X inside a circle represent?",
    options: ["A battery", "An electric lamp", "A switch", "A wire"],
    correctAnswer: 1,
    explanation:
      "A circle with an X inside represents an electric lamp. The X symbolizes the filament that glows.",
    symbolType: "lamp",
  },
  {
    id: 3,
    question: "Will the lamp glow in this circuit with the switch ON?",
    options: ["Yes", "No", "Only sometimes", "Cannot determine"],
    correctAnswer: 0,
    explanation:
      "Yes! The circuit is complete with the switch ON. Current can flow from battery through switch and lamp.",
  },
  {
    id: 4,
    question: "What is a battery made of?",
    options: ["One cell", "Two or more cells", "No cells", "Just wires"],
    correctAnswer: 1,
    explanation: "A battery consists of two or more cells connected in series.",
    symbolType: "battery",
  },
  {
    id: 5,
    question: "Will the lamp glow with the switch OFF?",
    options: ["Yes", "No", "Need another cell", "Lamp will be damaged"],
    correctAnswer: 1,
    explanation:
      "No, the lamp will not glow because the switch is OFF, creating a gap that prevents current flow.",
  },
  {
    id: 6,
    question: "What do the arrows in an LED symbol represent?",
    options: [
      "Current direction",
      "Light being emitted",
      "Positive terminal",
      "Wire connections",
    ],
    correctAnswer: 1,
    explanation:
      "The arrows in the LED symbol represent light being emitted. The triangle shows current direction.",
    symbolType: "led",
  },
];

const realWorldSteps = [
  {
    id: 1,
    title: "Torchlight Circuit",
    description:
      "A torchlight uses a simple circuit with batteries, a switch, and an LED.",
    explanation:
      "When you press the switch button, you complete the circuit. The batteries provide energy, and the LED lights up!",
    icon: "🔦",
  },
  {
    id: 2,
    title: "Room Light Circuit",
    description:
      "The light in your room uses the same principle — a switch controls current flow.",
    explanation:
      "When you flip the switch ON, electricity from the power supply flows through the bulb, making it glow.",
    icon: "💡",
  },
  {
    id: 3,
    title: "Doorbell Circuit",
    description:
      "A doorbell has a push button that acts as a temporary switch.",
    explanation:
      "When pressed, it closes the circuit momentarily. Current flows and activates the bell. When released, the circuit opens.",
    icon: "🔔",
  },
  {
    id: 4,
    title: "Solar Light Circuit",
    description:
      "Solar lights charge during the day and automatically turn on at night.",
    explanation:
      "A light sensor acts like an automatic switch, closing the circuit at night to turn on the LED!",
    icon: "☀️",
  },
];

const handsOnSteps = [
  {
    id: 1,
    title: "Build a Simple Circuit",
    description: "Let's build a circuit with a cell, lamp, and switch!",
    explanation:
      "Materials: 1 cell (1.5V), 1 bulb with holder, 1 switch, 3 wires\n\nSteps:\n1. Connect wire from cell (+) to switch\n2. Connect switch to lamp\n3. Connect lamp to cell (–)\n4. Close switch and watch it glow!",
    icon: "🔧",
  },
  {
    id: 2,
    title: "Make Your Own Switch",
    description: "Create a simple switch using everyday materials!",
    explanation:
      "Materials: 2 drawing pins, 1 safety pin, cardboard, 2 wires\n\nSteps:\n1. Fix drawing pin through safety pin on cardboard\n2. Fix second pin so safety pin can touch it\n3. Connect wire to each pin\n4. When safety pin touches both pins, circuit is ON!",
    icon: "🔌",
  },
  {
    id: 3,
    title: "Test for Conductors",
    description: "Use your circuit as a tester to identify conductors!",
    explanation:
      "Leave a gap in your circuit. Touch both wire ends to different objects.\n\nIf lamp glows → Conductor\nIf lamp doesn't glow → Insulator\n\nTest: metal spoon, plastic ruler, coin, eraser, key",
    icon: "🧪",
  },
  {
    id: 4,
    title: "Draw Your Own Circuit",
    description: "Practice drawing circuit diagrams using standard symbols!",
    explanation:
      "Activity:\n1. Draw a circuit with 2 cells (battery), 1 switch, and 1 lamp\n2. Use correct symbols\n3. Make complete closed loop\n4. Label each component\n5. Show current direction with arrows",
    icon: "✏️",
  },
];

const MODES = [
  { key: "learn", label: "Learn", icon: "📚" },
  { key: "practice", label: "Practice", icon: "✏️" },
  { key: "real_world", label: "Real World", icon: "🌍" },
  { key: "hands_on", label: "Hands-On", icon: "🔬" },
];

// ============================================================================
// CANVAS DRAWING
// ============================================================================
function drawSymbolOnCanvas(canvas, symbolType, stepData, isDark) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const w = rect.width;
  const h = rect.height;

  ctx.clearRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;
  const sc = Math.min(w / 400, h / 280);

  ctx.strokeStyle = TOKENS.color.primary;
  ctx.fillStyle = TOKENS.color.neutral700;
  ctx.lineWidth = 3 * sc;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (symbolType) {
    case "cell": {
      ctx.beginPath();
      ctx.moveTo(cx - 50 * sc, cy - 45 * sc);
      ctx.lineTo(cx - 50 * sc, cy + 45 * sc);
      ctx.stroke();
      ctx.lineWidth = 5 * sc;
      ctx.beginPath();
      ctx.moveTo(cx + 50 * sc, cy - 22 * sc);
      ctx.lineTo(cx + 50 * sc, cy + 22 * sc);
      ctx.stroke();
      ctx.lineWidth = 2 * sc;
      ctx.beginPath();
      ctx.moveTo(cx - 100 * sc, cy);
      ctx.lineTo(cx - 50 * sc, cy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 50 * sc, cy);
      ctx.lineTo(cx + 100 * sc, cy);
      ctx.stroke();
      ctx.font = `bold ${22 * sc}px Poppins, sans-serif`;
      ctx.fillStyle = TOKENS.color.secondary;
      ctx.textAlign = "center";
      ctx.fillText("+", cx - 50 * sc, cy - 55 * sc);
      ctx.fillText("–", cx + 50 * sc, cy - 55 * sc);
      break;
    }
    case "battery": {
      for (let i = 0; i < 3; i++) {
        const x = cx + (i - 1) * 70 * sc;
        ctx.lineWidth = 3 * sc;
        ctx.beginPath();
        ctx.moveTo(x - 18 * sc, cy - 40 * sc);
        ctx.lineTo(x - 18 * sc, cy + 40 * sc);
        ctx.stroke();
        ctx.lineWidth = 5 * sc;
        ctx.beginPath();
        ctx.moveTo(x + 18 * sc, cy - 22 * sc);
        ctx.lineTo(x + 18 * sc, cy + 22 * sc);
        ctx.stroke();
        if (i < 2) {
          ctx.lineWidth = 2 * sc;
          ctx.beginPath();
          ctx.moveTo(x + 18 * sc, cy);
          ctx.lineTo(x + 52 * sc, cy);
          ctx.stroke();
        }
      }
      ctx.lineWidth = 2 * sc;
      ctx.beginPath();
      ctx.moveTo(cx - 130 * sc, cy);
      ctx.lineTo(cx - 88 * sc, cy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 88 * sc, cy);
      ctx.lineTo(cx + 130 * sc, cy);
      ctx.stroke();
      ctx.font = `bold ${20 * sc}px Poppins, sans-serif`;
      ctx.fillStyle = TOKENS.color.secondary;
      ctx.textAlign = "center";
      ctx.fillText("+", cx - 88 * sc, cy - 52 * sc);
      ctx.fillText("–", cx + 88 * sc, cy - 52 * sc);
      break;
    }
    case "lamp": {
      ctx.lineWidth = 3 * sc;
      ctx.beginPath();
      ctx.arc(cx, cy, 45 * sc, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 28 * sc, cy - 28 * sc);
      ctx.lineTo(cx + 28 * sc, cy + 28 * sc);
      ctx.moveTo(cx + 28 * sc, cy - 28 * sc);
      ctx.lineTo(cx - 28 * sc, cy + 28 * sc);
      ctx.stroke();
      ctx.lineWidth = 2 * sc;
      ctx.beginPath();
      ctx.moveTo(cx - 100 * sc, cy);
      ctx.lineTo(cx - 45 * sc, cy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 45 * sc, cy);
      ctx.lineTo(cx + 100 * sc, cy);
      ctx.stroke();
      if (stepData?.currentFlowing) {
        ctx.fillStyle = TOKENS.color.secondaryAccent;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(cx, cy, 58 * sc, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      break;
    }
    case "led": {
      ctx.lineWidth = 3 * sc;
      ctx.beginPath();
      ctx.moveTo(cx - 30 * sc, cy + 30 * sc);
      ctx.lineTo(cx + 30 * sc, cy);
      ctx.lineTo(cx - 30 * sc, cy - 30 * sc);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 35 * sc, cy - 35 * sc);
      ctx.lineTo(cx + 35 * sc, cy + 35 * sc);
      ctx.stroke();
      ctx.lineWidth = 2.5 * sc;
      const arrows = [
        [5, -15, 30, -40],
        [15, -5, 40, -30],
      ];
      arrows.forEach(([x1, y1, x2, y2]) => {
        ctx.strokeStyle = TOKENS.color.secondary;
        ctx.beginPath();
        ctx.moveTo(cx + x1 * sc, cy + y1 * sc);
        ctx.lineTo(cx + x2 * sc, cy + y2 * sc);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + x2 * sc, cy + y2 * sc);
        ctx.lineTo(cx + (x2 - 6) * sc, cy + (y2 + 2) * sc);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + x2 * sc, cy + y2 * sc);
        ctx.lineTo(cx + (x2 - 2) * sc, cy + (y2 + 6) * sc);
        ctx.stroke();
      });
      ctx.strokeStyle = TOKENS.color.primary;
      ctx.lineWidth = 2 * sc;
      ctx.beginPath();
      ctx.moveTo(cx - 80 * sc, cy);
      ctx.lineTo(cx - 30 * sc, cy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 35 * sc, cy);
      ctx.lineTo(cx + 80 * sc, cy);
      ctx.stroke();
      ctx.font = `bold ${16 * sc}px Poppins, sans-serif`;
      ctx.fillStyle = TOKENS.color.secondary;
      ctx.textAlign = "center";
      ctx.fillText("+", cx - 90 * sc, cy + 5 * sc);
      ctx.fillText("–", cx + 90 * sc, cy + 5 * sc);
      ctx.font = `${13 * sc}px Poppins, sans-serif`;
      ctx.fillStyle = TOKENS.color.neutral700;
      ctx.fillText("LED", cx, cy + 58 * sc);
      break;
    }
    case "switch_on": {
      ctx.lineWidth = 2 * sc;
      ctx.beginPath();
      ctx.moveTo(cx - 100 * sc, cy);
      ctx.lineTo(cx - 50 * sc, cy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 50 * sc, cy);
      ctx.lineTo(cx + 100 * sc, cy);
      ctx.stroke();
      ctx.fillStyle = TOKENS.color.primary;
      ctx.beginPath();
      ctx.arc(cx - 50 * sc, cy, 6 * sc, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 50 * sc, cy, 6 * sc, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3 * sc;
      ctx.beginPath();
      ctx.moveTo(cx - 50 * sc, cy);
      ctx.lineTo(cx + 50 * sc, cy);
      ctx.stroke();
      ctx.font = `bold ${17 * sc}px Poppins, sans-serif`;
      ctx.fillStyle = TOKENS.color.success || "#22c55e";
      ctx.textAlign = "center";
      ctx.fillText("ON", cx, cy - 22 * sc);
      break;
    }
    case "complete_circuit": {
      const left = w * 0.15,
        right = w * 0.85,
        top = h * 0.15,
        bottom = h * 0.85;
      const batX = left,
        batY = (top + bottom) / 2;
      ctx.lineWidth = 3.5 * sc;
      const lines = [
        [-20, -35, 20, -35],
        [-20, -5, 20, -5],
        [-20, 25, 20, 25],
      ];
      const shortLines = [
        [-12, -20, 12, -20],
        [-12, 10, 12, 10],
      ];
      lines.forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath();
        ctx.moveTo(batX + x1 * sc, batY + y1 * sc);
        ctx.lineTo(batX + x2 * sc, batY + y2 * sc);
        ctx.stroke();
      });
      ctx.lineWidth = 5 * sc;
      shortLines.forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath();
        ctx.moveTo(batX + x1 * sc, batY + y1 * sc);
        ctx.lineTo(batX + x2 * sc, batY + y2 * sc);
        ctx.stroke();
      });
      ctx.font = `${13 * sc}px Poppins, sans-serif`;
      ctx.fillStyle = TOKENS.color.neutral700;
      ctx.textAlign = "left";
      ctx.fillText("battery", batX + 30 * sc, batY + 5 * sc);

      ctx.lineWidth = 2.5 * sc;
      ctx.strokeStyle = TOKENS.color.primary;
      ctx.beginPath();
      ctx.moveTo(batX, batY - 35 * sc);
      ctx.lineTo(batX, top);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(batX, top);
      ctx.lineTo(right - 50 * sc, top);
      ctx.stroke();

      const swX = right - 20 * sc,
        swY = top + 40 * sc;
      ctx.beginPath();
      ctx.moveTo(right - 50 * sc, top);
      ctx.lineTo(swX - 20 * sc, swY);
      ctx.stroke();
      ctx.fillStyle = TOKENS.color.primary;
      ctx.beginPath();
      ctx.arc(swX - 20 * sc, swY, 5 * sc, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(swX + 20 * sc, swY, 5 * sc, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3.5 * sc;
      ctx.beginPath();
      ctx.moveTo(swX - 20 * sc, swY);
      ctx.lineTo(swX + 10 * sc, swY - 30 * sc);
      ctx.stroke();
      ctx.font = `${13 * sc}px Poppins, sans-serif`;
      ctx.fillStyle = TOKENS.color.neutral700;
      ctx.textAlign = "center";
      ctx.fillText("switch", swX, swY - 38 * sc);

      ctx.lineWidth = 2.5 * sc;
      ctx.strokeStyle = TOKENS.color.primary;
      ctx.beginPath();
      ctx.moveTo(swX + 20 * sc, swY);
      ctx.lineTo(swX + 20 * sc, bottom - 60 * sc);
      ctx.stroke();

      const bX = (batX + right) / 2 + 30 * sc,
        bY = bottom - 60 * sc;
      ctx.beginPath();
      ctx.moveTo(swX + 20 * sc, bY);
      ctx.lineTo(bX + 32 * sc, bY);
      ctx.stroke();
      ctx.lineWidth = 3 * sc;
      ctx.beginPath();
      ctx.arc(bX, bY, 32 * sc, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bX - 20 * sc, bY - 20 * sc);
      ctx.lineTo(bX + 20 * sc, bY + 20 * sc);
      ctx.moveTo(bX + 20 * sc, bY - 20 * sc);
      ctx.lineTo(bX - 20 * sc, bY + 20 * sc);
      ctx.stroke();
      ctx.font = `${13 * sc}px Poppins, sans-serif`;
      ctx.fillStyle = TOKENS.color.neutral700;
      ctx.textAlign = "center";
      ctx.fillText("light bulb", bX, bY - 42 * sc);

      ctx.lineWidth = 2.5 * sc;
      ctx.strokeStyle = TOKENS.color.primary;
      ctx.beginPath();
      ctx.moveTo(bX - 32 * sc, bY);
      ctx.lineTo(batX, bY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(batX, bY);
      ctx.lineTo(batX, batY + 25 * sc);
      ctx.stroke();

      if (stepData?.currentFlowing) {
        ctx.fillStyle = TOKENS.color.secondaryAccent;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(bX, bY, 40 * sc, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = TOKENS.color.secondaryAccent;
        ctx.lineWidth = 1.5 * sc;
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          ctx.beginPath();
          ctx.moveTo(bX + Math.cos(a) * 40 * sc, bY + Math.sin(a) * 40 * sc);
          ctx.lineTo(bX + Math.cos(a) * 50 * sc, bY + Math.sin(a) * 50 * sc);
          ctx.stroke();
        }
      }
      break;
    }
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function CircuitDiagramsTool() {
  const [mode, setMode] = useState("learn");
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 800,
  );

  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const getSteps = () => {
    switch (mode) {
      case "learn":
        return learnSteps;
      case "practice":
        return practiceQuestions;
      case "real_world":
        return realWorldSteps;
      case "hands_on":
        return handsOnSteps;
      default:
        return learnSteps;
    }
  };

  const steps = getSteps();
  const currentData = steps[step];

  const getSymbolType = () => {
    if (!currentData) return null;
    return currentData.symbolType || null;
  };

  useEffect(() => {
    const symbolType = getSymbolType();
    if (symbolType && canvasRef.current) {
      setTimeout(
        () => drawSymbolOnCanvas(canvasRef.current, symbolType, currentData),
        50,
      );
    }
  }, [step, mode, windowWidth]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isPlaying && mode !== "practice") {
      timerRef.current = setTimeout(() => {
        if (step < steps.length - 1) {
          setStep((s) => s + 1);
        } else {
          setIsPlaying(false);
        }
      }, 6000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, step, mode]);

  const handleMode = (m) => {
    setMode(m);
    setStep(0);
    setIsPlaying(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setAttempts(0);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep((s) => s - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleAnswer = (idx) => {
    if (showFeedback) return;
    setSelectedAnswer(idx);
    setShowFeedback(true);
    setAttempts((a) => a + 1);
    if (idx === currentData.correctAnswer) setScore((s) => s + 1);
  };

  // ============================================================================
  // STYLES
  // ============================================================================
  const S = {
    wrapper: {
      width: "100%",
      maxWidth: "960px",
      margin: "0 auto",
      fontFamily: TOKENS.font,
      color: TOKENS.color.neutral700,
      background: TOKENS.color.white,
      borderRadius: isMobile ? TOKENS.radius.md : TOKENS.radius.lg,
      boxShadow: TOKENS.shadow.lg,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      minHeight: isMobile ? "100vh" : "auto",
    },
    header: {
      background: `linear-gradient(135deg, ${TOKENS.color.gradientStart}, ${TOKENS.color.primary} 50%, ${TOKENS.color.gradientEnd})`,
      padding: isMobile ? "20px 16px" : "28px 32px",
      color: TOKENS.color.white,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "8px",
    },
    title: {
      fontSize: isMobile ? "20px" : "26px",
      fontWeight: 700,
      margin: 0,
      letterSpacing: "-0.02em",
    },
    stepBadge: {
      background: "rgba(255,255,255,0.2)",
      borderRadius: TOKENS.radius.full,
      padding: "6px 16px",
      fontSize: "13px",
      fontWeight: 500,
      backdropFilter: "blur(8px)",
    },
    modeBar: {
      display: "flex",
      gap: isMobile ? "4px" : "8px",
      padding: isMobile ? "12px 8px" : "14px 24px",
      background: TOKENS.color.neutral100,
      borderBottom: `1px solid ${TOKENS.color.neutral200}`,
      overflowX: "auto",
      WebkitOverflowScrolling: "touch",
    },
    modeBtn: (active) => ({
      padding: isMobile ? "8px 14px" : "10px 22px",
      borderRadius: TOKENS.radius.full,
      border: "none",
      cursor: "pointer",
      fontFamily: TOKENS.font,
      fontSize: isMobile ? "13px" : "14px",
      fontWeight: active ? 600 : 400,
      whiteSpace: "nowrap",
      background: active ? TOKENS.color.primary : "transparent",
      color: active ? TOKENS.color.white : TOKENS.color.neutral700,
      boxShadow: active ? TOKENS.shadow.sm : "none",
      transition: "all 0.25s ease",
      transform: active ? "scale(1.04)" : "scale(1)",
    }),
    body: {
      flex: 1,
      padding: isMobile ? "20px 16px" : "32px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      overflowY: "auto",
    },
    stepTitle: {
      fontSize: isMobile ? "20px" : "24px",
      fontWeight: 700,
      color: TOKENS.color.primary,
      margin: 0,
      lineHeight: 1.3,
    },
    desc: {
      fontSize: isMobile ? "15px" : "16px",
      lineHeight: 1.7,
      margin: 0,
      color: TOKENS.color.neutral700,
    },
    canvasWrap: {
      background: TOKENS.color.neutral100,
      borderRadius: TOKENS.radius.md,
      border: `2px solid ${TOKENS.color.neutral200}`,
      padding: isMobile ? "12px" : "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: isMobile ? "200px" : "280px",
    },
    canvas: {
      width: "100%",
      maxWidth: "600px",
      height: isMobile ? "200px" : "280px",
      display: "block",
    },
    explanation: {
      background: TOKENS.color.primaryBg,
      borderLeft: `4px solid ${TOKENS.color.primary}`,
      borderRadius: `0 ${TOKENS.radius.md} ${TOKENS.radius.md} 0`,
      padding: isMobile ? "16px" : "20px 24px",
      fontSize: isMobile ? "14px" : "15px",
      lineHeight: 1.8,
      whiteSpace: "pre-line",
      color: TOKENS.color.neutral700,
    },
    optionBtn: (idx, sel, isCorrect, fb) => ({
      padding: isMobile ? "14px 16px" : "16px 20px",
      borderRadius: TOKENS.radius.md,
      cursor: fb ? "default" : "pointer",
      fontFamily: TOKENS.font,
      fontSize: isMobile ? "15px" : "16px",
      textAlign: "left",
      transition: "all 0.25s ease",
      background: fb
        ? isCorrect
          ? "rgba(34,197,94,0.1)"
          : sel
            ? "rgba(239,68,68,0.1)"
            : TOKENS.color.white
        : sel
          ? TOKENS.color.primaryBg
          : TOKENS.color.white,
      border: `2px solid ${
        fb
          ? isCorrect
            ? TOKENS.color.success
            : sel
              ? TOKENS.color.error
              : TOKENS.color.neutral200
          : sel
            ? TOKENS.color.primary
            : TOKENS.color.neutral200
      }`,
      color: TOKENS.color.neutral700,
      transform: sel && !fb ? "scale(1.01)" : "scale(1)",
    }),
    feedback: (correct) => ({
      padding: isMobile ? "16px" : "20px",
      borderRadius: TOKENS.radius.md,
      background: correct ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
      border: `2px solid ${correct ? TOKENS.color.success : TOKENS.color.error}`,
    }),
    feedbackTitle: (correct) => ({
      fontSize: "17px",
      fontWeight: 700,
      marginBottom: "6px",
      color: correct ? TOKENS.color.success : TOKENS.color.error,
    }),
    scoreBadge: {
      display: "inline-flex",
      gap: "20px",
      padding: "12px 20px",
      background: TOKENS.color.neutral100,
      borderRadius: TOKENS.radius.md,
      marginBottom: "12px",
    },
    scoreLabel: { fontSize: "13px", color: TOKENS.color.neutral400 },
    scoreValue: {
      fontSize: "22px",
      fontWeight: 700,
      color: TOKENS.color.primary,
    },
    nav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: isMobile ? "14px 16px" : "18px 32px",
      gap: "12px",
      background: TOKENS.color.neutral100,
      borderTop: `1px solid ${TOKENS.color.neutral200}`,
      flexWrap: "wrap",
    },
    navBtn: (disabled) => ({
      padding: isMobile ? "10px 18px" : "12px 28px",
      borderRadius: TOKENS.radius.full,
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: TOKENS.font,
      fontSize: isMobile ? "14px" : "15px",
      fontWeight: 600,
      background: disabled ? TOKENS.color.neutral200 : TOKENS.color.primary,
      color: disabled ? TOKENS.color.neutral400 : TOKENS.color.white,
      opacity: disabled ? 0.6 : 1,
      transition: "all 0.25s ease",
      boxShadow: disabled ? "none" : TOKENS.shadow.sm,
    }),
    playBtn: {
      padding: isMobile ? "10px 18px" : "12px 28px",
      borderRadius: TOKENS.radius.full,
      border: `2px solid ${TOKENS.color.primary}`,
      cursor: "pointer",
      fontFamily: TOKENS.font,
      fontSize: isMobile ? "14px" : "15px",
      fontWeight: 600,
      background: "transparent",
      color: TOKENS.color.primary,
      transition: "all 0.25s ease",
    },
    progressBar: {
      height: "4px",
      background: TOKENS.color.neutral200,
      borderRadius: "2px",
      overflow: "hidden",
      margin: "0 32px",
    },
    progressFill: {
      height: "100%",
      background: `linear-gradient(90deg, ${TOKENS.color.primary}, ${TOKENS.color.secondary})`,
      borderRadius: "2px",
      transition: "width 0.4s ease",
      width: `${((step + 1) / steps.length) * 100}%`,
    },
    rwCard: {
      background: TOKENS.color.secondaryLight,
      borderRadius: TOKENS.radius.md,
      padding: isMobile ? "20px" : "28px",
      border: `1px solid ${TOKENS.color.secondaryAccent}30`,
    },
    rwIcon: {
      fontSize: isMobile ? "40px" : "52px",
      marginBottom: "12px",
      display: "block",
    },
    hoCard: {
      background: TOKENS.color.primaryBg,
      borderRadius: TOKENS.radius.md,
      padding: isMobile ? "20px" : "28px",
      border: `1px solid ${TOKENS.color.primaryLight}`,
    },
  };

  // ============================================================================
  // RENDER MODES
  // ============================================================================
  const renderLearn = () => {
    if (!currentData) return null;
    return (
      <>
        <h2 style={S.stepTitle}>{currentData.title}</h2>
        <p style={S.desc}>{currentData.description}</p>
        {currentData.symbolType && (
          <div style={S.canvasWrap} ref={canvasContainerRef}>
            <canvas ref={canvasRef} style={S.canvas} />
          </div>
        )}
        {currentData.explanation && (
          <div style={S.explanation}>{currentData.explanation}</div>
        )}
      </>
    );
  };

  const renderPractice = () => {
    if (!currentData) return null;
    const q = currentData;
    const correct = selectedAnswer === q.correctAnswer;
    return (
      <>
        <div style={S.scoreBadge}>
          <div>
            <div style={S.scoreLabel}>Score</div>
            <div style={S.scoreValue}>
              {score}/{attempts}
            </div>
          </div>
          <div>
            <div style={S.scoreLabel}>Question</div>
            <div style={S.scoreValue}>
              {step + 1}/{steps.length}
            </div>
          </div>
        </div>
        <h2 style={S.stepTitle}>{q.question}</h2>
        {q.symbolType && (
          <div style={S.canvasWrap} ref={canvasContainerRef}>
            <canvas ref={canvasRef} style={S.canvas} />
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              style={S.optionBtn(
                i,
                selectedAnswer === i,
                i === q.correctAnswer,
                showFeedback,
              )}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          ))}
        </div>
        {showFeedback && (
          <div style={S.feedback(correct)}>
            <div style={S.feedbackTitle(correct)}>
              {correct ? "✓ Correct!" : "✗ Incorrect"}
            </div>
            <div style={{ fontSize: "15px", lineHeight: 1.6 }}>
              {q.explanation}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderRealWorld = () => {
    if (!currentData) return null;
    return (
      <div style={S.rwCard}>
        <span style={S.rwIcon}>{currentData.icon}</span>
        <h2 style={{ ...S.stepTitle, color: TOKENS.color.gradientStart }}>
          {currentData.title}
        </h2>
        <p style={S.desc}>{currentData.description}</p>
        <div
          style={{
            ...S.explanation,
            background: "rgba(255,255,255,0.7)",
            borderLeftColor: TOKENS.color.secondary,
            marginTop: "16px",
          }}
        >
          {currentData.explanation}
        </div>
      </div>
    );
  };

  const renderHandsOn = () => {
    if (!currentData) return null;
    return (
      <div style={S.hoCard}>
        <span style={S.rwIcon}>{currentData.icon}</span>
        <h2 style={S.stepTitle}>{currentData.title}</h2>
        <p style={S.desc}>{currentData.description}</p>
        <div style={{ ...S.explanation, marginTop: "16px" }}>
          {currentData.explanation}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (mode) {
      case "learn":
        return renderLearn();
      case "practice":
        return renderPractice();
      case "real_world":
        return renderRealWorld();
      case "hands_on":
        return renderHandsOn();
      default:
        return renderLearn();
    }
  };

  return (
    <div style={S.wrapper}>
      {/* Header */}
      <div style={S.header}>
        <h1 style={S.title}>⚡ Circuit Diagrams</h1>
        <span style={S.stepBadge}>
          Step {step + 1} of {steps.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={S.progressBar}>
        <div style={S.progressFill} />
      </div>

      {/* Mode Tabs */}
      <div style={S.modeBar}>
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => handleMode(m.key)}
            style={S.modeBtn(mode === m.key)}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={S.body}>{renderContent()}</div>

      {/* Navigation */}
      <div style={S.nav}>
        <button
          onClick={handlePrev}
          disabled={step === 0}
          style={S.navBtn(step === 0)}
        >
          ← Previous
        </button>
        {mode !== "practice" && (
          <button onClick={() => setIsPlaying(!isPlaying)} style={S.playBtn}>
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={step === steps.length - 1}
          style={S.navBtn(step === steps.length - 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
