// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: practice_questions_quiz_tool.tsx
// Design System: Singularity (Poppins, #4A4DC9, #FF7212, #533086→#FC9145)
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Check, X, ChevronRight, RotateCcw, BookOpen, Zap, Star, ArrowRight } from 'lucide-react';

// ==================== DESIGN TOKENS (Singularity) ====================

const DS = {
    primary: '#4A4DC9',
    primaryDark: '#3A3DB0',
    primaryDeep: '#533086',
    highlight: '#FF7212',
    highlightDark: '#E5660F',
    gradientOrange: '#FC9145',
    lightPurple: '#C1C1EA',
    lightOrange: '#FFF3E4',
    lightPurpleSoft: '#EAEAFF',
    lightOrangeSoft: '#FFF8F0',
    textDark: '#4E4E4E',
    textMuted: '#8A8A8A',
    gray300: '#CACACA',
    gray200: '#EBEBEB',
    gray100: '#F5F5F5',
    white: '#FFFFFF',
    correct: '#2ECC71',
    correctBg: '#E8F8F0',
    correctBorder: '#2ECC7140',
    incorrect: '#E74C3C',
    incorrectBg: '#FDEDED',
    incorrectBorder: '#E74C3C40',
    gradientWarm: 'linear-gradient(135deg, #533086 0%, #FC9145 100%)',
    gradientSubtle: 'linear-gradient(135deg, #C1C1EA 0%, #FFF3E4 100%)',
    radiusPill: '40px',
    radiusCard: '20px',
    radiusMd: '14px',
    radiusSm: '10px',
    font: "'Poppins', 'Segoe UI', system-ui, -apple-system, sans-serif",
};

// ==================== TYPE DEFINITIONS ====================

type ModeType = 'quiz' | 'review';

interface StepDetails {
    currentStep: number;
    totalSteps: number;
    isPaused: boolean;
    currentMode: ModeType;
}

interface QuestionOption { id: string; text: string; }

interface QuestionData {
    id: number;
    question: string;
    options: QuestionOption[];
    correctAnswer: string;
    explanation: string;
    figureRef?: string;
    conceptTag: string;
}

interface QuizAdditionalProps {
    questions?: QuestionData[];
    quizTitle?: string;
    quizSubtitle?: string;
    passingScore?: number;
    showExplanations?: boolean;
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
    accentColor?: string;
    instructionsForStudent?: string;
    teachingNotes?: string;
}

