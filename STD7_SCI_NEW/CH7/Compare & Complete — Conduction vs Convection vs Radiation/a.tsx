// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: heat_transfer_comparison_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Check, RotateCcw, Award, Star, Zap } from 'lucide-react';

// ==================== DESIGN SYSTEM TOKENS ====================

const DS = {
    // Primary
    primary: '#4A4DC9',
    accent: '#FF7212',
    // Gradient
    gradientStart: '#533086',
    gradientEnd: '#FC9145',
    // Light variants
    primaryLight: '#C1C1EA',
    accentLight: '#FFF3E4',
    // Neutrals
    neutral900: '#4E4E4E',
    neutral400: '#CACACA',
    neutral200: '#EBEBEB',
    neutral100: '#F5F5F5',
    white: '#FFFFFF',
    // Functional
    success: '#2DB563',
    error: '#E53935',
    // Radii
    radiusSm: 8,
    radiusMd: 12,
    radiusLg: 20,
    radiusXl: 28,
    radiusFull: 999,
    // Spacing
    sp4: 4,
    sp8: 8,
    sp12: 12,
    sp16: 16,
    sp20: 20,
    sp24: 24,
    sp32: 32,
    sp40: 40,
    // Font
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
};

// Column-specific palette mapped to design system
const COL_COLORS: Record<string, { main: string; light: string; bg: string; text: string }> = {
    conduction: {
        main: DS.primary,
        light: DS.primaryLight,
        bg: '#EEEEF9',
        text: DS.primary,
    },
    convection: {
        main: DS.gradientStart,
        light: '#D8C4EB',
        bg: '#F3EDF9',
        text: DS.gradientStart,
    },
    radiation: {
        main: DS.accent,
        light: DS.accentLight,
        bg: '#FFF8F0',
        text: '#D45A00',
    },
};

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

interface ComparisonTableAdditionalProps {
    columns?: { id: string; label: string; color: string; icon?: string }[];
    rows?: { id: string; label: string }[];
    answers?: { rowId: string; colId: string; text: string; hint?: string }[];
    showHints?: boolean;
    shuffleTiles?: boolean;
    celebrationStyle?: 'confetti' | 'glow' | 'fireworks';
}

interface HeatTransferComparisonToolProps {
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
        additionalProps?: ComparisonTableAdditionalProps;
    };
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== ANIMATION HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
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

// ==================== DEFAULT DATA ====================

const DEFAULT_COLUMNS = [
    { id: 'conduction', label: 'Conduction', color: COL_COLORS.conduction.main, icon: 'spoon' },
    { id: 'convection', label: 'Convection', color: COL_COLORS.convection.main, icon: 'waves' },
    { id: 'radiation', label: 'Radiation', color: COL_COLORS.radiation.main, icon: 'sun' },
];

const DEFAULT_ROWS = [
    { id: 'definition', label: 'What is it?' },
    { id: 'particle', label: 'Do particles move?' },
    { id: 'medium', label: 'Needs a medium?' },
    { id: 'occurs', label: 'Occurs mainly in' },
    { id: 'example', label: 'Everyday example' },
];

const DEFAULT_ANSWERS = [
    { rowId: 'definition', colId: 'conduction', text: 'Heat passes from particle to particle by direct contact', hint: 'Think about touching a hot metal spoon' },
    { rowId: 'definition', colId: 'convection', text: 'Heat moves as hot fluid rises and cool fluid sinks', hint: 'Think about boiling water or wind' },
    { rowId: 'definition', colId: 'radiation', text: 'Heat travels as invisible rays through empty space', hint: 'Think about warmth from the Sun or a fireplace' },
    { rowId: 'particle', colId: 'conduction', text: 'No — particles vibrate in place and pass energy along', hint: 'Particles stay fixed but shake faster' },
    { rowId: 'particle', colId: 'convection', text: 'Yes — particles physically move from one place to another', hint: 'Hot water actually rises upward' },
    { rowId: 'particle', colId: 'radiation', text: 'No particles needed — energy travels as electromagnetic waves', hint: 'Sunlight crosses empty space to reach Earth' },
    { rowId: 'medium', colId: 'conduction', text: 'Yes — needs a solid, liquid, or gas medium', hint: 'Heat must travel through a material' },
    { rowId: 'medium', colId: 'convection', text: 'Yes — needs a fluid (liquid or gas)', hint: 'Only liquids and gases can flow' },
    { rowId: 'medium', colId: 'radiation', text: 'No — can travel through vacuum (empty space)', hint: "The Sun's heat reaches us through space" },
    { rowId: 'occurs', colId: 'conduction', text: 'Mainly in solids', hint: 'Metals conduct heat very well' },
    { rowId: 'occurs', colId: 'convection', text: 'In liquids and gases', hint: 'Sea breeze and boiling water are examples' },
    { rowId: 'occurs', colId: 'radiation', text: 'Everywhere — even through empty space', hint: 'Works with or without a medium' },
    { rowId: 'example', colId: 'conduction', text: 'Metal tawa getting hot on a gas stove', hint: 'A cooking utensil on a flame' },
    { rowId: 'example', colId: 'convection', text: 'Sea breeze blowing cool air from the ocean', hint: 'Wind near coastal areas like Kerala' },
    { rowId: 'example', colId: 'radiation', text: 'Feeling warm near a fireplace or angithi', hint: 'Warmth without touching the fire' },
];

