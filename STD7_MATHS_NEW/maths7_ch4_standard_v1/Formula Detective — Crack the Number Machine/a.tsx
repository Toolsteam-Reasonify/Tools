// @ts-ignore - resolved by the host app/build system
import React, { useState, useEffect, useCallback, useMemo } from "react";
// @ts-ignore - resolved by the host app/build system
import { ChevronLeft, ChevronRight, Check, X, RotateCcw, Star } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "real_world" | "hands_on";

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
  type: "intro" | "explanation" | "practice" | "real_world" | "hands_on";
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface MachineData {
  id: number;
  label: string;
  difficulty: "Easy" | "Medium" | "Hard";
  formula: string;
  formulaDisplay: string;
  pairs: { a: number; b: number; output: number }[];
  candidates: { formula: string; display: string }[];
}

interface FormulaDetectiveAdditionalProps {
  machines?: MachineData[];
  showTeachingNotes?: boolean;
  allowCustomMachines?: boolean;
}

interface FormulaDetectiveToolProps {
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
    additionalProps?: FormulaDetectiveAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DEFAULT MACHINES ====================

const DEFAULT_MACHINES: MachineData[] = [
  {
    id: 1,
    label: "Formula Factory #1",
    difficulty: "Easy",
    formula: "2a-b",
    formulaDisplay: "2a − b",
    pairs: [
      { a: 5, b: 2, output: 8 },
      { a: 8, b: 1, output: 15 },
      { a: 9, b: 11, output: 7 },
      { a: 10, b: 10, output: 10 },
    ],
    candidates: [
      { formula: "a+b", display: "a + b" },
      { formula: "a-b", display: "a − b" },
      { formula: "a*b", display: "a × b" },
      { formula: "2a-b", display: "2a − b" },
    ],
  },
  {
    id: 2,
    label: "Formula Factory #2",
    difficulty: "Medium",
    formula: "a+2b",
    formulaDisplay: "a + 2b",
    pairs: [
      { a: 5, b: 2, output: 9 },
      { a: 8, b: 1, output: 10 },
      { a: 11, b: 10, output: 31 },
      { a: 10, b: 10, output: 30 },
    ],
    candidates: [
      { formula: "a+b", display: "a + b" },
      { formula: "2a+b", display: "2a + b" },
      { formula: "a+2b", display: "a + 2b" },
      { formula: "3a-b", display: "3a − b" },
    ],
  },
  {
    id: 3,
    label: "Formula Factory #3",
    difficulty: "Hard",
    formula: "3a-b+1",
    formulaDisplay: "3a − b + 1",
    pairs: [
      { a: 4, b: 1, output: 12 },
      { a: 6, b: 0, output: 19 },
      { a: 3, b: 2, output: 8 },
      { a: 10, b: 3, output: 28 },
    ],
    candidates: [
      { formula: "3a-b", display: "3a − b" },
      { formula: "2a+b+1", display: "2a + b + 1" },
      { formula: "3a-b+1", display: "3a − b + 1" },
      { formula: "3a+b-1", display: "3a + b − 1" },
    ],
  },
];

// ==================== DESIGN SYSTEM TOKENS ====================

const DS = {
  purple: "#4A4DC9",
  orange: "#FF7212",
  purpleDark: "#533086",
  orangeDark: "#FC9145",
  purpleLight: "#C1C1EA",
  orangeLight: "#FFF3E4",
  dark: "#4E4E4E",
  gray: "#CACACA",
  grayLight: "#EBEBEB",
  surface: "#F5F5F5",
  white: "#FFFFFF",
  green: "#22c55e",
  greenLight: "#dcfce7",
  red: "#ef4444",
  redLight: "#fee2e2",
  gradientPrimary: "linear-gradient(135deg, #533086 0%, #FC9145 100%)",
  gradientSubtle: "linear-gradient(135deg, #C1C1EA 0%, #FFF3E4 100%)",
  gradientPurple: "linear-gradient(135deg, #4A4DC9 0%, #533086 100%)",
  shadowSm: "0 2px 8px rgba(74,77,201,0.10)",
  shadowMd: "0 4px 16px rgba(74,77,201,0.14)",
  shadowLg: "0 8px 32px rgba(83,48,134,0.18)",
  shadowOrange: "0 4px 16px rgba(255,114,18,0.25)",
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusPill: 40,
  sp4: 4,
  sp8: 8,
  sp12: 12,
  sp16: 16,
  sp20: 20,
  sp24: 24,
  sp32: 32,
  sp40: 40,
};

// ==================== HELPERS ====================

const evaluateFormula = (formula: string, a: number, b: number): number => {
  switch (formula) {
    case "a+b":
      return a + b;
    case "a-b":
      return a - b;
    case "a*b":
      return a * b;
    case "2a-b":
      return 2 * a - b;
    case "2a+b":
      return 2 * a + b;
    case "a+2b":
      return a + 2 * b;
    case "3a-b":
      return 3 * a - b;
    case "3a-b+1":
      return 3 * a - b + 1;
    case "2a+b+1":
      return 2 * a + b + 1;
    case "3a+b-1":
      return 3 * a + b - 1;
    default:
      return 0;
  }
};

// ==================== KEYFRAMES ====================

const keyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes popIn {
        0% { transform: scale(0); opacity: 0; }
        70% { transform: scale(1.12); }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes tokenDrop {
        0% { transform: translateY(-70px) rotate(-10deg); opacity: 0; }
        50% { opacity: 1; }
        75% { transform: translateY(4px) rotate(2deg); }
        100% { transform: translateY(0) rotate(0deg); opacity: 1; }
    }
    @keyframes outputAppear {
        0% { transform: scale(0) rotate(-8deg); opacity: 0; }
        65% { transform: scale(1.18) rotate(2deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 16px rgba(74,77,201,0.25), 0 0 32px rgba(255,114,18,0.10); }
        50% { box-shadow: 0 0 32px rgba(74,77,201,0.45), 0 0 56px rgba(255,114,18,0.20); }
    }
    @keyframes gearSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes gearSpinReverse {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
    }
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(32px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes machineHum {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.015); }
    }
    @keyframes stepDotPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.35); }
    }
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes decoFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-6px) rotate(8deg); }
    }
