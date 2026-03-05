// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: dc_ac_comparison_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Check, X, RotateCcw, Zap, Star, BookOpen, Target, AlertTriangle, ChevronRight, Sparkles } from 'lucide-react';

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

interface DCACAdditionalProps {
    rows?: {
        property: string;
        dcAnswer: string;
        acAnswer: string;
        isSafetyRow?: boolean;
        explanation?: string;
    }[];
    shuffledLabels?: string[];
    instructionText?: string;
    safetyWarning?: string;
    dcColumnTitle?: string;
    acColumnTitle?: string;
    showTeachingNotes?: boolean;
    teachingNotes?: string;
}

interface DCACComparisonToolProps {
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
        additionalProps?: DCACAdditionalProps;
    };
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
    // Primary palette
    primary: '#4A4DC9',
    primaryDark: '#533086',
    primaryLight: '#C1C1EA',
    primaryLightest: '#EEEEF8',

    // Accent / Highlight
    accent: '#FF7212',
    accentMid: '#FC9145',
    accentLight: '#FFF3E4',
    accentLightest: '#FFF9F2',

    // Gradient
    gradientStart: '#533086',
    gradientEnd: '#FC9145',

    // Grays
    gray900: '#1A1A2E',
    gray700: '#4E4E4E',
    gray400: '#CACACA',
    gray200: '#EBEBEB',
    gray100: '#F5F5F5',
    white: '#FFFFFF',

    // Semantic
    success: '#22C55E',
    successLight: '#DCFCE7',
    successDark: '#15803D',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    dangerDark: '#B91C1C',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',

    // Typography
    fontFamily: "'Poppins', sans-serif",

    // Border radius
    radiusFull: '999px',
    radiusXL: '20px',
    radiusLG: '16px',
    radiusMD: '12px',
    radiusSM: '8px',
    radiusXS: '6px',

    // Shadows
    shadowSm: '0 1px 3px rgba(74,77,201,0.06)',
    shadowMd: '0 4px 14px rgba(74,77,201,0.08)',
    shadowLg: '0 12px 40px rgba(74,77,201,0.12)',
    shadowXl: '0 20px 60px rgba(83,48,134,0.15)',
    shadowAccent: '0 4px 20px rgba(255,114,18,0.2)',
};

// ==================== DEFAULT DATA ====================

const DEFAULT_ROWS = [
    {
        property: 'Full Form',
        dcAnswer: 'Direct Current',
        acAnswer: 'Alternating Current',
        isSafetyRow: false,
        explanation: 'DC stands for Direct Current and AC stands for Alternating Current.',
    },
    {
        property: 'Source',
        dcAnswer: 'Cells and batteries',
        acAnswer: 'Power plants and wall sockets',
        isSafetyRow: false,
        explanation: 'DC comes from portable sources like cells and batteries. AC is generated in power plants and reaches us through wall sockets.',
    },
    {
        property: 'Direction of Current',
        dcAnswer: 'Flows in one direction only',
        acAnswer: 'Changes direction rapidly',
        isSafetyRow: false,
        explanation: 'In DC, current always flows from positive to negative terminal. In AC, the direction reverses many times per second.',
    },
    {
        property: 'Devices Powered',
        dcAnswer: 'Torchlight, remote, wall clock',
        acAnswer: 'Refrigerator, washing machine, AC unit',
        isSafetyRow: false,
        explanation: 'DC powers small portable devices. AC powers large household appliances.',
    },
    {
        property: 'Safe for experiments?',
        dcAnswer: 'Yes — safe for experiments!',
        acAnswer: 'No — very dangerous!',
        isSafetyRow: true,
        explanation: '⚠️ IMPORTANT: Only use batteries/cells (DC) for science experiments. NEVER experiment with wall sockets (AC) — it can cause severe injury or death!',
    },
];

// ==================== ANIMATION HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeOutElastic = (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

// ==================== KEYFRAMES ====================

const keyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-16px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes popIn {
        0% { transform: scale(0); opacity: 0; }
        60% { transform: scale(1.08); }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.03); }
    }
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        15%, 45%, 75% { transform: translateX(-5px); }
        30%, 60%, 90% { transform: translateX(5px); }
    }
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.06); }
        70% { transform: scale(0.94); }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes warningPulse {
        0%, 100% { border-color: #EF4444; box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        50% { border-color: #F59E0B; box-shadow: 0 0 12px 2px rgba(239,68,68,0.15); }
    }
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
    }
    @keyframes tapHint {
        0%, 100% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.06); opacity: 1; }
    }
    @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes boltGlow {
        0%, 100% { filter: drop-shadow(0 0 2px rgba(74,77,201,0.2)); opacity: 0.6; }
        50% { filter: drop-shadow(0 0 8px rgba(255,114,18,0.6)); opacity: 1; }
    }
    @keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateY(12px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    @keyframes ripple {
        0% { transform: scale(0); opacity: 0.4; }
        100% { transform: scale(4); opacity: 0; }
    }
`;

// ==================== MAIN COMPONENT ====================

const DCACComparisonTool: React.FC<DCACComparisonToolProps> = ({
    props = {},
    setStepDetails,
    stopAutoNext,
    setStopAutoNext,
}) => {
    const config = useMemo(() => ({
        width: props.width ?? 800,
        height: props.height ?? 600,
        animationSpeed: props.animationSpeed ?? 1,
    }), [props]);

    const additionalProps = props.additionalProps || {};
    const rows = additionalProps.rows || DEFAULT_ROWS;
    const dcColumnTitle = additionalProps.dcColumnTitle || 'Direct Current (DC)';
    const acColumnTitle = additionalProps.acColumnTitle || 'Alternating Current (AC)';
    const safetyWarning = additionalProps.safetyWarning || 'Remember: Only use batteries/cells for experiments. Wall socket electricity is very dangerous!';

    // ─── Build shuffled answer labels ───
    const allLabels = useMemo(() => {
        const labels: { text: string; rowIndex: number; column: 'dc' | 'ac' }[] = [];
        rows.forEach((row, i) => {
            labels.push({ text: row.dcAnswer, rowIndex: i, column: 'dc' });
            labels.push({ text: row.acAnswer, rowIndex: i, column: 'ac' });
        });
        const shuffled = [...labels];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }, [rows]);

    // ─── State ───
    const [availableLabels, setAvailableLabels] = useState(allLabels);
    const [placements, setPlacements] = useState<{ [key: string]: { text: string; rowIndex: number; column: 'dc' | 'ac' } | null }>({});
    const [feedback, setFeedback] = useState<{ [key: string]: 'correct' | 'incorrect' | null }>({});
    const [draggedLabel, setDraggedLabel] = useState<{ text: string; rowIndex: number; column: 'dc' | 'ac' } | null>(null);
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [showExplanation, setShowExplanation] = useState<number | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [shakeCell, setShakeCell] = useState<string | null>(null);
    const [selectedLabel, setSelectedLabel] = useState<{ text: string; rowIndex: number; column: 'dc' | 'ac' } | null>(null);
    const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);

    // ─── Effects ───
    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'dcac-singularity-keyframes';
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
        setTimeout(() => setMounted(true), 50);
        return () => {
            const existing = document.getElementById('dcac-singularity-keyframes');
            if (existing) document.head.removeChild(existing);
        };
    }, []);

    useEffect(() => {
        const totalCells = rows.length * 2;
        const filledCorrectly = Object.values(feedback).filter(f => f === 'correct').length;
        if (filledCorrectly === totalCells && totalCells > 0) {
            setIsComplete(true);
            setTimeout(() => setShowCelebration(true), 400);
        }
    }, [feedback, rows.length]);

    useEffect(() => {
        if (setStepDetails) {
            setStepDetails({ currentStep: 1, totalSteps: 1, isPaused: true, currentMode: 'practice' });
        }
    }, [setStepDetails]);

    // ─── Helpers ───
    const getCellKey = (rowIndex: number, col: 'dc' | 'ac') => `${rowIndex}-${col}`;

    const handleLabelClick = useCallback((label: { text: string; rowIndex: number; column: 'dc' | 'ac' }) => {
        setSelectedLabel(prev => prev?.text === label.text ? null : label);
    }, []);

    const placeLabel = useCallback((label: { text: string; rowIndex: number; column: 'dc' | 'ac' }, rowIndex: number, col: 'dc' | 'ac') => {
        const cellKey = getCellKey(rowIndex, col);
        if (feedback[cellKey] === 'correct') return;

        const isCorrect = label.rowIndex === rowIndex && label.column === col;
        setTotalAttempts(prev => prev + 1);

        if (isCorrect) {
            setScore(prev => prev + 1);
            setPlacements(prev => ({ ...prev, [cellKey]: label }));
            setFeedback(prev => ({ ...prev, [cellKey]: 'correct' }));
            setAvailableLabels(prev => prev.filter(l => l.text !== label.text));
            setSelectedLabel(null);
            if (rows[rowIndex].isSafetyRow) {
                setTimeout(() => setShowExplanation(rowIndex), 500);
            }
        } else {
            setFeedback(prev => ({ ...prev, [cellKey]: 'incorrect' }));
            setShakeCell(cellKey);
            setTimeout(() => {
                setFeedback(prev => ({ ...prev, [cellKey]: null }));
                setShakeCell(null);
            }, 700);
            setShowExplanation(rowIndex);
        }
    }, [feedback, rows]);

    const handleCellClick = useCallback((rowIndex: number, col: 'dc' | 'ac') => {
        if (!selectedLabel) return;
        placeLabel(selectedLabel, rowIndex, col);
    }, [selectedLabel, placeLabel]);

    const handleDragStart = useCallback((e: React.DragEvent, label: { text: string; rowIndex: number; column: 'dc' | 'ac' }) => {
        setDraggedLabel(label);
        setSelectedLabel(null);
        e.dataTransfer.effectAllowed = 'move';
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, rowIndex: number, col: 'dc' | 'ac') => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setHoveredCell(getCellKey(rowIndex, col));
    }, []);

    const handleDragLeave = useCallback(() => { setHoveredCell(null); }, []);

    const handleDrop = useCallback((e: React.DragEvent, rowIndex: number, col: 'dc' | 'ac') => {
        e.preventDefault();
        setHoveredCell(null);
        if (!draggedLabel) return;
        placeLabel(draggedLabel, rowIndex, col);
        setDraggedLabel(null);
    }, [draggedLabel, placeLabel]);

    const handleReset = useCallback(() => {
        const shuffled = [...allLabels];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setAvailableLabels(shuffled);
        setPlacements({});
        setFeedback({});
        setScore(0);
        setTotalAttempts(0);
        setShowExplanation(null);
        setIsComplete(false);
        setShowCelebration(false);
        setSelectedLabel(null);
        setDraggedLabel(null);
    }, [allLabels]);

    // ─── Computed ───
    const totalCells = rows.length * 2;
    const correctCount = Object.values(feedback).filter(f => f === 'correct').length;
    const progressPercent = totalCells > 0 ? (correctCount / totalCells) * 100 : 0;

    // ─── Drop Cell Renderer ───
    const renderDropCell = (rowIndex: number, col: 'dc' | 'ac', isSafety: boolean) => {
        const cellKey = getCellKey(rowIndex, col);
        const placement = placements[cellKey];
        const cellFeedback = feedback[cellKey];
        const isHovered = hoveredCell === cellKey;
        const isShaking = shakeCell === cellKey;
        const isEmpty = !placement;
        const isCorrect = cellFeedback === 'correct';
        const isIncorrect = cellFeedback === 'incorrect';

        let cellBg = DS.white;
        if (isCorrect) cellBg = DS.successLight;
        if (isIncorrect) cellBg = DS.dangerLight;
        if (isHovered && isEmpty) cellBg = col === 'dc' ? DS.primaryLightest : DS.accentLightest;

        return (
            <div
                onDragOver={(e) => handleDragOver(e, rowIndex, col)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, rowIndex, col)}
                onClick={() => handleCellClick(rowIndex, col)}
                style={{
                    background: cellBg,
                    padding: '14px 12px',
                    minHeight: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: isEmpty && selectedLabel ? 'pointer' : 'default',
                    animation: isShaking
                        ? 'shake 0.5s ease'
                        : isCorrect
                            ? 'popIn 0.35s ease both'
                            : `slideUp 0.4s ease ${0.3 + rowIndex * 0.08}s both`,
                    position: 'relative',
                    borderLeft: `1px solid ${DS.gray200}`,
                    outline: isHovered && isEmpty
                        ? `2px solid ${col === 'dc' ? DS.primary : DS.accent}50`
                        : 'none',
                    outlineOffset: '-2px',
                }}
            >
                {isEmpty ? (
                    <div style={{
                        width: '100%',
                        minHeight: 38,
                        borderRadius: DS.radiusSM,
                        border: `2px dashed ${selectedLabel
                            ? (col === 'dc' ? DS.primary : DS.accent) + 'A0'
                            : DS.gray400 + '60'
                            }`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: selectedLabel
                            ? (col === 'dc' ? DS.primary : DS.accent)
                            : DS.gray400,
                        fontSize: 11.5,
                        fontWeight: 500,
                        fontFamily: DS.fontFamily,
                        transition: 'all 0.25s ease',
                        animation: selectedLabel ? 'tapHint 1.8s ease infinite' : 'none',
                        background: selectedLabel
                            ? (col === 'dc' ? DS.primary : DS.accent) + '06'
                            : 'transparent',
                    }}>
                        {selectedLabel ? '↓ Tap here' : '— Drop —'}
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {isCorrect && (
                            <div style={{
                                width: 22,
                                height: 22,
                                borderRadius: DS.radiusFull,
                                background: DS.success,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                animation: 'popIn 0.35s ease both',
                                boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
                            }}>
                                <Check size={13} color={DS.white} strokeWidth={3} />
                            </div>
                        )}
                        <span style={{
                            fontSize: 12.5,
                            fontWeight: 600,
                            fontFamily: DS.fontFamily,
                            color: isCorrect ? DS.successDark : DS.danger,
                            lineHeight: 1.35,
                        }}>
                            {placement?.text}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════

    return (
        <div style={{
            width: config.width,
            maxWidth: '100%',
            minHeight: config.height,
            background: DS.gray100,
            borderRadius: DS.radiusXL,
            overflow: 'hidden',
            fontFamily: DS.fontFamily,
            position: 'relative',
            boxShadow: DS.shadowXl,
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.5s ease',
        }}>

            {/* ═══════════════ HEADER ═══════════════ */}
            <div style={{
                background: `linear-gradient(135deg, ${DS.gradientStart} 0%, ${DS.primary} 45%, ${DS.gradientEnd} 100%)`,
                backgroundSize: '200% 200%',
                animation: 'gradientMove 8s ease infinite',
                padding: '24px 28px 18px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Grid pattern overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.04,
                    backgroundImage: `
                        linear-gradient(90deg, #fff 1px, transparent 1px),
                        linear-gradient(#fff 1px, transparent 1px)
                    `,
                    backgroundSize: '24px 24px',
                }} />

                {/* Floating decorative dots */}
                {[...Array(6)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: 4 + i * 2,
                        height: 4 + i * 2,
                        borderRadius: '50%',
                        background: `rgba(255,255,255,${0.06 + i * 0.02})`,
                        top: `${10 + i * 14}%`,
                        right: `${5 + i * 10}%`,
                        animation: `float ${2.5 + i * 0.5}s ease infinite ${i * 0.25}s`,
                    }} />
                ))}

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    position: 'relative',
                    zIndex: 1,
                    animation: 'fadeInDown 0.5s ease both',
                }}>
                    {/* Icon badge */}
                    <div style={{
                        width: 46,
                        height: 46,
                        borderRadius: DS.radiusMD,
                        background: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(8px)',
                        border: '1.5px solid rgba(255,255,255,0.18)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        animation: 'boltGlow 3s ease infinite',
                    }}>
                        <Zap size={24} color="#FFF" fill={DS.accentMid} />
                    </div>
                    <div>
                        <h1 style={{
                            margin: 0,
                            fontSize: 21,
                            fontWeight: 700,
                            color: DS.white,
                            letterSpacing: '-0.4px',
                            fontFamily: DS.fontFamily,
                            lineHeight: 1.2,
                        }}>
                            DC vs AC — Spot the Difference!
                        </h1>
                        <p style={{
                            margin: '4px 0 0',
                            fontSize: 12,
                            color: 'rgba(255,255,255,0.7)',
                            fontWeight: 400,
                            fontFamily: DS.fontFamily,
                            letterSpacing: '0.3px',
                        }}>
                            Dive Deeper · Direct Current and Alternating Current
                        </p>
                    </div>
                </div>

                {/* Progress bar */}
                <div style={{
                    marginTop: 18,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <div style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: DS.radiusFull,
                        height: 7,
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${progressPercent}%`,
                            background: isComplete
                                ? DS.success
                                : `linear-gradient(90deg, ${DS.white} 0%, ${DS.accentMid} 100%)`,
                            borderRadius: DS.radiusFull,
                            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: progressPercent > 0 ? '0 0 8px rgba(255,255,255,0.4)' : 'none',
                        }} />
                    </div>
                    <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.85)',
                        fontFamily: DS.fontFamily,
                        whiteSpace: 'nowrap',
                        minWidth: 36,
                    }}>
                        {correctCount}/{totalCells}
                    </span>
                </div>
            </div>

            {/* ═══════════════ INSTRUCTIONS STRIP ═══════════════ */}
            <div style={{
                padding: '12px 28px',
                background: DS.white,
                borderBottom: `1px solid ${DS.gray200}`,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                animation: 'fadeInUp 0.4s ease 0.15s both',
            }}>
                <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: DS.radiusSM,
                    background: DS.primaryLightest,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <BookOpen size={14} color={DS.primary} />
                </div>
                <p style={{
                    margin: 0,
                    fontSize: 12.5,
                    color: DS.gray700,
                    lineHeight: 1.5,
                    fontWeight: 400,
                    fontFamily: DS.fontFamily,
                }}>
                    <span style={{ fontWeight: 600, color: DS.primary }}>Tap a label</span> below, then{' '}
                    <span style={{ fontWeight: 600, color: DS.accent }}>tap the correct cell</span> in the table.
                    You can also <span style={{ fontWeight: 500 }}>drag &amp; drop</span>!
                </p>
            </div>

            {/* ═══════════════ LABEL POOL ═══════════════ */}
            <div style={{
                padding: '18px 28px 14px',
                animation: 'fadeInUp 0.4s ease 0.2s both',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                }}>
                    <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: DS.radiusFull,
                        background: `linear-gradient(135deg, ${DS.primary}, ${DS.accent})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Target size={11} color={DS.white} />
                    </div>
                    <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: DS.gray700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                        fontFamily: DS.fontFamily,
                    }}>
                        Answer Labels
                    </span>
                    <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: DS.white,
                        background: availableLabels.length > 0 ? DS.primary : DS.success,
                        padding: '2px 10px',
                        borderRadius: DS.radiusFull,
                        fontFamily: DS.fontFamily,
                        transition: 'background 0.3s ease',
                    }}>
                        {availableLabels.length}
                    </span>
                </div>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    minHeight: 40,
                }}>
                    {availableLabels.length === 0 && !isComplete && (
                        <span style={{
                            fontSize: 12,
                            color: DS.gray400,
                            fontStyle: 'italic',
                            fontFamily: DS.fontFamily,
                            padding: '8px 0',
                        }}>
                            All labels placed! Check your answers.
                        </span>
                    )}
                    {availableLabels.map((label, index) => {
                        const isSelected = selectedLabel?.text === label.text;
                        const isHover = hoveredLabel === label.text;

                        return (
                            <div
                                key={label.text}
                                draggable
                                onDragStart={(e) => handleDragStart(e, label)}
                                onClick={() => handleLabelClick(label)}
                                onMouseEnter={() => setHoveredLabel(label.text)}
                                onMouseLeave={() => setHoveredLabel(null)}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: DS.radiusFull,
                                    background: isSelected
                                        ? `linear-gradient(135deg, ${DS.primary}, ${DS.primaryDark})`
                                        : DS.white,
                                    border: `2px solid ${isSelected
                                        ? DS.primary
                                        : isHover
                                            ? DS.primaryLight
                                            : DS.gray200
                                        }`,
                                    fontSize: 12.5,
                                    fontWeight: 600,
                                    fontFamily: DS.fontFamily,
                                    color: isSelected ? DS.white : DS.gray700,
                                    cursor: 'grab',
                                    userSelect: 'none' as const,
                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                    animation: `bounceIn 0.4s ease ${index * 0.04}s both`,
                                    boxShadow: isSelected
                                        ? `0 4px 16px rgba(74,77,201,0.3)`
                                        : isHover
                                            ? DS.shadowMd
                                            : DS.shadowSm,
                                    transform: isSelected
                                        ? 'scale(1.04)'
                                        : isHover
                                            ? 'scale(1.03) translateY(-1px)'
                                            : 'scale(1)',
                                    letterSpacing: '0.1px',
                                }}
                            >
                                {label.text}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ═══════════════ COMPARISON TABLE ═══════════════ */}
            <div style={{
                padding: '0 28px 20px',
                animation: 'fadeInUp 0.4s ease 0.3s both',
            }}>
                <div style={{
                    borderRadius: DS.radiusLG,
                    overflow: 'hidden',
                    border: `1px solid ${DS.gray200}`,
                    boxShadow: DS.shadowMd,
                    background: DS.white,
                }}>
                    {/* Header Row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '130px 1fr 1fr',
                    }}>
                        {/* Property header */}
                        <div style={{
                            background: DS.gray700,
                            padding: '14px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <span style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: DS.white,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontFamily: DS.fontFamily,
                            }}>
                                Property
                            </span>
                        </div>

                        {/* DC header */}
                        <div style={{
                            background: DS.primary,
                            padding: '14px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            borderLeft: '1px solid rgba(255,255,255,0.15)',
                        }}>
                            <div style={{
                                width: 22,
                                height: 22,
                                borderRadius: DS.radiusFull,
                                background: 'rgba(255,255,255,0.18)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Zap size={12} color={DS.white} fill="rgba(255,255,255,0.4)" />
                            </div>
                            <span style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: DS.white,
                                fontFamily: DS.fontFamily,
                            }}>
                                {dcColumnTitle}
                            </span>
                        </div>

                        {/* AC header */}
                        <div style={{
                            background: DS.accent,
                            padding: '14px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            borderLeft: '1px solid rgba(255,255,255,0.15)',
                        }}>
                            <div style={{
                                width: 22,
                                height: 22,
                                borderRadius: DS.radiusFull,
                                background: 'rgba(255,255,255,0.18)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <AlertTriangle size={12} color={DS.white} />
                            </div>
                            <span style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: DS.white,
                                fontFamily: DS.fontFamily,
                            }}>
                                {acColumnTitle}
                            </span>
                        </div>
                    </div>

                    {/* Data Rows */}
                    {rows.map((row, rowIndex) => {
                        const isSafety = row.isSafetyRow;

                        return (
                            <React.Fragment key={rowIndex}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '130px 1fr 1fr',
                                    borderTop: `1px solid ${isSafety ? DS.danger + '30' : DS.gray200}`,
                                    animation: isSafety ? 'warningPulse 3.5s ease infinite' : 'none',
                                    background: isSafety ? DS.dangerLight + '30' : 'transparent',
                                }}>
                                    {/* Property label */}
                                    <div style={{
                                        background: isSafety
                                            ? `linear-gradient(180deg, ${DS.dangerLight}, #FFF5F5)`
                                            : DS.gray100,
                                        padding: '16px 12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        animation: `slideInLeft 0.4s ease ${0.35 + rowIndex * 0.06}s both`,
                                    }}>
                                        <span style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: isSafety ? DS.danger : DS.gray700,
                                            fontFamily: DS.fontFamily,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 5,
                                            lineHeight: 1.35,
                                        }}>
                                            {isSafety && <AlertTriangle size={13} color={DS.danger} style={{ flexShrink: 0 }} />}
                                            {row.property}
                                        </span>
                                    </div>

                                    {renderDropCell(rowIndex, 'dc', isSafety)}
                                    {renderDropCell(rowIndex, 'ac', isSafety)}
                                </div>

                                {/* Explanation popup */}
                                {showExplanation === rowIndex && (
                                    <div
                                        onClick={() => setShowExplanation(null)}
                                        style={{
                                            background: isSafety
                                                ? `linear-gradient(135deg, ${DS.dangerLight}, #FFF8F8)`
                                                : DS.primaryLightest,
                                            borderTop: `1px solid ${isSafety ? DS.danger + '18' : DS.primary + '18'}`,
                                            padding: '12px 18px',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 10,
                                            cursor: 'pointer',
                                            animation: 'scaleIn 0.25s ease both',
                                        }}
                                    >
                                        <div style={{
                                            width: 26,
                                            height: 26,
                                            borderRadius: DS.radiusFull,
                                            background: isSafety ? DS.danger + '12' : DS.primary + '12',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            marginTop: 1,
                                        }}>
                                            {isSafety
                                                ? <AlertTriangle size={13} color={DS.danger} />
                                                : <BookOpen size={13} color={DS.primary} />
                                            }
                                        </div>
                                        <div>
                                            <p style={{
                                                margin: 0,
                                                fontSize: 12,
                                                fontWeight: 500,
                                                color: isSafety ? DS.dangerDark : DS.primaryDark,
                                                lineHeight: 1.55,
                                                fontFamily: DS.fontFamily,
                                            }}>
                                                {row.explanation}
                                            </p>
                                            <span style={{
                                                fontSize: 10,
                                                color: DS.gray400,
                                                fontFamily: DS.fontFamily,
                                                marginTop: 4,
                                                display: 'block',
                                            }}>
                                                tap to dismiss
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* ═══════════════ SAFETY BANNER ═══════════════ */}
            <div style={{
                margin: '0 28px 18px',
                padding: '14px 18px',
                background: DS.white,
                borderRadius: DS.radiusMD,
                border: `1.5px solid ${DS.danger}25`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                animation: 'fadeInUp 0.4s ease 0.6s both',
                boxShadow: '0 2px 12px rgba(239,68,68,0.05)',
            }}>
                <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: DS.radiusMD,
                    background: `linear-gradient(135deg, ${DS.danger}, #DC2626)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    animation: 'pulse 2.5s ease infinite',
                    boxShadow: '0 4px 14px rgba(239,68,68,0.25)',
                }}>
                    <AlertTriangle size={18} color={DS.white} />
                </div>
                <p style={{
                    margin: 0,
                    fontSize: 12,
                    color: DS.dangerDark,
                    fontWeight: 500,
                    lineHeight: 1.45,
                    fontFamily: DS.fontFamily,
                }}>
                    {safetyWarning}
                </p>
            </div>

            {/* ═══════════════ FOOTER ═══════════════ */}
            <div style={{
                padding: '0 28px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                animation: 'fadeInUp 0.4s ease 0.7s both',
            }}>
                {/* Score pill */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 16px',
                    borderRadius: DS.radiusFull,
                    background: DS.primaryLightest,
                    border: `1.5px solid ${DS.primaryLight}`,
                }}>
                    <Star size={14} color={DS.primary} />
                    <span style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: DS.primary,
                        fontFamily: DS.fontFamily,
                    }}>
                        {score}/{totalAttempts > 0 ? totalAttempts : '—'} correct
                    </span>
                </div>

                {/* Reset — Outlined pill button (Singularity style) */}
                <button
                    onClick={handleReset}
                    onMouseEnter={() => setHoveredButton('reset')}
                    onMouseLeave={() => setHoveredButton(null)}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = hoveredButton === 'reset' ? 'scale(1.03)' : 'scale(1)')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 24px',
                        height: 40,
                        borderRadius: DS.radiusFull,
                        border: `2px solid ${hoveredButton === 'reset' ? DS.primary : DS.primary}`,
                        background: hoveredButton === 'reset'
                            ? DS.primary
                            : 'transparent',
                        color: hoveredButton === 'reset'
                            ? DS.white
                            : DS.primary,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontFamily: DS.fontFamily,
                        letterSpacing: '0.2px',
                        transform: hoveredButton === 'reset' ? 'scale(1.03)' : 'scale(1)',
                        boxShadow: hoveredButton === 'reset'
                            ? '0 6px 20px rgba(74,77,201,0.25)'
                            : 'none',
                        outline: 'none',
                    }}
                >
                    <RotateCcw size={14} />
                    Try Again
                </button>
            </div>

            {/* ═══════════════ CELEBRATION OVERLAY ═══════════════ */}
            {showCelebration && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(26,26,46,0.5)',
                    zIndex: 100,
                    animation: 'fadeInUp 0.25s ease both',
                    backdropFilter: 'blur(6px)',
                }}>
                    <div style={{
                        background: DS.white,
                        borderRadius: DS.radiusXL,
                        padding: '42px 52px',
                        textAlign: 'center',
                        animation: 'bounceIn 0.5s ease both',
                        boxShadow: DS.shadowXl,
                        maxWidth: 380,
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* Top gradient accent bar */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0,
                            height: 4,
                            background: `linear-gradient(90deg, ${DS.gradientStart}, ${DS.primary}, ${DS.gradientEnd})`,
                        }} />

                        <div style={{
                            width: 68,
                            height: 68,
                            borderRadius: DS.radiusFull,
                            background: `linear-gradient(135deg, ${DS.accent}, ${DS.accentMid})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 18px',
                            animation: 'pulse 1.2s ease infinite',
                            boxShadow: DS.shadowAccent,
                        }}>
                            <Star size={34} color={DS.white} />
                        </div>

                        <h2 style={{
                            margin: '0 0 6px',
                            fontSize: 24,
                            fontWeight: 800,
                            color: DS.gray900,
                            fontFamily: DS.fontFamily,
                        }}>
                            Excellent Work!
                        </h2>
                        <p style={{
                            margin: '0 0 4px',
                            fontSize: 14,
                            color: DS.gray700,
                            fontWeight: 400,
                            fontFamily: DS.fontFamily,
                        }}>
                            All {totalCells} answers matched correctly!
                        </p>
                        <p style={{
                            margin: 0,
                            fontSize: 13,
                            fontWeight: 700,
                            fontFamily: DS.fontFamily,
                            color: score === totalAttempts && totalAttempts > 0 ? DS.success : DS.primary,
                        }}>
                            Score: {score}/{totalAttempts}
                            {score === totalAttempts && totalAttempts > 0 ? ' — Perfect! ⭐' : ''}
                        </p>

                        {/* Contained pill button (Singularity style) */}
                        <button
                            onClick={() => setShowCelebration(false)}
                            onMouseEnter={() => setHoveredButton('continue')}
                            onMouseLeave={() => setHoveredButton(null)}
                            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                            onMouseUp={(e) => (e.currentTarget.style.transform = hoveredButton === 'continue' ? 'scale(1.03)' : 'scale(1)')}
                            style={{
                                marginTop: 22,
                                padding: '12px 40px',
                                height: 44,
                                borderRadius: DS.radiusFull,
                                border: 'none',
                                background: hoveredButton === 'continue'
                                    ? DS.accent
                                    : `linear-gradient(135deg, ${DS.primary}, ${DS.primaryDark})`,
                                color: DS.white,
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: DS.fontFamily,
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: hoveredButton === 'continue' ? 'scale(1.03)' : 'scale(1)',
                                boxShadow: hoveredButton === 'continue'
                                    ? DS.shadowAccent
                                    : '0 6px 24px rgba(83,48,134,0.3)',
                                letterSpacing: '0.3px',
                                outline: 'none',
                            }}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DCACComparisonTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════