// ==================== SHUFFLE UTILITY ====================

function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ==================== ICON COMPONENTS (Geometric DS style) ====================

const SpoonIcon: React.FC<{ size?: number; color?: string }> = ({ size = 26, color = DS.primary }) => (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <ellipse cx="14" cy="9" rx="5.5" ry="6.5" fill={color} opacity="0.18" />
        <ellipse cx="14" cy="9" rx="4.5" ry="5.5" stroke={color} strokeWidth="1.8" fill="none" />
        <line x1="14" y1="14.5" x2="14" y2="26" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
);

const WavesIcon: React.FC<{ size?: number; color?: string }> = ({ size = 26, color = DS.gradientStart }) => (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path d="M3 10c2.5-3.5 5-3.5 7.5 0s5 3.5 7.5 0 5-3.5 7.5 0" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none">
            <animate attributeName="d" values="M3 10c2.5-3.5 5-3.5 7.5 0s5 3.5 7.5 0 5-3.5 7.5 0;M3 12c2.5-3.5 5-3.5 7.5 0s5 3.5 7.5 0 5-3.5 7.5 0;M3 10c2.5-3.5 5-3.5 7.5 0s5 3.5 7.5 0 5-3.5 7.5 0" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path d="M3 18c2.5-3.5 5-3.5 7.5 0s5 3.5 7.5 0 5-3.5 7.5 0" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.45">
            <animate attributeName="d" values="M3 18c2.5-3.5 5-3.5 7.5 0s5 3.5 7.5 0 5-3.5 7.5 0;M3 20c2.5-3.5 5-3.5 7.5 0s5 3.5 7.5 0 5-3.5 7.5 0;M3 18c2.5-3.5 5-3.5 7.5 0s5 3.5 7.5 0 5-3.5 7.5 0" dur="2.5s" begin="0.4s" repeatCount="indefinite" />
        </path>
    </svg>
);

const SunRaysIcon: React.FC<{ size?: number; color?: string }> = ({ size = 26, color = DS.accent }) => (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="4.5" fill={color} opacity="0.22" />
        <circle cx="14" cy="14" r="3.5" stroke={color} strokeWidth="1.8" fill="none" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 14 + 7 * Math.cos(rad);
            const y1 = 14 + 7 * Math.sin(rad);
            const x2 = 14 + 10 * Math.cos(rad);
            const y2 = 14 + 10 * Math.sin(rad);
            return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.8" strokeLinecap="round">
                    <animate attributeName="opacity" values="1;0.35;1" dur="2.2s" begin={`${i * 0.18}s`} repeatCount="indefinite" />
                </line>
            );
        })}
    </svg>
);

const getColumnIcon = (iconType: string, color: string) => {
    switch (iconType) {
        case 'spoon': return <SpoonIcon size={26} color={color} />;
        case 'waves': return <WavesIcon size={26} color={color} />;
        case 'sun': return <SunRaysIcon size={26} color={color} />;
        default: return null;
    }
};

const getColPalette = (colId: string) => {
    return COL_COLORS[colId] || { main: DS.primary, light: DS.primaryLight, bg: '#EEEEF9', text: DS.primary };
};

// ==================== CONFETTI (DS palette) ====================

