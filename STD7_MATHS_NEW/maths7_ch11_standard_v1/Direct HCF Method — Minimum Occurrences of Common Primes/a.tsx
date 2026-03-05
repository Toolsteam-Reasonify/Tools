// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: direct_hcf_method_tool.tsx
// Topic: Direct HCF Method — Minimum Occurrences of Common Primes
// ═══════════════════════════════════════════════════════════════════════════
// @ts-nocheck — use when react and lucide-react are not installed; remove once deps are available

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  BookOpen,
  Target,
  RotateCcw,
  Award,
  Star,
  Zap,
} from "lucide-react";

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

interface DirectHCFAdditionalProps {
  numberA?: number;
  numberB?: number;
  showPencilBoxAnalogy?: boolean;
  accentColor?: string;
}

interface DirectHCFMethodToolProps {
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
    additionalProps?: DirectHCFAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== UTILITY FUNCTIONS ====================

function primeFactorise(n: number): number[] {
  const factors: number[] = [];
  let d = 2;
  let num = n;
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

function getAllPrimes(f1: number[], f2: number[]): number[] {
  const s = new Set([...f1, ...f2]);
  return Array.from(s).sort((a, b) => a - b);
}

function getCommonPrimes(f1: number[], f2: number[]): number[] {
  const s1 = new Set(f1);
  const s2 = new Set(f2);
  return Array.from(s1)
    .filter((p) => s2.has(p))
    .sort((a, b) => a - b);
}

// ==================== SINGULARITY DESIGN SYSTEM ====================

const S = {
  indigo: "#4A4DC9",
  indigoHover: "#3A3DB5",
  indigoPressed: "#2E30A0",
  indigoLight: "#C1C1EA",
  indigoUltraLight: "#EDEDF8",
  orange: "#FF7212",
  orangeHover: "#E86610",
  orangeLight: "#FFF3E4",
  orangeGlow: "#FC9145",
  gradientStart: "#533086",
  gradientEnd: "#FC9145",
  amber: "#f59e0b",
  amberLight: "#fef3c7",
  amberDark: "#b45309",
  success: "#2ECC71",
  successLight: "#E8F8F0",
  successDark: "#1B8A4A",
  error: "#E74C3C",
  errorLight: "#FDECEB",
  black: "#2D2D2D",
  darkGrey: "#4E4E4E",
  medGrey: "#7A7A7A",
  grey: "#CACACA",
  lightGrey: "#EBEBEB",
  ultraLight: "#F5F5F5",
  white: "#FFFFFF",
  lavender: "#C1C1EA",
  peach: "#FFF3E4",
  // Prime factor colours
  primeOrange: "#FF7212",
  primeGreen: "#2ECC71",
  primeBlue: "#4A4DC9",
  primePurple: "#533086",
  primeAmber: "#f59e0b",
};

const PRIME_COLORS: Record<number, string> = {
  2: S.primeBlue,
  3: S.primeOrange,
  5: S.primeGreen,
  7: S.primePurple,
  11: S.primeAmber,
  13: "#E74C3C",
  17: "#8b5cf6",
  19: "#06b6d4",
};

function getPrimeColor(p: number): string {
  return PRIME_COLORS[p] || S.medGrey;
}

// ==================== KEYFRAMES ====================

const keyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes popIn {
        0% { transform: scale(0); opacity: 0; }
        70% { transform: scale(1.15); }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.06); }
    }
    @keyframes dropIn {
        0% { opacity: 0; transform: translateY(-40px) scale(0.8); }
        60% { transform: translateY(4px) scale(1.05); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        50% { box-shadow: 0 0 20px 4px rgba(245, 158, 11, 0.25); }
    }
    @keyframes drawLine {
        from { stroke-dashoffset: 200; }
        to { stroke-dashoffset: 0; }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-4px); }
        40% { transform: translateX(4px); }
        60% { transform: translateX(-3px); }
        80% { transform: translateX(3px); }
    }
    @keyframes bounceIn {
        0% { transform: scale(0); }
        50% { transform: scale(1.2); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); }
    }
    @keyframes floatGeo {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-6px) rotate(4deg); }
    }
    @keyframes connectLine {
        from { width: 0; }
        to { width: 100%; }
    }
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    @keyframes pencilWiggle {
        0%, 100% { transform: rotate(-3deg); }
        50% { transform: rotate(3deg); }
    }
    @keyframes starSpin {
        from { transform: rotate(0deg) scale(0); opacity: 0; }
        to { transform: rotate(360deg) scale(1); opacity: 1; }
    }
    @keyframes confettiUp {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-90px) rotate(540deg); opacity: 0; }
    }
