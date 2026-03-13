// @ts-nocheck
// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: right_angle_constructor.tsx
// Redesigned with Singularity Design System — Fully Responsive
// ═══════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Target,
  Lightbulb,
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
interface RightAngleAdditionalProps {
  baseLine?: {
    [k: string]: {
      label?: string;
      pointO?: { x: number; y: number };
      visible?: boolean;
      highlighted?: boolean;
    };
  };
  equalMarks?: {
    [k: string]: {
      label?: string;
      pointX?: { x: number; y: number } | null;
      pointY?: { x: number; y: number } | null;
      visible?: boolean;
      showOXequalsOY?: boolean;
    };
  };
  arcsAbove?: {
    [k: string]: {
      label?: string;
      visible?: boolean;
      arcFromX?: boolean;
      arcFromY?: boolean;
      intersectionA?: { x: number; y: number } | null;
    };
  };
  perpendicularRay?: {
    [k: string]: {
      label?: string;
      drawn?: boolean;
      visible?: boolean;
      angleMarker?: boolean;
    };
  };
  annotationPanel?: {
    [k: string]: { text?: string; showKeyInsight?: boolean };
  };
}
interface RightAngleConstructorProps {
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
    additionalProps?: RightAngleAdditionalProps;
  };
  setStepDetails?: (s: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (s: boolean) => void;
}

// ==================== DESIGN SYSTEM TOKENS ====================

const DS = {
  primary: "#4A4DC9",
  primaryLight: "#C1C1EA",
  primaryBg: "#EEEEF8",
  orange: "#FF7212",
  orangeLight: "#FFF3E4",
  orangeAlt: "#FC9145",
  gradientStart: "#533086",
  gradientEnd: "#FC9145",
  dark: "#4E4E4E",
  gray: "#CACACA",
  lightGray: "#EBEBEB",
  lightest: "#F5F5F5",
  white: "#FFFFFF",
  success: "#2ECC71",
  error: "#E74C3C",
  font: "'Poppins', 'Segoe UI', sans-serif",
  radius: 12,
  radiusSm: 8,
  radiusLg: 20,
  radiusXl: 24,
};

// ==================== RESPONSIVE BREAKPOINT HELPER ====================

type Breakpoint = "xs" | "sm" | "md" | "lg";

const getBreakpoint = (w: number): Breakpoint => {
  if (w < 360) return "xs"; // small phones
  if (w < 576) return "sm"; // phones
  if (w < 768) return "md"; // tablets
  return "lg"; // desktop
};

const useContainerWidth = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [width, setWidth] = useState(800);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    ro.observe(ref.current);
    setWidth(ref.current.offsetWidth);
    return () => ro.disconnect();
  }, [ref]);
  return width;
};

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Starting Point",
    description:
      "Here is a line with point O marked on it. Our goal: construct a 90° angle at O using only a compass and straightedge.",
    type: "intro",
    mode: "learn",
  },
  {
    id: 2,
    title: "Mark Equal Distances",
    description:
      "Using the compass, mark points X and Y equidistant from O on either side. Now O is the midpoint of XY!",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 3,
    title: "Draw Arcs Above",
    description:
      "Draw arcs from X and Y above the line — they meet at point A. Only ONE pair of arcs needed since O is already on the bisector!",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 4,
    title: "Complete the 90° Angle",
    description:
      "Draw ray OA. The angle between OA and the base line is exactly 90°. This is the perpendicular bisector of XY passing through its midpoint O.",
    type: "explanation",
    mode: "learn",
  },
  {
    id: 10,
    title: "Question 1",
    description: "",
    type: "practice",
    mode: "practice",
    data: {
      question:
        "What is the first step in constructing a 90° angle at point O on a line?",
      options: [
        "Draw a ray from O in any direction",
        "Mark points X and Y equidistant from O on the line",
        "Draw arcs above and below the line",
        "Use a protractor to measure 90°",
      ],
      correctIndex: 1,
      explanation:
        "We first mark points X and Y on the line such that OX = OY, making O the midpoint of segment XY.",
      visStep: 2,
    },
  },
  {
    id: 11,
    title: "Question 2",
    description: "",
    type: "practice",
    mode: "practice",
    data: {
      question: "Why do we mark X and Y such that OX = OY?",
      options: [
        "So that XY becomes a diameter of a circle",
        "So that O becomes the midpoint of XY and lies on its perpendicular bisector",
        "To make the line longer",
        "To create an equilateral triangle",
      ],
      correctIndex: 1,
      explanation:
        "When OX = OY, O is the midpoint of XY. The perpendicular bisector of any segment passes through its midpoint — so it must pass through O!",
      visStep: 2,
    },
  },
  {
    id: 12,
    title: "Question 3",
    description: "",
    type: "practice",
    mode: "practice",
    data: {
      question:
        "How many pairs of intersecting arcs do we need to draw for this construction?",
      options: [
        "Two pairs — one above and one below the line",
        "Three pairs for accuracy",
        "Only one pair — above the line",
        "No arcs are needed",
      ],
      correctIndex: 2,
      explanation:
        "Only ONE pair of arcs (above the line) is needed! Since O is already on the perpendicular bisector, we only need one more point (A) to define the bisector line.",
      visStep: 3,
    },
  },
  {
    id: 13,
    title: "Question 4",
    description: "",
    type: "practice",
    mode: "practice",
    data: {
      question:
        "When we draw ray OA, what angle does it make with the base line?",
      options: [
        "60° on both sides",
        "45° on one side and 135° on the other",
        "90° on both sides",
        "It depends on the radius of the arcs",
      ],
      correctIndex: 2,
      explanation:
        "Ray OA is perpendicular to the base line, creating exactly 90° on both sides. This is because OA lies on the perpendicular bisector of XY.",
      visStep: 4,
    },
  },
  {
    id: 14,
    title: "Question 5",
    description: "",
    type: "practice",
    mode: "practice",
    data: {
      question:
        "The 90° angle construction is essentially the same as which construction?",
      options: [
        "Angle bisector construction",
        "Perpendicular bisector construction",
        "Equilateral triangle construction",
        "Parallel line construction",
      ],
      correctIndex: 1,
      explanation:
        "The 90° angle construction is the perpendicular bisector method applied strategically — by choosing O as the midpoint of XY, the perpendicular bisector passes through O, creating a 90° angle.",
      visStep: 4,
    },
  },
];

