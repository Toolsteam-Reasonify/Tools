// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: hcf_lcm_quiz_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

// @ts-expect-error - React types resolved by host/bundler
import React, { useState, useEffect, useCallback } from "react";

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
  primaryColor?: string;
  accentColor?: string;
  correctColor?: string;
  wrongColor?: string;
  title?: string;
  subtitle?: string;
  instructionsForStudent?: string;
  teachingNotes?: string;
  showTopicTags?: boolean;
}

interface HCFLCMQuizToolProps {
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

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  primary: "#4A4DC9",
  primaryDark: "#533086",
  accent: "#FF7212",
  accentWarm: "#FC9145",
  lightPurple: "#C1C1EA",
  lightOrange: "#FFF3E4",
  grey900: "#4E4E4E",
  grey500: "#CACACA",
  grey300: "#EBEBEB",
  grey100: "#F5F5F5",
  white: "#FFFFFF",
  correct: "#2DB87A",
  wrong: "#E5484D",
  font: "'Poppins', sans-serif",
  radius: {
    pill: "100px",
    card: "20px",
    tag: "8px",
    sm: "12px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  shadow: {
    card: "0 4px 24px rgba(74, 77, 201, 0.08), 0 1px 4px rgba(0,0,0,0.04)",
    elevated: "0 12px 40px rgba(74, 77, 201, 0.12), 0 2px 8px rgba(0,0,0,0.04)",
    button: "0 4px 16px rgba(74, 77, 201, 0.20)",
    accent: "0 4px 16px rgba(255, 114, 18, 0.25)",
  },
};

// ==================== DEFAULT QUESTIONS ====================

