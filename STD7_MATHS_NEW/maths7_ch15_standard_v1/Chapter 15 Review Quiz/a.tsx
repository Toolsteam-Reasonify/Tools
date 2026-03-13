// @ts-ignore - react types resolved at project level
import React, { useState, useEffect, useCallback, useMemo } from "react";
// @ts-ignore - lucide-react types resolved at project level
import { Check, X, ChevronRight, RotateCcw, BookOpen, Target, Zap, Trophy, Star } from "lucide-react";

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
  correctAnswer: number;
  explanation: string;
  concept: string;
  difficulty: "easy" | "medium" | "hard";
}

interface QuizAdditionalProps {
  questions?: QuizQuestion[];
  title?: string;
  subtitle?: string;
  passingScore?: number;
  showExplanations?: boolean;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  timeLimit?: number;
  themeGradient?: string[];
  conceptTags?: string[];
  teachingNotes?: string;
  studentInstructions?: string;
}

interface ChapterSummaryQuizProps {
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

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
  colors: {
    primary: "#4A4DC9",
    primaryDark: "#3538A0",
    accent: "#FF7212",
    accentDark: "#E5600A",
    purple: "#533086",
    purpleLight: "#C1C1EA",
    purpleBg: "#EEEDF8",
    orange: "#FC9145",
    orangeLight: "#FFF3E4",
    orangeBg: "#FFF8F0",
    gray900: "#1A1A2E",
    gray700: "#4E4E4E",
    gray500: "#7A7A8E",
    gray400: "#9E9EB0",
    gray300: "#CACACA",
    gray200: "#EBEBEB",
    gray100: "#F5F5F5",
    white: "#FFFFFF",
    success: "#22C55E",
    successBg: "#ECFDF5",
    error: "#EF4444",
    errorBg: "#FEF2F2",
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, full: 9999 },
  font: "'Poppins', 'Segoe UI', system-ui, -apple-system, sans-serif",
};

// ==================== DEFAULT QUESTIONS ====================

