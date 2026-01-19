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
        name: "2-D Shapes",
        description: "These are flat shapes drawn on paper with only length and breadth. They are called plane figures.",
        elements: [
            { x: 100, y: 150, value: 0 }, // Circle
            { x: 200, y: 150, value: 1 }, // Rectangle
            { x: 300, y: 150, value: 2 }, // Square
            { x: 400, y: 150, value: 3 }, // Triangle
            { x: 500, y: 150, value: 4 }  // Quadrilateral
        ],
        type: 'geometric'
    },
    {
        name: "3-D Shapes",
        description: "These are solid shapes that occupy space and have three dimensions: length, breadth, and height.",
        elements: [
            { x: 100, y: 150, value: 0 }, // Cuboid
            { x: 200, y: 150, value: 1 }, // Cylinder
            { x: 300, y: 150, value: 2 }, // Cube
            { x: 400, y: 150, value: 3 }, // Sphere
            { x: 500, y: 150, value: 4 }  // Pyramid
        ],
        type: 'algebraic'
    },
    {
        name: "Daily Life Objects",
        description: "Objects around us that help us understand dimensions: Books (3-D), Balls (3-D), Ice-cream cones (3-D).",
        elements: [
            { x: 150, y: 150, value: 0 }, // Book
            { x: 300, y: 150, value: 1 }, // Ball
            { x: 450, y: 150, value: 2 }  // Ice-cream cone
        ],
        type: 'statistical'
    }
];

