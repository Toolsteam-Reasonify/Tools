// ═══════════════════════════════════════════════════════════════════════════
// File: balance_scale_tool.tsx
// Items placed ON pans · Performance optimized · Singularity Design · Brass Scale
// ═══════════════════════════════════════════════════════════════════════════

// If the host workspace is missing React/lucide typings, suppress import errors
// so this file can still be edited/compiled in isolation.
// (Runtime still requires the actual packages to exist.)

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// @ts-ignore - workspace may not include react typings
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
// @ts-ignore - workspace may not include lucide-react typings
import { ChevronLeft, ChevronRight, RotateCcw, BookOpen, Target } from "lucide-react";

// ==================== TYPES ====================

type ModeType = "learn" | "practice";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface ScaleItem {
  id: string;
  label: string;
  emoji: string;
  weight: number;
  isUnknown: boolean;
}

interface ScaleProblem {
  id: string;
  title: string;
  leftItems: ScaleItem[];
  rightItems: ScaleItem[];
  unknownVar: string;
  equation: string;
  solution: number;
  hint: string;
  figRef: string;
}

interface MCQQuestion {
  id: number;
  q: string;
  pIdx: number;
  opts: string[];
  ans: number;
  exp: string;
}

interface LearnStep {
  id: number;
  title: string;
  desc: string;
  data?: { pIdx?: number; eq?: boolean; allEq?: boolean };
}

interface ScaleState {
  lw: number;
  rw: number;
  diff: number;
  bal: boolean;
}

interface BalanceScaleAdditionalProps {
  problems?: ScaleProblem[];
  mcqQuestions?: MCQQuestion[];
}

interface BalanceScaleToolProps {
  props?: {
    width?: number;
    height?: number;
    initialMode?: ModeType;
    showModeSelector?: boolean;
    enabledModes?: ModeType[];
    showNavigation?: boolean;
    showStepIndicator?: boolean;
    additionalProps?: BalanceScaleAdditionalProps;
  };
  setStepDetails?: (d: StepDetails) => void;
}

// ==================== DESIGN TOKENS ====================

const DS = {
  primary: "#4A4DC9",
  accent: "#FF7212",
  primaryDark: "#533086",
  accentDark: "#FC9145",
  primaryLight: "#C1C1EA",
  accentLight: "#FFF3E4",
  gray900: "#4E4E4E",
  gray400: "#CACACA",
  gray200: "#EBEBEB",
  gray50: "#F5F5F5",
  white: "#FFFFFF",
  success: "#2DB57B",
  error: "#E54D4D",
  font: "'Poppins', sans-serif",
  r: { sm: 8, md: 12, lg: 20, xl: 40 },
  sh: {
    sm: "0 2px 8px rgba(74,77,201,.08)",
    md: "0 4px 16px rgba(74,77,201,.12)",
    lg: "0 8px 32px rgba(74,77,201,.16)",
    acc: "0 4px 16px rgba(255,114,18,.25)",
  },
};

const BRASS = {
  light: "#E8D174",
  mid: "#C9A84C",
  dark: "#A07C28",
  darker: "#7A5C18",
  shadow: "#5A4010",
  highlight: "#F5E6A0",
  shine: "#FFF8DC",
  panInner: "#D4B858",
  panRim: "#B8962E",
  chain: "#B89838",
};

// ==================== DATA ====================

const PROBLEMS: ScaleProblem[] = [
  {
    id: "fig76",
    title: "Fig 7.6 — Bread & Eggs",
    leftItems: [
      { id: "b1", label: "Bread", emoji: "🍞", weight: 2, isUnknown: false },
      { id: "b2", label: "Bread", emoji: "🍞", weight: 2, isUnknown: false },
      { id: "b3", label: "Bread", emoji: "🍞", weight: 2, isUnknown: false },
    ],
    rightItems: [
      { id: "e1", label: "Egg", emoji: "🍳", weight: 3, isUnknown: true },
      { id: "e2", label: "Egg", emoji: "🍳", weight: 3, isUnknown: true },
    ],
    unknownVar: "e",
    equation: "2+2+2 = e+e → 2e = 6 → e = 3",
    solution: 3,
    hint: "Each bread=2. Total left=6. Two eggs=6 → each egg=3.",
    figRef: "Fig 7.6",
  },
  {
    id: "fig77",
    title: "Fig 7.7 — Sun & Stars",
    leftItems: [
      { id: "s1", label: "Sun", emoji: "☀️", weight: 4, isUnknown: false },
      { id: "st1", label: "Star", emoji: "⭐", weight: 6, isUnknown: true },
      { id: "st2", label: "Star", emoji: "⭐", weight: 6, isUnknown: true },
    ],
    rightItems: [
      { id: "w1", label: "16", emoji: "🔷", weight: 16, isUnknown: false },
    ],
    unknownVar: "y",
    equation: "4+2y = 16 → 2y = 12 → y = 6",
    solution: 6,
    hint: "Sun=4. Remove 4: 2y=12 → y=6.",
    figRef: "Fig 7.7",
  },
  {
    id: "fig78",
    title: "Fig 7.8 — Fruits",
    leftItems: [
      {
        id: "wm1",
        label: "Watermelon",
        emoji: "🍉",
        weight: 10,
        isUnknown: false,
      },
      { id: "or1", label: "Orange", emoji: "🍊", weight: 4, isUnknown: false },
    ],
    rightItems: [
      { id: "bn1", label: "Banana", emoji: "🍌", weight: 7, isUnknown: true },
      { id: "bn2", label: "Banana", emoji: "🍌", weight: 7, isUnknown: true },
    ],
    unknownVar: "b",
    equation: "10+4 = 2b → 14 = 2b → b = 7",
    solution: 7,
    hint: "Left=14. Two bananas=14 → each=7.",
    figRef: "Fig 7.8",
  },
];

