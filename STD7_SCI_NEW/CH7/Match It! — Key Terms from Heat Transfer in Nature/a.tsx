// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: chapter_summary_matching_tool.tsx
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ==================== INLINE SVG ICONS (replaces lucide-react) ====================

interface IconProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
    style?: React.CSSProperties;
}

const BookOpen: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
);

const Target: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
);

const RotateCcw: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
);

const Check: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const XIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const Award: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
);

const Star: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const Zap: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

const ChevronRight: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

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

// ADDITIONAL PROPS — TOOL SPECIFIC
interface TermDefinitionPair {
    term: string;
    definition: string;
    color: string;
    hint?: string;
    category?: string;
}

interface MatchingToolAdditionalProps {
    pairs?: TermDefinitionPair[];
    title?: string;
    subtitle?: string;
    instructionText?: string;
    showHints?: boolean;
    showCategories?: boolean;
    shuffleSeed?: number;
    teachingNotes?: string;
    categoryGroups?: {
        label: string;
        terms: string[];
        color: string;
    }[];
}

interface ChapterSummaryMatchingToolProps {
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
        additionalProps?: MatchingToolAdditionalProps;
    };
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DEFAULT DATA ====================

const DEFAULT_PAIRS: TermDefinitionPair[] = [
    {
        term: 'Conduction',
        definition: 'Transfer of heat through a material by direct contact, without the particles themselves moving from place to place.',
        color: '#E53935',
        hint: 'Think about touching a hot pan — heat flows through the solid metal.',
        category: 'Heat Transfer',
    },
    {
        term: 'Convection',
        definition: 'Transfer of heat in liquids and gases where hot, less dense material rises and cooler, denser material sinks, creating a current.',
        color: '#1E88E5',
        hint: 'This definition mentions particles actually moving in a circular current.',
        category: 'Heat Transfer',
    },
    {
        term: 'Radiation',
        definition: 'Transfer of heat in the form of waves (infrared) that can travel through empty space without needing any medium.',
        color: '#FB8C00',
        hint: 'How does the Sun\'s heat reach the Earth through the vacuum of space?',
        category: 'Heat Transfer',
    },
    {
        term: 'Good Conductor',
        definition: 'A material that allows heat to pass through it easily and quickly, such as metals like copper and aluminium.',
        color: '#43A047',
        hint: 'Metals are great at this — that\'s why metal spoons get hot fast.',
        category: 'Materials',
    },
    {
        term: 'Insulator',
        definition: 'A material that does not allow heat to pass through it easily, such as wood, plastic, and air.',
        color: '#8E24AA',
        hint: 'This is the opposite of a conductor — think of why we use wooden handles.',
        category: 'Materials',
    },
    {
        term: 'Sea Breeze',
        definition: 'A cool breeze that blows from the sea toward the land during the day because land heats up faster than water.',
        color: '#00ACC1',
        hint: 'Happens during the DAY — land gets hot first, so wind comes from the cooler sea.',
        category: 'Wind Patterns',
    },
    {
        term: 'Land Breeze',
        definition: 'A breeze that blows from the land toward the sea at night because land cools down faster than water.',
        color: '#78909C',
        hint: 'Happens at NIGHT — land cools first, so wind blows the other way.',
        category: 'Wind Patterns',
    },
    {
        term: 'Infiltration',
        definition: 'The process by which rainwater seeps into the ground through the soil and fills the gaps between rocks below.',
        color: '#7E57C2',
        hint: 'Think about rainwater soaking into soil and going underground.',
        category: 'Groundwater',
    },
    {
        term: 'Aquifer',
        definition: 'An underground layer of permeable rock or sediment that holds and transmits groundwater, supplying wells and springs.',
        color: '#EC407A',
        hint: 'This is where groundwater is stored deep underground in rock layers.',
        category: 'Groundwater',
    },
];

// ==================== ANIMATION HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number): number =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOutElastic = (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1
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

// ==================== SHUFFLE HELPER ====================