const Confetti: React.FC<{ active: boolean }> = ({ active }) => {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; rotation: number; size: number; speed: number }[]>([]);

    useEffect(() => {
        if (!active) { setParticles([]); return; }
        const colors = [DS.primary, DS.accent, DS.gradientStart, DS.gradientEnd, DS.primaryLight, '#FFD600'];
        const newParticles = Array.from({ length: 55 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: -10 - Math.random() * 30,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            size: 5 + Math.random() * 8,
            speed: 1.5 + Math.random() * 3,
        }));
        setParticles(newParticles);
    }, [active]);

    if (!active || particles.length === 0) return null;

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden', zIndex: 100 }}>
            {particles.map(p => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size * 0.6,
                        backgroundColor: p.color,
                        borderRadius: 2,
                        transform: `rotate(${p.rotation}deg)`,
                        animation: `confettiFall ${2 + p.speed}s ease-in forwards`,
                        animationDelay: `${p.id * 0.03}s`,
                        opacity: 0.9,
                    }}
                />
            ))}
        </div>
    );
};

// ==================== MAIN COMPONENT ====================

const HeatTransferComparisonTool: React.FC<HeatTransferComparisonToolProps> = ({
    props = {},
    setStepDetails,
    stopAutoNext,
    setStopAutoNext
}) => {
    // ─── CONFIGURATION ───
    const config = useMemo(() => ({
        width: props.width ?? 800,
        height: props.height ?? 600,
        themeColor: props.themeColor ?? DS.primary,
        darkMode: props.darkMode ?? false,
        animationSpeed: props.animationSpeed ?? 1,
    }), [props]);

    const additionalProps = props.additionalProps || {};
    const columns = additionalProps.columns || DEFAULT_COLUMNS;
    const rows = additionalProps.rows || DEFAULT_ROWS;
    const answers = additionalProps.answers || DEFAULT_ANSWERS;
    const showHints = additionalProps.showHints ?? true;

    // ─── STATE ───
    const [shuffledTiles, setShuffledTiles] = useState<typeof answers>([]);
    const [placements, setPlacements] = useState<Record<string, typeof answers[0] | null>>({});
    const [correctCells, setCorrectCells] = useState<Set<string>>(new Set());
    const [wrongAttemptCell, setWrongAttemptCell] = useState<string | null>(null);
    const [hintText, setHintText] = useState<string>('');
    const [draggedTile, setDraggedTile] = useState<typeof answers[0] | null>(null);
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [tileEntryDone, setTileEntryDone] = useState(false);
    const [summaryStep, setSummaryStep] = useState(0);
    const [touchDragTile, setTouchDragTile] = useState<typeof answers[0] | null>(null);
    const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    // ─── KEYFRAMES INJECTION ───
    useEffect(() => {
        const keyframes = `
            @keyframes dsfadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes dsFadeInScale { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
            @keyframes dsPopIn { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
            @keyframes dsBounceBack { 0% { transform: translateX(0); } 20% { transform: translateX(-10px); } 40% { transform: translateX(7px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(2px); } 100% { transform: translateX(0); } }
            @keyframes dsCorrectPulse { 0% { box-shadow: 0 0 0 0 rgba(45,181,99,0.5); } 70% { box-shadow: 0 0 0 10px rgba(45,181,99,0); } 100% { box-shadow: 0 0 0 0 rgba(45,181,99,0); } }
            @keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(700px) rotate(720deg); opacity: 0; } }
            @keyframes dsSlideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes dsTileFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
            @keyframes dsSummaryHighlight { 0% { opacity: 0; transform: scale(0.96); } 100% { opacity: 1; transform: scale(1); } }
            @keyframes dsGradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
            @keyframes dsDropArrow { 0%, 100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(4px); opacity: 0.9; } }
        `;
        const style = document.createElement('style');
        style.id = 'ht-ds-keyframes';
        style.textContent = keyframes;
        document.head.appendChild(style);
        return () => {
            const existing = document.getElementById('ht-ds-keyframes');
            if (existing) document.head.removeChild(existing);
        };
    }, []);

    // ─── INIT ───
    useEffect(() => {
        setMounted(true);
        setShuffledTiles(shuffleArray(answers));
        setTimeout(() => setTileEntryDone(true), answers.length * 55 + 400);
    }, [answers]);

    // ─── COMPLETION ───
    useEffect(() => {
        if (correctCells.size === answers.length && answers.length > 0) {
            setIsComplete(true);
            setTimeout(() => setShowCelebration(true), 400);
            setTimeout(() => setSummaryStep(1), 2000);
        }
    }, [correctCells, answers.length]);

    // ─── REPORT STEP DETAILS ───
    useEffect(() => {
        if (setStepDetails) {
            setStepDetails({
                currentStep: correctCells.size,
                totalSteps: answers.length,
                isPaused: false,
                currentMode: 'practice',
            });
        }
    }, [correctCells.size, answers.length, setStepDetails]);

    // ─── HANDLERS ───
    const getCellKey = (rowId: string, colId: string) => `${rowId}_${colId}`;

    const handleDragStart = useCallback((tile: typeof answers[0]) => {
        setDraggedTile(tile);
        setHintText('');
        setWrongAttemptCell(null);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, cellKey: string) => {
        e.preventDefault();
        setHoveredCell(cellKey);
    }, []);

    const handleDragLeave = useCallback(() => {
        setHoveredCell(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, rowId: string, colId: string) => {
        e.preventDefault();
        setHoveredCell(null);
        if (!draggedTile) return;

        const cellKey = getCellKey(rowId, colId);
        setAttempts(a => a + 1);

        if (draggedTile.rowId === rowId && draggedTile.colId === colId) {
            setPlacements(prev => ({ ...prev, [cellKey]: draggedTile }));
            setCorrectCells(prev => new Set(prev).add(cellKey));
            setShuffledTiles(prev => prev.filter(t => !(t.rowId === draggedTile.rowId && t.colId === draggedTile.colId)));
            setScore(s => s + 1);
            setHintText('');
        } else {
            setWrongAttemptCell(cellKey);
            if (showHints && draggedTile.hint) setHintText(draggedTile.hint);
            setTimeout(() => setWrongAttemptCell(null), 800);
        }
        setDraggedTile(null);
    }, [draggedTile, showHints]);

    const handleTileClick = useCallback((tile: typeof answers[0]) => {
        if (touchDragTile && touchDragTile.rowId === tile.rowId && touchDragTile.colId === tile.colId) {
            setTouchDragTile(null);
            return;
        }
        setTouchDragTile(tile);
        setHintText('');
        setWrongAttemptCell(null);
    }, [touchDragTile]);

    const handleCellClick = useCallback((rowId: string, colId: string) => {
        if (!touchDragTile) return;
        const cellKey = getCellKey(rowId, colId);
        if (correctCells.has(cellKey)) return;

        setAttempts(a => a + 1);

        if (touchDragTile.rowId === rowId && touchDragTile.colId === colId) {
            setPlacements(prev => ({ ...prev, [cellKey]: touchDragTile }));
            setCorrectCells(prev => new Set(prev).add(cellKey));
            setShuffledTiles(prev => prev.filter(t => !(t.rowId === touchDragTile.rowId && t.colId === touchDragTile.colId)));
            setScore(s => s + 1);
            setHintText('');
        } else {
            setWrongAttemptCell(cellKey);
            if (showHints && touchDragTile.hint) setHintText(touchDragTile.hint);
            setTimeout(() => setWrongAttemptCell(null), 800);
        }
        setTouchDragTile(null);
    }, [touchDragTile, correctCells, showHints]);

    const handleReset = useCallback(() => {
        setShuffledTiles(shuffleArray(answers));
        setPlacements({});
        setCorrectCells(new Set());
        setWrongAttemptCell(null);
        setHintText('');
        setDraggedTile(null);
        setTouchDragTile(null);
        setIsComplete(false);
        setShowCelebration(false);
        setScore(0);
        setAttempts(0);
        setSummaryStep(0);
    }, [answers]);

    // ─── DERIVED ───
    const progressPercent = (correctCells.size / answers.length) * 100;
    const accuracy = attempts > 0 ? Math.round((score / attempts) * 100) : 0;

    // ─── DARK MODE TOKENS ───
    const bgColor = config.darkMode ? '#1A1A2E' : DS.white;
    const cardBg = config.darkMode ? '#232347' : DS.white;
    const surfaceBg = config.darkMode ? '#16163A' : DS.neutral100;
    const textPrimary = config.darkMode ? '#EAEAF6' : DS.neutral900;
    const textSecondary = config.darkMode ? '#9E9EB8' : '#7A7A8E';
    const borderBase = config.darkMode ? '#33335A' : DS.neutral200;

    return (
        <div
            ref={containerRef}
            style={{
                width: config.width,
                maxWidth: '100%',
                minHeight: config.height,
                background: bgColor,
                borderRadius: DS.radiusLg,
                overflow: 'hidden',
                fontFamily: DS.fontFamily,
                position: 'relative',
                boxShadow: '0 4px 32px rgba(74,77,201,0.08), 0 1px 4px rgba(0,0,0,0.04)',
                animation: mounted ? 'dsFadeInScale 0.5s ease-out' : 'none',
                display: 'flex',
                flexDirection: 'column',
                border: `1px solid ${borderBase}`,
            }}
        >
            {/* Google Font — Poppins (DS Font) */}
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

            {/* Confetti */}
            <Confetti active={showCelebration} />

            {/* ═══════════ HEADER — DS Gradient ═══════════ */}
            <div style={{
                background: `linear-gradient(135deg, ${DS.gradientStart} 0%, ${DS.primary} 40%, ${DS.gradientEnd} 100%)`,
                backgroundSize: '200% 200%',
                animation: 'dsGradientShift 8s ease infinite',
                padding: `${DS.sp20}px ${DS.sp24}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: DS.sp12,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: DS.sp12 }}>
                    <div style={{
                        width: 44, height: 44,
                        borderRadius: DS.radiusMd,
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1.5px solid rgba(255,255,255,0.2)',
                    }}>
                        <Zap size={22} color="#fff" />
                    </div>
                    <div>
                        <h1 style={{
                            margin: 0, fontSize: 18, fontWeight: 700, color: '#fff',
                            letterSpacing: '-0.3px', lineHeight: 1.3,
                        }}>
                            Heat Transfer Comparison
                        </h1>
                        <p style={{
                            margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.75)',
                            fontWeight: 500, letterSpacing: '0.3px',
                        }}>
                            Conduction · Convection · Radiation
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: DS.sp8 }}>
                    {/* Score — DS pill chip */}
                    <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: DS.radiusFull,
                        padding: `${DS.sp4}px ${DS.sp16}px`,
                        display: 'flex', alignItems: 'center', gap: 6,
                        height: 34,
                        border: '1px solid rgba(255,255,255,0.18)',
                    }}>
                        <Star size={14} color="#FFD600" fill="#FFD600" />
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{score}/{answers.length}</span>
                    </div>

                    {/* Reset — DS Outlined Button (pill) */}
                    <button
                        onClick={handleReset}
                        onMouseEnter={() => setHoveredBtn('reset')}
                        onMouseLeave={() => setHoveredBtn(null)}
                        style={{
                            background: hoveredBtn === 'reset' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
                            border: '1px solid rgba(255,255,255,0.25)',
                            borderRadius: DS.radiusFull,
                            padding: `${DS.sp4}px ${DS.sp16}px`,
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: DS.sp4,
                            color: '#fff', fontWeight: 600, fontSize: 12,
                            height: 34,
                            transition: 'all 0.25s ease',
                            fontFamily: DS.fontFamily,
                            backdropFilter: 'blur(8px)',
                            transform: hoveredBtn === 'reset' ? 'translateY(-1px)' : 'none',
                        }}
                    >
                        <RotateCcw size={13} />
                        Reset
                    </button>
                </div>
            </div>

            {/* ═══════════ PROGRESS BAR — DS gradient ═══════════ */}
            <div style={{ height: 4, background: borderBase, position: 'relative' }}>
                <div style={{
                    height: '100%',
                    width: `${progressPercent}%`,
                    background: `linear-gradient(90deg, ${DS.primary}, ${DS.gradientEnd})`,
                    borderRadius: '0 3px 3px 0',
                    transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
                }} />
            </div>

            {/* ═══════════ HINT / INSTRUCTION BAR ═══════════ */}
            <div style={{
                padding: `${DS.sp12}px ${DS.sp24}px`,
                background: hintText ? DS.accentLight : (config.darkMode ? '#1E1E44' : DS.neutral100),
                borderBottom: `1px solid ${borderBase}`,
                transition: 'all 0.35s ease',
                minHeight: 42,
                display: 'flex', alignItems: 'center', gap: DS.sp8,
            }}>
                {hintText ? (
                    <>
                        <div style={{
                            width: 24, height: 24, borderRadius: DS.radiusFull,
                            background: `${DS.accent}20`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <span style={{ fontSize: 13 }}>💡</span>
                        </div>
                        <p style={{
                            margin: 0, fontSize: 12, color: DS.accent, fontWeight: 600,
                            animation: 'dsfadeInUp 0.3s ease-out', lineHeight: 1.4,
                        }}>
                            Hint: {hintText}
                        </p>
                    </>
                ) : isComplete ? (
                    <>
                        <Award size={16} color={DS.success} />
                        <p style={{ margin: 0, fontSize: 12, color: DS.success, fontWeight: 600 }}>
                            Excellent! You completed the table with {accuracy}% accuracy!
                        </p>
                    </>
                ) : (
                    <>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                        <p style={{ margin: 0, fontSize: 12, color: textSecondary, fontWeight: 500, lineHeight: 1.4 }}>
                            {touchDragTile
                                ? '👆 Now tap the correct cell in the table to place it!'
                                : 'Drag a tile from below into the correct cell — or tap to select, then tap a cell.'}
                        </p>
                    </>
                )}
            </div>

            {/* ═══════════ TABLE ═══════════ */}
            <div style={{
                flex: 1,
                padding: `${DS.sp16}px ${DS.sp20}px`,
                overflowX: 'auto',
                overflowY: 'auto',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `132px repeat(${columns.length}, 1fr)`,
                    gap: 3,
                    minWidth: 660,
                }}>
                    {/* ─── HEADER ROW ─── */}
                    <div style={{ padding: DS.sp8 }} />
                    {columns.map((col, ci) => {
                        const palette = getColPalette(col.id);
                        return (
                            <div
                                key={col.id}
                                style={{
                                    background: palette.main,
                                    borderRadius: `${DS.radiusMd}px ${DS.radiusMd}px ${DS.sp4}px ${DS.sp4}px`,
                                    padding: `${DS.sp12}px ${DS.sp8}px`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: DS.sp4,
                                    animation: `dsfadeInUp 0.5s ease-out ${ci * 0.12}s both`,
                                    boxShadow: `0 4px 14px ${palette.main}25`,
                                }}
                            >
                                <div style={{
                                    width: 34, height: 34,
                                    borderRadius: DS.radiusSm,
                                    background: 'rgba(255,255,255,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {col.icon ? getColumnIcon(col.icon, '#fff') : null}
                                </div>
                                <span style={{
                                    color: '#fff', fontWeight: 700, fontSize: 13,
                                    letterSpacing: '-0.1px', textAlign: 'center',
                                }}>
                                    {col.label}
                                </span>
                            </div>
                        );
                    })}

                    {/* ─── DATA ROWS ─── */}
                    {rows.map((row, ri) => (
                        <React.Fragment key={row.id}>
                            {/* Row header — DS left accent border */}
                            <div style={{
                                background: config.darkMode ? '#252560' : DS.neutral100,
                                borderRadius: ri === rows.length - 1
                                    ? `${DS.sp4}px ${DS.sp4}px ${DS.radiusMd}px ${DS.radiusMd}px`
                                    : DS.sp4,
                                padding: `${DS.sp12}px ${DS.sp12}px`,
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 600,
                                fontSize: 12,
                                color: textPrimary,
                                animation: `dsSlideInRight 0.4s ease-out ${ri * 0.08}s both`,
                                borderLeft: `3px solid ${DS.primary}`,
                                lineHeight: 1.35,
                            }}>
                                {row.label}
                            </div>

                            {/* Cells */}
                            {columns.map((col, ci) => {
                                const cellKey = getCellKey(row.id, col.id);
                                const palette = getColPalette(col.id);
                                const isCorrect = correctCells.has(cellKey);
                                const isWrong = wrongAttemptCell === cellKey;
                                const isHovered = hoveredCell === cellKey && !isCorrect;
                                const placement = placements[cellKey];

                                return (
                                    <div
                                        key={cellKey}
                                        onDragOver={(e) => !isCorrect && handleDragOver(e, cellKey)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => !isCorrect && handleDrop(e, row.id, col.id)}
                                        onClick={() => !isCorrect && handleCellClick(row.id, col.id)}
                                        style={{
                                            background: isCorrect
                                                ? palette.bg
                                                : isWrong
                                                    ? '#FFF0EE'
                                                    : isHovered
                                                        ? `${palette.main}0A`
                                                        : cardBg,
                                            border: isCorrect
                                                ? `2px solid ${DS.success}`
                                                : isWrong
                                                    ? `2px solid ${DS.error}`
                                                    : isHovered
                                                        ? `2px dashed ${palette.main}`
                                                        : `1.5px dashed ${borderBase}`,
                                            borderRadius: ri === rows.length - 1
                                                ? (ci === columns.length - 1
                                                    ? `${DS.sp4}px ${DS.sp4}px ${DS.radiusMd}px ${DS.sp4}px`
                                                    : DS.sp4)
                                                : DS.sp4 + 2,
                                            padding: `${DS.sp8}px ${DS.sp12}px`,
                                            minHeight: 60,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: isCorrect ? 'default' : (touchDragTile ? 'pointer' : 'default'),
                                            transition: 'all 0.3s ease',
                                            animation: isCorrect
                                                ? 'dsCorrectPulse 0.6s ease-out'
                                                : isWrong
                                                    ? 'dsBounceBack 0.5s ease'
                                                    : undefined,
                                            position: 'relative',
                                        }}
                                    >
                                        {isCorrect && placement ? (
                                            <div style={{
                                                display: 'flex', alignItems: 'flex-start', gap: DS.sp8,
                                                animation: 'dsPopIn 0.4s ease-out',
                                                width: '100%',
                                            }}>
                                                <div style={{
                                                    minWidth: 18, height: 18, borderRadius: DS.radiusFull,
                                                    background: DS.success,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0, marginTop: 1,
                                                }}>
                                                    <Check size={10} color="#fff" strokeWidth={3} />
                                                </div>
                                                <span style={{
                                                    fontSize: 11, fontWeight: 500,
                                                    color: textPrimary, lineHeight: 1.45,
                                                }}>
                                                    {placement.text}
                                                </span>
                                            </div>
                                        ) : (
                                            <div style={{
                                                width: '100%', height: '100%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                {isHovered ? (
                                                    <span style={{
                                                        fontSize: 18, opacity: 0.5,
                                                        animation: 'dsDropArrow 1s ease-in-out infinite',
                                                        color: palette.main,
                                                    }}>
                                                        ↓
                                                    </span>
                                                ) : (
                                                    <span style={{
                                                        fontSize: 10, color: DS.neutral400, fontWeight: 500,
                                                        opacity: 0.6,
                                                    }}>
                                                        Drop here
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* ═══════════ TILE POOL ═══════════ */}
            {!isComplete && (
                <div style={{
                    padding: `${DS.sp16}px ${DS.sp20}px ${DS.sp20}px`,
                    borderTop: `1px solid ${borderBase}`,
                    background: surfaceBg,
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: DS.sp8, marginBottom: DS.sp12,
                    }}>
                        <span style={{
                            fontSize: 11, fontWeight: 700, color: textSecondary,
                            textTransform: 'uppercase' as const, letterSpacing: '0.8px',
                        }}>
                            Answer Tiles
                        </span>
                        <span style={{
                            fontSize: 10, fontWeight: 700, color: DS.white,
                            background: `linear-gradient(135deg, ${DS.primary}, ${DS.gradientEnd})`,
                            borderRadius: DS.radiusFull,
                            padding: `2px ${DS.sp8}px`,
                        }}>
                            {shuffledTiles.length} left
                        </span>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap' as const,
                        gap: DS.sp8,
                        maxHeight: 195,
                        overflowY: 'auto' as const,
                        paddingRight: DS.sp4,
                    }}>
                        {shuffledTiles.map((tile, i) => {
                            const palette = getColPalette(tile.colId);
                            const isSelected = touchDragTile?.rowId === tile.rowId && touchDragTile?.colId === tile.colId;

                            return (
                                <div
                                    key={`${tile.rowId}_${tile.colId}`}
                                    draggable
                                    onDragStart={() => handleDragStart(tile)}
                                    onClick={() => handleTileClick(tile)}
                                    style={{
                                        background: isSelected ? palette.bg : cardBg,
                                        border: isSelected
                                            ? `2px solid ${palette.main}`
                                            : `1.5px solid ${borderBase}`,
                                        borderRadius: DS.radiusMd,
                                        padding: `${DS.sp8}px ${DS.sp16}px`,
                                        fontSize: 11,
                                        fontWeight: 500,
                                        color: isSelected ? palette.text : textPrimary,
                                        cursor: 'grab',
                                        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                                        animation: tileEntryDone
                                            ? (isSelected ? 'dsTileFloat 1.2s ease-in-out infinite' : undefined)
                                            : `dsPopIn 0.35s ease-out ${i * 0.04}s both`,
                                        maxWidth: 255,
                                        lineHeight: 1.45,
                                        userSelect: 'none' as const,
                                        boxShadow: isSelected
                                            ? `0 4px 16px ${palette.main}22`
                                            : '0 1px 4px rgba(0,0,0,0.03)',
                                        position: 'relative' as const,
                                        fontFamily: DS.fontFamily,
                                    }}
                                    onMouseEnter={e => {
                                        if (!isSelected) {
                                            (e.currentTarget).style.transform = 'translateY(-3px)';
                                            (e.currentTarget).style.boxShadow = `0 6px 18px ${palette.main}18`;
                                            (e.currentTarget).style.borderColor = palette.light;
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isSelected) {
                                            (e.currentTarget).style.transform = 'translateY(0)';
                                            (e.currentTarget).style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)';
                                            (e.currentTarget).style.borderColor = borderBase;
                                        }
                                    }}
                                >
                                    {tile.text}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ═══════════ COMPLETION SUMMARY ═══════════ */}
            {isComplete && summaryStep >= 1 && (
                <div style={{
                    padding: `${DS.sp20}px ${DS.sp24}px ${DS.sp24}px`,
                    borderTop: `1px solid ${borderBase}`,
                    background: config.darkMode ? '#16163A' : 'linear-gradient(180deg, #F9F9FF, #F0EDFF)',
                    animation: 'dsSummaryHighlight 0.6s ease-out',
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: DS.sp8, marginBottom: DS.sp16,
                    }}>
                        <Award size={20} color={DS.accent} />
                        <h3 style={{
                            margin: 0, fontSize: 16, fontWeight: 700, color: textPrimary,
                        }}>
                            Key Differences to Remember
                        </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: DS.sp8 }}>
                        {columns.map((col, i) => {
                            const palette = getColPalette(col.id);
                            return (
                                <div
                                    key={col.id}
                                    style={{
                                        display: 'flex', alignItems: 'flex-start', gap: DS.sp12,
                                        padding: `${DS.sp12}px ${DS.sp16}px`,
                                        background: palette.bg,
                                        borderRadius: DS.radiusMd,
                                        borderLeft: `4px solid ${palette.main}`,
                                        animation: `dsSlideInRight 0.5s ease-out ${i * 0.15}s both`,
                                    }}
                                >
                                    <div style={{
                                        minWidth: 32, height: 32, borderRadius: DS.radiusSm,
                                        background: `${palette.main}18`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {col.icon ? getColumnIcon(col.icon, palette.main) : null}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: palette.main }}>
                                            {col.label}
                                        </p>
                                        <p style={{
                                            margin: '3px 0 0', fontSize: 11.5,
                                            color: textSecondary, lineHeight: 1.5, fontWeight: 400,
                                        }}>
                                            {col.id === 'conduction' && 'Particle-to-particle energy transfer through direct contact. Works best in solids like metals. Particles vibrate but stay in place.'}
                                            {col.id === 'convection' && 'Hot fluid rises, cool fluid sinks — creating a circulation pattern. This is how sea and land breezes form near coastlines.'}
                                            {col.id === 'radiation' && "The only mode that works without any medium — that's how the Sun's heat reaches us across empty space!"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Score card */}
                    <div style={{
                        marginTop: DS.sp16,
                        padding: `${DS.sp12}px ${DS.sp16}px`,
                        background: `${DS.success}0F`,
                        borderRadius: DS.radiusMd,
                        display: 'flex', alignItems: 'center', gap: DS.sp12,
                        animation: 'dsfadeInUp 0.5s ease-out 0.5s both',
                        border: `1px solid ${DS.success}25`,
                    }}>
                        <div style={{
                            minWidth: 38, height: 38, borderRadius: DS.radiusFull,
                            background: DS.success,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span style={{ fontSize: 18 }}>🎯</span>
                        </div>
                        <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: DS.success }}>
                                Your Score: {score}/{answers.length} ({accuracy}% accuracy)
                            </p>
                            <p style={{ margin: '2px 0 0', fontSize: 11, color: textSecondary, fontWeight: 400 }}>
                                {accuracy === 100
                                    ? "Perfect score! You're a heat transfer expert!"
                                    : accuracy >= 80
                                        ? 'Great job! You know your heat transfer modes well!'
                                        : "Keep practising — you'll master these concepts!"}
                            </p>
                        </div>
                    </div>

                    {/* Try Again — DS Contained Button (full-width pill) */}
                    <button
                        onClick={handleReset}
                        onMouseEnter={() => setHoveredBtn('tryAgain')}
                        onMouseLeave={() => setHoveredBtn(null)}
                        style={{
                            marginTop: DS.sp16,
                            width: '100%',
                            padding: `${DS.sp12}px ${DS.sp24}px`,
                            background: hoveredBtn === 'tryAgain'
                                ? `linear-gradient(135deg, ${DS.gradientStart}, ${DS.gradientEnd})`
                                : DS.primary,
                            border: 'none',
                            borderRadius: DS.radiusFull,
                            color: DS.white,
                            fontWeight: 700,
                            fontSize: 14,
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: DS.sp8,
                            fontFamily: DS.fontFamily,
                            height: 46,
                            boxShadow: hoveredBtn === 'tryAgain'
                                ? '0 8px 24px rgba(83,48,134,0.3)'
                                : '0 2px 10px rgba(74,77,201,0.18)',
                            transform: hoveredBtn === 'tryAgain' ? 'translateY(-1px)' : 'none',
                        }}
                    >
                        <RotateCcw size={15} />
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default HeatTransferComparisonTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════