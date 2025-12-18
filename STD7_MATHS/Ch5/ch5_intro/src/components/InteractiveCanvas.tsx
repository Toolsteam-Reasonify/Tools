import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CanvasData {
    name: string;
    description: string;
    elements: { x: number; y: number; value: number }[];
    type: 'geometric' | 'algebraic' | 'statistical';
}

interface InteractiveCanvasProps {
    language?: 'en' | 'hi' | 'gu';
    currentStep?: number;
}

const canvasData: CanvasData[] = [
    {
        name: "Cube Net",
        description: "A cube net shows how a 3D cube can be unfolded into a 2D pattern. The net consists of 6 squares arranged in a cross pattern.",
        elements: [
            { x: 150, y: 150, value: 0 }, // Cube net pattern
            { x: 300, y: 150, value: 1 }, // Folded cube
            { x: 450, y: 150, value: 2 }  // Unfolded net
        ],
        type: 'geometric'
    },
    {
        name: "Cone Net",
        description: "A cone net consists of a circular base and a triangular sector. When folded, it creates a cone shape.",
        elements: [
            { x: 150, y: 150, value: 0 }, // Cone net pattern
            { x: 300, y: 150, value: 1 }, // Folded cone
            { x: 450, y: 150, value: 2 }  // Unfolded net
        ],
        type: 'algebraic'
    },
    {
        name: "Cylinder Net",
        description: "A cylinder net has two circular bases and a rectangular side. This pattern folds to form a cylinder.",
        elements: [
            { x: 150, y: 150, value: 0 }, // Cylinder net pattern
            { x: 300, y: 150, value: 1 }, // Folded cylinder
            { x: 450, y: 150, value: 2 }  // Unfolded net
        ],
        type: 'statistical'
    }
];

const canvasTranslations = {
    en: {
        geometricPattern: "Cube Net",
        geometricDescription: "A cube net shows how a 3D cube can be unfolded into a 2D pattern. The net consists of 6 squares arranged in a cross pattern.",
        algebraicSequence: "Cone Net",
        algebraicDescription: "A cone net consists of a circular base and a triangular sector. When folded, it creates a cone shape.",
        statisticalDistribution: "Cylinder Net",
        statisticalDescription: "A cylinder net has two circular bases and a rectangular side. This pattern folds to form a cylinder.",
        step: "Step",
        of: "of",
        play: "Play",
        pause: "Pause",
        elements: "Shapes",
        values: "Dimensions",
        pattern: "Classification",
        relationship: "Types",
        // Shape names
        circle: "Circle",
        rectangle: "Rectangle", 
        square: "Square",
        triangle: "Triangle",
        quadrilateral: "Quadrilateral",
        cuboid: "Cuboid",
        cylinder: "Cylinder",
        cube: "Cube",
        sphere: "Sphere",
        pyramid: "Pyramid",
        book: "Book",
        ball: "Ball",
        iceCreamCone: "Ice-cream Cone"
    },
    hi: {
        geometricPattern: "घन नेट",
        geometricDescription: "घन नेट दिखाता है कि 3D घन को कैसे 2D पैटर्न में खोला जा सकता है। नेट में क्रॉस पैटर्न में व्यवस्थित 6 वर्ग होते हैं।",
        algebraicSequence: "शंकु नेट",
        algebraicDescription: "शंकु नेट में एक वृत्ताकार आधार और एक त्रिभुजाकार क्षेत्र होता है। मुड़ने पर यह शंकु आकृति बनाता है।",
        statisticalDistribution: "बेलन नेट",
        statisticalDescription: "बेलन नेट में दो वृत्ताकार आधार और एक आयताकार भुजा होती है। यह पैटर्न मुड़कर बेलन बनाता है।",
        step: "चरण",
        of: "का",
        play: "चलाएं",
        pause: "रोकें",
        elements: "आकृतियां",
        values: "आयाम",
        pattern: "वर्गीकरण",
        relationship: "प्रकार",
        // Shape names
        circle: "वृत्त",
        rectangle: "आयत",
        square: "वर्ग",
        triangle: "त्रिभुज",
        quadrilateral: "चतुर्भुज",
        cuboid: "घनाभ",
        cylinder: "बेलन",
        cube: "घन",
        sphere: "गोला",
        pyramid: "पिरामिड",
        book: "किताब",
        ball: "गेंद",
        iceCreamCone: "आइसक्रीम कोन"
    },
    gu: {
        geometricPattern: "ઘન નેટ",
        geometricDescription: "ઘન નેટ બતાવે છે કે 3D ઘનને કેવી રીતે 2D પેટર્નમાં ખોલી શકાય છે। નેટમાં ક્રોસ પેટર્નમાં ગોઠવાયેલા 6 ચોરસ હોય છે।",
        algebraicSequence: "શંકુ નેટ",
        algebraicDescription: "શંકુ નેટમાં એક વર્તુળાકાર પાયો અને એક ત્રિકોણાકાર ક્ષેત્ર હોય છે। મુડવાથી તે શંકુ આકૃતિ બનાવે છે।",
        statisticalDistribution: "સિલિન્ડર નેટ",
        statisticalDescription: "સિલિન્ડર નેટમાં બે વર્તુળાકાર પાયા અને એક લંબચોરસ બાજુ હોય છે। આ પેટર્ન મુડીને સિલિન્ડર બનાવે છે।",
        step: "પગલું",
        of: "નો",
        play: "ચલાવો",
        pause: "રોકો",
        elements: "આકૃતિઓ",
        values: "પરિમાણો",
        pattern: "વર્ગીકરણ",
        relationship: "પ્રકારો",
        // Shape names
        circle: "વર્તુળ",
        rectangle: "લંબચોરસ",
        square: "ચોરસ",
        triangle: "ત્રિકોણ",
        quadrilateral: "ચતુષ્કોણ",
        cuboid: "ઘનાભ",
        cylinder: "સિલિન્ડર",
        cube: "ઘન",
        sphere: "ગોળક",
        pyramid: "પિરામિડ",
        book: "પુસ્તક",
        ball: "દડો",
        iceCreamCone: "આઇસક્રીમ કોન"
    }
};

