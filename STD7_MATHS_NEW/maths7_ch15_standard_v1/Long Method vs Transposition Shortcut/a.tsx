/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Module resolution for 'react' and 'lucide-react' provided by project/workspace
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  BookOpen,
  Target,
  Zap,
  Star,
  Award,
} from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "explore";

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
  type: "intro" | "explanation" | "practice" | "explore";
  mode: ModeType;
  data?: any;
}
interface BaseDataInterface {
  themeColor?: string;
  autoPlayDuration?: number;
}
interface EquationStep {
  step: string;
  explanation: string;
}
interface EquationExample {
  equation: string;
  fullSteps: EquationStep[];
  shortcutSteps: EquationStep[];
  variable: string;
  answer: string;
  observation: "additive_inverse" | "division" | "multiplication";
}
interface EquationSolvingAdditionalProps {
  equations?: EquationExample[];
  showBothMethods?: boolean;
  highlightTransposition?: boolean;
  animationDelay?: number;
}

interface EquationSolvingToolProps {
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
    additionalProps?: EquationSolvingAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DESIGN SYSTEM TOKENS (from Singularity PDF) ====================

const DS = {
  primary: "#4A4DC9",
  accent: "#FF7212",
  gradStart: "#533086",
  gradEnd: "#FC9145",
  lavender: "#C1C1EA",
  peach: "#FFF3E4",
  lavenderLight: "#EEEDF7",
  peachLight: "#FFF9F2",
  gray900: "#4E4E4E",
  gray400: "#CACACA",
  gray200: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",
  fullMethod: "#533086",
  shortMethod: "#FF7212",
  success: "#2DB574",
  error: "#E5453F",
  font: "'Poppins', 'Segoe UI', system-ui, sans-serif",
  radius: 40,
  radiusSm: 12,
  radiusMd: 16,
  radiusLg: 24,
  gradient: "linear-gradient(135deg, #533086 0%, #FC9145 100%)",
  gradientSubtle:
    "linear-gradient(135deg, #533086 0%, #4A4DC9 50%, #FC9145 100%)",
};

// ==================== CUSTOM MATH RENDERER ====================

const MathText: React.FC<{
  tex: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ tex, fontSize = 16, style = {} }) => {
  const parseMath = (input: string): React.ReactNode => {
    let s = input.trim();
    const fracRegex = /\\d?frac\{([^{}]+)\}\{([^{}]+)\}/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let kc = 0;
    let hasFrac = false;
    const tmp = s;
    while ((match = fracRegex.exec(tmp)) !== null) {
      hasFrac = true;
      if (match.index > lastIndex)
        parts.push(
          <span key={`t-${kc++}`}>
            {renderSimple(tmp.slice(lastIndex, match.index))}
          </span>,
        );
      parts.push(
        <span
          key={`f-${kc++}`}
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            verticalAlign: "middle",
            margin: "0 4px",
            lineHeight: 1.15,
          }}
        >
          <span
            style={{
              borderBottom: `1.8px solid currentColor`,
              padding: "0 5px 2px",
              fontSize: fontSize * 0.88,
            }}
          >
            {renderSimple(match[1])}
          </span>
          <span style={{ padding: "2px 5px 0", fontSize: fontSize * 0.88 }}>
            {renderSimple(match[2])}
          </span>
        </span>,
      );
      lastIndex = match.index + match[0].length;
    }
    if (hasFrac) {
      if (lastIndex < tmp.length)
        parts.push(
          <span key={`t-${kc++}`}>{renderSimple(tmp.slice(lastIndex))}</span>,
        );
      return <>{parts}</>;
    }
    return renderSimple(s);
  };

  const renderSimple = (s: string): React.ReactNode => {
    let r = s
      .replace(/\\times/g, "×")
      .replace(/\\div/g, "÷")
      .replace(/\\cdot/g, "·")
      .replace(/\\pm/g, "±")
      .replace(/\\Longrightarrow/g, "⟹")
      .replace(/\\Rightarrow/g, "⇒")
      .replace(/\\rightarrow/g, "→")
      .replace(/\\;/g, " ")
      .replace(/\\,/g, " ")
      .replace(/\\!/g, "")
      .replace(/\\quad/g, "  ")
      .replace(/\\text\{([^}]*)\}/g, "$1")
      .replace(/\\left/g, "")
      .replace(/\\right/g, "")
      .replace(/\\bigg?/g, "")
      .replace(/\\\(/g, "(")
      .replace(/\\\)/g, ")")
      .replace(/\\{/g, "{")
      .replace(/\\}/g, "}");
    interface Tk {
      type: "v" | "n" | "o" | "t";
      value: string;
    }
    const tokens: Tk[] = [];
    let i = 0;
    while (i < r.length) {
      const ch = r[i];
      if (
        /[0-9]/.test(ch) ||
        (ch === "-" &&
          i + 1 < r.length &&
          /[0-9]/.test(r[i + 1]) &&
          (i === 0 || /[=+\-×÷(, ]/.test(r[i - 1])))
      ) {
        let num = ch;
        i++;
        while (i < r.length && /[0-9.]/.test(r[i])) {
          num += r[i];
          i++;
        }
        tokens.push({ type: "n", value: num });
        continue;
      }
      if (/[a-zA-Z]/.test(ch)) {
        tokens.push({ type: "v", value: ch });
        i++;
        continue;
      }
      if ("=+-×÷·±⟹⇒→()".includes(ch)) {
        tokens.push({ type: "o", value: ch });
        i++;
        continue;
      }
      tokens.push({ type: "t", value: ch });
      i++;
    }
    return (
      <>
        {tokens.map((tk, i) => {
          if (tk.type === "v")
            return (
              <span
                key={i}
                style={{
                  fontStyle: "italic",
                  fontWeight: 600,
                  color: DS.primary,
                }}
              >
                {tk.value}
              </span>
            );
          if (tk.type === "o")
            return (
              <span
                key={i}
                style={{ margin: "0 2px", opacity: 0.8, fontWeight: 500 }}
              >
                {tk.value}
              </span>
            );
          if (tk.type === "n")
            return (
              <span key={i} style={{ fontWeight: 700 }}>
                {tk.value}
              </span>
            );
          return <span key={i}>{tk.value}</span>;
        })}
      </>
    );
  };

  return (
    <span
      style={{
        fontFamily: "'Cambria Math', 'Latin Modern Math', Georgia, serif",
        fontSize,
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        flexWrap: "wrap",
        justifyContent: "center",
        letterSpacing: 0.3,
        ...style,
      }}
    >
      {parseMath(tex)}
    </span>
  );
};