function shuffleArray<T>(array: T[], seed?: number): T[] {
    const shuffled = [...array];
    let s = seed ?? Date.now();
    const random = () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ==================== MAIN COMPONENT ====================

const ChapterSummaryMatchingTool: React.FC<ChapterSummaryMatchingToolProps> = ({
    props = {},
    setStepDetails,
    stopAutoNext,
    setStopAutoNext,
}) => {
    // ─────────── CONFIGURATION ───────────
    const config = useMemo(() => ({
        width: props.width ?? 800,
        height: props.height ?? 600,
        initialMode: props.initialMode ?? 'practice',
        showModeSelector: props.showModeSelector ?? true,
        enabledModes: props.enabledModes ?? ['practice'],
        showNavigation: props.showNavigation ?? false,
        showPlayPause: props.showPlayPause ?? false,
        showStepIndicator: props.showStepIndicator ?? false,
        animationSpeed: props.animationSpeed ?? 1,
        autoPlayDuration: props.autoPlayDuration ?? 0,
        themeColor: props.themeColor ?? '#4A4DC9',
        darkMode: props.darkMode ?? false,
    }), [props]);

    // ─────────── ADDITIONAL PROPS ───────────
    const additionalProps = props.additionalProps || {};
    const pairs: TermDefinitionPair[] = additionalProps.pairs ?? DEFAULT_PAIRS;
    const toolTitle = additionalProps.title ?? 'In a Nutshell — Chapter Summary';
    const toolSubtitle = additionalProps.subtitle ?? 'Match each key term with its correct definition';
    const instructionText = additionalProps.instructionText ?? 'Tap a term, then tap its definition to match them!';
    const showHints = additionalProps.showHints ?? true;
    const showCategories = additionalProps.showCategories ?? true;

    // ─────────── STATE ───────────
    const [shuffledDefs, setShuffledDefs] = useState<TermDefinitionPair[]>([]);
    const [selectedTermIdx, setSelectedTermIdx] = useState<number | null>(null);
    const [selectedDefIdx, setSelectedDefIdx] = useState<number | null>(null);
    const [matches, setMatches] = useState<Map<number, number>>(new Map());
    const [incorrectPair, setIncorrectPair] = useState<{ term: number; def: number } | null>(null);
    const [hintText, setHintText] = useState<string>('');
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [celebrationParticles, setCelebrationParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>([]);
    const [shakeTermIdx, setShakeTermIdx] = useState<number | null>(null);
    const [shakeDefIdx, setShakeDefIdx] = useState<number | null>(null);
    const [lockAnimation, setLockAnimation] = useState<number | null>(null);
    const [hoveredTerm, setHoveredTerm] = useState<number | null>(null);
    const [hoveredDef, setHoveredDef] = useState<number | null>(null);
    const [showInstructions, setShowInstructions] = useState(true);
    const [attemptCount, setAttemptCount] = useState(0);
    const [lineUpdateKey, setLineUpdateKey] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    // *** KEY FIX: matchAreaRef sits on the scrollable div that DIRECTLY wraps the SVG + grid ***
    const matchAreaRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const termRefs = useRef<(HTMLDivElement | null)[]>([]);
    const defRefs = useRef<(HTMLDivElement | null)[]>([]);

    // ─────────── INIT ───────────
    useEffect(() => {
        setShuffledDefs(shuffleArray(pairs, additionalProps.shuffleSeed));
        setMounted(true);
        const timer = setTimeout(() => setShowInstructions(false), 5000);
        return () => clearTimeout(timer);
    }, [pairs, additionalProps.shuffleSeed]);

    // Force SVG line recalc on match changes, resize, or scroll
    useEffect(() => {
        const recalc = () => setLineUpdateKey(k => k + 1);
        window.addEventListener('resize', recalc);
        const area = matchAreaRef.current;
        if (area) area.addEventListener('scroll', recalc);
        const timer = setTimeout(recalc, 100);
        return () => {
            window.removeEventListener('resize', recalc);
            if (area) area.removeEventListener('scroll', recalc);
            clearTimeout(timer);
        };
    }, [matches]);

    // ─────────── INJECT KEYFRAMES ───────────
    useEffect(() => {
        const keyframes = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeInLeft {
                from { opacity: 0; transform: translateX(-40px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes fadeInRight {
                from { opacity: 0; transform: translateX(40px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes popIn {
                0% { transform: scale(0); opacity: 0; }
                70% { transform: scale(1.12); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 50%, 90% { transform: translateX(-6px); }
                30%, 70% { transform: translateX(6px); }
            }
            @keyframes checkPop {
                0% { transform: scale(0) rotate(-45deg); opacity: 0; }
                60% { transform: scale(1.3) rotate(5deg); }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
            @keyframes lockGlow {
                0% { box-shadow: 0 0 0 0 rgba(74, 77, 201, 0.5); }
                50% { box-shadow: 0 0 20px 8px rgba(74, 77, 201, 0.3); }
                100% { box-shadow: 0 0 0 0 rgba(74, 77, 201, 0); }
            }
            @keyframes drawLine {
                from { stroke-dashoffset: 1000; }
                to { stroke-dashoffset: 0; }
            }
            @keyframes confetti {
                0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
                100% { transform: translateY(-120px) rotate(720deg) scale(0); opacity: 0; }
            }
            @keyframes celebrateBounce {
                0%, 100% { transform: translateY(0) scale(1); }
                30% { transform: translateY(-20px) scale(1.05); }
                60% { transform: translateY(-8px) scale(1.02); }
            }
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-20px); max-height: 0; }
                to { opacity: 1; transform: translateY(0); max-height: 80px; }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            @keyframes starSpin {
                from { transform: rotate(0deg) scale(0); opacity: 0; }
                to { transform: rotate(360deg) scale(1); opacity: 1; }
            }
            @keyframes hintSlide {
                from { opacity: 0; transform: translateY(10px); max-height: 0; }
                to { opacity: 1; transform: translateY(0); max-height: 60px; }
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.id = 'matching-tool-keyframes';
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
        return () => {
            const existing = document.getElementById('matching-tool-keyframes');
            if (existing) document.head.removeChild(existing);
        };
    }, []);

    // ─────────── MATCH LOGIC ───────────
    const handleTermClick = useCallback((termIdx: number) => {
        if (matches.has(termIdx)) return;
        setSelectedTermIdx(termIdx);
        setShowHint(false);
        setHintText('');
        setIncorrectPair(null);
    }, [matches]);

    const handleDefClick = useCallback((defIdx: number) => {
        const matchedDefs = new Set(matches.values());
        if (matchedDefs.has(defIdx)) return;
        if (selectedTermIdx === null) return;

        setAttemptCount(prev => prev + 1);
        const termPair = pairs[selectedTermIdx];
        const defPair = shuffledDefs[defIdx];

        if (termPair.term === defPair.term) {
            // CORRECT
            const newMatches = new Map(matches);
            newMatches.set(selectedTermIdx, defIdx);
            setMatches(newMatches);
            setScore(prev => prev + 1);
            setLockAnimation(selectedTermIdx);
            setSelectedTermIdx(null);
            setSelectedDefIdx(null);
            setShowHint(false);
            setHintText('');

            setTimeout(() => setLockAnimation(null), 800);

            if (newMatches.size === pairs.length) {
                setTimeout(() => {
                    setIsComplete(true);
                    const particles: typeof celebrationParticles = [];
                    pairs.forEach((p, i) => {
                        for (let j = 0; j < 4; j++) {
                            particles.push({
                                id: i * 4 + j,
                                x: 20 + Math.random() * 60,
                                y: 30 + Math.random() * 40,
                                color: p.color,
                                delay: i * 0.1 + j * 0.05,
                            });
                        }
                    });
                    setCelebrationParticles(particles);
                }, 500);
            }
        } else {
            // INCORRECT
            setIncorrectPair({ term: selectedTermIdx, def: defIdx });
            setShakeTermIdx(selectedTermIdx);
            setShakeDefIdx(defIdx);

            if (showHints && termPair.hint) {
                setHintText(termPair.hint);
                setShowHint(true);
            }

            setTimeout(() => {
                setShakeTermIdx(null);
                setShakeDefIdx(null);
                setIncorrectPair(null);
            }, 600);

            setTimeout(() => {
                setSelectedTermIdx(null);
            }, 800);
        }
    }, [selectedTermIdx, matches, pairs, shuffledDefs, showHints, celebrationParticles]);

    // ─────────── RESET ───────────
    const handleReset = useCallback(() => {
        setMatches(new Map());
        setScore(0);
        setSelectedTermIdx(null);
        setSelectedDefIdx(null);
        setIncorrectPair(null);
        setHintText('');
        setShowHint(false);
        setIsComplete(false);
        setCelebrationParticles([]);
        setLockAnimation(null);
        setShakeTermIdx(null);
        setShakeDefIdx(null);
        setAttemptCount(0);
        setShuffledDefs(shuffleArray(pairs, Date.now()));
    }, [pairs]);

    // ═══════════════════════════════════════════════════════════════════
    // *** FIXED: getLineCoords uses matchAreaRef (SVG's direct parent)
    //     instead of containerRef, and accounts for scroll offset ***
    // ═══════════════════════════════════════════════════════════════════
    const getLineCoords = useCallback((termIdx: number, defIdx: number) => {
        const termEl = termRefs.current[termIdx];
        const defEl = defRefs.current[defIdx];
        const area = matchAreaRef.current;
        if (!termEl || !defEl || !area) return null;

        const areaRect = area.getBoundingClientRect();
        const scrollTop = area.scrollTop;
        const scrollLeft = area.scrollLeft;
        const termRect = termEl.getBoundingClientRect();
        const defRect = defEl.getBoundingClientRect();

        // All coordinates relative to matchAreaRef, with scroll offset
        return {
            x1: termRect.right - areaRect.left + scrollLeft,
            y1: termRect.top + termRect.height / 2 - areaRect.top + scrollTop,
            x2: defRect.left - areaRect.left + scrollLeft,
            y2: defRect.top + defRect.height / 2 - areaRect.top + scrollTop,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lineUpdateKey]);

    // Smooth cubic-bezier SVG path
    const getBezierPath = useCallback((c: { x1: number; y1: number; x2: number; y2: number }) => {
        const gap = c.x2 - c.x1;
        const cpOff = Math.max(gap * 0.5, 40);
        return `M ${c.x1} ${c.y1} C ${c.x1 + cpOff} ${c.y1}, ${c.x2 - cpOff} ${c.y2}, ${c.x2} ${c.y2}`;
    }, []);

    // ─────────── CATEGORY LABELS ───────────
    const categories = useMemo(() => {
        if (!showCategories) return null;
        return additionalProps.categoryGroups ?? [
            { label: 'Heat Transfer', terms: ['Conduction', 'Convection', 'Radiation'], color: '#FF7212' },
            { label: 'Materials', terms: ['Good Conductor', 'Insulator'], color: '#533086' },
            { label: 'Wind Patterns', terms: ['Sea Breeze', 'Land Breeze'], color: '#00ACC1' },
            { label: 'Groundwater', terms: ['Infiltration', 'Aquifer'], color: '#EC407A' },
        ];
    }, [showCategories, additionalProps.categoryGroups]);

    // ─────────── STEP DETAILS ───────────
    useEffect(() => {
        if (setStepDetails) {
            setStepDetails({
                currentStep: score,
                totalSteps: pairs.length,
                isPaused: false,
                currentMode: 'practice',
            });
        }
    }, [score, pairs.length, setStepDetails]);

    // ─────────── RENDER ───────────
    const matchedDefs = new Set(matches.values());
    const accuracy = attemptCount > 0 ? Math.round((score / attemptCount) * 100) : 0;

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                maxWidth: config.width,
                minHeight: config.height,
                fontFamily: "'Poppins', sans-serif",
                background: config.darkMode
                    ? 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
                    : 'linear-gradient(160deg, #F8F7FF 0%, #FEFCF6 40%, #F0F4FF 100%)',
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 20px 60px -12px rgba(74, 77, 201, 0.15), 0 0 0 1px rgba(74, 77, 201, 0.06)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                margin: '0 auto',
            }}
        >
            {/* ════════ HEADER ════════ */}
            <div style={{
                background: 'linear-gradient(135deg, #4A4DC9 0%, #533086 60%, #FC9145 100%)',
                padding: '20px 28px 16px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                <div style={{ position: 'absolute', bottom: -20, left: 40, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <BookOpen size={22} color="#FFF3E4" />
                            <h1 style={{
                                margin: 0, fontSize: 20, fontWeight: 700, color: '#ffffff',
                                letterSpacing: '-0.3px',
                                animation: mounted ? 'fadeInLeft 0.6s ease-out' : 'none',
                            }}>{toolTitle}</h1>
                        </div>
                        <p style={{
                            margin: 0, fontSize: 13, color: '#FFF3E4', fontWeight: 400, opacity: 0.9,
                            animation: mounted ? 'fadeInLeft 0.6s ease-out 0.1s both' : 'none',
                        }}>{toolSubtitle}</p>
                    </div>

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        animation: mounted ? 'fadeInRight 0.6s ease-out 0.2s both' : 'none',
                    }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                            borderRadius: 16, padding: '8px 18px',
                            display: 'flex', alignItems: 'center', gap: 8,
                            border: '1px solid rgba(255,255,255,0.15)',
                        }}>
                            <Target size={18} color="#FFF3E4" />
                            <span style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>
                                {score}<span style={{ fontSize: 13, fontWeight: 400, opacity: 0.7 }}>/{pairs.length}</span>
                            </span>
                        </div>
                        <button
                            onClick={handleReset}
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: 12, padding: '8px 10px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.3s ease', color: '#ffffff',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.3)'; (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(-90deg)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(0deg)'; }}
                            title="Reset"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>
                </div>

                <div style={{
                    marginTop: 14, height: 6, background: 'rgba(255,255,255,0.15)',
                    borderRadius: 3, overflow: 'hidden', position: 'relative', zIndex: 1,
                }}>
                    <div style={{
                        height: '100%', width: `${(score / pairs.length) * 100}%`,
                        background: 'linear-gradient(90deg, #FFF3E4, #FC9145)',
                        borderRadius: 3, transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }} />
                </div>
            </div>

            {/* ════════ INSTRUCTION BANNER ════════ */}
            {showInstructions && !isComplete && (
                <div style={{
                    background: 'linear-gradient(90deg, #C1C1EA30, #FFF3E440)',
                    borderBottom: '1px solid #C1C1EA40', padding: '10px 28px',
                    display: 'flex', alignItems: 'center', gap: 10, animation: 'slideDown 0.4s ease-out',
                }}>
                    <Zap size={16} color="#4A4DC9" />
                    <span style={{ fontSize: 13, color: '#4E4E4E', fontWeight: 500 }}>{instructionText}</span>
                    <button onClick={() => setShowInstructions(false)} style={{
                        marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
                        color: '#CACACA', padding: 4, borderRadius: 4, display: 'flex',
                    }}><XIcon size={14} /></button>
                </div>
            )}

            {/* ════════ HINT BANNER ════════ */}
            {showHint && hintText && (
                <div style={{
                    background: 'linear-gradient(90deg, #FFF3E4, #FFF9F0)',
                    borderBottom: '2px solid #FC914540', padding: '10px 28px',
                    display: 'flex', alignItems: 'center', gap: 10, animation: 'hintSlide 0.3s ease-out',
                }}>
                    <div style={{ background: '#FC9145', borderRadius: 8, padding: '3px 6px', display: 'flex' }}>
                        <Star size={14} color="#fff" />
                    </div>
                    <span style={{ fontSize: 12.5, color: '#533086', fontWeight: 500, lineHeight: 1.4 }}>
                        💡 Hint: {hintText}
                    </span>
                </div>
            )}

            {/* ════════════════════════════════════════════════════════════
                 MAIN MATCHING AREA — matchAreaRef is the SVG coord system
                 ════════════════════════════════════════════════════════════ */}
            <div
                ref={matchAreaRef}
                style={{
                    flex: 1,
                    padding: '20px 24px',
                    position: 'relative',
                    overflow: 'auto',
                }}
            >
                {/* SVG — lines are drawn relative to THIS div */}
                <svg
                    ref={svgRef}
                    style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 5,
                        overflow: 'visible',
                    }}
                >
                    <defs>
                        {Array.from(matches.entries()).map(([termIdx]) => (
                            <filter key={`glow-${termIdx}`} id={`glow-${termIdx}`} x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="2.5" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        ))}
                    </defs>

                    {Array.from(matches.entries()).map(([termIdx, defIdx]) => {
                        const coords = getLineCoords(termIdx, defIdx);
                        if (!coords) return null;

                        const color = pairs[termIdx].color;
                        const pathD = getBezierPath(coords);
                        const midX = (coords.x1 + coords.x2) / 2;
                        const midY = (coords.y1 + coords.y2) / 2;

                        return (
                            <g key={`line-${termIdx}-${defIdx}`}>
                                {/* Glow shadow */}
                                <path d={pathD} fill="none" stroke={color} strokeWidth={8}
                                    strokeLinecap="round" opacity={0.12}
                                    style={{ strokeDasharray: 1000, strokeDashoffset: 0, animation: 'drawLine 0.7s ease-out' }}
                                />
                                {/* Main bezier curve */}
                                <path d={pathD} fill="none" stroke={color} strokeWidth={2.5}
                                    strokeLinecap="round"
                                    filter={`url(#glow-${termIdx})`}
                                    style={{ strokeDasharray: 1000, strokeDashoffset: 0, animation: 'drawLine 0.7s ease-out' }}
                                />
                                {/* Checkmark badge at curve midpoint */}
                                <circle cx={midX} cy={midY} r={13} fill={color}
                                    stroke="#fff" strokeWidth={2}
                                    style={{ animation: 'checkPop 0.4s ease-out 0.35s both' }}
                                />
                                <text x={midX} y={midY + 1} textAnchor="middle" dominantBaseline="central"
                                    fill="#fff" fontSize={12} fontWeight={700}
                                    style={{ animation: 'checkPop 0.4s ease-out 0.45s both' }}
                                >✓</text>
                            </g>
                        );
                    })}
                </svg>

                {/* Two-column grid */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                    gap: 20, position: 'relative', zIndex: 2,
                }}>
                    {/* ──── LEFT: Terms ──── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{
                            fontSize: 11, fontWeight: 700, color: '#4A4DC9',
                            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4, paddingLeft: 4,
                        }}>Key Terms</div>

                        {pairs.map((pair, idx) => {
                            const isMatched = matches.has(idx);
                            const isSelected = selectedTermIdx === idx;
                            const isShaking = shakeTermIdx === idx;
                            const isLocking = lockAnimation === idx;

                            return (
                                <div
                                    key={`term-${idx}`}
                                    ref={el => termRefs.current[idx] = el}
                                    onClick={() => !isMatched && handleTermClick(idx)}
                                    onMouseEnter={() => !isMatched && setHoveredTerm(idx)}
                                    onMouseLeave={() => setHoveredTerm(null)}
                                    style={{
                                        padding: '12px 16px', borderRadius: 14,
                                        border: `2.5px solid ${isMatched ? pair.color : isSelected ? pair.color : hoveredTerm === idx ? pair.color + '80' : '#EBEBEB'}`,
                                        background: isMatched
                                            ? `linear-gradient(135deg, ${pair.color}12, ${pair.color}08)`
                                            : isSelected ? `linear-gradient(135deg, ${pair.color}18, ${pair.color}10)`
                                                : hoveredTerm === idx ? '#FAFAFE' : '#ffffff',
                                        cursor: isMatched ? 'default' : 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        animation: isShaking ? 'shake 0.5s ease-in-out'
                                            : isLocking ? 'lockGlow 0.8s ease-out'
                                                : mounted ? `fadeInLeft 0.5s ease-out ${idx * 0.06}s both` : 'none',
                                        transform: isSelected && !isShaking ? 'scale(1.03)' : hoveredTerm === idx && !isMatched ? 'scale(1.02)' : 'scale(1)',
                                        boxShadow: isSelected ? `0 4px 20px ${pair.color}30` : isMatched ? `0 2px 8px ${pair.color}15` : '0 1px 3px rgba(0,0,0,0.04)',
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        position: 'relative', opacity: isMatched ? 0.75 : 1,
                                        userSelect: 'none' as const,
                                    }}
                                >
                                    <div style={{
                                        width: 12, height: 12, borderRadius: '50%',
                                        background: pair.color, flexShrink: 0,
                                        boxShadow: `0 0 0 3px ${pair.color}25`,
                                        transition: 'all 0.3s ease',
                                        transform: isSelected ? 'scale(1.3)' : 'scale(1)',
                                    }} />
                                    <span style={{
                                        fontSize: 14, fontWeight: 600,
                                        color: isMatched ? pair.color : '#333',
                                        fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.2px',
                                    }}>{pair.term}</span>
                                    {isMatched && (
                                        <div style={{
                                            marginLeft: 'auto', background: pair.color, borderRadius: '50%',
                                            width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            animation: 'checkPop 0.4s ease-out', flexShrink: 0,
                                        }}><Check size={13} color="#fff" strokeWidth={3} /></div>
                                    )}
                                    {isSelected && !isMatched && (
                                        <ChevronRight size={16} color={pair.color}
                                            style={{ marginLeft: 'auto', animation: 'pulse 1s ease-in-out infinite' }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ──── RIGHT: Definitions ──── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{
                            fontSize: 11, fontWeight: 700, color: '#533086',
                            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4, paddingLeft: 4,
                        }}>Definitions</div>

                        {shuffledDefs.map((defPair, defIdx) => {
                            const isDefMatched = matchedDefs.has(defIdx);
                            const matchedTermIdx = Array.from(matches.entries()).find(([_, dIdx]) => dIdx === defIdx)?.[0];
                            const matchedColor = matchedTermIdx !== undefined ? pairs[matchedTermIdx].color : '#EBEBEB';
                            const isShaking = shakeDefIdx === defIdx;
                            const isIncorrect = incorrectPair?.def === defIdx;

                            return (
                                <div
                                    key={`def-${defIdx}`}
                                    ref={el => defRefs.current[defIdx] = el}
                                    onClick={() => handleDefClick(defIdx)}
                                    onMouseEnter={() => !isDefMatched && setHoveredDef(defIdx)}
                                    onMouseLeave={() => setHoveredDef(null)}
                                    style={{
                                        padding: '12px 16px', borderRadius: 14,
                                        border: `2.5px solid ${isDefMatched ? matchedColor : isIncorrect ? '#E53935' : hoveredDef === defIdx && selectedTermIdx !== null ? '#4A4DC9' + '80' : '#EBEBEB'}`,
                                        background: isDefMatched
                                            ? `linear-gradient(135deg, ${matchedColor}10, ${matchedColor}05)`
                                            : isIncorrect ? '#FFF0F0'
                                                : hoveredDef === defIdx && selectedTermIdx !== null ? '#F8F7FF' : '#ffffff',
                                        cursor: isDefMatched ? 'default' : selectedTermIdx !== null ? 'pointer' : 'default',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        animation: isShaking ? 'shake 0.5s ease-in-out'
                                            : mounted ? `fadeInRight 0.5s ease-out ${defIdx * 0.06}s both` : 'none',
                                        transform: hoveredDef === defIdx && selectedTermIdx !== null && !isDefMatched ? 'scale(1.02)' : 'scale(1)',
                                        boxShadow: isDefMatched ? `0 2px 8px ${matchedColor}12` : '0 1px 3px rgba(0,0,0,0.04)',
                                        opacity: isDefMatched ? 0.75 : 1,
                                        position: 'relative',
                                        userSelect: 'none' as const,
                                    }}
                                >
                                    <span style={{
                                        fontSize: 12.5, fontWeight: 400, color: isDefMatched ? '#666' : '#4E4E4E',
                                        lineHeight: 1.55, fontFamily: "'Poppins', sans-serif",
                                    }}>{defPair.definition}</span>
                                    {isDefMatched && (
                                        <div style={{
                                            position: 'absolute', top: 8, right: 8,
                                            background: matchedColor, borderRadius: '50%',
                                            width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            animation: 'checkPop 0.4s ease-out',
                                        }}><Check size={12} color="#fff" strokeWidth={3} /></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ════════ COMPLETION OVERLAY ════════ */}
            {isComplete && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    zIndex: 20, animation: 'fadeInUp 0.5s ease-out',
                }}>
                    {celebrationParticles.map(p => (
                        <div key={p.id} style={{
                            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
                            width: 10, height: 10,
                            borderRadius: p.id % 3 === 0 ? '50%' : p.id % 3 === 1 ? '2px' : '0',
                            background: p.color,
                            animation: `confetti 1.5s ease-out ${p.delay}s both`, pointerEvents: 'none',
                        }} />
                    ))}

                    <div style={{ animation: 'starSpin 0.6s ease-out', marginBottom: 16 }}>
                        <Award size={56} color="#FC9145" strokeWidth={1.5} />
                    </div>

                    <h2 style={{
                        margin: 0, fontSize: 28, fontWeight: 800,
                        background: 'linear-gradient(135deg, #4A4DC9, #533086, #FC9145)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        fontFamily: "'Poppins', sans-serif",
                        animation: 'celebrateBounce 0.8s ease-out 0.3s both',
                    }}>All Matched! 🎉</h2>

                    <p style={{
                        margin: '8px 0 0', fontSize: 15, color: '#4E4E4E', fontWeight: 500,
                        fontFamily: "'Poppins', sans-serif",
                        animation: 'fadeInUp 0.5s ease-out 0.4s both',
                    }}>You matched all {pairs.length} terms correctly!</p>

                    <div style={{
                        display: 'flex', gap: 24, marginTop: 20,
                        animation: 'fadeInUp 0.5s ease-out 0.5s both',
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#4A4DC9' }}>{score}/{pairs.length}</div>
                            <div style={{ fontSize: 11, color: '#999', fontWeight: 500 }}>Score</div>
                        </div>
                        <div style={{ width: 1, background: '#EBEBEB' }} />
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#533086' }}>{accuracy}%</div>
                            <div style={{ fontSize: 11, color: '#999', fontWeight: 500 }}>Accuracy</div>
                        </div>
                        <div style={{ width: 1, background: '#EBEBEB' }} />
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#FC9145' }}>{attemptCount}</div>
                            <div style={{ fontSize: 11, color: '#999', fontWeight: 500 }}>Attempts</div>
                        </div>
                    </div>

                    {categories && (
                        <div style={{
                            marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 8,
                            justifyContent: 'center', animation: 'fadeInUp 0.5s ease-out 0.6s both',
                        }}>
                            {categories.map((cat, ci) => (
                                <div key={ci} style={{
                                    background: `${cat.color}12`, border: `1.5px solid ${cat.color}30`,
                                    borderRadius: 10, padding: '6px 14px', fontSize: 12,
                                    fontWeight: 600, color: cat.color, fontFamily: "'Poppins', sans-serif",
                                }}>{cat.label}: {cat.terms.join(', ')}</div>
                            ))}
                        </div>
                    )}

                    <button onClick={handleReset} style={{
                        marginTop: 24, padding: '12px 32px', borderRadius: 14, border: 'none',
                        background: 'linear-gradient(135deg, #4A4DC9, #533086)',
                        color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: "'Poppins', sans-serif",
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                        transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(74, 77, 201, 0.3)',
                        animation: 'fadeInUp 0.5s ease-out 0.7s both',
                    }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 25px rgba(74, 77, 201, 0.4)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 15px rgba(74, 77, 201, 0.3)'; }}
                    >
                        <RotateCcw size={16} />
                        Try Again
                    </button>
                </div>
            )}

            {/* ════════ FOOTER ════════ */}
            <div style={{
                padding: '12px 28px', borderTop: '1px solid #EBEBEB',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFAFE',
            }}>
                <div style={{ display: 'flex', gap: 6 }}>
                    {pairs.map((p, i) => (
                        <div key={i} style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: matches.has(i) ? p.color : '#EBEBEB',
                            transition: 'all 0.4s ease',
                            transform: matches.has(i) ? 'scale(1.3)' : 'scale(1)',
                        }} />
                    ))}
                </div>
                {attemptCount > 0 && !isComplete && (
                    <span style={{ fontSize: 11, color: '#CACACA', fontWeight: 500, fontFamily: "'Poppins', sans-serif" }}>
                        Accuracy: {accuracy}% • Attempts: {attemptCount}
                    </span>
                )}
            </div>
        </div>
    );
};

export default ChapterSummaryMatchingTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════