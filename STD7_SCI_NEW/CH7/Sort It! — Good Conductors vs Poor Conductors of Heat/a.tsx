// @ts-expect-error - React types should be available at runtime
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// INLINE SVG ICONS (replaces lucide-react)
// ═══════════════════════════════════════════════════════════════════════════

const Icon = ({ d, size = 18, color = 'currentColor', style = {} }: { d: string; size?: number; color?: string; style?: React.CSSProperties }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}>{d.split('|').map((p, i) => <path key={i} d={p} />)}</svg>
);

const Play = ({ size = 18, color, style }: any) => <Icon d="M6 3l14 9-14 9V3z" size={size} color={color} style={style} />;
const Pause = ({ size = 18, color, style }: any) => <Icon d="M6 4h4v16H6V4z|M14 4h4v16h-4V4z" size={size} color={color} style={style} />;
const ChevronLeft = ({ size = 18, color, style }: any) => <Icon d="M15 18l-6-6 6-6" size={size} color={color} style={style} />;
const ChevronRight = ({ size = 18, color, style }: any) => <Icon d="M9 18l6-6-6-6" size={size} color={color} style={style} />;
const RotateCcw = ({ size = 18, color, style }: any) => <Icon d="M1 4v6h6|M3.51 15a9 9 0 1 0 2.13-9.36L1 10" size={size} color={color} style={style} />;
const Check = ({ size = 18, color, style }: any) => <Icon d="M20 6L9 17l-5-5" size={size} color={color} style={style} />;
const X = ({ size = 18, color, style }: any) => <Icon d="M18 6L6 18|M6 6l12 12" size={size} color={color} style={style} />;
const BookOpen = ({ size = 18, color, style }: any) => <Icon d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z|M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" size={size} color={color} style={style} />;
const Target = ({ size = 18, color, style }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}>
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
);
const FlaskConical = ({ size = 18, color, style }: any) => <Icon d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2|M8.5 2h7" size={size} color={color} style={style} />;
const Zap = ({ size = 18, color, style }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);
const Star = ({ size = 18, color, style }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);
const Award = ({ size = 18, color, style }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}>
        <circle cx="12" cy="8" r="7" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

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

interface Pin {
    id: string;
    label: string;
    xPosition: number;
    fallOrder: number;
    color: string;
}

interface Material {
    id: string;
    name: string;
    type: 'conductor' | 'insulator';
    color: string;
    emoji: string;
    conductivity?: number;
}

interface Question {
    id: number;
    type: 'mcq' | 'true-false' | 'fill-blank' | 'match' | 'ordering' | 'classify';
    question: string;
    options?: string[];
    correctAnswer: string | string[];
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
}

interface Application {
    id: number;
    title: string;
    category: string;
    description: string;
    howItWorks: string;
    conductor: string;
    insulator: string;
    scienceBehind: string;
    realExample: string;
    benefits: string[];
    difficulty: 'everyday' | 'industrial' | 'advanced';
}

interface HeatConductionAdditionalProps {
    numberOfPins?: number;
    customPins?: Pin[];
    maxHeatIntensity?: number;
    heatSpeed?: number;
    customMaterials?: Material[];
    customQuestions?: Question[];
    customApplications?: Application[];
    showLabels?: boolean;
    showHeatVisualization?: boolean;
    enableDragDrop?: boolean;
    rodMaterial?: string;
    showMolecularView?: boolean;
    [key: string]: any;
}

interface HeatConductionToolProps {
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
        additionalProps?: HeatConductionAdditionalProps;
    };
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// EASING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// SINGULARITY DESIGN SYSTEM COLORS
// ═══════════════════════════════════════════════════════════════════════════

const DESIGN = {
    primary: '#4A4DC9',
    accent: '#FF7212',
    gradientStart: '#533086',
    gradientEnd: '#FC9145',
    lightPurple: '#C1C1EA',
    lightOrange: '#FFF3E4',
    darkText: '#1A1A2E',
    grayDark: '#4E4E4E',
    grayMid: '#CACACA',
    grayLight: '#EBEBEB',
    grayLightest: '#F5F5F5',
    white: '#FFFFFF',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    font: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
};

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT STEPS
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_STEPS: StepDataInterface[] = [
    // LEARN MODE
    {
        id: 1,
        title: 'What is Heat Conduction?',
        description: 'Heat conduction is the transfer of thermal energy through direct contact between particles. When one end of a material is heated, molecules vibrate faster and pass energy to neighbors!',
        type: 'intro',
        mode: 'learn',
    },
    {
        id: 2,
        title: 'The Wax-Pin Experiment',
        description: 'Pins are attached to a metal rod with wax. When we heat one end, heat travels along the rod, melting the wax. The pin closest to the flame falls first!',
        type: 'explanation',
        mode: 'learn',
        data: { showExperiment: true },
    },
    {
        id: 3,
        title: 'Conductors vs Insulators',
        description: 'Conductors (metals like copper, aluminum) transfer heat quickly. Insulators (wood, plastic, glass) slow down or block heat transfer. Test materials below!',
        type: 'explanation',
        mode: 'learn',
        data: { showMaterials: true },
    },
    {
        id: 4,
        title: 'Why Do Metals Conduct Heat?',
        description: 'Metals have free electrons that move easily, carrying energy quickly through the material. Insulators have tightly bound electrons, making heat transfer slow.',
        type: 'explanation',
        mode: 'learn',
        data: { showMolecular: true },
    },
    {
        id: 5,
        title: 'Rate of Conduction',
        description: 'The rate of heat conduction depends on: the material type, the temperature difference, the cross-sectional area, and the length of the material.',
        type: 'explanation',
        mode: 'learn',
    },

    // PRACTICE MODE
    {
        id: 10,
        title: 'What is Conduction?',
        description: '',
        type: 'practice',
        mode: 'practice',
        data: {
            question: 'What is conduction?',
            options: [
                'Transfer of heat through direct contact',
                'Transfer of heat through air currents',
                'Transfer of heat through electromagnetic waves',
                'Transfer of heat through vacuum',
            ],
            correctAnswer: 'Transfer of heat through direct contact',
            explanation: 'Conduction is the transfer of thermal energy through direct contact between particles of matter.',
            points: 10,
            difficulty: 'easy',
        },
    },
    {
        id: 11,
        title: 'Metals and Heat',
        description: '',
        type: 'practice',
        mode: 'practice',
        data: {
            question: 'Metals are good conductors of heat.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            explanation: 'Metals have free electrons that allow heat to transfer quickly through the material.',
            points: 10,
            difficulty: 'easy',
        },
    },
    {
        id: 12,
        title: 'Best Conductor',
        description: '',
        type: 'practice',
        mode: 'practice',
        data: {
            question: 'Which material is the best conductor of heat?',
            options: ['Wood', 'Plastic', 'Copper', 'Rubber'],
            correctAnswer: 'Copper',
            explanation: 'Copper is one of the best heat conductors due to its atomic structure and abundance of free electrons.',
            points: 15,
            difficulty: 'medium',
        },
    },
    {
        id: 13,
        title: 'Pin Fall Order',
        description: '',
        type: 'practice',
        mode: 'practice',
        data: {
            question: 'In the wax-pin experiment, which pin falls first?',
            options: [
                'The pin farthest from the flame',
                'The pin closest to the flame',
                'All pins fall at the same time',
                'The middle pin',
            ],
            correctAnswer: 'The pin closest to the flame',
            explanation: 'Heat travels through the rod from the heated end. The pin nearest the flame receives heat first, so its wax melts first.',
            points: 15,
            difficulty: 'medium',
        },
    },
    {
        id: 14,
        title: 'Insulator Purpose',
        description: '',
        type: 'practice',
        mode: 'practice',
        data: {
            question: 'Why do cooking pots have wooden or plastic handles?',
            options: [
                'Because they look better',
                'Because they are cheaper',
                'Because they are insulators that prevent heat transfer to your hand',
                'Because they are lighter',
            ],
            correctAnswer: 'Because they are insulators that prevent heat transfer to your hand',
            explanation: 'Wood and plastic are poor conductors (insulators), so they prevent the heat from the pot from burning your hand.',
            points: 20,
            difficulty: 'hard',
        },
    },

    // REAL WORLD MODE
    {
        id: 20,
        title: 'Cooking Utensils',
        description: 'Metal pots and pans with insulated handles demonstrate conduction perfectly. The metal body efficiently conducts heat from the stove to cook food, while wooden or plastic handles stay cool.',
        type: 'real_world',
        mode: 'real_world',
        data: {
            category: 'Kitchen',
            conductor: 'Aluminum/Steel body',
            insulator: 'Wooden/Plastic handle',
            benefits: ['Efficient cooking', 'Safety', 'Energy saving'],
        },
    },
    {
        id: 21,
        title: 'Building Insulation',
        description: 'Homes use foam or fiberglass insulation in walls. These materials trap air pockets that slow down heat conduction, keeping homes warm in winter and cool in summer.',
        type: 'real_world',
        mode: 'real_world',
        data: {
            category: 'Architecture',
            conductor: 'Metal framing (structural)',
            insulator: 'Foam/Fiberglass insulation',
            benefits: ['Energy efficiency', 'Cost savings', 'Comfort'],
        },
    },
    {
        id: 22,
        title: 'Computer Heat Sinks',
        description: 'CPUs generate intense heat. Copper or aluminum heat sinks conduct heat away from the processor, while thermal paste fills microscopic gaps to maximize heat transfer.',
        type: 'real_world',
        mode: 'real_world',
        data: {
            category: 'Technology',
            conductor: 'Copper/Aluminum heat sink',
            insulator: 'Plastic casing',
            benefits: ['Prevents overheating', 'Extends lifespan', 'Better performance'],
        },
    },

    // HANDS ON MODE
    {
        id: 30,
        title: 'Build Your Experiment',
        description: 'Drag materials to the test zone and observe how heat travels through them. Compare conductors and insulators side by side!',
        type: 'hands_on',
        mode: 'hands_on',
        data: { interactive: true },
    },
    {
        id: 31,
        title: 'Classify Materials',
        description: 'Sort the materials into conductors and insulators by dragging them into the correct category!',
        type: 'hands_on',
        mode: 'hands_on',
        data: { classify: true },
    },
];

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT DATA
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_PINS: Pin[] = [
    { id: 'pin1', label: 'I', xPosition: 360, fallOrder: 1, color: '#EF4444' },
    { id: 'pin2', label: 'II', xPosition: 290, fallOrder: 2, color: '#F97316' },
    { id: 'pin3', label: 'III', xPosition: 220, fallOrder: 3, color: '#FBBF24' },
    { id: 'pin4', label: 'IV', xPosition: 150, fallOrder: 4, color: '#10B981' },
];