const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question:
      "A balanced weighing scale has 3 bags and a 2 kg weight on the left, and a 10 kg weight on the right. If all bags weigh the same, what does each bag weigh? Which principle helps us find this?",
    options: [
      "Each bag = 2⅔ kg; Balance Principle (equal weights on both sides stay balanced)",
      "Each bag = 3 kg; Trial and Error method",
      "Each bag = 4 kg; Transposition rule",
      "Each bag = 2 kg; Inverse operations",
    ],
    correctAnswer: 0,
    explanation:
      "The balance principle tells us both sides are equal: 3b + 2 = 10. Subtracting 2 from both sides gives 3b = 8, so b = 8/3 = 2⅔ kg. When we remove equal weights from both plates, the scale stays balanced.",
    concept: "Balance Principle",
    difficulty: "medium",
  },
  {
    id: 2,
    question:
      "Which of the following is the best definition of an algebraic equation?",
    options: [
      "Any expression that contains a letter-number (variable)",
      "A statement of equality between two algebraic expressions, with an '=' sign between them",
      "A formula used to calculate the area of shapes",
      "A number sentence that always has a whole number as the answer",
    ],
    correctAnswer: 1,
    explanation:
      "An equation is a statement that says two algebraic expressions are equal. For example, 2n + 1 = 99 has a Left Hand Side (LHS) and a Right Hand Side (RHS) connected by '='. The LHS value must equal the RHS value for the equation to hold.",
    concept: "Equation Definition",
    difficulty: "easy",
  },
  {
    id: 3,
    question:
      "Riya wants to solve 2n + 1 = 99 using trial and error. She tries n = 30 (LHS = 61), then n = 50 (LHS = 101). What should she try next, and what is the limitation of this method?",
    options: [
      "Try n = 49; this method is always the fastest",
      "Try n = 40; this method works only for small numbers",
      "Try n = 49; this method can be inefficient because it may require many guesses",
      "Try n = 45; this method gives wrong answers for fractions",
    ],
    correctAnswer: 2,
    explanation:
      "Since n = 50 gives 101 (too high) and n = 30 gives 61 (too low), we try n = 49: 2(49) + 1 = 99 ✓. The trial and error method works but can be very inefficient — you may need many attempts, especially with equations whose solutions are fractions or large numbers.",
    concept: "Trial and Error",
    difficulty: "medium",
  },
  {
    id: 4,
    question:
      "To solve 5x − 4 = 7 systematically, we add 4 to both sides to get 5x = 11, then divide both sides by 5 to get x = 11/5. Which mathematical idea makes this valid?",
    options: [
      "The commutative property of addition",
      "The trial and error method",
      "Performing the same operation on both sides of an equation preserves equality (inverse operations)",
      "The distributive property of multiplication",
    ],
    correctAnswer: 2,
    explanation:
      "Since LHS and RHS have the same value, doing the same operation (adding 4, then dividing by 5) to both sides keeps them equal. We use inverse operations: addition is the inverse of subtraction, and division is the inverse of multiplication.",
    concept: "Inverse Operations",
    difficulty: "easy",
  },
  {
    id: 5,
    question:
      "In the equation 6y + 7 = 4y + 21, what is the correct first step using transposition to bring all unknown terms to one side?",
    options: [
      "Divide both sides by 2",
      "Subtract 4y from both sides to get 2y + 7 = 21",
      "Add 4y to both sides to get 10y + 7 = 21",
      "Subtract 7 from both sides to get 6y = 4y + 14",
    ],
    correctAnswer: 1,
    explanation:
      "When a term is moved from one side to the other, its additive inverse appears. Subtracting 4y from both sides: 6y − 4y + 7 = 21, giving 2y + 7 = 21. Then subtract 7: 2y = 14, so y = 7.",
    concept: "Transposition",
    difficulty: "medium",
  },
  {
    id: 6,
    question:
      "Madhubanti can spend ₹500 on snacks (₹25 per plate) with a ₹50 delivery charge. She has 5 family members. How many friends can she invite? Which equation models this?",
    options: [
      "25f = 500; she can invite 20 friends",
      "25(f + 5) + 50 = 500; she can invite 13 friends",
      "25f + 50 = 500; she can invite 18 friends",
      "50f + 25 = 500; she can invite 9 friends",
    ],
    correctAnswer: 1,
    explanation:
      "Let f = number of friends. Total people = f + 5 (friends + family). Cost = 25(f + 5) + 50 = 500. Subtracting 50: 25(f + 5) = 450. Dividing by 25: f + 5 = 18. So f = 13.",
    concept: "Word Problems",
    difficulty: "hard",
  },
  {
    id: 7,
    question:
      "Ancient Indian mathematicians wrote 3x + 4 = 2x + 8 as 'yā 3 rū 4' over 'yā 2 rū 8'. What does 'yā' stand for, and who first systematically described algebra with unknowns?",
    options: [
      "'yā' stands for 'yoga' (union); Aryabhata in 200 BCE",
      "'yā' is short for 'yāvat-tāvat' (as much as needed); Brahmagupta in 628 CE",
      "'yā' stands for 'yantra' (machine); Al-Khwarizmi in 825 CE",
      "'yā' stands for 'yathā' (as if); Bhāskarāchārya in 1150 CE",
    ],
    correctAnswer: 1,
    explanation:
      "The symbol 'yā' was short for 'yāvat-tāvat' meaning 'as much as needed' — representing the unknown. Brahmagupta's Brāhmasphuṭasiddhānta (628 CE) contained one of the earliest known works on algebra.",
    concept: "History of Algebra",
    difficulty: "medium",
  },
  {
    id: 8,
    question:
      "A magic trick says: Think of a number, multiply by 2, add 10, divide by 2, subtract the original number, then add 3. The answer is always 8. If the starting number is x, which expression shows why?",
    options: [
      "After all steps: (2x + 10)/2 − x + 3 = x + 5 − x + 3 = 8 ✓",
      "The trick only works for positive numbers",
      "After all steps: 2x + 10 − x + 3 = x + 13, which equals 8 only when x = −5",
      "It works because dividing by 2 always cancels the multiplication by 2",
    ],
    correctAnswer: 0,
    explanation:
      "Start with x → ×2: 2x → +10: 2x+10 → ÷2: x+5 → −x: 5 → +3: 8. The algebra shows 'x' always cancels out, leaving 8 regardless of starting number. This is the power of algebraic reasoning!",
    concept: "Algebraic Modelling",
    difficulty: "hard",
  },
];

// ==================== KEYFRAMES ====================

const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
  @keyframes fadeInUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
  @keyframes fadeInDown { from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)} }
  @keyframes fadeInScale { from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)} }
  @keyframes popIn { 0%{transform:scale(0);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1} }
  @keyframes pulse { 0%,100%{transform:scale(1)}50%{transform:scale(1.04)} }
  @keyframes slideInLeft { from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)} }
  @keyframes slideInRight { from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)} }
  @keyframes bounce { 0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)} }
  @keyframes correctPulse { 0%{box-shadow:0 0 0 0 rgba(34,197,94,.45)}70%{box-shadow:0 0 0 12px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)} }
  @keyframes wrongShake { 0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)} }
  @keyframes confetti { 0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(-80px) rotate(540deg);opacity:0} }
  @keyframes starSpin { from{transform:rotate(0) scale(0);opacity:0}50%{transform:rotate(180deg) scale(1.2);opacity:1}to{transform:rotate(360deg) scale(1);opacity:1} }
  @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(74,77,201,.2)}50%{box-shadow:0 0 36px rgba(74,77,201,.45)} }
  @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)} }
