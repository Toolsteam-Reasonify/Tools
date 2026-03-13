// ═══════════════════════════════════════════════════════════════════════════
// Weighing Scale Explorer — Singularity DS + Realistic Brass Scale
// ═══════════════════════════════════════════════════════════════════════════
// @ts-nocheck
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
  BookOpen,
  Target,
  Zap,
} from "lucide-react";

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
  type: string;
  mode: ModeType;
  data?: any;
}
interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}
interface MCQOption {
  label: string;
  value: number;
}
interface MCQQuestion {
  question: string;
  options: MCQOption[];
  correctAnswer: number;
  leftWeights: number[];
  rightWeights: number[];
  explanation: string;
}
interface WeighingScaleAdditionalProps {
  leftWeights?: number[];
  rightWeights?: number[];
  showLabels?: boolean;
  highlightComponent?: string | null;
  showWeightValues?: boolean;
  animateBalance?: boolean;
}
interface WeighingScaleExplorerProps {
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
    filterSteps?: number[];
    animationSpeed?: number;
    autoPlayDuration?: number;
    darkMode?: boolean;
    additionalProps?: WeighingScaleAdditionalProps;
  };
  setStepDetails?: (d: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (v: boolean) => void;
}

const DS = {
  indigo: "#4A4DC9",
  orange: "#FF7212",
  purple: "#533086",
  lightOrange: "#FC9145",
  lavender: "#C1C1EA",
  cream: "#FFF3E4",
  dark: "#4E4E4E",
  grey: "#CACACA",
  lightGrey: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  indigoHover: "#3B3EB5",
  successGreen: "#2E7D32",
  successBg: "#E8F5E9",
  errorRed: "#C62828",
  errorBg: "#FFEBEE",
  radiusSm: 8,
  radiusMd: 12,
  radiusPill: 999,
  radiusXl: 24,
  font: "'Poppins', sans-serif",
};

// Brass palette
const B = {
  gold: "#C5A54E",
  goldLight: "#E0C97A",
  goldBright: "#F0DDA0",
  goldDark: "#8B7332",
  goldDeep: "#6B5722",
  goldShadow: "#4A3C18",
  panInner: "#D4B85C",
  panRim: "#A08030",
  panHighlight: "#F5E8B8",
  chainGold: "#B89840",
  chainLight: "#D4B85C",
};

const MCQ_QUESTIONS: MCQQuestion[] = [
  {
    question:
      "The left pan has weights 3 and '?'. The right pan has 7. What is '?' so the scale balances?",
    options: [
      { label: "3", value: 3 },
      { label: "4", value: 4 },
      { label: "5", value: 5 },
      { label: "7", value: 7 },
    ],
    correctAnswer: 4,
    leftWeights: [3, -1],
    rightWeights: [7],
    explanation: "3 + ? = 7, so ? = 7 − 3 = 4.",
  },
  {
    question:
      "The left pan has 5 + 5 = 10. The right pan has 4 and '?'. What is the unknown?",
    options: [
      { label: "4", value: 4 },
      { label: "5", value: 5 },
      { label: "6", value: 6 },
      { label: "10", value: 10 },
    ],
    correctAnswer: 6,
    leftWeights: [5, 5],
    rightWeights: [4, -1],
    explanation: "Left = 10. Right = 4 + ? = 10, so ? = 6.",
  },
  {
    question:
      "Total weight 16 split into two equal sacks. What does each weigh?",
    options: [
      { label: "4", value: 4 },
      { label: "6", value: 6 },
      { label: "8", value: 8 },
      { label: "16", value: 16 },
    ],
    correctAnswer: 8,
    leftWeights: [-1],
    rightWeights: [-1],
    explanation: "16 ÷ 2 = 8 each.",
  },
  {
    question: "Left: 2+2+unknown. Right: 10. Find unknown.",
    options: [
      { label: "4", value: 4 },
      { label: "5", value: 5 },
      { label: "6", value: 6 },
      { label: "8", value: 8 },
    ],
    correctAnswer: 6,
    leftWeights: [2, 2, -1],
    rightWeights: [10],
    explanation: "4 + ? = 10 → ? = 6.",
  },
  {
    question: "3x on left, 12 on right. What is x?",
    options: [
      { label: "2", value: 2 },
      { label: "3", value: 3 },
      { label: "4", value: 4 },
      { label: "6", value: 6 },
    ],
    correctAnswer: 4,
    leftWeights: [4, 4, 4],
    rightWeights: [12],
    explanation: "3x=12 → x=4.",
  },
];

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Meet the Weighing Scale",
    description:
      "A classic brass balance scale compares weights on two pans. When both sides are equal, the beam stays perfectly level. Click on any part to learn about it!",
    type: "intro",
    mode: "learn",
    data: { leftWeights: [4], rightWeights: [4], highlight: null },
  },
  {
    id: 2,
    title: "The Fulcrum — Crown Pivot",
    description:
      "The ornate crown piece at the top is where the beam pivots. This fulcrum point allows the beam to tilt freely, acting as the heart of the balance.",
    type: "explanation",
    mode: "learn",
    data: { leftWeights: [4], rightWeights: [4], highlight: "fulcrum" },
  },
  {
    id: 3,
    title: "The Beam — The Brass Bar",
    description:
      "The long brass beam connects both pans through the central pivot. When one side is heavier, the beam tilts down on that side. A horizontal beam means balance!",
    type: "explanation",
    mode: "learn",
    data: { leftWeights: [4], rightWeights: [4], highlight: "beam" },
  },
  {
    id: 4,
    title: "The Left Pan (LHS)",
    description:
      "The round brass pan on the left hangs by chains. Whatever weight sits here pushes the left side down. In equations, this is the Left Hand Side!",
    type: "explanation",
    mode: "learn",
    data: { leftWeights: [2, 2], rightWeights: [4], highlight: "leftPan" },
  },
  {
    id: 5,
    title: "The Right Pan (RHS)",
    description:
      "The right pan mirrors the left. Both must hold equal total weight for the scale to balance — just like the Right Hand Side of an equation!",
    type: "explanation",
    mode: "learn",
    data: { leftWeights: [4], rightWeights: [2, 2], highlight: "rightPan" },
  },
  {
    id: 6,
    title: "The Pointer",
    description:
      "The thin pointer at the centre of the beam shows if the scale is balanced. When perfectly level, the pointer hangs straight down.",
    type: "explanation",
    mode: "learn",
    data: { leftWeights: [4], rightWeights: [4], highlight: "pointer" },
  },
  {
    id: 7,
    title: "Unequal Sides — Watch It Tilt!",
    description:
      "When the left (6) is heavier than the right (3), the beam tilts. The heavier side always sinks down. This shows inequality!",
    type: "explanation",
    mode: "learn",
    data: { leftWeights: [6], rightWeights: [3], highlight: null },
  },
  {
    id: 8,
    title: "Balance = Equality!",
    description:
      "2 + 2 on the left equals 4 on the right. The beam is level — LHS = RHS. This is the foundation of all equations!",
    type: "explanation",
    mode: "learn",
    data: { leftWeights: [2, 2], rightWeights: [4], highlight: null },
  },
  ...MCQ_QUESTIONS.map((q, i) => ({
    id: 10 + i,
    title: `Question ${i + 1} of 5`,
    description: q.question,
    type: "practice",
    mode: "practice" as ModeType,
    data: {
      mcqIndex: i,
      leftWeights: q.leftWeights,
      rightWeights: q.rightWeights,
    },
  })),
  {
    id: 20,
    title: "Vegetable Market 🥕",
    description:
      "Shopkeepers place iron weights on one pan and vegetables on the other. When the brass beam goes level, the weight matches! Here: 2 + 3 = 5 kg.",
    type: "real_world",
    mode: "real_world",
    data: { leftWeights: [2, 3], rightWeights: [5] },
  },
  {
    id: 21,
    title: "Chemistry Lab 🔬",
    description:
      "Scientists use precision balances. Three 1g weights balance 3g of compound. Every fraction matters!",
    type: "real_world",
    mode: "real_world",
    data: { leftWeights: [1, 1, 1], rightWeights: [3] },
  },
  {
    id: 22,
    title: "Post Office 📦",
    description:
      "Parcels are weighed to calculate postage. This 4 kg parcel balances against two 2 kg brass weights.",
    type: "real_world",
    mode: "real_world",
    data: { leftWeights: [4], rightWeights: [2, 2] },
  },
  {
    id: 23,
    title: "Jeweller's Scale ✨",
    description:
      "Goldsmiths need perfect precision. 5g of gold perfectly balances a 5g standard weight.",
    type: "real_world",
    mode: "real_world",
    data: { leftWeights: [5], rightWeights: [5] },
  },
];

