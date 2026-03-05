// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: circuit_symbols_tool.tsx
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Check, X, BookOpen, Target, RotateCcw, Zap, Award, Plus } from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================

type ModeType = 'learn' | 'practice';

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
    type: 'intro' | 'explanation' | 'practice';
    mode: ModeType;
    data?: any;
}

interface BaseDataInterface {
    themeColor?: string;
    autoPlayDuration?: number;
}

interface CircuitSymbolsAdditionalProps {
    symbolSet?: 'basic' | 'extended';
    showLabels?: boolean;
    showTerminals?: boolean;
    quizDifficulty?: 'easy' | 'medium' | 'hard';
}

interface CircuitSymbolsToolProps {
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
        additionalProps?: CircuitSymbolsAdditionalProps;
    };
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGULARITY DESIGN SYSTEM TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const DS = {
    // Primary palette
    primary: '#4A4DC9',
    primaryDark: '#533086',
    accent: '#FF7212',
    accentWarm: '#FC9145',

    // Light tints
    primaryLight: '#C1C1EA',
    primaryLighter: '#E8E8F5',
    primaryGhost: '#F0F0FA',
    accentLight: '#FFF3E4',
    accentLighter: '#FFF9F2',

    // Neutrals
    textPrimary: '#4E4E4E',
    textSecondary: '#7A7A7A',
    textDisabled: '#CACACA',
    border: '#EBEBEB',
    surface: '#F5F5F5',
    white: '#FFFFFF',

    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #533086 0%, #FC9145 100%)',
    gradientPrimarySubtle: 'linear-gradient(135deg, #4A4DC9 0%, #7B61FF 100%)',
    gradientAccent: 'linear-gradient(135deg, #FF7212 0%, #FC9145 100%)',
    gradientHeader: 'linear-gradient(135deg, #533086 0%, #4A4DC9 50%, #FC9145 100%)',

    // Typography
    fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif",

    // Spacing
    spacingXs: 4,
    spacingSm: 8,
    spacingMd: 16,
    spacingLg: 24,
    spacingXl: 32,
    spacing2xl: 40,

    // Radii
    radiusSm: 8,
    radiusMd: 12,
    radiusLg: 16,
    radiusXl: 24,
    radiusFull: 999,

    // Shadows
    shadowSm: '0 2px 8px rgba(74, 77, 201, 0.08)',
    shadowMd: '0 4px 16px rgba(74, 77, 201, 0.12)',
    shadowLg: '0 8px 32px rgba(74, 77, 201, 0.16)',
    shadowAccent: '0 4px 20px rgba(255, 114, 18, 0.25)',
    shadowPrimary: '0 4px 20px rgba(74, 77, 201, 0.25)',
};

// ==================== SYMBOL DATA ====================

interface SymbolInfo {
    name: string;
    shortName: string;
    description: string;
    terminalInfo: string;
    funFact: string;
    color: string;
    accentColor: string;
}

const SYMBOLS: SymbolInfo[] = [
    {
        name: 'Electric Cell',
        shortName: 'Cell',
        description: 'A portable source of electrical energy with two terminals. The long line represents the positive (+) terminal and the short thick line represents the negative (−) terminal.',
        terminalInfo: 'Long line = Positive (+) | Short line = Negative (−)',
        funFact: 'The metal cap on a real cell is the positive terminal!',
        color: DS.primary,
        accentColor: DS.accent,
    },
    {
        name: 'Battery',
        shortName: 'Battery',
        description: 'Two or more cells connected together. The positive terminal of one cell connects to the negative terminal of the next. Provides more energy or lasts longer.',
        terminalInfo: 'Multiple cells in series — alternating long and short lines',
        funFact: 'Even a single cell in your phone is called a "battery"!',
        color: DS.primaryDark,
        accentColor: DS.accentWarm,
    },
    {
        name: 'Electric Lamp',
        shortName: 'Lamp',
        description: 'An incandescent lamp is shown as a cross (×) inside a circle. The cross represents the filament that glows when current passes through it.',
        terminalInfo: 'Two terminals — direction doesn\'t matter for incandescent lamps',
        funFact: 'A "fused" lamp has a broken filament that stops current flow!',
        color: DS.accent,
        accentColor: DS.primary,
    },
    {
        name: 'Light Emitting Diode (LED)',
        shortName: 'LED',
        description: 'Shown as a triangle pointing in the direction of current flow, with two small arrows indicating light emission. Current can only flow in one direction through an LED.',
        terminalInfo: 'Triangle tip = direction of current | Longer wire = Positive (+)',
        funFact: 'LEDs don\'t have filaments — they\'re more efficient than bulbs!',
        color: DS.primary,
        accentColor: DS.accent,
    },
    {
        name: 'Switch (ON)',
        shortName: 'Switch ON',
        description: 'When ON, the switch completes the circuit by closing the gap. Shown as a line connecting two dots — the circuit is closed and current flows.',
        terminalInfo: 'Connected dots = closed circuit = current flows',
        funFact: 'A switch can be placed anywhere in a circuit!',
        color: DS.primaryDark,
        accentColor: DS.accentWarm,
    },
    {
        name: 'Switch (OFF)',
        shortName: 'Switch OFF',
        description: 'When OFF, the switch breaks the circuit by creating a gap. Shown as an open line between two dots — the circuit is open and no current flows.',
        terminalInfo: 'Open gap = broken circuit = no current',
        funFact: 'In the OFF position, we say the circuit is "open"!',
        color: DS.accent,
        accentColor: DS.primary,
    },
    {
        name: 'Wire',
        shortName: 'Wire',
        description: 'A connecting wire is simply shown as a straight line. Wires are made of conductors (usually copper) and covered with insulators (plastic/rubber) for safety.',
        terminalInfo: 'A straight line — connects components in a circuit',
        funFact: 'Copper is used for wires because it conducts well and is affordable!',
        color: DS.primaryDark,
        accentColor: DS.accentWarm,
    },
];

