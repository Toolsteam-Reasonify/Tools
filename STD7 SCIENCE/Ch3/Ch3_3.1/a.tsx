// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: torchlight_circuit_tool.tsx
// ═══════════════════════════════════════════════════════════════════════════

// @ts-ignore
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

// ═══════════════════════════════════════════════════════════════════════════
// SINGULARITY DESIGN SYSTEM TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const DS = {
  colors: {
    primary: "#4A4DC9",
    secondary: "#FF7212",
    gradientStart: "#533086",
    gradientEnd: "#FC9145",
    lightPurple: "#C1C1EA",
    lightOrange: "#FFF3E4",
    darkPurple: "#533086",
    darkOrange: "#FC9145",
    neutral900: "#4E4E4E",
    neutral400: "#CACACA",
    neutral200: "#EBEBEB",
    neutral100: "#F5F5F5",
    white: "#FFFFFF",
    black: "#1A1A2E",
    success: "#10b981",
    error: "#ef4444",
  },
  font: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export type ModeType = "learn" | "practice" | "real_world" | "hands_on";

export interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

export interface StepDataInterface {
  id: number;
  title: string;
  description: string;
  type: "intro" | "explanation" | "practice" | "real_world" | "hands_on";
  mode: ModeType;
  data?: any;
}

export interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

export interface TorchlightAdditionalProps {
  torchState?: "on" | "off";
  interactive?: boolean;
  highlightPart?: "lamp" | "switch" | "cells" | "wires" | null;
  showCircuitFlow?: boolean;
  circuitComplete?: boolean;
  practiceQuestions?: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
  realWorldCategory?:
    | "cooking"
    | "lighting"
    | "transportation"
    | "cooling"
    | "entertainment"
    | "communication"
    | null;
  showAllCategories?: boolean;
  handsOnMode?: "build_circuit" | "toggle_parts" | "trace_flow";
  componentVisibility?: {
    lamp?: boolean;
    switch?: boolean;
    cells?: boolean;
    wires?: boolean;
  };
}

export interface TorchlightCircuitToolProps {
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
    additionalProps?: TorchlightAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION HELPERS
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
const easeOutBounce = (t: number): number => {
  const n1 = 7.5625,
    d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

// ═══════════════════════════════════════════════════════════════════════════
// INLINE SVG ICONS
// ═══════════════════════════════════════════════════════════════════════════

const IconPlay: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" />
  </svg>
);
const IconPause: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);
const IconChevLeft: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const IconChevRight: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const IconCheck: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const IconX: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const IconAward: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    />
  </svg>
);
const IconRotate: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT STEPS
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_STEPS: StepDataInterface[] = [
  // LEARN MODE
  {
    id: 1,
    title: "What is a Torchlight?",
    description:
      "A torchlight is a portable device that produces light using electric cells (battery), a switch, connecting wires, and an electric lamp or LED. When the switch is ON, cells push electric current through wires to the lamp, making it glow.",
    type: "intro",
    mode: "learn",
  },
  {
    id: 2,
    title: "Electric Lamp / LED",
    description:
      "The lamp or LED is the component that produces light. When electricity flows through the thin filament (or LED chip), it converts electrical energy into light energy. This is the output device of the circuit.",
    type: "explanation",
    mode: "learn",
    data: { highlightPart: "lamp" },
  },
  {
    id: 3,
    title: "The Switch",
    description:
      "The switch controls whether the circuit is complete (ON) or broken (OFF). When you slide it to ON, it connects the wire path so current can flow. When OFF, the path breaks and current stops.",
    type: "explanation",
    mode: "learn",
    data: { highlightPart: "switch" },
  },
  {
    id: 4,
    title: "Electric Cells (Battery)",
    description:
      "Cells provide the electrical energy through chemical reactions. The positive (+) terminal pushes current out, and the negative (−) terminal receives it back. Two or more cells together form a battery.",
    type: "explanation",
    mode: "learn",
    data: { highlightPart: "cells" },
  },
  {
    id: 5,
    title: "Connecting Wires",
    description:
      "Wires are made of copper, a good conductor. They carry electricity between all components, forming a complete loop called a circuit. Without wires, the parts cannot communicate electrically.",
    type: "explanation",
    mode: "learn",
    data: { highlightPart: "wires" },
  },
  {
    id: 6,
    title: "Complete Circuit",
    description:
      "When all parts are connected properly and the switch is ON, electricity flows in a complete loop: from cells → through wires → through the switch → to the lamp → and back to cells. This is a closed circuit!",
    type: "explanation",
    mode: "learn",
    data: { showCircuitFlow: true },
  },

  // PRACTICE MODE
  {
    id: 10,
    title: "Quiz: Purpose of a Cell",
    description: "",
    type: "practice",
    mode: "practice",
    data: { questionIndex: 0 },
  },
  {
    id: 11,
    title: "Quiz: What Makes a Battery?",
    description: "",
    type: "practice",
    mode: "practice",
    data: { questionIndex: 1 },
  },
  {
    id: 12,
    title: "Quiz: Switch ON Action",
    description: "",
    type: "practice",
    mode: "practice",
    data: { questionIndex: 2 },
  },
  {
    id: 13,
    title: "Quiz: Light Producer",
    description: "",
    type: "practice",
    mode: "practice",
    data: { questionIndex: 3 },
  },
  {
    id: 14,
    title: "Quiz: Wire Function",
    description: "",
    type: "practice",
    mode: "practice",
    data: { questionIndex: 4 },
  },

  // REAL WORLD MODE
  {
    id: 20,
    title: "Cooking & Heating",
    description:
      "Electric stoves convert electrical energy into heat through resistance. Current flows through heating coils which get red-hot to cook food. The same circuit principle as a torchlight — source, switch, load!",
    type: "real_world",
    mode: "real_world",
    data: { category: "cooking" },
  },
  {
    id: 21,
    title: "Lighting",
    description:
      "Light bulbs and LEDs convert electrical energy into light. A wall switch controls the circuit just like a torchlight switch. Current flows from the power source through the switch to the bulb and back.",
    type: "real_world",
    mode: "real_world",
    data: { category: "lighting" },
  },
  {
    id: 22,
    title: "Transportation",
    description:
      "Electric vehicles use large battery packs to power motors. The battery stores chemical energy that converts to electrical energy, sent through a controller to spin the motor — same circuit concept, bigger scale!",
    type: "real_world",
    mode: "real_world",
    data: { category: "transportation" },
  },
  {
    id: 23,
    title: "Heating & Cooling",
    description:
      "Air conditioners use circuits to control compressors and fans. The thermostat acts as an automatic switch — when the room is cool enough, it breaks the circuit. When warm, it completes it.",
    type: "real_world",
    mode: "real_world",
    data: { category: "cooling" },
  },
  {
    id: 24,
    title: "Entertainment",
    description:
      "TVs and computers use complex circuits with millions of tiny transistors acting as switches. Electricity flows through a power supply, main board, and display — the same source → path → load pattern.",
    type: "real_world",
    mode: "real_world",
    data: { category: "entertainment" },
  },
  {
    id: 25,
    title: "Communication",
    description:
      "Phones use circuits to transmit signals wirelessly. The battery powers the processor, screen, and radio antenna. Every phone call starts with electricity flowing through a circuit!",
    type: "real_world",
    mode: "real_world",
    data: { category: "communication" },
  },

  // HANDS ON MODE
  {
    id: 30,
    title: "Build a Circuit",
    description:
      "Toggle each component ON to build a working circuit. All four parts must be connected for the lamp to light up! Try removing one part to see what happens.",
    type: "hands_on",
    mode: "hands_on",
    data: { handsOnMode: "build_circuit" },
  },
  {
    id: 31,
    title: "Toggle the Torch",
    description:
      "Click the torch to turn it ON and OFF. Observe how the switch position changes and how the lamp responds. The circuit must be complete for light!",
    type: "hands_on",
    mode: "hands_on",
    data: { handsOnMode: "toggle_parts" },
  },
];