`;

// ==================== MAIN COMPONENT ====================

type ComponentProps = NonNullable<DirectHCFMethodToolProps["props"]>;

const DirectHCFMethodTool: React.FC<DirectHCFMethodToolProps> = ({
  props: propsIn,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const props: ComponentProps = propsIn ?? {};

  // ─── CONFIG ───
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: props.initialMode ?? "learn",
      showModeSelector: props.showModeSelector ?? false,
      enabledModes: props.enabledModes ?? ["learn"],
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration: props.autoPlayDuration ?? 0,
      themeColor: props.themeColor ?? S.amber,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const additionalProps = (props.additionalProps ||
    {}) as DirectHCFAdditionalProps;
  const numA = additionalProps.numberA ?? 225;
  const numB = additionalProps.numberB ?? 750;
  const showPencilBox = additionalProps.showPencilBoxAnalogy ?? true;

  // ─── COMPUTED DATA ───
  const factorsA = useMemo(() => primeFactorise(numA), [numA]);
  const factorsB = useMemo(() => primeFactorise(numB), [numB]);
  const countA = useMemo(() => getCountMap(factorsA), [factorsA]);
  const countB = useMemo(() => getCountMap(factorsB), [factorsB]);
  const allPrimes = useMemo(
    () => getAllPrimes(factorsA, factorsB),
    [factorsA, factorsB],
  );
  const commonPrimes = useMemo(
    () => getCommonPrimes(factorsA, factorsB),
    [factorsA, factorsB],
  );
  const hcf = useMemo(() => computeHCF(numA, numB), [numA, numB]);

  const hcfFactors = useMemo(() => {
    const result: number[] = [];
    commonPrimes.forEach((p) => {
      const minCount = Math.min(countA[p] || 0, countB[p] || 0);
      for (let i = 0; i < minCount; i++) result.push(p);
    });
    return result;
  }, [commonPrimes, countA, countB]);

  // ─── STATE ───
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const TOTAL_STEPS = 7;

  // ─── INJECT KEYFRAMES ───
  useEffect(() => {
    const id = "direct-hcf-keyframes";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = keyframes;
      document.head.appendChild(el);
    }
    return () => {
      const existing = document.getElementById(id);
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  // ─── AUTO-PLAY ───
  useEffect(() => {
    if (!isPlaying || config.autoPlayDuration === 0) return;
    const timer = setTimeout(() => {
      if (currentStep < TOTAL_STEPS - 1) {
        setCurrentStep((s) => s + 1);
        setAnimKey((k) => k + 1);
      } else {
        setIsPlaying(false);
      }
    }, config.autoPlayDuration || 4000);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, config.autoPlayDuration]);

  // ─── STEP DETAILS CALLBACK ───
  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: currentStep + 1,
        totalSteps: TOTAL_STEPS,
        isPaused: !isPlaying,
        currentMode: "learn",
      });
    }
  }, [currentStep, isPlaying, setStepDetails]);

  // ─── NAVIGATION ───
  const goNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((s) => s + 1);
      setAnimKey((k) => k + 1);
    }
  };
  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setAnimKey((k) => k + 1);
    }
  };
  const goToStep = (s: number) => {
    setCurrentStep(s);
    setAnimKey((k) => k + 1);
  };
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setAnimKey((k) => k + 1);
  };

  // ─── STEP CONTENT ───
  const stepTitles = [
    "Meet the Numbers",
    "Prime Factorisations",
    "Identify Common Primes",
    "Count Prime 3",
    "Count Prime 5",
    "Multiply for HCF",
    "Verify the Answer",
  ];

  const stepDescriptions = [
    `We want to find the HCF of ${numA} and ${numB}. The direct method finds HCF using prime factorisations — no need to list all factors!`,
    `Break each number into its prime factors using the division method.`,
    `Look at both factorisations. Which primes appear in BOTH? Only those primes contribute to the HCF.`,
    `Prime 3 appears ${countA[3] || 0} time(s) in ${numA} and ${countB[3] || 0} time(s) in ${numB}. We take the minimum: ${Math.min(countA[3] || 0, countB[3] || 0)}.`,
    `Prime 5 appears ${countA[5] || 0} time(s) in ${numA} and ${countB[5] || 0} time(s) in ${numB}. We take the minimum: ${Math.min(countA[5] || 0, countB[5] || 0)}.`,
    `Multiply the minimum occurrences: HCF = ${hcfFactors.join(" × ")} = ${hcf}`,
    `Check: Does ${hcf} divide both ${numA} and ${numB}? ${numA} ÷ ${hcf} = ${numA / hcf} ✓ and ${numB} ÷ ${hcf} = ${numB / hcf} ✓`,
  ];

  // ─── RENDER HELPERS ───

  const renderPrimeBlock = (
    prime: number,
    idx: number,
    delay: number,
    highlighted: boolean = false,
    dimmed: boolean = false,
  ) => (
    <div
      key={`${prime}-${idx}-${delay}`}
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif",
        fontSize: "16px",
        fontWeight: 800,
        color: dimmed ? S.grey : S.white,
        background: dimmed ? S.lightGrey : getPrimeColor(prime),
        border: highlighted ? `3px solid ${S.amber}` : "2px solid transparent",
        boxShadow: highlighted
          ? `0 0 12px ${S.amber}40`
          : `0 3px 10px ${getPrimeColor(prime)}30`,
        animation: `popIn 0.4s ease-out ${delay}s both`,
        transition: "all 0.4s ease",
        position: "relative" as const,
      }}
    >
      {prime}
      {highlighted && (
        <div
          style={{
            position: "absolute",
            top: "-6px",
            right: "-6px",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: S.amber,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "bounceIn 0.3s ease-out",
          }}
        >
          <Check size={10} color={S.white} strokeWidth={3} />
        </div>
      )}
    </div>
  );

  const renderFactorisationRow = (
    label: string,
    num: number,
    factors: number[],
    color: string,
    side: "left" | "right",
    step: number,
  ) => {
    const highlightCommon = step >= 2;
    const commonSet = new Set(commonPrimes);

    return (
      <div
        style={{
          flex: 1,
          minWidth: "200px",
          animation: `${side === "left" ? "slideInLeft" : "slideInRight"} 0.5s ease-out both`,
        }}
      >
        {/* Label */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 14px",
            borderRadius: "40px",
            background: side === "left" ? S.indigoUltraLight : S.orangeLight,
            marginBottom: "8px",
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
              fontFamily: "'Poppins', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              color: color,
              textTransform: "uppercase" as const,
              letterSpacing: "0.8px",
            }}
          >
            {label}
          </span>
        </div>

        {/* Number */}
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "34px",
            fontWeight: 900,
            color: S.black,
            marginBottom: "10px",
            lineHeight: 1.1,
          }}
        >
          {num}
        </div>

        {/* Factorisation expression */}
        {step >= 1 && (
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: S.medGrey,
              marginBottom: "10px",
              animation: "fadeIn 0.5s ease-out 0.3s both",
            }}
          >
            = {factors.join(" × ")}
          </div>
        )}

        {/* Factor blocks */}
        {step >= 1 && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {factors.map((f, i) => {
              const isCommon = commonSet.has(f);
              const dimmed = highlightCommon && !isCommon;
              return renderPrimeBlock(
                f,
                i,
                0.1 + i * 0.08,
                highlightCommon && isCommon,
                dimmed,
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ─── COMPARISON TABLE (Steps 3-4-5) ───
  const renderComparisonTable = () => {
    const showPrime3 = currentStep >= 3;
    const showPrime5 = currentStep >= 4;
    const showBoth = currentStep >= 5;

    return (
      <div
        style={{
          background: S.ultraLight,
          borderRadius: "16px",
          padding: "20px",
          border: `1px solid ${S.lightGrey}`,
          animation: "fadeInUp 0.5s ease-out 0.2s both",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 12px",
            borderRadius: "40px",
            background: S.amberLight,
            marginBottom: "14px",
          }}
        >
          <Zap size={12} color={S.amber} strokeWidth={3} />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: S.amberDark,
              textTransform: "uppercase" as const,
              letterSpacing: "0.8px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Minimum Occurrence Table
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate" as const,
              borderSpacing: "0",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <thead>
              <tr>
                {[
                  "Prime",
                  `Count in ${numA}`,
                  `Count in ${numB}`,
                  "Common?",
                  "Min Count",
                ].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "10px 14px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: S.medGrey,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.5px",
                      textAlign: "center" as const,
                      borderBottom: `2px solid ${S.lightGrey}`,
                      background: S.white,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allPrimes.map((p, idx) => {
                const cA = countA[p] || 0;
                const cB = countB[p] || 0;
                const isCommon = cA > 0 && cB > 0;
                const minC = isCommon ? Math.min(cA, cB) : 0;
                const showRow =
                  (p === 3 && showPrime3) ||
                  (p === 5 && showPrime5) ||
                  (p !== 3 && p !== 5 && showBoth) ||
                  showBoth;
                const isActiveStep =
                  (p === 3 && currentStep === 3) ||
                  (p === 5 && currentStep === 4);

                return (
                  <tr
                    key={p}
                    style={{
                      opacity: showRow ? 1 : 0.2,
                      transition: "all 0.5s ease",
                      background: isActiveStep ? S.amberLight : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 14px",
                        textAlign: "center" as const,
                        borderBottom: `1px solid ${S.lightGrey}`,
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          alignItems: "center",
                          justifyContent: "center",
                          background: showRow ? getPrimeColor(p) : S.lightGrey,
                          color: S.white,
                          fontWeight: 800,
                          fontSize: "14px",
                          transition: "all 0.4s ease",
                          animation:
                            showRow && isActiveStep
                              ? "glowPulse 1.5s ease infinite"
                              : "none",
                        }}
                      >
                        {p}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center" as const,
                        fontWeight: 700,
                        fontSize: "16px",
                        color: S.indigo,
                        borderBottom: `1px solid ${S.lightGrey}`,
                      }}
                    >
                      {cA}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center" as const,
                        fontWeight: 700,
                        fontSize: "16px",
                        color: S.orange,
                        borderBottom: `1px solid ${S.lightGrey}`,
                      }}
                    >
                      {cB}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center" as const,
                        borderBottom: `1px solid ${S.lightGrey}`,
                      }}
                    >
                      {isCommon ? (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "3px 10px",
                            borderRadius: "40px",
                            background: S.successLight,
                            color: S.successDark,
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          <Check size={12} strokeWidth={3} /> Yes
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "3px 10px",
                            borderRadius: "40px",
                            background: S.errorLight,
                            color: S.error,
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          <X size={12} strokeWidth={3} /> No
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center" as const,
                        fontWeight: 800,
                        fontSize: "18px",
                        color: isCommon ? S.amber : S.grey,
                        borderBottom: `1px solid ${S.lightGrey}`,
                        animation: isActiveStep
                          ? "pulse 1s ease infinite"
                          : "none",
                      }}
                    >
                      {isCommon ? minC : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ─── HCF ASSEMBLY AREA (Steps 5-6) ───
  const renderHCFAssembly = () => {
    if (currentStep < 5) return null;
    return (
      <div
        style={{
          background: `linear-gradient(135deg, ${S.amberLight} 0%, ${S.orangeLight} 100%)`,
          borderRadius: "16px",
          padding: "20px",
          border: `2px solid ${S.amber}30`,
          animation: "fadeInUp 0.5s ease-out 0.3s both",
          textAlign: "center" as const,
        }}
      >
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            color: S.amberDark,
            textTransform: "uppercase" as const,
            letterSpacing: "1px",
            marginBottom: "12px",
          }}
        >
          HCF Assembly
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "12px",
          }}
        >
          {hcfFactors.map((f, i) => (
            <React.Fragment key={i}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: getPrimeColor(f),
                  color: S.white,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "20px",
                  fontWeight: 900,
                  animation: `dropIn 0.5s ease-out ${0.2 + i * 0.15}s both`,
                  boxShadow: `0 4px 14px ${getPrimeColor(f)}40`,
                }}
              >
                {f}
              </div>
              {i < hcfFactors.length - 1 && (
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "20px",
                    fontWeight: 800,
                    color: S.darkGrey,
                    animation: `fadeIn 0.3s ease-out ${0.4 + i * 0.15}s both`,
                  }}
                >
                  ×
                </span>
              )}
            </React.Fragment>
          ))}
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "22px",
              fontWeight: 900,
              color: S.amber,
              animation: `popIn 0.5s ease-out ${0.6 + hcfFactors.length * 0.15}s both`,
            }}
          >
            = {hcf}
          </span>
        </div>

        {currentStep >= 6 && (
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
              animation: "fadeInUp 0.4s ease-out 0.5s both",
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "40px",
                background: S.successLight,
                color: S.successDark,
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Check size={14} strokeWidth={3} />
              {numA} ÷ {hcf} = {numA / hcf}
            </div>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "40px",
                background: S.successLight,
                color: S.successDark,
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Check size={14} strokeWidth={3} />
              {numB} ÷ {hcf} = {numB / hcf}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── PENCIL BOX ANALOGY (visible on step 3+) ───
  const renderPencilBox = () => {
    if (!showPencilBox || currentStep < 2) return null;

    const pencilsA: { prime: number; count: number }[] = commonPrimes.map(
      (p) => ({
        prime: p,
        count: countA[p] || 0,
      }),
    );
    const pencilsB: { prime: number; count: number }[] = commonPrimes.map(
      (p) => ({
        prime: p,
        count: countB[p] || 0,
      }),
    );

    return (
      <div
        style={{
          background: S.indigoUltraLight,
          borderRadius: "16px",
          padding: "16px 20px",
          border: `1.5px solid ${S.indigoLight}`,
          animation: "fadeInUp 0.5s ease-out 0.4s both",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "10px",
          }}
        >
          <span style={{ fontSize: "16px" }}>✏️</span>
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              color: S.indigo,
              textTransform: "uppercase" as const,
              letterSpacing: "0.6px",
            }}
          >
            Pencil Box Analogy
          </span>
        </div>
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            color: S.darkGrey,
            lineHeight: 1.6,
          }}
        >
          Think of each prime as a coloured pencil. {numA}'s box has{" "}
          {commonPrimes.map((p, i) => (
            <span key={p}>
              <strong style={{ color: getPrimeColor(p) }}>
                {countA[p]}×{p}
              </strong>
              {i < commonPrimes.length - 1 ? " and " : ""}
            </span>
          ))}
          . {numB}'s box has{" "}
          {commonPrimes.map((p, i) => (
            <span key={p}>
              <strong style={{ color: getPrimeColor(p) }}>
                {countB[p]}×{p}
              </strong>
              {i < commonPrimes.length - 1 ? " and " : ""}
            </span>
          ))}
          . You can only <strong>match</strong> what both have — so take the{" "}
          <strong style={{ color: S.amber }}>minimum</strong> of each colour!
        </div>
      </div>
    );
  };

  // ─── MAIN RENDER ───
  return (
    <div
      ref={containerRef}
      key={animKey}
      style={{
        width: "100%",
        maxWidth: `${config.width}px`,
        fontFamily: "'Poppins', sans-serif",
        background: S.white,
        borderRadius: "24px",
        overflow: "hidden",
        border: `1px solid ${S.lightGrey}`,
        position: "relative",
      }}
    >
      {/* ─── HEADER ─── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${S.gradientStart} 0%, ${S.gradientEnd} 100%)`,
          padding: "22px 28px 18px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Geometric decorations */}
        <div
          style={{
            position: "absolute",
            top: "-12px",
            right: "-8px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-18px",
            left: "50px",
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.08)",
          }}
        />
        <svg
          style={{
            position: "absolute",
            bottom: "6px",
            right: "24px",
            opacity: 0.08,
          }}
          width="36"
          height="36"
          viewBox="0 0 40 40"
        >
          <polygon
            points="20,5 38,35 2,35"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>

        <div
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: S.white,
            marginBottom: "3px",
            animation: "fadeInUp 0.4s ease-out",
          }}
        >
          Direct HCF Method — Minimum Occurrences
        </div>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.7)",
            animation: "fadeInUp 0.4s ease-out 0.06s both",
          }}
        >
          Ganita Prakash Chapter 3 — Finding Common Ground
        </div>

        {/* Progress bar */}
        <div
          style={{
            marginTop: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "5px",
              borderRadius: "3px",
              background: "rgba(255,255,255,0.2)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%`,
                borderRadius: "3px",
                background: S.white,
                transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>
          {config.showStepIndicator && (
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: S.white,
                minWidth: "50px",
                textAlign: "right" as const,
              }}
            >
              Step {currentStep + 1}/{TOTAL_STEPS}
            </div>
          )}
        </div>

        {/* Step dots */}
        <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              onClick={() => goToStep(i)}
              style={{
                width: i === currentStep ? "30px" : "24px",
                height: "24px",
                borderRadius: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: 700,
                cursor: "pointer",
                background:
                  i === currentStep
                    ? S.white
                    : i < currentStep
                      ? "rgba(255,255,255,0.8)"
                      : "rgba(255,255,255,0.15)",
                color:
                  i === currentStep
                    ? S.gradientStart
                    : i < currentStep
                      ? S.success
                      : "rgba(255,255,255,0.5)",
                transition: "all 0.3s ease",
              }}
            >
              {i < currentStep ? <Check size={11} strokeWidth={3} /> : i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* ─── BODY ─── */}
      <div style={{ padding: "22px 28px 28px" }}>
        {/* Step title & description */}
        <div
          style={{
            marginBottom: "18px",
            animation: "fadeInUp 0.4s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "6px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                padding: "5px 14px",
                borderRadius: "40px",
                background:
                  currentStep === TOTAL_STEPS - 1
                    ? S.successLight
                    : S.amberLight,
                color:
                  currentStep === TOTAL_STEPS - 1 ? S.successDark : S.amberDark,
                fontSize: "12px",
                fontWeight: 700,
                animation:
                  currentStep >= 5 ? "glowPulse 2s ease infinite" : "none",
              }}
            >
              {stepTitles[currentStep]}
            </div>
          </div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: S.darkGrey,
              lineHeight: 1.6,
              borderLeft: `3px solid ${S.amber}`,
              paddingLeft: "14px",
            }}
          >
            {stepDescriptions[currentStep]}
          </div>
        </div>

        {/* Number cards (always visible) */}
        <div
          style={{
            background: S.ultraLight,
            borderRadius: "16px",
            padding: "20px",
            border: `1px solid ${S.lightGrey}`,
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {renderFactorisationRow(
              "Number A",
              numA,
              factorsA,
              S.indigo,
              "left",
              currentStep,
            )}
            {renderFactorisationRow(
              "Number B",
              numB,
              factorsB,
              S.orange,
              "right",
              currentStep,
            )}
          </div>
        </div>

        {/* Comparison table (steps 3+) */}
        {currentStep >= 3 && (
          <div style={{ marginBottom: "16px" }}>{renderComparisonTable()}</div>
        )}

        {/* HCF Assembly (steps 5+) */}
        {renderHCFAssembly()}

        {/* Pencil box analogy */}
        {currentStep >= 2 && currentStep < 6 && (
          <div style={{ marginTop: "16px" }}>{renderPencilBox()}</div>
        )}

        {/* Final celebration */}
        {currentStep === TOTAL_STEPS - 1 && (
          <div
            style={{
              marginTop: "16px",
              textAlign: "center" as const,
              padding: "20px",
              background: `linear-gradient(135deg, ${S.indigoUltraLight}, ${S.amberLight})`,
              borderRadius: "16px",
              border: `2px solid ${S.success}30`,
              animation: "fadeInUp 0.5s ease-out 0.6s both",
              position: "relative" as const,
              overflow: "hidden",
            }}
          >
            {/* Confetti */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: "8px",
                  height: "8px",
                  borderRadius: i % 2 === 0 ? "50%" : "2px",
                  background: [
                    S.indigo,
                    S.orange,
                    S.amber,
                    S.success,
                    S.lavender,
                  ][i % 5],
                  left: `${10 + Math.random() * 80}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animation: `confettiUp 1.5s ease-out ${i * 0.1}s both`,
                }}
              />
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  size={24}
                  fill={S.amber}
                  color={S.amber}
                  style={{
                    animation: `starSpin 0.4s ease-out ${0.6 + s * 0.12}s both`,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "18px",
                fontWeight: 800,
                color: S.black,
              }}
            >
              HCF({numA}, {numB}) = {hcf}
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: S.medGrey,
                marginTop: "4px",
              }}
            >
              Found using the Direct Method — minimum occurrences of common
              primes!
            </div>
          </div>
        )}

        {/* ─── NAVIGATION ─── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            gap: "10px",
          }}
        >
          <button
            onClick={goPrev}
            disabled={currentStep === 0}
            style={{
              display: config.showNavigation ? "flex" : "none",
              alignItems: "center",
              gap: "6px",
              height: "42px",
              padding: "0 20px",
              borderRadius: "40px",
              border: `2px solid ${currentStep === 0 ? S.lightGrey : S.indigo}`,
              background: "transparent",
              color: currentStep === 0 ? S.grey : S.indigo,
              fontFamily: "'Poppins', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              cursor: currentStep === 0 ? "not-allowed" : "pointer",
              transition: "all 0.25s ease",
              opacity: currentStep === 0 ? 0.4 : 1,
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>

          {config.showPlayPause && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                height: "42px",
                padding: "0 20px",
                borderRadius: "40px",
                border: "none",
                background: `linear-gradient(135deg, ${S.gradientStart}, ${S.gradientEnd})`,
                color: S.white,
                fontFamily: "'Poppins', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              {isPlaying ? (
                <>
                  <Pause size={14} /> Pause
                </>
              ) : (
                <>
                  <Play size={14} /> Auto-Play
                </>
              )}
            </button>
          )}

          <button
            onClick={currentStep === TOTAL_STEPS - 1 ? handleReset : goNext}
            style={{
              display: config.showNavigation ? "flex" : "none",
              alignItems: "center",
              gap: "6px",
              height: "42px",
              padding: "0 22px",
              borderRadius: "40px",
              border: "none",
              background: currentStep === TOTAL_STEPS - 1 ? S.indigo : S.orange,
              color: S.white,
              fontFamily: "'Poppins', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: `0 4px 14px ${currentStep === TOTAL_STEPS - 1 ? S.indigo : S.orange}30`,
            }}
          >
            {currentStep === TOTAL_STEPS - 1 ? (
              <>
                <RotateCcw size={14} /> Restart
              </>
            ) : (
              <>
                Next <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>

        {/* How-to footer */}
        <div
          style={{
            marginTop: "16px",
            padding: "12px 18px",
            borderRadius: "14px",
            background: S.orangeLight,
            border: `1.5px solid ${S.orange}18`,
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: S.orange,
              textTransform: "uppercase" as const,
              letterSpacing: "0.8px",
              marginBottom: "3px",
            }}
          >
            Student Tip
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: S.darkGrey,
              lineHeight: 1.5,
            }}
          >
            For each common prime, take the{" "}
            <strong style={{ color: S.amber }}>minimum count</strong> from both
            factorisations. Multiply those together to get the HCF. It's like
            matching pencil boxes — you can only match what both people have!
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectHCFMethodTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
