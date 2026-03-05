// React import - if types aren't available, install @types/react
// @ts-expect-error - React types should be available via @types/react package
import React, { useState, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM - FROM PDF SPECIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════

const DESIGN_SYSTEM = {
    colors: {
        primary: {
            main: '#4A4DC9',
            light: '#C1C1EA',
            dark: '#533086'
        },
        secondary: {
            main: '#FF7212',
            light: '#FFF3E4',
            dark: '#FC9145'
        },
        neutral: {
            dark: '#4E4E4E',
            medium: '#CACACA',
            light: '#EBEBEB',
            lightest: '#F5F5F5'
        },
        gradients: {
            primary: 'linear-gradient(135deg, #533086 0%, #FC9145 100%)',
            secondary: 'linear-gradient(135deg, #4A4DC9 0%, #FF7212 100%)',
            light: 'linear-gradient(135deg, #C1C1EA 0%, #FFF3E4 100%)'
        }
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '40px'
    },
    borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        pill: '100px'
    },
    typography: {
        fontFamily: "'Poppins', sans-serif",
        weights: {
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700
        }
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

type ModeType = 'learn' | 'practice' | 'explore';

type ConstructionType = 
    | 'perpendicular_bisector' 
    | 'angle_bisector' 
    | '90_degree_angle' 
    | '60_degree_angle'
    | 'copy_angle'
    | 'parallel_lines'
    | 'regular_hexagon';

interface Point {
    x: number;
    y: number;
    label?: string;
}

interface Line {
    start: Point;
    end: Point;
    style?: 'solid' | 'dashed';
    color?: string;
}

interface Arc {
    center: Point;
    radius: number;
    startAngle?: number;
    endAngle?: number;
    color?: string;
}

interface BaseDataInterface {
    themeColor?: string;
    autoPlayDuration?: number;
    [key: string]: any;
}

interface StepDataInterface {
    id: number;
    title: string;
    description: string;
    construction: ConstructionType;
    elements: {
        points?: Point[];
        lines?: Line[];
        arcs?: Arc[];
    };
    instructions: string[];
    [key: string]: any;
}

type StepData = StepDataInterface;

interface GeometricConstructionAdditionalProps {
    constructionType?: ConstructionType;
    showGrid?: boolean;
    showLabels?: boolean;
    lineSegmentLength?: number;
    angleToConstruct?: number;
    customPoints?: Point[];
    guidedMode?: boolean;
    showConstructionSteps?: boolean;
    [key: string]: any;
}

interface StepDetails {
    currentStep: number;
    totalSteps: number;
    stepTitle: string;
    isPlaying: boolean;
    [key: string]: any;
}

interface GeometricConstructionToolProps {
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
        additionalProps?: GeometricConstructionAdditionalProps;
    };
    setStepDetails?: (stepDetails: StepDetails) => void;
    stopAutoNext?: boolean;
    setStopAutoNext?: (stopAutoNext: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// LOAD POPPINS FONT
// ═══════════════════════════════════════════════════════════════════════════

const loadPoppinsFont = () => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const GeometricConstructionTool: React.FC<GeometricConstructionToolProps> = ({ 
    props: propsParam = {}, 
    setStepDetails,
    stopAutoNext,
    setStopAutoNext
}) => {
    // Load Poppins font
    useEffect(() => {
        loadPoppinsFont();
    }, []);

    // Type-safe props extraction
    const props: NonNullable<GeometricConstructionToolProps['props']> = propsParam as NonNullable<GeometricConstructionToolProps['props']>;
    
    // Extract props with defaults
    const baseWidth = props?.width || 800;
    const baseHeight = props?.height || 800;
    const showModeSelector = props?.showModeSelector !== false;
    const showNavigation = props?.showNavigation !== false;
    const showPlayPause = props?.showPlayPause !== false;
    const showStepIndicator = props?.showStepIndicator !== false;
    const darkMode = props?.darkMode || false;
    const animationSpeed = props?.animationSpeed || 1;
    const autoPlayDuration = props?.autoPlayDuration || props?.data?.autoPlayDuration || 8000;
    const enabledModes = props?.enabledModes || ['learn', 'practice', 'explore'];

    // Validate and compute initial mode
    const getValidInitialMode = (): ModeType => {
        const requestedMode = props?.initialMode || 'learn';
        if (enabledModes.indexOf(requestedMode) !== -1) {
            return requestedMode;
        }
        return enabledModes[0] || 'learn';
    };

    // Responsive state
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // Detect screen size
    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 640);
            setIsTablet(width >= 640 && width < 1024);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Responsive canvas dimensions
    const getCanvasDimensions = () => {
        if (isMobile) {
            const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
            return {
                width: screenWidth - 32,
                height: Math.min(screenWidth - 32, 500)
            };
        }
        if (isTablet) {
            return {
                width: Math.min(baseWidth, 700),
                height: Math.min(baseHeight * 0.8, 550)
            };
        }
        return {
            width: baseWidth,
            height: baseHeight * 0.8
        };
    };
    
    const [canvasDimensions, setCanvasDimensions] = useState(getCanvasDimensions());
    const width = canvasDimensions.width;
    const canvasHeight = canvasDimensions.height;
    
    // Update canvas dimensions on resize
    useEffect(() => {
        const handleResize = () => {
            const newDimensions = getCanvasDimensions();
            setCanvasDimensions(newDimensions);
        };
        
        const debouncedResize = () => {
            clearTimeout((handleResize as any).timeout);
            (handleResize as any).timeout = setTimeout(handleResize, 150);
        };
        
        window.addEventListener('resize', debouncedResize);
        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout((handleResize as any).timeout);
        };
    }, [isMobile, isTablet]);

    // Additional props
    const additionalProps = props?.additionalProps || {};
    const {
        constructionType = 'perpendicular_bisector',
        showGrid = true,
        showLabels = true,
        lineSegmentLength = 200,
        angleToConstruct = 60,
        guidedMode = true,
        showConstructionSteps = true
    } = additionalProps as GeometricConstructionAdditionalProps;

    // State
    const [currentMode, setCurrentMode] = useState<ModeType>(getValidInitialMode());
    const [currentStep, setCurrentStep] = useState(props?.initialStep || 0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [animationProgress, setAnimationProgress] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
    const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();

    // ═══════════════════════════════════════════════════════════════════════════
    // PRACTICE MODE - MCQ QUESTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    interface MCQQuestion {
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
    }

    const practiceQuestions: MCQQuestion[] = [
        {
            question: "What is a perpendicular bisector?",
            options: [
                "A line that divides another line into two equal parts at any angle",
                "A line that divides another line into two equal parts at 90°",
                "A line that is parallel to another line",
                "A line that divides an angle into two equal parts"
            ],
            correctAnswer: 1,
            explanation: "A perpendicular bisector divides a line segment into two equal parts and is perpendicular (90°) to it."
        },
        {
            question: "When constructing a perpendicular bisector, why must the arcs from both endpoints have the same radius?",
            options: [
                "To make the drawing look symmetrical",
                "To ensure the arcs intersect at points equidistant from both endpoints",
                "It's just a convention, any radius works",
                "To make the construction faster"
            ],
            correctAnswer: 1,
            explanation: "Equal radii ensure that the intersection points are equidistant from both endpoints, which is necessary for the perpendicular bisector property."
        },
        {
            question: "Which congruence condition proves that the perpendicular bisector construction is correct?",
            options: [
                "ASA (Angle-Side-Angle)",
                "AAS (Angle-Angle-Side)",
                "SSS (Side-Side-Side)",
                "RHS (Right angle-Hypotenuse-Side)"
            ],
            correctAnswer: 2,
            explanation: "The SSS congruence condition is used because we create triangles with three equal sides (equal radii from both endpoints)."
        },
        {
            question: "If you construct a perpendicular bisector of line segment AB, which of the following is TRUE?",
            options: [
                "Every point on the bisector is equidistant from A and B",
                "The bisector is parallel to AB",
                "The bisector divides AB into three equal parts",
                "The bisector makes a 45° angle with AB"
            ],
            correctAnswer: 0,
            explanation: "By definition, every point on the perpendicular bisector is at the same distance from both endpoints A and B."
        },
        {
            question: "What is the minimum radius required when constructing a perpendicular bisector of a line segment?",
            options: [
                "Exactly equal to the length of the line segment",
                "Less than half the length of the line segment",
                "More than half the length of the line segment",
                "Any radius works as long as it's the same from both endpoints"
            ],
            correctAnswer: 2,
            explanation: "The radius must be more than half the line segment length so the arcs from both endpoints intersect above and below the line."
        }
    ];

    // ═══════════════════════════════════════════════════════════════════════════
    // REAL WORLD MODE - EXAMPLES
    // ═══════════════════════════════════════════════════════════════════════════

    interface RealWorldExample {
        title: string;
        description: string;
        application: string;
        imageDescription: string;
        details: string[];
    }

    const realWorldExamples: RealWorldExample[] = [
        {
            title: "Finding the Center of a Circle",
            description: "Perpendicular bisectors help locate the exact center of any circular object",
            application: "Carpentry, Engineering, Art",
            imageDescription: "Draw any two chords in the circle and construct their perpendicular bisectors. Where they intersect is the center!",
            details: [
                "Used by carpenters to find centers of circular wooden pieces",
                "Engineers use this to locate the center of cylindrical objects",
                "Artists use it to create perfectly centered circular designs",
                "No measurement needed - pure geometric construction"
            ]
        },
        {
            title: "Equal Distance Planning",
            description: "Finding locations that are equally distant from two points",
            application: "Urban Planning, Facility Location",
            imageDescription: "Build a facility on the perpendicular bisector of two cities to ensure equal travel distance",
            details: [
                "Fire stations placed equidistant from multiple neighborhoods",
                "Water towers positioned to serve equal areas",
                "Mobile towers placed for equal coverage",
                "Schools located for equal accessibility from different areas"
            ]
        },
        {
            title: "Navigation and GPS",
            description: "Perpendicular bisectors help in triangulation for location finding",
            application: "GPS Systems, Maritime Navigation",
            imageDescription: "GPS receivers use perpendicular bisectors from multiple satellites to pinpoint your exact location",
            details: [
                "GPS uses signals from multiple satellites",
                "Perpendicular bisectors help narrow down position",
                "Used in maritime navigation for centuries",
                "Modern smartphones use this principle constantly"
            ]
        },
        {
            title: "Architecture and Construction",
            description: "Creating symmetrical designs and ensuring structural balance",
            application: "Building Design, Bridge Construction",
            imageDescription: "Architects use perpendicular bisectors to create perfectly symmetrical building facades",
            details: [
                "Ensures symmetry in building designs",
                "Used in creating balanced arch bridges",
                "Helps in dividing land plots equally",
                "Essential for creating mirror-image structures"
            ]
        },
        {
            title: "Sports Field Layout",
            description: "Marking center lines and creating fair playing areas",
            application: "Sports, Recreation",
            imageDescription: "Soccer, basketball, and tennis courts use perpendicular bisectors for center lines",
            details: [
                "Soccer field center line divides the field equally",
                "Basketball court center circle uses this principle",
                "Tennis court net placement at perpendicular bisector",
                "Ensures fair play with equal territory for both teams"
            ]
        }
    ];

    // ═══════════════════════════════════════════════════════════════════════════
    // STEP DATA
    // ═══════════════════════════════════════════════════════════════════════════

    const defaultSteps: StepData[] = [
        {
            id: 0,
            title: "Introduction to Geometric Constructions",
            description: "Learn to construct geometric figures using only a compass and straightedge",
            construction: 'perpendicular_bisector',
            elements: { points: [], lines: [], arcs: [] },
            instructions: [
                "A perpendicular bisector divides a line into two equal parts at 90°",
                "Any point equidistant from endpoints lies on the perpendicular bisector",
                "We'll construct this using compass and straightedge only"
            ]
        },
        {
            id: 1,
            title: "Step 1: Draw the Line Segment",
            description: "Start with a line segment XY",
            construction: 'perpendicular_bisector',
            elements: {
                points: [
                    { x: 200, y: 325, label: 'X' },
                    { x: 600, y: 325, label: 'Y' }
                ],
                lines: [
                    { start: { x: 200, y: 325 }, end: { x: 600, y: 325 }, style: 'solid', color: DESIGN_SYSTEM.colors.primary.main }
                ],
                arcs: []
            },
            instructions: [
                "Draw a line segment and mark its endpoints as X and Y",
                "This is the line segment we will bisect perpendicularly",
                "The endpoints should be clearly visible"
            ]
        },
        {
            id: 2,
            title: "Step 2: Draw Arcs from Point X",
            description: "Draw arcs with center at X, above and below the line",
            construction: 'perpendicular_bisector',
            elements: {
                points: [
                    { x: 200, y: 325, label: 'X' },
                    { x: 600, y: 325, label: 'Y' }
                ],
                lines: [
                    { start: { x: 200, y: 325 }, end: { x: 600, y: 325 }, style: 'solid', color: DESIGN_SYSTEM.colors.primary.main }
                ],
                arcs: [
                    { center: { x: 200, y: 325 }, radius: 280, color: DESIGN_SYSTEM.colors.secondary.main, startAngle: -Math.PI/2.5, endAngle: Math.PI/2.5 }
                ]
            },
            instructions: [
                "Place compass point at X",
                "Set radius to MORE than half the length of XY (radius > 200 pixels)",
                "Draw arcs above and below the line",
                "Keep this radius fixed - you'll use the same radius from Y!"
            ]
        },
        {
            id: 3,
            title: "Step 3: Draw Arcs from Point Y",
            description: "Draw arcs with center at Y using the SAME radius",
            construction: 'perpendicular_bisector',
            elements: {
                points: [
                    { x: 200, y: 325, label: 'X' },
                    { x: 600, y: 325, label: 'Y' }
                ],
                lines: [
                    { start: { x: 200, y: 325 }, end: { x: 600, y: 325 }, style: 'solid', color: DESIGN_SYSTEM.colors.primary.main }
                ],
                arcs: [
                    { center: { x: 200, y: 325 }, radius: 280, color: DESIGN_SYSTEM.colors.secondary.main, startAngle: -Math.PI/2.5, endAngle: Math.PI/2.5 },
                    { center: { x: 600, y: 325 }, radius: 280, color: DESIGN_SYSTEM.colors.primary.dark, startAngle: Math.PI - Math.PI/2.5, endAngle: Math.PI + Math.PI/2.5 }
                ]
            },
            instructions: [
                "Now place compass point at Y",
                "IMPORTANT: Use the EXACT SAME radius as before!",
                "Draw arcs above and below line XY",
                "The purple arcs should intersect the orange arcs at two points"
            ]
        },
        {
            id: 4,
            title: "Step 4: Mark Intersection Points",
            description: "Mark where the arcs intersect as points A and B",
            construction: 'perpendicular_bisector',
            elements: {
                points: [
                    { x: 200, y: 325, label: 'X' },
                    { x: 600, y: 325, label: 'Y' },
                    { x: 400, y: 129, label: 'A' },
                    { x: 400, y: 521, label: 'B' }
                ],
                lines: [
                    { start: { x: 200, y: 325 }, end: { x: 600, y: 325 }, style: 'solid', color: DESIGN_SYSTEM.colors.primary.main }
                ],
                arcs: [
                    { center: { x: 200, y: 325 }, radius: 280, color: DESIGN_SYSTEM.colors.secondary.main, startAngle: -Math.PI/2.5, endAngle: Math.PI/2.5 },
                    { center: { x: 600, y: 325 }, radius: 280, color: DESIGN_SYSTEM.colors.primary.dark, startAngle: Math.PI - Math.PI/2.5, endAngle: Math.PI + Math.PI/2.5 }
                ]
            },
            instructions: [
                "Look at where the orange and purple arcs cross each other",
                "Mark the upper intersection point as A",
                "Mark the lower intersection point as B",
                "These points are EQUIDISTANT from both X and Y (AX = AY, BX = BY)"
            ]
        },
        {
            id: 5,
            title: "Step 5: Draw the Perpendicular Bisector",
            description: "Connect points A and B to complete the construction",
            construction: 'perpendicular_bisector',
            elements: {
                points: [
                    { x: 200, y: 325, label: 'X' },
                    { x: 600, y: 325, label: 'Y' },
                    { x: 400, y: 129, label: 'A' },
                    { x: 400, y: 521, label: 'B' },
                    { x: 400, y: 325, label: 'O' }
                ],
                lines: [
                    { start: { x: 200, y: 325 }, end: { x: 600, y: 325 }, style: 'solid', color: DESIGN_SYSTEM.colors.primary.main },
                    { start: { x: 400, y: 129 }, end: { x: 400, y: 521 }, style: 'solid', color: DESIGN_SYSTEM.colors.secondary.dark }
                ],
                arcs: [
                    { center: { x: 200, y: 325 }, radius: 280, color: DESIGN_SYSTEM.colors.secondary.main, startAngle: -Math.PI/2.5, endAngle: Math.PI/2.5 },
                    { center: { x: 600, y: 325 }, radius: 280, color: DESIGN_SYSTEM.colors.primary.dark, startAngle: Math.PI - Math.PI/2.5, endAngle: Math.PI + Math.PI/2.5 }
                ]
            },
            instructions: [
                "Draw a straight line through points A and B",
                "This line AB is the perpendicular bisector of XY",
                "Point O is where AB crosses XY - this is the MIDPOINT (XO = OY)",
                "AB is PERPENDICULAR to XY: ∠AOX = ∠AOY = 90°",
                "✓ Construction complete! Every point on line AB is equidistant from X and Y"
            ]
        }
    ];

    const steps = props?.steps || defaultSteps;
    const filteredSteps = props?.filterSteps 
        ? steps.filter(step => props?.filterSteps?.indexOf(step.id) !== -1)
        : steps;

    const currentStepData = filteredSteps[currentStep] || filteredSteps[0];

    // ═══════════════════════════════════════════════════════════════════════════
    // ANIMATION STYLES
    // ═══════════════════════════════════════════════════════════════════════════

    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            * {
                box-sizing: border-box;
            }
            
            @keyframes slideUp {
                from { 
                    opacity: 0; 
                    transform: translateY(30px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }
            @keyframes scaleIn {
                from { 
                    opacity: 0; 
                    transform: scale(0.9); 
                }
                to { 
                    opacity: 1; 
                    transform: scale(1); 
                }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            .animate-slide-up {
                animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .animate-scale-in {
                animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .animate-fade-in {
                animation: fadeIn 0.4s ease-out;
            }
            
            /* Smooth scrolling for the entire page */
            html {
                scroll-behavior: smooth;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            
            /* Remove default button styles on mobile */
            button {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
            }
        `;
        document.head.appendChild(styleSheet);
        return () => document.head.removeChild(styleSheet);
    }, []);

    // ═══════════════════════════════════════════════════════════════════════════
    // CANVAS DRAWING
    // ═══════════════════════════════════════════════════════════════════════════

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, width, canvasHeight);
        
        // Calculate scale factor for responsive drawing
        const scaleFactor = Math.min(width / 800, canvasHeight / 650);

        // Draw subtle grid if enabled
        if (showGrid) {
            ctx.strokeStyle = darkMode ? '#2a2a3a' : DESIGN_SYSTEM.colors.neutral.light;
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 4]);
            
            const gridSize = 40 * scaleFactor;
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvasHeight);
                ctx.stroke();
            }
            
            for (let y = 0; y < canvasHeight; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
            ctx.setLineDash([]);
        }

        // Determine what's new in this step
        const isNewElement = (elementType: string, index: number) => {
            if (currentStep === 0 || currentStep === 1) return true;
            
            const prevStepData = filteredSteps[currentStep - 1];
            const currentElements = currentStepData.elements;
            const prevElements = prevStepData.elements;
            
            if (elementType === 'line') {
                const prevLineCount = prevElements.lines?.length || 0;
                return index >= prevLineCount;
            }
            if (elementType === 'arc') {
                const prevArcCount = prevElements.arcs?.length || 0;
                return index >= prevArcCount;
            }
            if (elementType === 'point') {
                const prevPointCount = prevElements.points?.length || 0;
                return index >= prevPointCount;
            }
            return true;
        };

        const progress = Math.min(animationProgress, 1);
        
        // Scale point coordinates
        const scalePoint = (point: Point): Point => ({
            x: point.x * scaleFactor + (width - 800 * scaleFactor) / 2,
            y: point.y * scaleFactor + (canvasHeight - 650 * scaleFactor) / 2,
            label: point.label
        });

        // Draw lines with enhanced styling
        if (currentStepData.elements.lines) {
            currentStepData.elements.lines.forEach((line, index) => {
                const isNew = isNewElement('line', index);
                const lineProgress = isNew ? Math.max(0, Math.min(1, (progress * 3) - index * 0.1)) : 1;
                
                if (lineProgress > 0) {
                    const start = scalePoint(line.start);
                    const end = scalePoint(line.end);
                    
                    ctx.strokeStyle = line.color || DESIGN_SYSTEM.colors.primary.main;
                    ctx.lineWidth = 4 * Math.max(0.5, scaleFactor);
                    ctx.lineCap = 'round';
                    ctx.shadowColor = line.color || DESIGN_SYSTEM.colors.primary.main;
                    ctx.shadowBlur = 8 * scaleFactor;
                    
                    if (line.style === 'dashed') {
                        ctx.setLineDash([8 * scaleFactor, 6 * scaleFactor]);
                    } else {
                        ctx.setLineDash([]);
                    }

                    const endX = start.x + (end.x - start.x) * lineProgress;
                    const endY = start.y + (end.y - start.y) * lineProgress;

                    ctx.beginPath();
                    ctx.moveTo(start.x, start.y);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                    
                    ctx.shadowBlur = 0;
                }
            });
        }

        // Draw arcs with enhanced styling
        if (currentStepData.elements.arcs) {
            currentStepData.elements.arcs.forEach((arc, index) => {
                const isNew = isNewElement('arc', index);
                const arcProgress = isNew ? Math.max(0, Math.min(1, (progress * 3) - index * 0.3)) : 1;
                
                if (arcProgress > 0) {
                    const center = scalePoint(arc.center);
                    const radius = arc.radius * scaleFactor;
                    
                    ctx.strokeStyle = arc.color || DESIGN_SYSTEM.colors.primary.main;
                    ctx.lineWidth = 4 * Math.max(0.5, scaleFactor);
                    ctx.lineCap = 'round';
                    ctx.shadowColor = arc.color || DESIGN_SYSTEM.colors.primary.main;
                    ctx.shadowBlur = 8 * scaleFactor;
                    ctx.setLineDash([]);

                    if (arc.startAngle !== undefined && arc.endAngle !== undefined) {
                        const startAngle = arc.startAngle;
                        const endAngle = arc.endAngle;
                        const currentEndAngle = startAngle + (endAngle - startAngle) * arcProgress;

                        ctx.beginPath();
                        ctx.arc(center.x, center.y, radius, startAngle, currentEndAngle);
                        ctx.stroke();
                    }
                    
                    ctx.shadowBlur = 0;
                }
            });
        }

        // Draw points with enhanced styling
        if (currentStepData.elements.points) {
            currentStepData.elements.points.forEach((point, index) => {
                const isNew = isNewElement('point', index);
                const pointProgress = isNew ? Math.max(0, Math.min(1, (progress * 4) - index * 0.15)) : 1;
                
                if (pointProgress > 0) {
                    const scaledPoint = scalePoint(point);
                    
                    // Outer glow
                    ctx.fillStyle = `${DESIGN_SYSTEM.colors.primary.main}40`;
                    ctx.beginPath();
                    ctx.arc(scaledPoint.x, scaledPoint.y, 12 * scaleFactor * pointProgress, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Main point
                    ctx.fillStyle = DESIGN_SYSTEM.colors.primary.main;
                    ctx.beginPath();
                    ctx.arc(scaledPoint.x, scaledPoint.y, 7 * scaleFactor * pointProgress, 0, Math.PI * 2);
                    ctx.fill();

                    // Label
                    if (showLabels && point.label && pointProgress > 0.5) {
                        ctx.fillStyle = darkMode ? '#ffffff' : DESIGN_SYSTEM.colors.neutral.dark;
                        ctx.font = `700 ${18 * Math.max(0.7, scaleFactor)}px ${DESIGN_SYSTEM.typography.fontFamily}`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        const labelX = point.label === 'O' ? scaledPoint.x + 18 * scaleFactor : scaledPoint.x;
                        ctx.fillText(point.label, labelX, scaledPoint.y - 24 * scaleFactor);
                    }
                }
            });
        }

    }, [currentStepData, animationProgress, width, canvasHeight, showGrid, showLabels, darkMode, currentStep, filteredSteps]);

    // Animation progress effect
    useEffect(() => {
        if (isPlaying || currentStep !== 0) {
            let startTime: number;
            const duration = 2000 / animationSpeed;

            const animate = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);

                setAnimationProgress(progress);

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
        } else {
            setAnimationProgress(0);
        }
    }, [currentStep, isPlaying, animationSpeed]);

    // Auto-play effect
    useEffect(() => {
        if (isPlaying && autoPlayDuration > 0 && !stopAutoNext) {
            const timeout = setTimeout(() => {
                if (currentStep < filteredSteps.length - 1) {
                    setCurrentStep(prev => prev + 1);
                } else {
                    setIsPlaying(false);
                }
            }, autoPlayDuration);

            return () => clearTimeout(timeout);
        }
    }, [isPlaying, currentStep, autoPlayDuration, stopAutoNext, filteredSteps.length]);

    // Update parent component
    useEffect(() => {
        if (setStepDetails) {
            setStepDetails({
                currentStep: currentStep + 1,
                totalSteps: filteredSteps.length,
                stepTitle: currentStepData.title,
                isPlaying
            });
        }
    }, [currentStep, isPlaying, currentStepData, filteredSteps.length, setStepDetails]);

    // ═══════════════════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════════════════

    const handleNext = () => {
        if (currentStep < filteredSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setAnimationProgress(0);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            setAnimationProgress(0);
        }
    };

    const handlePlayPause = () => {
        setIsPlaying(prev => !prev);
        if (setStopAutoNext) {
            setStopAutoNext(false);
        }
    };

    const handleReset = () => {
        setCurrentStep(0);
        setIsPlaying(false);
        setAnimationProgress(0);
    };

    const handleModeChange = (mode: ModeType) => {
        setCurrentMode(mode);
        setCurrentStep(0);
        setAnimationProgress(0);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowAnswerFeedback(false);
        setIsAnswerCorrect(null);
        setCurrentExampleIndex(0);
    };

    const handleAnswerSelect = (answerIndex: number) => {
        setSelectedAnswer(answerIndex);
        setShowAnswerFeedback(false);
        setIsAnswerCorrect(null);
    };

    const handleNextQuestion = () => {
        const currentQuestion = practiceQuestions[currentQuestionIndex];
        
        if (selectedAnswer !== null && !showAnswerFeedback) {
            const correct = selectedAnswer === currentQuestion.correctAnswer;
            setIsAnswerCorrect(correct);
            setShowAnswerFeedback(true);
            return;
        }
        
        if (currentQuestionIndex < practiceQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowAnswerFeedback(false);
            setIsAnswerCorrect(null);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setSelectedAnswer(null);
            setShowAnswerFeedback(false);
            setIsAnswerCorrect(null);
        }
    };

    const handleNextExample = () => {
        if (currentExampleIndex < realWorldExamples.length - 1) {
            setCurrentExampleIndex(prev => prev + 1);
        }
    };

    const handlePrevExample = () => {
        if (currentExampleIndex > 0) {
            setCurrentExampleIndex(prev => prev - 1);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // STYLES - FOLLOWING PDF DESIGN SYSTEM
    // ═══════════════════════════════════════════════════════════════════════════

    const containerStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: isMobile ? '100%' : (isTablet ? '768px' : `${width}px`),
        margin: '0 auto',
        backgroundColor: darkMode ? '#1a1a2e' : '#ffffff',
        borderRadius: isMobile ? '0' : DESIGN_SYSTEM.borderRadius.md,
        boxShadow: isMobile ? 'none' : '0 8px 32px rgba(74, 77, 201, 0.12)',
        overflow: 'hidden',
        fontFamily: DESIGN_SYSTEM.typography.fontFamily,
        display: 'flex',
        flexDirection: 'column',
        minHeight: isMobile ? '100vh' : 'auto',
        border: isMobile ? 'none' : `1px solid ${DESIGN_SYSTEM.colors.neutral.light}`
    };

    const headerStyle: React.CSSProperties = {
        padding: isMobile ? '20px' : '32px',
        background: darkMode 
            ? 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderBottom: `2px solid ${darkMode ? '#2a2a3a' : DESIGN_SYSTEM.colors.neutral.light}`
    };

    const titleStyle: React.CSSProperties = {
        fontSize: isMobile ? '22px' : '28px',
        fontWeight: DESIGN_SYSTEM.typography.weights.bold,
        background: DESIGN_SYSTEM.colors.gradients.secondary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '12px',
        lineHeight: '1.3'
    };

    const descriptionStyle: React.CSSProperties = {
        fontSize: isMobile ? '14px' : '16px',
        color: darkMode ? '#a0a0b0' : DESIGN_SYSTEM.colors.neutral.dark,
        marginBottom: DESIGN_SYSTEM.spacing.lg,
        lineHeight: '1.6',
        fontWeight: DESIGN_SYSTEM.typography.weights.regular
    };

    const modeSelectorStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: isMobile ? '8px' : '12px',
        marginTop: '16px'
    };

    const modeButtonStyle = (active: boolean): React.CSSProperties => ({
        padding: isMobile ? '10px 16px' : (isTablet ? '11px 20px' : '12px 24px'),
        borderRadius: DESIGN_SYSTEM.borderRadius.pill,
        border: active ? 'none' : `2px solid ${darkMode ? '#2a2a3a' : DESIGN_SYSTEM.colors.neutral.light}`,
        background: active 
            ? DESIGN_SYSTEM.colors.gradients.primary
            : (darkMode ? '#1a1a2e' : '#ffffff'),
        color: active ? '#ffffff' : (darkMode ? '#a0a0b0' : DESIGN_SYSTEM.colors.neutral.dark),
        fontSize: isMobile ? '13px' : (isTablet ? '14px' : '15px'),
        fontWeight: DESIGN_SYSTEM.typography.weights.semibold,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: active ? 'scale(1.02)' : 'scale(1)',
        boxShadow: active ? '0 4px 16px rgba(74, 77, 201, 0.3)' : 'none',
        flex: isMobile ? '1 1 0' : 'none',
        minWidth: isMobile ? '0' : (isTablet ? '100px' : 'auto'),
        fontFamily: DESIGN_SYSTEM.typography.fontFamily,
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        whiteSpace: 'nowrap'
    });

    const canvasContainerStyle: React.CSSProperties = {
        backgroundColor: darkMode ? '#0f0f1e' : DESIGN_SYSTEM.colors.neutral.lightest,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isMobile ? '12px' : (isTablet ? '16px' : '24px'),
        overflowX: 'auto',
        overflowY: 'hidden',
        position: 'relative',
        minHeight: isMobile ? '350px' : (isTablet ? '450px' : '500px')
    };

    const instructionsBlockStyle: React.CSSProperties = {
        backgroundColor: darkMode ? '#1a1a2e' : '#ffffff',
        padding: isMobile ? '20px' : '28px',
        borderTop: `2px solid ${darkMode ? '#2a2a3a' : DESIGN_SYSTEM.colors.neutral.light}`,
        minHeight: isMobile ? '120px' : '140px'
    };

    const instructionsTitleStyle: React.CSSProperties = {
        fontSize: isMobile ? '16px' : '18px',
        fontWeight: DESIGN_SYSTEM.typography.weights.bold,
        marginBottom: '16px',
        color: DESIGN_SYSTEM.colors.primary.main,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: DESIGN_SYSTEM.typography.fontFamily
    };

    const instructionItemStyle: React.CSSProperties = {
        fontSize: isMobile ? '14px' : '15px',
        color: darkMode ? '#c0c0d0' : DESIGN_SYSTEM.colors.neutral.dark,
        marginBottom: '12px',
        paddingLeft: '28px',
        position: 'relative',
        lineHeight: '1.7',
        fontFamily: DESIGN_SYSTEM.typography.fontFamily
    };

    const bulletStyle: React.CSSProperties = {
        position: 'absolute',
        left: '0',
        color: DESIGN_SYSTEM.colors.secondary.main,
        fontWeight: DESIGN_SYSTEM.typography.weights.bold,
        fontSize: '16px'
    };

    const controlsStyle: React.CSSProperties = {
        padding: isMobile ? '16px 20px' : '20px 32px',
        borderTop: `2px solid ${darkMode ? '#2a2a3a' : DESIGN_SYSTEM.colors.neutral.light}`,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: darkMode ? '#1a1a2e' : '#ffffff',
        gap: isMobile ? '16px' : '0'
    };

    const buttonGroupStyle: React.CSSProperties = {
        display: 'flex',
        gap: isMobile ? '8px' : '12px',
        flexWrap: 'wrap',
        justifyContent: isMobile ? 'center' : 'flex-start',
        width: isMobile ? '100%' : 'auto'
    };

    // Contained button style (primary)
    const buttonStyle = (disabled: boolean = false, variant: 'contained' | 'outlined' = 'contained'): React.CSSProperties => {
        const basePadding = isMobile ? '12px 18px' : (isTablet ? '12px 20px' : '12px 24px');
        const fontSize = isMobile ? '14px' : (isTablet ? '14px' : '15px');
        
        if (variant === 'outlined') {
            return {
                padding: basePadding,
                borderRadius: DESIGN_SYSTEM.borderRadius.pill,
                border: `2px solid ${disabled ? DESIGN_SYSTEM.colors.neutral.medium : DESIGN_SYSTEM.colors.primary.main}`,
                backgroundColor: 'transparent',
                color: disabled ? DESIGN_SYSTEM.colors.neutral.medium : DESIGN_SYSTEM.colors.primary.main,
                fontSize: fontSize,
                fontWeight: DESIGN_SYSTEM.typography.weights.semibold,
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: disabled ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: isMobile ? '1 1 0' : 'none',
                minWidth: isMobile ? '0' : 'auto',
                justifyContent: 'center',
                fontFamily: DESIGN_SYSTEM.typography.fontFamily,
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
            };
        }
        
        return {
            padding: basePadding,
            borderRadius: DESIGN_SYSTEM.borderRadius.pill,
            border: 'none',
            background: disabled 
                ? DESIGN_SYSTEM.colors.neutral.medium 
                : DESIGN_SYSTEM.colors.gradients.primary,
            color: '#ffffff',
            fontSize: fontSize,
            fontWeight: DESIGN_SYSTEM.typography.weights.semibold,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: disabled ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: isMobile ? '1 1 0' : 'none',
            minWidth: isMobile ? '0' : 'auto',
            justifyContent: 'center',
            boxShadow: disabled ? 'none' : '0 4px 16px rgba(74, 77, 201, 0.3)',
            fontFamily: DESIGN_SYSTEM.typography.fontFamily,
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation'
        };
    };

    const stepIndicatorStyle: React.CSSProperties = {
        fontSize: isMobile ? '13px' : (isTablet ? '14px' : '15px'),
        color: darkMode ? '#a0a0b0' : DESIGN_SYSTEM.colors.neutral.dark,
        fontWeight: DESIGN_SYSTEM.typography.weights.semibold,
        textAlign: 'center',
        width: isMobile ? '100%' : 'auto',
        order: isMobile ? -1 : 0,
        fontFamily: DESIGN_SYSTEM.typography.fontFamily,
        padding: isMobile ? '10px 16px' : (isTablet ? '10px 18px' : '8px 20px'),
        background: darkMode ? '#0f0f1e' : DESIGN_SYSTEM.colors.neutral.lightest,
        borderRadius: DESIGN_SYSTEM.borderRadius.pill,
        whiteSpace: 'nowrap'
    };

    const mcqContainerStyle: React.CSSProperties = {
        padding: isMobile ? '20px' : '32px',
        backgroundColor: darkMode ? '#0f0f1e' : DESIGN_SYSTEM.colors.neutral.lightest,
        minHeight: isMobile ? '350px' : '450px'
    };

    const questionCardStyle: React.CSSProperties = {
        backgroundColor: darkMode ? '#1a1a2e' : '#ffffff',
        borderRadius: DESIGN_SYSTEM.borderRadius.md,
        padding: isMobile ? '20px' : '32px',
        boxShadow: '0 8px 32px rgba(74, 77, 201, 0.12)',
        border: `1px solid ${darkMode ? '#2a2a3a' : DESIGN_SYSTEM.colors.neutral.light}`
    };

    const questionTextStyle: React.CSSProperties = {
        fontSize: isMobile ? '17px' : '19px',
        fontWeight: DESIGN_SYSTEM.typography.weights.semibold,
        color: darkMode ? '#ffffff' : DESIGN_SYSTEM.colors.neutral.dark,
        marginBottom: isMobile ? '20px' : '28px',
        lineHeight: '1.6',
        fontFamily: DESIGN_SYSTEM.typography.fontFamily
    };

    const questionNumberStyle: React.CSSProperties = {
        display: 'inline-block',
        background: DESIGN_SYSTEM.colors.gradients.primary,
        color: '#ffffff',
        borderRadius: '50%',
        width: isMobile ? '32px' : '36px',
        height: isMobile ? '32px' : '36px',
        textAlign: 'center',
        lineHeight: isMobile ? '32px' : '36px',
        marginRight: '12px',
        fontWeight: DESIGN_SYSTEM.typography.weights.bold,
        fontSize: isMobile ? '14px' : '16px',
        boxShadow: '0 4px 12px rgba(74, 77, 201, 0.3)'
    };

    const optionsContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '12px' : '14px'
    };

    const optionButtonStyle = (index: number, isSelected: boolean): React.CSSProperties => ({
        padding: isMobile ? '16px 14px' : (isTablet ? '16px 18px' : '18px 24px'),
        borderRadius: DESIGN_SYSTEM.borderRadius.sm,
        border: `2px solid ${isSelected ? DESIGN_SYSTEM.colors.primary.main : (darkMode ? '#2a2a3a' : DESIGN_SYSTEM.colors.neutral.light)}`,
        backgroundColor: isSelected 
            ? (darkMode ? '#2a2a44' : DESIGN_SYSTEM.colors.primary.light)
            : (darkMode ? '#1a1a2e' : '#ffffff'),
        color: darkMode ? '#ffffff' : DESIGN_SYSTEM.colors.neutral.dark,
        fontSize: isMobile ? '14px' : (isTablet ? '15px' : '16px'),
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        fontWeight: isSelected ? DESIGN_SYSTEM.typography.weights.semibold : DESIGN_SYSTEM.typography.weights.regular,
        display: 'flex',
        alignItems: 'flex-start',
        gap: isMobile ? '10px' : (isTablet ? '12px' : '16px'),
        fontFamily: DESIGN_SYSTEM.typography.fontFamily,
        boxShadow: isSelected ? '0 4px 16px rgba(74, 77, 201, 0.2)' : 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        minHeight: isMobile ? '60px' : 'auto'
    });

    const optionLabelStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: isMobile ? '28px' : '32px',
        height: isMobile ? '28px' : '32px',
        borderRadius: '50%',
        background: DESIGN_SYSTEM.colors.gradients.secondary,
        color: '#ffffff',
        fontWeight: DESIGN_SYSTEM.typography.weights.bold,
        fontSize: isMobile ? '13px' : '15px',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(255, 114, 18, 0.3)'
    };

    const exampleContainerStyle: React.CSSProperties = {
        padding: isMobile ? '20px' : '32px',
        backgroundColor: darkMode ? '#0f0f1e' : DESIGN_SYSTEM.colors.neutral.lightest,
        minHeight: isMobile ? '350px' : '450px'
    };

    const exampleCardStyle: React.CSSProperties = {
        backgroundColor: darkMode ? '#1a1a2e' : '#ffffff',
        borderRadius: DESIGN_SYSTEM.borderRadius.md,
        padding: isMobile ? '24px' : '32px',
        boxShadow: '0 8px 32px rgba(74, 77, 201, 0.12)',
        border: `1px solid ${darkMode ? '#2a2a3a' : DESIGN_SYSTEM.colors.neutral.light}`
    };

    const exampleTitleStyle: React.CSSProperties = {
        fontSize: isMobile ? '22px' : '26px',
        fontWeight: DESIGN_SYSTEM.typography.weights.bold,
        background: DESIGN_SYSTEM.colors.gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '16px',
        lineHeight: '1.3',
        fontFamily: DESIGN_SYSTEM.typography.fontFamily
    };

    const exampleDescriptionStyle: React.CSSProperties = {
        fontSize: isMobile ? '15px' : '17px',
        color: darkMode ? '#c0c0d0' : DESIGN_SYSTEM.colors.neutral.dark,
        marginBottom: '20px',
        lineHeight: '1.7',
        fontFamily: DESIGN_SYSTEM.typography.fontFamily
    };

    const applicationBadgeStyle: React.CSSProperties = {
        display: 'inline-block',
        background: DESIGN_SYSTEM.colors.gradients.light,
        color: DESIGN_SYSTEM.colors.primary.dark,
        padding: isMobile ? '6px 14px' : '8px 16px',
        borderRadius: DESIGN_SYSTEM.borderRadius.pill,
        fontSize: isMobile ? '13px' : '14px',
        fontWeight: DESIGN_SYSTEM.typography.weights.semibold,
        marginBottom: '20px',
        fontFamily: DESIGN_SYSTEM.typography.fontFamily,
        border: `1px solid ${DESIGN_SYSTEM.colors.primary.light}`
    };

    const imageDescriptionStyle: React.CSSProperties = {
        background: darkMode 
            ? 'linear-gradient(135deg, #2a2a44 0%, #1a1a2e 100%)'
            : DESIGN_SYSTEM.colors.gradients.light,
        padding: isMobile ? '16px' : '20px',
        borderRadius: DESIGN_SYSTEM.borderRadius.sm,
        fontSize: isMobile ? '14px' : '15px',
        fontStyle: 'italic',
        color: darkMode ? '#a0a0b0' : DESIGN_SYSTEM.colors.neutral.dark,
        marginBottom: '24px',
        borderLeft: `4px solid ${DESIGN_SYSTEM.colors.secondary.main}`,
        lineHeight: '1.7',
        fontFamily: DESIGN_SYSTEM.typography.fontFamily
    };

    const detailsListStyle: React.CSSProperties = {
        marginTop: '20px'
    };

    const detailItemStyle: React.CSSProperties = {
        fontSize: isMobile ? '14px' : '15px',
        color: darkMode ? '#c0c0d0' : DESIGN_SYSTEM.colors.neutral.dark,
        marginBottom: '12px',
        paddingLeft: '28px',
        position: 'relative',
        lineHeight: '1.7',
        fontFamily: DESIGN_SYSTEM.typography.fontFamily
    };

    const detailBulletStyle: React.CSSProperties = {
        position: 'absolute',
        left: '0',
        color: DESIGN_SYSTEM.colors.secondary.main,
        fontWeight: DESIGN_SYSTEM.typography.weights.bold,
        fontSize: '16px'
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // RENDER - PRACTICE MODE
    // ═══════════════════════════════════════════════════════════════════════════

    if (currentMode === 'practice') {
        const currentQuestion = practiceQuestions[currentQuestionIndex];
        
        return (
            <div style={containerStyle} className="animate-fade-in">
                {/* Header */}
                <div style={headerStyle}>
                    <div style={titleStyle}>Practice Mode</div>
                    <div style={descriptionStyle}>Test your knowledge about geometric constructions</div>
                    
                    {/* Mode Selector */}
                    {showModeSelector && (
                        <div style={modeSelectorStyle}>
                            {enabledModes.indexOf('learn') !== -1 && (
                                <button
                                    style={modeButtonStyle(currentMode === 'learn')}
                                    onClick={() => handleModeChange('learn')}
                                    onMouseEnter={(e) => {
                                        if (currentMode !== 'learn') {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (currentMode !== 'learn') {
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }
                                    }}
                                >
                                    📚 Learn
                                </button>
                            )}
                            {enabledModes.indexOf('practice') !== -1 && (
                                <button
                                    style={modeButtonStyle(currentMode === 'practice')}
                                    onClick={() => handleModeChange('practice')}
                                >
                                    ✏️ Practice
                                </button>
                            )}
                            {enabledModes.indexOf('explore') !== -1 && (
                                <button
                                    style={modeButtonStyle(currentMode === 'explore')}
                                    onClick={() => handleModeChange('explore')}
                                    onMouseEnter={(e) => {
                                        if (currentMode !== 'explore') {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (currentMode !== 'explore') {
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }
                                    }}
                                >
                                    🌍 Real World
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* MCQ Content */}
                <div style={mcqContainerStyle}>
                    <div style={questionCardStyle} className="animate-scale-in">
                        <div style={questionTextStyle}>
                            <span style={questionNumberStyle}>{currentQuestionIndex + 1}</span>
                            {currentQuestion.question}
                        </div>
                        
                        <div style={optionsContainerStyle}>
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = selectedAnswer === index;
                                const isCorrect = index === currentQuestion.correctAnswer;
                                const showFeedback = showAnswerFeedback;
                                
                                let buttonStyleOverride: React.CSSProperties = {};
                                if (showFeedback) {
                                    if (isCorrect) {
                                        buttonStyleOverride = {
                                            border: `2px solid ${DESIGN_SYSTEM.colors.secondary.main}`,
                                            backgroundColor: darkMode ? '#1a3a2e' : DESIGN_SYSTEM.colors.secondary.light,
                                            color: darkMode ? '#ffffff' : DESIGN_SYSTEM.colors.neutral.dark
                                        };
                                    } else if (isSelected && !isCorrect) {
                                        buttonStyleOverride = {
                                            border: `2px solid #ef4444`,
                                            backgroundColor: darkMode ? '#3a1a1a' : '#fee2e2',
                                            color: darkMode ? '#ffffff' : '#991b1b'
                                        };
                                    }
                                }
                                
                                return (
                                    <button
                                        key={index}
                                        style={{...optionButtonStyle(index, isSelected), ...buttonStyleOverride}}
                                        onClick={() => !showFeedback && handleAnswerSelect(index)}
                                        disabled={showFeedback}
                                        onMouseEnter={(e) => {
                                            if (!showFeedback && selectedAnswer !== index) {
                                                e.currentTarget.style.transform = 'translateX(4px)';
                                                e.currentTarget.style.borderColor = DESIGN_SYSTEM.colors.primary.main;
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!showFeedback && selectedAnswer !== index) {
                                                e.currentTarget.style.transform = 'translateX(0)';
                                                e.currentTarget.style.borderColor = darkMode ? '#2a2a3a' : DESIGN_SYSTEM.colors.neutral.light;
                                            }
                                        }}
                                    >
                                        <span style={optionLabelStyle}>
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        <span style={{ flex: 1 }}>{option}</span>
                                        {showFeedback && isCorrect && (
                                            <span style={{ fontSize: '20px', color: DESIGN_SYSTEM.colors.secondary.main }}>✓</span>
                                        )}
                                        {showFeedback && isSelected && !isCorrect && (
                                            <span style={{ fontSize: '20px', color: '#ef4444' }}>✗</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Answer Feedback */}
                        {showAnswerFeedback && (
                            <div style={{
                                marginTop: '28px',
                                padding: isMobile ? '18px' : '24px',
                                borderRadius: DESIGN_SYSTEM.borderRadius.sm,
                                backgroundColor: isAnswerCorrect 
                                    ? (darkMode ? '#1a3a2e' : DESIGN_SYSTEM.colors.secondary.light)
                                    : (darkMode ? '#3a1a1a' : '#fee2e2'),
                                border: `2px solid ${isAnswerCorrect ? DESIGN_SYSTEM.colors.secondary.main : '#ef4444'}`,
                            }} className="animate-slide-up">
                                <div style={{
                                    fontSize: isMobile ? '17px' : '19px',
                                    fontWeight: DESIGN_SYSTEM.typography.weights.bold,
                                    color: isAnswerCorrect ? DESIGN_SYSTEM.colors.secondary.main : '#ef4444',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontFamily: DESIGN_SYSTEM.typography.fontFamily
                                }}>
                                    {isAnswerCorrect ? '✓ Correct!' : '✗ Incorrect'}
                                </div>
                                {!isAnswerCorrect && (
                                    <div style={{
                                        fontSize: isMobile ? '15px' : '16px',
                                        color: darkMode ? '#fca5a5' : '#991b1b',
                                        marginTop: '10px',
                                        lineHeight: '1.6',
                                        fontFamily: DESIGN_SYSTEM.typography.fontFamily
                                    }}>
                                        <strong>Correct Answer:</strong> {String.fromCharCode(65 + currentQuestion.correctAnswer)}. {currentQuestion.options[currentQuestion.correctAnswer]}
                                    </div>
                                )}
                                <div style={{
                                    fontSize: isMobile ? '14px' : '15px',
                                    color: darkMode ? '#a0a0b0' : DESIGN_SYSTEM.colors.neutral.dark,
                                    marginTop: '16px',
                                    fontStyle: 'italic',
                                    lineHeight: '1.7',
                                    fontFamily: DESIGN_SYSTEM.typography.fontFamily
                                }}>
                                    {currentQuestion.explanation}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div style={controlsStyle}>
                    <div style={buttonGroupStyle}>
                        <button
                            style={buttonStyle(currentQuestionIndex === 0, 'outlined')}
                            onClick={handlePrevQuestion}
                            disabled={currentQuestionIndex === 0}
                            onMouseEnter={(e) => {
                                if (currentQuestionIndex > 0) {
                                    e.currentTarget.style.transform = 'translateX(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(74, 77, 201, 0.2)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentQuestionIndex > 0) {
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }
                            }}
                        >
                            ← Previous
                        </button>
                        <button
                            style={buttonStyle(
                                selectedAnswer === null || 
                                (currentQuestionIndex === practiceQuestions.length - 1 && !showAnswerFeedback)
                            )}
                            onClick={handleNextQuestion}
                            disabled={selectedAnswer === null}
                            onMouseEnter={(e) => {
                                if (selectedAnswer !== null) {
                                    e.currentTarget.style.transform = 'translateX(2px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedAnswer !== null) {
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }
                            }}
                        >
                            {showAnswerFeedback 
                                ? (currentQuestionIndex === practiceQuestions.length - 1 ? 'Finish' : 'Next Question →')
                                : 'Check Answer →'
                            }
                        </button>
                    </div>

                    <div style={stepIndicatorStyle}>
                        Question {currentQuestionIndex + 1} of {practiceQuestions.length}
                    </div>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // RENDER - EXPLORE MODE
    // ═══════════════════════════════════════════════════════════════════════════

    if (currentMode === 'explore') {
        const currentExample = realWorldExamples[currentExampleIndex];
        
        return (
            <div style={containerStyle} className="animate-fade-in">
                {/* Header */}
                <div style={headerStyle}>
                    <div style={titleStyle}>Real World Applications</div>
                    <div style={descriptionStyle}>Discover how geometric constructions are used in everyday life</div>
                    
                    {/* Mode Selector */}
                    {showModeSelector && (
                        <div style={modeSelectorStyle}>
                            {enabledModes.indexOf('learn') !== -1 && (
                                <button
                                    style={modeButtonStyle(currentMode === 'learn')}
                                    onClick={() => handleModeChange('learn')}
                                    onMouseEnter={(e) => {
                                        if (currentMode !== 'learn') {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (currentMode !== 'learn') {
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }
                                    }}
                                >
                                    📚 Learn
                                </button>
                            )}
                            {enabledModes.indexOf('practice') !== -1 && (
                                <button
                                    style={modeButtonStyle(currentMode === 'practice')}
                                    onClick={() => handleModeChange('practice')}
                                    onMouseEnter={(e) => {
                                        if (currentMode !== 'practice') {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (currentMode !== 'practice') {
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }
                                    }}
                                >
                                    ✏️ Practice
                                </button>
                            )}
                            {enabledModes.indexOf('explore') !== -1 && (
                                <button
                                    style={modeButtonStyle(currentMode === 'explore')}
                                    onClick={() => handleModeChange('explore')}
                                >
                                    🌍 Real World
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Example Content */}
                <div style={exampleContainerStyle}>
                    <div style={exampleCardStyle} className="animate-scale-in">
                        <div style={exampleTitleStyle}>
                            {currentExample.title}
                        </div>
                        
                        <div style={applicationBadgeStyle}>
                            📍 {currentExample.application}
                        </div>
                        
                        <div style={exampleDescriptionStyle}>
                            {currentExample.description}
                        </div>
                        
                        <div style={imageDescriptionStyle}>
                            💡 <strong>How it works:</strong> {currentExample.imageDescription}
                        </div>
                        
                        <div style={detailsListStyle}>
                            <div style={{ 
                                fontSize: isMobile ? '17px' : '18px', 
                                fontWeight: DESIGN_SYSTEM.typography.weights.bold, 
                                marginBottom: '16px',
                                color: darkMode ? '#ffffff' : DESIGN_SYSTEM.colors.neutral.dark,
                                fontFamily: DESIGN_SYSTEM.typography.fontFamily
                            }}>
                                Key Applications:
                            </div>
                            {currentExample.details.map((detail, index) => (
                                <div key={index} style={detailItemStyle}>
                                    <span style={detailBulletStyle}>✓</span>
                                    {detail}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div style={controlsStyle}>
                    <div style={buttonGroupStyle}>
                        <button
                            style={buttonStyle(currentExampleIndex === 0, 'outlined')}
                            onClick={handlePrevExample}
                            disabled={currentExampleIndex === 0}
                            onMouseEnter={(e) => {
                                if (currentExampleIndex > 0) {
                                    e.currentTarget.style.transform = 'translateX(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(74, 77, 201, 0.2)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentExampleIndex > 0) {
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }
                            }}
                        >
                            ← Previous
                        </button>
                        <button
                            style={buttonStyle(currentExampleIndex === realWorldExamples.length - 1)}
                            onClick={handleNextExample}
                            disabled={currentExampleIndex === realWorldExamples.length - 1}
                            onMouseEnter={(e) => {
                                if (currentExampleIndex < realWorldExamples.length - 1) {
                                    e.currentTarget.style.transform = 'translateX(2px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentExampleIndex < realWorldExamples.length - 1) {
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }
                            }}
                        >
                            Next →
                        </button>
                    </div>

                    <div style={stepIndicatorStyle}>
                        Example {currentExampleIndex + 1} of {realWorldExamples.length}
                    </div>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // RENDER - LEARN MODE (DEFAULT)
    // ═══════════════════════════════════════════════════════════════════════════

    return (
        <div style={containerStyle} className="animate-fade-in">
            {/* Header */}
            <div style={headerStyle}>
                <div style={titleStyle}>{currentStepData.title}</div>
                <div style={descriptionStyle}>{currentStepData.description}</div>
                
                {/* Mode Selector */}
                {showModeSelector && (
                    <div style={modeSelectorStyle}>
                        {enabledModes.indexOf('learn') !== -1 && (
                            <button
                                style={modeButtonStyle(currentMode === 'learn')}
                                onClick={() => handleModeChange('learn')}
                            >
                                📚 Learn
                            </button>
                        )}
                        {enabledModes.indexOf('practice') !== -1 && (
                            <button
                                style={modeButtonStyle(currentMode === 'practice')}
                                onClick={() => handleModeChange('practice')}
                                onMouseEnter={(e) => {
                                    if (currentMode !== 'practice') {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentMode !== 'practice') {
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }
                                }}
                            >
                                ✏️ Practice
                            </button>
                        )}
                        {enabledModes.indexOf('explore') !== -1 && (
                            <button
                                style={modeButtonStyle(currentMode === 'explore')}
                                onClick={() => handleModeChange('explore')}
                                onMouseEnter={(e) => {
                                    if (currentMode !== 'explore') {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentMode !== 'explore') {
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }
                                }}
                            >
                                🌍 Real World
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Canvas Area */}
            <div style={canvasContainerStyle}>
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={canvasHeight}
                    style={{ 
                        display: 'block', 
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: DESIGN_SYSTEM.borderRadius.sm,
                        touchAction: 'none'
                    }}
                />
            </div>

            {/* Instructions Block */}
            {showConstructionSteps && currentStepData.instructions.length > 0 && (
                <div style={instructionsBlockStyle} className="animate-slide-up">
                    <div style={instructionsTitleStyle}>
                        📐 Construction Steps
                    </div>
                    {currentStepData.instructions.map((instruction, index) => (
                        <div key={index} style={instructionItemStyle}>
                            <span style={bulletStyle}>{index + 1}.</span>
                            {instruction}
                        </div>
                    ))}
                </div>
            )}

            {/* Controls */}
            <div style={controlsStyle}>
                <div style={buttonGroupStyle}>
                    {showNavigation && (
                        <>
                            <button
                                style={buttonStyle(currentStep === 0, 'outlined')}
                                onClick={handlePrev}
                                disabled={currentStep === 0}
                                onMouseEnter={(e) => {
                                    if (currentStep > 0) {
                                        e.currentTarget.style.transform = 'translateX(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(74, 77, 201, 0.2)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentStep > 0) {
                                        e.currentTarget.style.transform = 'translateX(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                ← Previous
                            </button>
                            <button
                                style={buttonStyle(currentStep === filteredSteps.length - 1)}
                                onClick={handleNext}
                                disabled={currentStep === filteredSteps.length - 1}
                                onMouseEnter={(e) => {
                                    if (currentStep < filteredSteps.length - 1) {
                                        e.currentTarget.style.transform = 'translateX(2px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentStep < filteredSteps.length - 1) {
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }
                                }}
                            >
                                Next →
                            </button>
                        </>
                    )}
                </div>

                {showStepIndicator && (
                    <div style={stepIndicatorStyle}>
                        Step {currentStep + 1} of {filteredSteps.length}
                    </div>
                )}

                <div style={buttonGroupStyle}>
                    {showPlayPause && (
                        <button
                            style={buttonStyle(false)}
                            onClick={handlePlayPause}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            {isPlaying ? '⏸ Pause' : '▶ Play'}  
                        </button>
                    )}
                    <button
                        style={buttonStyle(false, 'outlined')}
                        onClick={handleReset}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(74, 77, 201, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        🔄 Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeometricConstructionTool;