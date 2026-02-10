/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck — React types not resolved in this workspace; runtime unchanged.
import React, { useState, useEffect, useMemo, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS from Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════
const DS: {
  colors: {
    primary: string;
    accent: string;
    gradientStart: string;
    gradientEnd: string;
    lightPurple: string;
    lightOrange: string;
    dark: string;
    gray: string;
    lightGray: string;
    offWhite: string;
    white: string;
    deepPurple: string;
    midOrange: string;
    success: string;
    error: string;
    warning: string;
  };
  font: string;
  radius: { sm: string; md: string; lg: string; pill: string };
  shadow: { sm: string; md: string; lg: string; glow: string };
} = {
  colors: {
    primary: "#4A4DC9",
    accent: "#FF7212",
    gradientStart: "#533086",
    gradientEnd: "#FC9145",
    lightPurple: "#C1C1EA",
    lightOrange: "#FFF3E4",
    dark: "#4E4E4E",
    gray: "#CACACA",
    lightGray: "#EBEBEB",
    offWhite: "#F5F5F5",
    white: "#FFFFFF",
    deepPurple: "#533086",
    midOrange: "#FC9145",
    success: "#22C55E",
    error: "#EF4444",
    warning: "#F59E0B",
  },
  font: "'Poppins', sans-serif",
  radius: { sm: "8px", md: "12px", lg: "20px", pill: "999px" },
  shadow: {
    sm: "0 1px 3px rgba(74,77,201,0.08)",
    md: "0 4px 16px rgba(74,77,201,0.10)",
    lg: "0 12px 40px rgba(74,77,201,0.14)",
    glow: "0 0 24px rgba(74,77,201,0.18)",
  },
};

const gradient = `linear-gradient(135deg, ${DS.colors.gradientStart}, ${DS.colors.gradientEnd})`;
const subtleGradient = `linear-gradient(135deg, ${DS.colors.lightPurple}44, ${DS.colors.lightOrange}44)`;

// ═══════════════════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════════════════
const Icon = ({ d, size = 20, color = "currentColor", fill = "none" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {d}
  </svg>
);
const CheckIcon = (p) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </>
    }
  />
);
const XIcon = (p) => (
  <Icon
    {...p}
    d={
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </>
    }
  />
);
const ChevronRight = (p) => (
  <Icon {...p} d={<polyline points="9 18 15 12 9 6" />} />
);
const ChevronLeft = (p) => (
  <Icon {...p} d={<polyline points="15 18 9 12 15 6" />} />
);
const Bulb = (p) => (
  <Icon
    {...p}
    d={
      <>
        <line x1="9" y1="18" x2="15" y2="18" />
        <line x1="10" y1="22" x2="14" y2="22" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
      </>
    }
  />
);
const PlayBtn = (p) => (
  <Icon {...p} d={<polygon points="5 3 19 12 5 21 5 3" />} />
);
const PauseBtn = (p) => (
  <Icon
    {...p}
    d={
      <>
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
      </>
    }
  />
);
const ResetBtn = (p) => (
  <Icon
    {...p}
    d={
      <>
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </>
    }
  />
);