const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the prime factorisation of 360?",
    options: [
      "2 × 2 × 2 × 3 × 3 × 5",
      "2 × 2 × 3 × 3 × 5 × 5",
      "2 × 2 × 2 × 3 × 5 × 5",
      "2 × 3 × 3 × 3 × 5",
    ],
    correctIndex: 0,
    explanation:
      "360 = 2 × 180 = 2 × 2 × 90 = 2 × 2 × 2 × 45 = 2 × 2 × 2 × 3 × 15 = 2 × 2 × 2 × 3 × 3 × 5. Using the division method: 360 ÷ 2 = 180, 180 ÷ 2 = 90, 90 ÷ 2 = 45, 45 ÷ 3 = 15, 15 ÷ 3 = 5, 5 ÷ 5 = 1. So 360 = 2³ × 3² × 5.",
    topic: "Prime Factorisation",
  },
  {
    id: 2,
    question:
      "Which of the following is a factor of 840 = 2 × 2 × 2 × 3 × 5 × 7?",
    options: ["3 × 3 × 3", "2 × 5 × 9", "2 × 2 × 7", "2 × 2 × 2 × 2"],
    correctIndex: 2,
    explanation:
      "A number is a factor of 840 only if it can be formed as a 'subpart' of 840's prime factorisation. 840 has three 2s, one 3, one 5, and one 7. The number 2 × 2 × 7 = 28 uses two 2s and one 7 — all available in 840's factorisation — so it is a factor. The others require primes or prime powers not present in 840.",
    topic: "Factor Identification",
  },
  {
    id: 3,
    question: "Find the HCF of 225 and 750.",
    options: ["25", "75", "150", "50"],
    correctIndex: 1,
    explanation:
      "225 = 3 × 3 × 5 × 5 and 750 = 2 × 3 × 5 × 5 × 5. For the HCF, take the minimum occurrence of each common prime: min(2,1) = 1 three, and min(2,3) = 2 fives. HCF = 3 × 5 × 5 = 75.",
    topic: "HCF Computation",
  },
  {
    id: 4,
    question: "Find the LCM of 96 and 360.",
    options: ["720", "1440", "2880", "960"],
    correctIndex: 1,
    explanation:
      "96 = 2⁵ × 3 and 360 = 2³ × 3² × 5. For the LCM, take the maximum occurrence of each prime: max(5,3) = 5 twos, max(1,2) = 2 threes, max(0,1) = 1 five. LCM = 2⁵ × 3² × 5 = 32 × 9 × 5 = 1440.",
    topic: "LCM Computation",
  },
  {
    id: 5,
    question: "Two numbers have no common prime factors. Their HCF is:",
    options: [
      "Equal to the smaller number",
      "Equal to the larger number",
      "1",
      "Equal to their product",
    ],
    correctIndex: 2,
    explanation:
      "When two numbers share no common prime factors, they are called co-prime numbers. The only factor common to every pair of numbers is 1. Since there are no shared primes, the HCF must be 1. For example, 96 = 2⁵ × 3 and 275 = 5² × 11 have HCF = 1.",
    topic: "Co-prime Numbers",
  },
  {
    id: 6,
    question: "If HCF(a, b) = 15 and LCM(a, b) = 315, what is a × b?",
    options: ["4725", "300", "21", "330"],
    correctIndex: 0,
    explanation:
      "The product property states: HCF × LCM = Product of the two numbers. So a × b = 15 × 315 = 4725. This works because the HCF captures the common prime subpart, and the LCM captures all primes at maximum power; together they exactly reconstruct the product.",
    topic: "Product Property",
  },
  {
    id: 7,
    question: "The LCM of two different prime numbers m and n is always:",
    options: [
      "Less than both m and n",
      "Equal to m + n",
      "Equal to m × n",
      "Less than m × n",
    ],
    correctIndex: 2,
    explanation:
      "Since m and n are different primes, they share no common factors other than 1 (they are co-prime). The LCM must contain both primes, so LCM = m × n. For instance, LCM(7, 11) = 77 = 7 × 11. The LCM cannot be less than m × n because removing either prime would lose divisibility by that prime.",
    topic: "LCM of Primes",
  },
  {
    id: 8,
    question:
      "72 = 6 × 12 and 144 = 8 × 18. Since 6, 12, 8, 18 are all different, can we say these numbers have no common factor other than 1?",
    options: [
      "Yes, composite factorisations show no overlap",
      "No — composite factorisations can hide common primes",
      "Yes, because 72 and 144 are in the ratio 1:2",
      "Cannot be determined",
    ],
    correctIndex: 1,
    explanation:
      "Factorising into composites can be misleading! We must use prime factorisation: 72 = 2³ × 3² and 144 = 2⁴ × 3². Both share 2s and 3s, giving HCF = 2³ × 3² = 72. So 72 is actually a factor of 144. Never rely on composite factorisations to judge common factors.",
    topic: "Composite Factor Caution",
  },
  {
    id: 9,
    question:
      "Using the simultaneous division method for 84 and 180, what is the HCF?",
    options: ["6", "12", "18", "36"],
    correctIndex: 1,
    explanation:
      "Divide both by common primes step by step: 84 and 180 ÷ 2 → 42 and 90; ÷ 2 → 21 and 45; ÷ 3 → 7 and 15. Now 7 and 15 share no common prime. HCF = 2 × 2 × 3 = 12. This efficient procedure extracts all common prime factors at once.",
    topic: "Simultaneous Division",
  },
  {
    id: 10,
    question:
      "A box measures 12 cm × 18 cm × 36 cm. Which cube size can pack it without gaps?",
    options: ["9 cm", "4 cm", "6 cm", "8 cm"],
    correctIndex: 2,
    explanation:
      "The cube side must be a common factor of 12, 18, and 36. HCF(12, 18, 36): 12 = 2² × 3, 18 = 2 × 3², 36 = 2² × 3². HCF = 2 × 3 = 6. So 6 cm cubes fit perfectly: 2 along length, 3 along width, 6 along height. Among the options, 6 cm divides all three dimensions evenly.",
    topic: "Word Problem — Cube Packing",
  },
  {
    id: 11,
    question:
      "A cowherd has fewer than 200 cows. Equal groups pass through gates of 3, then 5, then 7. How many cows does he have?",
    options: ["35", "105", "210", "70"],
    correctIndex: 1,
    explanation:
      "The number of cows must be divisible by 3, 5, and 7. LCM(3, 5, 7) = 3 × 5 × 7 = 105, since all three are prime. The multiples of 105 are 105, 210, 315, … Only 105 is less than 200. So the cowherd has 105 cows. This problem comes from Karnataka folklore mathematics!",
    topic: "Word Problem — Cowherd",
  },
  {
    id: 12,
    question: "If both numbers are doubled, what happens to their HCF?",
    options: [
      "HCF stays the same",
      "HCF is halved",
      "HCF is doubled",
      "HCF is quadrupled",
    ],
    correctIndex: 2,
    explanation:
      "Doubling both numbers introduces an extra factor of 2 in each prime factorisation. This extra 2 becomes part of the largest common subpart. For example, HCF(270, 50) = 10. After doubling: HCF(540, 100) = 20. The HCF doubles because each number gains one additional factor of 2.",
    topic: "HCF Doubling Property",
  },
];

