// @ts-nocheck
// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START — Grid Tiling Explorer (Singularity Design System)
// File: grid_tiling_explorer.tsx
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  X,
  RotateCw,
  Trophy,
  BookOpen,
  Target,
  Lightbulb,
} from "lucide-react";

// ═══════════ SINGULARITY DESIGN TOKENS ═══════════
const DS = {
  primary: "#4A4DC9",
  primaryDark: "#3a3da9",
  accent: "#FF7212",
  accentDark: "#e56400",
  gradientStart: "#533086",
  gradientEnd: "#FC9145",
  lavender: "#C1C1EA",
  lavenderLight: "#E8E8F5",
  peach: "#FFF3E4",
  peachMid: "#FFDDB8",
  bgLight: "#F5F5F5",
  bgWhite: "#FFFFFF",
  textDark: "#4E4E4E",
  textMid: "#7A7A7A",
  textLight: "#CACACA",
  borderLight: "#EBEBEB",
  borderMid: "#CACACA",
  success: "#2ECC71",
  successBg: "#E8F8F0",
  error: "#E74C3C",
  errorBg: "#FDECEB",
  warningBg: "#FFF8ED",
  warningBorder: "#FC9145",
  font: "'Poppins', 'Segoe UI', system-ui, sans-serif",
  radius: { sm: 8, md: 12, lg: 20, pill: 999 },
  shadow: {
    sm: "0 2px 8px rgba(74,77,201,0.08)",
    md: "0 8px 24px rgba(74,77,201,0.10)",
    lg: "0 16px 48px rgba(74,77,201,0.12)",
  },
};

// ═══════════ TYPE DEFINITIONS ═══════════
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
  type: string;
  mode: ModeType;
  data?: any;
}
interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}
interface GridTilingAdditionalProps {
  dominoTiles?: { [s: string]: any };
  gridDimensions?: { [s: string]: any };
  parityIndicator?: { [s: string]: any };
  removeSquareTool?: { [s: string]: any };
  parityRuleDisplay?: { [s: string]: any };
}
interface GridTilingExplorerProps {
  props?: {
    width?: number;
    height?: number;
    data?: BaseDataInterface;
    steps?: StepDataInterface[];
    initialMode?: ModeType;
    showModeSelector?: boolean;
    enabledModes?: ModeType[];
    showNavigation?: boolean;
    showStepIndicator?: boolean;
    initialStep?: number;
    filterSteps?: number[];
    themeColor?: string;
    darkMode?: boolean;
    additionalProps?: GridTilingAdditionalProps;
  };
  setStepDetails?: (d: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (v: boolean) => void;
}
interface PlacedDomino {
  id: string;
  row: number;
  col: number;
  orientation: "horizontal" | "vertical";
}
interface MCQQuestion {
  id: number;
  question: string;
  options: { label: string; value: string }[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

// ═══════════ MCQ QUESTIONS ═══════════
const MCQ_QUESTIONS: MCQQuestion[] = [
  {
    id: 1,
    question: "Can a 4×6 grid be completely tiled with 2×1 domino tiles?",
    options: [
      { label: "A", value: "Yes, because 24 is even" },
      { label: "B", value: "No, because 4 and 6 are both even" },
      { label: "C", value: "No, because 24 is too large" },
      { label: "D", value: "Cannot be determined" },
    ],
    correctAnswer: "A",
    explanation:
      "A 4×6 grid has 24 squares. Since 24 is even and at least one dimension is even, it can be perfectly tiled.",
    hint: "Is the total number of squares even or odd?",
  },
  {
    id: 2,
    question:
      "A 5×7 grid has 35 squares. Why can't it be tiled with 2×1 dominoes?",
    options: [
      { label: "A", value: "The grid is too large for dominoes" },
      { label: "B", value: "35 is odd, each domino covers exactly 2 squares" },
      { label: "C", value: "Both dimensions are prime numbers" },
      { label: "D", value: "Dominoes can only be placed horizontally" },
    ],
    correctAnswer: "B",
    explanation:
      "Each domino covers exactly 2 squares, so the total covered is always even. Since 35 is odd, one square must remain uncovered.",
    hint: "What happens when you divide 35 by 2?",
  },
  {
    id: 3,
    question: "Which of these grids can be tiled with 2×1 dominoes?",
    options: [
      { label: "A", value: "3×5 grid (15 squares)" },
      { label: "B", value: "7×9 grid (63 squares)" },
      { label: "C", value: "4×7 grid (28 squares)" },
      { label: "D", value: "5×5 grid (25 squares)" },
    ],
    correctAnswer: "C",
    explanation:
      "The 4×7 grid has 28 squares (even) and at least one even dimension (4), so it can be tiled. All others have odd totals.",
    hint: "Check if at least one dimension is even.",
  },
  {
    id: 4,
    question: "What is the Parity Rule for tiling m×n grids with 2×1 tiles?",
    options: [
      { label: "A", value: "Both m and n must be even" },
      { label: "B", value: "At least one of m or n must be even" },
      { label: "C", value: "m + n must be even" },
      { label: "D", value: "m × n must be a prime number" },
    ],
    correctAnswer: "B",
    explanation:
      "An m×n grid is tileable when at least one of m or n is even. If both are odd, the total is odd, making tiling impossible.",
    hint: "When is odd × odd = odd?",
  },
  {
    id: 5,
    question:
      "You remove 1 square from a 5×7 grid (34 left). Can it always be tiled?",
    options: [
      { label: "A", value: "Yes, 34 is even so always tileable" },
      { label: "B", value: "No, even count is necessary but not sufficient" },
      { label: "C", value: "Yes, removing any square works" },
      { label: "D", value: "No, never tileable after removal" },
    ],
    correctAnswer: "B",
    explanation:
      "Even count is necessary but not sufficient. The shape of the remaining region matters — which square you remove determines tileability.",
    hint: "Does the removed square's position matter?",
  },
  {
    id: 6,
    question: "How many 2×1 dominoes are needed to tile a 6×8 grid?",
    options: [
      { label: "A", value: "48 tiles" },
      { label: "B", value: "24 tiles" },
      { label: "C", value: "12 tiles" },
      { label: "D", value: "36 tiles" },
    ],
    correctAnswer: "B",
    explanation:
      "6×8 = 48 squares. Each domino covers 2, so you need 48 ÷ 2 = 24 dominoes.",
    hint: "Total squares ÷ 2 = tiles needed.",
  },
  {
    id: 7,
    question: "If both m and n are odd, what can you say about m × n?",
    options: [
      { label: "A", value: "m × n is always even" },
      { label: "B", value: "m × n is always odd" },
      { label: "C", value: "Could be either" },
      { label: "D", value: "Always a prime number" },
    ],
    correctAnswer: "B",
    explanation:
      "Odd × odd is always odd. E.g. 3×5=15, 7×9=63. So odd-by-odd grids always have odd square counts.",
    hint: "Multiply a few pairs of odd numbers.",
  },
  {
    id: 8,
    question: "On a checkerboard, every 2×1 domino covers:",
    options: [
      { label: "A", value: "One black and one white square" },
      { label: "B", value: "Two same-colour squares" },
      { label: "C", value: "Only black squares" },
      { label: "D", value: "Random colours" },
    ],
    correctAnswer: "A",
    explanation:
      "Adjacent squares on a checkerboard have different colours. A domino always covers two adjacent squares, hence one black and one white.",
    hint: "Visualise placing a domino on a checkerboard.",
  },
];

// ═══════════ LEARN STEPS ═══════════
const DEFAULT_LEARN_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Tiling a 4×6 Grid",
    description:
      "24 squares (even). Each 2×1 domino covers 2 squares. You need 12 tiles. Click cells to place tiles.",
    type: "intro",
    mode: "learn",
    data: { m: 4, n: 6, tileable: true, parity: "even" },
  },
  {
    id: 2,
    title: "Tiling a 4×7 Grid",
    description:
      "28 squares (even). One dimension is even — try column-by-column!",
    type: "explanation",
    mode: "learn",
    data: { m: 4, n: 7, tileable: true, parity: "even" },
  },
  {
    id: 3,
    title: "Can You Tile 5×7?",
    description:
      "35 squares (odd). You'll always have 1 left! Odd total = impossible.",
    type: "explanation",
    mode: "learn",
    data: { m: 5, n: 7, tileable: false, parity: "odd" },
  },
  {
    id: 4,
    title: "Another Odd: 3×5",
    description: "15 squares (odd). Both odd → product odd → impossible.",
    type: "explanation",
    mode: "learn",
    data: { m: 3, n: 5, tileable: false, parity: "odd" },
  },
  {
    id: 5,
    title: "Remove a Square",
    description:
      "Remove 1 from 5×7 → 34 squares (even). Even ≠ always sufficient!",
    type: "explanation",
    mode: "learn",
    data: {
      m: 5,
      n: 7,
      tileable: "maybe",
      parity: "even",
      removeEnabled: true,
    },
  },
];

const DOMINO_PALETTE = [
  "#4A4DC9",
  "#7B5EA7",
  "#533086",
  "#6366f1",
  "#8b5cf6",
  "#FF7212",
  "#FC9145",
  "#06b6d4",
  "#14b8a6",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#10b981",
  "#f59e0b",
  "#0ea5e9",
];

// ═══════════ RESPONSIVE HOOK ═══════════
const useResponsive = () => {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 800,
  );
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { w, isMobile: w < 580, isTablet: w >= 580 && w < 960 };
};