interface PracticeQuestionsQuizToolProps {
    props?: {
        width?: number;
        height?: number;
        initialMode?: ModeType;
        showModeSelector?: boolean;
        enabledModes?: ModeType[];
        showNavigation?: boolean;
        showPlayPause?: boolean;
        showStepIndicator?: boolean;
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

// ==================== DEFAULT QUESTIONS ====================

const DEFAULT_QUESTIONS: QuestionData[] = [
    {
        id: 1,
        question: "Which of the following is NOT an example of electricity used for transportation?",
        options: [
            { id: "a", text: "Electric train" },
            { id: "b", text: "Ceiling fan" },
            { id: "c", text: "Electric scooter" },
            { id: "d", text: "Lift (elevator)" }
        ],
        correctAnswer: "b",
        explanation: "A ceiling fan is used for cooling, not transportation. Electric trains, scooters, and lifts all use electricity to move people from one place to another, so they fall under the 'Transportation' category. A ceiling fan falls under 'Heating and Cooling'.",
        conceptTag: "Uses of Electricity"
    },
    {
        id: 2,
        question: "In the circuit shown in Fig. 3.16, which material connected between ends A and B will NOT allow the lamp to glow?",
        options: [
            { id: "a", text: "Iron key" },
            { id: "b", text: "Aluminium foil" },
            { id: "c", text: "Rubber eraser" },
            { id: "d", text: "Copper coin" }
        ],
        correctAnswer: "c",
        explanation: "A rubber eraser is an electrical insulator — it does not allow electric current to pass through it. Iron keys, aluminium foil, and copper coins are all made of metals, which are conductors of electricity.",
        figureRef: "Fig. 3.16",
        conceptTag: "Conductors & Insulators"
    },
    {
        id: 3,
        question: "In a series circuit with two lamps and a battery (Fig. 3.17), if the filament of one lamp breaks, what happens to the other lamp?",
        options: [
            { id: "a", text: "It glows brighter" },
            { id: "b", text: "It glows dimmer" },
            { id: "c", text: "It does not glow" },
            { id: "d", text: "It keeps glowing normally" }
        ],
        correctAnswer: "c",
        explanation: "In a series circuit, all components share the same single path for current flow. If one lamp's filament breaks, the circuit becomes open (incomplete), stopping current through the entire circuit. The other lamp will also not glow.",
        figureRef: "Fig. 3.17",
        conceptTag: "Series Circuits"
    },
    {
        id: 4,
        question: "In the symbol for an electric cell, what does the longer line represent?",
        options: [
            { id: "a", text: "Negative terminal" },
            { id: "b", text: "Positive terminal" },
            { id: "c", text: "The filament" },
            { id: "d", text: "The wire connection" }
        ],
        correctAnswer: "b",
        explanation: "In a circuit diagram, the symbol for an electric cell has two lines — the longer line represents the positive (+) terminal and the shorter line represents the negative (−) terminal.",
        conceptTag: "Cell Symbols"
    },
    {
        id: 5,
        question: "What is the main function of a switch in an electrical circuit?",
        options: [
            { id: "a", text: "It is the source of electric current" },
            { id: "b", text: "It increases the brightness of the lamp" },
            { id: "c", text: "It completes or breaks the circuit" },
            { id: "d", text: "It stores electrical energy" }
        ],
        correctAnswer: "c",
        explanation: "A switch is a simple device that either completes (closes) or breaks (opens) an electrical circuit. The source of current is the cell or battery, not the switch.",
        conceptTag: "Switch Function"
    },
    {
        id: 6,
        question: "An LED is connected to a battery but does not glow even though the battery is working. What is the MOST LIKELY reason?",
        options: [
            { id: "a", text: "The wires are too long" },
            { id: "b", text: "The LED is connected with wrong polarity" },
            { id: "c", text: "LEDs only work with AC current" },
            { id: "d", text: "LEDs cannot work with batteries" }
        ],
        correctAnswer: "b",
        explanation: "An LED allows current to pass in only one direction. It lights up only when its positive terminal (longer wire) is connected to the positive terminal of the battery. If polarity is reversed, no current flows and it won't glow.",
        conceptTag: "LED Polarity"
    },
    {
        id: 7,
        question: "Vidyut made a circuit (Fig. 3.19) but the lamp does not glow even after closing the switch. Which of the following is NOT a possible reason for this?",
        options: [
            { id: "a", text: "The cell may be dead (used up)" },
            { id: "b", text: "The wires are made of copper" },
            { id: "c", text: "The lamp filament may be broken (fused)" },
            { id: "d", text: "A wire connection may be loose" }
        ],
        correctAnswer: "b",
        explanation: "Copper is an excellent conductor of electricity — it helps circuits work, not prevent them! A dead cell, fused lamp, or loose connection are all valid reasons a circuit might fail.",
        figureRef: "Fig. 3.19",
        conceptTag: "Circuit Troubleshooting"
    }
];

// ==================== KEYFRAMES ====================

const keyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

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
        60% { transform: scale(1.12); }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.06); }
        70% { transform: scale(0.92); }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes confettiFall {
        0% { transform: translateY(-100%) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-7px); }
        40% { transform: translateX(7px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
    }
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
    }
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes optionSlideIn {
        from { opacity: 0; transform: translateX(30px) scale(0.97); }
        to { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes scorePop {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }
    @keyframes tagSlide {
        from { opacity: 0; transform: translateY(-8px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
`;

// ==================== MAIN COMPONENT ====================

const PracticeQuestionsQuizTool: React.FC<PracticeQuestionsQuizToolProps> = ({
    props = {},
    setStepDetails,
    stopAutoNext,
    setStopAutoNext
}) => {
    const config = useMemo(() => ({
        width: props.width ?? 800,
        height: props.height ?? 600,
        themeColor: props.themeColor ?? DS.primary,
        darkMode: props.darkMode ?? false,
        animationSpeed: props.animationSpeed ?? 1,
    }), [props]);

    const additionalProps = props.additionalProps || {};

    const quizConfig = useMemo(() => ({
        questions: additionalProps.questions ?? DEFAULT_QUESTIONS,
        quizTitle: additionalProps.quizTitle ?? "Practice Questions",
        quizSubtitle: additionalProps.quizSubtitle ?? "Chapter 3: Electricity — Circuits and their Components",
        passingScore: additionalProps.passingScore ?? 5,
        showExplanations: additionalProps.showExplanations ?? true,
        accentColor: additionalProps.accentColor ?? DS.primary,
        instructionsForStudent: additionalProps.instructionsForStudent ?? "Answer these 7 practice questions from Chapter 3! Read each question carefully and select your answer. Read the explanations to reinforce your learning!",
    }), [additionalProps]);

    // ─── STATE ───
    const [screen, setScreen] = useState<'start' | 'quiz' | 'result'>('start');
    const [currentQ, setCurrentQ] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [answers, setAnswers] = useState<{ [key: number]: { selected: string; correct: boolean } }>({});
    const [score, setScore] = useState(0);
    const [animKey, setAnimKey] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);
    const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
    const [pressedBtn, setPressedBtn] = useState<string | null>(null);
    const [confettiPieces, setConfettiPieces] = useState<{ id: number; left: number; color: string; delay: number; size: number }[]>([]);
    const [scoreAnimated, setScoreAnimated] = useState(false);

    const questions = quizConfig.questions;
    const totalQuestions = questions.length;
    const currentQuestion = questions[currentQ];

    // ─── INJECT KEYFRAMES + FONT ───
    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'quiz-singularity-kf';
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
        return () => {
            const el = document.getElementById('quiz-singularity-kf');
            if (el) document.head.removeChild(el);
        };
    }, []);

    useEffect(() => {
        if (setStepDetails) {
            setStepDetails({ currentStep: currentQ + 1, totalSteps: totalQuestions, isPaused: true, currentMode: 'quiz' });
        }
    }, [currentQ, totalQuestions, setStepDetails]);

    // ─── HANDLERS ───
    const handleStartQuiz = useCallback(() => {
        setScreen('quiz'); setCurrentQ(0); setSelectedAnswer(null); setIsAnswered(false);
        setAnswers({}); setScore(0); setShowExplanation(false); setAnimKey(p => p + 1); setScoreAnimated(false);
    }, []);

    const handleSelectAnswer = useCallback((optionId: string) => {
        if (isAnswered) return;
        setSelectedAnswer(optionId);
        setIsAnswered(true);
        const isCorrect = optionId === currentQuestion.correctAnswer;
        setScore(s => isCorrect ? s + 1 : s);
        if (isCorrect) { setScoreAnimated(true); setTimeout(() => setScoreAnimated(false), 400); }
        setAnswers(prev => ({ ...prev, [currentQ]: { selected: optionId, correct: isCorrect } }));
        setTimeout(() => setShowExplanation(true), 550);
    }, [isAnswered, currentQuestion, currentQ]);

    const handleNext = useCallback(() => {
        if (currentQ < totalQuestions - 1) {
            setCurrentQ(p => p + 1); setSelectedAnswer(null); setIsAnswered(false);
            setShowExplanation(false); setAnimKey(p => p + 1);
        } else {
            const colors = [DS.primary, DS.highlight, DS.gradientOrange, DS.lightPurple, DS.primaryDeep, '#FFD700'];
            setConfettiPieces(Array.from({ length: 35 }, (_, i) => ({
                id: i, left: Math.random() * 100, color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 2.2, size: Math.random() * 9 + 4,
            })));
            setScreen('result'); setAnimKey(p => p + 1);
        }
    }, [currentQ, totalQuestions]);

    // ═══════════════════════════════════════════════════════════════
    // FIX: renderPillBtn is a PLAIN FUNCTION returning JSX,
    // NOT a React component. This prevents unmount/remount
    // on every parent re-render which was killing click handlers.
    // ═══════════════════════════════════════════════════════════════
    const renderPillBtn = (
        label: string,
        onClick: () => void,
        variant: 'contained' | 'outlined' | 'highlight',
        bid: string,
        icon?: React.ReactNode,
        disabled?: boolean,
        delay?: string
    ) => {
        const hov = hoveredBtn === bid;
        const press = pressedBtn === bid;
        const d = delay || '0s';

        let bg = DS.primary;
        let clr = DS.white;
        let bdr = 'none';
        let shadow = `0 4px 16px ${DS.primary}35`;
        let tx = 'scale(1)';

        if (disabled) {
            bg = DS.gray200; clr = DS.gray300; shadow = 'none';
        } else if (variant === 'contained') {
            bg = press ? DS.primaryDark : hov ? DS.highlight : DS.primary;
            shadow = hov ? `0 8px 28px ${DS.highlight}50` : `0 4px 16px ${DS.primary}35`;
            tx = press ? 'scale(0.96)' : hov ? 'scale(1.04) translateY(-1px)' : 'scale(1)';
        } else if (variant === 'highlight') {
            bg = press ? DS.highlightDark : hov ? DS.primary : DS.highlight;
            shadow = hov ? `0 8px 28px ${DS.primary}50` : `0 4px 16px ${DS.highlight}35`;
            tx = press ? 'scale(0.96)' : hov ? 'scale(1.04) translateY(-1px)' : 'scale(1)';
        } else {
            bg = press ? DS.lightPurpleSoft : hov ? DS.lightPurpleSoft : 'transparent';
            clr = hov ? DS.highlight : DS.primary;
            bdr = `2px solid ${hov ? DS.highlight : DS.primary}`;
            shadow = hov ? `0 4px 16px ${DS.primary}20` : 'none';
            tx = press ? 'scale(0.96)' : hov ? 'scale(1.03)' : 'scale(1)';
        }

        return (
            <button
                key={bid}
                onClick={disabled ? undefined : onClick}
                onMouseEnter={() => setHoveredBtn(bid)}
                onMouseLeave={() => { setHoveredBtn(null); setPressedBtn(null); }}
                onMouseDown={() => setPressedBtn(bid)}
                onMouseUp={() => setPressedBtn(null)}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    padding: '13px 30px',
                    borderRadius: DS.radiusPill,
                    fontFamily: DS.font,
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: disabled ? 'default' : 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: bdr,
                    outline: 'none',
                    letterSpacing: '0.2px',
                    whiteSpace: 'nowrap' as const,
                    animation: `fadeInUp 0.5s ease-out ${d} both`,
                    backgroundColor: bg,
                    color: clr,
                    boxShadow: shadow,
                    transform: tx,
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                {icon}
                {label}
            </button>
        );
    };

    // ─── OPTION STYLES ───
    const optStyle = useCallback((oid: string, idx: number): React.CSSProperties => {
        const base: React.CSSProperties = {
            display: 'flex', alignItems: 'center', gap: '14px', padding: '15px 20px',
            borderRadius: DS.radiusMd, border: `2px solid ${DS.gray200}`, cursor: isAnswered ? 'default' : 'pointer',
            transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)', backgroundColor: DS.white,
            position: 'relative', overflow: 'hidden', fontFamily: DS.font,
            animation: `optionSlideIn 0.4s ease-out ${idx * 0.07}s both`,
        };
        if (isAnswered) {
            if (oid === currentQuestion.correctAnswer) return { ...base, border: `2px solid ${DS.correct}`, backgroundColor: DS.correctBg, transform: 'scale(1.015)', boxShadow: `0 0 0 3px ${DS.correctBorder}, 0 4px 12px ${DS.correct}20` };
            if (oid === selectedAnswer && oid !== currentQuestion.correctAnswer) return { ...base, border: `2px solid ${DS.incorrect}`, backgroundColor: DS.incorrectBg, animation: `shake 0.5s ease-in-out, optionSlideIn 0.4s ease-out ${idx * 0.07}s both`, boxShadow: `0 0 0 3px ${DS.incorrectBorder}` };
            return { ...base, opacity: 0.45 };
        }
        if (hoveredOption === oid) return { ...base, border: `2px solid ${DS.primary}`, backgroundColor: DS.lightPurpleSoft, transform: 'translateX(5px)', boxShadow: `0 4px 18px ${DS.primary}18` };
        return base;
    }, [isAnswered, selectedAnswer, currentQuestion, hoveredOption]);

    const lblStyle = useCallback((oid: string): React.CSSProperties => {
        const base: React.CSSProperties = { width: '38px', height: '38px', borderRadius: DS.radiusSm, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', fontFamily: DS.font, flexShrink: 0, transition: 'all 0.28s ease' };
        if (isAnswered) {
            if (oid === currentQuestion.correctAnswer) return { ...base, backgroundColor: DS.correct, color: DS.white, borderRadius: '50%' };
            if (oid === selectedAnswer && oid !== currentQuestion.correctAnswer) return { ...base, backgroundColor: DS.incorrect, color: DS.white, borderRadius: '50%' };
            return { ...base, backgroundColor: DS.gray100, color: DS.gray300 };
        }
        if (hoveredOption === oid) return { ...base, backgroundColor: DS.primary, color: DS.white };
        return { ...base, backgroundColor: DS.lightPurpleSoft, color: DS.primary };
    }, [isAnswered, selectedAnswer, currentQuestion, hoveredOption]);

    // ═══════════ START SCREEN ═══════════

    const renderStartScreen = () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '36px 32px', textAlign: 'center', position: 'relative' }}>
            {/* Decorative blobs — pointerEvents: 'none' so they don't block clicks */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: DS.gradientSubtle, opacity: 0.5, animation: 'float 4s ease-in-out infinite', pointerEvents: 'none' as const }} />
            <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: DS.gradientSubtle, opacity: 0.4, animation: 'float 5s ease-in-out 1s infinite', pointerEvents: 'none' as const }} />

            <div style={{ width: '76px', height: '76px', borderRadius: '22px', background: DS.gradientWarm, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '22px', animation: 'bounceIn 0.7s ease-out 0.15s both', boxShadow: `0 12px 32px ${DS.primaryDeep}40`, position: 'relative', zIndex: 1 }}>
                <BookOpen size={34} color={DS.white} strokeWidth={2.2} />
            </div>

            <h1 style={{ fontFamily: DS.font, fontSize: '26px', fontWeight: 800, color: DS.textDark, margin: '0 0 6px 0', animation: 'fadeInUp 0.55s ease-out 0.25s both', letterSpacing: '-0.3px', zIndex: 1, position: 'relative' }}>
                {quizConfig.quizTitle}
            </h1>

            <p style={{ fontFamily: DS.font, fontSize: '14px', color: DS.primary, margin: '0 0 24px 0', fontWeight: 600, animation: 'fadeInUp 0.55s ease-out 0.35s both', zIndex: 1, position: 'relative' }}>
                {quizConfig.quizSubtitle}
            </p>

            <div style={{ backgroundColor: DS.white, borderRadius: DS.radiusCard, padding: '18px 22px', maxWidth: '460px', width: '100%', marginBottom: '26px', border: `1.5px solid ${DS.lightPurple}60`, animation: 'fadeInUp 0.55s ease-out 0.45s both', textAlign: 'left', zIndex: 1, position: 'relative', boxShadow: `0 2px 12px ${DS.primary}08` }}>
                <p style={{ fontFamily: DS.font, fontSize: '13px', color: DS.textMuted, margin: 0, lineHeight: 1.75 }}>
                    {quizConfig.instructionsForStudent}
                </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', animation: 'fadeInUp 0.55s ease-out 0.55s both', flexWrap: 'wrap', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
                {[{ e: '📝', l: `${totalQuestions} Questions`, bg: DS.lightPurpleSoft }, { e: '⚡', l: 'Instant Feedback', bg: DS.lightOrange }, { e: '💡', l: 'Explanations', bg: DS.lightPurpleSoft }].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontFamily: DS.font, color: DS.textDark, fontWeight: 500, padding: '6px 14px', borderRadius: DS.radiusPill, backgroundColor: item.bg }}>
                        <span style={{ fontSize: '14px' }}>{item.e}</span>{item.l}
                    </div>
                ))}
            </div>

            {/* FIX: Using renderPillBtn (plain function) instead of <PillBtn /> (component) */}
            <div style={{ zIndex: 2, position: 'relative' }}>
                {renderPillBtn('Start Quiz', handleStartQuiz, 'contained', 'start', <ArrowRight size={18} />, false, '0.65s')}
            </div>
        </div>
    );

    // ═══════════ QUIZ SCREEN ═══════════

    const renderQuizScreen = () => (
        <div key={animKey} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '16px 24px 14px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: `1px solid ${DS.gray200}`, background: DS.white }}>
                <div style={{ fontFamily: DS.font, fontSize: '13px', fontWeight: 700, color: DS.primary, whiteSpace: 'nowrap', minWidth: '44px' }}>
                    {currentQ + 1} / {totalQuestions}
                </div>
                <div style={{ flex: 1, height: '6px', backgroundColor: DS.gray200, borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${((currentQ + (isAnswered ? 1 : 0)) / totalQuestions) * 100}%`, background: DS.gradientWarm, borderRadius: '100px', transition: 'width 0.55s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: DS.radiusPill, backgroundColor: DS.lightOrange, fontFamily: DS.font, fontSize: '13px', fontWeight: 700, color: DS.highlight, minWidth: '52px', justifyContent: 'center', transition: 'all 0.3s ease', animation: scoreAnimated ? 'scorePop 0.4s ease-out' : 'none' }}>
                    <Star size={13} fill={DS.highlight} />{score}
                </div>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px 24px' }}>
                {/* Tags */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', animation: 'tagSlide 0.35s ease-out', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 14px', borderRadius: DS.radiusPill, backgroundColor: DS.lightPurpleSoft, color: DS.primary, fontSize: '11px', fontWeight: 600, fontFamily: DS.font }}>
                        <Zap size={11} />{currentQuestion.conceptTag}
                    </span>
                    {currentQuestion.figureRef && (
                        <span style={{ padding: '5px 12px', borderRadius: DS.radiusPill, backgroundColor: DS.lightOrange, color: DS.highlight, fontSize: '11px', fontWeight: 600, fontFamily: DS.font }}>
                            📐 {currentQuestion.figureRef}
                        </span>
                    )}
                </div>

                {/* Question */}
                <h2 style={{ fontFamily: DS.font, fontSize: '17px', fontWeight: 700, color: DS.textDark, margin: '0 0 20px 0', lineHeight: 1.65, animation: 'slideInRight 0.45s ease-out' }}>
                    <span style={{ color: DS.primary, fontWeight: 800 }}>Q{currentQ + 1}.</span>{' '}{currentQuestion.question}
                </h2>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                    {currentQuestion.options.map((opt, idx) => (
                        <div key={opt.id} onClick={() => handleSelectAnswer(opt.id)}
                            onMouseEnter={() => !isAnswered && setHoveredOption(opt.id)}
                            onMouseLeave={() => setHoveredOption(null)}
                            style={optStyle(opt.id, idx)}>
                            <div style={lblStyle(opt.id)}>
                                {isAnswered && opt.id === currentQuestion.correctAnswer ? <Check size={17} strokeWidth={3} />
                                    : isAnswered && opt.id === selectedAnswer && opt.id !== currentQuestion.correctAnswer ? <X size={17} strokeWidth={3} />
                                        : opt.id.toUpperCase()}
                            </div>
                            <span style={{ fontFamily: DS.font, fontSize: '14px', fontWeight: 500, color: isAnswered ? (opt.id === currentQuestion.correctAnswer ? DS.correct : opt.id === selectedAnswer ? DS.incorrect : DS.gray300) : DS.textDark, lineHeight: 1.5, transition: 'color 0.28s ease' }}>
                                {opt.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Explanation */}
                {showExplanation && quizConfig.showExplanations && (
                    <div style={{ padding: '16px 18px', borderRadius: DS.radiusMd, backgroundColor: answers[currentQ]?.correct ? DS.correctBg : DS.incorrectBg, border: `1.5px solid ${answers[currentQ]?.correct ? DS.correctBorder : DS.incorrectBorder}`, animation: 'fadeInUp 0.45s ease-out', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: answers[currentQ]?.correct ? DS.correct : DS.incorrect, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'popIn 0.4s ease-out' }}>
                                {answers[currentQ]?.correct ? <Check size={14} color={DS.white} strokeWidth={3} /> : <X size={14} color={DS.white} strokeWidth={3} />}
                            </div>
                            <span style={{ fontFamily: DS.font, fontSize: '14px', fontWeight: 700, color: answers[currentQ]?.correct ? DS.correct : DS.incorrect }}>
                                {answers[currentQ]?.correct ? 'Correct! Well done!' : 'Not quite right.'}
                            </span>
                        </div>
                        <p style={{ fontFamily: DS.font, fontSize: '13px', color: DS.textMuted, margin: 0, lineHeight: 1.75 }}>
                            💡 {currentQuestion.explanation}
                        </p>
                    </div>
                )}

                {/* Next */}
                {isAnswered && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', animation: 'fadeInUp 0.4s ease-out 0.2s both' }}>
                        {renderPillBtn(
                            currentQ < totalQuestions - 1 ? 'Next Question' : 'See Results',
                            handleNext,
                            currentQ < totalQuestions - 1 ? 'contained' : 'highlight',
                            'next',
                            <ChevronRight size={17} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    // ═══════════ RESULT SCREEN ═══════════

    const renderResultScreen = () => {
        const pct = Math.round((score / totalQuestions) * 100);
        const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🌟' : pct >= 50 ? '👍' : '📚';
        const msg = pct === 100 ? 'Perfect Score! Outstanding!' : pct >= 70 ? 'Great Job! Well Done!' : pct >= 50 ? 'Good Effort! Keep Practising!' : 'Keep Learning! You Can Do Better!';

        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                {/* Confetti — pointerEvents none */}
                {confettiPieces.map(p => (
                    <div key={p.id} style={{ position: 'absolute', top: '-20px', left: `${p.left}%`, width: `${p.size}px`, height: `${p.size}px`, backgroundColor: p.color, borderRadius: p.id % 4 === 0 ? '50%' : p.id % 4 === 1 ? '2px' : '0', clipPath: p.id % 4 === 2 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none', animation: `confettiFall ${2 + p.delay}s ease-in ${p.delay * 0.25}s both`, pointerEvents: 'none' as const, zIndex: 0 }} />
                ))}

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '58px', marginBottom: '14px', animation: 'bounceIn 0.7s ease-out 0.15s both' }}>{emoji}</div>

                    <h2 style={{ fontFamily: DS.font, fontSize: '24px', fontWeight: 800, color: DS.textDark, margin: '0 0 6px 0', animation: 'fadeInUp 0.55s ease-out 0.3s both' }}>{msg}</h2>
                    <p style={{ fontFamily: DS.font, fontSize: '13px', color: DS.textMuted, margin: '0 0 24px 0', animation: 'fadeInUp 0.55s ease-out 0.4s both' }}>{quizConfig.quizSubtitle}</p>

                    {/* Score circle */}
                    <div style={{ width: '130px', height: '130px', borderRadius: '50%', background: DS.gradientWarm, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: 'bounceIn 0.7s ease-out 0.5s both', boxShadow: `0 14px 40px ${DS.primaryDeep}40` }}>
                        <span style={{ fontFamily: DS.font, fontSize: '38px', fontWeight: 800, color: DS.white, lineHeight: 1 }}>{score}/{totalQuestions}</span>
                        <span style={{ fontFamily: DS.font, fontSize: '12px', color: 'rgba(255,255,255,0.82)', fontWeight: 600, marginTop: '3px' }}>{pct}%</span>
                    </div>

                    {/* Answer dots */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '7px', marginBottom: '24px', animation: 'fadeInUp 0.55s ease-out 0.65s both' }}>
                        {questions.map((_, i) => {
                            const a = answers[i];
                            return (
                                <div key={i} style={{ width: '34px', height: '34px', borderRadius: DS.radiusSm, backgroundColor: a?.correct ? DS.correct : DS.incorrect, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: `popIn 0.3s ease-out ${0.75 + i * 0.06}s both`, boxShadow: `0 2px 8px ${a?.correct ? DS.correct : DS.incorrect}30` }}>
                                    {a?.correct ? <Check size={15} color={DS.white} strokeWidth={3} /> : <X size={15} color={DS.white} strokeWidth={3} />}
                                </div>
                            );
                        })}
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '26px', animation: 'fadeInUp 0.55s ease-out 0.85s both' }}>
                        <div style={{ padding: '10px 22px', borderRadius: DS.radiusMd, backgroundColor: DS.correctBg, border: `1.5px solid ${DS.correctBorder}`, textAlign: 'center' }}>
                            <div style={{ fontFamily: DS.font, fontSize: '20px', fontWeight: 800, color: DS.correct }}>{score}</div>
                            <div style={{ fontFamily: DS.font, fontSize: '11px', color: DS.correct, fontWeight: 600 }}>Correct</div>
                        </div>
                        <div style={{ padding: '10px 22px', borderRadius: DS.radiusMd, backgroundColor: DS.incorrectBg, border: `1.5px solid ${DS.incorrectBorder}`, textAlign: 'center' }}>
                            <div style={{ fontFamily: DS.font, fontSize: '20px', fontWeight: 800, color: DS.incorrect }}>{totalQuestions - score}</div>
                            <div style={{ fontFamily: DS.font, fontSize: '11px', color: DS.incorrect, fontWeight: 600 }}>Incorrect</div>
                        </div>
                    </div>

                    {renderPillBtn('Try Again', () => { setConfettiPieces([]); handleStartQuiz(); }, 'contained', 'retry', <RotateCcw size={16} />, false, '1s')}
                </div>
            </div>
        );
    };

    // ═══════════ MAIN RENDER ═══════════

    return (
        <div style={{
            width: `${config.width}px`, maxWidth: '100%', height: `${config.height}px`,
            background: DS.white,
            backgroundImage: `radial-gradient(circle at 10% 90%, ${DS.lightPurple}18 0%, transparent 45%), radial-gradient(circle at 90% 10%, ${DS.lightOrange}40 0%, transparent 45%)`,
            borderRadius: DS.radiusCard, overflow: 'hidden',
            boxShadow: `0 20px 60px -15px ${DS.primary}18, 0 0 0 1px ${DS.lightPurple}40`,
            fontFamily: DS.font, position: 'relative', display: 'flex', flexDirection: 'column',
        }}>
            {screen === 'start' && renderStartScreen()}
            {screen === 'quiz' && renderQuizScreen()}
            {screen === 'result' && renderResultScreen()}
        </div>
    );
};

export default PracticeQuestionsQuizTool;

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════════