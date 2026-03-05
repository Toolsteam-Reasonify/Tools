// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: locating_hundredths_number_line.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

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
  RotateCcw,
  Check,
  X,
  BookOpen,
  Target,
  Zap,
  Star,
} from "lucide-react";

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  primary: "#4A4DC9",
  primaryDark: "#533086",
  highlight: "#FF7212",
  highlightDark: "#FC9145",
  gradientPrimary: "linear-gradient(135deg, #533086 0%, #FC9145 100%)",
  gradientPrimaryHover: "linear-gradient(135deg, #4A4DC9 0%, #FF7212 100%)",
  gradientSubtle: "linear-gradient(135deg, #C1C1EA 0%, #FFF3E4 100%)",
  lightPurple: "#C1C1EA",
  lightOrange: "#FFF3E4",
  dark: "#4E4E4E",
  gray: "#CACACA",
  lightGray: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  success: "#2ECC71",
  error: "#E74C3C",
  fontFamily:
    "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  radiusPill: "999px",
  radiusLg: "20px",
  radiusMd: "14px",
  radiusSm: "10px",
  shadowCard: "0 8px 32px rgba(74, 77, 201, 0.10)",
  shadowButton: "0 4px 16px rgba(83, 48, 134, 0.18)",
  shadowButtonHover: "0 8px 28px rgba(83, 48, 134, 0.28)",
  btnHeight: 40,
  btnPaddingH: 24,
  btnIconGap: 4,
};

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

interface HundredthsAdditionalProps {
  minValue?: number;
  maxValue?: number;
  markersToPlace?: {
    value: number;
    label: string;
    equivalence?: string;
    color?: string;
  }[];
  showDragMode?: boolean;
  dragTargets?: number[];
  lineColor?: string;
  markerColor?: string;
  badgeColor?: string;
  showTenthLabels?: boolean;
  showHundredthTicks?: boolean;
  highlightRange?: { from: number; to: number; color: string };
}

