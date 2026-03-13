// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: corresponding_angles_tool.tsx
// Redesigned with Singularity Design System — Fully Responsive
// ═══════════════════════════════════════════════════════════════════════════

/** Self-contained (no external React/icon imports) for typecheck without @types/react. */
declare const React: any;
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface Element {}
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}
type ReactNode = any;
type CSSProperties = Record<string, any>;
type FC<P = {}> = (props: P) => any;

const { useState, useEffect, useRef, useCallback, useMemo } = React;

type IconProps = { size?: number; style?: any; color?: string; [key: string]: any };
const IconBase = ({
  size = 16,
  style,
  color,
  children,
}: IconProps & { children?: ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color ?? "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);
const Play = (p: IconProps) => (
  <IconBase {...p}><path d="M8 5v14l11-7z" /></IconBase>
);
const Pause = (p: IconProps) => (
  <IconBase {...p}><path d="M6 4h4v16H6z" /><path d="M14 4h4v16h-4z" /></IconBase>
);
const ChevronLeft = (p: IconProps) => (
  <IconBase {...p}><path d="M15 18l-6-6 6-6" /></IconBase>
);
const ChevronRight = (p: IconProps) => (
  <IconBase {...p}><path d="M9 18l6-6-6-6" /></IconBase>
);
const RotateCcw = (p: IconProps) => (
  <IconBase {...p}><path d="M3 2v6h6" /><path d="M3.5 13a9 9 0 1 0 2-5.7L3 8" /></IconBase>
);
const Eye = (p: IconProps) => (
  <IconBase {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></IconBase>
);

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

interface CorrespondingAnglesAdditionalProps {
  lineAngle?: number;
  lineLColor?: string;
  lineMColor?: string;
  transversalColor?: string;
  pairColors?: {
    pair1?: string;
    pair2?: string;
    pair3?: string;
    pair4?: string;
  };
  showLabels?: boolean;
  showPositionBadges?: boolean;
  animationDuration?: number;
  highlightPairs?: number[];
  showConnectingLines?: boolean;
  parallelLines?: boolean;
}

interface CorrespondingAnglesToolProps {
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
    additionalProps?: CorrespondingAnglesAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN SYSTEM ====================

const DS = {
  primary: "#4A4DC9",
  accent: "#FF7212",
  gradientStart: "#533086",
  gradientEnd: "#FC9145",
  primaryLight: "#C1C1EA",
  accentLight: "#FFF3E4",
  dark: "#4E4E4E",
  grey: "#CACACA",
  lightGrey: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  primaryFilled: "#533086",
  accentFilled: "#FC9145",
  radius: { sm: 8, md: 12, lg: 20, xl: 24, full: 999 },
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 40 },
  font: "'Poppins', sans-serif",
};

const PAIR_COLORS = {
  pair1: "#4A4DC9",
  pair2: "#FF7212",
  pair3: "#533086",
  pair4: "#FC9145",
};
const PAIR_ARR = ["#4A4DC9", "#FF7212", "#533086", "#FC9145"];
const POSITION_LABELS = [
  "Both upper-left",
  "Both upper-right",
  "Both lower-left",
  "Both lower-right",
];
const BG_TINTS = [
  DS.primaryLight,
  DS.accentLight,
  DS.primaryLight + "80",
  DS.accentLight + "CC",
];
const DIMMED_COLOR = DS.lightGrey;

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Two Lines & A Transversal",
    description:
      "Here are two horizontal lines (l and m) crossed by a diagonal line called a transversal (t). Notice that 8 angles are formed — 4 at each intersection point. How many angles are at each point?",
    type: "intro",
    mode: "learn",
    data: { activeStep: 0 },
  },
  {
    id: 2,
    title: "Pair 1 — Upper-Left",
    description:
      "Look at ∠1 at the top intersection — it sits in the upper-left position. Now find the angle in the SAME position at the bottom intersection. That's ∠5! Both are upper-left. They are corresponding angles.",
    type: "explanation",
    mode: "learn",
    data: { activeStep: 1 },
  },
  {
    id: 3,
    title: "Pair 2 — Upper-Right",
    description:
      "Now look at ∠2 — it's in the upper-right position at the top intersection. Its corresponding angle at the bottom intersection is ∠6, also in the upper-right position!",
    type: "explanation",
    mode: "learn",
    data: { activeStep: 2 },
  },
  {
    id: 4,
    title: "Pair 3 — Lower-Left",
    description:
      "∠3 is in the lower-left at the top. Its partner is ∠7 at the bottom intersection, also lower-left. Same position = corresponding angles!",
    type: "explanation",
    mode: "learn",
    data: { activeStep: 3 },
  },
  {
    id: 5,
    title: "Pair 4 — Lower-Right",
    description:
      "Finally, ∠4 is lower-right at the top, and ∠8 is lower-right at the bottom. That completes all four pairs of corresponding angles!",
    type: "explanation",
    mode: "learn",
    data: { activeStep: 4 },
  },
  {
    id: 6,
    title: "All Four Pairs — Summary",
    description:
      "When a transversal crosses two lines, it creates 4 pairs of corresponding angles. Each pair shares the same position at their respective intersections. If the two lines are parallel, corresponding angles are always equal!",
    type: "explanation",
    mode: "learn",
    data: { activeStep: 5 },
  },
];

// ==================== ANIMATION HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

// ==================== MAIN COMPONENT ====================

type CorrespondingAnglesToolInnerProps =
  NonNullable<CorrespondingAnglesToolProps["props"]>;

const CorrespondingAnglesTool: FC<CorrespondingAnglesToolProps> = ({
  props: incomingProps,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const props: CorrespondingAnglesToolInnerProps = incomingProps ?? {};
  // ─── CONFIG ───
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: props.initialMode ?? ("learn" as ModeType),
      showModeSelector: props.showModeSelector ?? false,
      enabledModes: props.enabledModes ?? (["learn"] as ModeType[]),
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      initialStep: props.initialStep ?? 1,
      filterSteps: props.filterSteps ?? null,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration:
        props.autoPlayDuration ?? props.data?.autoPlayDuration ?? 8000,
      themeColor: props.themeColor ?? DS.primary,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const additionalProps: CorrespondingAnglesAdditionalProps = props.additionalProps ?? {};
  const toolConfig = useMemo(
    () => ({
      lineAngle: additionalProps.lineAngle ?? 25,
      lineLColor: additionalProps.lineLColor ?? DS.dark,
      lineMColor: additionalProps.lineMColor ?? DS.dark,
      transversalColor: additionalProps.transversalColor ?? "#7B7B9E",
      pairColors: {
        pair1: additionalProps.pairColors?.pair1 ?? PAIR_COLORS.pair1,
        pair2: additionalProps.pairColors?.pair2 ?? PAIR_COLORS.pair2,
        pair3: additionalProps.pairColors?.pair3 ?? PAIR_COLORS.pair3,
        pair4: additionalProps.pairColors?.pair4 ?? PAIR_COLORS.pair4,
      },
      showLabels: additionalProps.showLabels ?? true,
      showPositionBadges: additionalProps.showPositionBadges ?? true,
      animationDuration: additionalProps.animationDuration ?? 800,
      highlightPairs: additionalProps.highlightPairs ?? [1, 2, 3, 4],
      showConnectingLines: additionalProps.showConnectingLines ?? true,
      parallelLines: additionalProps.parallelLines ?? true,
    }),
    [additionalProps],
  );

  // ─── STATE ───
  const allSteps = props.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(() => {
    if (config.filterSteps && config.filterSteps.length > 0)
      return allSteps.filter((s) => config.filterSteps!.includes(s.id));
    return allSteps;
  }, [allSteps, config.filterSteps]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null as string | null);
  const [pressedBtn, setPressedBtn] = useState(null as string | null);
  const [containerWidth, setContainerWidth] = useState(config.width);
  const containerRef = useRef(null as any);
  const timerRef = useRef(undefined as any);
  const touchStartRef = useRef(0);

  const currentStep = availableSteps[currentStepIndex] || availableSteps[0];
  const activeVisualStep = currentStep?.data?.activeStep ?? 0;

  // ─── MEASURE CONTAINER ───
  useEffect(() => {
    const measure = () => {
      if (containerRef.current)
        setContainerWidth(containerRef.current.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // ─── BREAKPOINTS ───
  const isMobile = containerWidth < 480;
  const isTablet = containerWidth >= 480 && containerWidth < 700;

  // ─── RESPONSIVE TOKENS ───
  const r = useMemo(
    () => ({
      hPadX: isMobile ? 12 : isTablet ? 16 : 24,
      hPadY: isMobile ? 10 : 18,
      hGap: isMobile ? 8 : 12,
      iconSz: isMobile ? 26 : 36,
      iconR: isMobile ? 8 : 12,
      iconI: isMobile ? 13 : 18,
      titleSz: isMobile ? 13 : isTablet ? 15 : 18,
      subSz: isMobile ? 9 : 11,
      cMar: isMobile ? 8 : 16,
      cPadX: isMobile ? 10 : 18,
      cPadY: isMobile ? 10 : 14,
      cRad: isMobile ? 12 : 20,
      snSz: isMobile ? 22 : 28,
      snF: isMobile ? 10 : 13,
      stSz: isMobile ? 12.5 : 15,
      sdSz: isMobile ? 11 : 13,
      sGap: isMobile ? 8 : 12,
      nGap: isMobile ? 5 : 10,
      nPadY: isMobile ? 8 : 14,
      nPadB: isMobile ? 10 : 18,
      btn: isMobile ? 32 : 40,
      btnR: isMobile ? 8 : 12,
      btnI: isMobile ? 13 : 16,
      btnC: isMobile ? 15 : 18,
      dot: isMobile ? 7 : 10,
      dotA: isMobile ? 18 : 26,
      dotG: isMobile ? 3 : 6,
      dPad: isMobile ? 2 : isTablet ? 8 : 14,
      outerR: isMobile ? 14 : 24,
    }),
    [isMobile, isTablet],
  );

  // ─── INJECT KEYFRAMES ───
  useEffect(() => {
    const kf = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
            @keyframes singFadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
            @keyframes singFadeIn{from{opacity:0}to{opacity:1}}
            @keyframes singArcGlow{0%{opacity:0;stroke-width:2}40%{opacity:1;stroke-width:5}100%{opacity:1;stroke-width:3.5}}
            @keyframes singBadgeSlide{from{opacity:0;transform:translateX(-8px) scale(0.85)}to{opacity:1;transform:translateX(0) scale(1)}}
            @keyframes singConnDraw{from{stroke-dashoffset:200;opacity:0.2}to{stroke-dashoffset:0;opacity:1}}
            @keyframes singBounceIn{0%{transform:scale(0);opacity:0}50%{transform:scale(1.08);opacity:1}70%{transform:scale(0.96)}100%{transform:scale(1);opacity:1}}
            @keyframes singStepPop{0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
        `;
    const s = document.createElement("style");
    s.id = "sing-ca-kf";
    s.textContent = kf;
    document.head.appendChild(s);
    return () => {
      const e = document.getElementById("sing-ca-kf");
      if (e) e.remove();
    };
  }, []);

  // ─── AUTO-PLAY ───
  useEffect(() => {
    if (isPlaying && config.autoPlayDuration > 0) {
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < availableSteps.length - 1)
          setCurrentStepIndex((p) => p + 1);
        else setIsPlaying(false);
      }, config.autoPlayDuration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    isPlaying,
    currentStepIndex,
    config.autoPlayDuration,
    availableSteps.length,
  ]);

  // ─── REPORT STEP DETAILS ───
  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: availableSteps.length,
        isPaused: !isPlaying,
        currentMode: "learn",
      });
  }, [currentStepIndex, isPlaying, availableSteps.length, setStepDetails]);

  // ─── NAVIGATION ───
  const goNext = useCallback(() => {
    if (currentStepIndex < availableSteps.length - 1)
      setCurrentStepIndex((p) => p + 1);
  }, [currentStepIndex, availableSteps.length]);
  const goPrev = useCallback(() => {
    if (currentStepIndex > 0) setCurrentStepIndex((p) => p - 1);
  }, [currentStepIndex]);
  const goToStep = useCallback((i: number) => {
    setCurrentStepIndex(i);
    setIsPlaying(false);
  }, []);
  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  // ─── SWIPE ───
  const onTouchStart = (e: any) => {
    touchStartRef.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: any) => {
    const dx = e.changedTouches[0].clientX - touchStartRef.current;
    if (dx > 50) goPrev();
    else if (dx < -50) goNext();
  };

  // ─── GEOMETRY (fixed viewBox) ───
  const SVG_W = 780,
    SVG_H = 390;
  const geometry = useMemo(() => {
    const cx = SVG_W / 2,
      yT = SVG_H * 0.3,
      yB = SVG_H * 0.7,
      hl = SVG_W * 0.39;
    const lL = { x: cx - hl, y: yT },
      lR = { x: cx + hl, y: yT };
    const mL = { x: cx - hl, y: yB },
      mR = { x: cx + hl, y: yB };
    const ar = (toolConfig.lineAngle * Math.PI) / 180,
      tl = SVG_H * 0.92;
    const tT = { x: cx + (Math.sin(ar) * tl) / 2, y: SVG_H * 0.02 };
    const tB = { x: cx - (Math.sin(ar) * tl) / 2, y: SVG_H * 0.98 };
    const pL = (yT - tT.y) / (tB.y - tT.y),
      iL = { x: tT.x + pL * (tB.x - tT.x), y: yT };
    const pM = (yB - tT.y) / (tB.y - tT.y),
      iM = { x: tT.x + pM * (tB.x - tT.x), y: yB };
    const R = 28;
    const tuL = Math.atan2(tT.y - iL.y, tT.x - iL.x),
      tdL = Math.atan2(tB.y - iL.y, tB.x - iL.x);
    const tuM = Math.atan2(tT.y - iM.y, tT.x - iM.x),
      tdM = Math.atan2(tB.y - iM.y, tB.x - iM.x);
    return {
      lL,
      lR,
      mL,
      mR,
      tT,
      tB,
      iL,
      iM,
      R,
      aT: [
        { s: tuL, e: Math.PI, l: "1" },
        { s: 0, e: tuL, l: "2" },
        { s: Math.PI, e: tdL, l: "3" },
        { s: tdL, e: 0, l: "4" },
      ],
      aB: [
        { s: tuM, e: Math.PI, l: "5" },
        { s: 0, e: tuM, l: "6" },
        { s: Math.PI, e: tdM, l: "7" },
        { s: tdM, e: 0, l: "8" },
      ],
    };
  }, [toolConfig.lineAngle]);

  // ─── ARC HELPERS ───
  const arcPath = useCallback(
    (cx: number, cy: number, rad: number, sa: number, ea: number) => {
      let s = sa,
        e = ea,
        d = e - s;
      while (d < -Math.PI) d += 2 * Math.PI;
      while (d > Math.PI) d -= 2 * Math.PI;
      if (d < 0) {
        [s, e] = [e, s];
        d = -d;
      }
      return `M ${cx + rad * Math.cos(s)} ${cy + rad * Math.sin(s)} A ${rad} ${rad} 0 ${d > Math.PI ? 1 : 0} 1 ${cx + rad * Math.cos(e)} ${cy + rad * Math.sin(e)}`;
    },
    [],
  );

  const labelPos = useCallback(
    (cx: number, cy: number, rad: number, sa: number, ea: number) => {
      let s = sa,
        e = ea,
        d = e - s;
      while (d < -Math.PI) d += 2 * Math.PI;
      while (d > Math.PI) d -= 2 * Math.PI;
      if (d < 0) [s, e] = [e, s];
      const m = s + (e - s + (e < s ? 2 * Math.PI : 0)) / 2,
        lr = rad + 15;
      return { x: cx + lr * Math.cos(m), y: cy + lr * Math.sin(m) };
    },
    [],
  );

  // ─── COLOR LOGIC ───
  const getColor = useCallback(
    (pi: number) => {
      if (activeVisualStep === 0) return DIMMED_COLOR;
      if (activeVisualStep === 5) return PAIR_ARR[pi];
      if (pi === activeVisualStep - 1) return PAIR_ARR[pi];
      if (pi < activeVisualStep - 1) return PAIR_ARR[pi] + "70";
      return DIMMED_COLOR;
    },
    [activeVisualStep],
  );
  const showConn = useCallback(
    (pi: number) =>
      activeVisualStep === 5 ||
      (activeVisualStep > 0 && pi <= activeVisualStep - 1),
    [activeVisualStep],
  );
  const isCur = useCallback(
    (pi: number) =>
      activeVisualStep > 0 &&
      activeVisualStep < 5 &&
      pi === activeVisualStep - 1,
    [activeVisualStep],
  );

  // ─── RENDER SVG ELEMENTS ───
  const renderArc = useCallback(
    (
      ctr: { x: number; y: number },
      a: { s: number; e: number; l: string },
      pi: number,
      key: string,
    ) => {
      const c = getColor(pi),
        cur = isCur(pi),
        act =
          activeVisualStep === 5 ||
          (activeVisualStep > 0 && pi <= activeVisualStep - 1);
      const p = arcPath(ctr.x, ctr.y, geometry.R, a.s, a.e);
      const lp = labelPos(ctr.x, ctr.y, geometry.R, a.s, a.e);
      return (
        <g key={key}>
          {cur && (
            <path
              d={p}
              fill="none"
              stroke={c}
              strokeWidth={10}
              strokeLinecap="round"
              opacity={0.12}
              style={{ animation: "singArcGlow 0.8s ease-out forwards" }}
            />
          )}
          <path
            d={p}
            fill="none"
            stroke={c}
            strokeWidth={cur ? 4.5 : act ? 3 : 2}
            strokeLinecap="round"
            style={{
              transition: "stroke 0.5s,stroke-width 0.3s",
              animation: cur ? "singArcGlow 0.8s ease-out forwards" : "none",
            }}
          />
          {toolConfig.showLabels && (
            <text
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#1a1a1a"
              fontSize={cur ? 14 : 12}
              fontFamily={DS.font}
              fontWeight={cur ? 700 : 500}
              style={{ transition: "all 0.5s" }}
            >
              ∠{a.l}
            </text>
          )}
        </g>
      );
    },
    [
      getColor,
      isCur,
      activeVisualStep,
      arcPath,
      labelPos,
      geometry.R,
      toolConfig.showLabels,
    ],
  );

  const renderConn = useCallback(
    (pi: number) => {
      if (!showConn(pi) || activeVisualStep === 0) return null;
      const tp = labelPos(
        geometry.iL.x,
        geometry.iL.y,
        geometry.R + 6,
        geometry.aT[pi].s,
        geometry.aT[pi].e,
      );
      const bp = labelPos(
        geometry.iM.x,
        geometry.iM.y,
        geometry.R + 6,
        geometry.aB[pi].s,
        geometry.aB[pi].e,
      );
      const cur = isCur(pi);
      return (
        <line
          key={`c${pi}`}
          x1={tp.x}
          y1={tp.y}
          x2={bp.x}
          y2={bp.y}
          stroke={PAIR_ARR[pi]}
          strokeWidth={cur ? 2.5 : 1.5}
          strokeDasharray="8 5"
          strokeLinecap="round"
          opacity={cur ? 0.9 : 0.4}
          style={{
            animation: cur ? "singConnDraw 0.7s ease-out forwards" : "none",
          }}
        />
      );
    },
    [showConn, isCur, activeVisualStep, geometry, labelPos],
  );

  const renderBadge = useCallback(
    (pi: number) => {
      if (!toolConfig.showPositionBadges || activeVisualStep === 0) return null;
      if (activeVisualStep !== 5 && activeVisualStep - 1 !== pi) return null;
      const midY = (geometry.iL.y + geometry.iM.y) / 2,
        midX = (geometry.iL.x + geometry.iM.x) / 2;
      const offs = [
        { x: -125, y: -20 },
        { x: 85, y: -20 },
        { x: -125, y: 20 },
        { x: 85, y: 20 },
      ];
      const o = activeVisualStep === 5 ? offs[pi] : { x: 0, y: 0 };
      const bx = midX + o.x,
        by = midY + o.y,
        cur = isCur(pi);
      return (
        <g
          key={`b${pi}`}
          style={{
            animation: cur
              ? "singBadgeSlide 0.5s ease-out forwards"
              : activeVisualStep === 5
                ? "singFadeIn 0.5s ease-out forwards"
                : "none",
            animationDelay: activeVisualStep === 5 ? `${pi * 0.12}s` : "0.3s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <rect
            x={bx - 58}
            y={by - 13}
            width={116}
            height={26}
            rx={13}
            fill={BG_TINTS[pi]}
            opacity={0.7}
          />
          <rect
            x={bx - 58}
            y={by - 13}
            width={116}
            height={26}
            rx={13}
            fill="none"
            stroke={PAIR_ARR[pi]}
            strokeWidth={1.5}
            opacity={0.3}
          />
          <text
            x={bx}
            y={by + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={PAIR_ARR[pi]}
            fontSize={11}
            fontFamily={DS.font}
            fontWeight={600}
          >
            {POSITION_LABELS[pi]}
          </text>
        </g>
      );
    },
    [activeVisualStep, toolConfig.showPositionBadges, geometry, isCur],
  );

  // ─── BUTTON HELPERS ───
  const hoverProps = (id: string) => ({
    onMouseEnter: () => setHoveredBtn(id),
    onMouseLeave: () => {
      setHoveredBtn(null);
      setPressedBtn(null);
    },
    onMouseDown: () => setPressedBtn(id),
    onMouseUp: () => setPressedBtn(null),
    onTouchStart: () => setPressedBtn(id),
    onTouchEnd: () => {
      setPressedBtn(null);
      setHoveredBtn(null);
    },
  });

  const sz = r.btn,
    br = r.btnR;
  const btnBase = useCallback(
    (id: string, dis = false): CSSProperties => {
      if (dis)
        return {
          width: sz,
          height: sz,
          borderRadius: br,
          border: "none",
          background: DS.lightGrey,
          cursor: "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          opacity: 0.5,
          transition: "all 0.2s",
          flexShrink: 0,
        };
      const h = hoveredBtn === id,
        p = pressedBtn === id;
      return {
        width: sz,
        height: sz,
        borderRadius: br,
        border: "none",
        background: p ? DS.primary : h ? DS.primaryLight : DS.offWhite,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        transform: p ? "scale(0.93)" : h ? "scale(1.05)" : "scale(1)",
        boxShadow: h
          ? `0 4px 16px ${DS.primary}28`
          : "0 1px 4px rgba(0,0,0,0.05)",
        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
      };
    },
    [hoveredBtn, pressedBtn, sz, br],
  );

  const btnAccent = useCallback(
    (id: string): CSSProperties => {
      const h = hoveredBtn === id,
        p = pressedBtn === id;
      return {
        width: sz,
        height: sz,
        borderRadius: br,
        border: "none",
        background: p
          ? `linear-gradient(135deg,${DS.gradientStart},${DS.gradientEnd})`
          : h
            ? DS.accent
            : DS.primary,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        transform: p ? "scale(0.93)" : h ? "scale(1.05)" : "scale(1)",
        boxShadow: h
          ? `0 6px 20px ${DS.accent}40`
          : `0 2px 8px ${DS.primary}25`,
        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
      };
    },
    [hoveredBtn, pressedBtn, sz, br],
  );

  const btnOutline = useCallback(
    (id: string): CSSProperties => {
      const h = hoveredBtn === id,
        p = pressedBtn === id;
      return {
        width: sz,
        height: sz,
        borderRadius: br,
        border: `1.5px solid ${h ? DS.primary : DS.grey}`,
        background: p ? DS.primaryLight : h ? `${DS.primaryLight}50` : DS.white,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        transform: p ? "scale(0.93)" : h ? "scale(1.05)" : "scale(1)",
        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
      };
    },
    [hoveredBtn, pressedBtn, sz, br],
  );

  // ─── RENDER ───
  const { lL, lR, mL, mR, tT, tB, iL, iM, aT, aB } = geometry;

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        width: "100%",
        maxWidth: config.width,
        fontFamily: DS.font,
        background: DS.white,
        borderRadius: r.outerR,
        overflow: "hidden",
        boxShadow: `0 4px 32px ${DS.primary}10, 0 1px 4px rgba(0,0,0,0.04)`,
        border: `1px solid ${DS.lightGrey}`,
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: `${r.hPadY}px ${r.hPadX}px ${r.hPadY - 4}px`,
          background: `linear-gradient(135deg,${DS.gradientStart},${DS.gradientEnd})`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {!isMobile && (
          <>
            <div
              style={{
                position: "absolute",
                top: -25,
                right: -25,
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -12,
                right: 70,
                width: 55,
                height: 55,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
              }}
            />
          </>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: r.hGap,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: r.iconSz,
              height: r.iconSz,
              borderRadius: r.iconR,
              background: "rgba(255,255,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.12)",
              flexShrink: 0,
            }}
          >
            <Eye size={r.iconI} color={DS.white} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h2
              style={{
                margin: 0,
                fontFamily: DS.font,
                fontSize: r.titleSz,
                fontWeight: 700,
                color: DS.white,
                letterSpacing: -0.2,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Corresponding Angles
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: r.subSz,
                color: "rgba(255,255,255,0.65)",
                fontWeight: 500,
                letterSpacing: 0.3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {isMobile
                ? "Grade 7 • Ganita Prakash"
                : "Definition & Identification • Grade 7 • Ganita Prakash"}
            </p>
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      <div style={{ height: 3, background: DS.lightGrey }}>
        <div
          style={{
            height: "100%",
            width: `${((currentStepIndex + 1) / availableSteps.length) * 100}%`,
            background: `linear-gradient(90deg,${DS.primary},${DS.accent})`,
            borderRadius: "0 2px 2px 0",
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>

      {/* DIAGRAM — fluid SVG */}
      <div
        style={{
          width: "100%",
          padding: `${r.dPad}px ${r.dPad}px ${Math.max(r.dPad - 4, 0)}px`,
          boxSizing: "border-box" as const,
        }}
      >
        <svg
          width="100%"
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ display: "block", overflow: "visible" }}
        >
          <defs>
            <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={DS.gradientStart} />
              <stop offset="100%" stopColor={DS.gradientEnd} />
            </linearGradient>
            <linearGradient id="sgl" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                stopColor={DS.primaryLight}
                stopOpacity={0.12}
              />
              <stop
                offset="100%"
                stopColor={DS.accentLight}
                stopOpacity={0.12}
              />
            </linearGradient>
          </defs>
          <rect
            width={SVG_W}
            height={SVG_H}
            fill={DS.white}
            rx={DS.radius.lg}
          />
          <rect
            width={SVG_W}
            height={SVG_H}
            fill="url(#sgl)"
            rx={DS.radius.lg}
          />
          {toolConfig.parallelLines && (
            <>
              <polygon
                points={`${lL.x + 70},${lL.y - 5} ${lL.x + 78},${lL.y} ${lL.x + 70},${lL.y + 5}`}
                fill={DS.primary}
                opacity={0.35}
              />
              <polygon
                points={`${mL.x + 70},${mL.y - 5} ${mL.x + 78},${mL.y} ${mL.x + 70},${mL.y + 5}`}
                fill={DS.primary}
                opacity={0.35}
              />
            </>
          )}
          <line
            x1={lL.x}
            y1={lL.y}
            x2={lR.x}
            y2={lR.y}
            stroke={toolConfig.lineLColor}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <text
            x={lR.x + 14}
            y={lL.y + 5}
            fill={DS.primary}
            fontSize={16}
            fontFamily={DS.font}
            fontWeight={700}
            fontStyle="italic"
          >
            l
          </text>
          <line
            x1={mL.x}
            y1={mL.y}
            x2={mR.x}
            y2={mR.y}
            stroke={toolConfig.lineMColor}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <text
            x={mR.x + 14}
            y={mL.y + 5}
            fill={DS.primary}
            fontSize={16}
            fontFamily={DS.font}
            fontWeight={700}
            fontStyle="italic"
          >
            m
          </text>
          <line
            x1={tT.x}
            y1={tT.y}
            x2={tB.x}
            y2={tB.y}
            stroke={toolConfig.transversalColor}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <text
            x={tB.x - 18}
            y={tB.y - 6}
            fill={DS.accent}
            fontSize={16}
            fontFamily={DS.font}
            fontWeight={700}
            fontStyle="italic"
          >
            t
          </text>
          {aT.map((a, i) => renderArc(iL, a, i, `t-${i}`))}
          {aB.map((a, i) => renderArc(iM, a, i, `b-${i}`))}
          {[0, 1, 2, 3].map((i) => renderConn(i))}
          {[0, 1, 2, 3].map((i) => renderBadge(i))}
          {activeVisualStep === 5 && (
            <g style={{ animation: "singBounceIn 0.6s ease-out 0.7s both" }}>
              <rect
                x={SVG_W / 2 - 140}
                y={SVG_H - 46}
                width={280}
                height={38}
                rx={19}
                fill="url(#sg)"
              />
              <text
                x={SVG_W / 2}
                y={SVG_H - 24}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={DS.white}
                fontSize={14}
                fontFamily={DS.font}
                fontWeight={700}
                letterSpacing={0.5}
              >
                4 pairs of corresponding angles
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* STEP CARD */}
      <div
        key={currentStepIndex}
        style={{
          margin: `0 ${r.cMar}px`,
          padding: `${r.cPadY}px ${r.cPadX}px`,
          background: DS.offWhite,
          borderRadius: r.cRad,
          border: `1px solid ${DS.lightGrey}`,
          animation: "singFadeInUp 0.4s ease-out",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: r.sGap }}>
          <div
            style={{
              minWidth: r.snSz,
              height: r.snSz,
              borderRadius: DS.radius.full,
              background: `linear-gradient(135deg,${DS.gradientStart},${DS.gradientEnd})`,
              color: DS.white,
              fontSize: r.snF,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: DS.font,
              animation: "singStepPop 0.35s ease-out",
              boxShadow: `0 2px 8px ${DS.primary}30`,
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            {currentStepIndex + 1}
          </div>
          <div style={{ minWidth: 0 }}>
            <h3
              style={{
                margin: 0,
                fontFamily: DS.font,
                fontSize: r.stSz,
                fontWeight: 700,
                color: DS.dark,
                lineHeight: 1.3,
              }}
            >
              {currentStep?.title}
            </h3>
            <p
              style={{
                margin: "3px 0 0",
                fontSize: r.sdSz,
                lineHeight: 1.5,
                color: "#6B6B6B",
                fontWeight: 400,
              }}
            >
              {currentStep?.description}
            </p>
          </div>
        </div>
      </div>

      {/* NAV */}
      {config.showNavigation && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: r.nGap,
            padding: `${r.nPadY}px ${r.cMar}px ${r.nPadB}px`,
            flexWrap: "nowrap",
          }}
        >
          <button
            onClick={reset}
            {...hoverProps("rst")}
            style={btnOutline("rst")}
            title="Reset"
          >
            <RotateCcw
              size={r.btnI}
              color={hoveredBtn === "rst" ? DS.primary : DS.dark}
            />
          </button>
          <button
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            {...hoverProps("prv")}
            style={btnBase("prv", currentStepIndex === 0)}
          >
            <ChevronLeft
              size={r.btnC}
              color={
                currentStepIndex === 0
                  ? DS.grey
                  : pressedBtn === "prv"
                    ? DS.white
                    : hoveredBtn === "prv"
                      ? DS.primary
                      : DS.dark
              }
            />
          </button>
          {config.showStepIndicator && (
            <div
              style={{
                display: "flex",
                gap: r.dotG,
                alignItems: "center",
                padding: "0 2px",
                flexShrink: 1,
                minWidth: 0,
              }}
            >
              {availableSteps.map((_, i) => {
                const a = i === currentStepIndex,
                  d = i < currentStepIndex;
                return (
                  <button
                    key={i}
                    onClick={() => goToStep(i)}
                    {...hoverProps(`d${i}`)}
                    style={{
                      width: a ? r.dotA : r.dot,
                      height: r.dot,
                      borderRadius: DS.radius.full,
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      background: a
                        ? `linear-gradient(90deg,${DS.primary},${DS.accent})`
                        : d
                          ? DS.primaryLight
                          : DS.lightGrey,
                      transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                      transform:
                        hoveredBtn === `d${i}` && !a
                          ? "scale(1.4)"
                          : "scale(1)",
                      boxShadow: a ? `0 2px 8px ${DS.primary}40` : "none",
                      flexShrink: 0,
                    }}
                  />
                );
              })}
            </div>
          )}
          {config.showPlayPause && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              {...hoverProps("ply")}
              style={btnAccent("ply")}
            >
              {isPlaying ? (
                <Pause size={r.btnI} color={DS.white} />
              ) : (
                <Play
                  size={r.btnI}
                  color={DS.white}
                  style={{ marginLeft: 1 }}
                />
              )}
            </button>
          )}
          <button
            onClick={goNext}
            disabled={currentStepIndex === availableSteps.length - 1}
            {...hoverProps("nxt")}
            style={btnBase(
              "nxt",
              currentStepIndex === availableSteps.length - 1,
            )}
          >
            <ChevronRight
              size={r.btnC}
              color={
                currentStepIndex === availableSteps.length - 1
                  ? DS.grey
                  : pressedBtn === "nxt"
                    ? DS.white
                    : hoveredBtn === "nxt"
                      ? DS.primary
                      : DS.dark
              }
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default CorrespondingAnglesTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