const MCQ_DATA: MCQQuestion[] = [
  {
    id: 1,
    q: "Fig 7.6: Three bread slices (each=2) balance two eggs. Weight of each egg?",
    pIdx: 0,
    opts: ["2", "3", "4", "6"],
    ans: 1,
    exp: "Total left=6. 2 eggs=6 → each=3.",
  },
  {
    id: 2,
    q: "Fig 7.7: Sun (4) + 2 stars balance 16. Weight of each star?",
    pIdx: 1,
    opts: ["4", "5", "6", "8"],
    ans: 2,
    exp: "Remove sun: 2y=12 → y=6.",
  },
  {
    id: 3,
    q: "Fig 7.8: Watermelon (10) + Orange (4) balance 2 bananas. Each banana?",
    pIdx: 2,
    opts: ["5", "6", "7", "10"],
    ans: 2,
    exp: "Left=14. 2b=14 → b=7.",
  },
  {
    id: 4,
    q: "If 3 apples balance a pumpkin of weight 12, what does each apple weigh?",
    pIdx: -1,
    opts: ["3", "4", "6", "9"],
    ans: 1,
    exp: "3 apples=12 → each=4.",
  },
  {
    id: 5,
    q: "Remove 5 kg from both sides of a balanced scale. What happens?",
    pIdx: -1,
    opts: [
      "Left goes down",
      "Right goes down",
      "Stays balanced",
      "Scale tips over",
    ],
    ans: 2,
    exp: "Equal removal → stays balanced!",
  },
];

const LEARN_DATA: LearnStep[] = [
  {
    id: 1,
    title: "What is a Balance Scale?",
    desc: "A balance scale has two pans hung by chains. When both sides have equal weight, the beam stays perfectly level — this is the basis of equations!",
  },
  {
    id: 2,
    title: "The Golden Rule",
    desc: "Remove the same weight from BOTH sides → the scale stays balanced. This is how we isolate and find unknowns!",
  },
  {
    id: 3,
    title: "Fig 7.6 — Find the Egg Weight",
    desc: "Three breads (each=2) balance two eggs. Total left = 6, so 2e = 6 → e = 3!",
    data: { pIdx: 0, eq: true },
  },
  {
    id: 4,
    title: "Fig 7.7 — Find the Star Weight",
    desc: "Sun (4) + 2 stars = 16. Remove sun: 2y = 12 → y = 6!",
    data: { pIdx: 1, eq: true },
  },
  {
    id: 5,
    title: "Fig 7.8 — Find the Banana Weight",
    desc: "Watermelon (10) + Orange (4) = 2 bananas. 14 = 2b → b = 7!",
    data: { pIdx: 2, eq: true },
  },
  {
    id: 6,
    title: "Equations from Balance Scales",
    desc: "Every balanced scale gives an equation: Left = Right. This is algebra — Bījagaṇita!",
    data: { allEq: true },
  },
];

// ==================== KEYFRAMES ====================