// ═══════════ MAIN COMPONENT ═══════════
const GridTilingExplorer: React.FC<GridTilingExplorerProps> = ({
  props,
  setStepDetails,
}) => {
  const { w: screenW, isMobile, isTablet } = useResponsive();

  const config = useMemo(
    () => ({
      width: props?.width ?? 800,
      height: props?.height ?? 600,
      initialMode: (props?.initialMode ?? "learn") as ModeType,
      showModeSelector: props?.showModeSelector ?? true,
      enabledModes: (props?.enabledModes ?? ["learn", "practice"]) as ModeType[],
      showNavigation: props?.showNavigation ?? true,
      showStepIndicator: props?.showStepIndicator ?? true,
      filterSteps: props?.filterSteps ?? null,
    }),
    [props],
  );
  const additionalProps = props?.additionalProps || {};

  // ══ STATE ══
  const [selectedMode, setSelectedMode] = useState<ModeType>(
    config.initialMode,
  );
  const [stepIdx, setStepIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [placedDominoes, setPlacedDominoes] = useState<PlacedDomino[]>([]);
  const [removedSquares, setRemovedSquares] = useState<
    { row: number; col: number }[]
  >([]);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "horizontal",
  );
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(
    null,
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [domCtr, setDomCtr] = useState(0);
  const [showPRule, setShowPRule] = useState(false);
  const [showChecker, setShowChecker] = useState(false);
  const [mcqIdx, setMcqIdx] = useState(0);
  const [selAns, setSelAns] = useState<string | null>(null);
  const [showRes, setShowRes] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const learnSteps = useMemo(() => {
    const all =
      props.steps?.filter((s) => s.mode === "learn") || DEFAULT_LEARN_STEPS;
    return config.filterSteps?.length
      ? all.filter((s) => config.filterSteps!.includes(s.id))
      : all;
  }, [props.steps, config.filterSteps]);

  const curStep = learnSteps[stepIdx] || learnSteps[0];
  const sd = curStep?.data || {};
  const gM: number = sd.m || 4,
    gN: number = sd.n || 6;
  const totSq = gM * gN - removedSquares.length;
  const tilesN = totSq / 2;
  const isEven = totSq % 2 === 0;
  const remEn = sd.removeEnabled || false;
  const curMCQ = MCQ_QUESTIONS[mcqIdx];

  // ══ KEYFRAMES ══
  useEffect(() => {
    const id = "sing-tiling-kf";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInDown{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{0%{transform:scale(0);opacity:0}70%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
@keyframes slideR{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@keyframes celebrate{0%{transform:scale(1) rotate(0)}25%{transform:scale(1.06) rotate(-2deg)}50%{transform:scale(1) rotate(2deg)}100%{transform:scale(1) rotate(0)}}
@keyframes tileSnap{0%{transform:scale(1.2);opacity:.5}60%{transform:scale(.97)}100%{transform:scale(1);opacity:1}}
@keyframes warnPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,114,18,.15)}50%{box-shadow:0 0 0 6px rgba(255,114,18,.08)}}
@keyframes correctPop{0%{transform:scale(.92);opacity:0}50%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
@keyframes wrongShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
@keyframes scoreUp{0%{transform:scale(1)}50%{transform:scale(1.25)}100%{transform:scale(1)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
`;
    document.head.appendChild(s);
    return () => {
      const e = document.getElementById(id);
      if (e) document.head.removeChild(e);
    };
  }, []);

  // ══ RESETS ══
  useEffect(() => {
    setPlacedDominoes([]);
    setRemovedSquares([]);
    setShowSuccess(false);
    setDomCtr(0);
    setShowChecker(false);
    setAnimKey((k) => k + 1);
    setShowPRule((curStep?.id ?? 0) >= 3);
  }, [stepIdx, selectedMode]);
  useEffect(() => {
    if (selectedMode === "practice") {
      setMcqIdx(0);
      setSelAns(null);
      setShowRes(false);
      setShowHint(false);
      setScore(0);
      setAnswered(0);
      setQuizDone(false);
    }
  }, [selectedMode]);
  useEffect(() => {
    if (placedDominoes.length * 2 === totSq && totSq > 0 && isEven) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3500);
    }
  }, [placedDominoes, totSq, isEven]);
  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: selectedMode === "learn" ? stepIdx + 1 : mcqIdx + 1,
        totalSteps:
          selectedMode === "learn" ? learnSteps.length : MCQ_QUESTIONS.length,
        isPaused: true,
        currentMode: selectedMode,
      });
  }, [stepIdx, mcqIdx, selectedMode, learnSteps.length, setStepDetails]);

  // ══ GRID ══
  const grid = useMemo(() => {
    const g: any[][] = [];
    for (let r = 0; r < gM; r++) {
      const row: any[] = [];
      for (let c = 0; c < gN; c++) {
        const rem = removedSquares.some((q) => q.row === r && q.col === c);
        const dom = placedDominoes.find((d) =>
          d.orientation === "horizontal"
            ? d.row === r && (d.col === c || d.col + 1 === c)
            : d.col === c && (d.row === r || d.row + 1 === r),
        );
        row.push({
          row: r,
          col: c,
          removed: rem,
          occupied: !!dom,
          dominoId: dom?.id || null,
          color: dom
            ? DOMINO_PALETTE[
                parseInt(dom.id.replace("d", "")) % DOMINO_PALETTE.length
              ]
            : null,
        });
      }
      g.push(row);
    }
    return g;
  }, [gM, gN, removedSquares, placedDominoes]);

  // ══ RESPONSIVE SIZING ══
  const pad = isMobile ? 12 : isTablet ? 16 : 24;
  const sideW = isMobile ? 0 : isTablet ? 185 : 225;
  const gapW = isMobile ? 0 : 14;
  const maxGW = Math.min(config.width, screenW) - pad * 2 - sideW - gapW;
  const maxGH = isMobile
    ? Math.min(280, screenW * 0.65)
    : isTablet
      ? 320
      : config.height * 0.46;
  const cell = Math.max(
    18,
    Math.min(
      Math.floor((maxGW - gN) / gN),
      Math.floor((maxGH - gM) / gM),
      isMobile ? 36 : isTablet ? 42 : 48,
    ),
  );

  // ══ PLACEMENT ══
  const canPlace = useCallback(
    (r: number, c: number, o: "horizontal" | "vertical") => {
      const cs =
        o === "horizontal"
          ? [
              { r, c },
              { r, c: c + 1 },
            ]
          : [
              { r, c },
              { r: r + 1, c },
            ];
      for (const x of cs) {
        if (x.r < 0 || x.r >= gM || x.c < 0 || x.c >= gN) return false;
        if (removedSquares.some((q) => q.row === x.r && q.col === x.c))
          return false;
        if (
          placedDominoes.some((d) =>
            d.orientation === "horizontal"
              ? d.row === x.r && (d.col === x.c || d.col + 1 === x.c)
              : d.col === x.c && (d.row === x.r || d.row + 1 === x.r),
          )
        )
          return false;
      }
      return true;
    },
    [gM, gN, removedSquares, placedDominoes],
  );

  const cellClick = useCallback(
    (r: number, c: number) => {
      if (grid[r]?.[c]?.removed) return;
      if (grid[r]?.[c]?.occupied && grid[r][c].dominoId) {
        setPlacedDominoes((p) => p.filter((d) => d.id !== grid[r][c].dominoId));
        return;
      }
      if (remEn && placedDominoes.length === 0) {
        if (removedSquares.some((q) => q.row === r && q.col === c))
          setRemovedSquares((p) =>
            p.filter((q) => !(q.row === r && q.col === c)),
          );
        else if (removedSquares.length < 1)
          setRemovedSquares([{ row: r, col: c }]);
        return;
      }
      let o = orientation;
      if (canPlace(r, c, o)) {
        setPlacedDominoes((p) => [
          ...p,
          { id: `d${domCtr}`, row: r, col: c, orientation: o },
        ]);
        setDomCtr((p) => p + 1);
      } else {
        const a: any = o === "horizontal" ? "vertical" : "horizontal";
        if (canPlace(r, c, a)) {
          setPlacedDominoes((p) => [
            ...p,
            { id: `d${domCtr}`, row: r, col: c, orientation: a },
          ]);
          setDomCtr((p) => p + 1);
        }
      }
    },
    [
      grid,
      remEn,
      removedSquares,
      placedDominoes,
      orientation,
      canPlace,
      domCtr,
    ],
  );

  const reset = useCallback(() => {
    setPlacedDominoes([]);
    setRemovedSquares([]);
    setShowSuccess(false);
    setDomCtr(0);
    setShowChecker(false);
    setAnimKey((k) => k + 1);
  }, []);
  const goStep = useCallback(
    (d: "next" | "prev") => {
      if (d === "next" && stepIdx < learnSteps.length - 1)
        setStepIdx((i) => i + 1);
      else if (d === "prev" && stepIdx > 0) setStepIdx((i) => i - 1);
    },
    [stepIdx, learnSteps.length],
  );
  const modeChange = useCallback((m: ModeType) => {
    setSelectedMode(m);
    setStepIdx(0);
    setPlacedDominoes([]);
    setRemovedSquares([]);
    setDomCtr(0);
  }, []);

  // ══ MCQ ══
  const mcqAns = useCallback(
    (l: string) => {
      if (showRes) return;
      setSelAns(l);
      setShowRes(true);
      setAnswered((p) => p + 1);
      if (l === curMCQ.correctAnswer) setScore((p) => p + 1);
    },
    [showRes, curMCQ],
  );
  const mcqNext = useCallback(() => {
    if (mcqIdx < MCQ_QUESTIONS.length - 1) {
      setMcqIdx((i) => i + 1);
      setSelAns(null);
      setShowRes(false);
      setShowHint(false);
    } else setQuizDone(true);
  }, [mcqIdx]);
  const mcqReset = useCallback(() => {
    setMcqIdx(0);
    setSelAns(null);
    setShowRes(false);
    setShowHint(false);
    setScore(0);
    setAnswered(0);
    setQuizDone(false);
  }, []);

  // ══ PARITY ══
  const pInfo = (() => {
    const sk = `step${curStep?.id || 1}`;
    const pd = additionalProps.parityIndicator?.[sk];
    if (pd)
      return {
        status: pd.parityStatus || (isEven ? "EVEN" : "ODD"),
        color:
          pd.colour === "green"
            ? DS.success
            : pd.colour === "red"
              ? DS.error
              : pd.colour === "orange"
                ? DS.accent
                : isEven
                  ? DS.success
                  : DS.error,
        label: pd.label || "",
      };
    if (!isEven)
      return {
        status: "ODD — impossible!",
        color: DS.error,
        label: `${totSq}/2 = ${totSq / 2} — not whole!`,
      };
    if (sd.tileable === "maybe")
      return {
        status: "EVEN — shape matters!",
        color: DS.accent,
        label: `${totSq}/2 = ${tilesN}. Even ≠ sufficient.`,
      };
    return {
      status: "EVEN — tileable",
      color: DS.success,
      label: `${totSq}/2 = ${tilesN} tiles.`,
    };
  })();

  const hovPrev = ((): any[] => {
    if (!hovered || (remEn && placedDominoes.length === 0)) return [];
    const { row: r, col: c } = hovered;
    if (canPlace(r, c, orientation))
      return orientation === "horizontal"
        ? [
            { row: r, col: c },
            { row: r, col: c + 1 },
          ]
        : [
            { row: r, col: c },
            { row: r + 1, col: c },
          ];
    const a: any = orientation === "horizontal" ? "vertical" : "horizontal";
    if (canPlace(r, c, a))
      return a === "horizontal"
        ? [
            { row: r, col: c },
            { row: r, col: c + 1 },
          ]
        : [
            { row: r, col: c },
            { row: r + 1, col: c },
          ];
    return [];
  })();

  const pRuleText = (() => {
    const sk = `step${curStep?.id || 1}`;
    const rd = additionalProps.parityRuleDisplay?.[sk];
    if (rd?.showRule && rd.ruleText) return rd.ruleText;
    if (showPRule || (curStep?.id ?? 0) >= 3) {
      if (curStep?.id === 5)
        return "Even total is necessary but not sufficient. The shape also determines tileability.";
      return "Parity Rule: An m × n grid is tileable with 2×1 tiles when at least one of m, n is even. If both are odd, tiling is impossible.";
    }
    return null;
  })();

  // ═══════════════════════════════════════════════════════════════
  // SHARED BUTTON COMPONENT (Singularity design)
  // ═══════════════════════════════════════════════════════════════
  const SBtn = ({
    children,
    onClick,
    variant = "contained",
    color = "primary",
    disabled = false,
    full = false,
    small = false,
    style: sx = {},
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "contained" | "outlined" | "text";
    color?: "primary" | "accent" | "neutral";
    disabled?: boolean;
    full?: boolean;
    small?: boolean;
    style?: React.CSSProperties;
  }) => {
    const [hov, setHov] = useState(false);
    const [press, setPress] = useState(false);
    const base =
      color === "primary"
        ? DS.primary
        : color === "accent"
          ? DS.accent
          : DS.textDark;
    const bg =
      variant === "contained"
        ? disabled
          ? DS.borderLight
          : hov
            ? `${base}dd`
            : base
        : "transparent";
    const border =
      variant === "outlined"
        ? `2px solid ${disabled ? DS.borderLight : base}`
        : "2px solid transparent";
    const fg =
      variant === "contained"
        ? disabled
          ? DS.textLight
          : "#fff"
        : disabled
          ? DS.textLight
          : base;
    return (
      <button
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => {
          setHov(false);
          setPress(false);
        }}
        onMouseDown={() => setPress(true)}
        onMouseUp={() => setPress(false)}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        style={{
          padding: small ? (isMobile ? "6px 12px" : "8px 16px") : "10px 24px",
          height: small ? "auto" : isMobile ? 36 : 40,
          borderRadius: DS.radius.pill,
          border,
          background: bg,
          color: fg,
          fontFamily: DS.font,
          fontSize: small ? (isMobile ? 10 : 11) : isMobile ? 12 : 13,
          fontWeight: 600,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
          transform: press
            ? "scale(0.96)"
            : hov && !disabled
              ? "scale(1.02)"
              : "scale(1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          width: full ? "100%" : "auto",
          opacity: disabled ? 0.5 : 1,
          boxShadow:
            variant === "contained" && !disabled && hov
              ? `0 4px 12px ${base}30`
              : "none",
          letterSpacing: 0.2,
          ...sx,
        }}
      >
        {children}
      </button>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // LEARN MODE
  // ═══════════════════════════════════════════════════════════════
  const renderLearn = () => (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        padding: pad,
        gap: isMobile ? 12 : gapW,
        alignItems: isMobile ? "stretch" : "flex-start",
      }}
    >
      {/* GRID */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeInUp 0.4s ease-out",
          }}
        >
          <span
            style={{
              fontSize: isMobile ? 17 : 22,
              fontWeight: 800,
              color: DS.primary,
              fontFamily: DS.font,
            }}
          >
            {gM}×{gN}
          </span>
          <span
            style={{
              fontSize: isMobile ? 10 : 12,
              color: DS.textMid,
              fontWeight: 500,
            }}
          >
            = {gM * gN} sq
            {removedSquares.length > 0
              ? ` − ${removedSquares.length} = ${totSq}`
              : ""}
          </span>
        </div>
        <div
          key={animKey}
          style={{
            display: "inline-grid",
            gridTemplateColumns: `repeat(${gN},${cell}px)`,
            gridTemplateRows: `repeat(${gM},${cell}px)`,
            gap: 2,
            background: DS.borderLight,
            borderRadius: DS.radius.md,
            padding: 2,
            boxShadow: DS.shadow.md,
            animation:
              !isEven && !remEn ? "warnPulse 2s ease-in-out infinite" : "none",
          }}
        >
          {grid.flat().map((cl: any, idx: number) => {
            const isHov = hovPrev.some(
              (h: any) => h.row === cl.row && h.col === cl.col,
            );
            const chkD = (cl.row + cl.col) % 2 === 1;
            const dom = cl.dominoId
              ? placedDominoes.find((d) => d.id === cl.dominoId)
              : null;
            const isF = dom && dom.row === cl.row && dom.col === cl.col;
            let br = "3px";
            if (dom) {
              if (dom.orientation === "horizontal")
                br =
                  cl.col === dom.col
                    ? `${DS.radius.sm}px 0 0 ${DS.radius.sm}px`
                    : `0 ${DS.radius.sm}px ${DS.radius.sm}px 0`;
              else
                br =
                  cl.row === dom.row
                    ? `${DS.radius.sm}px ${DS.radius.sm}px 0 0`
                    : `0 0 ${DS.radius.sm}px ${DS.radius.sm}px`;
            }
            return (
              <div
                key={`${cl.row}-${cl.col}`}
                onClick={() => cellClick(cl.row, cl.col)}
                onMouseEnter={() =>
                  !cl.removed && setHovered({ row: cl.row, col: cl.col })
                }
                onMouseLeave={() => setHovered(null)}
                style={{
                  width: cell,
                  height: cell,
                  background: cl.removed
                    ? DS.bgLight
                    : cl.occupied
                      ? cl.color || DS.primary
                      : isHov
                        ? DS.lavenderLight
                        : showChecker
                          ? chkD
                            ? DS.lavender
                            : DS.bgWhite
                          : DS.bgWhite,
                  cursor: cl.removed ? "default" : "pointer",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: br,
                  animation: cl.occupied
                    ? "tileSnap 0.25s ease-out"
                    : `popIn 0.2s ease-out ${idx * 5}ms both`,
                  border: cl.removed
                    ? `1.5px dashed ${DS.borderMid}`
                    : isHov
                      ? `2px solid ${DS.primary}`
                      : "1px solid transparent",
                  opacity: cl.removed ? 0.35 : 1,
                  boxShadow: cl.occupied
                    ? "inset 0 2px 6px rgba(0,0,0,0.18)"
                    : "none",
                }}
              >
                {cl.removed && <X size={cell * 0.28} color={DS.borderMid} />}
                {cl.occupied && isF && (
                  <span
                    style={{
                      color: "rgba(255,255,255,.5)",
                      fontSize: cell * 0.18,
                      fontWeight: 700,
                    }}
                  >
                    ×
                  </span>
                )}
                {showChecker && !cl.occupied && !cl.removed && (
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: cell * 0.2,
                      color: chkD ? "#9393c4" : "#d4d4ea",
                    }}
                  >
                    {chkD ? "B" : "W"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeInUp 0.3s ease-out 0.1s both",
          }}
        >
          <span
            style={{
              padding: "5px 12px",
              borderRadius: DS.radius.pill,
              background: DS.lavenderLight,
              fontSize: isMobile ? 10 : 11,
              fontWeight: 600,
              color: DS.primary,
            }}
          >
            🧩 {placedDominoes.length}/{isEven ? tilesN : "?"}
          </span>
          <span
            style={{
              padding: "5px 12px",
              borderRadius: DS.radius.pill,
              background:
                pInfo.color === DS.error
                  ? DS.errorBg
                  : pInfo.color === DS.accent
                    ? DS.peach
                    : DS.successBg,
              fontSize: isMobile ? 10 : 11,
              fontWeight: 600,
              color: pInfo.color,
            }}
          >
            Left: {totSq - placedDominoes.length * 2}
          </span>
        </div>
      </div>

      {/* SIDE */}
      <div
        style={{
          width: isMobile ? "100%" : sideW,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flexShrink: 0,
        }}
      >
        {/* Orientation */}
        <div
          style={{
            background: DS.bgWhite,
            borderRadius: DS.radius.md,
            padding: isMobile ? 10 : 12,
            border: `1px solid ${DS.borderLight}`,
            boxShadow: DS.shadow.sm,
            animation: "slideR 0.35s ease-out 0.05s both",
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: DS.textMid,
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 1.2,
              fontFamily: DS.font,
            }}
          >
            Tile Orientation
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["horizontal", "vertical"] as const).map((o) => (
              <button
                key={o}
                onClick={() => setOrientation(o)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: DS.radius.sm,
                  border:
                    orientation === o
                      ? `2px solid ${DS.primary}`
                      : `2px solid ${DS.borderLight}`,
                  background:
                    orientation === o ? DS.lavenderLight : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  transition: "all 0.25s ease",
                  fontFamily: DS.font,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 2,
                    ...(o === "vertical"
                      ? { flexDirection: "column" as const }
                      : {}),
                  }}
                >
                  <div
                    style={{
                      width: o === "horizontal" ? 16 : 12,
                      height: o === "horizontal" ? 12 : 12,
                      borderRadius: 3,
                      background: DS.primary,
                    }}
                  />
                  <div
                    style={{
                      width: o === "horizontal" ? 16 : 12,
                      height: o === "horizontal" ? 12 : 12,
                      borderRadius: 3,
                      background: DS.lavender,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 600,
                    color: orientation === o ? DS.primary : DS.textMid,
                  }}
                >
                  {o === "horizontal" ? "Horiz" : "Vert"}
                </span>
              </button>
            ))}
          </div>
        </div>
        {/* Parity */}
        <div
          style={{
            background: DS.bgWhite,
            borderRadius: DS.radius.md,
            padding: isMobile ? 10 : 12,
            border: `1px solid ${DS.borderLight}`,
            boxShadow: DS.shadow.sm,
            animation: "slideR 0.35s ease-out 0.1s both",
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: DS.textMid,
              marginBottom: 5,
              textTransform: "uppercase",
              letterSpacing: 1.2,
              fontFamily: DS.font,
            }}
          >
            Parity Check
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: DS.radius.pill,
              background:
                pInfo.color === DS.error
                  ? DS.errorBg
                  : pInfo.color === DS.accent
                    ? DS.peach
                    : DS.successBg,
              marginBottom: 5,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: pInfo.color,
                animation: "pulse 2s infinite",
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: pInfo.color,
                fontFamily: DS.font,
              }}
            >
              {totSq} sq → {isEven ? "Even" : "Odd"}
            </span>
          </div>
          <div
            style={{
              fontSize: 9,
              color: DS.textMid,
              lineHeight: 1.5,
              fontFamily: DS.font,
            }}
          >
            {pInfo.label}
          </div>
        </div>
        {(curStep?.id ?? 0) >= 3 && (
          <SBtn
            onClick={() => setShowChecker(!showChecker)}
            variant={showChecker ? "contained" : "outlined"}
            color="primary"
            small
            style={{
              animation: "slideR 0.35s ease-out 0.15s both",
              width: "100%",
            }}
          >
            ♟ Checkerboard
          </SBtn>
        )}
        {remEn && (
          <div
            style={{
              background: DS.peach,
              borderRadius: DS.radius.md,
              padding: isMobile ? 8 : 10,
              border: `1px solid ${DS.warningBorder}40`,
              animation: "slideR 0.35s ease-out 0.2s both",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: DS.accent,
                marginBottom: 2,
                fontFamily: DS.font,
              }}
            >
              🔲 Remove a Square
            </div>
            <div
              style={{
                fontSize: 9,
                color: DS.textMid,
                lineHeight: 1.4,
                fontFamily: DS.font,
              }}
            >
              {removedSquares.length === 0
                ? "Click any cell to remove, then tile."
                : `1 removed. ${totSq} left.`}
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: 6 }}>
          <SBtn
            onClick={reset}
            variant="outlined"
            color="neutral"
            small
            style={{ flex: 1 }}
          >
            <RotateCcw size={12} /> Reset
          </SBtn>
          <SBtn
            onClick={() =>
              setOrientation((o) =>
                o === "horizontal" ? "vertical" : "horizontal",
              )
            }
            variant="outlined"
            color="primary"
            small
            style={{ flex: 1 }}
          >
            <RotateCw size={12} /> Rotate
          </SBtn>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // PRACTICE MCQ
  // ═══════════════════════════════════════════════════════════════
  const renderMCQ = () => {
    if (quizDone) {
      const pct = Math.round((score / MCQ_QUESTIONS.length) * 100);
      const em = pct >= 80 ? "🏆" : pct >= 60 ? "👍" : pct >= 40 ? "📚" : "💪";
      return (
        <div
          style={{
            padding: `${pad * 2}px ${pad}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            animation: "fadeInUp 0.5s ease-out",
          }}
        >
          <div style={{ fontSize: 52, animation: "celebrate 0.8s ease-out" }}>
            {em}
          </div>
          <div
            style={{
              fontSize: isMobile ? 20 : 26,
              fontWeight: 800,
              color: DS.textDark,
              fontFamily: DS.font,
              textAlign: "center",
            }}
          >
            Quiz Complete!
          </div>
          <div
            style={{
              fontSize: isMobile ? 16 : 20,
              fontWeight: 700,
              color: pct >= 60 ? DS.success : DS.accent,
              padding: "10px 28px",
              borderRadius: DS.radius.pill,
              background: pct >= 60 ? DS.successBg : DS.peach,
              border: `2px solid ${pct >= 60 ? DS.success : DS.accent}`,
              animation: "scoreUp 0.5s ease-out 0.2s both",
              fontFamily: DS.font,
            }}
          >
            {score}/{MCQ_QUESTIONS.length} ({pct}%)
          </div>
          <div
            style={{
              fontSize: isMobile ? 11 : 13,
              color: DS.textMid,
              textAlign: "center",
              maxWidth: 360,
              lineHeight: 1.7,
              fontFamily: DS.font,
            }}
          >
            {pct >= 80
              ? "Excellent! You've mastered the parity rule!"
              : pct >= 60
                ? "Good work! Review the ones you missed."
                : "Keep practising! Revisit Learn mode."}
          </div>
          <SBtn onClick={mcqReset} color="primary">
            Try Again
          </SBtn>
        </div>
      );
    }
    return (
      <div style={{ padding: pad, animation: "fadeInUp 0.4s ease-out" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: isMobile ? 11 : 13,
              fontWeight: 700,
              color: DS.primary,
              fontFamily: DS.font,
            }}
          >
            Question {mcqIdx + 1}/{MCQ_QUESTIONS.length}
          </span>
          <span
            style={{
              fontSize: isMobile ? 11 : 13,
              fontWeight: 600,
              color: DS.success,
              fontFamily: DS.font,
            }}
          >
            Score: {score}/{answered}
          </span>
        </div>
        <div
          style={{
            height: 5,
            background: DS.lavenderLight,
            borderRadius: 3,
            marginBottom: 16,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 3,
              background: `linear-gradient(90deg,${DS.gradientStart},${DS.gradientEnd})`,
              width: `${((mcqIdx + 1) / MCQ_QUESTIONS.length) * 100}%`,
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div
          style={{
            background: DS.bgWhite,
            borderRadius: DS.radius.lg,
            padding: isMobile ? 14 : 20,
            border: `1px solid ${DS.borderLight}`,
            marginBottom: 14,
            boxShadow: DS.shadow.sm,
          }}
        >
          <div
            style={{
              fontSize: isMobile ? 13 : 15,
              fontWeight: 600,
              color: DS.textDark,
              lineHeight: 1.7,
              fontFamily: DS.font,
            }}
          >
            {curMCQ.question}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 14,
          }}
        >
          {curMCQ.options.map((opt) => {
            const isSel = selAns === opt.label;
            const isCor = opt.label === curMCQ.correctAnswer;
            const showG = showRes && isCor;
            const showR = showRes && isSel && !isCor;
            let oBg = DS.bgWhite,
              oB = DS.borderLight,
              oC = DS.textDark,
              lBg = DS.lavenderLight,
              lC = DS.primary,
              an = "";
            if (showG) {
              oBg = DS.successBg;
              oB = DS.success;
              oC = "#1a6b3c";
              lBg = DS.success;
              lC = "#fff";
              an = "correctPop 0.4s ease-out";
            } else if (showR) {
              oBg = DS.errorBg;
              oB = DS.error;
              oC = "#8b1a1a";
              lBg = DS.error;
              lC = "#fff";
              an = "wrongShake 0.5s ease-out";
            } else if (isSel && !showRes) {
              oBg = DS.lavenderLight;
              oB = DS.primary;
            }
            return (
              <button
                key={opt.label}
                onClick={() => mcqAns(opt.label)}
                disabled={showRes}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? 10 : 14,
                  padding: isMobile ? "10px 12px" : "12px 16px",
                  borderRadius: DS.radius.md,
                  border: `2px solid ${oB}`,
                  background: oBg,
                  cursor: showRes ? "default" : "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: DS.font,
                  textAlign: "left" as const,
                  width: "100%",
                  animation: an || undefined,
                  opacity: showRes && !isCor && !isSel ? 0.4 : 1,
                  boxShadow: DS.shadow.sm,
                }}
              >
                <div
                  style={{
                    width: isMobile ? 28 : 32,
                    height: isMobile ? 28 : 32,
                    borderRadius: DS.radius.sm,
                    background: lBg,
                    color: lC,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: isMobile ? 12 : 14,
                    flexShrink: 0,
                    transition: "all 0.3s ease",
                    fontFamily: DS.font,
                  }}
                >
                  {showG ? (
                    <Check size={15} />
                  ) : showR ? (
                    <X size={15} />
                  ) : (
                    opt.label
                  )}
                </div>
                <span
                  style={{
                    fontSize: isMobile ? 11 : 13,
                    fontWeight: 500,
                    color: oC,
                    lineHeight: 1.5,
                    fontFamily: DS.font,
                  }}
                >
                  {opt.value}
                </span>
              </button>
            );
          })}
        </div>
        {!showRes && !showHint && (
          <SBtn
            onClick={() => setShowHint(true)}
            variant="outlined"
            color="accent"
            small
            style={{ marginBottom: 8 }}
          >
            💡 Show Hint
          </SBtn>
        )}
        {showHint && !showRes && curMCQ.hint && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: DS.radius.md,
              background: DS.peach,
              border: `1px solid ${DS.warningBorder}30`,
              fontSize: isMobile ? 10 : 12,
              color: DS.textDark,
              lineHeight: 1.6,
              marginBottom: 8,
              animation: "fadeInUp 0.3s ease-out",
              fontFamily: DS.font,
            }}
          >
            💡 {curMCQ.hint}
          </div>
        )}
        {showRes && (
          <div
            style={{
              padding: isMobile ? "10px 12px" : "14px 18px",
              borderRadius: DS.radius.md,
              background:
                selAns === curMCQ.correctAnswer ? DS.successBg : DS.errorBg,
              border: `1px solid ${selAns === curMCQ.correctAnswer ? DS.success : DS.error}25`,
              animation: "fadeInUp 0.3s ease-out",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: isMobile ? 12 : 13,
                fontWeight: 700,
                color: selAns === curMCQ.correctAnswer ? DS.success : DS.error,
                marginBottom: 4,
                fontFamily: DS.font,
              }}
            >
              {selAns === curMCQ.correctAnswer
                ? "✅ Correct!"
                : "❌ Not quite!"}
            </div>
            <div
              style={{
                fontSize: isMobile ? 10 : 12,
                color: DS.textDark,
                lineHeight: 1.7,
                fontFamily: DS.font,
              }}
            >
              {curMCQ.explanation}
            </div>
          </div>
        )}
        {showRes && (
          <SBtn onClick={mcqNext} color="primary" full>
            {mcqIdx < MCQ_QUESTIONS.length - 1 ? (
              <>
                Next Question <ChevronRight size={16} />
              </>
            ) : (
              <>
                <Trophy size={16} /> See Results
              </>
            )}
          </SBtn>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div
      style={{
        width: "100%",
        maxWidth: config.width,
        background: DS.bgLight,
        borderRadius: isMobile ? DS.radius.md : DS.radius.lg,
        overflow: "hidden",
        fontFamily: DS.font,
        color: DS.textDark,
        position: "relative",
        boxShadow: DS.shadow.lg,
        margin: "0 auto",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: `linear-gradient(135deg,${DS.gradientStart},${DS.gradientEnd})`,
          backgroundSize: "200% 200%",
          animation: "gradientShift 8s ease infinite",
          padding: isMobile ? "12px 14px" : "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: isMobile ? 30 : 38,
              height: isMobile ? 30 : 38,
              borderRadius: DS.radius.sm,
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width={isMobile ? 15 : 19}
              height={isMobile ? 15 : 19}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </div>
          <div>
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: isMobile ? 13 : 16,
                lineHeight: 1.2,
                fontFamily: DS.font,
              }}
            >
              Grid Tiling Explorer
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: isMobile ? 9 : 11,
                fontWeight: 500,
                fontFamily: DS.font,
              }}
            >
              2×1 Domino Tiling & Parity Rule
            </div>
          </div>
        </div>
        {config.showModeSelector && (
          <div
            style={{
              display: "flex",
              gap: 3,
              background: "rgba(255,255,255,0.12)",
              borderRadius: DS.radius.pill,
              padding: 3,
              backdropFilter: "blur(4px)",
            }}
          >
            {config.enabledModes.map((m) => (
              <button
                key={m}
                onClick={() => modeChange(m)}
                style={{
                  padding: isMobile ? "5px 12px" : "6px 16px",
                  borderRadius: DS.radius.pill,
                  border: "none",
                  cursor: "pointer",
                  fontSize: isMobile ? 10 : 12,
                  fontWeight: 600,
                  fontFamily: DS.font,
                  transition: "all 0.3s ease",
                  background: selectedMode === m ? "#fff" : "transparent",
                  color:
                    selectedMode === m ? DS.primary : "rgba(255,255,255,0.85)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  boxShadow:
                    selectedMode === m ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {m === "learn" ? (
                  <>
                    <BookOpen size={12} /> Learn
                  </>
                ) : (
                  <>
                    <Target size={12} /> Practice
                  </>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* STEP INFO (Learn) */}
      {selectedMode === "learn" && (
        <div
          style={{
            padding: `${isMobile ? 10 : 12}px ${pad}px`,
            background: DS.bgWhite,
            borderBottom: `1px solid ${DS.borderLight}`,
            animation: "fadeInDown 0.3s ease-out",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: isMobile ? 13 : 15,
                  fontWeight: 700,
                  marginBottom: 3,
                  color: DS.textDark,
                  fontFamily: DS.font,
                }}
              >
                Step {stepIdx + 1}: {curStep?.title}
              </div>
              <div
                style={{
                  fontSize: isMobile ? 10 : 12,
                  color: DS.textMid,
                  lineHeight: 1.6,
                  fontFamily: DS.font,
                }}
              >
                {curStep?.description}
              </div>
            </div>
            <div
              style={{
                padding: "5px 14px",
                borderRadius: DS.radius.pill,
                background:
                  pInfo.color === DS.error
                    ? DS.errorBg
                    : pInfo.color === DS.accent
                      ? DS.peach
                      : DS.successBg,
                border: `2px solid ${pInfo.color}`,
                color: pInfo.color,
                fontWeight: 700,
                fontSize: isMobile ? 9 : 11,
                whiteSpace: "nowrap",
                animation: "popIn 0.35s ease-out 0.1s both",
                flexShrink: 0,
                fontFamily: DS.font,
              }}
            >
              {pInfo.status}
            </div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      {selectedMode === "learn" ? renderLearn() : renderMCQ()}

      {/* PARITY RULE (Learn) */}
      {selectedMode === "learn" && pRuleText && (
        <div
          style={{
            margin: `0 ${pad}px 10px`,
            padding: isMobile ? "10px 12px" : "12px 18px",
            borderRadius: DS.radius.md,
            background: `linear-gradient(135deg,${DS.lavenderLight},${DS.peach}40)`,
            border: `1px solid ${DS.lavender}60`,
            animation: "fadeInUp 0.35s ease-out",
            boxShadow: DS.shadow.sm,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <span style={{ fontSize: 15, flexShrink: 0 }}>📐</span>
            <div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: DS.primary,
                  marginBottom: 2,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  fontFamily: DS.font,
                }}
              >
                Parity Rule
              </div>
              <div
                style={{
                  fontSize: isMobile ? 10 : 12,
                  color: DS.textDark,
                  lineHeight: 1.7,
                  fontWeight: 500,
                  fontFamily: DS.font,
                }}
              >
                {pRuleText}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAV (Learn) */}
      {selectedMode === "learn" &&
        config.showNavigation &&
        learnSteps.length > 1 && (
          <div
            style={{
              padding: `10px ${pad}px 14px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: `1px solid ${DS.borderLight}`,
              background: DS.bgWhite,
            }}
          >
            <SBtn
              onClick={() => goStep("prev")}
              variant="outlined"
              color="neutral"
              disabled={stepIdx === 0}
              small
            >
              <ChevronLeft size={14} />
              {!isMobile && " Prev"}
            </SBtn>
            {config.showStepIndicator && (
              <div style={{ display: "flex", gap: 5 }}>
                {learnSteps.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setStepIdx(i)}
                    style={{
                      width:
                        i === stepIdx ? (isMobile ? 18 : 24) : isMobile ? 6 : 8,
                      height: isMobile ? 6 : 8,
                      borderRadius: DS.radius.pill,
                      background:
                        i === stepIdx
                          ? `linear-gradient(90deg,${DS.gradientStart},${DS.gradientEnd})`
                          : `${DS.lavender}60`,
                      transition: "all .35s ease",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            )}
            <SBtn
              onClick={() => goStep("next")}
              color="primary"
              disabled={stepIdx === learnSteps.length - 1}
              small
            >
              {!isMobile && "Next "}
              <ChevronRight size={14} />
            </SBtn>
          </div>
        )}

      {/* SUCCESS */}
      {showSuccess && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(74,77,201,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(3px)",
            pointerEvents: "none",
            animation: "fadeInUp 0.3s ease-out",
          }}
        >
          <div
            style={{
              background: DS.bgWhite,
              borderRadius: DS.radius.lg,
              padding: isMobile ? "22px 28px" : "30px 44px",
              boxShadow: `0 24px 60px rgba(83,48,134,0.2)`,
              textAlign: "center",
              animation: "celebrate 0.6s ease-out",
              border: `2px solid ${DS.lavender}`,
            }}
          >
            <div style={{ fontSize: isMobile ? 40 : 50, marginBottom: 6 }}>
              🎉
            </div>
            <div
              style={{
                fontSize: isMobile ? 18 : 22,
                fontWeight: 800,
                color: DS.primary,
                marginBottom: 3,
                fontFamily: DS.font,
              }}
            >
              Perfect Tiling!
            </div>
            <div
              style={{
                fontSize: isMobile ? 11 : 13,
                color: DS.textMid,
                fontFamily: DS.font,
              }}
            >
              All {totSq} squares covered!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GridTilingExplorer;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
