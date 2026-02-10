// @ts-ignore - React types should be available via @types/react package
import React, { useState, useEffect, useRef, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

type ModeType = 'learn' | 'practice' | 'real_world' | 'hands_on';

interface StepDetails {
    currentStep: number;
    totalSteps: number;
    currentMode: ModeType;
    stepData?: StepDataInterface;
}

interface BaseDataInterface {
    topic?: string;
    description?: string;
    [key: string]: any;
}

interface StepDataInterface {
    id: number;
    mode: ModeType;
    title: string;
    description: string;
    visual?: string;
    interactionType?: string;
    feedback?: {
        correct?: string;
        incorrect?: string;
    };
    [key: string]: any;
}

interface PlaneMirrorAdditionalProps {
    objectDistance?: number;           // Distance of object from mirror (cm)
    objectHeight?: number;              // Height of object (cm)
    showRays?: boolean;                 // Show light rays
    showImageFormation?: boolean;       // Show image formation process
    showMeasurements?: boolean;         // Show distance/height measurements
    mirrorPosition?: 'center' | 'left' | 'right';
    objectType?: 'arrow' | 'person' | 'candle' | 'tree' | 'custom';
    customObject?: {
        shape: string;
        color: string;
        label?: string;
    };
    highlightProperties?: ('laterally_inverted' | 'same_size' | 'same_distance' | 'virtual' | 'erect')[];
    animationStyle?: 'slow' | 'normal' | 'fast';
}

interface PlaneMirrorToolProps {
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
        additionalProps?: PlaneMirrorAdditionalProps;
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
// DEFAULT STEPS DATA
// ═══════════════════════════════════════════════════════════════════════════

const defaultSteps: StepDataInterface[] = [
    // LEARN MODE
    {
        id: 1,
        mode: 'learn',
        title: 'What is a Plane Mirror?',
        description: 'A plane mirror is a flat, smooth surface that reflects light. When you look into a mirror, you see your reflection!',
        visual: 'mirror_intro'
    },
    {
        id: 2,
        mode: 'learn',
        title: 'Image Formation',
        description: 'When light from an object hits the mirror, it reflects back. The reflected rays appear to come from behind the mirror, forming a virtual image.',
        visual: 'image_formation'
    },
    {
        id: 3,
        mode: 'learn',
        title: 'Properties of Mirror Images',
        description: 'The image in a plane mirror is: 1) Same size as object, 2) Same distance behind mirror, 3) Laterally inverted, 4) Virtual and erect.',
        visual: 'properties'
    },
    {
        id: 4,
        mode: 'learn',
        title: 'Lateral Inversion',
        description: 'Left appears as right and right appears as left. This is why "AMBULANCE" is written reversed on vehicles!',
        visual: 'lateral_inversion'
    },
    
    // PRACTICE MODE
    {
        id: 5,
        mode: 'practice',
        title: 'Find the Image Position',
        description: 'If an object is 5 cm in front of a mirror, where will the image be?',
        visual: 'practice_position',
        interactionType: 'position_quiz',
        correctAnswer: '5 cm behind the mirror',
        feedback: {
            correct: 'Excellent! The image is always at the same distance behind the mirror as the object is in front.',
            incorrect: 'Remember: The image distance equals the object distance!'
        }
    },
    {
        id: 6,
        mode: 'practice',
        title: 'Image Size',
        description: 'If you stand 2 meters from a mirror, how tall is your image compared to you?',
        visual: 'practice_size',
        interactionType: 'size_quiz',
        correctAnswer: 'same',
        feedback: {
            correct: 'Perfect! A plane mirror always forms an image of the same size.',
            incorrect: 'Think again! Plane mirrors don\'t magnify or shrink images.'
        }
    },
    {
        id: 7,
        mode: 'practice',
        title: 'Lateral Inversion Challenge',
        description: 'If you raise your right hand, which hand appears to be raised in the mirror?',
        visual: 'practice_lateral',
        interactionType: 'lateral_quiz',
        correctAnswer: 'left',
        feedback: {
            correct: 'Correct! The mirror reverses left and right - this is lateral inversion.',
            incorrect: 'Remember: left becomes right and right becomes left in a mirror!'
        }
    },
    
    // REAL WORLD MODE
    {
        id: 8,
        mode: 'real_world',
        title: 'Ambulance Writing',
        description: 'Why is "AMBULANCE" written in reverse on emergency vehicles? So drivers can read it correctly in their rear-view mirrors!',
        visual: 'ambulance'
    },
    {
        id: 9,
        mode: 'real_world',
        title: 'Barber\'s Mirror',
        description: 'Barbers use mirrors to show you the back of your head. Two parallel mirrors create multiple reflections!',
        visual: 'barber'
    },
    {
        id: 10,
        mode: 'real_world',
        title: 'Periscope',
        description: 'Submarines use periscopes with two plane mirrors to see above water while staying submerged.',
        visual: 'periscope'
    },
    
    // HANDS-ON MODE
    {
        id: 11,
        mode: 'hands_on',
        title: 'Interactive Mirror Lab',
        description: 'Move the object around and observe how the image changes! Notice the properties of reflection.',
        visual: 'interactive',
        interactionType: 'drag_object'
    },
    {
        id: 12,
        mode: 'hands_on',
        title: 'Ray Tracing',
        description: 'Draw light rays from the object to the mirror and see how they reflect to form the image.',
        visual: 'ray_tracing',
        interactionType: 'draw_rays'
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const PlaneMirrorTool: React.FC<PlaneMirrorToolProps> = ({ 
    props, 
    setStepDetails,
    stopAutoNext = false,
    setStopAutoNext 
}) => {
    // Extract props with defaults
    const propsWithDefaults = (props || {}) as NonNullable<PlaneMirrorToolProps['props']>;
    const {
        width = 800,
        height = 600,
        data = {},
        steps = defaultSteps,
        initialMode = 'learn',
        showModeSelector = true,
        enabledModes = ['learn', 'practice', 'real_world', 'hands_on'],
        showNavigation = true,
        showPlayPause = true,
        showStepIndicator = true,
        initialStep,
        filterSteps,
        animationSpeed = 1,
        autoPlayDuration = 8000,
        themeColor = '#3b82f6',
        darkMode = false,
        additionalProps = {}
    } = propsWithDefaults;

    // Extract additionalProps
    const {
        objectDistance = 30,
        objectHeight = 40,
        showRays = true,
        showImageFormation = true,
        showMeasurements = true,
        mirrorPosition = 'center',
        objectType = 'arrow',
        customObject,
        highlightProperties = [],
        animationStyle = 'normal'
    } = additionalProps;

    // State
    const [currentMode, setCurrentMode] = useState<ModeType>(initialMode);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [transitioning, setTransitioning] = useState(false);
    
    // Interactive state
    const [draggedObjectPos, setDraggedObjectPos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [drawnRays, setDrawnRays] = useState<Array<{x1: number, y1: number, x2: number, y2: number}>>([]);
    const [animationProgress, setAnimationProgress] = useState(0);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Filter steps based on mode and filterSteps prop
    const filteredSteps = steps.filter(step => {
        if (filterSteps && !filterSteps.includes(step.id)) return false;
        if (!enabledModes.includes(step.mode)) return false;
        return step.mode === currentMode;
    });

    const currentStep = filteredSteps[currentStepIndex];
    const totalSteps = filteredSteps.length;

    // Mount animation
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Auto-play logic
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
    }, [isPlaying, currentStepIndex, stopAutoNext, autoPlayDuration, animationSpeed]);

    // Notify parent of step changes
    useEffect(() => {
        if (setStepDetails && currentStep) {
            setStepDetails({
                currentStep: currentStepIndex + 1,
                totalSteps,
                currentMode,
                stepData: currentStep
            });
        }
    }, [currentStepIndex, totalSteps, currentMode, currentStep, setStepDetails]);

    // Animation progress for visual effects
    useEffect(() => {
        let startTime: number | null = null;
        const duration = 2000 / animationSpeed;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            setAnimationProgress(easeOutCubic(progress));
            
            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [currentStepIndex, animationSpeed]);

    // Inject CSS animations and responsive styles
    useEffect(() => {
        const styleId = 'plane-mirror-animations';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }
                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }
                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                @keyframes reflect {
                    0%, 100% {
                        opacity: 0.3;
                    }
                    50% {
                        opacity: 0.7;
                    }
                }
                
                /* Hide scrollbar but keep scrolling functionality */
                .plane-mirror-quiz-container::-webkit-scrollbar {
                    display: none;
                }
                .plane-mirror-quiz-container {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                /* Learn mode - reduce spacing */
                .plane-mirror-container.learn-mode {
                    padding: 8px !important;
                    gap: 6px !important;
                }
                
                .plane-mirror-container.learn-mode .plane-mirror-canvas-container {
                    padding: 4px !important;
                    min-height: 200px !important;
                }
                
                .plane-mirror-container.learn-mode .plane-mirror-title {
                    font-size: 18px !important;
                    margin-bottom: 2px !important;
                }
                
                .plane-mirror-container.learn-mode .plane-mirror-description {
                    font-size: 13px !important;
                    margin-bottom: 2px !important;
                    line-height: 1.3 !important;
                }
                
                /* Practice mode - reduce spacing */
                .plane-mirror-container.practice-mode {
                    padding: 10px !important;
                    gap: 8px !important;
                }
                
                .plane-mirror-container.practice-mode .plane-mirror-canvas-container {
                    padding: 6px !important;
                    min-height: 250px !important;
                }
                
                .plane-mirror-container.practice-mode .plane-mirror-title {
                    font-size: 20px !important;
                    margin-bottom: 2px !important;
                }
                
                .plane-mirror-container.practice-mode .plane-mirror-description {
                    font-size: 14px !important;
                    margin-bottom: 2px !important;
                    line-height: 1.4 !important;
                }
                
                .plane-mirror-container.practice-mode .plane-mirror-quiz-container {
                    padding: 20px !important;
                    top: 1% !important;
                    max-height: calc(92vh - 100px) !important;
                }
                
                /* Responsive styles */
                @media (max-width: 768px) {
                    .plane-mirror-container {
                        width: 100% !important;
                        max-width: 100vw !important;
                        height: auto !important;
                        min-height: 100vh !important;
                        padding: 16px !important;
                        border-radius: 0 !important;
                    }
                    
                    .plane-mirror-title {
                        font-size: 20px !important;
                    }
                    
                    .plane-mirror-description {
                        font-size: 14px !important;
                    }
                    
                    .plane-mirror-canvas-container {
                        min-height: 300px !important;
                        padding: 12px !important;
                    }
                    
                    .plane-mirror-quiz-container {
                        width: 95% !important;
                        max-width: 95% !important;
                        max-height: 70vh !important;
                        padding: 16px !important;
                        top: 1% !important;
                        overflow-y: auto !important;
                    }
                    
                    .plane-mirror-quiz-options {
                        grid-template-columns: 1fr !important;
                        gap: 8px !important;
                    }
                    
                    .plane-mirror-quiz-question {
                        font-size: 18px !important;
                    }
                    
                    .plane-mirror-controls {
                        flex-direction: column !important;
                        gap: 8px !important;
                    }
                    
                    .plane-mirror-nav {
                        width: 100% !important;
                        justify-content: center !important;
                    }
                    
                    .plane-mirror-step-indicator {
                        width: 100% !important;
                        flex-direction: column !important;
                        gap: 6px !important;
                    }
                    
                    .plane-mirror-mode-selector {
                        flex-wrap: wrap !important;
                    }
                    
                    .plane-mirror-mode-button {
                        font-size: 12px !important;
                        padding: 8px 10px !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .plane-mirror-container {
                        padding: 12px !important;
                    }
                    
                    .plane-mirror-title {
                        font-size: 18px !important;
                    }
                    
                    .plane-mirror-description {
                        font-size: 13px !important;
                    }
                    
                    .plane-mirror-quiz-container {
                        padding: 12px !important;
                        max-height: 75vh !important;
                    }
                    
                    .plane-mirror-quiz-question {
                        font-size: 16px !important;
                    }
                    
                    .plane-mirror-quiz-button {
                        padding: 10px 12px !important;
                        font-size: 14px !important;
                    }
                    
                    .plane-mirror-mode-button {
                        font-size: 11px !important;
                        padding: 6px 8px !important;
                    }
                }
                
                @media (min-width: 769px) and (max-width: 1024px) {
                    .plane-mirror-container {
                        width: 95% !important;
                        max-width: 95vw !important;
                    }
                    
                    .plane-mirror-quiz-container {
                        max-width: 550px !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    // Navigation handlers
    const handleNext = useCallback(() => {
        if (currentStepIndex < totalSteps - 1) {
            setTransitioning(true);
            setTimeout(() => {
                setCurrentStepIndex(prev => prev + 1);
                setTransitioning(false);
                setSelectedAnswer(null);
                setShowFeedback(false);
                setAnimationProgress(0);
            }, 300);
        }
    }, [currentStepIndex, totalSteps]);

    const handlePrevious = useCallback(() => {
        if (currentStepIndex > 0) {
            setTransitioning(true);
            setTimeout(() => {
                setCurrentStepIndex(prev => prev - 1);
                setTransitioning(false);
                setSelectedAnswer(null);
                setShowFeedback(false);
                setAnimationProgress(0);
            }, 300);
        }
    }, [currentStepIndex]);

    const handleModeChange = (mode: ModeType) => {
        if (mode !== currentMode) {
            setTransitioning(true);
            setTimeout(() => {
                setCurrentMode(mode);
                setCurrentStepIndex(0);
                setTransitioning(false);
                setIsPlaying(false);
                setSelectedAnswer(null);
                setShowFeedback(false);
                setScore(0);
            }, 300);
        }
    };

    const togglePlayPause = () => {
        setIsPlaying(prev => !prev);
        if (setStopAutoNext) {
            setStopAutoNext(!isPlaying);
        }
    };

    // Practice mode handlers
    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswer(answer);
        setShowFeedback(true);
        
        if (currentStep.correctAnswer === answer) {
            setScore(prev => prev + 1);
        }
    };

    // Drag handlers for hands-on mode
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if clicking on object
        const objX = canvas.width * 0.3;
        const objY = canvas.height / 2;
        const distance = Math.sqrt((x - objX) ** 2 + (y - objY) ** 2);
        
        if (distance < 30) {
            setIsDragging(true);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setDraggedObjectPos({ x, y });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // ═══════════════════════════════════════════════════════════════════════
    // CANVAS RENDERING
    // ═══════════════════════════════════════════════════════════════════════

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !currentStep) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const w = canvas.width;
        const h = canvas.height;
        const mirrorX = mirrorPosition === 'center' ? w / 2 : 
                        mirrorPosition === 'left' ? w * 0.3 : w * 0.7;

        // Helper function to draw mirror
        const drawMirror = () => {
            // Mirror surface
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(mirrorX, h * 0.1);
            ctx.lineTo(mirrorX, h * 0.9);
            ctx.stroke();

            // Mirror shine effect
            const gradient = ctx.createLinearGradient(mirrorX - 10, 0, mirrorX + 10, 0);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(mirrorX, h * 0.1);
            ctx.lineTo(mirrorX, h * 0.9);
            ctx.stroke();

            // Mirror stand
            ctx.fillStyle = '#64748b';
            ctx.fillRect(mirrorX - 20, h * 0.9, 40, 10);
            ctx.fillRect(mirrorX - 10, h * 0.9, 20, 30);
        };

        // Helper function to draw object
        const drawObject = (x: number, y: number, size: number, label: string = 'Object') => {
            if (objectType === 'arrow') {
                // Arrow object
                ctx.strokeStyle = themeColor;
                ctx.fillStyle = themeColor;
                ctx.lineWidth = 3;
                
                // Arrow shaft
                ctx.beginPath();
                ctx.moveTo(x, y + size / 2);
                ctx.lineTo(x, y - size / 2);
                ctx.stroke();
                
                // Arrow head
                ctx.beginPath();
                ctx.moveTo(x, y - size / 2);
                ctx.lineTo(x - 10, y - size / 2 + 15);
                ctx.lineTo(x + 10, y - size / 2 + 15);
                ctx.closePath();
                ctx.fill();
            } else if (objectType === 'candle') {
                // Candle
                ctx.fillStyle = '#fef3c7';
                ctx.fillRect(x - 8, y - size / 2, 16, size * 0.8);
                
                // Wick
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x, y - size / 2);
                ctx.lineTo(x, y - size / 2 - 10);
                ctx.stroke();
                
                // Flame
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.ellipse(x, y - size / 2 - 15, 8, 12, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.ellipse(x, y - size / 2 - 13, 5, 8, 0, 0, Math.PI * 2);
                ctx.fill();
            } else if (objectType === 'person') {
                // Stick figure
                ctx.strokeStyle = themeColor;
                ctx.fillStyle = themeColor;
                ctx.lineWidth = 3;
                
                // Head
                ctx.beginPath();
                ctx.arc(x, y - size / 2 + 15, 10, 0, Math.PI * 2);
                ctx.fill();
                
                // Body
                ctx.beginPath();
                ctx.moveTo(x, y - size / 2 + 25);
                ctx.lineTo(x, y);
                ctx.stroke();
                
                // Arms
                ctx.beginPath();
                ctx.moveTo(x - 15, y - 15);
                ctx.lineTo(x, y - 20);
                ctx.lineTo(x + 15, y - 15);
                ctx.stroke();
                
                // Legs
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x - 10, y + size / 2 - 10);
                ctx.moveTo(x, y);
                ctx.lineTo(x + 10, y + size / 2 - 10);
                ctx.stroke();
            }

            // Label
            if (showMeasurements) {
                ctx.fillStyle = darkMode ? '#fff' : '#000';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(label, x, y + size / 2 + 25);
            }
        };

        // Helper function to draw image (reflected)
        const drawImage = (x: number, y: number, size: number, opacity: number = 0.6) => {
            ctx.save();
            ctx.globalAlpha = opacity;
            
            if (objectType === 'arrow') {
                // Reflected arrow
                ctx.strokeStyle = '#a855f7';
                ctx.fillStyle = '#a855f7';
                ctx.lineWidth = 3;
                
                // Arrow shaft
                ctx.beginPath();
                ctx.moveTo(x, y + size / 2);
                ctx.lineTo(x, y - size / 2);
                ctx.stroke();
                
                // Arrow head (inverted)
                ctx.beginPath();
                ctx.moveTo(x, y - size / 2);
                ctx.lineTo(x + 10, y - size / 2 + 15);
                ctx.lineTo(x - 10, y - size / 2 + 15);
                ctx.closePath();
                ctx.fill();
            } else if (objectType === 'candle') {
                // Reflected candle
                ctx.fillStyle = 'rgba(254, 243, 199, 0.7)';
                ctx.fillRect(x - 8, y - size / 2, 16, size * 0.8);
                
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x, y - size / 2);
                ctx.lineTo(x, y - size / 2 - 10);
                ctx.stroke();
                
                ctx.fillStyle = 'rgba(251, 191, 36, 0.7)';
                ctx.beginPath();
                ctx.ellipse(x, y - size / 2 - 15, 8, 12, 0, 0, Math.PI * 2);
                ctx.fill();
            } else if (objectType === 'person') {
                // Reflected stick figure
                ctx.strokeStyle = '#a855f7';
                ctx.fillStyle = '#a855f7';
                ctx.lineWidth = 3;
                
                ctx.beginPath();
                ctx.arc(x, y - size / 2 + 15, 10, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.beginPath();
                ctx.moveTo(x, y - size / 2 + 25);
                ctx.lineTo(x, y);
                ctx.stroke();
                
                // Arms (reflected - laterally inverted)
                ctx.beginPath();
                ctx.moveTo(x + 15, y - 15);
                ctx.lineTo(x, y - 20);
                ctx.lineTo(x - 15, y - 15);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + 10, y + size / 2 - 10);
                ctx.moveTo(x, y);
                ctx.lineTo(x - 10, y + size / 2 - 10);
                ctx.stroke();
            }

            ctx.restore();

            // Label
            if (showMeasurements) {
                ctx.fillStyle = darkMode ? '#bbb' : '#666';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Image', x, y + size / 2 + 25);
            }
        };

        // Helper function to draw light rays
        const drawRays = (objX: number, objY: number, imgX: number, imgY: number) => {
            if (!showRays) return;

            const progress = animationProgress;
            
            // Draw rays from three points: top, middle, bottom of object
            const rayPoints = [
                { y: objY - objectHeight / 2, label: 'top' },      // Top of object
                { y: objY, label: 'middle' },                       // Middle of object
                { y: objY + objectHeight / 2, label: 'bottom' }     // Bottom of object
            ];

            rayPoints.forEach((point, index) => {
                const delay = index * 0.15; // Stagger the rays
                if (progress > delay) {
                    const adjustedProgress = Math.min((progress - delay) / (1 - delay), 1);
                    
                    // Incident ray (from object to mirror) - Blue/Yellow
                    ctx.strokeStyle = `rgba(251, 191, 36, ${0.5 + index * 0.1})`;
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]);
                    
                    const ray1EndX = objX + (mirrorX - objX) * adjustedProgress;
                    ctx.beginPath();
                    ctx.moveTo(objX, point.y);
                    ctx.lineTo(ray1EndX, point.y);
                    ctx.stroke();

                    // Reflected ray (dashed line extending behind mirror) - Purple
                    if (adjustedProgress > 0.5) {
                        const ray2Progress = (adjustedProgress - 0.5) * 2;
                        ctx.strokeStyle = `rgba(168, 85, 247, ${0.4 + index * 0.1})`;
                        ctx.setLineDash([3, 3]);
                        ctx.beginPath();
                        ctx.moveTo(mirrorX, point.y); // Same Y coordinate as incident ray
                        const extendX = mirrorX + (imgX - mirrorX) * ray2Progress;
                        ctx.lineTo(extendX, point.y); // Same Y coordinate - ALIGNED!
                        ctx.stroke();
                    }
                }
            });

            ctx.setLineDash([]);
        };

        // Draw distance measurements
        const drawMeasurements = (objX: number, imgX: number, y: number) => {
            if (!showMeasurements) return;

            ctx.strokeStyle = themeColor;
            ctx.fillStyle = themeColor;
            ctx.lineWidth = 2;
            ctx.setLineDash([2, 2]);

            // Object distance line
            ctx.beginPath();
            ctx.moveTo(objX, y + objectHeight / 2 + 40);
            ctx.lineTo(mirrorX, y + objectHeight / 2 + 40);
            ctx.stroke();

            // Image distance line
            ctx.strokeStyle = '#a855f7';
            ctx.fillStyle = '#a855f7';
            ctx.beginPath();
            ctx.moveTo(mirrorX, y + objectHeight / 2 + 40);
            ctx.lineTo(imgX, y + objectHeight / 2 + 40);
            ctx.stroke();

            ctx.setLineDash([]);

            // Distance labels
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = themeColor;
            ctx.fillText(`${Math.abs(objX - mirrorX).toFixed(0)}px`, 
                        (objX + mirrorX) / 2, y + objectHeight / 2 + 35);
            ctx.fillStyle = '#a855f7';
            ctx.fillText(`${Math.abs(imgX - mirrorX).toFixed(0)}px`, 
                        (mirrorX + imgX) / 2, y + objectHeight / 2 + 45);
        };

        // ═══════════════════════════════════════════════════════════════
        // RENDER BASED ON CURRENT STEP
        // ═══════════════════════════════════════════════════════════════

        if (currentStep.visual === 'mirror_intro') {
            drawMirror();
            
            // Show person looking at mirror
            const personX = w * 0.3;
            const personY = h / 2;
            drawObject(personX, personY, objectHeight, 'You');
            
            if (animationProgress > 0.3) {
                const imageX = mirrorX + (mirrorX - personX);
                drawImage(imageX, personY, objectHeight, animationProgress * 0.7);
            }
        }
        else if (currentStep.visual === 'image_formation') {
            const objX = w * 0.25;
            const objY = h / 2;
            const imgX = mirrorX + (mirrorX - objX);
            
            drawMirror();
            drawObject(objX, objY, objectHeight);
            
            if (showImageFormation && animationProgress > 0.2) {
                drawRays(objX, objY, imgX, objY);
            }
            
            if (animationProgress > 0.6) {
                drawImage(imgX, objY, objectHeight, (animationProgress - 0.6) * 2.5);
            }
            
            drawMeasurements(objX, imgX, objY);
        }
        else if (currentStep.visual === 'properties') {
            const objX = w * 0.3;
            const objY = h / 2;
            const imgX = mirrorX + (mirrorX - objX);
            
            drawMirror();
            drawObject(objX, objY, objectHeight);
            drawImage(imgX, objY, objectHeight, 0.7);
            
            // Draw property annotations
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = themeColor;
            
            const properties = [
                { text: '✓ Same size', y: h * 0.15 },
                { text: '✓ Same distance', y: h * 0.25 },
                { text: '✓ Laterally inverted', y: h * 0.35 },
                { text: '✓ Virtual & erect', y: h * 0.45 }
            ];
            
            properties.forEach((prop, idx) => {
                if (animationProgress > idx * 0.2) {
                    const alpha = Math.min((animationProgress - idx * 0.2) * 5, 1);
                    ctx.globalAlpha = alpha;
                    ctx.fillText(prop.text, w * 0.85, prop.y);
                    ctx.globalAlpha = 1;
                }
            });
        }
        else if (currentStep.visual === 'lateral_inversion') {
            drawMirror();
            
            // Draw "AMBULANCE" text
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            
            // Original text (reversed)
            ctx.fillStyle = themeColor;
            ctx.save();
            ctx.translate(w * 0.25, h * 0.4);
            ctx.scale(-1, 1);
            ctx.fillText('AMBULANCE', 0, 0);
            ctx.restore();
            
            // Reflected text (normal)
            if (animationProgress > 0.5) {
                ctx.fillStyle = '#a855f7';
                ctx.globalAlpha = (animationProgress - 0.5) * 2;
                ctx.fillText('AMBULANCE', w * 0.75, h * 0.4);
                ctx.globalAlpha = 1;
            }
            
            // Arrow showing reflection
            if (animationProgress > 0.3) {
                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(w * 0.35, h * 0.5);
                ctx.lineTo(w * 0.45, h * 0.5);
                ctx.stroke();
                
                // Arrow head
                ctx.beginPath();
                ctx.moveTo(w * 0.45, h * 0.5);
                ctx.lineTo(w * 0.43, h * 0.48);
                ctx.lineTo(w * 0.43, h * 0.52);
                ctx.closePath();
                ctx.fill();
            }
        }
        else if (currentStep.visual === 'ambulance') {
            // Background - Sky
            const skyGradient = ctx.createLinearGradient(0, 0, 0, h * 0.35);
            skyGradient.addColorStop(0, '#60a5fa');
            skyGradient.addColorStop(1, '#93c5fd');
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, w, h * 0.35);
            
            // Road surface
            ctx.fillStyle = '#52525b';
            ctx.fillRect(0, h * 0.35, w, h * 0.65);
            
            // Road edge markings
            ctx.fillStyle = '#fef3c7';
            ctx.fillRect(0, h * 0.35, w, 3);
            
            // Center dashed line (yellow)
            ctx.fillStyle = '#fbbf24';
            for (let i = 0; i < w; i += 50) {
                ctx.fillRect(i, h * 0.62, 30, 5);
            }
            
            // Road side lines
            ctx.fillStyle = '#e5e7eb';
            ctx.fillRect(0, h * 0.88, w, 3);
            
            // ==========================================
            // STEP 1: AMBULANCE (Behind) with REVERSED text
            // ==========================================
            
            const ambulanceX = w * 0.2;
            const ambulanceY = h * 0.7;
            
            // Title label for ambulance
            if (animationProgress > 0.05) {
                ctx.globalAlpha = Math.min((animationProgress - 0.05) * 3, 1);
                ctx.fillStyle = '#1f2937';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('AMBULANCE BEHIND', ambulanceX, h * 0.45);
                ctx.globalAlpha = 1;
            }
            
            // Ambulance body (front view)
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(ambulanceX - 60, ambulanceY - 40, 120, 80);
            
            // Ambulance top (cabin)
            ctx.fillStyle = '#b91c1c';
            ctx.fillRect(ambulanceX - 50, ambulanceY - 60, 100, 20);
            
            // Windshield
            ctx.fillStyle = '#1e3a8a';
            ctx.fillRect(ambulanceX - 45, ambulanceY - 58, 90, 16);
            
            // Windshield glare
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(ambulanceX - 43, ambulanceY - 56, 30, 12);
            
            // Emergency light bar (animated)
            const lightFlash = Math.floor(animationProgress * 10) % 2 === 0;
            ctx.fillStyle = lightFlash ? '#3b82f6' : '#dc2626';
            ctx.fillRect(ambulanceX - 35, ambulanceY - 65, 70, 5);
            
            // Siren lights
            ctx.fillStyle = lightFlash ? '#60a5fa' : '#f87171';
            ctx.beginPath();
            ctx.arc(ambulanceX - 25, ambulanceY - 67, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = lightFlash ? '#f87171' : '#60a5fa';
            ctx.beginPath();
            ctx.arc(ambulanceX + 25, ambulanceY - 67, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Headlights (on)
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(ambulanceX - 55, ambulanceY + 25, 18, 10);
            ctx.fillRect(ambulanceX + 37, ambulanceY + 25, 18, 10);
            
            // Light beams
            ctx.fillStyle = 'rgba(254, 240, 138, 0.2)';
            ctx.beginPath();
            ctx.moveTo(ambulanceX - 46, ambulanceY + 30);
            ctx.lineTo(ambulanceX - 50, ambulanceY + 80);
            ctx.lineTo(ambulanceX - 35, ambulanceY + 80);
            ctx.lineTo(ambulanceX - 46, ambulanceY + 30);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(ambulanceX + 46, ambulanceY + 30);
            ctx.lineTo(ambulanceX + 35, ambulanceY + 80);
            ctx.lineTo(ambulanceX + 50, ambulanceY + 80);
            ctx.lineTo(ambulanceX + 46, ambulanceY + 30);
            ctx.fill();
            
            // Grille
            ctx.fillStyle = '#18181b';
            ctx.fillRect(ambulanceX - 45, ambulanceY + 10, 90, 15);
            for (let i = 0; i < 8; i++) {
                ctx.fillStyle = '#71717a';
                ctx.fillRect(ambulanceX - 40 + i * 11, ambulanceY + 12, 2, 11);
            }
            
            // Wheels
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.ellipse(ambulanceX - 35, ambulanceY + 42, 18, 5, 0, 0, Math.PI * 2);
            ctx.ellipse(ambulanceX + 35, ambulanceY + 42, 18, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#18181b';
            ctx.beginPath();
            ctx.arc(ambulanceX - 35, ambulanceY + 40, 18, 0, Math.PI * 2);
            ctx.arc(ambulanceX + 35, ambulanceY + 40, 18, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#52525b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(ambulanceX - 35, ambulanceY + 40, 18, 0, Math.PI * 2);
            ctx.arc(ambulanceX + 35, ambulanceY + 40, 18, 0, Math.PI * 2);
            ctx.stroke();
            
            // Red cross on front
            ctx.fillStyle = '#fff';
            ctx.fillRect(ambulanceX - 5, ambulanceY - 20, 10, 30);
            ctx.fillRect(ambulanceX - 15, ambulanceY - 10, 30, 10);
            
            // *** REVERSED TEXT "ECNALUBMA" on front of ambulance ***
            ctx.font = 'bold 36px Arial';
            ctx.fillStyle = '#fef3c7';
            ctx.strokeStyle = '#b91c1c';
            ctx.lineWidth = 2;
            ctx.textAlign = 'center';
            
            // Draw text in REVERSE
            ctx.save();
            ctx.translate(ambulanceX, ambulanceY + 15);
            ctx.scale(-1, 1); // This mirrors the text
            ctx.strokeText('AMBULANCE', 0, 0);
            ctx.fillText('AMBULANCE', 0, 0);
            ctx.restore();
            
            // Arrow pointing to reversed text
            if (animationProgress > 0.2) {
                ctx.globalAlpha = Math.min((animationProgress - 0.2) * 3, 1);
                
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.moveTo(ambulanceX - 70, ambulanceY + 5);
                ctx.lineTo(ambulanceX - 80, ambulanceY);
                ctx.lineTo(ambulanceX - 80, ambulanceY + 10);
                ctx.closePath();
                ctx.fill();
                
                // Label box
                ctx.fillStyle = 'rgba(239, 68, 68, 0.95)';
                ctx.fillRect(ambulanceX - 190, ambulanceY - 20, 110, 50);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 13px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('TEXT IS', ambulanceX - 135, ambulanceY - 2);
                ctx.fillText('REVERSED!', ambulanceX - 135, ambulanceY + 15);
                
                ctx.globalAlpha = 1;
            }
            
            // ==========================================
            // STEP 2: CAR AHEAD with driver
            // ==========================================
            
            const carX = w * 0.55;
            const carY = h * 0.68;
            
            // Title label for car
            if (animationProgress > 0.1) {
                ctx.globalAlpha = Math.min((animationProgress - 0.1) * 3, 1);
                ctx.fillStyle = '#1f2937';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('CAR AHEAD', carX, h * 0.45);
                ctx.globalAlpha = 1;
            }
            
            // Car body (back view)
            ctx.fillStyle = '#1e40af';
            ctx.fillRect(carX - 55, carY - 35, 110, 70);
            
            // Car roof
            ctx.fillStyle = '#1e3a8a';
            ctx.fillRect(carX - 45, carY - 55, 90, 20);
            
            // Rear window (dark)
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(carX - 42, carY - 53, 84, 17);
            
            // Rear window shine
            ctx.fillStyle = 'rgba(147, 197, 253, 0.2)';
            ctx.fillRect(carX - 40, carY - 51, 20, 13);
            
            // Trunk
            ctx.fillStyle = '#1e40af';
            ctx.fillRect(carX - 50, carY + 20, 100, 12);
            
            // License plate
            ctx.fillStyle = '#fef3c7';
            ctx.fillRect(carX - 25, carY + 22, 50, 15);
            ctx.strokeStyle = '#18181b';
            ctx.lineWidth = 2;
            ctx.strokeRect(carX - 25, carY + 22, 50, 15);
            ctx.fillStyle = '#18181b';
            ctx.font = 'bold 9px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('MH 01 1234', carX, carY + 32);
            
            // Tail lights (red)
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(carX - 58, carY + 5, 10, 18);
            ctx.fillRect(carX + 48, carY + 5, 10, 18);
            
            // Brake lights glow
            ctx.fillStyle = '#fca5a5';
            ctx.fillRect(carX - 57, carY + 7, 8, 14);
            ctx.fillRect(carX + 49, carY + 7, 8, 14);
            
            // Wheels (back view)
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.ellipse(carX - 35, carY + 37, 16, 4, 0, 0, Math.PI * 2);
            ctx.ellipse(carX + 35, carY + 37, 16, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#18181b';
            ctx.beginPath();
            ctx.arc(carX - 35, carY + 35, 16, 0, Math.PI * 2);
            ctx.arc(carX + 35, carY + 35, 16, 0, Math.PI * 2);
            ctx.fill();
            
            // ==========================================
            // STEP 3: DRIVER'S REAR-VIEW MIRROR
            // ==========================================
            
            const mirrorX = carX;
            const mirrorY = carY - 90;
            
            if (animationProgress > 0.3) {
                ctx.globalAlpha = Math.min((animationProgress - 0.3) * 2, 1);
                
                // Mirror mounting bracket
                ctx.fillStyle = '#18181b';
                ctx.fillRect(mirrorX - 2, mirrorY + 30, 4, 25);
                
                // Mirror housing
                ctx.fillStyle = '#27272a';
                ctx.fillRect(mirrorX - 65, mirrorY, 130, 35);
                
                // Mirror surface (glossy)
                const mirrorGrad = ctx.createLinearGradient(mirrorX - 60, mirrorY, mirrorX + 60, mirrorY);
                mirrorGrad.addColorStop(0, '#d4d4d8');
                mirrorGrad.addColorStop(0.3, '#f4f4f5');
                mirrorGrad.addColorStop(0.7, '#f4f4f5');
                mirrorGrad.addColorStop(1, '#d4d4d8');
                ctx.fillStyle = mirrorGrad;
                ctx.fillRect(mirrorX - 60, mirrorY + 3, 120, 29);
                
                // Mirror edge highlight
                ctx.strokeStyle = '#a1a1aa';
                ctx.lineWidth = 1;
                ctx.strokeRect(mirrorX - 60, mirrorY + 3, 120, 29);
                
                ctx.globalAlpha = 1;
            }
            
            // ==========================================
            // STEP 4: REFLECTION IN MIRROR showing AMBULANCE correctly
            // ==========================================
            
            if (animationProgress > 0.5) {
                ctx.save();
                ctx.globalAlpha = Math.min((animationProgress - 0.5) * 2, 0.9);
                
                // Small ambulance reflection in mirror
                const refX = mirrorX;
                const refY = mirrorY + 17;
                const scale = 0.25;
                
                // Reflected ambulance body
                ctx.fillStyle = '#dc2626';
                ctx.fillRect(refX - 35, refY - 10, 70, 20);
                
                // Reflected roof
                ctx.fillStyle = '#b91c1c';
                ctx.fillRect(refX - 30, refY - 15, 60, 5);
                
                // Reflected light (flashing)
                ctx.fillStyle = lightFlash ? '#60a5fa' : '#f87171';
                ctx.fillRect(refX - 20, refY - 17, 40, 2);
                
                // Reflected windshield
                ctx.fillStyle = '#1e3a8a';
                ctx.fillRect(refX - 28, refY - 14, 56, 4);
                
                // Reflected headlights
                ctx.fillStyle = '#fef08a';
                ctx.fillRect(refX - 34, refY + 7, 10, 2);
                ctx.fillRect(refX + 24, refY + 7, 10, 2);
                
                // *** CORRECT TEXT in mirror reflection ***
                ctx.fillStyle = '#fef3c7';
                ctx.strokeStyle = '#b91c1c';
                ctx.lineWidth = 1;
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.strokeText('AMBULANCE', refX, refY + 4);
                ctx.fillText('AMBULANCE', refX, refY + 4);
                
                // Reflected wheels
                ctx.fillStyle = '#18181b';
                ctx.beginPath();
                ctx.arc(refX - 22, refY + 10, 4, 0, Math.PI * 2);
                ctx.arc(refX + 22, refY + 10, 4, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
            
            // ==========================================
            // STEP 5: DRIVER LOOKING AT MIRROR
            // ==========================================
            
            if (animationProgress > 0.4) {
                ctx.globalAlpha = Math.min((animationProgress - 0.4) * 2, 1);
                
                // Driver's head (from behind)
                ctx.fillStyle = '#78350f';
                ctx.beginPath();
                ctx.arc(carX, carY - 20, 18, 0, Math.PI * 2);
                ctx.fill();
                
                // Hair
                ctx.fillStyle = '#27272a';
                ctx.beginPath();
                ctx.arc(carX, carY - 24, 20, Math.PI, 2 * Math.PI);
                ctx.fill();
                
                // Driver's shoulders
                ctx.fillStyle = '#065f46';
                ctx.fillRect(carX - 28, carY - 2, 56, 25);
                
                // Hands on steering wheel (visible from back)
                ctx.fillStyle = '#92400e';
                ctx.beginPath();
                ctx.arc(carX - 25, carY + 10, 6, 0, Math.PI * 2);
                ctx.arc(carX + 25, carY + 10, 6, 0, Math.PI * 2);
                ctx.fill();
                
                // Steering wheel
                ctx.strokeStyle = '#18181b';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(carX, carY + 10, 20, 0.3, Math.PI - 0.3);
                ctx.stroke();
                
                ctx.globalAlpha = 1;
            }
            
            // ==========================================
            // STEP 6: LIGHT RAYS showing reflection path
            // ==========================================
            
            if (animationProgress > 0.65) {
                const rayProg = (animationProgress - 0.65) * 2;
                
                ctx.setLineDash([8, 5]);
                ctx.lineWidth = 3;
                
                // Ray 1: Ambulance to Mirror
                if (rayProg > 0) {
                    ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
                    ctx.beginPath();
                    ctx.moveTo(ambulanceX, ambulanceY);
                    const endX1 = ambulanceX + (mirrorX - 50 - ambulanceX) * Math.min(rayProg, 1);
                    const endY1 = ambulanceY + (mirrorY + 15 - ambulanceY) * Math.min(rayProg, 1);
                    ctx.lineTo(endX1, endY1);
                    ctx.stroke();
                }
                
                // Ray 2: Mirror to Driver's eyes
                if (rayProg > 0.6) {
                    ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)';
                    const prog2 = (rayProg - 0.6) * 2;
                    ctx.beginPath();
                    ctx.moveTo(mirrorX + 50, mirrorY + 15);
                    const endX2 = mirrorX + 50 + (carX - mirrorX - 50) * Math.min(prog2, 1);
                    const endY2 = mirrorY + 15 + (carY - 25 - mirrorY - 15) * Math.min(prog2, 1);
                    ctx.lineTo(endX2, endY2);
                    ctx.stroke();
                }
                
                ctx.setLineDash([]);
            }
            
            // ==========================================
            // STEP 7: EXPLANATION LABELS
            // ==========================================
            
            if (animationProgress > 0.75) {
                ctx.globalAlpha = Math.min((animationProgress - 0.75) * 3, 1);
                
                // Label: Mirror reading
                ctx.fillStyle = 'rgba(16, 185, 129, 0.95)';
                ctx.fillRect(mirrorX - 70, mirrorY - 50, 140, 42);
                
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('In Mirror:', mirrorX, mirrorY - 32);
                ctx.fillText('AMBULANCE ✓', mirrorX, mirrorY - 15);
                
                // Arrow from mirror
                ctx.fillStyle = '#10b981';
                ctx.beginPath();
                ctx.moveTo(mirrorX, mirrorY - 8);
                ctx.lineTo(mirrorX - 8, mirrorY - 12);
                ctx.lineTo(mirrorX + 8, mirrorY - 12);
                ctx.closePath();
                ctx.fill();
                
                ctx.globalAlpha = 1;
            }
            
        }
        else if (currentStep.visual === 'barber') {
            // Background - Barber shop wall
            ctx.fillStyle = '#f3f4f6';
            ctx.fillRect(0, 0, w, h);
            
            // Floor
            ctx.fillStyle = '#d1d5db';
            ctx.fillRect(0, h * 0.75, w, h * 0.25);
            
            // Floor tiles pattern
            ctx.strokeStyle = '#9ca3af';
            ctx.lineWidth = 1;
            for (let i = 0; i < w; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, h * 0.75);
                ctx.lineTo(i, h);
                ctx.stroke();
            }
            
            // Barber chair
            const chairX = w / 2;
            const chairY = h * 0.65;
            
            // Chair base
            ctx.fillStyle = '#4b5563';
            ctx.beginPath();
            ctx.arc(chairX, h * 0.85, 25, 0, Math.PI * 2);
            ctx.fill();
            
            // Chair pole
            ctx.fillStyle = '#6b7280';
            ctx.fillRect(chairX - 8, chairY + 20, 16, h * 0.2);
            
            // Chair seat
            ctx.fillStyle = '#1f2937';
            ctx.fillRect(chairX - 50, chairY, 100, 20);
            
            // Chair back
            ctx.fillStyle = '#374151';
            ctx.fillRect(chairX - 45, chairY - 70, 90, 70);
            
            // Armrests
            ctx.fillStyle = '#1f2937';
            ctx.fillRect(chairX - 60, chairY - 10, 15, 30);
            ctx.fillRect(chairX + 45, chairY - 10, 15, 30);
            
            // Person sitting in chair
            const personX = chairX;
            const personY = chairY - 30;
            
            // Body
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(personX - 35, personY, 70, 50);
            
            // Head (back view)
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(personX, personY - 20, 30, 0, Math.PI * 2);
            ctx.fill();
            
            // Hair
            ctx.fillStyle = '#78350f';
            ctx.beginPath();
            ctx.arc(personX, personY - 25, 32, Math.PI, 2 * Math.PI);
            ctx.fill();
            
            // Neck
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(personX - 12, personY - 5, 24, 10);
            
            // Barber cape
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(personX - 50, personY);
            ctx.lineTo(personX, personY - 10);
            ctx.lineTo(personX + 50, personY);
            ctx.lineTo(personX + 45, personY + 50);
            ctx.lineTo(personX - 45, personY + 50);
            ctx.closePath();
            ctx.fill();
            
            // Front mirror (large wall mirror)
            const mirror1X = w * 0.25;
            const mirror1Y = h * 0.35;
            
            // Mirror frame (wooden)
            ctx.fillStyle = '#78350f';
            ctx.fillRect(mirror1X - 85, mirror1Y - 155, 170, 310);
            
            // Mirror surface
            const mirror1Gradient = ctx.createLinearGradient(mirror1X - 75, 0, mirror1X + 75, 0);
            mirror1Gradient.addColorStop(0, '#e5e7eb');
            mirror1Gradient.addColorStop(0.3, '#f9fafb');
            mirror1Gradient.addColorStop(0.7, '#f9fafb');
            mirror1Gradient.addColorStop(1, '#e5e7eb');
            ctx.fillStyle = mirror1Gradient;
            ctx.fillRect(mirror1X - 75, mirror1Y - 145, 150, 290);
            
            // Mirror shine effect
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(mirror1X - 65, mirror1Y - 135, 20, 270);
            
            // Front reflection (person's face)
            if (animationProgress > 0.3) {
                ctx.globalAlpha = Math.min((animationProgress - 0.3) * 2, 0.7);
                
                // Reflected face
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.arc(mirror1X, mirror1Y, 25, 0, Math.PI * 2);
                ctx.fill();
                
                // Eyes
                ctx.fillStyle = '#1f2937';
                ctx.beginPath();
                ctx.arc(mirror1X - 10, mirror1Y - 5, 3, 0, Math.PI * 2);
                ctx.arc(mirror1X + 10, mirror1Y - 5, 3, 0, Math.PI * 2);
                ctx.fill();
                
                // Smile
                ctx.strokeStyle = '#1f2937';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(mirror1X, mirror1Y + 5, 12, 0.2, Math.PI - 0.2);
                ctx.stroke();
                
                // Reflected shoulders
                ctx.fillStyle = '#3b82f6';
                ctx.fillRect(mirror1X - 30, mirror1Y + 25, 60, 40);
                
                ctx.globalAlpha = 1;
            }
            
            // Back mirror (hand-held)
            const mirror2X = w * 0.72;
            const mirror2Y = h * 0.4;
            
            // Barber's hand holding mirror
            if (animationProgress > 0.2) {
                ctx.globalAlpha = Math.min((animationProgress - 0.2) * 2, 1);
                
                // Barber's arm
                ctx.fillStyle = '#f59e0b';
                ctx.fillRect(mirror2X - 40, mirror2Y + 60, 15, 60);
                
                // Hand
                ctx.beginPath();
                ctx.arc(mirror2X - 32, mirror2Y + 60, 12, 0, Math.PI * 2);
                ctx.fill();
                
                // Mirror handle
                ctx.fillStyle = '#1f2937';
                ctx.fillRect(mirror2X - 35, mirror2Y + 40, 8, 60);
                
                // Mirror frame
                ctx.strokeStyle = '#1f2937';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.arc(mirror2X, mirror2Y, 55, 0, Math.PI * 2);
                ctx.stroke();
                
                // Mirror surface (round)
                const mirror2Gradient = ctx.createRadialGradient(mirror2X, mirror2Y, 0, mirror2X, mirror2Y, 50);
                mirror2Gradient.addColorStop(0, '#f9fafb');
                mirror2Gradient.addColorStop(0.7, '#e5e7eb');
                mirror2Gradient.addColorStop(1, '#d1d5db');
                ctx.fillStyle = mirror2Gradient;
                ctx.beginPath();
                ctx.arc(mirror2X, mirror2Y, 50, 0, Math.PI * 2);
                ctx.fill();
                
                // Back of head reflection in hand mirror
                if (animationProgress > 0.5) {
                    ctx.globalAlpha = Math.min((animationProgress - 0.5) * 2, 0.6);
                    
                    // Reflected back of head
                    ctx.fillStyle = '#fbbf24';
                    ctx.beginPath();
                    ctx.arc(mirror2X, mirror2Y, 22, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Hair
                    ctx.fillStyle = '#78350f';
                    ctx.beginPath();
                    ctx.arc(mirror2X, mirror2Y - 3, 24, Math.PI, 2 * Math.PI);
                    ctx.fill();
                }
                
                ctx.globalAlpha = 1;
            }
            
            // Light rays showing multiple reflections
            if (animationProgress > 0.6) {
                ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                
                const rayProgress = (animationProgress - 0.6) * 2.5;
                
                // Ray 1: Back of head to front mirror
                if (rayProgress > 0) {
                    ctx.beginPath();
                    ctx.moveTo(personX + 25, personY - 20);
                    const endX = personX + 25 + (mirror1X - personX - 25) * Math.min(rayProgress, 1);
                    ctx.lineTo(endX, personY - 20);
                    ctx.stroke();
                }
                
                // Ray 2: Front mirror to back mirror
                if (rayProgress > 1) {
                    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
                    const progress2 = rayProgress - 1;
                    ctx.beginPath();
                    ctx.moveTo(mirror1X + 75, mirror1Y);
                    const endX2 = mirror1X + 75 + (mirror2X - 50 - mirror1X - 75) * Math.min(progress2, 1);
                    ctx.lineTo(endX2, mirror2Y);
                    ctx.stroke();
                }
                
                // Ray 3: Back mirror to eyes (viewing)
                if (rayProgress > 2) {
                    ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
                    const progress3 = rayProgress - 2;
                    ctx.beginPath();
                    ctx.moveTo(mirror2X + 50, mirror2Y - 20);
                    const viewerX = mirror1X - 30;
                    const viewerY = mirror1Y - 5;
                    const endX3 = mirror2X + 50 + (viewerX - mirror2X - 50) * Math.min(progress3, 1);
                    const endY3 = mirror2Y - 20 + (viewerY - mirror2Y + 20) * Math.min(progress3, 1);
                    ctx.lineTo(endX3, endY3);
                    ctx.stroke();
                }
                
                ctx.setLineDash([]);
            }
            
            // Explanation labels
            if (animationProgress > 0.8) {
                ctx.globalAlpha = (animationProgress - 0.8) * 5;
                
                // Label 1
                ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
                ctx.fillRect(mirror1X - 60, mirror1Y - 200, 120, 45);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 11px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Front Mirror', mirror1X, mirror1Y - 178);
                ctx.fillText('Shows your face', mirror1X, mirror1Y - 163);
                
                // Label 2
                ctx.fillStyle = 'rgba(168, 85, 247, 0.9)';
                ctx.fillRect(mirror2X - 65, mirror2Y - 100, 130, 45);
                ctx.fillStyle = '#fff';
                ctx.fillText('Back Mirror', mirror2X, mirror2Y - 78);
                ctx.fillText('Shows back of head', mirror2X, mirror2Y - 63);
                
                // Arrow showing reflection path
                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 3;
                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.moveTo(personX + 30, personY - 40);
                ctx.lineTo(mirror1X + 10, mirror1Y - 160);
                ctx.moveTo(mirror1X + 80, mirror1Y - 80);
                ctx.lineTo(mirror2X - 60, mirror2Y - 60);
                ctx.stroke();
                
                ctx.globalAlpha = 1;
            }
            
            // Title text
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Two Mirrors Help You See Your Back!', w / 2, h * 0.95);
        }
        else if (currentStep.visual === 'periscope') {
            // Sky
            const skyGradient = ctx.createLinearGradient(0, 0, 0, h * 0.3);
            skyGradient.addColorStop(0, '#93c5fd');
            skyGradient.addColorStop(1, '#bfdbfe');
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, w, h * 0.3);
            
            // Clouds
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            ctx.arc(w * 0.2, h * 0.12, 20, 0, Math.PI * 2);
            ctx.arc(w * 0.23, h * 0.12, 25, 0, Math.PI * 2);
            ctx.arc(w * 0.26, h * 0.12, 20, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(w * 0.7, h * 0.18, 22, 0, Math.PI * 2);
            ctx.arc(w * 0.73, h * 0.18, 28, 0, Math.PI * 2);
            ctx.arc(w * 0.76, h * 0.18, 22, 0, Math.PI * 2);
            ctx.fill();
            
            // Water surface
            const waterGradient = ctx.createLinearGradient(0, h * 0.3, 0, h);
            waterGradient.addColorStop(0, '#06b6d4');
            waterGradient.addColorStop(0.5, '#0891b2');
            waterGradient.addColorStop(1, '#0e7490');
            ctx.fillStyle = waterGradient;
            ctx.fillRect(0, h * 0.3, w, h * 0.7);
            
            // Water waves on surface
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            for (let i = 0; i < w; i += 30) {
                ctx.beginPath();
                ctx.arc(i, h * 0.3, 15, 0, Math.PI, false);
                ctx.stroke();
            }
            
            // Sun
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(w * 0.85, h * 0.1, 25, 0, Math.PI * 2);
            ctx.fill();
            
            // Sun rays
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
            ctx.lineWidth = 3;
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 * i) / 8;
                ctx.beginPath();
                ctx.moveTo(w * 0.85 + Math.cos(angle) * 30, h * 0.1 + Math.sin(angle) * 30);
                ctx.lineTo(w * 0.85 + Math.cos(angle) * 45, h * 0.1 + Math.sin(angle) * 45);
                ctx.stroke();
            }
            
            // Enemy ship above water
            const shipX = w * 0.15;
            const shipY = h * 0.25;
            
            if (animationProgress > 0.2) {
                ctx.globalAlpha = Math.min((animationProgress - 0.2) * 2, 1);
                
                // Ship hull
                ctx.fillStyle = '#1f2937';
                ctx.beginPath();
                ctx.moveTo(shipX - 60, shipY);
                ctx.lineTo(shipX + 60, shipY);
                ctx.lineTo(shipX + 50, shipY + 30);
                ctx.lineTo(shipX - 50, shipY + 30);
                ctx.closePath();
                ctx.fill();
                
                // Ship deck
                ctx.fillStyle = '#374151';
                ctx.fillRect(shipX - 55, shipY - 15, 110, 15);
                
                // Cabin/Bridge
                ctx.fillStyle = '#4b5563';
                ctx.fillRect(shipX - 25, shipY - 40, 50, 25);
                
                // Windows
                ctx.fillStyle = '#93c5fd';
                ctx.fillRect(shipX - 20, shipY - 35, 12, 10);
                ctx.fillRect(shipX - 5, shipY - 35, 12, 10);
                ctx.fillRect(shipX + 10, shipY - 35, 12, 10);
                
                // Mast
                ctx.strokeStyle = '#1f2937';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(shipX + 30, shipY - 40);
                ctx.lineTo(shipX + 30, shipY - 90);
                ctx.stroke();
                
                // Flag
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.moveTo(shipX + 30, shipY - 90);
                ctx.lineTo(shipX + 55, shipY - 80);
                ctx.lineTo(shipX + 30, shipY - 70);
                ctx.closePath();
                ctx.fill();
                
                ctx.globalAlpha = 1;
            }
            
            // Submarine (underwater)
            const subX = w * 0.6;
            const subY = h * 0.65;
            
            // Submarine body (main hull)
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.ellipse(subX, subY, 120, 35, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Submarine darker top
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            ctx.ellipse(subX, subY - 5, 120, 30, 0, 0, Math.PI);
            ctx.fill();
            
            // Conning tower
            ctx.fillStyle = '#64748b';
            ctx.fillRect(subX - 25, subY - 50, 50, 50);
            ctx.beginPath();
            ctx.arc(subX, subY - 50, 25, Math.PI, 0);
            ctx.fill();
            
            // Tower windows
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(subX - 15, subY - 40, 12, 10);
            ctx.fillRect(subX + 3, subY - 40, 12, 10);
            
            // Periscope tube extending to surface
            const periscopeX = subX + 15;
            ctx.fillStyle = '#475569';
            ctx.fillRect(periscopeX - 4, h * 0.3, 8, subY - 50 - h * 0.3);
            
            // Periscope top (above water)
            ctx.fillStyle = '#64748b';
            ctx.fillRect(periscopeX - 4, h * 0.3 - 30, 8, 30);
            
            // Periscope lens housing
            ctx.fillStyle = '#1f2937';
            ctx.fillRect(periscopeX - 8, h * 0.3 - 35, 16, 10);
            
            // Top mirror at 45° angle
            ctx.save();
            ctx.translate(periscopeX, h * 0.3 - 30);
            ctx.rotate(-Math.PI / 4);
            
            // Mirror frame
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(-15, 0);
            ctx.lineTo(15, 0);
            ctx.stroke();
            
            // Mirror surface
            ctx.strokeStyle = '#e5e7eb';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-15, 0);
            ctx.lineTo(15, 0);
            ctx.stroke();
            
            ctx.restore();
            
            // Bottom mirror at 45° angle
            ctx.save();
            ctx.translate(periscopeX, subY - 45);
            ctx.rotate(Math.PI / 4);
            
            // Mirror frame
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(-15, 0);
            ctx.lineTo(15, 0);
            ctx.stroke();
            
            // Mirror surface
            ctx.strokeStyle = '#e5e7eb';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-15, 0);
            ctx.lineTo(15, 0);
            ctx.stroke();
            
            ctx.restore();
            
            // Submarine details
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.arc(subX + 80, subY, 15, 0, Math.PI * 2);
            ctx.fill();
            
            // Propeller
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(subX - 110, subY - 10);
            ctx.lineTo(subX - 130, subY - 15);
            ctx.moveTo(subX - 110, subY + 10);
            ctx.lineTo(subX - 130, subY + 15);
            ctx.stroke();
            
            // Light rays showing reflection path
            if (showRays && animationProgress > 0.4) {
                const rayProgress = (animationProgress - 0.4) * 1.5;
                
                ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
                ctx.lineWidth = 3;
                ctx.setLineDash([8, 4]);
                
                // Ray 1: From ship to top mirror (horizontal)
                if (rayProgress > 0) {
                    ctx.beginPath();
                    ctx.moveTo(shipX, shipY);
                    const endX1 = shipX + (periscopeX - shipX) * Math.min(rayProgress, 1);
                    ctx.lineTo(endX1, h * 0.3 - 25);
                    ctx.stroke();
                }
                
                // Ray 2: Down through periscope (vertical)
                if (rayProgress > 1) {
                    ctx.strokeStyle = 'rgba(34, 211, 238, 0.7)';
                    const progress2 = (rayProgress - 1);
                    ctx.beginPath();
                    ctx.moveTo(periscopeX, h * 0.3 - 20);
                    const endY2 = h * 0.3 - 20 + (subY - 50 - h * 0.3 + 20) * Math.min(progress2, 1);
                    ctx.lineTo(periscopeX, endY2);
                    ctx.stroke();
                }
                
                // Ray 3: From bottom mirror to viewer (horizontal)
                if (rayProgress > 2) {
                    ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)';
                    const progress3 = (rayProgress - 2);
                    ctx.beginPath();
                    ctx.moveTo(periscopeX + 5, subY - 45);
                    const endX3 = periscopeX + 5 + 40 * Math.min(progress3, 1);
                    ctx.lineTo(endX3, subY - 40);
                    ctx.stroke();
                    
                    // Eye viewing
                    if (progress3 > 0.5) {
                        ctx.fillStyle = '#fff';
                        ctx.beginPath();
                        ctx.arc(periscopeX + 45, subY - 40, 8, 0, Math.PI * 2);
                        ctx.fill();
                        
                        ctx.fillStyle = '#1f2937';
                        ctx.beginPath();
                        ctx.arc(periscopeX + 47, subY - 40, 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                
                ctx.setLineDash([]);
            }
            
            // Fish swimming
            if (animationProgress > 0.3) {
                const fish1X = w * 0.3 + Math.sin(animationProgress * 4) * 20;
                const fish2X = w * 0.8 - Math.sin(animationProgress * 3) * 15;
                
                // Fish 1
                ctx.fillStyle = '#f97316';
                ctx.beginPath();
                ctx.ellipse(fish1X, h * 0.5, 15, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(fish1X - 15, h * 0.5);
                ctx.lineTo(fish1X - 25, h * 0.5 - 8);
                ctx.lineTo(fish1X - 25, h * 0.5 + 8);
                ctx.closePath();
                ctx.fill();
                
                // Fish 2
                ctx.fillStyle = '#06b6d4';
                ctx.beginPath();
                ctx.ellipse(fish2X, h * 0.75, 12, 6, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(fish2X + 12, h * 0.75);
                ctx.lineTo(fish2X + 20, h * 0.75 - 6);
                ctx.lineTo(fish2X + 20, h * 0.75 + 6);
                ctx.closePath();
                ctx.fill();
            }
            
            // Air bubbles
            if (animationProgress > 0.5) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.lineWidth = 2;
                for (let i = 0; i < 5; i++) {
                    const bubbleY = h * 0.7 - (animationProgress - 0.5) * 100 + i * 30;
                    if (bubbleY > h * 0.3 && bubbleY < h * 0.7) {
                        ctx.beginPath();
                        ctx.arc(subX - 100, bubbleY, 3 + i, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
            }
            
            // Explanation labels
            if (animationProgress > 0.7) {
                ctx.globalAlpha = Math.min((animationProgress - 0.7) * 3, 1);
                
                // Label 1 - Top Mirror
                ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
                ctx.fillRect(periscopeX + 25, h * 0.3 - 50, 140, 40);
                ctx.fillStyle = '#000';
                ctx.font = 'bold 11px Arial';
                ctx.textAlign = 'left';
                ctx.fillText('Top Mirror (45°)', periscopeX + 30, h * 0.3 - 33);
                ctx.fillText('Bends light down', periscopeX + 30, h * 0.3 - 18);
                
                // Label 2 - Bottom Mirror
                ctx.fillStyle = 'rgba(168, 85, 247, 0.9)';
                ctx.fillRect(periscopeX + 25, subY - 60, 145, 40);
                ctx.fillStyle = '#fff';
                ctx.fillText('Bottom Mirror (45°)', periscopeX + 30, subY - 43);
                ctx.fillText('Directs to viewer', periscopeX + 30, subY - 28);
                
                // Water line label
                ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
                ctx.fillRect(w * 0.01, h * 0.28, 100, 30);
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.fillText('Water Surface', w * 0.06, h * 0.3);
                
                ctx.globalAlpha = 1;
            }
            
            // Title
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Periscope: Two Plane Mirrors Help Submarines See Above Water!', w / 2, h * 0.97);
        }
        else if (currentStep.visual === 'practice_position' || 
                 currentStep.visual === 'practice_size' || 
                 currentStep.visual === 'practice_lateral') {
            const objX = w * 0.3;
            const objY = h / 2;
            const imgX = mirrorX + (mirrorX - objX);
            
            drawMirror();
            drawObject(objX, objY, objectHeight);
            
            if (selectedAnswer) {
                drawImage(imgX, objY, objectHeight, 0.7);
                drawMeasurements(objX, imgX, objY);
            }
        }
        else if (currentStep.visual === 'interactive') {
            const objX = isDragging ? draggedObjectPos.x : w * 0.3;
            const objY = isDragging ? draggedObjectPos.y : h / 2;
            const imgX = mirrorX + (mirrorX - objX);
            const imgY = objY;
            
            drawMirror();
            
            // Highlight draggable object
            if (!isDragging) {
                ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.arc(objX, objY, 40, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
            }
            
            drawObject(objX, objY, objectHeight);
            drawImage(imgX, imgY, objectHeight, 0.7);
            
            if (showRays) {
                drawRays(objX, objY, imgX, imgY);
            }
            
            if (showMeasurements) {
                drawMeasurements(objX, imgX, objY);
            }
        }
        else if (currentStep.visual === 'ray_tracing') {
            const objX = w * 0.3;
            const objY = h / 2;
            const imgX = mirrorX + (mirrorX - objX);
            
            drawMirror();
            drawObject(objX, objY, objectHeight);
            drawImage(imgX, objY, objectHeight, 0.7);
            
            // Draw user-drawn rays
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3;
            drawnRays.forEach(ray => {
                ctx.beginPath();
                ctx.moveTo(ray.x1, ray.y1);
                ctx.lineTo(ray.x2, ray.y2);
                ctx.stroke();
            });
        }

    }, [currentStep, animationProgress, isDragging, draggedObjectPos, selectedAnswer, 
        drawnRays, objectType, objectHeight, objectDistance, showRays, showImageFormation, 
        showMeasurements, mirrorPosition, themeColor, darkMode]);

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER UI
    // ═══════════════════════════════════════════════════════════════════════

    const containerStyle: React.CSSProperties = {
        width: `${width}px`,
        maxWidth: '100%',
        height: `${height}px`,
        minHeight: '600px',
        backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
        borderRadius: '20px',
        padding: currentMode === 'learn' ? '8px' : currentMode === 'practice' ? '10px' : '20px',
        boxShadow: darkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)' 
            : '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: currentMode === 'learn' ? '6px' : currentMode === 'practice' ? '8px' : '12px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        border: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)'
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: currentMode === 'learn' ? '2px' : currentMode === 'practice' ? '4px' : '6px',
        marginBottom: currentMode === 'learn' ? '-4px' : currentMode === 'practice' ? '-2px' : '0'
    };

    const titleStyle: React.CSSProperties = {
        fontSize: currentMode === 'learn' ? '18px' : currentMode === 'practice' ? '20px' : '26px',
        fontWeight: '700',
        color: darkMode ? '#ffffff' : '#111827',
        margin: 0,
        marginBottom: currentMode === 'learn' ? '2px' : currentMode === 'practice' ? '2px' : '0',
        animation: 'fadeInUp 0.6s ease',
        letterSpacing: '-0.02em',
        lineHeight: '1.2'
    };

    const descriptionStyle: React.CSSProperties = {
        fontSize: currentMode === 'learn' ? '13px' : currentMode === 'practice' ? '14px' : '16px',
        color: darkMode ? '#d1d5db' : '#4b5563',
        margin: 0,
        marginBottom: currentMode === 'learn' ? '2px' : currentMode === 'practice' ? '2px' : '0',
        lineHeight: currentMode === 'learn' ? '1.4' : currentMode === 'practice' ? '1.4' : '1.6',
        animation: 'fadeInUp 0.6s ease 0.1s both',
        fontWeight: '500'
    };

    const modeSelectorStyle: React.CSSProperties = {
        display: 'flex',
        gap: '6px',
        padding: '4px',
        backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
        borderRadius: '14px',
        animation: 'slideInRight 0.6s ease 0.2s both',
        marginBottom: currentMode === 'learn' ? '-2px' : currentMode === 'practice' ? '-2px' : '0',
        border: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: darkMode 
            ? 'inset 0 1px 2px rgba(0, 0, 0, 0.3)' 
            : 'inset 0 1px 2px rgba(0, 0, 0, 0.04)'
    };

    const getModeButton = (mode: ModeType, label: string, icon: string) => {
        const isActive = currentMode === mode;
        const buttonStyle: React.CSSProperties = {
            flex: 1,
            padding: '10px 18px',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            backgroundColor: isActive ? themeColor : 'transparent',
            color: isActive ? '#ffffff' : darkMode ? '#d1d5db' : '#6b7280',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transform: isActive ? 'scale(1)' : 'scale(0.98)',
            boxShadow: isActive 
                ? `0 4px 14px ${themeColor}40, 0 2px 4px ${themeColor}20` 
                : 'none',
            position: 'relative',
            overflow: 'hidden'
        };

        return (
            <button
                key={mode}
                style={buttonStyle}
                className="plane-mirror-mode-button"
                onClick={() => handleModeChange(mode)}
                onMouseEnter={(e) => {
                    if (!isActive) {
                        e.currentTarget.style.backgroundColor = darkMode ? '#3a3a3a' : '#e5e7eb';
                        e.currentTarget.style.transform = 'scale(1.02)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'scale(0.98)';
                    }
                }}
            >
                <span style={{ fontSize: '18px' }}>{icon}</span>
                {label}
            </button>
        );
    };

    const canvasContainerStyle: React.CSSProperties = {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: darkMode ? '#0f0f0f' : '#f8f9fa',
        borderRadius: '16px',
        padding: currentMode === 'learn' ? '4px' : currentMode === 'practice' ? '6px' : '16px',
        position: 'relative',
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: currentMode === 'practice' ? 'visible' : 'hidden',
        minHeight: currentMode === 'learn' ? '200px' : currentMode === 'practice' ? '250px' : '300px',
        maxHeight: currentMode === 'practice' ? 'none' : '100%',
        border: darkMode ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: darkMode 
            ? 'inset 0 2px 8px rgba(0, 0, 0, 0.3)' 
            : 'inset 0 2px 8px rgba(0, 0, 0, 0.03)'
    };

    const canvasStyle: React.CSSProperties = {
        maxWidth: '100%',
        maxHeight: '100%',
        width: '100%',
        height: 'auto',
        borderRadius: '12px',
        cursor: currentStep?.interactionType === 'drag_object' ? 'move' : 'default',
        position: 'relative',
        zIndex: 1,
        objectFit: 'contain',
        boxShadow: darkMode 
            ? '0 4px 16px rgba(0, 0, 0, 0.4)' 
            : '0 2px 8px rgba(0, 0, 0, 0.08)'
    };

    // Practice mode quiz rendering
    const renderPracticeQuiz = () => {
        if (!currentStep.interactionType) return null;

        const quizContainerStyle: React.CSSProperties = {
            position: 'absolute',
            top: '1%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '92%',
            maxWidth: '600px',
            maxHeight: 'calc(92vh - 100px)',
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: darkMode
                ? '0 24px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                : '0 24px 64px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)',
            animation: 'fadeInScale 0.5s ease',
            zIndex: 100,
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
            overflowY: 'auto',
            overflowX: 'hidden',
            marginBottom: '8px'
        };

        const questionStyle: React.CSSProperties = {
            marginBottom: '14px',
            paddingBottom: '12px',
            borderBottom: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
            textAlign: 'center'
        };

        const questionLabelStyle: React.CSSProperties = {
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            color: themeColor,
            marginBottom: '8px',
            padding: '5px 12px',
            backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)',
            borderRadius: '8px',
            border: `1px solid ${themeColor}30`
        };

        const questionTextStyle: React.CSSProperties = {
            fontSize: '20px',
            fontWeight: '700',
            color: darkMode ? '#ffffff' : '#111827',
            lineHeight: '1.3',
            margin: 0,
            letterSpacing: '-0.01em'
        };

        const optionsContainerStyle: React.CSSProperties = {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginBottom: '12px',
            '@media (max-width: 768px)': {
                gridTemplateColumns: '1fr'
            }
        };

        const getAnswerButton = (answer: string, label: string, index: number) => {
            const isSelected = selectedAnswer === answer;
            const isCorrect = currentStep.correctAnswer === answer;
            const showResult = showFeedback && isSelected;
            const showCorrectAnswer = showFeedback && isCorrect;

            const buttonStyle: React.CSSProperties = {
                padding: '12px 16px',
                border: showResult 
                    ? `2px solid ${isCorrect ? '#10b981' : '#ef4444'}`
                    : showCorrectAnswer && showFeedback
                    ? `2px solid #10b981`
                    : `1.5px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: showFeedback ? 'default' : 'pointer',
                backgroundColor: showResult
                    ? isCorrect 
                        ? 'rgba(16, 185, 129, 0.12)' 
                        : 'rgba(239, 68, 68, 0.12)'
                    : showCorrectAnswer && showFeedback
                    ? 'rgba(16, 185, 129, 0.08)'
                    : darkMode ? '#2a2a2a' : '#ffffff',
                color: showResult
                    ? isCorrect ? '#059669' : '#dc2626'
                    : showCorrectAnswer && showFeedback
                    ? '#059669'
                    : darkMode ? '#f3f4f6' : '#111827',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                opacity: showFeedback && !isSelected && !showCorrectAnswer ? 0.5 : 1,
                position: 'relative',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: isSelected && !showFeedback 
                    ? `0 6px 16px ${themeColor}35, 0 2px 4px ${themeColor}20` 
                    : showResult || showCorrectAnswer
                    ? `0 2px 8px rgba(0, 0, 0, 0.08)`
                    : '0 2px 4px rgba(0, 0, 0, 0.04)',
                width: '100%'
            };

            const optionLetterStyle: React.CSSProperties = {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: showResult
                    ? isCorrect 
                        ? '#10b981' 
                        : '#ef4444'
                    : showCorrectAnswer && showFeedback
                    ? '#10b981'
                    : darkMode ? '#3a3a3a' : '#f3f4f6',
                color: showResult || showCorrectAnswer
                    ? '#ffffff'
                    : darkMode ? '#d1d5db' : '#6b7280',
                fontWeight: '700',
                fontSize: '15px',
                flexShrink: 0,
                boxShadow: showResult || showCorrectAnswer
                    ? '0 2px 6px rgba(0, 0, 0, 0.2)'
                    : '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: showResult || showCorrectAnswer
                    ? 'none'
                    : `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`
            };

            const iconStyle: React.CSSProperties = {
                marginLeft: 'auto',
                fontSize: '20px',
                opacity: showResult || showCorrectAnswer ? 1 : 0
            };

            return (
                <button
                    key={answer}
                    style={buttonStyle}
                    className="plane-mirror-quiz-button"
                    onClick={() => !showFeedback && handleAnswerSelect(answer)}
                    onMouseEnter={(e) => {
                        if (!showFeedback) {
                            e.currentTarget.style.transform = 'scale(1.02)';
                            e.currentTarget.style.borderColor = themeColor;
                            e.currentTarget.style.boxShadow = `0 4px 16px ${themeColor}50`;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!showFeedback && !isSelected) {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.borderColor = darkMode ? '#4b5563' : '#d1d5db';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                        }
                    }}
                    disabled={showFeedback}
                >
                    <span style={optionLetterStyle}>
                        {String.fromCharCode(65 + index)}
                    </span>
                    <span style={{ flex: 1 }}>{label}</span>
                    {showResult && (
                        <span style={iconStyle}>
                            {isCorrect ? '✓' : '✗'}
                        </span>
                    )}
                    {showCorrectAnswer && !isSelected && (
                        <span style={iconStyle}>✓</span>
                    )}
                </button>
            );
        };

        let answerButtons = null;

        if (currentStep.interactionType === 'position_quiz') {
            answerButtons = (
                <div style={optionsContainerStyle} className="plane-mirror-quiz-options">
                    {getAnswerButton('5 cm behind the mirror', '5 cm behind the mirror', 0)}
                    {getAnswerButton('5 cm in front', '5 cm in front', 1)}
                    {getAnswerButton('10 cm behind', '10 cm behind', 2)}
                    {getAnswerButton('At the mirror', 'At mirror surface', 3)}
                </div>
            );
        } else if (currentStep.interactionType === 'size_quiz') {
            answerButtons = (
                <div style={optionsContainerStyle} className="plane-mirror-quiz-options">
                    {getAnswerButton('same', 'Same size', 0)}
                    {getAnswerButton('larger', 'Larger', 1)}
                    {getAnswerButton('smaller', 'Smaller', 2)}
                    {getAnswerButton('half', 'Half size', 3)}
                </div>
            );
        } else if (currentStep.interactionType === 'lateral_quiz') {
            answerButtons = (
                <div style={optionsContainerStyle} className="plane-mirror-quiz-options">
                    {getAnswerButton('left', 'Left hand', 0)}
                    {getAnswerButton('right', 'Right hand', 1)}
                    {getAnswerButton('both', 'Both hands', 2)}
                    {getAnswerButton('neither', 'No hand', 3)}
                </div>
            );
        }

        return (
            <div style={quizContainerStyle} className="plane-mirror-quiz-container">
                <div style={questionStyle}>
                    <div style={questionLabelStyle}>Question</div>
                    <p style={questionTextStyle} className="plane-mirror-quiz-question">
                        {currentStep.description}
                    </p>
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                    <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: darkMode ? '#9ca3af' : '#6b7280',
                        marginBottom: '6px'
                    }}>
                        Select the correct answer:
                    </div>
                    {answerButtons}
                </div>

                {showFeedback && (
                    <div style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        backgroundColor: selectedAnswer === currentStep.correctAnswer 
                            ? 'rgba(16, 185, 129, 0.12)' 
                            : 'rgba(239, 68, 68, 0.12)',
                        border: `1.5px solid ${selectedAnswer === currentStep.correctAnswer ? '#10b981' : '#ef4444'}`,
                        color: selectedAnswer === currentStep.correctAnswer ? '#059669' : '#dc2626',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: '14px',
                        lineHeight: '1.4',
                        animation: 'fadeInScale 0.4s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: selectedAnswer === currentStep.correctAnswer
                            ? '0 4px 12px rgba(16, 185, 129, 0.2)'
                            : '0 4px 12px rgba(239, 68, 68, 0.2)'
                    }}>
                        <span style={{ fontSize: '20px' }}>
                            {selectedAnswer === currentStep.correctAnswer ? '✓' : '✗'}
                        </span>
                        <span>
                            {selectedAnswer === currentStep.correctAnswer 
                                ? currentStep.feedback?.correct 
                                : currentStep.feedback?.incorrect}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    const controlsStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: currentMode === 'learn' ? '8px' : currentMode === 'practice' ? '10px' : '12px',
        animation: 'fadeInUp 0.6s ease 0.3s both',
        marginTop: currentMode === 'learn' ? '-4px' : currentMode === 'practice' ? '-2px' : '0'
    };

    const navigationStyle: React.CSSProperties = {
        display: 'flex',
        gap: '6px',
        alignItems: 'center'
    };

    const getNavButton = (onClick: () => void, disabled: boolean, icon: string, label: string) => {
        const buttonStyle: React.CSSProperties = {
            padding: '10px 18px',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: disabled ? 'not-allowed' : 'pointer',
            backgroundColor: disabled ? (darkMode ? '#2a2a2a' : '#e5e7eb') : themeColor,
            color: disabled ? (darkMode ? '#666' : '#999') : '#ffffff',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: disabled ? 0.6 : 1,
            transform: 'scale(1)',
            boxShadow: disabled ? 'none' : `0 4px 12px ${themeColor}40, 0 2px 4px ${themeColor}20`,
            position: 'relative',
            overflow: 'hidden'
        };

        return (
            <button
                style={buttonStyle}
                onClick={onClick}
                disabled={disabled}
                onMouseEnter={(e) => {
                    if (!disabled) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!disabled) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                    }
                }}
                onMouseDown={(e) => {
                    if (!disabled) {
                        e.currentTarget.style.transform = 'scale(0.95)';
                    }
                }}
                onMouseUp={(e) => {
                    if (!disabled) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }
                }}
            >
                <span style={{ fontSize: '16px' }}>{icon}</span>
                {label}
            </button>
        );
    };

    const stepIndicatorStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 16px',
        backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        color: darkMode ? '#ffffff' : '#111827',
        border: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: darkMode 
            ? 'inset 0 1px 2px rgba(0, 0, 0, 0.3)' 
            : 'inset 0 1px 2px rgba(0, 0, 0, 0.04)'
    };

    const progressBarStyle: React.CSSProperties = {
        flex: 1,
        height: '8px',
        backgroundColor: darkMode ? '#3a3a3a' : '#e5e7eb',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative',
        border: darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)'
    };

    const progressFillStyle: React.CSSProperties = {
        height: '100%',
        background: `linear-gradient(90deg, ${themeColor}, ${themeColor}dd)`,
        width: `${((currentStepIndex + 1) / totalSteps) * 100}%`,
        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: '4px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 2px 8px ${themeColor}50`
    };

    const shimmerStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
        animation: 'shimmer 2s infinite'
    };

    return (
        <div style={containerStyle} className={`plane-mirror-container ${currentMode === 'learn' ? 'learn-mode' : currentMode === 'practice' ? 'practice-mode' : ''}`}>
            <div style={headerStyle}>
                <h2 style={titleStyle} className="plane-mirror-title">
                    {data.topic || 'Images Formed in a Plane Mirror'}
                </h2>
                {currentStep && (
                    <p style={descriptionStyle} className="plane-mirror-description">{currentStep.title}</p>
                )}
            </div>

            {showModeSelector && (
                <div style={modeSelectorStyle} className="plane-mirror-mode-selector">
                    {enabledModes.includes('learn') && getModeButton('learn', 'Learn', '📚')}
                    {enabledModes.includes('practice') && getModeButton('practice', 'Practice', '✏️')}
                    {enabledModes.includes('real_world') && getModeButton('real_world', 'Real World', '🌍')}
                    {enabledModes.includes('hands_on') && getModeButton('hands_on', 'Hands-On', '🔬')}
                </div>
            )}

            <div style={canvasContainerStyle} className="plane-mirror-canvas-container">
                <canvas
                    ref={canvasRef}
                    width={currentMode === 'learn' ? Math.max(width - 60, 400) : Math.max(width - 100, 400)}
                    height={currentMode === 'learn' ? Math.max(height - 180, 300) : Math.max(height - 280, 300)}
                    style={canvasStyle}
                    onMouseDown={currentStep?.interactionType === 'drag_object' ? handleMouseDown : undefined}
                    onMouseMove={currentStep?.interactionType === 'drag_object' ? handleMouseMove : undefined}
                    onMouseUp={currentStep?.interactionType === 'drag_object' ? handleMouseUp : undefined}
                    onMouseLeave={currentStep?.interactionType === 'drag_object' ? handleMouseUp : undefined}
                />
                {currentStep?.interactionType && currentMode === 'practice' && (
                    <>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.4)',
                            zIndex: 99,
                            backdropFilter: 'blur(4px)',
                            transition: 'all 0.3s ease'
                        }} />
                        {renderPracticeQuiz()}
                    </>
                )}
                
                {currentStep?.interactionType === 'drag_object' && (
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
                        color: '#ffffff',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        animation: 'bounce 2s infinite',
                        boxShadow: `0 4px 16px ${themeColor}50, 0 2px 4px ${themeColor}30`,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        zIndex: 10
                    }}>
                        ← Drag the object!
                    </div>
                )}
            </div>

            {(showNavigation || showPlayPause || showStepIndicator) && (
                <div style={controlsStyle} className="plane-mirror-controls">
                    {showNavigation && (
                        <div style={navigationStyle} className="plane-mirror-nav">
                            {getNavButton(handlePrevious, currentStepIndex === 0, '◀', 'Previous')}
                            {getNavButton(handleNext, currentStepIndex === totalSteps - 1, '▶', 'Next')}
                        </div>
                    )}

                    {showStepIndicator && (
                        <div style={stepIndicatorStyle} className="plane-mirror-step-indicator">
                            <span>Step {currentStepIndex + 1} of {totalSteps}</span>
                            <div style={progressBarStyle}>
                                <div style={progressFillStyle}>
                                    <div style={shimmerStyle} />
                                </div>
                            </div>
                        </div>
                    )}

                    {showPlayPause && autoPlayDuration > 0 && (
                        <button
                            style={{
                                padding: '10px 18px',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                backgroundColor: isPlaying ? '#ef4444' : '#10b981',
                                color: '#ffffff',
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: isPlaying
                                    ? '0 4px 12px rgba(239, 68, 68, 0.4), 0 2px 4px rgba(239, 68, 68, 0.2)'
                                    : '0 4px 12px rgba(16, 185, 129, 0.4), 0 2px 4px rgba(16, 185, 129, 0.2)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onClick={togglePlayPause}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            <span style={{ fontSize: '16px' }}>{isPlaying ? '⏸' : '▶'}</span>
                            {isPlaying ? 'Pause' : 'Play'}
                        </button>
                    )}
                </div>
            )}

            {currentMode === 'practice' && (
                <div style={{
                    textAlign: 'center',
                    padding: '10px 16px',
                    backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '700',
                    color: themeColor,
                    animation: 'fadeInScale 0.5s ease',
                    border: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
                    boxShadow: darkMode 
                        ? 'inset 0 1px 2px rgba(0, 0, 0, 0.3)' 
                        : 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
                    letterSpacing: '0.02em'
                }}>
                    Score: {score} / {filteredSteps.length}
                </div>
            )}
        </div>
    );
};

export default PlaneMirrorTool;