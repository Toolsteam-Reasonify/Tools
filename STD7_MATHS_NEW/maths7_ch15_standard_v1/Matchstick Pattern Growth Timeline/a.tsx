// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START — Singularity Design System
// File: matchstick_pattern_tool.tsx
// ═══════════════════════════════════════════════════════════════════════════

// @ts-ignore - workspace may not include react typings
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
// @ts-ignore - workspace may not include lucide-react typings
import { Play, Pause, ChevronLeft, ChevronRight, BookOpen, Target, Zap, Star, CheckCircle, XCircle, Plus } from "lucide-react";

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  primary: "#4A4DC9",
  primaryDark: "#533086",
  accent: "#FF7212",
  accentSoft: "#FC9145",
  tintPrimary: "#C1C1EA",
  tintAccent: "#FFF3E4",
  gray900: "#1A1A2E",
  gray700: "#4E4E4E",
  gray400: "#CACACA",
  gray200: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",
  green: "#2ECC71",
  red: "#E74C3C",
  font: "'Poppins', 'Segoe UI', sans-serif",
  radius: {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 28,
    full: 999,
  },
  shadow: {
    sm: "0 2px 8px rgba(74,77,201,0.08)",
    md: "0 4px 20px rgba(74,77,201,0.12)",
    lg: "0 12px 40px rgba(74,77,201,0.16)",
    accent: "0 4px 16px rgba(255,114,18,0.25)",
  },
};

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "explore";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}
interface MCQOption {
  id: string;
  label: string;
}
interface StepDataInterface {
  id: number;
  title: string;
  description: string;
  type: "intro" | "explanation" | "practice" | "explore";
  mode: ModeType;
  data?: {
    visiblePositions?: number;
    slider?: boolean;
    question?: string;
    equation?: string;
    options?: MCQOption[];
    correctId?: string;
    explanation?: string;
  };
}
interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}
interface MatchstickAdditionalProps {
  maxPosition?: number;
  sticksPerUnit?: number;
  baseSticks?: number;
  showFormula?: boolean;
}
interface MatchstickPatternToolProps {
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
    additionalProps?: MatchstickAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== MATH DISPLAY COMPONENTS ====================

const MV: React.FC<{ children: React.ReactNode; s?: number; c?: string }> = ({
  children,
  s = 16,
  c,
}) => (
  <span
    style={{
      fontFamily: "'Times New Roman',Georgia,serif",
      fontSize: s,
      fontStyle: "italic",
      color: c || "inherit",
    }}
  >
    {children}
  </span>
);
const MN: React.FC<{
  children: React.ReactNode;
  s?: number;
  c?: string;
  b?: boolean;
}> = ({ children, s = 16, c, b = true }) => (
  <span
    style={{
      fontFamily: DS.font,
      fontSize: s,
      fontWeight: b ? 700 : 500,
      color: c || "inherit",
    }}
  >
    {children}
  </span>
);
const MO: React.FC<{ children: React.ReactNode; s?: number }> = ({
  children,
  s = 16,
}) => (
  <span
    style={{
      fontFamily: DS.font,
      fontSize: s,
      color: DS.gray400,
      margin: "0 3px",
    }}
  >
    {children}
  </span>
);
const MFrac: React.FC<{
  top: React.ReactNode;
  bot: React.ReactNode;
  s?: number;
}> = ({ top, bot, s = 15 }) => (
  <span
    style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: DS.font,
      fontSize: s,
      verticalAlign: "middle",
      lineHeight: 1.15,
      margin: "0 4px",
    }}
  >
    <span
      style={{ borderBottom: "1.5px solid currentColor", padding: "0 5px 2px" }}
    >
      {top}
    </span>
    <span style={{ padding: "2px 5px 0" }}>{bot}</span>
  </span>
);

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "The Triangle Pattern Begins",
    description:
      "At position 1, we build a single triangle using 3 matchsticks. This is the seed of our pattern!",
    type: "intro",
    mode: "learn",
    data: { visiblePositions: 1 },
  },
  {
    id: 2,
    title: "Growing the Pattern",
    description:
      "At position 2, we add another triangle sharing one side. Now we have 5 matchsticks total: 2×2 + 1 = 5.",
    type: "explanation",
    mode: "learn",
    data: { visiblePositions: 2 },
  },
  {
    id: 3,
    title: "Position 3 — See the Rule?",
    description:
      "Adding one more triangle gives us 7 matchsticks: 2×3 + 1 = 7. Each new triangle adds exactly 2 sticks!",
    type: "explanation",
    mode: "learn",
    data: { visiblePositions: 3 },
  },
  {
    id: 4,
    title: "Position 4 — The Pattern Holds",
    description:
      "At position 4, we have 9 matchsticks: 2×4 + 1 = 9. The formula 2n+1 works every time!",
    type: "explanation",
    mode: "learn",
    data: { visiblePositions: 4 },
  },
  {
    id: 5,
    title: "Position 5 — General Rule: 2n + 1",
    description:
      "At position 5: 2×5 + 1 = 11 matchsticks. For any position n, the count is always 2n + 1.",
    type: "explanation",
    mode: "learn",
    data: { visiblePositions: 5 },
  },
  {
    id: 10,
    title: "Question 1 of 5",
    type: "practice",
    mode: "practice",
    description:
      "How many matchsticks are needed at position 6 in the triangle pattern?",
    data: {
      question: "How many matchsticks are needed at position 6?",
      equation: "2n + 1, where n = 6",
      options: [
        { id: "a", label: "11" },
        { id: "b", label: "12" },
        { id: "c", label: "13" },
        { id: "d", label: "14" },
      ],
      correctId: "c",
      explanation: "Using the formula: 2 × 6 + 1 = 12 + 1 = 13 matchsticks.",
    },
  },
  {
    id: 11,
    title: "Question 2 of 5",
    type: "practice",
    mode: "practice",
    description:
      "Jasmine makes an arrangement using exactly 99 matchsticks. What is the position number?",
    data: {
      question: "If 2n + 1 = 99, what is n?",
      equation: "2n + 1 = 99",
      options: [
        { id: "a", label: "n = 48" },
        { id: "b", label: "n = 49" },
        { id: "c", label: "n = 50" },
        { id: "d", label: "n = 99" },
      ],
      correctId: "b",
      explanation: "2n + 1 = 99 → 2n = 98 → n = 49. Position 49.",
    },
  },
  {
    id: 12,
    title: "Question 3 of 5",
    type: "practice",
    mode: "practice",
    description: "Can we make an arrangement using exactly 200 sticks?",
    data: {
      question: "Is it possible to use exactly 200 matchsticks?",
      equation: "2n + 1 = 200",
      options: [
        { id: "a", label: "Yes, at position 99" },
        { id: "b", label: "Yes, at position 100" },
        { id: "c", label: "No, n is not a whole number" },
        { id: "d", label: "Yes, at position 99.5" },
      ],
      correctId: "c",
      explanation:
        "2n + 1 = 200 → n = 99.5. Not a whole number, so 200 sticks is impossible.",
    },
  },
  {
    id: 13,
    title: "Question 4 of 5",
    type: "practice",
    mode: "practice",
    description: "Each new triangle increases the count by how many?",
    data: {
      question: "How many new matchsticks does each added triangle need?",
      equation: "(2n+1) − (2(n−1)+1)",
      options: [
        { id: "a", label: "1 matchstick" },
        { id: "b", label: "2 matchsticks" },
        { id: "c", label: "3 matchsticks" },
        { id: "d", label: "It varies" },
      ],
      correctId: "b",
      explanation:
        "Each new triangle shares one side, so only 2 new sticks are added.",
    },
  },
  {
    id: 14,
    title: "Question 5 of 5",
    type: "practice",
    mode: "practice",
    description: "What equation finds the position for 41 matchsticks?",
    data: {
      question: "Which equation to solve for 41 matchsticks?",
      equation: "? = 41",
      options: [
        { id: "a", label: "2n − 1 = 41" },
        { id: "b", label: "n + 1 = 41" },
        { id: "c", label: "2n + 1 = 41" },
        { id: "d", label: "3n + 1 = 41" },
      ],
      correctId: "c",
      explanation: "The formula is 2n + 1. So 2n + 1 = 41 → n = 20.",
    },
  },
  {
    id: 20,
    title: "Explore Any Position",
    description:
      "Slide to any position from 1 to 50 and watch the formula in action.",
    type: "explore",
    mode: "explore",
    data: { slider: true },
  },
];