const KF = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInDown{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{0%{transform:scale(0);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
@keyframes revealAnswer{0%{transform:scale(0) rotate(-5deg);opacity:0}60%{transform:scale(1.06) rotate(1deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}
@keyframes scaleIn{from{transform:scale(.93);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes correctPulse{0%{box-shadow:0 0 0 0 rgba(45,181,123,.4)}70%{box-shadow:0 0 0 10px rgba(45,181,123,0)}100%{box-shadow:0 0 0 0 rgba(45,181,123,0)}}
@keyframes wrongShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-3px)}40%,80%{transform:translateX(3px)}}
`;

// ==================== SVG DEFS (static, outside component) ====================

const SvgDefs: React.FC = React.memo(() => (
  <defs>
    <linearGradient id="pillarG" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor={BRASS.dark} />
      <stop offset="25%" stopColor={BRASS.light} />
      <stop offset="45%" stopColor={BRASS.highlight} />
      <stop offset="55%" stopColor={BRASS.light} />
      <stop offset="75%" stopColor={BRASS.mid} />
      <stop offset="100%" stopColor={BRASS.dark} />
    </linearGradient>
    <linearGradient id="beamG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={BRASS.highlight} />
      <stop offset="40%" stopColor={BRASS.mid} />
      <stop offset="100%" stopColor={BRASS.dark} />
    </linearGradient>
    <radialGradient id="baseG" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stopColor={BRASS.highlight} />
      <stop offset="50%" stopColor={BRASS.mid} />
      <stop offset="100%" stopColor={BRASS.darker} />
    </radialGradient>
    <radialGradient id="panGL" cx="40%" cy="30%" r="70%">
      <stop offset="0%" stopColor={BRASS.highlight} />
      <stop offset="60%" stopColor={BRASS.mid} />
      <stop offset="100%" stopColor={BRASS.dark} />
    </radialGradient>
    <radialGradient id="panGR" cx="60%" cy="30%" r="70%">
      <stop offset="0%" stopColor={BRASS.highlight} />
      <stop offset="60%" stopColor={BRASS.mid} />
      <stop offset="100%" stopColor={BRASS.dark} />
    </radialGradient>
    <linearGradient id="finG" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor={BRASS.highlight} />
      <stop offset="50%" stopColor={BRASS.mid} />
      <stop offset="100%" stopColor={BRASS.dark} />
    </linearGradient>
  </defs>
));

// ==================== MAIN COMPONENT ====================

const BalanceScaleTool: React.FC<BalanceScaleToolProps> = ({
  props: propsIn,
  setStepDetails,
}) => {
  const props = (propsIn ?? {}) as NonNullable<BalanceScaleToolProps["props"]>;
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 620,
      initialMode: (props.initialMode ?? "learn") as ModeType,
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: (props.enabledModes ?? ["learn", "practice"]) as ModeType[],
      showNavigation: props.showNavigation ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
    }),
    [props],
  );

  const ap = props.additionalProps || {};
  const problems = useMemo(() => ap.problems ?? PROBLEMS, [ap.problems]);
  const mcqs = useMemo(() => ap.mcqQuestions ?? MCQ_DATA, [ap.mcqQuestions]);

  const [mode, setMode] = useState<ModeType>(config.initialMode);
  const [lIdx, setLIdx] = useState(0);
  const [mIdx, setMIdx] = useState(0);
  const [hint, setHint] = useState(false);
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [solved, setSolved] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [sStep, setSStep] = useState(0);
  const [hov, setHov] = useState<string | null>(null);
  const [selOpt, setSelOpt] = useState<number | null>(null);
  const [subbed, setSubbed] = useState(false);
  const [score, setScore] = useState<Record<number, boolean>>({});
  const timersRef = useRef<number[]>([]);

  const ls = LEARN_DATA[lIdx];
  const mq = mcqs[mIdx];

  // ─── Inject keyframes once ───
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "bs-kf";
    el.textContent = KF;
    document.head.appendChild(el);
    return () => {
      document.getElementById("bs-kf")?.remove();
    };
  }, []);

  // ─── Reset on learn step change ───
  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setHint(false);
    setRemoved(new Set());
    setSolved(false);
    setSStep(0);
    setAnimating(false);
  }, [lIdx, mode]);

  // ─── Reset on MCQ change ───
  useEffect(() => {
    setSelOpt(null);
    setSubbed(false);
  }, [mIdx]);

  // ─── Report step details ───
  useEffect(() => {
    const total = mode === "learn" ? LEARN_DATA.length : mcqs.length;
    const cur = mode === "learn" ? lIdx + 1 : mIdx + 1;
    setStepDetails?.({
      currentStep: cur,
      totalSteps: total,
      isPaused: true,
      currentMode: mode,
    });
  }, [lIdx, mIdx, mode, mcqs.length, setStepDetails]);

  // ─── Scale state calculator (memoized) ───
  const calcState = useCallback(
    (p: ScaleProblem): ScaleState => {
      const lw = p.leftItems
        .filter((i) => !removed.has(i.id))
        .reduce((s, i) => s + i.weight, 0);
      const rw = p.rightItems
        .filter((i) => !removed.has(i.id))
        .reduce((s, i) => s + i.weight, 0);
      return { lw, rw, diff: lw - rw, bal: Math.abs(lw - rw) < 0.01 };
    },
    [removed],
  );

  // ─── Animated solve ───
  const doSolve = useCallback(() => {
    const pi = ls?.data?.pIdx;
    if (pi == null || !problems[pi]) return;
    const p = problems[pi];
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setAnimating(true);
    setSStep(0);
    setRemoved(new Set());

    const t1 = window.setTimeout(() => setSStep(1), 400);
    timersRef.current.push(t1);

    const kl = p.leftItems.filter((i) => !i.isUnknown);
    const kr = p.rightItems.filter((i) => !i.isUnknown);
    const rem = new Set<string>();
    let d = 1400;
    const mn = Math.min(kl.length, kr.length);
    for (let i = 0; i < mn; i++) {
      const lid = kl[i]?.id,
        rid = kr[i]?.id;
      if (lid && rid) {
        const t = window.setTimeout(() => {
          rem.add(lid);
          rem.add(rid);
          setRemoved(new Set(rem));
        }, d);
        timersRef.current.push(t);
        d += 700;
      }
    }
    const t2 = window.setTimeout(() => setSStep(2), d);
    timersRef.current.push(t2);
    d += 900;
    const t3 = window.setTimeout(() => {
      setSStep(3);
      setSolved(true);
      setAnimating(false);
    }, d);
    timersRef.current.push(t3);
  }, [ls, problems]);

  const doSubmit = useCallback(() => {
    if (selOpt === null || !mq) return;
    setSubbed(true);
    setScore((prev) => ({ ...prev, [mq.id]: selOpt === mq.ans }));
  }, [selOpt, mq]);

  // ═══════════════════════════════════════════════════════════════
  // BRASS SCALE SVG — items ON the pan
  // ═══════════════════════════════════════════════════════════════

  const renderScale = useCallback(
    (p: ScaleProblem, compact: boolean = false): React.ReactElement => {
      const st = calcState(p);
      const tilt = Math.max(-8, Math.min(8, st.diff * 1.2));
      const W = compact ? 520 : 640,
        H = compact ? 230 : 300;
      const cx = W / 2,
        baseY = H - 8;
      const pTop = compact ? 48 : 58;
      const bY = pTop,
        bH = compact ? 180 : 225;
      const pR = compact ? 46 : 55,
        cLen = compact ? 65 : 85;

      const li = p.leftItems.filter((i) => !removed.has(i.id));
      const ri = p.rightItems.filter((i) => !removed.has(i.id));

      // Pan Y position (where items sit)
      const panY = bY + cLen + 5;

      const renderPanItems = (
        items: ScaleItem[],
        panCx: number,
        isLeft: boolean,
      ) => {
        const count = items.length;
        const spacing = count > 3 ? 14 : count > 1 ? 18 : 0;
        const startX = panCx - ((count - 1) * spacing) / 2;
        const emojiSize = count > 3 ? 16 : 20;

        return (
          <g>
            {/* Pan shadow */}
            <ellipse
              cx={panCx}
              cy={panY + 3}
              rx={pR + 2}
              ry={7}
              fill="rgba(90,64,16,0.12)"
            />
            {/* Pan dish */}
            <ellipse
              cx={panCx}
              cy={panY}
              rx={pR}
              ry={10}
              fill={`url(#panG${isLeft ? "L" : "R"})`}
              stroke={BRASS.panRim}
              strokeWidth={1.5}
            />
            <ellipse
              cx={panCx}
              cy={panY - 1}
              rx={pR - 5}
              ry={7}
              fill={BRASS.panInner}
              opacity={0.45}
            />
            <ellipse
              cx={panCx}
              cy={panY - 3}
              rx={pR - 3}
              ry={2.5}
              fill={BRASS.shine}
              opacity={0.2}
            />

            {/* ITEMS SITTING ON THE PAN — positioned at panY level */}
            {items.map((it, i) => {
              const ix = startX + i * spacing;
              // Items sit ON the pan surface: emoji bottom at panY, so center emoji above pan
              const itemY = panY - 6; // bottom of emoji touches pan rim
              return (
                <g key={it.id}>
                  {/* Small shadow under each item on pan */}
                  <ellipse
                    cx={ix}
                    cy={panY - 2}
                    rx={7}
                    ry={2}
                    fill="rgba(90,64,16,0.18)"
                  />
                  {/* The emoji item sitting on pan */}
                  <text
                    x={ix}
                    y={itemY}
                    fontSize={emojiSize}
                    textAnchor="middle"
                    dominantBaseline="auto"
                    style={{
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
                    }}
                  >
                    {it.emoji}
                  </text>
                  {/* Weight label below pan */}
                  <text
                    x={ix}
                    y={panY + 18}
                    fontSize={8}
                    fill={DS.gray900}
                    textAnchor="middle"
                    fontFamily={DS.font}
                    fontWeight={600}
                  >
                    {it.isUnknown ? "?" : it.weight}
                  </text>
                </g>
              );
            })}

            {/* Weight total badge */}
            <rect
              x={panCx - 15}
              y={panY + 24}
              width={30}
              height={15}
              rx={7.5}
              fill={isLeft ? DS.primary : DS.accent}
              opacity={0.9}
            />
            <text
              x={panCx}
              y={panY + 34.5}
              fontSize={9}
              fill={DS.white}
              textAnchor="middle"
              fontFamily={DS.font}
              fontWeight={700}
            >
              {isLeft ? st.lw : st.rw}
            </text>
          </g>
        );
      };

      return (
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          style={{ overflow: "visible", maxWidth: "100%" }}
        >
          <SvgDefs />

          {/* BASE */}
          <ellipse cx={cx} cy={baseY} rx={50} ry={9} fill="url(#baseG)" />
          <ellipse cx={cx} cy={baseY - 3} rx={46} ry={7} fill={BRASS.mid} />
          <ellipse
            cx={cx}
            cy={baseY - 3}
            rx={42}
            ry={5}
            fill={BRASS.light}
            opacity={0.4}
          />
          <ellipse
            cx={cx}
            cy={baseY - 5}
            rx={34}
            ry={4}
            fill="none"
            stroke={BRASS.dark}
            strokeWidth={0.7}
            opacity={0.35}
          />

          {/* PILLAR */}
          <rect
            x={cx - 7}
            y={pTop + 9}
            width={14}
            height={baseY - pTop - 14}
            rx={3}
            fill="url(#pillarG)"
          />
          <rect
            x={cx - 1.5}
            y={pTop + 13}
            width={3}
            height={baseY - pTop - 22}
            rx={1.5}
            fill={BRASS.shine}
            opacity={0.3}
          />
          {[0.15, 0.5, 0.85].map((t, i) => {
            const ry = pTop + 9 + (baseY - pTop - 14) * t;
            return (
              <ellipse
                key={i}
                cx={cx}
                cy={ry}
                rx={9}
                ry={2.2}
                fill="none"
                stroke={BRASS.dark}
                strokeWidth={0.6}
                opacity={0.25}
              />
            );
          })}
          <ellipse
            cx={cx}
            cy={pTop + 9}
            rx={11}
            ry={3.5}
            fill={BRASS.mid}
            stroke={BRASS.dark}
            strokeWidth={0.4}
          />

          {/* FINIAL */}
          <path
            d={`M${cx - 5},${pTop + 5} Q${cx - 9},${pTop - 5} ${cx - 3},${pTop - 12} Q${cx - 1.5},${pTop - 18} ${cx},${pTop - 22} Q${cx + 1.5},${pTop - 18} ${cx + 3},${pTop - 12} Q${cx + 9},${pTop - 5} ${cx + 5},${pTop + 5} Z`}
            fill="url(#finG)"
            stroke={BRASS.dark}
            strokeWidth={0.7}
          />
          <circle
            cx={cx}
            cy={pTop - 22}
            r={3}
            fill={BRASS.light}
            stroke={BRASS.dark}
            strokeWidth={0.5}
          />
          <circle
            cx={cx - 0.8}
            cy={pTop - 23}
            r={0.8}
            fill={BRASS.shine}
            opacity={0.5}
          />

          {/* BEAM GROUP */}
          <g
            style={{
              transformOrigin: `${cx}px ${bY}px`,
              transform: `rotate(${solved ? 0 : tilt}deg)`,
              transition: "transform 0.85s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {/* Beam */}
            <rect
              x={cx - bH}
              y={bY - 3}
              width={bH * 2}
              height={6}
              rx={3}
              fill="url(#beamG)"
            />
            <rect
              x={cx - bH + 4}
              y={bY - 1.5}
              width={bH * 2 - 8}
              height={1.5}
              rx={0.75}
              fill={BRASS.shine}
              opacity={0.25}
            />
            {/* End caps */}
            <circle
              cx={cx - bH}
              cy={bY}
              r={3.5}
              fill={BRASS.mid}
              stroke={BRASS.dark}
              strokeWidth={0.7}
            />
            <circle
              cx={cx + bH}
              cy={bY}
              r={3.5}
              fill={BRASS.mid}
              stroke={BRASS.dark}
              strokeWidth={0.7}
            />
            {/* Pivot */}
            <circle
              cx={cx}
              cy={bY}
              r={5.5}
              fill={BRASS.mid}
              stroke={BRASS.dark}
              strokeWidth={0.9}
            />
            <circle cx={cx} cy={bY} r={2.5} fill={BRASS.light} />

            {/* LEFT CHAINS */}
            {([-1, 0, 1] as const).map((d) => (
              <line
                key={`lc${d}`}
                x1={cx - bH + d * 2.5}
                y1={bY + 3.5}
                x2={cx - bH + d * pR * 0.55}
                y2={bY + cLen}
                stroke={BRASS.chain}
                strokeWidth={1.2}
                strokeDasharray="2 2.5"
                opacity={0.65}
              />
            ))}
            {/* RIGHT CHAINS */}
            {([-1, 0, 1] as const).map((d) => (
              <line
                key={`rc${d}`}
                x1={cx + bH + d * 2.5}
                y1={bY + 3.5}
                x2={cx + bH + d * pR * 0.55}
                y2={bY + cLen}
                stroke={BRASS.chain}
                strokeWidth={1.2}
                strokeDasharray="2 2.5"
                opacity={0.65}
              />
            ))}

            {/* LEFT PAN + ITEMS ON IT */}
            {renderPanItems(li, cx - bH, true)}
            {/* RIGHT PAN + ITEMS ON IT */}
            {renderPanItems(ri, cx + bH, false)}
          </g>

          {/* BALANCED CHECK */}
          {st.bal && (
            <g style={{ animation: "popIn .45s ease-out both" }}>
              <circle cx={cx} cy={pTop - 34} r={10} fill={DS.success} />
              <text
                x={cx}
                y={pTop - 29.5}
                fontSize={10}
                fill={DS.white}
                textAnchor="middle"
                fontWeight={700}
              >
                ✓
              </text>
            </g>
          )}
        </svg>
      );
    },
    [calcState, removed, solved],
  );

  // ═══ EQUATION CHIP ═══
  const renderEq = useCallback(
    (p: ScaleProblem, idx: number = 0) => (
      <div
        key={p.id}
        style={{
          background: `linear-gradient(135deg,${DS.primaryLight}40,${DS.accentLight})`,
          borderRadius: DS.r.md,
          padding: "10px 20px",
          border: `1.5px solid ${DS.primaryLight}`,
          fontFamily: DS.font,
          fontSize: 14,
          fontWeight: 600,
          color: DS.primaryDark,
          textAlign: "center",
          animation: `fadeInUp .35s ease-out ${idx * 0.08}s both`,
          boxShadow: DS.sh.sm,
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: DS.gray400,
            marginBottom: 2,
            fontWeight: 500,
          }}
        >
          {p.figRef}
        </div>
        {p.equation}
      </div>
    ),
    [],
  );

  // ═══ SOLUTION BOX ═══
  const renderSol = useCallback(
    (p: ScaleProblem) => (
      <div
        style={{
          background: `linear-gradient(135deg,${DS.success}15,${DS.success}08)`,
          borderRadius: DS.r.md,
          padding: "12px 20px",
          border: `2px solid ${DS.success}`,
          fontFamily: DS.font,
          textAlign: "center",
          animation: "revealAnswer .5s ease-out both",
          boxShadow: `0 4px 16px ${DS.success}20`,
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: DS.success,
            marginBottom: 2,
            fontWeight: 600,
          }}
        >
          ✅ Answer
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: DS.primaryDark }}>
          {p.unknownVar} = {p.solution}
        </div>
        <div style={{ fontSize: 11, color: DS.success, marginTop: 2 }}>
          Each{" "}
          {
            (
              p.rightItems.find((i) => i.isUnknown) ||
              p.leftItems.find((i) => i.isUnknown)
            )?.label
          }{" "}
          weighs {p.solution}!
        </div>
      </div>
    ),
    [],
  );

  // ═══ BUTTON ═══
  const Btn: React.FC<{
    label: string;
    onClick: () => void;
    color?: string;
    disabled?: boolean;
    small?: boolean;
    outline?: boolean;
    hk: string;
  }> = React.memo(
    ({
      label,
      onClick,
      color = DS.primary,
      disabled = false,
      small = false,
      outline = false,
      hk,
    }) => {
      const h = hov === hk && !disabled;
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          onMouseEnter={() => setHov(hk)}
          onMouseLeave={() => setHov(null)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: small ? "6px 16px" : "8px 24px",
            borderRadius: DS.r.xl,
            border: outline
              ? `2px solid ${disabled ? DS.gray200 : color}`
              : "none",
            background: outline ? "transparent" : disabled ? DS.gray200 : color,
            color: outline
              ? disabled
                ? DS.gray400
                : color
              : disabled
                ? DS.gray400
                : DS.white,
            fontFamily: DS.font,
            fontWeight: 600,
            fontSize: small ? 12 : 13,
            cursor: disabled ? "not-allowed" : "pointer",
            transform: h ? "scale(1.04)" : "scale(1)",
            transition: "all .2s ease",
            boxShadow:
              h && !outline
                ? color === DS.accent
                  ? DS.sh.acc
                  : DS.sh.md
                : "none",
            opacity: disabled ? 0.6 : 1,
          }}
        >
          {label}
        </button>
      );
    },
  );

  // ═══ NAV STATE ═══
  const nT = mode === "learn" ? LEARN_DATA.length : mcqs.length;
  const nC = mode === "learn" ? lIdx : mIdx;
  const setN = mode === "learn" ? setLIdx : setMIdx;

  // ═══ MAIN RENDER ═══
  return (
    <div
      style={{
        width: config.width,
        maxWidth: "100%",
        minHeight: config.height,
        background: `linear-gradient(180deg,${DS.gray50},${DS.white})`,
        borderRadius: DS.r.lg,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: DS.font,
        boxShadow: DS.sh.lg,
        border: `1px solid ${DS.gray200}`,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "14px 20px 10px",
          background: `linear-gradient(135deg,${DS.primaryDark},${DS.primary})`,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontFamily: DS.font,
              fontSize: 16,
              fontWeight: 700,
              color: DS.white,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 20 }}>⚖️</span> Balance Scale Explorer
          </div>
          {config.showStepIndicator && (
            <div
              style={{
                fontFamily: DS.font,
                fontSize: 11,
                fontWeight: 600,
                color: DS.primaryLight,
                background: "rgba(255,255,255,.15)",
                padding: "3px 10px",
                borderRadius: DS.r.xl,
              }}
            >
              {nC + 1}/{nT}
            </div>
          )}
        </div>
        {config.showModeSelector && (
          <div style={{ display: "flex", gap: 6 }}>
            {config.enabledModes.map((m) => {
              const act = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    if (m === "learn") setLIdx(0);
                    if (m === "practice") setMIdx(0);
                  }}
                  onMouseEnter={() => setHov(`t-${m}`)}
                  onMouseLeave={() => setHov(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 16px",
                    borderRadius: DS.r.xl,
                    border: "none",
                    background: act ? DS.white : "rgba(255,255,255,.12)",
                    color: act ? DS.primary : "rgba(255,255,255,.8)",
                    fontFamily: DS.font,
                    fontWeight: act ? 700 : 500,
                    fontSize: 12,
                    cursor: "pointer",
                    transform: hov === `t-${m}` ? "scale(1.04)" : "scale(1)",
                    transition: "all .2s ease",
                    boxShadow: act ? DS.sh.sm : "none",
                  }}
                >
                  {m === "learn" ? (
                    <BookOpen size={13} />
                  ) : (
                    <Target size={13} />
                  )}{" "}
                  {m === "learn" ? "Learn" : "Practice"}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 20px",
        }}
      >
        {/* ══════ LEARN MODE ══════ */}
        {mode === "learn" &&
          ls &&
          (() => {
            const pi = ls.data?.pIdx;
            const prob = pi != null ? problems[pi] : null;
            return (
              <div
                key={`l-${lIdx}`}
                style={{
                  animation: "fadeInUp .35s ease-out both",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontFamily: DS.font,
                    fontSize: 18,
                    fontWeight: 700,
                    color: DS.primaryDark,
                    textAlign: "center",
                    animation: "fadeInDown .3s ease-out both",
                  }}
                >
                  {ls.title}
                </div>
                <div
                  style={{
                    fontFamily: DS.font,
                    fontSize: 13,
                    color: DS.gray900,
                    textAlign: "center",
                    maxWidth: 540,
                    lineHeight: 1.55,
                    fontWeight: 400,
                  }}
                >
                  {ls.desc}
                </div>
                {prob && (
                  <div style={{ animation: "scaleIn .35s ease-out .1s both" }}>
                    {renderScale(prob)}
                  </div>
                )}
                {!prob && !ls.data?.allEq && (
                  <div style={{ animation: "scaleIn .4s ease-out both" }}>
                    {renderScale(problems[0])}
                  </div>
                )}
                {ls.data?.allEq && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      width: "100%",
                      maxWidth: 440,
                    }}
                  >
                    {problems.map((p2, i2) => renderEq(p2, i2))}
                  </div>
                )}
                {prob &&
                  ls.data?.eq &&
                  (sStep >= 2 || !animating) &&
                  renderEq(prob)}
                {prob && solved && renderSol(prob)}
                {prob && !solved && (
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      marginTop: 4,
                    }}
                  >
                    <Btn
                      label={
                        animating ? "⏳ Solving..." : "✨ Animate Solution"
                      }
                      onClick={doSolve}
                      disabled={animating}
                      color={DS.primary}
                      hk="anim"
                    />
                    <Btn
                      label={hint ? "Hide Hint" : "💡 Hint"}
                      onClick={() => setHint(!hint)}
                      outline
                      small
                      color={DS.accentDark}
                      hk="hint"
                    />
                  </div>
                )}
                {hint && prob && (
                  <div
                    style={{
                      padding: "8px 16px",
                      background: DS.accentLight,
                      borderRadius: DS.r.md,
                      fontFamily: DS.font,
                      fontSize: 12,
                      color: DS.accentDark,
                      maxWidth: 420,
                      textAlign: "center",
                      lineHeight: 1.5,
                      animation: "fadeInUp .25s ease-out both",
                      border: `1px solid ${DS.accentDark}30`,
                    }}
                  >
                    {prob.hint}
                  </div>
                )}
              </div>
            );
          })()}

        {/* ══════ PRACTICE MODE ══════ */}
        {mode === "practice" &&
          mq &&
          (() => {
            const ok = selOpt === mq.ans;
            const prob = mq.pIdx >= 0 ? problems[mq.pIdx] : null;
            const tA = Object.keys(score).length;
            const tC = Object.values(score).filter(Boolean).length;
            return (
              <div
                key={`m-${mIdx}`}
                style={{
                  animation: "fadeInUp .35s ease-out both",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  maxWidth: 560,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: DS.font,
                      fontSize: 11,
                      fontWeight: 600,
                      color: DS.primary,
                      background: DS.primaryLight + "40",
                      padding: "4px 12px",
                      borderRadius: DS.r.xl,
                    }}
                  >
                    Q {mIdx + 1}/{mcqs.length}
                  </div>
                  <div
                    style={{
                      fontFamily: DS.font,
                      fontSize: 11,
                      fontWeight: 600,
                      color: DS.success,
                      background: DS.success + "15",
                      padding: "4px 12px",
                      borderRadius: DS.r.xl,
                    }}
                  >
                    Score: {tC}/{tA}
                  </div>
                </div>
                {prob && (
                  <div
                    style={{
                      animation: "scaleIn .3s ease-out .08s both",
                      transform: "scale(.78)",
                      transformOrigin: "center",
                    }}
                  >
                    {renderScale(prob, true)}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: DS.font,
                    fontSize: 14,
                    fontWeight: 600,
                    color: DS.primaryDark,
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  {mq.q}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                    width: "100%",
                  }}
                >
                  {mq.opts.map((o, i) => {
                    const isSel = selOpt === i,
                      isR = subbed && i === mq.ans,
                      isW = subbed && isSel && !ok;
                    let bg: string = DS.white,
                      brd: string = DS.gray200,
                      cl: string = DS.gray900;
                    if (isSel && !subbed) {
                      bg = DS.primaryLight + "30";
                      brd = DS.primary;
                      cl = DS.primary;
                    }
                    if (isR) {
                      bg = DS.success + "15";
                      brd = DS.success;
                      cl = DS.success;
                    }
                    if (isW) {
                      bg = DS.error + "10";
                      brd = DS.error;
                      cl = DS.error;
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (!subbed) setSelOpt(i);
                        }}
                        disabled={subbed}
                        onMouseEnter={() => setHov(`o${i}`)}
                        onMouseLeave={() => setHov(null)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: DS.r.md,
                          border: `2px solid ${brd}`,
                          background: bg,
                          color: cl,
                          fontFamily: DS.font,
                          fontWeight: 600,
                          fontSize: 14,
                          cursor: subbed ? "default" : "pointer",
                          textAlign: "center",
                          transition: "all .2s ease",
                          transform:
                            hov === `o${i}` && !subbed
                              ? "scale(1.03)"
                              : "scale(1)",
                          boxShadow: isSel && !subbed ? DS.sh.md : DS.sh.sm,
                          animation: isR
                            ? "correctPulse .5s ease-out"
                            : isW
                              ? "wrongShake .4s ease-out"
                              : undefined,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background:
                              isSel || isR
                                ? isR
                                  ? DS.success
                                  : isW
                                    ? DS.error
                                    : DS.primary
                                : DS.gray200,
                            color: isSel || isR ? DS.white : DS.gray900,
                            fontSize: 11,
                            fontWeight: 700,
                            marginRight: 8,
                          }}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        {o}
                      </button>
                    );
                  })}
                </div>
                {!subbed ? (
                  <Btn
                    label="Submit Answer"
                    onClick={doSubmit}
                    disabled={selOpt === null}
                    color={DS.accent}
                    hk="sub"
                  />
                ) : (
                  <div
                    style={{
                      padding: "10px 16px",
                      borderRadius: DS.r.md,
                      background: ok ? `${DS.success}10` : `${DS.error}10`,
                      border: `1.5px solid ${ok ? DS.success : DS.error}`,
                      fontFamily: DS.font,
                      fontSize: 12,
                      color: ok ? DS.success : DS.error,
                      textAlign: "center",
                      lineHeight: 1.5,
                      animation: "fadeInUp .3s ease-out both",
                      width: "100%",
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>
                      {ok ? "🎉 Correct!" : "❌ Not quite."}
                    </span>
                    <br />
                    {mq.exp}
                  </div>
                )}
              </div>
            );
          })()}
      </div>

      {/* TEACHING NOTE */}
      <div
        style={{
          background: DS.primaryLight + "25",
          borderTop: `1px solid ${DS.primaryLight}50`,
          padding: "5px 20px",
          textAlign: "center",
          fontFamily: DS.font,
          fontSize: 10,
          color: DS.primaryDark,
          fontWeight: 500,
        }}
      >
        📘 Teaching Note: Guide students through this tool. Encourage
        exploration and discussion.
      </div>

      {/* NAV */}
      {config.showNavigation && (
        <div
          style={{
            padding: "8px 20px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: DS.gray50,
            borderTop: `1px solid ${DS.gray200}`,
          }}
        >
          <button
            onClick={() => nC > 0 && setN((i) => i - 1)}
            disabled={nC === 0}
            onMouseEnter={() => setHov("p")}
            onMouseLeave={() => setHov(null)}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: `1.5px solid ${nC === 0 ? DS.gray200 : DS.primary}`,
              background: DS.white,
              color: nC === 0 ? DS.gray400 : DS.primary,
              cursor: nC === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: hov === "p" && nC > 0 ? "scale(1.1)" : "scale(1)",
              transition: "all .2s ease",
              boxShadow: DS.sh.sm,
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {Array.from({ length: nT }).map((_, i) => (
              <div
                key={i}
                onClick={() => setN(i)}
                style={{
                  width: i === nC ? 20 : 7,
                  height: 7,
                  borderRadius: 4,
                  background:
                    i === nC
                      ? `linear-gradient(90deg,${DS.primary},${DS.accent})`
                      : DS.gray200,
                  cursor: "pointer",
                  transition: "all .3s ease",
                }}
              />
            ))}
          </div>
          <button
            onClick={() => nC < nT - 1 && setN((i) => i + 1)}
            disabled={nC >= nT - 1}
            onMouseEnter={() => setHov("n")}
            onMouseLeave={() => setHov(null)}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: `1.5px solid ${nC >= nT - 1 ? DS.gray200 : DS.accent}`,
              background: DS.white,
              color: nC >= nT - 1 ? DS.gray400 : DS.accent,
              cursor: nC >= nT - 1 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: hov === "n" && nC < nT - 1 ? "scale(1.1)" : "scale(1)",
              transition: "all .2s ease",
              boxShadow: DS.sh.sm,
            }}
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => {
              setN(0);
              setRemoved(new Set());
              setSolved(false);
              setSStep(0);
              setScore({});
              setSelOpt(null);
              setSubbed(false);
              setHint(false);
            }}
            onMouseEnter={() => setHov("r")}
            onMouseLeave={() => setHov(null)}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: `1px solid ${DS.gray200}`,
              background: DS.white,
              color: DS.gray400,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: hov === "r" ? "scale(1.1) rotate(-45deg)" : "scale(1)",
              transition: "all .25s ease",
            }}
          >
            <RotateCcw size={13} />
          </button>
        </div>
      )}

      {/* FOOTER */}
      <div
        style={{
          background: `linear-gradient(90deg,${DS.accentLight},${DS.white})`,
          padding: "6px 20px",
          textAlign: "center",
          fontFamily: DS.font,
          fontSize: 10,
          color: DS.accentDark,
          fontWeight: 600,
          borderTop: `1px solid ${DS.accent}20`,
        }}
      >
        🎯 To find an unknown weight, remove the same known weight from both
        sides. The scale stays balanced!
      </div>
    </div>
  );
};

export default BalanceScaleTool;
