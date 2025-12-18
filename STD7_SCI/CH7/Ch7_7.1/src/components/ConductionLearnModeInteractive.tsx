import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Flame, ThermometerSun, AlertTriangle, ChevronDown, ChevronUp, Beaker, Info, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Pin simulation materials - from closest to farthest from heat source (HEAT ON RIGHT)
const pins = [
  { id: 'pin1', label: 'I', xPosition: 360, fallOrder: 1, color: '#EF4444' }, // Closest to candle (right)
  { id: 'pin2', label: 'II', xPosition: 290, fallOrder: 2, color: '#F97316' },
  { id: 'pin3', label: 'III', xPosition: 220, fallOrder: 3, color: '#FBBF24' },
  { id: 'pin4', label: 'IV', xPosition: 150, fallOrder: 4, color: '#10B981' }, // Farthest from candle (left)
];

const ConductionLearnModeInteractive: React.FC = () => {
  const { t } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<string[]>(['intro', 'activity']);

  // Pin animation states
  const [heatIntensity, setHeatIntensity] = useState(0);
  const [fallenPins, setFallenPins] = useState<string[]>([]);
  const [isHeating, setIsHeating] = useState(false);
  const [currentFallingPin, setCurrentFallingPin] = useState<string | null>(null);

  // Material testing states
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [testedMaterials, setTestedMaterials] = useState<string[]>([]);
  const [showMaterialResult, setShowMaterialResult] = useState(false);

  // Drag and drop for materials
  const [draggedMaterial, setDraggedMaterial] = useState<string | null>(null);
  const [materialPositions, setMaterialPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [materialInTest, setMaterialInTest] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]));
  };

  // Material data for testing
  const materials = useMemo(
    () => [
      { id: 'steel', name: t('conduction.materials.steel'), type: 'conductor', color: '#64748B', emoji: '🔧' },
      { id: 'copper', name: t('conduction.materials.copper'), type: 'conductor', color: '#C87533', emoji: '🟠' },
      { id: 'aluminum', name: t('conduction.materials.aluminum'), type: 'conductor', color: '#A8A9AD', emoji: '⚪' },
      { id: 'wood', name: t('conduction.materials.wood'), type: 'insulator', color: '#8B5A2B', emoji: '🪵' },
      { id: 'plastic', name: t('conduction.materials.plastic'), type: 'insulator', color: '#3B82F6', emoji: '🔴' },
      { id: 'glass', name: t('conduction.materials.glass'), type: 'insulator', color: '#93C5FD', emoji: '💎' },
    ],
    [t],
  );

  // Initialize material positions
  useEffect(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    materials.forEach((material, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      positions[material.id] = {
        x: 100 + col * 100,
        y: 280 + row * 60,
      };
    });
    setMaterialPositions(positions);
  }, []);

  // Pin falling animation
  const startHeating = () => {
    setIsHeating(true);
    setHeatIntensity(0);
    setFallenPins([]);
    setCurrentFallingPin(null);

    // Gradually increase heat and drop pins with better timing
    const heatInterval = setInterval(() => {
      setHeatIntensity((prev) => {
        const newIntensity = prev + 1;

        // Drop pins based on heat intensity with staggered timing
        pins.forEach((pin) => {
          const triggerPoint = pin.fallOrder * 25;

          // Start falling animation slightly before the trigger point
          if (newIntensity === triggerPoint - 2 && !fallenPins.includes(pin.id) && currentFallingPin !== pin.id) {
            setTimeout(() => {
              setCurrentFallingPin(pin.id);
              // Complete the fall after 1 second
              setTimeout(() => {
                setFallenPins((prevPins) => [...prevPins, pin.id]);
                setCurrentFallingPin(null);
              }, 1000);
            }, 100);
          }
        });

        if (newIntensity >= 100) {
          clearInterval(heatInterval);
          setTimeout(() => setIsHeating(false), 500);
          return 100;
        }
        return newIntensity;
      });
    }, 100); // Slower heat increase - 100ms intervals
  };

  const resetHeating = () => {
    setHeatIntensity(0);
    setFallenPins([]);
    setIsHeating(false);
    setCurrentFallingPin(null);
  };

  // Convert screen coordinates to SVG coordinates
  const screenToSVG = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: svgP.x, y: svgP.y };
  };

  // Material drag handlers
  const handleMaterialMouseDown = (e: React.MouseEvent, materialId: string) => {
    e.preventDefault();
    setDraggedMaterial(materialId);
  };

  const handleMaterialMouseMove = (e: React.MouseEvent) => {
    if (!draggedMaterial || !svgRef.current) return;
    e.preventDefault();

    const svgCoords = screenToSVG(e.clientX, e.clientY);
    setMaterialPositions((prev) => ({
      ...prev,
      [draggedMaterial]: { x: svgCoords.x, y: svgCoords.y },
    }));
  };

  const handleMaterialMouseUp = () => {
    if (!draggedMaterial) return;

    const pos = materialPositions[draggedMaterial];
    const testZone = { x: 230, y: 150, radius: 50 };
    const distance = Math.sqrt(Math.pow(pos.x - testZone.x, 2) + Math.pow(pos.y - testZone.y, 2));

    if (distance < testZone.radius) {
      // Snap to test position
      setMaterialPositions((prev) => ({
        ...prev,
        [draggedMaterial]: { x: testZone.x, y: testZone.y },
      }));
      setMaterialInTest(draggedMaterial);
      setSelectedMaterial(draggedMaterial);
      if (!testedMaterials.includes(draggedMaterial)) {
        setTestedMaterials((prev) => [...prev, draggedMaterial]);
      }
      setShowMaterialResult(true);
    }

    setDraggedMaterial(null);
  };

  const testMaterial = (materialId: string) => {
    setSelectedMaterial(materialId);
    setShowMaterialResult(true);
    if (!testedMaterials.includes(materialId)) {
      setTestedMaterials((prev) => [...prev, materialId]);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6 md:p-8"
      style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}
    >
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes smoothFall {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          20% {
            transform: translateY(10px);
            opacity: 0.9;
          }
          50% {
            transform: translateY(40px);
            opacity: 0.7;
          }
          80% {
            transform: translateY(90px);
            opacity: 0.5;
          }
          100% {
            transform: translateY(115px);
            opacity: 1;
          }
        }
        
        @keyframes waxMelt {
          0% {
            opacity: 1;
            transform: scaleY(1);
          }
          50% {
            opacity: 0.5;
            transform: scaleY(0.7);
          }
          100% {
            opacity: 0;
            transform: scaleY(0.3);
          }
        }
        
        @keyframes heatPulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Activity 7.1 - Interactive Pin Experiment */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-6 sm:mb-8">
          <button
            onClick={() => toggleSection('activity')}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white flex items-center justify-between hover:from-red-700 hover:to-orange-700 transition"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Beaker className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">🔥 {t('conduction.activity.sectionTitle')}</h2>
            </div>
            {expandedSections.includes('activity') ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>

          {expandedSections.includes('activity') && (
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Safety Warning */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 sm:p-5 lg:p-6 rounded-lg mb-6 sm:mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-red-900 mb-2">{t('conduction.activity.safetyTitle')}</h4>
                    <p className="text-red-800 text-sm">{t('conduction.activity.safetyText')}</p>
                  </div>
                </div>
              </div>

              {/* Interactive Simulation */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-100 p-4 sm:p-6 rounded-2xl border-2 border-gray-300 mb-6 sm:mb-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800">🎮 {t('conduction.activity.simulationTitle')}</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={startHeating}
                      disabled={isHeating}
                      className={`px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold flex items-center gap-2 ${
                        isHeating ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                      }`}
                    >
                      <Flame className="w-5 h-5" />
                      {t('conduction.activity.controls.start')}
                    </button>
                    <button
                      onClick={resetHeating}
                      className="px-4 sm:px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm sm:text-base font-semibold flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      {t('conduction.activity.controls.reset')}
                    </button>
                  </div>
                </div>

                {/* Heat Intensity Bar */}
                <div className="mb-6 bg-white p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">{t('conduction.activity.controls.heatIntensity')}</span>
                    <span className="text-sm font-bold text-orange-600">{heatIntensity}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div className="h-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 transition-all duration-300 rounded-full" style={{ width: `${heatIntensity}%` }}>
                      {heatIntensity > 0 && <div className="h-full w-full animate-pulse"></div>}
                    </div>
                  </div>
                </div>

                {/* SVG Simulation */}
                <div className="w-full overflow-x-auto">
                  <svg
                    ref={svgRef}
                    viewBox="0 0 500 280"
                    className="min-w-[360px] sm:min-w-[420px] w-full bg-white rounded-xl shadow-md"
                    preserveAspectRatio="xMidYMid meet"
                  >
                  {/* Wooden base platform */}
                  <defs>
                    <linearGradient id="woodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8B4513" />
                      <stop offset="50%" stopColor="#A0522D" />
                      <stop offset="100%" stopColor="#654321" />
                    </linearGradient>
                  </defs>
                  <rect x="20" y="240" width="460" height="30" fill="url(#woodGradient)" stroke="#5C2E0A" strokeWidth="2" rx="4" />
                  <rect x="20" y="240" width="460" height="5" fill="#A0522D" opacity="0.6" />

                  {/* Stand - Left side vertical rod */}
                  <rect x="50" y="80" width="12" height="160" fill="#2C3E50" stroke="#1a252f" strokeWidth="1.5" rx="2" />
                  {/* Stand base */}
                  <ellipse cx="56" cy="245" rx="25" ry="8" fill="#34495E" />
                  <rect x="31" y="235" width="50" height="10" fill="#2C3E50" rx="2" />

                  {/* Stand clamp for holding metal strip */}
                  <rect x="58" y="95" width="20" height="12" fill="#34495E" stroke="#1a252f" strokeWidth="1" rx="2" />
                  <circle cx="68" cy="101" r="3" fill="#7F8C8D" />

                  {/* Metal Strip - horizontal */}
                  <rect x="78" y="98" width="340" height="8" fill="#94A3B8" stroke="#64748B" strokeWidth="2" rx="2" />
                  {/* Metal strip shine effect */}
                  <rect x="78" y="99" width="340" height="2" fill="#CBD5E1" opacity="0.6" rx="1" />

                  {/* Heat glow on RIGHT end of strip */}
                  {heatIntensity > 0 && (
                    <>
                      <defs>
                        <radialGradient id="heatGlow" cx="50%" cy="50%">
                          <stop offset="0%" stopColor="#FCD34D" stopOpacity={heatIntensity / 100} />
                          <stop offset="50%" stopColor="#F59E0B" stopOpacity={heatIntensity / 150} />
                          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <circle cx="415" cy="102" r={40 + heatIntensity / 5} fill="url(#heatGlow)" className="animate-pulse" />
                      <circle cx="415" cy="102" r={25 + heatIntensity / 10} fill="#F59E0B" opacity={heatIntensity / 200} />
                    </>
                  )}

                  {/* Heat wave animation - traveling from RIGHT to LEFT */}
                  {heatIntensity > 0 && (
                    <>
                      {[...Array(3)].map((_, i) => {
                        const offset = (heatIntensity / 100) * 320;
                        return (
                          <line
                            key={i}
                            x1={415 - offset + i * 30}
                            y1="102"
                            x2={415 - offset + i * 30 - 20}
                            y2="102"
                            stroke="#F59E0B"
                            strokeWidth="3"
                            opacity={(heatIntensity / 100) * (1 - i * 0.3)}
                            className="transition-all duration-300"
                          />
                        );
                      })}
                    </>
                  )}

                  {/* Pins - now positioned ABOVE the metal strip */}
                  {pins.map((pin) => {
                    const hasFallen = fallenPins.includes(pin.id);
                    const isFalling = currentFallingPin === pin.id;
                    // Pins start attached to TOP of strip (y=98) and fall downward
                    const pinTopY = hasFallen ? 200 : isFalling ? 150 : 85;
                    const waxMelted = hasFallen || isFalling;
                    const showGlow = heatIntensity >= pin.fallOrder * 20;

                    return (
                      <g key={pin.id}>
                        {/* Wax blob on TOP of strip */}
                        {!waxMelted && (
                          <>
                            <ellipse
                              cx={pin.xPosition}
                              cy="95"
                              rx="10"
                              ry="7"
                              fill="#FCD34D"
                              opacity={showGlow ? 0.5 : 1}
                              className={showGlow ? 'animate-pulse' : ''}
                              style={{ transition: 'opacity 0.5s ease' }}
                            />
                            {showGlow && <circle cx={pin.xPosition} cy="95" r="15" fill="#F59E0B" opacity="0.2" className="animate-ping" />}
                          </>
                        )}

                        {/* Melting wax drips when falling */}
                        {isFalling && (
                          <g style={{ animation: 'fadeIn 0.3s ease-in' }}>
                            <ellipse cx={pin.xPosition} cy="100" rx="8" ry="5" fill="#FCD34D" opacity="0.7" />
                            <ellipse cx={pin.xPosition} cy="105" rx="6" ry="4" fill="#FCD34D" opacity="0.5" />
                            <ellipse cx={pin.xPosition} cy="110" rx="4" ry="3" fill="#FCD34D" opacity="0.3" />
                          </g>
                        )}

                        {/* Pin body - pointing DOWNWARD with smooth transition */}
                        <g
                          style={{
                            transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            transform: `translateY(${pinTopY - 85}px)`,
                          }}
                        >
                          {/* Pin head (round top) */}
                          <circle cx={pin.xPosition} cy={85} r="5" fill={pin.color} stroke="#1F2937" strokeWidth="1" />
                          {/* Pin shaft (pointing down) */}
                          <line x1={pin.xPosition} y1={90} x2={pin.xPosition} y2={110} stroke={pin.color} strokeWidth="3" strokeLinecap="round" />
                          {/* Pin tip */}
                          <polygon points={`${pin.xPosition},110 ${pin.xPosition - 2.5},106 ${pin.xPosition + 2.5},106`} fill={pin.color} />
                        </g>

                        {/* Label above the strip with fade effect */}
                        <text x={pin.xPosition} y="75" textAnchor="middle" className="text-sm font-bold" fill={hasFallen ? pin.color : '#1F2937'} style={{ transition: 'fill 0.3s ease' }}>
                          {pin.label}
                        </text>

                        {/* Falling indicator with fade-in animation */}
                        {hasFallen && (
                          <text
                            x={pin.xPosition}
                            y="230"
                            textAnchor="middle"
                            className="text-xs font-bold"
                            fill={pin.color}
                            style={{
                              animation: 'fadeInScale 0.5s ease-out',
                              transformOrigin: 'center',
                            }}
                          >
                            ✓ Fallen
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Candle - positioned on the RIGHT side */}
                  <g>
                    {/* Candle body */}
                    <rect x="405" y="150" width="20" height="40" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" rx="2" />
                    <rect x="405" y="150" width="20" height="8" fill="#FCD34D" rx="2" />
                    {/* Candle wick */}
                    <rect x="413.5" y="145" width="1.5" height="8" fill="#2C3E50" />
                    {/* Flame */}
                    <ellipse cx="414.5" cy="138" rx="6" ry="10" fill="#FCD34D" className={isHeating ? 'animate-pulse' : ''} />
                    {isHeating && (
                      <>
                        <path d="M 414.5 133 Q 412 128, 414.5 123" stroke="#F59E0B" strokeWidth="2.5" fill="none" className="animate-pulse" />
                        <path d="M 414.5 133 Q 417 128, 414.5 123" stroke="#FBBF24" strokeWidth="2" fill="none" className="animate-pulse" />
                        {/* Inner flame core */}
                        <ellipse cx="414.5" cy="138" rx="3" ry="6" fill="#3B82F6" opacity="0.6" className="animate-pulse" />
                      </>
                    )}
                    {/* Candle stand base */}
                    <rect x="402" y="190" width="26" height="4" fill="#9CA3AF" rx="1" />
                    <rect x="400" y="194" width="30" height="8" fill="#6B7280" rx="2" />
                  </g>

                  {/* Labels */}
                  <text x="56" y="75" textAnchor="middle" className="text-xs font-semibold" fill="#2C3E50">
                    Stand
                  </text>
                  <text x="248" y="90" textAnchor="middle" className="text-xs font-semibold" fill="#475569">
                    Metal strip
                  </text>
                  <text x="415" y="220" textAnchor="middle" className="text-xs font-semibold" fill="#F59E0B">
                    {t('conduction.testing.heatSource')}
                  </text>

                  {/* Direction arrow - from RIGHT to LEFT */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#F59E0B" />
                    </marker>
                  </defs>
                  <line x1="390" y1="125" x2="100" y2="125" stroke="#F59E0B" strokeWidth="3" strokeDasharray="8,4" markerEnd="url(#arrowhead)" opacity="0.7" />
                  <text x="245" y="145" textAnchor="middle" className="text-xs sm:text-sm font-bold" fill="#F59E0B">
                    {t('conduction.activity.heatFlowDirection')}
                  </text>
                  </svg>
                </div>

                {/* Status Display */}
                <div className="mt-6 grid md:grid-cols-4 gap-3">
                  {pins.map((pin) => {
                    const hasFallen = fallenPins.includes(pin.id);
                    const expectedFall = heatIntensity >= pin.fallOrder * 25;

                    return (
                      <div
                        key={pin.id}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          hasFallen ? 'bg-green-50 border-green-400' : expectedFall && !hasFallen ? 'bg-yellow-50 border-yellow-400 animate-pulse' : 'bg-gray-50 border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1" style={{ color: pin.color }}>
                            {t('conduction.activity.pinCard.pinLabel')} ({pin.label})
                          </div>
                          <div className="text-xs text-gray-600 mb-2">{t('conduction.activity.pinCard.order', { order: pin.fallOrder })}</div>
                          {hasFallen && <div className="text-sm font-bold text-green-700">{t('conduction.activity.pinCard.fallen')}</div>}
                          {expectedFall && !hasFallen && <div className="text-sm font-bold text-yellow-700">{t('conduction.activity.pinCard.falling')}</div>}
                          {!expectedFall && !hasFallen && <div className="text-sm text-gray-500">{t('conduction.activity.pinCard.waiting')}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Observation Explanation */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border-2 border-blue-300 mb-6">
                <h4 className="font-bold text-blue-900 mb-4 text-base sm:text-lg">🔬 {t('conduction.activity.observations.title')}</h4>
                <div className="space-y-3">
                  <div className="bg-white p-3 sm:p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">1️⃣</span>
                      <div>
                        <p className="font-bold text-gray-800 text-sm sm:text-base">{t('conduction.activity.observations.item1Title')}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{t('conduction.activity.observations.item1Body')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">2️⃣</span>
                      <div>
                        <p className="font-bold text-gray-800 text-sm sm:text-base">{t('conduction.activity.observations.item2Title')}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{t('conduction.activity.observations.item2Body')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <div>
                        <p className="font-bold text-gray-800 text-sm sm:text-base">{t('conduction.activity.observations.item3Title')}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{t('conduction.activity.observations.item3Body')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table 7.1 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl border-2 border-purple-200">
                <h4 className="font-bold text-purple-900 mb-4 text-base sm:text-lg">📊 {t('conduction.activity.table.title')}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-lg overflow-hidden shadow-md">
                    <thead className="bg-purple-100">
                      <tr>
                        <th className="p-3 text-left font-bold text-purple-900">{t('conduction.activity.table.pin')}</th>
                        <th className="p-3 text-left font-bold text-purple-900">{t('conduction.activity.table.order')}</th>
                        <th className="p-3 text-left font-bold text-purple-900">{t('conduction.activity.table.status')}</th>
                        <th className="p-3 text-left font-bold text-purple-900">{t('conduction.activity.table.reason')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pins.map((pin, index) => (
                        <tr key={pin.id} className={`border-t border-purple-200 ${index % 2 === 1 ? 'bg-purple-50' : ''}`}>
                          <td className="p-3 font-semibold">
                            {t('conduction.activity.pinCard.pinLabel')} ({pin.label})
                          </td>
                          <td className="p-3">{pin.fallOrder}</td>
                          <td className="p-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${fallenPins.includes(pin.id) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {fallenPins.includes(pin.id) ? t('conduction.activity.table.fallen') : t('conduction.activity.table.notFallen')}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {pin.fallOrder === 1
                              ? t('conduction.activity.table.reasonClosest')
                              : pin.fallOrder === 4
                              ? t('conduction.activity.table.reasonFarthest')
                              : t('conduction.activity.table.reasonProgress')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Material Testing - Drag & Drop */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-6 sm:mb-8">
          <button
            onClick={() => toggleSection('testing')}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white flex items-center justify-between hover:from-green-700 hover:to-emerald-700 transition"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <ThermometerSun className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">🎯 {t('conduction.testing.sectionTitle')}</h2>
            </div>
            {expandedSections.includes('testing') ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>

          {expandedSections.includes('testing') && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                <p className="text-sm font-semibold text-yellow-900">🖱️ {t('conduction.testing.callout')}</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-4 lg:gap-6 items-start">
                {/* Testing Visualization */}
                <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-slate-100 p-4 sm:p-6 rounded-xl border-2 border-gray-300">
                  <h4 className="font-bold text-gray-800 mb-4 text-sm sm:text-base md:text-lg text-center">{t('conduction.testing.zoneTitle')}</h4>

                  <div className="w-full overflow-x-auto">
                    <svg
                      ref={svgRef}
                      viewBox="0 0 500 400"
                      className="min-w-[360px] sm:min-w-[420px] w-full bg-white rounded-xl shadow-md"
                      onMouseMove={handleMaterialMouseMove}
                      onMouseUp={handleMaterialMouseUp}
                      onMouseLeave={handleMaterialMouseUp}
                      preserveAspectRatio="xMidYMid meet"
                    >
                    {/* Test zone indicator */}
                    <circle cx="230" cy="150" r="50" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="8,4" opacity="0.5" />
                    <text x="230" y="90" textAnchor="middle" className="text-xs font-bold" fill="#10B981">
                      {t('conduction.testing.dropHere')}
                    </text>

                    {/* Heat source */}
                    <g>
                      <circle cx="80" cy="150" r="35" fill="#FCD34D" opacity="0.3" className="animate-pulse" />
                      <circle cx="80" cy="150" r="25" fill="#F59E0B" opacity="0.5" className="animate-pulse" />
                      <Flame x="65" y="135" className="w-8 h-8 text-red-500" />
                      <text x="80" y="200" textAnchor="middle" className="text-xs font-bold" fill="#F59E0B">
                        {t('conduction.testing.heatSource')}
                      </text>
                    </g>

                    {/* Heat indicator */}
                    {materialInTest && (
                      <>
                        <line x1="115" y1="150" x2="180" y2="150" stroke="#F59E0B" strokeWidth="3" strokeDasharray="5,5" className="animate-pulse" />
                        <defs>
                          <marker id="arrow-heat" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                            <polygon points="0 0, 10 3, 0 6" fill="#F59E0B" />
                          </marker>
                        </defs>
                        <line x1="115" y1="150" x2="175" y2="150" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#arrow-heat)" className="animate-pulse" />
                      </>
                    )}

                    {/* Result indicator (right side) */}
                    {materialInTest && (
                      <>
                        {materials.find((m) => m.id === materialInTest)?.type === 'conductor' ? (
                          <>
                            <line x1="280" y1="150" x2="345" y2="150" stroke="#10B981" strokeWidth="3" strokeDasharray="5,5" className="animate-pulse" />
                            <line x1="285" y1="150" x2="345" y2="150" stroke="#10B981" strokeWidth="3" markerEnd="url(#arrow-success)" />
                            <defs>
                              <marker id="arrow-success" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                                <polygon points="0 0, 10 3, 0 6" fill="#10B981" />
                              </marker>
                            </defs>
                            <circle cx="380" cy="150" r="25" fill="#FCD34D" className="animate-pulse" />
                            <circle cx="380" cy="150" r="30" fill="#FBBF24" opacity="0.4" className="animate-ping" />
                            <text x="380" y="155" textAnchor="middle" className="text-2xl">
                              💡
                            </text>
                            <text x="380" y="190" textAnchor="middle" className="text-xs font-bold" fill="#10B981">
                              {t('conduction.testing.heatPasses')}
                            </text>
                          </>
                        ) : (
                          <>
                            <line x1="280" y1="150" x2="345" y2="150" stroke="#DC2626" strokeWidth="3" strokeDasharray="5,5" opacity="0.5" />
                            <text x="315" y="145" textAnchor="middle" className="text-2xl">
                              🚫
                            </text>
                            <circle cx="380" cy="150" r="25" fill="#6B7280" opacity="0.3" />
                            <text x="380" y="155" textAnchor="middle" className="text-2xl opacity-50">
                              💡
                            </text>
                            <text x="380" y="190" textAnchor="middle" className="text-xs font-bold" fill="#DC2626">
                              {t('conduction.testing.heatBlocked')}
                            </text>
                          </>
                        )}
                      </>
                    )}

                    {/* Draggable materials */}
                    {materials.map((material) => {
                      const pos = materialPositions[material.id] || { x: 0, y: 0 };
                      const isDragging = draggedMaterial === material.id;
                      const isInTest = materialInTest === material.id;

                      return (
                        <g
                          key={material.id}
                          transform={`translate(${pos.x}, ${pos.y})`}
                          onMouseDown={(e) => handleMaterialMouseDown(e as any, material.id)}
                          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                          className={isDragging ? 'opacity-80' : ''}
                        >
                          <rect
                            x="-35"
                            y="-15"
                            width="70"
                            height="30"
                            rx="5"
                            fill={material.color}
                            stroke={isInTest ? '#10B981' : '#333'}
                            strokeWidth={isInTest ? 3 : 2}
                            opacity="0.9"
                          />
                          <text
                            x="0"
                            y="5"
                            textAnchor="middle"
                            className="text-xs font-bold"
                            fill="white"
                            style={{ pointerEvents: 'none' }}
                          >
                            {material.emoji} {material.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  </div>
                </div>

                {/* Results Panel */}
                <div className="space-y-4">
                  {/* Material Info */}
                  {selectedMaterial && showMaterialResult && (
                    <div className="bg-white rounded-lg shadow-lg p-5 border-2 border-indigo-200">
                      <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        {t('conduction.testing.testResult.title')}
                      </h3>
                      {(() => {
                        const material = materials.find((m) => m.id === selectedMaterial);
                        if (!material) return null;
                        const isCondutor = material.type === 'conductor';

                        return (
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">{t('conduction.testing.testResult.material')}</p>
                              <p className="font-bold text-lg">
                                {material.emoji} {material.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">{t('conduction.testing.testResult.type')}</p>
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${isCondutor ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {isCondutor ? t('conduction.testing.testResult.good') : t('conduction.testing.testResult.poor')}
                              </span>
                            </div>
                            <div className={`p-3 rounded-lg ${isCondutor ? 'bg-green-50' : 'bg-red-50'}`}>
                              <p className="text-xs font-semibold mb-1">{isCondutor ? t('conduction.testing.testResult.heatPasses') : t('conduction.testing.testResult.heatStops')}</p>
                              <p className="text-xs text-gray-700">
                                {isCondutor ? t('conduction.testing.testResult.goodDesc') : t('conduction.testing.testResult.poorDesc')}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Quick Test Buttons */}
                  <div className="bg-white rounded-lg shadow-lg p-5">
                    <h4 className="font-bold text-gray-800 mb-3">{t('conduction.testing.quickTest')}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {materials.map((material) => (
                        <button
                          key={material.id}
                          onClick={() => testMaterial(material.id)}
                          className={`p-2 rounded-lg text-xs font-semibold border-2 transition-all ${
                            selectedMaterial === material.id ? 'bg-indigo-100 border-indigo-400 text-indigo-900' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {material.emoji} {material.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tested Materials */}
                  {testedMaterials.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-5">
                      <h4 className="font-bold text-gray-800 mb-3">
                        {t('conduction.testing.tested', { count: testedMaterials.length, total: materials.length })}
                      </h4>
                      <div className="space-y-2">
                        {testedMaterials.map((materialId) => {
                          const material = materials.find((m) => m.id === materialId);
                          if (!material) return null;
                          return (
                            <div key={materialId} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                              <span>
                                {material.emoji} {material.name}
                              </span>
                              <span className={`font-bold ${material.type === 'conductor' ? 'text-green-600' : 'text-red-600'}`}>{material.type === 'conductor' ? '✓' : '✗'}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary Card removed in Learn mode */}
      </div>
    </div>
  );
};

export default ConductionLearnModeInteractive;

