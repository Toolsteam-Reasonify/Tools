// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: heat_transfer_scenario_tool.tsx
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ==================== INLINE SVG ICON COMPONENTS ====================
// Self-contained — no lucide-react dependency required

const Check: React.FC<{ size?: number; color?: string; strokeWidth?: number }> = ({ size = 18, color = 'currentColor', strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);

const ChevronRight: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 18, color = 'currentColor', style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><polyline points="9 18 15 12 9 6" /></svg>
);

const RotateCcw: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
);

const Award: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#ffd700' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
);

// ==================== TYPE DEFINITIONS ====================

type ModeType = 'learn' | 'practice' | 'real_world' | 'hands_on';
type HeatTransferMode = 'Conduction' | 'Convection' | 'Radiation';
type RowStatus = 'idle' | 'correct' | 'partial' | 'incorrect';

interface StepDetails {
    currentStep: number;
    totalSteps: number;
    isPaused: boolean;
    currentMode: ModeType;
}

interface ScenarioData {
    id: number;
    scenario: string;
    icon: string;
    correctMode: HeatTransferMode;
    acceptableReasonKeywords: string[];
    explanation: string;
    hint: string;
}

interface ScenarioAdditionalProps {
    scenarios?: ScenarioData[];
    themeColor?: string;
    title?: string;
    subtitle?: string;
    instructionsForStudent?: string;
    teachingNotes?: string;
}

interface HeatTransferScenarioToolProps {
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
        additionalProps?: ScenarioAdditionalProps;
    };
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DEFAULT SCENARIOS ====================

