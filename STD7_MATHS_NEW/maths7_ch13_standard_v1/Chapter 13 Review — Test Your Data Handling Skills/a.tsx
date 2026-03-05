// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: chapter5_mcq_quiz_tool.tsx
// Redesigned per Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  // @ts-expect-error React types resolved by project/bundler
} from "react";
import {
  Check,
  X,
  RotateCcw,
  ChevronRight,
  BookOpen,
  Star,
  // @ts-expect-error lucide-react types resolved by project/bundler
} from "lucide-react";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "real_world" | "hands_on";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

interface QuizAdditionalProps {
  questions?: QuizQuestion[];
  themeColor?: string;
  title?: string;
  subtitle?: string;
  instructionsForStudent?: string;
  teachingNotes?: string;
  showTopicTags?: boolean;
  shuffleOptions?: boolean;
}

interface Chapter5McqQuizToolProps {
  props?: {
    width?: number;
    height?: number;
    themeColor?: string;
    darkMode?: boolean;
    additionalProps?: QuizAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DEFAULT QUESTIONS ====================

const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question:
      "Virat scored 45, 32, 67, 12, and 94 runs in five innings. What is his arithmetic mean (average) score?",
    options: ["50 runs", "45 runs", "67 runs", "52 runs"],
    correctIndex: 0,
    explanation:
      "Mean = Sum ÷ Count = (45 + 32 + 67 + 12 + 94) ÷ 5 = 250 ÷ 5 = 50 runs. We add all values and divide by the number of values.",
    topic: "Arithmetic Mean",
  },
  {
    id: 2,
    question:
      "The daily prices (₹/kg) of tomatoes at a sabzi mandi over a week are: 18, 22, 25, 28, 30, 35, 40. What is the median price?",
    options: ["₹25", "₹28", "₹30", "₹27"],
    correctIndex: 1,
    explanation:
      "The data is already sorted: 18, 22, 25, 28, 30, 35, 40. There are 7 values (odd), so the median is the middle value — the 4th value = ₹28. For odd-count data, pick the centre value directly.",
    topic: "Median (Odd)",
  },
  {
    id: 3,
    question:
      "Six students scored 12, 15, 18, 22, 25, 30 in a quiz. What is the median score?",
    options: ["18", "22", "20", "19"],
    correctIndex: 2,
    explanation:
      "Sorted data: 12, 15, 18, 22, 25, 30. Even count (6 values), so median = average of the 3rd and 4th values = (18 + 22) ÷ 2 = 20. For even-count data, average the two middle values.",
    topic: "Median (Even)",
  },
  {
    id: 4,
    question:
      "Heights of a family: 170, 168, 172, 165, 95 cm (a toddler). The outlier 95 cm pulls the mean ______ the median.",
    options: ["above", "below", "equal to", "it depends on the data"],
    correctIndex: 1,
    explanation:
      "The outlier (95 cm) is much lower than the rest. A low outlier drags the mean downward, so mean < median. The median stays near the cluster of taller members (168 cm), while the mean drops to about 154 cm. Outlier direction determines which way the mean shifts!",
    topic: "Outlier Effect",
  },
  {
    id: 5,
    question: "Which of these is a statistical question?",
    options: [
      "What is your name?",
      "How many runs did India score today?",
      "How tall are Grade 7 students in our school?",
      "Is 7 a prime number?",
    ],
    correctIndex: 2,
    explanation:
      "A statistical question expects variability in answers and requires data collection. 'How tall are Grade 7 students?' expects different heights — we must collect data, find the mean/median, and describe the spread. The other questions have single, fixed answers.",
    topic: "Statistical Questions",
  },
  {
    id: 6,
    question:
      "A cricketer's scores in a series: 57, 13, 0, 84, —, 51. The '—' in Match 5 means the player did not play. To find the mean, we divide the total by:",
    options: [
      "6 (all matches)",
      "5 (matches played)",
      "4 (non-zero scores)",
      "It cannot be calculated",
    ],
    correctIndex: 1,
    explanation:
      "Zero is a valid score (the player batted and scored 0 in Match 3), but '—' means no participation. We only count matches actually played: (57 + 13 + 0 + 84 + 51) ÷ 5 = 205 ÷ 5 = 41. Zero ≠ No value!",
    topic: "Zero vs No Value",
  },
  {
    id: 7,
    question:
      "A family wants to build a door for their house. The heights of family members are 160, 155, 170, 175, 168 cm. Which measure should they use for the door height?",
    options: [
      "The mean height (165.6 cm)",
      "The median height (168 cm)",
      "The maximum height (175 cm) or more",
      "The minimum height (155 cm)",
    ],
    correctIndex: 2,
    explanation:
      "A door must be tall enough for the tallest person to pass! Using mean or median would leave taller members bumping their heads — just like the funny illustration 'A Mean Decision!' in the chapter. Always pick the right measure for the situation.",
    topic: "Right Measure",
  },
  {
    id: 8,
    question:
      "In a clustered (double) bar graph comparing onion prices in Yahapur and Wahapur, what does placing bars side-by-side for each month help us do?",
    options: [
      "Calculate the mean price easily",
      "Compare month-wise prices between two places at a glance",
      "Find the median price",
      "Show the total annual price",
    ],
    correctIndex: 1,
    explanation:
      "A clustered bar graph places bars for different categories (here, two towns) side by side for each group (month). This makes it easy to visually compare values — which town had higher prices each month — by looking at the relative heights of adjacent bars.",
    topic: "Bar Graphs",
  },
];

