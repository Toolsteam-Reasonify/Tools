import React, { useEffect, useMemo, useState, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM - FROM PDF SPECIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════

const DESIGN_SYSTEM = {
  colors: {
    primary: {
      main: '#4A4DC9',
      light: '#C1C1EA',
      dark: '#533086'
    },
    secondary: {
      main: '#FF7212',
      light: '#FFF3E4',
      dark: '#FC9145'
    },
    neutral: {
      dark: '#4E4E4E',
      medium: '#CACACA',
      light: '#EBEBEB',
      lightest: '#F5F5F5'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #533086 0%, #FC9145 100%)',
      secondary: 'linear-gradient(135deg, #4A4DC9 0%, #FF7212 100%)',
      light: 'linear-gradient(135deg, #C1C1EA 0%, #FFF3E4 100%)'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px'
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '20px',
    pill: '100px'
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type Mode = 'learn' | 'practice' | 'realworld';

interface Pattern {
  id: number;
  multiplicand: number;
  sequence: Array<{ multiplier: number; product: number }>;
  description: string;
}

interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface RealWorldExample {
  id: number;
  title: string;
  scenario: string;
  problem: string;
  solution: string;
  calculation: string;
  application: string;
  icon: string;
}

export interface IntegerMultiplicationPatternsProps {
  initialMode?: Mode;
  modeControls?: {
    visible?: boolean;
    enabledModes?: Mode[];
    allowSwitch?: boolean;
    labels?: Partial<Record<Mode, string>>;
  };
  onModeChange?: (mode: Mode) => void;
  additionalProps?: {
    title?: string;
    learnHeader?: {
      title?: string;
      subtitle?: string;
    };
    patterns?: Pattern[];
    mcqQuestions?: MCQQuestion[];
    realWorldExamples?: RealWorldExample[];
  };
  agentConfig?: {
    state?: Partial<{
      currentMode: Mode;
      activePattern: number;
      revealedRows: number;
      selectedMultiplicand: number;
      customMultiplier: string;
      currentQuestion: number;
      selectedAnswer: number | null;
      showExplanation: boolean;
      score: number;
      currentExample: number;
    }>;
    onStateChange?: (next: any) => void;
    timings?: Partial<{
      autoRevealRowEveryMs: number;
    }>;
    features?: Partial<{
      enableAutoReveal: boolean;
      enablePracticeScoring: boolean;
    }>;
    onEvent?: (event: { type: string; payload?: any }) => void;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// LOAD POPPINS FONT
// ═══════════════════════════════════════════════════════════════════════════

const loadPoppinsFont = () => {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    if (!document.querySelector(`link[href="${link.href}"]`)) {
      document.head.appendChild(link);
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_ENABLED_MODES: Mode[] = ['learn', 'practice', 'realworld'];

function useControllableState<T>(opts: {
  value: T | undefined;
  defaultValue: T;
  onChange?: (v: T) => void;
}) {
  const { value, defaultValue, onChange } = opts;
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const state = isControlled ? (value as T) : internal;
  const setState = (next: T | ((prev: T) => T)) => {
    const resolved = typeof next === 'function' ? (next as (p: T) => T)(state) : next;
    if (!isControlled) setInternal(resolved);
    onChange?.(resolved);
  };
  return [state, setState] as const;
}

function clampModes(modes: Mode[] | undefined): Mode[] {
  if (!modes || modes.length === 0) return DEFAULT_ENABLED_MODES;
  const seen = new Set<Mode>();
  return modes.filter((m) => (seen.has(m) ? false : (seen.add(m), true)));
}

function pickInitialMode(initialMode: Mode | undefined, enabled: Mode[]): Mode {
  if (initialMode && enabled.indexOf(initialMode) !== -1) return initialMode;
  return enabled[0] ?? 'learn';
}

function useRafLoop(enabled: boolean, onFrame: (t: number) => void) {
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  useEffect(() => {
    if (!enabled) return;
    let rafId = 0;
    const tick = (t: number) => {
      onFrameRef.current(t);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [enabled]);
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const IntegerMultiplicationPatterns: React.FC<IntegerMultiplicationPatternsProps> = ({
  initialMode,
  modeControls,
  onModeChange,
  additionalProps,
  agentConfig,
}) => {
  // Load Poppins font
  useEffect(() => {
    loadPoppinsFont();
  }, []);

  // Responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Mode management
  const enabledModes = useMemo(() => clampModes(modeControls?.enabledModes), [modeControls?.enabledModes]);
  const [currentMode, setCurrentMode] = useControllableState<Mode>({
    value: agentConfig?.state?.currentMode,
    defaultValue: pickInitialMode(initialMode, enabledModes),
    onChange: (m) => {
      onModeChange?.(m);
      agentConfig?.onEvent?.({ type: 'mode_change', payload: { mode: m } });
    },
  });
  
  // Learn mode states
  const [activePattern, setActivePattern] = useControllableState<number>({
    value: agentConfig?.state?.activePattern,
    defaultValue: 0,
    onChange: (v) => agentConfig?.onEvent?.({ type: 'learn_pattern_change', payload: { activePattern: v } }),
  });
  const [revealedRows, setRevealedRows] = useControllableState<number>({
    value: agentConfig?.state?.revealedRows,
    defaultValue: 1,
    onChange: (v) => agentConfig?.onEvent?.({ type: 'learn_reveal_rows', payload: { revealedRows: v } }),
  });
  const [isAutoRevealing, setIsAutoRevealing] = useState(false);
  const [selectedMultiplicand, setSelectedMultiplicand] = useControllableState<number>({
    value: agentConfig?.state?.selectedMultiplicand,
    defaultValue: 3,
  });
  const [customMultiplier, setCustomMultiplier] = useControllableState<string>({
    value: agentConfig?.state?.customMultiplier,
    defaultValue: '',
  });
  const [customResult, setCustomResult] = useState<number | null>(null);
  
  // Practice mode states
  const [currentQuestion, setCurrentQuestion] = useControllableState<number>({
    value: agentConfig?.state?.currentQuestion,
    defaultValue: 0,
  });
  const [selectedAnswer, setSelectedAnswer] = useControllableState<number | null>({
    value: agentConfig?.state?.selectedAnswer,
    defaultValue: null,
  });
  const [showExplanation, setShowExplanation] = useControllableState<boolean>({
    value: agentConfig?.state?.showExplanation,
    defaultValue: false,
  });
  const [score, setScore] = useControllableState<number>({
    value: agentConfig?.state?.score,
    defaultValue: 0,
  });
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  
  // Real World mode states
  const [currentExample, setCurrentExample] = useControllableState<number>({
    value: agentConfig?.state?.currentExample,
    defaultValue: 0,
  });

  // Default data
  const patterns: Pattern[] = additionalProps?.patterns ?? [
    {
      id: 1,
      multiplicand: 3,
      sequence: [
        { multiplier: 4, product: 12 },
        { multiplier: 3, product: 9 },
        { multiplier: 2, product: 6 },
        { multiplier: 1, product: 3 },
        { multiplier: 0, product: 0 },
        { multiplier: -1, product: -3 },
        { multiplier: -2, product: -6 },
        { multiplier: -3, product: -9 },
      ],
      description: 'Positive multiplicand: Product decreases by 3 for each unit decrease in multiplier'
    },
    {
      id: 2,
      multiplicand: -3,
      sequence: [
        { multiplier: 4, product: -12 },
        { multiplier: 3, product: -9 },
        { multiplier: 2, product: -6 },
        { multiplier: 1, product: -3 },
        { multiplier: 0, product: 0 },
        { multiplier: -1, product: 3 },
        { multiplier: -2, product: 6 },
        { multiplier: -3, product: 9 },
      ],
      description: 'Negative multiplicand: Product increases by 3 for each unit decrease in multiplier'
    }
  ];

  const mcqQuestions: MCQQuestion[] = additionalProps?.mcqQuestions ?? [
    {
      id: 1,
      question: "What is the product of (-4) × 3?",
      options: ["-12", "12", "-7", "7"],
      correctAnswer: 0,
      explanation: "When multiplying a negative number by a positive number, the product is negative. (-4) × 3 = -12"
    },
    {
      id: 2,
      question: "What is the result of (-6) × (-5)?",
      options: ["-30", "30", "-11", "11"],
      correctAnswer: 1,
      explanation: "When both the multiplier and multiplicand are negative, the product is positive. (-6) × (-5) = 30"
    },
    {
      id: 3,
      question: "In the pattern 3 × 4 = 12, 2 × 4 = 8, 1 × 4 = 4, 0 × 4 = 0, what comes next?",
      options: ["(-1) × 4 = -4", "(-1) × 4 = 4", "(-1) × 4 = -1", "(-1) × 4 = 1"],
      correctAnswer: 0,
      explanation: "The product decreases by 4 each time. Following the pattern: 0 - 4 = -4. So (-1) × 4 = -4"
    },
    {
      id: 4,
      question: "If 5 × (-3) = -15, what is (-5) × (-3)?",
      options: ["-15", "15", "-8", "8"],
      correctAnswer: 1,
      explanation: "When the multiplicand is negative and we change the multiplier from positive to negative, the product becomes positive. (-5) × (-3) = 15"
    },
    {
      id: 5,
      question: "What happens to the product when the multiplier decreases by 1 in the sequence where multiplicand is -4?",
      options: [
        "Product decreases by 4",
        "Product increases by 4",
        "Product decreases by 1",
        "Product stays the same"
      ],
      correctAnswer: 1,
      explanation: "When the multiplicand is negative (-4), the product increases by the absolute value of the multiplicand (4) as the multiplier decreases by 1. This is the inverse pattern compared to positive multiplicands."
    }
  ];

  const realWorldExamples: RealWorldExample[] = additionalProps?.realWorldExamples ?? [
    {
      id: 1,
      title: "Temperature Changes",
      scenario: "A freezing laboratory needs to lower its temperature by 5°C every hour for preservation purposes.",
      problem: "If the lab starts at 15°C and the temperature drops by 5°C per hour, what will the temperature be after 4 hours?",
      solution: "We can model this as: Initial temperature + (Number of hours × Temperature change per hour)",
      calculation: "15 + (4 × (-5)) = 15 + (-20) = -5°C",
      application: "The laboratory will reach -5°C after 4 hours. This shows how multiplying positive time by negative temperature change gives us the total drop.",
      icon: "🌡️"
    },
    {
      id: 2,
      title: "Financial Transactions - Debt Payments",
      scenario: "Ravi owes ₹300 to each of his 5 friends. We represent debts as negative numbers.",
      problem: "What is Ravi's total debt situation?",
      solution: "We model each debt as -300 and multiply by the number of friends.",
      calculation: "5 × (-300) = -1500",
      application: "Ravi has a total debt of ₹1,500. Positive number of friends multiplied by negative debt (per friend) gives total negative financial position.",
      icon: "💰"
    },
    {
      id: 3,
      title: "Elevator in Mining Shaft",
      scenario: "A mining elevator descends at 3 meters per minute. Downward movement is represented as negative.",
      problem: "If the elevator moves down for 8 minutes, what is its position relative to ground level (0 meters)?",
      solution: "Time (positive) × Speed with direction (negative) = Total displacement",
      calculation: "8 × (-3) = -24 meters",
      application: "The elevator is 24 meters below ground level. This shows how positive time multiplied by negative speed (downward) gives negative position (below ground).",
      icon: "🏔️"
    },
    {
      id: 4,
      title: "Reversing Video Playback",
      scenario: "A video player is in rewind mode, going backward at 2× speed. We represent backward as negative.",
      problem: "If you rewind for 6 seconds, how much video time do you go back?",
      solution: "Duration × (Rewind speed as negative) = Total time change",
      calculation: "6 × (-2) = -12 seconds",
      application: "You've gone back 12 seconds in the video. Positive duration times negative speed gives negative time displacement (going backward in time).",
      icon: "📹"
    },
    {
      id: 5,
      title: "Removing Penalties (Double Negative)",
      scenario: "In a game, you had 4 penalties of -5 points each. The referee removes all penalties.",
      problem: "What is the net change to your score when penalties are removed?",
      solution: "Removing (negative operation) a penalty (negative value) gives a positive result.",
      calculation: "(-1) × 4 × (-5) = 4 × 5 = +20 points",
      application: "Removing negative items creates a positive effect. This is why (-) × (-) = (+). You gain 20 points by having penalties removed!",
      icon: "🎮"
    }
  ];

  const currentPattern = patterns[activePattern];

  // Agent config
  const autoRevealEveryMs = agentConfig?.timings?.autoRevealRowEveryMs ?? 400;
  const autoRevealEnabled = agentConfig?.features?.enableAutoReveal ?? true;
  const scoringEnabled = agentConfig?.features?.enablePracticeScoring ?? true;

  // Auto-reveal animation
  const rafStateRef = useRef<{ lastT: number; acc: number }>({ lastT: 0, acc: 0 });
  useRafLoop(isAutoRevealing && autoRevealEnabled, (t) => {
    const s = rafStateRef.current;
    if (!s.lastT) s.lastT = t;
    const dt = t - s.lastT;
    s.lastT = t;
    s.acc += dt;

    if (s.acc >= autoRevealEveryMs) {
      s.acc = s.acc % autoRevealEveryMs;
      setRevealedRows((prev) => {
        const next = Math.min(prev + 1, currentPattern.sequence.length);
        if (next >= currentPattern.sequence.length) {
          setIsAutoRevealing(false);
        }
        return next;
      });
    }
  });

  // Handlers
  const handleRevealNext = () => {
    if (revealedRows < currentPattern.sequence.length) {
      setRevealedRows(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setRevealedRows(1);
    setIsAutoRevealing(false);
    rafStateRef.current = { lastT: 0, acc: 0 };
  };

  const handleAutoReveal = () => {
    handleReset();
    if (!autoRevealEnabled) return;
    setIsAutoRevealing(true);
  };

  const switchPattern = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setActivePattern((prev) => (prev + 1) % patterns.length);
    } else {
      setActivePattern((prev) => (prev - 1 + patterns.length) % patterns.length);
    }
    handleReset();
  };

  const getDifference = (index: number) => {
    if (index === 0) return null;
    const diff = currentPattern.sequence[index].product - currentPattern.sequence[index - 1].product;
    return diff > 0 ? `+${diff}` : `${diff}`;
  };

  const handleCustomCalculation = () => {
    const multiplier = parseInt(customMultiplier);
    if (!isNaN(multiplier)) {
      setCustomResult(selectedMultiplicand * multiplier);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowExplanation(true);
    
    if (selectedAnswer === mcqQuestions[currentQuestion].correctAnswer) {
      if (scoringEnabled && !answeredQuestions.has(currentQuestion)) {
        setScore(prev => prev + 1);
        setAnsweredQuestions(prev => new Set(prev).add(currentQuestion));
      }
    }

    agentConfig?.onEvent?.({
      type: 'practice_submit',
      payload: {
        questionIndex: currentQuestion,
        selectedAnswer,
        correctAnswer: mcqQuestions[currentQuestion].correctAnswer,
        isCorrect: selectedAnswer === mcqQuestions[currentQuestion].correctAnswer,
        score,
      },
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < mcqQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const resetPractice = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  const handleNextExample = () => {
    if (currentExample < realWorldExamples.length - 1) {
      setCurrentExample(prev => prev + 1);
    }
  };

  const handlePrevExample = () => {
    if (currentExample > 0) {
      setCurrentExample(prev => prev - 1);
    }
  };

  const handleModeChange = (mode: Mode) => {
    if (enabledModes.indexOf(mode) === -1) return;
    setCurrentMode(mode);
  };

  // Agent sync
  useEffect(() => {
    agentConfig?.onStateChange?.({
      currentMode,
      activePattern,
      revealedRows,
      selectedMultiplicand,
      customMultiplier,
      currentQuestion,
      selectedAnswer,
      showExplanation,
      score,
      currentExample,
      isAutoRevealing,
    });
  }, [
    agentConfig,
    currentMode,
    activePattern,
    revealedRows,
    selectedMultiplicand,
    customMultiplier,
    currentQuestion,
    selectedAnswer,
    showExplanation,
    score,
    currentExample,
    isAutoRevealing,
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // STYLES
  // ═══════════════════════════════════════════════════════════════════════════

  const containerStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: DESIGN_SYSTEM.colors.neutral.lightest,
    fontFamily: DESIGN_SYSTEM.typography.fontFamily,
    position: 'relative',
  };

  const headerStyle: React.CSSProperties = {
    background: '#ffffff',
    borderBottom: `2px solid ${DESIGN_SYSTEM.colors.neutral.light}`,
    padding: isMobile ? '16px' : (isTablet ? '20px 24px' : '24px 32px'),
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  };

  const headerInnerStyle: React.CSSProperties = {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: isMobile ? '12px' : '20px',
    flexWrap: isMobile ? 'wrap' : 'nowrap',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? '20px' : (isTablet ? '24px' : '28px'),
    fontWeight: DESIGN_SYSTEM.typography.weights.bold,
    background: DESIGN_SYSTEM.colors.gradients.secondary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
    lineHeight: 1.2,
  };

  const tabsStyle: React.CSSProperties = {
    display: 'flex',
    gap: isMobile ? '6px' : (isTablet ? '8px' : '12px'),
    flexWrap: 'wrap',
  };

  const tabButtonStyle = (active: boolean, disabled: boolean): React.CSSProperties => ({
    padding: isMobile ? '10px 16px' : (isTablet ? '11px 20px' : '12px 24px'),
    borderRadius: DESIGN_SYSTEM.borderRadius.pill,
    border: active ? 'none' : `2px solid ${DESIGN_SYSTEM.colors.neutral.light}`,
    background: active ? DESIGN_SYSTEM.colors.gradients.primary : '#ffffff',
    color: active ? '#ffffff' : DESIGN_SYSTEM.colors.neutral.dark,
    fontSize: isMobile ? '13px' : (isTablet ? '14px' : '15px'),
    fontWeight: DESIGN_SYSTEM.typography.weights.semibold,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    opacity: disabled ? 0.5 : 1,
    boxShadow: active ? '0 4px 16px rgba(74, 77, 201, 0.3)' : 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: DESIGN_SYSTEM.typography.fontFamily,
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
    flex: isMobile ? '1 1 0' : 'none',
    minWidth: isMobile ? '0' : 'auto',
    justifyContent: 'center',
    whiteSpace: 'nowrap' as const,
  });

  const mainStyle: React.CSSProperties = {
    maxWidth: 1200,
    margin: '0 auto',
    padding: isMobile ? '20px 16px' : (isTablet ? '32px 24px' : '48px 32px'),
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: isMobile ? '24px' : (isTablet ? '32px' : '40px'),
    fontWeight: DESIGN_SYSTEM.typography.weights.bold,
    background: DESIGN_SYSTEM.colors.gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textAlign: 'center',
    margin: `0 0 ${isMobile ? '12px' : '16px'} 0`,
    lineHeight: 1.2,
  };

  const sectionSubtitleStyle: React.CSSProperties = {
    fontSize: isMobile ? '14px' : (isTablet ? '16px' : '18px'),
    color: DESIGN_SYSTEM.colors.neutral.dark,
    textAlign: 'center',
    maxWidth: 800,
    margin: `0 auto ${isMobile ? '24px' : '32px'}`,
    lineHeight: 1.6,
  };

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    padding: isMobile ? '20px' : (isTablet ? '24px' : '32px'),
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: `1px solid ${DESIGN_SYSTEM.colors.neutral.light}`,
    marginBottom: isMobile ? '16px' : '24px',
  };

  const buttonStyle = (variant: 'contained' | 'outlined' = 'contained', disabled: boolean = false): React.CSSProperties => {
    const basePadding = isMobile ? '12px 18px' : (isTablet ? '12px 20px' : '14px 24px');
    const fontSize = isMobile ? '14px' : (isTablet ? '14px' : '16px');
    
    if (variant === 'outlined') {
      return {
        padding: basePadding,
        borderRadius: DESIGN_SYSTEM.borderRadius.pill,
        border: `2px solid ${disabled ? DESIGN_SYSTEM.colors.neutral.medium : DESIGN_SYSTEM.colors.primary.main}`,
        backgroundColor: 'transparent',
        color: disabled ? DESIGN_SYSTEM.colors.neutral.medium : DESIGN_SYSTEM.colors.primary.main,
        fontSize: fontSize,
        fontWeight: DESIGN_SYSTEM.typography.weights.semibold,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: disabled ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: DESIGN_SYSTEM.typography.fontFamily,
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        justifyContent: 'center',
      };
    }
    
    return {
      padding: basePadding,
      borderRadius: DESIGN_SYSTEM.borderRadius.pill,
      border: 'none',
      background: disabled ? DESIGN_SYSTEM.colors.neutral.medium : DESIGN_SYSTEM.colors.gradients.primary,
      color: '#ffffff',
      fontSize: fontSize,
      fontWeight: DESIGN_SYSTEM.typography.weights.semibold,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      opacity: disabled ? 0.5 : 1,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: disabled ? 'none' : '0 4px 16px rgba(74, 77, 201, 0.3)',
      fontFamily: DESIGN_SYSTEM.typography.fontFamily,
      WebkitTapHighlightColor: 'transparent',
      touchAction: 'manipulation',
      justifyContent: 'center',
    };
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: isMobile ? '12px 14px' : '14px 16px',
    borderRadius: DESIGN_SYSTEM.borderRadius.sm,
    border: `2px solid ${DESIGN_SYSTEM.colors.neutral.light}`,
    fontSize: isMobile ? '15px' : '16px',
    fontFamily: DESIGN_SYSTEM.typography.fontFamily,
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box' as const,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
    gap: isMobile ? '10px' : '12px',
    marginBottom: isMobile ? '16px' : '20px',
  };

  const numberButtonStyle = (selected: boolean): React.CSSProperties => ({
    padding: isMobile ? '14px' : '16px',
    borderRadius: DESIGN_SYSTEM.borderRadius.sm,
    border: `2px solid ${selected ? DESIGN_SYSTEM.colors.primary.main : DESIGN_SYSTEM.colors.neutral.light}`,
    background: selected ? DESIGN_SYSTEM.colors.primary.light : '#ffffff',
    color: DESIGN_SYSTEM.colors.neutral.dark,
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: DESIGN_SYSTEM.typography.weights.bold,
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontFamily: DESIGN_SYSTEM.typography.fontFamily,
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
  });

  const optionButtonStyle = (state: 'idle' | 'selected' | 'correct' | 'wrong' | 'disabled'): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '100%',
      padding: isMobile ? '14px 16px' : '16px 20px',
      borderRadius: DESIGN_SYSTEM.borderRadius.sm,
      textAlign: 'left',
      fontSize: isMobile ? '14px' : '15px',
      fontWeight: DESIGN_SYSTEM.typography.weights.medium,
      cursor: state === 'disabled' ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s',
      fontFamily: DESIGN_SYSTEM.typography.fontFamily,
      border: `2px solid ${DESIGN_SYSTEM.colors.neutral.light}`,
      background: '#ffffff',
      color: DESIGN_SYSTEM.colors.neutral.dark,
      marginBottom: isMobile ? '10px' : '12px',
      WebkitTapHighlightColor: 'transparent',
      touchAction: 'manipulation',
      minHeight: isMobile ? '60px' : 'auto',
    };

    if (state === 'selected') {
      return { ...base, border: `2px solid ${DESIGN_SYSTEM.colors.primary.main}`, background: DESIGN_SYSTEM.colors.primary.light };
    }
    if (state === 'correct') {
      return { ...base, border: `2px solid ${DESIGN_SYSTEM.colors.secondary.main}`, background: DESIGN_SYSTEM.colors.secondary.light, color: DESIGN_SYSTEM.colors.secondary.dark };
    }
    if (state === 'wrong') {
      return { ...base, border: '2px solid #ef4444', background: '#fee2e2', color: '#991b1b' };
    }
    if (state === 'disabled') {
      return { ...base, opacity: 0.5 };
    }
    return base;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={headerInnerStyle}>
          <h1 style={titleStyle}>{additionalProps?.title ?? 'Integer Multiplication Patterns'}</h1>
          
          {modeControls?.visible !== false && (
            <div style={tabsStyle}>
              {enabledModes.indexOf('learn') !== -1 && (
                <button
                  onClick={() => handleModeChange('learn')}
                  disabled={modeControls?.allowSwitch === false}
                  style={tabButtonStyle(currentMode === 'learn', modeControls?.allowSwitch === false)}
                >
                  📚 {modeControls?.labels?.learn ?? 'Learn'}
                </button>
              )}
              {enabledModes.indexOf('practice') !== -1 && (
                <button
                  onClick={() => handleModeChange('practice')}
                  disabled={modeControls?.allowSwitch === false}
                  style={tabButtonStyle(currentMode === 'practice', modeControls?.allowSwitch === false)}
                >
                  ✏️ {modeControls?.labels?.practice ?? 'Practice'}
                </button>
              )}
              {enabledModes.indexOf('realworld') !== -1 && (
                <button
                  onClick={() => handleModeChange('realworld')}
                  disabled={modeControls?.allowSwitch === false}
                  style={tabButtonStyle(currentMode === 'realworld', modeControls?.allowSwitch === false)}
                >
                  🌍 {modeControls?.labels?.realworld ?? 'Real World'}
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={mainStyle}>
        {/* LEARN MODE */}
        {currentMode === 'learn' && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <h2 style={sectionTitleStyle}>{additionalProps?.learnHeader?.title ?? 'Discover the Patterns'}</h2>
            <p style={sectionSubtitleStyle}>
              {additionalProps?.learnHeader?.subtitle ?? 'Watch how products change as multipliers decrease through zero and into negatives.'}
            </p>

            {/* Pattern Selector */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: isMobile ? '12px' : '20px', marginBottom: isMobile ? '24px' : '32px', flexWrap: 'wrap' }}>
              <button
                onClick={() => switchPattern('prev')}
                style={{ ...buttonStyle('outlined', false), padding: isMobile ? '10px' : '12px', borderRadius: '50%' }}
              >
                ◀
              </button>
              
              <div style={{
                background: DESIGN_SYSTEM.colors.gradients.light,
                padding: isMobile ? '16px 24px' : '20px 32px',
                borderRadius: DESIGN_SYSTEM.borderRadius.lg,
                border: `2px solid ${DESIGN_SYSTEM.colors.primary.light}`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: DESIGN_SYSTEM.typography.weights.semibold, color: DESIGN_SYSTEM.colors.primary.dark, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Multiplicand
                </div>
                <div style={{ fontSize: isMobile ? '36px' : '48px', fontWeight: DESIGN_SYSTEM.typography.weights.bold, color: DESIGN_SYSTEM.colors.primary.main }}>
                  {currentPattern.multiplicand > 0 ? '+' : ''}{currentPattern.multiplicand}
                </div>
              </div>

              <button
                onClick={() => switchPattern('next')}
                style={{ ...buttonStyle('outlined', false), padding: isMobile ? '10px' : '12px', borderRadius: '50%' }}
              >
                ▶
              </button>
            </div>

            {/* Description */}
            <div style={{ ...cardStyle, maxWidth: 800, margin: `0 auto ${isMobile ? '24px' : '32px'}` }}>
              <p style={{ margin: 0, fontSize: isMobile ? '14px' : '16px', lineHeight: 1.7, color: DESIGN_SYSTEM.colors.neutral.dark }}>
                {currentPattern.description}
              </p>
            </div>

            {/* Pattern Table */}
            <div style={{ ...cardStyle, maxWidth: 900, margin: '0 auto' }}>
              {currentPattern.sequence.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: isMobile ? '12px' : '16px',
                    marginBottom: '12px',
                    borderRadius: DESIGN_SYSTEM.borderRadius.sm,
                    border: `2px solid ${item.multiplier === 0 ? DESIGN_SYSTEM.colors.secondary.main : DESIGN_SYSTEM.colors.neutral.light}`,
                    background: item.multiplier === 0 ? DESIGN_SYSTEM.colors.secondary.light : DESIGN_SYSTEM.colors.neutral.lightest,
                    opacity: index < revealedRows ? 1 : 0.3,
                    transition: 'all 0.5s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: isMobile ? '16px' : '20px',
                    fontWeight: DESIGN_SYSTEM.typography.weights.bold,
                    fontFamily: 'monospace',
                  }}
                >
                  <span>
                    <span style={{ color: item.multiplier >= 0 ? DESIGN_SYSTEM.colors.primary.main : '#ef4444' }}>{item.multiplier}</span>
                    {' × '}
                    <span style={{ color: currentPattern.multiplicand >= 0 ? DESIGN_SYSTEM.colors.secondary.main : '#ef4444' }}>{currentPattern.multiplicand}</span>
                    {' = '}
                    <span style={{ color: item.product >= 0 ? DESIGN_SYSTEM.colors.secondary.dark : '#dc2626' }}>{item.product}</span>
                  </span>
                  {index > 0 && index < revealedRows && (
                    <span style={{ color: getDifference(index)?.startsWith('+') ? DESIGN_SYSTEM.colors.secondary.main : '#ef4444', fontSize: isMobile ? '14px' : '16px' }}>
                      {getDifference(index)}
                    </span>
                  )}
                </div>
              ))}

              {/* Controls */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleRevealNext}
                  disabled={revealedRows >= currentPattern.sequence.length}
                  style={{ ...buttonStyle('contained', revealedRows >= currentPattern.sequence.length), flex: '1 1 200px' }}
                >
                  {revealedRows >= currentPattern.sequence.length ? '✓ Complete' : 'Reveal Next'}
                </button>
                <button
                  onClick={handleAutoReveal}
                  style={{ ...buttonStyle('outlined', false), flex: '1 1 150px' }}
                >
                  Auto Reveal
                </button>
                <button
                  onClick={handleReset}
                  style={{ ...buttonStyle('outlined', false), padding: isMobile ? '12px' : '14px' }}
                >
                  🔄
                </button>
              </div>
            </div>

            {/* Calculator */}
            <div style={{ ...cardStyle, maxWidth: 600, margin: `${isMobile ? '32px' : '48px'} auto 0`, background: DESIGN_SYSTEM.colors.gradients.light }}>
              <h3 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: DESIGN_SYSTEM.typography.weights.bold, color: DESIGN_SYSTEM.colors.primary.dark, marginBottom: '20px' }}>
                Try Your Own Calculation
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: isMobile ? '13px' : '14px', fontWeight: DESIGN_SYSTEM.typography.weights.semibold, marginBottom: '10px', color: DESIGN_SYSTEM.colors.neutral.dark, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Select Multiplicand
                </label>
                <div style={gridStyle}>
                  {[3, -3, 5, -5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedMultiplicand(num)}
                      style={numberButtonStyle(selectedMultiplicand === num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: isMobile ? '13px' : '14px', fontWeight: DESIGN_SYSTEM.typography.weights.semibold, marginBottom: '10px', color: DESIGN_SYSTEM.colors.neutral.dark, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Enter Multiplier
                </label>
                <input
                  type="number"
                  value={customMultiplier}
                  onChange={(e) => setCustomMultiplier(e.target.value)}
                  placeholder="e.g., -4, 0, 7"
                  style={inputStyle}
                />
              </div>

              <button
                onClick={handleCustomCalculation}
                style={{ ...buttonStyle('contained', false), width: '100%', marginBottom: '20px' }}
              >
                Calculate
              </button>

              {customResult !== null && (
                <div style={{ padding: isMobile ? '16px' : '20px', borderRadius: DESIGN_SYSTEM.borderRadius.sm, background: '#ffffff', textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                  <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: DESIGN_SYSTEM.typography.weights.bold, fontFamily: 'monospace' }}>
                    <span style={{ color: DESIGN_SYSTEM.colors.primary.main }}>{customMultiplier}</span>
                    {' × '}
                    <span style={{ color: DESIGN_SYSTEM.colors.secondary.main }}>{selectedMultiplicand}</span>
                    {' = '}
                    <span style={{ color: customResult >= 0 ? DESIGN_SYSTEM.colors.secondary.dark : '#dc2626' }}>{customResult}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRACTICE MODE */}
        {currentMode === 'practice' && (
          <div style={{ animation: 'fadeIn 0.5s ease-out', maxWidth: 800, margin: '0 auto' }}>
            <div style={cardStyle}>
              <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
                <div style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: DESIGN_SYSTEM.typography.weights.semibold, color: DESIGN_SYSTEM.colors.secondary.main, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Question {currentQuestion + 1} of {mcqQuestions.length}
                </div>
                <h3 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: DESIGN_SYSTEM.typography.weights.bold, color: DESIGN_SYSTEM.colors.neutral.dark, margin: 0, lineHeight: 1.4 }}>
                  {mcqQuestions[currentQuestion].question}
                </h3>
              </div>

              <div>
                {mcqQuestions[currentQuestion].options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === mcqQuestions[currentQuestion].correctAnswer;
                  const showResult = showExplanation;

                  const buttonState: 'idle' | 'selected' | 'correct' | 'wrong' | 'disabled' = showResult
                    ? isCorrect
                      ? 'correct'
                      : isSelected
                        ? 'wrong'
                        : 'disabled'
                    : isSelected
                      ? 'selected'
                      : 'idle';

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showExplanation}
                      style={optionButtonStyle(buttonState)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{option}</span>
                        {showResult && isCorrect && <span style={{ fontSize: '20px' }}>✓</span>}
                        {showResult && isSelected && !isCorrect && <span style={{ fontSize: '20px' }}>✕</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {!showExplanation ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  style={{ ...buttonStyle('contained', selectedAnswer === null), width: '100%' }}
                >
                  Submit Answer
                </button>
              ) : (
                <div style={{ padding: isMobile ? '16px' : '20px', borderRadius: DESIGN_SYSTEM.borderRadius.sm, background: DESIGN_SYSTEM.colors.primary.light, border: `2px solid ${DESIGN_SYSTEM.colors.primary.main}`, animation: 'fadeIn 0.5s' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '16px' : '18px', fontWeight: DESIGN_SYSTEM.typography.weights.bold, color: DESIGN_SYSTEM.colors.primary.dark }}>
                    ✨ Explanation
                  </h4>
                  <p style={{ margin: 0, fontSize: isMobile ? '14px' : '15px', lineHeight: 1.6, color: DESIGN_SYSTEM.colors.neutral.dark }}>
                    {mcqQuestions[currentQuestion].explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                style={buttonStyle('outlined', currentQuestion === 0)}
              >
                ← Previous
              </button>
              
              <button
                onClick={resetPractice}
                style={{ ...buttonStyle('outlined', false), marginLeft: 'auto' }}
              >
                🔄 Reset Quiz
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={currentQuestion === mcqQuestions.length - 1}
                style={buttonStyle('contained', currentQuestion === mcqQuestions.length - 1)}
              >
                Next →
              </button>
            </div>

            {/* Completion */}
            {currentQuestion === mcqQuestions.length - 1 && showExplanation && (
              <div style={{ ...cardStyle, textAlign: 'center', background: DESIGN_SYSTEM.colors.gradients.light, marginTop: '24px', animation: 'fadeIn 0.5s' }}>
                <h3 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: DESIGN_SYSTEM.typography.weights.bold, color: DESIGN_SYSTEM.colors.primary.dark, margin: '0 0 12px 0' }}>
                  Quiz Complete! 🎉
                </h3>
                <p style={{ fontSize: isMobile ? '16px' : '18px', color: DESIGN_SYSTEM.colors.neutral.dark, margin: '0 0 8px 0' }}>
                  Your Score: <strong style={{ color: DESIGN_SYSTEM.colors.secondary.dark }}>{score} / {mcqQuestions.length}</strong>
                </p>
                <p style={{ fontSize: isMobile ? '14px' : '15px', color: DESIGN_SYSTEM.colors.neutral.dark, margin: 0 }}>
                  {score === mcqQuestions.length
                    ? "Perfect! You've mastered integer multiplication patterns!"
                    : score >= mcqQuestions.length * 0.6
                      ? 'Great job! Keep practicing to master all concepts.'
                      : 'Keep learning! Review the patterns and try again.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* REAL WORLD MODE */}
        {currentMode === 'realworld' && (
          <div style={{ animation: 'fadeIn 0.5s ease-out', maxWidth: 900, margin: '0 auto' }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px', marginBottom: isMobile ? '20px' : '24px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: isMobile ? '40px' : '56px', lineHeight: 1 }}>
                  {realWorldExamples[currentExample].icon}
                </div>
                <h3 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: DESIGN_SYSTEM.typography.weights.bold, background: DESIGN_SYSTEM.colors.gradients.secondary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, flex: 1 }}>
                  {realWorldExamples[currentExample].title}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '14px' : '16px' }}>
                <div style={{ padding: isMobile ? '14px' : '16px', borderRadius: DESIGN_SYSTEM.borderRadius.sm, background: DESIGN_SYSTEM.colors.neutral.lightest, border: `1px solid ${DESIGN_SYSTEM.colors.neutral.light}` }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: isMobile ? '14px' : '16px', fontWeight: DESIGN_SYSTEM.typography.weights.semibold, color: DESIGN_SYSTEM.colors.primary.dark }}>
                    📖 Scenario
                  </h4>
                  <p style={{ margin: 0, fontSize: isMobile ? '14px' : '15px', lineHeight: 1.7, color: DESIGN_SYSTEM.colors.neutral.dark }}>
                    {realWorldExamples[currentExample].scenario}
                  </p>
                </div>

                <div style={{ padding: isMobile ? '14px' : '16px', borderRadius: DESIGN_SYSTEM.borderRadius.sm, background: DESIGN_SYSTEM.colors.neutral.lightest, border: `1px solid ${DESIGN_SYSTEM.colors.neutral.light}` }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: isMobile ? '14px' : '16px', fontWeight: DESIGN_SYSTEM.typography.weights.semibold, color: DESIGN_SYSTEM.colors.secondary.main }}>
                    ❓ Problem
                  </h4>
                  <p style={{ margin: 0, fontSize: isMobile ? '14px' : '15px', lineHeight: 1.7, color: DESIGN_SYSTEM.colors.neutral.dark }}>
                    {realWorldExamples[currentExample].problem}
                  </p>
                </div>

                <div style={{ padding: isMobile ? '14px' : '16px', borderRadius: DESIGN_SYSTEM.borderRadius.sm, background: DESIGN_SYSTEM.colors.primary.light, border: `2px solid ${DESIGN_SYSTEM.colors.primary.main}` }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: isMobile ? '14px' : '16px', fontWeight: DESIGN_SYSTEM.typography.weights.semibold, color: DESIGN_SYSTEM.colors.primary.dark }}>
                    🔢 Calculation
                  </h4>
                  <div style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: DESIGN_SYSTEM.typography.weights.bold, fontFamily: 'monospace', textAlign: 'center', color: DESIGN_SYSTEM.colors.primary.dark, padding: '10px', background: '#ffffff', borderRadius: DESIGN_SYSTEM.borderRadius.sm }}>
                    {realWorldExamples[currentExample].calculation}
                  </div>
                </div>

                <div style={{ padding: isMobile ? '14px' : '16px', borderRadius: DESIGN_SYSTEM.borderRadius.sm, background: DESIGN_SYSTEM.colors.secondary.light, border: `2px solid ${DESIGN_SYSTEM.colors.secondary.main}` }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: isMobile ? '14px' : '16px', fontWeight: DESIGN_SYSTEM.typography.weights.semibold, color: DESIGN_SYSTEM.colors.secondary.dark }}>
                    ✓ Application
                  </h4>
                  <p style={{ margin: 0, fontSize: isMobile ? '14px' : '15px', lineHeight: 1.7, color: DESIGN_SYSTEM.colors.neutral.dark }}>
                    {realWorldExamples[currentExample].application}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handlePrevExample}
                disabled={currentExample === 0}
                style={buttonStyle('outlined', currentExample === 0)}
              >
                ← Previous Example
              </button>

              <button
                onClick={handleNextExample}
                disabled={currentExample === realWorldExamples.length - 1}
                style={{ ...buttonStyle('contained', currentExample === realWorldExamples.length - 1), marginLeft: 'auto' }}
              >
                Next Example →
              </button>
            </div>

            {/* Completion */}
            {currentExample === realWorldExamples.length - 1 && (
              <div style={{ ...cardStyle, textAlign: 'center', background: DESIGN_SYSTEM.colors.gradients.light, marginTop: '24px', animation: 'fadeIn 0.5s' }}>
                <h3 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: DESIGN_SYSTEM.typography.weights.bold, color: DESIGN_SYSTEM.colors.secondary.dark, margin: '0 0 12px 0' }}>
                  All Examples Explored! 🌟
                </h3>
                <p style={{ fontSize: isMobile ? '14px' : '15px', color: DESIGN_SYSTEM.colors.neutral.dark, margin: 0 }}>
                  You've seen how integer multiplication appears in everyday life!
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        * {
          box-sizing: border-box;
        }
        
        button {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
        
        input:focus {
          border-color: ${DESIGN_SYSTEM.colors.primary.main};
        }
        
        button:not(:disabled):hover {
          transform: translateY(-1px);
        }
        
        button:not(:disabled):active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default IntegerMultiplicationPatterns;