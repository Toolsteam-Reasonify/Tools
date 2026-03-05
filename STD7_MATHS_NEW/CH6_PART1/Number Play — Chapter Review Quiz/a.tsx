// @ts-nocheck
// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: number_play_quiz.tsx
// ═══════════════════════════════════════════════════════════════════════════

// Suppress missing-module errors for this standalone snippet; 
// the actual project should provide these dependencies.
// @ts-ignore
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
// @ts-ignore
import {
  Check,
  X,
  Star,
  Award,
  RotateCcw,
  ChevronRight,
  BookOpen,
  Target,
  Zap,
  Plus,
} from "lucide-react";

// ==================== DESIGN TOKENS (from Singularity PDF) ====================

const DS = {
  // Primary palette
  primary: "#4A4DC9",
  primaryDark: "#533086",
  accent: "#FF7212",
  accentLight: "#FC9145",
  // Light fills
  lavender: "#C1C1EA",
  peach: "#FFF3E4",
  lavenderLight: "#EEEDF8",
  peachLight: "#FFF9F2",
  // Greys
  grey900: "#4E4E4E",
  grey400: "#CACACA",
  grey200: "#EBEBEB",
  grey100: "#F5F5F5",
  white: "#FFFFFF",
  // Functional
  correct: "#2ECC71",
  correctBg: "#E8F8F0",
  incorrect: "#E74C3C",
  incorrectBg: "#FDEDEB",
  // Typography
  font: "'Poppins', 'Segoe UI', sans-serif",
  // Spacing
  radius: {
    pill: 40,
    card: 16,
    button: 40,
    tag: 20,
    sm: 8,
    md: 12,
  },
  shadow: {
    card: "0 2px 16px rgba(74,77,201,0.08)",
    cardHover: "0 6px 24px rgba(74,77,201,0.14)",
    button: "0 4px 16px rgba(74,77,201,0.25)",
    accent: "0 4px 16px rgba(255,114,18,0.30)",
  },
} as const;

// ==================== TYPE DEFINITIONS ====================

type ModeType = "quiz" | "review";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface QuestionData {
  id: number;
  topic: string;
  topicIcon: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizAdditionalProps {
  questions?: QuestionData[];
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showExplanations?: boolean;
  passingScore?: number;
  themeAccent?: string;
  title?: string;
  subtitle?: string;
}

interface NumberPlayQuizProps {
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
    additionalProps?: QuizAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== EASING HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeOutElastic = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

// ==================== DEFAULT QUESTIONS ====================

const DEFAULT_QUESTIONS: QuestionData[] = [
  {
    id: 1,
    topic: "Parity",
    topicIcon: "⚖️",
    question:
      "Amma is making laddoos for a festival. She has an odd number of laddoos on 3 plates each. What is the parity of the total number of laddoos?",
    options: [
      "Always even",
      "Always odd",
      "Could be either even or odd",
      "Cannot be determined",
    ],
    correctIndex: 1,
    explanation:
      "The sum of an odd count of odd numbers is always odd. Three plates each with an odd number means odd + odd + odd = odd. Remember: odd number of odd numbers → odd sum!",
  },
  {
    id: 2,
    topic: "Parity",
    topicIcon: "⚖️",
    question:
      "Lakpa has an odd number of ₹1 coins, an odd number of ₹5 coins, and an even number of ₹10 coins. Can the total be ₹205?",
    options: [
      "Yes, it is possible",
      "No, because the total must be even",
      "No, because odd × odd + odd × odd + even × even is always even",
      "No, the combination always gives an even total, but ₹205 is odd",
    ],
    correctIndex: 0,
    explanation:
      "Odd × 1 = odd, odd × 5 = odd, even × 10 = even. Total = odd + odd + even = even. Since 205 is odd, Lakpa made a mistake! The total from such a combination can never be 205.",
  },
  {
    id: 3,
    topic: "Parity",
    topicIcon: "⚖️",
    question: "What is the parity of the sum of all numbers from 1 to 100?",
    options: [
      "Odd",
      "Even",
      "Cannot be determined without adding",
      "Depends on whether you start from 0 or 1",
    ],
    correctIndex: 1,
    explanation:
      "From 1 to 100, there are 50 odd and 50 even numbers. Sum of 50 even numbers = even. Sum of 50 odd numbers (even count) = even. Even + even = even. The sum is 5050 — even!",
  },
  {
    id: 4,
    topic: "Magic Squares",
    topicIcon: "✨",
    question:
      "In a 3×3 magic square using numbers 1–9, what must the magic sum be?",
    options: ["12", "15", "18", "45"],
    correctIndex: 1,
    explanation:
      "The sum of numbers 1–9 is 45. All three row sums are equal and add to 45. So each row sum = 45 ÷ 3 = 15. The magic sum must be 15!",
  },
  {
    id: 5,
    topic: "Magic Squares",
    topicIcon: "✨",
    question:
      "Which number must be at the centre of a 3×3 magic square filled with 1–9?",
    options: ["1", "3", "5", "9"],
    correctIndex: 2,
    explanation:
      "9 cannot be at the centre (8+9 > 15), and 1 cannot either (we'd need pairs summing to 14, needing numbers > 9). By elimination, only 5 works at the centre!",
  },
  {
    id: 6,
    topic: "Magic Squares",
    topicIcon: "✨",
    question:
      "The Chautīsā Yantra at the Pārśhvanath Jain temple in Khajuraho is a famous 4×4 magic square. What is its magic sum?",
    options: ["30", "34", "40", "44"],
    correctIndex: 1,
    explanation:
      "Chautīs means 34! The Chautīsā Yantra is a 10th century inscription where every row, column, and diagonal adds up to 34 — the first recorded 4×4 magic square in history!",
  },
  {
    id: 7,
    topic: "Virahāṅka–Fibonacci",
    topicIcon: "🌻",
    question:
      "The Virahāṅka sequence begins 1, 2, 3, 5, 8, 13, 21, 34, 55, 89. What are the next two numbers?",
    options: ["100, 189", "144, 233", "134, 223", "144, 288"],
    correctIndex: 1,
    explanation:
      "Each number = sum of two before it. So: 55 + 89 = 144, and 89 + 144 = 233. The sequence continues: ...89, 144, 233, ...",
  },
  {
    id: 8,
    topic: "Virahāṅka–Fibonacci",
    topicIcon: "🌻",
    question:
      "Angaan climbs an 8-step staircase taking 1 or 2 steps at a time (like tabla beats — short=1, long=2). How many different ways can he reach the top?",
    options: ["21 ways", "34 ways", "55 ways", "89 ways"],
    correctIndex: 1,
    explanation:
      "This is exactly the Virahāṅka problem! The number of ways to fill n beats with 1s and 2s = nth Virahāṅka number. For 8 steps: 1, 2, 3, 5, 8, 13, 21, 34. Answer: 34 ways!",
  },
  {
    id: 9,
    topic: "Virahāṅka–Fibonacci",
    topicIcon: "🌻",
    question:
      "Who first discovered the rule for forming the Virahāṅka–Fibonacci sequence?",
    options: [
      "Fibonacci, in 1202 CE in Italy",
      "Virahāṅka, around 700 CE — a Prakrit scholar",
      "Piṅgala, around 300 BCE",
      "Hemachandra, around 1150 CE",
    ],
    correctIndex: 1,
    explanation:
      "Virahāṅka, a great Prakrit scholar, first explicitly wrote down the rule around 700 CE. He was inspired by Piṅgala's earlier work. Fibonacci wrote about them ~500 years later!",
  },
  {
    id: 10,
    topic: "Cryptarithms",
    topicIcon: "🔐",
    question:
      "In the cryptarithm T + T + T = UT, where each letter is a digit, what are T and U?",
    options: ["T = 3, U = 0", "T = 5, U = 1", "T = 6, U = 1", "T = 4, U = 1"],
    correctIndex: 1,
    explanation:
      "We need 3×T to be a two-digit number ending in T. Testing: 3×5 = 15, ends in 5! So T = 5 and U = 1. Check: 5 + 5 + 5 = 15 ✓",
  },
  {
    id: 11,
    topic: "Algebraic Parity",
    topicIcon: "🔢",
    question: "The expression 4m − 1 always gives:",
    options: [
      "Even numbers",
      "Odd numbers",
      "Both even and odd numbers",
      "Only multiples of 3",
    ],
    correctIndex: 1,
    explanation:
      "4m is always even (4 × anything = even). Even − 1 = odd. So 4m − 1 is always odd! m=1→3, m=2→7, m=3→11 ... all odd!",
  },
  {
    id: 12,
    topic: "Algebraic Parity",
    topicIcon: "🔢",
    question:
      "Which expression lists ALL odd numbers as n takes values 1, 2, 3, ...?",
    options: ["3n − 1", "2n + 1", "2n − 1", "Both 2n + 1 and 2n − 1"],
    correctIndex: 2,
    explanation:
      "2n − 1 gives: n=1→1, n=2→3, n=3→5, n=4→7 ... all odd numbers from 1. But 2n + 1 gives 3, 5, 7, 9 ... missing 1! So only 2n − 1 lists ALL odd numbers.",
  },
];

// ==================== TOPIC COLORS (mapped to design system) ====================

const TOPIC_COLORS: Record<string, { bg: string; text: string; dot: string }> =
  {
    Parity: { bg: DS.lavenderLight, text: DS.primary, dot: DS.primary },
    "Magic Squares": {
      bg: "#F3EEFA",
      text: DS.primaryDark,
      dot: DS.primaryDark,
    },
    "Virahāṅka–Fibonacci": { bg: DS.peach, text: "#C45E00", dot: DS.accent },
    Cryptarithms: { bg: DS.peachLight, text: "#B35600", dot: DS.accentLight },
    "Algebraic Parity": {
      bg: DS.lavenderLight,
      text: DS.primary,
      dot: DS.lavender,
    },
  };

// ==================== MAIN COMPONENT ====================

const NumberPlayQuiz: React.FC<NumberPlayQuizProps> = (componentProps) => {
  const { props, setStepDetails } = componentProps;
  const additionalProps = (props?.additionalProps || {}) as QuizAdditionalProps;
  const {
    questions: customQuestions,
    shuffleQuestions = true,
    showExplanations = true,
    passingScore = 10,
    title = "Number Play Quiz",
    subtitle = "Chapter 6 — Ganita Prakash, Grade 7",
  } = additionalProps;

  const baseQuestions = customQuestions || DEFAULT_QUESTIONS;

  const shuffledQuestions = useMemo(() => {
    if (!shuffleQuestions) return baseQuestions;
    const arr = [...baseQuestions];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  // State
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(shuffledQuestions.length).fill(null),
  );
  const [showResult, setShowResult] = useState(false);
  const [animPhase, setAnimPhase] = useState<
    "idle" | "correct" | "incorrect" | "explain"
  >("idle");
  const [cardAnim, setCardAnim] = useState(true);
  const [confetti, setConfetti] = useState<
    {
      x: number;
      y: number;
      color: string;
      delay: number;
      size: number;
      rotation: number;
    }[]
  >([]);
  const [mounted, setMounted] = useState(false);
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  const question = shuffledQuestions[currentQ];
  const totalQ = shuffledQuestions.length;

  const setHover = (key: string, val: boolean) =>
    setHoverStates((p) => ({ ...p, [key]: val }));

  // Inject keyframes + Poppins font
  useEffect(() => {
    setMounted(true);
    // Load Poppins
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const styleSheet = document.createElement("style");
    styleSheet.id = "quiz-keyframes-singularity";
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    return () => {
      const existing = document.getElementById("quiz-keyframes-singularity");
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  // Card entrance
  useEffect(() => {
    setCardAnim(false);
    const t = setTimeout(() => setCardAnim(true), 50);
    return () => clearTimeout(t);
  }, [currentQ]);

  // Confetti
  const spawnConfetti = useCallback(() => {
    const colors = [
      DS.primary,
      DS.accent,
      DS.primaryDark,
      DS.accentLight,
      DS.lavender,
      "#FFD700",
    ];
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: -10 + Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.8,
      size: 6 + Math.random() * 6,
      rotation: Math.random() * 360,
    }));
    setConfetti(particles);
    setTimeout(() => setConfetti([]), 3500);
  }, []);

  const handleSubmit = useCallback(() => {
    if (selectedOption === null || answered) return;
    setAnswered(true);
    const isCorrect = selectedOption === question.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
      setAnimPhase("correct");
    } else {
      setAnimPhase("incorrect");
    }
    const newAnswers = [...answers];
    newAnswers[currentQ] = selectedOption;
    setAnswers(newAnswers);
    setTimeout(() => setAnimPhase("explain"), 800);
  }, [selectedOption, answered, question, currentQ, answers]);

  const handleNext = useCallback(() => {
    if (currentQ < totalQ - 1) {
      setCurrentQ((c) => c + 1);
      setSelectedOption(null);
      setAnswered(false);
      setAnimPhase("idle");
    } else {
      setShowResult(true);
      if (score >= passingScore) spawnConfetti();
    }
  }, [currentQ, totalQ, score, passingScore, spawnConfetti]);

  const handleRestart = useCallback(() => {
    setCurrentQ(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setAnswers(new Array(totalQ).fill(null));
    setShowResult(false);
    setAnimPhase("idle");
    setConfetti([]);
  }, [totalQ]);

  const topicBreakdown = useMemo(() => {
    const topics: Record<string, { correct: number; total: number }> = {};
    shuffledQuestions.forEach((q, i) => {
      if (!topics[q.topic]) topics[q.topic] = { correct: 0, total: 0 };
      topics[q.topic].total++;
      if (answers[i] === q.correctIndex) topics[q.topic].correct++;
    });
    return topics;
  }, [answers, shuffledQuestions]);

  if (!mounted) return null;

  // ==================== RESULT SCREEN ====================
  if (showResult) {
    const finalScore = answers.filter(
      (a, i) => a === shuffledQuestions[i].correctIndex,
    ).length;
    const isPerfect = finalScore === totalQ;
    const passed = finalScore >= passingScore;

    return (
      <div style={S.outerContainer}>
        {confetti.length > 0 && (
          <div style={S.confettiContainer}>
            {confetti.map((p, i) => (
              <div
                key={i}
                style={{
                  position: "absolute" as const,
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  borderRadius: Math.random() > 0.5 ? "50%" : 2,
                  transform: `rotate(${p.rotation}deg)`,
                  animation: `confettiFall 2.8s ease-out ${p.delay}s forwards`,
                  opacity: 0,
                }}
              />
            ))}
          </div>
        )}
        <div
          style={{
            ...S.resultCard,
            animation:
              "scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          }}
        >
          {isPerfect && (
            <div style={S.perfectBadge}>
              <Star
                size={28}
                fill={DS.accent}
                color={DS.accent}
                style={{ animation: "starSpin 3s linear infinite" }}
              />
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: DS.accent,
                  fontFamily: DS.font,
                }}
              >
                Perfect Score!
              </span>
              <Star
                size={28}
                fill={DS.accent}
                color={DS.accent}
                style={{ animation: "starSpin 3s linear infinite reverse" }}
              />
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            {passed ? (
              <Award size={56} color={DS.primary} />
            ) : (
              <Target size={56} color={DS.accent} />
            )}
          </div>
          <h2 style={S.resultTitle}>
            {passed ? "Excellent Work!" : "Keep Practising!"}
          </h2>

          {/* Score ring */}
          <div style={S.scoreRing}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={DS.grey200}
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={passed ? DS.primary : DS.accent}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(finalScore / totalQ) * 327} 327`}
                transform="rotate(-90 60 60)"
                style={{ transition: "stroke-dasharray 1.2s ease-out" }}
              />
            </svg>
            <div style={S.scoreRingText}>
              <span
                style={{
                  ...S.scoreBig,
                  color: passed ? DS.primary : DS.accent,
                }}
              >
                {finalScore}
              </span>
              <span style={S.scoreSmall}>/{totalQ}</span>
            </div>
          </div>

          <p style={S.resultSubtext}>
            {passed
              ? `You scored ${finalScore} out of ${totalQ}. You've mastered Number Play!`
              : `You scored ${finalScore} out of ${totalQ}. Review the topics below and try again!`}
          </p>

          {/* Topic breakdown */}
          <div style={S.breakdownBox}>
            <div style={S.breakdownTitle}>Topic-wise Breakdown</div>
            {Object.entries(topicBreakdown).map(([topic, data], i) => {
              const stats = data as { correct: number; total: number };
              const tc = TOPIC_COLORS[topic] || TOPIC_COLORS["Parity"];
              return (
                <div
                  key={topic}
                  style={{
                    ...S.breakdownRow,
                    animation: `slideInRight 0.4s ease-out ${i * 0.08}s both`,
                  }}
                >
                  <div style={S.breakdownLeft}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: tc.dot,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: DS.grey900,
                        fontFamily: DS.font,
                      }}
                    >
                      {topic}
                    </span>
                  </div>
                  <div
                    style={{
                      ...S.breakdownBadge,
                      backgroundColor:
                        stats.correct === stats.total
                          ? DS.correctBg
                          : stats.correct === 0
                            ? DS.incorrectBg
                            : DS.peach,
                      color:
                        stats.correct === stats.total
                          ? "#1B8C4E"
                          : stats.correct === 0
                            ? DS.incorrect
                            : "#B35600",
                    }}
                  >
                    {stats.correct}/{stats.total}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            style={{
              ...S.containedBtn,
              ...(hoverStates["restart"] ? S.containedBtnHover : {}),
            }}
            onClick={handleRestart}
            onMouseEnter={() => setHover("restart", true)}
            onMouseLeave={() => setHover("restart", false)}
          >
            <RotateCcw size={16} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==================== QUIZ SCREEN ====================
  const isCorrectAnswer = answered && selectedOption === question.correctIndex;
  const topicStyle = TOPIC_COLORS[question.topic] || TOPIC_COLORS["Parity"];

  return (
    <div style={S.outerContainer}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.headerLeft}>
          <div style={S.headerIcon}>
            <BookOpen size={18} color={DS.white} />
          </div>
          <div>
            <div style={S.headerTitle}>{title}</div>
            <div style={S.headerSub}>{subtitle}</div>
          </div>
        </div>
        <div style={S.scorePill}>
          <Zap size={13} color={DS.accent} />
          <span
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: DS.grey900,
              fontFamily: DS.font,
            }}
          >
            {score}
          </span>
          <span
            style={{ color: DS.grey400, fontSize: 11, fontFamily: DS.font }}
          >
            pts
          </span>
        </div>
      </div>

      {/* Progress */}
      <div style={S.progressRow}>
        <div style={S.progressTrack}>
          <div
            style={{
              ...S.progressFill,
              width: `${((currentQ + (answered ? 1 : 0)) / totalQ) * 100}%`,
            }}
          />
        </div>
        <span style={S.progressLabel}>
          {currentQ + 1}/{totalQ}
        </span>
      </div>

      {/* Dots */}
      <div style={S.dotsRow}>
        {shuffledQuestions.map((_, i) => {
          const a = answers[i];
          const wasCorrect =
            a !== null && a === shuffledQuestions[i].correctIndex;
          const wasWrong =
            a !== null && a !== shuffledQuestions[i].correctIndex;
          const isCurrent = i === currentQ;
          return (
            <div
              key={i}
              style={{
                width: isCurrent ? 20 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: isCurrent
                  ? DS.primary
                  : wasCorrect
                    ? DS.correct
                    : wasWrong
                      ? DS.incorrect
                      : DS.grey200,
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          );
        })}
      </div>

      {/* Question Card */}
      <div
        style={{
          ...S.questionCard,
          opacity: cardAnim ? 1 : 0,
          transform: cardAnim
            ? "translateY(0) scale(1)"
            : "translateY(16px) scale(0.98)",
        }}
      >
        {/* Topic tag */}
        <div
          style={{
            ...S.topicTag,
            backgroundColor: topicStyle.bg,
          }}
        >
          <span style={{ fontSize: 14 }}>{question.topicIcon}</span>
          <span
            style={{
              color: topicStyle.text,
              fontWeight: 600,
              fontSize: 11,
              textTransform: "uppercase" as const,
              letterSpacing: "0.06em",
              fontFamily: DS.font,
            }}
          >
            {question.topic}
          </span>
        </div>
        {/* Question number circle */}
        <div style={S.qNumCircle}>Q{currentQ + 1}</div>
        <p style={S.questionText}>{question.question}</p>
      </div>

      {/* Options */}
      <div style={S.optionsGrid}>
        {question.options.map((opt, i) => {
          const isSelected = selectedOption === i;
          const isThisCorrect = answered && i === question.correctIndex;
          const isThisWrong =
            answered && isSelected && i !== question.correctIndex;
          const isHovered = hoverStates[`opt-${i}`] && !answered;

          let bg: string = DS.white;
          let border: string =
            isSelected && !answered ? DS.primary : DS.grey200;
          let textColor: string = DS.grey900;
          let letterBg: string = DS.grey100;
          let letterColor: string = DS.grey900;
          let shadow: string = "none";

          if (isHovered && !isSelected) {
            border = DS.lavender;
            bg = DS.lavenderLight;
          }
          if (isSelected && !answered) {
            bg = DS.lavenderLight;
            letterBg = DS.primary;
            letterColor = DS.white;
            shadow = `0 0 0 2px ${DS.primary}`;
          }
          if (isThisCorrect) {
            bg = DS.correctBg;
            border = DS.correct;
            textColor = "#1B6B3A";
            letterBg = DS.correct;
            letterColor = DS.white;
            shadow = `0 0 0 2px ${DS.correct}`;
          }
          if (isThisWrong) {
            bg = DS.incorrectBg;
            border = DS.incorrect;
            textColor = "#9B1C1C";
            letterBg = DS.incorrect;
            letterColor = DS.white;
            shadow = `0 0 0 2px ${DS.incorrect}`;
          }

          return (
            <button
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "14px 16px",
                borderRadius: DS.radius.md,
                border: `2px solid ${border}`,
                backgroundColor: bg,
                color: textColor,
                textAlign: "left" as const,
                fontSize: 14,
                fontWeight: 500,
                fontFamily: DS.font,
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: answered ? "default" : "pointer",
                lineHeight: 1.55,
                boxShadow: shadow,
                opacity: answered && !isThisCorrect && !isThisWrong ? 0.45 : 1,
                animation: isThisCorrect
                  ? "correctPop 0.5s ease-out"
                  : isThisWrong
                    ? "shake 0.4s ease-out"
                    : `fadeInUp 0.35s ease-out ${i * 0.06}s both`,
                outline: "none",
              }}
              onClick={() => !answered && setSelectedOption(i)}
              onMouseEnter={() => setHover(`opt-${i}`, true)}
              onMouseLeave={() => setHover(`opt-${i}`, false)}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  minWidth: 28,
                  borderRadius: DS.radius.sm,
                  backgroundColor: letterBg,
                  color: letterColor,
                  fontWeight: 700,
                  fontSize: 12,
                  fontFamily: DS.font,
                  transition: "all 0.25s ease",
                  marginTop: 1,
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span style={{ flex: 1, paddingTop: 3 }}>{opt}</span>
              {isThisCorrect && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    marginTop: 3,
                  }}
                >
                  <Check size={18} color={DS.correct} strokeWidth={3} />
                </span>
              )}
              {isThisWrong && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    marginTop: 3,
                  }}
                >
                  <X size={18} color={DS.incorrect} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {animPhase === "explain" && showExplanations && (
        <div
          style={{
            ...S.explanationCard,
            animation:
              "slideUp 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          }}
        >
          <div style={S.explainHeader}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: isCorrectAnswer
                  ? `linear-gradient(135deg, ${DS.correct}, #27AE60)`
                  : `linear-gradient(135deg, ${DS.accent}, ${DS.accentLight})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {isCorrectAnswer ? (
                <Check size={14} color={DS.white} strokeWidth={3} />
              ) : (
                <X size={14} color={DS.white} strokeWidth={3} />
              )}
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                fontFamily: DS.font,
                color: isCorrectAnswer ? "#1B6B3A" : "#9B3D00",
              }}
            >
              {isCorrectAnswer ? "Correct!" : "Not quite — here's why:"}
            </span>
          </div>
          <p style={S.explainText}>{question.explanation}</p>
        </div>
      )}

      {/* Action buttons */}
      <div style={S.actionRow}>
        {!answered ? (
          <button
            style={{
              ...S.containedBtn,
              opacity: selectedOption === null ? 0.45 : 1,
              cursor: selectedOption === null ? "not-allowed" : "pointer",
              ...(hoverStates["submit"] && selectedOption !== null
                ? S.containedBtnHover
                : {}),
            }}
            onClick={handleSubmit}
            disabled={selectedOption === null}
            onMouseEnter={() => setHover("submit", true)}
            onMouseLeave={() => setHover("submit", false)}
          >
            Submit Answer
          </button>
        ) : (
          <button
            style={{
              ...S.highlightBtn,
              ...(hoverStates["next"] ? S.highlightBtnHover : {}),
            }}
            onClick={handleNext}
            onMouseEnter={() => setHover("next", true)}
            onMouseLeave={() => setHover("next", false)}
          >
            {currentQ < totalQ - 1 ? (
              <>
                Next Question <ChevronRight size={16} />
              </>
            ) : (
              <>
                See Results <Award size={16} />
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer */}
      <div style={S.footer}>
        Try to get at least {passingScore} out of {totalQ} correct!
      </div>
    </div>
  );
};

// ==================== KEYFRAMES ====================

const keyframes = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.92); }
        to { opacity: 1; transform: scale(1); }
    }
    @keyframes correctPop {
        0% { transform: scale(1); }
        30% { transform: scale(1.04); }
        100% { transform: scale(1); }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-5px); }
        40% { transform: translateX(5px); }
        60% { transform: translateX(-3px); }
        80% { transform: translateX(3px); }
    }
    @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
        100% { transform: translateY(500px) rotate(720deg) scale(0.2); opacity: 0; }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.06); }
    }
    @keyframes starSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
`;

// ==================== STYLES (Singularity Design System) ====================

const S: { [key: string]: React.CSSProperties } = {
  outerContainer: {
    fontFamily: DS.font,
    maxWidth: 680,
    margin: "0 auto",
    padding: "24px 18px",
    position: "relative",
    minHeight: "100vh",
    background: `linear-gradient(170deg, ${DS.lavenderLight} 0%, ${DS.white} 35%, ${DS.peachLight} 100%)`,
  },

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: `linear-gradient(135deg, ${DS.primary}, ${DS.primaryDark})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: DS.grey900,
    lineHeight: 1.2,
    fontFamily: DS.font,
  },
  headerSub: {
    fontSize: 11,
    color: DS.grey400,
    fontWeight: 500,
    fontFamily: DS.font,
    marginTop: 2,
  },
  scorePill: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 16px",
    backgroundColor: DS.peach,
    borderRadius: DS.radius.pill,
    border: `1px solid rgba(255,114,18,0.15)`,
  },

  // Progress
  progressRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: DS.grey200,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: `linear-gradient(90deg, ${DS.primary}, ${DS.primaryDark})`,
    borderRadius: 3,
    transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: DS.grey400,
    whiteSpace: "nowrap" as const,
    fontFamily: DS.font,
  },

  // Dots
  dotsRow: {
    display: "flex",
    justifyContent: "center",
    gap: 5,
    marginBottom: 22,
    flexWrap: "wrap" as const,
  },

  // Question card
  questionCard: {
    backgroundColor: DS.white,
    borderRadius: DS.radius.card,
    padding: "22px 24px",
    marginBottom: 18,
    boxShadow: DS.shadow.card,
    border: `1px solid ${DS.grey200}`,
    transition: "all 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative" as const,
  },
  topicTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 14px",
    borderRadius: DS.radius.tag,
    marginBottom: 14,
  },
  qNumCircle: {
    position: "absolute" as const,
    top: -10,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${DS.accent}, ${DS.accentLight})`,
    color: DS.white,
    fontSize: 11,
    fontWeight: 700,
    fontFamily: DS.font,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: DS.shadow.accent,
  },
  questionText: {
    fontSize: 15,
    fontWeight: 600,
    color: DS.grey900,
    lineHeight: 1.65,
    margin: 0,
    fontFamily: DS.font,
  },

  // Options
  optionsGrid: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
    marginBottom: 18,
  },

  // Explanation
  explanationCard: {
    backgroundColor: DS.peach,
    borderRadius: DS.radius.card,
    padding: "18px 20px",
    marginBottom: 18,
    border: `1px solid rgba(255,114,18,0.18)`,
  },
  explainHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  explainText: {
    fontSize: 13,
    color: DS.grey900,
    lineHeight: 1.75,
    margin: 0,
    fontFamily: DS.font,
    fontWeight: 400,
    paddingLeft: 38,
  },

  // Buttons — Contained (Primary)
  containedBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "0 40px",
    height: 44,
    borderRadius: DS.radius.button,
    border: "none",
    background: `linear-gradient(135deg, ${DS.primary}, ${DS.primaryDark})`,
    color: DS.white,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: DS.font,
    cursor: "pointer",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: DS.shadow.button,
    letterSpacing: "0.01em",
  },
  containedBtnHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 24px rgba(74,77,201,0.35)",
  },

  // Buttons — Highlight (Accent/Orange)
  highlightBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "0 40px",
    height: 44,
    borderRadius: DS.radius.button,
    border: "none",
    background: `linear-gradient(135deg, ${DS.accent}, ${DS.accentLight})`,
    color: DS.white,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: DS.font,
    cursor: "pointer",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: DS.shadow.accent,
    letterSpacing: "0.01em",
  },
  highlightBtnHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 24px rgba(255,114,18,0.40)",
  },

  actionRow: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 18,
  },
  footer: {
    textAlign: "center" as const,
    fontSize: 12,
    color: DS.grey400,
    fontWeight: 500,
    fontFamily: DS.font,
  },

  // Result screen
  resultCard: {
    backgroundColor: DS.white,
    borderRadius: 20,
    padding: "40px 28px",
    textAlign: "center" as const,
    boxShadow: "0 8px 40px rgba(74,77,201,0.10), 0 2px 8px rgba(0,0,0,0.03)",
    border: `1px solid ${DS.grey200}`,
    maxWidth: 480,
    margin: "30px auto",
  },
  perfectBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
    animation: "pulse 2s ease-in-out infinite",
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: DS.grey900,
    margin: "0 0 20px",
    fontFamily: DS.font,
  },
  scoreRing: {
    position: "relative" as const,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  scoreRingText: {
    position: "absolute" as const,
    display: "flex",
    alignItems: "baseline",
    gap: 2,
  },
  scoreBig: {
    fontSize: 36,
    fontWeight: 900,
    lineHeight: 1,
    fontFamily: DS.font,
  },
  scoreSmall: {
    fontSize: 16,
    fontWeight: 600,
    color: DS.grey400,
    fontFamily: DS.font,
  },
  resultSubtext: {
    fontSize: 13,
    color: DS.grey900,
    lineHeight: 1.65,
    marginBottom: 24,
    fontFamily: DS.font,
    fontWeight: 400,
    opacity: 0.7,
  },
  breakdownBox: {
    textAlign: "left" as const,
    marginBottom: 28,
    padding: "18px 20px",
    backgroundColor: DS.grey100,
    borderRadius: DS.radius.card,
  },
  breakdownTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: DS.grey400,
    margin: "0 0 14px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    fontFamily: DS.font,
  },
  breakdownRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: `1px solid ${DS.grey200}`,
  },
  breakdownLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  breakdownBadge: {
    padding: "3px 12px",
    borderRadius: DS.radius.tag,
    fontSize: 12,
    fontWeight: 700,
    fontFamily: DS.font,
  },
  confettiContainer: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none" as const,
    zIndex: 1000,
    overflow: "hidden",
  },
};

export default NumberPlayQuiz;
