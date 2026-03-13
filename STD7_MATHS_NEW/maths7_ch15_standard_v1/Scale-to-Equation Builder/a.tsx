// If the host workspace is missing React/lucide typings, suppress import errors
// so this file can still be type-checked in isolation.
// (Runtime still requires the actual packages to exist.)
declare global {
  namespace JSX {
    // minimal typings for TS when @types/react isn't available
    type Element = any;
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// @ts-ignore - workspace may not include react typings
import React, { useState, useEffect, useCallback, useMemo } from "react";
// @ts-ignore - workspace may not include lucide-react typings
import { Check, X, ChevronRight, ChevronLeft, RotateCcw, Trophy, BookOpen, Target, HelpCircle, Star } from "lucide-react";

const DS = {
  indigo: "#4A4DC9",
  orange: "#FF7212",
  purple: "#533086",
  tangerine: "#FC9145",
  lilac: "#C1C1EA",
  peach: "#FFF3E4",
  dark: "#4E4E4E",
  gray: "#CACACA",
  lightGray: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  indigoDark: "#3C3FA8",
  orangeDark: "#E5650F",
  gradHeader: "linear-gradient(135deg, #4A4DC9, #533086 40%, #FC9145)",
  gradSubtle: "linear-gradient(135deg, #C1C1EA, #FFF3E4)",
  pill: "100px",
  cardRd: "16px",
  inputRd: "12px",
  font: "'Poppins', sans-serif",
  btnShadow: "0 4px 16px rgba(74,77,201,0.2)",
  btnOrangeShadow: "0 4px 16px rgba(255,114,18,0.25)",
  cardShadow: "0 4px 24px rgba(74,77,201,0.08)",
};

type ModeType = "learn" | "practice";
interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}
interface WeightItem {
  label: string;
  value: number;
  type: "known" | "unknown";
  color: string;
  count?: number;
}
interface BalanceProblem {
  id: number;
  title: string;
  description: string;
  leftPan: WeightItem[];
  rightPan: WeightItem[];
  correctEquation: string;
  acceptableEquations: string[];
  solution: number;
  hint: string;
  figureRef?: string;
}
interface WeighingScaleToolProps {
  props?: {
    width?: number;
    height?: number;
    initialMode?: ModeType;
    showModeSelector?: boolean;
    showNavigation?: boolean;
    animationSpeed?: number;
    themeColor?: string;
    darkMode?: boolean;
    additionalProps?: {
      problems?: BalanceProblem[];
      showHints?: boolean;
      unknownSymbol?: string;
    };
  };
  setStepDetails?: (s: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (v: boolean) => void;
}

const DEFAULT_PROBLEMS: BalanceProblem[] = [
  {
    id: 1,
    title: "Problem 1 — Fig 7.9",
    description:
      "A sack and a 2 kg weight on the left balance with 10 kg and 2 kg on the right.",
    leftPan: [
      { label: "Sack", value: 10, type: "unknown", color: DS.purple, count: 1 },
      { label: "2kg", value: 2, type: "known", color: DS.orange, count: 1 },
    ],
    rightPan: [
      { label: "10kg", value: 10, type: "known", color: DS.orange, count: 1 },
      { label: "2kg", value: 2, type: "known", color: DS.orange, count: 1 },
    ],
    correctEquation: "x + 2 = 12",
    acceptableEquations: [
      "x + 2 = 12",
      "x+2=12",
      "x + 2 = 10 + 2",
      "x+2=10+2",
      "2 + x = 12",
      "2+x=12",
    ],
    solution: 10,
    hint: "Left: x + 2. Right: 10 + 2 = 12. So x + 2 = 12.",
    figureRef: "Fig 7.9",
  },
  {
    id: 2,
    title: "Problem 2 — Fig 7.10",
    description: "3 sacks + 4 kg on left = 2 sacks + 10 kg + 4 kg on right.",
    leftPan: [
      { label: "Sack", value: 10, type: "unknown", color: DS.purple, count: 3 },
      { label: "4kg", value: 4, type: "known", color: DS.orange, count: 1 },
    ],
    rightPan: [
      { label: "Sack", value: 10, type: "unknown", color: DS.purple, count: 2 },
      { label: "10kg", value: 10, type: "known", color: DS.orange, count: 1 },
      { label: "4kg", value: 4, type: "known", color: DS.orange, count: 1 },
    ],
    correctEquation: "3x + 4 = 2x + 14",
    acceptableEquations: [
      "3x + 4 = 2x + 14",
      "3x+4=2x+14",
      "x + 4 = 14",
      "x+4=14",
      "x = 10",
      "x=10",
    ],
    solution: 10,
    hint: "Remove 1 sack and 4 kg from both sides → x = 10.",
    figureRef: "Fig 7.10",
  },
  {
    id: 3,
    title: "Problem 3 — Fig 7.11",
    description: "5 sacks on left = 3 sacks + 10 kg + 10 kg + 1 kg on right.",
    leftPan: [
      {
        label: "Sack",
        value: 10.5,
        type: "unknown",
        color: DS.purple,
        count: 5,
      },
    ],
    rightPan: [
      {
        label: "Sack",
        value: 10.5,
        type: "unknown",
        color: DS.purple,
        count: 3,
      },
      { label: "10kg", value: 10, type: "known", color: DS.orange, count: 2 },
      { label: "1kg", value: 1, type: "known", color: DS.orange, count: 1 },
    ],
    correctEquation: "5x = 3x + 21",
    acceptableEquations: [
      "5x = 3x + 21",
      "5x=3x+21",
      "2x = 21",
      "2x=21",
      "x = 10.5",
      "x=10.5",
    ],
    solution: 10.5,
    hint: "Remove 3 sacks → 2x = 21.",
    figureRef: "Fig 7.11",
  },
  {
    id: 4,
    title: "Problem 4 — Fig 7.12",
    description: "90 sacks + 50 kg on left = 60 sacks + 500 kg on right.",
    leftPan: [
      {
        label: "Sack",
        value: 15,
        type: "unknown",
        color: DS.purple,
        count: 90,
      },
      { label: "50kg", value: 50, type: "known", color: DS.indigo, count: 1 },
    ],
    rightPan: [
      {
        label: "Sack",
        value: 15,
        type: "unknown",
        color: DS.purple,
        count: 60,
      },
      { label: "500kg", value: 500, type: "known", color: DS.indigo, count: 1 },
    ],
    correctEquation: "90x + 50 = 60x + 500",
    acceptableEquations: [
      "90x + 50 = 60x + 500",
      "90x+50=60x+500",
      "30x + 50 = 500",
      "30x+50=500",
      "30x = 450",
      "30x=450",
      "x = 15",
      "x=15",
    ],
    solution: 15,
    hint: "Remove 60 sacks → 30x + 50 = 500 → x = 15.",
    figureRef: "Fig 7.12",
  },
  {
    id: 5,
    title: "Problem 5 — Simple",
    description: "One sack on left = 7 kg on right.",
    leftPan: [
      { label: "Sack", value: 7, type: "unknown", color: DS.purple, count: 1 },
    ],
    rightPan: [
      { label: "7kg", value: 7, type: "known", color: DS.orange, count: 1 },
    ],
    correctEquation: "x = 7",
    acceptableEquations: ["x = 7", "x=7"],
    solution: 7,
    hint: "Sack directly equals 7 kg.",
  },
  {
    id: 6,
    title: "Problem 6 — Two Sacks",
    description: "Two sacks on left = 5 kg + 3 kg on right.",
    leftPan: [
      { label: "Sack", value: 4, type: "unknown", color: DS.purple, count: 2 },
    ],
    rightPan: [
      { label: "5kg", value: 5, type: "known", color: DS.orange, count: 1 },
      { label: "3kg", value: 3, type: "known", color: DS.orange, count: 1 },
    ],
    correctEquation: "2x = 8",
    acceptableEquations: ["2x = 8", "2x=8", "2x = 5 + 3", "x = 4", "x=4"],
    solution: 4,
    hint: "2x = 5+3 = 8 → x = 4.",
  },
  {
    id: 7,
    title: "Problem 7 — Sack + Weight",
    description: "A sack + 5 kg on left = 20 kg on right.",
    leftPan: [
      { label: "Sack", value: 15, type: "unknown", color: DS.purple, count: 1 },
      { label: "5kg", value: 5, type: "known", color: DS.orange, count: 1 },
    ],
    rightPan: [
      { label: "20kg", value: 20, type: "known", color: DS.indigo, count: 1 },
    ],
    correctEquation: "x + 5 = 20",
    acceptableEquations: [
      "x + 5 = 20",
      "x+5=20",
      "5 + x = 20",
      "x = 15",
      "x=15",
    ],
    solution: 15,
    hint: "x + 5 = 20 → x = 15.",
  },
  {
    id: 8,
    title: "Problem 8 — Four Sacks",
    description: "4 sacks on left = 2 sacks + 10 kg on right.",
    leftPan: [
      { label: "Sack", value: 5, type: "unknown", color: DS.purple, count: 4 },
    ],
    rightPan: [
      { label: "Sack", value: 5, type: "unknown", color: DS.purple, count: 2 },
      { label: "10kg", value: 10, type: "known", color: DS.orange, count: 1 },
    ],
    correctEquation: "4x = 2x + 10",
    acceptableEquations: [
      "4x = 2x + 10",
      "4x=2x+10",
      "2x = 10",
      "2x=10",
      "x = 5",
      "x=5",
    ],
    solution: 5,
    hint: "Remove 2 sacks → 2x = 10 → x = 5.",
  },
  {
    id: 9,
    title: "Problem 9 — Mixed",
    description: "3 sacks + 7 kg on left = 1 sack + 25 kg on right.",
    leftPan: [
      { label: "Sack", value: 9, type: "unknown", color: DS.purple, count: 3 },
      { label: "7kg", value: 7, type: "known", color: DS.orange, count: 1 },
    ],
    rightPan: [
      { label: "Sack", value: 9, type: "unknown", color: DS.purple, count: 1 },
      { label: "25kg", value: 25, type: "known", color: DS.indigo, count: 1 },
    ],
    correctEquation: "3x + 7 = x + 25",
    acceptableEquations: [
      "3x + 7 = x + 25",
      "3x+7=x+25",
      "2x + 7 = 25",
      "2x+7=25",
      "2x = 18",
      "2x=18",
      "x = 9",
      "x=9",
    ],
    solution: 9,
    hint: "Remove 1 sack → 2x + 7 = 25 → x = 9.",
  },
  {
    id: 10,
    title: "Problem 10 — Challenge!",
    description: "5 sacks + 3 kg on left = 2 sacks + 3 kg + 18 kg on right.",
    leftPan: [
      { label: "Sack", value: 6, type: "unknown", color: DS.purple, count: 5 },
      { label: "3kg", value: 3, type: "known", color: DS.orange, count: 1 },
    ],
    rightPan: [
      { label: "Sack", value: 6, type: "unknown", color: DS.purple, count: 2 },
      { label: "3kg", value: 3, type: "known", color: DS.orange, count: 1 },
      { label: "18kg", value: 18, type: "known", color: DS.indigo, count: 1 },
    ],
    correctEquation: "5x + 3 = 2x + 21",
    acceptableEquations: [
      "5x + 3 = 2x + 21",
      "5x+3=2x+21",
      "3x + 3 = 21",
      "3x+3=21",
      "3x = 18",
      "3x=18",
      "x = 6",
      "x=6",
      "5x = 2x + 18",
    ],
    solution: 6,
    hint: "Remove 2 sacks and 3 kg → 3x = 18 → x = 6.",
  },
];

// ═══════════════════════════════════════════════════════════════
// RESPONSIVE HOOK
// ═══════════════════════════════════════════════════════════════
const useContainerWidth = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [w, setW] = useState(800);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setW(e.contentRect.width);
    });
    ro.observe(ref.current);
    setW(ref.current.clientWidth);
    return () => ro.disconnect();
  }, [ref]);
  return w;
};

