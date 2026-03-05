// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE START
// File: groundwater_action_classifier.tsx
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// ==================== INLINE SVG ICONS (no external dependency) ====================

const IconCheck: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const IconX: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const IconRotateCcw: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 16, color = 'currentColor', style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
);
const IconChevronLeft: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
);
const IconChevronRight: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);
const IconDroplets: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" /><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" /></svg>
);
const IconBookOpen: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
);
const IconTarget: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);
const IconZap: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);
const IconFlaskConical: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" /><path d="M7 16.5h10" /></svg>
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

// ADDITIONAL PROPS - TOOL SPECIFIC
interface ActionCard {
    id: string;
    label: string;
    category: 'depletes' | 'recharges';
    explanation: string;
    hint: string;
    icon?: string;
}

interface GroundwaterAdditionalProps {
    actions?: ActionCard[];
    depletesLabel?: string;
    rechargesLabel?: string;
    depletesColor?: string;
    rechargesColor?: string;
    shuffleOnLoad?: boolean;
    showExplanations?: boolean;
    showCrossSection?: boolean;
    context?: 'indian' | 'global';
}

interface GroundwaterActionClassifierProps {
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
        additionalProps?: GroundwaterAdditionalProps;
    };
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ==================== DEFAULT ACTION CARDS ====================

const DEFAULT_ACTIONS: ActionCard[] = [
    {
        id: 'bore_wells',
        label: 'Excessive Bore Wells',
        category: 'depletes',
        explanation: 'Too many bore wells pump out groundwater faster than it can naturally recharge, lowering the water table.',
        hint: 'Think: Are we taking water OUT of the ground or putting it IN?',
        icon: '🔧',
    },
    {
        id: 'deforestation',
        label: 'Deforestation',
        category: 'depletes',
        explanation: 'Without tree roots, rainwater runs off the surface instead of seeping deep into the ground.',
        hint: 'Think: Do tree roots help or block water from going underground?',
        icon: '🪓',
    },
    {
        id: 'concrete_surfaces',
        label: 'Concrete Surfaces',
        category: 'depletes',
        explanation: 'Concrete and asphalt are impermeable — they block rainwater from infiltrating into the soil below.',
        hint: 'Think: Does concrete let water pass through or block it?',
        icon: '🏗️',
    },
    {
        id: 'rainwater_harvesting',
        label: 'Rainwater Harvesting',
        category: 'recharges',
        explanation: 'Collecting and directing rainwater into the ground helps replenish underground aquifers.',
        hint: 'Think: Where does the collected rainwater go — drains or underground?',
        icon: '🌧️',
    },
    {
        id: 'recharge_pits',
        label: 'Recharge Pits',
        category: 'recharges',
        explanation: 'Recharge pits are dug specifically to allow surface water to percolate down and replenish groundwater.',
        hint: 'Think: What is the purpose of digging these special pits?',
        icon: '🕳️',
    },
    {
        id: 'planting_trees',
        label: 'Planting Trees',
        category: 'recharges',
        explanation: 'Tree roots create channels in the soil that help water seep through into underground aquifers.',
        hint: 'Think: What do tree roots do to the soil structure?',
        icon: '🌳',
    },
    {
        id: 'open_soil',
        label: 'Open Soil / Permeable Surfaces',
        category: 'recharges',
        explanation: 'Open soil and permeable surfaces allow rainwater to naturally infiltrate and recharge groundwater.',
        hint: 'Think: Can water pass through open soil easily?',
        icon: '🌱',
    },
    {
        id: 'industrial_overuse',
        label: 'Industrial Overuse',
        category: 'depletes',
        explanation: 'Factories and industries often pump massive amounts of groundwater, depleting it rapidly.',
        hint: 'Think: Do industries put water back into the ground or take it out?',
        icon: '🏭',
    },
    {
        id: 'check_dams',
        label: 'Check Dams',
        category: 'recharges',
        explanation: 'Check dams slow down flowing water, giving it time to seep into the ground and recharge aquifers.',
        hint: 'Think: What happens when flowing water is slowed down near soil?',
        icon: '🧱',
    },
];

// ==================== DEFAULT STEPS ====================