// ==================== TRIANGLE SVG ====================

const TriangleGroup: React.FC<{
  count: number;
  originX: number;
  originY: number;
  scale: number;
  highlightLast: boolean;
}> = ({ count, originX, originY, scale, highlightLast }) => {
  const sw = 3.5 * scale;
  const sideLen = 50 * scale;
  const els: React.ReactNode[] = [];

  // Equilateral triangle: base = sideLen, height = sideLen * sqrt(3)/2
  const triH = sideLen * (Math.sqrt(3) / 2);
  // Each triangle shares its right base vertex with the next triangle's left base vertex
  // So base vertices are spaced sideLen apart along the baseline

  for (let i = 0; i < count; i++) {
    const isNew = i === count - 1 && highlightLast && count > 1;
    const delay = i * 0.16;
    const col = isNew ? DS.accent : DS.primary;
    const dotCol = isNew ? DS.accentSoft : DS.tintPrimary;

    // Three vertices of this equilateral triangle
    const leftX = originX + i * sideLen; // bottom-left
    const rightX = originX + (i + 1) * sideLen; // bottom-right
    const apexX = (leftX + rightX) / 2; // top center (midpoint of base)
    const apexY = originY - triH; // top Y
    const baseY = originY; // bottom Y

    // --- Draw 3 sides of the triangle ---

    // Left side: bottom-left to apex
    // For i > 0, this is shared with the previous triangle's right side,
    // but we still draw it so each triangle is complete and colored correctly
    els.push(
      <line
        key={`ls-${i}`}
        x1={leftX}
        y1={baseY}
        x2={apexX}
        y2={apexY}
        stroke={col}
        strokeWidth={sw}
        strokeLinecap="round"
        style={{ animation: `sgFadeUp 0.5s ease ${delay}s both` }}
      />,
    );

    // Right side: apex to bottom-right
    els.push(
      <line
        key={`rs-${i}`}
        x1={apexX}
        y1={apexY}
        x2={rightX}
        y2={baseY}
        stroke={col}
        strokeWidth={sw}
        strokeLinecap="round"
        style={{ animation: `sgFadeUp 0.5s ease ${delay + 0.05}s both` }}
      />,
    );

    // Base: bottom-left to bottom-right
    els.push(
      <line
        key={`bs-${i}`}
        x1={leftX}
        y1={baseY}
        x2={rightX}
        y2={baseY}
        stroke={col}
        strokeWidth={sw}
        strokeLinecap="round"
        style={{ animation: `sgFadeUp 0.5s ease ${delay + 0.1}s both` }}
      />,
    );

    // --- Vertex dots ---

    // Apex dot
    els.push(
      <circle
        key={`apex-${i}`}
        cx={apexX}
        cy={apexY}
        r={4.5 * scale}
        fill={dotCol}
        stroke={col}
        strokeWidth={1.8}
        style={{ animation: `sgPop 0.45s ease ${delay + 0.13}s both` }}
      />,
    );

    // Bottom-left dot (only for the very first triangle to avoid duplicates)
    if (i === 0) {
      els.push(
        <circle
          key={`bl-${i}`}
          cx={leftX}
          cy={baseY}
          r={4 * scale}
          fill={dotCol}
          stroke={col}
          strokeWidth={1.8}
          style={{ animation: `sgPop 0.4s ease ${delay + 0.06}s both` }}
        />,
      );
    }

    // Bottom-right dot (drawn for every triangle — this becomes next triangle's left dot)
    els.push(
      <circle
        key={`br-${i}`}
        cx={rightX}
        cy={baseY}
        r={4 * scale}
        fill={dotCol}
        stroke={col}
        strokeWidth={1.8}
        style={{ animation: `sgPop 0.4s ease ${delay + 0.15}s both` }}
      />,
    );

    // --- Position label below each triangle ---
    els.push(
      <text
        key={`lbl-${i}`}
        x={apexX}
        y={baseY + 20 * scale}
        textAnchor="middle"
        fill={DS.gray700}
        fontSize={12 * scale}
        fontWeight={600}
        fontFamily={DS.font}
        style={{ animation: `sgFadeUp 0.4s ease ${delay + 0.2}s both` }}
      >
        {i + 1}
      </text>,
    );
  }
  return <>{els}</>;
};