// ==================== GEOMETRIC DECORATIONS (SVG) ====================

const GeoCircle: React.FC<{
  size?: number;
  color?: string;
  filled?: boolean;
  style?: React.CSSProperties;
}> = ({ size = 48, color = DS.lightPurple, filled = false, style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    style={{ ...style, flexShrink: 0 }}
  >
    <circle
      cx="24"
      cy="24"
      r="20"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth="2.5"
      opacity="0.5"
    />
  </svg>
);

const GeoTriangle: React.FC<{
  size?: number;
  color?: string;
  filled?: boolean;
  style?: React.CSSProperties;
}> = ({ size = 48, color = DS.accentWarm, filled = false, style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    style={{ ...style, flexShrink: 0 }}
  >
    <polygon
      points="24,6 42,42 6,42"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth="2.5"
      strokeLinejoin="round"
      opacity="0.45"
    />
  </svg>
);

const GeoSquare: React.FC<{
  size?: number;
  color?: string;
  filled?: boolean;
  style?: React.CSSProperties;
}> = ({ size = 48, color = DS.lightPurple, filled = false, style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    style={{ ...style, flexShrink: 0 }}
  >
    <rect
      x="8"
      y="8"
      width="32"
      height="32"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth="2.5"
      rx="2"
      opacity="0.45"
    />
  </svg>
);

// ==================== MAIN COMPONENT ====================

type PropsConfig = NonNullable<HCFLCMQuizToolProps["props"]>;

const HCFLCMQuizTool: React.FC<HCFLCMQuizToolProps> = ({
  props = {} as PropsConfig,
}) => {
  const additionalProps = (props.additionalProps || {}) as QuizAdditionalProps;

  const {
    questions = DEFAULT_QUESTIONS,
    primaryColor = DS.primary,
    accentColor = DS.accent,
    correctColor = DS.correct,
    wrongColor = DS.wrong,
    title = "HCF & LCM Review Quiz",
    subtitle = "Grade 7  •  Ganita Prakash  •  Chapter 3: Finding Common Ground",
    instructionsForStudent = "Test your mastery of Chapter 3 with 12 questions covering all major concepts. Read each explanation carefully after answering!",
    showTopicTags = true,
  } = additionalProps;

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [animPhase, setAnimPhase] = useState<"enter" | "idle" | "exit">(
    "enter",
  );
  const [showIntro, setShowIntro] = useState(true);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [celebrateCorrect, setCelebrateCorrect] = useState(false);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false),
  );
  const [correctQuestions, setCorrectQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false),
  );
  const [startHover, setStartHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);
  const [restartHover, setRestartHover] = useState(false);

  const totalQ = questions.length;
  const q = questions[currentQ];

  // Inject keyframes + Poppins
  useEffect(() => {
    const id = "singularity-quiz-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

            @keyframes sg-fadeInUp {
                from { opacity: 0; transform: translateY(28px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes sg-fadeOutUp {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-20px); }
            }
            @keyframes sg-popIn {
                0% { transform: scale(0); opacity: 0; }
                70% { transform: scale(1.08); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes sg-slideUp {
                from { opacity: 0; transform: translateY(40px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes sg-shake {
                0%, 100% { transform: translateX(0); }
                15% { transform: translateX(-7px); }
                30% { transform: translateX(7px); }
                45% { transform: translateX(-5px); }
                60% { transform: translateX(5px); }
                75% { transform: translateX(-2px); }
                90% { transform: translateX(2px); }
            }
            @keyframes sg-confetti {
                0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
                100% { transform: translateY(-100px) rotate(540deg) scale(0); opacity: 0; }
            }
            @keyframes sg-bounceIn {
                0% { transform: scale(0.4); opacity: 0; }
                50% { transform: scale(1.06); }
                70% { transform: scale(0.96); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes sg-float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-8px) rotate(3deg); }
            }
            @keyframes sg-float2 {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-6px) rotate(-4deg); }
            }
            @keyframes sg-spin {
                from { transform: rotate(0deg) scale(0); opacity: 0; }
                to { transform: rotate(360deg) scale(1); opacity: 1; }
            }
            @keyframes sg-pulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(74, 77, 201, 0.3); }
                50% { box-shadow: 0 0 0 8px rgba(74, 77, 201, 0); }
            }
            @keyframes sg-gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(id);
      if (el) document.head.removeChild(el);
    };
  }, []);

  useEffect(() => {
    setAnimPhase("enter");
    const t = setTimeout(() => setAnimPhase("idle"), 500);
    return () => clearTimeout(t);
  }, [currentQ]);

  const handleSelect = useCallback(
    (idx: number) => {
      if (answered) return;
      setSelected(idx);
      setAnswered(true);

      const isCorrect = idx === q.correctIndex;
      const newAnswered = [...answeredQuestions];
      newAnswered[currentQ] = true;
      setAnsweredQuestions(newAnswered);

      if (isCorrect) {
        setScore((s) => s + 1);
        setCelebrateCorrect(true);
        const newCorrect = [...correctQuestions];
        newCorrect[currentQ] = true;
        setCorrectQuestions(newCorrect);
        setTimeout(() => setCelebrateCorrect(false), 1200);
      } else {
        setShakeWrong(true);
        setTimeout(() => setShakeWrong(false), 600);
      }

      setTimeout(() => setShowExplanation(true), 450);
    },
    [answered, q, currentQ, answeredQuestions, correctQuestions],
  );

  const handleNext = useCallback(() => {
    if (currentQ < totalQ - 1) {
      setAnimPhase("exit");
      setTimeout(() => {
        setCurrentQ((c) => c + 1);
        setSelected(null);
        setAnswered(false);
        setShowExplanation(false);
        setAnimPhase("enter");
      }, 280);
    } else {
      setQuizComplete(true);
    }
  }, [currentQ, totalQ]);

  const handleRestart = useCallback(() => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setShowExplanation(false);
    setScore(0);
    setQuizComplete(false);
    setShowIntro(true);
    setAnsweredQuestions(new Array(questions.length).fill(false));
    setCorrectQuestions(new Array(questions.length).fill(false));
  }, [questions.length]);

  const progressPct = ((currentQ + (answered ? 1 : 0)) / totalQ) * 100;
  const optionLabels = ["A", "B", "C", "D"];

  // ==================== SHARED STYLES ====================

  const containerStyle: React.CSSProperties = {
    fontFamily: DS.font,
    maxWidth: "700px",
    margin: "0 auto",
    padding: "20px",
    minHeight: "100vh",
    background: DS.grey100,
    position: "relative",
    overflow: "hidden",
  };

  const cardStyle: React.CSSProperties = {
    background: DS.white,
    borderRadius: DS.radius.card,
    padding: "36px 32px",
    boxShadow: DS.shadow.card,
    position: "relative",
    overflow: "hidden",
  };

  const containedBtnStyle = (
    hover: boolean,
    disabled?: boolean,
  ): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    height: "48px",
    padding: "0 32px",
    borderRadius: DS.radius.pill,
    border: "none",
    backgroundColor: disabled
      ? DS.grey300
      : hover
        ? DS.primaryDark
        : primaryColor,
    color: disabled ? DS.grey500 : DS.white,
    fontFamily: DS.font,
    fontSize: "15px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: disabled
      ? "none"
      : hover
        ? DS.shadow.elevated
        : DS.shadow.button,
    transform: hover && !disabled ? "translateY(-1px)" : "translateY(0)",
    letterSpacing: "0.2px",
  });

  const highlightBtnStyle = (hover: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    height: "48px",
    padding: "0 32px",
    borderRadius: DS.radius.pill,
    border: "none",
    backgroundColor: hover ? "#e5650f" : accentColor,
    color: DS.white,
    fontFamily: DS.font,
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: hover ? "0 8px 24px rgba(255,114,18,0.35)" : DS.shadow.accent,
    transform: hover ? "translateY(-1px)" : "translateY(0)",
    letterSpacing: "0.2px",
  });

  // ==================== INTRO SCREEN ====================
  if (showIntro) {
    return (
      <div style={containerStyle}>
        {/* Floating geometric decorations */}
        <GeoCircle
          size={64}
          color={DS.lightPurple}
          filled
          style={{
            position: "absolute",
            top: "40px",
            right: "30px",
            animation: "sg-float 4s ease-in-out infinite",
            opacity: 0.35,
          }}
        />
        <GeoTriangle
          size={52}
          color={DS.accentWarm}
          filled
          style={{
            position: "absolute",
            top: "120px",
            left: "15px",
            animation: "sg-float2 5s ease-in-out infinite",
            opacity: 0.3,
          }}
        />
        <GeoSquare
          size={40}
          color={DS.lightPurple}
          style={{
            position: "absolute",
            bottom: "120px",
            right: "40px",
            animation: "sg-float 6s ease-in-out infinite",
            opacity: 0.25,
          }}
        />
        <GeoCircle
          size={36}
          color={DS.accentWarm}
          style={{
            position: "absolute",
            bottom: "80px",
            left: "25px",
            animation: "sg-float2 4.5s ease-in-out infinite",
            opacity: 0.25,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "calc(100vh - 40px)",
          }}
        >
          <div
            style={{
              ...cardStyle,
              padding: "48px 40px",
              textAlign: "center",
              animation: "sg-bounceIn 0.7s ease-out",
            }}
          >
            {/* Top gradient bar — indigo to orange */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "5px",
                background: `linear-gradient(90deg, ${primaryColor}, ${DS.primaryDark}, ${accentColor})`,
                backgroundSize: "200% 100%",
                animation: "sg-gradientShift 4s ease infinite",
                borderRadius: `${DS.radius.card} ${DS.radius.card} 0 0`,
              }}
            />

            {/* Icon cluster */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px",
                marginTop: "8px",
              }}
            >
              <GeoTriangle
                size={32}
                color={DS.accentWarm}
                filled
                style={{ animation: "sg-popIn 0.5s ease-out 0.2s both" }}
              />
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: `linear-gradient(135deg, ${primaryColor}, ${DS.primaryDark})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  animation: "sg-popIn 0.5s ease-out 0.1s both",
                  boxShadow: DS.shadow.button,
                }}
              >
                🧮
              </div>
              <GeoCircle
                size={32}
                color={DS.lightPurple}
                filled
                style={{ animation: "sg-popIn 0.5s ease-out 0.3s both" }}
              />
            </div>

            <h1
              style={{
                fontFamily: DS.font,
                fontSize: "26px",
                fontWeight: 800,
                color: DS.grey900,
                marginBottom: "6px",
                letterSpacing: "-0.3px",
                animation: "sg-fadeInUp 0.5s ease-out 0.15s both",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: DS.grey500,
                fontWeight: 500,
                marginBottom: "28px",
                letterSpacing: "0.3px",
                animation: "sg-fadeInUp 0.5s ease-out 0.2s both",
              }}
            >
              {subtitle}
            </p>

            {/* Instructions card */}
            <div
              style={{
                background: DS.lightOrange,
                borderRadius: DS.radius.sm,
                padding: "18px 22px",
                marginBottom: "30px",
                textAlign: "left",
                border: `1.5px solid ${DS.accentWarm}25`,
                animation: "sg-fadeInUp 0.5s ease-out 0.25s both",
              }}
            >
              <p
                style={{
                  fontSize: "13.5px",
                  color: DS.grey900,
                  lineHeight: "1.7",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                📝 &nbsp;{instructionsForStudent}
              </p>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "40px",
                marginBottom: "36px",
              }}
            >
              {[
                { num: totalQ, label: "Questions", color: primaryColor },
                { num: 4, label: "Options", color: DS.accentWarm },
                { num: "∞", label: "Retries", color: DS.primaryDark },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    animation: `sg-popIn 0.5s ease-out ${0.3 + i * 0.1}s both`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 800,
                      color: item.color,
                      lineHeight: "1.2",
                    }}
                  >
                    {item.num}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: DS.grey500,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "1.2px",
                      marginTop: "2px",
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Start button — highlight/accent style */}
            <button
              onClick={() => setShowIntro(false)}
              onMouseEnter={() => setStartHover(true)}
              onMouseLeave={() => setStartHover(false)}
              style={{
                ...highlightBtnStyle(startHover),
                height: "52px",
                padding: "0 44px",
                fontSize: "16px",
                fontWeight: 700,
                animation: "sg-fadeInUp 0.5s ease-out 0.5s both",
              }}
            >
              Start Quiz &nbsp;→
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== COMPLETION SCREEN ====================
  if (quizComplete) {
    const pct = Math.round((score / totalQ) * 100);
    const emoji = pct >= 90 ? "🏆" : pct >= 70 ? "🌟" : pct >= 50 ? "👍" : "💪";
    const message =
      pct >= 90
        ? "Outstanding!"
        : pct >= 70
          ? "Great Work!"
          : pct >= 50
            ? "Good Effort!"
            : "Keep Practising!";
    const ringColor = pct >= 50 ? correctColor : wrongColor;

    return (
      <div style={containerStyle}>
        <GeoTriangle
          size={56}
          color={DS.accentWarm}
          filled
          style={{
            position: "absolute",
            top: "50px",
            right: "25px",
            animation: "sg-float 4s ease-in-out infinite",
            opacity: 0.25,
          }}
        />
        <GeoSquare
          size={44}
          color={DS.lightPurple}
          filled
          style={{
            position: "absolute",
            bottom: "100px",
            left: "20px",
            animation: "sg-float2 5s ease-in-out infinite",
            opacity: 0.2,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "calc(100vh - 40px)",
          }}
        >
          <div
            style={{
              ...cardStyle,
              padding: "48px 40px",
              textAlign: "center",
              animation: "sg-bounceIn 0.7s ease-out",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "5px",
                background: `linear-gradient(90deg, ${correctColor}, ${primaryColor}, ${accentColor})`,
                borderRadius: `${DS.radius.card} ${DS.radius.card} 0 0`,
              }}
            />

            <div
              style={{
                fontSize: "56px",
                marginBottom: "4px",
                animation: "sg-spin 0.7s ease-out",
              }}
            >
              {emoji}
            </div>

            <h2
              style={{
                fontFamily: DS.font,
                fontSize: "28px",
                fontWeight: 800,
                color: DS.grey900,
                marginBottom: "4px",
              }}
            >
              {message}
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: DS.grey500,
                marginBottom: "28px",
                fontWeight: 500,
              }}
            >
              You scored{" "}
              <strong style={{ color: primaryColor }}>{score}</strong> out of{" "}
              <strong>{totalQ}</strong>
            </p>

            {/* Score ring */}
            <div
              style={{
                width: "140px",
                height: "140px",
                margin: "0 auto 28px",
                position: "relative",
              }}
            >
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r="58"
                  fill="none"
                  stroke={DS.grey300}
                  strokeWidth="9"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="58"
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - pct / 100)}`}
                  transform="rotate(-90 70 70)"
                  style={{
                    transition:
                      "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontFamily: DS.font,
                  fontSize: "34px",
                  fontWeight: 800,
                  color: ringColor,
                }}
              >
                {pct}%
              </div>
            </div>

            {/* Question breakdown pills */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "32px",
              }}
            >
              {questions.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 700,
                    fontFamily: DS.font,
                    color: DS.white,
                    backgroundColor: correctQuestions[i]
                      ? correctColor
                      : wrongColor,
                    animation: `sg-popIn 0.4s ease-out ${i * 0.05}s both`,
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <button
              onClick={handleRestart}
              onMouseEnter={() => setRestartHover(true)}
              onMouseLeave={() => setRestartHover(false)}
              style={containedBtnStyle(restartHover)}
            >
              🔄 &nbsp;Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== QUIZ SCREEN ====================

  const getOptionStyle = (idx: number): React.CSSProperties => {
    const isHovered = hoverIdx === idx;
    const isCorrectOpt = idx === q.correctIndex;
    const isSelectedWrong = idx === selected && idx !== q.correctIndex;

    const base: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      padding: "14px 18px",
      borderRadius: DS.radius.sm,
      border: "2px solid",
      cursor: answered ? "default" : "pointer",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      fontFamily: DS.font,
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: "1.55",
      position: "relative" as const,
      animation: `sg-fadeInUp 0.4s ease-out ${0.1 + idx * 0.08}s both`,
    };

    if (!answered) {
      return {
        ...base,
        borderColor: isHovered ? primaryColor : DS.grey300,
        backgroundColor: isHovered ? `${primaryColor}08` : DS.white,
        color: DS.grey900,
        transform: isHovered ? "translateX(4px)" : "translateX(0)",
        boxShadow: isHovered ? `0 2px 12px ${primaryColor}12` : "none",
      };
    }

    if (isCorrectOpt) {
      return {
        ...base,
        borderColor: correctColor,
        backgroundColor: `${correctColor}10`,
        color: "#1a6b45",
        boxShadow: `0 2px 16px ${correctColor}18`,
      };
    }

    if (isSelectedWrong) {
      return {
        ...base,
        borderColor: wrongColor,
        backgroundColor: `${wrongColor}08`,
        color: "#a1232b",
        animation: shakeWrong ? "sg-shake 0.5s ease-in-out" : base.animation,
      };
    }

    return {
      ...base,
      borderColor: DS.grey300,
      backgroundColor: DS.grey100,
      color: DS.grey500,
      opacity: 0.55,
    };
  };

  const getLabelStyle = (idx: number): React.CSSProperties => {
    const isCorrectOpt = idx === q.correctIndex;
    const isSelectedWrong = idx === selected && idx !== q.correctIndex;
    const isHovered = hoverIdx === idx;

    const baseLbl: React.CSSProperties = {
      minWidth: "32px",
      height: "32px",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "13px",
      fontWeight: 700,
      fontFamily: DS.font,
      transition: "all 0.25s ease",
      flexShrink: 0,
    };

    if (!answered) {
      return {
        ...baseLbl,
        backgroundColor: isHovered ? primaryColor : DS.grey100,
        color: isHovered ? DS.white : DS.grey900,
      };
    }

    if (isCorrectOpt)
      return { ...baseLbl, backgroundColor: correctColor, color: DS.white };
    if (isSelectedWrong)
      return { ...baseLbl, backgroundColor: wrongColor, color: DS.white };
    return { ...baseLbl, backgroundColor: DS.grey300, color: DS.grey500 };
  };

  return (
    <div style={containerStyle}>
      {/* Background geo decorations */}
      <GeoCircle
        size={40}
        color={DS.lightPurple}
        style={{
          position: "absolute",
          top: "60px",
          right: "16px",
          animation: "sg-float 5s ease-in-out infinite",
          opacity: 0.2,
        }}
      />
      <GeoTriangle
        size={32}
        color={DS.accentWarm}
        style={{
          position: "absolute",
          top: "180px",
          left: "10px",
          animation: "sg-float2 4.5s ease-in-out infinite",
          opacity: 0.18,
        }}
      />

      {/* ===== TOP BAR ===== */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          padding: "0 2px",
        }}
      >
        {/* Question counter — outlined pill */}
        <div
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: primaryColor,
            border: `1.5px solid ${primaryColor}`,
            borderRadius: DS.radius.pill,
            padding: "5px 16px",
            fontFamily: DS.font,
            letterSpacing: "0.3px",
          }}
        >
          {currentQ + 1} / {totalQ}
        </div>

        {/* Score — contained pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "12px",
            fontWeight: 700,
            color: DS.white,
            backgroundColor: correctColor,
            borderRadius: DS.radius.pill,
            padding: "5px 16px",
            fontFamily: DS.font,
          }}
        >
          <span style={{ fontSize: "11px" }}>✓</span> {score}
        </div>
      </div>

      {/* ===== PROGRESS BAR ===== */}
      <div
        style={{
          height: "6px",
          backgroundColor: DS.grey300,
          borderRadius: "3px",
          marginBottom: "18px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressPct}%`,
            background: `linear-gradient(90deg, ${primaryColor}, ${DS.accentWarm})`,
            borderRadius: "3px",
            transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>

      {/* ===== QUESTION CARD ===== */}
      <div
        style={{
          ...cardStyle,
          padding: "28px 26px 24px",
          marginBottom: "14px",
          animation:
            animPhase === "enter"
              ? "sg-fadeInUp 0.4s ease-out"
              : animPhase === "exit"
                ? "sg-fadeOutUp 0.28s ease-in"
                : "none",
        }}
      >
        {/* Gradient top line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
            borderRadius: `${DS.radius.card} ${DS.radius.card} 0 0`,
          }}
        />

        {/* Topic tag */}
        {showTopicTags && (
          <div
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: DS.radius.pill,
              fontSize: "10.5px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              color: primaryColor,
              backgroundColor: `${DS.lightPurple}40`,
              marginBottom: "14px",
              fontFamily: DS.font,
            }}
          >
            {q.topic}
          </div>
        )}

        {/* Question text */}
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: DS.grey900,
            lineHeight: "1.65",
            margin: "0 0 22px 0",
            fontFamily: DS.font,
            animation: "sg-fadeInUp 0.4s ease-out 0.05s both",
          }}
        >
          {q.question}
        </h2>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {q.options.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(idx)}
              onMouseEnter={() => !answered && setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx(null)}
              style={getOptionStyle(idx)}
            >
              <div style={getLabelStyle(idx)}>
                {answered && idx === q.correctIndex
                  ? "✓"
                  : answered && idx === selected && idx !== q.correctIndex
                    ? "✗"
                    : optionLabels[idx]}
              </div>
              <span style={{ flex: 1 }}>{opt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confetti particles */}
      {celebrateCorrect && (
        <div
          style={{
            position: "fixed",
            top: "45%",
            left: "50%",
            pointerEvents: "none",
            zIndex: 100,
          }}
        >
          {["🎉", "⭐", "✨", "🎊", "💫", "🌟", "✅", "🔥"].map((e, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                fontSize: "22px",
                animation: `sg-confetti 1s ease-out ${i * 0.06}s both`,
                left: `${Math.cos(i * 0.8) * 50}px`,
                top: `${Math.sin(i * 0.8) * 50}px`,
              }}
            >
              {e}
            </span>
          ))}
        </div>
      )}

      {/* ===== EXPLANATION PANEL ===== */}
      {showExplanation && (
        <div
          style={{
            ...cardStyle,
            padding: "22px 24px",
            marginBottom: "14px",
            animation: "sg-slideUp 0.45s ease-out",
            borderLeft: `4px solid ${selected === q.correctIndex ? correctColor : accentColor}`,
            borderRadius: `4px ${DS.radius.card} ${DS.radius.card} 4px`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "8px",
                backgroundColor:
                  selected === q.correctIndex
                    ? `${correctColor}15`
                    : DS.lightOrange,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
              }}
            >
              {selected === q.correctIndex ? "💡" : "📖"}
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: selected === q.correctIndex ? correctColor : accentColor,
                textTransform: "uppercase",
                letterSpacing: "0.7px",
                fontFamily: DS.font,
              }}
            >
              {selected === q.correctIndex ? "Correct!" : "Explanation"}
            </span>
          </div>
          <p
            style={{
              fontSize: "13.5px",
              color: DS.grey900,
              lineHeight: "1.75",
              margin: 0,
              fontWeight: 400,
              fontFamily: DS.font,
            }}
          >
            {q.explanation}
          </p>
        </div>
      )}

      {/* ===== NEXT BUTTON ===== */}
      {answered && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            animation: "sg-fadeInUp 0.35s ease-out 0.15s both",
            marginBottom: "12px",
          }}
        >
          <button
            onClick={handleNext}
            onMouseEnter={() => setNextHover(true)}
            onMouseLeave={() => setNextHover(false)}
            style={highlightBtnStyle(nextHover)}
          >
            {currentQ < totalQ - 1 ? "Next Question →" : "See Results 🎯"}
          </button>
        </div>
      )}

      {/* ===== DOT PROGRESS INDICATORS ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "6px",
          marginTop: "8px",
          flexWrap: "wrap",
        }}
      >
        {questions.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === currentQ ? "22px" : "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: answeredQuestions[i]
                ? correctQuestions[i]
                  ? correctColor
                  : wrongColor
                : i === currentQ
                  ? primaryColor
                  : DS.grey300,
              transition: "all 0.4s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HCFLCMQuizTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
