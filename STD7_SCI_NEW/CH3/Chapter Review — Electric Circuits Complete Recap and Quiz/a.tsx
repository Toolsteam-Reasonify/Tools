// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: electricity_chapter_review_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    BookOpen, Target, Zap, FlaskConical, ChevronLeft, ChevronRight,
    Check, X, Star, Award, RotateCcw, Eye, EyeOff, Plus
} from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================

type ModeType = 'learn' | 'practice' | 'real_world' | 'hands_on';

interface StepDetails {
    currentStep: number;
    totalSteps: number;
    isPaused: boolean;
    currentMode: ModeType;
}

interface StepDataInterface {
    id: number;
    title: string;
    description: string;
    type: 'intro' | 'explanation' | 'practice' | 'real_world' | 'hands_on';
    mode: ModeType;
    data?: any;
}

interface BaseDataInterface {
    themeColor?: string;
    autoPlayDuration?: number;
}

interface ElectricityReviewAdditionalProps {
    showHints?: boolean;
    quizDifficulty?: 'easy' | 'medium' | 'hard';
    focusTopics?: string[];
    symbolSet?: 'all' | 'basic' | 'advanced';
}

interface ElectricityChapterReviewToolProps {
    props?: {
        width?: number;
        height?: number;
        data?: BaseDataInterface;
        steps?: StepDataInterface[];
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
        additionalProps?: ElectricityReviewAdditionalProps;
    };
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DESIGN SYSTEM TOKENS ====================

const DS = {
    primary: '#4A4DC9',
    primaryDark: '#533086',
    accent: '#FF7212',
    accentWarm: '#FC9145',
    primaryLight: '#C1C1EA',
    primaryLighter: '#E8E8F5',
    accentLight: '#FFF3E4',
    accentLighter: '#FFF9F2',
    neutral900: '#4E4E4E',
    neutral500: '#CACACA',
    neutral300: '#EBEBEB',
    neutral100: '#F5F5F5',
    white: '#FFFFFF',
    correct: '#22A06B',
    correctBg: '#DFFDD0',
    wrong: '#E34935',
    wrongBg: '#FFE5E0',
    gradientPrimary: 'linear-gradient(135deg, #533086 0%, #4A4DC9 50%, #FC9145 100%)',
    gradientSubtle: 'linear-gradient(135deg, #533086 0%, #FC9145 100%)',
    gradientWarm: 'linear-gradient(135deg, #FF7212 0%, #FC9145 100%)',
    gradientCool: 'linear-gradient(135deg, #4A4DC9 0%, #533086 100%)',
    fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif",
    radiusPill: '999px',
    radiusLg: '16px',
    radiusMd: '12px',
    radiusSm: '8px',
    shadowSm: '0 2px 8px rgba(74, 77, 201, 0.08)',
    shadowMd: '0 4px 16px rgba(74, 77, 201, 0.12)',
    shadowLg: '0 8px 32px rgba(74, 77, 201, 0.16)',
    shadowAccent: '0 4px 16px rgba(255, 114, 18, 0.25)',
    shadowPrimary: '0 4px 16px rgba(74, 77, 201, 0.3)',
};

// ==================== CIRCUIT SYMBOLS DATA ====================

interface CircuitSymbol {
    id: string;
    name: string;
    description: string;
    terminalInfo: string;
    svgDraw: (color: string, accent: string) => React.ReactNode;
}

const CIRCUIT_SYMBOLS: CircuitSymbol[] = [
    {
        id: 'cell', name: 'Electric Cell',
        description: 'A portable source of electrical energy with two terminals.',
        terminalInfo: 'Long line = Positive (+), Short line = Negative (−)',
        svgDraw: (c, a) => (
            <svg viewBox="0 0 100 60" width="90" height="54">
                <line x1="10" y1="30" x2="38" y2="30" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="42" y1="10" x2="42" y2="50" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="52" y1="18" x2="52" y2="42" stroke={c} strokeWidth="4.5" strokeLinecap="round" />
                <line x1="56" y1="30" x2="90" y2="30" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
                <text x="40" y="7" fill={a} fontSize="10" fontWeight="700" textAnchor="middle">+</text>
                <text x="54" y="7" fill={DS.neutral500} fontSize="10" fontWeight="700" textAnchor="middle">−</text>
            </svg>
        )
    },
    {
        id: 'battery', name: 'Battery',
        description: 'Two or more cells connected together. Positive of one to negative of the next.',
        terminalInfo: 'Multiple long-short line pairs in series',
        svgDraw: (c, a) => (
            <svg viewBox="0 0 120 60" width="108" height="54">
                <line x1="5" y1="30" x2="28" y2="30" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="32" y1="10" x2="32" y2="50" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="40" y1="18" x2="40" y2="42" stroke={c} strokeWidth="4.5" strokeLinecap="round" />
                <line x1="48" y1="10" x2="48" y2="50" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="56" y1="18" x2="56" y2="42" stroke={c} strokeWidth="4.5" strokeLinecap="round" />
                <line x1="60" y1="30" x2="115" y2="30" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
                <text x="30" y="7" fill={a} fontSize="10" fontWeight="700" textAnchor="middle">+</text>
                <text x="58" y="7" fill={DS.neutral500} fontSize="10" fontWeight="700" textAnchor="middle">−</text>
            </svg>
        )
    },
    {
        id: 'lamp', name: 'Electric Lamp',
        description: 'Incandescent lamp with filament that glows when current passes through it.',
        terminalInfo: 'Circle with cross — two terminals at the base',
        svgDraw: (c) => (
            <svg viewBox="0 0 80 80" width="64" height="64">
                <circle cx="40" cy="40" r="18" fill="none" stroke={c} strokeWidth="2.5" />
                <line x1="27" y1="27" x2="53" y2="53" stroke={c} strokeWidth="2" strokeLinecap="round" />
                <line x1="53" y1="27" x2="27" y2="53" stroke={c} strokeWidth="2" strokeLinecap="round" />
                <line x1="0" y1="40" x2="22" y2="40" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="58" y1="40" x2="80" y2="40" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        )
    },
    {
        id: 'led', name: 'LED',
        description: 'Current passes in one direction only. Positive (longer wire) to negative (shorter wire).',
        terminalInfo: 'Triangle + bar with arrows. + on triangle side, − on bar side',
        svgDraw: (c, a) => (
            <svg viewBox="0 0 100 70" width="86" height="60">
                <line x1="5" y1="35" x2="35" y2="35" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
                <polygon points="35,16 35,54 58,35" fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round" />
                <line x1="58" y1="16" x2="58" y2="54" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="58" y1="35" x2="95" y2="35" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="50" y1="12" x2="57" y2="5" stroke={a} strokeWidth="1.8" strokeLinecap="round" />
                <polygon points="57,5 53,9 55,5" fill={a} />
                <line x1="55" y1="16" x2="62" y2="9" stroke={a} strokeWidth="1.8" strokeLinecap="round" />
                <polygon points="62,9 58,13 60,9" fill={a} />
                <text x="28" y="66" fill={a} fontSize="9" fontWeight="700" textAnchor="middle">+</text>
                <text x="68" y="66" fill={DS.neutral500} fontSize="9" fontWeight="700" textAnchor="middle">−</text>
            </svg>
        )
    },
    {
        id: 'switch_on', name: 'Switch (ON)',
        description: 'Completes the circuit — current can flow. Circuit is closed.',
        terminalInfo: 'Two dots connected by a line',
        svgDraw: (c) => (
            <svg viewBox="0 0 100 50" width="86" height="43">
                <line x1="5" y1="30" x2="30" y2="30" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="30" cy="30" r="4" fill={c} />
                <line x1="30" y1="30" x2="70" y2="30" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="70" cy="30" r="4" fill={c} />
                <line x1="70" y1="30" x2="95" y2="30" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        )
    },
    {
        id: 'switch_off', name: 'Switch (OFF)',
        description: 'Breaks the circuit — current cannot flow. Circuit is open.',
        terminalInfo: 'Two dots with a gap (angled line)',
        svgDraw: (c, a) => (
            <svg viewBox="0 0 100 50" width="86" height="43">
                <line x1="5" y1="30" x2="30" y2="30" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="30" cy="30" r="4" fill={c} />
                <line x1="30" y1="30" x2="58" y2="12" stroke={a} strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="70" cy="30" r="4" fill={c} />
                <line x1="70" y1="30" x2="95" y2="30" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        )
    },
    {
        id: 'wire', name: 'Wire',
        description: 'Connects components in a circuit. Made of conductors like copper.',
        terminalInfo: 'Simple straight line',
        svgDraw: (c) => (
            <svg viewBox="0 0 100 20" width="86" height="17">
                <line x1="5" y1="10" x2="95" y2="10" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        )
    }
];

// ==================== QUIZ DATA ====================

interface QuizQuestion { id: number; question: string; options: string[]; correctIndex: number; explanation: string; hint: string; topic: string; }

const QUIZ_QUESTIONS: QuizQuestion[] = [
    { id: 1, question: 'In the symbol for an electric cell, which line represents the positive terminal?', options: ['The short thick line', 'The long thin line', 'Both lines are the same', 'Neither line'], correctIndex: 1, explanation: 'In a cell symbol, the longer thin line represents the positive (+) terminal and the shorter thick line represents the negative (−) terminal.', hint: 'Think about which terminal has the protruding metal cap.', topic: 'Circuit Symbols' },
    { id: 2, question: 'What happens when a circuit is "open" (switch OFF)?', options: ['Current flows normally', 'Lamp glows brighter', 'Current cannot flow — there is a gap', 'Battery charges up'], correctIndex: 2, explanation: 'When the switch is OFF, the circuit is open. A gap prevents current from flowing.', hint: 'Think about what "open" means — is the path complete?', topic: 'Circuits' },
    { id: 3, question: 'Which of these is an electrical CONDUCTOR?', options: ['Rubber eraser', 'Plastic scale', 'Metal key', 'Glass bangle'], correctIndex: 2, explanation: 'Metals like the material of a key are good conductors. Rubber, plastic, and glass are insulators.', hint: 'Which one is a metal?', topic: 'Conductors & Insulators' },
    { id: 4, question: 'An LED will glow only when:', options: ['Connected in any direction', 'Positive to battery positive, negative to battery negative', 'Its filament is heated', 'Connected to a single cell'], correctIndex: 1, explanation: 'An LED allows current in one direction only. Positive terminal (longer wire) must connect to battery positive.', hint: 'LED has polarity — current flows one way only.', topic: 'LED Polarity' },
    { id: 5, question: 'A lamp connected correctly does not glow. The most likely reason is:', options: ['Wires are too long', 'Lamp filament is broken (fused)', 'Circuit diagram is wrong', 'Switch is painted'], correctIndex: 1, explanation: 'A broken filament stops current flow, creating an open circuit inside the lamp.', hint: 'What inside the lamp must be intact for current to pass?', topic: 'Fused Lamp' },
    { id: 6, question: 'The direction of electric current in a circuit is taken to be:', options: ['From negative to positive terminal', 'From positive to negative terminal', 'In any direction', 'Only through the lamp'], correctIndex: 1, explanation: 'By convention, current direction is from positive (+) to negative (−) terminal.', hint: 'Convention — think positive to negative.', topic: 'Current Direction' }
];

// ==================== REAL WORLD DATA ====================

interface RealWorldExample { id: number; title: string; device: string; description: string; components: string[]; circuitNote: string; emoji: string; }

const REAL_WORLD_EXAMPLES: RealWorldExample[] = [
    { id: 1, title: 'Torchlight', device: 'Torch / Flashlight', emoji: '🔦', description: 'Uses cells, a switch, wires, and a lamp to produce light.', components: ['Battery (2+ cells)', 'Slide switch', 'LED/incandescent lamp', 'Metal body as wire'], circuitNote: 'Slide switch ON → circuit closes → current flows through lamp.' },
    { id: 2, title: 'Room Light', device: 'Wall Switch + Ceiling Lamp', emoji: '💡', description: 'Uses AC power, wall switch, and ceiling lamp.', components: ['AC mains supply', 'Wall switch', 'Ceiling lamp', 'Insulated wires'], circuitNote: 'Wall switch works like our simple switch — completes or breaks circuit.' },
    { id: 3, title: 'Doorbell', device: 'Doorbell + Push Button', emoji: '🔔', description: 'Push-button switch completes the circuit to ring the bell.', components: ['Battery/AC supply', 'Push-button switch', 'Buzzer/bell', 'Wires'], circuitNote: 'Push button stays ON only while pressed, then springs back OFF.' },
    { id: 4, title: 'Solar Light', device: 'Solar-powered LED', emoji: '🌞', description: 'Solar panel charges battery by day; LED lights up at night.', components: ['Solar panel', 'Rechargeable battery', 'LED lamp', 'Light sensor (auto switch)'], circuitNote: 'Light sensor = automatic switch — closes circuit when dark!' }
];

// ==================== HANDS-ON ACTIVITIES ====================

interface HandsOnActivity { id: number; title: string; materials: string[]; steps: string[]; safetyNote: string; emoji: string; }

const HANDS_ON_ACTIVITIES: HandsOnActivity[] = [
    { id: 1, title: 'Build a Circuit', emoji: '🔋', materials: ['1 cell (AA/D)', 'Torch lamp/LED', 'Cell holder', '2 wires'], steps: ['Place cell in holder with (−) towards spring.', 'Connect one wire from cell holder to one lamp terminal.', 'Connect other wire to other lamp terminal.', 'Observe: lamp glows = complete circuit!'], safetyNote: 'Use only cells/batteries. Never use mains power!' },
    { id: 2, title: 'Make a Switch', emoji: '🔧', materials: ['2 drawing pins', '1 safety pin/paper clip', 'Cardboard', '2 wires'], steps: ['Push pin through safety pin ring into cardboard.', 'Push second pin nearby so safety pin can touch it.', 'Connect a wire to each drawing pin.', 'Rotate safety pin to turn ON/OFF!'], safetyNote: 'Handle drawing pins carefully.' },
    { id: 3, title: 'Test Conductors', emoji: '🔍', materials: ['Cell + lamp tester', 'Spoon, ruler, coin, eraser, key, foil'], steps: ['Build tester with two free wire ends.', 'Touch free ends together — lamp should glow.', 'Touch ends to each object.', 'Record: glows = conductor, no glow = insulator.'], safetyNote: 'Do not test objects connected to mains.' },
    { id: 4, title: 'Draw Diagrams', emoji: '✏️', materials: ['Paper', 'Pencil', 'Ruler', 'Table 3.2 reference'], steps: ['Draw each symbol: cell, battery, lamp, LED, switches, wire.', 'Draw circuit with cell, switch, and lamp.', 'Draw circuit with LED — mark + and −.', 'Compare with Fig. 3.14 in textbook.'], safetyNote: 'Paper activity — no electrical components needed!' }
];

// ==================== GEOMETRIC DECORATION ====================

const GeoDecor: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
    <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute', opacity: 0.08, pointerEvents: 'none', ...style }}>
        <circle cx="30" cy="30" r="24" fill="none" stroke={DS.primaryLight} strokeWidth="2" />
        <polygon points="75,10 100,55 50,55" fill="none" stroke={DS.accentWarm} strokeWidth="2" />
        <rect x="65" y="70" width="40" height="40" rx="4" fill="none" stroke={DS.primaryLight} strokeWidth="2" />
        <circle cx="25" cy="95" r="18" fill="none" stroke={DS.accentWarm} strokeWidth="2" />
    </svg>
);

