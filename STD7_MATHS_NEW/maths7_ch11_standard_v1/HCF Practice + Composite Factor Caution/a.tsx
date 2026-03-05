// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: hcf_practice_composite_caution_tool.tsx
// Topic: HCF Practice and Composite Factor Caution
// Chapter: Ganita Prakash Grade 7 Ch.3 — Finding Common Ground
// Design: Singularity Design System v1
// ═══════════════════════════════════════════════════════════════════════════

// @ts-ignore React types are resolved at app level
import React, { useState, useEffect, useMemo } from "react";

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
};

const makeIcon =
  (symbol: string): React.FC<IconProps> =>
  ({ size = 16, color = "currentColor", style }) =>
    (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size,
          color,
          lineHeight: 1,
          ...style,
        }}
      >
        {symbol}
      </span>
    );

const Check = makeIcon("✓");
const X = makeIcon("✕");
const ChevronRight = makeIcon("›");
const ChevronLeft = makeIcon("‹");
const Eye = makeIcon("👁");
const EyeOff = makeIcon("🚫");
const AlertTriangle = makeIcon("⚠");
const Award = makeIcon("🏅");
const Star = makeIcon("★");
const RotateCcw = makeIcon("⟲");
const BookOpen = makeIcon("📖");
const Lightbulb = makeIcon("💡");
const ShieldAlert = makeIcon("🛡");
const Sparkles = makeIcon("✨");
const Plus = makeIcon("+");

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

type ModeType = "learn" | "practice" | "real_world" | "hands_on";
type SectionType = "practice" | "caution";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface ProblemDef {
  id: number;
  numA: number;
  numB: number;
  hcf: number;
  factorsA: number[];
  factorsB: number[];
}

interface HCFPracticeAdditionalProps {
  problems?: { num1: number; num2: number }[];
  cautionNumA?: number;
  cautionNumB?: number;
  compositeA?: string;
  compositeB?: string;
  showThaliAnalogy?: boolean;
  accentColor?: string;
}

