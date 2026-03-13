// @ts-ignore - React resolved by parent project; install react in workspace to remove
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

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
  property: string;
  propertyIcon: string;
  fromAngle: number;
  toAngle: number;
  type:
    | "intro"
    | "corresponding"
    | "vertically_opposite"
    | "linear_pair"
    | "summary";
  mode: ModeType;
}

interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}

interface EightAngleFinderAdditionalProps {
  startingAngle?: number;
  startingAngleIndex?: number;
}

type EightAngleFinderPropsConfig = {
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
  additionalProps?: EightAngleFinderAdditionalProps;
};

interface EightAngleFinderProps {
  props?: EightAngleFinderPropsConfig;
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

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
const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// ══════════════════════════════════════════════════════════════
// SINGULARITY DESIGN SYSTEM TOKENS
// ══════════════════════════════════════════════════════════════

const DS = {
  indigo: "#4A4DC9",
  orange: "#FF7212",
  gradStart: "#533086",
  gradEnd: "#FC9145",
  indigoLight: "#C1C1EA",
  orangeLight: "#FFF3E4",
  dark: "#4E4E4E",
  grey: "#CACACA",
  lightGrey: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  group1: "#533086",
  group2: "#FF7212",
  group1Light: "#C1C1EA",
  group2Light: "#FFF3E4",
  success: "#2ECC71",
  error: "#E74C3C",
  successLight: "#EAFAF1",
  errorLight: "#FDEDEC",
  shadow1: "0 2px 8px rgba(74,77,201,0.10)",
  shadow2: "0 4px 20px rgba(74,77,201,0.12)",
  shadow3: "0 8px 32px rgba(74,77,201,0.16)",
  rPill: "999px",
  rCard: "16px",
  rBadge: "10px",
  rButton: "999px",
  font: "'Poppins', sans-serif",
};

const gradient = (deg = 135) =>
  `linear-gradient(${deg}deg, ${DS.gradStart}, ${DS.gradEnd})`;

// ══════════════════════════════════════════════════════════════
// ANGLE DATA LOGIC
// ══════════════════════════════════════════════════════════════

const getAngleInfo = (
  startAngle: number,
): { [key: number]: { group: 1 | 2; value: number } } => {
  const supplement = 180 - startAngle;
  return {
    1: { group: 2, value: supplement },
    2: { group: 1, value: startAngle },
    3: { group: 2, value: supplement },
    4: { group: 1, value: startAngle },
    5: { group: 2, value: supplement },
    6: { group: 1, value: startAngle },
    7: { group: 2, value: supplement },
    8: { group: 1, value: startAngle },
  };
};

const getSteps = (startAngle: number): StepDataInterface[] => {
  const s = 180 - startAngle;
  return [
    {
      id: 0,
      title: "Starting Point",
      description: `We know ∠6 = ${startAngle}°. Can we find ALL other 7 angles from just this one? Yes! Let's use three powerful properties.`,
      property: "Given",
      propertyIcon: "🎯",
      fromAngle: 0,
      toAngle: 6,
      type: "intro",
      mode: "learn",
    },
    {
      id: 1,
      title: "Find ∠2 (Corresponding)",
      description: `∠6 and ∠2 are corresponding angles. Since lines l and m are parallel, corresponding angles are equal. So ∠2 = ${startAngle}°`,
      property: "Corresponding Angles",
      propertyIcon: "🔍",
      fromAngle: 6,
      toAngle: 2,
      type: "corresponding",
      mode: "learn",
    },
    {
      id: 2,
      title: "Find ∠8 (Vertically Opposite)",
      description: `∠6 and ∠8 are vertically opposite angles. Vertically opposite angles are always equal. So ∠8 = ${startAngle}°`,
      property: "Vertically Opposite",
      propertyIcon: "🪞",
      fromAngle: 6,
      toAngle: 8,
      type: "vertically_opposite",
      mode: "learn",
    },
    {
      id: 3,
      title: "Find ∠4 (Corresponding)",
      description: `∠8 and ∠4 are corresponding angles. Since lines are parallel, ∠4 = ∠8 = ${startAngle}°`,
      property: "Corresponding Angles",
      propertyIcon: "🔍",
      fromAngle: 8,
      toAngle: 4,
      type: "corresponding",
      mode: "learn",
    },
    {
      id: 4,
      title: "Find ∠5 (Linear Pair)",
      description: `∠5 and ∠6 form a linear pair. Linear pairs add up to 180°. So ∠5 = 180° − ${startAngle}° = ${s}°`,
      property: "Linear Pair",
      propertyIcon: "📏",
      fromAngle: 6,
      toAngle: 5,
      type: "linear_pair",
      mode: "learn",
    },
    {
      id: 5,
      title: "Find ∠1, ∠3, ∠7",
      description: `Using the same properties: ∠1 = ${s}° (vertically opposite to ∠3, corresponding to ∠5), ∠3 = ${s}° (linear pair with ∠2), ∠7 = ${s}° (vertically opposite to ∠5). All remaining angles = ${s}°!`,
      property: "All Properties",
      propertyIcon: "⚡",
      fromAngle: 5,
      toAngle: 0,
      type: "summary",
      mode: "learn",
    },
  ];
};

const getRevealedAngles = (stepIndex: number): number[] => {
  const r: number[][] = [
    [6],
    [6, 2],
    [6, 2, 8],
    [6, 2, 8, 4],
    [6, 2, 8, 4, 5],
    [6, 2, 8, 4, 5, 1, 3, 7],
  ];
  return r[Math.min(stepIndex, r.length - 1)] || [6];
};

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

const EightAngleFinder: React.FC<EightAngleFinderProps> = ({
  props: propsIn,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const props: EightAngleFinderPropsConfig = propsIn ?? {};
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: (props.initialMode ?? "learn") as ModeType,
      showModeSelector: props.showModeSelector ?? true,
      enabledModes: props.enabledModes ?? ["learn", "practice"],
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration: props.autoPlayDuration ?? 0,
      themeColor: props.themeColor ?? DS.indigo,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  const additionalProps = props.additionalProps || {};
  const defaultStartAngle = additionalProps.startingAngle ?? 135;

  const [startAngle, setStartAngle] = useState(defaultStartAngle);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState<ModeType>(
    config.initialMode,
  );
  const [animatingAngle, setAnimatingAngle] = useState<number | null>(null);
  const [animatedValue, setAnimatedValue] = useState<number>(0);
  const [showArrow, setShowArrow] = useState(false);
  const [tryNewAngleOpen, setTryNewAngleOpen] = useState(false);
  const [inputAngle, setInputAngle] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [pulseAngle, setPulseAngle] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const animRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = useMemo(() => getSteps(startAngle), [startAngle]);
  const angleInfo = useMemo(() => getAngleInfo(startAngle), [startAngle]);
  const revealedAngles = useMemo(
    () => getRevealedAngles(currentStep),
    [currentStep],
  );

  // ── KEYFRAMES ──
  useEffect(() => {
    const id = "eight-angle-singularity-kf";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
            @keyframes fadeInUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
            @keyframes fadeInScale { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
            @keyframes popIn { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
            @keyframes pulseG1 { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(83,48,134,0.35)} 50%{transform:scale(1.1);box-shadow:0 0 0 10px rgba(83,48,134,0)} }
            @keyframes pulseG2 { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,114,18,0.35)} 50%{transform:scale(1.1);box-shadow:0 0 0 10px rgba(255,114,18,0)} }
            @keyframes slideArrow { 0%{opacity:0;stroke-dashoffset:200} 50%{opacity:1} 100%{opacity:1;stroke-dashoffset:0} }
            @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
            @keyframes countRoll { 0%{transform:translateY(-100%);opacity:0} 60%{transform:translateY(5%);opacity:1} 100%{transform:translateY(0);opacity:1} }
            @keyframes slideInLeft { from{opacity:0;transform:translateX(-32px)} to{opacity:1;transform:translateX(0)} }
            @keyframes slideInRight { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
            @keyframes celebrateBounce { 0%,100%{transform:scale(1) rotate(0)} 25%{transform:scale(1.06) rotate(-1deg)} 50%{transform:scale(1.1) rotate(0)} 75%{transform:scale(1.06) rotate(1deg)} }
            @keyframes drawLine { from{stroke-dashoffset:1000} to{stroke-dashoffset:0} }
            @keyframes floatUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        `;
    document.head.appendChild(s);
    return () => {
      const e = document.getElementById(id);
      if (e) document.head.removeChild(e);
    };
  }, []);

  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        currentStep,
        totalSteps: steps.length,
        isPaused: !isPlaying,
        currentMode: selectedMode,
      });
  }, [currentStep, isPlaying, selectedMode, steps.length, setStepDetails]);

  useEffect(() => {
    if (isPlaying && config.autoPlayDuration > 0) {
      const t = setTimeout(() => {
        if (currentStep < steps.length - 1) handleNext();
        else setIsPlaying(false);
      }, config.autoPlayDuration);
      return () => clearTimeout(t);
    }
  }, [isPlaying, currentStep, config.autoPlayDuration, steps.length]);

  const animateAngleReveal = useCallback(
    (ai: number, tv: number) => {
      setAnimatingAngle(ai);
      setAnimatedValue(0);
      setShowArrow(true);
      setPulseAngle(ai);
      const dur = 800 / config.animationSpeed,
        st = performance.now();
      const anim = (t: number) => {
        const p = Math.min((t - st) / dur, 1);
        setAnimatedValue(Math.round(easeOutCubic(p) * tv));
        if (p < 1) animRef.current = requestAnimationFrame(anim);
        else {
          setAnimatingAngle(null);
          setTimeout(() => setPulseAngle(null), 1200);
        }
      };
      animRef.current = requestAnimationFrame(anim);
    },
    [config.animationSpeed],
  );

  useEffect(
    () => () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    },
    [],
  );

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      const ns = currentStep + 1;
      setCurrentStep(ns);
      setShowArrow(false);
      const step = steps[ns];
      if (step.type === "summary") {
        setShowSummary(true);
        [1, 3, 7].forEach((a, i) =>
          setTimeout(() => setPulseAngle(a), i * 200),
        );
        setTimeout(() => setPulseAngle(null), 1200);
      } else if (step.toAngle > 0)
        setTimeout(
          () => animateAngleReveal(step.toAngle, angleInfo[step.toAngle].value),
          300,
        );
    }
  }, [currentStep, steps, angleInfo, animateAngleReveal]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowArrow(false);
      setShowSummary(false);
      setAnimatingAngle(null);
    }
  }, [currentStep]);
  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setShowArrow(false);
    setShowSummary(false);
    setAnimatingAngle(null);
    setIsPlaying(false);
  }, []);
  const handleTryNewAngle = useCallback(() => {
    const v = parseInt(inputAngle);
    if (v >= 1 && v <= 179) {
      setStartAngle(v);
      setCurrentStep(0);
      setShowArrow(false);
      setShowSummary(false);
      setAnimatingAngle(null);
      setTryNewAngleOpen(false);
      setInputAngle("");
    }
  }, [inputAngle]);

  // ── MCQ QUIZ (now called Practice) ──
  interface MCQQuestion {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    property: string;
    propertyIcon: string;
  }
  const generateMCQQuestions = useCallback(
    (): MCQQuestion[] => [
      {
        id: 1,
        question:
          "Two parallel lines are cut by a transversal. If one angle is 70°, what is its corresponding angle?",
        options: ["70°", "110°", "90°", "180°"],
        correctIndex: 0,
        explanation:
          "Corresponding angles formed by a transversal cutting parallel lines are always equal. So the corresponding angle is also 70°.",
        property: "Corresponding Angles",
        propertyIcon: "🔍",
      },
      {
        id: 2,
        question: "Lines l ∥ m with transversal t. If ∠6 = 125°, what is ∠5?",
        options: ["125°", "55°", "65°", "45°"],
        correctIndex: 1,
        explanation:
          "∠5 and ∠6 form a linear pair. Linear pairs add up to 180°. So ∠5 = 180° − 125° = 55°.",
        property: "Linear Pair",
        propertyIcon: "📏",
      },
      {
        id: 3,
        question:
          "When two lines intersect, the vertically opposite angles are:",
        options: [
          "Supplementary (add to 180°)",
          "Always 90°",
          "Always equal",
          "Always different",
        ],
        correctIndex: 2,
        explanation:
          "Vertically opposite angles are always equal. Each pair shares two linear pairs that both sum to 180°.",
        property: "Vertically Opposite",
        propertyIcon: "🪞",
      },
      {
        id: 4,
        question:
          "Parallel lines l ∥ m, transversal t. If ∠2 = 48°, what is ∠8?",
        options: ["132°", "90°", "48°", "42°"],
        correctIndex: 2,
        explanation:
          "∠2 and ∠6 are corresponding → ∠6 = 48°. ∠6 and ∠8 are vertically opposite → ∠8 = 48°.",
        property: "Corresponding + V.O.",
        propertyIcon: "🔍🪞",
      },
      {
        id: 5,
        question:
          "A transversal crosses two parallel lines making 8 angles. If one angle is 135°, how many are 135°?",
        options: ["2 angles", "3 angles", "4 angles", "6 angles"],
        correctIndex: 2,
        explanation:
          "The 8 angles split into TWO groups of 4. If one is 135°, then 4 angles = 135° and the other 4 = 45°. Like two cricket teams!",
        property: "Two-Group Property",
        propertyIcon: "🏏",
      },
    ],
    [],
  );
  const [mcqQuestions] = useState<MCQQuestion[]>(() => generateMCQQuestions());
  const [mcqCurrentQ, setMcqCurrentQ] = useState(0);
  const [mcqSelected, setMcqSelected] = useState<number | null>(null);
  const [mcqAnswered, setMcqAnswered] = useState(false);
  const [mcqScore, setMcqScore] = useState(0);
  const [mcqCompleted, setMcqCompleted] = useState(false);
  const [mcqHoveredOption, setMcqHoveredOption] = useState<number | null>(null);
  const [mcqAnswerHistory, setMcqAnswerHistory] = useState<boolean[]>([]);
  const handleMcqSelect = useCallback(
    (idx: number) => {
      if (mcqAnswered) return;
      setMcqSelected(idx);
      setMcqAnswered(true);
      if (idx === mcqQuestions[mcqCurrentQ].correctIndex)
        setMcqScore((p) => p + 1);
      setMcqAnswerHistory((p) => [
        ...p,
        idx === mcqQuestions[mcqCurrentQ].correctIndex,
      ]);
    },
    [mcqAnswered, mcqCurrentQ, mcqQuestions],
  );
  const handleMcqNext = useCallback(() => {
    if (mcqCurrentQ < mcqQuestions.length - 1) {
      setMcqCurrentQ((p) => p + 1);
      setMcqSelected(null);
      setMcqAnswered(false);
      setMcqHoveredOption(null);
    } else setMcqCompleted(true);
  }, [mcqCurrentQ, mcqQuestions.length]);
  const handleMcqReset = useCallback(() => {
    setMcqCurrentQ(0);
    setMcqSelected(null);
    setMcqAnswered(false);
    setMcqScore(0);
    setMcqCompleted(false);
    setMcqHoveredOption(null);
    setMcqAnswerHistory([]);
  }, []);

  // ══════════════════════════════════════════════════════════════
  // DESIGN SYSTEM BUTTON
  // ══════════════════════════════════════════════════════════════

  const Btn = ({
    children,
    onClick,
    variant = "contained",
    disabled = false,
    small = false,
    style: sx = {},
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    variant?: "contained" | "outlined" | "highlight" | "text";
    disabled?: boolean;
    small?: boolean;
    style?: React.CSSProperties;
  }) => {
    const [h, setH] = useState(false);
    const [p, setP] = useState(false);
    const base: React.CSSProperties = {
      fontFamily: DS.font,
      fontWeight: 600,
      fontSize: small ? 12 : 13,
      height: small ? 34 : 40,
      padding: small ? "0 16px" : "0 24px",
      borderRadius: DS.rPill,
      border: "none",
      cursor: disabled ? "default" : "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
      transform: p
        ? "scale(0.95)"
        : h && !disabled
          ? "scale(1.03)"
          : "scale(1)",
      opacity: disabled ? 0.4 : 1,
      pointerEvents: disabled ? ("none" as const) : ("auto" as const),
      whiteSpace: "nowrap" as const,
    };
    const vars: Record<string, React.CSSProperties> = {
      contained: {
        background: gradient(),
        color: DS.white,
        boxShadow: h ? DS.shadow2 : DS.shadow1,
      },
      outlined: {
        background: DS.white,
        color: DS.indigo,
        border: `2px solid ${DS.indigo}`,
        boxShadow: h ? DS.shadow1 : "none",
      },
      highlight: {
        background: DS.orange,
        color: DS.white,
        boxShadow: h
          ? `0 4px 16px rgba(255,114,18,0.35)`
          : `0 2px 8px rgba(255,114,18,0.2)`,
      },
      text: {
        background: "transparent",
        color: DS.indigo,
        boxShadow: "none",
        textDecoration: h ? "underline" : "none",
      },
    };
    return (
      <button
        style={{ ...base, ...vars[variant], ...sx }}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => {
          setH(false);
          setP(false);
        }}
        onMouseDown={() => setP(true)}
        onMouseUp={() => setP(false)}
      >
        {children}
      </button>
    );
  };

  // ══════════════════════════════════════════════════════════════
  // SVG DIAGRAM
  // ══════════════════════════════════════════════════════════════

  const svgW = 460,
    svgH = 300,
    topY = 100,
    botY = 200,
    lineL = 40,
    lineR = 420;
  const topIntX = 280 + ((180 - 280) * (topY - 30)) / (270 - 30);
  const botIntX = 280 + ((180 - 280) * (botY - 30)) / (270 - 30);

  const badgePos = (n: number) => {
    const o = 34;
    const m: Record<number, { x: number; y: number }> = {
      1: { x: topIntX - o, y: topY - o + 4 },
      2: { x: topIntX + o, y: topY - o + 4 },
      3: { x: topIntX + o, y: topY + o - 4 },
      4: { x: topIntX - o, y: topY + o - 4 },
      5: { x: botIntX - o, y: botY - o + 4 },
      6: { x: botIntX + o, y: botY - o + 4 },
      7: { x: botIntX + o, y: botY + o - 4 },
      8: { x: botIntX - o, y: botY + o - 4 },
    };
    return m[n] || { x: 0, y: 0 };
  };

  const renderBadge = (
    num: number,
    revealed: boolean,
    _isPractice = false,
    isCurPractice = false,
  ) => {
    const pos = badgePos(num);
    const info = angleInfo[num];
    const isAnim = animatingAngle === num,
      isPulse = pulseAngle === num,
      g1 = info.group === 1;
    const col = revealed ? (g1 ? DS.group1 : DS.group2) : DS.grey;
    const bg = revealed ? (g1 ? DS.group1Light : DS.group2Light) : DS.offWhite;
    const val = isAnim
      ? `${animatedValue}°`
      : revealed
        ? `${info.value}°`
        : "?";
    return (
      <div
        key={num}
        style={{
          position: "absolute",
          left: pos.x - 20,
          top: pos.y - 14,
          width: 40,
          height: 28,
          borderRadius: DS.rBadge,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: DS.font,
          fontWeight: 700,
          fontSize: 12,
          color: col,
          backgroundColor: bg,
          border: `2px solid ${col}`,
          transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
          animation: isPulse
            ? g1
              ? "pulseG1 0.8s ease-in-out"
              : "pulseG2 0.8s ease-in-out"
            : isAnim
              ? "popIn 0.5s ease-out"
              : "none",
          zIndex: isAnim || isPulse ? 10 : 2,
          boxShadow: revealed
            ? `0 2px 8px ${g1 ? "rgba(83,48,134,0.18)" : "rgba(255,114,18,0.18)"}`
            : "0 1px 3px rgba(0,0,0,0.06)",
          cursor: isCurPractice ? "pointer" : "default",
        }}
      >
        <span
          style={{
            fontSize: 10,
            opacity: 0.5,
            marginRight: 2,
            fontWeight: 800,
          }}
        >
          {num}
        </span>
        <span
          style={{
            animation: isAnim ? "countRoll 0.4s ease-out" : "none",
            fontWeight: 800,
          }}
        >
          {isCurPractice && !revealed ? "?" : val}
        </span>
      </div>
    );
  };

  const renderArrow = () => {
    if (!showArrow || currentStep === 0 || currentStep >= steps.length)
      return null;
    const step = steps[currentStep];
    if (step.type === "summary" || step.type === "intro") return null;
    const from = badgePos(step.fromAngle),
      to = badgePos(step.toAngle);
    const color =
      step.type === "corresponding"
        ? DS.indigo
        : step.type === "vertically_opposite"
          ? "#E67E22"
          : DS.success;
    return (
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: svgW,
          height: svgH,
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        <defs>
          <marker
            id="ah2"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={color} />
          </marker>
        </defs>
        <line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={color}
          strokeWidth={2.5}
          strokeDasharray="6 3"
          markerEnd="url(#ah2)"
          style={{ animation: "slideArrow 0.6s ease-out forwards" }}
        />
        <foreignObject
          x={(from.x + to.x) / 2 - 65}
          y={(from.y + to.y) / 2 - 14}
          width={130}
          height={28}
        >
          <div
            style={{
              background: color,
              color: DS.white,
              borderRadius: DS.rPill,
              padding: "3px 10px",
              fontSize: 10,
              fontFamily: DS.font,
              fontWeight: 600,
              textAlign: "center",
              whiteSpace: "nowrap",
              animation: "fadeInScale 0.4s ease-out 0.2s both",
            }}
          >
            {step.propertyIcon} {step.property}
          </div>
        </foreignObject>
      </svg>
    );
  };

  const renderDiagram = (ra: number[], isPractice = false, cp?: number) => (
    <div
      style={{
        position: "relative",
        width: svgW,
        height: svgH,
        margin: "0 auto",
      }}
    >
      <svg
        width={svgW}
        height={svgH}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <pattern
            id="gr2"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke={DS.lightGrey}
              strokeWidth="0.4"
            />
          </pattern>
        </defs>
        <rect width={svgW} height={svgH} fill="url(#gr2)" rx="12" />
        <line
          x1={lineL}
          y1={topY}
          x2={lineR}
          y2={topY}
          stroke={DS.dark}
          strokeWidth={2.5}
          style={{ animation: "drawLine 0.8s ease-out forwards" }}
          strokeDasharray="1000"
        />
        <polygon
          points={`${topIntX + 50},${topY - 5} ${topIntX + 58},${topY} ${topIntX + 50},${topY + 5}`}
          fill={DS.dark}
        />
        <text
          x={lineR + 8}
          y={topY + 5}
          fontFamily={DS.font}
          fontSize={16}
          fill={DS.group1}
          fontWeight="bold"
        >
          l
        </text>
        <line
          x1={lineL}
          y1={botY}
          x2={lineR}
          y2={botY}
          stroke={DS.dark}
          strokeWidth={2.5}
          style={{ animation: "drawLine 0.8s ease-out 0.2s forwards" }}
          strokeDasharray="1000"
        />
        <polygon
          points={`${botIntX + 50},${botY - 5} ${botIntX + 58},${botY} ${botIntX + 50},${botY + 5}`}
          fill={DS.dark}
        />
        <text
          x={lineR + 8}
          y={botY + 5}
          fontFamily={DS.font}
          fontSize={16}
          fill={DS.group1}
          fontWeight="bold"
        >
          m
        </text>
        <line
          x1={280}
          y1={30}
          x2={180}
          y2={270}
          stroke={DS.dark}
          strokeWidth={2.5}
          style={{ animation: "drawLine 0.8s ease-out 0.4s forwards" }}
          strokeDasharray="1000"
        />
        <text
          x={286}
          y={32}
          fontFamily={DS.font}
          fontSize={16}
          fill={DS.orange}
          fontWeight="bold"
        >
          t
        </text>
        <circle
          cx={topIntX}
          cy={topY}
          r={4.5}
          fill={DS.indigo}
          style={{ animation: "popIn 0.5s ease-out 0.6s both" }}
        />
        <circle
          cx={botIntX}
          cy={botY}
          r={4.5}
          fill={DS.indigo}
          style={{ animation: "popIn 0.5s ease-out 0.7s both" }}
        />
      </svg>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) =>
        renderBadge(n, ra.includes(n), isPractice, isPractice && n === cp),
      )}
      {!isPractice && renderArrow()}
    </div>
  );

  // ══════════════════════════════════════════════════════════════
  // LEARN MODE PANELS
  // ══════════════════════════════════════════════════════════════

  const renderStepPanel = () => {
    const step = steps[currentStep];
    if (!step) return null;
    const pc =
      step.type === "corresponding"
        ? DS.indigo
        : step.type === "vertically_opposite"
          ? "#E67E22"
          : step.type === "linear_pair"
            ? DS.success
            : DS.orange;
    return (
      <div
        style={{
          background: DS.white,
          borderRadius: DS.rCard,
          padding: "16px 20px",
          margin: "12px 0",
          boxShadow: DS.shadow1,
          border: `1.5px solid ${DS.lightGrey}`,
          animation: "fadeInUp 0.4s ease-out",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${pc}, transparent)`,
            backgroundSize: "200% 100%",
            animation: "shimmer 2s linear infinite",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 22 }}>{step.propertyIcon}</span>
          <div>
            <div
              style={{
                fontFamily: DS.font,
                fontWeight: 700,
                fontSize: 15,
                color: DS.dark,
              }}
            >
              Step {currentStep}/{steps.length - 1}: {step.title}
            </div>
            <span
              style={{
                display: "inline-block",
                background: pc,
                color: DS.white,
                borderRadius: DS.rPill,
                padding: "2px 12px",
                fontSize: 11,
                fontFamily: DS.font,
                fontWeight: 600,
                marginTop: 3,
              }}
            >
              {step.property}
            </span>
          </div>
        </div>
        <p
          style={{
            fontFamily: DS.font,
            fontSize: 13,
            color: "#6B6B6B",
            lineHeight: 1.65,
            margin: 0,
            fontWeight: 500,
          }}
        >
          {step.description}
        </p>
      </div>
    );
  };

