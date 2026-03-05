// @ts-ignore - react provided by host/runtime
import React, { useState, useEffect, useCallback, useMemo } from "react";
// @ts-ignore - lucide-react provided by host/runtime
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles, BookOpen, CheckCircle } from "lucide-react";

// ==================== SINGULARITY DESIGN SYSTEM TOKENS ====================

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
    successLight: "#E8F5E9",
    errorLight: "#FFEBEE",
  },
  font: '"Poppins", sans-serif',
  radius: { sm: "8px", md: "12px", lg: "16px", xl: "24px", pill: "999px" },
  shadow: {
    sm: "0 2px 8px rgba(74,77,201,0.08)",
    md: "0 4px 16px rgba(74,77,201,0.12)",
    lg: "0 8px 32px rgba(74,77,201,0.16)",
    accent: "0 4px 20px rgba(255,114,18,0.25)",
    primary: "0 4px 20px rgba(74,77,201,0.25)",
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

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "real_world" | "hands_on";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface DistributivePropertyExplorerProps {
  props?: {
    width?: number;
    height?: number;
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
    additionalProps?: {
      examples?: { a: number; b: number; c: number; label?: string }[];
      showTokenModel?: boolean;
      highlightSignRules?: boolean;
      diwaliContext?: boolean;
    };
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== EXAMPLE DATA ====================

const EXAMPLES = [
  {
    a: 5,
    b: 4,
    c: -2,
    label: "Example 1",
    context:
      "Imagine you bought 5 gift boxes for Diwali. Each box has 4 sweets and 2 empty slots. How many filled slots total?",
    lhsSteps: [
      { expr: "5 × (4 + (−2))", note: "Start: a × (b + c)" },
      {
        expr: "5 × (2)",
        note: "Simplify bracket: 4 + (−2) = 2",
        highlight: "4 + (−2) = 2",
      },
      { expr: "10", note: "Multiply: 5 × 2 = 10" },
    ],
    rhsSteps: [
      { expr: "5 × 4 + 5 × (−2)", note: "Expand: a×b + a×c" },
      {
        expr: "20 + (−10)",
        note: "Compute each term",
        terms: [
          { val: "5 × 4 = 20", positive: true },
          { val: "5 × (−2) = −10", positive: false },
        ],
      },
      { expr: "10", note: "Add: 20 + (−10) = 10" },
    ],
    result: 10,
  },
  {
    a: -2,
    b: 4,
    c: -3,
    label: "Example 2",
    context:
      "During Diwali sale, a shopkeeper gives ₹2 discount per item. You buy 4 regular items and return 3 items. What is the total discount effect?",
    lhsSteps: [
      { expr: "(−2) × (4 + (−3))", note: "Start: a × (b + c) with negative a" },
      {
        expr: "(−2) × (1)",
        note: "Simplify bracket: 4 + (−3) = 1",
        highlight: "4 + (−3) = 1",
      },
      { expr: "−2", note: "Multiply: (−2) × 1 = −2" },
    ],
    rhsSteps: [
      { expr: "(−2) × 4 + (−2) × (−3)", note: "Expand: a×b + a×c" },
      {
        expr: "(−8) + (6)",
        note: "Compute each term — sign rules at work!",
        terms: [
          { val: "(−2) × 4 = −8", positive: false },
          { val: "(−2) × (−3) = +6", positive: true, signRule: true },
        ],
      },
      { expr: "−2", note: "Add: (−8) + 6 = −2" },
    ],
    result: -2,
    signRuleHighlight: "(−2) × (−3) = +6 — Negative × Negative = Positive!",
  },
];

// ==================== MAIN COMPONENT ====================

type PropsConfig = NonNullable<DistributivePropertyExplorerProps["props"]>;

const DistributivePropertyExplorer: React.FC<
  DistributivePropertyExplorerProps
> = ({
  props: propsIn = {} as PropsConfig,
  setStepDetails,
  stopAutoNext,
}) => {
  const config = useMemo(
    () => ({
      width: propsIn.width ?? 800,
      height: propsIn.height ?? 600,
      showNavigation: propsIn.showNavigation ?? true,
      showStepIndicator: propsIn.showStepIndicator ?? true,
      animationSpeed: propsIn.animationSpeed ?? 1,
      autoPlayDuration: propsIn.autoPlayDuration ?? 0,
    }),
    [propsIn],
  );

  const additionalProps = propsIn.additionalProps || {};
  const examples = additionalProps.examples
    ? additionalProps.examples.map((ex: any, i: number) => {
        const lhsBracket = ex.b + ex.c;
        const lhsResult = ex.a * (ex.b + ex.c);
        const rhsTerm1 = ex.a * ex.b;
        const rhsTerm2 = ex.a * ex.c;
        return {
          a: ex.a,
          b: ex.b,
          c: ex.c,
          label: ex.label || `Example ${i + 1}`,
          context: "",
          lhsSteps: [
            {
              expr: `${ex.a} × (${ex.b} + (${ex.c}))`,
              note: "Start: a × (b + c)",
            },
            {
              expr: `${ex.a} × (${lhsBracket})`,
              note: `Simplify bracket: ${ex.b} + (${ex.c}) = ${lhsBracket}`,
              highlight: `${ex.b} + (${ex.c}) = ${lhsBracket}`,
            },
            {
              expr: `${lhsResult}`,
              note: `Multiply: ${ex.a} × ${lhsBracket} = ${lhsResult}`,
            },
          ],
          rhsSteps: [
            {
              expr: `${ex.a} × ${ex.b} + ${ex.a} × (${ex.c})`,
              note: "Expand: a×b + a×c",
            },
            {
              expr: `(${rhsTerm1}) + (${rhsTerm2})`,
              note: "Compute each term",
              terms: [
                {
                  val: `${ex.a} × ${ex.b} = ${rhsTerm1}`,
                  positive: rhsTerm1 >= 0,
                },
                {
                  val: `${ex.a} × (${ex.c}) = ${rhsTerm2}`,
                  positive: rhsTerm2 >= 0,
                },
              ],
            },
            {
              expr: `${lhsResult}`,
              note: `Add: ${rhsTerm1} + (${rhsTerm2}) = ${lhsResult}`,
            },
          ],
          result: lhsResult,
        };
      })
    : EXAMPLES;

  // State
  const [exampleIndex, setExampleIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(-1);
  const [animPhase, setAnimPhase] = useState(0);
  const [showConfirmed, setShowConfirmed] = useState(false);
  const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);
  const [contentKey, setContentKey] = useState(0);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);
  const [showSignRule, setShowSignRule] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentExample = examples[exampleIndex] as any;
  const isIntro = stepIndex === -1;
  const isLastStepOfExample = stepIndex === 2;
  const isLastExample = exampleIndex === examples.length - 1;
  const isVeryEnd = isLastStepOfExample && isLastExample;

  // Inject Poppins + keyframes
  useEffect(() => {
    const keyframes = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeInDown { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 70% { transform: scale(1.12); } 100% { transform: scale(1); opacity: 1; } }
      @keyframes slideFromRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes slideFromLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes accentGlow {
        0%, 100% { text-shadow: 0 0 6px rgba(255,114,18,0.25); }
        50% { text-shadow: 0 0 18px rgba(255,114,18,0.6), 0 0 36px rgba(255,114,18,0.2); }
      }
      @keyframes confirmBounce {
        0% { transform: scale(0) rotate(-8deg); opacity: 0; }
        50% { transform: scale(1.1) rotate(2deg); }
        70% { transform: scale(0.96) rotate(-1deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes equalsGrow { from { transform: scaleY(0); opacity: 0; } to { transform: scaleY(1); opacity: 1; } }
      @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
      @keyframes signRuleGlow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(83,48,134,0.35); }
        50% { box-shadow: 0 0 0 7px rgba(83,48,134,0), 0 0 16px rgba(83,48,134,0.25); }
      }
      @keyframes floatShape { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      @keyframes rotateShape { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(8deg); } }
      @keyframes bannerSlide { from { transform: translateY(-16px) scale(0.85); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
      @keyframes stepPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(74,77,201,0.3); }
        50% { box-shadow: 0 0 0 5px rgba(74,77,201,0); }
      }
    `;
    const style = document.createElement("style");
    style.id = "dp-singularity-keyframes";
    style.textContent = keyframes;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById("dp-singularity-keyframes");
      if (el) document.head.removeChild(el);
    };
  }, []);

  // Step details callback
  useEffect(() => {
    if (setStepDetails) {
      const globalStep = exampleIndex * 4 + (stepIndex + 1);
      setStepDetails({
        currentStep: globalStep + 1,
        totalSteps: examples.length * 4,
        isPaused: true,
        currentMode: "learn",
      });
    }
  }, [exampleIndex, stepIndex, setStepDetails, examples.length]);

  // Animations on step change
  useEffect(() => {
    setAnimPhase(0);
    setShowConfirmed(false);
    setShowSignRule(false);
    const t1 = setTimeout(() => setAnimPhase(1), 200);
    const t2 = setTimeout(() => setAnimPhase(2), 600);
    let t3: any, t4: any;
    if (stepIndex === 2) {
      t3 = setTimeout(() => setShowConfirmed(true), 900);
    }
    if (
      stepIndex === 1 &&
      exampleIndex === 1 &&
      currentExample.signRuleHighlight
    ) {
      t4 = setTimeout(() => setShowSignRule(true), 750);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (t3) clearTimeout(t3);
      if (t4) clearTimeout(t4);
    };
  }, [stepIndex, exampleIndex, contentKey]);

  // Navigation
  const nextStep = useCallback(() => {
    if (completed) return;
    if (isIntro) {
      setStepIndex(0);
      setContentKey((k) => k + 1);
      return;
    }
    if (stepIndex < 2) {
      setStepIndex((s) => s + 1);
      setContentKey((k) => k + 1);
    } else if (!isLastExample) {
      setSlideDir("left");
      setTimeout(() => {
        setExampleIndex((i) => i + 1);
        setStepIndex(-1);
        setSlideDir(null);
        setContentKey((k) => k + 1);
      }, 380);
    } else {
      setCompleted(true);
    }
  }, [stepIndex, exampleIndex, isIntro, isLastExample, completed]);

  const prevStep = useCallback(() => {
    if (completed) {
      setCompleted(false);
      return;
    }
    if (isIntro && exampleIndex > 0) {
      setSlideDir("right");
      setTimeout(() => {
        setExampleIndex((i) => i - 1);
        setStepIndex(2);
        setSlideDir(null);
        setContentKey((k) => k + 1);
      }, 380);
      return;
    }
    if (stepIndex > -1) {
      setStepIndex((s) => s - 1);
      setContentKey((k) => k + 1);
    }
  }, [stepIndex, exampleIndex, isIntro, completed]);

  const reset = useCallback(() => {
    setExampleIndex(0);
    setStepIndex(-1);
    setCompleted(false);
    setContentKey((k) => k + 1);
  }, []);

  const canGoBack = stepIndex > -1 || exampleIndex > 0 || completed;
  const canGoForward = !completed;
  const fmt = (n: number) => (n < 0 ? `(${n})` : `${n}`);

  // ==================== SINGULARITY CONTAINED BUTTON ====================
  const renderContainedBtn = (
    id: string,
    label: string,
    onClick: () => void,
    variant: "primary" | "accent",
    disabled?: boolean,
    icon?: React.ReactNode,
  ) => (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHoveredBtn(id)}
      onMouseLeave={() => {
        setHoveredBtn(null);
        setPressedBtn(null);
      }}
      onMouseDown={() => !disabled && setPressedBtn(id)}
      onMouseUp={() => setPressedBtn(null)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: DS.spacing.sm,
        height: "40px",
        padding: `0 ${DS.spacing.lg}`,
        borderRadius: DS.radius.pill,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: DS.font,
        fontWeight: 600,
        fontSize: "14px",
        background: disabled
          ? DS.colors.gray200
          : variant === "primary"
            ? DS.colors.primary
            : DS.colors.accent,
        color: disabled ? DS.colors.gray400 : DS.colors.white,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        transform:
          pressedBtn === id
            ? "scale(0.96)"
            : hoveredBtn === id && !disabled
              ? "scale(1.03)"
              : "scale(1)",
        boxShadow:
          hoveredBtn === id && !disabled
            ? variant === "primary"
              ? DS.shadow.primary
              : DS.shadow.accent
            : "none",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon}
      {label}
    </button>
  );

  // ==================== SINGULARITY OUTLINED BUTTON ====================
  const renderOutlinedBtn = (
    id: string,
    label: string,
    onClick: () => void,
    disabled?: boolean,
    icon?: React.ReactNode,
  ) => (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHoveredBtn(id)}
      onMouseLeave={() => {
        setHoveredBtn(null);
        setPressedBtn(null);
      }}
      onMouseDown={() => !disabled && setPressedBtn(id)}
      onMouseUp={() => setPressedBtn(null)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: DS.spacing.sm,
        height: "40px",
        padding: `0 ${DS.spacing.lg}`,
        borderRadius: DS.radius.pill,
        border: `2px solid ${disabled ? DS.colors.gray400 : DS.colors.primary}`,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: DS.font,
        fontWeight: 600,
        fontSize: "14px",
        background:
          pressedBtn === id
            ? DS.colors.lightPurple
            : hoveredBtn === id
              ? "rgba(74,77,201,0.06)"
              : "transparent",
        color: disabled ? DS.colors.gray400 : DS.colors.primary,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        transform:
          pressedBtn === id
            ? "scale(0.96)"
            : hoveredBtn === id
              ? "scale(1.03)"
              : "scale(1)",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon}
      {label}
    </button>
  );

  // ==================== GEOMETRIC DECORATIONS ====================
  const DecoCircle = ({ size, x, y, color, delay }: any) => (
    <svg
      style={{
        position: "absolute" as const,
        top: y,
        right: x,
        width: size,
        height: size,
        animation: `floatShape ${2.5 + delay}s ease-in-out infinite ${delay}s`,
        opacity: 0.45,
      }}
      viewBox="0 0 40 40"
    >
      <circle
        cx="20"
        cy="20"
        r="16"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
    </svg>
  );
  const DecoTriangle = ({ size, x, y, color, delay }: any) => (
    <svg
      style={{
        position: "absolute" as const,
        top: y,
        left: x,
        width: size,
        height: size,
        animation: `rotateShape ${3 + delay}s ease-in-out infinite ${delay}s`,
        opacity: 0.35,
      }}
      viewBox="0 0 40 40"
    >
      <polygon
        points="20,4 36,36 4,36"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
    </svg>
  );
  const DecoSquare = ({ size, x, y, color, delay }: any) => (
    <svg
      style={{
        position: "absolute" as const,
        bottom: y,
        left: x,
        width: size,
        height: size,
        animation: `rotateShape ${3.5 + delay}s ease-in-out infinite ${delay}s`,
        opacity: 0.3,
        transform: "rotate(45deg)",
      }}
      viewBox="0 0 40 40"
    >
      <rect
        x="6"
        y="6"
        width="28"
        height="28"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
    </svg>
  );

  // ==================== FORMULA FOOTER ====================
  const renderFormulaFooter = () => (
    <div
      style={{
        background: `linear-gradient(135deg, ${DS.colors.primary} 0%, ${DS.colors.darkPurple} 100%)`,
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        borderTop: `3px solid ${DS.colors.accent}`,
      }}
    >
      <BookOpen size={16} color={DS.colors.lightOrange} />
      <span
        style={{
          fontFamily: DS.font,
          fontWeight: 700,
          fontSize: "clamp(13px, 2.2vw, 17px)",
          color: DS.colors.white,
          letterSpacing: "0.5px",
        }}
      >
        <span style={{ color: DS.colors.lightOrange }}>a</span>
        <span style={{ color: DS.colors.lightPurple }}> × (</span>
        <span style={{ color: DS.colors.successLight }}>b</span>
        <span style={{ color: DS.colors.lightPurple }}> + </span>
        <span style={{ color: "#FFCDD2" }}>c</span>
        <span style={{ color: DS.colors.lightPurple }}>) = </span>
        <span style={{ color: DS.colors.lightOrange }}>a</span>
        <span style={{ color: DS.colors.lightPurple }}> × </span>
        <span style={{ color: DS.colors.successLight }}>b</span>
        <span style={{ color: DS.colors.lightPurple }}> + </span>
        <span style={{ color: DS.colors.lightOrange }}>a</span>
        <span style={{ color: DS.colors.lightPurple }}> × </span>
        <span style={{ color: "#FFCDD2" }}>c</span>
      </span>
    </div>
  );

  // ==================== EXPRESSION BOX ====================
  const renderExprBox = (text: string, isResult?: boolean, delay?: number) => (
    <div
      style={{
        background: isResult ? DS.colors.lightPeach : DS.colors.white,
        border: `2px solid ${isResult ? DS.colors.accent : DS.colors.gray200}`,
        borderRadius: DS.radius.md,
        padding: "12px 20px",
        fontFamily: DS.font,
        fontWeight: 800,
        fontSize: "clamp(18px, 3.5vw, 28px)",
        color: isResult ? DS.colors.accent : DS.colors.black,
        textAlign: "center" as const,
        animation: `popIn 0.45s ease-out ${delay || 0}ms both${isResult ? ", accentGlow 2s ease-in-out infinite" : ""}`,
        whiteSpace: "nowrap" as const,
        minWidth: "90px",
        boxShadow: isResult ? DS.shadow.accent : DS.shadow.sm,
      }}
    >
      {text}
    </div>
  );

  // ==================== TERM BADGE ====================
  const renderTermBadge = (
    text: string,
    positive: boolean,
    isSignRule: boolean,
    delay: number,
  ) => (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: isSignRule
          ? "rgba(83,48,134,0.08)"
          : positive
            ? DS.colors.successLight
            : DS.colors.errorLight,
        border: `2px solid ${isSignRule ? DS.colors.darkPurple : positive ? DS.colors.success : DS.colors.error}`,
        borderRadius: DS.radius.sm,
        padding: "8px 14px",
        fontFamily: DS.font,
        fontWeight: 700,
        fontSize: "clamp(12px, 2vw, 15px)",
        color: isSignRule
          ? DS.colors.darkPurple
          : positive
            ? DS.colors.success
            : DS.colors.error,
        animation: `fadeInUp 0.4s ease-out ${delay}ms both${isSignRule ? ", signRuleGlow 1.5s ease-in-out infinite" : ""}`,
      }}
    >
      {isSignRule && <Sparkles size={14} color={DS.colors.darkPurple} />}
      {text}
    </div>
  );

  // ==================== INTRO SCREEN ====================
  const renderIntro = () => (
    <div
      key={`intro-${exampleIndex}-${contentKey}`}
      style={{
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        gap: "20px",
        padding: "32px 24px",
        animation: "fadeInUp 0.5s ease-out",
        textAlign: "center" as const,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: DS.colors.lightPeach,
          border: `2px solid ${DS.colors.accent}`,
          borderRadius: DS.radius.pill,
          padding: "6px 18px",
          animation: "popIn 0.45s ease-out 150ms both",
        }}
      >
        <Sparkles size={16} color={DS.colors.accent} />
        <span
          style={{
            fontFamily: DS.font,
            fontWeight: 700,
            fontSize: "15px",
            color: DS.colors.accent,
          }}
        >
          {currentExample.label}
        </span>
      </div>
      <div
        style={{
          fontFamily: DS.font,
          fontWeight: 800,
          fontSize: "clamp(20px, 4vw, 30px)",
          color: DS.colors.black,
          lineHeight: 1.35,
          animation: "fadeInUp 0.5s ease-out 250ms both",
        }}
      >
        Verify:{" "}
        <span style={{ color: DS.colors.accent }}>{fmt(currentExample.a)}</span>
        {" × ("}
        <span style={{ color: DS.colors.success }}>
          {fmt(currentExample.b)}
        </span>
        {" + "}
        <span style={{ color: DS.colors.error }}>{fmt(currentExample.c)}</span>
        {") = "}
        <span style={{ color: DS.colors.accent }}>{fmt(currentExample.a)}</span>
        {" × "}
        <span style={{ color: DS.colors.success }}>
          {fmt(currentExample.b)}
        </span>
        {" + "}
        <span style={{ color: DS.colors.accent }}>{fmt(currentExample.a)}</span>
        {" × "}
        <span style={{ color: DS.colors.error }}>{fmt(currentExample.c)}</span>
      </div>
      {currentExample.context && (
        <div
          style={{
            fontFamily: DS.font,
            fontSize: "clamp(13px, 2vw, 15px)",
            fontWeight: 500,
            color: DS.colors.gray900,
            maxWidth: "480px",
            lineHeight: 1.65,
            background: DS.colors.lightPeach,
            borderRadius: DS.radius.md,
            padding: "14px 18px",
            borderLeft: `4px solid ${DS.colors.accent}`,
            animation: "fadeInUp 0.5s ease-out 450ms both",
            textAlign: "left" as const,
          }}
        >
          🪔 {currentExample.context}
        </div>
      )}
      <div
        style={{
          fontFamily: DS.font,
          fontSize: "14px",
          fontWeight: 500,
          color: DS.colors.gray400,
          animation: "fadeInUp 0.5s ease-out 600ms both",
        }}
      >
        We will compute both sides simultaneously. Will they match?
      </div>
    </div>
  );

  // ==================== STEP SCREEN ====================
  const renderStep = () => {
    const lhs = currentExample.lhsSteps[stepIndex];
    const rhs = currentExample.rhsSteps[stepIndex];
    const isConfirmStep = stepIndex === 2;

    return (
      <div
        key={`step-${exampleIndex}-${stepIndex}-${contentKey}`}
        style={{
          display: "flex",
          flexDirection: "column" as const,
          gap: "14px",
          padding: "18px 16px",
          animation: "fadeIn 0.3s ease-out",
        }}
      >
        {/* Step badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: DS.colors.primary,
              borderRadius: DS.radius.pill,
              padding: "5px 16px",
              animation: "fadeInDown 0.35s ease-out",
            }}
          >
            <span
              style={{
                fontFamily: DS.font,
                fontWeight: 600,
                fontSize: "12px",
                color: DS.colors.lightOrange,
              }}
            >
              {currentExample.label}
            </span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
              •
            </span>
            <span
              style={{
                fontFamily: DS.font,
                fontWeight: 600,
                fontSize: "12px",
                color: DS.colors.white,
              }}
            >
              Step {stepIndex + 1} / 3
            </span>
          </div>
        </div>

        {/* Two-column layout */}
        <div
          style={{
            display: "flex",
            gap: "0",
            alignItems: "stretch",
            overflowX: "auto" as const,
            WebkitOverflowScrolling: "touch" as any,
          }}
        >
          {/* LHS */}
          <div
            style={{
              flex: 1,
              minWidth: "210px",
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              gap: "12px",
              padding: "18px 12px",
              background: `linear-gradient(180deg, rgba(74,77,201,0.04) 0%, ${DS.colors.white} 100%)`,
              borderRadius: `${DS.radius.lg} 0 0 ${DS.radius.lg}`,
              border: `2px solid ${DS.colors.gray200}`,
              borderRight: "none",
              animation: "slideFromLeft 0.45s ease-out",
            }}
          >
            <div
              style={{
                fontFamily: DS.font,
                fontWeight: 700,
                fontSize: "11px",
                color: DS.colors.primary,
                textTransform: "uppercase" as const,
                letterSpacing: "1.5px",
                background: "rgba(74,77,201,0.08)",
                padding: "3px 12px",
                borderRadius: DS.radius.pill,
              }}
            >
              LHS
            </div>
            {renderExprBox(lhs.expr, isConfirmStep, 150)}
            {lhs.highlight && animPhase >= 1 && (
              <div
                style={{
                  background: DS.colors.lightPeach,
                  border: `2px dashed ${DS.colors.accent}`,
                  borderRadius: DS.radius.sm,
                  padding: "7px 14px",
                  fontFamily: DS.font,
                  fontWeight: 700,
                  fontSize: "clamp(13px, 2.2vw, 16px)",
                  color: DS.colors.accent,
                  animation: "popIn 0.45s ease-out",
                }}
              >
                {lhs.highlight}
              </div>
            )}
            <div
              style={{
                fontFamily: DS.font,
                fontSize: "12px",
                fontWeight: 500,
                color: DS.colors.gray900,
                textAlign: "center" as const,
                animation: "fadeIn 0.4s ease-out 350ms both",
                maxWidth: "190px",
                lineHeight: 1.4,
              }}
            >
              {lhs.note}
            </div>
          </div>

          {/* Equals divider */}
          <div
            style={{
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              justifyContent: "center",
              padding: "0 5px",
              background: DS.colors.gray100,
              minWidth: "40px",
            }}
          >
            <div
              style={{
                width: isConfirmStep && showConfirmed ? "5px" : "3px",
                height: isConfirmStep && showConfirmed ? "70px" : "50px",
                background:
                  isConfirmStep && showConfirmed
                    ? `linear-gradient(180deg, ${DS.colors.success}, ${DS.colors.primary})`
                    : DS.colors.gray400,
                borderRadius: "3px",
                transition: "all 0.5s ease",
                animation:
                  isConfirmStep && showConfirmed
                    ? "equalsGrow 0.5s ease-out"
                    : "none",
              }}
            />
            <div
              style={{
                fontFamily: DS.font,
                fontWeight: 900,
                fontSize: isConfirmStep && showConfirmed ? "26px" : "20px",
                color:
                  isConfirmStep && showConfirmed
                    ? DS.colors.success
                    : DS.colors.gray400,
                margin: "3px 0",
                transition: "all 0.5s ease",
                animation:
                  isConfirmStep && showConfirmed
                    ? "pulse 1s ease-in-out infinite"
                    : "none",
              }}
            >
              =
            </div>
            <div
              style={{
                width: isConfirmStep && showConfirmed ? "5px" : "3px",
                height: isConfirmStep && showConfirmed ? "70px" : "50px",
                background:
                  isConfirmStep && showConfirmed
                    ? `linear-gradient(180deg, ${DS.colors.primary}, ${DS.colors.success})`
                    : DS.colors.gray400,
                borderRadius: "3px",
                transition: "all 0.5s ease",
              }}
            />
          </div>

          {/* RHS */}
          <div
            style={{
              flex: 1,
              minWidth: "210px",
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              gap: "12px",
              padding: "18px 12px",
              background: `linear-gradient(180deg, rgba(255,114,18,0.04) 0%, ${DS.colors.white} 100%)`,
              borderRadius: `0 ${DS.radius.lg} ${DS.radius.lg} 0`,
              border: `2px solid ${DS.colors.gray200}`,
              borderLeft: "none",
              animation: "slideFromRight 0.45s ease-out",
            }}
          >
            <div
              style={{
                fontFamily: DS.font,
                fontWeight: 700,
                fontSize: "11px",
                color: DS.colors.accent,
                textTransform: "uppercase" as const,
                letterSpacing: "1.5px",
                background: "rgba(255,114,18,0.08)",
                padding: "3px 12px",
                borderRadius: DS.radius.pill,
              }}
            >
              RHS
            </div>
            {renderExprBox(rhs.expr, isConfirmStep, 250)}
            {rhs.terms && animPhase >= 1 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column" as const,
                  gap: "7px",
                  animation: "fadeInUp 0.35s ease-out",
                }}
              >
                {rhs.terms.map((term: any, i: number) => (
                  <React.Fragment key={i}>
                    {renderTermBadge(
                      term.val,
                      term.positive,
                      !!term.signRule,
                      i * 180,
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
            <div
              style={{
                fontFamily: DS.font,
                fontSize: "12px",
                fontWeight: 500,
                color: DS.colors.gray900,
                textAlign: "center" as const,
                animation: "fadeIn 0.4s ease-out 450ms both",
                maxWidth: "190px",
                lineHeight: 1.4,
              }}
            >
              {rhs.note}
            </div>
          </div>
        </div>

        {/* Sign Rule callout */}
        {showSignRule && currentExample.signRuleHighlight && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              background: "rgba(83,48,134,0.06)",
              border: `2px solid ${DS.colors.darkPurple}`,
              borderRadius: DS.radius.md,
              padding: "11px 18px",
              margin: "0 12px",
              animation: "confirmBounce 0.55s ease-out",
            }}
          >
            <Sparkles size={18} color={DS.colors.darkPurple} />
            <span
              style={{
                fontFamily: DS.font,
                fontWeight: 700,
                fontSize: "clamp(12px, 2vw, 15px)",
                color: DS.colors.darkPurple,
              }}
            >
              {currentExample.signRuleHighlight}
            </span>
          </div>
        )}

        {/* Property Confirmed banner */}
        {isConfirmStep && showConfirmed && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              background: `linear-gradient(135deg, ${DS.colors.primary} 0%, ${DS.colors.darkPurple} 100%)`,
              borderRadius: DS.radius.md,
              padding: "13px 22px",
              margin: "0 12px",
              animation: "bannerSlide 0.55s ease-out",
              boxShadow: DS.shadow.primary,
            }}
          >
            <CheckCircle size={20} color={DS.colors.lightOrange} />
            <span
              style={{
                fontFamily: DS.font,
                fontWeight: 700,
                fontSize: "clamp(14px, 2.8vw, 20px)",
                color: DS.colors.white,
              }}
            >
              Property Confirmed!
            </span>
            <span
              style={{
                fontFamily: DS.font,
                fontWeight: 800,
                fontSize: "clamp(14px, 2.8vw, 20px)",
                color: DS.colors.lightOrange,
              }}
            >
              LHS = RHS = {currentExample.result}
            </span>
          </div>
        )}
      </div>
    );
  };

  // ==================== COMPLETED SCREEN ====================
  const renderCompleted = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        gap: "18px",
        padding: "36px 24px",
        animation: "fadeInUp 0.5s ease-out",
        textAlign: "center" as const,
      }}
    >
      <div style={{ animation: "popIn 0.45s ease-out", fontSize: "44px" }}>
        🎉
      </div>
      <div
        style={{
          fontFamily: DS.font,
          fontWeight: 800,
          fontSize: "clamp(20px, 3.5vw, 28px)",
          color: DS.colors.primary,
          animation: "fadeInUp 0.5s ease-out 150ms both",
        }}
      >
        Distributive Property Verified!
      </div>
      <div
        style={{
          fontFamily: DS.font,
          fontSize: "15px",
          fontWeight: 500,
          color: DS.colors.gray900,
          maxWidth: "460px",
          lineHeight: 1.7,
          animation: "fadeInUp 0.5s ease-out 300ms both",
        }}
      >
        Both examples confirm that{" "}
        <strong style={{ color: DS.colors.primary }}>
          a × (b + c) = a × b + a × c
        </strong>{" "}
        works for integers — even when a, b, or c are negative! The sign rules
        you learned earlier are actively used inside this property.
      </div>
      <div
        style={{
          background: DS.colors.lightPeach,
          border: `2px solid ${DS.colors.accent}`,
          borderRadius: DS.radius.md,
          padding: "14px 22px",
          animation: "fadeInUp 0.5s ease-out 500ms both",
          maxWidth: "460px",
        }}
      >
        <div
          style={{
            fontFamily: DS.font,
            fontWeight: 700,
            fontSize: "15px",
            color: DS.colors.accent,
            marginBottom: "5px",
          }}
        >
          📝 Your Turn!
        </div>
        <div
          style={{
            fontFamily: DS.font,
            fontSize: "14px",
            fontWeight: 500,
            color: DS.colors.black,
            lineHeight: 1.55,
          }}
        >
          Can you verify the distributive property for{" "}
          <strong style={{ color: DS.colors.darkPurple }}>
            (−4) × (2 + (−3))
          </strong>{" "}
          in your notebook?
        </div>
      </div>
    </div>
  );

  // ==================== MAIN RENDER ====================
  const progressPercent =
    ((exampleIndex * 4 + (stepIndex + 2)) / (examples.length * 4)) * 100;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: `${config.width}px`,
        margin: "0 auto",
        background: DS.colors.white,
        borderRadius: DS.radius.xl,
        overflow: "hidden",
        boxShadow: DS.shadow.lg,
        fontFamily: DS.font,
        position: "relative" as const,
      }}
    >
      {/* ─── HEADER ─── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.colors.primary} 0%, ${DS.colors.darkPurple} 100%)`,
          padding: "20px 24px 16px",
          position: "relative" as const,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute" as const,
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: `linear-gradient(90deg, ${DS.colors.accent}, ${DS.colors.lightOrange})`,
          }}
        />
        <DecoCircle
          size={28}
          x="20px"
          y="8px"
          color={DS.colors.lightPurple}
          delay={0}
        />
        <DecoTriangle
          size={24}
          x="auto"
          y="6px"
          color={DS.colors.lightOrange}
          delay={0.4}
        />
        <DecoSquare
          size={20}
          x="60px"
          y="4px"
          color={DS.colors.lightPurple}
          delay={0.8}
        />

        <div
          style={{
            fontFamily: DS.font,
            fontWeight: 800,
            fontSize: "clamp(16px, 3.2vw, 22px)",
            color: DS.colors.white,
            marginBottom: "3px",
            position: "relative" as const,
            zIndex: 1,
          }}
        >
          Distributive Property Explorer
        </div>
        <div
          style={{
            fontFamily: DS.font,
            fontSize: "12px",
            fontWeight: 500,
            color: DS.colors.lightPurple,
            position: "relative" as const,
            zIndex: 1,
          }}
        >
          Ganita Prakash · Grade 7 · Chapter 2: Operations with Integers
        </div>

        {/* Progress bar */}
        <div
          style={{
            marginTop: "12px",
            height: "4px",
            background: "rgba(255,255,255,0.12)",
            borderRadius: "2px",
            overflow: "hidden",
            position: "relative" as const,
            zIndex: 1,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${completed ? 100 : progressPercent}%`,
              background: `linear-gradient(90deg, ${DS.colors.accent}, ${DS.colors.lightOrange})`,
              borderRadius: "2px",
              transition: "width 0.5s ease-out",
            }}
          />
        </div>

        {/* Step indicators */}
        {config.showStepIndicator && (
          <div
            style={{
              display: "flex",
              gap: "6px",
              justifyContent: "center",
              marginTop: "10px",
              position: "relative" as const,
              zIndex: 1,
            }}
          >
            {examples.map((_: any, ei: number) => (
              <React.Fragment key={ei}>
                {[...Array(4)].map((__, si) => {
                  const globalIdx = ei * 4 + si;
                  const currentGlobal = exampleIndex * 4 + (stepIndex + 1);
                  const isCurrent = globalIdx === currentGlobal && !completed;
                  const isDone = globalIdx < currentGlobal || completed;
                  return (
                    <div
                      key={si}
                      style={{
                        width: isCurrent ? "24px" : "8px",
                        height: "8px",
                        borderRadius: DS.radius.pill,
                        background: isCurrent
                          ? DS.colors.white
                          : isDone
                            ? "rgba(255,255,255,0.5)"
                            : "rgba(255,255,255,0.18)",
                        transition: "all 0.35s ease",
                        animation: isCurrent
                          ? "stepPulse 1.5s ease-in-out infinite"
                          : "none",
                      }}
                    />
                  );
                })}
                {ei < examples.length - 1 && (
                  <div
                    style={{
                      width: "2px",
                      height: "8px",
                      background: "rgba(255,255,255,0.15)",
                      borderRadius: "1px",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* ─── CONTENT ─── */}
      <div
        style={{
          minHeight: "360px",
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "center",
          opacity: slideDir ? 0 : 1,
          transform:
            slideDir === "left"
              ? "translateX(-35px)"
              : slideDir === "right"
                ? "translateX(35px)"
                : "translateX(0)",
          transition: "all 0.35s ease",
        }}
      >
        {completed ? renderCompleted() : isIntro ? renderIntro() : renderStep()}
      </div>

      {/* ─── NAVIGATION ─── */}
      {config.showNavigation && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 24px",
            background: DS.colors.gray100,
            borderTop: `1px solid ${DS.colors.gray200}`,
          }}
        >
          {canGoBack ? (
            renderOutlinedBtn(
              "prev",
              "Back",
              prevStep,
              false,
              <ChevronLeft size={16} />,
            )
          ) : (
            <div style={{ width: "90px" }} />
          )}

          {renderOutlinedBtn(
            "reset",
            "",
            reset,
            false,
            <RotateCcw size={15} />,
          )}

          {canGoForward ? (
            renderContainedBtn(
              "next",
              isIntro ? "Let's Begin!" : isVeryEnd ? "Finish" : "Next Step",
              nextStep,
              isVeryEnd ? "accent" : "primary",
              false,
              <ChevronRight size={16} />,
            )
          ) : (
            <div style={{ width: "120px" }} />
          )}
        </div>
      )}

      {/* ─── FORMULA FOOTER ─── */}
      {renderFormulaFooter()}
    </div>
  );
};

export default DistributivePropertyExplorer;