interface HCFPracticeToolProps {
  props?: {
    width?: number;
    height?: number;
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
    additionalProps?: HCFPracticeAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// EASING HELPERS
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
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function primeFactorise(n: number): number[] {
  const factors: number[] = [];
  let d = 2,
    num = n;
  while (d * d <= num) {
    while (num % d === 0) {
      factors.push(d);
      num = Math.floor(num / d);
    }
    d++;
  }
  if (num > 1) factors.push(num);
  return factors;
}

function computeHCF(a: number, b: number): number {
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function getCountMap(factors: number[]): Record<number, number> {
  const m: Record<number, number> = {};
  factors.forEach((p) => (m[p] = (m[p] || 0) + 1));
  return m;
}

function getCommonPrimes(f1: number[], f2: number[]): number[] {
  const s1 = new Set(f1),
    s2 = new Set(f2);
  return Array.from(s1)
    .filter((p) => s2.has(p))
    .sort((a, b) => a - b);
}

function buildProblem(numA: number, numB: number): ProblemDef {
  return {
    id: numA * 1000 + numB,
    numA,
    numB,
    hcf: computeHCF(numA, numB),
    factorsA: primeFactorise(numA),
    factorsB: primeFactorise(numB),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGULARITY DESIGN TOKENS — Strictly from PDF
// ═══════════════════════════════════════════════════════════════════════════

const S = {
  // Primary brand
  indigo: "#4A4DC9",
  orange: "#FF7212",

  // Gradient
  gradStart: "#533086",
  gradEnd: "#FC9145",

  // Light tints (from PDF)
  indigoLight: "#C1C1EA",
  orangeLight: "#FFF3E4",

  // Neutrals (from PDF)
  darkText: "#4E4E4E",
  disabled: "#CACACA",
  border: "#EBEBEB",
  bgLight: "#F5F5F5",
  white: "#FFFFFF",

  // Functional colours (educational feedback)
  red: "#ef4444",
  redDark: "#b91c1c",
  redLight: "#fef2f2",
  redMid: "#fca5a5",
  emerald: "#10b981",
  emeraldDark: "#047857",
  emeraldLight: "#ecfdf5",
  emeraldMid: "#6ee7b7",
  amber: "#f59e0b",
  amberDark: "#b45309",
  amberLight: "#fef3c7",
};

// Prime factor colours: use brand + functional palette
const PRIME_COLORS: Record<number, string> = {
  2: "#4A4DC9", // indigo
  3: "#FF7212", // orange
  5: "#10b981", // emerald
  7: "#533086", // gradStart purple
  11: "#f59e0b", // amber
  13: "#ef4444", // red
  17: "#8b5cf6",
  19: "#06b6d4",
};
function getPrimeColor(p: number): string {
  return PRIME_COLORS[p] || S.disabled;
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGULARITY BUTTON SPECS — From PDF exactly
// Height: 40px | Padding: 0 24px | Border-radius: 40px | Icon gap: 4px
// Contained: bg=#4A4DC9, color=white
// Outlined: border=1px #4A4DC9, bg=transparent, color=#4A4DC9
// Texted: no bg/border, color=#4A4DC9
// Highlight: bg=#FF7212, color=white
// Disabled: bg=#CACACA, color=white (contained) or border=#CACACA (outlined)
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// KEYFRAMES — Injected via useEffect with cleanup
// ═══════════════════════════════════════════════════════════════════════════

const KEYFRAMES = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

    @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes popIn { 0% { transform:scale(0); opacity:0; } 60% { transform:scale(1.12); } 100% { transform:scale(1); opacity:1; } }
    @keyframes slideInLeft { from { opacity:0; transform:translateX(-24px); } to { opacity:1; transform:translateX(0); } }
    @keyframes slideInRight { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
    @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
    @keyframes shake { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-5px)} 30%{transform:translateX(5px)} 45%{transform:translateX(-4px)} 60%{transform:translateX(4px)} 75%{transform:translateX(-2px)} 90%{transform:translateX(2px)} }
    @keyframes glowRed { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0)} 50%{box-shadow:0 0 16px 4px rgba(239,68,68,0.12)} }
    @keyframes glowGreen { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0)} 50%{box-shadow:0 0 16px 4px rgba(16,185,129,0.12)} }
    @keyframes bounceIn { 0%{transform:scale(0)} 50%{transform:scale(1.15)} 70%{transform:scale(0.93)} 100%{transform:scale(1)} }
    @keyframes dropIn { 0%{opacity:0;transform:translateY(-28px) scale(.85)} 55%{transform:translateY(3px) scale(1.04)} 100%{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes confettiUp { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(-80px) rotate(480deg);opacity:0} }
    @keyframes starSpin { from{transform:rotate(0deg) scale(0);opacity:0} to{transform:rotate(360deg) scale(1);opacity:1} }
    @keyframes wiggle { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
    @keyframes drawLine { from{stroke-dashoffset:200} to{stroke-dashoffset:0} }
    @keyframes warningPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.85;transform:scale(1.01)} }
    @keyframes floatUp { 0%{opacity:0;transform:translateY(12px)} 100%{opacity:1;transform:translateY(0)} }
    @keyframes crossFade { 0%{opacity:0;transform:scale(.96)} 100%{opacity:1;transform:scale(1)} }
`;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT PROBLEMS
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_PROBLEMS: { num1: number; num2: number }[] = [
  { num1: 24, num2: 180 },
  { num1: 240, num2: 378 },
  { num1: 400, num2: 2500 },
  { num1: 300, num2: 800 },
  { num1: 81, num2: 243 },
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const HCFPracticeCompositeCautionTool: React.FC<HCFPracticeToolProps> = ({
  props,
  setStepDetails,
}) => {
  const ff = "'Poppins', sans-serif";
  const width = props?.width ?? 800;
  const showNav = props?.showNavigation ?? true;
  const animSpeed = props?.animationSpeed ?? 1;

  const ap = (props?.additionalProps || {}) as HCFPracticeAdditionalProps;
  const rawProblems = ap.problems ?? DEFAULT_PROBLEMS;
  const cautionA = ap.cautionNumA ?? 72;
  const cautionB = ap.cautionNumB ?? 144;
  const compAStr = ap.compositeA ?? "6 × 12";
  const compBStr = ap.compositeB ?? "8 × 18";
  const showThali = ap.showThaliAnalogy ?? true;

  const problems: ProblemDef[] = useMemo(
    () => rawProblems.map((p) => buildProblem(p.num1, p.num2)),
    [rawProblems],
  );
  const cautionProb = useMemo(
    () => buildProblem(cautionA, cautionB),
    [cautionA, cautionB],
  );

  // ─── STATE ───
  const [section, setSection] = useState<SectionType>("practice");
  const [curIdx, setCurIdx] = useState(0);
  const [userHCF, setUserHCF] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [correct, setCorrect] = useState<Record<number, boolean>>({});
  const [showSol, setShowSol] = useState<Record<number, boolean>>({});
  const [primeView, setPrimeView] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [score, setScore] = useState(0);
  const [shakeIdx, setShakeIdx] = useState<number | null>(null);

  const prob = problems[curIdx];

  // ─── INJECT KEYFRAMES ───
  useEffect(() => {
    const id = "hcf-pcc-singularity-v3";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = KEYFRAMES;
      document.head.appendChild(el);
    }
    return () => {
      const e = document.getElementById(id);
      if (e) document.head.removeChild(e);
    };
  }, []);

  // ─── STEP DETAILS ───
  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: section === "practice" ? curIdx + 1 : problems.length + 1,
        totalSteps: problems.length + 1,
        isPaused: true,
        currentMode: "practice",
      });
    }
  }, [section, curIdx, setStepDetails, problems.length]);

  // ─── COMPLETION ───
  useEffect(() => {
    const allSub = problems.every((_, i) => submitted[i]);
    if (allSub && !allDone) {
      setAllDone(true);
      let s = 0;
      problems.forEach((_, i) => {
        if (correct[i]) s++;
      });
      setScore(s);
    }
  }, [submitted, problems, allDone, correct]);

  // ─── HANDLERS ───
  const handleSubmit = (idx: number) => {
    const val = parseInt(userHCF[idx] || "0", 10);
    const isCorr = val === problems[idx].hcf;
    setSubmitted((p) => ({ ...p, [idx]: true }));
    setCorrect((p) => ({ ...p, [idx]: isCorr }));
    if (!isCorr) {
      setShakeIdx(idx);
      setTimeout(() => setShakeIdx(null), 600);
    }
  };

  const handleReset = () => {
    setUserHCF({});
    setSubmitted({});
    setCorrect({});
    setShowSol({});
    setAllDone(false);
    setScore(0);
    setCurIdx(0);
  };

  const toggleView = () => {
    setPrimeView((v) => !v);
    setAnimKey((k) => k + 1);
  };

  // ═══════════════════════════════════════════════════════════════════
  // SINGULARITY BUTTON COMPONENTS
  // ═══════════════════════════════════════════════════════════════════

  // Contained button (primary: indigo, highlight: orange)
  const BtnContained = ({
    children,
    onClick,
    disabled,
    color = "indigo",
    style: extraStyle,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    color?: "indigo" | "orange" | "emerald" | "red";
    style?: React.CSSProperties;
  }) => {
    const bgMap = {
      indigo: S.indigo,
      orange: S.orange,
      emerald: S.emerald,
      red: S.red,
    };
    const bg = disabled ? S.disabled : bgMap[color];
    return (
      <button
        onClick={disabled ? undefined : onClick}
        style={{
          height: "40px",
          padding: "0 24px",
          borderRadius: "40px",
          border: "none",
          background: bg,
          color: S.white,
          fontFamily: ff,
          fontSize: "13px",
          fontWeight: 600,
          cursor: disabled ? "not-allowed" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          opacity: disabled ? 0.6 : 1,
          transition: "all 0.2s ease",
          ...extraStyle,
        }}
      >
        {children}
      </button>
    );
  };

  // Outlined button
  const BtnOutlined = ({
    children,
    onClick,
    disabled,
    style: extraStyle,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    style?: React.CSSProperties;
  }) => (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        height: "40px",
        padding: "0 24px",
        borderRadius: "40px",
        border: `1px solid ${disabled ? S.disabled : S.indigo}`,
        background: "transparent",
        color: disabled ? S.disabled : S.indigo,
        fontFamily: ff,
        fontSize: "13px",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s ease",
        ...extraStyle,
      }}
    >
      {children}
    </button>
  );

  // ═══════════════════════════════════════════════════════════════════
  // RENDER HELPERS
  // ═══════════════════════════════════════════════════════════════════

  // Singularity decorative shapes (from PDF — circle, triangle, square, rounded-square)
  const DecoShapes = ({
    color = S.indigoLight,
    filled = false,
    opacity = 0.15,
  }: {
    color?: string;
    filled?: boolean;
    opacity?: number;
  }) => (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <svg
        style={{ position: "absolute", top: 12, right: 20, opacity }}
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <circle
          cx="16"
          cy="16"
          r="13"
          fill={filled ? color : "none"}
          stroke={filled ? "none" : color}
          strokeWidth="1.5"
        />
      </svg>
      <svg
        style={{
          position: "absolute",
          bottom: 8,
          right: 70,
          opacity: opacity * 0.7,
        }}
        width="28"
        height="28"
        viewBox="0 0 32 32"
      >
        <polygon
          points="16,4 30,28 2,28"
          fill={filled ? color : "none"}
          stroke={filled ? "none" : color}
          strokeWidth="1.5"
        />
      </svg>
      <svg
        style={{
          position: "absolute",
          top: -6,
          right: 140,
          opacity: opacity * 0.5,
        }}
        width="24"
        height="24"
        viewBox="0 0 32 32"
      >
        <rect
          x="4"
          y="4"
          width="24"
          height="24"
          rx="4"
          fill={filled ? color : "none"}
          stroke={filled ? "none" : color}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );

  // Prime block
  const renderPrimeBlock = (
    prime: number,
    idx: number,
    delay: number,
    size = 34,
  ) => (
    <div
      key={`pb-${prime}-${idx}-${delay}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "8px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: ff,
        fontSize: `${size * 0.4}px`,
        fontWeight: 700,
        color: S.white,
        background: getPrimeColor(prime),
        animation: `popIn ${0.35 / animSpeed}s ease-out ${delay}s both`,
        margin: "2px",
      }}
    >
      {prime}
    </div>
  );

  // Factorisation row
  const renderFactRow = (
    factors: number[],
    color: string,
    label: string,
    num: number,
    delay = 0,
  ) => (
    <div
      style={{
        animation: `fadeInUp ${0.4 / animSpeed}s ease-out ${delay}s both`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "4px",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: color,
          }}
        />
        <span
          style={{
            fontFamily: ff,
            fontSize: "10px",
            fontWeight: 700,
            color,
            textTransform: "uppercase" as const,
            letterSpacing: "0.8px",
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontFamily: ff,
          fontSize: "13px",
          fontWeight: 600,
          color: S.darkText,
          marginBottom: "6px",
        }}
      >
        {num} = {factors.join(" × ")}
      </div>
      <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
        {factors.map((f, i) => renderPrimeBlock(f, i, delay + 0.04 + i * 0.05))}
      </div>
    </div>
  );

  // Solution detail
  const renderSolution = (p: ProblemDef) => {
    const cA = getCountMap(p.factorsA),
      cB = getCountMap(p.factorsB);
    const common = getCommonPrimes(p.factorsA, p.factorsB);
    const hcfParts = common.map((cp) =>
      Array(Math.min(cA[cp] || 0, cB[cp] || 0))
        .fill(String(cp))
        .join(" × "),
    );
    return (
      <div
        style={{
          marginTop: "12px",
          padding: "14px 16px",
          borderRadius: "16px",
          background: S.amberLight,
          border: `1px solid ${S.border}`,
          animation: `floatUp ${0.35 / animSpeed}s ease-out`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "6px",
          }}
        >
          <Lightbulb size={14} color={S.amberDark} />
          <span
            style={{
              fontFamily: ff,
              fontSize: "11px",
              fontWeight: 700,
              color: S.amberDark,
              textTransform: "uppercase" as const,
              letterSpacing: "0.6px",
            }}
          >
            Solution
          </span>
        </div>
        <div
          style={{
            fontFamily: ff,
            fontSize: "12px",
            fontWeight: 500,
            color: S.darkText,
            lineHeight: 1.7,
          }}
        >
          Common primes:{" "}
          {common.length > 0 ? (
            common.map((cp) => (
              <span
                key={cp}
                style={{
                  display: "inline-flex",
                  padding: "1px 8px",
                  borderRadius: "6px",
                  background: getPrimeColor(cp) + "18",
                  color: getPrimeColor(cp),
                  fontWeight: 700,
                  margin: "0 3px",
                  fontSize: "11px",
                }}
              >
                {cp}
              </span>
            ))
          ) : (
            <span style={{ color: S.red, fontWeight: 700 }}>
              None (co-prime!)
            </span>
          )}
          <br />
          {common.length > 0 ? (
            <>
              Minimum occurrences → {hcfParts.join(" × ")} ={" "}
              <strong style={{ color: S.emerald, fontSize: "15px" }}>
                {p.hcf}
              </strong>
            </>
          ) : (
            <>
              HCF ={" "}
              <strong style={{ color: S.emerald, fontSize: "15px" }}>1</strong>
            </>
          )}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 1: PRACTICE PROBLEMS
  // ═══════════════════════════════════════════════════════════════════

  const renderProblemCard = (p: ProblemDef, idx: number) => {
    const isSub = submitted[idx],
      isCorr = correct[idx];
    const isShaking = shakeIdx === idx,
      isSolShown = showSol[idx];

    return (
      <div
        key={p.id}
        style={{
          background: S.white,
          borderRadius: "16px",
          border: `1px solid ${isSub ? (isCorr ? S.emeraldMid : S.redMid) : S.border}`,
          padding: "20px",
          transition: "all 0.3s ease",
          animation: `${isShaking ? "shake" : "fadeInUp"} ${isShaking ? "0.5s" : `${0.4 / animSpeed}s`} ease-out`,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: isSub ? (isCorr ? S.emerald : S.red) : S.indigo,
                color: S.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: ff,
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              {isSub ? (
                isCorr ? (
                  <Check size={15} strokeWidth={3} />
                ) : (
                  <X size={15} strokeWidth={3} />
                )
              ) : (
                idx + 1
              )}
            </div>
            <div>
              <div
                style={{
                  fontFamily: ff,
                  fontSize: "18px",
                  fontWeight: 800,
                  color: S.darkText,
                }}
              >
                HCF({p.numA}, {p.numB})
              </div>
              <div
                style={{
                  fontFamily: ff,
                  fontSize: "10px",
                  color: S.disabled,
                  fontWeight: 500,
                }}
              >
                Problem {idx + 1} of {problems.length}
              </div>
            </div>
          </div>
          {isSub && (
            <div
              style={{
                padding: "4px 14px",
                borderRadius: "40px",
                background: isCorr ? S.emeraldLight : S.redLight,
                color: isCorr ? S.emeraldDark : S.redDark,
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: ff,
                animation: `bounceIn ${0.4 / animSpeed}s ease-out`,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {isCorr ? (
                <>
                  <Sparkles size={12} /> Correct!
                </>
              ) : (
                <>
                  <ShieldAlert size={12} /> Not quite
                </>
              )}
            </div>
          )}
        </div>

        {/* Factorisations */}
        <div
          style={{
            background: S.bgLight,
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "16px",
            border: `1px solid ${S.border}`,
          }}
        >
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {renderFactRow(p.factorsA, S.indigo, "Number A", p.numA, 0.08)}
            {renderFactRow(p.factorsB, S.orange, "Number B", p.numB, 0.16)}
          </div>
        </div>

        {/* Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: ff,
              fontSize: "14px",
              fontWeight: 700,
              color: S.darkText,
            }}
          >
            HCF =
          </span>
          <input
            type="number"
            value={userHCF[idx] ?? ""}
            onChange={(e) =>
              setUserHCF((prev) => ({ ...prev, [idx]: e.target.value }))
            }
            disabled={!!isSub}
            placeholder="?"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isSub) handleSubmit(idx);
            }}
            style={{
              width: "100px",
              height: "40px",
              borderRadius: "40px",
              border: `1px solid ${isSub ? (isCorr ? S.emerald : S.red) : S.border}`,
              padding: "0 16px",
              fontFamily: ff,
              fontSize: "16px",
              fontWeight: 700,
              color: S.darkText,
              textAlign: "center" as const,
              outline: "none",
              background: isSub
                ? isCorr
                  ? S.emeraldLight
                  : S.redLight
                : S.white,
              transition: "all 0.3s ease",
            }}
          />
          {!isSub && (
            <BtnContained onClick={() => handleSubmit(idx)} color="emerald">
              <Check size={14} strokeWidth={3} /> Check
            </BtnContained>
          )}
          {isSub && !isCorr && !isSolShown && (
            <BtnOutlined
              onClick={() => setShowSol((prev) => ({ ...prev, [idx]: true }))}
            >
              <Eye size={14} /> Show Solution
            </BtnOutlined>
          )}
        </div>

        {isSolShown && renderSolution(p)}

        {isSub && isCorr && (
          <div
            style={{
              marginTop: "12px",
              padding: "10px 14px",
              borderRadius: "12px",
              background: S.emeraldLight,
              border: `1px solid ${S.border}`,
              animation: `glowGreen 2s ease infinite`,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Award size={16} color={S.emerald} />
            <span
              style={{
                fontFamily: ff,
                fontSize: "12px",
                fontWeight: 600,
                color: S.emeraldDark,
              }}
            >
              {p.numA} ÷ {p.hcf} = {p.numA / p.hcf} and {p.numB} ÷ {p.hcf} ={" "}
              {p.numB / p.hcf} — Verified!
            </span>
          </div>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 2: CAUTION DEMO
  // ═══════════════════════════════════════════════════════════════════

  const renderCautionDemo = () => {
    const primeA = cautionProb.factorsA,
      primeB = cautionProb.factorsB;
    const countA = getCountMap(primeA),
      countB = getCountMap(primeB);
    const common = getCommonPrimes(primeA, primeB);
    const hcfParts = common.map((cp) =>
      Array(Math.min(countA[cp] || 0, countB[cp] || 0))
        .fill(String(cp))
        .join(" × "),
    );
    const hcfStr = hcfParts.join(" × ");
    const matchingPairs = common.map((cp) => ({
      prime: cp,
      cA: countA[cp] || 0,
      cB: countB[cp] || 0,
      min: Math.min(countA[cp] || 0, countB[cp] || 0),
    }));

    return (
      <div
        key={animKey}
        style={{ animation: `crossFade ${0.4 / animSpeed}s ease-out` }}
      >
        {/* Warning Banner */}
        <div
          style={{
            background: `linear-gradient(135deg, ${S.red} 0%, ${S.redDark} 100%)`,
            borderRadius: "16px",
            padding: "20px 24px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            animation: "warningPulse 3s ease infinite",
            position: "relative" as const,
            overflow: "hidden",
          }}
        >
          <DecoShapes
            color="rgba(255,255,255,0.15)"
            filled={false}
            opacity={0.15}
          />
          <AlertTriangle
            size={28}
            color={S.white}
            strokeWidth={2.5}
            style={{
              animation: "wiggle 1.2s ease infinite",
              flexShrink: 0,
              position: "relative" as const,
              zIndex: 1,
            }}
          />
          <div style={{ position: "relative" as const, zIndex: 1 }}>
            <div
              style={{
                fontFamily: ff,
                fontSize: "16px",
                fontWeight: 800,
                color: S.white,
                marginBottom: "2px",
              }}
            >
              Caution: Composite Factors Hide Primes!
            </div>
            <div
              style={{
                fontFamily: ff,
                fontSize: "12px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Ch.3, Q2: {cautionA} = {compAStr} and {cautionB} = {compBStr}. No
              match? Toggle to see!
            </div>
          </div>
        </div>

        {/* Toggle */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              background: S.bgLight,
              borderRadius: "40px",
              border: `1px solid ${S.border}`,
              padding: "3px",
            }}
          >
            <button
              onClick={() => {
                if (primeView) toggleView();
              }}
              style={{
                height: "34px",
                padding: "0 20px",
                borderRadius: "40px",
                border: "none",
                background: !primeView ? S.red : "transparent",
                color: !primeView ? S.white : S.disabled,
                fontFamily: ff,
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <EyeOff size={13} /> Composite
            </button>
            <button
              onClick={() => {
                if (!primeView) toggleView();
              }}
              style={{
                height: "34px",
                padding: "0 20px",
                borderRadius: "40px",
                border: "none",
                background: primeView ? S.emerald : "transparent",
                color: primeView ? S.white : S.disabled,
                fontFamily: ff,
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Eye size={13} /> Prime
            </button>
          </div>
        </div>

        {/* Two cards */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            marginBottom: "18px",
          }}
        >
          {[
            {
              num: cautionA,
              compStr: compAStr,
              factors: primeA,
              color: S.indigo,
              label: "Number A",
              bgTint: S.indigoLight,
              anim: "slideInLeft",
            },
            {
              num: cautionB,
              compStr: compBStr,
              factors: primeB,
              color: S.orange,
              label: "Number B",
              bgTint: S.orangeLight,
              anim: "slideInRight",
            },
          ].map((card) => (
            <div
              key={card.num}
              style={{
                flex: 1,
                minWidth: "220px",
                background: S.white,
                borderRadius: "16px",
                padding: "18px",
                border: `1px solid ${primeView ? S.emeraldMid : S.redMid}`,
                transition: "all 0.4s ease",
                animation: `${card.anim} ${0.4 / animSpeed}s ease-out`,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "2px 10px",
                  borderRadius: "40px",
                  background: card.bgTint + "40",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: card.color,
                  }}
                />
                <span
                  style={{
                    fontFamily: ff,
                    fontSize: "9px",
                    fontWeight: 700,
                    color: card.color,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.8px",
                  }}
                >
                  {card.label}
                </span>
              </div>
              <div
                style={{
                  fontFamily: ff,
                  fontSize: "28px",
                  fontWeight: 900,
                  color: S.darkText,
                  marginBottom: "6px",
                }}
              >
                {card.num}
              </div>

              {!primeView ? (
                <div
                  style={{ animation: `fadeIn ${0.3 / animSpeed}s ease-out` }}
                >
                  <div
                    style={{
                      fontFamily: ff,
                      fontSize: "13px",
                      fontWeight: 600,
                      color: S.darkText,
                      marginBottom: "10px",
                    }}
                  >
                    = {card.compStr}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    {card.compStr.split(" × ").map((n, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && (
                          <span
                            style={{
                              fontFamily: ff,
                              fontSize: "15px",
                              fontWeight: 800,
                              color: S.disabled,
                            }}
                          >
                            ×
                          </span>
                        )}
                        <div
                          style={{
                            padding: "8px 16px",
                            borderRadius: "10px",
                            background: S.bgLight,
                            fontFamily: ff,
                            fontSize: "18px",
                            fontWeight: 800,
                            color: S.disabled,
                            border: `1.5px dashed ${S.border}`,
                          }}
                        >
                          {n.trim()}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  <div
                    style={{
                      marginTop: "8px",
                      fontFamily: ff,
                      fontSize: "10px",
                      fontWeight: 600,
                      color: S.red,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <X size={11} color={S.red} strokeWidth={3} /> No visible
                    match
                  </div>
                </div>
              ) : (
                <div
                  style={{ animation: `fadeIn ${0.3 / animSpeed}s ease-out` }}
                >
                  <div
                    style={{
                      fontFamily: ff,
                      fontSize: "12px",
                      fontWeight: 600,
                      color: S.darkText,
                      marginBottom: "8px",
                    }}
                  >
                    = {card.factors.join(" × ")}
                  </div>
                  <div
                    style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}
                  >
                    {card.factors.map((f, i) =>
                      renderPrimeBlock(f, i, 0.06 + i * 0.06, 36),
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Result */}
        {!primeView ? (
          <div
            style={{
              background: S.redLight,
              borderRadius: "16px",
              padding: "18px 20px",
              border: `1px solid ${S.redMid}`,
              animation: "glowRed 2.5s ease infinite",
              textAlign: "center" as const,
              marginBottom: "16px",
            }}
          >
            <AlertTriangle
              size={24}
              color={S.red}
              style={{
                marginBottom: "4px",
                animation: "wiggle 1s ease infinite",
              }}
            />
            <div
              style={{
                fontFamily: ff,
                fontSize: "14px",
                fontWeight: 700,
                color: S.redDark,
              }}
            >
              No common factors visible in composite view!
            </div>
            <div
              style={{
                fontFamily: ff,
                fontSize: "11px",
                fontWeight: 500,
                color: S.darkText,
                marginTop: "3px",
              }}
            >
              Does this mean HCF = 1?{" "}
              <strong style={{ color: S.red }}>No!</strong> Composite factors
              hide shared primes.
            </div>
          </div>
        ) : (
          <div
            style={{
              background: S.emeraldLight,
              borderRadius: "16px",
              padding: "20px",
              border: `1px solid ${S.emeraldMid}`,
              animation: "glowGreen 2.5s ease infinite",
              marginBottom: "16px",
            }}
          >
            <div style={{ textAlign: "center" as const, marginBottom: "12px" }}>
              <span
                style={{
                  fontFamily: ff,
                  fontSize: "10px",
                  fontWeight: 700,
                  color: S.emeraldDark,
                  textTransform: "uppercase" as const,
                  letterSpacing: "1px",
                }}
              >
                Matching Primes Found
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "12px",
              }}
            >
              {matchingPairs.map((mp, mi) => (
                <div
                  key={mp.prime}
                  style={{
                    background: S.white,
                    borderRadius: "12px",
                    padding: "10px 14px",
                    display: "flex",
                    flexDirection: "column" as const,
                    alignItems: "center",
                    gap: "4px",
                    animation: `dropIn ${0.4 / animSpeed}s ease-out ${0.1 + mi * 0.1}s both`,
                    border: `1px solid ${S.border}`,
                    minWidth: "66px",
                  }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "8px",
                      background: getPrimeColor(mp.prime),
                      color: S.white,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: ff,
                      fontSize: "15px",
                      fontWeight: 800,
                    }}
                  >
                    {mp.prime}
                  </div>
                  <div
                    style={{
                      fontFamily: ff,
                      fontSize: "9px",
                      fontWeight: 600,
                      color: S.disabled,
                      textAlign: "center" as const,
                    }}
                  >
                    A:{mp.cA} · B:{mp.cB}
                  </div>
                  <div
                    style={{
                      padding: "1px 8px",
                      borderRadius: "40px",
                      background: S.amberLight,
                      fontFamily: ff,
                      fontSize: "9px",
                      fontWeight: 700,
                      color: S.amberDark,
                    }}
                  >
                    min = {mp.min}
                  </div>
                  <svg
                    width="36"
                    height="12"
                    style={{
                      animation: `fadeIn 0.5s ease-out ${0.4 + mi * 0.1}s both`,
                    }}
                  >
                    {Array.from({ length: mp.min }).map((_, li) => (
                      <line
                        key={li}
                        x1="3"
                        y1={3 + li * 4}
                        x2="33"
                        y2={3 + li * 4}
                        stroke={getPrimeColor(mp.prime)}
                        strokeWidth="1.5"
                        strokeDasharray="3,2"
                      />
                    ))}
                  </svg>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center" as const }}>
              <div
                style={{
                  fontFamily: ff,
                  fontSize: "13px",
                  fontWeight: 600,
                  color: S.darkText,
                }}
              >
                HCF = {hcfStr} ={" "}
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: 900,
                    color: S.emerald,
                  }}
                >
                  {cautionProb.hcf}
                </span>
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  height: "40px",
                  padding: "0 24px",
                  borderRadius: "40px",
                  background: S.emerald,
                  color: S.white,
                  fontFamily: ff,
                  fontSize: "11px",
                  fontWeight: 700,
                  marginTop: "8px",
                  animation: `bounceIn ${0.4 / animSpeed}s ease-out 0.6s both`,
                }}
              >
                <Check size={14} strokeWidth={3} />
                {cautionA} ÷ {cautionProb.hcf} = {cautionA / cautionProb.hcf}{" "}
                &nbsp;&amp;&nbsp; {cautionB} ÷ {cautionProb.hcf} ={" "}
                {cautionB / cautionProb.hcf}
              </div>
            </div>
          </div>
        )}

        {/* Thali Analogy */}
        {showThali && (
          <div
            style={{
              background: S.orangeLight,
              borderRadius: "16px",
              padding: "16px 18px",
              border: `1px solid ${S.border}`,
              animation: `floatUp ${0.4 / animSpeed}s ease-out 0.3s both`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "18px" }}>🍛</span>
              <span
                style={{
                  fontFamily: ff,
                  fontSize: "13px",
                  fontWeight: 800,
                  color: S.orange,
                }}
              >
                Thali Analogy
              </span>
            </div>
            <div
              style={{
                fontFamily: ff,
                fontSize: "12px",
                fontWeight: 500,
                color: S.darkText,
                lineHeight: 1.7,
              }}
            >
              Two thalis look different — <strong>dal-chawal</strong> vs{" "}
              <strong>idli-sambhar</strong>. But break them into <em>spices</em>{" "}
              (primes!) and you find both share{" "}
              <strong style={{ color: getPrimeColor(2) }}>jeera</strong>,{" "}
              <strong style={{ color: getPrimeColor(3) }}>haldi</strong>, and{" "}
              <strong style={{ color: getPrimeColor(5) }}>mirchi</strong>.
              Composite factors are finished dishes — you must break them into
              spices to find what's truly shared!
            </div>
          </div>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════
  // MAIN LAYOUT
  // ═══════════════════════════════════════════════════════════════════

  return (
    <div
      style={{
        width: "100%",
        maxWidth: `${width}px`,
        fontFamily: ff,
        background: S.white,
        borderRadius: "16px",
        overflow: "hidden",
        border: `1px solid ${S.border}`,
      }}
    >
      {/* HEADER — Singularity gradient with geometric shapes */}
      <div
        style={{
          background: `linear-gradient(135deg, ${S.gradStart} 0%, ${S.gradEnd} 100%)`,
          padding: "20px 24px 16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <DecoShapes
          color="rgba(255,255,255,0.12)"
          filled={false}
          opacity={0.12}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontFamily: ff,
              fontSize: "18px",
              fontWeight: 800,
              color: S.white,
              animation: `fadeInUp ${0.3 / animSpeed}s ease-out`,
            }}
          >
            HCF Practice & Composite Factor Caution
          </div>
          <div
            style={{
              fontFamily: ff,
              fontSize: "11px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.6)",
              animation: `fadeInUp ${0.3 / animSpeed}s ease-out 0.04s both`,
            }}
          >
            Ganita Prakash Chapter 3 — Finding Common Ground
          </div>

          {/* Section tabs — Singularity Contained buttons at 40px height */}
          <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
            <button
              onClick={() => setSection("practice")}
              style={{
                height: "40px",
                padding: "0 24px",
                borderRadius: "40px",
                border: "none",
                background:
                  section === "practice" ? S.white : "rgba(255,255,255,0.12)",
                color:
                  section === "practice"
                    ? S.gradStart
                    : "rgba(255,255,255,0.6)",
                fontFamily: ff,
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <BookOpen size={13} /> Practice ({problems.length})
            </button>
            <button
              onClick={() => setSection("caution")}
              style={{
                height: "40px",
                padding: "0 24px",
                borderRadius: "40px",
                border: "none",
                background:
                  section === "caution" ? S.white : "rgba(255,255,255,0.12)",
                color: section === "caution" ? S.red : "rgba(255,255,255,0.6)",
                fontFamily: ff,
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <AlertTriangle size={13} /> Caution Demo
            </button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ padding: "20px 24px 24px" }}>
        {section === "practice" ? (
          <>
            {/* Instructions */}
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                background: S.indigoLight + "30",
                marginBottom: "16px",
                borderLeft: `3px solid ${S.indigo}`,
              }}
            >
              <div
                style={{
                  fontFamily: ff,
                  fontSize: "12px",
                  fontWeight: 600,
                  color: S.darkText,
                  lineHeight: 1.6,
                }}
              >
                Solve each HCF using the{" "}
                <strong style={{ color: S.indigo }}>
                  minimum occurrences method
                </strong>
                : find common primes, take the minimum count, multiply.
              </div>
            </div>

            {/* Problem dots */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                marginBottom: "16px",
                justifyContent: "center",
              }}
            >
              {problems.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurIdx(i)}
                  style={{
                    width: curIdx === i ? "32px" : "26px",
                    height: "26px",
                    borderRadius: "40px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: 700,
                    fontFamily: ff,
                    background: submitted[i]
                      ? correct[i]
                        ? S.emerald
                        : S.red
                      : curIdx === i
                        ? S.indigo
                        : S.bgLight,
                    color: submitted[i] || curIdx === i ? S.white : S.disabled,
                    border: `1px solid ${submitted[i] ? "transparent" : curIdx === i ? S.indigo : S.border}`,
                    transition: "all 0.3s ease",
                  }}
                >
                  {submitted[i] ? (
                    correct[i] ? (
                      <Check size={12} strokeWidth={3} />
                    ) : (
                      <X size={12} strokeWidth={3} />
                    )
                  ) : (
                    i + 1
                  )}
                </div>
              ))}
            </div>

            {renderProblemCard(prob, curIdx)}

            {/* Navigation — Singularity buttons */}
            {showNav && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <BtnOutlined
                  onClick={() => setCurIdx((p) => Math.max(0, p - 1))}
                  disabled={curIdx === 0}
                >
                  <ChevronLeft size={15} /> Prev
                </BtnOutlined>

                {allDone && (
                  <BtnContained onClick={handleReset} color="indigo">
                    <RotateCcw size={14} /> Reset
                  </BtnContained>
                )}

                <BtnContained
                  onClick={() =>
                    setCurIdx((p) => Math.min(problems.length - 1, p + 1))
                  }
                  disabled={curIdx === problems.length - 1}
                  color="orange"
                >
                  Next <ChevronRight size={15} />
                </BtnContained>
              </div>
            )}

            {/* Score */}
            {allDone && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "20px",
                  borderRadius: "16px",
                  background: `linear-gradient(135deg, ${S.indigoLight}40, ${S.orangeLight})`,
                  border: `1px solid ${S.border}`,
                  textAlign: "center" as const,
                  position: "relative",
                  overflow: "hidden",
                  animation: `fadeInUp ${0.4 / animSpeed}s ease-out`,
                }}
              >
                {/* Confetti dots */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      width: `${6 + Math.random() * 4}px`,
                      height: `${6 + Math.random() * 4}px`,
                      borderRadius: i % 2 === 0 ? "50%" : "2px",
                      background: [
                        S.indigo,
                        S.orange,
                        S.amber,
                        S.emerald,
                        S.red,
                      ][i % 5],
                      left: `${8 + Math.random() * 84}%`,
                      top: `${10 + Math.random() * 70}%`,
                      animation: `confettiUp 1.8s ease-out ${i * 0.1}s both`,
                    }}
                  />
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "4px",
                    marginBottom: "8px",
                  }}
                >
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      size={20}
                      fill={S.amber}
                      color={S.amber}
                      style={{
                        animation: `starSpin ${0.4 / animSpeed}s ease-out ${0.3 + s * 0.12}s both`,
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    fontFamily: ff,
                    fontSize: "28px",
                    fontWeight: 900,
                    color: S.darkText,
                  }}
                >
                  {score}/{problems.length}
                </div>
                <div
                  style={{
                    fontFamily: ff,
                    fontSize: "12px",
                    fontWeight: 500,
                    color: S.disabled,
                    marginTop: "4px",
                  }}
                >
                  {score === problems.length
                    ? "Perfect! You've mastered the direct HCF method!"
                    : "Review solutions and try the Caution Demo!"}
                </div>
              </div>
            )}
          </>
        ) : (
          renderCautionDemo()
        )}

        {/* Footer tip */}
        <div
          style={{
            marginTop: "18px",
            padding: "12px 16px",
            borderRadius: "12px",
            background: section === "caution" ? S.redLight : S.orangeLight,
            border: `1px solid ${S.border}`,
          }}
        >
          <div
            style={{
              fontFamily: ff,
              fontSize: "9px",
              fontWeight: 800,
              color: section === "caution" ? S.red : S.orange,
              textTransform: "uppercase" as const,
              letterSpacing: "1px",
              marginBottom: "3px",
            }}
          >
            {section === "caution" ? "Key Lesson" : "Student Tip"}
          </div>
          <div
            style={{
              fontFamily: ff,
              fontSize: "11px",
              fontWeight: 500,
              color: S.darkText,
              lineHeight: 1.6,
            }}
          >
            {section === "caution"
              ? "ALWAYS use prime factorisation to find HCF. Composite factors (6, 8, 12, 18) hide shared primes. Only prime building blocks reveal the true common ground!"
              : "For each common prime, take the minimum count from both factorisations. Multiply together for HCF. Coloured blocks help you match primes visually!"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HCFPracticeCompositeCautionTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
