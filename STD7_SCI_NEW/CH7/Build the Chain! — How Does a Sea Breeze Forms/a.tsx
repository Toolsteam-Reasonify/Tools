// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: sea_breeze_sequencing_tool.tsx
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Check, RotateCcw, Award, ChevronDown, Zap, Star } from 'lucide-react';

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

interface SeaBreezeAdditionalProps {
    steps?: {
        id: number;
        text: string;
        hint: string;
        emoji: string;
    }[];
    correctOrder?: number[];
    contextLocation?: string;
    showAnimation?: boolean;
    difficulty?: 'easy' | 'medium' | 'hard';
    titleText?: string;
    instructionText?: string;
    completionMessage?: string;
}

interface SeaBreezeSequencingToolProps {
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
        additionalProps?: SeaBreezeAdditionalProps;
    };
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN SYSTEM TOKENS ====================

const DS = {
    // Primary (Indigo from PDF #4A4DC9)
    primary: '#4A4DC9',
    primaryDark: '#3538A8',
    primaryLight: '#C1C1EA',
    primaryPale: '#EEEEF8',
    primaryGhost: '#F5F5FF',

    // Accent (Orange from PDF #FF7212, #FC9145)
    accent: '#FF7212',
    accentSoft: '#FC9145',
    accentLight: '#FFF3E4',
    accentPale: '#FFF9F2',

    // Secondary (Purple from PDF #533086)
    secondary: '#533086',
    secondaryLight: '#7B52B5',

    // Grays (from PDF #4E4E4E, #CACACA, #EBEBEB, #F5F5F5)
    gray900: '#1A1A2E',
    gray800: '#2D2D44',
    gray700: '#4E4E4E',
    gray500: '#8A8A8A',
    gray400: '#ACACAC',
    gray300: '#CACACA',
    gray200: '#EBEBEB',
    gray100: '#F5F5F5',
    white: '#FFFFFF',

    // Feedback
    success: '#22C55E',
    successLight: '#DCFCE7',
    successDark: '#15803D',
    error: '#EF4444',
    errorLight: '#FEE2E2',

    // Typography (Poppins from PDF)
    fontFamily: "'Poppins', 'Segoe UI', 'Helvetica Neue', sans-serif",

    // Radii (pill-shaped buttons from PDF, 24px padding references)
    radiusPill: 100,
    radiusLg: 20,
    radiusMd: 16,
    radiusSm: 12,
    radiusXs: 8,
};

// ==================== DEFAULT SEA BREEZE STEPS ====================

const DEFAULT_SEA_BREEZE_STEPS = [
    {
        id: 1,
        text: "The Sun shines equally on both land and sea",
        hint: "Everything starts with the Sun — it's the source of all heat!",
        emoji: "☀️",
    },
    {
        id: 2,
        text: "Land heats up much faster than the sea water",
        hint: "Think about walking on hot sand vs. cool water at the beach!",
        emoji: "🏖️",
    },
    {
        id: 3,
        text: "Air above the hot land gets heated and expands",
        hint: "This step comes AFTER the land heats up — hot surfaces warm the air above them.",
        emoji: "🌡️",
    },
    {
        id: 4,
        text: "The hot, light air above the land rises upward",
        hint: "Warm air is lighter than cool air — remember the paper cup activity!",
        emoji: "⬆️",
    },
    {
        id: 5,
        text: "A low pressure area is created above the land",
        hint: "When air rises and leaves, it creates an empty space — low pressure. This comes AFTER air rises.",
        emoji: "🔽",
    },
    {
        id: 6,
        text: "Cool air from the sea rushes towards the land to fill the gap",
        hint: "This step comes AFTER the low pressure forms — air moves from high to low pressure!",
        emoji: "💨",
    },
    {
        id: 7,
        text: "This movement of cool air from sea to land is the Sea Breeze!",
        hint: "This is the final result — the cool, refreshing breeze people feel at the beach!",
        emoji: "🌊",
    },
];

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
const easeInOutQuad = (t: number): number =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// ==================== MAIN COMPONENT ====================

