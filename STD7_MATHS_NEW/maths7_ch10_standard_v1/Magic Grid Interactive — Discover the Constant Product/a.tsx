// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: magic_grid_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

// @ts-expect-error React types - ensure 'react' and '@types/react' are installed
import React, { useState, useEffect, useCallback, useMemo } from "react";
// @ts-expect-error lucide-react - ensure 'lucide-react' is installed
import { ChevronLeft, ChevronRight, RotateCcw, Plus } from "lucide-react";

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

interface MagicGridAdditionalProps {
  grid?: number[][];
  run1Choices?: [number, number][];
  run2Choices?: [number, number][];
  expectedProduct?: number;
}

interface MagicGridToolProps {
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
    additionalProps?: MagicGridAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DESIGN SYSTEM TOKENS ====================

const DS = {
  colors: {
    primary: "#4A4DC9",
    accent: "#FF7212",
    darkPurple: "#533086",
    lightOrange: "#FC9145",
    lightPurple: "#C1C1EA",
    lightPeach: "#FFF3E4",
    gray900: "#4E4E4E",
    gray400: "#CACACA",
    gray200: "#EBEBEB",
    gray100: "#F5F5F5",
    white: "#FFFFFF",
    black: "#1A1A2E",
    error: "#E53935",
    success: "#2E7D32",
  },
  font: '"Poppins", sans-serif',
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    pill: "999px",
  },
  shadow: {
    sm: "0 2px 8px rgba(74, 77, 201, 0.08)",
    md: "0 4px 20px rgba(74, 77, 201, 0.12)",
    lg: "0 8px 40px rgba(74, 77, 201, 0.16)",
    accent: "0 4px 20px rgba(255, 114, 18, 0.25)",
    primary: "0 4px 20px rgba(74, 77, 201, 0.25)",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
};

// ==================== EASING HELPERS ====================

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

// ==================== DEFAULT DATA ====================

const DEFAULT_GRID: number[][] = [
  [8, -4, 12, -6],
  [-28, 14, -42, 21],
  [12, -6, 18, -9],
  [20, -10, 30, -15],
];

const DEFAULT_RUN1: [number, number][] = [
  [3, 0],
  [1, 1],
  [0, 2],
  [2, 3],
];

const DEFAULT_RUN2: [number, number][] = [
  [1, 0],
  [0, 1],
  [2, 2],
  [3, 3],
];

// ==================== MAIN COMPONENT ====================

const MagicGridTool: React.FC<MagicGridToolProps> = ({
  props: propsIn,
  setStepDetails,
}) => {
  const props = (propsIn ?? {}) as NonNullable<MagicGridToolProps["props"]>;
  const additionalProps = props?.additionalProps ?? {};
  const {
    grid = DEFAULT_GRID,
    run1Choices = DEFAULT_RUN1,
    run2Choices = DEFAULT_RUN2,
  } = additionalProps;

  const animationSpeed = props?.animationSpeed ?? 1;

  const expectedProduct =
    additionalProps.expectedProduct ||
    run1Choices.reduce(
      (acc: number, [r, c]: [number, number]) => acc * grid[r][c],
      1,
    );

  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [circledCells, setCircledCells] = useState<[number, number][]>([]);
  const [struckRows, setStruckRows] = useState<Set<number>>(new Set());
  const [struckCols, setStruckCols] = useState<Set<number>>(new Set());
  const [showProduct, setShowProduct] = useState(false);
  const [showMagicReveal, setShowMagicReveal] = useState(false);
  const [animatingCell, setAnimatingCell] = useState<[number, number] | null>(
    null,
  );
  const [animatingStrike, setAnimatingStrike] = useState(false);
  const [run2Active, setRun2Active] = useState(false);
  const [run2CircledCells, setRun2CircledCells] = useState<[number, number][]>(
    [],
  );
  const [run2StruckRows, setRun2StruckRows] = useState<Set<number>>(new Set());
  const [run2StruckCols, setRun2StruckCols] = useState<Set<number>>(new Set());
  const [run2ShowProduct, setRun2ShowProduct] = useState(false);
  const [run2Round, setRun2Round] = useState(0);
  const [sparkleVisible, setSparkleVisible] = useState(false);
  const [productAnimating, setProductAnimating] = useState(false);
  const [stepTransition, setStepTransition] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);

