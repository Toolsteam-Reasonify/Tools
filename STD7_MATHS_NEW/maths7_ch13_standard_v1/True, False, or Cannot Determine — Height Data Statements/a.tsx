import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  // @ts-expect-error React types resolved by project/bundler
} from "react";
import {
  Check,
  X,
  HelpCircle,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Award,
  Plus,
  // @ts-expect-error lucide-react types resolved by project/bundler
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

interface QuizQuestion {
  id: number;
  statement: string;
  correctAnswer: "true" | "false" | "cannot_determine";
  explanation: string;
  highlightData: string[];
}

interface HeightDataRow {
  age: number;
  y1989: [number, number];
  y1999: [number, number];
  y2009: [number, number];
  y2019: [number, number];
}

interface AdditionalProps {
  questions?: QuizQuestion[];
  themeColor?: string;
  fontFamily?: string;
}

interface HeightDataQuizProps {
  props?: {
    width?: number;
    height?: number;
    additionalProps?: AdditionalProps;
    themeColor?: string;
  };
  setStepDetails?: (stepDetails: any) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGULARITY DESIGN SYSTEM TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const DS = {
  // Primary
  indigo: "#4A4DC9",
  orange: "#FF7212",
  // Gradient endpoints
  purple: "#533086",
  orangeGrad: "#FC9145",
  // Light accents
  lavender: "#C1C1EA",
  peach: "#FFF3E4",
  // Neutrals
  dark: "#4E4E4E",
  grey: "#CACACA",
  greyLight: "#EBEBEB",
  greyBg: "#F5F5F5",
  white: "#FFFFFF",
  // Semantic
  correct: "#22c55e",
  correctBg: "#f0fdf4",
  incorrect: "#ef4444",
  incorrectBg: "#fef2f2",
  // Derived
  indigoLight: "#4A4DC915",
  indigoBorder: "#4A4DC940",
  orangeLight: "#FF721215",
  orangeBorder: "#FF721240",
  lavenderBg: "#C1C1EA30",
  peachBg: "#FFF3E480",
  // Font
  font: "'Poppins', sans-serif",
  // Radii (from button spec: ~40px height, rounded pills)
  radiusPill: "100px",
  radiusCard: "20px",
  radiusBtn: "12px",
  radiusMd: "14px",
  radiusSm: "8px",
  // Spacing (from spec: 24px padding)
  sp: 24,
};

// ═══════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════

const heightData: HeightDataRow[] = [
  {
    age: 5,
    y1989: [101.3, 100],
    y1999: [102.4, 101.7],
    y2009: [105.1, 104],
    y2019: [107.1, 107.2],
  },
  {
    age: 6,
    y1989: [107.5, 106],
    y1999: [108.7, 107.5],
    y2009: [111, 109.7],
    y2019: [113.1, 112.9],
  },
  {
    age: 7,
    y1989: [113, 111.4],
    y1999: [114.2, 112.6],
    y2009: [116.2, 114.8],
    y2019: [118.6, 118],
  },
  {
    age: 8,
    y1989: [118.1, 116.5],
    y1999: [119.2, 117.5],
    y2009: [120.9, 119.6],
    y2019: [123.5, 122.7],
  },
  {
    age: 9,
    y1989: [122.9, 121.7],
    y1999: [123.9, 122.4],
    y2009: [125.2, 124.5],
    y2019: [128.1, 127.6],
  },
  {
    age: 10,
    y1989: [127.5, 127.3],
    y1999: [128.3, 127.8],
    y2009: [129.4, 129.9],
    y2019: [132.6, 132.8],
  },
  {
    age: 11,
    y1989: [132.2, 133.4],
    y1999: [132.8, 133.6],
    y2009: [133.7, 135.7],
    y2019: [137, 138.6],
  },
  {
    age: 12,
    y1989: [137.7, 139],
    y1999: [138, 139.1],
    y2009: [138.9, 141.1],
    y2019: [142.2, 143.8],
  },
  {
    age: 13,
    y1989: [144.2, 143.2],
    y1999: [144.3, 143.1],
    y2009: [145.2, 145.1],
    y2019: [148.4, 147.7],
  },
  {
    age: 14,
    y1989: [150.6, 146.2],
    y1999: [150.5, 146.1],
    y2009: [151.5, 148],
    y2019: [154.4, 150.4],
  },
  {
    age: 15,
    y1989: [155.4, 148.5],
    y1999: [155.2, 148.4],
    y2009: [156.3, 150.1],
    y2019: [159, 152.4],
  },
  {
    age: 16,
    y1989: [158.9, 150.1],
    y1999: [158.7, 150.1],
    y2009: [159.9, 151.6],
    y2019: [162.3, 153.8],
  },
  {
    age: 17,
    y1989: [161.3, 151.2],
    y1999: [161.4, 151.3],
    y2009: [162.6, 152.6],
    y2019: [164.6, 154.7],
  },
  {
    age: 18,
    y1989: [162.9, 151.8],
    y1999: [163.2, 152.1],
    y2009: [164.3, 153],
    y2019: [166, 155.2],
  },
  {
    age: 19,
    y1989: [163.5, 151.9],
    y1999: [164.2, 152.4],
    y2009: [165.1, 153],
    y2019: [166.5, 155.2],
  },
];

const defaultQuestions: QuizQuestion[] = [
  {
    id: 1,
    statement:
      "The average heights of both boys and girls at every age increased from 1989 to 2019.",
    correctAnswer: "true",
    explanation:
      "This is TRUE. Looking at the data for every age from 5 to 19, the heights consistently increased across decades. For example, at age 10: boys went from 127.5 cm (1989) → 132.6 cm (2019), and girls went from 127.3 cm (1989) → 132.8 cm (2019). This pattern holds for all ages.",
    highlightData: [
      "Age 10 Boys: 127.5 (1989) → 132.6 (2019)",
      "Age 10 Girls: 127.3 (1989) → 132.8 (2019)",
      "Age 15 Boys: 155.4 (1989) → 159.0 (2019)",
    ],
  },
  {
    id: 2,
    statement:
      "The average height of 13-year-old girls in 1989 is more than the average height of 14-year-old girls in 2009.",
    correctAnswer: "false",
    explanation:
      "This is FALSE. The height of 13-year-old girls in 1989 was 143.2 cm, while 14-year-old girls in 2009 had an average height of 148 cm. So 148 > 143.2, making the statement incorrect.",
    highlightData: [
      "13-year-old girls in 1989: 143.2 cm",
      "14-year-old girls in 2009: 148.0 cm",
      "148.0 > 143.2 → Statement is False",
    ],
  },
  {
    id: 3,
    statement:
      "The average height of 15-year-old boys in 2019 is more than the average height of 16-year-old boys in 1989.",
    correctAnswer: "true",
    explanation:
      "This is TRUE. The height of 15-year-old boys in 2019 was 159 cm, while 16-year-old boys in 1989 had an average height of 158.9 cm. Since 159 > 158.9, the statement is correct — showing how much children have grown taller over 30 years!",
    highlightData: [
      "15-year-old boys in 2019: 159.0 cm",
      "16-year-old boys in 1989: 158.9 cm",
      "159.0 > 158.9 → Statement is True",
    ],
  },
  {
    id: 4,
    statement: "All girls aged 13 are taller than all girls aged 11.",
    correctAnswer: "false",
    explanation:
      "This is FALSE. The data shows average heights, not individual heights. While the average height of 13-year-old girls (e.g., 147.7 cm in 2019) is more than 11-year-old girls (138.6 cm in 2019), individual heights vary widely. Some tall 11-year-olds could be taller than some short 13-year-olds. Averages don't tell us about every individual!",
    highlightData: [
      "Avg 13-yr girls (2019): 147.7 cm",
      "Avg 11-yr girls (2019): 138.6 cm",
      "⚠️ These are averages, NOT individual heights",
    ],
  },
  {
    id: 5,
    statement:
      "Throughout the age period 5 to 19, the average boy's height is more than the average girl's height.",
    correctAnswer: "false",
    explanation:
      "This is FALSE! Look carefully at ages 10-12. At age 11 in 2019, girls (138.6 cm) are taller than boys (137 cm). At age 12 in 2019, girls (143.8 cm) are taller than boys (142.2 cm). During these years, girls tend to have a growth spurt earlier than boys, making them temporarily taller.",
    highlightData: [
      "Age 11 (2019): Boys 137.0 < Girls 138.6",
      "Age 12 (2019): Boys 142.2 < Girls 143.8",
      "Girls grow faster around ages 10-12!",
    ],
  },
  {
    id: 6,
    statement: "Boys keep growing even beyond age 19.",
    correctAnswer: "cannot_determine",
    explanation:
      "CANNOT DETERMINE from the given data. The table only shows heights from ages 5 to 19. To know if boys grow beyond 19, we would need height data for ages 20 and above. While the data shows the growth rate is slowing (only 0.5 cm increase from age 18 to 19 in 2019), we cannot conclude from this data alone whether growth stops at 19.",
    highlightData: [
      "Age 18 Boys (2019): 166.0 cm",
      "Age 19 Boys (2019): 166.5 cm",
      "Growth from 18→19: only 0.5 cm, but no data beyond 19",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// EASING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// DECORATIVE SHAPES (from design system - circles, triangles, squares)
// ═══════════════════════════════════════════════════════════════════════════

const ShapeDecoration: React.FC<{
  type: "circle" | "triangle" | "square";
  size?: number;
  color?: string;
  filled?: boolean;
  style?: React.CSSProperties;
}> = ({ type, size = 32, color = DS.lavender, filled = false, style = {} }) => {
  if (type === "circle") {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: filled ? "none" : `2px solid ${color}`,
          backgroundColor: filled ? color : "transparent",
          ...style,
        }}
      />
    );
  }
  if (type === "triangle") {
    return (
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: filled
            ? `${size * 0.866}px solid ${color}`
            : `${size * 0.866}px solid transparent`,
          position: "relative",
          ...style,
        }}
      >
        {!filled && (
          <svg
            width={size}
            height={size * 0.866}
            style={{ position: "absolute", top: 0, left: -size / 2 }}
          >
            <polygon
              points={`${size / 2},2 ${size - 2},${size * 0.866 - 2} 2,${size * 0.866 - 2}`}
              fill="none"
              stroke={color}
              strokeWidth="2"
            />
          </svg>
        )}
      </div>
    );
  }
  // square
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.08,
        border: filled ? "none" : `2px solid ${color}`,
        backgroundColor: filled ? color : "transparent",
        ...style,
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const HeightDataQuiz: React.FC<HeightDataQuizProps> = ({
  props = {} as NonNullable<HeightDataQuizProps["props"]>,
  ...rest
}) => {
  const additionalProps = (props.additionalProps || {}) as AdditionalProps;
  const questions = additionalProps.questions || defaultQuestions;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    new Array(questions.length).fill(null),
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showDataTable, setShowDataTable] = useState(false);
  const [cardAnim, setCardAnim] = useState("enter");
  const [selectedAnim, setSelectedAnim] = useState(false);
  const [score, setScore] = useState(0);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [summaryAnim, setSummaryAnim] = useState(false);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ═══════════════════════════════════════════════════════════════
  // INJECT KEYFRAMES + POPPINS FONT
  // ═══════════════════════════════════════════════════════════════

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.id = "singularity-quiz-keyframes";
    styleSheet.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

            @keyframes sg-fadeInUp {
                from { opacity: 0; transform: translateY(28px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes sg-fadeInDown {
                from { opacity: 0; transform: translateY(-18px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes sg-fadeOutUp {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-28px); }
            }
            @keyframes sg-popIn {
                0% { transform: scale(0); opacity: 0; }
                60% { transform: scale(1.08); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes sg-slideInRight {
                from { opacity: 0; transform: translateX(50px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes sg-slideInLeft {
                from { opacity: 0; transform: translateX(-50px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes sg-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.04); }
            }
            @keyframes sg-bounceIn {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); }
                70% { transform: scale(0.95); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes sg-expandExplanation {
                from { max-height: 0; opacity: 0; }
                to { max-height: 600px; opacity: 1; }
            }
            @keyframes sg-shake {
                0%, 100% { transform: translateX(0); }
                15% { transform: translateX(-6px); }
                30% { transform: translateX(6px); }
                45% { transform: translateX(-4px); }
                60% { transform: translateX(4px); }
                75% { transform: translateX(-2px); }
                90% { transform: translateX(2px); }
            }
            @keyframes sg-float {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-5px) rotate(1deg); }
            }
            @keyframes sg-fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes sg-tableSlideIn {
                from { opacity: 0; transform: translateY(24px) scale(0.96); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes sg-starSpin {
                from { transform: rotate(0deg) scale(0); opacity: 0; }
                to { transform: rotate(360deg) scale(1); opacity: 1; }
            }
            @keyframes sg-gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes sg-shapeDrift {
                0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.35; }
                50% { transform: translateY(-8px) rotate(8deg); opacity: 0.55; }
            }
            @keyframes sg-shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            @keyframes sg-ripple {
                0% { transform: scale(0); opacity: 0.4; }
                100% { transform: scale(3.5); opacity: 0; }
            }
            @keyframes sg-countUp {
                from { opacity: 0; transform: translateY(12px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
    document.head.appendChild(styleSheet);
    return () => {
      const existing = document.getElementById("singularity-quiz-keyframes");
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const handleAnswer = useCallback(
    (answer: string) => {
      if (answers[currentQuestion] !== null) return;
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = answer;
      setAnswers(newAnswers);
      setSelectedAnim(true);
      const isCorrect = answer === questions[currentQuestion].correctAnswer;
      if (isCorrect) setScore((prev) => prev + 1);
      setTimeout(() => {
        setShowExplanation(true);
        setSelectedAnim(false);
      }, 500);
    },
    [answers, currentQuestion, questions],
  );

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCardAnim("exit");
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
        setShowExplanation(false);
        setCardAnim("enter");
      }, 320);
    } else {
      setCardAnim("exit");
      setTimeout(() => {
        setShowSummary(true);
        setSummaryAnim(true);
      }, 320);
    }
  }, [currentQuestion, questions.length]);

  const handleRestart = useCallback(() => {
    setSummaryAnim(false);
    setTimeout(() => {
      setCurrentQuestion(0);
      setAnswers(new Array(questions.length).fill(null));
      setShowExplanation(false);
      setShowSummary(false);
      setScore(0);
      setCardAnim("enter");
    }, 320);
  }, [questions.length]);

  const getAnswerLabel = (val: string) => {
    if (val === "true") return "True";
    if (val === "false") return "False";
    return "Cannot Determine";
  };

  const progressPercent =
    ((currentQuestion + (answers[currentQuestion] !== null ? 1 : 0)) /
      questions.length) *
    100;

  // ═══════════════════════════════════════════════════════════════
  // CONTAINED BUTTON (from design system)
  // ═══════════════════════════════════════════════════════════════

  const ContainedButton: React.FC<{
    children: React.ReactNode;
    onClick: () => void;
    variant?: "primary" | "highlight" | "outlined";
    disabled?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    style?: React.CSSProperties;
    id?: string;
  }> = ({
    children,
    onClick,
    variant = "primary",
    disabled = false,
    icon,
    fullWidth = false,
    style = {},
    id,
  }) => {
    const isHov = hoveredBtn === id;
    const isPress = pressedBtn === id;

    let bg = DS.indigo;
    let color = DS.white;
    let border = "none";

    if (variant === "highlight") {
      bg = DS.orange;
    } else if (variant === "outlined") {
      bg = DS.white;
      color = DS.indigo;
      border = `2px solid ${DS.indigo}`;
    }

    if (disabled) {
      bg = variant === "outlined" ? DS.white : DS.greyLight;
      color = DS.grey;
      border = variant === "outlined" ? `2px solid ${DS.grey}` : "none";
    }

    return (
      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => !disabled && setHoveredBtn(id || null)}
        onMouseLeave={() => {
          setHoveredBtn(null);
          setPressedBtn(null);
        }}
        onMouseDown={() => !disabled && setPressedBtn(id || null)}
        onMouseUp={() => setPressedBtn(null)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          height: "40px",
          padding: "0 24px",
          borderRadius: DS.radiusPill,
          border,
          backgroundColor: bg,
          color,
          fontSize: "14px",
          fontWeight: 600,
          fontFamily: DS.font,
          cursor: disabled ? "default" : "pointer",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isPress
            ? "scale(0.95)"
            : isHov && !disabled
              ? "scale(1.03)"
              : "scale(1)",
          boxShadow:
            isHov && !disabled
              ? variant === "highlight"
                ? "0 6px 20px rgba(255, 114, 18, 0.35)"
                : variant === "outlined"
                  ? "0 4px 14px rgba(74, 77, 201, 0.15)"
                  : "0 6px 20px rgba(74, 77, 201, 0.35)"
              : "0 2px 8px rgba(0,0,0,0.06)",
          opacity: disabled ? 0.55 : 1,
          width: fullWidth ? "100%" : "auto",
          ...style,
        }}
      >
        {icon && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "4px",
            }}
          >
            {icon}
          </span>
        )}
        {children}
      </button>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // TABLE STYLES
  // ═══════════════════════════════════════════════════════════════

  const thStyle: React.CSSProperties = {
    padding: "7px 9px",
    textAlign: "center",
    fontSize: "11px",
    fontWeight: 600,
    fontFamily: DS.font,
    whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "5px 7px",
    textAlign: "center",
    fontSize: "11px",
    fontFamily: DS.font,
    borderBottom: `1px solid ${DS.greyLight}`,
    whiteSpace: "nowrap",
  };

  // ═══════════════════════════════════════════════════════════════
  // DATA TABLE OVERLAY
  // ═══════════════════════════════════════════════════════════════

  const renderDataTable = () => {
    if (!showDataTable) return null;
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(83, 48, 134, 0.45)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "sg-fadeIn 0.25s ease",
          padding: "16px",
        }}
        onClick={() => setShowDataTable(false)}
      >
        <div
          style={{
            backgroundColor: DS.white,
            borderRadius: DS.radiusCard,
            padding: "24px",
            maxWidth: "95vw",
            maxHeight: "85vh",
            overflow: "auto",
            animation: "sg-tableSlideIn 0.35s ease",
            boxShadow: "0 24px 48px rgba(83, 48, 134, 0.2)",
            border: `1px solid ${DS.lavender}40`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with decorative shapes */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ShapeDecoration
                type="circle"
                size={10}
                color={DS.indigo}
                filled
              />
              <ShapeDecoration
                type="triangle"
                size={10}
                color={DS.orange}
                filled
              />
              <h3
                style={{
                  fontFamily: DS.font,
                  fontSize: "18px",
                  fontWeight: 700,
                  color: DS.purple,
                  margin: 0,
                }}
              >
                Height Data Table <span style={{ color: DS.orange }}>(cm)</span>
              </h3>
            </div>
            <button
              onClick={() => setShowDataTable(false)}
              style={{
                background: DS.greyBg,
                border: `1px solid ${DS.greyLight}`,
                borderRadius: "50%",
                width: "34px",
                height: "34px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: DS.dark,
                transition: "all 0.2s ease",
              }}
            >
              <X size={16} />
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                borderCollapse: "collapse",
                fontSize: "11px",
                fontFamily: DS.font,
                width: "100%",
              }}
            >
              <thead>
                <tr>
                  <th
                    rowSpan={2}
                    style={{
                      ...thStyle,
                      background: `linear-gradient(135deg, ${DS.purple}, ${DS.indigo})`,
                      color: DS.white,
                      position: "sticky",
                      left: 0,
                      zIndex: 2,
                      borderRadius: "8px 0 0 0",
                    }}
                  >
                    Age
                  </th>
                  <th
                    colSpan={2}
                    style={{
                      ...thStyle,
                      backgroundColor: DS.lavender,
                      color: DS.purple,
                    }}
                  >
                    1989
                  </th>
                  <th
                    colSpan={2}
                    style={{
                      ...thStyle,
                      backgroundColor: `${DS.indigo}25`,
                      color: DS.indigo,
                    }}
                  >
                    1999
                  </th>
                  <th
                    colSpan={2}
                    style={{
                      ...thStyle,
                      backgroundColor: DS.peach,
                      color: DS.orange,
                    }}
                  >
                    2009
                  </th>
                  <th
                    colSpan={2}
                    style={{
                      ...thStyle,
                      background: `linear-gradient(135deg, ${DS.peach}, ${DS.orangeLight})`,
                      color: "#d65a00",
                      borderRadius: "0 8px 0 0",
                    }}
                  >
                    2019
                  </th>
                </tr>
                <tr>
                  {["B", "G", "B", "G", "B", "G", "B", "G"].map((label, i) => (
                    <th
                      key={i}
                      style={{
                        ...thStyle,
                        backgroundColor: DS.greyBg,
                        color: DS.dark,
                        fontSize: "10px",
                      }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heightData.map((row, idx) => (
                  <tr
                    key={row.age}
                    style={{
                      backgroundColor: idx % 2 === 0 ? DS.white : DS.greyBg,
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <td
                      style={{
                        ...tdStyle,
                        fontWeight: 700,
                        background: `${DS.indigo}08`,
                        color: DS.indigo,
                        position: "sticky",
                        left: 0,
                      }}
                    >
                      {row.age}
                    </td>
                    <td style={tdStyle}>{row.y1989[0]}</td>
                    <td style={tdStyle}>{row.y1989[1]}</td>
                    <td style={tdStyle}>{row.y1999[0]}</td>
                    <td style={tdStyle}>{row.y1999[1]}</td>
                    <td style={tdStyle}>{row.y2009[0]}</td>
                    <td style={tdStyle}>{row.y2009[1]}</td>
                    <td style={tdStyle}>{row.y2019[0]}</td>
                    <td style={tdStyle}>{row.y2019[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p
            style={{
              fontFamily: DS.font,
              fontSize: "11px",
              color: DS.grey,
              marginTop: "14px",
              textAlign: "center",
            }}
          >
            B = Boys, G = Girls · Heights in centimeters · Source: Indian
            Children Height Survey
          </p>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // SUMMARY SCREEN
  // ═══════════════════════════════════════════════════════════════

  if (showSummary) {
    const percentage = Math.round((score / questions.length) * 100);
    const getMessage = () => {
      if (percentage === 100)
        return "Perfect Score! You're a data detective! 🎯";
      if (percentage >= 80)
        return "Excellent! You really understand data analysis! 🌟";
      if (percentage >= 60) return "Good job! Keep practising with data! 📊";
      return "Keep learning! Always check claims against data! 📚";
    };

    return (
      <div
        ref={containerRef}
        style={{
          fontFamily: DS.font,
          maxWidth: "560px",
          margin: "0 auto",
          padding: "16px",
          minHeight: "100vh",
          backgroundColor: DS.greyBg,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {renderDataTable()}

        {/* Floating shapes background */}
        <div
          style={{
            position: "absolute",
            top: 30,
            right: 20,
            animation: "sg-shapeDrift 5s ease-in-out infinite",
            pointerEvents: "none",
          }}
        >
          <ShapeDecoration type="circle" size={40} color={DS.lavender} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 10,
            animation: "sg-shapeDrift 6s ease-in-out 1s infinite",
            pointerEvents: "none",
          }}
        >
          <ShapeDecoration type="triangle" size={28} color={DS.orange} />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 30,
            animation: "sg-shapeDrift 7s ease-in-out 2s infinite",
            pointerEvents: "none",
          }}
        >
          <ShapeDecoration type="square" size={24} color={DS.indigo} />
        </div>

        <div
          style={{
            backgroundColor: DS.white,
            borderRadius: DS.radiusCard,
            padding: "32px 24px",
            boxShadow: "0 8px 32px rgba(74, 77, 201, 0.08)",
            border: `1px solid ${DS.greyLight}`,
            animation: summaryAnim
              ? "sg-bounceIn 0.6s ease"
              : "sg-fadeOutUp 0.3s ease forwards",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Trophy with gradient background */}
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              background:
                percentage >= 60
                  ? `linear-gradient(135deg, ${DS.indigo}20, ${DS.orange}20)`
                  : DS.greyBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
              animation: "sg-starSpin 0.8s ease 0.3s both",
              border: `2px solid ${percentage >= 60 ? DS.indigo : DS.grey}20`,
            }}
          >
            <Award size={42} color={percentage >= 60 ? DS.indigo : DS.grey} />
          </div>

          <h2
            style={{
              fontFamily: DS.font,
              fontSize: "26px",
              fontWeight: 800,
              background: `linear-gradient(135deg, ${DS.purple}, ${DS.orangeGrad})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: "0 0 8px",
              animation: "sg-fadeInUp 0.5s ease 0.4s both",
            }}
          >
            Quiz Complete!
          </h2>

          <div
            style={{
              fontSize: "52px",
              fontWeight: 800,
              color: DS.indigo,
              animation: "sg-popIn 0.5s ease 0.6s both",
              lineHeight: 1,
            }}
          >
            {score}
            <span style={{ fontSize: "28px", color: DS.grey }}>
              /{questions.length}
            </span>
          </div>

          <p
            style={{
              fontSize: "15px",
              color: DS.dark,
              margin: "10px 0 24px",
              animation: "sg-fadeInUp 0.5s ease 0.8s both",
              fontWeight: 500,
            }}
          >
            {getMessage()}
          </p>

          {/* Answer Summary */}
          <div style={{ textAlign: "left", marginBottom: "24px" }}>
            {questions.map((q, idx) => {
              const isCorrect = answers[idx] === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "12px 14px",
                    borderRadius: DS.radiusMd,
                    marginBottom: "8px",
                    backgroundColor: isCorrect ? DS.correctBg : DS.incorrectBg,
                    borderLeft: `4px solid ${isCorrect ? DS.correct : DS.incorrect}`,
                    animation: `sg-slideInRight 0.4s ease ${0.8 + idx * 0.1}s both`,
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      backgroundColor: isCorrect ? DS.correct : DS.incorrect,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "1px",
                    }}
                  >
                    {isCorrect ? (
                      <Check size={13} color={DS.white} />
                    ) : (
                      <X size={13} color={DS.white} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "12px",
                        color: DS.dark,
                        margin: 0,
                        lineHeight: 1.45,
                        fontWeight: 500,
                      }}
                    >
                      Q{idx + 1}:{" "}
                      {q.statement.length > 65
                        ? q.statement.substring(0, 65) + "…"
                        : q.statement}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: DS.grey,
                        margin: "4px 0 0",
                        fontWeight: 500,
                      }}
                    >
                      Yours:{" "}
                      <strong
                        style={{ color: isCorrect ? DS.correct : DS.incorrect }}
                      >
                        {getAnswerLabel(answers[idx] || "")}
                      </strong>{" "}
                      · Correct:{" "}
                      <strong style={{ color: DS.indigo }}>
                        {getAnswerLabel(q.correctAnswer)}
                      </strong>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key Lesson Card */}
          <div
            style={{
              background: `linear-gradient(135deg, ${DS.indigoLight}, ${DS.orangeLight})`,
              borderRadius: DS.radiusMd,
              padding: "18px",
              border: `1.5px dashed ${DS.indigo}50`,
              marginBottom: "22px",
              animation: "sg-fadeInUp 0.5s ease 1.5s both",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
              }}
            >
              <ShapeDecoration
                type="square"
                size={8}
                color={DS.indigo}
                filled
              />
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: DS.indigo,
                  margin: 0,
                }}
              >
                Key Lesson
              </p>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: DS.dark,
                margin: 0,
                lineHeight: 1.55,
                fontWeight: 400,
              }}
            >
              Always check claims against actual data! Averages describe groups,
              not individuals. And remember — if data doesn't cover something,
              the answer is "Cannot Determine."
            </p>
          </div>

          <ContainedButton
            id="restart"
            onClick={handleRestart}
            fullWidth
            variant="primary"
            icon={<RotateCcw size={16} />}
            style={{
              animation: "sg-fadeInUp 0.5s ease 1.7s both",
              height: "44px",
              fontSize: "15px",
            }}
          >
            Try Again
          </ContainedButton>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // QUIZ SCREEN
  // ═══════════════════════════════════════════════════════════════

  const q = questions[currentQuestion];
  const userAnswer = answers[currentQuestion];
  const isCorrect = userAnswer === q.correctAnswer;

  const answerOptions: {
    value: string;
    label: string;
    color: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "true",
      label: "True",
      color: DS.correct,
      icon: <Check size={20} />,
    },
    {
      value: "false",
      label: "False",
      color: DS.incorrect,
      icon: <X size={20} />,
    },
    {
      value: "cannot_determine",
      label: "Cannot Determine",
      color: DS.grey,
      icon: <HelpCircle size={20} />,
    },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: DS.font,
        maxWidth: "560px",
        margin: "0 auto",
        padding: "16px",
        minHeight: "100vh",
        backgroundColor: DS.greyBg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {renderDataTable()}

      {/* Background decorative shapes */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 12,
          animation: "sg-shapeDrift 5s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <ShapeDecoration type="circle" size={44} color={DS.lavender} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 6,
          animation: "sg-shapeDrift 7s ease-in-out 1.5s infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <ShapeDecoration type="square" size={20} color={`${DS.orange}50`} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 120,
          right: 18,
          animation: "sg-shapeDrift 6s ease-in-out 0.8s infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <ShapeDecoration type="triangle" size={22} color={`${DS.indigo}40`} />
      </div>

      {/* ── HEADER ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
          animation: "sg-fadeInDown 0.5s ease",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Gradient bar accent */}
          <div
            style={{
              width: "4px",
              height: "28px",
              borderRadius: "2px",
              background: `linear-gradient(180deg, ${DS.indigo}, ${DS.orange})`,
            }}
          />
          <h1
            style={{
              fontFamily: DS.font,
              fontSize: "20px",
              fontWeight: 800,
              color: DS.indigo,
              margin: 0,
            }}
          >
            Height Data <span style={{ color: DS.orange }}>Quiz</span>
          </h1>
        </div>
        <ContainedButton
          id="data-table"
          onClick={() => setShowDataTable(true)}
          variant="outlined"
          icon={<BookOpen size={14} />}
          style={{
            height: "36px",
            padding: "0 16px",
            fontSize: "12px",
            animation: "sg-float 4s ease-in-out infinite",
          }}
        >
          Data Table
        </ContainedButton>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div
        style={{
          marginBottom: "16px",
          animation: "sg-fadeInDown 0.5s ease 0.1s both",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "7px",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 600, color: DS.dark }}>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <ShapeDecoration type="circle" size={6} color={DS.indigo} filled />
            <span
              style={{ fontSize: "13px", fontWeight: 700, color: DS.indigo }}
            >
              {score}/{questions.length}
            </span>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: "6px",
            borderRadius: "3px",
            backgroundColor: DS.greyLight,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              borderRadius: "3px",
              background: `linear-gradient(90deg, ${DS.indigo}, ${DS.purple}, ${DS.orangeGrad})`,
              backgroundSize: "200% 100%",
              animation: "sg-gradientShift 3s ease infinite",
              transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
      </div>

      {/* ── QUESTION CARD ── */}
      <div
        style={{
          backgroundColor: DS.white,
          borderRadius: DS.radiusCard,
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(74, 77, 201, 0.06)",
          border:
            userAnswer !== null
              ? `2.5px solid ${isCorrect ? DS.correct : DS.incorrect}`
              : `1px solid ${DS.greyLight}`,
          transition: "border-color 0.4s ease, box-shadow 0.4s ease",
          animation:
            cardAnim === "enter"
              ? "sg-fadeInUp 0.4s ease"
              : "sg-fadeOutUp 0.3s ease forwards",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Statement Section with gradient accent */}
        <div
          style={{
            padding: "24px 22px 20px",
            background: `linear-gradient(135deg, ${DS.indigoLight}, ${DS.peach}60)`,
            borderBottom: `1px solid ${DS.greyLight}`,
            position: "relative",
          }}
        >
          {/* Question badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: DS.radiusSm,
                background: `linear-gradient(135deg, ${DS.indigo}, ${DS.purple})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: 800,
                color: DS.white,
                boxShadow: "0 2px 8px rgba(74, 77, 201, 0.3)",
              }}
            >
              {currentQuestion + 1}
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: DS.purple,
                textTransform: "uppercase",
                letterSpacing: "1.2px",
              }}
            >
              Evaluate This Statement
            </span>
            {/* Decorative shape */}
            <div style={{ marginLeft: "auto", opacity: 0.3 }}>
              <ShapeDecoration type="circle" size={18} color={DS.indigo} />
            </div>
          </div>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.65,
              color: DS.dark,
              fontWeight: 600,
              margin: 0,
            }}
          >
            "{q.statement}"
          </p>
        </div>

        {/* Answer Buttons Section */}
        <div style={{ padding: "20px 22px" }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {answerOptions.map((opt, idx) => {
              const isSelected = userAnswer === opt.value;
              const isCorrectAnswer = q.correctAnswer === opt.value;
              const isAnswered = userAnswer !== null;
              const showCorrectHighlight = isAnswered && isCorrectAnswer;
              const showWrongHighlight = isAnswered && isSelected && !isCorrect;

              let btnBg = DS.white;
              let btnBorder = DS.greyLight;
              let btnColor = DS.dark;
              let iconBg = DS.greyBg;
              let iconColor = opt.color;

              if (showCorrectHighlight) {
                btnBg = DS.correctBg;
                btnBorder = DS.correct;
                btnColor = "#166534";
                iconBg = DS.correct;
                iconColor = DS.white;
              } else if (showWrongHighlight) {
                btnBg = DS.incorrectBg;
                btnBorder = DS.incorrect;
                btnColor = "#991b1b";
                iconBg = DS.incorrect;
                iconColor = DS.white;
              } else if (!isAnswered && hoveredBtn === `opt-${opt.value}`) {
                btnBg =
                  opt.value === "true"
                    ? "#f0fdf4"
                    : opt.value === "false"
                      ? "#fef2f2"
                      : DS.greyBg;
                btnBorder = opt.color;
                iconBg = `${opt.color}20`;
              }

              return (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  disabled={isAnswered}
                  onMouseEnter={() =>
                    !isAnswered && setHoveredBtn(`opt-${opt.value}`)
                  }
                  onMouseLeave={() => setHoveredBtn(null)}
                  onMouseDown={() =>
                    !isAnswered && setPressedBtn(`opt-${opt.value}`)
                  }
                  onMouseUp={() => setPressedBtn(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: DS.radiusMd,
                    border: `2px solid ${btnBorder}`,
                    backgroundColor: btnBg,
                    color: btnColor,
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: isAnswered ? "default" : "pointer",
                    fontFamily: DS.font,
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform:
                      pressedBtn === `opt-${opt.value}`
                        ? "scale(0.97)"
                        : !isAnswered && hoveredBtn === `opt-${opt.value}`
                          ? "scale(1.015)"
                          : "scale(1)",
                    opacity:
                      isAnswered && !isSelected && !isCorrectAnswer ? 0.45 : 1,
                    animation:
                      selectedAnim && isSelected
                        ? isCorrect
                          ? "sg-pulse 0.4s ease"
                          : "sg-shake 0.45s ease"
                        : `sg-slideInRight 0.35s ease ${idx * 0.07}s both`,
                    boxShadow: showCorrectHighlight
                      ? `0 4px 14px ${DS.correct}25`
                      : showWrongHighlight
                        ? `0 4px 14px ${DS.incorrect}25`
                        : "0 1px 4px rgba(0,0,0,0.03)",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      backgroundColor: iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: iconColor,
                      transition: "all 0.25s ease",
                    }}
                  >
                    {showCorrectHighlight ? (
                      <Check size={18} />
                    ) : showWrongHighlight ? (
                      <X size={18} />
                    ) : (
                      opt.icon
                    )}
                  </div>
                  <span style={{ flex: 1, textAlign: "left" }}>
                    {opt.label}
                  </span>
                  {showCorrectHighlight && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: DS.correct,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        backgroundColor: `${DS.correct}15`,
                        padding: "3px 8px",
                        borderRadius: DS.radiusPill,
                      }}
                    >
                      ✓ Correct
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation Section */}
        {showExplanation && (
          <div
            style={{
              borderTop: `1px solid ${DS.greyLight}`,
              animation: "sg-expandExplanation 0.5s ease forwards",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "22px" }}>
              {/* Result badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  borderRadius: DS.radiusPill,
                  backgroundColor: isCorrect ? DS.correctBg : DS.incorrectBg,
                  border: `1.5px solid ${isCorrect ? DS.correct : DS.incorrect}`,
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: isCorrect ? DS.correct : DS.incorrect,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isCorrect ? (
                    <Check size={12} color={DS.white} />
                  ) : (
                    <X size={12} color={DS.white} />
                  )}
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: isCorrect ? "#166534" : "#991b1b",
                  }}
                >
                  {isCorrect ? "Correct!" : "Not quite!"}
                </span>
              </div>

              <p
                style={{
                  fontSize: "13px",
                  lineHeight: 1.65,
                  color: DS.dark,
                  margin: "0 0 16px",
                  fontWeight: 400,
                }}
              >
                {q.explanation}
              </p>

              {/* Highlight Data Card */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${DS.indigoLight}, ${DS.lavenderBg})`,
                  borderRadius: DS.radiusMd,
                  padding: "14px 16px",
                  marginBottom: "18px",
                  border: `1px solid ${DS.lavender}60`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "10px",
                  }}
                >
                  <ShapeDecoration
                    type="square"
                    size={6}
                    color={DS.indigo}
                    filled
                  />
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: DS.indigo,
                      margin: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                    }}
                  >
                    Key Data Values
                  </p>
                </div>
                {q.highlightData.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom:
                        idx < q.highlightData.length - 1 ? "7px" : 0,
                      animation: `sg-slideInLeft 0.3s ease ${idx * 0.1}s both`,
                    }}
                  >
                    <div
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${DS.indigo}, ${DS.orange})`,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: DS.dark,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Next Button - Contained style from design system */}
              <ContainedButton
                id="next"
                onClick={handleNext}
                fullWidth
                variant="primary"
                icon={<ChevronRight size={16} />}
                style={{
                  height: "44px",
                  fontSize: "15px",
                  background: `linear-gradient(135deg, ${DS.indigo}, ${DS.purple})`,
                }}
              >
                {currentQuestion < questions.length - 1
                  ? "Next Question"
                  : "See Results"}
              </ContainedButton>
            </div>
          </div>
        )}
      </div>

      {/* Instructions Footer */}
      <div
        style={{
          marginTop: "16px",
          padding: "14px 18px",
          borderRadius: DS.radiusMd,
          backgroundColor: DS.white,
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          border: `1px solid ${DS.greyLight}`,
          animation: "sg-fadeInUp 0.5s ease 0.3s both",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: DS.dark,
            margin: 0,
            lineHeight: 1.55,
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          💡 <strong style={{ color: DS.indigo }}>Tip:</strong> Tap "Data Table"
          to see the full height survey data before answering. Always verify
          claims with actual numbers!
        </p>
      </div>
    </div>
  );
};

export default HeightDataQuiz;
