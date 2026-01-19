import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Eye, Box } from 'lucide-react';

interface SpatialCubesVisualizationProps {
  language: 'en' | 'hi' | 'gu';
}

const SpatialCubesVisualization: React.FC<SpatialCubesVisualizationProps> = ({ language }) => {
  const [rotation, setRotation] = useState({ x: 20, y: 45 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewpoint, setViewpoint] = useState<'front' | 'top' | 'side'>('front');
  const [selectedShape, setSelectedShape] = useState(0);
  const animationRef = useRef<number>();

  const translations = {
    en: {
      title: "Spatial Visualization: Hidden Objects",
      subtitle: "Explore how 3D shapes look different from various viewpoints",
      lShape: "L-Shape (5 cubes)",
      staircase: "Staircase (6 cubes)",
      structure3D: "3D Structure (8 cubes)",
      lShapeDesc: "Some cubes are hidden from certain angles",
      staircaseDesc: "Step pattern reveals different counts from each view",
      structure3DDesc: "A 2×2×2 cuboid - understanding dimensions",
      cubes: "cubes",
      activity: "Activity:",
      activityDesc: "Try to count the cubes from different viewpoints. Some cubes might be hidden behind others!",
      autoRotate: "Auto Rotate",
      pauseRotation: "Pause Rotation",
      reset: "Reset",
      frontView: "Front View",
      topView: "Top View",
      sideView: "Side View",
      learningObjectives: "Learning Objectives:",
      objective1: "Understand how objects look different from various viewpoints",
      objective2: "Develop skills to visualize hidden parts of 3D structures",
      objective3: "Learn how multiple cubes combine to form larger cuboids",
      objective4: "Practice counting cubes when some are obscured"
    },
    hi: {
      title: "स्थानिक दृश्यीकरण: छुपी हुई वस्तुएं",
      subtitle: "जानें कि 3D आकृतियां विभिन्न दृष्टिकोणों से कैसे अलग दिखती हैं",
      lShape: "L-आकार (5 घन)",
      staircase: "सीढ़ी (6 घन)",
      structure3D: "3D संरचना (8 घन)",
      lShapeDesc: "कुछ घन कुछ कोणों से छुपे होते हैं",
      staircaseDesc: "सीढ़ी पैटर्न प्रत्येक दृश्य से अलग गिनती दिखाता है",
      structure3DDesc: "एक 2×2×2 घनाभ - आयामों को समझना",
      cubes: "घन",
      activity: "गतिविधि:",
      activityDesc: "विभिन्न दृष्टिकोणों से घनों को गिनने की कोशिश करें। कुछ घन दूसरों के पीछे छुपे हो सकते हैं!",
      autoRotate: "स्वचालित घुमाव",
      pauseRotation: "घुमाव रोकें",
      reset: "रीसेट",
      frontView: "सामने का दृश्य",
      topView: "ऊपर का दृश्य",
      sideView: "बगल का दृश्य",
      learningObjectives: "सीखने के उद्देश्य:",
      objective1: "समझें कि वस्तुएं विभिन्न दृष्टिकोणों से कैसे अलग दिखती हैं",
      objective2: "3D संरचनाओं के छुपे हुए भागों का दृश्यीकरण करने का कौशल विकसित करें",
      objective3: "सीखें कि कैसे कई घन मिलकर बड़े घनाभ बनाते हैं",
      objective4: "जब कुछ घन छुपे हों तो घनों को गिनने का अभ्यास करें"
    },
    gu: {
      title: "સ્થાનિક દ્રશ્યીકરણ: છુપાયેલી વસ્તુઓ",
      subtitle: "જાણો કે 3D આકૃતિઓ વિવિધ દૃષ્ટિકોણોથી કેવી રીતે અલગ દેખાય છે",
      lShape: "L-આકાર (5 ઘન)",
      staircase: "પગથિયાં (6 ઘન)",
      structure3D: "3D માળખું (8 ઘન)",
      lShapeDesc: "કેટલાક ઘન કેટલાક ખૂણાઓથી છુપાયેલા હોય છે",
      staircaseDesc: "પગથિયાં પેટર્ન દરેક દૃશ્યથી અલગ ગણતરી બતાવે છે",
      structure3DDesc: "એક 2×2×2 ઘનાભ - પરિમાણોને સમજવું",
      cubes: "ઘન",
      activity: "પ્રવૃત્તિ:",
      activityDesc: "વિવિધ દૃષ્ટિકોણોથી ઘનોને ગણવાનો પ્રયાસ કરો। કેટલાક ઘન અન્ય પાછળ છુપાયેલા હોઈ શકે છે!",
      autoRotate: "સ્વચાલિત ફેરવણી",
      pauseRotation: "ફેરવણી રોકો",
      reset: "રીસેટ",
      frontView: "આગળનો દેખાવ",
      topView: "ઉપરનો દેખાવ",
      sideView: "બાજુનો દેખાવ",
      learningObjectives: "શીખવાના ઉદ્દેશ્યો:",
      objective1: "સમજો કે વસ્તુઓ વિવિધ દૃષ્ટિકોણોથી કેવી રીતે અલગ દેખાય છે",
      objective2: "3D માળખાઓના છુપાયેલા ભાગોનું દ્રશ્યીકરણ કરવાનું કૌશલ્ય વિકસાવો",
      objective3: "શીખો કે કેવી રીતે ઘણા ઘન મળીને મોટા ઘનાભ બનાવે છે",
      objective4: "જ્યારે કેટલાક ઘન છુપાયેલા હોય ત્યારે ઘનોને ગણવાનો અભ્યાસ કરો"
    }
  };

  const t = translations[language];

  const shapes = [
    {
      name: t.lShape,
      cubes: [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: 2, z: 0 }
      ],
      description: t.lShapeDesc
    },
    {
      name: t.staircase,
      cubes: [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 1, y: 1, z: 0 },
        { x: 2, y: 1, z: 0 },
        { x: 2, y: 2, z: 0 },
        { x: 3, y: 2, z: 0 }
      ],
      description: t.staircaseDesc
    },
    {
      name: t.structure3D,
      cubes: [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 1, y: 1, z: 0 },
        { x: 0, y: 0, z: 1 },
        { x: 1, y: 0, z: 1 },
        { x: 0, y: 1, z: 1 },
        { x: 1, y: 1, z: 1 }
      ],
      description: t.structure3DDesc
    }
  ];

  const viewpoints = {
    front: { x: 20, y: 45 },
    top: { x: 80, y: 45 },
    side: { x: 20, y: 90 }
  };

  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setRotation(prev => ({
          x: prev.x,
          y: (prev.y + 1) % 360
        }));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isAnimating]);

  const toggleAnimation = () => setIsAnimating(!isAnimating);

  const resetView = () => {
    setRotation({ x: 20, y: 45 });
    setIsAnimating(false);
  };

  const changeViewpoint = (view: 'front' | 'top' | 'side') => {
    setViewpoint(view);
    setRotation(viewpoints[view]);
    setIsAnimating(false);
  };

  const renderCube = (pos: { x: number; y: number; z: number }, index: number) => {
    const scale = 40;
    const spacing = 1.2;
    const centerOffset = -1.5;

    const x = (pos.x + centerOffset) * scale * spacing;
    const y = (pos.y + centerOffset) * scale * spacing;
    const z = (pos.z + centerOffset) * scale * spacing;

    const rotX = rotation.x * Math.PI / 180;
    const rotY = rotation.y * Math.PI / 180;

    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;
    const y1 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    const perspective = 1000;
    const scale3d = perspective / (perspective + z2);

    const screenX = x1 * scale3d + 300;
    const screenY = -y1 * scale3d + 250;

    const brightness = 0.5 + (z2 / 200) * 0.5;
    const color = `hsl(${210 + index * 15}, 70%, ${Math.max(30, Math.min(70, brightness * 60))}%)`;

    return (
      <g key={index} style={{ transition: 'all 0.3s ease' }}>
        {/* Top face */}
        <path
          d={`M ${screenX} ${screenY} 
              L ${screenX + 20 * scale3d} ${screenY - 10 * scale3d}
              L ${screenX + 20 * scale3d} ${screenY + 10 * scale3d}
              L ${screenX} ${screenY + 20 * scale3d} Z`}
          fill={color}
          stroke="#1e293b"
          strokeWidth="1.5"
          opacity="0.9"
        />
        {/* Right face */}
        <path
          d={`M ${screenX + 20 * scale3d} ${screenY - 10 * scale3d}
              L ${screenX + 40 * scale3d} ${screenY}
              L ${screenX + 40 * scale3d} ${screenY + 20 * scale3d}
              L ${screenX + 20 * scale3d} ${screenY + 10 * scale3d} Z`}
          fill={`hsl(${210 + index * 15}, 70%, ${Math.max(25, Math.min(60, brightness * 50))}%)`}
          stroke="#1e293b"
          strokeWidth="1.5"
          opacity="0.9"
        />
        {/* Front face */}
        <path
          d={`M ${screenX} ${screenY + 20 * scale3d}
              L ${screenX + 20 * scale3d} ${screenY + 10 * scale3d}
              L ${screenX + 40 * scale3d} ${screenY + 20 * scale3d}
              L ${screenX + 20 * scale3d} ${screenY + 30 * scale3d} Z`}
          fill={`hsl(${210 + index * 15}, 70%, ${Math.max(35, Math.min(75, brightness * 70))}%)`}
          stroke="#1e293b"
          strokeWidth="1.5"
          opacity="0.9"
        />
      </g>
    );
  };

  const currentShape = shapes[selectedShape];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Box className="w-8 h-8 text-blue-400" />
          {t.title}
        </h2>
        <p className="text-slate-300">
          {t.subtitle}
        </p>
      </div>

      {/* Shape selector */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {shapes.map((shape, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedShape(idx)}
            className={`p-4 rounded-lg transition-all ${
              selectedShape === idx
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <div className="font-semibold">{shape.name}</div>
            <div className="text-sm opacity-80 mt-1">{shape.cubes.length} {t.cubes}</div>
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="bg-slate-950 rounded-lg p-4 mb-6 border-2 border-slate-700">
        <svg width="600" height="500" className="mx-auto">
          <defs>
            <filter id="shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          <g filter="url(#shadow)">
            {currentShape.cubes.map((cube, idx) => renderCube(cube, idx))}
          </g>
        </svg>
      </div>

      {/* Description */}
      <div className="mb-6 p-4 bg-slate-800 rounded-lg border-l-4 border-blue-500">
        <p className="text-slate-200">{currentShape.description}</p>
        <p className="text-slate-400 mt-2 text-sm">
          <strong>{t.activity}</strong> {t.activityDesc}
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <button
            onClick={toggleAnimation}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all shadow-lg"
          >
            <Play className="w-5 h-5" />
            {isAnimating ? t.pauseRotation : t.autoRotate}
          </button>
          <button
            onClick={resetView}
            className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            {t.reset}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => changeViewpoint('front')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
              viewpoint === 'front'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Eye className="w-5 h-5" />
            {t.frontView}
          </button>
          <button
            onClick={() => changeViewpoint('top')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
              viewpoint === 'top'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Eye className="w-5 h-5" />
            {t.topView}
          </button>
          <button
            onClick={() => changeViewpoint('side')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
              viewpoint === 'side'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Eye className="w-5 h-5" />
            {t.sideView}
          </button>
        </div>
      </div>

      {/* Learning objectives */}
      <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">{t.learningObjectives}</h3>
        <ul className="text-slate-300 space-y-1 text-sm">
          <li>• {t.objective1}</li>
          <li>• {t.objective2}</li>
          <li>• {t.objective3}</li>
          <li>• {t.objective4}</li>
        </ul>
      </div>
    </div>
  );
};

export default SpatialCubesVisualization;