  // Inject keyframes + Poppins font
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.id = "magic-grid-keyframes-v2";
    styleSheet.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

      @keyframes circleScaleIn {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.25); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes strikeThrough {
        0% { width: 0%; }
        100% { width: 150%; }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeInScale {
        from { opacity: 0; transform: scale(0.85); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes popIn {
        0% { transform: scale(0); opacity: 0; }
        60% { transform: scale(1.12); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(40px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-40px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.06); }
      }
      @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
        50% { opacity: 1; transform: scale(1) rotate(180deg); }
      }
      @keyframes bannerSlide {
        0% { transform: translateY(-80px) scale(0.6); opacity: 0; }
        60% { transform: translateY(8px) scale(1.03); }
        100% { transform: translateY(0) scale(1); opacity: 1; }
      }
      @keyframes cardSlide {
        from { opacity: 0; transform: translateY(16px) scale(0.92); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes productReveal {
        0% { transform: scale(0) rotate(-8deg); opacity: 0; }
        60% { transform: scale(1.15) rotate(2deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes stepPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(74, 77, 201, 0.4); }
        50% { box-shadow: 0 0 0 6px rgba(74, 77, 201, 0.1); }
      }
      @keyframes textGlow {
        0%, 100% { text-shadow: 0 0 8px rgba(74, 77, 201, 0.2); }
        50% { text-shadow: 0 0 20px rgba(74, 77, 201, 0.4); }
      }
      @keyframes floatShape {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-8px) rotate(3deg); }
      }
      @keyframes rotateShape {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes shimmerGradient {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes ripple {
        0% { transform: scale(0); opacity: 0.5; }
        100% { transform: scale(4); opacity: 0; }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      const existing = document.getElementById("magic-grid-keyframes-v2");
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  // Report step details
  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep,
        totalSteps: 6,
        isPaused: true,
        currentMode: "learn",
      });
    }
  }, [currentStep, setStepDetails]);

  // ==================== ANIMATION LOGIC ====================

  const animateRound = useCallback(
    (roundIndex: number) => {
      if (roundIndex >= run1Choices.length) return;
      const [r, c] = run1Choices[roundIndex];
      setAnimatingCell([r, c]);

      setTimeout(() => {
        setCircledCells((prev) => [...prev, [r, c]]);
        setAnimatingCell(null);
        setAnimatingStrike(true);

        setTimeout(() => {
          setStruckRows((prev) => new Set([...prev, r]));
          setStruckCols((prev) => new Set([...prev, c]));
          setAnimatingStrike(false);
          setCurrentRound(roundIndex + 1);
        }, 400 / animationSpeed);
      }, 500 / animationSpeed);
    },
    [run1Choices, animationSpeed],
  );

  const animateRun2Round = useCallback(
    (roundIndex: number) => {
      if (roundIndex >= run2Choices.length) return;
      const [r, c] = run2Choices[roundIndex];
      setAnimatingCell([r, c]);

      setTimeout(() => {
        setRun2CircledCells((prev) => [...prev, [r, c]]);
        setAnimatingCell(null);
        setAnimatingStrike(true);

        setTimeout(() => {
          setRun2StruckRows((prev) => new Set([...prev, r]));
          setRun2StruckCols((prev) => new Set([...prev, c]));
          setAnimatingStrike(false);
          setRun2Round(roundIndex + 1);
        }, 400 / animationSpeed);
      }, 500 / animationSpeed);
    },
    [run2Choices, animationSpeed],
  );

  // ==================== NAVIGATION ====================

  const goToStep = useCallback((step: number) => {
    setStepTransition(true);
    setTimeout(() => {
      if (step === 0) {
        setCircledCells([]);
        setStruckRows(new Set());
        setStruckCols(new Set());
        setCurrentRound(0);
        setShowProduct(false);
        setShowMagicReveal(false);
        setRun2Active(false);
        setRun2CircledCells([]);
        setRun2StruckRows(new Set());
        setRun2StruckCols(new Set());
        setRun2ShowProduct(false);
        setRun2Round(0);
        setSparkleVisible(false);
        setProductAnimating(false);
      }
      setCurrentStep(step);
      setStepTransition(false);
    }, 280);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep === 0) {
      goToStep(1);
      setTimeout(() => animateRound(0), 500);
    } else if (currentStep >= 1 && currentStep <= 3) {
      const nextRoundInStep = currentStep;
      if (nextRoundInStep < 4 && currentRound >= currentStep) {
        if (currentStep < 3) {
          goToStep(currentStep + 1);
          setTimeout(() => animateRound(currentStep), 500);
        } else {
          goToStep(4);
          setTimeout(() => {
            animateRound(3);
            setTimeout(() => {
              setShowProduct(true);
              setProductAnimating(true);
              setTimeout(() => setProductAnimating(false), 1200);
            }, 1200 / animationSpeed);
          }, 400);
        }
      }
    } else if (currentStep === 4) {
      goToStep(5);
      setRun2Active(true);
      let delay = 600;
      for (let i = 0; i < 4; i++) {
        setTimeout(() => animateRun2Round(i), delay);
        delay += 1200 / animationSpeed;
      }
      setTimeout(() => {
        setRun2ShowProduct(true);
        setProductAnimating(true);
        setTimeout(() => {
          setProductAnimating(false);
          setShowMagicReveal(true);
          setSparkleVisible(true);
        }, 800);
      }, delay + 400);
    }
  }, [
    currentStep,
    currentRound,
    goToStep,
    animateRound,
    animateRun2Round,
    animationSpeed,
  ]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) goToStep(0);
  }, [currentStep, goToStep]);

  const handleReset = useCallback(() => {
    goToStep(0);
  }, [goToStep]);

  // ==================== COMPUTED VALUES ====================

  const run1Values = circledCells.map(([r, c]) => grid[r][c]);
  const run2Values = run2CircledCells.map(([r, c]) => grid[r][c]);
  const run1Product = run1Values.reduce((a, b) => a * b, 1);
  const run2Product =
    run2Values.length === 4 ? run2Values.reduce((a, b) => a * b, 1) : 0;

  const isCellCircled = (r: number, c: number, circled: [number, number][]) =>
    circled.some(([cr, cc]) => cr === r && cc === c);

  const isAnimatingCell = (r: number, c: number) =>
    animatingCell !== null && animatingCell[0] === r && animatingCell[1] === c;

  const canGoNext = () => {
    if (currentStep === 0) return true;
    if (currentStep === 1 && currentRound >= 1) return true;
    if (currentStep === 2 && currentRound >= 2) return true;
    if (currentStep === 3 && currentRound >= 3) return true;
    if (currentStep === 4 && showProduct) return true;
    return false;
  };

  const getStepTitle = () => {
    if (currentStep === 0) return "The Magic Grid";
    if (currentStep >= 1 && currentStep <= 3)
      return `Run 1 — Round ${currentStep} of 4`;
    if (currentStep === 4) return "The Product — Run 1";
    if (currentStep === 5) return "Magic Revealed!";
    return "";
  };

  const getStepDescription = () => {
    if (currentStep === 0) {
      return "Here is a 4×4 grid of integers. In each round, we circle one number, then strike out its entire row and column. After 4 rounds, we multiply all circled numbers. Let's see what happens!";
    }
    if (currentStep >= 1 && currentStep <= 3) {
      return "Watch: we circle a number, then cross out every other number in the same row and column. Those crossed-out numbers can't be chosen again.";
    }
    if (currentStep === 4) {
      return "All 4 numbers have been circled! Now multiply them together. Does anyone want to try different choices? Do you think the answer will change?";
    }
    if (currentStep === 5) {
      return "Completely different numbers were chosen — yet the product is exactly the same! The magic is in both the numbers AND their arrangement.";
    }
    return "";
  };

  // ==================== RENDER: CONTAINED BUTTON ====================

  const renderContainedBtn = (
    label: string,
    onClick: () => void,
    id: string,
    disabled: boolean = false,
    isAccent: boolean = false,
    icon?: React.ReactNode,
  ) => {
    const isHovered = hoveredBtn === id && !disabled;
    const isPressed = pressedBtn === id && !disabled;
    const bg = disabled
      ? DS.colors.gray200
      : isAccent
        ? isPressed
          ? "#E5600E"
          : isHovered
            ? DS.colors.lightOrange
            : DS.colors.accent
        : isPressed
          ? "#3A3DA8"
          : isHovered
            ? DS.colors.darkPurple
            : DS.colors.primary;
    const textColor = disabled ? DS.colors.gray400 : DS.colors.white;

    return (
      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => setHoveredBtn(id)}
        onMouseLeave={() => {
          setHoveredBtn(null);
          setPressedBtn(null);
        }}
        onMouseDown={() => setPressedBtn(id)}
        onMouseUp={() => setPressedBtn(null)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          height: "40px",
          padding: icon ? "0 24px 0 20px" : "0 24px",
          borderRadius: DS.radius.pill,
          border: "none",
          background: bg,
          color: textColor,
          fontFamily: DS.font,
          fontWeight: 600,
          fontSize: "14px",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isPressed
            ? "scale(0.96)"
            : isHovered
              ? "scale(1.03)"
              : "scale(1)",
          boxShadow: disabled
            ? "none"
            : isHovered
              ? isAccent
                ? DS.shadow.accent
                : DS.shadow.primary
              : DS.shadow.sm,
          letterSpacing: "0.2px",
          whiteSpace: "nowrap" as const,
        }}
      >
        {icon && (
          <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
        )}
        {label}
      </button>
    );
  };

  // ==================== RENDER: OUTLINED BUTTON ====================

  const renderOutlinedBtn = (
    label: string,
    onClick: () => void,
    id: string,
    icon?: React.ReactNode,
  ) => {
    const isHovered = hoveredBtn === id;
    const isPressed = pressedBtn === id;

    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHoveredBtn(id)}
        onMouseLeave={() => {
          setHoveredBtn(null);
          setPressedBtn(null);
        }}
        onMouseDown={() => setPressedBtn(id)}
        onMouseUp={() => setPressedBtn(null)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          height: "40px",
          padding: icon ? "0 24px 0 20px" : "0 24px",
          borderRadius: DS.radius.pill,
          border: `2px solid ${isHovered ? DS.colors.darkPurple : DS.colors.primary}`,
          background: isPressed
            ? DS.colors.lightPurple
            : isHovered
              ? "rgba(74, 77, 201, 0.06)"
              : "transparent",
          color: isHovered ? DS.colors.darkPurple : DS.colors.primary,
          fontFamily: DS.font,
          fontWeight: 600,
          fontSize: "14px",
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isPressed
            ? "scale(0.96)"
            : isHovered
              ? "scale(1.03)"
              : "scale(1)",
          letterSpacing: "0.2px",
          whiteSpace: "nowrap" as const,
        }}
      >
        {icon && (
          <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
        )}
        {label}
      </button>
    );
  };

  // ==================== RENDER: GRID ====================

  const renderGrid = (
    circled: [number, number][],
    sRows: Set<number>,
    sCols: Set<number>,
  ) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "4px",
        background: DS.colors.white,
        borderRadius: DS.radius.lg,
        padding: "14px",
        boxShadow: DS.shadow.md,
        border: `1.5px solid ${DS.colors.gray200}`,
        maxWidth: "360px",
        width: "100%",
        animation: "fadeInScale 0.5s ease-out",
        position: "relative" as const,
      }}
    >
      {/* Corner geometric decorations */}
      <div
        style={{
          position: "absolute",
          top: "-8px",
          right: "-8px",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          border: `2px solid ${DS.colors.lightPurple}`,
          background: "transparent",
          animation: "floatShape 3s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-6px",
          left: "-6px",
          width: "16px",
          height: "16px",
          border: `2px solid ${DS.colors.lightOrange}`,
          background: "transparent",
          transform: "rotate(45deg)",
          animation: "floatShape 4s ease-in-out infinite 0.5s",
        }}
      />

      {grid.map((row, r) =>
        row.map((val, c) => {
          const cellCircled = isCellCircled(r, c, circled);
          const cellStruck = sRows.has(r) || sCols.has(c);
          const cellAnimating = isAnimatingCell(r, c);

          return (
            <div
              key={`${r}-${c}`}
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: cellCircled
                  ? DS.colors.lightPeach
                  : cellStruck
                    ? DS.colors.gray100
                    : DS.colors.white,
                borderRadius: DS.radius.md,
                fontFamily: DS.font,
                fontSize: "clamp(16px, 3.8vw, 26px)",
                fontWeight: 800,
                color: cellCircled
                  ? DS.colors.accent
                  : cellStruck
                    ? DS.colors.gray400
                    : DS.colors.black,
                opacity: cellStruck && !cellCircled ? 0.35 : 1,
                transition: `all ${0.35 / animationSpeed}s cubic-bezier(0.4, 0, 0.2, 1)`,
                overflow: "hidden",
                border: cellCircled
                  ? `2.5px solid ${DS.colors.accent}`
                  : cellAnimating
                    ? `2.5px solid ${DS.colors.lightOrange}`
                    : `1.5px solid ${DS.colors.gray200}`,
                boxShadow: cellCircled
                  ? `0 0 0 3px ${DS.colors.lightPeach}, ${DS.shadow.accent}`
                  : cellAnimating
                    ? "0 0 16px rgba(255, 114, 18, 0.3)"
                    : "none",
                minHeight: "56px",
              }}
            >
              <span
                style={{
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {val}
              </span>

              {/* Circled ring */}
              {cellCircled && (
                <div
                  style={{
                    position: "absolute",
                    inset: "3px",
                    border: `3px solid ${DS.colors.accent}`,
                    borderRadius: "50%",
                    animation: `circleScaleIn ${0.4 / animationSpeed}s ease-out`,
                    zIndex: 1,
                    boxShadow: "inset 0 0 12px rgba(255, 114, 18, 0.15)",
                  }}
                />
              )}

              {/* Animating pulse bg */}
              {cellAnimating && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle, rgba(255,114,18,0.12) 0%, transparent 70%)",
                    borderRadius: DS.radius.md,
                    animation: "pulse 0.6s ease-in-out",
                    zIndex: 0,
                  }}
                />
              )}

              {/* Strike diagonal */}
              {cellStruck && !cellCircled && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "-25%",
                    height: "2.5px",
                    width: "150%",
                    background: `linear-gradient(90deg, transparent 0%, ${DS.colors.error} 15%, ${DS.colors.error} 85%, transparent 100%)`,
                    transform: "rotate(-45deg) translateY(-50%)",
                    animation: `strikeThrough ${0.3 / animationSpeed}s ease-out`,
                    zIndex: 3,
                  }}
                />
              )}
            </div>
          );
        }),
      )}
    </div>
  );

  // ==================== RENDER: CIRCLED PANEL ====================

  const renderCircledPanel = (
    values: number[],
    showProd: boolean,
    product: number,
    label: string,
  ) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "18px 16px",
        background: DS.colors.white,
        borderRadius: DS.radius.lg,
        border: `1.5px solid ${DS.colors.gray200}`,
        boxShadow: DS.shadow.sm,
        minWidth: "150px",
        animation: "slideInRight 0.5s ease-out",
      }}
    >
      <div
        style={{
          fontFamily: DS.font,
          fontSize: "11px",
          color: DS.colors.darkPurple,
          textAlign: "center",
          letterSpacing: "1.2px",
          textTransform: "uppercase" as const,
          fontWeight: 700,
        }}
      >
        {label}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          alignItems: "center",
        }}
      >
        {values.map((val, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              animation: `cardSlide ${0.4 / animationSpeed}s ease-out ${i * 0.12}s both`,
            }}
          >
            {i > 0 && (
              <span
                style={{
                  fontFamily: DS.font,
                  fontSize: "15px",
                  fontWeight: 700,
                  color: DS.colors.primary,
                }}
              >
                ×
              </span>
            )}
            <div
              style={{
                padding: "5px 14px",
                background: val < 0 ? "#FEF2F2" : "#F0FFF4",
                borderRadius: DS.radius.pill,
                fontFamily: DS.font,
                fontSize: "clamp(14px, 2.8vw, 20px)",
                fontWeight: 700,
                color: val < 0 ? DS.colors.error : DS.colors.success,
                border: val < 0 ? "1.5px solid #FECACA" : "1.5px solid #BBF7D0",
                animation: `popIn ${0.4 / animationSpeed}s ease-out ${i * 0.12 + 0.08}s both`,
              }}
            >
              {val}
            </div>
          </div>
        ))}
      </div>

      {showProd && (
        <div
          style={{
            marginTop: "6px",
            padding: "10px 14px",
            background: `linear-gradient(135deg, ${DS.colors.primary}, ${DS.colors.darkPurple})`,
            borderRadius: DS.radius.xl,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1px",
            animation: `productReveal ${0.6 / animationSpeed}s ease-out`,
            boxShadow: DS.shadow.primary,
          }}
        >
          <span
            style={{
              fontFamily: DS.font,
              fontSize: "10px",
              color: DS.colors.lightPurple,
              fontWeight: 600,
              textTransform: "uppercase" as const,
              letterSpacing: "1.5px",
            }}
          >
            Product
          </span>
          <span
            style={{
              fontFamily: DS.font,
              fontSize: "clamp(22px, 4.5vw, 34px)",
              fontWeight: 900,
              color: DS.colors.white,
              animation: productAnimating
                ? "pulse 0.6s ease-in-out infinite"
                : "none",
            }}
          >
            {product.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );

  // ==================== RENDER: STEP INDICATOR ====================

  const renderStepIndicator = () => (
    <div
      style={{
        display: "flex",
        gap: "6px",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 0 4px",
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: currentStep === i ? "28px" : "10px",
            height: "10px",
            borderRadius: DS.radius.pill,
            background:
              currentStep === i
                ? DS.colors.white
                : i < currentStep
                  ? "rgba(255,255,255,0.6)"
                  : "rgba(255,255,255,0.25)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            animation:
              currentStep === i ? "stepPulse 2s ease-in-out infinite" : "none",
          }}
        />
      ))}
      <span
        style={{
          fontFamily: DS.font,
          fontSize: "12px",
          color: "rgba(255,255,255,0.8)",
          fontWeight: 600,
          marginLeft: "10px",
        }}
      >
        {currentStep + 1} / 6
      </span>
    </div>
  );

  // ==================== RENDER: DECORATIVE SHAPES ====================

  const renderDecoShapes = () => (
    <>
      <svg
        style={{
          position: "absolute",
          top: "12px",
          right: "60px",
          width: "28px",
          height: "28px",
          opacity: 0.18,
          animation: "floatShape 5s ease-in-out infinite",
        }}
        viewBox="0 0 24 24"
      >
        <polygon
          points="12,2 22,22 2,22"
          fill="none"
          stroke={DS.colors.white}
          strokeWidth="2"
        />
      </svg>
      <svg
        style={{
          position: "absolute",
          bottom: "8px",
          right: "20px",
          width: "22px",
          height: "22px",
          opacity: 0.15,
          animation: "floatShape 4s ease-in-out infinite 1s",
        }}
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke={DS.colors.white}
          strokeWidth="2"
        />
      </svg>
      <svg
        style={{
          position: "absolute",
          top: "18px",
          left: "50%",
          width: "18px",
          height: "18px",
          opacity: 0.12,
          animation: "rotateShape 20s linear infinite",
        }}
        viewBox="0 0 24 24"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          fill="none"
          stroke={DS.colors.white}
          strokeWidth="2"
        />
      </svg>
    </>
  );

  // ==================== MAIN RENDER ====================

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "920px",
        margin: "0 auto",
        fontFamily: DS.font,
        background: DS.colors.white,
        borderRadius: DS.radius.xl,
        overflow: "hidden",
        boxShadow: DS.shadow.lg,
        border: `1px solid ${DS.colors.gray200}`,
        position: "relative",
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.colors.primary} 0%, ${DS.colors.darkPurple} 100%)`,
          padding: "20px 28px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {renderDecoShapes()}

        {/* Accent bottom stripe */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: `linear-gradient(90deg, ${DS.colors.accent}, ${DS.colors.lightOrange}, ${DS.colors.accent})`,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: DS.radius.md,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <span style={{ fontSize: "22px" }}>✨</span>
          </div>
          <div>
            <h1
              style={{
                fontFamily: DS.font,
                fontSize: "clamp(17px, 3.8vw, 24px)",
                fontWeight: 800,
                color: DS.colors.white,
                margin: 0,
                letterSpacing: "-0.2px",
              }}
            >
              A Magic Grid of Integers
            </h1>
            <p
              style={{
                fontFamily: DS.font,
                fontSize: "12px",
                color: DS.colors.lightPurple,
                margin: 0,
                fontWeight: 500,
                letterSpacing: "0.3px",
              }}
            >
              Grade 7 · Operations with Integers
            </p>
          </div>
        </div>

        {renderStepIndicator()}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div
        style={{
          padding: "clamp(18px, 3vw, 32px)",
          opacity: stepTransition ? 0 : 1,
          transform: stepTransition ? "translateY(8px)" : "translateY(0)",
          transition: "all 0.28s ease",
          background: DS.colors.gray100,
          minHeight: "320px",
        }}
      >
        {/* Step Title & Description */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "22px",
            animation: "fadeInUp 0.45s ease-out",
          }}
        >
          <h2
            style={{
              fontFamily: DS.font,
              fontSize: "clamp(18px, 3.8vw, 26px)",
              fontWeight: 800,
              color: DS.colors.black,
              margin: "0 0 8px 0",
              animation:
                currentStep === 5 && showMagicReveal
                  ? "textGlow 2s ease-in-out infinite"
                  : "none",
            }}
          >
            {getStepTitle()}
          </h2>
          <p
            style={{
              fontFamily: DS.font,
              fontSize: "clamp(12px, 2.4vw, 15px)",
              color: DS.colors.gray900,
              margin: 0,
              lineHeight: 1.65,
              maxWidth: "580px",
              marginLeft: "auto",
              marginRight: "auto",
              fontWeight: 500,
            }}
          >
            {getStepDescription()}
          </p>
        </div>

        {/* ── STEP 5: DUAL GRID VIEW ── */}
        {currentStep === 5 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "28px",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {/* Run 1 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  animation: "slideInLeft 0.5s ease-out",
                }}
              >
                <div
                  style={{
                    fontFamily: DS.font,
                    fontSize: "13px",
                    fontWeight: 700,
                    color: DS.colors.primary,
                    padding: "4px 18px",
                    background: DS.colors.lightPurple,
                    borderRadius: DS.radius.pill,
                    border: `1.5px solid ${DS.colors.primary}`,
                    letterSpacing: "0.5px",
                  }}
                >
                  Run 1
                </div>
                {renderGrid(circledCells, struckRows, struckCols)}
                {renderCircledPanel(
                  run1Values,
                  true,
                  run1Product,
                  "Circled Numbers",
                )}
              </div>

              {/* Run 2 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  animation: "slideInRight 0.7s ease-out",
                }}
              >
                <div
                  style={{
                    fontFamily: DS.font,
                    fontSize: "13px",
                    fontWeight: 700,
                    color: DS.colors.accent,
                    padding: "4px 18px",
                    background: DS.colors.lightPeach,
                    borderRadius: DS.radius.pill,
                    border: `1.5px solid ${DS.colors.accent}`,
                    letterSpacing: "0.5px",
                  }}
                >
                  Run 2
                </div>
                {renderGrid(run2CircledCells, run2StruckRows, run2StruckCols)}
                {run2Values.length > 0 &&
                  renderCircledPanel(
                    run2Values,
                    run2ShowProduct,
                    run2Product,
                    "Circled Numbers",
                  )}
              </div>
            </div>

            {/* Magic Banner */}
            {showMagicReveal && (
              <div
                style={{
                  animation: "bannerSlide 0.7s ease-out",
                  background: `linear-gradient(135deg, ${DS.colors.primary}, ${DS.colors.darkPurple})`,
                  borderRadius: DS.radius.xl,
                  padding: "24px 36px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: DS.shadow.primary,
                  position: "relative",
                  overflow: "hidden",
                  maxWidth: "520px",
                  width: "100%",
                }}
              >
                {/* Accent bottom bar */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${DS.colors.accent}, ${DS.colors.lightOrange})`,
                  }}
                />

                {/* Sparkles */}
                {sparkleVisible &&
                  [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        width: i % 2 === 0 ? "6px" : "8px",
                        height: i % 2 === 0 ? "6px" : "8px",
                        background:
                          i % 3 === 0
                            ? DS.colors.accent
                            : i % 3 === 1
                              ? DS.colors.lightOrange
                              : DS.colors.lightPurple,
                        borderRadius: i % 2 === 0 ? "50%" : "2px",
                        top: `${10 + Math.sin(i * 1.3) * 35 + 35}%`,
                        left: `${5 + i * 12.5}%`,
                        animation: `sparkle ${1.2 + i * 0.2}s ease-in-out ${i * 0.15}s infinite`,
                        transform: i % 2 !== 0 ? "rotate(45deg)" : "none",
                      }}
                    />
                  ))}

                <div
                  style={{
                    fontFamily: DS.font,
                    fontSize: "clamp(20px, 4.5vw, 30px)",
                    fontWeight: 900,
                    color: DS.colors.white,
                    textAlign: "center",
                    position: "relative",
                    zIndex: 1,
                    letterSpacing: "-0.3px",
                  }}
                >
                  ✨ Magic Revealed! ✨
                </div>
                <div
                  style={{
                    fontFamily: DS.font,
                    fontSize: "clamp(13px, 2.4vw, 17px)",
                    color: DS.colors.lightPurple,
                    textAlign: "center",
                    fontWeight: 600,
                    position: "relative",
                    zIndex: 1,
                    lineHeight: 1.5,
                  }}
                >
                  Both runs give the same product:{" "}
                  <span
                    style={{
                      fontFamily: DS.font,
                      fontSize: "clamp(18px, 3.5vw, 26px)",
                      fontWeight: 900,
                      color: DS.colors.lightOrange,
                      display: "inline-block",
                      animation: "pulse 1.8s ease-in-out infinite",
                    }}
                  >
                    {expectedProduct.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: DS.font,
                    fontSize: "12px",
                    color: "rgba(193, 193, 234, 0.8)",
                    textAlign: "center",
                    fontWeight: 500,
                    position: "relative",
                    zIndex: 1,
                    marginTop: "2px",
                  }}
                >
                  No matter which numbers you pick, the product is always the
                  same!
                </div>
              </div>
            )}

            {/* Teaching question */}
            {showMagicReveal && (
              <div
                style={{
                  animation: "fadeInUp 0.5s ease-out 0.8s both",
                  background: DS.colors.lightPeach,
                  borderRadius: DS.radius.lg,
                  padding: "16px 24px",
                  border: `1.5px solid ${DS.colors.lightOrange}`,
                  maxWidth: "520px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: DS.font,
                    fontSize: "clamp(12px, 2.3vw, 15px)",
                    color: DS.colors.gray900,
                    fontWeight: 600,
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  🤔 What is special about this grid? Is the magic in the
                  numbers, the arrangement, or both? Can you create your own
                  magic grid?
                </p>
              </div>
            )}
          </div>
        ) : (
          /* ── STEPS 0-4: SINGLE GRID VIEW ── */
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "24px",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            {renderGrid(circledCells, struckRows, struckCols)}
            {circledCells.length > 0 && (
              <div style={{ minWidth: "150px" }}>
                {renderCircledPanel(
                  run1Values,
                  showProduct,
                  run1Product,
                  "Circled Numbers",
                )}
              </div>
            )}
          </div>
        )}

        {/* Instructions card (Step 0) */}
        {currentStep === 0 && (
          <div
            style={{
              animation: "fadeInUp 0.5s ease-out 0.2s both",
              background: DS.colors.white,
              borderRadius: DS.radius.lg,
              padding: "18px 22px",
              border: `1.5px solid ${DS.colors.lightPurple}`,
              marginTop: "22px",
              maxWidth: "520px",
              marginLeft: "auto",
              marginRight: "auto",
              boxShadow: DS.shadow.sm,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: DS.colors.lightPurple,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                }}
              >
                📋
              </div>
              <span
                style={{
                  fontFamily: DS.font,
                  fontSize: "13px",
                  fontWeight: 700,
                  color: DS.colors.darkPurple,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.8px",
                }}
              >
                Instructions
              </span>
            </div>
            <p
              style={{
                fontFamily: DS.font,
                fontSize: "13px",
                color: DS.colors.gray900,
                fontWeight: 500,
                margin: 0,
                lineHeight: 1.65,
              }}
            >
              Watch each round carefully: one number is circled and its entire
              row and column are crossed out. After 4 rounds, we multiply the
              circled numbers. Then predict: if we chose completely different
              numbers, would the product change?
            </p>
          </div>
        )}
      </div>

      {/* ── NAVIGATION BAR ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 28px 18px",
          background: DS.colors.white,
          borderTop: `1px solid ${DS.colors.gray200}`,
        }}
      >
        {renderOutlinedBtn(
          "Reset",
          handleReset,
          "reset-btn",
          <RotateCcw size={15} />,
        )}

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {currentStep > 0 &&
            renderOutlinedBtn(
              "Start Over",
              handlePrev,
              "prev-btn",
              <ChevronLeft size={16} />,
            )}

          {currentStep < 5 &&
            renderContainedBtn(
              currentStep === 0
                ? "Let's Begin!"
                : currentStep === 4
                  ? "Reveal the Magic!"
                  : "Next Round",
              handleNext,
              "next-btn",
              !(canGoNext() || currentStep === 0),
              currentStep === 4,
              <ChevronRight size={16} />,
            )}
        </div>
      </div>
    </div>
  );
};

export default MagicGridTool;