const DEFAULT_STEPS: StepDataInterface[] = [
    // LEARN MODE
    {
        id: 1,
        title: "What is Groundwater?",
        description: "Groundwater is water stored underground in spaces between rocks and soil called aquifers. It's the source for wells, bore wells, and natural springs across India.",
        type: 'intro',
        mode: 'learn',
    },
    {
        id: 2,
        title: "Groundwater Depletion",
        description: "When we pump out water faster than rain can refill it, the water table drops. This is called groundwater depletion — a serious problem in many Indian states like Rajasthan, Punjab, and Tamil Nadu.",
        type: 'explanation',
        mode: 'learn',
    },
    {
        id: 3,
        title: "What Causes Depletion?",
        description: "Excessive bore wells, concrete surfaces that block infiltration, deforestation, and industrial overuse all prevent water from recharging underground aquifers.",
        type: 'explanation',
        mode: 'learn',
    },
    {
        id: 4,
        title: "Rainwater Harvesting",
        description: "Rainwater harvesting collects and stores rain for later use or directs it underground. Techniques include rooftop collection, recharge pits, check dams, and maintaining open soil.",
        type: 'explanation',
        mode: 'learn',
    },
    {
        id: 5,
        title: "How Recharge Works",
        description: "Infiltration is the key! Water seeps through permeable surfaces, roots create channels, and recharge structures give water TIME to percolate underground. All helpful actions share one thing: they help water seep into the ground.",
        type: 'explanation',
        mode: 'learn',
    },

    // PRACTICE MODE
    {
        id: 10,
        title: "Sort the Actions!",
        description: "Drag each action card into the correct category: Depletes Groundwater or Recharges Groundwater. Think about whether each action INCREASES or DECREASES water seeping into the ground!",
        type: 'practice',
        mode: 'practice',
    },

    // REAL WORLD MODE
    {
        id: 20,
        title: "Indian Neighbourhood Context",
        description: "In many Indian neighbourhoods, concrete roads and buildings cover the soil. During monsoons, water runs off into drains instead of seeping underground. Rainwater harvesting systems on rooftops can redirect this water underground!",
        type: 'real_world',
        mode: 'real_world',
    },
    {
        id: 21,
        title: "Chennai Water Crisis",
        description: "Chennai faced a severe water crisis in 2019 when its reservoirs dried up. Since then, the government made rainwater harvesting mandatory for buildings. This helped improve groundwater levels across the city.",
        type: 'real_world',
        mode: 'real_world',
    },

    // HANDS ON MODE
    {
        id: 30,
        title: "Classify Actions",
        description: "Sort all 9 actions into Depletes or Recharges categories. Apply your knowledge of infiltration and cause-effect reasoning!",
        type: 'hands_on',
        mode: 'hands_on',
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

function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ==================== MAIN COMPONENT ====================

const GroundwaterActionClassifier: React.FC<GroundwaterActionClassifierProps> = ({
    props = {},
    setStepDetails,
    stopAutoNext,
    setStopAutoNext,
}) => {
    // ─── CONFIGURATION WITH DEFAULTS ───
    const config = useMemo(() => ({
        width: props.width ?? 800,
        height: props.height ?? 600,
        initialMode: props.initialMode ?? 'practice',
        showModeSelector: props.showModeSelector ?? true,
        enabledModes: props.enabledModes ?? ['learn', 'practice', 'real_world', 'hands_on'],
        showNavigation: props.showNavigation ?? true,
        showPlayPause: props.showPlayPause ?? true,
        showStepIndicator: props.showStepIndicator ?? true,
        initialStep: props.initialStep ?? 10,
        filterSteps: props.filterSteps ?? null,
        animationSpeed: props.animationSpeed ?? 1,
        autoPlayDuration: props.autoPlayDuration ?? props.data?.autoPlayDuration ?? 0,
        themeColor: props.themeColor ?? props.data?.themeColor ?? '#4A4DC9',
        darkMode: props.darkMode ?? false,
    }), [props]);

    // ─── ADDITIONAL PROPS ───
    const additionalProps = props.additionalProps || {};
    const actionCards = useMemo(() => additionalProps.actions ?? DEFAULT_ACTIONS, [additionalProps.actions]);
    const depletesLabel = additionalProps.depletesLabel ?? 'Depletes Groundwater ⚠️';
    const rechargesLabel = additionalProps.rechargesLabel ?? 'Recharges Groundwater ✅';
    const depletesColor = additionalProps.depletesColor ?? '#DC2626';
    const rechargesColor = additionalProps.rechargesColor ?? '#16A34A';
    const showCrossSection = additionalProps.showCrossSection ?? true;

    // ─── STATE ───
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
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [buttonStates, setButtonStates] = useState<{ [key: string]: 'idle' | 'hover' | 'active' }>({});

    // Classifier state
    const [unsortedCards, setUnsortedCards] = useState<ActionCard[]>([]);
    const [depletesCards, setDepletesCards] = useState<ActionCard[]>([]);
    const [rechargesCards, setRechargesCards] = useState<ActionCard[]>([]);
    const [draggedCard, setDraggedCard] = useState<ActionCard | null>(null);
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [feedbackCard, setFeedbackCard] = useState<{ id: string; correct: boolean; message: string } | null>(null);
    const [shakeCard, setShakeCard] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [hoveredBin, setHoveredBin] = useState<'depletes' | 'recharges' | null>(null);
    const [cardEntryAnimations, setCardEntryAnimations] = useState<{ [key: string]: boolean }>({});
    const [celebrationParticles, setCelebrationParticles] = useState<any[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const dragStartRef = useRef({ x: 0, y: 0 });

    const filteredSteps = useMemo(() => {
        return availableSteps.filter(step => step.mode === selectedMode);
    }, [availableSteps, selectedMode]);
    const currentStep = filteredSteps[currentStepIndex] || filteredSteps[0];

    // ─── INITIALIZE CARDS ───
    useEffect(() => {
        const shuffled = shuffleArray(actionCards);
        setUnsortedCards(shuffled);
        setDepletesCards([]);
        setRechargesCards([]);
        setScore(0);
        setCompleted(false);
        setShowSummary(false);
        setFeedbackCard(null);

        // Stagger entry animations
        shuffled.forEach((card, index) => {
            setTimeout(() => {
                setCardEntryAnimations(prev => ({ ...prev, [card.id]: true }));
            }, index * 120);
        });
    }, [actionCards]);

    // ─── INJECT KEYFRAMES ───
    useEffect(() => {
        const keyframes = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
            
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeInDown {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOutDown {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(30px); }
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
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }
            @keyframes shakeX {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
                20%, 40%, 60%, 80% { transform: translateX(6px); }
            }
            @keyframes correctGlow {
                0% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.6); }
                50% { box-shadow: 0 0 20px 8px rgba(22, 163, 74, 0.3); }
                100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
            }
            @keyframes slideInLeft {
                from { transform: translateX(-40px) scale(0.9); opacity: 0; }
                to { transform: translateX(0) scale(1); opacity: 1; }
            }
            @keyframes slideInRight {
                from { transform: translateX(40px) scale(0.9); opacity: 0; }
                to { transform: translateX(0) scale(1); opacity: 1; }
            }
            @keyframes dropIn {
                0% { transform: translateY(-20px) scale(0.8); opacity: 0; }
                60% { transform: translateY(4px) scale(1.02); opacity: 1; }
                100% { transform: translateY(0) scale(1); opacity: 1; }
            }
            @keyframes confetti {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(300px) rotate(720deg); opacity: 0; }
            }
            @keyframes waterRise {
                from { height: 20%; }
                to { height: 65%; }
            }
            @keyframes waterDrop {
                from { height: 65%; }
                to { height: 20%; }
            }
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-6px); }
            }
            @keyframes ripple {
                0% { transform: scale(0); opacity: 0.6; }
                100% { transform: scale(3); opacity: 0; }
            }
            @keyframes scorePopIn {
                0% { transform: scale(0.5); opacity: 0; }
                60% { transform: scale(1.3); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes cardHoverGlow {
                0%, 100% { box-shadow: 0 4px 12px rgba(74, 77, 201, 0.15); }
                50% { box-shadow: 0 6px 20px rgba(74, 77, 201, 0.3); }
            }
            @keyframes pumpHandleDown {
                0%, 100% { transform: rotate(0deg); }
                40%, 60% { transform: rotate(-25deg); }
            }
            @keyframes pumpPistonMove {
                0%, 100% { transform: translateY(0px); }
                40%, 60% { transform: translateY(-10px); }
            }
            @keyframes spoutStream {
                0% { stroke-dashoffset: 24; opacity: 0.3; }
                30% { opacity: 1; }
                70% { opacity: 1; }
                100% { stroke-dashoffset: 0; opacity: 0.3; }
            }
            @keyframes spoutDrop1 {
                0% { transform: translate(0px, 0px); opacity: 1; }
                100% { transform: translate(6px, 20px); opacity: 0; }
            }
            @keyframes spoutDrop2 {
                0% { transform: translate(0px, 0px); opacity: 1; }
                100% { transform: translate(3px, 22px); opacity: 0; }
            }
            @keyframes spoutDrop3 {
                0% { transform: translate(0px, 0px); opacity: 0.8; }
                100% { transform: translate(8px, 18px); opacity: 0; }
            }
            @keyframes spoutSplash {
                0%, 100% { transform: scale(0.6); opacity: 0; }
                50% { transform: scale(1.2); opacity: 0.6; }
            }
            @keyframes waterTableSink {
                0% { height: 42%; }
                100% { height: 15%; }
            }
            @keyframes bubbleRise1 {
                0% { transform: translateY(0) scale(1); opacity: 0.7; }
                100% { transform: translateY(-40px) scale(0.4); opacity: 0; }
            }
            @keyframes bubbleRise2 {
                0% { transform: translateY(0) scale(0.8); opacity: 0.6; }
                100% { transform: translateY(-35px) scale(0.3); opacity: 0; }
            }
            @keyframes bubbleRise3 {
                0% { transform: translateY(0) scale(0.9); opacity: 0.5; }
                100% { transform: translateY(-45px) scale(0.2); opacity: 0; }
            }
            @keyframes pipeFlowUp {
                0% { stroke-dashoffset: 16; }
                100% { stroke-dashoffset: 0; }
            }
            @keyframes warningPulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.15); }
            }
            @keyframes motorVibrate {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-0.5px); }
                75% { transform: translateX(0.5px); }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'groundwater-classifier-keyframes';
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);

        return () => {
            const existing = document.getElementById('groundwater-classifier-keyframes');
            if (existing) document.head.removeChild(existing);
        };
    }, []);

    // ─── STEP DETAILS SYNC ───
    useEffect(() => {
        if (setStepDetails) {
            setStepDetails({
                currentStep: currentStepIndex,
                totalSteps: filteredSteps.length,
                isPaused: !isPlaying,
                currentMode: selectedMode,
            });
        }
    }, [currentStepIndex, filteredSteps.length, isPlaying, selectedMode]);

    // ─── AUTO PLAY ───
    useEffect(() => {
        if (!isPlaying || config.autoPlayDuration <= 0) return;
        const timer = setInterval(() => {
            handleNext();
        }, config.autoPlayDuration);
        return () => clearInterval(timer);
    }, [isPlaying, config.autoPlayDuration, currentStepIndex, filteredSteps.length]);

    // ─── NAVIGATION ───
    const handleNext = useCallback(() => {
        if (currentStepIndex < filteredSteps.length - 1) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentStepIndex(prev => prev + 1);
                setIsTransitioning(false);
            }, 300);
        }
    }, [currentStepIndex, filteredSteps.length]);

    const handlePrev = useCallback(() => {
        if (currentStepIndex > 0) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentStepIndex(prev => prev - 1);
                setIsTransitioning(false);
            }, 300);
        }
    }, [currentStepIndex]);

    const handleModeChange = useCallback((mode: ModeType) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setSelectedMode(mode);
            setCurrentStepIndex(0);
            setIsTransitioning(false);
        }, 300);
    }, []);

    // ─── DRAG & DROP HANDLERS ───
    const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent, card: ActionCard) => {
        e.preventDefault();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        setDraggedCard(card);
        setIsDragging(true);
        setDragPosition({ x: clientX, y: clientY });
        dragStartRef.current = { x: clientX, y: clientY };
    }, []);

    const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        setDragPosition({ x: clientX, y: clientY });

        // Check which bin we're hovering over
        const container = containerRef.current;
        if (container) {
            const rect = container.getBoundingClientRect();
            const relX = clientX - rect.left;
            const containerWidth = rect.width;
            if (relX < containerWidth * 0.3) {
                setHoveredBin('depletes');
            } else if (relX > containerWidth * 0.7) {
                setHoveredBin('recharges');
            } else {
                setHoveredBin(null);
            }
        }
    }, [isDragging]);

    const handleDragEnd = useCallback(() => {
        if (!isDragging || !draggedCard) return;

        const targetBin = hoveredBin;
        setIsDragging(false);
        setDraggedCard(null);
        setHoveredBin(null);

        if (!targetBin) return;

        const isCorrect = draggedCard.category === targetBin;

        if (isCorrect) {
            // Correct placement
            setUnsortedCards(prev => prev.filter(c => c.id !== draggedCard.id));
            if (targetBin === 'depletes') {
                setDepletesCards(prev => [...prev, draggedCard]);
            } else {
                setRechargesCards(prev => [...prev, draggedCard]);
            }
            setScore(prev => prev + 1);
            setFeedbackCard({
                id: draggedCard.id,
                correct: true,
                message: draggedCard.explanation,
            });

            // Check completion
            if (score + 1 >= actionCards.length) {
                setTimeout(() => {
                    setCompleted(true);
                    triggerCelebration();
                    setTimeout(() => setShowSummary(true), 1500);
                }, 800);
            }
        } else {
            // Incorrect — bounce back
            setShakeCard(draggedCard.id);
            setFeedbackCard({
                id: draggedCard.id,
                correct: false,
                message: draggedCard.hint,
            });
            setTimeout(() => setShakeCard(null), 600);
        }

        // Clear feedback after delay
        setTimeout(() => setFeedbackCard(null), 3000);
    }, [isDragging, draggedCard, hoveredBin, score, actionCards.length]);

    // Click-based sorting (mobile friendly alternative)
    const [selectedCard, setSelectedCard] = useState<ActionCard | null>(null);

    const handleCardClick = useCallback((card: ActionCard) => {
        setSelectedCard(prev => prev?.id === card.id ? null : card);
    }, []);

    const handleBinClick = useCallback((bin: 'depletes' | 'recharges') => {
        if (!selectedCard) return;

        const isCorrect = selectedCard.category === bin;

        if (isCorrect) {
            setUnsortedCards(prev => prev.filter(c => c.id !== selectedCard.id));
            if (bin === 'depletes') {
                setDepletesCards(prev => [...prev, selectedCard]);
            } else {
                setRechargesCards(prev => [...prev, selectedCard]);
            }
            setScore(prev => prev + 1);
            setFeedbackCard({
                id: selectedCard.id,
                correct: true,
                message: selectedCard.explanation,
            });

            if (score + 1 >= actionCards.length) {
                setTimeout(() => {
                    setCompleted(true);
                    triggerCelebration();
                    setTimeout(() => setShowSummary(true), 1500);
                }, 800);
            }
        } else {
            setShakeCard(selectedCard.id);
            setFeedbackCard({
                id: selectedCard.id,
                correct: false,
                message: selectedCard.hint,
            });
            setTimeout(() => setShakeCard(null), 600);
        }

        setSelectedCard(null);
        setTimeout(() => setFeedbackCard(null), 3000);
    }, [selectedCard, score, actionCards.length]);

    // Mouse/touch event listeners
    useEffect(() => {
        window.addEventListener('mousemove', handleDragMove);
        window.addEventListener('mouseup', handleDragEnd);
        window.addEventListener('touchmove', handleDragMove, { passive: false });
        window.addEventListener('touchend', handleDragEnd);
        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [handleDragMove, handleDragEnd]);

    // ─── CELEBRATION ───
    const triggerCelebration = useCallback(() => {
        const particles: any[] = [];
        const colors = ['#4A4DC9', '#FF7212', '#16A34A', '#FC9145', '#533086', '#C1C1EA'];
        for (let i = 0; i < 40; i++) {
            particles.push({
                id: i,
                x: Math.random() * 100,
                delay: Math.random() * 1.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                duration: Math.random() * 2 + 2,
            });
        }
        setCelebrationParticles(particles);
        setTimeout(() => setCelebrationParticles([]), 4000);
    }, []);

    // ─── RESET ───
    const handleReset = useCallback(() => {
        const shuffled = shuffleArray(actionCards);
        setUnsortedCards(shuffled);
        setDepletesCards([]);
        setRechargesCards([]);
        setScore(0);
        setCompleted(false);
        setShowSummary(false);
        setFeedbackCard(null);
        setSelectedCard(null);
        setCardEntryAnimations({});

        shuffled.forEach((card, index) => {
            setTimeout(() => {
                setCardEntryAnimations(prev => ({ ...prev, [card.id]: true }));
            }, index * 120);
        });
    }, [actionCards]);

    // ─── MODES CONFIG ───
    const modeIcons: { [key in ModeType]: any } = {
        learn: IconBookOpen,
        practice: IconTarget,
        real_world: IconZap,
        hands_on: IconFlaskConical,
    };
    const modeLabels: { [key in ModeType]: string } = {
        learn: 'Learn',
        practice: 'Sort Activity',
        real_world: 'Real World',
        hands_on: 'Hands On',
    };

    // ─── STYLES ───
    const colors = {
        primary: config.themeColor,
        secondary: '#FF7212',
        purple: '#533086',
        orange: '#FC9145',
        lightPurple: '#C1C1EA',
        lightOrange: '#FFF3E4',
        gray: '#4E4E4E',
        lightGray: '#F5F5F5',
        depletes: depletesColor,
        recharges: rechargesColor,
        bg: config.darkMode ? '#1a1a2e' : '#F8F9FE',
        card: config.darkMode ? '#16213e' : '#FFFFFF',
        text: config.darkMode ? '#e2e8f0' : '#1e293b',
        textSecondary: config.darkMode ? '#94a3b8' : '#64748b',
    };

    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            width: config.width,
            maxWidth: '100%',
            minHeight: config.height,
            fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
            background: colors.bg,
            borderRadius: 24,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(74, 77, 201, 0.12)',
            display: 'flex',
            flexDirection: 'column',
        },
        header: {
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.purple} 100%)`,
            padding: '20px 24px 16px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: 700,
            margin: 0,
            letterSpacing: '-0.02em',
        },
        headerSubtitle: {
            fontSize: 13,
            fontWeight: 400,
            opacity: 0.85,
            margin: '4px 0 0',
        },
        modeSelector: {
            display: 'flex',
            gap: 4,
            padding: '0 16px',
            background: config.darkMode ? '#0f0f23' : '#FFFFFF',
            borderBottom: `1px solid ${config.darkMode ? '#2d2d4a' : '#E8E8F4'}`,
        },
        modeTab: {
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: 500,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            borderBottom: '2px solid transparent',
            transition: 'all 0.3s ease',
            fontFamily: "'Poppins', sans-serif",
        },
        modeTabActive: {
            color: colors.primary,
            borderBottomColor: colors.primary,
            fontWeight: 600,
        },
        content: {
            flex: 1,
            padding: 20,
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
        },
        scoreBar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            background: config.darkMode ? '#0f0f2380' : '#F0F1FF',
            borderRadius: 12,
            marginBottom: 16,
        },
        classifierArea: {
            display: 'flex',
            gap: 12,
            minHeight: 380,
        },
        bin: {
            flex: 1,
            borderRadius: 16,
            padding: 12,
            minHeight: 200,
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column' as const,
        },
        binHeader: {
            textAlign: 'center' as const,
            paddingBottom: 10,
            marginBottom: 10,
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: '0.01em',
        },
        centerCards: {
            flex: 1.2,
            display: 'flex',
            flexDirection: 'column' as const,
            gap: 8,
            alignItems: 'center',
            maxHeight: 380,
            overflowY: 'auto' as const,
            padding: '0 4px',
        },
        actionCard: {
            padding: '10px 14px',
            borderRadius: 12,
            background: colors.card,
            cursor: 'grab',
            userSelect: 'none' as const,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: `2px solid ${config.darkMode ? '#2d2d4a' : '#E8E8F4'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            maxWidth: 200,
            fontSize: 12,
            fontWeight: 500,
            fontFamily: "'Poppins', sans-serif",
        },
        sortedCard: {
            padding: '6px 10px',
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: "'Poppins', sans-serif",
            marginBottom: 4,
        },
        navigation: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '12px 20px',
            borderTop: `1px solid ${config.darkMode ? '#2d2d4a' : '#E8E8F4'}`,
        },
        navButton: {
            padding: '8px 16px',
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.3s ease',
            fontFamily: "'Poppins', sans-serif",
            background: `${colors.primary}15`,
            color: colors.primary,
        },
    };

    // ─── RENDER: LEARN MODE CONTENT ───

    // Animated pump SVG scene for step 2
    const renderPumpScene = () => (
        <div style={{
            borderRadius: 16,
            overflow: 'hidden',
            height: 280,
            position: 'relative',
            background: 'linear-gradient(180deg, #87CEEB 0%, #B0D4F1 25%, #87CEEB 25%, #87CEEB 32%, #A0885A 32%, #8B7355 48%, #6B5B3E 48%, #5A4A30 100%)',
            animation: 'fadeInUp 0.6s ease-out',
        }}>
            {/* Sun */}
            <div style={{
                position: 'absolute', top: 10, right: 30,
                width: 36, height: 36, borderRadius: '50%',
                background: 'radial-gradient(circle, #FFD700, #FFA500)',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
                animation: 'pulse 4s ease-in-out infinite',
            }} />

            {/* Clouds */}
            <div style={{ position: 'absolute', top: 12, left: '12%', fontSize: 22, opacity: 0.7, animation: 'float 6s ease-in-out infinite' }}>☁️</div>
            <div style={{ position: 'absolute', top: 20, left: '55%', fontSize: 16, opacity: 0.5, animation: 'float 5s ease-in-out 1s infinite' }}>☁️</div>

            {/* Ground surface line (grass) */}
            <div style={{
                position: 'absolute', top: '32%', left: 0, width: '100%', height: 3,
                background: 'linear-gradient(to right, #4CAF50, #6B8E23, #4CAF50, #6B8E23)',
                opacity: 0.7,
                zIndex: 2,
            }} />
            {/* Small grass patches on the ground line */}
            <div style={{ position: 'absolute', top: 'calc(32% - 4px)', left: '3%', fontSize: 8, zIndex: 3 }}>🌿</div>
            <div style={{ position: 'absolute', top: 'calc(32% - 4px)', left: '22%', fontSize: 7, zIndex: 3 }}>🌿</div>
            <div style={{ position: 'absolute', top: 'calc(32% - 4px)', right: '18%', fontSize: 8, zIndex: 3 }}>🌿</div>

            {/* House — sitting ON the soil surface */}
            <div style={{
                position: 'absolute',
                top: 'calc(32% - 30px)',
                left: '5%',
                fontSize: 28,
                zIndex: 3,
                filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))',
            }}>🏠</div>

            {/* Tree — sitting ON the soil surface */}
            <div style={{
                position: 'absolute',
                top: 'calc(32% - 34px)',
                right: '6%',
                fontSize: 32,
                zIndex: 3,
                filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.15))',
            }}>🌳</div>

            {/* Smaller tree */}
            <div style={{
                position: 'absolute',
                top: 'calc(32% - 24px)',
                right: '22%',
                fontSize: 22,
                zIndex: 3,
                filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.15))',
            }}>🌲</div>

            {/* ════════ PUMP STRUCTURE (SVG overlaid on scene) ════════ */}
            {/* The SVG is sized to span from sky into underground, anchored so the pump base sits on the ground line (32%) */}
            <svg
                viewBox="0 0 300 280"
                preserveAspectRatio="xMidYMid meet"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '70%',
                    height: '100%',
                    overflow: 'visible',
                    zIndex: 4,
                }}
            >
                {/* ═══ UNDERGROUND PIPE ═══ */}
                {/* Outer pipe casing — vertical from pump base into aquifer */}
                <rect x="144" y="96" width="12" height="160" rx="2" fill="#78716C" />
                {/* Inner pipe — lighter */}
                <rect x="147" y="96" width="6" height="160" rx="1" fill="#A8A29E" />
                {/* Animated water flowing UP inside the pipe */}
                <line x1="150" y1="250" x2="150" y2="100"
                    stroke="#3B82F6" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray="8 8"
                    style={{ animation: 'pipeFlowUp 0.5s linear infinite' }}
                />

                {/* ═══ PIPE SCREEN (bottom — in aquifer) ═══ */}
                <rect x="140" y="245" width="20" height="12" rx="3" fill="#6B7280" stroke="#57534E" strokeWidth="0.8" />
                {/* Screen holes */}
                <circle cx="145" cy="249" r="1" fill="#3B82F6" opacity="0.6" />
                <circle cx="150" cy="251" r="1" fill="#3B82F6" opacity="0.6" />
                <circle cx="155" cy="249" r="1" fill="#3B82F6" opacity="0.6" />

                {/* ═══ BUBBLES rising through pipe ═══ */}
                <circle cx="149" cy="220" r="2.5" fill="#93C5FD" opacity="0.7" style={{ animation: 'bubbleRise1 1.8s ease-out infinite' }} />
                <circle cx="152" cy="200" r="2" fill="#BFDBFE" opacity="0.6" style={{ animation: 'bubbleRise2 1.8s ease-out 0.6s infinite' }} />
                <circle cx="148" cy="180" r="1.8" fill="#93C5FD" opacity="0.5" style={{ animation: 'bubbleRise3 1.8s ease-out 1.2s infinite' }} />
                <circle cx="151" cy="160" r="2.2" fill="#BFDBFE" opacity="0.6" style={{ animation: 'bubbleRise1 2s ease-out 0.3s infinite' }} />
                <circle cx="149" cy="140" r="1.5" fill="#93C5FD" opacity="0.4" style={{ animation: 'bubbleRise2 2s ease-out 0.9s infinite' }} />

                {/* ═══ PUMP BASE — concrete pad on ground line ═══ */}
                {/* Ground level is at y≈90 in this viewBox */}
                <rect x="112" y="86" width="76" height="12" rx="3" fill="#D6D3D1" stroke="#A8A29E" strokeWidth="1" />
                {/* Base shadow */}
                <ellipse cx="150" cy="99" rx="38" ry="3" fill="rgba(0,0,0,0.08)" />

                {/* ═══ MOTOR HOUSING — sits on the base ═══ */}
                <g style={{ animation: 'motorVibrate 0.15s linear infinite' }}>
                    {/* Motor body */}
                    <rect x="126" y="52" width="48" height="36" rx="5" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
                    {/* Metallic highlight on motor */}
                    <rect x="130" y="55" width="10" height="28" rx="3" fill="rgba(255,255,255,0.18)" />
                    {/* Motor label plate */}
                    <rect x="141" y="62" width="28" height="12" rx="2" fill="#FEE2E2" stroke="#FECACA" strokeWidth="0.5" />
                    <text x="155" y="71" textAnchor="middle" fontSize="6" fontWeight="700" fill="#991B1B" fontFamily="Poppins, sans-serif">PUMP</text>
                    {/* Motor top cap */}
                    <rect x="132" y="48" width="36" height="6" rx="3" fill="#B91C1C" stroke="#991B1B" strokeWidth="0.5" />
                    {/* Bolts on motor */}
                    <circle cx="134" cy="84" r="2" fill="#A8A29E" stroke="#78716C" strokeWidth="0.5" />
                    <circle cx="166" cy="84" r="2" fill="#A8A29E" stroke="#78716C" strokeWidth="0.5" />
                </g>

                {/* ═══ PUMP HANDLE — pivots from top-right of motor ═══ */}
                <g style={{ transformOrigin: '168px 54px', animation: 'pumpHandleDown 1.6s ease-in-out infinite' }}>
                    {/* Handle arm */}
                    <line x1="168" y1="54" x2="215" y2="38" stroke="#44403C" strokeWidth="5" strokeLinecap="round" />
                    {/* Handle grip */}
                    <rect x="208" y="32" width="16" height="10" rx="4" fill="#57534E" stroke="#44403C" strokeWidth="1" />
                    {/* Pivot bolt */}
                    <circle cx="168" cy="54" r="3.5" fill="#78716C" stroke="#57534E" strokeWidth="1" />
                </g>

                {/* ═══ PISTON ROD — moves up/down inside motor ═══ */}
                <rect x="146" y="75" width="8" height="14" rx="1.5" fill="#78716C" stroke="#57534E" strokeWidth="0.5"
                    style={{ animation: 'pumpPistonMove 1.6s ease-in-out infinite' }}
                />

                {/* ═══ WATER SPOUT — arcs from the left side of motor to ground ═══ */}
                {/* Spout pipe nozzle */}
                <rect x="116" y="64" width="12" height="6" rx="2" fill="#78716C" />
                <circle cx="116" cy="67" r="3.5" fill="#6B7280" stroke="#57534E" strokeWidth="0.5" />

                {/* Animated water stream from nozzle */}
                <path d="M113 67 Q100 60, 90 72 Q82 82, 80 92"
                    stroke="#3B82F6" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7"
                    strokeDasharray="8 16"
                    style={{ animation: 'spoutStream 0.8s linear infinite' }}
                />
                <path d="M113 67 Q98 62, 88 74 Q80 84, 78 94"
                    stroke="#60A5FA" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4"
                    strokeDasharray="6 18"
                    style={{ animation: 'spoutStream 0.8s linear 0.2s infinite' }}
                />

                {/* Water drops falling from the stream arc */}
                <circle cx="95" cy="78" r="2.5" fill="#3B82F6" opacity="0.8" style={{ animation: 'spoutDrop1 1s ease-in infinite' }} />
                <circle cx="88" cy="82" r="2" fill="#60A5FA" opacity="0.7" style={{ animation: 'spoutDrop2 1s ease-in 0.35s infinite' }} />
                <circle cx="82" cy="88" r="2.2" fill="#3B82F6" opacity="0.6" style={{ animation: 'spoutDrop3 1s ease-in 0.7s infinite' }} />

                {/* Splash on ground where water lands */}
                <ellipse cx="80" cy="92" rx="8" ry="3" fill="#3B82F6" opacity="0.25" style={{ animation: 'spoutSplash 1s ease-in-out infinite' }} />
                <ellipse cx="80" cy="92" rx="12" ry="4" fill="#93C5FD" opacity="0.12" style={{ animation: 'spoutSplash 1s ease-in-out 0.3s infinite' }} />

                {/* ═══ DIRECTION ARROWS & LABELS ═══ */}
                {/* Arrow showing water being pulled UP through pipe */}
                <g opacity="0.65">
                    <line x1="165" y1="230" x2="165" y2="110" stroke="#EF4444" strokeWidth="1.2" strokeDasharray="4 4" />
                    <polygon points="165,108 161,116 169,116" fill="#EF4444" />
                </g>
                <text x="178" y="175" fontSize="7" fill="#EF4444" fontWeight="700" fontFamily="Poppins, sans-serif" opacity="0.7" transform="rotate(-90, 178, 175)">WATER PUMPED UP</text>

                {/* Label: spout output */}
                <text x="65" y="60" fontSize="6.5" fill="#1D4ED8" fontWeight="600" fontFamily="Poppins, sans-serif" opacity="0.8">Water out →</text>
            </svg>

            {/* ════════ WATER TABLE (animated sinking) ════════ */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: '15%',
                background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.4) 0%, rgba(30, 64, 175, 0.65) 100%)',
                animation: 'waterTableSink 4s ease-out forwards',
                borderTop: '2px dashed rgba(59, 130, 246, 0.5)',
                zIndex: 1,
            }}>
                {/* Water table label */}
                <div style={{
                    position: 'absolute',
                    top: -22,
                    left: 14,
                    background: 'rgba(220, 38, 38, 0.88)',
                    color: 'white',
                    padding: '2px 10px',
                    borderRadius: 10,
                    fontSize: 9,
                    fontWeight: 700,
                    fontFamily: "'Poppins', sans-serif",
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    zIndex: 5,
                }}>
                    <span style={{ animation: 'warningPulse 1.5s ease-in-out infinite' }}>⚠️</span> Water Table Dropping ↓
                </div>
            </div>

            {/* Layer labels */}
            <div style={{ position: 'absolute', right: 10, top: '34%', color: '#FFF9C4', fontSize: 8, fontWeight: 700, fontFamily: "'Poppins', sans-serif", opacity: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Soil Layer</div>
            <div style={{ position: 'absolute', right: 10, top: '52%', color: '#FFCCBC', fontSize: 8, fontWeight: 700, fontFamily: "'Poppins', sans-serif", opacity: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Rock Layer</div>

            {/* Underground water dots (aquifer) */}
            <div style={{ position: 'absolute', bottom: '6%', left: '20%', fontSize: 7, opacity: 0.5 }}>💧</div>
            <div style={{ position: 'absolute', bottom: '4%', left: '40%', fontSize: 6, opacity: 0.4 }}>💧</div>
            <div style={{ position: 'absolute', bottom: '8%', left: '70%', fontSize: 7, opacity: 0.5 }}>💧</div>
            <div style={{ position: 'absolute', bottom: '3%', left: '85%', fontSize: 5, opacity: 0.3 }}>💧</div>
        </div>
    );

    // Default cross-section for other learn steps
    const renderDefaultCrossSection = () => (
        <div style={{
            borderRadius: 16,
            overflow: 'hidden',
            height: 200,
            position: 'relative',
            background: 'linear-gradient(180deg, #87CEEB 0%, #87CEEB 30%, #8B7355 30%, #8B7355 45%, #6B5B3E 45%, #6B5B3E 100%)',
        }}>
            {/* Ground surface line (grass) */}
            <div style={{
                position: 'absolute', top: '30%', left: 0, width: '100%', height: 3,
                background: 'linear-gradient(to right, #4CAF50, #6B8E23, #4CAF50, #6B8E23)',
                opacity: 0.7,
                zIndex: 2,
            }} />
            {/* Grass patches */}
            <div style={{ position: 'absolute', top: 'calc(30% - 4px)', left: '5%', fontSize: 8, zIndex: 3 }}>🌿</div>
            <div style={{ position: 'absolute', top: 'calc(30% - 4px)', left: '28%', fontSize: 7, zIndex: 3 }}>🌿</div>
            <div style={{ position: 'absolute', top: 'calc(30% - 4px)', left: '50%', fontSize: 8, zIndex: 3 }}>🌿</div>
            <div style={{ position: 'absolute', top: 'calc(30% - 4px)', right: '10%', fontSize: 7, zIndex: 3 }}>🌿</div>

            {/* Tree 1 — sitting ON the soil surface */}
            <div style={{
                position: 'absolute',
                top: 'calc(30% - 34px)',
                left: '12%',
                fontSize: 32,
                zIndex: 3,
                filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.15))',
            }}>🌳</div>

            {/* Tree 2 (conifer) — sitting ON the soil surface */}
            <div style={{
                position: 'absolute',
                top: 'calc(30% - 26px)',
                left: '33%',
                fontSize: 24,
                zIndex: 3,
                filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.15))',
            }}>🌲</div>

            {/* Tree 3 — sitting ON the soil surface */}
            <div style={{
                position: 'absolute',
                top: 'calc(30% - 32px)',
                left: '57%',
                fontSize: 30,
                zIndex: 3,
                filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.15))',
            }}>🌳</div>

            {/* House — sitting ON the soil surface */}
            <div style={{
                position: 'absolute',
                top: 'calc(30% - 24px)',
                right: '12%',
                fontSize: 22,
                zIndex: 3,
                filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))',
            }}>🏠</div>

            {/* Sky area — clouds and rain */}
            <div style={{ position: 'absolute', top: 0, width: '100%', height: '30%' }}>
                {/* Clouds */}
                <div style={{ position: 'absolute', top: 6, left: '20%', fontSize: 16, opacity: 0.5, animation: 'float 5s ease-in-out infinite' }}>☁️</div>
                <div style={{ position: 'absolute', top: 8, left: '65%', fontSize: 14, opacity: 0.4, animation: 'float 6s ease-in-out 1.5s infinite' }}>☁️</div>

                {/* Rain for steps 4+ */}
                {currentStep && currentStep.id >= 4 && (
                    <>
                        <div style={{ position: 'absolute', top: 5, left: '25%', fontSize: 14, animation: 'float 2s ease-in-out infinite' }}>💧</div>
                        <div style={{ position: 'absolute', top: 10, left: '45%', fontSize: 12, animation: 'float 2s ease-in-out 0.5s infinite' }}>💧</div>
                        <div style={{ position: 'absolute', top: 3, left: '70%', fontSize: 14, animation: 'float 2s ease-in-out 1s infinite' }}>💧</div>
                    </>
                )}
            </div>

            {/* Water table */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: currentStep && currentStep.id <= 3 ? '25%' : '40%',
                background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.5) 0%, rgba(30, 64, 175, 0.7) 100%)',
                transition: 'height 1.5s ease-in-out',
                borderTop: '2px dashed rgba(59, 130, 246, 0.5)',
            }}>
                <div style={{
                    position: 'absolute',
                    top: -20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    padding: '2px 10px',
                    borderRadius: 10,
                    fontSize: 10,
                    fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                    whiteSpace: 'nowrap',
                }}>
                    Water Table Level
                </div>
            </div>
            {/* Layers label */}
            <div style={{ position: 'absolute', right: 10, top: '32%', color: '#FFF9C4', fontSize: 9, fontWeight: 600, fontFamily: "'Poppins', sans-serif", opacity: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>Soil Layer</div>
            <div style={{ position: 'absolute', right: 10, top: '50%', color: '#FFCCBC', fontSize: 9, fontWeight: 600, fontFamily: "'Poppins', sans-serif", opacity: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>Rock Layer</div>
        </div>
    );

    const renderLearnContent = () => {
        if (!currentStep) return null;
        return (
            <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                <div style={{
                    background: `linear-gradient(135deg, ${colors.primary}08, ${colors.lightPurple}30)`,
                    borderRadius: 16,
                    padding: 24,
                    marginBottom: 16,
                    border: `1px solid ${colors.lightPurple}50`,
                }}>
                    <h3 style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: colors.text,
                        margin: '0 0 12px',
                        fontFamily: "'Poppins', sans-serif",
                    }}>
                        {currentStep.title}
                    </h3>
                    <p style={{
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: colors.textSecondary,
                        margin: 0,
                        fontFamily: "'Poppins', sans-serif",
                    }}>
                        {currentStep.description}
                    </p>
                </div>

                {/* Step-aware illustration */}
                {currentStep.id === 2 ? renderPumpScene() : renderDefaultCrossSection()}
            </div>
        );
    };

    // ─── RENDER: CLASSIFIER (PRACTICE / HANDS-ON) ───
    const renderClassifier = () => (
        <div ref={containerRef}>
            {/* Score Bar */}
            <div style={styles.scoreBar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <IconDroplets size={18} color={colors.primary} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, fontFamily: "'Poppins', sans-serif" }}>
                        Score: {score}/{actionCards.length}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {/* Progress dots */}
                    {actionCards.map((_, i) => (
                        <div key={i} style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: i < score ? colors.recharges : `${colors.primary}25`,
                            transition: 'all 0.4s ease',
                            transform: i < score ? 'scale(1.2)' : 'scale(1)',
                        }} />
                    ))}
                </div>
                <button
                    onClick={handleReset}
                    style={{
                        ...styles.navButton,
                        padding: '6px 12px',
                        fontSize: 12,
                        background: `${colors.secondary}15`,
                        color: colors.secondary,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                    <IconRotateCcw size={14} /> Reset
                </button>
            </div>

            {/* Instructions */}
            {!completed && (
                <div style={{
                    textAlign: 'center',
                    marginBottom: 12,
                    padding: '8px 16px',
                    background: `linear-gradient(135deg, ${colors.lightPurple}30, ${colors.lightOrange}50)`,
                    borderRadius: 10,
                    fontSize: 12,
                    color: colors.textSecondary,
                    fontFamily: "'Poppins', sans-serif",
                    animation: 'fadeInDown 0.5s ease-out',
                }}>
                    👆 Tap a card, then tap the correct category bin to sort it! (Or drag & drop)
                </div>
            )}

            {/* Feedback Banner */}
            {feedbackCard && (
                <div style={{
                    padding: '10px 16px',
                    borderRadius: 12,
                    marginBottom: 12,
                    background: feedbackCard.correct
                        ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)'
                        : 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                    border: `1px solid ${feedbackCard.correct ? '#bbf7d0' : '#fecaca'}`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    animation: 'popIn 0.4s ease-out',
                    fontFamily: "'Poppins', sans-serif",
                }}>
                    <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: feedbackCard.correct ? colors.recharges : colors.depletes,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: 1,
                    }}>
                        {feedbackCard.correct ? <IconCheck size={14} color="white" /> : <IconX size={14} color="white" />}
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 12, color: feedbackCard.correct ? '#166534' : '#991b1b', marginBottom: 2 }}>
                            {feedbackCard.correct ? 'Correct! ✨' : 'Not quite! 🤔'}
                        </div>
                        <div style={{ fontSize: 11, color: feedbackCard.correct ? '#15803d' : '#dc2626', lineHeight: 1.5 }}>
                            {feedbackCard.message}
                        </div>
                    </div>
                </div>
            )}

            {/* Classifier Area */}
            {!showSummary ? (
                <div style={styles.classifierArea}>
                    {/* DEPLETES BIN - LEFT */}
                    <div
                        style={{
                            ...styles.bin,
                            background: hoveredBin === 'depletes'
                                ? `${colors.depletes}18`
                                : `${colors.depletes}08`,
                            border: `2px dashed ${hoveredBin === 'depletes' ? colors.depletes : `${colors.depletes}40`}`,
                            transform: hoveredBin === 'depletes' ? 'scale(1.02)' : 'scale(1)',
                        }}
                        onClick={() => handleBinClick('depletes')}
                    >
                        <div style={{
                            ...styles.binHeader,
                            color: colors.depletes,
                            borderBottom: `2px solid ${colors.depletes}30`,
                        }}>
                            <div style={{ fontSize: 22, marginBottom: 4 }}>📉</div>
                            {depletesLabel}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {depletesCards.map((card, idx) => (
                                <div key={card.id} style={{
                                    ...styles.sortedCard,
                                    background: `${colors.depletes}10`,
                                    border: `1px solid ${colors.depletes}30`,
                                    color: colors.depletes,
                                    animation: `dropIn 0.4s ease-out ${idx * 0.1}s both`,
                                }}>
                                    <IconCheck size={12} /> <span style={{ fontSize: 11 }}>{card.icon}</span> {card.label}
                                </div>
                            ))}
                        </div>
                        {depletesCards.length === 0 && (
                            <div style={{
                                textAlign: 'center',
                                color: `${colors.depletes}50`,
                                fontSize: 11,
                                padding: 20,
                                fontFamily: "'Poppins', sans-serif",
                            }}>
                                Drop harmful actions here
                            </div>
                        )}
                    </div>

                    {/* CENTER - UNSORTED CARDS */}
                    <div style={styles.centerCards}>
                        <div style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: colors.textSecondary,
                            marginBottom: 6,
                            textAlign: 'center',
                            fontFamily: "'Poppins', sans-serif",
                        }}>
                            {unsortedCards.length > 0 ? `${unsortedCards.length} cards remaining` : '🎉 All sorted!'}
                        </div>
                        {unsortedCards.map((card) => (
                            <div
                                key={card.id}
                                onMouseDown={(e) => handleDragStart(e, card)}
                                onTouchStart={(e) => handleDragStart(e, card)}
                                onClick={() => handleCardClick(card)}
                                style={{
                                    ...styles.actionCard,
                                    opacity: cardEntryAnimations[card.id] ? 1 : 0,
                                    transform: cardEntryAnimations[card.id]
                                        ? (selectedCard?.id === card.id ? 'scale(1.05)' : 'scale(1)')
                                        : 'scale(0.8) translateY(20px)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    animation: shakeCard === card.id ? 'shakeX 0.5s ease-out' : undefined,
                                    borderColor: selectedCard?.id === card.id
                                        ? colors.primary
                                        : `${colors.lightPurple}80`,
                                    boxShadow: selectedCard?.id === card.id
                                        ? `0 4px 16px ${colors.primary}30`
                                        : '0 2px 8px rgba(0,0,0,0.06)',
                                    background: selectedCard?.id === card.id
                                        ? `${colors.primary}08`
                                        : colors.card,
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedCard?.id !== card.id) {
                                        e.currentTarget.style.transform = 'scale(1.03) translateY(-2px)';
                                        e.currentTarget.style.boxShadow = `0 6px 20px ${colors.primary}20`;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedCard?.id !== card.id) {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                                    }
                                }}
                            >
                                <span style={{ fontSize: 16 }}>{card.icon}</span>
                                <span style={{ color: colors.text, lineHeight: 1.3 }}>{card.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* RECHARGES BIN - RIGHT */}
                    <div
                        style={{
                            ...styles.bin,
                            background: hoveredBin === 'recharges'
                                ? `${colors.recharges}18`
                                : `${colors.recharges}08`,
                            border: `2px dashed ${hoveredBin === 'recharges' ? colors.recharges : `${colors.recharges}40`}`,
                            transform: hoveredBin === 'recharges' ? 'scale(1.02)' : 'scale(1)',
                        }}
                        onClick={() => handleBinClick('recharges')}
                    >
                        <div style={{
                            ...styles.binHeader,
                            color: colors.recharges,
                            borderBottom: `2px solid ${colors.recharges}30`,
                        }}>
                            <div style={{ fontSize: 22, marginBottom: 4 }}>📈</div>
                            {rechargesLabel}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {rechargesCards.map((card, idx) => (
                                <div key={card.id} style={{
                                    ...styles.sortedCard,
                                    background: `${colors.recharges}10`,
                                    border: `1px solid ${colors.recharges}30`,
                                    color: colors.recharges,
                                    animation: `dropIn 0.4s ease-out ${idx * 0.1}s both`,
                                }}>
                                    <IconCheck size={12} /> <span style={{ fontSize: 11 }}>{card.icon}</span> {card.label}
                                </div>
                            ))}
                        </div>
                        {rechargesCards.length === 0 && (
                            <div style={{
                                textAlign: 'center',
                                color: `${colors.recharges}50`,
                                fontSize: 11,
                                padding: 20,
                                fontFamily: "'Poppins', sans-serif",
                            }}>
                                Drop helpful actions here
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                // ─── COMPLETION SUMMARY ───
                renderSummary()
            )}

            {/* Drag ghost */}
            {isDragging && draggedCard && (
                <div style={{
                    position: 'fixed',
                    left: dragPosition.x - 80,
                    top: dragPosition.y - 25,
                    width: 160,
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: colors.card,
                    border: `2px solid ${colors.primary}`,
                    boxShadow: `0 12px 30px ${colors.primary}30`,
                    fontSize: 12,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    pointerEvents: 'none',
                    zIndex: 9999,
                    transform: 'rotate(-3deg) scale(1.05)',
                    fontFamily: "'Poppins', sans-serif",
                    color: colors.text,
                }}>
                    <span style={{ fontSize: 16 }}>{draggedCard.icon}</span>
                    {draggedCard.label}
                </div>
            )}

            {/* Celebration particles */}
            {celebrationParticles.map(p => (
                <div key={p.id} style={{
                    position: 'absolute',
                    left: `${p.x}%`,
                    top: -10,
                    width: p.size,
                    height: p.size,
                    borderRadius: p.id % 2 === 0 ? '50%' : '2px',
                    background: p.color,
                    animation: `confetti ${p.duration}s ease-out ${p.delay}s forwards`,
                    pointerEvents: 'none',
                    zIndex: 100,
                }} />
            ))}
        </div>
    );

    // ─── RENDER: SUMMARY ───
    const renderSummary = () => (
        <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            {/* Celebration Header */}
            <div style={{
                textAlign: 'center',
                padding: '20px 0 16px',
                animation: 'popIn 0.6s ease-out',
            }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
                <h3 style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: colors.primary,
                    margin: 0,
                    fontFamily: "'Poppins', sans-serif",
                }}>
                    Excellent Work!
                </h3>
                <p style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                    margin: '6px 0 0',
                    fontFamily: "'Poppins', sans-serif",
                }}>
                    You correctly sorted all {actionCards.length} actions! 🌟
                </p>
            </div>

            {/* Split Screen Summary */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                {/* Depletes Side */}
                <div style={{
                    flex: 1,
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: `2px solid ${colors.depletes}30`,
                    animation: 'slideInLeft 0.5s ease-out 0.2s both',
                }}>
                    <div style={{
                        background: `linear-gradient(135deg, ${colors.depletes}, #991b1b)`,
                        color: 'white',
                        padding: '10px 14px',
                        fontWeight: 700,
                        fontSize: 12,
                        textAlign: 'center',
                        fontFamily: "'Poppins', sans-serif",
                    }}>
                        ⚠️ Depletes Groundwater
                    </div>
                    {/* Cross section - depleted */}
                    {showCrossSection && (
                        <div style={{
                            height: 80,
                            background: 'linear-gradient(180deg, #fef2f2 0%, #fef2f2 30%, #8B7355 30%, #6B5B3E 100%)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            {/* Ground line */}
                            <div style={{ position: 'absolute', top: '30%', left: 0, width: '100%', height: 2, background: '#6B8E23', opacity: 0.5, zIndex: 2 }} />
                            {/* Dead tree stump on ground */}
                            <div style={{ position: 'absolute', top: 'calc(30% - 12px)', left: '15%', fontSize: 11, zIndex: 3 }}>🪵</div>
                            {/* Concrete building on ground */}
                            <div style={{ position: 'absolute', top: 'calc(30% - 14px)', right: '15%', fontSize: 13, zIndex: 3 }}>🏗️</div>
                            {/* Factory on ground */}
                            <div style={{ position: 'absolute', top: 'calc(30% - 14px)', left: '50%', transform: 'translateX(-50%)', fontSize: 13, zIndex: 3 }}>🏭</div>
                            {/* Water table - low */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                height: '20%',
                                background: `linear-gradient(180deg, ${colors.depletes}40, ${colors.depletes}60)`,
                                borderTop: '1px dashed rgba(220,38,38,0.4)',
                                transition: 'height 1s ease',
                            }} />
                            <div style={{
                                position: 'absolute',
                                top: 4,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: 9,
                                color: '#991b1b',
                                fontWeight: 600,
                                fontFamily: "'Poppins', sans-serif",
                                background: 'rgba(255,255,255,0.8)',
                                padding: '1px 6px',
                                borderRadius: 6,
                                whiteSpace: 'nowrap',
                                zIndex: 4,
                            }}>
                                ↓ Low Water Table
                            </div>
                        </div>
                    )}
                    <div style={{ padding: 10 }}>
                        {depletesCards.map((card, idx) => (
                            <div key={card.id} style={{
                                padding: '6px 8px',
                                fontSize: 11,
                                color: '#991b1b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                borderBottom: idx < depletesCards.length - 1 ? '1px solid #fee2e2' : 'none',
                                fontFamily: "'Poppins', sans-serif",
                                animation: `fadeInUp 0.3s ease-out ${idx * 0.1}s both`,
                            }}>
                                <span>{card.icon}</span> {card.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recharges Side */}
                <div style={{
                    flex: 1,
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: `2px solid ${colors.recharges}30`,
                    animation: 'slideInRight 0.5s ease-out 0.2s both',
                }}>
                    <div style={{
                        background: `linear-gradient(135deg, ${colors.recharges}, #15803d)`,
                        color: 'white',
                        padding: '10px 14px',
                        fontWeight: 700,
                        fontSize: 12,
                        textAlign: 'center',
                        fontFamily: "'Poppins', sans-serif",
                    }}>
                        ✅ Recharges Groundwater
                    </div>
                    {/* Cross section - recharged */}
                    {showCrossSection && (
                        <div style={{
                            height: 80,
                            background: 'linear-gradient(180deg, #f0fdf4 0%, #f0fdf4 30%, #8B7355 30%, #6B5B3E 100%)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            {/* Ground line */}
                            <div style={{ position: 'absolute', top: '30%', left: 0, width: '100%', height: 2, background: '#4CAF50', opacity: 0.6, zIndex: 2 }} />
                            {/* Tree on ground */}
                            <div style={{ position: 'absolute', top: 'calc(30% - 14px)', left: '12%', fontSize: 13, zIndex: 3 }}>🌳</div>
                            {/* Another tree on ground */}
                            <div style={{ position: 'absolute', top: 'calc(30% - 12px)', left: '45%', fontSize: 11, zIndex: 3 }}>🌲</div>
                            {/* Rain collector on ground */}
                            <div style={{ position: 'absolute', top: 'calc(30% - 12px)', right: '12%', fontSize: 11, zIndex: 3 }}>🏠</div>
                            {/* Rain drops */}
                            <div style={{ position: 'absolute', top: 2, left: '30%', fontSize: 7, animation: 'float 1.5s ease-in-out infinite' }}>💧</div>
                            <div style={{ position: 'absolute', top: 4, left: '60%', fontSize: 6, animation: 'float 1.5s ease-in-out 0.5s infinite' }}>💧</div>
                            {/* Water table - high */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                height: '65%',
                                background: `linear-gradient(180deg, ${colors.recharges}40, ${colors.recharges}60)`,
                                borderTop: '1px dashed rgba(22,163,74,0.4)',
                                transition: 'height 1s ease',
                            }} />
                            <div style={{
                                position: 'absolute',
                                top: 4,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: 9,
                                color: '#166534',
                                fontWeight: 600,
                                fontFamily: "'Poppins', sans-serif",
                                background: 'rgba(255,255,255,0.8)',
                                padding: '1px 6px',
                                borderRadius: 6,
                                whiteSpace: 'nowrap',
                                zIndex: 4,
                            }}>
                                ↑ High Water Table
                            </div>
                        </div>
                    )}
                    <div style={{ padding: 10 }}>
                        {rechargesCards.map((card, idx) => (
                            <div key={card.id} style={{
                                padding: '6px 8px',
                                fontSize: 11,
                                color: '#166534',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                borderBottom: idx < rechargesCards.length - 1 ? '1px solid #dcfce7' : 'none',
                                fontFamily: "'Poppins', sans-serif",
                                animation: `fadeInUp 0.3s ease-out ${idx * 0.1}s both`,
                            }}>
                                <span>{card.icon}</span> {card.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Key Insight */}
            <div style={{
                background: `linear-gradient(135deg, ${colors.lightPurple}30, ${colors.lightOrange}40)`,
                borderRadius: 12,
                padding: 16,
                textAlign: 'center',
                animation: 'fadeInUp 0.5s ease-out 0.5s both',
            }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: colors.primary, marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>
                    💡 Key Insight
                </div>
                <p style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    margin: 0,
                    lineHeight: 1.6,
                    fontFamily: "'Poppins', sans-serif",
                }}>
                    All helpful actions share one thing in common: <strong style={{ color: colors.recharges }}>they help water seep into the ground</strong> (infiltration).
                    Whether it's tree roots creating channels, open soil allowing percolation, or check dams slowing water down — the key is enabling water to reach underground aquifers!
                </p>
            </div>

            {/* Try Again Button */}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button
                    onClick={handleReset}
                    style={{
                        padding: '10px 28px',
                        borderRadius: 12,
                        border: 'none',
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: 'pointer',
                        fontFamily: "'Poppins', sans-serif",
                        transition: 'all 0.3s ease',
                        boxShadow: `0 4px 16px ${colors.primary}40`,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                    <IconRotateCcw size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Try Again
                </button>
            </div>
        </div>
    );

    // ─── RENDER: REAL WORLD ───
    const renderRealWorld = () => {
        if (!currentStep) return null;
        return (
            <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                <div style={{
                    background: `linear-gradient(135deg, ${colors.lightOrange}80, #fff7ed)`,
                    borderRadius: 16,
                    padding: 24,
                    border: `1px solid ${colors.orange}30`,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: `${colors.secondary}20`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 18,
                        }}>
                            🇮🇳
                        </div>
                        <h3 style={{
                            fontSize: 17,
                            fontWeight: 700,
                            color: colors.text,
                            margin: 0,
                            fontFamily: "'Poppins', sans-serif",
                        }}>
                            {currentStep.title}
                        </h3>
                    </div>
                    <p style={{
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: colors.textSecondary,
                        margin: 0,
                        fontFamily: "'Poppins', sans-serif",
                    }}>
                        {currentStep.description}
                    </p>
                </div>
            </div>
        );
    };

    // ─── MAIN RENDER ───
    const renderContent = () => {
        switch (selectedMode) {
            case 'learn':
                return renderLearnContent();
            case 'practice':
            case 'hands_on':
                return renderClassifier();
            case 'real_world':
                return renderRealWorld();
            default:
                return renderClassifier();
        }
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: -20,
                    left: '30%',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                    }}>
                        💧
                    </div>
                    <div>
                        <h2 style={styles.headerTitle}>Groundwater Depletion & Rainwater Harvesting</h2>
                        <p style={styles.headerSubtitle}>Grade 7 Science — Interactive Classification Activity</p>
                    </div>
                </div>
            </div>

            {/* Mode Selector */}
            {config.showModeSelector && (
                <div style={styles.modeSelector}>
                    {config.enabledModes.map(mode => {
                        const Icon = modeIcons[mode];
                        const isActive = selectedMode === mode;
                        return (
                            <button
                                key={mode}
                                onClick={() => handleModeChange(mode)}
                                style={{
                                    ...styles.modeTab,
                                    ...(isActive ? styles.modeTabActive : {}),
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) e.currentTarget.style.color = colors.primary;
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) e.currentTarget.style.color = colors.textSecondary;
                                }}
                            >
                                <Icon size={14} />
                                {modeLabels[mode]}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Content */}
            <div style={styles.content}>
                {renderContent()}
            </div>

            {/* Navigation (for learn / real_world modes) */}
            {config.showNavigation && (selectedMode === 'learn' || selectedMode === 'real_world') && (
                <div style={styles.navigation}>
                    <button
                        onClick={handlePrev}
                        disabled={currentStepIndex === 0}
                        style={{
                            ...styles.navButton,
                            opacity: currentStepIndex === 0 ? 0.4 : 1,
                            cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
                        }}
                    >
                        <IconChevronLeft size={16} /> Previous
                    </button>

                    {config.showStepIndicator && (
                        <span style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: colors.textSecondary,
                            padding: '4px 12px',
                            background: `${colors.primary}10`,
                            borderRadius: 8,
                            fontFamily: "'Poppins', sans-serif",
                        }}>
                            {currentStepIndex + 1} / {filteredSteps.length}
                        </span>
                    )}

                    <button
                        onClick={handleNext}
                        disabled={currentStepIndex >= filteredSteps.length - 1}
                        style={{
                            ...styles.navButton,
                            opacity: currentStepIndex >= filteredSteps.length - 1 ? 0.4 : 1,
                            cursor: currentStepIndex >= filteredSteps.length - 1 ? 'not-allowed' : 'pointer',
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
                            color: 'white',
                        }}
                    >
                        Next <IconChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default GroundwaterActionClassifier;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT CODE END
// ═══════════════════════════════════════════════════════════════════════════