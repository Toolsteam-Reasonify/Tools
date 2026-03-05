// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: led_lamp_comparison_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Check, X, RotateCcw, Zap, BookOpen, Star } from 'lucide-react';

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

interface ComparisonAdditionalProps {
    properties?: { id: string; label: string; icon?: string; }[];
    columns?: { id: string; label: string; icon?: string; }[];
    answers?: { propertyId: string; columnId: string; text: string; explanation?: string; }[];
    title?: string;
    subtitle?: string;
    completionMessage?: string;
    shuffleLabels?: boolean;
}

interface LedLampComparisonToolProps {
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
        additionalProps?: ComparisonAdditionalProps;
    };
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
    primaryPurple: '#4A4DC9',
    accentOrange: '#FF7212',
    gradientStart: '#533086',
    gradientEnd: '#FC9145',
    lightPurple: '#C1C1EA',
    lightOrange: '#FFF3E4',
    palePurple: '#EDEDF8',
    gray900: '#4E4E4E',
    gray400: '#CACACA',
    gray200: '#EBEBEB',
    gray100: '#F5F5F5',
    white: '#FFFFFF',
    success: '#2ECC71',
    successLight: '#E8F8F0',
    error: '#E74C3C',
    errorLight: '#FDE8E6',
    fontFamily: "'Poppins', sans-serif",
    radiusPill: '100px',
    radiusLg: '16px',
    radiusMd: '12px',
    radiusSm: '8px',
    shadowSm: '0 2px 8px rgba(74, 77, 201, 0.08)',
    shadowMd: '0 4px 20px rgba(74, 77, 201, 0.12)',
    shadowLg: '0 8px 40px rgba(74, 77, 201, 0.16)',
    shadowOrange: '0 4px 20px rgba(255, 114, 18, 0.2)',
};

// ==================== DEFAULT DATA ====================

const DEFAULT_PROPERTIES = [
    { id: 'filament', label: 'Has filament?', icon: '🔥' },
    { id: 'terminals', label: 'Number of terminals', icon: '🔌' },
    { id: 'identify', label: 'How to identify terminals?', icon: '🔍' },
    { id: 'polarity', label: 'Works in both directions?', icon: '↔️' },
    { id: 'efficiency', label: 'Energy efficiency', icon: '⚡' },
];

const DEFAULT_COLUMNS = [
    { id: 'incandescent', label: 'Incandescent Lamp', icon: '💡' },
    { id: 'led', label: 'LED Lamp', icon: '🔦' },
];

const DEFAULT_ANSWERS = [
    { propertyId: 'filament', columnId: 'incandescent', text: 'Yes — thin coiled wire glows', explanation: 'The filament is a thin wire inside the glass bulb that gets hot and glows to produce light (Activity 3.4).' },
    { propertyId: 'filament', columnId: 'led', text: 'No — no filament inside', explanation: 'Unlike incandescent lamps, LEDs do not have filaments. They emit light differently (Activity 3.5).' },
    { propertyId: 'terminals', columnId: 'incandescent', text: 'Two (metal case + metal tip)', explanation: 'One thick wire connects to the metal case, the other to the metal tip at the base centre (Fig. 3.4b).' },
    { propertyId: 'terminals', columnId: 'led', text: 'Two (longer wire + shorter wire)', explanation: 'LEDs have two terminal wires of different lengths to help identify polarity (Activity 3.5).' },
    { propertyId: 'identify', columnId: 'incandescent', text: 'By position on the lamp base', explanation: 'The metal case is one terminal and the metal tip at the centre of the base is the other.' },
    { propertyId: 'identify', columnId: 'led', text: 'By wire length (longer = +ve)', explanation: 'The positive terminal is attached to the longer wire, and negative to the shorter wire (Activity 3.5).' },
    { propertyId: 'polarity', columnId: 'incandescent', text: 'Yes — works either way', explanation: 'With an incandescent lamp, it does not matter which terminal connects to positive or negative (Section 3.2.5).' },
    { propertyId: 'polarity', columnId: 'led', text: 'No — correct polarity only', explanation: 'Current can pass through an LED in one direction only. Connect + to + and − to − (Activity 3.7).' },
    { propertyId: 'efficiency', columnId: 'incandescent', text: 'Lower — wastes energy as heat', explanation: 'Incandescent lamps waste most energy as heat since the filament must get very hot to glow.' },
    { propertyId: 'efficiency', columnId: 'led', text: 'Higher — more light per watt', explanation: 'LEDs are much more energy efficient, producing more light with less energy and less heat.' },
];

