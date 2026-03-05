// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: lamp_glow_observation_tool.tsx
// Redesigned with Singularity Design System
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Check, X, Zap, BookOpen, RotateCcw, ChevronLeft, ChevronRight, Play, Pause, Award, Star, Plus } from 'lucide-react';

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

interface ArrangementData {
    id: number;
    description: string;
    detail: string;
    correctAnswer: 'glows' | 'does_not_glow';
    explanation: string;
}

interface LampGlowAdditionalProps {
    arrangements?: ArrangementData[];
    showArrangementImages?: boolean;
    tableTitle?: string;
    summaryInsight?: string;
    teachingNotes?: string;
    instructionsForStudent?: string;
}

interface LampGlowObservationToolProps {
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
        additionalProps?: LampGlowAdditionalProps;
    };
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
    primary: '#4A4DC9',
    primaryDark: '#533086',
    accent: '#FF7212',
    accentLight: '#FC9145',
    gradient: 'linear-gradient(135deg, #533086 0%, #FC9145 100%)',
    gradientSubtle: 'linear-gradient(135deg, #533086 0%, #4A4DC9 40%, #FC9145 100%)',
    lavender: '#C1C1EA',
    lavenderLight: '#E8E8F5',
    lavenderBg: '#F0F0FA',
    cream: '#FFF3E4',
    creamLight: '#FFF9F2',
    gray900: '#4E4E4E',
    gray500: '#CACACA',
    gray300: '#EBEBEB',
    gray100: '#F5F5F5',
    white: '#FFFFFF',
    success: '#2ECC71',
    successLight: '#E8FAF0',
    error: '#E74C3C',
    errorLight: '#FDECEB',
    radius: { pill: 999, lg: 20, md: 14, sm: 10, xs: 6 },
    padding: { button: '10px 24px', buttonLg: '12px 28px', card: 24, section: 20 },
    font: "'Poppins', sans-serif",
};

// ==================== DEFAULT DATA ====================

const DEFAULT_ARRANGEMENTS: ArrangementData[] = [
    { id: 1, description: 'Both terminals of the lamp connected to both terminals of the cell via wires', detail: 'Wire from +ve terminal of cell → one terminal of lamp; Wire from −ve terminal of cell → other terminal of lamp', correctAnswer: 'glows', explanation: 'Both terminals are properly connected. A complete path exists for current to flow through the filament.' },
    { id: 2, description: 'Both wires from cell connected to the same terminal of the lamp', detail: 'Wire from +ve terminal of cell → metal tip of lamp; Wire from −ve terminal of cell → metal tip of lamp (same terminal)', correctAnswer: 'does_not_glow', explanation: 'Both wires connect to the same terminal. Current cannot pass through the filament — there is no complete path.' },
    { id: 3, description: 'Only one wire connected (from cell to lamp), other wire disconnected', detail: 'Wire from +ve terminal of cell → one terminal of lamp; −ve terminal of cell left unconnected', correctAnswer: 'does_not_glow', explanation: 'Only one wire is connected. The circuit is incomplete — current needs a complete loop to flow.' },
    { id: 4, description: 'Both wires from cell connected to the metal case (same terminal) of the lamp', detail: 'Wire from +ve terminal of cell → metal case of lamp; Wire from −ve terminal of cell → metal case of lamp', correctAnswer: 'does_not_glow', explanation: 'Both wires connect to the same terminal (metal case). No current flows through the filament.' },
    { id: 5, description: 'Wires from both terminals of cell connected, but one wire touches the glass (not the terminal)', detail: 'Wire from +ve terminal of cell → metal tip; Wire from −ve terminal of cell → glass bulb (not a terminal)', correctAnswer: 'does_not_glow', explanation: 'Glass is an insulator. The wire touching the glass does not make electrical contact — the circuit is incomplete.' },
    { id: 6, description: 'Lamp terminals connected to cell terminals (reversed polarity compared to arrangement 1)', detail: 'Wire from +ve terminal of cell → other terminal of lamp; Wire from −ve terminal of cell → first terminal of lamp', correctAnswer: 'glows', explanation: 'Both terminals are properly connected forming a complete path. For incandescent lamps, the polarity does not matter!' },
];

