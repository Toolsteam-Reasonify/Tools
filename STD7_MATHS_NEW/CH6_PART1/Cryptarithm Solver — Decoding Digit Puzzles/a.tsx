// @ts-nocheck
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Check,
  X,
  Plus,
} from "lucide-react";

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
  type: "intro" | "explanation" | "practice";
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface CryptarithmPuzzle {
  operands: string[];
  operator: "+";
  result: string;
  solution: { [letter: string]: number };
  carries?: { [col: number]: number };
}

interface CryptarithmAdditionalProps {
  puzzles?: CryptarithmPuzzle[];
  showHints?: boolean;
  animationSpeed?: "slow" | "normal" | "fast";
}

interface CryptarithmSolverProps {
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
    additionalProps?: CryptarithmAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ══════════════════════════════════════════════════════════
// SINGULARITY DESIGN SYSTEM TOKENS
// ══════════════════════════════════════════════════════════

const DS = {
  indigo: "#4A4DC9",
  indigoHover: "#3b3eb5",
  indigoPressed: "#32349e",
  orange: "#FF7212",
  orangeHover: "#e8660f",
  gradientStart: "#533086",
  gradientEnd: "#FC9145",
  lavender: "#C1C1EA",
  lavenderLight: "#E8E8F6",
  lavenderBg: "#F0F0FA",
  peach: "#FFF3E4",
  peachMed: "#FFE4C8",
  grey900: "#1A1A2E",
  grey700: "#4E4E4E",
  grey400: "#CACACA",
  grey200: "#EBEBEB",
  grey100: "#F5F5F5",
  white: "#FFFFFF",
  success: "#2ECC71",
  successLight: "#E8F8F0",
  successBg: "#D5F5E3",
  error: "#E74C3C",
  errorLight: "#FDEDEC",
  errorBg: "#FADBD8",
  warning: "#F39C12",
  warningLight: "#FEF9E7",
  warningBg: "#FDEBD0",
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 9999,
  font: "'Poppins', sans-serif",
};

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "🕵️ Welcome, Detective!",
    description:
      "In cryptarithms, each letter hides a secret digit (0–9). Your mission: crack the code! Let's start with a simple puzzle.",
    type: "intro",
    mode: "learn",
    data: {
      puzzle: {
        operands: ["T", "T", "T"],
        operator: "+",
        result: "UT",
        solution: { T: 5, U: 1 },
      },
      phase: "intro",
    },
  },
  {
    id: 2,
    title: "Understanding the Puzzle",
    description:
      "T + T + T = UT means: a single digit, added to itself 3 times, gives a 2-digit number. The units digit of the answer is the same as T!",
    type: "explanation",
    mode: "learn",
    data: {
      puzzle: {
        operands: ["T", "T", "T"],
        operator: "+",
        result: "UT",
        solution: { T: 5, U: 1 },
      },
      phase: "understand",
    },
  },
  {
    id: 3,
    title: "Testing Digits for T",
    description:
      "Let's test EVERY digit 0–9 for T. We need 3×T to be a 2-digit number ending in T. Watch as we eliminate wrong options!",
    type: "explanation",
    mode: "learn",
    data: {
      puzzle: {
        operands: ["T", "T", "T"],
        operator: "+",
        result: "UT",
        solution: { T: 5, U: 1 },
      },
      phase: "test_digits",
      testLetter: "T",
      tests: [
        {
          digit: 0,
          result: "3×0 = 0",
          valid: false,
          reason: "Single digit, not 2-digit",
        },
        {
          digit: 1,
          result: "3×1 = 3",
          valid: false,
          reason: "Single digit, not 2-digit",
        },
        {
          digit: 2,
          result: "3×2 = 6",
          valid: false,
          reason: "Single digit, not 2-digit",
        },
        {
          digit: 3,
          result: "3×3 = 9",
          valid: false,
          reason: "Single digit, not 2-digit",
        },
        {
          digit: 4,
          result: "3×4 = 12",
          valid: false,
          reason: "12 ends in 2, not 4",
        },
        {
          digit: 5,
          result: "3×5 = 15",
          valid: true,
          reason: "15 ends in 5 = T ✓",
        },
        {
          digit: 6,
          result: "3×6 = 18",
          valid: false,
          reason: "18 ends in 8, not 6",
        },
        {
          digit: 7,
          result: "3×7 = 21",
          valid: false,
          reason: "21 ends in 1, not 7",
        },
        {
          digit: 8,
          result: "3×8 = 24",
          valid: false,
          reason: "24 ends in 4, not 8",
        },
        {
          digit: 9,
          result: "3×9 = 27",
          valid: false,
          reason: "27 ends in 7, not 9",
        },
      ],
    },
  },
  {
    id: 4,
    title: "🎉 Puzzle 1 Solved!",
    description:
      "T = 5, U = 1. So 5 + 5 + 5 = 15. The code is cracked! Now let's tackle a harder puzzle with carries.",
    type: "explanation",
    mode: "learn",
    data: {
      puzzle: {
        operands: ["T", "T", "T"],
        operator: "+",
        result: "UT",
        solution: { T: 5, U: 1 },
      },
      phase: "solved",
    },
  },
  {
    id: 5,
    title: "Puzzle 2: K2 + K2 = HMM",
    description:
      "A 2-digit number added to itself gives a 3-digit number where the tens and units digits are the same! Let's work column by column, right to left.",
    type: "explanation",
    mode: "learn",
    data: {
      puzzle: {
        operands: ["K2", "K2"],
        operator: "+",
        result: "HMM",
        solution: { K: 6, H: 1, M: 2 },
        carries: { 0: 0, 1: 1 },
      },
      phase: "intro2",
    },
  },
  {
    id: 6,
    title: "Column 1: Units Place (2 + 2)",
    description:
      "Start from the rightmost column. 2 + 2 = 4. But the result has M in both units and tens place, so M = 4. Wait — is there a carry? 4 < 10, so no carry!",
    type: "explanation",
    mode: "learn",
    data: {
      puzzle: {
        operands: ["K2", "K2"],
        operator: "+",
        result: "HMM",
        solution: { K: 6, H: 1, M: 4 },
        carries: { 0: 0 },
      },
      phase: "column_units",
      activeColumn: 0,
      finding: "M = 4 (units digit of 2+2)",
      carry: 0,
    },
  },
  {
    id: 7,
    title: "Column 2: Tens Place (K + K + carry)",
    description:
      "K + K + 0 (carry) = ?M where M = 4. So 2K must end in 4. Also, the tens digit of the result is M = 4. Testing digits for K...",
    type: "explanation",
    mode: "learn",
    data: {
      puzzle: {
        operands: ["K2", "K2"],
        operator: "+",
        result: "HMM",
        solution: { K: 7, H: 1, M: 4 },
        carries: { 0: 0 },
      },
      phase: "column_tens",
      activeColumn: 1,
      testLetter: "K",
      carry: 0,
      tests: [
        {
          digit: 2,
          result: "2×2 = 4",
          valid: true,
          reason: "Ends in 4 ✓ but H=0 (leading zero!)",
        },
        {
          digit: 7,
          result: "2×7 = 14",
          valid: true,
          reason: "Ends in 4 ✓, carry 1, H=1 ✓",
        },
      ],
    },
  },
  {
    id: 8,
    title: "⚠️ The Leading Zero Trap!",
    description:
      "K=2 gives 22+22=44, but that's only 2 digits — H would be 0, and numbers don't start with 0! So K=7: 72+72=144. H=1, M=4. K=7 gives HMM=144 ✓",
    type: "explanation",
    mode: "learn",
    data: {
      puzzle: {
        operands: ["K2", "K2"],
        operator: "+",
        result: "HMM",
        solution: { K: 7, H: 1, M: 4 },
        carries: { 0: 0, 1: 1 },
      },
      phase: "leading_zero",
    },
  },
  {
    id: 9,
    title: "🎉 Puzzle 2 Solved!",
    description:
      "K = 7, M = 4, H = 1. So 72 + 72 = 144 (HMM). Great detective work! Now try the practice puzzles on your own!",
    type: "explanation",
    mode: "learn",
    data: {
      puzzle: {
        operands: ["K2", "K2"],
        operator: "+",
        result: "HMM",
        solution: { K: 7, H: 1, M: 4 },
      },
      phase: "solved2",
    },
  },
  {
    id: 10,
    title: "Practice: YY + Z = ZOO",
    description:
      "Try solving this one! A 2-digit number with repeated digits plus a single digit gives a 3-digit number. Think column by column!",
    type: "practice",
    mode: "practice",
    data: {
      puzzle: {
        operands: ["YY", "Z"],
        operator: "+",
        result: "ZOO",
        solution: { Y: 9, Z: 1, O: 0 },
      },
      hint: "Y + Z must give a number ending in O. The units and tens of the result are the same (OO). Try Y=9...",
    },
  },
  {
    id: 11,
    title: "Practice: B5 + 3D = ED5",
    description:
      "Two 2-digit numbers add up to a 3-digit number. The units digit of the result is 5. Start from the right!",
    type: "practice",
    mode: "practice",
    data: {
      puzzle: {
        operands: ["B5", "3D"],
        operator: "+",
        result: "ED5",
        solution: { B: 7, D: 0, E: 1 },
      },
      hint: "5 + D must end in 5. What value of D makes that work? Then move to the tens column...",
    },
  },
  {
    id: 12,
    title: "Practice: KP + KP = PRR",
    description:
      "A number added to itself! The result has the same digit in units and tens. Use what you learned about carries!",
    type: "practice",
    mode: "practice",
    data: {
      puzzle: {
        operands: ["KP", "KP"],
        operator: "+",
        result: "PRR",
        solution: { K: 6, P: 1, R: 2 },
      },
      hint: "2×P must give a 2-digit number starting with P. Also R appears twice. Try P values systematically!",
    },
  },
  {
    id: 13,
    title: "Practice: C1 + C = 1FF",
    description:
      "A 2-digit number plus a 1-digit number gives a 3-digit number with repeated digits. The detective skills are all yours!",
    type: "practice",
    mode: "practice",
    data: {
      puzzle: {
        operands: ["C1", "C"],
        operator: "+",
        result: "1FF",
        solution: { C: 9, F: 0 },
      },
      hint: "1 + C must end in F. And C1 + C = 1FF means the result is between 100 and 199. What is C?",
    },
  },
];