`;

// ==================== DECORATIVE SHAPES (from design system) ====================

const DecoTriangle: React.FC<{
  size: number;
  color: string;
  style?: React.CSSProperties;
}> = ({ size, color, style }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
    <polygon
      points="20,4 36,36 4,36"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

const DecoCircle: React.FC<{
  size: number;
  color: string;
  filled?: boolean;
  style?: React.CSSProperties;
}> = ({ size, color, filled, style }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
    <circle
      cx="20"
      cy="20"
      r="16"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth="2.5"
      opacity={filled ? 0.18 : 1}
    />
  </svg>
);

const DecoSquare: React.FC<{
  size: number;
  color: string;
  style?: React.CSSProperties;
}> = ({ size, color, style }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
    <rect
      x="6"
      y="6"
      width="28"
      height="28"
      rx="3"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
    />
  </svg>
);

// ==================== GEAR SVG ====================

const GearSVG: React.FC<{
  size: number;
  color: string;
  reverse?: boolean;
  speed?: number;
}> = ({ size, color, reverse, speed = 4 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    style={{
      animation: `${reverse ? "gearSpinReverse" : "gearSpin"} ${speed}s linear infinite`,
    }}
  >
    <path
      d="M20 6 L22 2 L18 2 Z M20 34 L22 38 L18 38 Z M6 20 L2 22 L2 18 Z M34 20 L38 22 L38 18 Z M9.17 9.17 L6.34 6.34 L10 5 Z M30.83 30.83 L33.66 33.66 L30 35 Z M9.17 30.83 L6.34 33.66 L5 30 Z M30.83 9.17 L33.66 6.34 L35 10 Z"
      fill={color}
      opacity={0.45}
    />
    <circle cx="20" cy="20" r="11" fill="none" stroke={color} strokeWidth="3" />
    <circle cx="20" cy="20" r="5" fill={color} opacity={0.2} />
  </svg>
);

// ==================== DIFFICULTY BADGE ====================

const DifficultyBadge: React.FC<{ difficulty: "Easy" | "Medium" | "Hard" }> = ({
  difficulty,
}) => {
  const map = {
    Easy: {
      bg: DS.greenLight,
      text: "#166534",
      border: DS.green,
      icon: <Star size={13} />,
    },
    Medium: {
      bg: DS.orangeLight,
      text: "#9a3412",
      border: DS.orange,
      icon: (
        <svg
          width={13}
          height={13}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    Hard: {
      bg: DS.redLight,
      text: "#991b1b",
      border: DS.red,
      icon: (
        <svg
          width={13}
          height={13}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      ),
    },
  };
  const c = map[difficulty];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: DS.sp4,
        padding: `${DS.sp4}px ${DS.sp16}px`,
        borderRadius: DS.radiusPill,
        backgroundColor: c.bg,
        color: c.text,
        border: `2px solid ${c.border}`,
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: 0.3,
        lineHeight: "20px",
      }}
    >
      {c.icon}
      {difficulty}
    </span>
  );
};

// ==================== MACHINE GRAPHIC ====================

const MachineGraphic: React.FC<{
  machine: MachineData;
  currentPair: { a: number; b: number; output: number } | null;
  showOutput: boolean;
  solved: boolean;
  formulaText: string;
  animKey: number;
}> = ({ machine, currentPair, showOutput, solved, formulaText, animKey }) => {
  return (
    <div
      style={{
        position: "relative",
        width: 260,
        height: 310,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Decorative background shapes */}
      <DecoTriangle
        size={28}
        color={DS.purpleLight}
        style={{
          position: "absolute",
          top: -8,
          left: -12,
          opacity: 0.5,
          animation: "decoFloat 6s ease-in-out infinite",
        }}
      />
      <DecoCircle
        size={22}
        color={DS.orangeDark}
        filled
        style={{
          position: "absolute",
          top: 10,
          right: -14,
          opacity: 0.5,
          animation: "decoFloat 5s ease-in-out 1s infinite",
        }}
      />
      <DecoSquare
        size={20}
        color={DS.purpleLight}
        style={{
          position: "absolute",
          bottom: 30,
          left: -16,
          opacity: 0.4,
          animation: "decoFloat 7s ease-in-out 2s infinite",
        }}
      />

      {/* Input Funnels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: -8,
          zIndex: 2,
        }}
      >
        {/* Funnel A */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: DS.purple,
              marginBottom: DS.sp4,
              letterSpacing: 0.8,
            }}
          >
            a
          </div>
          <div
            style={{
              width: 56,
              height: 48,
              background: DS.gradientPurple,
              borderRadius: `${DS.radiusMd}px ${DS.radiusMd}px ${DS.radiusSm}px ${DS.radiusSm}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: DS.shadowMd,
            }}
          >
            {currentPair && (
              <span
                key={`a-${animKey}`}
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800,
                  fontSize: 22,
                  color: DS.white,
                  animation: "tokenDrop 0.55s ease-out both",
                }}
              >
                {currentPair.a}
              </span>
            )}
          </div>
          <div
            style={{
              width: 8,
              height: 28,
              background: DS.gradientPurple,
              borderRadius: 4,
            }}
          />
        </div>
        {/* Funnel B */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: DS.orange,
              marginBottom: DS.sp4,
              letterSpacing: 0.8,
            }}
          >
            b
          </div>
          <div
            style={{
              width: 56,
              height: 48,
              background: `linear-gradient(135deg, ${DS.orange} 0%, ${DS.orangeDark} 100%)`,
              borderRadius: `${DS.radiusMd}px ${DS.radiusMd}px ${DS.radiusSm}px ${DS.radiusSm}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: DS.shadowOrange,
            }}
          >
            {currentPair && (
              <span
                key={`b-${animKey}`}
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800,
                  fontSize: 22,
                  color: DS.white,
                  animation: "tokenDrop 0.55s ease-out 0.12s both",
                }}
              >
                {currentPair.b}
              </span>
            )}
          </div>
          <div
            style={{
              width: 8,
              height: 28,
              background: `linear-gradient(180deg, ${DS.orange}, ${DS.orangeDark})`,
              borderRadius: 4,
            }}
          />
        </div>
      </div>

      {/* Machine Body */}
      <div
        style={{
          width: 210,
          height: 130,
          borderRadius: DS.radiusLg,
          background: solved
            ? DS.gradientPrimary
            : "linear-gradient(145deg, #3d3568 0%, #2b2645 100%)",
          border: `3px solid ${solved ? DS.orangeDark : "#4a4275"}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: solved
            ? "0 8px 28px rgba(83,48,134,0.45)"
            : "0 6px 20px rgba(0,0,0,0.25)",
          animation: solved
            ? "pulseGlow 2.2s ease-in-out infinite"
            : currentPair
              ? "machineHum 0.7s ease-in-out infinite"
              : "none",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div style={{ position: "absolute", top: 8, left: 10, opacity: 0.25 }}>
          <GearSVG size={28} color={DS.purpleLight} speed={3} />
        </div>
        <div
          style={{ position: "absolute", bottom: 8, right: 10, opacity: 0.25 }}
        >
          <GearSVG size={22} color={DS.orangeLight} reverse speed={4.5} />
        </div>
        <div
          style={{ position: "absolute", top: 14, right: 16, opacity: 0.15 }}
        >
          <GearSVG size={16} color={DS.white} speed={6} />
        </div>
        {solved ? (
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: 26,
              color: DS.white,
              animation: "popIn 0.5s ease-out both",
              zIndex: 1,
              letterSpacing: 1,
              textShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}
          >
            {formulaText}
          </div>
        ) : (
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              color: DS.purpleLight,
              opacity: 0.55,
              textAlign: "center",
              lineHeight: 1.4,
              zIndex: 1,
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 2 }}>?</div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 1.5,
                textTransform: "uppercase" as const,
              }}
            >
              Secret Formula
            </div>
          </div>
        )}
        {!solved && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3.5s linear infinite",
            }}
          />
        )}
      </div>

      {/* Output */}
      <div
        style={{
          width: 8,
          height: 18,
          background: DS.gradientPrimary,
          borderRadius: 4,
          marginTop: -2,
        }}
      />
      <div
        style={{
          width: 76,
          height: 52,
          borderRadius: `${DS.radiusSm}px ${DS.radiusSm}px ${DS.radiusLg}px ${DS.radiusLg}px`,
          background: showOutput
            ? `linear-gradient(180deg, ${DS.green} 0%, #16a34a 100%)`
            : `linear-gradient(180deg, ${DS.gray} 0%, #a0a0a0 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: showOutput
            ? "0 4px 14px rgba(34,197,94,0.35)"
            : DS.shadowSm,
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {showOutput && currentPair && (
          <span
            key={`out-${animKey}`}
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: 26,
              color: DS.white,
              animation: "outputAppear 0.5s ease-out 0.35s both",
            }}
          >
            {currentPair.output}
          </span>
        )}
      </div>
    </div>
  );
};

// ==================== CANDIDATE ROW ====================

const CandidateRow: React.FC<{
  candidate: { formula: string; display: string };
  pair: { a: number; b: number; output: number };
  revealed: boolean;
  animDelay: number;
}> = ({ candidate, pair, revealed, animDelay }) => {
  const result = evaluateFormula(candidate.formula, pair.a, pair.b);
  const isCorrect = result === pair.output;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: DS.sp8,
        padding: `${DS.sp8}px ${DS.sp16}px`,
        borderRadius: DS.radiusSm,
        backgroundColor: revealed
          ? isCorrect
            ? "rgba(34,197,94,0.08)"
            : "rgba(239,68,68,0.06)"
          : DS.surface,
        border: `2px solid ${revealed ? (isCorrect ? DS.green : DS.red) : DS.grayLight}`,
        animation: revealed
          ? `fadeInUp 0.4s ease-out ${animDelay}s both`
          : "none",
        transition: "all 0.3s ease",
        opacity: revealed ? 1 : 0.45,
      }}
    >
      <span
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          color: DS.dark,
          minWidth: 76,
        }}
      >
        {candidate.display}
      </span>
      <span
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 13,
          color: DS.gray,
        }}
      >
        →
      </span>
      {revealed && (
        <>
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 12,
              color: DS.dark,
              opacity: 0.65,
              flex: 1,
            }}
          >
            {candidate.display
              .replace(/a/g, String(pair.a))
              .replace(/b/g, String(pair.b))}{" "}
            = {result}
          </span>
          <span style={{ flexShrink: 0 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                backgroundColor: isCorrect ? DS.green : DS.red,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isCorrect ? (
                <Check size={14} color={DS.white} strokeWidth={3} />
              ) : (
                <X size={14} color={DS.white} strokeWidth={3} />
              )}
            </div>
          </span>
        </>
      )}
    </div>
  );
};

// ==================== VERIFICATION TABLE ====================

const VerificationTable: React.FC<{ machine: MachineData }> = ({ machine }) => (
  <div
    style={{
      borderRadius: DS.radiusSm,
      overflow: "hidden",
      border: `2px solid ${DS.grayLight}`,
      animation: "fadeInUp 0.5s ease-out both",
    }}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1.4fr 1fr 48px",
        background: DS.gradientPrimary,
        padding: `${DS.sp8}px ${DS.sp16}px`,
      }}
    >
      {["a", "b", "Formula", "Output", ""].map((h, i) => (
        <span
          key={i}
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: 12,
            color: DS.white,
            textAlign: "center",
            letterSpacing: 0.5,
          }}
        >
          {h}
        </span>
      ))}
    </div>
    {machine.pairs.map((pair, idx) => (
      <div
        key={idx}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1.4fr 1fr 48px",
          padding: `${DS.sp8}px ${DS.sp16}px`,
          backgroundColor: idx % 2 === 0 ? DS.white : DS.surface,
          animation: `fadeInUp 0.4s ease-out ${0.1 * idx}s both`,
        }}
      >
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            textAlign: "center",
            color: DS.purple,
          }}
        >
          {pair.a}
        </span>
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            textAlign: "center",
            color: DS.orange,
          }}
        >
          {pair.b}
        </span>
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
            fontSize: 11,
            textAlign: "center",
            color: DS.dark,
            opacity: 0.7,
          }}
        >
          {machine.formulaDisplay
            .replace(/a/g, String(pair.a))
            .replace(/b/g, String(pair.b))}
        </span>
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            fontSize: 16,
            textAlign: "center",
            color: DS.green,
          }}
        >
          {pair.output}
        </span>
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: DS.green,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={12} color={DS.white} strokeWidth={3} />
          </div>
        </span>
      </div>
    ))}
  </div>
);

// ==================== MAIN COMPONENT ====================

const FormulaDetectiveTool = ({
  props: rawProps,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}: FormulaDetectiveToolProps) => {
  const props = rawProps ?? {};
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      showNavigation: props.showNavigation ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      animationSpeed: props.animationSpeed ?? 1,
    }),
    [
      props.width,
      props.height,
      props.showNavigation,
      props.showStepIndicator,
      props.animationSpeed,
    ],
  );

  const additionalProps = props.additionalProps ?? {};
  const machines: MachineData[] = additionalProps.machines ?? DEFAULT_MACHINES;

  const [globalStep, setGlobalStep] = useState(0);
  const [revealedPairs, setRevealedPairs] = useState(0);
  const [showCandidates, setShowCandidates] = useState(false);
  const [candidatesRevealed, setCandidatesRevealed] = useState(0);
  const [machineSolved, setMachineSolved] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const totalSteps = machines.length * 2;
  const currentMachineIndex = Math.floor(globalStep / 2);
  const isVerifyStep = globalStep % 2 === 1;
  const currentMachine = machines[currentMachineIndex] || machines[0];

  useEffect(() => {
    setRevealedPairs(0);
    setShowCandidates(false);
    setCandidatesRevealed(0);
    setMachineSolved(false);
    setShowOutput(false);
    setAnimKey((p) => p + 1);
  }, [currentMachineIndex, isVerifyStep]);

  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: globalStep + 1,
        totalSteps,
        isPaused: true,
        currentMode: "learn",
      });
  }, [globalStep, totalSteps, setStepDetails]);

  useEffect(() => {
    if (isVerifyStep) return;
    const t: Array<ReturnType<typeof setTimeout>> = [];
    currentMachine.pairs.forEach((_, i) => {
      t.push(
        setTimeout(
          () => {
            setRevealedPairs(i + 1);
            setShowOutput(true);
            setAnimKey((p) => p + 1);
            if (i < currentMachine.pairs.length - 1)
              t.push(setTimeout(() => setShowOutput(false), 1100));
          },
          1400 * (i + 1),
        ),
      );
    });
    t.push(
      setTimeout(
        () => setShowCandidates(true),
        1400 * currentMachine.pairs.length + 700,
      ),
    );
    currentMachine.candidates.forEach((_, i) => {
      t.push(
        setTimeout(
          () => setCandidatesRevealed(i + 1),
          1400 * currentMachine.pairs.length + 1100 + 550 * (i + 1),
        ),
      );
    });
    t.push(
      setTimeout(
        () => setMachineSolved(true),
        1400 * currentMachine.pairs.length +
          1100 +
          550 * currentMachine.candidates.length +
          400,
      ),
    );
    return () => t.forEach(clearTimeout);
  }, [globalStep, isVerifyStep, currentMachine]);

  useEffect(() => {
    if (!isVerifyStep) return;
    setRevealedPairs(currentMachine.pairs.length);
    setShowOutput(true);
    setMachineSolved(true);
  }, [isVerifyStep, currentMachine]);

  const goNext = useCallback(() => {
    if (globalStep >= totalSteps - 1) return;
    setTransitioning(true);
    setTimeout(() => {
      setGlobalStep((p) => p + 1);
      setTransitioning(false);
    }, 280);
  }, [globalStep, totalSteps]);
  const goPrev = useCallback(() => {
    if (globalStep <= 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setGlobalStep((p) => p - 1);
      setTransitioning(false);
    }, 280);
  }, [globalStep]);
  const resetAll = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setGlobalStep(0);
      setTransitioning(false);
    }, 280);
  }, []);

  useEffect(() => {
    const id = "formula-detective-ds-kf";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = keyframes;
      document.head.appendChild(s);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) document.head.removeChild(el);
    };
  }, []);

  const visiblePair =
    revealedPairs > 0 ? currentMachine.pairs[revealedPairs - 1] : null;
  const getHint = (i: number) =>
    [
      "💡 Start with simple operations like a + b, a − b, then try 2a − b.",
      "💡 Same inputs (5, 2) give a DIFFERENT output. The formula must differ from Machine 1!",
      "💡 This formula might include a constant — a number without a variable!",
    ][i] || "";

  const btnBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: DS.sp8,
    padding: `${DS.sp8}px ${DS.sp24}px`,
    height: DS.sp40,
    borderRadius: DS.radiusSm,
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    letterSpacing: 0.3,
    outline: "none",
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: config.width,
        margin: "0 auto",
        fontFamily: "'Poppins', sans-serif",
        background: DS.white,
        borderRadius: DS.radiusXl,
        overflow: "hidden",
        boxShadow: DS.shadowLg,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: DS.gradientPrimary,
          backgroundSize: "200% 200%",
          animation: "gradientShift 8s ease infinite",
          padding: `${DS.sp16}px ${DS.sp24}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: DS.sp12,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <DecoCircle
          size={60}
          color="rgba(255,255,255,0.08)"
          filled
          style={{ position: "absolute", top: -20, right: 40 }}
        />
        <DecoTriangle
          size={40}
          color="rgba(255,255,255,0.06)"
          style={{ position: "absolute", bottom: -10, right: 120 }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: DS.sp12,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: DS.radiusMd,
              backgroundColor: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GearSVG size={26} color={DS.white} speed={6} />
          </div>
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 18,
                color: DS.white,
                lineHeight: 1.15,
                letterSpacing: 0.5,
              }}
            >
              Formula Detective
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.7)",
                fontWeight: 500,
                letterSpacing: 0.8,
              }}
            >
              Crack the secret formula!
            </div>
          </div>
        </div>
        {config.showStepIndicator && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: DS.sp8,
              zIndex: 1,
            }}
          >
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === globalStep ? 24 : 8,
                  height: 8,
                  borderRadius: DS.radiusPill,
                  backgroundColor:
                    i === globalStep
                      ? DS.white
                      : i < globalStep
                        ? "rgba(255,255,255,0.55)"
                        : "rgba(255,255,255,0.2)",
                  transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                  animation:
                    i === globalStep
                      ? "stepDotPulse 1.5s ease-in-out infinite"
                      : "none",
                }}
              />
            ))}
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.6)",
                fontWeight: 600,
                marginLeft: DS.sp8,
              }}
            >
              {globalStep + 1}/{totalSteps}
            </span>
          </div>
        )}
      </div>

      {/* TITLE BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${DS.sp12}px ${DS.sp24}px`,
          borderBottom: `2px solid ${DS.grayLight}`,
          backgroundColor: DS.white,
          flexWrap: "wrap",
          gap: DS.sp8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: DS.sp12 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: DS.dark }}>
            {currentMachine.label}
          </span>
          <DifficultyBadge difficulty={currentMachine.difficulty} />
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: DS.gray,
            padding: `${DS.sp4}px ${DS.sp12}px`,
            borderRadius: DS.radiusPill,
            backgroundColor: DS.surface,
          }}
        >
          {isVerifyStep ? "✅ Verification" : "🔍 Discovery"}
        </span>
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          padding: DS.sp24,
          display: "flex",
          flexDirection: "column",
          gap: DS.sp20,
          opacity: transitioning ? 0 : 1,
          transition: "opacity 0.28s ease",
          overflowY: "auto",
          background: DS.surface,
          minHeight: 380,
        }}
      >
        {!isVerifyStep ? (
          <div
            style={{
              display: "flex",
              gap: DS.sp24,
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: DS.sp12,
                animation: "fadeInUp 0.5s ease-out both",
              }}
            >
              <MachineGraphic
                machine={currentMachine}
                currentPair={visiblePair}
                showOutput={showOutput}
                solved={machineSolved}
                formulaText={currentMachine.formulaDisplay}
                animKey={animKey}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: DS.sp4,
                  width: "100%",
                  marginTop: DS.sp4,
                }}
              >
                {currentMachine.pairs
                  .slice(0, revealedPairs)
                  .map((pair, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: DS.sp8,
                        padding: `${DS.sp4}px ${DS.sp12}px`,
                        borderRadius: DS.radiusSm,
                        backgroundColor: DS.white,
                        border: `1.5px solid ${DS.grayLight}`,
                        animation: `slideInRight 0.35s ease-out ${0.08 * idx}s both`,
                        fontSize: 13,
                        fontWeight: 600,
                        color: DS.dark,
                        boxShadow: DS.shadowSm,
                      }}
                    >
                      <span style={{ color: DS.purple, fontWeight: 700 }}>
                        ({pair.a}, {pair.b})
                      </span>
                      <span style={{ color: DS.gray }}>→</span>
                      <span
                        style={{
                          color: DS.green,
                          fontWeight: 800,
                          fontSize: 15,
                        }}
                      >
                        {pair.output}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 250,
                maxWidth: 370,
                display: "flex",
                flexDirection: "column",
                gap: DS.sp12,
              }}
            >
              <div
                style={{
                  padding: `${DS.sp16}px ${DS.sp20}px`,
                  borderRadius: DS.radiusMd,
                  backgroundColor: DS.white,
                  border: `2px solid ${DS.grayLight}`,
                  animation: "fadeInUp 0.5s ease-out 0.15s both",
                  boxShadow: DS.shadowSm,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: DS.purple,
                    marginBottom: DS.sp8,
                    display: "flex",
                    alignItems: "center",
                    gap: DS.sp8,
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: DS.radiusSm,
                      background: DS.gradientSubtle,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                    }}
                  >
                    🕵️
                  </span>
                  Your Mission
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: DS.dark,
                    lineHeight: 1.6,
                    opacity: 0.8,
                  }}
                >
                  Watch the inputs drop in and the output appear. Can you figure
                  out the secret formula before it's revealed?
                </div>
                <div
                  style={{
                    marginTop: DS.sp8,
                    fontSize: 12,
                    color: DS.orangeDark,
                    fontWeight: 600,
                    fontStyle: "italic",
                    padding: `${DS.sp8}px ${DS.sp12}px`,
                    borderRadius: DS.radiusSm,
                    backgroundColor: DS.orangeLight,
                  }}
                >
                  {getHint(currentMachineIndex)}
                </div>
              </div>
              {showCandidates && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: DS.sp8,
                    animation: "fadeInUp 0.4s ease-out both",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: DS.dark,
                      marginBottom: DS.sp4,
                    }}
                  >
                    Testing candidates with{" "}
                    <span style={{ color: DS.purple }}>({visiblePair?.a}</span>,{" "}
                    <span style={{ color: DS.orange }}>{visiblePair?.b}</span>):
                  </div>
                  {currentMachine.candidates.map((c, i) => (
                    <CandidateRow
                      key={c.formula}
                      candidate={c}
                      pair={visiblePair || currentMachine.pairs[0]}
                      revealed={i < candidatesRevealed}
                      animDelay={0.08 * i}
                    />
                  ))}
                </div>
              )}
              {machineSolved && (
                <div
                  style={{
                    padding: `${DS.sp16}px ${DS.sp20}px`,
                    borderRadius: DS.radiusMd,
                    background: DS.gradientSubtle,
                    border: `2px solid ${DS.green}`,
                    animation: "popIn 0.5s ease-out both",
                    display: "flex",
                    alignItems: "center",
                    gap: DS.sp12,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: DS.green,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Check size={20} color={DS.white} strokeWidth={3} />
                  </div>
                  <div>
                    <div
                      style={{ fontWeight: 700, fontSize: 15, color: DS.green }}
                    >
                      Formula Cracked!
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: DS.dark,
                        fontWeight: 500,
                        opacity: 0.8,
                      }}
                    >
                      The secret formula is{" "}
                      <strong style={{ color: DS.purple, fontWeight: 800 }}>
                        {currentMachine.formulaDisplay}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: DS.sp16,
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: DS.sp24,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <MachineGraphic
                machine={currentMachine}
                currentPair={visiblePair}
                showOutput={true}
                solved={true}
                formulaText={currentMachine.formulaDisplay}
                animKey={animKey}
              />
              <div
                style={{
                  padding: `${DS.sp20}px ${DS.sp24}px`,
                  borderRadius: DS.radiusMd,
                  backgroundColor: DS.white,
                  border: `2px solid ${DS.grayLight}`,
                  maxWidth: 370,
                  animation: "fadeInUp 0.5s ease-out 0.15s both",
                  boxShadow: DS.shadowMd,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: DS.purple,
                    marginBottom: DS.sp12,
                    display: "flex",
                    alignItems: "center",
                    gap: DS.sp8,
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: DS.radiusSm,
                      background: DS.gradientSubtle,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                    }}
                  >
                    ✅
                  </span>
                  Verification: {currentMachine.formulaDisplay}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: DS.dark,
                    lineHeight: 1.5,
                    marginBottom: DS.sp12,
                    opacity: 0.75,
                  }}
                >
                  Let's verify the formula works for ALL input-output pairs:
                </div>
                <VerificationTable machine={currentMachine} />
                <div
                  style={{
                    marginTop: DS.sp12,
                    fontSize: 13,
                    color: DS.green,
                    fontWeight: 700,
                    textAlign: "center",
                    padding: DS.sp8,
                    borderRadius: DS.radiusSm,
                    backgroundColor: DS.greenLight,
                  }}
                >
                  ✨ All pairs match! Formula confirmed.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NAVIGATION — Singularity Button System: Contained / Outlined / Text */}
      {config.showNavigation && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `${DS.sp12}px ${DS.sp24}px`,
            borderTop: `2px solid ${DS.grayLight}`,
            backgroundColor: DS.white,
            flexWrap: "wrap",
            gap: DS.sp8,
          }}
        >
          {/* Outlined button */}
          <button
            onClick={goPrev}
            disabled={globalStep === 0}
            onMouseEnter={() => setHoveredBtn("prev")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              ...btnBase,
              background:
                hoveredBtn === "prev" && globalStep > 0 ? DS.surface : DS.white,
              color: globalStep === 0 ? DS.gray : DS.purple,
              border: `2px solid ${globalStep === 0 ? DS.grayLight : hoveredBtn === "prev" ? DS.purple : DS.purpleLight}`,
              cursor: globalStep === 0 ? "not-allowed" : "pointer",
              opacity: globalStep === 0 ? 0.6 : 1,
              boxShadow:
                hoveredBtn === "prev" && globalStep > 0 ? DS.shadowSm : "none",
            }}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          {/* Text button */}
          <button
            onClick={resetAll}
            onMouseEnter={() => setHoveredBtn("reset")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              ...btnBase,
              background: hoveredBtn === "reset" ? DS.surface : "transparent",
              color: DS.dark,
              border: "2px solid transparent",
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
          {/* Contained button */}
          <button
            onClick={goNext}
            disabled={globalStep >= totalSteps - 1}
            onMouseEnter={() => setHoveredBtn("next")}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              ...btnBase,
              background:
                globalStep >= totalSteps - 1
                  ? DS.grayLight
                  : hoveredBtn === "next"
                    ? DS.gradientPrimary
                    : DS.gradientPurple,
              color: globalStep >= totalSteps - 1 ? DS.gray : DS.white,
              border: "none",
              cursor: globalStep >= totalSteps - 1 ? "not-allowed" : "pointer",
              boxShadow:
                globalStep >= totalSteps - 1
                  ? "none"
                  : hoveredBtn === "next"
                    ? DS.shadowLg
                    : DS.shadowMd,
              transform:
                hoveredBtn === "next" && globalStep < totalSteps - 1
                  ? "translateY(-1px)"
                  : "translateY(0)",
            }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FormulaDetectiveTool;