// ==================== ANIMATION HELPERS ====================

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number): number => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOutElastic = (t: number): number => { const c4 = (2 * Math.PI) / 3; return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1; };
const easeOutBounce = (t: number): number => { const n1 = 7.5625; const d1 = 2.75; if (t < 1 / d1) return n1 * t * t; if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75; if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375; return n1 * (t -= 2.625 / d1) * t + 0.984375; };

// ==================== KEYFRAMES ====================

const keyframes = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
@keyframes fadeInUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeInDown { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }
@keyframes popIn { 0% { transform:scale(0); opacity:0; } 60% { transform:scale(1.12); } 100% { transform:scale(1); opacity:1; } }
@keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.06); } }
@keyframes glowPurple { 0%,100% { box-shadow:0 0 8px rgba(74,77,201,0.2); } 50% { box-shadow:0 0 24px rgba(74,77,201,0.45); } }
@keyframes correctPop { 0% { transform:scale(0) rotate(-180deg); opacity:0; } 60% { transform:scale(1.2) rotate(8deg); } 100% { transform:scale(1) rotate(0); opacity:1; } }
@keyframes incorrectShake { 0%,100% { transform:translateX(0); } 15% { transform:translateX(-7px) rotate(-1deg); } 30% { transform:translateX(7px) rotate(1deg); } 45% { transform:translateX(-5px); } 60% { transform:translateX(5px); } }
@keyframes celebrateText { 0% { transform:scale(0.4) rotate(-5deg); opacity:0; } 50% { transform:scale(1.15) rotate(2deg); } 100% { transform:scale(1) rotate(0); opacity:1; } }
@keyframes confettiDrop { 0% { transform:translateY(0) rotate(0) scale(1); opacity:1; } 100% { transform:translateY(-120px) rotate(720deg) scale(0.3); opacity:0; } }
@keyframes floatOrb { 0%,100% { transform:translateY(0) translateX(0); } 25% { transform:translateY(-8px) translateX(4px); } 75% { transform:translateY(-10px) translateX(2px); } }
@keyframes drawStroke { from { stroke-dashoffset:300; } to { stroke-dashoffset:0; } }
@keyframes rowEnter { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
@keyframes badgeBounce { 0% { transform:scale(0) rotate(-30deg); } 50% { transform:scale(1.3) rotate(5deg); } 100% { transform:scale(1) rotate(0); } }
`;

// ==================== MINI CIRCUIT SVG ====================

const MiniCircuitSVG: React.FC<{ glows: boolean; size?: number; animate?: boolean }> = ({ glows, size = 56, animate = false }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
        <defs>
            <filter id={`bGlow-${glows ? 1 : 0}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={glows ? "3" : "0"} result="g" /><feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <linearGradient id="batG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={DS.primaryDark} /><stop offset="100%" stopColor={DS.primary} /></linearGradient>
        </defs>
        <rect x="4" y="22" width="16" height="20" rx="3" fill="url(#batG)" />
        <rect x="7" y="25" width="10" height="5" rx="1" fill="rgba(255,255,255,0.25)" />
        <rect x="20" y="28" width="3" height="8" rx="1" fill={DS.lavender} />
        <path d={glows ? "M23 30 L32 30 L32 16 L42 16" : "M23 30 L30 30"} fill="none" stroke={glows ? DS.primary : DS.gray500} strokeWidth="2" strokeLinecap="round" style={animate ? { strokeDasharray: 300, animation: 'drawStroke 0.8s ease-out forwards' } : {}} />
        <path d={glows ? "M23 36 L32 36 L32 48 L42 48" : "M23 36 L30 40"} fill="none" stroke={glows ? DS.primary : DS.gray500} strokeWidth="2" strokeLinecap="round" />
        <circle cx="47" cy="32" r="12" fill={glows ? '#FFEAA7' : DS.gray100} stroke={glows ? DS.accent : DS.gray500} strokeWidth="2" filter={`url(#bGlow-${glows ? 1 : 0})`} />
        {glows ? (<>
            <path d="M44 29 Q47 26 50 29" stroke={DS.accent} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M44 32 Q47 35 50 32" stroke={DS.accent} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => { const r = (a * Math.PI) / 180; return <line key={a} x1={47 + Math.cos(r) * 14} y1={32 + Math.sin(r) * 14} x2={47 + Math.cos(r) * 17} y2={32 + Math.sin(r) * 17} stroke={DS.accentLight} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />; })}
        </>) : (<>
            <line x1="44" y1="29" x2="50" y2="35" stroke={DS.gray500} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="50" y1="29" x2="44" y2="35" stroke={DS.gray500} strokeWidth="1.5" strokeLinecap="round" />
        </>)}
    </svg>
);