const DEFAULT_QUESTIONS = [
  {
    id: 1,
    question: "What is the purpose of an electric cell in a torchlight?",
    options: [
      "To produce light",
      "To provide electrical energy",
      "To control the flow of electricity",
      "To connect the parts",
    ],
    correctAnswer: "To provide electrical energy",
  },
  {
    id: 2,
    question: "How many cells make a battery?",
    options: ["One", "Two or more", "Exactly three", "None"],
    correctAnswer: "Two or more",
  },
  {
    id: 3,
    question: "What happens when we slide the switch to ON position?",
    options: [
      "Circuit breaks",
      "Circuit completes and lamp glows",
      "Battery drains immediately",
      "Nothing happens",
    ],
    correctAnswer: "Circuit completes and lamp glows",
  },
  {
    id: 4,
    question: "What component actually produces light in a torchlight?",
    options: ["Cell", "Battery", "Electric lamp", "Switch"],
    correctAnswer: "Electric lamp",
  },
  {
    id: 5,
    question: "What do connecting wires do?",
    options: [
      "Store electricity",
      "Produce light",
      "Carry electricity between components",
      "Turn electricity on and off",
    ],
    correctAnswer: "Carry electricity between components",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// TORCH SVG COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

type TorchPart = "lamp" | "switch" | "cells" | "wires";

const TorchDiagram: React.FC<{
  isOn: boolean;
  highlightPart?: TorchPart | null;
  onClick?: () => void;
  interactive?: boolean;
  size?: number;
}> = ({ isOn, highlightPart, onClick, interactive = true, size = 200 }) => {
  const partColors: Record<TorchPart, string> = {
    lamp: DS.colors.secondary,
    switch: DS.colors.primary,
    cells: DS.colors.darkOrange,
    wires: DS.colors.darkPurple,
  };
  const hl = (part: TorchPart) => highlightPart === part;
  const getC = (part: TorchPart) => (hl(part) ? partColors[part] : "#94a3b8");
  const getO = (part: TorchPart) => (hl(part) ? 1 : 0.5);

  return (
    <svg
      width={size}
      height={size * 2}
      viewBox="0 0 200 400"
      style={{ cursor: interactive ? "pointer" : "default" }}
      onClick={interactive ? onClick : undefined}
    >
      <defs>
        <linearGradient id="tBodyGrad" x1="0%" x2="100%">
          <stop offset="0%" stopColor={DS.colors.darkPurple} />
          <stop offset="50%" stopColor="#6A4B8A" />
          <stop offset="100%" stopColor={DS.colors.darkPurple} />
        </linearGradient>
        <radialGradient id="tLensOn" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fffef5" />
          <stop offset="30%" stopColor="#fff9e6" />
          <stop offset="60%" stopColor="#ffeb99" />
          <stop offset="100%" stopColor={DS.colors.secondary} />
        </radialGradient>
        <radialGradient id="tLensOff" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="100%" stopColor="#a8a8a8" />
        </radialGradient>
        <radialGradient id="tBeam" cx="50%" cy="100%">
          <stop offset="0%" stopColor={`${DS.colors.secondary}99`} />
          <stop offset="100%" stopColor={`${DS.colors.secondary}00`} />
        </radialGradient>
        <filter id="tGlow">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Light beam */}
      {isOn && (
        <ellipse
          cx="100"
          cy="80"
          rx="120"
          ry="80"
          fill="url(#tBeam)"
          filter="url(#tGlow)"
          opacity="0.8"
        >
          <animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </ellipse>
      )}

      {/* Head */}
      <ellipse
        cx="100"
        cy="160"
        rx="65"
        ry="80"
        fill="#2c3e50"
        stroke={getC("lamp")}
        strokeWidth={hl("lamp") ? 3 : 0}
        opacity={getO("lamp")}
      />

      {/* Lens / Lamp */}
      <ellipse
        cx="100"
        cy="150"
        rx="50"
        ry="50"
        fill={isOn ? "url(#tLensOn)" : "url(#tLensOff)"}
        filter={isOn ? "url(#tGlow)" : "none"}
        stroke={getC("lamp")}
        strokeWidth={hl("lamp") ? 3 : 0}
      />
      {isOn && (
        <circle cx="100" cy="150" r="20" fill="#fffef5" filter="url(#tGlow)">
          <animate
            attributeName="opacity"
            values="0.9;1;0.9"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Body */}
      <rect
        x="65"
        y="200"
        width="70"
        height="180"
        rx="15"
        fill="url(#tBodyGrad)"
        stroke={getC("wires")}
        strokeWidth={hl("wires") ? 3 : 0}
      />
      {[220, 235, 250, 265, 280, 295, 310, 325, 340, 355].map((y) => (
        <rect
          key={y}
          x="70"
          y={y}
          width="60"
          height="3"
          rx="1.5"
          fill="rgba(0,0,0,0.4)"
        />
      ))}

      {/* Switch */}
      <rect
        x="80"
        y="260"
        width="40"
        height="18"
        rx="9"
        fill={isOn ? DS.colors.secondary : "#666"}
        stroke={getC("switch")}
        strokeWidth={hl("switch") ? 3 : 0}
      />
      <circle cx="100" cy="269" r="3" fill={isOn ? "#fff" : "#999"} />
      <text
        x="100"
        y="245"
        textAnchor="middle"
        fontSize="9"
        fill={DS.colors.lightPurple}
        fontFamily={DS.font}
        fontWeight="bold"
      >
        SWITCH
      </text>

      {/* Cells hint inside body */}
      <rect
        x="78"
        y="310"
        width="44"
        height="50"
        rx="6"
        fill="none"
        stroke={getC("cells")}
        strokeWidth={hl("cells") ? 3 : 1.5}
        strokeDasharray={hl("cells") ? "none" : "4,3"}
        opacity={getO("cells")}
      />
      <text
        x="100"
        y="330"
        textAnchor="middle"
        fontSize="8"
        fill={getC("cells")}
        fontWeight="bold"
        opacity={getO("cells")}
      >
        +
      </text>
      <text
        x="100"
        y="355"
        textAnchor="middle"
        fontSize="8"
        fill={getC("cells")}
        fontWeight="bold"
        opacity={getO("cells")}
      >
        −
      </text>
      <text
        x="100"
        y="370"
        textAnchor="middle"
        fontSize="7"
        fill={getC("cells")}
        opacity={getO("cells")}
      >
        CELLS
      </text>

      {/* Wires flow indicator */}
      {(isOn || hl("wires")) && (
        <g>
          {[0, 0.5, 1].map((d, i) => (
            <circle
              key={i}
              r="3"
              fill={DS.colors.secondary}
              opacity={0.8 - i * 0.2}
            >
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                begin={`${d}s`}
                path="M100 360 L120 360 L130 300 L130 200 L100 150 L70 200 L70 300 L80 360 L100 360"
              />
            </circle>
          ))}
        </g>
      )}

      {/* Base */}
      <ellipse
        cx="100"
        cy="380"
        rx="35"
        ry="18"
        fill={DS.colors.darkPurple}
        stroke="#0d1117"
        strokeWidth="2"
      />
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const TorchlightCircuitTool: React.FC<TorchlightCircuitToolProps> = ({
  props = {},
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  // ── CONFIG ──
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: props.initialMode ?? "learn",
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: props.enabledModes ?? [
        "learn",
        "practice",
        "real_world",
        "hands_on",
      ],
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      initialStep: props.initialStep ?? 1,
      filterSteps: props.filterSteps ?? null,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration:
        props.autoPlayDuration ?? props.data?.autoPlayDuration ?? 8000,
      themeColor:
        props.themeColor ?? props.data?.themeColor ?? DS.colors.primary,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  // ── ADDITIONAL PROPS ──
  const ap = useMemo(() => {
    const a = props.additionalProps || {};
    return {
      torchState: a.torchState ?? "off",
      interactive: a.interactive ?? true,
      highlightPart: a.highlightPart ?? null,
      showCircuitFlow: a.showCircuitFlow ?? false,
      circuitComplete: a.circuitComplete ?? true,
      practiceQuestions: a.practiceQuestions ?? DEFAULT_QUESTIONS,
      realWorldCategory: a.realWorldCategory ?? null,
      showAllCategories: a.showAllCategories ?? true,
      handsOnMode: a.handsOnMode ?? "build_circuit",
      componentVisibility: {
        lamp: true,
        switch: true,
        cells: true,
        wires: true,
        ...(a.componentVisibility || {}),
      },
    };
  }, [props.additionalProps]);

  // ── STEPS ──
  const allSteps = props.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(() => {
    if (config.filterSteps && config.filterSteps.length > 0)
      return allSteps.filter((s) => config.filterSteps!.includes(s.id));
    return allSteps;
  }, [allSteps, config.filterSteps]);

  // ── STATE ──
  const [selectedMode, setSelectedMode] = useState<ModeType>(
    config.initialMode,
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    const steps = availableSteps.filter((s) => s.mode === config.initialMode);
    if (config.initialStep) {
      const idx = steps.findIndex((s) => s.id === config.initialStep);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });
  const [isPlaying, setIsPlaying] = useState(!stopAutoNext);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [contentTransform, setContentTransform] = useState("translateY(0)");
  const [buttonStates, setButtonStates] = useState<
    Record<string, "idle" | "hover" | "active">
  >({});

  // Tool-specific state
  const [torchOn, setTorchOn] = useState(ap.torchState === "on");
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answeredQuestions, setAnsweredQuestions] = useState<
    Record<number, { answer: string; correct: boolean }>
  >({});
  const [handsOnParts, setHandsOnParts] = useState({
    lamp: false,
    switch: false,
    cells: false,
    wires: false,
  });
  const [animPhase, setAnimPhase] = useState(0);

  const filteredSteps = useMemo(
    () => availableSteps.filter((s) => s.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const currentStep = filteredSteps[currentStepIndex] || filteredSteps[0];

  // ── SYNC ADDITIONAL PROPS ──
  useEffect(() => {
    setTorchOn(ap.torchState === "on");
  }, [ap.torchState]);
  useEffect(() => {
    setAnimPhase((p) => p + 1);
  }, [props.additionalProps]);

  // ── KEYFRAME INJECTION ──
  useEffect(() => {
    const id = "torchlight-circuit-keyframes";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
      @keyframes fadeOutDown { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-30px); } }
      @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.08); } }
      @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-15px); } }
      @keyframes popIn { 0% { transform:scale(0); opacity:0; } 70% { transform:scale(1.2); } 100% { transform:scale(1); opacity:1; } }
      @keyframes slideRight { from { transform:translateX(-100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
      @keyframes glow { 0%,100% { box-shadow:0 0 5px ${DS.colors.primary}40; } 50% { box-shadow:0 0 25px ${DS.colors.primary}80; } }
      @keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
      @keyframes ripple { 0% { transform:scale(0); opacity:0.5; } 100% { transform:scale(4); opacity:0; } }
      @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
      @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
      @keyframes highlight { 0% { background-color:${DS.colors.primary}; transform:scale(1.3); } 100% { background-color:${DS.colors.primary}40; transform:scale(1); } }
      @keyframes countUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      @keyframes drawLine { from { stroke-dashoffset:1000; } to { stroke-dashoffset:0; } }
      @keyframes jump { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-20px); } }
    `;
    document.head.appendChild(s);
    return () => {
      const el = document.getElementById(id);
      if (el) document.head.removeChild(el);
    };
  }, []);

  // ── STEP DETAILS CALLBACK ──
  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: filteredSteps.length,
        isPaused: !isPlaying,
        currentMode: selectedMode,
      });
  }, [
    currentStepIndex,
    filteredSteps.length,
    isPlaying,
    selectedMode,
    setStepDetails,
  ]);

  // ── AUTO-ADVANCE ──
  useEffect(() => {
    if (!isPlaying || stopAutoNext || config.autoPlayDuration === 0) return;
    const timer = setTimeout(() => {
      if (currentStepIndex < filteredSteps.length - 1)
        animateStepChange("next");
      else setIsPlaying(false);
    }, config.autoPlayDuration);
    return () => clearTimeout(timer);
  }, [
    isPlaying,
    currentStepIndex,
    stopAutoNext,
    filteredSteps.length,
    config.autoPlayDuration,
  ]);

  // ── NAVIGATION ──
  const animateStepChange = useCallback(
    (dir: "next" | "prev") => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setContentOpacity(0);
      setContentTransform(
        dir === "next" ? "translateY(-30px)" : "translateY(30px)",
      );
      setTimeout(() => {
        setCurrentStepIndex((p) => (dir === "next" ? p + 1 : p - 1));
        setSelectedAnswer("");
        setContentTransform(
          dir === "next" ? "translateY(30px)" : "translateY(-30px)",
        );
        setTimeout(() => {
          setContentOpacity(1);
          setContentTransform("translateY(0)");
          setIsTransitioning(false);
        }, 50);
      }, 300);
    },
    [isTransitioning],
  );

  const nextStep = () => {
    if (currentStepIndex < filteredSteps.length - 1 && !isTransitioning)
      animateStepChange("next");
  };
  const prevStep = () => {
    if (currentStepIndex > 0 && !isTransitioning) animateStepChange("prev");
  };

  const changeMode = (mode: ModeType) => {
    if (mode === selectedMode) return;
    setIsTransitioning(true);
    setContentOpacity(0);
    setTimeout(() => {
      setSelectedMode(mode);
      setCurrentStepIndex(0);
      setSelectedAnswer("");
      setTimeout(() => {
        setContentOpacity(1);
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handleBtn = (id: string, st: "idle" | "hover" | "active") =>
    setButtonStates((p) => ({ ...p, [id]: st }));
  const btnStyle = (
    id: string,
    base: React.CSSProperties,
  ): React.CSSProperties => {
    const s = buttonStates[id] || "idle";
    return {
      ...base,
      transform:
        s === "active"
          ? "scale(0.95)"
          : s === "hover"
            ? "scale(1.05)"
            : "scale(1)",
      boxShadow: s === "hover" ? "0 10px 25px rgba(0,0,0,0.2)" : base.boxShadow,
    };
  };

  // ── COLORS ──
  const colors = {
    primary: config.themeColor,
    bg: config.darkMode ? DS.colors.black : DS.colors.neutral100,
    surface: config.darkMode ? "#16213e" : DS.colors.white,
    text: config.darkMode ? "#e2e8f0" : DS.colors.black,
    textSec: config.darkMode ? "#94a3b8" : DS.colors.neutral900,
    border: config.darkMode ? "#334155" : DS.colors.neutral200,
  };

  const modeColors: Record<ModeType, { from: string; to: string }> = {
    learn: { from: DS.colors.primary, to: "#6A6DE0" },
    practice: { from: DS.colors.darkPurple, to: DS.colors.primary },
    real_world: { from: DS.colors.secondary, to: DS.colors.darkOrange },
    hands_on: { from: DS.colors.darkOrange, to: DS.colors.secondary },
  };

  const modeIcons: Record<ModeType, string> = {
    learn: "📚",
    practice: "🎯",
    real_world: "🌍",
    hands_on: "🔧",
  };
  const modeLabels: Record<ModeType, string> = {
    learn: "Learn",
    practice: "Practice",
    real_world: "Real World",
    hands_on: "Hands On",
  };

  // ── RENDER: LEARN ──
  const renderLearnContent = () => {
    const step = currentStep;
    const hp: TorchPart | null = step?.data?.highlightPart ?? ap.highlightPart;
    const partInfo: Record<
      TorchPart,
      { icon: string; title: string; color: string }
    > = {
      lamp: {
        icon: "💡",
        title: "Electric Lamp / LED",
        color: DS.colors.secondary,
      },
      switch: { icon: "🔘", title: "Switch", color: DS.colors.primary },
      cells: {
        icon: "🔋",
        title: "Electric Cells",
        color: DS.colors.darkOrange,
      },
      wires: {
        icon: "⚡",
        title: "Connecting Wires",
        color: DS.colors.darkPurple,
      },
    };
    return (
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <div
          style={{
            flex: "0 0 220px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: `linear-gradient(135deg, ${DS.colors.black} 0%, ${DS.colors.darkPurple} 100%)`,
            borderRadius: "16px",
            padding: "20px",
            minHeight: "300px",
          }}
        >
          <TorchDiagram
            isOn={torchOn || !!step?.data?.showCircuitFlow}
            highlightPart={hp}
            onClick={() => {
              if (ap.interactive) setTorchOn(!torchOn);
            }}
            interactive={ap.interactive}
            size={110}
          />
        </div>
        <div style={{ flex: 1, minWidth: "280px" }}>
          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.8,
              color: colors.text,
              padding: "20px",
              background: colors.bg,
              borderRadius: "12px",
              borderLeft: `4px solid ${hp ? partInfo[hp]?.color || colors.primary : colors.primary}`,
            }}
          >
            {step?.description}
          </p>
          {hp && (
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px",
                background: `${partInfo[hp].color}15`,
                borderRadius: "12px",
                border: `2px solid ${partInfo[hp].color}30`,
                animation: "fadeInUp 0.4s ease-out",
              }}
            >
              <span style={{ fontSize: "28px" }}>{partInfo[hp].icon}</span>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    color: partInfo[hp].color,
                    fontSize: "16px",
                  }}
                >
                  {partInfo[hp].title}
                </div>
                <div style={{ fontSize: "13px", color: colors.textSec }}>
                  Currently highlighted on the torch diagram
                </div>
              </div>
            </div>
          )}
          {ap.interactive && (
            <p
              style={{
                marginTop: "12px",
                fontSize: "13px",
                color: colors.textSec,
                fontStyle: "italic",
              }}
            >
              👆 Click the torch to toggle it ON/OFF — Status:{" "}
              <strong
                style={{ color: torchOn ? DS.colors.success : DS.colors.error }}
              >
                {torchOn ? "ON" : "OFF"}
              </strong>
            </p>
          )}
        </div>
      </div>
    );
  };

  // ── RENDER: PRACTICE ──
  const renderPracticeContent = () => {
    const qIdx = currentStep?.data?.questionIndex ?? 0;
    const q = ap.practiceQuestions[qIdx];
    if (!q) return <p>No question available.</p>;
    const answered = answeredQuestions[q.id];
    return (
      <div>
        <div
          style={{
            background: `linear-gradient(135deg, ${DS.colors.lightPurple}40, ${DS.colors.lightOrange}40)`,
            padding: "24px",
            borderRadius: "12px",
            marginBottom: "20px",
            border: `1px solid ${DS.colors.lightPurple}`,
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: DS.colors.black,
              margin: 0,
            }}
          >
            {q.question}
          </h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {q.options.map((opt, i) => {
            const isSelected = selectedAnswer === opt;
            const isCorrect = answered && opt === q.correctAnswer;
            const isWrong =
              answered && answered.answer === opt && !answered.correct;
            let bg = colors.bg;
            let border = DS.colors.neutral200;
            let col = colors.text;
            if (isCorrect) {
              bg = `${DS.colors.success}15`;
              border = DS.colors.success;
              col = DS.colors.success;
            } else if (isWrong) {
              bg = `${DS.colors.error}15`;
              border = DS.colors.error;
              col = DS.colors.error;
            } else if (isSelected && !answered) {
              bg = `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`;
              border = "transparent";
              col = DS.colors.white;
            }
            return (
              <button
                key={i}
                onClick={() => {
                  if (!answered) setSelectedAnswer(opt);
                }}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  textAlign: "left",
                  border: `2px solid ${border}`,
                  cursor: answered ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: bg,
                  color: col,
                  fontFamily: DS.font,
                  fontSize: "15px",
                  fontWeight: 600,
                  transition: "all 0.3s",
                  transform:
                    isSelected && !answered ? "scale(1.02)" : "scale(1)",
                  animation: `fadeInUp 0.3s ease-out ${i * 0.08}s both`,
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "14px",
                    backgroundColor:
                      isSelected && !answered
                        ? DS.colors.white
                        : isCorrect
                          ? DS.colors.success
                          : isWrong
                            ? DS.colors.error
                            : DS.colors.neutral200,
                    color:
                      isSelected && !answered
                        ? DS.colors.primary
                        : isCorrect || isWrong
                          ? DS.colors.white
                          : DS.colors.neutral900,
                  }}
                >
                  {isCorrect ? (
                    <IconCheck size={16} />
                  ) : isWrong ? (
                    <IconX size={16} />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </div>
                {opt}
              </button>
            );
          })}
        </div>
        {!answered && selectedAnswer && (
          <button
            onClick={() => {
              const correct = selectedAnswer === q.correctAnswer;
              setAnsweredQuestions((p) => ({
                ...p,
                [q.id]: { answer: selectedAnswer, correct },
              }));
            }}
            style={{
              marginTop: "16px",
              padding: "12px 32px",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "15px",
              fontFamily: DS.font,
              background: `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`,
              color: DS.colors.white,
              animation: "popIn 0.3s ease-out",
            }}
          >
            Check Answer
          </button>
        )}
        {answered && (
          <div
            style={{
              marginTop: "16px",
              padding: "16px",
              borderRadius: "12px",
              background: answered.correct
                ? `${DS.colors.success}10`
                : `${DS.colors.error}10`,
              border: `1px solid ${answered.correct ? DS.colors.success : DS.colors.error}30`,
              animation: "fadeInUp 0.3s ease-out",
            }}
          >
            <p
              style={{
                fontWeight: 700,
                color: answered.correct ? DS.colors.success : DS.colors.error,
                marginBottom: "4px",
                fontSize: "16px",
              }}
            >
              {answered.correct ? "✅ Correct!" : "❌ Not quite!"}
            </p>
            {!answered.correct && (
              <p style={{ fontSize: "14px", color: colors.textSec }}>
                The correct answer is: <strong>{q.correctAnswer}</strong>
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // ── RENDER: REAL WORLD ──
  const realWorldData: Record<
    string,
    { icon: string; examples: string[]; gradient: string }
  > = {
    cooking: {
      icon: "🍳",
      examples: ["Electric Stove", "Microwave", "Electric Kettle", "Toaster"],
      gradient: `linear-gradient(135deg, ${DS.colors.secondary}, ${DS.colors.darkOrange})`,
    },
    lighting: {
      icon: "💡",
      examples: ["Light Bulbs", "Street Lights", "Flashlight", "LED Lamps"],
      gradient: `linear-gradient(135deg, ${DS.colors.darkOrange}, ${DS.colors.secondary})`,
    },
    transportation: {
      icon: "🚗",
      examples: ["Electric Cars", "Electric Trains", "E-Bikes", "Scooters"],
      gradient: `linear-gradient(135deg, ${DS.colors.primary}, ${DS.colors.darkPurple})`,
    },
    cooling: {
      icon: "❄️",
      examples: ["Air Conditioner", "Refrigerator", "Electric Heater", "Fan"],
      gradient: `linear-gradient(135deg, ${DS.colors.primary}, #6A6DE0)`,
    },
    entertainment: {
      icon: "📺",
      examples: ["Television", "Computer", "Gaming Console", "Speakers"],
      gradient: `linear-gradient(135deg, ${DS.colors.darkPurple}, ${DS.colors.secondary})`,
    },
    communication: {
      icon: "📱",
      examples: ["Mobile Phones", "Wi-Fi Router", "Radio", "Satellite"],
      gradient: `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`,
    },
  };

  const renderRealWorldContent = () => {
    const cat = currentStep?.data?.category;
    const rd = cat ? realWorldData[cat] : null;
    return (
      <div>
        {rd && (
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div
              style={{
                flex: "0 0 80px",
                width: "80px",
                height: "80px",
                borderRadius: "20px",
                background: rd.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
                animation: "popIn 0.4s ease-out",
              }}
            >
              {rd.icon}
            </div>
            <div style={{ flex: 1, minWidth: "250px" }}>
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: 1.8,
                  color: colors.text,
                  marginBottom: "16px",
                }}
              >
                {currentStep?.description}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {rd.examples.map((ex, j) => (
                  <span
                    key={j}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "9999px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: DS.colors.white,
                      background: rd.gradient,
                      animation: `popIn 0.3s ease-out ${j * 0.1}s both`,
                    }}
                  >
                    {ex}
                  </span>
                ))}
              </div>
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px",
                  borderRadius: "12px",
                  background: `${DS.colors.primary}08`,
                  border: `1px solid ${DS.colors.primary}20`,
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    color: DS.colors.primary,
                    fontWeight: 600,
                  }}
                >
                  ⚡ Circuit Principle: Source → Switch → Load → Return — same
                  pattern everywhere!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── RENDER: HANDS ON ──
  const renderHandsOnContent = () => {
    const allOn =
      handsOnParts.lamp &&
      handsOnParts.switch &&
      handsOnParts.cells &&
      handsOnParts.wires;
    const parts: {
      key: TorchPart;
      icon: string;
      label: string;
      color: string;
    }[] = [
      {
        key: "cells",
        icon: "🔋",
        label: "Cells (Battery)",
        color: DS.colors.darkOrange,
      },
      { key: "wires", icon: "⚡", label: "Wires", color: DS.colors.darkPurple },
      { key: "switch", icon: "🔘", label: "Switch", color: DS.colors.primary },
      {
        key: "lamp",
        icon: "💡",
        label: "Lamp / LED",
        color: DS.colors.secondary,
      },
    ];
    if (currentStep?.data?.handsOnMode === "toggle_parts") {
      return (
        <div
          style={{
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: "0 0 220px",
              display: "flex",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${DS.colors.black}, ${DS.colors.darkPurple})`,
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <TorchDiagram
              isOn={torchOn}
              onClick={() => setTorchOn(!torchOn)}
              interactive
              size={110}
            />
          </div>
          <div style={{ flex: 1, minWidth: "250px" }}>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.7,
                color: colors.text,
                marginBottom: "12px",
              }}
            >
              {currentStep?.description}
            </p>
            <p
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: torchOn ? DS.colors.success : DS.colors.error,
              }}
            >
              Torch is{" "}
              {torchOn
                ? "✨ ON — Circuit Complete!"
                : "⭕ OFF — Circuit Broken"}
            </p>
          </div>
        </div>
      );
    }
    return (
      <div>
        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.7,
            color: colors.text,
            marginBottom: "20px",
          }}
        >
          {currentStep?.description}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {parts.map((p, i) => (
            <button
              key={p.key}
              onClick={() =>
                setHandsOnParts((prev) => ({ ...prev, [p.key]: !prev[p.key] }))
              }
              style={{
                padding: "16px",
                borderRadius: "16px",
                border: `3px solid ${handsOnParts[p.key] ? p.color : DS.colors.neutral200}`,
                background: handsOnParts[p.key]
                  ? `${p.color}12`
                  : colors.surface,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s",
                fontFamily: DS.font,
                animation: `popIn 0.4s ease-out ${i * 0.1}s both`,
              }}
            >
              <span style={{ fontSize: "32px" }}>{p.icon}</span>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "14px",
                  color: handsOnParts[p.key] ? p.color : colors.textSec,
                }}
              >
                {p.label}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: handsOnParts[p.key]
                    ? DS.colors.success
                    : DS.colors.error,
                }}
              >
                {handsOnParts[p.key] ? "✅ Connected" : "❌ Missing"}
              </span>
            </button>
          ))}
        </div>
        <div
          style={{
            padding: "16px",
            borderRadius: "12px",
            background: allOn
              ? `${DS.colors.success}10`
              : `${DS.colors.error}08`,
            border: `2px solid ${allOn ? DS.colors.success : DS.colors.error}30`,
            textAlign: "center",
            animation: "pulse 2s infinite",
          }}
        >
          <p
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: allOn ? DS.colors.success : DS.colors.error,
            }}
          >
            {allOn
              ? "✨ Circuit Complete — Lamp is Glowing!"
              : `⚠️ ${4 - Object.values(handsOnParts).filter(Boolean).length} part(s) still missing`}
          </p>
        </div>
      </div>
    );
  };

  // ── RENDER CONTENT DISPATCHER ──
  const renderContent = () => {
    switch (selectedMode) {
      case "learn":
        return renderLearnContent();
      case "practice":
        return renderPracticeContent();
      case "real_world":
        return renderRealWorldContent();
      case "hands_on":
        return renderHandsOnContent();
      default:
        return renderLearnContent();
    }
  };

  // ── STYLES ──
  const s: Record<string, React.CSSProperties> = {
    container: {
      width: "100%",
      maxWidth: `${config.width}px`,
      margin: "0 auto",
      background: colors.surface,
      borderRadius: "24px",
      overflow: "hidden",
      boxShadow: "0 25px 50px -12px rgba(83,48,134,0.18)",
      fontFamily: DS.font,
    },
    modeSelector: {
      display: config.showModeSelector ? "flex" : "none",
      gap: "10px",
      padding: "16px 20px",
      background: colors.bg,
      borderBottom: `1px solid ${colors.border}`,
      justifyContent: "center",
      flexWrap: "wrap",
    },
    header: {
      padding: "24px 32px",
      color: "white",
      position: "relative",
      overflow: "hidden",
    },
    content: {
      padding: "24px 32px",
      opacity: contentOpacity,
      transform: contentTransform,
      transition: `all ${300 / config.animationSpeed}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      minHeight: "250px",
    },
    nav: {
      display: config.showNavigation || config.showPlayPause ? "flex" : "none",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 32px",
      background: colors.bg,
      borderTop: `1px solid ${colors.border}`,
    },
    navBtn: {
      display: config.showNavigation ? "flex" : "none",
      alignItems: "center",
      gap: "6px",
      padding: "10px 20px",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "14px",
      fontFamily: DS.font,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    playBtn: {
      display: config.showPlayPause ? "flex" : "none",
      alignItems: "center",
      gap: "6px",
      padding: "10px 24px",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "14px",
      fontFamily: DS.font,
      color: "white",
      transition: "all 0.3s",
    },
  };

  // ── MAIN RENDER ──
  return (
    <div style={s.container}>
      {/* Mode Selector */}
      <div style={s.modeSelector}>
        {config.enabledModes.map((mode) => {
          const sel = selectedMode === mode;
          const mc = modeColors[mode];
          return (
            <button
              key={mode}
              onClick={() => changeMode(mode)}
              onMouseEnter={() => handleBtn(`m-${mode}`, "hover")}
              onMouseLeave={() => handleBtn(`m-${mode}`, "idle")}
              onMouseDown={() => handleBtn(`m-${mode}`, "active")}
              onMouseUp={() => handleBtn(`m-${mode}`, "hover")}
              style={btnStyle(`m-${mode}`, {
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "9999px",
                border: sel ? "none" : `2px solid ${DS.colors.neutral200}`,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "14px",
                fontFamily: DS.font,
                background: sel
                  ? `linear-gradient(135deg, ${mc.from}, ${mc.to})`
                  : colors.surface,
                color: sel ? "white" : colors.text,
                boxShadow: sel ? `0 4px 14px ${mc.from}40` : "none",
                transition: "all 0.3s",
              })}
            >
              <span>{modeIcons[mode]}</span>
              {modeLabels[mode]}
            </button>
          );
        })}
      </div>

      {/* Header */}
      <div
        style={{
          ...s.header,
          background: `linear-gradient(135deg, ${modeColors[selectedMode].from}, ${modeColors[selectedMode].to})`,
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 700,
            margin: 0,
            marginBottom: "8px",
            animation: "fadeInUp 0.6s ease-out",
          }}
        >
          {currentStep?.title}
        </h2>
        <span
          style={{
            display: config.showStepIndicator ? "inline-flex" : "none",
            alignItems: "center",
            gap: "6px",
            background: "rgba(255,255,255,0.2)",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "13px",
            backdropFilter: "blur(10px)",
          }}
        >
          Step {currentStepIndex + 1} of {filteredSteps.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        style={{ height: "4px", background: colors.border, overflow: "hidden" }}
      >
        <div
          style={{
            height: "100%",
            background: `linear-gradient(90deg, ${modeColors[selectedMode].from}, ${modeColors[selectedMode].to})`,
            borderRadius: "2px",
            transition: "width 0.5s ease-out",
            width: `${((currentStepIndex + 1) / filteredSteps.length) * 100}%`,
          }}
        />
      </div>

      {/* Content */}
      <div style={s.content}>{renderContent()}</div>

      {/* Navigation */}
      <div style={s.nav}>
        <button
          onClick={prevStep}
          disabled={currentStepIndex === 0 || isTransitioning}
          onMouseEnter={() => handleBtn("prev", "hover")}
          onMouseLeave={() => handleBtn("prev", "idle")}
          onMouseDown={() => handleBtn("prev", "active")}
          onMouseUp={() => handleBtn("prev", "hover")}
          style={btnStyle("prev", {
            ...s.navBtn,
            background: currentStepIndex === 0 ? colors.border : colors.surface,
            color: currentStepIndex === 0 ? colors.textSec : colors.text,
            cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",
            opacity: currentStepIndex === 0 ? 0.5 : 1,
          })}
        >
          <IconChevLeft size={18} /> Previous
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          onMouseEnter={() => handleBtn("play", "hover")}
          onMouseLeave={() => handleBtn("play", "idle")}
          onMouseDown={() => handleBtn("play", "active")}
          onMouseUp={() => handleBtn("play", "hover")}
          style={btnStyle("play", {
            ...s.playBtn,
            background: `linear-gradient(135deg, ${modeColors[selectedMode].from}, ${modeColors[selectedMode].to})`,
          })}
        >
          {isPlaying ? <IconPause size={18} /> : <IconPlay size={18} />}{" "}
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={nextStep}
          disabled={
            currentStepIndex === filteredSteps.length - 1 || isTransitioning
          }
          onMouseEnter={() => handleBtn("next", "hover")}
          onMouseLeave={() => handleBtn("next", "idle")}
          onMouseDown={() => handleBtn("next", "active")}
          onMouseUp={() => handleBtn("next", "hover")}
          style={btnStyle("next", {
            ...s.navBtn,
            background:
              currentStepIndex >= filteredSteps.length - 1
                ? colors.border
                : `linear-gradient(135deg, ${modeColors[selectedMode].from}, ${modeColors[selectedMode].to})`,
            color:
              currentStepIndex >= filteredSteps.length - 1
                ? colors.textSec
                : "white",
            cursor:
              currentStepIndex >= filteredSteps.length - 1
                ? "not-allowed"
                : "pointer",
            opacity: currentStepIndex >= filteredSteps.length - 1 ? 0.5 : 1,
          })}
        >
          Next <IconChevRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default TorchlightCircuitTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