// ==================== MAIN COMPONENT ====================

const CryptarithmSolverTool: React.FC<CryptarithmSolverProps> = ({
  props = {} as CryptarithmSolverProps["props"],
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
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
      themeColor: props.themeColor ?? DS.indigo,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const [selectedMode, setSelectedMode] = useState<ModeType>(
    config.initialMode,
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [testRevealCount, setTestRevealCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [practiceInput, setPracticeInput] = useState<{ [key: string]: string }>(
    {},
  );
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [practiceCorrect, setPracticeCorrect] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const allSteps = props.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(
    () =>
      config.filterSteps?.length
        ? allSteps.filter((s) => config.filterSteps!.includes(s.id))
        : allSteps,
    [allSteps, config.filterSteps],
  );
  const filteredSteps = useMemo(
    () => availableSteps.filter((s) => s.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const currentStep = filteredSteps[currentStepIndex] || filteredSteps[0];

  useEffect(() => {
    const kf = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
      @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      @keyframes fadeInScale { from { opacity:0; transform:scale(0.88); } to { opacity:1; transform:scale(1); } }
      @keyframes popIn { 0% { transform:scale(0); opacity:0; } 60% { transform:scale(1.12); } 100% { transform:scale(1); opacity:1; } }
      @keyframes glowIndigo { 0%,100% { box-shadow:0 0 6px rgba(74,77,201,0.2); } 50% { box-shadow:0 0 20px rgba(74,77,201,0.45),0 0 40px rgba(74,77,201,0.2); } }
      @keyframes glowOrange { 0%,100% { box-shadow:0 0 6px rgba(255,114,18,0.2); } 50% { box-shadow:0 0 18px rgba(255,114,18,0.45),0 0 36px rgba(255,114,18,0.2); } }
      @keyframes slideInLeft { from { opacity:0; transform:translateX(-24px); } to { opacity:1; transform:translateX(0); } }
      @keyframes slideInRight { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
      @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
      @keyframes shake { 0%,100% { transform:translateX(0); } 20% { transform:translateX(-5px); } 40% { transform:translateX(5px); } 60% { transform:translateX(-3px); } 80% { transform:translateX(3px); } }
      @keyframes carryBounce { 0% { transform:translateY(8px) scale(0); opacity:0; } 60% { transform:translateY(-3px) scale(1.15); opacity:1; } 100% { transform:translateY(0) scale(1); opacity:1; } }
      @keyframes digitReveal { 0% { transform:rotateY(90deg); opacity:0; } 50% { transform:rotateY(-8deg); opacity:1; } 100% { transform:rotateY(0deg); opacity:1; } }
      @keyframes gradientShift { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
    `;
    const el = document.createElement("style");
    el.id = "crypt-ds-kf";
    el.textContent = kf;
    document.head.appendChild(el);
    return () => {
      const ex = document.getElementById("crypt-ds-kf");
      if (ex) document.head.removeChild(ex);
    };
  }, []);

  const goToStep = useCallback(
    (dir: "next" | "prev") => {
      setAnimKey((k) => k + 1);
      setTestRevealCount(0);
      setShowHint(false);
      setPracticeInput({});
      setPracticeChecked(false);
      setPracticeCorrect(false);
      setCurrentStepIndex((prev) =>
        dir === "next"
          ? Math.min(prev + 1, filteredSteps.length - 1)
          : Math.max(prev - 1, 0),
      );
    },
    [filteredSteps.length],
  );

  useEffect(() => {
    if (
      currentStep?.data?.phase === "test_digits" &&
      currentStep?.data?.tests
    ) {
      setTestRevealCount(0);
      let c = 0;
      const total = currentStep.data.tests.length;
      const iv = setInterval(() => {
        c++;
        setTestRevealCount(c);
        if (c >= total) clearInterval(iv);
      }, 550 / config.animationSpeed);
      return () => clearInterval(iv);
    }
  }, [currentStepIndex, currentStep?.data?.phase, config.animationSpeed]);

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

  useEffect(() => {
    if (!isPlaying || config.autoPlayDuration <= 0) return;
    const t = setTimeout(() => {
      if (currentStepIndex < filteredSteps.length - 1) goToStep("next");
      else setIsPlaying(false);
    }, config.autoPlayDuration);
    return () => clearTimeout(t);
  }, [
    isPlaying,
    currentStepIndex,
    config.autoPlayDuration,
    filteredSteps.length,
    goToStep,
  ]);

  const checkAnswer = useCallback(() => {
    if (!currentStep?.data?.puzzle?.solution) return;
    const sol = currentStep.data.puzzle.solution;
    let ok = true;
    for (const [l, d] of Object.entries(sol)) {
      if (practiceInput[l] !== String(d)) {
        ok = false;
        break;
      }
    }
    setPracticeChecked(true);
    setPracticeCorrect(ok);
  }, [currentStep, practiceInput]);

  // ── RENDER PUZZLE ──
  const renderPuzzle = useCallback(
    (puzzle: any, phase: string, activeCol?: number) => {
      if (!puzzle) return null;
      const ops: string[] = puzzle.operands || [];
      const res: string = puzzle.result || "";
      const sol: { [k: string]: number } = puzzle.solution || {};
      const isSolved = phase === "solved" || phase === "solved2";
      const maxLen = Math.max(...ops.map((o: string) => o.length), res.length);
      const pad = (s: string) => s.padStart(maxLen, " ");

      const renderChar = (ch: string, colR: number, row: number) => {
        const isL = /[A-Z]/.test(ch);
        const d = sol[ch];
        const isAct = activeCol !== undefined && colR === activeCol;
        const showD = isSolved && isL && d !== undefined;
        return (
          <div
            key={`${row}-${colR}`}
            style={{
              width: 52,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: DS.font,
              fontSize: isL ? 26 : 24,
              fontWeight: isL ? 800 : 700,
              color: showD ? DS.indigo : isL ? DS.grey900 : DS.grey700,
              background: isAct
                ? DS.peach
                : showD
                  ? DS.lavenderBg
                  : ch === " "
                    ? "transparent"
                    : DS.white,
              borderRadius: DS.radiusMd,
              border: isAct
                ? `2.5px solid ${DS.orange}`
                : showD
                  ? `2.5px solid ${DS.indigo}`
                  : `1.5px solid ${DS.grey200}`,
              margin: 3,
              transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
              position: "relative",
              animation: isAct
                ? "glowOrange 1.6s ease-in-out infinite"
                : showD
                  ? "digitReveal 0.5s ease-out"
                  : "none",
              boxShadow: showD
                ? "0 2px 12px rgba(74,77,201,0.15)"
                : isAct
                  ? "0 2px 12px rgba(255,114,18,0.2)"
                  : "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            {showD ? d : ch === " " ? "" : ch}
            {showD && (
              <span
                style={{
                  position: "absolute",
                  top: -9,
                  right: -8,
                  fontSize: 10,
                  fontFamily: DS.font,
                  fontWeight: 700,
                  background: `linear-gradient(135deg,${DS.gradientStart},${DS.gradientEnd})`,
                  color: DS.white,
                  borderRadius: DS.radiusSm,
                  padding: "1px 6px",
                  lineHeight: "16px",
                }}
              >
                {ch}
              </span>
            )}
          </div>
        );
      };

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            animation: "fadeInScale 0.45s ease-out",
          }}
        >
          {ops.map((op: string, ri: number) => {
            const padded = pad(op);
            const chars = padded.split("");
            return (
              <div
                key={ri}
                style={{ display: "flex", alignItems: "center", gap: 0 }}
              >
                <div
                  style={{
                    width: 38,
                    textAlign: "center",
                    fontFamily: DS.font,
                    fontSize: 24,
                    fontWeight: 700,
                    color: ri === ops.length - 1 ? DS.grey700 : "transparent",
                  }}
                >
                  {ri === ops.length - 1 ? "+" : ""}
                </div>
                {chars.map((ch, ci) =>
                  renderChar(ch, chars.length - 1 - ci, ri),
                )}
              </div>
            );
          })}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 38 }} />
            <div
              style={{
                width: maxLen * 58,
                height: 3,
                background: `linear-gradient(90deg,${DS.gradientStart},${DS.gradientEnd})`,
                borderRadius: 2,
                margin: "6px 0",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 38 }} />
            {pad(res)
              .split("")
              .map((ch, ci, a) =>
                renderChar(ch, a.length - 1 - ci, ops.length),
              )}
          </div>
        </div>
      );
    },
    [],
  );

  // ── RENDER DECODER ──
  const renderDecoder = useCallback(
    (sol: { [k: string]: number }, revealed: string[]) => (
      <div
        style={{
          background: DS.white,
          borderRadius: DS.radiusLg,
          padding: "18px 22px",
          border: `1.5px solid ${DS.grey200}`,
          minWidth: 150,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            fontFamily: DS.font,
            fontSize: 11,
            fontWeight: 700,
            color: DS.grey700,
            textTransform: "uppercase",
            letterSpacing: 2,
            marginBottom: 14,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 20,
              height: 20,
              borderRadius: DS.radiusFull,
              background: `linear-gradient(135deg,${DS.gradientStart},${DS.gradientEnd})`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              color: DS.white,
            }}
          >
            🔑
          </span>
          Decoder
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.keys(sol).map((l, i) => {
            const r = revealed.includes(l);
            return (
              <div
                key={l}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  animation: r
                    ? `slideInRight 0.35s ease-out ${i * 0.08}s both`
                    : "none",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: DS.radiusSm,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: DS.font,
                    fontSize: 18,
                    fontWeight: 800,
                    color: DS.grey900,
                    background: DS.grey100,
                    border: `1.5px solid ${DS.grey200}`,
                  }}
                >
                  {l}
                </div>
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 16 12"
                  style={{ flexShrink: 0 }}
                >
                  <path
                    d="M0 6h12M10 2l4 4-4 4"
                    fill="none"
                    stroke={DS.grey400}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: DS.radiusSm,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: DS.font,
                    fontSize: 18,
                    fontWeight: 800,
                    color: r ? DS.white : DS.grey400,
                    background: r
                      ? `linear-gradient(135deg,${DS.gradientStart},${DS.gradientEnd})`
                      : DS.grey100,
                    border: r ? "none" : `1.5px dashed ${DS.grey400}`,
                    transition: "all 0.35s ease",
                    animation: r ? "glowIndigo 2s ease-in-out 1" : "none",
                    boxShadow: r ? "0 3px 12px rgba(83,48,134,0.3)" : "none",
                  }}
                >
                  {r ? sol[l] : "?"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ),
    [],
  );

  // ── RENDER DIGIT TESTS ──
  const renderTests = useCallback(
    (tests: any[], count: number) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
          maxHeight: 310,
          overflowY: "auto",
          paddingRight: 6,
        }}
      >
        {tests.map((t: any, i: number) => {
          const rev = i < count;
          const v = t.valid;
          return (
            <div
              key={t.digit}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "7px 12px",
                borderRadius: DS.radiusMd,
                background: !rev
                  ? DS.grey100
                  : v
                    ? DS.successLight
                    : DS.errorLight,
                border: !rev
                  ? `1.5px solid ${DS.grey200}`
                  : v
                    ? `2px solid ${DS.success}`
                    : `1.5px solid ${DS.errorBg}`,
                opacity: rev ? 1 : 0.25,
                animation: rev ? "slideInLeft 0.28s ease-out" : "none",
                transition: "all 0.28s ease",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: DS.radiusFull,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: DS.font,
                  fontSize: 14,
                  fontWeight: 700,
                  background: !rev ? DS.grey400 : v ? DS.success : DS.error,
                  color: DS.white,
                  flexShrink: 0,
                }}
              >
                {t.digit}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: DS.font,
                    fontSize: 12,
                    color: DS.grey900,
                    fontWeight: 600,
                    textDecoration: rev && !v ? "line-through" : "none",
                    textDecorationColor: DS.error,
                    textDecorationThickness: "2px",
                  }}
                >
                  {t.result}
                </div>
                {rev && (
                  <div
                    style={{
                      fontFamily: DS.font,
                      fontSize: 10,
                      color: v ? DS.success : DS.error,
                      fontWeight: 600,
                      marginTop: 1,
                    }}
                  >
                    {t.reason}
                  </div>
                )}
              </div>
              {rev && (
                <div style={{ animation: "popIn 0.25s ease-out" }}>
                  {v ? (
                    <Check size={16} color={DS.success} strokeWidth={3} />
                  ) : (
                    <X size={16} color={DS.error} strokeWidth={3} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    ),
    [],
  );

  // ── RENDER PRACTICE ──
  const renderPractice = useCallback(
    (puzzle: any) => {
      if (!puzzle?.solution) return null;
      const letters = Object.keys(puzzle.solution);
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              justifyContent: "center",
            }}
          >
            {letters.map((l) => {
              const ok =
                practiceChecked &&
                practiceInput[l] === String(puzzle.solution[l]);
              const bad =
                practiceChecked &&
                practiceInput[l] !== String(puzzle.solution[l]);
              return (
                <div
                  key={l}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <div
                    style={{
                      fontFamily: DS.font,
                      fontSize: 20,
                      fontWeight: 800,
                      color: DS.grey900,
                    }}
                  >
                    {l}
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={9}
                    value={practiceInput[l] || ""}
                    onChange={(e) => {
                      setPracticeInput((p) => ({
                        ...p,
                        [l]: e.target.value.slice(-1),
                      }));
                      setPracticeChecked(false);
                    }}
                    style={{
                      width: 52,
                      height: 52,
                      textAlign: "center",
                      fontSize: 22,
                      fontFamily: DS.font,
                      fontWeight: 700,
                      borderRadius: DS.radiusMd,
                      border: ok
                        ? `2.5px solid ${DS.success}`
                        : bad
                          ? `2.5px solid ${DS.error}`
                          : `2px solid ${DS.grey200}`,
                      outline: "none",
                      background: ok
                        ? DS.successLight
                        : bad
                          ? DS.errorLight
                          : DS.white,
                      transition: "all 0.3s ease",
                      color: DS.grey900,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={checkAnswer}
              onMouseEnter={() => setHoveredButton("check")}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                height: 40,
                padding: "0 24px",
                borderRadius: DS.radiusFull,
                border: "none",
                cursor: "pointer",
                fontFamily: DS.font,
                fontSize: 14,
                fontWeight: 600,
                background:
                  hoveredButton === "check" ? DS.indigoHover : DS.indigo,
                color: DS.white,
                transition: "all 0.2s ease",
                transform:
                  hoveredButton === "check" ? "scale(1.03)" : "scale(1)",
                boxShadow:
                  hoveredButton === "check"
                    ? "0 6px 20px rgba(74,77,201,0.35)"
                    : "0 2px 8px rgba(74,77,201,0.2)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Check size={15} /> Check Answer
            </button>
            <button
              onClick={() => setShowHint(!showHint)}
              onMouseEnter={() => setHoveredButton("hint")}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                height: 40,
                padding: "0 24px",
                borderRadius: DS.radiusFull,
                border: `2px solid ${showHint ? DS.orange : DS.grey400}`,
                cursor: "pointer",
                fontFamily: DS.font,
                fontSize: 14,
                fontWeight: 600,
                background: showHint ? DS.peach : DS.white,
                color: showHint ? DS.orange : DS.grey700,
                transition: "all 0.2s ease",
                transform:
                  hoveredButton === "hint" ? "scale(1.03)" : "scale(1)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              💡 Hint
            </button>
          </div>
          {practiceChecked && (
            <div
              style={{
                padding: "10px 24px",
                borderRadius: DS.radiusFull,
                fontFamily: DS.font,
                fontSize: 14,
                fontWeight: 600,
                animation: practiceCorrect
                  ? "bounce 0.5s ease"
                  : "shake 0.4s ease",
                background: practiceCorrect
                  ? `linear-gradient(135deg,${DS.gradientStart},${DS.gradientEnd})`
                  : DS.errorLight,
                color: practiceCorrect ? DS.white : DS.error,
                border: practiceCorrect ? "none" : `2px solid ${DS.error}`,
                boxShadow: practiceCorrect
                  ? "0 4px 16px rgba(83,48,134,0.3)"
                  : "none",
              }}
            >
              {practiceCorrect
                ? "🎉 Correct! Great detective work!"
                : "❌ Not quite — try again!"}
            </div>
          )}
          {showHint && currentStep?.data?.hint && (
            <div
              style={{
                padding: "12px 20px",
                borderRadius: DS.radiusMd,
                background: DS.peach,
                border: `1.5px solid ${DS.peachMed}`,
                fontFamily: DS.font,
                fontSize: 13,
                color: DS.grey900,
                maxWidth: 420,
                textAlign: "center",
                animation: "fadeInUp 0.3s ease-out",
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              💡 {currentStep.data.hint}
            </div>
          )}
        </div>
      );
    },
    [
      practiceInput,
      practiceChecked,
      practiceCorrect,
      showHint,
      hoveredButton,
      checkAnswer,
      currentStep,
    ],
  );

  const getRevealed = useCallback(() => {
    if (!currentStep?.data) return [];
    const p = currentStep.data.phase;
    const pz = currentStep.data.puzzle;
    if (!pz?.solution) return [];
    switch (p) {
      case "solved":
      case "solved2":
        return Object.keys(pz.solution);
      case "column_units":
        return ["M"];
      case "column_tens":
        return ["M"];
      case "leading_zero":
        return ["M", "K"];
      default:
        return [];
    }
  }, [currentStep]);

  const renderContent = useCallback(() => {
    if (!currentStep?.data) return null;
    const { phase, puzzle, activeColumn, tests } = currentStep.data;
    const rev = getRevealed();
    if (currentStep.type === "practice")
      return (
        <div
          key={animKey}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            animation: "fadeInUp 0.45s ease-out",
          }}
        >
          {renderPuzzle(puzzle, "practice")}
          {renderPractice(puzzle)}
        </div>
      );
    return (
      <div
        key={animKey}
        style={{
          display: "flex",
          gap: 28,
          alignItems: "flex-start",
          justifyContent: "center",
          flexWrap: "wrap",
          animation: "fadeInUp 0.45s ease-out",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          {renderPuzzle(puzzle, phase, activeColumn)}
          {currentStep.data.carry !== undefined && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 16px",
                borderRadius: DS.radiusFull,
                background: currentStep.data.carry > 0 ? DS.peach : DS.grey100,
                border: `1.5px solid ${currentStep.data.carry > 0 ? DS.peachMed : DS.grey200}`,
                fontFamily: DS.font,
                fontSize: 12,
                fontWeight: 600,
                color: currentStep.data.carry > 0 ? DS.orange : DS.grey700,
                animation: "carryBounce 0.45s ease-out",
              }}
            >
              Carry:{" "}
              <span style={{ fontWeight: 800, fontSize: 15 }}>
                {currentStep.data.carry}
              </span>
            </div>
          )}
          {currentStep.data.finding && (
            <div
              style={{
                padding: "10px 20px",
                borderRadius: DS.radiusMd,
                background: DS.lavenderBg,
                border: `2px solid ${DS.lavender}`,
                fontFamily: DS.font,
                fontSize: 14,
                fontWeight: 700,
                color: DS.indigo,
                animation: "popIn 0.45s ease-out 0.25s both",
                boxShadow: "0 2px 10px rgba(74,77,201,0.12)",
              }}
            >
              ✅ {currentStep.data.finding}
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {tests && renderTests(tests, testRevealCount)}
          {puzzle?.solution && renderDecoder(puzzle.solution, rev)}
        </div>
      </div>
    );
  }, [
    currentStep,
    animKey,
    testRevealCount,
    getRevealed,
    renderPuzzle,
    renderDecoder,
    renderTests,
    renderPractice,
  ]);

  const modeInfo: { [k: string]: { icon: string; label: string } } = {
    learn: { icon: "🔍", label: "Guided Solve" },
    practice: { icon: "✏️", label: "Practice" },
  };
  const W = Math.min(config.width, 820);

  return (
    <div
      style={{
        width: W,
        maxWidth: "100%",
        minHeight: config.height,
        background: DS.white,
        borderRadius: DS.radiusXl,
        overflow: "hidden",
        fontFamily: DS.font,
        boxShadow:
          "0 4px 32px rgba(26,26,46,0.08),0 1px 4px rgba(26,26,46,0.04)",
        border: `1px solid ${DS.grey200}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "20px 28px 16px",
          background: `linear-gradient(135deg,${DS.gradientStart} 0%,${DS.gradientEnd} 100%)`,
          backgroundSize: "200% 200%",
          animation: "gradientShift 8s ease infinite",
          color: DS.white,
          display: "flex",
          alignItems: "center",
          gap: 14,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -20,
            right: 40,
            width: 80,
            height: 80,
            borderRadius: DS.radiusFull,
            border: "2px solid rgba(255,255,255,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -12,
            right: 120,
            width: 50,
            height: 50,
            border: "2px solid rgba(255,255,255,0.08)",
            transform: "rotate(45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 200,
            width: 0,
            height: 0,
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderBottom: "24px solid rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: DS.radiusMd,
            background: "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            animation: "bounce 2.5s ease infinite",
            flexShrink: 0,
          }}
        >
          🕵️
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.3 }}>
            Digits in Disguise
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 500 }}>
            Crack the Code • Cryptarithm Solver
          </div>
        </div>
        <div style={{ flex: 1 }} />
        {config.showStepIndicator && (
          <div
            style={{
              background: "rgba(255,255,255,0.18)",
              borderRadius: DS.radiusFull,
              padding: "5px 14px",
              fontSize: 13,
              fontWeight: 700,
              position: "relative",
              zIndex: 1,
            }}
          >
            {currentStepIndex + 1} / {filteredSteps.length}
          </div>
        )}
      </div>

      {/* MODE TABS */}
      {config.showModeSelector && (
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: "10px 28px",
            background: DS.grey100,
            borderBottom: `1px solid ${DS.grey200}`,
          }}
        >
          {config.enabledModes.map((mode) => {
            const inf = modeInfo[mode] || { icon: "📄", label: mode };
            const act = selectedMode === mode;
            return (
              <button
                key={mode}
                onClick={() => {
                  setSelectedMode(mode);
                  setCurrentStepIndex(0);
                  setAnimKey((k) => k + 1);
                  setTestRevealCount(0);
                  setShowHint(false);
                  setPracticeInput({});
                  setPracticeChecked(false);
                }}
                onMouseEnter={() => setHoveredButton(`m-${mode}`)}
                onMouseLeave={() => setHoveredButton(null)}
                style={{
                  height: 36,
                  padding: "0 20px",
                  borderRadius: DS.radiusFull,
                  border: act
                    ? `2px solid ${DS.indigo}`
                    : "1.5px solid transparent",
                  cursor: "pointer",
                  fontFamily: DS.font,
                  fontSize: 13,
                  fontWeight: act ? 700 : 500,
                  background: act ? DS.lavenderBg : "transparent",
                  color: act ? DS.indigo : DS.grey700,
                  transition: "all 0.25s ease",
                  transform:
                    hoveredButton === `m-${mode}` && !act
                      ? "translateY(-1px)"
                      : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {inf.icon} {inf.label}
              </button>
            );
          })}
        </div>
      )}

      {/* TITLE */}
      <div style={{ padding: "18px 28px 8px" }} key={`t-${animKey}`}>
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: DS.grey900,
            fontFamily: DS.font,
            animation: "fadeInUp 0.35s ease-out",
            lineHeight: 1.3,
          }}
        >
          {currentStep?.title}
        </h2>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 13,
            color: DS.grey700,
            lineHeight: 1.65,
            fontWeight: 400,
            animation: "fadeInUp 0.35s ease-out 0.08s both",
          }}
        >
          {currentStep?.description}
        </p>
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          padding: "14px 28px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          overflowY: "auto",
        }}
      >
        {renderContent()}
      </div>

      {/* PROGRESS */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 5,
          padding: "6px 0 2px",
        }}
      >
        {filteredSteps.map((_, i) => (
          <div
            key={i}
            onClick={() => {
              setCurrentStepIndex(i);
              setAnimKey((k) => k + 1);
              setTestRevealCount(0);
              setShowHint(false);
              setPracticeInput({});
              setPracticeChecked(false);
            }}
            style={{
              width: i === currentStepIndex ? 28 : 8,
              height: 8,
              borderRadius: DS.radiusFull,
              background:
                i === currentStepIndex
                  ? `linear-gradient(90deg,${DS.gradientStart},${DS.gradientEnd})`
                  : DS.grey200,
              cursor: "pointer",
              transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        ))}
      </div>

      {/* NAVIGATION */}
      {config.showNavigation && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 28px 20px",
          }}
        >
          <button
            onClick={() => goToStep("prev")}
            disabled={currentStepIndex === 0}
            onMouseEnter={() => setHoveredButton("prev")}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              height: 40,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 24px",
              borderRadius: DS.radiusFull,
              border: `2px solid ${currentStepIndex === 0 ? DS.grey200 : DS.indigo}`,
              cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",
              fontFamily: DS.font,
              fontSize: 14,
              fontWeight: 600,
              background: DS.white,
              color: currentStepIndex === 0 ? DS.grey400 : DS.indigo,
              transition: "all 0.2s ease",
              transform:
                hoveredButton === "prev" && currentStepIndex > 0
                  ? "scale(1.03)"
                  : "scale(1)",
              opacity: currentStepIndex === 0 ? 0.5 : 1,
            }}
          >
            <ChevronLeft size={17} /> Previous
          </button>
          {config.showPlayPause && config.autoPlayDuration > 0 && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                width: 40,
                height: 40,
                borderRadius: DS.radiusFull,
                border: `2px solid ${DS.indigo}`,
                cursor: "pointer",
                background: isPlaying ? DS.indigo : DS.white,
                color: isPlaying ? DS.white : DS.indigo,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.25s ease",
              }}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
          )}
          <button
            onClick={() => goToStep("next")}
            disabled={currentStepIndex === filteredSteps.length - 1}
            onMouseEnter={() => setHoveredButton("next")}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              height: 40,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 24px",
              borderRadius: DS.radiusFull,
              border: "none",
              cursor:
                currentStepIndex === filteredSteps.length - 1
                  ? "not-allowed"
                  : "pointer",
              fontFamily: DS.font,
              fontSize: 14,
              fontWeight: 600,
              background:
                currentStepIndex === filteredSteps.length - 1
                  ? DS.grey200
                  : hoveredButton === "next"
                    ? DS.orangeHover
                    : DS.orange,
              color: DS.white,
              transition: "all 0.2s ease",
              transform:
                hoveredButton === "next" &&
                currentStepIndex < filteredSteps.length - 1
                  ? "scale(1.03)"
                  : "scale(1)",
              boxShadow:
                hoveredButton === "next" &&
                currentStepIndex < filteredSteps.length - 1
                  ? "0 6px 20px rgba(255,114,18,0.35)"
                  : "0 2px 8px rgba(255,114,18,0.2)",
              opacity: currentStepIndex === filteredSteps.length - 1 ? 0.5 : 1,
            }}
          >
            Next <ChevronRight size={17} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CryptarithmSolverTool;