// ==================== DECORATIVE SHAPES ====================

const DecoShape: React.FC<{ type: 'circle' | 'triangle' | 'square'; color: string; size: number; filled?: boolean; style?: React.CSSProperties }> = ({ type, color, size, filled = false, style: s }) => {
    const base: React.CSSProperties = { ...s, position: 'absolute', pointerEvents: 'none' };
    if (type === 'circle') return <svg width={size} height={size} viewBox="0 0 40 40" style={base}><circle cx="20" cy="20" r="16" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" opacity="0.3" /></svg>;
    if (type === 'triangle') return <svg width={size} height={size} viewBox="0 0 40 40" style={base}><polygon points="20,4 36,36 4,36" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" opacity="0.25" /></svg>;
    return <svg width={size} height={size} viewBox="0 0 40 40" style={base}><rect x="6" y="6" width="28" height="28" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" opacity="0.2" /></svg>;
};

// ==================== MAIN COMPONENT ====================

const LampGlowObservationTool: React.FC<LampGlowObservationToolProps> = ({ props = {}, setStepDetails, stopAutoNext, setStopAutoNext }) => {
    const width = props.width || 800;
    const height = props.height || 600;
    const additionalProps = (props.additionalProps || {}) as LampGlowAdditionalProps;
    const arrangements = additionalProps.arrangements || DEFAULT_ARRANGEMENTS;
    const tableTitle = additionalProps.tableTitle || 'Table 3.1: Trying to Make the Lamp Glow';
    const summaryInsight = additionalProps.summaryInsight || 'The lamp glows only when BOTH terminals of the lamp are connected to BOTH terminals of the cell through a complete path!';
    const instructionsForStudent = additionalProps.instructionsForStudent || 'For each arrangement, select whether the lamp GLOWS or DOES NOT GLOW. Think: is there a complete path for current? Fill in all six rows!';

    const [answers, setAnswers] = useState<{ [k: number]: 'glows' | 'does_not_glow' | null }>({});
    const [submitted, setSubmitted] = useState(false);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState<number | null>(null);
    const [animatingRow, setAnimatingRow] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'table' | 'summary'>('table');
    const [confettiParticles, setConfettiParticles] = useState<{ id: number; x: number; color: string; delay: number }[]>([]);

    useEffect(() => { const i: any = {}; arrangements.forEach(a => { i[a.id] = null; }); setAnswers(i); }, [arrangements]);
    useEffect(() => { const s = document.createElement('style'); s.id = 'sing-lamp-kf'; s.textContent = keyframes; document.head.appendChild(s); return () => { const e = document.getElementById('sing-lamp-kf'); if (e) document.head.removeChild(e); }; }, []);
    useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

    const allAnswered = useMemo(() => arrangements.every(a => answers[a.id] != null), [answers, arrangements]);
    const answeredCount = Object.values(answers).filter(a => a !== null).length;

    const handleAnswer = useCallback((id: number, ans: 'glows' | 'does_not_glow') => {
        if (submitted) return;
        setAnimatingRow(id);
        setAnswers(p => ({ ...p, [id]: ans }));
        setTimeout(() => setAnimatingRow(null), 400);
    }, [submitted]);

    const handleSubmit = useCallback(() => {
        if (!allAnswered) return;
        setSubmitted(true);
        let c = 0; arrangements.forEach(a => { if (answers[a.id] === a.correctAnswer) c++; });
        setScore(c);
        if (c === arrangements.length) {
            setShowCelebration(true);
            setConfettiParticles(Array.from({ length: 24 }, (_, i) => ({ id: i, x: Math.random() * 100, color: [DS.primary, DS.accent, DS.lavender, DS.accentLight, DS.primaryDark][i % 5], delay: Math.random() * 0.6 })));
            setTimeout(() => { setShowCelebration(false); setConfettiParticles([]); }, 3500);
        }
    }, [allAnswered, arrangements, answers]);

    const handleReset = useCallback(() => {
        const i: any = {}; arrangements.forEach(a => { i[a.id] = null; });
        setAnswers(i); setSubmitted(false); setShowExplanation(null); setScore(0); setShowCelebration(false); setActiveTab('table');
    }, [arrangements]);

    return (
        <div style={{ width: '100%', maxWidth: width, minHeight: height, fontFamily: DS.font, background: DS.white, borderRadius: DS.radius.lg, overflow: 'hidden', boxShadow: '0 8px 40px rgba(74,77,201,0.1), 0 2px 12px rgba(0,0,0,0.04)', border: `1.5px solid ${DS.lavenderLight}`, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)', position: 'relative' }}>

            {confettiParticles.map(p => (<div key={p.id} style={{ position: 'absolute', left: `${p.x}%`, top: '35%', width: p.id % 3 === 0 ? 10 : 7, height: p.id % 3 === 0 ? 10 : 7, borderRadius: p.id % 2 === 0 ? '50%' : p.id % 3 === 0 ? 0 : 2, backgroundColor: p.color, animation: `confettiDrop 1.8s ease-out ${p.delay}s forwards`, zIndex: 100, pointerEvents: 'none' }} />))}

            {/* ═══ HEADER ═══ */}
            <div style={{ background: DS.gradient, padding: '22px 28px', position: 'relative', overflow: 'hidden' }}>
                <DecoShape type="circle" color="rgba(255,255,255,0.15)" size={60} filled style={{ top: -10, right: 80, animation: 'floatOrb 6s ease-in-out infinite' }} />
                <DecoShape type="triangle" color="rgba(255,255,255,0.12)" size={40} style={{ top: 8, right: 30, animation: 'floatOrb 8s ease-in-out infinite 1s' }} />
                <DecoShape type="square" color="rgba(255,255,255,0.08)" size={32} style={{ bottom: -4, right: 160 }} />
                <DecoShape type="circle" color="rgba(255,255,255,0.1)" size={24} style={{ top: 4, left: '40%' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 48, height: 48, borderRadius: DS.radius.md, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', animation: 'pulse 3s ease-in-out infinite' }}>
                        <Zap size={26} color="#FFEAA7" fill="#FFEAA7" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 3, fontFamily: DS.font }}>Activity 3.6 · Observation Table</div>
                        <h1 style={{ color: DS.white, fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: -0.2, fontFamily: DS.font }}>{tableTitle}</h1>
                    </div>
                    {submitted && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', borderRadius: DS.radius.pill, padding: '8px 18px', border: '1px solid rgba(255,255,255,0.2)', animation: 'badgeBounce 0.6s ease-out' }}>
                            <Award size={20} color="#FFEAA7" />
                            <span style={{ color: DS.white, fontWeight: 700, fontSize: 16, fontFamily: DS.font }}>{score}/{arrangements.length}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ INSTRUCTIONS ═══ */}
            <div style={{ padding: '14px 28px', background: DS.lavenderBg, borderBottom: `1.5px solid ${DS.lavenderLight}`, display: 'flex', alignItems: 'flex-start', gap: 12, animation: 'fadeInDown 0.5s ease-out 0.2s both' }}>
                <div style={{ width: 28, height: 28, borderRadius: DS.radius.sm, background: DS.lavender, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <BookOpen size={15} color={DS.primaryDark} />
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: DS.gray900, fontWeight: 500, fontFamily: DS.font }}>{instructionsForStudent}</p>
            </div>

            {/* ═══ TABS ═══ */}
            {submitted && (
                <div style={{ display: 'flex', borderBottom: `1.5px solid ${DS.gray300}`, background: DS.gray100 }}>
                    {([['table', '📋  Your Answers'], ['summary', '⚡  Key Insight']] as const).map(([k, l]) => (
                        <button key={k} onClick={() => setActiveTab(k as any)} style={{ flex: 1, padding: '12px 16px', border: 'none', background: activeTab === k ? DS.white : 'transparent', borderBottom: activeTab === k ? `3px solid ${DS.primary}` : '3px solid transparent', cursor: 'pointer', fontSize: 13, fontWeight: activeTab === k ? 700 : 500, color: activeTab === k ? DS.primary : DS.gray900, transition: 'all 0.3s ease', fontFamily: DS.font }}>{l}</button>
                    ))}
                </div>
            )}

            {/* ═══ TABLE ═══ */}
            {activeTab === 'table' && (
                <div style={{ overflowY: 'auto', maxHeight: height - 210 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 220px', background: DS.lavenderBg, borderBottom: `2px solid ${DS.primary}`, position: 'sticky', top: 0, zIndex: 10 }}>
                        {['S.No.', 'Arrangement of Cell and Lamp', 'Does the Lamp Glow?'].map((h, i) => (
                            <div key={i} style={{ padding: '12px 14px', fontSize: 11, fontWeight: 700, color: DS.primaryDark, textTransform: 'uppercase', letterSpacing: 1, borderRight: i < 2 ? `1px solid ${DS.lavender}50` : 'none', display: 'flex', alignItems: 'center', justifyContent: i === 0 ? 'center' : 'flex-start', fontFamily: DS.font }}>{h}</div>
                        ))}
                    </div>

                    {arrangements.map((arr, idx) => {
                        const ans = answers[arr.id];
                        const isCorrect = submitted && ans === arr.correctAnswer;
                        const isIncorrect = submitted && ans !== arr.correctAnswer;
                        let rowBg = idx % 2 === 0 ? DS.white : DS.gray100;
                        if (submitted) rowBg = isCorrect ? DS.successLight : DS.errorLight;

                        return (
                            <div key={arr.id}>
                                <div
                                    onMouseEnter={() => setHoveredRow(arr.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    onClick={() => submitted && setShowExplanation(showExplanation === arr.id ? null : arr.id)}
                                    style={{ display: 'grid', gridTemplateColumns: '52px 1fr 220px', background: hoveredRow === arr.id && !submitted ? DS.creamLight : rowBg, borderBottom: `1px solid ${DS.gray300}`, transition: 'all 0.3s ease', animation: submitted && isIncorrect ? `incorrectShake 0.6s ease-out ${idx * 0.04}s` : `rowEnter 0.4s ease-out ${idx * 0.07}s both`, cursor: submitted ? 'pointer' : 'default' }}
                                >
                                    <div style={{ padding: '14px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${DS.gray300}` }}>
                                        <div style={{ width: 32, height: 32, borderRadius: DS.radius.sm, background: DS.gradient, color: DS.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, fontFamily: DS.font, boxShadow: '0 2px 8px rgba(83,48,134,0.25)' }}>{arr.id}</div>
                                    </div>

                                    <div style={{ padding: '12px 14px', borderRight: `1px solid ${DS.gray300}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <MiniCircuitSVG glows={submitted ? arr.correctAnswer === 'glows' : ans === 'glows'} size={52} animate={animatingRow === arr.id} />
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: DS.gray900, lineHeight: 1.45, marginBottom: 4, fontFamily: DS.font }}>{arr.description}</div>
                                            <div style={{ fontSize: 11, color: DS.gray500, lineHeight: 1.35, fontStyle: 'italic', fontFamily: DS.font }}>{arr.detail}</div>
                                        </div>
                                    </div>

                                    <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                                        {!submitted ? (<>
                                            <button
                                                onMouseEnter={() => setHoveredButton(`g-${arr.id}`)}
                                                onMouseLeave={() => setHoveredButton(null)}
                                                onClick={e => { e.stopPropagation(); handleAnswer(arr.id, 'glows'); }}
                                                style={{ width: '100%', height: 36, borderRadius: DS.radius.pill, border: ans === 'glows' ? `2px solid ${DS.primary}` : `1.5px solid ${DS.gray300}`, background: ans === 'glows' ? DS.primary : hoveredButton === `g-${arr.id}` ? DS.lavenderBg : DS.white, color: ans === 'glows' ? DS.white : DS.gray900, fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)', transform: hoveredButton === `g-${arr.id}` ? 'scale(1.03)' : 'scale(1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: DS.font, boxShadow: ans === 'glows' ? '0 4px 14px rgba(74,77,201,0.35)' : 'none', letterSpacing: 0.3 }}
                                            ><span style={{ fontSize: 13 }}>💡</span> Glows</button>
                                            <button
                                                onMouseEnter={() => setHoveredButton(`n-${arr.id}`)}
                                                onMouseLeave={() => setHoveredButton(null)}
                                                onClick={e => { e.stopPropagation(); handleAnswer(arr.id, 'does_not_glow'); }}
                                                style={{ width: '100%', height: 36, borderRadius: DS.radius.pill, border: ans === 'does_not_glow' ? `2px solid ${DS.accent}` : `1.5px solid ${DS.gray300}`, background: ans === 'does_not_glow' ? DS.accent : hoveredButton === `n-${arr.id}` ? DS.creamLight : DS.white, color: ans === 'does_not_glow' ? DS.white : DS.gray900, fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)', transform: hoveredButton === `n-${arr.id}` ? 'scale(1.03)' : 'scale(1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: DS.font, boxShadow: ans === 'does_not_glow' ? '0 4px 14px rgba(255,114,18,0.35)' : 'none', letterSpacing: 0.3 }}
                                            ><span style={{ fontSize: 13 }}>✕</span> Does Not Glow</button>
                                        </>) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, animation: isCorrect ? 'correctPop 0.5s ease-out' : 'incorrectShake 0.6s ease-out' }}>
                                                <div style={{ width: 34, height: 34, borderRadius: DS.radius.sm, background: isCorrect ? `linear-gradient(135deg,${DS.success},#27AE60)` : `linear-gradient(135deg,${DS.error},#C0392B)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isCorrect ? '0 4px 12px rgba(46,204,113,0.35)' : '0 4px 12px rgba(231,76,60,0.35)' }}>
                                                    {isCorrect ? <Check size={18} color={DS.white} /> : <X size={18} color={DS.white} />}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 12, fontWeight: 700, color: isCorrect ? DS.success : DS.error, fontFamily: DS.font }}>{isCorrect ? 'Correct!' : 'Incorrect'}</div>
                                                    <div style={{ fontSize: 11, color: DS.gray500, fontFamily: DS.font }}>{arr.correctAnswer === 'glows' ? '💡 Glows' : '✕ Does not glow'}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {submitted && showExplanation === arr.id && (
                                    <div style={{ padding: '14px 28px 14px 78px', background: isCorrect ? 'rgba(46,204,113,0.06)' : 'rgba(231,76,60,0.06)', borderBottom: `1px solid ${DS.gray300}`, animation: 'fadeInDown 0.3s ease-out', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: DS.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                            <Zap size={12} color={DS.accent} />
                                        </div>
                                        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: DS.gray900, fontFamily: DS.font, fontWeight: 500 }}>{arr.explanation}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ═══ SUMMARY ═══ */}
            {activeTab === 'summary' && submitted && (
                <div style={{ padding: 28, animation: 'fadeInUp 0.4s ease-out', position: 'relative', overflow: 'hidden' }}>
                    <DecoShape type="circle" color={DS.lavender} size={80} filled style={{ top: 10, right: -20, opacity: 0.1 }} />
                    <DecoShape type="triangle" color={DS.accent} size={50} style={{ bottom: 20, left: -10, opacity: 0.08 }} />

                    <div style={{ background: DS.gradient, borderRadius: DS.radius.lg, padding: 28, textAlign: 'center', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
                        <DecoShape type="circle" color="rgba(255,255,255,0.1)" size={100} filled style={{ top: -30, right: -20 }} />
                        <div style={{ fontSize: 52, fontWeight: 800, color: DS.white, animation: 'celebrateText 0.6s ease-out', fontFamily: DS.font, position: 'relative', zIndex: 1, textShadow: '0 2px 20px rgba(0,0,0,0.15)' }}>{score}/{arrangements.length}</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 6, fontFamily: DS.font, fontWeight: 500, position: 'relative', zIndex: 1 }}>{score === arrangements.length ? '🎉 Perfect Score!' : score >= 4 ? '👍 Great effort!' : '📚 Keep exploring!'}</div>
                    </div>

                    <div style={{ background: DS.cream, borderRadius: DS.radius.md, padding: 22, border: `2px solid ${DS.accentLight}40`, position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${DS.accent},${DS.accentLight})`, borderRadius: `${DS.radius.md}px ${DS.radius.md}px 0 0` }} />
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                            <div style={{ width: 42, height: 42, borderRadius: DS.radius.sm, background: `${DS.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1.5px solid ${DS.accent}30` }}>
                                <Zap size={20} color={DS.accent} fill={DS.accent} />
                            </div>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: DS.primaryDark, marginBottom: 8, fontFamily: DS.font }}>Key Insight</div>
                                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: DS.gray900, fontWeight: 500, fontFamily: DS.font }}>{summaryInsight}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div style={{ background: DS.white, borderRadius: DS.radius.md, padding: 18, border: `1.5px solid ${DS.primary}25`, animation: 'fadeInUp 0.4s ease-out 0.1s both', boxShadow: `0 2px 12px ${DS.primary}08` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                <MiniCircuitSVG glows={true} size={40} />
                                <div style={{ fontSize: 13, fontWeight: 700, color: DS.primary, fontFamily: DS.font }}>Arrangements 1 & 6</div>
                            </div>
                            <p style={{ margin: 0, fontSize: 12, color: DS.gray900, lineHeight: 1.5, fontFamily: DS.font, fontWeight: 500 }}>Complete path exists. Both terminals properly connected. Current flows through filament → lamp glows!</p>
                        </div>
                        <div style={{ background: DS.white, borderRadius: DS.radius.md, padding: 18, border: `1.5px solid ${DS.accent}25`, animation: 'fadeInUp 0.4s ease-out 0.2s both', boxShadow: `0 2px 12px ${DS.accent}08` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                <MiniCircuitSVG glows={false} size={40} />
                                <div style={{ fontSize: 13, fontWeight: 700, color: DS.accent, fontFamily: DS.font }}>Arrangements 2–5</div>
                            </div>
                            <p style={{ margin: 0, fontSize: 12, color: DS.gray900, lineHeight: 1.5, fontFamily: DS.font, fontWeight: 500 }}>Incomplete path. Terminals improperly connected. No current through filament → lamp does not glow.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ FOOTER ═══ */}
            <div style={{ padding: '14px 28px', borderTop: `1.5px solid ${DS.gray300}`, background: DS.gray100, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 12, color: DS.gray900, fontWeight: 600, fontFamily: DS.font }}>{answeredCount}/{arrangements.length}</div>
                    <div style={{ width: 130, height: 8, borderRadius: DS.radius.pill, background: DS.gray300, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: DS.radius.pill, background: DS.gradient, width: `${(answeredCount / arrangements.length) * 100}%`, transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)', boxShadow: answeredCount > 0 ? `0 0 8px ${DS.primary}40` : 'none' }} />
                    </div>
                    <span style={{ fontSize: 11, color: DS.gray500, fontFamily: DS.font, fontWeight: 500 }}>answered</span>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                    {submitted && (
                        <button onClick={handleReset} onMouseEnter={() => setHoveredButton('reset')} onMouseLeave={() => setHoveredButton(null)}
                            style={{ padding: DS.padding.button, height: 40, borderRadius: DS.radius.pill, border: `1.5px solid ${DS.primary}`, background: hoveredButton === 'reset' ? DS.lavenderBg : DS.white, color: DS.primary, fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.25s ease', transform: hoveredButton === 'reset' ? 'scale(1.03)' : 'scale(1)', fontFamily: DS.font, letterSpacing: 0.3 }}
                        ><RotateCcw size={15} /> Try Again</button>
                    )}
                    {!submitted && (
                        <button onClick={handleSubmit} onMouseEnter={() => setHoveredButton('submit')} onMouseLeave={() => setHoveredButton(null)} disabled={!allAnswered}
                            style={{ padding: DS.padding.buttonLg, height: 40, borderRadius: DS.radius.pill, border: 'none', background: allAnswered ? (hoveredButton === 'submit' ? `linear-gradient(135deg,${DS.primaryDark},${DS.primary})` : DS.gradient) : DS.gray300, color: allAnswered ? DS.white : DS.gray500, fontWeight: 700, fontSize: 13, cursor: allAnswered ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', transform: allAnswered && hoveredButton === 'submit' ? 'scale(1.05)' : 'scale(1)', boxShadow: allAnswered ? '0 4px 20px rgba(83,48,134,0.35)' : 'none', fontFamily: DS.font, letterSpacing: 0.4, ...(allAnswered ? { animation: 'glowPurple 2.5s ease-in-out infinite' } : {}) }}
                        ><Check size={16} /> Check Answers</button>
                    )}
                </div>
            </div>

            {/* ═══ CELEBRATION ═══ */}
            {showCelebration && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(83,48,134,0.25)', zIndex: 50, backdropFilter: 'blur(6px)', animation: 'fadeInUp 0.3s ease-out' }}>
                    <div style={{ background: DS.white, borderRadius: DS.radius.lg, padding: '40px 56px', textAlign: 'center', animation: 'celebrateText 0.6s ease-out', boxShadow: '0 24px 64px rgba(83,48,134,0.25)', border: `2px solid ${DS.lavender}`, position: 'relative', overflow: 'hidden' }}>
                        <DecoShape type="circle" color={DS.primary} size={50} filled style={{ top: -15, right: -15, opacity: 0.1 }} />
                        <DecoShape type="triangle" color={DS.accent} size={30} style={{ bottom: -5, left: -5, opacity: 0.15 }} />
                        <div style={{ fontSize: 56, marginBottom: 14, animation: 'pulse 1s ease-in-out infinite' }}>🎉</div>
                        <div style={{ fontSize: 24, fontWeight: 800, background: DS.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8, fontFamily: DS.font }}>Perfect Score!</div>
                        <div style={{ fontSize: 14, color: DS.gray900, fontFamily: DS.font, fontWeight: 500 }}>You understand electrical circuits well!</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LampGlowObservationTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════