const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({ language = 'en', currentStep = 0 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [animationProgress, setAnimationProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const animationFrameRef = useRef<number>();

    const drawGeometricPattern = useCallback((ctx: CanvasRenderingContext2D, elements: { x: number; y: number; value: number }[], progress: number) => {
        // Draw cube net pattern
        elements.forEach((element, index) => {
            const currentProgress = (progress / 100) * (elements.length * 1.2);
            if (index < currentProgress) {
                ctx.strokeStyle = '#14b8a6';
                ctx.fillStyle = 'rgba(20, 184, 166, 0.2)';
                ctx.lineWidth = 3;
                
                switch (index) {
                    case 0: // Cube net pattern
                        // Draw cross-shaped net pattern
                        const squareSize = 40;
                        const centerX = element.x;
                        const centerY = element.y;
                        
                        // Center square
                        ctx.fillRect(centerX - squareSize/2, centerY - squareSize/2, squareSize, squareSize);
                        ctx.strokeRect(centerX - squareSize/2, centerY - squareSize/2, squareSize, squareSize);
                        
                        // Top square
                        ctx.fillRect(centerX - squareSize/2, centerY - squareSize*1.5, squareSize, squareSize);
                        ctx.strokeRect(centerX - squareSize/2, centerY - squareSize*1.5, squareSize, squareSize);
                        
                        // Bottom square
                        ctx.fillRect(centerX - squareSize/2, centerY + squareSize/2, squareSize, squareSize);
                        ctx.strokeRect(centerX - squareSize/2, centerY + squareSize/2, squareSize, squareSize);
                        
                        // Left square
                        ctx.fillRect(centerX - squareSize*1.5, centerY - squareSize/2, squareSize, squareSize);
                        ctx.strokeRect(centerX - squareSize*1.5, centerY - squareSize/2, squareSize, squareSize);
                        
                        // Right square
                        ctx.fillRect(centerX + squareSize/2, centerY - squareSize/2, squareSize, squareSize);
                        ctx.strokeRect(centerX + squareSize/2, centerY - squareSize/2, squareSize, squareSize);
                        
                        // Far right square
                        ctx.fillRect(centerX + squareSize*1.5, centerY - squareSize/2, squareSize, squareSize);
                        ctx.strokeRect(centerX + squareSize*1.5, centerY - squareSize/2, squareSize, squareSize);
                        
                        if (progress > 30) {
                            ctx.fillStyle = '#0d9488';
                            ctx.font = 'bold 12px Arial';
                            ctx.fillText('Cube Net', centerX - 30, centerY + squareSize*2);
                        }
                        break;
                    case 1: // Folded cube
                        // Draw 3D cube
                        const cubeSize = 30;
                        const cubeOffset = 10;
                        
                        // Front face
                        ctx.fillRect(element.x - cubeSize/2, element.y - cubeSize/2, cubeSize, cubeSize);
                        ctx.strokeRect(element.x - cubeSize/2, element.y - cubeSize/2, cubeSize, cubeSize);
                        
                        // Back face (offset)
                        ctx.fillRect(element.x - cubeSize/2 + cubeOffset, element.y - cubeSize/2 - cubeOffset, cubeSize, cubeSize);
                        ctx.strokeRect(element.x - cubeSize/2 + cubeOffset, element.y - cubeSize/2 - cubeOffset, cubeSize, cubeSize);
                        
                        // Connecting lines
                        ctx.beginPath();
                        ctx.moveTo(element.x - cubeSize/2, element.y - cubeSize/2);
                        ctx.lineTo(element.x - cubeSize/2 + cubeOffset, element.y - cubeSize/2 - cubeOffset);
                        ctx.moveTo(element.x + cubeSize/2, element.y - cubeSize/2);
                        ctx.lineTo(element.x + cubeSize/2 + cubeOffset, element.y - cubeSize/2 - cubeOffset);
                        ctx.moveTo(element.x - cubeSize/2, element.y + cubeSize/2);
                        ctx.lineTo(element.x - cubeSize/2 + cubeOffset, element.y + cubeSize/2 - cubeOffset);
                        ctx.moveTo(element.x + cubeSize/2, element.y + cubeSize/2);
                        ctx.lineTo(element.x + cubeSize/2 + cubeOffset, element.y + cubeSize/2 - cubeOffset);
                        ctx.stroke();
                        
                        if (progress > 30) {
                            ctx.fillStyle = '#0d9488';
                            ctx.font = 'bold 12px Arial';
                            ctx.fillText('Folded Cube', element.x - 30, element.y + cubeSize + 20);
                        }
                        break;
                    case 2: // Unfolded net
                        // Draw unfolded net pattern
                        const netSize = 25;
                        const netCenterX = element.x;
                        const netCenterY = element.y;
                        
                        // Draw unfolded net pattern
                        ctx.strokeStyle = '#14b8a6';
                        ctx.lineWidth = 2;
                        
                        // Center square
                        ctx.strokeRect(netCenterX - netSize/2, netCenterY - netSize/2, netSize, netSize);
                        
                        // Surrounding squares
                        ctx.strokeRect(netCenterX - netSize/2, netCenterY - netSize*1.5, netSize, netSize);
                        ctx.strokeRect(netCenterX - netSize/2, netCenterY + netSize/2, netSize, netSize);
                        ctx.strokeRect(netCenterX - netSize*1.5, netCenterY - netSize/2, netSize, netSize);
                        ctx.strokeRect(netCenterX + netSize/2, netCenterY - netSize/2, netSize, netSize);
                        ctx.strokeRect(netCenterX + netSize*1.5, netCenterY - netSize/2, netSize, netSize);
                        
                        if (progress > 30) {
                            ctx.fillStyle = '#0d9488';
                            ctx.font = 'bold 12px Arial';
                            ctx.fillText('Unfolded Net', netCenterX - 40, netCenterY + netSize*2);
                        }
                        break;
                }
            }
        });
    }, []);

    const drawAlgebraicSequence = useCallback((ctx: CanvasRenderingContext2D, elements: { x: number; y: number; value: number }[], progress: number) => {
        // Draw cone net pattern
        elements.forEach((element, index) => {
            const currentProgress = (progress / 100) * (elements.length * 1.2);
            if (index < currentProgress) {
                ctx.strokeStyle = '#a855f7';
                ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
                ctx.lineWidth = 3;
                
                switch (index) {
                    case 0: // Cone net pattern
                        // Draw circular base and triangular sector
                        const centerX = element.x;
                        const centerY = element.y;
                        const radius = 30;
                        
                        // Draw circular base
                        ctx.beginPath();
                        ctx.arc(centerX, centerY + 40, radius, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        
                        // Draw triangular sector
                        ctx.beginPath();
                        ctx.moveTo(centerX, centerY - 20);
                        ctx.lineTo(centerX - radius, centerY + 40);
                        ctx.lineTo(centerX + radius, centerY + 40);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        
                        if (progress > 30) {
                            ctx.fillStyle = '#7c3aed';
                            ctx.font = 'bold 12px Arial';
                            ctx.fillText('Cone Net', centerX - 30, centerY + 80);
                        }
                        break;
                    case 1: // Folded cone
                        // Draw 3D cone
                        const coneBase = 25;
                        const coneHeight = 40;
                        const coneTop = element.y - coneHeight;
                        const coneBottom = element.y;
                        
                        // Base ellipse
                        ctx.beginPath();
                        ctx.ellipse(element.x, coneBottom, coneBase, 8, 0, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        
                        // Cone sides
                        ctx.beginPath();
                        ctx.moveTo(element.x - coneBase, coneBottom);
                        ctx.lineTo(element.x, coneTop);
                        ctx.lineTo(element.x + coneBase, coneBottom);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        
                        if (progress > 30) {
                            ctx.fillStyle = '#7c3aed';
                            ctx.font = 'bold 12px Arial';
                            ctx.fillText('Folded Cone', element.x - 35, coneBottom + 25);
                        }
                        break;
                    case 2: // Unfolded net
                        // Draw unfolded cone net
                        const netCenterX = element.x;
                        const netCenterY = element.y;
                        const netRadius = 20;
                        
                        // Draw circular base
                        ctx.strokeStyle = '#a855f7';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(netCenterX, netCenterY + 30, netRadius, 0, Math.PI * 2);
                        ctx.stroke();
                        
                        // Draw triangular sector
                        ctx.beginPath();
                        ctx.moveTo(netCenterX, netCenterY - 15);
                        ctx.lineTo(netCenterX - netRadius, netCenterY + 30);
                        ctx.lineTo(netCenterX + netRadius, netCenterY + 30);
                        ctx.closePath();
                        ctx.stroke();
                        
                        if (progress > 30) {
                            ctx.fillStyle = '#7c3aed';
                            ctx.font = 'bold 12px Arial';
                            ctx.fillText('Unfolded Net', netCenterX - 40, netCenterY + 60);
                        }
                        break;
                }
            }
        });
    }, []);

    const drawStatisticalDistribution = useCallback((ctx: CanvasRenderingContext2D, elements: { x: number; y: number; value: number }[], progress: number) => {
        // Draw cylinder net pattern
        elements.forEach((element, index) => {
            const currentProgress = (progress / 100) * (elements.length * 1.2);
            if (index < currentProgress) {
                ctx.strokeStyle = '#10b981';
                ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
                ctx.lineWidth = 3;
                
                switch (index) {
                    case 0: // Cylinder net pattern
                        // Draw two circles and rectangle
                        const centerX = element.x;
                        const centerY = element.y;
                        const radius = 25;
                        const rectHeight = 50;
                        
                        // Top circle
                        ctx.beginPath();
                        ctx.arc(centerX, centerY - rectHeight/2, radius, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        
                        // Bottom circle
                        ctx.beginPath();
                        ctx.arc(centerX, centerY + rectHeight/2, radius, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        
                        // Rectangle connecting the circles
                        ctx.fillRect(centerX - radius, centerY - rectHeight/2, radius * 2, rectHeight);
                        ctx.strokeRect(centerX - radius, centerY - rectHeight/2, radius * 2, rectHeight);
                        
                        if (progress > 30) {
                            ctx.fillStyle = '#047857';
                            ctx.font = 'bold 12px Arial';
                            ctx.fillText('Cylinder Net', centerX - 35, centerY + rectHeight/2 + 30);
                        }
                        break;
                    case 1: // Folded cylinder
                        // Draw 3D cylinder
                        const cylHeight = 40;
                        const cylRadius = 20;
                        const cylTop = element.y - cylHeight/2;
                        const cylBottom = element.y + cylHeight/2;
                        
                        // Top ellipse
                        ctx.beginPath();
                        ctx.ellipse(element.x, cylTop, cylRadius, 8, 0, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        
                        // Bottom ellipse
                        ctx.beginPath();
                        ctx.ellipse(element.x, cylBottom, cylRadius, 8, 0, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        
                        // Sides
                        ctx.beginPath();
                        ctx.moveTo(element.x - cylRadius, cylTop);
                        ctx.lineTo(element.x - cylRadius, cylBottom);
                        ctx.moveTo(element.x + cylRadius, cylTop);
                        ctx.lineTo(element.x + cylRadius, cylBottom);
                        ctx.stroke();
                        
                        if (progress > 30) {
                            ctx.fillStyle = '#047857';
                            ctx.font = 'bold 12px Arial';
                            ctx.fillText('Folded Cylinder', element.x - 50, cylBottom + 25);
                        }
                        break;
                    case 2: // Unfolded net
                        // Draw unfolded cylinder net
                        const netCenterX = element.x;
                        const netCenterY = element.y;
                        const netRadius = 15;
                        const netHeight = 30;
                        
                        // Draw two circles
                        ctx.strokeStyle = '#10b981';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(netCenterX, netCenterY - netHeight/2, netRadius, 0, Math.PI * 2);
                        ctx.stroke();
                        
                        ctx.beginPath();
                        ctx.arc(netCenterX, netCenterY + netHeight/2, netRadius, 0, Math.PI * 2);
                        ctx.stroke();
                        
                        // Draw rectangle
                        ctx.strokeRect(netCenterX - netRadius, netCenterY - netHeight/2, netRadius * 2, netHeight);
                        
                        if (progress > 30) {
                            ctx.fillStyle = '#047857';
                            ctx.font = 'bold 12px Arial';
                            ctx.fillText('Unfolded Net', netCenterX - 40, netCenterY + netHeight/2 + 25);
                        }
                        break;
                }
            }
        });
    }, []);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const data = canvasData[currentStep];
        if (!data) return;

        // Draw background grid
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 50) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        // Draw pattern based on type
        switch (data.type) {
            case 'geometric':
                drawGeometricPattern(ctx, data.elements, animationProgress);
                break;
            case 'algebraic':
                drawAlgebraicSequence(ctx, data.elements, animationProgress);
                break;
            case 'statistical':
                drawStatisticalDistribution(ctx, data.elements, animationProgress);
                break;
        }

        if (!isPaused) {
            if (animationProgress < 100) {
                setAnimationProgress(prev => prev + 0.3); // Reduced from 1 to 0.3 for slower animation
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                // Reset animation after completion
                setTimeout(() => {
                    setAnimationProgress(0);
                }, 3000); // Increased pause time from 2000 to 3000
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        } else {
            animationFrameRef.current = requestAnimationFrame(animate);
        }
    }, [currentStep, animationProgress, isPaused, drawGeometricPattern, drawAlgebraicSequence, drawStatisticalDistribution]);

    useEffect(() => {
        animationFrameRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [animate]);

    // Reset animation when step changes
    useEffect(() => {
        setAnimationProgress(0);
    }, [currentStep]);

    const t = canvasTranslations[language];
    
    const getPatternName = (step: number) => {
        const names = [t.geometricPattern, t.algebraicSequence, t.statisticalDistribution];
        return names[step] || t.pattern;
    };
    
    const getPatternDescription = (step: number) => {
        const descriptions = [t.geometricDescription, t.algebraicDescription, t.statisticalDescription];
        return descriptions[step] || t.relationship;
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-teal-100/30 to-purple-100/30 p-5 rounded-xl mb-6 min-h-[120px] border border-teal-200 shadow-inner">
                <div className="text-2xl text-teal-700 font-bold mb-2">{getPatternName(currentStep)}</div>
                <div className="text-gray-700 leading-relaxed text-base">{getPatternDescription(currentStep)}</div>
            </div>

            <div className="flex justify-center mb-6 bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-md">
                <canvas ref={canvasRef} width="600" height="400" className="border-2 border-teal-500 rounded-lg bg-white"></canvas>
            </div>

            <div className="flex justify-center gap-6 mt-5 flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-5 rounded-md border-2 border-gray-700" style={{backgroundColor: '#14b8a6'}}></div>
                    <span className="text-gray-700 text-base">{t.geometricPattern}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-5 rounded-md border-2 border-gray-700" style={{backgroundColor: '#a855f7'}}></div>
                    <span className="text-gray-700 text-base">{t.algebraicSequence}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-5 rounded-md border-2 border-gray-700" style={{backgroundColor: '#10b981'}}></div>
                    <span className="text-gray-700 text-base">{t.statisticalDistribution}</span>
                </div>
            </div>

            <div className="text-center text-teal-700 font-semibold mt-5 text-lg">
                {t.step} {currentStep + 1} {t.of} {canvasData.length}
            </div>

            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                    {isPaused ? (
                        <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            {t.play}
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {t.pause}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default InteractiveCanvas;