  const renderSummary = () => {
    if (!showSummary) return null;
    const sup = 180 - startAngle;
    return (
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.group1Light}40, ${DS.group2Light}60)`,
          borderRadius: DS.rCard,
          padding: 18,
          margin: "12px 0",
          animation: "celebrateBounce 0.6s ease-out",
          border: `1.5px solid ${DS.lightGrey}`,
        }}
      >
        <div
          style={{
            fontFamily: DS.font,
            fontWeight: 800,
            fontSize: 15,
            color: DS.dark,
            textAlign: "center",
            marginBottom: 14,
          }}
        >
          🏏 Two Teams — Just Like Cricket! 🏏
        </div>
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: DS.white,
              borderRadius: 14,
              padding: "14px 22px",
              border: `3px solid ${DS.group1}`,
              textAlign: "center",
              animation: "slideInLeft 0.5s ease-out",
              flex: "1 1 140px",
              maxWidth: 200,
            }}
          >
            <div
              style={{
                fontFamily: DS.font,
                fontWeight: 800,
                fontSize: 13,
                color: DS.group1,
              }}
            >
              Team Purple 💜
            </div>
            <div
              style={{
                fontFamily: DS.font,
                fontWeight: 900,
                fontSize: 30,
                color: DS.group1,
              }}
            >
              {startAngle}°
            </div>
            <div
              style={{
                fontFamily: DS.font,
                fontSize: 12,
                color: "#888",
                fontWeight: 600,
              }}
            >
              ∠2, ∠4, ∠6, ∠8
            </div>
            <div
              style={{
                display: "flex",
                gap: 4,
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              {[2, 4, 6, 8].map((n) => (
                <div
                  key={n}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    background: DS.group1,
                    color: DS.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: DS.font,
                    fontSize: 11,
                    fontWeight: 700,
                    animation: `popIn 0.3s ease-out ${n * 0.08}s both`,
                  }}
                >
                  {n}
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              background: DS.white,
              borderRadius: 14,
              padding: "14px 22px",
              border: `3px solid ${DS.group2}`,
              textAlign: "center",
              animation: "slideInRight 0.5s ease-out",
              flex: "1 1 140px",
              maxWidth: 200,
            }}
          >
            <div
              style={{
                fontFamily: DS.font,
                fontWeight: 800,
                fontSize: 13,
                color: DS.group2,
              }}
            >
              Team Orange 🧡
            </div>
            <div
              style={{
                fontFamily: DS.font,
                fontWeight: 900,
                fontSize: 30,
                color: DS.group2,
              }}
            >
              {sup}°
            </div>
            <div
              style={{
                fontFamily: DS.font,
                fontSize: 12,
                color: "#888",
                fontWeight: 600,
              }}
            >
              ∠1, ∠3, ∠5, ∠7
            </div>
            <div
              style={{
                display: "flex",
                gap: 4,
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              {[1, 3, 5, 7].map((n) => (
                <div
                  key={n}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    background: DS.group2,
                    color: DS.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: DS.font,
                    fontSize: 11,
                    fontWeight: 700,
                    animation: `popIn 0.3s ease-out ${n * 0.08}s both`,
                  }}
                >
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 14,
            fontFamily: DS.font,
            fontSize: 12,
            color: "#888",
            fontWeight: 600,
          }}
        >
          {startAngle}° × 4 + {sup}° × 4 = {startAngle * 4 + sup * 4}° ✓
        </div>
      </div>
    );
  };

  const renderNav = () => (
    <div
      style={{
        display: "flex",
        gap: 8,
        justifyContent: "center",
        marginTop: 10,
        flexWrap: "wrap",
      }}
    >
      <Btn
        variant="outlined"
        onClick={handlePrev}
        disabled={currentStep === 0}
        small
      >
        ◀ Prev
      </Btn>
      <Btn
        variant="contained"
        onClick={handleNext}
        disabled={currentStep >= steps.length - 1}
      >
        Next Step ▶
      </Btn>
      <Btn variant="text" onClick={handleReset} small>
        🔄 Reset
      </Btn>
      <Btn
        variant="highlight"
        onClick={() => setTryNewAngleOpen(!tryNewAngleOpen)}
        small
      >
        🎯 Try New Angle
      </Btn>
    </div>
  );

  const renderTryNew = () => {
    if (!tryNewAngleOpen) return null;
    return (
      <div
        style={{
          background: DS.orangeLight,
          borderRadius: DS.rCard,
          padding: 16,
          margin: "12px 0",
          animation: "fadeInUp 0.3s ease-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
          border: `1.5px solid ${DS.orange}30`,
        }}
      >
        <span
          style={{
            fontFamily: DS.font,
            fontWeight: 600,
            fontSize: 13,
            color: DS.dark,
          }}
        >
          Enter angle (1°–179°):
        </span>
        <input
          type="number"
          min={1}
          max={179}
          value={inputAngle}
          onChange={(e) => setInputAngle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleTryNewAngle()}
          style={{
            width: 72,
            padding: "8px 12px",
            borderRadius: DS.rBadge,
            border: `2px solid ${DS.orange}`,
            fontFamily: DS.font,
            fontWeight: 700,
            fontSize: 16,
            textAlign: "center",
            outline: "none",
            color: DS.dark,
            background: DS.white,
          }}
          placeholder="135"
        />
        <Btn variant="highlight" onClick={handleTryNewAngle} small>
          Go! 🚀
        </Btn>
      </div>
    );
  };

  const renderDots = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 6,
        margin: "10px 0",
      }}
    >
      {steps.map((_, i) => (
        <div
          key={i}
          onClick={() => {
            if (i <= currentStep) {
              setCurrentStep(i);
              setShowSummary(i === steps.length - 1);
              setShowArrow(false);
            }
          }}
          style={{
            width: i === currentStep ? 28 : 10,
            height: 10,
            borderRadius: 5,
            background: i <= currentStep ? gradient(90) : DS.lightGrey,
            transition: "all 0.4s cubic-bezier(.4,0,.2,1)",
            cursor: i <= currentStep ? "pointer" : "default",
          }}
        />
      ))}
    </div>
  );

  const renderLegend = () => (
    <div
      style={{
        display: "flex",
        gap: 12,
        justifyContent: "center",
        flexWrap: "wrap",
        padding: "8px 12px",
        borderRadius: DS.rBadge,
        background: DS.offWhite,
        margin: "6px 0",
      }}
    >
      {[
        { icon: "🔍", label: "Corresponding", color: DS.indigo },
        { icon: "🪞", label: "Vert. Opposite", color: "#E67E22" },
        { icon: "📏", label: "Linear Pair", color: DS.success },
      ].map((it) => (
        <div
          key={it.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontFamily: DS.font,
            fontSize: 11,
            fontWeight: 600,
            color: it.color,
          }}
        >
          <span>{it.icon}</span>
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );

  // ══════════════════════════════════════════════════════════════
  // MODE TABS
  // ══════════════════════════════════════════════════════════════

  const renderTabs = () => {
    if (!config.showModeSelector) return null;
    const modes: { key: ModeType; label: string; icon: string }[] = [
      { key: "learn", label: "Learn", icon: "📖" },
      { key: "practice", label: "Practice", icon: "🧠" },
    ];
    return (
      <div
        style={{
          display: "flex",
          gap: 4,
          justifyContent: "center",
          margin: "10px 0",
          background: DS.offWhite,
          borderRadius: DS.rPill,
          padding: 4,
        }}
      >
        {modes
          .filter((m) => config.enabledModes.includes(m.key))
          .map((mode) => (
            <button
              key={mode.key}
              onClick={() => {
                setSelectedMode(mode.key);
                if (mode.key === "practice") handleMcqReset();
                else handleReset();
              }}
              style={{
                padding: "8px 20px",
                borderRadius: DS.rPill,
                border: "none",
                cursor: "pointer",
                fontFamily: DS.font,
                fontWeight: 700,
                fontSize: 13,
                background:
                  selectedMode === mode.key ? DS.white : "transparent",
                color: selectedMode === mode.key ? DS.indigo : "#999",
                boxShadow: selectedMode === mode.key ? DS.shadow1 : "none",
                transition: "all 0.3s ease",
              }}
            >
              {mode.icon} {mode.label}
            </button>
          ))}
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════
  // PRACTICE MODE (MCQ)
  // ══════════════════════════════════════════════════════════════

  const renderPractice = () => {
    if (mcqCompleted) {
      const pct = Math.round((mcqScore / mcqQuestions.length) * 100);
      const emoji = pct === 100 ? "🏆" : pct >= 60 ? "⭐" : "💪";
      const msg =
        pct === 100
          ? "Perfect Score! Geometry Champion!"
          : pct >= 60
            ? "Great job! Keep practising!"
            : "Good effort! Review the Learn mode.";
      return (
        <div
          style={{
            textAlign: "center",
            padding: "12px 0",
            animation: "fadeInUp 0.5s ease-out",
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${DS.group1Light}30, ${DS.group2Light}40, ${DS.offWhite})`,
              borderRadius: 20,
              padding: 30,
              border: `1.5px solid ${DS.lightGrey}`,
              animation: "celebrateBounce 0.6s ease-out",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 8 }}>{emoji}</div>
            <div
              style={{
                fontFamily: DS.font,
                fontWeight: 900,
                fontSize: 28,
                color: DS.dark,
              }}
            >
              {mcqScore}/{mcqQuestions.length}
            </div>
            <div
              style={{
                fontFamily: DS.font,
                fontSize: 14,
                color: "#888",
                fontWeight: 600,
                marginBottom: 18,
              }}
            >
              {msg}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginBottom: 18,
              }}
            >
              {mcqAnswerHistory.map((ok, i) => (
                <div
                  key={i}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: DS.rBadge,
                    background: ok ? DS.success : DS.error,
                    color: DS.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: DS.font,
                    fontWeight: 800,
                    fontSize: 15,
                    animation: `popIn 0.3s ease-out ${i * 0.1}s both`,
                    boxShadow: `0 3px 10px ${ok ? "rgba(46,204,113,0.3)" : "rgba(231,76,60,0.3)"}`,
                  }}
                >
                  {ok ? "✓" : "✗"}
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Btn variant="contained" onClick={handleMcqReset}>
                🔄 Try Again
              </Btn>
              <Btn
                variant="outlined"
                onClick={() => {
                  setSelectedMode("learn");
                  handleReset();
                }}
              >
                📖 Review Learn
              </Btn>
            </div>
          </div>
        </div>
      );
    }
    const q = mcqQuestions[mcqCurrentQ],
      cIdx = q.correctIndex,
      optL = ["A", "B", "C", "D"];
    const optStyle = (idx: number): React.CSSProperties => {
      const isSel = mcqSelected === idx,
        isCorr = idx === cIdx,
        isHov = mcqHoveredOption === idx && !mcqAnswered;
      let bg = DS.white,
        bdr = DS.lightGrey,
        col = DS.dark,
        shd = "0 1px 4px rgba(0,0,0,0.03)";
      if (mcqAnswered) {
        if (isCorr) {
          bg = DS.successLight;
          bdr = DS.success;
          col = "#1A7A3A";
          shd = `0 4px 14px rgba(46,204,113,0.15)`;
        } else if (isSel) {
          bg = DS.errorLight;
          bdr = DS.error;
          col = "#922B21";
          shd = `0 4px 14px rgba(231,76,60,0.12)`;
        } else {
          bg = DS.offWhite;
          bdr = DS.lightGrey;
          col = DS.grey;
        }
      } else if (isHov) {
        bg = DS.indigoLight + "30";
        bdr = DS.indigo;
        shd = DS.shadow1;
      }
      return {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "13px 16px",
        borderRadius: 14,
        border: `2.5px solid ${bdr}`,
        backgroundColor: bg,
        color: col,
        cursor: mcqAnswered ? "default" : "pointer",
        transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
        fontFamily: DS.font,
        fontWeight: 600,
        fontSize: 14,
        textAlign: "left" as const,
        boxShadow: shd,
        animation: `floatUp 0.35s ease-out ${idx * 0.07}s both`,
      };
    };
    return (
      <div style={{ padding: "6px 0", animation: "fadeInUp 0.4s ease-out" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              background: DS.offWhite,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${((mcqCurrentQ + (mcqAnswered ? 1 : 0)) / mcqQuestions.length) * 100}%`,
                height: "100%",
                borderRadius: 4,
                background: gradient(90),
                transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: DS.font,
              fontWeight: 700,
              fontSize: 12,
              color: "#999",
            }}
          >
            {mcqCurrentQ + 1}/{mcqQuestions.length}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: DS.successLight,
              borderRadius: DS.rPill,
              padding: "4px 14px",
              border: `1.5px solid ${DS.success}30`,
            }}
          >
            <span style={{ fontSize: 14 }}>⭐</span>
            <span
              style={{
                fontFamily: DS.font,
                fontWeight: 700,
                fontSize: 13,
                color: "#1A7A3A",
              }}
            >
              {mcqScore} correct
            </span>
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              background: DS.indigoLight + "30",
              borderRadius: DS.rPill,
              padding: "4px 12px",
            }}
          >
            <span style={{ fontSize: 12 }}>{q.propertyIcon}</span>
            <span
              style={{
                fontFamily: DS.font,
                fontWeight: 600,
                fontSize: 11,
                color: "#888",
              }}
            >
              {q.property}
            </span>
          </div>
        </div>
        <div
          style={{
            background: DS.white,
            borderRadius: DS.rCard,
            padding: "16px 18px",
            marginBottom: 14,
            boxShadow: DS.shadow1,
            border: `1.5px solid ${DS.lightGrey}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: gradient(90),
            }}
          />
          <div
            style={{
              fontFamily: DS.font,
              fontWeight: 700,
              fontSize: 12,
              color: DS.indigo,
              marginBottom: 6,
            }}
          >
            Question {mcqCurrentQ + 1}
          </div>
          <div
            style={{
              fontFamily: DS.font,
              fontSize: 15,
              color: DS.dark,
              fontWeight: 600,
              lineHeight: 1.6,
            }}
          >
            {q.question}
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
          {q.options.map((opt, idx) => (
            <div
              key={idx}
              style={optStyle(idx)}
              onClick={() => handleMcqSelect(idx)}
              onMouseEnter={() => !mcqAnswered && setMcqHoveredOption(idx)}
              onMouseLeave={() => setMcqHoveredOption(null)}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: DS.rBadge,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: DS.font,
                  fontWeight: 700,
                  fontSize: 14,
                  background:
                    mcqAnswered && idx === cIdx
                      ? DS.success
                      : mcqAnswered && mcqSelected === idx && idx !== cIdx
                        ? DS.error
                        : mcqHoveredOption === idx && !mcqAnswered
                          ? DS.indigo
                          : DS.offWhite,
                  color:
                    (mcqAnswered && (idx === cIdx || mcqSelected === idx)) ||
                    (mcqHoveredOption === idx && !mcqAnswered)
                      ? DS.white
                      : "#999",
                  transition: "all 0.25s ease",
                }}
              >
                {mcqAnswered && idx === cIdx
                  ? "✓"
                  : mcqAnswered && mcqSelected === idx && idx !== cIdx
                    ? "✗"
                    : optL[idx]}
              </div>
              <span style={{ flex: 1 }}>{opt}</span>
              {mcqAnswered && idx === cIdx && (
                <span
                  style={{ fontSize: 18, animation: "popIn 0.4s ease-out" }}
                >
                  ✅
                </span>
              )}
              {mcqAnswered && mcqSelected === idx && idx !== cIdx && (
                <span
                  style={{ fontSize: 18, animation: "popIn 0.4s ease-out" }}
                >
                  ❌
                </span>
              )}
            </div>
          ))}
        </div>
        {mcqAnswered && (
          <div
            style={{
              background:
                mcqSelected === cIdx ? DS.successLight : DS.errorLight,
              borderRadius: 14,
              padding: "14px 16px",
              marginBottom: 14,
              border: `2px solid ${mcqSelected === cIdx ? DS.success + "30" : DS.error + "30"}`,
              animation: "fadeInUp 0.4s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 18 }}>
                {mcqSelected === cIdx ? "🎉" : "💡"}
              </span>
              <span
                style={{
                  fontFamily: DS.font,
                  fontWeight: 700,
                  fontSize: 14,
                  color: mcqSelected === cIdx ? "#1A7A3A" : "#922B21",
                }}
              >
                {mcqSelected === cIdx
                  ? "Correct!"
                  : `Correct answer: ${q.options[cIdx]}`}
              </span>
            </div>
            <div
              style={{
                fontFamily: DS.font,
                fontSize: 13,
                color: "#6B6B6B",
                fontWeight: 500,
                lineHeight: 1.65,
              }}
            >
              {q.explanation}
            </div>
          </div>
        )}
        {mcqAnswered && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              animation: "fadeInUp 0.3s ease-out 0.15s both",
            }}
          >
            <Btn variant="contained" onClick={handleMcqNext}>
              {mcqCurrentQ < mcqQuestions.length - 1
                ? "Next Question ▶"
                : "See Results 🏆"}
            </Btn>
          </div>
        )}
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ══════════════════════════════════════════════════════════════

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: config.width,
        margin: "0 auto",
        background: DS.white,
        borderRadius: 20,
        overflow: "hidden",
        fontFamily: DS.font,
        boxShadow: DS.shadow3,
        border: `1px solid ${DS.lightGrey}`,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: gradient(),
          padding: "20px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -20,
            left: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.12)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -10,
            right: 30,
            width: 50,
            height: 50,
            border: "3px solid rgba(255,255,255,0.1)",
            transform: "rotate(15deg)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 8,
            right: -10,
            width: 0,
            height: 0,
            borderLeft: "20px solid transparent",
            borderRight: "20px solid transparent",
            borderBottom: "34px solid rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            fontFamily: DS.font,
            fontWeight: 900,
            fontSize: 22,
            color: DS.white,
            letterSpacing: 0.5,
            textShadow: "0 2px 8px rgba(0,0,0,0.15)",
            position: "relative",
          }}
        >
          🔢 Eight Angle Finder
        </div>
        <div
          style={{
            fontFamily: DS.font,
            fontSize: 12,
            color: "rgba(255,255,255,0.8)",
            fontWeight: 500,
            position: "relative",
            marginTop: 2,
          }}
        >
          Find all 8 angles from just ONE — Parallel Lines & Transversals
        </div>
      </div>

      {/* BODY */}
      <div style={{ padding: "8px 20px 20px" }}>
        {renderTabs()}
        {selectedMode === "learn" ? (
          <>
            <div
              style={{
                textAlign: "center",
                fontFamily: DS.font,
                fontWeight: 600,
                fontSize: 13,
                color: "#999",
                margin: "6px 0",
              }}
            >
              Given: ∠6 ={" "}
              <span style={{ color: DS.group1, fontWeight: 800, fontSize: 18 }}>
                {startAngle}°
              </span>{" "}
              — Watch how we find all 8!
            </div>
            {renderLegend()}
            {renderDiagram(revealedAngles)}
            {renderStepPanel()}
            {renderSummary()}
            {renderDots()}
            {renderNav()}
            {renderTryNew()}
            {currentStep === 0 && (
              <div
                style={{
                  background: DS.orangeLight,
                  border: `1.5px solid ${DS.orange}25`,
                  borderRadius: DS.rCard,
                  padding: "12px 16px",
                  margin: "10px 0",
                  animation: "fadeInUp 0.5s ease-out 0.5s both",
                }}
              >
                <div
                  style={{
                    fontFamily: DS.font,
                    fontSize: 12,
                    color: "#A0522D",
                    fontWeight: 600,
                    lineHeight: 1.55,
                  }}
                >
                  📋 <strong>How to use:</strong> Click "Next Step" to follow
                  the reasoning chain. Each new angle is found using a specific
                  property. Try a different starting angle after!
                </div>
              </div>
            )}
          </>
        ) : (
          renderPractice()
        )}
      </div>
    </div>
  );
};

export default EightAngleFinder;