// ==================== MAIN COMPONENT ====================

const MatchstickPatternTool: React.FC<MatchstickPatternToolProps> = ({
  props: propsIn,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const props = (propsIn ?? {}) as NonNullable<MatchstickPatternToolProps["props"]>;
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: props.initialMode ?? ("learn" as ModeType),
      showModeSelector: props.showModeSelector ?? true,
      enabledModes:
        props.enabledModes ?? (["learn", "practice", "explore"] as ModeType[]),
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      initialStep: props.initialStep ?? 1,
      filterSteps: props.filterSteps ?? null,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration:
        props.autoPlayDuration ?? props.data?.autoPlayDuration ?? 8000,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const ap = props.additionalProps || {};
  const pc = useMemo(
    () => ({
      spu: ap.sticksPerUnit ?? 2,
      bs: ap.baseSticks ?? 1,
      sf: ap.showFormula ?? true,
    }),
    [ap],
  );

  const allSteps = props.steps || DEFAULT_STEPS;
  const avSteps = useMemo(
    () =>
      config.filterSteps?.length
        ? allSteps.filter((s) => config.filterSteps!.includes(s.id))
        : allSteps,
    [allSteps, config.filterSteps],
  );

  const [mode, setMode] = useState<ModeType>(config.initialMode);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(!stopAutoNext);
  const [transitioning, setTransitioning] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [slider, setSlider] = useState(1);
  const [selOpt, setSelOpt] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAns, setTotalAns] = useState(0);
  const autoRef = useRef<number>();

  const fSteps = useMemo(
    () => avSteps.filter((s) => s.mode === mode),
    [avSteps, mode],
  );
  const cs = fSteps[stepIdx] || fSteps[0];
  const vp = cs?.data?.visiblePositions ?? slider;
  const gsc = (n: number) => pc.spu * n + pc.bs;

  useEffect(() => {
    setStepDetails?.({
      currentStep: stepIdx + 1,
      totalSteps: fSteps.length,
      isPaused: !playing,
      currentMode: mode,
    });
  }, [stepIdx, fSteps.length, playing, mode]);

  useEffect(() => {
    if (
      playing &&
      config.autoPlayDuration > 0 &&
      !stopAutoNext &&
      mode !== "practice"
    ) {
      autoRef.current = window.setTimeout(() => {
        if (stepIdx < fSteps.length - 1) goTo(stepIdx + 1);
        else setPlaying(false);
      }, config.autoPlayDuration);
    }
    return () => {
      if (autoRef.current) clearTimeout(autoRef.current);
    };
  }, [
    playing,
    stepIdx,
    fSteps.length,
    config.autoPlayDuration,
    stopAutoNext,
    mode,
  ]);

  useEffect(() => {
    const kf = `
            @keyframes sgFadeUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
            @keyframes sgPop { 0%{transform:scale(0);opacity:0}70%{transform:scale(1.2)}100%{transform:scale(1);opacity:1} }
            @keyframes sgSlide { from{transform:translateX(-30px);opacity:0}to{transform:translateX(0);opacity:1} }
            @keyframes sgBounce { 0%,100%{transform:translateY(0)}40%{transform:translateY(-10px)}60%{transform:translateY(-5px)} }
            @keyframes sgCount { from{opacity:0;transform:scale(0.6)}to{opacity:1;transform:scale(1)} }
            @keyframes sgShake { 0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)} }
            @keyframes sgPulse { 0%,100%{box-shadow:0 0 0 0 rgba(74,77,201,0.3)}50%{box-shadow:0 0 0 8px rgba(74,77,201,0)} }
        `;
    const s = document.createElement("style");
    s.id = "sg-kf";
    s.textContent = kf;
    document.head.appendChild(s);
    return () => {
      const e = document.getElementById("sg-kf");
      if (e) document.head.removeChild(e);
    };
  }, []);

  const goTo = useCallback((i: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setStepIdx(i);
      setAnimKey((k) => k + 1);
      setSelOpt(null);
      setAnswered(false);
      setTimeout(() => setTransitioning(false), 50);
    }, 280);
  }, []);

  const goNext = () => {
    if (stepIdx < fSteps.length - 1) goTo(stepIdx + 1);
  };
  const goPrev = () => {
    if (stepIdx > 0) goTo(stepIdx - 1);
  };
  const switchMode = (m: ModeType) => {
    setMode(m);
    setStepIdx(0);
    setAnimKey((k) => k + 1);
    setSelOpt(null);
    setAnswered(false);
    if (m === "practice") {
      setScore(0);
      setTotalAns(0);
    }
  };

  const pickOpt = (id: string) => {
    if (answered) return;
    setSelOpt(id);
    setAnswered(true);
    setTotalAns((p) => p + 1);
    if (id === cs?.data?.correctId) setScore((p) => p + 1);
  };

  const modeMap: Record<ModeType, { label: string; icon: React.ReactNode }> = {
    learn: { label: "Learn", icon: <BookOpen size={15} /> },
    practice: { label: "Practice", icon: <Target size={15} /> },
    explore: { label: "Explore", icon: <Zap size={15} /> },
  };

  // ─── CONTAINED BUTTON (Singularity style) ───
  const SgBtn: React.FC<{
    children: React.ReactNode;
    onClick: () => void;
    variant?: "primary" | "accent" | "outline" | "ghost";
    disabled?: boolean;
    style?: React.CSSProperties;
  }> = ({
    children,
    onClick,
    variant = "primary",
    disabled = false,
    style: sx = {},
  }) => {
    const base: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "10px 24px",
      borderRadius: DS.radius.full,
      fontFamily: DS.font,
      fontSize: 14,
      fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.25s ease",
      border: "none",
      opacity: disabled ? 0.45 : 1,
    };
    const vars: Record<string, React.CSSProperties> = {
      primary: {
        background: DS.primary,
        color: DS.white,
        boxShadow: DS.shadow.md,
      },
      accent: {
        background: `linear-gradient(135deg, ${DS.accent}, ${DS.accentSoft})`,
        color: DS.white,
        boxShadow: DS.shadow.accent,
      },
      outline: {
        background: "transparent",
        color: DS.primary,
        border: `2px solid ${DS.primary}`,
        boxShadow: "none",
      },
      ghost: {
        background: "transparent",
        color: DS.primary,
        boxShadow: "none",
      },
    };
    return (
      <button
        onClick={disabled ? undefined : onClick}
        style={{ ...base, ...vars[variant], ...sx }}
        onMouseDown={(e) => {
          if (!disabled) e.currentTarget.style.transform = "scale(0.95)";
        }}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {children}
      </button>
    );
  };

  // ─── TIMELINE ───
  const renderTimeline = () => {
    const mx = mode === "explore" ? slider : (cs?.data?.visiblePositions ?? 1);
    const dm = Math.min(mx, 8);
    const out: React.ReactNode[] = [];
    for (let i = 1; i <= dm; i++) {
      const st = gsc(i);
      const isL = i === mx;
      out.push(
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 5,
            animation: `sgPop 0.5s ease ${i * 0.1}s both`,
          }}
        >
          <div
            style={{
              width: isL ? 52 : 42,
              height: isL ? 52 : 42,
              borderRadius: "50%",
              background: isL
                ? `linear-gradient(135deg, ${DS.primary}, ${DS.primaryDark})`
                : DS.tintPrimary,
              border: isL ? "none" : `2.5px solid ${DS.primary}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: isL ? 18 : 15,
              color: isL ? DS.white : DS.primary,
              fontFamily: DS.font,
              boxShadow: isL ? DS.shadow.md : "none",
              transition: "all 0.35s ease",
            }}
          >
            {st}
          </div>
          <span
            style={{
              fontSize: 11,
              color: DS.gray700,
              fontWeight: 600,
              fontFamily: DS.font,
            }}
          >
            <MV s={11}>n</MV>={i}
          </span>
        </div>,
      );
      if (i < dm)
        out.push(
          <div
            key={`a${i}`}
            style={{
              color: DS.tintPrimary,
              fontSize: 18,
              fontWeight: 700,
              paddingBottom: 18,
              animation: `sgSlide 0.35s ease ${i * 0.1 + 0.05}s both`,
            }}
          >
            →
          </div>,
        );
    }
    return out;
  };

  // ─── FORMULA ───
  const renderFormula = () => {
    const n = mode === "explore" ? slider : (cs?.data?.visiblePositions ?? 1);
    const st = gsc(n);
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          animation: "sgFadeUp 0.5s ease 0.2s both",
        }}
      >
        <div
          style={{
            background: DS.tintPrimary + "50",
            border: `2px solid ${DS.primary}20`,
            borderRadius: DS.radius.lg,
            padding: "12px 28px",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <MN s={21}>2</MN>
          <MO s={21}>×</MO>
          <MN s={21}>{n}</MN>
          <MO s={21}>+</MO>
          <MN s={21}>1</MN>
          <MO s={21}>=</MO>
          <MN s={24} c={DS.accent}>
            {st}
          </MN>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: DS.gray700,
            fontFamily: DS.font,
          }}
        >
          <Star size={14} color={DS.accent} fill={DS.accent} />
          <span>General rule: </span>
          <span
            style={{
              background: DS.tintAccent,
              borderRadius: DS.radius.md,
              padding: "4px 12px",
              border: `1px solid ${DS.accent}30`,
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <MN s={13}>Matchsticks</MN>
            <MO s={13}>=</MO>
            <MN s={13}>2</MN>
            <MV s={14} c={DS.primary}>
              n
            </MV>
            <MO s={13}>+</MO>
            <MN s={13}>1</MN>
          </span>
        </div>
      </div>
    );
  };

  // ─── TABLE ───
  const renderTable = () => {
    const mx = mode === "explore" ? slider : (cs?.data?.visiblePositions ?? 1);
    const dm = Math.min(mx, 12);
    return (
      <div
        style={{
          overflowX: "auto",
          maxHeight: 210,
          borderRadius: DS.radius.md,
          border: `1px solid ${DS.gray200}`,
        }}
      >
        <table
          style={{ borderCollapse: "collapse", width: "100%", minWidth: 300 }}
        >
          <thead>
            <tr>
              {["Position (n)", "Expression", "Matchsticks"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "8px 16px",
                    fontSize: 11,
                    color: DS.gray700,
                    fontFamily: DS.font,
                    fontWeight: 600,
                    borderBottom: `2px solid ${DS.primary}20`,
                    textTransform: "uppercase" as const,
                    letterSpacing: 0.8,
                    background: DS.gray100,
                    position: "sticky" as const,
                    top: 0,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: dm }, (_, idx) => {
              const i = idx + 1;
              return (
                <tr
                  key={i}
                  style={{
                    animation: `sgFadeUp 0.3s ease ${i * 0.05}s both`,
                    background:
                      i === mx ? DS.tintPrimary + "30" : "transparent",
                  }}
                >
                  <td
                    style={{
                      padding: "6px 16px",
                      textAlign: "center",
                      fontWeight: 700,
                      color: DS.primary,
                      fontFamily: DS.font,
                      borderBottom: `1px solid ${DS.gray200}`,
                    }}
                  >
                    {i}
                  </td>
                  <td
                    style={{
                      padding: "6px 16px",
                      textAlign: "center",
                      fontFamily: DS.font,
                      borderBottom: `1px solid ${DS.gray200}`,
                      color: DS.gray700,
                    }}
                  >
                    <MN s={13} b={false}>
                      2
                    </MN>
                    <MO s={13}>×</MO>
                    <MN s={13} b={false}>
                      {i}
                    </MN>
                    <MO s={13}>+</MO>
                    <MN s={13} b={false}>
                      1
                    </MN>
                  </td>
                  <td
                    style={{
                      padding: "6px 16px",
                      textAlign: "center",
                      fontWeight: 800,
                      fontSize: 15,
                      color: DS.gray900,
                      fontFamily: DS.font,
                      borderBottom: `1px solid ${DS.gray200}`,
                    }}
                  >
                    {gsc(i)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // ─── MCQ PRACTICE ───
  const renderPractice = () => {
    const d = cs?.data;
    if (!d?.options || !d?.correctId) return null;
    const isCorrect = selOpt === d.correctId;
    const tQ = fSteps.length;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          animation: "sgFadeUp 0.5s ease both",
        }}
      >
        {/* Score */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: DS.tintPrimary + "40",
            borderRadius: DS.radius.md,
            padding: "8px 16px",
          }}
        >
          <span
            style={{ fontSize: 13, color: DS.gray700, fontFamily: DS.font }}
          >
            Score: <strong style={{ color: DS.primary }}>{score}</strong> /{" "}
            {totalAns}
          </span>
          <span
            style={{ fontSize: 12, color: DS.gray700, fontFamily: DS.font }}
          >
            Q {stepIdx + 1} of {tQ}
          </span>
        </div>
        {/* Equation */}
        {d.equation && (
          <div
            style={{
              background: `linear-gradient(135deg, ${DS.tintPrimary}60, ${DS.tintAccent}60)`,
              borderRadius: DS.radius.lg,
              padding: "14px 24px",
              textAlign: "center" as const,
              border: `1.5px solid ${DS.primary}15`,
              animation: "sgFadeUp 0.4s ease 0.1s both",
            }}
          >
            <span
              style={{
                fontFamily: "'Times New Roman',Georgia,serif",
                fontSize: 20,
                fontWeight: 600,
                color: DS.gray900,
              }}
            >
              {d.equation}
            </span>
          </div>
        )}
        {/* Options 2x2 */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          {d.options.map((opt: MCQOption, idx: number) => {
            const isSel = selOpt === opt.id;
            const isCor = opt.id === d.correctId;
            let bg = DS.white,
              bdr = DS.gray200,
              col = DS.gray900,
              icon: React.ReactNode = null;
            if (answered) {
              if (isCor) {
                bg = "#EAFBF0";
                bdr = DS.green;
                col = "#1B8C4E";
                icon = <CheckCircle size={18} color={DS.green} />;
              } else if (isSel) {
                bg = "#FFF0EE";
                bdr = DS.red;
                col = DS.red;
                icon = <XCircle size={18} color={DS.red} />;
              } else {
                bg = DS.gray100;
                bdr = DS.gray200;
                col = DS.gray400;
              }
            }
            return (
              <button
                key={opt.id}
                onClick={() => pickOpt(opt.id)}
                disabled={answered}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "13px 16px",
                  borderRadius: DS.radius.md,
                  border: `2px solid ${bdr}`,
                  background: bg,
                  cursor: answered ? "default" : "pointer",
                  fontFamily: DS.font,
                  fontSize: 14,
                  fontWeight: 600,
                  color: col,
                  transition: "all 0.25s ease",
                  animation: `sgFadeUp 0.35s ease ${0.12 + idx * 0.07}s both`,
                  textAlign: "left" as const,
                }}
                onMouseEnter={(e) => {
                  if (!answered) {
                    e.currentTarget.style.borderColor = DS.primary;
                    e.currentTarget.style.background = DS.tintPrimary + "30";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = DS.shadow.sm;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!answered) {
                    e.currentTarget.style.borderColor = DS.gray200;
                    e.currentTarget.style.background = DS.white;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
                onMouseDown={(e) => {
                  if (!answered)
                    e.currentTarget.style.transform = "scale(0.97)";
                }}
                onMouseUp={(e) => {
                  if (!answered)
                    e.currentTarget.style.transform = "translateY(-2px)";
                }}
              >
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background:
                      answered && isCor
                        ? DS.green
                        : answered && isSel
                          ? DS.red
                          : DS.tintPrimary,
                    color: answered && (isCor || isSel) ? DS.white : DS.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 13,
                    flexShrink: 0,
                    transition: "all 0.25s ease",
                  }}
                >
                  {opt.id.toUpperCase()}
                </span>
                <span style={{ flex: 1 }}>{opt.label}</span>
                {icon}
              </button>
            );
          })}
        </div>
        {/* Feedback */}
        {answered && (
          <div
            style={{
              borderRadius: DS.radius.md,
              padding: "14px 18px",
              background: isCorrect ? "#EAFBF0" : "#FFF0EE",
              border: `2px solid ${isCorrect ? DS.green : DS.red}25`,
              animation: isCorrect
                ? "sgPop 0.5s ease both"
                : "sgShake 0.5s ease both",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: isCorrect ? "#1B8C4E" : DS.red,
                fontFamily: DS.font,
                marginBottom: 4,
              }}
            >
              {isCorrect ? "🎉 Correct!" : "✗ Not quite!"}
            </div>
            <div
              style={{
                fontSize: 13,
                color: DS.gray700,
                fontFamily: DS.font,
                lineHeight: 1.6,
              }}
            >
              {d.explanation}
            </div>
          </div>
        )}
        {/* Next Q */}
        {answered && stepIdx < fSteps.length - 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              animation: "sgFadeUp 0.4s ease 0.2s both",
            }}
          >
            <SgBtn onClick={goNext} variant="accent">
              Next Question <ChevronRight size={16} />
            </SgBtn>
          </div>
        )}
        {/* Final score */}
        {answered && stepIdx === fSteps.length - 1 && (
          <div
            style={{
              textAlign: "center" as const,
              padding: "18px 20px",
              background: `linear-gradient(135deg, ${DS.tintPrimary}60, ${DS.tintAccent}60)`,
              borderRadius: DS.radius.lg,
              border: `2px solid ${DS.primary}15`,
              animation: "sgPop 0.6s ease 0.2s both",
            }}
          >
            <div
              style={{ fontSize: 13, color: DS.gray700, fontFamily: DS.font }}
            >
              Quiz Complete!
            </div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: DS.primary,
                fontFamily: DS.font,
              }}
            >
              {score} / {tQ}
            </div>
            <div
              style={{
                fontSize: 13,
                color: DS.gray700,
                fontFamily: DS.font,
                marginTop: 4,
              }}
            >
              {score === tQ
                ? "🌟 Perfect! Outstanding!"
                : score >= tQ * 0.6
                  ? "👏 Good job! Keep going!"
                  : "💪 Keep learning!"}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── EXPLORE ───
  const renderExplore = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        animation: "sgFadeUp 0.5s ease both",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          width: "100%",
          maxWidth: 420,
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: DS.font,
            fontSize: 14,
            color: DS.gray700,
            minWidth: 60,
          }}
        >
          Position:
        </span>
        <input
          type="range"
          min={1}
          max={50}
          value={slider}
          onChange={(e) => setSlider(parseInt(e.target.value))}
          style={{ flex: 1, accentColor: DS.primary, cursor: "pointer" }}
        />
        <span
          style={{
            fontFamily: DS.font,
            fontSize: 24,
            fontWeight: 800,
            color: DS.primary,
            minWidth: 40,
            textAlign: "center" as const,
          }}
        >
          {slider}
        </span>
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
          fontFamily: DS.font,
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          animation: "sgCount 0.3s ease both",
        }}
        key={slider}
      >
        <span style={{ color: DS.accent }}>{gsc(slider)}</span>
        <span style={{ fontSize: 15, fontWeight: 500, color: DS.gray700 }}>
          matchsticks
        </span>
      </div>
    </div>
  );

  // ═══════════ RENDER ═══════════
  return (
    <div
      style={{
        width: config.width,
        maxWidth: "100%",
        background: DS.white,
        borderRadius: DS.radius.xl,
        overflow: "hidden",
        boxShadow: DS.shadow.lg,
        fontFamily: DS.font,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.primary} 0%, ${DS.primaryDark} 60%, ${DS.accent} 100%)`,
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Geometric icon cluster — circles + triangle (Singularity shapes) */}
          <div style={{ position: "relative", width: 44, height: 44 }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "2.5px solid rgba(255,255,255,0.25)",
              }}
            />
            <svg
              width={28}
              height={24}
              viewBox="0 0 28 24"
              style={{ position: "absolute", top: 10, left: 8 }}
            >
              <polygon
                points="14,2 26,22 2,22"
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div style={{ color: DS.white, fontWeight: 700, fontSize: 17 }}>
              Matchstick Patterns
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              Triangle Sequence · 2n + 1
            </div>
          </div>
        </div>
        {config.showStepIndicator && fSteps.length > 1 && (
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: DS.radius.full,
              padding: "5px 16px",
              color: DS.white,
              fontSize: 13,
              fontWeight: 600,
              backdropFilter: "blur(4px)",
            }}
          >
            {stepIdx + 1} / {fSteps.length}
          </div>
        )}
      </div>

      {/* ── MODE TABS ── */}
      {config.showModeSelector && (
        <div
          style={{
            display: "flex",
            gap: 0,
            background: DS.white,
            borderBottom: `1px solid ${DS.gray200}`,
            padding: "0 24px",
          }}
        >
          {config.enabledModes.map((m) => {
            const mc = modeMap[m];
            const isA = mode === m;
            return (
              <button
                key={m}
                onClick={() => switchMode(m)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "11px 20px",
                  border: "none",
                  cursor: "pointer",
                  background: isA ? DS.tintPrimary + "40" : "transparent",
                  color: isA ? DS.primary : DS.gray700,
                  fontWeight: isA ? 700 : 500,
                  fontSize: 13,
                  fontFamily: DS.font,
                  borderBottom: isA
                    ? `3px solid ${DS.primary}`
                    : "3px solid transparent",
                  borderRadius: 0,
                  transition: "all 0.25s ease",
                }}
              >
                {mc.icon}
                {mc.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── CONTENT ── */}
      <div
        style={{
          flex: 1,
          padding: "20px 24px",
          background: DS.white,
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(16px)" : "translateY(0)",
          transition: "opacity 0.28s ease, transform 0.28s ease",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          overflow: "auto",
        }}
        key={animKey}
      >
        {cs && (
          <div style={{ animation: "sgFadeUp 0.45s ease both" }}>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: DS.gray900,
                fontFamily: DS.font,
              }}
            >
              {cs.title}
            </h2>
            <p
              style={{
                margin: "5px 0 0",
                fontSize: 14,
                color: DS.gray700,
                lineHeight: 1.65,
                fontFamily: DS.font,
                fontWeight: 400,
              }}
            >
              {cs.description}
            </p>
          </div>
        )}

        {mode === "learn" && (
          <div
            style={{
              background: `linear-gradient(180deg, ${DS.tintPrimary}30 0%, ${DS.tintAccent}40 100%)`,
              borderRadius: DS.radius.lg,
              padding: "20px 16px 14px",
              border: `1.5px solid ${DS.primary}12`,
              display: "flex",
              justifyContent: "center",
              minHeight: 120,
              overflow: "hidden",
              animation: "sgFadeUp 0.5s ease 0.08s both",
            }}
          >
            <svg
              width={Math.min(config.width - 80, vp * 48 + 60)}
              height={120}
              viewBox={`0 0 ${vp * 48 + 60} 120`}
              style={{ overflow: "visible" }}
            >
              <TriangleGroup
                count={vp}
                originX={20}
                originY={85}
                scale={0.95}
                highlightLast={vp > 1}
              />
            </svg>
          </div>
        )}

        {(mode === "learn" || mode === "explore") && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              flexWrap: "wrap",
              padding: "4px 0",
            }}
          >
            {renderTimeline()}
          </div>
        )}
        {pc.sf && (mode === "learn" || mode === "explore") && renderFormula()}
        {mode === "learn" && vp >= 2 && (
          <div style={{ animation: "sgFadeUp 0.5s ease 0.3s both" }}>
            {renderTable()}
          </div>
        )}
        {mode === "practice" && renderPractice()}
        {mode === "explore" && (
          <>
            {renderExplore()}
            {renderTable()}
          </>
        )}
      </div>

      {/* ── TEACHING NOTE ── */}
      <div
        style={{
          padding: "10px 24px",
          background: DS.tintAccent + "60",
          borderTop: `1px solid ${DS.accent}15`,
          fontSize: 12,
          color: DS.gray700,
          fontFamily: DS.font,
          fontStyle: "italic",
          lineHeight: 1.5,
        }}
      >
        <strong style={{ color: DS.accent, fontStyle: "normal" }}>
          Teaching Note:
        </strong>{" "}
        Guide students through this tool. Encourage exploration and discussion.
        Ask them to predict matchstick counts before revealing the next step.
      </div>

      {/* ── NAVIGATION ── */}
      {config.showNavigation && fSteps.length > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "12px 24px 16px",
            background: DS.white,
            borderTop: `1px solid ${DS.gray200}`,
          }}
        >
          <SgBtn
            onClick={goPrev}
            variant="outline"
            disabled={stepIdx === 0}
            style={{ padding: "8px 16px", fontSize: 13 }}
          >
            <ChevronLeft size={15} /> Prev
          </SgBtn>

          {config.showPlayPause && mode !== "practice" && (
            <button
              onClick={() => {
                setPlaying(!playing);
                setStopAutoNext?.(playing);
              }}
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: `linear-gradient(135deg, ${DS.primary}, ${DS.primaryDark})`,
                color: DS.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: DS.shadow.md,
                transition: "transform 0.2s ease",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.9)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
          )}

          <div style={{ display: "flex", gap: 5 }}>
            {fSteps.map((_, i) => (
              <div
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === stepIdx ? 24 : 8,
                  height: 8,
                  borderRadius: DS.radius.full,
                  background: i === stepIdx ? DS.primary : DS.tintPrimary,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          <SgBtn
            onClick={goNext}
            variant="primary"
            disabled={stepIdx === fSteps.length - 1}
            style={{ padding: "8px 16px", fontSize: 13 }}
          >
            Next <ChevronRight size={15} />
          </SgBtn>
        </div>
      )}

      {/* ── STUDENT STRIP ── */}
      <div
        style={{
          padding: "8px 24px 12px",
          background: DS.tintPrimary + "30",
          fontSize: 12,
          color: DS.primary,
          fontWeight: 600,
          fontFamily: DS.font,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <svg width={16} height={16} viewBox="0 0 16 16">
          <polygon
            points="8,1 15,15 1,15"
            fill="none"
            stroke={DS.primary}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
        Triangle matchstick pattern: 3 sticks at position 1, 5 at position 2, 7
        at position 3. General rule: 2n+1.
      </div>
    </div>
  );
};

export default MatchstickPatternTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