// ==================== EASING ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

// ==================== DESIGN SYSTEM COLORS (from Singularity PDF) ====================

const DS = {
  primary: "#4A4DC9",
  accent: "#FF7212",
  gradDark: "#533086",
  gradLight: "#FC9145",
  primaryTint: "#C1C1EA",
  accentTint: "#FFF3E4",
  dark: "#4E4E4E",
  gray: "#CACACA",
  lightGray: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  correct: "#2DB866",
  correctLight: "#E8F9EF",
  correctDark: "#1A8A4A",
  incorrect: "#E5453F",
  incorrectLight: "#FDECEB",
  incorrectDark: "#C0322D",
  textPrimary: "#1E1B3A",
  textSecondary: "#4E4E4E",
  textMuted: "#8A8A8A",
  cardShadow: "rgba(74, 77, 201, 0.10)",
  accentShadow: "rgba(255, 114, 18, 0.18)",
};

// ==================== KEYFRAMES ====================

const keyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(28px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-18px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes popIn {
        0% { transform: scale(0); opacity: 0; }
        60% { transform: scale(1.06); }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes slideInFromBelow {
        from { opacity: 0; transform: translateY(36px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shakeX {
        0%, 100% { transform: translateX(0); }
        15% { transform: translateX(-7px); }
        30% { transform: translateX(7px); }
        45% { transform: translateX(-5px); }
        60% { transform: translateX(5px); }
        75% { transform: translateX(-2px); }
        90% { transform: translateX(2px); }
    }
    @keyframes correctGlow {
        0% { box-shadow: 0 0 0 0 rgba(45,184,102,0.45); }
        50% { box-shadow: 0 0 22px 6px rgba(45,184,102,0.18); }
        100% { box-shadow: 0 0 8px 2px rgba(45,184,102,0.08); }
    }
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.06); }
        70% { transform: scale(0.96); }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
    }
    @keyframes starSpin {
        from { transform: rotate(0deg) scale(0); opacity: 0; }
        to { transform: rotate(360deg) scale(1); opacity: 1; }
    }
    @keyframes geoFloat1 {
        0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.13; }
        50% { transform: translate(6px, -10px) rotate(15deg); opacity: 0.22; }
    }
    @keyframes geoFloat2 {
        0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.10; }
        50% { transform: translate(-8px, 8px) rotate(-12deg); opacity: 0.18; }
    }
    @keyframes geoFloat3 {
        0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.08; }
        50% { transform: translate(5px, 6px) rotate(20deg); opacity: 0.16; }
    }
    @keyframes resultCardSlide {
        from { opacity: 0; transform: translateY(20px) scale(0.97); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
`;

// ==================== GEOMETRIC DECORATIONS (shapes from PDF) ====================

const GeoDecorations: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
    }}
  >
    {/* Circle outline - top right */}
    <div
      style={{
        position: "absolute",
        top: 30,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: "50%",
        border: `2.5px solid ${DS.primaryTint}`,
        animation: "geoFloat1 6s ease-in-out infinite",
      }}
    />
    {/* Triangle - bottom left */}
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: -10,
        width: 0,
        height: 0,
        borderLeft: "35px solid transparent",
        borderRight: "35px solid transparent",
        borderBottom: `60px solid ${DS.accentTint}`,
        animation: "geoFloat2 7s ease-in-out infinite",
      }}
    />
    {/* Square outline - mid right */}
    <div
      style={{
        position: "absolute",
        top: "45%",
        right: -15,
        width: 50,
        height: 50,
        border: `2.5px solid ${DS.accentTint}`,
        borderRadius: 6,
        animation: "geoFloat3 8s ease-in-out infinite",
      }}
    />
    {/* Filled circle - top left */}
    <div
      style={{
        position: "absolute",
        top: 100,
        left: 10,
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: DS.primaryTint,
        opacity: 0.18,
        animation: "geoFloat3 5s ease-in-out infinite",
      }}
    />
    {/* Small accent dot - bottom right */}
    <div
      style={{
        position: "absolute",
        bottom: 30,
        right: 40,
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: DS.accent,
        opacity: 0.12,
        animation: "geoFloat1 9s ease-in-out infinite",
      }}
    />
    {/* Filled square - bottom mid */}
    <div
      style={{
        position: "absolute",
        bottom: 120,
        left: "50%",
        width: 20,
        height: 20,
        background: DS.primaryTint,
        opacity: 0.12,
        borderRadius: 3,
        animation: "geoFloat2 6.5s ease-in-out infinite",
      }}
    />
  </div>
);

// ==================== COMPONENT ====================

const Chapter5McqQuizTool: React.FC<Chapter5McqQuizToolProps> = ({
  props = {} as NonNullable<Chapter5McqQuizToolProps["props"]>,
}) => {
  const additionalProps = (props.additionalProps || {}) as QuizAdditionalProps;
  const questions = additionalProps.questions || DEFAULT_QUESTIONS;
  const title = additionalProps.title || "Chapter Review Quiz";
  const subtitle =
    additionalProps.subtitle || "Connecting the Dots — Statistics";

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null),
  );
  const [showResults, setShowResults] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [hoverOption, setHoverOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [progressAnim, setProgressAnim] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [hoverRestart, setHoverRestart] = useState(false);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.id = "quiz-keyframes-singularity";
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    setMounted(true);
    return () => {
      const existing = document.getElementById("quiz-keyframes-singularity");
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  useEffect(() => {
    if (showResults) {
      let start: number | null = null;
      const cc = answers.filter(
        (a, i) => a === questions[i].correctIndex,
      ).length;
      const targetPct = (cc / questions.length) * 100;
      const animate = (ts: number) => {
        if (!start) start = ts;
        const elapsed = ts - start;
        const progress = Math.min(elapsed / 1400, 1);
        setProgressAnim(easeOutCubic(progress) * targetPct);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [showResults, answers, questions]);

  const handleOptionClick = useCallback(
    (optionIndex: number) => {
      if (answered) return;
      setSelectedOption(optionIndex);
      setAnswered(true);
      const newAnswers = [...answers];
      newAnswers[currentQ] = optionIndex;
      setAnswers(newAnswers);
      setTimeout(() => setShowExplanation(true), 450);
    },
    [answered, answers, currentQ],
  );

  const handleNext = useCallback(() => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
      setShowExplanation(false);
      setAnimKey((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  }, [currentQ, questions.length]);

  const handleRestart = useCallback(() => {
    setCurrentQ(0);
    setSelectedOption(null);
    setAnswered(false);
    setShowExplanation(false);
    setAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
    setAnimKey((prev) => prev + 1);
    setProgressAnim(0);
  }, [questions.length]);

  const correctCount = useMemo(
    () => answers.filter((a, i) => a === questions[i].correctIndex).length,
    [answers, questions],
  );

  const getMessage = useCallback((score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct === 100)
      return {
        text: "Perfect Score! You've mastered this chapter!",
        emoji: "🏆",
      };
    if (pct >= 75)
      return {
        text: "Great job! You understand the key concepts well!",
        emoji: "🎯",
      };
    if (pct >= 50)
      return {
        text: "Good effort! Review the explanations for the ones you missed.",
        emoji: "📖",
      };
    return {
      text: "Keep practising! Re-read the chapter and try again.",
      emoji: "💪",
    };
  }, []);

  const question = questions[currentQ];
  const isCorrect = selectedOption === question?.correctIndex;

  // ─── Shared styles ──────────────────────────────────────────────────
  const containerStyle: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif",
    minHeight: "100vh",
    background: DS.offWhite,
    padding: "24px 16px",
    boxSizing: "border-box",
    position: "relative",
  };
  const innerStyle: React.CSSProperties = {
    maxWidth: 660,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  };

  // DS pill button: 40-44px height, 24px+ side padding, fully rounded
  const pillBtnStyle = (isHovered: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 44,
    padding: "0 28px",
    borderRadius: 40,
    border: "none",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'Poppins', sans-serif",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background: `linear-gradient(135deg, ${DS.gradDark}, ${DS.gradLight})`,
    color: DS.white,
    transform: isHovered ? "scale(1.06)" : "scale(1)",
    boxShadow: isHovered
      ? `0 8px 28px ${DS.accentShadow}`
      : `0 4px 18px ${DS.accentShadow}`,
  });

  // ==================== RESULTS SCREEN ====================
  if (showResults) {
    const msg = getMessage(correctCount, questions.length);
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset =
      circumference - (circumference * progressAnim) / 100;
    const scoreColor =
      correctCount >= questions.length * 0.75
        ? DS.correct
        : correctCount >= questions.length * 0.5
          ? DS.accent
          : DS.incorrect;

    return (
      <div style={containerStyle}>
        <GeoDecorations />
        <div style={innerStyle}>
          {/* Header */}
          <div
            style={{
              background: DS.white,
              borderRadius: 20,
              padding: "28px 24px 20px",
              textAlign: "center",
              boxShadow: `0 6px 24px ${DS.cardShadow}`,
              marginBottom: 20,
              animation: "resultCardSlide 0.6s ease-out",
              borderTop: `4px solid ${DS.primary}`,
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 6 }}>{msg.emoji}</div>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: DS.textPrimary,
                margin: "0 0 4px",
              }}
            >
              Quiz Complete!
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 500,
                color: DS.textMuted,
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Score Ring */}
          <div
            style={{
              background: DS.white,
              borderRadius: 20,
              padding: 24,
              textAlign: "center",
              boxShadow: `0 6px 24px ${DS.cardShadow}`,
              marginBottom: 20,
              animation: "resultCardSlide 0.6s ease-out 0.15s both",
            }}
          >
            <div
              style={{
                display: "inline-block",
                position: "relative",
                width: 130,
                height: 130,
              }}
            >
              <svg width="130" height="130" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={DS.lightGray}
                  strokeWidth="7"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 0.05s linear" }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: scoreColor,
                    lineHeight: 1,
                  }}
                >
                  {correctCount}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: DS.textMuted,
                    fontWeight: 600,
                    marginTop: 2,
                  }}
                >
                  of {questions.length}
                </span>
              </div>
            </div>
            <p
              style={{
                margin: "16px 0 0",
                fontSize: 14,
                fontWeight: 600,
                color: DS.textPrimary,
                lineHeight: 1.5,
              }}
            >
              {msg.text}
            </p>
          </div>

          {/* Answer List */}
          <div
            style={{
              background: DS.white,
              borderRadius: 20,
              padding: 20,
              boxShadow: `0 6px 24px ${DS.cardShadow}`,
              marginBottom: 24,
              animation: "resultCardSlide 0.6s ease-out 0.3s both",
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: DS.textPrimary,
                margin: "0 0 14px",
              }}
            >
              Your Answers
            </h3>
            {questions.map((q, i) => {
              const wasCorrect = answers[i] === q.correctIndex;
              return (
                <div
                  key={q.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "11px 14px",
                    marginBottom: 6,
                    borderRadius: 12,
                    background: wasCorrect
                      ? DS.correctLight
                      : DS.incorrectLight,
                    border: `1px solid ${wasCorrect ? DS.correct + "25" : DS.incorrect + "25"}`,
                    animation: `fadeInUp 0.35s ease-out ${0.4 + i * 0.06}s both`,
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: wasCorrect ? DS.correct : DS.incorrect,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {wasCorrect ? (
                      <Check size={13} color="#fff" />
                    ) : (
                      <X size={13} color="#fff" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 600,
                        color: DS.textPrimary,
                        lineHeight: 1.4,
                      }}
                    >
                      Q{i + 1}. {q.topic}
                    </p>
                    {!wasCorrect && (
                      <p
                        style={{
                          margin: "3px 0 0",
                          fontSize: 11.5,
                          color: DS.textMuted,
                          lineHeight: 1.4,
                        }}
                      >
                        Correct: {q.options[q.correctIndex]}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Restart */}
          <div
            style={{
              textAlign: "center",
              animation: "fadeInUp 0.5s ease-out 0.7s both",
            }}
          >
            <button
              onClick={handleRestart}
              onMouseEnter={() => setHoverRestart(true)}
              onMouseLeave={() => setHoverRestart(false)}
              style={pillBtnStyle(hoverRestart)}
            >
              <RotateCcw size={16} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== QUIZ SCREEN ====================
  return (
    <div style={containerStyle}>
      <GeoDecorations />
      <div style={innerStyle}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 20,
            animation: mounted ? "fadeInDown 0.5s ease-out" : "none",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: DS.primaryTint + "40",
              borderRadius: 40,
              padding: "5px 16px",
              marginBottom: 8,
              border: `1px solid ${DS.primaryTint}`,
            }}
          >
            <BookOpen size={14} color={DS.primary} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: DS.primary,
                letterSpacing: "0.6px",
                textTransform: "uppercase",
              }}
            >
              {subtitle}
            </span>
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: DS.textPrimary,
              margin: "4px 0 0",
              lineHeight: 1.25,
            }}
          >
            {title}
          </h1>
        </div>

        {/* Progress */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 22,
            animation: "fadeInUp 0.4s ease-out 0.15s both",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: DS.primary,
              whiteSpace: "nowrap",
              background: DS.primaryTint + "35",
              padding: "4px 12px",
              borderRadius: 20,
            }}
          >
            {currentQ + 1} / {questions.length}
          </span>
          <div
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              background: DS.lightGray,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 3,
                background: `linear-gradient(90deg, ${DS.primary}, ${DS.accent})`,
                width: `${((currentQ + (answered ? 1 : 0)) / questions.length) * 100}%`,
                transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div
          key={`q-${animKey}`}
          style={{
            background: DS.white,
            borderRadius: 20,
            padding: "26px 24px 22px",
            marginBottom: 16,
            boxShadow: `0 8px 30px ${DS.cardShadow}`,
            borderLeft: `5px solid ${DS.primary}`,
            animation: "fadeInUp 0.45s ease-out",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "3px 12px",
              borderRadius: 20,
              background: DS.accentTint,
              color: DS.accent,
              fontSize: 11,
              fontWeight: 700,
              marginBottom: 12,
              letterSpacing: "0.3px",
            }}
          >
            {question.topic}
          </span>
          <p
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: DS.textPrimary,
              lineHeight: 1.6,
            }}
          >
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div
          key={`opts-${animKey}`}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === question.correctIndex;
            let bg = DS.white;
            let borderColor = DS.lightGray;
            let textColor = DS.textPrimary;
            let animStyle = "";
            let shadow = `0 2px 8px ${DS.cardShadow}`;
            let letterBg = DS.primaryTint + "55";
            let letterColor = DS.primary;

            if (answered) {
              if (isCorrectOption) {
                bg = DS.correctLight;
                borderColor = DS.correct;
                textColor = DS.correctDark;
                animStyle = "correctGlow 0.6s ease-out";
                shadow = `0 4px 16px rgba(45,184,102,0.18)`;
                letterBg = DS.correct;
                letterColor = DS.white;
              } else if (isSelected && !isCorrectOption) {
                bg = DS.incorrectLight;
                borderColor = DS.incorrect;
                textColor = DS.incorrectDark;
                animStyle = "shakeX 0.5s ease-out";
                shadow = `0 2px 10px rgba(229,69,63,0.12)`;
                letterBg = DS.incorrect;
                letterColor = DS.white;
              } else {
                bg = DS.offWhite;
                borderColor = DS.lightGray;
                textColor = DS.gray;
                shadow = "none";
                letterBg = DS.lightGray;
                letterColor = DS.gray;
              }
            } else if (hoverOption === idx) {
              bg = DS.primaryTint + "20";
              borderColor = DS.primary;
              shadow = `0 4px 16px ${DS.cardShadow}`;
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                onMouseEnter={() => !answered && setHoverOption(idx)}
                onMouseLeave={() => setHoverOption(null)}
                disabled={answered}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: `2px solid ${borderColor}`,
                  background: bg,
                  cursor: answered ? "default" : "pointer",
                  textAlign: "left",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: textColor,
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform:
                    !answered && hoverOption === idx
                      ? "translateY(-2px) scale(1.01)"
                      : "translateY(0) scale(1)",
                  animation: `fadeInUp 0.35s ease-out ${idx * 0.07}s both${animStyle ? ", " + animStyle : ""}`,
                  boxShadow: shadow,
                  outline: "none",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background: letterBg,
                    color: letterColor,
                    fontWeight: 700,
                    fontSize: 13,
                    transition: "all 0.3s ease",
                  }}
                >
                  {answered && isCorrectOption ? (
                    <Check size={15} />
                  ) : answered && isSelected && !isCorrectOption ? (
                    <X size={15} />
                  ) : (
                    String.fromCharCode(65 + idx)
                  )}
                </div>
                <span style={{ flex: 1, lineHeight: 1.45 }}>{option}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div
            style={{
              background: DS.white,
              borderRadius: 16,
              padding: "18px 20px",
              marginBottom: 16,
              borderLeft: `4px solid ${isCorrect ? DS.correct : DS.incorrect}`,
              boxShadow: `0 4px 18px ${isCorrect ? "rgba(45,184,102,0.10)" : "rgba(229,69,63,0.10)"}`,
              animation: "slideInFromBelow 0.4s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: isCorrect ? DS.correctLight : DS.incorrectLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isCorrect ? (
                  <Star
                    size={15}
                    color={DS.correct}
                    style={{ animation: "starSpin 0.5s ease-out" }}
                  />
                ) : (
                  <BookOpen size={15} color={DS.incorrect} />
                )}
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: isCorrect ? DS.correctDark : DS.incorrectDark,
                }}
              >
                {isCorrect ? "Correct!" : "Not quite — here's why:"}
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.65,
                color: DS.textSecondary,
                fontWeight: 500,
              }}
            >
              {question.explanation}
            </p>
          </div>
        )}

        {/* Next Button */}
        {answered && (
          <div
            style={{
              textAlign: "center",
              animation: "fadeInUp 0.4s ease-out 0.25s both",
            }}
          >
            <button
              onClick={handleNext}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              style={{
                ...pillBtnStyle(hoverNext),
                animation: "float 2.5s ease-in-out infinite",
              }}
            >
              {currentQ < questions.length - 1
                ? "Next Question"
                : "See Results"}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chapter5McqQuizTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