const MathBlock: React.FC<{
  tex: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ tex, fontSize = 18, style = {} }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "4px 0",
      ...style,
    }}
  >
    <MathText tex={tex} fontSize={fontSize} />
  </div>
);

// ==================== DEFAULT EQUATIONS ====================

const DEFAULT_EQUATIONS: EquationExample[] = [
  {
    equation: "2y + 7 = 21",
    variable: "y",
    answer: "7",
    observation: "additive_inverse",
    fullSteps: [
      { step: "2y + 7 = 21", explanation: "Start with the equation" },
      {
        step: "2y + 7 - 7 = 21 - 7",
        explanation: "Subtract 7 from both sides",
      },
      { step: "2y = 14", explanation: "Simplify both sides" },
      {
        step: "2y \\div 2 = 14 \\div 2",
        explanation: "Divide both sides by 2",
      },
      { step: "y = 7", explanation: "Solution found!" },
    ],
    shortcutSteps: [
      { step: "2y + 7 = 21", explanation: "Start with the equation" },
      {
        step: "2y = 21 - 7",
        explanation: "+7 moves to RHS as −7 (transposition)",
      },
      { step: "2y = 14", explanation: "Simplify" },
      {
        step: "y = 14 \\div 2",
        explanation: "×2 moves to RHS as ÷2 (transposition)",
      },
      { step: "y = 7", explanation: "Solution found!" },
    ],
  },
  {
    equation: "11y + (-5) = 61",
    variable: "y",
    answer: "6",
    observation: "additive_inverse",
    fullSteps: [
      { step: "11y + (-5) = 61", explanation: "Start with the equation" },
      {
        step: "11y + (-5) - (-5) = 61 - (-5)",
        explanation: "Subtract (−5) from both sides",
      },
      { step: "11y = 66", explanation: "Simplify both sides" },
      {
        step: "11y \\div 11 = 66 \\div 11",
        explanation: "Divide both sides by 11",
      },
      { step: "y = 6", explanation: "Solution found!" },
    ],
    shortcutSteps: [
      { step: "11y + (-5) = 61", explanation: "Start with the equation" },
      { step: "11y = 61 - (-5)", explanation: "+(−5) transposes to −(−5)" },
      { step: "11y = 66", explanation: "Simplify" },
      { step: "y = 66 \\div 11", explanation: "×11 transposes to ÷11" },
      { step: "y = 6", explanation: "Solution found!" },
    ],
  },
  {
    equation: "5x - 4 = 7",
    variable: "x",
    answer: "11/5",
    observation: "additive_inverse",
    fullSteps: [
      { step: "5x - 4 = 7", explanation: "Start with the equation" },
      { step: "5x - 4 + 4 = 7 + 4", explanation: "Add 4 to both sides" },
      { step: "5x = 11", explanation: "Simplify both sides" },
      {
        step: "\\dfrac{5x}{5} = \\dfrac{11}{5}",
        explanation: "Divide both sides by 5",
      },
      { step: "x = \\dfrac{11}{5}", explanation: "Solution found!" },
    ],
    shortcutSteps: [
      { step: "5x - 4 = 7", explanation: "Start with the equation" },
      { step: "5x = 7 + 4", explanation: "−4 transposes to +4" },
      { step: "5x = 11", explanation: "Simplify" },
      { step: "x = \\dfrac{11}{5}", explanation: "×5 transposes to ÷5" },
      { step: "x = \\dfrac{11}{5}", explanation: "Solution found!" },
    ],
  },
  {
    equation: "\\dfrac{u}{15} = 6",
    variable: "u",
    answer: "90",
    observation: "multiplication",
    fullSteps: [
      { step: "\\dfrac{u}{15} = 6", explanation: "Start with the equation" },
      {
        step: "\\dfrac{u}{15} \\times 15 = 6 \\times 15",
        explanation: "Multiply both sides by 15",
      },
      { step: "u = 90", explanation: "Solution found!" },
    ],
    shortcutSteps: [
      { step: "\\dfrac{u}{15} = 6", explanation: "Start with the equation" },
      { step: "u = 6 \\times 15", explanation: "÷15 transposes to ×15" },
      { step: "u = 90", explanation: "Solution found!" },
    ],
  },
  {
    equation: "6y + 7 = 4y + 21",
    variable: "y",
    answer: "7",
    observation: "additive_inverse",
    fullSteps: [
      { step: "6y + 7 = 4y + 21", explanation: "Start with the equation" },
      {
        step: "6y + 7 - 4y = 4y + 21 - 4y",
        explanation: "Subtract 4y from both sides",
      },
      { step: "2y + 7 = 21", explanation: "Simplify both sides" },
      {
        step: "2y + 7 - 7 = 21 - 7",
        explanation: "Subtract 7 from both sides",
      },
      { step: "2y = 14", explanation: "Simplify both sides" },
      {
        step: "2y \\div 2 = 14 \\div 2",
        explanation: "Divide both sides by 2",
      },
      { step: "y = 7", explanation: "Solution found!" },
    ],
    shortcutSteps: [
      { step: "6y + 7 = 4y + 21", explanation: "Start with the equation" },
      { step: "6y - 4y + 7 = 21", explanation: "+4y transposes to −4y" },
      { step: "2y + 7 = 21", explanation: "Simplify" },
      { step: "2y = 21 - 7", explanation: "+7 transposes to −7" },
      { step: "2y = 14", explanation: "Simplify" },
      { step: "y = 14 \\div 2", explanation: "×2 transposes to ÷2" },
      { step: "y = 7", explanation: "Solution found!" },
    ],
  },
];

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
  {
    id: 1,
    title: "Three Key Observations",
    description:
      "When solving equations, we can make the process faster by understanding three powerful observations about how terms and factors move across the equals sign.",
    type: "intro",
    mode: "learn",
  },
  {
    id: 2,
    title: "Observation (a): Additive Inverse",
    description:
      "When a term added or subtracted on one side is removed, its additive inverse appears on the other side. Example: 2y + 7 = 21 becomes 2y = 21 − 7.",
    type: "explanation",
    mode: "learn",
    data: { observation: "a", equationIndex: 0 },
  },
  {
    id: 3,
    title: "Observation (b): Division Shortcut",
    description:
      "If one side is a product and we remove a factor, the other side is divided by that factor. Example: 2y = 14 becomes y = 14 ÷ 2.",
    type: "explanation",
    mode: "learn",
    data: { observation: "b", equationIndex: 0 },
  },
  {
    id: 4,
    title: "Observation (c): Multiplication Shortcut",
    description:
      "If one side is a quotient and we remove the divisor, the other side is multiplied by it. Example: u/15 = 6 becomes u = 6 × 15.",
    type: "explanation",
    mode: "learn",
    data: { observation: "c", equationIndex: 3 },
  },
  {
    id: 5,
    title: "Side-by-Side: 2y + 7 = 21",
    description:
      "Watch both methods solve the same equation. The transposition shortcut skips writing the inverse operation on both sides!",
    type: "explanation",
    mode: "learn",
    data: { equationIndex: 0, comparison: true },
  },
  {
    id: 6,
    title: "Side-by-Side: 11y + (−5) = 61",
    description:
      "Handling negative terms — see how transposition handles the sign change automatically.",
    type: "explanation",
    mode: "learn",
    data: { equationIndex: 1, comparison: true },
  },
  {
    id: 7,
    title: "Side-by-Side: 6y + 7 = 4y + 21",
    description:
      "When unknowns are on both sides, transposition moves them efficiently to one side.",
    type: "explanation",
    mode: "learn",
    data: { equationIndex: 4, comparison: true },
  },
  {
    id: 10,
    title: "Solve: 3x − 10 = 35",
    description:
      "Use transposition to solve. Move −10 to the right, then divide.",
    type: "practice",
    mode: "practice",
    data: { practiceEquation: "3x - 10 = 35", answer: 15, variable: "x" },
  },
  {
    id: 11,
    title: "Solve: 4(m + 6) − 8 = 2m − 4",
    description: "Expand brackets first, then use transposition to isolate m.",
    type: "practice",
    mode: "practice",
    data: {
      practiceEquation: "4(m + 6) - 8 = 2m - 4",
      answer: -10,
      variable: "m",
    },
  },
  {
    id: 12,
    title: "Solve: u/15 = 6",
    description:
      "Use the multiplication shortcut — the divisor transposes as a multiplier.",
    type: "practice",
    mode: "practice",
    data: { practiceEquation: "u/15 = 6", answer: 90, variable: "u" },
  },
  {
    id: 20,
    title: "Explore Any Equation",
    description:
      "Pick an equation and watch both solving methods animated side by side.",
    type: "explore",
    mode: "explore",
    data: { explorer: true },
  },
];