// ==================== QUIZ DATA ====================

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    symbolIndex?: number;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: 1,
        question: 'Which symbol represents an electric cell?',
        options: ['A cross inside a circle', 'A long and short parallel line', 'A triangle with arrows', 'A straight line'],
        correctIndex: 1,
        explanation: 'An electric cell is represented by a long line (positive terminal) and a short thick line (negative terminal).',
        symbolIndex: 0,
    },
    {
        id: 2,
        question: 'In the symbol for a cell, which line represents the positive terminal?',
        options: ['The short thick line', 'The long thin line', 'Both lines are the same', 'Neither — there is no positive terminal'],
        correctIndex: 1,
        explanation: 'The long thin line represents the positive (+) terminal, while the short thick line represents the negative (−) terminal.',
        symbolIndex: 0,
    },
    {
        id: 3,
        question: 'What does the cross (×) inside the circle represent in a lamp symbol?',
        options: ['The switch', 'The battery', 'The filament', 'The wire'],
        correctIndex: 2,
        explanation: 'The cross represents the filament of the incandescent lamp, which gets hot and glows to produce light.',
        symbolIndex: 2,
    },
    {
        id: 4,
        question: 'How is an LED different from a regular lamp in a circuit?',
        options: ['LED is brighter', 'Current flows through LED in one direction only', 'LED needs no battery', 'LED has no symbol'],
        correctIndex: 1,
        explanation: 'Unlike incandescent lamps, current can pass through an LED in only one direction. The positive terminal (longer wire) must connect to the positive terminal of the battery.',
        symbolIndex: 3,
    },
    {
        id: 5,
        question: 'When a switch is in the OFF position, what happens in the circuit?',
        options: ['Current flows faster', 'The circuit is closed', 'There is a gap and no current flows', 'The lamp glows dimly'],
        correctIndex: 2,
        explanation: 'In the OFF position, the switch creates a gap (open circuit), preventing current from flowing. The lamp will not glow.',
        symbolIndex: 5,
    },
    {
        id: 6,
        question: 'A battery symbol shows multiple alternating long and short lines. What does this represent?',
        options: ['Multiple switches', 'Multiple lamps connected', 'Two or more cells connected in series', 'A broken circuit'],
        correctIndex: 2,
        explanation: 'A battery is a combination of two or more cells connected together, with the positive terminal of one cell connected to the negative terminal of the next.',
        symbolIndex: 1,
    },
];

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
    { id: 1, title: 'Welcome to Circuit Symbols!', description: 'Electrical circuits can be represented using standard symbols. Let\'s learn all seven symbols used in circuit diagrams — used by scientists and engineers worldwide!', type: 'intro', mode: 'learn' },
    { id: 2, title: 'Electric Cell', description: '', type: 'explanation', mode: 'learn', data: { symbolIndex: 0 } },
    { id: 3, title: 'Battery', description: '', type: 'explanation', mode: 'learn', data: { symbolIndex: 1 } },
    { id: 4, title: 'Electric Lamp', description: '', type: 'explanation', mode: 'learn', data: { symbolIndex: 2 } },
    { id: 5, title: 'LED (Light Emitting Diode)', description: '', type: 'explanation', mode: 'learn', data: { symbolIndex: 3 } },
    { id: 6, title: 'Switch ON & OFF', description: '', type: 'explanation', mode: 'learn', data: { symbolIndex: 4 } },
    { id: 7, title: 'Complete Circuit Diagram', description: 'Now you know all seven symbols! Here\'s a complete circuit with a cell, switch, and lamp connected by wires. The circuit diagram makes it easy to understand how components connect.', type: 'explanation', mode: 'learn', data: { symbolIndex: 6 } },
    { id: 10, title: 'Quiz Time!', description: '', type: 'practice', mode: 'practice', data: { questionIndex: 0 } },
    { id: 11, title: 'Quiz Time!', description: '', type: 'practice', mode: 'practice', data: { questionIndex: 1 } },
    { id: 12, title: 'Quiz Time!', description: '', type: 'practice', mode: 'practice', data: { questionIndex: 2 } },
    { id: 13, title: 'Quiz Time!', description: '', type: 'practice', mode: 'practice', data: { questionIndex: 3 } },
    { id: 14, title: 'Quiz Time!', description: '', type: 'practice', mode: 'practice', data: { questionIndex: 4 } },
    { id: 15, title: 'Quiz Time!', description: '', type: 'practice', mode: 'practice', data: { questionIndex: 5 } },
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
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInScale {
        from { opacity: 0; transform: scale(0.85); }
        to { opacity: 1; transform: scale(1); }
    }
    @keyframes popIn {
        0% { transform: scale(0); opacity: 0; }
        60% { transform: scale(1.08); }
        100% { transform: scale(1); opacity: 1; }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.04); }
    }
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(32px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-32px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes drawLine {
        from { stroke-dashoffset: 200; }
        to { stroke-dashoffset: 0; }
    }
    @keyframes glowPulse {
        0%, 100% { filter: drop-shadow(0 0 4px rgba(74,77,201,0)); }
        50% { filter: drop-shadow(0 0 16px rgba(74,77,201,0.35)); }
    }
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
    }
    @keyframes correctPop {
        0% { transform: scale(1); }
        25% { transform: scale(1.06); }
        50% { transform: scale(0.97); }
        100% { transform: scale(1); }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-5px); }
        40% { transform: translateX(5px); }
        60% { transform: translateX(-3px); }
        80% { transform: translateX(3px); }
    }
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes floatIn {
        0% { opacity: 0; transform: translateY(12px) scale(0.95); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes ringPulse {
        0% { box-shadow: 0 0 0 0 rgba(74, 77, 201, 0.3); }
        70% { box-shadow: 0 0 0 10px rgba(74, 77, 201, 0); }
        100% { box-shadow: 0 0 0 0 rgba(74, 77, 201, 0); }
    }
    @keyframes accentRingPulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 114, 18, 0.3); }
        70% { box-shadow: 0 0 0 10px rgba(255, 114, 18, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 114, 18, 0); }
    }
