// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: token_multiplication_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

// @ts-ignore - react types may not be resolved in this workspace
import React, { useState, useEffect, useCallback, useMemo } from "react";
// @ts-ignore - lucide-react types may not be resolved in this workspace
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Plus, Star, Sparkles } from "lucide-react";

// ==================== DESIGN SYSTEM TOKENS ====================

const DS = {
  // Primary palette
  primary: "#4A4DC9",
  accent: "#FF7212",
  // Gradient endpoints
  gradientStart: "#533086",
  gradientEnd: "#FC9145",
  // Light tints
  primaryLight: "#C1C1EA",
  accentLight: "#FFF3E4",
  // Neutrals
  textDark: "#4E4E4E",
  textMuted: "#CACACA",
  borderLight: "#EBEBEB",
  bgLight: "#F5F5F5",
  white: "#FFFFFF",
  // Semantic
  positive: "#4A4DC9", // indigo for positive tokens
  positiveBright: "#6366F1",
  positiveLight: "#C1C1EA",
  negative: "#FF7212", // orange for negative tokens
  negativeBright: "#FC9145",
  negativeLight: "#FFF3E4",
  // Shapes
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 40,
    full: 9999,
  },
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  // Font
  font: "'Poppins', sans-serif",
  // Button heights
  buttonHeight: 40,
} as const;

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

interface TokenMultiplicationAdditionalProps {
  multiplierA?: number;
  multiplicandA?: number;
  multiplierB?: number;
  multiplicandB?: number;
  showSignRule?: boolean;
  tokenSize?: number;
  bagStyle?: "jute" | "cloth" | "default";
  context?: "samosa" | "default";
}

interface TokenMultiplicationToolProps {
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
    additionalProps?: TokenMultiplicationAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

type PropsShape = NonNullable<TokenMultiplicationToolProps["props"]>;

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "The Empty Bag",
    description:
      "Welcome to Ramu's Samosa Stall! 🫓 Every multiplication starts with an empty jute bag. Today we learn how to multiply integers using tokens. Purple (+) tokens are positive, Orange (−) tokens are negative. Let's begin!",
    type: "intro",
    mode: "learn",
    data: { phase: "empty_bag" },
  },
  {
    id: 2,
    title: "Positive × Positive",
    description:
      "Ramu packs 2 samosas per plate. He fills 4 plates. That's 4 × 2! We place 2 purple tokens into the bag, 4 times. Watch each group drop in!",
    type: "explanation",
    mode: "learn",
    data: { phase: "pos_pos", multiplier: 4, multiplicand: 2 },
  },
  {
    id: 3,
    title: "Positive × Negative",
    description:
      "Now imagine each plate has 2 chilli penalties (−2 each)! That's 4 × (−2). We place 2 orange tokens into the bag, 4 times. What colour fills the bag?",
    type: "explanation",
    mode: "learn",
    data: { phase: "pos_neg", multiplier: 4, multiplicand: -2 },
  },
  {
    id: 4,
    title: "Compare the Results",
    description:
      "Look! 4 × 2 = +8 (all purple) and 4 × (−2) = −8 (all orange). The magnitude is the same — 8 tokens! Only the sign changed because we switched from purple to orange tokens.",
    type: "explanation",
    mode: "learn",
    data: { phase: "compare" },
  },
  {
    id: 5,
    title: "The Sign Rule",
    description:
      "When the multiplier is positive, we PLACE tokens into the bag. Positive multiplicand → purple tokens → positive result. Negative multiplicand → orange tokens → negative result. State this rule in your own words!",
    type: "explanation",
    mode: "learn",
    data: { phase: "sign_rule" },
  },
];

// ==================== ANIMATION HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
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

// ==================== TOKEN COMPONENT ====================

interface TokenProps {
  type: "positive" | "negative";
  size: number;
  x: number;
  y: number;
  delay: number;
  animated: boolean;
  glowing?: boolean;
}

const Token: React.FC<TokenProps> = ({
  type,
  size,
  x,
  y,
  delay,
  animated,
  glowing,
}) => {
  const isPositive = type === "positive";
  const baseColor = isPositive ? DS.primary : DS.accent;
  const brightColor = isPositive ? DS.positiveBright : DS.negativeBright;
  const symbol = isPositive ? "+" : "−";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${brightColor}, ${baseColor})`,
        border: `3px solid ${baseColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: DS.white,
        fontWeight: 700,
        fontSize: size * 0.48,
        fontFamily: DS.font,
        boxShadow: glowing
          ? `0 0 16px ${baseColor}60, 0 4px 12px rgba(0,0,0,0.15)`
          : `0 3px 10px rgba(0,0,0,0.12), inset 0 1px 3px rgba(255,255,255,0.25)`,
        animation: animated ? `tokenDrop 0.5s ease-out ${delay}s both` : "none",
        zIndex: 10,
        transition: "box-shadow 0.3s ease",
      }}
    >
      {symbol}
    </div>
  );
};