const DEFAULT_SCENARIOS: ScenarioData[] = [
    {
        id: 1,
        scenario: "You are stirring hot dal with a steel spoon. After a while, the handle of the spoon becomes hot.",
        icon: "🥄",
        correctMode: "Conduction",
        acceptableReasonKeywords: ["solid", "metal", "contact", "particle", "transfer", "conduct", "spoon", "touch", "through", "along", "medium", "direct"],
        explanation: "Heat transfers from the hot dal through the steel spoon by conduction. In conduction, heat passes from particle to particle through the solid metal without the particles moving from their positions.",
        hint: "Think about how heat moves through a solid material like metal — do the particles move, or just pass energy along?"
    },
    {
        id: 2,
        scenario: "You light an agarbatti (incense stick) during evening puja. The smoke rises upward towards the ceiling.",
        icon: "🪔",
        correctMode: "Convection",
        acceptableReasonKeywords: ["air", "rise", "hot", "warm", "lighter", "moves", "movement", "gas", "actual", "particle", "upward", "expand", "fluid"],
        explanation: "The smoke rises because the hot gases from the agarbatti are warmer and lighter than surrounding air. They expand and rise up — this is convection, where heat transfers by the actual movement of particles in fluids (gases/liquids).",
        hint: "Why does smoke always go UP? Think about what happens to air when it gets heated — does it get lighter or heavier?"
    },
    {
        id: 3,
        scenario: "During Lohri, you sit near a bonfire. You can feel warmth on your face and hands even though you are not touching the fire.",
        icon: "🔥",
        correctMode: "Radiation",
        acceptableReasonKeywords: ["no medium", "without", "direct", "no contact", "distance", "electromagnetic", "wave", "radiat", "no touch", "space", "without medium", "not touching"],
        explanation: "You feel warmth from the bonfire through radiation. Heat reaches you directly from the fire without needing any medium — there is no physical contact, and the air between you and the fire is not the main carrier of heat to your face.",
        hint: "You're NOT touching the fire, and the heat reaches you directly. Does this need a medium or does it travel through empty space too?"
    },
    {
        id: 4,
        scenario: "Your mother heats a tawa (flat pan) on the gas stove. The flame touches the bottom, and soon the entire tawa surface becomes hot.",
        icon: "🍳",
        correctMode: "Conduction",
        acceptableReasonKeywords: ["solid", "metal", "particle", "contact", "conduct", "through", "along", "surface", "heat pass", "spread", "transfer", "iron", "neighbour"],
        explanation: "Heat from the gas flame transfers through the solid metal tawa by conduction. The particles at the bottom get heated first and pass the heat to neighbouring particles, spreading across the entire surface — all without the metal particles moving from their positions.",
        hint: "The tawa is a solid metal object. How does heat travel through solids — by particles moving, or by particles passing energy to their neighbours?"
    },
    {
        id: 5,
        scenario: "In a geyser (water heater), water at the bottom gets heated first. Gradually, all the water in the tank becomes hot.",
        icon: "🚿",
        correctMode: "Convection",
        acceptableReasonKeywords: ["water", "rise", "liquid", "movement", "actual", "particle", "lighter", "hot water", "expand", "cool", "cycle", "flow", "circul", "fluid"],
        explanation: "Water in the geyser heats up by convection. The water at the bottom gets heated, expands, becomes lighter, and rises. Cooler water from above comes down to take its place and then gets heated — this cycle continues until all the water is hot.",
        hint: "Think about what happens to water when it's heated at the bottom — does hot water rise or sink? What replaces it?"
    },
    {
        id: 6,
        scenario: "On a sunny day, you step outside and feel the Sun's warmth on your skin. The heat has travelled millions of kilometres to reach you.",
        icon: "☀️",
        correctMode: "Radiation",
        acceptableReasonKeywords: ["no medium", "vacuum", "space", "without", "electromagnetic", "wave", "radiat", "no contact", "distance", "sun", "travel", "empty"],
        explanation: "The Sun's heat reaches Earth through radiation. Between the Sun and Earth is mostly empty space (vacuum) — there is no material medium for conduction or convection. Radiation is the only process that can transfer heat without any medium.",
        hint: "There is empty space (vacuum) between the Sun and Earth. Can conduction or convection work without a medium?"
    }
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

// ==================== KEYFRAMES ====================

const keyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Source+Sans+3:wght@400;500;600;700&display=swap');

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInLeft {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeInRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes popIn {
        0% { transform: scale(0); opacity: 0; }
        70% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 5px rgba(217, 162, 60, 0.3); }
        50% { box-shadow: 0 0 20px rgba(217, 162, 60, 0.6); }
    }
    @keyframes rowCorrect {
        0% { background-color: rgba(34, 197, 94, 0); }
        50% { background-color: rgba(34, 197, 94, 0.2); }
        100% { background-color: rgba(34, 197, 94, 0.08); }
    }
    @keyframes rowPartial {
        0% { background-color: rgba(245, 158, 11, 0); }
        50% { background-color: rgba(245, 158, 11, 0.2); }
        100% { background-color: rgba(245, 158, 11, 0.08); }
    }
    @keyframes rowIncorrect {
        0% { background-color: rgba(239, 68, 68, 0); }
        50% { background-color: rgba(239, 68, 68, 0.2); }
        100% { background-color: rgba(239, 68, 68, 0.08); }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
    }
    @keyframes checkDraw {
        0% { stroke-dashoffset: 30; opacity: 0; }
        50% { opacity: 1; }
        100% { stroke-dashoffset: 0; opacity: 1; }
    }
    @keyframes confettiBurst {
        0% { transform: scale(0) rotate(0deg); opacity: 1; }
        100% { transform: scale(1.5) rotate(720deg); opacity: 0; }
    }
    @keyframes scoreCount {
        from { transform: scale(1.3); color: #d9a23c; }
        to { transform: scale(1); color: #92702a; }
    }
    @keyframes iconBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
    }
    @keyframes slideDown {
        from { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; }
        to { opacity: 1; max-height: 200px; padding-top: 12px; padding-bottom: 12px; }
    }
    @keyframes borderGlow {
        0%, 100% { border-color: rgba(217, 162, 60, 0.3); }
        50% { border-color: rgba(217, 162, 60, 0.8); }
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
    }
`;

// ==================== MAIN COMPONENT ====================

const HeatTransferScenarioTool: React.FC<HeatTransferScenarioToolProps> = ({ props = {} }) => {
    const additionalProps = (props.additionalProps || {}) as ScenarioAdditionalProps;
    const scenarios = additionalProps.scenarios || DEFAULT_SCENARIOS;
    const themeColor = additionalProps.themeColor || props.themeColor || '#d9a23c';
    const title = additionalProps.title || 'Heat Transfer in Everyday Life';
    const subtitle = additionalProps.subtitle || 'Identify the mode & explain your reasoning';
    const width = props.width || 800;
    const height = props.height || 600;

    // State
    const [answers, setAnswers] = useState<{ [key: number]: { mode: string; reason: string } }>({});
    const [statuses, setStatuses] = useState<{ [key: number]: RowStatus }>({});
    const [showExplanation, setShowExplanation] = useState<{ [key: number]: boolean }>({});
    const [showHint, setShowHint] = useState<{ [key: number]: boolean }>({});
    const [score, setScore] = useState(0);
    const [totalSubmitted, setTotalSubmitted] = useState(0);
    const [animatingRow, setAnimatingRow] = useState<number | null>(null);
    const [showCelebration, setShowCelebration] = useState(false);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    // Inject keyframes
    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'heat-transfer-keyframes';
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
        setMounted(true);
        return () => {
            const existing = document.getElementById('heat-transfer-keyframes');
            if (existing) document.head.removeChild(existing);
        };
    }, []);

    // Check celebration
    useEffect(() => {
        if (totalSubmitted === scenarios.length && score === scenarios.length) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
        }
    }, [totalSubmitted, score, scenarios.length]);

    const handleModeSelect = useCallback((scenarioId: number, mode: string) => {
        setAnswers(prev => ({
            ...prev,
            [scenarioId]: { ...(prev[scenarioId] || { mode: '', reason: '' }), mode }
        }));
        setDropdownOpen(null);
    }, []);

    const handleReasonChange = useCallback((scenarioId: number, reason: string) => {
        setAnswers(prev => ({
            ...prev,
            [scenarioId]: { ...(prev[scenarioId] || { mode: '', reason: '' }), reason }
        }));
    }, []);

    const evaluateAnswer = useCallback((scenarioId: number) => {
        const scenario = scenarios.find(s => s.id === scenarioId);
        const answer = answers[scenarioId];
        if (!scenario || !answer || !answer.mode) return;

        setAnimatingRow(scenarioId);

        const modeCorrect = answer.mode === scenario.correctMode;
        const reasonLower = answer.reason.toLowerCase().trim();

        let reasonGood = false;
        if (reasonLower.length > 15) {
            const matchCount = scenario.acceptableReasonKeywords.filter(kw =>
                reasonLower.includes(kw.toLowerCase())
            ).length;
            reasonGood = matchCount >= 2;
        }

        let status: RowStatus;
        if (modeCorrect && reasonGood) {
            status = 'correct';
            if (statuses[scenarioId] !== 'correct') {
                setScore(prev => prev + 1);
            }
        } else if (modeCorrect && !reasonGood) {
            status = 'partial';
        } else {
            status = 'incorrect';
        }

        if (statuses[scenarioId] === undefined || statuses[scenarioId] === 'idle') {
            setTotalSubmitted(prev => prev + 1);
        }

        setStatuses(prev => ({ ...prev, [scenarioId]: status }));
        setShowExplanation(prev => ({ ...prev, [scenarioId]: status === 'incorrect' || status === 'correct' }));

        setTimeout(() => setAnimatingRow(null), 600);
    }, [answers, scenarios, statuses]);

    const handleReset = useCallback(() => {
        setAnswers({});
        setStatuses({});
        setShowExplanation({});
        setShowHint({});
        setScore(0);
        setTotalSubmitted(0);
        setAnimatingRow(null);
        setShowCelebration(false);
    }, []);

    const toggleHint = useCallback((scenarioId: number) => {
        setShowHint(prev => ({ ...prev, [scenarioId]: !prev[scenarioId] }));
    }, []);

    // ==================== STYLES ====================

    const colors = {
        gold: '#d9a23c',
        goldLight: '#f5e6c4',
        goldDark: '#92702a',
        cream: '#fefaf3',
        warmWhite: '#fffdf8',
        brown: '#5c4318',
        brownLight: '#8b6914',
        greenSuccess: '#22c55e',
        greenBg: 'rgba(34, 197, 94, 0.08)',
        yellowWarn: '#f59e0b',
        yellowBg: 'rgba(245, 158, 11, 0.08)',
        redError: '#ef4444',
        redBg: 'rgba(239, 68, 68, 0.08)',
        grey: '#f1ede6',
        greyDark: '#a09585',
        textPrimary: '#3d2e14',
        textSecondary: '#7a6b57',
    };

    const containerStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: width,
        minHeight: height,
        margin: '0 auto',
        fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
        background: `linear-gradient(145deg, ${colors.warmWhite} 0%, ${colors.cream} 40%, ${colors.goldLight}33 100%)`,
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(92, 67, 24, 0.12), 0 2px 8px rgba(92, 67, 24, 0.06)',
        border: `1px solid ${colors.goldLight}`,
        position: 'relative',
    };

    const headerStyle: React.CSSProperties = {
        background: `linear-gradient(135deg, ${colors.brown} 0%, ${colors.goldDark} 50%, ${colors.gold} 100%)`,
        padding: '24px 28px 20px',
        position: 'relative',
        overflow: 'hidden',
    };

    const modeIconStyle = (mode: HeatTransferMode): React.CSSProperties => ({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 700,
        color: '#fff',
        background: mode === 'Conduction' ? '#e67e22' : mode === 'Convection' ? '#3498db' : '#e74c3c',
        marginRight: 6,
        flexShrink: 0,
    });

    const getRowBgColor = (status: RowStatus): string => {
        switch (status) {
            case 'correct': return colors.greenBg;
            case 'partial': return colors.yellowBg;
            case 'incorrect': return colors.redBg;
            default: return 'transparent';
        }
    };

    const getRowBorderColor = (status: RowStatus): string => {
        switch (status) {
            case 'correct': return colors.greenSuccess;
            case 'partial': return colors.yellowWarn;
            case 'incorrect': return colors.redError;
            default: return colors.goldLight;
        }
    };

    const getRowAnimation = (status: RowStatus): string => {
        switch (status) {
            case 'correct': return 'rowCorrect 0.6s ease forwards';
            case 'partial': return 'rowPartial 0.6s ease forwards';
            case 'incorrect': return 'shake 0.5s ease, rowIncorrect 0.6s ease forwards';
            default: return 'none';
        }
    };

    // ==================== RENDER ====================

    return (
        <div style={containerStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    pointerEvents: 'none',
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 8,
                    }}>
                        <div>
                            <h1 style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: 22,
                                fontWeight: 800,
                                color: '#fff',
                                margin: 0,
                                lineHeight: 1.2,
                                letterSpacing: '-0.02em',
                                animation: mounted ? 'fadeInLeft 0.6s ease' : 'none',
                            }}>
                                🔥 {title}
                            </h1>
                            <p style={{
                                fontSize: 13,
                                color: 'rgba(255,255,255,0.75)',
                                margin: '4px 0 0',
                                fontWeight: 500,
                                animation: mounted ? 'fadeInLeft 0.6s ease 0.1s both' : 'none',
                            }}>
                                {subtitle}
                            </p>
                        </div>
                        {/* Score Counter */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 14,
                            padding: '8px 16px',
                            animation: mounted ? 'fadeInRight 0.6s ease 0.2s both' : 'none',
                        }}>
                            <Award size={18} color="#ffd700" />
                            <span style={{
                                fontSize: 18,
                                fontWeight: 700,
                                color: '#fff',
                                animation: score > 0 ? 'scoreCount 0.4s ease' : 'none',
                                fontFamily: "'Playfair Display', Georgia, serif",
                            }}>
                                {score}/{scenarios.length}
                            </span>
                        </div>
                    </div>

                    {/* Mode Legend */}
                    <div style={{
                        display: 'flex',
                        gap: 12,
                        marginTop: 10,
                        flexWrap: 'wrap',
                        animation: mounted ? 'fadeInUp 0.6s ease 0.3s both' : 'none',
                    }}>
                        {(['Conduction', 'Convection', 'Radiation'] as HeatTransferMode[]).map(mode => (
                            <div key={mode} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                                fontSize: 11,
                                color: 'rgba(255,255,255,0.85)',
                                fontWeight: 600,
                            }}>
                                <div style={modeIconStyle(mode)}>
                                    {mode === 'Conduction' ? 'C' : mode === 'Convection' ? 'V' : 'R'}
                                </div>
                                {mode}
                                <span style={{ fontSize: 10, opacity: 0.65, fontWeight: 400 }}>
                                    {mode === 'Conduction' ? '(through solid)' :
                                        mode === 'Convection' ? '(fluid movement)' : '(no medium)'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Instructions Bar */}
            <div style={{
                padding: '12px 28px',
                background: `linear-gradient(90deg, ${colors.goldLight}66 0%, ${colors.goldLight}33 100%)`,
                borderBottom: `1px solid ${colors.goldLight}`,
                fontSize: 12.5,
                color: colors.textSecondary,
                fontWeight: 500,
                lineHeight: 1.5,
                animation: mounted ? 'fadeInUp 0.5s ease 0.4s both' : 'none',
            }}>
                <strong style={{ color: colors.brown }}>📝 Instructions:</strong> For each scenario, select the mode of heat transfer and write WHY it's that mode (not the other two). All 6 scenarios come from everyday Indian life!
            </div>

            {/* Table Header */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '2.2fr 1fr 1.8fr 80px',
                gap: 0,
                padding: '10px 28px',
                background: colors.grey,
                borderBottom: `2px solid ${colors.gold}44`,
                animation: mounted ? 'fadeInUp 0.5s ease 0.5s both' : 'none',
            }}>
                {['Scenario', 'Mode of Heat Transfer', 'Your Reasoning (WHY?)', 'Check'].map((header, i) => (
                    <div key={header} style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: colors.goldDark,
                        padding: '6px 8px',
                        fontFamily: "'Source Sans 3', sans-serif",
                    }}>
                        {header}
                    </div>
                ))}
            </div>

            {/* Scenario Rows */}
            <div style={{
                padding: '0 28px 20px',
                overflowY: 'auto',
                overflowX: 'visible',
                maxHeight: height - 250,
                position: 'relative',
            }}>
                {scenarios.map((scenario, index) => {
                    const status = statuses[scenario.id] || 'idle';
                    const answer = answers[scenario.id] || { mode: '', reason: '' };
                    const isAnimating = animatingRow === scenario.id;
                    const isHovered = hoveredRow === scenario.id;
                    const isDropdownOpen = dropdownOpen === scenario.id;

                    return (
                        <div key={scenario.id} style={{
                            position: 'relative',
                            zIndex: isDropdownOpen ? 50 : 1,
                        }}>
                            <div
                                onMouseEnter={() => setHoveredRow(scenario.id)}
                                onMouseLeave={() => setHoveredRow(null)}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2.2fr 1fr 1.8fr 80px',
                                    gap: 0,
                                    padding: '14px 0',
                                    borderBottom: `1px solid ${getRowBorderColor(status)}33`,
                                    background: getRowBgColor(status),
                                    borderRadius: 10,
                                    marginTop: 6,
                                    transition: 'all 0.3s ease',
                                    animation: mounted
                                        ? (isAnimating
                                            ? getRowAnimation(status)
                                            : `fadeInUp 0.5s ease ${0.5 + index * 0.08}s both`)
                                        : 'none',
                                    transform: isHovered && status === 'idle' ? 'scale(1.005)' : 'scale(1)',
                                    boxShadow: isHovered && status === 'idle'
                                        ? '0 2px 12px rgba(217,162,60,0.12)' : 'none',
                                    position: 'relative',
                                    zIndex: isDropdownOpen ? 50 : 'auto',
                                }}
                            >
                                {/* Status indicator bar */}
                                {status !== 'idle' && (
                                    <div style={{
                                        position: 'absolute',
                                        left: 0, top: 0, bottom: 0,
                                        width: 4,
                                        borderRadius: '10px 0 0 10px',
                                        background: status === 'correct' ? colors.greenSuccess
                                            : status === 'partial' ? colors.yellowWarn : colors.redError,
                                        animation: 'fadeInLeft 0.3s ease',
                                    }} />
                                )}

                                {/* Scenario Column */}
                                <div style={{
                                    padding: '4px 10px 4px 14px',
                                    fontSize: 13,
                                    lineHeight: 1.55,
                                    color: colors.textPrimary,
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 10,
                                }}>
                                    <span style={{
                                        fontSize: 24,
                                        flexShrink: 0,
                                        animation: isHovered ? 'iconBounce 0.5s ease' : 'none',
                                        filter: status === 'correct' ? 'none' : 'grayscale(0.2)',
                                    }}>
                                        {scenario.icon}
                                    </span>
                                    <span style={{ fontWeight: 500 }}>
                                        {scenario.scenario}
                                    </span>
                                </div>

                                {/* Mode Dropdown Column */}
                                <div style={{
                                    padding: '4px 8px',
                                    position: 'relative',
                                    overflow: 'visible',
                                }}>
                                    <div
                                        onClick={() => {
                                            if (status === 'correct') return;
                                            setDropdownOpen(isDropdownOpen ? null : scenario.id);
                                        }}
                                        style={{
                                            padding: '8px 12px',
                                            border: `2px solid ${answer.mode
                                                ? (status === 'correct' ? colors.greenSuccess
                                                    : status === 'incorrect' ? colors.redError
                                                        : `${colors.gold}88`)
                                                : `${colors.greyDark}44`}`,
                                            borderRadius: 10,
                                            fontSize: 13,
                                            fontWeight: answer.mode ? 600 : 400,
                                            color: answer.mode ? colors.textPrimary : colors.greyDark,
                                            background: status === 'correct' ? `${colors.greenSuccess}10`
                                                : '#fff',
                                            cursor: status === 'correct' ? 'default' : 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            animation: isDropdownOpen ? 'borderGlow 1s ease infinite' : 'none',
                                        }}
                                    >
                                        <span>{answer.mode || 'Select...'}</span>
                                        {status !== 'correct' && (
                                            <ChevronRight size={14} style={{
                                                transform: isDropdownOpen ? 'rotate(90deg)' : 'rotate(0)',
                                                transition: 'transform 0.2s ease',
                                                opacity: 0.5,
                                            }} />
                                        )}
                                        {status === 'correct' && <Check size={14} color={colors.greenSuccess} />}
                                    </div>

                                    {/* Dropdown Options */}
                                    {isDropdownOpen && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 'calc(100% + 2px)',
                                            left: 8,
                                            right: 8,
                                            background: '#fff',
                                            border: `1px solid ${colors.goldLight}`,
                                            borderRadius: 10,
                                            boxShadow: '0 12px 32px rgba(92,67,24,0.22), 0 4px 8px rgba(92,67,24,0.1)',
                                            zIndex: 1000,
                                            overflow: 'hidden',
                                            animation: 'fadeInUp 0.2s ease',
                                        }}>
                                            {(['Conduction', 'Convection', 'Radiation'] as HeatTransferMode[]).map((mode, mi) => (
                                                <div
                                                    key={mode}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleModeSelect(scenario.id, mode);
                                                    }}
                                                    style={{
                                                        padding: '10px 14px',
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        color: colors.textPrimary,
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 8,
                                                        transition: 'background 0.15s ease',
                                                        background: answer.mode === mode ? `${colors.gold}15` : 'transparent',
                                                        borderBottom: mi < 2 ? `1px solid ${colors.grey}` : 'none',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        (e.currentTarget as HTMLElement).style.background = `${colors.gold}20`;
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        (e.currentTarget as HTMLElement).style.background = answer.mode === mode ? `${colors.gold}15` : 'transparent';
                                                    }}
                                                >
                                                    <div style={modeIconStyle(mode)}>
                                                        {mode === 'Conduction' ? 'C' : mode === 'Convection' ? 'V' : 'R'}
                                                    </div>
                                                    {mode}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Reason Column */}
                                <div style={{ padding: '4px 8px' }}>
                                    <textarea
                                        value={answer.reason}
                                        onChange={(e) => handleReasonChange(scenario.id, e.target.value)}
                                        placeholder="Explain WHY this is the correct mode..."
                                        disabled={status === 'correct'}
                                        style={{
                                            width: '100%',
                                            minHeight: 60,
                                            padding: '8px 12px',
                                            border: `2px solid ${status === 'correct' ? colors.greenSuccess
                                                : status === 'partial' ? colors.yellowWarn
                                                    : `${colors.greyDark}33`}`,
                                            borderRadius: 10,
                                            fontSize: 12.5,
                                            lineHeight: 1.45,
                                            color: colors.textPrimary,
                                            background: status === 'correct' ? `${colors.greenSuccess}08` : '#fff',
                                            fontFamily: "'Source Sans 3', sans-serif",
                                            resize: 'vertical',
                                            outline: 'none',
                                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                                            boxSizing: 'border-box',
                                        }}
                                        onFocus={(e) => {
                                            if (status !== 'correct') {
                                                e.currentTarget.style.borderColor = colors.gold;
                                                e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.gold}22`;
                                            }
                                        }}
                                        onBlur={(e) => {
                                            if (status !== 'correct') {
                                                e.currentTarget.style.borderColor = `${colors.greyDark}33`;
                                                e.currentTarget.style.boxShadow = 'none';
                                            }
                                        }}
                                    />
                                </div>

                                {/* Check Button Column */}
                                <div style={{
                                    padding: '4px 8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: 6,
                                    paddingTop: 8,
                                }}>
                                    {status === 'correct' ? (
                                        <div style={{
                                            width: 36, height: 36,
                                            borderRadius: '50%',
                                            background: colors.greenSuccess,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            animation: 'popIn 0.4s ease',
                                            boxShadow: `0 3px 10px ${colors.greenSuccess}44`,
                                        }}>
                                            <Check size={18} color="#fff" strokeWidth={3} />
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => evaluateAnswer(scenario.id)}
                                                disabled={!answer.mode}
                                                style={{
                                                    width: 36, height: 36,
                                                    borderRadius: '50%',
                                                    border: 'none',
                                                    background: answer.mode
                                                        ? `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`
                                                        : colors.grey,
                                                    color: answer.mode ? '#fff' : colors.greyDark,
                                                    cursor: answer.mode ? 'pointer' : 'not-allowed',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: answer.mode ? `0 3px 10px ${colors.gold}44` : 'none',
                                                    transform: 'scale(1)',
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (answer.mode) {
                                                        (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
                                                        (e.currentTarget as HTMLElement).style.boxShadow = `0 5px 15px ${colors.gold}66`;
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                                                    (e.currentTarget as HTMLElement).style.boxShadow = answer.mode ? `0 3px 10px ${colors.gold}44` : 'none';
                                                }}
                                                onMouseDown={(e) => {
                                                    if (answer.mode) {
                                                        (e.currentTarget as HTMLElement).style.transform = 'scale(0.92)';
                                                    }
                                                }}
                                                onMouseUp={(e) => {
                                                    if (answer.mode) {
                                                        (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
                                                    }
                                                }}
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                            {status === 'idle' && (
                                                <button
                                                    onClick={() => toggleHint(scenario.id)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        color: colors.gold,
                                                        fontSize: 10,
                                                        fontWeight: 600,
                                                        opacity: 0.7,
                                                        transition: 'opacity 0.2s',
                                                        padding: 0,
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        (e.currentTarget as HTMLElement).style.opacity = '1';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        (e.currentTarget as HTMLElement).style.opacity = '0.7';
                                                    }}
                                                >
                                                    💡 Hint
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Hint Panel */}
                            {showHint[scenario.id] && status === 'idle' && (
                                <div style={{
                                    margin: '0 14px 4px',
                                    padding: '10px 16px',
                                    background: `${colors.goldLight}66`,
                                    borderRadius: '0 0 10px 10px',
                                    fontSize: 12,
                                    color: colors.goldDark,
                                    fontWeight: 500,
                                    lineHeight: 1.5,
                                    borderLeft: `3px solid ${colors.gold}`,
                                    animation: 'slideDown 0.3s ease',
                                    overflow: 'hidden',
                                }}>
                                    💡 <strong>Hint:</strong> {scenario.hint}
                                </div>
                            )}

                            {/* Feedback Panels */}
                            {status === 'partial' && (
                                <div style={{
                                    margin: '0 14px 4px',
                                    padding: '10px 16px',
                                    background: `${colors.yellowWarn}10`,
                                    borderRadius: '0 0 10px 10px',
                                    fontSize: 12,
                                    color: '#92702a',
                                    fontWeight: 500,
                                    lineHeight: 1.5,
                                    borderLeft: `3px solid ${colors.yellowWarn}`,
                                    animation: 'slideDown 0.3s ease',
                                    overflow: 'hidden',
                                }}>
                                    ⚡ <strong>Good — correct mode!</strong> But can you explain WHY more specifically? What makes it {scenario.correctMode.toLowerCase()} and not the other two modes? Try adding details about how the heat particles behave.
                                </div>
                            )}

                            {status === 'incorrect' && showExplanation[scenario.id] && (
                                <div style={{
                                    margin: '0 14px 4px',
                                    padding: '10px 16px',
                                    background: `${colors.redError}06`,
                                    borderRadius: '0 0 10px 10px',
                                    fontSize: 12,
                                    color: colors.textPrimary,
                                    fontWeight: 500,
                                    lineHeight: 1.55,
                                    borderLeft: `3px solid ${colors.redError}`,
                                    animation: 'slideDown 0.3s ease',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{ color: colors.redError, fontWeight: 700, marginBottom: 4 }}>
                                        ✗ The correct answer is: <span style={{
                                            background: `${colors.redError}15`,
                                            padding: '2px 8px',
                                            borderRadius: 6,
                                        }}>{scenario.correctMode}</span>
                                    </div>
                                    <div style={{ color: colors.textSecondary }}>
                                        {scenario.explanation}
                                    </div>
                                </div>
                            )}

                            {status === 'correct' && showExplanation[scenario.id] && (
                                <div style={{
                                    margin: '0 14px 4px',
                                    padding: '10px 16px',
                                    background: `${colors.greenSuccess}06`,
                                    borderRadius: '0 0 10px 10px',
                                    fontSize: 12,
                                    color: colors.textPrimary,
                                    fontWeight: 500,
                                    lineHeight: 1.55,
                                    borderLeft: `3px solid ${colors.greenSuccess}`,
                                    animation: 'slideDown 0.3s ease',
                                    overflow: 'hidden',
                                }}>
                                    <span style={{ color: colors.greenSuccess, fontWeight: 700 }}>✓ Excellent!</span>{' '}
                                    <span style={{ color: colors.textSecondary }}>{scenario.explanation}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 28px',
                borderTop: `1px solid ${colors.goldLight}`,
                background: `${colors.grey}88`,
            }}>
                <div style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    fontWeight: 500,
                }}>
                    {totalSubmitted === 0
                        ? "Start by selecting a mode for any scenario above ☝️"
                        : totalSubmitted < scenarios.length
                            ? `${totalSubmitted} of ${scenarios.length} checked · ${score} correct so far`
                            : score === scenarios.length
                                ? "🎉 Perfect score! You understand all three modes of heat transfer!"
                                : `Completed! Score: ${score}/${scenarios.length} · Review the explanations above`
                    }
                </div>
                <button
                    onClick={handleReset}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 16px',
                        borderRadius: 10,
                        border: `1px solid ${colors.goldLight}`,
                        background: '#fff',
                        color: colors.goldDark,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = colors.goldLight;
                        (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = '#fff';
                        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                    }}
                >
                    <RotateCcw size={14} />
                    Reset All
                </button>
            </div>

            {/* Celebration Overlay */}
            {showCelebration && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(254,250,243,0.9)',
                    zIndex: 200,
                    animation: 'fadeInUp 0.5s ease',
                    borderRadius: 20,
                }}>
                    <div style={{
                        textAlign: 'center',
                        animation: 'popIn 0.6s ease',
                    }}>
                        <div style={{ fontSize: 64, marginBottom: 12 }}>🏆</div>
                        <h2 style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: 28,
                            color: colors.gold,
                            margin: '0 0 8px',
                        }}>
                            Perfect Score!
                        </h2>
                        <p style={{
                            fontSize: 14,
                            color: colors.textSecondary,
                            maxWidth: 340,
                            lineHeight: 1.5,
                        }}>
                            You've correctly identified and explained all modes of heat transfer. Outstanding reasoning!
                        </p>
                    </div>
                </div>
            )}

            {/* Click outside to close dropdown */}
            {dropdownOpen !== null && (
                <div
                    onClick={() => setDropdownOpen(null)}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        zIndex: 50,
                    }}
                />
            )}
        </div>
    );
};

export default HeatTransferScenarioTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════