/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - modules (react, lucide-react) resolved at build/host
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Check,
  X,
  Star,
  RotateCcw,
  ChevronRight,
  Award,
  BookOpen,
  Target,
  Plus,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

interface QuizQuestion {
  id: string;
  topic: string;
  topicColor: string;
  question: string;
  options: { label: string; text: string }[];
  correctIndex: number;
  explanation: string;
  conceptName: string;
}

interface TopicResult {
  topic: string;
  correct: boolean;
  topicColor: string;
}

interface ChapterReviewQuizProps {
  props?: {
    width?: number;
    height?: number;
    themeColor?: string;
    darkMode?: boolean;
    additionalProps?: {
      questions?: QuizQuestion[];
      chapterTitle?: string;
      chapterNumber?: number;
      instructionsForStudent?: string;
      teachingNotes?: string;
    };
  };
  setStepDetails?: (stepDetails: any) => void;
  stopAutoNext?: boolean;
  setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGULARITY DESIGN SYSTEM TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const DS = {
  indigo: "#4A4DC9",
  orange: "#FF7212",
  gradPurple: "#533086",
  gradOrange: "#FC9145",
  dark: "#4E4E4E",
  gray: "#CACACA",
  lightGray: "#EBEBEB",
  offWhite: "#F5F5F5",
  white: "#FFFFFF",
  lilac: "#C1C1EA",
  peach: "#FFF3E4",
  success: "#2D9F5F",
  successLight: "#E8F8EF",
  error: "#D93636",
  errorLight: "#FDECEC",
  indigoDark: "#3A3CA8",
  indigoLight: "#E8E8F6",
  orangeLight: "#FFF0E5",
  textPrimary: "#2D2D3F",
  textSecondary: "#6B6B80",
  textMuted: "#9C9CB0",
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: "rq1",
    topic: "Sign Rules",
    topicColor: DS.indigo,
    question: "What is the value of (−8) × (−5)?",
    options: [
      { label: "A", text: "−40" },
      { label: "B", text: "40" },
      { label: "C", text: "−13" },
      { label: "D", text: "13" },
    ],
    correctIndex: 1,
    explanation:
      "When both the multiplier and multiplicand are negative, the product is positive. The magnitude is 8 × 5 = 40, so (−8) × (−5) = +40.",
    conceptName: "Sign Rules for Multiplication",
  },
  {
    id: "rq2",
    topic: "Division Rules",
    topicColor: DS.orange,
    question: "If (−548) × 972 = −532656, what is (−532656) ÷ (−548)?",
    options: [
      { label: "A", text: "−972" },
      { label: "B", text: "972" },
      { label: "C", text: "−548" },
      { label: "D", text: "548" },
    ],
    correctIndex: 1,
    explanation:
      "Division of two negatives gives a positive result. Since (−548) × 972 = −532656, dividing −532656 by −548 reverses the multiplication and gives +972.",
    conceptName: "Sign Rules for Division",
  },
  {
    id: "rq3",
    topic: "Multiplicative Identity",
    topicColor: DS.gradPurple,
    question:
      'Riya says: "The integer whose product with (−1) is 31 must be −31." Is she correct?',
    options: [
      { label: "A", text: "Yes, because (−1) × (−31) = 31" },
      { label: "B", text: "No, the integer is 31" },
      { label: "C", text: "No, the integer is −1" },
      { label: "D", text: "Yes, because (−1) × 31 = 31" },
    ],
    correctIndex: 0,
    explanation:
      "We need an integer n such that (−1) × n = 31. Since −1 × a = −a for all integers, we need −n = 31, so n = −31. Riya is correct: (−1) × (−31) = 31.",
    conceptName: "Property of −1 (Additive Inverse via Multiplication)",
  },
  {
    id: "rq4",
    topic: "Commutative Property",
    topicColor: DS.success,
    question:
      "Which property of integer multiplication does the equation (−7) × 4 = 4 × (−7) demonstrate?",
    options: [
      { label: "A", text: "Associative property" },
      { label: "B", text: "Distributive property" },
      { label: "C", text: "Commutative property" },
      { label: "D", text: "Closure property" },
    ],
    correctIndex: 2,
    explanation:
      "When swapping the multiplier and multiplicand gives the same product, it demonstrates the commutative property: a × b = b × a. This holds for all integers.",
    conceptName: "Commutative Property of Multiplication",
  },
  {
    id: "rq5",
    topic: "Distributive Property",
    topicColor: DS.indigo,
    question:
      "Arjun evaluates (−5) × (18 + (−3)). Which calculation gives the same result using the distributive property?",
    options: [
      { label: "A", text: "(−5) × 18 + (−5) × (−3)" },
      { label: "B", text: "(−5) × 18 − (−3)" },
      { label: "C", text: "(−5) + 18 × (−5) + (−3)" },
      { label: "D", text: "(−5) × 18 + (−3)" },
    ],
    correctIndex: 0,
    explanation:
      "The distributive property states a × (b + c) = (a × b) + (a × c). So (−5) × (18 + (−3)) = (−5) × 18 + (−5) × (−3) = −90 + 15 = −75. Both paths give −75.",
    conceptName: "Distributive Property over Addition",
  },
  {
    id: "rq6",
    topic: "Word Problem",
    topicColor: DS.gradOrange,
    question:
      "A cement company earns ₹8 profit per bag of white cement and ₹5 loss per bag of grey cement. If it sells 3,000 white and 5,000 grey bags, what is the result?",
    options: [
      { label: "A", text: "₹1,000 loss" },
      { label: "B", text: "₹1,000 profit" },
      { label: "C", text: "₹49,000 profit" },
      { label: "D", text: "₹49,000 loss" },
    ],
    correctIndex: 0,
    explanation:
      "Profit from white cement = 3000 × 8 = ₹24,000. Loss from grey cement = 5000 × (−5) = −₹25,000. Total = 24,000 + (−25,000) = −₹1,000, which is a ₹1,000 loss.",
    conceptName: "Applying Integer Operations to Word Problems",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// EASING
// ═══════════════════════════════════════════════════════════════════════════════

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
  const n1 = 7.5625,
    d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

// ═══════════════════════════════════════════════════════════════════════════════
// DECORATIVE SHAPES (Singularity geometric shapes — circle, triangle, square)
// ═══════════════════════════════════════════════════════════════════════════════

const DecoShapes: React.FC<{ variant?: "light" | "medium" }> = ({
  variant = "light",
}) => {
  const op = variant === "light" ? 0.3 : 0.15;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <svg
        style={{ position: "absolute", top: -28, right: -18, opacity: op }}
        width="110"
        height="110"
        viewBox="0 0 110 110"
      >
        <circle
          cx="55"
          cy="55"
          r="48"
          fill="none"
          stroke={DS.lilac}
          strokeWidth="2"
        />
      </svg>
      <svg
        style={{
          position: "absolute",
          bottom: 24,
          left: -8,
          opacity: op,
          transform: "rotate(12deg)",
        }}
        width="76"
        height="76"
        viewBox="0 0 76 76"
      >
        <polygon
          points="38,4 72,68 4,68"
          fill="none"
          stroke={DS.gradOrange}
          strokeWidth="2"
        />
      </svg>
      <svg
        style={{ position: "absolute", top: "48%", right: -12, opacity: op }}
        width="56"
        height="56"
        viewBox="0 0 56 56"
      >
        <rect
          x="6"
          y="6"
          width="44"
          height="44"
          fill="none"
          stroke={DS.lilac}
          strokeWidth="2"
          rx="3"
        />
      </svg>
      <svg
        style={{
          position: "absolute",
          bottom: -8,
          right: 70,
          opacity: op * 0.6,
        }}
        width="44"
        height="44"
        viewBox="0 0 44 44"
      >
        <circle cx="22" cy="22" r="18" fill={DS.lilac} opacity="0.25" />
      </svg>
      <svg
        style={{ position: "absolute", top: 50, left: 28, opacity: op * 0.8 }}
        width="20"
        height="20"
        viewBox="0 0 20 20"
      >
        <circle cx="10" cy="10" r="5" fill={DS.gradOrange} opacity="0.35" />
      </svg>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const ChapterReviewQuiz: React.FC<ChapterReviewQuizProps> = ({
  props = {} as NonNullable<ChapterReviewQuizProps["props"]>,
}) => {
  const { additionalProps = {} } = props;
  const questions = additionalProps.questions || DEFAULT_QUESTIONS;
  const chapterTitle = additionalProps.chapterTitle || "Chapter 10 Review";
  const font = "'Poppins', sans-serif";

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null),
  );
  const [showSummary, setShowSummary] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [animPhase, setAnimPhase] = useState<"idle" | "entering" | "exiting">(
    "idle",
  );
  const [gaugeAnim, setGaugeAnim] = useState(0);
  const [confetti, setConfetti] = useState<
    {
      x: number;
      y: number;
      color: string;
      delay: number;
      size: number;
      shape: string;
    }[]
  >([]);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [pulseCorrect, setPulseCorrect] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [hoverBtn, setHoverBtn] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const styleId = "singularity-quiz-kf";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
      @keyframes sqSlideIn { 0%{opacity:0;transform:translateX(50px) scale(.96)} 100%{opacity:1;transform:translateX(0) scale(1)} }
      @keyframes sqSlideOut { 0%{opacity:1;transform:translateX(0) scale(1)} 100%{opacity:0;transform:translateX(-50px) scale(.96)} }
      @keyframes sqFadeInUp { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
      @keyframes sqPopIn { 0%{opacity:0;transform:scale(.6)} 70%{transform:scale(1.08)} 100%{opacity:1;transform:scale(1)} }
      @keyframes sqShakeX { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
      @keyframes sqPulseGlow { 0%{box-shadow:0 0 0 0 rgba(45,159,95,.45)} 70%{box-shadow:0 0 0 12px rgba(45,159,95,0)} 100%{box-shadow:0 0 0 0 rgba(45,159,95,0)} }
      @keyframes sqConfettiFall { 0%{opacity:1;transform:translateY(0) rotate(0) scale(1)} 100%{opacity:0;transform:translateY(380px) rotate(540deg) scale(.2)} }
      @keyframes sqStarBounce { 0%{transform:scale(0) rotate(-30deg);opacity:0} 60%{transform:scale(1.25) rotate(8deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
      @keyframes sqSlideInBottom { 0%{opacity:0;transform:translateY(30px)} 100%{opacity:1;transform:translateY(0)} }
      @keyframes sqTopBarSlide { 0%{opacity:0;transform:translateY(-16px)} 100%{opacity:1;transform:translateY(0)} }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);

  const q = questions[currentQ];
  const totalCorrect = answers.filter(
    (a, i) => a === questions[i].correctIndex,
  ).length;
  const scorePercent = Math.round((totalCorrect / questions.length) * 100);
  const starCount =
    scorePercent >= 90
      ? 3
      : scorePercent >= 60
        ? 2
        : scorePercent >= 30
          ? 1
          : 0;
  const topicResults: TopicResult[] = questions.map((qu, i) => ({
    topic: qu.topic,
    correct: answers[i] === qu.correctIndex,
    topicColor: qu.topicColor,
  }));

  // ─── Singularity pill button helper ──────────────────────────────
  const pillBtn = (
    v: "contained" | "outlined" | "highlight",
    d?: boolean,
  ): React.CSSProperties => {
    const b: React.CSSProperties = {
      fontFamily: font,
      fontWeight: 600,
      fontSize: 14,
      borderRadius: 40,
      padding: "12px 24px",
      cursor: d ? "default" : "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      transition: "all .25s cubic-bezier(.4,0,.2,1)",
      outline: "none",
      letterSpacing: ".01em",
    };
    if (v === "contained")
      return {
        ...b,
        background: d
          ? DS.lightGray
          : `linear-gradient(135deg,${DS.gradPurple},${DS.gradOrange})`,
        color: d ? DS.gray : DS.white,
        border: "none",
        boxShadow: d ? "none" : "0 4px 16px rgba(83,48,134,.25)",
      };
    if (v === "outlined")
      return {
        ...b,
        background: "transparent",
        color: d ? DS.gray : DS.indigo,
        border: `2px solid ${d ? DS.lightGray : DS.indigo}`,
      };
    return {
      ...b,
      background: d ? DS.lightGray : DS.orange,
      color: DS.white,
      border: "none",
      boxShadow: d ? "none" : "0 4px 16px rgba(255,114,18,.3)",
    };
  };

  const handleSelect = useCallback(
    (idx: number) => {
      if (answered) return;
      setSelectedIndex(idx);
      setAnswered(true);
      const na = [...answers];
      na[currentQ] = idx;
      setAnswers(na);
      if (idx === q.correctIndex) {
        setPulseCorrect(true);
        setTimeout(() => setPulseCorrect(false), 700);
      } else {
        setShakeWrong(true);
        setTimeout(() => setShakeWrong(false), 500);
      }
    },
    [answered, answers, currentQ, q],
  );

  const handleNext = useCallback(() => {
    if (currentQ < questions.length - 1) {
      setAnimPhase("exiting");
      setTimeout(() => {
        setCurrentQ((p) => p + 1);
        setSelectedIndex(null);
        setAnswered(false);
        setHoverBtn(null);
        setAnimPhase("entering");
        setTimeout(() => setAnimPhase("idle"), 400);
      }, 280);
    } else {
      setAnimPhase("exiting");
      setTimeout(() => {
        setShowSummary(true);
        const st = Date.now(),
          dur = 1300,
          tgt = scorePercent;
        const ag = () => {
          const p = Math.min((Date.now() - st) / dur, 1);
          setGaugeAnim(easeOutCubic(p) * tgt);
          if (p < 1) requestAnimationFrame(ag);
        };
        requestAnimationFrame(ag);
        if (scorePercent >= 50) {
          const cs = [
            DS.indigo,
            DS.orange,
            DS.gradPurple,
            DS.gradOrange,
            DS.lilac,
            DS.success,
          ];
          const ss = ["circle", "square", "triangle"];
          setConfetti(
            Array.from({ length: 36 }, (_, i) => ({
              x: Math.random() * 100,
              y: -10 - Math.random() * 20,
              color: cs[i % cs.length],
              delay: Math.random(),
              size: 6 + Math.random() * 8,
              shape: ss[i % ss.length],
            })),
          );
        }
      }, 280);
    }
  }, [currentQ, questions.length, scorePercent]);

  const handleRestart = useCallback(() => {
    setShowSummary(false);
    setCurrentQ(0);
    setSelectedIndex(null);
    setAnswered(false);
    setAnswers(Array(questions.length).fill(null));
    setAnimPhase("entering");
    setGaugeAnim(0);
    setConfetti([]);
    setHoverBtn(null);
    setTimeout(() => setAnimPhase("idle"), 400);
  }, [questions.length]);

  const handleReviewMistakes = useCallback(() => {
    const fw = answers.findIndex((a, i) => a !== questions[i].correctIndex);
    if (fw !== -1) {
      setShowSummary(false);
      setCurrentQ(fw);
      setSelectedIndex(answers[fw]);
      setAnswered(true);
      setAnimPhase("entering");
      setTimeout(() => setAnimPhase("idle"), 400);
    }
  }, [answers, questions]);

  // ═══════════════════════════════════════════════════════════════════
  // INSTRUCTIONS SCREEN
  // ═══════════════════════════════════════════════════════════════════
  if (showInstructions) {
    return (
      <div
        style={{
          fontFamily: font,
          background: DS.offWhite,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          position: "relative",
        }}
      >
        <DecoShapes variant="light" />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            background: DS.white,
            borderRadius: 20,
            padding: "44px 32px 36px",
            maxWidth: 520,
            width: "100%",
            boxShadow:
              "0 12px 48px rgba(74,77,201,.08),0 2px 8px rgba(0,0,0,.04)",
            animation: "sqPopIn .5s ease-out",
            textAlign: "center",
            border: `1px solid ${DS.lightGray}`,
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 20,
              background: `linear-gradient(135deg,${DS.gradPurple},${DS.gradOrange})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 8px 24px rgba(83,48,134,.25)",
            }}
          >
            <BookOpen size={32} color="#fff" />
          </div>
          <h1
            style={{
              fontFamily: font,
              fontWeight: 800,
              fontSize: 24,
              color: DS.textPrimary,
              margin: "0 0 4px",
              letterSpacing: "-.02em",
            }}
          >
            {chapterTitle}
          </h1>
          <p
            style={{
              fontFamily: font,
              fontWeight: 600,
              fontSize: 15,
              color: DS.indigo,
              margin: "0 0 24px",
            }}
          >
            Operations with Integers
          </p>

          <div
            style={{
              background: DS.peach,
              borderRadius: 14,
              padding: "18px",
              textAlign: "left",
              marginBottom: 24,
              border: `1px solid ${DS.orange}20`,
            }}
          >
            <p
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: DS.textPrimary,
                margin: "0 0 8px",
                textTransform: "uppercase",
                letterSpacing: ".04em",
              }}
            >
              Instructions
            </p>
            <p
              style={{
                fontSize: 13,
                color: DS.textSecondary,
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              Answer each question carefully — each one tests a different
              concept from the chapter. After answering, read the explanation
              and identify which topic it comes from: sign rules, properties, or
              word problems. At the end, check your score and revisit any topic
              where you made a mistake.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
              marginBottom: 28,
            }}
          >
            {[
              { l: "Sign Rules", c: DS.indigo },
              { l: "Division Rules", c: DS.orange },
              { l: "Identity", c: DS.gradPurple },
              { l: "Commutative", c: DS.success },
              { l: "Distributive", c: DS.indigo },
              { l: "Word Problem", c: DS.gradOrange },
            ].map((t) => (
              <span
                key={t.l}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: t.c,
                  background: t.c + "14",
                  borderRadius: 40,
                  padding: "4px 14px",
                  border: `1.5px solid ${t.c}30`,
                  fontFamily: font,
                }}
              >
                {t.l}
              </span>
            ))}
          </div>

          <button
            onClick={() => setShowInstructions(false)}
            style={{
              ...pillBtn("contained"),
              fontSize: 16,
              fontWeight: 700,
              padding: "14px 48px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-2px) scale(1.03)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 8px 28px rgba(83,48,134,.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(0) scale(1)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 16px rgba(83,48,134,.25)";
            }}
            aria-label="Start the quiz"
          >
            Start Quiz <ChevronRight size={18} />
          </button>
          <p
            style={{
              fontSize: 12,
              color: DS.textMuted,
              margin: "18px 0 0",
              fontWeight: 500,
            }}
          >
            {questions.length} questions · ~5 minutes
          </p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // SUMMARY SCREEN
  // ═══════════════════════════════════════════════════════════════════
  if (showSummary) {
    const circ = 2 * Math.PI * 45;
    const dOff = circ - (circ * gaugeAnim) / 100;
    const gc =
      scorePercent >= 70
        ? DS.success
        : scorePercent >= 40
          ? DS.orange
          : DS.error;
    const mc = answers.filter((a, i) => a !== questions[i].correctIndex).length;

    return (
      <div
        style={{
          fontFamily: font,
          background: DS.offWhite,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <DecoShapes variant="medium" />
        {confetti.map((c, i) => (
          <div
            key={i}
            style={{
              position: "fixed",
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: c.size,
              height: c.size,
              borderRadius:
                c.shape === "circle"
                  ? "50%"
                  : c.shape === "square"
                    ? "3px"
                    : "0",
              background: c.shape === "triangle" ? "transparent" : c.color,
              borderLeft:
                c.shape === "triangle"
                  ? `${c.size / 2}px solid transparent`
                  : undefined,
              borderRight:
                c.shape === "triangle"
                  ? `${c.size / 2}px solid transparent`
                  : undefined,
              borderBottom:
                c.shape === "triangle"
                  ? `${c.size}px solid ${c.color}`
                  : undefined,
              animation: `sqConfettiFall 2.8s ${c.delay}s ease-in forwards`,
              zIndex: 100,
              pointerEvents: "none",
            }}
          />
        ))}

        <div
          style={{
            position: "relative",
            zIndex: 1,
            background: DS.white,
            borderRadius: 20,
            padding: "40px 28px 32px",
            maxWidth: 520,
            width: "100%",
            boxShadow:
              "0 12px 48px rgba(74,77,201,.08),0 2px 8px rgba(0,0,0,.04)",
            animation: "sqFadeInUp .55s ease-out",
            textAlign: "center",
            border: `1px solid ${DS.lightGray}`,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 28,
            }}
          >
            <Award size={24} color={DS.indigo} />
            <h2
              style={{
                fontFamily: font,
                fontWeight: 800,
                fontSize: 22,
                color: DS.textPrimary,
                margin: 0,
              }}
            >
              Quiz Complete!
            </h2>
          </div>

          {/* Gauge */}
          <div
            style={{
              position: "relative",
              width: 150,
              height: 150,
              margin: "0 auto 18px",
            }}
          >
            <svg width="150" height="150" viewBox="0 0 100 100">
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
                stroke={gc}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={dOff}
                transform="rotate(-90 50 50)"
                style={{ transition: "stroke .4s" }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontFamily: font,
                  fontWeight: 800,
                  fontSize: 30,
                  color: gc,
                }}
              >
                {totalCorrect}/{questions.length}
              </span>
              <br />
              <span
                style={{ fontSize: 12, color: DS.textMuted, fontWeight: 600 }}
              >
                {Math.round(gaugeAnim)}%
              </span>
            </div>
          </div>

          {/* Stars */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              marginBottom: 28,
            }}
          >
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  animation:
                    s <= starCount
                      ? `sqStarBounce .5s ${0.3 + s * 0.2}s ease-out both`
                      : "none",
                }}
              >
                <Star
                  size={30}
                  fill={s <= starCount ? DS.orange : "none"}
                  color={s <= starCount ? DS.orange : DS.gray}
                  strokeWidth={2}
                />
              </div>
            ))}
          </div>

          {/* Topic breakdown */}
          <div
            style={{
              background: DS.offWhite,
              borderRadius: 14,
              padding: "16px",
              marginBottom: 28,
              textAlign: "left",
              border: `1px solid ${DS.lightGray}`,
            }}
          >
            <p
              style={{
                fontWeight: 700,
                fontSize: 12,
                color: DS.textPrimary,
                margin: "0 0 14px",
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              Topic-wise Breakdown
            </p>
            {topicResults.map((tr, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 0",
                  borderBottom:
                    i < topicResults.length - 1
                      ? `1px solid ${DS.lightGray}`
                      : "none",
                  animation: `sqSlideInBottom .35s ${0.08 * i}s ease-out both`,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: tr.topicColor,
                    background: tr.topicColor + "14",
                    borderRadius: 40,
                    padding: "3px 12px",
                    border: `1.5px solid ${tr.topicColor}30`,
                    minWidth: 105,
                    textAlign: "center",
                    fontFamily: font,
                  }}
                >
                  {tr.topic}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 12,
                    color: DS.textMuted,
                    fontWeight: 500,
                  }}
                >
                  Q{i + 1}
                </span>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: tr.correct ? DS.successLight : DS.errorLight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {tr.correct ? (
                    <Check size={14} color={DS.success} strokeWidth={3} />
                  ) : (
                    <X size={14} color={DS.error} strokeWidth={3} />
                  )}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {mc > 0 && (
              <button
                onClick={handleReviewMistakes}
                style={{
                  ...pillBtn("outlined"),
                  color: DS.error,
                  borderColor: DS.error + "60",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    DS.errorLight;
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                }}
                aria-label="Review mistakes"
              >
                <Target size={15} /> Review Mistakes
              </button>
            )}
            <button
              onClick={handleRestart}
              style={pillBtn("contained")}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 28px rgba(83,48,134,.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 16px rgba(83,48,134,.25)";
              }}
              aria-label="Retake quiz"
            >
              <RotateCcw size={15} /> Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // QUIZ SCREEN
  // ═══════════════════════════════════════════════════════════════════
  const progPct = ((currentQ + (answered ? 1 : 0)) / questions.length) * 100;
  const isCorrect = selectedIndex === q.correctIndex;
  const qAnim =
    animPhase === "entering"
      ? "sqSlideIn .4s ease-out"
      : animPhase === "exiting"
        ? "sqSlideOut .28s ease-in forwards"
        : "none";

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: font,
        background: DS.offWhite,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <DecoShapes variant="light" />

      {/* TOP BAR */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          background: DS.white,
          borderBottom: `1px solid ${DS.lightGray}`,
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          animation: mounted ? "sqTopBarSlide .35s ease-out" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: `linear-gradient(135deg,${DS.indigo},${DS.orange})`,
            }}
          />
          <span
            style={{
              fontFamily: font,
              fontWeight: 700,
              fontSize: 15,
              color: DS.textPrimary,
            }}
          >
            {chapterTitle}
          </span>
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: DS.textMuted,
            background: DS.offWhite,
            borderRadius: 40,
            padding: "4px 14px",
            border: `1px solid ${DS.lightGray}`,
          }}
        >
          Question {currentQ + 1} of {questions.length}
        </span>
      </div>

      {/* PROGRESS */}
      <div
        style={{
          height: 4,
          background: DS.lightGray,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            height: "100%",
            background: `linear-gradient(90deg,${DS.indigo},${DS.gradPurple},${DS.gradOrange},${DS.orange})`,
            width: `${progPct}%`,
            borderRadius: "0 4px 4px 0",
            transition: "width .5s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </div>

      {/* QUESTION */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: 560, width: "100%", animation: qAnim }}>
          {/* Topic badge */}
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <span
              style={{
                display: "inline-block",
                fontSize: 11,
                fontWeight: 700,
                color: q.topicColor,
                background: q.topicColor + "14",
                border: `1.5px solid ${q.topicColor}30`,
                borderRadius: 40,
                padding: "5px 18px",
                letterSpacing: ".03em",
                textTransform: "uppercase",
                fontFamily: font,
              }}
            >
              {q.topic}
            </span>
          </div>

          {/* Question card */}
          <div
            style={{
              background: DS.white,
              borderRadius: 16,
              padding: "28px 24px",
              boxShadow:
                "0 4px 20px rgba(74,77,201,.06),0 1px 4px rgba(0,0,0,.03)",
              marginBottom: 20,
              border: `1px solid ${DS.lightGray}`,
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
                background: `linear-gradient(90deg,${DS.indigo},${DS.orange})`,
                borderRadius: "16px 16px 0 0",
              }}
            />
            <p
              style={{
                fontFamily: font,
                fontWeight: 700,
                fontSize: 17,
                color: DS.textPrimary,
                margin: 0,
                lineHeight: 1.6,
                textAlign: "center",
              }}
            >
              {q.question}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, idx) => {
              const isSel = selectedIndex === idx;
              const isCorr = idx === q.correctIndex;
              const isH = hoverBtn === idx && !answered;

              let bg = DS.white,
                bc = DS.lightGray,
                tc = DS.textPrimary,
                sh = "0 1px 4px rgba(0,0,0,.03)",
                lb = DS.offWhite,
                lc = DS.textSecondary;

              if (isH && !answered) {
                bc = DS.indigo;
                bg = DS.indigoLight;
                sh = "0 2px 12px rgba(74,77,201,.12)";
                lb = DS.indigo;
                lc = DS.white;
              }

              if (answered) {
                if (isCorr) {
                  bg = DS.successLight;
                  bc = DS.success;
                  tc = "#1a5c36";
                  sh = "0 2px 14px rgba(45,159,95,.15)";
                  lb = DS.success;
                  lc = DS.white;
                } else if (isSel && !isCorr) {
                  bg = DS.errorLight;
                  bc = DS.error;
                  tc = "#8b1a1a";
                  sh = "0 2px 14px rgba(217,54,54,.12)";
                  lb = DS.error;
                  lc = DS.white;
                } else {
                  bg = DS.offWhite;
                  bc = DS.lightGray;
                  tc = DS.textMuted;
                  sh = "none";
                  lb = DS.lightGray;
                  lc = DS.gray;
                }
              }

              const sk = answered && isSel && !isCorr && shakeWrong;
              const pk = answered && isCorr && pulseCorrect;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={answered}
                  aria-label={`Option ${opt.label}: ${opt.text}`}
                  onMouseEnter={() => !answered && setHoverBtn(idx)}
                  onMouseLeave={() => !answered && setHoverBtn(null)}
                  style={{
                    fontFamily: font,
                    fontWeight: 600,
                    fontSize: 14,
                    color: tc,
                    background: bg,
                    border: `2px solid ${bc}`,
                    borderRadius: 14,
                    padding: "14px 20px",
                    cursor: answered ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    textAlign: "left",
                    transition: "all .22s cubic-bezier(.4,0,.2,1)",
                    boxShadow: sh,
                    outline: "none",
                    animation: sk
                      ? "sqShakeX .4s ease"
                      : pk
                        ? "sqPulseGlow .6s ease"
                        : `sqFadeInUp .3s ${0.04 * idx}s ease-out both`,
                    transform:
                      isH && !answered ? "translateY(-1px)" : "translateY(0)",
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: lb,
                      color: lc,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 13,
                      flexShrink: 0,
                      transition: "all .25s",
                      fontFamily: font,
                    }}
                  >
                    {answered && isCorr ? (
                      <Check size={16} strokeWidth={3} />
                    ) : answered && isSel ? (
                      <X size={16} strokeWidth={3} />
                    ) : (
                      opt.label
                    )}
                  </span>
                  <span style={{ flex: 1, lineHeight: 1.4 }}>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div
              style={{
                marginTop: 16,
                background: isCorrect ? DS.successLight : DS.errorLight,
                border: `1.5px solid ${isCorrect ? DS.success + "40" : DS.error + "40"}`,
                borderRadius: 14,
                padding: "18px 20px",
                animation: "sqFadeInUp .35s ease-out",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: isCorrect ? DS.success : DS.error,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {isCorrect ? (
                    <Check size={14} color="#fff" strokeWidth={3} />
                  ) : (
                    <X size={14} color="#fff" strokeWidth={3} />
                  )}
                </div>
                <span
                  style={{
                    fontFamily: font,
                    fontWeight: 700,
                    fontSize: 14,
                    color: isCorrect ? "#1a5c36" : "#8b1a1a",
                  }}
                >
                  {isCorrect
                    ? `${q.conceptName} confirmed!`
                    : "Not quite — let's review!"}
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.75,
                  color: DS.textSecondary,
                  margin: 0,
                }}
              >
                <strong style={{ color: DS.textPrimary, fontWeight: 700 }}>
                  {q.conceptName}:{" "}
                </strong>
                {q.explanation}
              </p>
            </div>
          )}

          {/* Next */}
          {answered && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 20,
                animation: "sqFadeInUp .35s .12s ease-out both",
              }}
            >
              <button
                onClick={handleNext}
                aria-label={
                  currentQ < questions.length - 1
                    ? "Next question"
                    : "See results"
                }
                style={{
                  ...pillBtn("contained"),
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "14px 40px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-2px) scale(1.02)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 28px rgba(83,48,134,.35)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0) scale(1)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 16px rgba(83,48,134,.25)";
                }}
              >
                {currentQ < questions.length - 1
                  ? "Next Question"
                  : "See Results"}{" "}
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterReviewQuiz;