// ═══════════════════════════════════════════════════════════════
// BRASS SCALE — fully responsive via viewBox + 100% width
// ═══════════════════════════════════════════════════════════════
const BrassScale: React.FC<{
  leftItems: JSX.Element;
  rightItems: JSX.Element;
  tilt: number;
  balanced: boolean;
  compact: boolean;
}> = ({ leftItems, rightItems, tilt, balanced, compact }) => {
  const br = balanced ? 0 : tilt;
  const sz = compact ? 0.7 : 1;
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "600px",
        aspectRatio: "600/400",
        margin: "0 auto",
      }}
    >
      <svg
        viewBox="0 0 600 400"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="gld" x1="0" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#f5e88a" />
            <stop offset="30%" stopColor="#dab83c" />
            <stop offset="60%" stopColor="#c49520" />
            <stop offset="100%" stopColor="#f0de6e" />
          </linearGradient>
          <linearGradient id="pil" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b08020" />
            <stop offset="20%" stopColor="#dab83c" />
            <stop offset="50%" stopColor="#f5e88a" />
            <stop offset="80%" stopColor="#dab83c" />
            <stop offset="100%" stopColor="#b08020" />
          </linearGradient>
          <linearGradient id="bm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0de6e" />
            <stop offset="50%" stopColor="#c49520" />
            <stop offset="100%" stopColor="#a07018" />
          </linearGradient>
          <linearGradient id="pn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8cf5a" />
            <stop offset="50%" stopColor="#c49520" />
            <stop offset="100%" stopColor="#9a6c10" />
          </linearGradient>
          <linearGradient id="pnIn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5e88a" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#c49520" stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id="bs" cx="0.5" cy="0.3" r="0.6">
            <stop offset="0%" stopColor="#f5e88a" />
            <stop offset="100%" stopColor="#9a6c10" />
          </radialGradient>
          <filter id="ps">
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="10"
              floodColor="#00000015"
            />
          </filter>
          <filter id="bss">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="6"
              floodColor="#00000012"
            />
          </filter>
        </defs>
        {/* BASE */}
        <ellipse
          cx="300"
          cy="388"
          rx="95"
          ry="10"
          fill="url(#bs)"
          stroke="#9a6c10"
          strokeWidth="0.8"
          filter="url(#bss)"
        />
        <path
          d="M210 383 Q210 370 240 362 Q270 356 300 355 Q330 356 360 362 Q390 370 390 383"
          fill="url(#bs)"
          stroke="#9a6c10"
          strokeWidth="0.8"
        />
        <ellipse
          cx="300"
          cy="355"
          rx="50"
          ry="7"
          fill="url(#gld)"
          stroke="#b08020"
          strokeWidth="0.6"
        />
        <ellipse
          cx="300"
          cy="350"
          rx="36"
          ry="4.5"
          fill="#dab83c"
          stroke="#b08020"
          strokeWidth="0.4"
        />
        {/* PILLAR */}
        <rect
          x="289"
          y="128"
          width="22"
          height="224"
          rx="5"
          fill="url(#pil)"
          stroke="#a07018"
          strokeWidth="0.8"
        />
        {[150, 180, 210, 240, 270, 300, 330].map((y) => (
          <g key={y}>
            <ellipse
              cx="300"
              cy={y}
              rx="14"
              ry="3"
              fill="none"
              stroke="#b08020"
              strokeWidth="0.7"
              opacity="0.5"
            />
          </g>
        ))}
        <ellipse
          cx="300"
          cy="342"
          rx="18"
          ry="4"
          fill="url(#gld)"
          stroke="#a07018"
          strokeWidth="0.6"
        />
        {/* CROWN */}
        <path
          d="M281 130 Q273 110 278 96 Q285 80 300 72 Q315 80 322 96 Q327 110 319 130"
          fill="url(#gld)"
          stroke="#a07018"
          strokeWidth="1"
        />
        <ellipse
          cx="300"
          cy="72"
          rx="10"
          ry="8"
          fill="url(#gld)"
          stroke="#a07018"
          strokeWidth="0.8"
        />
        <path
          d="M290 68 Q282 52 288 40 Q294 32 300 28 Q306 32 312 40 Q318 52 310 68"
          fill="url(#gld)"
          stroke="#a07018"
          strokeWidth="0.7"
        />
        <path
          d="M285 60 Q270 50 275 36 Q278 28 284 26"
          fill="none"
          stroke="#c49520"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M315 60 Q330 50 325 36 Q322 28 316 26"
          fill="none"
          stroke="#c49520"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle
          cx="284"
          cy="25"
          r="2.5"
          fill="#e8cf5a"
          stroke="#a07018"
          strokeWidth="0.4"
        />
        <circle
          cx="316"
          cy="25"
          r="2.5"
          fill="#e8cf5a"
          stroke="#a07018"
          strokeWidth="0.4"
        />
        <circle
          cx="300"
          cy="28"
          r="5"
          fill="#f5e88a"
          stroke="#a07018"
          strokeWidth="0.6"
        />
        <line
          x1="300"
          y1="23"
          x2="300"
          y2="10"
          stroke="#dab83c"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle
          cx="300"
          cy="9"
          r="3"
          fill="#f5e88a"
          stroke="#b08020"
          strokeWidth="0.5"
        />
        <polygon
          points="286,130 300,116 314,130"
          fill="url(#gld)"
          stroke="#a07018"
          strokeWidth="0.8"
        />
        {/* BEAM */}
        <g transform={`rotate(${br}, 300, 127)`}>
          <rect
            x="30"
            y="123"
            width="540"
            height="8"
            rx="4"
            fill="url(#bm)"
            stroke="#a07018"
            strokeWidth="0.8"
          />
          <circle
            cx="300"
            cy="127"
            r="8"
            fill="#f0de6e"
            stroke="#a07018"
            strokeWidth="1"
          />
          <circle cx="300" cy="127" r="3.5" fill="#c49520" />
          <circle
            cx="46"
            cy="127"
            r="5.5"
            fill="#e8cf5a"
            stroke="#a07018"
            strokeWidth="0.7"
          />
          <circle
            cx="554"
            cy="127"
            r="5.5"
            fill="#e8cf5a"
            stroke="#a07018"
            strokeWidth="0.7"
          />
          {/* LEFT CHAINS */}
          {[20, 42, 64, 86].map((ex, i) => (
            <line
              key={`lc${i}`}
              x1="46"
              y1="132"
              x2={ex - 16}
              y2="230"
              stroke="#c49520"
              strokeWidth="1.5"
              strokeDasharray="3,2"
              opacity="0.7"
            />
          ))}
          {/* LEFT PAN */}
          <ellipse
            cx="46"
            cy="240"
            rx="82"
            ry="12"
            fill="url(#pn)"
            stroke="#9a6c10"
            strokeWidth="1"
            filter="url(#ps)"
          />
          <ellipse cx="46" cy="237" rx="70" ry="9" fill="url(#pnIn)" />
          <ellipse
            cx="46"
            cy="233"
            rx="62"
            ry="4.5"
            fill="none"
            stroke="#f5e88a"
            strokeWidth="0.5"
            opacity="0.4"
          />
          {/* RIGHT CHAINS */}
          {[514, 536, 558, 580].map((ex, i) => (
            <line
              key={`rc${i}`}
              x1="554"
              y1="132"
              x2={ex - 16}
              y2="230"
              stroke="#c49520"
              strokeWidth="1.5"
              strokeDasharray="3,2"
              opacity="0.7"
            />
          ))}
          {/* RIGHT PAN */}
          <ellipse
            cx="554"
            cy="240"
            rx="82"
            ry="12"
            fill="url(#pn)"
            stroke="#9a6c10"
            strokeWidth="1"
            filter="url(#ps)"
          />
          <ellipse cx="554" cy="237" rx="70" ry="9" fill="url(#pnIn)" />
          <ellipse
            cx="554"
            cy="233"
            rx="62"
            ry="4.5"
            fill="none"
            stroke="#f5e88a"
            strokeWidth="0.5"
            opacity="0.4"
          />
        </g>
      </svg>

      {/* Items overlaid on pans — positioned with % */}
      <div
        style={{
          position: "absolute",
          top: "52%",
          left: "1%",
          width: "23%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          transform: `rotate(${br}deg)`,
          transformOrigin: "50% -30%",
          transition: "transform 1s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {leftItems}
      </div>
      <div
        style={{
          position: "absolute",
          top: "52%",
          right: "1%",
          width: "23%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          transform: `rotate(${br}deg)`,
          transformOrigin: "50% -30%",
          transition: "transform 1s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {rightItems}
      </div>

      {balanced && (
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            background: DS.indigo,
            color: DS.white,
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: "bold",
            fontFamily: DS.font,
            animation: "sgPopIn 0.5s ease-out both",
            boxShadow: `0 3px 12px ${DS.indigo}50`,
            zIndex: 10,
          }}
        >
          =
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ITEM ICONS — sizes adapt via prop
// ═══════════════════════════════════════════════════════════════
const SackIcon: React.FC<{ size?: number; delay?: number }> = ({
  size = 36,
  delay = 0,
}) => (
  <svg
    width={size}
    height={size * 0.88}
    viewBox="0 0 52 46"
    style={{
      animation: `sgPopIn 0.5s ease-out ${delay}s both`,
      filter: "drop-shadow(1px 2px 3px rgba(83,48,134,0.2))",
    }}
  >
    <ellipse
      cx="26"
      cy="32"
      rx="18"
      ry="13"
      fill={DS.lilac}
      stroke={DS.purple}
      strokeWidth="1.4"
    />
    <path
      d="M13 27 Q13 14 26 10 Q39 14 39 27"
      fill="#d8d0f0"
      stroke={DS.purple}
      strokeWidth="1.3"
    />
    <path
      d="M20 10 Q26 3 32 10"
      fill="none"
      stroke={DS.purple}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <text
      x="26"
      y="30"
      textAnchor="middle"
      fontSize="12"
      fill={DS.purple}
      fontWeight="bold"
      fontFamily={DS.font}
    >
      ?
    </text>
  </svg>
);
const WeightIcon: React.FC<{
  label: string;
  color: string;
  size?: number;
  delay?: number;
}> = ({ label, color, size = 34, delay = 0 }) => {
  const bg = color === DS.indigo ? DS.indigo : DS.orange;
  const bdr = color === DS.indigo ? DS.indigoDark : DS.orangeDark;
  return (
    <svg
      width={size}
      height={size * 0.72}
      viewBox="0 0 50 36"
      style={{
        animation: `sgPopIn 0.5s ease-out ${delay}s both`,
        filter: `drop-shadow(1px 2px 3px ${bg}35)`,
      }}
    >
      <rect
        x="7"
        y="8"
        width="36"
        height="22"
        rx="4"
        fill={bg}
        stroke={bdr}
        strokeWidth="1.2"
      />
      <rect
        x="15"
        y="2"
        width="20"
        height="10"
        rx="3"
        fill={bg}
        stroke={bdr}
        strokeWidth="1"
      />
      <text
        x="25"
        y="24"
        textAnchor="middle"
        fill={DS.white}
        fontSize="9"
        fontWeight="bold"
        fontFamily={DS.font}
      >
        {label}
      </text>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const WeighingScaleTool: React.FC<WeighingScaleToolProps> = ({
  props: propsIn,
  setStepDetails,
}) => {
  const props = (propsIn ?? {}) as NonNullable<WeighingScaleToolProps["props"]>;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cw = useContainerWidth(containerRef);
  const isMobile = cw < 500;
  const isSmall = cw < 650;

  const ap = props.additionalProps || {};
  const problems = ap.problems || DEFAULT_PROBLEMS;
  const showHintsConfig = ap.showHints ?? true;
  const sym = ap.unknownSymbol ?? "x";
  const showModeSelector = props.showModeSelector ?? true;
  const showNav = props.showNavigation ?? true;

  const [mode, setMode] = useState<ModeType>(
    (props.initialMode ?? "learn") as ModeType,
  );
  const [pi, setPi] = useState(0);
  const [eq, setEq] = useState("");
  const [fb, setFb] = useState<"idle" | "correct" | "incorrect">("idle");
  const [hint, setHint] = useState(false);
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [tilt, setTilt] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [shake, setShake] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [ls, setLs] = useState(0);
  const [showAns, setShowAns] = useState(false);

  const prob = problems[pi];
  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
  }, []);
  useEffect(() => {
    let f: number;
    const a = (ts: number) => {
      setTilt(Math.sin(ts / 2200) * (fb === "correct" ? 0 : 1.4));
      f = requestAnimationFrame(a);
    };
    f = requestAnimationFrame(a);
    return () => cancelAnimationFrame(f);
  }, [fb]);
  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: pi + 1,
        totalSteps: problems.length,
        isPaused: true,
        currentMode: mode,
      });
  }, [pi, mode, problems.length, setStepDetails]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const kf = `
            @keyframes sgFloatIn{from{opacity:0;transform:translateY(24px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
            @keyframes sgPopIn{0%{transform:scale(0);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
            @keyframes sgPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
            @keyframes sgShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
            @keyframes sgCelebrate{0%{transform:scale(1) rotate(0)}25%{transform:scale(1.06) rotate(-1.5deg)}50%{transform:scale(1.1) rotate(1.5deg)}100%{transform:scale(1) rotate(0)}}
            @keyframes sgGlow{0%,100%{box-shadow:0 0 0 3px ${DS.lilac}40}50%{box-shadow:0 0 0 6px ${DS.indigo}30}}
            @keyframes sgBurst{0%{opacity:1;transform:scale(0) rotate(0)}50%{opacity:1;transform:scale(1.2) rotate(180deg)}100%{opacity:0;transform:scale(0.3) rotate(360deg)}}
            @keyframes sgFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
            @keyframes sgSwing{0%,100%{transform:rotate(0)}25%{transform:rotate(0.8deg)}75%{transform:rotate(-0.8deg)}}
        `;
    const s = document.createElement("style");
    s.id = "sg-kf";
    s.textContent = kf;
    document.head.appendChild(s);
    return () => {
      document.head.removeChild(link);
      const e = document.getElementById("sg-kf");
      if (e) document.head.removeChild(e);
    };
  }, []);

  const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase();
  const check = useCallback(() => {
    if (!eq.trim()) return;
    const ok = prob.acceptableEquations.some((a) => norm(a) === norm(eq));
    if (ok) {
      setFb("correct");
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 1400);
      if (!solved.has(prob.id)) {
        setScore((p) => p + 1);
        setSolved((p) => new Set(p).add(prob.id));
      }
    } else {
      setFb("incorrect");
      setShake(true);
      setTimeout(() => setShake(false), 550);
    }
  }, [eq, prob, solved]);
  const go = (i: number) => {
    setPi(i);
    setEq("");
    setFb("idle");
    setHint(false);
    setShowAns(false);
  };
  const resetAll = () => {
    go(0);
    setScore(0);
    setSolved(new Set());
  };

  const iconSz = isMobile ? 24 : isSmall ? 28 : 34;
  const iconSzSm = isMobile ? 18 : isSmall ? 22 : 26;

  const buildItems = (items: WeightItem[], side: string) => {
    const els: JSX.Element[] = [];
    let idx = 0;
    items.forEach((item, i) => {
      const c = item.count || 1;
      if (c > 5) {
        els.push(
          <div
            key={`${side}${i}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1px",
            }}
          >
            {item.type === "unknown" ? (
              <SackIcon size={iconSzSm} delay={idx * 0.05} />
            ) : (
              <WeightIcon
                label={item.label}
                color={item.color}
                size={iconSzSm}
                delay={idx * 0.05}
              />
            )}
            <span
              style={{
                fontSize: isMobile ? "7px" : "9px",
                fontWeight: 800,
                color: DS.purple,
                fontFamily: DS.font,
              }}
            >
              ×{c}
            </span>
          </div>,
        );
        idx++;
      } else {
        for (let j = 0; j < c; j++) {
          els.push(
            <div key={`${side}${i}${j}`}>
              {item.type === "unknown" ? (
                <SackIcon size={c > 3 ? iconSzSm : iconSz} delay={idx * 0.05} />
              ) : (
                <WeightIcon
                  label={item.label}
                  color={item.color}
                  size={c > 3 ? iconSzSm : iconSz}
                  delay={idx * 0.05}
                />
              )}
            </div>,
          );
          idx++;
        }
      }
    });
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: isMobile ? "1px" : "3px",
          maxWidth: isMobile ? "100px" : "180px",
        }}
      >
        {els}
      </div>
    );
  };

  const eqDisp = useMemo(() => {
    const f = (items: WeightItem[]) =>
      items
        .map((i) => {
          const c = i.count || 1;
          if (i.type === "unknown") return c === 1 ? sym : `${c}${sym}`;
          return c === 1 ? i.label : `${c}×${i.label}`;
        })
        .join(" + ");
    return { l: f(prob.leftPan), r: f(prob.rightPan) };
  }, [prob, sym]);

  const SgBtn: React.FC<{
    onClick: () => void;
    variant?: "contained" | "outlined" | "text" | "highlight";
    disabled?: boolean;
    children: React.ReactNode;
    style?: React.CSSProperties;
  }> = ({
    onClick,
    variant = "contained",
    disabled = false,
    children,
    style: ex,
  }) => {
    const [hv, setHv] = useState(false);
    const base: React.CSSProperties = {
      padding: isMobile ? "8px 16px" : "10px 24px",
      borderRadius: DS.pill,
      fontFamily: DS.font,
      fontWeight: 600,
      fontSize: isMobile ? "11px" : "13px",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.3s",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      border: "none",
      opacity: disabled ? 0.5 : 1,
    };
    const vars: Record<string, React.CSSProperties> = {
      contained: {
        background: hv ? DS.indigoDark : DS.indigo,
        color: DS.white,
        boxShadow: hv ? DS.btnShadow : "none",
      },
      outlined: {
        background: "transparent",
        color: DS.indigo,
        border: `2px solid ${hv ? DS.indigo : DS.lilac}`,
      },
      text: {
        background: "transparent",
        color: hv ? DS.indigoDark : DS.indigo,
      },
      highlight: {
        background: hv ? DS.orangeDark : DS.orange,
        color: DS.white,
        boxShadow: hv ? DS.btnOrangeShadow : "none",
      },
    };
    return (
      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => setHv(true)}
        onMouseLeave={() => setHv(false)}
        style={{ ...base, ...vars[variant], ...ex }}
      >
        {children}
      </button>
    );
  };

  const learnData = [
    {
      t: "The Two-Pan Balance",
      c: "A traditional brass weighing scale has two wide pans hung by chains from a beam. When both pans carry equal weight, the beam stays perfectly level.",
      v: "⚖️",
    },
    {
      t: "Known & Unknown Weights",
      c: "Iron weights (orange/indigo blocks) have known values. Sacks (purple bags with '?') have an unknown weight — we call it 'x'.",
      v: "📦",
    },
    {
      t: "Writing the Equation",
      c: "Since the scale is balanced: Left pan = Right pan. This gives us an equation!\nExample: x + 2 = 12",
      v: "✏️",
    },
    {
      t: "Solving Step by Step",
      c: "Perform the same operation on both sides to isolate x.\nFrom x + 2 = 12 → subtract 2 → x = 10.",
      v: "🧮",
    },
    {
      t: "The Equal Sacks Trick",
      c: "When sacks are on BOTH pans, remove the same number from each side. The balance stays equal but the equation simplifies!",
      v: "💡",
    },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: props.width ?? 800,
        minHeight: isMobile ? "auto" : (props.height ?? 740),
        background: `linear-gradient(170deg, ${DS.offWhite} 0%, ${DS.white} 30%, ${DS.peach}30 60%, ${DS.lilac}18 100%)`,
        borderRadius: isMobile ? "12px" : "20px",
        overflow: "hidden",
        boxShadow: `0 16px 56px ${DS.indigo}12`,
        fontFamily: DS.font,
        position: "relative",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.5s, transform 0.5s",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: DS.gradHeader,
          padding: isMobile ? "10px 12px" : "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "8px" : "12px",
            minWidth: 0,
            flex: 1,
          }}
        >
          <div
            style={{
              width: isMobile ? "32px" : "40px",
              height: isMobile ? "32px" : "40px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "18px" : "22px",
              flexShrink: 0,
            }}
          >
            ⚖️
          </div>
          <div style={{ minWidth: 0 }}>
            <h2
              style={{
                margin: 0,
                color: DS.white,
                fontSize: isMobile ? "13px" : "17px",
                fontWeight: 700,
                letterSpacing: "-0.3px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Unknown Weights — Weighing Scales
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: isMobile ? "9px" : "11px",
                color: "rgba(255,255,255,0.7)",
                fontWeight: 500,
              }}
            >
              Chapter 7 · Finding the Unknown
            </p>
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: DS.pill,
            padding: isMobile ? "4px 12px" : "6px 18px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexShrink: 0,
          }}
        >
          <Trophy size={isMobile ? 12 : 15} color={DS.peach} />
          <span
            style={{
              color: DS.peach,
              fontWeight: 800,
              fontSize: isMobile ? "12px" : "15px",
            }}
          >
            {score}/{problems.length}
          </span>
        </div>
      </div>

      {/* MODE TABS */}
      {showModeSelector && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: isMobile ? "6px" : "8px",
            padding: isMobile ? "10px 8px" : "14px 16px",
            background: DS.white,
            borderBottom: `1px solid ${DS.lightGray}`,
          }}
        >
          {[
            {
              m: "learn" as ModeType,
              i: <BookOpen size={isMobile ? 13 : 15} />,
              l: "Learn",
            },
            {
              m: "practice" as ModeType,
              i: <Target size={isMobile ? 13 : 15} />,
              l: "Practice",
            },
          ].map(({ m, i, l }) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: isMobile ? "8px 18px" : "10px 28px",
                borderRadius: DS.pill,
                border: mode === m ? "none" : `2px solid ${DS.lightGray}`,
                background: mode === m ? DS.indigo : DS.white,
                color: mode === m ? DS.white : DS.dark,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s",
                fontSize: isMobile ? "12px" : "13px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: DS.font,
                boxShadow: mode === m ? DS.btnShadow : "none",
              }}
            >
              {i} {l}
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: isMobile ? "2px 0" : "4px 0" }}>
        {/* LEARN */}
        {mode === "learn" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: isMobile ? "16px" : "22px",
              padding: isMobile ? "16px 12px" : "28px 20px",
              animation: "sgFloatIn 0.5s ease-out both",
            }}
          >
            <div
              style={{
                background: DS.white,
                borderRadius: DS.cardRd,
                padding: isMobile ? "20px 18px" : "30px 36px",
                maxWidth: "540px",
                width: "100%",
                boxShadow: DS.cardShadow,
                border: `1.5px solid ${DS.lilac}30`,
              }}
            >
              <div
                style={{
                  width: isMobile ? "42px" : "52px",
                  height: isMobile ? "42px" : "52px",
                  borderRadius: "14px",
                  background: DS.gradSubtle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isMobile ? "22px" : "26px",
                  marginBottom: "14px",
                  animation: "sgPulse 2.5s ease-in-out infinite",
                }}
              >
                {learnData[ls].v}
              </div>
              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: isMobile ? "17px" : "20px",
                  color: DS.indigo,
                  fontWeight: 700,
                }}
              >
                {learnData[ls].t}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: isMobile ? "13px" : "14px",
                  lineHeight: 1.8,
                  color: DS.dark,
                  whiteSpace: "pre-line",
                }}
              >
                {learnData[ls].c}
              </p>
            </div>
            {ls >= 2 && (
              <div
                style={{
                  background: DS.lilac + "18",
                  borderRadius: DS.cardRd,
                  padding: isMobile ? "12px 16px" : "16px 28px",
                  fontFamily: "monospace",
                  fontSize: isMobile ? "14px" : "17px",
                  fontWeight: 700,
                  color: DS.indigo,
                  textAlign: "center",
                  border: `2px dashed ${DS.lilac}50`,
                  animation: "sgPopIn 0.5s ease-out 0.12s both",
                  maxWidth: "100%",
                  overflowX: "auto",
                }}
              >
                {ls === 2 && `${sym} + 2 = 12`}
                {ls === 3 && `${sym} + 2 − 2 = 12 − 2 → ${sym} = 10 ✓`}
                {ls === 4 && `3${sym} = 2${sym} + 10 → ${sym} = 10 ✓`}
              </div>
            )}
            <div
              style={{
                display: "flex",
                gap: isMobile ? "8px" : "12px",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <SgBtn
                onClick={() => setLs(Math.max(0, ls - 1))}
                variant="outlined"
                disabled={ls === 0}
              >
                <ChevronLeft size={15} /> Back
              </SgBtn>
              <span
                style={{ fontSize: "12px", color: DS.gray, fontWeight: 700 }}
              >
                {ls + 1} / {learnData.length}
              </span>
              <SgBtn
                onClick={() =>
                  ls === learnData.length - 1
                    ? setMode("practice")
                    : setLs(ls + 1)
                }
                variant={
                  ls === learnData.length - 1 ? "highlight" : "contained"
                }
              >
                {ls === learnData.length - 1 ? (
                  "Start Practice →"
                ) : (
                  <>
                    Next <ChevronRight size={15} />
                  </>
                )}
              </SgBtn>
            </div>
          </div>
        )}

        {/* PRACTICE */}
        {mode === "practice" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: isMobile ? "6px" : "8px",
              padding: isMobile ? "10px 8px" : "14px 16px",
              animation: "sgFloatIn 0.5s ease-out both",
            }}
          >
            <div
              style={{
                textAlign: "center",
                maxWidth: "540px",
                padding: "0 8px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 4px",
                  fontSize: isMobile ? "14px" : "16px",
                  color: DS.indigo,
                  fontWeight: 700,
                  animation: "sgFade 0.4s ease-out both",
                }}
              >
                {prob.title}
                {solved.has(prob.id) && (
                  <span style={{ color: "#27ae60", marginLeft: 8 }}>✓</span>
                )}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: isMobile ? "11px" : "12.5px",
                  color: DS.dark,
                  lineHeight: 1.55,
                  animation: "sgFade 0.4s ease-out 0.05s both",
                }}
              >
                {prob.description}
              </p>
            </div>

            <div
              style={{
                width: "100%",
                animation: celebrate
                  ? "sgCelebrate 0.8s ease-in-out"
                  : "sgSwing 5s ease-in-out infinite",
                transformOrigin: "top center",
              }}
            >
              <BrassScale
                leftItems={buildItems(prob.leftPan, "L")}
                rightItems={buildItems(prob.rightPan, "R")}
                tilt={tilt}
                balanced={fb === "correct"}
                compact={isMobile}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: isMobile ? "8px" : "14px",
                fontFamily: "monospace",
                fontWeight: 700,
                marginTop: "-4px",
                animation: "sgFade 0.5s ease-out 0.2s both",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  color: DS.indigo,
                  background: DS.lilac + "20",
                  padding: isMobile ? "4px 10px" : "5px 14px",
                  borderRadius: DS.pill,
                  fontSize: isMobile ? "10px" : "12px",
                }}
              >
                {eqDisp.l}
              </span>
              <span
                style={{
                  color: DS.gray,
                  fontSize: isMobile ? "14px" : "18px",
                  fontWeight: 800,
                }}
              >
                =
              </span>
              <span
                style={{
                  color: DS.orange,
                  background: DS.peach,
                  padding: isMobile ? "4px 10px" : "5px 14px",
                  borderRadius: DS.pill,
                  fontSize: isMobile ? "10px" : "12px",
                }}
              >
                {eqDisp.r}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: isMobile ? "8px" : "12px",
                width: "100%",
                maxWidth: "480px",
                padding: "0 8px",
                animation: "sgFade 0.5s ease-out 0.3s both",
              }}
            >
              <label
                style={{
                  fontSize: isMobile ? "11px" : "13px",
                  fontWeight: 600,
                  color: DS.dark,
                  textAlign: "center",
                }}
              >
                Write the equation using{" "}
                <span
                  style={{
                    color: DS.indigo,
                    fontFamily: "monospace",
                    fontSize: isMobile ? "14px" : "16px",
                    fontWeight: 800,
                  }}
                >
                  {sym}
                </span>{" "}
                for the unknown:
              </label>
              <div
                style={{
                  display: "flex",
                  gap: isMobile ? "6px" : "10px",
                  width: "100%",
                }}
              >
                <input
                  type="text"
                  value={eq}
                  onChange={(e) => {
                    setEq(e.target.value);
                    if (fb !== "idle") setFb("idle");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") check();
                  }}
                  placeholder={`e.g. ${sym} + 2 = 12`}
                  style={{
                    flex: 1,
                    padding: isMobile ? "10px 12px" : "14px 20px",
                    borderRadius: DS.inputRd,
                    border:
                      fb === "correct"
                        ? "2.5px solid #27ae60"
                        : fb === "incorrect"
                          ? `2.5px solid ${DS.orange}`
                          : `2.5px solid ${DS.lilac}`,
                    fontSize: isMobile ? "14px" : "17px",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    outline: "none",
                    background:
                      fb === "correct"
                        ? "#f0fff0"
                        : fb === "incorrect"
                          ? DS.peach
                          : DS.white,
                    transition: "all 0.3s",
                    color: DS.dark,
                    animation: shake
                      ? "sgShake 0.5s ease"
                      : fb === "idle"
                        ? "sgGlow 2.5s ease-in-out infinite"
                        : "none",
                    minWidth: 0,
                  }}
                />
                <SgBtn
                  onClick={check}
                  disabled={!eq.trim()}
                  variant="contained"
                  style={{
                    padding: isMobile ? "10px 14px" : "14px 24px",
                    fontSize: isMobile ? "12px" : "14px",
                    flexShrink: 0,
                  }}
                >
                  <Check size={isMobile ? 14 : 16} />
                  {!isMobile && " Check"}
                </SgBtn>
              </div>

              {fb === "correct" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: isMobile ? "10px 16px" : "12px 24px",
                    borderRadius: DS.pill,
                    background: "linear-gradient(135deg,#27ae60,#2ecc71)",
                    color: DS.white,
                    fontWeight: 700,
                    fontSize: isMobile ? "12px" : "14px",
                    animation: "sgPopIn 0.4s ease-out both",
                    boxShadow: "0 4px 16px #27ae6030",
                    textAlign: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <Star size={isMobile ? 14 : 17} fill="white" /> Correct! Sack
                  = <strong>{prob.solution} kg</strong>
                </div>
              )}
              {fb === "incorrect" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: isMobile ? "8px 14px" : "11px 22px",
                    borderRadius: DS.pill,
                    background: DS.orange,
                    color: DS.white,
                    fontWeight: 600,
                    fontSize: isMobile ? "11px" : "13px",
                    animation: "sgPopIn 0.3s ease-out both",
                    boxShadow: DS.btnOrangeShadow,
                    textAlign: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <X size={isMobile ? 13 : 15} /> Not quite — Left = Right. Try
                  again!
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {showHintsConfig && !hint && (
                  <SgBtn
                    onClick={() => setHint(true)}
                    variant="outlined"
                    style={{ fontSize: "12px", padding: "8px 16px" }}
                  >
                    <HelpCircle size={14} /> Hint
                  </SgBtn>
                )}
                {fb === "incorrect" && !showAns && (
                  <SgBtn
                    onClick={() => setShowAns(true)}
                    variant="text"
                    style={{ fontSize: "12px", color: DS.orange }}
                  >
                    Show Answer
                  </SgBtn>
                )}
              </div>
              {hint && (
                <div
                  style={{
                    padding: isMobile ? "10px 14px" : "12px 20px",
                    borderRadius: DS.cardRd,
                    background: DS.peach,
                    border: `1.5px solid ${DS.orange}30`,
                    fontSize: isMobile ? "11px" : "12.5px",
                    color: DS.dark,
                    fontWeight: 500,
                    lineHeight: 1.6,
                    maxWidth: "440px",
                    textAlign: "center",
                    animation: "sgFade 0.3s ease-out both",
                    width: "100%",
                  }}
                >
                  💡 {prob.hint}
                </div>
              )}
              {showAns && (
                <div
                  style={{
                    padding: isMobile ? "10px 14px" : "12px 20px",
                    borderRadius: DS.cardRd,
                    background: DS.lilac + "15",
                    border: `1.5px solid ${DS.indigo}30`,
                    fontSize: isMobile ? "11px" : "13px",
                    color: DS.indigo,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    animation: "sgFade 0.3s ease-out both",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  ✅ {prob.correctEquation} → {sym} = {prob.solution}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: isMobile ? "4px" : "6px",
                flexWrap: "wrap",
                justifyContent: "center",
                padding: "6px 4px",
              }}
            >
              {problems.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => go(i)}
                  style={{
                    width: isMobile ? "26px" : "30px",
                    height: isMobile ? "26px" : "30px",
                    borderRadius: "50%",
                    border: "none",
                    background:
                      i === pi
                        ? DS.indigo
                        : solved.has(p.id)
                          ? "#27ae60"
                          : DS.lightGray,
                    color: i === pi || solved.has(p.id) ? DS.white : DS.gray,
                    fontWeight: 800,
                    fontSize: isMobile ? "9px" : "11px",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    transform: i === pi ? "scale(1.2)" : "scale(1)",
                    boxShadow: i === pi ? DS.btnShadow : "none",
                    fontFamily: DS.font,
                  }}
                >
                  {solved.has(p.id) && i !== pi ? "✓" : i + 1}
                </button>
              ))}
            </div>

            {showNav && (
              <div
                style={{
                  display: "flex",
                  gap: isMobile ? "6px" : "10px",
                  alignItems: "center",
                  paddingBottom: "8px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <SgBtn
                  onClick={() => go(Math.max(0, pi - 1))}
                  variant="outlined"
                  disabled={pi === 0}
                >
                  <ChevronLeft size={15} /> Prev
                </SgBtn>
                <SgBtn
                  onClick={() => go(Math.min(problems.length - 1, pi + 1))}
                  variant="contained"
                  disabled={pi === problems.length - 1}
                >
                  Next <ChevronRight size={15} />
                </SgBtn>
                <SgBtn
                  onClick={resetAll}
                  variant="text"
                  style={{ color: DS.gray }}
                >
                  <RotateCcw size={14} />
                </SgBtn>
              </div>
            )}
          </div>
        )}
      </div>

      {celebrate && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            overflow: "hidden",
            zIndex: 100,
          }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${5 + Math.random() * 90}%`,
                top: `${5 + Math.random() * 75}%`,
                width: `${8 + Math.random() * 10}px`,
                height: `${8 + Math.random() * 10}px`,
                background: [
                  DS.indigo,
                  DS.orange,
                  DS.purple,
                  DS.tangerine,
                  DS.lilac,
                  "#27ae60",
                ][i % 6],
                borderRadius: i % 3 === 0 ? "50%" : "3px",
                animation: `sgBurst 1.2s ease-out ${i * 0.04}s both`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WeighingScaleTool;
