// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: water_cycle_sequencing_tool.tsx
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// ==================== INLINE SVG ICON COMPONENTS ====================

interface IconProps { size?: number; color?: string; strokeWidth?: number; }

const IconDroplets: React.FC<IconProps> = ({ size = 20, color = 'currentColor', strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
        <path d="M12.56 14.69c1.56 0 2.83-1.29 2.83-2.88 0-.82-.4-1.6-1.21-2.26-.81-.66-1.35-1.59-1.62-2.55-.27.96-.81 1.89-1.62 2.55-.81.66-1.21 1.44-1.21 2.26 0 1.59 1.27 2.88 2.83 2.88z" />
    </svg>
);

const IconSun: React.FC<IconProps> = ({ size = 20, color = 'currentColor', strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const IconCloud: React.FC<IconProps> = ({ size = 20, color = 'currentColor', strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
);

const IconCloudRain: React.FC<IconProps> = ({ size = 20, color = 'currentColor', strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <line x1="16" y1="13" x2="16" y2="21" /><line x1="8" y1="13" x2="8" y2="21" /><line x1="12" y1="15" x2="12" y2="23" />
        <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
    </svg>
);

const IconTreePine: React.FC<IconProps> = ({ size = 20, color = 'currentColor', strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="m17 14-5-8-5 8h3l-4 6h12l-4-6h3z" /><line x1="12" y1="20" x2="12" y2="24" />
    </svg>
);

const IconArrowUp: React.FC<IconProps> = ({ size = 20, color = 'currentColor', strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
    </svg>
);

const IconArrowDown: React.FC<IconProps> = ({ size = 20, color = 'currentColor', strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
    </svg>
);

const IconWaves: React.FC<IconProps> = ({ size = 20, color = 'currentColor', strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
);

const IconRotateCcw: React.FC<IconProps> = ({ size = 20, color = 'currentColor', strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
);

const IconCheck: React.FC<IconProps> = ({ size = 20, color = 'currentColor', strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconAward: React.FC<IconProps> = ({ size = 20, color = 'currentColor', strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
);

// ==================== SINGULARITY DESIGN TOKENS ====================

const DS = {
    primaryIndigo: '#4A4DC9',
    primaryOrange: '#FF7212',
    gradientPurple: '#533086',
    gradientOrange: '#FC9145',
    accentPurpleLight: '#C1C1EA',
    accentOrangeLight: '#FFF3E4',
    neutral900: '#4E4E4E',
    neutral400: '#CACACA',
    neutral200: '#EBEBEB',
    neutral100: '#F5F5F5',
    white: '#FFFFFF',
    success: '#22C55E',
    error: '#EF4444',
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    radiusPill: '999px',
    radiusLg: '16px',
    radiusMd: '12px',
    radiusSm: '8px',
    gradientHeader: 'linear-gradient(135deg, #4A4DC9 0%, #533086 50%, #FC9145 100%)',
    gradientButton: 'linear-gradient(135deg, #4A4DC9 0%, #533086 100%)',
    gradientHighlight: 'linear-gradient(135deg, #FF7212 0%, #FC9145 100%)',
};

// ==================== TYPE DEFINITIONS ====================

type ModeType = 'learn' | 'practice' | 'real_world' | 'hands_on';
interface StepDetails { currentStep: number; totalSteps: number; isPaused: boolean; currentMode: ModeType; }
interface StepDataInterface { id: number; title: string; description: string; type: 'intro' | 'explanation' | 'practice' | 'real_world' | 'hands_on'; mode: ModeType; data?: any; }
interface BaseDataInterface { themeColor?: string; autoPlayDuration?: number; }
interface WaterCycleStage { id: number; title: string; description: string; keyword: string; icon: string; color: string; }

interface WaterCycleAdditionalProps {
    stages?: WaterCycleStage[]; showHints?: boolean; shuffleSeed?: number;
    backgroundTheme?: 'monsoon' | 'default'; enableSoundEffects?: boolean;
    maxAttempts?: number; showStageNumbers?: boolean; difficulty?: 'easy' | 'medium' | 'hard';
}

interface WaterCycleSequencingToolProps {
    props?: {
        width?: number; height?: number; data?: BaseDataInterface; steps?: StepDataInterface[];
        initialMode?: ModeType; showModeSelector?: boolean; enabledModes?: ModeType[];
        showNavigation?: boolean; showPlayPause?: boolean; showStepIndicator?: boolean;
        initialStep?: number; filterSteps?: number[]; animationSpeed?: number;
        autoPlayDuration?: number; themeColor?: string; darkMode?: boolean;
        additionalProps?: WaterCycleAdditionalProps;
    };
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean; setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DEFAULT STAGES ====================

const DEFAULT_STAGES: WaterCycleStage[] = [
    { id: 1, title: 'Sun Heats Water Bodies', description: 'The Sun heats water in oceans, rivers, and lakes with its radiant energy.', keyword: 'SOLAR HEATING', icon: 'sun', color: '#FF7212' },
    { id: 2, title: 'Water EVAPORATES', description: 'Water from oceans, rivers, and lakes turns into water vapour and rises up into the atmosphere.', keyword: 'EVAPORATES', icon: 'arrow-up', color: '#4A4DC9' },
    { id: 3, title: 'Plants Release Water \u2014 TRANSPIRATION', description: 'Water also evaporates from trees and plants through a process called transpiration.', keyword: 'TRANSPIRATION', icon: 'leaf', color: '#533086' },
    { id: 4, title: 'Water Vapour CONDENSES', description: 'When water vapour rises up, it cools down and condenses to form tiny water droplets, making clouds.', keyword: 'CONDENSES', icon: 'cloud', color: '#7B5EA7' },
    { id: 5, title: 'PRECIPITATION Falls', description: 'Clouds bring rain, snow, and hail. This falling of water from clouds is called precipitation.', keyword: 'PRECIPITATION', icon: 'rain', color: '#4A4DC9' },
    { id: 6, title: 'Water Flows as RUNOFF', description: 'Rainwater flows over the surface into ponds, lakes, rivers, and oceans.', keyword: 'RUNOFF', icon: 'waves', color: '#FC9145' },
    { id: 7, title: 'Water INFILTRATION into Ground', description: "Some rainwater seeps through soil and rocks beneath the Earth\u2019s surface, stored as groundwater in aquifers.", keyword: 'INFILTRATION', icon: 'arrow-down', color: '#533086' },
    { id: 8, title: 'Water Returns to Water Bodies', description: 'Groundwater and runoff return water to oceans, rivers, and lakes \u2014 completing the never-ending water cycle!', keyword: 'REPLENISHMENT', icon: 'droplets', color: '#4A4DC9' },
];

// ==================== UTILITIES ====================

function shuffleArray<T>(arr: T[], seed?: number): T[] {
    const shuffled = [...arr]; let s = seed || Date.now();
    const random = () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
    for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1));[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
    return shuffled;
}

function genRands(count: number, seed: number): number[] {
    let s = seed; const v: number[] = [];
    for (let i = 0; i < count; i++) { s = (s * 16807 + 0) % 2147483647; v.push((s - 1) / 2147483646); }
    return v;
}
const CONFETTI_RANDOMS = genRands(40, 67890);

// ==================== MAIN COMPONENT ====================

const WaterCycleSequencingTool: React.FC<WaterCycleSequencingToolProps> = ({ props = {}, setStepDetails }) => {
    const config = useMemo(() => ({ width: props.width ?? 800, height: props.height ?? 600 }), [props]);
    const additionalProps = props.additionalProps || {};
    const stages = additionalProps.stages || DEFAULT_STAGES;
    const showHints = additionalProps.showHints ?? true;
    const showStageNumbers = additionalProps.showStageNumbers ?? true;
    const difficulty = additionalProps.difficulty ?? 'medium';

    const [shuffledStages, setShuffledStages] = useState<WaterCycleStage[]>([]);
    const [placedStages, setPlacedStages] = useState<(WaterCycleStage | null)[]>(Array(stages.length).fill(null));
    const [draggedStage, setDraggedStage] = useState<WaterCycleStage | null>(null);
    const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
    const [completedSlots, setCompletedSlots] = useState<Set<number>>(new Set());
    const [wrongSlot, setWrongSlot] = useState<number | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [showCycleAnimation, setShowCycleAnimation] = useState(false);
    const [celebratePhase, setCelebratePhase] = useState(0);
    const [hoverCard, setHoverCard] = useState<number | null>(null);
    const [hoverSlot, setHoverSlot] = useState<number | null>(null);
    const [animatedSlots, setAnimatedSlots] = useState<Set<number>>(new Set());
    const [touchDragStage, setTouchDragStage] = useState<WaterCycleStage | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // ── INJECT KEYFRAMES + POPPINS ──
    useEffect(() => {
        if (!document.getElementById('poppins-font-link')) {
            const fl = document.createElement('link');
            fl.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';
            fl.rel = 'stylesheet'; fl.id = 'poppins-font-link';
            document.head.appendChild(fl);
        }
        const kf = `
            @keyframes wcFadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
            @keyframes wcFadeInScale{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
            @keyframes wcPopIn{0%{transform:scale(0);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
            @keyframes wcShake{0%,100%{transform:translateX(0)}15%,45%,75%{transform:translateX(-5px)}30%,60%,90%{transform:translateX(5px)}}
            @keyframes wcCorrectDrop{0%{transform:scale(1);box-shadow:0 0 0 0 rgba(34,197,94,.6)}50%{transform:scale(1.06);box-shadow:0 0 0 10px rgba(34,197,94,0)}100%{transform:scale(1);box-shadow:0 0 0 0 rgba(34,197,94,0)}}
            @keyframes wcCelebrateBounce{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-16px) rotate(-4deg)}75%{transform:translateY(-8px) rotate(4deg)}}
            @keyframes wcConfetti{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(350px) rotate(720deg);opacity:0}}
        `;
        const ss = document.createElement('style'); ss.id = 'wc-kf'; ss.textContent = kf;
        document.head.appendChild(ss);
        return () => { const el = document.getElementById('wc-kf'); if (el) document.head.removeChild(el); };
    }, []);

    useEffect(() => { setShuffledStages(shuffleArray(stages, additionalProps.shuffleSeed)); }, [stages, additionalProps.shuffleSeed]);
    useEffect(() => { if (setStepDetails) setStepDetails({ currentStep: completedSlots.size, totalSteps: stages.length, isPaused: false, currentMode: 'practice' }); }, [completedSlots.size, stages.length, setStepDetails]);

    // ── HANDLERS ──
    const handleDragStart = useCallback((st: WaterCycleStage) => { setDraggedStage(st); }, []);
    const handleDragOver = useCallback((e: React.DragEvent, si: number) => { e.preventDefault(); if (!completedSlots.has(si)) setDragOverSlot(si); }, [completedSlots]);
    const handleDragLeave = useCallback(() => { setDragOverSlot(null); }, []);

    const placeStage = useCallback((stage: WaterCycleStage, si: number) => {
        setAttempts(p => p + 1);
        if (stage.id === si + 1) {
            const np = [...placedStages]; np[si] = stage; setPlacedStages(np);
            const nc = new Set(completedSlots); nc.add(si); setCompletedSlots(nc);
            const na = new Set(animatedSlots); na.add(si); setAnimatedSlots(na);
            setShuffledStages(p => p.filter(s => s.id !== stage.id));
            if (nc.size === stages.length) {
                setTimeout(() => {
                    setIsComplete(true); setShowCycleAnimation(true); setCelebratePhase(1);
                    setTimeout(() => setCelebratePhase(2), 800);
                    setTimeout(() => setCelebratePhase(3), 1600);
                }, 500);
            }
        } else { setWrongSlot(si); setTimeout(() => setWrongSlot(null), 600); }
    }, [placedStages, completedSlots, animatedSlots, stages.length]);

    const handleDrop = useCallback((e: React.DragEvent, si: number) => {
        e.preventDefault(); setDragOverSlot(null);
        if (!draggedStage || completedSlots.has(si)) return;
        placeStage(draggedStage, si); setDraggedStage(null);
    }, [draggedStage, completedSlots, placeStage]);

    const handleTouchCard = useCallback((st: WaterCycleStage) => {
        setTouchDragStage(p => (p && p.id === st.id) ? null : st);
    }, []);

    const handleSlotClick = useCallback((si: number) => {
        if (!touchDragStage || completedSlots.has(si)) return;
        placeStage(touchDragStage, si); setTouchDragStage(null);
    }, [touchDragStage, completedSlots, placeStage]);

    const handleReset = useCallback(() => {
        setShuffledStages(shuffleArray(stages, Date.now()));
        setPlacedStages(Array(stages.length).fill(null));
        setCompletedSlots(new Set()); setAnimatedSlots(new Set());
        setIsComplete(false); setShowCycleAnimation(false);
        setCelebratePhase(0); setAttempts(0);
        setDraggedStage(null); setTouchDragStage(null); setWrongSlot(null);
    }, [stages]);

    // ── ICON RENDERER ──
    const renderIcon = useCallback((name: string, size: number = 20, color: string = 'white') => {
        const p = { size, color, strokeWidth: 2 };
        switch (name) {
            case 'sun': return <IconSun {...p} />;
            case 'arrow-up': return <IconArrowUp {...p} />;
            case 'leaf': return <IconTreePine {...p} />;
            case 'cloud': return <IconCloud {...p} />;
            case 'rain': return <IconCloudRain {...p} />;
            case 'waves': return <IconWaves {...p} />;
            case 'arrow-down': return <IconArrowDown {...p} />;
            case 'droplets': return <IconDroplets {...p} />;
            default: return <IconDroplets {...p} />;
        }
    }, []);

    // ── RENDER STAGE CARD ──
    const renderStageCard = useCallback((stage: WaterCycleStage, index: number) => {
        const isSel = touchDragStage?.id === stage.id;
        const isHov = hoverCard === stage.id;
        return (
            <div key={stage.id} draggable
                onDragStart={() => handleDragStart(stage)}
                onClick={() => handleTouchCard(stage)}
                onMouseEnter={() => setHoverCard(stage.id)}
                onMouseLeave={() => setHoverCard(null)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: DS.radiusMd,
                    background: isSel ? DS.accentOrangeLight : DS.white,
                    border: isSel ? `2px solid ${DS.primaryOrange}` : isHov ? `2px solid ${DS.accentPurpleLight}` : `2px solid ${DS.neutral200}`,
                    cursor: 'grab',
                    transition: 'all .25s cubic-bezier(.4,0,.2,1)',
                    transform: isSel ? 'scale(1.03)' : isHov ? 'translateY(-2px)' : 'none',
                    boxShadow: isSel ? '0 6px 20px rgba(255,114,18,.15)' : isHov ? '0 4px 16px rgba(74,77,201,.1)' : '0 1px 4px rgba(0,0,0,.04)',
                    animation: `wcFadeInUp .35s ease-out ${index * 0.06}s both`,
                    userSelect: 'none' as const,
                }}
            >
                <div style={{
                    width: '36px', height: '36px', borderRadius: DS.radiusSm,
                    background: `linear-gradient(135deg, ${stage.color}, ${stage.color}cc)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transition: 'transform .25s ease',
                    transform: isSel ? 'rotate(8deg) scale(1.05)' : 'none',
                }}>
                    {renderIcon(stage.icon, 18, DS.white)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        fontFamily: DS.fontFamily, fontSize: '13px', fontWeight: 600,
                        color: DS.neutral900, lineHeight: 1.3,
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap' as const,
                    }}>
                        {stage.title}
                    </div>
                    {difficulty !== 'hard' && (
                        <div style={{
                            fontFamily: DS.fontFamily, fontSize: '10px',
                            color: stage.color, fontWeight: 700,
                            letterSpacing: '0.8px', marginTop: '2px',
                        }}>
                            {stage.keyword}
                        </div>
                    )}
                </div>
            </div>
        );
    }, [touchDragStage, hoverCard, handleDragStart, handleTouchCard, renderIcon, difficulty]);

    // ── RENDER SEQUENCE SLOT ──
    const renderSequenceSlot = useCallback((si: number) => {
        const placed = placedStages[si];
        const isDone = completedSlots.has(si);
        const isDO = dragOverSlot === si;
        const isW = wrongSlot === si;
        const isNA = animatedSlots.has(si);

        if (isDone && placed) {
            return (
                <div key={`slot-${si}`} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 14px', borderRadius: DS.radiusMd,
                    background: DS.white, border: `2px solid ${DS.success}`,
                    animation: isNA ? 'wcCorrectDrop .5s ease-out' : undefined,
                    transition: 'all .25s ease',
                    boxShadow: '0 2px 8px rgba(34,197,94,.08)',
                }}>
                    {showStageNumbers && (
                        <div style={{
                            width: '26px', height: '26px', borderRadius: '50%',
                            background: `linear-gradient(135deg, ${placed.color}, ${placed.color}dd)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: DS.fontFamily, fontSize: '12px', fontWeight: 700,
                            color: DS.white, flexShrink: 0,
                        }}>
                            {si + 1}
                        </div>
                    )}
                    <div style={{
                        width: '30px', height: '30px', borderRadius: DS.radiusSm,
                        background: `linear-gradient(135deg, ${placed.color}, ${placed.color}cc)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                        {renderIcon(placed.icon, 15, DS.white)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontFamily: DS.fontFamily, fontSize: '12px', fontWeight: 600,
                            color: DS.neutral900, lineHeight: 1.3,
                        }}>
                            {placed.title}
                        </div>
                    </div>
                    <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: DS.success, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, animation: 'wcPopIn .35s ease-out',
                    }}>
                        <IconCheck size={13} color={DS.white} strokeWidth={3} />
                    </div>
                </div>
            );
        }

        return (
            <div key={`slot-${si}`}
                onDragOver={e => handleDragOver(e, si)}
                onDragLeave={handleDragLeave}
                onDrop={e => handleDrop(e, si)}
                onClick={() => handleSlotClick(si)}
                onMouseEnter={() => setHoverSlot(si)}
                onMouseLeave={() => setHoverSlot(null)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 14px', borderRadius: DS.radiusMd,
                    background: isDO ? DS.accentPurpleLight + '30' : isW ? '#FEE2E2' : hoverSlot === si && touchDragStage ? DS.accentPurpleLight + '20' : DS.neutral100,
                    border: isDO ? `2px dashed ${DS.primaryIndigo}` : isW ? `2px solid ${DS.error}` : hoverSlot === si && touchDragStage ? `2px dashed ${DS.primaryIndigo}88` : `2px dashed ${DS.neutral400}`,
                    transition: 'all .25s cubic-bezier(.4,0,.2,1)',
                    cursor: touchDragStage ? 'pointer' : 'default',
                    animation: isW ? 'wcShake .45s ease' : undefined,
                    minHeight: '48px',
                }}
            >
                {showStageNumbers && (
                    <div style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: isDO ? DS.primaryIndigo : DS.neutral200,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: DS.fontFamily, fontSize: '12px', fontWeight: 600,
                        color: isDO ? DS.white : DS.neutral400,
                        flexShrink: 0, transition: 'all .25s ease',
                    }}>
                        {si + 1}
                    </div>
                )}
                <div style={{
                    fontFamily: DS.fontFamily, fontSize: '12px',
                    color: isDO ? DS.primaryIndigo : DS.neutral400,
                    fontWeight: 500, fontStyle: 'italic' as const,
                    transition: 'all .25s ease',
                }}>
                    {isDO ? 'Drop here!' : showHints ? `Stage ${si + 1} \u2014 ?` : 'Drop stage here'}
                </div>
            </div>
        );
    }, [placedStages, completedSlots, dragOverSlot, wrongSlot, animatedSlots, stages, showStageNumbers, showHints, hoverSlot, touchDragStage, handleDragOver, handleDragLeave, handleDrop, handleSlotClick, renderIcon]);

    // ── RENDER ARROW ──
    const renderArrow = useCallback((fi: number) => {
        const ok = completedSlots.has(fi) && (completedSlots.has(fi + 1) || (fi === stages.length - 1 && isComplete));
        return (
            <div key={`arrow-${fi}`} style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                height: '14px', opacity: ok ? 1 : 0.25,
                transition: 'all .4s ease',
            }}>
                <svg width="18" height="14" viewBox="0 0 18 14">
                    <path d="M9 0 L9 9 L4.5 5.5 M9 9 L13.5 5.5" fill="none"
                        stroke={ok ? DS.primaryIndigo : DS.neutral400}
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transition: 'all .4s ease' }} />
                </svg>
            </div>
        );
    }, [completedSlots, stages.length, isComplete]);

    const progress = completedSlots.size / stages.length;

    // ── MAIN RENDER ──
    return (
        <div ref={containerRef} style={{
            width: `${config.width}px`, maxWidth: '100%', height: `${config.height}px`,
            borderRadius: DS.radiusLg, overflow: 'hidden', fontFamily: DS.fontFamily,
            position: 'relative' as const, background: DS.white,
            display: 'flex', flexDirection: 'column' as const,
            boxShadow: '0 8px 40px rgba(83,48,134,.12), 0 2px 8px rgba(0,0,0,.06)',
        }}>
            {/* ── HEADER ── */}
            <div style={{
                padding: '16px 20px', background: DS.gradientHeader,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'relative' as const, overflow: 'hidden',
            }}>
                {/* Decorative shapes */}
                <div style={{ position: 'absolute', top: '-15px', right: '60px', width: '50px', height: '50px', borderRadius: '50%', border: '2px solid rgba(255,255,255,.15)', pointerEvents: 'none' as const }} />
                <div style={{ position: 'absolute', bottom: '-10px', right: '20px', width: '30px', height: '30px', borderRadius: '4px', border: '2px solid rgba(255,255,255,.1)', transform: 'rotate(15deg)', pointerEvents: 'none' as const }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: DS.radiusSm,
                        background: 'rgba(255,255,255,.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <IconDroplets size={22} color={DS.white} />
                    </div>
                    <div>
                        <div style={{ fontFamily: DS.fontFamily, fontSize: '16px', fontWeight: 700, color: DS.white, lineHeight: 1.2 }}>The Water Cycle</div>
                        <div style={{ fontFamily: DS.fontFamily, fontSize: '11px', color: 'rgba(255,255,255,.75)', fontWeight: 400 }}>Arrange the 8 stages in order</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1 }}>
                    {/* Progress pill */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(255,255,255,.2)', borderRadius: DS.radiusPill,
                        padding: '6px 14px',
                    }}>
                        <div style={{ width: '70px', height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,.25)', overflow: 'hidden' }}>
                            <div style={{
                                width: `${progress * 100}%`, height: '100%', borderRadius: '3px',
                                background: isComplete ? DS.success : DS.white,
                                transition: 'width .5s ease-out',
                            }} />
                        </div>
                        <span style={{ fontFamily: DS.fontFamily, fontSize: '11px', fontWeight: 600, color: DS.white }}>
                            {completedSlots.size}/{stages.length}
                        </span>
                    </div>

                    {/* Reset button */}
                    <button onClick={handleReset} style={{
                        width: '34px', height: '34px', borderRadius: DS.radiusSm,
                        border: '1.5px solid rgba(255,255,255,.4)',
                        background: 'rgba(255,255,255,.1)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all .25s ease',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.25)'; e.currentTarget.style.transform = 'rotate(-90deg)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.1)'; e.currentTarget.style.transform = 'rotate(0)'; }}>
                        <IconRotateCcw size={15} color={DS.white} />
                    </button>
                </div>
            </div>

            {/* ── INSTRUCTIONS ── */}
            {!isComplete && (
                <div style={{ padding: '10px 20px', background: DS.accentOrangeLight, borderBottom: `1px solid ${DS.neutral200}` }}>
                    <div style={{ fontFamily: DS.fontFamily, fontSize: '12px', color: DS.neutral900, lineHeight: 1.5, fontWeight: 500 }}>
                        {touchDragStage ? (
                            <span><strong style={{ color: touchDragStage.color }}>{touchDragStage.title}</strong> selected &mdash; now tap the correct slot!</span>
                        ) : (
                            <span>{completedSlots.size === 0 ? 'Drag each stage card (or tap to select, then tap a slot) into the correct position. The cycle begins with the Sun!' : `Great! ${completedSlots.size} stage${completedSlots.size > 1 ? 's' : ''} placed. Keep going!`}</span>
                        )}
                    </div>
                </div>
            )}

            {/* ── MAIN CONTENT ── */}
            <div style={{ flex: 1, display: 'flex', gap: '16px', padding: '14px 16px', overflow: 'hidden', background: DS.neutral100 }}>
                {/* Left: Shuffled Cards */}
                {!isComplete && (
                    <div style={{ width: '44%', display: 'flex', flexDirection: 'column' as const, gap: '8px', overflowY: 'auto' as const, paddingRight: '4px' }}>
                        <div style={{ fontFamily: DS.fontFamily, fontSize: '10px', fontWeight: 700, color: DS.primaryIndigo, textTransform: 'uppercase' as const, letterSpacing: '1.2px', padding: '0 4px 4px' }}>
                            Mixed-Up Stages
                        </div>
                        {shuffledStages.map((st, i) => renderStageCard(st, i))}
                        {shuffledStages.length === 0 && !isComplete && (
                            <div style={{ textAlign: 'center' as const, padding: '24px', fontFamily: DS.fontFamily, color: DS.primaryIndigo, fontSize: '13px', fontWeight: 600, background: DS.accentPurpleLight + '30', borderRadius: DS.radiusMd }}>
                                All stages placed!
                            </div>
                        )}
                    </div>
                )}

                {/* Right: Sequence Slots */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, gap: '3px', overflowY: 'auto' as const }}>
                    {!isComplete && (
                        <div style={{ fontFamily: DS.fontFamily, fontSize: '10px', fontWeight: 700, color: DS.gradientPurple, textTransform: 'uppercase' as const, letterSpacing: '1.2px', padding: '0 4px 4px' }}>
                            {"Correct Sequence (1\u21928)"}
                        </div>
                    )}

                    {isComplete ? (
                        /* ── CELEBRATION ── */
                        <div style={{
                            display: 'flex', flexDirection: 'column' as const,
                            alignItems: 'center', justifyContent: 'center',
                            height: '100%', gap: '14px',
                            animation: 'wcFadeInScale .5s ease-out',
                        }}>
                            <div style={{ animation: celebratePhase >= 1 ? 'wcCelebrateBounce 1.2s ease infinite' : undefined }}>
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '50%',
                                    background: DS.gradientHighlight,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 8px 28px rgba(255,114,18,.35)',
                                    animation: 'wcPopIn .5s ease-out',
                                }}>
                                    <IconAward size={34} color={DS.white} />
                                </div>
                            </div>

                            <div style={{ textAlign: 'center' as const }}>
                                <div style={{
                                    fontFamily: DS.fontFamily, fontSize: '20px', fontWeight: 800,
                                    color: DS.gradientPurple, marginBottom: '4px',
                                    opacity: celebratePhase >= 2 ? 1 : 0,
                                    animation: celebratePhase >= 2 ? 'wcFadeInUp .4s ease-out' : undefined,
                                }}>
                                    Water Cycle Complete!
                                </div>
                                <div style={{
                                    fontFamily: DS.fontFamily, fontSize: '13px',
                                    color: DS.neutral900, fontWeight: 500,
                                    opacity: celebratePhase >= 3 ? 1 : 0,
                                    transition: 'opacity .4s ease',
                                }}>
                                    You arranged all {stages.length} stages in {attempts} attempts!
                                </div>
                            </div>

                            {/* Mini cycle flow */}
                            <div style={{
                                display: 'flex', flexWrap: 'wrap' as const,
                                justifyContent: 'center', gap: '5px', maxWidth: '400px',
                                opacity: celebratePhase >= 3 ? 1 : 0,
                                animation: celebratePhase >= 3 ? 'wcFadeInUp .5s ease-out' : undefined,
                            }}>
                                {stages.map((stage, i) => (
                                    <React.Fragment key={stage.id}>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                            padding: '5px 10px', borderRadius: DS.radiusPill,
                                            background: DS.white,
                                            border: `1.5px solid ${stage.color}40`,
                                            animation: `wcPopIn .3s ease-out ${i * 0.08}s both`,
                                        }}>
                                            <div style={{
                                                width: '18px', height: '18px', borderRadius: '4px',
                                                background: stage.color, display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                {renderIcon(stage.icon, 10, DS.white)}
                                            </div>
                                            <span style={{ fontFamily: DS.fontFamily, fontSize: '9px', fontWeight: 700, color: DS.neutral900 }}>
                                                {stage.keyword}
                                            </span>
                                        </div>
                                        {i < stages.length - 1 && (
                                            <div style={{ display: 'flex', alignItems: 'center', color: DS.primaryIndigo, fontSize: '11px', fontWeight: 600 }}>
                                                {"\u2192"}
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                                <div style={{ display: 'flex', alignItems: 'center', fontFamily: DS.fontFamily, color: DS.primaryOrange, fontSize: '11px', fontWeight: 700 }}>
                                    {"\u21A9"} Stage 1
                                </div>
                            </div>

                            {/* Info box */}
                            <div style={{
                                background: DS.accentPurpleLight + '40', borderRadius: DS.radiusMd,
                                padding: '10px 18px', fontFamily: DS.fontFamily, fontSize: '12px',
                                color: DS.gradientPurple, textAlign: 'center' as const, fontWeight: 500,
                                maxWidth: '360px', lineHeight: 1.6,
                                border: `1px solid ${DS.accentPurpleLight}`,
                                animation: celebratePhase >= 3 ? 'wcFadeInUp .5s ease-out .2s both' : undefined,
                            }}>
                                The water cycle is a <strong>never-ending loop</strong> &mdash; Stage 8 connects right back to Stage 1!
                            </div>

                            {/* Try Again button */}
                            <button onClick={handleReset} style={{
                                padding: '12px 28px', borderRadius: DS.radiusPill,
                                border: 'none', background: DS.gradientButton,
                                color: DS.white, fontFamily: DS.fontFamily,
                                fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                boxShadow: '0 4px 16px rgba(74,77,201,.25)',
                                transition: 'all .25s ease',
                                animation: celebratePhase >= 3 ? 'wcFadeInUp .5s ease-out .4s both' : undefined,
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(74,77,201,.35)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(74,77,201,.25)'; }}>
                                <IconRotateCcw size={15} />
                                Try Again
                            </button>
                        </div>
                    ) : (
                        stages.map((_, i) => (
                            <React.Fragment key={`seq-${i}`}>
                                {renderSequenceSlot(i)}
                                {i < stages.length - 1 && renderArrow(i)}
                            </React.Fragment>
                        ))
                    )}
                </div>
            </div>

            {/* ── CONFETTI ── */}
            {isComplete && celebratePhase >= 2 && (
                <div style={{ position: 'absolute' as const, inset: 0, pointerEvents: 'none' as const, zIndex: 20, overflow: 'hidden' }}>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={`confetti-${i}`} style={{
                            position: 'absolute', top: '-10px', left: `${5 + i * 4.5}%`,
                            width: `${6 + CONFETTI_RANDOMS[i * 2] * 6}px`,
                            height: `${6 + CONFETTI_RANDOMS[i * 2 + 1] * 6}px`,
                            borderRadius: CONFETTI_RANDOMS[i * 2] > 0.5 ? '50%' : '3px',
                            background: [DS.primaryIndigo, DS.primaryOrange, DS.gradientPurple, DS.accentPurpleLight, DS.gradientOrange, DS.success][i % 6],
                            animation: `wcConfetti ${2 + CONFETTI_RANDOMS[i * 2] * 2}s ease-out ${i * 0.07}s both`,
                            opacity: 0.85,
                        }} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WaterCycleSequencingTool;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════