// ==================== HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number): number =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOutElastic = (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};
const easeOutBounce = (t: number): number => {
    const n1 = 7.5625; const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

function shuffleArray<T>(arr: T[]): T[] {
    const s = [...arr];
    for (let i = s.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [s[i], s[j]] = [s[j], s[i]];
    }
    return s;
}

// ==================== MAIN COMPONENT ====================

const LedLampComparisonTool: React.FC<LedLampComparisonToolProps> = ({
    props = {}, setStepDetails, stopAutoNext, setStopAutoNext
}) => {
    const config = useMemo(() => ({
        width: props.width ?? 800,
        height: props.height ?? 600,
        initialMode: (props.initialMode ?? 'practice') as ModeType,
        showModeSelector: props.showModeSelector ?? false,
        enabledModes: (props.enabledModes ?? ['practice']) as ModeType[],
        showNavigation: props.showNavigation ?? false,
        showPlayPause: props.showPlayPause ?? false,
        showStepIndicator: props.showStepIndicator ?? false,
        initialStep: props.initialStep ?? 1,
        filterSteps: props.filterSteps ?? null,
        animationSpeed: props.animationSpeed ?? 1,
        autoPlayDuration: props.autoPlayDuration ?? 0,
        themeColor: props.themeColor ?? props.data?.themeColor ?? DS.primaryPurple,
        darkMode: props.darkMode ?? false,
    }), [props]);

    const additionalProps = props.additionalProps || {};
    const toolConfig = useMemo(() => ({
        properties: additionalProps.properties ?? DEFAULT_PROPERTIES,
        columns: additionalProps.columns ?? DEFAULT_COLUMNS,
        answers: additionalProps.answers ?? DEFAULT_ANSWERS,
        title: additionalProps.title ?? 'Incandescent Lamp vs LED Lamp',
        subtitle: additionalProps.subtitle ?? 'Drag the correct description into each cell!',
        completionMessage: additionalProps.completionMessage ?? 'Excellent! You\'ve mastered the differences between incandescent and LED lamps!',
        shuffleLabels: additionalProps.shuffleLabels ?? true,
    }), [additionalProps]);

    // State
    const [shuffledLabels, setShuffledLabels] = useState<typeof DEFAULT_ANSWERS>([]);
    const [placedAnswers, setPlacedAnswers] = useState<{ [key: string]: typeof DEFAULT_ANSWERS[0] | null }>({});
    const [correctCells, setCorrectCells] = useState<Set<string>>(new Set());
    const [incorrectCells, setIncorrectCells] = useState<Set<string>>(new Set());
    const [shakingCells, setShakingCells] = useState<Set<string>>(new Set());
    const [draggingLabel, setDraggingLabel] = useState<typeof DEFAULT_ANSWERS[0] | null>(null);
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState<{ key: string; answer: typeof DEFAULT_ANSWERS[0] } | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [entryAnimated, setEntryAnimated] = useState(false);
    const [celebrationPhase, setCelebrationPhase] = useState(0);
    const [touchDragging, setTouchDragging] = useState<typeof DEFAULT_ANSWERS[0] | null>(null);
    const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);
    const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const labels = toolConfig.shuffleLabels ? shuffleArray(toolConfig.answers) : [...toolConfig.answers];
        setShuffledLabels(labels);
        setTimeout(() => setEntryAnimated(true), 100);
    }, [toolConfig.answers, toolConfig.shuffleLabels]);

    // Inject Poppins + Keyframes
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        const keyframes = `
            @keyframes sg-fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes sg-fadeInScale { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
            @keyframes sg-popIn { 0% { transform: scale(0); opacity: 0; } 65% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
            @keyframes sg-shake { 0%, 100% { transform: translateX(0); } 15%, 55%, 85% { transform: translateX(-5px); } 35%, 70% { transform: translateX(5px); } }
            @keyframes sg-pulseSuccess { 0% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.45); } 70% { box-shadow: 0 0 0 14px rgba(46, 204, 113, 0); } 100% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0); } }
            @keyframes sg-celebrateIn { 0% { transform: scale(0) rotate(-180deg); opacity: 0; } 55% { transform: scale(1.12) rotate(8deg); } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
            @keyframes sg-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
            @keyframes sg-slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes sg-slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes sg-bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.06); } 70% { transform: scale(0.94); } 100% { transform: scale(1); opacity: 1; } }
            @keyframes sg-dropIn { 0% { transform: translateY(-16px) scale(0.96); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
            @keyframes sg-gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
            @keyframes sg-ringPulse { 0% { transform: scale(0.8); opacity: 0; } 50% { opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
        `;
        const style = document.createElement('style');
        style.id = 'sg-led-keyframes';
        style.textContent = keyframes;
        document.head.appendChild(style);
        return () => {
            document.getElementById('sg-led-keyframes')?.remove();
            link.parentNode?.removeChild(link);
        };
    }, []);

    const cellKey = (p: string, c: string) => `${p}__${c}`;

    // Core answer processing
    const processAnswer = useCallback((answer: typeof DEFAULT_ANSWERS[0], propId: string, colId: string) => {
        const key = cellKey(propId, colId);
        if (correctCells.has(key)) return;
        setAttempts(prev => prev + 1);
        if (answer.propertyId === propId && answer.columnId === colId) {
            setPlacedAnswers(prev => ({ ...prev, [key]: answer }));
            setCorrectCells(prev => new Set([...prev, key]));
            setScore(prev => prev + 1);
            setShuffledLabels(prev => prev.filter(l => !(l.propertyId === answer.propertyId && l.columnId === answer.columnId)));
            const total = toolConfig.properties.length * toolConfig.columns.length;
            if (correctCells.size + 1 === total) {
                setIsComplete(true);
                setCelebrationPhase(1);
                setTimeout(() => setCelebrationPhase(2), 500);
                setTimeout(() => setCelebrationPhase(3), 1000);
            }
        } else {
            setIncorrectCells(prev => new Set([...prev, key]));
            setShakingCells(prev => new Set([...prev, key]));
            const correct = toolConfig.answers.find(a => a.propertyId === propId && a.columnId === colId);
            if (correct) setShowExplanation({ key, answer: correct });
            setTimeout(() => {
                setShakingCells(prev => { const n = new Set(prev); n.delete(key); return n; });
                setIncorrectCells(prev => { const n = new Set(prev); n.delete(key); return n; });
            }, 700);
        }
    }, [correctCells, toolConfig]);

    const handleDragStart = useCallback((e: React.DragEvent, a: typeof DEFAULT_ANSWERS[0]) => {
        setDraggingLabel(a);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify(a));
    }, []);
    const handleDragOver = useCallback((e: React.DragEvent, p: string, c: string) => {
        e.preventDefault(); e.dataTransfer.dropEffect = 'move';
        if (!correctCells.has(cellKey(p, c))) setHoveredCell(cellKey(p, c));
    }, [correctCells]);
    const handleDragLeave = useCallback(() => setHoveredCell(null), []);
    const handleDrop = useCallback((e: React.DragEvent, p: string, c: string) => {
        e.preventDefault(); setHoveredCell(null);
        try { processAnswer(JSON.parse(e.dataTransfer.getData('text/plain')), p, c); } catch { }
        setDraggingLabel(null);
    }, [processAnswer]);

    const handleTouchStart = useCallback((a: typeof DEFAULT_ANSWERS[0]) => setTouchDragging(a), []);
    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!touchDragging) return;
        setTouchPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }, [touchDragging]);
    const handleTouchEnd = useCallback(() => {
        if (!touchDragging || !touchPos) { setTouchDragging(null); setTouchPos(null); return; }
        const el = document.elementFromPoint(touchPos.x, touchPos.y);
        const cell = el?.closest('[data-cell-id]') as HTMLElement;
        if (cell) {
            const [p, c] = (cell.dataset.cellId || '').split('__');
            if (p && c) processAnswer(touchDragging, p, c);
        }
        setTouchDragging(null); setTouchPos(null);
    }, [touchDragging, touchPos, processAnswer]);

    const handleReset = useCallback(() => {
        setShuffledLabels(toolConfig.shuffleLabels ? shuffleArray(toolConfig.answers) : [...toolConfig.answers]);
        setPlacedAnswers({}); setCorrectCells(new Set()); setIncorrectCells(new Set()); setShakingCells(new Set());
        setDraggingLabel(null); setHoveredCell(null); setShowExplanation(null);
        setIsComplete(false); setScore(0); setAttempts(0); setCelebrationPhase(0);
    }, [toolConfig]);

    useEffect(() => {
        setStepDetails?.({ currentStep: 1, totalSteps: 1, isPaused: true, currentMode: 'practice' });
    }, [setStepDetails]);

    const totalCells = toolConfig.properties.length * toolConfig.columns.length;
    const progressPercent = (correctCells.size / totalCells) * 100;

    // ═══════════════════ RENDER ═══════════════════

    return (
        <div ref={containerRef} onTouchMove={handleTouchMove as any} onTouchEnd={handleTouchEnd as any}
            style={{
                width: config.width, maxWidth: '100%', minHeight: config.height,
                background: DS.white, borderRadius: DS.radiusLg, overflow: 'hidden',
                fontFamily: DS.fontFamily, boxShadow: DS.shadowLg,
                display: 'flex', flexDirection: 'column', position: 'relative',
                userSelect: 'none', border: `1px solid ${DS.gray200}`,
            }}>

            {/* ═══ HEADER ═══ */}
            <div style={{
                background: `linear-gradient(135deg, ${DS.gradientStart} 0%, ${DS.primaryPurple} 45%, ${DS.gradientEnd} 100%)`,
                backgroundSize: '200% 200%', animation: 'sg-gradientShift 8s ease infinite',
                padding: '22px 28px 18px', color: DS.white, position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'absolute', bottom: -30, left: '60%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 1, animation: entryAnimated ? 'sg-fadeInUp 0.5s ease-out' : 'none' }}>
                    <div style={{ width: 44, height: 44, borderRadius: DS.radiusMd, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <Zap size={22} color={DS.white} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, fontFamily: DS.fontFamily, letterSpacing: '-0.2px', lineHeight: 1.3 }}>{toolConfig.title}</h1>
                        <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 400, opacity: 0.8, fontFamily: DS.fontFamily }}>Chapter 3 · Electricity: Circuits and Components</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', borderRadius: DS.radiusPill, padding: '6px 16px', fontSize: 12, fontWeight: 600, fontFamily: DS.fontFamily, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                        <Star size={13} fill="rgba(255,255,255,0.8)" color="transparent" />{score}/{totalCells}
                    </div>
                </div>

                <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.15)', marginTop: 16, overflow: 'hidden', position: 'relative', zIndex: 1, animation: entryAnimated ? 'sg-fadeInUp 0.5s ease-out 0.1s both' : 'none' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: DS.accentOrange, width: `${progressPercent}%`, transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: progressPercent > 0 ? `0 0 12px ${DS.accentOrange}80` : 'none' }} />
                </div>
            </div>

            {/* ═══ INSTRUCTION BAR ═══ */}
            <div style={{ padding: '10px 28px', background: DS.lightPurple + '30', borderBottom: `1px solid ${DS.lightPurple}60`, display: 'flex', alignItems: 'center', gap: 10, animation: entryAnimated ? 'sg-fadeInUp 0.5s ease-out 0.15s both' : 'none' }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: DS.primaryPurple + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={13} color={DS.primaryPurple} />
                </div>
                <span style={{ fontSize: 12.5, color: DS.gray900, fontWeight: 500, fontFamily: DS.fontFamily, lineHeight: 1.4 }}>
                    {toolConfig.subtitle} <span style={{ color: DS.primaryPurple, fontWeight: 600 }}>Think about Activities 3.4, 3.5 & 3.7.</span>
                </span>
            </div>

            {/* ═══ MAIN CONTENT ═══ */}
            <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'auto', background: DS.gray100 + '80' }}>

                {/* ═══ TABLE ═══ */}
                <div style={{ borderRadius: DS.radiusLg, overflow: 'hidden', boxShadow: DS.shadowMd, border: `1px solid ${DS.gray200}`, background: DS.white, animation: entryAnimated ? 'sg-fadeInScale 0.6s ease-out 0.2s both' : 'none' }}>
                    {/* Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr' }}>
                        <div style={{ padding: '16px 18px', fontWeight: 600, fontSize: 12, color: DS.primaryPurple, display: 'flex', alignItems: 'center', gap: 8, background: DS.palePurple, fontFamily: DS.fontFamily, textTransform: 'uppercase', letterSpacing: '0.6px', borderBottom: `2px solid ${DS.primaryPurple}25` }}>
                            Property
                        </div>
                        {toolConfig.columns.map((col, idx) => (
                            <div key={col.id} style={{
                                padding: '14px 16px', fontWeight: 700, fontSize: 13, color: DS.white, textAlign: 'center',
                                background: idx === 0 ? `linear-gradient(135deg, ${DS.gradientStart}, ${DS.primaryPurple})` : `linear-gradient(135deg, ${DS.accentOrange}, ${DS.gradientEnd})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: DS.fontFamily,
                                borderBottom: `2px solid ${idx === 0 ? DS.primaryPurple : DS.accentOrange}`,
                                animation: entryAnimated ? `${idx === 0 ? 'sg-slideInLeft' : 'sg-slideInRight'} 0.45s ease-out ${0.3 + idx * 0.12}s both` : 'none',
                            }}>
                                <span style={{ fontSize: 15 }}>{col.icon}</span>{col.label}
                            </div>
                        ))}
                    </div>

                    {/* Rows */}
                    {toolConfig.properties.map((prop, ri) => (
                        <div key={prop.id} style={{
                            display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr',
                            borderBottom: ri < toolConfig.properties.length - 1 ? `1px solid ${DS.gray200}` : 'none',
                            animation: entryAnimated ? `sg-fadeInUp 0.4s ease-out ${0.35 + ri * 0.08}s both` : 'none',
                        }}>
                            <div style={{ padding: '14px 18px', fontWeight: 600, fontSize: 12, color: DS.gray900, display: 'flex', alignItems: 'center', gap: 10, background: ri % 2 === 0 ? DS.white : DS.gray100 + '60', fontFamily: DS.fontFamily, lineHeight: 1.4 }}>
                                <span style={{ width: 28, height: 28, borderRadius: DS.radiusSm, background: ri % 2 === 0 ? DS.lightPurple + '40' : DS.lightOrange + '80', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{prop.icon}</span>
                                {prop.label}
                            </div>

                            {toolConfig.columns.map((col, ci) => {
                                const key = cellKey(prop.id, col.id);
                                const isCorrect = correctCells.has(key);
                                const isIncorrect = incorrectCells.has(key);
                                const isShaking = shakingCells.has(key);
                                const isHov = hoveredCell === key;
                                const placed = placedAnswers[key];
                                const accent = ci === 0 ? DS.primaryPurple : DS.accentOrange;
                                const lightAccent = ci === 0 ? DS.lightPurple : DS.lightOrange;

                                return (
                                    <div key={key} data-cell-id={key}
                                        onDragOver={(e) => handleDragOver(e, prop.id, col.id)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, prop.id, col.id)}
                                        style={{
                                            padding: '10px 12px', minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: isCorrect ? DS.successLight : isIncorrect ? DS.errorLight : isHov ? lightAccent + '50' : ri % 2 === 0 ? DS.white : DS.gray100 + '60',
                                            borderLeft: `1px solid ${DS.gray200}`,
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            animation: isShaking ? 'sg-shake 0.45s ease-in-out' : isCorrect ? 'sg-pulseSuccess 0.7s ease-out' : 'none',
                                            boxShadow: isHov && !isCorrect ? `inset 0 0 0 2px ${accent}50` : 'none',
                                            cursor: isCorrect ? 'default' : 'pointer', position: 'relative',
                                        }}>
                                        {isCorrect && placed ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, animation: 'sg-dropIn 0.35s ease-out' }}>
                                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: DS.success, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <Check size={11} color={DS.white} strokeWidth={3} />
                                                </div>
                                                <span style={{ fontSize: 11.5, fontWeight: 500, color: '#1a5c2e', fontFamily: DS.fontFamily, lineHeight: 1.35 }}>{placed.text}</span>
                                            </div>
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', minHeight: 40, border: `2px dashed ${isHov ? accent : DS.gray400}`, borderRadius: DS.radiusMd, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', background: isHov ? `${accent}06` : 'transparent' }}>
                                                <span style={{ fontSize: 11, color: isHov ? accent : DS.gray400, fontWeight: 500, fontFamily: DS.fontFamily, transition: 'color 0.3s ease' }}>
                                                    {isHov ? '↓ Drop here' : '· · ·'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* ═══ LABEL POOL ═══ */}
                {shuffledLabels.length > 0 && (
                    <div style={{ animation: entryAnimated ? 'sg-fadeInUp 0.5s ease-out 0.55s both' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: DS.gray900, fontFamily: DS.fontFamily, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Answer Pool</span>
                            <span style={{ background: `linear-gradient(135deg, ${DS.primaryPurple}, ${DS.accentOrange})`, color: DS.white, borderRadius: DS.radiusPill, padding: '2px 10px', fontSize: 10, fontWeight: 700, fontFamily: DS.fontFamily }}>{shuffledLabels.length} left</span>
                            <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${DS.gray200}, transparent)` }} />
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {shuffledLabels.map((answer, idx) => {
                                const isDrag = draggingLabel === answer || touchDragging === answer;
                                const lk = `${answer.propertyId}-${answer.columnId}`;
                                const isHov = hoveredLabel === lk;
                                return (
                                    <div key={lk} draggable
                                        onDragStart={(e) => handleDragStart(e, answer)}
                                        onDragEnd={() => setDraggingLabel(null)}
                                        onTouchStart={() => handleTouchStart(answer)}
                                        onMouseEnter={() => setHoveredLabel(lk)}
                                        onMouseLeave={() => setHoveredLabel(null)}
                                        style={{
                                            padding: '8px 16px', borderRadius: DS.radiusPill,
                                            background: isDrag ? DS.lightPurple + '60' : DS.white,
                                            border: `1.5px solid ${isDrag ? DS.primaryPurple : isHov ? DS.primaryPurple + '80' : DS.gray200}`,
                                            fontSize: 11.5, fontWeight: 500, color: DS.gray900, cursor: 'grab',
                                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: isDrag ? `0 8px 24px ${DS.primaryPurple}25` : isHov ? DS.shadowMd : DS.shadowSm,
                                            transform: isDrag ? 'scale(1.04) rotate(-1deg)' : isHov ? 'translateY(-2px)' : 'scale(1)',
                                            opacity: isDrag ? 0.65 : 1, fontFamily: DS.fontFamily,
                                            animation: entryAnimated ? `sg-bounceIn 0.35s ease-out ${0.6 + idx * 0.05}s both` : 'none',
                                            whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6,
                                        }}>
                                        <span style={{ flexShrink: 0, opacity: 0.4, fontSize: 10, letterSpacing: '1px', color: DS.gray400, lineHeight: 1 }}>⠿</span>
                                        {answer.text}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ═══ RESET BUTTON (Singularity Outlined → Contained on hover) ═══ */}
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4, paddingBottom: 8, animation: entryAnimated ? 'sg-fadeInUp 0.5s ease-out 0.8s both' : 'none' }}>
                    <button onClick={handleReset}
                        onMouseEnter={(e) => { const t = e.currentTarget; t.style.background = DS.primaryPurple; t.style.color = DS.white; t.style.borderColor = DS.primaryPurple; t.style.boxShadow = DS.shadowMd; t.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={(e) => { const t = e.currentTarget; t.style.background = 'transparent'; t.style.color = DS.primaryPurple; t.style.borderColor = DS.primaryPurple; t.style.boxShadow = 'none'; t.style.transform = 'translateY(0)'; }}
                        style={{ height: 40, padding: '0 24px', borderRadius: DS.radiusPill, border: `1.5px solid ${DS.primaryPurple}`, background: 'transparent', color: DS.primaryPurple, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: DS.fontFamily, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                        <RotateCcw size={14} /> Start Over
                    </button>
                </div>
            </div>

            {/* ═══ EXPLANATION POPUP ═══ */}
            {showExplanation && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(83, 48, 134, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, animation: 'sg-fadeInScale 0.25s ease-out', backdropFilter: 'blur(6px)', padding: 24 }}
                    onClick={() => setShowExplanation(null)}>
                    <div style={{ background: DS.white, borderRadius: DS.radiusLg, padding: 28, maxWidth: 380, width: '100%', boxShadow: DS.shadowLg, animation: 'sg-popIn 0.35s ease-out', border: `1px solid ${DS.gray200}` }}
                        onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: DS.errorLight, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${DS.error}30` }}>
                                <X size={18} color={DS.error} strokeWidth={2.5} />
                            </div>
                            <span style={{ fontSize: 16, fontWeight: 700, color: DS.gray900, fontFamily: DS.fontFamily }}>Not quite right!</span>
                        </div>
                        <div style={{ background: DS.lightOrange + '60', borderRadius: DS.radiusMd, padding: '14px 16px', border: `1px solid ${DS.accentOrange}20` }}>
                            <p style={{ fontSize: 13, color: DS.gray900, lineHeight: 1.65, margin: 0, fontFamily: DS.fontFamily, fontWeight: 400 }}>
                                <span style={{ fontWeight: 600, color: DS.accentOrange }}>💡 Hint: </span>{showExplanation.answer.explanation}
                            </p>
                        </div>
                        <button onClick={() => setShowExplanation(null)}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = DS.shadowOrange; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            style={{ marginTop: 20, width: '100%', height: 42, borderRadius: DS.radiusPill, border: 'none', background: `linear-gradient(135deg, ${DS.accentOrange}, ${DS.gradientEnd})`, color: DS.white, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: DS.fontFamily, transition: 'all 0.3s ease' }}>
                            Got it — Try again! 💪
                        </button>
                    </div>
                </div>
            )}

            {/* ═══ COMPLETION ═══ */}
            {isComplete && celebrationPhase >= 1 && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(83, 48, 134, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, animation: 'sg-fadeInScale 0.4s ease-out', backdropFilter: 'blur(8px)', padding: 24 }}>
                    <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', border: `3px solid ${DS.accentOrange}40`, animation: 'sg-ringPulse 2s ease-out infinite' }} />
                    <div style={{ background: DS.white, borderRadius: 20, padding: '36px 32px', maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: DS.shadowLg, animation: 'sg-celebrateIn 0.55s ease-out', border: `1px solid ${DS.lightPurple}`, position: 'relative' }}>
                        <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${DS.lightPurple}60, ${DS.lightOrange}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: celebrationPhase >= 2 ? 'sg-float 2.5s ease-in-out infinite' : 'none', border: `2px solid ${DS.primaryPurple}20` }}>
                            <span style={{ fontSize: 36 }}>🏆</span>
                        </div>
                        <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, fontFamily: DS.fontFamily, background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.accentOrange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' as any }}>Fantastic Work!</h2>
                        <p style={{ fontSize: 13, color: DS.gray900, lineHeight: 1.6, margin: '0 0 20px', fontFamily: DS.fontFamily, fontWeight: 400, opacity: celebrationPhase >= 3 ? 1 : 0, transition: 'opacity 0.4s ease' }}>{toolConfig.completionMessage}</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20, opacity: celebrationPhase >= 3 ? 1 : 0, transition: 'opacity 0.4s ease 0.15s' }}>
                            <div style={{ padding: '6px 16px', borderRadius: DS.radiusPill, background: DS.successLight, border: `1px solid ${DS.success}30`, fontSize: 12, fontWeight: 600, color: '#1a5c2e', fontFamily: DS.fontFamily, display: 'flex', alignItems: 'center', gap: 5 }}>
                                <Check size={13} strokeWidth={2.5} /> Score: {score}/{totalCells}
                            </div>
                            <div style={{ padding: '6px 16px', borderRadius: DS.radiusPill, background: DS.lightOrange, border: `1px solid ${DS.accentOrange}30`, fontSize: 12, fontWeight: 600, color: '#8b4513', fontFamily: DS.fontFamily }}>Attempts: {attempts}</div>
                        </div>
                        <button onClick={handleReset}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 25px ${DS.primaryPurple}35`; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            style={{ height: 42, padding: '0 28px', borderRadius: DS.radiusPill, border: 'none', background: `linear-gradient(135deg, ${DS.gradientStart}, ${DS.primaryPurple}, ${DS.gradientEnd})`, backgroundSize: '200% 200%', animation: 'sg-gradientShift 4s ease infinite', color: DS.white, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: DS.fontFamily, display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto', transition: 'all 0.3s ease' }}>
                            <RotateCcw size={15} /> Play Again
                        </button>
                    </div>
                </div>
            )}

            {/* Touch indicator */}
            {touchDragging && touchPos && (
                <div style={{ position: 'fixed', left: touchPos.x - 80, top: touchPos.y - 22, padding: '8px 16px', borderRadius: DS.radiusPill, background: `linear-gradient(135deg, ${DS.primaryPurple}, ${DS.accentOrange})`, color: DS.white, fontSize: 11, fontWeight: 600, pointerEvents: 'none', zIndex: 300, opacity: 0.92, boxShadow: `0 8px 30px ${DS.primaryPurple}40`, fontFamily: DS.fontFamily, whiteSpace: 'nowrap', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', transform: 'rotate(-2deg)' }}>
                    {touchDragging.text}
                </div>
            )}
        </div>
    );
};

export default LedLampComparisonTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════