// ═══════════════════════════════════════════════════════════════════════════
// BUTTON COMPONENT (Singularity Design)
// ═══════════════════════════════════════════════════════════════════════════
const DSButton = ({
  children,
  variant = "contained",
  disabled = false,
  onClick,
  style = {},
  icon,
  highlight = false,
}: {
  children?: React.ReactNode;
  variant?: string;
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  highlight?: boolean;
  key?: React.Key;
}) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const base = {
    fontFamily: DS.font,
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "1",
    padding: "10px 24px",
    borderRadius: DS.radius.pill,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    border: "none",
    transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
    whiteSpace: "nowrap",
    opacity: disabled ? 0.5 : 1,
    outline: "none",
  };

  const variants = {
    contained: {
      background: highlight ? DS.colors.accent : DS.colors.primary,
      color: DS.colors.white,
      boxShadow: hovered ? DS.shadow.md : DS.shadow.sm,
      transform: pressed
        ? "scale(0.97)"
        : hovered
          ? "translateY(-1px)"
          : "none",
    },
    outlined: {
      background: "transparent",
      color: DS.colors.primary,
      border: `2px solid ${DS.colors.primary}`,
      boxShadow: hovered ? DS.shadow.sm : "none",
      transform: pressed ? "scale(0.97)" : "none",
    },
    text: {
      background: hovered ? DS.colors.lightPurple + "33" : "transparent",
      color: DS.colors.primary,
      border: "none",
      transform: pressed ? "scale(0.97)" : "none",
    },
    gradient: {
      background: gradient,
      color: DS.colors.white,
      boxShadow: hovered ? DS.shadow.lg : DS.shadow.md,
      transform: pressed
        ? "scale(0.97)"
        : hovered
          ? "translateY(-2px)"
          : "none",
    },
  };

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {icon && (
        <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      )}
      {children}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const DSCard = ({
  children,
  style = {},
  onClick,
  selected = false,
  hoverable = true,
}: {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  selected?: boolean;
  hoverable?: boolean;
  key?: React.Key;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        background: DS.colors.white,
        borderRadius: DS.radius.md,
        border: selected
          ? `2px solid ${DS.colors.primary}`
          : `1px solid ${DS.colors.lightGray}`,
        boxShadow: selected
          ? DS.shadow.glow
          : hovered && hoverable
            ? DS.shadow.md
            : DS.shadow.sm,
        transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
        transform: hovered && hoverable ? "translateY(-4px)" : "none",
        cursor: onClick ? "pointer" : "default",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// BADGE / CHIP
// ═══════════════════════════════════════════════════════════════════════════
const DSBadge = ({ children, color = "purple" }: { children?: React.ReactNode; color?: string }) => {
  const bg = color === "purple" ? DS.colors.lightPurple : DS.colors.lightOrange;
  const fg = color === "purple" ? DS.colors.deepPurple : DS.colors.accent;
  return (
    <span
      style={{
        fontFamily: DS.font,
        fontSize: "11px",
        fontWeight: 600,
        padding: "4px 12px",
        borderRadius: DS.radius.pill,
        background: bg,
        color: fg,
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// INJECT GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════════════════
const GlobalStyles = () => {
  useEffect(() => {
    const id = "singularity-circuit-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
      @keyframes sg-fadeIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
      @keyframes sg-scaleIn { from { opacity:0; transform:scale(0.92) } to { opacity:1; transform:scale(1) } }
      @keyframes sg-slideR { from { opacity:0; transform:translateX(16px) } to { opacity:1; transform:translateX(0) } }
      @keyframes sg-pulse { 0%,100% { transform:scale(1) } 50% { transform:scale(1.04) } }
      @keyframes sg-glow { 0%,100% { box-shadow:0 0 8px ${DS.colors.primary}30 } 50% { box-shadow:0 0 24px ${DS.colors.primary}50 } }
      @keyframes sg-flow { 0% { stroke-dashoffset: 20 } 100% { stroke-dashoffset: 0 } }
      @keyframes sg-float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-6px) } }
      .sg-stagger > * { animation: sg-fadeIn 0.5s ease-out both; }
      .sg-stagger > *:nth-child(1) { animation-delay: 0s }
      .sg-stagger > *:nth-child(2) { animation-delay: 0.08s }
      .sg-stagger > *:nth-child(3) { animation-delay: 0.16s }
      .sg-stagger > *:nth-child(4) { animation-delay: 0.24s }
      .sg-stagger > *:nth-child(5) { animation-delay: 0.32s }
      .sg-stagger > *:nth-child(6) { animation-delay: 0.40s }
      .sg-stagger > *:nth-child(7) { animation-delay: 0.48s }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);
  return null;
};

// ═══════════════════════════════════════════════════════════════════════════
// SVG CIRCUIT SYMBOLS (Redesigned with DS colors)
// ═══════════════════════════════════════════════════════════════════════════
const ElectricCellSVG = () => (
  <svg width="100%" height="60" viewBox="0 0 120 60">
    <line
      x1="10"
      y1="30"
      x2="40"
      y2="30"
      stroke={DS.colors.accent}
      strokeWidth="3"
    />
    <line
      x1="40"
      y1="18"
      x2="40"
      y2="42"
      stroke={DS.colors.dark}
      strokeWidth="4"
    />
    <line
      x1="80"
      y1="12"
      x2="80"
      y2="48"
      stroke={DS.colors.dark}
      strokeWidth="4"
    />
    <line
      x1="80"
      y1="30"
      x2="110"
      y2="30"
      stroke={DS.colors.accent}
      strokeWidth="3"
    />
    <text
      x="32"
      y="14"
      fontSize="12"
      fontWeight="700"
      fill={DS.colors.primary}
      fontFamily="Poppins"
    >
      −
    </text>
    <text
      x="76"
      y="10"
      fontSize="12"
      fontWeight="700"
      fill={DS.colors.accent}
      fontFamily="Poppins"
    >
      +
    </text>
  </svg>
);

const BatterySVG = () => (
  <svg width="100%" height="60" viewBox="0 0 140 60">
    <line
      x1="10"
      y1="30"
      x2="25"
      y2="30"
      stroke={DS.colors.accent}
      strokeWidth="3"
    />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <line
          x1={30 + i * 35}
          y1="20"
          x2={30 + i * 35}
          y2="40"
          stroke={DS.colors.dark}
          strokeWidth="3"
        />
        <line
          x1={50 + i * 35}
          y1="14"
          x2={50 + i * 35}
          y2="46"
          stroke={DS.colors.dark}
          strokeWidth="3"
        />
      </g>
    ))}
    <line
      x1="115"
      y1="30"
      x2="130"
      y2="30"
      stroke={DS.colors.accent}
      strokeWidth="3"
    />
    <text
      x="22"
      y="14"
      fontSize="11"
      fontWeight="700"
      fill={DS.colors.primary}
      fontFamily="Poppins"
    >
      −
    </text>
    <text
      x="112"
      y="14"
      fontSize="11"
      fontWeight="700"
      fill={DS.colors.accent}
      fontFamily="Poppins"
    >
      +
    </text>
  </svg>
);

const LampSVG = () => (
  <svg width="100%" height="70" viewBox="0 0 120 70">
    <line
      x1="10"
      y1="35"
      x2="30"
      y2="35"
      stroke={DS.colors.accent}
      strokeWidth="3"
    />
    <circle
      cx="60"
      cy="35"
      r="22"
      stroke={DS.colors.primary}
      strokeWidth="3"
      fill={DS.colors.lightPurple + "33"}
    />
    <line
      x1="46"
      y1="21"
      x2="74"
      y2="49"
      stroke={DS.colors.primary}
      strokeWidth="2"
    />
    <line
      x1="46"
      y1="49"
      x2="74"
      y2="21"
      stroke={DS.colors.primary}
      strokeWidth="2"
    />
    <line
      x1="90"
      y1="35"
      x2="110"
      y2="35"
      stroke={DS.colors.accent}
      strokeWidth="3"
    />
  </svg>
);

const LEDSVG = () => (
  <svg width="100%" height="70" viewBox="0 0 140 70">
    <line
      x1="10"
      y1="35"
      x2="40"
      y2="35"
      stroke={DS.colors.accent}
      strokeWidth="3"
    />
    <polygon
      points="40,20 40,50 70,35"
      stroke={DS.colors.primary}
      strokeWidth="3"
      fill={DS.colors.lightPurple + "44"}
    />
    <line
      x1="70"
      y1="20"
      x2="70"
      y2="50"
      stroke={DS.colors.primary}
      strokeWidth="3"
    />
    <line
      x1="70"
      y1="35"
      x2="100"
      y2="35"
      stroke={DS.colors.accent}
      strokeWidth="3"
    />
    <line
      x1="52"
      y1="16"
      x2="60"
      y2="6"
      stroke={DS.colors.accent}
      strokeWidth="2"
    />
    <polygon points="60,6 56,9 58,12" fill={DS.colors.accent} />
    <line
      x1="62"
      y1="16"
      x2="70"
      y2="6"
      stroke={DS.colors.accent}
      strokeWidth="2"
    />
    <polygon points="70,6 66,9 68,12" fill={DS.colors.accent} />
  </svg>
);

const SwitchOnSVG = () => (
  <svg width="100%" height="50" viewBox="0 0 120 50">
    <line
      x1="10"
      y1="25"
      x2="35"
      y2="25"
      stroke={DS.colors.accent}
      strokeWidth="3"
    />
    <circle cx="35" cy="25" r="4" fill={DS.colors.primary} />
    <line
      x1="35"
      y1="25"
      x2="85"
      y2="25"
      stroke={DS.colors.primary}
      strokeWidth="3"
    />
    <circle cx="85" cy="25" r="4" fill={DS.colors.primary} />
    <line
      x1="85"
      y1="25"
      x2="110"
      y2="25"
      stroke={DS.colors.accent}
      strokeWidth="3"
    />
    <text
      x="48"
      y="16"
      fontSize="10"
      fill={DS.colors.success}
      fontWeight="700"
      fontFamily="Poppins"
    >
      ON
    </text>
  </svg>
);

const SwitchOffSVG = () => (
  <svg width="100%" height="50" viewBox="0 0 120 50">
    <line
      x1="10"
      y1="30"
      x2="35"
      y2="30"
      stroke={DS.colors.accent}
      strokeWidth="3"
    />
    <circle cx="35" cy="30" r="4" fill={DS.colors.primary} />
    <line
      x1="35"
      y1="30"
      x2="78"
      y2="12"
      stroke={DS.colors.primary}
      strokeWidth="3"
    />
    <circle cx="85" cy="30" r="4" fill={DS.colors.primary} />
    <line
      x1="85"
      y1="30"
      x2="110"
      y2="30"
      stroke={DS.colors.accent}
      strokeWidth="3"
    />
    <text
      x="48"
      y="10"
      fontSize="10"
      fill={DS.colors.error}
      fontWeight="700"
      fontFamily="Poppins"
    >
      OFF
    </text>
  </svg>
);

const WireSVG = () => (
  <svg width="100%" height="30" viewBox="0 0 120 30">
    <line
      x1="10"
      y1="15"
      x2="110"
      y2="15"
      stroke={DS.colors.accent}
      strokeWidth="4"
    />
    <circle cx="10" cy="15" r="4" fill={DS.colors.primary} />
    <circle cx="110" cy="15" r="4" fill={DS.colors.primary} />
  </svg>
);

const symbolMap = {
  cell: ElectricCellSVG,
  battery: BatterySVG,
  lamp: LampSVG,
  led: LEDSVG,
  "switch-on": SwitchOnSVG,
  "switch-off": SwitchOffSVG,
  wire: WireSVG,
};

// ═══════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════
const electricalComponents = [
  {
    id: "cell",
    name: "Electric Cell",
    category: "Power Source",
    description:
      "A single cell provides electrical energy. The longer line is positive (+), the shorter is negative (−).",
    emoji: "🔋",
  },
  {
    id: "battery",
    name: "Battery",
    category: "Power Source",
    description:
      "Multiple cells connected together for more electrical energy. Longer line = positive, shorter = negative.",
    emoji: "🔋",
  },
  {
    id: "lamp",
    name: "Electric Lamp",
    category: "Output Device",
    description:
      "Converts electrical energy to light. Represented by a circle with an X inside.",
    emoji: "💡",
  },
  {
    id: "led",
    name: "LED",
    category: "Output Device",
    description:
      "A special light that only works in the correct direction. Shows arrows for light rays.",
    emoji: "💡",
  },
  {
    id: "switch-on",
    name: "Switch (ON)",
    category: "Control",
    description:
      "Closed switch allows electricity to flow through the circuit.",
    emoji: "🔘",
  },
  {
    id: "switch-off",
    name: "Switch (OFF)",
    category: "Control",
    description: "Open switch breaks the circuit and stops electricity flow.",
    emoji: "🔘",
  },
  {
    id: "wire",
    name: "Connecting Wire",
    category: "Conductor",
    description:
      "Wires connect components and allow electricity to flow through the circuit.",
    emoji: "⚡",
  },
];

const defaultQuestions = [
  {
    id: "p1",
    question:
      "Which circuit correctly shows a simple torch circuit with a cell and a lamp?",
    circuits: [
      {
        id: "p1a",
        isCorrect: true,
        svg: (
          <svg width="100%" viewBox="0 0 250 140">
            <line
              x1="40"
              y1="70"
              x2="65"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="65"
              y1="55"
              x2="65"
              y2="85"
              stroke={DS.colors.dark}
              strokeWidth="3.5"
            />
            <line
              x1="78"
              y1="60"
              x2="78"
              y2="80"
              stroke={DS.colors.dark}
              strokeWidth="2.5"
            />
            <line
              x1="78"
              y1="70"
              x2="108"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <circle
              cx="138"
              cy="70"
              r="20"
              stroke={DS.colors.primary}
              strokeWidth="2.5"
              fill={DS.colors.lightPurple + "33"}
            />
            <line
              x1="124"
              y1="56"
              x2="152"
              y2="84"
              stroke={DS.colors.primary}
              strokeWidth="2"
            />
            <line
              x1="152"
              y1="56"
              x2="124"
              y2="84"
              stroke={DS.colors.primary}
              strokeWidth="2"
            />
            <line
              x1="158"
              y1="70"
              x2="210"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="40"
              y1="70"
              x2="40"
              y2="110"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="40"
              y1="110"
              x2="210"
              y2="110"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="210"
              y1="110"
              x2="210"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <text
              x="60"
              y="48"
              fontSize="11"
              fill={DS.colors.accent}
              fontWeight="700"
              fontFamily="Poppins"
            >
              +
            </text>
            <text
              x="74"
              y="100"
              fontSize="11"
              fill={DS.colors.primary}
              fontWeight="700"
              fontFamily="Poppins"
            >
              −
            </text>
          </svg>
        ),
      },
      {
        id: "p1b",
        isCorrect: false,
        svg: (
          <svg width="100%" viewBox="0 0 250 140">
            <line
              x1="40"
              y1="70"
              x2="65"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="65"
              y1="55"
              x2="65"
              y2="85"
              stroke={DS.colors.dark}
              strokeWidth="3.5"
            />
            <line
              x1="78"
              y1="60"
              x2="78"
              y2="80"
              stroke={DS.colors.dark}
              strokeWidth="2.5"
            />
            <line
              x1="78"
              y1="70"
              x2="108"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <polygon
              points="112,70 142,55 142,85"
              stroke={DS.colors.dark}
              strokeWidth="2.5"
              fill="none"
            />
            <line
              x1="142"
              y1="70"
              x2="152"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="152"
              y1="55"
              x2="152"
              y2="85"
              stroke={DS.colors.dark}
              strokeWidth="2.5"
            />
            <line
              x1="152"
              y1="70"
              x2="210"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="40"
              y1="70"
              x2="40"
              y2="110"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="40"
              y1="110"
              x2="210"
              y2="110"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="210"
              y1="110"
              x2="210"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
          </svg>
        ),
      },
    ],
    correctAnswer: "p1a",
    explanation:
      "A simple torch circuit needs a cell (power source) and a lamp (circle with X). The first diagram correctly shows this.",
    hint: "Look for the lamp symbol — a circle with an X inside.",
  },
  {
    id: "p2",
    question:
      "Which circuit shows a battery connected to an LED in the correct direction?",
    circuits: [
      {
        id: "p2a",
        isCorrect: true,
        svg: (
          <svg width="100%" viewBox="0 0 250 140">
            <line
              x1="25"
              y1="70"
              x2="42"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="42"
              y1="56"
              x2="42"
              y2="84"
              stroke={DS.colors.dark}
              strokeWidth="3.5"
            />
            <line
              x1="55"
              y1="60"
              x2="55"
              y2="80"
              stroke={DS.colors.dark}
              strokeWidth="2.5"
            />
            <line
              x1="65"
              y1="56"
              x2="65"
              y2="84"
              stroke={DS.colors.dark}
              strokeWidth="3.5"
            />
            <line
              x1="78"
              y1="60"
              x2="78"
              y2="80"
              stroke={DS.colors.dark}
              strokeWidth="2.5"
            />
            <line
              x1="78"
              y1="70"
              x2="108"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <polygon
              points="112,70 142,56 142,84"
              stroke={DS.colors.primary}
              strokeWidth="2.5"
              fill={DS.colors.lightPurple + "33"}
            />
            <line
              x1="142"
              y1="70"
              x2="152"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="152"
              y1="56"
              x2="152"
              y2="84"
              stroke={DS.colors.primary}
              strokeWidth="2.5"
            />
            <line
              x1="130"
              y1="46"
              x2="138"
              y2="36"
              stroke={DS.colors.accent}
              strokeWidth="1.8"
            />
            <line
              x1="140"
              y1="46"
              x2="148"
              y2="36"
              stroke={DS.colors.accent}
              strokeWidth="1.8"
            />
            <line
              x1="152"
              y1="70"
              x2="220"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="25"
              y1="70"
              x2="25"
              y2="110"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="25"
              y1="110"
              x2="220"
              y2="110"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="220"
              y1="110"
              x2="220"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <text
              x="38"
              y="48"
              fontSize="10"
              fill={DS.colors.accent}
              fontWeight="700"
              fontFamily="Poppins"
            >
              +
            </text>
            <text
              x="116"
              y="96"
              fontSize="10"
              fill={DS.colors.success}
              fontWeight="700"
              fontFamily="Poppins"
            >
              +
            </text>
            <text
              x="148"
              y="96"
              fontSize="10"
              fill={DS.colors.error}
              fontWeight="700"
              fontFamily="Poppins"
            >
              −
            </text>
          </svg>
        ),
      },
      {
        id: "p2b",
        isCorrect: false,
        svg: (
          <svg width="100%" viewBox="0 0 250 140">
            <line
              x1="25"
              y1="70"
              x2="48"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="48"
              y1="56"
              x2="48"
              y2="84"
              stroke={DS.colors.dark}
              strokeWidth="3.5"
            />
            <line
              x1="60"
              y1="60"
              x2="60"
              y2="80"
              stroke={DS.colors.dark}
              strokeWidth="2.5"
            />
            <line
              x1="60"
              y1="70"
              x2="108"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <polygon
              points="112,70 142,56 142,84"
              stroke={DS.colors.dark}
              strokeWidth="2.5"
              fill="none"
            />
            <line
              x1="142"
              y1="70"
              x2="152"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="152"
              y1="56"
              x2="152"
              y2="84"
              stroke={DS.colors.dark}
              strokeWidth="2.5"
            />
            <line
              x1="152"
              y1="70"
              x2="220"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="25"
              y1="70"
              x2="25"
              y2="110"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="25"
              y1="110"
              x2="220"
              y2="110"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="220"
              y1="110"
              x2="220"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
          </svg>
        ),
      },
    ],
    correctAnswer: "p2a",
    explanation:
      "LEDs only work in the correct direction. The positive side of the battery must connect to the LED's positive terminal (triangle point).",
    hint: "Remember: LEDs need correct polarity. The triangle points toward the positive terminal.",
  },
  {
    id: "p3",
    question:
      "Which circuit shows a switch in the OFF position preventing the lamp from lighting?",
    circuits: [
      {
        id: "p3a",
        isCorrect: true,
        svg: (
          <svg width="100%" viewBox="0 0 250 140">
            <line
              x1="35"
              y1="70"
              x2="60"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="60"
              y1="55"
              x2="60"
              y2="85"
              stroke={DS.colors.dark}
              strokeWidth="3.5"
            />
            <line
              x1="72"
              y1="60"
              x2="72"
              y2="80"
              stroke={DS.colors.dark}
              strokeWidth="2.5"
            />
            <line
              x1="72"
              y1="70"
              x2="92"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <circle cx="100" cy="70" r="3.5" fill={DS.colors.primary} />
            <circle cx="132" cy="70" r="3.5" fill={DS.colors.primary} />
            <line
              x1="100"
              y1="70"
              x2="128"
              y2="56"
              stroke={DS.colors.primary}
              strokeWidth="2.5"
            />
            <line
              x1="132"
              y1="70"
              x2="150"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <circle
              cx="178"
              cy="70"
              r="20"
              stroke={DS.colors.primary}
              strokeWidth="2.5"
              fill={DS.colors.lightPurple + "22"}
            />
            <line
              x1="164"
              y1="56"
              x2="192"
              y2="84"
              stroke={DS.colors.primary}
              strokeWidth="2"
            />
            <line
              x1="192"
              y1="56"
              x2="164"
              y2="84"
              stroke={DS.colors.primary}
              strokeWidth="2"
            />
            <line
              x1="198"
              y1="70"
              x2="215"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="35"
              y1="70"
              x2="35"
              y2="110"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="35"
              y1="110"
              x2="215"
              y2="110"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="215"
              y1="110"
              x2="215"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <text
              x="106"
              y="50"
              fontSize="10"
              fill={DS.colors.error}
              fontWeight="700"
              fontFamily="Poppins"
            >
              OFF
            </text>
          </svg>
        ),
      },
      {
        id: "p3b",
        isCorrect: false,
        svg: (
          <svg width="100%" viewBox="0 0 250 140">
            <line
              x1="35"
              y1="70"
              x2="60"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="60"
              y1="55"
              x2="60"
              y2="85"
              stroke={DS.colors.dark}
              strokeWidth="3.5"
            />
            <line
              x1="72"
              y1="60"
              x2="72"
              y2="80"
              stroke={DS.colors.dark}
              strokeWidth="2.5"
            />
            <line
              x1="72"
              y1="70"
              x2="92"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <circle cx="100" cy="70" r="3.5" fill={DS.colors.primary} />
            <circle cx="132" cy="70" r="3.5" fill={DS.colors.primary} />
            <line
              x1="100"
              y1="70"
              x2="132"
              y2="70"
              stroke={DS.colors.primary}
              strokeWidth="2.5"
            />
            <line
              x1="132"
              y1="70"
              x2="150"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <circle
              cx="178"
              cy="70"
              r="20"
              stroke={DS.colors.primary}
              strokeWidth="2.5"
              fill={DS.colors.lightPurple + "22"}
            />
            <line
              x1="164"
              y1="56"
              x2="192"
              y2="84"
              stroke={DS.colors.primary}
              strokeWidth="2"
            />
            <line
              x1="192"
              y1="56"
              x2="164"
              y2="84"
              stroke={DS.colors.primary}
              strokeWidth="2"
            />
            <line
              x1="198"
              y1="70"
              x2="215"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="35"
              y1="70"
              x2="35"
              y2="110"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="35"
              y1="110"
              x2="215"
              y2="110"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <line
              x1="215"
              y1="110"
              x2="215"
              y2="70"
              stroke={DS.colors.accent}
              strokeWidth="2.5"
            />
            <text
              x="106"
              y="50"
              fontSize="10"
              fill={DS.colors.success}
              fontWeight="700"
              fontFamily="Poppins"
            >
              ON
            </text>
          </svg>
        ),
      },
    ],
    correctAnswer: "p3a",
    explanation:
      "When a switch is OFF (open), it creates a gap in the circuit, preventing electricity from flowing.",
    hint: "Look for the switch with a gap — that means it's open (OFF).",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const ElectricCircuitTool = () => {
  const [mode, setMode] = useState("learn");
  const [selectedComp, setSelectedComp] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [hints, setHints] = useState({});
  const [qIdx, setQIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const modes = [
    { key: "learn", label: "Learn", emoji: "📚", color: DS.colors.primary },
    {
      key: "practice",
      label: "Practice",
      emoji: "🎯",
      color: DS.colors.accent,
    },
    {
      key: "real_world",
      label: "Real World",
      emoji: "🌍",
      color: DS.colors.deepPurple,
    },
    {
      key: "hands_on",
      label: "Hands-On",
      emoji: "🔧",
      color: DS.colors.midOrange,
    },
  ];

  // ─── LEARN MODE ───
  const LearnMode = () => (
    <div style={{ animation: "sg-fadeIn 0.5s ease-out" }}>
      {/* Hero */}
      <div
        style={{
          background: gradient,
          borderRadius: DS.radius.lg,
          padding: isMobile ? "28px 20px" : "44px 40px",
          marginBottom: "28px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-30px",
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}
        />
        <h1
          style={{
            fontFamily: DS.font,
            margin: "0 0 8px",
            fontSize: isMobile ? "1.6em" : "2.2em",
            fontWeight: 800,
            color: DS.colors.white,
            letterSpacing: "-0.02em",
          }}
        >
          ⚡ Electric Circuit Symbols
        </h1>
        <p
          style={{
            fontFamily: DS.font,
            margin: 0,
            fontSize: isMobile ? "0.9em" : "1.05em",
            color: "rgba(255,255,255,0.85)",
            fontWeight: 400,
          }}
        >
          Learn the standard symbols used to represent electrical components
        </p>
      </div>

      {/* Component Cards */}
      <div
        className="sg-stagger"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "20px",
          marginBottom: "28px",
        }}
      >
        {electricalComponents.map((c) => {
          const Sym = symbolMap[c.id];
          return (
            <DSCard
              key={c.id}
              selected={selectedComp === c.id}
              onClick={() => setSelectedComp(c.id)}
            >
              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: DS.radius.md,
                      background: subtleGradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                      flexShrink: 0,
                    }}
                  >
                    {c.emoji}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: DS.font,
                        fontWeight: 700,
                        fontSize: "1.05em",
                        color: DS.colors.dark,
                      }}
                    >
                      {c.name}
                    </div>
                    <DSBadge
                      color={
                        c.category === "Power Source" ? "orange" : "purple"
                      }
                    >
                      {c.category}
                    </DSBadge>
                  </div>
                </div>
                <div
                  style={{
                    background: DS.colors.offWhite,
                    borderRadius: DS.radius.sm,
                    padding: "16px",
                    border: `2px dashed ${DS.colors.lightGray}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "70px",
                    marginBottom: "14px",
                  }}
                >
                  {Sym && <Sym />}
                </div>
                <p
                  style={{
                    fontFamily: DS.font,
                    margin: 0,
                    color: "#666",
                    fontSize: "0.88em",
                    lineHeight: 1.6,
                    fontStyle: "italic",
                  }}
                >
                  {c.description}
                </p>
              </div>
            </DSCard>
          );
        })}
      </div>

      {/* Complete Circuit Example */}
      <DSCard hoverable={false} style={{ padding: isMobile ? "20px" : "28px" }}>
        <h2
          style={{
            fontFamily: DS.font,
            margin: "0 0 20px",
            fontWeight: 700,
            fontSize: "1.3em",
            color: DS.colors.dark,
            borderBottom: `3px solid ${DS.colors.primary}`,
            paddingBottom: "12px",
          }}
        >
          Complete Circuit Example
        </h2>
        <svg
          width="100%"
          viewBox="0 0 700 300"
          style={{
            background: DS.colors.offWhite,
            borderRadius: DS.radius.sm,
            border: `1px solid ${DS.colors.lightGray}`,
          }}
        >
          {/* Battery */}
          <g transform="translate(120,120)">
            <line
              x1="0"
              y1="18"
              x2="0"
              y2="42"
              stroke={DS.colors.dark}
              strokeWidth="4"
            />
            <line
              x1="20"
              y1="10"
              x2="20"
              y2="50"
              stroke={DS.colors.dark}
              strokeWidth="4"
            />
            <line
              x1="40"
              y1="18"
              x2="40"
              y2="42"
              stroke={DS.colors.dark}
              strokeWidth="4"
            />
            <line
              x1="60"
              y1="10"
              x2="60"
              y2="50"
              stroke={DS.colors.dark}
              strokeWidth="4"
            />
            <text
              x="30"
              y="0"
              fontSize="13"
              fontWeight="700"
              textAnchor="middle"
              fontFamily="Poppins"
              fill={DS.colors.dark}
            >
              Battery
            </text>
            <text
              x="-14"
              y="35"
              fontSize="14"
              fontWeight="700"
              fill={DS.colors.primary}
            >
              −
            </text>
            <text
              x="68"
              y="35"
              fontSize="14"
              fontWeight="700"
              fill={DS.colors.accent}
            >
              +
            </text>
          </g>
          {/* Wires */}
          <line
            x1="180"
            y1="150"
            x2="180"
            y2="80"
            stroke={DS.colors.accent}
            strokeWidth="4"
          />
          <line
            x1="180"
            y1="80"
            x2="300"
            y2="80"
            stroke={DS.colors.accent}
            strokeWidth="4"
          />
          {/* Switch */}
          <g transform="translate(300,80)">
            <circle cx="0" cy="0" r="5" fill={DS.colors.primary} />
            <line
              x1="0"
              y1="0"
              x2="80"
              y2="0"
              stroke={DS.colors.primary}
              strokeWidth="4"
            />
            <circle cx="80" cy="0" r="5" fill={DS.colors.primary} />
            <text
              x="40"
              y="-14"
              fontSize="12"
              fontWeight="700"
              textAnchor="middle"
              fill={DS.colors.success}
              fontFamily="Poppins"
            >
              Switch ON
            </text>
          </g>
          <line
            x1="380"
            y1="80"
            x2="470"
            y2="80"
            stroke={DS.colors.accent}
            strokeWidth="4"
          />
          {/* Lamp */}
          <g transform="translate(470,80)">
            <circle
              cx="0"
              cy="0"
              r="32"
              stroke={DS.colors.primary}
              strokeWidth="3.5"
              fill={`${DS.colors.lightOrange}66`}
            />
            <line
              x1="-16"
              y1="-16"
              x2="16"
              y2="16"
              stroke={DS.colors.primary}
              strokeWidth="2.5"
            />
            <line
              x1="-16"
              y1="16"
              x2="16"
              y2="-16"
              stroke={DS.colors.primary}
              strokeWidth="2.5"
            />
            <text
              x="0"
              y="52"
              fontSize="13"
              fontWeight="700"
              textAnchor="middle"
              fontFamily="Poppins"
              fill={DS.colors.dark}
            >
              Lamp
            </text>
          </g>
          {/* Return wires */}
          <line
            x1="470"
            y1="112"
            x2="470"
            y2="220"
            stroke={DS.colors.accent}
            strokeWidth="4"
          />
          <line
            x1="470"
            y1="220"
            x2="120"
            y2="220"
            stroke={DS.colors.accent}
            strokeWidth="4"
          />
          <line
            x1="120"
            y1="220"
            x2="120"
            y2="150"
            stroke={DS.colors.accent}
            strokeWidth="4"
          />
          {/* Flow arrows */}
          <polygon points="420,80 415,75 415,85" fill={DS.colors.accent} />
          <polygon points="470,180 465,175 475,175" fill={DS.colors.accent} />
          <polygon points="250,220 255,215 255,225" fill={DS.colors.accent} />
          <polygon points="120,190 115,195 125,195" fill={DS.colors.accent} />
          <text
            x="230"
            y="68"
            fontSize="12"
            fill={DS.colors.accent}
            fontWeight="700"
            fontFamily="Poppins"
          >
            Current Flow →
          </text>
        </svg>
        <div
          style={{
            marginTop: "16px",
            padding: "14px 18px",
            background: DS.colors.lightPurple + "22",
            borderLeft: `4px solid ${DS.colors.primary}`,
            borderRadius: DS.radius.sm,
          }}
        >
          <p
            style={{
              fontFamily: DS.font,
              margin: 0,
              fontSize: "0.9em",
              lineHeight: 1.7,
              color: DS.colors.dark,
            }}
          >
            <strong>How it works:</strong> This complete circuit shows a battery
            connected to a lamp through a closed switch. When the switch is ON,
            electricity flows in a complete loop (shown by arrows), lighting the
            lamp. If the switch is OFF, the circuit is broken and the lamp won't
            light.
          </p>
        </div>
      </DSCard>
    </div>
  );

  // ─── PRACTICE MODE ───
  const PracticeMode = () => {
    const q = defaultQuestions[qIdx];
    const isSub = submitted[q.id];
    const sel = answers[q.id];
    const correct = sel === q.correctAnswer;

    return (
      <div style={{ animation: "sg-scaleIn 0.4s ease-out" }}>
        <DSCard
          hoverable={false}
          style={{ padding: isMobile ? "18px" : "24px" }}
        >
          {/* Question header */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              marginBottom: "22px",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: gradient,
                color: DS.colors.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: DS.font,
                fontWeight: 700,
                fontSize: "18px",
                flexShrink: 0,
                boxShadow: DS.shadow.md,
              }}
            >
              {qIdx + 1}
            </div>
            <div>
              <p
                style={{
                  fontFamily: DS.font,
                  fontWeight: 700,
                  color: DS.colors.dark,
                  fontSize: isMobile ? "1em" : "1.1em",
                  margin: "0 0 4px",
                }}
              >
                {q.question}
              </p>
              <p
                style={{
                  fontFamily: DS.font,
                  fontSize: "13px",
                  color: DS.colors.gray,
                  margin: 0,
                }}
              >
                Select the correct circuit diagram
              </p>
            </div>
          </div>

          {/* Hint */}
          {q.hint && !isSub && (
            <div style={{ marginBottom: "20px" }}>
              <DSButton
                variant="text"
                icon={<Bulb size={18} />}
                onClick={() => setHints({ ...hints, [q.id]: !hints[q.id] })}
              >
                {hints[q.id] ? "Hide Hint" : "Show Hint"}
              </DSButton>
              {hints[q.id] && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "14px 16px",
                    background: DS.colors.lightOrange,
                    borderLeft: `4px solid ${DS.colors.accent}`,
                    borderRadius: DS.radius.sm,
                    animation: "sg-fadeIn 0.3s ease-out",
                  }}
                >
                  <p
                    style={{
                      fontFamily: DS.font,
                      fontSize: "13px",
                      color: DS.colors.dark,
                      margin: 0,
                    }}
                  >
                    💡 {q.hint}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Circuit options */}
          <div
            className="sg-stagger"
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
              marginBottom: "22px",
            }}
          >
            {q.circuits.map((c, ci) => {
              const isSel = sel === c.id;
              const showRes = isSub && isSel;
              let borderColor = DS.colors.lightGray;
              let bg = DS.colors.white;
              if (showRes) {
                borderColor = correct ? DS.colors.success : DS.colors.error;
                bg = correct ? "#f0fdf4" : "#fef2f2";
              } else if (isSel) {
                borderColor = DS.colors.primary;
                bg = DS.colors.lightPurple + "18";
              }
              return (
                <div
                  key={c.id}
                  onClick={() =>
                    !isSub && setAnswers({ ...answers, [q.id]: c.id })
                  }
                  style={{
                    position: "relative",
                    borderRadius: DS.radius.md,
                    padding: "14px",
                    border: `2px solid ${borderColor}`,
                    background: bg,
                    cursor: isSub ? "default" : "pointer",
                    transition: "all 0.25s",
                    boxShadow: isSel ? DS.shadow.md : DS.shadow.sm,
                  }}
                >
                  {/* Letter badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: DS.colors.offWhite,
                      border: `1px solid ${DS.colors.lightGray}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: DS.font,
                      fontWeight: 700,
                      fontSize: "14px",
                      color: DS.colors.dark,
                    }}
                  >
                    {String.fromCharCode(65 + ci)}
                  </div>
                  {/* Result badge */}
                  {showRes && (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        padding: "4px 12px",
                        borderRadius: DS.radius.pill,
                        color: DS.colors.white,
                        fontFamily: DS.font,
                        fontWeight: 700,
                        fontSize: "11px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        background: correct
                          ? DS.colors.success
                          : DS.colors.error,
                        animation: "sg-scaleIn 0.3s ease-out",
                      }}
                    >
                      {correct ? (
                        <>
                          <CheckIcon size={14} />
                          Correct!
                        </>
                      ) : (
                        <>
                          <XIcon size={14} />
                          Wrong
                        </>
                      )}
                    </div>
                  )}
                  {/* SVG */}
                  <div
                    style={{
                      background: DS.colors.offWhite,
                      borderRadius: DS.radius.sm,
                      padding: "14px",
                      marginTop: "36px",
                      marginBottom: "8px",
                      border: `2px dashed ${DS.colors.lightGray}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "100px",
                    }}
                  >
                    {c.svg}
                  </div>
                  {isSel && !isSub && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        background: DS.colors.primary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        animation: "sg-pulse 1.5s infinite",
                      }}
                    >
                      <CheckIcon size={16} color={DS.colors.white} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit / Explanation */}
          {!isSub ? (
            <DSButton
              variant="gradient"
              disabled={!sel}
              onClick={() => setSubmitted({ ...submitted, [q.id]: true })}
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "14px 24px",
                fontSize: "15px",
              }}
            >
              {sel ? "Check Answer" : "Select an answer to continue"}
            </DSButton>
          ) : (
            <div
              style={{
                padding: "16px",
                borderRadius: DS.radius.md,
                border: `2px solid ${correct ? DS.colors.success : DS.colors.accent}`,
                background: correct ? "#f0fdf4" : DS.colors.lightOrange,
                animation: "sg-fadeIn 0.4s ease-out",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: correct ? DS.colors.success : DS.colors.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {correct ? (
                    <CheckIcon size={22} color={DS.colors.white} />
                  ) : (
                    <XIcon size={22} color={DS.colors.white} />
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: DS.font,
                      fontWeight: 700,
                      color: DS.colors.dark,
                      margin: "0 0 6px",
                      fontSize: "1.05em",
                    }}
                  >
                    {correct
                      ? "Excellent! You got it right!"
                      : "Not quite — let's learn from this!"}
                  </p>
                  <p
                    style={{
                      fontFamily: DS.font,
                      fontSize: "0.9em",
                      color: "#555",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {q.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Nav */}
          <div style={{ display: "flex", gap: "12px", marginTop: "18px" }}>
            <DSButton
              variant="outlined"
              disabled={qIdx === 0}
              onClick={() => setQIdx(qIdx - 1)}
              icon={<ChevronLeft size={18} />}
              style={{ flex: 1, justifyContent: "center" }}
            >
              Previous
            </DSButton>
            <DSButton
              variant="gradient"
              disabled={qIdx >= defaultQuestions.length - 1}
              onClick={() => setQIdx(qIdx + 1)}
              style={{ flex: 1, justifyContent: "center" }}
            >
              Next <ChevronRight size={18} />
            </DSButton>
          </div>
        </DSCard>
        <p
          style={{
            fontFamily: DS.font,
            textAlign: "center",
            color: DS.colors.gray,
            fontSize: "13px",
            marginTop: "16px",
          }}
        >
          Question {qIdx + 1} of {defaultQuestions.length}
        </p>
      </div>
    );
  };

  // ─── REAL WORLD MODE ───
  const RealWorldMode = () => {
    const apps = [
      {
        id: "torch",
        emoji: "🔦",
        title: "Torch / Flashlight",
        desc: "A simple circuit with a battery, switch, and bulb — a perfect complete circuit!",
        grad: `linear-gradient(135deg, #F59E0B, #D97706)`,
      },
      {
        id: "home",
        emoji: "🏠",
        title: "Home Lighting",
        desc: "Your house has circuits connecting the power supply to lights through switches.",
        grad: `linear-gradient(135deg, ${DS.colors.primary}, #3730A3)`,
      },
      {
        id: "phone",
        emoji: "📱",
        title: "Mobile Phones",
        desc: "Complex circuits with battery, LED screen, and components working together.",
        grad: `linear-gradient(135deg, ${DS.colors.deepPurple}, #7C3AED)`,
      },
      {
        id: "car",
        emoji: "🚗",
        title: "Cars & Vehicles",
        desc: "Headlights, indicators, and dashboard all use electric circuits with switches.",
        grad: `linear-gradient(135deg, #EF4444, #B91C1C)`,
      },
      {
        id: "toys",
        emoji: "🧸",
        title: "Electronic Toys",
        desc: "Battery-operated toys use simple circuits with motors, lights, and sounds.",
        grad: `linear-gradient(135deg, #EC4899, #BE185D)`,
      },
      {
        id: "safety",
        emoji: "⚠️",
        title: "Safety Devices",
        desc: "Smoke alarms and emergency lights use circuits to keep us safe.",
        grad: `linear-gradient(135deg, ${DS.colors.accent}, #C2410C)`,
      },
    ];
    return (
      <div style={{ animation: "sg-fadeIn 0.5s ease-out" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1
            style={{
              fontFamily: DS.font,
              fontSize: isMobile ? "1.5em" : "2em",
              fontWeight: 800,
              color: DS.colors.dark,
              margin: "0 0 8px",
            }}
          >
            Electric Circuits in Real Life 🌍
          </h1>
          <p
            style={{
              fontFamily: DS.font,
              color: DS.colors.gray,
              fontSize: "1em",
              margin: 0,
            }}
          >
            Discover how circuits power the world around you!
          </p>
        </div>
        <div
          className="sg-stagger"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {apps.map((a) => (
            <DSCard key={a.id}>
              <div
                style={{
                  background: a.grad,
                  padding: isMobile ? "24px 18px" : "30px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "3em",
                    marginBottom: "6px",
                    animation: "sg-float 3s ease-in-out infinite",
                  }}
                >
                  {a.emoji}
                </div>
                <h2
                  style={{
                    fontFamily: DS.font,
                    fontWeight: 700,
                    color: DS.colors.white,
                    margin: 0,
                    fontSize: "1.2em",
                  }}
                >
                  {a.title}
                </h2>
              </div>
              <div style={{ padding: "18px 20px" }}>
                <p
                  style={{
                    fontFamily: DS.font,
                    color: "#666",
                    fontSize: "0.9em",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {a.desc}
                </p>
              </div>
            </DSCard>
          ))}
        </div>
      </div>
    );
  };

  // ─── HANDS-ON MODE ───
  const HandsOnMode = () => {
    const experiments = [
      {
        title: "Simple Torch Circuit",
        emoji: "🔦",
        materials: [
          "1 battery (1.5V)",
          "1 small bulb",
          "2 wires",
          "1 switch (optional)",
        ],
        steps: [
          "Connect one wire from battery positive (+) to the bulb",
          "Connect another wire from bulb to battery negative (−)",
          "The bulb should light up!",
          "Add a switch to control the light",
        ],
      },
      {
        title: "LED Circuit",
        emoji: "💡",
        materials: ["1 battery (3V)", "1 LED", "1 resistor (100Ω)", "2 wires"],
        steps: [
          "Connect resistor to positive (+) terminal",
          "Connect LED long leg to resistor",
          "Connect LED short leg to negative (−) terminal",
          "LED should light up!",
        ],
      },
    ];
    return (
      <div style={{ animation: "sg-scaleIn 0.5s ease-out" }}>
        <DSCard
          hoverable={false}
          style={{ padding: isMobile ? "22px" : "32px" }}
        >
          <h1
            style={{
              fontFamily: DS.font,
              fontSize: isMobile ? "1.4em" : "1.7em",
              fontWeight: 800,
              color: DS.colors.dark,
              textAlign: "center",
              margin: "0 0 8px",
            }}
          >
            🔧 Build Your Own Circuit!
          </h1>
          <p
            style={{
              fontFamily: DS.font,
              textAlign: "center",
              color: DS.colors.gray,
              marginBottom: "24px",
              fontSize: "0.95em",
            }}
          >
            Try these safe experiments at home or in the classroom
          </p>

          {/* Safety warning */}
          <div
            style={{
              background: DS.colors.lightOrange,
              borderLeft: `4px solid ${DS.colors.accent}`,
              borderRadius: DS.radius.sm,
              padding: "16px 18px",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                fontFamily: DS.font,
                fontWeight: 700,
                color: DS.colors.accent,
                margin: "0 0 8px",
                fontSize: "1.05em",
              }}
            >
              ⚠️ Safety First!
            </h3>
            <div
              style={{
                fontFamily: DS.font,
                color: "#92400e",
                fontSize: "0.88em",
                lineHeight: 1.8,
              }}
            >
              <div>• Only use batteries (never mains electricity)</div>
              <div>• Ask an adult to supervise</div>
              <div>• Don't connect batteries directly without a component</div>
              <div>• Use proper insulated wires</div>
            </div>
          </div>

          {/* Experiments */}
          <div className="sg-stagger" style={{ display: "grid", gap: "16px" }}>
            {experiments.map((exp, i) => (
              <div
                key={i}
                style={{
                  background: DS.colors.offWhite,
                  borderRadius: DS.radius.md,
                  padding: "20px",
                  border: `1px solid ${DS.colors.lightGray}`,
                }}
              >
                <h3
                  style={{
                    fontFamily: DS.font,
                    fontWeight: 700,
                    color: DS.colors.primary,
                    margin: "0 0 14px",
                    fontSize: "1.15em",
                  }}
                >
                  {exp.emoji} {exp.title}
                </h3>
                <div style={{ marginBottom: "14px" }}>
                  <h4
                    style={{
                      fontFamily: DS.font,
                      fontWeight: 600,
                      color: DS.colors.dark,
                      margin: "0 0 8px",
                      fontSize: "0.95em",
                    }}
                  >
                    Materials Needed:
                  </h4>
                  <div
                    style={{
                      fontFamily: DS.font,
                      color: "#666",
                      fontSize: "0.88em",
                      lineHeight: 1.7,
                    }}
                  >
                    {exp.materials.map((m, j) => (
                      <div key={j}>• {m}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: DS.font,
                      fontWeight: 600,
                      color: DS.colors.dark,
                      margin: "0 0 8px",
                      fontSize: "0.95em",
                    }}
                  >
                    Steps:
                  </h4>
                  <div
                    style={{
                      fontFamily: DS.font,
                      color: "#666",
                      fontSize: "0.88em",
                      lineHeight: 1.8,
                    }}
                  >
                    {exp.steps.map((s, j) => (
                      <div
                        key={j}
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <span
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "50%",
                            background: gradient,
                            color: DS.colors.white,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "11px",
                            flexShrink: 0,
                          }}
                        >
                          {j + 1}
                        </span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DSCard>
      </div>
    );
  };

  // ─── MAIN RENDER ───
  return (
    <div
      style={{
        fontFamily: DS.font,
        background: `linear-gradient(170deg, ${DS.colors.offWhite} 0%, ${DS.colors.lightPurple}15 50%, ${DS.colors.lightOrange}15 100%)`,
        minHeight: "100vh",
        padding: isMobile ? "14px" : "24px",
      }}
    >
      <GlobalStyles />
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Mode selector */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {modes.map((m) => (
            <DSButton
              key={m.key}
              variant={mode === m.key ? "contained" : "outlined"}
              highlight={mode === m.key && m.key === "practice"}
              onClick={() => {
                setMode(m.key);
                setQIdx(0);
              }}
              style={{
                background: mode === m.key ? m.color : "transparent",
                borderColor: m.color,
                color: mode === m.key ? DS.colors.white : m.color,
                fontSize: isMobile ? "12px" : "14px",
                padding: isMobile ? "8px 14px" : "10px 22px",
              }}
              icon={
                <span style={{ fontSize: isMobile ? "14px" : "16px" }}>
                  {m.emoji}
                </span>
              }
            >
              {m.label}
            </DSButton>
          ))}
        </div>

        {/* Mode content */}
        {mode === "learn" && <LearnMode />}
        {mode === "practice" && <PracticeMode />}
        {mode === "real_world" && <RealWorldMode />}
        {mode === "hands_on" && <HandsOnMode />}

        {/* Reset */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "28px",
          }}
        >
          <DSButton
            variant="text"
            icon={<ResetBtn size={18} />}
            onClick={() => {
              setAnswers({});
              setSubmitted({});
              setHints({});
              setQIdx(0);
              setSelectedComp(null);
            }}
          >
            Reset
          </DSButton>
        </div>
      </div>
    </div>
  );
};

export default ElectricCircuitTool;