// ==================== EASING HELPERS ====================

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const easeOutElastic = (t: number) => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};
const lerp = (a: number, b: number, t: number) =>
  a + (b - a) * Math.max(0, Math.min(1, t));
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

// ==================== KEYFRAMES ====================

const keyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
    @keyframes pulseGlow { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
    @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes stepFadeIn { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
    @keyframes insightPulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,114,18,0)} 50%{box-shadow:0 0 16px 3px rgba(255,114,18,.15)} }
    @keyframes optionEnter { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
`;

// ==================== MAIN COMPONENT ====================

const RightAngleConstructor: React.FC<RightAngleConstructorProps> = ({
  props,
  setStepDetails,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);
  const bp = getBreakpoint(containerWidth);
  const isMobile = bp === "xs" || bp === "sm";
  const isTablet = bp === "md";

  // ─── Responsive spacing/sizing ───
  const R = useMemo(
    () => ({
      px: isMobile ? 14 : isTablet ? 18 : 24, // horizontal padding
      py: isMobile ? 10 : isTablet ? 12 : 14, // vertical padding
      headerPy: isMobile ? 14 : isTablet ? 16 : 20,
      headerPx: isMobile ? 14 : isTablet ? 18 : 24,
      titleSize: isMobile ? 14 : isTablet ? 15.5 : 17,
      subtitleSize: isMobile ? 10.5 : isTablet ? 11 : 12,
      iconBox: isMobile ? 32 : isTablet ? 36 : 40,
      iconSize: isMobile ? 16 : isTablet ? 18 : 20,
      modeBtnPx: isMobile ? 14 : isTablet ? 18 : 24,
      modeBtnPy: isMobile ? 8 : 10,
      modeBtnFont: isMobile ? 12 : 13,
      modeBtnIcon: isMobile ? 13 : 15,
      canvasMinH: isMobile ? 180 : isTablet ? 220 : 280,
      canvasRadius: isMobile ? 12 : DS.radiusLg,
      questionFont: isMobile ? 13 : isTablet ? 14 : 15,
      optionFont: isMobile ? 12 : isTablet ? 12.5 : 13.5,
      optionPx: isMobile ? 10 : isTablet ? 12 : 16,
      optionPy: isMobile ? 9 : isTablet ? 10 : 12,
      optionLabel: isMobile ? 24 : 28,
      optionLabelFont: isMobile ? 11 : 13,
      optionGap: isMobile ? 7 : isTablet ? 8 : 10,
      btnPx: isMobile ? 20 : isTablet ? 24 : 32,
      btnPy: isMobile ? 8 : 10,
      btnFont: isMobile ? 12.5 : isTablet ? 13 : 14,
      btnRadius: 40,
      navBtnSize: isMobile ? 34 : 40,
      navIconSize: isMobile ? 16 : 18,
      dotActive: isMobile ? 22 : 28,
      dotInactive: isMobile ? 8 : 10,
      dotH: isMobile ? 8 : 10,
      annoFont: isMobile ? 12 : 13,
      annoIcon: isMobile ? 26 : 32,
      annoIconInner: isMobile ? 14 : 16,
      descTitleFont: isMobile ? 12.5 : isTablet ? 13 : 14,
      descFont: isMobile ? 11.5 : isTablet ? 12 : 13,
      scoreBadgeFont: isMobile ? 11 : 12,
      explFont: isMobile ? 11.5 : isTablet ? 12 : 13,
      containerRadius: isMobile ? 16 : DS.radiusXl,
      gap: isMobile ? 8 : isTablet ? 10 : 12,
    }),
    [isMobile, isTablet],
  );

  const config = useMemo(
    () => ({
      initialMode: props?.initialMode ?? ("learn" as ModeType),
      showModeSelector: props?.showModeSelector ?? true,
      enabledModes: (props?.enabledModes ?? ["learn", "practice"]) as ModeType[],
      showNavigation: props?.showNavigation ?? true,
      filterSteps: props?.filterSteps ?? null,
      animationSpeed: props?.animationSpeed ?? 1,
      autoPlayDuration: props?.autoPlayDuration ?? 10000,
      darkMode: props?.darkMode ?? false,
    }),
    [props],
  );

  const additionalProps = props?.additionalProps || {};
  const geoConfig = useMemo(
    () => ({
      pointO: additionalProps.baseLine?.step1?.pointO ?? { x: 350, y: 270 },
      pointX: additionalProps.equalMarks?.step2?.pointX ?? { x: 170, y: 270 },
      pointY: additionalProps.equalMarks?.step2?.pointY ?? { x: 530, y: 270 },
      intersectionA: additionalProps.arcsAbove?.step3?.intersectionA ?? {
        x: 350,
        y: 80,
      },
    }),
    [additionalProps],
  );

  const allSteps = props?.steps || DEFAULT_STEPS;
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
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  // Animation
  const [animProgress, setAnimProgress] = useState(0);
  const animFrameRef = useRef<number>(0);
  const animStartRef = useRef<number>(0);
  const ANIM_DURATION = 3500 / config.animationSpeed;
  const startAnimation = useCallback(() => {
    setAnimProgress(0);
    cancelAnimationFrame(animFrameRef.current);
    animStartRef.current = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - animStartRef.current) / ANIM_DURATION, 1);
      setAnimProgress(p);
      if (p < 1) animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, [ANIM_DURATION]);
  useEffect(() => {
    startAnimation();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [currentStepIndex, selectedMode, startAnimation]);

  // MCQ state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const svgRef = useRef<SVGSVGElement>(null);
  const modeSteps = useMemo(
    () => availableSteps.filter((s) => s.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const currentStep = modeSteps[currentStepIndex] || modeSteps[0];
  const learnStepNum = selectedMode === "learn" ? (currentStep?.id ?? 1) : 1;

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "ra-ds";
    el.textContent = keyframes;
    document.head.appendChild(el);
    return () => {
      document.getElementById("ra-ds")?.remove();
    };
  }, []);
  useEffect(() => {
    setStepDetails?.({
      currentStep: currentStepIndex + 1,
      totalSteps: modeSteps.length,
      isPaused: true,
      currentMode: selectedMode,
    });
  }, [currentStepIndex, modeSteps.length, selectedMode]);

  const goToNext = useCallback(() => {
    if (currentStepIndex < modeSteps.length - 1)
      setCurrentStepIndex((i) => i + 1);
  }, [currentStepIndex, modeSteps.length]);
  const goToPrev = useCallback(() => {
    if (currentStepIndex > 0) setCurrentStepIndex((i) => i - 1);
  }, [currentStepIndex]);
  const handleModeChange = useCallback((m: ModeType) => {
    setSelectedMode(m);
    setCurrentStepIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setScore(0);
    setTotalAnswered(0);
  }, []);
  const handleOptionSelect = useCallback(
    (i: number) => {
      if (!hasAnswered) setSelectedOption(i);
    },
    [hasAnswered],
  );
  const handleSubmitAnswer = useCallback(() => {
    if (selectedOption === null || hasAnswered) return;
    setHasAnswered(true);
    setTotalAnswered((p) => p + 1);
    if (selectedOption === currentStep?.data?.correctIndex)
      setScore((p) => p + 1);
  }, [selectedOption, hasAnswered, currentStep]);
  const handleNextQuestion = useCallback(() => {
    if (currentStepIndex < modeSteps.length - 1) {
      setCurrentStepIndex((i) => i + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    }
  }, [currentStepIndex, modeSteps.length]);

  const visStep =
    selectedMode === "learn" ? learnStepNum : (currentStep?.data?.visStep ?? 1);

  const annotation = useMemo(() => {
    const k = `step${visStep}`;
    const a = additionalProps.annotationPanel?.[k];
    if (a?.text) return { text: a.text, insight: a.showKeyInsight ?? false };
    const d: Record<number, { text: string; insight: boolean }> = {
      1: {
        text: "Goal: Construct a 90° angle at point O using compass and straightedge only.",
        insight: false,
      },
      2: {
        text: "By marking OX = OY, we made O the midpoint of segment XY. The perpendicular bisector of XY must pass through O!",
        insight: true,
      },
      3: {
        text: "Since O is already on the perpendicular bisector, we only need ONE more point on it. One pair of arcs gives us point A.",
        insight: true,
      },
      4: {
        text: "Key Insight: The 90° angle construction is just the perpendicular bisector applied to a segment whose midpoint is your chosen point O.",
        insight: true,
      },
    };
    return d[visStep] || d[1];
  }, [visStep, additionalProps]);

  // ════════════════════ SVG ════════════════════

  const renderSVG = () => {
    const { pointO, pointX, pointY, intersectionA } = geoConfig;
    const arcRadius = Math.hypot(
      intersectionA.x - pointX.x,
      intersectionA.y - pointX.y,
    );
    const lineStartX = 30,
      lineEndX = 670;
    const p = animProgress;
    const subP = (s: number, e: number) => clamp01((p - s) / (e - s));
    const lineDrawn = visStep > 1 ? 1 : easeOutCubic(subP(0, 0.4));
    const oAppear = visStep > 1 ? 1 : easeOutBack(subP(0.35, 0.6));
    const oLabel = visStep > 1 ? 1 : easeOutCubic(subP(0.5, 0.7));
    const xIn =
      visStep > 2 ? 1 : visStep === 2 ? easeOutBack(subP(0, 0.25)) : 0;
    const yIn =
      visStep > 2 ? 1 : visStep === 2 ? easeOutBack(subP(0.1, 0.35)) : 0;
    const sweep2 = visStep === 2 ? subP(0, 0.35) : 0;
    const ticks =
      visStep > 2 ? 1 : visStep >= 2 ? easeOutCubic(subP(0.35, 0.55)) : 0;
    const eqLbl =
      visStep > 2 ? 1 : visStep >= 2 ? easeOutBack(subP(0.55, 0.75)) : 0;
    const midB =
      visStep === 2 ? easeOutBack(subP(0.75, 0.95)) : visStep > 2 ? 1 : 0;
    const arcXD =
      visStep > 3 ? 1 : visStep === 3 ? easeInOutQuad(subP(0, 0.35)) : 0;
    const arcYD =
      visStep > 3 ? 1 : visStep === 3 ? easeInOutQuad(subP(0.15, 0.5)) : 0;
    const ptA =
      visStep > 3 ? 1 : visStep === 3 ? easeOutElastic(subP(0.45, 0.7)) : 0;
    const callout = visStep === 3 ? easeOutCubic(subP(0.65, 0.9)) : 0;
    const rayD = visStep === 4 ? easeOutCubic(subP(0, 0.4)) : 0;
    const angL = visStep === 4 ? easeOutCubic(subP(0.35, 0.6)) : 0;
    const angR = visStep === 4 ? easeOutCubic(subP(0.4, 0.65)) : 0;
    const angLbl = visStep === 4 ? easeOutBack(subP(0.6, 0.8)) : 0;
    const celeb = visStep === 4 ? easeOutCubic(subP(0.8, 1)) : 0;
    const buildArc = (
      cx: number,
      cy: number,
      r: number,
      sd: number,
      ed: number,
    ) => {
      const s2 = (sd * Math.PI) / 180,
        e2 = (ed * Math.PI) / 180;
      return `M ${cx + r * Math.cos(s2)} ${cy + r * Math.sin(s2)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(e2)} ${cy + r * Math.sin(e2)}`;
    };
    const arcXPath = buildArc(pointX.x, pointX.y, arcRadius, -150, -30);
    const arcYPath = buildArc(pointY.x, pointY.y, arcRadius, -150, -30);
    const arcLen = arcRadius * ((120 * Math.PI) / 180);

    return (
      <svg
        ref={svgRef}
        viewBox="0 0 700 400"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <marker
            id="ah"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={DS.orange} />
          </marker>
          <radialGradient id="pg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={DS.orange} stopOpacity="0.7" />
            <stop offset="100%" stopColor={DS.orange} stopOpacity="0" />
          </radialGradient>
          <filter id="gl">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="gl2">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {Array.from({ length: 14 }, (_, i) =>
          Array.from({ length: 8 }, (_, j) => (
            <circle
              key={`g${i}${j}`}
              cx={50 * i + 25}
              cy={50 * j + 25}
              r={0.6}
              fill={DS.lightGray}
              opacity={0.5}
            />
          )),
        )}
        <line
          x1={lerp(pointO.x, lineStartX, lineDrawn)}
          y1={pointO.y}
          x2={lerp(pointO.x, lineEndX, lineDrawn)}
          y2={pointO.y}
          stroke={DS.dark}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {lineDrawn > 0.85 && (
          <>
            <polygon
              points={`${lineEndX - 9},${pointO.y - 5} ${lineEndX},${pointO.y} ${lineEndX - 9},${pointO.y + 5}`}
              fill={DS.dark}
              opacity={clamp01((lineDrawn - 0.85) * 6.67)}
            />
            <polygon
              points={`${lineStartX + 9},${pointO.y - 5} ${lineStartX},${pointO.y} ${lineStartX + 9},${pointO.y + 5}`}
              fill={DS.dark}
              opacity={clamp01((lineDrawn - 0.85) * 6.67)}
            />
          </>
        )}
        {oAppear > 0 && (
          <g
            opacity={oAppear}
            transform={`translate(${pointO.x},${pointO.y}) scale(${lerp(0.3, 1, oAppear)})`}
          >
            {visStep <= 1 && oAppear > 0.5 && (
              <circle
                cx={0}
                cy={0}
                r={22}
                fill="url(#pg)"
                style={{ animation: "pulseGlow 2s ease-in-out infinite" }}
              />
            )}
            <circle
              cx={0}
              cy={0}
              r={7}
              fill={visStep === 1 ? DS.orange : DS.orangeAlt}
              stroke={DS.white}
              strokeWidth={2.5}
              filter={visStep === 1 ? "url(#gl)" : undefined}
            />
          </g>
        )}
        {oLabel > 0 && (
          <text
            x={pointO.x}
            y={pointO.y + 28}
            textAnchor="middle"
            fill={DS.dark}
            fontSize="15"
            fontWeight="700"
            fontFamily={DS.font}
            opacity={oLabel}
          >
            O
          </text>
        )}
        {visStep === 2 && sweep2 > 0 && sweep2 < 1 && (
          <circle
            cx={pointO.x}
            cy={pointO.y}
            r={lerp(0, pointO.x - pointX.x, easeOutCubic(sweep2))}
            fill="none"
            stroke={DS.primary}
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.3 * (1 - sweep2)}
          />
        )}
        {xIn > 0 && (
          <g>
            <circle
              cx={lerp(pointO.x, pointX.x, xIn)}
              cy={pointX.y}
              r={lerp(2, 6, xIn)}
              fill={DS.primary}
              stroke={DS.white}
              strokeWidth={1.5}
              opacity={xIn}
              filter={visStep === 2 && xIn < 1 ? "url(#gl2)" : undefined}
            />
            {xIn > 0.7 && (
              <text
                x={pointX.x}
                y={pointX.y + 26}
                textAnchor="middle"
                fill={DS.dark}
                fontSize="15"
                fontWeight="700"
                fontFamily={DS.font}
                opacity={clamp01((xIn - 0.7) / 0.3)}
              >
                X
              </text>
            )}
          </g>
        )}
        {yIn > 0 && (
          <g>
            <circle
              cx={lerp(pointO.x, pointY.x, yIn)}
              cy={pointY.y}
              r={lerp(2, 6, yIn)}
              fill={DS.primary}
              stroke={DS.white}
              strokeWidth={1.5}
              opacity={yIn}
              filter={visStep === 2 && yIn < 1 ? "url(#gl2)" : undefined}
            />
            {yIn > 0.7 && (
              <text
                x={pointY.x}
                y={pointY.y + 26}
                textAnchor="middle"
                fill={DS.dark}
                fontSize="15"
                fontWeight="700"
                fontFamily={DS.font}
                opacity={clamp01((yIn - 0.7) / 0.3)}
              >
                Y
              </text>
            )}
          </g>
        )}
        {ticks > 0 && (
          <g opacity={ticks}>
            {[0.4, 0.6].map((t, i) => {
              const mx = pointX.x + (pointO.x - pointX.x) * t;
              return (
                <line
                  key={`tx${i}`}
                  x1={mx}
                  y1={pointO.y - 8}
                  x2={mx + 4}
                  y2={pointO.y + 8}
                  stroke={DS.primary}
                  strokeWidth={2}
                />
              );
            })}
            {[0.4, 0.6].map((t, i) => {
              const mx = pointO.x + (pointY.x - pointO.x) * t;
              return (
                <line
                  key={`ty${i}`}
                  x1={mx}
                  y1={pointO.y - 8}
                  x2={mx + 4}
                  y2={pointO.y + 8}
                  stroke={DS.primary}
                  strokeWidth={2}
                />
              );
            })}
          </g>
        )}
        {eqLbl > 0 && (
          <g
            opacity={eqLbl}
            transform={`translate(${pointO.x},${pointO.y - 30}) scale(${lerp(0.5, 1, eqLbl)})`}
          >
            <rect
              x={-34}
              y={-10}
              width={68}
              height={20}
              rx={10}
              fill={DS.primaryLight}
              opacity={0.5}
            />
            <text
              x={0}
              y={4}
              textAnchor="middle"
              fill={DS.primary}
              fontSize="11"
              fontWeight="700"
              fontFamily="monospace"
            >
              OX = OY
            </text>
          </g>
        )}
        {midB > 0 && (
          <g
            opacity={midB}
            transform={`translate(${pointO.x},${pointO.y + 48}) scale(${lerp(0.5, 1, midB)})`}
          >
            <rect
              x={-50}
              y={-10}
              width={100}
              height={20}
              rx={10}
              fill={DS.orangeLight}
              stroke={DS.orange}
              strokeWidth={0.8}
              strokeDasharray="3 2"
            />
            <text
              x={0}
              y={4}
              textAnchor="middle"
              fill={DS.orange}
              fontSize="10"
              fontWeight="700"
              fontFamily={DS.font}
            >
              O is midpoint!
            </text>
          </g>
        )}
        {arcXD > 0 && (
          <g>
            <circle
              cx={pointX.x}
              cy={pointX.y}
              r={lerp(4, 14, clamp01(arcXD * 2))}
              fill="none"
              stroke={DS.gradientStart}
              strokeWidth={1.5}
              strokeDasharray="3 3"
              opacity={arcXD < 1 ? 0.5 : 0.25}
            />
            <circle
              cx={pointX.x}
              cy={pointX.y}
              r={3.5}
              fill={DS.gradientStart}
              opacity={clamp01(arcXD * 3)}
            />
            {arcXD > 0.2 && arcXD < 1 && (
              <line
                x1={pointX.x}
                y1={pointX.y}
                x2={lerp(
                  pointX.x,
                  intersectionA.x,
                  clamp01((arcXD - 0.2) / 0.6),
                )}
                y2={lerp(
                  pointX.y,
                  intersectionA.y,
                  clamp01((arcXD - 0.2) / 0.6),
                )}
                stroke={DS.gradientStart}
                strokeWidth={1}
                strokeDasharray="5 4"
                opacity={0.35}
              />
            )}
            {visStep === 3 && arcXD > 0.3 && arcXD < 0.95 && (
              <text
                x={pointX.x}
                y={pointX.y + 32}
                textAnchor="middle"
                fill={DS.gradientStart}
                fontSize="9"
                fontWeight="700"
                fontFamily="monospace"
                opacity={clamp01((arcXD - 0.3) * 3) * 0.7}
              >
                center: X
              </text>
            )}
          </g>
        )}
        {arcYD > 0 && (
          <g>
            <circle
              cx={pointY.x}
              cy={pointY.y}
              r={lerp(4, 14, clamp01(arcYD * 2))}
              fill="none"
              stroke={DS.gradientStart}
              strokeWidth={1.5}
              strokeDasharray="3 3"
              opacity={arcYD < 1 ? 0.5 : 0.25}
            />
            <circle
              cx={pointY.x}
              cy={pointY.y}
              r={3.5}
              fill={DS.gradientStart}
              opacity={clamp01(arcYD * 3)}
            />
            {arcYD > 0.2 && arcYD < 1 && (
              <line
                x1={pointY.x}
                y1={pointY.y}
                x2={lerp(
                  pointY.x,
                  intersectionA.x,
                  clamp01((arcYD - 0.2) / 0.6),
                )}
                y2={lerp(
                  pointY.y,
                  intersectionA.y,
                  clamp01((arcYD - 0.2) / 0.6),
                )}
                stroke={DS.gradientStart}
                strokeWidth={1}
                strokeDasharray="5 4"
                opacity={0.35}
              />
            )}
            {visStep === 3 && arcYD > 0.3 && arcYD < 0.95 && (
              <text
                x={pointY.x}
                y={pointY.y + 32}
                textAnchor="middle"
                fill={DS.gradientStart}
                fontSize="9"
                fontWeight="700"
                fontFamily="monospace"
                opacity={clamp01((arcYD - 0.3) * 3) * 0.7}
              >
                center: Y
              </text>
            )}
          </g>
        )}
        {arcXD > 0 && (
          <path
            d={arcXPath}
            fill="none"
            stroke={DS.gradientStart}
            strokeWidth={2.2}
            strokeDasharray={arcLen}
            strokeDashoffset={arcLen * (1 - arcXD)}
            opacity={0.8}
          />
        )}
        {arcYD > 0 && (
          <path
            d={arcYPath}
            fill="none"
            stroke={DS.gradientStart}
            strokeWidth={2.2}
            strokeDasharray={arcLen}
            strokeDashoffset={arcLen * (1 - arcYD)}
            opacity={0.8}
          />
        )}
        {arcXD > 0.6 && visStep <= 3 && (
          <text
            x={pointX.x - 20}
            y={intersectionA.y + 30}
            fill={DS.gradientStart}
            fontSize="10"
            fontWeight="600"
            opacity={0.55}
            fontFamily="monospace"
          >
            arc from X
          </text>
        )}
        {arcYD > 0.6 && visStep <= 3 && (
          <text
            x={pointY.x - 10}
            y={intersectionA.y + 30}
            fill={DS.gradientStart}
            fontSize="10"
            fontWeight="600"
            opacity={0.55}
            fontFamily="monospace"
          >
            arc from Y
          </text>
        )}
        {ptA > 0 && (
          <g transform={`translate(${intersectionA.x},${intersectionA.y})`}>
            <circle
              cx={0}
              cy={0}
              r={lerp(0, 20, ptA)}
              fill="url(#pg)"
              opacity={ptA * 0.8}
            />
            <circle
              cx={0}
              cy={0}
              r={lerp(0, 7, Math.min(ptA * 1.5, 1))}
              fill={DS.orange}
              stroke={DS.white}
              strokeWidth={2.5}
              filter="url(#gl)"
            />
            {ptA > 0.5 && (
              <text
                x={16}
                y={5}
                fill={DS.dark}
                fontSize="16"
                fontWeight="700"
                fontFamily={DS.font}
                opacity={clamp01((ptA - 0.5) * 2)}
              >
                A
              </text>
            )}
          </g>
        )}
        {callout > 0 && (
          <g
            opacity={callout}
            transform={`translate(520,60) scale(${lerp(0.8, 1, callout)})`}
          >
            <rect
              x={0}
              y={0}
              width={165}
              height={70}
              rx={DS.radius}
              fill={DS.orangeLight}
              stroke={DS.orange}
              strokeWidth={1.2}
              strokeDasharray="4 2"
            />
            <text
              x={82}
              y={22}
              textAnchor="middle"
              fill={DS.orange}
              fontSize="10.5"
              fontWeight="800"
              fontFamily={DS.font}
            >
              ★ KEY SHORTCUT ★
            </text>
            <text
              x={82}
              y={40}
              textAnchor="middle"
              fill={DS.dark}
              fontSize="11"
              fontWeight="600"
              fontFamily={DS.font}
            >
              Only ONE pair of arcs
            </text>
            <text
              x={82}
              y={56}
              textAnchor="middle"
              fill={DS.gray}
              fontSize="10"
              fontFamily={DS.font}
            >
              O is already on the bisector
            </text>
          </g>
        )}
        {rayD > 0 && (
          <line
            x1={pointO.x}
            y1={pointO.y}
            x2={lerp(pointO.x, intersectionA.x, rayD)}
            y2={lerp(pointO.y, intersectionA.y - 35, rayD)}
            stroke={DS.orange}
            strokeWidth={2.8}
            strokeLinecap="round"
            markerEnd={rayD > 0.9 ? "url(#ah)" : undefined}
          />
        )}
        {angL > 0 && (
          <g opacity={angL}>
            <path
              d={`M ${pointO.x - 22} ${pointO.y} L ${pointO.x - 22} ${pointO.y - 22} L ${pointO.x} ${pointO.y - 22}`}
              fill="none"
              stroke={DS.orange}
              strokeWidth={2}
              strokeDasharray={44}
              strokeDashoffset={44 * (1 - angL)}
            />
          </g>
        )}
        {angR > 0 && (
          <g opacity={angR}>
            <path
              d={`M ${pointO.x + 22} ${pointO.y} L ${pointO.x + 22} ${pointO.y - 22} L ${pointO.x} ${pointO.y - 22}`}
              fill="none"
              stroke={DS.orange}
              strokeWidth={2}
              strokeDasharray={44}
              strokeDashoffset={44 * (1 - angR)}
            />
          </g>
        )}
        {angLbl > 0 && (
          <g opacity={angLbl}>
            <g
              transform={`translate(${pointO.x - 40},${pointO.y - 30}) scale(${lerp(0.5, 1, angLbl)})`}
            >
              <text
                fill={DS.orange}
                fontSize="14"
                fontWeight="800"
                fontFamily={DS.font}
              >
                90°
              </text>
            </g>
            <g
              transform={`translate(${pointO.x + 28},${pointO.y - 30}) scale(${lerp(0.5, 1, angLbl)})`}
            >
              <text
                fill={DS.orange}
                fontSize="14"
                fontWeight="800"
                fontFamily={DS.font}
              >
                90°
              </text>
            </g>
          </g>
        )}
        {celeb > 0 && (
          <g
            opacity={celeb}
            transform={`translate(570,320) scale(${lerp(0.5, 1, celeb)})`}
          >
            <rect
              x={-50}
              y={-14}
              width={100}
              height={28}
              rx={14}
              fill={DS.success}
              opacity={0.15}
            />
            <text
              x={0}
              y={5}
              textAnchor="middle"
              fill={DS.success}
              fontSize="12"
              fontWeight="700"
              fontFamily={DS.font}
            >
              ✓ 90° Done!
            </text>
          </g>
        )}
      </svg>
    );
  };

  // ════════════════════ RENDER ════════════════════

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: props?.width ?? 800,
        fontFamily: DS.font,
        background: DS.white,
        borderRadius: R.containerRadius,
        overflow: "hidden",
        boxShadow:
          "0 4px 24px rgba(74,77,201,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        border: `1px solid ${DS.lightGray}`,
        display: "flex",
        flexDirection: "column" as const,
        margin: "0 auto",
      }}
    >
      {/* ─── Header ─── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
          padding: `${R.headerPy}px ${R.headerPx}px`,
          display: "flex",
          alignItems: "center",
          gap: R.gap,
        }}
      >
        <div
          style={{
            width: R.iconBox,
            height: R.iconBox,
            borderRadius: DS.radius,
            flexShrink: 0,
            background: "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width={R.iconSize}
            height={R.iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M4 20 L4 4" />
            <path d="M4 20 L20 20" />
            <rect
              x="4"
              y="4"
              width="5"
              height="5"
              fill="rgba(255,255,255,0.3)"
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: DS.white,
              fontWeight: 700,
              fontSize: R.titleSize,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Construction of a 90° Angle
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: R.subtitleSize,
              marginTop: 1,
              fontWeight: 500,
            }}
          >
            at a Given Point on a Line
          </div>
        </div>
      </div>

      {/* ─── Mode Selector ─── */}
      {config.showModeSelector && config.enabledModes.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: `${R.py}px ${R.px}px`,
            background: DS.white,
            borderBottom: `1px solid ${DS.lightGray}`,
            flexWrap: "wrap" as const,
          }}
        >
          {config.enabledModes.map((m) => {
            const active = selectedMode === m;
            return (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                onMouseEnter={() => setHoveredBtn(`m-${m}`)}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: `${R.modeBtnPy}px ${R.modeBtnPx}px`,
                  borderRadius: 40,
                  border: active
                    ? `2px solid ${DS.primary}`
                    : `1.5px solid ${DS.lightGray}`,
                  background: active
                    ? DS.primary
                    : hoveredBtn === `m-${m}`
                      ? DS.primaryBg
                      : DS.white,
                  color: active ? DS.white : DS.dark,
                  fontWeight: 600,
                  fontSize: R.modeBtnFont,
                  fontFamily: DS.font,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: active ? `0 2px 8px ${DS.primary}30` : "none",
                }}
              >
                {m === "learn" ? (
                  <BookOpen size={R.modeBtnIcon} />
                ) : (
                  <Target size={R.modeBtnIcon} />
                )}
                {m === "learn" ? "Learn" : "Practice"}
              </button>
            );
          })}
        </div>
      )}

      {/* ─── Canvas (Learn) ─── */}
      {selectedMode === "learn" && (
        <div
          style={{
            flex: 1,
            padding: `${R.py}px ${R.px}px`,
            background: DS.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: R.canvasMinH,
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "7/4",
              borderRadius: R.canvasRadius,
              overflow: "hidden",
              background: DS.lightest,
              border: `1px solid ${DS.lightGray}`,
            }}
          >
            {renderSVG()}
          </div>
        </div>
      )}

      {/* ─── PRACTICE: MCQ ─── */}
      {selectedMode === "practice" && currentStep?.data?.question && (
        <div
          key={`mcq-${currentStepIndex}`}
          style={{
            padding: `${R.py + 4}px ${R.px}px ${R.py}px`,
            background: DS.white,
            borderTop: `1px solid ${DS.lightGray}`,
            animation: "fadeInUp 0.35s ease both",
          }}
        >
          {/* Score */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: R.gap + 2,
              flexWrap: "wrap" as const,
            }}
          >
            <span
              style={{
                background: DS.primaryBg,
                color: DS.primary,
                padding: "4px 14px",
                borderRadius: 40,
                fontSize: R.scoreBadgeFont,
                fontWeight: 700,
                fontFamily: DS.font,
              }}
            >
              Q{currentStepIndex + 1} / {modeSteps.length}
            </span>
            {totalAnswered > 0 && (
              <span
                style={{
                  background: DS.orangeLight,
                  color: DS.orange,
                  padding: "4px 14px",
                  borderRadius: 40,
                  fontSize: R.scoreBadgeFont,
                  fontWeight: 700,
                  fontFamily: DS.font,
                }}
              >
                Score: {score}/{totalAnswered}
              </span>
            )}
          </div>
          {/* Question */}
          <div
            style={{
              fontSize: R.questionFont,
              fontWeight: 600,
              color: DS.dark,
              lineHeight: 1.55,
              marginBottom: R.gap + 4,
              fontFamily: DS.font,
            }}
          >
            {currentStep.data.question}
          </div>
          {/* Options */}
          <div
            style={{
              display: "flex",
              flexDirection: "column" as const,
              gap: R.optionGap,
            }}
          >
            {(currentStep.data.options as string[]).map(
              (opt: string, i: number) => {
                const isCorrect = i === currentStep.data.correctIndex;
                const isSel = selectedOption === i;
                let bg = DS.white,
                  border = DS.lightGray,
                  txt = DS.dark,
                  lBg = DS.lightest,
                  lCol = DS.dark;
                if (hasAnswered) {
                  if (isCorrect) {
                    bg = "#ECFDF5";
                    border = DS.success;
                    lBg = DS.success;
                    lCol = DS.white;
                  } else if (isSel) {
                    bg = "#FEF2F2";
                    border = DS.error;
                    lBg = DS.error;
                    lCol = DS.white;
                  } else {
                    txt = DS.gray;
                  }
                } else if (isSel) {
                  bg = DS.primaryBg;
                  border = DS.primary;
                  lBg = DS.primary;
                  lCol = DS.white;
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: R.gap,
                      padding: `${R.optionPy}px ${R.optionPx}px`,
                      borderRadius: DS.radius,
                      border: `1.5px solid ${border}`,
                      background: bg,
                      cursor: hasAnswered ? "default" : "pointer",
                      transition: "all 0.25s ease",
                      textAlign: "left" as const,
                      width: "100%",
                      opacity: hasAnswered && !isCorrect && !isSel ? 0.45 : 1,
                      fontFamily: DS.font,
                      animation: `optionEnter 0.3s ease ${i * 0.06}s both`,
                    }}
                  >
                    <span
                      style={{
                        width: R.optionLabel,
                        height: R.optionLabel,
                        borderRadius: DS.radiusSm,
                        flexShrink: 0,
                        background: lBg,
                        color: lCol,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: R.optionLabelFont,
                        fontWeight: 700,
                        transition: "all 0.25s ease",
                      }}
                    >
                      {hasAnswered && isCorrect
                        ? "✓"
                        : hasAnswered && isSel && !isCorrect
                          ? "✗"
                          : String.fromCharCode(65 + i)}
                    </span>
                    <span
                      style={{
                        fontSize: R.optionFont,
                        fontWeight: 500,
                        color: txt,
                        lineHeight: 1.45,
                      }}
                    >
                      {opt}
                    </span>
                  </button>
                );
              },
            )}
          </div>
          {/* Action buttons */}
          <div
            style={{
              marginTop: R.gap + 4,
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap" as const,
            }}
          >
            {!hasAnswered ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                onMouseEnter={() => setHoveredBtn("sub")}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  padding: `${R.btnPy}px ${R.btnPx}px`,
                  borderRadius: R.btnRadius,
                  border: "none",
                  background:
                    selectedOption === null
                      ? DS.lightGray
                      : `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
                  color: selectedOption === null ? DS.gray : DS.white,
                  fontSize: R.btnFont,
                  fontWeight: 600,
                  fontFamily: DS.font,
                  cursor: selectedOption === null ? "not-allowed" : "pointer",
                  transition: "all 0.25s ease",
                  transform:
                    hoveredBtn === "sub" && selectedOption !== null
                      ? "scale(1.03)"
                      : "none",
                  boxShadow:
                    selectedOption !== null
                      ? "0 4px 16px rgba(83,48,134,0.25)"
                      : "none",
                }}
              >
                Check Answer
              </button>
            ) : currentStepIndex < modeSteps.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                onMouseEnter={() => setHoveredBtn("nxt")}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  padding: `${R.btnPy}px ${R.btnPx}px`,
                  borderRadius: R.btnRadius,
                  border: "none",
                  background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
                  color: DS.white,
                  fontSize: R.btnFont,
                  fontWeight: 600,
                  fontFamily: DS.font,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  transform: hoveredBtn === "nxt" ? "scale(1.03)" : "none",
                  boxShadow: "0 4px 16px rgba(83,48,134,0.25)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Next Question <ChevronRight size={R.btnFont} />
              </button>
            ) : (
              <div
                style={{
                  padding: `${R.btnPy + 2}px ${R.btnPx}px`,
                  borderRadius: R.btnRadius,
                  background: `linear-gradient(135deg, ${DS.gradientStart}15, ${DS.gradientEnd}15)`,
                  border: `1.5px solid ${DS.gradientStart}30`,
                  fontSize: R.btnFont,
                  fontWeight: 700,
                  fontFamily: DS.font,
                  color: DS.gradientStart,
                }}
              >
                🎉 Completed! Score: {score}/{totalAnswered}
              </div>
            )}
          </div>
          {/* Explanation */}
          {hasAnswered && currentStep.data.explanation && (
            <div
              style={{
                marginTop: R.gap + 2,
                padding: `${R.optionPy}px ${R.optionPx}px`,
                borderRadius: DS.radius,
                background: DS.orangeLight,
                border: `1px solid ${DS.orange}20`,
                display: "flex",
                alignItems: "flex-start",
                gap: R.gap - 2,
                animation: "fadeInUp 0.3s ease both",
              }}
            >
              <Lightbulb
                size={R.annoIconInner}
                color={DS.orange}
                style={{ flexShrink: 0, marginTop: 2 }}
              />
              <div
                style={{
                  fontSize: R.explFont,
                  lineHeight: 1.55,
                  color: DS.dark,
                  fontWeight: 500,
                  fontFamily: DS.font,
                }}
              >
                {currentStep.data.explanation}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Annotation (Learn) ─── */}
      {selectedMode === "learn" && (
        <div
          key={`ann-${visStep}`}
          style={{
            padding: `${R.py}px ${R.px}px`,
            display: "flex",
            alignItems: "flex-start",
            gap: R.gap,
            background: annotation.insight ? DS.orangeLight : DS.white,
            borderTop: `1px solid ${annotation.insight ? DS.orange + "25" : DS.lightGray}`,
            animation: annotation.insight
              ? "insightPulse 3s ease-in-out infinite"
              : "fadeInUp 0.4s ease both",
          }}
        >
          <div
            style={{
              width: R.annoIcon,
              height: R.annoIcon,
              borderRadius: DS.radiusSm,
              flexShrink: 0,
              background: annotation.insight ? DS.orange + "20" : DS.primaryBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 1,
            }}
          >
            <Lightbulb
              size={R.annoIconInner}
              color={annotation.insight ? DS.orange : DS.primary}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            {annotation.insight && (
              <div
                style={{
                  fontSize: isMobile ? 9 : 10,
                  fontWeight: 800,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.1em",
                  color: DS.orange,
                  marginBottom: 3,
                  fontFamily: DS.font,
                }}
              >
                Key Insight
              </div>
            )}
            <div
              style={{
                fontSize: R.annoFont,
                lineHeight: 1.55,
                color: DS.dark,
                fontWeight: 500,
                fontFamily: DS.font,
              }}
            >
              {annotation.text}
            </div>
          </div>
        </div>
      )}

      {/* ─── Description (Learn) ─── */}
      {selectedMode === "learn" && (
        <div
          key={`desc-${currentStepIndex}`}
          style={{
            padding: `${R.py}px ${R.px}px`,
            background: DS.white,
            borderTop: `1px solid ${DS.lightGray}`,
            animation: "stepFadeIn 0.35s ease both",
          }}
        >
          <div
            style={{
              fontSize: R.descTitleFont,
              color: DS.dark,
              fontWeight: 700,
              marginBottom: 2,
              fontFamily: DS.font,
            }}
          >
            Step {currentStepIndex + 1}: {currentStep?.title}
          </div>
          <div
            style={{
              fontSize: R.descFont,
              color: DS.gray,
              lineHeight: 1.5,
              fontFamily: DS.font,
              fontWeight: 500,
            }}
          >
            {currentStep?.description}
          </div>
        </div>
      )}

      {/* ─── Navigation (Learn) ─── */}
      {config.showNavigation && selectedMode === "learn" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `${R.py}px ${R.px}px ${R.py + 4}px`,
            background: DS.white,
            borderTop: `1px solid ${DS.lightGray}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 4 : 6,
            }}
          >
            {modeSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStepIndex(i)}
                style={{
                  width: currentStepIndex === i ? R.dotActive : R.dotInactive,
                  height: R.dotH,
                  borderRadius: R.dotH / 2,
                  border: "none",
                  background:
                    currentStepIndex === i
                      ? `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`
                      : DS.lightGray,
                  cursor: "pointer",
                  transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                  opacity: currentStepIndex === i ? 1 : 0.6,
                }}
              />
            ))}
            <span
              style={{
                fontSize: isMobile ? 10 : 11,
                color: DS.gray,
                marginLeft: isMobile ? 4 : 8,
                fontWeight: 600,
                fontFamily: "monospace",
              }}
            >
              {currentStepIndex + 1}/{modeSteps.length}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 6 : 8,
            }}
          >
            <button
              onClick={goToPrev}
              disabled={currentStepIndex === 0}
              onMouseEnter={() => setHoveredBtn("p")}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                width: R.navBtnSize,
                height: R.navBtnSize,
                borderRadius: R.navBtnSize,
                border: `1.5px solid ${DS.lightGray}`,
                background: hoveredBtn === "p" ? DS.primaryBg : DS.white,
                cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",
                opacity: currentStepIndex === 0 ? 0.3 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                color: DS.dark,
              }}
            >
              <ChevronLeft size={R.navIconSize} />
            </button>
            <button
              onClick={goToNext}
              disabled={currentStepIndex >= modeSteps.length - 1}
              onMouseEnter={() => setHoveredBtn("n")}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                width: R.navBtnSize,
                height: R.navBtnSize,
                borderRadius: R.navBtnSize,
                border: `1.5px solid ${DS.lightGray}`,
                background: hoveredBtn === "n" ? DS.primaryBg : DS.white,
                cursor:
                  currentStepIndex >= modeSteps.length - 1
                    ? "not-allowed"
                    : "pointer",
                opacity: currentStepIndex >= modeSteps.length - 1 ? 0.3 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                color: DS.dark,
              }}
            >
              <ChevronRight size={R.navIconSize} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightAngleConstructor;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