interface LocatingHundredthsProps {
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
    additionalProps?: HundredthsAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== MARKER DATA ====================

interface PlacedMarker {
  value: number;
  label: string;
  equivalence?: string;
  color: string;
  badgeColor: string;
}

const STEP_MARKERS: PlacedMarker[][] = [
  [
    {
      value: 0.01,
      label: "1/100",
      equivalence: undefined,
      color: DS.highlight,
      badgeColor: DS.primaryDark,
    },
    {
      value: 0.2,
      label: "20/100",
      equivalence: "= 2/10",
      color: DS.highlight,
      badgeColor: DS.primaryDark,
    },
  ],
  [
    {
      value: 0.01,
      label: "1/100",
      equivalence: undefined,
      color: DS.highlight,
      badgeColor: DS.primaryDark,
    },
    {
      value: 0.2,
      label: "20/100",
      equivalence: "= 2/10",
      color: DS.highlight,
      badgeColor: DS.primaryDark,
    },
    {
      value: 0.5,
      label: "50/100",
      equivalence: "= 5/10 = ½",
      color: DS.highlight,
      badgeColor: DS.primaryDark,
    },
  ],
  [
    {
      value: 0.01,
      label: "1/100",
      equivalence: undefined,
      color: DS.highlight,
      badgeColor: DS.primaryDark,
    },
    {
      value: 0.2,
      label: "20/100",
      equivalence: "= 2/10",
      color: DS.highlight,
      badgeColor: DS.primaryDark,
    },
    {
      value: 0.5,
      label: "50/100",
      equivalence: "= 5/10 = ½",
      color: DS.highlight,
      badgeColor: DS.primaryDark,
    },
    {
      value: 0.99,
      label: "99/100",
      equivalence: undefined,
      color: DS.highlight,
      badgeColor: DS.primaryDark,
    },
    {
      value: 1.0,
      label: "100/100",
      equivalence: "= 1",
      color: DS.highlight,
      badgeColor: DS.primaryDark,
    },
  ],
  [
    {
      value: 0.01,
      label: "1/100",
      equivalence: undefined,
      color: DS.highlight,
      badgeColor: DS.primaryDark,
    },
    {
      value: 0.2,
      label: "20/100",
      equivalence: "= 2/10",
      color: DS.highlight,
      badgeColor: DS.primaryDark,
    },
    {
      value: 0.5,
      label: "50/100",
      equivalence: "= 5/10 = ½",
      color: DS.highlight,
      badgeColor: DS.primaryDark,
    },
    {
      value: 0.99,
      label: "99/100",
      equivalence: undefined,
      color: DS.highlight,
      badgeColor: DS.primaryDark,
    },
    {
      value: 1.0,
      label: "100/100",
      equivalence: "= 1",
      color: DS.highlight,
      badgeColor: DS.primaryDark,
    },
    {
      value: 1.3,
      label: "130/100",
      equivalence: "= 1 3/10",
      color: DS.highlight,
      badgeColor: DS.primaryDark,
    },
  ],
];

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Placing 1/100 and 20/100",
    description:
      "Let's start! Each tiny mark on this number line is 1/100 (one-hundredth). We'll place 1/100 right after 0, and 20/100 at the 20th mark — notice that 20/100 is the same as 2/10!",
    type: "intro",
    mode: "learn",
    data: { stepIndex: 0 },
  },
  {
    id: 2,
    title: "50/100 = 5/10 = ½",
    description:
      "Now let's place 50/100. That's exactly halfway between 0 and 1! Fifty hundredths equals 5 tenths, which equals one-half. See how tenths and hundredths connect!",
    type: "explanation",
    mode: "learn",
    data: { stepIndex: 1 },
  },
  {
    id: 3,
    title: "99/100 and 100/100",
    description:
      "99/100 is just one tiny mark before 1. And 100/100 = 1 exactly! One hundred hundredths make a whole unit. Notice how close 99/100 is to 1!",
    type: "explanation",
    mode: "learn",
    data: { stepIndex: 2 },
  },
  {
    id: 4,
    title: "130/100 — Going Past 1!",
    description:
      "130/100 is greater than 1! It equals 1 and 3/10 (or 1 and 30/100). On the number line, it sits past 1, at the 30th hundredth mark after 1. Now try dragging values yourself!",
    type: "explanation",
    mode: "learn",
    data: { stepIndex: 3, enableDrag: true },
  },
  {
    id: 10,
    title: "Place the Value!",
    description: "Tap on the correct position for 45/100 on the number line.",
    type: "practice",
    mode: "practice",
    data: { targetValue: 0.45, targetLabel: "45/100", tolerance: 0.03 },
  },
  {
    id: 11,
    title: "Find 75/100!",
    description: "Where does 75/100 go? It's equal to ¾. Tap the number line!",
    type: "practice",
    mode: "practice",
    data: { targetValue: 0.75, targetLabel: "75/100", tolerance: 0.03 },
  },
  {
    id: 12,
    title: "Locate 150/100!",
    description: "150/100 is more than 1! Where does it go? Tap to place it.",
    type: "practice",
    mode: "practice",
    data: { targetValue: 1.5, targetLabel: "150/100", tolerance: 0.03 },
  },
  {
    id: 20,
    title: "Measuring with a Ruler",
    description:
      "When you measure with a ruler, each millimeter is 1/10 of a centimeter. A centimeter divided into 100 parts gives you even finer precision — just like our hundredths!",
    type: "real_world",
    mode: "real_world",
    data: { stepIndex: 3 },
  },
  {
    id: 21,
    title: "Money: Rupees and Paise",
    description:
      "1 paisa = 1/100 rupee. So 75 paise = 75/100 = ₹0.75. The decimal system in money works exactly like our number line!",
    type: "real_world",
    mode: "real_world",
    data: { stepIndex: 3 },
  },
  {
    id: 30,
    title: "Drag & Drop Challenge",
    description:
      "Drag the value markers to their correct positions on the number line. Can you place them all correctly?",
    type: "hands_on",
    mode: "hands_on",
    data: { enableDrag: true, stepIndex: 3 },
  },
];

// ==================== EASING ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeOutBounce = (t: number): number => {
  const n1 = 7.5625,
    d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

// ==================== MAIN COMPONENT ====================

