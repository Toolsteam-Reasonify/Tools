// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: decimals_chapter_quiz_tool.tsx
// Singularity Design System — Error-Free Production Build
// ═══════════════════════════════════════════════════════════════════════════

// @ts-ignore - module resolved at runtime
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
// @ts-ignore - module resolved at runtime
import { Check, X, ChevronRight, RotateCcw, Star, BookOpen, Target, Zap } from "lucide-react";
// @ts-ignore - module resolved at runtime
import katex from "katex";

// ==================== TYPE DEFINITIONS ====================

type ModeType = "learn" | "practice" | "real_world" | "hands_on";

interface StepDetails {
  currentStep: number;
  totalSteps: number;
  isPaused: boolean;
  currentMode: ModeType;
}

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: number;
  question: string;
  questionKatex?: string;
  options: QuizOption[];
  explanation: string;
  explanationKatex?: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}

interface QuizAdditionalProps {
  questions?: QuizQuestion[];
  shuffleOptions?: boolean;
  shuffleQuestions?: boolean;
  showExplanations?: boolean;
  showScore?: boolean;
  showTopicTags?: boolean;
  passingScore?: number;
  title?: string;
  subtitle?: string;
  instructionText?: string;
  teachingNotes?: string;
}

interface DecimalsQuizToolProps {
  props?: {
    width?: number;
    height?: number;
    data?: { themeColor?: string; autoPlayDuration?: number };
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

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  primary: "#4A4DC9",
  accent: "#FF7212",
  gradStart: "#533086",
  gradEnd: "#FC9145",
  primaryLight: "#C1C1EA",
  accentLight: "#FFF3E4",
  primarySoft: "#EEEEF8",
  dark: "#4E4E4E",
  gray: "#CACACA",
  grayLight: "#EBEBEB",
  surface: "#F5F5F5",
  white: "#FFFFFF",
  correct: "#2DB87A",
  correctLight: "#E6F9F0",
  correctSoft: "#B8EDCF",
  incorrect: "#E5453F",
  incorrectLight: "#FDE8E8",
  incorrectSoft: "#F5B3B1",
  font: "'Poppins', 'Segoe UI', sans-serif",
  rSm: 10,
  rMed: 14,
  rLg: 20,
  rPill: 50,
  shadowSoft: "0 2px 12px rgba(74,77,201,0.08)",
  shadowMed: "0 8px 32px rgba(74,77,201,0.12)",
  shadowHeavy: "0 16px 48px rgba(83,48,134,0.18)",
  shadowAccent: "0 8px 24px rgba(255,114,18,0.25)",
};

// ==================== DEFAULT QUESTIONS ====================

const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Convert the fraction 5/100 into decimal form.",
    questionKatex: "\\frac{5}{100}",
    options: [
      { id: "a", text: "0.5", isCorrect: false },
      { id: "b", text: "0.05", isCorrect: true },
      { id: "c", text: "0.005", isCorrect: false },
      { id: "d", text: "5.0", isCorrect: false },
    ],
    explanation:
      "5/100 means 5 hundredths. The hundredths place is the second digit after the decimal point, so 5/100 = 0.05.",
    explanationKatex: "\\frac{5}{100} = 0.05",
    topic: "Fraction to Decimal",
    difficulty: "easy",
  },
  {
    id: 2,
    question: "Convert 254/1000 into decimal form.",
    questionKatex: "\\frac{254}{1000}",
    options: [
      { id: "a", text: "2.54", isCorrect: false },
      { id: "b", text: "25.4", isCorrect: false },
      { id: "c", text: "0.254", isCorrect: true },
      { id: "d", text: "0.0254", isCorrect: false },
    ],
    explanation: "254/1000 = 2 tenths + 5 hundredths + 4 thousandths = 0.254",
    explanationKatex: "\\frac{254}{1000} = 0.254",
    topic: "Fraction to Decimal",
    difficulty: "medium",
  },
  {
    id: 3,
    question: "How can 0.34 be decomposed into tenths and hundredths?",
    options: [
      { id: "a", text: "3 tenths + 4 hundredths", isCorrect: true },
      { id: "b", text: "34 tenths", isCorrect: false },
      { id: "c", text: "3 hundredths + 4 thousandths", isCorrect: false },
      { id: "d", text: "34 hundredths only", isCorrect: false },
    ],
    explanation: "0.34 = 0.3 + 0.04 = 3 tenths + 4 hundredths.",
    explanationKatex: "0.34 = \\frac{3}{10} + \\frac{4}{100}",
    topic: "Decomposition",
    difficulty: "easy",
  },
  {
    id: 4,
    question: "Arrange in descending order: 11.01, 1.011, 1.101, 11.10, 1.01",
    options: [
      { id: "a", text: "11.10, 11.01, 1.101, 1.011, 1.01", isCorrect: true },
      { id: "b", text: "11.01, 11.10, 1.101, 1.01, 1.011", isCorrect: false },
      { id: "c", text: "11.10, 11.01, 1.101, 1.01, 1.011", isCorrect: false },
      { id: "d", text: "1.01, 1.011, 1.101, 11.01, 11.10", isCorrect: false },
    ],
    explanation:
      "Compare whole parts first: 11.10 > 11.01. Among 1.xxx values: 1.101 > 1.011 > 1.01.",
    topic: "Descending Order",
    difficulty: "medium",
  },
  {
    id: 5,
    question:
      "Does more digits always mean greater value? Compare 0.999 and 1.0",
    options: [
      {
        id: "a",
        text: "Yes — 0.999 has more digits so it is greater",
        isCorrect: false,
      },
      {
        id: "b",
        text: "No — 1.0 is greater even with fewer digits",
        isCorrect: true,
      },
      { id: "c", text: "They are equal", isCorrect: false },
      { id: "d", text: "Cannot be compared", isCorrect: false },
    ],
    explanation:
      "More digits ≠ greater value! The whole number part of 1.0 is 1, while 0.999 has whole part 0. Since 1 > 0, we know 1.0 > 0.999.",
    topic: "Comparing Decimals",
    difficulty: "medium",
  },
  {
    id: 6,
    question:
      "Mahi buys: 0.25 kg beans, 0.3 kg carrots, 0.5 kg potatoes, 0.2 kg capsicum, 0.05 kg ginger. Total weight?",
    options: [
      { id: "a", text: "1.03 kg", isCorrect: false },
      { id: "b", text: "1.3 kg", isCorrect: true },
      { id: "c", text: "1.25 kg", isCorrect: false },
      { id: "d", text: "13 kg", isCorrect: false },
    ],
    explanation: "0.25 + 0.30 + 0.50 + 0.20 + 0.05 = 1.30 = 1.3 kg.",
    explanationKatex: "0.25 + 0.30 + 0.50 + 0.20 + 0.05 = 1.3 \\text{ kg}",
    topic: "Word Problem",
    difficulty: "medium",
  },
  {
    id: 7,
    question: "How many millimeters make 1 kilometer?",
    options: [
      { id: "a", text: "100,000 mm", isCorrect: false },
      { id: "b", text: "10,000 mm", isCorrect: false },
      { id: "c", text: "1,000,000 mm", isCorrect: true },
      { id: "d", text: "10,000,000 mm", isCorrect: false },
    ],
    explanation: "1 km = 1000 m, and 1 m = 1000 mm. So 1 km = 1,000,000 mm.",
    explanationKatex: "1000 \\times 1000 = 1{,}000{,}000 \\text{ mm}",
    topic: "Unit Conversion",
    difficulty: "medium",
  },
  {
    id: 8,
    question: "Which is greater: 10/1000 or 1/10?",
    questionKatex: "\\frac{10}{1000} \\quad \\text{vs} \\quad \\frac{1}{10}",
    options: [
      { id: "a", text: "10/1000 is greater", isCorrect: false },
      { id: "b", text: "1/10 is greater", isCorrect: true },
      { id: "c", text: "They are equal", isCorrect: false },
      { id: "d", text: "Cannot be determined", isCorrect: false },
    ],
    explanation:
      "10/1000 = 0.01, while 1/10 = 0.1. Since 0.1 > 0.01, 1/10 is 10 times larger!",
    explanationKatex: "0.01 < 0.1",
    topic: "Comparing Fractions",
    difficulty: "easy",
  },
  {
    id: 9,
    question: "Write 1/4 as a decimal.",
    questionKatex: "\\frac{1}{4}",
    options: [
      { id: "a", text: "0.4", isCorrect: false },
      { id: "b", text: "0.25", isCorrect: true },
      { id: "c", text: "0.14", isCorrect: false },
      { id: "d", text: "1.4", isCorrect: false },
    ],
    explanation: "1/4 = 25/100 = 0.25.",
    explanationKatex: "\\frac{1}{4} = 0.25",
    topic: "Fraction to Decimal",
    difficulty: "easy",
  },
  {
    id: 10,
    question: "Write 4/5 as a decimal.",
    questionKatex: "\\frac{4}{5}",
    options: [
      { id: "a", text: "0.45", isCorrect: false },
      { id: "b", text: "4.5", isCorrect: false },
      { id: "c", text: "0.8", isCorrect: true },
      { id: "d", text: "0.54", isCorrect: false },
    ],
    explanation: "4/5 = 8/10 = 0.8.",
    explanationKatex: "\\frac{4}{5} = 0.8",
    topic: "Fraction to Decimal",
    difficulty: "easy",
  },
];

// ==================== HELPERS ====================

function shuffleArray<T>(array: T[]): T[] {
  const s = [...array];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

const KatexRenderer: React.FC<{ expression: string; block?: boolean }> = ({
  expression,
  block = false,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current && expression) {
      try {
        katex.render(expression, ref.current, {
          throwOnError: false,
          displayMode: block,
          trust: true,
        });
      } catch {
        if (ref.current) ref.current.textContent = expression;
      }
    }
  }, [expression, block]);
  return <span ref={ref} />;
};

// ==================== GEOMETRIC DECORATIONS ====================

const GeoShapes: React.FC<{ color1?: string; color2?: string }> = ({
  color1 = DS.primary,
  color2 = DS.accent,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none",
    }}
  >
    <svg
      style={{
        position: "absolute",
        top: -18,
        right: 44,
        opacity: 0.12,
        animation: "sgFloat 6s ease-in-out infinite",
      }}
      width="65"
      height="65"
      viewBox="0 0 65 65"
    >
      <polygon
        points="32,4 60,56 4,56"
        fill="none"
        stroke={color2}
        strokeWidth="2.2"
      />
    </svg>
    <svg
      style={{
        position: "absolute",
        top: 34,
        left: -12,
        opacity: 0.1,
        animation: "sgFloat 5s ease-in-out infinite 0.5s",
      }}
      width="56"
      height="56"
      viewBox="0 0 56 56"
    >
      <circle
        cx="28"
        cy="28"
        r="23"
        fill="none"
        stroke={color1}
        strokeWidth="2.2"
      />
    </svg>
    <svg
      style={{
        position: "absolute",
        bottom: 22,
        right: -8,
        opacity: 0.08,
        animation: "sgFloat 7s ease-in-out infinite 1s",
      }}
      width="50"
      height="50"
      viewBox="0 0 50 50"
    >
      <rect
        x="5"
        y="5"
        width="40"
        height="40"
        rx="3"
        fill="none"
        stroke={color1}
        strokeWidth="2.2"
      />
    </svg>
    <svg
      style={{ position: "absolute", bottom: 55, left: 32, opacity: 0.07 }}
      width="36"
      height="36"
      viewBox="0 0 36 36"
    >
      <circle cx="18" cy="18" r="14" fill={DS.primaryLight} />
    </svg>
    <svg
      style={{ position: "absolute", top: "48%", right: 18, opacity: 0.06 }}
      width="30"
      height="30"
      viewBox="0 0 30 30"
    >
      <polygon points="15,2 28,26 2,26" fill={DS.accentLight} />
    </svg>
  </div>
);

// ==================== MAIN COMPONENT ====================

type PropsConfig = NonNullable<DecimalsQuizToolProps["props"]>;

const DecimalsChapterQuizTool: React.FC<DecimalsQuizToolProps> = ({
  props: propsIn = {} as PropsConfig,
  setStepDetails,
}) => {
  const props = propsIn as PropsConfig;
  const config = useMemo(
    () => ({
      width: props.width ?? 800,
    }),
    [props.width],
  );

  const ap = props.additionalProps || {};
  const qc = useMemo(
    () => ({
      questions: ap.questions ?? DEFAULT_QUESTIONS,
      shuffleOptions: ap.shuffleOptions ?? true,
      shuffleQuestions: ap.shuffleQuestions ?? false,
      showExplanations: ap.showExplanations ?? true,
      showScore: ap.showScore ?? true,
      showTopicTags: ap.showTopicTags ?? true,
      passingScore: ap.passingScore ?? 7,
      title: ap.title ?? "Figure it Out — Chapter 3 Practice",
      subtitle: ap.subtitle ?? "A Peek Beyond the Point · Comprehensive Quiz",
      instructionText:
        ap.instructionText ??
        "This quiz covers the entire chapter! Select the best answer for each question and read the explanation after.",
    }),
    [ap],
  );

  const preparedQuestions = useMemo(() => {
    let qs = [...qc.questions];
    if (qc.shuffleQuestions) qs = shuffleArray(qs);
    return qs.map((q) => ({
      ...q,
      options: qc.shuffleOptions ? shuffleArray(q.options) : q.options,
    }));
  }, [qc.questions, qc.shuffleOptions, qc.shuffleQuestions]);

  // ─── STATE ───
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [records, setRecords] = useState<
    Record<number, { selected: string; correct: boolean }>
  >({});
  const [quizDone, setQuizDone] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [slideOut, setSlideOut] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [hoveredBtn, setHoveredBtn] = useState(false);

  const progressRef = useRef(0);
  const currentQ = preparedQuestions[questionIndex];
  const total = preparedQuestions.length;

  // ─── Inject Poppins + Keyframes ───
  useEffect(() => {
    if (!document.getElementById("sg-poppins")) {
      const link = document.createElement("link");
      link.id = "sg-poppins";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap";
      document.head.appendChild(link);
    }
    if (!document.getElementById("sg-keyframes")) {
      const style = document.createElement("style");
      style.id = "sg-keyframes";
      style.textContent = `
@keyframes sgFadeInUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes sgPopIn { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
@keyframes sgSlideIn { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
@keyframes sgSlideOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-50px); } }
@keyframes sgBounce { 0%, 100% { transform: translateY(0); } 30% { transform: translateY(-10px); } 50% { transform: translateY(-5px); } }
@keyframes sgShake { 0%, 100% { transform: translateX(0); } 15%, 55%, 85% { transform: translateX(-5px); } 35%, 75% { transform: translateX(5px); } }
@keyframes sgPulse { 0%, 100% { transform: scale(1); box-shadow: 0 4px 16px rgba(255,114,18,0.25); } 50% { transform: scale(1.02); box-shadow: 0 6px 24px rgba(255,114,18,0.35); } }
@keyframes sgFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(3deg); } }
@keyframes sgScoreReveal { from { opacity: 0; transform: scale(0.3) rotate(-10deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
@keyframes sgOptEnter { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }`;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById("sg-keyframes");
      if (el) el.remove();
    };
  }, []);

  // ─── Report step details ───
  useEffect(() => {
    if (setStepDetails) {
      setStepDetails({
        currentStep: questionIndex + 1,
        totalSteps: total,
        isPaused: true,
        currentMode: "practice",
      });
    }
  }, [questionIndex, total, setStepDetails]);

  // ─── Progress animation (uses ref for stable start value) ───
  useEffect(() => {
    const target = ((questionIndex + (hasAnswered ? 1 : 0)) / total) * 100;
    const from = progressRef.current;
    let startTime: number | null = null;
    const duration = 500;

    function animate(timestamp: number) {
      if (startTime === null) startTime = timestamp;
      const elapsed = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const value = from + (target - from) * eased;
      progressRef.current = value;
      setProgress(value);
      if (elapsed < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [questionIndex, hasAnswered, total]);

  // ─── Handlers ───
  const handleSelect = useCallback(
    (optionId: string) => {
      if (!hasAnswered) setSelected(optionId);
    },
    [hasAnswered],
  );

  const handleSubmit = useCallback(() => {
    if (!selected || hasAnswered) return;
    setHasAnswered(true);
    const isCorrect =
      currentQ.options.find((o) => o.id === selected)?.isCorrect ?? false;
    if (isCorrect) {
      setScore((s) => s + 1);
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 1200);
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
    setRecords((prev) => ({
      ...prev,
      [questionIndex]: { selected, correct: isCorrect },
    }));
  }, [selected, hasAnswered, currentQ, questionIndex]);

  const handleNext = useCallback(() => {
    if (questionIndex < total - 1) {
      setSlideOut(true);
      setTimeout(() => {
        setQuestionIndex((i) => i + 1);
        setSelected(null);
        setHasAnswered(false);
        setSlideOut(false);
      }, 320);
    } else {
      setQuizDone(true);
    }
  }, [questionIndex, total]);

  const handleRestart = useCallback(() => {
    setQuestionIndex(0);
    setSelected(null);
    setHasAnswered(false);
    setScore(0);
    setRecords({});
    setQuizDone(false);
    setShowIntro(true);
    progressRef.current = 0;
    setProgress(0);
  }, []);

  // ─── Style helpers ───
  const getOptionStyle = (option: QuizOption): React.CSSProperties => {
    const isSel = selected === option.id;
    const isHov = hoveredOption === option.id;

    if (!hasAnswered) {
      return {
        background: isSel ? DS.primarySoft : isHov ? "#FAFAFE" : DS.white,
        border: `2px solid ${isSel ? DS.primary : isHov ? DS.primaryLight : DS.grayLight}`,
        color: isSel ? DS.primary : DS.dark,
        transform: isHov && !isSel ? "translateY(-2px)" : "translateY(0)",
        boxShadow: isSel
          ? "0 0 0 3px rgba(193,193,234,0.25)"
          : isHov
            ? "0 4px 16px rgba(74,77,201,0.08)"
            : DS.shadowSoft,
      };
    }
    if (option.isCorrect) {
      return {
        background: DS.correctLight,
        border: `2px solid ${DS.correct}`,
        color: DS.correct,
        boxShadow: "0 0 0 3px rgba(184,237,207,0.38)",
        transform: "translateY(0)",
      };
    }
    if (isSel && !option.isCorrect) {
      return {
        background: DS.incorrectLight,
        border: `2px solid ${DS.incorrect}`,
        color: DS.incorrect,
        boxShadow: "0 0 0 3px rgba(245,179,177,0.38)",
        transform: "translateY(0)",
      };
    }
    return {
      background: DS.surface,
      border: `2px solid ${DS.grayLight}`,
      color: DS.gray,
      opacity: 0.45,
      transform: "translateY(0)",
      boxShadow: "none",
    };
  };

  const getBadgeStyle = (option: QuizOption): React.CSSProperties => {
    const isSel = selected === option.id;
    if (hasAnswered && option.isCorrect)
      return { background: DS.correct, color: "#fff" };
    if (hasAnswered && isSel && !option.isCorrect)
      return { background: DS.incorrect, color: "#fff" };
    if (isSel) return { background: DS.primary, color: "#fff" };
    return { background: DS.grayLight, color: DS.dark };
  };

  const font = DS.font;

  // ═══════════════════════════════════
  // SCREEN: INTRO
  // ═══════════════════════════════════
  if (showIntro) {
    return (
      <div
        style={{
          width: config.width,
          maxWidth: "100%",
          minHeight: 520,
          background: `linear-gradient(145deg, ${DS.gradStart} 0%, ${DS.primary} 40%, ${DS.gradEnd} 100%)`,
          borderRadius: DS.rLg,
          overflow: "hidden",
          fontFamily: font,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "52px 36px",
          position: "relative",
          boxShadow: DS.shadowHeavy,
        }}
      >
        <GeoShapes />
        <div
          style={{
            animation: "sgPopIn 0.5s ease-out",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            maxWidth: 500,
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 18,
              background: "rgba(255,255,255,0.14)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.15)",
              animation: "sgFloat 4s ease-in-out infinite",
            }}
          >
            <BookOpen size={32} color="#fff" strokeWidth={2} />
          </div>
          <h1
            style={{
              color: "#fff",
              fontSize: 26,
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.25,
              letterSpacing: "-0.03em",
              animation: "sgFadeInUp 0.5s ease-out 0.12s both",
            }}
          >
            {qc.title}
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 14,
              margin: 0,
              fontWeight: 500,
              animation: "sgFadeInUp 0.5s ease-out 0.22s both",
            }}
          >
            {qc.subtitle}
          </p>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: DS.rMed,
              padding: "16px 22px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
              animation: "sgFadeInUp 0.5s ease-out 0.32s both",
            }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.88)",
                fontSize: 13.5,
                margin: 0,
                lineHeight: 1.65,
                fontWeight: 400,
              }}
            >
              {qc.instructionText}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: 28,
              marginTop: 6,
              animation: "sgFadeInUp 0.5s ease-out 0.42s both",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "#fff",
                  fontSize: 28,
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                {total}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 11.5,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase" as const,
                  marginTop: 4,
                }}
              >
                Questions
              </div>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.15)" }} />
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: DS.accentLight,
                  fontSize: 28,
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                {qc.passingScore}/{total}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 11.5,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase" as const,
                  marginTop: 4,
                }}
              >
                To Pass
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowIntro(false)}
            onMouseEnter={() => setHoveredBtn(true)}
            onMouseLeave={() => setHoveredBtn(false)}
            style={{
              marginTop: 14,
              padding: "0 40px",
              height: 48,
              background: DS.accent,
              color: "#fff",
              border: "none",
              borderRadius: DS.rPill,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: font,
              cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: hoveredBtn
                ? DS.shadowAccent
                : "0 4px 18px rgba(255,114,18,0.3)",
              transform: hoveredBtn ? "scale(1.04)" : "scale(1)",
              animation: "sgFadeInUp 0.5s ease-out 0.52s both",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Start Quiz <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════
  // SCREEN: RESULTS
  // ═══════════════════════════════════
  if (quizDone) {
    const pct = Math.round((score / total) * 100);
    const passed = score >= qc.passingScore;
    const emoji =
      pct === 100 ? "🏆" : pct >= 80 ? "🌟" : pct >= 60 ? "👍" : "📚";

    return (
      <div
        style={{
          width: config.width,
          maxWidth: "100%",
          minHeight: 520,
          background: passed
            ? `linear-gradient(145deg, #0d5c3a, ${DS.correct}, #34d399)`
            : `linear-gradient(145deg, ${DS.gradStart}, ${DS.primary}, ${DS.gradEnd})`,
          borderRadius: DS.rLg,
          overflow: "hidden",
          fontFamily: font,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "44px 36px",
          position: "relative",
          boxShadow: DS.shadowHeavy,
        }}
      >
        <GeoShapes
          color1={passed ? DS.correct : DS.primary}
          color2={passed ? "#34d399" : DS.accent}
        />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div
            style={{
              animation: "sgScoreReveal 0.6s ease-out",
              fontSize: 60,
              lineHeight: 1,
            }}
          >
            {emoji}
          </div>
          <h2
            style={{
              color: "#fff",
              fontSize: 28,
              fontWeight: 800,
              margin: "18px 0 6px",
              letterSpacing: "-0.02em",
              animation: "sgFadeInUp 0.5s ease-out 0.15s both",
            }}
          >
            {passed ? "Excellent Work!" : "Keep Practicing!"}
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 14,
              margin: 0,
              fontWeight: 500,
              animation: "sgFadeInUp 0.5s ease-out 0.25s both",
            }}
          >
            {passed
              ? "You've mastered the decimals chapter!"
              : "Review the explanations and try again."}
          </p>
          <div
            style={{
              display: "flex",
              gap: 20,
              marginTop: 28,
              justifyContent: "center",
              animation: "sgFadeInUp 0.5s ease-out 0.35s both",
            }}
          >
            {[
              { v: `${score}/${total}`, l: "Correct" },
              { v: `${pct}%`, l: "Score" },
            ].map((x, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.13)",
                  borderRadius: DS.rMed,
                  padding: "18px 30px",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    color: "#fff",
                    fontSize: 38,
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                    animation: `sgScoreReveal 0.6s ease-out ${0.4 + i * 0.12}s both`,
                  }}
                >
                  {x.v}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase" as const,
                    marginTop: 6,
                  }}
                >
                  {x.l}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 22,
              justifyContent: "center",
              flexWrap: "wrap",
              animation: "sgFadeInUp 0.5s ease-out 0.55s both",
            }}
          >
            {preparedQuestions.map((_, i) => {
              const rec = records[i];
              return (
                <div
                  key={i}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: DS.rSm,
                    background: rec?.correct
                      ? "rgba(255,255,255,0.28)"
                      : "rgba(0,0,0,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    animation: `sgPopIn 0.3s ease-out ${0.6 + i * 0.04}s both`,
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  {rec?.correct ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <X size={14} strokeWidth={3} />
                  )}
                </div>
              );
            })}
          </div>
          <button
            onClick={handleRestart}
            onMouseEnter={() => setHoveredBtn(true)}
            onMouseLeave={() => setHoveredBtn(false)}
            style={{
              marginTop: 26,
              padding: "0 36px",
              height: 46,
              background: "#fff",
              color: passed ? DS.correct : DS.primary,
              border: "none",
              borderRadius: DS.rPill,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: font,
              cursor: "pointer",
              transition: "all 0.25s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
              transform: hoveredBtn ? "scale(1.04)" : "scale(1)",
              animation: "sgFadeInUp 0.5s ease-out 0.7s both",
            }}
          >
            <RotateCcw size={16} strokeWidth={2.5} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════
  // SCREEN: QUIZ QUESTION
  // ═══════════════════════════════════
  return (
    <div
      style={{
        width: config.width,
        maxWidth: "100%",
        background: DS.white,
        borderRadius: DS.rLg,
        overflow: "hidden",
        fontFamily: font,
        boxShadow: DS.shadowMed,
        border: `1px solid ${DS.grayLight}`,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DS.gradStart}, ${DS.primary} 60%, ${DS.gradEnd})`,
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Target
              size={15}
              color="rgba(255,255,255,0.85)"
              strokeWidth={2.5}
            />
          </div>
          <span style={{ color: "#fff", fontSize: 13.5, fontWeight: 600 }}>
            Question {questionIndex + 1}
            <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
              {" "}
              / {total}
            </span>
          </span>
        </div>
        {qc.showScore && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(255,255,255,0.12)",
              borderRadius: DS.rPill,
              padding: "5px 14px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Star size={13} color="#fbbf24" fill="#fbbf24" />
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>
              {score}
              <span
                style={{ color: "rgba(255,255,255,0.45)", fontWeight: 500 }}
              >
                /{Object.keys(records).length}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* PROGRESS */}
      <div style={{ height: 4, background: DS.surface }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${DS.primary}, ${DS.accent})`,
            borderRadius: "0 3px 3px 0",
            transition: "width 0.08s linear",
          }}
        />
      </div>

      {/* QUESTION */}
      <div
        style={{
          padding: "26px 28px 22px",
          animation: slideOut
            ? "sgSlideOut 0.3s ease-in"
            : "sgSlideIn 0.35s ease-out",
        }}
      >
        {qc.showTopicTags && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: DS.primarySoft,
              color: DS.primary,
              padding: "4px 12px",
              borderRadius: DS.rPill,
              fontSize: 11.5,
              fontWeight: 600,
              marginBottom: 14,
              border: "1px solid rgba(193,193,234,0.3)",
            }}
          >
            <Zap size={11} strokeWidth={2.5} />
            {currentQ.topic}
          </div>
        )}
        <div
          style={{
            fontSize: 16.5,
            fontWeight: 600,
            color: DS.dark,
            lineHeight: 1.55,
            marginBottom: 4,
            letterSpacing: "-0.01em",
          }}
        >
          {currentQ.question}
        </div>

        {/* OPTIONS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 20,
            animation: shaking ? "sgShake 0.45s ease" : undefined,
          }}
        >
          {currentQ.options.map((option, idx) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              onMouseEnter={() => {
                if (!hasAnswered) setHoveredOption(option.id);
              }}
              onMouseLeave={() => setHoveredOption(null)}
              disabled={hasAnswered}
              style={{
                ...getOptionStyle(option),
                padding: "13px 16px",
                borderRadius: DS.rMed,
                cursor: hasAnswered ? "default" : "pointer",
                fontSize: 14.5,
                fontWeight: 500,
                fontFamily: font,
                textAlign: "left" as const,
                display: "flex",
                alignItems: "center",
                gap: 12,
                transition: "all 0.22s ease",
                animation: `sgOptEnter 0.35s ease-out ${idx * 0.06}s both`,
                outline: "none",
                position: "relative" as const,
              }}
            >
              <div
                style={{
                  ...getBadgeStyle(option),
                  width: 30,
                  height: 30,
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 12,
                  flexShrink: 0,
                  transition: "all 0.22s ease",
                }}
              >
                {hasAnswered && option.isCorrect ? (
                  <Check size={15} strokeWidth={3} />
                ) : hasAnswered &&
                  selected === option.id &&
                  !option.isCorrect ? (
                  <X size={15} strokeWidth={3} />
                ) : (
                  option.id.toUpperCase()
                )}
              </div>
              <span style={{ flex: 1 }}>{option.text}</span>
              {hasAnswered && option.isCorrect && celebrating && (
                <span style={{ animation: "sgBounce 0.6s ease", fontSize: 16 }}>
                  ✨
                </span>
              )}
            </button>
          ))}
        </div>

        {/* EXPLANATION */}
        {hasAnswered && qc.showExplanations && (
          <div
            style={{
              marginTop: 18,
              padding: "16px 20px",
              background: records[questionIndex]?.correct
                ? DS.correctLight
                : DS.incorrectLight,
              border: `1px solid ${records[questionIndex]?.correct ? DS.correctSoft : DS.incorrectSoft}`,
              borderRadius: DS.rMed,
              animation: "sgFadeInUp 0.35s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 7,
                  background: records[questionIndex]?.correct
                    ? DS.correct
                    : DS.incorrect,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {records[questionIndex]?.correct ? (
                  <Check size={13} color="#fff" strokeWidth={3} />
                ) : (
                  <X size={13} color="#fff" strokeWidth={3} />
                )}
              </div>
              <span
                style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: records[questionIndex]?.correct
                    ? DS.correct
                    : DS.incorrect,
                }}
              >
                {records[questionIndex]?.correct
                  ? "Correct!"
                  : "Not quite right"}
              </span>
            </div>
            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.65,
                color: DS.dark,
                margin: 0,
                fontWeight: 400,
              }}
            >
              {currentQ.explanation}
            </p>
            {currentQ.explanationKatex && (
              <div
                style={{
                  marginTop: 10,
                  background: "rgba(255,255,255,0.65)",
                  borderRadius: DS.rSm,
                  padding: "10px 16px",
                  display: "inline-block",
                  fontSize: 15,
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <KatexRenderer expression={currentQ.explanationKatex} block />
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div
        style={{
          padding: "14px 28px 18px",
          borderTop: `1px solid ${DS.grayLight}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: `${DS.surface}80`,
        }}
      >
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {preparedQuestions.map((_, i) => {
            const rec = records[i];
            const cur = i === questionIndex;
            return (
              <div
                key={i}
                style={{
                  width: cur ? 22 : 9,
                  height: 9,
                  borderRadius: DS.rPill,
                  background: rec
                    ? rec.correct
                      ? DS.correct
                      : DS.incorrect
                    : cur
                      ? `linear-gradient(90deg, ${DS.primary}, ${DS.accent})`
                      : DS.grayLight,
                  transition: "all 0.3s ease",
                }}
              />
            );
          })}
        </div>
        <div>
          {!hasAnswered ? (
            <button
              onClick={handleSubmit}
              disabled={!selected}
              onMouseEnter={() => setHoveredBtn(true)}
              onMouseLeave={() => setHoveredBtn(false)}
              style={{
                padding: "0 28px",
                height: 42,
                background: selected ? DS.primary : DS.grayLight,
                color: selected ? "#fff" : DS.gray,
                border: "none",
                borderRadius: DS.rPill,
                fontSize: 13.5,
                fontWeight: 700,
                fontFamily: font,
                cursor: selected ? "pointer" : "not-allowed",
                transition: "all 0.22s ease",
                boxShadow:
                  selected && hoveredBtn
                    ? "0 6px 20px rgba(74,77,201,0.3)"
                    : selected
                      ? "0 3px 12px rgba(74,77,201,0.2)"
                      : "none",
                transform: selected && hoveredBtn ? "scale(1.03)" : "scale(1)",
              }}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              onMouseEnter={() => setHoveredBtn(true)}
              onMouseLeave={() => setHoveredBtn(false)}
              style={{
                padding: "0 28px",
                height: 42,
                background: DS.accent,
                color: "#fff",
                border: "none",
                borderRadius: DS.rPill,
                fontSize: 13.5,
                fontWeight: 700,
                fontFamily: font,
                cursor: "pointer",
                transition: "all 0.22s ease",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: hoveredBtn
                  ? DS.shadowAccent
                  : "0 4px 14px rgba(255,114,18,0.25)",
                transform: hoveredBtn ? "scale(1.03)" : "scale(1)",
                animation: "sgPulse 2.5s ease-in-out infinite",
              }}
            >
              {questionIndex < total - 1 ? "Next" : "View Results"}
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DecimalsChapterQuizTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════