const keyframes = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInDown{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes popIn{0%{transform:scale(0);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
@keyframes weightDrop{0%{transform:translateY(-36px) scale(.7);opacity:0}50%{transform:translateY(4px) scale(1.03);opacity:1}70%{transform:translateY(-2px)}100%{transform:translateY(0) scale(1)}}
@keyframes panSwing{0%{transform:translateY(0)}20%{transform:translateY(4px)}40%{transform:translateY(-2px)}60%{transform:translateY(1px)}100%{transform:translateY(0)}}
@keyframes tooltipIn{from{opacity:0;transform:translateY(6px) scale(.93)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes correctPop{0%{transform:scale(1)}30%{transform:scale(1.1)}60%{transform:scale(.97)}100%{transform:scale(1)}}
@keyframes shakeWrong{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
`;

type PropsShape = NonNullable<WeighingScaleExplorerProps["props"]>;
const WeighingScaleExplorer: React.FC<WeighingScaleExplorerProps> = ({
  props: propsIn = {} as PropsShape,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const props = propsIn;
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
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      filterSteps: props.filterSteps ?? null,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration: props.autoPlayDuration ?? 10000,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );
  const ap = props.additionalProps || {};
  const sc = useMemo(
    () => ({
      leftWeights: ap.leftWeights ?? [4],
      rightWeights: ap.rightWeights ?? [4],
      showWeightValues: ap.showWeightValues ?? true,
      animateBalance: ap.animateBalance ?? true,
    }),
    [ap],
  );
  const allSteps = props.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(
    () =>
      config.filterSteps?.length
        ? allSteps.filter((s) => config.filterSteps!.includes(s.id))
        : allSteps,
    [allSteps, config.filterSteps],
  );
  const [selectedMode, setSelectedMode] = useState<ModeType>(
    config.initialMode,
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!stopAutoNext);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [highlightedPart, setHighlightedPart] = useState<string | null>(null);
  const [tooltipInfo, setTooltipInfo] = useState<{ text: string } | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [hoverPart, setHoverPart] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [mcqResult, setMcqResult] = useState<"correct" | "wrong" | null>(null);
  const [mcqScore, setMcqScore] = useState(0);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ttRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modeSteps = useMemo(
    () => availableSteps.filter((s) => s.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const currentStep = modeSteps[currentStepIndex] || modeSteps[0];
  const sLW: number[] = currentStep?.data?.leftWeights ?? sc.leftWeights;
  const sRW: number[] = currentStep?.data?.rightWeights ?? sc.rightWeights;
  const lT = sLW.reduce((a, b) => a + (b < 0 ? 0 : b), 0);
  const rT = sRW.reduce((a, b) => a + (b < 0 ? 0 : b), 0);
  const tilt = useMemo(() => {
    const d = lT - rT;
    if (Math.abs(d) < 0.01) return 0;
    return Math.max(-14, Math.min(14, -d * 2.5));
  }, [lT, rT]);
  const curMCQ =
    currentStep?.data?.mcqIndex !== undefined
      ? MCQ_QUESTIONS[currentStep.data.mcqIndex]
      : null;
  const dm = config.darkMode;

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "ws-brass";
    el.textContent = keyframes;
    document.head.appendChild(el);
    return () => {
      document.getElementById("ws-brass")?.remove();
    };
  }, []);
  useEffect(() => {
    setHighlightedPart(currentStep?.data?.highlight ?? null);
    setSelectedOption(null);
    setMcqResult(null);
    setTooltipInfo(null);
    setAnimKey((k) => k + 1);
  }, [currentStepIndex, selectedMode]);
  useEffect(() => {
    if (autoRef.current) clearTimeout(autoRef.current);
    if (
      isPlaying &&
      config.autoPlayDuration > 0 &&
      !stopAutoNext &&
      selectedMode !== "practice"
    ) {
      autoRef.current = setTimeout(
        handleNext,
        config.autoPlayDuration / config.animationSpeed,
      );
    }
    return () => {
      if (autoRef.current) clearTimeout(autoRef.current);
    };
  }, [
    isPlaying,
    currentStepIndex,
    selectedMode,
    config.autoPlayDuration,
    stopAutoNext,
  ]);
  useEffect(() => {
    setStepDetails?.({
      currentStep: currentStepIndex + 1,
      totalSteps: modeSteps.length,
      isPaused: !isPlaying,
      currentMode: selectedMode,
    });
  }, [currentStepIndex, modeSteps.length, isPlaying, selectedMode]);

  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStepIndex((p) => (p < modeSteps.length - 1 ? p + 1 : 0));
      setIsTransitioning(false);
    }, 260);
  }, [modeSteps.length]);
  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStepIndex((p) => (p > 0 ? p - 1 : modeSteps.length - 1));
      setIsTransitioning(false);
    }, 260);
  }, [modeSteps.length]);
  const handleModeChange = useCallback((m: ModeType) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedMode(m);
      setCurrentStepIndex(0);
      setIsTransitioning(false);
      setMcqScore(0);
    }, 260);
  }, []);
  const handlePartClick = useCallback((part: string) => {
    setStopAutoNext?.(true);
    setIsPlaying(false);
    const info: Record<string, string> = {
      leftPan:
        "Left Pan — The round brass dish on the left. Holds weights representing the Left Hand Side (LHS) of an equation.",
      rightPan:
        "Right Pan — The round brass dish on the right. Holds weights representing the Right Hand Side (RHS) of an equation.",
      fulcrum:
        "Fulcrum — The ornate crown pivot at the top of the pillar. The beam rotates freely on this point.",
      pointer:
        "Pointer — The thin brass indicator at the centre. Points straight down when the scale is perfectly balanced.",
      beam: "Beam — The long brass bar connecting both pans. Tilts toward the heavier side.",
    };
    setHighlightedPart(part);
    setTooltipInfo({ text: info[part] || "" });
    if (ttRef.current) clearTimeout(ttRef.current);
    ttRef.current = setTimeout(() => setTooltipInfo(null), 4500);
  }, []);
  const handleMCQ = useCallback(
    (v: number) => {
      if (mcqResult) return;
      setSelectedOption(v);
      const ok = curMCQ?.correctAnswer === v;
      setMcqResult(ok ? "correct" : "wrong");
      if (ok) setMcqScore((s) => s + 1);
    },
    [mcqResult, curMCQ],
  );
  const mCfg: Record<ModeType, { label: string; icon: any; color: string }> = {
    learn: { label: "Learn", icon: BookOpen, color: DS.indigo },
    practice: { label: "Practice", icon: Target, color: DS.orange },
    real_world: { label: "Real World", icon: Zap, color: DS.purple },
  };

  // ══════════════════════════════════════════════════════════════════
  // REALISTIC BRASS BALANCE SCALE SVG
  // ══════════════════════════════════════════════════════════════════
  const renderScale = () => {
    const W = 700,
      H = 440,
      cx = W / 2,
      pillarTop = 58,
      beamY = 68,
      bH = 215;
    const lx = cx - bH,
      rx = cx + bH;
    const isH = (p: string) => highlightedPart === p || hoverPart === p;
    const gl = (p: string, c: string): React.CSSProperties => ({
      cursor: "pointer",
      transition: "filter 0.4s ease",
      filter: isH(p) ? `drop-shadow(0 0 14px ${c}88)` : "none",
    });

    // Chain rendering — 3 V-chains per side like the photo
    const renderChains = (
      beamEndX: number,
      panCx: number,
      panTopY: number,
      delay: number,
    ) => {
      const byStart = beamY + 6;
      const chains: React.ReactNode[] = [];
      const offsets = [-22, 0, 22]; // 3 chain attachment points on pan rim
      offsets.forEach((panOff, ci) => {
        const ex = panCx + panOff;
        const numLinks = 8;
        for (let i = 0; i < numLinks; i++) {
          const t = i / numLinks;
          const nt = (i + 1) / numLinks;
          const x1 = beamEndX + (ex - beamEndX) * t;
          const y1 = byStart + (panTopY - byStart) * t;
          const x2 = beamEndX + (ex - beamEndX) * nt;
          const y2 = byStart + (panTopY - byStart) * nt;
          chains.push(
            <line
              key={`ch${beamEndX}${ci}${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i % 2 === 0 ? B.chainGold : B.chainLight}
              strokeWidth={1.8}
              strokeLinecap="round"
              opacity={0.75}
            />,
          );
          if (i > 0 && i < numLinks) {
            chains.push(
              <ellipse
                key={`cl${beamEndX}${ci}${i}`}
                cx={x1}
                cy={y1}
                rx={1.5}
                ry={2.5}
                fill="none"
                stroke={B.chainGold}
                strokeWidth={1}
                opacity={0.5}
                transform={`rotate(${x2 - x1 > 0 ? 10 : -10} ${x1} ${y1})`}
              />,
            );
          }
        }
      });
      return chains;
    };

    const renderPan = (
      pcx: number,
      pY: number,
      weights: number[],
      side: "left" | "right",
      bd: number,
    ) => {
      const sp2 = side === "left" ? "leftPan" : "rightPan";
      const highlighted = isH(sp2);
      const n = weights.length;
      const sp = Math.min(32, 80 / Math.max(n, 1));
      const sx = pcx - ((n - 1) * sp) / 2;
      return (
        <g style={{ animation: `panSwing 1s ease ${bd}s both` }}>
          {/* Pan shadow on ground */}
          <ellipse
            cx={pcx}
            cy={pY + 16}
            rx={48}
            ry={5}
            fill="rgba(0,0,0,0.06)"
          />
          {/* Pan outer rim */}
          <ellipse
            cx={pcx}
            cy={pY}
            rx={52}
            ry={14}
            fill={`url(#panGrad${side})`}
            stroke={
              highlighted ? (side === "left" ? DS.indigo : DS.orange) : B.panRim
            }
            strokeWidth={highlighted ? 2.5 : 1.8}
            style={{ transition: "all 0.4s ease" }}
          />
          {/* Pan inner dish */}
          <ellipse
            cx={pcx}
            cy={pY + 2}
            rx={42}
            ry={9}
            fill={B.panInner}
            opacity={0.5}
          />
          {/* Pan highlight arc */}
          <ellipse
            cx={pcx}
            cy={pY - 3}
            rx={44}
            ry={8}
            fill="none"
            stroke={B.panHighlight}
            strokeWidth={1.2}
            opacity={0.5}
          />
          {/* Inner depth shadow */}
          <ellipse
            cx={pcx}
            cy={pY + 5}
            rx={36}
            ry={6}
            fill="rgba(0,0,0,0.06)"
          />

          {/* Weight blocks */}
          {weights.map((w, i) => {
            const unk = w < 0;
            const wx = sx + i * sp;
            const wy = pY - 24 - (n > 2 ? i * 2 : 0);
            const col = unk
              ? DS.lightOrange
              : side === "left"
                ? DS.indigo
                : DS.orange;
            const bdr = unk
              ? DS.orange
              : side === "left"
                ? DS.purple
                : "#CC5A0E";
            return (
              <g
                key={`w${side}${i}`}
                style={{
                  animation: `weightDrop 0.65s cubic-bezier(0.34,1.56,0.64,1) ${bd + 0.12 + i * 0.1}s both`,
                }}
              >
                <ellipse
                  cx={wx}
                  cy={wy + 14}
                  rx={12}
                  ry={2}
                  fill="rgba(0,0,0,0.1)"
                />
                <rect
                  x={wx - 14}
                  y={wy - 10}
                  width={28}
                  height={22}
                  rx={6}
                  fill={col}
                  stroke={bdr}
                  strokeWidth={1.5}
                />
                <rect
                  x={wx - 11}
                  y={wy - 8}
                  width={22}
                  height={5}
                  rx={2.5}
                  fill="rgba(255,255,255,0.25)"
                />
                <text
                  x={wx}
                  y={wy + 5}
                  textAnchor="middle"
                  fill={DS.white}
                  fontFamily={DS.font}
                  fontSize="12"
                  fontWeight="600"
                >
                  {unk ? "?" : w}
                </text>
              </g>
            );
          })}
          {/* Total label */}
          {sc.showWeightValues && (
            <text
              x={pcx}
              y={pY + 30}
              textAnchor="middle"
              fill={B.goldDark}
              fontFamily={DS.font}
              fontSize="11"
              fontWeight="600"
              opacity={0.8}
              style={{ animation: `fadeIn 0.5s ease ${bd + 0.5}s both` }}
            >
              = {side === "left" ? lT : rT}
            </text>
          )}
          {/* Part label */}
          {highlighted && (
            <text
              x={pcx}
              y={pY + 44}
              textAnchor="middle"
              fill={side === "left" ? DS.indigo : DS.orange}
              fontFamily={DS.font}
              fontSize="10"
              fontWeight="600"
              style={{ animation: "fadeInUp 0.3s ease" }}
            >
              {side === "left" ? "Left Pan (LHS)" : "Right Pan (RHS)"}
            </text>
          )}
        </g>
      );
    };

    const chainPanY = beamY + 105;

    return (
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Brass gradients */}
          <linearGradient id="pillarGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={B.goldDark} />
            <stop offset="25%" stopColor={B.goldLight} />
            <stop offset="50%" stopColor={B.goldBright} />
            <stop offset="75%" stopColor={B.goldLight} />
            <stop offset="100%" stopColor={B.goldDark} />
          </linearGradient>
          <linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={B.goldBright} />
            <stop offset="40%" stopColor={B.gold} />
            <stop offset="100%" stopColor={B.goldDark} />
          </linearGradient>
          <radialGradient id="baseGrad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor={B.goldBright} />
            <stop offset="60%" stopColor={B.gold} />
            <stop offset="100%" stopColor={B.goldDark} />
          </radialGradient>
          <radialGradient id="panGradleft" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor={B.goldBright} />
            <stop offset="50%" stopColor={B.gold} />
            <stop offset="100%" stopColor={B.goldDark} />
          </radialGradient>
          <radialGradient id="panGradright" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor={B.goldBright} />
            <stop offset="50%" stopColor={B.gold} />
            <stop offset="100%" stopColor={B.goldDark} />
          </radialGradient>
          <linearGradient id="crownGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={B.goldBright} />
            <stop offset="100%" stopColor={B.gold} />
          </linearGradient>
        </defs>

        {/* ════ CIRCULAR BASE ════ */}
        {/* baseY=388 keeps base in upper zone, leaving H-38 to H for status */}
        <ellipse
          cx={cx}
          cy={388}
          rx={80}
          ry={16}
          fill={`url(#baseGrad)`}
          stroke={B.goldDark}
          strokeWidth={1.5}
        />
        <ellipse
          cx={cx}
          cy={386}
          rx={74}
          ry={12}
          fill="none"
          stroke={B.goldBright}
          strokeWidth={0.8}
          opacity={0.5}
        />
        <ellipse
          cx={cx}
          cy={382}
          rx={60}
          ry={10}
          fill={`url(#baseGrad)`}
          stroke={B.goldDark}
          strokeWidth={1}
        />
        {/* Base ring detail */}
        <ellipse
          cx={cx}
          cy={376}
          rx={40}
          ry={7}
          fill={B.gold}
          stroke={B.goldDark}
          strokeWidth={0.8}
        />

        {/* ════ TALL FLUTED PILLAR ════ */}
        <rect
          x={cx - 10}
          y={pillarTop + 28}
          width={20}
          height={376 - pillarTop - 28}
          rx={4}
          fill={`url(#pillarGrad)`}
          stroke={B.goldDark}
          strokeWidth={0.8}
        />
        {/* Pillar shine */}
        <rect
          x={cx - 6}
          y={pillarTop + 30}
          width={5}
          height={376 - pillarTop - 32}
          rx={2.5}
          fill="rgba(255,255,255,0.15)"
        />
        {/* Pillar decorative rings */}
        {[pillarTop + 40, pillarTop + 55, 341, 356].map((ry, i) => (
          <React.Fragment key={`ring${i}`}>
            <ellipse
              cx={cx}
              cy={ry}
              rx={14}
              ry={3}
              fill={B.gold}
              stroke={B.goldDark}
              strokeWidth={0.6}
            />
            <ellipse
              cx={cx}
              cy={ry - 1}
              rx={12}
              ry={2}
              fill="none"
              stroke={B.goldBright}
              strokeWidth={0.5}
              opacity={0.5}
            />
          </React.Fragment>
        ))}

        {/* ════ ORNATE CROWN / FULCRUM ════ */}
        <g
          onClick={() => handlePartClick("fulcrum")}
          onMouseEnter={() => setHoverPart("fulcrum")}
          onMouseLeave={() => setHoverPart(null)}
          style={gl("fulcrum", B.goldBright)}
        >
          {/* Crown base */}
          <ellipse
            cx={cx}
            cy={pillarTop + 24}
            rx={18}
            ry={5}
            fill={`url(#crownGrad)`}
            stroke={B.goldDark}
            strokeWidth={1}
          />
          {/* Crown body — ornamental shape */}
          <path
            d={`M${cx - 14},${pillarTop + 20} Q${cx - 16},${pillarTop + 8} ${cx - 8},${pillarTop + 2} Q${cx - 4},${pillarTop - 4} ${cx},${pillarTop - 8} Q${cx + 4},${pillarTop - 4} ${cx + 8},${pillarTop + 2} Q${cx + 16},${pillarTop + 8} ${cx + 14},${pillarTop + 20}`}
            fill={`url(#crownGrad)`}
            stroke={B.goldDark}
            strokeWidth={1}
          />
          {/* Crown top finial */}
          <circle
            cx={cx}
            cy={pillarTop - 10}
            r={4}
            fill={B.goldBright}
            stroke={B.goldDark}
            strokeWidth={0.8}
          />
          <circle cx={cx} cy={pillarTop - 10} r={2} fill={B.goldLight} />
          {/* Crown scrollwork hints */}
          <path
            d={`M${cx - 6},${pillarTop + 6} Q${cx},${pillarTop - 2} ${cx + 6},${pillarTop + 6}`}
            fill="none"
            stroke={B.goldBright}
            strokeWidth={0.8}
            opacity={0.6}
          />
          <path
            d={`M${cx - 10},${pillarTop + 12} Q${cx},${pillarTop + 4} ${cx + 10},${pillarTop + 12}`}
            fill="none"
            stroke={B.goldBright}
            strokeWidth={0.6}
            opacity={0.4}
          />
          {isH("fulcrum") && (
            <text
              x={cx}
              y={pillarTop + 42}
              textAnchor="middle"
              fill={DS.orange}
              fontFamily={DS.font}
              fontSize="10"
              fontWeight="600"
              style={{ animation: "fadeInUp 0.25s ease" }}
            >
              Fulcrum (Crown Pivot)
            </text>
          )}
        </g>

        {/* ════ ROTATING GROUP ════ */}
        <g
          style={{
            transform: `rotate(${tilt}deg)`,
            transformOrigin: `${cx}px ${beamY}px`,
            transition: sc.animateBalance
              ? "transform 1.4s cubic-bezier(0.34,1.56,0.64,1)"
              : "none",
          }}
        >
          {/* ─── BEAM ─── */}
          <g
            onClick={() => handlePartClick("beam")}
            onMouseEnter={() => setHoverPart("beam")}
            onMouseLeave={() => setHoverPart(null)}
            style={gl("beam", B.gold)}
          >
            {/* Beam shadow */}
            <rect
              x={cx - bH - 8}
              y={beamY + 2}
              width={(bH + 8) * 2}
              height={7}
              rx={3.5}
              fill="rgba(0,0,0,0.06)"
            />
            {/* Beam body */}
            <rect
              x={cx - bH - 8}
              y={beamY - 5}
              width={(bH + 8) * 2}
              height={10}
              rx={5}
              fill={`url(#beamGrad)`}
              stroke={isH("beam") ? DS.indigo : B.goldDark}
              strokeWidth={isH("beam") ? 2 : 1}
              style={{ transition: "all 0.35s ease" }}
            />
            {/* Beam top highlight */}
            <rect
              x={cx - bH - 4}
              y={beamY - 4}
              width={(bH + 4) * 2}
              height={3}
              rx={1.5}
              fill="rgba(255,255,255,0.2)"
            />
            {/* Beam end ornaments */}
            <circle
              cx={cx - bH - 4}
              cy={beamY}
              r={6}
              fill={B.gold}
              stroke={B.goldDark}
              strokeWidth={1}
            />
            <circle
              cx={cx - bH - 4}
              cy={beamY}
              r={3}
              fill={B.goldBright}
              opacity={0.5}
            />
            <circle
              cx={cx + bH + 4}
              cy={beamY}
              r={6}
              fill={B.gold}
              stroke={B.goldDark}
              strokeWidth={1}
            />
            <circle
              cx={cx + bH + 4}
              cy={beamY}
              r={3}
              fill={B.goldBright}
              opacity={0.5}
            />
            {isH("beam") && (
              <text
                x={cx}
                y={beamY - 14}
                textAnchor="middle"
                fill={DS.indigo}
                fontFamily={DS.font}
                fontSize="10"
                fontWeight="600"
                style={{ animation: "fadeInDown 0.25s ease" }}
              >
                Beam
              </text>
            )}
          </g>

          {/* ─── POINTER ─── */}
          <g
            onClick={() => handlePartClick("pointer")}
            onMouseEnter={() => setHoverPart("pointer")}
            onMouseLeave={() => setHoverPart(null)}
            style={gl("pointer", DS.indigo)}
          >
            <line
              x1={cx}
              y1={beamY + 5}
              x2={cx}
              y2={beamY + 38}
              stroke={isH("pointer") ? DS.indigo : B.goldDark}
              strokeWidth={isH("pointer") ? 3 : 2}
              strokeLinecap="round"
              style={{ transition: "all 0.35s ease" }}
            />
            <polygon
              points={`${cx},${beamY + 42} ${cx - 4},${beamY + 35} ${cx + 4},${beamY + 35}`}
              fill={isH("pointer") ? DS.indigo : B.goldDark}
            />
            <circle
              cx={cx}
              cy={beamY + 43}
              r={2.5}
              fill={isH("pointer") ? DS.indigo : B.gold}
            />
            {isH("pointer") && (
              <text
                x={cx + 18}
                y={beamY + 42}
                fill={DS.indigo}
                fontFamily={DS.font}
                fontSize="10"
                fontWeight="600"
                style={{ animation: "fadeIn 0.25s ease" }}
              >
                Pointer
              </text>
            )}
          </g>

          {/* ─── LEFT CHAINS + PAN ─── */}
          {renderChains(cx - bH - 4, lx - 4, chainPanY, 0.1)}
          <g
            onClick={() => handlePartClick("leftPan")}
            onMouseEnter={() => setHoverPart("leftPan")}
            onMouseLeave={() => setHoverPart(null)}
            style={gl("leftPan", DS.indigo)}
          >
            {renderPan(lx - 4, chainPanY + 4, sLW, "left", 0.15)}
          </g>

          {/* ─── RIGHT CHAINS + PAN ─── */}
          {renderChains(cx + bH + 4, rx + 4, chainPanY, 0.12)}
          <g
            onClick={() => handlePartClick("rightPan")}
            onMouseEnter={() => setHoverPart("rightPan")}
            onMouseLeave={() => setHoverPart(null)}
            style={gl("rightPan", DS.orange)}
          >
            {renderPan(rx + 4, chainPanY + 4, sRW, "right", 0.2)}
          </g>
        </g>

        {/* ════ BALANCE STATUS ════ */}
        <g style={{ animation: "fadeIn 0.8s ease 0.9s both" }}>
          {Math.abs(tilt) < 0.5 ? (
            <g>
              <rect
                x={cx - 100}
                y={H - 32}
                width={200}
                height={26}
                rx={13}
                fill={DS.successBg}
                stroke={DS.successGreen}
                strokeWidth={1.2}
                opacity={0.9}
              />
              <text
                x={cx}
                y={H - 15}
                textAnchor="middle"
                fill={DS.successGreen}
                fontFamily={DS.font}
                fontSize="12"
                fontWeight="600"
              >
                ✅ Balanced — LHS = RHS
              </text>
            </g>
          ) : (
            <g>
              <rect
                x={cx - 100}
                y={H - 32}
                width={200}
                height={26}
                rx={13}
                fill={DS.cream}
                stroke={DS.lightOrange}
                strokeWidth={1.2}
                opacity={0.9}
              />
              <text
                x={cx}
                y={H - 15}
                textAnchor="middle"
                fill={DS.orange}
                fontFamily={DS.font}
                fontSize="12"
                fontWeight="600"
              >
                {tilt < 0 ? "⬅ Left is heavier" : "Right is heavier ➡"}
              </text>
            </g>
          )}
        </g>
      </svg>
    );
  };

  // ══════════ MCQ ══════════
  const renderMCQ = () => {
    if (!curMCQ) return null;
    return (
      <div
        style={{ animation: "fadeInUp 0.45s ease 0.2s both", padding: "0 4px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            maxWidth: 460,
            margin: "6px auto",
          }}
        >
          {curMCQ.options.map((o, i) => {
            const sel = selectedOption === o.value,
              corr = o.value === curMCQ.correctAnswer,
              done = mcqResult !== null;
            let bg = DS.white,
              bdr = DS.lightGrey,
              tc = DS.dark;
            if (done && corr) {
              bg = DS.successBg;
              bdr = DS.successGreen;
              tc = DS.successGreen;
            } else if (done && sel && !corr) {
              bg = DS.errorBg;
              bdr = DS.errorRed;
              tc = DS.errorRed;
            } else if (sel && !done) {
              bg = DS.lavender + "44";
              bdr = DS.indigo;
              tc = DS.indigo;
            }
            return (
              <button
                key={i}
                onClick={() => handleMCQ(o.value)}
                disabled={done}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  borderRadius: DS.radiusMd,
                  border: `2px solid ${bdr}`,
                  background: bg,
                  color: tc,
                  fontFamily: DS.font,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: done ? "default" : "pointer",
                  transition: "all 0.3s ease",
                  animation:
                    done && sel
                      ? corr
                        ? "correctPop 0.5s ease"
                        : "shakeWrong 0.5s ease"
                      : `fadeInUp 0.35s ease ${0.3 + i * 0.06}s both`,
                  opacity: done && !corr && !sel ? 0.4 : 1,
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: DS.radiusPill,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      done && corr
                        ? DS.successGreen
                        : done && sel && !corr
                          ? DS.errorRed
                          : DS.offWhite,
                    color:
                      done && (corr || (sel && !corr)) ? DS.white : DS.dark,
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                    transition: "all 0.3s ease",
                  }}
                >
                  {done && corr
                    ? "✓"
                    : done && sel && !corr
                      ? "✗"
                      : String.fromCharCode(65 + i)}
                </span>
                {o.label}
              </button>
            );
          })}
        </div>
        {mcqResult && (
          <div
            style={{
              textAlign: "center" as const,
              marginTop: 8,
              animation: "fadeInUp 0.35s ease",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px 20px",
                borderRadius: DS.radiusMd,
                background: mcqResult === "correct" ? DS.successBg : DS.cream,
                border: `2px solid ${mcqResult === "correct" ? DS.successGreen : DS.lightOrange}`,
              }}
            >
              <span
                style={{
                  fontFamily: DS.font,
                  fontSize: 14,
                  fontWeight: 700,
                  color: mcqResult === "correct" ? DS.successGreen : DS.orange,
                }}
              >
                {mcqResult === "correct" ? "🎉 Correct!" : "💡 Not quite!"}
              </span>
              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: 11.5,
                  color: DS.dark,
                  fontFamily: DS.font,
                  fontWeight: 500,
                  lineHeight: 1.4,
                  opacity: 0.8,
                }}
              >
                {curMCQ.explanation}
              </p>
            </div>
          </div>
        )}
        <div
          style={{
            textAlign: "center" as const,
            marginTop: 6,
            animation: "fadeIn 0.5s ease 0.6s both",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: DS.dark,
              fontFamily: DS.font,
              fontWeight: 600,
              opacity: 0.6,
            }}
          >
            Score: {mcqScore} / {MCQ_QUESTIONS.length}
          </span>
        </div>
      </div>
    );
  };

  // ══════════ DS BUTTON ══════════
  const DSBtn = ({
    children,
    onClick,
    variant = "contained",
    color = DS.indigo,
    id = "",
  }: {
    children?: React.ReactNode;
    onClick: () => void;
    variant?: "contained" | "outlined";
    color?: string;
    id?: string;
  }) => {
    const h = hoveredBtn === id;
    const s: React.CSSProperties =
      variant === "contained"
        ? {
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "6px 18px",
            height: 36,
            borderRadius: DS.radiusPill,
            border: "none",
            background: h ? DS.indigoHover : color,
            color: DS.white,
            fontFamily: DS.font,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.25s ease",
            boxShadow: h ? `0 4px 14px ${color}44` : `0 2px 8px ${color}22`,
          }
        : {
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "6px 18px",
            height: 36,
            borderRadius: DS.radiusPill,
            border: `2px solid ${color}`,
            background: h ? `${color}0A` : "transparent",
            color: color,
            fontFamily: DS.font,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.25s ease",
          };
    return (
      <button
        style={s}
        onClick={onClick}
        onMouseEnter={() => setHoveredBtn(id)}
        onMouseLeave={() => setHoveredBtn(null)}
      >
        {children ?? null}
      </button>
    );
  };

  // ══════════ MAIN ══════════
  return (
    <div
      style={{
        width: config.width,
        maxWidth: "100%",
        minHeight: config.height,
        background: dm
          ? "linear-gradient(160deg,#1a1a2e,#16213e 50%,#0f3460)"
          : `linear-gradient(160deg,${DS.white},${DS.offWhite} 50%,${DS.lavender}22)`,
        borderRadius: DS.radiusXl,
        overflow: "hidden",
        boxShadow: "0 16px 48px rgba(74,77,201,0.08)",
        fontFamily: DS.font,
        display: "flex",
        flexDirection: "column" as const,
        position: "relative" as const,
        border: `1px solid ${DS.lightGrey}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px 10px",
          background: `linear-gradient(135deg,${DS.indigo},${DS.purple})`,
          color: DS.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontFamily: DS.font,
              fontSize: 17,
              fontWeight: 700,
              animation: "fadeInDown 0.4s ease",
            }}
          >
            ⚖️ Weighing Scale Explorer
          </h2>
          <p
            style={{
              margin: "1px 0 0",
              fontSize: 10.5,
              opacity: 0.8,
              fontWeight: 500,
            }}
          >
            Introduction to Finding Unknowns • Chapter 7
          </p>
        </div>
        {config.showStepIndicator && (
          <div
            style={{
              background: "rgba(255,255,255,0.18)",
              borderRadius: DS.radiusPill,
              padding: "4px 12px",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {currentStepIndex + 1} / {modeSteps.length}
          </div>
        )}
      </div>
      {/* Mode tabs */}
      {config.showModeSelector && (
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: "10px 16px",
            background: DS.white,
            borderBottom: `1px solid ${DS.lightGrey}`,
          }}
        >
          {config.enabledModes.map((m) => {
            const mc = mCfg[m],
              Icon = mc.icon,
              a = selectedMode === m;
            return (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 18px",
                  height: 36,
                  borderRadius: DS.radiusPill,
                  border: a ? "none" : `1.5px solid ${DS.lightGrey}`,
                  background: a ? mc.color : DS.white,
                  color: a ? DS.white : DS.dark,
                  fontFamily: DS.font,
                  fontSize: 12.5,
                  fontWeight: a ? 600 : 500,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: a ? `0 3px 10px ${mc.color}33` : "none",
                }}
              >
                <Icon size={14} />
                {mc.label}
              </button>
            );
          })}
        </div>
      )}
      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column" as const,
          padding: "8px 16px 4px",
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "translateY(8px)" : "translateY(0)",
          transition: "all 0.26s ease",
        }}
        key={animKey}
      >
        <div
          style={{
            textAlign: "center" as const,
            marginBottom: 3,
            animation: "fadeInUp 0.4s ease",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: DS.font,
              fontSize: 15,
              color: dm ? DS.white : DS.purple,
              fontWeight: 700,
            }}
          >
            {currentStep?.title}
          </h3>
          <p
            style={{
              margin: "3px auto 0",
              fontSize: 12,
              color: dm ? DS.grey : DS.dark,
              lineHeight: 1.5,
              fontWeight: 500,
              maxWidth: 560,
              opacity: 0.8,
            }}
          >
            {currentStep?.description}
          </p>
        </div>
        <div
          style={{
            flex: selectedMode === "practice" ? "none" : 1,
            position: "relative" as const,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: selectedMode === "practice" ? 220 : 300,
          }}
        >
          {tooltipInfo && (
            <div
              style={{
                position: "absolute" as const,
                top: 4,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 20,
                background: DS.white,
                color: DS.dark,
                padding: "10px 18px",
                borderRadius: DS.radiusMd,
                fontFamily: DS.font,
                fontSize: 12,
                fontWeight: 500,
                boxShadow: "0 8px 28px rgba(74,77,201,0.12)",
                border: `2px solid ${DS.lavender}`,
                maxWidth: 420,
                textAlign: "center" as const,
                animation: "tooltipIn 0.3s ease",
                lineHeight: 1.5,
              }}
            >
              {tooltipInfo.text}
            </div>
          )}
          <div
            style={{
              width: "100%",
              maxWidth: 700,
              animation: "fadeIn 0.4s ease",
            }}
          >
            {renderScale()}
          </div>
        </div>
        {selectedMode !== "practice" &&
          Math.abs(tilt) < 0.5 &&
          sc.showWeightValues && (
            <div
              style={{
                textAlign: "center" as const,
                margin: "0 0 2px",
                animation: "popIn 0.45s ease 0.6s both",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 18px",
                  background: DS.lavender + "33",
                  borderRadius: DS.radiusPill,
                  border: `1.5px solid ${DS.lavender}`,
                }}
              >
                <span
                  style={{
                    fontFamily: DS.font,
                    fontSize: 14,
                    color: DS.indigo,
                    fontWeight: 700,
                  }}
                >
                  {sLW.filter((w) => w > 0).join(" + ")}
                </span>
                <span
                  style={{
                    fontFamily: DS.font,
                    fontSize: 16,
                    color: DS.dark,
                    fontWeight: 700,
                  }}
                >
                  =
                </span>
                <span
                  style={{
                    fontFamily: DS.font,
                    fontSize: 14,
                    color: DS.orange,
                    fontWeight: 700,
                  }}
                >
                  {sRW.filter((w) => w > 0).join(" + ")}
                </span>
              </div>
            </div>
          )}
        {selectedMode === "practice" && renderMCQ()}
      </div>
      {/* Nav */}
      {config.showNavigation && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "8px 16px 12px",
            background: DS.white,
            borderTop: `1px solid ${DS.lightGrey}`,
          }}
        >
          <DSBtn onClick={handlePrev} variant="outlined" id="prev">
            <ChevronLeft size={14} /> Prev
          </DSBtn>
          {config.showPlayPause && selectedMode !== "practice" && (
            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
                setStopAutoNext?.(isPlaying);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: DS.radiusPill,
                border: "none",
                background: `linear-gradient(135deg,${DS.indigo},${DS.purple})`,
                color: DS.white,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: `0 4px 14px ${DS.indigo}33`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
          )}
          <DSBtn onClick={handleNext} variant="contained" id="next">
            Next <ChevronRight size={14} />
          </DSBtn>
        </div>
      )}
    </div>
  );
};

export default WeighingScaleExplorer;