// ==================== MAIN COMPONENT ====================

type PropsShape = NonNullable<EquationSolvingToolProps["props"]>;
const EquationSolvingEfficiencyTool: React.FC<EquationSolvingToolProps> = ({
  props = {} as PropsShape,
  setStepDetails,
  stopAutoNext,
  setStopAutoNext,
}) => {
  const {
    width = 800,
    height = 600,
    initialMode = "learn",
    showModeSelector = true,
    enabledModes = ["learn", "practice", "explore"],
    showNavigation = true,
    showStepIndicator = true,
    autoPlayDuration = 0,
    darkMode = false,
  } = props;

  const additionalProps = (props.additionalProps ||
    {}) as EquationSolvingAdditionalProps;
  const equations = additionalProps.equations || DEFAULT_EQUATIONS;
  const allSteps = props.steps || DEFAULT_STEPS;

  const [currentMode, setCurrentMode] = useState<ModeType>(initialMode);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [revealedFullSteps, setRevealedFullSteps] = useState(1);
  const [revealedShortSteps, setRevealedShortSteps] = useState(1);
  const [practiceInput, setPracticeInput] = useState("");
  const [practiceResult, setPracticeResult] = useState<
    "correct" | "wrong" | null
  >(null);
  const [explorerIndex, setExplorerIndex] = useState(0);
  const [hoverBtn, setHoverBtn] = useState<string | null>(null);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredSteps = useMemo(() => {
    let s = allSteps.filter((st) => st.mode === currentMode);
    if (props.filterSteps)
      s = s.filter((st) => props.filterSteps!.includes(st.id));
    return s;
  }, [allSteps, currentMode, props.filterSteps]);
  const currentStep = filteredSteps[currentStepIndex] || filteredSteps[0];

  useEffect(() => {
    if (setStepDetails && currentStep)
      setStepDetails({
        currentStep: currentStepIndex,
        totalSteps: filteredSteps.length,
        isPaused,
        currentMode,
      });
  }, [currentStepIndex, filteredSteps.length, isPaused, currentMode]);
  useEffect(() => {
    setCurrentStepIndex(0);
    setRevealedFullSteps(1);
    setRevealedShortSteps(1);
    setPracticeResult(null);
    setPracticeInput("");
  }, [currentMode]);
  useEffect(() => {
    setRevealedFullSteps(1);
    setRevealedShortSteps(1);
    setPracticeResult(null);
    setPracticeInput("");
  }, [currentStepIndex]);

  useEffect(() => {
    if (!isPaused && autoPlayDuration > 0 && !stopAutoNext) {
      autoRef.current = setTimeout(() => {
        if (currentStepIndex < filteredSteps.length - 1)
          setCurrentStepIndex((i) => i + 1);
        else setIsPaused(true);
      }, autoPlayDuration);
    }
    return () => {
      if (autoRef.current) clearTimeout(autoRef.current);
    };
  }, [
    isPaused,
    currentStepIndex,
    autoPlayDuration,
    stopAutoNext,
    filteredSteps.length,
  ]);

  const goNext = useCallback(() => {
    if (currentStepIndex < filteredSteps.length - 1)
      setCurrentStepIndex((i) => i + 1);
  }, [currentStepIndex, filteredSteps.length]);
  const goPrev = useCallback(() => {
    if (currentStepIndex > 0) setCurrentStepIndex((i) => i - 1);
  }, [currentStepIndex]);

  const revealNextStep = useCallback(() => {
    const eqI = currentStep?.data?.equationIndex ?? explorerIndex;
    const eq = equations[eqI];
    if (!eq) return;
    if (revealedFullSteps < eq.fullSteps.length)
      setRevealedFullSteps((r) => r + 1);
    if (revealedShortSteps < eq.shortcutSteps.length)
      setRevealedShortSteps((r) => r + 1);
  }, [
    currentStep,
    explorerIndex,
    equations,
    revealedFullSteps,
    revealedShortSteps,
  ]);

  const revealAll = useCallback(() => {
    const eqI = currentStep?.data?.equationIndex ?? explorerIndex;
    const eq = equations[eqI];
    if (!eq) return;
    setRevealedFullSteps(eq.fullSteps.length);
    setRevealedShortSteps(eq.shortcutSteps.length);
  }, [currentStep, explorerIndex, equations]);

  // ==================== INJECT KEYFRAMES & FONT ====================
  useEffect(() => {
    const id = "singularity-eq-kf";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
            @keyframes sgFadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
            @keyframes sgFadeLeft{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
            @keyframes sgFadeRight{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
            @keyframes sgPop{0%{transform:scale(.65);opacity:0}70%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
            @keyframes sgPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
            @keyframes sgGlow{0%,100%{box-shadow:0 0 10px 0 rgba(74,77,201,.15)}50%{box-shadow:0 0 24px 6px rgba(74,77,201,.3)}}
            @keyframes sgBounce{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}
            @keyframes sgFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
            @keyframes sgSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        `;
    document.head.appendChild(el);
    return () => {
      const x = document.getElementById(id);
      if (x) document.head.removeChild(x);
    };
  }, []);

  // ==================== PILL BUTTON COMPONENT ====================
  const PillBtn: React.FC<{
    children: React.ReactNode;
    variant?: "contained" | "outlined" | "highlight" | "text";
    onClick?: () => void;
    disabled?: boolean;
    id?: string;
    style?: React.CSSProperties;
  }> = ({
    children,
    variant = "contained",
    onClick,
    disabled,
    id,
    style: extraStyle,
  }) => {
    const isHover = hoverBtn === id;
    const base: React.CSSProperties = {
      fontFamily: DS.font,
      fontSize: 13,
      fontWeight: 600,
      padding: "10px 24px",
      borderRadius: DS.radius,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      border: "none",
      outline: "none",
      opacity: disabled ? 0.5 : 1,
      transform:
        isHover && !disabled ? "scale(1.04) translateY(-1px)" : "scale(1)",
      ...extraStyle,
    };
    const variants: Record<string, React.CSSProperties> = {
      contained: {
        background: DS.primary,
        color: DS.white,
        boxShadow: isHover
          ? `0 8px 24px ${DS.primary}44`
          : `0 4px 12px ${DS.primary}22`,
      },
      outlined: {
        background: "transparent",
        color: DS.primary,
        border: `2px solid ${DS.primary}`,
        boxShadow: isHover ? `0 4px 16px ${DS.primary}22` : "none",
      },
      highlight: {
        background: DS.accent,
        color: DS.white,
        boxShadow: isHover
          ? `0 8px 24px ${DS.accent}44`
          : `0 4px 12px ${DS.accent}22`,
      },
      text: {
        background: "transparent",
        color: DS.primary,
        padding: "10px 16px",
      },
    };
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => id && setHoverBtn(id)}
        onMouseLeave={() => setHoverBtn(null)}
        style={{ ...base, ...variants[variant] }}
      >
        {children}
      </button>
    );
  };

  // ==================== GEOMETRIC DECO ====================
  const GeoDeco: React.FC<{
    type: "circle" | "triangle" | "square";
    size?: number;
    color?: string;
    filled?: boolean;
    style?: React.CSSProperties;
  }> = ({
    type,
    size = 28,
    color = DS.lavender,
    filled = false,
    style: es,
  }) => {
    if (type === "circle")
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            border: filled ? "none" : `2px solid ${color}`,
            background: filled ? color : "transparent",
            ...es,
          }}
        />
      );
    if (type === "square")
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: 3,
            border: filled ? "none" : `2px solid ${color}`,
            background: filled ? color : "transparent",
            ...es,
          }}
        />
      );
    return (
      <svg width={size} height={size} viewBox="0 0 30 30" style={es}>
        <polygon
          points="15,4 27,26 3,26"
          fill={filled ? color : "none"}
          stroke={color}
          strokeWidth="2"
        />
      </svg>
    );
  };

  // ==================== RENDER COMPARISON ====================
  const renderComparison = (eqIndex: number) => {
    const eq = equations[eqIndex];
    if (!eq) return null;
    const allFullRevealed = revealedFullSteps >= eq.fullSteps.length;
    const allShortRevealed = revealedShortSteps >= eq.shortcutSteps.length;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          width: "100%",
        }}
      >
        {/* Equation header */}
        <div
          style={{
            textAlign: "center",
            animation: "sgPop 0.5s ease-out both",
            background: DS.gray100,
            borderRadius: DS.radiusMd,
            padding: "12px 20px",
            border: `1.5px solid ${DS.gray200}`,
          }}
        >
          <MathBlock
            tex={eq.equation}
            fontSize={22}
            style={{ color: DS.gray900 }}
          />
        </div>

        {/* Two columns */}
        <div style={{ display: "flex", gap: 16, width: "100%" }}>
          {/* Full step-by-step column */}
          <div
            style={{
              flex: 1,
              background: DS.lavenderLight,
              borderRadius: DS.radiusMd,
              padding: "16px 18px",
              border: `2px solid ${DS.lavender}66`,
              animation: "sgFadeLeft 0.5s ease-out both",
              minWidth: 0,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative shapes */}
            <GeoDeco
              type="circle"
              size={40}
              color={`${DS.lavender}44`}
              filled
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                opacity: 0.4,
              }}
            />
            <GeoDeco
              type="triangle"
              size={24}
              color={`${DS.primary}33`}
              style={{
                position: "absolute",
                bottom: 8,
                right: 12,
                opacity: 0.3,
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
                fontWeight: 700,
                color: DS.fullMethod,
                fontSize: 12,
                letterSpacing: 0.8,
                textTransform: "uppercase" as const,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: DS.fullMethod,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BookOpen size={12} color={DS.white} />
              </div>
              Full Step-by-Step
            </div>
            {eq.fullSteps.map((s, i) => (
              <div
                key={`f-${i}`}
                style={{
                  opacity: i < revealedFullSteps ? 1 : 0.1,
                  transform:
                    i < revealedFullSteps
                      ? "translateX(0)"
                      : "translateX(-12px)",
                  transition: `all 0.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.08}s`,
                  padding: "8px 12px",
                  borderRadius: DS.radiusSm,
                  marginBottom: 6,
                  background:
                    i === revealedFullSteps - 1 && i < revealedFullSteps
                      ? `${DS.primary}0c`
                      : "transparent",
                  borderLeft:
                    i === revealedFullSteps - 1 && i < revealedFullSteps
                      ? `3px solid ${DS.primary}`
                      : "3px solid transparent",
                }}
              >
                <MathBlock
                  tex={s.step}
                  fontSize={13.5}
                  style={{ color: DS.gray900, justifyContent: "flex-start" }}
                />
                <div
                  style={{
                    fontSize: 10,
                    color: DS.gray900,
                    marginTop: 2,
                    fontStyle: "italic",
                    fontFamily: DS.font,
                  }}
                >
                  {s.explanation}
                </div>
              </div>
            ))}
          </div>

          {/* VS badge */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              minWidth: 40,
            }}
          >
            <div
              style={{
                flex: 1,
                width: 2,
                background: `linear-gradient(to bottom, transparent, ${DS.gray200}, transparent)`,
              }}
            />
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: DS.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: DS.white,
                fontWeight: 800,
                fontSize: 10,
                fontFamily: DS.font,
                letterSpacing: 0.5,
                boxShadow: `0 4px 16px ${DS.gradStart}44`,
                animation: "sgFloat 3s ease-in-out infinite",
              }}
            >
              VS
            </div>
            <div
              style={{
                flex: 1,
                width: 2,
                background: `linear-gradient(to bottom, transparent, ${DS.gray200}, transparent)`,
              }}
            />
          </div>

          {/* Transposition shortcut column */}
          <div
            style={{
              flex: 1,
              background: DS.peachLight,
              borderRadius: DS.radiusMd,
              padding: "16px 18px",
              border: `2px solid ${DS.accent}33`,
              animation: "sgFadeRight 0.5s ease-out both",
              minWidth: 0,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <GeoDeco
              type="square"
              size={36}
              color={`${DS.peach}88`}
              filled
              style={{ position: "absolute", top: -8, left: -8, opacity: 0.5 }}
            />
            <GeoDeco
              type="circle"
              size={20}
              color={`${DS.accent}33`}
              style={{
                position: "absolute",
                bottom: 10,
                left: 14,
                opacity: 0.3,
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
                fontWeight: 700,
                color: DS.shortMethod,
                fontSize: 12,
                letterSpacing: 0.8,
                textTransform: "uppercase" as const,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: DS.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={12} color={DS.white} />
              </div>
              Transposition Shortcut
            </div>
            {eq.shortcutSteps.map((s, i) => (
              <div
                key={`s-${i}`}
                style={{
                  opacity: i < revealedShortSteps ? 1 : 0.1,
                  transform:
                    i < revealedShortSteps
                      ? "translateX(0)"
                      : "translateX(12px)",
                  transition: `all 0.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.08}s`,
                  padding: "8px 12px",
                  borderRadius: DS.radiusSm,
                  marginBottom: 6,
                  background:
                    i === revealedShortSteps - 1 && i < revealedShortSteps
                      ? `${DS.accent}0c`
                      : "transparent",
                  borderLeft:
                    i === revealedShortSteps - 1 && i < revealedShortSteps
                      ? `3px solid ${DS.accent}`
                      : "3px solid transparent",
                }}
              >
                <MathBlock
                  tex={s.step}
                  fontSize={13.5}
                  style={{ color: DS.gray900, justifyContent: "flex-start" }}
                />
                <div
                  style={{
                    fontSize: 10,
                    color: DS.gray900,
                    marginTop: 2,
                    fontStyle: "italic",
                    fontFamily: DS.font,
                  }}
                >
                  {s.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <PillBtn id="reveal" variant="contained" onClick={revealNextStep}>
            ▶ Reveal Next Step
          </PillBtn>
          <PillBtn id="showAll" variant="outlined" onClick={revealAll}>
            Show All Steps
          </PillBtn>
        </div>

        {/* Same answer badge */}
        {allFullRevealed && allShortRevealed && (
          <div
            style={{
              animation: "sgPop 0.5s ease-out both",
              padding: "14px 24px",
              borderRadius: DS.radiusMd,
              background: DS.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Check size={20} color={DS.white} />
            <span
              style={{
                fontWeight: 700,
                color: DS.white,
                fontSize: 14,
                fontFamily: DS.font,
              }}
            >
              Both methods give the same answer:
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.25)",
                borderRadius: DS.radius,
                padding: "4px 16px",
                backdropFilter: "blur(4px)",
              }}
            >
              <MathText
                tex={`${eq.variable} = ${eq.answer}`}
                fontSize={16}
                style={{ fontWeight: 700, color: DS.white }}
              />
            </span>
            <Award size={20} color="#FFD700" />
          </div>
        )}
      </div>
    );
  };

  // ==================== RENDER OBSERVATION ====================
  const renderObservation = (obs: string, eqIndex: number) => {
    const obsData: Record<
      string,
      {
        title: string;
        rule: string;
        example: string;
        color: string;
        bgColor: string;
        icon: "circle" | "triangle" | "square";
      }
    > = {
      a: {
        title: "Observation (a): Additive Inverse",
        rule: "When a term is removed from one side, its additive inverse appears on the other side.",
        example: "2y + 7 = 21  ⟹  2y = 21 - 7",
        color: DS.accent,
        bgColor: DS.peachLight,
        icon: "triangle",
      },
      b: {
        title: "Observation (b): Factor → Division",
        rule: "When a factor is removed from one side, the other side is divided by that factor.",
        example: "2y = 14  ⟹  y = 14 \\div 2",
        color: DS.primary,
        bgColor: DS.lavenderLight,
        icon: "square",
      },
      c: {
        title: "Observation (c): Divisor → Multiplication",
        rule: "When a divisor is removed, the other side is multiplied by that divisor.",
        example: "\\dfrac{u}{15} = 6  ⟹  u = 6 \\times 15",
        color: DS.gradStart,
        bgColor: `${DS.lavenderLight}`,
        icon: "circle",
      },
    };
    const d = obsData[obs];
    if (!d) return null;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: d.bgColor,
            border: `2px solid ${d.color}33`,
            borderRadius: DS.radiusLg,
            padding: "22px 28px",
            width: "100%",
            maxWidth: 560,
            animation: "sgFadeUp 0.5s ease-out both",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <GeoDeco
            type={d.icon}
            size={50}
            color={`${d.color}22`}
            filled
            style={{ position: "absolute", top: -12, right: -12 }}
          />
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: d.color,
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: DS.font,
              position: "relative",
            }}
          >
            <Star size={18} fill={d.color} color={d.color} /> {d.title}
          </div>
          <div
            style={{
              fontSize: 13,
              color: DS.gray900,
              marginBottom: 16,
              lineHeight: 1.7,
              fontFamily: DS.font,
              opacity: 0.8,
            }}
          >
            {d.rule}
          </div>
          <div
            style={{
              background: DS.white,
              borderRadius: DS.radiusSm,
              padding: "14px 20px",
              textAlign: "center",
              animation: "sgGlow 2.5s ease-in-out infinite",
              border: `1px solid ${DS.gray200}`,
            }}
          >
            <MathBlock
              tex={d.example}
              fontSize={17}
              style={{ color: DS.gray900 }}
            />
          </div>
        </div>
        {renderComparison(eqIndex)}
      </div>
    );
  };

  // ==================== RENDER PRACTICE ====================
  const renderPractice = () => {
    const d = currentStep?.data;
    if (!d) return null;
    const checkAnswer = () => {
      setPracticeResult(
        parseFloat(practiceInput) === d.answer ? "correct" : "wrong",
      );
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          animation: "sgFadeUp 0.5s ease-out both",
        }}
      >
        <div
          style={{
            background: DS.white,
            borderRadius: DS.radiusLg,
            padding: "32px 36px",
            border: `2px solid ${DS.primary}22`,
            textAlign: "center",
            width: "100%",
            maxWidth: 480,
            boxShadow: `0 8px 32px ${DS.primary}0d`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <GeoDeco
            type="circle"
            size={60}
            color={`${DS.lavender}44`}
            filled
            style={{ position: "absolute", top: -20, right: -20 }}
          />
          <GeoDeco
            type="triangle"
            size={30}
            color={`${DS.accent}22`}
            style={{ position: "absolute", bottom: 10, left: 10 }}
          />
          <MathBlock
            tex={d.practiceEquation}
            fontSize={24}
            style={{
              color: DS.gray900,
              marginBottom: 18,
              position: "relative",
            }}
          />
          <div
            style={{
              fontSize: 13,
              color: DS.gray900,
              marginBottom: 16,
              fontFamily: DS.font,
            }}
          >
            Use transposition to find{" "}
            <strong style={{ color: DS.primary }}>{d.variable}</strong>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              position: "relative",
            }}
          >
            <MathText
              tex={`${d.variable} =`}
              fontSize={22}
              style={{ color: DS.gray900 }}
            />
            <input
              type="text"
              value={practiceInput}
              onChange={(e) => {
                setPracticeInput(e.target.value);
                setPracticeResult(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
              placeholder="?"
              style={{
                width: 90,
                padding: "12px 16px",
                borderRadius: DS.radiusSm,
                border: `2px solid ${practiceResult === "correct" ? DS.success : practiceResult === "wrong" ? DS.error : DS.gray200}`,
                fontSize: 22,
                fontWeight: 700,
                textAlign: "center",
                outline: "none",
                transition: "all 0.3s ease",
                background: DS.white,
                color: DS.gray900,
                fontFamily: "'Cambria Math', Georgia, serif",
                boxShadow:
                  practiceResult === "correct"
                    ? `0 0 0 4px ${DS.success}22`
                    : practiceResult === "wrong"
                      ? `0 0 0 4px ${DS.error}22`
                      : "none",
              }}
            />
            <PillBtn id="check" variant="highlight" onClick={checkAnswer}>
              Check
            </PillBtn>
          </div>
          {practiceResult && (
            <div
              style={{
                marginTop: 18,
                padding: "12px 18px",
                borderRadius: DS.radius,
                background:
                  practiceResult === "correct"
                    ? `${DS.success}12`
                    : `${DS.error}12`,
                color: practiceResult === "correct" ? DS.success : DS.error,
                fontWeight: 600,
                fontSize: 14,
                animation: "sgBounce 0.4s ease-out both",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontFamily: DS.font,
              }}
            >
              {practiceResult === "correct" ? (
                <>
                  <Check size={18} /> Correct! Well done!
                </>
              ) : (
                "Try again — use transposition to move terms!"
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==================== RENDER EXPLORER ====================
  const renderExplorer = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {equations.map((eq, i) => (
          <PillBtn
            key={i}
            id={`eq-${i}`}
            variant={explorerIndex === i ? "contained" : "outlined"}
            onClick={() => {
              setExplorerIndex(i);
              setRevealedFullSteps(1);
              setRevealedShortSteps(1);
            }}
            style={{ fontSize: 12, padding: "8px 18px" }}
          >
            {eq.equation
              .replace(/\\d?frac\{([^}]+)\}\{([^}]+)\}/g, "$1/$2")
              .replace(/\\times/g, "×")
              .replace(/\\div/g, "÷")}
          </PillBtn>
        ))}
      </div>
      {renderComparison(explorerIndex)}
    </div>
  );

  // ==================== RENDER CONTENT ====================
  const renderContent = () => {
    if (!currentStep) return null;
    if (currentStep.mode === "practice") return renderPractice();
    if (currentStep.data?.explorer) return renderExplorer();
    if (currentStep.data?.comparison)
      return renderComparison(currentStep.data.equationIndex);
    if (currentStep.data?.observation)
      return renderObservation(
        currentStep.data.observation,
        currentStep.data.equationIndex,
      );

    // Intro
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          animation: "sgFadeUp 0.5s ease-out both",
          textAlign: "center",
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: DS.gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "sgPulse 2.5s ease-in-out infinite",
            boxShadow: `0 12px 32px ${DS.gradStart}33`,
            position: "relative",
          }}
        >
          <Zap size={34} color={DS.white} />
          <GeoDeco
            type="circle"
            size={14}
            color={DS.peach}
            filled
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              animation: "sgFloat 2s ease-in-out infinite",
            }}
          />
        </div>
        <div
          style={{
            fontSize: 14,
            color: DS.gray900,
            lineHeight: 1.7,
            fontFamily: DS.font,
            opacity: 0.75,
          }}
        >
          {currentStep.description}
        </div>
        <div style={{ display: "flex", gap: 14, width: "100%", marginTop: 4 }}>
          {[
            {
              label: "(a) Additive Inverse",
              icon: "±" as const,
              color: DS.accent,
              bg: DS.peachLight,
              desc: "Term changes sign when crossing =",
              shape: "triangle" as const,
            },
            {
              label: "(b) Factor → Division",
              icon: "÷" as const,
              color: DS.primary,
              bg: DS.lavenderLight,
              desc: "Multiplier becomes divisor",
              shape: "square" as const,
            },
            {
              label: "(c) Divisor → Multiply",
              icon: "×" as const,
              color: DS.gradStart,
              bg: DS.lavenderLight,
              desc: "Divisor becomes multiplier",
              shape: "circle" as const,
            },
          ].map((c, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                padding: "18px 14px",
                borderRadius: DS.radiusMd,
                background: c.bg,
                border: `1.5px solid ${c.color}22`,
                animation: `sgPop 0.5s ease-out ${0.2 + idx * 0.15}s both`,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <GeoDeco
                type={c.shape}
                size={30}
                color={`${c.color}20`}
                filled
                style={{ position: "absolute", top: -6, right: -6 }}
              />
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: c.color,
                  marginBottom: 8,
                  fontFamily: DS.font,
                }}
              >
                {c.icon}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: c.color,
                  marginBottom: 4,
                  fontFamily: DS.font,
                }}
              >
                {c.label}
              </div>
              <div
                style={{ fontSize: 10, color: DS.gray900, fontFamily: DS.font }}
              >
                {c.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const modeConfig: Record<ModeType, { icon: React.ReactNode; label: string }> =
    {
      learn: { icon: <BookOpen size={14} />, label: "Learn" },
      practice: { icon: <Target size={14} />, label: "Practice" },
      explore: { icon: <Zap size={14} />, label: "Explore" },
    };

  // ==================== MAIN RENDER ====================
  return (
    <div
      style={{
        width,
        maxWidth: "100%",
        minHeight: height,
        background: DS.gray100,
        borderRadius: DS.radiusLg,
        overflow: "hidden",
        fontFamily: DS.font,
        display: "flex",
        flexDirection: "column",
        boxShadow: `0 24px 64px -16px rgba(83,48,134,0.15)`,
        border: `1px solid ${DS.gray200}`,
        color: DS.gray900,
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{
          background: DS.gradient,
          padding: "18px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative geometric shapes */}
        <GeoDeco
          type="circle"
          size={80}
          color="rgba(255,255,255,0.08)"
          filled
          style={{ position: "absolute", top: -30, right: 40 }}
        />
        <GeoDeco
          type="triangle"
          size={50}
          color="rgba(255,255,255,0.06)"
          style={{ position: "absolute", bottom: -10, right: 120 }}
        />
        <GeoDeco
          type="square"
          size={30}
          color="rgba(255,255,255,0.07)"
          filled
          style={{ position: "absolute", top: 8, right: 200 }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: DS.white,
              letterSpacing: -0.2,
            }}
          >
            Making Equation Solving Efficient
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.7)",
              marginTop: 3,
              fontWeight: 500,
            }}
          >
            Three Key Observations · Chapter 7
          </div>
        </div>
        {showStepIndicator && filteredSteps.length > 0 && (
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: DS.radius,
              padding: "6px 18px",
              fontSize: 12,
              fontWeight: 700,
              color: DS.white,
              backdropFilter: "blur(8px)",
              position: "relative",
            }}
          >
            {currentStepIndex + 1} / {filteredSteps.length}
          </div>
        )}
      </div>

      {/* ===== MODE SELECTOR ===== */}
      {showModeSelector && (
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: "12px 28px",
            borderBottom: `1px solid ${DS.gray200}`,
            background: DS.white,
          }}
        >
          {enabledModes.map((mode) => {
            const active = currentMode === mode;
            const hover = hoverBtn === `mode-${mode}`;
            return (
              <button
                key={mode}
                onClick={() => setCurrentMode(mode)}
                onMouseEnter={() => setHoverBtn(`mode-${mode}`)}
                onMouseLeave={() => setHoverBtn(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 20px",
                  borderRadius: DS.radius,
                  border: active
                    ? `2px solid ${DS.primary}`
                    : `2px solid transparent`,
                  background: active
                    ? `${DS.primary}0c`
                    : hover
                      ? DS.gray100
                      : "transparent",
                  color: active ? DS.primary : DS.gray900,
                  fontWeight: active ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontFamily: DS.font,
                  outline: "none",
                }}
              >
                {modeConfig[mode].icon} {modeConfig[mode].label}
              </button>
            );
          })}
        </div>
      )}

      {/* ===== STEP TITLE ===== */}
      {currentStep && (
        <div
          style={{
            padding: "16px 28px 8px",
            animation: "sgFadeUp 0.35s ease-out both",
          }}
          key={`t-${currentStep.id}`}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: DS.gray900,
              marginBottom: 4,
            }}
          >
            {currentStep.title}
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: DS.gray900,
              lineHeight: 1.65,
              fontWeight: 400,
            }}
          >
            {currentStep.description}
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div
        style={{
          flex: 1,
          padding: "12px 28px 20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
        key={`c-${currentStep?.id}`}
      >
        {renderContent()}
      </div>

      {/* ===== NAVIGATION ===== */}
      {showNavigation && filteredSteps.length > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 28px 16px",
            borderTop: `1px solid ${DS.gray200}`,
            background: DS.white,
          }}
        >
          <PillBtn
            id="prev"
            variant="outlined"
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            style={{ fontSize: 12, padding: "8px 20px" }}
          >
            <ChevronLeft size={15} /> Previous
          </PillBtn>

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {filteredSteps.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentStepIndex(i)}
                style={{
                  width: i === currentStepIndex ? 28 : 8,
                  height: 8,
                  borderRadius: DS.radius,
                  background: i === currentStepIndex ? DS.gradient : DS.gray200,
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow:
                    i === currentStepIndex
                      ? `0 2px 8px ${DS.gradStart}44`
                      : "none",
                }}
              />
            ))}
          </div>

          <PillBtn
            id="next"
            variant={
              currentStepIndex === filteredSteps.length - 1
                ? "outlined"
                : "contained"
            }
            onClick={goNext}
            disabled={currentStepIndex === filteredSteps.length - 1}
            style={{ fontSize: 12, padding: "8px 20px" }}
          >
            Next <ChevronRight size={15} />
          </PillBtn>
        </div>
      )}
    </div>
  );
};

export default EquationSolvingEfficiencyTool;