`;

// ==================== RESPONSIVE HOOK ====================

type Breakpoint = "mobile" | "tablet" | "desktop";

function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("desktop");
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setBp(w < 480 ? "mobile" : w < 768 ? "tablet" : "desktop");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return bp;
}

// ==================== DECO SHAPE ====================

const DecoShape = ({
  shape,
  size,
  color,
  filled = false,
  style = {},
}: {
  shape: "circle" | "triangle" | "square";
  size: number;
  color: string;
  filled?: boolean;
  style?: React.CSSProperties;
}) => {
  if (shape === "triangle") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        style={{ ...style, flexShrink: 0, display: "block" }}
      >
        <polygon
          points="20,4 36,36 4,36"
          fill={filled ? color : "none"}
          stroke={color}
          strokeWidth="2"
          opacity={0.35}
        />
      </svg>
    );
  }
  if (shape === "square") {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.15,
          background: filled ? color : "transparent",
          border: `2px solid ${color}`,
          opacity: 0.3,
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: filled ? color : "transparent",
        border: `2px solid ${color}`,
        opacity: 0.3,
        flexShrink: 0,
        ...style,
      }}
    />
  );
};

// ==================== SINGULARITY BUTTON ====================

const SBtn = ({
  variant = "contained",
  color = "primary",
  disabled = false,
  onClick,
  children,
  style = {},
  compact = false,
}: {
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "accent";
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  compact?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const c = color === "primary" ? DS.colors.primary : DS.colors.accent;
  const cDk =
    color === "primary" ? DS.colors.primaryDark : DS.colors.accentDark;
  const cLt =
    color === "primary" ? DS.colors.purpleLight : DS.colors.orangeLight;

  let bg = c;
  let txt = DS.colors.white;
  let bdr = `2px solid ${c}`;

  if (variant === "outlined") {
    bg = DS.colors.white;
    txt = c;
    bdr = `2px solid ${c}`;
    if (hovered) bg = cLt;
  } else if (variant === "text") {
    bg = "transparent";
    txt = c;
    bdr = "2px solid transparent";
    if (hovered) {
      bg = `${c}08`;
    }
  } else {
    if (hovered) bg = cDk;
  }

  if (disabled) {
    bg = DS.colors.gray200;
    txt = DS.colors.gray300;
    bdr = `2px solid ${DS.colors.gray200}`;
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => !disabled && setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        padding: compact ? "10px 20px" : "12px 28px",
        borderRadius: DS.radius.full,
        border: bdr,
        background: bg,
        color: txt,
        fontSize: compact ? 13 : 14,
        fontWeight: 600,
        fontFamily: DS.font,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        transform: pressed
          ? "scale(0.96)"
          : hovered && !disabled
            ? "scale(1.02)"
            : "scale(1)",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        letterSpacing: "0.2px",
        lineHeight: 1.4,
        boxShadow:
          variant === "contained" && !disabled
            ? hovered
              ? `0 6px 20px ${c}35`
              : `0 3px 12px ${c}20`
            : "none",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
    >
      {children}
    </button>
  );
};

// ==================== MAIN COMPONENT ====================

type ToolConfigProps = NonNullable<ChapterSummaryQuizProps["props"]>;
const ChapterSummaryQuiz: React.FC<ChapterSummaryQuizProps> = ({
  props = {} as ToolConfigProps,
}) => {
  const ap = (props.additionalProps || {}) as QuizAdditionalProps;
  const bp = useBreakpoint();
  const mob = bp === "mobile";
  const tab = bp === "tablet";

  const {
    questions = DEFAULT_QUESTIONS,
    title = "Finding the Unknown — Chapter Quiz",
    subtitle = "Chapter 7 • Ganita Prakash • Grade 7",
    passingScore = 60,
    showExplanations = true,
    shuffleQuestions = false,
    teachingNotes = "Guide students through this interactive tool. Encourage exploration and discussion.",
    studentInstructions = "MCQ questions reviewing: equation definition, trial-and-error, inverse operations, transposition, word problem framing, algebra history.",
  } = ap;

  // ==================== STATE ====================

  const [screen, setScreen] = useState<"intro" | "quiz" | "result">("intro");
  const [curQ, setCurQ] = useState(0);
  const [selAns, setSelAns] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null),
  );
  const [score, setScore] = useState(0);
  const [ak, setAk] = useState(0);
  const [hov, setHov] = useState<number | null>(null);
  const [showExp, setShowExp] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [parts, setParts] = useState<
    { id: number; x: number; y: number; color: string }[]
  >([]);

  const qs = useMemo(
    () =>
      shuffleQuestions
        ? [...questions].sort(() => Math.random() - 0.5)
        : questions,
    [questions, shuffleQuestions],
  );

  // ==================== INJECT KEYFRAMES ====================

  useEffect(() => {
    const existing = document.getElementById("sq-kf");
    if (existing) return;
    const s = document.createElement("style");
    s.id = "sq-kf";
    s.textContent = keyframes;
    document.head.appendChild(s);
    return () => {
      const e = document.getElementById("sq-kf");
      if (e) document.head.removeChild(e);
    };
  }, []);

  // ==================== HANDLERS ====================

  const onSelect = useCallback(
    (i: number) => {
      if (!answered) setSelAns(i);
    },
    [answered],
  );

  const onConfirm = useCallback(() => {
    if (selAns === null || answered) return;
    setAnswered(true);
    const ok = selAns === qs[curQ].correctAnswer;
    const na = [...answers];
    na[curQ] = selAns;
    setAnswers(na);
    if (ok) {
      setScore((p) => p + 1);
      const ns = streak + 1;
      setStreak(ns);
      if (ns > maxStreak) setMaxStreak(ns);
      setParts(
        Array.from({ length: 10 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: [
            DS.colors.primary,
            DS.colors.accent,
            DS.colors.purple,
            DS.colors.success,
            DS.colors.orange,
          ][Math.floor(Math.random() * 5)],
        })),
      );
      setTimeout(() => setParts([]), 1100);
    } else {
      setStreak(0);
    }
    if (showExplanations) setTimeout(() => setShowExp(true), 350);
  }, [
    selAns,
    answered,
    curQ,
    qs,
    answers,
    streak,
    maxStreak,
    showExplanations,
  ]);

  const onNext = useCallback(() => {
    if (curQ < qs.length - 1) {
      setCurQ((p) => p + 1);
      setSelAns(null);
      setAnswered(false);
      setShowExp(false);
      setAk((p) => p + 1);
    } else {
      setScreen("result");
      setAk((p) => p + 1);
    }
  }, [curQ, qs.length]);

  const onRestart = useCallback(() => {
    setScreen("intro");
    setCurQ(0);
    setSelAns(null);
    setAnswered(false);
    setShowExp(false);
    setAnswers(new Array(questions.length).fill(null));
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setAk((p) => p + 1);
  }, [questions.length]);

  // ==================== COMPUTED ====================

  const pct = Math.round((score / qs.length) * 100);
  const pass = pct >= passingScore;
  const q = qs[curQ];

  const cMap: Record<string, string> = {
    "Balance Principle": DS.colors.primary,
    "Equation Definition": DS.colors.purple,
    "Trial and Error": DS.colors.accent,
    "Inverse Operations": DS.colors.success,
    Transposition: "#D946EF",
    "Word Problems": "#0891B2",
    "History of Algebra": DS.colors.purple,
    "Algebraic Modelling": DS.colors.accent,
  };

  const dMap: Record<string, string> = {
    easy: DS.colors.success,
    medium: DS.colors.orange,
    hard: DS.colors.error,
  };

  const pad = mob ? 16 : tab ? 24 : 32;

  // ==================== INTRO SCREEN ====================

  const introView = () => (
    <div style={{ padding: pad, position: "relative" }}>
      <div
        style={{
          background: DS.colors.white,
          borderRadius: DS.radius.xl,
          padding: mob ? "24px 16px" : "36px 32px",
          boxShadow: "0 4px 24px rgba(74,77,201,.06)",
          border: `1px solid ${DS.colors.gray200}`,
          textAlign: "center" as const,
          animation: "fadeInUp .5s ease-out",
          position: "relative" as const,
          overflow: "hidden" as const,
        }}
      >
        {/* Decorative shapes - hidden on mobile */}
        {!mob && (
          <>
            <DecoShape
              shape="circle"
              size={44}
              color={DS.colors.purpleLight}
              filled
              style={{ position: "absolute", top: 16, right: 24 }}
            />
            <DecoShape
              shape="triangle"
              size={36}
              color={DS.colors.accent}
              style={{ position: "absolute", top: 60, right: 60 }}
            />
            <DecoShape
              shape="square"
              size={28}
              color={DS.colors.primary}
              style={{ position: "absolute", bottom: 24, left: 20 }}
            />
          </>
        )}

        {/* Animated icon */}
        <div
          style={{
            width: mob ? 60 : 76,
            height: mob ? 60 : 76,
            borderRadius: "50%",
            background: `linear-gradient(135deg,${DS.colors.primary},${DS.colors.purple})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            animation: "float 3s ease-in-out infinite",
            boxShadow: `0 8px 28px ${DS.colors.primary}30`,
          }}
        >
          <BookOpen size={mob ? 26 : 34} color={DS.colors.white} />
        </div>

        <h2
          style={{
            fontSize: mob ? 18 : 22,
            fontWeight: 700,
            color: DS.colors.gray900,
            margin: "0 0 6px",
            fontFamily: DS.font,
          }}
        >
          Chapter Summary Quiz
        </h2>

        <p
          style={{
            fontSize: mob ? 12 : 14,
            color: DS.colors.gray500,
            margin: "0 0 20px",
            lineHeight: 1.6,
            fontFamily: DS.font,
            maxWidth: 480,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Test your understanding of{" "}
          <strong style={{ color: DS.colors.primary }}>
            Finding the Unknown
          </strong>{" "}
          — equations, balance, inverse operations, transposition, word problems
          & history.
        </p>

        {/* Concept Tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap" as const,
            gap: 6,
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          {[
            "Balance Principle",
            "Equations",
            "Trial & Error",
            "Inverse Ops",
            "Transposition",
            "Word Problems",
            "History",
            "Magic Tricks",
          ].map((t, i) => {
            const cols = [
              DS.colors.primary,
              DS.colors.purple,
              DS.colors.accent,
              DS.colors.success,
              "#D946EF",
              "#0891B2",
              DS.colors.purple,
              DS.colors.accent,
            ];
            return (
              <span
                key={t}
                style={{
                  padding: mob ? "3px 7px" : "4px 10px",
                  borderRadius: DS.radius.full,
                  fontSize: mob ? 9 : 11,
                  fontWeight: 600,
                  background: `${cols[i]}10`,
                  color: cols[i],
                  fontFamily: DS.font,
                  animation: `popIn .35s ease-out ${i * 0.05}s both`,
                }}
              >
                {t}
              </span>
            );
          })}
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: mob ? 6 : 12,
            marginBottom: 20,
          }}
        >
          {[
            {
              icon: <Target size={mob ? 14 : 17} />,
              label: `${qs.length} Questions`,
              c: DS.colors.primary,
            },
            {
              icon: <Zap size={mob ? 14 : 17} />,
              label: "Mixed Level",
              c: DS.colors.accent,
            },
            {
              icon: <Trophy size={mob ? 14 : 17} />,
              label: `Pass: ${passingScore}%`,
              c: DS.colors.success,
            },
          ].map((it, i) => (
            <div
              key={i}
              style={{
                padding: mob ? "8px 4px" : "12px 10px",
                borderRadius: DS.radius.md,
                background: `${it.c}06`,
                border: `1px solid ${it.c}18`,
                animation: `fadeInUp .45s ease-out ${0.15 + i * 0.08}s both`,
              }}
            >
              <div
                style={{
                  color: it.c,
                  marginBottom: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {it.icon}
              </div>
              <div
                style={{
                  fontSize: mob ? 9 : 12,
                  fontWeight: 600,
                  color: DS.colors.gray700,
                  fontFamily: DS.font,
                }}
              >
                {it.label}
              </div>
            </div>
          ))}
        </div>

        {/* Teaching Notes */}
        <div
          style={{
            background: DS.colors.purpleBg,
            borderRadius: DS.radius.md,
            padding: mob ? "10px 12px" : "14px 18px",
            marginBottom: 10,
            textAlign: "left" as const,
            border: `1px solid ${DS.colors.purpleLight}60`,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: DS.colors.purple,
              textTransform: "uppercase" as const,
              letterSpacing: ".6px",
              marginBottom: 2,
              fontFamily: DS.font,
            }}
          >
            📝 Teaching Notes
          </div>
          <div
            style={{
              fontSize: mob ? 11 : 13,
              color: DS.colors.gray700,
              lineHeight: 1.5,
              fontFamily: DS.font,
            }}
          >
            {teachingNotes}
          </div>
        </div>

        {/* Student Instructions */}
        <div
          style={{
            background: DS.colors.orangeBg,
            borderRadius: DS.radius.md,
            padding: mob ? "10px 12px" : "14px 18px",
            marginBottom: 22,
            textAlign: "left" as const,
            border: `1px solid ${DS.colors.orangeLight}`,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: DS.colors.accent,
              textTransform: "uppercase" as const,
              letterSpacing: ".6px",
              marginBottom: 2,
              fontFamily: DS.font,
            }}
          >
            📖 Instructions for Student
          </div>
          <div
            style={{
              fontSize: mob ? 11 : 13,
              color: DS.colors.gray700,
              lineHeight: 1.5,
              fontFamily: DS.font,
            }}
          >
            {studentInstructions}
          </div>
        </div>

        <SBtn
          color="primary"
          onClick={() => {
            setScreen("quiz");
            setAk((p) => p + 1);
          }}
          compact={mob}
          style={{ animation: "pulse 2.5s ease-in-out infinite" }}
        >
          Start Quiz <ChevronRight size={16} />
        </SBtn>
      </div>
    </div>
  );

  // ==================== QUIZ SCREEN ====================

  const quizView = () => {
    const isCorrectAnswer = selAns === q.correctAnswer;

    return (
      <div style={{ padding: pad, position: "relative" as const }} key={ak}>
        {/* Confetti particles */}
        {parts.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute" as const,
              top: `${p.y}%`,
              left: `${p.x}%`,
              width: 7,
              height: 7,
              borderRadius: 2,
              background: p.color,
              animation: "confetti 1s ease-out forwards",
              zIndex: 10,
              pointerEvents: "none" as const,
            }}
          />
        ))}

        {/* Top bar: question counter + score */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
            flexWrap: "wrap" as const,
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: mob ? 12 : 13,
              fontWeight: 600,
              color: DS.colors.gray500,
              fontFamily: DS.font,
            }}
          >
            Question {curQ + 1}/{qs.length}
          </span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {streak >= 2 && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: DS.colors.accent,
                  animation: "bounce .6s ease-in-out infinite",
                  fontFamily: DS.font,
                }}
              >
                🔥 {streak}
              </span>
            )}
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: DS.colors.success,
                background: DS.colors.successBg,
                padding: "2px 10px",
                borderRadius: DS.radius.full,
                fontFamily: DS.font,
              }}
            >
              {score}/{curQ + (answered ? 1 : 0)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: 5,
            background: DS.colors.gray200,
            borderRadius: DS.radius.full,
            overflow: "hidden" as const,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              height: "100%",
              background: `linear-gradient(90deg,${DS.colors.primary},${DS.colors.purple})`,
              borderRadius: DS.radius.full,
              transition: "width .5s cubic-bezier(.4,0,.2,1)",
              width: `${((curQ + (answered ? 1 : 0)) / qs.length) * 100}%`,
            }}
          />
        </div>

        {/* Step dots */}
        <div
          style={{
            display: "flex",
            gap: mob ? 4 : 6,
            marginBottom: 14,
            justifyContent: "center",
            flexWrap: "wrap" as const,
          }}
        >
          {qs.map((_, i) => {
            const wasAnswered = answers[i] !== null;
            const wasCorrect =
              wasAnswered && answers[i] === qs[i].correctAnswer;
            const isCurrent = i === curQ;
            return (
              <div
                key={i}
                style={{
                  width: mob ? 20 : 24,
                  height: mob ? 20 : 24,
                  borderRadius: DS.radius.full,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: mob ? 9 : 10,
                  fontWeight: 700,
                  fontFamily: DS.font,
                  background: wasAnswered
                    ? wasCorrect
                      ? DS.colors.success
                      : DS.colors.error
                    : isCurrent
                      ? DS.colors.primary
                      : DS.colors.gray200,
                  color:
                    wasAnswered || isCurrent
                      ? DS.colors.white
                      : DS.colors.gray400,
                  transition: "all .3s ease",
                  transform: isCurrent ? "scale(1.15)" : "scale(1)",
                  boxShadow: isCurrent
                    ? `0 0 0 3px ${DS.colors.primary}25`
                    : "none",
                }}
              >
                {wasAnswered ? (wasCorrect ? "✓" : "✗") : i + 1}
              </div>
            );
          })}
        </div>

        {/* Concept + Difficulty tags */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 12,
            flexWrap: "wrap" as const,
            animation: "fadeInDown .35s ease-out",
          }}
        >
          <span
            style={{
              padding: "3px 10px",
              borderRadius: DS.radius.full,
              fontSize: 10,
              fontWeight: 700,
              fontFamily: DS.font,
              background: `${cMap[q.concept] || DS.colors.gray500}12`,
              color: cMap[q.concept] || DS.colors.gray500,
              textTransform: "uppercase" as const,
              letterSpacing: ".3px",
            }}
          >
            {q.concept}
          </span>
          <span
            style={{
              padding: "3px 10px",
              borderRadius: DS.radius.full,
              fontSize: 10,
              fontWeight: 700,
              fontFamily: DS.font,
              background: `${dMap[q.difficulty]}12`,
              color: dMap[q.difficulty],
              textTransform: "uppercase" as const,
              letterSpacing: ".3px",
            }}
          >
            {q.difficulty}
          </span>
        </div>

        {/* Question Card */}
        <div
          style={{
            background: DS.colors.white,
            borderRadius: DS.radius.lg,
            padding: mob ? "16px 14px" : "22px 26px",
            boxShadow: "0 2px 16px rgba(74,77,201,.05)",
            border: `1px solid ${DS.colors.gray200}`,
            marginBottom: 14,
            animation: "fadeInUp .4s ease-out",
          }}
        >
          <p
            style={{
              fontSize: mob ? 14 : 16,
              fontWeight: 600,
              color: DS.colors.gray900,
              lineHeight: 1.65,
              margin: 0,
              fontFamily: DS.font,
            }}
          >
            {q.question}
          </p>
        </div>

        {/* Options */}
        <div
          style={{
            display: "flex",
            flexDirection: "column" as const,
            gap: mob ? 8 : 10,
            marginBottom: 16,
          }}
        >
          {q.options.map((opt, idx) => {
            const isSel = selAns === idx;
            const isCor = idx === q.correctAnswer;
            const isHov = hov === idx;
            const labels = ["A", "B", "C", "D"];

            let borderCol = DS.colors.gray200;
            let bgCol = DS.colors.white;
            let labelBg = DS.colors.gray100;
            let labelCol = DS.colors.gray500;
            let animStr = "";

            if (answered) {
              if (isCor) {
                borderCol = DS.colors.success;
                bgCol = DS.colors.successBg;
                labelBg = DS.colors.success;
                labelCol = DS.colors.white;
                animStr = isSel ? "correctPulse .5s ease-out" : "";
              } else if (isSel && !isCor) {
                borderCol = DS.colors.error;
                bgCol = DS.colors.errorBg;
                labelBg = DS.colors.error;
                labelCol = DS.colors.white;
                animStr = "wrongShake .45s ease-out";
              } else {
                bgCol = DS.colors.gray100;
                labelBg = DS.colors.gray200;
                labelCol = DS.colors.gray400;
              }
            } else if (isSel) {
              borderCol = DS.colors.primary;
              bgCol = DS.colors.purpleBg;
              labelBg = DS.colors.primary;
              labelCol = DS.colors.white;
            } else if (isHov) {
              borderCol = DS.colors.purpleLight;
              bgCol = "#FAFAFF";
            }

            return (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                onMouseEnter={() => !answered && setHov(idx)}
                onMouseLeave={() => setHov(null)}
                style={{
                  width: "100%",
                  textAlign: "left" as const,
                  padding: mob ? "12px 12px" : "14px 20px",
                  borderRadius: DS.radius.md,
                  border: `2px solid ${borderCol}`,
                  background: bgCol,
                  cursor: answered ? "default" : "pointer",
                  fontSize: mob ? 13 : 14,
                  lineHeight: 1.55,
                  color: DS.colors.gray700,
                  transition: "all .25s cubic-bezier(.4,0,.2,1)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: mob ? 10 : 12,
                  fontFamily: DS.font,
                  position: "relative" as const,
                  overflow: "hidden" as const,
                  animation:
                    animStr || `slideInLeft .35s ease-out ${idx * 0.06}s both`,
                  transform:
                    isHov && !answered ? "translateX(3px)" : "translateX(0)",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <span
                  style={{
                    width: mob ? 24 : 28,
                    height: mob ? 24 : 28,
                    minWidth: mob ? 24 : 28,
                    borderRadius: DS.radius.sm,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: mob ? 11 : 12,
                    background: labelBg,
                    color: labelCol,
                    transition: "all .25s ease",
                    marginTop: 1,
                    flexShrink: 0,
                    fontFamily: DS.font,
                  }}
                >
                  {answered && isCor ? (
                    <Check size={13} />
                  ) : answered && isSel && !isCor ? (
                    <X size={13} />
                  ) : (
                    labels[idx]
                  )}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontWeight: isSel && !answered ? 600 : 400,
                    fontFamily: DS.font,
                  }}
                >
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExp && answered && (
          <div
            style={{
              background: DS.colors.purpleBg,
              borderRadius: DS.radius.md,
              padding: mob ? "12px 14px" : "18px 22px",
              marginBottom: 14,
              borderLeft: `4px solid ${DS.colors.primary}`,
              animation: "fadeInUp .45s ease-out",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: DS.colors.primary,
                marginBottom: 4,
                textTransform: "uppercase" as const,
                letterSpacing: ".5px",
                fontFamily: DS.font,
              }}
            >
              💡 Explanation
            </div>
            <p
              style={{
                fontSize: mob ? 12 : 13,
                color: DS.colors.gray700,
                lineHeight: 1.7,
                margin: 0,
                fontFamily: DS.font,
              }}
            >
              {q.explanation}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            flexWrap: "wrap" as const,
          }}
        >
          {!answered ? (
            <SBtn
              color="accent"
              disabled={selAns === null}
              onClick={onConfirm}
              compact={mob}
            >
              Check Answer
            </SBtn>
          ) : (
            <SBtn color="primary" onClick={onNext} compact={mob}>
              {curQ < qs.length - 1 ? "Next Question" : "See Results"}
              <ChevronRight size={15} />
            </SBtn>
          )}
        </div>
      </div>
    );
  };

  // ==================== RESULTS SCREEN ====================

  const resultView = () => {
    const emoji = pct >= 90 ? "🏆" : pct >= 70 ? "🌟" : pct >= 50 ? "👍" : "💪";
    const msg =
      pct >= 90
        ? "Outstanding! You mastered this chapter!"
        : pct >= 70
          ? "Great job! Solid understanding."
          : pct >= 50
            ? "Good effort! Review what you missed."
            : "Keep practicing! Revisit the chapter.";
    const cc = pass ? DS.colors.success : DS.colors.accent;

    return (
      <div style={{ padding: pad }}>
        <div
          style={{
            background: DS.colors.white,
            borderRadius: DS.radius.xl,
            padding: mob ? "24px 16px" : "36px 32px",
            boxShadow: "0 4px 24px rgba(74,77,201,.06)",
            border: `1px solid ${DS.colors.gray200}`,
            textAlign: "center" as const,
            animation: "fadeInScale .5s ease-out",
            position: "relative" as const,
            overflow: "hidden" as const,
          }}
        >
          {/* Decorative */}
          {!mob && (
            <>
              <DecoShape
                shape="circle"
                size={36}
                color={DS.colors.primary}
                filled
                style={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  opacity: 0.15,
                }}
              />
              <DecoShape
                shape="triangle"
                size={30}
                color={DS.colors.accent}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 40,
                  opacity: 0.2,
                }}
              />
            </>
          )}

          <div
            style={{
              fontSize: mob ? 40 : 48,
              marginBottom: 10,
              animation: "starSpin .7s ease-out",
            }}
          >
            {emoji}
          </div>

          {/* Score Circle */}
          <div
            style={{
              width: mob ? 110 : 140,
              height: mob ? 110 : 140,
              borderRadius: "50%",
              background: `conic-gradient(${cc} ${pct * 3.6}deg, ${DS.colors.gray200} ${pct * 3.6}deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              animation: "glowPulse 2s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: mob ? 90 : 116,
                height: mob ? 90 : 116,
                borderRadius: "50%",
                background: DS.colors.white,
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: mob ? 28 : 36,
                  fontWeight: 800,
                  color: cc,
                  fontFamily: DS.font,
                }}
              >
                {pct}%
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: DS.colors.gray500,
                  fontWeight: 600,
                  fontFamily: DS.font,
                }}
              >
                {score}/{qs.length}
              </div>
            </div>
          </div>

          <h3
            style={{
              fontSize: mob ? 18 : 20,
              fontWeight: 700,
              color: DS.colors.gray900,
              margin: "0 0 6px",
              fontFamily: DS.font,
            }}
          >
            {pass ? "Quiz Passed!" : "Keep Going!"}
          </h3>
          <p
            style={{
              fontSize: mob ? 12 : 14,
              color: DS.colors.gray500,
              margin: "0 0 20px",
              lineHeight: 1.5,
              fontFamily: DS.font,
            }}
          >
            {msg}
          </p>

          {maxStreak >= 2 && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: DS.colors.orangeLight,
                padding: "6px 14px",
                borderRadius: DS.radius.full,
                marginBottom: 16,
                fontSize: 12,
                fontWeight: 600,
                color: DS.colors.accent,
                fontFamily: DS.font,
                animation: "bounce 1s ease-in-out infinite",
              }}
            >
              🔥 Best Streak: {maxStreak}
            </div>
          )}

          {/* Concept Breakdown */}
          <div
            style={{
              background: DS.colors.gray100,
              borderRadius: DS.radius.lg,
              padding: mob ? "14px 12px" : "20px",
              marginBottom: 20,
              textAlign: "left" as const,
            }}
          >
            <h4
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: DS.colors.gray500,
                margin: "0 0 10px",
                textTransform: "uppercase" as const,
                letterSpacing: ".5px",
                fontFamily: DS.font,
              }}
            >
              Concept Breakdown
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column" as const,
                gap: 6,
              }}
            >
              {qs.map((qItem, i) => {
                const userAns = answers[i];
                const isOk = userAns === qItem.correctAnswer;
                return (
                  <div
                    key={qItem.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: mob ? 8 : 10,
                      padding: mob ? "6px 8px" : "8px 12px",
                      borderRadius: DS.radius.sm,
                      background: isOk
                        ? DS.colors.successBg
                        : DS.colors.errorBg,
                      animation: `slideInRight .35s ease-out ${i * 0.06}s both`,
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isOk ? DS.colors.success : DS.colors.error,
                        color: DS.colors.white,
                        flexShrink: 0,
                      }}
                    >
                      {isOk ? <Check size={11} /> : <X size={11} />}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: mob ? 11 : 12,
                        color: DS.colors.gray700,
                        fontWeight: 500,
                        fontFamily: DS.font,
                      }}
                    >
                      Q{i + 1}: {qItem.concept}
                    </span>
                    <span
                      style={{
                        padding: "2px 7px",
                        borderRadius: DS.radius.full,
                        fontSize: 9,
                        fontWeight: 700,
                        fontFamily: DS.font,
                        background: `${dMap[qItem.difficulty]}12`,
                        color: dMap[qItem.difficulty],
                        textTransform: "uppercase" as const,
                      }}
                    >
                      {qItem.difficulty}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <SBtn color="primary" onClick={onRestart} compact={mob}>
            <RotateCcw size={14} />
            Try Again
          </SBtn>
        </div>
      </div>
    );
  };

  // ==================== MAIN RENDER ====================

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 860,
        margin: "0 auto",
        fontFamily: DS.font,
        background: `linear-gradient(160deg,${DS.colors.purpleBg} 0%,#F8F7FF 40%,${DS.colors.orangeBg} 100%)`,
        borderRadius: mob ? DS.radius.lg : DS.radius.xxl,
        overflow: "hidden",
        boxShadow: `0 20px 50px -12px ${DS.colors.primary}15, 0 0 0 1px ${DS.colors.gray200}`,
        position: "relative",
        minHeight: mob ? 380 : 500,
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{
          background: `linear-gradient(135deg,${DS.colors.primary} 0%,${DS.colors.purple} 60%,${DS.colors.primaryDark} 100%)`,
          padding: mob ? "16px 14px" : tab ? "18px 24px" : "22px 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header decorations */}
        <DecoShape
          shape="circle"
          size={mob ? 50 : 80}
          color="rgba(255,255,255,.08)"
          filled
          style={{ position: "absolute", top: -15, right: -10 }}
        />
        {!mob && (
          <DecoShape
            shape="square"
            size={24}
            color="rgba(255,255,255,.05)"
            filled
            style={{ position: "absolute", top: 10, left: "40%" }}
          />
        )}
        {/* Accent stripe */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: mob ? 4 : 6,
            background: `linear-gradient(180deg,${DS.colors.accent},${DS.colors.orange})`,
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
            flexWrap: "wrap" as const,
            gap: 6,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontSize: mob ? 16 : tab ? 19 : 22,
                fontWeight: 700,
                color: DS.colors.white,
                margin: 0,
                fontFamily: DS.font,
                letterSpacing: "-.3px",
                textShadow: "0 1px 3px rgba(0,0,0,.12)",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: mob ? 10 : 13,
                color: "rgba(255,255,255,.8)",
                margin: "2px 0 0",
                fontWeight: 500,
                fontFamily: DS.font,
              }}
            >
              {subtitle}
            </p>
          </div>

          {screen === "quiz" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "rgba(255,255,255,.15)",
                padding: mob ? "3px 8px" : "5px 14px",
                borderRadius: DS.radius.full,
                flexShrink: 0,
              }}
            >
              <Star
                size={mob ? 11 : 14}
                color={DS.colors.orangeLight}
                fill={DS.colors.orange}
              />
              <span
                style={{
                  fontSize: mob ? 11 : 13,
                  fontWeight: 700,
                  color: DS.colors.white,
                  fontFamily: DS.font,
                }}
              >
                {score} pts
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      {screen === "intro" && introView()}
      {screen === "quiz" && quizView()}
      {screen === "result" && resultView()}
    </div>
  );
};

export default ChapterSummaryQuiz;
