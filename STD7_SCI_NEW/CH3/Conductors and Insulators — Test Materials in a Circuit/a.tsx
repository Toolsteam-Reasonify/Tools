// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: conductor_insulator_tool.tsx
// Redesigned with Singularity Design System + MCQ Practice Questions
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { BookOpen, Target, Zap, RotateCcw, Check, X, ChevronLeft, ChevronRight, Award, Star, Plus, HelpCircle, FlaskConical, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

// ==================== DESIGN TOKENS (Singularity Design System) ====================

const DS = {
    primary: '#4A4DC9', primaryDark: '#533086', primaryLight: '#C1C1EA', primaryBg: '#EEEEF9',
    accent: '#FF7212', accentDark: '#FC9145', accentLight: '#FFF3E4',
    gradientPrimary: 'linear-gradient(135deg, #533086, #4A4DC9)',
    gradientAccent: 'linear-gradient(135deg, #533086, #FC9145)',
    gradientWarm: 'linear-gradient(135deg, #FF7212, #FC9145)',
    gradientCool: 'linear-gradient(135deg, #4A4DC9, #7B7EE0)',
    gradientHero: 'linear-gradient(135deg, #533086 0%, #4A4DC9 50%, #FC9145 100%)',
    gray900: '#4E4E4E', gray500: '#CACACA', gray300: '#EBEBEB', gray100: '#F5F5F5', white: '#FFFFFF',
    success: '#22C55E', successBg: '#F0FDF4', successBorder: '#BBF7D0',
    errorRed: '#EF4444', errorBg: '#FEF2F2', errorBorder: '#FECACA',
    fontFamily: "'Poppins', sans-serif",
    radiusSm: '8px', radiusMd: '12px', radiusLg: '16px', radiusXl: '24px', radiusPill: '999px',
    shadowSm: '0 2px 8px rgba(74,77,201,0.08)', shadowMd: '0 4px 16px rgba(74,77,201,0.12)',
    shadowLg: '0 8px 32px rgba(74,77,201,0.16)',
    shadowAccent: '0 4px 20px rgba(255,114,18,0.25)', shadowPrimary: '0 4px 20px rgba(74,77,201,0.25)',
};

// ==================== TYPES ====================

type ModeType = 'learn' | 'practice' | 'real_world';
type PracticeTab = 'circuit' | 'mcq';

interface StepDetails { currentStep: number; totalSteps: number; isPaused: boolean; currentMode: ModeType; }
interface MaterialData { id: string; name: string; emoji: string; material: string; isConductor: boolean; explanation: string; realWorldUse: string; color: string; }
interface ConductorInsulatorAdditionalProps { materials?: MaterialData[]; themeColor?: string; showExplanations?: boolean; showRealWorldExamples?: boolean; difficulty?: 'easy' | 'medium' | 'hard'; }
interface ConductorInsulatorToolProps {
    props?: { width?: number; height?: number; initialMode?: ModeType; showModeSelector?: boolean; enabledModes?: ModeType[]; animationSpeed?: number; themeColor?: string; darkMode?: boolean; additionalProps?: ConductorInsulatorAdditionalProps; };
    setStepDetails?: (d: StepDetails) => void; stopAutoNext?: boolean; setStopAutoNext?: (v: boolean) => void;
}

// ==================== MCQ QUESTION BANK ====================

interface MCQQuestion {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    emoji: string;
}

const MCQ_QUESTIONS: MCQQuestion[] = [
    {
        id: 'q1', emoji: '🔑',
        question: 'Which of the following is a conductor of electricity?',
        options: ['Rubber eraser', 'Iron key', 'Wooden stick', 'Plastic ruler'],
        correctIndex: 1,
        explanation: 'Iron is a metal, and all metals are good conductors of electricity. They allow electric current to pass through them easily.',
        difficulty: 'easy',
    },
    {
        id: 'q2', emoji: '🛡️',
        question: 'Why do electricians wear rubber gloves while working?',
        options: ['To keep hands warm', 'Rubber is a conductor', 'Rubber is an insulator and prevents electric shock', 'For better grip on wires'],
        correctIndex: 2,
        explanation: 'Rubber is an excellent insulator — it does not allow electric current to pass through it. This protects electricians from getting electric shocks.',
        difficulty: 'easy',
    },
    {
        id: 'q3', emoji: '✏️',
        question: 'Graphite (pencil lead) is special because it is:',
        options: ['A metal that insulates', 'A non-metal that conducts electricity', 'A plastic that conducts', 'An insulator like wood'],
        correctIndex: 1,
        explanation: 'Graphite is the only common non-metal that conducts electricity! This makes it a special exception to the rule that non-metals are insulators.',
        difficulty: 'medium',
    },
    {
        id: 'q4', emoji: '🔌',
        question: 'Electrical wires are made of copper covered with plastic because:',
        options: ['Copper is cheap and plastic is colourful', 'Copper conducts electricity while plastic insulates and protects us', 'Both copper and plastic conduct electricity', 'Plastic makes the wire stronger'],
        correctIndex: 1,
        explanation: 'Copper is an excellent conductor — it carries the current. The plastic coating is an insulator that prevents us from getting shocked when we touch the wire.',
        difficulty: 'easy',
    },
    {
        id: 'q5', emoji: '💡',
        question: 'In a circuit, if we place a glass rod in the gap, the bulb will:',
        options: ['Glow brightly', 'Glow dimly', 'Not glow at all', 'Explode'],
        correctIndex: 2,
        explanation: 'Glass is an insulator. It does not allow electric current to pass through, so the circuit remains incomplete and the bulb will not glow.',
        difficulty: 'easy',
    },
    {
        id: 'q6', emoji: '🏗️',
        question: 'Glass or ceramic discs are used on electric poles to:',
        options: ['Make the poles look beautiful', 'Hold the wires and prevent current from flowing into the pole', 'Conduct electricity to the ground', 'Increase the speed of current'],
        correctIndex: 1,
        explanation: 'Glass and ceramic are excellent insulators. The disc insulators on poles prevent current from flowing from the wires into the pole and then to the ground.',
        difficulty: 'medium',
    },
    {
        id: 'q7', emoji: '🧪',
        question: 'Which group contains ONLY conductors?',
        options: ['Iron, copper, rubber', 'Aluminium, steel, graphite', 'Glass, wood, paper', 'Copper, plastic, aluminium'],
        correctIndex: 1,
        explanation: 'Aluminium, steel, and graphite are all conductors of electricity. The other groups contain at least one insulator (rubber, glass/wood/paper, plastic).',
        difficulty: 'medium',
    },
    {
        id: 'q8', emoji: '⚡',
        question: 'A material that does NOT allow electric current to pass through it is called:',
        options: ['A conductor', 'A semiconductor', 'An insulator', 'A battery'],
        correctIndex: 2,
        explanation: 'Materials that do not allow electric current to pass through them are called insulators. Examples include rubber, plastic, glass, wood, and paper.',
        difficulty: 'easy',
    },
    {
        id: 'q9', emoji: '🔧',
        question: 'A screwdriver used by an electrician should have:',
        options: ['A metal handle and metal tip', 'A wooden handle and rubber tip', 'A plastic/rubber handle and metal tip', 'A glass handle and wooden tip'],
        correctIndex: 2,
        explanation: 'The metal tip is needed to conduct and work with screws/contacts, while the plastic or rubber handle is an insulator that protects the electrician from shock.',
        difficulty: 'medium',
    },
    {
        id: 'q10', emoji: '🌟',
        question: 'Which statement about conductors and insulators is TRUE?',
        options: ['All non-metals are insulators without any exception', 'All metals are insulators', 'Most metals are conductors and most non-metals are insulators', 'Wood is a good conductor when dry'],
        correctIndex: 2,
        explanation: 'Most metals are conductors and most non-metals are insulators. However, graphite is an important exception — it is a non-metal that conducts electricity!',
        difficulty: 'hard',
    },
];

// ==================== DEFAULT MATERIALS ====================

const DEFAULT_MATERIALS: MaterialData[] = [
    { id: 'iron_key', name: 'Iron Key', emoji: '🔑', material: 'Iron (Metal)', isConductor: true, explanation: 'Iron is a metal. All metals allow electric current to pass through them easily.', realWorldUse: '', color: '#78909C' },
    { id: 'copper_wire', name: 'Copper Wire', emoji: '🔌', material: 'Copper (Metal)', isConductor: true, explanation: "Copper is one of the best conductors. That's why most electrical wires are made of copper!", realWorldUse: '', color: '#E65100' },
    { id: 'aluminium_foil', name: 'Aluminium Foil', emoji: '🪩', material: 'Aluminium (Metal)', isConductor: true, explanation: 'Aluminium is a lightweight metal that conducts electricity well.', realWorldUse: '', color: '#B0BEC5' },
    { id: 'steel_spoon', name: 'Steel Spoon', emoji: '🥄', material: 'Steel (Metal)', isConductor: true, explanation: 'Steel is an alloy of iron and is a good conductor of electricity.', realWorldUse: '', color: '#90A4AE' },
    { id: 'pencil_graphite', name: 'Pencil Graphite', emoji: '✏️', material: 'Graphite (Carbon)', isConductor: true, explanation: "Graphite is a special non-metal that conducts electricity! It's the only common non-metal conductor.", realWorldUse: '', color: '#37474F' },
    { id: 'plastic_ruler', name: 'Plastic Ruler', emoji: '📏', material: 'Plastic', isConductor: false, explanation: 'Plastic does not allow electric current to pass through it. It is an insulator.', realWorldUse: '', color: '#42A5F5' },
    { id: 'rubber_eraser', name: 'Rubber Eraser', emoji: '🧹', material: 'Rubber', isConductor: false, explanation: 'Rubber is an excellent insulator. No current can flow through rubber.', realWorldUse: '', color: '#EF9A9A' },
    { id: 'glass_bangle', name: 'Glass Bangle', emoji: '💍', material: 'Glass', isConductor: false, explanation: 'Glass does not conduct electricity. It is used as an insulator.', realWorldUse: '', color: '#80CBC4' },
    { id: 'wooden_stick', name: 'Wooden Stick', emoji: '🪵', material: 'Wood', isConductor: false, explanation: 'Dry wood is an insulator. It does not let electric current pass through.', realWorldUse: '', color: '#A1887F' },
    { id: 'paper_strip', name: 'Paper Strip', emoji: '📄', material: 'Paper', isConductor: false, explanation: 'Paper is made from wood fibres and is an insulator.', realWorldUse: '', color: '#FFF9C4' },
];

// ==================== KEYFRAMES ====================

const keyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInScale { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
    @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
    @keyframes bulbGlow { 0% { filter: brightness(1); } 50% { filter: brightness(1.5) drop-shadow(0 0 30px rgba(74,77,201,0.6)) drop-shadow(0 0 60px rgba(193,193,234,0.4)); } 100% { filter: brightness(1.3) drop-shadow(0 0 20px rgba(74,77,201,0.5)); } }
    @keyframes bulbOff { 0% { filter: brightness(1.3) drop-shadow(0 0 20px rgba(74,77,201,0.4)); } 100% { filter: brightness(0.7); } }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
    @keyframes sparkle { 0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); } 50% { opacity: 1; transform: scale(1) rotate(180deg); } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes confetti { 0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); } 100% { opacity: 0; transform: translateY(-140px) rotate(720deg) scale(0.5); } }
    @keyframes wireGlow { 0% { stroke: #4A4DC9; filter: drop-shadow(0 0 2px #4A4DC9); } 50% { stroke: #C1C1EA; filter: drop-shadow(0 0 10px #C1C1EA); } 100% { stroke: #4A4DC9; filter: drop-shadow(0 0 2px #4A4DC9); } }
    @keyframes dragFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes gapPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(74,77,201,0.2); } 50% { box-shadow: 0 0 0 8px rgba(74,77,201,0.1); } }
    @keyframes resultBadge { 0% { transform: scale(0) rotate(-180deg); } 60% { transform: scale(1.2) rotate(10deg); } 100% { transform: scale(1) rotate(0deg); } }
    @keyframes modeTabIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scorePop { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
    @keyframes shakeWrong { 0%, 100% { transform: translateX(0); } 15% { transform: translateX(-6px); } 30% { transform: translateX(6px); } 45% { transform: translateX(-4px); } 60% { transform: translateX(4px); } 75% { transform: translateX(-2px); } }
    @keyframes correctPulse { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); } 50% { box-shadow: 0 0 0 12px rgba(34,197,94,0.1); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }
    @keyframes optionIn { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 200px; } }
    @keyframes questionSlide { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes celebrateBounce { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }
    @keyframes starSpin { from { transform: rotate(0deg) scale(0); opacity: 0; } to { transform: rotate(360deg) scale(1); opacity: 1; } }
`;

// ==================== MAIN COMPONENT ====================

const ConductorInsulatorTool: React.FC<ConductorInsulatorToolProps> = ({ props = {}, setStepDetails, stopAutoNext, setStopAutoNext }) => {
    const config = useMemo(() => ({
        width: props.width ?? 800, height: props.height ?? 600, initialMode: props.initialMode ?? 'learn' as ModeType,
        showModeSelector: props.showModeSelector ?? true, enabledModes: props.enabledModes ?? ['learn', 'practice', 'real_world'] as ModeType[],
        animationSpeed: props.animationSpeed ?? 1, themeColor: props.themeColor ?? DS.primary, darkMode: props.darkMode ?? false,
    }), [props]);

    const materials = useMemo(() => props.additionalProps?.materials ?? DEFAULT_MATERIALS, [props.additionalProps?.materials]);

    // ─── SHARED STATE ───
    const [selectedMode, setSelectedMode] = useState<ModeType>(config.initialMode);
    const [showConfetti, setShowConfetti] = useState(false);

    // ─── LEARN + CIRCUIT-TEST STATE ───
    const [testedMaterials, setTestedMaterials] = useState<Map<string, boolean>>(new Map());
    const [currentMaterial, setCurrentMaterial] = useState<MaterialData | null>(null);
    const [circuitActive, setCircuitActive] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [resultText, setResultText] = useState('');
    const [isOverGap, setIsOverGap] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [practiceScore, setPracticeScore] = useState(0);
    const [practicePrediction, setPracticePrediction] = useState<boolean | null>(null);
    const [practiceRevealed, setPracticeRevealed] = useState(false);
    const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const sparkleIdRef = useRef(0);

    // ─── PRACTICE TAB STATE ───
    const [practiceTab, setPracticeTab] = useState<PracticeTab>('circuit');

    // ─── MCQ STATE ───
    const [mcqIndex, setMcqIndex] = useState(0);
    const [mcqSelected, setMcqSelected] = useState<number | null>(null);
    const [mcqRevealed, setMcqRevealed] = useState(false);
    const [mcqScore, setMcqScore] = useState(0);
    const [mcqAnswered, setMcqAnswered] = useState<Set<number>>(new Set());
    const [mcqFinished, setMcqFinished] = useState(false);
    const [mcqHoveredOption, setMcqHoveredOption] = useState<number | null>(null);

    // ─── REAL WORLD STATE ───
    const [realWorldStep, setRealWorldStep] = useState(0);

    // ─── INJECT KEYFRAMES ───
    useEffect(() => {
        const s = document.createElement('style'); s.id = 'sing-ci-kf'; s.textContent = keyframes; document.head.appendChild(s);
        return () => { const e = document.getElementById('sing-ci-kf'); if (e) document.head.removeChild(e); };
    }, []);

    // ─── CIRCUIT HANDLERS ───
    const handleTestMaterial = useCallback((mat: MaterialData) => {
        setCurrentMaterial(mat);
        if (selectedMode === 'practice' && practiceTab === 'circuit' && practicePrediction === null) return;
        setTimeout(() => {
            setCircuitActive(mat.isConductor); setShowResult(true);
            setResultText(mat.isConductor ? '💡 CONDUCTOR — The bulb glows!' : '🔇 INSULATOR — The bulb stays dark.');
            if (mat.isConductor) { const ns = Array.from({ length: 8 }, () => ({ id: sparkleIdRef.current++, x: Math.random() * 120, y: Math.random() * 70 })); setSparkles(ns); setTimeout(() => setSparkles([]), 1800); }
            setTestedMaterials(prev => { const n = new Map(prev); n.set(mat.id, mat.isConductor); return n; });
            if (selectedMode === 'practice' && practiceTab === 'circuit') { setPracticeRevealed(true); if (practicePrediction === mat.isConductor) setPracticeScore(p => p + 1); }
            if (selectedMode === 'learn') setTimeout(() => setShowExplanation(true), 700);
        }, 500);
    }, [selectedMode, practicePrediction, practiceTab]);

    const handleDragStart = useCallback((e: React.DragEvent, mat: MaterialData) => { setIsDragging(true); e.dataTransfer.setData('text/plain', mat.id); }, []);
    const handleDragEnd = useCallback(() => { setIsDragging(false); setIsOverGap(false); }, []);
    const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsOverGap(true); }, []);
    const handleDragLeave = useCallback(() => setIsOverGap(false), []);
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); setIsOverGap(false); setIsDragging(false);
        const mat = materials.find(m => m.id === e.dataTransfer.getData('text/plain'));
        if (mat) handleTestMaterial(mat);
    }, [materials, handleTestMaterial]);

    const resetCircuit = useCallback(() => { setCurrentMaterial(null); setCircuitActive(false); setShowResult(false); setResultText(''); setShowExplanation(false); setPracticePrediction(null); setPracticeRevealed(false); setSparkles([]); }, []);

    const resetAll = useCallback(() => {
        resetCircuit(); setTestedMaterials(new Map()); setPracticeScore(0); setShowConfetti(false);
        setMcqIndex(0); setMcqSelected(null); setMcqRevealed(false); setMcqScore(0); setMcqAnswered(new Set()); setMcqFinished(false);
    }, [resetCircuit]);

    useEffect(() => {
        if (testedMaterials.size === materials.length && !showConfetti && selectedMode === 'learn') { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 4000); }
    }, [testedMaterials.size]);

    // ─── MCQ HANDLERS ───
    const handleMcqSelect = useCallback((optionIdx: number) => {
        if (mcqRevealed) return;
        setMcqSelected(optionIdx);
    }, [mcqRevealed]);

    const handleMcqSubmit = useCallback(() => {
        if (mcqSelected === null || mcqRevealed) return;
        setMcqRevealed(true);
        const q = MCQ_QUESTIONS[mcqIndex];
        if (mcqSelected === q.correctIndex) {
            setMcqScore(prev => prev + 1);
        }
        setMcqAnswered(prev => { const n = new Set(prev); n.add(mcqIndex); return n; });
    }, [mcqSelected, mcqRevealed, mcqIndex]);

    const handleMcqNext = useCallback(() => {
        if (mcqIndex < MCQ_QUESTIONS.length - 1) {
            setMcqIndex(prev => prev + 1);
            setMcqSelected(null);
            setMcqRevealed(false);
        } else {
            setMcqFinished(true);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 4000);
        }
    }, [mcqIndex]);

    const resetMcq = useCallback(() => {
        setMcqIndex(0); setMcqSelected(null); setMcqRevealed(false); setMcqScore(0); setMcqAnswered(new Set()); setMcqFinished(false);
    }, []);

    // ─── REAL WORLD DATA ───
    const realWorldExamples = [
        { title: 'Phone Charger Cable', desc: 'Copper wires inside carry electricity, while the plastic coating outside protects you.', emoji: '📱', conductor: 'Copper wire inside', insulator: 'Plastic/rubber coating' },
        { title: 'Electric Pole', desc: 'Metal wires carry electricity. Glass/ceramic insulators prevent current from reaching the pole.', emoji: '🏗️', conductor: 'Metal wires', insulator: 'Glass/ceramic discs' },
        { title: 'Screwdriver', desc: 'The metal tip conducts electricity. The plastic handle protects the user.', emoji: '🔧', conductor: 'Metal shaft & tip', insulator: 'Plastic/rubber handle' },
        { title: 'Electric Switch', desc: 'Metal contacts inside are conductors. The plastic body outside is an insulator.', emoji: '💡', conductor: 'Metal contacts', insulator: 'Plastic body' },
        { title: 'Kitchen Toaster', desc: 'Metal heating element is a conductor. Plastic body and handles are insulators.', emoji: '🍞', conductor: 'Metal element', insulator: 'Plastic body & handles' },
    ];

    // ─── COMPUTED ───
    const conductorsFound = Array.from(testedMaterials.entries()).filter(([_, v]) => v).length;
    const insulatorsFound = Array.from(testedMaterials.entries()).filter(([_, v]) => !v).length;
    const totalConductors = materials.filter(m => m.isConductor).length;
    const totalInsulators = materials.filter(m => !m.isConductor).length;
    const progress = (testedMaterials.size / materials.length) * 100;

    const modeConfig: Record<ModeType, { icon: any; label: string; color: string; bg: string }> = {
        learn: { icon: BookOpen, label: 'Learn', color: DS.primary, bg: DS.primaryBg },
        practice: { icon: Target, label: 'Practice', color: DS.accent, bg: DS.accentLight },
        real_world: { icon: Zap, label: 'Real World', color: DS.primaryDark, bg: '#F3EDF9' },
    };

    // ═══════════════════════════════════════════════════════════════
    // RENDER: CIRCUIT SVG
    // ═══════════════════════════════════════════════════════════════

    const renderCircuit = () => {
        const wc = circuitActive ? DS.primary : DS.gray500;
        return (
            <svg width={400} height={210} viewBox="0 0 400 210" style={{ overflow: 'visible' }}>
                <defs>
                    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={DS.primaryDark} /><stop offset="100%" stopColor={DS.primary} /></linearGradient>
                    <filter id="gl"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                <g transform="translate(28,68)"><rect x="0" y="8" width="54" height="44" rx="8" fill="url(#bg)" /><rect x="54" y="16" width="7" height="28" rx="3" fill={DS.accentDark} /><text x="27" y="35" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily={DS.fontFamily}>+ −</text><text x="27" y="66" textAnchor="middle" fill={DS.gray900} fontSize="10" fontWeight="500" fontFamily={DS.fontFamily}>Cell</text></g>
                <path d="M 82 78 L 82 28 L 175 28" fill="none" stroke={wc} strokeWidth="3" strokeLinecap="round" style={circuitActive ? { animation: 'wireGlow 1.2s ease-in-out infinite' } : {}} />
                <path d="M 175 28 L 290 28 L 290 54" fill="none" stroke={wc} strokeWidth="3" strokeLinecap="round" style={circuitActive ? { animation: 'wireGlow 1.2s ease-in-out infinite 0.15s' } : {}} />
                <g transform="translate(270,54)">
                    {circuitActive && <circle cx="20" cy="24" r="32" fill={`${DS.primaryLight}50`} style={{ animation: 'pulse 1.6s ease-in-out infinite' }} />}
                    <circle cx="20" cy="24" r="20" fill={circuitActive ? '#FFEB3B' : DS.gray300} stroke={circuitActive ? '#FFC107' : DS.gray500} strokeWidth="2.5" style={circuitActive ? { animation: 'bulbGlow 1.2s ease-in-out forwards', filter: `drop-shadow(0 0 14px ${DS.primaryLight})` } : {}} />
                    <path d="M 15 30 Q 20 14 25 30" fill="none" stroke={circuitActive ? '#FF8F00' : '#999'} strokeWidth="1.8" />
                    <line x1="20" y1="44" x2="20" y2="52" stroke={wc} strokeWidth="3" />
                    <text x="20" y="68" textAnchor="middle" fill={DS.gray900} fontSize="10" fontWeight="500" fontFamily={DS.fontFamily}>Bulb</text>
                </g>
                <path d="M 290 106 L 290 158 L 230 158" fill="none" stroke={wc} strokeWidth="3" strokeLinecap="round" style={circuitActive ? { animation: 'wireGlow 1.2s ease-in-out infinite 0.3s' } : {}} />
                <rect x="152" y="144" width="78" height="28" rx="14" fill={isOverGap ? `${DS.primary}18` : (currentMaterial ? (circuitActive ? `${DS.primary}10` : `${DS.accent}08`) : DS.gray100)} stroke={isOverGap ? DS.primary : (currentMaterial ? (circuitActive ? DS.primary : DS.accent) : DS.gray500)} strokeWidth="2.5" strokeDasharray={currentMaterial ? '0' : '7,5'} style={isOverGap ? { animation: 'gapPulse 1s ease-in-out infinite' } : {}} />
                {currentMaterial ? <text x="191" y="163" textAnchor="middle" fill={DS.gray900} fontSize="10" fontWeight="600" fontFamily={DS.fontFamily}>{currentMaterial.emoji} {currentMaterial.name}</text> : <text x="191" y="162" textAnchor="middle" fill={DS.gray500} fontSize="10" fontFamily={DS.fontFamily}>Drop here</text>}
                <text x="191" y="186" textAnchor="middle" fill={DS.gray500} fontSize="8" fontFamily={DS.fontFamily}>Test Material</text>
                <path d="M 152 158 L 82 158 L 82 112" fill="none" stroke={wc} strokeWidth="3" strokeLinecap="round" style={circuitActive ? { animation: 'wireGlow 1.2s ease-in-out infinite 0.45s' } : {}} />
                {circuitActive && (<>
                    <circle r="4.5" fill={DS.primaryLight} filter="url(#gl)"><animateMotion dur="2.2s" repeatCount="indefinite" path="M 82 78 L 82 28 L 290 28 L 290 158 L 82 158 L 82 112" /></circle>
                    <circle r="3.5" fill={DS.primary} filter="url(#gl)"><animateMotion dur="2.2s" repeatCount="indefinite" begin="0.55s" path="M 82 78 L 82 28 L 290 28 L 290 158 L 82 158 L 82 112" /></circle>
                    <circle r="3" fill={DS.accentDark} filter="url(#gl)"><animateMotion dur="2.2s" repeatCount="indefinite" begin="1.1s" path="M 82 78 L 82 28 L 290 28 L 290 158 L 82 158 L 82 112" /></circle>
                </>)}
                {sparkles.map((s, i) => <g key={s.id} transform={`translate(${220 + s.x},${10 + s.y})`} style={{ animation: `sparkle 1.2s ease-out ${i * 0.12}s forwards` }}><text fontSize="16">✨</text></g>)}
            </svg>
        );
    };

    // ═══════════════════════════════════════════════════════════════
    // RENDER: MATERIAL CARD
    // ═══════════════════════════════════════════════════════════════

    const renderCard = (mat: MaterialData, i: number) => {
        const tested = testedMaterials.has(mat.id); const isCur = currentMaterial?.id === mat.id; const hov = hoveredCard === mat.id; const isC = testedMaterials.get(mat.id);
        return (
            <div key={mat.id} draggable={!tested || selectedMode !== 'practice'} onDragStart={e => handleDragStart(e, mat)} onDragEnd={handleDragEnd}
                onClick={() => { if (selectedMode === 'practice' && practiceTab === 'circuit' && !tested) { resetCircuit(); setCurrentMaterial(mat); } else if (selectedMode !== 'practice' || practiceTab !== 'circuit') { resetCircuit(); setTimeout(() => handleTestMaterial(mat), 50); } }}
                onMouseEnter={() => setHoveredCard(mat.id)} onMouseLeave={() => setHoveredCard(null)}
                style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 6px', borderRadius: DS.radiusLg,
                    border: `2px solid ${isCur ? DS.primary : (tested ? (isC ? DS.primary : DS.accent) : DS.gray300)}`,
                    background: tested ? (isC ? DS.primaryBg : DS.accentLight) : (isCur ? `${DS.primary}08` : DS.white),
                    cursor: tested && selectedMode === 'practice' ? 'default' : 'grab',
                    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                    transform: hov && !tested ? 'translateY(-5px) scale(1.05)' : (isCur ? 'scale(0.97)' : 'scale(1)'),
                    boxShadow: hov && !tested ? DS.shadowLg : (isCur ? `0 0 0 4px ${DS.primary}20` : DS.shadowSm),
                    opacity: tested && selectedMode === 'practice' ? 0.65 : 1,
                    animation: `popIn 0.4s ease-out ${i * 0.05}s both`, position: 'relative', minWidth: '78px', userSelect: 'none' as const, fontFamily: DS.fontFamily,
                }}>
                {tested && <div style={{ position: 'absolute', top: -7, right: -7, width: 24, height: 24, borderRadius: '50%', background: isC ? DS.gradientCool : DS.gradientWarm, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'resultBadge 0.5s ease-out forwards', boxShadow: isC ? DS.shadowPrimary : DS.shadowAccent, border: `2px solid ${DS.white}` }}>{isC ? <Zap size={11} color="white" /> : <X size={11} color="white" />}</div>}
                <span style={{ fontSize: '28px', marginBottom: '5px', animation: !tested ? 'dragFloat 2.5s ease-in-out infinite' : 'none' }}>{mat.emoji}</span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: DS.gray900, textAlign: 'center', lineHeight: 1.2 }}>{mat.name}</span>
                <span style={{ fontSize: '8px', color: DS.gray500, marginTop: '2px' }}>{mat.material}</span>
            </div>
        );
    };

    // ═══════════════════════════════════════════════════════════════
    // RENDER: LEARN MODE
    // ═══════════════════════════════════════════════════════════════

    const renderLearn = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: DS.primaryBg, borderRadius: DS.radiusMd, padding: '12px 16px', border: `1px solid ${DS.primaryLight}`, animation: 'fadeInUp 0.5s ease-out' }}>
                <p style={{ margin: 0, fontSize: '13px', color: DS.primary, fontWeight: 600, fontFamily: DS.fontFamily }}>🔬 Drag a material into the circuit gap or tap to test if it conducts electricity!</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', minHeight: '210px' }}><div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>{renderCircuit()}</div></div>
            {showResult && (
                <div style={{ background: circuitActive ? DS.gradientCool : DS.gradientWarm, borderRadius: DS.radiusMd, padding: '12px 18px', color: DS.white, textAlign: 'center', animation: 'fadeInScale 0.4s ease-out', boxShadow: circuitActive ? DS.shadowPrimary : DS.shadowAccent }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, fontFamily: DS.fontFamily }}>{resultText}</div>
                    {showExplanation && currentMaterial && <div style={{ fontSize: '12px', marginTop: '6px', opacity: 0.92, animation: 'fadeInUp 0.4s ease-out', fontFamily: DS.fontFamily }}>{currentMaterial.explanation}</div>}
                </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>{materials.map((m, i) => renderCard(m, i))}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '8px', borderRadius: DS.radiusPill, background: DS.gray300, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, borderRadius: DS.radiusPill, background: DS.gradientAccent, transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)' }} />
                </div>
                <span style={{ fontSize: '11px', color: DS.gray900, fontWeight: 600, fontFamily: DS.fontFamily }}>{testedMaterials.size}/{materials.length}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <div style={{ padding: '6px 18px', borderRadius: DS.radiusPill, background: DS.primaryBg, fontSize: '11px', fontWeight: 600, color: DS.primary, border: `1px solid ${DS.primaryLight}`, fontFamily: DS.fontFamily }}>⚡ Conductors: {conductorsFound}/{totalConductors}</div>
                <div style={{ padding: '6px 18px', borderRadius: DS.radiusPill, background: DS.accentLight, fontSize: '11px', fontWeight: 600, color: DS.accent, border: '1px solid #FFD4B0', fontFamily: DS.fontFamily }}>🛡️ Insulators: {insulatorsFound}/{totalInsulators}</div>
            </div>
        </div>
    );

    // ═══════════════════════════════════════════════════════════════
    // RENDER: PRACTICE MODE — with sub-tabs
    // ═══════════════════════════════════════════════════════════════

    const renderPracticeCircuit = () => {
        const allDone = materials.every(m => testedMaterials.has(m.id));
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: DS.accentLight, borderRadius: DS.radiusMd, padding: '12px 16px', border: '1px solid #FFD4B0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'fadeInUp 0.4s ease-out' }}>
                    <span style={{ fontSize: '13px', color: DS.accent, fontWeight: 600, fontFamily: DS.fontFamily }}>🎯 Predict first — will the bulb glow?</span>
                    <div style={{ background: DS.gradientWarm, color: DS.white, padding: '5px 16px', borderRadius: DS.radiusPill, fontSize: '12px', fontWeight: 700, fontFamily: DS.fontFamily }}>Score: {practiceScore}/{testedMaterials.size}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', minHeight: '210px' }}><div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>{renderCircuit()}</div></div>
                {currentMaterial && !practiceRevealed && (
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', animation: 'fadeInUp 0.4s ease-out', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: DS.gray900, fontFamily: DS.fontFamily }}>Will <strong style={{ color: DS.primary }}>{currentMaterial.name}</strong> conduct?</span>
                        <button onClick={() => { setPracticePrediction(true); setTimeout(() => handleTestMaterial(currentMaterial), 300); }} style={{ padding: '10px 24px', borderRadius: DS.radiusPill, border: `2px solid ${DS.primary}`, background: practicePrediction === true ? DS.primary : DS.white, color: practicePrediction === true ? DS.white : DS.primary, cursor: 'pointer', fontWeight: 700, fontSize: '13px', fontFamily: DS.fontFamily, transition: 'all 0.3s ease' }}>💡 Yes</button>
                        <button onClick={() => { setPracticePrediction(false); setTimeout(() => handleTestMaterial(currentMaterial), 300); }} style={{ padding: '10px 24px', borderRadius: DS.radiusPill, border: `2px solid ${DS.accent}`, background: practicePrediction === false ? DS.accent : DS.white, color: practicePrediction === false ? DS.white : DS.accent, cursor: 'pointer', fontWeight: 700, fontSize: '13px', fontFamily: DS.fontFamily, transition: 'all 0.3s ease' }}>🔇 No</button>
                    </div>
                )}
                {practiceRevealed && currentMaterial && (
                    <div style={{ borderRadius: DS.radiusMd, padding: '14px 18px', textAlign: 'center', animation: 'fadeInScale 0.4s ease-out', background: practicePrediction === currentMaterial.isConductor ? DS.gradientCool : DS.gradientAccent, color: DS.white, boxShadow: DS.shadowLg }}>
                        <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: DS.fontFamily }}>{practicePrediction === currentMaterial.isConductor ? '🎉 Correct!' : '🤔 Not quite!'}</div>
                        <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.93, fontFamily: DS.fontFamily }}>{currentMaterial.explanation}</div>
                        <button onClick={resetCircuit} style={{ marginTop: '10px', padding: '8px 22px', borderRadius: DS.radiusPill, border: '2px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.15)', color: DS.white, cursor: 'pointer', fontWeight: 600, fontSize: '12px', fontFamily: DS.fontFamily }}>Test Next →</button>
                    </div>
                )}
                {allDone && (
                    <div style={{ background: DS.primaryBg, borderRadius: DS.radiusMd, padding: '20px', textAlign: 'center', animation: 'fadeInScale 0.5s ease-out', border: `2px solid ${DS.primary}` }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</div>
                        <div style={{ fontSize: '17px', fontWeight: 700, color: DS.primary, fontFamily: DS.fontFamily }}>All Done! Score: {practiceScore}/{materials.length}</div>
                        <div style={{ fontSize: '12px', color: DS.primaryDark, marginTop: '4px', fontFamily: DS.fontFamily }}>{practiceScore === materials.length ? "Perfect! You're an electricity expert! ⚡" : practiceScore >= 7 ? 'Great job! 🌟' : 'Keep practicing! 💪'}</div>
                    </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>{materials.map((m, i) => renderCard(m, i))}</div>
            </div>
        );
    };

    // ═══════════════════════════════════════════════════════════════
    // RENDER: MCQ QUIZ
    // ═══════════════════════════════════════════════════════════════

    const renderMcqQuiz = () => {
        if (mcqFinished) {
            const pct = Math.round((mcqScore / MCQ_QUESTIONS.length) * 100);
            const grade = pct >= 90 ? { emoji: '🏆', label: 'Outstanding!', color: DS.primary, msg: "You're an electricity expert! Perfect understanding of conductors and insulators." }
                : pct >= 70 ? { emoji: '🌟', label: 'Great Job!', color: DS.success, msg: 'You have a strong understanding. Review the ones you missed and try again!' }
                    : pct >= 50 ? { emoji: '💪', label: 'Good Effort!', color: DS.accentDark, msg: 'You\'re getting there! Go back to Learn mode to revise, then try again.' }
                        : { emoji: '📚', label: 'Keep Learning!', color: DS.accent, msg: 'Don\'t worry — go through Learn mode again and you\'ll improve quickly!' };

            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '24px 12px', animation: 'celebrateBounce 0.6s ease-out' }}>
                    <div style={{ fontSize: '64px', animation: 'starSpin 0.8s ease-out' }}>{grade.emoji}</div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: grade.color, fontFamily: DS.fontFamily }}>{grade.label}</h2>

                    {/* Score Ring */}
                    <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                            <circle cx="60" cy="60" r="50" fill="none" stroke={DS.gray300} strokeWidth="10" />
                            <circle cx="60" cy="60" r="50" fill="none" stroke={grade.color} strokeWidth="10"
                                strokeDasharray={`${pct * 3.14} ${314 - pct * 3.14}`}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dasharray 1s ease-out' }} />
                        </svg>
                        <div style={{ textAlign: 'center', zIndex: 1 }}>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: DS.gray900, fontFamily: DS.fontFamily }}>{mcqScore}/{MCQ_QUESTIONS.length}</div>
                            <div style={{ fontSize: '11px', color: DS.gray500, fontWeight: 500, fontFamily: DS.fontFamily }}>{pct}%</div>
                        </div>
                    </div>

                    <p style={{ margin: 0, fontSize: '14px', color: DS.gray900, textAlign: 'center', maxWidth: '380px', lineHeight: 1.6, fontFamily: DS.fontFamily }}>{grade.msg}</p>

                    {/* Question Review Dots */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {MCQ_QUESTIONS.map((q, i) => {
                            const wasCorrect = mcqAnswered.has(i); // We need to track this better
                            return (
                                <div key={i} style={{
                                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '12px', fontWeight: 700, fontFamily: DS.fontFamily,
                                    background: DS.primaryBg, color: DS.primary, border: `1.5px solid ${DS.primaryLight}`,
                                }}>{i + 1}</div>
                            );
                        })}
                    </div>

                    <button onClick={resetMcq} style={{
                        padding: '12px 32px', borderRadius: DS.radiusPill,
                        background: DS.gradientCool, color: DS.white, border: 'none',
                        cursor: 'pointer', fontWeight: 700, fontSize: '14px', fontFamily: DS.fontFamily,
                        boxShadow: DS.shadowPrimary, transition: 'all 0.3s ease',
                    }}>
                        <RotateCcw size={15} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Try Again
                    </button>
                </div>
            );
        }

        const q = MCQ_QUESTIONS[mcqIndex];
        const isCorrect = mcqSelected === q.correctIndex;
        const difficultyColors: Record<string, { bg: string; text: string; border: string }> = {
            easy: { bg: DS.successBg, text: DS.success, border: DS.successBorder },
            medium: { bg: DS.accentLight, text: DS.accent, border: '#FFD4B0' },
            hard: { bg: '#FEF2F2', text: DS.errorRed, border: DS.errorBorder },
        };
        const dc = difficultyColors[q.difficulty];

        return (
            <div key={`mcq-${mcqIndex}`} style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'questionSlide 0.45s ease-out' }}>
                {/* Header Row: progress + score */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: DS.gray900, fontFamily: DS.fontFamily }}>
                            Q{mcqIndex + 1}/{MCQ_QUESTIONS.length}
                        </span>
                        <div style={{ padding: '3px 10px', borderRadius: DS.radiusPill, background: dc.bg, fontSize: '10px', fontWeight: 700, color: dc.text, border: `1px solid ${dc.border}`, textTransform: 'capitalize' as const, fontFamily: DS.fontFamily }}>
                            {q.difficulty}
                        </div>
                    </div>
                    <div style={{ background: DS.gradientWarm, color: DS.white, padding: '5px 16px', borderRadius: DS.radiusPill, fontSize: '12px', fontWeight: 700, fontFamily: DS.fontFamily, animation: mcqScore > 0 ? 'scorePop 0.3s ease-out' : 'none' }}>
                        Score: {mcqScore}/{mcqAnswered.size}
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ height: '5px', borderRadius: DS.radiusPill, background: DS.gray300, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${((mcqIndex + (mcqRevealed ? 1 : 0)) / MCQ_QUESTIONS.length) * 100}%`, borderRadius: DS.radiusPill, background: DS.gradientAccent, transition: 'width 0.5s ease-out' }} />
                </div>

                {/* Question Card */}
                <div style={{
                    background: DS.white, borderRadius: DS.radiusLg, padding: '20px',
                    boxShadow: DS.shadowMd, border: `1px solid ${DS.gray300}`,
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: DS.radiusMd, flexShrink: 0,
                            background: DS.gradientPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '22px', boxShadow: DS.shadowPrimary,
                        }}>{q.emoji}</div>
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: DS.gray900, lineHeight: 1.55, fontFamily: DS.fontFamily }}>
                            {q.question}
                        </p>
                    </div>
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {q.options.map((opt, i) => {
                        const isSelected = mcqSelected === i;
                        const isCorrectOpt = i === q.correctIndex;
                        const showCorrectHighlight = mcqRevealed && isCorrectOpt;
                        const showWrongHighlight = mcqRevealed && isSelected && !isCorrectOpt;

                        let bgColor = DS.white;
                        let borderColor = DS.gray300;
                        let textColor = DS.gray900;
                        let iconEl: React.ReactNode = null;
                        let anim = '';

                        if (mcqRevealed) {
                            if (showCorrectHighlight) {
                                bgColor = DS.successBg; borderColor = DS.success; textColor = '#166534';
                                iconEl = <CheckCircle2 size={20} color={DS.success} />;
                                anim = 'correctPulse 0.6s ease-out';
                            } else if (showWrongHighlight) {
                                bgColor = DS.errorBg; borderColor = DS.errorRed; textColor = '#991B1B';
                                iconEl = <XCircle size={20} color={DS.errorRed} />;
                                anim = 'shakeWrong 0.5s ease-out';
                            } else {
                                bgColor = DS.gray100; borderColor = DS.gray300; textColor = DS.gray500;
                            }
                        } else {
                            if (isSelected) {
                                bgColor = DS.primaryBg; borderColor = DS.primary; textColor = DS.primaryDark;
                                iconEl = <div style={{ width: 20, height: 20, borderRadius: '50%', background: DS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} color="white" /></div>;
                            } else if (mcqHoveredOption === i) {
                                bgColor = `${DS.primary}06`; borderColor = DS.primaryLight;
                            }
                        }

                        const optionLabel = String.fromCharCode(65 + i); // A, B, C, D

                        return (
                            <div
                                key={i}
                                onClick={() => handleMcqSelect(i)}
                                onMouseEnter={() => !mcqRevealed && setMcqHoveredOption(i)}
                                onMouseLeave={() => setMcqHoveredOption(null)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '14px',
                                    padding: '14px 18px', borderRadius: DS.radiusMd,
                                    background: bgColor, border: `2px solid ${borderColor}`,
                                    cursor: mcqRevealed ? 'default' : 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                                    animation: `optionIn 0.35s ease-out ${i * 0.08}s both${anim ? `, ${anim}` : ''}`,
                                    fontFamily: DS.fontFamily,
                                    transform: !mcqRevealed && mcqHoveredOption === i ? 'translateX(4px)' : 'translateX(0)',
                                }}
                            >
                                {/* Option Letter Badge */}
                                <div style={{
                                    width: 32, height: 32, borderRadius: DS.radiusSm, flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, fontSize: '13px',
                                    background: mcqRevealed
                                        ? (showCorrectHighlight ? DS.success : (showWrongHighlight ? DS.errorRed : DS.gray300))
                                        : (isSelected ? DS.primary : DS.gray300),
                                    color: mcqRevealed
                                        ? (showCorrectHighlight || showWrongHighlight ? DS.white : DS.gray500)
                                        : (isSelected ? DS.white : DS.gray500),
                                    transition: 'all 0.3s ease',
                                }}>
                                    {optionLabel}
                                </div>

                                {/* Option Text */}
                                <span style={{ flex: 1, fontSize: '14px', fontWeight: isSelected ? 600 : 500, color: textColor, lineHeight: 1.4 }}>
                                    {opt}
                                </span>

                                {/* Result Icon */}
                                {iconEl && <div style={{ flexShrink: 0 }}>{iconEl}</div>}
                            </div>
                        );
                    })}
                </div>

                {/* Explanation (after reveal) */}
                {mcqRevealed && (
                    <div style={{
                        background: isCorrect ? `linear-gradient(135deg, ${DS.successBg}, #ECFDF5)` : `linear-gradient(135deg, ${DS.errorBg}, #FFF5F5)`,
                        borderRadius: DS.radiusMd, padding: '16px 18px',
                        border: `1.5px solid ${isCorrect ? DS.successBorder : DS.errorBorder}`,
                        animation: 'slideDown 0.4s ease-out',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            {isCorrect ? <CheckCircle2 size={18} color={DS.success} /> : <XCircle size={18} color={DS.errorRed} />}
                            <span style={{ fontSize: '13px', fontWeight: 700, color: isCorrect ? '#166534' : '#991B1B', fontFamily: DS.fontFamily }}>
                                {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: DS.gray900, lineHeight: 1.6, fontFamily: DS.fontFamily }}>
                            {q.explanation}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    {!mcqRevealed ? (
                        <button
                            onClick={handleMcqSubmit}
                            disabled={mcqSelected === null}
                            style={{
                                padding: '12px 32px', borderRadius: DS.radiusPill,
                                background: mcqSelected !== null ? DS.gradientCool : DS.gray300,
                                color: mcqSelected !== null ? DS.white : DS.gray500,
                                border: 'none', cursor: mcqSelected !== null ? 'pointer' : 'not-allowed',
                                fontWeight: 700, fontSize: '14px', fontFamily: DS.fontFamily,
                                boxShadow: mcqSelected !== null ? DS.shadowPrimary : 'none',
                                transition: 'all 0.3s ease',
                                display: 'flex', alignItems: 'center', gap: '8px',
                            }}
                        >
                            <Check size={16} /> Check Answer
                        </button>
                    ) : (
                        <button
                            onClick={handleMcqNext}
                            style={{
                                padding: '12px 32px', borderRadius: DS.radiusPill,
                                background: DS.gradientAccent, color: DS.white,
                                border: 'none', cursor: 'pointer',
                                fontWeight: 700, fontSize: '14px', fontFamily: DS.fontFamily,
                                boxShadow: DS.shadowAccent, transition: 'all 0.3s ease',
                                display: 'flex', alignItems: 'center', gap: '8px',
                            }}
                        >
                            {mcqIndex < MCQ_QUESTIONS.length - 1 ? <><ArrowRight size={16} /> Next Question</> : <><Award size={16} /> See Results</>}
                        </button>
                    )}
                </div>

                {/* Question Dots */}
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {MCQ_QUESTIONS.map((_, i) => (
                        <div key={i} style={{
                            width: i === mcqIndex ? 24 : 8, height: 8, borderRadius: DS.radiusPill,
                            background: i === mcqIndex ? DS.gradientCool : (mcqAnswered.has(i) ? DS.primaryLight : DS.gray300),
                            transition: 'all 0.35s ease',
                        }} />
                    ))}
                </div>
            </div>
        );
    };

    // ─── PRACTICE MODE WRAPPER (sub-tabs) ───
    const renderPractice = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Sub-tab selector */}
            <div style={{
                display: 'flex', gap: '4px', padding: '4px',
                background: DS.gray100, borderRadius: DS.radiusPill,
            }}>
                {([
                    { key: 'circuit' as PracticeTab, icon: FlaskConical, label: 'Circuit Test' },
                    { key: 'mcq' as PracticeTab, icon: HelpCircle, label: 'MCQ Quiz' },
                ]).map(tab => {
                    const active = practiceTab === tab.key;
                    const Icon = tab.icon;
                    return (
                        <button key={tab.key} onClick={() => setPracticeTab(tab.key)}
                            style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                                padding: '10px 16px', borderRadius: DS.radiusPill,
                                background: active ? DS.white : 'transparent',
                                color: active ? DS.accent : DS.gray500,
                                border: 'none',
                                boxShadow: active ? DS.shadowSm : 'none',
                                cursor: 'pointer', fontWeight: active ? 700 : 500,
                                fontSize: '13px', fontFamily: DS.fontFamily,
                                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                                outline: 'none',
                            }}
                        >
                            <Icon size={15} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>
            {/* Sub-tab content */}
            {practiceTab === 'circuit' && renderPracticeCircuit()}
            {practiceTab === 'mcq' && renderMcqQuiz()}
        </div>
    );

    // ═══════════════════════════════════════════════════════════════
    // RENDER: REAL WORLD MODE
    // ═══════════════════════════════════════════════════════════════

    const renderRealWorld = () => {
        const ex = realWorldExamples[realWorldStep];
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#F3EDF9', borderRadius: DS.radiusMd, padding: '12px 16px', border: `1px solid ${DS.primaryLight}`, animation: 'fadeInUp 0.4s ease-out' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: DS.primaryDark, fontWeight: 600, fontFamily: DS.fontFamily }}>🌍 Discover conductors & insulators in everyday objects!</p>
                </div>
                <div key={realWorldStep} style={{ background: DS.white, borderRadius: DS.radiusLg, padding: '24px', boxShadow: DS.shadowMd, border: `1px solid ${DS.gray300}`, animation: 'fadeInScale 0.5s ease-out', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                        <div style={{ width: 56, height: 56, borderRadius: DS.radiusMd, background: DS.gradientAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', boxShadow: DS.shadowAccent }}>{ex.emoji}</div>
                        <div><h3 style={{ margin: 0, fontSize: '18px', color: DS.primaryDark, fontWeight: 700, fontFamily: DS.fontFamily }}>{ex.title}</h3><p style={{ margin: '3px 0 0', fontSize: '13px', color: DS.gray900, fontFamily: DS.fontFamily, lineHeight: 1.5 }}>{ex.desc}</p></div>
                    </div>
                    <div style={{ display: 'flex', gap: '14px' }}>
                        <div style={{ flex: 1, background: DS.primaryBg, borderRadius: DS.radiusMd, padding: '16px', border: `1.5px solid ${DS.primaryLight}`, animation: 'slideInLeft 0.5s ease-out 0.2s both' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: DS.primary, marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px', fontFamily: DS.fontFamily }}>⚡ Conductor Part</div>
                            <div style={{ fontSize: '14px', color: DS.gray900, fontWeight: 500, fontFamily: DS.fontFamily }}>{ex.conductor}</div>
                        </div>
                        <div style={{ flex: 1, background: DS.accentLight, borderRadius: DS.radiusMd, padding: '16px', border: '1.5px solid #FFD4B0', animation: 'slideInRight 0.5s ease-out 0.3s both' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: DS.accent, marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px', fontFamily: DS.fontFamily }}>🛡️ Insulator Part</div>
                            <div style={{ fontSize: '14px', color: DS.gray900, fontWeight: 500, fontFamily: DS.fontFamily }}>{ex.insulator}</div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '18px' }}>
                    <button onClick={() => setRealWorldStep(Math.max(0, realWorldStep - 1))} disabled={realWorldStep === 0} style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${realWorldStep === 0 ? DS.gray300 : DS.primary}`, background: realWorldStep === 0 ? DS.gray100 : DS.white, color: realWorldStep === 0 ? DS.gray500 : DS.primary, cursor: realWorldStep === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}><ChevronLeft size={20} /></button>
                    <div style={{ display: 'flex', gap: '8px' }}>{realWorldExamples.map((_, i) => <div key={i} onClick={() => setRealWorldStep(i)} style={{ width: i === realWorldStep ? 28 : 10, height: 10, borderRadius: DS.radiusPill, background: i === realWorldStep ? DS.gradientAccent : DS.gray300, cursor: 'pointer', transition: 'all 0.35s ease', boxShadow: i === realWorldStep ? DS.shadowAccent : 'none' }} />)}</div>
                    <button onClick={() => setRealWorldStep(Math.min(4, realWorldStep + 1))} disabled={realWorldStep === 4} style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${realWorldStep === 4 ? DS.gray300 : DS.primary}`, background: realWorldStep === 4 ? DS.gray100 : DS.white, color: realWorldStep === 4 ? DS.gray500 : DS.primary, cursor: realWorldStep === 4 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}><ChevronRight size={20} /></button>
                </div>
                <div style={{ background: `linear-gradient(135deg, ${DS.primaryBg}, ${DS.accentLight})`, borderRadius: DS.radiusMd, padding: '14px 18px', border: `1px solid ${DS.primaryLight}`, animation: 'fadeInUp 0.5s ease-out 0.4s both' }}>
                    <div style={{ fontSize: '13px', color: DS.primaryDark, fontWeight: 600, fontFamily: DS.fontFamily, lineHeight: 1.6 }}>💡 <strong>Key Insight:</strong> Almost ALL conductors are metals and ALL insulators are non-metals — except pencil graphite (carbon), which conducts electricity!</div>
                </div>
            </div>
        );
    };

    // ═══════════════════════════════════════════════════════════════
    // MAIN RENDER
    // ═══════════════════════════════════════════════════════════════

    return (
        <div style={{ width: config.width, maxWidth: '100%', minHeight: config.height, background: `linear-gradient(180deg, ${DS.gray100} 0%, ${DS.white} 50%, ${DS.gray100} 100%)`, borderRadius: DS.radiusXl, overflow: 'hidden', boxShadow: DS.shadowLg, display: 'flex', flexDirection: 'column', fontFamily: DS.fontFamily, position: 'relative', border: `1px solid ${DS.gray300}` }}>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

            {/* Header */}
            <div style={{ background: DS.gradientHero, padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 40, height: 40, borderRadius: DS.radiusMd, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}><Zap size={22} color="white" /></div>
                    <div><h1 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: DS.white, letterSpacing: '-0.3px' }}>Conductors & Insulators</h1><p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.75)', fontWeight: 400 }}>Ch 3 · Electricity: Circuits & Components</p></div>
                </div>
                <button onClick={resetAll} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: DS.radiusPill, border: '1.5px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.12)', color: DS.white, cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: DS.fontFamily, transition: 'all 0.3s ease', outline: 'none' }}><RotateCcw size={14} /> Reset</button>
            </div>

            {/* Mode Tabs */}
            {config.showModeSelector && (
                <div style={{ display: 'flex', gap: '4px', padding: '12px 18px', background: DS.white, borderBottom: `1px solid ${DS.gray300}` }}>
                    {config.enabledModes.map((mode, i) => {
                        const mc = modeConfig[mode]; const Icon = mc.icon; const act = selectedMode === mode;
                        return <button key={mode} onClick={() => { setSelectedMode(mode); resetCircuit(); }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '10px 16px', borderRadius: DS.radiusPill, border: act ? `2px solid ${mc.color}` : '2px solid transparent', background: act ? mc.bg : 'transparent', color: act ? mc.color : DS.gray500, cursor: 'pointer', fontWeight: act ? 700 : 500, fontSize: '13px', fontFamily: DS.fontFamily, transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)', animation: `modeTabIn 0.3s ease-out ${i * 0.08}s both`, outline: 'none' }}><Icon size={16} />{mc.label}</button>;
                    })}
                </div>
            )}

            {/* Content */}
            <div style={{ flex: 1, padding: '16px 18px', overflowY: 'auto' }}>
                {selectedMode === 'learn' && renderLearn()}
                {selectedMode === 'practice' && renderPractice()}
                {selectedMode === 'real_world' && renderRealWorld()}
            </div>

            {/* Confetti */}
            {showConfetti && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 100 }}>{Array.from({ length: 35 }, (_, i) => <div key={i} style={{ position: 'absolute', left: `${Math.random() * 100}%`, top: `${55 + Math.random() * 45}%`, fontSize: `${14 + Math.random() * 18}px`, animation: `confetti ${1.2 + Math.random() * 2}s ease-out ${Math.random() * 0.6}s forwards` }}>{['⚡', '🎉', '✨', '🌟', '💡', '🏆', '🎊'][i % 7]}</div>)}</div>}
        </div>
    );
};

export default ConductorInsulatorTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════