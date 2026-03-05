// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: parity_checker_tool.tsx
// Redesigned using Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

// @ts-ignore - React types/module resolution handled at app level
import React, { useState, useEffect, useCallback } from "react";
// @ts-ignore - Icon library types/module resolution handled at app level
import { ChevronLeft, ChevronRight, RotateCcw, Plus } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface ParityAdditionalProps {
  customExamples?: { a: number; b: number; label?: string }[];
  showAllStepsAtOnce?: boolean;
  accentEven?: string;
  accentOdd?: string;
}

interface ParityCheckerToolProps {
  props?: {
    width?: number;
    height?: number;
    initialStep?: number;
    filterSteps?: number[];
    animationSpeed?: number;
    themeColor?: string;
    darkMode?: boolean;
    showNavigation?: boolean;
    showStepIndicator?: boolean;
    additionalProps?: ParityAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

interface DotGroup {
  count: number;
  color: string;
  label: string;
  parity: "even" | "odd";
}

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  purple: "#4A4DC9",
  orange: "#FF7212",
  gradDeep: "#533086",
  gradWarm: "#FC9145",
  lavender: "#C1C1EA",
  peach: "#FFF3E4",
  dark: "#4E4E4E",
  grey: "#CACACA",
  lightGrey: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  success: "#2DB87A",
  error: "#E04545",
  font: "'Poppins', sans-serif",
  btnPadX: 24,
  btnPadY: 10,
  btnRadius: 24,
  cardRadius: 16,
  dotSize: 20,
  dotGap: 7,
};

const gradient = (deg = 135) =>
  `linear-gradient(${deg}deg, ${DS.gradDeep} 0%, ${DS.gradWarm} 100%)`;
const tintGradient = (deg = 135) =>
  `linear-gradient(${deg}deg, ${DS.lavender}44 0%, ${DS.peach}66 100%)`;

// ==================== PHASE DATA ====================

interface PhaseData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  groupA?: DotGroup;
  groupB?: DotGroup;
  resultParity?: "even" | "odd";
  resultExplanation?: string;
  realWorldExample?: string;
  showPrediction?: boolean;
  isSummary?: boolean;
}

const PHASES: PhaseData[] = [
  {
    id: 1,
    title: "What is Parity?",
    subtitle: "Even & Odd Numbers",
    description:
      "Every number is either EVEN or ODD. An even number can be perfectly split into pairs — like distributing chapatis equally between two friends. An odd number always has one leftover!",
    groupA: { count: 6, color: DS.purple, label: "6 (Even)", parity: "even" },
    groupB: { count: 7, color: DS.orange, label: "7 (Odd)", parity: "odd" },
    realWorldExample:
      "🍞 If you have 6 chapatis, you can give 3 each to 2 friends. But with 7, someone gets an extra one!",
    showPrediction: false,
  },
  {
    id: 2,
    title: "Even + Even",
    subtitle: "What happens when two even numbers are added?",
    description:
      "When we add two even numbers, every dot can be paired up. No leftovers! So the sum is always EVEN.",
    groupA: { count: 4, color: DS.purple, label: "4 (Even)", parity: "even" },
    groupB: { count: 6, color: DS.purple, label: "6 (Even)", parity: "even" },
    resultParity: "even",
    resultExplanation:
      "4 + 6 = 10 → All dots pair up perfectly. The sum is EVEN!",
    realWorldExample:
      "📖 If a book chapter starts on page 4 and is 6 pages long, it ends on page 10 — an even number.",
    showPrediction: true,
  },
  {
    id: 3,
    title: "Odd + Odd",
    subtitle: "What happens when two odd numbers are added?",
    description:
      "Each odd number has one leftover dot. When we combine them, the two leftovers pair up together! So the sum is always EVEN.",
    groupA: { count: 5, color: DS.orange, label: "5 (Odd)", parity: "odd" },
    groupB: { count: 3, color: DS.orange, label: "3 (Odd)", parity: "odd" },
    resultParity: "even",
    resultExplanation:
      "5 + 3 = 8 → The two leftover dots combine into a pair. The sum is EVEN!",
    realWorldExample:
      "🍞 5 chapatis + 3 chapatis = 8 chapatis. Now they can be split equally into groups of 2!",
    showPrediction: true,
  },
  {
    id: 4,
    title: "Even + Odd",
    subtitle: "What happens when an even and an odd number are added?",
    description:
      "The even number pairs up perfectly, but the odd number still has one leftover. That leftover remains unpaired! So the sum is always ODD.",
    groupA: { count: 4, color: DS.purple, label: "4 (Even)", parity: "even" },
    groupB: { count: 5, color: DS.orange, label: "5 (Odd)", parity: "odd" },
    resultParity: "odd",
    resultExplanation:
      "4 + 5 = 9 → One dot is left without a partner. The sum is ODD!",
    realWorldExample:
      "📖 Page 4 + 5 more pages = Page 9. Odd page numbers are always on the right side of a book!",
    showPrediction: true,
  },
  {
    id: 5,
    title: "Consecutive Numbers",
    subtitle: "Numbers that are next to each other",
    description:
      "Consecutive numbers always have different parity — one is even and the other is odd. So their sum is always ODD! This is why Martin and Maria (whose ages differ by 1 year) can never have ages that add up to 112.",
    groupA: { count: 6, color: DS.purple, label: "6 (Even)", parity: "even" },
    groupB: { count: 7, color: DS.orange, label: "7 (Odd)", parity: "odd" },
    resultParity: "odd",
    resultExplanation: "6 + 7 = 13 → Consecutive numbers always sum to ODD!",
    realWorldExample:
      "🧮 Lakpa's puzzle: Can an odd number of ₹1 coins + odd number of ₹5 coins + even number of ₹10 coins = ₹205? Think about parity!",
    showPrediction: true,
  },
  {
    id: 6,
    title: "Parity Rules Summary",
    subtitle: "All Addition Rules at a Glance",
    description:
      "Here are all the parity rules for addition. Remember: it's all about whether the leftover dots can pair up!",
    isSummary: true,
    showPrediction: false,
  },
];

// ==================== DOT PAIRING DIAGRAM ====================

const DotPairingDiagram: React.FC<{
  groupA?: DotGroup;
  groupB?: DotGroup;
  resultParity?: "even" | "odd";
  revealed: boolean;
  animPhase: number;
}> = ({ groupA, groupB, resultParity, revealed, animPhase }) => {
  if (!groupA || !groupB) return null;

  const renderDotGroup = (group: DotGroup, side: "left" | "right") => {
    const pairs = Math.floor(group.count / 2);
    const leftover = group.count % 2;
    const dots: React.ReactNode[] = [];

    for (let p = 0; p < pairs; p++) {
      dots.push(
        <div
          key={`pair-${p}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: `${DS.dotGap}px`,
            marginBottom: `${DS.dotGap + 1}px`,
            animation: `sg-popIn 0.4s ease-out ${p * 0.07}s both`,
          }}
        >
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                width: DS.dotSize,
                height: DS.dotSize,
                borderRadius: "50%",
                backgroundColor: group.color,
                boxShadow: `0 2px 8px ${group.color}30`,
                transition: "all 0.4s ease",
              }}
            />
          ))}
          <svg
            width="8"
            height={DS.dotSize}
            style={{ marginLeft: "-4px", opacity: 0.3, flexShrink: 0 }}
          >
            <path
              d={`M1,3 Q7,${DS.dotSize / 2} 1,${DS.dotSize - 3}`}
              fill="none"
              stroke={group.color}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>,
      );
    }

    if (leftover > 0) {
      const isGlowing = revealed && resultParity === "odd" && animPhase >= 2;
      const isPairing =
        revealed &&
        resultParity === "even" &&
        group.parity === "odd" &&
        animPhase >= 2;
      dots.push(
        <div
          key="leftover"
          style={{
            display: "flex",
            alignItems: "center",
            gap: `${DS.dotGap}px`,
            marginBottom: `${DS.dotGap}px`,
            animation: `sg-popIn 0.4s ease-out ${pairs * 0.07}s both`,
          }}
        >
          <div
            style={{
              width: DS.dotSize,
              height: DS.dotSize,
              borderRadius: "50%",
              backgroundColor: isGlowing
                ? DS.error
                : isPairing
                  ? DS.success
                  : group.color,
              boxShadow: isGlowing
                ? `0 0 0 4px ${DS.error}20, 0 0 20px ${DS.error}50`
                : isPairing
                  ? `0 0 0 4px ${DS.success}20, 0 0 16px ${DS.success}40`
                  : `0 2px 8px ${group.color}30`,
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              animation: isGlowing
                ? "sg-pulse 1.4s ease-in-out infinite"
                : isPairing
                  ? "sg-bounce 0.6s ease-out"
                  : "none",
              border: isGlowing
                ? `2.5px solid ${DS.error}`
                : isPairing
                  ? `2.5px solid ${DS.success}`
                  : "2.5px solid transparent",
            }}
          />
          {!revealed && (
            <span
              style={{
                fontSize: "9.5px",
                color: DS.grey,
                fontFamily: DS.font,
                fontWeight: 500,
                fontStyle: "italic",
              }}
            >
              leftover
            </span>
          )}
        </div>,
      );
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: side === "left" ? "flex-end" : "flex-start",
          padding: "14px 16px",
          flex: 1,
        }}
      >
        <div
          style={{
            fontSize: "11.5px",
            fontWeight: 600,
            color: group.color,
            marginBottom: "10px",
            fontFamily: DS.font,
            letterSpacing: "0.2px",
            padding: "3px 14px",
            borderRadius: "20px",
            backgroundColor:
              group.parity === "even" ? `${DS.lavender}55` : DS.peach,
          }}
        >
          {group.label}
        </div>
        {dots}
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "18px 10px",
        background: tintGradient(),
        borderRadius: `${DS.cardRadius}px`,
        border: `1.5px solid ${DS.lightGrey}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative geometric accents */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 14,
          opacity: 0.06,
          width: 55,
          height: 55,
          border: `3px solid ${DS.purple}`,
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 14,
          opacity: 0.06,
          width: 0,
          height: 0,
          borderLeft: "22px solid transparent",
          borderRight: "22px solid transparent",
          borderBottom: `38px solid ${DS.orange}`,
        }}
      />

      {renderDotGroup(groupA, "left")}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          paddingTop: "42px",
          minWidth: "56px",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: gradient(),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 14px ${DS.gradDeep}30`,
            opacity: animPhase >= 1 ? 1 : 0.2,
            transition: "opacity 0.5s ease",
          }}
        >
          <Plus size={18} color={DS.white} strokeWidth={3} />
        </div>
        {revealed && animPhase >= 2 && (
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              fontFamily: DS.font,
              color: DS.white,
              backgroundColor: resultParity === "even" ? DS.purple : DS.orange,
              padding: "5px 14px",
              borderRadius: "20px",
              animation: "sg-popIn 0.5s ease-out both",
              whiteSpace: "nowrap",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              boxShadow: `0 3px 10px ${resultParity === "even" ? DS.purple : DS.orange}40`,
            }}
          >
            = {resultParity === "even" ? "Even" : "Odd"}
          </div>
        )}
      </div>

      {renderDotGroup(groupB, "right")}

      {revealed && animPhase >= 3 && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "10px",
            color: DS.grey,
            fontFamily: DS.font,
            fontStyle: "italic",
            animation: "sg-fadeInUp 0.5s ease-out both",
            whiteSpace: "nowrap",
            fontWeight: 500,
          }}
        >
          {resultParity === "even"
            ? "✓ All dots found partners"
            : "✗ One dot left alone"}
        </div>
      )}
    </div>
  );
};

// ==================== SUMMARY TABLE ====================

const SummaryTable: React.FC<{ animPhase: number }> = ({ animPhase }) => {
  const rules = [
    {
      a: "Even",
      b: "Even",
      result: "Even",
      cA: DS.purple,
      cB: DS.purple,
      cR: DS.purple,
      bgR: DS.lavender,
    },
    {
      a: "Odd",
      b: "Odd",
      result: "Even",
      cA: DS.orange,
      cB: DS.orange,
      cR: DS.purple,
      bgR: DS.lavender,
    },
    {
      a: "Even",
      b: "Odd",
      result: "Odd",
      cA: DS.purple,
      cB: DS.orange,
      cR: DS.orange,
      bgR: DS.peach,
    },
    {
      a: "Odd",
      b: "Even",
      result: "Odd",
      cA: DS.orange,
      cB: DS.purple,
      cR: DS.orange,
      bgR: DS.peach,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: `${DS.cardRadius}px`,
        border: `1.5px solid ${DS.lightGrey}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 36px 1fr 36px 1fr",
          alignItems: "center",
          padding: "13px 20px",
          background: gradient(),
          fontWeight: 600,
          fontSize: "11px",
          color: DS.white,
          fontFamily: DS.font,
          textTransform: "uppercase",
          letterSpacing: "1.2px",
          textAlign: "center",
        }}
      >
        <span>First</span>
        <span style={{ fontSize: "14px" }}>+</span>
        <span>Second</span>
        <span style={{ fontSize: "14px" }}>=</span>
        <span>Result</span>
      </div>

      {rules.map((rule, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 36px 1fr 36px 1fr",
            alignItems: "center",
            padding: "14px 20px",
            backgroundColor: i % 2 === 0 ? DS.white : DS.offWhite,
            borderBottom:
              i < rules.length - 1 ? `1px solid ${DS.lightGrey}` : "none",
            animation: `sg-slideInRight 0.4s ease-out ${i * 0.12}s both`,
            opacity: animPhase > i ? 1 : 0,
            transition: "opacity 0.3s ease",
            textAlign: "center",
            fontFamily: DS.font,
          }}
        >
          <span style={{ fontWeight: 600, color: rule.cA, fontSize: "14px" }}>
            {rule.a}
          </span>
          <span style={{ fontWeight: 700, color: DS.dark, fontSize: "15px" }}>
            +
          </span>
          <span style={{ fontWeight: 600, color: rule.cB, fontSize: "14px" }}>
            {rule.b}
          </span>
          <span style={{ fontWeight: 700, color: DS.dark, fontSize: "15px" }}>
            =
          </span>
          <span
            style={{
              fontWeight: 700,
              color: rule.cR,
              fontSize: "12px",
              backgroundColor: rule.bgR,
              padding: "4px 16px",
              borderRadius: "20px",
              display: "inline-block",
              letterSpacing: "0.4px",
            }}
          >
            {rule.result}
          </span>
        </div>
      ))}

      {animPhase >= 5 && (
        <div
          style={{
            padding: "14px 20px",
            background: tintGradient(90),
            borderTop: `1px solid ${DS.lightGrey}`,
            animation: "sg-fadeInUp 0.5s ease-out both",
            fontFamily: DS.font,
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: DS.gradDeep,
              fontWeight: 700,
              marginBottom: "5px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: gradient(),
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                color: DS.white,
              }}
            >
              ★
            </span>
            Key Insight — Consecutive Numbers
          </div>
          <div
            style={{
              fontSize: "11.5px",
              color: DS.dark,
              lineHeight: "1.6",
              fontWeight: 400,
            }}
          >
            Any two consecutive numbers have different parity (one even, one
            odd), so their sum is always{" "}
            <strong style={{ color: DS.orange, fontWeight: 700 }}>ODD</strong>.
            That's why Martin and Maria's ages can never sum to 112!
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const ParityCheckerTool: React.FC<ParityCheckerToolProps> = ({
  props,
  setStepDetails,
}) => {
  const width = props?.width ?? 800;
  const height = props?.height ?? 600;
  const initialStep = props?.initialStep ?? 1;
  const animationSpeed = props?.animationSpeed ?? 1;
  const showNavigation = props?.showNavigation ?? true;
  const showStepIndicator = props?.showStepIndicator ?? true;

  const [currentPhase, setCurrentPhase] = useState(
    Math.max(0, initialStep - 1),
  );
  const [revealed, setRevealed] = useState(false);
  const [prediction, setPrediction] = useState<"even" | "odd" | null>(null);
  const [predictionResult, setPredictionResult] = useState<
    "correct" | "wrong" | null
  >(null);
  const [animPhase, setAnimPhase] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const phase = PHASES[currentPhase];
  const totalPhases = PHASES.length;

  // ─── Keyframes ───
  useEffect(() => {
    const id = "sg-parity-kf";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
            @keyframes sg-fadeInUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
            @keyframes sg-popIn { 0% { transform:scale(0); opacity:0; } 65% { transform:scale(1.12); } 100% { transform:scale(1); opacity:1; } }
            @keyframes sg-slideInRight { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
            @keyframes sg-pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.25); } }
            @keyframes sg-bounce { 0% { transform:translateY(0); } 35% { transform:translateY(-10px); } 55% { transform:translateY(-3px); } 100% { transform:translateY(0); } }
            @keyframes sg-slideDown { from { opacity:0; transform:translateY(-14px); } to { opacity:1; transform:translateY(0); } }
        `;
    document.head.appendChild(s);
    return () => {
      const el = document.getElementById(id);
      if (el) document.head.removeChild(el);
    };
  }, []);

  // ─── Phase sequencing ───
  useEffect(() => {
    setAnimPhase(0);
    setRevealed(false);
    setPrediction(null);
    setPredictionResult(null);
    const sp = 1 / animationSpeed;
    const t1 = setTimeout(() => setAnimPhase(1), 300 * sp);
    let t2: ReturnType<typeof setTimeout>;
    if (!phase.showPrediction) {
      t2 = setTimeout(() => {
        setAnimPhase(2);
        setRevealed(true);
        setTimeout(() => setAnimPhase(3), 350 * sp);
        if (phase.isSummary) {
          setTimeout(() => setAnimPhase(4), 700 * sp);
          setTimeout(() => setAnimPhase(5), 1100 * sp);
        }
      }, 700 * sp);
    }
    return () => {
      clearTimeout(t1);
      if (t2) clearTimeout(t2);
    };
  }, [currentPhase, animationSpeed]);

  useEffect(() => {
    setStepDetails?.({
      currentStep: currentPhase + 1,
      totalSteps: totalPhases,
      isPaused: false,
      currentMode: "learn",
    });
  }, [currentPhase, setStepDetails]);

  const handlePredict = (p: "even" | "odd") => {
    setPrediction(p);
    setPredictionResult(p === phase.resultParity ? "correct" : "wrong");
    setTimeout(() => {
      setRevealed(true);
      setAnimPhase(2);
      setTimeout(() => setAnimPhase(3), 450);
    }, 550);
  };

  const go = useCallback((to: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentPhase(to);
      setTransitioning(false);
    }, 280);
  }, []);

  // ─── Singularity Button ───
  const SgBtn: React.FC<{
    v: "contained" | "outlined" | "texted";
    id: string;
    onClick: () => void;
    disabled?: boolean;
    c?: string;
    children: React.ReactNode;
  }> = ({ v, id, onClick, disabled, c, children }) => {
    const h = hoveredBtn === id && !disabled;
    const clr = c || DS.purple;
    const base: React.CSSProperties = {
      fontFamily: DS.font,
      fontWeight: 600,
      fontSize: "13px",
      padding: `${DS.btnPadY}px ${DS.btnPadX}px`,
      borderRadius: `${DS.btnRadius}px`,
      cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
      outline: "none",
      letterSpacing: "0.2px",
      lineHeight: "1",
      whiteSpace: "nowrap" as const,
    };
    const vs: Record<string, React.CSSProperties> = {
      contained: {
        ...base,
        background: disabled ? DS.lightGrey : h ? gradient() : clr,
        color: disabled ? DS.grey : DS.white,
        border: "none",
        boxShadow: disabled
          ? "none"
          : h
            ? `0 6px 20px ${DS.gradDeep}40`
            : `0 3px 10px ${clr}30`,
        transform: h ? "translateY(-1px)" : "translateY(0)",
      },
      outlined: {
        ...base,
        background: disabled
          ? "transparent"
          : h
            ? `${DS.lavender}30`
            : "transparent",
        color: disabled ? DS.grey : clr,
        border: `1.5px solid ${disabled ? DS.lightGrey : clr}`,
        transform: h ? "translateY(-1px)" : "translateY(0)",
      },
      texted: {
        ...base,
        background: "transparent",
        color: disabled ? DS.grey : h ? DS.gradDeep : clr,
        border: "none",
        padding: `${DS.btnPadY}px 12px`,
        textDecoration: h ? "underline" : "none",
      },
    };
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setHoveredBtn(id)}
        onMouseLeave={() => setHoveredBtn(null)}
        style={vs[v]}
      >
        {children}
      </button>
    );
  };

  // ==================== RENDER ====================
  return (
    <div
      style={{
        width: Math.min(width, 800),
        maxWidth: "100%",
        minHeight: height,
        fontFamily: DS.font,
        backgroundColor: DS.white,
        borderRadius: `${DS.cardRadius + 4}px`,
        overflow: "hidden",
        boxShadow:
          "0 4px 32px rgba(74,77,201,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        border: `1px solid ${DS.lightGrey}`,
      }}
    >
      {/* ══════ HEADER ══════ */}
      <div
        style={{
          background: gradient(),
          padding: "22px 28px 20px",
          color: DS.white,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -18,
            right: -18,
            width: 90,
            height: 90,
            borderRadius: "50%",
            border: "2.5px solid rgba(255,255,255,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -8,
            right: 65,
            width: 44,
            height: 44,
            border: "2px solid rgba(255,255,255,0.08)",
            transform: "rotate(15deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 125,
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderBottom: "21px solid rgba(255,255,255,0.07)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "2.5px",
              opacity: 0.75,
              marginBottom: "6px",
            }}
          >
            Chapter 6 · Number Play
          </div>
          <div
            style={{
              fontSize: "21px",
              fontWeight: 800,
              letterSpacing: "-0.3px",
              lineHeight: "1.2",
            }}
          >
            Consecutive Numbers & Parity
          </div>
          <div
            style={{
              fontSize: "12px",
              opacity: 0.7,
              marginTop: "4px",
              fontWeight: 400,
            }}
          >
            Discover the magic of even and odd number addition
          </div>
        </div>
      </div>

      {/* ══════ STEP DOTS ══════ */}
      {showStepIndicator && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "16px 28px 10px",
          }}
        >
          {PHASES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              style={{
                width: i === currentPhase ? "34px" : "10px",
                height: "10px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                padding: 0,
                backgroundColor:
                  i === currentPhase
                    ? DS.purple
                    : i < currentPhase
                      ? DS.lavender
                      : DS.lightGrey,
                transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                outline: "none",
              }}
            />
          ))}
          <span
            style={{
              marginLeft: "12px",
              fontSize: "11px",
              fontWeight: 600,
              color: DS.grey,
              fontFamily: DS.font,
            }}
          >
            Step {currentPhase + 1} of {totalPhases}
          </span>
        </div>
      )}

      {/* ══════ CONTENT ══════ */}
      <div
        style={{
          flex: 1,
          padding: "14px 28px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(10px)" : "translateY(0)",
          transition: "all 0.28s ease",
        }}
      >
        {/* Title */}
        <div style={{ animation: "sg-fadeInUp 0.4s ease-out both" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: gradient(),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: DS.white,
                fontWeight: 800,
                fontSize: "15px",
                fontFamily: DS.font,
                boxShadow: `0 3px 10px ${DS.gradDeep}30`,
                flexShrink: 0,
              }}
            >
              {phase.id}
            </div>
            <div>
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: DS.dark,
                  fontFamily: DS.font,
                  letterSpacing: "-0.2px",
                }}
              >
                {phase.title}
              </div>
              <div
                style={{
                  fontSize: "11.5px",
                  color: DS.grey,
                  fontWeight: 500,
                  fontFamily: DS.font,
                }}
              >
                {phase.subtitle}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "13.5px",
            lineHeight: "1.7",
            color: DS.dark,
            fontFamily: DS.font,
            fontWeight: 400,
            animation: "sg-fadeInUp 0.4s ease-out 0.08s both",
          }}
        >
          {phase.description}
        </div>

        {/* Diagram / Summary */}
        {phase.isSummary ? (
          <div style={{ animation: "sg-fadeInUp 0.4s ease-out 0.16s both" }}>
            <SummaryTable animPhase={animPhase} />
          </div>
        ) : (
          <div style={{ animation: "sg-fadeInUp 0.4s ease-out 0.16s both" }}>
            <DotPairingDiagram
              groupA={phase.groupA}
              groupB={phase.groupB}
              resultParity={phase.resultParity}
              revealed={revealed}
              animPhase={animPhase}
            />
          </div>
        )}

        {/* Prediction */}
        {phase.showPrediction && !prediction && !revealed && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              animation: "sg-fadeInUp 0.4s ease-out 0.24s both",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: DS.dark,
                fontFamily: DS.font,
              }}
            >
              🤔 Predict: Will the sum be even or odd?
            </div>
            <div style={{ display: "flex", gap: "14px" }}>
              <SgBtn
                v="contained"
                id="pe"
                c={DS.purple}
                onClick={() => handlePredict("even")}
              >
                Even
              </SgBtn>
              <SgBtn
                v="contained"
                id="po"
                c={DS.orange}
                onClick={() => handlePredict("odd")}
              >
                Odd
              </SgBtn>
            </div>
          </div>
        )}

        {/* Result */}
        {predictionResult && (
          <div
            style={{
              textAlign: "center",
              padding: "10px 18px",
              borderRadius: `${DS.cardRadius}px`,
              backgroundColor:
                predictionResult === "correct"
                  ? `${DS.success}12`
                  : `${DS.error}12`,
              border: `1.5px solid ${predictionResult === "correct" ? DS.success : DS.error}30`,
              animation: "sg-popIn 0.4s ease-out both",
              fontFamily: DS.font,
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: predictionResult === "correct" ? DS.success : DS.error,
              }}
            >
              {predictionResult === "correct"
                ? "🎉 Correct!"
                : "✗ Not quite!"}{" "}
            </span>
            <span
              style={{ fontSize: "12.5px", fontWeight: 500, color: DS.dark }}
            >
              {phase.resultExplanation}
            </span>
          </div>
        )}

        {revealed && !phase.showPrediction && phase.resultExplanation && (
          <div
            style={{
              textAlign: "center",
              padding: "10px 18px",
              borderRadius: `${DS.cardRadius}px`,
              backgroundColor: DS.offWhite,
              border: `1px solid ${DS.lightGrey}`,
              animation: "sg-fadeInUp 0.4s ease-out both",
              fontFamily: DS.font,
            }}
          >
            <span
              style={{ fontSize: "12.5px", fontWeight: 500, color: DS.dark }}
            >
              {phase.resultExplanation}
            </span>
          </div>
        )}

        {/* Real World */}
        {phase.realWorldExample && revealed && (
          <div
            style={{
              padding: "14px 18px",
              borderRadius: `${DS.cardRadius}px`,
              background: tintGradient(90),
              border: `1px solid ${DS.lightGrey}`,
              animation: "sg-slideDown 0.4s ease-out both",
              fontFamily: DS.font,
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                color: DS.gradDeep,
                marginBottom: "5px",
                opacity: 0.7,
              }}
            >
              Real-World Connection
            </div>
            <div
              style={{
                fontSize: "12.5px",
                lineHeight: "1.6",
                color: DS.dark,
                fontWeight: 400,
              }}
            >
              {phase.realWorldExample}
            </div>
          </div>
        )}
      </div>

      {/* ══════ NAVIGATION ══════ */}
      {showNavigation && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 28px 20px",
            borderTop: `1px solid ${DS.lightGrey}`,
          }}
        >
          <SgBtn
            v="outlined"
            id="np"
            disabled={currentPhase === 0}
            onClick={() => go(Math.max(0, currentPhase - 1))}
          >
            <ChevronLeft size={15} /> Previous
          </SgBtn>
          <SgBtn v="texted" id="nr" onClick={() => go(0)}>
            <RotateCcw size={13} /> Restart
          </SgBtn>
          <SgBtn
            v="contained"
            id="nn"
            disabled={currentPhase === totalPhases - 1}
            onClick={() => go(Math.min(totalPhases - 1, currentPhase + 1))}
          >
            {currentPhase === totalPhases - 1 ? "Complete!" : "Next Step"}{" "}
            <ChevronRight size={15} />
          </SgBtn>
        </div>
      )}

      {/* ══════ FOOTER ══════ */}
      <div
        style={{
          padding: "10px 28px 14px",
          backgroundColor: DS.offWhite,
          borderTop: `1px solid ${DS.lightGrey}`,
          textAlign: "center",
          fontFamily: DS.font,
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: DS.grey,
            fontStyle: "italic",
            lineHeight: "1.5",
            fontWeight: 400,
          }}
        >
          💡 Watch the dots pair up — leftover dots reveal the parity!
          {phase.showPrediction &&
            !revealed &&
            " Try predicting before the answer appears."}
        </div>
      </div>
    </div>
  );
};

export default ParityCheckerTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
