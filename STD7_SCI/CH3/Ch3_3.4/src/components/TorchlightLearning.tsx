import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Lightbulb, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type MaterialType = "conductor" | "insulator";

interface Material {
  id: string;
  label: string;
  type: MaterialType;
  color: string;
  description: string;
}

interface Position {
  x: number;
  y: number;
}

// Material definitions with realistic colors
const materials: Material[] = [
  { id: "iron", label: "Iron rod", type: "conductor", color: "#333333", description: "a metal that allows electricity to flow through it" },
  { id: "copper", label: "Copper rod", type: "conductor", color: "#C98A5A", description: "an excellent conductor of electricity" },
  { id: "graphite", label: "Pencil graphite", type: "conductor", color: "#808080", description: "the 'lead' in pencils, which conducts electricity" },
  { id: "wood", label: "Wood", type: "insulator", color: "#8B5A2B", description: "a natural material that does not conduct electricity" },
  { id: "plastic", label: "Plastic", type: "insulator", color: "#1E90FF", description: "a synthetic material that blocks electricity" },
  { id: "pencil", label: "Pencil", type: "insulator", color: "#FF3333", description: "the wooden body of a pencil, which does not conduct electricity" },
  { id: "rubber", label: "Rubber", type: "insulator", color: "#FF69B4", description: "used to cover wires because it stops electricity" },
  { id: "glass", label: "Glass", type: "insulator", color: "#87CEEB", description: "transparent material that does not conduct electricity" }
];

const GAP_POSITION = { x: 230, y: 150 };
const SNAP_DISTANCE = 40;