const SeaBreezeSequencingTool: React.FC<SeaBreezeSequencingToolProps> = ({
    props = {},
    setStepDetails,
    stopAutoNext,
    setStopAutoNext,
}) => {
    // ─── CONFIGURATION ───
    const config = useMemo(() => ({
        width: props.width ?? 800,
        height: props.height ?? 600,
        themeColor: props.themeColor ?? props.data?.themeColor ?? DS.primary,
        darkMode: props.darkMode ?? false,
        animationSpeed: props.animationSpeed ?? 1,
    }), [props]);

    const additionalProps = props.additionalProps || {};

    const seaBreezeConfig = useMemo(() => ({
        steps: additionalProps.steps ?? DEFAULT_SEA_BREEZE_STEPS,
        correctOrder: additionalProps.correctOrder ?? [1, 2, 3, 4, 5, 6, 7],
        contextLocation: additionalProps.contextLocation ?? 'Kerala beach',
        showAnimation: additionalProps.showAnimation ?? true,
        difficulty: additionalProps.difficulty ?? 'medium',
        titleText: additionalProps.titleText ?? 'Sea Breeze Formation',
        instructionText: additionalProps.instructionText ?? 'Drag the jumbled steps into the correct order (1→7). Each step CAUSES the next!',
        completionMessage: additionalProps.completionMessage ?? "You've mastered the sea breeze mechanism!",
    }), [additionalProps]);

    // ─── STATE ───
    const [shuffledCards, setShuffledCards] = useState<number[]>([]);
    const [placedCards, setPlacedCards] = useState<(number | null)[]>(new Array(7).fill(null));
    const [lockedSlots, setLockedSlots] = useState<boolean[]>(new Array(7).fill(false));
    const [shakingSlot, setShakingSlot] = useState<number | null>(null);
    const [hintText, setHintText] = useState<string>('');
    const [showHint, setShowHint] = useState(false);
    const [draggedCard, setDraggedCard] = useState<number | null>(null);
    const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const [animatingArrow, setAnimatingArrow] = useState<number | null>(null);
    const [entryAnimDone, setEntryAnimDone] = useState(false);
    const [selectedCard, setSelectedCard] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // ─── SHUFFLE ON MOUNT ───
    useEffect(() => {
        const ids = seaBreezeConfig.steps.map(s => s.id);
        const shuffled = [...ids];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        if (shuffled.every((v, i) => v === ids[i])) {
            [shuffled[0], shuffled[shuffled.length - 1]] = [shuffled[shuffled.length - 1], shuffled[0]];
        }
        setShuffledCards(shuffled);
        setTimeout(() => setEntryAnimDone(true), 1000);
    }, [seaBreezeConfig.steps]);

    // ─── INJECT KEYFRAMES + POPPINS FONT ───
    useEffect(() => {
        // Load Poppins from Google Fonts
        if (!document.getElementById('sb-poppins-font')) {
            const fontLink = document.createElement('link');
            fontLink.id = 'sb-poppins-font';
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap';
            document.head.appendChild(fontLink);
        }

        const keyframes = `
            @keyframes sbFadeInUp {
                from { opacity: 0; transform: translateY(24px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes sbPopIn {
                0% { transform: scale(0); opacity: 0; }
                60% { transform: scale(1.1); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes sbShake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            @keyframes sbPulseRing {
                0% { box-shadow: 0 0 0 0 rgba(74, 77, 201, 0.35); }
                70% { box-shadow: 0 0 0 10px rgba(74, 77, 201, 0); }
                100% { box-shadow: 0 0 0 0 rgba(74, 77, 201, 0); }
            }
            @keyframes sbSlideDown {
                from { opacity: 0; transform: translateY(-16px) scale(0.97); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes sbArrowGrow {
                from { opacity: 0; transform: scaleY(0); }
                to { opacity: 1; transform: scaleY(1); }
            }
            @keyframes sbCelebrate {
                0% { transform: scale(0) rotate(-5deg); opacity: 0; }
                60% { transform: scale(1.05) rotate(2deg); opacity: 1; }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
            @keyframes sbFloat {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-6px); }
            }
            @keyframes sbConfetti {
                0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
                100% { opacity: 0; transform: translateY(280px) rotate(540deg) scale(0.3); }
            }
            @keyframes sbBreeze {
                0% { transform: translateX(-120%); opacity: 0; }
                20% { opacity: 0.5; }
                100% { transform: translateX(120%); opacity: 0; }
            }
            @keyframes sbDropIn {
                0% { opacity: 0; transform: translateY(-30px) scale(0.9); }
                60% { transform: translateY(4px) scale(1.02); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes sbGradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes sbWave {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(8px); }
                75% { transform: translateX(-8px); }
            }
            @keyframes sbBadgePop {
                0% { transform: scale(0) rotate(-10deg); }
                50% { transform: scale(1.15) rotate(5deg); }
                100% { transform: scale(1) rotate(0deg); }
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.id = 'sb-keyframes-v2';
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
        return () => {
            const existing = document.getElementById('sb-keyframes-v2');
            if (existing) document.head.removeChild(existing);
        };
    }, []);

    // ─── CHECK COMPLETION ───
    useEffect(() => {
        if (lockedSlots.every(Boolean) && lockedSlots.length === 7) {
            setIsComplete(true);
            setTimeout(() => setShowCelebration(true), 500);
        }
    }, [lockedSlots]);

    // ─── REPORT STEP DETAILS ───
    useEffect(() => {
        if (setStepDetails) {
            setStepDetails({
                currentStep: lockedSlots.filter(Boolean).length,
                totalSteps: 7,
                isPaused: true,
                currentMode: 'practice',
            });
        }
    }, [lockedSlots, setStepDetails]);

    // ─── HELPERS ───
    const getStepById = useCallback((id: number) =>
        seaBreezeConfig.steps.find(s => s.id === id), [seaBreezeConfig.steps]);

    const availableCards = useMemo(() => {
        const placedIds = new Set(placedCards.filter(Boolean));
        return shuffledCards.filter(id => !placedIds.has(id));
    }, [shuffledCards, placedCards]);

    const nextEmptySlot = useMemo(() => lockedSlots.findIndex(l => !l), [lockedSlots]);

    // ─── PLACE CARD ───
    const placeCard = useCallback((cardId: number, slotIndex: number) => {
        const correctId = seaBreezeConfig.correctOrder[slotIndex];
        setAttempts(prev => prev + 1);

        if (cardId === correctId) {
            const newPlaced = [...placedCards];
            newPlaced[slotIndex] = cardId;
            setPlacedCards(newPlaced);
            const newLocked = [...lockedSlots];
            newLocked[slotIndex] = true;
            setLockedSlots(newLocked);
            setScore(prev => prev + 1);
            setShowHint(false);
            setHintText('');
            setSelectedCard(null);
            if (slotIndex < 6) {
                setTimeout(() => setAnimatingArrow(slotIndex), 350);
                setTimeout(() => setAnimatingArrow(null), 1100);
            }
        } else {
            setShakingSlot(slotIndex);
            const step = getStepById(cardId);
            if (step) { setHintText(step.hint); setShowHint(true); }
            setTimeout(() => setShakingSlot(null), 600);
            setTimeout(() => setShowHint(false), 4500);
        }
        setDraggedCard(null);
        setHoveredSlot(null);
    }, [placedCards, lockedSlots, seaBreezeConfig.correctOrder, getStepById]);

    // ─── EVENT HANDLERS ───
    const handleDragStart = useCallback((cardId: number) => {
        setDraggedCard(cardId); setShowHint(false);
    }, []);
    const handleDragOver = useCallback((e: React.DragEvent, slotIndex: number) => {
        e.preventDefault(); if (!lockedSlots[slotIndex]) setHoveredSlot(slotIndex);
    }, [lockedSlots]);
    const handleDragLeave = useCallback(() => setHoveredSlot(null), []);
    const handleDrop = useCallback((e: React.DragEvent, slotIndex: number) => {
        e.preventDefault();
        if (draggedCard !== null && !lockedSlots[slotIndex]) placeCard(draggedCard, slotIndex);
    }, [draggedCard, lockedSlots, placeCard]);
    const handleCardClick = useCallback((cardId: number) => {
        setSelectedCard(prev => prev === cardId ? null : cardId); setShowHint(false);
    }, []);
    const handleSlotClick = useCallback((slotIndex: number) => {
        if (selectedCard !== null && !lockedSlots[slotIndex]) placeCard(selectedCard, slotIndex);
    }, [selectedCard, lockedSlots, placeCard]);

    // ─── RESET ───
    const handleReset = useCallback(() => {
        const ids = seaBreezeConfig.steps.map(s => s.id);
        const shuffled = [...ids];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        if (shuffled.every((v, i) => v === ids[i])) {
            [shuffled[0], shuffled[shuffled.length - 1]] = [shuffled[shuffled.length - 1], shuffled[0]];
        }
        setShuffledCards(shuffled);
        setPlacedCards(new Array(7).fill(null));
        setLockedSlots(new Array(7).fill(false));
        setShakingSlot(null); setHintText(''); setShowHint(false);
        setDraggedCard(null); setHoveredSlot(null);
        setIsComplete(false); setScore(0); setAttempts(0);
        setShowCelebration(false); setAnimatingArrow(null);
        setSelectedCard(null); setEntryAnimDone(false);
        setTimeout(() => setEntryAnimDone(true), 1000);
    }, [seaBreezeConfig.steps]);

    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════

    return (
        <div
            ref={containerRef}
            style={{
                width: config.width,
                maxWidth: '100%',
                minHeight: config.height,
                background: DS.white,
                borderRadius: DS.radiusLg,
                overflow: 'hidden',
                fontFamily: DS.fontFamily,
                position: 'relative',
                boxShadow: '0 4px 32px rgba(74, 77, 201, 0.08), 0 1px 8px rgba(0,0,0,0.04)',
                border: `1.5px solid ${DS.gray200}`,
            }}
        >
            {/* ══════════════ HEADER — Purple→Indigo gradient ══════════════ */}
            <div style={{
                background: `linear-gradient(135deg, ${DS.primary} 0%, ${DS.secondary} 100%)`,
                padding: '20px 28px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Decorative geometric shapes (circles from PDF shape tokens) */}
                <div style={{
                    position: 'absolute', top: -28, right: -16, width: 96, height: 96,
                    borderRadius: '50%', border: '2px solid rgba(255,255,255,0.08)',
                }} />
                <div style={{
                    position: 'absolute', top: 40, right: 55, width: 44, height: 44,
                    borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
                }} />
                <div style={{
                    position: 'absolute', bottom: -20, left: 90, width: 60, height: 60,
                    borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.06)',
                }} />
                {/* Small triangle accent — from PDF shape set */}
                <div style={{
                    position: 'absolute', top: 12, right: 180,
                    width: 0, height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '14px solid rgba(255,255,255,0.06)',
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, zIndex: 1 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: DS.radiusSm,
                        background: 'rgba(255,255,255,0.13)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 23, border: '1px solid rgba(255,255,255,0.12)',
                    }}>
                        🌊
                    </div>
                    <div>
                        <h1 style={{
                            margin: 0, fontSize: 18, fontWeight: 700, color: DS.white,
                            letterSpacing: '-0.3px', lineHeight: 1.25,
                            fontFamily: DS.fontFamily,
                        }}>
                            {seaBreezeConfig.titleText}
                        </h1>
                        <p style={{
                            margin: '3px 0 0', fontSize: 11.5,
                            color: 'rgba(255,255,255,0.65)',
                            fontWeight: 500, letterSpacing: '0.2px',
                            fontFamily: DS.fontFamily,
                        }}>
                            Chapter 7 • Heat Transfer in Nature • {seaBreezeConfig.contextLocation}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, zIndex: 1 }}>
                    {/* Score — Contained Highlight Pill (orange from PDF) */}
                    <div style={{
                        background: DS.accentLight,
                        borderRadius: DS.radiusPill,
                        padding: '7px 18px',
                        display: 'flex', alignItems: 'center', gap: 7,
                    }}>
                        <Star size={14} color={DS.accent} fill={DS.accent} />
                        <span style={{
                            color: DS.accent, fontSize: 13, fontWeight: 700,
                            fontFamily: DS.fontFamily,
                        }}>
                            {score}/7
                        </span>
                    </div>

                    {/* Reset — Outlined Pill Button */}
                    <button
                        onClick={handleReset}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1.5px solid rgba(255,255,255,0.25)',
                            borderRadius: DS.radiusPill,
                            padding: '7px 16px',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6,
                            color: DS.white, fontSize: 12, fontWeight: 600,
                            fontFamily: DS.fontFamily,
                            transition: 'all 0.25s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                            e.currentTarget.style.transform = 'scale(1.04)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <RotateCcw size={13} />
                        Reset
                    </button>
                </div>
            </div>

            {/* ══════════════ INSTRUCTION BAR — Accent light bg ══════════════ */}
            <div style={{
                background: DS.accentLight,
                padding: '11px 28px',
                borderBottom: `1px solid ${DS.gray200}`,
                display: 'flex', alignItems: 'center', gap: 10,
            }}>
                <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${DS.accent}, ${DS.accentSoft})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <Zap size={12} color={DS.white} fill={DS.white} />
                </div>
                <p style={{
                    margin: 0, fontSize: 12.5, color: DS.gray700,
                    fontWeight: 500, lineHeight: 1.45, fontFamily: DS.fontFamily,
                }}>
                    {seaBreezeConfig.instructionText}
                </p>
            </div>

            {/* ══════════════ MAIN CONTENT ══════════════ */}
            <div style={{
                display: 'flex', gap: 20, padding: '20px 24px 16px',
                minHeight: 400,
            }}>
                {/* ── LEFT COLUMN: SEQUENCE SLOTS ── */}
                <div style={{ flex: '1 1 55%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{
                        fontSize: 10.5, fontWeight: 700, color: DS.primary,
                        textTransform: 'uppercase', letterSpacing: '1.2px',
                        marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6,
                        fontFamily: DS.fontFamily,
                    }}>
                        <div style={{
                            width: 18, height: 18, borderRadius: '50%',
                            background: DS.primaryPale,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <ChevronDown size={10} color={DS.primary} />
                        </div>
                        Cause → Effect Chain
                    </div>

                    {seaBreezeConfig.correctOrder.map((_, slotIndex) => {
                        const isLocked = lockedSlots[slotIndex];
                        const placedId = placedCards[slotIndex];
                        const step = placedId ? getStepById(placedId) : null;
                        const isShaking = shakingSlot === slotIndex;
                        const isHovered = hoveredSlot === slotIndex && !isLocked;
                        const isNextEmpty = slotIndex === nextEmptySlot;
                        const showArrow = isLocked && slotIndex < 6 && lockedSlots[slotIndex + 1];
                        const isArrowAnimating = animatingArrow === slotIndex;

                        return (
                            <React.Fragment key={slotIndex}>
                                <div
                                    onClick={() => handleSlotClick(slotIndex)}
                                    onDragOver={(e) => handleDragOver(e, slotIndex)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, slotIndex)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '9px 14px',
                                        borderRadius: DS.radiusSm,
                                        border: isLocked
                                            ? `2px solid ${DS.success}`
                                            : isHovered
                                                ? `2px solid ${DS.primary}`
                                                : isNextEmpty && selectedCard !== null
                                                    ? `2px dashed ${DS.primaryLight}`
                                                    : `2px dashed ${DS.gray200}`,
                                        background: isLocked
                                            ? DS.successLight
                                            : isHovered
                                                ? DS.primaryGhost
                                                : isNextEmpty && selectedCard !== null
                                                    ? DS.primaryPale
                                                    : DS.gray100,
                                        cursor: selectedCard !== null && !isLocked ? 'pointer' : 'default',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        animation: isShaking
                                            ? 'sbShake 0.5s ease'
                                            : isLocked
                                                ? 'sbDropIn 0.4s ease-out'
                                                : `sbFadeInUp 0.35s ease-out ${slotIndex * 0.05}s both`,
                                        minHeight: 42,
                                        boxShadow: isLocked
                                            ? '0 2px 10px rgba(34, 197, 94, 0.15)'
                                            : isHovered
                                                ? '0 4px 16px rgba(74, 77, 201, 0.12)'
                                                : 'none',
                                    }}
                                >
                                    {/* Number badge — circle shape from PDF */}
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '50%',
                                        background: isLocked
                                            ? `linear-gradient(135deg, ${DS.success}, ${DS.successDark})`
                                            : DS.gray200,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                        transition: 'all 0.4s ease',
                                        boxShadow: isLocked ? '0 2px 8px rgba(34, 197, 94, 0.3)' : 'none',
                                    }}>
                                        {isLocked ? (
                                            <Check size={14} color={DS.white} strokeWidth={3} />
                                        ) : (
                                            <span style={{
                                                fontSize: 12, fontWeight: 800, color: DS.gray500,
                                                fontFamily: DS.fontFamily,
                                            }}>
                                                {slotIndex + 1}
                                            </span>
                                        )}
                                    </div>

                                    {isLocked && step ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                                            <span style={{ fontSize: 17, flexShrink: 0 }}>{step.emoji}</span>
                                            <span style={{
                                                fontSize: 12, fontWeight: 600, color: DS.gray800,
                                                lineHeight: 1.4, fontFamily: DS.fontFamily,
                                            }}>
                                                {step.text}
                                            </span>
                                        </div>
                                    ) : (
                                        <span style={{
                                            fontSize: 11.5, color: isHovered ? DS.primary : DS.gray400,
                                            fontWeight: 500, fontStyle: 'italic',
                                            transition: 'all 0.25s ease', fontFamily: DS.fontFamily,
                                        }}>
                                            {isNextEmpty && selectedCard !== null
                                                ? '👆 Tap to place here'
                                                : `Drop Step ${slotIndex + 1} here...`}
                                        </span>
                                    )}
                                </div>

                                {/* Arrow connector between locked slots */}
                                {slotIndex < 6 && (
                                    <div style={{
                                        display: 'flex', justifyContent: 'center',
                                        height: showArrow || isArrowAnimating ? 14 : 3,
                                        transition: 'height 0.3s ease', overflow: 'hidden',
                                    }}>
                                        {(showArrow || isArrowAnimating) && (
                                            <div style={{
                                                display: 'flex', flexDirection: 'column',
                                                alignItems: 'center',
                                                animation: isArrowAnimating ? 'sbArrowGrow 0.5s ease-out' : undefined,
                                                transformOrigin: 'top',
                                            }}>
                                                <div style={{
                                                    width: 2, height: 6,
                                                    background: `linear-gradient(180deg, ${DS.primary}, ${DS.accentSoft})`,
                                                    borderRadius: 1,
                                                }} />
                                                <ChevronDown
                                                    size={11} color={DS.accentSoft}
                                                    strokeWidth={3} style={{ marginTop: -3 }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* ── RIGHT COLUMN: CARD BANK ── */}
                <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{
                        fontSize: 10.5, fontWeight: 700, color: DS.secondary,
                        textTransform: 'uppercase', letterSpacing: '1.2px',
                        marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6,
                        fontFamily: DS.fontFamily,
                    }}>
                        <div style={{
                            width: 18, height: 18, borderRadius: '50%',
                            background: DS.primaryLight,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10,
                        }}>
                            🃏
                        </div>
                        Jumbled Steps ({availableCards.length} left)
                    </div>

                    {availableCards.length === 0 && !isComplete ? (
                        <div style={{
                            textAlign: 'center', padding: 28, color: DS.gray500,
                            fontSize: 12.5, fontFamily: DS.fontFamily, fontWeight: 500,
                        }}>
                            All cards placed — checking...
                        </div>
                    ) : (
                        availableCards.map((cardId, index) => {
                            const step = getStepById(cardId);
                            if (!step) return null;
                            const isSelected = selectedCard === cardId;
                            const isDragging = draggedCard === cardId;

                            return (
                                <div
                                    key={cardId}
                                    draggable
                                    onDragStart={() => handleDragStart(cardId)}
                                    onDragEnd={() => { setDraggedCard(null); setHoveredSlot(null); }}
                                    onClick={() => handleCardClick(cardId)}
                                    style={{
                                        padding: '10px 14px',
                                        borderRadius: DS.radiusSm,
                                        border: isSelected
                                            ? `2px solid ${DS.primary}`
                                            : `1.5px solid ${DS.gray200}`,
                                        background: isSelected ? DS.primaryPale : DS.white,
                                        cursor: 'grab',
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                        opacity: isDragging ? 0.4 : 1,
                                        animation: entryAnimDone
                                            ? undefined
                                            : `sbPopIn 0.4s ease-out ${index * 0.07 + 0.35}s both`,
                                        boxShadow: isSelected
                                            ? `0 4px 20px rgba(74, 77, 201, 0.18)`
                                            : '0 1px 4px rgba(0,0,0,0.04)',
                                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(74, 77, 201, 0.12)';
                                            e.currentTarget.style.transform = 'scale(1.015)';
                                            e.currentTarget.style.borderColor = DS.primaryLight;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.borderColor = DS.gray200;
                                        }
                                    }}
                                >
                                    {/* Emoji in a circle token (PDF shape: circle with fill) */}
                                    <div style={{
                                        width: 34, height: 34, borderRadius: '50%',
                                        background: isSelected ? DS.primaryLight : DS.gray100,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 17, flexShrink: 0,
                                        transition: 'all 0.25s ease',
                                        border: isSelected
                                            ? `1.5px solid ${DS.primary}40`
                                            : `1.5px solid ${DS.gray200}`,
                                    }}>
                                        {step.emoji}
                                    </div>
                                    <span style={{
                                        fontSize: 12, fontWeight: 600, color: DS.gray700,
                                        lineHeight: 1.4, fontFamily: DS.fontFamily, flex: 1,
                                    }}>
                                        {step.text}
                                    </span>
                                    {isSelected && (
                                        <div style={{
                                            background: `linear-gradient(135deg, ${DS.primary}, ${DS.secondary})`,
                                            borderRadius: DS.radiusPill,
                                            padding: '3px 10px',
                                            fontSize: 9.5, color: DS.white, fontWeight: 700,
                                            fontFamily: DS.fontFamily, flexShrink: 0,
                                            animation: 'sbPulseRing 1.8s ease-in-out infinite',
                                            letterSpacing: '0.3px',
                                        }}>
                                            TAP SLOT →
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}

                    {/* Hint Box */}
                    {showHint && hintText && (
                        <div style={{
                            marginTop: 6, padding: '12px 14px',
                            borderRadius: DS.radiusSm,
                            background: DS.errorLight,
                            border: `1.5px solid ${DS.error}25`,
                            animation: 'sbSlideDown 0.3s ease-out',
                            display: 'flex', alignItems: 'flex-start', gap: 10,
                        }}>
                            <div style={{
                                width: 26, height: 26, borderRadius: '50%',
                                background: `${DS.error}15`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0, fontSize: 14,
                            }}>
                                🤔
                            </div>
                            <div>
                                <p style={{
                                    margin: 0, fontSize: 10, fontWeight: 700, color: DS.error,
                                    textTransform: 'uppercase', letterSpacing: '0.6px',
                                    fontFamily: DS.fontFamily,
                                }}>
                                    Not quite — hint:
                                </p>
                                <p style={{
                                    margin: '3px 0 0', fontSize: 12, color: DS.gray700,
                                    fontWeight: 500, lineHeight: 1.45, fontFamily: DS.fontFamily,
                                }}>
                                    {hintText}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ══════════════ PROGRESS BAR FOOTER ══════════════ */}
            <div style={{
                padding: '10px 28px 16px',
                display: 'flex', alignItems: 'center', gap: 14,
            }}>
                <div style={{
                    flex: 1, height: 8, borderRadius: DS.radiusPill,
                    background: DS.gray100, overflow: 'hidden',
                    border: `1px solid ${DS.gray200}`,
                }}>
                    <div style={{
                        height: '100%', borderRadius: DS.radiusPill,
                        background: `linear-gradient(90deg, ${DS.primary}, ${DS.accentSoft})`,
                        width: `${(score / 7) * 100}%`,
                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: score > 0 ? `0 0 12px ${DS.primary}30` : 'none',
                    }} />
                </div>
                <span style={{
                    fontSize: 11, fontWeight: 700, color: DS.gray500,
                    fontFamily: DS.fontFamily, whiteSpace: 'nowrap',
                }}>
                    {score}/7 correct
                </span>
            </div>

            {/* ══════════════ CELEBRATION OVERLAY ══════════════ */}
            {showCelebration && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(26, 26, 46, 0.55)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 100, animation: 'sbFadeInUp 0.35s ease-out',
                }}>
                    {/* Confetti in design system palette */}
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute', top: -10,
                            left: `${5 + Math.random() * 90}%`,
                            width: i % 3 === 0 ? 10 : 7,
                            height: i % 3 === 0 ? 10 : 7,
                            borderRadius: i % 2 === 0 ? '50%' : 2,
                            background: [
                                DS.primary, DS.accent, DS.secondary,
                                DS.primaryLight, DS.accentSoft, '#A78BFA',
                            ][i % 6],
                            animation: `sbConfetti ${1.5 + Math.random() * 2}s ease-out ${Math.random() * 0.6}s forwards`,
                        }} />
                    ))}

                    <div style={{
                        background: DS.white,
                        borderRadius: DS.radiusLg,
                        padding: '36px 44px',
                        maxWidth: 440, width: '90%',
                        textAlign: 'center',
                        animation: 'sbCelebrate 0.5s ease-out',
                        boxShadow: '0 30px 80px rgba(74, 77, 201, 0.25), 0 8px 30px rgba(0,0,0,0.12)',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        {/* Top gradient bar — Primary→Accent→Secondary */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                            background: `linear-gradient(90deg, ${DS.primary}, ${DS.accent}, ${DS.secondary})`,
                            backgroundSize: '200% auto',
                            animation: 'sbGradientShift 3s ease infinite',
                        }} />

                        {/* Award badge */}
                        <div style={{
                            width: 72, height: 72, borderRadius: '50%',
                            background: `linear-gradient(135deg, ${DS.accentLight}, ${DS.primaryPale})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 12px',
                            border: `3px solid ${DS.accent}`,
                            animation: 'sbBadgePop 0.6s ease-out 0.3s both',
                        }}>
                            <Award size={32} color={DS.accent} />
                        </div>

                        <h2 style={{
                            fontSize: 22, fontWeight: 800, color: DS.gray900,
                            margin: '8px 0', fontFamily: DS.fontFamily,
                            letterSpacing: '-0.5px',
                        }}>
                            Excellent Work! 🎉
                        </h2>
                        <p style={{
                            fontSize: 14, color: DS.gray700, margin: '6px 0 4px',
                            fontWeight: 500, lineHeight: 1.55, fontFamily: DS.fontFamily,
                        }}>
                            {seaBreezeConfig.completionMessage}
                        </p>
                        <p style={{
                            fontSize: 12.5, color: DS.gray500, margin: '4px 0 20px',
                            fontFamily: DS.fontFamily,
                        }}>
                            Completed in <strong style={{ color: DS.primary }}>{attempts}</strong> attempts
                        </p>

                        {/* Mini coastal animation */}
                        <div style={{
                            background: `linear-gradient(180deg, ${DS.primaryPale} 0%, ${DS.accentLight} 55%, ${DS.accentLight} 100%)`,
                            borderRadius: DS.radiusMd,
                            padding: '18px 22px',
                            marginBottom: 20, position: 'relative',
                            overflow: 'hidden', minHeight: 70,
                            border: `1px solid ${DS.primaryLight}`,
                        }}>
                            <div style={{
                                position: 'absolute', top: 8, right: 18,
                                fontSize: 26, animation: 'sbFloat 3s ease-in-out infinite',
                            }}>☀️</div>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{
                                    position: 'absolute', left: `${18 + i * 26}%`, top: '45%',
                                    fontSize: 14,
                                    animation: `sbWave 2.2s ease-in-out ${i * 0.35}s infinite`,
                                    opacity: 0.5,
                                }}>💨</div>
                            ))}
                            <p style={{
                                margin: 0, fontSize: 12, fontWeight: 700, color: DS.primary,
                                position: 'relative', zIndex: 1, fontFamily: DS.fontFamily,
                            }}>
                                🌊 Sea → 💨 Cool Breeze → 🏖️ Land
                            </p>
                            <p style={{
                                margin: '5px 0 0', fontSize: 11, color: DS.gray500,
                                fontWeight: 500, position: 'relative', zIndex: 1,
                                fontFamily: DS.fontFamily, lineHeight: 1.4,
                            }}>
                                Cool air from the sea blows towards {seaBreezeConfig.contextLocation} during the day!
                            </p>
                        </div>

                        {/* Follow-up prompt */}
                        <div style={{
                            background: DS.primaryPale,
                            borderRadius: DS.radiusSm,
                            padding: '10px 16px',
                            marginBottom: 20,
                            border: `1px solid ${DS.primaryLight}`,
                        }}>
                            <p style={{
                                margin: 0, fontSize: 12, color: DS.primary,
                                fontWeight: 600, lineHeight: 1.5, fontFamily: DS.fontFamily,
                            }}>
                                🧠 <strong>Challenge:</strong> Explain the sea breeze step by step in your own words!
                            </p>
                        </div>

                        {/* Contained Pill CTA — Primary gradient (from PDF button style) */}
                        <button
                            onClick={handleReset}
                            style={{
                                background: `linear-gradient(135deg, ${DS.primary} 0%, ${DS.secondary} 100%)`,
                                color: DS.white,
                                border: 'none',
                                borderRadius: DS.radiusPill,
                                padding: '12px 36px',
                                fontSize: 14, fontWeight: 700,
                                fontFamily: DS.fontFamily,
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                boxShadow: `0 4px 20px rgba(74, 77, 201, 0.35)`,
                                letterSpacing: '0.3px',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 8px 28px rgba(74, 77, 201, 0.45)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(74, 77, 201, 0.35)';
                            }}
                        >
                            <RotateCcw size={14} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeaBreezeSequencingTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════