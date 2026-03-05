// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: hcf_coprime_practice_tool.tsx
// Redesigned with Singularity Design System
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
  Check,
  X,
  Award,
  Star,
  ChevronRight,
  RotateCcw,
  Plus,
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

interface ProblemData {
  num1: number;
  num2: number;
  primeFactors1: number[];
  primeFactors2: number[];
  commonPrimes: number[];
  hcf: number;
  isCoprime: boolean;
}

interface HCFAdditionalProps {
  problems?: {
    num1: number;
    num2: number;
  }[];
  showVennDiagram?: boolean;
  showHints?: boolean;
  accentColor?: string;
  errorColor?: string;
}

interface HCFCoprimeToolProps {
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
    additionalProps?: HCFAdditionalProps;
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

function getCommonPrimes(f1: number[], f2: number[]): number[] {
  const count1: Record<number, number> = {};
  const count2: Record<number, number> = {};
  f1.forEach((p) => (count1[p] = (count1[p] || 0) + 1));
  f2.forEach((p) => (count2[p] = (count2[p] || 0) + 1));
  const result: number[] = [];
  for (const p of Object.keys(count1)) {
    const pn = Number(p);
    if (count2[pn]) {
      const minCount = Math.min(count1[pn], count2[pn]);
      for (let i = 0; i < minCount; i++) result.push(pn);
    }
  }
  return result.sort((a, b) => a - b);
}

function buildProblem(num1: number, num2: number): ProblemData {
  const pf1 = primeFactorise(num1);
  const pf2 = primeFactorise(num2);
  const common = getCommonPrimes(pf1, pf2);
  const hcf = computeHCF(num1, num2);
  return {
    num1,
    num2,
    primeFactors1: pf1,
    primeFactors2: pf2,
    commonPrimes: common,
    hcf,
    isCoprime: hcf === 1,
  };
}

const DEFAULT_PROBLEMS = [
  { num1: 50, num2: 60 },
  { num1: 140, num2: 275 },
  { num1: 77, num2: 725 },
  { num1: 370, num2: 592 },
  { num1: 81, num2: 243 },
];

// ==================== ANIMATION HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
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

// ==================== SINGULARITY DESIGN SYSTEM COLORS ====================

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
};

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
        70% { transform: scale(1.1); }
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
        50% { transform: scale(1.04); }
    }
    @keyframes badgeBounce {
        0% { transform: scale(0) rotate(-8deg); }
        50% { transform: scale(1.15) rotate(2deg); }
        70% { transform: scale(0.96) rotate(-1deg); }
        100% { transform: scale(1) rotate(0deg); }
    }
    @keyframes drawCircle {
        from { stroke-dashoffset: 314; }
        to { stroke-dashoffset: 0; }
    }
    @keyframes confettiUp {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-100px) rotate(540deg); opacity: 0; }
    }
    @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(74, 77, 201, 0); }
        50% { box-shadow: 0 0 18px 4px rgba(74, 77, 201, 0.2); }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-5px); }
        40% { transform: translateX(5px); }
        60% { transform: translateX(-3px); }
        80% { transform: translateX(3px); }
    }
    @keyframes starSpin {
        from { transform: rotate(0deg) scale(0); opacity: 0; }
        to { transform: rotate(360deg) scale(1); opacity: 1; }
    }
    @keyframes floatGeo {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-8px) rotate(6deg); }
    }