const canvasTranslations = {
    en: {
        geometricPattern: "2-D Shapes",
        geometricDescription: "These are flat shapes drawn on paper with only length and breadth. They are called plane figures.",
        algebraicSequence: "3-D Shapes",
        algebraicDescription: "These are solid shapes that occupy space and have three dimensions: length, breadth, and height.",
        statisticalDistribution: "Daily Life Objects",
        statisticalDescription: "Objects around us that help us understand dimensions: Books (3-D), Balls (3-D), Ice-cream cones (3-D).",
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
        geometricPattern: "2-D आकृतियां",
        geometricDescription: "ये सपाट आकृतियां हैं जो कागज पर खींची जाती हैं और केवल लंबाई और चौड़ाई होती है। इन्हें समतल आकृतियां कहते हैं।",
        algebraicSequence: "3-D आकृतियां",
        algebraicDescription: "ये ठोस आकृतियां हैं जो स्थान घेरती हैं और तीन आयाम होते हैं: लंबाई, चौड़ाई और ऊंचाई।",
        statisticalDistribution: "दैनिक जीवन की वस्तुएं",
        statisticalDescription: "हमारे आसपास की वस्तुएं जो आयामों को समझने में मदद करती हैं: किताबें (3-D), गेंदें (3-D), आइसक्रीम कोन (3-D)।",
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
        geometricPattern: "2-D આકૃતિઓ",
        geometricDescription: "આ સપાટ આકૃતિઓ છે જે કાગળ પર દોરાય છે અને માત્ર લંબાઈ અને પહોળાઈ હોય છે। તેમને સમતલ આકૃતિઓ કહેવાય છે।",
        algebraicSequence: "3-D આકૃતિઓ",
        algebraicDescription: "આ ઘન આકૃતિઓ છે જે જગ્યા ઘેરે છે અને ત્રણ પરિમાણ હોય છે: લંબાઈ, પહોળાઈ અને ઊંચાઈ।",
        statisticalDistribution: "દૈનિક જીવનની વસ્તુઓ",
        statisticalDescription: "આપણી આસપાસની વસ્તુઓ જે પરિમાણોને સમજવામાં મદદ કરે છે: પુસ્તકો (3-D), દડા (3-D), આઇસક્રીમ કોન (3-D)।",
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
        // Draw 2-D shapes
        elements.forEach((element, index) => {
            const currentProgress = (progress / 100) * (elements.length * 1.2); // Slower appearance
            if (index < currentProgress) {
                ctx.strokeStyle = '#14b8a6';
                ctx.fillStyle = 'rgba(20, 184, 166, 0.2)';
                ctx.lineWidth = 3;
                
                switch (index) {
                    case 0: // Circle
                        ctx.beginPath();
                        ctx.arc(element.x, element.y, 30, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        if (progress > 30) { // Increased threshold for slower label appearance
                            ctx.fillStyle = '#0d9488';
                            ctx.font = 'bold 14px Arial';
                            ctx.fillText(t.circle, element.x - 20, element.y + 50);
                        }
                        break;
                    case 1: // Rectangle
                        ctx.fillRect(element.x - 25, element.y - 20, 50, 40);
                        ctx.strokeRect(element.x - 25, element.y - 20, 50, 40);
                        if (progress > 30) { // Increased threshold for slower label appearance
                            ctx.fillStyle = '#0d9488';
                            ctx.font = 'bold 14px Arial';
                            ctx.fillText(t.rectangle, element.x - 25, element.y + 50);
                        }
                        break;
                    case 2: // Square
                        ctx.fillRect(element.x - 20, element.y - 20, 40, 40);
                        ctx.strokeRect(element.x - 20, element.y - 20, 40, 40);
                        if (progress > 30) { // Increased threshold for slower label appearance
                            ctx.fillStyle = '#0d9488';
                            ctx.font = 'bold 14px Arial';
                            ctx.fillText(t.square, element.x - 15, element.y + 50);
                        }
                        break;
                    case 3: // Triangle
                        ctx.beginPath();
                        ctx.moveTo(element.x, element.y - 25);
                        ctx.lineTo(element.x - 25, element.y + 20);
                        ctx.lineTo(element.x + 25, element.y + 20);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        if (progress > 30) { // Increased threshold for slower label appearance
                            ctx.fillStyle = '#0d9488';
                            ctx.font = 'bold 14px Arial';
                            ctx.fillText(t.triangle, element.x - 20, element.y + 50);
                        }
                        break;
                    case 4: // Quadrilateral
                        ctx.beginPath();
                        ctx.moveTo(element.x - 20, element.y - 15);
                        ctx.lineTo(element.x + 20, element.y - 15);
                        ctx.lineTo(element.x + 15, element.y + 20);
                        ctx.lineTo(element.x - 15, element.y + 20);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        if (progress > 30) { // Increased threshold for slower label appearance
                            ctx.fillStyle = '#0d9488';
                            ctx.font = 'bold 12px Arial';
                            ctx.fillText(t.quadrilateral, element.x - 30, element.y + 50);
                        }
                        break;
                }
            }
        });
    }, []);

    const drawAlgebraicSequence = useCallback((ctx: CanvasRenderingContext2D, elements: { x: number; y: number; value: number }[], progress: number) => {
        // Draw 3-D shapes
        elements.forEach((element, index) => {
            const currentProgress = (progress / 100) * (elements.length * 1.2); // Slower appearance
            if (index < currentProgress) {
                ctx.strokeStyle = '#a855f7';
                ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
                ctx.lineWidth = 3;
                
                switch (index) {
                    case 0: // Cuboid
                        // Front face
                        ctx.fillRect(element.x - 20, element.y - 15, 40, 30);
                        ctx.strokeRect(element.x - 20, element.y - 15, 40, 30);
                        // Back face (offset)
                        ctx.fillRect(element.x - 15, element.y - 10, 40, 30);
                        ctx.strokeRect(element.x - 15, element.y - 10, 40, 30);
                        // Connecting lines
                        ctx.beginPath();
                        ctx.moveTo(element.x - 20, element.y - 15);
                        ctx.lineTo(element.x - 15, element.y - 10);
                        ctx.moveTo(element.x + 20, element.y - 15);
                        ctx.lineTo(element.x + 25, element.y - 10);
                        ctx.moveTo(element.x - 20, element.y + 15);
                        ctx.lineTo(element.x - 15, element.y + 20);
                        ctx.moveTo(element.x + 20, element.y + 15);
                        ctx.lineTo(element.x + 25, element.y + 20);
                        ctx.stroke();
                        if (progress > 30) { // Increased threshold for slower label appearance
                            ctx.fillStyle = '#7c3aed';
                            ctx.font = 'bold 14px Arial';
                            ctx.fillText(t.cuboid, element.x - 20, element.y + 50);
                        }
                        break;
                    case 1: // Cylinder
                        // Top ellipse
                        ctx.beginPath();
                        ctx.ellipse(element.x, element.y - 10, 25, 8, 0, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        // Bottom ellipse
                        ctx.beginPath();
                        ctx.ellipse(element.x, element.y + 10, 25, 8, 0, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        // Sides
                        ctx.beginPath();
                        ctx.moveTo(element.x - 25, element.y - 10);
                        ctx.lineTo(element.x - 25, element.y + 10);
                        ctx.moveTo(element.x + 25, element.y - 10);
                        ctx.lineTo(element.x + 25, element.y + 10);
                        ctx.stroke();
                        if (progress > 30) { // Increased threshold for slower label appearance
                            ctx.fillStyle = '#7c3aed';
                            ctx.font = 'bold 14px Arial';
                            ctx.fillText(t.cylinder, element.x - 25, element.y + 50);
                        }
                        break;
                    case 2: // Cube
                        // Front face
                        ctx.fillRect(element.x - 15, element.y - 15, 30, 30);
                        ctx.strokeRect(element.x - 15, element.y - 15, 30, 30);
                        // Back face (offset)
                        ctx.fillRect(element.x - 10, element.y - 10, 30, 30);
                        ctx.strokeRect(element.x - 10, element.y - 10, 30, 30);
                        // Connecting lines
                        ctx.beginPath();
                        ctx.moveTo(element.x - 15, element.y - 15);
                        ctx.lineTo(element.x - 10, element.y - 10);
                        ctx.moveTo(element.x + 15, element.y - 15);
                        ctx.lineTo(element.x + 20, element.y - 10);
                        ctx.moveTo(element.x - 15, element.y + 15);
                        ctx.lineTo(element.x - 10, element.y + 20);
                        ctx.moveTo(element.x + 15, element.y + 15);
                        ctx.lineTo(element.x + 20, element.y + 20);
                        ctx.stroke();
                        if (progress > 30) { // Increased threshold for slower label appearance
                            ctx.fillStyle = '#7c3aed';
                            ctx.font = 'bold 14px Arial';
                            ctx.fillText(t.cube, element.x - 10, element.y + 50);
                        }
                        break;
                    case 3: // Sphere
                        ctx.beginPath();
                        ctx.arc(element.x, element.y, 25, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        // Add some 3D effect with inner circle
                        ctx.strokeStyle = '#9333ea';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(element.x, element.y, 15, 0, Math.PI * 2);
                        ctx.stroke();
                        if (progress > 30) { // Increased threshold for slower label appearance
                            ctx.fillStyle = '#7c3aed';
                            ctx.font = 'bold 14px Arial';
                            ctx.fillText(t.sphere, element.x - 15, element.y + 50);
                        }
                        break;
                    case 4: // Pyramid
                        // Base
                        ctx.beginPath();
                        ctx.moveTo(element.x - 20, element.y + 15);
                        ctx.lineTo(element.x + 20, element.y + 15);
                        ctx.lineTo(element.x + 10, element.y - 15);
                        ctx.lineTo(element.x - 10, element.y - 15);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        // Top point
                        ctx.beginPath();
                        ctx.moveTo(element.x, element.y - 25);
                        ctx.lineTo(element.x - 10, element.y - 15);
                        ctx.lineTo(element.x + 10, element.y - 15);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        if (progress > 30) { // Increased threshold for slower label appearance
                            ctx.fillStyle = '#7c3aed';
                            ctx.font = 'bold 14px Arial';
                            ctx.fillText(t.pyramid, element.x - 20, element.y + 50);
                        }
                        break;
                }
            }
        });
    }, []);

    const drawStatisticalDistribution = useCallback((ctx: CanvasRenderingContext2D, elements: { x: number; y: number; value: number }[], progress: number) => {
        // Draw daily life objects
        elements.forEach((element, index) => {
            const currentProgress = (progress / 100) * (elements.length * 1.2); // Slower appearance
            if (index < currentProgress) {
                ctx.strokeStyle = '#10b981';
                ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
                ctx.lineWidth = 3;
                
                switch (index) {
                    case 0: // Book
                        // Book cover
                        ctx.fillRect(element.x - 20, element.y - 15, 40, 30);
                        ctx.strokeRect(element.x - 20, element.y - 15, 40, 30);
                        // Pages
                        ctx.strokeStyle = '#059669';
                        ctx.lineWidth = 1;
                        for (let i = 0; i < 5; i++) {
                            ctx.beginPath();
                            ctx.moveTo(element.x - 15 + i * 2, element.y - 10);
                            ctx.lineTo(element.x - 15 + i * 2, element.y + 10);
                            ctx.stroke();
                        }
                        if (progress > 30) { // Increased threshold for slower label appearance
                            ctx.fillStyle = '#047857';
                            ctx.font = 'bold 14px Arial';
                            ctx.fillText(`${t.book} (3-D)`, element.x - 25, element.y + 50);
                        }
                        break;
                    case 1: // Ball
                        ctx.strokeStyle = '#10b981';
                        ctx.lineWidth = 3;
                        ctx.beginPath();
                        ctx.arc(element.x, element.y, 25, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        // Add some texture lines
                        ctx.strokeStyle = '#059669';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(element.x, element.y, 20, 0, Math.PI * 2);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(element.x, element.y, 15, 0, Math.PI * 2);
                        ctx.stroke();
                        if (progress > 30) { // Increased threshold for slower label appearance
                            ctx.fillStyle = '#047857';
                            ctx.font = 'bold 14px Arial';
                            ctx.fillText(`${t.ball} (3-D)`, element.x - 20, element.y + 50);
                        }
                        break;
                    case 2: // Ice-cream cone
                        // Cone
                        ctx.strokeStyle = '#10b981';
                        ctx.lineWidth = 3;
                        ctx.beginPath();
                        ctx.moveTo(element.x, element.y + 20);
                        ctx.lineTo(element.x - 15, element.y - 10);
                        ctx.lineTo(element.x + 15, element.y - 10);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        // Ice cream scoop
                        ctx.fillStyle = 'rgba(255, 192, 203, 0.8)';
                        ctx.beginPath();
                        ctx.arc(element.x, element.y - 15, 12, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        if (progress > 30) { // Increased threshold for slower label appearance
                            ctx.fillStyle = '#047857';
                            ctx.font = 'bold 12px Arial';
                            ctx.fillText(`${t.iceCreamCone} (3-D)`, element.x - 35, element.y + 50);
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
