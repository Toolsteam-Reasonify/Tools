// @ts-expect-error - React types will be available at runtime, this suppresses the TypeScript error
import React, { useState, useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

type ModeType = 'learn' | 'practice' | 'explore';

interface StepDetails {
    currentStep: number;
    totalSteps: number;
    mode: ModeType;
    stepTitle: string;
}

interface StepData {
    id: number;
    title: string;
    content: string;
    visual: 'sun' | 'stars' | 'firefly' | 'lightning' | 'fire' | 'led' | 'moon' | 'summary';
    keyPoints?: string[];
}

interface PracticeQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface ComponentProps {
    width?: number;
    height?: number;
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
    additionalProps?: {
        highlightSources?: ('sun' | 'stars' | 'firefly' | 'lightning' | 'fire' | 'led' | 'moon')[];
        showDefinitions?: boolean;
        emphasizeLuminous?: boolean;
        customExamples?: {
            name: string;
            type: 'luminous' | 'non-luminous';
            description: string;
        }[];
    };
}

interface SourcesOfLightLearnModeProps {
    props?: ComponentProps;
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// LEARN MODE STEPS DATA
// ═══════════════════════════════════════════════════════════════════════════

const learnSteps: StepData[] = [
    {
        id: 1,
        title: "Introduction to Light",
        content: "Light is a form of energy that allows us to see the world around us. Without light, everything would be dark!",
        visual: "sun",
        keyPoints: [
            "Light is essential for vision",
            "Light travels in straight lines",
            "Light can come from natural and artificial sources"
        ]
    },
    {
        id: 2,
        title: "Natural Sources of Light",
        content: "Nature provides us with several sources of light. The Sun, stars, lightning, and even some animals like fireflies produce their own light!",
        visual: "stars",
        keyPoints: [
            "The Sun is the main natural light source",
            "Stars emit their own light",
            "Lightning produces bright flashes",
            "Some animals can produce light (bioluminescence)"
        ]
    },
    {
        id: 3,
        title: "The Sun - Our Primary Light Source",
        content: "The Sun gives out or emits its own light and is the main source of natural light on Earth. It provides energy and warmth to our planet.",
        visual: "sun",
        keyPoints: [
            "The Sun emits its own light",
            "Main source of light on Earth",
            "Provides energy for life"
        ]
    },
    {
        id: 4,
        title: "Artificial Light - Fire",
        content: "In ancient times, humans learned to create fire — the earliest form of artificial lighting. Fire became essential for survival and development.",
        visual: "fire",
        keyPoints: [
            "Fire was the first artificial light",
            "Created using different fuels",
            "Used animal fat, oil, wax, and gas"
        ]
    },
    {
        id: 5,
        title: "Modern Electric Lighting",
        content: "With the invention of electricity, we developed various electric light sources. Today, most lighting needs are met by electric lights.",
        visual: "led",
        keyPoints: [
            "Invention of electricity revolutionized lighting",
            "Multiple types of electric lights available",
            "More efficient than fire-based lighting"
        ]
    },
    {
        id: 6,
        title: "Luminous Objects",
        content: "Objects that emit their own light are called luminous objects. Examples include the Sun, stars, fireflies, and light bulbs.",
        visual: "firefly",
        keyPoints: [
            "Emit their own light",
            "Examples: Sun, stars, fireflies, bulbs",
            "Can be natural or artificial"
        ]
    },
    {
        id: 7,
        title: "Non-Luminous Objects",
        content: "Objects that do not emit their own light are called non-luminous objects. They can only be seen when light from a luminous object falls on them.",
        visual: "moon",
        keyPoints: [
            "Do not emit their own light",
            "Need external light to be visible",
            "Examples: Moon, planets, most objects around us"
        ]
    },
    {
        id: 8,
        title: "Summary",
        content: "We've learned about natural and artificial sources of light, luminous and non-luminous objects!",
        visual: "summary",
        keyPoints: [
            "Light comes from natural and artificial sources",
            "Luminous objects emit their own light",
            "Non-luminous objects reflect light"
        ]
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// PRACTICE MODE QUESTIONS
// ═══════════════════════════════════════════════════════════════════════════

const practiceQuestions: PracticeQuestion[] = [
    {
        id: 1,
        question: "Which of the following is a luminous object?",
        options: ["Moon", "Mirror", "Sun", "Book"],
        correctAnswer: 2,
        explanation: "The Sun is a luminous object because it emits its own light. The Moon, mirror, and book are non-luminous objects."
    },
    {
        id: 2,
        question: "What type of object is the Moon?",
        options: ["Luminous", "Non-luminous", "Transparent", "Opaque"],
        correctAnswer: 1,
        explanation: "The Moon is a non-luminous object. It doesn't produce its own light but reflects sunlight."
    },
    {
        id: 3,
        question: "Which was the earliest form of artificial lighting?",
        options: ["Electric bulb", "LED lamp", "Fire", "Candle"],
        correctAnswer: 2,
        explanation: "Fire was the earliest form of artificial lighting that humans learned to create and control."
    },
    {
        id: 4,
        question: "Why are LED lamps better than traditional lamps?",
        options: [
            "They are cheaper",
            "They consume less power and last longer",
            "They are bigger",
            "They produce more heat"
        ],
        correctAnswer: 1,
        explanation: "LED lamps consume much less power, are brighter, last longer, and are better for the environment."
    },
    {
        id: 5,
        question: "Which of these is a natural source of light?",
        options: ["LED lamp", "Candle", "Lightning", "Flashlight"],
        correctAnswer: 2,
        explanation: "Lightning is a natural source of light. LED lamps, candles, and flashlights are artificial sources."
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const SourcesOfLightLearnMode: React.FC<SourcesOfLightLearnModeProps> = ({
    props: propsParam,
    setStepDetails,
    stopAutoNext = false,
    setStopAutoNext
}) => {
    // Extract props with defaults
    const propsWithDefaults: ComponentProps = propsParam || {};
    const {
        width = 900,
        height = 700,
        initialMode = 'learn',
        showModeSelector = true,
        enabledModes = ['learn', 'practice', 'explore'],
        showNavigation = true,
        showPlayPause = true,
        showStepIndicator = true,
        initialStep = 1,
        filterSteps,
        animationSpeed = 1,
        autoPlayDuration = 8000,
        themeColor = '#f59e0b',
        darkMode = false,
        additionalProps = {}
    } = propsWithDefaults;

    // State management
    const [currentMode, setCurrentMode] = useState<ModeType>(initialMode);
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [isPlaying, setIsPlaying] = useState(false);
    const [transitioning, setTransitioning] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
    
    const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout>>();
    const animationFrameRef = useRef<number>();

    // Filter steps if needed
    const filteredSteps = filterSteps 
        ? learnSteps.filter(step => filterSteps.includes(step.id))
        : learnSteps;

    const totalSteps = currentMode === 'learn' ? filteredSteps.length : practiceQuestions.length;

    // Inject keyframe animations
    useEffect(() => {
        const styleId = 'sources-of-light-animations';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes smoothPulse {
                    0%, 100% { 
                        opacity: 1; 
                        transform: scale(1);
                        filter: brightness(1);
                    }
                    50% { 
                        opacity: 0.85; 
                        transform: scale(1.05);
                        filter: brightness(1.2);
                    }
                }
                @keyframes realisticTwinkle {
                    0% { 
                        opacity: 0.4; 
                        transform: scale(0.9);
                        filter: blur(0px);
                    }
                    20% { 
                        opacity: 0.8; 
                        transform: scale(1.1);
                        filter: blur(0.5px);
                    }
                    40% { 
                        opacity: 1; 
                        transform: scale(1.3);
                        filter: blur(1px);
                    }
                    60% { 
                        opacity: 0.9; 
                        transform: scale(1.15);
                        filter: blur(0.8px);
                    }
                    80% { 
                        opacity: 0.6; 
                        transform: scale(0.95);
                        filter: blur(0.3px);
                    }
                    100% { 
                        opacity: 0.4; 
                        transform: scale(0.9);
                        filter: blur(0px);
                    }
                }
                @keyframes fireflyGlow {
                    0%, 100% { 
                        opacity: 0.3;
                        transform: scale(0.8) translateY(0);
                        filter: blur(3px) brightness(1);
                        box-shadow: 0 0 15px currentColor, 0 0 30px currentColor;
                    }
                    25% { 
                        opacity: 0.7;
                        transform: scale(1) translateY(-2px);
                        filter: blur(4px) brightness(1.3);
                        box-shadow: 0 0 25px currentColor, 0 0 50px currentColor;
                    }
                    50% { 
                        opacity: 1;
                        transform: scale(1.2) translateY(-3px);
                        filter: blur(5px) brightness(1.5);
                        box-shadow: 0 0 35px currentColor, 0 0 70px currentColor;
                    }
                    75% { 
                        opacity: 0.7;
                        transform: scale(1) translateY(-2px);
                        filter: blur(4px) brightness(1.3);
                        box-shadow: 0 0 25px currentColor, 0 0 50px currentColor;
                    }
                }
                @keyframes lightningFlash {
                    0%, 10%, 15%, 100% { 
                        opacity: 0;
                        filter: brightness(1) drop-shadow(0 0 0px white);
                    }
                    11%, 14% { 
                        opacity: 1;
                        filter: brightness(2) drop-shadow(0 0 20px white) drop-shadow(0 0 40px #60a5fa);
                    }
                    12%, 13% { 
                        opacity: 0.7;
                        filter: brightness(1.5) drop-shadow(0 0 15px white) drop-shadow(0 0 30px #60a5fa);
                    }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes realisticFire {
                    0% { 
                        transform: scale(1, 1) translateY(0) skewX(0deg);
                        opacity: 1;
                        filter: blur(8px) hue-rotate(0deg);
                    }
                    10% { 
                        transform: scale(1.02, 1.05) translateY(-2px) skewX(2deg);
                        opacity: 0.95;
                        filter: blur(9px) hue-rotate(5deg);
                    }
                    20% { 
                        transform: scale(0.98, 0.97) translateY(1px) skewX(-3deg);
                        opacity: 0.98;
                        filter: blur(7px) hue-rotate(-3deg);
                    }
                    30% { 
                        transform: scale(1.03, 1.08) translateY(-3px) skewX(1deg);
                        opacity: 0.92;
                        filter: blur(10px) hue-rotate(8deg);
                    }
                    40% { 
                        transform: scale(0.99, 0.95) translateY(2px) skewX(-2deg);
                        opacity: 0.96;
                        filter: blur(8px) hue-rotate(-5deg);
                    }
                    50% { 
                        transform: scale(1.01, 1.06) translateY(-2px) skewX(3deg);
                        opacity: 0.94;
                        filter: blur(9px) hue-rotate(6deg);
                    }
                    60% { 
                        transform: scale(0.97, 0.96) translateY(1px) skewX(-1deg);
                        opacity: 0.97;
                        filter: blur(7px) hue-rotate(-4deg);
                    }
                    70% { 
                        transform: scale(1.02, 1.07) translateY(-3px) skewX(2deg);
                        opacity: 0.93;
                        filter: blur(10px) hue-rotate(7deg);
                    }
                    80% { 
                        transform: scale(0.98, 0.94) translateY(2px) skewX(-3deg);
                        opacity: 0.98;
                        filter: blur(8px) hue-rotate(-6deg);
                    }
                    90% { 
                        transform: scale(1.01, 1.05) translateY(-1px) skewX(1deg);
                        opacity: 0.95;
                        filter: blur(9px) hue-rotate(4deg);
                    }
                    100% { 
                        transform: scale(1, 1) translateY(0) skewX(0deg);
                        opacity: 1;
                        filter: blur(8px) hue-rotate(0deg);
                    }
                }
                @keyframes sunRayRotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes sunCorePulse {
                    0%, 100% { 
                        transform: translate(-50%, -50%) scale(1);
                        filter: brightness(1) contrast(1);
                    }
                    50% { 
                        transform: translate(-50%, -50%) scale(1.03);
                        filter: brightness(1.1) contrast(1.05);
                    }
                }
                @keyframes sunGlowPulse {
                    0%, 100% { 
                        opacity: 1;
                        transform: scale(1);
                        filter: blur(30px) brightness(1);
                    }
                    50% { 
                        opacity: 0.85;
                        transform: scale(1.08);
                        filter: blur(35px) brightness(1.15);
                    }
                }
                @keyframes sunRayShimmer {
                    0%, 100% { 
                        opacity: 0.8;
                        filter: blur(2px) brightness(1);
                    }
                    50% { 
                        opacity: 1;
                        filter: blur(3px) brightness(1.2);
                    }
                }
                @keyframes sunspotMove {
                    0%, 100% { 
                        transform: scale(1) translate(0, 0);
                        opacity: 0.4;
                    }
                    50% { 
                        transform: scale(1.1) translate(1px, 1px);
                        opacity: 0.5;
                    }
                }
                @keyframes granulePulse {
                    0%, 100% { 
                        opacity: 0.6;
                        transform: scale(1);
                        filter: blur(2px) brightness(1);
                    }
                    50% { 
                        opacity: 0.9;
                        transform: scale(1.15);
                        filter: blur(3px) brightness(1.3);
                    }
                }
                @keyframes ledPulse {
                    0%, 100% { 
                        box-shadow: 0 0 40px currentColor, inset 0 -20px 40px rgba(251, 191, 36, 0.3);
                        filter: brightness(1);
                    }
                    50% { 
                        box-shadow: 0 0 60px currentColor, 0 0 80px currentColor, inset 0 -20px 50px rgba(251, 191, 36, 0.5);
                        filter: brightness(1.2);
                    }
                }
                @keyframes moonGlow {
                    0%, 100% { 
                        box-shadow: inset -20px 0 40px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.3);
                    }
                    50% { 
                        box-shadow: inset -20px 0 40px rgba(0,0,0,0.3), 0 0 60px rgba(255,255,255,0.5);
                    }
                }
                @keyframes lightBeam {
                    0%, 100% { 
                        opacity: 0.3;
                        transform: rotate(-15deg) scaleX(1);
                    }
                    50% { 
                        opacity: 0.5;
                        transform: rotate(-15deg) scaleX(1.1);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    // Update step details
    useEffect(() => {
        if (setStepDetails) {
            const stepData = currentMode === 'learn' 
                ? filteredSteps[currentStep - 1]
                : practiceQuestions[currentStep - 1];
            
            const stepTitle = currentMode === 'learn' && stepData && 'title' in stepData
                ? stepData.title
                : 'Practice Question';
            
            setStepDetails({
                currentStep,
                totalSteps,
                mode: currentMode,
                stepTitle
            });
        }
    }, [currentStep, currentMode, totalSteps, setStepDetails, filteredSteps]);

    // Auto-play functionality
    useEffect(() => {
        if (isPlaying && !stopAutoNext && autoPlayDuration > 0) {
            autoPlayTimerRef.current = setTimeout(() => {
                handleNext();
            }, autoPlayDuration / animationSpeed);
        }
        return () => {
            if (autoPlayTimerRef.current) {
                clearTimeout(autoPlayTimerRef.current);
            }
        };
    }, [isPlaying, currentStep, stopAutoNext, autoPlayDuration, animationSpeed]);

    // Navigation handlers
    const handleNext = useCallback(() => {
        if (currentStep < totalSteps) {
            setTransitioning(true);
            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                setTransitioning(false);
                setSelectedAnswer(null);
                setShowExplanation(false);
            }, 300);
        }
    }, [currentStep, totalSteps]);

    const handlePrevious = useCallback(() => {
        if (currentStep > 1) {
            setTransitioning(true);
            setTimeout(() => {
                setCurrentStep(prev => prev - 1);
                setTransitioning(false);
                setSelectedAnswer(null);
                setShowExplanation(false);
            }, 300);
        }
    }, [currentStep]);

    const handleModeChange = (mode: ModeType) => {
        setTransitioning(true);
        setTimeout(() => {
            setCurrentMode(mode);
            setCurrentStep(1);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setTransitioning(false);
        }, 300);
    };

    const handleAnswerSelect = (index: number) => {
        if (selectedAnswer !== null) return;
        
        setSelectedAnswer(index);
        setShowExplanation(true);
        
        const question = practiceQuestions[currentStep - 1];
        if (index === question.correctAnswer && !answeredQuestions.has(question.id)) {
            setScore(prev => prev + 1);
            setAnsweredQuestions(prev => new Set(prev).add(question.id));
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // VISUAL COMPONENTS
    // ═══════════════════════════════════════════════════════════════════════

    const renderSunVisual = () => (
        <div style={{
            position: 'relative',
            width: '320px',
            height: '320px',
            margin: '0 auto'
        }}>
            {/* Outermost corona glow - realistic sun corona */}
            <div style={{
                position: 'absolute',
                inset: '-80px',
                background: 'radial-gradient(circle, rgba(255, 255, 200, 0.15) 0%, rgba(255, 200, 100, 0.1) 20%, rgba(255, 150, 50, 0.08) 40%, rgba(255, 100, 0, 0.05) 60%, transparent 80%)',
                animation: 'sunGlowPulse 6s ease-in-out infinite',
                borderRadius: '50%',
                filter: 'blur(40px)'
            }} />
            
            {/* Secondary corona layer */}
            <div style={{
                position: 'absolute',
                inset: '-60px',
                background: 'radial-gradient(circle, rgba(255, 255, 220, 0.2) 0%, rgba(255, 220, 120, 0.15) 25%, rgba(255, 180, 80, 0.1) 45%, rgba(255, 120, 40, 0.06) 65%, transparent 85%)',
                animation: 'sunGlowPulse 5s ease-in-out infinite',
                animationDelay: '0.5s',
                borderRadius: '50%',
                filter: 'blur(30px)'
            }} />
            
            {/* Inner corona glow */}
            <div style={{
                position: 'absolute',
                inset: '-40px',
                background: 'radial-gradient(circle, rgba(255, 255, 240, 0.25) 0%, rgba(255, 240, 150, 0.2) 30%, rgba(255, 200, 100, 0.12) 50%, rgba(255, 150, 50, 0.08) 70%, transparent 90%)',
                animation: 'sunGlowPulse 4.5s ease-in-out infinite',
                animationDelay: '1s',
                borderRadius: '50%',
                filter: 'blur(25px)'
            }} />
            
            {/* Rotating sun rays - outer layer - more realistic */}
            <div style={{
                position: 'absolute',
                inset: '-15px',
                animation: 'sunRayRotate 45s linear infinite',
            }}>
                {[...Array(32)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: i % 3 === 0 ? '6px' : i % 3 === 1 ? '4px' : '5px',
                        height: i % 3 === 0 ? '120px' : i % 3 === 1 ? '100px' : '110px',
                        background: `linear-gradient(180deg, 
                            rgba(255, 255, 200, 0.9) 0%, 
                            rgba(255, 220, 120, 0.7) 20%, 
                            rgba(255, 180, 80, 0.5) 40%, 
                            rgba(255, 140, 40, 0.3) 60%,
                            rgba(255, 100, 0, 0.15) 80%,
                            transparent 100%
                        )`,
                        transformOrigin: 'top center',
                        transform: `translateX(-50%) rotate(${i * 11.25}deg)`,
                        borderRadius: '3px',
                        animation: 'sunRayShimmer 3s ease-in-out infinite',
                        animationDelay: `${i * 0.08}s`,
                        opacity: 0.7 + (i % 3) * 0.1,
                        filter: 'blur(1px)'
                    }} />
                ))}
            </div>
            
            {/* Counter-rotating inner rays */}
            <div style={{
                position: 'absolute',
                inset: '15px',
                animation: 'sunRayRotate 35s linear infinite reverse',
            }}>
                {[...Array(24)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: '3px',
                        height: '85px',
                        background: `linear-gradient(180deg, 
                            rgba(255, 255, 220, 0.8) 0%, 
                            rgba(255, 240, 150, 0.6) 25%, 
                            rgba(255, 200, 100, 0.4) 50%, 
                            rgba(255, 150, 50, 0.25) 75%,
                            transparent 100%
                        )`,
                        transformOrigin: 'top center',
                        transform: `translateX(-50%) rotate(${i * 15}deg)`,
                        borderRadius: '2px',
                        animation: 'sunRayShimmer 2.5s ease-in-out infinite',
                        animationDelay: `${i * 0.12}s`,
                        opacity: 0.85,
                        filter: 'blur(0.5px)'
                    }} />
                ))}
            </div>
            
            {/* Sun photosphere (main body) - realistic sun colors */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: `
                    radial-gradient(circle at 30% 30%, 
                        #ffffff 0%,
                        #ffffe0 5%,
                        #ffffcc 10%,
                        #fff8dc 18%,
                        #ffe4b5 28%,
                        #ffd700 40%,
                        #ffa500 55%,
                        #ff8c00 70%,
                        #ff6347 85%,
                        #ff4500 100%
                    )
                `,
                animation: 'sunCorePulse 5.5s ease-in-out infinite',
                boxShadow: `
                    0 0 60px rgba(255, 255, 200, 0.8),
                    0 0 100px rgba(255, 220, 120, 0.6),
                    0 0 140px rgba(255, 180, 80, 0.4),
                    0 0 180px rgba(255, 140, 40, 0.3),
                    0 0 220px rgba(255, 100, 0, 0.2),
                    inset 0 0 50px rgba(255, 255, 255, 0.6),
                    inset -25px -25px 70px rgba(255, 69, 0, 0.3)
                `
            }}>
                {/* Realistic sunspots - darker and more visible */}
                <div style={{
                    position: 'absolute',
                    left: '45%',
                    top: '35%',
                    width: '20px',
                    height: '20px',
                    background: 'radial-gradient(circle, #8b0000 0%, #5c0000 50%, #3d0000 100%)',
                    borderRadius: '50%',
                    filter: 'blur(2.5px)',
                    animation: 'sunspotMove 8s ease-in-out infinite',
                    boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.8), 0 0 4px rgba(139, 0, 0, 0.5)'
                }} />
                
                <div style={{
                    position: 'absolute',
                    left: '60%',
                    top: '55%',
                    width: '16px',
                    height: '16px',
                    background: 'radial-gradient(circle, #8b0000 0%, #5c0000 50%, #3d0000 100%)',
                    borderRadius: '50%',
                    filter: 'blur(2px)',
                    animation: 'sunspotMove 7s ease-in-out infinite',
                    animationDelay: '1s',
                    boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.8), 0 0 3px rgba(139, 0, 0, 0.5)'
                }} />
                
                <div style={{
                    position: 'absolute',
                    left: '30%',
                    top: '60%',
                    width: '14px',
                    height: '14px',
                    background: 'radial-gradient(circle, #8b0000 0%, #5c0000 50%, #3d0000 100%)',
                    borderRadius: '50%',
                    filter: 'blur(1.8px)',
                    animation: 'sunspotMove 9s ease-in-out infinite',
                    animationDelay: '2s',
                    boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.8), 0 0 2px rgba(139, 0, 0, 0.5)'
                }} />
                
                {/* Realistic photosphere granules - more numerous and varied */}
                {[...Array(20)].map((_, i) => {
                    const angle = (i * 18) * Math.PI / 180;
                    const radius = 40 + Math.random() * 35;
                    const x = 50 + radius * Math.cos(angle);
                    const y = 50 + radius * Math.sin(angle);
                    const size = 6 + Math.random() * 10;
                    const brightness = 0.7 + Math.random() * 0.3;
                    
                    return (
                        <div key={i} style={{
                            position: 'absolute',
                            left: `${x}%`,
                            top: `${y}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            background: `radial-gradient(circle, rgba(255, 255, 255, ${brightness}), rgba(255, 255, 200, ${brightness * 0.6}), rgba(255, 240, 180, ${brightness * 0.3}), transparent)`,
                            borderRadius: '50%',
                            animation: 'granulePulse 3.5s ease-in-out infinite',
                            animationDelay: `${i * 0.15}s`,
                            filter: 'blur(1px)'
                        }} />
                    );
                })}
                
                {/* Main bright core (white-hot center) */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '25%',
                    width: '50px',
                    height: '50px',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 240, 0.9) 25%, rgba(255, 255, 200, 0.7) 50%, rgba(255, 240, 180, 0.4) 75%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(15px)',
                    animation: 'granulePulse 4s ease-in-out infinite',
                    boxShadow: '0 0 30px rgba(255, 255, 255, 0.9), 0 0 50px rgba(255, 255, 200, 0.6)'
                }} />
                
                {/* Secondary bright regions */}
                <div style={{
                    position: 'absolute',
                    top: '38%',
                    right: '20%',
                    width: '35px',
                    height: '35px',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 220, 0.7) 40%, rgba(255, 240, 200, 0.5) 70%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(10px)',
                    animation: 'granulePulse 3.5s ease-in-out infinite',
                    animationDelay: '0.8s'
                }} />
                
                <div style={{
                    position: 'absolute',
                    bottom: '25%',
                    left: '32%',
                    width: '28px',
                    height: '28px',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.85) 0%, rgba(255, 250, 200, 0.65) 45%, rgba(255, 230, 180, 0.4) 75%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(8px)',
                    animation: 'granulePulse 4.5s ease-in-out infinite',
                    animationDelay: '1.5s'
                }} />
                
                {/* Additional bright spots for realism */}
                <div style={{
                    position: 'absolute',
                    top: '55%',
                    left: '45%',
                    width: '22px',
                    height: '22px',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 245, 190, 0.6) 50%, transparent 85%)',
                    borderRadius: '50%',
                    filter: 'blur(6px)',
                    animation: 'granulePulse 3.8s ease-in-out infinite',
                    animationDelay: '2.2s'
                }} />
            </div>
            
            {/* Realistic solar flare effect */}
            <div style={{
                position: 'absolute',
                left: '15%',
                top: '25%',
                width: '80px',
                height: '12px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 200, 0.7) 25%, rgba(255, 200, 100, 0.8) 50%, rgba(255, 150, 50, 0.7) 75%, transparent 100%)',
                borderRadius: '6px',
                filter: 'blur(6px)',
                transform: 'rotate(-35deg)',
                animation: 'sunRayShimmer 8s ease-in-out infinite',
                animationDelay: '2s',
                opacity: 0.7
            }} />
            
            {/* Additional solar prominences */}
            <div style={{
                position: 'absolute',
                right: '12%',
                bottom: '22%',
                width: '60px',
                height: '10px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 240, 150, 0.6) 35%, rgba(255, 180, 80, 0.7) 60%, rgba(255, 120, 40, 0.5) 85%, transparent 100%)',
                borderRadius: '5px',
                filter: 'blur(5px)',
                transform: 'rotate(25deg)',
                animation: 'sunRayShimmer 7s ease-in-out infinite',
                animationDelay: '3s',
                opacity: 0.6
            }} />
            
            {/* Extra prominence for more realism */}
            <div style={{
                position: 'absolute',
                left: '25%',
                bottom: '30%',
                width: '45px',
                height: '8px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 220, 120, 0.5) 40%, rgba(255, 160, 60, 0.6) 60%, transparent 100%)',
                borderRadius: '4px',
                filter: 'blur(4px)',
                transform: 'rotate(45deg)',
                animation: 'sunRayShimmer 6.5s ease-in-out infinite',
                animationDelay: '4s',
                opacity: 0.5
            }} />
        </div>
    );

    const renderStarsVisual = () => (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '300px',
            background: 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 50%, #1e293b 100%)',
            borderRadius: '16px',
            overflow: 'hidden'
        }}>
            {/* Background stars (small) */}
            {[...Array(50)].map((_, i) => (
                <div key={`bg-${i}`} style={{
                    position: 'absolute',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: '1px',
                    height: '1px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    opacity: Math.random() * 0.5 + 0.2,
                    boxShadow: '0 0 2px #ffffff'
                }} />
            ))}
            
            {/* Main twinkling stars */}
            {[...Array(25)].map((_, i) => {
                const size = 2 + Math.random() * 4;
                const duration = 2 + Math.random() * 4;
                const delay = Math.random() * 3;
                return (
                    <div key={i} style={{
                        position: 'absolute',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        borderRadius: '50%',
                        background: '#ffffff',
                        boxShadow: `0 0 ${size * 3}px #ffffff, 0 0 ${size * 5}px rgba(255,255,255,0.5)`,
                        animation: `realisticTwinkle ${duration}s ease-in-out infinite`,
                        animationDelay: `${delay}s`
                    }} />
                );
            })}
            
            {/* Bright featured stars with cross pattern */}
            {[...Array(5)].map((_, i) => {
                const positions = [
                    { left: '15%', top: '20%' },
                    { left: '75%', top: '15%' },
                    { left: '40%', top: '60%' },
                    { left: '85%', top: '70%' },
                    { left: '25%', top: '80%' }
                ];
                const pos = positions[i];
                return (
                    <div key={`bright-${i}`} style={{
                        position: 'absolute',
                        ...pos,
                        width: '6px',
                        height: '6px'
                    }}>
                        {/* Main star */}
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#ffffff',
                            boxShadow: '0 0 15px #ffffff, 0 0 25px rgba(255,255,255,0.8)',
                            animation: `realisticTwinkle ${3 + i * 0.5}s ease-in-out infinite`,
                            animationDelay: `${i * 0.4}s`
                        }} />
                        {/* Cross effect - horizontal */}
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '20px',
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, #ffffff, transparent)',
                            filter: 'blur(0.5px)',
                            animation: `realisticTwinkle ${3 + i * 0.5}s ease-in-out infinite`,
                            animationDelay: `${i * 0.4}s`
                        }} />
                        {/* Cross effect - vertical */}
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '1px',
                            height: '20px',
                            background: 'linear-gradient(180deg, transparent, #ffffff, transparent)',
                            filter: 'blur(0.5px)',
                            animation: `realisticTwinkle ${3 + i * 0.5}s ease-in-out infinite`,
                            animationDelay: `${i * 0.4}s`
                        }} />
                    </div>
                );
            })}
        </div>
    );

    const renderFireflyVisual = () => (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '300px',
            background: 'linear-gradient(180deg, #0d1f1a 0%, #1a2e26 50%, #0f1419 100%)',
            borderRadius: '16px',
            overflow: 'hidden'
        }}>
            {/* Foliage silhouettes */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '80px',
                background: 'linear-gradient(180deg, transparent 0%, #000000aa 100%)',
                opacity: 0.6
            }} />
            
            {/* Fireflies with realistic glow */}
            {[...Array(12)].map((_, i) => {
                const x = 15 + Math.random() * 70;
                const y = 15 + Math.random() * 60;
                const duration = 1.8 + Math.random() * 1.5;
                const delay = Math.random() * 2;
                
                return (
                    <div key={i} style={{
                        position: 'absolute',
                        left: `${x}%`,
                        top: `${y}%`,
                        width: '16px',
                        height: '16px'
                    }}>
                        {/* Outer glow */}
                        <div style={{
                            position: 'absolute',
                            inset: '-20px',
                            background: 'radial-gradient(circle, #ffd70060 0%, transparent 70%)',
                            animation: `fireflyGlow ${duration}s ease-in-out infinite`,
                            animationDelay: `${delay}s`,
                            borderRadius: '50%'
                        }} />
                        
                        {/* Core light */}
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, #ffed4e, #ffd700)',
                            boxShadow: '0 0 20px #ffd700, 0 0 40px #ffd700aa',
                            animation: `fireflyGlow ${duration}s ease-in-out infinite`,
                            animationDelay: `${delay}s`,
                            filter: 'blur(1px)'
                        }} />
                        
                        {/* Inner bright spot */}
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: '#ffffff',
                            animation: `fireflyGlow ${duration}s ease-in-out infinite`,
                            animationDelay: `${delay}s`
                        }} />
                    </div>
                );
            })}
        </div>
    );

    const renderLightningVisual = () => (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '300px',
            background: 'linear-gradient(180deg, #1a1f3a 0%, #2d3748 50%, #475569 100%)',
            borderRadius: '16px',
            overflow: 'hidden'
        }}>
            {/* Storm clouds */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '120px',
                background: 'radial-gradient(ellipse at top, #374151 0%, transparent 100%)',
                opacity: 0.8
            }} />
            
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                <defs>
                    <filter id="lightning-glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                {/* Main lightning bolt */}
                <path
                    d="M 180 30 L 160 90 L 175 90 L 155 140 L 140 180 L 155 180 L 130 240"
                    stroke="#ffffff"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        filter: 'url(#lightning-glow) drop-shadow(0 0 15px #60a5fa)',
                        animation: 'lightningFlash 4s ease-in-out infinite'
                    }}
                />
                
                {/* Secondary bolt */}
                <path
                    d="M 175 90 L 195 120 L 185 150"
                    stroke="#e0f2fe"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    style={{
                        filter: 'url(#lightning-glow)',
                        animation: 'lightningFlash 4s ease-in-out infinite',
                        animationDelay: '0.05s',
                        opacity: 0.8
                    }}
                />
                
                {/* Tertiary branch */}
                <path
                    d="M 155 140 L 170 165 L 165 185"
                    stroke="#dbeafe"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    style={{
                        filter: 'url(#lightning-glow)',
                        animation: 'lightningFlash 4s ease-in-out infinite',
                        animationDelay: '0.08s',
                        opacity: 0.6
                    }}
                />
            </svg>
            
            {/* Flash effect on sky */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.4) 0%, transparent 60%)',
                animation: 'lightningFlash 4s ease-in-out infinite',
                mixBlendMode: 'screen'
            }} />
        </div>
    );

    const renderFireVisual = () => (
        <div style={{
            position: 'relative',
            width: '200px',
            height: '280px',
            margin: '0 auto'
        }}>
            {/* Ambient glow around candle */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '35px',
                transform: 'translateX(-50%)',
                width: '160px',
                height: '160px',
                background: 'radial-gradient(circle, rgba(255, 140, 50, 0.4) 0%, rgba(255, 180, 80, 0.2) 40%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(20px)',
                animation: 'smoothPulse 2.5s ease-in-out infinite'
            }} />
            
            {/* Flame using SVG for proper teardrop shape */}
            <svg width="80" height="100" style={{
                position: 'absolute',
                left: '50%',
                top: '8px',
                transform: 'translateX(-50%)',
                overflow: 'visible'
            }}>
                <defs>
                    {/* Gradient for outer flame */}
                    <radialGradient id="outerFlame" cx="50%" cy="60%">
                        <stop offset="0%" stopColor="#ff4500" stopOpacity="0" />
                        <stop offset="30%" stopColor="#ff4500" stopOpacity="0.6" />
                        <stop offset="60%" stopColor="#ff6b35" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ff8c50" stopOpacity="0.3" />
                    </radialGradient>
                    
                    {/* Gradient for middle flame */}
                    <radialGradient id="middleFlame" cx="50%" cy="60%">
                        <stop offset="0%" stopColor="#ffd700" stopOpacity="0.3" />
                        <stop offset="30%" stopColor="#ffa500" stopOpacity="0.8" />
                        <stop offset="70%" stopColor="#ff8c00" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.4" />
                    </radialGradient>
                    
                    {/* Gradient for inner flame */}
                    <radialGradient id="innerFlame" cx="50%" cy="70%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                        <stop offset="30%" stopColor="#fef3c7" stopOpacity="0.9" />
                        <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ffa500" stopOpacity="0.3" />
                    </radialGradient>
                    
                    {/* Blur filter for flame softness */}
                    <filter id="flameBlur">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                    </filter>
                    
                    <filter id="flameSoftBlur">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                    </filter>
                </defs>
                
                {/* Outer flame layer (largest, most blurred) */}
                <path
                    d="M 40 95 Q 20 70 25 50 Q 28 30 35 15 Q 40 3 40 3 Q 40 3 45 15 Q 52 30 55 50 Q 60 70 40 95 Z"
                    fill="url(#outerFlame)"
                    filter="url(#flameSoftBlur)"
                    style={{
                        animation: 'realisticFire 1.8s ease-in-out infinite',
                        transformOrigin: '40px 90px'
                    }}
                />
                
                {/* Middle flame layer */}
                <path
                    d="M 40 92 Q 24 72 28 52 Q 30 35 37 20 Q 40 8 40 8 Q 40 8 43 20 Q 50 35 52 52 Q 56 72 40 92 Z"
                    fill="url(#middleFlame)"
                    filter="url(#flameBlur)"
                    style={{
                        animation: 'realisticFire 1.4s ease-in-out infinite',
                        animationDelay: '0.2s',
                        transformOrigin: '40px 90px'
                    }}
                />
                
                {/* Inner flame layer (bright core) */}
                <path
                    d="M 40 88 Q 28 73 30 56 Q 32 42 38 28 Q 40 18 40 18 Q 40 18 42 28 Q 48 42 50 56 Q 52 73 40 88 Z"
                    fill="url(#innerFlame)"
                    filter="url(#flameBlur)"
                    style={{
                        animation: 'realisticFire 1.1s ease-in-out infinite',
                        animationDelay: '0.4s',
                        transformOrigin: '40px 85px'
                    }}
                />
                
                {/* Hottest core (white-yellow center) */}
                <ellipse
                    cx="40"
                    cy="65"
                    rx="8"
                    ry="18"
                    fill="url(#innerFlame)"
                    filter="url(#flameBlur)"
                    style={{
                        animation: 'realisticFire 0.9s ease-in-out infinite',
                        animationDelay: '0.1s',
                        transformOrigin: '40px 65px'
                    }}
                />
            </svg>
            
            {/* Wick - dark center */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '92px',
                transform: 'translateX(-50%)',
                width: '3px',
                height: '14px',
                background: 'linear-gradient(180deg, #000000 0%, #1a1a1a 30%, #3d2006 100%)',
                borderRadius: '1.5px 1.5px 0 0',
                zIndex: 5
            }}>
                {/* Wick ember (glowing tip) */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '-2px',
                    transform: 'translateX(-50%)',
                    width: '5px',
                    height: '5px',
                    background: 'radial-gradient(circle, #ff6b35, #ff4500)',
                    borderRadius: '50%',
                    boxShadow: '0 0 8px #ff6b35, 0 0 12px #ffa500',
                    animation: 'smoothPulse 1.2s ease-in-out infinite'
                }} />
                
                {/* Burning tip glow */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '0',
                    transform: 'translateX(-50%)',
                    width: '2px',
                    height: '6px',
                    background: 'linear-gradient(180deg, #ff4500, transparent)',
                    filter: 'blur(1px)'
                }} />
            </div>
            
            {/* Candle body */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '100px',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '120px',
                background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 15%, #fcd34d 75%, #fbbf24 100%)',
                borderRadius: '4px 4px 8px 8px',
                boxShadow: 'inset -4px 0 10px rgba(0,0,0,0.08), inset 4px 0 10px rgba(255,255,255,0.4), 0 5px 10px rgba(0,0,0,0.15)',
                overflow: 'hidden'
            }}>
                {/* Candle shine/highlight (left side) */}
                <div style={{
                    position: 'absolute',
                    left: '6px',
                    top: '12px',
                    width: '14px',
                    height: '70px',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.1) 70%, transparent 100%)',
                    borderRadius: '7px',
                    filter: 'blur(2px)'
                }} />
                
                {/* Secondary highlight (right side, subtle) */}
                <div style={{
                    position: 'absolute',
                    right: '8px',
                    top: '20px',
                    width: '8px',
                    height: '50px',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                    borderRadius: '4px',
                    filter: 'blur(2px)'
                }} />
                
                {/* Wax drip texture - left */}
                <div style={{
                    position: 'absolute',
                    left: '4px',
                    top: '6px',
                    width: '4px',
                    height: '28px',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '2px',
                    filter: 'blur(1px)'
                }} />
                
                {/* Wax drip texture - right */}
                <div style={{
                    position: 'absolute',
                    right: '12px',
                    top: '18px',
                    width: '3px',
                    height: '35px',
                    background: 'rgba(255,255,255,0.4)',
                    borderRadius: '2px',
                    filter: 'blur(1px)'
                }} />
                
                {/* Shadow on right edge */}
                <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '8px',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.08) 100%)',
                    borderRadius: '0 4px 8px 0'
                }} />
            </div>
            
            {/* Melted wax pool on top */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '97px',
                transform: 'translateX(-50%)',
                width: '58px',
                height: '9px',
                background: 'radial-gradient(ellipse at center, #fef8e1 0%, #fef3c7 40%, #fde68a 80%)',
                borderRadius: '50%',
                boxShadow: 'inset 0 2px 5px rgba(251, 191, 36, 0.4), 0 1px 0 rgba(255,255,255,0.3)',
                zIndex: 3
            }}>
                {/* Liquid wax shine */}
                <div style={{
                    position: 'absolute',
                    left: '25%',
                    top: '15%',
                    width: '18px',
                    height: '4px',
                    background: 'rgba(255,255,255,0.6)',
                    borderRadius: '50%',
                    filter: 'blur(1px)'
                }} />
                
                {/* Small reflection spot */}
                <div style={{
                    position: 'absolute',
                    right: '25%',
                    top: '20%',
                    width: '8px',
                    height: '3px',
                    background: 'rgba(255,255,255,0.4)',
                    borderRadius: '50%',
                    filter: 'blur(0.5px)'
                }} />
            </div>
            
            {/* Candle holder/base */}
            <div style={{
                position: 'absolute',
                left: '50%',
                bottom: '20px',
                transform: 'translateX(-50%)',
                width: '82px',
                height: '16px',
                background: 'linear-gradient(180deg, #9d8361 0%, #8b7355 50%, #6b5642 100%)',
                borderRadius: '20px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.2)'
            }}>
                {/* Holder rim (top edge) */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '-4px',
                    transform: 'translateX(-50%)',
                    width: '78px',
                    height: '7px',
                    background: 'linear-gradient(180deg, #b39475 0%, #a0826d 50%, #8b7355 100%)',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)'
                }} />
                
                {/* Metallic shine on holder */}
                <div style={{
                    position: 'absolute',
                    left: '20%',
                    top: '30%',
                    width: '30px',
                    height: '4px',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '2px',
                    filter: 'blur(1px)'
                }} />
            </div>
            
            {/* Shadow under candle holder */}
            <div style={{
                position: 'absolute',
                left: '50%',
                bottom: '18px',
                transform: 'translateX(-50%)',
                width: '95px',
                height: '10px',
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 50%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(4px)'
            }} />
        </div>
    );

    const renderLEDVisual = () => (
        <div style={{
            position: 'relative',
            width: '200px',
            height: '280px',
            margin: '0 auto'
        }}>
            {/* Ambient light glow */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '60px',
                transform: 'translateX(-50%)',
                width: '180px',
                height: '180px',
                background: `radial-gradient(circle, ${themeColor}40 0%, ${themeColor}20 40%, transparent 70%)`,
                borderRadius: '50%',
                filter: 'blur(25px)',
                animation: 'smoothPulse 3s ease-in-out infinite'
            }} />
            
            {/* Light rays emanating from bulb */}
            {[...Array(16)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    left: '50%',
                    top: '95px',
                    width: '4px',
                    height: '60px',
                    background: `linear-gradient(180deg, ${themeColor}90 0%, ${themeColor}40 50%, transparent 100%)`,
                    transformOrigin: 'top center',
                    transform: `translateX(-50%) rotate(${i * 22.5}deg)`,
                    filter: 'blur(3px)',
                    opacity: i % 2 === 0 ? 0.7 : 0.5,
                    animation: 'smoothPulse 2.5s ease-in-out infinite',
                    animationDelay: `${i * 0.08}s`
                }} />
            ))}
            
            {/* LED bulb glass envelope */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '35px',
                transform: 'translateX(-50%)',
                width: '105px',
                height: '135px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 30%, #e9ecef 70%, #dee2e6 100%)',
                borderRadius: '52px 52px 25px 25px',
                boxShadow: 'inset -6px -6px 20px rgba(0,0,0,0.08), inset 6px 6px 20px rgba(255,255,255,0.8), 0 10px 30px rgba(0,0,0,0.15)',
                overflow: 'hidden'
            }}>
                {/* Strong glass shine - left side */}
                <div style={{
                    position: 'absolute',
                    left: '12%',
                    top: '8%',
                    width: '30%',
                    height: '50%',
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 40%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(4px)',
                    transform: 'rotate(-15deg)'
                }} />
                
                {/* Secondary shine - upper right */}
                <div style={{
                    position: 'absolute',
                    right: '15%',
                    top: '15%',
                    width: '20%',
                    height: '30%',
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.6) 0%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(3px)'
                }} />
                
                {/* LED light source inside */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '75px',
                    height: '75px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, #ffffff 0%, #fefce8 20%, ${themeColor} 60%, #ea580c 100%)`,
                    boxShadow: `
                        0 0 25px ${themeColor},
                        0 0 45px ${themeColor}dd,
                        0 0 65px ${themeColor}99,
                        inset 0 0 25px rgba(255,255,255,0.9)
                    `,
                    animation: 'ledPulse 2.5s ease-in-out infinite'
                }}>
                    {/* LED chip array in circle */}
                    {[...Array(8)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            width: '9px',
                            height: '9px',
                            background: '#ffffff',
                            borderRadius: '2px',
                            transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-22px)`,
                            boxShadow: `0 0 8px ${themeColor}, 0 0 12px #ffffff`,
                            opacity: 0.95
                        }} />
                    ))}
                    
                    {/* Center bright spot */}
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '30px',
                        height: '30px',
                        background: 'radial-gradient(circle, #ffffff, rgba(255,255,255,0))',
                        borderRadius: '50%',
                        filter: 'blur(5px)'
                    }} />
                </div>
                
                {/* Inner glow layer */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '85%',
                    height: '85%',
                    background: `radial-gradient(circle at center, ${themeColor}50 0%, ${themeColor}20 50%, transparent 75%)`,
                    borderRadius: '50%',
                    animation: 'ledPulse 2.5s ease-in-out infinite',
                    mixBlendMode: 'screen'
                }} />
            </div>
            
            {/* Edison screw base (E27 standard) */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '165px',
                transform: 'translateX(-50%)',
                width: '68px',
                height: '60px',
                background: 'linear-gradient(180deg, #a8a29e 0%, #78716c 25%, #57534e 50%, #78716c 75%, #a8a29e 100%)',
                borderRadius: '6px',
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)'
            }}>
                {/* Screw threads */}
                {[...Array(6)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: `${6 + i * 8}px`,
                        height: '3px',
                        background: 'linear-gradient(180deg, #57534e 0%, #44403c 50%, #292524 100%)',
                        boxShadow: '0 1px 0 rgba(255,255,255,0.15)',
                        borderRadius: '1px'
                    }} />
                ))}
                
                {/* Metallic highlights on threads */}
                {[...Array(6)].map((_, i) => (
                    <div key={`h-${i}`} style={{
                        position: 'absolute',
                        left: '10%',
                        right: '10%',
                        top: `${7 + i * 8}px`,
                        height: '1px',
                        background: 'rgba(255,255,255,0.3)',
                        borderRadius: '1px'
                    }} />
                ))}
            </div>
            
            {/* Base insulator ring */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '222px',
                transform: 'translateX(-50%)',
                width: '64px',
                height: '12px',
                background: 'linear-gradient(180deg, #4b5563 0%, #374151 50%, #1f2937 100%)',
                borderRadius: '6px',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)'
            }} />
            
            {/* Electrical contact (bottom) */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '232px',
                transform: 'translateX(-50%)',
                width: '24px',
                height: '24px',
                background: 'radial-gradient(circle, #e5e7eb 0%, #d1d5db 40%, #9ca3af 100%)',
                borderRadius: '50%',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2)'
            }}>
                {/* Contact center */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '10px',
                    height: '10px',
                    background: 'radial-gradient(circle, #f3f4f6, #9ca3af)',
                    borderRadius: '50%',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
                }} />
            </div>
            
            {/* Shadow under bulb */}
            <div style={{
                position: 'absolute',
                left: '50%',
                bottom: '15px',
                transform: 'translateX(-50%)',
                width: '85px',
                height: '12px',
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 50%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(6px)'
            }} />
        </div>
    );

    const renderMoonVisual = () => (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '300px',
            background: 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 60%, #1e293b 100%)',
            borderRadius: '16px',
            overflow: 'hidden'
        }}>
            {/* Background stars */}
            {[...Array(40)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${1 + Math.random() * 2}px`,
                    height: `${1 + Math.random() * 2}px`,
                    borderRadius: '50%',
                    background: '#ffffff',
                    opacity: Math.random() * 0.6 + 0.2,
                    animation: `realisticTwinkle ${3 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`
                }} />
            ))}
            
            {/* Sun (distant, at edge) */}
            <div style={{
                position: 'absolute',
                right: '40px',
                top: '40px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #fef3c7, #fbbf24)',
                boxShadow: '0 0 30px #fbbf24, 0 0 50px #fbbf2480',
                animation: 'smoothPulse 4s ease-in-out infinite'
            }} />
            
            {/* Multiple light beams for realistic effect */}
            {[...Array(3)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    right: '60px',
                    top: '60px',
                    width: '280px',
                    height: `${1 + i * 0.5}px`,
                    background: `linear-gradient(90deg, transparent 0%, ${themeColor}${30 - i * 10} 50%, transparent 100%)`,
                    transform: 'rotate(-18deg)',
                    transformOrigin: 'right center',
                    filter: 'blur(1px)',
                    animation: 'lightBeam 3s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0.6 - i * 0.15
                }} />
            ))}
            
            {/* Moon glow halo */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '180px',
                height: '180px',
                background: 'radial-gradient(circle, rgba(229, 231, 235, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'moonGlow 4s ease-in-out infinite'
            }} />
            
            {/* Moon sphere */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 50%, #d1d5db 100%)',
                boxShadow: 'inset -25px -5px 40px rgba(0,0,0,0.4), inset 5px 5px 20px rgba(255,255,255,0.5), 0 0 50px rgba(255,255,255,0.3)',
                animation: 'moonGlow 4s ease-in-out infinite'
            }}>
                {/* Craters - large */}
                <div style={{
                    position: 'absolute',
                    left: '35%',
                    top: '25%',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, #b4b8c0, #9ca3af)',
                    boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.2)'
                }} />
                
                {/* Craters - medium */}
                <div style={{
                    position: 'absolute',
                    left: '58%',
                    top: '48%',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, #b4b8c0, #9ca3af)',
                    boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.2)'
                }} />
                
                {/* Craters - small */}
                <div style={{
                    position: 'absolute',
                    left: '25%',
                    top: '60%',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, #b4b8c0, #9ca3af)',
                    boxShadow: 'inset 1px 1px 4px rgba(0,0,0,0.4)'
                }} />
                
                <div style={{
                    position: 'absolute',
                    left: '70%',
                    top: '30%',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, #b4b8c0, #9ca3af)',
                    boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.4)'
                }} />
                
                {/* Maria (dark patches) */}
                <div style={{
                    position: 'absolute',
                    left: '45%',
                    top: '35%',
                    width: '35px',
                    height: '28px',
                    background: 'rgba(156, 163, 175, 0.4)',
                    borderRadius: '50%',
                    filter: 'blur(3px)',
                    opacity: 0.6
                }} />
                
                {/* Bright highland */}
                <div style={{
                    position: 'absolute',
                    left: '20%',
                    top: '15%',
                    width: '25px',
                    height: '25px',
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    filter: 'blur(4px)'
                }} />
            </div>
            
            {/* Reflection label with arrow */}
            <div style={{
                position: 'absolute',
                left: '50%',
                bottom: '30px',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '14px',
                fontWeight: '600',
                opacity: 0.8
            }}>
                <div style={{
                    marginBottom: '5px',
                    fontSize: '20px'
                }}>↗</div>
                Reflects Sunlight
            </div>
        </div>
    );

    const renderSummaryVisual = () => (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            padding: '20px'
        }}>
            {[
                { icon: '☀️', label: 'Sun', color: '#fbbf24' },
                { icon: '⭐', label: 'Stars', color: '#ffffff' },
                { icon: '🔥', label: 'Fire', color: '#ff6b35' },
                { icon: '💡', label: 'LED', color: themeColor },
                { icon: '🌙', label: 'Moon', color: '#e5e7eb' },
                { icon: '⚡', label: 'Lightning', color: '#60a5fa' }
            ].map((item, i) => (
                <div key={i} style={{
                    padding: '20px',
                    background: darkMode ? '#1f2937' : '#ffffff',
                    borderRadius: '12px',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    animation: 'fadeInUp 0.5s ease-out',
                    animationDelay: `${i * 0.1}s`,
                    animationFillMode: 'both',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                        {item.icon}
                    </div>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#000000'
                    }}>
                        {item.label}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderVisual = (visual: string) => {
        switch (visual) {
            case 'sun': return renderSunVisual();
            case 'stars': return renderStarsVisual();
            case 'firefly': return renderFireflyVisual();
            case 'lightning': return renderLightningVisual();
            case 'fire': return renderFireVisual();
            case 'led': return renderLEDVisual();
            case 'moon': return renderMoonVisual();
            case 'summary': return renderSummaryVisual();
            default: return renderSunVisual();
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER MODES
    // ═══════════════════════════════════════════════════════════════════════

    const renderLearnMode = () => {
        const step = filteredSteps[currentStep - 1];
        if (!step) return null;

        return (
            <div style={{
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? 'translateY(20px)' : 'translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                {/* Title */}
                <h2 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: darkMode ? '#f9fafb' : '#111827',
                    marginBottom: '20px',
                    animation: 'fadeInUp 0.5s ease-out'
                }}>
                    {step.title}
                </h2>

                {/* Visual */}
                <div style={{
                    marginBottom: '30px',
                    animation: 'fadeInUp 0.6s ease-out',
                    animationDelay: '0.1s',
                    animationFillMode: 'both'
                }}>
                    {renderVisual(step.visual)}
                </div>

                {/* Content */}
                <p style={{
                    fontSize: '18px',
                    lineHeight: '1.8',
                    color: darkMode ? '#d1d5db' : '#374151',
                    marginBottom: '25px',
                    animation: 'fadeInUp 0.7s ease-out',
                    animationDelay: '0.2s',
                    animationFillMode: 'both'
                }}>
                    {step.content}
                </p>

                {/* Key Points */}
                {step.keyPoints && step.keyPoints.length > 0 && (
                    <div style={{
                        background: darkMode ? '#1f2937' : '#f9fafb',
                        borderRadius: '12px',
                        padding: '20px',
                        borderLeft: `4px solid ${themeColor}`
                    }}>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: themeColor,
                            marginBottom: '15px',
                            animation: 'fadeInUp 0.8s ease-out',
                            animationDelay: '0.3s',
                            animationFillMode: 'both'
                        }}>
                            Key Points:
                        </h3>
                        <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0
                        }}>
                            {step.keyPoints.map((point, i) => (
                                <li key={i} style={{
                                    fontSize: '16px',
                                    color: darkMode ? '#d1d5db' : '#4b5563',
                                    marginBottom: '12px',
                                    paddingLeft: '30px',
                                    position: 'relative',
                                    animation: 'slideIn 0.5s ease-out',
                                    animationDelay: `${0.4 + i * 0.1}s`,
                                    animationFillMode: 'both'
                                }}>
                                    <span style={{
                                        position: 'absolute',
                                        left: '0',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: themeColor,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        color: '#ffffff',
                                        fontWeight: '700'
                                    }}>
                                        ✓
                                    </span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    const renderPracticeMode = () => {
        const question = practiceQuestions[currentStep - 1];
        if (!question) return null;

        return (
            <div style={{
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? 'translateY(20px)' : 'translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                {/* Score */}
                <div style={{
                    textAlign: 'right',
                    marginBottom: '20px',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: themeColor,
                    animation: 'fadeInUp 0.5s ease-out'
                }}>
                    Score: {score}/{practiceQuestions.length}
                </div>

                {/* Question */}
                <div style={{
                    background: darkMode ? '#1f2937' : '#f9fafb',
                    borderRadius: '12px',
                    padding: '30px',
                    marginBottom: '30px',
                    animation: 'fadeInUp 0.6s ease-out',
                    animationDelay: '0.1s',
                    animationFillMode: 'both'
                }}>
                    <h3 style={{
                        fontSize: '22px',
                        fontWeight: '600',
                        color: darkMode ? '#f9fafb' : '#111827',
                        marginBottom: '25px'
                    }}>
                        Question {currentStep}
                    </h3>
                    <p style={{
                        fontSize: '18px',
                        lineHeight: '1.6',
                        color: darkMode ? '#d1d5db' : '#374151'
                    }}>
                        {question.question}
                    </p>
                </div>

                {/* Options */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}>
                    {question.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === question.correctAnswer;
                        const showResult = selectedAnswer !== null;

                        let bgColor = darkMode ? '#1f2937' : '#ffffff';
                        let borderColor = darkMode ? '#374151' : '#e5e7eb';
                        
                        if (showResult) {
                            if (isSelected && isCorrect) {
                                bgColor = '#d1fae5';
                                borderColor = '#10b981';
                            } else if (isSelected && !isCorrect) {
                                bgColor = '#fee2e2';
                                borderColor = '#ef4444';
                            } else if (isCorrect) {
                                bgColor = '#d1fae5';
                                borderColor = '#10b981';
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                disabled={selectedAnswer !== null}
                                style={{
                                    padding: '20px',
                                    background: bgColor,
                                    border: `2px solid ${borderColor}`,
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    color: darkMode ? '#f9fafb' : '#111827',
                                    textAlign: 'left',
                                    cursor: selectedAnswer !== null ? 'default' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    animation: 'fadeInUp 0.5s ease-out',
                                    animationDelay: `${0.2 + index * 0.1}s`,
                                    animationFillMode: 'both',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedAnswer === null) {
                                        e.currentTarget.style.transform = 'translateX(10px)';
                                        e.currentTarget.style.borderColor = themeColor;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedAnswer === null) {
                                        e.currentTarget.style.transform = 'translateX(0)';
                                        e.currentTarget.style.borderColor = borderColor;
                                    }
                                }}
                            >
                                <span style={{
                                    display: 'inline-block',
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    background: showResult && isCorrect ? '#10b981' : (showResult && isSelected ? '#ef4444' : themeColor),
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    lineHeight: '30px',
                                    marginRight: '15px',
                                    fontWeight: '700'
                                }}>
                                    {String.fromCharCode(65 + index)}
                                </span>
                                {option}
                                {showResult && isCorrect && (
                                    <span style={{
                                        position: 'absolute',
                                        right: '20px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '24px',
                                        color: '#10b981'
                                    }}>✓</span>
                                )}
                                {showResult && isSelected && !isCorrect && (
                                    <span style={{
                                        position: 'absolute',
                                        right: '20px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '24px',
                                        color: '#ef4444'
                                    }}>✗</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Explanation */}
                {showExplanation && (
                    <div style={{
                        marginTop: '30px',
                        padding: '20px',
                        background: darkMode ? '#1f2937' : '#eff6ff',
                        borderRadius: '12px',
                        borderLeft: `4px solid ${themeColor}`,
                        animation: 'fadeInUp 0.5s ease-out'
                    }}>
                        <h4 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: themeColor,
                            marginBottom: '10px'
                        }}>
                            Explanation:
                        </h4>
                        <p style={{
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: darkMode ? '#d1d5db' : '#374151'
                        }}>
                            {question.explanation}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    const renderExploreMode = () => (
        <div style={{
            opacity: transitioning ? 0 : 1,
            transition: 'opacity 0.4s ease'
        }}>
            <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: darkMode ? '#f9fafb' : '#111827',
                marginBottom: '30px',
                textAlign: 'center'
            }}>
                Explore Light Sources
            </h2>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px'
            }}>
                {[
                    { visual: 'sun', title: 'The Sun', description: 'Main natural light source' },
                    { visual: 'moon', title: 'The Moon', description: 'Reflects sunlight' },
                    { visual: 'stars', title: 'Stars', description: 'Distant luminous objects' },
                    { visual: 'firefly', title: 'Fireflies', description: 'Bioluminescent insects' },
                    { visual: 'lightning', title: 'Lightning', description: 'Natural electrical discharge' },
                    { visual: 'fire', title: 'Fire', description: 'Earliest artificial light' },
                    { visual: 'led', title: 'LED Lamps', description: 'Modern efficient lighting' }
                ].map((item, i) => (
                    <div key={i} style={{
                        padding: '20px',
                        background: darkMode ? '#1f2937' : '#ffffff',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        animation: 'fadeInUp 0.5s ease-out',
                        animationDelay: `${i * 0.1}s`,
                        animationFillMode: 'both'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1) translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}>
                        <div style={{ marginBottom: '15px', transform: 'scale(0.7)' }}>
                            {renderVisual(item.visual)}
                        </div>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: themeColor,
                            marginBottom: '8px',
                            textAlign: 'center'
                        }}>
                            {item.title}
                        </h3>
                        <p style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: darkMode ? '#d1d5db' : '#4b5563',
                            textAlign: 'center'
                        }}>
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );

    // ═══════════════════════════════════════════════════════════════════════
    // MAIN RENDER
    // ═══════════════════════════════════════════════════════════════════════

    return (
        <div style={{
            width: `${width}px`,
            maxWidth: '100%',
            height: `${height}px`,
            background: darkMode ? '#111827' : '#ffffff',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                marginBottom: '30px'
            }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: darkMode ? '#f9fafb' : '#111827',
                    marginBottom: '10px',
                    textAlign: 'center'
                }}>
                    Sources of Light
                </h1>
                
                {/* Mode Selector */}
                {showModeSelector && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        marginTop: '20px'
                    }}>
                        {enabledModes.map((mode) => (
                            <button
                                key={mode}
                                onClick={() => handleModeChange(mode)}
                                style={{
                                    padding: '12px 30px',
                                    background: currentMode === mode ? themeColor : (darkMode ? '#374151' : '#f3f4f6'),
                                    color: currentMode === mode ? '#ffffff' : (darkMode ? '#d1d5db' : '#4b5563'),
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    textTransform: 'capitalize'
                                }}
                                onMouseEnter={(e) => {
                                    if (currentMode !== mode) {
                                        e.currentTarget.style.background = darkMode ? '#4b5563' : '#e5e7eb';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentMode !== mode) {
                                        e.currentTarget.style.background = darkMode ? '#374151' : '#f3f4f6';
                                    }
                                }}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '10px',
                marginBottom: '20px'
            }}>
                {currentMode === 'learn' && renderLearnMode()}
                {currentMode === 'practice' && renderPracticeMode()}
                {currentMode === 'explore' && renderExploreMode()}
            </div>

            {/* Navigation Controls */}
            {showNavigation && currentMode !== 'explore' && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '20px',
                    borderTop: `2px solid ${darkMode ? '#374151' : '#e5e7eb'}`
                }}>
                    {/* Previous Button */}
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        style={{
                            padding: '12px 24px',
                            background: currentStep === 1 ? (darkMode ? '#374151' : '#f3f4f6') : themeColor,
                            color: currentStep === 1 ? (darkMode ? '#6b7280' : '#9ca3af') : '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            opacity: currentStep === 1 ? 0.5 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (currentStep !== 1) {
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        ← Previous
                    </button>

                    {/* Step Indicator */}
                    {showStepIndicator && (
                        <div style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: darkMode ? '#d1d5db' : '#6b7280'
                        }}>
                            {currentStep} / {totalSteps}
                        </div>
                    )}

                    {/* Play/Pause Button */}
                    {showPlayPause && autoPlayDuration > 0 && (
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            style={{
                                width: '48px',
                                height: '48px',
                                background: themeColor,
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '50%',
                                fontSize: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            {isPlaying ? '⏸' : '▶'}
                        </button>
                    )}

                    {/* Next Button */}
                    <button
                        onClick={handleNext}
                        disabled={currentStep === totalSteps}
                        style={{
                            padding: '12px 24px',
                            background: currentStep === totalSteps ? (darkMode ? '#374151' : '#f3f4f6') : themeColor,
                            color: currentStep === totalSteps ? (darkMode ? '#6b7280' : '#9ca3af') : '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: currentStep === totalSteps ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            opacity: currentStep === totalSteps ? 0.5 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (currentStep !== totalSteps) {
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
};

export default SourcesOfLightLearnMode;