`;

// ==================== SUB COMPONENTS ====================

interface PrimeFactorInputProps {
  label: string;
  number: number;
  correctFactors: number[];
  userInput: string;
  onInputChange: (val: string) => void;
  validated: boolean;
  isCorrect: boolean;
  side: "left" | "right";
  animDelay: number;
}

const PrimeFactorInput: React.FC<PrimeFactorInputProps> = ({
  label,
  number,
  correctFactors,
  userInput,
  onInputChange,
  validated,
  isCorrect,
  side,
  animDelay,
}) => {
  const borderColor = validated
    ? isCorrect
      ? S.success
      : S.error
    : S.lightGrey;
  const bgColor = validated
    ? isCorrect
      ? S.successLight
      : S.errorLight
    : S.white;
  const accentColor = side === "left" ? S.indigo : S.orange;

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        animation: `${side === "left" ? "slideInLeft" : "slideInRight"} 0.5s ease-out ${animDelay}s both`,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 12px",
          borderRadius: "20px",
          background: side === "left" ? S.indigoUltraLight : S.orangeLight,
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: accentColor,
          }}
        />
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            color: accentColor,
            textTransform: "uppercase",
            letterSpacing: "0.8px",
          }}
        >
          {label}
        </span>
      </div>

      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "32px",
          fontWeight: 900,
          color: S.black,
          marginBottom: "10px",
          lineHeight: 1.1,
        }}
      >
        {number}
      </div>

      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "11px",
          fontWeight: 500,
          color: S.medGrey,
          marginBottom: "6px",
        }}
      >
        Prime factorisation (e.g. 2 × 3 × 5)
      </div>

      <input
        type="text"
        value={userInput}
        onChange={(e) => onInputChange(e.target.value)}
        disabled={validated}
        placeholder="e.g. 2 × 3 × 5"
        style={{
          width: "100%",
          padding: "11px 16px",
          borderRadius: "40px",
          border: `2px solid ${borderColor}`,
          backgroundColor: bgColor,
          fontFamily: "'Poppins', sans-serif",
          fontSize: "14px",
          fontWeight: 600,
          color: S.black,
          outline: "none",
          transition: "all 0.3s ease",
          boxSizing: "border-box",
          animation: validated && !isCorrect ? "shake 0.4s ease" : "none",
        }}
        onFocus={(e) => {
          if (!validated) {
            e.currentTarget.style.borderColor = accentColor;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}18`;
          }
        }}
        onBlur={(e) => {
          if (!validated) {
            e.currentTarget.style.borderColor = S.lightGrey;
            e.currentTarget.style.boxShadow = "none";
          }
        }}
      />

      {validated && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginTop: "8px",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            color: isCorrect ? S.successDark : S.error,
            animation: "fadeIn 0.3s ease",
          }}
        >
          {isCorrect ? (
            <>
              <Check size={13} strokeWidth={3} /> Correct!
            </>
          ) : (
            <>
              <X size={13} strokeWidth={3} /> {correctFactors.join(" × ")}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ==================== VENN DIAGRAM ====================

interface VennDiagramProps {
  factors1: number[];
  factors2: number[];
  commonPrimes: number[];
  num1: number;
  num2: number;
  visible: boolean;
}

const VennDiagram: React.FC<VennDiagramProps> = ({
  factors1,
  factors2,
  commonPrimes,
  num1,
  num2,
  visible,
}) => {
  if (!visible) return null;

  const countMap = (arr: number[]): Record<number, number> => {
    const m: Record<number, number> = {};
    arr.forEach((p) => (m[p] = (m[p] || 0) + 1));
    return m;
  };

  const c1 = countMap(factors1);
  const c2 = countMap(factors2);
  const cc = countMap(commonPrimes);

  const unique1: number[] = [];
  const temp1 = { ...c1 };
  for (const p of Object.keys(cc)) {
    const pn = Number(p);
    temp1[pn] = (temp1[pn] || 0) - cc[pn];
  }
  for (const p of Object.keys(temp1)) {
    for (let i = 0; i < (temp1[Number(p)] || 0); i++) unique1.push(Number(p));
  }

  const unique2: number[] = [];
  const temp2 = { ...c2 };
  for (const p of Object.keys(cc)) {
    const pn = Number(p);
    temp2[pn] = (temp2[pn] || 0) - cc[pn];
  }
  for (const p of Object.keys(temp2)) {
    for (let i = 0; i < (temp2[Number(p)] || 0); i++) unique2.push(Number(p));
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "360px",
        height: "170px",
        margin: "4px auto 0",
        animation: "fadeInUp 0.6s ease-out 0.2s both",
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 360 170">
        <circle
          cx="128"
          cy="88"
          r="68"
          fill={`${S.indigo}12`}
          stroke={S.indigo}
          strokeWidth="2"
          strokeDasharray="314"
          style={{ animation: "drawCircle 0.8s ease-out 0.2s both" }}
        />
        <circle
          cx="232"
          cy="88"
          r="68"
          fill={`${S.orange}10`}
          stroke={S.orange}
          strokeWidth="2"
          strokeDasharray="314"
          style={{ animation: "drawCircle 0.8s ease-out 0.4s both" }}
        />
        <text
          x="80"
          y="22"
          fontFamily="'Poppins', sans-serif"
          fontSize="12"
          fontWeight="700"
          fill={S.indigo}
        >
          {num1}
        </text>
        <text
          x="252"
          y="22"
          fontFamily="'Poppins', sans-serif"
          fontSize="12"
          fontWeight="700"
          fill={S.orange}
        >
          {num2}
        </text>
        {unique1.map((p, i) => (
          <text
            key={`u1-${i}`}
            x={80 + (i % 2) * 28}
            y={68 + Math.floor(i / 2) * 24}
            fontFamily="'Poppins', sans-serif"
            fontSize="16"
            fontWeight="800"
            fill={S.indigo}
            style={{ animation: `popIn 0.4s ease-out ${0.6 + i * 0.1}s both` }}
          >
            {p}
          </text>
        ))}
        {commonPrimes.map((p, i) => (
          <text
            key={`c-${i}`}
            x={164 + (i % 2) * 22}
            y={72 + Math.floor(i / 2) * 24}
            fontFamily="'Poppins', sans-serif"
            fontSize="17"
            fontWeight="900"
            fill={S.gradientStart}
            style={{ animation: `popIn 0.4s ease-out ${0.8 + i * 0.1}s both` }}
          >
            {p}
          </text>
        ))}
        {unique2.map((p, i) => (
          <text
            key={`u2-${i}`}
            x={250 + (i % 2) * 26}
            y={68 + Math.floor(i / 2) * 24}
            fontFamily="'Poppins', sans-serif"
            fontSize="16"
            fontWeight="800"
            fill={S.orange}
            style={{ animation: `popIn 0.4s ease-out ${1.0 + i * 0.1}s both` }}
          >
            {p}
          </text>
        ))}
        {commonPrimes.length === 0 && (
          <text
            x="165"
            y="92"
            fontFamily="'Poppins', sans-serif"
            fontSize="11"
            fontWeight="600"
            fill={S.grey}
            style={{ animation: "fadeIn 0.6s ease 1s both" }}
          >
            none
          </text>
        )}
      </svg>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

type ComponentProps = NonNullable<HCFCoprimeToolProps["props"]>;

const HCFCoprimePracticeTool: React.FC<HCFCoprimeToolProps> = ({
  props: propsIn,
  setStepDetails,
}) => {
  const props: ComponentProps = propsIn ?? {};

  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      animationSpeed: props.animationSpeed ?? 1,
      themeColor: props.themeColor ?? S.indigo,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const additionalProps = (props.additionalProps || {}) as HCFAdditionalProps;
  const rawProblems = additionalProps.problems ?? DEFAULT_PROBLEMS;
  const showVennDiagram = additionalProps.showVennDiagram ?? true;

  const problems: ProblemData[] = useMemo(
    () => rawProblems.map((p) => buildProblem(p.num1, p.num2)),
    [rawProblems],
  );

  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [hcfInput, setHcfInput] = useState("");
  const [validated, setValidated] = useState(false);
  const [results, setResults] = useState<(boolean | null)[]>(
    problems.map(() => null),
  );
  const [showSummary, setShowSummary] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentProblem = problems[currentProblemIdx];
  const completedCount = results.filter((r) => r !== null).length;
  const correctCount = results.filter((r) => r === true).length;

  useEffect(() => {
    const id = "hcf-singularity-keyframes";
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

  const parseFactors = (input: string): number[] => {
    const cleaned = input
      .replace(/×/g, "*")
      .replace(/x/gi, "*")
      .replace(/·/g, "*");
    const parts = cleaned
      .split("*")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const nums: number[] = [];
    for (const p of parts) {
      const n = parseInt(p, 10);
      if (!isNaN(n) && n > 0) nums.push(n);
    }
    return nums.sort((a, b) => a - b);
  };

  const productEquals = (factors: number[], target: number): boolean => {
    if (factors.length === 0) return false;
    return factors.reduce((a, b) => a * b, 1) === target;
  };

  const handleCheck = () => {
    const userFactors1 = parseFactors(input1);
    const userFactors2 = parseFactors(input2);
    const userHcf = parseInt(hcfInput.trim(), 10);

    const f1Ok =
      productEquals(userFactors1, currentProblem.num1) &&
      userFactors1.every((n) => primeFactorise(n).length === 1);
    const f2Ok =
      productEquals(userFactors2, currentProblem.num2) &&
      userFactors2.every((n) => primeFactorise(n).length === 1);
    const hcfOk = userHcf === currentProblem.hcf;

    const allCorrect = f1Ok && f2Ok && hcfOk;
    setValidated(true);

    const newResults = [...results];
    newResults[currentProblemIdx] = allCorrect;
    setResults(newResults);

    if (setStepDetails) {
      setStepDetails({
        currentStep: currentProblemIdx + 1,
        totalSteps: problems.length,
        isPaused: true,
        currentMode: "practice",
      });
    }
  };

  const handleNext = () => {
    if (currentProblemIdx < problems.length - 1) {
      setCurrentProblemIdx(currentProblemIdx + 1);
      setInput1("");
      setInput2("");
      setHcfInput("");
      setValidated(false);
      setAnimKey((k) => k + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleReset = () => {
    setCurrentProblemIdx(0);
    setInput1("");
    setInput2("");
    setHcfInput("");
    setValidated(false);
    setResults(problems.map(() => null));
    setShowSummary(false);
    setAnimKey((k) => k + 1);
  };

  const isFactorCorrect = (
    input: string,
    num: number,
    correctFactors: number[],
  ): boolean => {
    const user = parseFactors(input);
    return (
      productEquals(user, num) &&
      user.every((n) => primeFactorise(n).length === 1)
    );
  };

  // ─── SUMMARY SCREEN ───
  if (showSummary) {
    const percent = Math.round((correctCount / problems.length) * 100);
    const stars =
      correctCount >= 4 ? 3 : correctCount >= 2 ? 2 : correctCount >= 1 ? 1 : 0;
    return (
      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth: `${config.width}px`,
          minHeight: "500px",
          fontFamily: "'Poppins', sans-serif",
          background: S.white,
          borderRadius: "24px",
          padding: "48px 32px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          animation: "fadeInUp 0.6s ease-out",
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${S.lightGrey}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            background: `linear-gradient(90deg, ${S.gradientStart}, ${S.gradientEnd})`,
          }}
        />

        {/* Geometric decorations */}
        <svg
          style={{
            position: "absolute",
            top: 30,
            left: 20,
            opacity: 0.15,
            animation: "floatGeo 4s ease-in-out infinite",
          }}
          width="40"
          height="40"
          viewBox="0 0 40 40"
        >
          <polygon
            points="20,4 36,36 4,36"
            stroke={S.indigo}
            strokeWidth="2"
            fill="none"
          />
        </svg>
        <svg
          style={{
            position: "absolute",
            top: 40,
            right: 30,
            opacity: 0.12,
            animation: "floatGeo 5s ease-in-out 0.5s infinite",
          }}
          width="32"
          height="32"
          viewBox="0 0 32 32"
        >
          <circle
            cx="16"
            cy="16"
            r="13"
            stroke={S.orange}
            strokeWidth="2"
            fill="none"
          />
        </svg>
        <svg
          style={{
            position: "absolute",
            bottom: 30,
            left: 40,
            opacity: 0.1,
            animation: "floatGeo 4.5s ease-in-out 1s infinite",
          }}
          width="28"
          height="28"
          viewBox="0 0 28 28"
        >
          <rect
            x="4"
            y="4"
            width="20"
            height="20"
            stroke={S.lavender}
            strokeWidth="2"
            fill="none"
          />
        </svg>

        {/* Confetti */}
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: i % 3 === 0 ? "0" : "9px",
              height: i % 3 === 0 ? "0" : "9px",
              borderRadius: i % 3 === 2 ? "50%" : "2px",
              ...(i % 3 === 0
                ? {
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderBottom: `10px solid ${[S.indigo, S.orange, S.gradientStart, S.orangeGlow, S.lavender][i % 5]}`,
                  }
                : {
                    background: [
                      S.indigo,
                      S.orange,
                      S.gradientStart,
                      S.orangeGlow,
                      S.lavender,
                    ][i % 5],
                  }),
              left: `${8 + Math.random() * 84}%`,
              top: `${15 + Math.random() * 70}%`,
              animation: `confettiUp 1.8s ease-out ${i * 0.1}s both`,
            }}
          />
        ))}

        <div style={{ animation: "popIn 0.6s ease-out 0.1s both" }}>
          <Award size={52} color={S.orange} strokeWidth={1.8} />
        </div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: S.black,
            animation: "fadeInUp 0.5s ease-out 0.2s both",
          }}
        >
          Practice Complete!
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            animation: "fadeIn 0.6s ease-out 0.4s both",
          }}
        >
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              size={38}
              fill={s <= stars ? S.orange : "transparent"}
              color={s <= stars ? S.orange : S.lightGrey}
              strokeWidth={2}
              style={{
                animation:
                  s <= stars
                    ? `starSpin 0.5s ease-out ${0.5 + s * 0.15}s both`
                    : "none",
              }}
            />
          ))}
        </div>

        <div
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: S.medGrey,
            animation: "fadeInUp 0.5s ease-out 0.6s both",
          }}
        >
          {correctCount} of {problems.length} correct ({percent}%)
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            justifyContent: "center",
            animation: "fadeInUp 0.5s ease-out 0.8s both",
            maxWidth: "480px",
          }}
        >
          {problems.map((p, i) => (
            <div
              key={i}
              style={{
                padding: "6px 14px",
                borderRadius: "40px",
                background: results[i] ? S.successLight : S.errorLight,
                color: results[i] ? S.successDark : S.error,
                fontWeight: 600,
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                border: `1.5px solid ${results[i] ? S.success + "40" : S.error + "40"}`,
              }}
            >
              {results[i] ? (
                <Check size={13} strokeWidth={3} />
              ) : (
                <X size={13} strokeWidth={3} />
              )}
              {p.num1}, {p.num2}
              {p.isCoprime && (
                <span
                  style={{
                    background: `linear-gradient(135deg, ${S.gradientStart}, ${S.gradientEnd})`,
                    color: S.white,
                    padding: "1px 8px",
                    borderRadius: "10px",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                  }}
                >
                  CO-PRIME
                </span>
              )}
              <span style={{ color: S.medGrey, fontSize: "12px" }}>
                HCF={p.hcf}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={handleReset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            height: "44px",
            padding: "0 28px",
            borderRadius: "40px",
            border: "none",
            background: S.indigo,
            color: S.white,
            fontFamily: "'Poppins', sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.25s ease",
            animation: "fadeInUp 0.5s ease-out 1s both",
            boxShadow: `0 4px 16px ${S.indigo}30`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.04)";
            e.currentTarget.style.background = S.indigoHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = S.indigo;
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.96)";
            e.currentTarget.style.background = S.indigoPressed;
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1.04)";
            e.currentTarget.style.background = S.indigoHover;
          }}
        >
          <RotateCcw size={17} /> Try Again
        </button>
      </div>
    );
  }

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
          padding: "24px 28px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Geometric bg shapes */}
        <div
          style={{
            position: "absolute",
            top: "-15px",
            right: "-10px",
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "50px",
            width: "50px",
            height: "50px",
            border: "1.5px solid rgba(255,255,255,0.08)",
            transform: "rotate(45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20px",
            left: "60px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.08)",
          }}
        />
        <svg
          style={{
            position: "absolute",
            bottom: "5px",
            right: "20px",
            opacity: 0.1,
          }}
          width="40"
          height="40"
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
            fontSize: "20px",
            fontWeight: 800,
            color: S.white,
            marginBottom: "4px",
            animation: "fadeInUp 0.4s ease-out",
            letterSpacing: "-0.3px",
          }}
        >
          HCF Practice with Co-prime Detection
        </div>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.75)",
            animation: "fadeInUp 0.4s ease-out 0.08s both",
          }}
        >
          Find prime factorisations, identify common primes, compute the HCF
        </div>

        {/* Progress bar */}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "6px",
              borderRadius: "3px",
              background: "rgba(255,255,255,0.2)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(completedCount / problems.length) * 100}%`,
                borderRadius: "3px",
                background: S.white,
                transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: S.white,
              minWidth: "44px",
              textAlign: "right" as const,
            }}
          >
            {completedCount}/{problems.length}
          </div>
        </div>

        {/* Step dots */}
        <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
          {problems.map((_, i) => {
            const isActive = i === currentProblemIdx;
            const isDone = results[i] !== null;
            const isOk = results[i] === true;
            return (
              <div
                key={i}
                style={{
                  width: isActive ? "32px" : "28px",
                  height: "28px",
                  borderRadius: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                  background: isActive
                    ? S.white
                    : isDone
                      ? isOk
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.35)"
                      : "rgba(255,255,255,0.15)",
                  color: isActive
                    ? S.gradientStart
                    : isDone
                      ? isOk
                        ? S.success
                        : S.error
                      : "rgba(255,255,255,0.55)",
                  transition: "all 0.35s ease",
                  cursor: "default",
                }}
              >
                {isDone ? (
                  isOk ? (
                    <Check size={13} strokeWidth={3} />
                  ) : (
                    <X size={13} strokeWidth={3} />
                  )
                ) : (
                  i + 1
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── CARD BODY ─── */}
      <div style={{ padding: "24px 28px 28px" }}>
        <div
          style={{
            background: S.white,
            borderRadius: "20px",
            padding: "24px",
            border: `1.5px solid ${S.lightGrey}`,
            animation: "fadeInUp 0.5s ease-out",
            position: "relative",
          }}
        >
          {/* Title bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div style={{ fontSize: "15px", fontWeight: 700, color: S.black }}>
              Problem {currentProblemIdx + 1}{" "}
              <span style={{ color: S.medGrey, fontWeight: 500 }}>
                of {problems.length}
              </span>
            </div>
            <div
              style={{
                padding: "5px 16px",
                borderRadius: "40px",
                background: `linear-gradient(135deg, ${S.gradientStart}12, ${S.gradientEnd}12)`,
                border: `1.5px solid ${S.gradientStart}20`,
                fontSize: "13px",
                fontWeight: 700,
                color: S.gradientStart,
              }}
            >
              Find HCF({currentProblem.num1}, {currentProblem.num2})
            </div>
          </div>

          {/* Step 1 */}
          <div
            style={{
              background: S.ultraLight,
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "16px",
              border: `1px solid ${S.lightGrey}`,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "40px",
                background: S.indigoUltraLight,
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: S.indigo,
                  color: S.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: 800,
                }}
              >
                1
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: S.indigo,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.8px",
                }}
              >
                Prime Factorisations
              </span>
            </div>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <PrimeFactorInput
                label="Number A"
                number={currentProblem.num1}
                correctFactors={currentProblem.primeFactors1}
                userInput={input1}
                onInputChange={setInput1}
                validated={validated}
                isCorrect={isFactorCorrect(
                  input1,
                  currentProblem.num1,
                  currentProblem.primeFactors1,
                )}
                side="left"
                animDelay={0.1}
              />
              <PrimeFactorInput
                label="Number B"
                number={currentProblem.num2}
                correctFactors={currentProblem.primeFactors2}
                userInput={input2}
                onInputChange={setInput2}
                validated={validated}
                isCorrect={isFactorCorrect(
                  input2,
                  currentProblem.num2,
                  currentProblem.primeFactors2,
                )}
                side="right"
                animDelay={0.2}
              />
            </div>
          </div>

          {/* Step 2 */}
          <div
            style={{
              background: S.ultraLight,
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "16px",
              border: `1px solid ${S.lightGrey}`,
              animation: "fadeInUp 0.5s ease-out 0.25s both",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "40px",
                background: S.orangeLight,
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: S.orange,
                  color: S.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: 800,
                }}
              >
                2
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: S.orange,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.8px",
                }}
              >
                Compute HCF
              </span>
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: S.medGrey,
                marginBottom: "10px",
              }}
            >
              Identify common primes, take minimum counts, multiply:
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{ fontSize: "16px", fontWeight: 800, color: S.black }}
              >
                HCF =
              </div>
              <input
                type="text"
                value={hcfInput}
                onChange={(e) => setHcfInput(e.target.value)}
                disabled={validated}
                placeholder="?"
                style={{
                  width: "110px",
                  height: "44px",
                  padding: "0 18px",
                  borderRadius: "40px",
                  border: `2px solid ${validated ? (parseInt(hcfInput) === currentProblem.hcf ? S.success : S.error) : S.lightGrey}`,
                  backgroundColor: validated
                    ? parseInt(hcfInput) === currentProblem.hcf
                      ? S.successLight
                      : S.errorLight
                    : S.white,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "18px",
                  fontWeight: 800,
                  color: S.black,
                  textAlign: "center" as const,
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box" as const,
                  animation:
                    validated && parseInt(hcfInput) !== currentProblem.hcf
                      ? "shake 0.4s ease"
                      : "none",
                }}
                onFocus={(e) => {
                  if (!validated) {
                    e.currentTarget.style.borderColor = S.orange;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${S.orange}18`;
                  }
                }}
                onBlur={(e) => {
                  if (!validated) {
                    e.currentTarget.style.borderColor = S.lightGrey;
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              />
              {validated && parseInt(hcfInput) !== currentProblem.hcf && (
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: S.error,
                    animation: "fadeIn 0.3s ease",
                  }}
                >
                  Correct: {currentProblem.hcf}
                </div>
              )}
            </div>
          </div>

          {/* CO-PRIME BADGE */}
          {validated && currentProblem.isCoprime && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: `linear-gradient(135deg, ${S.indigoUltraLight} 0%, ${S.orangeLight} 100%)`,
                borderRadius: "16px",
                padding: "16px 22px",
                marginBottom: "16px",
                border: `2px solid ${S.indigo}30`,
                animation: "badgeBounce 0.6s ease-out",
              }}
            >
              <div
                style={{
                  background: `linear-gradient(135deg, ${S.gradientStart}, ${S.gradientEnd})`,
                  color: S.white,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "6px 16px",
                  borderRadius: "40px",
                  letterSpacing: "1.5px",
                  animation: "glowPulse 2s ease infinite",
                  whiteSpace: "nowrap" as const,
                }}
              >
                CO-PRIME
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: S.darkGrey,
                  lineHeight: "1.5",
                }}
              >
                These numbers share no common prime factors!
                <br />
                Their HCF is 1 — they are co-prime.
              </div>
            </div>
          )}

          {/* Venn Diagram */}
          {validated && showVennDiagram && (
            <VennDiagram
              factors1={currentProblem.primeFactors1}
              factors2={currentProblem.primeFactors2}
              commonPrimes={currentProblem.commonPrimes}
              num1={currentProblem.num1}
              num2={currentProblem.num2}
              visible={validated}
            />
          )}

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              marginTop: "12px",
              animation: "fadeInUp 0.5s ease-out 0.35s both",
            }}
          >
            {!validated ? (
              <button
                onClick={handleCheck}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "44px",
                  padding: "0 28px",
                  borderRadius: "40px",
                  border: "none",
                  background: S.indigo,
                  color: S.white,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: `0 4px 14px ${S.indigo}28`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.04)";
                  e.currentTarget.style.background = S.indigoHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.background = S.indigo;
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.96)";
                  e.currentTarget.style.background = S.indigoPressed;
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1.04)";
                  e.currentTarget.style.background = S.indigoHover;
                }}
              >
                <Check size={16} strokeWidth={2.5} /> Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "44px",
                  padding: "0 28px",
                  borderRadius: "40px",
                  border: "none",
                  background: S.orange,
                  color: S.white,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: `0 4px 14px ${S.orange}30`,
                  animation: "pulse 1.8s ease infinite",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.04)";
                  e.currentTarget.style.background = S.orangeHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.background = S.orange;
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.96)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1.04)";
                }}
              >
                {currentProblemIdx < problems.length - 1 ? (
                  <>
                    <ChevronRight size={16} strokeWidth={2.5} /> Next Problem
                  </>
                ) : (
                  <>
                    <Award size={16} strokeWidth={2.5} /> View Results
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Instructions footer */}
        <div
          style={{
            marginTop: "16px",
            padding: "14px 20px",
            borderRadius: "16px",
            background: S.orangeLight,
            border: `1.5px solid ${S.orange}20`,
            animation: "fadeInUp 0.5s ease-out 0.45s both",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "11px",
              fontWeight: 700,
              color: S.orange,
              marginBottom: "4px",
              textTransform: "uppercase" as const,
              letterSpacing: "0.8px",
            }}
          >
            <Plus size={12} strokeWidth={3} /> How to enter
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: S.darkGrey,
              lineHeight: "1.6",
            }}
          >
            Type prime factors separated by{" "}
            <strong style={{ color: S.indigo }}>×</strong> or{" "}
            <strong style={{ color: S.indigo }}>*</strong> or{" "}
            <strong style={{ color: S.indigo }}>x</strong>. Example: for 12,
            type <strong style={{ color: S.gradientStart }}>2 × 2 × 3</strong>.
            For co-prime pairs (no common primes), HCF = 1.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HCFCoprimePracticeTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