`;

// ═══════════════════════════════════════════════════════════════════════════
// SYMBOL SVG RENDERER
// ═══════════════════════════════════════════════════════════════════════════

const SymbolSVG: React.FC<{
    symbolIndex: number;
    size?: number;
    animated?: boolean;
    showTerminals?: boolean;
    color?: string;
}> = ({ symbolIndex, size = 160, animated = true, showTerminals = true, color }) => {
    const s = size;
    const cx = s / 2;
    const cy = s / 2;
    const strokeColor = color || DS.primary;
    const animStyle: React.CSSProperties = animated ? { animation: 'drawLine 0.8s ease-out forwards', strokeDasharray: 200, strokeDashoffset: 200 } : {};

    const renderSymbol = () => {
        switch (symbolIndex) {
            case 0: // Cell
                return (
                    <g>
                        <line x1={cx} y1={cy - s * 0.28} x2={cx} y2={cy + s * 0.28}
                            stroke={strokeColor} strokeWidth={2.5} style={animStyle} />
                        <line x1={cx + s * 0.16} y1={cy - s * 0.16} x2={cx + s * 0.16} y2={cy + s * 0.16}
                            stroke={strokeColor} strokeWidth={5.5} style={animStyle} />
                        <line x1={cx - s * 0.32} y1={cy} x2={cx} y2={cy}
                            stroke={DS.textSecondary} strokeWidth={2} />
                        <line x1={cx + s * 0.16} y1={cy} x2={cx + s * 0.46} y2={cy}
                            stroke={DS.textSecondary} strokeWidth={2} />
                        {showTerminals && (
                            <>
                                <text x={cx} y={cy - s * 0.34} textAnchor="middle" fontSize={13} fontWeight={700} fill={DS.accent} fontFamily={DS.fontFamily}>+</text>
                                <text x={cx + s * 0.16} y={cy - s * 0.22} textAnchor="middle" fontSize={13} fontWeight={700} fill={DS.primary} fontFamily={DS.fontFamily}>−</text>
                            </>
                        )}
                    </g>
                );
            case 1: // Battery
                return (
                    <g>
                        <line x1={cx - s * 0.12} y1={cy - s * 0.28} x2={cx - s * 0.12} y2={cy + s * 0.28}
                            stroke={strokeColor} strokeWidth={2.5} style={animStyle} />
                        <line x1={cx} y1={cy - s * 0.16} x2={cx} y2={cy + s * 0.16}
                            stroke={strokeColor} strokeWidth={5.5} style={animStyle} />
                        <line x1={cx + s * 0.12} y1={cy - s * 0.28} x2={cx + s * 0.12} y2={cy + s * 0.28}
                            stroke={strokeColor} strokeWidth={2.5} style={animStyle} />
                        <line x1={cx + s * 0.24} y1={cy - s * 0.16} x2={cx + s * 0.24} y2={cy + s * 0.16}
                            stroke={strokeColor} strokeWidth={5.5} style={animStyle} />
                        <line x1={cx - s * 0.38} y1={cy} x2={cx - s * 0.12} y2={cy}
                            stroke={DS.textSecondary} strokeWidth={2} />
                        <line x1={cx + s * 0.24} y1={cy} x2={cx + s * 0.46} y2={cy}
                            stroke={DS.textSecondary} strokeWidth={2} />
                        {showTerminals && (
                            <>
                                <text x={cx - s * 0.12} y={cy - s * 0.34} textAnchor="middle" fontSize={12} fontWeight={700} fill={DS.accent} fontFamily={DS.fontFamily}>+</text>
                                <text x={cx + s * 0.24} y={cy - s * 0.22} textAnchor="middle" fontSize={12} fontWeight={700} fill={DS.primary} fontFamily={DS.fontFamily}>−</text>
                            </>
                        )}
                    </g>
                );
            case 2: // Lamp
                return (
                    <g>
                        <circle cx={cx} cy={cy} r={s * 0.22} fill="none" stroke={strokeColor}
                            strokeWidth={2.5} style={animStyle} />
                        <line x1={cx - s * 0.155} y1={cy - s * 0.155} x2={cx + s * 0.155} y2={cy + s * 0.155}
                            stroke={strokeColor} strokeWidth={2.5} style={animStyle} />
                        <line x1={cx + s * 0.155} y1={cy - s * 0.155} x2={cx - s * 0.155} y2={cy + s * 0.155}
                            stroke={strokeColor} strokeWidth={2.5} style={animStyle} />
                        <line x1={cx - s * 0.4} y1={cy} x2={cx - s * 0.22} y2={cy}
                            stroke={DS.textSecondary} strokeWidth={2} />
                        <line x1={cx + s * 0.22} y1={cy} x2={cx + s * 0.46} y2={cy}
                            stroke={DS.textSecondary} strokeWidth={2} />
                    </g>
                );
            case 3: // LED
                return (
                    <g>
                        <polygon
                            points={`${cx - s * 0.14},${cy - s * 0.2} ${cx - s * 0.14},${cy + s * 0.2} ${cx + s * 0.14},${cy}`}
                            fill="none" stroke={strokeColor} strokeWidth={2.5} strokeLinejoin="round"
                            style={animStyle} />
                        <line x1={cx + s * 0.14} y1={cy - s * 0.2} x2={cx + s * 0.14} y2={cy + s * 0.2}
                            stroke={strokeColor} strokeWidth={2.5} style={animStyle} />
                        <line x1={cx + s * 0.05} y1={cy - s * 0.28} x2={cx + s * 0.18} y2={cy - s * 0.38}
                            stroke={DS.accent} strokeWidth={1.8} markerEnd="url(#singArrow)" />
                        <line x1={cx + s * 0.13} y1={cy - s * 0.25} x2={cx + s * 0.26} y2={cy - s * 0.35}
                            stroke={DS.accent} strokeWidth={1.8} markerEnd="url(#singArrow)" />
                        <line x1={cx - s * 0.38} y1={cy} x2={cx - s * 0.14} y2={cy}
                            stroke={DS.textSecondary} strokeWidth={2} />
                        <line x1={cx + s * 0.14} y1={cy} x2={cx + s * 0.46} y2={cy}
                            stroke={DS.textSecondary} strokeWidth={2} />
                        {showTerminals && (
                            <>
                                <text x={cx - s * 0.24} y={cy + s * 0.38} textAnchor="middle" fontSize={11} fontWeight={600} fill={DS.accent} fontFamily={DS.fontFamily}>+</text>
                                <text x={cx + s * 0.3} y={cy + s * 0.38} textAnchor="middle" fontSize={11} fontWeight={600} fill={DS.primary} fontFamily={DS.fontFamily}>−</text>
                            </>
                        )}
                    </g>
                );
            case 4: // Switch ON
                return (
                    <g>
                        <circle cx={cx - s * 0.16} cy={cy} r={4.5} fill={strokeColor} />
                        <circle cx={cx + s * 0.16} cy={cy} r={4.5} fill={strokeColor} />
                        <line x1={cx - s * 0.16} y1={cy} x2={cx + s * 0.16} y2={cy}
                            stroke={strokeColor} strokeWidth={2.5} style={animStyle} />
                        <line x1={cx - s * 0.4} y1={cy} x2={cx - s * 0.16} y2={cy}
                            stroke={DS.textSecondary} strokeWidth={2} />
                        <line x1={cx + s * 0.16} y1={cy} x2={cx + s * 0.46} y2={cy}
                            stroke={DS.textSecondary} strokeWidth={2} />
                    </g>
                );
            case 5: // Switch OFF
                return (
                    <g>
                        <circle cx={cx - s * 0.16} cy={cy} r={4.5} fill={strokeColor} />
                        <circle cx={cx + s * 0.16} cy={cy} r={4.5} fill={strokeColor} />
                        <line x1={cx - s * 0.16} y1={cy} x2={cx + s * 0.1} y2={cy - s * 0.2}
                            stroke={strokeColor} strokeWidth={2.5} style={animStyle} />
                        <line x1={cx - s * 0.4} y1={cy} x2={cx - s * 0.16} y2={cy}
                            stroke={DS.textSecondary} strokeWidth={2} />
                        <line x1={cx + s * 0.16} y1={cy} x2={cx + s * 0.46} y2={cy}
                            stroke={DS.textSecondary} strokeWidth={2} />
                    </g>
                );
            case 6: // Complete circuit
                return (
                    <g>
                        <line x1={cx - s * 0.36} y1={cy - s * 0.22} x2={cx + s * 0.36} y2={cy - s * 0.22}
                            stroke={DS.textSecondary} strokeWidth={2} style={animStyle} />
                        <line x1={cx - s * 0.36} y1={cy + s * 0.22} x2={cx + s * 0.36} y2={cy + s * 0.22}
                            stroke={DS.textSecondary} strokeWidth={2} style={animStyle} />
                        <line x1={cx - s * 0.36} y1={cy - s * 0.22} x2={cx - s * 0.36} y2={cy + s * 0.22}
                            stroke={DS.textSecondary} strokeWidth={2} style={animStyle} />
                        <line x1={cx + s * 0.36} y1={cy - s * 0.22} x2={cx + s * 0.36} y2={cy + s * 0.22}
                            stroke={DS.textSecondary} strokeWidth={2} style={animStyle} />
                        {/* Cell bottom */}
                        <line x1={cx - s * 0.04} y1={cy + s * 0.1} x2={cx - s * 0.04} y2={cy + s * 0.34}
                            stroke={DS.primary} strokeWidth={2.5} />
                        <line x1={cx + s * 0.06} y1={cy + s * 0.14} x2={cx + s * 0.06} y2={cy + s * 0.3}
                            stroke={DS.primary} strokeWidth={4.5} />
                        {/* Lamp top */}
                        <circle cx={cx} cy={cy - s * 0.22} r={s * 0.1} fill="none" stroke={DS.accent} strokeWidth={2} />
                        <line x1={cx - s * 0.07} y1={cy - s * 0.29} x2={cx + s * 0.07} y2={cy - s * 0.15}
                            stroke={DS.accent} strokeWidth={2} />
                        <line x1={cx + s * 0.07} y1={cy - s * 0.29} x2={cx - s * 0.07} y2={cy - s * 0.15}
                            stroke={DS.accent} strokeWidth={2} />
                        {/* Switch right */}
                        <circle cx={cx + s * 0.26} cy={cy} r={3} fill={DS.primaryDark} />
                        <circle cx={cx + s * 0.42} cy={cy} r={3} fill={DS.primaryDark} />
                        <line x1={cx + s * 0.26} y1={cy} x2={cx + s * 0.39} y2={cy - s * 0.1}
                            stroke={DS.primaryDark} strokeWidth={2} />
                    </g>
                );
            default:
                return null;
        }
    };

    return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ overflow: 'visible' }}>
            <defs>
                <marker id="singArrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" fill={DS.accent} />
                </marker>
            </defs>
            {renderSymbol()}
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const CircuitSymbolsTool: React.FC<CircuitSymbolsToolProps> = ({
    props = {},
    setStepDetails,
    stopAutoNext,
    setStopAutoNext
}) => {
    const config = useMemo(() => ({
        width: props.width ?? 800,
        height: props.height ?? 600,
        initialMode: props.initialMode ?? 'learn' as ModeType,
        showModeSelector: props.showModeSelector ?? true,
        enabledModes: props.enabledModes ?? ['learn', 'practice'] as ModeType[],
        showNavigation: props.showNavigation ?? true,
        showPlayPause: props.showPlayPause ?? true,
        showStepIndicator: props.showStepIndicator ?? true,
        initialStep: props.initialStep ?? 1,
        filterSteps: props.filterSteps ?? null,
        animationSpeed: props.animationSpeed ?? 1,
        autoPlayDuration: props.autoPlayDuration ?? props.data?.autoPlayDuration ?? 8000,
        themeColor: props.themeColor ?? props.data?.themeColor ?? DS.primary,
        darkMode: props.darkMode ?? false,
    }), [props]);

    const allSteps = props.steps || DEFAULT_STEPS;
    const availableSteps = useMemo(() => {
        if (config.filterSteps && config.filterSteps.length > 0) {
            return allSteps.filter(s => config.filterSteps!.includes(s.id));
        }
        return allSteps;
    }, [allSteps, config.filterSteps]);

    const [selectedMode, setSelectedMode] = useState<ModeType>(config.initialMode);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [animKey, setAnimKey] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
    const [hoveredOption, setHoveredOption] = useState<number | null>(null);
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);
    const [quizComplete, setQuizComplete] = useState(false);

    const modeSteps = useMemo(() => {
        return availableSteps.filter(s => s.mode === selectedMode);
    }, [availableSteps, selectedMode]);

    const currentStep = modeSteps[currentStepIndex] || modeSteps[0];

    // Inject keyframes + Poppins font
    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'circuit-symbols-singularity';
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
        return () => {
            const existing = document.getElementById('circuit-symbols-singularity');
            if (existing) document.head.removeChild(existing);
        };
    }, []);

    useEffect(() => {
        if (setStepDetails) {
            setStepDetails({
                currentStep: currentStepIndex + 1,
                totalSteps: modeSteps.length,
                isPaused: !isPlaying,
                currentMode: selectedMode,
            });
        }
    }, [currentStepIndex, modeSteps.length, isPlaying, selectedMode, setStepDetails]);

    useEffect(() => {
        if (!isPlaying || config.autoPlayDuration <= 0 || selectedMode === 'practice') return;
        const timer = setTimeout(() => {
            if (currentStepIndex < modeSteps.length - 1) goNext();
            else setIsPlaying(false);
        }, config.autoPlayDuration / config.animationSpeed);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, config.autoPlayDuration, config.animationSpeed, selectedMode]);

    const goNext = useCallback(() => {
        if (currentStepIndex < modeSteps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
            setAnimKey(prev => prev + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        }
    }, [currentStepIndex, modeSteps.length]);

    const goPrev = useCallback(() => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
            setAnimKey(prev => prev + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        }
    }, [currentStepIndex]);

    const switchMode = useCallback((mode: ModeType) => {
        setSelectedMode(mode);
        setCurrentStepIndex(0);
        setAnimKey(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setIsPlaying(false);
        if (mode === 'practice') {
            setScore(0);
            setAnsweredQuestions(new Set());
            setQuizComplete(false);
        }
    }, []);

    const handleAnswer = useCallback((optionIndex: number) => {
        if (showResult) return;
        setSelectedAnswer(optionIndex);
        setShowResult(true);
        const qIdx = currentStep?.data?.questionIndex;
        if (qIdx !== undefined && qIdx < QUIZ_QUESTIONS.length) {
            const q = QUIZ_QUESTIONS[qIdx];
            if (optionIndex === q.correctIndex && !answeredQuestions.has(qIdx)) {
                setScore(prev => prev + 1);
            }
            setAnsweredQuestions(prev => new Set(prev).add(qIdx));
        }
    }, [showResult, currentStep, answeredQuestions]);

    const resetQuiz = useCallback(() => {
        setCurrentStepIndex(0);
        setAnimKey(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setAnsweredQuestions(new Set());
        setQuizComplete(false);
    }, []);

    useEffect(() => {
        if (selectedMode === 'practice' && showResult && currentStepIndex === modeSteps.length - 1) {
            setTimeout(() => setQuizComplete(true), 1500);
        }
    }, [selectedMode, showResult, currentStepIndex, modeSteps.length]);

    // ═══════════════════════════════════════════════════════════════════
    // SINGULARITY BUTTON COMPONENTS
    // ═══════════════════════════════════════════════════════════════════

    const ContainedButton: React.FC<{
        children: React.ReactNode;
        onClick: () => void;
        disabled?: boolean;
        variant?: 'primary' | 'accent' | 'gradient';
        size?: 'sm' | 'md';
        icon?: React.ReactNode;
        id: string;
    }> = ({ children, onClick, disabled = false, variant = 'primary', size = 'md', icon, id }) => {
        const isHov = hoveredButton === id;
        const bgMap = {
            primary: DS.primary,
            accent: DS.accent,
            gradient: DS.gradientPrimary,
        };
        const hoverBgMap = {
            primary: DS.primaryDark,
            accent: '#e06510',
            gradient: DS.gradientPrimary,
        };
        const shadowMap = {
            primary: DS.shadowPrimary,
            accent: DS.shadowAccent,
            gradient: DS.shadowLg,
        };
        return (
            <button
                onClick={onClick}
                disabled={disabled}
                onMouseEnter={() => setHoveredButton(id)}
                onMouseLeave={() => setHoveredButton(null)}
                style={{
                    padding: size === 'sm' ? '8px 20px' : '10px 24px',
                    borderRadius: DS.radiusFull,
                    border: 'none',
                    background: disabled ? DS.border : (isHov ? hoverBgMap[variant] : bgMap[variant]),
                    color: disabled ? DS.textDisabled : DS.white,
                    fontWeight: 600,
                    fontSize: size === 'sm' ? 13 : 14,
                    fontFamily: DS.fontFamily,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isHov && !disabled ? 'scale(1.04)' : 'scale(1)',
                    boxShadow: isHov && !disabled ? shadowMap[variant] : DS.shadowSm,
                    display: 'flex',
                    alignItems: 'center',
                    gap: DS.spacingXs,
                    letterSpacing: 0.3,
                    opacity: disabled ? 0.6 : 1,
                }}
            >
                {icon}{children}
            </button>
        );
    };

    const OutlinedButton: React.FC<{
        children: React.ReactNode;
        onClick: () => void;
        color?: string;
        id: string;
    }> = ({ children, onClick, color = DS.primary, id }) => {
        const isHov = hoveredButton === id;
        return (
            <button
                onClick={onClick}
                onMouseEnter={() => setHoveredButton(id)}
                onMouseLeave={() => setHoveredButton(null)}
                style={{
                    padding: '8px 20px',
                    borderRadius: DS.radiusFull,
                    border: `2px solid ${color}`,
                    background: isHov ? `${color}0D` : 'transparent',
                    color: color,
                    fontWeight: 600,
                    fontSize: 13,
                    fontFamily: DS.fontFamily,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: isHov ? 'scale(1.04)' : 'scale(1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: DS.spacingXs,
                }}
            >
                {children}
            </button>
        );
    };

    // ═══════════════════════════════════════════════════════════════════
    // RENDER LEARN CONTENT
    // ═══════════════════════════════════════════════════════════════════

    const renderLearnContent = () => {
        if (!currentStep) return null;
        const sIdx = currentStep.data?.symbolIndex;

        // INTRO STEP
        if (currentStep.type === 'intro') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: DS.spacingLg, animation: 'fadeInUp 0.6s ease-out' }} key={animKey}>
                    {/* Gradient icon circle */}
                    <div style={{
                        width: 76, height: 76, borderRadius: '50%',
                        background: DS.gradientPrimary,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'popIn 0.6s ease-out 0.15s both',
                        boxShadow: DS.shadowLg,
                    }}>
                        <Zap size={34} color={DS.white} />
                    </div>
                    <h2 style={{
                        fontSize: 22, fontWeight: 700, color: DS.primaryDark, textAlign: 'center', margin: 0,
                        fontFamily: DS.fontFamily, animation: 'fadeInUp 0.5s ease-out 0.25s both',
                    }}>
                        {currentStep.title}
                    </h2>
                    <p style={{
                        fontSize: 14, color: DS.textSecondary, textAlign: 'center', lineHeight: 1.75,
                        maxWidth: 480, margin: 0, fontFamily: DS.fontFamily,
                        animation: 'fadeInUp 0.5s ease-out 0.35s both',
                    }}>
                        {currentStep.description}
                    </p>
                    {/* Mini symbol cards */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: DS.spacingMd, marginTop: 4,
                        animation: 'fadeInUp 0.5s ease-out 0.5s both',
                    }}>
                        {SYMBOLS.slice(0, 4).map((sym, i) => (
                            <div key={i} style={{
                                width: 72, height: 72, borderRadius: DS.radiusMd,
                                background: DS.white,
                                border: `1.5px solid ${DS.border}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                animation: `popIn 0.4s ease-out ${0.55 + i * 0.08}s both`,
                                boxShadow: DS.shadowSm,
                                transition: 'all 0.3s ease',
                            }}>
                                <SymbolSVG symbolIndex={i} size={56} animated={true} showTerminals={false} color={sym.color} />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // SWITCH ON/OFF COMBINED
        if (sIdx === 4) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: DS.spacingMd, animation: 'fadeInUp 0.5s ease-out' }} key={animKey}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: DS.primaryDark, margin: 0, fontFamily: DS.fontFamily }}>
                        {currentStep.title}
                    </h2>
                    <div style={{ display: 'flex', gap: DS.spacingLg, alignItems: 'stretch', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {/* ON card */}
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: DS.spacingSm,
                            padding: DS.spacingMd, borderRadius: DS.radiusLg,
                            background: DS.white, border: `2px solid ${DS.primaryLight}`,
                            boxShadow: DS.shadowSm, animation: 'slideInLeft 0.5s ease-out 0.15s both',
                            minWidth: 140,
                        }}>
                            <SymbolSVG symbolIndex={4} size={110} animated={true} showTerminals={false} color={DS.primary} />
                            <div style={{
                                padding: '4px 16px', borderRadius: DS.radiusFull,
                                background: DS.primary, color: DS.white,
                                fontSize: 12, fontWeight: 600, fontFamily: DS.fontFamily,
                            }}>Switch ON</div>
                            <span style={{ fontSize: 12, color: DS.textSecondary, fontFamily: DS.fontFamily }}>Circuit closed ✓</span>
                        </div>
                        {/* OFF card */}
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: DS.spacingSm,
                            padding: DS.spacingMd, borderRadius: DS.radiusLg,
                            background: DS.white, border: `2px solid ${DS.accentLight}`,
                            boxShadow: DS.shadowSm, animation: 'slideInRight 0.5s ease-out 0.25s both',
                            minWidth: 140,
                        }}>
                            <SymbolSVG symbolIndex={5} size={110} animated={true} showTerminals={false} color={DS.accent} />
                            <div style={{
                                padding: '4px 16px', borderRadius: DS.radiusFull,
                                background: DS.accent, color: DS.white,
                                fontSize: 12, fontWeight: 600, fontFamily: DS.fontFamily,
                            }}>Switch OFF</div>
                            <span style={{ fontSize: 12, color: DS.textSecondary, fontFamily: DS.fontFamily }}>Circuit open ✗</span>
                        </div>
                    </div>
                    {/* Info box */}
                    <div style={{
                        background: DS.primaryGhost, borderRadius: DS.radiusMd, padding: '12px 20px',
                        border: `1px solid ${DS.primaryLight}`, maxWidth: 460,
                        animation: 'fadeInUp 0.5s ease-out 0.45s both',
                    }}>
                        <p style={{ fontSize: 13, color: DS.textSecondary, lineHeight: 1.7, margin: 0, textAlign: 'center', fontFamily: DS.fontFamily }}>
                            {SYMBOLS[4].description}
                        </p>
                    </div>
                    {/* Fun fact */}
                    <div style={{
                        background: DS.accentLight, borderRadius: DS.radiusMd, padding: '10px 18px', maxWidth: 380,
                        border: `1px solid ${DS.accentWarm}40`,
                        animation: 'fadeInUp 0.5s ease-out 0.6s both',
                    }}>
                        <p style={{ fontSize: 12, color: '#c2410c', margin: 0, textAlign: 'center', fontFamily: DS.fontFamily, fontWeight: 500 }}>
                            💡 {SYMBOLS[4].funFact}
                        </p>
                    </div>
                </div>
            );
        }

        // COMPLETE CIRCUIT + WIRE
        if (sIdx === 6) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: DS.spacingMd, animation: 'fadeInUp 0.5s ease-out' }} key={animKey}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: DS.primaryDark, margin: 0, fontFamily: DS.fontFamily }}>
                        {currentStep.title}
                    </h2>
                    <div style={{ display: 'flex', gap: DS.spacingLg, alignItems: 'stretch', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {/* Wire */}
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: DS.spacingSm,
                            padding: DS.spacingMd, borderRadius: DS.radiusLg,
                            background: DS.white, border: `2px solid ${DS.border}`,
                            boxShadow: DS.shadowSm, animation: 'slideInLeft 0.5s ease-out 0.15s both',
                        }}>
                            <svg width={100} height={40} viewBox="0 0 100 40">
                                <line x1={10} y1={20} x2={90} y2={20} stroke={DS.primaryDark} strokeWidth={3}
                                    strokeDasharray="200" style={{ animation: 'drawLine 0.8s ease-out forwards' }} />
                            </svg>
                            <div style={{
                                padding: '4px 16px', borderRadius: DS.radiusFull,
                                background: DS.primaryDark, color: DS.white,
                                fontSize: 12, fontWeight: 600, fontFamily: DS.fontFamily,
                            }}>Wire</div>
                        </div>
                        {/* Full circuit */}
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: DS.spacingSm,
                            padding: DS.spacingMd, borderRadius: DS.radiusLg,
                            background: DS.white, border: `2px solid ${DS.primaryLight}`,
                            boxShadow: DS.shadowMd, animation: 'slideInRight 0.5s ease-out 0.25s both',
                        }}>
                            <SymbolSVG symbolIndex={6} size={155} animated={true} showTerminals={false} />
                            <div style={{
                                padding: '4px 16px', borderRadius: DS.radiusFull,
                                background: DS.gradientPrimary, color: DS.white,
                                fontSize: 12, fontWeight: 600, fontFamily: DS.fontFamily,
                            }}>Complete Circuit</div>
                        </div>
                    </div>
                    <p style={{
                        fontSize: 13, color: DS.textSecondary, textAlign: 'center', lineHeight: 1.75, maxWidth: 480, margin: 0,
                        fontFamily: DS.fontFamily, animation: 'fadeInUp 0.5s ease-out 0.45s both',
                    }}>
                        {currentStep.description}
                    </p>
                </div>
            );
        }

        // REGULAR SYMBOL STEP
        if (sIdx !== undefined && sIdx < SYMBOLS.length) {
            const sym = SYMBOLS[sIdx];
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: DS.spacingMd, animation: 'fadeInUp 0.5s ease-out' }} key={animKey}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: DS.primaryDark, margin: 0, fontFamily: DS.fontFamily }}>
                        {currentStep.title}
                    </h2>
                    {/* Symbol card */}
                    <div style={{
                        padding: DS.spacingLg, borderRadius: DS.radiusXl,
                        background: DS.white,
                        border: `2px solid ${DS.border}`,
                        animation: 'fadeInScale 0.5s ease-out 0.1s both',
                        boxShadow: DS.shadowMd,
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* Subtle gradient accent at top */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                            background: DS.gradientPrimary, borderRadius: `${DS.radiusXl}px ${DS.radiusXl}px 0 0`,
                        }} />
                        <SymbolSVG symbolIndex={sIdx} size={155} animated={true} showTerminals={true} color={sym.color} />
                    </div>
                    {/* Terminal info pill */}
                    <div style={{
                        background: DS.primaryGhost, borderRadius: DS.radiusFull, padding: '8px 20px',
                        border: `1px solid ${DS.primaryLight}`,
                        animation: 'fadeInUp 0.5s ease-out 0.25s both',
                    }}>
                        <p style={{
                            fontSize: 12, fontWeight: 600, color: DS.primary, margin: 0, textAlign: 'center',
                            fontFamily: "'Courier New', monospace", letterSpacing: 0.2,
                        }}>
                            {sym.terminalInfo}
                        </p>
                    </div>
                    {/* Description */}
                    <p style={{
                        fontSize: 14, color: DS.textSecondary, textAlign: 'center', lineHeight: 1.75, maxWidth: 460, margin: 0,
                        fontFamily: DS.fontFamily, animation: 'fadeInUp 0.5s ease-out 0.35s both',
                    }}>
                        {sym.description}
                    </p>
                    {/* Fun fact */}
                    <div style={{
                        background: DS.accentLight, borderRadius: DS.radiusMd, padding: '10px 18px', maxWidth: 400,
                        border: `1px solid ${DS.accentWarm}30`,
                        animation: 'fadeInUp 0.5s ease-out 0.5s both',
                    }}>
                        <p style={{ fontSize: 12, color: '#c2410c', margin: 0, textAlign: 'center', fontFamily: DS.fontFamily, fontWeight: 500 }}>
                            💡 {sym.funFact}
                        </p>
                    </div>
                </div>
            );
        }

        return null;
    };

    // ═══════════════════════════════════════════════════════════════════
    // RENDER PRACTICE CONTENT
    // ═══════════════════════════════════════════════════════════════════

    const renderPracticeContent = () => {
        if (quizComplete) {
            const total = QUIZ_QUESTIONS.length;
            const pct = Math.round((score / total) * 100);
            const excellent = pct >= 80;
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: DS.spacingLg, animation: 'fadeInUp 0.6s ease-out' }} key="quiz-complete">
                    <div style={{
                        width: 88, height: 88, borderRadius: '50%',
                        background: excellent ? 'linear-gradient(135deg, #10b981, #059669)' : DS.gradientAccent,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'popIn 0.6s ease-out',
                        boxShadow: excellent ? '0 8px 30px rgba(16,185,129,0.3)' : DS.shadowAccent,
                    }}>
                        <Award size={40} color={DS.white} />
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: DS.primaryDark, margin: 0, fontFamily: DS.fontFamily }}>
                        {excellent ? 'Excellent Work! 🎉' : 'Good Try! 👍'}
                    </h2>
                    <div style={{
                        fontSize: 44, fontWeight: 800, fontFamily: DS.fontFamily,
                        background: excellent ? 'linear-gradient(135deg, #10b981, #059669)' : DS.gradientPrimary,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: 'popIn 0.5s ease-out 0.2s both',
                    }}>
                        {score}/{total}
                    </div>
                    <p style={{ fontSize: 14, color: DS.textSecondary, textAlign: 'center', maxWidth: 400, margin: 0, fontFamily: DS.fontFamily, lineHeight: 1.7 }}>
                        {excellent
                            ? 'You\'ve mastered the circuit symbols! You can now read and draw circuit diagrams like a scientist!'
                            : 'Keep practising! Review the Learn mode again and try once more. You\'ll get it!'}
                    </p>
                    <ContainedButton onClick={resetQuiz} variant="gradient" id="retry"
                        icon={<RotateCcw size={15} />}>
                        Try Again
                    </ContainedButton>
                </div>
            );
        }

        const qIdx = currentStep?.data?.questionIndex;
        if (qIdx === undefined || qIdx >= QUIZ_QUESTIONS.length) return null;
        const q = QUIZ_QUESTIONS[qIdx];

        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: DS.spacingMd, width: '100%', maxWidth: 520, animation: 'fadeInUp 0.5s ease-out' }} key={animKey}>
                {/* Score + progress row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: DS.textSecondary, fontFamily: DS.fontFamily }}>
                        Question {qIdx + 1} of {QUIZ_QUESTIONS.length}
                    </span>
                    <div style={{
                        padding: '3px 14px', borderRadius: DS.radiusFull,
                        background: DS.primaryGhost, border: `1px solid ${DS.primaryLight}`,
                    }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: DS.primary, fontFamily: DS.fontFamily }}>
                            Score: {score}/{answeredQuestions.size}
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: 5, background: DS.border, borderRadius: DS.radiusFull }}>
                    <div style={{
                        height: '100%', borderRadius: DS.radiusFull,
                        background: DS.gradientPrimary,
                        width: `${((qIdx + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                        transition: 'width 0.5s ease-out',
                    }} />
                </div>

                {/* Symbol preview */}
                {q.symbolIndex !== undefined && (
                    <div style={{
                        padding: 14, borderRadius: DS.radiusLg,
                        background: DS.white, border: `2px solid ${DS.border}`,
                        boxShadow: DS.shadowSm, animation: 'popIn 0.5s ease-out 0.1s both',
                    }}>
                        <SymbolSVG symbolIndex={q.symbolIndex} size={90} animated={true}
                            showTerminals={false} color={SYMBOLS[q.symbolIndex].color} />
                    </div>
                )}

                {/* Question */}
                <h3 style={{
                    fontSize: 16, fontWeight: 600, color: DS.textPrimary, textAlign: 'center', margin: 0,
                    fontFamily: DS.fontFamily, animation: 'fadeInUp 0.4s ease-out 0.15s both',
                    lineHeight: 1.5,
                }}>
                    {q.question}
                </h3>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: DS.spacingSm, width: '100%' }}>
                    {q.options.map((opt, i) => {
                        const isSelected = selectedAnswer === i;
                        const isCorrect = i === q.correctIndex;
                        const revealed = showResult;
                        let optBg = DS.white;
                        let optBorder = DS.border;
                        let optText = DS.textPrimary;
                        let pillBg = DS.surface;
                        let pillColor = DS.textSecondary;

                        if (revealed) {
                            if (isCorrect) {
                                optBg = '#ecfdf5'; optBorder = '#10b981'; optText = '#065f46';
                                pillBg = '#10b981'; pillColor = DS.white;
                            } else if (isSelected && !isCorrect) {
                                optBg = '#fef2f2'; optBorder = '#ef4444'; optText = '#991b1b';
                                pillBg = '#ef4444'; pillColor = DS.white;
                            }
                        } else if (hoveredOption === i) {
                            optBg = DS.primaryGhost; optBorder = DS.primaryLight;
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                onMouseEnter={() => !showResult && setHoveredOption(i)}
                                onMouseLeave={() => setHoveredOption(null)}
                                style={{
                                    padding: '12px 16px', borderRadius: DS.radiusMd,
                                    border: `2px solid ${optBorder}`,
                                    background: optBg, color: optText,
                                    fontWeight: 500, fontSize: 13,
                                    fontFamily: DS.fontFamily,
                                    cursor: revealed ? 'default' : 'pointer',
                                    textAlign: 'left',
                                    display: 'flex', alignItems: 'center', gap: DS.spacingMd,
                                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                    animation: `slideInRight 0.4s ease-out ${0.2 + i * 0.06}s both`,
                                    ...(revealed && isCorrect ? { animation: 'correctPop 0.4s ease-out' } : {}),
                                    ...(revealed && isSelected && !isCorrect ? { animation: 'shake 0.4s ease-out' } : {}),
                                }}
                            >
                                <span style={{
                                    width: 28, height: 28, borderRadius: DS.radiusFull, flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: pillBg, color: pillColor,
                                    fontSize: 11, fontWeight: 700, fontFamily: DS.fontFamily,
                                    transition: 'all 0.3s ease',
                                }}>
                                    {revealed && isCorrect ? <Check size={13} /> : revealed && isSelected ? <X size={13} /> : String.fromCharCode(65 + i)}
                                </span>
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {/* Explanation */}
                {showResult && (
                    <div style={{
                        background: selectedAnswer === q.correctIndex ? '#ecfdf5' : DS.accentLight,
                        borderRadius: DS.radiusMd, padding: '12px 18px', width: '100%',
                        border: `1px solid ${selectedAnswer === q.correctIndex ? '#10b98130' : `${DS.accentWarm}40`}`,
                        animation: 'floatIn 0.4s ease-out',
                    }}>
                        <p style={{
                            fontSize: 13, color: selectedAnswer === q.correctIndex ? '#065f46' : '#c2410c',
                            margin: 0, lineHeight: 1.6, fontFamily: DS.fontFamily,
                        }}>
                            {selectedAnswer === q.correctIndex ? '✅ ' : '💡 '}{q.explanation}
                        </p>
                    </div>
                )}

                {/* Next question */}
                {showResult && currentStepIndex < modeSteps.length - 1 && (
                    <div style={{ animation: 'floatIn 0.3s ease-out' }}>
                        <ContainedButton onClick={goNext} variant="primary" id="next-q"
                            icon={<ChevronRight size={15} />}>
                            Next Question
                        </ContainedButton>
                    </div>
                )}
            </div>
        );
    };

    // ═══════════════════════════════════════════════════════════════════
    // MAIN LAYOUT
    // ═══════════════════════════════════════════════════════════════════

    return (
        <div style={{
            width: config.width, maxWidth: '100%', height: config.height,
            display: 'flex', flexDirection: 'column',
            background: DS.surface,
            borderRadius: DS.radiusXl, overflow: 'hidden',
            fontFamily: DS.fontFamily,
            boxShadow: DS.shadowLg,
            position: 'relative',
        }}>
            {/* ──── HEADER with gradient ──── */}
            <div style={{
                background: DS.gradientHeader,
                backgroundSize: '200% 200%',
                animation: 'gradientShift 8s ease infinite',
                padding: '16px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: DS.spacingSm }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: DS.radiusSm,
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(4px)',
                    }}>
                        <Zap size={18} color={DS.white} />
                    </div>
                    <span style={{
                        fontSize: 16, fontWeight: 700, color: DS.white,
                        letterSpacing: 0.4, fontFamily: DS.fontFamily,
                    }}>
                        Circuit Symbols
                    </span>
                </div>

                {/* Mode toggle — pill style from design system */}
                {config.showModeSelector && (
                    <div style={{
                        display: 'flex', gap: 2,
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: DS.radiusFull, padding: 3,
                        backdropFilter: 'blur(4px)',
                    }}>
                        {config.enabledModes.map(mode => (
                            <button
                                key={mode}
                                onClick={() => switchMode(mode)}
                                style={{
                                    padding: '6px 18px', borderRadius: DS.radiusFull, border: 'none',
                                    background: selectedMode === mode ? DS.white : 'transparent',
                                    color: selectedMode === mode ? DS.primaryDark : 'rgba(255,255,255,0.9)',
                                    fontWeight: 600, fontSize: 12, cursor: 'pointer',
                                    fontFamily: DS.fontFamily,
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    boxShadow: selectedMode === mode ? DS.shadowSm : 'none',
                                }}
                            >
                                {mode === 'learn' ? <BookOpen size={13} /> : <Target size={13} />}
                                {mode === 'learn' ? 'Learn' : 'Practice'}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ──── CONTENT AREA ──── */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: DS.spacingLg, overflow: 'auto',
            }}>
                {selectedMode === 'learn' ? renderLearnContent() : renderPracticeContent()}
            </div>

            {/* ──── FOOTER NAV ──── */}
            {config.showNavigation && selectedMode === 'learn' && (
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: DS.spacingMd,
                    padding: '14px 24px',
                    borderTop: `1px solid ${DS.border}`,
                    flexShrink: 0, background: DS.white,
                }}>
                    {/* Prev */}
                    <button
                        onClick={goPrev}
                        disabled={currentStepIndex === 0}
                        onMouseEnter={() => setHoveredButton('prev')}
                        onMouseLeave={() => setHoveredButton(null)}
                        style={{
                            width: 38, height: 38, borderRadius: DS.radiusFull,
                            border: `1.5px solid ${currentStepIndex === 0 ? DS.border : DS.primaryLight}`,
                            background: currentStepIndex === 0 ? DS.surface : (hoveredButton === 'prev' ? DS.primaryGhost : DS.white),
                            cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: currentStepIndex === 0 ? 0.4 : 1,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <ChevronLeft size={18} color={DS.primary} />
                    </button>

                    {/* Play/Pause */}
                    {config.showPlayPause && (
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            onMouseEnter={() => setHoveredButton('play')}
                            onMouseLeave={() => setHoveredButton(null)}
                            style={{
                                width: 44, height: 44, borderRadius: '50%', border: 'none',
                                background: DS.gradientPrimary,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transform: hoveredButton === 'play' ? 'scale(1.1)' : 'scale(1)',
                                boxShadow: DS.shadowPrimary,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        >
                            {isPlaying ? <Pause size={17} color={DS.white} /> : <Play size={17} color={DS.white} style={{ marginLeft: 2 }} />}
                        </button>
                    )}

                    {/* Step dots */}
                    {config.showStepIndicator && (
                        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                            {modeSteps.map((_, i) => (
                                <div key={i} style={{
                                    width: i === currentStepIndex ? 22 : 7,
                                    height: 7,
                                    borderRadius: DS.radiusFull,
                                    background: i === currentStepIndex
                                        ? DS.gradientPrimary
                                        : i < currentStepIndex ? DS.primaryLight : DS.border,
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                }} />
                            ))}
                        </div>
                    )}

                    {/* Next */}
                    <button
                        onClick={goNext}
                        disabled={currentStepIndex === modeSteps.length - 1}
                        onMouseEnter={() => setHoveredButton('next')}
                        onMouseLeave={() => setHoveredButton(null)}
                        style={{
                            width: 38, height: 38, borderRadius: DS.radiusFull,
                            border: `1.5px solid ${currentStepIndex === modeSteps.length - 1 ? DS.border : DS.primaryLight}`,
                            background: currentStepIndex === modeSteps.length - 1 ? DS.surface : (hoveredButton === 'next' ? DS.primaryGhost : DS.white),
                            cursor: currentStepIndex === modeSteps.length - 1 ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: currentStepIndex === modeSteps.length - 1 ? 0.4 : 1,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <ChevronRight size={18} color={DS.primary} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CircuitSymbolsTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════