const DEFAULT_MATERIALS: Material[] = [
    { id: 'steel', name: 'Steel', type: 'conductor', color: '#64748B', emoji: '🔧', conductivity: 50 },
    { id: 'copper', name: 'Copper', type: 'conductor', color: '#C87533', emoji: '🟠', conductivity: 400 },
    { id: 'aluminum', name: 'Aluminum', type: 'conductor', color: '#A8A9AD', emoji: '⚪', conductivity: 237 },
    { id: 'wood', name: 'Wood', type: 'insulator', color: '#8B5A2B', emoji: '🪵', conductivity: 0.15 },
    { id: 'plastic', name: 'Plastic', type: 'insulator', color: '#3B82F6', emoji: '🔴', conductivity: 0.2 },
    { id: 'glass', name: 'Glass', type: 'insulator', color: '#93C5FD', emoji: '💎', conductivity: 0.8 },
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const HeatConductionTool: React.FC<HeatConductionToolProps> = ({
    props = {},
    setStepDetails,
    stopAutoNext = false,
    setStopAutoNext,
}) => {
    // ─── CONFIGURATION ───
    const config = useMemo(() => ({
        width: props.width ?? 800,
        height: props.height ?? 600,
        initialMode: (props.initialMode ?? 'learn') as ModeType,
        showModeSelector: props.showModeSelector ?? true,
        enabledModes: props.enabledModes ?? ['learn', 'practice', 'real_world', 'hands_on'],
        showNavigation: props.showNavigation ?? true,
        showPlayPause: props.showPlayPause ?? true,
        showStepIndicator: props.showStepIndicator ?? true,
        initialStep: props.initialStep ?? 1,
        filterSteps: props.filterSteps ?? null,
        animationSpeed: props.animationSpeed ?? 1,
        autoPlayDuration: props.autoPlayDuration ?? props.data?.autoPlayDuration ?? 8000,
        themeColor: props.themeColor ?? props.data?.themeColor ?? DESIGN.primary,
        darkMode: props.darkMode ?? false,
    }), [props]);

    // ─── ADDITIONAL PROPS ───
    const additionalProps = props.additionalProps || {};
    const heatConfig = useMemo(() => ({
        customPins: additionalProps.customPins ?? null,
        maxHeatIntensity: additionalProps.maxHeatIntensity ?? 100,
        heatSpeed: additionalProps.heatSpeed ?? 80,
        customMaterials: additionalProps.customMaterials ?? null,
        customQuestions: additionalProps.customQuestions ?? null,
        customApplications: additionalProps.customApplications ?? null,
        showLabels: additionalProps.showLabels ?? true,
        showHeatVisualization: additionalProps.showHeatVisualization ?? true,
        enableDragDrop: additionalProps.enableDragDrop ?? true,
        showMolecularView: additionalProps.showMolecularView ?? false,
    }), [additionalProps]);

    const pins = heatConfig.customPins || DEFAULT_PINS;
    const materials = heatConfig.customMaterials || DEFAULT_MATERIALS;

    // ─── STEPS ───
    const allSteps = props.steps || DEFAULT_STEPS;
    const availableSteps = useMemo(() => {
        if (config.filterSteps && config.filterSteps.length > 0) {
            return allSteps.filter(s => config.filterSteps!.includes(s.id));
        }
        return allSteps;
    }, [allSteps, config.filterSteps]);

    // ─── STATE ───
    const [selectedMode, setSelectedMode] = useState<ModeType>(config.initialMode);
    const [currentStepIndex, setCurrentStepIndex] = useState(() => {
        const steps = availableSteps.filter(s => s.mode === config.initialMode);
        if (config.initialStep) {
            const idx = steps.findIndex(s => s.id === config.initialStep);
            return idx >= 0 ? idx : 0;
        }
        return 0;
    });
    const [isPlaying, setIsPlaying] = useState(!stopAutoNext);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [buttonStates, setButtonStates] = useState<Record<string, 'idle' | 'hover' | 'active'>>({});
    const [contentOpacity, setContentOpacity] = useState(1);
    const [contentTransform, setContentTransform] = useState('translateY(0)');

    // Heating state
    const [heatIntensity, setHeatIntensity] = useState(0);
    const [fallenPins, setFallenPins] = useState<string[]>([]);
    const [isHeating, setIsHeating] = useState(false);
    const [currentFallingPin, setCurrentFallingPin] = useState<string | null>(null);

    // Material testing state
    const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
    const [testedMaterials, setTestedMaterials] = useState<string[]>([]);
    const [showMaterialResult, setShowMaterialResult] = useState(false);

    // Practice state
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

    // Hands-on classification state
    const [classifiedMaterials, setClassifiedMaterials] = useState<Record<string, 'conductor' | 'insulator' | null>>({});
    const [showClassifyResults, setShowClassifyResults] = useState(false);

    // Real world expanded
    const [expandedApp, setExpandedApp] = useState<number | null>(null);

    // Canvas ref
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();
    const heatIntervalRef = useRef<number>();

    // Filter steps by mode
    const filteredSteps = useMemo(() => {
        return availableSteps.filter(step => step.mode === selectedMode);
    }, [availableSteps, selectedMode]);

    const currentStep = filteredSteps[currentStepIndex] || filteredSteps[0];

    // ─── INJECT KEYFRAMES ───
    useEffect(() => {
        const font = document.createElement('link');
        font.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';
        font.rel = 'stylesheet';
        document.head.appendChild(font);

        const keyframes = `
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOutDown {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-30px); }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.08); }
            }
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
            }
            @keyframes popIn {
                0% { transform: scale(0); opacity: 0; }
                70% { transform: scale(1.2); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes slideRight {
                from { transform: translateX(-100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes glow {
                0%, 100% { box-shadow: 0 0 5px ${DESIGN.primary}40; }
                50% { box-shadow: 0 0 25px ${DESIGN.accent}80; }
            }
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            @keyframes ripple {
                0% { transform: scale(0); opacity: 0.5; }
                100% { transform: scale(4); opacity: 0; }
            }
            @keyframes flameFlicker {
                0%, 100% { transform: scaleY(1) scaleX(1); }
                25% { transform: scaleY(1.1) scaleX(0.95); }
                50% { transform: scaleY(0.95) scaleX(1.05); }
                75% { transform: scaleY(1.05) scaleX(0.98); }
            }
            @keyframes heatWave {
                0% { opacity: 0.3; transform: translateX(0); }
                50% { opacity: 0.7; }
                100% { opacity: 0.3; transform: translateX(-20px); }
            }
            @keyframes pinDrop {
                0% { transform: translateY(0); }
                20% { transform: translateY(5px); }
                100% { transform: translateY(120px); }
            }
            @keyframes countUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes highlight {
                0% { background-color: ${DESIGN.accent}; transform: scale(1.3); }
                100% { background-color: ${DESIGN.accent}40; transform: scale(1); }
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'heat-conduction-keyframes';
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);

        return () => {
            const existing = document.getElementById('heat-conduction-keyframes');
            if (existing) document.head.removeChild(existing);
            document.head.removeChild(font);
        };
    }, []);

    // ─── CANVAS DRAWING ───
    const drawExperiment = useCallback((ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Background
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        bgGrad.addColorStop(0, config.darkMode ? '#1A1A2E' : '#FAFAFA');
        bgGrad.addColorStop(1, config.darkMode ? '#16213E' : '#F0EFFF');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const scale = canvasWidth / 500;
        const rodY = canvasHeight * 0.38;

        // Stand base
        ctx.fillStyle = '#5C3D2E';
        ctx.beginPath();
        ctx.roundRect(20 * scale, canvasHeight - 35 * scale, 460 * scale, 28 * scale, 4 * scale);
        ctx.fill();

        // Stand pole
        ctx.fillStyle = DESIGN.grayDark;
        ctx.fillRect(48 * scale, rodY - 30 * scale, 14 * scale, canvasHeight - rodY - 10 * scale);

        // Clamp
        ctx.fillStyle = '#5C5C8A';
        ctx.beginPath();
        ctx.roundRect(58 * scale, rodY - 8 * scale, 22 * scale, 16 * scale, 3 * scale);
        ctx.fill();

        // Metal rod
        const rodGrad = ctx.createLinearGradient(0, rodY - 5 * scale, 0, rodY + 5 * scale);
        rodGrad.addColorStop(0, '#B0B8C8');
        rodGrad.addColorStop(0.5, '#D4DAE6');
        rodGrad.addColorStop(1, '#8892A4');
        ctx.fillStyle = rodGrad;
        ctx.beginPath();
        ctx.roundRect(78 * scale, rodY - 5 * scale, 340 * scale, 10 * scale, 3 * scale);
        ctx.fill();

        // Heat color on rod
        if (heatIntensity > 0) {
            const heatLen = (heatIntensity / 100) * 340 * scale;
            const heatGrad = ctx.createLinearGradient(418 * scale, 0, 418 * scale - heatLen, 0);
            heatGrad.addColorStop(0, `rgba(239, 68, 68, ${heatIntensity / 150})`);
            heatGrad.addColorStop(0.5, `rgba(249, 115, 22, ${heatIntensity / 200})`);
            heatGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
            ctx.fillStyle = heatGrad;
            ctx.beginPath();
            ctx.roundRect(418 * scale - heatLen, rodY - 5 * scale, heatLen, 10 * scale, 3 * scale);
            ctx.fill();
        }

        // Pins
        pins.forEach((pin) => {
            const x = pin.xPosition * scale;
            const hasFallen = fallenPins.includes(pin.id);
            const isFalling = currentFallingPin === pin.id;

            if (!hasFallen && !isFalling) {
                // Wax blob
                const showGlow = heatIntensity >= pin.fallOrder * 20;
                ctx.fillStyle = showGlow ? '#FCD34D' : '#FFE082';
                ctx.globalAlpha = showGlow ? 0.6 : 0.9;
                ctx.beginPath();
                ctx.ellipse(x, rodY - 2 * scale, 8 * scale, 6 * scale, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;

                if (showGlow) {
                    ctx.shadowColor = DESIGN.accent;
                    ctx.shadowBlur = 12;
                }

                // Pin head
                ctx.fillStyle = pin.color;
                ctx.beginPath();
                ctx.arc(x, rodY - 18 * scale, 5 * scale, 0, Math.PI * 2);
                ctx.fill();

                // Pin body
                ctx.strokeStyle = pin.color;
                ctx.lineWidth = 3 * scale;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(x, rodY - 13 * scale);
                ctx.lineTo(x, rodY - 3 * scale);
                ctx.stroke();

                ctx.shadowBlur = 0;
            }

            // Label
            if (heatConfig.showLabels) {
                ctx.font = `bold ${13 * scale}px Poppins, sans-serif`;
                ctx.fillStyle = hasFallen ? pin.color : config.darkMode ? '#CCC' : DESIGN.grayDark;
                ctx.textAlign = 'center';
                ctx.fillText(pin.label, x, rodY - 32 * scale);
                if (hasFallen) {
                    ctx.font = `${10 * scale}px Poppins, sans-serif`;
                    ctx.fillStyle = DESIGN.success;
                    ctx.fillText('✓ Fallen', x, rodY + 40 * scale);
                }
            }
        });

        // Burner
        const bx = 415 * scale;
        const by = rodY + 25 * scale;

        // Burner body
        ctx.fillStyle = '#FFB74D';
        ctx.beginPath();
        ctx.roundRect(bx - 12 * scale, by, 24 * scale, 40 * scale, 3 * scale);
        ctx.fill();
        ctx.fillStyle = '#FFA726';
        ctx.beginPath();
        ctx.roundRect(bx - 12 * scale, by, 24 * scale, 8 * scale, [3 * scale, 3 * scale, 0, 0]);
        ctx.fill();

        // Base
        ctx.fillStyle = '#757575';
        ctx.beginPath();
        ctx.roundRect(bx - 16 * scale, by + 40 * scale, 32 * scale, 8 * scale, 2 * scale);
        ctx.fill();

        // Flame
        if (isHeating || heatIntensity > 0) {
            const flameH = 20 + (heatIntensity / 100) * 15;
            const grad = ctx.createRadialGradient(bx, by - flameH * 0.3 * scale, 2 * scale, bx, by - flameH * 0.5 * scale, flameH * 0.8 * scale);
            grad.addColorStop(0, '#FFFFFF');
            grad.addColorStop(0.3, '#FFC107');
            grad.addColorStop(0.6, '#FF9800');
            grad.addColorStop(1, 'rgba(244, 67, 54, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(bx, by - flameH * scale);
            ctx.quadraticCurveTo(bx + 10 * scale, by - flameH * 0.5 * scale, bx + 5 * scale, by);
            ctx.quadraticCurveTo(bx, by - 5 * scale, bx - 5 * scale, by);
            ctx.quadraticCurveTo(bx - 10 * scale, by - flameH * 0.5 * scale, bx, by - flameH * scale);
            ctx.fill();
        }

        // Heat flow arrow
        if (heatIntensity > 5) {
            ctx.strokeStyle = DESIGN.accent;
            ctx.lineWidth = 2 * scale;
            ctx.setLineDash([6 * scale, 4 * scale]);
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.moveTo(400 * scale, rodY - 18 * scale);
            ctx.lineTo(100 * scale, rodY - 18 * scale);
            ctx.stroke();

            // Arrow head
            ctx.setLineDash([]);
            ctx.fillStyle = DESIGN.accent;
            ctx.beginPath();
            ctx.moveTo(100 * scale, rodY - 18 * scale);
            ctx.lineTo(110 * scale, rodY - 24 * scale);
            ctx.lineTo(110 * scale, rodY - 12 * scale);
            ctx.closePath();
            ctx.fill();

            ctx.font = `bold ${11 * scale}px Poppins, sans-serif`;
            ctx.fillStyle = DESIGN.accent;
            ctx.textAlign = 'center';
            ctx.fillText('Heat Flow →', 250 * scale, rodY - 24 * scale);
            ctx.globalAlpha = 1;
        }
    }, [config, pins, heatIntensity, fallenPins, currentFallingPin, isHeating, heatConfig.showLabels]);

    // Canvas animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const draw = () => {
            drawExperiment(ctx, canvas.width, canvas.height);
            animationFrameRef.current = requestAnimationFrame(draw);
        };
        animationFrameRef.current = requestAnimationFrame(draw);

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [drawExperiment]);

    // ─── STEP DETAILS CALLBACK ───
    useEffect(() => {
        if (setStepDetails) {
            setStepDetails({
                currentStep: currentStepIndex + 1,
                totalSteps: filteredSteps.length,
                isPaused: !isPlaying,
                currentMode: selectedMode,
            });
        }
    }, [currentStepIndex, filteredSteps.length, isPlaying, selectedMode, setStepDetails]);

    // Auto-advance
    useEffect(() => {
        if (!isPlaying || stopAutoNext || config.autoPlayDuration === 0) return;
        const timer = setTimeout(() => {
            if (currentStepIndex < filteredSteps.length - 1) {
                animateStepChange('next');
            } else {
                setIsPlaying(false);
            }
        }, config.autoPlayDuration);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, stopAutoNext, filteredSteps.length, config.autoPlayDuration]);

    // ─── NAVIGATION ───
    const animateStepChange = useCallback((direction: 'next' | 'prev') => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setContentOpacity(0);
        setContentTransform(direction === 'next' ? 'translateY(-30px)' : 'translateY(30px)');
        setTimeout(() => {
            setCurrentStepIndex(prev => direction === 'next' ? prev + 1 : prev - 1);
            setContentTransform(direction === 'next' ? 'translateY(30px)' : 'translateY(-30px)');
            setSelectedAnswer('');
            setShowFeedback(false);
            setTimeout(() => {
                setContentOpacity(1);
                setContentTransform('translateY(0)');
                setIsTransitioning(false);
            }, 50);
        }, 300);
    }, [isTransitioning]);

    const nextStep = () => {
        if (currentStepIndex < filteredSteps.length - 1 && !isTransitioning) animateStepChange('next');
    };
    const prevStep = () => {
        if (currentStepIndex > 0 && !isTransitioning) animateStepChange('prev');
    };

    const changeMode = (mode: ModeType) => {
        if (mode === selectedMode) return;
        setIsTransitioning(true);
        setContentOpacity(0);
        setTimeout(() => {
            setSelectedMode(mode);
            setCurrentStepIndex(0);
            setSelectedAnswer('');
            setShowFeedback(false);
            setTimeout(() => {
                setContentOpacity(1);
                setIsTransitioning(false);
            }, 50);
        }, 300);
    };

    // ─── HEATING LOGIC ───
    const startHeating = () => {
        if (isHeating) return;
        setIsHeating(true);
        setHeatIntensity(0);
        setFallenPins([]);
        setCurrentFallingPin(null);

        let intensity = 0;
        heatIntervalRef.current = window.setInterval(() => {
            intensity += 1;
            setHeatIntensity(intensity);

            pins.forEach((pin) => {
                const trigger = pin.fallOrder * 25;
                if (intensity === trigger - 2) {
                    setCurrentFallingPin(pin.id);
                    setTimeout(() => {
                        setFallenPins(prev => [...prev, pin.id]);
                        setCurrentFallingPin(null);
                    }, 800);
                }
            });

            if (intensity >= heatConfig.maxHeatIntensity) {
                clearInterval(heatIntervalRef.current);
                setTimeout(() => setIsHeating(false), 500);
            }
        }, heatConfig.heatSpeed / config.animationSpeed);
    };

    const resetHeating = () => {
        if (heatIntervalRef.current) clearInterval(heatIntervalRef.current);
        setHeatIntensity(0);
        setFallenPins([]);
        setIsHeating(false);
        setCurrentFallingPin(null);
    };

    // ─── MATERIAL TESTING ───
    const testMaterial = (materialId: string) => {
        setSelectedMaterial(materialId);
        setShowMaterialResult(true);
        if (!testedMaterials.includes(materialId)) {
            setTestedMaterials(prev => [...prev, materialId]);
        }
    };

    // ─── PRACTICE HANDLERS ───
    const handleAnswerSelect = (answer: string) => {
        if (showFeedback) return;
        setSelectedAnswer(answer);
    };

    const handleSubmit = () => {
        if (!selectedAnswer || !currentStep?.data) return;
        const isCorrect = selectedAnswer === currentStep.data.correctAnswer;
        if (isCorrect && !answeredQuestions.includes(currentStep.id)) {
            setScore(prev => prev + (currentStep.data.points || 10));
        }
        if (!answeredQuestions.includes(currentStep.id)) {
            setAnsweredQuestions(prev => [...prev, currentStep.id]);
        }
        setShowFeedback(true);
    };

    // ─── CLASSIFY HANDLER ───
    const classifyMaterial = (matId: string, type: 'conductor' | 'insulator') => {
        setClassifiedMaterials(prev => ({ ...prev, [matId]: type }));
    };

    const checkClassification = () => {
        setShowClassifyResults(true);
    };

    // ─── BUTTON INTERACTIONS ───
    const handleButtonInteraction = (id: string, state: 'idle' | 'hover' | 'active') => {
        setButtonStates(prev => ({ ...prev, [id]: state }));
    };

    const getButtonTransform = (id: string): string => {
        const state = buttonStates[id] || 'idle';
        if (state === 'active') return 'scale(0.95)';
        if (state === 'hover') return 'scale(1.05)';
        return 'scale(1)';
    };

    // ─── COLORS ───
    const colors = {
        primary: config.themeColor || DESIGN.primary,
        background: config.darkMode ? '#1A1A2E' : DESIGN.grayLightest,
        surface: config.darkMode ? '#16213E' : DESIGN.white,
        text: config.darkMode ? '#E2E8F0' : DESIGN.darkText,
        textSecondary: config.darkMode ? '#94A3B8' : DESIGN.grayDark,
        border: config.darkMode ? '#334155' : DESIGN.grayLight,
    };

    const modeColors: Record<ModeType, { from: string; to: string; icon: any }> = {
        learn: { from: DESIGN.primary, to: '#6366F1', icon: BookOpen },
        practice: { from: DESIGN.accent, to: '#F97316', icon: Target },
        real_world: { from: DESIGN.gradientStart, to: DESIGN.gradientEnd, icon: Zap },
        hands_on: { from: '#10B981', to: '#34D399', icon: FlaskConical },
    };

    // ─── STYLE OBJECTS ───
    const S: Record<string, React.CSSProperties> = {
        container: {
            width: '100%',
            maxWidth: `${config.width}px`,
            margin: '0 auto',
            background: colors.surface,
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px -15px rgba(74, 77, 201, 0.15)',
            fontFamily: DESIGN.font,
        },
        modeSelector: {
            display: config.showModeSelector ? 'flex' : 'none',
            gap: '10px',
            padding: '16px 20px',
            background: colors.background,
            borderBottom: `1px solid ${colors.border}`,
            justifyContent: 'center',
            flexWrap: 'wrap',
        },
        modeBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            borderRadius: '24px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: DESIGN.font,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        header: {
            padding: '28px 32px 20px',
            color: 'white',
            position: 'relative' as const,
            overflow: 'hidden',
        },
        headerTitle: {
            fontSize: '22px',
            fontWeight: 700,
            marginBottom: '6px',
            animation: 'fadeInUp 0.6s ease-out',
            fontFamily: DESIGN.font,
        },
        stepBadge: {
            display: config.showStepIndicator ? 'inline-flex' : 'none',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,255,255,0.2)',
            padding: '6px 14px',
            borderRadius: '16px',
            fontSize: '12px',
            backdropFilter: 'blur(10px)',
            fontWeight: 500,
        },
        content: {
            padding: '24px',
            opacity: contentOpacity,
            transform: contentTransform,
            transition: `all ${300 / config.animationSpeed}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        },
        description: {
            fontSize: '15px',
            lineHeight: 1.7,
            color: colors.text,
            padding: '20px',
            background: colors.background,
            borderRadius: '14px',
            borderLeft: `4px solid ${DESIGN.primary}`,
            marginBottom: '20px',
            fontFamily: DESIGN.font,
        },
        canvas: {
            width: '100%',
            borderRadius: '14px',
            marginBottom: '20px',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)',
        },
        navigation: {
            display: config.showNavigation || config.showPlayPause ? 'flex' : 'none',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            background: colors.background,
            borderTop: `1px solid ${colors.border}`,
        },
        navBtn: {
            display: config.showNavigation ? 'flex' : 'none',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 22px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: DESIGN.font,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        playBtn: {
            display: config.showPlayPause ? 'flex' : 'none',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 28px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: DESIGN.font,
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        progressBar: {
            height: '4px',
            background: colors.border,
            borderRadius: '2px',
            overflow: 'hidden',
            margin: '0 24px 16px',
        },
        progressFill: {
            height: '100%',
            background: `linear-gradient(90deg, ${modeColors[selectedMode].from}, ${modeColors[selectedMode].to})`,
            borderRadius: '2px',
            transition: 'width 0.5s ease-out',
            width: `${((currentStepIndex + 1) / Math.max(filteredSteps.length, 1)) * 100}%`,
        },
        actionBtn: {
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: DESIGN.font,
            transition: 'all 0.2s ease',
            color: DESIGN.white,
        },
    };

    // ═══════════════════════════════════════════════════════════════════
    // RENDER: LEARN MODE CONTENT
    // ═══════════════════════════════════════════════════════════════════

    const renderLearnContent = () => {
        const step = currentStep;
        if (!step) return null;

        return (
            <div>
                <div style={S.description}>{step.description}</div>

                {/* Experiment canvas */}
                {(step.data?.showExperiment || step.id === 2) && (
                    <div>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                            <button
                                onClick={startHeating}
                                disabled={isHeating}
                                onMouseEnter={() => handleButtonInteraction('heat', 'hover')}
                                onMouseLeave={() => handleButtonInteraction('heat', 'idle')}
                                onMouseDown={() => handleButtonInteraction('heat', 'active')}
                                onMouseUp={() => handleButtonInteraction('heat', 'hover')}
                                style={{
                                    ...S.actionBtn,
                                    background: isHeating ? DESIGN.grayMid : `linear-gradient(135deg, ${DESIGN.accent}, #F97316)`,
                                    opacity: isHeating ? 0.6 : 1,
                                    cursor: isHeating ? 'not-allowed' : 'pointer',
                                    transform: getButtonTransform('heat'),
                                }}
                            >
                                🔥 Start Heating
                            </button>
                            <button
                                onClick={resetHeating}
                                onMouseEnter={() => handleButtonInteraction('reset', 'hover')}
                                onMouseLeave={() => handleButtonInteraction('reset', 'idle')}
                                onMouseDown={() => handleButtonInteraction('reset', 'active')}
                                onMouseUp={() => handleButtonInteraction('reset', 'hover')}
                                style={{
                                    ...S.actionBtn,
                                    background: DESIGN.grayDark,
                                    transform: getButtonTransform('reset'),
                                }}
                            >
                                <RotateCcw size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                Reset
                            </button>
                        </div>

                        {/* Heat intensity bar */}
                        <div style={{
                            marginBottom: '16px',
                            padding: '14px',
                            background: colors.background,
                            borderRadius: '12px',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: colors.textSecondary }}>
                                <span>Heat Intensity</span>
                                <span style={{ color: DESIGN.accent }}>{heatIntensity}%</span>
                            </div>
                            <div style={{ width: '100%', height: '10px', background: colors.border, borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${heatIntensity}%`,
                                    height: '100%',
                                    background: `linear-gradient(90deg, #FCD34D, ${DESIGN.accent}, #EF4444)`,
                                    transition: 'width 0.2s ease',
                                    borderRadius: '5px',
                                }} />
                            </div>
                        </div>

                        <canvas
                            ref={canvasRef}
                            width={config.width - 64}
                            height={Math.min(280, config.height - 350)}
                            style={S.canvas}
                        />

                        {/* Pin status cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                            {pins.map((pin, i) => {
                                const hasFallen = fallenPins.includes(pin.id);
                                return (
                                    <div key={pin.id} style={{
                                        padding: '14px',
                                        borderRadius: '14px',
                                        border: `2px solid ${hasFallen ? DESIGN.success : colors.border}`,
                                        background: hasFallen ? '#ECFDF5' : colors.surface,
                                        textAlign: 'center',
                                        animation: `popIn 0.4s ease-out ${i * 0.1}s both`,
                                        transition: 'all 0.3s ease',
                                    }}>
                                        <div style={{ fontSize: '16px', fontWeight: 700, color: pin.color, marginBottom: '4px' }}>
                                            Pin {pin.label}
                                        </div>
                                        <div style={{ fontSize: '11px', color: colors.textSecondary }}>Order: {pin.fallOrder}</div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: hasFallen ? DESIGN.success : DESIGN.warning, marginTop: '6px' }}>
                                            {hasFallen ? '✓ Fallen' : heatIntensity >= pin.fallOrder * 20 ? '⏳ Melting...' : '⏸ Waiting'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Materials testing */}
                {(step.data?.showMaterials || step.id === 3) && (
                    <div style={{ marginTop: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px', color: colors.text }}>
                            🧪 Test Different Materials
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px', marginBottom: '16px' }}>
                            {materials.map((mat, i) => (
                                <button
                                    key={mat.id}
                                    onClick={() => testMaterial(mat.id)}
                                    onMouseEnter={() => handleButtonInteraction(`mat-${mat.id}`, 'hover')}
                                    onMouseLeave={() => handleButtonInteraction(`mat-${mat.id}`, 'idle')}
                                    style={{
                                        padding: '12px 8px',
                                        borderRadius: '12px',
                                        border: selectedMaterial === mat.id ? `2px solid ${DESIGN.primary}` : `2px solid ${colors.border}`,
                                        background: selectedMaterial === mat.id ? `${DESIGN.primary}15` : colors.surface,
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        fontFamily: DESIGN.font,
                                        transition: 'all 0.2s ease',
                                        transform: getButtonTransform(`mat-${mat.id}`),
                                        animation: `popIn 0.4s ease-out ${i * 0.08}s both`,
                                    }}
                                >
                                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{mat.emoji}</div>
                                    {mat.name}
                                    {testedMaterials.includes(mat.id) && <span style={{ color: DESIGN.success, marginLeft: '4px' }}>✓</span>}
                                </button>
                            ))}
                        </div>

                        {selectedMaterial && showMaterialResult && (() => {
                            const mat = materials.find(m => m.id === selectedMaterial);
                            if (!mat) return null;
                            const isCond = mat.type === 'conductor';
                            return (
                                <div style={{
                                    padding: '18px',
                                    background: isCond ? '#ECFDF5' : '#FEF2F2',
                                    borderRadius: '14px',
                                    border: `2px solid ${isCond ? DESIGN.success : DESIGN.error}`,
                                    animation: 'popIn 0.3s ease-out',
                                }}>
                                    <div style={{ fontSize: '16px', fontWeight: 700, color: isCond ? DESIGN.success : DESIGN.error, marginBottom: '6px' }}>
                                        {mat.emoji} {mat.name} — {isCond ? '⚡ Good Conductor' : '🛡️ Insulator'}
                                    </div>
                                    <div style={{ fontSize: '13px', color: DESIGN.grayDark, lineHeight: 1.6 }}>
                                        {isCond
                                            ? `Heat transfers quickly through ${mat.name.toLowerCase()}. Conductivity: ~${mat.conductivity} W/m·K`
                                            : `Heat transfer is very slow through ${mat.name.toLowerCase()}. Conductivity: ~${mat.conductivity} W/m·K`}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* Default text step */}
                {!step.data?.showExperiment && !step.data?.showMaterials && step.id !== 2 && step.id !== 3 && (
                    <div style={{
                        padding: '20px',
                        background: `linear-gradient(135deg, ${DESIGN.lightPurple}30, ${DESIGN.lightOrange}30)`,
                        borderRadius: '14px',
                        fontSize: '14px',
                        lineHeight: 1.7,
                        color: colors.text,
                    }}>
                        💡 Tip: Use the navigation to explore all topics, or click Play to auto-advance through the lesson.
                    </div>
                )}
            </div>
        );
    };

    // ═══════════════════════════════════════════════════════════════════
    // RENDER: PRACTICE MODE CONTENT
    // ═══════════════════════════════════════════════════════════════════

    const renderPracticeContent = () => {
        const step = currentStep;
        if (!step?.data) return null;
        const { question, options, correctAnswer, explanation, points, difficulty } = step.data;
        const isCorrect = selectedAnswer === correctAnswer;
        const totalPts = filteredSteps.reduce((sum: number, s: StepDataInterface) => sum + (s.data?.points || 0), 0);

        return (
            <div>
                {/* Score bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    gap: '10px',
                }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                            padding: '6px 14px',
                            background: `${DESIGN.primary}15`,
                            color: DESIGN.primary,
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 700,
                        }}>
                            Q{currentStepIndex + 1}/{filteredSteps.length}
                        </span>
                        <span style={{
                            padding: '6px 14px',
                            background: difficulty === 'easy' ? '#ECFDF5' : difficulty === 'medium' ? '#FEF3C7' : '#FEF2F2',
                            color: difficulty === 'easy' ? DESIGN.success : difficulty === 'medium' ? DESIGN.warning : DESIGN.error,
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 700,
                        }}>
                            {(difficulty || 'medium').charAt(0).toUpperCase() + (difficulty || 'medium').slice(1)}
                        </span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: colors.text }}>
                        <Star size={16} style={{ display: 'inline', verticalAlign: 'middle', color: DESIGN.accent, marginRight: 4 }} />
                        {score}/{totalPts}
                    </div>
                </div>

                {/* Question */}
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: colors.text, lineHeight: 1.5 }}>
                    {question}
                </h3>

                {/* Options */}
                <div style={{ marginBottom: '20px' }}>
                    {(options || []).map((opt: string, i: number) => {
                        const isSelected = selectedAnswer === opt;
                        const isRight = opt === correctAnswer;
                        let borderColor = colors.border;
                        let bg = colors.surface;
                        if (showFeedback && isSelected) {
                            borderColor = isCorrect ? DESIGN.success : DESIGN.error;
                            bg = isCorrect ? '#ECFDF5' : '#FEF2F2';
                        } else if (showFeedback && isRight) {
                            borderColor = DESIGN.success;
                            bg = '#ECFDF5';
                        } else if (isSelected) {
                            borderColor = DESIGN.primary;
                            bg = `${DESIGN.primary}10`;
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => handleAnswerSelect(opt)}
                                disabled={showFeedback}
                                style={{
                                    width: '100%',
                                    padding: '14px 18px',
                                    marginBottom: '10px',
                                    borderRadius: '12px',
                                    border: `2px solid ${borderColor}`,
                                    background: bg,
                                    color: colors.text,
                                    fontSize: '14px',
                                    fontFamily: DESIGN.font,
                                    textAlign: 'left',
                                    cursor: showFeedback ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontWeight: isSelected ? 600 : 400,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    animation: `fadeInUp 0.3s ease-out ${i * 0.08}s both`,
                                }}
                            >
                                <span>{opt}</span>
                                {showFeedback && isSelected && (
                                    isCorrect
                                        ? <Check size={18} color={DESIGN.success} />
                                        : <X size={18} color={DESIGN.error} />
                                )}
                                {showFeedback && isRight && !isSelected && <Check size={18} color={DESIGN.success} />}
                            </button>
                        );
                    })}
                </div>

                {/* Submit */}
                {!showFeedback && (
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedAnswer}
                        style={{
                            ...S.actionBtn,
                            background: !selectedAnswer ? DESIGN.grayMid : `linear-gradient(135deg, ${DESIGN.accent}, #F97316)`,
                            cursor: !selectedAnswer ? 'not-allowed' : 'pointer',
                            opacity: !selectedAnswer ? 0.5 : 1,
                            width: '100%',
                        }}
                    >
                        Submit Answer
                    </button>
                )}

                {/* Feedback */}
                {showFeedback && (
                    <div style={{
                        padding: '18px',
                        background: isCorrect ? '#ECFDF5' : '#FEF2F2',
                        border: `2px solid ${isCorrect ? DESIGN.success : DESIGN.error}`,
                        borderRadius: '14px',
                        animation: 'popIn 0.3s ease-out',
                    }}>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: isCorrect ? DESIGN.success : DESIGN.error, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {isCorrect ? <><Check size={20} /> Correct! +{points} pts</> : <><X size={20} /> Incorrect</>}
                        </div>
                        <p style={{ fontSize: '13px', color: DESIGN.grayDark, lineHeight: 1.6, margin: 0 }}>{explanation}</p>
                    </div>
                )}

                {/* Quiz Complete */}
                {currentStepIndex === filteredSteps.length - 1 && showFeedback && (
                    <div style={{
                        marginTop: '24px',
                        padding: '24px',
                        background: `linear-gradient(135deg, ${DESIGN.lightOrange}, ${DESIGN.lightPurple}40)`,
                        borderRadius: '14px',
                        textAlign: 'center',
                        animation: 'popIn 0.5s ease-out',
                    }}>
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏆</div>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: colors.text }}>Quiz Complete!</h3>
                        <p style={{ fontSize: '16px', color: DESIGN.grayDark }}>
                            Score: <strong>{score}/{totalPts}</strong> ({Math.round((score / Math.max(totalPts, 1)) * 100)}%)
                        </p>
                    </div>
                )}
            </div>
        );
    };

    // ═══════════════════════════════════════════════════════════════════
    // RENDER: REAL WORLD MODE CONTENT
    // ═══════════════════════════════════════════════════════════════════

    const renderRealWorldContent = () => {
        const step = currentStep;
        if (!step) return null;

        return (
            <div>
                <div style={S.description}>{step.description}</div>

                {step.data && (
                    <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                            <div style={{
                                padding: '16px',
                                background: '#ECFDF5',
                                borderRadius: '12px',
                                border: `2px solid ${DESIGN.success}`,
                            }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: DESIGN.success, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    ⚡ Conductor
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{step.data.conductor}</div>
                            </div>
                            <div style={{
                                padding: '16px',
                                background: '#FEF2F2',
                                borderRadius: '12px',
                                border: `2px solid ${DESIGN.error}`,
                            }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: DESIGN.error, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    🛡️ Insulator
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>{step.data.insulator}</div>
                            </div>
                        </div>

                        {step.data.benefits && (
                            <div style={{
                                padding: '16px',
                                background: `${DESIGN.primary}08`,
                                borderRadius: '12px',
                                border: `1px solid ${DESIGN.lightPurple}`,
                            }}>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: DESIGN.primary, marginBottom: '8px' }}>
                                    ✨ Benefits
                                </div>
                                {step.data.benefits.map((b: string, i: number) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '13px',
                                        color: colors.text,
                                        marginBottom: '4px',
                                    }}>
                                        <span style={{ color: DESIGN.success }}>✓</span> {b}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // ═══════════════════════════════════════════════════════════════════
    // RENDER: HANDS ON MODE CONTENT
    // ═══════════════════════════════════════════════════════════════════

    const renderHandsOnContent = () => {
        const step = currentStep;
        if (!step) return null;

        if (step.data?.classify) {
            return (
                <div>
                    <div style={S.description}>{step.description}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                        {materials.map((mat, i) => {
                            const classified = classifiedMaterials[mat.id];
                            const isCorrect = classified === mat.type;
                            return (
                                <div key={mat.id} style={{
                                    padding: '14px',
                                    borderRadius: '14px',
                                    border: `2px solid ${showClassifyResults ? (isCorrect ? DESIGN.success : DESIGN.error) : colors.border}`,
                                    background: showClassifyResults
                                        ? (isCorrect ? '#ECFDF5' : '#FEF2F2')
                                        : colors.surface,
                                    textAlign: 'center',
                                    animation: `popIn 0.4s ease-out ${i * 0.08}s both`,
                                }}>
                                    <div style={{ fontSize: '24px', marginBottom: '6px' }}>{mat.emoji}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: colors.text, marginBottom: '10px' }}>{mat.name}</div>
                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => classifyMaterial(mat.id, 'conductor')}
                                            disabled={showClassifyResults}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                border: `2px solid ${classified === 'conductor' ? DESIGN.success : colors.border}`,
                                                background: classified === 'conductor' ? '#ECFDF5' : 'transparent',
                                                cursor: showClassifyResults ? 'not-allowed' : 'pointer',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                fontFamily: DESIGN.font,
                                                color: classified === 'conductor' ? DESIGN.success : colors.textSecondary,
                                            }}
                                        >
                                            ⚡ Cond.
                                        </button>
                                        <button
                                            onClick={() => classifyMaterial(mat.id, 'insulator')}
                                            disabled={showClassifyResults}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                border: `2px solid ${classified === 'insulator' ? DESIGN.error : colors.border}`,
                                                background: classified === 'insulator' ? '#FEF2F2' : 'transparent',
                                                cursor: showClassifyResults ? 'not-allowed' : 'pointer',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                fontFamily: DESIGN.font,
                                                color: classified === 'insulator' ? DESIGN.error : colors.textSecondary,
                                            }}
                                        >
                                            🛡️ Insul.
                                        </button>
                                    </div>
                                    {showClassifyResults && (
                                        <div style={{
                                            marginTop: '6px',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            color: isCorrect ? DESIGN.success : DESIGN.error,
                                        }}>
                                            {isCorrect ? '✓ Correct!' : `✗ It's a ${mat.type}`}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {!showClassifyResults ? (
                        <button
                            onClick={checkClassification}
                            disabled={Object.keys(classifiedMaterials).length < materials.length}
                            style={{
                                ...S.actionBtn,
                                background: Object.keys(classifiedMaterials).length < materials.length
                                    ? DESIGN.grayMid
                                    : `linear-gradient(135deg, ${DESIGN.success}, #34D399)`,
                                width: '100%',
                                opacity: Object.keys(classifiedMaterials).length < materials.length ? 0.5 : 1,
                                cursor: Object.keys(classifiedMaterials).length < materials.length ? 'not-allowed' : 'pointer',
                            }}
                        >
                            <Check size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                            Check Answers ({Object.keys(classifiedMaterials).length}/{materials.length})
                        </button>
                    ) : (
                        <div style={{
                            padding: '18px',
                            background: `linear-gradient(135deg, ${DESIGN.lightPurple}30, ${DESIGN.lightOrange}30)`,
                            borderRadius: '14px',
                            textAlign: 'center',
                        }}>
                            <Award size={32} color={DESIGN.accent} />
                            <div style={{ fontSize: '16px', fontWeight: 700, color: colors.text, marginTop: '8px' }}>
                                {Object.entries(classifiedMaterials).filter(([id, type]) => {
                                    const m = materials.find(mat => mat.id === id);
                                    return m && type === m.type;
                                }).length}/{materials.length} Correct!
                            </div>
                            <button
                                onClick={() => { setClassifiedMaterials({}); setShowClassifyResults(false); }}
                                style={{ ...S.actionBtn, background: DESIGN.primary, marginTop: '12px' }}
                            >
                                <RotateCcw size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Try Again
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        // Interactive testing
        return (
            <div>
                <div style={S.description}>{step.description}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                    {materials.map((mat, i) => (
                        <button
                            key={mat.id}
                            onClick={() => testMaterial(mat.id)}
                            style={{
                                padding: '16px 10px',
                                borderRadius: '14px',
                                border: selectedMaterial === mat.id ? `3px solid ${DESIGN.primary}` : `2px solid ${colors.border}`,
                                background: selectedMaterial === mat.id ? `${DESIGN.primary}10` : colors.surface,
                                cursor: 'pointer',
                                fontFamily: DESIGN.font,
                                fontSize: '13px',
                                fontWeight: 600,
                                textAlign: 'center',
                                transition: 'all 0.2s ease',
                                animation: `popIn 0.4s ease-out ${i * 0.06}s both`,
                            }}
                        >
                            <div style={{ fontSize: '28px', marginBottom: '6px' }}>{mat.emoji}</div>
                            {mat.name}
                        </button>
                    ))}
                </div>

                {selectedMaterial && showMaterialResult && (() => {
                    const mat = materials.find(m => m.id === selectedMaterial);
                    if (!mat) return null;
                    const isCond = mat.type === 'conductor';

                    return (
                        <div style={{
                            padding: '20px',
                            background: colors.surface,
                            borderRadius: '14px',
                            border: `2px solid ${isCond ? DESIGN.success : DESIGN.error}`,
                            animation: 'popIn 0.3s ease-out',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <h4 style={{ fontSize: '16px', fontWeight: 700, color: colors.text, margin: 0 }}>
                                    {mat.emoji} {mat.name}
                                </h4>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    background: isCond ? '#ECFDF5' : '#FEF2F2',
                                    color: isCond ? DESIGN.success : DESIGN.error,
                                }}>
                                    {isCond ? '⚡ Conductor' : '🛡️ Insulator'}
                                </span>
                            </div>

                            {/* Conductivity bar */}
                            <div style={{ marginBottom: '8px' }}>
                                <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>
                                    Thermal Conductivity: {mat.conductivity} W/m·K
                                </div>
                                <div style={{ width: '100%', height: '8px', background: colors.border, borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${Math.min((mat.conductivity || 0) / 400 * 100, 100)}%`,
                                        height: '100%',
                                        background: isCond
                                            ? `linear-gradient(90deg, ${DESIGN.success}, #34D399)`
                                            : `linear-gradient(90deg, ${DESIGN.error}, #F97316)`,
                                        borderRadius: '4px',
                                        transition: 'width 0.8s ease-out',
                                    }} />
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px',
                                background: colors.background,
                                borderRadius: '10px',
                                marginTop: '12px',
                            }}>
                                <div style={{ fontSize: '24px' }}>🔥</div>
                                <div style={{
                                    flex: 1,
                                    height: '6px',
                                    background: colors.border,
                                    borderRadius: '3px',
                                    overflow: 'hidden',
                                    position: 'relative' as const,
                                }}>
                                    <div style={{
                                        width: isCond ? '90%' : '15%',
                                        height: '100%',
                                        background: `linear-gradient(90deg, ${DESIGN.accent}, #FCD34D)`,
                                        borderRadius: '3px',
                                        transition: 'width 1s ease-out',
                                    }} />
                                </div>
                                <div style={{ fontSize: '24px', opacity: isCond ? 1 : 0.3 }}>💡</div>
                            </div>
                            <div style={{ fontSize: '12px', textAlign: 'center', color: colors.textSecondary, marginTop: '6px' }}>
                                {isCond ? 'Heat passes through quickly!' : 'Heat is blocked/very slow!'}
                            </div>
                        </div>
                    );
                })()}
            </div>
        );
    };

    // ═══════════════════════════════════════════════════════════════════
    // MAIN RENDER
    // ═══════════════════════════════════════════════════════════════════

    const renderContent = () => {
        switch (selectedMode) {
            case 'learn': return renderLearnContent();
            case 'practice': return renderPracticeContent();
            case 'real_world': return renderRealWorldContent();
            case 'hands_on': return renderHandsOnContent();
            default: return renderLearnContent();
        }
    };

    return (
        <div style={S.container}>
            {/* Mode Selector */}
            <div style={S.modeSelector}>
                {config.enabledModes.map((mode) => {
                    const isSelected = selectedMode === mode;
                    const mc = modeColors[mode as ModeType];
                    if (!mc) return null;
                    const Icon = mc.icon;
                    const labels: Record<string, string> = {
                        learn: 'Learn',
                        practice: 'Practice',
                        real_world: 'Real World',
                        hands_on: 'Hands On',
                    };

                    return (
                        <button
                            key={mode}
                            onClick={() => changeMode(mode as ModeType)}
                            onMouseEnter={() => handleButtonInteraction(`mode-${mode}`, 'hover')}
                            onMouseLeave={() => handleButtonInteraction(`mode-${mode}`, 'idle')}
                            onMouseDown={() => handleButtonInteraction(`mode-${mode}`, 'active')}
                            onMouseUp={() => handleButtonInteraction(`mode-${mode}`, 'hover')}
                            style={{
                                ...S.modeBtn,
                                background: isSelected
                                    ? `linear-gradient(135deg, ${mc.from}, ${mc.to})`
                                    : colors.surface,
                                color: isSelected ? 'white' : colors.text,
                                boxShadow: isSelected ? `0 4px 15px ${mc.from}40` : 'none',
                                transform: getButtonTransform(`mode-${mode}`),
                            }}
                        >
                            <Icon size={16} />
                            {labels[mode] || mode}
                        </button>
                    );
                })}
            </div>

            {/* Header */}
            <div style={{
                ...S.header,
                background: `linear-gradient(135deg, ${modeColors[selectedMode].from}, ${modeColors[selectedMode].to})`,
            }}>
                <h2 style={S.headerTitle}>{currentStep?.title || 'Heat Conduction'}</h2>
                <span style={S.stepBadge}>
                    Step {currentStepIndex + 1} of {filteredSteps.length}
                </span>
            </div>

            {/* Progress Bar */}
            <div style={S.progressBar}>
                <div style={S.progressFill} />
            </div>

            {/* Content */}
            <div style={S.content}>
                {renderContent()}
            </div>

            {/* Navigation */}
            <div style={S.navigation}>
                <button
                    onClick={prevStep}
                    disabled={currentStepIndex === 0 || isTransitioning}
                    onMouseEnter={() => handleButtonInteraction('prev', 'hover')}
                    onMouseLeave={() => handleButtonInteraction('prev', 'idle')}
                    onMouseDown={() => handleButtonInteraction('prev', 'active')}
                    onMouseUp={() => handleButtonInteraction('prev', 'hover')}
                    style={{
                        ...S.navBtn,
                        background: currentStepIndex === 0 ? colors.border : colors.surface,
                        color: currentStepIndex === 0 ? colors.textSecondary : colors.text,
                        cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
                        opacity: currentStepIndex === 0 ? 0.5 : 1,
                        transform: getButtonTransform('prev'),
                    }}
                >
                    <ChevronLeft size={18} />
                    Previous
                </button>

                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    onMouseEnter={() => handleButtonInteraction('play', 'hover')}
                    onMouseLeave={() => handleButtonInteraction('play', 'idle')}
                    onMouseDown={() => handleButtonInteraction('play', 'active')}
                    onMouseUp={() => handleButtonInteraction('play', 'hover')}
                    style={{
                        ...S.playBtn,
                        background: `linear-gradient(135deg, ${modeColors[selectedMode].from}, ${modeColors[selectedMode].to})`,
                        transform: getButtonTransform('play'),
                    }}
                >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    {isPlaying ? 'Pause' : 'Play'}
                </button>

                <button
                    onClick={nextStep}
                    disabled={currentStepIndex === filteredSteps.length - 1 || isTransitioning}
                    onMouseEnter={() => handleButtonInteraction('next', 'hover')}
                    onMouseLeave={() => handleButtonInteraction('next', 'idle')}
                    onMouseDown={() => handleButtonInteraction('next', 'active')}
                    onMouseUp={() => handleButtonInteraction('next', 'hover')}
                    style={{
                        ...S.navBtn,
                        background: currentStepIndex === filteredSteps.length - 1
                            ? colors.border
                            : `linear-gradient(135deg, ${modeColors[selectedMode].from}, ${modeColors[selectedMode].to})`,
                        color: currentStepIndex === filteredSteps.length - 1 ? colors.textSecondary : 'white',
                        cursor: currentStepIndex === filteredSteps.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: currentStepIndex === filteredSteps.length - 1 ? 0.5 : 1,
                        transform: getButtonTransform('next'),
                    }}
                >
                    Next
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default HeatConductionTool;