// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: incandescent_lamp_labeling_tool.tsx
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ==================== INLINE SVG ICONS (no lucide-react dependency) ====================

const IconProps = { xmlns: "http://www.w3.org/2000/svg", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const RotateCcw: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 24, color, style }) => (
    <svg {...IconProps} width={size} height={size} viewBox="0 0 24 24" style={{ color, ...style }}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
    </svg>
);

const Check: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 24, color, style }) => (
    <svg {...IconProps} width={size} height={size} viewBox="0 0 24 24" style={{ color, ...style }}>
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

const Award: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 24, color, style }) => (
    <svg {...IconProps} width={size} height={size} viewBox="0 0 24 24" style={{ color, ...style }}>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
);

const Zap: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 24, color, style }) => (
    <svg {...IconProps} width={size} height={size} viewBox="0 0 24 24" style={{ color, ...style }}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none" />
    </svg>
);

const Star: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 24, color, style }) => (
    <svg {...IconProps} width={size} height={size} viewBox="0 0 24 24" style={{ color, ...style }}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" />
    </svg>
);

const Target: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 24, color, style }) => (
    <svg {...IconProps} width={size} height={size} viewBox="0 0 24 24" style={{ color, ...style }}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

const Eye: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 24, color, style }) => (
    <svg {...IconProps} width={size} height={size} viewBox="0 0 24 24" style={{ color, ...style }}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOff: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 24, color, style }) => (
    <svg {...IconProps} width={size} height={size} viewBox="0 0 24 24" style={{ color, ...style }}>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

// ==================== TYPE DEFINITIONS ====================

type ModeType = 'learn' | 'practice';

interface LampLabelingAdditionalProps {
    labels?: {
        id: string;
        text: string;
        hint?: string;
    }[];
    targetZones?: {
        id: string;
        labelId: string;
        x: number;
        y: number;
        width: number;
        height: number;
    }[];
    showHints?: boolean;
    lampStyle?: 'detailed' | 'simple';
    celebrationMessage?: string;
}

interface ConfettiParticle {
    id: number;
    x: number;
    color: string;
    delay: number;
    duration: number;
    size: number;
    rotation: number;
}

interface LampLabelingToolConfigProps {
    width?: number;
    height?: number;
    initialMode?: ModeType;
    themeColor?: string;
    darkMode?: boolean;
    additionalProps?: LampLabelingAdditionalProps;
}

interface IncandescentLampLabelingToolProps {
    props?: LampLabelingToolConfigProps;
    setStepDetails?: (stepDetails: {
        currentStep: number;
        totalSteps: number;
        isPaused: boolean;
        currentMode: ModeType;
    }) => void;
}

// ==================== DEFAULT DATA ====================

const DEFAULT_LABELS = [
    { id: 'glass_bulb', text: 'Glass Bulb', hint: 'The transparent dome at the top that protects the filament' },
    { id: 'filament', text: 'Filament', hint: 'The thin coiled wire that glows white-hot to produce light' },
    { id: 'support_wires', text: 'Support Wires', hint: 'Two thick wires that hold the filament in place' },
    { id: 'metal_case', text: 'Metal Case (Terminal 1)', hint: 'The cylindrical metal base — one of two electrical terminals' },
    { id: 'metal_tip', text: 'Metal Tip (Terminal 2)', hint: 'The small circular contact at the very bottom — the other terminal' },
    { id: 'insulator', text: 'Insulator', hint: 'Material between the metal case and metal tip preventing short circuit' },
];

// Target zones as percentages of SVG viewBox (0-100 scale)
const DEFAULT_TARGET_ZONES = [
    { id: 'zone_glass_bulb', labelId: 'glass_bulb', x: 50, y: 14, width: 22, height: 10 },
    { id: 'zone_filament', labelId: 'filament', x: 50, y: 30, width: 18, height: 8 },
    { id: 'zone_support_wires', labelId: 'support_wires', x: 50, y: 44, width: 22, height: 8 },
    { id: 'zone_metal_case', labelId: 'metal_case', x: 50, y: 62, width: 24, height: 10 },
    { id: 'zone_insulator', labelId: 'insulator', x: 50, y: 76, width: 20, height: 8 },
    { id: 'zone_metal_tip', labelId: 'metal_tip', x: 50, y: 88, width: 20, height: 8 },
];

// ==================== ANIMATION HELPERS ====================

// ==================== MAIN COMPONENT ====================

const IncandescentLampLabelingTool: React.FC<IncandescentLampLabelingToolProps> = ({
    props = {},
    setStepDetails,
}) => {
    // ─── CONFIGURATION ───
    const config = useMemo(() => ({
        width: props.width ?? 800,
        height: props.height ?? 600,
        initialMode: props.initialMode ?? 'practice',
        themeColor: props.themeColor ?? '#d97706', // Amber theme
        darkMode: props.darkMode ?? false,
    }), [props]);

    const additionalProps = props.additionalProps || {};
    const labels = additionalProps.labels || DEFAULT_LABELS;
    const targetZones = additionalProps.targetZones || DEFAULT_TARGET_ZONES;
    const celebrationMessage = additionalProps.celebrationMessage || '🎉 Excellent! You labelled all parts correctly!';

    // ─── STATE ───
    const [selectedMode, setSelectedMode] = useState<ModeType>(config.initialMode);
    const [hintsEnabled, setHintsEnabled] = useState(additionalProps.showHints ?? true);
    const [placements, setPlacements] = useState<{ [zoneId: string]: string }>({});
    const [draggedLabel, setDraggedLabel] = useState<string | null>(null);
    const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
    const [correctPlacements, setCorrectPlacements] = useState<Set<string>>(new Set());
    const [wrongAttempt, setWrongAttempt] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [entryAnimDone, setEntryAnimDone] = useState(false);
    const [hoveredZone, setHoveredZone] = useState<string | null>(null);
    const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
    const [shakeZone, setShakeZone] = useState<string | null>(null);
    const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // ─── DERIVED ───
    // (No unused derived state)

    // ─── INJECT KEYFRAMES ───
    useEffect(() => {
        const keyframes = `
            @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');
            @keyframes lampFadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes lampPopIn {
                0% { transform: scale(0); opacity: 0; }
                70% { transform: scale(1.15); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes lampPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.04); }
            }
            @keyframes lampBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-6px); }
            }
            @keyframes lampShake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-8px); }
                40% { transform: translateX(8px); }
                60% { transform: translateX(-6px); }
                80% { transform: translateX(6px); }
            }
            @keyframes lampGlow {
                0%, 100% { filter: drop-shadow(0 0 4px ${config.themeColor}40); }
                50% { filter: drop-shadow(0 0 16px ${config.themeColor}90); }
            }
            @keyframes lampFloat {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-4px); }
            }
            @keyframes lampConfetti {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
            }
            @keyframes lampSlideIn {
                from { opacity: 0; transform: translateX(-20px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes lampCheckmark {
                0% { stroke-dashoffset: 30; }
                100% { stroke-dashoffset: 0; }
            }
            @keyframes lampStarBurst {
                0% { transform: scale(0) rotate(0deg); opacity: 1; }
                50% { transform: scale(1.5) rotate(180deg); opacity: 0.8; }
                100% { transform: scale(0) rotate(360deg); opacity: 0; }
            }
            @keyframes lampTargetPulse {
                0%, 100% { stroke-opacity: 0.3; stroke-width: 1; }
                50% { stroke-opacity: 0.8; stroke-width: 2.5; }
            }
            @keyframes lampZoneBreathe {
                0%, 100% { opacity: 0.15; }
                50% { opacity: 0.35; }
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.id = 'lamp-labeling-keyframes';
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
        return () => {
            const existing = document.getElementById('lamp-labeling-keyframes');
            if (existing) document.head.removeChild(existing);
        };
    }, [config.themeColor]);

    // Entry animation
    useEffect(() => {
        const timer = setTimeout(() => setEntryAnimDone(true), 800);
        return () => clearTimeout(timer);
    }, []);

    // Celebration detection
    useEffect(() => {
        if (correctPlacements.size === labels.length && labels.length > 0) {
            setIsComplete(true);
            setTimeout(() => {
                setShowCelebration(true);
                generateConfetti();
            }, 500);
        }
    }, [correctPlacements, labels.length]);

    // Report step details
    useEffect(() => {
        if (setStepDetails) {
            setStepDetails({
                currentStep: correctPlacements.size,
                totalSteps: labels.length,
                isPaused: true,
                currentMode: selectedMode,
            });
        }
    }, [correctPlacements.size, selectedMode, setStepDetails, labels.length]);

    // ─── CONFETTI ───
    const generateConfetti = useCallback(() => {
        const particles = Array.from({ length: 40 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            color: ['#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'][Math.floor(Math.random() * 6)],
            delay: Math.random() * 0.8,
            duration: 2 + Math.random() * 2,
            size: 6 + Math.random() * 8,
            rotation: Math.random() * 360,
        }));
        setConfettiParticles(particles);
    }, []);

    // ─── DRAG HANDLERS ───
    const getSVGPoint = useCallback((clientX: number, clientY: number) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const rect = svgRef.current.getBoundingClientRect();
        return {
            x: ((clientX - rect.left) / rect.width) * 100,
            y: ((clientY - rect.top) / rect.height) * 100,
        };
    }, []);

    const handleDragStart = useCallback((labelId: string, e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if (correctPlacements.has(labelId)) return;
        setDraggedLabel(labelId);
        const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
        setDragPosition({ x: clientX, y: clientY });
    }, [correctPlacements]);

    const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!draggedLabel) return;
        if (e.cancelable) e.preventDefault();
        const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
        setDragPosition({ x: clientX, y: clientY });

        // Check hover over zones
        const pt = getSVGPoint(clientX, clientY);
        let foundZone: string | null = null;
        for (const zone of targetZones) {
            if (!correctPlacements.has(zone.labelId)) {
                const halfW = zone.width / 2;
                const halfH = zone.height / 2;
                if (pt.x >= zone.x - halfW && pt.x <= zone.x + halfW &&
                    pt.y >= zone.y - halfH && pt.y <= zone.y + halfH) {
                    foundZone = zone.id;
                    break;
                }
            }
        }
        setHoveredZone(foundZone);
    }, [draggedLabel, getSVGPoint, targetZones, correctPlacements]);

    const handleDragEnd = useCallback((e: MouseEvent | TouchEvent) => {
        if (!draggedLabel) return;

        const clientX = 'changedTouches' in e ? (e as TouchEvent).changedTouches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'changedTouches' in e ? (e as TouchEvent).changedTouches[0].clientY : (e as MouseEvent).clientY;
        const pt = getSVGPoint(clientX, clientY);

        let matchedZone: typeof targetZones[0] | null = null;
        for (const zone of targetZones) {
            const halfW = zone.width / 2;
            const halfH = zone.height / 2;
            if (pt.x >= zone.x - halfW && pt.x <= zone.x + halfW &&
                pt.y >= zone.y - halfH && pt.y <= zone.y + halfH) {
                matchedZone = zone;
                break;
            }
        }

        setAttempts(prev => prev + 1);

        if (matchedZone) {
            if (matchedZone.labelId === draggedLabel) {
                // Correct!
                setCorrectPlacements(prev => new Set([...prev, draggedLabel as string]));
                setPlacements(prev => ({ ...prev, [matchedZone!.id]: draggedLabel as string }));
                setScore(prev => prev + 1);
            } else {
                // Wrong!
                setWrongAttempt(matchedZone.id);
                setShakeZone(matchedZone.id);
                setTimeout(() => {
                    setWrongAttempt(null);
                    setShakeZone(null);
                }, 700);
            }
        }

        setDraggedLabel(null);
        setDragPosition(null);
        setHoveredZone(null);
    }, [draggedLabel, getSVGPoint, targetZones]);

    // Attach global listeners
    useEffect(() => {
        if (draggedLabel) {
            window.addEventListener('mousemove', handleDragMove, { passive: false });
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchmove', handleDragMove, { passive: false });
            window.addEventListener('touchend', handleDragEnd);
            return () => {
                window.removeEventListener('mousemove', handleDragMove);
                window.removeEventListener('mouseup', handleDragEnd);
                window.removeEventListener('touchmove', handleDragMove);
                window.removeEventListener('touchend', handleDragEnd);
            };
        }
    }, [draggedLabel, handleDragMove, handleDragEnd]);

    // ─── RESET ───
    const handleReset = useCallback(() => {
        setPlacements({});
        setCorrectPlacements(new Set());
        setScore(0);
        setAttempts(0);
        setIsComplete(false);
        setShowCelebration(false);
        setConfettiParticles([]);
        setDraggedLabel(null);
        setDragPosition(null);
        setWrongAttempt(null);
        setShakeZone(null);
    }, []);

    // ─── COLORS ───
    const themeColor = config.themeColor;
    const bg = config.darkMode ? '#1a1a2e' : '#fffbeb';
    const cardBg = config.darkMode ? '#16213e' : '#ffffff';
    const textPrimary = config.darkMode ? '#fef3c7' : '#78350f';
    const textSecondary = config.darkMode ? '#d1d5db' : '#92400e';
    const borderColor = config.darkMode ? '#374151' : '#fde68a';

    // ─── LAMP SVG DRAWING ───
    const renderLampSVG = () => {
        return (
            <svg
                ref={svgRef}
                viewBox="0 0 100 100"
                style={{
                    width: '100%',
                    height: '100%',
                    maxHeight: config.height - 180,
                    userSelect: 'none',
                    touchAction: 'none',
                }}
            >
                <defs>
                    <radialGradient id="bulbGradient" cx="50%" cy="40%" r="50%">
                        <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.9" />
                        <stop offset="60%" stopColor="#fde68a" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#d4d4d8" stopOpacity="0.15" />
                    </radialGradient>
                    <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a8a29e" />
                        <stop offset="30%" stopColor="#d6d3d1" />
                        <stop offset="60%" stopColor="#a8a29e" />
                        <stop offset="100%" stopColor="#78716c" />
                    </linearGradient>
                    <linearGradient id="metalTipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#a8a29e" />
                        <stop offset="100%" stopColor="#57534e" />
                    </linearGradient>
                    <filter id="glowFilter">
                        <feGaussianBlur stdDeviation="0.8" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient id="insulatorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1c1917" />
                        <stop offset="50%" stopColor="#292524" />
                        <stop offset="100%" stopColor="#1c1917" />
                    </linearGradient>
                </defs>

                {/* ── Glass Bulb ── */}
                <ellipse cx="50" cy="16" rx="18" ry="16"
                    fill="url(#bulbGradient)"
                    stroke="#d4d4d8"
                    strokeWidth="0.6"
                    opacity="0.95"
                    style={{ animation: entryAnimDone ? undefined : 'lampFadeInUp 0.6s ease-out forwards' }}
                />
                {/* Bulb shine reflection */}
                <ellipse cx="43" cy="10" rx="5" ry="3.5" fill="white" opacity="0.35" transform="rotate(-15, 43, 10)" />

                {/* ── Filament (coiled wire) ── */}
                <g filter="url(#glowFilter)" style={{ animation: entryAnimDone ? undefined : 'lampFadeInUp 0.6s 0.1s ease-out both' }}>
                    <path
                        d="M 44 22 Q 45 18, 47 22 Q 48 18, 50 22 Q 51 18, 53 22 Q 54 18, 56 22"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                    />
                    {/* Glow around filament */}
                    <path
                        d="M 44 22 Q 45 18, 47 22 Q 48 18, 50 22 Q 51 18, 53 22 Q 54 18, 56 22"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.3"
                    />
                </g>

                {/* ── Support Wires ── */}
                <g style={{ animation: entryAnimDone ? undefined : 'lampFadeInUp 0.6s 0.2s ease-out both' }}>
                    <line x1="44" y1="22" x2="42" y2="42" stroke="#78716c" strokeWidth="0.9" strokeLinecap="round" />
                    <line x1="56" y1="22" x2="58" y2="42" stroke="#78716c" strokeWidth="0.9" strokeLinecap="round" />
                </g>

                {/* ── Neck / Glass-to-Metal transition ── */}
                <path d="M 34 32 Q 34 45, 38 48 L 62 48 Q 66 45, 66 32"
                    fill="none" stroke="#d4d4d8" strokeWidth="0.5" opacity="0.6"
                    style={{ animation: entryAnimDone ? undefined : 'lampFadeInUp 0.6s 0.25s ease-out both' }}
                />

                {/* ── Metal Case (Terminal 1) ── */}
                <g style={{ animation: entryAnimDone ? undefined : 'lampFadeInUp 0.6s 0.3s ease-out both' }}>
                    <rect x="37" y="48" width="26" height="18" rx="2" ry="2"
                        fill="url(#metalGradient)" stroke="#78716c" strokeWidth="0.5" />
                    {/* Screw thread lines */}
                    {[0, 3, 6, 9, 12].map(offset => (
                        <line key={offset} x1="37" y1={50 + offset} x2="63" y2={50 + offset}
                            stroke="#a8a29e" strokeWidth="0.3" opacity="0.6" />
                    ))}
                </g>

                {/* ── Insulator ── */}
                <g style={{ animation: entryAnimDone ? undefined : 'lampFadeInUp 0.6s 0.4s ease-out both' }}>
                    <rect x="40" y="66" width="20" height="8" rx="1.5"
                        fill="url(#insulatorGrad)" stroke="#44403c" strokeWidth="0.4" />
                    {/* Insulator pattern */}
                    <line x1="44" y1="66" x2="44" y2="74" stroke="#57534e" strokeWidth="0.3" opacity="0.4" />
                    <line x1="50" y1="66" x2="50" y2="74" stroke="#57534e" strokeWidth="0.3" opacity="0.4" />
                    <line x1="56" y1="66" x2="56" y2="74" stroke="#57534e" strokeWidth="0.3" opacity="0.4" />
                </g>

                {/* ── Metal Tip (Terminal 2) ── */}
                <g style={{ animation: entryAnimDone ? undefined : 'lampFadeInUp 0.6s 0.5s ease-out both' }}>
                    <ellipse cx="50" cy="78" rx="8" ry="4"
                        fill="url(#metalTipGradient)" stroke="#78716c" strokeWidth="0.4" />
                    <circle cx="50" cy="82" r="4" fill="#57534e" stroke="#44403c" strokeWidth="0.4" />
                    {/* Solder dot */}
                    <circle cx="50" cy="82" r="1.5" fill="#78716c" opacity="0.7" />
                </g>

                {/* ── Target Zones (drop targets) ── */}
                {targetZones.map((zone, i) => {
                    const isCorrect = correctPlacements.has(zone.labelId);
                    const isHovered = hoveredZone === zone.id;
                    const isWrong = wrongAttempt === zone.id;
                    const isShaking = shakeZone === zone.id;

                    return (
                        <g key={zone.id}
                            style={{
                                animation: isShaking ? 'lampShake 0.5s ease-in-out' : undefined,
                            }}
                        >
                            {/* Zone highlight rectangle */}
                            {!isCorrect && (
                                <rect
                                    x={zone.x - zone.width / 2}
                                    y={zone.y - zone.height / 2}
                                    width={zone.width}
                                    height={zone.height}
                                    rx="2"
                                    fill={isHovered ? `${themeColor}30` : isWrong ? '#ef444430' : `${themeColor}10`}
                                    stroke={isHovered ? themeColor : isWrong ? '#ef4444' : `${themeColor}60`}
                                    strokeWidth={isHovered ? '1' : '0.5'}
                                    strokeDasharray={isCorrect ? 'none' : '2,2'}
                                    style={{
                                        animation: !isCorrect && !isHovered ? 'lampZoneBreathe 3s ease-in-out infinite' : undefined,
                                        animationDelay: `${i * 0.3}s`,
                                        transition: 'all 0.3s ease',
                                    }}
                                />
                            )}
                            {/* Correct placement indicator */}
                            {isCorrect && (
                                <g>
                                    <rect
                                        x={zone.x - zone.width / 2}
                                        y={zone.y - zone.height / 2}
                                        width={zone.width}
                                        height={zone.height}
                                        rx="2"
                                        fill="#22c55e20"
                                        stroke="#22c55e"
                                        strokeWidth="0.8"
                                        style={{ animation: 'lampPopIn 0.4s ease-out' }}
                                    />
                                    {/* Label text inside zone */}
                                    <text
                                        x={zone.x}
                                        y={zone.y + 0.5}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="#15803d"
                                        fontSize="3"
                                        fontWeight="700"
                                        fontFamily="'Nunito', 'Segoe UI', sans-serif"
                                        style={{ animation: 'lampPopIn 0.4s 0.1s ease-out both' }}
                                    >
                                        {labels.find(l => l.id === zone.labelId)?.text || ''}
                                    </text>
                                    {/* Checkmark */}
                                    <circle cx={zone.x + zone.width / 2 - 2} cy={zone.y - zone.height / 2 + 2}
                                        r="2" fill="#22c55e"
                                        style={{ animation: 'lampPopIn 0.4s 0.2s ease-out both' }}
                                    />
                                    <path
                                        d={`M ${zone.x + zone.width / 2 - 3.2} ${zone.y - zone.height / 2 + 2}
                                            L ${zone.x + zone.width / 2 - 2.2} ${zone.y - zone.height / 2 + 3}
                                            L ${zone.x + zone.width / 2 - 0.8} ${zone.y - zone.height / 2 + 1}`}
                                        fill="none" stroke="white" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round"
                                        style={{ animation: 'lampPopIn 0.4s 0.3s ease-out both' }}
                                    />
                                </g>
                            )}
                        </g>
                    );
                })}

                {/* ── Leader lines (when hints on) ── */}
                {hintsEnabled && !isComplete && targetZones.map((zone, i) => {
                    if (correctPlacements.has(zone.labelId)) return null;
                    const side = i % 2 === 0 ? -1 : 1;
                    const endX = zone.x + side * (zone.width / 2 + 5);
                    return (
                        <line key={`leader-${zone.id}`}
                            x1={zone.x + side * (zone.width / 2)}
                            y1={zone.y}
                            x2={endX}
                            y2={zone.y}
                            stroke={`${themeColor}50`}
                            strokeWidth="0.3"
                            strokeDasharray="1,1"
                            style={{
                                animation: 'lampTargetPulse 2s ease-in-out infinite',
                                animationDelay: `${i * 0.2}s`,
                            }}
                        />
                    );
                })}
            </svg>
        );
    };

    // ─── LABEL CARD ───
    const renderLabelCard = (label: typeof labels[0], index: number) => {
        const isPlaced = correctPlacements.has(label.id);
        const isDragging = draggedLabel === label.id;
        const isHovered = hoveredLabel === label.id;

        if (isPlaced) {
            return (
                <div
                    key={label.id}
                    style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        background: '#22c55e15',
                        border: '2px solid #22c55e50',
                        color: '#16a34a',
                        fontSize: '13px',
                        fontWeight: 600,
                        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        opacity: 0.7,
                        textDecoration: 'line-through',
                        animation: `lampSlideIn 0.3s ${index * 0.05}s ease-out both`,
                        transition: 'all 0.3s ease',
                    }}
                >
                    <Check size={14} color="#22c55e" />
                    {label.text}
                </div>
            );
        }

        return (
            <div
                key={label.id}
                onMouseDown={(e) => handleDragStart(label.id, e)}
                onTouchStart={(e) => handleDragStart(label.id, e)}
                onMouseEnter={() => setHoveredLabel(label.id)}
                onMouseLeave={() => setHoveredLabel(null)}
                style={{
                    padding: '10px 16px',
                    borderRadius: '12px',
                    background: isDragging
                        ? `linear-gradient(135deg, ${themeColor}30, ${themeColor}15)`
                        : isHovered
                            ? `linear-gradient(135deg, ${themeColor}15, ${themeColor}08)`
                            : cardBg,
                    border: `2px solid ${isDragging ? themeColor : isHovered ? `${themeColor}80` : borderColor}`,
                    boxShadow: isDragging
                        ? `0 8px 24px ${themeColor}30`
                        : isHovered
                            ? `0 4px 12px ${themeColor}20`
                            : '0 2px 6px rgba(0,0,0,0.06)',
                    cursor: 'grab',
                    userSelect: 'none',
                    touchAction: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
                    color: textPrimary,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                    transform: isDragging ? 'scale(1.05)' : isHovered ? 'scale(1.02)' : 'scale(1)',
                    opacity: isDragging ? 0.5 : 1,
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `lampSlideIn 0.4s ${index * 0.08}s ease-out both`,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={13} color={themeColor} style={{ flexShrink: 0 }} />
                    <span>{label.text}</span>
                </div>
                {hintsEnabled && label.hint && (
                    <div style={{
                        fontSize: '10.5px',
                        color: textSecondary,
                        fontWeight: 400,
                        lineHeight: 1.3,
                        paddingLeft: '19px',
                        opacity: 0.85,
                    }}>
                        {label.hint}
                    </div>
                )}
            </div>
        );
    };

    // ─── FLOATING DRAGGED LABEL ───
    const renderDragGhost = () => {
        if (!draggedLabel || !dragPosition) return null;
        const label = labels.find(l => l.id === draggedLabel);
        if (!label) return null;

        return (
            <div
                style={{
                    position: 'fixed',
                    left: dragPosition.x - 60,
                    top: dragPosition.y - 20,
                    padding: '10px 18px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${themeColor}, ${themeColor}cc)`,
                    color: 'white',
                    fontWeight: 700,
                    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
                    fontSize: '13px',
                    boxShadow: `0 12px 32px ${themeColor}50, 0 4px 8px rgba(0,0,0,0.15)`,
                    pointerEvents: 'none',
                    zIndex: 10000,
                    transform: 'rotate(-2deg)',
                    whiteSpace: 'nowrap',
                }}
            >
                {label.text}
            </div>
        );
    };

    // ─── CELEBRATION OVERLAY ───
    const renderCelebration = () => {
        if (!showCelebration) return null;
        return (
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.6)',
                borderRadius: '20px',
                zIndex: 100,
                animation: 'lampFadeInUp 0.5s ease-out',
            }}>
                {/* Confetti */}
                {confettiParticles.map(p => (
                    <div key={p.id} style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: '-5%',
                        width: p.size,
                        height: p.size,
                        background: p.color,
                        borderRadius: p.id % 3 === 0 ? '50%' : '2px',
                        animation: `lampConfetti ${p.duration}s ${p.delay}s ease-in forwards`,
                        transform: `rotate(${p.rotation}deg)`,
                    }} />
                ))}

                <div style={{
                    background: cardBg,
                    borderRadius: '24px',
                    padding: '36px 48px',
                    textAlign: 'center',
                    maxWidth: '400px',
                    boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 40px ${themeColor}30`,
                    animation: 'lampPopIn 0.6s 0.2s ease-out both',
                }}>
                    <div style={{ fontSize: '52px', marginBottom: '12px' }}>🏆</div>
                    <div style={{
                        fontSize: '22px',
                        fontWeight: 800,
                        color: textPrimary,
                        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
                        marginBottom: '8px',
                    }}>
                        {celebrationMessage}
                    </div>
                    <div style={{
                        fontSize: '15px',
                        color: textSecondary,
                        marginBottom: '20px',
                        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
                    }}>
                        Score: {score}/{labels.length}
                        {attempts > 0 && ` • Accuracy: ${Math.round((score / attempts) * 100)}%`}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button
                            onClick={handleReset}
                            style={{
                                padding: '12px 28px',
                                borderRadius: '12px',
                                border: 'none',
                                background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '14px',
                                fontFamily: "'Nunito', 'Segoe UI', sans-serif",
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                                boxShadow: `0 4px 12px ${themeColor}40`,
                            }}
                            onMouseEnter={e => {
                                (e.target as HTMLElement).style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={e => {
                                (e.target as HTMLElement).style.transform = 'scale(1)';
                            }}
                        >
                            <RotateCcw size={16} />
                            Try Again
                        </button>
                        <button
                            onClick={() => {
                                handleReset();
                                setHintsEnabled(false);
                            }}
                            style={{
                                padding: '12px 28px',
                                borderRadius: '12px',
                                border: `2px solid ${themeColor}`,
                                background: 'transparent',
                                color: themeColor,
                                fontWeight: 700,
                                fontSize: '14px',
                                fontFamily: "'Nunito', 'Segoe UI', sans-serif",
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => {
                                (e.target as HTMLElement).style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={e => {
                                (e.target as HTMLElement).style.transform = 'scale(1)';
                            }}
                        >
                            <Star size={16} />
                            Try Without Hints
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // ─── MAIN RENDER ───
    return (
        <div
            ref={containerRef}
            style={{
                width: config.width,
                maxWidth: '100%',
                height: config.height,
                display: 'flex',
                flexDirection: 'column',
                background: bg,
                borderRadius: '20px',
                overflow: 'hidden',
                fontFamily: "'Nunito', 'Segoe UI', sans-serif",
                position: 'relative',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: `1px solid ${borderColor}`,
            }}
        >
            {/* ── HEADER ── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px',
                borderBottom: `1px solid ${borderColor}`,
                background: config.darkMode
                    ? 'linear-gradient(135deg, #1e293b, #0f172a)'
                    : `linear-gradient(135deg, ${themeColor}10, ${themeColor}05)`,
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        background: `linear-gradient(135deg, ${themeColor}, ${themeColor}bb)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 3px 10px ${themeColor}40`,
                    }}>
                        <Zap size={18} color="white" />
                    </div>
                    <div>
                        <div style={{
                            fontSize: '15px',
                            fontWeight: 800,
                            color: textPrimary,
                            letterSpacing: '-0.3px',
                        }}>
                            Label the Incandescent Lamp
                        </div>
                        <div style={{
                            fontSize: '11px',
                            color: textSecondary,
                            fontWeight: 500,
                        }}>
                            Activity 3.4 • NCERT Grade 7 Science
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Score */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '5px 12px',
                        borderRadius: '20px',
                        background: score > 0 ? '#22c55e15' : `${themeColor}10`,
                        border: `1px solid ${score > 0 ? '#22c55e40' : `${themeColor}30`}`,
                        fontSize: '13px',
                        fontWeight: 700,
                        color: score > 0 ? '#16a34a' : textSecondary,
                    }}>
                        <Award size={14} />
                        {score}/{labels.length}
                    </div>

                    {/* Hints Toggle */}
                    <button
                        onClick={() => setHintsEnabled(!hintsEnabled)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '5px 12px',
                            borderRadius: '20px',
                            border: `1px solid ${hintsEnabled ? `${themeColor}50` : '#d1d5db'}`,
                            background: hintsEnabled ? `${themeColor}10` : 'transparent',
                            color: hintsEnabled ? themeColor : textSecondary,
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {hintsEnabled ? <Eye size={13} /> : <EyeOff size={13} />}
                        Hints {hintsEnabled ? 'ON' : 'OFF'}
                    </button>

                    {/* Reset */}
                    <button
                        onClick={handleReset}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            border: `1px solid ${borderColor}`,
                            background: cardBg,
                            color: textSecondary,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                        title="Reset"
                    >
                        <RotateCcw size={14} />
                    </button>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div style={{
                display: 'flex',
                flex: 1,
                overflow: 'hidden',
            }}>
                {/* LEFT: Lamp Diagram */}
                <div style={{
                    flex: '1 1 55%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    position: 'relative',
                    background: config.darkMode
                        ? 'linear-gradient(180deg, #0f172a, #1e293b)'
                        : 'linear-gradient(180deg, #fffbeb, #fef3c7)',
                }}>
                    {renderLampSVG()}
                </div>

                {/* RIGHT: Labels Panel */}
                <div style={{
                    flex: '1 1 45%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: `1px solid ${borderColor}`,
                    background: cardBg,
                    overflow: 'hidden',
                }}>
                    {/* Instructions */}
                    <div style={{
                        padding: '12px 16px',
                        borderBottom: `1px solid ${borderColor}`,
                        background: `${themeColor}06`,
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: themeColor,
                            marginBottom: '4px',
                        }}>
                            <Target size={13} />
                            INSTRUCTIONS
                        </div>
                        <div style={{
                            fontSize: '12px',
                            color: textSecondary,
                            lineHeight: 1.4,
                        }}>
                            Drag each label to the correct part of the incandescent lamp! Start from the top and work your way down.
                        </div>
                    </div>

                    {/* Labels List */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                    }}>
                        {labels.map((label, index) => renderLabelCard(label, index))}
                    </div>

                    {/* Progress Bar */}
                    <div style={{
                        padding: '10px 16px',
                        borderTop: `1px solid ${borderColor}`,
                        background: `${themeColor}04`,
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px',
                        }}>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: textSecondary }}>
                                Progress
                            </span>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: themeColor }}>
                                {correctPlacements.size}/{labels.length} placed
                            </span>
                        </div>
                        <div style={{
                            height: 6,
                            borderRadius: 3,
                            background: `${themeColor}15`,
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${(correctPlacements.size / labels.length) * 100}%`,
                                borderRadius: 3,
                                background: correctPlacements.size === labels.length
                                    ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                                    : `linear-gradient(90deg, ${themeColor}, ${themeColor}cc)`,
                                transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: `0 0 8px ${themeColor}40`,
                            }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating drag ghost */}
            {renderDragGhost()}

            {/* Celebration overlay */}
            {renderCelebration()}
        </div>
    );
};

export default IncandescentLampLabelingTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════