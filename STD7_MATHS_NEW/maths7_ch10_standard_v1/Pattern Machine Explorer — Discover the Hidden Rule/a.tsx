// @ts-expect-error - React types resolved at build/runtime (e.g. parent package or bundler)
import React, { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

interface MachineRow {
  a: number;
  b: number;
  c: number;
  output: number | null;
}

interface StepConfig {
  id: number;
  title: string;
  description: string;
  rowsToShow: number;
  showHypothesisInput: boolean;
  showRuleCard: boolean;
  showPredictionInput: boolean;
  showMachine2Preview: boolean;
  teachingNote: string;
}

interface AdditionalProps {
  machine1Rows?: MachineRow[];
  machine2Rows?: MachineRow[];
  ruleFormula?: string;
  machine2RuleFormula?: string;
  machineName?: string;
  machine2Name?: string;
}

interface PatternMachineExplorerProps {
  props?: {
    width?: number;
    height?: number;
    initialStep?: number;
    animationSpeed?: number;
    autoPlayDuration?: number;
    themeColor?: string;
    darkMode?: boolean;
    showNavigation?: boolean;
    showStepIndicator?: boolean;
    additionalProps?: AdditionalProps;
  };
  setStepDetails?: (stepDetails: any) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stop: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGULARITY DESIGN TOKENS (from Singularity_tool_Design_1.pdf)
// ═══════════════════════════════════════════════════════════════════════════

const DS = {
  // Primary palette
  indigo: "#4A4DC9",
  orange: "#FF7212",
  // Gradient anchors
  deepPurple: "#533086",
  warmOrange: "#FC9145",
  // Light variants
  lightPurple: "#C1C1EA",
  lightPeach: "#FFF3E4",
  // Neutrals
  dark: "#4E4E4E",
  grey: "#CACACA",
  lightGrey: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  // Derived states
  indigoHover: "#3B3EB5",
  indigoPressed: "#33369E",
  orangeHover: "#E5660F",
  successGreen: "#2ECC71",
  errorRed: "#E74C3C",
  // Gradients
  gradientPrimary: "linear-gradient(135deg, #533086 0%, #FC9145 100%)",
  gradientSubtle: "linear-gradient(135deg, #C1C1EA 0%, #FFF3E4 100%)",
  gradientMachine:
    "linear-gradient(135deg, #4A4DC9 0%, #533086 40%, #FC9145 100%)",
  // Spacing (from PDF button spec: 24px padding, 40px height)
  spacingXs: 4,
  spacingSm: 8,
  spacingMd: 16,
  spacingLg: 24,
  spacingXl: 32,
  spacing2xl: 40,
  spacing3xl: 48,
  // Border radius (from PDF: pill buttons = full radius, cards = rounded)
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 20,
  radiusXl: 28,
  radiusFull: 9999,
  // Font (from PDF: Poppins in regular, bold, and display variants)
  font: '"Poppins", sans-serif',
};

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_MACHINE1_ROWS: MachineRow[] = [
  { a: 5, b: 8, c: 3, output: 10 },
  { a: 10, b: 11, c: 12, output: 9 },
  { a: 5, b: 8, c: -3, output: 16 },
  { a: -3, b: 10, c: 2, output: 5 },
  { a: -4, b: -1, c: -6, output: 1 },
  { a: -10, b: -12, c: -9, output: null },
];

const DEFAULT_MACHINE2_ROWS: MachineRow[] = [
  { a: 4, b: 8, c: -3, output: -29 },
  { a: 6, b: -11, c: 12, output: 54 },
  { a: 5, b: 3, c: 7, output: -22 },
  { a: -3, b: 9, c: -8, output: 35 },
  { a: -7, b: 4, c: 6, output: -17 },
  { a: -10, b: -12, c: -9, output: null },
];

const STEP_CONFIGS: StepConfig[] = [
  {
    id: 1,
    title: "Row 1 — First Clue",
    description:
      "The machine takes three numbers and produces one output. What operation turns (5, 8, 3) into 10?",
    rowsToShow: 1,
    showHypothesisInput: false,
    showRuleCard: false,
    showPredictionInput: false,
    showMachine2Preview: false,
    teachingNote:
      "Most students guess addition — 5+8=13≠10. What if we subtract?",
  },
  {
    id: 2,
    title: "Row 2 — Testing Ideas",
    description:
      "A new row appears! Does your hypothesis still work with (10, 11, 12) → 9?",
    rowsToShow: 2,
    showHypothesisInput: true,
    showRuleCard: false,
    showPredictionInput: false,
    showMachine2Preview: false,
    teachingNote: "10+11−12=9 works! And 5+8−3=10 also works.",
  },
  {
    id: 3,
    title: "Row 3 — Negative Input!",
    description:
      "The third input is now −3! Subtracting a negative means adding its positive — the additive inverse.",
    rowsToShow: 3,
    showHypothesisInput: true,
    showRuleCard: false,
    showPredictionInput: false,
    showMachine2Preview: false,
    teachingNote: "KEY: 5+8−(−3) = 5+8+3 = 16. Additive inverse connection!",
  },
  {
    id: 4,
    title: "Row 4 — Mixed Signs",
    description: "First number is negative too. Does a + b − c still hold?",
    rowsToShow: 4,
    showHypothesisInput: true,
    showRuleCard: false,
    showPredictionInput: false,
    showMachine2Preview: false,
    teachingNote: "(−3)+10−2=5. Works with any integer combination.",
  },
  {
    id: 5,
    title: "Row 5 — Rule Confirmed!",
    description: "All five rows follow the same rule. The mystery is solved!",
    rowsToShow: 5,
    showHypothesisInput: false,
    showRuleCard: true,
    showPredictionInput: false,
    showMachine2Preview: false,
    teachingNote: "(−4)+(−1)−(−6)=−4−1+6=1. Rule fully confirmed.",
  },
  {
    id: 6,
    title: "Your Turn — Predict!",
    description:
      "Use the rule a + b − c to predict the output for Row 6. Then peek at Machine 2!",
    rowsToShow: 6,
    showHypothesisInput: false,
    showRuleCard: true,
    showPredictionInput: true,
    showMachine2Preview: true,
    teachingNote: "(−10)+(−12)−(−9) = −13. Then preview Machine 2.",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

type ResolvedProps = NonNullable<PatternMachineExplorerProps["props"]>;

const PatternMachineExplorer: React.FC<PatternMachineExplorerProps> = ({
  props: propsIn = {},
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const resolvedProps = propsIn as ResolvedProps;
  const {
    width = 800,
    height = 700,
    initialStep = 1,
    animationSpeed = 1,
    showNavigation = true,
    showStepIndicator = true,
    additionalProps = {},
  } = resolvedProps;

  const machine1Rows = additionalProps.machine1Rows || DEFAULT_MACHINE1_ROWS;
  const machine2Rows = additionalProps.machine2Rows || DEFAULT_MACHINE2_ROWS;
  const ruleFormula = additionalProps.ruleFormula || "a + b − c";

  const [currentStep, setCurrentStep] = useState(
    Math.max(1, Math.min(initialStep, 6)),
  );
  const [hypothesis, setHypothesis] = useState("");
  const [prediction, setPrediction] = useState("");
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);
  const [predictionCorrect, setPredictionCorrect] = useState<boolean | null>(
    null,
  );
  const [animatingRow, setAnimatingRow] = useState<number | null>(null);
  const [ruleCardVisible, setRuleCardVisible] = useState(false);
  const [machine2Visible, setMachine2Visible] = useState(false);
  const [gearRotation, setGearRotation] = useState(0);
  const [particleKey, setParticleKey] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);

  // ─── INJECT KEYFRAMES & POPPINS ───
  useEffect(() => {
    const id = "singularity-pm-keyframes-v2";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

      @keyframes sgSlideUp {
        from { transform: translateY(24px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes sgHighlightRow {
        0% { background-color: #FFF3E4; }
        50% { background-color: #FFE0C0; }
        100% { background-color: #FFF3E4; }
      }
      @keyframes sgRevealRule {
        0% { transform: translateY(30px) scale(0.92); opacity: 0; }
        60% { transform: translateY(-4px) scale(1.02); }
        100% { transform: translateY(0) scale(1); opacity: 1; }
      }
      @keyframes sgBounce {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes sgShimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes sgParticle {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-60px) rotate(240deg); opacity: 0; }
      }
      @keyframes sgConfetti {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(120px) rotate(540deg); opacity: 0; }
      }
      @keyframes sgPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.15) rotate(180deg); }
      }
      @keyframes sgFadeIn {
        from { transform: translateY(10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes sgGlow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(74, 77, 201, 0.25); }
        50% { box-shadow: 0 0 0 8px rgba(74, 77, 201, 0); }
      }
      @keyframes sgFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  // ─── GEAR ROTATION ───
  useEffect(() => {
    let frame: number;
    const spin = () => {
      setGearRotation((p) => p + 0.35);
      frame = requestAnimationFrame(spin);
    };
    frame = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(frame);
  }, []);

  // ─── STEP CHANGE ───
  useEffect(() => {
    const sc = STEP_CONFIGS[currentStep - 1];
    setAnimatingRow(sc.rowsToShow);
    setParticleKey((p) => p + 1);
    const t1 = setTimeout(() => setAnimatingRow(null), 900 / animationSpeed);

    if (sc.showRuleCard) {
      setTimeout(() => setRuleCardVisible(true), 450 / animationSpeed);
    } else {
      setRuleCardVisible(false);
    }

    if (sc.showMachine2Preview) {
      setTimeout(() => setMachine2Visible(true), 900 / animationSpeed);
    } else {
      setMachine2Visible(false);
    }

    if (setStepDetails) {
      setStepDetails({ currentStep, totalSteps: 6, title: sc.title });
    }
    return () => clearTimeout(t1);
  }, [currentStep, animationSpeed]);

  const goNext = useCallback(() => {
    if (currentStep < 6) setCurrentStep((p) => p + 1);
  }, [currentStep]);

  const goPrev = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((p) => p - 1);
      setPredictionSubmitted(false);
      setPredictionCorrect(null);
      setPrediction("");
    }
  }, [currentStep]);

  const handlePredictionSubmit = () => {
    const correctAnswer =
      machine1Rows[5].a + machine1Rows[5].b - machine1Rows[5].c;
    const isCorrect = parseInt(prediction, 10) === correctAnswer;
    setPredictionCorrect(isCorrect);
    setPredictionSubmitted(true);
    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const stepConfig = STEP_CONFIGS[currentStep - 1];
  const isMobile = width < 520;

  // ═══════════════════════════════════════════════════════════════════════
  // SINGULARITY BUTTON
  // Pill-shaped per PDF: 40px height, 24px horizontal padding, full radius
  // Variants: contained (indigo fill), outlined (indigo border), text, highlight (orange fill)
  // States: enabled, disabled, hover, pressed — all per PDF spec
  // ═══════════════════════════════════════════════════════════════════════

  const SgButton = ({
    label,
    onClick,
    disabled = false,
    variant = "contained",
    icon,
    size = "md",
  }: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: "contained" | "outlined" | "text" | "highlight";
    icon?: string;
    size?: "sm" | "md";
  }) => {
    const btnId = `${label}-${variant}`;
    const isHovered = hoveredBtn === btnId && !disabled;
    const isPressed = pressedBtn === btnId && !disabled;

    const h = size === "sm" ? 34 : DS.spacing2xl;
    const pad = size === "sm" ? "0 16px" : `0 ${DS.spacingLg}px`;

    let bg: string, color: string, border: string, shadow: string;

    switch (variant) {
      case "contained":
        bg = disabled
          ? DS.lightGrey
          : isPressed
            ? DS.indigoPressed
            : isHovered
              ? DS.indigoHover
              : DS.indigo;
        color = disabled ? DS.grey : DS.white;
        border = "none";
        shadow = disabled
          ? "none"
          : isHovered
            ? "0 4px 16px rgba(74,77,201,0.35)"
            : "0 2px 8px rgba(74,77,201,0.18)";
        break;
      case "outlined":
        bg = isPressed
          ? `${DS.indigo}14`
          : isHovered
            ? `${DS.indigo}0A`
            : "transparent";
        color = disabled ? DS.grey : DS.indigo;
        border = `1.5px solid ${disabled ? DS.lightGrey : isPressed ? DS.indigoPressed : DS.indigo}`;
        shadow = "none";
        break;
      case "text":
        bg = isPressed
          ? `${DS.indigo}12`
          : isHovered
            ? `${DS.indigo}08`
            : "transparent";
        color = disabled ? DS.grey : DS.indigo;
        border = "none";
        shadow = "none";
        break;
      case "highlight":
        bg = disabled
          ? DS.lightGrey
          : isPressed
            ? DS.orangeHover
            : isHovered
              ? "#FF8533"
              : DS.orange;
        color = DS.white;
        border = "none";
        shadow = disabled
          ? "none"
          : isHovered
            ? "0 4px 16px rgba(255,114,18,0.4)"
            : "0 2px 8px rgba(255,114,18,0.18)";
        break;
      default:
        bg = DS.indigo;
        color = DS.white;
        border = "none";
        shadow = "none";
    }

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setHoveredBtn(btnId)}
        onMouseLeave={() => {
          setHoveredBtn(null);
          setPressedBtn(null);
        }}
        onMouseDown={() => setPressedBtn(btnId)}
        onMouseUp={() => setPressedBtn(null)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: DS.spacingXs,
          height: h,
          padding: pad,
          borderRadius: DS.radiusFull,
          border,
          background: bg,
          color,
          fontFamily: DS.font,
          fontWeight: 600,
          fontSize: size === "sm" ? 13 : 14,
          cursor: disabled ? "not-allowed" : "pointer",
          boxShadow: shadow,
          transition: "all 0.2s ease",
          outline: "none",
          letterSpacing: "0.2px",
          whiteSpace: "nowrap" as const,
          transform: isPressed && !disabled ? "scale(0.97)" : "scale(1)",
        }}
      >
        {icon && <span style={{ fontSize: 16, lineHeight: 1 }}>{icon}</span>}
        {label}
      </button>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════
  // GEOMETRIC SHAPES (from PDF: circle, triangle, square, ellipse rows)
  // Available in outline and filled variants, per PDF's 3 shape rows
  // ═══════════════════════════════════════════════════════════════════════

  const GeoShapes = ({
    variant = "outline",
    color,
  }: {
    variant?: "outline" | "filled";
    color?: string;
  }) => {
    const c = color || DS.indigo;
    const stroke = variant === "outline" ? c : "none";
    const fill = variant === "filled" ? color || DS.lightPurple : "none";
    const sw = variant === "outline" ? 1.5 : 0;
    return (
      <svg
        width="120"
        height="28"
        viewBox="0 0 160 36"
        style={{ opacity: 0.25 }}
      >
        <circle
          cx="18"
          cy="18"
          r="13"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
        />
        <polygon
          points="58,5 71,31 45,31"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
        <rect
          x="84"
          y="5"
          width="26"
          height="26"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
        />
        <ellipse
          cx="140"
          cy="18"
          rx="16"
          ry="13"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
        />
      </svg>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════
  // GEAR SVG
  // ═══════════════════════════════════════════════════════════════════════

  const GearSvg = ({
    size,
    color,
    rotation,
  }: {
    size: number;
    color: string;
    rotation: number;
  }) => (
    <div
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotation}deg)`,
        transition: "none",
      }}
    >
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <circle
          cx="20"
          cy="20"
          r="11"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          opacity="0.5"
        />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <rect
            key={a}
            x="17.5"
            y="3"
            width="5"
            height="6"
            rx="2"
            fill={color}
            opacity="0.7"
            transform={`rotate(${a} 20 20)`}
          />
        ))}
        <circle cx="20" cy="20" r="3.5" fill={color} />
      </svg>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════
  // STEP INDICATOR — Pill-shaped steps following PDF's gradient+indigo palette
  // ═══════════════════════════════════════════════════════════════════════

  const renderStepIndicator = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: isMobile ? 4 : 6,
        marginBottom: DS.spacingLg,
      }}
    >
      {STEP_CONFIGS.map((s, i) => {
        const isActive = currentStep === s.id;
        const isDone = i < currentStep - 1;
        return (
          <React.Fragment key={s.id}>
            <div
              onClick={() => {
                setCurrentStep(s.id);
                setPredictionSubmitted(false);
                setPredictionCorrect(null);
                setPrediction("");
              }}
              style={{
                width: isActive ? 36 : 28,
                height: isActive ? 36 : 28,
                borderRadius: DS.radiusFull,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isActive ? 13 : 11,
                fontWeight: 700,
                fontFamily: DS.font,
                color: isDone || isActive ? DS.white : DS.dark,
                background: isDone
                  ? DS.indigo
                  : isActive
                    ? DS.gradientPrimary
                    : DS.offWhite,
                border:
                  isDone || isActive ? "none" : `2px solid ${DS.lightGrey}`,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: isActive ? "0 3px 12px rgba(83,48,134,0.3)" : "none",
                animation: isActive ? "sgGlow 2s ease-in-out infinite" : "none",
              }}
            >
              {isDone ? "✓" : s.id}
            </div>
            {i < 5 && (
              <div
                style={{
                  width: isMobile ? 8 : 18,
                  height: 2,
                  borderRadius: 1,
                  background: i < currentStep - 1 ? DS.indigo : DS.lightGrey,
                  transition: "background 0.4s",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════
  // DESCRIPTION CARD — Rounded container with lightPurple accent border
  // ═══════════════════════════════════════════════════════════════════════

  const renderDescription = () => (
    <div
      style={{
        maxWidth: 540,
        margin: `0 auto ${DS.spacingMd}px`,
        padding: `${DS.spacingMd}px ${DS.spacingLg}px`,
        borderRadius: DS.radiusLg,
        background: DS.white,
        borderLeft: `4px solid ${DS.indigo}`,
        boxShadow: "0 2px 12px rgba(74,77,201,0.06)",
      }}
    >
      <div
        style={{
          fontFamily: DS.font,
          fontWeight: 700,
          fontSize: isMobile ? 15 : 17,
          color: DS.indigo,
          marginBottom: 4,
        }}
      >
        {stepConfig.title}
      </div>
      <div
        style={{
          fontFamily: DS.font,
          fontWeight: 400,
          fontSize: isMobile ? 13 : 14,
          color: DS.dark,
          lineHeight: 1.65,
          opacity: 0.85,
        }}
      >
        {stepConfig.description}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════
  // MACHINE GRAPHIC — Gradient body (indigo→deepPurple→warmOrange from PDF)
  // ═══════════════════════════════════════════════════════════════════════

  const renderMachine = () => (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 520,
        margin: `0 auto ${DS.spacingLg}px`,
        height: isMobile ? 120 : 140,
      }}
    >
      {/* Machine body with PDF gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: DS.radiusXl,
          overflow: "hidden",
          background: DS.gradientMachine,
          boxShadow:
            "0 10px 36px rgba(83,48,134,0.22), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        {/* Subtle dot pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        {/* Top accent line — warmOrange from PDF */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${DS.warmOrange}, ${DS.lightPeach}, ${DS.warmOrange})`,
          }}
        />
        {/* Bottom accent line — lightPurple from PDF */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${DS.lightPurple}, ${DS.indigo}, ${DS.lightPurple})`,
          }}
        />
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? 12 : 16,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: DS.font,
          fontWeight: 800,
          fontSize: isMobile ? 16 : 20,
          color: DS.white,
          letterSpacing: "3px",
          textTransform: "uppercase" as const,
          textShadow: "0 2px 6px rgba(0,0,0,0.2)",
          zIndex: 2,
          whiteSpace: "nowrap" as const,
        }}
      >
        Machine 1
      </div>

      {/* Left gear */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: isMobile ? 10 : 20,
          transform: "translateY(-50%)",
          zIndex: 2,
        }}
      >
        <GearSvg
          size={isMobile ? 28 : 36}
          color={DS.lightPeach}
          rotation={gearRotation}
        />
      </div>

      {/* Right gear */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          right: isMobile ? 10 : 20,
          transform: "translateY(-50%)",
          zIndex: 2,
        }}
      >
        <GearSvg
          size={isMobile ? 24 : 32}
          color={DS.lightPurple}
          rotation={-gearRotation * 0.7}
        />
      </div>

      {/* Input slot */}
      <div
        style={{
          position: "absolute",
          left: isMobile ? 48 : 78,
          top: "56%",
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(4px)",
          borderRadius: DS.radiusSm,
          padding: `${DS.spacingSm}px ${DS.spacingMd}px`,
          border: "1.5px dashed rgba(255,255,255,0.3)",
          zIndex: 2,
          fontFamily: DS.font,
          fontWeight: 600,
          fontSize: isMobile ? 10 : 12,
          color: DS.white,
        }}
      >
        IN: a, b, c
      </div>

      {/* Arrow */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          fontFamily: DS.font,
          fontSize: isMobile ? 20 : 24,
          color: DS.lightPeach,
          zIndex: 2,
          animation: "sgFloat 2.5s ease-in-out infinite",
          fontWeight: 700,
        }}
      >
        ⟶
      </div>

      {/* Output slot */}
      <div
        style={{
          position: "absolute",
          right: isMobile ? 48 : 78,
          top: "56%",
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(4px)",
          borderRadius: DS.radiusSm,
          padding: `${DS.spacingSm}px ${DS.spacingMd}px`,
          border: `1.5px solid ${DS.warmOrange}66`,
          zIndex: 2,
          fontFamily: DS.font,
          fontWeight: 700,
          fontSize: isMobile ? 10 : 12,
          color: DS.warmOrange,
        }}
      >
        OUT
      </div>

      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`${particleKey}-${i}`}
          style={{
            position: "absolute",
            top: "62%",
            left: `${20 + i * 11}%`,
            width: 4,
            height: 4,
            borderRadius: i % 2 === 0 ? "50%" : "1px",
            background: [
              DS.lightPurple,
              DS.warmOrange,
              DS.lightPeach,
              DS.indigo,
            ][i % 4],
            animation: `sgParticle ${0.5 + i * 0.08}s ease-out forwards`,
            animationDelay: `${i * 0.04}s`,
            opacity: 0,
            zIndex: 3,
          }}
        />
      ))}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════
  // DATA TABLE — Clean indigo header, alternating offWhite/white rows
  // ═══════════════════════════════════════════════════════════════════════

  const renderTable = () => {
    const rows = machine1Rows.slice(0, stepConfig.rowsToShow);
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 540,
          margin: "0 auto",
          borderRadius: DS.radiusLg,
          overflow: "hidden",
          boxShadow: "0 2px 16px rgba(74,77,201,0.06)",
          border: `1px solid ${DS.lightPurple}44`,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1.4fr",
            background: DS.indigo,
            padding: "12px 0",
          }}
        >
          {["First (a)", "Second (b)", "Third (c)", "Output"].map((h, i) => (
            <div
              key={h}
              style={{
                textAlign: "center",
                fontFamily: DS.font,
                fontWeight: 600,
                fontSize: isMobile ? 11 : 13,
                letterSpacing: "0.3px",
                color: i === 3 ? DS.warmOrange : "rgba(255,255,255,0.85)",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.map((row, idx) => {
          const isNew = idx === stepConfig.rowsToShow - 1;
          const isHL = animatingRow === idx + 1;
          const isPred = idx === 5 && stepConfig.showPredictionInput;

          return (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1.4fr",
                padding: "11px 0",
                background: isHL
                  ? DS.lightPeach
                  : idx % 2 === 0
                    ? DS.white
                    : DS.offWhite,
                animation: isNew
                  ? `sgSlideUp 0.3s ease-out${isHL ? ", sgHighlightRow 1.4s ease-in-out" : ""}`
                  : isHL
                    ? "sgHighlightRow 1.4s ease-in-out"
                    : "none",
                transition: "background 0.3s",
                borderBottom: `1px solid ${DS.lightGrey}`,
              }}
            >
              {[row.a, row.b, row.c].map((val, ci) => (
                <div
                  key={ci}
                  style={{
                    textAlign: "center",
                    fontFamily: DS.font,
                    fontWeight: 600,
                    fontSize: isMobile ? 15 : 17,
                    color: val < 0 ? DS.deepPurple : DS.dark,
                  }}
                >
                  {val}
                </div>
              ))}

              <div
                style={{
                  textAlign: "center",
                  fontFamily: DS.font,
                  fontWeight: 700,
                  fontSize: isMobile ? 15 : 17,
                }}
              >
                {isPred ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    {!predictionSubmitted ? (
                      <>
                        <input
                          type="number"
                          value={prediction}
                          onChange={(e) => setPrediction(e.target.value)}
                          placeholder="?"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && prediction)
                              handlePredictionSubmit();
                          }}
                          style={{
                            width: 52,
                            height: 34,
                            borderRadius: DS.radiusSm,
                            border: `2px solid ${DS.indigo}`,
                            textAlign: "center",
                            fontFamily: DS.font,
                            fontWeight: 700,
                            fontSize: 15,
                            color: DS.dark,
                            outline: "none",
                            background: DS.lightPeach,
                            transition: "border-color 0.2s, box-shadow 0.2s",
                          }}
                          onFocus={(e) => {
                            (e.target as HTMLInputElement).style.borderColor =
                              DS.deepPurple;
                            (e.target as HTMLInputElement).style.boxShadow =
                              `0 0 0 3px ${DS.deepPurple}18`;
                          }}
                          onBlur={(e) => {
                            (e.target as HTMLInputElement).style.borderColor =
                              DS.indigo;
                            (e.target as HTMLInputElement).style.boxShadow =
                              "none";
                          }}
                        />
                        <SgButton
                          label="Check"
                          onClick={handlePredictionSubmit}
                          disabled={!prediction}
                          variant="contained"
                          size="sm"
                        />
                      </>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          animation: "sgBounce 0.4s ease-out",
                        }}
                      >
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: DS.radiusFull,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            background: predictionCorrect
                              ? DS.successGreen
                              : DS.errorRed,
                            color: DS.white,
                          }}
                        >
                          {predictionCorrect ? "✓" : "✗"}
                        </span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: predictionCorrect
                              ? DS.successGreen
                              : DS.errorRed,
                          }}
                        >
                          {predictionCorrect
                            ? prediction
                            : `${prediction} → ${machine1Rows[5].a + machine1Rows[5].b - machine1Rows[5].c}`}
                        </span>
                      </div>
                    )}
                  </div>
                ) : row.output !== null ? (
                  <span
                    style={{
                      color: DS.orange,
                      display: "inline-block",
                      animation: isNew
                        ? "sgBounce 0.5s ease-out 0.15s both"
                        : "none",
                    }}
                  >
                    {row.output}
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: 18,
                      color: DS.deepPurple,
                      display: "inline-block",
                      animation: "sgPulse 1.2s ease-in-out infinite",
                    }}
                  >
                    ★ ?
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════
  // HYPOTHESIS INPUT
  // ═══════════════════════════════════════════════════════════════════════

  const renderHypothesisInput = () => {
    if (!stepConfig.showHypothesisInput) return null;
    return (
      <div
        style={{
          maxWidth: 540,
          margin: `${DS.spacingMd}px auto 0`,
          animation: "sgFadeIn 0.35s ease-out",
        }}
      >
        <label
          style={{
            display: "block",
            fontFamily: DS.font,
            fontWeight: 600,
            fontSize: 11,
            color: DS.deepPurple,
            marginBottom: 6,
            letterSpacing: "1px",
            textTransform: "uppercase" as const,
          }}
        >
          💡 Your Rule Hypothesis
        </label>
        <input
          type="text"
          value={hypothesis}
          onChange={(e) => setHypothesis(e.target.value)}
          placeholder="e.g. first + second − third"
          style={{
            width: "100%",
            padding: "10px 16px",
            borderRadius: DS.radiusMd,
            border: `1.5px solid ${DS.lightPurple}`,
            fontFamily: DS.font,
            fontSize: 14,
            fontWeight: 500,
            color: DS.dark,
            background: DS.offWhite,
            outline: "none",
            boxSizing: "border-box" as const,
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = DS.indigo;
            (e.target as HTMLInputElement).style.boxShadow =
              `0 0 0 3px ${DS.indigo}12`;
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = DS.lightPurple;
            (e.target as HTMLInputElement).style.boxShadow = "none";
          }}
        />
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════
  // RULE CARD — Uses gradientSubtle (lightPurple→lightPeach from PDF)
  // ═══════════════════════════════════════════════════════════════════════

  const renderRuleCard = () => {
    if (!ruleCardVisible) return null;
    return (
      <div
        style={{
          maxWidth: 400,
          margin: `${DS.spacingLg}px auto 0`,
          padding: `${DS.spacingLg}px ${DS.spacingXl}px`,
          borderRadius: DS.radiusXl,
          background: DS.gradientSubtle,
          border: `2px solid ${DS.lightPurple}`,
          textAlign: "center",
          animation: "sgRevealRule 0.5s ease-out",
          boxShadow: "0 6px 28px rgba(83,48,134,0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Shimmer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            backgroundSize: "200% 100%",
            animation: "sgShimmer 3.5s ease-in-out infinite",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontFamily: DS.font,
              fontWeight: 600,
              fontSize: 10,
              color: DS.deepPurple,
              textTransform: "uppercase" as const,
              letterSpacing: "2.5px",
              marginBottom: DS.spacingSm,
              opacity: 0.6,
            }}
          >
            ✦ Rule Discovered ✦
          </div>
          <div
            style={{
              fontFamily: DS.font,
              fontWeight: 800,
              fontSize: isMobile ? 28 : 38,
              color: DS.indigo,
              letterSpacing: "2px",
              lineHeight: 1,
            }}
          >
            {ruleFormula}
          </div>
          <div
            style={{
              fontFamily: DS.font,
              fontWeight: 400,
              fontSize: 13,
              color: DS.dark,
              marginTop: DS.spacingSm,
              opacity: 0.55,
            }}
          >
            First + Second − Third = Output
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════
  // MACHINE 2 PREVIEW — Dark theme variant
  // ═══════════════════════════════════════════════════════════════════════

  const renderMachine2Preview = () => {
    if (!machine2Visible) return null;
    return (
      <div
        style={{
          maxWidth: 540,
          margin: `${DS.spacingLg}px auto 0`,
          padding: DS.spacingLg,
          borderRadius: DS.radiusXl,
          background: "linear-gradient(135deg, #1a1545 0%, #2d1b69 100%)",
          border: `1.5px solid ${DS.deepPurple}55`,
          animation: "sgRevealRule 0.5s ease-out 0.2s both",
          boxShadow: "0 6px 28px rgba(83,48,134,0.18)",
        }}
      >
        <div
          style={{
            fontFamily: DS.font,
            fontWeight: 700,
            fontSize: 14,
            color: DS.warmOrange,
            textAlign: "center",
            marginBottom: DS.spacingMd,
            letterSpacing: "2px",
            textTransform: "uppercase" as const,
          }}
        >
          🔮 Machine 2 — What's its rule?
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1.3fr",
            gap: 1,
            borderRadius: DS.radiusSm,
            overflow: "hidden",
          }}
        >
          {["a", "b", "c", "Output"].map((h, i) => (
            <div
              key={h}
              style={{
                textAlign: "center",
                padding: "7px 4px",
                fontFamily: DS.font,
                fontWeight: 600,
                fontSize: 11,
                color: i === 3 ? DS.warmOrange : "rgba(255,255,255,0.45)",
                background: "rgba(0,0,0,0.3)",
                letterSpacing: "0.5px",
              }}
            >
              {h}
            </div>
          ))}
          {machine2Rows.slice(0, 3).map((row, idx) => (
            <React.Fragment key={idx}>
              {[row.a, row.b, row.c].map((val, ci) => (
                <div
                  key={ci}
                  style={{
                    textAlign: "center",
                    padding: "6px 4px",
                    fontFamily: DS.font,
                    fontWeight: 600,
                    fontSize: 14,
                    color: val < 0 ? DS.lightPurple : "rgba(255,255,255,0.8)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  {val}
                </div>
              ))}
              <div
                style={{
                  textAlign: "center",
                  padding: "6px 4px",
                  fontFamily: DS.font,
                  fontWeight: 700,
                  fontSize: 14,
                  color: DS.warmOrange,
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                {row.output}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            fontFamily: DS.font,
            fontWeight: 400,
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            marginTop: DS.spacingMd,
            fontStyle: "italic",
          }}
        >
          Hint: This machine uses multiplication! Can you figure it out?
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════
  // NAVIGATION — Outlined "Previous" + Highlight "Next" per PDF button variants
  // ═══════════════════════════════════════════════════════════════════════

  const renderNavigation = () => {
    if (!showNavigation) return null;
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: DS.spacingMd,
          marginTop: DS.spacingLg,
        }}
      >
        <SgButton
          label="← Previous"
          onClick={goPrev}
          disabled={currentStep === 1}
          variant="outlined"
        />
        <SgButton
          label="Next →"
          onClick={goNext}
          disabled={currentStep === 6}
          variant="highlight"
        />
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════
  // CONFETTI
  // ═══════════════════════════════════════════════════════════════════════

  const renderConfetti = () => {
    if (!showConfetti) return null;
    const colors = [
      DS.indigo,
      DS.orange,
      DS.deepPurple,
      DS.warmOrange,
      DS.lightPurple,
    ];
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 100,
        }}
      >
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: -10,
              left: `${Math.random() * 100}%`,
              width: 4 + Math.random() * 6,
              height: 4 + Math.random() * 6,
              borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "0",
              background: colors[i % 5],
              animation: `sgConfetti ${1.2 + Math.random() * 1.8}s ease-out forwards`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <div
      style={{
        width: "100%",
        maxWidth: width,
        minHeight: height,
        margin: "0 auto",
        padding: isMobile
          ? DS.spacingMd
          : `${DS.spacingXl}px ${DS.spacingLg}px`,
        fontFamily: DS.font,
        background: DS.white,
        borderRadius: DS.radiusXl,
        boxSizing: "border-box" as const,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background dot pattern — dual-tone from PDF palette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.02,
          backgroundImage: `
          radial-gradient(circle at 15% 15%, ${DS.indigo} 1px, transparent 1px),
          radial-gradient(circle at 85% 85%, ${DS.orange} 1px, transparent 1px)
        `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top-left: outline geometric shapes from PDF */}
      <div
        style={{
          position: "absolute",
          top: DS.spacingMd,
          left: DS.spacingMd,
          pointerEvents: "none",
        }}
      >
        <GeoShapes variant="outline" color={DS.indigo} />
      </div>
      {/* Bottom-right: filled geometric shapes from PDF */}
      <div
        style={{
          position: "absolute",
          bottom: DS.spacingMd,
          right: DS.spacingMd,
          pointerEvents: "none",
          transform: "scaleX(-1)",
        }}
      >
        <GeoShapes variant="filled" color={DS.lightPurple} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* TITLE — Uses PDF color tokens: indigo, dark, gradient */}
        <div style={{ textAlign: "center", marginBottom: DS.spacingLg }}>
          <h1
            style={{
              fontFamily: DS.font,
              fontWeight: 800,
              fontSize: isMobile ? 24 : 30,
              margin: 0,
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
            }}
          >
            <span style={{ color: DS.indigo }}>Pick</span>{" "}
            <span style={{ color: DS.dark }}>the</span>{" "}
            <span
              style={{
                background: DS.gradientPrimary,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Pattern
            </span>
          </h1>
          <p
            style={{
              fontFamily: DS.font,
              fontSize: 13,
              fontWeight: 400,
              color: DS.grey,
              margin: `${DS.spacingXs}px 0 0`,
              letterSpacing: "0.3px",
            }}
          >
            Discover the mystery operation inside the machine
          </p>
        </div>

        {showStepIndicator && renderStepIndicator()}
        {renderDescription()}
        {renderMachine()}
        {renderTable()}
        {renderHypothesisInput()}
        {renderRuleCard()}
        {renderMachine2Preview()}
        {renderNavigation()}
      </div>

      {renderConfetti()}
    </div>
  );
};

export default PatternMachineExplorer;
