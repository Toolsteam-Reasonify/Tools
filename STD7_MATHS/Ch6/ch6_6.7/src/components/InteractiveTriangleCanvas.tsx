import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Download, Play, Pause } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Triangle {
  points: Point[];
  angles: number[];
  sides: number[];
}

interface Translations {
  chapterTitle: string;
  topicTitle: string;
  whatIsTopic: string;
  learning: string;
  practice: string;
  realWorldApplications: string;
  visualization: string;
  dragVerticesInstruction: string;
  interiorElements: string;
  exteriorElements: string;
  definition: string;
  definitionText: string;
  keyComponents: string;
  keyComponentsText: string;
  keyProperty: string;
  keyPropertyText: string;
  justification: string;
  justificationText: string;
  practicalApplications: string;
  practicalApplicationsText: string;
  mathematicalExample: string;
  given: string;
  exteriorAngleGiven: string;
  find: string;
  findOtherAngle: string;
  practiceExercises: string;
  architecture: string;
  architectureDesc: string;
  navigation: string;
  navigationDesc: string;
  engineering: string;
  engineeringDesc: string;
  artDesign: string;
  artDesignDesc: string;
  surveying: string;
  surveyingDesc: string;
  computerGraphics: string;
  computerGraphicsDesc: string;
  physics: string;
  physicsDesc: string;
  // Triangle Inequality Demo translations
  triangleInequalityTitle: string;
  triangleInequalitySubtitle: string;
  sideLengths: string;
  sideA: string;
  sideB: string;
  sideC: string;
  inequalities: string;
  validTriangle: string;
  invalidTriangle: string;
  animate: string;
  pause: string;
  reset: string;
  legend: string;
}

const InteractiveTriangleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentMode, setCurrentMode] = useState<'demonstration' | 'practice' | 'realworld'>('demonstration');
  const [language, setLanguage] = useState<'en' | 'hi' | 'gu'>(() => {
    const savedLanguage = localStorage.getItem('ch6-6-7-language');
    return (savedLanguage as 'en' | 'hi' | 'gu') || 'en';
  });
  const [triangle, setTriangle] = useState<Triangle>({
    points: [
      { x: 200, y: 100 },
      { x: 100, y: 300 },
      { x: 300, y: 300 }
    ],
    angles: [60, 60, 60],
    sides: [200, 200, 200]
  });
  const [draggedPoint, setDraggedPoint] = useState<number | null>(null);
  const [showAngles, setShowAngles] = useState(false);
  const [showSides, setShowSides] = useState(false);
  
  // Practice mode state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(6).fill(''));
  const [showOverview, setShowOverview] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);

  // Triangle Inequality Demo state
  const [sideA, setSideA] = useState(5);
  const [sideB, setSideB] = useState(6);
  const [sideC, setSideC] = useState(8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [highlightedSide, setHighlightedSide] = useState<'a' | 'b' | 'c' | null>(null);

  // Translations
  const translations: Record<'en' | 'hi' | 'gu', Translations> = {
    en: {
      chapterTitle: "Chapter 6: Triangles",
      topicTitle: "Interactive Triangle Canvas",
      whatIsTopic: "Explore triangle properties through interactive manipulation",
      learning: "Learn",
      practice: "Practice",
      realWorldApplications: "Real World",
      visualization: "Interactive Visualization",
      dragVerticesInstruction: "Drag the vertices to explore different triangle types and their properties",
      interiorElements: "Show Angles",
      exteriorElements: "Show Sides",
      definition: "Definition",
      definitionText: "A triangle is a polygon with three edges and three vertices. It is one of the basic shapes in geometry.",
      keyComponents: "Key Components",
      keyComponentsText: "Triangles have three sides, three angles, and three vertices. The sum of interior angles is always 180°.",
      keyProperty: "Key Properties",
      keyPropertyText: "Triangle Inequality Theorem: The sum of any two sides must be greater than the third side.",
      justification: "Mathematical Justification",
      justificationText: "This property ensures that three points can form a triangle and determines the triangle's type.",
      practicalApplications: "Practical Applications",
      practicalApplicationsText: "Used in architecture, engineering, computer graphics, and navigation systems.",
      mathematicalExample: "Example",
      given: "Given",
      exteriorAngleGiven: "Three points A(0,0), B(3,0), C(1.5,2.6)",
      find: "Find",
      findOtherAngle: "Triangle type and properties",
      practiceExercises: "Practice Exercises",
      architecture: "Architecture",
      architectureDesc: "Triangular structures provide stability and strength in building design",
      navigation: "Navigation",
      navigationDesc: "Triangulation used in GPS and surveying for precise location determination",
      engineering: "Engineering",
      engineeringDesc: "Structural analysis and design using triangular frameworks",
      artDesign: "Art & Design",
      artDesignDesc: "Geometric patterns and visual compositions using triangular forms",
      surveying: "Surveying",
      surveyingDesc: "Land measurement and mapping using triangular networks",
      computerGraphics: "Computer Graphics",
      computerGraphicsDesc: "3D modeling and rendering using triangular meshes",
      physics: "Physics",
      physicsDesc: "Wave propagation and force analysis in triangular systems",
      // Triangle Inequality Demo translations
      triangleInequalityTitle: "Triangle Inequality Theorem",
      triangleInequalitySubtitle: "Sum of any two sides is greater than the third side",
      sideLengths: "Side Lengths",
      sideA: "Side A (BC)",
      sideB: "Side B (CA)",
      sideC: "Side C (AB)",
      inequalities: "Inequalities",
      validTriangle: "✓ Valid Triangle",
      invalidTriangle: "✗ Cannot Form Triangle",
      animate: "Animate",
      pause: "Pause",
      reset: "Reset",
      legend: "Legend"
    },
    hi: {
      chapterTitle: "अध्याय 6: त्रिभुज",
      topicTitle: "इंटरैक्टिव त्रिभुज कैनवास",
      whatIsTopic: "इंटरैक्टिव हेरफेर के माध्यम से त्रिभुज गुणों का अन्वेषण करें",
      learning: "सीखें",
      practice: "अभ्यास",
      realWorldApplications: "वास्तविक दुनिया",
      visualization: "इंटरैक्टिव विज़ुअलाइज़ेशन",
      dragVerticesInstruction: "विभिन्न त्रिभुज प्रकारों और उनके गुणों का अन्वेषण करने के लिए शीर्षों को खींचें",
      interiorElements: "कोण दिखाएं",
      exteriorElements: "भुजाएं दिखाएं",
      definition: "परिभाषा",
      definitionText: "त्रिभुज तीन किनारों और तीन शीर्षों वाला बहुभुज है। यह ज्यामिति में मूल आकृतियों में से एक है।",
      keyComponents: "मुख्य घटक",
      keyComponentsText: "त्रिभुज में तीन भुजाएं, तीन कोण और तीन शीर्ष होते हैं। आंतरिक कोणों का योग हमेशा 180° होता है।",
      keyProperty: "मुख्य गुण",
      keyPropertyText: "त्रिभुज असमानता प्रमेय: किन्हीं दो भुजाओं का योग तीसरी भुजा से अधिक होना चाहिए।",
      justification: "गणितीय औचित्य",
      justificationText: "यह गुण सुनिश्चित करता है कि तीन बिंदु एक त्रिभुज बना सकते हैं और त्रिभुज के प्रकार को निर्धारित करता है।",
      practicalApplications: "व्यावहारिक अनुप्रयोग",
      practicalApplicationsText: "वास्तुकला, इंजीनियरिंग, कंप्यूटर ग्राफिक्स और नेविगेशन सिस्टम में उपयोग किया जाता है।",
      mathematicalExample: "उदाहरण",
      given: "दिया गया",
      exteriorAngleGiven: "तीन बिंदु A(0,0), B(3,0), C(1.5,2.6)",
      find: "ज्ञात करें",
      findOtherAngle: "त्रिभुज प्रकार और गुण",
      practiceExercises: "अभ्यास अभ्यास",
      architecture: "वास्तुकला",
      architectureDesc: "त्रिकोणीय संरचनाएं भवन डिजाइन में स्थिरता और मजबूती प्रदान करती हैं",
      navigation: "नेविगेशन",
      navigationDesc: "GPS और सर्वेक्षण में सटीक स्थान निर्धारण के लिए त्रिकोणीकरण का उपयोग",
      engineering: "इंजीनियरिंग",
      engineeringDesc: "त्रिकोणीय फ्रेमवर्क का उपयोग करके संरचनात्मक विश्लेषण और डिजाइन",
      artDesign: "कला और डिजाइन",
      artDesignDesc: "त्रिकोणीय रूपों का उपयोग करके ज्यामितीय पैटर्न और दृश्य रचनाएं",
      surveying: "सर्वेक्षण",
      surveyingDesc: "त्रिकोणीय नेटवर्क का उपयोग करके भूमि मापन और मानचित्रण",
      computerGraphics: "कंप्यूटर ग्राफिक्स",
      computerGraphicsDesc: "त्रिकोणीय मेश का उपयोग करके 3D मॉडलिंग और रेंडरिंग",
      physics: "भौतिकी",
      physicsDesc: "त्रिकोणीय सिस्टम में तरंग प्रसार और बल विश्लेषण",
      // Triangle Inequality Demo translations
      triangleInequalityTitle: "त्रिभुज असमानता प्रमेय",
      triangleInequalitySubtitle: "किन्हीं दो भुजाओं का योग तीसरी भुजा से अधिक होता है",
      sideLengths: "भुजा की लंबाई",
      sideA: "भुजा A (BC)",
      sideB: "भुजा B (CA)",
      sideC: "भुजा C (AB)",
      inequalities: "असमानताएं",
      validTriangle: "✓ वैध त्रिभुज",
      invalidTriangle: "✗ त्रिभुज नहीं बना सकते",
      animate: "एनिमेट करें",
      pause: "रोकें",
      reset: "रीसेट",
      legend: "किंवदंती"
    },
    gu: {
      chapterTitle: "પ્રકરણ 6: ત્રિકોણ",
      topicTitle: "ઇન્ટરએક્ટિવ ત્રિકોણ કેનવાસ",
      whatIsTopic: "ઇન્ટરએક્ટિવ હેરફેર દ્વારા ત્રિકોણ ગુણધર્મોનું અન્વેષણ કરો",
      learning: "શીખો",
      practice: "અભ્યાસ",
      realWorldApplications: "વાસ્તવિક વિશ્વ",
      visualization: "ઇન્ટરએક્ટિવ વિઝ્યુઅલાઇઝેશન",
      dragVerticesInstruction: "વિવિધ ત્રિકોણ પ્રકારો અને તેમના ગુણધર્મોનું અન્વેષણ કરવા માટે શિરોબિંદુઓને ખેંચો",
      interiorElements: "કોણ બતાવો",
      exteriorElements: "બાજુઓ બતાવો",
      definition: "વ્યાખ્યા",
      definitionText: "ત્રિકોણ એ ત્રણ કિનારીઓ અને ત્રણ શિરોબિંદુઓ સાથેનો બહુકોણ છે। તે ભૂમિતિમાં મૂળ આકારોમાંથી એક છે।",
      keyComponents: "મુખ્ય ઘટકો",
      keyComponentsText: "ત્રિકોણમાં ત્રણ બાજુઓ, ત્રણ કોણ અને ત્રણ શિરોબિંદુઓ હોય છે। આંતરિક કોણોનો સરવાળો હંમેશા 180° હોય છે।",
      keyProperty: "મુખ્ય ગુણધર્મો",
      keyPropertyText: "ત્રિકોણ અસમાનતા પ્રમેય: કોઈપણ બે બાજુઓનો સરવાળો ત્રીજી બાજુ કરતાં વધારે હોવો જોઈએ।",
      justification: "ગાણિતિક યોગ્યતા",
      justificationText: "આ ગુણધર્મ ખાતરી કરે છે કે ત્રણ બિંદુઓ ત્રિકોણ બનાવી શકે છે અને ત્રિકોણના પ્રકારને નિર્ધારિત કરે છે।",
      practicalApplications: "વ્યવહારિક ઉપયોગો",
      practicalApplicationsText: "આર્કિટેક્ચર, એન્જિનિયરિંગ, કમ્પ્યુટર ગ્રાફિક્સ અને નેવિગેશન સિસ્ટમ્સમાં ઉપયોગ થાય છે।",
      mathematicalExample: "ઉદાહરણ",
      given: "આપેલ",
      exteriorAngleGiven: "ત્રણ બિંદુઓ A(0,0), B(3,0), C(1.5,2.6)",
      find: "શોધો",
      findOtherAngle: "ત્રિકોણ પ્રકાર અને ગુણધર્મો",
      practiceExercises: "અભ્યાસ કસરતો",
      architecture: "આર્કિટેક્ચર",
      architectureDesc: "ત્રિકોણાકાર માળખાં બિલ્ડિંગ ડિઝાઇનમાં સ્થિરતા અને મજબૂતી પ્રદાન કરે છે",
      navigation: "નેવિગેશન",
      navigationDesc: "GPS અને સર્વેક્ષણમાં ચોક્કસ સ્થાન નિર્ધારણ માટે ત્રિકોણીકરણનો ઉપયોગ",
      engineering: "એન્જિનિયરિંગ",
      engineeringDesc: "ત્રિકોણાકાર ફ્રેમવર્કનો ઉપયોગ કરીને માળખાકીય વિશ્લેષણ અને ડિઝાઇન",
      artDesign: "કલા અને ડિઝાઇન",
      artDesignDesc: "ત્રિકોણાકાર સ્વરૂપોનો ઉપયોગ કરીને ભૂમિતીય પેટર્ન અને દ્રશ્ય રચનાઓ",
      surveying: "સર્વેક્ષણ",
      surveyingDesc: "ત્રિકોણાકાર નેટવર્કનો ઉપયોગ કરીને જમીન માપન અને મેપિંગ",
      computerGraphics: "કમ્પ્યુટર ગ્રાફિક્સ",
      computerGraphicsDesc: "ત્રિકોણાકાર મેશનો ઉપયોગ કરીને 3D મોડેલિંગ અને રેન્ડરિંગ",
      physics: "ભૌતિકશાસ્ત્ર",
      physicsDesc: "ત્રિકોણાકાર સિસ્ટમ્સમાં તરંગ પ્રસાર અને બળ વિશ્લેષણ",
      // Triangle Inequality Demo translations
      triangleInequalityTitle: "ત્રિકોણ અસમાનતા પ્રમેય",
      triangleInequalitySubtitle: "કોઈપણ બે બાજુઓનો સરવાળો ત્રીજી બાજુ કરતાં વધારે હોય છે",
      sideLengths: "બાજુની લંબાઈ",
      sideA: "બાજુ A (BC)",
      sideB: "બાજુ B (CA)",
      sideC: "બાજુ C (AB)",
      inequalities: "અસમાનતાઓ",
      validTriangle: "✓ માન્ય ત્રિકોણ",
      invalidTriangle: "✗ ત્રિકોણ બનાવી શકાતો નથી",
      animate: "એનિમેટ કરો",
      pause: "રોકો",
      reset: "રીસેટ",
      legend: "કિંવદંતી"
    }
  };

  const t = translations[language];

  const handleLanguageChange = (newLanguage: 'en' | 'hi' | 'gu') => {
    setLanguage(newLanguage);
    localStorage.setItem('ch6-6-7-language', newLanguage);
  };

  // Calculate triangle properties
  const calculateTriangleProperties = (points: Point[]): Triangle => {
    const [A, B, C] = points;
    
    // Calculate side lengths
    const sideAB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    const sideBC = Math.sqrt(Math.pow(C.x - B.x, 2) + Math.pow(C.y - B.y, 2));
    const sideCA = Math.sqrt(Math.pow(A.x - C.x, 2) + Math.pow(A.y - C.y, 2));
    
    // Calculate angles using Law of Cosines
    const angleA = Math.acos((sideAB * sideAB + sideCA * sideCA - sideBC * sideBC) / (2 * sideAB * sideCA)) * 180 / Math.PI;
    const angleB = Math.acos((sideAB * sideAB + sideBC * sideBC - sideCA * sideCA) / (2 * sideAB * sideBC)) * 180 / Math.PI;
    const angleC = Math.acos((sideBC * sideBC + sideCA * sideCA - sideAB * sideAB) / (2 * sideBC * sideCA)) * 180 / Math.PI;
    
    return {
      points,
      angles: [angleA, angleB, angleC],
      sides: [sideAB, sideBC, sideCA]
    };
  };

  // Draw triangle on canvas
  const drawTriangle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw triangle
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(triangle.points[0].x, triangle.points[0].y);
    ctx.lineTo(triangle.points[1].x, triangle.points[1].y);
    ctx.lineTo(triangle.points[2].x, triangle.points[2].y);
    ctx.closePath();
    ctx.stroke();
    
    // Fill triangle with semi-transparent color
    ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';
    ctx.fill();
    
    // Draw vertices
    triangle.points.forEach((point, index) => {
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw vertex labels
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 16px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(String.fromCharCode(65 + index), point.x, point.y - 15);
    });
    
    // Draw angle arcs
    if (showAngles) {
    triangle.points.forEach((point, index) => {
      const angle = triangle.angles[index];
      const radius = 30;
      
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, (angle * Math.PI) / 180);
      ctx.stroke();
      
      // Draw angle labels
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`${angle.toFixed(1)}°`, point.x + 20, point.y - 20);
    });
    }
    
    // Draw side length labels
    if (showSides) {
    const midpoints = triangle.points.map((point, index) => {
      const nextPoint = triangle.points[(index + 1) % 3];
      return {
        x: (point.x + nextPoint.x) / 2,
        y: (point.y + nextPoint.y) / 2
      };
    });
    
    midpoints.forEach((midpoint, index) => {
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`${triangle.sides[index].toFixed(1)}`, midpoint.x, midpoint.y);
    });
    }
  };

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check which point is being dragged
    triangle.points.forEach((point, index) => {
      const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
      if (distance < 20) {
        setDraggedPoint(index);
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggedPoint === null) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(20, Math.min(canvas.width - 20, e.clientX - rect.left));
    const y = Math.max(20, Math.min(canvas.height - 20, e.clientY - rect.top));
    
    const newPoints = [...triangle.points];
    newPoints[draggedPoint] = { x, y };
    
    const newTriangle = calculateTriangleProperties(newPoints);
    setTriangle(newTriangle);
  };

  const handleMouseUp = () => {
    setDraggedPoint(null);
  };

  // Reset triangle to equilateral
  const resetTriangle = () => {
    const newTriangle = calculateTriangleProperties([
      { x: 200, y: 100 },
      { x: 100, y: 300 },
      { x: 300, y: 300 }
    ]);
    setTriangle(newTriangle);
  };

  // Triangle Inequality Demo functions
  const scale = 30;
  const canvasWidth = 600;
  const canvasHeight = 500;

  // Check triangle inequality
  const isValidTriangle = 
    sideA + sideB > sideC &&
    sideB + sideC > sideA &&
    sideC + sideA > sideB;

  // Calculate triangle positions (using law of cosines)
  const getTrianglePoints = () => {
    if (!isValidTriangle) return null;

    const a = sideA * scale;
    const b = sideB * scale;
    const c = sideC * scale;

    const cosC = (a * a + b * b - c * c) / (2 * a * b);
    const angle = Math.acos(Math.max(-1, Math.min(1, cosC)));

    const startX = canvasWidth / 2 - a / 2;
    const startY = canvasHeight / 2 + 80;

    const pointA = { x: startX, y: startY };
    const pointB = { x: startX + a, y: startY };
    const pointC = {
      x: startX + b * Math.cos(angle),
      y: startY - b * Math.sin(angle),
    };

    return { pointA, pointB, pointC };
  };

  const trianglePoints = getTrianglePoints();

  // Animation effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setAnimationProgress((prev) => {
        const next = prev + 1;
        return next > 300 ? 0 : next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Determine which side to highlight based on animation progress
  useEffect(() => {
    if (animationProgress < 100) {
      setHighlightedSide('a');
    } else if (animationProgress < 200) {
      setHighlightedSide('b');
    } else {
      setHighlightedSide('c');
    }
  }, [animationProgress]);

  const handleTriangleDemoReset = () => {
    setSideA(5);
    setSideB(6);
    setSideC(8);
    setIsPlaying(false);
    setAnimationProgress(0);
    setHighlightedSide(null);
  };

  const animPercent = (animationProgress % 100) / 100;

  // Download canvas as image
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'triangle-diagram.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Update canvas when triangle changes
  useEffect(() => {
    drawTriangle();
  }, [triangle, showAngles, showSides]);

  const getTriangleType = () => {
    const [a, b, c] = triangle.sides;
    if (Math.abs(a - b) < 0.1 && Math.abs(b - c) < 0.1) return 'Equilateral';
    if (Math.abs(a - b) < 0.1 || Math.abs(b - c) < 0.1 || Math.abs(a - c) < 0.1) return 'Isosceles';
    return 'Scalene';
  };

  const renderTriangle = () => (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="border border-gray-300 rounded-lg cursor-move shadow-lg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );

  const renderDemonstrationMode = () => (
    <div className="space-y-6">
      {/* Triangle Inequality Demo */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-teal-purple mb-4">
            📐 {t.triangleInequalityTitle}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {t.triangleInequalitySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Canvas */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <svg
              width={canvasWidth}
              height={canvasHeight}
              className="border-2 border-indigo-200 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100"
            >
              {/* Grid */}
              <defs>
                <pattern
                  id="grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="#e0e7ff"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width={canvasWidth} height={canvasHeight} fill="url(#grid)" />

              {/* Triangle */}
              {isValidTriangle && trianglePoints && (
                <>
                  {/* Sides */}
                  <line
                    x1={trianglePoints.pointA.x}
                    y1={trianglePoints.pointA.y}
                    x2={trianglePoints.pointB.x}
                    y2={trianglePoints.pointB.y}
                    stroke={highlightedSide === 'c' ? '#ef4444' : '#4f46e5'}
                    strokeWidth={highlightedSide === 'c' ? 4 : 2}
                    className="transition-all duration-300"
                  />
                  <line
                    x1={trianglePoints.pointB.x}
                    y1={trianglePoints.pointB.y}
                    x2={trianglePoints.pointC.x}
                    y2={trianglePoints.pointC.y}
                    stroke={highlightedSide === 'a' ? '#ef4444' : '#10b981'}
                    strokeWidth={highlightedSide === 'a' ? 4 : 2}
                    className="transition-all duration-300"
                  />
                  <line
                    x1={trianglePoints.pointC.x}
                    y1={trianglePoints.pointC.y}
                    x2={trianglePoints.pointA.x}
                    y2={trianglePoints.pointA.y}
                    stroke={highlightedSide === 'b' ? '#ef4444' : '#f59e0b'}
                    strokeWidth={highlightedSide === 'b' ? 4 : 2}
                    className="transition-all duration-300"
                  />

                  {/* Vertices */}
                  <circle
                    cx={trianglePoints.pointA.x}
                    cy={trianglePoints.pointA.y}
                    r="6"
                    fill="#1e293b"
                  />
                  <circle
                    cx={trianglePoints.pointB.x}
                    cy={trianglePoints.pointB.y}
                    r="6"
                    fill="#1e293b"
                  />
                  <circle
                    cx={trianglePoints.pointC.x}
                    cy={trianglePoints.pointC.y}
                    r="6"
                    fill="#1e293b"
                  />

                  {/* Labels */}
                  <text
                    x={trianglePoints.pointA.x - 15}
                    y={trianglePoints.pointA.y + 20}
                    fontSize="14"
                    fontWeight="bold"
                    fill="#1e293b"
                  >
                    A
                  </text>
                  <text
                    x={trianglePoints.pointB.x + 10}
                    y={trianglePoints.pointB.y + 20}
                    fontSize="14"
                    fontWeight="bold"
                    fill="#1e293b"
                  >
                    B
                  </text>
                  <text
                    x={trianglePoints.pointC.x}
                    y={trianglePoints.pointC.y - 15}
                    fontSize="14"
                    fontWeight="bold"
                    fill="#1e293b"
                  >
                    C
                  </text>

                  {/* Side Length Labels */}
                  {/* Side C (AB) - bottom side */}
                  <text
                    x={(trianglePoints.pointA.x + trianglePoints.pointB.x) / 2}
                    y={trianglePoints.pointA.y + 30}
                    fontSize="16"
                    fontWeight="bold"
                    fill="#4f46e5"
                    textAnchor="middle"
                  >
                    c = {sideC}
                  </text>

                  {/* Side A (BC) - right side */}
                  <text
                    x={(trianglePoints.pointB.x + trianglePoints.pointC.x) / 2 + 20}
                    y={(trianglePoints.pointB.y + trianglePoints.pointC.y) / 2}
                    fontSize="16"
                    fontWeight="bold"
                    fill="#10b981"
                    textAnchor="middle"
                  >
                    a = {sideA}
                  </text>

                  {/* Side B (CA) - left side */}
                  <text
                    x={(trianglePoints.pointC.x + trianglePoints.pointA.x) / 2 - 25}
                    y={(trianglePoints.pointC.y + trianglePoints.pointA.y) / 2}
                    fontSize="16"
                    fontWeight="bold"
                    fill="#f59e0b"
                    textAnchor="middle"
                  >
                    b = {sideB}
                  </text>

                  {/* Animated indicators removed */}
                </>
              )}

              {/* Invalid triangle message */}
              {!isValidTriangle && (
                <text
                  x={canvasWidth / 2}
                  y={canvasHeight / 2}
                  fontSize="20"
                  fontWeight="bold"
                  fill="#dc2626"
                  textAnchor="middle"
                >
                  {t.invalidTriangle}
                </text>
              )}
            </svg>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Sliders */}
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-indigo-900">{t.sideLengths}</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.sideA}: {sideA}
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={sideA}
                  onChange={(e) => setSideA(Number(e.target.value))}
                  className="w-full h-2 bg-green-300 rounded-lg appearance-none cursor-pointer accent-green-600"
                  disabled={isPlaying}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.sideB}: {sideB}
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={sideB}
                  onChange={(e) => setSideB(Number(e.target.value))}
                  className="w-full h-2 bg-amber-300 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  disabled={isPlaying}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.sideC}: {sideC}
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={sideC}
                  onChange={(e) => setSideC(Number(e.target.value))}
                  className="w-full h-2 bg-indigo-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  disabled={isPlaying}
                />
              </div>
            </div>

            {/* Inequalities */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-indigo-900 mb-4">{t.inequalities}</h2>
              <div className="space-y-3">
                <div
                  className={`p-3 rounded-lg ${
                    sideA + sideB > sideC
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-red-100 border-2 border-red-500'
                  }`}
                >
                  <p className="font-mono">
                    {sideA} + {sideB} &gt; {sideC}: <span className="font-bold">{sideA + sideB} &gt; {sideC}</span>
                    <span className="ml-2">{sideA + sideB > sideC ? '✓' : '✗'}</span>
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    sideB + sideC > sideA
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-red-100 border-2 border-red-500'
                  }`}
                >
                  <p className="font-mono">
                    {sideB} + {sideC} &gt; {sideA}: <span className="font-bold">{sideB + sideC} &gt; {sideA}</span>
                    <span className="ml-2">{sideB + sideC > sideA ? '✓' : '✗'}</span>
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    sideC + sideA > sideB
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-red-100 border-2 border-red-500'
                  }`}
                >
                  <p className="font-mono">
                    {sideC} + {sideA} &gt; {sideB}: <span className="font-bold">{sideC + sideA} &gt; {sideB}</span>
                    <span className="ml-2">{sideC + sideA > sideB ? '✓' : '✗'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div
              className={`rounded-lg p-6 text-center font-bold text-lg ${
                isValidTriangle
                  ? 'bg-green-100 border-2 border-green-500 text-green-900'
                  : 'bg-red-100 border-2 border-red-500 text-red-900'
              }`}
            >
              {isValidTriangle ? t.validTriangle : t.invalidTriangle}
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              {/* Animation controls removed */}
            </div>
          </div>
        </div>

        {/* Triangle Inequality Theorem Definition */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📖</span>
            <h3 className="text-xl font-bold text-blue-800">{t.definition}</h3>
          </div>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed text-lg">
              {language === 'en' 
                ? "The Triangle Inequality Theorem states that the sum of the lengths of any two sides of a triangle must be greater than the length of the third side."
                : language === 'hi'
                ? "त्रिभुज असमानता प्रमेय कहता है कि किसी त्रिभुज की किन्हीं दो भुजाओं की लंबाई का योग तीसरी भुजा की लंबाई से अधिक होना चाहिए।"
                : "ત્રિકોણ અસમાનતા પ્રમેય કહે છે કે કોઈપણ ત્રિકોણની કોઈપણ બે બાજુઓની લંબાઈનો સરવાળો ત્રીજી બાજુની લંબાઈ કરતાં વધારે હોવો જોઈએ।"
              }
            </p>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                {language === 'en' ? 'Mathematical Expression:' : language === 'hi' ? 'गणितीय अभिव्यक्ति:' : 'ગાણિતિક અભિવ્યક્તિ:'}
              </h4>
              <div className="font-mono text-lg space-y-2">
                <p>a + b &gt; c</p>
                <p>b + c &gt; a</p>
                <p>c + a &gt; b</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border-l-4 border-green-500">
              <h4 className="font-semibold text-green-900 mb-2">
                {language === 'en' ? 'Why is this important?' : language === 'hi' ? 'यह क्यों महत्वपूर्ण है?' : 'આ શા માટે મહત્વપૂર્ણ છે?'}
              </h4>
              <p className="text-gray-700 text-sm">
                {language === 'en' 
                  ? "This theorem ensures that three given lengths can actually form a triangle. If any of these inequalities fail, the three points cannot be connected to form a triangle."
                  : language === 'hi'
                  ? "यह प्रमेय सुनिश्चित करता है कि तीन दी गई लंबाई वास्तव में एक त्रिभुज बना सकती हैं। यदि इनमें से कोई भी असमानता विफल हो जाती है, तो तीन बिंदुओं को जोड़कर त्रिभुज नहीं बनाया जा सकता।"
                  : "આ પ્રમેય ખાતરી કરે છે કે ત્રણ આપેલ લંબાઈઓ ખરેખર ત્રિકોણ બનાવી શકે છે। જો આમાંથી કોઈપણ અસમાનતા નિષ્ફળ થાય છે, તો ત્રણ બિંદુઓને જોડીને ત્રિકોણ બનાવી શકાતો નથી।"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4">{t.legend}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 bg-green-500"></div>
              <span>{t.sideA}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 bg-amber-500"></div>
              <span>{t.sideB}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 bg-indigo-500"></div>
              <span>{t.sideC}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPracticeMode = () => {
    const practiceQuestions = [
      {
        id: 1,
        question: {
          en: "Can a triangle have sides of lengths 3, 4, and 8?",
          hi: "क्या एक त्रिभुज की भुजाएं 3, 4, और 8 की लंबाई की हो सकती हैं?",
          gu: "શું ત્રિકોણની બાજુઓ 3, 4, અને 8 ની લંબાઈની હોઈ શકે છે?"
        },
        answer: "no",
        explanation: {
          en: "No, because 3 + 4 = 7, which is not greater than 8. The triangle inequality theorem requires that the sum of any two sides must be greater than the third side.",
          hi: "नहीं, क्योंकि 3 + 4 = 7, जो 8 से अधिक नहीं है। त्रिभुज असमानता प्रमेय के अनुसार किन्हीं दो भुजाओं का योग तीसरी भुजा से अधिक होना चाहिए।",
          gu: "ના, કારણ કે 3 + 4 = 7, જે 8 કરતાં વધારે નથી। ત્રિકોણ અસમાનતા પ્રમેય મુજબ કોઈપણ બે બાજુઓનો સરવાળો ત્રીજી બાજુ કરતાં વધારે હોવો જોઈએ।"
        }
      },
      {
        id: 2,
        question: {
          en: "If two sides of a triangle are 5 and 7, what is the range of possible lengths for the third side?",
          hi: "यदि एक त्रिभुज की दो भुजाएं 5 और 7 हैं, तो तीसरी भुजा की संभावित लंबाई का परिसर क्या है?",
          gu: "જો ત્રિકોણની બે બાજુઓ 5 અને 7 હોય, તો ત્રીજી બાજુની શક્ય લંબાઈની રેન્જ કેટલી છે?"
        },
        answer: "2 < x < 12",
        explanation: {
          en: "The third side must satisfy: 5 + 7 > x, 5 + x > 7, and 7 + x > 5. This gives us 2 < x < 12.",
          hi: "तीसरी भुजा को संतुष्ट करना चाहिए: 5 + 7 > x, 5 + x > 7, और 7 + x > 5। इससे हमें 2 < x < 12 मिलता है।",
          gu: "ત્રીજી બાજુને સંતુષ્ટ કરવી જોઈએ: 5 + 7 > x, 5 + x > 7, અને 7 + x > 5। આથી આપણને 2 < x < 12 મળે છે।"
        }
      },
      {
        id: 3,
        question: {
          en: "Which of the following sets of side lengths can form a triangle: (2, 3, 5) or (3, 4, 6)?",
          hi: "निम्नलिखित में से कौन सा भुजा लंबाई का सेट त्रिभुज बना सकता है: (2, 3, 5) या (3, 4, 6)?",
          gu: "નીચેનામાંથી કયા બાજુ લંબાઈના સેટથી ત્રિકોણ બનાવી શકાય: (2, 3, 5) કે (3, 4, 6)?"
        },
        answer: "(3, 4, 6)",
        explanation: {
          en: "(3, 4, 6) can form a triangle because 3+4>6, 3+6>4, and 4+6>3. (2, 3, 5) cannot because 2+3=5, not greater than 5.",
          hi: "(3, 4, 6) त्रिभुज बना सकता है क्योंकि 3+4>6, 3+6>4, और 4+6>3। (2, 3, 5) नहीं बना सकता क्योंकि 2+3=5, 5 से अधिक नहीं।",
          gu: "(3, 4, 6) ત્રિકોણ બનાવી શકે છે કારણ કે 3+4>6, 3+6>4, અને 4+6>3। (2, 3, 5) નહીં કારણ કે 2+3=5, 5 કરતાં વધારે નથી।"
        }
      },
      {
        id: 4,
        question: {
          en: "If a triangle has sides of lengths 6 and 8, what is the maximum possible length of the third side?",
          hi: "यदि एक त्रिभुज की भुजाएं 6 और 8 की लंबाई की हैं, तो तीसरी भुजा की अधिकतम संभावित लंबाई क्या है?",
          gu: "જો ત્રિકોણની બાજુઓ 6 અને 8 ની લંબાઈની હોય, તો ત્રીજી બાજુની મહત્તમ શક્ય લંબાઈ કેટલી છે?"
        },
        answer: "13",
        explanation: {
          en: "The maximum length occurs when the third side is just less than the sum of the other two sides. So the maximum is just less than 6 + 8 = 14, which is 13.",
          hi: "अधिकतम लंबाई तब होती है जब तीसरी भुजा अन्य दो भुजाओं के योग से थोड़ी कम हो। तो अधिकतम 6 + 8 = 14 से थोड़ा कम है, जो 13 है।",
          gu: "મહત્તમ લંબાઈ ત્યારે થાય છે જ્યારે ત્રીજી બાજુ અન્ય બે બાજુઓના સરવાળા કરતાં થોડી ઓછી હોય। તો મહત્તમ 6 + 8 = 14 કરતાં ઓછી છે, જે 13 છે।"
        }
      },
      {
        id: 5,
        question: {
          en: "A triangle has sides of lengths 7, 9, and x. If x is an integer, what is the minimum value of x?",
          hi: "एक त्रिभुज की भुजाएं 7, 9, और x की लंबाई की हैं। यदि x एक पूर्णांक है, तो x का न्यूनतम मान क्या है?",
          gu: "ત્રિકોણની બાજુઓ 7, 9, અને x ની લંબાઈની છે। જો x પૂર્ણાંક છે, તો x નું ન્યૂનતમ મૂલ્ય કેટલું છે?"
        },
        answer: "3",
        explanation: {
          en: "For the triangle inequality: 7 + 9 > x, so x < 16. Also, 7 + x > 9, so x > 2. Since x is an integer, the minimum value is 3.",
          hi: "त्रिभुज असमानता के लिए: 7 + 9 > x, तो x < 16। साथ ही, 7 + x > 9, तो x > 2। चूंकि x एक पूर्णांक है, न्यूनतम मान 3 है।",
          gu: "ત્રિકોણ અસમાનતા માટે: 7 + 9 > x, તો x < 16। સાથે સાથે, 7 + x > 9, તો x > 2। કારણ કે x પૂર્ણાંક છે, ન્યૂનતમ મૂલ્ય 3 છે।"
        }
      },
      {
        id: 6,
        question: {
          en: "Which statement about triangle inequality is correct?",
          hi: "त्रिभुज असमानता के बारे में कौन सा कथन सही है?",
          gu: "ત્રિકોણ અસમાનતા વિશે કયું વિધાન સાચું છે?"
        },
        answer: "The sum of any two sides must be greater than the third side",
        explanation: {
          en: "The Triangle Inequality Theorem states that the sum of the lengths of any two sides of a triangle must be greater than the length of the third side.",
          hi: "त्रिभुज असमानता प्रमेय कहता है कि किसी त्रिभुज की किन्हीं दो भुजाओं की लंबाई का योग तीसरी भुजा की लंबाई से अधिक होना चाहिए।",
          gu: "ત્રિકોણ અસમાનતા પ્રમેય કહે છે કે કોઈપણ ત્રિકોણની કોઈપણ બે બાજુઓની લંબાઈનો સરવાળો ત્રીજી બાજુની લંબાઈ કરતાં વધારે હોવો જોઈએ।"
        }
      }
    ];

    const handleAnswerSubmit = (answer: string) => {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestion] = answer;
      setUserAnswers(newAnswers);
    };

    const nextQuestion = () => {
      if (currentQuestion < practiceQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowOverview(true);
        calculateScore();
      }
    };

    const prevQuestion = () => {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
      }
    };

    const calculateScore = () => {
      let score = 0;
      practiceQuestions.forEach((question, index) => {
        if (question.id === 6) {
          // For the last question, check if answer matches the correct statement
          if (userAnswers[index].toLowerCase().includes("sum") && userAnswers[index].toLowerCase().includes("greater")) {
            score++;
          }
        } else if (question.id === 2) {
          // For question 2, check if answer contains the range
          if (userAnswers[index].includes("2") && userAnswers[index].includes("12")) {
            score++;
          }
        } else if (question.id === 3) {
          // For question 3, check if answer contains the correct set
          if (userAnswers[index].includes("(3, 4, 6)")) {
            score++;
          }
        } else {
          // For other questions, check exact match
          if (userAnswers[index].toLowerCase() === question.answer.toLowerCase()) {
            score++;
          }
        }
      });
      setPracticeScore(score);
    };

    const resetPractice = () => {
      setCurrentQuestion(0);
      setUserAnswers(new Array(6).fill(''));
      setShowOverview(false);
      setPracticeScore(0);
    };

    if (showOverview) {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gradient-teal-purple mb-4">
                {language === 'hi' ? '📊 अभ्यास सारांश' : language === 'gu' ? '📊 અભ્યાસ સારાંશ' : '📊 Practice Overview'}
              </h2>
              <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {language === 'hi' ? 'आपका स्कोर' : language === 'gu' ? 'તમારો સ્કોર' : 'Your Score'}
                </h3>
                <div className="text-4xl font-bold text-green-600">
                  {practiceScore}/{practiceQuestions.length}
                </div>
                <div className="text-lg text-gray-600 mt-2">
                  {language === 'hi' 
                    ? `${Math.round((practiceScore / practiceQuestions.length) * 100)}% सही उत्तर`
                    : language === 'gu' 
                    ? `${Math.round((practiceScore / practiceQuestions.length) * 100)}% સાચા જવાબ`
                    : `${Math.round((practiceScore / practiceQuestions.length) * 100)}% Correct`
                  }
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {practiceQuestions.map((question, index) => {
                let isCorrect = false;
                if (question.id === 6) {
                  isCorrect = userAnswers[index].toLowerCase().includes("sum") && userAnswers[index].toLowerCase().includes("greater");
                } else if (question.id === 2) {
                  isCorrect = userAnswers[index].includes("2") && userAnswers[index].includes("12");
                } else if (question.id === 3) {
                  isCorrect = userAnswers[index].includes("(3, 4, 6)");
                } else {
                  isCorrect = userAnswers[index].toLowerCase() === question.answer.toLowerCase();
                }
                
                return (
                  <div key={question.id} className={`bg-white rounded-xl p-4 border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        {language === 'hi' ? 'प्रश्न' : language === 'gu' ? 'પ્રશ્ન' : 'Question'} {index + 1}
                      </span>
                      <span className={`text-lg ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? '✓' : '✗'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{question.question[language]}</p>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">
                        {language === 'hi' ? 'आपका उत्तर:' : language === 'gu' ? 'તમારો જવાબ:' : 'Your Answer:'} 
                      </span> {userAnswers[index] || (language === 'hi' ? 'कोई उत्तर नहीं' : language === 'gu' ? 'કોઈ જવાબ નથી' : 'No Answer')}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">
                        {language === 'hi' ? 'सही उत्तर:' : language === 'gu' ? 'સાચો જવાબ:' : 'Correct Answer:'} 
                      </span> {question.answer}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{question.explanation[language]}</div>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <button
                onClick={resetPractice}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {language === 'hi' ? 'फिर से प्रयास करें' : language === 'gu' ? 'ફરીથી પ્રયાસ કરો' : 'Try Again'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    const currentQ = practiceQuestions[currentQuestion];
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient-teal-purple mb-4">
              ✍️ {language === 'hi' ? 'अभ्यास प्रश्न' : language === 'gu' ? 'અભ્યાસ પ્રશ્નો' : 'Practice Questions'}
            </h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-lg text-gray-600">
                {language === 'hi' ? 'प्रश्न' : language === 'gu' ? 'પ્રશ્ન' : 'Question'} {currentQuestion + 1}/{practiceQuestions.length}
              </span>
              <div className="flex gap-1">
                {practiceQuestions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentQuestion ? 'bg-blue-600' : 
                      index < currentQuestion ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                {currentQ.question[language]}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-lg font-medium text-gray-700">
                    {language === 'hi' ? 'उत्तर:' : language === 'gu' ? 'જવાબ:' : 'Answer:'}
                  </label>
                  {(currentQ.id === 1 || currentQ.id === 6) ? (
                    <input
                      type="text"
                      value={userAnswers[currentQuestion]}
                      onChange={(e) => handleAnswerSubmit(e.target.value)}
                      placeholder={language === 'hi' ? 'टाइप करें' : language === 'gu' ? 'ટાઇપ કરો' : 'Type answer'}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-lg w-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <input
                      type="text"
                      value={userAnswers[currentQuestion]}
                      onChange={(e) => handleAnswerSubmit(e.target.value)}
                      placeholder={language === 'hi' ? 'उत्तर दर्ज करें' : language === 'gu' ? 'જવાબ દાખલ કરો' : 'Enter answer'}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-lg w-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>
                
                {userAnswers[currentQuestion] && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>{language === 'hi' ? 'स्पष्टीकरण:' : language === 'gu' ? 'સ્પષ્ટતા:' : 'Explanation:'}</strong>
                    </p>
                    <p className="text-sm text-blue-600 mt-1">{currentQ.explanation[language]}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  currentQuestion === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {language === 'hi' ? 'पिछला' : language === 'gu' ? 'પાછલું' : 'Previous'}
              </button>
              
              <button
                onClick={nextQuestion}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {currentQuestion === practiceQuestions.length - 1
                  ? (language === 'hi' ? 'समाप्त करें' : language === 'gu' ? 'સમાપ્ત કરો' : 'Finish')
                  : (language === 'hi' ? 'अगला' : language === 'gu' ? 'આગળ' : 'Next')
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRealWorldApplications = () => {
    const realWorldExamples = [
      {
        id: 1,
        title: {
          en: "Construction & Architecture",
          hi: "निर्माण और वास्तुकला",
          gu: "બાંધકામ અને સ્થાપત્ય"
        },
        description: {
          en: "Engineers use triangle inequality to determine if three given beam lengths can form a stable triangular truss. This ensures structural integrity in bridges, roofs, and frameworks.",
          hi: "इंजीनियर त्रिभुज असमानता का उपयोग यह निर्धारित करने के लिए करते हैं कि क्या तीन दी गई बीम लंबाई एक स्थिर त्रिकोणीय ट्रस बना सकती हैं। यह पुलों, छतों और फ्रेमवर्क में संरचनात्मक अखंडता सुनिश्चित करता है।",
          gu: "ઇજનેરો ત્રિકોણ અસમાનતાનો ઉપયોગ એ નક્કી કરવા માટે કરે છે કે શું ત્રણ આપેલ બીમ લંબાઈઓ સ્થિર ત્રિકોણાકાર ટ્રસ બનાવી શકે છે। આ પુલો, છતો અને ફ્રેમવર્કમાં માળખાકીય અખંડતા સુનિશ્ચિત કરે છે।"
        },
        calculation: {
          en: "If beam lengths are 5m, 7m, and 15m: 5+7=12 < 15, so no triangle can be formed",
          hi: "यदि बीम लंबाई 5m, 7m, और 15m है: 5+7=12 < 15, इसलिए कोई त्रिभुज नहीं बन सकता",
          gu: "જો બીમ લંબાઈ 5m, 7m, અને 15m છે: 5+7=12 < 15, તેથી કોઈ ત્રિકોણ બનાવી શકાતો નથી"
        },
        icon: "🏗️"
      },
      {
        id: 2,
        title: {
          en: "Surveying & Mapping",
          hi: "सर्वेक्षण और मानचित्रण",
          gu: "સર્વેક્ષણ અને નકશાકારી"
        },
        description: {
          en: "Surveyors use triangulation networks where triangle inequality helps verify if measured distances between three points can form a valid triangle, ensuring accurate mapping.",
          hi: "सर्वेक्षक त्रिकोणीय नेटवर्क का उपयोग करते हैं जहां त्रिभुज असमानता यह सत्यापित करने में मदद करती है कि तीन बिंदुओं के बीच मापी गई दूरियां एक वैध त्रिभुज बना सकती हैं, सटीक मानचित्रण सुनिश्चित करती हैं।",
          gu: "સર્વેક્ષકો ત્રિકોણીય નેટવર્કનો ઉપયોગ કરે છે જ્યાં ત્રિકોણ અસમાનતા ત્રણ બિંદુઓ વચ્ચે માપેલી દૂરીઓ વેધ ત્રિકોણ બનાવી શકે છે કે નહીં તે ચકાસવામાં મદદ કરે છે, સચોટ નકશાકારી સુનિશ્ચિત કરે છે।"
        },
        calculation: {
          en: "Distance verification: AB + BC > AC, AB + AC > BC, BC + AC > AB",
          hi: "दूरी सत्यापन: AB + BC > AC, AB + AC > BC, BC + AC > AB",
          gu: "દૂરી ચકાસણી: AB + BC > AC, AB + AC > BC, BC + AC > AB"
        },
        icon: "📐"
      },
      {
        id: 3,
        title: {
          en: "Computer Graphics & Gaming",
          hi: "कंप्यूटर ग्राफिक्स और गेमिंग",
          gu: "કમ્પ્યુટર ગ્રાફિક્સ અને ગેમિંગ"
        },
        description: {
          en: "In 3D modeling, triangle inequality ensures that three vertices can form a valid triangular face. This prevents rendering errors and ensures proper mesh generation.",
          hi: "3D मॉडलिंग में, त्रिभुज असमानता सुनिश्चित करती है कि तीन शीर्ष एक वैध त्रिकोणीय फलक बना सकते हैं। यह रेंडरिंग त्रुटियों को रोकता है और उचित मेश जेनरेशन सुनिश्चित करता है।",
          gu: "3D મોડેલિંગમાં, ત્રિકોણ અસમાનતા ખાતરી કરે છે કે ત્રણ શિરોબિંદુઓ વેધ ત્રિકોણાકાર ચહેરો બનાવી શકે છે। આ રેન્ડરિંગ ભૂલોને અટકાવે છે અને યોગ્ય મેશ જનરેશન સુનિશ્ચિત કરે છે।"
        },
        calculation: {
          en: "Mesh validation: Check if edge lengths satisfy triangle inequality before rendering",
          hi: "मेश सत्यापन: रेंडरिंग से पहले जांचें कि क्या किनारे की लंबाई त्रिभुज असमानता को संतुष्ट करती है",
          gu: "મેશ ચકાસણી: રેન્ડરિંગ પહેલાં ચકાસો કે શું કિનારાની લંબાઈ ત્રિકોણ અસમાનતાને સંતુષ્ટ કરે છે"
        },
        icon: "💻"
      },
      {
        id: 4,
        title: {
          en: "Navigation & GPS",
          hi: "नेविगेशन और GPS",
          gu: "નેવિગેશન અને GPS"
        },
        description: {
          en: "GPS systems use triangulation where triangle inequality validates if three satellite distances can form a valid triangle, ensuring accurate position calculation.",
          hi: "GPS सिस्टम त्रिकोणीकरण का उपयोग करते हैं जहां त्रिभुज असमानता यह सत्यापित करती है कि क्या तीन उपग्रह दूरियां एक वैध त्रिभुज बना सकती हैं, सटीक स्थिति गणना सुनिश्चित करती हैं।",
          gu: "GPS સિસ્ટમ્સ ત્રિકોણીકરણનો ઉપયોગ કરે છે જ્યાં ત્રિકોણ અસમાનતા ચકાસે છે કે શું ત્રણ ઉપગ્રહ દૂરીઓ વેધ ત્રિકોણ બનાવી શકે છે, સચોટ સ્થિતિ ગણતરી સુનિશ્ચિત કરે છે।"
        },
        calculation: {
          en: "Position accuracy: Satellite distances must satisfy triangle inequality for valid triangulation",
          hi: "स्थिति सटीकता: वैध त्रिकोणीकरण के लिए उपग्रह दूरियों को त्रिभुज असमानता को संतुष्ट करना चाहिए",
          gu: "સ્થિતિ ચોકસાઈ: વેધ ત્રિકોણીકરણ માટે ઉપગ્રહ દૂરીઓ ત્રિકોણ અસમાનતાને સંતુષ્ટ કરવી જોઈએ"
        },
        icon: "🧭"
      },
      {
        id: 5,
        title: {
          en: "Robotics & Path Planning",
          hi: "रोबोटिक्स और पथ नियोजन",
          gu: "રોબોટિક્સ અને પથ આયોજન"
        },
        description: {
          en: "Robots use triangle inequality to validate if three waypoints can form a valid triangular path, ensuring efficient and collision-free navigation.",
          hi: "रोबोट त्रिभुज असमानता का उपयोग यह सत्यापित करने के लिए करते हैं कि क्या तीन वेपॉइंट एक वैध त्रिकोणीय पथ बना सकते हैं, कुशल और टक्कर-मुक्त नेविगेशन सुनिश्चित करते हैं।",
          gu: "રોબોટ્સ ત્રિકોણ અસમાનતાનો ઉપયોગ એ ચકાસવા માટે કરે છે કે શું ત્રણ વેપોઇન્ટ વેધ ત્રિકોણાકાર પથ બનાવી શકે છે, કાર્યક્ષમ અને અથડામણ-મુક્ત નેવિગેશન સુનિશ્ચિત કરે છે।"
        },
        calculation: {
          en: "Path validation: Waypoint distances must satisfy triangle inequality for optimal routing",
          hi: "पथ सत्यापन: इष्टतम रूटिंग के लिए वेपॉइंट दूरियों को त्रिभुज असमानता को संतुष्ट करना चाहिए",
          gu: "પથ ચકાસણી: શ્રેષ્ઠ રૂટિંગ માટે વેપોઇન્ટ દૂરીઓ ત્રિકોણ અસમાનતાને સંતુષ્ટ કરવી જોઈએ"
        },
        icon: "🤖"
      },
      {
        id: 6,
        title: {
          en: "Network Topology",
          hi: "नेटवर्क टोपोलॉजी",
          gu: "નેટવર્ક ટોપોલોજી"
        },
        description: {
          en: "In computer networks, triangle inequality helps validate if three nodes can form a valid triangular connection, ensuring efficient data routing and network stability.",
          hi: "कंप्यूटर नेटवर्क में, त्रिभुज असमानता यह सत्यापित करने में मदद करती है कि क्या तीन नोड एक वैध त्रिकोणीय कनेक्शन बना सकते हैं, कुशल डेटा रूटिंग और नेटवर्क स्थिरता सुनिश्चित करते हैं।",
          gu: "કમ્પ્યુટર નેટવર્કમાં, ત્રિકોણ અસમાનતા ચકાસવામાં મદદ કરે છે કે શું ત્રણ નોડ વેધ ત્રિકોણાકાર કનેક્શન બનાવી શકે છે, કાર્યક્ષમ ડેટા રૂટિંગ અને નેટવર્ક સ્થિરતા સુનિશ્ચિત કરે છે।"
        },
        calculation: {
          en: "Network validation: Node distances must satisfy triangle inequality for optimal connectivity",
          hi: "नेटवर्क सत्यापन: इष्टतम कनेक्टिविटी के लिए नोड दूरियों को त्रिभुज असमानता को संतुष्ट करना चाहिए",
          gu: "નેટવર્ક ચકાસણી: શ્રેષ્ઠ કનેક્ટિવિટી માટે નોડ દૂરીઓ ત્રિકોણ અસમાનતાને સંતુષ્ટ કરવી જોઈએ"
        },
        icon: "🌐"
      }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient-teal-purple mb-4">
              🌍 {language === 'hi' ? 'वास्तविक दुनिया' : language === 'gu' ? 'વાસ્તવિક વિશ્વ' : 'Real World'}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'hi' 
                ? 'त्रिभुज गुणों के वास्तविक जीवन में उपयोग के उदाहरण'
                : language === 'gu' 
                ? 'ત્રિકોણ ગુણધર્મોના વાસ્તવિક જીવનમાં ઉપયોગના ઉદાહરણો'
                : 'Examples of triangle properties in real life'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {realWorldExamples.map((example) => (
              <div key={example.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-100">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">{example.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {example.title[language]}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {example.description[language]}
                  </p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      {language === 'hi' ? 'गणना:' : language === 'gu' ? 'ગણતરી:' : 'Calculation:'}
                    </h4>
                    <p className="text-blue-800 font-mono text-sm">
                      {example.calculation[language]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {language === 'hi' ? 'क्यों महत्वपूर्ण है?' : language === 'gu' ? 'શા માટે મહત્વપૂર્ણ છે?' : 'Why is it Important?'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {language === 'hi' 
                  ? 'त्रिभुज गुण न केवल गणित में बल्कि दैनिक जीवन में भी महत्वपूर्ण हैं। ये गुण हमें स्थिर संरचनाएं बनाने, सटीक माप करने और नवीन तकनीक विकसित करने में मदद करते हैं।'
                  : language === 'gu' 
                  ? 'ત્રિકોણ ગુણધર્મો માત્ર ગણિતમાં જ નહીં, પણ દૈનિક જીવનમાં પણ મહત્વપૂર્ણ છે। આ ગુણધર્મો આપણને સ્થિર માળખાઓ બનાવવા, સચોટ માપ કરવા અને નવીન ટેકનોલોજી વિકસાવવામાં મદદ કરે છે।'
                  : 'Triangle properties are important not only in mathematics but also in daily life. These properties help us build stable structures, make precise measurements, and develop innovative technologies.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50">
      {/* Header with Navigation */}
      <header className="bg-gradient-to-r from-teal-600 via-purple-600 to-pink-600 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Logo/Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              📚 {t.chapterTitle}
            </h1>
            
            {/* Navigation Buttons */}
            <nav className="flex items-center gap-3">
              <button
                onClick={() => setCurrentMode('demonstration')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  currentMode === 'demonstration'
                    ? 'bg-white text-teal-600 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                📚 {t.learning}
              </button>
              <button
                onClick={() => setCurrentMode('practice')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  currentMode === 'practice'
                    ? 'bg-white text-teal-600 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                ✍️ {t.practice}
              </button>
              <button
                onClick={() => setCurrentMode('realworld')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  currentMode === 'realworld'
                    ? 'bg-white text-teal-600 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                🌍 {t.realWorldApplications}
              </button>
            </nav>

            {/* Language Selector */}
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as 'en' | 'hi' | 'gu')}
                className="px-3 py-2 rounded-lg bg-white text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="gu">ગુજરાતી</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Main Content */}
        <div className="main-content">
          {currentMode === 'demonstration' && renderDemonstrationMode()}
          {currentMode === 'practice' && renderPracticeMode()}
          {currentMode === 'realworld' && renderRealWorldApplications()}
        </div>
      </main>
    </div>
  );
};

export default InteractiveTriangleCanvas;
