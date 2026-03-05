// @ts-ignore - react types resolved by project
import React, { useState, useEffect, useRef, useCallback } from "react";
// @ts-ignore - lucide-react types resolved by project
import {
  Check,
  X,
  ChevronRight,
  Star,
  RotateCcw,
  Award,
  BookOpen,
  Plus,
  Sparkles,
  Trophy,
  ArrowRight,
  // @ts-ignore
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  propertyName: string;
  explanation: string;
}

interface QuizAdditionalProps {
  questions?: QuizQuestion[];
  title?: string;
  subtitle?: string;
  instructionsForStudent?: string;
  teachingNotes?: string;
  passingScore?: number;
}

interface StepDetails {
  totalSteps: number;
  currentStep: number;
  isPlaying: boolean;
}

interface IntegerPropertiesQuizProps {
  props?: {
    width?: number;
    height?: number;
    themeColor?: string;
    darkMode?: boolean;
    animationSpeed?: number;
    additionalProps?: QuizAdditionalProps;
  };
  setStepDetails?: (stepDetails: StepDetails) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EASING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT QUIZ DATA
// ═══════════════════════════════════════════════════════════════════════════════

const defaultQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      'Rahul says: "1 × (−73) equals −73." Priya says: "No, the identity property only works for positive numbers." Who is correct?',
    options: [
      "Priya is correct — 1 × (−73) is +73",
      "Rahul is correct — 1 × (−73) = −73",
      "Neither — 1 × (−73) = 0",
      "Both are partially correct",
    ],
    correctIndex: 1,
    propertyName: "Multiplicative Identity Property",
    explanation:
      "1 × a = a for every integer a, whether positive or negative. So 1 × (−73) = −73. The identity property holds for all integers, not just positive ones.",
  },
  {
    id: 2,
    question:
      "Anita calculated 38 × (−5) = −190. Without doing the full multiplication, what is (−5) × 38?",
    options: ["+190", "−190", "−38", "+5"],
    correctIndex: 1,
    propertyName: "Commutative Property",
    explanation:
      "By the Commutative Property, a × b = b × a. Swapping the multiplier and multiplicand does not change the product. So (−5) × 38 = 38 × (−5) = −190.",
  },
  {
    id: 3,
    question: "What is (−1) × 47?",
    options: ["47", "−47", "1", "0"],
    correctIndex: 1,
    propertyName: "Multiplication by −1 (Sign-Flipper)",
    explanation:
      "Multiplying any integer by −1 gives its additive inverse: (−1) × a = −a. So (−1) × 47 = −47. This is the 'sign-flipper' rule — it flips the sign of the number.",
  },
  {
    id: 4,
    question:
      "Priya knows that (−12) × 9 = −108. She needs to find 9 × (−12). What should she write?",
    options: ["+108", "−108", "−12", "Cannot determine without calculating"],
    correctIndex: 1,
    propertyName: "Commutative Property",
    explanation:
      "The Commutative Property tells us a × b = b × a. The order of multiplication does not change the result. So 9 × (−12) = (−12) × 9 = −108.",
  },
  {
    id: 5,
    question: "What is (−1) × (−38)?",
    options: ["−38", "−1", "+38", "0"],
    correctIndex: 2,
    propertyName: "Multiplication by −1 (Double Negative)",
    explanation:
      "The rule (−1) × a = −a gives the additive inverse. When a = −38, the additive inverse of −38 is +38. So (−1) × (−38) = +38. Multiplying a negative by −1 'flips' the sign back to positive!",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SINGULARITY DESIGN SYSTEM COLORS
// ═══════════════════════════════════════════════════════════════════════════════

const S = {
  indigo: "#4A4DC9",
  indigoHover: "#3B3EAF",
  indigoPressed: "#2F3196",
  indigoSoft: "#C1C1EA",
  indigoGhost: "#EEEEF8",
  orange: "#FF7212",
  orangeMid: "#FC9145",
  orangeSoft: "#FFF3E4",
  orangeHover: "#E56000",
  purple: "#533086",
  purpleSoft: "#D4C2E8",
  dark: "#1A1A2E",
  gray700: "#4E4E4E",
  gray400: "#8A8A8A",
  gray300: "#CACACA",
  gray200: "#EBEBEB",
  gray100: "#F5F5F5",
  white: "#FFFFFF",
  success: "#22C55E",
  successSoft: "#DCFCE7",
  successDark: "#166534",
  error: "#EF4444",
  errorSoft: "#FEE2E2",
  errorDark: "#991B1B",
  gold: "#F59E0B",
  goldSoft: "#FEF3C7",
  gradientPrimary: "linear-gradient(135deg, #533086, #4A4DC9)",
  gradientAccent: "linear-gradient(135deg, #FC9145, #FF7212)",
  gradientMixed: "linear-gradient(135deg, #533086, #FC9145)",
  gradientSubtle: "linear-gradient(135deg, #F5F5F5, #EEEEF8)",
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

type PropsShape = NonNullable<IntegerPropertiesQuizProps["props"]>;
const IntegerPropertiesQuiz: React.FC<IntegerPropertiesQuizProps> = ({
  props = {} as PropsShape,
  setStepDetails,
}) => {
  const { additionalProps = {} } = props;
  const questions = additionalProps.questions || defaultQuestions;
  const title = additionalProps.title || "Integer Properties Quiz";
  const subtitle =
    additionalProps.subtitle || "Identity · Sign-Flipper · Commutativity";
  const passingScore = additionalProps.passingScore || 3;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null),
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [questionAnim, setQuestionAnim] = useState(false);
  const [optionAnims, setOptionAnims] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [explanationAnim, setExplanationAnim] = useState(false);
  const [resultAnim, setResultAnim] = useState(false);
  const [introAnim, setIntroAnim] = useState(false);
  const [shakeWrong, setShakeWrong] = useState<number | null>(null);
  const [popCorrect, setPopCorrect] = useState<number | null>(null);
  const [starAnims, setStarAnims] = useState<boolean[]>([]);
  const [confettiPieces, setConfettiPieces] = useState<
    Array<{
      x: number;
      y: number;
      color: string;
      delay: number;
      rotation: number;
      size: number;
    }>
  >([]);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
      @keyframes s_fadeInUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes s_fadeInDown { from { opacity: 0; transform: translateY(-18px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes s_scaleIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
      @keyframes s_shake { 0%, 100% { transform: translateX(0); } 15%, 45%, 75% { transform: translateX(-5px); } 30%, 60%, 90% { transform: translateX(5px); } }
      @keyframes s_popBounce { 0% { transform: scale(1); } 25% { transform: scale(1.06); } 50% { transform: scale(0.98); } 100% { transform: scale(1); } }
      @keyframes s_starPop { 0% { opacity: 0; transform: scale(0) rotate(-20deg); } 60% { opacity: 1; transform: scale(1.25) rotate(8deg); } 100% { opacity: 1; transform: scale(1) rotate(0deg); } }
      @keyframes s_confettiFall { 0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); } 100% { opacity: 0; transform: translateY(500px) rotate(900deg) scale(0.3); } }
      @keyframes s_slideDown { from { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; } to { opacity: 1; max-height: 400px; padding-top: 20px; padding-bottom: 20px; } }
      @keyframes s_float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(2deg); } }
      @keyframes s_floatSlow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
      @keyframes s_tickDraw { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
      @keyframes s_crossDraw { from { stroke-dashoffset: 20; } to { stroke-dashoffset: 0; } }
      @keyframes s_gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      @keyframes s_morphIn { 0% { opacity: 0; transform: translateY(60px) scale(0.9); filter: blur(4px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
    `;
    document.head.appendChild(style);
    styleRef.current = style;
    return () => {
      if (styleRef.current) document.head.removeChild(styleRef.current);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => setIntroAnim(true), 100);
  }, []);

  const triggerQuestionAnim = useCallback(() => {
    setQuestionAnim(false);
    setOptionAnims([false, false, false, false]);
    setShowExplanation(false);
    setExplanationAnim(false);
    setSelectedAnswer(null);
    setShakeWrong(null);
    setPopCorrect(null);
    setTimeout(() => setQuestionAnim(true), 50);
    [0, 1, 2, 3].forEach((i) => {
      setTimeout(
        () => {
          setOptionAnims((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        },
        200 + i * 100,
      );
    });
  }, []);

  useEffect(() => {
    if (phase === "quiz") triggerQuestionAnim();
  }, [currentQuestion, phase, triggerQuestionAnim]);
  useEffect(() => {
    if (setStepDetails)
      setStepDetails({
        totalSteps: questions.length,
        currentStep: currentQuestion + 1,
        isPlaying: phase === "quiz",
      });
  }, [currentQuestion, phase, questions.length, setStepDetails]);

  const score = answers.filter(
    (a, i) => a === questions[i].correctIndex,
  ).length;
  const starRating =
    score === 5
      ? 5
      : score >= 4
        ? 4
        : score >= 3
          ? 3
          : score >= 2
            ? 2
            : score >= 1
              ? 1
              : 0;
  const progressPercentage =
    ((currentQuestion + (selectedAnswer !== null ? 1 : 0)) / questions.length) *
    100;

  const handleStartQuiz = () => {
    setPhase("quiz");
    setCurrentQuestion(0);
  };

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index;
    setAnswers(newAnswers);
    if (index === questions[currentQuestion].correctIndex) {
      setPopCorrect(index);
    } else {
      setShakeWrong(index);
      setTimeout(() => setShakeWrong(null), 600);
    }
    setTimeout(() => {
      setShowExplanation(true);
      setTimeout(() => setExplanationAnim(true), 50);
    }, 450);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setPhase("result");
      setResultAnim(false);
      setTimeout(() => setResultAnim(true), 100);
      const sa = new Array(starRating).fill(false);
      setStarAnims(sa);
      sa.forEach((_, i) => {
        setTimeout(
          () => {
            setStarAnims((prev) => {
              const n = [...prev];
              n[i] = true;
              return n;
            });
          },
          500 + i * 220,
        );
      });
      if (score >= passingScore) {
        setConfettiPieces(
          Array.from({ length: 40 }, (_, i) => ({
            x: Math.random() * 100,
            y: -10 - Math.random() * 30,
            color: [S.indigo, S.orange, S.purple, S.gold, S.success][
              Math.floor(Math.random() * 5)
            ],
            delay: Math.random() * 2,
            rotation: Math.random() * 360,
            size: 6 + Math.random() * 8,
          })),
        );
      }
    }
  };

  const handleRestart = () => {
    setPhase("intro");
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers(new Array(questions.length).fill(null));
    setShowExplanation(false);
    setShowReview(false);
    setResultAnim(false);
    setConfettiPieces([]);
    setIntroAnim(false);
    setTimeout(() => setIntroAnim(true), 100);
  };

  // ═════════════════════════════════════════════════════════════════════════
  // DECORATIVE SHAPES (Singularity geometric motif)
  // ═════════════════════════════════════════════════════════════════════════
  const DecoCircle = ({
    size,
    color,
    top,
    left,
    right,
    bottom,
    opacity = 0.15,
    delay = 0,
  }: any) => (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        top,
        left,
        right,
        bottom,
        opacity,
        animation: `s_floatSlow ${4 + delay}s ease-in-out infinite ${delay}s`,
        pointerEvents: "none" as const,
      }}
    />
  );
  const DecoTriangle = ({
    size,
    color,
    top,
    left,
    right,
    bottom,
    opacity = 0.12,
    delay = 0,
  }: any) => (
    <div
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        borderLeft: `${size / 2}px solid transparent`,
        borderRight: `${size / 2}px solid transparent`,
        borderBottom: `${size * 0.866}px solid ${color}`,
        top,
        left,
        right,
        bottom,
        opacity,
        animation: `s_float ${5 + delay}s ease-in-out infinite ${delay * 0.5}s`,
        pointerEvents: "none" as const,
      }}
    />
  );
  const DecoSquare = ({
    size,
    color,
    top,
    left,
    right,
    bottom,
    opacity = 0.1,
    delay = 0,
  }: any) => (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        border: `2px solid ${color}`,
        borderRadius: 4,
        top,
        left,
        right,
        bottom,
        opacity,
        animation: `s_floatSlow ${6 + delay}s ease-in-out infinite ${delay}s`,
        transform: `rotate(${15 + delay * 10}deg)`,
        pointerEvents: "none" as const,
      }}
    />
  );

  const poppins: React.CSSProperties = { fontFamily: "'Poppins', sans-serif" };
  const containerBase: React.CSSProperties = {
    ...poppins,
    maxWidth: 700,
    margin: "0 auto",
    padding: "20px 16px",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
  };
  const pillButton = (
    bg: string,
    color: string,
    shadow?: string,
  ): React.CSSProperties => ({
    ...poppins,
    fontWeight: 600,
    fontSize: 15,
    padding: "12px 24px",
    borderRadius: 100,
    border: "none",
    background: bg,
    color,
    cursor: "pointer",
    minHeight: 48,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    boxShadow: shadow || "none",
    outline: "none",
  });
  const pillOutlined = (
    borderColor: string,
    textColor: string,
  ): React.CSSProperties => ({
    ...poppins,
    fontWeight: 600,
    fontSize: 15,
    padding: "11px 24px",
    borderRadius: 100,
    border: `2px solid ${borderColor}`,
    background: "transparent",
    color: textColor,
    cursor: "pointer",
    minHeight: 48,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    outline: "none",
  });
  const optionLabels = ["A", "B", "C", "D"];

  // ═════════════════════════════════════════════════════════════════════════
  // INTRO SCREEN
  // ═════════════════════════════════════════════════════════════════════════
  if (phase === "intro") {
    return (
      <div
        style={{
          ...containerBase,
          background: `linear-gradient(170deg, ${S.white} 0%, ${S.indigoGhost} 50%, ${S.orangeSoft} 100%)`,
        }}
      >
        <DecoCircle
          size={90}
          color={S.indigo}
          top={-20}
          right={40}
          opacity={0.12}
          delay={0}
        />
        <DecoTriangle
          size={50}
          color={S.orange}
          top={80}
          left={-10}
          opacity={0.15}
          delay={1}
        />
        <DecoSquare
          size={40}
          color={S.purple}
          bottom={120}
          right={20}
          opacity={0.1}
          delay={2}
        />
        <DecoCircle
          size={60}
          color={S.orangeMid}
          bottom={60}
          left={30}
          opacity={0.1}
          delay={1.5}
        />
        <DecoTriangle
          size={35}
          color={S.indigo}
          top={200}
          right={-5}
          opacity={0.08}
          delay={0.5}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "88vh",
            padding: "20px 0",
            animation: introAnim ? "s_morphIn 0.8s ease-out forwards" : "none",
            opacity: introAnim ? 1 : 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: S.gradientPrimary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 28,
              boxShadow: "0 12px 40px rgba(83,48,134,0.3)",
              animation: "s_float 4s ease-in-out infinite",
            }}
          >
            <BookOpen size={32} color={S.white} strokeWidth={2.2} />
          </div>
          <h1
            style={{
              ...poppins,
              fontWeight: 800,
              fontSize: "clamp(26px, 6vw, 38px)",
              color: S.dark,
              textAlign: "center",
              margin: "0 0 6px 0",
              letterSpacing: "-0.5px",
              lineHeight: 1.15,
            }}
          >
            {title}
          </h1>
          <div
            style={{
              ...poppins,
              fontSize: 12,
              fontWeight: 700,
              color: S.indigo,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              margin: "0 0 32px 0",
              padding: "6px 16px",
              background: `${S.indigo}0D`,
              borderRadius: 100,
              border: `1px solid ${S.indigo}1A`,
            }}
          >
            {subtitle}
          </div>

          <div
            style={{
              background: S.white,
              borderRadius: 20,
              padding: "28px",
              maxWidth: 480,
              width: "100%",
              boxShadow: "0 2px 24px rgba(26,26,46,0.06)",
              border: `1px solid ${S.gray200}`,
              marginBottom: 28,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 4,
                height: "100%",
                background: S.gradientMixed,
                borderRadius: "20px 0 0 20px",
              }}
            />
            <p
              style={{
                ...poppins,
                fontWeight: 700,
                fontSize: 14,
                color: S.purple,
                margin: "0 0 10px 0",
              }}
            >
              Instructions
            </p>
            <p
              style={{
                ...poppins,
                fontSize: 13,
                lineHeight: 1.75,
                color: S.gray700,
                margin: 0,
                fontWeight: 400,
              }}
            >
              {additionalProps.instructionsForStudent ||
                "Answer each question one at a time. After you choose an option, read the explanation carefully — it names the property involved. Connect each question back to the three rules: Identity (×1), Sign-Flipper (×−1), and Commutativity (order)."}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 36,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              {
                label: "Identity",
                formula: "1 × a = a",
                bg: S.indigoGhost,
                border: `${S.indigo}25`,
                color: S.indigo,
              },
              {
                label: "Sign-Flipper",
                formula: "(−1) × a = −a",
                bg: S.orangeSoft,
                border: `${S.orange}25`,
                color: S.orange,
              },
              {
                label: "Commutative",
                formula: "a × b = b × a",
                bg: `${S.purple}0D`,
                border: `${S.purple}25`,
                color: S.purple,
              },
            ].map((prop, i) => (
              <div
                key={i}
                style={{
                  background: prop.bg,
                  borderRadius: 14,
                  padding: "10px 16px",
                  textAlign: "center",
                  border: `1.5px solid ${prop.border}`,
                  animation: introAnim
                    ? `s_fadeInUp 0.5s ease-out ${0.35 + i * 0.12}s both`
                    : "none",
                }}
              >
                <div
                  style={{
                    ...poppins,
                    fontSize: 11,
                    fontWeight: 700,
                    color: prop.color,
                    marginBottom: 2,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  {prop.label}
                </div>
                <div
                  style={{
                    ...poppins,
                    fontSize: 14,
                    fontWeight: 800,
                    color: S.dark,
                  }}
                >
                  {prop.formula}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleStartQuiz}
            style={{
              ...pillButton(
                S.gradientAccent,
                S.white,
                "0 8px 28px rgba(255,114,18,0.35)",
              ),
              fontSize: 17,
              fontWeight: 700,
              padding: "14px 44px",
              minHeight: 52,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.04)";
              e.currentTarget.style.boxShadow =
                "0 14px 36px rgba(255,114,18,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 8px 28px rgba(255,114,18,0.35)";
            }}
          >
            Start Quiz <ArrowRight size={20} strokeWidth={2.5} />
          </button>
          <p
            style={{
              ...poppins,
              fontSize: 12,
              color: S.gray400,
              marginTop: 14,
              fontWeight: 500,
            }}
          >
            {questions.length} questions · ~3 minutes
          </p>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // RESULT SCREEN
  // ═════════════════════════════════════════════════════════════════════════
  if (phase === "result" && !showReview) {
    const passed = score >= passingScore;
    return (
      <div
        style={{
          ...containerBase,
          background: passed
            ? `linear-gradient(170deg, ${S.white} 0%, ${S.orangeSoft} 40%, ${S.indigoGhost} 100%)`
            : `linear-gradient(170deg, ${S.white} 0%, ${S.gray100} 60%, ${S.indigoGhost} 100%)`,
        }}
      >
        {confettiPieces.map((piece, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              width: piece.size,
              height: piece.size,
              background: piece.color,
              borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "0",
              animation: `s_confettiFall ${2 + Math.random()}s ease-in ${piece.delay}s forwards`,
              transform: `rotate(${piece.rotation}deg)`,
              zIndex: 10,
              pointerEvents: "none" as const,
            }}
          />
        ))}
        <DecoCircle
          size={70}
          color={S.purple}
          top={20}
          left={-20}
          opacity={0.1}
          delay={0}
        />
        <DecoSquare
          size={45}
          color={S.orange}
          top={100}
          right={10}
          opacity={0.08}
          delay={1}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "88vh",
            padding: "20px 0",
            animation: resultAnim ? "s_morphIn 0.7s ease-out forwards" : "none",
            opacity: resultAnim ? 1 : 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: passed ? S.gradientAccent : S.gradientPrimary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              boxShadow: passed
                ? "0 12px 40px rgba(255,114,18,0.35)"
                : "0 12px 40px rgba(74,77,201,0.3)",
              animation: resultAnim
                ? "s_popBounce 0.6s ease-out 0.3s both"
                : "none",
            }}
          >
            <Trophy size={44} color={S.white} strokeWidth={2} />
          </div>
          <h2
            style={{
              ...poppins,
              fontWeight: 800,
              fontSize: "clamp(24px, 5vw, 34px)",
              color: S.dark,
              margin: "0 0 8px 0",
              textAlign: "center",
            }}
          >
            {passed ? "Excellent Work!" : "Keep Practising!"}
          </h2>
          <p
            style={{
              ...poppins,
              fontSize: 15,
              color: S.gray700,
              margin: "0 0 28px 0",
              textAlign: "center",
              fontWeight: 400,
              maxWidth: 380,
              lineHeight: 1.6,
            }}
          >
            {passed
              ? "You have a strong grasp of integer multiplication properties!"
              : "Review the three properties and give it another try!"}
          </p>

          <div
            style={{
              background: S.white,
              borderRadius: 24,
              padding: "36px 52px",
              textAlign: "center",
              boxShadow: "0 4px 32px rgba(26,26,46,0.07)",
              border: `1.5px solid ${passed ? S.orange : S.indigo}20`,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                ...poppins,
                fontWeight: 900,
                fontSize: 60,
                color: passed ? S.orange : S.indigo,
                lineHeight: 1,
                letterSpacing: "-2px",
              }}
            >
              {score}
            </div>
            <div
              style={{
                ...poppins,
                fontSize: 15,
                color: S.gray400,
                fontWeight: 600,
                marginTop: 2,
              }}
            >
              out of {questions.length}
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                justifyContent: "center",
                marginTop: 18,
              }}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    animation: starAnims[i]
                      ? "s_starPop 0.5s ease-out forwards"
                      : "none",
                    opacity: starAnims[i] ? 1 : i < starRating ? 0 : 1,
                  }}
                >
                  <Star
                    size={26}
                    fill={i < starRating ? S.gold : "transparent"}
                    color={i < starRating ? S.gold : S.gray200}
                    strokeWidth={2}
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => setShowReview(true)}
              style={pillOutlined(S.indigo, S.indigo)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = S.indigoGhost;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Review Answers
            </button>
            <button
              onClick={handleRestart}
              style={pillButton(
                S.indigo,
                S.white,
                "0 6px 20px rgba(74,77,201,0.3)",
              )}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 28px rgba(74,77,201,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(74,77,201,0.3)";
              }}
            >
              <RotateCcw size={16} strokeWidth={2.5} /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // REVIEW SCREEN
  // ═════════════════════════════════════════════════════════════════════════
  if (phase === "result" && showReview) {
    return (
      <div
        style={{
          ...containerBase,
          background: `linear-gradient(170deg, ${S.white} 0%, ${S.gray100} 60%, ${S.indigoGhost} 100%)`,
        }}
      >
        <div style={{ padding: "12px 0 40px" }}>
          <h2
            style={{
              ...poppins,
              fontWeight: 800,
              fontSize: 26,
              color: S.dark,
              margin: "0 0 28px 0",
              textAlign: "center",
              animation: "s_fadeInDown 0.4s ease-out",
            }}
          >
            Review Answers
          </h2>

          {questions.map((q, qi) => {
            const userAnswer = answers[qi];
            const isCorrect = userAnswer === q.correctIndex;
            return (
              <div
                key={qi}
                style={{
                  background: S.white,
                  borderRadius: 18,
                  padding: "22px 24px",
                  marginBottom: 14,
                  border: `1.5px solid ${isCorrect ? S.success : S.error}22`,
                  boxShadow: "0 2px 16px rgba(26,26,46,0.04)",
                  animation: `s_fadeInUp 0.4s ease-out ${qi * 0.08}s both`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 4,
                    height: "100%",
                    background: isCorrect ? S.success : S.error,
                    borderRadius: "18px 0 0 18px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                    paddingLeft: 8,
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: isCorrect ? S.success : S.error,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isCorrect ? (
                      <Check size={14} color={S.white} strokeWidth={3} />
                    ) : (
                      <X size={14} color={S.white} strokeWidth={3} />
                    )}
                  </div>
                  <span
                    style={{
                      ...poppins,
                      fontSize: 13,
                      color: S.gray400,
                      fontWeight: 600,
                    }}
                  >
                    Question {qi + 1}
                  </span>
                </div>
                <p
                  style={{
                    ...poppins,
                    fontSize: 14,
                    color: S.dark,
                    fontWeight: 600,
                    margin: "0 0 14px 8px",
                    lineHeight: 1.55,
                  }}
                >
                  {q.question}
                </p>
                <div style={{ paddingLeft: 8 }}>
                  {q.options.map((opt, oi) => {
                    const isUserChoice = userAnswer === oi;
                    const isCorrectOpt = q.correctIndex === oi;
                    let optBg = S.gray100;
                    let optBorder = S.gray200;
                    let optColor = S.gray700;
                    if (isCorrectOpt) {
                      optBg = S.successSoft;
                      optBorder = `${S.success}55`;
                      optColor = S.successDark;
                    } else if (isUserChoice && !isCorrect) {
                      optBg = S.errorSoft;
                      optBorder = `${S.error}55`;
                      optColor = S.errorDark;
                    }
                    return (
                      <div
                        key={oi}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 12,
                          background: optBg,
                          border: `1.5px solid ${optBorder}`,
                          marginBottom: 5,
                          fontSize: 13,
                          color: optColor,
                          fontWeight: isCorrectOpt || isUserChoice ? 600 : 400,
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          ...poppins,
                        }}
                      >
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: isCorrectOpt
                              ? S.success
                              : isUserChoice
                                ? S.error
                                : S.gray300,
                            color: S.white,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {isCorrectOpt ? (
                            <Check size={12} strokeWidth={3} />
                          ) : isUserChoice ? (
                            <X size={12} strokeWidth={3} />
                          ) : (
                            optionLabels[oi]
                          )}
                        </span>
                        {opt}
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    marginTop: 14,
                    marginLeft: 8,
                    padding: "14px 16px",
                    borderRadius: 12,
                    background: S.indigoGhost,
                    border: `1px solid ${S.indigo}15`,
                  }}
                >
                  <span
                    style={{
                      ...poppins,
                      fontSize: 11,
                      fontWeight: 700,
                      color: S.indigo,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    {q.propertyName}
                  </span>
                  <p
                    style={{
                      ...poppins,
                      fontSize: 12.5,
                      color: S.gray700,
                      margin: "6px 0 0 0",
                      lineHeight: 1.65,
                      fontWeight: 400,
                    }}
                  >
                    {q.explanation}
                  </p>
                </div>
              </div>
            );
          })}

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              marginTop: 28,
            }}
          >
            <button
              onClick={() => setShowReview(false)}
              style={pillOutlined(S.purple, S.purple)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${S.purple}0A`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              ← Back to Score
            </button>
            <button
              onClick={handleRestart}
              style={pillButton(
                S.indigo,
                S.white,
                "0 6px 20px rgba(74,77,201,0.25)",
              )}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <RotateCcw size={16} strokeWidth={2.5} /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // QUIZ SCREEN
  // ═════════════════════════════════════════════════════════════════════════
  const q = questions[currentQuestion];

  return (
    <div
      style={{
        ...containerBase,
        background: `linear-gradient(170deg, ${S.white} 0%, ${S.indigoGhost} 55%, ${S.orangeSoft}55 100%)`,
      }}
    >
      <DecoCircle
        size={50}
        color={S.indigoSoft}
        top={-15}
        right={30}
        opacity={0.15}
        delay={0}
      />
      <DecoTriangle
        size={30}
        color={S.orangeMid}
        bottom={100}
        left={-8}
        opacity={0.1}
        delay={1}
      />

      <div style={{ padding: "4px 0 32px", position: "relative", zIndex: 1 }}>
        {/* Progress */}
        <div
          style={{ marginBottom: 28, animation: "s_fadeInDown 0.35s ease-out" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                ...poppins,
                fontSize: 13,
                fontWeight: 700,
                color: S.indigo,
              }}
            >
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span
              style={{
                ...poppins,
                fontSize: 12,
                color: S.gray400,
                fontWeight: 500,
              }}
            >
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: S.gray200,
              borderRadius: 100,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: S.gradientMixed,
                backgroundSize: "200% 200%",
                animation: "s_gradientShift 3s ease infinite",
                borderRadius: 100,
                width: `${progressPercentage}%`,
                transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              justifyContent: "center",
              marginTop: 14,
            }}
          >
            {questions.map((_, i) => {
              const answered = answers[i] !== null;
              const correct =
                answered && answers[i] === questions[i].correctIndex;
              const wrong =
                answered && answers[i] !== questions[i].correctIndex;
              const isCurrent = i === currentQuestion;
              return (
                <div
                  key={i}
                  style={{
                    width: isCurrent ? 26 : 8,
                    height: 8,
                    borderRadius: 100,
                    background: correct
                      ? S.success
                      : wrong
                        ? S.error
                        : isCurrent
                          ? S.indigo
                          : S.gray200,
                    transition: "all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    opacity: isCurrent || answered ? 1 : 0.45,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Question Card */}
        <div
          style={{
            background: S.white,
            borderRadius: 22,
            padding: "clamp(22px, 4.5vw, 32px)",
            boxShadow: "0 4px 32px rgba(26,26,46,0.06)",
            border: `1px solid ${S.gray200}`,
            marginBottom: 18,
            animation: questionAnim
              ? "s_fadeInUp 0.45s ease-out forwards"
              : "none",
            opacity: questionAnim ? 1 : 0,
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
              background: S.gradientMixed,
              borderRadius: "22px 22px 0 0",
            }}
          />
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 100,
              background: S.indigoGhost,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: S.indigo,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  ...poppins,
                  fontSize: 11,
                  fontWeight: 700,
                  color: S.white,
                }}
              >
                {currentQuestion + 1}
              </span>
            </div>
            <span
              style={{
                ...poppins,
                fontSize: 11,
                fontWeight: 600,
                color: S.indigo,
              }}
            >
              {q.propertyName.split("(")[0].trim()}
            </span>
          </div>
          <p
            style={{
              ...poppins,
              fontWeight: 700,
              fontSize: "clamp(16px, 3.8vw, 20px)",
              color: S.dark,
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            {q.question}
          </p>
        </div>

        {/* Options 2×2 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {q.options.map((option, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrectOption = q.correctIndex === i;
            const hasAnswered = selectedAnswer !== null;
            const isShaking = shakeWrong === i;
            const isPopping = popCorrect === i;
            let bgColor = S.white;
            let borderColor = S.gray200;
            let textColor = S.dark;
            let labelBg = S.indigo;
            let labelColor = S.white;
            let icon: React.ReactNode = null;

            if (hasAnswered) {
              if (isCorrectOption) {
                bgColor = S.successSoft;
                borderColor = `${S.success}77`;
                textColor = S.successDark;
                labelBg = S.success;
                icon = (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ flexShrink: 0 }}
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke={S.success}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: 24,
                        animation: "s_tickDraw 0.4s ease-out 0.15s both",
                      }}
                    />
                  </svg>
                );
              } else if (isSelected) {
                bgColor = S.errorSoft;
                borderColor = `${S.error}77`;
                textColor = S.errorDark;
                labelBg = S.error;
                icon = (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ flexShrink: 0 }}
                  >
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke={S.error}
                      strokeWidth="3"
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: 20,
                        animation: "s_crossDraw 0.3s ease-out 0.15s both",
                      }}
                    />
                  </svg>
                );
              } else {
                bgColor = S.gray100;
                borderColor = S.gray200;
                textColor = S.gray400;
                labelBg = S.gray300;
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelectAnswer(i)}
                disabled={hasAnswered}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 8,
                  padding: "16px",
                  borderRadius: 16,
                  border: `1.5px solid ${borderColor}`,
                  background: bgColor,
                  cursor: hasAnswered ? "default" : "pointer",
                  textAlign: "left",
                  ...poppins,
                  minHeight: 56,
                  transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  animation: optionAnims[i]
                    ? `s_fadeInUp 0.35s ease-out forwards${isShaking ? ", s_shake 0.5s ease" : ""}${isPopping ? ", s_popBounce 0.4s ease" : ""}`
                    : "none",
                  opacity: optionAnims[i] ? 1 : 0,
                  outline: "none",
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (!hasAnswered) {
                    e.currentTarget.style.borderColor = S.indigo;
                    e.currentTarget.style.background = S.indigoGhost;
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = `0 6px 20px ${S.indigo}18`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!hasAnswered) {
                    e.currentTarget.style.borderColor = S.gray200;
                    e.currentTarget.style.background = S.white;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: labelBg,
                      color: labelColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {optionLabels[i]}
                  </span>
                  {icon && <div style={{ marginLeft: "auto" }}>{icon}</div>}
                </div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: textColor,
                    lineHeight: 1.45,
                  }}
                >
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div
            style={{
              background: S.white,
              borderRadius: 18,
              overflow: "hidden",
              border: `1.5px solid ${S.purple}20`,
              boxShadow: `0 4px 24px ${S.purple}0A`,
              animation: explanationAnim
                ? "s_slideDown 0.5s ease-out forwards"
                : "none",
              opacity: explanationAnim ? 1 : 0,
              marginBottom: 16,
            }}
          >
            <div style={{ padding: "0 22px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 14px",
                  borderRadius: 100,
                  background: S.gradientPrimary,
                  marginBottom: 10,
                }}
              >
                <Sparkles size={13} color={S.white} strokeWidth={2.5} />
                <span
                  style={{
                    ...poppins,
                    fontSize: 12,
                    fontWeight: 700,
                    color: S.white,
                    letterSpacing: "0.3px",
                  }}
                >
                  {q.propertyName}
                </span>
              </div>
              <p
                style={{
                  ...poppins,
                  fontSize: 14,
                  color: S.gray700,
                  lineHeight: 1.7,
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                {q.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Next Button */}
        {selectedAnswer !== null && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 8,
              animation: "s_fadeInUp 0.4s ease-out 0.2s both",
            }}
          >
            <button
              onClick={handleNext}
              style={{
                ...pillButton(
                  S.gradientAccent,
                  S.white,
                  "0 8px 28px rgba(255,114,18,0.3)",
                ),
                fontSize: 16,
                fontWeight: 700,
                padding: "13px 36px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-3px) scale(1.03)";
                e.currentTarget.style.boxShadow =
                  "0 12px 36px rgba(255,114,18,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 8px 28px rgba(255,114,18,0.3)";
              }}
            >
              {currentQuestion < questions.length - 1
                ? "Next Question"
                : "See Results"}{" "}
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegerPropertiesQuiz;