const ConductorInsulatorSimulation: React.FC = () => {
  const { t } = useLanguage();
  
  // State for material positions - initialized near the circuit gap
  const [materialPositions, setMaterialPositions] = useState<Record<string, Position>>(() => {
    const positions: Record<string, Position> = {};
    materials.forEach((material, index) => {
      // Arrange materials in two rows below the gap
      const row = Math.floor(index / 4);
      const col = index % 4;
      positions[material.id] = {
        x: 120 + col * 80,
        y: 270 + row * 50
      };
    });
    return positions;
  });

  const [draggedMaterial, setDraggedMaterial] = useState<Material | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [materialInGap, setMaterialInGap] = useState<Material | null>(null);
  const [prediction, setPrediction] = useState<MaterialType | null>(null);
  const [showPrediction, setShowPrediction] = useState<boolean>(false);
  const [testedMaterials, setTestedMaterials] = useState<Material[]>([]);
  const [showCurrentFlow, setShowCurrentFlow] = useState<boolean>(true);
  const [nearGap, setNearGap] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement>(null);

  const isBulbOn = materialInGap?.type === "conductor";

  // Convert screen coordinates to SVG coordinates
  const screenToSVG = useCallback((clientX: number, clientY: number): Position => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;

    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) return { x: 0, y: 0 };

    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(screenCTM.inverse());
    return { x: svgP.x, y: svgP.y };
  }, []);

  // Check if position is near the gap
  const isNearGap = useCallback((x: number, y: number): boolean => {
    const distance = Math.sqrt(
      Math.pow(x - GAP_POSITION.x, 2) + Math.pow(y - GAP_POSITION.y, 2)
    );
    return distance < SNAP_DISTANCE;
  }, []);

  // Handle mouse down on material
  const handleMouseDown = useCallback((e: React.MouseEvent, material: Material) => {
    e.preventDefault();
    const svgCoords = screenToSVG(e.clientX, e.clientY);
    const pos = materialPositions[material.id];
    setDraggedMaterial(material);
    setDragOffset({
      x: svgCoords.x - pos.x,
      y: svgCoords.y - pos.y
    });
  }, [materialPositions, screenToSVG]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggedMaterial) return;
    e.preventDefault();

    const svgCoords = screenToSVG(e.clientX, e.clientY);
    const newX = svgCoords.x - dragOffset.x;
    const newY = svgCoords.y - dragOffset.y;

    // Constrain within circuit area (with some padding)
    const constrainedX = Math.max(50, Math.min(450, newX));
    const constrainedY = Math.max(50, Math.min(370, newY));

    setMaterialPositions(prev => ({
      ...prev,
      [draggedMaterial.id]: { x: constrainedX, y: constrainedY }
    }));

    // Check if near gap for visual feedback
    setNearGap(isNearGap(constrainedX, constrainedY));
  }, [draggedMaterial, dragOffset, isNearGap, screenToSVG]);

  // Handle mouse up
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!draggedMaterial) return;
    e.preventDefault();

    const pos = materialPositions[draggedMaterial.id];

    // Check if should snap to gap
    if (isNearGap(pos.x, pos.y)) {
      // Snap to gap position
      setMaterialPositions(prev => ({
        ...prev,
        [draggedMaterial.id]: { x: GAP_POSITION.x, y: GAP_POSITION.y }
      }));

      // Set as active material in circuit
      if (materialInGap && materialInGap.id !== draggedMaterial.id) {
        // Move previous material away from gap
        setMaterialPositions(prev => ({
          ...prev,
          [materialInGap.id]: { x: prev[materialInGap.id].x + 60, y: prev[materialInGap.id].y + 40 }
        }));
      }

      setMaterialInGap(draggedMaterial);
      setPrediction(null);
      setShowPrediction(false);

      // Add to tested materials
      if (!testedMaterials.find(m => m.id === draggedMaterial.id)) {
        setTestedMaterials(prev => [...prev, draggedMaterial]);
      }
    } else {
      // If material was in gap and dragged away, remove it from circuit
      if (materialInGap && materialInGap.id === draggedMaterial.id) {
        setMaterialInGap(null);
        setPrediction(null);
        setShowPrediction(false);
      }
    }

    setDraggedMaterial(null);
    setNearGap(false);
  }, [draggedMaterial, materialPositions, isNearGap, materialInGap, testedMaterials]);

  useEffect(() => {
    if (draggedMaterial) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedMaterial, handleMouseMove, handleMouseUp]);

  const handlePrediction = (predictedType: MaterialType) => {
    if (!materialInGap) return;
    setPrediction(predictedType);
    setShowPrediction(true);
  };

  const resetSimulation = () => {
    // Reset all material positions to initial state
    const positions: Record<string, Position> = {};
    materials.forEach((material, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      positions[material.id] = {
        x: 120 + col * 80,
        y: 270 + row * 50
      };
    });
    setMaterialPositions(positions);
    setMaterialInGap(null);
    setPrediction(null);
    setShowPrediction(false);
    setDraggedMaterial(null);
    setTestedMaterials([]);
  };

  const isPredictionCorrect = prediction === materialInGap?.type;

  // Localization helpers for material labels/descriptions
  const getMat = useCallback((id: string) => materials.find(m => m.id === id)!, []);
  const getMatLabel = useCallback((id: string) => {
    const base = getMat(id);
    return t(`learn.materialNames.${id}`, { defaultValue: base.label });
  }, [getMat, t]);
  const getMatDescription = useCallback((id: string) => {
    const base = getMat(id);
    return t(`learn.materialDescriptions.${id}`, { defaultValue: base.description });
  }, [getMat, t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Circuit Visualization */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-indigo-900">{t('learn.circuitTestArea', { defaultValue: 'Circuit Test Area' })}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCurrentFlow(!showCurrentFlow)}
                  className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                >
                  {showCurrentFlow
                    ? t('learn.hideCurrent', { defaultValue: 'Hide Current' })
                    : t('learn.showCurrent', { defaultValue: 'Show Current' })}
                </button>
                <button
                  onClick={resetSimulation}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  {t('common.reset', { defaultValue: 'Reset' })}
                </button>
              </div>
            </div>

            {/* Circuit SVG */}
            <svg
              ref={svgRef}
              viewBox="0 0 500 370"
              className="w-full border-2 border-gray-200 rounded-lg bg-gray-50"
              style={{ cursor: draggedMaterial ? 'grabbing' : 'default' }}
            >
              {/* Battery */}
              <g transform="translate(80, 150)">
                <defs>
                  <linearGradient id="batteryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#2c3e50', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#34495e', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <rect x="-15" y="-35" width="30" height="70" rx="3" fill="url(#batteryGrad)" stroke="#1a252f" strokeWidth="2" />
                <rect x="-5" y="-42" width="10" height="7" rx="1" fill="#c0c0c0" stroke="#888" strokeWidth="1" />
                <text x="-15" y="-48" fontSize="16" fill="#e74c3c" fontWeight="bold" textAnchor="middle">+</text>
                <text x="-15" y="55" fontSize="16" fill="#3498db" fontWeight="bold" textAnchor="middle">−</text>
                <rect x="-8" y="-15" width="16" height="8" fill="#3498db" opacity="0.6" rx="1" />
                <rect x="-8" y="7" width="16" height="8" fill="#e74c3c" opacity="0.6" rx="1" />
                
                {/* Connection terminals */}
                <circle cx="0" cy="-35" r="3" fill="#D4AF37" stroke="#B87333" strokeWidth="1" />
                <circle cx="0" cy="35" r="3" fill="#D4AF37" stroke="#B87333" strokeWidth="1" />
              </g>

              {/* Wire from battery negative terminal to gap (bottom-left side) */}
              <line x1="80" y1="185" x2="80" y2="220" stroke="#B87333" strokeWidth="4" />
              <line x1="80" y1="185" x2="80" y2="220" stroke="#D4AF37" strokeWidth="2" />
              <line x1="80" y1="220" x2="180" y2="220" stroke="#B87333" strokeWidth="4" />
              <line x1="80" y1="220" x2="180" y2="220" stroke="#D4AF37" strokeWidth="2" />
              <line x1="180" y1="220" x2="180" y2="150" stroke="#B87333" strokeWidth="4" />
              <line x1="180" y1="220" x2="180" y2="150" stroke="#D4AF37" strokeWidth="2" />

              {/* Left terminal of gap */}
              <circle cx="180" cy="150" r="5" fill="#C0C0C0" stroke="#888" strokeWidth="2" />

              {/* Gap area with snap highlight */}
              <circle
                cx={GAP_POSITION.x}
                cy={GAP_POSITION.y}
                r={SNAP_DISTANCE}
                fill={nearGap ? "#4caf50" : "transparent"}
                opacity="0.1"
                stroke={nearGap ? "#4caf50" : "#ddd"}
                strokeWidth="2"
                strokeDasharray="5,5"
              />

              {/* Right terminal of gap */}
              <circle cx="280" cy="150" r="5" fill="#C0C0C0" stroke="#888" strokeWidth="2" />

              {/* Wire from gap to bulb */}
              <line x1="280" y1="150" x2="360" y2="150" stroke="#B87333" strokeWidth="4" />
              <line x1="280" y1="150" x2="360" y2="150" stroke="#D4AF37" strokeWidth="2" />
              <line x1="360" y1="150" x2="360" y2="80" stroke="#B87333" strokeWidth="4" />
              <line x1="360" y1="150" x2="360" y2="80" stroke="#D4AF37" strokeWidth="2" />

              {/* Bulb */}
              <g transform="translate(360, 80)">
                <defs>
                  <radialGradient id="bulbGrad">
                    <stop offset="0%" style={{ stopColor: isBulbOn ? '#FFFF00' : '#E0E0E0', stopOpacity: 1 }} />
                    <stop offset="70%" style={{ stopColor: isBulbOn ? '#FFA500' : '#C0C0C0', stopOpacity: 0.8 }} />
                    <stop offset="100%" style={{ stopColor: isBulbOn ? '#FF8C00' : '#A0A0A0', stopOpacity: 1 }} />
                  </radialGradient>
                </defs>

                {isBulbOn && (
                  <>
                    <circle cx="0" cy="0" r="35" fill="yellow" opacity="0.2" />
                    <circle cx="0" cy="0" r="40" fill="yellow" opacity="0.1" />
                    <circle cx="0" cy="0" r="45" fill="yellow" opacity="0.05" />
                  </>
                )}

                <circle cx="0" cy="0" r="25" fill="url(#bulbGrad)" stroke="#555" strokeWidth="2" />
                <path
                  d="M -8,-8 L -4,-4 L -8,0 L -4,4 L -8,8 M 8,-8 L 4,-4 L 8,0 L 4,4 L 8,8 M -4,-4 L 4,-4 M -4,4 L 4,4"
                  stroke={isBulbOn ? "#FF4500" : "#666"}
                  strokeWidth="2"
                  fill="none"
                />
                <rect x="-8" y="20" width="16" height="3" fill="#A0A0A0" />
                <rect x="-8" y="23" width="16" height="2" fill="#888" />
                <rect x="-8" y="25" width="16" height="3" fill="#A0A0A0" />
                <rect x="-6" y="28" width="12" height="4" fill="#777" />
              </g>

              {/* Wire from bulb back to battery positive terminal */}
              <line x1="360" y1="55" x2="360" y2="30" stroke="#B87333" strokeWidth="4" />
              <line x1="360" y1="55" x2="360" y2="30" stroke="#D4AF37" strokeWidth="2" />
              <line x1="360" y1="30" x2="80" y2="30" stroke="#B87333" strokeWidth="4" />
              <line x1="360" y1="30" x2="80" y2="30" stroke="#D4AF37" strokeWidth="2" />
              <line x1="80" y1="30" x2="80" y2="115" stroke="#B87333" strokeWidth="4" />
              <line x1="80" y1="30" x2="80" y2="115" stroke="#D4AF37" strokeWidth="2" />

              {/* Current flow animation */}
              {isBulbOn && showCurrentFlow && (
                <>
                  <circle r="4" fill="#FF6B6B" opacity="0.8">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M80,115 L80,30 L360,30 L360,55" />
                  </circle>
                  <circle r="4" fill="#FF6B6B" opacity="0.8">
                    <animateMotion dur="3s" repeatCount="indefinite" begin="1s" path="M360,80 L360,150 L280,150" />
                  </circle>
                  <circle r="4" fill="#FF6B6B" opacity="0.8">
                    <animateMotion dur="3s" repeatCount="indefinite" begin="2s" path="M180,150 L180,220 L80,220 L80,185" />
                  </circle>
                </>
              )}

              {/* Labels */}
              <text x="50" y="150" fontSize="13" fill="#2c3e50" textAnchor="middle" fontWeight="bold">{t('learn.cell', { defaultValue: 'Cell' })}</text>
              <text x="360" y="15" fontSize="13" fill="#2c3e50" textAnchor="middle" fontWeight="bold">{t('learn.bulb', { defaultValue: 'Bulb' })}</text>
              <text x="230" y="175" fontSize="11" fill="#666" textAnchor="middle" fontStyle="italic">
                {materialInGap
                  ? t('learn.connectionMade', { defaultValue: 'Connection Made' })
                  : t('learn.dragObjectHere', { defaultValue: '↓ Drag Object Here ↓' })}
              </text>

              {/* Instruction text */}
              <text x="250" y="245" fontSize="12" fill="#555" textAnchor="middle" fontWeight="bold">
                {t('learn.materialsToTest', { defaultValue: 'Materials to Test (Drag into circuit gap)' })}
              </text>

              {/* Draggable materials */}
              {materials.map((material) => {
                const pos = materialPositions[material.id];
                const isInGap = materialInGap?.id === material.id;
                const isDragging = draggedMaterial?.id === material.id;
                const localizedLabel = getMatLabel(material.id);

                return (
                  <g
                    key={material.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    onMouseDown={(e) => handleMouseDown(e, material)}
                    opacity={isDragging ? 0.7 : 1}
                  >
                    <defs>
                      <linearGradient id={`materialGrad-${material.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: material.color, stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: material.color, stopOpacity: 0.7 }} />
                      </linearGradient>
                    </defs>

                    {/* Material body */}
                    <rect
                      x="-30"
                      y="-12"
                      width="60"
                      height="24"
                      rx="3"
                      fill={`url(#materialGrad-${material.id})`}
                      stroke={isInGap ? "#4caf50" : "#333"}
                      strokeWidth={isInGap ? "3" : "2"}
                    />

                    {/* Highlight effect */}
                    <rect
                      x="-26"
                      y="-9"
                      width="18"
                      height="6"
                      rx="2"
                      fill="white"
                      opacity="0.4"
                    />

                    {/* Label */}
                    <text
                      x="0"
                      y="3"
                      fontSize="8"
                      fill="white"
                      textAnchor="middle"
                      fontWeight="bold"
                      style={{
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        pointerEvents: 'none'
                      }}
                    >
                      {localizedLabel.length > 10 ? localizedLabel.substring(0, 9) + '...' : localizedLabel}
                    </text>

                    {/* Connection indicator when in gap */}
                    {isInGap && (
                      <>
                        <line x1="-30" y1="0" x2="-50" y2="0" stroke="#4caf50" strokeWidth="3" />
                        <line x1="30" y1="0" x2="50" y2="0" stroke="#4caf50" strokeWidth="3" />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Prediction Section */}
            {materialInGap && !showPrediction && (
              <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                <p className="text-sm font-semibold text-yellow-900 mb-3">
                  {t('learn.makePrediction', { defaultValue: 'Make a Prediction: Will the {{label}} complete the circuit?', label: getMatLabel(materialInGap.id) })}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handlePrediction("conductor")}
                    className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                  >
                    {t('learn.predYesConduct', { defaultValue: 'Yes, it will conduct!' })}
                  </button>
                  <button
                    onClick={() => handlePrediction("insulator")}
                    className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
                  >
                    {t('learn.predNoInsulator', { defaultValue: "No, it's an insulator" })}
                  </button>
                </div>
              </div>
            )}

            {/* Prediction Result */}
            {materialInGap && showPrediction && (
              <div className={`mt-4 p-4 rounded-lg border-2 ${isPredictionCorrect
                  ? 'bg-green-50 border-green-400'
                  : 'bg-red-50 border-red-400'
                }`}>
                <p className="font-bold text-lg mb-2">
                  {isPredictionCorrect
                    ? t('learn.resultCorrect', { defaultValue: "That's Correct!" })
                    : t('learn.notQuite', { defaultValue: '❌ Not quite!' })}
                </p>
                <p className="text-sm">
                  {materialInGap && (
                    <>
                      {t('learn.isAType', { defaultValue: '{{label}} is a', label: getMatLabel(materialInGap.id) })} <strong>{materialInGap.type}</strong>. {getMatDescription(materialInGap.id)}
                      <br />
                      {isPredictionCorrect
                        ? t('learn.explainerOnAlt', { defaultValue: 'Because it allows electrons to flow, the loop is closed and the bulb lights up! 💡' })
                        : t('learn.explainerOffAlt', { defaultValue: 'Because it blocks electron flow, the circuit remains broken and the bulb stays off. 🚫' })}
                    </>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Information Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <Info size={20} />
                {t('learn.information', { defaultValue: 'Information' })}
              </h2>

              {materialInGap ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('learn.materialInCircuit', { defaultValue: 'Material in Circuit:' })}</p>
                    <p className="font-bold text-lg text-indigo-900">{getMatLabel(materialInGap.id)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('learn.type', { defaultValue: 'Type:' })}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${materialInGap.type === "conductor"
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {materialInGap.type === "conductor"
                        ? t('learn.conductor', { defaultValue: '⚡ Conductor' })
                        : t('learn.insulator', { defaultValue: '🚫 Insulator' })}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('learn.bulbStatus', { defaultValue: 'Bulb Status:' })}</p>
                    <div className="flex items-center gap-2">
                      <Lightbulb size={20} className={isBulbOn ? "text-yellow-500" : "text-gray-400"} />
                      <span className={`font-semibold ${isBulbOn ? "text-green-600" : "text-gray-500"}`}>
                        {isBulbOn
                          ? t('learn.onGlowing', { defaultValue: 'ON (Glowing ✨)' })
                          : t('learn.offNotGlowing', { defaultValue: 'OFF (Not glowing)' })}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                      <strong>{getMatLabel(materialInGap.id)}</strong> {t('learn.isDescription', { defaultValue: 'is' })} {getMatDescription(materialInGap.id)}.
                      {isBulbOn
                        ? t('learn.explainerOn', { defaultValue: ' It allows electric current to pass through, so the bulb glows!' })
                        : t('learn.explainerOff', { defaultValue: ' It does not allow electric current to pass through, so the bulb stays off.' })}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  {t('learn.dragMaterialToTest', { defaultValue: '👆 Drag a material into the circuit gap to test if it conducts electricity!' })}
                </p>
              )}
            </div>

            {/* Tested Materials Table */}
            {testedMaterials.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-indigo-900 mb-3">{t('learn.testResults', { defaultValue: 'Test Results' })}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-2 px-2">{t('learn.material', { defaultValue: 'Material' })}</th>
                        <th className="text-center py-2 px-2">{t('learn.typeHeader', { defaultValue: 'Type' })}</th>
                        <th className="text-center py-2 px-2">{t('learn.bulbHeader', { defaultValue: 'Bulb' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testedMaterials.map((material) => (
                        <tr key={material.id} className="border-b border-gray-100">
                          <td className="py-2 px-2">{getMatLabel(material.id)}</td>
                          <td className="text-center py-2 px-2">
                            <span className={`text-xs px-2 py-1 rounded ${material.type === "conductor" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}>
                              {material.type === "conductor" ? "C" : "I"}
                            </span>
                          </td>
                          <td className="text-center py-2 px-2">
                            {material.type === "conductor" ? "✓" : "✗"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={() => setTestedMaterials([])}
                  className="mt-3 w-full py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                >
                  {t('learn.clearResults', { defaultValue: 'Clear Results' })}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConductorInsulatorSimulation;
