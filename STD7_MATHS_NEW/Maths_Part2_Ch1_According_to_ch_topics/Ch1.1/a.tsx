// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: geometric_twins_tool.tsx
// ═══════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  // @ts-ignore - react module/types may not be resolvable in this standalone file
} from "react";

// ==================== INLINE SVG ICONS (replacing lucide-react) ====================

const IconProps = {
  width: 16,
  height: 16,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ChevronLeft: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg {...IconProps} width={size} height={size} viewBox="0 0 24 24">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg {...IconProps} width={size} height={size} viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const Play: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg {...IconProps} width={size} height={size} viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const Pause: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg {...IconProps} width={size} height={size} viewBox="0 0 24 24">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);
const Check: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 16,
  style,
}) => (
  <svg
    {...IconProps}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={style}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg {...IconProps} width={size} height={size} viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const BookOpen: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg {...IconProps} width={size} height={size} viewBox="0 0 24 24">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
const Target: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg {...IconProps} width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice";

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
  type: "intro" | "explanation" | "interactive" | "practice" | "summary";
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

// ADDITIONAL PROPS — TOOL SPECIFIC
interface GeometryAdditionalProps {
  armLengthAB?: number;
  armLengthBC?: number;
  angleDeg?: number;
  showMultipleAngles?: boolean;
  showCongruenceComparison?: boolean;
  showFlipRotate?: boolean;
  highlightAngle?: boolean;
  customLabels?: { A?: string; B?: string; C?: string };
  diagramColor?: string;
  accentColor?: string;
}

interface GeometricTwinsToolProps {
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
    additionalProps?: GeometryAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

interface QuestionData {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface DefinitionItem {
  term: string;
  definition: string;
}

type ResolvedProps = NonNullable<GeometricTwinsToolProps["props"]>;

// ==================== DESIGN TOKENS (Singularity) ====================

const T = {
  primary: "#4A4DC9",
  accent: "#FF7212",
  dark: "#533086",
  warm: "#FC9145",
  lavender: "#C1C1EA",
  peach: "#FFF3E4",
  text: "#4E4E4E",
  textLight: "#7B7B7B",
  gray: "#CACACA",
  grayLight: "#EBEBEB",
  grayBg: "#F5F5F5",
  white: "#FFFFFF",
  success: "#2DB87D",
  error: "#E84545",
  font: "'Poppins', sans-serif",
  radius: 24,
  radiusSm: 12,
  radiusXs: 8,
};

// ==================== EASING HELPERS ====================

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
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

// ==================== RESPONSIVE HOOK ====================

const useWindowSize = () => {
  const [size, setSize] = useState({
    w: typeof window !== "undefined" ? window.innerWidth : 800,
    h: typeof window !== "undefined" ? window.innerHeight : 600,
  });
  useEffect(() => {
    const handle = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return size;
};

// Breakpoints: mobile < 480, tablet < 768, desktop >= 768
const getBreakpoint = (w: number): "mobile" | "tablet" | "desktop" =>
  w < 480 ? "mobile" : w < 768 ? "tablet" : "desktop";

const DEFAULT_STEPS: StepDataInterface[] = [
  // LEARN MODE
  {
    id: 1,
    title: "The Problem: Recreating a Figure",
    description:
      "Imagine a checkmark symbol on a signboard that needs to be recreated exactly. Tracing works for small figures, but for big ones we need measurements. Let's label the corners as A, B, and C.",
    type: "intro",
    mode: "learn",
    data: {
      diagram: "symbol",
      definitions: [
        {
          term: "Arm Lengths",
          definition:
            "The lengths of line segments AB and BC meeting at vertex B.",
        },
        {
          term: "Vertex",
          definition:
            "The point where two arms (sides) meet. B is the vertex of arms AB and BC.",
        },
      ],
    },
  },
  {
    id: 2,
    title: "Are Arm Lengths Enough?",
    description:
      "If AB = 4 cm and BC = 8 cm, is that enough? No! Many different figures can be drawn with the same arm lengths but different angles. Arm lengths alone do not fix the shape.",
    type: "explanation",
    mode: "learn",
    data: {
      diagram: "multipleAngles",
      definitions: [
        {
          term: "Non-Congruent Figures",
          definition:
            "Figures that do NOT have the same shape and size, even if some measurements match.",
        },
      ],
    },
  },
  {
    id: 3,
    title: "The Missing Piece: The Included Angle",
    description:
      "To uniquely determine the shape, we also need the included angle ∠ABC. With AB = 4 cm, BC = 8 cm, and ∠ABC = 80°, only one figure exists. Try the interactive slider!",
    type: "interactive",
    mode: "learn",
    data: {
      diagram: "angleExplorer",
      definitions: [
        {
          term: "Included Angle",
          definition:
            "The angle formed between two sides at their common vertex. ∠ABC is the included angle between AB and BC.",
        },
        {
          term: "Angle Measure (°)",
          definition:
            "Angles are measured in degrees. Full rotation = 360°, straight line = 180°, right angle = 90°.",
        },
      ],
    },
  },
  {
    id: 4,
    title: "What is Congruence?",
    description:
      "Figures with the exact same shape and size are congruent. They can be superimposed perfectly. You may rotate or flip a figure when checking congruence.",
    type: "explanation",
    mode: "learn",
    data: {
      diagram: "flip",
      definitions: [
        {
          term: "Congruent Figures",
          definition:
            "Figures with identical shape and size that can be superimposed perfectly. Symbol: ≅",
        },
        {
          term: "Superimposition",
          definition:
            "Placing one figure over another to check exact fit. Rotation and flipping are allowed.",
        },
      ],
    },
  },
  {
    id: 5,
    title: "Confirming Congruence",
    description:
      "Two figures with the same arm lengths AND the same included angle are congruent. Arm lengths alone are NOT sufficient — the angle must also match.",
    type: "explanation",
    mode: "learn",
    data: {
      diagram: "congruent",
      definitions: [
        {
          term: "Condition for Congruence",
          definition:
            "Two V-shapes are congruent iff they have: (1) same arm lengths, AND (2) same included angle.",
        },
        {
          term: "Exact Replica",
          definition:
            "A copy identical in every way — same shape, size, angles, and side lengths.",
        },
      ],
    },
  },
  {
    id: 6,
    title: "Key Takeaway",
    description:
      "To recreate or verify a figure, knowing just arm lengths is not enough. You must also know the included angle. Same arm lengths + same included angle = congruent.",
    type: "summary",
    mode: "learn",
    data: { diagram: "summary" },
  },

  // PRACTICE MODE
  {
    id: 10,
    title: "Question 1",
    type: "practice",
    mode: "practice",
    description: "Test your understanding of congruence.",
    data: {
      question: "What does it mean for two figures to be congruent?",
      options: [
        "They have the same colour",
        "They have the same shape but different sizes",
        "They have the same shape and size (exact copies)",
        "They look similar from far away",
      ],
      correct: 2,
      explanation:
        "Congruent figures have the exact same shape and size, and can be superimposed perfectly.",
    } as QuestionData,
  },
  {
    id: 11,
    title: "Question 2",
    type: "practice",
    mode: "practice",
    description: "Think about what determines a unique shape.",
    data: {
      question:
        "If two V-shapes have same arm lengths but different angles ∠ABC, are they congruent?",
      options: [
        "Yes, because the arm lengths match",
        "No, because the included angle must also be equal",
        "Yes, if we rotate one of them",
        "Cannot be determined",
      ],
      correct: 1,
      explanation:
        "Same arm lengths with different included angles produce different (non-congruent) figures.",
    } as QuestionData,
  },
  {
    id: 12,
    title: "Question 3",
    type: "practice",
    mode: "practice",
    description: "What transformations are allowed?",
    data: {
      question: "Which is allowed when checking congruence?",
      options: [
        "Stretching the figure",
        "Cutting the figure into parts",
        "Rotating or flipping the figure",
        "Changing the measurements",
      ],
      correct: 2,
      explanation:
        "You may rotate or flip a figure before superimposing, but cannot stretch or alter it.",
    } as QuestionData,
  },
  {
    id: 13,
    title: "Question 4",
    type: "practice",
    mode: "practice",
    description: "What measurements do we need?",
    data: {
      question:
        "To recreate the signboard symbol exactly, which measurements are needed?",
      options: [
        "Only the arm length AB",
        "Only the angle ∠ABC",
        "Both arm lengths AB, BC and the included angle ∠ABC",
        "The colour of the symbol",
      ],
      correct: 2,
      explanation:
        "You need both arm lengths and the included angle to uniquely determine the figure.",
    } as QuestionData,
  },
  {
    id: 14,
    title: "Question 5",
    type: "practice",
    mode: "practice",
    description: "Apply what you've learned.",
    data: {
      question:
        "Two symbols have AB = 4 cm, BC = 8 cm, and ∠ABC = 80°. What can you say?",
      options: [
        "They may or may not be congruent",
        "They are definitely congruent",
        "They are similar but not congruent",
        "More information is needed",
      ],
      correct: 1,
      explanation:
        "When both arm lengths and the included angle are equal, the figures are congruent.",
    } as QuestionData,
  },
];

// ==================== SVG DIAGRAM HELPERS ====================

const AngleArc: React.FC<{
  cx: number;
  cy: number;
  startAngle: number;
  endAngle: number;
  radius?: number;
  color?: string;
}> = ({ cx, cy, startAngle, endAngle, radius = 20, color = T.accent }) => {
  const s = (Math.PI / 180) * startAngle;
  const e = (Math.PI / 180) * endAngle;
  const x1 = cx + radius * Math.cos(s),
    y1 = cy - radius * Math.sin(s);
  const x2 = cx + radius * Math.cos(e),
    y2 = cy - radius * Math.sin(e);
  const sweep = endAngle - startAngle <= 180 ? 0 : 1;
  return (
    <path
      d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${sweep} 0 ${x2} ${y2}`}
      stroke={color}
      strokeWidth={2.5}
      fill="none"
    />
  );
};

const AngleLabel: React.FC<{
  cx: number;
  cy: number;
  startAngle: number;
  endAngle: number;
  radius?: number;
  label: string;
  color?: string;
  fontSize?: number;
}> = ({
  cx,
  cy,
  startAngle,
  endAngle,
  radius = 32,
  label,
  color = T.accent,
  fontSize = 12,
}) => {
  const mid = ((startAngle + endAngle) / 2) * (Math.PI / 180);
  return (
    <text
      x={cx + radius * Math.cos(mid)}
      y={cy - radius * Math.sin(mid)}
      textAnchor="middle"
      dominantBaseline="middle"
      fill={color}
      fontSize={fontSize}
      fontWeight="700"
      fontFamily={T.font}
    >
      {label}
    </text>
  );
};

// ==================== DIAGRAM COMPONENTS ====================

const DiagramSymbol: React.FC<{ phase: number }> = ({ phase }) => (
  <svg
    viewBox="0 0 260 160"
    style={{
      width: "100%",
      maxWidth: 280,
      height: "auto",
      opacity: Math.min(phase * 2, 1),
      transform: `scale(${0.8 + 0.2 * easeOutCubic(Math.min(phase, 1))})`,
      transition: "all 0.6s",
    }}
  >
    <line x1="40" y1="30" x2="100" y2="130" stroke={T.dark} strokeWidth={2.5} />
    <line
      x1="100"
      y1="130"
      x2="220"
      y2="30"
      stroke={T.dark}
      strokeWidth={2.5}
    />
    <AngleArc
      cx={100}
      cy={130}
      startAngle={57}
      endAngle={123}
      radius={22}
      color={T.accent}
    />
    <AngleLabel
      cx={100}
      cy={130}
      startAngle={57}
      endAngle={123}
      radius={38}
      label="∠ABC"
      color={T.accent}
      fontSize={11}
    />
    <circle cx={40} cy={30} r={4} fill={T.primary} />
    <circle cx={100} cy={130} r={4} fill={T.primary} />
    <circle cx={220} cy={30} r={4} fill={T.primary} />
    <text
      x={26}
      y={22}
      fontSize={14}
      fill={T.dark}
      fontWeight="700"
      fontFamily={T.font}
    >
      A
    </text>
    <text
      x={94}
      y={152}
      fontSize={14}
      fill={T.dark}
      fontWeight="700"
      fontFamily={T.font}
    >
      B
    </text>
    <text
      x={226}
      y={22}
      fontSize={14}
      fill={T.dark}
      fontWeight="700"
      fontFamily={T.font}
    >
      C
    </text>
  </svg>
);

const DiagramMultipleAngles: React.FC<{ phase: number }> = ({ phase }) => {
  const cfgs = [
    { ax: 20, ay: 20, bx: 50, by: 90, cx: 110, cy: 20 },
    { ax: 140, ay: 50, bx: 160, by: 90, cx: 210, cy: 20 },
    { ax: 240, ay: 70, bx: 260, by: 90, cx: 290, cy: 30 },
  ];
  return (
    <svg
      viewBox="0 0 330 110"
      style={{ width: "100%", maxWidth: 340, height: "auto" }}
    >
      {cfgs.map((c, i) => (
        <g
          key={i}
          style={{
            opacity: Math.min(Math.max((phase - i * 0.2) * 3, 0), 1),
            transition: "opacity 0.5s",
          }}
        >
          <line
            x1={c.ax}
            y1={c.ay}
            x2={c.bx}
            y2={c.by}
            stroke={T.dark}
            strokeWidth={2}
          />
          <line
            x1={c.bx}
            y1={c.by}
            x2={c.cx}
            y2={c.cy}
            stroke={T.dark}
            strokeWidth={2}
          />
          <circle cx={c.ax} cy={c.ay} r={3} fill={T.accent} />
          <circle cx={c.bx} cy={c.by} r={3} fill={T.accent} />
          <circle cx={c.cx} cy={c.cy} r={3} fill={T.accent} />
          <text
            x={c.ax - 6}
            y={c.ay - 7}
            fontSize={10}
            fill={T.dark}
            fontWeight="700"
            fontFamily={T.font}
          >
            A
          </text>
          <text
            x={c.bx - 4}
            y={c.by + 15}
            fontSize={10}
            fill={T.dark}
            fontWeight="700"
            fontFamily={T.font}
          >
            B
          </text>
          <text
            x={c.cx + 5}
            y={c.cy - 5}
            fontSize={10}
            fill={T.dark}
            fontWeight="700"
            fontFamily={T.font}
          >
            C
          </text>
        </g>
      ))}
      <text
        x={165}
        y={108}
        textAnchor="middle"
        fontSize={10}
        fill={T.textLight}
        fontStyle="italic"
        fontFamily={T.font}
      >
        Same AB & BC, different ∠ABC
      </text>
    </svg>
  );
};

const AngleExplorer: React.FC<{
  angle: number;
  onAngleChange: (v: number) => void;
}> = ({ angle, onAngleChange }) => {
  const bx = 150,
    by = 150,
    armA = 70,
    armC = 130;
  const half = angle / 2;
  const axR = (Math.PI / 180) * (90 + half),
    cxR = (Math.PI / 180) * (90 - half);
  const ax = bx + armA * Math.cos(axR),
    ay = by - armA * Math.sin(axR);
  const cx = bx + armC * Math.cos(cxR),
    cy = by - armC * Math.sin(cxR);
  return (
    <div>
      <svg
        viewBox="0 0 300 180"
        style={{ width: "100%", maxWidth: 320, height: "auto" }}
      >
        <line
          x1={ax}
          y1={ay}
          x2={bx}
          y2={by}
          stroke={T.dark}
          strokeWidth={2.5}
        />
        <line
          x1={bx}
          y1={by}
          x2={cx}
          y2={cy}
          stroke={T.dark}
          strokeWidth={2.5}
        />
        <AngleArc
          cx={bx}
          cy={by}
          startAngle={90 - half}
          endAngle={90 + half}
          radius={24}
          color={T.accent}
        />
        <AngleLabel
          cx={bx}
          cy={by}
          startAngle={90 - half}
          endAngle={90 + half}
          radius={42}
          label={`${angle}°`}
          color={T.accent}
          fontSize={12}
        />
        <circle cx={ax} cy={ay} r={4} fill={T.primary} />
        <circle cx={bx} cy={by} r={4} fill={T.primary} />
        <circle cx={cx} cy={cy} r={4} fill={T.primary} />
        <text
          x={ax - 14}
          y={ay - 6}
          fontSize={13}
          fill={T.dark}
          fontWeight="700"
          fontFamily={T.font}
        >
          A
        </text>
        <text
          x={bx - 4}
          y={by + 20}
          fontSize={13}
          fill={T.dark}
          fontWeight="700"
          fontFamily={T.font}
        >
          B
        </text>
        <text
          x={cx + 8}
          y={cy - 4}
          fontSize={13}
          fill={T.dark}
          fontWeight="700"
          fontFamily={T.font}
        >
          C
        </text>
      </svg>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 8px",
        }}
      >
        <span style={{ fontSize: 11, color: T.textLight, fontFamily: T.font }}>
          20°
        </span>
        <input
          type="range"
          min={20}
          max={170}
          value={angle}
          onChange={(e) => onAngleChange(+e.target.value)}
          style={{ flex: 1, accentColor: T.accent }}
        />
        <span style={{ fontSize: 11, color: T.textLight, fontFamily: T.font }}>
          170°
        </span>
      </div>
    </div>
  );
};

const DiagramFlip: React.FC<{ phase: number }> = ({ phase }) => (
  <svg
    viewBox="0 0 300 100"
    style={{ width: "100%", maxWidth: 320, height: "auto" }}
  >
    <polygon
      points="30,80 80,20 100,80"
      fill={T.lavender + "55"}
      stroke={T.primary}
      strokeWidth={2}
      style={{ opacity: Math.min(phase * 3, 1) }}
    />
    <text
      x={65}
      y={95}
      textAnchor="middle"
      fontSize={10}
      fill={T.text}
      fontFamily={T.font}
    >
      Original
    </text>
    <polygon
      points="140,80 190,20 210,80"
      fill={T.peach}
      stroke={T.warm}
      strokeWidth={2}
      transform="rotate(15, 175, 50)"
      style={{ opacity: Math.min(Math.max((phase - 0.3) * 3, 0), 1) }}
    />
    <text
      x={175}
      y={95}
      textAnchor="middle"
      fontSize={10}
      fill={T.text}
      fontFamily={T.font}
    >
      Rotated
    </text>
    <polygon
      points="250,80 270,20 300,80"
      fill={T.lavender + "55"}
      stroke={T.primary}
      strokeWidth={2}
      transform="scale(-1,1) translate(-550,0)"
      style={{ opacity: Math.min(Math.max((phase - 0.6) * 3, 0), 1) }}
    />
    <text
      x={270}
      y={95}
      textAnchor="middle"
      fontSize={10}
      fill={T.text}
      fontFamily={T.font}
    >
      Flipped
    </text>
  </svg>
);

const DiagramCongruent: React.FC<{ phase: number }> = ({ phase }) => (
  <svg
    viewBox="0 0 340 140"
    style={{ width: "100%", maxWidth: 360, height: "auto" }}
  >
    <g style={{ opacity: Math.min(phase * 2, 1) }}>
      <line
        x1="30"
        y1="20"
        x2="80"
        y2="110"
        stroke={T.primary}
        strokeWidth={2.5}
      />
      <line
        x1="80"
        y1="110"
        x2="160"
        y2="20"
        stroke={T.primary}
        strokeWidth={2.5}
      />
      <AngleArc
        cx={80}
        cy={110}
        startAngle={57}
        endAngle={123}
        radius={18}
        color={T.accent}
      />
      <AngleLabel
        cx={80}
        cy={110}
        startAngle={57}
        endAngle={123}
        radius={30}
        label="80°"
        color={T.accent}
        fontSize={10}
      />
      <text
        x={18}
        y={16}
        fontSize={11}
        fill={T.dark}
        fontWeight="700"
        fontFamily={T.font}
      >
        A
      </text>
      <text
        x={74}
        y={130}
        fontSize={11}
        fill={T.dark}
        fontWeight="700"
        fontFamily={T.font}
      >
        B
      </text>
      <text
        x={162}
        y={16}
        fontSize={11}
        fill={T.dark}
        fontWeight="700"
        fontFamily={T.font}
      >
        C
      </text>
      <text x={38} y={70} fontSize={9} fill={T.textLight} fontFamily={T.font}>
        4 cm
      </text>
      <text x={118} y={60} fontSize={9} fill={T.textLight} fontFamily={T.font}>
        8 cm
      </text>
    </g>
    <text
      x={180}
      y={70}
      fontSize={22}
      fill={T.accent}
      fontWeight="700"
      fontFamily={T.font}
      style={{ opacity: Math.min(Math.max((phase - 0.4) * 4, 0), 1) }}
    >
      ≅
    </text>
    <g style={{ opacity: Math.min(Math.max((phase - 0.5) * 2, 0), 1) }}>
      <line
        x1="210"
        y1="20"
        x2="260"
        y2="110"
        stroke={T.primary}
        strokeWidth={2.5}
      />
      <line
        x1="260"
        y1="110"
        x2="340"
        y2="20"
        stroke={T.primary}
        strokeWidth={2.5}
      />
      <AngleArc
        cx={260}
        cy={110}
        startAngle={57}
        endAngle={123}
        radius={18}
        color={T.accent}
      />
      <AngleLabel
        cx={260}
        cy={110}
        startAngle={57}
        endAngle={123}
        radius={30}
        label="80°"
        color={T.accent}
        fontSize={10}
      />
      <text
        x={198}
        y={16}
        fontSize={11}
        fill={T.dark}
        fontWeight="700"
        fontFamily={T.font}
      >
        A
      </text>
      <text
        x={254}
        y={130}
        fontSize={11}
        fill={T.dark}
        fontWeight="700"
        fontFamily={T.font}
      >
        B
      </text>
      <text
        x={342}
        y={16}
        fontSize={11}
        fill={T.dark}
        fontWeight="700"
        fontFamily={T.font}
      >
        C
      </text>
      <text x={218} y={70} fontSize={9} fill={T.textLight} fontFamily={T.font}>
        4 cm
      </text>
      <text x={298} y={60} fontSize={9} fill={T.textLight} fontFamily={T.font}>
        8 cm
      </text>
    </g>
  </svg>
);

// ==================== MAIN COMPONENT ====================

const GeometricTwinsTool: React.FC<GeometricTwinsToolProps> = ({
  props: propsIn,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const props = (propsIn ?? {}) as ResolvedProps;
  // CONFIG
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: props.initialMode ?? ("learn" as ModeType),
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: props.enabledModes ?? (["learn", "practice"] as ModeType[]),
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      initialStep: props.initialStep ?? 1,
      filterSteps: props.filterSteps ?? null,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration:
        props.autoPlayDuration ?? props.data?.autoPlayDuration ?? 0,
      themeColor: props.themeColor ?? T.primary,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const additionalProps = props.additionalProps || {};
  const geoConfig = useMemo(
    () => ({
      armLengthAB: additionalProps.armLengthAB ?? 4,
      armLengthBC: additionalProps.armLengthBC ?? 8,
      angleDeg: additionalProps.angleDeg ?? 80,
      diagramColor: additionalProps.diagramColor ?? T.dark,
      accentColor: additionalProps.accentColor ?? T.accent,
    }),
    [additionalProps],
  );

  // STATE
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
  const [isPlaying, setIsPlaying] = useState(
    !stopAutoNext && config.autoPlayDuration > 0,
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [contentTransform, setContentTransform] = useState("translateY(0)");
  const [animPhase, setAnimPhase] = useState(0);
  const [interactiveAngle, setInteractiveAngle] = useState(geoConfig.angleDeg);
  const [buttonStates, setButtonStates] = useState<{
    [key: string]: "idle" | "hover" | "active";
  }>({});

  // Practice state
  const [practiceAnswers, setPracticeAnswers] = useState<(number | null)[]>(
    Array(5).fill(null),
  );
  const [practiceSubmitted, setPracticeSubmitted] = useState<boolean[]>(
    Array(5).fill(false),
  );

  const filteredSteps = useMemo(
    () => availableSteps.filter((s) => s.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const currentStep = filteredSteps[currentStepIndex] || filteredSteps[0];
  const animRef = useRef<number>();

  // INJECT KEYFRAMES
  useEffect(() => {
    const kf = `
      @keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
      @keyframes fadeOutDown { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-30px); } }
      @keyframes popIn { 0% { transform:scale(0); opacity:0; } 70% { transform:scale(1.15); } 100% { transform:scale(1); opacity:1; } }
      @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.06); } }
      @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
      @keyframes slideRight { from { transform:translateX(-40px); opacity:0; } to { transform:translateX(0); opacity:1; } }
      @keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
      @keyframes glow { 0%,100% { box-shadow:0 0 5px ${T.primary}40; } 50% { box-shadow:0 0 20px ${T.primary}80; } }
      @keyframes highlight { 0% { background:${T.primary}; transform:scale(1.2); } 100% { background:${T.primary}30; transform:scale(1); } }
    `;
    const el = document.createElement("style");
    el.id = "geo-twins-kf";
    el.textContent = kf;
    document.head.appendChild(el);
    return () => {
      const x = document.getElementById("geo-twins-kf");
      if (x) document.head.removeChild(x);
    };
  }, []);

  // ENTRY ANIMATION
  useEffect(() => {
    setAnimPhase(0);
    let start: number | null = null;
    const dur = 1500 / config.animationSpeed;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setAnimPhase(easeOutCubic(p));
      if (p < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [currentStep, config.animationSpeed]);

  // STEP DETAILS CALLBACK
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

  // AUTO-ADVANCE
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

  // NAVIGATION
  const animateStepChange = useCallback(
    (dir: "next" | "prev") => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setContentOpacity(0);
      setContentTransform(
        dir === "next" ? "translateY(-30px)" : "translateY(30px)",
      );
      setTimeout(() => {
        setCurrentStepIndex((prev) =>
          dir === "next"
            ? Math.min(prev + 1, filteredSteps.length - 1)
            : Math.max(prev - 1, 0),
        );
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
    [isTransitioning, filteredSteps.length],
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
      setTimeout(() => {
        setContentOpacity(1);
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handleBtn = (id: string, state: "idle" | "hover" | "active") =>
    setButtonStates((p) => ({ ...p, [id]: state }));
  const getBtnScale = (id: string) => {
    const s = buttonStates[id] || "idle";
    return s === "active"
      ? "scale(0.93)"
      : s === "hover"
        ? "scale(1.05)"
        : "scale(1)";
  };

  // PRACTICE HANDLER
  const handleAnswer = (qi: number, oi: number) => {
    if (practiceSubmitted[qi]) return;
    const a = [...practiceAnswers];
    a[qi] = oi;
    setPracticeAnswers(a);
    const s = [...practiceSubmitted];
    s[qi] = true;
    setPracticeSubmitted(s);
  };

  // Get practice question index from step
  const practiceIndex =
    selectedMode === "practice"
      ? filteredSteps.findIndex((s) => s.id === currentStep?.id)
      : -1;

  // ────── RESPONSIVE ──────
  const { w: winW } = useWindowSize();
  const bp = getBreakpoint(winW);
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";
  const r = {
    headerPad: isMobile
      ? "20px 14px 16px"
      : isTablet
        ? "24px 18px 18px"
        : "28px 24px 20px",
    titleSize: isMobile ? 18 : isTablet ? 21 : 24,
    modeBtnPad: isMobile ? "7px 14px" : "9px 24px",
    modeBtnFont: isMobile ? 11 : 13,
    contentPad: isMobile ? "16px 10px" : isTablet ? "20px 16px" : "24px 20px",
    cardPad: isMobile ? "16px 14px" : isTablet ? "20px 18px" : "24px 22px",
    cardRadius: isMobile ? 16 : T.radius,
    stepNumSize: isMobile ? 28 : 34,
    stepNumFont: isMobile ? 13 : 15,
    sectionTitleFont: isMobile ? 14 : isTablet ? 15.5 : 17,
    bodyFont: isMobile ? 12.5 : 13.5,
    defTermFont: isMobile ? 12.5 : 14,
    defBodyFont: isMobile ? 11.5 : 12.5,
    defPad: isMobile ? "12px 14px" : "14px 18px",
    navPad: isMobile ? "12px 10px" : "16px 24px",
    navBtnPad: isMobile ? "8px 14px" : "10px 24px",
    navBtnFont: isMobile ? 11 : 13,
    optionPad: isMobile ? "10px 12px" : "12px 16px",
    optionFont: isMobile ? 12.5 : 13.5,
    outerRadius: isMobile ? 16 : T.radius,
  };
  const gradPrimary = `linear-gradient(135deg, ${T.dark} 0%, ${T.primary} 50%, ${T.warm} 100%)`;
  const gradAccent = `linear-gradient(135deg, ${T.accent} 0%, ${T.warm} 100%)`;

  const modeIcons: Record<ModeType, React.ReactNode> = {
    learn: <BookOpen size={isMobile ? 14 : 16} />,
    practice: <Target size={isMobile ? 14 : 16} />,
  };

  // ────── RENDER DIAGRAM ──────
  const renderDiagram = () => {
    if (!currentStep?.data?.diagram) return null;
    switch (currentStep.data.diagram) {
      case "symbol":
        return <DiagramSymbol phase={animPhase} />;
      case "multipleAngles":
        return <DiagramMultipleAngles phase={animPhase} />;
      case "angleExplorer":
        return (
          <AngleExplorer
            angle={interactiveAngle}
            onAngleChange={setInteractiveAngle}
          />
        );
      case "flip":
        return <DiagramFlip phase={animPhase} />;
      case "congruent":
        return <DiagramCongruent phase={animPhase} />;
      case "summary":
        return null;
      default:
        return null;
    }
  };

  // ────── RENDER DEFINITIONS ──────
  const renderDefinitions = () => {
    const defs: DefinitionItem[] = currentStep?.data?.definitions;
    if (!defs || defs.length === 0) return null;
    return (
      <div style={{ marginTop: 16 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: T.primary,
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 20,
              height: 2,
              background: T.primary,
              display: "inline-block",
              borderRadius: 2,
            }}
          />
          Definitions
          <span
            style={{
              width: 20,
              height: 2,
              background: T.primary,
              display: "inline-block",
              borderRadius: 2,
            }}
          />
        </div>
        {defs.map((def, i) => (
          <div
            key={i}
            style={{
              background: `linear-gradient(135deg, ${T.dark} 0%, ${T.primary} 100%)`,
              color: T.white,
              borderRadius: T.radiusSm,
              padding: r.defPad,
              margin: "10px 0",
              boxShadow: "0 4px 16px #4A4DC922",
              animation: `fadeInUp 0.5s ease-out ${i * 0.15}s both`,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: r.defTermFont,
                fontFamily: T.font,
              }}
            >
              {def.term}
            </div>
            <div
              style={{
                fontSize: r.defBodyFont,
                marginTop: 5,
                opacity: 0.92,
                lineHeight: 1.6,
                fontFamily: T.font,
              }}
            >
              {def.definition}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ────── RENDER PRACTICE ──────
  const renderPractice = () => {
    const qData = currentStep?.data as QuestionData | undefined;
    if (!qData?.question) return null;
    const qi = practiceIndex;
    const wasSubmitted = practiceSubmitted[qi];
    const isCorrect = practiceAnswers[qi] === qData.correct;

    return (
      <div>
        <div
          style={{
            fontWeight: 700,
            fontSize: isMobile ? 13.5 : 15,
            color: T.dark,
            marginBottom: isMobile ? 12 : 16,
            fontFamily: T.font,
            lineHeight: 1.5,
          }}
        >
          {qData.question}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {qData.options.map((opt, oi) => {
            const sel = practiceAnswers[qi] === oi;
            const isThisCorrect = oi === qData.correct;
            let bg = T.grayBg,
              border = `2px solid ${T.grayLight}`,
              col = T.text;
            if (wasSubmitted) {
              if (isThisCorrect) {
                bg = "#E8F8EF";
                border = `2px solid ${T.success}`;
                col = "#1A7D4B";
              } else if (sel) {
                bg = "#FDE8E8";
                border = `2px solid ${T.error}`;
                col = "#A12B2B";
              }
            }
            return (
              <button
                key={oi}
                onClick={() => handleAnswer(qi, oi)}
                style={{
                  background: bg,
                  border,
                  borderRadius: T.radiusSm,
                  padding: r.optionPad,
                  textAlign: "left",
                  cursor: wasSubmitted ? "default" : "pointer",
                  fontSize: r.optionFont,
                  color: col,
                  fontFamily: T.font,
                  fontWeight: sel ? 600 : 400,
                  transition: "all 0.25s",
                  outline: "none",
                  animation: `slideRight 0.4s ease-out ${oi * 0.08}s both`,
                }}
              >
                <span
                  style={{ fontWeight: 700, marginRight: 10, opacity: 0.4 }}
                >
                  {String.fromCharCode(65 + oi)}.
                </span>
                {opt}
                {wasSubmitted && isThisCorrect && (
                  <span
                    style={{
                      float: "right",
                      color: T.success,
                      fontWeight: 800,
                    }}
                  >
                    <Check size={16} />
                  </span>
                )}
                {wasSubmitted && sel && !isThisCorrect && (
                  <span
                    style={{ float: "right", color: T.error, fontWeight: 800 }}
                  >
                    <XIcon size={16} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {wasSubmitted && !isCorrect && (
          <div
            style={{
              marginTop: isMobile ? 10 : 14,
              padding: isMobile ? "10px 12px" : "12px 16px",
              borderRadius: T.radiusXs,
              background: T.peach,
              color: T.text,
              fontSize: isMobile ? 11.5 : 12.5,
              lineHeight: 1.6,
              fontFamily: T.font,
              animation: "fadeInUp 0.4s ease-out",
            }}
          >
            <strong style={{ color: T.accent }}>Correct:</strong>{" "}
            {String.fromCharCode(65 + qData.correct)}.{" "}
            {qData.options[qData.correct]}
            <br />
            {qData.explanation}
          </div>
        )}
        {wasSubmitted && isCorrect && (
          <div
            style={{
              marginTop: isMobile ? 10 : 14,
              padding: isMobile ? "10px 12px" : "12px 16px",
              borderRadius: T.radiusXs,
              background: "#E8F8EF",
              color: "#1A7D4B",
              fontSize: isMobile ? 11.5 : 12.5,
              lineHeight: 1.6,
              fontFamily: T.font,
              animation: "fadeInUp 0.4s ease-out",
            }}
          >
            <Check
              size={14}
              style={{ verticalAlign: "middle", marginRight: 6 }}
            />
            {qData.explanation}
          </div>
        )}
      </div>
    );
  };

  // ────── MAIN RENDER ──────
  return (
    <div
      style={{
        width: "100%",
        maxWidth: config.width,
        minHeight: isMobile ? "auto" : config.height,
        background: T.grayBg,
        fontFamily: T.font,
        borderRadius: r.outerRadius,
        overflow: "hidden",
        boxShadow: isMobile
          ? "0 4px 20px rgba(0,0,0,0.1)"
          : "0 25px 50px -12px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* HEADER */}
      <div
        style={{
          background: gradPrimary,
          padding: r.headerPad,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: isMobile ? 80 : 120,
            height: isMobile ? 80 : 120,
            borderRadius: "50%",
            background: "#ffffff11",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: -20,
            width: isMobile ? 50 : 80,
            height: isMobile ? 50 : 80,
            borderRadius: "50%",
            background: "#ffffff08",
          }}
        />
        <div
          style={{
            fontSize: r.titleSize,
            fontWeight: 800,
            color: T.white,
            letterSpacing: 0.5,
            position: "relative",
            animation: "fadeInUp 0.6s ease-out",
          }}
        >
          Geometric Twins
        </div>

        {/* MODE SELECTOR */}
        {config.showModeSelector && (
          <div
            style={{
              display: "inline-flex",
              marginTop: 16,
              borderRadius: 40,
              background: "#ffffff22",
              padding: 3,
              position: "relative",
            }}
          >
            {config.enabledModes.map((m) => (
              <button
                key={m}
                onClick={() => changeMode(m)}
                onMouseEnter={() => handleBtn(`mode-${m}`, "hover")}
                onMouseLeave={() => handleBtn(`mode-${m}`, "idle")}
                onMouseDown={() => handleBtn(`mode-${m}`, "active")}
                onMouseUp={() => handleBtn(`mode-${m}`, "hover")}
                style={{
                  padding: r.modeBtnPad,
                  fontSize: r.modeBtnFont,
                  fontWeight: 700,
                  fontFamily: T.font,
                  background: selectedMode === m ? T.white : "transparent",
                  color: selectedMode === m ? T.dark : "#ffffffcc",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: 40,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  letterSpacing: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transform: getBtnScale(`mode-${m}`),
                  boxShadow:
                    selectedMode === m ? "0 4px 12px #00000022" : "none",
                }}
              >
                {modeIcons[m]} {m === "learn" ? "Learn" : "Practice"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: r.contentPad, overflow: "auto" }}>
        <div
          style={{
            opacity: contentOpacity,
            transform: contentTransform,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* STEP INDICATOR */}
          {config.showStepIndicator && (
            <div
              style={{
                textAlign: "center",
                marginBottom: isMobile ? 8 : 12,
                fontSize: isMobile ? 10 : 11,
                color: T.textLight,
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              STEP {currentStepIndex + 1} OF {filteredSteps.length}
            </div>
          )}

          {/* CARD */}
          <div
            style={{
              background: T.white,
              borderRadius: r.cardRadius,
              padding: r.cardPad,
              boxShadow: "0 4px 20px #4A4DC90A",
              border: `1px solid ${T.grayLight}`,
              marginBottom: 20,
            }}
          >
            {/* Title */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 8 : 12,
                marginBottom: isMobile ? 8 : 12,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: r.stepNumSize,
                  height: r.stepNumSize,
                  borderRadius: "50%",
                  background: gradAccent,
                  color: T.white,
                  fontWeight: 800,
                  fontSize: r.stepNumFont,
                  flexShrink: 0,
                  boxShadow: "0 3px 10px #FF721233",
                  animation: "popIn 0.5s ease-out",
                }}
              >
                {currentStepIndex + 1}
              </span>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: r.sectionTitleFont,
                  color: T.dark,
                }}
              >
                {currentStep?.title}
              </span>
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: r.bodyFont,
                color: T.text,
                lineHeight: 1.75,
                marginBottom: 16,
              }}
            >
              {currentStep?.description}
            </div>

            {/* LEARN CONTENT */}
            {selectedMode === "learn" && (
              <>
                {currentStep?.data?.diagram === "summary" ? (
                  <div
                    style={{
                      padding: "16px 18px",
                      borderRadius: T.radiusSm,
                      background: T.peach,
                      border: `2px solid ${T.warm}`,
                    }}
                  >
                    <div
                      style={{ fontSize: 13, color: T.text, lineHeight: 1.7 }}
                    >
                      To recreate or verify a figure, knowing just the arm
                      lengths is <strong>not enough</strong>. You must also know
                      the{" "}
                      <strong style={{ color: T.accent }}>
                        included angle
                      </strong>
                      . Same arm lengths + same included angle ={" "}
                      <strong style={{ color: T.primary }}>congruent</strong>.
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {renderDiagram()}
                  </div>
                )}
                {renderDefinitions()}
              </>
            )}

            {/* PRACTICE CONTENT */}
            {selectedMode === "practice" && renderPractice()}
          </div>
        </div>
      </div>

      {/* FOOTER / NAVIGATION */}
      {config.showNavigation && (
        <div
          style={{
            padding: r.navPad,
            borderTop: `1px solid ${T.grayLight}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: T.white,
            gap: isMobile ? 8 : 0,
          }}
        >
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            onMouseEnter={() => handleBtn("prev", "hover")}
            onMouseLeave={() => handleBtn("prev", "idle")}
            onMouseDown={() => handleBtn("prev", "active")}
            onMouseUp={() => handleBtn("prev", "hover")}
            style={{
              padding: r.navBtnPad,
              borderRadius: 40,
              border: "none",
              fontWeight: 600,
              fontSize: r.navBtnFont,
              fontFamily: T.font,
              cursor: currentStepIndex === 0 ? "default" : "pointer",
              background: currentStepIndex === 0 ? T.grayLight : T.primary,
              color: currentStepIndex === 0 ? T.gray : T.white,
              opacity: currentStepIndex === 0 ? 0.5 : 1,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: getBtnScale("prev"),
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: currentStepIndex > 0 ? "0 4px 14px #4A4DC933" : "none",
            }}
          >
            <ChevronLeft size={16} /> Prev
          </button>

          {config.showPlayPause && config.autoPlayDuration > 0 && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              onMouseEnter={() => handleBtn("play", "hover")}
              onMouseLeave={() => handleBtn("play", "idle")}
              style={{
                width: isMobile ? 34 : 40,
                height: isMobile ? 34 : 40,
                borderRadius: "50%",
                border: `2px solid ${T.primary}`,
                background: "transparent",
                color: T.primary,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s",
                transform: getBtnScale("play"),
              }}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
          )}

          <button
            onClick={nextStep}
            disabled={currentStepIndex >= filteredSteps.length - 1}
            onMouseEnter={() => handleBtn("next", "hover")}
            onMouseLeave={() => handleBtn("next", "idle")}
            onMouseDown={() => handleBtn("next", "active")}
            onMouseUp={() => handleBtn("next", "hover")}
            style={{
              padding: r.navBtnPad,
              borderRadius: 40,
              border: "none",
              fontWeight: 600,
              fontSize: r.navBtnFont,
              fontFamily: T.font,
              cursor:
                currentStepIndex >= filteredSteps.length - 1
                  ? "default"
                  : "pointer",
              background:
                currentStepIndex >= filteredSteps.length - 1
                  ? T.grayLight
                  : gradAccent,
              color:
                currentStepIndex >= filteredSteps.length - 1 ? T.gray : T.white,
              opacity: currentStepIndex >= filteredSteps.length - 1 ? 0.5 : 1,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: getBtnScale("next"),
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow:
                currentStepIndex < filteredSteps.length - 1
                  ? "0 4px 14px #FF721233"
                  : "none",
            }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default GeometricTwinsTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