// ==================== MAIN COMPONENT ====================

const ElectricityChapterReviewTool: React.FC<ElectricityChapterReviewToolProps> = ({ props = {}, setStepDetails }) => {
    const width = props.width || 800;
    const height = props.height || 600;
    const showModeSelector = props.showModeSelector !== false;
    const enabledModes = props.enabledModes || ['learn', 'practice', 'real_world', 'hands_on'];
    const additionalProps = props.additionalProps || {};
    const { showHints: defaultShowHints = true } = additionalProps as ElectricityReviewAdditionalProps;

    const [currentMode, setCurrentMode] = useState<ModeType>(props.initialMode || 'learn');
    const [animKey, setAnimKey] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
    const [showHints] = useState(defaultShowHints);
    const [hintVisible, setHintVisible] = useState(false);
    const [quizComplete, setQuizComplete] = useState(false);
    const [selectedExample, setSelectedExample] = useState(0);
    const [selectedActivity, setSelectedActivity] = useState(0);
    const [expandedStep, setExpandedStep] = useState<number | null>(null);
    const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

    useEffect(() => {
        const fl = document.createElement('link');
        fl.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';
        fl.rel = 'stylesheet';
        document.head.appendChild(fl);
        const id = 'sg-elec-kf';
        if (!document.getElementById(id)) {
            const s = document.createElement('style');
            s.id = id;
            s.textContent = `
        @keyframes sg-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sg-left{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes sg-right{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes sg-pop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
        @keyframes sg-slide{from{opacity:0;max-height:0}to{opacity:1;max-height:400px}}
        @keyframes sg-ok{0%{transform:scale(1)}40%{transform:scale(1.12)}100%{transform:scale(1)}}
        @keyframes sg-no{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
        @keyframes sg-star{from{transform:rotate(0deg) scale(0)}to{transform:rotate(360deg) scale(1)}}
        @keyframes sg-c1{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(-100px) rotate(720deg);opacity:0}}
        @keyframes sg-c2{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(-80px) translateX(35px) rotate(540deg);opacity:0}}
        @keyframes sg-c3{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(-70px) translateX(-25px) rotate(360deg);opacity:0}}
      `;
            document.head.appendChild(s);
        }
        return () => { document.head.removeChild(fl); };
    }, []);

    useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

    const switchMode = useCallback((mode: ModeType) => {
        setCurrentMode(mode); setAnimKey(k => k + 1); setSelectedSymbol(null); setHintVisible(false);
    }, []);

    useEffect(() => {
        if (setStepDetails) setStepDetails({ currentStep: currentQuestion + 1, totalSteps: QUIZ_QUESTIONS.length, isPaused: true, currentMode });
    }, [currentMode, currentQuestion, setStepDetails]);

    const handleAnswer = useCallback((i: number) => {
        if (showResult) return;
        setSelectedAnswer(i); setShowResult(true);
        if (i === QUIZ_QUESTIONS[currentQuestion].correctIndex && !answeredQuestions.has(currentQuestion)) setScore(s => s + 1);
        setAnsweredQuestions(p => new Set(p).add(currentQuestion));
    }, [showResult, currentQuestion, answeredQuestions]);

    const nextQuestion = useCallback(() => {
        if (currentQuestion < QUIZ_QUESTIONS.length - 1) { setCurrentQuestion(q => q + 1); setSelectedAnswer(null); setShowResult(false); setHintVisible(false); setAnimKey(k => k + 1); }
        else setQuizComplete(true);
    }, [currentQuestion]);

    const resetQuiz = useCallback(() => {
        setCurrentQuestion(0); setSelectedAnswer(null); setShowResult(false); setScore(0); setAnsweredQuestions(new Set()); setQuizComplete(false); setHintVisible(false); setAnimKey(k => k + 1);
    }, []);

    const modes: { key: ModeType; label: string; icon: React.ReactNode }[] = [
        { key: 'learn', label: 'Learn', icon: <BookOpen size={15} /> },
        { key: 'practice', label: 'Practice', icon: <Target size={15} /> },
        { key: 'real_world', label: 'Real World', icon: <Zap size={15} /> },
        { key: 'hands_on', label: 'Hands-On', icon: <FlaskConical size={15} /> },
    ];
    const filteredModes = modes.filter(m => enabledModes.includes(m.key));

    // ====== PILL BUTTON ======
    const Pill: React.FC<{ children: React.ReactNode; variant?: 'contained' | 'outlined' | 'highlight' | 'texted'; onClick?: () => void; disabled?: boolean; icon?: React.ReactNode; sx?: React.CSSProperties; bid?: string }> = ({ children, variant = 'contained', onClick, disabled, icon, sx, bid }) => {
        const h = hoveredBtn === bid;
        let bg = DS.primary, co = DS.white, bd = 'none', sh = DS.shadowPrimary;
        if (variant === 'outlined') { bg = DS.white; co = DS.primary; bd = `2px solid ${DS.primary}`; sh = DS.shadowSm; }
        if (variant === 'highlight') { bg = DS.accent; co = DS.white; sh = DS.shadowAccent; }
        if (variant === 'texted') { bg = 'transparent'; co = DS.primary; sh = 'none'; }
        if (disabled) { bg = DS.neutral300; co = DS.neutral500; bd = variant === 'outlined' ? `2px solid ${DS.neutral500}` : 'none'; sh = 'none'; }
        return (
            <button onClick={disabled ? undefined : onClick} onMouseEnter={() => bid && setHoveredBtn(bid)} onMouseLeave={() => setHoveredBtn(null)} disabled={disabled}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 24px', height: 40, borderRadius: DS.radiusPill, background: bg, color: co, border: bd, cursor: disabled ? 'default' : 'pointer', fontFamily: DS.fontFamily, fontSize: 13, fontWeight: 600, letterSpacing: '0.01em', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)', transform: h && !disabled ? 'scale(1.04)' : 'scale(1)', boxShadow: h && !disabled ? sh : 'none', opacity: disabled ? 0.6 : 1, ...sx }}>
                {icon}{children}
            </button>
        );
    };

    // ====== LEARN MODE ======
    const renderLearn = () => (
        <div key={`l-${animKey}`} style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'sg-up 0.45s ease both' }}>
            <div style={{ textAlign: 'center', marginBottom: 2 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: DS.primaryDark, margin: 0, fontFamily: DS.fontFamily }}>Circuit Symbols & Key Concepts</h2>
                <p style={{ fontSize: 12, color: DS.neutral900, margin: '4px 0 0', opacity: 0.65 }}>Tap any card for details • All 7 symbols from Table 3.2</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', gap: 10 }}>
                {CIRCUIT_SYMBOLS.map((sym, i) => {
                    const sel = selectedSymbol === sym.id, hov = hoveredBtn === `s-${sym.id}`;
                    return (
                        <div key={sym.id} onClick={() => setSelectedSymbol(sel ? null : sym.id)} onMouseEnter={() => setHoveredBtn(`s-${sym.id}`)} onMouseLeave={() => setHoveredBtn(null)}
                            style={{ background: sel ? `linear-gradient(145deg, ${DS.primaryLighter}, ${DS.accentLight})` : DS.white, border: `2px solid ${sel ? DS.primary : hov ? DS.primaryLight : DS.neutral300}`, borderRadius: DS.radiusLg, padding: '14px 10px 10px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', transform: hov ? 'translateY(-3px)' : 'translateY(0)', boxShadow: sel ? DS.shadowLg : hov ? DS.shadowMd : DS.shadowSm, animation: `sg-pop 0.4s ease ${i * 0.06}s both`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', overflow: 'hidden' }}>
                            {sel && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: DS.gradientSubtle }} />}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 46 }}>{sym.svgDraw(DS.primary, DS.accent)}</div>
                            <span style={{ fontSize: 11.5, fontWeight: 700, color: sel ? DS.primaryDark : DS.neutral900, textAlign: 'center', lineHeight: 1.25, fontFamily: DS.fontFamily }}>{sym.name}</span>
                            {sel && (
                                <div style={{ animation: 'sg-slide 0.35s ease both', overflow: 'hidden', width: '100%' }}>
                                    <p style={{ fontSize: 10.5, color: DS.neutral900, margin: '2px 0', textAlign: 'center', lineHeight: 1.45 }}>{sym.description}</p>
                                    <div style={{ fontSize: 10, color: DS.primaryDark, margin: '6px 0 0', background: DS.primaryLighter, padding: '5px 8px', borderRadius: DS.radiusSm, textAlign: 'center', fontWeight: 600, border: `1px solid ${DS.primaryLight}` }}>{sym.terminalInfo}</div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Key Concepts Nutshell */}
            <div style={{ background: DS.gradientPrimary, borderRadius: DS.radiusLg, padding: '16px 18px', color: DS.white, animation: 'sg-up 0.5s ease 0.35s both', position: 'relative', overflow: 'hidden' }}>
                <GeoDecor style={{ top: -20, right: -20, opacity: 0.12 }} />
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6, fontFamily: DS.fontFamily, position: 'relative', zIndex: 1 }}><Star size={15} /> In a Nutshell — Key Concepts</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, fontSize: 11, lineHeight: 1.5, position: 'relative', zIndex: 1 }}>
                    {['An electric cell is a portable source of electrical energy.', 'A battery is two or more cells connected in series.', 'Incandescent lamps have a filament that glows.', 'LEDs allow current in one direction only.', 'A switch completes or breaks a circuit.', 'Current flows from + to − terminal.', 'Conductors allow current; Insulators do not.', 'A circuit diagram uses standard symbols.'].map((p, i) => (
                        <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', animation: `sg-left 0.35s ease ${0.4 + i * 0.05}s both` }}>
                            <span style={{ minWidth: 18, height: 18, borderRadius: DS.radiusPill, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9.5, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                            <span style={{ opacity: 0.92 }}>{p}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // ====== PRACTICE MODE ======
    const renderPractice = () => {
        if (quizComplete) {
            const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
            const g = pct === 100 ? 'Perfect!' : pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good job!' : 'Keep practising!';
            return (
                <div key={`c-${animKey}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 20, animation: 'sg-up 0.45s ease both', minHeight: 340, position: 'relative' }}>
                    <GeoDecor style={{ top: 0, left: 0 }} />
                    <div style={{ position: 'relative' }}>
                        <Award size={56} color={pct >= 80 ? DS.accent : DS.primary} style={{ animation: 'sg-star 0.7s ease both' }} />
                        {pct === 100 && <><span style={{ position: 'absolute', top: -10, left: -18, fontSize: 18, animation: 'sg-c1 1.2s ease 0.3s both' }}>⚡</span><span style={{ position: 'absolute', top: -5, right: -22, fontSize: 16, animation: 'sg-c2 1.3s ease 0.4s both' }}>🌟</span><span style={{ position: 'absolute', top: 12, left: -26, fontSize: 14, animation: 'sg-c3 1.1s ease 0.5s both' }}>✨</span></>}
                    </div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: DS.primaryDark, margin: 0, fontFamily: DS.fontFamily }}>{g}</h2>
                    <div style={{ fontSize: 44, fontWeight: 800, fontFamily: DS.fontFamily, background: pct >= 80 ? DS.gradientWarm : DS.gradientCool, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'sg-pop 0.6s ease 0.2s both' }}>{score}/{QUIZ_QUESTIONS.length}</div>
                    <div style={{ width: 200, height: 8, background: DS.neutral300, borderRadius: DS.radiusPill, overflow: 'hidden' }}><div style={{ height: '100%', borderRadius: DS.radiusPill, background: pct >= 80 ? DS.gradientWarm : DS.gradientCool, width: `${pct}%`, transition: 'width 1s ease 0.3s' }} /></div>
                    <p style={{ fontSize: 13, color: DS.neutral900, textAlign: 'center', maxWidth: 300, lineHeight: 1.5 }}>{pct === 100 ? "You've mastered all concepts!" : pct >= 60 ? 'Review symbols in Learn mode for any missed.' : 'Switch to Learn mode to revise, then try again!'}</p>
                    <Pill variant="contained" onClick={resetQuiz} bid="retry" icon={<RotateCcw size={15} />}>Try Again</Pill>
                </div>
            );
        }
        const q = QUIZ_QUESTIONS[currentQuestion];
        return (
            <div key={`q-${currentQuestion}-${animKey}`} style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'sg-right 0.4s ease both' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 6, background: DS.neutral300, borderRadius: DS.radiusPill, overflow: 'hidden' }}><div style={{ height: '100%', borderRadius: DS.radiusPill, background: DS.gradientSubtle, width: `${((currentQuestion + (showResult ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%`, transition: 'width 0.5s ease' }} /></div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: DS.primary, fontFamily: DS.fontFamily }}>{currentQuestion + 1}/{QUIZ_QUESTIONS.length}</span>
                    <span style={{ fontSize: 10.5, background: DS.accentLight, color: DS.accent, padding: '3px 10px', borderRadius: DS.radiusPill, fontWeight: 700, fontFamily: DS.fontFamily }}>Score: {score}</span>
                </div>
                <span style={{ alignSelf: 'flex-start', fontSize: 10, padding: '3px 12px', borderRadius: DS.radiusPill, background: DS.primaryLighter, color: DS.primary, fontWeight: 600, fontFamily: DS.fontFamily, animation: 'sg-left 0.3s ease 0.1s both' }}>{q.topic}</span>
                <div style={{ background: DS.white, borderRadius: DS.radiusLg, padding: '16px 18px', border: `1.5px solid ${DS.neutral300}`, boxShadow: DS.shadowSm }}>
                    <h3 style={{ fontSize: 14.5, fontWeight: 600, color: DS.neutral900, margin: 0, lineHeight: 1.55, fontFamily: DS.fontFamily }}>{q.question}</h3>
                </div>
                {showHints && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Pill variant="texted" onClick={() => setHintVisible(!hintVisible)} bid="ht" icon={hintVisible ? <EyeOff size={13} /> : <Eye size={13} />} sx={{ padding: '4px 10px', height: 30, fontSize: 11 }}>{hintVisible ? 'Hide Hint' : 'Show Hint'}</Pill>
                        {hintVisible && <span style={{ fontSize: 11, color: '#92400e', background: DS.accentLight, padding: '4px 12px', borderRadius: DS.radiusPill, animation: 'sg-left 0.3s ease both', fontStyle: 'italic', fontFamily: DS.fontFamily, border: `1px solid ${DS.accentWarm}33` }}>💡 {q.hint}</span>}
                    </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {q.options.map((opt, i) => {
                        const ic = i === q.correctIndex, is = selectedAnswer === i, ih = hoveredBtn === `o-${i}`;
                        let bg = DS.white, bd = DS.neutral300, co = DS.neutral900, an = '';
                        if (showResult) { if (ic) { bg = DS.correctBg; bd = DS.correct; co = '#065f46'; an = is ? 'sg-ok 0.4s ease' : ''; } else if (is) { bg = DS.wrongBg; bd = DS.wrong; co = '#991b1b'; an = 'sg-no 0.45s ease'; } }
                        return (
                            <button key={i} onClick={() => handleAnswer(i)} onMouseEnter={() => !showResult && setHoveredBtn(`o-${i}`)} onMouseLeave={() => setHoveredBtn(null)} disabled={showResult}
                                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderRadius: DS.radiusMd, background: bg, border: `2px solid ${ih && !showResult ? DS.primary : bd}`, color: co, fontSize: 13, fontWeight: 500, textAlign: 'left', cursor: showResult ? 'default' : 'pointer', fontFamily: DS.fontFamily, lineHeight: 1.4, transition: 'all 0.25s ease', transform: ih && !showResult ? 'translateX(4px)' : 'translateX(0)', animation: an || `sg-up 0.3s ease ${0.1 + i * 0.07}s both`, opacity: showResult && !ic && !is ? 0.45 : 1, boxShadow: ih && !showResult ? DS.shadowMd : 'none' }}>
                                <span style={{ width: 28, height: 28, borderRadius: DS.radiusPill, background: showResult && ic ? DS.correct : showResult && is ? DS.wrong : ih && !showResult ? DS.primary : DS.primaryLighter, color: (showResult && (ic || is)) || (ih && !showResult) ? DS.white : DS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, transition: 'all 0.25s ease', fontFamily: DS.fontFamily }}>
                                    {showResult && ic ? <Check size={14} /> : showResult && is && !ic ? <X size={14} /> : String.fromCharCode(65 + i)}
                                </span>
                                {opt}
                            </button>
                        );
                    })}
                </div>
                {showResult && (
                    <div style={{ animation: 'sg-up 0.35s ease both' }}>
                        <div style={{ background: selectedAnswer === q.correctIndex ? DS.correctBg : DS.wrongBg, borderRadius: DS.radiusMd, padding: '12px 14px', marginBottom: 10, border: `1px solid ${selectedAnswer === q.correctIndex ? DS.correct : DS.wrong}30` }}>
                            <p style={{ fontSize: 12, color: selectedAnswer === q.correctIndex ? '#065f46' : '#991b1b', margin: 0, lineHeight: 1.55, fontWeight: 500, fontFamily: DS.fontFamily }}>
                                {selectedAnswer === q.correctIndex ? '✅ Correct! ' : '❌ Not quite. '}{q.explanation}
                            </p>
                        </div>
                        <div style={{ textAlign: 'center' }}><Pill variant="contained" onClick={nextQuestion} bid="nq" icon={<ChevronRight size={15} />}>{currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'See Results'}</Pill></div>
                    </div>
                )}
            </div>
        );
    };

    // ====== REAL WORLD MODE ======
    const renderRealWorld = () => {
        const ex = REAL_WORLD_EXAMPLES[selectedExample];
        return (
            <div key={`r-${animKey}`} style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'sg-up 0.45s ease both' }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: DS.primaryDark, margin: 0, textAlign: 'center', fontFamily: DS.fontFamily }}>Circuits in Everyday Life</h2>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {REAL_WORLD_EXAMPLES.map((it, i) => (
                        <Pill key={it.id} variant={i === selectedExample ? 'contained' : 'outlined'} onClick={() => { setSelectedExample(i); setAnimKey(k => k + 1); }} bid={`r-${i}`} sx={{ animation: `sg-pop 0.4s ease ${i * 0.07}s both`, fontSize: 12, padding: '8px 16px', height: 36 }}>{it.emoji} {it.title}</Pill>
                    ))}
                </div>
                <div key={`rc-${selectedExample}`} style={{ background: DS.white, borderRadius: DS.radiusLg, overflow: 'hidden', border: `1.5px solid ${DS.neutral300}`, boxShadow: DS.shadowMd, animation: 'sg-right 0.4s ease both' }}>
                    <div style={{ background: DS.gradientPrimary, padding: '18px 20px', color: DS.white, position: 'relative', overflow: 'hidden' }}>
                        <GeoDecor style={{ top: -30, right: -30, opacity: 0.15 }} />
                        <div style={{ fontSize: 32, marginBottom: 4, position: 'relative', zIndex: 1 }}>{ex.emoji}</div>
                        <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, fontFamily: DS.fontFamily, position: 'relative', zIndex: 1 }}>{ex.device}</h3>
                        <p style={{ fontSize: 12, margin: '6px 0 0', opacity: 0.88, lineHeight: 1.5, position: 'relative', zIndex: 1 }}>{ex.description}</p>
                    </div>
                    <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: DS.primary, margin: '0 0 8px', fontFamily: DS.fontFamily }}>🔧 Circuit Components</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {ex.components.map((c, i) => <span key={i} style={{ padding: '5px 12px', borderRadius: DS.radiusPill, background: DS.primaryLighter, color: DS.primaryDark, fontSize: 11, fontWeight: 600, fontFamily: DS.fontFamily, border: `1px solid ${DS.primaryLight}`, animation: `sg-left 0.3s ease ${0.15 + i * 0.07}s both` }}>{c}</span>)}
                            </div>
                        </div>
                        <div style={{ background: DS.accentLight, borderRadius: DS.radiusMd, padding: '12px 14px', border: `1px solid ${DS.accentWarm}30` }}>
                            <p style={{ fontSize: 12, color: '#92400e', margin: 0, lineHeight: 1.5, fontWeight: 500, fontFamily: DS.fontFamily }}>⚡ <strong>How it works:</strong> {ex.circuitNote}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ====== HANDS-ON MODE ======
    const renderHandsOn = () => {
        const act = HANDS_ON_ACTIVITIES[selectedActivity];
        return (
            <div key={`h-${animKey}`} style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'sg-up 0.45s ease both' }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: DS.primaryDark, margin: 0, textAlign: 'center', fontFamily: DS.fontFamily }}>Hands-On Revision Activities</h2>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {HANDS_ON_ACTIVITIES.map((it, i) => (
                        <Pill key={it.id} variant={i === selectedActivity ? 'contained' : 'outlined'} onClick={() => { setSelectedActivity(i); setExpandedStep(null); setAnimKey(k => k + 1); }} bid={`h-${i}`} sx={{ animation: `sg-pop 0.4s ease ${i * 0.07}s both`, fontSize: 11, padding: '7px 14px', height: 34 }}>{it.emoji} {it.title}</Pill>
                    ))}
                </div>
                <div key={`hc-${selectedActivity}`} style={{ background: DS.white, borderRadius: DS.radiusLg, overflow: 'hidden', border: `1.5px solid ${DS.neutral300}`, boxShadow: DS.shadowMd, animation: 'sg-right 0.4s ease both' }}>
                    <div style={{ background: DS.gradientCool, padding: '15px 18px', color: DS.white, position: 'relative', overflow: 'hidden' }}>
                        <GeoDecor style={{ top: -25, right: -25, opacity: 0.12 }} />
                        <div style={{ fontSize: 28, marginBottom: 2, position: 'relative', zIndex: 1 }}>{act.emoji}</div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: DS.fontFamily, position: 'relative', zIndex: 1 }}>{act.title}</h3>
                    </div>
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: DS.primary, margin: '0 0 6px', fontFamily: DS.fontFamily }}>📦 Materials</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                {act.materials.map((m, i) => <span key={i} style={{ padding: '4px 10px', borderRadius: DS.radiusSm, background: DS.primaryLighter, color: DS.primaryDark, fontSize: 10.5, fontWeight: 500, fontFamily: DS.fontFamily, border: `1px solid ${DS.primaryLight}`, animation: `sg-left 0.25s ease ${i * 0.05}s both` }}>{m}</span>)}
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: DS.primary, margin: '0 0 6px', fontFamily: DS.fontFamily }}>📋 Steps</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                {act.steps.map((st, i) => {
                                    const ex = expandedStep === i;
                                    return (
                                        <div key={i} onClick={() => setExpandedStep(ex ? null : i)} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '9px 12px', borderRadius: DS.radiusMd, background: ex ? DS.primaryLighter : DS.neutral100, border: `1.5px solid ${ex ? DS.primaryLight : DS.neutral300}`, cursor: 'pointer', transition: 'all 0.25s ease', animation: `sg-up 0.3s ease ${0.1 + i * 0.06}s both` }}>
                                            <span style={{ width: 22, height: 22, borderRadius: DS.radiusPill, background: ex ? DS.primary : DS.primaryLight, color: ex ? DS.white : DS.primaryDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, transition: 'all 0.25s ease', fontFamily: DS.fontFamily }}>{i + 1}</span>
                                            <span style={{ fontSize: 12, color: DS.neutral900, lineHeight: 1.5, fontWeight: ex ? 600 : 400, fontFamily: DS.fontFamily }}>{st}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div style={{ background: DS.wrongBg, borderRadius: DS.radiusMd, padding: '10px 12px', border: `1px solid ${DS.wrong}20` }}>
                            <p style={{ fontSize: 11, color: '#991b1b', margin: 0, lineHeight: 1.4, fontWeight: 500, fontFamily: DS.fontFamily }}>⚠️ <strong>Safety:</strong> {act.safetyNote}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ====== MAIN RENDER ======
    return (
        <div style={{ width: Math.min(width, 820), maxHeight: height, fontFamily: DS.fontFamily, background: DS.neutral100, borderRadius: 20, overflow: 'hidden', boxShadow: '0 16px 48px rgba(83,48,134,0.10),0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', border: `1px solid ${DS.neutral300}` }}>
            {/* HEADER */}
            <div style={{ background: DS.gradientPrimary, padding: '16px 22px', color: DS.white, position: 'relative', overflow: 'hidden' }}>
                <svg width="100" height="100" viewBox="0 0 100 100" style={{ position: 'absolute', top: -15, right: -10, opacity: 0.1 }}><circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="2" /><polygon points="50,15 80,75 20,75" fill="none" stroke="white" strokeWidth="2" /></svg>
                <svg width="60" height="60" viewBox="0 0 60 60" style={{ position: 'absolute', bottom: -10, left: 50, opacity: 0.08 }}><rect x="5" y="5" width="50" height="50" rx="6" fill="none" stroke="white" strokeWidth="2" /></svg>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 40, height: 40, borderRadius: DS.radiusMd, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: mounted ? 'sg-pop 0.5s ease both' : 'none' }}><Zap size={22} /></div>
                    <div>
                        <h1 style={{ fontSize: 17, fontWeight: 800, margin: 0, letterSpacing: '-0.02em', fontFamily: DS.fontFamily }}>Chapter 3: Electricity — Review</h1>
                        <p style={{ fontSize: 11, margin: '2px 0 0', opacity: 0.78, fontWeight: 400 }}>Circuits and their Components • In a Nutshell</p>
                    </div>
                </div>
            </div>
            {/* MODE TABS */}
            {showModeSelector && (
                <div style={{ display: 'flex', gap: 6, padding: '10px 18px 8px', background: DS.white, borderBottom: `1px solid ${DS.neutral300}` }}>
                    {filteredModes.map(mode => {
                        const a = currentMode === mode.key, h = hoveredBtn === `m-${mode.key}`;
                        return (
                            <button key={mode.key} onClick={() => switchMode(mode.key)} onMouseEnter={() => setHoveredBtn(`m-${mode.key}`)} onMouseLeave={() => setHoveredBtn(null)}
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '9px 8px', borderRadius: DS.radiusPill, border: a ? 'none' : `1.5px solid ${h ? DS.primaryLight : 'transparent'}`, background: a ? DS.gradientSubtle : h ? DS.primaryLighter : 'transparent', color: a ? DS.white : h ? DS.primary : DS.neutral900, cursor: 'pointer', fontFamily: DS.fontFamily, fontSize: 12.5, fontWeight: a ? 700 : 500, transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', boxShadow: a ? DS.shadowPrimary : 'none' }}>
                                {mode.icon}{mode.label}
                            </button>
                        );
                    })}
                </div>
            )}
            {/* CONTENT */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 20px', scrollbarWidth: 'thin' }}>
                {currentMode === 'learn' && renderLearn()}
                {currentMode === 'practice' && renderPractice()}
                {currentMode === 'real_world' && renderRealWorld()}
                {currentMode === 'hands_on' && renderHandsOn()}
            </div>
        </div>
    );
};

export default ElectricityChapterReviewTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════