// ==================== MINI TOKEN (for inline use) ====================

const MiniToken: React.FC<{
  type: "positive" | "negative";
  size?: number;
  delay?: number;
}> = ({ type, size = 28, delay = 0 }) => {
  const isPositive = type === "positive";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${isPositive ? DS.positiveBright : DS.negativeBright}, ${isPositive ? DS.primary : DS.accent})`,
        border: `2.5px solid ${isPositive ? DS.primary : DS.accent}`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: DS.white,
        fontWeight: 700,
        fontSize: size * 0.45,
        fontFamily: DS.font,
        boxShadow: `0 2px 6px rgba(0,0,0,0.12)`,
        animation: delay > 0 ? `popIn 0.35s ease-out ${delay}s both` : "none",
        flexShrink: 0,
      }}
    >
      {isPositive ? "+" : "−"}
    </div>
  );
};

// ==================== BAG COMPONENT ====================

interface BagProps {
  width: number;
  height: number;
  glowing: boolean;
  tokensInside: number;
  tokenType: "positive" | "negative" | "none";
  label?: string;
}

const Bag: React.FC<BagProps> = ({
  width,
  height,
  glowing,
  tokensInside,
  tokenType,
  label,
}) => {
  const bagBase = "#B8956A";
  const bagDark = "#96754F";
  const bagLight = "#D4B68C";
  const glowColor =
    tokenType === "positive"
      ? DS.primary
      : tokenType === "negative"
        ? DS.accent
        : "#B8956A";

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Bag opening — ellipse */}
      <div
        style={{
          width: width * 0.7,
          height: 18,
          borderRadius: "50%",
          background: `linear-gradient(180deg, ${bagDark}, ${bagBase})`,
          border: `2.5px solid ${bagDark}`,
          zIndex: 5,
          position: "relative",
          top: 8,
        }}
      />
      {/* Bag body */}
      <svg
        width={width}
        height={height - 8}
        viewBox={`0 0 ${width} ${height - 8}`}
        style={{ position: "relative", zIndex: 3 }}
      >
        <defs>
          <linearGradient id="bagGradSing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={bagLight} />
            <stop offset="45%" stopColor={bagBase} />
            <stop offset="100%" stopColor={bagDark} />
          </linearGradient>
          {glowing && (
            <filter id="bagGlowSing">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>
        <path
          d={`M ${width * 0.15} 0 Q ${width * 0.06} ${(height - 8) * 0.5} ${width * 0.22} ${height - 28} Q ${width * 0.36} ${height - 4} ${width * 0.5} ${height - 4} Q ${width * 0.64} ${height - 4} ${width * 0.78} ${height - 28} Q ${width * 0.94} ${(height - 8) * 0.5} ${width * 0.85} 0`}
          fill="url(#bagGradSing)"
          stroke={glowing ? glowColor : bagDark}
          strokeWidth={glowing ? 3 : 2.5}
          filter={glowing ? "url(#bagGlowSing)" : undefined}
          style={{ transition: "stroke 0.4s ease" }}
        />
        {/* Crosshatch lines */}
        {[0.3, 0.5, 0.7].map((r, i) => (
          <line
            key={`hl${i}`}
            x1={width * 0.22}
            y1={(height - 8) * r}
            x2={width * 0.78}
            y2={(height - 8) * r}
            stroke={bagDark}
            strokeWidth="0.8"
            opacity="0.25"
          />
        ))}
      </svg>

      {/* Token counter badge */}
      {tokensInside > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 22,
            left: "50%",
            transform: "translateX(-50%)",
            background:
              tokenType === "positive"
                ? `linear-gradient(135deg, ${DS.primary}, ${DS.positiveBright})`
                : `linear-gradient(135deg, ${DS.accent}, ${DS.negativeBright})`,
            color: DS.white,
            borderRadius: DS.radius.pill,
            padding: "4px 16px",
            fontWeight: 600,
            fontSize: 13,
            fontFamily: DS.font,
            boxShadow: `0 2px 10px ${tokenType === "positive" ? DS.primary : DS.accent}40`,
            zIndex: 6,
            animation: "pulse 2s ease-in-out infinite",
            whiteSpace: "nowrap",
            letterSpacing: "0.02em",
          }}
        >
          {tokensInside} {tokenType === "positive" ? "+" : "−"} tokens
        </div>
      )}

      {/* Empty bag label */}
      {label && tokensInside === 0 && (
        <div
          style={{
            position: "absolute",
            top: "42%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: bagDark,
            fontWeight: 600,
            fontSize: 14,
            fontFamily: DS.font,
            textAlign: "center",
            zIndex: 6,
            opacity: 0.55,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

// ==================== CONTAINED BUTTON ====================

interface DSButtonProps {
  label: string;
  onClick: () => void;
  variant?: "contained" | "outlined" | "texted" | "highlight";
  color?: "primary" | "accent";
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

const DSButton: React.FC<DSButtonProps> = ({
  label,
  onClick,
  variant = "contained",
  color = "primary",
  disabled = false,
  icon,
  style: extraStyle,
}) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const isPrimary = color === "primary";
  const baseColor = isPrimary ? DS.primary : DS.accent;
  const lightColor = isPrimary ? DS.primaryLight : DS.accentLight;

  const getStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      height: DS.buttonHeight,
      padding: "0 24px",
      borderRadius: DS.radius.pill,
      fontFamily: DS.font,
      fontWeight: 600,
      fontSize: 14,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      border: "none",
      outline: "none",
      whiteSpace: "nowrap",
      letterSpacing: "0.01em",
      ...extraStyle,
    };

    if (disabled) {
      if (variant === "contained") {
        return {
          ...base,
          background: DS.borderLight,
          color: DS.textMuted,
          boxShadow: "none",
        };
      }
      if (variant === "outlined") {
        return {
          ...base,
          background: "transparent",
          color: DS.textMuted,
          border: `2px solid ${DS.borderLight}`,
        };
      }
      return { ...base, background: "transparent", color: DS.textMuted };
    }

    if (variant === "contained") {
      return {
        ...base,
        background: pressed
          ? `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`
          : hovered
            ? `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`
            : baseColor,
        color: DS.white,
        boxShadow: hovered
          ? `0 6px 20px ${baseColor}40`
          : `0 2px 8px ${baseColor}25`,
        transform: pressed
          ? "scale(0.96)"
          : hovered
            ? "scale(1.03)"
            : "scale(1)",
      };
    }

    if (variant === "outlined") {
      return {
        ...base,
        background: pressed
          ? lightColor
          : hovered
            ? `${lightColor}80`
            : "transparent",
        color: baseColor,
        border: `2px solid ${pressed || hovered ? baseColor : DS.borderLight}`,
        transform: pressed ? "scale(0.96)" : "scale(1)",
      };
    }

    if (variant === "highlight") {
      return {
        ...base,
        background: pressed
          ? `linear-gradient(135deg, ${DS.accent}, ${DS.negativeBright})`
          : hovered
            ? `linear-gradient(135deg, ${DS.accent}, ${DS.negativeBright})`
            : DS.accent,
        color: DS.white,
        boxShadow: hovered
          ? `0 6px 20px ${DS.accent}40`
          : `0 2px 8px ${DS.accent}25`,
        transform: pressed
          ? "scale(0.96)"
          : hovered
            ? "scale(1.03)"
            : "scale(1)",
      };
    }

    // texted
    return {
      ...base,
      background: "transparent",
      color: pressed || hovered ? baseColor : DS.textDark,
      textDecoration: hovered ? "underline" : "none",
      padding: "0 12px",
    };
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={getStyle()}
    >
      {icon}
      {label}
    </button>
  );
};

// ==================== MAIN COMPONENT ====================

const TokenMultiplicationTool: React.FC<TokenMultiplicationToolProps> = ({
  props = {} as PropsShape,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  // ─── CONFIGURATION ───
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
      height: props.height ?? 600,
      initialMode: (props.initialMode ?? "learn") as ModeType,
      showModeSelector: props.showModeSelector ?? false,
      enabledModes: props.enabledModes ?? ["learn"],
      showNavigation: props.showNavigation ?? true,
      showPlayPause: props.showPlayPause ?? true,
      showStepIndicator: props.showStepIndicator ?? true,
      initialStep: props.initialStep ?? 1,
      filterSteps: props.filterSteps ?? null,
      animationSpeed: props.animationSpeed ?? 1,
      autoPlayDuration:
        props.autoPlayDuration ?? props.data?.autoPlayDuration ?? 0,
      themeColor: props.themeColor ?? props.data?.themeColor ?? DS.primary,
      darkMode: props.darkMode ?? false,
    }),
    [props],
  );

  // ─── ADDITIONAL PROPS ───
  const additionalProps = props.additionalProps || {};
  const toolConfig = useMemo(
    () => ({
      multiplierA: additionalProps.multiplierA ?? 4,
      multiplicandA: additionalProps.multiplicandA ?? 2,
      multiplierB: additionalProps.multiplierB ?? 4,
      multiplicandB: additionalProps.multiplicandB ?? -2,
      tokenSize: additionalProps.tokenSize ?? 38,
      context: additionalProps.context ?? "samosa",
    }),
    [additionalProps],
  );

  // ─── STATE ───
  const allSteps = props.steps || DEFAULT_STEPS;
  const availableSteps = useMemo(() => {
    if (config.filterSteps && config.filterSteps.length > 0) {
      return allSteps.filter((s) => config.filterSteps!.includes(s.id));
    }
    return allSteps;
  }, [allSteps, config.filterSteps]);

  const [selectedMode] = useState<ModeType>(config.initialMode);
  const filteredSteps = useMemo(
    () => availableSteps.filter((step) => step.mode === selectedMode),
    [availableSteps, selectedMode],
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [groupsPlaced, setGroupsPlaced] = useState(0);
  const [isAnimatingGroup, setIsAnimatingGroup] = useState(false);
  const [bagGlowing, setBagGlowing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [contentTransform, setContentTransform] = useState("translateY(0)");

  const currentStep = filteredSteps[currentStepIndex] || filteredSteps[0];

  // ─── COMPUTED ───
  const currentMultiplier = useMemo(() => {
    if (!currentStep?.data) return 0;
    if (currentStep.data.phase === "pos_pos") return toolConfig.multiplierA;
    if (currentStep.data.phase === "pos_neg") return toolConfig.multiplierB;
    return 0;
  }, [currentStep, toolConfig]);

  const currentMultiplicand = useMemo(() => {
    if (!currentStep?.data) return 0;
    if (currentStep.data.phase === "pos_pos") return toolConfig.multiplicandA;
    if (currentStep.data.phase === "pos_neg") return toolConfig.multiplicandB;
    return 0;
  }, [currentStep, toolConfig]);

  const tokenType: "positive" | "negative" =
    currentMultiplicand >= 0 ? "positive" : "negative";
  const absMultiplicand = Math.abs(currentMultiplicand);
  const totalTokens = groupsPlaced * absMultiplicand;
  const product = currentMultiplier * currentMultiplicand;

  // ─── STEP DETAILS REPORT ───
  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: currentStepIndex + 1,
        totalSteps: filteredSteps.length,
        isPaused: !isPlaying,
        currentMode: selectedMode,
      });
    }
  }, [
    currentStepIndex,
    filteredSteps.length,
    isPlaying,
    selectedMode,
    setStepDetails,
  ]);

  // ─── INJECT KEYFRAMES + FONT ───
  useEffect(() => {
    const keyframes = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(24px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOutDown {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-20px); }
            }
            @keyframes pulse {
                0%, 100% { transform: translateX(-50%) scale(1); }
                50% { transform: translateX(-50%) scale(1.05); }
            }
            @keyframes tokenDrop {
                0% { opacity: 0; transform: translateY(-70px) scale(0.2) rotate(-20deg); }
                55% { opacity: 1; transform: translateY(8px) scale(1.08) rotate(3deg); }
                75% { transform: translateY(-4px) scale(0.97) rotate(-1deg); }
                100% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
            }
            @keyframes popIn {
                0% { transform: scale(0); opacity: 0; }
                65% { transform: scale(1.12); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes slideInLeft {
                from { opacity: 0; transform: translateX(-36px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(36px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes resultBounce {
                0% { transform: scale(0) rotate(-8deg); }
                50% { transform: scale(1.12) rotate(2deg); }
                70% { transform: scale(0.96) rotate(-1deg); }
                100% { transform: scale(1) rotate(0deg); }
            }
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
            @keyframes shimmerGrad {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
            }
            @keyframes glowPulse {
                0%, 100% { box-shadow: 0 0 8px ${DS.primary}30; }
                50% { box-shadow: 0 0 22px ${DS.primary}50; }
            }
            @keyframes stepPip {
                from { transform: scaleX(0); }
                to { transform: scaleX(1); }
            }
        `;

    const el = document.createElement("style");
    el.id = "token-mult-singularity-kf";
    el.textContent = keyframes;
    document.head.appendChild(el);
    return () => {
      const ex = document.getElementById("token-mult-singularity-kf");
      if (ex) document.head.removeChild(ex);
    };
  }, []);

  // ─── NAVIGATION ───
  const resetStepState = useCallback(() => {
    setGroupsPlaced(0);
    setIsAnimatingGroup(false);
    setBagGlowing(false);
    setShowResult(false);
    setIsPlaying(false);
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= filteredSteps.length) return;
      setContentOpacity(0);
      setContentTransform("translateY(-16px)");
      setTimeout(() => {
        resetStepState();
        setCurrentStepIndex(index);
        setContentOpacity(1);
        setContentTransform("translateY(0)");
      }, 280);
    },
    [filteredSteps.length, resetStepState],
  );

  const goNext = useCallback(() => {
    if (currentStepIndex < filteredSteps.length - 1)
      goToStep(currentStepIndex + 1);
  }, [currentStepIndex, filteredSteps.length, goToStep]);

  const goPrev = useCallback(() => {
    if (currentStepIndex > 0) goToStep(currentStepIndex - 1);
  }, [currentStepIndex, goToStep]);

  // ─── PLACE GROUP ───
  const placeNextGroup = useCallback(() => {
    if (
      isAnimatingGroup ||
      groupsPlaced >= currentMultiplier ||
      currentMultiplier === 0
    )
      return;
    setIsAnimatingGroup(true);
    setGroupsPlaced((prev) => prev + 1);
    setTimeout(() => {
      setIsAnimatingGroup(false);
      if (groupsPlaced + 1 >= currentMultiplier) {
        setBagGlowing(true);
        setTimeout(() => setShowResult(true), 550);
      }
    }, 550);
  }, [isAnimatingGroup, groupsPlaced, currentMultiplier]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    const phase = currentStep?.data?.phase;
    if (phase !== "pos_pos" && phase !== "pos_neg") return;
    if (groupsPlaced >= currentMultiplier) {
      setIsPlaying(false);
      return;
    }
    const t = setTimeout(placeNextGroup, 750);
    return () => clearTimeout(t);
  }, [isPlaying, groupsPlaced, currentMultiplier, placeNextGroup, currentStep]);

  // ─── RENDER TOKENS ───
  const renderTokensInBag = useCallback(() => {
    if (currentMultiplier === 0) return null;
    const tokens: React.ReactNode[] = [];
    const tSize = toolConfig.tokenSize;
    const cols = Math.min(absMultiplicand * currentMultiplier, 4);
    const startX = 130 - (cols * (tSize + 5)) / 2;

    for (let g = 0; g < groupsPlaced; g++) {
      for (let t = 0; t < absMultiplicand; t++) {
        const idx = g * absMultiplicand + t;
        const col = idx % 4;
        const row = Math.floor(idx / 4);
        tokens.push(
          <Token
            key={`${g}-${t}`}
            type={tokenType}
            size={tSize}
            x={startX + col * (tSize + 5)}
            y={55 + row * (tSize + 5)}
            delay={g === groupsPlaced - 1 ? t * 0.08 : 0}
            animated={g === groupsPlaced - 1}
          />,
        );
      }
    }
    return tokens;
  }, [
    groupsPlaced,
    absMultiplicand,
    currentMultiplier,
    tokenType,
    toolConfig.tokenSize,
  ]);

  // ═══════════════════════════════════════════════════════════════
  // STEP RENDERERS
  // ═══════════════════════════════════════════════════════════════

  const renderStepContent = () => {
    const phase = currentStep?.data?.phase;

    // ─── STEP 1: EMPTY BAG ───
    if (phase === "empty_bag") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            animation: "fadeInUp 0.5s ease-out",
          }}
        >
          <Bag
            width={190}
            height={170}
            glowing={false}
            tokensInside={0}
            tokenType="none"
            label="Empty Bag"
          />
          <div style={{ display: "flex", gap: 28, marginTop: 8 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                animation: "slideInLeft 0.45s ease-out 0.25s both",
              }}
            >
              <MiniToken type="positive" size={36} />
              <span
                style={{
                  fontWeight: 600,
                  color: DS.primary,
                  fontSize: 14,
                  fontFamily: DS.font,
                }}
              >
                = Positive
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                animation: "slideInRight 0.45s ease-out 0.4s both",
              }}
            >
              <MiniToken type="negative" size={36} />
              <span
                style={{
                  fontWeight: 600,
                  color: DS.accent,
                  fontSize: 14,
                  fontFamily: DS.font,
                }}
              >
                = Negative
              </span>
            </div>
          </div>
        </div>
      );
    }

    // ─── STEPS 2 & 3: TOKEN PLACEMENT ───
    if (phase === "pos_pos" || phase === "pos_neg") {
      const mult = currentMultiplier;
      const mcand = currentMultiplicand;
      const isNeg = mcand < 0;
      const expression = `${mult} × ${isNeg ? `(${mcand})` : mcand}`;
      const tColor = isNeg ? DS.accent : DS.primary;

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            width: "100%",
            animation: "fadeInUp 0.45s ease-out",
          }}
        >
          {/* Top bar: expression + group counter */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: 520,
              gap: 12,
            }}
          >
            {/* Expression pill */}
            <div
              style={{
                background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
                color: DS.white,
                padding: "6px 22px",
                borderRadius: DS.radius.pill,
                fontWeight: 700,
                fontSize: 20,
                fontFamily: DS.font,
                boxShadow: `0 4px 14px ${DS.gradientStart}30`,
                letterSpacing: "0.03em",
              }}
            >
              {expression}
            </div>
            {/* Group counter */}
            <div
              style={{
                background: isNeg ? DS.accentLight : DS.primaryLight,
                border: `2px solid ${isNeg ? `${DS.accent}40` : `${DS.primary}40`}`,
                padding: "6px 18px",
                borderRadius: DS.radius.pill,
                fontWeight: 600,
                fontSize: 13,
                color: tColor,
                fontFamily: DS.font,
              }}
            >
              Group {Math.min(groupsPlaced, mult)} of {mult}
            </div>
          </div>

          {/* Bag + Tokens area */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 24,
              position: "relative",
              minHeight: 210,
              width: "100%",
            }}
          >
            <div style={{ position: "relative" }}>
              <Bag
                width={175}
                height={165}
                glowing={bagGlowing}
                tokensInside={totalTokens}
                tokenType={totalTokens > 0 ? tokenType : "none"}
              />
            </div>
            <div style={{ position: "relative", width: 270, minHeight: 200 }}>
              {renderTokensInBag()}
            </div>
          </div>

          {/* Place button */}
          {groupsPlaced < mult && (
            <DSButton
              label={`Place Group ${groupsPlaced + 1}  (${absMultiplicand} ${isNeg ? "orange" : "purple"} tokens)`}
              onClick={placeNextGroup}
              variant="contained"
              color={isNeg ? "accent" : "primary"}
              disabled={isAnimatingGroup}
              icon={<Plus size={16} />}
              style={{
                animation: "float 2.5s ease-in-out infinite",
                height: 44,
                fontSize: 15,
                padding: "0 28px",
              }}
            />
          )}

          {/* Result badge */}
          {showResult && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 30px",
                borderRadius: DS.radius.pill,
                background: isNeg
                  ? `linear-gradient(135deg, ${DS.accentLight}, #FFE8D4)`
                  : `linear-gradient(135deg, ${DS.primaryLight}, #E0E0F7)`,
                border: `3px solid ${tColor}`,
                animation: "resultBounce 0.55s ease-out",
                boxShadow: `0 6px 24px ${tColor}30`,
              }}
            >
              <Sparkles size={22} color={tColor} />
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 26,
                  color: tColor,
                  fontFamily: DS.font,
                }}
              >
                = {product > 0 ? "+" : ""}
                {product}
              </span>
              <Sparkles size={22} color={tColor} />
            </div>
          )}
        </div>
      );
    }

    // ─── STEP 4: COMPARE ───
    if (phase === "compare") {
      const prodA = toolConfig.multiplierA * toolConfig.multiplicandA;
      const prodB = toolConfig.multiplierB * toolConfig.multiplicandB;

      const Card: React.FC<{
        mult: number;
        mcand: number;
        prod: number;
        type: "positive" | "negative";
        dir: string;
      }> = ({ mult, mcand, prod, type, dir }) => {
        const isPos = type === "positive";
        const clr = isPos ? DS.primary : DS.accent;
        const bg = isPos ? DS.primaryLight : DS.accentLight;
        return (
          <div
            style={{
              background: bg,
              border: `2.5px solid ${clr}`,
              borderRadius: DS.radius.xl,
              padding: "20px 26px",
              textAlign: "center",
              minWidth: 190,
              animation: `${dir} 0.5s ease-out 0.15s both`,
              boxShadow: `0 6px 20px ${clr}18`,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: clr,
                fontFamily: DS.font,
              }}
            >
              {mult} × {mcand < 0 ? `(${mcand})` : mcand}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                justifyContent: "center",
                margin: "14px 0",
              }}
            >
              {Array.from({ length: Math.abs(prod) }).map((_, i) => (
                <MiniToken key={i} type={type} size={22} delay={i * 0.04} />
              ))}
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: clr,
                fontFamily: DS.font,
              }}
            >
              = {prod > 0 ? "+" : ""}
              {prod}
            </div>
          </div>
        );
      };

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 28,
            flexWrap: "wrap",
            animation: "fadeInUp 0.5s ease-out",
          }}
        >
          <Card
            mult={toolConfig.multiplierA}
            mcand={toolConfig.multiplicandA}
            prod={prodA}
            type="positive"
            dir="slideInLeft"
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 22,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "popIn 0.5s ease-out 0.35s both",
              fontFamily: DS.font,
            }}
          >
            VS
          </div>
          <Card
            mult={toolConfig.multiplierB}
            mcand={toolConfig.multiplicandB}
            prod={prodB}
            type="negative"
            dir="slideInRight"
          />
        </div>
      );
    }

    // ─── STEP 5: SIGN RULE ───
    if (phase === "sign_rule") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            alignItems: "center",
            animation: "fadeInUp 0.5s ease-out",
            width: "100%",
            maxWidth: 540,
          }}
        >
          {/* Title banner */}
          <div
            style={{
              background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
              color: DS.white,
              padding: "10px 28px",
              borderRadius: DS.radius.pill,
              fontWeight: 700,
              fontSize: 17,
              fontFamily: DS.font,
              boxShadow: `0 4px 16px ${DS.gradientStart}30`,
              animation: "popIn 0.5s ease-out 0.1s both",
              textAlign: "center",
              letterSpacing: "0.02em",
            }}
          >
            ✨ Positive Multiplier → PLACE tokens
          </div>

          {/* Rule Row 1: Positive */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: DS.primaryLight,
              border: `2px solid ${DS.primary}50`,
              borderRadius: DS.radius.lg,
              padding: "14px 22px",
              width: "100%",
              animation: "slideInLeft 0.45s ease-out 0.25s both",
            }}
          >
            <MiniToken type="positive" size={42} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: DS.primary,
                  fontFamily: DS.font,
                }}
              >
                Positive × Positive = Positive
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: `${DS.primary}BB`,
                  marginTop: 2,
                  fontFamily: DS.font,
                }}
              >
                Place purple tokens → result is purple (+)
              </div>
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 20,
                color: DS.primary,
                animation: "pulse 2s ease-in-out infinite",
              }}
            >
              ✓
            </div>
          </div>

          {/* Rule Row 2: Negative */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: DS.accentLight,
              border: `2px solid ${DS.accent}50`,
              borderRadius: DS.radius.lg,
              padding: "14px 22px",
              width: "100%",
              animation: "slideInRight 0.45s ease-out 0.4s both",
            }}
          >
            <MiniToken type="negative" size={42} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: DS.accent,
                  fontFamily: DS.font,
                }}
              >
                Positive × Negative = Negative
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: `${DS.accent}BB`,
                  marginTop: 2,
                  fontFamily: DS.font,
                }}
              >
                Place orange tokens → result is orange (−)
              </div>
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 20,
                color: DS.accent,
                animation: "pulse 2s ease-in-out infinite 0.4s",
              }}
            >
              ✓
            </div>
          </div>

          {/* Challenge card */}
          <div
            style={{
              background: DS.bgLight,
              border: `2px dashed ${DS.gradientEnd}`,
              borderRadius: DS.radius.lg,
              padding: "14px 22px",
              width: "100%",
              animation: "fadeInUp 0.45s ease-out 0.65s both",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: DS.gradientStart,
                fontFamily: DS.font,
              }}
            >
              🧠 Challenge: Predict 9 × (−7) using the rule!
            </div>
            <div
              style={{
                fontSize: 12,
                color: DS.textDark,
                marginTop: 4,
                fontFamily: DS.font,
              }}
            >
              How many orange tokens? What's the result?
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // ═══════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════

  return (
    <div
      style={{
        width: "100%",
        maxWidth: config.width,
        minHeight: config.height,
        margin: "0 auto",
        background: DS.white,
        borderRadius: DS.radius.xl,
        overflow: "hidden",
        boxShadow:
          "0 16px 48px rgba(74, 77, 201, 0.08), 0 2px 8px rgba(0,0,0,0.04)",
        fontFamily: DS.font,
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${DS.borderLight}`,
      }}
    >
      {/* ═══ TOP BAR: gradient accent line ═══ */}
      <div
        style={{
          height: 4,
          background: `linear-gradient(90deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
          width: "100%",
        }}
      />

      {/* ═══ STEP INDICATOR ═══ */}
      {config.showStepIndicator && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            padding: "14px 20px 6px",
          }}
        >
          {filteredSteps.map((_, idx) => (
            <div
              key={idx}
              onClick={() => goToStep(idx)}
              style={{
                width: idx === currentStepIndex ? 44 : 32,
                height: 6,
                borderRadius: 3,
                background:
                  idx === currentStepIndex
                    ? `linear-gradient(90deg, ${DS.gradientStart}, ${DS.gradientEnd})`
                    : idx < currentStepIndex
                      ? DS.primary
                      : DS.borderLight,
                cursor: "pointer",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow:
                  idx === currentStepIndex
                    ? `0 2px 8px ${DS.primary}40`
                    : "none",
                transformOrigin: "left",
                animation:
                  idx === currentStepIndex ? "stepPip 0.3s ease-out" : "none",
              }}
            />
          ))}
          <span
            style={{
              marginLeft: 14,
              fontSize: 12,
              fontWeight: 600,
              color: DS.textDark,
              fontFamily: DS.font,
              opacity: 0.7,
            }}
          >
            Step {currentStepIndex + 1} / {filteredSteps.length}
          </span>
        </div>
      )}

      {/* ═══ TITLE + RESET ═══ */}
      <div
        style={{
          padding: "8px 24px 4px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: DS.textDark,
            fontFamily: DS.font,
            letterSpacing: "-0.01em",
          }}
        >
          {currentStep?.title}
        </h2>
        <DSButton
          label="Reset"
          onClick={resetStepState}
          variant="outlined"
          color="primary"
          icon={<RotateCcw size={14} />}
          style={{ height: 34, fontSize: 12, padding: "0 16px" }}
        />
      </div>

      {/* ═══ DESCRIPTION ═══ */}
      <div
        style={{
          padding: "0 24px 10px",
          fontSize: 14,
          color: DS.textDark,
          lineHeight: 1.65,
          fontWeight: 400,
          maxWidth: 600,
          opacity: contentOpacity,
          transform: contentTransform,
          transition: "opacity 0.28s ease, transform 0.28s ease",
          fontFamily: DS.font,
        }}
      >
        {currentStep?.description}
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div
        style={{
          flex: 1,
          padding: "4px 24px 14px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          minHeight: 310,
          opacity: contentOpacity,
          transform: contentTransform,
          transition: "opacity 0.28s ease, transform 0.28s ease",
        }}
      >
        {renderStepContent()}
      </div>

      {/* ═══ NAVIGATION BAR ═══ */}
      {config.showNavigation && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 14,
            padding: "10px 24px 18px",
            borderTop: `1px solid ${DS.borderLight}`,
            background: DS.bgLight,
          }}
        >
          <DSButton
            label="Previous"
            onClick={goPrev}
            variant="outlined"
            disabled={currentStepIndex === 0}
            icon={<ChevronLeft size={16} />}
          />

          {config.showPlayPause &&
            (currentStep?.data?.phase === "pos_pos" ||
              currentStep?.data?.phase === "pos_neg") && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  border: "none",
                  background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`,
                  color: DS.white,
                  cursor: "pointer",
                  boxShadow: `0 4px 16px ${DS.gradientStart}35`,
                  transition: "all 0.2s ease",
                }}
              >
                {isPlaying ? (
                  <Pause size={18} />
                ) : (
                  <Play size={18} style={{ marginLeft: 2 }} />
                )}
              </button>
            )}

          <DSButton
            label="Next"
            onClick={goNext}
            variant="contained"
            disabled={currentStepIndex === filteredSteps.length - 1}
            icon={<ChevronRight size={16} />}
            style={{ flexDirection: "row-reverse" }}
          />
        </div>
      )}
    </div>
  );
};

export default TokenMultiplicationTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
