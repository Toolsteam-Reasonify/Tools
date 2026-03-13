// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: equation_structure_explorer.tsx
// ═══════════════════════════════════════════════════════════════════════════

// @ts-ignore - workspace may not include react typings
import React, { useState, useEffect, useCallback, useMemo } from "react";
// @ts-ignore - workspace may not include lucide-react typings
import { BookOpen, Target, Star, ChevronLeft, ChevronRight } from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "real_world";

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
  type: "intro" | "explanation" | "practice" | "real_world";
  mode: ModeType;
  data?: any;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface EquationAdditionalProps {
  equations?: { lhs: string; rhs: string; variable?: string; label?: string }[];
  highlightParts?: string[];
  showLabels?: boolean;
  equationFontSize?: number;
  interactive?: boolean;
  showSolution?: boolean;
  solutionSteps?: string[];
}

interface EquationStructureExplorerProps {
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
    additionalProps?: EquationAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGULARITY DESIGN SYSTEM — Exact colors from the PDF
// ═══════════════════════════════════════════════════════════════════════════

const S = {
  // Primary palette
  indigo: "#4A4DC9",
  orange: "#FF7212",
  purple: "#533086",
  orangeLight: "#FC9145",
  lavender: "#C1C1EA",
  peach: "#FFF3E4",
  // Grays
  g900: "#4E4E4E",
  g600: "#8A8A8A",
  g400: "#CACACA",
  g200: "#EBEBEB",
  g100: "#F5F5F5",
  white: "#FFFFFF",
  // Semantic
  ok: "#22c55e",
  err: "#ef4444",
  // Gradients
  gradMain: "linear-gradient(135deg, #533086 0%, #FC9145 100%)",
  gradIndigo: "linear-gradient(135deg, #4A4DC9 0%, #533086 100%)",
  // Typography
  ff: "'Poppins', sans-serif",
  // Radii from PDF spec
  pill: "40px", // buttons
  card: "16px", // cards
  outer: "20px", // container
  // Shadows
  sh1: "0 4px 24px rgba(74,77,201,0.10)",
  shBtn: "0 6px 18px rgba(83,48,134,0.22)",
};

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT STEPS DATA
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_STEPS: StepDataInterface[] = [
  // ──────── LEARN MODE ────────
  {
    id: 1,
    title: "What is an Equation?",
    description:
      'An equation is a mathematical statement showing two expressions are equal using the "=" sign. Tap any coloured part below to learn its name!',
    type: "intro",
    mode: "learn",
    data: {
      equation: { lhs: "2n + 1", rhs: "99" },
      parts: [
        {
          id: "lhs",
          text: "2n + 1",
          label: "Left Hand Side (LHS)",
          desc: "The expression to the left of the equals sign",
          color: S.indigo,
        },
        {
          id: "equals",
          text: "=",
          label: "Equals Sign",
          desc: "Shows both sides have the same value",
          color: S.orange,
        },
        {
          id: "rhs",
          text: "99",
          label: "Right Hand Side (RHS)",
          desc: "The expression to the right of the equals sign",
          color: S.ok,
        },
      ],
    },
  },
  {
    id: 2,
    title: "Parts of an Equation",
    description:
      "Every equation has important parts. Tap each coloured block to discover its name. The variable is the unknown letter, the coefficient multiplies it, and the constant stands alone.",
    type: "explanation",
    mode: "learn",
    data: {
      equation: { lhs: "5x – 4", rhs: "7" },
      parts: [
        {
          id: "coeff",
          text: "5",
          label: "Coefficient",
          desc: "The number that multiplies the variable",
          color: S.purple,
        },
        {
          id: "var",
          text: "x",
          label: "Variable",
          desc: "The unknown value we want to find",
          color: S.orange,
        },
        {
          id: "op",
          text: "–",
          label: "Operator",
          desc: "Subtraction connects the terms",
          color: S.g400,
        },
        {
          id: "cL",
          text: "4",
          label: "Constant (LHS)",
          desc: "A fixed number — it does not change",
          color: "#0ea5e9",
        },
        {
          id: "eq",
          text: "=",
          label: "Equals Sign",
          desc: "LHS value equals RHS value",
          color: S.orange,
        },
        {
          id: "cR",
          text: "7",
          label: "Constant (RHS)",
          desc: "The value on the right side",
          color: S.ok,
        },
      ],
    },
  },
  {
    id: 3,
    title: "LHS & RHS — Like a Balance",
    description:
      'Think of an equation as a balanced weighing scale. LHS sits on one plate and RHS on the other. The "=" tells us both plates weigh the same!',
    type: "explanation",
    mode: "learn",
    data: {
      equation: { lhs: "3x + 4", rhs: "2x + 8" },
      parts: [
        {
          id: "lG",
          text: "3x + 4",
          label: "Left Hand Side (LHS)",
          desc: 'Everything to the left of the "=" sign',
          color: S.indigo,
        },
        {
          id: "eq",
          text: "=",
          label: "Equals Sign (Balance)",
          desc: "Like the fulcrum — both sides must balance",
          color: S.orange,
        },
        {
          id: "rG",
          text: "2x + 8",
          label: "Right Hand Side (RHS)",
          desc: 'Everything to the right of the "=" sign',
          color: S.ok,
        },
      ],
    },
  },
  {
    id: 4,
    title: "Solving = Finding the Unknown",
    description:
      "Solving an equation means finding the value of the variable that makes LHS = RHS. We perform the same operation on both sides to keep the balance!",
    type: "explanation",
    mode: "learn",
    data: {
      equation: { lhs: "2n + 1", rhs: "99" },
      solutionSteps: [
        "2n + 1 = 99",
        "2n = 99 – 1",
        "2n = 98",
        "n = 98 ÷ 2",
        "n = 49",
      ],
    },
  },
  {
    id: 5,
    title: "Equations from Ancient India",
    description:
      'Brahmagupta (628 CE) solved Ax + B = Cx + D with x = (D–B)/(A–C). Ancient mathematicians used "yā" for unknowns — just like our x and y!',
    type: "explanation",
    mode: "learn",
    data: {
      equation: { lhs: "650m + 4000", rhs: "500m + 5050" },
      parts: [
        {
          id: "lG",
          text: "650m + 4000",
          label: "Jahnavi's Savings (LHS)",
          desc: "Starting ₹4000 + ₹650 every month",
          color: S.indigo,
        },
        {
          id: "eq",
          text: "=",
          label: "Equals (Same Amount)",
          desc: "Both friends have equal savings",
          color: S.orange,
        },
        {
          id: "rG",
          text: "500m + 5050",
          label: "Sunita's Savings (RHS)",
          desc: "Starting ₹5050 + ₹500 every month",
          color: S.ok,
        },
      ],
    },
  },

  // ──────── PRACTICE MODE (MCQ) ────────
  {
    id: 10,
    title: "Identify the Variable",
    description: "Read the equation and pick the correct answer.",
    type: "practice",
    mode: "practice",
    data: {
      eq: "3x + 7 = 22",
      q: "What is the variable in this equation?",
      opts: ["3", "x", "7", "22"],
      ans: 1,
      why: "The variable is 'x' — the unknown letter whose value we need to find.",
    },
  },
  {
    id: 11,
    title: "Spot the Coefficient",
    description: "Read the equation and pick the correct answer.",
    type: "practice",
    mode: "practice",
    data: {
      eq: "5x – 4 = 7",
      q: "What is the coefficient of x?",
      opts: ["x", "4", "5", "7"],
      ans: 2,
      why: "The coefficient is 5 — the number that multiplies the variable x.",
    },
  },
  {
    id: 12,
    title: "Find the Constant",
    description: "Read the equation and pick the correct answer.",
    type: "practice",
    mode: "practice",
    data: {
      eq: "11y + (–5) = 61",
      q: "Which is the constant on the LHS?",
      opts: ["11", "y", "–5", "61"],
      ans: 2,
      why: "The constant on the LHS is –5. It is a fixed number without a variable attached.",
    },
  },
  {
    id: 13,
    title: "Identify the RHS",
    description: "Read the equation and pick the correct answer.",
    type: "practice",
    mode: "practice",
    data: {
      eq: "6y + 7 = 4y + 21",
      q: "What is the Right Hand Side (RHS)?",
      opts: ["6y + 7", "4y + 21", "21", "6y"],
      ans: 1,
      why: "The RHS is '4y + 21' — everything to the right of the '=' sign.",
    },
  },
  {
    id: 14,
    title: "Solve the Equation",
    description: "Use what you have learnt to find the answer.",
    type: "practice",
    mode: "practice",
    data: {
      eq: "2n + 1 = 99",
      q: "What is the value of n?",
      opts: ["49", "50", "48", "99"],
      ans: 0,
      why: "2n + 1 = 99 → 2n = 98 → n = 49.",
    },
  },
  {
    id: 15,
    title: "Equation or Expression?",
    description: "Think carefully about the definition!",
    type: "practice",
    mode: "practice",
    data: {
      eq: "3x + 4",
      q: 'Is "3x + 4" an equation?',
      opts: ["Yes, it is an equation", "No, it is only an expression"],
      ans: 1,
      why: "An equation must have an '=' sign. '3x + 4' has no '=' sign, so it is only an expression.",
    },
  },

  // ──────── REAL WORLD MODE ────────
  {
    id: 20,
    title: "Party Budget Equation",
    description:
      "Madhubanti orders snacks at ₹25/plate with ₹50 delivery. Budget is ₹500. How many plates?",
    type: "real_world",
    mode: "real_world",
    data: {
      equation: { lhs: "25p + 50", rhs: "500" },
      context: "party",
      parts: [
        {
          id: "c1",
          text: "25",
          label: "Cost per plate (₹)",
          desc: "Each plate costs ₹25",
          color: S.purple,
        },
        {
          id: "v1",
          text: "p",
          label: "Number of plates",
          desc: "The unknown — how many plates?",
          color: S.orange,
        },
        {
          id: "o1",
          text: "+",
          label: "Plus",
          desc: "Adds snack cost and delivery",
          color: S.g400,
        },
        {
          id: "k1",
          text: "50",
          label: "Delivery (₹)",
          desc: "Fixed ₹50 delivery fee",
          color: "#0ea5e9",
        },
        {
          id: "e1",
          text: "=",
          label: "Total equals",
          desc: "Total cost = budget",
          color: S.orange,
        },
        {
          id: "r1",
          text: "500",
          label: "Budget (₹)",
          desc: "She can spend ₹500",
          color: S.ok,
        },
      ],
    },
  },
  {
    id: 21,
    title: "Savings Equation",
    description:
      "Jahnavi: ₹4000 start + ₹650/month. Sunita: ₹5050 start + ₹500/month. When equal?",
    type: "real_world",
    mode: "real_world",
    data: {
      equation: { lhs: "4000 + 650m", rhs: "5050 + 500m" },
      context: "savings",
      parts: [
        {
          id: "l2",
          text: "4000 + 650m",
          label: "Jahnavi's Savings",
          desc: "₹4000 start + ₹650 each month",
          color: S.indigo,
        },
        {
          id: "e2",
          text: "=",
          label: "Equal Savings",
          desc: "When both totals match",
          color: S.orange,
        },
        {
          id: "r2",
          text: "5050 + 500m",
          label: "Sunita's Savings",
          desc: "₹5050 start + ₹500 each month",
          color: S.ok,
        },
      ],
    },
  },
  {
    id: 22,
    title: "Horse Price Puzzle (1150 CE)",
    description:
      "Bhāskarāchārya: Man 1 has ₹300 + 6 horses. Man 2 has 10 horses – ₹100 debt. If equally rich, find the price of one horse.",
    type: "real_world",
    mode: "real_world",
    data: {
      equation: { lhs: "300 + 6x", rhs: "10x – 100" },
      context: "history",
      parts: [
        {
          id: "l3",
          text: "300 + 6x",
          label: "First Man's Wealth",
          desc: "₹300 cash + 6 horses at price x",
          color: S.indigo,
        },
        {
          id: "e3",
          text: "=",
          label: "Equally Rich",
          desc: "Both men have the same total wealth",
          color: S.orange,
        },
        {
          id: "r3",
          text: "10x – 100",
          label: "Second Man's Wealth",
          desc: "10 horses minus ₹100 debt",
          color: S.ok,
        },
      ],
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// CSS KEYFRAME ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const KEYFRAMES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

@keyframes eqFadeUp {
  from { opacity:0; transform:translateY(20px) }
  to   { opacity:1; transform:translateY(0) }
}
@keyframes eqFadeDown {
  from { opacity:0; transform:translateY(-14px) }
  to   { opacity:1; transform:translateY(0) }
}
@keyframes eqPop {
  0%   { transform:scale(0); opacity:0 }
  70%  { transform:scale(1.1) }
  100% { transform:scale(1); opacity:1 }
}
@keyframes eqSlideR {
  from { opacity:0; transform:translateX(26px) }
  to   { opacity:1; transform:translateX(0) }
}
@keyframes eqLabel {
  0%   { opacity:0; transform:translateY(8px) scale(0.92) }
  60%  { transform:translateY(-2px) scale(1.02) }
  100% { opacity:1; transform:translateY(0) scale(1) }
}
@keyframes eqShake {
  0%,100% { transform:translateX(0) }
  20%     { transform:translateX(-5px) }
  40%     { transform:translateX(5px) }
  60%     { transform:translateX(-3px) }
  80%     { transform:translateX(3px) }
}
@keyframes eqSolve {
  from { opacity:0; transform:translateX(-8px) }
  to   { opacity:1; transform:translateX(0) }
}
@keyframes eqRock {
  0%,100% { transform:rotate(0deg) }
  25%     { transform:rotate(-1.5deg) }
  75%     { transform:rotate(1.5deg) }
}
@keyframes eqCorrect {
  0%   { transform:scale(1) }
  40%  { transform:scale(1.06) }
  100% { transform:scale(1) }
}
@keyframes eqFloat {
  0%,100% { transform:translateY(0) }
  50%     { transform:translateY(-4px) }
}
`;

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const EquationStructureExplorer: React.FC<EquationStructureExplorerProps> = ({
  props: propsIn,
  setStepDetails,
  stopAutoNext,
}) => {
  const props = (propsIn ?? {}) as NonNullable<EquationStructureExplorerProps["props"]>;
  /* ─── config with defaults ─── */
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: (props.initialMode ?? "learn") as ModeType,
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: (props.enabledModes ?? [
        "learn",
        "practice",
        "real_world",
      ]) as ModeType[],
      showNavigation: props.showNavigation ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      filterSteps: props.filterSteps ?? null,
      autoPlayDuration: props.autoPlayDuration ?? 0,
    }),
    [props],
  );

  /* ─── steps ─── */
  const allSteps = props.steps || DEFAULT_STEPS;
  const available = useMemo(
    () =>
      config.filterSteps?.length
        ? allSteps.filter((s) => config.filterSteps!.includes(s.id))
        : allSteps,
    [allSteps, config.filterSteps],
  );

  /* ─── state ─── */
  const [mode, setMode] = useState<ModeType>(config.initialMode);
  const [stepIdx, setStepIdx] = useState(0);
  const [anim, setAnim] = useState(0);
  const [selPart, setSelPart] = useState<string | null>(null);
  const [hovPart, setHovPart] = useState<string | null>(null);
  // mcq
  const [picked, setPicked] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  // solution anim
  const [solVis, setSolVis] = useState(0);

  const modeSteps = useMemo(
    () => available.filter((s) => s.mode === mode),
    [available, mode],
  );
  const step = modeSteps[stepIdx] || modeSteps[0];

  /* ─── inject keyframes once ─── */
  useEffect(() => {
    const KID = "eq-explorer-kf-v3";
    if (!document.getElementById(KID)) {
      const el = document.createElement("style");
      el.id = KID;
      el.textContent = KEYFRAMES;
      document.head.appendChild(el);
    }
    return () => {
      const e = document.getElementById(KID);
      if (e) e.remove();
    };
  }, []);

  /* ─── report to parent ─── */
  useEffect(() => {
    setStepDetails?.({
      currentStep: stepIdx,
      totalSteps: modeSteps.length,
      isPaused: true,
      currentMode: mode,
    });
  }, [stepIdx, modeSteps.length, mode]);

  /* ─── animate solution steps ─── */
  useEffect(() => {
    if (step?.data?.solutionSteps && solVis < step.data.solutionSteps.length) {
      const t = setTimeout(() => setSolVis((v) => v + 1), 1000);
      return () => clearTimeout(t);
    }
  }, [solVis, step]);

  /* ─── nav helpers ─── */
  const go = useCallback((i: number) => {
    setStepIdx(i);
    setAnim((a) => a + 1);
    setSelPart(null);
    setPicked(null);
    setSubmitted(false);
    setSolVis(0);
  }, []);

  const switchMode = useCallback((m: ModeType) => {
    setMode(m);
    setStepIdx(0);
    setAnim((a) => a + 1);
    setSelPart(null);
    setPicked(null);
    setSubmitted(false);
    setScore(0);
    setTotal(0);
    setSolVis(0);
  }, []);

  /* ─── mode meta ─── */
  const modeMeta: Record<
    ModeType,
    { label: string; icon: any; c: string; bg: string }
  > = {
    learn: {
      label: "Learn",
      icon: BookOpen,
      c: S.indigo,
      bg: S.lavender + "55",
    },
    practice: { label: "Practice", icon: Target, c: S.orange, bg: S.peach },
    real_world: {
      label: "Real World",
      icon: Star,
      c: S.purple,
      bg: S.purple + "12",
    },
  };

  // ═══════════════════════════════════════════════════════════
  //  RENDERERS
  // ═══════════════════════════════════════════════════════════

  /* ─── clickable equation parts (learn & real-world) ─── */
  const RenderEq = ({ parts }: { parts: any[] }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        flexWrap: "wrap",
        padding: "14px 0 6px",
      }}
    >
      {parts.map((p: any, i: number) => {
        const sel = selPart === p.id;
        const hov = hovPart === p.id;
        const c = p.color || S.indigo;
        return (
          <div
            key={p.id}
            onClick={() => setSelPart(sel ? null : p.id)}
            onMouseEnter={() => setHovPart(p.id)}
            onMouseLeave={() => setHovPart(null)}
            style={{
              fontFamily: S.ff,
              fontSize: 28,
              fontWeight: 700,
              padding: "10px 22px",
              borderRadius: S.pill,
              cursor: "pointer",
              color: sel ? S.white : c,
              backgroundColor: sel ? c : hov ? c + "14" : S.white,
              border: `2.5px solid ${sel ? c : hov ? c : c + "35"}`,
              transition: "all .3s cubic-bezier(.4,0,.2,1)",
              transform: sel
                ? "scale(1.08) translateY(-3px)"
                : hov
                  ? "scale(1.03)"
                  : "scale(1)",
              boxShadow: sel
                ? `0 8px 22px ${c}38`
                : hov
                  ? `0 4px 12px ${c}18`
                  : "0 2px 8px rgba(0,0,0,.04)",
              animation: `eqPop .45s ease-out ${i * 0.1}s both`,
              userSelect: "none" as const,
              minWidth: 44,
              textAlign: "center" as const,
            }}
          >
            {p.text}
          </div>
        );
      })}
    </div>
  );

  /* ─── label tooltip ─── */
  const RenderLabel = ({ parts }: { parts: any[] }) => {
    const a = parts.find((p: any) => p.id === selPart);
    if (!a)
      return (
        <div
          style={{
            textAlign: "center" as const,
            padding: 16,
            color: S.g400,
            fontFamily: S.ff,
            fontSize: 15,
            fontWeight: 600,
            animation: "eqFloat 2.5s ease-in-out infinite",
          }}
        >
          👆 Tap any part to learn about it
        </div>
      );
    return (
      <div
        style={{
          animation: "eqLabel .35s ease-out both",
          textAlign: "center" as const,
          padding: "16px 22px",
          borderRadius: S.card,
          backgroundColor: a.color + "0c",
          border: `2px solid ${a.color}25`,
          margin: "8px 0",
        }}
      >
        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: a.color,
            fontFamily: S.ff,
            marginBottom: 4,
          }}
        >
          {a.label}
        </div>
        <div
          style={{
            fontSize: 14,
            color: S.g900,
            fontFamily: S.ff,
            fontWeight: 500,
            lineHeight: 1.55,
          }}
        >
          {a.desc}
        </div>
      </div>
    );
  };

  /* ─── balance scale ─── */
  const RenderScale = () => {
    const l = step?.data?.equation?.lhs ?? "?";
    const r = step?.data?.equation?.rhs ?? "?";
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "8px 0 4px",
          animation: "eqFadeUp .5s ease-out both",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            animation: "eqRock 3.5s ease-in-out infinite",
          }}
        >
          {/* LHS plate */}
          <div
            style={{
              width: 130,
              padding: "12px 8px",
              borderRadius: "14px 14px 0 0",
              backgroundColor: S.indigo + "10",
              border: `2px solid ${S.indigo}30`,
              borderBottom: "none",
              textAlign: "center" as const,
              fontFamily: S.ff,
              fontWeight: 700,
              fontSize: 16,
              color: S.indigo,
            }}
          >
            {l}
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: S.g400,
                marginTop: 2,
              }}
            >
              LHS
            </div>
          </div>
          {/* fulcrum */}
          <div
            style={{
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: S.gradMain,
              borderRadius: "50%",
              fontFamily: S.ff,
              fontWeight: 800,
              fontSize: 18,
              color: S.white,
              zIndex: 2,
              marginBottom: -1,
              boxShadow: S.shBtn,
            }}
          >
            =
          </div>
          {/* RHS plate */}
          <div
            style={{
              width: 130,
              padding: "12px 8px",
              borderRadius: "14px 14px 0 0",
              backgroundColor: S.ok + "10",
              border: `2px solid ${S.ok}30`,
              borderBottom: "none",
              textAlign: "center" as const,
              fontFamily: S.ff,
              fontWeight: 700,
              fontSize: 16,
              color: S.ok,
            }}
          >
            {r}
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: S.g400,
                marginTop: 2,
              }}
            >
              RHS
            </div>
          </div>
        </div>
        <div
          style={{ width: 302, height: 3, background: S.g200, borderRadius: 2 }}
        />
        <div style={{ width: 3, height: 18, background: S.g200 }} />
        <div
          style={{ width: 50, height: 5, background: S.g200, borderRadius: 3 }}
        />
      </div>
    );
  };

  /* ─── solution steps (animated reveal) ─── */
  const RenderSol = ({ steps }: { steps: string[] }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "10px 0",
      }}
    >
      {steps.map((s, i) => {
        const vis = i < solVis;
        const last = i === steps.length - 1;
        return (
          <div
            key={i}
            style={{
              fontFamily: S.ff,
              fontSize: 18,
              fontWeight: 600,
              padding: "10px 16px",
              borderRadius: 12,
              backgroundColor: vis
                ? last
                  ? S.orange + "10"
                  : S.indigo + "06"
                : "transparent",
              border: vis
                ? `2px solid ${last ? S.orange + "30" : S.indigo + "20"}`
                : "2px solid transparent",
              color: vis ? S.g900 : "transparent",
              opacity: vis ? 1 : 0.12,
              transform: vis ? "translateX(0)" : "translateX(-6px)",
              transition: "all .45s ease",
              animation: vis ? "eqSolve .45s ease-out both" : "none",
            }}
          >
            {last && vis && "✨ "}
            {s}
          </div>
        );
      })}
    </div>
  );

  /* ─── MCQ practice ─── */
  const RenderMCQ = () => {
    const d = step?.data;
    if (!d) return null;
    const isRight = picked === d.ans;

    return (
      <div style={{ animation: "eqFadeUp .45s ease-out both" }}>
        {/* equation banner */}
        <div
          style={{
            textAlign: "center" as const,
            padding: "18px 22px",
            borderRadius: S.card,
            background: S.gradMain,
            marginBottom: 18,
            animation: "eqPop .4s ease-out both",
            boxShadow: S.shBtn,
          }}
        >
          <div
            style={{
              fontFamily: S.ff,
              fontSize: 28,
              fontWeight: 700,
              color: S.white,
              letterSpacing: 1,
            }}
          >
            {d.eq}
          </div>
        </div>

        {/* question */}
        <div
          style={{
            fontFamily: S.ff,
            fontSize: 16,
            fontWeight: 600,
            color: S.g900,
            marginBottom: 14,
            textAlign: "center" as const,
          }}
        >
          {d.q}
        </div>

        {/* options grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: d.opts.length <= 2 ? "1fr" : "1fr 1fr",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {d.opts.map((opt: string, i: number) => {
            const isSel = picked === i;
            const show = submitted;
            const isCorr = i === d.ans;
            let bg = S.white,
              bc = S.g200,
              tc = S.g900;
            if (show && isCorr) {
              bg = S.ok + "14";
              bc = S.ok;
              tc = "#166534";
            } else if (show && isSel && !isCorr) {
              bg = S.err + "14";
              bc = S.err;
              tc = S.err;
            } else if (isSel && !show) {
              bg = S.indigo + "0c";
              bc = S.indigo;
              tc = S.indigo;
            }

            return (
              <button
                key={i}
                onClick={() => {
                  if (!submitted) setPicked(i);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 18px",
                  borderRadius: S.card,
                  border: `2.5px solid ${bc}`,
                  backgroundColor: bg,
                  cursor: submitted ? "default" : "pointer",
                  fontFamily: S.ff,
                  fontWeight: 600,
                  fontSize: 15,
                  color: tc,
                  transition: "all .25s ease",
                  textAlign: "left" as const,
                  animation:
                    show && isSel
                      ? isCorr
                        ? "eqCorrect .4s ease both"
                        : "eqShake .4s ease both"
                      : `eqFadeUp .3s ease-out ${i * 0.07}s both`,
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                    backgroundColor: isSel
                      ? show
                        ? isCorr
                          ? S.ok
                          : S.err
                        : S.indigo
                      : S.g100,
                    color: isSel ? S.white : S.g400,
                    transition: "all .25s ease",
                  }}
                >
                  {show && isCorr
                    ? "✓"
                    : show && isSel
                      ? "✗"
                      : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* action button row */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          {!submitted ? (
            <button
              onClick={() => {
                if (picked === null) return;
                setSubmitted(true);
                setTotal((t) => t + 1);
                if (picked === d.ans) setScore((s) => s + 1);
              }}
              disabled={picked === null}
              style={{
                padding: "12px 40px",
                borderRadius: S.pill,
                border: "none",
                background: picked !== null ? S.gradMain : S.g200,
                color: picked !== null ? S.white : S.g400,
                fontFamily: S.ff,
                fontWeight: 700,
                fontSize: 15,
                cursor: picked !== null ? "pointer" : "default",
                transition: "all .3s ease",
                boxShadow: picked !== null ? S.shBtn : "none",
              }}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={() => {
                if (stepIdx < modeSteps.length - 1) go(stepIdx + 1);
              }}
              style={{
                padding: "12px 40px",
                borderRadius: S.pill,
                border: "none",
                background: S.gradIndigo,
                color: S.white,
                fontFamily: S.ff,
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                transition: "all .3s ease",
                boxShadow: "0 6px 20px rgba(74,77,201,.3)",
              }}
            >
              {stepIdx < modeSteps.length - 1 ? "Next Question →" : "Done!"}
            </button>
          )}
        </div>

        {/* explanation */}
        {submitted && (
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: S.card,
              backgroundColor: isRight ? S.ok + "0c" : S.orange + "0c",
              border: `2px solid ${isRight ? S.ok + "25" : S.orange + "25"}`,
              animation: "eqLabel .35s ease-out both",
            }}
          >
            <div
              style={{
                fontFamily: S.ff,
                fontWeight: 700,
                fontSize: 14,
                color: isRight ? "#166534" : S.orange,
                marginBottom: 4,
              }}
            >
              {isRight ? "🎉 Correct!" : "💡 Not quite — here's why:"}
            </div>
            <div
              style={{
                fontFamily: S.ff,
                fontWeight: 500,
                fontSize: 13,
                color: S.g900,
                lineHeight: 1.55,
              }}
            >
              {d.why}
            </div>
          </div>
        )}

        {/* score */}
        {total > 0 && (
          <div
            style={{
              textAlign: "center" as const,
              marginTop: 10,
              fontFamily: S.ff,
              fontSize: 12,
              fontWeight: 600,
              color: S.g400,
            }}
          >
            Score: {score} / {total}
          </div>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  //  MAIN LAYOUT
  // ═══════════════════════════════════════════════════════════

  return (
    <div
      style={{
        width: config.width,
        maxWidth: "100%",
        minHeight: config.height,
        fontFamily: S.ff,
        backgroundColor: S.white,
        borderRadius: S.outer,
        overflow: "hidden",
        boxShadow: S.sh1,
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${S.g200}`,
      }}
    >
      {/* ═══ HEADER (gradient) ═══ */}
      <div
        style={{
          background: S.gradMain,
          padding: "22px 24px 18px",
          position: "relative" as const,
          overflow: "hidden",
        }}
      >
        {/* decorative circles */}
        <div
          style={{
            position: "absolute" as const,
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,.08)",
          }}
        />
        <div
          style={{
            position: "absolute" as const,
            bottom: -10,
            right: 60,
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,.06)",
          }}
        />
        <div
          style={{
            position: "absolute" as const,
            top: 8,
            left: -14,
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,.04)",
          }}
        />
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(255,255,255,.7)",
            textTransform: "uppercase" as const,
            letterSpacing: 1.8,
            marginBottom: 4,
          }}
        >
          Chapter 7 · Finding the Unknown
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: S.white,
            lineHeight: 1.2,
          }}
        >
          What is an Equation?
        </div>
      </div>

      {/* ═══ MODE TABS (pill buttons) ═══ */}
      {config.showModeSelector && (
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: "12px 20px",
            borderBottom: `1px solid ${S.g200}`,
            backgroundColor: S.g100,
          }}
        >
          {config.enabledModes.map((m) => {
            const mm = modeMeta[m];
            const Ic = mm.icon;
            const on = mode === m;
            return (
              <button
                key={m}
                onClick={() => switchMode(m)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 20px",
                  borderRadius: S.pill,
                  border: on ? `2px solid ${mm.c}` : "2px solid transparent",
                  backgroundColor: on ? mm.bg : "transparent",
                  color: on ? mm.c : S.g400,
                  fontFamily: S.ff,
                  fontWeight: on ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all .25s ease",
                  whiteSpace: "nowrap" as const,
                  flexShrink: 0,
                }}
              >
                <Ic size={15} />
                {mm.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ═══ CONTENT ═══ */}
      <div
        key={anim}
        style={{
          flex: 1,
          padding: "20px 24px",
          overflowY: "auto" as const,
          animation: "eqFadeUp .4s ease-out both",
        }}
      >
        {/* title */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: S.g900,
            fontFamily: S.ff,
            marginBottom: 5,
            animation: "eqFadeDown .35s ease-out both",
          }}
        >
          {step?.title}
        </div>
        {/* description */}
        <div
          style={{
            fontSize: 13,
            color: S.g400,
            fontFamily: S.ff,
            fontWeight: 500,
            lineHeight: 1.6,
            marginBottom: 16,
            animation: "eqFadeUp .35s ease-out .08s both",
          }}
        >
          {step?.description}
        </div>

        {/* LEARN */}
        {mode === "learn" && step?.data?.parts && (
          <>
            <RenderScale />
            <RenderEq parts={step.data.parts} />
            <RenderLabel parts={step.data.parts} />
          </>
        )}
        {mode === "learn" && step?.data?.solutionSteps && (
          <>
            <RenderScale />
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: S.purple,
                fontFamily: S.ff,
                margin: "8px 0 6px",
              }}
            >
              Step-by-step solution:
            </div>
            <RenderSol steps={step.data.solutionSteps} />
          </>
        )}

        {/* PRACTICE */}
        {mode === "practice" && <RenderMCQ />}

        {/* REAL WORLD */}
        {mode === "real_world" && step?.data?.parts && (
          <>
            <div
              style={{
                padding: "14px 18px",
                borderRadius: S.card,
                background: S.gradMain,
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 10,
                animation: "eqSlideR .4s ease-out both",
                boxShadow: S.shBtn,
              }}
            >
              <span style={{ fontSize: 26 }}>
                {step.data.context === "party"
                  ? "🎉"
                  : step.data.context === "savings"
                    ? "💰"
                    : "🐴"}
              </span>
              <span
                style={{
                  fontFamily: S.ff,
                  fontSize: 20,
                  fontWeight: 700,
                  color: S.white,
                }}
              >
                {step.data.equation.lhs} = {step.data.equation.rhs}
              </span>
            </div>
            <RenderEq parts={step.data.parts} />
            <RenderLabel parts={step.data.parts} />
          </>
        )}
      </div>

      {/* ═══ NAVIGATION BAR ═══ */}
      {(config.showNavigation || config.showStepIndicator) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 24px 14px",
            borderTop: `1px solid ${S.g200}`,
            backgroundColor: S.g100,
          }}
        >
          {/* prev — outlined button */}
          {config.showNavigation ? (
            <button
              onClick={() => stepIdx > 0 && go(stepIdx - 1)}
              disabled={stepIdx === 0}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "8px 20px",
                borderRadius: S.pill,
                border: `2px solid ${stepIdx === 0 ? S.g200 : S.indigo + "40"}`,
                backgroundColor: S.white,
                color: stepIdx === 0 ? S.g400 : S.indigo,
                fontFamily: S.ff,
                fontWeight: 600,
                fontSize: 13,
                cursor: stepIdx === 0 ? "default" : "pointer",
                transition: "all .25s ease",
                opacity: stepIdx === 0 ? 0.5 : 1,
              }}
            >
              <ChevronLeft size={15} /> Prev
            </button>
          ) : (
            <div />
          )}

          {/* dots */}
          {config.showStepIndicator && (
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              {modeSteps.map((_, i) => (
                <div
                  key={i}
                  onClick={() => go(i)}
                  style={{
                    width: i === stepIdx ? 22 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: i === stepIdx ? S.indigo : S.lavender,
                    cursor: "pointer",
                    transition: "all .3s ease",
                  }}
                />
              ))}
            </div>
          )}

          {/* next — contained button */}
          {config.showNavigation ? (
            <button
              onClick={() => stepIdx < modeSteps.length - 1 && go(stepIdx + 1)}
              disabled={stepIdx >= modeSteps.length - 1}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "8px 20px",
                borderRadius: S.pill,
                border: "none",
                background:
                  stepIdx >= modeSteps.length - 1 ? S.g200 : S.gradMain,
                color: stepIdx >= modeSteps.length - 1 ? S.g400 : S.white,
                fontFamily: S.ff,
                fontWeight: 600,
                fontSize: 13,
                cursor: stepIdx >= modeSteps.length - 1 ? "default" : "pointer",
                transition: "all .25s ease",
                opacity: stepIdx >= modeSteps.length - 1 ? 0.5 : 1,
                boxShadow: stepIdx >= modeSteps.length - 1 ? "none" : S.shBtn,
              }}
            >
              Next <ChevronRight size={15} />
            </button>
          ) : (
            <div />
          )}
        </div>
      )}

      {/* ═══ TEACHING NOTE (peach bar) ═══ */}
      <div
        style={{
          padding: "10px 24px 14px",
          borderTop: `1px solid ${S.g200}`,
          backgroundColor: S.peach,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: S.orange,
            textTransform: "uppercase" as const,
            letterSpacing: 1.2,
            marginBottom: 2,
          }}
        >
          Teaching Note
        </div>
        <div
          style={{
            fontSize: 11,
            color: S.g900,
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          Guide students through this interactive tool. Encourage exploration
          and discussion. Ask students to tap each part and explain what they
          discover.
        </div>
      </div>
    </div>
  );
};

export default EquationStructureExplorer;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