const LocatingHundredthsNumberLine: React.FC<LocatingHundredthsProps> = ({
  props = {},
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: props.initialMode ?? "learn",
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: props.enabledModes ?? [
        "learn",
        "practice",
        "real_world",
        "hands_on",
      ],
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      initialStep: props.initialStep ?? 1,
      filterSteps: props.filterSteps ?? null,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration:
        props.autoPlayDuration ?? props.data?.autoPlayDuration ?? 10000,
      themeColor: props.themeColor ?? DS.primary,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const additionalProps = props.additionalProps || {};
  const nlConfig = useMemo(
    () => ({
      minValue: additionalProps.minValue ?? 0,
      maxValue: additionalProps.maxValue ?? 2,
      lineColor: additionalProps.lineColor ?? DS.primary,
      markerColor: additionalProps.markerColor ?? DS.highlight,
      badgeColor: additionalProps.badgeColor ?? DS.primaryDark,
    }),
    [additionalProps],
  );

  const allSteps = props.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(() => {
    if (config.filterSteps?.length)
      return allSteps.filter((s) => config.filterSteps!.includes(s.id));
    return allSteps;
  }, [allSteps, config.filterSteps]);

  const [selectedMode, setSelectedMode] = useState<ModeType>(
    config.initialMode,
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    const steps = availableSteps.filter((s) => s.mode === config.initialMode);
    const idx = steps.findIndex((s) => s.id === config.initialStep);
    return idx >= 0 ? idx : 0;
  });
  const [isPlaying, setIsPlaying] = useState(!stopAutoNext);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [buttonStates, setButtonStates] = useState<{
    [k: string]: "idle" | "hover" | "active";
  }>({});
  const [animProgress, setAnimProgress] = useState(0);
  const [markerAnimProgress, setMarkerAnimProgress] = useState<number[]>([]);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [contentTransform, setContentTransform] = useState("translateY(0)");
  const [practiceResult, setPracticeResult] = useState<
    "correct" | "wrong" | null
  >(null);
  const [practiceClickPos, setPracticeClickPos] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<number | null>(null);
  const [dragLabel, setDragLabel] = useState("");
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [placedDragMarkers, setPlacedDragMarkers] = useState<PlacedMarker[]>(
    [],
  );
  const [dragTargets] = useState([
    { value: 0.35, label: "35/100" },
    { value: 0.68, label: "68/100" },
    { value: 1.15, label: "115/100" },
    { value: 1.8, label: "180/100" },
  ]);
  const [remainingDragTargets, setRemainingDragTargets] = useState([
    0, 1, 2, 3,
  ]);
  const svgRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<number>();

  const filteredSteps = useMemo(
    () => availableSteps.filter((step) => step.mode === selectedMode),
    [availableSteps, selectedMode],
  );
  const currentStep = filteredSteps[currentStepIndex] || filteredSteps[0];
  const currentMarkers = useMemo(() => {
    const si = currentStep?.data?.stepIndex;
    if (si !== undefined && si >= 0 && si < STEP_MARKERS.length)
      return STEP_MARKERS[si];
    return [];
  }, [currentStep]);

  // ─── FONTS + KEYFRAMES ───
  useEffect(() => {
    if (!document.getElementById("sing-poppins")) {
      const link = document.createElement("link");
      link.id = "sing-poppins";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(link);
    }
    const kf = `
            @keyframes sFadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
            @keyframes sPopIn{0%{transform:scale(0);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
            @keyframes sPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
            @keyframes sGlow{0%,100%{filter:drop-shadow(0 0 4px ${DS.highlight}50)}50%{filter:drop-shadow(0 0 14px ${DS.highlight}99)}}
            @keyframes sDropIn{0%{transform:translateY(-30px) scale(.6);opacity:0}60%{transform:translateY(4px) scale(1.04);opacity:1}100%{transform:translateY(0) scale(1);opacity:1}}
            @keyframes sCorrect{0%{transform:scale(1)}40%{transform:scale(1.35)}100%{transform:scale(1)}}
            @keyframes sShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
        `;
    const ss = document.createElement("style");
    ss.id = "sing-kf";
    ss.textContent = kf;
    document.head.appendChild(ss);
    return () => {
      document.getElementById("sing-kf")?.remove();
    };
  }, []);

  // ─── GEOMETRY ───
  const PAD = 55;
  const LY = 200;
  const SW = config.width - 32;
  const lw = SW - PAD * 2;
  const rng = nlConfig.maxValue - nlConfig.minValue;
  const v2x = useCallback(
    (v: number) => PAD + ((v - nlConfig.minValue) / rng) * lw,
    [nlConfig.minValue, rng, lw],
  );
  const x2v = useCallback(
    (x: number) => nlConfig.minValue + ((x - PAD) / lw) * rng,
    [nlConfig.minValue, rng, lw],
  );

  // ─── ANIMATIONS ───
  useEffect(() => {
    setAnimProgress(0);
    setMarkerAnimProgress([]);
    let start: number | null = null;
    const dur = 1200 / config.animationSpeed;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setAnimProgress(easeOutCubic(p));
      const mp: number[] = [];
      for (let i = 0; i < currentMarkers.length; i++) {
        const d = 0.15 + i * 0.12;
        mp.push(easeOutBounce(Math.max(0, Math.min((p - d) / 0.25, 1))));
      }
      setMarkerAnimProgress(mp);
      if (p < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [currentStep, currentMarkers, config.animationSpeed]);

  useEffect(() => {
    setStepDetails?.({
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
    if (!isPlaying || stopAutoNext || !config.autoPlayDuration) return;
    const t = setTimeout(() => {
      if (currentStepIndex < filteredSteps.length - 1)
        animateStepChange("next");
      else setIsPlaying(false);
    }, config.autoPlayDuration);
    return () => clearTimeout(t);
  }, [
    isPlaying,
    currentStepIndex,
    stopAutoNext,
    filteredSteps.length,
    config.autoPlayDuration,
  ]);

  const animateStepChange = useCallback(
    (dir: "next" | "prev") => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setContentOpacity(0);
      setContentTransform(
        dir === "next" ? "translateY(-18px)" : "translateY(18px)",
      );
      setPracticeResult(null);
      setPracticeClickPos(null);
      setTimeout(() => {
        setCurrentStepIndex((p) => (dir === "next" ? p + 1 : p - 1));
        setContentTransform(
          dir === "next" ? "translateY(18px)" : "translateY(-18px)",
        );
        setTimeout(() => {
          setContentOpacity(1);
          setContentTransform("translateY(0)");
          setIsTransitioning(false);
        }, 50);
      }, 280);
    },
    [isTransitioning],
  );

  const nextStep = () => {
    if (currentStepIndex < filteredSteps.length - 1 && !isTransitioning)
      animateStepChange("next");
  };
  const prevStep = () => {
    if (currentStepIndex > 0 && !isTransitioning) animateStepChange("prev");
  };
  const changeMode = (m: ModeType) => {
    if (m === selectedMode) return;
    setIsTransitioning(true);
    setContentOpacity(0);
    setPracticeResult(null);
    setPracticeClickPos(null);
    setPlacedDragMarkers([]);
    setRemainingDragTargets([0, 1, 2, 3]);
    setTimeout(() => {
      setSelectedMode(m);
      setCurrentStepIndex(0);
      setTimeout(() => {
        setContentOpacity(1);
        setIsTransitioning(false);
      }, 50);
    }, 280);
  };

  const handleNLClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (selectedMode !== "practice" || practiceResult === "correct") return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clicked = x2v(e.clientX - rect.left);
    const tgt = currentStep?.data?.targetValue;
    const tol = currentStep?.data?.tolerance ?? 0.03;
    setPracticeClickPos(clicked);
    if (tgt !== undefined && Math.abs(clicked - tgt) <= tol)
      setPracticeResult("correct");
    else {
      setPracticeResult("wrong");
      setTimeout(() => setPracticeResult(null), 1200);
    }
  };

  const handleDragStart = (
    idx: number,
    e: React.MouseEvent | React.TouchEvent,
  ) => {
    e.preventDefault();
    setIsDragging(true);
    const t = dragTargets[idx];
    setDragValue(t.value);
    setDragLabel(t.label);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
      setDragX(cx - rect.left);
      setDragY(cy - rect.top);
    }
  };
  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
      setDragX(cx - rect.left);
      setDragY(cy - rect.top);
    },
    [isDragging],
  );
  const handleDragEnd = useCallback(() => {
    if (!isDragging || dragValue === null) return;
    setIsDragging(false);
    if (Math.abs(dragY - LY) < 40) {
      if (Math.abs(x2v(dragX) - dragValue) < 0.05) {
        setPlacedDragMarkers((p) => [
          ...p,
          {
            value: dragValue!,
            label: dragLabel,
            color: DS.highlight,
            badgeColor: DS.primaryDark,
          },
        ]);
        const di = dragTargets.findIndex((t) => t.value === dragValue);
        setRemainingDragTargets((p) => p.filter((i) => i !== di));
      }
    }
    setDragValue(null);
    setDragLabel("");
  }, [isDragging, dragValue, dragLabel, dragX, dragY, x2v, dragTargets]);
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDragMove);
      window.addEventListener("touchend", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const bs = (id: string) => buttonStates[id] || "idle";
  const hbi = (id: string, st: "idle" | "hover" | "active") =>
    setButtonStates((p) => ({ ...p, [id]: st }));

  // ─── RENDER TICKS ───
  const renderTicks = () => {
    const out: JSX.Element[] = [];
    const total = rng * 100;
    for (let i = 0; i <= total; i++) {
      const v = nlConfig.minValue + i / 100,
        x = v2x(v);
      const isTen = i % 10 === 0,
        isW = i % 100 === 0;
      const th = isW ? 20 : isTen ? 12 : 4;
      out.push(
        <line
          key={`t${i}`}
          x1={x}
          y1={LY - th}
          x2={x}
          y2={LY + th}
          stroke={isW ? DS.primary : isTen ? DS.lightPurple : "#D8D8EE"}
          strokeWidth={isW ? 2.5 : isTen ? 1.5 : 0.5}
          opacity={animProgress}
        />,
      );
      if (isTen && animProgress > 0.4) {
        out.push(
          <text
            key={`lb${i}`}
            x={x}
            y={LY + (isW ? 44 : 34)}
            textAnchor="middle"
            fontSize={isW ? 14 : 10}
            fontWeight={isW ? 700 : 500}
            fill={isW ? DS.primary : "#8B8BC4"}
            opacity={Math.min((animProgress - 0.4) * 2.5, 1)}
            fontFamily={DS.fontFamily}
          >
            {isW ? v.toFixed(0) : v.toFixed(1)}
          </text>,
        );
      }
    }
    return out;
  };

  // ─── RENDER MARKERS ───
  const renderMk = (m: PlacedMarker, i: number, mp: number) => {
    if (mp <= 0) return null;
    const x = v2x(m.value),
      above = i % 2 === 0;
    const yL = above ? LY - 38 : LY + 56,
      yB = above ? LY - 68 : LY + 84,
      pin = above ? LY - 24 : LY + 24;
    return (
      <g key={`mk${i}${m.value}`} opacity={mp}>
        <line
          x1={x}
          y1={LY}
          x2={x}
          y2={pin}
          stroke={DS.highlight}
          strokeWidth={1.8}
          strokeDasharray="3,2"
          opacity={0.7}
        />
        <circle
          cx={x}
          cy={LY}
          r={7 * mp}
          fill={DS.highlight}
          stroke={DS.white}
          strokeWidth={2.5}
          style={{
            animation: mp >= 1 ? "sGlow 2s ease-in-out infinite" : undefined,
          }}
        />
        <rect
          x={x - 34}
          y={yL - 14}
          width={68}
          height={28}
          rx={14}
          fill={DS.highlight}
          opacity={mp}
          style={{ filter: "drop-shadow(0 3px 8px rgba(255,114,18,0.25))" }}
        />
        <text
          x={x}
          y={yL + 2}
          textAnchor="middle"
          fontSize={11.5}
          fontWeight={700}
          fill={DS.white}
          fontFamily={DS.fontFamily}
        >
          {m.label}
        </text>
        {m.equivalence && (
          <g
            style={{
              animation:
                mp >= 1
                  ? `sDropIn 0.5s ease-out ${0.3 + i * 0.12}s both`
                  : undefined,
            }}
          >
            <rect
              x={x - 50}
              y={yB - 12}
              width={100}
              height={24}
              rx={12}
              fill={DS.primaryDark}
              opacity={mp * 0.95}
              style={{ filter: "drop-shadow(0 2px 6px rgba(83,48,134,0.25))" }}
            />
            <text
              x={x}
              y={yB + 3}
              textAnchor="middle"
              fontSize={11}
              fontWeight={600}
              fill={DS.white}
              fontFamily={DS.fontFamily}
            >
              {m.equivalence}
            </text>
          </g>
        )}
      </g>
    );
  };
  const renderMarkers = () =>
    selectedMode === "hands_on"
      ? placedDragMarkers.map((m, i) => renderMk(m, i, 1))
      : currentMarkers.map((m, i) =>
          renderMk(m, i, markerAnimProgress[i] ?? 0),
        );

  const renderPractice = () => {
    if (selectedMode !== "practice") return null;
    const tgt = currentStep?.data?.targetValue;
    if (tgt === undefined) return null;
    return (
      <>
        {practiceResult === "correct" && (
          <g style={{ animation: "sCorrect 0.5s ease-out" }}>
            <circle
              cx={v2x(tgt)}
              cy={LY}
              r={9}
              fill={DS.success}
              stroke={DS.white}
              strokeWidth={2.5}
            />
            <text
              x={v2x(tgt)}
              y={LY - 32}
              textAnchor="middle"
              fontSize={13}
              fontWeight={700}
              fill={DS.success}
              fontFamily={DS.fontFamily}
            >
              {currentStep.data.targetLabel}
            </text>
            <text
              x={v2x(tgt)}
              y={LY - 50}
              textAnchor="middle"
              fontSize={20}
              fill={DS.success}
            >
              ✓
            </text>
          </g>
        )}
        {practiceResult === "wrong" && practiceClickPos !== null && (
          <g style={{ animation: "sShake 0.4s ease-out" }}>
            <circle
              cx={v2x(practiceClickPos)}
              cy={LY}
              r={8}
              fill={DS.error}
              stroke={DS.white}
              strokeWidth={2.5}
            />
            <text
              x={v2x(practiceClickPos)}
              y={LY - 26}
              textAnchor="middle"
              fontSize={18}
              fill={DS.error}
            >
              ✗
            </text>
          </g>
        )}
      </>
    );
  };

  const renderGhost = () => {
    if (!isDragging || dragValue === null) return null;
    return (
      <g>
        <circle
          cx={dragX}
          cy={dragY}
          r={14}
          fill={DS.highlight}
          opacity={0.65}
        />
        <text
          x={dragX}
          y={dragY - 20}
          textAnchor="middle"
          fontSize={12}
          fontWeight={700}
          fill={DS.highlight}
          fontFamily={DS.fontFamily}
        >
          {dragLabel}
        </text>
      </g>
    );
  };

  const mIcons: Record<ModeType, JSX.Element> = {
    learn: <BookOpen size={15} />,
    practice: <Target size={15} />,
    real_world: <Zap size={15} />,
    hands_on: <Star size={15} />,
  };
  const mLabels: Record<ModeType, string> = {
    learn: "Learn",
    practice: "Practice",
    real_world: "Real World",
    hands_on: "Hands On",
  };
  const dm = config.darkMode;

  return (
    <div
      style={{
        width: config.width,
        maxWidth: "100%",
        fontFamily: DS.fontFamily,
        background: dm ? "linear-gradient(145deg,#1a1a2e,#16213e)" : DS.white,
        borderRadius: DS.radiusLg,
        overflow: "hidden",
        boxShadow: DS.shadowCard,
        border: `1px solid ${dm ? "#2d2d4e" : DS.lightGray}`,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: DS.gradientPrimary,
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: DS.white,
        }}
      >
        <div
          style={{ fontSize: 17, fontWeight: 700, fontFamily: DS.fontFamily }}
        >
          📏 Locating Hundredths on Number Lines
        </div>
        {config.showStepIndicator && (
          <div
            style={{
              background: "rgba(255,255,255,0.22)",
              borderRadius: DS.radiusPill,
              padding: "5px 16px",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Step {currentStepIndex + 1} / {filteredSteps.length}
          </div>
        )}
      </div>

      {/* MODE BAR */}
      {config.showModeSelector && (
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "12px 24px",
            background: dm ? "#1a1a2e" : DS.offWhite,
            borderBottom: `1px solid ${dm ? "#2d2d4e" : DS.lightGray}`,
          }}
        >
          {config.enabledModes.map((mode) => {
            const act = selectedMode === mode,
              hov = bs(`m-${mode}`) === "hover";
            return (
              <button
                key={mode}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: `0 ${DS.btnPaddingH}px`,
                  height: DS.btnHeight,
                  borderRadius: DS.radiusPill,
                  border: act
                    ? "2px solid transparent"
                    : `2px solid ${hov ? DS.primary : DS.lightGray}`,
                  background: act
                    ? DS.gradientPrimary
                    : hov
                      ? DS.lightPurple
                      : DS.white,
                  color: act ? DS.white : hov ? DS.primaryDark : DS.dark,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: DS.fontFamily,
                  transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: act ? DS.shadowButton : "none",
                  transform: hov && !act ? "scale(1.04)" : "scale(1)",
                }}
                onClick={() => changeMode(mode)}
                onMouseEnter={() => hbi(`m-${mode}`, "hover")}
                onMouseLeave={() => hbi(`m-${mode}`, "idle")}
              >
                {mIcons[mode]}
                {mLabels[mode]}
              </button>
            );
          })}
        </div>
      )}

      {/* DESCRIPTION */}
      {currentStep && (
        <div
          style={{
            padding: "16px 24px",
            background: dm ? "rgba(193,193,234,0.08)" : DS.lightOrange,
            margin: "12px 16px",
            borderRadius: DS.radiusMd,
            fontSize: 13.5,
            lineHeight: "1.7",
            color: dm ? "#e0e0f0" : DS.dark,
            fontFamily: DS.fontFamily,
            border: `1px solid ${dm ? "rgba(193,193,234,0.15)" : "#FFE5CC"}`,
            transition: "all 0.4s ease",
            opacity: contentOpacity,
            transform: contentTransform,
          }}
        >
          <strong
            style={{
              color: DS.primaryDark,
              fontSize: 14.5,
              display: "block",
              marginBottom: 4,
            }}
          >
            {currentStep.title}
          </strong>
          <span>{currentStep.description}</span>
        </div>
      )}

      {/* SVG */}
      <div
        style={{
          padding: "0 16px 8px",
          transition: "all 0.4s ease",
          opacity: contentOpacity,
          transform: contentTransform,
        }}
      >
        <svg
          ref={svgRef}
          width={SW}
          height={300}
          viewBox={`0 0 ${SW} 300`}
          style={{
            cursor:
              selectedMode === "practice"
                ? "crosshair"
                : isDragging
                  ? "grabbing"
                  : "default",
            borderRadius: DS.radiusMd,
            background: dm
              ? "linear-gradient(180deg,#1a1a2e,#16213e)"
              : `linear-gradient(180deg,${DS.offWhite},#EEEEF8)`,
            border: `1px solid ${dm ? "#2d2d4e" : DS.lightGray}`,
          }}
          onClick={handleNLClick}
        >
          <defs>
            <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={DS.primary} />
              <stop offset="100%" stopColor={DS.primaryDark} />
            </linearGradient>
          </defs>
          <line
            x1={PAD}
            y1={LY}
            x2={PAD + lw * animProgress}
            y2={LY}
            stroke="url(#lg1)"
            strokeWidth={3}
            strokeLinecap="round"
          />
          {animProgress > 0.8 && (
            <>
              <polygon
                points={`${PAD - 10},${LY} ${PAD + 4},${LY - 7} ${PAD + 4},${LY + 7}`}
                fill={DS.primary}
                opacity={(animProgress - 0.8) * 5}
              />
              <polygon
                points={`${PAD + lw + 10},${LY} ${PAD + lw - 4},${LY - 7} ${PAD + lw - 4},${LY + 7}`}
                fill={DS.primaryDark}
                opacity={(animProgress - 0.8) * 5}
              />
            </>
          )}
          {renderTicks()}
          {renderMarkers()}
          {renderPractice()}
          {renderGhost()}
        </svg>
      </div>

      {/* DRAG CHIPS */}
      {(selectedMode === "hands_on" ||
        (selectedMode === "learn" && currentStep?.data?.enableDrag)) && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            padding: "8px 24px 14px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 12.5,
              color: DS.dark,
              fontWeight: 600,
              marginRight: 6,
              fontFamily: DS.fontFamily,
            }}
          >
            Drag to place:
          </span>
          {remainingDragTargets.map((idx) => {
            const dragging = isDragging && dragValue === dragTargets[idx].value;
            return (
              <div
                key={idx}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: `0 ${DS.btnPaddingH}px`,
                  height: DS.btnHeight,
                  borderRadius: DS.radiusPill,
                  background: DS.highlight,
                  color: DS.white,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "grab",
                  userSelect: "none" as any,
                  transition: "all 0.25s ease",
                  boxShadow: "0 3px 12px rgba(255,114,18,0.28)",
                  fontFamily: DS.fontFamily,
                  opacity: dragging ? 0.35 : 1,
                  transform: dragging ? "scale(0.92)" : "scale(1)",
                }}
                onMouseDown={(e) => handleDragStart(idx, e)}
                onTouchStart={(e) => handleDragStart(idx, e)}
              >
                {dragTargets[idx].label}
              </div>
            );
          })}
          {remainingDragTargets.length === 0 && (
            <span
              style={{
                color: DS.success,
                fontWeight: 700,
                fontSize: 14,
                fontFamily: DS.fontFamily,
                animation: "sPopIn 0.5s ease-out",
              }}
            >
              🎉 All placed correctly!
            </span>
          )}
        </div>
      )}

      {/* PRACTICE FEEDBACK */}
      {selectedMode === "practice" && practiceResult === "correct" && (
        <div
          style={{
            textAlign: "center",
            padding: "8px 0 4px",
            color: DS.success,
            fontWeight: 700,
            fontSize: 15,
            fontFamily: DS.fontFamily,
            animation: "sFadeUp 0.4s ease-out",
          }}
        >
          <Check
            size={17}
            style={{ verticalAlign: "middle", marginRight: 6 }}
          />
          Correct! Great job!
        </div>
      )}

      {/* NAV BAR */}
      {config.showNavigation && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "14px 24px 18px",
          }}
        >
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: DS.btnHeight,
              height: DS.btnHeight,
              borderRadius: DS.radiusPill,
              border: "none",
              cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",
              background: DS.primary,
              color: DS.white,
              boxShadow:
                bs("prev") === "hover" ? DS.shadowButtonHover : DS.shadowButton,
              transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              transform:
                bs("prev") === "active"
                  ? "scale(0.92)"
                  : bs("prev") === "hover"
                    ? "scale(1.08)"
                    : "scale(1)",
              opacity: currentStepIndex === 0 ? 0.35 : 1,
            }}
            disabled={currentStepIndex === 0}
            onClick={prevStep}
            onMouseEnter={() => hbi("prev", "hover")}
            onMouseLeave={() => hbi("prev", "idle")}
            onMouseDown={() => hbi("prev", "active")}
            onMouseUp={() => hbi("prev", "hover")}
          >
            <ChevronLeft size={20} />
          </button>

          {config.showPlayPause && (
            <button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: DS.radiusPill,
                border: "none",
                cursor: "pointer",
                background: DS.highlight,
                color: DS.white,
                boxShadow:
                  bs("play") === "hover"
                    ? "0 8px 24px rgba(255,114,18,0.40)"
                    : "0 4px 16px rgba(255,114,18,0.30)",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                transform:
                  bs("play") === "active"
                    ? "scale(0.92)"
                    : bs("play") === "hover"
                      ? "scale(1.08)"
                      : "scale(1)",
              }}
              onClick={() => {
                setIsPlaying(!isPlaying);
                setStopAutoNext?.(isPlaying);
              }}
              onMouseEnter={() => hbi("play", "hover")}
              onMouseLeave={() => hbi("play", "idle")}
              onMouseDown={() => hbi("play", "active")}
              onMouseUp={() => hbi("play", "hover")}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          )}

          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: DS.btnHeight,
              height: DS.btnHeight,
              borderRadius: DS.radiusPill,
              border: "none",
              cursor:
                currentStepIndex >= filteredSteps.length - 1
                  ? "not-allowed"
                  : "pointer",
              background: DS.primary,
              color: DS.white,
              boxShadow:
                bs("next") === "hover" ? DS.shadowButtonHover : DS.shadowButton,
              transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              transform:
                bs("next") === "active"
                  ? "scale(0.92)"
                  : bs("next") === "hover"
                    ? "scale(1.08)"
                    : "scale(1)",
              opacity: currentStepIndex >= filteredSteps.length - 1 ? 0.35 : 1,
            }}
            disabled={currentStepIndex >= filteredSteps.length - 1}
            onClick={nextStep}
            onMouseEnter={() => hbi("next", "hover")}
            onMouseLeave={() => hbi("next", "idle")}
            onMouseDown={() => hbi("next", "active")}
            onMouseUp={() => hbi("next", "hover")}
          >
            <ChevronRight size={20} />
          </button>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: DS.radiusPill,
              border: `2px solid ${bs("reset") === "hover" ? DS.primary : DS.gray}`,
              background: "transparent",
              cursor: "pointer",
              color: bs("reset") === "hover" ? DS.primary : DS.dark,
              transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              transform: bs("reset") === "hover" ? "scale(1.08)" : "scale(1)",
            }}
            onClick={() => {
              setCurrentStepIndex(0);
              setPracticeResult(null);
              setPracticeClickPos(null);
              setPlacedDragMarkers([]);
              setRemainingDragTargets([0, 1, 2, 3]);
            }}
            onMouseEnter={() => hbi("reset", "hover")}
            onMouseLeave={() => hbi("reset", "idle")}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      )}

      {/* FOOTER */}
      <div
        style={{
          textAlign: "center",
          padding: "0 24px 16px",
          fontSize: 11.5,
          color: dm ? "#8B8BC4" : DS.gray,
          fontFamily: DS.fontFamily,
          fontWeight: 500,
        }}
      >
        Follow along as we place values on a number line from 0 to 2. Each tiny
        mark is 1/100.
      </div>
    </div>
  );
};

export default LocatingHundredthsNumberLine;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
